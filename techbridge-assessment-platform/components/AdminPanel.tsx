import { Download, FileText, RefreshCw, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { initialProgrammeData } from '../constants';
import { LogEntry, ProgrammeData } from '../types';
import Modal from './ui/Modal';

interface AdminPanelProps {
    programmeData: ProgrammeData;
    setProgrammeData: React.Dispatch<React.SetStateAction<ProgrammeData>>;
    log: LogEntry[];
    setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ programmeData, setProgrammeData, log, setLog }) => {
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState<'clearLog' | 'resetData' | null>(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportProgrammes = () => {
        const dataStr = JSON.stringify(programmeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-programmes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage({ text: 'TUC Programme data exported successfully.', type: 'success' });
    };

    const handleImportProgrammes = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    if (json.programmes && json.questions) {
                        setProgrammeData(json);
                        setMessage({ text: 'Programme data imported successfully.', type: 'success' });
                    } else {
                        throw new Error('Invalid file structure.');
                    }
                } catch (error: any) {
                    setMessage({ text: `Import failed: ${error.message}`, type: 'error' });
                }
            };
            reader.readAsText(file);
        } else {
            setMessage({ text: 'Please select a valid JSON file.', type: 'error' });
        }
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleExportLog = () => {
        const dataStr = JSON.stringify(log, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-audit-log.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage({ text: 'Audit log exported successfully.', type: 'success' });
    };

    const performAction = () => {
        if (action === 'clearLog') {
            setLog([]);
            setMessage({ text: 'Audit log cleared.', type: 'success' });
        } else if (action === 'resetData') {
            setProgrammeData(initialProgrammeData);
            setMessage({ text: 'Programme data reset to default.', type: 'success' });
        }
        setShowModal(false);
        setAction(null);
    };

    const adminActions = [
        { label: 'Export Programme Data', icon: Download, action: handleExportProgrammes, color: 'blue' },
        { label: 'Import Programme Data', icon: Upload, action: () => fileInputRef.current?.click(), color: 'blue' },
        { label: 'Export Audit Log', icon: FileText, action: handleExportLog, color: 'green' },
        { label: 'Clear Audit Log', icon: Trash2, action: () => { setAction('clearLog'); setShowModal(true); }, color: 'red' },
        { label: 'Reset All Data', icon: RefreshCw, action: () => { setAction('resetData'); setShowModal(true); }, color: 'red' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-tuc-brown-dark mb-6">TUC Administrative Panel</h2>
            {message.text && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <input type="file" ref={fileInputRef} onChange={handleImportProgrammes} accept=".json" className="hidden" />
                {adminActions.map(act => (
                    <div key={act.label} onClick={act.action}
                         className={`bg-white p-6 rounded-xl shadow-sm cursor-pointer flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-1 border-b-4 border-${act.color}-500`}>
                        <act.icon className={`w-10 h-10 mb-3 text-${act.color}-600`} />
                        <span className="font-semibold text-tuc-brown-dark">{act.label}</span>
                    </div>
                ))}
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h3 className="text-lg font-bold text-tuc-brown-dark mb-4">Confirm Action</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to {action === 'clearLog' ? 'clear the audit log' : 'reset all programme data'}? This cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={performAction} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPanel;