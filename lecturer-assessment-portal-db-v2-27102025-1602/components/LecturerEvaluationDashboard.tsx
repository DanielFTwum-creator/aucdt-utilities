import React from 'react';
import { FileText, BarChart2, Users, LayoutDashboard, Filter, Shield, HelpCircle, Bot } from 'lucide-react';
import { useEvaluations } from '../hooks/useEvaluations';
import FilterControls from './FilterControls';
import EvaluationCard from './EvaluationCard';
import StatisticsCard from './StatisticsCard';
import AdminPanel from './AdminPanel';
import LecturersView from './LecturersView';
import ProgrammesView from './ProgrammesView';
import AnalyticsView from './AnalyticsView';
import SelfTestView from './SelfTestView';
import { LecturerEvaluation, Programme, Lecturer, Course, DashboardTab, ExtractedProgramme, AuditLog } from '../types';

interface DashboardProps {
    evaluations: LecturerEvaluation[];
    programmes: Programme[];
    lecturers: Lecturer[];
    courses: Course[];
    activeTab: DashboardTab;
    setActiveTab: (tab: DashboardTab) => void;
    onPdfUpdate: (data: ExtractedProgramme[], file: File, duration: number) => void;
    onPdfError: (error: Error, file: File) => void;
    auditLogs: AuditLog[];
}

const GuideCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-[#F8F6F0] dark:bg-[#2C1810]/50 [.high-contrast_&]:bg-black [.high-contrast_&]:border-yellow-300 rounded-lg p-6 border border-l-4 border-[#E6D5C7] dark:border-[#6B1028] border-l-[#D4AF37] [.high-contrast_&]:border-l-yellow-300 flex items-start gap-4">
        <div className="text-[#8B1538] dark:text-[#F4E4BC] [.high-contrast_&]:text-yellow-300 mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-lg text-[#2C1810] dark:text-white [.high-contrast_&]:text-white mb-2">{title}</h4>
            <p className="text-sm text-[#2C1810]/90 dark:text-[#E6D5C7] [.high-contrast_&]:text-white leading-relaxed">{children}</p>
        </div>
    </div>
);

