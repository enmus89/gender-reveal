import { ParticipantSubmission, QuizStats } from '../types';

/**
 * Client for the Google Apps Script web app that stores guesses in a Google Sheet.
 * The deployed web-app URL is injected at build time via VITE_SHEET_API_URL.
 *
 * All POST requests send a plain-text body (no custom headers) so the browser
 * treats them as "simple" requests and skips the CORS preflight, which Apps
 * Script web apps do not answer.
 */
const API_URL: string = import.meta.env.VITE_SHEET_API_URL || '';

export const isSheetApiConfigured = (): boolean => Boolean(API_URL);

const EMPTY_STATS: QuizStats = {
  total: 0,
  boyVotes: 0,
  girlVotes: 0,
  boyPercentage: 0,
  girlPercentage: 0,
};

async function post<T>(payload: Record<string, unknown>): Promise<T> {
  if (!API_URL) throw new Error('Results service is not configured');
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Request failed');
  }
  return data as T;
}

async function get<T>(params: Record<string, string>): Promise<T> {
  if (!API_URL) throw new Error('Results service is not configured');
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}?${qs}`);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Request failed');
  }
  return data as T;
}

export interface SubmitInput {
  name: string;
  relationship: string;
  choice: 'boy' | 'girl';
  message: string;
}

export async function submitGuess(
  input: SubmitInput,
): Promise<{ submission: ParticipantSubmission; stats: QuizStats }> {
  return post({ action: 'submit', ...input });
}

export interface ScoreboardResult {
  authorized: boolean;
  submissions: ParticipantSubmission[];
  stats: QuizStats;
}

export async function getScoreboard(pin?: string): Promise<ScoreboardResult> {
  try {
    const data = await get<ScoreboardResult>({
      action: 'list',
      pin: pin || '',
    });
    return {
      authorized: Boolean(data.authorized),
      submissions: data.submissions || [],
      stats: data.stats || EMPTY_STATS,
    };
  } catch (err) {
    console.error('getScoreboard failed:', err);
    return { authorized: false, submissions: [], stats: EMPTY_STATS };
  }
}

export async function verifyPin(pin: string): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await get<{ success: boolean; error?: string }>({
      action: 'verifyPin',
      pin: pin.trim(),
    });
    return { success: Boolean(data.success), error: data.error };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection error' };
  }
}

export async function changePin(
  currentPin: string,
  newPin: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await post({
      action: 'changePin',
      currentPin: currentPin.trim(),
      newPin: newPin.trim(),
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update PIN' };
  }
}

export async function deleteSubmission(
  id: string,
  pin: string,
): Promise<{ stats: QuizStats }> {
  return post({ action: 'delete', id, pin: pin.trim() });
}

export async function clearAllSubmissions(pin: string): Promise<{ stats: QuizStats }> {
  return post({ action: 'clearAll', pin: pin.trim() });
}
