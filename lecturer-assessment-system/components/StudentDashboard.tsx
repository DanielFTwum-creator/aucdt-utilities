
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { Programme, Course } from '../types';
import QuizModal from './QuizModal';

const StudentDashboard: React.FC = () => {
    const { state } = useAppStore();
    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
    const [courseForQuiz, setCourseForQuiz] = useState<Course | null>(null);

    const handleProgrammeClick = (programme: Programme) => {
        setSelectedProgramme(programme);
    };

    const handleBackClick = () => {
        setSelectedProgramme(null);
    };

    const programmeCourses = useMemo(() => {
        if (!selectedProgramme) return {};
        const courses = state.courses.filter(c => c.programmeId === selectedProgramme.id);
        return courses.reduce((acc, course) => {
            const year = `Year ${course.year}`;
            if (!acc[year]) acc[year] = [];
            acc[year].push(course);
            return acc;
        }, {} as Record<string, Course[]>);
    }, [selectedProgramme, state.courses]);

    if (selectedProgramme) {
        return (
            <div className="bg-brand-surface p-6 rounded-lg shadow-lg animate-fade-in">
                <button onClick={handleBackClick} className="mb-4 bg-brand-primary text-brand-text-light px-4 py-2 rounded-md hover:opacity-90 transition-colors">
                    &larr; Back to Programmes
                </button>
                <h2 className="text-4xl font-bold text-brand-primary-dark mb-4">{selectedProgramme.name} Curriculum</h2>
                <div className="space-y-6">
                    {Object.keys(programmeCourses).sort().map(year => (
                        <div key={year}>
                            <h3 className="text-2xl font-medium text-brand-text-primary border-b-2 border-brand-secondary-light pb-2 mb-3">{year}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {programmeCourses[year].map(course => (
                                    <div key={course.id} className="bg-brand-warm-beige/30 p-4 rounded-md shadow-sm">
                                        <h4 className="font-bold">{course.name}</h4>
                                        <p className="text-sm text-brand-text-primary/70">Semester {course.semester}</p>
                                        {course.quiz && (
                                            <button 
                                                onClick={() => setCourseForQuiz(course)}
                                                className="mt-2 bg-brand-accent text-brand-text-light px-3 py-1 text-sm rounded-md hover:opacity-90 transition-opacity">
                                                Start Quiz
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {courseForQuiz && courseForQuiz.quiz && (
                    <QuizModal course={courseForQuiz} onClose={() => setCourseForQuiz(null)} />
                )}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Academic Programmes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.programmes.map(programme => (
                    <div key={programme.id} onClick={() => handleProgrammeClick(programme)}
                        className="bg-brand-surface p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-l-4 border-brand-secondary">
                        <h3 className="text-2xl font-medium text-brand-primary">{programme.name}</h3>
                        <p className="text-brand-text-primary/80 mt-2">
                            {state.courses.filter(c => c.programmeId === programme.id).length} courses
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;