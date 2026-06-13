import type { AnalyzeApiInput, ChatApiInput } from './schema';
import { sanitize } from './sanitize';
import {
  CHAT_HISTORY_WINDOW,
  CHAT_WORD_LIMIT,
  CRISIS_PHONE,
  MAX_MESSAGE_LENGTH,
  MS_PER_DAY,
} from './constants';
import type { UserProfile } from './types';

/**
 * Renders an optional profile into a short context line for prompts.
 * @param profile - The user's onboarding profile (name, exam type, exam date, concern)
 * @param now - Current timestamp in milliseconds for calculating days until exam
 * @returns Formatted profile context string for the prompt, empty if profile is missing
 */
function profileLine(profile?: UserProfile, now?: number): string {
  if (!profile) return '';
  const days =
    now === undefined
      ? ''
      : ` They have ${Math.max(
          0,
          Math.ceil((new Date(profile.examDate).getTime() - now) / MS_PER_DAY)
        )} days until the exam.`;
  return `\nStudent: ${sanitize(profile.name, 60)} preparing for ${
    profile.examType
  }. Primary concern: ${profile.primaryConcern}.${days}`;
}

/**
 * Build the analysis prompt sent to Gemini. Embeds the (sanitized) journal,
 * mood/stress signals, exam context, and trend, and requires a strict JSON
 * response shape.
 * @param input - The analyze API input containing journal, mood, stress, exam type, and past trend
 * @param profile - Optional user profile to contextualize the analysis
 * @param now - Current timestamp for calculating days until exam
 * @returns Complete analysis prompt string ready for Gemini
 */
export function buildAnalysisPrompt(
  input: AnalyzeApiInput,
  profile?: UserProfile,
  now?: number
): string {
  return `You are a compassionate mental wellness coach for high-stakes exam aspirants.
Analyze the journal entry and past trend, referencing the exam explicitly.${profileLine(
    profile,
    now
  )}

Exam type: ${sanitize(input.examType, 10)}
Mood (1-5): ${input.mood}
Stress (1-5): ${input.stress}
Study hours: ${input.studyHours}
Journal: ${sanitize(input.journal)}
Past trend: ${JSON.stringify(input.pastTrend)}

Return only valid JSON with keys: summary, dominantEmotion, riskLevel (one of "low" | "moderate" | "high"), stressTriggers (array), patterns (array), copingStrategies (array), motivationalMessage, nextAction.`;
}

/**
 * Build the companion chat prompt. Includes the last
 * {@link CHAT_HISTORY_WINDOW} turns for continuity and, for high-risk users,
 * the crisis helpline.
 * @param input - The chat API input containing message, history, and risk level
 * @param profile - Optional user profile to personalize the response
 * @param now - Current timestamp for calculating days until exam
 * @returns Complete chat prompt string ready for Gemini streaming
 */
export function buildChatPrompt(
  input: ChatApiInput,
  profile?: UserProfile,
  now?: number
): string {
  const history = (input.history ?? []).slice(-CHAT_HISTORY_WINDOW);
  const transcript = history
    .map(
      turn =>
        `${turn.sender === 'aarav' ? 'Aarav' : 'User'}: ${sanitize(
          turn.text,
          MAX_MESSAGE_LENGTH
        )}`
    )
    .join('\n');
  const crisisNote =
    input.riskLevel === 'high'
      ? ` If they are in crisis, gently share the iCall helpline: ${CRISIS_PHONE}.`
      : '';
  return `You are Aarav, a warm senior who cleared the same exam. Respond in ${CHAT_WORD_LIMIT} words or less, grounded in the user's feelings.${crisisNote}${profileLine(
    profile,
    now
  )}
${transcript ? `\nConversation so far:\n${transcript}\n` : ''}
User: ${sanitize(input.message, MAX_MESSAGE_LENGTH)}`;
}
