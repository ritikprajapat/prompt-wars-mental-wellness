import { analyzeApiSchema, chatApiSchema } from '@/lib/schema';

describe('src/lib/schema', () => {
  it('validates analyze input', () => {
    const result = analyzeApiSchema.safeParse({
      examType: 'NEET',
      mood: 4,
      stress: 2,
      studyHours: 5,
      journal: 'A focused study day.',
      pastTrend: Array.from({ length: 7 }, (_, index) => ({
        date: `2026-06-0${index + 1}`,
        mood: 3,
        stress: 2,
      })),
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid analyze input', () => {
    const result = analyzeApiSchema.safeParse({
      examType: 'ABC',
      mood: 0,
      stress: 10,
      studyHours: -1,
      journal: 'x'.repeat(2100),
      pastTrend: [],
    });

    expect(result.success).toBe(false);
  });

  it('validates chat input', () => {
    const result = chatApiSchema.safeParse({
      message: 'Hello',
      riskLevel: 'moderate',
    });
    expect(result.success).toBe(true);
  });
});
