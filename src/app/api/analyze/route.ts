import { NextResponse } from "next/server";
import { analyzeApiSchema } from "@/lib/schema";
import { sanitize } from "@/lib/sanitize";
import { rateLimit } from "@/lib/ratelimit";
import { analyzeWithGemini, GeminiError } from "@/lib/gemini";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("host") ||
    "unknown";
  const body = await request.json();
  const sanitized = { ...body, journal: sanitize(String(body.journal || "")) };
  const parsed = analyzeApiSchema.safeParse(sanitized);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.format() },
      { status: 400 },
    );
  }

  const limit = rateLimit(`analyze-${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const result = await analyzeWithGemini(parsed.data);
    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status === 429 ? 429 : 502 },
      );
    }
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
