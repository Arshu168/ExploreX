/**
 * @file ErrorBoundary.tsx
 * @description Enterprise-grade React Error Boundary component for ExploreX.
 * 
 * In React, an Error Boundary is a class component that catches JavaScript errors
 * anywhere in its child component tree, logs those errors, and displays a resilient
 * fallback UI instead of crashing the entire application with a blank screen.
 * 
 * Features:
 * - Catches uncaught runtime exceptions in child component render cycles.
 * - Displays an interactive recovery screen with error telemetry and action buttons.
 * - Supports custom fallback components or default glassmorphism UI.
 * - Provides retry/recovery mechanism (resets error state without full page reload).
 * - Diagnostic copy-to-clipboard error stack for developer reporting.
 * - Modular design: can wrap the entire app or isolated views (e.g. Map, AI Chat).
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export interface ErrorBoundaryProps {
  /** Child nodes protected by this boundary */
  children: ReactNode;
  /** Optional custom fallback component or render function */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Optional callback triggered when an error is caught (for logging or analytics) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional callback triggered when the user resets the boundary */
  onReset?: () => void;
  /** Name of the boundary or section for contextual reporting */
  sectionName?: string;
  /** React key for resetting boundary on key change */
  key?: React.Key;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showDetails: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    };
  }

  /**
   * Static lifecycle invoked after an error has been thrown by a descendant component.
   * Updates state so the next render shows the fallback UI.
   */
  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  /**
   * Lifecycle invoked after an error has been thrown by a descendant component.
   * Logs error details and dispatches telemetry/reporting if configured.
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Console logging with distinct formatting for debugging
    console.error(
      `[ExploreX ErrorBoundary Caught Exception in "${this.props.sectionName || 'Application Root'}"]`,
      error,
      errorInfo
    );

    // Trigger optional parent handler
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerErr) {
        console.error('[ExploreX ErrorBoundary] onError callback failed:', handlerErr);
      }
    }
  }

  /**
   * Resets the boundary state, attempting to re-render children.
   */
  public resetBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Copies formatted diagnostic report to clipboard for bug tickets.
   */
  public copyErrorDetails = (): void => {
    const { error, errorInfo } = this.state;
    const { sectionName } = this.props;

    const report = [
      `=== ExploreX Error Telemetry Report ===`,
      `Section: ${sectionName || 'Global Root'}`,
      `Timestamp: ${new Date().toISOString()}`,
      `Error Name: ${error?.name || 'Error'}`,
      `Message: ${error?.message || 'Unknown error'}`,
      `\n--- Stack Trace ---`,
      error?.stack || 'No stack trace available',
      `\n--- Component Stack ---`,
      errorInfo?.componentStack || 'No component stack available',
      `======================================`,
    ].join('\n');

    navigator.clipboard.writeText(report).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    });
  };

  public render(): ReactNode {
    const { hasError, error, errorInfo, copied, showDetails } = this.state;
    const { children, fallback, sectionName } = this.props;

    if (!hasError) {
      return children;
    }

    // If custom fallback provided
    if (typeof fallback === 'function') {
      return fallback(error || new Error('Unknown error'), this.resetBoundary);
    }
    if (fallback) {
      return fallback;
    }

    // Default high-polish Fallback UI
    return (
      <div 
        role="alert" 
        aria-live="assertive"
        className="min-h-[350px] w-full flex items-center justify-center p-6 bg-slate-900/90 text-slate-100 rounded-2xl border border-rose-500/30 backdrop-blur-md shadow-2xl my-4"
      >
        <div className="max-w-xl w-full text-center space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto shadow-inner">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40">
              {sectionName ? `${sectionName} Error Boundary` : 'Component Error Shield'}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Something went wrong in this view
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              ExploreX caught an unexpected rendering error. Your other tabs and saved data remain intact.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={this.resetBoundary}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Reload App
            </button>

            <button
              onClick={this.copyErrorDetails}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
              title="Copy error details to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Details!' : 'Copy Diagnostic'}
            </button>
          </div>

          {/* Technical Diagnostics Accordion */}
          <div className="text-left pt-2">
            <button
              onClick={() => this.setState({ showDetails: !showDetails })}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-950/50 rounded-lg border border-slate-800 transition cursor-pointer"
            >
              <span>Technical Diagnostics: {error?.name || 'Error'}: {error?.message}</span>
              {showDetails ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>

            {showDetails && (
              <div className="mt-2 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs font-mono text-rose-300/90 overflow-x-auto max-h-48 space-y-2">
                <p className="font-semibold text-rose-400">{error?.toString()}</p>
                {error?.stack && (
                  <pre className="text-[11px] leading-relaxed text-slate-400 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
                {errorInfo?.componentStack && (
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Component Stack:</span>
                    <pre className="text-[10px] leading-relaxed text-slate-400 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Functional Higher-Order Component (HOC) for wrapping any React component
 * with an ErrorBoundary.
 * 
 * @example
 * const SafeInteractiveMap = withErrorBoundary(InteractiveMapView, 'Interactive Map');
 */
export function withErrorBoundary<P extends object>(
  ComponentToWrap: React.ComponentType<P>,
  sectionName?: string,
  fallback?: ReactNode
): React.FC<P> {
  const WrappedWithBoundary: React.FC<P> = (props: P) => (
    <ErrorBoundary sectionName={sectionName} fallback={fallback}>
      <ComponentToWrap {...props} />
    </ErrorBoundary>
  );

  WrappedWithBoundary.displayName = `WithErrorBoundary(${ComponentToWrap.displayName || ComponentToWrap.name || 'Component'})`;
  return WrappedWithBoundary;
}

export default ErrorBoundary;
