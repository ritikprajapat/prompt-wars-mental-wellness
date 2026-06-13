import { JournalEntry } from "./types";

const STORAGE_KEY = "mental-wellness-journal";

export function getEntries(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JournalEntry[];
  } catch {
    return [];
  }
}

export function saveEntry(entry: JournalEntry): JournalEntry[] {
  const existing = getEntries();
  const next = [entry, ...existing].slice(0, 30);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearEntries(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
