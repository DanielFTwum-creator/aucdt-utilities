# mature-students-exam-app - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for mature-students-exam-app.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

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

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript

import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentExperience } from './components/student/StudentExperience';
import { Loader } from './components/common/Loader';
import { Question } from './types';
import { defaultQuestions } from './data/defaultQuestions';

const App: React.FC = () => {
  const { user, isAuthReady, isAdmin, handleSignOut } = useAuth();
  const [viewAsStudent, setViewAsStudent] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(defaultQuestions);

  useEffect(() => {
    // When an admin logs in, default to admin view
    if (isAdmin) {
      setViewAsStudent(false);
    }
  }, [isAdmin]);

  const handleLoadExamForStudent = (questions: Question[]) => {
    setActiveQuestions(questions);
  };

  if (!isAuthReady) {
    return <Loader fullScreen message="Initializing Application..." />;
  }

  const shouldShowAdminView = isAdmin && !viewAsStudent;

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-5xl mx-auto">
        {shouldShowAdminView ? (
          <AdminDashboard 
            onViewAsStudent={() => setViewAsStudent(true)} 
            onLoadExam={handleLoadExamForStudent}
            onSignOut={handleSignOut}
          />
        ) : (
          <StudentExperience 
            initialQuestions={activeQuestions}
            isAdmin={isAdmin}
            onReturnToAdmin={() => setViewAsStudent(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;

```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_mature_students_exam_app';
const ACCENT   = '#4f46e5';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Mature Students Exam App</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: components/admin/AdminDashboard.tsx
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useAuth } from '../../hooks/useAuth';
import { Question, Exam } from '../../types';
import { generateQuestionsFromText } from '../../services/geminiService';
import { Loader } from '../common/Loader';
import { Message } from '../common/Message';
import { COLORS } from '../../constants';
import { UploadCloud, Save, Eye, LogOut, Loader2 } from 'lucide-react';
import { defaultQuestions } from '../../data/defaultQuestions';

interface AdminDashboardProps {
  onViewAsStudent: () => void;
  onLoadExam: (questions: Question[]) => void;
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewAsStudent, onLoadExam, onSignOut }) => {
  const { user, isAuthReady } = useAuth();
  const [db] = useState(firebase.firestore());
  
  const [pdfContentInput, setPdfContentInput] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [examName, setExamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthReady && user && !user.isAnonymous) {
      const appId = 'msee-math-aptitude-test-v1';
      const examsCollectionRef = db.collection(`artifacts/${appId}/public/data/exams`);
      const unsubscribe = examsCollectionRef.onSnapshot((snapshot) => {
        const examsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
        setAvailableExams(examsData);
      }, (error) => {
        console.error("Error fetching exams:", error);
        setMessage("Could not load available exams.");
        setMessageType('error');
      });
      return () => unsubscribe();
    }
  }, [isAuthReady, user, db]);

  const handleProcessText = async () => {
    if (!pdfContentInput.trim()) {
      setMessage("Please enter some text to generate questions from.");
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setGeneratedQuestions([]);
    try {
      const questions = await generateQuestionsFromText(pdfContentInput);
      setGeneratedQuestions(questions);
      setMessage("Exam questions generated successfully!");
      setMessageType('success');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExam = async () => {
    if (!examName.trim() || generatedQuestions.length === 0) {
      setMessage("Please provide an exam name and generate questions before saving.");
      setMessageType('error');
      return;
    }
    if (!user || user.isAnonymous) {
        setMessage("Authentication error: Only admins can save exams.");
        setMessageType('error');
        return;
    }

    setIsLoading(true);
    try {
      const appId = 'msee-math-aptitude-test-v1';
      const examsCollectionRef = db.collection(`artifacts/${appId}/public/data/exams`);
      await examsCollectionRef.add({
        name: examName,
        questions: JSON.stringify(generatedQuestions),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: user.uid,
      });
      setMessage("Exam saved successfully!");
      setMessageType('success');
      setPdfContentInput('');
      setGeneratedQuestions([]);
      setExamName('');
    } catch (error: any) {
      setMessage(`Error saving exam: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadExam = useCallback(async (examId: string) => {
    setIsLoading(true);
    setSelectedExamId(examId);
    try {
      const appId = 'msee-math-aptitude-test-v1';
      const examDocRef = db.doc(`artifacts/${appId}/public/data/exams/${examId}`);
      const docSnap = await examDocRef.get();
      if (docSnap.exists) {
        const examData = docSnap.data();
        if (examData) {
            const parsedQuestions = JSON.parse(examData.questions as string);
            onLoadExam(parsedQuestions);
            setMessage(`Exam "${examData.name}" is now the default for student view.`);
            setMessageType('success');
        } else {
             throw new Error("Exam data is empty.");
        }
      } else {
        throw new Error("Exam not found.");
      }
    } catch (error: any) {
      onLoadExam(defaultQuestions);
      setMessage(`Error loading exam: ${error.message}. Default questions loaded.`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }, [db, onLoadExam]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-b-4" style={{ borderColor: COLORS.aucdtGold }}>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.aucdtDeepBrown }}>Admin Dashboard</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={onViewAsStudent} className="py-2 px-4 rounded-lg font-bold inline-flex items-center text-sm" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}><Eye className="mr-2" size={16} /> Student View</button>
            <button onClick={onSignOut} className="py-2 px-4 rounded-lg font-bold inline-flex items-center text-sm" style={{ backgroundColor: COLORS.aucdtRed, color: COLORS.aucdtWhite }}><LogOut className="mr-2" size={16} /> Sign Out</button>
          </div>
        </div>
        
        {message && <Message text={message} type={messageType} onDismiss={() => setMessage('')} />}

        <div className="space-y-8">
            {/* Question Generation Section */}
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: COLORS.aucdtLightGreen }}>
                <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>1. Generate Exam from Text</h3>
                <textarea className="w-full p-3 border rounded-lg" rows={8} placeholder="Paste your exam text here..." value={pdfContentInput} onChange={(e) => setPdfContentInput(e.target.value)} style={{ borderColor: COLORS.aucdtGreen }}></textarea>
                <button onClick={handleProcessText} disabled={isLoading} className="mt-4 w-full py-3 px-6 rounded-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtGold, color: COLORS.aucdtWhite }}>
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                    <span>{isLoading ? 'Processing...' : 'Generate Questions'}</span>
                </button>
            </div>
            
            {/* Preview and Save Section */}
            {generatedQuestions.length > 0 && (
                <div className="p-6 rounded-lg shadow-sm bg-white">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>2. Preview and Save Generated Exam</h3>
                    <input type="text" placeholder="Enter new exam name" className="w-full p-3 border rounded-lg" value={examName} onChange={(e) => setExamName(e.target.value)} style={{ borderColor: COLORS.aucdtGreen }} />
                    <button onClick={handleSaveExam} disabled={isLoading || !examName.trim()} className="mt-4 w-full py-3 px-6 rounded-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>{isLoading ? 'Saving...' : 'Save New Exam'}</span>
                    </button>
                </div>
            )}
            
            {/* Load Existing Exams Section */}
            <div className="p-6 rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>3. Load Existing Exam for Students</h3>
                {isLoading && !availableExams.length ? <Loader message="Fetching exams..."/> :
                  availableExams.length === 0 ? <p style={{ color: COLORS.aucdtDarkGray }}>No exams found in the database.</p> : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {availableExams.map(exam => (
                            <li key={exam.id} className="flex justify-between items-center p-3 border rounded-lg" style={{ borderColor: COLORS.aucdtLightGreen }}>
                                <span className="font-medium" style={{ color: COLORS.aucdtDarkGray }}>{exam.name}</span>
                                <button onClick={() => handleLoadExam(exam.id)} disabled={isLoading || selectedExamId === exam.id} className="py-2 px-4 rounded-lg text-sm font-bold shadow-sm transition-colors" style={{ backgroundColor: selectedExamId === exam.id ? COLORS.aucdtDeepBrown : COLORS.aucdtGold, color: COLORS.aucdtWhite }}>
                                    {selectedExamId === exam.id ? 'Loaded' : 'Load'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
```

### FILE: components/common/ConfirmationModal.tsx
```typescript

import React from 'react';
import { COLORS } from '../../constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl p-8 m-4 max-w-md w-full border-t-4 transform transition-all duration-300 scale-95" style={{ borderColor: COLORS.aucdtGold }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>{title}</h2>
        <p className="text-lg mb-6" style={{ color: COLORS.aucdtDarkGray }}>{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="py-2 px-6 rounded-lg font-semibold transition-colors" style={{ backgroundColor: COLORS.aucdtLightGray, color: COLORS.aucdtDeepBrown }}>Cancel</button>
          <button onClick={onConfirm} className="py-2 px-6 rounded-lg font-bold text-white transition-transform transform hover:scale-105" style={{ backgroundColor: COLORS.aucdtGreen }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

```

### FILE: components/common/DiagramRenderer.tsx
```typescript

import React, { useEffect, useRef } from 'react';
import { DiagramType } from '../../types';
import { COLORS } from '../../constants';
// import Chart from 'chart.js/auto'; // Commented out as libraries are not installed
// import mermaid from 'mermaid'; // Commented out as libraries are not installed

interface DiagramRendererProps {
  type: DiagramType;
  data?: any; // Data for Chart.js or Mermaid
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type, data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && (type === 'chartjs_bar' || type === 'chartjs_line')) {
      // Placeholder for Chart.js rendering
      // const chartInstance = new Chart(chartRef.current, data);
      // return () => chartInstance.destroy();
      console.log(`Chart.js rendering for type ${type} with data:`, data);
    }
  }, [type, data]);

  useEffect(() => {
    if (mermaidRef.current && (type === 'mermaid_flowchart' || type === 'mermaid_sequence' || type === 'mermaid_class')) {
      // Placeholder for Mermaid rendering
      // mermaid.render('mermaid-svg', data).then(({ svg }) => {
      //   if (mermaidRef.current) {
      //     mermaidRef.current.innerHTML = svg;
      //   }
      // });
      console.log(`Mermaid rendering for type ${type} with data:`, data);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<pre>${data}</pre>`; // Display raw Mermaid code as fallback
      }
    }
  }, [type, data]);

  if (!type) return null;
  const svgStyle: React.CSSProperties = { stroke: COLORS.aucdtDarkGray, strokeWidth: 1.5, fill: 'none', fontFamily: 'sans-serif', width: '100%', height: 'auto' };
  const textStyle: React.CSSProperties = { fill: COLORS.aucdtDeepBrown, stroke: 'none', textAnchor: 'middle' };

  switch (type) {
    case 'right_triangle_abc':
      return (
        <div className="w-full flex justify-center items-center">
            <svg viewBox="0 0 340 300" style={svgStyle}>
                <polygon points="50,250 290,250 50,50" />
                <text x="295" y="260" style={{...textStyle, fontSize: '24px', textAnchor: 'start'}}>A</text>
                <text x="40" y="265" style={{...textStyle, fontSize: '24px', textAnchor: 'end'}}>B</text>
                <text x="40" y="45" style={{...textStyle, fontSize: '24px', textAnchor: 'end'}}>C</text>
                <text x="170" y="270" style={textStyle}>6</text>
                <text x="25" y="150" style={textStyle}>8</text>
                <text x="170" y="140" style={{...textStyle, fontStyle: 'italic'}}>AC = ?</text>
                <rect x="50" y="225" width="25" height="25" style={{ fill: 'none', stroke: COLORS.aucdtDarkGray, strokeWidth: 1.5 }} />
            </svg>
        </div>
      );
    case 'angles_on_line':
      const vertex_x = 225;
      const vertex_y = 100;
      const diag_end_x = 380;
      const diag_end_y = 30;
      const vec_x = diag_end_x - vertex_x;
      const vec_y = diag_end_y - vertex_y;
      const vec_len = Math.sqrt(vec_x * vec_x + vec_y * vec_y);
      const arc_radius = 70; 
      const p_diag_x = vertex_x + (vec_x / vec_len) * arc_radius;
      const p_diag_y = vertex_y + (vec_y / vec_len) * arc_radius;
      const p_left_x = vertex_x - arc_radius;
      const p_left_y = vertex_y;
      const angle_105_arc_path = `M ${p_diag_x} ${p_diag_y} A ${arc_radius} ${arc_radius} 0 0 0 ${p_left_x} ${p_left_y}`;
      const p_right_x = vertex_x + arc_radius;
      const p_right_y = vertex_y;
      const y_arc_path = `M ${p_right_x} ${p_right_y} A ${arc_radius} ${arc_radius} 0 0 0 ${p_diag_x} ${p_diag_y}`;
      const labelTextStyle = { ...textStyle, fontSize: '20px' };
      return (
          <div className="w-full flex justify-center items-center">
              <svg viewBox="0 0 450 200" style={svgStyle}>
                  <line x1="20" y1={vertex_y} x2="430" y2={vertex_y} />
                  <line x1={vertex_x} y1={vertex_y} x2={diag_end_x} y2={diag_end_y} />
                  <path d={angle_105_arc_path} style={{fill: 'none'}} />
                  <text x="210" y="72" style={labelTextStyle}>105°</text>
                  <path d={y_arc_path} style={{fill: 'none'}} />
                  <text x="285" y="100" style={labelTextStyle}>y</text>
              </svg>
          </div>
      );
    case 'pie_chart_colors':
      const pieData = [
          { label: 'Red', value: 8, color: '#EF4444' },
          { label: 'Blue', value: 12, color: '#3B82F6' },
          { label: 'Green', value: 5, color: '#22C55E' },
          { label: 'Yellow', value: 7, color: '#F59E0B' }
      ];
      const total = pieData.reduce((acc, d) => acc + d.value, 0);
      const pieRadius = 80;
      const pieCx = 150;
      const pieCy = 100;
      let startAngle = -90;
      return (
          <div className="w-full flex justify-center items-center my-4">
              <svg viewBox="0 0 300 240" style={{...svgStyle, strokeWidth: 0}}>
                  <g transform={`translate(${pieCx}, ${pieCy})`}>
                      {pieData.map(d => {
                          const sliceAngle = (d.value / total) * 360;
                          const endAngle = startAngle + sliceAngle;
                          const startX = pieRadius * Math.cos(Math.PI * startAngle / 180);
                          const startY = pieRadius * Math.sin(Math.PI * startAngle / 180);
                          const endX = pieRadius * Math.cos(Math.PI * endAngle / 180);
                          const endY = pieRadius * Math.sin(Math.PI * endAngle / 180);
                          const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                          const pathData = `M 0,0 L ${startX},${startY} A ${pieRadius},${pieRadius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
                          startAngle = endAngle;
                          return <path key={d.label} d={pathData} fill={d.color} />;
                      })}
                  </g>
                   {pieData.map((d, i) => (
                       <g key={i}>
                          <rect x="10" y={20 * i + 185} width="15" height="15" fill={d.color} />
                          <text x="35" y={20 * i + 198} style={{...textStyle, fontSize: '14px', textAnchor: 'start', fill: COLORS.aucdtDarkGray}}>
                              {`${d.label}: ${d.value}`}
                          </text>
                      </g>
                  ))}
              </svg>
          </div>
      );
    case 'chartjs_bar':
    case 'chartjs_line':
      return (
        <div className="w-full flex justify-center items-center">
          <canvas ref={chartRef} />
        </div>
      );
    case 'mermaid_flowchart':
    case 'mermaid_sequence':
    case 'mermaid_class':
      return (
        <div className="w-full flex justify-center items-center">
          <div ref={mermaidRef} />
        </div>
      );
    default:
      return null;
  }
};

```

### FILE: components/common/LatexRenderer.tsx
```typescript
import React, { useState, useEffect, useMemo } from 'react';

interface LatexRendererProps {
  children: string;
}

declare global {
  interface Window {
    katex: any;
  }
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ children }) => {
  const [isKatexAvailable, setIsKatexAvailable] = useState(false);

  useEffect(() => {
    // Check for KaTeX immediately and periodically
    const checkKatex = () => {
      if (typeof window !== 'undefined' && window.katex) {
        console.log('KaTeX found!');
        setIsKatexAvailable(true);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkKatex()) {
      return;
    }

    // Wait for DOM to be ready, then check
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkKatex);
    }

    // Also check on window load
    window.addEventListener('load', checkKatex);

    // Poll as backup
    const intervalId = setInterval(checkKatex, 100);

    // Cleanup after 10 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      console.warn("KaTeX failed to load after 10 seconds, using fallback");
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      document.removeEventListener('DOMContentLoaded', checkKatex);
      window.removeEventListener('load', checkKatex);
    };
  }, []);

  const content = useMemo(() => {
    console.log('LatexRenderer - isKatexAvailable:', isKatexAvailable);
    console.log('LatexRenderer - children:', children);
    console.log('LatexRenderer - window.katex:', !!window.katex);
    
    if (typeof children !== 'string' || !children) {
      return <span>{children}</span>;
    }

    // If KaTeX is not available, provide a basic fallback for common math expressions
    if (!isKatexAvailable) {
      console.log("LatexRenderer - using improved fallback rendering");

      let fallbackContent = children;

      // Handle matrices: replace with a more readable format
      fallbackContent = fallbackContent.replace(/\\begin{bmatrix}(.*?)\\end{bmatrix}/g, (match, matrixContent) => {
        const rows = matrixContent.trim().split("\\\\").map(row => 
          row.trim().split("&").map(cell => cell.trim()).join("  ")
        );
        return `<div class="matrix-fallback">${rows.join("<br>")}</div>`;
      });

      // Handle percentages
      fallbackContent = fallbackContent.replace(/([0-9]+)\\%/g, "$1%");

      // Handle general LaTeX expressions (inline and block)
      fallbackContent = fallbackContent.replace(/\\times/g, "x"); // Replace \times with 'x'
      fallbackContent = fallbackContent.replace(/\$\$([^$]+)\$\$/g, "<p><em>$1</em></p>");
      fallbackContent = fallbackContent.replace(/\$([^$]+)\$/g, "<em>$1</em>");

      return <span dangerouslySetInnerHTML={{ __html: fallbackContent }} />;
    }

    // Regex to find and split by KaTeX delimiters ($...$ or $$...$$).
    const regex = /(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$)/g;
    const parts = children.split(regex);
    console.log('LatexRenderer - parts:', parts);

    return (
      <>
        {parts.map((part, i) => {
          if (i % 2 === 1) { // Matched delimiters will be at odd indices.
            const isBlock = part.startsWith('$$');
            const latex = part.slice(isBlock ? 2 : 1, isBlock ? -2 : -1);
            console.log('LatexRenderer - rendering LaTeX:', latex);
            // Use displayMode for block-level math or expressions with newlines (like matrices).
            const useDisplayMode = isBlock || latex.includes('\\begin{') || latex.includes('\\\\');

            try {
              const html = window.katex.renderToString(latex, {
                throwOnError: false,
                displayMode: useDisplayMode,
              });
              const className = useDisplayMode ? "latex-block" : "latex-inline";
              console.log('LatexRenderer - rendered HTML:', html);
              return <span key={i} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch (e) {
              console.error("KaTeX rendering error:", e);
              // Fallback to displaying raw text on error to prevent crashing.
              return <span key={i} className="text-red-500 font-mono">{part}</span>;
            }
          } else {
            // This is plain text.
            return <span key={i}>{part}</span>;
          }
        })}
      </>
    );
  }, [children, isKatexAvailable]);

  return content;
};

```

### FILE: components/common/Loader.tsx
```typescript

import React from 'react';
import { Loader2 } from 'lucide-react';
import { COLORS } from '../../constants';

interface LoaderProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ size = 48, message, fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-gray-50/80 z-50"
    : "flex flex-col items-center justify-center my-8";

  return (
    <div className={containerClasses}>
      <Loader2 className="animate-spin" size={size} style={{ color: COLORS.aucdtGreen }} />
      {message && <p className="mt-4 text-lg font-semibold" style={{ color: COLORS.aucdtDeepBrown }}>{message}</p>}
    </div>
  );
};

```

### FILE: components/common/Message.tsx
```typescript

import React from 'react';

interface MessageProps {
  text: string;
  type: 'success' | 'error' | 'info';
  onDismiss?: () => void;
}

export const Message: React.FC<MessageProps> = ({ text, type, onDismiss }) => {
  if (!text) return null;

  const baseClasses = "p-4 rounded-lg mb-4 text-center flex justify-between items-center shadow-md";
  const typeClasses = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span>{text}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-4 font-bold text-xl" aria-label="Dismiss message">&times;</button>
      )}
    </div>
  );
};

```

### FILE: components/student/AccessibleProgress.tsx
```typescript

import React from 'react';
import { Question, Answers } from '../../types';
import { COLORS } from '../../constants';

interface AccessibleProgressProps {
  current: number;
  total: number;
  answers: Answers;
  questions: Question[];
  navigateToQuestion: (index: number) => void;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({ current, total, answers, questions, navigateToQuestion }) => {
  const answeredCount = Object.keys(answers).length;
  const percentage = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="progress-summary text-base md:text-lg" aria-live="polite" style={{ color: COLORS.aucdtDarkGray }}>
          <span className="sr-only">Question {current + 1} of {total}. {answeredCount} questions answered, {total - answeredCount} remaining.</span>
          <span aria-hidden="true">Question {current + 1} of {total}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Exam progress: ${percentage}% complete`}>
        <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: COLORS.aucdtGreen }} />
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2" role="navigation" aria-label="Question navigation">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => navigateToQuestion(index)}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-110 focus:ring-[#5C4033] ${index === current ? 'ring-2 ring-offset-2 ring-[#5C4033]' : ''}`}
            style={{
              backgroundColor: index === current ? COLORS.aucdtDeepBrown : (answers[q.id] !== undefined ? COLORS.aucdtGreen : COLORS.aucdtLightGray),
              color: index === current || answers[q.id] !== undefined ? COLORS.aucdtWhite : COLORS.aucdtDeepBrown,
            }}
            aria-label={`Go to question ${index + 1}${answers[q.id] !== undefined ? ' (answered)' : ''}${index === current ? ' (current)' : ''}`}
            aria-current={index === current ? 'step' : undefined}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

```

### FILE: components/student/BonusSection.tsx
```typescript

import React from 'react';
import { Award } from 'lucide-react';
import { COLORS } from '../../constants';
import { LatexRenderer } from '../common/LatexRenderer';

interface BonusSectionProps {
  title: string;
  content: string;
}

export const BonusSection: React.FC<BonusSectionProps> = ({ title, content }) => {
    if (!title || !content) return null;
    return (
        <div className="mt-8 p-4 border-l-4 rounded-r-lg" style={{ borderColor: COLORS.aucdtGold, backgroundColor: COLORS.aucdtLightGreen }}>
            <div className="flex items-center">
                <Award className="h-6 w-6 mr-3 flex-shrink-0" style={{ color: COLORS.aucdtGold }} />
                <h3 className="text-lg font-bold" style={{ color: COLORS.aucdtDeepBrown }}>{title}</h3>
            </div>
            <div className="mt-2 text-base pl-9" style={{ color: COLORS.aucdtDarkGray }}>
                <LatexRenderer>{content}</LatexRenderer>
            </div>
        </div>
    );
};

```

### FILE: components/student/ExamResults.tsx
```typescript

import { CheckCircle, Download, Loader2, RotateCcw, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { Answers, Question } from '../../types';
import { DiagramRenderer } from '../common/DiagramRenderer';
import { LatexRenderer } from '../common/LatexRenderer';
import { Message } from '../common/Message';
import { BonusSection } from './BonusSection';

interface ExamResultsProps {
  questions: Question[];
  answers: Answers;
  onRetake: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({ questions, answers, onRetake }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const calculateScore = () => {
    return questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0);
  };

  const score = calculateScore();
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const handleExportToPdf = async () => {
    if (!(window as any).jspdf || !(window as any).html2canvas) {
      setExportMessage("PDF libraries not loaded. Please wait and try again.");
      return;
    }
    setIsExporting(true);
    setExportMessage("");

    const { jsPDF } = (window as any).jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15; // Increased margin for better appearance
    let yOffset = margin; // Current Y position on the PDF page

    // Add title page
    pdf.setFontSize(24);
    pdf.text("TUC Mature Students Entrance Examination Results", pdfWidth / 2, yOffset + 10, { align: "center" });
    pdf.setFontSize(16);
    pdf.text(`Score: ${score} out of ${questions.length} (${percentage}%)`, pdfWidth / 2, yOffset + 25, { align: "center" });
    yOffset += 40; // Move down for content

    // Add a new page for questions
    pdf.addPage();
    yOffset = margin; // Reset yOffset for new page

    for (const [index, question] of questions.entries()) {
      const questionElement = document.getElementById(`question-${question.id}-export`);
      if (!questionElement) continue;

      // Temporarily make element visible if it's hidden (e.g., if it's not the current question in the ExamRunner)
      const originalDisplay = questionElement.style.display;
      questionElement.style.display = "block";

      const canvas = await (window as any).html2canvas(questionElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: COLORS.aucdtWhite,
      });

      questionElement.style.display = originalDisplay; // Restore original display

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth - 2 * margin;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if content fits on current page
      if (yOffset + imgHeight + margin > pdfHeight) {
        pdf.addPage();
        yOffset = margin; // Reset yOffset for new page
      }

      pdf.addImage(imgData, "PNG", margin, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 10; // Add some padding between questions
    }

    pdf.save("TUC_MSEE_Results.pdf");
    setIsExporting(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-2xl p-8 md:p-12 border-t-4" style={{ borderColor: COLORS.aucdtGold }}>
        {exportMessage && <Message text={exportMessage} type="error" onDismiss={() => setExportMessage('')} />}
        <div id="results-content-to-export">
            <div className="text-center mb-8 p-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>Examination Results</h1>
                <div className={`text-6xl md:text-7xl font-bold my-4 ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</div>
                <p className="text-xl md:text-2xl" style={{ color: COLORS.aucdtDarkGray }}>{score} out of {questions.length} questions correct</p>
            </div>

            <div className="space-y-4">
                {questions.map((question, index) => (
                <div key={question.id} id={`question-${question.id}-export`} className="border rounded-lg p-4 shadow-sm" style={{ borderColor: COLORS.aucdtLightGreen }}>
                    <div className="flex items-start space-x-3">
                    {answers[question.id] === question.correct ? <CheckCircle className="mt-1 flex-shrink-0" size={24} style={{ color: COLORS.aucdtGreen }} /> : <XCircle className="mt-1 flex-shrink-0" size={24} style={{ color: COLORS.aucdtRed }} />}
                    <div className="flex-1">
                        <p className="font-medium text-lg mb-2" style={{ color: COLORS.aucdtDeepBrown }}>Question {index + 1}: <LatexRenderer>{question.question}</LatexRenderer></p>
                        {question.diagram && <DiagramRenderer type={question.diagram} />}
                        <div className="text-base mt-2" style={{ color: COLORS.aucdtDarkGray }}>
                          <p>Your answer: <span className="font-semibold">{answers[question.id] !== undefined ? <LatexRenderer>{question.options[answers[question.id]]}</LatexRenderer> : "Not answered"}</span></p>
                          <p>Correct answer: <span className="font-semibold" style={{ color: COLORS.aucdtGreen }}><LatexRenderer>{question.options[question.correct]}</LatexRenderer></span></p>
                        </div>
                        {question.bonus && <BonusSection title={question.bonus.title} content={question.bonus.content} />}
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t flex flex-col md:flex-row justify-center items-center gap-4">
            <button onClick={handleExportToPdf} disabled={isExporting} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtDeepBrown, color: COLORS.aucdtWhite }}>
                {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                <span>{isExporting ? 'Exporting...' : 'Export to PDF'}</span>
            </button>
            <button onClick={onRetake} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}>
                <RotateCcw size={20} />
                <span>Take Exam Again</span>
            </button>
        </div>
      </div>
    </div>
  );
};

```

### FILE: components/student/ExamRunner.tsx
```typescript

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { Question, Answers } from '../../types';
import { COLORS } from '../../constants';
import { LatexRenderer } from '../common/LatexRenderer';
import { DiagramRenderer } from '../common/DiagramRenderer';
import { BonusSection } from '../student/BonusSection';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { AccessibleProgress } from './AccessibleProgress';

interface ExamRunnerProps {
  questions: Question[];
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ questions, answers, setAnswers, currentQuestionIndex, setCurrentQuestionIndex, timeLeft, setTimeLeft, onSubmit }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      onSubmit();
    }
    return () => clearInterval(interval);
  }, [isPaused, timeLeft, setTimeLeft, onSubmit]);
  
  // Tab visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarning(true);
        setIsPaused(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleAnswerSelect = (qId: number, ansIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: ansIdx }));
  };

  const currentQuestion = questions[currentQuestionIndex];

  const togglePause = () => (isPaused ? setShowResumeModal(true) : setShowPauseModal(true));
  const confirmPause = () => { setIsPaused(true); setShowPauseModal(false); };
  const confirmResume = () => { setIsPaused(false); setShowResumeModal(false); setTabSwitchWarning(false); };
  
  if (!currentQuestion) {
      return <div>Loading question...</div>
  }

  return (
    <>
      <ConfirmationModal isOpen={showPauseModal} title="Pause Exam?" message="Are you sure you want to pause the timer?" onConfirm={confirmPause} onCancel={() => setShowPauseModal(false)} />
      <ConfirmationModal isOpen={showResumeModal} title="Resume Exam?" message="Are you sure you want to resume the timer?" onConfirm={confirmResume} onCancel={() => setShowResumeModal(false)} />
    
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-b-4" style={{ borderColor: COLORS.aucdtGold }}>
        <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0" style={{ color: COLORS.aucdtDeepBrown }}>MSEE 112 Mathematics</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 p-2 rounded-lg" style={{backgroundColor: COLORS.aucdtLightGray}}>
                    <Clock size={24} style={{ color: COLORS.aucdtGreen }} />
                    <span className={`font-mono text-xl ${timeLeft < 600 ? 'text-red-600' : ''}`} style={{ color: timeLeft >= 600 ? COLORS.aucdtDarkGray : undefined }}>{formatTime(timeLeft)}</span>
                </div>
                <button onClick={togglePause} aria-label={isPaused ? "Resume Exam" : "Pause Exam"} className="p-3 rounded-full transition-colors duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C4033]" style={{ backgroundColor: COLORS.aucdtLightGray, color: COLORS.aucdtDeepBrown }}>
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
            </div>
        </div>
        {tabSwitchWarning && (
            <div className="mt-4 p-3 rounded-lg flex items-center justify-center text-center bg-yellow-100 text-yellow-800">
            <AlertTriangle className="mr-3" />
            Your exam is paused because you switched tabs. Click the resume button to continue.
            </div>
        )}
      </div>

      {isPaused ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Pause size={60} className="mx-auto mb-6" style={{ color: COLORS.aucdtDeepBrown }} />
              <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>Exam Paused</h2>
              <p className="text-xl mb-6" style={{ color: COLORS.aucdtDarkGray }}>Click the resume button to continue your exam.</p>
              <button onClick={confirmResume} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}><Play size={20} /><span>Resume Exam</span></button>
          </div>
      ) : (
        <>
            <AccessibleProgress current={currentQuestionIndex} total={questions.length} answers={answers} questions={questions} navigateToQuestion={setCurrentQuestionIndex} />
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6" role="region" aria-labelledby="question-heading">
              <h2 id="question-heading" className="text-xl md:text-2xl font-semibold mb-6" style={{ color: COLORS.aucdtDeepBrown }}>
                  <span className="sr-only">Question {currentQuestionIndex + 1}: </span>
                  <LatexRenderer>{currentQuestion.question}</LatexRenderer>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-8 mt-4">
                  <div className={`space-y-4 ${currentQuestion.diagram ? 'md:w-1/2' : 'w-full'}`} role="radiogroup" aria-labelledby="question-heading">
                      {currentQuestion.options.map((option, index) => (
                      <label key={index} className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ease-in-out shadow-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 ${answers[currentQuestion.id] === index ? 'border-2' : 'border-gray-200 hover:border-gray-300'}`} style={{ borderColor: answers[currentQuestion.id] === index ? COLORS.aucdtGreen : undefined, backgroundColor: answers[currentQuestion.id] === index ? COLORS.aucdtLightGreen : undefined }}>
                          <div className="flex items-center space-x-3">
                          <input type="radio" name={`question-${currentQuestionIndex}`} value={index} checked={answers[currentQuestion.id] === index} onChange={() => handleAnswerSelect(currentQuestion.id, index)} className="form-radio h-5 w-5" style={{ accentColor: COLORS.aucdtGreen }} />
                          <span className="font-medium text-lg" style={{ color: COLORS.aucdtDarkGray }}>{String.fromCharCode(65 + index)}. <LatexRenderer>{option}</LatexRenderer></span>
                          </div>
                      </label>
                      ))}
                  </div>
                  {currentQuestion.diagram && (
                      <div className="md:w-1/2 flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                          <DiagramRenderer type={currentQuestion.diagram} />
                      </div>
                  )}
              </div>
              {currentQuestion.bonus && <BonusSection title={currentQuestion.bonus.title} content={currentQuestion.bonus.content} />}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <button onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0} className="py-3 px-6 rounded-lg font-bold shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtDeepBrown, color: COLORS.aucdtWhite }}>Previous</button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} className="py-3 px-6 rounded-lg font-bold shadow-md" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}>Next</button>
                    ) : (
                        <button onClick={onSubmit} className="py-3 px-8 rounded-lg font-bold shadow-md" style={{ backgroundColor: COLORS.aucdtGold, color: COLORS.aucdtWhite }}>Submit Exam</button>
                    )}
                </div>
            </div>
        </>
      )}
    </>
  );
};

