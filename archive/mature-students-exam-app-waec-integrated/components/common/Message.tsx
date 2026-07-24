
import React from 'react';

interface MessageProps {
  text: string;
  type: 'success' | 'error' | 'info';
  onDismiss?: () => void;
}

export const Message: React.FC<MessageProps> = ({ text, type, onDismiss }) => {
  if (!text) return null;

  const baseClasses = "p-4 rounded-lg mb-4 text-center flex justify-between items-center shadow-md";
  const typeClasses = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span>{text}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 font-bold text-xl" aria-label="Dismiss message">&times;</button>
      )}
    </div>
  );
};
