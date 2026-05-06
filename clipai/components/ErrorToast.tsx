import React, { useEffect } from 'react';
import { XIcon } from '../constants';

interface ErrorToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up" role="alert">
      <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 max-w-md">
        <div className="flex-1">
          <p className="font-medium text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 -m-1 text-white/80 hover:text-white transition-colors"
          title="Dismiss error"
          aria-label="Dismiss error message"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default ErrorToast;