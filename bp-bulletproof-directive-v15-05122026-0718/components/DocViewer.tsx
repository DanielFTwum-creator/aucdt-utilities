import React, { useState } from 'react';
import { Icons } from './Icons';
import { Framework } from '../types';
import Markdown from 'react-markdown';

// Import raw documentation files
import srsContent from '../docs/TUC-ICT-SRS-2026-001.md?raw';
import systemArchSvg from '../docs/SystemArchitecture.svg?raw';
import databaseArchSvg from '../docs/DatabaseArchitecture.svg?raw';
import adminGuideContent from '../docs/ADMIN_GUIDE.md?raw';
import deploymentGuideContent from '../docs/DEPLOYMENT_GUIDE.md?raw';
import testingGuideContent from '../docs/TESTING_GUIDE.md?raw';
import appStoreGuideContent from '../docs/APP_STORE_GUIDE.md?raw';
import mobileBuildGuideContent from '../docs/MOBILE_BUILD_GUIDE.md?raw';
import appIconsGuideContent from '../docs/APP_ICONS_GUIDE.md?raw';
import appStoreReadyContent from '../docs/APPSTORE_READY.md?raw';

interface DocViewerProps {
    isOpen: boolean;
    onClose: () => void;
    currentFramework: Framework;
    completedPhases: number[];
}

type TabKey = 'srs' | 'system' | 'database' | 'admin' | 'deployment' | 'testing' | 'mobile';

export const DocViewer: React.FC<DocViewerProps> = ({ isOpen, onClose, currentFramework, completedPhases }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('srs');

    if (!isOpen) return null;

    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: 'srs', label: 'SRS', icon: <Icons.FileText className="w-4 h-4" /> },
        { key: 'system', label: 'System Arch', icon: <Icons.Activity className="w-4 h-4" /> },
        { key: 'database', label: 'Database Arch', icon: <Icons.Database className="w-4 h-4" /> },
        { key: 'admin', label: 'Admin Guide', icon: <Icons.Lock className="w-4 h-4" /> },
        { key: 'deployment', label: 'Deployment', icon: <Icons.Globe className="w-4 h-4" /> },
        { key: 'testing', label: 'Testing', icon: <Icons.TestTube className="w-4 h-4" /> },
        { key: 'mobile', label: 'Mobile Deployment', icon: <Icons.Smartphone className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-6xl h-[90vh] bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-bg-tertiary/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent-secondary/10 text-accent-secondary">
                            <Icons.FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-mono text-xl font-bold text-text-primary">Project Documentation</h2>
                            <p className="text-xs text-text-muted uppercase tracking-wider">{currentFramework.title}</p>
                        </div>
                    </div>
                    
                    <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary rounded-lg">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 border-r border-border bg-bg-tertiary/30 overflow-y-auto p-4 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    activeTab === tab.key 
                                        ? 'bg-accent-secondary text-white shadow-md shadow-accent-secondary/20' 
                                        : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-bg-primary/50 relative">
                        {activeTab === 'srs' && (
                            <div className="absolute inset-0 p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto container mx-auto px-4 sm:px-6 lg:px-8 py-10 prose prose-slate dark:prose-invert" >
                                    <div className="bg-bg-secondary p-6 rounded-xl border border-border mb-8">
                                        <h4 className="font-bold text-text-primary text-sm mb-2">Completion Status</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-bg-tertiary h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-accent-secondary h-full rounded-full" 
                                                    style={{ width: `${(completedPhases.length / currentFramework.phases.length) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-mono text-text-muted">{completedPhases.length}/{currentFramework.phases.length} Phases</span>
                                        </div>
                                    </div>
                                    <Markdown>{srsContent}</Markdown>
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="absolute inset-0 p-8 flex flex-col items-center overflow-y-auto">
                                <div className="max-w-5xl w-full bg-white p-6 rounded-xl shadow-xl">
                                    <div dangerouslySetInnerHTML={{ __html: systemArchSvg }} className="w-full text-center" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'database' && (
                            <div className="absolute inset-0 p-8 flex flex-col items-center overflow-y-auto">
                                <div className="max-w-5xl w-full bg-white p-6 rounded-xl shadow-xl">
                                    <div dangerouslySetInnerHTML={{ __html: databaseArchSvg }} className="w-full text-center" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'admin' && (
                            <div className="absolute inset-0 p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto prose dark:prose-invert">
                                    <Markdown>{adminGuideContent}</Markdown>
                                </div>
                            </div>
                        )}

                        {activeTab === 'deployment' && (
                            <div className="absolute inset-0 p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto prose dark:prose-invert">
                                    <Markdown>{deploymentGuideContent}</Markdown>
                                </div>
                            </div>
                        )}

                        {activeTab === 'testing' && (
                            <div className="absolute inset-0 p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto prose dark:prose-invert">
                                    <Markdown>{testingGuideContent}</Markdown>
                                </div>
                            </div>
                        )}

                        {activeTab === 'mobile' && (
                            <div className="absolute inset-0 p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto prose dark:prose-invert space-y-12">
                                    <div>
                                        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-accent-secondary/10 text-accent-secondary text-xs font-bold uppercase tracking-wider">Step 1</div>
                                        <Markdown>{appStoreReadyContent}</Markdown>
                                    </div>
                                    <div className="border-t border-border/50 pt-12">
                                        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-accent-secondary/10 text-accent-secondary text-xs font-bold uppercase tracking-wider">Step 2</div>
                                        <Markdown>{appIconsGuideContent}</Markdown>
                                    </div>
                                    <div className="border-t border-border/50 pt-12">
                                        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-accent-secondary/10 text-accent-secondary text-xs font-bold uppercase tracking-wider">Step 3</div>
                                        <Markdown>{mobileBuildGuideContent}</Markdown>
                                    </div>
                                    <div className="border-t border-border/50 pt-12">
                                        <div className="inline-block px-3 py-1 mb-4 rounded-full bg-accent-secondary/10 text-accent-secondary text-xs font-bold uppercase tracking-wider">Step 4</div>
                                        <Markdown>{appStoreGuideContent}</Markdown>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
