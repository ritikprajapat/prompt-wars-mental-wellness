export type ExamType = "NEET" | "JEE" | "CUET" | "CAT" | "GATE" | "UPSC";

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
  riskLevel: "low" | "moderate" | "high";
  stressTriggers: string[];
  patterns: string[];
  copingStrategies: string[];
  motivationalMessage: string;
  nextAction: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "aarav";
  text: string;
  timestamp: string;
}

export interface AnalyzeApiInput {
  examType: ExamType;
  mood: number;
  stress: number;
  studyHours: number;
  journal: string;
  pastTrend: Array<{ date: string; mood: number; stress: number }>;
}

export interface ChatApiInput {
  message: string;
  riskLevel: "low" | "moderate" | "high";
}
