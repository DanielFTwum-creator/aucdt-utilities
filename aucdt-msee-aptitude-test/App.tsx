import React, { useEffect, useState, useMemo } from 'react';
import { SelfTestView } from './components/SelfTestView';
import { AdminView } from './components/AdminView';
import { StudentFlow } from './components/StudentFlow';
import { AuthView } from './components/AuthView';
import { Spinner } from './components/common';
import { AUCDT_COLORS } from './constants';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { User } from './types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from './hooks/useAuth';


const ForgotPasswordInstructions: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="w-full max-w-lg mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <ShieldAlert className="mx-auto mb-6" size={60} style={{ color: 'var(--primary-text-color)' }} />
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Administrator Password Reset</h1>
        <div className="text-left bg-[var(--background-color)] p-6 rounded-lg space-y-4">
            <p className="text-lg">The administrator password for this application is managed in the MySQL database.</p>
            <p className="font-bold text-lg" style={{color: 'var(--primary-text-color)'}}>Automatic password recovery is not available through this interface.</p>
            <ol className="list-decimal list-inside space-y-2">
                <li>To change the password, a database administrator must manually update the password hash in the `users` table for the administrator account.</li>
                <li>This is a security measure to ensure only authorized personnel with direct database access can manage administrator credentials.</li>
            </ol>
        </div>
        <button
            onClick={onBack}
            className="w-full mt-8 py-3 px-10 rounded-lg text-lg font-bold shadow-md inline-flex items-center justify-center space-x-2 transition-colors"
            style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>
            <ArrowLeft size={20} />
            <span>Back to Login</span>
        </button>
    </div>
);

const StudentForgotPasswordInstructions: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="w-full max-w-lg mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <ShieldAlert className="mx-auto mb-6" size={60} style={{ color: 'var(--primary-text-color)' }} />
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Student Password Recovery</h1>
        <div className="text-left bg-[var(--background-color)] p-6 rounded-lg space-y-4">
            <p className="text-lg">This application uses a simplified, local-only account system.</p>
            <p className="font-bold text-lg" style={{color: 'var(--primary-text-color)'}}>Automatic password recovery is not available.</p>
            <ul className="list-disc list-inside space-y-2">
                <li>Please try to remember your password and attempt to sign in again.</li>
                <li>If you are unable to remember your password, you will need to create a new account using a different email address.</li>
                <li className="font-semibold text-[var(--message-error-text)]">Please note: Creating a new account will not restore any exam progress from your old account.</li>
            </ul>
        </div>
        <button
            onClick={onBack}
            className="w-full mt-8 py-3 px-10 rounded-lg text-lg font-bold shadow-md inline-flex items-center justify-center space-x-2 transition-colors"
            style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>
            <ArrowLeft size={20} />
            <span>Back to Login</span>
        </button>
    </div>
);

const AppContent: React.FC = () => {
    const { user, token, loading: authLoading, logOut } = useAuth();
    const [view, setView] = useState<'student' | 'admin_login' | 'admin_dashboard' | 'selftest' | 'forgot_password' | 'student_forgot_password'>('student');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const hasAdminQuery = queryParams.has('admin');
        const hasSelftestQuery = queryParams.has('selftest');

        // This effect determines the primary view based on URL and auth state.
        // Sub-views like "forgot password" are handled by direct state updates from user actions.
        if (view !== 'student_forgot_password' && view !== 'forgot_password') {
            if (hasAdminQuery) {
                setView(user?.role === 'admin' ? 'admin_dashboard' : 'admin_login');
            } else if (hasSelftestQuery) {
                setView('selftest');
            } else {
                setView('student');
            }
        }
        setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Only re-evaluate view when auth state changes.


    const handleAdminLogout = () => {
        logOut();
        setView('admin_login');
    };
    
    const handleStudentSignOut = () => {
        logOut();
        setView('student');
    };

    const renderContent = useMemo(() => {
        if (authLoading || !isReady) {
            return <Spinner size={64} />;
        }

        switch (view) {
            case 'admin_dashboard':
                if (user && user.role === 'admin' && token) {
                    return <AdminView user={user} token={token} handleSignOut={handleAdminLogout} />;
                }
                // Fallback to login if user is not an admin, preventing crashes.
                setView('admin_login');
                return null;
            case 'admin_login':
                return <AuthView isAdminLogin={true} onForgotPassword={() => setView('forgot_password')} onAdminForgotPassword={() => setView('forgot_password')} />;
            case 'forgot_password':
                return <ForgotPasswordInstructions onBack={() => setView('admin_login')} />;
            case 'student_forgot_password':
                return <StudentForgotPasswordInstructions onBack={() => setView('student')} />;
            case 'selftest':
                return <SelfTestView />;
            case 'student':
            default:
                return user ? <StudentFlow user={user} handleSignOut={handleStudentSignOut} /> : <AuthView isAdminLogin={false} onForgotPassword={() => setView('student_forgot_password')} onAdminForgotPassword={() => setView('forgot_password')} />;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, isReady, authLoading, user, token]);

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center bg-[var(--background-color)] text-[var(--text-color)]">
            <div className="max-w-4xl mx-auto w-full">
                <div className="absolute top-4 right-4 z-10">
                    <ThemeSwitcher />
                </div>
                {renderContent}
            </div>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};


export default App;