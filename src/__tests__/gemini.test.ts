import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from "util";
import {
  ReadableStream as NodeReadableStream,
  TransformStream as NodeTransformStream,
} from "stream/web";
import { sseToTextStream } from "@/lib/gemini";

// jsdom does not provide these Web APIs; back them with Node's implementations.
const g = globalThis as Record<string, unknown>;
g.TextEncoder ??= NodeTextEncoder;
g.TextDecoder ??= NodeTextDecoder;
g.ReadableStream ??= NodeReadableStream;
g.TransformStream ??= NodeTransformStream;

/** Builds a ReadableStream that emits the given strings as UTF-8 chunks. */
function streamOf(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const c of chunks) controller.enqueue(encoder.encode(c));
      controller.close();
    },
  });
}

async function collect(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

const frame = (text: string) =>
  `data: ${JSON.stringify({
    candidates: [{ content: { parts: [{ text }] } }],
  })}\n\n`;

describe("sseToTextStream", () => {
  it("extracts and concatenates text deltas from SSE frames", async () => {
    const stream = sseToTextStream(streamOf([frame("Hello "), frame("there")]));
    expect(await collect(stream)).toBe("Hello there");
  });

  it("handles frames split across chunk boundaries", async () => {
    const full = frame("Stay strong");
    const mid = Math.floor(full.length / 2);
    const stream = sseToTextStream(
      streamOf([full.slice(0, mid), full.slice(mid)]),
    );
    expect(await collect(stream)).toBe("Stay strong");
  });

  it("ignores keep-alives, [DONE] markers, and malformed frames", async () => {
    const stream = sseToTextStream(
      streamOf([": keep-alive\n\n", "data: [DONE]\n\n", "data: {bad\n\n"]),
    );
    expect(await collect(stream)).toBe("");
  });
});
