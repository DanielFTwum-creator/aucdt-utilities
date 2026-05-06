import React from 'react';

/**
 * Empty State Component
 * 
 * Displays a friendly message when no data is available
 * Features:
 * - Clear messaging
 * - Action suggestions
 * - Visual illustration
 * - Accessible empty region
 * 
 * @component
 * @param {Object} props
 * @param {string} props.title - Empty state title
 * @param {string} props.message - Empty state message
 * @param {Function} props.onAction - Optional action callback
 * @param {string} props.actionLabel - Label for action button
 * @example
 * return <EmptyState title="No Data" message="No analytics data available" />
 */
export const EmptyState = ({ 
  title = 'No Data Available',
  message = 'There is no analytics data to display at the moment.',
  onAction,
  actionLabel = 'Go to Dashboard'
}) => {
  return (
    <div 
      className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center"
      role="status"
      aria-label="No data available"
    >
      <div className="max-w-2xl w-full">
        {/* Empty state card */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Illustration */}
          <div className="mb-6">
            <svg 
              className="w-48 h-48 mx-auto text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          
          {/* Empty state title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {title}
          </h2>
          
          {/* Empty state message */}
          <p className="text-lg text-gray-600 mb-8">
            {message}
          </p>
          
          {/* Suggestions */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">
              💡 Possible reasons:
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>No admission data has been recorded yet</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your date range filter might be too restrictive</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You might not have permission to view this data</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The database might be temporarily unavailable</span>
              </li>
            </ul>
          </div>
          
          {/* Action button */}
          {onAction && (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              aria-label={actionLabel}
            >
              {actionLabel}
            </button>
          )}
          
          {/* Help section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Need help getting started?
            </p>
            <div className="flex gap-4 justify-center text-sm">
              <a 
                href="/help/analytics" 
                className="text-indigo-600 hover:text-indigo-800 underline"
                aria-label="View documentation"
              >
                📚 View Documentation
              </a>
              <a 
                href="mailto:support@techbridge.edu.gh" 
                className="text-indigo-600 hover:text-indigo-800 underline"
                aria-label="Contact support"
              >
                📧 Contact Support
              </a>
            </div>
          </div>
        </div>
        
        {/* Sample data preview */}
        <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-6 text-white">
          <h4 className="font-semibold mb-2">Expected Data Format:</h4>
          <pre className="text-xs bg-black bg-opacity-30 p-4 rounded overflow-auto">
{`{
  "MONTH": "2025-01",
  "SIGNUPS": "40",
  "APPLICANTS": "24",
  "ACCEPTED": "8",
  "REJECTED": "3",
  "WAITLISTED": "11",
  "REGISTERED": "2"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

/**
 * Inline Empty State
 * Smaller empty state indicator for use within components
 * 
 * @component
 * @param {Object} props
 * @param {string} props.message - Empty state message
 * @example
 * return <InlineEmptyState message="No items to display" />
 */
export const InlineEmptyState = ({ message = 'No data available' }) => {
  return (
    <div 
      className="p-8 text-center text-gray-500"
      role="status"
    >
      <svg 
        className="w-16 h-16 mx-auto mb-4 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
        />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