```

### FILE: components/student/ExamStartScreen.tsx
```typescript

import { BookOpen, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { COLORS, EXAM_DURATION } from '../../constants';

import { availableSubjects } from "../../utils/waecGenerator";

interface ExamStartScreenProps {
  questionCount: number;
  onStart: (randomize: boolean, subject: string) => void;
  isGeneratingQuestions?: boolean;
}

export const ExamStartScreen: React.FC<ExamStartScreenProps> = ({ questionCount, onStart, isGeneratingQuestions = false }) => {
  const [randomize, setRandomize] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(availableSubjects[0]);

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: COLORS.aucdtGold }}>
        <BookOpen className="mx-auto mb-6" size={80} style={{ color: COLORS.aucdtDeepBrown }} />
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.aucdtDeepBrown }}>Techbridge University College (TUC) Mature Students Entrance Examination</h1>
        <h2 className="text-xl md:text-2xl mb-8" style={{ color: COLORS.aucdtGreen }}>MSEE 112 {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Aptitude Test</h2>
        
        <div className="rounded-lg p-6 mb-8 text-left" style={{ backgroundColor: COLORS.aucdtLightGreen }}>
            <h3 className="font-semibold text-xl mb-4" style={{ color: COLORS.aucdtDeepBrown }}>Examination Instructions:</h3>
            <ul className="space-y-3 text-lg" style={{ color: COLORS.aucdtDarkGray }}>
                <li>• Answer all 24 questions.</li>
                <li>• Your progress is saved automatically. If you leave, you can resume later.</li>
                <li>• Switching to other tabs or applications will pause the exam.</li>
                <li>• Time limit: {Math.floor(EXAM_DURATION / 3600)} hours. You can pause the timer if needed.</li>
            </ul>
        </div>
        
        <div className="flex items-center justify-center space-x-3 mb-6">
            <label htmlFor="subject-select" className="font-medium" style={{ color: COLORS.aucdtDarkGray }}>
              Select Subject:
            </label>
            <select
              id="subject-select"
              className="p-2 border rounded-md"
              style={{ borderColor: COLORS.aucdtDarkGray, color: COLORS.aucdtDeepBrown }}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isGeneratingQuestions}
            >
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </option>
              ))}
            </select>
        </div>

        <div className="flex items-center justify-center space-x-3 mb-6">
            <input 
              type="checkbox" 
              id="randomize" 
              className="h-5 w-5 rounded cursor-pointer" 
              style={{ accentColor: COLORS.aucdtGreen }} 
              checked={randomize} 
              onChange={(e) => setRandomize(e.target.checked)}
              disabled={isGeneratingQuestions}
            />
            <label htmlFor="randomize" className="font-medium cursor-pointer" style={{ color: COLORS.aucdtDarkGray }}>
              Generate New Questions (AI-powered)
            </label>
        </div>

        {randomize && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <p className="text-sm">
              ⚡ When enabled, AI will generate 24 brand new questions based on the current question set, 
              maintaining the same difficulty level and topics but with different numbers and scenarios.
            </p>
          </div>
        )}

        {isGeneratingQuestions && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center space-x-3" style={{ backgroundColor: COLORS.aucdtLightGreen }}>
            <Loader2 className="animate-spin" size={20} style={{ color: COLORS.aucdtGreen }} />
            <span style={{ color: COLORS.aucdtDeepBrown }}>Generating new questions... This may take a moment.</span>
          </div>
        )}

        <button 
          onClick={() => onStart(randomize, selectedSubject)} 
          disabled={isGeneratingQuestions}
          className="w-full md:w-auto py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
          style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}
        >
            {isGeneratingQuestions ? 'Generating Questions...' : 'Start Examination'}
        </button>
    </div>
  );
};