const LecturerEvaluationDashboard: React.FC<DashboardProps> = ({ 
    evaluations, 
    programmes, 
    lecturers, 
    courses,
    activeTab,
    setActiveTab,
    onPdfUpdate,
    onPdfError,
    auditLogs
}) => {
    const {
        filteredEvaluations,
        statistics,
        searchTerm,
        filterBySemester,
        filterByProgramme,
        handleSearchChange,
        handleSemesterFilter,
        handleProgrammeFilter,
        programmeAnalytics,
        lecturerSummary
    } = useEvaluations(evaluations, programmes, lecturers, courses);

    const renderContent = () => {
        switch (activeTab) {
            case 'evaluations':
                return (
                    <>
                        <FilterControls 
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                            filterByProgramme={filterByProgramme}
                            handleProgrammeFilter={handleProgrammeFilter}
                            programmes={programmes}
                            filterBySemester={filterBySemester}
                            handleSemesterFilter={handleSemesterFilter}
                        />
                        {filteredEvaluations.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredEvaluations.map(evaluation => (
                                    <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-[#E6D5C7] dark:border-[#6B1028]">
                                <FileText size={48} className="mx-auto text-[#2C1810]/50 dark:text-[#E6D5C7]/50 [.high-contrast_&]:text-slate-400" />
                                <h3 className="mt-4 text-xl font-semibold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">No Evaluations Found</h3>
                                <p className="mt-2 text-[#2C1810]/80 dark:text-[#E6D5C7]/80 [.high-contrast_&]:text-slate-300">Try adjusting your search or filter criteria.</p>
                            </div>
                        )}
                    </>
                );
            case 'admin':
                return <AdminPanel onPdfUpdate={onPdfUpdate} onPdfError={onPdfError} auditLogs={auditLogs} />;
            case 'lecturers':
                return (
                    <LecturersView 
                        summaries={lecturerSummary} 
                        programmes={programmes} 
                        evaluations={evaluations}
                        courses={courses}
                    />
                );
            case 'overview':
                 return (
                    <div className="bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-l-4 border-[#E6D5C7] dark:border-[#6B1028] border-l-[#D4AF37] [.high-contrast_&]:border-l-yellow-300">
                        <h2 className="text-xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white mb-4">
                            Programme Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {programmeAnalytics.map(prog => (
                                <div key={prog.id} className="bg-[#F8F6F0] dark:bg-[#2C1810]/50 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 p-5 rounded-lg border border-[#E6D5C7] dark:border-[#6B1028]">
                                    <h3 className="font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white truncate" title={prog.name}>{prog.name}</h3>
                                    <div className="mt-3 space-y-2 text-sm text-[#2C1810]/90 dark:text-[#E6D5C7]/90 [.high-contrast_&]:text-slate-300">
                                        <div className="flex justify-between"><span>Lecturers:</span> <span className="font-semibold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">{prog.lecturerCount}</span></div>
                                        <div className="flex justify-between"><span>Courses:</span> <span className="font-semibold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">{prog.courseCount}</span></div>
                                        <div className="flex justify-between"><span>Evaluations:</span> <span className="font-semibold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">{prog.evaluationCount}</span></div>
                                        <div className="flex justify-between"><span>Avg Rating:</span> <span className={`font-semibold ${parseFloat(prog.avgRating) > 0 ? 'text-[#D4AF37] [.high-contrast_&]:text-yellow-300' : 'text-[#2C1810] dark:text-white [.high-contrast_&]:text-white'}`}>{prog.avgRating}/5</span></div>
                                        <div className="flex justify-between"><span>Recommend:</span> <span className={`font-semibold ${parseFloat(prog.recommendationRate) > 0 ? 'text-emerald-600 [.high-contrast_&]:text-green-400' : 'text-[#2C1810] dark:text-white [.high-contrast_&]:text-white'}`}>{prog.recommendationRate}%</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'guides':
                return (
                    <div className="space-y-8">
                        <div className="bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-l-4 border-[#E6D5C7] dark:border-[#6B1028] border-l-[#D4AF37] [.high-contrast_&]:border-l-yellow-300">
                           <div className="flex items-start gap-4">
                               <HelpCircle size={28} className="text-[#D4AF37] [.high-contrast_&]:text-yellow-300 flex-shrink-0 mt-1" />
                               <div>
                                    <h2 className="text-2xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">
                                        Administrator's Guide
                                    </h2>
                                    <p className="text-[#2C1810]/90 dark:text-[#E6D5C7] [.high-contrast_&]:text-white mt-2">
                                        Welcome! This guide provides a quick overview of the key features available in the admin dashboard to help you get started. For a more detailed guide, please refer to the `ADMINISTRATOR_GUIDE.md` document in the project files.
                                    </p>
                               </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <GuideCard icon={<LayoutDashboard size={24} />} title="Overview Dashboard">
                                The main dashboard provides a high-level summary. The top cards show total evaluations, overall average rating, and the recommendation rate. The "Programme Overview" section gives a detailed breakdown of stats for each academic programme.
                            </GuideCard>
                             <GuideCard icon={<Filter size={24} />} title="Filtering Evaluation Results">
                                In the "Results" tab, you can dive into individual feedback. Use the search bar to find specific lecturers or courses, and apply filters for different programmes or semesters to narrow down the results and find the insights you need.
                            </GuideCard>
                             <GuideCard icon={<Shield size={24} />} title="Admin Panel Functions">
                                The "Admin Panel" is your hub for managing the portal's data. Here you can automatically update the curriculum using the AI PDF extractor and monitor all important system activities via the Audit Logs.
                            </GuideCard>
                             <GuideCard icon={<Bot size={24} />} title="Self-Testing Suite">
                                The "Self Test" tab contains a demonstration of the application's end-to-end test suite. Run it to verify that core user journeys are working correctly. After a test runs, you can click the camera icon to see a simulated screenshot of the result.
                            </GuideCard>
                        </div>
                    </div>
                );
            case 'programmes':
                return <ProgrammesView programmeAnalytics={programmeAnalytics} />;
            case 'analytics':
                return <AnalyticsView evaluations={evaluations} />;
            case 'selfTest':
                return <SelfTestView />;
            default:
                return (
                    <div className="text-center py-20 bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg shadow-sm border border-[#E6D5C7] dark:border-[#6B1028]">
                        <BarChart2 size={56} className="mx-auto text-[#8B1538] [.high-contrast_&]:text-yellow-300" />
                        <h2 className="mt-6 text-2xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">Feature Not Implemented</h2>
                        <p className="mt-3 text-[#2C1810]/80 dark:text-[#E6D5C7]/80 [.high-contrast_&]:text-slate-300">The "{activeTab}" tab is currently under construction. Please check back later.</p>
                    </div>
                );
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white mb-2">
                Lecturer Evaluation Dashboard
            </h1>
            <p className="text-[#2C1810]/80 dark:text-[#E6D5C7] [.high-contrast_&]:text-slate-300 mb-8">
                Welcome, Admin. Review and analyze evaluation data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatisticsCard
                    title="Total Evaluations"
                    value={statistics.totalEvaluations.toString()}
                    icon={<FileText size={24} className="text-[#8B1538] [.high-contrast_&]:text-cyan-400" />}
                    colorClass="bg-[#8B1538]/10 [.high-contrast_&]:bg-cyan-900/50"
                />
                <StatisticsCard
                    title="Average Rating"
                    value={statistics.averageOverallRating}
                    suffix="/5"
                    icon={<BarChart2 size={24} className="text-[#D4AF37] [.high-contrast_&]:text-cyan-400" />}
                    colorClass="bg-[#D4AF37]/10 [.high-contrast_&]:bg-cyan-900/50"
                />
                <StatisticsCard
                    title="Recommendation Rate"
                    value={statistics.recommendationRate}
                    suffix="%"
                    icon={<Users size={24} className="text-[#2E4034] [.high-contrast_&]:text-cyan-400" />}
                    colorClass="bg-[#2E4034]/10 [.high-contrast_&]:bg-cyan-900/50"
                />
            </div>

            {renderContent()}
        </div>
    );
};

export default LecturerEvaluationDashboard;