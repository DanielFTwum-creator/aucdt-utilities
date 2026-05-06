import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8" aria-label="Loading content">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      <p className="text-gray-600 dark:text-gray-400 font-semibold">Generating your flyer...</p>
    </div>
  );
};

export default LoadingSpinner;