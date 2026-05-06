
import React, { useState } from 'react';
import { AuthService } from '../services/AuthService';
import Modal from './ui/Modal';

interface LoginModalProps {
    onLoginSuccess: () => void;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const result = await AuthService.login(username, password);
        
        if (result.success) {
            onLoginSuccess();
        } else {
            setError(result.message || 'Login failed');
        }
        setIsLoading(false);
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold text-tuc-brown-dark mb-4">TUC Admin Access</h3>
                <p className="text-gray-600 mb-6">Enter your credentials to access the administration panel.</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tuc-gold focus:border-tuc-gold"
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tuc-gold focus:border-tuc-gold"
                        placeholder="Password"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-tuc-maroon text-white rounded-lg hover:bg-tuc-maroon-dark disabled:opacity-50">
                        {isLoading ? 'Verifying...' : 'Login'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LoginModal;
