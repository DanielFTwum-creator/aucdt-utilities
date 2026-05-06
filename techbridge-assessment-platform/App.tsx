import { Home, LogOut, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { initialProgrammeData } from './constants';
import { useAuditLog } from './hooks/useAuditLog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthService } from './services/AuthService';
import { Assessment, Programme, ProgrammeData, Results, View } from './types';

import AdminPanel from './components/AdminPanel';
import AssessmentPlayer from './components/AssessmentPlayer';
import LoginModal from './components/LoginModal';
import ProgrammeDashboard from './components/ProgrammeDashboard';
import ProgrammeDetail from './components/ProgrammeDetail';
import ResultsPage from './components/ResultsPage';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [programmeData, setProgrammeData] = useLocalStorage<ProgrammeData>('tuc-programme-data', initialProgrammeData);
    const { log, addLogEntry, setLog } = useAuditLog();

    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [results, setResults] = useState<Results | null>(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(AuthService.isAuthenticated());

    // Validate stored token on mount
    useEffect(() => {
        const token = AuthService.getToken();
        if (token) {
            fetch('http://localhost:5000/api/auth/validate', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.valid) {
                        AuthService.logout();
                        setIsAdminLoggedIn(false);
                    }
                })
                .catch(() => {
                    // Backend unreachable — keep existing state, don't force logout
                });
        }
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setIsAdminLoggedIn(false);
        setView('dashboard');
        addLogEntry('ADMIN_LOGOUT', {});
    };

    const handleSetProgramme = (programme: Programme) => {
        setSelectedProgramme(programme);
        addLogEntry('VIEW_PROGRAMME', { programmeId: programme.id, programmeName: programme.name });
    };

    const handleSetAssessment = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        addLogEntry('SELECT_ASSESSMENT', { assessmentId: assessment.id, assessmentTitle: assessment.title });
    };

    const renderView = () => {
        if (view === 'login') {
            return <LoginModal 
                onLoginSuccess={() => {
                    setIsAdminLoggedIn(true);
                    setView('admin');
                    addLogEntry('ADMIN_LOGIN_SUCCESS', {});
                }} 
                onClose={() => setView('dashboard')}
            />
        }
        
        switch (view) {
            case 'admin':
                return isAdminLoggedIn ? <AdminPanel programmeData={programmeData} setProgrammeData={setProgrammeData} log={log} setLog={setLog} /> : <ProgrammeDashboard programmes={programmeData.programmes} setView={setView} setProgramme={handleSetProgramme} />;
            case 'programmeDetail':
                return selectedProgramme ? <ProgrammeDetail programme={selectedProgramme} setView={setView} setAssessment={handleSetAssessment} /> : <p>Programme not found.</p>;
            case 'assessment':
                return selectedAssessment ? <AssessmentPlayer assessment={selectedAssessment} questions={programmeData.questions[selectedAssessment.id] || []} setView={setView} setResults={setResults} addLogEntry={addLogEntry} /> : <p>Assessment not found.</p>;
            case 'results':
                return results ? <ResultsPage results={results} setView={setView} /> : <p>Results not available.</p>;
            case 'dashboard':
            default:
                return <ProgrammeDashboard programmes={programmeData.programmes} setView={setView} setProgramme={handleSetProgramme} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-md w-full p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center">
                    <img src="https://via.placeholder.com/40/8B1538/FFD700?text=TUC" alt="TUC Logo" className="h-10 mr-3" />
                    <h1 className="text-xl font-bold text-tuc-maroon">TUC Assessment Platform</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => setView('dashboard')} className="flex items-center px-4 py-2 rounded-full text-tuc-maroon hover:bg-tuc-gold-light transition-colors">
                        <Home className="w-5 h-5 mr-2" />
                        Home
                    </button>
                    {isAdminLoggedIn ? (
                        <>
                            <button type="button" onClick={() => setView('admin')} className="flex items-center px-4 py-2 rounded-full text-tuc-maroon hover:bg-tuc-gold-light transition-colors">
                                <Shield className="w-5 h-5 mr-2" />
                                Admin
                            </button>
                            <button type="button" onClick={handleLogout} className="flex items-center px-4 py-2 rounded-full text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <button type="button" onClick={() => { setView('login'); addLogEntry('ADMIN_LOGIN_ATTEMPT', {}); }} className="flex items-center px-4 py-2 rounded-full text-tuc-maroon hover:bg-tuc-gold-light transition-colors">
                            <Shield className="w-5 h-5 mr-2" />
                            Admin
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-grow p-6 md:p-10">
                {view !== 'login' && renderView()}
            </main>
            {view === 'login' && renderView()}

        </div>
    );
};

export default App;