
import React, { useRef } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { IMPORT_ASSESSMENTS, ADD_LOG } from '../hooks/actions';
import type { Assessment } from '../types';

const DataManagement: React.FC = () => {
    const { state, dispatch } = useAppStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(state.assessments, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `assessments_export_${new Date().toISOString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        dispatch({ type: ADD_LOG, payload: { action: 'Data Exported', message: `${state.assessments.length} assessments exported.` }});
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content is not readable.");
                const importedAssessments: Assessment[] = JSON.parse(text);
                
                // Basic validation
                if (!Array.isArray(importedAssessments) || (importedAssessments.length > 0 && !importedAssessments[0].id)) {
                    throw new Error("Invalid JSON format for assessments.");
                }

                if (window.confirm(`This will replace ${state.assessments.length} existing assessments with ${importedAssessments.length} new ones. Are you sure?`)) {
                    dispatch({ type: IMPORT_ASSESSMENTS, payload: importedAssessments });
                    dispatch({ type: ADD_LOG, payload: { action: 'Data Imported', message: `${importedAssessments.length} assessments imported.` }});
                    alert('Import successful!');
                }
            } catch (error) {
                alert('Failed to import file. Please ensure it is a valid JSON export.');
                console.error(error);
            } finally {
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-4">
             <h3 className="text-xl font-semibold">Assessment Data</h3>
            <div className="flex space-x-4">
                <button onClick={handleExport}
                    className="flex-1 bg-brand-primary text-brand-text-light px-4 py-2 rounded-md hover:opacity-90 transition-colors">
                    Export to JSON
                </button>
                <button onClick={handleImportClick}
                    className="flex-1 bg-brand-accent text-brand-text-light px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                    Import from JSON
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileImport} />
            </div>
        </div>
    );
};

export default DataManagement;