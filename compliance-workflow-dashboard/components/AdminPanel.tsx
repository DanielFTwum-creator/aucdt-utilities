import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage, useSimpleHash } from '../hooks';
import { AuditLogEntry } from '../types';
import { ShieldCheck, Lock } from './icons';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [passwordHash, setPasswordHash] = useLocalStorage<string | null>('admin-password-hash', null);
  const [auditLog, setAuditLog] = useLocalStorage<AuditLogEntry[]>('admin-audit-log', []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const hash = useSimpleHash();

  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      // Small timeout ensures the modal is fully mounted and visible before focusing
      const timer = setTimeout(() => passwordInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAuthenticated]);

  const addLog = (action: string) => {
    const newLogEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      action,
    };
    // Prepend to keep the log sorted by most recent
    setAuditLog(currentLog => [newLogEntry, ...currentLog]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordHash) { // First time setup
      if (passwordInput.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      const newHash = await hash(passwordInput);
      setPasswordHash(newHash);
      addLog('Admin password set.');
      setIsAuthenticated(true);
      setError('');
      setPasswordInput('');
    } else { // Login
      const inputHash = await hash(passwordInput);
      if (inputHash === passwordHash) {
        addLog('Admin logged in.');
        setIsAuthenticated(true);
        setError('');
        setPasswordInput('');
      } else {
        addLog('Failed login attempt.');
        setError('Incorrect password.');
      }
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const newHash = await hash(newPassword);
    setPasswordHash(newHash);
    addLog('Admin password changed.');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password changed successfully.');
  };

  const handleLogout = () => {
    addLog('Admin logged out.');
    setIsAuthenticated(false);
    onClose();
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs?')) {
        addLog('Audit logs cleared.');
        setAuditLog([auditLog[0]]); // Keep the "cleared" log entry
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm" aria-modal="true" role="dialog" aria-labelledby="admin-panel-title">
      <div className={`hc-bg hc-border bg-white dark:bg-[#2D241E] border dark:border-[#C5A059]/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8`}>
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-[#C5A059]/20 pb-4">
            <h2 id="admin-panel-title" className="text-2xl font-bold text-[#2D241E] dark:text-[#C5A059] hc-text-yellow">Admin Section</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-[#C5A059] dark:text-gray-400 dark:hover:text-[#C5A059] hc-text text-2xl leading-none transition-colors" aria-label="Close admin panel">&times;</button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin}>
            <h3 className="text-lg font-semibold mb-2 text-[#3E3228] dark:text-[#EAE0D5] hc-text">
                {passwordHash ? 'Admin Login' : 'Create Admin Password'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#C5A059]/80 mb-4 hc-text">
                {passwordHash ? 'Enter the password to access the admin section.' : 'Create a password to secure the admin section. Minimum 8 characters.'}
            </p>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#C5A059]/70" />
              <input
                ref={passwordInputRef}
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] dark:bg-[#1F1A17] dark:border-[#C5A059]/30 dark:text-[#EAE0D5] dark:placeholder-gray-500"
                aria-label="Admin password"
                aria-invalid={!!error}
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2" role="alert">{error}</p>}
            <button type="submit" className="mt-4 w-full bg-[#C5A059] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#B08D4C] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A059] dark:ring-offset-[#2D241E]">
              {passwordHash ? 'Login' : 'Set Password'}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-700 dark:text-green-400">Authenticated</span>
                </div>
                <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">Logout</button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-[#C5A059]/30 rounded-lg bg-gray-50/50 dark:bg-[#1F1A17]/30">
                <h3 className="text-lg font-semibold mb-2 text-[#3E3228] dark:text-[#EAE0D5] hc-text">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-3">
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#1F1A17] dark:border-[#C5A059]/30 dark:text-[#EAE0D5] focus:border-[#C5A059] focus:ring-[#C5A059]" aria-label="New admin password" aria-invalid={!!error}/>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="w-full p-2 border border-gray-300 rounded-md dark:bg-[#1F1A17] dark:border-[#C5A059]/30 dark:text-[#EAE0D5] focus:border-[#C5A059] focus:ring-[#C5A059]" aria-label="Confirm new admin password" aria-invalid={!!error}/>
                    {error && <p className="text-red-500 dark:text-red-400 text-sm" role="alert">{error}</p>}
                    <button type="submit" className="bg-[#C5A059] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#B08D4C] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A059] dark:ring-offset-[#2D241E]">Update Password</button>
                </form>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-[#3E3228] dark:text-[#EAE0D5] hc-text">Audit Log</h3>
                <button onClick={clearLogs} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">Clear Logs</button>
              </div>
              <div role="log" className="bg-[#F9F7F2] dark:bg-[#1F1A17] border border-gray-200 dark:border-[#C5A059]/30 rounded-lg p-3 h-64 overflow-y-auto shadow-inner" tabIndex={0} aria-label="Audit Log">
                {auditLog.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                    {auditLog.map((log, index) => (
                        <li key={index} className="font-mono text-gray-700 dark:text-[#C5A059]/90 border-b border-gray-100 dark:border-[#C5A059]/10 last:border-0 pb-1">
                        <span className="text-gray-400 dark:text-gray-500 mr-2">[{new Date(log.timestamp).toLocaleString()}]</span>
                        {log.action}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-500 text-center pt-8">No audit logs found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;