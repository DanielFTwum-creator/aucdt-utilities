import React from 'react';

interface InputEnhancedProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  helpText?: string;
}

export const InputEnhanced: React.FC<InputEnhancedProps> = ({ 
  label, 
  error, 
  helpText, 
  className = '', 
  required,
  ...props 
}) => {
  const baseStyles = 'w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-400">{helpText}</p>
      )}
    </div>
  );
};

