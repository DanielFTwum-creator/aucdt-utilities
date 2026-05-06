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
    let expectedPassword = selectedUser.role === Role.ADMIN ? 'admin123' : '123456';
    
    if (customPasswords[selectedUser.id]) {
        expectedPassword = customPasswords[selectedUser.id];
    }

    if (password === expectedPassword) {
      onLogin(selectedUser);
    } else {
      setError('Invalid password');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
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
    return <Login users={allUsers} onLogin={handleLogin} setTheme={setTheme} onRegister={handleRegistration} customPasswords={userPasswords} />;
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