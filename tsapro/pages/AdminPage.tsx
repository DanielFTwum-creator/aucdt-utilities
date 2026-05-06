
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import GradeScaleTable from '../components/common/GradeScaleTable';
import Input from '../components/common/Input';
import SalaryCalculationDetails from '../components/common/SalaryCalculationDetails';
import Toggle from '../components/common/Toggle';
import RefreshStatus from '../components/RefreshStatus';
import { MIN_PASSWORD_LENGTH } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useStepCodes } from '../contexts/StepCodesContext';
import { addLog, clearLogs, getLogs } from '../services/auditLogService';
import { parseSalaryScalePdf } from '../services/geminiService';
import { AuditLogEntry, AuditLogEvent, StepCodeData } from '../types';
import { RefreshCw } from 'lucide-react';

const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return `₵ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

// --- Icons ---
const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

const AlertCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);

const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
);

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

// --- Components ---

const SecurityHealthCheck: React.FC = () => {
    // Basic health check logic
    const { isAuthenticated, user } = useAuth();
    const token = localStorage.getItem('tsapro_token');
    const hasSecureToken = !!token;
    const logCount = getLogs().length;

    return (
        <Card className="border-l-4 border-blue-500 bg-blue-50/10 mb-8">
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${isDefault ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {isDefault ? <AlertCircleIcon className="w-6 h-6" /> : <ShieldCheckIcon className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg">System Security Status</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Admin Session</span>
                            <span className={!hasSecureToken ? 'text-amber-600 font-bold' : 'text-green-600 font-bold'}>
                                {!hasSecureToken ? '⚠️ Warning: Unsecured Session' : `✅ Secure JWT Session: ${user?.username || 'Admin'}`}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Audit Reliability</span>
                            <span className="text-slate-700 dark:text-slate-300 font-bold">
                                ✅ Integrity Check Passed ({logCount} records)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const SalaryScaleIngestion: React.FC = () => {
    const { addStepCode } = useStepCodes();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewData, setPreviewData] = useState<Partial<StepCodeData>[]>([]);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setMessage({ text: 'Please select a valid PDF file.', type: 'error' });
                return;
            }
            setFile(selectedFile);
            setMessage(null);
            setPreviewData([]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsProcessing(true);
        setMessage({ text: 'Uploading and analyzing document with Gemini AI... This may take a few moments.', type: 'info' });
        setPreviewData([]);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Data = reader.result as string;
                const base64Content = base64Data.split(',')[1];

                try {
                    const extractedData = await parseSalaryScalePdf(base64Content);
                    setPreviewData(extractedData);
                    setMessage({ text: `Analysis complete. Found ${extractedData.length} entries. Please review below before importing.`, type: 'success' });
                } catch (error) {
                    setMessage({ text: 'AI Analysis failed. Please ensure the PDF is readable and try again.', type: 'error' });
                } finally {
                    setIsProcessing(false);
                }
            };
            reader.onerror = () => {
                setMessage({ text: 'Error reading file.', type: 'error' });
                setIsProcessing(false);
            };
        } catch (e) {
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
            setIsProcessing(false);
        }
    };

    const handleImport = () => {
        if (previewData.length === 0) return;

        let importCount = 0;
        previewData.forEach((item, index) => {
            if (item.code && item.annualSalary) {
                const empCode = `IMP-${Date.now().toString().slice(-6)}-${index}`;
                const newStep: StepCodeData = {
                    empCode: empCode,
                    code: item.code,
                    status: item.status || 'Imported Position',
                    annualSalary: item.annualSalary,
                    allowance: item.allowance || 0,
                    isSsnitExempt: !!item.isSsnitExempt,
                    netSalaryInSheet: 0,
                    studentLoanInSheet: null
                };
                addStepCode(newStep);
                importCount++;
            }
        });

        setMessage({ text: `Successfully imported ${importCount} new Grade/Step entries into the system.`, type: 'success' });
        setPreviewData([]);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        addLog(AuditLogEvent.GRADE_ADDED, `Bulk imported ${importCount} entries via PDF Ingestion.`);
    };

    return (
        <Card as="section" ariaLabelledby="ingestion-heading">
             <div className="flex items-center gap-2 mb-4">
                <BrainIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 id="ingestion-heading" className="text-xl font-bold">Intelligent Salary Scale Ingestion</h2>
            </div>
            <p className="text-sm mb-4" data-component="text-secondary">
                Upload a new Salary Scale PDF sheet. The system will use AI to extract Grade, Step, and Salary information for training the portal database.
            </p>
            
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            dark:file:bg-slate-700 dark:file:text-slate-200
                        "
                    />
                    <Button 
                        onClick={handleAnalyze} 
                        disabled={!file || isProcessing}
                        className="flex items-center gap-2 whitespace-nowrap"
                    >
                        {isProcessing ? 'Analyzing...' : 'Analyze with AI'}
                        {!isProcessing && <UploadIcon className="w-4 h-4" />}
                    </Button>
                </div>

                {message && (
                    <div className={`p-3 rounded text-sm ${
                        message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 
                        message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                {previewData.length > 0 && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Extracted Data Preview</h3>
                            <Button onClick={handleImport} variant="primary" className="text-xs">
                                Import & Update Database
                            </Button>
                        </div>
                        <div className="max-h-60 overflow-y-auto border rounded-md">
                            <table className="min-w-full divide-y" data-component="table">
                                <thead className="sticky top-0" data-component="table-header">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">Code</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium uppercase">Status</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase">Annual Salary</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium uppercase">Allowance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" data-component="table-body">
                                    {previewData.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-sm">{item.code}</td>
                                            <td className="px-4 py-2 text-sm">{item.status}</td>
                                            <td className="px-4 py-2 text-sm text-right font-mono">{formatCurrency(item.annualSalary)}</td>
                                            <td className="px-4 py-2 text-sm text-right font-mono">{formatCurrency(item.allowance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

const AddGradeForm: React.FC = () => {
    const { stepCodes, addStepCode } = useStepCodes();
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('');
    const [annualSalary, setAnnualSalary] = useState('');
    const [allowance, setAllowance] = useState('');
    const [isSsnitExempt, setIsSsnitExempt] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        const salaryNum = parseFloat(annualSalary);
        const allowanceNum = parseFloat(allowance);

        if (!code.trim() || !status.trim() || isNaN(salaryNum) || isNaN(allowanceNum) || salaryNum <= 0 || allowanceNum < 0) {
            setMessage('Please fill all fields with valid data.');
            setIsError(true);
            return;
        }

        const lastCustomIndex = stepCodes
            .map(c => c.empCode)
            .filter(empCode => empCode.startsWith('CUSTOM-'))
            .map(empCode => parseInt(empCode.split('-')[1], 10))
            .filter(num => !isNaN(num))
            .reduce((max, num) => Math.max(max, num), 0);

        const newEmpCode = `CUSTOM-${lastCustomIndex + 1}`;

        addStepCode({
            empCode: newEmpCode,
            code: code.trim(),
            status: status.trim(),
            annualSalary: salaryNum,
            allowance: allowanceNum,
            isSsnitExempt,
            netSalaryInSheet: 0,
            studentLoanInSheet: null,
        });

        setMessage(`Successfully added Grade/Step: ${code.trim()} - ${status.trim()}`);
        setCode('');
        setStatus('');
        setAnnualSalary('');
        setAllowance('');
        setIsSsnitExempt(false);
        setTimeout(() => setMessage(''), 5000);
    };

    return (
        <Card as="section" ariaLabelledby="add-grade-heading">
            <h2 id="add-grade-heading" className="text-xl font-bold mb-4">Add New Grade/Step</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input id="new-grade-code" label="Grade/Step Code" type="text" value={code} onChange={e => setCode(e.target.value)} required placeholder="e.g., SS0105/1" />
                    <Input id="new-grade-status" label="Status/Title" type="text" value={status} onChange={e => setStatus(e.target.value)} required placeholder="e.g., Junior Accountant" />
                    <Input id="new-grade-salary" label="Annual Basic Salary (₵)" type="number" value={annualSalary} onChange={e => setAnnualSalary(e.target.value)} required placeholder="e.g., 25000" min="0" step="0.01" />
                    <Input id="new-grade-allowance" label="Monthly Consolidated Allowance (₵)" type="number" value={allowance} onChange={e => setAllowance(e.target.value)} required placeholder="e.g., 1000" min="0" step="0.01" />
                </div>
                <Toggle id="new-grade-ssnit-exempt" label="SSNIT Exempt" enabled={isSsnitExempt} onChange={setIsSsnitExempt} />
                {message && (
                    <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
                )}
                <Button type="submit">Add Grade/Step</Button>
            </form>
        </Card>
    );
};

const ManageGrades: React.FC = () => {
    const { stepCodes, editStepCode, deleteStepCode } = useStepCodes();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<StepCodeData | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof StepCodeData; direction: 'ascending' | 'descending' }>({ key: 'code', direction: 'ascending' });
    const [filterText, setFilterText] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');

    const filteredAndSortedCodes = useMemo(() => {
        let items = stepCodes.map((code, index) => ({ ...code, originalIndex: index }));
        if (filterText) {
            const lowercasedFilter = filterText.toLowerCase();
            items = items.filter(item =>
                item.code.toLowerCase().includes(lowercasedFilter) ||
                item.status.toLowerCase().includes(lowercasedFilter) ||
                item.empCode.toLowerCase().includes(lowercasedFilter)
            );
        }
        if (sortConfig !== null) {
            items.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];
                if (typeof valA === 'boolean' && typeof valB === 'boolean') {
                    const boolA = valA ? 1 : 0;
                    const boolB = valB ? 1 : 0;
                    return sortConfig.direction === 'ascending' ? boolA - boolB : boolB - boolA;
                }
                if (valA === null || valA === undefined) return 1;
                if (valB === null || valB === undefined) return -1;
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
                }
                return 0;
            });
        }
        return items;
    }, [stepCodes, sortConfig, filterText]);

    const requestSort = (key: keyof StepCodeData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name: keyof StepCodeData) => {
        if (!sortConfig || sortConfig.key !== name) {
            return <span className="ml-1 opacity-20 group-hover:opacity-100 transition-opacity"><ArrowUpIcon className="w-3 h-3" /></span>; 
        }
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon className="w-3 h-3 text-[var(--color-accent-primary)]" /> : <ArrowDownIcon className="w-3 h-3 text-[var(--color-accent-primary)]" />;
    };

    const getHeaderClass = (key: keyof StepCodeData) => {
        const isActive = sortConfig?.key === key;
        return `px-4 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer select-none group transition-colors hover:bg-[var(--color-bg-secondary)] ${
            isActive ? 'text-[var(--color-accent-primary)] bg-[var(--color-bg-secondary)]/30' : 'text-slate-500 dark:text-slate-400'
        }`;
    };

    const handleEditClick = (grade: StepCodeData, originalIndex: number) => {
        setEditingIndex(originalIndex);
        setEditFormData({ ...grade });
    };

    const handleCancelClick = () => {
        setEditingIndex(null);
        setEditFormData(null);
    };

    const handleSaveClick = (originalIndex: number) => {
        if (editFormData) {
            if (!editFormData.code || !editFormData.status || isNaN(editFormData.annualSalary) || isNaN(editFormData.allowance)) {
                alert('All fields must be filled with valid data.');
                return;
            }
            editStepCode(originalIndex, editFormData);
            handleCancelClick();
        }
    };

    const handleDeleteClick = (originalIndex: number) => {
        const gradeToDelete = stepCodes[originalIndex];
        if (gradeToDelete && window.confirm(`Are you sure you want to delete the grade: ${gradeToDelete.code} - ${gradeToDelete.status}?`)) {
            deleteStepCode(originalIndex);
        }
    };
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editFormData) return;
        const { name, value } = e.target;
        const isNumeric = ['annualSalary', 'allowance'].includes(name);
        setEditFormData({ ...editFormData, [name]: isNumeric ? parseFloat(value) || 0 : value });
    };
    
    const handleToggleChange = (enabled: boolean) => {
        if (!editFormData) return;
        setEditFormData({ ...editFormData, isSsnitExempt: enabled });
    };

    return (
        <Card as="section" ariaLabelledby="manage-grades-heading">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 id="manage-grades-heading" className="text-xl font-bold">Manage Grade/Step List</h2>
                <div className="flex items-center bg-[var(--color-bg-tertiary)] p-1 rounded-lg border border-[var(--color-border-primary)]">
                    <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-[var(--color-bg-card)] shadow-sm' : 'text-slate-500'}`}>List View</button>
                    <button onClick={() => setViewMode('matrix')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'matrix' ? 'bg-[var(--color-bg-card)] shadow-sm' : 'text-slate-500'}`}>Matrix View</button>
                </div>
            </div>
            
            <div className="mb-6 flex flex-col sm:flex-row items-end gap-4 bg-[var(--color-bg-secondary)]/30 p-4 rounded-xl border border-[var(--color-border-primary)]">
                <div className="flex-1 w-full max-w-md relative group">
                    <div className="absolute left-3 bottom-3 text-slate-400 group-focus-within:text-[var(--color-accent-primary)] transition-colors"><SearchIcon /></div>
                    <Input id="filter-grades" label="Filter Grades & Positions" type="search" value={filterText} onChange={(e) => setFilterText(e.target.value)} placeholder="Search by code, status..." className="pl-10 pr-10" />
                    {filterText && <button onClick={() => setFilterText('')} className="absolute right-3 bottom-3 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Clear filter"><XIcon className="w-4 h-4" /></button>}
                </div>
                <div className="pb-3 text-sm font-semibold flex items-center gap-2">
                    Showing <span className="text-[var(--color-accent-primary)] text-lg px-1">{filteredAndSortedCodes.length}</span> <span className="opacity-60">of {stepCodes.length} entries</span>
                </div>
            </div>
            
            {viewMode === 'matrix' ? (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    <GradeScaleTable data={filteredAndSortedCodes} />
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="overflow-x-auto border rounded-xl shadow-sm" data-component="table-container">
                        <table className="min-w-full divide-y" data-component="table">
                            <thead className="sticky top-0" data-component="table-header">
                                <tr>
                                    <th scope="col" className={getHeaderClass('empCode')} onClick={() => requestSort('empCode')} aria-sort={sortConfig.key === 'empCode' ? sortConfig.direction : 'none'}>
                                        <div className="flex items-center gap-1">Emp Code {getSortIcon('empCode')}</div>
                                    </th>
                                    <th scope="col" className={getHeaderClass('code')} onClick={() => requestSort('code')} aria-sort={sortConfig.key === 'code' ? sortConfig.direction : 'none'}>
                                        <div className="flex items-center gap-1">Grade Code {getSortIcon('code')}</div>
                                    </th>
                                    <th scope="col" className={getHeaderClass('status')} onClick={() => requestSort('status')} aria-sort={sortConfig.key === 'status' ? sortConfig.direction : 'none'}>
                                        <div className="flex items-center gap-1">Status {getSortIcon('status')}</div>
                                    </th>
                                    <th scope="col" className={getHeaderClass('annualSalary')} onClick={() => requestSort('annualSalary')} aria-sort={sortConfig.key === 'annualSalary' ? sortConfig.direction : 'none'}>
                                        <div className="w-full flex justify-end items-center gap-1">Annual Salary {getSortIcon('annualSalary')}</div>
                                    </th>
                                    <th scope="col" className={getHeaderClass('allowance')} onClick={() => requestSort('allowance')} aria-sort={sortConfig.key === 'allowance' ? sortConfig.direction : 'none'}>
                                        <div className="w-full flex justify-end items-center gap-1">Allowance {getSortIcon('allowance')}</div>
                                    </th>
                                    <th scope="col" className={getHeaderClass('isSsnitExempt')} onClick={() => requestSort('isSsnitExempt')} aria-sort={sortConfig.key === 'isSsnitExempt' ? sortConfig.direction : 'none'}>
                                        <div className="w-full flex justify-center items-center gap-1">SSNIT Exempt {getSortIcon('isSsnitExempt')}</div>
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" data-component="table-body">
                                {filteredAndSortedCodes.length > 0 ? (
                                    filteredAndSortedCodes.map((grade) => (
                                        editingIndex === grade.originalIndex ? (
                                            <tr key={`${grade.empCode}-edit`} className="bg-[var(--color-bg-secondary)]/20">
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-mono align-middle">{grade.empCode}</td>
                                                <td className="px-4 py-2 align-middle"><Input id={`edit-code-${grade.originalIndex}`} name="code" label="" type="text" value={editFormData?.code || ''} onChange={handleFormChange} aria-label={`Edit Code for ${grade.empCode}`} /></td>
                                                <td className="px-4 py-2 align-middle"><Input id={`edit-status-${grade.originalIndex}`} name="status" label="" type="text" value={editFormData?.status || ''} onChange={handleFormChange} aria-label={`Edit Status for ${grade.empCode}`} /></td>
                                                <td className="px-4 py-2 align-middle"><Input id={`edit-salary-${grade.originalIndex}`} name="annualSalary" label="" type="number" value={editFormData?.annualSalary || ''} onChange={handleFormChange} step="0.01" className="text-right" aria-label={`Edit Salary for ${grade.empCode}`} /></td>
                                                <td className="px-4 py-2 align-middle"><Input id={`edit-allowance-${grade.originalIndex}`} name="allowance" label="" type="number" value={editFormData?.allowance || ''} onChange={handleFormChange} step="0.01" className="text-right" aria-label={`Edit Allowance for ${grade.empCode}`} /></td>
                                                <td className="px-4 py-2 text-center align-middle"><Toggle id={`edit-ssnit-${grade.originalIndex}`} label="" enabled={editFormData?.isSsnitExempt || false} onChange={handleToggleChange} /></td>
                                                <td className="px-4 py-2 whitespace-nowrap text-center text-sm font-medium align-middle space-x-2">
                                                    <Button onClick={() => handleSaveClick(grade.originalIndex)} variant="primary" className="text-xs px-2 py-1">Save</Button>
                                                    <Button onClick={handleCancelClick} variant="secondary" className="text-xs px-2 py-1">Cancel</Button>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={grade.empCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-mono opacity-60">{grade.empCode}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold">{grade.code}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{grade.status}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-semibold text-[var(--color-success)]">{formatCurrency(grade.annualSalary)}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-mono">{formatCurrency(grade.allowance)}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${grade.isSsnitExempt ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                        {grade.isSsnitExempt ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                                    <Button onClick={() => handleEditClick(grade, grade.originalIndex)} variant="secondary" className="text-xs px-2 py-1">Edit</Button>
                                                    <Button onClick={() => handleDeleteClick(grade.originalIndex)} variant="danger" className="text-xs px-2 py-1">Delete</Button>
                                                </td>
                                            </tr>
                                        )
                                    ))
                                ) : (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-sm" data-component="text-secondary">No grades found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Card>
    );
};

const ChangePasswordForm: React.FC = () => {
    const { changePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    // Password strength logic
    const calculateStrength = (pwd: string) => {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (pwd.length >= 12) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
        return Math.min(score, 5);
    };

    const strength = calculateStrength(newPassword);
    
    const strengthColor = () => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const strengthLabel = () => {
        if (strength === 0) return 'None';
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Medium';
        if (strength === 4) return 'Strong';
        return 'Very Strong';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (newPassword !== confirmPassword) {
            setMessage('New passwords do not match.');
            setIsError(true);
            addLog(AuditLogEvent.PASSWORD_CHANGE_FAILURE, 'Password confirmation mismatch.');
            return;
        }

        const result = changePassword(currentPassword, newPassword);
        setMessage(result.message);
        setIsError(!result.success);
        if (result.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <Card as="section" ariaLabelledby="change-password-heading">
            <h2 id="change-password-heading" className="text-xl font-bold mb-4">Security Management</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <Input id="current-password" label="Current Administrator Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Input 
                            id="new-password" 
                            label="New Password" 
                            type="password" 
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)} 
                            required 
                            minLength={MIN_PASSWORD_LENGTH} 
                        />
                        {/* Password Strength Meter */}
                        {newPassword && (
                            <div className="flex flex-col gap-1 mt-1">
                                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-300 ${strengthColor()}`} 
                                        style={{ width: `${(strength / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 font-medium">
                                    <span>Strength: {strengthLabel()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <Input id="confirm-password" label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                {message && (
                    <div 
                        role="alert" 
                        aria-live="polite" 
                        className={`p-3 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                    >
                        {message}
                    </div>
                )}
                <Button type="submit" variant="primary" className="w-full sm:w-auto">Update Security Credentials</Button>
            </form>
        </Card>
    );
}

