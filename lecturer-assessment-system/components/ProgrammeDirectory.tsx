
import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';

const ProgrammeDirectory: React.FC = () => {
    const { state } = useAppStore();

    const programmeStats = useMemo(() => {
        return state.programmes.map(programme => {
            const courseCount = state.courses.filter(c => c.programmeId === programme.id).length;
            const lecturerCount = state.lecturers.filter(l => l.programmeId === programme.id).length;
            const assessmentCount = state.assessments.filter(a => a.programmeId === programme.id).length;

            return {
                ...programme,
                courseCount,
                lecturerCount,
                assessmentCount
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [state.programmes, state.courses, state.lecturers, state.assessments]);

    if (programmeStats.length === 0) {
        return (
            <div className="text-center bg-brand-surface p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-brand-text-primary">No Programmes Found</h2>
                <p className="mt-2 text-brand-text-primary/80">Programme data may not be loaded correctly.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Programme Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programmeStats.map(programme => (
                    <div key={programme.id} className="bg-brand-surface p-5 rounded-lg shadow-lg border-l-4 border-brand-secondary hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                        <h3 className="text-xl font-bold text-brand-primary mb-3">{programme.name}</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-brand-text-primary/80">Total Courses:</span>
                                <span className="font-bold text-brand-primary-dark">{programme.courseCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-text-primary/80">Total Lecturers:</span>
                                <span className="font-bold text-brand-primary-dark">{programme.lecturerCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-text-primary/80">Assessments Submitted:</span>
                                <span className="font-bold text-brand-primary-dark">{programme.assessmentCount}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgrammeDirectory;
