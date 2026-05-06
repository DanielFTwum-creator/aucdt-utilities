
import React, { useState, useEffect, ReactNode } from 'react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}
export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyle = "px-6 py-2 font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#081410] transition-transform transform hover:scale-105 duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  
  const variantStyles = {
    primary: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400',
    secondary: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    outline: 'bg-transparent border-2 border-yellow-600 text-yellow-500 hover:bg-yellow-600 hover:text-white focus:ring-yellow-600',
  };

  return (
    <button className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: ReactNode;
}
export const Select = ({ children, className = '', ...props }: SelectProps) => (
  <select
    className={`w-full p-3 border-2 border-yellow-600/50 rounded-lg bg-black/30 text-[#eaf0ed] shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </select>
);


// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = ({ className = '', ...props }: InputProps) => (
    <input
        className={`w-full p-3 border-2 border-yellow-600/50 rounded-lg bg-black/30 text-[#eaf0ed] shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-yellow-600 transition-all duration-200 ${className}`}
        {...props}
    />
);


// --- Spinner ---
interface SpinnerProps {
    showTimer?: boolean;
}
export const Spinner = ({ showTimer = false }: SpinnerProps) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!showTimer) return;

        const timer = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [showTimer]);
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col justify-center items-center p-8">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-600"></div>
            {showTimer && (
                <p className="text-lg font-mono text-yellow-600 mt-4" data-testid="loading-timer">
                    {formatTime(elapsed)}
                </p>
            )}
        </div>
    );
};

// --- Card ---
interface CardProps {
    children: ReactNode;
    className?: string;
}
export const Card = ({ children, className = '', ...props }: CardProps) => (
    <div className={`bg-[#0d1f1a] p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 ${className}`} {...props}>
        {children}
    </div>
);

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  const isMainModal = title === 'Quiz Audit Log';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-[#0d1f1a] border-2 border-yellow-600/30 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[#0d1f1a]/80 backdrop-blur-sm p-4 border-b border-yellow-600/30 flex justify-between items-center">
          <h2 className="text-xl font-bold text-yellow-500">{title}</h2>
          <button 
            data-testid={isMainModal ? 'audit-log-close-button' : 'audit-log-details-close-button'}
            onClick={onClose} 
            className="text-2xl text-gray-400 hover:text-yellow-500"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};