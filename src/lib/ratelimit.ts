type RateRecord = { count: number; reset: number };
const store = new Map<string, RateRecord>();

/**
 * Fixed-window, in-memory rate limiter keyed by an arbitrary identifier
 * (typically `${route}-${ip}`). Suitable for a single instance; swap for a
 * shared store (e.g. Redis) when running multiple instances.
 *
 * @param key      Unique bucket identifier.
 * @param limit    Maximum requests allowed within the window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, reset: record.reset };
  }

  record.count += 1;
  store.set(key, record);
  return {
    allowed: true,
    remaining: limit - record.count,
    reset: record.reset,
  };
}
