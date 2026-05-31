import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-400',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-400 dark:text-slate-300 dark:hover:bg-slate-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-400',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-60 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="inline-flex animate-spin">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}

      {icon && iconPosition === 'left' && !loading && (
        <span className="inline-flex">{icon}</span>
      )}

      {children && <span>{children}</span>}

      {icon && iconPosition === 'right' && !loading && (
        <span className="inline-flex">{icon}</span>
      )}
    </button>
  );
}
