import React, { useState, useEffect, useRef } from 'react';
import { Patient } from '../types';

interface PatientRegistryProps {
  patients: Patient[];
  onRegister: (patient: Patient) => void;
  onBulkRegister: (patients: Patient[]) => void;
  onUpdatePatient: (patient: Patient) => void;
  onMergePatients?: (masterId: string, duplicateId: string) => void;
}

// Utility: Levenshtein Distance for Fuzzy Search
const getLevenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

const PatientRegistry: React.FC<PatientRegistryProps> = ({ patients, onRegister, onBulkRegister, onUpdatePatient, onMergePatients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  // Deactivation State
  const [deactivationModalOpen, setDeactivationModalOpen] = useState(false);
  const [patientToDeactivate, setPatientToDeactivate] = useState<Patient | null>(null);
  const [deactivationReason, setDeactivationReason] = useState('');

  // Merge State
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [importing, setImporting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState<Partial<Patient>>({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    allergies: [],
    medicalHistory: [],
    insuranceProvider: '',
    insuranceId: '',
  });

  // Auto-clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  /**
   * EHR Data Hydration Logic
   * Atomic synchronization of form buffer when a patient record is selected for modification.
   */
  useEffect(() => {
    if (editingPatient) {
      setFormData({
        firstName: editingPatient.firstName || '',
        lastName: editingPatient.lastName || '',
        dob: editingPatient.dob || '',
        gender: editingPatient.gender || 'Male',
        phone: editingPatient.phone || '',
        email: editingPatient.email || '',
        address: editingPatient.address || '',
        emergencyContact: editingPatient.emergencyContact || '',
        bloodGroup: editingPatient.bloodGroup || '',
        allergies: [...(editingPatient.allergies || [])],
        medicalHistory: [...(editingPatient.medicalHistory || [])],
        insuranceProvider: editingPatient.insuranceProvider || '',
        insuranceId: editingPatient.insuranceId || '',
      });
      setErrors({});
      setIsModalOpen(true);
    }
  }, [editingPatient]);

  /**
   * Clinical Validation Engine
   * Enforces institutional data integrity rules for patient enrollment.
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation with trim checks
    if (!formData.firstName?.trim()) newErrors.firstName = 'Legal First Name is required.';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Legal Last Name is required.';
    if (!formData.dob) newErrors.dob = 'Institutional Date of Birth is required.';
    if (!formData.phone?.trim()) newErrors.phone = 'Primary contact number is required.';
    if (!formData.gender) newErrors.gender = 'Gender identity must be specified.';
    if (!formData.emergencyContact?.trim()) newErrors.emergencyContact = 'Emergency contact details are mandatory.';

    // Specialized format validation
    if (formData.phone && !/^\+?[0-9\s-]{7,20}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format detected (e.g. +233...)';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid institutional email address.';
    }

    setErrors(newErrors);

    // UX Enhancement: Auto-focus the first invalid field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = formRef.current?.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Real-time clinical clearance of error markers
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({ message: 'Validation Failed: Please correct the clinical flags.', type: 'error' });
      return;
    }

    // FR-PM-001: Check for duplicate records (Phone or Email) during new registration
    if (!editingPatient) {
      const isDuplicate = patients.some(p => 
        (p.phone && p.phone.replace(/\s/g, '') === formData.phone?.replace(/\s/g, '')) || 
        (p.email && formData.email && p.email.toLowerCase() === formData.email.toLowerCase())
      );
      
      if (isDuplicate) {
        setNotification({ 
          message: 'Registration Conflict: A patient with this Phone or Email already exists in the registry.', 
          type: 'error' 
        });
        return;
      }
    }

    const parseList = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') return val.split(/[,;]/).map(s => s.trim()).filter(Boolean);
      return [];
    };

    const patientData = {
      ...formData,
      allergies: parseList(formData.allergies),
      medicalHistory: parseList(formData.medicalHistory),
    };

    if (editingPatient) {
      onUpdatePatient({
        ...editingPatient,
        ...patientData,
      } as Patient);
      setNotification({ message: `Institutional Record ${editingPatient.id} successfully updated.`, type: 'success' });
    } else {
      const newPatient: Patient = {
        ...patientData as Patient,
        id: `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        createdAt: new Date().toISOString(),
        status: 'Active'
      };
      onRegister(newPatient);
      setNotification({ message: `Successfully enrolled ${newPatient.firstName} with EHR UID: ${newPatient.id}`, type: 'success' });
    }
    
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
    setErrors({});
    setFormData({
      firstName: '', lastName: '', dob: '', gender: 'Male', phone: '',
      email: '', address: '', emergencyContact: '', bloodGroup: '', allergies: [],
      medicalHistory: [], insuranceProvider: '', insuranceId: '',
    });
  };

  const handleEditClick = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const handleOpenEnrollment = () => {
    setEditingPatient(null);
    setErrors({});
    setFormData({
      firstName: '', lastName: '', dob: '', gender: 'Male', phone: '',
      email: '', address: '', emergencyContact: '', bloodGroup: '', allergies: [],
      medicalHistory: [], insuranceProvider: '', insuranceId: '',
    });
    setIsModalOpen(true);
  };

  // Deactivation Logic
  const handleInitiateDeactivation = (patient: Patient) => {
    setPatientToDeactivate(patient);
    setDeactivationReason('');
    setDeactivationModalOpen(true);
  };

  const handleConfirmDeactivation = () => {
    if (!patientToDeactivate) return;
    if (!deactivationReason.trim()) {
      setNotification({ message: 'Compliance Error: A valid reason is required for deactivation.', type: 'error' });
      return;
    }

    onUpdatePatient({
      ...patientToDeactivate,
      status: 'Inactive',
      deactivationReason: deactivationReason.trim()
    });

    setNotification({ message: `Record ${patientToDeactivate.id} deactivated successfully.`, type: 'success' });
    setDeactivationModalOpen(false);
    setPatientToDeactivate(null);
    setDeactivationReason('');
  };

  // Merge Mode Logic
  const toggleMergeMode = () => {
    setIsMergeMode(!isMergeMode);
    setSelectedForMerge([]);
  };

  const toggleSelectForMerge = (id: string) => {
    if (selectedForMerge.includes(id)) {
      setSelectedForMerge(prev => prev.filter(pid => pid !== id));
    } else {
      if (selectedForMerge.length < 2) {
        setSelectedForMerge(prev => [...prev, id]);
      } else {
        setNotification({ message: "Merge limit reached: Maximum 2 records can be compared at once.", type: 'error' });
      }
    }
  };

  const initiateMergeProcess = () => {
    if (selectedForMerge.length !== 2) return;
    setSelectedMasterId(selectedForMerge[0]); // Default to first selected
    setMergeModalOpen(true);
  };

  const confirmMerge = () => {
    if (!selectedMasterId || !onMergePatients || selectedForMerge.length !== 2) return;
    const duplicateId = selectedForMerge.find(id => id !== selectedMasterId);
    if (duplicateId) {
      onMergePatients(selectedMasterId, duplicateId);
      setNotification({ message: "Duplicate record successfully merged and archived.", type: 'success' });
    }
    setMergeModalOpen(false);
    setIsMergeMode(false);
    setSelectedForMerge([]);
  };

  const downloadTemplate = () => {
    const headers = ['firstName', 'lastName', 'dob', 'gender', 'phone', 'email', 'address', 'emergencyContact', 'insuranceProvider', 'insuranceId', 'allergies', 'medicalHistory', 'bloodGroup'];
    const row = ['John', 'Doe', '1985-05-12', 'Male', '+233 20 123 4567', 'john.doe@example.com', '123 Health St, Accra', 'Jane Doe +233 20 111 2222', 'NHIS', '12345678', 'Penicillin;Peanuts', 'Hypertension', 'O+'];
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rophe_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Specialist Bulk Ingestion Protocol with Strict Validation
   */
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation: Only CSV allowed
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setNotification({ message: "Format Error: System only accepts institutional CSV files.", type: 'error' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        let csvData = event.target?.result as string;
        // Strip BOM if present to prevent header corruption
        csvData = csvData.replace(/^\uFEFF/, '');
        
        const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length < 2) throw new Error("Format Invalidation: Missing headers or patient records.");

        // Robust CSV Parser helper that handles quoted strings
        const parseLine = (text: string) => {
          const result = [];
          let cur = '';
          let inQuote = false;
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
               if (inQuote && text[i+1] === '"') {
                 cur += '"';
                 i++; // skip next quote
               } else {
                 inQuote = !inQuote;
               }
               continue; 
            }
            if (char === ',' && !inQuote) { result.push(cur.trim()); cur = ''; continue; }
            cur += char;
          }
          result.push(cur.trim());
          return result;
        };

        const headers = parseLine(lines[0]).map(h => h.trim().toLowerCase());
        
        // Institutional Required Header Check (Case-insensitive but strict on presence)
        // FR-PM-006 Implementation
        const mandatoryHeaders = ['firstName', 'lastName', 'dob', 'gender', 'phone', 'emergencyContact'];
        const missing = mandatoryHeaders.filter(req => !headers.includes(req.toLowerCase()));
        
        if (missing.length > 0) {
          throw new Error(`Import Validation Error: Missing required columns: ${missing.join(', ')}. Please use the provided template.`);
        }

        const validGenders = ['male', 'female', 'other'];
        let skippedCount = 0;

        const imported: Patient[] = lines.slice(1)
          .map((line, index) => {
            const values = parseLine(line);
            // Handle potentially empty trailing columns or malformed lines gracefully
            if (values.length < headers.length) return null;

            const p: any = {};
            
            headers.forEach((header, i) => {
              const val = values[i] || '';
              let key = header;
              // Map to camelCase Patient model keys
              if (header === 'firstname') key = 'firstName';
              else if (header === 'lastname') key = 'lastName';
              else if (header === 'insuranceprovider') key = 'insuranceProvider';
              else if (header === 'insuranceid') key = 'insuranceId';
              else if (header === 'emergencycontact') key = 'emergencyContact';
              else if (header === 'bloodgroup') key = 'bloodGroup';
              else if (header === 'medicalhistory') key = 'medicalHistory';

              if (key === 'allergies' || key === 'medicalHistory') {
                p[key] = val ? val.split(';').map(s => s.trim()).filter(Boolean) : [];
              } else {
                p[key] = val;
              }
            });

            // Logical Data Integrity Checks for Row
            const isInvalidRow = 
              !p.firstName || 
              !p.lastName || 
              !p.dob || 
              !p.phone || 
              !p.emergencyContact ||
              !validGenders.includes(String(p.gender).toLowerCase());

            if (isInvalidRow) {
              skippedCount++;
              return null;
            }

            return {
              ...p,
              gender: p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase(),
              id: `P${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
              createdAt: new Date().toISOString(),
              status: 'Active'
            } as Patient;
          })
          .filter((p): p is Patient => p !== null);

        if (imported.length > 0) {
          onBulkRegister(imported);
          const feedbackMessage = skippedCount > 0 
            ? `Institutional Sync: ${imported.length} records ingested. ${skippedCount} failed row validation.`
            : `Institutional Sync Complete: ${imported.length} records ingested.`;
          
          setNotification({ message: feedbackMessage, type: skippedCount > 0 ? 'error' : 'success' });
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          throw new Error("Validation Failure: No valid patient records found in file.");
        }
      } catch (err: any) {
        setNotification({ message: `${err.message}`, type: 'error' });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  // FR-PM-002: Enhanced search logic including Fuzzy Matching for Names/Address
  const filteredPatients = patients.filter(p => {
    const term = searchTerm.toLowerCase();
    const cleanTerm = term.trim();
    
    // Fuzzy matching logic
    const isFuzzyMatch = (source: string) => {
      const cleanSource = source.toLowerCase();
      
      // Direct Match
      if (cleanSource.includes(cleanTerm)) return true;
      
      // Skip fuzzy logic for short terms to avoid false positives
      if (cleanTerm.length < 3) return false;

      // Allow 1-2 typos based on word length
      const threshold = cleanTerm.length > 5 ? 2 : 1;
      
      // Check each word in source against search term
      return cleanSource.split(/\s+/).some(word => {
        if (word.length < 3) return false;
        return getLevenshteinDistance(word, cleanTerm) <= threshold;
      });
    };

    const matchesSearch = (
      p.id.toLowerCase().includes(cleanTerm) ||
      p.email.toLowerCase().includes(cleanTerm) ||
      p.phone.toLowerCase().includes(cleanTerm) ||
      p.dob.includes(cleanTerm) ||
      isFuzzyMatch(`${p.firstName} ${p.lastName}`) ||
      isFuzzyMatch(p.address || '')
    );
    
    const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const inputClass = (field: string) => `w-full px-4 py-3 bg-white dark:bg-slate-950 border transition-all font-medium text-gray-900 dark:text-white placeholder:text-gray-300 shadow-sm rounded-xl outline-none focus:ring-4 ${
    errors[field] 
    ? 'border-rose-500 ring-rose-500/10 ring-2' 
    : 'border-gray-200 dark:border-slate-800 focus:ring-emerald-500/10 focus:border-emerald-500'
  }`;
  const labelClass = "block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2";
  const errorTextClass = "text-[10px] font-black text-rose-500 uppercase tracking-wider mt-1.5 flex items-center animate-in slide-in-from-top-1 duration-200";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      {/* Institutional Toasts */}
      {notification && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl border flex items-center space-x-4 animate-in slide-in-from-right-12 duration-500 ${
          notification.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'
        }`}>
          <div className="bg-white/20 p-2 rounded-xl">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
          <span className="font-bold text-sm uppercase tracking-wider">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Clinical Registry</h2>
          <p className="text-gray-500 font-medium italic">Comprehensive management of institutional patient health records.</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Template Button */}
          <button
            onClick={downloadTemplate}
            className="p-3 bg-white dark:bg-slate-800 text-gray-500 hover:text-emerald-600 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-slate-700"
            title="Download CSV Template"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>

          <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleCsvImport} />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={importing || isMergeMode}
            className={`px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all flex items-center space-x-2 border border-gray-200 dark:border-slate-700 active:scale-95 disabled:opacity-50 ${isMergeMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {importing ? (
              <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 animate-spin rounded-full"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4V4" /></svg>
            )}
            <span>Bulk Ingestion</span>
          </button>
          
          <button 
             onClick={toggleMergeMode}
             className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm transition-all flex items-center space-x-2 border active:scale-95 ${
               isMergeMode 
               ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 shadow-indigo-900/20' 
               : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
             }`}
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
             <span>{isMergeMode ? 'Cancel Merge' : 'Merge Duplicates'}</span>
          </button>

          <button 
            onClick={handleOpenEnrollment}
            disabled={isMergeMode}
            className={`px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center space-x-2 active:scale-95 ${isMergeMode ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            <span>New Enrollment</span>
          </button>
        </div>
      </header>
      
      {/* Merge Action Bar */}
      {isMergeMode && (
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-top-2">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center font-bold">
                 {selectedForMerge.length}
              </div>
              <div className="text-indigo-900 dark:text-indigo-200 text-sm font-medium">
                 {selectedForMerge.length === 0 ? "Select 2 records to merge..." : 
                  selectedForMerge.length === 1 ? "Select 1 more record..." : 
                  "Ready to merge selected records."}
              </div>
           </div>
           {selectedForMerge.length === 2 && (
             <button 
               onClick={initiateMergeProcess}
               className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20"
             >
               Compare & Merge
             </button>
           )}
        </div>
      )}

      {/* EHR Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
        <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search by name, ID, phone, DOB or email..." 
                className="pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-full md:w-80 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-11 pr-10 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner cursor-pointer text-gray-700 dark:text-gray-300 appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Archived</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{filteredPatients.length} Institutional Records Found</span>
        </div>

        <div className="overflow-x-auto text-[13px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-950 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {isMergeMode && <th className="px-8 py-6 w-16 text-center">Merge</th>}
                <th className="px-8 py-6">EHR ID</th>
                <th className="px-8 py-6">Patient Identity</th>
                <th className="px-8 py-6">Age / Gender</th>
                <th className="px-8 py-6">Channels</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                <tr key={patient.id} className={`transition-colors group ${patient.status === 'Inactive' ? 'bg-gray-50/50 dark:bg-slate-900/50 grayscale opacity-75' : 'hover:bg-gray-50/50 dark:hover:bg-slate-800/50'}`}>
                  {isMergeMode && (
                    <td className="px-8 py-6 text-center">
                       <input 
                         type="checkbox" 
                         checked={selectedForMerge.includes(patient.id)}
                         onChange={() => toggleSelectForMerge(patient.id)}
                         className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                       />
                    </td>
                  )}
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-900 shadow-sm">
                      {patient.id}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-400 font-black text-sm group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white transition-all shadow-sm">
                        {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight leading-none mb-1">{patient.firstName} {patient.lastName}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Ins: {patient.insuranceProvider || 'Direct Pay'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{patient.dob}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{patient.gender}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{patient.phone}</p>
                    <p className="text-[10px] text-gray-400 lowercase font-medium">{patient.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <div className={`w-1.5 h-1.5 rounded-full ${patient.status === 'Inactive' ? 'bg-gray-400' : 'bg-emerald-500'}`}></div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${patient.status === 'Inactive' ? 'text-gray-500' : 'text-emerald-600'}`}>
                         {patient.status || 'Active'}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditClick(patient)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-900/50 shadow-sm group/btn active:scale-95"
                        aria-label={`Modify EHR for ${patient.firstName} ${patient.lastName}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        <span>Edit</span>
                      </button>
                      
                      {patient.status !== 'Inactive' && (
                        <button 
                          onClick={() => handleInitiateDeactivation(patient)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 transition-all border border-rose-100 dark:border-rose-900/50"
                          title="Deactivate Patient Record"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isMergeMode ? 7 : 6} className="px-8 py-32 text-center text-gray-400 italic">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      {searchTerm ? `No clinical matches for "${searchTerm}"` : "The institutional registry is currently empty."}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivation Confirmation Modal */}
      {deactivationModalOpen && patientToDeactivate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-rose-200 dark:border-rose-900 max-w-lg w-full p-8 animate-in zoom-in duration-300">
              <div className="flex items-center space-x-4 mb-6">
                 <div className="p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-2xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Confirm Deactivation</h3>
                    <p className="text-sm text-gray-500 font-medium">Record ID: {patientToDeactivate.id}</p>
                 </div>
              </div>
              
              <div className="mb-6">
                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    You are about to deactivate the clinical record for <strong>{patientToDeactivate.firstName} {patientToDeactivate.lastName}</strong>. 
                    This action will prevent new appointments and archive the patient's history.
                 </p>
                 
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Required: Reason for Deactivation</label>
                 <textarea 
                    className="w-full p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm font-medium"
                    rows={3}
                    placeholder="e.g. Patient relocation, deceased, transferred care..."
                    value={deactivationReason}
                    onChange={(e) => setDeactivationReason(e.target.value)}
                 ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3">
                 <button 
                    onClick={() => setDeactivationModalOpen(false)}
                    className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleConfirmDeactivation}
                    className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-900/20 transition-all"
                 >
                    Confirm Deactivation
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Merge Confirmation Modal */}
      {mergeModalOpen && selectedForMerge.length === 2 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-indigo-200 dark:border-indigo-900 max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-gray-100 dark:border-slate-800 bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-200 tracking-tight">Merge Duplicate Records</h3>
                  <p className="text-sm font-medium text-indigo-700/60 dark:text-indigo-300/60">Select the Master Record to retain demographics. Clinical history will be consolidated.</p>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                   <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 dark:bg-slate-950/50">
               <div className="grid grid-cols-2 gap-8">
                  {selectedForMerge.map(id => {
                    const patient = patients.find(p => p.id === id);
                    if (!patient) return null;
                    const isMaster = selectedMasterId === id;
                    
                    return (
                      <div 
                        key={id}
                        onClick={() => setSelectedMasterId(id)}
                        className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                          isMaster 
                          ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-xl scale-[1.02] z-10' 
                          : 'bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                        }`}
                      >
                         {isMaster && (
                           <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-indigo-600 text-white px-3 py-1 text-xs font-black uppercase rounded-full shadow-lg">
                             Master Record
                           </div>
                         )}
                         <div className="flex items-center space-x-3 mb-4">
                           <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                              {patient.firstName[0]}{patient.lastName[0]}
                           </div>
                           <div>
                              <h4 className="font-bold text-lg text-gray-900 dark:text-white">{patient.firstName} {patient.lastName}</h4>
                              <p className="font-mono text-xs text-gray-500">{patient.id}</p>
                           </div>
                         </div>
                         <div className="space-y-2 text-sm">
                           <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-1">
                              <span className="text-gray-500 font-bold">DOB</span>
                              <span className="font-mono">{patient.dob}</span>
                           </div>
                           <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-1">
                              <span className="text-gray-500 font-bold">Phone</span>
                              <span className="font-mono">{patient.phone}</span>
                           </div>
                           <div className="flex justify-between border-b border-gray-200 dark:border-slate-700 pb-1">
                              <span className="text-gray-500 font-bold">Email</span>
                              <span className="truncate max-w-[150px]">{patient.email}</span>
                           </div>
                           <div className="pt-2">
                             <p className="text-xs font-bold text-gray-400 uppercase mb-1">Clinical Data (Will Merge)</p>
                             <div className="flex flex-wrap gap-1">
                                {patient.medicalHistory.map((h, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-[10px]">{h}</span>
                                ))}
                             </div>
                           </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
             </div>

             <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end items-center space-x-4">
               <button 
                 onClick={() => setMergeModalOpen(false)}
                 className="px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmMerge}
                 className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-900/20 transition-all flex items-center space-x-2"
               >
                 <span>Confirm & Merge</span>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Institutional Modification Engine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden w-full max-w-5xl max-h-full flex flex-col animate-in zoom-in slide-in-from-bottom-8 duration-500">
            {/* Dynamic Modal Branding */}
            <div className={`p-10 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-500 ${editingPatient ? 'bg-indigo-50 dark:bg-indigo-950/20' : 'bg-emerald-50 dark:bg-emerald-950/20'}`}>
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-colors duration-500 ${editingPatient ? 'bg-indigo-600 shadow-indigo-900/20' : 'bg-emerald-600 shadow-emerald-900/20'} text-white`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div>
                  <h3 id="modal-title" className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {editingPatient ? 'Institutional Record Modification' : 'Specialist Enrollment Protocol'}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    {editingPatient ? (
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[9px] font-black uppercase rounded tracking-widest border border-indigo-200 dark:border-indigo-800 shadow-sm">EHR UID: {editingPatient.id}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed off by Rophe HUB Agent</span>
                      </div>
                    ) : (
                      <span className="text-emerald-700 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Automated UID Generation Pending</span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={closeModal} className="p-3 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl text-gray-400 hover:text-rose-600 transition-all border border-gray-100 dark:border-slate-700 shadow-sm active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form 
              ref={formRef}
              onSubmit={handleSubmit} 
              className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar"
              noValidate
            >
              <section>
                <header className="flex items-center space-x-4 mb-8">
                  <span className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-black text-gray-500">1</span>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex-1 border-b border-gray-100 dark:border-slate-800 pb-2">Institutional Demographics</h4>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className={labelClass}>Legal First Name *</label>
                    <input 
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      className={inputClass('firstName')} 
                      value={formData.firstName} 
                      onChange={e => handleFieldChange('firstName', e.target.value)}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    />
                    {errors.firstName && <p id="firstName-error" className={errorTextClass}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.firstName}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lastName" className={labelClass}>Legal Last Name *</label>
                    <input 
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      className={inputClass('lastName')} 
                      value={formData.lastName} 
                      onChange={e => handleFieldChange('lastName', e.target.value)} 
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                    {errors.lastName && <p id="lastName-error" className={errorTextClass}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.lastName}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="dob" className={labelClass}>Date of Birth *</label>
                    <input 
                      id="dob"
                      name="dob"
                      type="date" 
                      className={inputClass('dob')} 
                      value={formData.dob} 
                      onChange={e => handleFieldChange('dob', e.target.value)} 
                      aria-invalid={!!errors.dob}
                      aria-describedby={errors.dob ? "dob-error" : undefined}
                    />
                    {errors.dob && <p id="dob-error" className={errorTextClass}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.dob}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="gender" className={labelClass}>Gender Identity *</label>
                    <select 
                      id="gender"
                      name="gender"
                      className={inputClass('gender')} 
                      value={formData.gender} 
                      onChange={e => handleFieldChange('gender', e.target.value as any)}
                      aria-invalid={!!errors.gender}
                      aria-describedby={errors.gender ? "gender-error" : undefined}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p id="gender-error" className={errorTextClass}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.gender}</p>}
                  </div>
                </div>
              </section>

              <section>
                <header className="flex items-center space-x-4 mb-8">
                  <span className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-black text-gray-500">2</span>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex-1 border-b border-gray-100 dark:border-slate-800 pb-2">Verified Channels</h4>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <label htmlFor="phone" className={labelClass}>Primary Contact *</label>
                    <input 
                      id="phone"
                      name="phone"
                      type="tel" 
                      className={inputClass('phone')} 
                      placeholder="+233..." 
                      value={formData.phone} 
                      onChange={e => handleFieldChange('phone', e.target.value)} 
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && <p id="phone-error" className={errorTextClass}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.phone}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="emergencyContact" className={labelClass}>Emergency Contact *</label>
                    <input 
                      id="emergencyContact"
                      name="emergencyContact"
                      type="text" 
                      className={inputClass('emergencyContact')} 
                      placeholder="Name and Phone Number..." 
                      value={formData.emergencyContact} 
                      onChange={e => handleFieldChange('emergencyContact', e.target.value)} 
                      aria-invalid={!!errors.emergencyContact}
                      aria-describedby={errors.emergencyContact ? "emergency-error" : undefined}
                    />
                    {errors.emergencyContact && <p id="emergency-error" className={errorTextClass}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.emergencyContact}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className={labelClass}>Verified Email</label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      className={inputClass('email')} 
                      placeholder="patient@institutional.com" 
                      value={formData.email} 
                      onChange={e => handleFieldChange('email', e.target.value)} 
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <p id="email-error" className={errorTextClass}><svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="address" className={labelClass}>Physical Residence</label>
                    <textarea 
                      id="address"
                      name="address"
                      rows={2} 
                      className={inputClass('address')} 
                      placeholder="Official residential address for specialist documentation..." 
                      value={formData.address} 
                      onChange={e => handleFieldChange('address', e.target.value)} 
                    />
                  </div>
                </div>
              </section>

              <section>
                <header className="flex items-center space-x-4 mb-8">
                  <span className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-black text-gray-500">3</span>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex-1 border-b border-gray-100 dark:border-slate-800 pb-2">Clinical Intelligence</h4>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <label htmlFor="bloodGroup" className={labelClass}>Blood Group</label>
                    <input 
                      id="bloodGroup"
                      name="bloodGroup"
                      className={inputClass('bloodGroup')} 
                      placeholder="e.g. AB+" 
                      value={formData.bloodGroup} 
                      onChange={e => handleFieldChange('bloodGroup', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="insuranceProvider" className={labelClass}>Insurance Carrier</label>
                    <input 
                      id="insuranceProvider"
                      name="insuranceProvider"
                      className={inputClass('insuranceProvider')} 
                      placeholder="e.g. NHIS / Star Assurance" 
                      value={formData.insuranceProvider} 
                      onChange={e => handleFieldChange('insuranceProvider', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="allergies" className={labelClass}>Known Contraindications (Semicolon separated)</label>
                    <input 
                      id="allergies"
                      name="allergies"
                      className={inputClass('allergies')} 
                      placeholder="Penicillin; Nuts; Latex..." 
                      value={Array.isArray(formData.allergies) ? formData.allergies.join('; ') : formData.allergies} 
                      onChange={e => handleFieldChange('allergies', e.target.value as any)} 
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="medicalHistory" className={labelClass}>Active Clinical History (Semicolon separated)</label>
                    <textarea 
                      id="medicalHistory"
                      name="medicalHistory"
                      rows={3} 
                      className={inputClass('medicalHistory')} 
                      placeholder="Prior surgeries; chronic conditions; significant family history..." 
                      value={Array.isArray(formData.medicalHistory) ? formData.medicalHistory.join('; ') : formData.medicalHistory}
                      onChange={e => handleFieldChange('medicalHistory', e.target.value as any)} 
                    />
                  </div>
                </div>
              </section>
            </form>

            <div className="p-10 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex justify-end items-center space-x-4">
              <button type="button" onClick={closeModal} className="px-8 py-4 text-gray-500 font-black hover:text-gray-700 dark:hover:text-gray-300 transition-all uppercase tracking-widest text-[10px]">Discard Session</button>
              <button 
                onClick={handleSubmit}
                type="submit" 
                className={`px-12 py-4 text-white rounded-2xl shadow-2xl font-black transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-[10px] ${editingPatient ? 'bg-indigo-600 shadow-indigo-900/20 hover:bg-indigo-700' : 'bg-emerald-600 shadow-emerald-900/20 hover:bg-emerald-700'}`}
              >
                {editingPatient ? 'Save Changes' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistry;