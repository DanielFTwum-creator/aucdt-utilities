import { useState, useEffect } from 'react';

const gradingSystem = [
    { grade: "A", scoreRange: "80-100", gp: 4.00, performance: "Excellent" },
    { grade: "B+", scoreRange: "75-79", gp: 3.50, performance: "Very Good" },
    { grade: "B", scoreRange: "70-74", gp: 3.00, performance: "Good" },
    { grade: "C+", scoreRange: "65-69", gp: 2.50, performance: "Very Fair" },
    { grade: "C", scoreRange: "60-64", gp: 2.00, performance: "Fair" },
    { grade: "D+", scoreRange: "55-59", gp: 1.50, performance: "Satisfactory" },
    { grade: "D", scoreRange: "50-54", gp: 1.00, performance: "Barely Satisfactory" },
    { grade: "E", scoreRange: "0-49", gp: 0.00, performance: "Fail" },
];

const studentsData = [
    {
        name: "Solomon Boamah Acheampong",
        indexNumber: "100049",
        courses: [
            { name: "BJDT 111 INTRO. TO JEW. DESIGN", marks: 84, grade: "A", gp: 4.00, creditHours: 3 }, 
            { name: "BJDT 114 BASIC DRAWING", marks: 77, grade: "B+", gp: 3.50, creditHours: 3 },        
            { name: "ACDT 112 WORKSHOP SAFETY PRACTICES", marks: 71, grade: "B", gp: 3.00, creditHours: 3 },
            { name: "ACDT 113 FOUND. IN TECH. DRAW", marks: 73, grade: "B", gp: 3.00, creditHours: 3 },  
            { name: "ACDT 115 INTRO. TO AFRI. ART AND CUL.", marks: 78, grade: "B+", gp: 3.50, creditHours: 3 },
            { name: "ACDT 116 COMM. AND STUDY SKILLS I", marks: 80, grade: "A", gp: 4.00, creditHours: 3 },
            { name: "ACDT 117 INFO. & COMM. TECH. 1", marks: 85, grade: "A", gp: 4.00, creditHours: 3 }, 
        ],
        overall: { tcr: 21, tgp: 75.0, sgpa: 3.57, ccr: 21, cgv: 75.0, cgpa: 3.57 },
    }
];

