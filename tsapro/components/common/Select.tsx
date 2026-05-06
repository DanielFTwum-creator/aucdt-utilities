
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1" data-component="label">
        {label}
      </label>
      <select
        id={id}
        data-testid="focus-indicator"
        data-component="select"
        className="block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-2 sm:text-sm rounded-md"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;