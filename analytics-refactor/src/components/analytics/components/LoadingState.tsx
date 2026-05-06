import React from 'react';

/**
 * Loading State Component
 * 
 * Displays an animated loading screen while data is being fetched
 * Features:
 * - Animated gradient background
 * - Pulsing skeleton loader
 * - Accessible loading message
 * 
 * @component
 * @param {Object} props
 * @param {string} props.message - Loading message to display
 * @example
 * return <LoadingState message="Loading analytics..." />
 */
export const LoadingState = ({ message = 'Loading data...' }) => {
  return (
    <div 
      className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="max-w-2xl w-full">
        {/* Main loading card */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Animated spinner */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              {/* Outer ring */}
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              {/* Spinning ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Loading message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {message}
          </h2>
          <p className="text-gray-600 mb-8">
            This should only take a moment...
          </p>
          
          {/* Skeleton placeholders for charts */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hidden text for screen readers */}
        <span className="sr-only">
          Loading analytics dashboard. Please wait while we retrieve your data.
        </span>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

/**
 * Inline Loading Spinner
 * Smaller loading indicator for use within components
 * 
 * @component
 * @param {Object} props
 * @param {string} props.size - Size of spinner (sm, md, lg)
 * @example
 * return <InlineLoader size="sm" />
 */
export const InlineLoader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <div 
      className={`inline-block ${sizeClasses[size]} border-2 border-transparent border-t-indigo-600 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingState;
