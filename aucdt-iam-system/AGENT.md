# aucdt-iam-system - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for aucdt-iam-system.

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: App.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Logbook } from './components/Logbook';
import { Messages } from './components/Messages';
import { AdminTools } from './components/AdminTools';
import { Documentation } from './components/Documentation';
import ThemeSwitcher from './components/ThemeSwitcher';
import { User, Role, LogEntry, Message, AuditLog, Theme } from './types';
import { INITIAL_USERS, INITIAL_LOGS, INITIAL_MESSAGES, INITIAL_AUDIT } from './services/mockData';

interface LoginProps {
    users: User[];
    onLogin: (u: User) => void;
    setTheme: (t: Theme) => void;
    onRegister: (u: User, pass: string) => Promise<void>;
    customPasswords: Record<string, string>;
}

// Login Component with Password Support for All Users & Registration
const Login: React.FC<LoginProps> = ({ users, onLogin, setTheme, onRegister, customPasswords }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Forgot Password State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Registration State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>(Role.STUDENT);
  const [regAvatar, setRegAvatar] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleUserClick = (u: User) => {
    // Require password for ALL users
    setSelectedUser(u);
    setPassword('');
    setError('');
    setResetEmail(u.email || ''); 
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Mock Authentication Logic
    // Admin: admin123
    // Others: 123456 (default) OR custom password if registered
    let expectedPassword = [REDACTED_CREDENTIAL]
    
    if (customPasswords[selectedUser.id]) {
        expectedPassword = [REDACTED_CREDENTIAL]
    }

    if (password =[REDACTED_CREDENTIAL]
      onLogin(selectedUser);
    } else {
      setError('Invalid password');
    }
  };

  const handleForgotPassword = [REDACTED_CREDENTIAL]
    e.preventDefault();
    setIsResetting(true);

    // Attempt to find user details to populate the API payload correctly
    const userFound = users.find(u => u.email.toLowerCase() === resetEmail.toLowerCase());
    
    // Construct payload according to the sendMail endpoint specification
    const payload = {
      applicantId: userFound ? userFound.id : "guest",
      fullName: userFound ? userFound.name : "AUCDT User",
      message: `A password reset request has been initiated for the AUCDT IAM account associated with ${resetEmail}. Please follow internal procedures to reset the credential.`,
      receiverEmailId: resetEmail,
      senderEmailId: "noreply@aucdt.edu.gh", // System sender
      subject: "AUCDT IAM System - Password Reset Request"
    };
    
    try {
      const response = await fetch('https://portal.audt.edu.gh/aucdt-dev/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`Password reset email successfully sent to ${resetEmail}`);
        setShowResetModal(false);
      } else {
        const errorText = await response.text();
        console.error('Email API Error:', response.status, errorText);
        alert("Failed to send reset email via portal API. Please try again later or contact support.");
      }
    } catch (error) {
      console.error('Email Network Error:', error);
      alert("Network error: Unable to reach the email service. Please check your connection.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setRegAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!regName || !regEmail || !regPassword) return;
      
      setIsRegistering(true);
      
      const newUser: User = {
          id: `u${Date.now()}`,
          name: regName,
          email: regEmail,
          role: regRole,
          avatar: regAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(regName)}&background=random`
      };

      await onRegister(newUser, regPassword);
      
      setIsRegistering(false);
      setShowRegisterModal(false);
      // Clear form
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegAvatar(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200 relative">
      {/* Theme Selector on Hero */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher onThemeChange={setTheme} />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200 dark:border-gray-700 border-t-8 border-t-primary">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-secondary mb-4 shadow-md">
             <i className="fas fa-graduation-cap text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">AUCDT</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Industrial Attachment Management</p>
          <p className="text-xs text-gray-400 mt-1">Asanska University College of Design and Technology</p>
        </div>
        
        {!selectedUser ? (
          <div className="space-y-4">
            <div className="space-y-3" role="list" aria-label="User selection">
                <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">Select your account to login:</p>
                {users.map(u => (
                <button
                    key={u.id}
                    onClick={() => handleUserClick(u)}
                    className="w-full flex items-center p-3 rounded-lg border hover:border-primary hover:bg-red-50 dark:hover:bg-gray-700 dark:border-gray-600 transition-all group focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={`Login as ${u.name} (${u.role})`}
                >
                    <img src={u.avatar} className="w-10 h-10 rounded-full mr-4 object-cover" alt="" aria-hidden="true"/>
                    <div className="text-left">
                    <div className="font-bold text-gray-800 dark:text-white group-hover:text-primary">{u.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">{u.role}</div>
                    </div>
                    <i className="fas fa-chevron-right ml-auto text-gray-400 group-hover:text-primary"></i>
                </button>
                ))}
            </div>
            
            <div className="pt-4 border-t dark:border-gray-700">
                <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="w-full py-2 text-primary dark:text-secondary font-semibold hover:underline text-sm flex items-center justify-center gap-2"
                >
                    <i className="fas fa-user-plus"></i> Register New Account
                </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-center mb-4">
               <div className="inline-block p-2 rounded-full bg-gray-100 dark:bg-gray-700 mb-2">
                 <img src={selectedUser.avatar} className="w-16 h-16 rounded-full object-cover" alt={selectedUser.name} />
               </div>
               <h3 className="text-lg font-bold text-gray-800 dark:text-white">{selectedUser.name}</h3>
               <p className="text-xs text-gray-500">{selectedUser.role}</p>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                placeholder={selectedUser.role === Role.ADMIN ? "Enter password (admin123)" : "Enter password"}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
              <div className="text-right mt-1">
                <button 
                  type="button" 
                  onClick={() => setShowResetModal(true)}
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="flex-1 py-2 rounded-lg bg-primary text-white hover:bg-red-800 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Modal */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700 animate-scale-in">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-500 mb-2">
                  <i className="fas fa-key text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Reset Password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email to receive a reset link.</p>
              </div>
              
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input 
                    id="resetEmail"
                    type="email" 
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder={selectedUser?.email || "user@aucdt.edu.gh"}
                  />
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => setShowResetModal(false)}
                    disabled={isResetting}
                    className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isResetting}
                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center items-center"
                  >
                    {isResetting ? <i className="fas fa-circle-notch fa-spin"></i> : 'Send Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Registration Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 animate-scale-in overflow-y-auto max-h-[90vh]">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
                  <i className="fas fa-user-plus text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Create Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Join the AUCDT IAM System</p>
              </div>
              
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                
                {/* Avatar Upload */}
                <div className="flex flex-col items-center justify-center mb-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary transition-colors group">
                        {regAvatar ? (
                            <img src={regAvatar} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <i className="fas fa-camera text-2xl mb-1"></i>
                                <span className="text-[10px]">Upload</span>
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            aria-label="Upload Profile Picture"
                        />
                        {regAvatar && (
                             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <i className="fas fa-edit text-white"></i>
                             </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Profile Picture (Optional)</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input 
                        type="text" required
                        value={regName} onChange={e => setRegName(e.target.value)}
                        className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        placeholder="e.g. John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input 
                        type="email" required
                        value={regEmail} onChange={e => setRegEmail(e.target.value)}
                        className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        placeholder="e.g. john@aucdt.edu.gh"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select 
                        value={regRole} onChange={e => setRegRole(e.target.value as Role)}
                        className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    >
                        <option value={Role.STUDENT}>Student</option>
                        <option value={Role.ORGANIZATION}>Organization</option>
                        <option value={Role.INSTITUTION}>Institution</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input 
                        type="password" required minLength={6}
                        value={regPassword} onChange={e => setRegPassword(e.target.value)}
                        className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        placeholder="Choose a password"
                    />
                </div>

                <div className="flex space-x-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowRegisterModal(false)}
                    disabled={isRegistering}
                    className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isRegistering}
                    className="flex-1 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex justify-center items-center"
                  >
                    {isRegistering ? <i className="fas fa-circle-notch fa-spin"></i> : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Simple Placeholder for Reports
const Reports: React.FC = () => (
  <div className="p-6 bg-white dark:bg-darkcard rounded-xl shadow-sm text-center py-20 border border-gray-200 dark:border-gray-700">
    <i className="fas fa-file-pdf text-6xl text-red-400 mb-4" aria-hidden="true"></i>
    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Final Report Submission</h2>
    <p className="text-gray-500 mb-6 dark:text-gray-400">Upload your final industrial attachment report (PDF only).</p>
    <label className="cursor-pointer bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-800 transition inline-block focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary" tabIndex={0} role="button" onKeyDown={(e) => {if(e.key === 'Enter' || e.key === ' ') (e.target as HTMLLabelElement).querySelector('input')?.click()}}>
        Select PDF
        <input type="file" className="hidden" accept=".pdf" onChange={() => alert("Mock upload successful!")} />
    </label>
  </div>
);

const App: React.FC = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>({});
  
  // Initialize Theme based on time of day (Dark mode after 6 PM or before 6 AM)
  const [theme, setTheme] = useState<Theme>(() => {
    const hour = new Date().getHours();
    return (hour >= 18 || hour < 6) ? 'dark' : 'light';
  });

  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT);

  // Initialize Theme with High Contrast Support
  useEffect(() => {
    const root = window.document.documentElement;
    // Reset classes
    root.classList.remove('light', 'dark', 'high-contrast');
    
    if (theme === 'high-contrast') {
        // High contrast often works best on dark mode base, plus specific overrides
        root.classList.add('dark');
        root.classList.add('high-contrast');
    } else if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.add('light');
    }
  }, [theme]);

  // Helper to record admin actions
  const logAdminAction = (action: string) => {
    if (currentUser?.role === Role.ADMIN) {
        const newLog: AuditLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            action,
            adminId: currentUser.id
        };
        setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Log login event for all users conceptually, but strictly in audit log for admins or general system events
    if (user.role === Role.ADMIN) {
        const loginLog: AuditLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            action: 'Admin Login Success',
            adminId: user.id
        };
        setAuditLogs(prev => [loginLog, ...prev]);
    }
  };

  const handleLogout = () => {
      if (currentUser?.role === Role.ADMIN) {
          logAdminAction('Admin Logout');
      }
      setCurrentUser(null);
  };

  const handleRegistration = async (newUser: User, pass: string) => {
      // Update state to include new user
      setUserPasswords(prev => ({...prev, [newUser.id]: pass}));
      setAllUsers(prev => [...prev, newUser]);

      // Trigger Helpdesk Notification
      try {
          const response = await fetch('https://portal.audt.edu.gh/aucdt-dev/sendMail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                applicantId: newUser.id,
                fullName: newUser.name,
                message: `System Notification:\nA new user has registered on the AUCDT IAM System.\n\nUser Details:\nName: ${newUser.name}\nEmail: ${newUser.email}\nRole: ${newUser.role}\n\nPlease review and provision necessary access rights.`,
                receiverEmailId: 'helpdesk@aucdt.edu.gh',
                senderEmailId: 'noreply@aucdt.edu.gh',
                subject: `New User Registration - ${newUser.name}`
            })
          });

          if(response.ok) {
              alert("Registration successful. Helpdesk has been notified.");
          } else {
              console.warn("Registration email failed but user created locally.");
              alert("Registration successful (Helpdesk notification failed).");
          }
      } catch (e) {
          console.error("Mail Error:", e);
          alert("Registration successful. (Offline Mode)");
      }
  };

  if (!currentUser) {
    return <Login users={allUsers} onLogin={handleLogin} setTheme={setTheme} onRegister={handleRegistration} customPasswords=[REDACTED_CREDENTIAL]
  }

  return (
    <Router>
      <Layout user={currentUser} theme={theme} setTheme={setTheme} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={currentUser} logs={logs} />} />
          <Route path="/logbook" element={
             (currentUser.role === Role.STUDENT || currentUser.role === Role.ORGANIZATION) 
             ? <Logbook user={currentUser} logs={logs} setLogs={setLogs} /> 
             : <Navigate to="/" /> 
          } />
          <Route path="/messages" element={
            <Messages currentUser={currentUser} users={allUsers} messages={messages} setMessages={setMessages} />
          } />
          <Route path="/reports" element={currentUser.role === Role.STUDENT ? <Reports /> : <Navigate to="/" />} />
          <Route path="/admin" element={
              currentUser.role === Role.ADMIN 
              ? <AdminTools logs={auditLogs} onLogAction={logAdminAction} /> 
              : <Navigate to="/" />
          } />
          <Route path="/docs" element={<Documentation />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
```

### FILE: components/AdminTools.tsx
```typescript
import React, { useEffect, useRef, useState } from 'react';
import { TEST_SUITES, runStepMock } from '../services/mockPuppeteer';
import { AuditLog, TestCase } from '../types';

interface AdminToolsProps {
  logs: AuditLog[];
  onLogAction: (action: string) => void;
}

// Reusable Export Dropdown Component based on best practices
const ExportDropdown: React.FC<{ data: AuditLog[] }> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // "Click Outside" logic to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCopy = async () => {
        const text = JSON.stringify(data, null, 2);
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
                setIsOpen(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setIsOpen(false);
    };

    const handleExportJSON = () => {
        downloadFile(JSON.stringify(data, null, 2), `audit-logs-${Date.now()}.json`, 'application/json');
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Timestamp', 'Action', 'Admin ID'];
        const rows = data.map(log => [
            log.id,
            new Date(log.timestamp).toISOString(),
            `"${log.action.replace(/"/g, '""')}"`, // Escape quotes
            log.adminId
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadFile(csvContent, `audit-logs-${Date.now()}.csv`, 'text/csv');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 shadow-sm"
            >
                <i className="fas fa-download"></i> Export
                <i className={`fas fa-chevron-down text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-fade-in">
                    <div className="py-1">
                        <button onClick={handleCopy} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            {isCopied ? <i className="fas fa-check text-green-500"></i> : <i className="fas fa-copy"></i>}
                            {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                        <button onClick={handleExportCSV} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <i className="fas fa-file-csv text-green-600"></i> Export as CSV
                        </button>
                        <button onClick={handleExportJSON} className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                            <i className="fas fa-file-code text-yellow-600"></i> Export as JSON
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminTools: React.FC<AdminToolsProps> = ({ logs, onLogAction }) => {
  const [activeTab, setActiveTab] = useState<'TESTS' | 'AUDIT'>('TESTS');
  
  // Test Runner State
  const [suites, setSuites] = useState<TestCase[]>(TEST_SUITES);
  const [selectedSuiteId, setSelectedSuiteId] = useState<string>(TEST_SUITES[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  const selectedSuite = suites.find(s => s.id === selectedSuiteId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [suites]);

  const runSuite = async (suiteId: string) => {
    if (isRunning) return;
    setIsRunning(true);
    onLogAction(`Initiated Test Suite: ${suiteId}`);

    // Reset specific suite
    setSuites(prev => prev.map(s => 
      s.id === suiteId 
        ? { ...s, status: 'RUNNING', steps: s.steps.map(step => ({ ...step, status: 'PENDING', screenshotUrl: undefined, duration: undefined })) }
        : s
    ));

    const suiteIndex = suites.findIndex(s => s.id === suiteId);
    if (suiteIndex === -1) return;

    const steps = suites[suiteIndex].steps;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Mark step running
      setSuites(prev => {
        const newSuites = [...prev];
        newSuites[suiteIndex].steps[i].status = 'RUNNING';
        return newSuites;
      });

      // Execute Mock
      try {
        const result = await runStepMock(suiteId, step);
        
        // Mark step passed
        setSuites(prev => {
          const newSuites = [...prev];
          newSuites[suiteIndex].steps[i].status = 'PASSED';
          newSuites[suiteIndex].steps[i].screenshotUrl = result.screenshot;
          newSuites[suiteIndex].steps[i].duration = result.duration;
          return newSuites;
        });
      } catch (e) {
        // Mark failed (Mock shouldn't fail but good for robustness)
        setSuites(prev => {
          const newSuites = [...prev];
          newSuites[suiteIndex].steps[i].status = 'FAILED';
          return newSuites;
        });
      }
    }

    // Mark suite finished
    setSuites(prev => {
      const newSuites = [...prev];
      newSuites[suiteIndex].status = 'PASSED';
      return newSuites;
    });

    setIsRunning(false);
    onLogAction(`Completed Test Suite: ${suiteId} - PASSED`);
  };

  const runAllSuites = async () => {
    if (isRunning) return;
    for (const suite of suites) {
      await runSuite(suite.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'FAILED': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'RUNNING': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Administration</h2>
        <div className="flex space-x-2 bg-white dark:bg-darkcard p-1 rounded-lg border dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('TESTS')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'TESTS' ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <i className="fas fa-robot mr-2"></i> Automated Tests
            </button>
            <button 
                onClick={() => setActiveTab('AUDIT')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'AUDIT' ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
                <i className="fas fa-shield-alt mr-2"></i> Audit Logs
            </button>
        </div>
      </div>

      {activeTab === 'TESTS' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
            {/* Sidebar: Test Suites */}
            <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200">Test Suites</h3>
                    <button 
                        onClick={runAllSuites} 
                        disabled={isRunning}
                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                        {isRunning ? 'Running...' : 'Run All'}
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {suites.map(suite => (
                        <div 
                            key={suite.id}
                            onClick={() => setSelectedSuiteId(suite.id)}
                            className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedSuiteId === suite.id ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{suite.name}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(suite.status)}`}>
                                    {suite.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{suite.description}</p>
                            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div 
                                    className={`h-1.5 rounded-full transition-all duration-500 ${suite.status === 'PASSED' ? 'bg-green-500' : suite.status === 'FAILED' ? 'bg-red-500' : 'bg-primary'}`} 
                                    style={{ width: `${(suite.steps.filter(s => s.status === 'PASSED').length / suite.steps.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main: Execution Console */}
            <div className="lg:col-span-2 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{selectedSuite?.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Puppeteer Execution Log</p>
                    </div>
                    <button 
                        onClick={() => selectedSuite && runSuite(selectedSuite.id)}
                        disabled={isRunning}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 shadow-sm transition-colors"
                    >
                        <i className="fas fa-play mr-2"></i> Run This Suite
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-900 font-mono text-sm" ref={scrollRef}>
                    {selectedSuite?.steps.map((step, idx) => (
                        <div key={step.id} className="flex items-start space-x-3 group">
                            <div className="pt-1">
                                {step.status === 'PENDING' && <div className="w-2 h-2 rounded-full bg-gray-600"></div>}
                                {step.status === 'RUNNING' && <i className="fas fa-circle-notch fa-spin text-blue-400"></i>}
                                {step.status === 'PASSED' && <i className="fas fa-check-circle text-green-400"></i>}
                                {step.status === 'FAILED' && <i className="fas fa-times-circle text-red-400"></i>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-baseline">
                                    <span className={`text-gray-300 ${step.status === 'RUNNING' ? 'text-blue-300 font-bold' : ''}`}>
                                        {step.description}
                                    </span>
                                    {step.duration && <span className="text-gray-500 text-xs">+{step.duration}ms</span>}
                                </div>
                                {step.status === 'PASSED' && step.screenshotUrl && (
                                    <button 
                                        onClick={() => setActiveScreenshot(step.screenshotUrl || null)}
                                        className="mt-2 flex items-center text-xs text-gray-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        <i className="fas fa-camera mr-1"></i> View Capture
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {selectedSuite?.status === 'PASSED' && (
                        <div className="pt-4 border-t border-gray-700 text-green-400 font-bold">
                            SUITE EXECUTION COMPLETED SUCCESSFULLY.
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'AUDIT' && (
          <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 flex-1 flex flex-col">
             <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Security Audit Logs</h3>
                 <ExportDropdown data={logs} />
             </div>
             <div className="overflow-y-auto flex-1">
                 <table className="w-full text-left" aria-label="Audit Logs Table">
                     <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase sticky top-0">
                         <tr>
                             <th className="px-6 py-3" scope="col">Timestamp</th>
                             <th className="px-6 py-3" scope="col">Action</th>
                             <th className="px-6 py-3" scope="col">Admin ID</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y dark:divide-gray-700 text-sm">
                         {logs.map(log => (
                             <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                 <td className="px-6 py-3 text-gray-500 font-mono">{new Date(log.timestamp).toISOString()}</td>
                                 <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">{log.action}</td>
                                 <td className="px-6 py-3 text-gray-500">{log.adminId}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
          </div>
      )}

      {/* Screenshot Modal */}
      {activeScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={() => setActiveScreenshot(null)}>
            <div className="bg-white p-2 rounded-lg max-w-4xl w-full shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2 px-2">
                    <h4 className="font-bold text-gray-700">Captured Screenshot</h4>
                    <button onClick={() => setActiveScreenshot(null)} className="text-gray-500 hover:text-red-500">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <img src={activeScreenshot} alt="Test Capture" className="w-full h-auto rounded border border-gray-200" />
            </div>
        </div>
      )}
    </div>
  );
};
```

### FILE: components/Dashboard.tsx
```typescript
import React from 'react';
import { User, Role, LogEntry, LogStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  user: User;
  logs: LogEntry[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC<DashboardProps> = ({ user, logs }) => {
  
  const getStats = () => {
    const total = logs.length;
    const approved = logs.filter(l => l.status === LogStatus.APPROVED).length;
    const pending = logs.filter(l => l.status === LogStatus.PENDING).length;
    const totalHours = logs.reduce((acc, curr) => acc + curr.hours, 0);

    return { total, approved, pending, totalHours };
  };

  const stats = getStats();

  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.total - stats.approved - stats.pending },
  ];

  // Simple weekly data mock based on logs
  const weeklyData = logs.slice(0, 5).map(l => ({
    name: l.date,
    hours: l.hours
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Welcome back, {user.name.split(' ')[0]}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Statistics">
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-blue-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Entries</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-green-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Hours Logged</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalHours}</p>
        </div>
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-yellow-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
        </div>
         <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm border-l-4 border-purple-500" role="listitem">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">45%</p>
        </div>
      </div>

      {/* Charts Section - Only visible for relevant roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm h-80 border dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Weekly Activity Hours</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} aria-label="Activity hours bar chart" />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-darkcard p-6 rounded-xl shadow-sm h-80 border dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Approval Status</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        aria-label="Approval status pie chart"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
         <div className="px-6 py-4 border-b dark:border-gray-700">
             <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recent Logs</h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left" aria-label="Recent Log Entries">
                 <thead>
                     <tr className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
                         <th className="px-6 py-3" scope="col">Date</th>
                         <th className="px-6 py-3" scope="col">Activity Summary</th>
                         <th className="px-6 py-3" scope="col">Hours</th>
                         <th className="px-6 py-3" scope="col">Status</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-gray-700">
                     {logs.slice(0, 5).map(log => (
                         <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                             <td className="px-6 py-4 text-sm">{log.date}</td>
                             <td className="px-6 py-4 text-sm truncate max-w-xs" title={log.summary}>{log.summary}</td>
                             <td className="px-6 py-4 text-sm">{log.hours}</td>
                             <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                    ${log.status === LogStatus.APPROVED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                                      log.status === LogStatus.REJECTED ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                     {log.status}
                                 </span>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};
```

### FILE: components/Documentation.tsx
```typescript
import React, { useState } from 'react';

// --- SVG DIAGRAM COMPONENTS ---

// 1. BOARD-LEVEL ARCHITECTURE (Presentation)
const DiagramPresentationArch = () => (
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <defs>
      <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#800000" stopOpacity="1" />
        <stop offset="100%" stopColor="#a00000" stopOpacity="1" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/>
      </filter>
    </defs>
    <text x="400" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#374151" className="dark:fill-white">System Overview</text>
    
    {/* User Node */}
    <g transform="translate(80, 150)">
       <circle cx="60" cy="60" r="50" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
       <text x="60" y="55" textAnchor="middle" fontSize="40">👤</text>
       <text x="60" y="130" textAnchor="middle" fontWeight="bold" className="dark:fill-white">Users</text>
       <text x="60" y="150" textAnchor="middle" fontSize="12" fill="#6b7280">All Roles</text>
    </g>

    {/* Core System */}
    <g transform="translate(280, 100)">
      <rect width="240" height="180" rx="16" fill="url(#gradBlue)" filter="url(#shadow)" />
      <text x="120" y="90" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">AUCDT IAM</text>
      <text x="120" y="120" textAnchor="middle" fontSize="16" fill="white" opacity="0.9">Web Platform</text>
      <text x="120" y="140" textAnchor="middle" fontSize="12" fill="white" opacity="0.8">React • TS • Mock DB</text>
    </g>

    {/* AI Service */}
    <g transform="translate(600, 150)">
      <path d="M60,0 L112,28 L112,88 L60,116 L8,88 L8,28 Z" fill="#FCD34D" stroke="#d97706" strokeWidth="2" filter="url(#shadow)" />
      <text x="60" y="65" textAnchor="middle" fontSize="24" fill="white">✨</text>
      <text x="60" y="140" textAnchor="middle" fontWeight="bold" className="dark:fill-white">Gemini AI</text>
    </g>

    {/* Connections */}
    <path d="M 160 200 L 270 200" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrowHead)" strokeDasharray="4"/>
    <path d="M 530 200 L 590 200" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrowHead)" strokeDasharray="4"/>

    <defs>
      <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
      </marker>
    </defs>
  </svg>
);

// 2. BOARD-LEVEL TECH STACK (Presentation)
const DiagramPresentationTech = () => (
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <text x="400" y="40" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#374151" className="dark:fill-white">Technology Stack</text>
    
    {/* Frontend */}
    <g transform="translate(80, 100)">
      <rect width="180" height="200" rx="12" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
      <rect width="180" height="40" rx="12" fill="#3b82f6" />
      <text x="90" y="28" textAnchor="middle" fontWeight="bold" fill="white">Frontend</text>
      
      <text x="90" y="70" textAnchor="middle" fill="#1e40af">React 19</text>
      <text x="90" y="100" textAnchor="middle" fill="#1e40af">TypeScript</text>
      <text x="90" y="130" textAnchor="middle" fill="#1e40af">Tailwind CSS</text>
      <text x="90" y="160" textAnchor="middle" fill="#1e40af">Recharts</text>
    </g>

    {/* Core Services */}
    <g transform="translate(310, 100)">
      <rect width="180" height="200" rx="12" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
      <rect width="180" height="40" rx="12" fill="#22c55e" />
      <text x="90" y="28" textAnchor="middle" fontWeight="bold" fill="white">Services</text>
      
      <text x="90" y="70" textAnchor="middle" fill="#166534">Mock Backend</text>
      <text x="90" y="100" textAnchor="middle" fill="#166534">In-Memory DB</text>
      <text x="90" y="130" textAnchor="middle" fill="#166534">Audit Logger</text>
      <text x="90" y="160" textAnchor="middle" fill="#166534">Puppeteer Sim</text>
    </g>

    {/* External */}
    <g transform="translate(540, 100)">
      <rect width="180" height="200" rx="12" fill="#faf5ff" stroke="#a855f7" strokeWidth="2" />
      <rect width="180" height="40" rx="12" fill="#a855f7" />
      <text x="90" y="28" textAnchor="middle" fontWeight="bold" fill="white">Integrations</text>
      
      <text x="90" y="70" textAnchor="middle" fill="#6b21a8">Google GenAI SDK</text>
      <text x="90" y="100" textAnchor="middle" fill="#6b21a8">Gemini 2.5 Flash</text>
      <text x="90" y="130" textAnchor="middle" fill="#6b21a8">REST API</text>
    </g>
  </svg>
);

// 3. DETAILED ARCHITECTURE (SRS)
const DiagramArchitecture = () => (
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <rect x="40" y="60" width="400" height="300" rx="8" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4"/>
    <text x="60" y="90" fontWeight="bold" fill="#475569">Client Browser</text>

    <g transform="translate(80, 120)">
      <rect width="320" height="60" rx="6" fill="#dbeafe" stroke="#3b82f6"/>
      <text x="160" y="35" textAnchor="middle" fill="#1e40af" fontWeight="bold">React Components</text>
    </g>

    <g transform="translate(80, 200)">
      <rect width="150" height="120" rx="6" fill="#d1fae5" stroke="#10b981"/>
      <text x="75" y="30" textAnchor="middle" fill="#065f46" fontWeight="bold">Mock Services</text>
      <text x="75" y="60" textAnchor="middle" fill="#064e3b" fontSize="12">User/Log Store</text>
      <text x="75" y="80" textAnchor="middle" fill="#064e3b" fontSize="12">Auth Logic</text>
      <text x="75" y="100" textAnchor="middle" fill="#064e3b" fontSize="12">Test Runner</text>
    </g>

    <g transform="translate(250, 200)">
       <rect width="150" height="120" rx="6" fill="#f3e8ff" stroke="#a855f7"/>
       <text x="75" y="30" textAnchor="middle" fill="#6b21a8" fontWeight="bold">AI Service</text>
       <text x="75" y="60" textAnchor="middle" fill="#6b21a8" fontSize="12">SDK Client</text>
       <text x="75" y="85" textAnchor="middle" fill="#6b21a8" fontSize="12">Prompt Engine</text>
    </g>

    <g transform="translate(550, 150)">
       <rect width="200" height="100" rx="8" fill="#475569" stroke="#1e293b"/>
       <text x="100" y="40" textAnchor="middle" fill="white" fontWeight="bold">Google Gemini Cloud</text>
       <text x="100" y="65" textAnchor="middle" fill="#cbd5e1" fontSize="12">LLM Inference</text>
    </g>

    <path d="M 400 260 L 550 200" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowHead)"/>
  </svg>
);

// 4. DATA FLOW DIAGRAM (SRS)
const DiagramDFD = () => (
  <svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <defs>
      <marker id="dfdArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
         <path d="M0,0 L0,6 L9,3 z" fill="#374151" />
      </marker>
    </defs>

    <rect x="20" y="120" width="100" height="60" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2"/>
    <text x="70" y="155" textAnchor="middle" fontWeight="bold">Student</text>

    <circle cx="250" cy="150" r="40" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <text x="250" y="145" textAnchor="middle" fontSize="12" fontWeight="bold">1.0</text>
    <text x="250" y="160" textAnchor="middle" fontSize="12">Submit Log</text>

    <path d="M 350 120 L 450 120 L 450 180 L 350 180 M 370 120 L 370 180" fill="none" stroke="#1e293b" strokeWidth="2"/>
    <text x="410" y="155" textAnchor="middle">Logs DB</text>

    <circle cx="600" cy="150" r="40" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <text x="600" y="145" textAnchor="middle" fontSize="12" fontWeight="bold">2.0</text>
    <text x="600" y="160" textAnchor="middle" fontSize="12">Approve</text>

    <rect x="700" y="120" width="80" height="60" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2"/>
    <text x="740" y="155" textAnchor="middle" fontWeight="bold" fontSize="12">Supervisor</text>

    {/* Flows */}
    <line x1="120" y1="150" x2="210" y2="150" stroke="#374151" strokeWidth="2" markerEnd="url(#dfdArrow)"/>
    <line x1="290" y1="150" x2="350" y2="150" stroke="#374151" strokeWidth="2" markerEnd="url(#dfdArrow)"/>
    <line x1="450" y1="150" x2="560" y2="150" stroke="#374151" strokeWidth="2" markerEnd="url(#dfdArrow)"/>
    <line x1="640" y1="150" x2="700" y2="150" stroke="#374151" strokeWidth="2" markerEnd="url(#dfdArrow)"/>
  </svg>
);

// 5. UML USE CASE (SRS)
const DiagramUseCase = () => (
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <rect x="200" y="20" width="400" height="360" fill="none" stroke="#374151" strokeDasharray="4"/>
    <text x="400" y="50" textAnchor="middle" fontWeight="bold" className="dark:fill-white">System Boundary</text>

    <g transform="translate(100, 100)">
      <circle cx="20" cy="20" r="15" fill="none" stroke="#374151" strokeWidth="2"/>
      <line x1="20" y1="35" x2="20" y2="60" stroke="#374151" strokeWidth="2"/>
      <line x1="5" y1="45" x2="35" y2="45" stroke="#374151" strokeWidth="2"/>
      <line x1="20" y1="60" x2="5" y2="85" stroke="#374151" strokeWidth="2"/>
      <line x1="20" y1="60" x2="35" y2="85" stroke="#374151" strokeWidth="2"/>
      <text x="20" y="110" textAnchor="middle" fontWeight="bold" className="dark:fill-white">Student</text>
    </g>

    <g transform="translate(660, 200)">
       <circle cx="20" cy="20" r="15" fill="none" stroke="#374151" strokeWidth="2"/>
       <line x1="20" y1="35" x2="20" y2="60" stroke="#374151" strokeWidth="2"/>
       <line x1="5" y1="45" x2="35" y2="45" stroke="#374151" strokeWidth="2"/>
       <line x1="20" y1="60" x2="5" y2="85" stroke="#374151" strokeWidth="2"/>
       <line x1="20" y1="60" x2="35" y2="85" stroke="#374151" strokeWidth="2"/>
      <text x="20" y="110" textAnchor="middle" fontWeight="bold" className="dark:fill-white">Admin</text>
    </g>

    <ellipse cx="400" cy="120" rx="100" ry="25" fill="white" stroke="#374151" strokeWidth="2"/>
    <text x="400" y="125" textAnchor="middle">Submit Log Entry</text>

    <ellipse cx="400" cy="200" rx="100" ry="25" fill="white" stroke="#374151" strokeWidth="2"/>
    <text x="400" y="205" textAnchor="middle">AI Refinement</text>

    <ellipse cx="400" cy="280" rx="100" ry="25" fill="white" stroke="#374151" strokeWidth="2"/>
    <text x="400" y="285" textAnchor="middle">System Audit</text>

    <line x1="140" y1="100" x2="300" y2="120" stroke="#374151"/>
    <line x1="140" y1="100" x2="300" y2="200" stroke="#374151"/>
    <line x1="660" y1="230" x2="500" y2="280" stroke="#374151"/>
  </svg>
);

// 6. SEQUENCE DIAGRAM (SRS)
const DiagramSequence = () => (
  <svg width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <text x="400" y="30" textAnchor="middle" fontWeight="bold" fill="#374151" className="dark:fill-white">Sequence: AI Logbook Refinement</text>
    
    <g transform="translate(100, 50)">
      <rect x="-40" y="0" width="80" height="40" fill="#e5e7eb" stroke="#374151"/>
      <text x="0" y="25" textAnchor="middle">Student</text>
      <line x1="0" y1="40" x2="0" y2="300" stroke="#374151" strokeDasharray="4"/>
    </g>

    <g transform="translate(400, 50)">
      <rect x="-40" y="0" width="80" height="40" fill="#e5e7eb" stroke="#374151"/>
      <text x="0" y="25" textAnchor="middle">Web App</text>
      <line x1="0" y1="40" x2="0" y2="300" stroke="#374151" strokeDasharray="4"/>
      <rect x="-5" y="80" width="10" height="150" fill="#bfdbfe"/>
    </g>

    <g transform="translate(700, 50)">
      <rect x="-40" y="0" width="80" height="40" fill="#e5e7eb" stroke="#374151"/>
      <text x="0" y="25" textAnchor="middle">Gemini API</text>
      <line x1="0" y1="40" x2="0" y2="300" stroke="#374151" strokeDasharray="4"/>
      <rect x="-5" y="120" width="10" height="60" fill="#d8b4fe"/>
    </g>

    {/* Messages */}
    <line x1="100" y1="100" x2="395" y2="100" stroke="#374151" markerEnd="url(#dfdArrow)"/>
    <text x="250" y="90" textAnchor="middle" fontSize="12">Click 'AI Refine'</text>

    <line x1="405" y1="130" x2="695" y2="130" stroke="#374151" markerEnd="url(#dfdArrow)"/>
    <text x="550" y="120" textAnchor="middle" fontSize="12">POST /generateContent</text>

    <line x1="695" y1="170" x2="405" y2="170" stroke="#374151" strokeDasharray="4" markerEnd="url(#dfdArrow)"/>
    <text x="550" y="160" textAnchor="middle" fontSize="12">Returns Summary</text>

    <line x1="395" y1="210" x2="100" y2="210" stroke="#374151" strokeDasharray="4" markerEnd="url(#dfdArrow)"/>
    <text x="250" y="200" textAnchor="middle" fontSize="12">Updates UI</text>
  </svg>
);

// 7. DATABASE ERD (SRS)
const DiagramDatabase = () => (
  <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
    <defs>
      <marker id="erdOne" markerWidth="12" markerHeight="12" refX="0" refY="6" orient="auto">
        <path d="M0,6 L12,6 M6,0 L6,12" stroke="#374151" strokeWidth="1" fill="none"/>
      </marker>
      <marker id="erdMany" markerWidth="12" markerHeight="12" refX="0" refY="6" orient="auto">
        <path d="M0,6 L12,0 L12,12 Z" fill="#374151"/>
      </marker>
    </defs>

    <text x="400" y="30" textAnchor="middle" fontWeight="bold" className="dark:fill-white">Entity Relationship Diagram (ERD)</text>

    {/* User Table */}
    <g transform="translate(50, 80)">
      <rect width="160" height="140" fill="#f3f4f6" stroke="#374151" rx="4"/>
      <rect width="160" height="30" fill="#d1d5db" rx="4" />
      <text x="80" y="20" textAnchor="middle" fontWeight="bold">User</text>
      <text x="10" y="50" fontSize="12">PK: id (string)</text>
      <text x="10" y="70" fontSize="12">name (string)</text>
      <text x="10" y="90" fontSize="12">role (enum)</text>
      <text x="10" y="110" fontSize="12">email (string)</text>
      <text x="10" y="130" fontSize="12">avatar (string)</text>
    </g>

    {/* LogEntry Table */}
    <g transform="translate(350, 80)">
      <rect width="180" height="160" fill="#f3f4f6" stroke="#374151" rx="4"/>
      <rect width="180" height="30" fill="#d1d5db" rx="4" />
      <text x="90" y="20" textAnchor="middle" fontWeight="bold">LogEntry</text>
      <text x="10" y="50" fontSize="12">PK: id (string)</text>
      <text x="10" y="70" fontSize="12" fontWeight="bold">FK: studentId (User)</text>
      <text x="10" y="90" fontSize="12">date (string)</text>
      <text x="10" y="110" fontSize="12">hours (number)</text>
      <text x="10" y="130" fontSize="12">activities (text)</text>
      <text x="10" y="150" fontSize="12">status (enum)</text>
    </g>

    {/* AuditLog Table */}
    <g transform="translate(50, 300)">
      <rect width="160" height="120" fill="#f3f4f6" stroke="#374151" rx="4"/>
      <rect width="160" height="30" fill="#d1d5db" rx="4" />
      <text x="80" y="20" textAnchor="middle" fontWeight="bold">AuditLog</text>
      <text x="10" y="50" fontSize="12">PK: id (string)</text>
      <text x="10" y="70" fontSize="12" fontWeight="bold">FK: adminId (User)</text>
      <text x="10" y="90" fontSize="12">action (string)</text>
      <text x="10" y="110" fontSize="12">timestamp (number)</text>
    </g>

    {/* Message Table */}
    <g transform="translate(600, 80)">
      <rect width="160" height="140" fill="#f3f4f6" stroke="#374151" rx="4"/>
      <rect width="160" height="30" fill="#d1d5db" rx="4" />
      <text x="80" y="20" textAnchor="middle" fontWeight="bold">Message</text>
      <text x="10" y="50" fontSize="12">PK: id (string)</text>
      <text x="10" y="70" fontSize="12" fontWeight="bold">FK: senderId</text>
      <text x="10" y="90" fontSize="12" fontWeight="bold">FK: receiverId</text>
      <text x="10" y="110" fontSize="12">content (text)</text>
      <text x="10" y="130" fontSize="12">read (boolean)</text>
    </g>

    {/* Relationships */}
    <path d="M 210 150 L 350 150" stroke="#374151" strokeWidth="2" markerEnd="url(#erdMany)" markerStart="url(#erdOne)"/>
    <path d="M 130 220 L 130 300" stroke="#374151" strokeWidth="2" markerEnd="url(#erdMany)" markerStart="url(#erdOne)"/>
    <path d="M 210 100 L 300 100 L 300 50 L 680 50 L 680 80" stroke="#374151" strokeWidth="2" strokeDasharray="4" markerEnd="url(#erdMany)" />
  </svg>
);

export const Documentation: React.FC = () => {
  const [mode, setMode] = useState<'PRESENTATION' | 'TECHNICAL' | 'GUIDES'>('PRESENTATION');
  const [guideTab, setGuideTab] = useState<'ADMIN' | 'DEPLOY' | 'TEST'>('ADMIN');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border dark:border-gray-700">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Documentation Hub</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">AUCDT IAM System • Version 1.1</p>
        </div>
        <div className="flex flex-wrap justify-center space-x-2 mt-4 sm:mt-0">
            <button 
                onClick={() => setMode('PRESENTATION')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${mode === 'PRESENTATION' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
                <i className="fas fa-project-diagram mr-2"></i> Board View
            </button>
            <button 
                onClick={() => setMode('TECHNICAL')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${mode === 'TECHNICAL' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
                <i className="fas fa-file-alt mr-2"></i> Digital SRS
            </button>
             <button 
                onClick={() => setMode('GUIDES')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${mode === 'GUIDES' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
                <i className="fas fa-book mr-2"></i> User Guides
            </button>
        </div>
      </div>

      {/* MODE: PRESENTATION */}
      {mode === 'PRESENTATION' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 border-l-4 border-blue-500 pl-3">High-Level Architecture</h2>
                  <div className="border-2 border-gray-100 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transform hover:scale-[1.01] transition-transform duration-300">
                      <DiagramPresentationArch />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Figure 1: The IAMA platform connects users to AI-driven tools via a streamlined React interface.</p>
              </div>
              <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 border-l-4 border-green-500 pl-3">Technology Stack</h2>
                  <div className="border-2 border-gray-100 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transform hover:scale-[1.01] transition-transform duration-300">
                      <DiagramPresentationTech />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Figure 2: Built on modern web standards ensuring performance, accessibility, and scalability.</p>
              </div>
          </div>
      )}

      {/* MODE: TECHNICAL (SRS) */}
      {mode === 'TECHNICAL' && (
          <div className="bg-white dark:bg-darkcard rounded-xl shadow-sm border dark:border-gray-700 min-h-screen animate-fade-in">
              <div className="max-w-5xl mx-auto p-8 md:p-12 prose dark:prose-invert prose-lg prose-blue">
                  
                  <div className="text-center border-b dark:border-gray-700 pb-8 mb-8">
                    <h1 className="mb-2">Software Requirements Specification</h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-light">AUCDT IAM System</p>
                    <div className="flex justify-center space-x-4 text-sm font-mono text-gray-400">
                        <span>Version 1.1</span>
                        <span>•</span>
                        <span>REFRESH</span>
                        <span>•</span>
                        <span>2024</span>
                    </div>
                  </div>

                  <h3>1. Introduction</h3>
                  <p>The <strong>AUCDT IAM System</strong> is a comprehensive web-based solution designed to digitize the workflow of industrial attachments at the <strong>Asanska University College of Design and Technology</strong>.</p>
                  
                  <h4>1.1 Scope</h4>
                  <p>The application handles user authentication, logbook creation with AI enhancement (tailored for <strong>Fashion Design Technology</strong>), approval workflows, and administrative oversight.</p>

                  <hr className="my-8 border-gray-200 dark:border-gray-700" />

                  <h3>2. System Architecture</h3>
                  <p>The system follows a client-centric architecture where the React frontend manages state and business logic, interacting with the Google Gemini API for intelligence features.</p>
                  
                  <div className="my-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 not-prose">
                    <h5 className="text-center text-sm text-gray-500 font-bold mb-4 uppercase tracking-wide">Figure 3: Detailed System Architecture</h5>
                    <DiagramArchitecture />
                  </div>

                  <h3>3. Functional Requirements</h3>
                  <ul>
                      <li><strong>FR-01 Logbook Entry:</strong> The system allows creation of dated entries with hours and descriptions.</li>
                      <li><strong>FR-02 AI Refinement:</strong> The system integrates <strong>Gemini 2.5 Flash</strong> to rewrite raw notes into professional technical summaries suitable for academic reports.</li>
                      <li><strong>FR-03 Approval Workflow:</strong> Entries must be approved by an Organization Supervisor.</li>
                      <li><strong>FR-04 Admin Tools:</strong> A secure dashboard must provide access to Audit Logs and the Automated Test Runner.</li>
                  </ul>

                  <hr className="my-8 border-gray-200 dark:border-gray-700" />

                  <h3>4. Non-Functional Requirements</h3>
                  <ul>
                      <li><strong>NFR-01 Accessibility:</strong> The UI supports High Contrast mode, Dark Mode (auto-triggered after 6 PM), and follows WCAG guidelines.</li>
                      <li><strong>NFR-02 Performance:</strong> AI responses must be handled asynchronously with loading states.</li>
                      <li><strong>NFR-03 Security:</strong> <strong>Universal Authentication</strong> is required. All user roles (Student, Organization, Institution, Admin) must authenticate via password before accessing the dashboard.</li>
                  </ul>

                  <hr className="my-8 border-gray-200 dark:border-gray-700" />

                  <h3>5. Data Models & Flow</h3>
                  <p>The core data entity is the <code>LogEntry</code>, which transitions through states based on user actions.</p>
                  
                  <div className="my-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 not-prose">
                    <h5 className="text-center text-sm text-gray-500 font-bold mb-4 uppercase tracking-wide">Figure 4: Data Flow Diagram (Level 1)</h5>
                    <DiagramDFD />
                  </div>

                  <div className="my-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 not-prose">
                    <h5 className="text-center text-sm text-gray-500 font-bold mb-4 uppercase tracking-wide">Figure 5: Database Entity Relationship Diagram (ERD)</h5>
                    <DiagramDatabase />
                  </div>

                  <h3>6. User Interaction Models</h3>
                  <p>The system supports multiple actors. The Use Case diagram highlights the primary boundaries and interactions.</p>

                  <div className="my-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 not-prose">
                    <h5 className="text-center text-sm text-gray-500 font-bold mb-4 uppercase tracking-wide">Figure 6: UML Use Case Diagram</h5>
                    <DiagramUseCase />
                  </div>

                  <h3>7. Integration Specifications</h3>
                  <p>The AI features rely on asynchronous calls to the Google Gemini API. The sequence of operations ensures the UI remains responsive while generating content.</p>

                  <div className="my-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 not-prose">
                    <h5 className="text-center text-sm text-gray-500 font-bold mb-4 uppercase tracking-wide">Figure 7: UML Sequence Diagram (AI Feature)</h5>
                    <DiagramSequence />
                  </div>

                  <h3>8. Testing Strategy</h3>
                  <p>The system includes a self-contained <strong>Puppeteer Mock Runner</strong>. Admins can execute E2E test suites directly from the dashboard.</p>

              </div>
          </div>
      )}

      {/* MODE: GUIDES */}
      {mode === 'GUIDES' && (
          <div className="flex flex-col lg:flex-row gap-6 animate-fade-in min-h-[600px]">
              {/* Sidebar */}
              <div className="w-full lg:w-64 bg-white dark:bg-darkcard rounded-xl p-4 border dark:border-gray-700 h-fit">
                  <h3 className="font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-4 px-2">Manuals</h3>
                  <div className="space-y-1">
                      <button 
                        onClick={() => setGuideTab('ADMIN')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${guideTab === 'ADMIN' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      >
                          Administrator Guide
                      </button>
                      <button 
                        onClick={() => setGuideTab('DEPLOY')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${guideTab === 'DEPLOY' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      >
                          Deployment Guide
                      </button>
                      <button 
                        onClick={() => setGuideTab('TEST')}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${guideTab === 'TEST' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      >
                          Testing Guide
                      </button>
                  </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-darkcard rounded-xl p-8 border dark:border-gray-700">
                  {guideTab === 'ADMIN' && (
                      <div className="prose dark:prose-invert max-w-none">
                          <h2>Administrator Guide</h2>
                          <p className="lead">This guide provides instructions for managing the AUCDT IAM System.</p>
                          
                          <h3>1. Accessing the Admin Dashboard</h3>
                          <ol>
                              <li>Navigate to the Login page.</li>
                              <li>Select <strong>System Admin</strong> from the user list.</li>
                              <li>Enter the secure password: <code>admin123</code>.</li>
                              <li>Once logged in, click <strong>Admin Tools</strong> in the sidebar.</li>
                          </ol>

                          <h3>2. Viewing Audit Logs</h3>
                          <p>The <strong>Audit Logs</strong> tab provides a timestamped history of all sensitive system actions, including:</p>
                          <ul>
                              <li>User Logins/Logouts</li>
                              <li>Test Suite Execution</li>
                              <li>Data Exports</li>
                          </ul>
                          <p><strong>To Export Logs:</strong> Click the "Export" dropdown in the top-right corner of the logs table. You can Copy to Clipboard, or download as CSV/JSON.</p>

                          <h3>3. Running System Tests</h3>
                          <p>Use the <strong>Automated Tests</strong> tab to verify system health.</p>
                          <ul>
                              <li>Select a Test Suite from the left sidebar.</li>
                              <li>Click <strong>Run This Suite</strong> to execute.</li>
                              <li>Watch the live console for step-by-step progress.</li>
                              <li>If a step produces a screenshot, click "View Capture" to inspect the mock browser state.</li>
                          </ul>
                      </div>
                  )}

                  {guideTab === 'DEPLOY' && (
                      <div className="prose dark:prose-invert max-w-none">
                          <h2>Deployment Guide</h2>
                          <p className="lead">Instructions for building and deploying the React application to production.</p>
                          
                          <h3>1. Prerequisites</h3>
                          <ul>
                              <li>Node.js (v18 or higher)</li>
                              <li>npm (v9 or higher)</li>
                              <li>A valid Google Gemini API Key</li>
                          </ul>

                          <h3>2. Environment Setup</h3>
                          <p>Create a <code>.env</code> file in the root directory:</p>
                          <pre><code>REACT_APP_API_KEY=[REDACTED_CREDENTIAL]

                          <h3>3. Build Process</h3>
                          <p>Run the following commands in your terminal:</p>
                          <pre><code># Install dependencies
npm install

# Create optimized production build
npm run build</code></pre>

                          <h3>4. Hosting</h3>
                          <p>The output in the <code>build/</code> folder is static. It can be deployed to:</p>
                          <ul>
                              <li><strong>Vercel/Netlify:</strong> Drag and drop the build folder or connect your Git repo.</li>
                              <li><strong>Apache/Nginx:</strong> Copy contents to <code>/var/www/html</code>.</li>
                              <li><strong>AWS S3:</strong> Upload contents and enable static website hosting.</li>
                          </ul>
                      </div>
                  )}

                  {guideTab === 'TEST' && (
                      <div className="prose dark:prose-invert max-w-none">
                          <h2>Testing Guide</h2>
                          <p className="lead">Protocols for validating system functionality using the built-in runner and manual checks.</p>
                          
                          <h3>1. Automated Testing</h3>
                          <p>The <strong>Mock Puppeteer Runner</strong> (accessible via Admin Tools) simulates critical user journeys without needing external infrastructure.</p>
                          
                          <h4>Available Test Suites:</h4>
                          <ul>
                              <li><strong>TS-001 Student Journey:</strong> Validates the complete flow from login to AI-assisted logbook submission.</li>
                              <li><strong>TS-002 Security:</strong> Verifies that admin pages are protected and unauthorized access is blocked.</li>
                              <li><strong>TS-004 Accessibility:</strong> Checks that High Contrast mode and Dark themes toggle correctly.</li>
                          </ul>

                          <h3>2. Manual Accessibility Testing</h3>
                          <p>Perform these checks before every release:</p>
                          <ul>
                              <li><strong>Keyboard Nav:</strong> Ensure you can navigate the entire app using only <code>Tab</code> and <code>Enter</code> keys.</li>
                              <li><strong>Screen Reader:</strong> Use a reader (e.g., NVDA, VoiceOver) to confirm that "AI Generating" status messages are announced.</li>
                              <li><strong>High Contrast:</strong> Enable the mode from the top-right theme switcher and verify that all text is legible (Yellow on Black).</li>
                          </ul>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
```

### FILE: components/Layout.tsx
```typescript
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Role, Theme, User } from '../types';
import ThemeSwitcher from './ThemeSwitcher';

interface LayoutProps {
  user: User | null;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, theme, setTheme, onLogout, children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkcard';

  if (!user) return <>{children}</>;

  return (
    <div className={`flex h-screen overflow-hidden`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-darkcard shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col border-r dark:border-gray-700`}>
        <div className="flex flex-col items-center justify-center h-20 border-b dark:border-gray-700 bg-primary text-white font-bold">
          <div className="flex items-center">
             <i className="fas fa-graduation-cap text-secondary text-2xl mr-2" aria-hidden="true"></i> 
             <span className="text-xl tracking-wider">AUCDT</span>
          </div>
          <span className="text-[10px] text-secondary font-normal uppercase tracking-widest">IAM System</span>
        </div>
        <nav className="mt-5 px-4 space-y-2 flex-1" aria-label="Main Navigation">
          <Link to="/" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/')}`}>
            <i className="fas fa-tachometer-alt w-6" aria-hidden="true"></i> Dashboard
          </Link>
          
          {(user.role === Role.STUDENT || user.role === Role.ORGANIZATION) && (
            <Link to="/logbook" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/logbook')}`}>
              <i className="fas fa-book w-6" aria-hidden="true"></i> Logbook
            </Link>
          )}

          <Link to="/messages" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/messages')}`}>
            <i className="fas fa-envelope w-6" aria-hidden="true"></i> Messages
          </Link>

          {user.role === Role.STUDENT && (
            <Link to="/reports" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/reports')}`}>
              <i className="fas fa-file-pdf w-6" aria-hidden="true"></i> Reports
            </Link>
          )}

          {user.role === Role.ADMIN && (
            <Link to="/admin" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin')}`}>
              <i className="fas fa-shield-alt w-6" aria-hidden="true"></i> Admin Tools
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t dark:border-gray-700 space-y-2">
             <Link to="/docs" className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm ${isActive('/docs')}`}>
                <i className="fas fa-book-open w-6" aria-hidden="true"></i> Documentation
             </Link>
             <button 
                onClick={onLogout} 
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Logout"
             >
                <i className="fas fa-sign-out-alt w-6" aria-hidden="true"></i> Logout
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-darkcard shadow flex items-center justify-between px-6 z-10 border-b dark:border-gray-700" role="banner">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="md:hidden text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
            aria-label="Toggle Sidebar"
            aria-expanded={isSidebarOpen}
          >
            <i className="fas fa-bars text-xl" aria-hidden="true"></i>
          </button>
          
          <div className="hidden md:block">
             <h1 className="text-lg font-bold text-primary dark:text-secondary">Asanska University College of Design and Technology</h1>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <ThemeSwitcher onThemeChange={setTheme} />
            <div className="flex items-center space-x-2" role="status" aria-label="Current User">
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-gray-200" aria-hidden="true" />
                <span className="text-sm font-medium hidden sm:block text-gray-800 dark:text-gray-200">{user.name} <span className="text-xs text-gray-500 dark:text-gray-400">({user.role})</span></span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-darkbg p-6" role="main">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            aria-hidden="true"
        ></div>
      )}
    </div>
  );
};
```

### FILE: components/Logbook.tsx
```typescript
import React, { useState } from 'react';
import { User, LogEntry, Role, LogStatus } from '../types';
import { summarizeLogbookEntry } from '../services/geminiService';

interface LogbookProps {
  user: User;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export const Logbook: React.FC<LogbookProps> = ({ user, logs, setLogs }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<LogEntry>>({
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    activities: '',
    summary: '',
    status: LogStatus.PENDING
  });

  const handleAI = async () => {
    if (!newEntry.activities) return;
    setIsGenerating(true);
    try {
      const summary = await summarizeLogbookEntry(newEntry.activities);
      setNewEntry(prev => ({ ...prev, summary }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: LogEntry = {
      id: Date.now().toString(),
      studentId: user.id,
      date: newEntry.date!,
      hours: Number(newEntry.hours),
      activities: newEntry.activities!,
      summary: newEntry.summary || newEntry.activities!,
      status: LogStatus.PENDING
    };
    setLogs(prev => [entry, ...prev]);
    setModalOpen(false);
    setNewEntry({ date: new Date().toISOString().split('T')[0], hours: 0, activities: '', summary: '', status: LogStatus.PENDING });
  };

  const handleApprove = (id: string, status: LogStatus) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const canEdit = user.role === Role.STUDENT;
  const canApprove = user.role === Role.ORGANIZATION;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daily Logbook</h2>
        {canEdit && (
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Create new logbook entry"
          >
            <i className="fas fa-plus mr-2" aria-hidden="true"></i> New Entry
          </button>
        )}
      </div>

      <div className="grid gap-4" role="list">
        {logs.map(log => (
          <div key={log.id} className="bg-white dark:bg-darkcard p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4" role="listitem">
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-500 dark:text-gray-400 text-sm" aria-label={`Date: ${log.date}`}><i className="far fa-calendar-alt mr-1" aria-hidden="true"></i> {log.date}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm" aria-label={`Duration: ${log.hours} hours`}><i className="far fa-clock mr-1" aria-hidden="true"></i> {log.hours} hrs</span>
                     <span className={`px-2 py-0.5 rounded text-xs font-semibold border
                        ${log.status === LogStatus.APPROVED ? 'bg-green-50 border-green-200 text-green-700' : 
                          log.status === LogStatus.REJECTED ? 'bg-red-50 border-red-200 text-red-700' : 
                          'bg-yellow-50 border-yellow-200 text-yellow-700'}`} aria-label={`Status: ${log.status}`}>
                        {log.status}
                     </span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Summary</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{log.summary}</p>
                
                <details className="mt-3 group">
                    <summary className="text-xs text-blue-500 cursor-pointer hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded inline-block px-1">View Raw Notes</summary>
                    <p className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-500 font-mono whitespace-pre-wrap border dark:border-gray-600">{log.activities}</p>
                </details>
             </div>

             {canApprove && log.status === LogStatus.PENDING && (
                 <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 dark:border-gray-700">
                     <button 
                        onClick={() => handleApprove(log.id, LogStatus.APPROVED)} 
                        className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                        title="Approve"
                        aria-label="Approve Entry"
                     >
                         <i className="fas fa-check" aria-hidden="true"></i>
                     </button>
                     <button 
                        onClick={() => handleApprove(log.id, LogStatus.REJECTED)} 
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500" 
                        title="Reject"
                        aria-label="Reject Entry"
                     >
                         <i className="fas fa-times" aria-hidden="true"></i>
                     </button>
                 </div>
             )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-white dark:bg-darkcard rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 id="modal-title" className="font-bold text-lg text-gray-800 dark:text-white">New Log Entry</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Close Modal">
                    <i className="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
                        <input type="date" required className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hours</label>
                        <input type="number" required min="0" max="24" className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={newEntry.hours} onChange={e => setNewEntry({...newEntry, hours: Number(e.target.value)})} />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Raw Activities / Notes</label>
                    <textarea required rows={4} className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="List what you did today..."
                        value={newEntry.activities} onChange={e => setNewEntry({...newEntry, activities: e.target.value})}></textarea>
                </div>

                <div className="flex items-center justify-between">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professional Summary</label>
                     <button type="button" onClick={handleAI} disabled={isGenerating || !newEntry.activities} 
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {isGenerating ? <><i className="fas fa-spinner fa-spin mr-1" aria-hidden="true"></i> Magic...</> : <><i className="fas fa-magic mr-1" aria-hidden="true"></i> AI Refine</>}
                     </button>
                </div>
                <textarea rows={3} className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-900 p-2.5 bg-gray-50 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="AI generated summary will appear here, or type manually."
                    value={newEntry.summary} onChange={e => setNewEntry({...newEntry, summary: e.target.value})}></textarea>

                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Submit Entry
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
```

### FILE: components/Messages.tsx
```typescript
import React, { useState } from 'react';
import { User, Message } from '../types';

interface MessagesProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const Messages: React.FC<MessagesProps> = ({ currentUser, users, messages, setMessages }) => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(users.find(u => u.id !== currentUser.id)?.id || null);
  const [inputText, setInputText] = useState('');

  // Get contacts (exclude self)
  const contacts = users.filter(u => u.id !== currentUser.id);

  // Filter messages for current conversation
  const conversation = messages.filter(
    m => (m.senderId === currentUser.id && m.receiverId === selectedContactId) ||
         (m.senderId === selectedContactId && m.receiverId === currentUser.id)
  ).sort((a, b) => a.timestamp - b.timestamp);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContactId) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedContactId,
      content: inputText,
      timestamp: Date.now(),
      read: false
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-darkcard rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
      {/* Contacts List */}
      <div className="w-1/3 border-r dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-bold text-gray-700 dark:text-gray-200">Contacts</h3>
        </div>
        <div className="overflow-y-auto flex-1" role="list" aria-label="Contact list">
            {contacts.map(contact => (
                <button 
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full text-left p-4 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${selectedContactId === contact.id ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
                    aria-selected={selectedContactId === contact.id}
                >
                    <img src={contact.avatar} alt="" className="w-10 h-10 rounded-full mr-3" aria-hidden="true"/>
                    <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-darkbg">
        {selectedContactId ? (
            <>
                <div className="p-4 bg-white dark:bg-darkcard border-b dark:border-gray-700 flex items-center">
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                        {users.find(u => u.id === selectedContactId)?.name}
                    </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-label="Message History">
                    {conversation.map(msg => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'}`}>
                                    {msg.content}
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {conversation.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-10">No messages yet. Start the conversation!</div>
                    )}
                </div>

                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-darkcard border-t dark:border-gray-700 flex gap-2">
                    <label htmlFor="messageInput" className="sr-only">Message</label>
                    <input 
                        id="messageInput"
                        type="text" 
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    />
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="Send Message">
                        <i className="fas fa-paper-plane" aria-hidden="true"></i>
                    </button>
                </form>
            </>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
                Select a contact to start messaging
            </div>
        )}
      </div>
    </div>
  );
};
```

### FILE: components/ThemeSwitcher.tsx
```typescript
import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
    onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange }) => {
    return (
        <div className="flex items-center space-x-2 bg-white dark:bg-darkcard p-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            <button 
                title="Dark Theme" 
                onClick={() => onThemeChange('dark')} 
                className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-transform hover:scale-110"
                aria-label="Dark Mode"
            />
            <button 
                title="Light Theme" 
                onClick={() => onThemeChange('light')} 
                className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary transition-transform hover:scale-110"
                aria-label="Light Mode"
            />
            <button 
                title="High Contrast" 
                onClick={() => onThemeChange('high-contrast')} 
                className="w-6 h-6 rounded-full bg-black border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400 transition-transform hover:scale-110"
                aria-label="High Contrast Mode"
            />
        </div>
    );
};

