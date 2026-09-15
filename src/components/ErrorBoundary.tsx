import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-[#d4ff00]/10 border border-[#d4ff00]/30 text-[#d4ff00] flex items-center justify-center font-mono font-black text-2xl mb-6 shadow-[0_0_30px_rgba(212,255,0,0.15)]">
            !
          </div>
          <h1 className="text-2xl font-black mb-2">THE 1% Terminal Link Notice</h1>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            The application encountered a initialization interruption. If you are viewing on GitHub Pages, ensure your browser allows third-party storage or reload below.
          </p>
          {this.state.error && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs font-mono text-rose-400 max-w-lg overflow-x-auto mb-6 text-left">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-[#d4ff00] text-[#070a12] font-black uppercase text-xs tracking-wider cursor-pointer shadow-lg hover:bg-[#bbf426] transition-all"
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
