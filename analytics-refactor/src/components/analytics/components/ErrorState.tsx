import React from 'react';

/**
 * Error State Component
 * 
 * Displays a user-friendly error message when data fetching fails
 * Features:
 * - Clear error messaging
 * - Retry button
 * - Support contact information
 * - Accessible error region
 * 
 * @component
 * @param {Object} props
 * @param {Error} props.error - Error object from fetch
 * @param {Function} props.onRetry - Callback to retry data fetch
 * @example
 * return <ErrorState error={error} onRetry={refetch} />
 */
export const ErrorState = ({ error, onRetry }) => {
  // Determine error type and appropriate message
  const getErrorMessage = () => {
    if (!error) return 'An unknown error occurred';
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        icon: '🌐',
        suggestion: 'Try refreshing your browser or checking your network settings.'
      };
    }
    
    if (error.message.includes('timeout')) {
      return {
        title: 'Request Timeout',
        message: 'The server is taking too long to respond.',
        icon: '⏱️',
        suggestion: 'The server might be experiencing high traffic. Please try again in a moment.'
      };
    }
    
    if (error.message.includes('validation')) {
      return {
        title: 'Data Validation Error',
        message: 'The data received from the server is invalid.',
        icon: '⚠️',
        suggestion: 'This might be a temporary issue. Please contact IT support if it persists.'
      };
    }
    
    if (error.message.includes('401') || error.message.includes('403')) {
      return {
        title: 'Authentication Error',
        message: 'You don\'t have permission to access this data.',
        icon: '🔒',
        suggestion: 'Please log out and log back in. Contact IT support if the issue persists.'
      };
    }
    
    if (error.message.includes('404')) {
      return {
        title: 'Data Not Found',
        message: 'The analytics endpoint could not be found.',
        icon: '🔍',
        suggestion: 'The API endpoint might have changed. Please contact IT support.'
      };
    }
    
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return {
        title: 'Server Error',
        message: 'The server encountered an error processing your request.',
        icon: '🔧',
        suggestion: 'This is likely a temporary issue. Please try again in a few minutes.'
      };
    }
    
    return {
      title: 'Error Loading Data',
      message: error.message || 'An unexpected error occurred',
      icon: '❌',
      suggestion: 'Please try again. If the problem persists, contact IT support.'
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div 
      className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-2xl w-full">
        {/* Error card */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Error icon */}
          <div className="text-6xl mb-4">
            {errorInfo.icon}
          </div>
          
          {/* Error title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {errorInfo.title}
          </h2>
          
          {/* Error message */}
          <p className="text-lg text-gray-600 mb-2">
            {errorInfo.message}
          </p>
          
          {/* Suggestion */}
          <p className="text-sm text-gray-500 mb-8">
            {errorInfo.suggestion}
          </p>
          
          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label="Retry loading data"
            >
              🔄 Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              aria-label="Refresh page"
            >
              ↻ Refresh Page
            </button>
          </div>
          
          {/* Technical details (collapsible) */}
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical Details
            </summary>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <pre className="text-xs text-gray-700 overflow-auto">
                {JSON.stringify(
                  {
                    message: error.message,
                    name: error.name,
                    timestamp: new Date().toISOString(),
                    stack: error.stack?.split('\n').slice(0, 3)
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </details>
          
          {/* Support contact */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Contact IT Support
            </p>
            <p className="text-sm text-indigo-600 font-semibold mt-1">
              📧 support@techbridge.edu.gh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Inline Error Message
 * Smaller error indicator for use within components
 * 
 * @component
 * @param {Object} props
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Optional retry callback
 * @example
 * return <InlineError message="Failed to load" onRetry={retry} />
 */
export const InlineError = ({ message, onRetry }) => {
  return (
    <div 
      className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
      role="alert"
    >
      <div className="flex items-start">
        <span className="text-red-500 mr-2">⚠️</span>
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
