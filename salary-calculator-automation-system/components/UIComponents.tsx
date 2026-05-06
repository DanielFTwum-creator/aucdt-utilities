import React from 'react';

// --- Card Component ---
interface CardProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, actions }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      {actions && <div>{actions}</div>}
    </div>
    <div>{children}</div>
  </div>
);

// --- Input Component ---
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => (
  <input
    {...props}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
  />
);

// --- Select Component ---
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = ({ children, ...props }) => (
    <select
        {...props}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent sm:text-sm"
    >
        {children}
    </select>
);


// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150';
  
  const variantClasses = {
    primary: 'border-transparent bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary',
    secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-brand-accent',
    icon: 'p-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-100 focus:ring-brand-accent',
  };

  const sizeClasses = variant === 'icon' ? 'p-2' : 'px-4 py-2';
  
  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${className || ''}`}
    >
      {children}
    </button>
  );
};

// --- ToggleSwitch Component ---
interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
    return (
        <button
            type="button"
            className={`${enabled ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2`}
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
        >
            <span
                aria-hidden="true"
                className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );
};
