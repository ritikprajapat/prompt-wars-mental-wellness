'use client';

import { memo, useMemo } from 'react';
import { JournalEntry } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const CHART_WIDTH = 280;
const CHART_HEIGHT = 120;

function toPolyline(values: number[]): string {
  if (values.length === 0) return '';
  return values
    .map((value, index) => {
      const x =
        values.length === 1
          ? CHART_WIDTH / 2
          : (index / (values.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((value - 1) / 4) * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(' ');
}

function PatternChart({ entries }: { entries: JournalEntry[] }) {
  const { recent, moodPoints, stressPoints, moodPolyline, stressPolyline } =
    useMemo(() => {
      const slice = entries.slice(0, 7).reverse();
      return {
        recent: slice,
        moodPoints: slice.map(entry => entry.mood),
        stressPoints: slice.map(entry => entry.stress),
        moodPolyline: toPolyline(slice.map(entry => entry.mood)),
        stressPolyline: toPolyline(slice.map(entry => entry.stress)),
      };
    }, [entries]);

  return (
    <section className="glass animate-fade-up rounded-4xl p-6 text-slate-700 sm:p-7">
      <h2 className="font-display text-xl font-bold text-slate-900">
        Pattern chart
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        7-day mood trend with stress alongside it.
      </p>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-violet-200 bg-white/50 px-4 py-10 text-center">
          <p className="text-3xl">🌱</p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            No entries yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Save your first journal to start seeing your patterns here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div
            role="img"
            aria-label="7-day mood trend chart"
            className="rounded-3xl border border-slate-100 bg-white/60 p-4"
          >
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="h-36 w-full overflow-visible"
              aria-hidden="true"
            >
              {[1, 2, 3].map(line => (
                <line
                  key={line}
                  x1="0"
                  x2={CHART_WIDTH}
                  y1={(line / 4) * CHART_HEIGHT}
                  y2={(line / 4) * CHART_HEIGHT}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}
              <polyline
                points={stressPolyline}
                fill="none"
                stroke="#e11d48"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              <polyline
                points={moodPolyline}
                fill="none"
                stroke="#4f46e5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
            </svg>
            <div className="mt-3 flex gap-4 text-xs font-medium text-slate-600">
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-indigo-600" />
                Mood
              </span>
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-rose-600" />
                Stress
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-500">
                <span>Mood</span>
                <span className="text-slate-800">
                  {moodPoints[moodPoints.length - 1] ?? '-'}/5
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
                  {stressPoints[stressPoints.length - 1] ?? '-'}/5
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
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Mood</th>
                  <th className="px-4 py-3 font-semibold">Stress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map(entry => (
                  <tr
                    key={entry.id}
                    className="transition hover:bg-violet-50/50"
                  >
                    <td className="px-4 py-3">{formatDate(entry.date)}</td>
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
      )}
    </section>
  );
}

export default memo(PatternChart);
