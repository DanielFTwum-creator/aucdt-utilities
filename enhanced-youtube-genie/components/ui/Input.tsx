import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({ label, name, error, helpText, className, ...props }) => {
  const inputClasses = `block w-full bg-gray-900/50 border rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-500 focus:outline-none sm:text-sm transition duration-200 ease-in-out
    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'}
    ${className || ''}
  `;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        className={inputClasses}
        {...props}
      />
      {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};


