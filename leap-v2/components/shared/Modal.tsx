import React, { useId, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryAction?: () => void;
  primaryActionLabel?: string;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, primaryAction, primaryActionLabel, secondaryAction, secondaryActionLabel }) => {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements?.[0];
        const lastElement = focusableElements?.[focusableElements.length - 1];

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement?.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement?.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        firstElement?.focus();

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" 
      onClick={onClose}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby={titleId}
    >
      <div 
        ref={modalRef} 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md animate-fade-in" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg flex justify-end space-x-3">
          {secondaryAction && secondaryActionLabel && (
            <button
              onClick={secondaryAction}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              {secondaryActionLabel}
            </button>
          )}
          {primaryAction && primaryActionLabel && (
            <button
              onClick={primaryAction}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {primaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};