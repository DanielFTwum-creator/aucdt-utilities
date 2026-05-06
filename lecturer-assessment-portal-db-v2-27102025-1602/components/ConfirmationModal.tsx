import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 p-8 rounded-lg shadow-xl w-full max-w-md" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-red-400">
            <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white">{title}</h2>
            <div className="text-sm text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-slate-300 leading-relaxed">
                {children}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 [.high-contrast_&]:bg-black [.high-contrast_&]:text-white [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 [.high-contrast_&]:bg-red-500 [.high-contrast_&]:hover:bg-red-600 transition-colors font-bold"
          >
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;