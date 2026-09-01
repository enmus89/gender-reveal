export type GuessChoice = 'boy' | 'girl';
export type Language = 'en' | 'sq';

export interface ParticipantSubmission {
  id: string;
  name: string;
  relationship?: string;
  choice: GuessChoice;
  timestamp: number;
  message?: string;
  isCorrect: boolean;
}

export interface QuizStats {
  total: number;
  boyVotes: number;
  girlVotes: number;
  boyPercentage: number;
  girlPercentage: number;
}

export type QuizStage = 
  | 'welcome'        // Page 1: Enter Name
  | 'choice'         // Page 2: Choose Boy or Girl
  | 'confirm'        // Page 3: Are you sure? Confirm choice
  | 'ready'          // Page 4: Ready to reveal? Click here
  | 'reveal'         // Page 5: REVEAL! Blue fireworks, smoke & score summary
;
