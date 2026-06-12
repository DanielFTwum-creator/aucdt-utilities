
import React, { useMemo, useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useEvaluations } from '../../hooks/useEvaluations';
import type { AppContextType, Lecturer } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { EVALUATION_CRITERIA_CONFIG } from '../../constants';

const categoryMapping = Object.entries(EVALUATION_CRITERIA_CONFIG).reduce((acc, [category, items]) => {
    items.forEach(item => {
        acc[item.id] = category;
    });
    return acc;
}, {} as Record<string, string>);

export const DashboardOverview: React.FC = () => {
    const { curriculum, theme } = useContext(AppContext) as AppContextType;
    const { getOverallLecturerStats, getLecturerDetailedStats } = useEvaluations();
    const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);

    const overallStats = useMemo(() => getOverallLecturerStats(), [getOverallLecturerStats]);
    const detailedStats = useMemo(() => selectedLecturer ? getLecturerDetailedStats(selectedLecturer.id) : null, [selectedLecturer, getLecturerDetailedStats]);
    
    const radarChartData = useMemo(() => {
        if (!detailedStats) return [];
        const categoryScores: Record<string, { total: number, count: number }> = {};

        Object.entries(detailedStats.averageRatings).forEach(([criterionId, score]) => {
            const category = categoryMapping[criterionId];
            if (!categoryScores[category]) {
                categoryScores[category] = { total: 0, count: 0 };
            }
            categoryScores[category].total += score;
            categoryScores[category].count++;
        });

        return Object.entries(categoryScores).map(([category, data]) => ({
            subject: category,
            A: parseFloat((data.total / data.count).toFixed(2)),
            fullMark: 5,
        }));
    }, [detailedStats]);

    if (!curriculum.lecturers.length) {
        return <div className="text-center p-8"><p>No curriculum data found. Please upload a curriculum PDF.</p></div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Lecturers</h2>
                <div className="space-y-2 h-[60vh] overflow-y-auto pr-2">
                    {curriculum.lecturers.map(lecturer => (
                        <button
                            key={lecturer.id}
                            onClick={() => setSelectedLecturer(lecturer)}
                            className={`w-full text-left p-3 rounded-md transition-all duration-300 ease-in-out border-l-4 ${
                                selectedLecturer?.id === lecturer.id
                                    ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500'
                                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            <p className={`font-medium transition-colors ${selectedLecturer?.id === lecturer.id ? 'text-indigo-800 dark:text-indigo-200' : ''}`}>
                                {lecturer.name}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2">
                {selectedLecturer ? (
                    detailedStats ? (
                    <div className="space-y-6">
                         <h2 className="text-xl font-semibold">Evaluation for {selectedLecturer.name}</h2>
                         <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p><strong>Total Evaluations:</strong> {detailedStats.totalEvaluations}</p>
                            <p><strong>Overall Average Score:</strong> {detailedStats.overallAverageRating.toFixed(2)} / 5</p>
                         </div>
                         <div className="h-80 w-full">
                             <h3 className="font-semibold mb-2 text-center">Average Score by Category</h3>
                            <ResponsiveContainer>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 5]}/>
                                    <Radar name={selectedLecturer.name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                         </div>
                         <div>
                            <h3 className="font-semibold mb-2">Recent Comments</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {detailedStats.comments.slice(0, 5).map((comment, i) => (
                                    <p key={i} className="text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded-md italic">"{comment}"</p>
                                ))}
                                {detailedStats.comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
                            </div>
                         </div>
                    </div>
                    ) : <p>No evaluations found for {selectedLecturer.name}.</p>
                ) : (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Overall Performance</h2>
                        <div className="h-96 w-full">
                            <ResponsiveContainer>
                                <BarChart data={overallStats} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 5]}/>
                                    <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#333' : '#fff', border: 'none' }} labelStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}/>
                                    <Bar dataKey="averageScore" fill="#8884d8" name="Avg. Score"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
