import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
  icon?: boolean;
  closeButton?: boolean;
}

export function Alert({
  variant = 'info',
  title,
  onClose,
  icon = true,
  closeButton = false,
  className = '',
  children,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const variantConfig = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      text: 'text-blue-800 dark:text-blue-300',
      title: 'text-blue-900 dark:text-blue-200',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
      text: 'text-green-800 dark:text-green-300',
      title: 'text-green-900 dark:text-green-200',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      text: 'text-amber-800 dark:text-amber-300',
      title: 'text-amber-900 dark:text-amber-200',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
      text: 'text-red-800 dark:text-red-300',
      title: 'text-red-900 dark:text-red-200',
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      role="alert"
      className={`
        border rounded-lg p-4
        ${config.bg} ${config.border}
        ${className}
      `}
      {...props}
    >
      <div className="flex gap-3">
        {icon && <div className="flex-shrink-0 mt-0.5">{config.icon}</div>}

        <div className="flex-grow">
          {title && <h3 className={`font-semibold ${config.title}`}>{title}</h3>}
          <div className={config.text}>{children}</div>
        </div>

        {closeButton && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Close alert"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
