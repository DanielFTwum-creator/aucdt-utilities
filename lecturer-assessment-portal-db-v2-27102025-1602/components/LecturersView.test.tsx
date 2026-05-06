import React from 'react';
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LecturersView from './LecturersView';
import { programmes, lecturers, courses, sampleEvaluations } from '../constants';
import { useEvaluations } from '../hooks/useEvaluations';

// Mock the LecturerDetailView to test navigation
vi.mock('./LecturerDetailView', () => ({
    default: ({ lecturerId, onBack }: { lecturerId: string; onBack: () => void; }) => (
        <div>
            <h2>Lecturer Detail for {lecturerId}</h2>
            <button onClick={onBack}>Back</button>
        </div>
    ),
}));

const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));
const mockSummaries = result.current.lecturerSummary;

describe('LecturersView component', () => {
    const renderComponent = () => render(
        <LecturersView 
            summaries={mockSummaries} 
            programmes={programmes}
            evaluations={sampleEvaluations}
            courses={courses}
        />
    );

    it('should render the table with all lecturers', () => {
        renderComponent();
        const rows = screen.getAllByRole('row');
        // Header row + all lecturers from constants.ts
        expect(rows.length).toBe(lecturers.length + 1);
        expect(screen.getByText('Mr. Ahiabu')).toBeInTheDocument();
        expect(screen.getByText('Dr. Addo')).toBeInTheDocument();
    });

    it('should filter lecturers by name', async () => {
        const user = userEvent.setup();
        renderComponent();
        
        const searchInput = screen.getByPlaceholderText(/Search by lecturer name/i);
        await user.type(searchInput, 'ahiabu');

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(2); // Header + 1 data row
        expect(screen.getByText('Mr. Ahiabu')).toBeInTheDocument();
        expect(screen.queryByText('Dr. Addo')).not.toBeInTheDocument();
    });

    it('should filter lecturers by programme', async () => {
        const user = userEvent.setup();
        renderComponent();
        
        const programmeSelect = screen.getByRole('combobox');
        // jdt_ba (B.A. Jewellery Design Technology) has an evaluation for Dr. Addo
        await user.selectOptions(programmeSelect, 'jdt_ba');

        // Check that only lecturers teaching in jdt_ba are shown
        expect(screen.getByText('Dr. Addo')).toBeInTheDocument();
        expect(screen.queryByText('Mr. Ahiabu')).not.toBeInTheDocument(); // Ahiabu teaches in dmcd_btech
    });

    it('should sort by lecturer last name (ascending)', async () => {
        const user = userEvent.setup();
        renderComponent();

        const nameHeader = screen.getByRole('button', { name: /Lecturer/i });
        // First click on name should sort by name (asc).
        await user.click(nameHeader);
        
        const rows = screen.getAllByRole('row');
        // Expected order: Addo, Adjacodjoe, Agbosu, etc.
        expect(rows[1]).toHaveTextContent('Dr. Addo');
        expect(rows[2]).toHaveTextContent('Mr. Adjacodjoe');
        expect(rows[3]).toHaveTextContent('Mr. Agbosu');
    });

    it('should navigate to the detail view on row click', async () => {
        const user = userEvent.setup();
        renderComponent();
        
        const ahiabuRow = screen.getByText('Mr. Ahiabu').closest('tr');
        expect(ahiabuRow).toBeInTheDocument();
        
        if (ahiabuRow) {
            await user.click(ahiabuRow);
        }

        expect(await screen.findByRole('heading', { name: /Lecturer Detail for ahiabu/i })).toBeInTheDocument();
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should navigate back from the detail view', async () => {
        const user = userEvent.setup();
        renderComponent();

        // Navigate to detail view first
        const ahiabuRow = screen.getByText('Mr. Ahiabu').closest('tr');
        if (ahiabuRow) await user.click(ahiabuRow);
        expect(await screen.findByRole('heading', { name: /Lecturer Detail for ahiabu/i })).toBeInTheDocument();

        // Navigate back
        const backButton = screen.getByRole('button', { name: /Back/i });
        await user.click(backButton);

        expect(await screen.findByRole('table')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Lecturer Detail for ahiabu/i })).not.toBeInTheDocument();
    });
});