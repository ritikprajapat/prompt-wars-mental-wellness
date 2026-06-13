import {
  clamp,
  formatDate,
  daysUntil,
  calcStreak,
  calcWeightedScore,
  getRiskColor,
  getRiskLabel,
  getMoodEmoji,
} from '@/lib/utils';
import type { JournalEntry } from '@/lib/types';

describe('utils', () => {
  describe('clamp', () => {
    it('returns value when in range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('returns min when below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('returns max when above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('formatDate', () => {
    it('formats valid ISO date', () => {
      const formatted = formatDate('2026-06-13');
      expect(formatted).toContain('Jun');
      expect(formatted).toContain('2026');
    });

    it('returns original string for invalid date', () => {
      expect(formatDate('invalid')).toBe('invalid');
    });
  });

  describe('daysUntil', () => {
    it('returns 0 for past dates', () => {
      const past = new Date('2020-01-01').getTime();
      expect(daysUntil('2020-01-01', past + 86400000)).toBe(0);
    });

    it('returns 0 for invalid dates', () => {
      expect(daysUntil('invalid', Date.now())).toBe(0);
    });

    it('calculates days for future dates', () => {
      const now = new Date('2026-06-13').getTime();
      const future = new Date('2026-06-20').getTime();
      expect(daysUntil('2026-06-20', now)).toBeGreaterThan(0);
    });
  });

  describe('calcStreak', () => {
    it('counts consecutive days', () => {
      const now = new Date('2026-06-13').getTime();
      const entries: JournalEntry[] = [
        {
          id: '1',
          examType: 'NEET',
          mood: 3,
          stress: 2,
          studyHours: 4,
          journal: 'day1',
          date: '2026-06-13',
        },
        {
          id: '2',
          examType: 'NEET',
          mood: 3,
          stress: 2,
          studyHours: 4,
          journal: 'day2',
          date: '2026-06-12',
        },
      ];
      expect(calcStreak(entries, now)).toBe(2);
    });

    it('returns 0 for empty entries', () => {
      expect(calcStreak([], Date.now())).toBe(0);
    });

    it('breaks on gap', () => {
      const now = new Date('2026-06-13').getTime();
      const entries: JournalEntry[] = [
        {
          id: '1',
          examType: 'NEET',
          mood: 3,
          stress: 2,
          studyHours: 4,
          journal: 'day1',
          date: '2026-06-13',
        },
        {
          id: '2',
          examType: 'NEET',
          mood: 3,
          stress: 2,
          studyHours: 4,
          journal: 'day3',
          date: '2026-06-11',
        },
      ];
      expect(calcStreak(entries, now)).toBe(1);
    });
  });

  describe('calcWeightedScore', () => {
    it('returns higher score for high mood and low stress', () => {
      const high = calcWeightedScore(5, 1);
      const low = calcWeightedScore(1, 5);
      expect(high).toBeGreaterThan(low);
    });

    it('returns score in valid range', () => {
      const score = calcWeightedScore(3, 3);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('clamps out of range inputs', () => {
      const score = calcWeightedScore(10, -5);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getRiskColor', () => {
    it('returns correct color for risk level', () => {
      expect(getRiskColor('low')).toBe('text-emerald-600');
      expect(getRiskColor('moderate')).toBe('text-amber-600');
      expect(getRiskColor('high')).toBe('text-rose-600');
    });
  });

  describe('getRiskLabel', () => {
    it('returns correct label for risk level', () => {
      expect(getRiskLabel('low')).toBe('Low burnout risk');
      expect(getRiskLabel('moderate')).toBe('Moderate burnout risk');
      expect(getRiskLabel('high')).toBe('High burnout risk');
    });
  });

  describe('getMoodEmoji', () => {
    it('returns emoji for mood 1', () => {
      expect(getMoodEmoji(1)).toBe('😔');
    });

    it('returns emoji for mood 3', () => {
      expect(getMoodEmoji(3)).toBe('😐');
    });

    it('returns emoji for mood 5', () => {
      expect(getMoodEmoji(5)).toBe('😄');
    });

    it('clamps out of range values', () => {
      expect(getMoodEmoji(10)).toBe('😄');
      expect(getMoodEmoji(0)).toBe('😔');
    });
  });
});
