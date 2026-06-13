import { NextResponse } from 'next/server';
import { chatApiSchema } from '@/lib/schema';
import { sanitize } from '@/lib/sanitize';
import { rateLimit } from '@/lib/ratelimit';
import { streamGemini, GeminiError } from '@/lib/gemini';
import {
  CHAT_RATE_LIMIT,
  MAX_MESSAGE_LENGTH,
  RATE_WINDOW_MS,
} from '@/lib/constants';
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
  const rawMessage = String(raw.message ?? '');
  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    return errorResponse('Message too long', 400);
  }

  const sanitized = {
    ...raw,
    message: sanitize(rawMessage, MAX_MESSAGE_LENGTH),
  };
  const parsed = chatApiSchema.safeParse(sanitized);
  if (!parsed.success) {
    return jsonResponse(
      { error: 'Invalid input', details: parsed.error.format() },
      400
    );
  }

  const limit = rateLimit(
    `chat-${clientKey(request)}`,
    CHAT_RATE_LIMIT,
    RATE_WINDOW_MS
  );
  if (!limit.allowed) return errorResponse('Rate limit exceeded', 429);

  try {
    const stream = await streamGemini(parsed.data);
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': 'same-origin',
      },
    });
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
