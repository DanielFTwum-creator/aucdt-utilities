import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// FIX: Changed default import to named import.
import { LecturerAssessmentForm } from './LecturerAssessmentForm';
import { programmes, lecturers, courses } from '../constants';
import { assessmentSections, AssessmentSectionTitle } from '../types';

// FIX: Replaced 'global' with 'globalThis' for cross-environment compatibility.
const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>;

describe('LecturerAssessmentForm', () => {
    const onSubmissionSuccessMock = vi.fn();

    beforeEach(() => {
        onSubmissionSuccessMock.mockClear();
        mockFetch.mockClear();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const renderComponent = () => render(
        <LecturerAssessmentForm 
            programmes={programmes}
            lecturers={lecturers}
            courses={courses}
            onSubmissionSuccess={onSubmissionSuccessMock}
        />
    );

    const completeSection = async (user: ReturnType<typeof userEvent.setup>, sectionTitle: AssessmentSectionTitle) => {
        const questionKeys = assessmentSections[sectionTitle];
        for (const key of questionKeys) {
            // Find the radio group for the current question and click the 'Agree' (4) option
            const allAgreeRadios = screen.getAllByRole('radio', { name: 'Agree' });
            const targetRadio = allAgreeRadios.find(r => (r as HTMLInputElement).name === `question_${key}`);
            if (targetRadio) {
                await user.click(targetRadio);
            } else {
                throw new Error(`Could not find 'Agree' radio for question ${key}`);
            }
        }
    };
    
    const completeForm = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.selectOptions(screen.getByLabelText(/Programme/i), 'dmcd_btech');
        await user.selectOptions(screen.getByLabelText(/Subject\/Course/i), 'aucdt_115'); // Dr. Addo
        await user.selectOptions(screen.getByLabelText(/Semester/i), '1');
        
        for (const sectionTitle of Object.keys(assessmentSections) as AssessmentSectionTitle[]) {
            const sectionButton = screen.getByRole('button', { name: new RegExp(sectionTitle.replace(/Section \d: /g, ''), 'i') });
            if(sectionButton.getAttribute('aria-expanded') === 'false') {
                 await user.click(sectionButton);
            }
            await completeSection(user, sectionTitle);
        }
    };

    it('should submit evaluation to backend and show success screen', async () => {
        const user = userEvent.setup();
        renderComponent();
        
        mockFetch.mockResolvedValueOnce({ ok: true, status: 201 });
    
        await completeForm(user);
        
        const submitButton = screen.getByRole('button', { name: /Submit Assessment/i });
        await user.click(submitButton);
    
        // Check that fetch was called correctly
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('/api/v1/evaluations', expect.any(Object));
        });

        // Check that onSubmissionSuccess was called
        expect(onSubmissionSuccessMock).toHaveBeenCalledTimes(1);

        // Check that the success screen is shown
        expect(await screen.findByText(/Assessment Submitted Successfully!/i)).toBeInTheDocument();
        expect(screen.getByText(/Thank you for your valuable feedback. Your submission has been recorded./i)).toBeInTheDocument();
    });

    it('should prevent submission if required fields are empty', async () => {
        const user = userEvent.setup();
        renderComponent();

        const submitButton = screen.getByRole('button', { name: /Submit Assessment/i });
        await user.click(submitButton);

        expect(window.alert).toHaveBeenCalledWith('Please select a programme.');
        expect(onSubmissionSuccessMock).not.toHaveBeenCalled();
    });
    
    it('should prevent submission if not all sections are completed', async () => {
        const user = userEvent.setup();
        renderComponent();

        // Fill selects but not ratings
        await user.selectOptions(screen.getByLabelText(/Programme/i), 'dmcd_btech');
        await user.selectOptions(screen.getByLabelText(/Subject\/Course/i), 'aucdt_115');
        
        const submitButton = screen.getByRole('button', { name: /Submit Assessment/i });
        await user.click(submitButton);

        expect(window.alert).toHaveBeenCalledWith('Please complete all feedback sections before submitting.');
        expect(onSubmissionSuccessMock).not.toHaveBeenCalled();
    });

    it('should unlock the next section after the current one is completed', async () => {
        const user = userEvent.setup();
        renderComponent();
        
        const section1Button = screen.getByRole('button', { name: /Lecturer's Delivery & Knowledge/i });
        const section2Button = screen.getByRole('button', { name: /Course Content & Structure/i });

        expect(section2Button).toBeDisabled();

        // Complete section 1
        await user.click(section1Button);
        await completeSection(user, 'Section 1: Lecturer\'s Delivery & Knowledge');
        
        await waitFor(() => {
            expect(section2Button).toBeEnabled();
        });
    });
});