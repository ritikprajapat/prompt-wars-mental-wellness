import { NextResponse } from "next/server";
import { chatApiSchema } from "@/lib/schema";
import { sanitize } from "@/lib/sanitize";
import { rateLimit } from "@/lib/ratelimit";
import { streamGemini, GeminiError } from "@/lib/gemini";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("host") ||
    "unknown";
  const body = await request.json().catch(() => null);
  if (body === null || typeof body !== "object") {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const sanitized = { ...body, message: sanitize(String(body.message || "")) };
  const parsed = chatApiSchema.safeParse(sanitized);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.format() },
      { status: 400 },
    );
  }

  const limit = rateLimit(`chat-${ip}`, 20, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const stream = await streamGemini(parsed.data);
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status === 429 ? 429 : 502 },
      );
    }
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
