import React, { useMemo } from 'react';
import { LecturerEvaluation, RatingCategory, Recommendation, assessmentCriteria } from '../types';
import { BarChart2, PieChart, BarChartHorizontal, Star } from 'lucide-react';

// --- Reusable Chart Components ---

interface DonutChartProps {
    data: { label: string; value: number; color: string }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="h-48 flex items-center justify-center text-slate-500 [.high-contrast_&]:text-slate-300">No data</div>;

    let cumulativePercent = 0;
    const segments = data.map(item => {
        const percent = item.value / total;
        const dashArray = 2 * Math.PI * 20; // Circumference of circle with r=20
        const dashOffset = dashArray * (1 - percent);
        const rotation = cumulativePercent * 360;
        cumulativePercent += percent;
        
        return { ...item, percent, dashArray, dashOffset, rotation };
    });

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48 flex-shrink-0">
                <svg viewBox="0 0 44 44" className="transform -rotate-90">
                    {segments.map(seg => (
                        <circle
                            key={seg.label}
                            cx="22" cy="22" r="17.5"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="9"
                            strokeDasharray={seg.dashArray}
                            strokeDashoffset={seg.dashOffset}
                            transform={`rotate(${seg.rotation} 22 22)`}
                        />
                    ))}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 [.high-contrast_&]:text-white">{total}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">Total</span>
                </div>
            </div>
            <div className="w-full">
                <ul className="space-y-2">
                    {segments.map(seg => (
                        <li key={seg.label} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></span>
                                <span className="text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white">{seg.label}</span>
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">
                                {seg.value} ({(seg.percent * 100).toFixed(1)}%)
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


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


// --- Main Analytics View ---

interface AnalyticsViewProps {
    evaluations: LecturerEvaluation[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ evaluations }) => {
    const analyticsData = useMemo(() => {
        if (evaluations.length === 0) return null;

        const recommendationCounts = {
            'Recommend': 0,
            'Neutral': 0,
            'Not Recommend': 0,
        };
        
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        const categoryTotals = (Object.keys(assessmentCriteria) as RatingCategory[]).reduce((acc, cat) => {
            acc[cat] = { total: 0, count: 0 };
            return acc;
        }, {} as Record<RatingCategory, { total: number; count: number }>);


        for (const evaluation of evaluations) {
            recommendationCounts[evaluation.recommend]++;
            for (const [category, rating] of Object.entries(evaluation.ratings)) {
                const cat = category as RatingCategory;
                ratingDistribution[rating as keyof typeof ratingDistribution]++;
                if (categoryTotals[cat]) {
                    // FIX: Cast 'rating' to number as Object.entries returns value as 'unknown'.
                    categoryTotals[cat].total += rating as number;
                    categoryTotals[cat].count++;
                }
            }
        }
        
        const categoryAverages = Object.entries(categoryTotals).map(([label, data]) => ({
            label: assessmentCriteria[label as RatingCategory].short,
            value: data.count > 0 ? data.total / data.count : 0,
        }));
        
        return { recommendationCounts, ratingDistribution, categoryAverages };
    }, [evaluations]);

    if (!analyticsData) {
        return (
            <div className="text-center py-20 bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <BarChart2 size={56} className="mx-auto text-slate-400" />
                <h2 className="mt-6 text-2xl font-bold text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">Not Enough Data</h2>
                <p className="mt-3 text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">At least one evaluation is required to generate analytics.</p>
            </div>
        );
    }

    const { recommendationCounts, ratingDistribution, categoryAverages } = analyticsData;
    
    const recommendationChartData = [
        { label: 'Recommend', value: recommendationCounts['Recommend'], color: '#10B981' },
        { label: 'Neutral', value: recommendationCounts['Neutral'], color: '#38BDF8' },
        { label: 'Not Recommend', value: recommendationCounts['Not Recommend'], color: '#EF4444' },
    ];

    const ratingDistributionChartData = Object.entries(ratingDistribution).map(([stars, count]) => ({
        label: `${stars} Star${stars > '1' ? 's' : ''}`,
        value: count,
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-4 flex items-center gap-2">
                        <PieChart size={20} />
                        Recommendation Breakdown
                    </h3>
                    <DonutChart data={recommendationChartData} />
                </div>
                <div className="lg:col-span-3 bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-4 flex items-center gap-2">
                        <BarChart2 size={20} />
                        Overall Rating Distribution
                    </h3>
                    <VerticalBarChart data={ratingDistributionChartData} barColor="#38BDF8" />
                </div>
            </div>
            <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-6 flex items-center gap-2">
                    <BarChartHorizontal size={20} />
                    Average Ratings by Category
                </h3>
                <HorizontalBarChart data={categoryAverages} barColor="#F59E0B" />
            </div>
        </div>
    );
};

export default AnalyticsView;