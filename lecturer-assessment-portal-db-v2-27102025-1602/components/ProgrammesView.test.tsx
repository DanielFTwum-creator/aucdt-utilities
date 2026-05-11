import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ProgrammesView from './ProgrammesView';
import { ProgrammeAnalytics } from '../types';

const mockAnalytics: ProgrammeAnalytics[] = [
    { id: 'bscs', name: 'Computer Science', lecturerCount: 3, courseCount: 3, evaluationCount: 100, avgRating: '4.5', recommendationRate: '90.0' },
    { id: 'dmcd', name: 'Digital Media', lecturerCount: 2, courseCount: 2, evaluationCount: 150, avgRating: '4.8', recommendationRate: '98.0' },
    { id: 'bsit', name: 'Information Technology', lecturerCount: 2, courseCount: 2, evaluationCount: 80, avgRating: '4.2', recommendationRate: '85.0' },
];

describe('ProgrammesView component', () => {
    it('should render the table with all programmes', () => {
        render(<ProgrammesView programmeAnalytics={mockAnalytics} />);
        
        const rows = screen.getAllByRole('row');
        // Header + 3 data rows
        expect(rows).toHaveLength(4);
        expect(screen.getByText('Computer Science')).toBeInTheDocument();
        expect(screen.getByText('Digital Media')).toBeInTheDocument();
    });

    it('should display an empty state message when no data is provided', () => {
        render(<ProgrammesView programmeAnalytics={[]} />);
        expect(screen.getByText(/No Programme Data Available/i)).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
    
    it('should sort programmes by evaluation count (ascending)', async () => {
        const user = userEvent.setup();
        render(<ProgrammesView programmeAnalytics={mockAnalytics} />);

        const evaluationsHeader = screen.getByRole('button', { name: /Evaluations/i });
        
        // Default sort is evaluationCount descending.
        // One click should make it ascending.
        await user.click(evaluationsHeader);
        
        const rows = screen.getAllByRole('row');
        // Expected order by evaluation count: bsit (80), bscs (100), dmcd (150)
        expect(rows[1]).toHaveTextContent('Information Technology');
        expect(rows[2]).toHaveTextContent('Computer Science');
        expect(rows[3]).toHaveTextContent('Digital Media');
    });

    it('should sort programmes by recommendation rate (descending)', async () => {
        const user = userEvent.setup();
        render(<ProgrammesView programmeAnalytics={mockAnalytics} />);

        const recommendationHeader = screen.getByRole('button', { name: /Recommendation/i });
        
        // First click makes it descending
        await user.click(recommendationHeader);
        
        const rows = screen.getAllByRole('row');
        // Expected order by recommendation rate: dmcd (98), bscs (90), bsit (85)
        expect(rows[1]).toHaveTextContent('Digital Media');
        expect(rows[2]).toHaveTextContent('Computer Science');
        expect(rows[3]).toHaveTextContent('Information Technology');
    });
});