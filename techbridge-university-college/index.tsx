
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch rendering errors in the component tree.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("TUC System Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-tuc-beige p-4 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-tuc-maroon">
            <h1 className="text-2xl font-black text-tuc-maroon mb-4 uppercase tracking-tighter">System Error</h1>
            <p className="text-tuc-slate mb-6">We encountered a temporary bridge failure. Our engineers are restoring the connection.</p>
            <div className="bg-gray-50 text-gray-700 p-4 rounded-xl text-left text-sm overflow-auto max-h-48 mb-6 font-mono border border-gray-200">
              {this.state.error?.message || "Unknown Connection Failure"}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-tuc-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-tuc-gold hover:text-tuc-maroon transition-all w-full uppercase tracking-widest shadow-lg"
            >
              Re-establish Connection
            </button>
          </div>
        </div>
      );
    }

    return this.props.children || null;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
