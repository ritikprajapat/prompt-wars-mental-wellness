'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '@/lib/logger';
import { copy } from '@/lib/copy';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time errors in its subtree and shows a recoverable fallback
 * instead of crashing the whole app. The reset button clears the error state
 * so the children can re-mount and retry.
 */
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logError('ErrorBoundary caught an error', error, info.componentStack);
  }

  private readonly handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div
          role="alert"
          className="glass space-y-3 rounded-4xl p-6 text-center"
        >
          <p className="font-display text-lg font-bold text-slate-900">
            {copy.common.error}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:shadow-glow"
          >
            {copy.common.retry}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
