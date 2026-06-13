"use client";

import { useState } from "react";
import { ChatMessage, AnalysisResult } from "@/lib/types";
import LoadingDots from "./ui/LoadingDots";

export default function CompanionChat({
  analysis,
}: {
  analysis: AnalysisResult | null;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          riskLevel: analysis?.riskLevel ?? "low",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Chat failed");
      }

      if (!response.body) throw new Error("No stream body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      while (!done) {
        const chunk = await reader.read();
        done = chunk.done ?? true;
        if (chunk.value) {
          text += decoder.decode(chunk.value, { stream: true });
          const reply: ChatMessage = {
            id: crypto.randomUUID(),
            sender: "aarav",
            text,
            timestamp: new Date().toISOString(),
          };
          setMessages((current) => [
            ...current.filter((m) => m.sender !== "aarav"),
            reply,
          ]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="glass animate-fade-up rounded-4xl p-6 text-slate-700 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 text-lg font-semibold text-white shadow-soft">
          A
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">
            Companion chat
          </h2>
          <p className="text-sm text-slate-500">
            Aarav listens and supports your study feelings.
          </p>
        </div>
      </div>

      <div
        className="mt-6 max-h-80 space-y-3 overflow-y-auto rounded-3xl border border-slate-100 bg-white/60 p-4"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            No messages yet — say hello to start the conversation. 💬
          </p>
        ) : (
          messages.map((msg) => {
            const isAarav = msg.sender === "aarav";
            return (
              <div
                key={msg.id}
                className={`flex ${isAarav ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    isAarav
                      ? "rounded-tl-sm bg-white text-slate-700 shadow-sm ring-1 ring-slate-100"
                      : "rounded-tr-sm bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-soft"
                  }`}
                >
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${isAarav ? "text-violet-400" : "text-white/70"}`}
                  >
                    {isAarav ? "Aarav" : "You"}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-3">
        <label className="flex-1 text-sm font-medium text-slate-600">
          <span className="sr-only">Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder="Type a message…"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
          />
        </label>
        <button
          type="submit"
          disabled={loading || message.trim().length === 0}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? <LoadingDots /> : "Send"}
        </button>
      </form>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
