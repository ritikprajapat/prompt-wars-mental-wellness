/* eslint-disable no-console */
/**
 * Development-only logger. In production builds this is a no-op so that no
 * diagnostic output (or potentially sensitive data) reaches the console.
 */
export const log =
  process.env.NODE_ENV === 'development'
    ? console.log.bind(console)
    : (): void => {};

/** Always-on error channel for genuinely exceptional conditions. */
export const logError =
  process.env.NODE_ENV === 'development'
    ? console.error.bind(console)
    : (): void => {};
