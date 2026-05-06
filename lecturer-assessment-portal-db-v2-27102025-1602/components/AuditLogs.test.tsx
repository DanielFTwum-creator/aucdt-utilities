import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AuditLogs from './AuditLogs';
import { AuditLog } from '../types';

describe('AuditLogs component', () => {
    it('should display a message when there are no logs', () => {
        render(<AuditLogs logs={[]} />);
        expect(screen.getByText('No activity recorded yet.')).toBeInTheDocument();
    });

    it('should display a list of logs correctly', () => {
        const mockLogs: AuditLog[] = [
            {
                id: 'log_1',
                timestamp: new Date().toISOString(),
                event: 'Curriculum Update',
                status: 'Success',
                details: 'Updated from timetable.pdf',
            },
            {
                id: 'log_2',
                timestamp: new Date().toISOString(),
                event: 'New Evaluation',
                status: 'Info',
                details: 'Assessment submitted for Dr. Jane Doe.',
            },
        ];

        render(<AuditLogs logs={mockLogs} />);
        
        expect(screen.getByText('Curriculum Update')).toBeInTheDocument();
        expect(screen.getByText('Updated from timetable.pdf')).toBeInTheDocument();
        expect(screen.getByText('New Evaluation')).toBeInTheDocument();
        expect(screen.getByText('Assessment submitted for Dr. Jane Doe.')).toBeInTheDocument();
        expect(screen.queryByText('No activity recorded yet.')).not.toBeInTheDocument();
    });
});