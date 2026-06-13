import { z } from 'zod';
import {
  MAX_CHAT_HISTORY,
  MAX_JOURNAL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MIN_JOURNAL_LENGTH,
  MOOD_MAX,
  MOOD_MIN,
  STRESS_MAX,
  STRESS_MIN,
  STUDY_HOURS_MAX,
  STUDY_HOURS_MIN,
  TREND_DAYS,
} from './constants';

const examTypeSchema = z.enum(['NEET', 'JEE', 'CUET', 'CAT', 'GATE', 'UPSC']);

/** Optional onboarding profile attached to API requests for personalization. */
export const profileSchema = z.object({
  name: z.string().min(1).max(60),
  examType: examTypeSchema,
  examDate: z.string(),
  primaryConcern: z.enum(['stress', 'burnout', 'motivation']),
});
const moodSchema = z.number().int().min(MOOD_MIN).max(MOOD_MAX);
const stressSchema = z.number().int().min(STRESS_MIN).max(STRESS_MAX);

/** Validates a persisted journal entry. */
export const journalEntrySchema = z.object({
  id: z.string().uuid().optional(),
  examType: examTypeSchema,
  mood: moodSchema,
  stress: stressSchema,
  studyHours: z.number().min(STUDY_HOURS_MIN).max(STUDY_HOURS_MAX),
  journal: z.string().min(MIN_JOURNAL_LENGTH).max(MAX_JOURNAL_LENGTH),
  date: z.string().datetime().optional(),
});

/** Validates a single chat message record. */
export const chatMessageSchema = z.object({
  id: z.string().uuid().optional(),
  sender: z.enum(['user', 'aarav']),
  text: z.string().min(1).max(MAX_MESSAGE_LENGTH),
  timestamp: z.string().datetime().optional(),
});

/** Validates the `/api/analyze` request body. */
export const analyzeApiSchema = z.object({
  examType: examTypeSchema,
  mood: moodSchema,
  stress: stressSchema,
  studyHours: z.number().min(STUDY_HOURS_MIN).max(STUDY_HOURS_MAX),
  journal: z.string().min(MIN_JOURNAL_LENGTH).max(MAX_JOURNAL_LENGTH),
  pastTrend: z
    .array(
      z.object({
        date: z.string(),
        mood: moodSchema,
        stress: stressSchema,
      })
    )
    .length(TREND_DAYS),
  profile: profileSchema.optional(),
});

/** Validates the `/api/chat` request body. */
export const chatApiSchema = z.object({
  message: z.string().min(1).max(MAX_MESSAGE_LENGTH),
  riskLevel: z.enum(['low', 'moderate', 'high']),
  history: z
    .array(
      z.object({
        sender: z.enum(['user', 'aarav']),
        text: z.string().min(1).max(MAX_MESSAGE_LENGTH),
      })
    )
    .max(MAX_CHAT_HISTORY)
    .default([]),
  profile: profileSchema.optional(),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type AnalyzeApiInput = z.infer<typeof analyzeApiSchema>;
export type ChatApiInput = z.infer<typeof chatApiSchema>;
