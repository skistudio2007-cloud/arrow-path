import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

type ComponentClass = new (props: ErrorBoundaryProps) => {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState;
  setState: (updater: Partial<ErrorBoundaryState> | ((prevState: ErrorBoundaryState) => Partial<ErrorBoundaryState>)) => void;
};

export class ErrorBoundary extends (Component as unknown as ComponentClass) {
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black tracking-tight mb-2">
            Game Safely Recovered
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mb-6">
            An unexpected error was safely caught. All your progress is intact.
          </p>

          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 py-3 px-6 rounded-full bg-[#5266fc] hover:bg-[#4357ee] text-white font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resume Game</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