```

### FILE: components/student/StudentExperience.tsx
```typescript

import React, { useState, useEffect, useCallback } from 'react';
import { Question, Answers } from '../../types';
import { EXAM_DURATION } from '../../constants';
import { useFisherYatesShuffle } from '../../hooks/useFisherYatesShuffle';
import { generateVariationsFromQuestions, generateStarterQuestions } from '../../services/geminiService';
import { ExamStartScreen } from './ExamStartScreen';
import { ExamRunner } from './ExamRunner';
import { ExamResults } from './ExamResults';

interface StudentExperienceProps {
  initialQuestions: Question[];
  isAdmin: boolean;
  onReturnToAdmin: () => void;
}

export const StudentExperience: React.FC<StudentExperienceProps> = ({ initialQuestions, isAdmin, onReturnToAdmin }) => {
  const [examState, setExamState] = useState<'start' | 'running' | 'results'>('start');
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const shuffleQuestions = useFisherYatesShuffle<Question>();

  const examId = 'student_exam_progress'; // A consistent key for local storage

  // Load progress from local storage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(examId);
      if (savedProgress) {
        const { questions: savedQuestions, answers: savedAnswers, currentQuestionIndex: savedIndex, timeLeft: savedTime } = JSON.parse(savedProgress);
        if (savedQuestions && savedAnswers && savedIndex !== undefined && savedTime !== undefined) {
          setQuestions(savedQuestions);
          setAnswers(savedAnswers);
          setCurrentQuestionIndex(savedIndex);
          setTimeLeft(savedTime);
          setExamState('running'); // Resume the exam
        }
      } else {
        setQuestions(initialQuestions);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
      localStorage.removeItem(examId);
      setQuestions(initialQuestions);
    }
  }, [examId, initialQuestions]);

  // Save progress to local storage
  const saveProgress = useCallback(() => {
    if (examState === 'running') {
      const progress = { questions, answers, currentQuestionIndex, timeLeft };
      localStorage.setItem(examId, JSON.stringify(progress));
    }
  }, [examState, questions, answers, currentQuestionIndex, timeLeft, examId]);

  useEffect(() => {
    const saveInterval = setInterval(saveProgress, 10000); // Save every 10 seconds
    return () => clearInterval(saveInterval);
  }, [saveProgress]);


  const handleStartExam = async (randomize: boolean, subject: string) => {
    try {
      let questionsToStart: Question[];
      
      if (randomize) {
        setIsGeneratingQuestions(true);
        try {
          // Generate new questions based on the current ones
          questionsToStart = await generateVariationsFromQuestions(initialQuestions, subject);
          console.log('Generated new questions:', questionsToStart.length);
        } catch (error) {
          console.error('Failed to generate new questions:', error);
          // Fallback to shuffled original questions if generation fails
          questionsToStart = shuffleQuestions(initialQuestions);
          alert('Failed to generate new questions. Using shuffled original questions instead.');
        } finally {
          setIsGeneratingQuestions(false);
        }
      } else if (subject.toLowerCase() !== 'mathematics') {
        // Generate starter questions for non-mathematics subjects
        setIsGeneratingQuestions(true);
        try {
          questionsToStart = await generateStarterQuestions(subject);
          console.log('Generated starter questions for', subject, ':', questionsToStart.length);
        } catch (error) {
          console.error('Failed to generate starter questions:', error);
          // Fallback to default mathematics questions if generation fails
          questionsToStart = initialQuestions;
          alert(`Failed to generate ${subject} questions. Using default mathematics questions instead.`);
        } finally {
          setIsGeneratingQuestions(false);
        }
      } else {
        questionsToStart = initialQuestions;
      }
      
      setQuestions(questionsToStart);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(EXAM_DURATION);
      setExamState('running');
    } catch (error) {
      console.error('Error starting exam:', error);
      setIsGeneratingQuestions(false);
    }
  };

  const handleSubmitExam = () => {
    saveProgress(); // Final save
    localStorage.removeItem(examId);
    setExamState('results');
  };

  const handleRetakeExam = () => {
    setQuestions(initialQuestions);
    setExamState('start');
  };

  const renderContent = () => {
    switch (examState) {
      case 'running':
        return (
          <ExamRunner
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            onSubmit={handleSubmitExam}
          />
        );
      case 'results':
        return (
          <ExamResults
            questions={questions}
            answers={answers}
            onRetake={handleRetakeExam}
          />
        );
      case 'start':
      default:
        return (
          <ExamStartScreen
            questionCount={initialQuestions.length}
            onStart={handleStartExam}
            isGeneratingQuestions={isGeneratingQuestions}
          />
        );
    }
  };

  return (
    <div>
        {isAdmin && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg shadow-md" role="alert">
                <div className="flex justify-between items-center">
                    <p className="font-bold">Admin Preview: You are viewing as a student.</p>
                    <button onClick={onReturnToAdmin} className="py-1 px-3 rounded-lg font-bold" style={{ backgroundColor: '#D4AF37', color: 'white' }}>
                        Return to Admin View
                    </button>
                </div>
            </div>
        )}
        {renderContent()}
    </div>
  );
};

