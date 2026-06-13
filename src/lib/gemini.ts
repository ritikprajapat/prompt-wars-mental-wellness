import { AnalyzeApiInput, ChatApiInput } from "./schema";
import { buildAnalysisPrompt, buildChatPrompt } from "./prompt";
import { GEMINI_BASE_URL, GEMINI_MODEL } from "./constants";

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return key;
}

/** Turns a raw Gemini error response into a friendly, status-aware message. */
async function toGeminiError(response: Response): Promise<GeminiError> {
  const raw = await response.text();
  let message = raw || "Gemini request failed";
  try {
    message = JSON.parse(raw)?.error?.message ?? message;
  } catch {
    /* keep raw text */
  }
  if (response.status === 429) {
    message =
      "The AI service is rate-limited or out of quota. Please check the GEMINI_API_KEY billing/quota and try again shortly.";
  }
  return new GeminiError(message, response.status);
}

function endpoint(method: "generateContent" | "streamGenerateContent") {
  const url = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:${method}`;
  return method === "streamGenerateContent" ? `${url}?alt=sse` : url;
}

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

/** Extracts the concatenated text from a Gemini generateContent response. */
function extractText(data: GeminiResponse): string {
  return (
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("") ?? ""
  );
}

export async function callGemini(
  prompt: string,
  options: { json?: boolean } = {},
) {
  const response = await fetch(endpoint("generateContent"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": getApiKey(),
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: options.json
        ? { responseMimeType: "application/json" }
        : undefined,
    }),
  });

  if (!response.ok) {
    throw await toGeminiError(response);
  }

  return response.json() as Promise<GeminiResponse>;
}

export async function analyzeWithGemini(input: AnalyzeApiInput) {
  const data = await callGemini(buildAnalysisPrompt(input), { json: true });
  const text = extractText(data);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Gemini returned malformed JSON");
  }
}

/**
 * Transforms Gemini's `alt=sse` byte stream into a stream of plain text
 * deltas, so the client receives readable prose instead of raw SSE/JSON.
 */
export function sseToTextStream(
  source: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const emit = (controller: TransformStreamDefaultController, line: string) => {
    const payload = line.slice("data:".length).trim();
    if (!payload || payload === "[DONE]") return;
    try {
      const text = extractText(JSON.parse(payload) as GeminiResponse);
      if (text) controller.enqueue(encoder.encode(text));
    } catch {
      /* ignore keep-alive or partial frames */
    }
  };

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith("data:")) emit(controller, line);
      }
    },
    flush(controller) {
      if (buffer.startsWith("data:")) emit(controller, buffer);
    },
  });

  return source.pipeThrough(transform);
}

export async function streamGemini(input: ChatApiInput) {
  const response = await fetch(endpoint("streamGenerateContent"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": getApiKey(),
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildChatPrompt(input) }] }],
    }),
  });

  if (!response.ok || !response.body) {
    throw await toGeminiError(response);
  }

  return sseToTextStream(response.body);
}
