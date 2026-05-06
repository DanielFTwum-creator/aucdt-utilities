import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const config = {
    success: { icon: CheckCircle, color: 'text-tuc-gold' },
    error: { icon: AlertCircle, color: 'text-red-500' },
    warning: { icon: AlertTriangle, color: 'text-amber-500' },
    info: { icon: Info, color: 'text-tuc-gold' },
  };

  const style = config[toast.type];
  const Icon = style.icon; // Use the icon component directly

  return (
    <div 
      role="alert"
      className="relative flex items-start p-6 mb-4 w-full border border-tuc-gold/30 bg-white/95 dark:bg-tuc-ink/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-fade-in transition-colors duration-500"
    >
      <div className={`flex-shrink-0 mr-4 mt-1 ${style.color}`}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="flex-1 mr-6">
        <h4 className={`font-label tracking-widest uppercase text-xs mb-1 ${style.color}`}>{toast.title}</h4>
        <p className="font-body italic text-tuc-ink dark:text-white text-lg leading-tight">{toast.message}</p>
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className="absolute top-4 right-4 p-1 text-tuc-ink/20 dark:text-tuc-cream/20 hover:text-tuc-gold transition-colors"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};
