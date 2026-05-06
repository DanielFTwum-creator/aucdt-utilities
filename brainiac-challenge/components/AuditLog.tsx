

import React, { useState, useRef } from 'react';
import { AuditLogEntry, QuizSettings } from '../types.ts';
import { Button, Card, Modal } from './ui.tsx';

interface AuditLogProps {
  logs: AuditLogEntry[];
  onImport: (logs: AuditLogEntry[]) => void;
  onClose: () => void;
  isLoading: boolean;
}

const SettingsSummary = ({ settings }: {settings: QuizSettings}) => (
    <div className="text-sm text-gray-400">
        <span>{settings.level}</span> &bull; <span>{settings.difficulty}</span> &bull; <span>{settings.numQuestions} Qs</span>
    </div>
);

export const AuditLog = ({ logs, onImport, onClose, isLoading }: AuditLogProps) => {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(logs, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `brainiac-challenge-audit-log-${new Date().toISOString()}.json`;
    link.click();
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
        const content = e.target?.result;
        if (typeof content !== 'string') throw new Error("File content is not readable.");
        const importedLogs = JSON.parse(content);
        if (Array.isArray(importedLogs)) {
          onImport(importedLogs);
        } else {
          alert("Invalid JSON format. The file should contain an array of log entries.");
        }
      } catch (error) {
        alert(`Error parsing JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Quiz Audit Log">
        <div data-testid="audit-log-modal">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleExport} disabled={logs.length === 0} variant="secondary" className="w-full sm:w-auto">Export All as JSON</Button>
                    <Button onClick={handleImportClick} variant="outline" className="w-full sm:w-auto">Import from JSON</Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                </div>

                {isLoading && <p className="text-center text-gray-400 py-8">Loading logs...</p>}

                {!isLoading && logs.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No quiz history found. Start a new challenge to begin logging!</p>
                ) : (
                    <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                        {logs.map((log, index) => (
                            <li key={log.id || index} data-testid={`audit-log-item-${index}`} className="bg-black/20 p-4 rounded-lg border border-transparent cursor-pointer hover:border-[#B8860B]/50 hover:bg-black/30 transition-all" onClick={() => setSelectedLog(log)}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p data-testid={`audit-log-item-${index}-topic`} className="font-bold text-gray-200">{log.settings.topic}</p>
                                        <SettingsSummary settings={log.settings} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-300">{new Date(log.timestamp).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Log Details">
          <div data-testid="audit-log-details-modal">
              {selectedLog && (
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="font-bold text-[#B8860B]">Quiz Settings</h3>
                    <pre className="bg-black/30 p-2 rounded-md text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.settings, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#B8860B]">Gemini Prompt</h3>
                    <p className="bg-black/30 p-2 rounded-md text-sm whitespace-pre-wrap">{selectedLog.prompt}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#B8860B]">Gemini JSON Response</h3>
                     <pre className="bg-black/30 p-2 rounded-md text-sm overflow-x-auto">
                      {JSON.stringify(selectedLog.response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
          </div>
        </Modal>
    </Modal>
  );
};