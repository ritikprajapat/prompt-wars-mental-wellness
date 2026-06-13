import { rateLimit } from '@/lib/ratelimit';

describe('rateLimit', () => {
  it('allows requests within limit', () => {
    const result1 = rateLimit('test-key', 5, 1000);
    const result2 = rateLimit('test-key', 5, 1000);
    const result3 = rateLimit('test-key', 5, 1000);

    expect(result1.allowed).toBe(true);
    expect(result2.allowed).toBe(true);
    expect(result3.allowed).toBe(true);
    expect(result3.remaining).toBe(2);
  });

  it('blocks requests exceeding limit', () => {
    for (let i = 0; i < 5; i++) {
      rateLimit('block-test', 2, 1000);
    }
    const blocked = rateLimit('block-test', 2, 1000);
    expect(blocked.allowed).toBe(false);
  });
});
