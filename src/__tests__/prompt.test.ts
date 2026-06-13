import { buildAnalysisPrompt, buildChatPrompt } from '@/lib/prompt';

describe('prompt builder', () => {
  it('includes exam details in analysis prompt', () => {
    const prompt = buildAnalysisPrompt({
      examType: 'UPSC',
      mood: 2,
      stress: 4,
      studyHours: 5,
      journal: 'I felt tired but motivated.',
      pastTrend: Array.from({ length: 7 }, (_, index) => ({
        date: `2026-06-0${index + 1}`,
        mood: 3,
        stress: 3,
      })),
    });

    expect(prompt).toContain('Exam type: UPSC');
    expect(prompt).toContain('Journal: I felt tired but motivated.');
  });

  it('includes crisis phone for high-risk', () => {
    const prompt = buildChatPrompt({
      message: 'I feel overwhelmed',
      riskLevel: 'high',
      history: [],
    });
    expect(prompt).toContain('iCall helpline:');
  });
});
