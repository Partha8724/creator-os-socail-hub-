import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // @ts-ignore
      if (this.props.fallback) {
        // @ts-ignore
        return this.props.fallback;
      }
      return (
        <div className="smart-card p-12 flex flex-col items-center justify-center text-center border-red-500/20 bg-red-500/5 min-h-[400px]">
          <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center rounded-3xl mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Component Failure</h2>
          <p className="text-[#A1A1A6] font-medium text-sm mb-8 max-w-md">
            The orbital link to this interface node encountered an unexpected failure.
            <br />
            {this.state.error?.message}
          </p>
          <button 
            // @ts-ignore
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-6 py-3 bg-[#1C1C1E] border border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-white uppercase tracking-widest"
          >
            <RefreshCw className="w-4 h-4" /> Reset Node
          </button>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}