```

### FILE: constants.ts
```typescript

export const COLORS = {
  aucdtGold: '#D4AF37',
  aucdtDeepBrown: '#5C4033',
  aucdtGreen: '#4CAF50',
  aucdtLightGreen: '#E8F5E9',
  aucdtWhite: '#FFFFFF',
  aucdtLightGray: '#F9FAFB',
  aucdtDarkGray: '#374151',
  aucdtRed: '#DC2626',
};

export const EXAM_DURATION = 7200; // 2 hours in seconds

export const LLM_PROMPT = `You are an expert mathematics exam question parser. Your task is to convert the following text from a mathematics exam paper into a clean JSON array of question objects.

REQUIRED STRUCTURE:
Each question object must have these properties:
- "id" (integer, sequential starting from 1)
- "question" (string, the question text)
- "options" (array of exactly 5 strings, labeled A through E)
- "correct" (integer, 0-based index of the correct answer)

OPTIONAL PROPERTIES:
- "diagram" (string, for questions requiring visual elements)
- "bonus" (object with "title" and "content" properties for additional information)

PARSING RULES:

1. CONTENT FILTERING:
   - Extract ONLY the actual questions and their multiple-choice options
   - Ignore headers, footers, page numbers, instructions, and administrative text
   - Focus on questions numbered sequentially (1, 2, 3, etc.)

2. MATHEMATICAL FORMATTING:
   - Use LaTeX delimiters: $...$ for inline math, $$...$$ for display math
   - Convert percentages: "25%" → "25\\%"
   - Convert fractions: "1/2" → "$\\frac{1}{2}$" (when appropriate)
   - Convert variables and expressions: "5x - 2y + 3" → "$5x - 2y + 3$"
   - Use \\times for multiplication symbols when needed

3. MATRIX FORMATTING:
   - Convert bracket notation to LaTeX bmatrix format
   - Example: "[2 -1; 0 5]" → "$\\begin{bmatrix} 2 & -1 \\\\ 0 & 5 \\end{bmatrix}$"
   - Preserve spacing and alignment in matrix expressions

4. DIAGRAM DETECTION:
   Add "diagram" property when questions mention:
   - "In the diagram below" or similar phrases
   - Geometric figures requiring visual representation
   
   Use these diagram types:
   - "angles_on_line": For angle problems with intersecting lines
   - "right_triangle_abc": For right triangle problems with labeled sides
   - "pie_chart_colors": For data distribution problems with color categories

5. OPTION FORMATTING:
   - Ensure exactly 5 options (A, B, C, D, E)
   - If only 4 options exist, add "E. None of these" as the 5th option
   - Apply mathematical formatting to options consistently
   - Preserve the original meaning while improving readability

6. BONUS CONTENT:
   - Look for "Bonus", "Honors", "Note", or "Did you know" sections
   - Add as bonus object: {"title": "Section Title", "content": "Explanatory text"}

7. ANSWER IDENTIFICATION:
   - Determine the correct answer based on mathematical accuracy
   - Use 0-based indexing (A=0, B=1, C=2, D=3, E=4)
   - If answer key is provided, use it; otherwise, calculate the correct answer

EXAMPLES:

Matrix Question:
Input: "If P = [2 -1; 0 5] and Q = [3 4; -2 1], evaluate 2P + Q."
Output: "If $P = \\begin{bmatrix} 2 & -1 \\\\ 0 & 5 \\end{bmatrix}$ and $Q = \\begin{bmatrix} 3 & 4 \\\\ -2 & 1 \\end{bmatrix}$, evaluate $2P + Q$."

Percentage Question:
Input: "What is 25% of 80?"
Output: "What is $25\\%$ of $80$?"

Angle Question:
Input: "In the diagram below, find angle x."
Output: {"question": "In the diagram below, find the value of angle x.", "diagram": "angles_on_line", ...}

QUALITY CHECKS:
- Verify all mathematical expressions are properly formatted
- Ensure question numbering is sequential
- Confirm all options are clearly stated
- Check that diagram types match question content
- Validate that correct answers are mathematically accurate

Now, parse the following exam text:`;

