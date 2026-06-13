"use client";

export default function ProgressBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-500">
        <span>{label}</span>
        <span className="text-slate-700">
          {value}/{max}
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-slate-200/70"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
