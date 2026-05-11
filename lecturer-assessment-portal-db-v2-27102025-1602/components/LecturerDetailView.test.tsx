import React from 'react';
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LecturerDetailView from './LecturerDetailView';
import { programmes, lecturers, courses, sampleEvaluations } from '../constants';
import { useEvaluations } from '../hooks/useEvaluations';

describe('LecturerDetailView component', () => {
    const onBackMock = vi.fn();
    
    // We need the calculated lecturerSummary, so we use the real hook
    const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));
    const lecturerSummaries = result.current.lecturerSummary;
    
    const renderComponent = (lecturerId: string) => render(
        <LecturerDetailView
            lecturerId={lecturerId}
            evaluations={sampleEvaluations}
            summaries={lecturerSummaries}
            programmes={programmes}
            courses={courses}
            onBack={onBackMock}
        />
    );

    it('should render detailed information for a specific lecturer', () => {
        const ahiabuSummary = lecturerSummaries.find(s => s.id === 'ahiabu');
        expect(ahiabuSummary).toBeDefined();

        renderComponent('ahiabu');

        // Check header info
        expect(screen.getByRole('heading', { name: 'Mr. Ahiabu' })).toBeInTheDocument();
        expect(screen.getByText('B.Tech Digital Media and Communication Design')).toBeInTheDocument();

        // Check summary cards
        const cards = screen.getAllByRole('heading', { level: 3 });
        expect(cards[0]).toHaveTextContent('Total Evaluations');
        expect(cards[0].nextElementSibling).toHaveTextContent(ahiabuSummary!.evaluationCount.toString());

        expect(cards[1]).toHaveTextContent('Average Rating');
        expect(cards[1].nextElementSibling).toHaveTextContent(ahiabuSummary!.avgRating);

        expect(cards[2]).toHaveTextContent('Recommendation Rate');
        expect(cards[2].nextElementSibling).toHaveTextContent(ahiabuSummary!.recommendationRate);
    });

    it('should render performance charts and tables', () => {
        renderComponent('ahiabu');

        expect(screen.getByRole('heading', { name: /Performance by Category/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Overall Rating Distribution/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Performance by Course/i })).toBeInTheDocument();

        // Check course performance table for his two evaluated courses
        expect(screen.getByRole('cell', { name: 'DMCD 113 - Intro to Communication Design' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'DMCD 231 - Corporate Identity' })).toBeInTheDocument();
    });
    
    it('should render feedback comments', () => {
        renderComponent('ahiabu');
        
        expect(screen.getByRole('heading', { name: /Feedback Comments/i })).toBeInTheDocument();
        // Check for specific comments from sample data
        expect(screen.getByText(/"Mr. Ahiabu is a fantastic lecturer. He explains complex topics in a simple way."/i)).toBeInTheDocument();
        expect(screen.getByText(/"Another great course with Mr. Ahiabu. The projects were challenging but rewarding."/i)).toBeInTheDocument();
    });

    it('should call onBack when the back button is clicked', async () => {
        const user = userEvent.setup();
        renderComponent('ahiabu');

        const backButton = screen.getByRole('button', { name: /Back to Lecturers List/i });
        await user.click(backButton);

        expect(onBackMock).toHaveBeenCalledTimes(1);
    });
    
    it('should display a "no comments" message if a lecturer has none', () => {
        // Mr. Wellington's evaluation has an empty comment
        renderComponent('wellington');
        
        expect(screen.getByRole('heading', { name: /Feedback Comments/i })).toBeInTheDocument();
        expect(screen.getByText(/No comments have been provided for this lecturer yet./i)).toBeInTheDocument();
    });
});