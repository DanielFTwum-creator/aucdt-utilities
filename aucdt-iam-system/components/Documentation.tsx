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
                          <pre><code>REACT_APP_API_KEY=your_gemini_api_key_here</code></pre>

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