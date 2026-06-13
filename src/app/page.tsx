'use client';

import dynamic from 'next/dynamic';
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AnalysisResult from '@/components/AnalysisResult';
import Header from '@/components/Header';
import JournalForm from '@/components/JournalForm';
import Onboarding from '@/components/Onboarding';
import LoadingDots from '@/components/ui/LoadingDots';
import {
  JournalEntry,
  AnalysisResult as AnalysisResultType,
  UserProfile,
} from '@/lib/types';
import { getEntries, getProfile } from '@/lib/storage';
import { calcStreak, calcWeightedScore, daysUntil } from '@/lib/utils';

const CompanionChat = dynamic(() => import('@/components/CompanionChat'), {
  ssr: false,
  loading: () => <LoadingDots />,
});

const PatternChart = dynamic(() => import('@/components/PatternChart'), {
  ssr: false,
  loading: () => <LoadingDots />,
});

const CopingStrategies = dynamic(
  () => import('@/components/CopingStrategies'),
  {
    ssr: false,
    loading: () => <LoadingDots />,
  }
);

export default function HomePage() {
  const [analysis, setAnalysis] = useState<AnalysisResultType | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [currentMood, setCurrentMood] = useState(3);
  const [currentStress, setCurrentStress] = useState(3);
  const analysisRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEntries(getEntries());
    setProfile(getProfile());
    setReady(true);
  }, []);

  useEffect(() => {
    if (analysis) {
      analysisRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      analysisRef.current?.querySelector<HTMLElement>('h2')?.focus();
    }
  }, [analysis]);

  const handleAnalysis = useCallback((result: AnalysisResultType | null) => {
    setAnalysis(result);
  }, []);

  const handleEntriesSaved = useCallback((nextEntries: JournalEntry[]) => {
    setEntries(nextEntries);
  }, []);

  const handleProfileComplete = useCallback((nextProfile: UserProfile) => {
    setProfile(nextProfile);
  }, []);

  const handleMoodStressChange = useCallback((mood: number, stress: number) => {
    setCurrentMood(mood);
    setCurrentStress(stress);
  }, []);

  const latestEntry = entries[0];
  const wellnessScore = useMemo(
    () =>
      calcWeightedScore(
        latestEntry?.mood ?? currentMood,
        latestEntry?.stress ?? currentStress
      ),
    [currentMood, currentStress, latestEntry]
  );
  const streak = useMemo(() => calcStreak(entries, Date.now()), [entries]);
  const examDays = useMemo(
    () => (profile ? daysUntil(profile.examDate, Date.now()) : 0),
    [profile]
  );
  const detectedPattern = useMemo(
    () => (entries.length >= 3 ? (analysis?.patterns[0] ?? null) : null),
    [analysis, entries.length]
  );

  if (!ready) {
    return (
      <main
        id="main-content"
        className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10"
        aria-busy="true"
      >
        <LoadingDots />
      </main>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={handleProfileComplete} />;
  }

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 sm:py-14"
    >
      <Header
        profile={profile}
        streak={streak}
        daysToExam={examDays}
        wellnessScore={wellnessScore}
      />

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-8">
          <JournalForm
            profile={profile}
            entries={entries}
            onAnalysis={handleAnalysis}
            onSaveEntries={handleEntriesSaved}
            onMoodStressChange={handleMoodStressChange}
          />
          <div ref={analysisRef} className="scroll-mt-6">
            <AnalysisResult analysis={analysis} />
          </div>
          <div ref={chatRef}>
            <Suspense fallback={<LoadingDots />}>
              <CompanionChat
                analysis={analysis}
                profile={profile}
                currentMood={currentMood}
              />
            </Suspense>
          </div>
        </section>

        <aside className="space-y-8">
          {detectedPattern ? (
            <section
              role="status"
              className="glass animate-fade-up rounded-4xl p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                Pattern detected
              </p>
              <p className="mt-2 text-sm text-slate-700">{detectedPattern}</p>
            </section>
          ) : null}
          <Suspense fallback={<LoadingDots />}>
            <CopingStrategies stress={currentStress} />
          </Suspense>
          <Suspense fallback={<LoadingDots />}>
            <PatternChart entries={entries} />
          </Suspense>
        </aside>
      </div>
    </main>
  );
}
