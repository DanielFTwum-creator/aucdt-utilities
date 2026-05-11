
import React, { useState } from 'react';

interface PasswordModalProps {
    onClose: () => void;
    onSubmit: (password: string) => void;
    isAuthenticating?: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit, isAuthenticating = false }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 m-4 max-w-sm w-full animate-fade-in-up">
                <h2 className="text-2xl font-bold text-center text-brand-primary-dark mb-4">Admin Access</h2>
                <p className="text-center text-brand-text-primary/80 mb-6">Please enter the password to continue.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isAuthenticating}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary disabled:bg-gray-100"
                        placeholder="Password"
                        autoFocus
                    />
                    <div className="mt-6 flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isAuthenticating}
                            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                         <button
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full py-2 px-4 bg-brand-primary text-brand-text-light rounded-md hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {isAuthenticating ? 'Authenticating...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;