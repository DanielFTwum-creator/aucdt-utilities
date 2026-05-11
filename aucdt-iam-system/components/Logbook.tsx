import React, { useState } from 'react';
import { User, LogEntry, Role, LogStatus } from '../types';
import { summarizeLogbookEntry } from '../services/geminiService';

interface LogbookProps {
  user: User;
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export const Logbook: React.FC<LogbookProps> = ({ user, logs, setLogs }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<LogEntry>>({
    date: new Date().toISOString().split('T')[0],
    hours: 0,
    activities: '',
    summary: '',
    status: LogStatus.PENDING
  });

  const handleAI = async () => {
    if (!newEntry.activities) return;
    setIsGenerating(true);
    try {
      const summary = await summarizeLogbookEntry(newEntry.activities);
      setNewEntry(prev => ({ ...prev, summary }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: LogEntry = {
      id: Date.now().toString(),
      studentId: user.id,
      date: newEntry.date!,
      hours: Number(newEntry.hours),
      activities: newEntry.activities!,
      summary: newEntry.summary || newEntry.activities!,
      status: LogStatus.PENDING
    };
    setLogs(prev => [entry, ...prev]);
    setModalOpen(false);
    setNewEntry({ date: new Date().toISOString().split('T')[0], hours: 0, activities: '', summary: '', status: LogStatus.PENDING });
  };

  const handleApprove = (id: string, status: LogStatus) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const canEdit = user.role === Role.STUDENT;
  const canApprove = user.role === Role.ORGANIZATION;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Daily Logbook</h2>
        {canEdit && (
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Create new logbook entry"
          >
            <i className="fas fa-plus mr-2" aria-hidden="true"></i> New Entry
          </button>
        )}
      </div>

      <div className="grid gap-4" role="list">
        {logs.map(log => (
          <div key={log.id} className="bg-white dark:bg-darkcard p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4" role="listitem">
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-500 dark:text-gray-400 text-sm" aria-label={`Date: ${log.date}`}><i className="far fa-calendar-alt mr-1" aria-hidden="true"></i> {log.date}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm" aria-label={`Duration: ${log.hours} hours`}><i className="far fa-clock mr-1" aria-hidden="true"></i> {log.hours} hrs</span>
                     <span className={`px-2 py-0.5 rounded text-xs font-semibold border
                        ${log.status === LogStatus.APPROVED ? 'bg-green-50 border-green-200 text-green-700' : 
                          log.status === LogStatus.REJECTED ? 'bg-red-50 border-red-200 text-red-700' : 
                          'bg-yellow-50 border-yellow-200 text-yellow-700'}`} aria-label={`Status: ${log.status}`}>
                        {log.status}
                     </span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Summary</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{log.summary}</p>
                
                <details className="mt-3 group">
                    <summary className="text-xs text-blue-500 cursor-pointer hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded inline-block px-1">View Raw Notes</summary>
                    <p className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-500 font-mono whitespace-pre-wrap border dark:border-gray-600">{log.activities}</p>
                </details>
             </div>

             {canApprove && log.status === LogStatus.PENDING && (
                 <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 dark:border-gray-700">
                     <button 
                        onClick={() => handleApprove(log.id, LogStatus.APPROVED)} 
                        className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 dark:bg-green-900 dark:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500" 
                        title="Approve"
                        aria-label="Approve Entry"
                     >
                         <i className="fas fa-check" aria-hidden="true"></i>
                     </button>
                     <button 
                        onClick={() => handleApprove(log.id, LogStatus.REJECTED)} 
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500" 
                        title="Reject"
                        aria-label="Reject Entry"
                     >
                         <i className="fas fa-times" aria-hidden="true"></i>
                     </button>
                 </div>
             )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-white dark:bg-darkcard rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h3 id="modal-title" className="font-bold text-lg text-gray-800 dark:text-white">New Log Entry</h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Close Modal">
                    <i className="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
                        <input type="date" required className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hours</label>
                        <input type="number" required min="0" max="24" className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none" 
                            value={newEntry.hours} onChange={e => setNewEntry({...newEntry, hours: Number(e.target.value)})} />
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Raw Activities / Notes</label>
                    <textarea required rows={4} className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-800 p-2.5 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="List what you did today..."
                        value={newEntry.activities} onChange={e => setNewEntry({...newEntry, activities: e.target.value})}></textarea>
                </div>

                <div className="flex items-center justify-between">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professional Summary</label>
                     <button type="button" onClick={handleAI} disabled={isGenerating || !newEntry.activities} 
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                        {isGenerating ? <><i className="fas fa-spinner fa-spin mr-1" aria-hidden="true"></i> Magic...</> : <><i className="fas fa-magic mr-1" aria-hidden="true"></i> AI Refine</>}
                     </button>
                </div>
                <textarea rows={3} className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-900 p-2.5 bg-gray-50 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="AI generated summary will appear here, or type manually."
                    value={newEntry.summary} onChange={e => setNewEntry({...newEntry, summary: e.target.value})}></textarea>

                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Submit Entry
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};