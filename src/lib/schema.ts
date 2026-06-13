import { z } from "zod";
import { ExamType } from "./types";

export const journalEntrySchema = z.object({
  id: z.string().uuid().optional(),
  examType: z.enum(["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC"]),
  mood: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  studyHours: z.number().min(0).max(24),
  journal: z.string().max(2000),
  date: z.string().datetime().optional(),
});

export const chatMessageSchema = z.object({
  id: z.string().uuid().optional(),
  sender: z.enum(["user", "aarav"]),
  text: z.string().min(1).max(1000),
  timestamp: z.string().datetime().optional(),
});

export const analyzeApiSchema = z.object({
  examType: z.enum(["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC"]),
  mood: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  studyHours: z.number().min(0).max(24),
  journal: z.string().max(2000),
  pastTrend: z
    .array(
      z.object({
        date: z.string(),
        mood: z.number().int().min(1).max(5),
        stress: z.number().int().min(1).max(5),
      }),
    )
    .length(7),
});

export const chatApiSchema = z.object({
  message: z.string().min(1).max(1000),
  riskLevel: z.enum(["low", "moderate", "high"]),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type AnalyzeApiInput = z.infer<typeof analyzeApiSchema>;
export type ChatApiInput = z.infer<typeof chatApiSchema>;
