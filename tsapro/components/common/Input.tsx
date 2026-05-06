import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  isOverridden?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, isOverridden = false, ...props }, ref) => {
  const inputElement = (
      <input
        id={id}
        ref={ref}
        data-testid="focus-indicator"
        data-component="input"
        data-overridden={isOverridden}
        className="block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 sm:text-sm"
        {...props}
      />
  );

  if (!label) {
    return inputElement;
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1" data-component="label">
        {label}
      </label>
      {inputElement}
    </div>
  );
});

export default Input;