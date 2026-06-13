"use client";

import { useState } from "react";

const MOODS = [
  { label: "Very low", value: 1, emoji: "😔" },
  { label: "Low", value: 2, emoji: "🙁" },
  { label: "Neutral", value: 3, emoji: "😐" },
  { label: "Good", value: 4, emoji: "🙂" },
  { label: "Very good", value: 5, emoji: "😄" },
];

export default function MoodSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  return (
    <div role="radiogroup" aria-label="Mood" className="grid grid-cols-5 gap-2 sm:gap-3">
      {MOODS.map((option, index) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          tabIndex={focusedIndex === index ? 0 : -1}
          onClick={() => onChange(option.value)}
          onFocus={() => setFocusedIndex(index)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              const next = (index + 1) % MOODS.length;
              setFocusedIndex(next);
              onChange(MOODS[next].value);
            }
            if (event.key === "ArrowLeft") {
              const prev = (index - 1 + MOODS.length) % MOODS.length;
              setFocusedIndex(prev);
              onChange(MOODS[prev].value);
            }
          }}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-3 text-center transition duration-200 ${value === option.value ? "border-transparent bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft" : "border-slate-200 bg-white/70 text-slate-500 hover:border-violet-200 hover:bg-white"}`}
        >
          <span className="text-2xl leading-none">{option.emoji}</span>
          <span className="block w-full truncate text-[11px] font-medium leading-tight">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}
