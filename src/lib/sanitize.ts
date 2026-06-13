import { MAX_JOURNAL_LENGTH } from './constants';

/**
 * Prompt-injection patterns stripped from every user-supplied string before it
 * reaches the model. Defends against role-override and jailbreak attempts.
 */
const promptInjectionPatterns: readonly RegExp[] = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+instructions/gi,
  /\b(?:please\s+)?(ignore|disregard|forget|override|bypass)\b[^.\n]{0,40}?\b(instructions?|prompts?|rules?|previous|prior|above|context|system)\b/gi,
  /you\s+are\s+now/gi,
  /forget\s+(your\s+)?(role|instructions|prompt)/gi,
  /system\s*:/gi,
  /\[INST\]/gi,
  /<\|.*?\|>/gi,
  /###\s*instruction/gi,
  /\b(system|developer)\s+(message|prompt|instructions?)\b/gi,
  /\bprompt\s+injection\b/gi,
  /\bact\s+as\s+(an?\s+)?(?:dan|jailbreak|unfiltered|unrestricted)\b/gi,
];

/**
 * Strip HTML, neutralize prompt-injection phrasing, collapse whitespace, and
 * bound the length of a user-supplied string.
 *
 * @param input  Raw user input.
 * @param maxLen Maximum returned length (defaults to the journal cap).
 * @returns A sanitized, length-bounded string safe to embed in a prompt.
 */
export function sanitize(input: string, maxLen = MAX_JOURNAL_LENGTH): string {
  // Remove script tags and their content first.
  let sanitized = input.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');
  // Remove all other HTML tags and stray angle brackets.
  sanitized = sanitized.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  // Neutralize prompt-injection patterns.
  for (const pattern of promptInjectionPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }
  // Replace double quotes with single quotes to avoid breaking JSON framing.
  sanitized = sanitized.replace(/"/g, "'");
  // Collapse whitespace, trim, then bound the length.
  return sanitized
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .slice(0, maxLen);
}
