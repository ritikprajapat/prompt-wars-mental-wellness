import {
  MOOD_MAX,
  MOOD_MIN,
  MOOD_WEIGHT,
  MS_PER_DAY,
  SCORE_MAX,
  SCORE_MIN,
  STRESS_MAX,
  STRESS_WEIGHT,
} from './constants';
import type { JournalEntry, RiskLevel } from './types';

/**
 * Clamp a number into the inclusive `[min, max]` range.
 * @param value - The number to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format an ISO date string as a short, human-readable label
 * (e.g. "13 Jun 2026"). Falls back to the raw input if unparseable.
 * @param iso - ISO 8601 date string
 * @returns Formatted date label in en-IN locale
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Whole days from `now` until the given exam date. Negative values mean the
 * date has passed; clamped to a non-negative count for display.
 * @param examIso - ISO 8601 exam date string
 * @param now - Current timestamp in milliseconds
 * @returns Non-negative count of whole days until exam date
 */
export function daysUntil(examIso: string, now: number): number {
  const target = new Date(examIso).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.max(0, Math.ceil((target - now) / MS_PER_DAY));
}

/**
 * Count consecutive calendar days ending today that have at least one journal
 * entry. Accepts entries directly so callers can batch storage reads.
 * @param entries - Array of journal entries
 * @param now - Current timestamp in milliseconds
 * @returns Count of consecutive days with entries, starting from today
 */
export function calcStreak(entries: JournalEntry[], now: number): number {
  const days = new Set(
    entries.map(entry => new Date(entry.date).toDateString())
  );
  let streak = 0;
  for (let i = 0; ; i += 1) {
    const day = new Date(now - i * MS_PER_DAY).toDateString();
    if (!days.has(day)) break;
    streak += 1;
  }
  return streak;
}

/**
 * Weighted wellness score (0–100) combining high mood and low stress.
 * Both inputs are expected on the 1–5 scale; the result is clamped.
 * @param mood - Mood value on 1–5 scale
 * @param stress - Stress value on 1–5 scale
 * @returns Computed wellness score clamped to [0, 100]
 */
export function calcWeightedScore(mood: number, stress: number): number {
  const moodPct =
    (clamp(mood, MOOD_MIN, MOOD_MAX) - MOOD_MIN) / (MOOD_MAX - MOOD_MIN);
  const calmPct =
    (STRESS_MAX - clamp(stress, MOOD_MIN, STRESS_MAX)) /
    (STRESS_MAX - MOOD_MIN);
  const score = (moodPct * MOOD_WEIGHT + calmPct * STRESS_WEIGHT) * SCORE_MAX;
  return clamp(Math.round(score), SCORE_MIN, SCORE_MAX);
}

/**
 * Tailwind text-color class for a given risk level.
 * @param level - The burnout risk level
 * @returns Tailwind CSS class name for color
 */
export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: 'text-emerald-600',
    moderate: 'text-amber-600',
    high: 'text-rose-600',
  };
  return colors[level];
}

/**
 * Human-friendly label for a given risk level.
 * @param level - The burnout risk level
 * @returns Readable label
 */
export function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: 'Low burnout risk',
    moderate: 'Moderate burnout risk',
    high: 'High burnout risk',
  };
  return labels[level];
}

/**
 * Emoji for a 1–5 mood value; clamps out-of-range input to the nearest.
 * @param mood - Mood value on 1–5 scale
 * @returns Emoji representing the mood
 */
export function getMoodEmoji(mood: number): string {
  const emojis = ['😔', '🙁', '😐', '🙂', '😄'] as const;
  const index = clamp(Math.round(mood), MOOD_MIN, MOOD_MAX) - 1;
  return emojis[index] ?? '😐';
}
