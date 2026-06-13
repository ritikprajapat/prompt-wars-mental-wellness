'use client';

import { memo } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { getRiskColor, getRiskLabel } from '@/lib/utils';
import Badge from './ui/Badge';
import Card from './ui/Card';

function AnalysisResult({ analysis }: { analysis: AnalysisResult | null }) {
  if (!analysis) {
    return (
      <Card>
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-lg text-white shadow-soft">
            ✦
          </span>
          <div>
            <h2
              tabIndex={-1}
              className="font-display text-xl font-bold text-slate-900 outline-none"
            >
              AI analysis
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Analyze your journal to receive emotional patterns, coping advice,
              and next steps.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-lg text-white shadow-soft">
              ✦
            </span>
            <div>
              <h2
                tabIndex={-1}
                className="font-display text-xl font-bold text-slate-900 outline-none"
              >
                AI analysis
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Summary, triggers, patterns, and motivation.
              </p>
            </div>
          </div>
          <Badge label={analysis.riskLevel} />
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              Summary
            </p>
            <p className="mt-2 text-slate-700">{analysis.summary}</p>
          </div>

          <div
            role={analysis.riskLevel === 'high' ? 'alert' : 'status'}
            aria-atomic="true"
            className="rounded-3xl border border-slate-100 bg-white/60 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              Burnout risk
            </p>
            <p
              className={`mt-2 text-lg font-bold ${getRiskColor(analysis.riskLevel)}`}
            >
              {getRiskLabel(analysis.riskLevel)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Based on mood, stress, triggers, and recurring patterns from this
              check-in.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
                Stress triggers
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700 marker:text-violet-400">
                {analysis.stressTriggers.map(trigger => (
                  <li key={trigger}>{trigger}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
                Patterns
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700 marker:text-violet-400">
                {analysis.patterns.map(pattern => (
                  <li key={pattern}>{pattern}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              Coping strategies
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700 marker:text-violet-400">
              {analysis.copingStrategies.map(strategy => (
                <li key={strategy}>{strategy}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
              Motivation
            </p>
            <p className="mt-2 text-slate-700">
              {analysis.motivationalMessage}
            </p>
            <p className="mt-3 inline-flex rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-600">
              Next action: {analysis.nextAction}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default memo(AnalysisResult);
