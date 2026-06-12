
import { useContext, useMemo, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import type { AppContextType } from '../types';

interface LecturerStats {
    id: string;
    name: string;
    totalEvaluations: number;
    averageScore: number;
}

export const useEvaluations = () => {
    const { evaluations, curriculum } = useContext(AppContext) as AppContextType;

    const getOverallLecturerStats = useCallback((): LecturerStats[] => {
        const statsMap = new Map<string, { totalScore: number; count: number }>();

        evaluations.forEach(ev => {
            const current = statsMap.get(ev.lecturerId) || { totalScore: 0, count: 0 };
            const totalScoreInEval = Object.values(ev.ratings).reduce((sum, score) => sum + score, 0);
            const avgScoreInEval = totalScoreInEval / Object.values(ev.ratings).length;
            
            if (!isNaN(avgScoreInEval)) {
                statsMap.set(ev.lecturerId, {
                    totalScore: current.totalScore + avgScoreInEval,
                    count: current.count + 1
                });
            }
        });

        const result: LecturerStats[] = [];
        curriculum.lecturers.forEach(lecturer => {
            const stats = statsMap.get(lecturer.id);
            if (stats) {
                result.push({
                    id: lecturer.id,
                    name: lecturer.name,
                    totalEvaluations: stats.count,
                    averageScore: stats.count > 0 ? stats.totalScore / stats.count : 0,
                });
            } else {
                 result.push({
                    id: lecturer.id,
                    name: lecturer.name,
                    totalEvaluations: 0,
                    averageScore: 0,
                });
            }
        });

        return result;
    }, [evaluations, curriculum.lecturers]);

    const getLecturerDetailedStats = useCallback((lecturerId: string) => {
        const lecturerEvals = evaluations.filter(ev => ev.lecturerId === lecturerId);
        if (lecturerEvals.length === 0) return null;

        const ratingSums: { [key: string]: number } = {};
        let totalRatingSum = 0;
        let totalRatingsCount = 0;
        
        lecturerEvals.forEach(ev => {
            Object.entries(ev.ratings).forEach(([criterion, score]) => {
                ratingSums[criterion] = (ratingSums[criterion] || 0) + score;
                totalRatingSum += score;
                totalRatingsCount++;
            });
        });

        const averageRatings: { [key: string]: number } = {};
        Object.keys(ratingSums).forEach(criterion => {
            averageRatings[criterion] = ratingSums[criterion] / lecturerEvals.length;
        });

        const comments = lecturerEvals.map(ev => ev.comment).filter(Boolean);

        return {
            totalEvaluations: lecturerEvals.length,
            overallAverageRating: totalRatingsCount > 0 ? totalRatingSum / totalRatingsCount : 0,
            averageRatings,
            comments,
        };
    }, [evaluations]);

    return useMemo(() => ({
        getOverallLecturerStats,
        getLecturerDetailedStats,
    }), [getOverallLecturerStats, getLecturerDetailedStats]);
};
