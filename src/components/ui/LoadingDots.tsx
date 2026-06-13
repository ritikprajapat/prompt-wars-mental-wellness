"use client";

export default function LoadingDots() {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-1.5">
      <span className="sr-only">Loading…</span>
      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </div>
  );
}
