import { memo } from 'react';

const TONES: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  moderate: 'bg-amber-100 text-amber-700 ring-amber-200',
  high: 'bg-rose-100 text-rose-700 ring-rose-200',
};

function Badge({ label }: { label: string }) {
  const tone =
    TONES[label.toLowerCase()] ??
    'bg-violet-100 text-violet-700 ring-violet-200';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default memo(Badge);
