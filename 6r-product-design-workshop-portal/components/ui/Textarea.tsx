import React from 'react';
import { TextareaProps } from '../../types';

const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-text-light dark:text-text-dark">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200
                   bg-white dark:bg-gray-700 text-text-light dark:text-text-dark
                   border-gray-300 dark:border-gray-600
                   ${error ? 'border-error focus:ring-error' : ''} ${className}`}
        rows={4}
        {...props}
      ></textarea>
      {error && <p className="text-error text-xs mt-1" role="alert">{error}</p>}
    </div>
  );
};

export default Textarea;