const promptInjectionPatterns = [
  // "ignore / disregard / forget / override … instructions / prompt / rules / context"
  /\b(?:please\s+)?(ignore|disregard|forget|override|bypass)\b[^.\n]{0,40}?\b(instructions?|prompts?|rules?|previous|prior|above|context|system)\b/gi,
  /\b(system|developer)\s+(message|prompt|instructions?)\b/gi,
  /\bprompt\s+injection\b/gi,
  // Role-play / jailbreak framings
  /\byou\s+are\s+now\b/gi,
  /\bact\s+as\s+(an?\s+)?(?:dan|jailbreak|unfiltered|unrestricted)\b/gi,
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
  // Collapse whitespace left behind by removals, then bound the length.
  return sanitized.replace(/[ \t]{2,}/g, " ").trim().slice(0, 2000);
}
