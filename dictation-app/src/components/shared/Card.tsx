import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
    elevated: 'bg-white dark:bg-slate-900 shadow-lg shadow-slate-900/10 dark:shadow-black/20',
    outlined: 'bg-transparent dark:bg-transparent border-2 border-slate-300 dark:border-slate-700',
  };

  const paddingStyles = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    none: 'p-0',
  };

  return (
    <div
      className={`
        rounded-xl transition-all
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
