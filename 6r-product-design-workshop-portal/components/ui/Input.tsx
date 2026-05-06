import React from 'react';
import { InputProps } from '../../types';

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-light dark:text-text-dark">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200
                   bg-white dark:bg-gray-700 text-text-light dark:text-text-dark
                   border-gray-300 dark:border-gray-600
                   ${error ? 'border-error focus:ring-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-error text-xs mt-1" role="alert">{error}</p>}
    </div>
  );
};

export default Input;