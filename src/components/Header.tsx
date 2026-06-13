'use client';

import { memo } from 'react';
import type { UserProfile } from '@/lib/types';
import { ProgressBar } from './ui';

interface HeaderProps {
  profile: UserProfile | null;
  streak: number;
  daysToExam: number;
  wellnessScore: number;
}

/**
 * Dashboard header: greets the aspirant, surfaces today's wellness score and
 * the journaling streak, and counts down the days remaining to their exam.
 */
function Header({ profile, streak, daysToExam, wellnessScore }: HeaderProps) {
  return (
    <header className="animate-fade-up space-y-5">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 shadow-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
        mental wellness
      </span>
      <h1
        id="dashboard-heading"
        tabIndex={-1}
        className="max-w-2xl font-display text-3xl font-bold leading-tight text-slate-900 outline-none sm:text-4xl"
      >
        {profile ? `Hi ${profile.name}, ` : 'Welcome — '}
        <span className="bg-gradient-to-r from-brand-600 via-accent-500 to-accent-600 bg-clip-text text-transparent">
          how are you today?
        </span>
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Today&apos;s wellness
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {wellnessScore}
            <span className="text-base font-medium text-slate-400">/100</span>
          </p>
          <div className="mt-2">
            <ProgressBar value={wellnessScore} label="Today's wellness score" />
          </div>
        </div>
        <div className="glass rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Streak
          </p>
          <p
            className="mt-1 text-2xl font-bold text-slate-900"
            aria-label={`Current streak: ${streak} days`}
          >
            {streak} 🔥
          </p>
          <p className="mt-1 text-xs text-slate-500">consecutive days</p>
        </div>
        <div className="glass rounded-3xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {profile ? `${profile.examType} countdown` : 'Exam countdown'}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{daysToExam}</p>
          <p className="mt-1 text-xs text-slate-500">days remaining</p>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
