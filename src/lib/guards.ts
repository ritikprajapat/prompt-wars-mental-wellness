import type { AnalysisResult, ChatMessage, ExamType, RiskLevel } from './types';
import { EXAM_TYPES } from './constants';

/** True when `value` is one of the three supported risk levels. */
export function isRiskLevel(value: unknown): value is RiskLevel {
  return value === 'low' || value === 'moderate' || value === 'high';
}

/** True when `value` is a supported exam type. */
export function isExamType(value: unknown): value is ExamType {
  return (
    typeof value === 'string' &&
    (EXAM_TYPES as readonly string[]).includes(value)
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

/** Structural type guard for an {@link AnalysisResult} payload. */
export function isAnalysisResult(value: unknown): value is AnalysisResult {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.summary === 'string' &&
    typeof v.dominantEmotion === 'string' &&
    isRiskLevel(v.riskLevel) &&
    isStringArray(v.stressTriggers) &&
    isStringArray(v.patterns) &&
    isStringArray(v.copingStrategies) &&
    typeof v.motivationalMessage === 'string' &&
    typeof v.nextAction === 'string'
  );
}

/** Structural type guard for a {@link ChatMessage}. */
export function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    (v.sender === 'user' || v.sender === 'aarav') &&
    typeof v.text === 'string' &&
    typeof v.timestamp === 'string'
  );
}
