"use client";

import { useEffect, useState } from "react";
import JournalForm from "@/components/JournalForm";
import AnalysisResult from "@/components/AnalysisResult";
import CompanionChat from "@/components/CompanionChat";
import CopingStrategies from "@/components/CopingStrategies";
import PatternChart from "@/components/PatternChart";
import {
  JournalEntry,
  AnalysisResult as AnalysisResultType,
} from "@/lib/types";
import { getEntries } from "@/lib/storage";

export default function HomePage() {
  const [analysis, setAnalysis] = useState<AnalysisResultType | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:py-14"
    >
      <header className="animate-fade-up space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          mental wellness
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          A calm space to{" "}
          <span className="bg-gradient-to-r from-brand-600 via-accent-500 to-accent-600 bg-clip-text text-transparent">
            reflect, understand, and grow
          </span>
          .
        </h1>
        <p className="max-w-xl text-base text-slate-500">
          Journal your day, get gentle AI insights into your patterns, and chat
          with a supportive companion — all in one peaceful place.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-8">
          <JournalForm onAnalysis={setAnalysis} onSaveEntries={setEntries} />
          <AnalysisResult analysis={analysis} />
          <CompanionChat analysis={analysis} />
        </section>

        <aside className="space-y-8">
          <CopingStrategies />
          <PatternChart entries={entries} />
        </aside>
      </div>
    </main>
  );
}
