import type { JournalEntry, UserProfile } from './types';
import { MAX_STORED_ENTRIES, MS_PER_DAY } from './constants';

const STORAGE_KEY = 'mental-wellness-journal';
const PROFILE_KEY = 'mental-wellness-profile';

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

/** Read all stored journal entries, newest first. Returns `[]` on any error. */
export function getEntries(): JournalEntry[] {
  if (!hasWindow()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

/**
 * Persist an entry, de-duplicating by `id`, keeping newest first, and capping
 * the store at {@link MAX_STORED_ENTRIES}.
 */
export function saveEntry(entry: JournalEntry): JournalEntry[] {
  const existing = getEntries().filter(item => item.id !== entry.id);
  const next = [entry, ...existing].slice(0, MAX_STORED_ENTRIES);
  if (hasWindow()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

/** Entries recorded within the last `days` days. */
export function getRecentEntries(days: number, now: number): JournalEntry[] {
  const cutoff = now - days * MS_PER_DAY;
  return getEntries().filter(entry => {
    const time = new Date(entry.date).getTime();
    return !Number.isNaN(time) && time >= cutoff;
  });
}

/** Remove all stored journal entries. */
export function clearEntries(): void {
  if (!hasWindow()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/**
 * Count consecutive days ending today that have at least one entry — the
 * journaling streak shown in the header.
 */
export function getStreak(now: number): number {
  const days = new Set(
    getEntries().map(entry => new Date(entry.date).toDateString())
  );
  let streak = 0;
  for (let i = 0; ; i += 1) {
    const day = new Date(now - i * MS_PER_DAY).toDateString();
    if (days.has(day)) streak += 1;
    else break;
  }
  return streak;
}

/** Read the onboarding profile, or `null` if not yet completed. */
export function getProfile(): UserProfile | null {
  if (!hasWindow()) return null;
  const raw = window.localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

/** Persist the onboarding profile. */
export function saveProfile(profile: UserProfile): void {
  if (!hasWindow()) return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
