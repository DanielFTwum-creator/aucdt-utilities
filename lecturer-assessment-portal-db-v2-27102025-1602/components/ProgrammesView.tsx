import React, { useState, useMemo } from 'react';
import { ProgrammeAnalytics } from '../types';
import { ChevronDown, ChevronUp, ChevronsUpDown, Star, Users, FileText, User, BookOpen, BarChart3 } from 'lucide-react';

interface ProgrammesViewProps {
    programmeAnalytics: ProgrammeAnalytics[];
}

type SortableKey = 'name' | 'lecturerCount' | 'courseCount' | 'evaluationCount' | 'avgRating' | 'recommendationRate';

const SortableHeader: React.FC<{
    label: string;
    sortKey: SortableKey;
    sortConfig: { key: SortableKey; direction: 'asc' | 'desc' } | null;
    onClick: () => void;
    className?: string;
}> = ({ label, sortKey, sortConfig, onClick, className = '' }) => {
    const isSorting = sortConfig?.key === sortKey;
    const Icon = isSorting ? (sortConfig.direction === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
    
    return (
        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 [.high-contrast_&]:text-white uppercase tracking-wider ${className}`}>
            <button className="flex items-center gap-2" onClick={onClick}>
                {label}
                <Icon size={16} className={isSorting ? 'text-slate-800 dark:text-slate-100 [.high-contrast_&]:text-yellow-300' : 'text-slate-400'} />
            </button>
        </th>
    );
};

const ProgrammesView: React.FC<ProgrammesViewProps> = ({ programmeAnalytics }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortableKey; direction: 'asc' | 'desc' } | null>({ key: 'evaluationCount', direction: 'desc' });

    const sortedAnalytics = useMemo(() => {
        const sortableItems = [...programmeAnalytics];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const { key, direction } = sortConfig;
                const dir = direction === 'asc' ? 1 : -1;

                if (key === 'name') {
                    return a.name.localeCompare(b.name) * dir;
                }
                if (key === 'avgRating' || key === 'recommendationRate') {
                    return (parseFloat(a[key]) - parseFloat(b[key])) * dir;
                }
                // For counts
                return (a[key] - b[key]) * dir;
            });
        }
        return sortableItems;
    }, [programmeAnalytics, sortConfig]);

    const handleSort = (key: SortableKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    if (programmeAnalytics.length === 0) {
        return (
            <div className="text-center py-12 bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <BarChart3 size={48} className="mx-auto text-slate-400" />
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">No Programme Data Available</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">Update the curriculum to see programme statistics here.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 [.high-contrast_&]:divide-yellow-300">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 [.high-contrast_&]:bg-black">
                        <tr>
                            <SortableHeader label="Programme" sortKey="name" sortConfig={sortConfig} onClick={() => handleSort('name')} />
                            <SortableHeader label="Lecturers" sortKey="lecturerCount" sortConfig={sortConfig} onClick={() => handleSort('lecturerCount')} className="text-center" />
                            <SortableHeader label="Courses" sortKey="courseCount" sortConfig={sortConfig} onClick={() => handleSort('courseCount')} className="text-center" />
                            <SortableHeader label="Evaluations" sortKey="evaluationCount" sortConfig={sortConfig} onClick={() => handleSort('evaluationCount')} className="text-center" />
                            <SortableHeader label="Avg. Rating" sortKey="avgRating" sortConfig={sortConfig} onClick={() => handleSort('avgRating')} className="text-center" />
                            <SortableHeader label="Recommendation" sortKey="recommendationRate" sortConfig={sortConfig} onClick={() => handleSort('recommendationRate')} className="text-center" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 [.high-contrast_&]:divide-yellow-300 bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black">
                        {sortedAnalytics.map(prog => (
                            <tr key={prog.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 [.high-contrast_&]:hover:bg-slate-900 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white">{prog.name}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">{prog.id.toUpperCase()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">
                                        <User size={16} className="text-slate-400" />
                                        <span>{prog.lecturerCount}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">
                                        <BookOpen size={16} className="text-slate-400" />
                                        <span>{prog.courseCount}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">
                                        <FileText size={16} className="text-slate-400" />
                                        <span>{prog.evaluationCount}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className={`flex items-center justify-center gap-2 text-sm font-semibold ${parseFloat(prog.avgRating) > 0 ? 'text-amber-600 dark:text-amber-400 [.high-contrast_&]:text-yellow-300' : 'text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white'}`}>
                                        <Star size={16} />
                                        <span>{prog.avgRating}</span>
                                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">/ 5</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className={`flex items-center justify-center gap-2 text-sm font-semibold ${parseFloat(prog.recommendationRate) > 0 ? 'text-emerald-600 dark:text-emerald-400 [.high-contrast_&]:text-green-400' : 'text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white'}`}>
                                        <Users size={16} />
                                        <span>{prog.recommendationRate}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProgrammesView;