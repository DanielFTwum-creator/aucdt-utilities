import React from 'react';
import { CheckboxProps } from '../../types';

const Checkbox: React.FC<CheckboxProps> = ({ label, error, className = '', ...props }) => {
  const id = props.id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        className={`form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-primary dark:focus:ring-primary ${
          error ? 'border-error focus:ring-error' : ''
        }`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm text-text-light dark:text-text-dark cursor-pointer">
          {label}
        </label>
      )}
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Checkbox;