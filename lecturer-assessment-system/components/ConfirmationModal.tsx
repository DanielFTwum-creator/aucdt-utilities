
import React from 'react';
import { CheckCircleIcon } from './icons';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, confirmText = "OK" }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-brand-surface rounded-lg shadow-xl p-6 m-4 max-w-sm w-full text-center animate-fade-in-up">
                <CheckCircleIcon className="mx-auto h-16 w-16 text-brand-accent mb-4" />
                <h3 className="text-2xl font-semibold text-brand-text-primary">{title}</h3>
                <p className="text-brand-text-primary/80 mt-2">{message}</p>
                <div className="mt-6">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-brand-primary text-brand-text-light py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;