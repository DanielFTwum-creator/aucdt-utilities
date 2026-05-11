import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, FileText, Lock, LogOut, RotateCcw, Settings, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { authService } from '../services/AuthService';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator';
  lastLogin: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failure';
}

interface AdminSession {
  isAuthenticated: boolean;
  userId?: string;
  username?: string;
  loginTime?: string;
}

export const AdminPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('aucdt_admin_token'));
  const [session, setSession] = useState<AdminSession>({ isAuthenticated: false });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@aucdt.edu.au',
      role: 'admin',
      lastLogin: new Date().toISOString(),
      createdAt: '2026-01-01T00:00:00Z'
    }
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'settings'>('overview');

  // Validate token on mount
  useEffect(() => {
    const validate = async () => {
      if (token) {
        try {
          const result = await authService.validateToken(token);
          if (result.success && result.valid) {
            setSession({
              isAuthenticated: true,
              userId: result.user.id || 'admin_001',
              username: result.user.username || 'administrator',
              loginTime: new Date().toISOString()
            });
          } else {
            setSession({ isAuthenticated: false });
            setToken(null);
            localStorage.removeItem('aucdt_admin_token');
          }
        } catch {
          setSession({ isAuthenticated: false });
        }
      }
    };
    if (isOpen) validate();
  }, [token, isOpen]);

  // Log audit action
  const logAuditAction = (action: string, details: string, status: 'success' | 'failure' = 'success') => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      userId: session.userId || 'unknown',
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1', // In production: get actual IP
      status
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLoginError('');
    
    try {
      const result = await authService.login(username, password);
      
      if (result.success) {
        setToken(result.token);
        localStorage.setItem('aucdt_admin_token', result.token);
        const newSession: AdminSession = {
          isAuthenticated: true,
          userId: 'admin_001',
          username: username,
          loginTime: new Date().toISOString()
        };
        setSession(newSession);
        setPassword('');
        logAuditAction('admin_login', `Administrator login successful for ${username}`, 'success');
      } else {
        setLoginError(result.message || 'Invalid credentials');
        logAuditAction('admin_login_attempt', `Failed login attempt for ${username}: ${result.message}`, 'failure');
      }
    } catch (err) {
      setLoginError('Authentication service unavailable');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    logAuditAction('admin_logout', 'Administrator logout', 'success');
    authService.logout();
    setSession({ isAuthenticated: false });
    setToken(null);
    localStorage.removeItem('aucdt_admin_token');
    setPassword('');
    onClose();
  };

  const handleAddUser = (username: string, email: string, role: 'admin' | 'moderator') => {
    const newUser: AdminUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      role,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setAdminUsers([...adminUsers, newUser]);
    logAuditAction('user_created', `New ${role} user created: ${username}`, 'success');
  };

  const handleDeleteUser = (userId: string) => {
    const user = adminUsers.find(u => u.id === userId);
    setAdminUsers(adminUsers.filter(u => u.id !== userId));
    logAuditAction('user_deleted', `User removed: ${user?.username}`, 'success');
  };

  const handleClearLogs = () => {
    setAuditLogs([]);
    logAuditAction('audit_logs_cleared', 'Audit logs cleared by administrator', 'success');
  };

  if (!isOpen) return null;

  if (!session.isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Login
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              <div>
                <label className="text-sm font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    disabled={isAuthenticating}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isAuthenticating}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isAuthenticating}>
                {isAuthenticating ? 'Authenticating...' : 'Authenticate'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl m-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Admin Control Panel</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardHeader>

        {/* Admin Info */}
        <div className="px-6 py-4 bg-blue-50 dark:bg-blue-950 border-b">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Logged in as: <span className="font-semibold">{session.username || 'Admin'}</span> | 
            Session started: {new Date(session.loginTime || '').toLocaleString()}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          {(['overview', 'users', 'logs', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <CardContent className="pt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">System Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Admin Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{adminUsers.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Audit Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{auditLogs.length}</div>
                  </CardContent>
                </Card>
              </div>
              <Alert>
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  System Status: All systems operational. Dashboard is running normally.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Manage Admin Users</h3>
              <div className="space-y-4">
                {adminUsers.map(user => (
                  <div key={user.id} className="p-4 border rounded-lg flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Last login: {new Date(user.lastLogin).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={adminUsers.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Audit Logs</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearLogs}
                  disabled={auditLogs.length === 0}
                >
                  Clear Logs
                </Button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No audit logs yet</p>
                ) : (
                  auditLogs.map(log => (
                    <div key={log.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{log.action}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{log.details}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Admin Settings</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Data Export</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Export audit logs and system configuration for backup.
                  </p>
                  <Button size="sm" variant="outline">
                    Export Configuration
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">System Maintenance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Perform system maintenance operations.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Refresh Cache
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
