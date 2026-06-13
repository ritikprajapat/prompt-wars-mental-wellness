import {
  isRiskLevel,
  isExamType,
  isAnalysisResult,
  isChatMessage,
} from '@/lib/guards';
import type { AnalysisResult, ChatMessage } from '@/lib/types';

describe('guards', () => {
  describe('isRiskLevel', () => {
    it('returns true for valid risk levels', () => {
      expect(isRiskLevel('low')).toBe(true);
      expect(isRiskLevel('moderate')).toBe(true);
      expect(isRiskLevel('high')).toBe(true);
    });

    it('returns false for invalid values', () => {
      expect(isRiskLevel('unknown')).toBe(false);
      expect(isRiskLevel(null)).toBe(false);
      expect(isRiskLevel(undefined)).toBe(false);
      expect(isRiskLevel(123)).toBe(false);
    });
  });

  describe('isExamType', () => {
    it('returns true for valid exam types', () => {
      expect(isExamType('NEET')).toBe(true);
      expect(isExamType('JEE')).toBe(true);
      expect(isExamType('CUET')).toBe(true);
      expect(isExamType('CAT')).toBe(true);
      expect(isExamType('GATE')).toBe(true);
      expect(isExamType('UPSC')).toBe(true);
    });

    it('returns false for invalid exam types', () => {
      expect(isExamType('INVALID')).toBe(false);
      expect(isExamType(123)).toBe(false);
      expect(isExamType(null)).toBe(false);
    });
  });

  describe('isAnalysisResult', () => {
    const validResult: AnalysisResult = {
      summary: 'Test summary',
      dominantEmotion: 'stressed',
      riskLevel: 'moderate',
      stressTriggers: ['work', 'sleep'],
      patterns: ['late night study'],
      copingStrategies: ['exercise', 'meditation'],
      motivationalMessage: 'You can do it',
      nextAction: 'Take a break',
    };

    it('returns true for valid AnalysisResult', () => {
      expect(isAnalysisResult(validResult)).toBe(true);
    });

    it('returns false when required fields are missing', () => {
      expect(isAnalysisResult({ summary: 'test' })).toBe(false);
      expect(isAnalysisResult(null)).toBe(false);
      expect(isAnalysisResult(undefined)).toBe(false);
    });

    it('returns false when field types are wrong', () => {
      const invalid = {
        ...validResult,
        summary: 123,
      };
      expect(isAnalysisResult(invalid)).toBe(false);
    });

    it('returns false when array fields contain non-strings', () => {
      const invalid = {
        ...validResult,
        stressTriggers: ['work', 123],
      };
      expect(isAnalysisResult(invalid)).toBe(false);
    });

    it('returns false for invalid risk levels', () => {
      const invalid = {
        ...validResult,
        riskLevel: 'unknown',
      };
      expect(isAnalysisResult(invalid)).toBe(false);
    });
  });

  describe('isChatMessage', () => {
    const validMessage: ChatMessage = {
      id: 'msg-1',
      sender: 'user',
      text: 'Hello',
      timestamp: '2026-06-13T10:00:00Z',
    };

    it('returns true for valid ChatMessage', () => {
      expect(isChatMessage(validMessage)).toBe(true);
      expect(isChatMessage({ ...validMessage, sender: 'aarav' })).toBe(true);
    });

    it('returns false when required fields are missing', () => {
      expect(isChatMessage({ id: 'msg-1' })).toBe(false);
      expect(isChatMessage(null)).toBe(false);
    });

    it('returns false for invalid sender', () => {
      const invalid = {
        ...validMessage,
        sender: 'unknown',
      };
      expect(isChatMessage(invalid)).toBe(false);
    });

    it('returns false when field types are wrong', () => {
      const invalid = {
        ...validMessage,
        id: 123,
      };
      expect(isChatMessage(invalid)).toBe(false);
    });
  });
});
