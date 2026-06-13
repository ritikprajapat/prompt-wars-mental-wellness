import {
  getEntries,
  saveEntry,
  clearEntries,
  getRecentEntries,
  getStreak,
  getProfile,
  saveProfile,
} from '@/lib/storage';
import type { JournalEntry, UserProfile } from '@/lib/types';

describe('storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('entries', () => {
    it('saves and retrieves entries', () => {
      const entry: JournalEntry = {
        id: '1',
        examType: 'NEET',
        mood: 3,
        stress: 2,
        studyHours: 4,
        journal: 'Test',
        date: '2026-06-13',
      };
      saveEntry(entry);
      expect(getEntries()).toEqual([entry]);
    });

    it('keeps newest entries first', () => {
      const entry1: JournalEntry = {
        id: '1',
        examType: 'NEET',
        mood: 3,
        stress: 2,
        studyHours: 4,
        journal: 'first',
        date: '2026-06-11',
      };
      const entry2: JournalEntry = {
        id: '2',
        examType: 'NEET',
        mood: 4,
        stress: 1,
        studyHours: 5,
        journal: 'second',
        date: '2026-06-13',
      };
      saveEntry(entry1);
      saveEntry(entry2);
      const entries = getEntries();
      expect(entries.length).toBeGreaterThanOrEqual(2);
      expect(entries[0]?.id).toBe('2');
      expect(entries[1]?.id).toBe('1');
    });

    it('de-duplicates by id', () => {
      const entry: JournalEntry = {
        id: '1',
        examType: 'NEET',
        mood: 3,
        stress: 2,
        studyHours: 4,
        journal: 'Test',
        date: '2026-06-13',
      };
      saveEntry(entry);
      const updated = { ...entry, journal: 'Updated' };
      saveEntry(updated);
      const entries = getEntries();
      expect(entries.length).toBe(1);
      expect(entries[0]?.journal).toBe('Updated');
    });

    it('clears entries', () => {
      const entry: JournalEntry = {
        id: '1',
        examType: 'JEE',
        mood: 3,
        stress: 2,
        studyHours: 4,
        journal: 'test',
        date: '2026-06-13',
      };
      saveEntry(entry);
      clearEntries();
      expect(getEntries()).toEqual([]);
    });

    it('handles corrupt localStorage gracefully', () => {
      window.localStorage.setItem('mental-wellness-journal', 'invalid json');
      expect(getEntries()).toEqual([]);
    });

    it('returns empty array when no entries exist', () => {
      expect(getEntries()).toEqual([]);
    });
  });

  describe('getRecentEntries', () => {
    it('filters entries by days correctly', () => {
      const now = new Date('2026-06-13').getTime();
      const entry1: JournalEntry = {
        id: '1',
        examType: 'NEET',
        mood: 3,
        stress: 2,
        studyHours: 4,
        journal: 'old',
        date: '2026-06-01',
      };
      const entry2: JournalEntry = {
        id: '2',
        examType: 'NEET',
        mood: 4,
        stress: 1,
        studyHours: 5,
        journal: 'recent',
        date: '2026-06-13',
      };
      saveEntry(entry1);
      saveEntry(entry2);

      const recent = getRecentEntries(7, now);
      expect(recent.length).toBeGreaterThanOrEqual(1);
      expect(recent[0]?.id).toBe('2');
    });

    it('handles invalid dates gracefully', () => {
      const now = Date.now();
      const entry: JournalEntry = {
        id: '1',
        examType: 'NEET',
        mood: 3,
        stress: 2,
        studyHours: 4,
        journal: 'test',
        date: 'invalid-date',
      };
      saveEntry(entry);
      expect(getRecentEntries(7, now)).toEqual([]);
    });
  });

  describe('getStreak', () => {
    it('counts consecutive days correctly', () => {
      const baseDate = new Date('2026-06-13');
      const now = baseDate.getTime();
      const entry1: JournalEntry = {
        id: '1',
        examType: 'NEET',
        mood: 3,
        stress: 2,
        studyHours: 4,
        journal: 'day1',
        date: '2026-06-13',
      };
      const entry2: JournalEntry = {
        id: '2',
        examType: 'NEET',
        mood: 4,
        stress: 1,
        studyHours: 5,
        journal: 'day2',
        date: '2026-06-12',
      };
      saveEntry(entry1);
      saveEntry(entry2);
      expect(getStreak(now)).toBe(2);
    });
  });

  describe('profile', () => {
    it('saves and retrieves profile', () => {
      const profile: UserProfile = {
        name: 'John',
        examType: 'NEET',
        examDate: '2026-12-25',
        primaryConcern: 'stress',
      };
      saveProfile(profile);
      expect(getProfile()).toEqual(profile);
    });

    it('returns null when no profile exists', () => {
      expect(getProfile()).toBeNull();
    });

    it('handles corrupt profile gracefully', () => {
      window.localStorage.setItem('mental-wellness-profile', 'invalid json');
      expect(getProfile()).toBeNull();
    });
  });
});
