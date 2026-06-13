import { memo } from 'react';
import { SCORE_MAX } from '@/lib/constants';
import { clamp } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  className?: string;
}

/**
 * Accessible progress indicator. Conveys its value both visually (fill width)
 * and to assistive tech via the `progressbar` role and aria value attributes.
 */
function ProgressBar({
  value,
  max = SCORE_MAX,
  label,
  className = 'from-brand-400 to-brand-600',
}: ProgressBarProps) {
  const safeMax = max <= 0 ? SCORE_MAX : max;
  const bounded = clamp(value, 0, safeMax);
  const pct = (bounded / safeMax) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={bounded}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuetext={`${bounded} out of ${safeMax}`}
      aria-label={label}
      className="h-2.5 overflow-hidden rounded-full bg-slate-200/70"
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${className}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default memo(ProgressBar);
