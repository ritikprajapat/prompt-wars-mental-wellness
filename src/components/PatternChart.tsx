"use client";

import { JournalEntry } from "@/lib/types";

export default function PatternChart({ entries }: { entries: JournalEntry[] }) {
  const labels = entries
    .slice(0, 7)
    .map((entry) => new Date(entry.date).toLocaleDateString());
  const moodPoints = entries.slice(0, 7).map((entry) => entry.mood);
  const stressPoints = entries.slice(0, 7).map((entry) => entry.stress);

  return (
    <section className="glass animate-fade-up rounded-4xl p-6 text-slate-700 sm:p-7">
      <h2 className="font-display text-xl font-bold text-slate-900">
        Pattern chart
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Mood and stress over recent entries.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-500">
              <span>Mood</span>
              <span className="text-slate-800">
                {moodPoints[moodPoints.length - 1] ?? "-"}/5
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                style={{
                  width: `${((moodPoints[moodPoints.length - 1] ?? 0) / 5) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-500">
              <span>Stress</span>
              <span className="text-slate-800">
                {stressPoints[stressPoints.length - 1] ?? "-"}/5
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-500"
                style={{
                  width: `${((stressPoints[stressPoints.length - 1] ?? 0) / 5) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white/60">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Mood</th>
                <th className="px-4 py-3 font-semibold">Stress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.slice(0, 7).map((entry) => (
                <tr key={entry.id} className="transition hover:bg-violet-50/50">
                  <td className="px-4 py-3">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {entry.mood}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {entry.stress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
