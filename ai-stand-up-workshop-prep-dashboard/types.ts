export type TabId = 'overview' | 'status' | 'workshop' | 'concepts' | 'admin' | 'selftest';
export type TeamMemberId = 'daniel' | 'mandela' | 'jerry';
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface Tab {
    id: TabId;
    label: string;
}

export interface TeamMember {
    id: TeamMemberId;
    name: string;
    update: string;
    blocker: {
        text: string;
        isCritical: boolean;
    };
    quote?: string;
}

export interface TechConcept {
    title: string;
    description: string;
}

export interface AuditLog {
    timestamp: string;
    action: string;
}

export interface AppContextState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    auditLogs: AuditLog[];
    addAuditLog: (action: string) => void;
    activeTab: TabId;
    setActiveTab: (tabId: TabId) => void;
}

// Types for Self-Testing Framework
export type TestStatus = 'pending' | 'running' | 'pass' | 'fail';

export interface TestStep {
    description: string;
    action: () => Promise<boolean>;
}

export interface TestSuite {
    id: string;
    title: string;
    steps: TestStep[];
}

export interface TestResult {
    suiteId: string;
    title: string;
    status: TestStatus;
    stepResults: {
        description: string;
        status: TestStatus;
        log: string;
    }[];
}