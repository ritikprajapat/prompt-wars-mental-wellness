import 'server-only';
import { NextResponse } from 'next/server';
import { MAX_BODY_BYTES } from './constants';

/** Same-origin CORS + no-store headers applied to every JSON API response. */
const baseHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': 'same-origin',
  'Cache-Control': 'no-store',
};

/** JSON response helper that always attaches the shared security headers. */
export function jsonResponse(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, { status, headers: baseHeaders });
}

/** Error response helper. */
export function errorResponse(message: string, status: number): NextResponse {
  return jsonResponse({ error: message }, status);
}

/**
 * Convert an unknown thrown value into a client-safe message, stripping stack
 * traces and internal details in production.
 */
export function safeErrorMessage(error: unknown): string {
  if (process.env.NODE_ENV === 'production') return 'Internal server error';
  return error instanceof Error ? error.message : 'Unknown error';
}

export type GuardResult =
  | { ok: true; json: unknown }
  | { ok: false; response: NextResponse };

/**
 * Validate transport-level concerns shared by all routes: JSON content type,
 * body size, and JSON parseability. Returns the parsed JSON or a ready-made
 * error response.
 */
export async function readJsonBody(request: Request): Promise<GuardResult> {
  if (request.headers.get('content-type') !== 'application/json') {
    return {
      ok: false,
      response: errorResponse('Unsupported Media Type', 415),
    };
  }
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return { ok: false, response: errorResponse('Payload too large', 413) };
  }
  try {
    return { ok: true, json: JSON.parse(body) };
  } catch {
    return { ok: false, response: errorResponse('Invalid JSON body', 400) };
  }
}

/** Derive a best-effort client identifier for rate limiting. */
export function clientKey(request: Request): string {
  return (
    request.headers.get('x-forwarded-for') ??
    request.headers.get('host') ??
    'unknown'
  );
}
