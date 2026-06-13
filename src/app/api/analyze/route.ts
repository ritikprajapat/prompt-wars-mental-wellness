import { analyzeApiSchema } from '@/lib/schema';
import { sanitize } from '@/lib/sanitize';
import { rateLimit } from '@/lib/ratelimit';
import { analyzeWithGemini, GeminiError } from '@/lib/gemini';
import { ANALYZE_RATE_LIMIT, RATE_WINDOW_MS } from '@/lib/constants';
import {
  clientKey,
  errorResponse,
  jsonResponse,
  readJsonBody,
  safeErrorMessage,
} from '@/lib/http';

export async function POST(request: Request) {
  const guard = await readJsonBody(request);
  if (!guard.ok) return guard.response;

  const body = guard.json;
  if (typeof body !== 'object' || body === null) {
    return errorResponse('Request body must be a JSON object', 400);
  }

  const raw = body as Record<string, unknown>;
  const sanitized = { ...raw, journal: sanitize(String(raw.journal ?? '')) };
  const parsed = analyzeApiSchema.safeParse(sanitized);
  if (!parsed.success) {
    return jsonResponse(
      { error: 'Invalid input', details: parsed.error.format() },
      400
    );
  }

  const limit = rateLimit(
    `analyze-${clientKey(request)}`,
    ANALYZE_RATE_LIMIT,
    RATE_WINDOW_MS
  );
  if (!limit.allowed) return errorResponse('Rate limit exceeded', 429);

  try {
    const result = await analyzeWithGemini(parsed.data);
    return jsonResponse({ result }, 200);
  } catch (error) {
    if (error instanceof GeminiError) {
      return errorResponse(
        safeErrorMessage(error),
        error.status === 429 ? 429 : 502
      );
    }
    return errorResponse(safeErrorMessage(error), 500);
  }
}
