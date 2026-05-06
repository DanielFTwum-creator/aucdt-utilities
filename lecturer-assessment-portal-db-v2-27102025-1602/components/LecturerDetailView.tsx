import React, { useMemo } from 'react';
import { ArrowLeft, BarChart2, BarChartHorizontal, FileText, MessageSquare, Users, Star } from 'lucide-react';
import { LecturerEvaluation, LecturerSummary, Programme, Course, RatingCategory, assessmentCriteria } from '../types';
import StatisticsCard from './StatisticsCard';

// --- Reusable Chart Components (Copied from AnalyticsView for modularity) ---

interface VerticalBarChartProps {
    data: { label: string; value: number }[];
    barColor: string;
}
const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ data, barColor }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="h-64 flex items-end justify-around gap-4 pt-4">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center h-full w-full">
                    <div className="relative w-full h-full flex items-end justify-center group">
                        <div
                            className="w-3/4 rounded-t-md transition-all duration-300"
                            style={{ height: `${(item.value / maxValue) * 100}%`, backgroundColor: barColor }}
                        ></div>
                         <div className="absolute -top-6 px-2 py-1 bg-slate-800 dark:bg-slate-700 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.value}
                        </div>
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-white text-center">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

interface HorizontalBarChartProps {
    data: { label: string; value: number }[];
    barColor: string;
}
const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data, barColor }) => {
    const maxValue = 5; // Max rating is 5
    return (
        <div className="space-y-4">
            {data.map(item => (
                <div key={item.label} className="flex items-center gap-4">
                    <div className="w-40 text-sm text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-white text-right flex-shrink-0">{item.label}</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 [.high-contrast_&]:bg-slate-600 rounded-full h-5">
                        <div
                            className="h-5 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: barColor }}
                        >
                           <span className="text-xs font-bold text-white [.high-contrast_&]:text-black">{item.value.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- Main Detail View Component ---

interface LecturerDetailViewProps {
    lecturerId: string;
    evaluations: LecturerEvaluation[];
    summaries: LecturerSummary[];
    programmes: Programme[];
    courses: Course[];
    onBack: () => void;
}

const LecturerDetailView: React.FC<LecturerDetailViewProps> = ({
    lecturerId, evaluations, summaries, programmes, courses, onBack
}) => {
    const {
        lecturerSummary,
        lecturerEvaluations,
        programmeNames,
        categoryAverages,
        ratingDistribution,
        coursePerformance,
        comments
    } = useMemo(() => {
        const summary = summaries.find(s => s.id === lecturerId);
        if (!summary) return { lecturerSummary: null };
        
        const lectEvals = evaluations.filter(e => e.lecturerId === lecturerId);
        const progNames = summary.programmesTaught.map(p => p.name).join(', ');

        // Category performance
        const categoryTotals = (Object.keys(assessmentCriteria) as RatingCategory[]).reduce((acc, cat) => {
            acc[cat] = { total: 0, count: 0 };
            return acc;
        }, {} as Record<RatingCategory, { total: number; count: number }>);

        const ratingDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        lectEvals.forEach(ev => {
            Object.entries(ev.ratings).forEach(([cat, rating]) => {
                const category = cat as RatingCategory;
                if (categoryTotals[category]) {
                    // FIX: Cast 'rating' to number as Object.entries returns value as 'unknown'.
                    categoryTotals[category].total += rating as number;
                    categoryTotals[category].count++;
                }
                ratingDist[rating as keyof typeof ratingDist]++;
            });
        });
        const catAverages = Object.entries(categoryTotals).map(([label, data]) => ({
            label: assessmentCriteria[label as RatingCategory].short, 
            value: data.count > 0 ? data.total / data.count : 0,
        }));

        // Course performance
        const courseEvals = new Map<string, LecturerEvaluation[]>();
        lectEvals.forEach(ev => {
            if (!courseEvals.has(ev.courseId)) courseEvals.set(ev.courseId, []);
            courseEvals.get(ev.courseId)!.push(ev);
        });
        const coursePerf = Array.from(courseEvals.entries()).map(([courseId, evs]) => {
            const courseName = courses.find(c => c.id === courseId)?.name || courseId;
            const evalCount = evs.length;
            const ratingSum = evs.reduce((sum, e) => {
                 const ratings = Object.values(e.ratings);
                 const avg = ratings.length > 0 ? ratings.reduce((a,b) => a + b, 0) / ratings.length : 0;
                 return sum + avg;
            }, 0);
            const recommendCount = evs.filter(e => e.recommend === 'Recommend').length;
            return {
                courseId, courseName, evalCount,
                avgRating: (ratingSum / evalCount).toFixed(1),
                recommendationRate: ((recommendCount / evalCount) * 100).toFixed(1)
            }
        });
        
        // Comments
        const lectComments = lectEvals
            .filter(e => e.comment.trim() !== '')
            .map(e => ({
                comment: e.comment,
                courseName: courses.find(c => c.id === e.courseId)?.name || e.courseId,
                timestamp: e.timestamp,
            }))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return {
            lecturerSummary: summary,
            lecturerEvaluations: lectEvals,
            programmeNames: progNames,
            categoryAverages: catAverages,
            ratingDistribution: Object.entries(ratingDist).map(([stars, count]) => ({ label: `${stars} Star${stars > '1' ? 's' : ''}`, value: count })),
            coursePerformance: coursePerf,
            comments: lectComments,
        };
    }, [lecturerId, evaluations, summaries, programmes, courses]);

    if (!lecturerSummary) {
        return <div>Lecturer not found. <button onClick={onBack}>Go Back</button></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 [.high-contrast_&]:text-cyan-400 hover:underline mb-4">
                    <ArrowLeft size={16} />
                    Back to Lecturers List
                </button>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white">{lecturerSummary.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">{programmeNames}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatisticsCard title="Total Evaluations" value={String(lecturerSummary.evaluationCount)} icon={<FileText size={24} className="text-sky-600 dark:text-sky-400 [.high-contrast_&]:text-cyan-400" />} colorClass="bg-sky-100 dark:bg-sky-900/50" />
                <StatisticsCard title="Average Rating" value={lecturerSummary.avgRating} suffix="/5" icon={<Star size={24} className="text-amber-600 dark:text-amber-400 [.high-contrast_&]:text-yellow-300" />} colorClass="bg-amber-100 dark:bg-amber-900/50" />
                <StatisticsCard title="Recommendation Rate" value={lecturerSummary.recommendationRate} suffix="%" icon={<Users size={24} className="text-emerald-600 dark:text-emerald-400 [.high-contrast_&]:text-green-400" />} colorClass="bg-emerald-100 dark:bg-emerald-900/50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-6 flex items-center gap-2"><BarChartHorizontal size={20} /> Performance by Category</h3>
                    <HorizontalBarChart data={categoryAverages} barColor="#F59E0B" />
                </div>
                <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-4 flex items-center gap-2"><BarChart2 size={20} /> Overall Rating Distribution</h3>
                    <VerticalBarChart data={ratingDistribution} barColor="#38BDF8" />
                </div>
            </div>
            
             <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white p-6 border-b border-slate-200 dark:border-slate-700 [.high-contrast_&]:border-yellow-300">Performance by Course</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 [.high-contrast_&]:divide-yellow-300">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 [.high-contrast_&]:bg-black">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 [.high-contrast_&]:text-white uppercase">Course</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 [.high-contrast_&]:text-white uppercase">Evaluations</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 [.high-contrast_&]:text-white uppercase">Avg. Rating</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 [.high-contrast_&]:text-white uppercase">Recommend %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coursePerformance.map(course => (
                                <tr key={course.courseId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 [.high-contrast_&]:hover:bg-slate-900">
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white truncate" title={course.courseName}>{course.courseName}</div></td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-300 [.high-contrast_&]:text-white">{course.evalCount}</td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-amber-600 dark:text-amber-400 [.high-contrast_&]:text-yellow-300">{course.avgRating}</td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 [.high-contrast_&]:text-green-400">{course.recommendationRate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-4 flex items-center gap-2"><MessageSquare size={20} /> Feedback Comments</h3>
                {comments && comments.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto space-y-4 pr-3">
                        {comments.map((item, index) => (
                            <div key={index} className="bg-slate-50 dark:bg-slate-700/50 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                                <p className="text-sm text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white italic">"{item.comment}"</p>
                                <div className="text-xs text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300 mt-3 flex justify-between items-center">
                                    <span className="font-semibold">{item.courseName}</span>
                                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">No comments have been provided for this lecturer yet.</p>
                )}
            </div>
        </div>
    );
};

export default LecturerDetailView;