export default ThemeSwitcher;
```

### FILE: CREATION.md
```md
# aucdt-iam-system

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — TUC -iam-system

**Application:** aucdt-iam-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_aucdt-iam-system_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — TUC -iam-system

**Application:** aucdt-iam-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd aucdt-iam-system
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build aucdt-iam-system
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up aucdt-iam-system
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/README.md
```md
# IAMA Documentation

This directory contains the final documentation assets for the Industrial Attachment Management App.

## 1. Software Requirements Specification (SRS)
The file `SRS_IAMA_Final.md` contains the text-based requirements.

## 2. Interactive Documentation
The application features a built-in documentation viewer accessible at the `/docs` route. This viewer renders the following diagrams dynamically:

*   **System Architecture** (High-level & Detailed)
*   **Technology Stack**
*   **Data Flow Diagram** (Logbook Process)
*   **Database ERD** (Entity Relationship Diagram)
*   **UML Diagrams** (Use Case & Sequence)

## 3. User Guides
The `/docs` route now includes a dedicated "User Guides" tab containing:

*   **Administrator Guide**: System management and auditing.
*   **Deployment Guide**: Production build instructions.
*   **Testing Guide**: Automated and manual verification protocols.

## 4. Presentation Assets
The "Presentation Mode" in the Documentation tab provides simplified, high-impact diagrams suitable for board-level review.
```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Aucdt Iam System
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Aucdt Iam System**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Aucdt Iam System** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Aucdt Iam System** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Recharts 3.7.0, React Router DOM
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/SRS_IAMA_Final.md
```md
# Software Requirements Specification (SRS)
## AUCDT IAM System (Industrial Attachment Management)

**Version:** 1.1 (Refresh)
**Date:** 2024-08-02

---

### 1. Introduction

#### 1.1 Purpose
This document specifies the requirements for the **AUCDT IAM System**, a web-based platform designed to streamline the documentation, supervision, and assessment of student industrial attachments at the **Asanska University College of Design and Technology**.

#### 1.2 Scope
The system provides a unified interface for:
*   **Students**: Specifically those in the **Fashion Design Technology Department**, to log daily activities, generate professional technical summaries using AI, and communicate with supervisors.
*   **Supervisors**: To review, approve, or reject log entries.
*   **Administrators**: To audit system access and verify system health via automated tests.

---

### 2. System Description

#### 2.1 Architecture
The IAM System operates as a Single Page Application (SPA) built with **React 19** and **TypeScript**. It utilizes:
*   **Google Gemini API** for Generative AI features (Logbook Refinement).
*   **Tailwind CSS** for responsive, accessible styling (incorporating AUCDT Maroon & Gold branding).
*   **Mock Services** for simulation of backend persistence and testing layers.

#### 2.2 User Roles
1.  **Student** (e.g., Sampson Danso): Primary data entry user.
2.  **Organization Supervisor** (e.g., Daniel F. Twum): Approver of data.
3.  **Institution Coordinator** (e.g., Emmanuel A. Asante PhD): Viewer of reports.
4.  **System Admin**: System manager and security auditor.

---

### 3. Specific Requirements

#### 3.1 Functional Requirements
*   **FR-01 Logbook Entry**: The system allows creation of dated entries with hours and descriptions.
*   **FR-02 AI Refinement**: The system integrates **Gemini 2.5 Flash** to rewrite raw notes into professional technical summaries suitable for academic reports.
*   **FR-03 Approval Workflow**: Entries must be approved by an Organization Supervisor.
*   **FR-04 Admin Tools**: A secure dashboard must provide access to Audit Logs and the Automated Test Runner.

#### 3.2 Non-Functional Requirements
*   **NFR-01 Accessibility**: The UI supports **High Contrast mode**, **Dark Mode** (auto-triggered after 6 PM), and follows WCAG guidelines.
*   **NFR-02 Performance**: AI responses must be handled asynchronously with loading states.
*   **NFR-03 Security**: **Universal Authentication** is required. All user roles (Student, Organization, Institution, Admin) must authenticate via password before accessing the dashboard.

---

### 4. Interface Guidelines & Models

Visual documentation including **System Architecture**, **Data Flow Diagrams**, and **UML Models** are embedded directly within the application's `/docs` route. 

Please refer to the application "Documentation" tab for the interactive "Digital SRS" which includes:
*   Figure 1: High-Level Architecture
*   Figure 2: Technology Stack
*   Figure 3: Detailed Architecture
*   Figure 4: Logbook Submission DFD
*   Figure 5: UML Use Case Diagram
*   Figure 6: AI Sequence Diagram

---

### 5. Testing & Verification

The project includes an internal "Mock Playwright" service located at `services/mockPlaywright.ts`. This service simulates End-to-End (E2E) user journeys including:
*   Student Login & Submission
*   Admin Security Challenges
*   API Latency Checks

Test results are visualized in the Admin Dashboard.
```