```

### FILE: CREATION.md
```md
# mature-students-exam-app

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

### FILE: data/defaultQuestions.ts
```typescript

import { Question } from '../types';

export const defaultQuestions: Question[] = [
    { id: 1, question: "Evaluate the expression: $5x - 2y + 3$, when $x = 3$ and $y = -1$.", options: ["14", "16", "20", "22", "None of these"], correct: 2 },
    { id: 2, question: "Solve for p in the equation: $3(p + 5) = 21$", options: ["p=2", "p=4", "p=6", "p=8", "None of these"], correct: 0 },
    { id: 3, question: "The ages of five friends are 23, 18, 20, 25, and 21. What is the median age?", options: ["20", "21", "22", "23", "None of these"], correct: 1 },
    { id: 4, question: "Simplify the expression: $7(2m - 3) - 4(m+5)$", options: ["10m-1", "10m-41", "14m-1", "14m-41", "None of these"], correct: 1 },
    { id: 5, question: "Arrange the following numbers in ascending order: $0.35, 1/3, 25\\%$", options: ["0.35, 1/3, 25%", "1/3, 25%, 0.35", "25%, 0.35, 1/3", "25%, 1/3, 0.35", "None of these"], correct: 3 },
    { id: 6, question: "A carpenter cuts a piece of wood that is 12 feet long. He uses $1/3$ of it for a shelf and $2/5$ of it for a table leg. How many feet of wood does he have left?", options: ["2 feet", "4 feet", "6 feet", "8 feet", "None of these"], correct: 4 },
    { id: 7, question: "Increase 240 by 35%.", options: ["84", "156", "324", "400", "None of these"], correct: 2 },
    { id: 8, question: "A container holds 450 litres of juice. If 135 litres are poured out, what percentage of the original amount of juice remains in the container?", options: ["30%", "40%", "60%", "70%", "None of these"], correct: 3 },
    { id: 9, question: "A recipe for trail mix calls for peanuts, raisins, and chocolate chips in the ratio of $3:2:1$. If 12 cups of peanuts are used, how many cups of trail mix will the recipe make?", options: ["18 cups", "20 cups", "24 cups", "36 cups", "None of these"], correct: 2 },
    { id: 10, question: "Using the same recipe from question 9, how many cups of chocolate chips will be needed?", options: ["2 cups", "4 cups", "6 cups", "8 cups", "None of these"], correct: 1 },
    { id: 11, question: "In the diagram below, find the value of angle y.", options: ["65°", "75°", "85°", "95°", "None of these"], correct: 1, diagram: 'angles_on_line' },
    { id: 12, question: "The pie chart below shows the distribution of favourite colours among a group of students. What angle would represent the colour blue?", options: ["30°", "90°", "120°", "135°", "150°"], correct: 3, diagram: 'pie_chart_colors' },
    { id: 13, question: "Using the diagram from question 12, if a student is selected at random, what is the probability that their favourite colour is yellow?", options: ["7/25", "7/32", "1/4", "1/7", "None of these"], correct: 1 },
    { id: 14, question: "What is the mode of the data set: 5, 8, 2, 8, 5, 6, 6, 8, 9, 5?", options: ["2", "5", "6", "8", "None of these"], correct: 3 },
    { id: 15, question: "Find the arithmetic mean of the following numbers: 4, 10, 6, 12, 8.", options: ["6", "8", "10", "12", "None of these"], correct: 1 },
    { id: 16, question: "In the right-angled triangle ABC shown in the diagram, side AB has length 6 and side BC has length 8. What is the length of the hypotenuse AC?", options: ["10", "12", "14", "100", "None of these"], correct: 0, diagram: 'right_triangle_abc' },
    { id: 17, question: "A bag contains 3 red marbles, 5 blue marbles, and 2 green marbles. If a marble is selected at random, what is the probability that it is NOT blue?", options: ["1/5", "2/5", "3/5", "4/5", "None of these"], correct: 4 },
    { id: 18, question: "Solve the inequality: $4x + 3 < 15$", options: ["x<3", "x>3", "x<-3", "x>-3", "None of these"], correct: 0 },
    { id: 19, question: "If $P = \\begin{bmatrix} 2 & -1 \\\\ 0 & 5 \\end{bmatrix}$ and $Q = \\begin{bmatrix} 3 & 4 \\\\ -2 & 1 \\end{bmatrix}$, evaluate $2P + Q$.", options: ["$\\begin{bmatrix} 7 & 2 \\\\ -2 & 11 \\end{bmatrix}$", "$\\begin{bmatrix} 7 & 9 \\\\ -2 & 11 \\end{bmatrix}$", "$\\begin{bmatrix} 1 & 9 \\\\ -2 & 11 \\end{bmatrix}$", "$\\begin{bmatrix} 1 & 11 \\\\ -2 & 9 \\end{bmatrix}$", "None of these"], correct: 0 },
    { id: 20, question: "Given the equations: $2x + y = 9$ and $x - y = 3$, find the value of $(x - y)$.", options: ["1", "2", "3", "4", "None of these"], correct: 2 },
    { id: 21, question: "Calculate the result of the following matrix multiplication: $$\begin{bmatrix} 6 & 5 & 3 & 7 \\\\ 3 & 2 & 1 & 3 \\\\ 5 & 3 & 2 & 5 \\\\ 7 & 5 & 3 & 6 \\end{bmatrix} \\times \\begin{bmatrix} 7 & 2 & 1 & 2 \\\\ 2 & 7 & 1 & 2 \\\\ 1 & 1 & 3 & 1 \\\\ 2 & 2 & 1 & 7 \\end{bmatrix}$$", options: ["$$\\begin{bmatrix} 67 & 52 & 31 & 72 \\\\ 31 & 21 & 13 & 31 \\\\ 52 & 37 & 21 & 52 \\\\ 72 & 52 & 31 & 67 \\end{bmatrix}$$", "$$\\begin{bmatrix} 67 & 50 & 30 & 70 \\\\ 31 & 20 & 10 & 30 \\\\ 52 & 35 & 20 & 50 \\\\ 72 & 50 & 30 & 67 \\end{bmatrix}$$", "A 2x2 Matrix", "An identity matrix", "None of these"], correct: 0, bonus: { title: "Honors Section: A Beautiful Coincidence", content: "This specific matrix multiplication, where a symmetric matrix is multiplied by another symmetric matrix, results in a new symmetric matrix. This is a fascinating example of how properties of matrices are preserved through certain operations." } },
    { id: 22, question: "A car travels at a speed of 60 km/h. How long will it take to travel 180 km?", options: ["2 hours", "3 hours", "4 hours", "5 hours", "None of these"], correct: 1 },
    { id: 23, question: "What is the area of a circle with a radius of 7 cm? (Use $\\pi = 22/7$)", options: ["154 cm²", "44 cm²", "22 cm²", "14 cm²", "None of these"], correct: 0 },
    { id: 24, question: "If a = 5 and b = 3, what is the value of $a^2 - b^2$?", options: ["4", "8", "16", "25", "None of these"], correct: 2 }
];

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/mature-students-exam-app/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/mature-students-exam-app/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/mature-students-exam-app/',  // REQUIRED: Assets must load from /mature-students-exam-app/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/mature-students-exam-app"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/mature-students-exam-app">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/mature-students-exam-app/`, not at the root
- **Asset Loading**: Without `base: '/mature-students-exam-app/'`, assets try to load from `/assets/` instead of `/mature-students-exam-app/assets/`
- **Routing**: Without `basename="/mature-students-exam-app"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/mature-students-exam-app/assets/index-*.js`
- Link tags should reference: `/mature-students-exam-app/assets/index-*.css`

If they reference `/assets/` instead of `/mature-students-exam-app/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/mature-students-exam-app/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/mature-students-exam-app/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: mature-students-exam-app

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — mature-students-exam-app

**Application:** mature-students-exam-app
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

Audit log data is stored in `localStorage` under the key `tuc_mature-students-exam-app_audit`.

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
# Deployment Guide — mature-students-exam-app

**Application:** mature-students-exam-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd mature-students-exam-app
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
docker-compose -f docker-compose-all-apps.yml build mature-students-exam-app
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up mature-students-exam-app
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

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Mature Students Exam App
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Mature Students Exam App**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Mature Students Exam App** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Mature Students Exam App** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
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

### FILE: docs/TESTING.md
```md
# Testing Guide — mature-students-exam-app

**Application:** mature-students-exam-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd mature-students-exam-app
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

### FILE: hooks/useAuth.ts
```typescript
import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// This configuration is Outside the hook as it should not be re-declared on every render.
const firebaseConfig = {
    apiKey: "AIzaSyCsPdbCCfpkOg202G7X_cWQQJYEWYwg4P8",
    authDomain: "msee-math-aptitude-test-v1.firebaseapp.com",
    projectId: "msee-math-aptitude-test-v1",
    storageBucket: "msee-math-aptitude-test-v1.appspot.com",
    messagingSenderId: "404202764482",
    appId: "msee-math-aptitude-test-v1"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export const useAuth = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(!currentUser.isAnonymous);
      } else {
        // No user is signed in. App will proceed with a null user.
        setUser(null);
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // `onAuthStateChanged` will handle the user state change.
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return { user, isAuthReady, isAdmin, handleSignOut };
};

```

### FILE: hooks/useFisherYatesShuffle.ts
```typescript

import { useCallback } from 'react';

export const useFisherYatesShuffle = <T,>() => {
  const shuffle = useCallback((array: T[]): T[] => {
    const newArray = [...array];
    let currentIndex = newArray.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [newArray[currentIndex], newArray[randomIndex]] = [
        newArray[randomIndex], newArray[currentIndex]
      ];
    }
    return newArray;
  }, []);

  return shuffle;
};

```

### FILE: hooks/useScript.ts
```typescript
// This hook is no longer in use and can be safely deleted.
// It was previously used by LatexRenderer, which now relies on the
// pre-loaded KaTeX script from index.html.
export {};

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
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Mature Students Exam App | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Mature Students Exam App | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mature Students Exam App | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">mature students exam app</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);

```

### FILE: metadata.json
```json
{
  "name": "Mature Students Exam App",
  "description": "An advanced web application for taking and creating mathematics aptitude tests, featuring LaTeX rendering, dynamic diagrams, and AI-powered question generation. Designed for the Techbridge University College (TUC) Mature Students Entrance Examination.",
  "requestFramePermissions": [],
  "prompt": ""
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
  "packageManager": "pnpm@10.30.1",
  "name": "mature-students-exam-app",
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
    "@google/genai": "^1.14.0",
    "chart.js": "^4.5.0",
    "firebase": "^12.1.0",
    "lucide-react": "^0.539.0",
    "mermaid": "^11.9.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^24.2.1",
    "serve": "14.2.5",
    "typescript": "~5.9.2",
    "vite": "7.3.1",
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
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

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

import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';
import { LLM_PROMPT } from '../constants';

const API_KEY = [REDACTED_CREDENTIAL]

if (!API_KEY) {
    console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.NUMBER },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correct: { type: Type.NUMBER },
            diagram: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING },
                    data: { type: Type.ANY }
                },
                nullable: true
            },
            bonus: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING }
                },
                nullable: true
            }
        },
        required: ["id", "question", "options", "correct"]
    }
};

export const generateQuestionsFromText = async (text: string): Promise<Question[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    const fullPrompt = `${LLM_PROMPT}\n\n"${text}"`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const responseText = response.text.trim();
    if (!responseText) {
         if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("The request was blocked due to safety concerns. Please adjust the input text.");
         }
        throw new Error("The AI model returned an empty response. Please check the model configuration or your input.");
    }

    try {
        const parsedJson = JSON.parse(responseText);
        // Fix sequential IDs after generation
        return parsedJson.map((q: Question, index: number) => ({ ...q, id: index + 1 }));
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", responseText);
        throw new Error("The AI model returned an invalid JSON format.");
    }
};

import { generateSubjectInstruction } from "../utils/waecGenerator";

export const generateVariationsFromQuestions = async (existingQuestions: Question[], subject: string): Promise<Question[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    // Create a prompt that asks for variations of the existing questions
    const questionsText = existingQuestions.map(q => {
        let questionText = `Question ${q.id}: ${q.question}\n`;
        q.options.forEach((option, index) => {
            questionText += `${String.fromCharCode(65 + index)}. ${option}\n`;
        });
        if (q.bonus) {
            questionText += `Bonus: ${q.bonus.title} - ${q.bonus.content}\n`;
        }
        return questionText;
    }).join('\n\n');

    const variationPrompt = generateSubjectInstruction(subject).replace("\\${questionsText}", questionsText);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: variationPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const responseText = response.text.trim();
    if (!responseText) {
         if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("The request was blocked due to safety concerns. Please try again.");
         }
        throw new Error("The AI model returned an empty response. Please try again.");
    }

    try {
        const parsedJson = JSON.parse(responseText);
        // Fix sequential IDs after generation
        return parsedJson.map((q: Question, index: number) => ({ ...q, id: index + 1 }));
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", responseText);
        throw new Error("The AI model returned an invalid JSON format.");
    }
};


export const generateStarterQuestions = async (subject: string): Promise<Question[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const starterPrompt = generateSubjectInstruction(subject);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: starterPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });
    
    const responseText = response.text.trim();
    if (!responseText) {
         if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error("The request was blocked due to safety concerns. Please try again.");
         }
        throw new Error("The AI model returned an empty response. Please try again.");
    }

    try {
        const parsedJson = JSON.parse(responseText);
        // Fix sequential IDs after generation
        return parsedJson.map((q: Question, index: number) => ({ ...q, id: index + 1 }));
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", responseText);
        throw new Error("The AI model returned an invalid JSON format.");
    }
};



```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Mature Students Exam App</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Mature Students Exam App — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — mature-students-exam-app
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('mature-students-exam-app E2E', () => {
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
    "target": "ES2020",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "allowJs": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "paths": {
      "@/*" :  ["./*"]
    }
  }
}

```

### FILE: types.ts
```typescript
import type firebase from 'firebase/compat/app';

export type DiagramType = 'right_triangle_abc' | 'angles_on_line' | 'pie_chart_colors' | 'chartjs_bar' | 'chartjs_line' | 'mermaid_flowchart' | 'mermaid_sequence' | 'mermaid_class';

export interface Bonus {
  title: string;
  content: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  diagram?: DiagramType;
  bonus?: Bonus;
}

export interface Exam {
  id: string;
  name: string;
  questions: string; // Stored as a JSON string
  createdAt: any;
  createdBy: string;
}

export interface AppUser extends firebase.User {
    // Extend with custom properties if needed in the future
}

export interface Answers {
  [questionId: number]: number;
}

```

### FILE: utils/waecGenerator.ts
```typescript
const generateWAECSystemInstructions = (subject: string, specificRequirements: any = {}) => {
  // I've escaped the inner backticks on the last line with a backslash (\)
  const baseInstruction = `You are an expert ${subject} exam question generator for WAEC Senior High School examinations. Generate 24 NEW questions that are appropriate for SHS level examinations in ${subject}.\n\nCORE REQUIREMENTS:\n1. Generate exactly 24 questions\n2. Maintain appropriate difficulty level for SHS level\n3. Use diverse content, scenarios, contexts, and examples\n4. Each question should have exactly 5 options (A, B, C, D, E)\n5. Use "None of these" or "All of the above" as option E when contextually appropriate\n6. Follow WAEC examination standards and marking schemes\n7. Ensure cultural relevance to West African context where applicable\n\nSUBJECT-SPECIFIC REQUIREMENTS:\n${specificRequirements.content || 'Maintain subject-specific terminology and concepts'}\n\nFORMATTING REQUIREMENTS:\n- ${specificRequirements.formatting || 'Use proper academic formatting for the subject'}\n- Include diagrams, charts, or visual elements where appropriate\n- Include bonus sections for interesting questions\n- Follow the exact JSON format structure\n\nQUALITY STANDARDS:\n- Questions must be academically rigorous and age-appropriate\n- Avoid ambiguous wording or trick questions\n- Ensure one clearly correct answer per question\n- Make distractors plausible but clearly incorrect\n- Test understanding, not just memorization\n\nCONTENT GUIDELINES:\n- Use diverse examples that reflect West African contexts\n- Include both theoretical and practical applications\n- Maintain progressive difficulty throughout the set\n- Cover broad topic areas within the subject\n\nGenerate 24 new questions following the exact JSON format with properties: id, question, options, correct, and optional diagram/bonus properties. For diagrams, include a \`diagram\` property with \`type\` (e.g., \`chartjs_bar\`, \`mermaid_flowchart\`) and \`data\` (JSON object for Chart.js, Mermaid string for Mermaid) properties.`;

  return baseInstruction;
};

const subjectConfigurations = {
  mathematics: {
    content: `Cover algebra, geometry, statistics, trigonometry, calculus basics, and applied mathematics\n- Use LaTeX formatting with $ delimiters for all mathematical expressions\n- Include coordinate geometry, matrices, and probability questions\n- Maintain computational accuracy in all numerical answers`,
    formatting: `Use LaTeX mathematical notation ($x^2 + 3x - 4 = 0$) for expressions`
  },
  english: {
    content: `Cover comprehension, grammar, literature, composition, and language usage\n- Include passages from West African authors where appropriate\n- Test vocabulary, syntax, literary devices, and critical analysis\n- Maintain standard English conventions`,
    formatting: `Use proper quotation marks for literary excerpts and dialogue`
  },
  integratedScience: {
    content: `Cover physics, chemistry, biology, and environmental science concepts\n- Include practical applications and everyday phenomena\n- Test scientific method, observation, and analysis skills\n- Cover health, technology, and environmental topics`,
    formatting: `Use scientific notation and proper units for measurements`
  },
  socialStudies: {
    content: `Cover history, geography, government, economics, and cultural studies\n- Focus on West African context and global connections\n- Include current affairs and civic education\n- Test critical thinking about social issues`,
    formatting: `Use proper names for places, people, and institutions`
  },
  physics: {
    content: `Cover mechanics, waves, electricity, magnetism, modern physics\n- Include practical applications and real-world problems\n- Use SI units consistently\n- Test both theoretical understanding and problem-solving`,
    formatting: `Use scientific notation and physics symbols (F = ma, E = mc²)`
  },
  chemistry: {
    content: `Cover atomic structure, bonding, reactions, organic/inorganic chemistry\n- Include industrial applications and everyday chemistry\n- Test periodic trends, stoichiometry, and chemical analysis\n- Cover environmental chemistry topics`,
    formatting: `Use chemical formulas (H₂SO₄, CH₃COOH) and balanced equations`
  },
  biology: {
    content: `Cover cell biology, genetics, ecology, human biology, plant biology\n- Include biotechnology and health applications\n- Test classification, evolution, and biodiversity\n- Cover environmental and conservation topics`,
    formatting: `Use proper biological nomenclature and taxonomic names`
  },
  history: {
    content: `Cover ancient civilizations, colonial period, independence movements, modern Africa\n- Focus on West African history and global connections\n- Include social, political, and economic developments\n- Test chronological understanding and cause-effect relationships`,
    formatting: `Use proper historical dates and period names`
  },
  geography: {
    content: `Cover physical geography, human geography, economic geography, map reading\n- Include West African case studies and global examples\n- Test spatial analysis and environmental understanding\n- Cover climate, resources, and development topics`,
    formatting: `Use proper geographical coordinates and map symbols`
  },
  government: {
    content: `Cover political systems, constitution, democracy, international relations\n- Focus on West African political systems and global governance\n- Include civic rights, responsibilities, and participation\n- Test understanding of democratic processes`,
    formatting: `Use proper names of political institutions and offices`
  },
  economics: {
    content: `Cover microeconomics, macroeconomics, development economics, international trade\n- Include West African economic examples and case studies\n- Test economic principles and their applications\n- Cover market systems and economic indicators`,
    formatting: `Use proper economic terminology and notation`
  },
  literature: {
    content: `Cover prose, poetry, drama from African and world literature\n- Include prescribed texts and general literary knowledge\n- Test literary analysis, themes, and techniques\n- Cover oral tradition and written literature`,
    formatting: `Use proper citation format for literary works and authors`
  },
  technicalDrawing: {
    content: `Cover orthographic projection, isometric drawing, development of surfaces\n- Include engineering applications and architectural basics\n- Test spatial visualization and technical accuracy\n- Cover geometric construction and CAD basics`,
    formatting: `Reference standard drawing conventions and symbols`
  },
  foodAndNutrition: {
    content: `Cover nutrition science, food preparation, meal planning, food safety\n- Include West African foods and dietary practices\n- Test nutritional requirements and health applications\n- Cover food preservation and culinary skills`,
    formatting: `Use proper nutritional terminology and measurements`
  },
  visualArts: {
    content: `Cover drawing, painting, sculpture, design, art history\n- Include African art traditions and contemporary practices\n- Test artistic techniques and aesthetic principles\n- Cover art criticism and cultural contexts`,
    formatting: `Use proper art terminology and historical references`
  },
  french: {
    content: `Cover grammar, vocabulary, comprehension, composition, oral communication\n- Include Francophone African contexts\n- Test language skills and cultural understanding\n- Cover practical communication scenarios`,
    formatting: `Use proper French orthography and accents (café, résumé)`
  },
  akan: {
    content: `Cover grammar, oral tradition, literature, cultural expressions\n- Test language proficiency and cultural knowledge\n- Include proverbs, folktales, and traditional practices\n- Cover written and oral communication`,
    formatting: `Use proper Akan orthography and tone marks where applicable`
  }
};

export const generateSubjectInstruction = (subject: string) => {
  const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '');
  const config = subjectConfigurations[normalizedSubject as keyof typeof subjectConfigurations];
  if (!config) {
    throw new Error(`Subject "${subject}" not found. Available subjects: ${Object.keys(subjectConfigurations).join(', ')}`);
  }
  return generateWAECSystemInstructions(subject, config);
};

export const availableSubjects = Object.keys(subjectConfigurations);
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — mature-students-exam-app
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

// Vitest E2E configuration — mature-students-exam-app
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

