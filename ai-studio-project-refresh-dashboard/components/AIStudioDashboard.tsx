
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
      title: "Final Documentation",
      icon: <CheckSquare className="w-5 h-5" />,
      items: [
        "Update IEEE SRS document with all implemented features",
        "Embed SVG diagrams directly in SRS document",
        "Generate board-level presentation SVG diagrams (data flow, tech stack)",
        "Create /docs directory structure",
        "Collate all documents into organized /docs folder"
      ],
      directive: `EXECUTE PHASE 5 ONLY - FINAL PHASE

PROJECT REFRESH - PHASE 5: Final Documentation
1. Update IEEE SRS document with all implemented features
2. Embed SVG diagrams directly in SRS document
3. Generate board-level presentation SVG diagrams (data flow, tech stack)
4. Create /docs directory structure
5. Collate all documents into organized /docs folder

COMPLETION REQUIREMENTS:
- Confirm final SRS document updated
- Confirm /docs directory organized
- State "ALL PHASES COMPLETE - PROJECT REFRESH FINISHED"

This is the final phase - complete all tasks.`
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
                  role="tab"
                  aria-selected={activeTab === 'quick'}
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
