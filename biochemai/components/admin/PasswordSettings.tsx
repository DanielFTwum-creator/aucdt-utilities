import React, { useState } from 'react';
import { getAdminConfig, setAdminConfig, addAuditLog } from '../../lib/db';

export const PasswordSettings: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (newPassword !== confirmPassword) {
            setMessage("New passwords do not match.");
            setIsError(true);
            return;
        }

        if (newPassword.length < 8) {
            setMessage("New password must be at least 8 characters long.");
            setIsError(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const storedPassword = await getAdminConfig('adminPassword');
            if (oldPassword !== storedPassword) {
                setMessage("Incorrect old password.");
                setIsError(true);
                await addAuditLog('Password Change Attempt', 'Failed: Incorrect old password.');
            } else {
                await setAdminConfig('adminPassword', newPassword);
                await addAuditLog('Password Changed', 'Administrator password was successfully changed.');
                setMessage("Password changed successfully.");
                setIsError(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
            setIsError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Change Admin Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label htmlFor="old-password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Current Password</label>
                    <input type="password" id="old-password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200" />
                </div>
                <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">New Password</label>
                    <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200" />
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Must be at least 8 characters long.</p>
                </div>
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Confirm New Password</label>
                    <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200" />
                </div>
                
                {message && (
                    <div className={`p-3 rounded-md text-sm ${isError ? 'bg-red-500/20 text-[var(--color-error)]' : 'bg-green-500/20 text-[var(--color-success)]'}`}>
                        {message}
                    </div>
                )}
                
                <div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !oldPassword || !newPassword || !confirmPassword}
                        className="w-full sm:w-auto px-6 py-2.5 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)] transition disabled:bg-[var(--color-text-tertiary)] disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};