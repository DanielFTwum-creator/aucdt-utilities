
import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { Assessment } from '../types';
import { StarIcon } from './icons';

const ResultsView: React.FC = () => {
    const { state } = useAppStore();

    const getAverageRating = (ratings: Assessment['ratings']) => {
        const values = Object.values(ratings);
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return (sum / values.length).toFixed(1);
    };

    const assessmentsWithDetails = useMemo(() => {
        return state.assessments.map(assessment => {
            const lecturer = state.lecturers.find(l => l.id === assessment.lecturerId);
            const course = state.courses.find(c => c.id === assessment.courseId);
            return {
                ...assessment,
                lecturerName: lecturer?.name || 'Unknown',
                courseName: course?.name || 'Unknown',
                averageRating: getAverageRating(assessment.ratings)
            };
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [state.assessments, state.lecturers, state.courses]);

    if (state.assessments.length === 0) {
        return (
            <div className="text-center bg-brand-surface p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-brand-text-primary">No Assessments Submitted Yet</h2>
                <p className="mt-2 text-brand-text-primary/80">Submit an assessment to see the results here.</p>
            </div>
        );
    }

    return (
        <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Submitted Assessments</h2>
            <div className="space-y-4">
                {assessmentsWithDetails.map(assessment => (
                    <div key={assessment.id} className="p-4 border border-brand-warm-beige rounded-lg bg-brand-surface border-l-4 border-brand-secondary">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-brand-primary">{assessment.lecturerName}</h3>
                                <p className="text-sm text-brand-text-primary/70">{assessment.courseName}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-lg font-bold text-brand-text-primary">
                                <StarIcon className="w-6 h-6 text-brand-secondary" />
                                <span>{assessment.averageRating}</span>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-brand-text-primary/90"><strong>Recommendation:</strong> {assessment.recommend}</p>
                        {assessment.comment && (
                            <p className="mt-2 text-brand-text-primary bg-brand-background p-3 rounded-md italic">"{assessment.comment}"</p>
                        )}
                         <p className="mt-2 text-xs text-gray-400 text-right">Submitted on {new Date(assessment.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsView;