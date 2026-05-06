
import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { Ratings } from '../types';
import { StarIcon } from './icons';

const LecturerDirectory: React.FC = () => {
    const { state } = useAppStore();

    const lecturerStats = useMemo(() => {
        return state.lecturers.map(lecturer => {
            const assessments = state.assessments.filter(a => a.lecturerId === lecturer.id);
            const reviewCount = assessments.length;

            if (reviewCount === 0) {
                return {
                    ...lecturer,
                    averageRating: 0,
                    reviewCount: 0,
                    programmeName: state.programmes.find(p => p.id === lecturer.programmeId)?.name || 'Unknown'
                };
            }

            const totalRatingSum = assessments.reduce((sum, assessment) => {
                const ratingValues = Object.values(assessment.ratings);
                const assessmentSum = ratingValues.reduce((a, b) => a + b, 0);
                const assessmentAvg = assessmentSum / ratingValues.length;
                return sum + assessmentAvg;
            }, 0);

            const averageRating = (totalRatingSum / reviewCount).toFixed(1);

            return {
                ...lecturer,
                averageRating: parseFloat(averageRating),
                reviewCount,
                programmeName: state.programmes.find(p => p.id === lecturer.programmeId)?.name || 'Unknown'
            };
        }).sort((a,b) => b.averageRating - a.averageRating);
    }, [state.lecturers, state.assessments, state.programmes]);

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Lecturer Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lecturerStats.map(lecturer => (
                    <div key={lecturer.id} className="bg-brand-surface p-5 rounded-lg shadow-lg border-l-4 border-brand-secondary">
                        <h3 className="text-xl font-bold text-brand-primary">{lecturer.name}</h3>
                        <p className="text-sm text-brand-text-primary/70">{lecturer.programmeName}</p>
                        <div className="mt-4 flex justify-between items-center">
                            {lecturer.reviewCount > 0 ? (
                                <div className="flex items-center space-x-2 text-lg font-bold">
                                    <StarIcon className="w-6 h-6 text-brand-secondary" />
                                    <span>{lecturer.averageRating}</span>
                                </div>
                            ) : (
                                <div className="text-brand-text-primary/80">No reviews yet</div>
                            )}
                            <div className="text-sm text-brand-text-primary/90">{lecturer.reviewCount} review(s)</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LecturerDirectory;