export type ExamType = 'NEET' | 'JEE' | 'CUET' | 'CAT' | 'GATE' | 'UPSC';

/** Burnout risk classification returned by the analysis model. */
export type RiskLevel = 'low' | 'moderate' | 'high';

/** What primarily brings an aspirant to the app, captured at onboarding. */
export type PrimaryConcern = 'stress' | 'burnout' | 'motivation';

export interface JournalEntry {
  id: string;
  examType: ExamType;
  mood: number;
  stress: number;
  studyHours: number;
  journal: string;
  date: string;
}

export interface AnalysisResult {
  summary: string;
  dominantEmotion: string;
  riskLevel: RiskLevel;
  stressTriggers: string[];
  patterns: string[];
  copingStrategies: string[];
  motivationalMessage: string;
  nextAction: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aarav';
  text: string;
  timestamp: string;
}

/** Single prior turn supplied to the chat API for context. */
export interface ChatHistoryItem {
  sender: 'user' | 'aarav';
  text: string;
}

/** Onboarding profile persisted to local storage and injected into prompts. */
export interface UserProfile {
  name: string;
  examType: ExamType;
  examDate: string;
  primaryConcern: PrimaryConcern;
}

export interface TrendPoint {
  date: string;
  mood: number;
  stress: number;
}
