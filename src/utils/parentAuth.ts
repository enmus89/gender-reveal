import { verifyPin, changePin } from './sheetApi';

export const STORAGE_KEY = 'gender_reveal_parent_pin';

export function getStoredParentPin(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveParentPinToStorage(pin: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, pin);
    localStorage.setItem(STORAGE_KEY, pin);
  } catch (e) {
    console.error('Error saving parent PIN to storage:', e);
  }
}

export function removeParentPinFromStorage(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error removing parent PIN from storage:', e);
  }
}

export async function verifyParentPinApi(pin: string): Promise<{ success: boolean; error?: string }> {
  const res = await verifyPin(pin);
  if (res.success) {
    saveParentPinToStorage(pin.trim());
    return { success: true };
  }
  return { success: false, error: res.error || 'Invalid parent PIN' };
}

export async function changeParentPinApi(currentPin: string, newPin: string): Promise<{ success: boolean; error?: string }> {
  const res = await changePin(currentPin, newPin);
  if (res.success) {
    saveParentPinToStorage(newPin.trim());
    return { success: true };
  }
  return { success: false, error: res.error || 'Failed to update PIN' };
}
