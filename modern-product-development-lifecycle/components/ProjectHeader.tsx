import React from 'react';

interface ProjectHeaderProps {
    projectName: string;
    onProjectNameChange: (name: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectName, onProjectNameChange }) => {
    return (
        <header className="bg-white/80 dark:bg-slate-900/80 hc:bg-black backdrop-blur-sm p-4 md:p-8 lg:px-12 border-b border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50 sticky top-0 z-20">
            <div className="max-w-4xl mx-auto">
                <label htmlFor="projectName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 hc:text-yellow-300/90 mb-2">Your Product Idea</label>
                <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={projectName}
                    onChange={(e) => onProjectNameChange(e.target.value)}
                    placeholder="e.g., Smart Coffee Mug"
                    className="w-full p-2 bg-slate-100 dark:bg-slate-800 hc:bg-black border border-slate-300 dark:border-slate-700 hc:border-yellow-300/60 rounded-lg text-slate-900 dark:text-white hc:text-yellow-300 placeholder-slate-400 dark:placeholder-slate-500 hc:placeholder-yellow-300/50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hc:focus:ring-yellow-300 hc:focus:border-yellow-300 transition"
                    aria-label="Project Name Input"
                />
            </div>
        </header>
    );
};

export default ProjectHeader;