import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
// FIX: Changed default import to named import for LecturerAssessmentForm.
import { LecturerAssessmentForm } from './components/LecturerAssessmentForm';
import LecturerEvaluationDashboard from './components/LecturerEvaluationDashboard';
import LoginModal from './components/LoginModal';
import { programmes as initialProgrammes, lecturers as initialLecturers, courses as initialCourses } from './constants';
import { LecturerEvaluation, DashboardTab, AuditLog, ExtractedProgramme, Programme, Lecturer, Course } from './types';

const API_BASE_URL = '/api/v1'; // Use a relative path for proxying

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginError, setLoginError] = useState('');
    
    // State for evaluations and logs, which are fetched from the API
    const [evaluations, setEvaluations] = useState<LecturerEvaluation[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    
    // State for the core curriculum data.
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);

    const addAuditLog = useCallback((event: string, status: AuditLog['status'], details: string) => {
        // This is primarily for client-side feedback; the authoritative log is on the backend.
        const newLog: AuditLog = {
            id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            timestamp: new Date().toISOString(),
            event,
            status,
            details,
        };
        setAuditLogs(prev => [newLog, ...prev]);
    }, []);

    const fetchAdminData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
            if (!response.ok) throw new Error('Failed to fetch admin data');
            const data = await response.json();
            setEvaluations(data.evaluations || []);
            // Prepend server logs to any existing client-side logs
            setAuditLogs(prevClientLogs => [...(data.auditLogs || []), ...prevClientLogs]);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            addAuditLog('API Connection Failed', 'Failure', 'Could not fetch admin dashboard data from the backend.');
        }
    }, [addAuditLog]);
    
    useEffect(() => {
        const loadInitialData = () => {
            setIsLoading(true);
            // In this prototype environment, we load the curriculum directly from local constants
            // to ensure the app works without a running backend. The API call has been removed
            // to prevent the "Failed to fetch" error.
            setProgrammes(initialProgrammes);
            setLecturers(initialLecturers);
            setCourses(initialCourses);
            setIsLoading(false);
            // Add a log to indicate the data source, visible in the admin panel.
            addAuditLog('Initial Data Loaded', 'Info', 'Curriculum loaded from local source for demonstration.');
        };
        loadInitialData();
    }, [addAuditLog]);
    
    // Theme management
    const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark' || savedTheme === 'high-contrast') {
                return savedTheme;
            }
            if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'high-contrast');

        if (theme !== 'light') {
            root.classList.add(theme);
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleToggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('high-contrast');
        } else {
            setTheme('light');
        }
    };

    const handleLogin = async (password: string) => {
        setLoginError('');
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                setIsAuthenticated(true);
                setIsLoginModalOpen(false);
                setLoginError('');
                addAuditLog('Admin Login', 'Success', 'Administrator successfully logged in.');
                await fetchAdminData();
            } else if (response.status === 401) {
                setLoginError('Invalid password. Please try again.');
            } else {
                 setLoginError('An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Could not connect to the server. Please check your connection.');
        }
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setActiveTab('overview');
        // Clear admin-only data on logout
        setEvaluations([]);
        // Keep the initial local data log
        setAuditLogs(prev => prev.filter(log => log.event === 'Initial Data Loaded'));
        addAuditLog('Admin Logout', 'Info', 'Administrator logged out.');
    };

    const handleSubmissionSuccess = useCallback(() => {
        // Refetch all admin data to show the new submission and any new audit logs.
        if(isAuthenticated) {
          fetchAdminData();
        }
        // The form itself handles showing the success message.
    }, [fetchAdminData, isAuthenticated]);

    const handlePdfUpdate = (extractedData: ExtractedProgramme[], file: File, duration: number) => {
        // The backend has processed the PDF. Now we update the client state.
        // 1. Clear old evaluations immediately
        setEvaluations([]);

        // 2. Transform and update curriculum state using the new flat model
        const newProgrammes: Programme[] = [];
        const newCourses: Course[] = [];
        const lecturerMap = new Map<string, { id: string; name: string }>();

        extractedData.forEach(prog => {
            newProgrammes.push({ id: prog.programmeId, name: prog.programmeName });
            
            prog.courses.forEach(course => {
                const courseLecturerIds: string[] = [];
                course.lecturers.forEach(lecturerName => {
                    const lecturerId = lecturerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
                    if (!lecturerMap.has(lecturerId)) {
                        lecturerMap.set(lecturerId, { id: lecturerId, name: lecturerName });
                    }
                    courseLecturerIds.push(lecturerId);
                });

                newCourses.push({
                    id: course.courseId,
                    name: course.courseName,
                    programmeId: prog.programmeId,
                    lecturerIds: courseLecturerIds
                });
            });
        });
        
        const newLecturers = Array.from(lecturerMap.values());

        setProgrammes(newProgrammes);
        setLecturers(newLecturers);
        setCourses(newCourses);

        // 3. Add a client-side audit log for immediate feedback.
        // The authoritative log will come from the backend on the next data fetch.
        addAuditLog(
            'Curriculum Update', 
            'Success', 
            `Updated from ${file.name}. Found ${newProgrammes.length} programmes, ${newCourses.length} courses, and ${newLecturers.length} unique lecturers. Process took ${duration.toFixed(1)}s.`
        );
        alert('Curriculum data updated successfully! All previous evaluations have been cleared.');
        // Refetch admin data to get the latest (empty) evaluations and the new audit log from the server.
        fetchAdminData();
    };

    const handlePdfError = (error: Error, file: File) => {
        addAuditLog(
            'Curriculum Update', 
            'Failure', 
            `Failed to process ${file.name}. Error: ${error.message}`
        );
    };
    
    // Dashboard active tab state needs to be here
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
    
    const renderAppContent = () => {
        if (isLoading) {
             return (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg font-semibold text-[#2C1810]/80 dark:text-[#E6D5C7] [.high-contrast_&]:text-white">Loading Application Data...</p>
                </div>
            );
        }
        
        if (isAuthenticated) {
            return (
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <LecturerEvaluationDashboard 
                        evaluations={evaluations} 
                        programmes={programmes}
                        lecturers={lecturers}
                        courses={courses}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onPdfUpdate={handlePdfUpdate}
                        onPdfError={handlePdfError}
                        auditLogs={auditLogs}
                    />
                </main>
            );
        }
        
        return (
             <main 
                className="py-12 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 1px 1px, hsla(27, 26%, 12%, 0.15) 1px, transparent 0),
                        linear-gradient(135deg, hsla(342, 68%, 31%, 0.95), hsla(33, 73%, 45%, 0.85))
                    `,
                    backgroundSize: '4px 4px, 100% 100%',
                }}
            >
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-12 max-w-7xl mx-auto items-center">
                    <div className="lg:col-span-2 text-white/90 py-8">
                         <img 
                            src="https://aucdt.edu.gh/wp-content/uploads/2022/04/aucdt-logo-for-web.png" 
                            alt="Asanska University College of Design and Technology Logo" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-[#E6D5C7]/50 mb-8"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                         />
                        <div className="max-w-3xl">
                             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                                Shape Your Education.
                            </h1>
                            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-white/90">
                                Lecturer & Course Evaluation
                            </h2>
                            <p className="mt-4 text-white/80 leading-relaxed max-w-2xl" style={{ lineHeight: 1.6 }}>
                                Your anonymous feedback is essential for fostering academic excellence. By sharing your thoughtful and constructive insights, you directly contribute to the quality of teaching, course development, and the overall learning experience at Asanska University College of Design and Technology.
                            </p>
                            <p className="mt-3 text-sm text-white/70">
                                Thank you for taking the time to help us improve.
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <LecturerAssessmentForm
                            programmes={programmes}
                            lecturers={lecturers}
                            courses={courses}
                            onSubmissionSuccess={handleSubmissionSuccess}
                        />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <div className="bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black min-h-screen text-[#2C1810] dark:text-[#FFFFFF] [.high-contrast_&]:text-white">
            <Header />
            <Navbar 
                isAuthenticated={isAuthenticated}
                onAdminClick={() => setIsLoginModalOpen(true)}
                onLogout={handleLogout}
                onNavigateToTab={setActiveTab}
                theme={theme}
                onToggleTheme={handleToggleTheme}
            />
            
            {renderAppContent()}

            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
                error={loginError}
            />
        </div>
    );
};

export default App;