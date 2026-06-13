'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EXAM_TYPES } from '@/lib/constants';
import { copy } from '@/lib/copy';
import { saveProfile } from '@/lib/storage';
import type { ExamType, PrimaryConcern, UserProfile } from '@/lib/types';

const CONCERNS: readonly PrimaryConcern[] = ['stress', 'burnout', 'motivation'];
const TOTAL_STEPS = 3;

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

/**
 * One-time three-step onboarding capturing the aspirant's name, exam + date,
 * and primary concern. Persists a {@link UserProfile} on completion.
 */
export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [examType, setExamType] = useState<ExamType>('NEET');
  const [examDate, setExamDate] = useState('');
  const [concern, setConcern] = useState<PrimaryConcern>('stress');
  const headingRef = useRef<HTMLHeadingElement>(null);

  const canContinue =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && examDate.length > 0) ||
    step === 2;

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
      return;
    }
    const profile: UserProfile = {
      name: name.trim(),
      examType,
      examDate,
      primaryConcern: concern,
    };
    saveProfile(profile);
    onComplete(profile);
  }, [step, name, examType, examDate, concern, onComplete]);

  const handleBack = useCallback(() => setStep(s => Math.max(0, s - 1)), []);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-10"
    >
      <section className="glass animate-fade-up space-y-6 rounded-4xl p-7">
        <div className="space-y-1">
          <h1
            id="onboarding-heading"
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-2xl font-bold text-slate-900 outline-none"
          >
            {copy.onboarding.title}
          </h1>
          <p className="text-sm text-slate-500">
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </div>

        {step === 0 ? (
          <label className="block space-y-2 text-sm font-medium text-slate-600">
            {copy.onboarding.nameStep}
            <input
              type="text"
              value={name}
              autoFocus
              aria-required="true"
              onChange={e => setName(e.target.value)}
              placeholder={copy.onboarding.namePlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
          </label>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-medium text-slate-600">
              {copy.onboarding.examStep}
              <select
                value={examType}
                onChange={e => setExamType(e.target.value as ExamType)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
              >
                {EXAM_TYPES.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-600">
              {copy.onboarding.examDateLabel}
              <input
                type="date"
                value={examDate}
                aria-required="true"
                onChange={e => setExamDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-600">
              {copy.onboarding.concernStep}
            </legend>
            <div className="grid gap-2">
              {CONCERNS.map(option => (
                <label
                  key={option}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    concern === option
                      ? 'border-violet-300 bg-violet-50 text-violet-700'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:border-violet-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="concern"
                    value={option}
                    checked={concern === option}
                    onChange={() => setConcern(option)}
                    className="accent-violet-600"
                  />
                  {copy.onboarding.concerns[option]}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="min-h-[44px] rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:text-slate-700 disabled:opacity-0"
          >
            {copy.onboarding.back}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue}
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === TOTAL_STEPS - 1
              ? copy.onboarding.finish
              : copy.onboarding.next}
          </button>
        </div>
      </section>
    </main>
  );
}
