import React, { useState } from 'react';
import { SrsContent } from './SrsContent';
import { SystemDiagrams } from './SystemDiagrams';
import { Guides } from './Guides';

type DocTab = 'srs' | 'diagrams' | 'guides';

export const DocsContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<DocTab>('srs');

    const getTabClasses = (tabName: DocTab) => {
        const baseClasses = "px-4 py-2 text-sm sm:text-base font-semibold rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2";
        if (activeTab === tabName) {
            return `${baseClasses} bg-[var(--color-accent-primary)] text-[var(--color-text-on-accent)]`;
        }
        return `${baseClasses} bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-primary)]`;
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'srs':
                return <SrsContent />;
            case 'diagrams':
                return <SystemDiagrams />;
            case 'guides':
                return <Guides />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
                <div className="mb-6 sm:mb-8 border-b border-[var(--color-border-primary)] pb-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">Application Documentation</h1>
                    <p className="text-[var(--color-text-secondary)] mt-1">Comprehensive guides, diagrams, and specifications for BioChemAI.</p>
                </div>

                <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-4 mb-6 sm:mb-8">
                    <button onClick={() => setActiveTab('srs')} className={getTabClasses('srs')}>SRS Document</button>
                    <button onClick={() => setActiveTab('diagrams')} className={getTabClasses('diagrams')}>Diagrams</button>
                    <button onClick={() => setActiveTab('guides')} className={getTabClasses('guides')}>Guides</button>
                </div>
                
                <div className="animate-fade-in">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};