"use client";

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
  return (
    <div
      role="radiogroup"
      aria-label="Mood"
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
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                onChange(MOODS[(index + 1) % MOODS.length].value);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                onChange(MOODS[(index - 1 + MOODS.length) % MOODS.length].value);
              }
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-3 text-center transition duration-200 active:scale-95 ${
              selected
                ? "border-transparent bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft"
                : "border-slate-200 bg-white/70 text-slate-500 hover:border-violet-300 hover:bg-white"
            }`}
          >
            <span className="text-2xl leading-none">{option.emoji}</span>
            <span className="block w-full truncate text-[11px] font-medium leading-tight">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