### FILE: docs/TESTING.md
```md
# Testing Guide — TUC -iam-system

**Application:** aucdt-iam-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd aucdt-iam-system
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- ========== BASIC SEO META TAGS ========== -->
    <title>Techbridge University College | Pioneering Design & Technology</title>
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    
    <!-- 🆕 SEO ADDITION: Keywords -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    
    <!-- 🆕 SEO ADDITION: Author and Publisher -->
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    
    <!-- 🆕 SEO ADDITION: Canonical URL -->
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    
    <!-- 🆕 SEO ADDITION: Robots Meta Tag -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- 🆕 SEO ADDITION: Language and Geographic Targeting -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    
    <!-- ========== OPEN GRAPH META TAGS (Facebook, LinkedIn, etc.) ========== -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    
    <!-- ========== TWITTER CARD META TAGS ========== -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    
    <!-- ========== ADDITIONAL SEO META TAGS ========== -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="rating" content="general" />
    <meta name="referrer" content="origin-when-cross-origin" />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>
        
    <!-- Favicon / Tab Logo -->
    <link rel="icon" type="image/png" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    <link rel="apple-touch-icon" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
      /* High Contrast Mode Overrides */
      html.high-contrast body,
      html.high-contrast div,
      html.high-contrast nav,
      html.high-contrast aside,
      html.high-contrast header,
      html.high-contrast main,
      html.high-contrast section,
      html.high-contrast article,
      html.high-contrast table,
      html.high-contrast tr,
      html.high-contrast td,
      html.high-contrast th,
      html.high-contrast ul,
      html.high-contrast li,
      html.high-contrast h1,
      html.high-contrast h2,
      html.high-contrast h3,
      html.high-contrast p,
      html.high-contrast span,
      html.high-contrast input, 
      html.high-contrast textarea, 
      html.high-contrast select,
      html.high-contrast details,
      html.high-contrast summary {
        background-color: #000000 !important;
        color: #ffff00 !important;
        border-color: #ffff00 !important;
      }

      html.high-contrast button,
      html.high-contrast a {
        background-color: #000000 !important;
        color: #ffff00 !important;
        border: 2px solid #ffff00 !important;
        text-decoration: underline !important;
      }

      html.high-contrast button:hover,
      html.high-contrast a:hover {
        background-color: #ffff00 !important;
        color: #000000 !important;
      }
      
      html.high-contrast .bg-primary {
          background-color: #000000 !important;
          border: 2px solid #ffff00 !important;
          color: #ffff00 !important;
      }
      
      html.high-contrast svg, 
      html.high-contrast i {
          color: #ffff00 !important;
      }
      
      html.high-contrast img {
          filter: grayscale(100%) contrast(200%);
          border: 1px solid #ffff00 !important;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "recharts": "https://aistudiocdn.com/recharts@^3.4.1",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.30.0",
    "react-router-dom": "https://aistudiocdn.com/react-router-dom@^7.9.6"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-gray-50 text-gray-900 dark:bg-darkbg dark:text-gray-100 transition-colors duration-200">
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "AUCDT IAM System",
  "description": "Industrial Attachment Management System for Asanska University College of Design and Technology.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "aucdt-iam-system",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@google/genai": "^1.30.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.9.6",
    "recharts": "^3.4.1"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@vitejs/plugin-react": "^5.1.1",
    "typescript": "~5.9.3",
    "vite": "^7.2.2",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1f0i_97hKY0APA0OJSkhNeOdewjz2a6kG

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/geminiService.ts
```typescript
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

// --- Local Utilities ---
const logger = {
  info: (msg: string, data?: any) => console.info(`[AI Service] ${msg}`, data || ''),
  warn: (msg: string, data?: any) => console.warn(`[AI Service] ${msg}`, data || ''),
  error: (msg: string, data?: any) => console.error(`[AI Service] ${msg}`, data || ''),
};

const sanitizeInput = (str: string): string => {
  if (!str) return '';
  // Remove HTML tags and limit length
  return str.replace(/[<>{}]/g, '').trim().slice(0, 5000);
};

const validateResponse = (text: string, options: { minWords: number; maxWords: number }) => {
  if (!text) return { isValid: false, errors: ['Empty response'] };
  
  const wordCount = text.split(/\s+/).length;
  const errors: string[] = [];
  
  if (wordCount < options.minWords) errors.push(`Too short (${wordCount} words)`);
  if (wordCount > options.maxWords) errors.push(`Too long (${wordCount} words)`);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

interface SummaryConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  retries?: number;
}

/**
 * Generates a professional technical summary from raw logbook notes.
 * Tailored for AUCDT Fashion Design Technology students.
 * 
 * @param notes - Raw industrial attachment logbook entries
 * @param config - Optional generation parameters
 * @returns Professionally formatted single-paragraph summary
 */
