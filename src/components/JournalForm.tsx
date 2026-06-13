'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { copy } from '@/lib/copy';
import {
  MAX_JOURNAL_LENGTH,
  MIN_JOURNAL_LENGTH,
  TREND_DAYS,
} from '@/lib/constants';
import { JournalEntry, AnalysisResult, UserProfile } from '@/lib/types';
import { saveEntry } from '@/lib/storage';
import { formatDate } from '@/lib/utils';
import MoodSelector from './MoodSelector';
import LoadingDots from './ui/LoadingDots';

const STRESS_LABELS = ['Very low', 'Low', 'Moderate', 'High', 'Very high'];
const DAILY_QUOTES: Record<UserProfile['examType'], string> = {
  NEET: 'Every focused revision block is care for your future patients.',
  JEE: 'One clear concept at a time is how big problem-solving confidence is built.',
  CUET: 'Steady practice today gives your choices more room tomorrow.',
  CAT: 'Calm accuracy beats rushed intensity. Keep your rhythm.',
  GATE: 'Depth grows through repetition. Today is another layer.',
  UPSC: 'Consistency is quiet at first, then it becomes your strongest evidence.',
};

interface JournalFormProps {
  profile: UserProfile;
  entries: JournalEntry[];
  onAnalysis: (result: AnalysisResult | null) => void;
  onSaveEntries: (entries: JournalEntry[]) => void;
  onMoodStressChange: (mood: number, stress: number) => void;
}

function JournalForm({
  profile,
  entries,
  onAnalysis,
  onSaveEntries,
  onMoodStressChange,
}: JournalFormProps) {
  const [mood, setMood] = useState(3);
  const [stress, setStress] = useState(3);
  const [studyHours, setStudyHours] = useState(4);
  const [journal, setJournal] = useState('');
  const [draftJournal, setDraftJournal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDisabled = useMemo(
    () => loading || journal.trim().length < MIN_JOURNAL_LENGTH,
    [journal, loading]
  );
  const pastTrend = useMemo(
    () =>
      Array.from({ length: TREND_DAYS }, (_, index) => {
        const entry = entries[TREND_DAYS - 1 - index];
        return {
          date:
            entry?.date.slice(0, 10) ??
            new Date(Date.now() - (TREND_DAYS - 1 - index) * 86_400_000)
              .toISOString()
              .slice(0, 10),
          mood: entry?.mood ?? mood,
          stress: entry?.stress ?? stress,
        };
      }),
    [entries, mood, stress]
  );
  const quote = useMemo(
    () => DAILY_QUOTES[profile.examType],
    [profile.examType]
  );
  const examDateLabel = useMemo(
    () => formatDate(profile.examDate),
    [profile.examDate]
  );

  useEffect(() => {
    onMoodStressChange(mood, stress);
  }, [mood, onMoodStressChange, stress]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    []
  );

  const handleJournalChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      setDraftJournal(nextValue);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setJournal(nextValue), 300);
    },
    []
  );

  const handleMoodChange = useCallback((nextMood: number) => {
    setMood(nextMood);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setLoading(true);
      const journalText = draftJournal.trim();

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examType: profile.examType,
            mood,
            stress,
            studyHours,
            journal: journalText,
            pastTrend,
            profile,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to analyze.');
        }

        const data = await response.json();
        const result = data.result;
        onAnalysis(result);

        const entry: JournalEntry = {
          id: crypto.randomUUID(),
          examType: profile.examType,
          mood,
          stress,
          studyHours,
          journal: journalText,
          date: new Date().toISOString(),
        };

        const nextEntries = saveEntry(entry);
        onSaveEntries(nextEntries);
        setJournal('');
        setDraftJournal('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        onAnalysis(null);
      } finally {
        setLoading(false);
      }
    },
    [
      draftJournal,
      mood,
      onAnalysis,
      onSaveEntries,
      pastTrend,
      profile,
      stress,
      studyHours,
    ]
  );

  return (
    <div className="glass animate-fade-up space-y-6 rounded-4xl p-6 sm:p-7">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-bold text-slate-900">
          {copy.journal.title}
        </h2>
        <p className="text-sm text-slate-500">{copy.journal.subtitle}</p>
      </div>
      <figure className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-4">
        <blockquote className="text-sm font-medium text-indigo-800">
          {quote}
        </blockquote>
        <figcaption className="mt-2 text-xs text-slate-600">
          {profile.examType} exam on {examDateLabel}
        </figcaption>
      </figure>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 text-sm font-medium text-slate-600">
            <span>{copy.journal.examLabel}</span>
            <p className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800">
              {profile.examType}
            </p>
          </div>
          <label className="space-y-2 text-sm font-medium text-slate-600">
            {copy.journal.studyHoursLabel}
            <input
              type="number"
              min={0}
              max={24}
              value={studyHours}
              onChange={e => setStudyHours(Number(e.target.value))}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
          </label>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-600">
            {copy.journal.moodLabel}
          </span>
          <p id="mood-helper" className="text-xs text-slate-500">
            {copy.journal.moodHint}
          </p>
          <MoodSelector
            value={mood}
            onChange={handleMoodChange}
            describedBy="mood-helper"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-3 text-sm font-medium text-slate-600">
            <span className="flex items-center justify-between">
              {copy.journal.stressLabel}
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
                {STRESS_LABELS[stress - 1]}
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={5}
              value={stress}
              onChange={e => setStress(Number(e.target.value))}
              aria-label="Stress level"
              className="w-full"
            />
            <span className="flex justify-between text-[11px] font-normal text-slate-500">
              <span>Calm</span>
              <span>Overwhelmed</span>
            </span>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-600">
            {copy.journal.journalLabel}
            <textarea
              value={draftJournal}
              onChange={handleJournalChange}
              rows={6}
              maxLength={MAX_JOURNAL_LENGTH}
              aria-describedby="journal-hint journal-count"
              placeholder={copy.journal.journalPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-violet-300 focus:ring-2 focus:ring-violet-200"
            />
            <p id="journal-hint" className="text-xs font-normal text-slate-500">
              {copy.journal.journalHint}
            </p>
            <p
              id="journal-count"
              className={`text-xs ${draftJournal.length > 1800 ? 'font-medium text-amber-600' : 'text-slate-500'}`}
            >
              {draftJournal.length}/{MAX_JOURNAL_LENGTH} characters
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
          aria-busy={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:w-auto"
        >
          {loading ? <LoadingDots /> : copy.journal.submit}
        </button>
      </form>
    </div>
  );
}

export default memo(JournalForm);
