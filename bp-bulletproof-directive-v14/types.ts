export type Status = 'In Progress' | 'Complete' | 'Blocked';

export interface Task {
    id: string;
    title: string;
    status: Status;
}

export interface Phase {
    id: number;
    title: string;
    description: string;
    tasks: Task[];
    deliverables: string[];
    directive: string;
    status: Status;
}

export interface Framework {
    id: string;
    title: string;
    phases: Phase[];
}

export interface ToastMessage {
    message: string;
    type: 'success' | 'error';
    action?: {
        label: string;
        onClick: () => void;
    };
}

export interface AuditLog {
    id: string;
    timestamp: number;
    action: string;
    user: string;
    details?: string;
}
