import { apiUrl } from './apiBase';

type AuditAction =
    | 'ADMIN_LOGIN_SUCCESS'
    | 'ADMIN_LOGIN_FAILURE'
    | 'ADMIN_LOGOUT'
    | 'STUDENT_LOGIN_SUCCESS'
    | 'STUDENT_SIGNUP_SUCCESS'
    | 'STUDENT_LOGOUT'
    | 'EXAM_QUESTIONS_GENERATED'
    | 'EXAM_SAVED'
    | 'EXAM_STARTED'
    | 'EXAM_SUBMITTED';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuditDetails = Record<string, any>;

export const logEvent = async (action: AuditAction, details: AuditDetails = {}): Promise<void> => {
    try {
        const token = sessionStorage.getItem('msee_auth_token');
        if (!token) {
            // Can't log if user is not authenticated
            console.log(`Audit Log (unauthenticated): ${action}`, details);
            return;
        }

        await fetch(apiUrl('/api/logs'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ action, details }),
        });

    } catch (error) {
        console.error("Failed to write to audit log via backend:", error);
    }
};