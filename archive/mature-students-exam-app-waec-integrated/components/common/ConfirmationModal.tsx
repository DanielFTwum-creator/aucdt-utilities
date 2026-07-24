
import React from 'react';
import { COLORS } from '../../constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-md w-full border-t-4 transform transition-all duration-300 scale-95" style={{ borderColor: COLORS.aucdtGold }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>{title}</h2>
        <p className="text-lg mb-6" style={{ color: COLORS.aucdtDarkGray }}>{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="py-2 px-6 rounded-lg font-semibold transition-colors" style={{ backgroundColor: COLORS.aucdtLightGray, color: COLORS.aucdtDeepBrown }}>Cancel</button>
          <button onClick={onConfirm} className="py-2 px-6 rounded-lg font-bold text-white transition-transform transform hover:scale-105" style={{ backgroundColor: COLORS.aucdtGreen }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
