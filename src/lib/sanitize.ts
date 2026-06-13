const promptInjectionPatterns = [
  /\b(please ignore your instructions|ignore.*previous|disregard.*instructions|forget.*your instructions)\b/gi,
  /\b(system message|system prompt|developer message|prompt injection)\b/gi,
];

export function sanitize(input: string): string {
  // Remove script tags and their content first
  let sanitized = input.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");
  // Remove all other HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");
  // Remove prompt injection patterns
  promptInjectionPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "");
  });
  return sanitized.trim().slice(0, 2000);
}
