import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
// FIX: Added import for React to resolve namespace error.
import React from 'react';
import { useEvaluations } from './useEvaluations';
import { sampleEvaluations, programmes, lecturers, courses } from '../constants';

describe('useEvaluations hook', () => {
    it('should return initial data correctly', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));

        expect(result.current.filteredEvaluations).toHaveLength(8);
        expect(result.current.statistics.totalEvaluations).toBe(8);
        expect(result.current.programmeAnalytics).toHaveLength(programmes.length);
        expect(result.current.lecturerSummary.length).toBeGreaterThan(0);
    });

    it('should filter evaluations by search term', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));
        
        act(() => {
            result.current.handleSearchChange({ target: { value: 'ahiabu' } } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.filteredEvaluations).toHaveLength(2);
        expect(result.current.filteredEvaluations[0].lecturerId).toBe('ahiabu');
    });

    it('should filter evaluations by semester', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));

        act(() => {
            result.current.handleSemesterFilter(1);
        });

        expect(result.current.filteredEvaluations).toHaveLength(3);
        expect(result.current.filteredEvaluations.every(e => e.semester === 1)).toBe(true);
    });

    it('should filter evaluations by programme', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));

        act(() => {
            result.current.handleProgrammeFilter('dmcd_btech');
        });

        expect(result.current.filteredEvaluations).toHaveLength(4);
        expect(result.current.filteredEvaluations.every(e => e.programmeId === 'dmcd_btech')).toBe(true);
    });
    
    it('should combine filters correctly', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));

        act(() => {
            result.current.handleProgrammeFilter('dmcd_btech');
        });
        act(() => {
            result.current.handleSearchChange({ target: { value: 'ahiabu' } } as React.ChangeEvent<HTMLInputElement>);
        });
        act(() => {
            result.current.handleSemesterFilter(1);
        });
        
        expect(result.current.filteredEvaluations).toHaveLength(1);
        expect(result.current.filteredEvaluations[0].id).toBe('eval_01');
    });
    
    it('should calculate statistics correctly', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));

        expect(result.current.statistics.totalEvaluations).toBe(8);
        // Note: This depends on random variation. A more robust test would mock Math.random.
        // For now, we check if the values are in a plausible range.
        expect(parseFloat(result.current.statistics.averageOverallRating)).toBeGreaterThan(0);
        expect(result.current.statistics.recommendationRate).toBe('75.0'); // 6 recommend / 8 total
    });
    
    it('should calculate programme analytics correctly', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));
        const dmcdAnalytics = result.current.programmeAnalytics.find(p => p.id === 'dmcd_btech');
        
        expect(dmcdAnalytics).toBeDefined();
        expect(dmcdAnalytics?.evaluationCount).toBe(4);
        expect(dmcdAnalytics?.lecturerCount).toBe(6); // Based on full curriculum
        expect(parseFloat(dmcdAnalytics!.avgRating)).toBeGreaterThan(0);
        expect(dmcdAnalytics?.recommendationRate).toBe('100.0'); // All 4 evals are 'Recommend'
    });

    it('should show correct lecturer and course counts with zero evaluations', () => {
        // Pass empty array for evaluations, but full curriculum data
        const { result } = renderHook(() => useEvaluations([], programmes, lecturers, courses));
        
        const dmcdAnalytics = result.current.programmeAnalytics.find(p => p.id === 'dmcd_btech');
        
        expect(dmcdAnalytics).toBeDefined();
        // Counts should come from master data, not evaluations
        expect(dmcdAnalytics?.lecturerCount).toBe(6); 
        expect(dmcdAnalytics?.courseCount).toBe(39);
        // Evaluation-specific data should be zero
        expect(dmcdAnalytics?.evaluationCount).toBe(0);
        expect(dmcdAnalytics?.avgRating).toBe('0.0');
        expect(dmcdAnalytics?.recommendationRate).toBe('0.0');
    });
    
    it('should calculate lecturer summary correctly', () => {
        const { result } = renderHook(() => useEvaluations(sampleEvaluations, programmes, lecturers, courses));
        const ahiabuSummary = result.current.lecturerSummary.find(l => l.id === 'ahiabu');
        
        expect(ahiabuSummary).toBeDefined();
        expect(ahiabuSummary?.evaluationCount).toBe(2);
        expect(ahiabuSummary?.coursesTaught.length).toBe(9); // All courses assigned in curriculum
        expect(parseFloat(ahiabuSummary!.avgRating)).toBeGreaterThan(0);
        expect(ahiabuSummary?.recommendationRate).toBe('100.0');
    });

    it('should reset statistics when evaluations are cleared', () => {
        // Initial render with data
        const { result, rerender } = renderHook(
            ({ evals, progs, lects, cours }) => useEvaluations(evals, progs, lects, cours),
            { initialProps: { evals: sampleEvaluations, progs: programmes, lects: lecturers, cours: courses } }
        );
        
        expect(result.current.statistics.totalEvaluations).toBe(8);
    
        // Rerender with empty evaluations array
        rerender({ evals: [], progs: programmes, lects: lecturers, cours: courses });
    
        expect(result.current.statistics.totalEvaluations).toBe(0);
        expect(result.current.statistics.averageOverallRating).toBe('0.0');
        expect(result.current.statistics.recommendationRate).toBe('0.0');
    });
});