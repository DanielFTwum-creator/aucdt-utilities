
import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';

const StatCard: React.FC<{ title: string, value: string | number }> = ({ title, value }) => (
    <div className="bg-brand-surface p-6 rounded-lg shadow-md text-center border-l-4 border-brand-secondary">
        <h4 className="text-lg font-semibold text-brand-text-primary/80">{title}</h4>
        <p className="text-4xl font-bold text-brand-primary mt-2">{value}</p>
    </div>
);

const AnalyticsDashboard: React.FC = () => {
    const { state } = useAppStore();

    const analytics = useMemo(() => {
        const totalAssessments = state.assessments.length;

        if (totalAssessments === 0) {
            return {
                totalAssessments: 0,
                overallAverage: 'N/A',
                mostAssessedProgramme: 'N/A'
            };
        }

        const totalRatingSum = state.assessments.reduce((sum, assessment) => {
            const ratingValues = Object.values(assessment.ratings);
            const assessmentSum = ratingValues.reduce((a, b) => a + b, 0);
            const assessmentAvg = assessmentSum / ratingValues.length;
            return sum + assessmentAvg;
        }, 0);
        const overallAverage = (totalRatingSum / totalAssessments).toFixed(2);

        const programmeCounts = state.assessments.reduce((acc, assessment) => {
            acc[assessment.programmeId] = (acc[assessment.programmeId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostAssessedProgrammeId = Object.keys(programmeCounts).reduce((a, b) => programmeCounts[a] > programmeCounts[b] ? a : b, '');
        const mostAssessedProgramme = state.programmes.find(p => p.id === mostAssessedProgrammeId)?.name || 'N/A';
        
        return { totalAssessments, overallAverage, mostAssessedProgramme };

    }, [state.assessments, state.programmes]);

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Assessments" value={analytics.totalAssessments} />
                <StatCard title="Overall Average Rating" value={analytics.overallAverage} />
                <StatCard title="Most Assessed Programme" value={analytics.mostAssessedProgramme} />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;