export const summarizeLogbookEntry = async (
  notes: string, 
  config: SummaryConfig = {}
): Promise<string> => {
  
  // 1. Validation & Sanitization
  if (!apiKey) {
    logger.warn("Gemini API Key is missing.");
    return "AI Summarization unavailable (Missing API Key).";
  }

  const sanitizedNotes = sanitizeInput(notes);
  if (!sanitizedNotes || sanitizedNotes.length < 5) {
    return "Please provide valid logbook notes (at least 5 characters) to summarize.";
  }

  const {
    model = 'gemini-2.5-flash',
    maxTokens = [REDACTED_CREDENTIAL]
    temperature = 0.3, // Low temp for consistent, professional output
    retries = 3
  } = config;

  // 2. Structured Prompt Engineering
  const systemInstruction = `You are a technical writing specialist for Asanska University College of Design and Technology (AUCDT).

TASK: Transform student logbook notes into ONE professional paragraph suitable for an industrial attachment report.

CONTEXT: The student is in the Fashion Design Technology Department.

REQUIREMENTS:
- Length: 40-100 words (concise).
- Focus: Technical skills (CAD, pattern drafting, garment construction, fabric analysis), design processes, tools used.
- Style: Formal academic tone, past tense, third person (e.g., "The student...", or passive voice "Patterns were drafted...").
- Exclude: Dates, personal emotions, slang, or casual language.

OUTPUT: Return ONLY the paragraph text. No preamble or markdown formatting.`;

  const userPrompt = `Raw Logbook Notes:\n---\n${sanitizedNotes}\n---\n\nProfessional Summary:`;

  // 3. Retry Logic with Exponential Backoff
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Generating summary (attempt ${attempt}/${retries})`);

      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 40,
        }
      });

      const summary = response.text?.trim();

      if (!summary) {
        throw new Error('Empty response from AI model');
      }

      // 4. Quality Checks
      const validation = validateResponse(summary, { minWords: 10, maxWords: 150 });
      
      if (!validation.isValid) {
        logger.warn('Summary quality check failed', validation.errors);
        // If it's just a length issue, we might accept it if it's the last retry, 
        // but for now we throw to trigger retry or failure.
        if (attempt < retries) throw new Error(`Quality check failed: ${validation.errors.join(', ')}`);
      }

      logger.info('Summary generated successfully');
      return summary;

    } catch (error) {
      lastError = error;
      logger.error(`Attempt ${attempt} failed`, error);

      if (attempt < retries) {
        // Exponential backoff: 2^attempt * 500ms
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return "Unable to generate summary at this time. Please check your connection and try again.";
};
```

### FILE: services/mockData.ts
```typescript
import { Role, User, LogEntry, LogStatus, Message, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Sampson Danso', 
    role: Role.STUDENT, 
    email: 'sampson.danso@aucdt.edu.gh', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/Sampson.png' 
  },
  { 
    id: 'u2', 
    name: 'Daniel F. Twum', 
    role: Role.ORGANIZATION, 
    email: 'daniel.twum@techcorp.com', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/ClipAI%2Dfill%2Dtriangle.png' 
  },
  { 
    id: 'u3', 
    name: 'Emmanuel A. Asante PhD', 
    role: Role.INSTITUTION, 
    email: 'e.asante@aucdt.edu.gh', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/ClipAI%2Dfill%2Dhexagon%2D1.png' 

  },
  { 
    id: 'u4', 
    name: 'System Admin', 
    role: Role.ADMIN, 
    email: 'admin@aucdt.edu.gh', 
    avatar: 'https://aucdt.edu.gh/storage/aistudio-hosting/aucdt-assets/ClipAI%2Dfill-arrow.png' 
  },
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'l1',
    studentId: 'u1',
    date: '2023-10-25',
    hours: 8,
    activities: 'Assisted in fashion pattern drafting. Learned about CAD for garment design.',
    summary: 'Supported the design team with pattern drafting and received training on Computer-Aided Design (CAD) software for garment construction.',
    status: LogStatus.APPROVED
  },
  {
    id: 'l2',
    studentId: 'u1',
    date: '2023-10-26',
    hours: 6,
    activities: 'Started documentation for the new collection launch.',
    summary: 'Initiated the creation of technical documentation for the upcoming seasonal fashion collection.',
    status: LogStatus.PENDING
  }
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u2', receiverId: 'u1', content: 'Please submit your report by Friday.', timestamp: Date.now() - 86400000, read: false }
];

export const INITIAL_AUDIT: AuditLog[] = [
  { id: 'a1', timestamp: Date.now() - 100000, action: 'System Health Check Initiated', adminId: 'u4' }
];
```

### FILE: services/mockPuppeteer.ts
```typescript
import { TestCase, TestStep } from '../types';

// Helper to generate a placeholder screenshot SVG with context
const generateScreenshot = (text: string, color: string = '#3b82f6', mode: 'light' | 'dark' = 'light') => {
  const bg = mode === 'dark' ? '#1f2937' : '#f3f4f6';
  const winBg = mode === 'dark' ? '#111827' : '#ffffff';
  const textColor = mode === 'dark' ? '#e5e7eb' : '#1f2937';
  const tsColor = mode === 'dark' ? '#9ca3af' : '#6b7280';

  const svg = `
  <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bg}"/>
    <!-- Browser Window -->
    <rect x="20" y="20" width="760" height="560" rx="10" fill="${winBg}" stroke="${color}" stroke-width="4"/>
    <rect x="20" y="20" width="760" height="40" rx="10" fill="${color}"/>
    <!-- Window Controls -->
    <circle cx="40" cy="40" r="6" fill="#ff5f56"/>
    <circle cx="60" cy="40" r="6" fill="#ffbd2e"/>
    <circle cx="80" cy="40" r="6" fill="#27c93f"/>
    <!-- Mock UI Elements -->
    <rect x="50" y="80" width="200" height="20" rx="4" fill="#e5e7eb" opacity="0.5"/>
    <rect x="50" y="120" width="700" height="150" rx="4" fill="#e5e7eb" opacity="0.2"/>
    <rect x="50" y="290" width="700" height="20" rx="4" fill="#e5e7eb" opacity="0.2"/>
    
    <!-- Overlay Text -->
    <text x="400" y="300" font-family="monospace" font-size="24" text-anchor="middle" fill="${tsColor}" opacity="0.5">MOCK BROWSER CAPTURE</text>
    <text x="400" y="340" font-family="sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="${textColor}">${text}</text>
    <text x="760" y="570" font-family="monospace" font-size="12" text-anchor="end" fill="${tsColor}">${new Date().toISOString()}</text>
  </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Delay helper
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Test Suites Definition
export const TEST_SUITES: TestCase[] = [
  {
    id: 'TS-001',
    name: 'E2E: Student Journey',
    description: 'Verifies login, logbook entry creation, AI refinement, and submission.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Launch Browser & Navigate to Login', status: 'PENDING' },
      { id: 's2', description: 'Input Credentials (Student)', status: 'PENDING' },
      { id: 's3', description: 'Verify Dashboard Load', status: 'PENDING' },
      { id: 's4', description: 'Navigate to Logbook', status: 'PENDING' },
      { id: 's5', description: 'Create New Entry with AI', status: 'PENDING' },
      { id: 's6', description: 'Verify Submission Status', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-002',
    name: 'Security: Admin Access',
    description: 'Tests RBAC enforcement and audit logging triggers.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Attempt Admin Access (No Auth)', status: 'PENDING' },
      { id: 's2', description: 'Challenge Prompt Displayed', status: 'PENDING' },
      { id: 's3', description: 'Input Admin Password', status: 'PENDING' },
      { id: 's4', description: 'Verify Admin Dashboard Access', status: 'PENDING' },
      { id: 's5', description: 'Check Audit Log Creation', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-003',
    name: 'Integration: Gemini API',
    description: 'Checks connectivity to AI service and response handling.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Initialize Gemini Client', status: 'PENDING' },
      { id: 's2', description: 'Send Test Prompt', status: 'PENDING' },
      { id: 's3', description: 'Validate Response Latency', status: 'PENDING' },
      { id: 's4', description: 'Handle API Error Gracefully', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-004',
    name: 'UI/UX: Accessibility & Themes',
    description: 'Verifies High Contrast toggle and Dark Mode responsiveness.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Check Default Theme (Time-based)', status: 'PENDING' },
      { id: 's2', description: 'Toggle Dark Mode', status: 'PENDING' },
      { id: 's3', description: 'Verify Background/Text Contrast', status: 'PENDING' },
      { id: 's4', description: 'Enable High Contrast Mode', status: 'PENDING' },
      { id: 's5', description: 'Verify ARIA Attributes Present', status: 'PENDING' }
    ]
  },
  {
    id: 'TS-005',
    name: 'Auth: Password Recovery',
    description: 'Tests the forgot password modal and mock email simulation.',
    status: 'IDLE',
    steps: [
      { id: 's1', description: 'Open Login Screen', status: 'PENDING' },
      { id: 's2', description: 'Click Forgot Password', status: 'PENDING' },
      { id: 's3', description: 'Enter Email & Submit', status: 'PENDING' },
      { id: 's4', description: 'Verify Mock Network Request', status: 'PENDING' },
      { id: 's5', description: 'Check Success Alert', status: 'PENDING' }
    ]
  }
];

