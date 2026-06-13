"use client";

import { useMemo, useState } from "react";
import { EXAM_TYPES } from "@/lib/constants";
import { JournalEntry, AnalysisResult } from "@/lib/types";
import { saveEntry } from "@/lib/storage";
import MoodSelector from "./MoodSelector";
import ProgressBar from "./ui/ProgressBar";
import LoadingDots from "./ui/LoadingDots";

export default function JournalForm({
  onAnalysis,
  onSaveEntries,
}: {
  onAnalysis: (result: AnalysisResult | null) => void;
  onSaveEntries: (entries: JournalEntry[]) => void;
}) {
  const [examType, setExamType] = useState("NEET");
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [studyHours, setStudyHours] = useState(4);
  const [journal, setJournal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = useMemo(
    () => loading || journal.trim().length === 0,
    [journal, loading],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const pastTrend = Array.from({ length: 7 }, (_, index) => ({
      date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      mood: Math.max(1, Math.min(5, mood - 1 + (index % 5))),
      stress: Math.max(1, Math.min(5, stress - 1 + ((index * -1) % 5))),
    }));

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examType,
          mood,
          stress,
          studyHours,
          journal,
          pastTrend,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze.");
      }

      const data = await response.json();
      const result = data.result;
      onAnalysis(result);

      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        examType: examType as JournalEntry["examType"],
        mood,
        stress,
        studyHours,
        journal,
        date: new Date().toISOString(),
      };

      const nextEntries = saveEntry(entry);
      onSaveEntries(nextEntries);
      setJournal("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      onAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass animate-fade-up space-y-6 rounded-4xl p-6 sm:p-7">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Today&apos;s check-in
        </h2>
        <p className="text-sm text-slate-500">
          A few quick taps, then write whatever&apos;s on your mind.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-600">
            Exam type
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            >
              {EXAM_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-600">
            Study hours
            <input
              type="number"
              min={0}
              max={24}
              value={studyHours}
              onChange={(e) => setStudyHours(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
          </label>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-600">Mood</span>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-600">
            Stress level
            <input
              type="range"
              min={1}
              max={5}
              value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full"
            />
            <ProgressBar label="Stress" value={stress} max={5} />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-600">
            Journal entry
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              rows={6}
              maxLength={2000}
              placeholder="How did today feel? What's weighing on you?"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
            <p className="text-xs text-slate-400">
              {journal.length}/2000 characters
            </p>
          </label>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto"
        >
          {loading ? <LoadingDots /> : "Analyze my journal"}
        </button>
      </form>
    </div>
  );
}
