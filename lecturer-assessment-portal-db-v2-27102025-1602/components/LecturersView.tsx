import React, { useState, useMemo } from 'react';
import { LecturerSummary, Programme, LecturerEvaluation, Course } from '../types';
import { ChevronDown, ChevronUp, ChevronsUpDown, Star, Users, FileText, User, Search } from 'lucide-react';
import LecturerDetailView from './LecturerDetailView';

interface LecturersViewProps {
    summaries: LecturerSummary[];
    programmes: Programme[];
    evaluations: LecturerEvaluation[];
    courses: Course[];
}

type SortableKey = 'name' | 'evaluationCount' | 'avgRating' | 'recommendationRate';

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

const getLastName = (fullName: string): string => {
    const parts = fullName.split(' ');
    // Handles cases like "Prof. Michael Chen" -> "Chen"
    return parts[parts.length - 1];
};

const LecturersView: React.FC<LecturersViewProps> = ({ summaries, programmes, evaluations, courses }) => {
    const [selectedLecturerId, setSelectedLecturerId] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: SortableKey; direction: 'asc' | 'desc' } | null>({ key: 'evaluationCount', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByProgramme, setFilterByProgramme] = useState<string>('all');
    
    const processedSummaries = useMemo(() => {
        let filteredItems = summaries.filter(summary => {
            const matchesSearch = searchTerm === '' || summary.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProgramme = filterByProgramme === 'all' || summary.programmesTaught.some(p => p.id === filterByProgramme);
            return matchesSearch && matchesProgramme;
        });

        if (sortConfig !== null) {
            filteredItems.sort((a, b) => {
                const { key, direction } = sortConfig;
                const dir = direction === 'asc' ? 1 : -1;

                if (key === 'name') {
                    const lastNameA = getLastName(a.name);
                    const lastNameB = getLastName(b.name);
                    // Primary sort by last name
                    if (lastNameA.localeCompare(lastNameB) !== 0) {
                        return lastNameA.localeCompare(lastNameB) * dir;
                    }
                    // Secondary sort by full name if last names are identical
                    return a.name.localeCompare(b.name) * dir;
                }
                if (key === 'evaluationCount') {
                    return (a.evaluationCount - b.evaluationCount) * dir;
                }
                if (key === 'avgRating' || key === 'recommendationRate') {
                    return (parseFloat(a[key]) - parseFloat(b[key])) * dir;
                }
                return 0;
            });
        }
        return filteredItems;
    }, [summaries, sortConfig, searchTerm, filterByProgramme]);

    const handleSort = (key: SortableKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    if (selectedLecturerId) {
        return (
            <LecturerDetailView
                lecturerId={selectedLecturerId}
                evaluations={evaluations}
                summaries={summaries}
                programmes={programmes}
                courses={courses}
                onBack={() => setSelectedLecturerId(null)}
            />
        );
    }

    if (summaries.length === 0) {
        return (
            <div className="text-center py-12 bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <User size={48} className="mx-auto text-slate-400" />
                <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">No Lecturer Data Available</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">There are no evaluations to summarize lecturer performance from.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 [.high-contrast_&]:bg-black border-b border-slate-200 dark:border-slate-700 [.high-contrast_&]:border-yellow-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="lecturer-search" className="sr-only">Search Lecturers</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                id="lecturer-search"
                                placeholder="Search by lecturer name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 [.high-contrast_&]:bg-black [.high-contrast_&]:text-white [.high-contrast_&]:border-yellow-300 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 [.high-contrast_&]:focus:ring-cyan-400 focus:border-sky-500 dark:focus:border-sky-400 [.high-contrast_&]:focus:border-cyan-400 transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="programme-filter" className="sr-only">Filter by Programme</label>
                        <select
                            id="programme-filter"
                            value={filterByProgramme}
                            onChange={(e) => setFilterByProgramme(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 [.high-contrast_&]:bg-black [.high-contrast_&]:text-white [.high-contrast_&]:border-yellow-300 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 [.high-contrast_&]:focus:ring-cyan-400 focus:border-sky-500 dark:focus:border-sky-400 [.high-contrast_&]:focus:border-cyan-400 transition"
                        >
                            <option value="all">All Programmes</option>
                            {programmes.map(prog => (
                                <option key={prog.id} value={prog.id}>{prog.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                {processedSummaries.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 [.high-contrast_&]:divide-yellow-300">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 [.high-contrast_&]:bg-black">
                            <tr>
                                <SortableHeader label="Lecturer" sortKey="name" sortConfig={sortConfig} onClick={() => handleSort('name')} />
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 [.high-contrast_&]:text-white uppercase tracking-wider">Courses Taught</th>
                                <SortableHeader label="Evaluations" sortKey="evaluationCount" sortConfig={sortConfig} onClick={() => handleSort('evaluationCount')} className="text-center" />
                                <SortableHeader label="Avg. Rating" sortKey="avgRating" sortConfig={sortConfig} onClick={() => handleSort('avgRating')} className="text-center" />
                                <SortableHeader label="Recommendation" sortKey="recommendationRate" sortConfig={sortConfig} onClick={() => handleSort('recommendationRate')} className="text-center" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 [.high-contrast_&]:divide-yellow-300 bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black">
                            {processedSummaries.map(summary => (
                                <tr key={summary.id} onClick={() => setSelectedLecturerId(summary.id)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 [.high-contrast_&]:hover:bg-slate-900 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white">{summary.name}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300 truncate max-w-xs" title={summary.programmesTaught.map(p => p.name).join(', ')}>
                                            {summary.programmesTaught.map(p => p.name).join(', ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-2 max-w-xs">
                                            {summary.coursesTaught.map(course => (
                                                <span key={course.id} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300 [.high-contrast_&]:bg-cyan-900/50 [.high-contrast_&]:text-cyan-300" title={course.name}>
                                                    {course.id.toUpperCase()}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">
                                            <FileText size={16} className="text-slate-400" />
                                            <span>{summary.evaluationCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 [.high-contrast_&]:text-yellow-300">
                                            <Star size={16} />
                                            <span>{summary.avgRating}</span>
                                            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">/ 5</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 [.high-contrast_&]:text-green-400">
                                            <Users size={16} />
                                            <span>{summary.recommendationRate}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                     <div className="text-center py-12 px-4">
                        <Search size={48} className="mx-auto text-slate-400" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-200 [.high-contrast_&]:text-white">No Lecturers Found</h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">Your search and filter criteria did not match any lecturers.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturersView;