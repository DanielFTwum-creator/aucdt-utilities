
import React, { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import DataManagement from './DataManagement';
import PdfExtractor from './PdfExtractor';

type AdminSection = 'Data' | 'PDF' | 'Logs';

const AdminPanel: React.FC = () => {
    const { state } = useAppStore();
    const [activeSection, setActiveSection] = useState<AdminSection>('Data');

    const renderSection = () => {
        switch(activeSection) {
            case 'Data':
                return <DataManagement />;
            case 'PDF':
                return <PdfExtractor />;
            case 'Logs':
                return (
                     <div className="mt-4 bg-brand-background p-4 rounded-lg shadow-inner max-h-96 overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-2">Audit Log</h3>
                        {state.auditLogs.length > 0 ? (
                            <ul className="space-y-2">
                                {state.auditLogs.map(log => (
                                    <li key={log.id} className="text-sm bg-brand-surface p-2 rounded">
                                        <span className="font-mono text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                                        <span className={`ml-2 font-semibold ${log.action.includes('Login') ? 'text-green-600' : 'text-blue-600'}`}>{log.action}:</span>
                                        <span className="ml-2 text-brand-text-primary/90">{log.message}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-brand-text-primary/80">No system events logged yet.</p>
                        )}
                    </div>
                );
        }
    }

    return (
        <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-4">Administrator Panel</h2>
            <div className="border-b border-brand-warm-beige">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {(['Data', 'PDF', 'Logs'] as AdminSection[]).map(section => (
                        <button key={section} onClick={() => setActiveSection(section)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeSection === section 
                                    ? 'border-brand-primary text-brand-primary' 
                                    : 'border-transparent text-brand-text-primary/70 hover:text-brand-text-primary hover:border-brand-warm-beige'
                                }`}
                        >
                           {section === 'PDF' ? 'PDF Data Extractor' : section === 'Data' ? 'Data Management' : 'Audit Logs'}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminPanel;