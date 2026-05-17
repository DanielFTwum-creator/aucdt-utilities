# fashion-design-brochure - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for fashion-design-brochure.

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

import React, { useState } from 'react';

// Fix: Define interfaces for the curriculum data structure to provide strong types.
// This resolves the error "Property 'map' does not exist on type 'unknown'"
// by ensuring TypeScript knows that 'courses' is an array.
interface Course {
  code: string;
  title: string;
  hours: number;
}

interface SemesterData {
  [semester: string]: Course[];
}

interface CurriculumData {
  [year: string]: SemesterData;
}


// --- DATA ---
const curriculumData: CurriculumData = {
  'Year One': {
    'Semester One': [
      { code: 'FDT 151', title: 'Introduction to Fashion', hours: 2 },
      { code: 'FDT 153', title: 'Introduction to Textile Design', hours: 2 },
      { code: 'FDT 155', title: 'Pattern Making', hours: 2 },
      { code: 'FDT 157', title: 'Sewing Techniques', hours: 3 },
      { code: 'FDT 159', title: 'Introduction to Textiles', hours: 2 },
      { code: 'ACDT 114', title: 'Basic Drawing', hours: 3 },
      { code: 'ACDT 117', title: 'Information Communication Technology I', hours: 2 },
      { code: 'ACDT 115', title: 'Introduction to African Art & Culture', hours: 2 },
      { code: 'ACDT 116', title: 'Communication and Study Skills I', hours: 3 },
    ],
    'Semester Two': [
      { code: 'FDT 150', title: 'Introduction to Creative Design in Fashion', hours: 2 },
      { code: 'FDT 152', title: 'Textile Design', hours: 2 },
      { code: 'FDT 154', title: 'Pattern Adaptation', hours: 3 },
      { code: 'FDT 156', title: 'Garment Construction', hours: 3 },
      { code: 'FDT 158', title: 'Freehand Cutting', hours: 3 },
      { code: 'FDT 160', title: 'Basic Design', hours: 2 },
      { code: 'ACDT 127', title: 'Information Communication Technology II', hours: 2 },
      { code: 'ACDT 126', title: 'Communication and Study Skills II', hours: 2 },
      { code: '*WEL 150', title: 'Industrial Attachment I', hours: 0 },
    ],
  },
  'Year Two': {
    'Semester One': [
        { code: 'FDT 251', title: 'Creative Design in Fashion', hours: 3 },
        { code: 'FDT 253', title: 'Printed Textile Design Application', hours: 4 },
        { code: 'FDT 255', title: 'Pattern Technology I', hours: 3 },
        { code: 'FDT 257', title: 'Garment Technology I', hours: 3 },
        { code: 'FDT 259', title: 'Introduction to Fabric Studies', hours: 3 },
        { code: 'FDT 261', title: 'Fashion Illustration', hours: 3 },
        { code: 'FDT 263', title: 'Basic Computer Aided Design', hours: 2 },
        { code: 'FDT 265', title: 'Introduction to Fashion Accessories', hours: 3 },
        { code: 'FTD 267', title: 'Introduction to Production Management', hours: 2 },
    ],
    'Semester Two': [
        { code: 'FDT 250', title: 'Basic Fashion Design and Illustration', hours: 2 },
        { code: 'FDT 252', title: 'Pattern Technology II', hours: 3 },
        { code: 'FDT 254', title: 'Garment Technology II', hours: 3 },
        { code: 'FDT 256', title: 'Fabric Studies', hours: 2 },
        { code: 'FDT 258', title: 'Millinery Design and Production', hours: 3 },
        { code: 'FDT 260', title: 'Computer Aided Design', hours: 2 },
        { code: 'FDT 262', title: 'Fashion Marketing', hours: 2 },
        { code: 'FDT 264', title: 'Production Management', hours: 2 },
        { code: '*WEL 250', title: 'Industrial Attachment', hours: 0 },
    ],
  },
  'Year Three': {
    'Semester One': [
      { code: 'FDT 351', title: 'Design and Illustration', hours: 3 },
      { code: 'FDT 353', title: 'Garment Decoration Techniques', hours: 2 },
      { code: 'FDT 355', title: 'Pattern Alteration', hours: 2 },
      { code: 'FDT 357', title: 'Fashion Draping', hours: 3 },
      { code: 'FDT 359', title: 'Design and Production of Bags and Slippers', hours: 2 },
      { code: 'FDT 361', title: 'Entrepreneurship I', hours: 2 },
      { code: 'FDT 363', title: 'Seminar in Fashion', hours: 2 },
      { code: 'ACDT 367', title: 'Research Methods', hours: 2 },
    ],
    'Semester Two': [
      { code: 'WEL 350', title: 'Industrial Attachment III', hours: 18 },
      { code: 'FDT 352', title: 'Research Methods/Seminar', hours: 3 },
    ],
  },
  'Year Four': {
    'Semester One': [
      { code: 'FDT 451', title: 'Collection Development', hours: 5 },
      { code: 'FDT 453', title: 'Quality Control in Garment Production', hours: 2 },
      { code: 'FDT 455', title: 'Beauty Culture', hours: 3 },
      { code: 'FDT 457', title: 'Entrepreneurship II', hours: 2 },
      { code: 'FDT 459', title: 'Thesis/ Project I', hours: 3 },
    ],
    'Semester Two': [
      { code: 'FDT 450', title: 'Final Collection Development', hours: 3 },
      { code: 'FDT 452', title: 'Portfolio Development and Exhibition', hours: 5 },
      { code: 'FDT 454', title: 'Salesmanship and Sales Management', hours: 2 },
      { code: 'FDT 457', title: 'Fashion Merchandising', hours: 2 },
      { code: 'FDT 464', title: 'Thesis/ Project II', hours: 3 },
    ],
  },
};

// Fix: Add explicit prop types for the Objective component for better type safety.
interface ObjectiveProps {
  num: number;
  text: string;
}

const Objective: React.FC<ObjectiveProps> = ({ num, text }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-10 h-10 bg-[#6C242D] text-white flex items-center justify-center font-bold text-xl">
      {num}
    </div>
    <p className="mt-1">{text}</p>
  </div>
);

const App: React.FC = () => {
  const [activeYear, setActiveYear] = useState('Year One');

  return (
    <div className="bg-[#F9F6EE] text-[#6C242D] min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-10 p-4 sm:p-8">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold uppercase">
             AUCDT
          </div>
          <a href="#contact" className="bg-[#FDBB30] text-[#6C242D] font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors">
            Apply Now
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-[#F9F6EE] overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute top-[-20%] right-[-30%] w-[80%] h-[120%] bg-white/70 rounded-[50%] "></div>
          </div>
          <div className="container mx-auto px-4 sm:px-8 relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                  <p className="text-lg font-semibold">BTech</p>
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight">Fashion</h1>
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight">Design</h1>
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight text-white" style={{WebkitTextStroke: '2px #6C242D'}}>Technology</h1>
                  <div className="mt-8">
                      <h2 className="text-4xl font-bold">Academic Brochure</h2>
                      <ul className="mt-4 space-y-1 text-left inline-block">
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> Overview of the Fashion Design programme</li>
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> Entry Requirements</li>
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> How to Apply etc</li>
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> What you will learn</li>
                      </ul>
                  </div>
              </div>
              <div className="relative h-[500px] md:h-auto">
                <div className="absolute -bottom-16 -left-16 w-full h-full bg-[#FDBB30] rounded-[50%] z-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="A smiling fashion design student" 
                  className="relative z-10 w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>
          </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-2 inline-block mb-8">
              <h2 className="text-5xl font-bold p-4 bg-[#FDBB30] inline-block">WELCOME</h2><br/>
              <h2 className="text-5xl font-bold p-4 bg-[#FDBB30] inline-block">TO OUR</h2><br/>
              <h2 className="text-5xl font-bold p-4 bg-[#FDBB30] inline-block">DEPARTMENT</h2>
            </div>
            <p className="text-lg leading-relaxed">The Department of Fashion Design is offering a Four (4) year Bachelor of Technology (BTech) Fashion Design Technology programme. This programme offers students access to state of the art fashion design equipment, tools, studios, machines, professional staff, internship opportunities and entrepreneurial skills.</p>
            <p className="text-lg leading-relaxed mt-4">The new academic year provides a platform for outstanding education in nurturing a generation of highly skilled fashion design professionals, and we hope that you will join us in our world-class facilities for our dynamic new season. You will experience high caliber works by our faculty and students as well as professional exhibitions.</p>
          </div>
        </div>
      </section>

      {/* Programme Objectives */}
      <section className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-[#F9F6EE] absolute -top-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-5xl font-bold mb-4">Aim of the Programme</h3>
            <p>The aim of this programme is embodied in the Vision and Mission of AsanSka University College of Design and Technology (AUCDT); that is, to become a centre of excellence for the training of Fashion and textile designers and to collaborate with industry and research institutions in the areas of design and technology education fuelled by research and entrepreneurship.</p>
            <h3 className="text-5xl font-bold mt-12 mb-6">Objectives of the Programme</h3>
            <div className="space-y-6">
              <Objective num={1} text="Encourage the students to apply modern technology to indigenous themes to create new designs that will contribute to a sustainable evolution from traditional/cottage industries to modern artisanal manufacturing industries." />
              <Objective num={2} text="Provide our students an opportunity to give vent to their creative ideas through Fashion design as a profession." />
              <Objective num={3} text="Develop a group of competent professional Fashion designers able to contribute to the changing aesthetics in the Ghanaian Fashion industry." />
              <Objective num={4} text="Serve as a conduit for those who have established careers in other disciplines but who seek to change their professional direction by acquiring new skills in Fashion design." />
            </div>
          </div>
          <div className="relative h-[600px]">
             <div className="absolute bottom-0 -right-20 w-full h-full bg-[#FDBB30] rounded-lg rotate-[-6deg] z-0"></div>
             <img src="https://images.unsplash.com/photo-1549062327-514555567303?q=80&w=800&auto=format&fit=crop" alt="Fashion student working on a mannequin" className="relative z-10 w-full h-full object-cover rounded-lg shadow-xl" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-[#F9F6EE] absolute -bottom-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
      </section>
      
      {/* Course Curriculum */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-8">
            <h2 className="text-6xl sm:text-8xl font-black text-center mb-12" style={{ fontFamily: "'Dancing Script', cursive", fontStyle: 'italic' }}>Course Curriculum</h2>
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg">
                <div className="flex flex-wrap justify-center border-b-2 border-[#FDB813] mb-6">
                    {Object.keys(curriculumData).map(year => (
                        <button key={year} onClick={() => setActiveYear(year)} className={`py-3 px-6 text-lg font-bold transition-colors ${activeYear === year ? 'bg-[#FDB813] text-[#6C242D]' : 'text-gray-500 hover:text-[#6C242D]'}`}>
                            {year}
                        </button>
                    ))}
                </div>
                <div>
                    {activeYear && curriculumData[activeYear] && Object.entries(curriculumData[activeYear]).map(([semester, courses]) => (
                        <div key={semester} className="mb-8">
                            <h3 className="text-2xl font-bold mb-4">{semester}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FDB813]">
                                        <tr>
                                            <th className="p-3">No.</th>
                                            <th className="p-3">Course Code</th>
                                            <th className="p-3 w-1/2">Course Title</th>
                                            <th className="p-3 text-right">Credit Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => (
                                            <tr key={course.code} className="border-b border-gray-200">
                                                <td className="p-3">{index + 1}.</td>
                                                <td className="p-3">{course.code}</td>
                                                <td className="p-3">{course.title}</td>
                                                <td className="p-3 text-right">{course.hours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Entry Requirements */}
      <section className="py-20 sm:py-32 bg-[#6C242D] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-[#F9F6EE] absolute -top-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
         <div className="container mx-auto px-4 sm:px-8">
            <h2 className="text-6xl font-black mb-8">Entry Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">SSSCE Candidates</h4>
                        <p>Credit Passes (A-D) in six (6) subjects comprising three core subjects, including English Language and Mathematics, plus three (3) relevant elective subjects.</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">WASSCE Candidates</h4>
                        <p>Credit Passes (A1-C6) in six (6) subjects comprising three core subjects, including English Language and Mathematics, plus three (3) relevant elective subjects.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">GCE Advanced Level Candidates</h4>
                        <p>Passes in three (3) subjects (at least, one of the passes should be Grade D or better). Also, the applicant must have had credit passes (Grade 6) in five GCE Ordinary Level subjects.</p>
                    </div>
                </div>
                 <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">Mature Students' Entry</h4>
                        <p>An applicant must be at least 25 years old, and show proof of age with legitimate documentary. Check our website for more details.</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">International Students</h4>
                        <p>All international qualifications will be referred to the Ghana Tertiary Education Commission (GTEC) for determination of equivalences and eligibility for admission.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">Other Professional Qualifications</h4>
                        <p>ICA, ACCA, CIM may contact us for admission placement.</p>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* How to Apply */}
      <section id="contact" className="py-20 sm:py-32 bg-white relative">
        <div className="container mx-auto px-4 sm:px-8 text-center">
            <div className="bg-[#FDBB30] p-8 sm:p-12 inline-block">
              <h2 className="text-6xl font-black">HOW TO APPLY!</h2>
              <p className="text-xl font-semibold mt-2">FOLLOW THESE STEPS TO JOIN OUR COMMUNITY OF CREATIVE THINKERS</p>
            </div>
            <div className="mt-12 max-w-4xl mx-auto grid sm:grid-cols-2 gap-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">1</div>
                  <p>Admissions will be open for each Academic Year and applying to this programme is free. Check that your qualifications are accepted and your grades meet the entry requirements.</p>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">2</div>
                  <p>Fill and Submit the application form by using our online portal. You will be notified by email within 48 hours when an application is successfully submitted.</p>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">3</div>
                  <p>Each application will be reviewed by the admissions team to select qualified applicants. Successful applicants shall be notified about their admission status when all requirements have been met.</p>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">4</div>
                  <div>
                    <p>You will receive an offer package in your mail with detailed information:</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Offer of Admission Letter</li>
                      <li>Fee Schedule</li>
                    </ul>
                  </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#6C242D] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-white absolute -top-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
        <div className="absolute w-48 h-48 border-4 border-dashed border-[#FDBB30] rounded-full top-20 left-10"></div>
        <div className="absolute w-96 h-96 bg-[#FDBB30] rounded-full -bottom-40 -right-40 opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-8 relative z-10 text-center">
            <h2 className="text-5xl font-black border-4 border-white inline-block p-6">AUCDT CONNECT</h2>
            <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="text-left">
                    <h3 className="text-2xl font-bold">AsanSka University College of Design and Technology</h3>
                    <p className="mt-2 text-lg">Location: Oyibi</p>
                    <p>Opposite Valleyview University</p>
                    <p>Off the Adenta-Dodowa Road</p>
                    <p>Accra Ghana</p>
                </div>
                 <div className="text-left md:text-right">
                    <p className="text-lg font-bold">CONTACT</p>
                    <p>+233 (0) 30 252 7959</p>
                    <p>+233 54 012 4400</p>
                    <p>+233 54 012 4488</p>
                    <p className="mt-4 text-lg font-bold">EMAIL</p>
                    <p>info@aucdt.edu.gh</p>
                    <p>admissions@aucdt.edu.gh</p>
                </div>
            </div>
            <p className="mt-12 text-sm opacity-70">The information contained in this brochure was updated in July 2022.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

```

### FILE: components/AIStudioDashboard.tsx
```typescript

import React, { useState } from 'react';
import { CheckCircle2, Circle, Copy, Play, Pause, RotateCcw, AlertCircle, FileText, Shield, TestTube, BookOpen, CheckSquare, ChevronDown, ChevronRight, Zap, Sun, Moon, Contrast } from './icons';

type Theme = 'light' | 'dark' | 'contrast';

type ThemeClasses = {
  bg: string;
  card: string;
  text: string;
  textSecondary: string;
  hover: string;
  border: string;
  input: string;
  success: string;
  warning: string;
  info: string;
};

type Phase = {
  id: number;
  title: string;
  // Fix: Changed JSX.Element to React.ReactElement to resolve namespace error.
  icon: React.ReactElement;
  items: string[];
  directive: string;
};

interface PhaseCardProps {
  phase: Phase;
  index: number;
  expandedPhase: number | null;
  setExpandedPhase: React.Dispatch<React.SetStateAction<number | null>>;
  phaseStatus: Record<number, boolean>;
  togglePhaseStatus: (phaseId: number) => void;
  agenticMode: boolean;
  currentAgenticPhase: number;
  handleCopy: (text: string, label: string) => void;
  copiedText: string;
  theme: Theme;
  themeClasses: ThemeClasses;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase, 
  index, 
  expandedPhase, 
  setExpandedPhase, 
  phaseStatus, 
  togglePhaseStatus, 
  agenticMode, 
  currentAgenticPhase, 
  handleCopy, 
  copiedText,
  theme,
  themeClasses
}) => {
  const isExpanded = expandedPhase === phase.id;
  const isCompleted = phaseStatus[phase.id];
  const isCurrentAgentic = agenticMode && currentAgenticPhase === index;

  return (
    <div className={`border rounded-lg overflow-hidden transition-all ${
      isCurrentAgentic ? 'ring-2 ring-blue-500 shadow-lg' : ''
    } ${isCompleted ? `${themeClasses.success}` : `${themeClasses.card} border`}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Phase ${phase.id}: ${phase.title}`}
        className={`p-4 cursor-pointer ${themeClasses.hover} transition-colors`}
        onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedPhase(isExpanded ? null : phase.id); } }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePhaseStatus(phase.id);
              }}
              aria-label={isCompleted ? `Mark phase ${phase.id} incomplete` : `Mark phase ${phase.id} complete`}
              aria-pressed={isCompleted}
              className="flex-shrink-0"
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className={`w-6 h-6 ${theme === 'contrast' ? 'text-black' : 'text-gray-400'}`} />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className={theme === 'contrast' ? 'text-black' : ''}>
                {phase.icon}
              </div>
              <div>
                <h3 className={`font-semibold ${themeClasses.text}`}>
                  Phase {phase.id}: {phase.title}
                </h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>{phase.items.length} tasks</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCurrentAgentic && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Active
              </span>
            )}
            <div className={theme === 'contrast' ? 'text-black' : ''}>
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className={`border-t ${themeClasses.border} p-4 ${theme === 'dark' ? 'bg-gray-800' : theme === 'contrast' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
          <div className="mb-4">
            <h4 className={`font-medium ${themeClasses.text} mb-2`}>Tasks:</h4>
            <ul className="space-y-2">
              {phase.items.map((item, idx) => (
                <li key={idx} className={`flex items-start gap-2 text-sm ${themeClasses.textSecondary}`}>
                  <span className={`${theme === 'contrast' ? 'text-black font-bold' : 'text-blue-500'} mt-1`}>•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={`border-t ${themeClasses.border} pt-4 mt-4`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${themeClasses.text}`}>Phase Directive:</h4>
              <button
                onClick={() => handleCopy(phase.directive, `Phase ${phase.id}`)}
                className={`flex items-center gap-2 px-3 py-1 rounded transition-colors text-sm ${
                  theme === 'contrast' 
                    ? 'bg-yellow-400 text-black border-2 border-black font-bold hover:bg-yellow-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copiedText === `Phase ${phase.id}` ? 'Copied!' : 'Copy Directive'}
              </button>
            </div>
            <pre className={`p-3 rounded text-xs overflow-x-auto max-h-64 ${
              theme === 'contrast' 
                ? 'bg-black text-yellow-400 border-4 border-yellow-400' 
                : 'bg-gray-900 text-gray-100'
            }`}>
              {phase.directive}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};


const AIStudioDashboard = () => {
  const [activeTab, setActiveTab] = useState('standard');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [phaseStatus, setPhaseStatus] = useState<Record<number, boolean>>({});
  const [copiedText, setCopiedText] = useState('');
  const [agenticMode, setAgenticMode] = useState(false);
  const [currentAgenticPhase, setCurrentAgenticPhase] = useState(0);
  const [theme, setTheme] = useState<Theme>('light');

  const standardPhases: Phase[] = [
    {
      id: 1,
      title: "Foundation Setup",
      icon: <FileText className="w-5 h-5" />,
      items: [
        "Clean project synchronization - reset to latest stable version",
        "Generate IEEE standard SRS document for current application state",
        "Regenerate primary AI agent component"
      ],
      directive: `EXECUTE PHASE 1 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 1: Foundation Setup
1. Clean project synchronization - reset to latest stable version
2. Generate IEEE standard SRS document for current application state
3. Regenerate primary AI agent component

COMPLETION REQUIREMENTS:
- Confirm SRS document created
- Confirm agent component ready
- State "PHASE 1 COMPLETE - READY FOR PHASE 2"

DO NOT PROCEED TO PHASE 2 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 2,
      title: "Core Implementation",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Implement secure Admin section with configurable password auth",
        "Add comprehensive audit logging for admin actions",
        "Implement full accessibility support (screen readers, keyboard nav)",
        "Add user-selectable themes: Light, Dark, High-contrast accessibility mode"
      ],
      directive: `EXECUTE PHASE 2 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 2: Core Implementation
1. Implement secure Admin section with configurable password auth
2. Add comprehensive audit logging for admin actions
3. Implement full accessibility support (screen readers, keyboard nav)
4. Add user-selectable themes: Light, Dark, High-contrast accessibility mode

COMPLETION REQUIREMENTS:
- Confirm admin security implemented
- Confirm accessibility features added
- State "PHASE 2 COMPLETE - READY FOR PHASE 3"

DO NOT PROCEED TO PHASE 3 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 3,
      title: "Testing Framework",
      icon: <TestTube className="w-5 h-5" />,
      items: [
        "Integrate self-testing capabilities into application",
        "Develop comprehensive Puppeteer test suite for critical user journeys",
        "Create interactive 'Puppeteer Self-Test' tab in frontend",
        "Enable real-time test result display with screenshot capture"
      ],
      directive: `EXECUTE PHASE 3 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 3: Testing Framework
1. Integrate self-testing capabilities into application
2. Develop comprehensive Puppeteer test suite for critical user journeys
3. Create interactive "Puppeteer Self-Test" tab in frontend
4. Enable real-time test result display with screenshot capture

COMPLETION REQUIREMENTS:
- Confirm test framework integrated
- Confirm Puppeteer tests created
- State "PHASE 3 COMPLETE - READY FOR PHASE 4"

DO NOT PROCEED TO PHASE 4 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 4,
      title: "Documentation & Diagrams",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        "Generate System Architecture Diagram (SVG format)",
        "Generate Database Architecture Diagram (SVG format) with tables, columns, relationships",
        "Create Administrator Guide (comprehensive manual)",
        "Create Deployment Guide (step-by-step production deployment)",
        "Create Testing Guide (manual and automated test instructions)"
      ],
      directive: `EXECUTE PHASE 4 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 4: Documentation & Diagrams
1. Generate System Architecture Diagram (SVG format)
2. Generate Database Architecture Diagram (SVG format) with tables, columns, relationships
3. Create Administrator Guide (comprehensive manual)
4. Create Deployment Guide (step-by-step production deployment)
5. Create Testing Guide (manual and automated test instructions)

COMPLETION REQUIREMENTS:
- Confirm all SVG diagrams generated
- Confirm all three guides created
- State "PHASE 4 COMPLETE - READY FOR PHASE 5"

DO NOT PROCEED TO PHASE 5 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 5,
      title: "Final Documentation & Illustration",
      icon: <CheckSquare className="w-5 h-5" />,
      items: [
        "Generate 5 core SVG diagrams (System Architecture, Tech Stack, DFD, Use Case, Sequence)",
        "Update IEEE SRS document with all implemented features",
        "Embed all generated SVG diagrams into the SRS document",
        "Generate 2 simplified board-level presentation SVG diagrams",
        "Create and organize final /docs directory structure with all assets"
      ],
      directive: `EXECUTE PHASE 5 ONLY - FINAL PHASE

## 🚀 PROJECT REFRESH - PHASE 5: Final Documentation & Illustration

Your goal is to complete the final documentation for [PROJECT_NAME]. This involves two main parts: 1) Generating all necessary SVG diagrams and 2) Assembling the final documentation.

---

### 1. 🎨 SVG Diagram Generation

Generate all the following diagrams as self-contained, high-quality SVG code.
* **Style:** Use a clean, professional, and consistent style for all diagrams.
* **Format:** Where appropriate, use Mermaid syntax as the source and render it to SVG.
* **Clarity:** Ensure all components are clearly labeled and all text is legible.

**Diagrams to Generate:**

1.  **High-Level System Architecture:**
    * **Description:** A high-level overview showing the main components.
    * **Components:** Include [e.g., "Web Client (React)", "Mobile App", "API Gateway", "Backend Server (Node.js)", "PostgreSQL Database", "Third-Party APIs (Stripe, Twilio)"].

2.  **Technology Stack Diagram:**
    * **Description:** A visual breakdown of the technologies used.
    * **Categories:** Organize by "Frontend," "Backend," "Database," "DevOps," and "External Services."
    * **Technologies:** Include [e.g., "React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "AWS S3", "Stripe API"].

3.  **Data Flow Diagram (DFD):**
    * **Description:** Show the data flow for a critical user process.
    * **Process:** Map the [e.g., "New User Registration and Authentication"] process.
    * **Entities:** Show data moving between the [e.g., "User", "Web App", "API", "Database", "Email Service"].

4.  **UML Use Case Diagram:**
    * **Description:** Show the main interactions between actors and the system.
    * **Actors:** Include [e.g., "Guest", "Registered User", "Administrator"].
    * **Use Cases:** Include [e.g., "View Item", "Create Account", "Log In", "Make Purchase", "Manage Inventory"].

5.  **UML Sequence Diagram:**
    * **Description:** Detail the sequence of calls for a specific interaction.
    * **Interaction:** Map the [e.g., "User Login"] process.
    * **Lifelines:** Include [e.g., "User", "Browser", "API Gateway", "Auth Service", "Database"].

---

### 2. 📚 Documentation & Assembly

1.  **Update IEEE SRS Document:**
    * Integrate all newly implemented features and final architecture details into the main SRS document.
    * **Embed SVGs:** Embed all 5 diagrams generated in Step 1 into the relevant sections of the SRS document (e.g., embed the System Architecture diagram in the "System Architecture" section).

2.  **Generate Board-Level Presentation Diagrams:**
    * **Simplify:** Create simplified, high-impact versions of the "System Architecture" and "Technology Stack" diagrams. These should be clean, easy to read from a distance, and suitable for a presentation.
    * **Format:** Provide these as separate SVG files.

3.  **Create /docs Directory:**
    * Organize the final documentation into a clean \`/docs\` directory structure.
    * **Structure:**
        \`\`\`
        /docs
        ├── /svg (contains all individual SVG diagram files)
        ├── /presentation (contains the 2 simplified presentation SVGs)
        ├── SRS_[PROJECT_NAME]_Final.md (or .pdf)
        └── README.md
        \`\`\`
4.  **Collate Documents:** Place the updated SRS, the individual SVG files, and the presentation diagrams into the organized \`/docs\` folder.

---

### 3. ✅ Completion Requirements

Confirm completion by performing the following checks and stating the final line.

* Confirm all 5 core SVG diagrams are generated and embedded in the SRS.
* Confirm the 2 simplified presentation SVGs are generated.
* Confirm the final SRS document is fully updated with all features.
* Confirm the \`/docs\` directory is created, organized, and contains all final assets.
* State: "**ALL PHASES COMPLETE - PROJECT REFRESH FINISHED**"
`
    }
  ];

  const hipaaPhases: Phase[] = [
    {
      id: 1,
      title: "Foundation & Compliance Baseline",
      icon: <FileText className="w-5 h-5" />,
      items: [
        "Generate IEEE SRS document with dedicated HIPAA compliance section",
        "Document all PHI data elements",
        "Document PHI storage locations",
        "Reset project to clean HIPAA-compliant baseline",
        "Create initial compliance documentation structure"
      ],
      directive: `EXECUTE HIPAA PHASE 1 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: This application handles Protected Health Information (PHI)
ALL implementations must comply with HIPAA Security Rule requirements

HIPAA PROJECT REFRESH - PHASE 1: Foundation & Compliance Baseline
1. Generate IEEE SRS document with dedicated HIPAA compliance section
2. Document all PHI data elements (what data qualifies as PHI)
3. Document PHI storage locations (databases, files, logs)
4. Reset project to clean HIPAA-compliant baseline
5. Create initial compliance documentation structure

COMPLETION REQUIREMENTS:
- Confirm SRS with HIPAA section created
- Confirm PHI inventory documented
- State "HIPAA PHASE 1 COMPLETE - READY FOR PHASE 2"

DO NOT PROCEED TO PHASE 2 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 2,
      title: "Administrative Safeguards (§164.308)",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Implement role-based access control (Admin, Provider, Staff roles)",
        "Add unique user identification with secure authentication",
        "Implement automatic logout after 15 minutes inactivity",
        "Add emergency access procedures with break-glass logging",
        "Create comprehensive audit logging system",
        "Implement password requirements (12+ chars, complexity, 90-day expiration)"
      ],
      directive: `EXECUTE HIPAA PHASE 2 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 2: Administrative Safeguards (§164.308)
1. Implement role-based access control (Admin, Provider, Staff roles)
2. Add unique user identification with secure authentication
3. Implement automatic logout after 15 minutes inactivity
4. Add emergency access procedures with break-glass logging
5. Create comprehensive audit logging system:
   - Log all PHI access events
   - Log all PHI modifications
   - Log all PHI deletions
   - Log all authentication attempts
   - Log all authorization failures
6. Implement password requirements:
   - Minimum 12 characters
   - Complexity requirements (upper, lower, number, special)
   - 90-day expiration policy
   - Password history (prevent reuse of last 5)

COMPLETION REQUIREMENTS:
- Confirm RBAC implemented and tested
- Confirm audit logging active for all PHI operations
- Confirm automatic logout working
- State "HIPAA PHASE 2 COMPLETE - READY FOR PHASE 3"

DO NOT PROCEED TO PHASE 3 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 3,
      title: "Technical Safeguards (§164.310, §164.312)",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Implement encryption at rest (AES-256 for all PHI storage)",
        "Implement encryption in transit (TLS 1.3 minimum)",
        "Add integrity controls (checksums/hashing for PHI records)",
        "Implement multi-factor authentication (MFA)",
        "Add transmission security (secure API endpoints only)",
        "Create automatic encrypted backup system"
      ],
      directive: `EXECUTE HIPAA PHASE 3 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 3: Technical Safeguards (§164.310, §164.312)
1. Implement encryption at rest (AES-256 for all PHI storage)
2. Implement encryption in transit (TLS 1.3 minimum for all connections)
3. Add integrity controls (checksums/hashing for PHI records)
4. Implement multi-factor authentication (MFA) for administrative access
5. Add transmission security (secure API endpoints only, no unencrypted PHI)
6. Create automatic encrypted backup system:
   - Daily encrypted backups of all PHI
   - Secure offsite backup storage
   - Backup restoration testing procedures

COMPLETION REQUIREMENTS:
- Confirm AES-256 encryption active for stored PHI
- Confirm TLS 1.3 enforced for all data transmission
- Confirm MFA working for admin accounts
- Confirm encrypted backups operational
- State "HIPAA PHASE 3 COMPLETE - READY FOR PHASE 4"

DO NOT PROCEED TO PHASE 4 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 4,
      title: "Privacy & Access Controls",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Implement minimum necessary access principle",
        "Add patient consent tracking and management system",
        "Create authorization/disclosure logging",
        "Implement patient right of access features",
        "Add accounting of disclosures functionality",
        "Create breach notification workflow system"
      ],
      directive: `EXECUTE HIPAA PHASE 4 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 4: Privacy & Access Controls
1. Implement minimum necessary access principle (role-based PHI visibility)
2. Add patient consent tracking and management system
3. Create authorization/disclosure logging (track who accessed what PHI, when, why)
4. Implement patient right of access features:
   - Patient portal to view their own PHI
   - Download PHI in portable format
   - Request corrections to PHI
5. Add accounting of disclosures functionality
6. Create breach notification workflow system with automated alerts

COMPLETION REQUIREMENTS:
- Confirm minimum necessary access enforced
- Confirm patient portal working with access controls
- Confirm disclosure tracking active
- Confirm breach workflow operational
- State "HIPAA PHASE 4 COMPLETE - READY FOR PHASE 5"

DO NOT PROCEED TO PHASE 5 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 5,
      title: "Testing & Technical Documentation",
      icon: <TestTube className="w-5 h-5" />,
      items: [
        "Create HIPAA-specific Puppeteer test suite",
        "Generate Risk Assessment Document",
        "Create HIPAA Security Architecture Diagram (SVG)",
        "Create PHI Data Flow Diagram (SVG)",
        "Generate HIPAA Compliance Checklist",
        "Create Incident Response Plan document",
        "Create Business Associate Agreement (BAA) template"
      ],
      directive: `EXECUTE HIPAA PHASE 5 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 5: Testing & Technical Documentation
1. Create HIPAA-specific Puppeteer test suite covering:
   - Authentication/authorization tests
   - Encryption verification tests (at rest and in transit)
   - Audit log integrity tests
   - Role-based access control tests
   - Session timeout tests
   - MFA functionality tests
2. Generate Risk Assessment Document (HIPAA Security Rule requirement)
3. Create HIPAA Security Architecture Diagram (SVG format)
4. Create PHI Data Flow Diagram (SVG format) showing data lifecycle
5. Generate HIPAA Compliance Checklist (164.308, 164.310, 164.312)
6. Create Incident Response Plan document
7. Create Business Associate Agreement (BAA) template

COMPLETION REQUIREMENTS:
- Confirm all Puppeteer tests passing
- Confirm risk assessment complete
- Confirm all diagrams generated
- Confirm compliance checklist complete
- State "HIPAA PHASE 5 COMPLETE - READY FOR PHASE 6"

DO NOT PROCEED TO PHASE 6 - WAIT FOR EXPLICIT INSTRUCTION`
    },
    {
      id: 6,
      title: "Administrative Documentation & Finalization",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        "Create comprehensive HIPAA Administrator Guide",
        "Create HIPAA Training Guide for staff members",
        "Create Patient Rights Guide",
        "Update deployment guide with HIPAA security requirements",
        "Update final IEEE SRS with all HIPAA features",
        "Embed all SVG diagrams in SRS document",
        "Organize all documents in /docs/hipaa/ directory structure"
      ],
      directive: `EXECUTE HIPAA PHASE 6 ONLY - FINAL PHASE

HIPAA PROJECT REFRESH - PHASE 6: Administrative Documentation & Finalization
1. Create comprehensive HIPAA Administrator Guide including:
   - User access control management procedures
   - Audit log review procedures (monthly review requirements)
   - Breach response procedures (step-by-step)
   - Backup and disaster recovery procedures
   - System maintenance procedures
2. Create HIPAA Training Guide for staff members
3. Create Patient Rights Guide (notice of privacy practices)
4. Update deployment guide with HIPAA security requirements
5. Update final IEEE SRS with all implemented HIPAA features
6. Embed all SVG diagrams in SRS document
7. Organize all documents in /docs/hipaa/ directory structure:
   - /docs/hipaa/compliance/
   - /docs/hipaa/policies/
   - /docs/hipaa/training/
   - /docs/hipaa/technical/

FINAL COMPLIANCE VERIFICATION:
✓ Confirm encryption implemented for all PHI (at rest and in transit)
✓ Confirm comprehensive audit logging active and tested
✓ Confirm MFA implemented for administrative access
✓ Confirm automatic session timeout working (15 minutes)
✓ Confirm role-based access control enforced
✓ Confirm all HIPAA documentation complete and organized
✓ Confirm all test suites passing
✓ Confirm patient access portal functional

STATE "HIPAA COMPLIANCE REFRESH COMPLETE - ALL 6 PHASES FINISHED" when complete

This is the final phase - complete all tasks and perform final verification.`
    }
  ];

  const bulletproofDirective = `CRITICAL: EXECUTE ALL ITEMS BELOW - USE THIS CHECKLIST APPROACH

PROJECT REFRESH CHECKLIST - CONFIRM EACH ITEM:

☐ 1. FOUNDATION
   - Generate IEEE SRS document for current state
   - Reset project to clean baseline

☐ 2. SECURITY & ACCESSIBILITY  
   - Implement password-protected Admin section
   - Add audit logging for admin actions
   - Add full accessibility support + themes (Light/Dark/High-contrast)

☐ 3. TESTING
   - Integrate self-testing capabilities
   - Create Puppeteer test suite
   - Add interactive test tab with screenshot capture

☐ 4. DOCUMENTATION
   - Generate System Architecture SVG
   - Generate Database Architecture SVG  
   - Create Admin Guide, Deployment Guide, Testing Guide

☐ 5. FINALIZATION
   - Update final SRS with all features
   - Embed diagrams in SRS
   - Organize all files in /docs directory

EXECUTION PROTOCOL:
- Work through checklist in order
- Confirm each ☐ item completion with ✅
- If any item fails, stop and report issue
- Only proceed when current item is ✅ complete

BEGIN EXECUTION NOW`;

  const minimalDirective = `SIMPLE PROJECT REFRESH - EXECUTE ALL:

1. Update SRS document to current application state
2. Refresh admin security + accessibility features  
3. Update system architecture diagram (SVG)
4. Update database diagram (SVG)
5. Refresh admin/deployment guides
6. Organize everything in /docs folder

CONFIRM COMPLETION OF ALL 6 ITEMS`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const togglePhaseStatus = (phaseId: number) => {
    setPhaseStatus(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const resetAllPhases = () => {
    setPhaseStatus({});
    setCurrentAgenticPhase(0);
    setAgenticMode(false);
  };

  const getCompletionRate = (phases: Phase[]) => {
    if (phases.length === 0) return 0;
    const completedCount = Object.keys(phaseStatus).filter(id => {
        const phaseExists = phases.some(p => p.id === Number(id));
        return phaseExists && phaseStatus[Number(id)];
    }).length;
    return Math.round((completedCount / phases.length) * 100);
  };

  const startAgenticMode = () => {
    setAgenticMode(true);
    setCurrentAgenticPhase(0);
    setPhaseStatus({});
  };

  const advanceAgenticPhase = () => {
    const phases = activeTab === 'standard' ? standardPhases : hipaaPhases;
    if (currentAgenticPhase < phases.length - 1) {
      setPhaseStatus(prev => ({
        ...prev,
        [phases[currentAgenticPhase].id]: true
      }));
      setCurrentAgenticPhase(prev => prev + 1);
    } else {
      setPhaseStatus(prev => ({
        ...prev,
        [phases[currentAgenticPhase].id]: true
      }));
      setAgenticMode(false);
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeClasses = (): ThemeClasses => {
    switch(theme) {
      case 'dark':
        return {
          bg: 'bg-gray-900',
          card: 'bg-gray-800 border-gray-700',
          text: 'text-gray-100',
          textSecondary: 'text-gray-400',
          hover: 'hover:bg-gray-700',
          border: 'border-gray-700',
          input: 'bg-gray-700 text-gray-100',
          success: 'bg-green-900 bg-opacity-30 border-green-700',
          warning: 'bg-amber-900 bg-opacity-30 border-amber-700',
          info: 'bg-blue-900 bg-opacity-30 border-blue-700'
        };
      case 'contrast':
        return {
          bg: 'bg-black',
          card: 'bg-white border-4 border-yellow-400',
          text: 'text-black',
          textSecondary: 'text-gray-900',
          hover: 'hover:bg-yellow-100',
          border: 'border-yellow-400',
          input: 'bg-white text-black border-4 border-yellow-400',
          success: 'bg-yellow-200 border-4 border-green-600',
          warning: 'bg-yellow-200 border-4 border-orange-600',
          info: 'bg-yellow-200 border-4 border-blue-600'
        };
      default: // light
        return {
          bg: 'bg-gradient-to-br from-slate-50 to-blue-50',
          card: 'bg-white/70 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          hover: 'hover:bg-gray-50/50',
          border: 'border-gray-200',
          input: 'bg-white text-gray-900',
          success: 'bg-green-50 border-green-300',
          warning: 'bg-amber-50 border-amber-200',
          info: 'bg-blue-50 border-blue-200'
        };
    }
  };

  const getThemeIcon = () => {
    switch(theme) {
      case 'dark': return <Moon className="w-5 h-5" />;
      case 'contrast': return <Contrast className="w-5 h-5" />;
      default: return <Sun className="w-5 h-5" />;
    }
  };
  
  const themeClasses = getThemeClasses();
  const currentPhases = activeTab === 'standard' ? standardPhases : hipaaPhases;
  const completionRate = getCompletionRate(currentPhases);

  return (
    <div className={`min-h-screen ${themeClasses.bg} p-4 sm:p-6 font-sans`} role="main" aria-label="AI Studio Project Refresh Dashboard">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${themeClasses.card} rounded-xl shadow-lg p-6 mb-6 border`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${themeClasses.text} mb-2`}>
                AI Studio Project Refresh Dashboard
              </h1>
              <p className={themeClasses.textSecondary}>
                Sequential phase execution prevents context truncation • 95%+ success rate
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
              <button
                onClick={cycleTheme}
                aria-label={`Switch theme (current: ${theme})`}
                className={`p-3 rounded-lg transition-all ${
                  theme === 'contrast'
                    ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
                title={`Current theme: ${theme}`}
              >
                {getThemeIcon()}
              </button>
              <div className="text-right">
                <div className={`text-3xl font-bold ${theme === 'contrast' ? 'text-black' : 'text-blue-600'}`}>
                  {completionRate}%
                </div>
                <div className={`text-sm ${themeClasses.textSecondary}`}>Complete</div>
              </div>
            </div>
          </div>
          
          <div className={`w-full rounded-full h-3 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : theme === 'contrast' ? 'bg-black border-2 border-yellow-400' : 'bg-gray-200'}`}>
            <div 
              className={`h-full transition-all duration-500 ${
                theme === 'contrast' 
                  ? 'bg-yellow-400' 
                  : 'bg-gradient-to-r from-blue-500 to-green-500'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Agentic Controls */}
        <div className={`rounded-xl shadow-lg p-6 mb-6 ${
          theme === 'contrast'
            ? 'bg-yellow-400 text-black border-4 border-black'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 flex-shrink-0" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-bold">Agentic Workflow Mode</h2>
                <p className={`text-sm ${theme === 'contrast' ? 'text-gray-900' : 'text-blue-100'}`}>
                  Automated sequential phase execution
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {!agenticMode ? (
                <button
                  onClick={startAgenticMode}
                  aria-label="Start agentic workflow mode"
                  className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors font-semibold ${
                    theme === 'contrast'
                      ? 'bg-black text-yellow-400 border-2 border-black hover:bg-gray-900'
                      : 'bg-white text-purple-600 hover:bg-gray-100'
                  }`}
                >
                  <Play className="w-5 h-5" aria-hidden="true" />
                  Start
                </button>
              ) : (
                <>
                  <button
                    onClick={advanceAgenticPhase}
                    aria-label="Advance to next phase"
                    className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors font-semibold ${
                      theme === 'contrast'
                        ? 'bg-black text-yellow-400 border-2 border-black hover:bg-gray-900'
                        : 'bg-white text-purple-600 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setAgenticMode(false)}
                    aria-label="Pause agentic workflow"
                    className={`p-2 sm:p-3 rounded-lg transition-colors ${
                      theme === 'contrast'
                        ? 'bg-black text-yellow-400 border-2 border-black hover:bg-gray-900'
                        : 'bg-purple-700 text-white hover:bg-purple-800'
                    }`}
                  >
                    <Pause className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}
              <button
                onClick={resetAllPhases}
                aria-label="Reset all phases"
                className={`p-2 sm:p-3 rounded-lg transition-colors ${
                  theme === 'contrast'
                    ? 'bg-black text-yellow-400 border-2 border-black hover:bg-gray-900'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                }`}
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          {agenticMode && (
            <div className={`mt-4 p-4 rounded-lg ${
              theme === 'contrast'
                ? 'bg-black text-yellow-400'
                : 'bg-purple-700 bg-opacity-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Current Phase: {currentAgenticPhase + 1} of {currentPhases.length}</span>
              </div>
              <p className={`text-sm ${theme === 'contrast' ? 'text-yellow-300' : 'text-blue-100'}`}>
                Copy the directive below, execute in AI Studio, then click "Next" when complete.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="w-full overflow-x-auto">
            <div className={`${themeClasses.card} rounded-xl shadow-lg mb-6 border min-w-max`}>
              <div role="tablist" aria-label="Dashboard view" className={`flex border-b ${themeClasses.border}`}>
                <button
                  role="tab"
                  aria-selected={activeTab === 'standard'}
                  onClick={() => setActiveTab('standard')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'standard'
                      ? theme === 'contrast'
                        ? 'text-black border-b-4 border-yellow-400 bg-yellow-100'
                        : 'text-blue-600 border-b-2 border-blue-600'
                      : `${themeClasses.textSecondary} ${themeClasses.hover}`
                  }`}
                >
                  Standard Refresh
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'hipaa'}
                  onClick={() => setActiveTab('hipaa')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'hipaa'
                      ? theme === 'contrast'
                        ? 'text-black border-b-4 border-yellow-400 bg-yellow-100'
                        : 'text-blue-600 border-b-2 border-blue-600'
                      : `${themeClasses.textSecondary} ${themeClasses.hover}`
                  }`}
                >
                  HIPAA Compliant
                </button>
                <button
                  onClick={() => setActiveTab('quick')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'quick'
                      ? theme === 'contrast'
                        ? 'text-black border-b-4 border-yellow-400 bg-yellow-100'
                        : 'text-blue-600 border-b-2 border-blue-600'
                      : `${themeClasses.textSecondary} ${themeClasses.hover}`
                  }`}
                >
                  Quick Options
                </button>
              </div>
            </div>
        </div>


        {/* Content */}
        {activeTab !== 'quick' ? (
          <div className="space-y-4">
            {currentPhases.map((phase, index) => (
              <PhaseCard 
                key={phase.id} 
                phase={phase} 
                index={index} 
                expandedPhase={expandedPhase}
                setExpandedPhase={setExpandedPhase}
                phaseStatus={phaseStatus}
                togglePhaseStatus={togglePhaseStatus}
                agenticMode={agenticMode}
                currentAgenticPhase={currentAgenticPhase}
                handleCopy={handleCopy}
                copiedText={copiedText}
                theme={theme}
                themeClasses={themeClasses}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`${themeClasses.card} rounded-lg shadow-lg p-6 border`}>
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>Bulletproof Single Directive</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Use when you need a single comprehensive directive with checklist format
              </p>
              <button
                onClick={() => handleCopy(bulletproofDirective, 'Bulletproof')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors mb-4 ${
                  theme === 'contrast'
                    ? 'bg-yellow-400 text-black border-2 border-black font-bold hover:bg-yellow-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'Bulletproof' ? 'Copied!' : 'Copy Directive'}
              </button>
              <pre className={`p-4 rounded text-xs overflow-x-auto max-h-96 ${
                theme === 'contrast'
                  ? 'bg-black text-yellow-400 border-4 border-yellow-400'
                  : 'bg-gray-900 text-gray-100'
              }`}>
                {bulletproofDirective}
              </pre>
            </div>

            <div className={`${themeClasses.card} rounded-lg shadow-lg p-6 border`}>
              <h3 className={`text-xl font-bold ${themeClasses.text} mb-4`}>Minimal Refresh Directive</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Emergency option - covers essentials only for quick refreshes
              </p>
              <button
                onClick={() => handleCopy(minimalDirective, 'Minimal')}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors mb-4 ${
                  theme === 'contrast'
                    ? 'bg-yellow-400 text-black border-2 border-black font-bold hover:bg-yellow-300'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Copy className="w-4 h-4" />
                {copiedText === 'Minimal' ? 'Copied!' : 'Copy Directive'}
              </button>
              <pre className={`p-4 rounded text-xs overflow-x-auto ${
                theme === 'contrast'
                  ? 'bg-black text-yellow-400 border-4 border-yellow-400'
                  : 'bg-gray-900 text-gray-100'
              }`}>
                {minimalDirective}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className={`mt-6 ${themeClasses.warning} border rounded-lg p-6`}>
          <h3 className={`font-bold ${theme === 'contrast' ? 'text-black' : theme === 'dark' ? 'text-amber-200' : 'text-amber-900'} mb-3 flex items-center gap-2`}>
            <AlertCircle className="w-5 h-5" />
            Usage Instructions
          </h3>
          <div className={`space-y-3 ${theme === 'contrast' ? 'text-black' : theme === 'dark' ? 'text-amber-100' : 'text-amber-900'}`}>
            <div>
              <h4 className="font-semibold mb-1">Sequential Phase Method (Recommended):</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm ml-4">
                <li>Click "Copy Directive" for Phase 1</li>
                <li>Paste into AI Studio and execute</li>
                <li>Wait for "PHASE X COMPLETE" confirmation</li>
                <li>Mark phase complete using the checkbox</li>
                <li>Proceed to next phase</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Agentic Mode:</h4>
              <p className="text-sm ml-4">
                Click "Start" for automated workflow tracking. The system will highlight 
                the current active phase and guide you through sequential execution.
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className={`mt-6 ${themeClasses.info} border rounded-lg p-6`}>
          <h3 className={`font-bold ${theme === 'contrast' ? 'text-black' : theme === 'dark' ? 'text-blue-200' : 'text-blue-900'} mb-3`}>💡 Pro Tips</h3>
          <ul className={`space-y-2 text-sm ${theme === 'contrast' ? 'text-black' : theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
            <li className="flex items-start gap-2">
              <span className={`${theme === 'contrast' ? 'text-black font-bold' : 'text-blue-500'} mt-1`}>•</span>
              <span>If a phase gets truncated, simply re-paste that specific phase directive.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={`${theme === 'contrast' ? 'text-black font-bold' : 'text-blue-500'} mt-1`}>•</span>
              <span>Sequential approach prevents context buffer overflow issues.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={`${theme === 'contrast' ? 'text-black font-bold' : 'text-blue-500'} mt-1`}>•</span>
              <span>Use HIPAA mode for healthcare applications requiring PHI compliance.</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className={`mt-6 text-center ${themeClasses.textSecondary} text-sm`}>
          <p>AI Studio Project Management Dashboard v2.0</p>
          <p className="mt-1">Designed for reliable sequential execution • No more truncated directives</p>
        </div>
      </div>
    </div>
  );
};

export default AIStudioDashboard;

```

### FILE: components/icons.tsx
```typescript

import React from 'react';

type IconProps = {
  className?: string;
};

export const CheckCircle2: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export const Circle: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

export const Copy: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>
);

export const Play: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

export const Pause: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="4" height="16" x="6" y="4"/>
    <rect width="4" height="16" x="14" y="4"/>
  </svg>
);

export const RotateCcw: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

export const AlertCircle: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

export const FileText: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

export const Shield: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export const TestTube: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h-3c-1.4 0-2.5-1.1-2.5-2.5V2"/>
        <path d="M8.5 2h7"/>
        <path d="M14.5 16h-5"/>
    </svg>
);

export const BookOpen: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

export const CheckSquare: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 11 12 14 22 4"/>
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
  </svg>
);

export const ChevronDown: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export const ChevronRight: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export const Zap: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

export const Sun: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
    </svg>
);

export const Moon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

export const Contrast: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 18a6 6 0 0 0 0-12v12z" />
  </svg>
);

```

### FILE: CREATION.md
```md
# asanska-fashion-design-brochure

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
# Admin Guide — asanska-university-college---fashion-design-brochure

**Application:** asanska-university-college---fashion-design-brochure
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

Audit log data is stored in `localStorage` under the key `tuc_asanska-university-college---fashion-design-brochure_audit`.

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
# Deployment Guide — asanska-university-college---fashion-design-brochure

**Application:** asanska-university-college---fashion-design-brochure
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd asanska-university-college---fashion-design-brochure
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
docker-compose -f docker-compose-all-apps.yml build asanska-university-college---fashion-design-brochure
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up asanska-university-college---fashion-design-brochure
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

**Project:** Asanska University College   Fashion Design Brochure
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Asanska University College   Fashion Design Brochure**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Asanska University College   Fashion Design Brochure** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Asanska University College   Fashion Design Brochure** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| TUC branding applied | âŒ Non-compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
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
# Testing Guide — asanska-university-college---fashion-design-brochure

**Application:** asanska-university-college---fashion-design-brochure
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd asanska-university-college---fashion-design-brochure
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
    <meta property="og:title" content="Asanska University College of Design and Technology" />
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
    <meta name="twitter:title" content="Asanska University College of Design and Technology" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Asanska University College of Design and Technology</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
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
  "name": "Asanska University College - Fashion Design Brochure",
  "description": "A dynamic academic brochure for the Fashion Design programme at Asanska University College of Design and Technology, designed from the official branding guidelines."
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
  "name": "asanska-university-college---fashion-design-brochure",
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
    "react-dom": "19.2.5",
    "react": "19.2.5"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
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

View your app in AI Studio: https://ai.studio/apps/drive/1aXYed00Tszivh-nhm148_1pX93CkGO-E

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — asanska-university-college---fashion-design-brochure
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('asanska-university-college---fashion-design-brochure E2E', () => {
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

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
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

// Vitest unit test configuration — asanska-university-college---fashion-design-brochure
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

// Vitest E2E configuration — asanska-university-college---fashion-design-brochure
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

### FILE: _tmp_50852_b3e1900176664c04996c9724588f72f5
```text

```

