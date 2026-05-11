import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch rendering errors in the component tree.
 * Prevents the entire app from crashing by showing a fallback UI.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an analytics service here
    console.error("Critical Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-tuc-beige p-4 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-tuc-maroon">
            <h1 className="text-2xl font-black text-tuc-maroon mb-4 uppercase tracking-tighter">System Alert</h1>
            <p className="text-tuc-slate mb-6">We encountered an interface rendering error. Our system is standing by for restoration.</p>
            <div className="bg-gray-50 text-gray-700 p-4 rounded-xl text-left text-sm overflow-auto max-h-48 mb-6 font-mono border border-gray-200">
              {this.state.error?.message || "Internal Interface Error"}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-tuc-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-tuc-gold hover:text-tuc-maroon transition-all w-full uppercase tracking-widest shadow-lg"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Target root element #root not found in the DOM.");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);