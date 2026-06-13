import { AnalyzeApiInput, ChatApiInput } from "./schema";
import { sanitize } from "./sanitize";
import { CRISIS_PHONE } from "./constants";

export function buildAnalysisPrompt(input: AnalyzeApiInput) {
  return `You are a compassionate mental wellness coach. Analyze the journal entry and past trend.
Return only valid JSON with keys: summary, dominantEmotion, riskLevel, stressTriggers, patterns, copingStrategies, motivationalMessage, nextAction.

Exam type: ${sanitize(input.examType)}
Mood: ${input.mood}
Stress: ${input.stress}
Study hours: ${input.studyHours}
Journal: ${sanitize(input.journal)}
Past trend: ${JSON.stringify(input.pastTrend)}`;
}

export function buildChatPrompt(input: ChatApiInput) {
  const crisisNote =
    input.riskLevel === "high" ? ` Mention iCall: ${CRISIS_PHONE}.` : "";
  return `You are Aarav, a warm senior who cleared the same exam. Respond in 100 words or less, grounded in the user's feelings.${crisisNote}
User: ${sanitize(input.message)}`;
}