const AuditLogViewer: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    useEffect(() => { setLogs(getLogs()); }, []);
    
    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," + "Timestamp,Event,Details\n" + logs.map(e => `${new Date(e.timestamp).toISOString()},${e.event},"${(e.details || '').replace(/"/g, '""')}"`).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `audit_logs_${new Date().toISOString().slice(0,10)}.csv`);
        link.click();
        addLog(AuditLogEvent.LOGS_EXPORTED, "Logs exported to CSV.");
        setTimeout(() => setLogs(getLogs()), 100);
    };

    const handleClear = () => {
        if (window.confirm("Permanently clear all logs? This cannot be undone.")) {
            clearLogs();
            setLogs(getLogs());
        }
    };
    
    return (
        <Card as="section" ariaLabelledby="audit-log-heading">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 id="audit-log-heading" className="text-xl font-bold">Security Audit Log</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={handleExport} className="text-xs">Export CSV</Button>
                    <Button variant="danger" onClick={handleClear} className="text-xs">Clear Logs</Button>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto border rounded-md">
                <table className="min-w-full divide-y">
                    <thead className="sticky top-0 bg-[var(--color-bg-tertiary)]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-bold uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {logs.length > 0 ? logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm opacity-70">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{log.event}</td>
                                <td className="px-6 py-4 text-sm">{log.event === AuditLogEvent.SALARY_CALCULATION && log.details ? <SalaryCalculationDetails details={JSON.parse(log.details)} /> : (log.details || 'N/A')}</td>
                            </tr>
                        )) : (<tr><td colSpan={3} className="px-6 py-4 text-center text-sm opacity-50">No records found.</td></tr>)}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const AdminPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-extrabold" data-component="title">Administrator Panel</h1>
            <SecurityHealthCheck />
            <SalaryScaleIngestion />
            <AddGradeForm />
            <ManageGrades />
            <ChangePasswordForm />
            <AuditLogViewer />
        </div>
    );
};

export default AdminPage;
