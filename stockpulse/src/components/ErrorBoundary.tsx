import React from 'react';

interface Props { children: React.ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
          <p className="text-red-500 font-semibold">Something went wrong loading this view.</p>
          <pre className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-lg overflow-auto text-left whitespace-pre-wrap">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => (this as any).setState({ error: null })}
            className="text-sm text-indigo-500 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}