// Mock Runner Logic
export const runStepMock = async (suiteId: string, step: TestStep): Promise<{ screenshot: string, duration: number }> => {
  const startTime = Date.now();
  
  // Variable delay to simulate real processing
  const delay = Math.floor(Math.random() * 800) + 400; 
  await wait(delay);

  // Mock Screenshots based on step context
  let screenshotText = step.description;
  let color = '#3b82f6'; // Blue
  let mode: 'light' | 'dark' = 'light';

  if (step.description.includes('Error')) {
    screenshotText = 'Error Boundary Test';
    color = '#ef4444'; // Red
  } else if (step.description.includes('Admin')) {
    screenshotText = 'Admin Panel';
    color = '#10b981'; // Green
  } else if (step.description.includes('Dark') || step.description.includes('Contrast')) {
    screenshotText = 'Accessibility Check';
    color = '#a855f7'; // Purple
    mode = 'dark';
  } else if (step.description.includes('Password')) {
    screenshotText = 'Auth Modal';
    color = '#f59e0b'; // Amber
  }

  return {
    screenshot: generateScreenshot(screenshotText, color, mode),
    duration: Date.now() - startTime
  };
};
```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — aucdt-iam-system
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('aucdt-iam-system E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript
export enum Role {
  STUDENT = 'STUDENT',
  ORGANIZATION = 'ORGANIZATION',
  INSTITUTION = 'INSTITUTION',
  ADMIN = 'ADMIN'
}

export enum LogStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
}

export interface LogEntry {
  id: string;
  studentId: string;
  date: string;
  hours: number;
  activities: string;
  summary: string; // AI Generated
  status: LogStatus;
  feedback?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: number;
  action: string;
  adminId: string;
}

export interface Report {
  id: string;
  studentId: string;
  fileName: string;
  submittedAt: number;
}

export type Theme = 'light' | 'dark' | 'high-contrast';

// Testing Framework Types
export type TestStatus = 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';

export interface TestStep {
  id: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  duration?: number;
  screenshotUrl?: string;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  steps: TestStep[];
}
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — aucdt-iam-system
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — aucdt-iam-system
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

### FILE: _tmp_52868_5615dd29f9561b47eff21eab518f91d4
```text

```

