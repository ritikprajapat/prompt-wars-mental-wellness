'use client';

import { memo, useMemo } from 'react';

const strategies = [
  {
    title: 'Breathing exercises',
    steps: [
      'Find a quiet place',
      'Breathe in for 4 seconds',
      'Breathe out for 6 seconds',
      'Repeat 5 times',
    ],
  },
  {
    title: 'Motivation reset',
    steps: [
      'Write the smallest useful study win',
      'Open only that chapter or question set',
      'Study for 12 focused minutes',
      'Mark the attempt as progress',
    ],
  },
  {
    title: 'Break planning',
    steps: [
      'List the next small task',
      'Set a 10-minute break',
      'Reward yourself after completion',
      'Reflect on progress',
    ],
  },
  {
    title: 'Mindful check-in',
    steps: [
      'Notice your body',
      'Label your emotions',
      'Accept without judgement',
      'Write one kind note to yourself',
    ],
  },
  {
    title: 'Peer support',
    steps: [
      'Reach out to a friend',
      'Share one challenge',
      'Ask for encouragement',
      'Plan a short study session together',
    ],
  },
];

function CopingStrategies({ stress }: { stress: number }) {
  const orderedStrategies = useMemo(() => {
    const leadTitle =
      stress >= 5
        ? 'Breathing exercises'
        : stress <= 2
          ? 'Motivation reset'
          : 'Mindful check-in';
    const lead = strategies.find(strategy => strategy.title === leadTitle);
    const rest = strategies.filter(strategy => strategy.title !== leadTitle);
    return lead ? [lead, ...rest] : strategies;
  }, [stress]);

  return (
    <section className="glass animate-fade-up space-y-4 rounded-4xl p-6 sm:p-7">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Coping strategies
        </h2>
        <p className="text-sm text-slate-500">
          Four practical ideas with clear next steps.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {orderedStrategies.map(strategy => (
          <div
            key={strategy.title}
            className="rounded-3xl border border-slate-100 bg-white/60 p-4 transition hover:border-violet-200 hover:shadow-card"
          >
            <h3 className="font-semibold text-slate-800">{strategy.title}</h3>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-600 marker:font-semibold marker:text-violet-400">
              {strategy.steps.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

export default memo(CopingStrategies);
