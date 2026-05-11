
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StageContent from './components/StageContent';
import ProjectHeader from './components/ProjectHeader';
import AdminPanel from './components/AdminPanel';
import { STAGES } from './constants';
import { Stage, ProjectProgress, PointProgress } from './types';

const App: React.FC = () => {
    // State for the project name, initialized from localStorage
    const [projectName, setProjectName] = useState<string>(() => {
        return localStorage.getItem('projectName') || '';
    });

    // State for the interactive progress, initialized from localStorage
    const [progress, setProgress] = useState<ProjectProgress>(() => {
        const savedProgress = localStorage.getItem('projectProgress');
        return savedProgress ? JSON.parse(savedProgress) : {};
    });
    
    const [selectedStageId, setSelectedStageId] = useState<number>(STAGES[0].id);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

    // Effect to save project name to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('projectName', projectName);
    }, [projectName]);

    // Effect to save progress to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('projectProgress', JSON.stringify(progress));
    }, [progress]);

    const handleSelectStage = (id: number) => {
        setSelectedStageId(id);
    };

    const handleProgressChange = (stageId: number, pointIndex: number, newPointProgress: Partial<PointProgress>) => {
        setProgress(prev => {
            const currentPointProgress = prev[stageId]?.[pointIndex] || { checked: false, notes: '' };
            return {
                ...prev,
                [stageId]: {
                    ...prev[stageId],
                    [pointIndex]: { ...currentPointProgress, ...newPointProgress },
                }
            };
        });
    };
    
    const handleClearAllData = () => {
        setProjectName('');
        setProgress({});
        // Local storage will be cleared by the admin panel directly, these updates trigger re-render
    };

    const selectedStage: Stage | undefined = STAGES.find(s => s.id === selectedStageId);

    if (!selectedStage) {
      return <div className="text-white text-center p-8">Error: Stage not found.</div>;
    }

    return (
        <div className="min-h-screen font-sans md:flex bg-white dark:bg-slate-900 text-slate-800 dark:text-white hc:bg-black hc:text-yellow-300">
            <Sidebar
                stages={STAGES}
                currentStageId={selectedStageId}
                onSelectStage={handleSelectStage}
                progress={progress}
                onAdminClick={() => setIsAdminPanelOpen(true)}
            />
            <div className="flex-1 md:h-screen md:overflow-y-auto">
                <ProjectHeader projectName={projectName} onProjectNameChange={setProjectName} />
                <StageContent 
                    stage={selectedStage}
                    progress={progress[selectedStage.id] || {}}
                    onProgressChange={handleProgressChange}
                    projectName={projectName}
                />
            </div>
            {isAdminPanelOpen && (
                <AdminPanel 
                    onClose={() => setIsAdminPanelOpen(false)}
                    onClearAllData={handleClearAllData}
                />
            )}
        </div>
    );
};

export default App;