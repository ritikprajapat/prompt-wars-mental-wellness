import type { ExamType } from './types';

/** Gemini model identifier used for analysis and chat. */
export const GEMINI_MODEL = 'gemini-2.0-flash';

/** Base URL for the Gemini generative language REST API. */
export const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

/** iCall psychosocial helpline number, surfaced on high-risk results. */
export const CRISIS_PHONE = '9152987821';

/** Exam types supported across onboarding, journaling, and AI prompts. */
export const EXAM_TYPES: readonly ExamType[] = [
  'NEET',
  'JEE',
  'CUET',
  'CAT',
  'GATE',
  'UPSC',
] as const;

/** Inclusive bounds for the 1–5 mood scale. */
export const MOOD_MIN = 1;
export const MOOD_MAX = 5;

/** Inclusive bounds for the 1–5 stress scale. */
export const STRESS_MIN = 1;
export const STRESS_MAX = 5;

/** Inclusive bounds for self-reported daily study hours. */
export const STUDY_HOURS_MIN = 0;
export const STUDY_HOURS_MAX = 24;

/** Journal free-text length bounds (characters). */
export const MIN_JOURNAL_LENGTH = 10;
export const MAX_JOURNAL_LENGTH = 2000;

/** Companion chat message length bound (characters). */
export const MAX_MESSAGE_LENGTH = 500;

/** Maximum chat history items accepted by the chat API. */
export const MAX_CHAT_HISTORY = 50;

/** Number of most-recent history messages injected into the chat prompt. */
export const CHAT_HISTORY_WINDOW = 10;

/** Word ceiling requested of the companion in chat replies. */
export const CHAT_WORD_LIMIT = 100;

/** Number of trailing days represented in the mood/stress trend. */
export const TREND_DAYS = 7;

/** Minimum entries required before pattern detection is shown. */
export const PATTERN_MIN_ENTRIES = 3;

/** Maximum journal entries retained in local storage. */
export const MAX_STORED_ENTRIES = 90;

/** Fixed-window rate-limit settings, per client, per route. */
export const RATE_WINDOW_MS = 60_000;
export const ANALYZE_RATE_LIMIT = 10;
export const CHAT_RATE_LIMIT = 20;

/** Maximum accepted request body size (bytes) before returning 413. */
export const MAX_BODY_BYTES = 10_000;

/** Debounce delay (ms) for journal textarea state updates. */
export const DEBOUNCE_MS = 300;

/** Milliseconds in a single day. */
export const MS_PER_DAY = 86_400_000;

/** Weighting applied to mood vs. (inverted) stress in the wellness score. */
export const MOOD_WEIGHT = 0.6;
export const STRESS_WEIGHT = 0.4;

/** Wellness score range. */
export const SCORE_MIN = 0;
export const SCORE_MAX = 100;
