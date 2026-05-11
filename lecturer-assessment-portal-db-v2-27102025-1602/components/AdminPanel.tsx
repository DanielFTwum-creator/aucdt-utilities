import React from 'react';
import DataManagement from './DataManagement';
import PdfExtractor from './PdfExtractor';
import AuditLogs from './AuditLogs';
import { ExtractedProgramme, AuditLog } from '../types';

interface AdminPanelProps {
    onPdfUpdate: (data: ExtractedProgramme[], file: File, duration: number) => void;
    onPdfError: (error: Error, file: File) => void;
    auditLogs: AuditLog[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onPdfUpdate, onPdfError, auditLogs }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2 space-y-8">
                <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-2">
                        AI-Powered PDF Data Extractor
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 [.high-contrast_&]:text-slate-300 mb-6">
                        Automatically extract and update curriculum data from an official timetable PDF. This action will clear all existing evaluations.
                    </p>
                    <PdfExtractor onPdfUpdate={onPdfUpdate} onPdfError={onPdfError} />
                </div>
                <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-4">
                        Data Management
                    </h2>
                     <DataManagement />
                </div>
            </div>

            <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 xl:col-span-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 [.high-contrast_&]:text-white mb-4">
                    Audit Logs
                </h2>
                <AuditLogs logs={auditLogs} />
            </div>
        </div>
    );
};

export default AdminPanel;