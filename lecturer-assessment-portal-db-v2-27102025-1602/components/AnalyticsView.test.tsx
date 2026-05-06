import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnalyticsView from './AnalyticsView';
import { LecturerEvaluation } from '../types';
import { sampleEvaluations } from '../constants';

describe('AnalyticsView component', () => {
    beforeEach(() => {
        // Mock Math.random to make rating generation deterministic for tests
        vi.spyOn(Math, 'random').mockReturnValue(0.5); // This will make the variation 0
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should display a "Not Enough Data" message when there are no evaluations', () => {
        render(<AnalyticsView evaluations={[]} />);
        expect(screen.getByText('Not Enough Data')).toBeInTheDocument();
        expect(screen.getByText('At least one evaluation is required to generate analytics.')).toBeInTheDocument();
    });

    it('should render all chart sections when evaluations are provided', () => {
        render(<AnalyticsView evaluations={sampleEvaluations} />);
        
        expect(screen.getByRole('heading', { name: /Recommendation Breakdown/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Overall Rating Distribution/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Average Ratings by Category/i })).toBeInTheDocument();
    });

    it('should calculate and display recommendation breakdown correctly', () => {
        render(<AnalyticsView evaluations={sampleEvaluations} />);
        
        // From sampleEvaluations: 6 Recommend, 1 Neutral, 1 Not Recommend
        const recommendItem = screen.getByText('Recommend').closest('li');
        const neutralItem = screen.getByText('Neutral').closest('li');
        const notRecommendItem = screen.getByText('Not Recommend').closest('li');

        expect(recommendItem).toHaveTextContent('6 (75.0%)');
        expect(neutralItem).toHaveTextContent('1 (12.5%)');
        expect(notRecommendItem).toHaveTextContent('1 (12.5%)');
    });

    it('should calculate and display rating distribution correctly', () => {
        render(<AnalyticsView evaluations={sampleEvaluations} />);
        
        // Check for the labels of the bar chart
        expect(screen.getByText('1 Star')).toBeInTheDocument();
        expect(screen.getByText('2 Stars')).toBeInTheDocument();
        expect(screen.getByText('3 Stars')).toBeInTheDocument();
        expect(screen.getByText('4 Stars')).toBeInTheDocument();
        expect(screen.getByText('5 Stars')).toBeInTheDocument();
    });
    
    it('should calculate and display average ratings by category correctly', () => {
        render(<AnalyticsView evaluations={sampleEvaluations} />);
        
        // With Math.random mocked, variation is 0, so ratings equal base ratings.
        // Base ratings: 5, 4, 5, 3, 2, 5, 5, 4. Average = 33 / 8 = 4.125
        const knowledgeCategory = screen.getByText('Knowledge'); // from assessmentCriteria['1'].short
        const barContainer = knowledgeCategory.closest('div.flex.items-center');
        expect(barContainer).toBeInTheDocument();
        expect(barContainer).toHaveTextContent('4.13'); // 4.125.toFixed(2)
    });
});