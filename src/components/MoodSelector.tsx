'use client';

import { memo, useCallback } from 'react';

interface MoodOption {
  label: string;
  value: number;
  emoji: string;
}

const MOODS: readonly MoodOption[] = [
  { label: 'Very low', value: 1, emoji: '😔' },
  { label: 'Low', value: 2, emoji: '🙁' },
  { label: 'Neutral', value: 3, emoji: '😐' },
  { label: 'Good', value: 4, emoji: '🙂' },
  { label: 'Very good', value: 5, emoji: '😄' },
];

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
  describedBy?: string;
}

function MoodSelector({ value, onChange, describedBy }: MoodSelectorProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const next = MOODS[(index + 1) % MOODS.length];
        if (next) onChange(next.value);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = MOODS[(index - 1 + MOODS.length) % MOODS.length];
        if (prev) onChange(prev.value);
      }
    },
    [onChange]
  );

  return (
    <div
      role="radiogroup"
      aria-label="Mood"
      {...(describedBy ? { 'aria-describedby': describedBy } : {})}
      className="grid grid-cols-5 gap-2 sm:gap-3"
    >
      {MOODS.map((option, index) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            tabIndex={selected || (value == null && index === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={event => handleKeyDown(event, index)}
            className={`flex min-h-[44px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-3 text-center transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 active:scale-95 ${
              selected
                ? 'border-transparent bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft'
                : 'border-slate-200 bg-white/70 text-slate-500 hover:border-violet-300 hover:bg-white'
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {option.emoji}
            </span>
            <span className="block w-full truncate text-[11px] font-medium leading-tight">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(MoodSelector);