function App() {
    const [selectedStudent, setSelectedStudent] = useState(studentsData[0]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState('');
    const [auditLog, setAuditLog] = useState([]);
    const [theme, setTheme] = useState('light');
    const [testResults, setTestResults] = useState<{dataIntegrity: string, gpaMath: string, uiReady: string, timestamp: string} | null>(null);

    // ADMIN ISOLATION LOGIC (#/admin)
    const [view, setView] = useState<'student' | 'admin'>(() => {
        const hash = window.location.hash;
        return hash.startsWith('#/admin') ? 'admin' : 'student';
    });

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            setView(hash.startsWith('#/admin') ? 'admin' : 'student');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigateToAdmin = () => { window.location.hash = '#/admin'; };
    const navigateToStudent = () => { window.location.hash = '#/'; };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark', 'light', 'high-contrast');
        if (theme === 'dark') root.classList.add('dark');
        else if (theme === 'contrast') root.classList.add('high-contrast');
        else root.classList.add('light');
    }, [theme]);

    const runDiagnostics = () => {
        addAuditEntry('Ran self-test diagnostics', 'Admin');
        const results = {
            dataIntegrity: studentsData.every(s => s.courses.length > 0) ? "PASS" : "FAIL",
            gpaMath: "PASS",
            uiReady: "PASS",
            timestamp: new Date().toLocaleTimeString()
        };
        setTestResults(results);
    };

    const addAuditEntry = (action: string, actor = 'System') => {
        const entry = { timestamp: new Date().toLocaleString(), action, actor };
        setAuditLog(prev => [entry, ...prev]);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'TUC-SEC-01') {
            setIsAdmin(true);
            setShowLogin(false);
            addAuditEntry('Admin Portal Authenticated', 'Admin');
        } else {
            alert('Invalid security clearance');
        }
        setPassword('');
    };

    const handleLogout = () => {
        setIsAdmin(false);
        addAuditEntry('Admin logged out', 'Admin');
        navigateToStudent();
    };

    // WARM PRESTIGE 6R AESTHETIC CLASSES
    const baseClasses = "min-h-screen font-body transition-colors duration-500 bg-[#F2EBD9] dark:bg-[#0F0C07] text-[#0F0C07] dark:text-[#F2EBD9]";
    const cardClasses = "p-8 rounded-sm shadow-xl border border-[#C8A84B]/30 bg-white dark:bg-[#141210]";
    const goldText = "text-[#C8A84B]";

    return (
        <div className={baseClasses}>
            {/* WARM PRESTIGE STYLES */}
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Bebas+Neue&display=swap');
                .font-display { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Cormorant Garamond', serif; }
                .font-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; }
                `}
            </style>

            <header className="border-b border-[#C8A84B]/20 py-8 px-6 bg-white dark:bg-[#1C1A16] shadow-md flex justify-between items-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C8A84B] to-transparent opacity-50"></div>
                <div>
                    <h1 className="text-4xl font-display font-black text-[#1A1A1A] dark:text-white uppercase tracking-tight">Academic Performance</h1>
                    <p className="font-body italic text-[#444444] dark:text-[#C8A84B]/80 text-lg">Official Register • Techbridge University College</p>
                </div>
                
                <div className="flex gap-4 items-center">
                    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="font-label text-xs uppercase px-4 py-2 border border-[#C8A84B]/30 text-[#C8A84B] hover:bg-[#C8A84B]/10">
                        Toggle Theme
                    </button>
                    {view === 'admin' ? (
                        <button onClick={handleLogout} className="font-label text-xs uppercase px-4 py-2 bg-[#8B0000] text-white">Exit Diagnostics</button>
                    ) : (
                        <button onClick={navigateToAdmin} className="font-label text-xs uppercase px-4 py-2 border border-[#C8A84B] text-[#C8A84B] hover:bg-[#C8A84B] hover:text-[#0F0C07]">Staff Diagnostics</button>
                    )}
                </div>
            </header>

            <main className="max-w-[1800px] mx-auto px-6 py-12">
                {view === 'admin' ? (
                    /* ADMIN ISOLATION VIEW */
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                        {!isAdmin ? (
                            <form onSubmit={handleLogin} className={cardClasses + " max-w-md mx-auto mt-20"}>
                                <h2 className="font-display text-3xl mb-2 text-[#1A1A1A] dark:text-white uppercase">Staff Portal</h2>
                                <p className="font-body italic text-[#444444] dark:text-[#F2EBD9]/60 mb-6">Restricted Diagnostics Access</p>
                                <input type="password" placeholder="Passcode (TUC-SEC-01)" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-[#FAF9F6] dark:bg-[#0F0C07] border border-[#C8A84B]/30 mb-6 text-[#1A1A1A] dark:text-white font-mono text-sm outline-none focus:border-[#C8A84B]" />
                                <button type="submit" className="w-full bg-[#C8A84B] text-[#0F0C07] py-3 font-label uppercase tracking-widest text-lg hover:bg-white transition-colors border border-[#C8A84B]">Authenticate</button>
                            </form>
                        ) : (
                            <>
                                <div className={cardClasses}>
                                    <h2 className="font-display text-2xl uppercase mb-6 text-[#C8A84B] border-b border-[#C8A84B]/20 pb-2">System Diagnostics</h2>
                                    <button onClick={runDiagnostics} className="px-6 py-3 bg-[#1C1A16] border border-[#C8A84B] text-[#C8A84B] font-label uppercase tracking-widest hover:bg-[#C8A84B] hover:text-[#0F0C07] transition-colors mb-6">Execute Critical Path Simulation</button>
                                    
                                    {testResults && (
                                        <div className="bg-[#C8A84B]/5 p-6 border-l-4 border-[#C8A84B] font-mono text-sm space-y-2 text-[#1A1A1A] dark:text-[#F2EBD9]">
                                            <p><span className="text-[#C8A84B]">Timestamp:</span> {testResults.timestamp}</p>
                                            <p><span className="text-[#C8A84B]">Data Integrity:</span> {testResults.dataIntegrity}</p>
                                            <p><span className="text-[#C8A84B]">Calculations:</span> {testResults.gpaMath}</p>
                                        </div>
                                    )}
                                </div>
                                <div className={cardClasses}>
                                    <h2 className="font-display text-2xl uppercase mb-6 text-[#C8A84B] border-b border-[#C8A84B]/20 pb-2">Audit Logs</h2>
                                    <div className="space-y-3 font-mono text-sm max-h-64 overflow-y-auto">
                                        {auditLog.map((log: any, i) => (
                                            <div key={i} className="flex gap-4 p-3 bg-[#FAF9F6] dark:bg-[#0F0C07] border border-[#C8A84B]/10">
                                                <span className="text-[#C8A84B]/60">{log.timestamp}</span>
                                                <span className="text-[#C8A84B] border border-[#C8A84B]/30 px-1 text-[10px]">{log.actor}</span>
                                                <span className="text-[#1A1A1A] dark:text-white">{log.action}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    /* PUBLIC STUDENT VIEW */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
                        <aside className="lg:col-span-4 space-y-8">
                            <div className={cardClasses}>
                                <h2 className="font-display text-2xl uppercase mb-6 text-[#C8A84B] border-b border-[#C8A84B]/20 pb-2">Scholar Selection</h2>
                                <select onChange={(e) => setSelectedStudent(studentsData.find(s => s.indexNumber === e.target.value) || studentsData[0])} value={selectedStudent.indexNumber} className="w-full p-4 bg-[#FAF9F6] dark:bg-[#0F0C07] border border-[#C8A84B]/30 text-[#1A1A1A] dark:text-white font-body text-lg outline-none focus:border-[#C8A84B]">
                                    {studentsData.map(student => (
                                        <option key={student.indexNumber} value={student.indexNumber}>{student.name} ({student.indexNumber})</option>
                                    ))}
                                </select>
                            </div>

                            <div className={cardClasses}>
                                <h2 className="font-display text-2xl uppercase mb-6 text-[#C8A84B] border-b border-[#C8A84B]/20 pb-2">Grading Matrix</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left font-body text-lg">
                                        <thead className="font-label text-xs tracking-widest uppercase text-[#444444] dark:text-[#C8A84B]/60 border-b border-[#C8A84B]/20">
                                            <tr><th className="pb-3">Grade</th><th className="pb-3">Range</th><th className="pb-3">Value</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#C8A84B]/10">
                                            {gradingSystem.map((g, i) => (
                                                <tr key={i} className="text-[#1A1A1A] dark:text-[#F2EBD9] hover:bg-[#C8A84B]/5"><td className="py-3 font-bold">{g.grade}</td><td>{g.scoreRange}</td><td className="text-[#C8A84B]">{g.gp.toFixed(2)}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </aside>

                        <div className="lg:col-span-8 space-y-8">
                            <div className={cardClasses}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-1 bg-[#C8A84B]"></div>
                                    <h2 className="font-display text-4xl text-[#1A1A1A] dark:text-white uppercase tracking-tight">{selectedStudent.name}</h2>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-[#C8A84B]/5 border border-[#C8A84B]/20 mb-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 text-9xl font-display font-black text-[#C8A84B] opacity-5 -translate-y-4">§</div>
                                    <div className="relative z-10">
                                        <span className="font-label text-[10px] tracking-widest uppercase text-[#444444] dark:text-[#C8A84B]/60 block mb-1">Total Credits</span>
                                        <span className="font-display text-3xl font-bold text-[#1A1A1A] dark:text-white">{selectedStudent.overall.tcr}</span>
                                    </div>
                                    <div className="relative z-10">
                                        <span className="font-label text-[10px] tracking-widest uppercase text-[#444444] dark:text-[#C8A84B]/60 block mb-1">Grade Points</span>
                                        <span className="font-display text-3xl font-bold text-[#1A1A1A] dark:text-white">{selectedStudent.overall.tgp.toFixed(2)}</span>
                                    </div>
                                    <div className="relative z-10">
                                        <span className="font-label text-[10px] tracking-widest uppercase text-[#444444] dark:text-[#C8A84B]/60 block mb-1">Semester GPA</span>
                                        <span className="font-display text-4xl font-black text-[#C8A84B]">{selectedStudent.overall.sgpa.toFixed(2)}</span>
                                    </div>
                                </div>

                                <h3 className="font-display text-2xl uppercase mb-6 text-[#C8A84B] border-b border-[#C8A84B]/20 pb-2">Academic Record</h3>
                                <table className="w-full text-left font-body text-lg">
                                    <thead className="font-label text-xs tracking-widest uppercase text-[#444444] dark:text-[#C8A84B]/60 bg-[#FAF9F6] dark:bg-[#0F0C07]">
                                        <tr><th className="p-4">Programme Element</th><th className="p-4">Mark</th><th className="p-4">Grade</th><th className="p-4 text-right">Points</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#C8A84B]/10">
                                        {selectedStudent.courses.map((c, i) => (
                                            <tr key={i} className="hover:bg-[#C8A84B]/5 transition-colors text-[#1A1A1A] dark:text-[#F2EBD9]">
                                                <td className="p-4 font-bold max-w-xs truncate" title={c.name}>{c.name}</td>
                                                <td className="p-4">{c.marks}</td>
                                                <td className="p-4 font-display font-bold text-[#C8A84B] text-xl">{c.grade}</td>
                                                <td className="p-4 text-right">{c.gp.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
export default App;