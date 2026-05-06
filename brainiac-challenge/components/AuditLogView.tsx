import React, { useState, useRef } from 'react';
import { AuditLog, Quiz, Question, View } from '../types';
import { RefreshCw } from 'lucide-react';
import Modal from './Modal';
import QuestionCard from './QuestionCard';

interface AuditLogViewProps {
    logs: AuditLog[];
    setLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
    isPersistenceEnabled: boolean;
    setView: (view: View) => void;
}

const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, setLogs, isPersistenceEnabled, setView }) => {
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
    const [previewQuestionIndex, setPreviewQuestionIndex] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        if(logs.length === 0) {
            alert("No logs to export.");
            return;
        }
        const dataStr = JSON.stringify(logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `brainiac-challenge-logs-${new Date().toISOString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Invalid file content");
                const importedLogs = JSON.parse(text) as AuditLog[];
                if (!Array.isArray(importedLogs) || (importedLogs.length > 0 && !importedLogs[0].geminiPrompt)) {
                    throw new Error("Invalid log file format.");
                }
                if (isPersistenceEnabled) {
                     alert("Import is not supported when Firebase persistence is enabled. Please disable Firebase to import local logs.");
                } else {
                     setLogs(importedLogs);
                     alert(`${importedLogs.length} logs imported successfully. These will not be persisted.`);
                }
            } catch (error) {
                alert(`Failed to import logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    
    const handlePreview = (log: AuditLog) => {
        try {
            const questions = JSON.parse(log.geminiResponse) as Question[];
            if (!Array.isArray(questions)) throw new Error("Log data is not a valid question array.");
            
            const quizToPreview: Quiz = {
                id: log.id,
                settings: log.settings,
                questions: questions,
                createdAt: log.timestamp,
            };
            setPreviewQuestionIndex(0);
            setPreviewQuiz(quizToPreview);
        } catch (error) {
            alert(`Failed to parse quiz data for preview. ${error instanceof Error ? error.message : ''}`);
            console.error("Error parsing preview quiz:", error);
        }
    };
    
    const handleClosePreview = () => {
        setPreviewQuiz(null);
    };

    return (
        <div className="max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setView(View.REFRESH_STATUS)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#7C3AED]/20 transition-all"
                    >
                        <RefreshCw size={18} />
                        Refresh Protocol
                    </button>
                    <button 
                        onClick={() => setView(View.SETUP)}
 className="text-gray-300 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-white">Quiz Audit Log</h2>
                        <p className="text-gray-400 mt-1">Review previously generated quizzes.</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                    <button onClick={handleImportClick} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors">Import</button>
                    <button onClick={handleExport} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 transition-colors">Export All</button>
                </div>
            </div>
            {!isPersistenceEnabled && <div className="bg-yellow-900/30 border border-yellow-600 text-yellow-300 p-3 rounded-md mb-6 text-sm">Firebase is not configured. Audit logs are not being persisted and will be lost on refresh.</div>}
            
            <div className="bg-[#1a2e28] rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {logs.length > 0 ? (
                        <table className="min-w-full divide-y divide-emerald-800">
                            <thead className="bg-emerald-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Topic</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Difficulty</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#1a2e28] divide-y divide-emerald-800">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-emerald-900/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.settings.topic}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.settings.level}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.settings.difficulty}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handlePreview(log)} className="text-green-400 hover:text-green-300 mr-4">Preview</button>
                                            <button onClick={() => setSelectedLog(log)} className="text-yellow-400 hover:text-yellow-300">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="text-center py-16 px-6">
                            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-white">No audit logs</h3>
                            <p className="mt-1 text-sm text-gray-500">Generate a new quiz to see its log appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedLog && (
                <Modal title="Audit Log Details" onClose={() => setSelectedLog(null)}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-yellow-400">Gemini Prompt</h4>
                            <pre className="mt-1 p-3 bg-[#142520] text-gray-300 rounded-md text-sm whitespace-pre-wrap font-mono">{selectedLog.geminiPrompt}</pre>
                        </div>
                        <div>
                            <h4 className="font-semibold text-yellow-400">Gemini JSON Response</h4>
                            <pre className="mt-1 p-3 bg-[#142520] text-gray-300 rounded-md text-sm whitespace-pre-wrap font-mono h-96 overflow-auto">{selectedLog.geminiResponse}</pre>
                        </div>
                    </div>
                </Modal>
            )}

            {previewQuiz && (
                <Modal title={`Quiz Preview: ${previewQuiz.settings.topic}`} onClose={handleClosePreview}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Question {previewQuestionIndex + 1} of {previewQuiz.questions.length}</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPreviewQuestionIndex(i => Math.max(0, i - 1))}
                                    disabled={previewQuestionIndex === 0}
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPreviewQuestionIndex(i => Math.min(previewQuiz.questions.length - 1, i + 1))}
                                    disabled={previewQuestionIndex === previewQuiz.questions.length - 1}
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        <QuestionCard
                            key={previewQuestionIndex}
                            question={previewQuiz.questions[previewQuestionIndex]}
                            isPreview={true}
                            onAnswer={() => {}}
                            onNext={() => {}}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AuditLogView;