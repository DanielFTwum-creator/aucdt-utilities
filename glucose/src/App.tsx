import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Printer, Plus, X, Trash2, LogOut, ShieldCheck, Activity, Eye, FileText, Settings, Camera, Loader2, Download, Upload, HelpCircle, Edit2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { useAuth } from './contexts/AuthContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { TestContainer } from './components/test/TestContainer';
import { HelpModal } from './components/HelpModal';
import { ClinicalAnalysis, band, bandPost } from './components/ClinicalAnalysis';
import {
  getAllReadings, upsertReading, deleteReading, batchUpsertReadings,
  getProfile, saveProfile, ReadingRow, getAdminConfig
} from './lib/db';

const COLS = [
  { id: 'fasting', label: 'Fasting', limit: 7.0, group: 'Morning', color: '#3b82f6', name: 'Fasting' },
  { id: 'post_breakfast', label: '2h Post-Breakfast', limit: 8.9, group: 'Morning' },
  { id: 'pre_lunch', label: 'Pre-Lunch', limit: 7.0, group: 'Lunch', color: '#10b981', name: 'Pre-Lunch' },
  { id: 'post_lunch', label: '2h Post-Lunch', limit: 8.9, group: 'Lunch' },
  { id: 'pre_dinner', label: 'Pre-Dinner', limit: 7.0, group: 'Dinner', color: '#8b5cf6', name: 'Pre-Dinner' },
  { id: 'post_dinner', label: '2h Post-Dinner', limit: 8.9, group: 'Dinner' },
] as const;

type ColId = typeof COLS[number]['id'];

// Chart line configuration (reduce repetition)
const CHART_LINES = COLS.filter(c => 'color' in c).map(c => ({
  id: c.id,
  name: c.name,
  color: c.color,
  strokeWidth: c.id === 'fasting' ? 3 : 2,
  dotSize: c.id === 'fasting' ? 4 : 3,
}));

interface Row {
  id: string;
  date: string;
  fasting: string;
  post_breakfast: string;
  pre_lunch: string;
  post_lunch: string;
  pre_dinner: string;
  post_dinner: string;
  createdAt?: number;
  updatedAt?: number;
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDate(isoStr: string) {
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(parts[1]) - 1]} ${parts[2]}, ${parts[0]}`;
}

function getMonthKey(isoStr: string) {
  const parts = isoStr.split('-');
  if (parts.length !== 3) return '';
  return `${parts[0]}-${parts[1]}`; // YYYY-MM
}

function getAverage(arr: (string | undefined)[]) {
  const nums = arr.filter(v => v !== '' && v != null && !isNaN(parseFloat(v))).map(Number);
  if (!nums.length) return null;
  return (nums.reduce((a,b)=>a+b, 0) / nums.length).toFixed(1);
}

function toCurrentUnit(valStr: string | undefined | null, unit: 'mmol/L' | 'mg/dL'): string {
  if (!valStr || isNaN(parseFloat(valStr))) return '';
  if (unit === 'mmol/L') return valStr;
  return (parseFloat(valStr) * 18.0182).toFixed(0);
}

function toBaseUnit(valStr: string | undefined | null, unit: 'mmol/L' | 'mg/dL'): string {
   if (!valStr || isNaN(parseFloat(valStr))) return '';
   if (unit === 'mmol/L') return valStr;
   return (parseFloat(valStr) / 18.0182).toFixed(1);
}

function convertTarget(limit: number, unit: 'mmol/L' | 'mg/dL') {
  if (unit === 'mmol/L') return limit.toFixed(1);
  return (limit * 18.0182).toFixed(0);
}

// Theme utilities for DRY styling
const themeClasses = {
  bgCard: (isHighContrast: boolean) => isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200',
  bgBody: (isHighContrast: boolean) => isHighContrast ? 'bg-gray-900' : 'bg-white',
  textPrimary: (isHighContrast: boolean) => isHighContrast ? 'text-white' : 'text-slate-900',
  textSecondary: (isHighContrast: boolean) => isHighContrast ? 'text-gray-400' : 'text-slate-400',
  borderLine: (isHighContrast: boolean) => isHighContrast ? 'border-gray-700' : 'border-slate-100',
  hoverBg: (isHighContrast: boolean) => isHighContrast ? 'hover:bg-gray-800' : 'hover:bg-slate-100',
  inputBg: (isHighContrast: boolean) => isHighContrast ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-200 text-slate-900',
};

// Get initials from name (use first and last letter for uniqueness)
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(p => p.length > 0);
  const titles = ['dr', 'dr.', 'prof', 'prof.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.'];
  const filtered = parts.filter(p => !titles.includes(p.toLowerCase()));
  if (filtered.length >= 2) {
    return (filtered[0][0] + filtered[filtered.length - 1][0]).toUpperCase();
  }
  return filtered[0]?.[0]?.toUpperCase() || '—';
};

function AppContent() {
  const { isAdmin, adminLogin, adminLogout } = useAdmin();
  const { logout, user } = useAuth();
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);

  const [rows, setRows] = useState<Row[]>([]);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr Yacoba Atiase');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [doctorCountry, setDoctorCountry] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year' | 'all'>('month');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [showTrendlines, setShowTrendlines] = useState(true);

  // UI preferences
  const [unit, setUnit] = useState<'mmol/L' | 'mg/dL'>('mmol/L');
  const [showLogData, setShowLogData] = useState(true);
  const [activeTab, setActiveTab] = useState<'log' | 'agp' | 'test'>('log');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showContactFields, setShowContactFields] = useState(false);

  // New reading form state
  const [newRow, setNewRow] = useState<Partial<Row>>({ date: new Date().toISOString().split('T')[0] });
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [patterns, setPatterns] = useState<{ type: string; description: string; severity: string }[]>([]);
  const importInputRef = useRef<HTMLInputElement>(null);
  const importCSVInputRef = useRef<HTMLInputElement>(null);

  // Initialize first-time flag
  useEffect(() => {
    getAdminConfig('adminPassword').then(pw => setIsFirstTime(!pw));
  }, []);

  // Populate patient name from authenticated user's fullName
  useEffect(() => {
    if (user?.fullName && !patientName) {
      setPatientName(user.fullName);
    }
  }, [user?.fullName, patientName]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !isAdmin) return;

    try {
      setIsUploading(true);
      setUploadProgress(5);
      setUploadStatus(`Preparing ${files.length} scans...`);
      setUploadError('');

      const compressImage = (f: File, maxDim = 2000): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > maxDim) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                }
              } else {
                if (height > maxDim) {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }

              ctx.drawImage(img, 0, 0, width, height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              const base64 = dataUrl.split(',')[1];
              resolve(base64);
            };
            img.onerror = (err) => reject(err);
          };
          reader.onerror = (err) => reject(err);
        });
      };

      const rowsToSave: ReadingRow[] = [];
      const now = Date.now();
      let successCount = 0;
      let completedCount = 0;
      const failedFiles: { name: string; reason: string }[] = [];

      const processFile = async (fileIndex: number) => {
        const file = files[fileIndex];
        console.log(`[SCAN] Starting file (${fileIndex + 1}/${files.length}):`, file.name);

        try {
          const base64Image = await compressImage(file);
          const response = await fetch('/glucose/api/scan-glucose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageData: base64Image,
              mimeType: 'image/jpeg',
            }),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(`API error ${response.status}: ${text.substring(0, 100)}`);
          }

          const result = await response.json();
          const rowsToAdd = result.readings;
          console.log(`[SCAN] File ${file.name} returned`, rowsToAdd?.length || 0, 'readings');

          if (!rowsToAdd || rowsToAdd.length === 0) {
            throw new Error('No readings found in the image');
          }

          for (const row of rowsToAdd) {
            if (!row || !row.date) continue;
            let formattedDate = row.date;
            try {
              const d = new Date(row.date);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toISOString().split('T')[0];
              }
            } catch (err) {}

            if (!formattedDate || typeof formattedDate !== 'string' || formattedDate.includes('NaN') || formattedDate.trim() === '') continue;

            const existingRowIndex = rowsToSave.findIndex(r => r.date === formattedDate);
            let baseRow: ReadingRow;

            if (existingRowIndex >= 0) {
              baseRow = rowsToSave[existingRowIndex];
            } else {
              const dbRow = rows.find(r => r.date === formattedDate);
              baseRow = {
                id: dbRow ? dbRow.id : `row_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                date: formattedDate,
                fasting: dbRow?.fasting || '',
                post_breakfast: dbRow?.post_breakfast || '',
                pre_lunch: dbRow?.pre_lunch || '',
                post_lunch: dbRow?.post_lunch || '',
                pre_dinner: dbRow?.pre_dinner || '',
                post_dinner: dbRow?.post_dinner || '',
                createdAt: (dbRow as any)?.createdAt ?? now,
                updatedAt: now,
              };
            }

            if (row.fasting) baseRow.fasting = toBaseUnit(row.fasting, unit);
            if (row.post_breakfast) baseRow.post_breakfast = toBaseUnit(row.post_breakfast, unit);
            if (row.pre_lunch) baseRow.pre_lunch = toBaseUnit(row.pre_lunch, unit);
            if (row.post_lunch) baseRow.post_lunch = toBaseUnit(row.post_lunch, unit);
            if (row.pre_dinner) baseRow.pre_dinner = toBaseUnit(row.pre_dinner, unit);
            if (row.post_dinner) baseRow.post_dinner = toBaseUnit(row.post_dinner, unit);
            baseRow.updatedAt = now;

            if (existingRowIndex >= 0) {
              rowsToSave[existingRowIndex] = baseRow;
            } else {
              rowsToSave.push(baseRow);
            }
            successCount++;
          }
        } catch (fileErr: any) {
          console.error(`[SCAN] Error processing file ${file.name}:`, fileErr);
          failedFiles.push({ name: file.name, reason: fileErr.message || String(fileErr) });
        } finally {
          completedCount++;
          const progressVal = Math.floor((completedCount / files.length) * 90) + 5;
          setUploadProgress(progressVal);
          setUploadStatus(`Scanning: processed ${completedCount} of ${files.length} scans...`);
        }
      };

      const queue = Array.from({ length: files.length }, (_, idx) => idx);
      const activeWorkers: Promise<void>[] = [];
      const CONCURRENCY = 1;

      for (let w = 0; w < Math.min(CONCURRENCY, files.length); w++) {
        const runNext = async (): Promise<void> => {
          if (queue.length === 0) return;
          const fileIdx = queue.shift()!;
          await processFile(fileIdx);
          await runNext();
        };
        activeWorkers.push(runNext());
      }

      await Promise.all(activeWorkers);

      if (rowsToSave.length > 0) {
        setUploadProgress(95);
        setUploadStatus(`Saving ${rowsToSave.length} successfully scanned readings...`);

        // Chunk into batches of 20 to avoid 502 server crashes
        const BATCH_SIZE = 20;
        for (let i = 0; i < rowsToSave.length; i += BATCH_SIZE) {
          const chunk = rowsToSave.slice(i, i + BATCH_SIZE);
          await batchUpsertReadings(chunk);
        }
        
        const refreshed = await getAllReadings();
        const refreshedTyped = refreshed as Row[];
        setRows(refreshedTyped);

        const scannedMonths = new Set<string>();
        rowsToSave.forEach(r => {
          const m = getMonthKey(r.date);
          if (m) scannedMonths.add(m);
        });
        const latestScannedMonth = Array.from(scannedMonths).sort().pop();
        if (latestScannedMonth) {
          setSelectedMonth(latestScannedMonth);
        }
      }

      if (failedFiles.length > 0) {
        const failedSummary = failedFiles.map(f => `• ${f.name}: ${f.reason}`).join('\n');
        if (rowsToSave.length > 0) {
          setUploadError(`Successfully imported ${rowsToSave.length} dates, but ${failedFiles.length} file(s) failed:\n${failedSummary}`);
        } else {
          setUploadError(`All selected files failed to scan:\n${failedSummary}`);
        }
      } else {
        setUploadProgress(100);
        setUploadStatus(`Successfully processed ${files.length} file(s)! Extracted ${successCount} entries across ${rowsToSave.length} dates.`);
        setTimeout(() => setIsUploading(false), 3000);
      }
    } catch (err) {
      console.error('[SCAN] Batch process error:', err);
      setUploadError(String(err));
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      console.log('[APP] Not admin, clearing rows');
      setRows([]);
      setPatientName(user?.fullName || '');
      setDoctorName('Dr Yacoba Atiase');
      setDoctorPhone('');
      setDoctorCountry('');
      return;
    }
    console.log('[APP] Admin mode, loading profile and readings...');
    getProfile().then(profile => {
      if (profile) {
        setPatientName(profile.patientName || user?.fullName || '');
        setDoctorName(profile.doctorName || 'Dr Yacoba Atiase');
        setDoctorPhone(profile.doctorPhone || '');
        setDoctorCountry(profile.doctorCountry || '');
      }
    });
    getAllReadings().then(fetched => {
      console.log('[APP] getAllReadings returned', fetched.length, 'rows, setting state');
      setRows(fetched as Row[]);
    });
  }, [isAdmin]);

  // Load clinical patterns from backend when rows or admin mode changes
  useEffect(() => {
    if (!isAdmin) {
      setPatterns([]);
      return;
    }
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    const base = seg && seg !== 'api' ? `/${seg}` : '';
    fetch(`${base}/api/patterns`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch patterns');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPatterns(data);
        }
      })
      .catch(err => {
        console.error('[APP] Failed to load patterns:', err);
      });
  }, [rows, isAdmin]);

  // Save profile changes
  useEffect(() => {
    if (!isAdmin || (!patientName && !doctorName)) return;
    const timeout = setTimeout(() => {
      saveProfile({ patientName, doctorName, doctorPhone, doctorCountry });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [patientName, doctorName, doctorPhone, doctorCountry, isAdmin]);

  const monthOptions = useMemo(() => {
    console.log('[APP] monthOptions computed: rows.length =', rows.length);
    const keys = new Set<string>();
    rows.forEach(r => {
      const k = getMonthKey(r.date);
      if (k) keys.add(k);
    });
    return Array.from(keys).sort();
  }, [rows]);

  const yearOptions = useMemo(() => {
    const years = new Set<string>();
    rows.forEach(r => {
      const yr = r.date.split('-')[0];
      if (yr) years.add(yr);
    });
    return Array.from(years).sort().reverse();
  }, [rows]);

  useEffect(() => {
    if (viewMode === 'month') {
      const latestMonth = monthOptions[monthOptions.length - 1];
      if (latestMonth && (!selectedMonth || !monthOptions.includes(selectedMonth))) {
        console.log('[APP] Auto-selecting latest month:', latestMonth);
        setSelectedMonth(latestMonth);
      }
    } else {
      const latestYear = yearOptions[0];
      if (latestYear && (!selectedYear || !yearOptions.includes(selectedYear))) {
        console.log('[APP] Auto-selecting latest year:', latestYear);
        setSelectedYear(latestYear);
      }
    }
  }, [monthOptions, yearOptions, viewMode]);

  const filteredRows = useMemo(() => {
    if (viewMode === 'month') {
      if (!selectedMonth) return [];
      return rows.filter(r => getMonthKey(r.date) === selectedMonth).sort((a, b) => a.date.localeCompare(b.date));
    } else if (viewMode === 'year') {
      if (!selectedYear) return [];
      return rows.filter(r => r.date.startsWith(selectedYear)).sort((a, b) => a.date.localeCompare(b.date));
    } else {
      return [...rows].sort((a, b) => a.date.localeCompare(b.date));
    }
  }, [rows, selectedMonth, selectedYear, viewMode]);

  const handleAddReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.date) return;

    console.log('[MANUAL] Starting manual entry for date:', newRow.date);
    console.log('[MANUAL] Current rows before save:', rows.length);

    const existingIdx = rows.findIndex(r => r.date === newRow.date);
    const existingRow = existingIdx >= 0 ? rows[existingIdx] : null;
    const rowId = existingRow ? existingRow.id : Date.now().toString();

    const rowToAdd: Row = {
      id: rowId,
      date: newRow.date,
      fasting: newRow.fasting !== undefined ? toBaseUnit(newRow.fasting, unit) : (existingRow?.fasting || ''),
      post_breakfast: newRow.post_breakfast !== undefined ? toBaseUnit(newRow.post_breakfast, unit) : (existingRow?.post_breakfast || ''),
      pre_lunch: newRow.pre_lunch !== undefined ? toBaseUnit(newRow.pre_lunch, unit) : (existingRow?.pre_lunch || ''),
      post_lunch: newRow.post_lunch !== undefined ? toBaseUnit(newRow.post_lunch, unit) : (existingRow?.post_lunch || ''),
      pre_dinner: newRow.pre_dinner !== undefined ? toBaseUnit(newRow.pre_dinner, unit) : (existingRow?.pre_dinner || ''),
      post_dinner: newRow.post_dinner !== undefined ? toBaseUnit(newRow.post_dinner, unit) : (existingRow?.post_dinner || ''),
    };

    console.log('[MANUAL] Row to save:', rowToAdd);

    const now = Date.now();
    const rowToSave: ReadingRow = {
      ...rowToAdd,
      createdAt: (existingRow as any)?.createdAt ?? now,
      updatedAt: now,
    };

    console.log('[MANUAL] Upserting reading...');
    await upsertReading(rowToSave);
    console.log('[MANUAL] Upsert complete, fetching all readings...');

    const updatedRows = await getAllReadings();
    console.log('[MANUAL] Fetched', updatedRows.length, 'readings from DB');
    console.log('[MANUAL] Readings:', updatedRows.map(r => ({ date: r.date, id: r.id })));

    setRows(updatedRows as Row[]);

    setIsModalOpen(false);
    setNewRow({ date: new Date().toISOString().split('T')[0] });

    console.log('[MANUAL] Keeping current month view:', selectedMonth);
  };

  const openEditModal = (row: Row) => {
    setEditingId(row.id);
    setNewRow({
      date: row.date,
      fasting: toCurrentUnit(row.fasting, unit),
      post_breakfast: toCurrentUnit(row.post_breakfast, unit),
      pre_lunch: toCurrentUnit(row.pre_lunch, unit),
      post_lunch: toCurrentUnit(row.post_lunch, unit),
      pre_dinner: toCurrentUnit(row.pre_dinner, unit),
      post_dinner: toCurrentUnit(row.post_dinner, unit),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewRow({ date: new Date().toISOString().split('T')[0] });
  };

  const deleteRow = async (id: string) => {
    await deleteReading(id);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const handleExportData = async () => {
    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      readings: rows,
      profile: { patientName, doctorName, doctorPhone, doctorCountry },
    };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rophe-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.readings || !Array.isArray(data.readings)) {
        setUploadError('Invalid backup file format.');
        return;
      }

      await batchUpsertReadings(data.readings);
      if (data.profile) {
        setPatientName(data.profile.patientName || '');
        setDoctorName(data.profile.doctorName || '');
        setDoctorPhone(data.profile.doctorPhone || '');
        setDoctorCountry(data.profile.doctorCountry || '');
      }

      const refreshed = await getAllReadings();
      setRows(refreshed as Row[]);
      setUploadStatus(`Restored ${data.readings.length} readings successfully!`);
      setIsUploading(true);
      setUploadProgress(100);
      setTimeout(() => setIsUploading(false), 2000);
    } catch (err) {
      setUploadError('Failed to import backup: ' + String(err));
    }
    if (importInputRef.current) importInputRef.current.value = '';
  };

  const handleExportCSV = () => {
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    const base = seg && seg !== 'api' ? `/${seg}` : '';
    window.location.href = `${base}/api/export`;
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setIsUploading(true);
      setUploadProgress(20);
      setUploadStatus('Uploading CSV...');
      setUploadError('');

      const seg = window.location.pathname.split('/').filter(Boolean)[0];
      const base = seg && seg !== 'api' ? `/${seg}` : '';

      const res = await fetch(`${base}/api/import-csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: text,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to import CSV');
      }

      const result = await res.json();
      setUploadProgress(100);
      setUploadStatus(`Restored ${result.count} readings successfully from CSV!`);
      
      const refreshed = await getAllReadings();
      setRows(refreshed as Row[]);
      setTimeout(() => setIsUploading(false), 2000);
    } catch (err) {
      setUploadError('Failed to import CSV: ' + String(err));
      setIsUploading(false);
    }
    if (importCSVInputRef.current) importCSVInputRef.current.value = '';
  };

  const currentMonthLabel = useMemo(() => {
    if (viewMode === 'month') {
      if (!selectedMonth) return '—';
      const [yr, mo] = selectedMonth.split('-');
      return `${MONTH_NAMES[parseInt(mo) - 1]} ${yr}`;
    } else {
      if (!selectedYear) return '—';
      return `Year ${selectedYear}`;
    }
  }, [selectedMonth, selectedYear, viewMode]);

  // Calculations for summary (filtered by current month)
  const fastVals = filteredRows.map(r => r.fasting);
  const postVals = filteredRows.flatMap(r => [r.post_breakfast, r.post_lunch, r.post_dinner]);
  const allVals = filteredRows.flatMap(r => COLS.map(c => r[c.id])).filter(v => v !== '' && v != null && !isNaN(parseFloat(v))).map(Number);

  // Total readings across all months
  const allReadingsVals = rows.flatMap(r => COLS.map(c => r[c.id])).filter(v => v !== '' && v != null && !isNaN(parseFloat(v))).map(Number);

  const hi = allVals.length ? toCurrentUnit(Math.max(...allVals).toFixed(1), unit) : null;
  const af = toCurrentUnit(getAverage(fastVals), unit);
  const ap = toCurrentUnit(getAverage(postVals), unit);

  // Base (mmol/L) metrics for the clinical-analysis bands
  const avgFastingBase = getAverage(fastVals) != null ? parseFloat(getAverage(fastVals)!) : null;
  const avgPostBase = getAverage(postVals) != null ? parseFloat(getAverage(postVals)!) : null;
  const overallBase = getAverage(allVals.map(String)) != null ? parseFloat(getAverage(allVals.map(String))!) : null;
  const highestBase = allVals.length ? Math.max(...allVals) : null;
  const fastingBand = band(avgFastingBase);
  const postBand = bandPost(avgPostBase);
  const highestBand = band(highestBase);
  const overallBand = band(overallBase);
  const oa = toCurrentUnit(getAverage(allVals.map(String)), unit);

  const hiCls = hi && parseFloat(hi) >= parseFloat(convertTarget(8.9, unit)) ? (isHighContrast ? 'text-[#D00000]' : 'text-red-600') : (isHighContrast ? 'text-[#006400]' : 'text-green-600');
  const afCls = af && parseFloat(af) >= parseFloat(convertTarget(7.0, unit)) ? (isHighContrast ? 'text-[#D00000]' : 'text-red-600') : (isHighContrast ? 'text-[#006400]' : 'text-green-600');
  const apCls = ap && parseFloat(ap) >= parseFloat(convertTarget(8.9, unit)) ? (isHighContrast ? 'text-[#D00000]' : 'text-red-600') : (isHighContrast ? 'text-[#006400]' : 'text-green-600');

  // AGP Chart Data
  // Calculate linear regression trendline
  const calculateTrendline = (values: (number | null)[]): (number | null)[] => {
    const validValues = values
      .map((v, i) => ({ v, i }))
      .filter(({ v }) => v !== null && !isNaN(v));

    if (validValues.length < 2) return Array(values.length).fill(null);

    const n = validValues.length;
    const sumX = validValues.reduce((sum, { i }) => sum + i, 0);
    const sumY = validValues.reduce((sum, { v }) => sum + (v as number), 0);
    const sumXY = validValues.reduce((sum, { v, i }) => sum + i * (v as number), 0);
    const sumX2 = validValues.reduce((sum, { i }) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return values.map((_, i) => slope * i + intercept);
  };

  const chartData = useMemo(() => {
    const baseData = filteredRows.map(r => {
      return {
        date: formatDate(r.date).replace(/, \d{4}/, ''), // Shorten date
        fasting: r.fasting ? parseFloat(toCurrentUnit(r.fasting, unit)) : null,
        post_breakfast: r.post_breakfast ? parseFloat(toCurrentUnit(r.post_breakfast, unit)) : null,
        pre_lunch: r.pre_lunch ? parseFloat(toCurrentUnit(r.pre_lunch, unit)) : null,
        post_lunch: r.post_lunch ? parseFloat(toCurrentUnit(r.post_lunch, unit)) : null,
        pre_dinner: r.pre_dinner ? parseFloat(toCurrentUnit(r.pre_dinner, unit)) : null,
        post_dinner: r.post_dinner ? parseFloat(toCurrentUnit(r.post_dinner, unit)) : null,
      };
    });

    if (!showTrendlines) return baseData;

    // Add trendline values for each metric
    const fastingValues = baseData.map(d => d.fasting);
    const preLunchValues = baseData.map(d => d.pre_lunch);
    const preDinnerValues = baseData.map(d => d.pre_dinner);

    const fastingTrend = calculateTrendline(fastingValues);
    const preLunchTrend = calculateTrendline(preLunchValues);
    const preDinnerTrend = calculateTrendline(preDinnerValues);

    return baseData.map((d, i) => ({
      ...d,
      fasting_trend: fastingTrend[i],
      pre_lunch_trend: preLunchTrend[i],
      pre_dinner_trend: preDinnerTrend[i],
    }));
  }, [filteredRows, unit, showTrendlines]);

  if (!isAdmin) {
    return (
      <div data-test="app-root" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="border-2 border-[#1F3864] text-[#1F3864] px-6 py-2 text-3xl font-bold tracking-tighter rounded-lg mb-6 shadow-sm">
          ROPHE
        </div>
        <h1 className="text-2xl font-semibold mb-1 text-slate-900">Self Monitoring of Blood Glucose</h1>
        <p className="text-slate-500 mb-8 max-w-sm text-sm">
          {isFirstTime === null
            ? 'Loading...'
            : isFirstTime
            ? 'Create a password to secure your records.'
            : 'Enter your password to access your records.'}
        </p>
        <form
          className="flex flex-col gap-4 w-full max-w-sm"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoginError('');
            const ok = await adminLogin(passwordInput);
            if (!ok) setLoginError('Incorrect password. Please try again.');
          }}
        >
          <input
            type="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            placeholder={isFirstTime ? 'Set a new password' : 'Enter password'}
            className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#2E75B6] shadow-sm"
            autoFocus
            required
          />
          {loginError && (
            <p className="text-red-500 text-sm font-medium">{loginError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#2E75B6] text-white px-8 py-3.5 rounded-xl font-medium hover:bg-[#1F3864] transition-colors flex items-center justify-center gap-3 shadow-md focus:ring-4 focus:ring-blue-100 outline-none"
          >
            <ShieldCheck className="w-5 h-5" />
            {isFirstTime ? 'Set Password & Enter' : 'Unlock'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div data-test="app-root" className={`min-h-screen font-sans p-6 print:bg-white print:p-0 flex flex-col items-center selection:bg-[#D6E4F0] selection:text-[#1F3864] transition-colors duration-300 ${isHighContrast ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-3xl p-8 shadow-2xl relative overflow-hidden ${isHighContrast ? 'bg-gray-900 text-white border border-gray-700' : 'bg-white'}`}>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${uploadError ? 'bg-red-100 text-red-600' : 'bg-[#1F3864]/10'}`}>
                 {uploadError ? <X className="w-8 h-8" /> : <Camera className={`w-8 h-8 ${isHighContrast ? 'text-white' : 'text-[#1F3864]'} animate-pulse`} />}
              </div>
              <h3 className={`text-xl font-bold mb-2 font-sans tracking-tight ${uploadError ? 'text-red-500' : (isHighContrast ? 'text-white' : 'text-[#1F3864]')}`}>
                {uploadError ? 'Scanning Failed' : 'Scanning Document'}
              </h3>
              
              {uploadError ? (
                <>
                  <p className="text-[14px] text-red-400 font-medium mb-8 max-h-32 overflow-y-auto">{uploadError}</p>
                  <button onClick={() => setIsUploading(false)} className={`w-full rounded-2xl flex items-center justify-center p-3 transition-all duration-200 cursor-pointer shadow-sm focus:outline-none focus:ring-4 focus:ring-red-200 border-2 border-transparent bg-red-600 text-white hover:bg-red-700`}>
                    Close
                  </button>
                </>
              ) : (
                <>
                  <p className="text-[14px] text-slate-500 font-medium mb-8">{uploadStatus}</p>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div 
                      className="h-full bg-[#D4A373] transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest text-right w-full">{uploadProgress}%</p>
                </>
              )}
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4A373] opacity-5 rounded-full blur-3xl mix-blend-multiply" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#1F3864] opacity-5 rounded-full blur-3xl mix-blend-multiply" />
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl flex flex-col flex-grow">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 print:hidden">
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-1">
            <img src="./rophe-logo.jpg" alt="ROPHE Logo" className="h-12 object-contain" />
            <a href="https://wa.me/233201529933" target="_blank" rel="noopener noreferrer" className={`text-xs font-semibold hover:underline ${isHighContrast ? 'text-blue-400 hover:text-blue-300' : 'text-[#2E75B6] hover:text-[#1F3864]'}`}>
              +233 20 152 9933
            </a>
          </div>
          <div>
            <h1 className={`text-lg font-bold leading-tight ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>Self Monitoring of Blood Glucose</h1>
            <p className={`text-[11px] uppercase tracking-[0.15em] font-bold mt-0.5 ${isHighContrast ? 'text-blue-300' : 'text-[#2E75B6]'}`}>Specialist Care Portal</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          
          <div className={`border-2 rounded-lg flex items-center shadow-sm h-10 ${isHighContrast ? 'bg-gray-900 border-gray-600' : 'bg-white border-[#2E75B6]'}`}>
            <span className={`text-[11px] font-bold px-3 tracking-wider border-r ${isHighContrast ? 'border-gray-600 text-gray-400' : 'border-[#2E75B6] text-[#2E75B6]'}`}>UNIT</span>
            <button 
              onClick={() => setUnit('mmol/L')}
              className={`text-[12px] font-bold px-4 py-1.5 transition-colors ${unit === 'mmol/L' ? (isHighContrast ? 'bg-white text-black' : 'bg-[#2E75B6] text-white') : 'text-slate-500 hover:text-slate-700'}`}
              aria-pressed={unit === 'mmol/L'}
            >
              mmol/L
            </button>
            <button 
              onClick={() => setUnit('mg/dL')}
              className={`text-[12px] font-bold px-4 py-1.5 transition-colors ${unit === 'mg/dL' ? (isHighContrast ? 'bg-white text-black' : 'bg-[#2E75B6] text-white') : 'text-slate-500 hover:text-slate-700'}`}
              aria-pressed={unit === 'mg/dL'}
            >
              mg/dL
            </button>
          </div>

          <div className="flex items-center gap-2 border-r pr-3 border-slate-200">
            <button 
              onClick={() => setIsHighContrast(!isHighContrast)} 
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 min-h-[40px] text-xs font-semibold ${isHighContrast ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300' : 'text-slate-600 hover:text-[#1F3864] hover:bg-slate-200'}`} 
            >
              <Eye className="w-4 h-4" /> <span className="hidden xl:inline">Contrast</span>
            </button>

            <button
              onClick={() => setIsHelpOpen(true)}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 min-h-[40px] text-xs font-semibold ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-600 hover:text-[#1F3864] hover:bg-slate-200'}`}
            >
              <HelpCircle className="w-4 h-4" /> <span className="hidden xl:inline">Help</span>
            </button>

            <button onClick={() => { adminLogout(); logout(); }} className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 min-h-[40px] text-xs font-semibold ${isHighContrast ? 'text-red-400 hover:text-red-300 hover:bg-gray-800' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}>
              <LogOut className="w-4 h-4" /> <span className="hidden xl:inline">Sign Out</span>
            </button>
          </div>

          <div className="flex items-center gap-2 border-r pr-3 border-slate-200">
            <button
              onClick={handleExportData}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 min-h-[40px] text-xs font-semibold ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-600 hover:text-[#1F3864] hover:bg-slate-200'}`}
            >
              <Download className="w-4 h-4" /> <span className="hidden xl:inline">Export JSON</span>
            </button>
            <label
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer min-h-[40px] text-xs font-semibold ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-600 hover:text-[#1F3864] hover:bg-slate-200'}`}
            >
              <input type="file" accept=".json" className="sr-only" ref={importInputRef} onChange={handleImportData} />
              <Upload className="w-4 h-4" /> <span className="hidden xl:inline">Import JSON</span>
            </label>
            <button
              onClick={handleExportCSV}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 min-h-[40px] text-xs font-semibold ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-emerald-600 hover:bg-emerald-50'}`}
            >
              <FileText className="w-4 h-4" /> <span className="hidden xl:inline">Export CSV</span>
            </button>
            <label
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer min-h-[40px] text-xs font-semibold ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-emerald-600 hover:bg-emerald-50'}`}
            >
              <input type="file" accept=".csv" className="sr-only" ref={importCSVInputRef} onChange={handleImportCSV} />
              <Upload className="w-4 h-4" /> <span className="hidden xl:inline">Import CSV</span>
            </label>
          </div>

          <div className={`border rounded-lg flex items-center shadow-sm h-10 ${isHighContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'} overflow-hidden`}>
            <span className="text-[11px] font-bold text-slate-400 px-3 tracking-wider border-r border-slate-200">PERIOD</span>
            
            <input 
              type="month" 
              value={selectedMonth || ''}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setViewMode('month');
              }}
              className={`text-sm px-3 py-1 bg-transparent border-none outline-none focus:ring-0 font-bold cursor-pointer ${isHighContrast ? 'text-white' : 'text-[#1F3864]'} [color-scheme:light]`}
            />
            
            <button 
              onClick={() => { setSelectedMonth(''); setViewMode('all'); }} 
              className={`px-3 py-1 h-full text-xs font-bold uppercase border-l ${isHighContrast ? 'border-gray-700' : 'border-slate-200'} transition-colors ${viewMode === 'all' ? (isHighContrast ? 'bg-blue-900 text-white' : 'bg-blue-100 text-[#1F3864]') : 'text-slate-500 hover:text-slate-700'}`}
            >
              All Time
            </button>
          </div>
          
          <button 
            onClick={() => window.print()}
            className={`shrink-0 px-4 h-10 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm focus:ring-4 focus:ring-blue-100 ${isHighContrast ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#2E75B6] text-white hover:bg-[#1F3864]'}`}
          >
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Print Report</span>
          </button>
        </div>
      </header>

      {/* User Meta Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print:mb-4">
        <div className={`border rounded-xl p-4 flex items-center gap-4 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-[#D6E4F0] ${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'}`}>
          <div className="w-11 h-11 rounded-full bg-[#D6E4F0] flex items-center justify-center text-[#1F3864] font-bold text-sm uppercase shrink-0 tracking-tight">{patientName ? getInitials(patientName) : 'PT'}</div>
          <div className="flex-1">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isHighContrast ? 'text-gray-400' : 'text-slate-400'}`}>Patient</p>
            <input
              value={patientName}
              readOnly
              className={`font-semibold text-[15px] outline-none w-full bg-transparent cursor-default ${isHighContrast ? 'text-white placeholder-gray-600' : 'text-slate-900 placeholder-slate-300'}`}
              placeholder="Enter patient name..."
            />
          </div>
        </div>
        <div className={`border rounded-xl p-4 flex flex-col shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-[#D6E4F0] ${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase shrink-0 tracking-tight">{doctorName ? getInitials(doctorName) : 'DR'}</div>
            <div className="flex-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isHighContrast ? 'text-gray-400' : 'text-slate-400'}`}>Physician</p>
              <input
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                className={`font-semibold text-[15px] outline-none w-full bg-transparent ${isHighContrast ? 'text-white placeholder-gray-600' : 'text-slate-900 placeholder-slate-300'}`}
                placeholder="Enter doctor's name..."
              />
            </div>
          </div>
          <div className={`flex gap-3 pt-3 border-t ${isHighContrast ? 'border-gray-800' : 'border-slate-100'}`}>
            <div className="flex-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isHighContrast ? 'text-gray-400' : 'text-slate-400'}`}>Country</p>
              <input
                value={doctorCountry}
                onChange={e => setDoctorCountry(e.target.value)}
                className={`font-semibold text-[13px] outline-none w-full bg-transparent ${isHighContrast ? 'text-white placeholder-gray-600' : 'text-slate-700 placeholder-slate-300'}`}
                placeholder="e.g. GH +233"
              />
            </div>
            <div className="flex-1">
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isHighContrast ? 'text-gray-400' : 'text-slate-400'}`}>Phone</p>
              <input
                value={doctorPhone}
                onChange={e => setDoctorPhone(e.target.value)}
                className={`font-semibold text-[13px] outline-none w-full bg-transparent ${isHighContrast ? 'text-white placeholder-gray-600' : 'text-slate-700 placeholder-slate-300'}`}
                placeholder="e.g. 20 152 9933"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6 flex-grow print:block">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 print:flex print:flex-wrap">
          {/* Average Fasting */}
          <div className={`${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-sm flex flex-col justify-center print:border-slate-300 print:shadow-none`}>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Average Fasting ({unit})</p>
            <div className="flex items-end gap-3 mb-1">
              <div className="text-4xl font-mono font-bold tabular-nums tracking-tighter" style={{ color: fastingBand?.color || (isHighContrast ? '#ffffff' : '#0f172a') }}>{af ? af : '—'}</div>
              {fastingBand && (
                <span className="text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider mb-1.5" style={{ backgroundColor: fastingBand.color + '1A', color: fastingBand.color }}>{fastingBand.label}</span>
              )}
            </div>
            <p className="text-[12px] font-medium text-slate-500 mt-1">Target (&lt; {convertTarget(7.0, unit)})</p>
          </div>

          {/* Average Post-Meal */}
          <div className={`${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-sm flex flex-col justify-center print:border-slate-300 print:shadow-none relative overflow-hidden`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 z-10 ${isHighContrast ? 'text-slate-400' : 'text-slate-500'}`}>Avg Post-Meal ({unit})</p>
            <div className="flex items-end gap-3 mb-1 z-10">
              <div className="text-4xl font-mono font-bold tabular-nums tracking-tighter" style={{ color: postBand?.color || (isHighContrast ? '#ffffff' : '#0f172a') }}>{ap ? ap : '—'}</div>
              {postBand && (
                <span className="text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider mb-1.5" style={{ backgroundColor: postBand.color + '1A', color: postBand.color }}>{postBand.label}</span>
              )}
            </div>
            <p className={`text-[12px] font-medium mt-1 z-10 ${isHighContrast ? 'text-slate-500' : 'text-slate-500'}`}>Target (&lt; {convertTarget(8.9, unit)})</p>
          </div>

          {/* Total Readings */}
          <div className={`${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-sm flex flex-col justify-center print:flex-1`}>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Total Readings</p>
            <div className={`text-4xl font-mono font-bold tracking-tight ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>{allVals.length}</div>
            <p className="text-[12px] font-medium text-slate-500 mt-1">Recorded readings in period</p>
          </div>
        </div>

        {/* Clinical Analysis summary — band-coloured metric cards + range legend */}
        <ClinicalAnalysis
          highest={highestBase}
          overall={overallBase}
          readingCount={allVals.length}
          unit={unit}
          isHighContrast={isHighContrast}
          patterns={patterns}
        />

        {/* Tab Navigation & Actions */}
        <div className="flex items-center justify-between border-b border-slate-200 print:hidden mt-4">
          <div className="flex items-center gap-6">
            <button
              className={`pb-3 text-[15px] font-bold uppercase tracking-widest transition-all ${activeTab === 'log' ? (isHighContrast ? 'text-white border-b-[4px] border-white' : 'text-[#1F3864] border-b-[4px] border-[#D4A373]') : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab('log')}
            >
              Raw Log Data
            </button>
            <button
              className={`pb-3 text-[15px] font-bold uppercase tracking-widest transition-all ${activeTab === 'agp' ? (isHighContrast ? 'text-white border-b-[4px] border-white' : 'text-[#1F3864] border-b-[4px] border-[#D4A373]') : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab('agp')}
            >
              Ambulatory Glucose Profile (AGP)
            </button>
            <button
              className={`pb-3 text-[15px] font-bold uppercase tracking-widest transition-all ${activeTab === 'test' ? (isHighContrast ? 'text-white border-b-[4px] border-white' : 'text-[#1F3864] border-b-[4px] border-[#D4A373]') : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab('test')}
            >
              E2E Test
            </button>
          </div>
          <div className="flex items-center gap-3 pb-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`rounded-lg flex items-center justify-center px-4 py-2 transition-all duration-200 cursor-pointer shadow-sm text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#D6E4F0]
                ${isHighContrast ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-[#1F3864] text-white hover:bg-[#2E75B6]'}`}
            >
               <Plus className="w-4 h-4 mr-2" strokeWidth={2.5} /> Manual Entry
            </button>
            <label
              data-testid="scan-button"
              className={`rounded-lg flex items-center justify-center px-4 py-2 transition-all duration-200 cursor-pointer shadow-sm text-[11px] font-bold uppercase tracking-widest border focus-within:outline-none focus-within:ring-2 focus-within:ring-[#D6E4F0]
                ${isHighContrast ? 'bg-black border-gray-700 text-white hover:bg-gray-800' : 'bg-white border-[#D4A373] text-[#1F3864] hover:bg-orange-50'} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
               <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImageUpload} />
               {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#D4A373]" /> : <Camera className="w-4 h-4 mr-2 text-[#D4A373]" strokeWidth={2.5} />}
               {isUploading ? uploadStatus : 'Scan Photo'}
            </label>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'test' ? (
          <TestContainer />
        ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[70vh] min-h-[500px] print:max-h-none print:h-auto print:border-none print:shadow-none">
          {activeTab === 'agp' ? (
            <div className={`p-6 flex-grow flex flex-col ${isHighContrast ? 'bg-gray-900 text-white' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Daily Glucose Variation Trend</h3>
                <button
                  onClick={() => setShowTrendlines(!showTrendlines)}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
                    showTrendlines
                      ? isHighContrast ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-700'
                      : isHighContrast ? 'bg-gray-800 text-gray-400 hover:text-gray-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title={showTrendlines ? 'Hide trendlines' : 'Show trendlines'}
                >
                  {showTrendlines ? '✓ Trendlines' : 'Trendlines'}
                </button>
              </div>
              {chartData.length > 0 ? (
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} horizontalFill={isHighContrast ? ['rgba(17, 24, 39, 0.8)', 'transparent'] : ['rgba(78, 52, 46, 0.04)', 'transparent']} />
                      <XAxis dataKey="date" tick={{fontSize: 12, fill: isHighContrast ? '#fff' : '#64748b'}} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{fontSize: 12, fill: isHighContrast ? '#fff' : '#64748b'}} axisLine={false} tickLine={false} dx={-10} domain={[(dataMin: number) => Math.min(unit === 'mmol/L' ? 3.5 : 65, dataMin - 1), 'dataMax + 1']} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: isHighContrast ? '#000' : '#fff', color: isHighContrast ? '#fff' : '#000' }}
                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                        labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }} />
                      
                      <ReferenceArea 
                        y1={unit === 'mmol/L' ? 3.9 : 70} 
                        y2={parseFloat(convertTarget(COLS.find(c => c.id === 'fasting')?.limit || 7.0, unit))} 
                        {...{ stroke: 'none', strokeOpacity: 0 } as any}
                        fill={isHighContrast ? '#10b981' : '#10b981'}
                        fillOpacity={isHighContrast ? 0.15 : 0.1}
                        label={{ position: 'insideTopLeft', value: 'Pre-Meal Target Range', fill: isHighContrast ? '#34d399' : '#059669', fontSize: 12, fontWeight: 600, opacity: 0.8 } as any}
                      />
                      
                      {CHART_LINES.map(line => (
                        <Line
                          key={line.id}
                          type="monotone"
                          name={line.name}
                          dataKey={line.id}
                          stroke={line.color}
                          strokeWidth={line.strokeWidth}
                          dot={{r: line.dotSize, strokeWidth: 2}}
                          connectNulls
                        />
                      ))}

                      {showTrendlines && (
                        <>
                          {CHART_LINES.map(line => (
                            <Line
                              key={`${line.id}_trend`}
                              type="monotone"
                              name={`${line.name} Trend`}
                              dataKey={`${line.id}_trend`}
                              stroke={line.color}
                              strokeWidth={3}
                              strokeOpacity={0.9}
                              dot={false}
                              connectNulls
                              isAnimationActive={false}
                            />
                          ))}
                        </>
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-slate-400 italic text-[13px]">
                  Not enough data to calculate AGP trends for this period.
                </div>
              )}
            </div>
          ) : (
            <>
              <div className={`overflow-auto flex-grow print:overflow-visible relative ${isHighContrast ? 'bg-black text-white' : ''}`}>
                <table className="w-full text-left border-collapse">
                  <thead className={`text-[10px] font-bold uppercase sticky top-0 z-10 print:static shadow-sm ${isHighContrast ? 'bg-gray-900 text-white border-b-2 border-gray-700' : 'bg-white text-slate-700 border-b border-slate-200'}`}>
                    <tr>
                      <th className="px-5 py-3 w-12 text-left tracking-wider">#</th>
                      <th className="px-4 py-3 w-28 text-left tracking-wider">Date</th>
                      {COLS.map((col) => (
                        <th key={col.id} className={`px-4 py-3 text-right whitespace-pre-line leading-tight tracking-wider ${col.id === 'pre_lunch' || col.id === 'pre_dinner' ? (isHighContrast ? 'border-l border-gray-700' : 'border-l border-slate-200') : ''}`}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[13px] font-medium">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={8} data-testid="empty-state" className="py-20 text-center text-[13px] text-slate-400 italic">
                          No readings recorded for this period.
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((r, i) => {
                        const isSelected = selectedRowId === r.id;
                        const activeHighContrast = 'bg-gray-800 border-gray-700';
                        const activeNormal = 'bg-[#FFF8E7] border-[#FDEAC9]';
                        const defaultHighContrast = 'border-gray-800 hover:bg-gray-800 even:bg-gray-900/80';
                        const defaultNormal = 'border-slate-100 hover:bg-[#FFF8E7] even:bg-[#4E342E]/[0.04]';
                        
                        return (
                          <tr 
                            key={r.id} 
                            onClick={() => setSelectedRowId(isSelected ? null : r.id)}
                            className={`group border-b cursor-pointer transition-colors ${
                              isHighContrast 
                                ? (isSelected ? activeHighContrast : defaultHighContrast)
                                : (isSelected ? activeNormal : defaultNormal)
                            }`}
                          >
                            <td className="px-5 py-3 text-slate-400 relative font-mono text-[11px]">
                              {(i + 1).toString().padStart(2, '0')}
                              <div className="absolute left-1 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(r);
                                  }}
                                  className="p-1 text-blue-500 hover:bg-blue-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  title="Edit reading"
                                  aria-label="Edit reading"
                                >
                                  <Edit2 className="w-[14px] h-[14px]" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteRow(r.id);
                                  }}
                                  className="p-1 text-rose-500 hover:bg-rose-100 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                                  title="Delete reading"
                                  aria-label="Delete reading"
                                >
                                  <Trash2 className="w-[14px] h-[14px]" />
                                </button>
                              </div>
                            </td>
                            <td className={`px-4 py-3 font-semibold whitespace-nowrap ${isHighContrast ? (isSelected ? 'text-white' : 'text-gray-200') : (isSelected ? 'text-amber-900' : 'text-slate-700')}`}>
                              {formatDate(r.date)}
                            </td>
                            {COLS.map((col) => {
                            const rawVal = r[col.id as ColId];
                            const isEmpty = rawVal === '' || rawVal == null || isNaN(parseFloat(rawVal));
                            const displayVal = isEmpty ? '' : toCurrentUnit(rawVal, unit);
                            const valNum = parseFloat(displayVal);
                            const targetLimit = parseFloat(convertTarget(col.limit, unit));
                            
                            const isHigh = !isEmpty && valNum >= targetLimit;
                            const lowLimit = unit === 'mmol/L' ? 4.0 : 72;
                            const isLow = !isEmpty && valNum < lowLimit;
                            
                            return (
                              <td key={col.id} className={`px-4 py-3 text-right ${col.id === 'pre_lunch' || col.id === 'pre_dinner' ? (isHighContrast ? 'border-l border-gray-800' : 'border-l border-slate-100') : ''}`}>
                                {isEmpty ? (
                                  <span className={`italic ${isHighContrast ? 'text-gray-600' : 'text-slate-300'}`}>—</span>
                                ) : (
                                  <span className={`inline-flex items-center justify-center min-w-[3rem] px-1.5 py-0.5 rounded font-mono text-[14.5px] font-semibold tabular-nums ${isHigh ? (isHighContrast ? 'bg-red-900/50 text-[#ff4444]' : 'bg-red-100 text-rose-700 font-bold') : isLow ? (isHighContrast ? 'text-sky-400' : 'text-sky-600') : (isHighContrast ? 'text-[#00ff00]' : 'text-emerald-600')}`}>
                                    {valNum.toFixed(unit === 'mmol/L' ? 1 : 0)}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 border-t text-xs font-medium print:hidden flex justify-between items-center border-l border-r ${themeClasses.bgBody(isHighContrast)} ${themeClasses.borderLine(isHighContrast)} ${themeClasses.textSecondary(isHighContrast)}`}>
                <span>Showing {filteredRows.length} records</span>
              </div>
            </>
          )}
        </div>
        )}
      </div>

      <footer className="mt-8 flex flex-col gap-6 print:hidden">
        <div className={`p-6 border rounded-2xl shadow-sm ${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isHighContrast ? 'text-gray-400' : 'text-slate-500'}`}>Clinical Glucose Ranges ({unit})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="h-1.5 w-full rounded-full mb-2 bg-[#dc2626]" />
              <p className={`text-[13px] font-semibold ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>Hypoglycaemia</p>
              <p className="text-[15px] font-bold tabular-nums text-[#dc2626]">&lt; {unit === 'mg/dL' ? '70' : '3.9'}</p>
            </div>
            <div className="text-center">
              <div className="h-1.5 w-full rounded-full mb-2 bg-[#059669]" />
              <p className={`text-[13px] font-semibold ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>Normal Fasting</p>
              <p className="text-[15px] font-bold tabular-nums text-[#059669]">{unit === 'mg/dL' ? '70–99' : '3.9–5.5'}</p>
            </div>
            <div className="text-center">
              <div className="h-1.5 w-full rounded-full mb-2 bg-[#d97706]" />
              <p className={`text-[13px] font-semibold ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>Pre-Diabetes</p>
              <p className="text-[15px] font-bold tabular-nums text-[#d97706]">{unit === 'mg/dL' ? '100–125' : '5.6–6.9'}</p>
            </div>
            <div className="text-center">
              <div className="h-1.5 w-full rounded-full mb-2 bg-[#ea580c]" />
              <p className={`text-[13px] font-semibold ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>Diabetes Range</p>
              <p className="text-[15px] font-bold tabular-nums text-[#ea580c]">≥ {unit === 'mg/dL' ? '126' : '7.0'}</p>
            </div>
          </div>
          <p className={`text-[11px] mt-4 ${isHighContrast ? 'text-gray-400' : 'text-slate-500'}`}>
            Note: post-meal target &lt; {unit === 'mg/dL' ? '140' : '7.8'} {unit} (2 hrs after a meal). Bands follow standard fasting-glucose clinical thresholds.
          </p>
        </div>

        <div className={`flex flex-wrap items-center gap-6 text-[10.5px] font-bold uppercase tracking-widest ${isHighContrast ? 'text-gray-500' : 'text-slate-400'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-green-500' : 'bg-emerald-500 shadow-sm shadow-emerald-200'}`} aria-hidden="true"></div> Normal Range
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-sky-400' : 'bg-sky-500 shadow-sm shadow-sky-200'}`} aria-hidden="true"></div> Low Range (&lt; {convertTarget(4.0, unit)})
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-[#ea580c]' : 'bg-[#ea580c] shadow-sm shadow-orange-200'}`} aria-hidden="true"></div> High Target / Alert
          </div>
          <div className={`md:ml-auto italic font-medium tracking-normal ${isHighContrast ? 'text-gray-600' : 'text-slate-300'}`}>
            ROPHE SPECIALIST CARE SYSTEM &copy; {new Date().getFullYear()}
          </div>
        </div>
      </footer>

      {/* Add Reading Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1F3864]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden transition-opacity">
          <div className={`rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform transition-all border ${themeClasses.bgBody(isHighContrast)}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isHighContrast ? 'bg-black border-gray-800' : 'bg-slate-50 border-slate-100'}`}>
              <h2 className={`font-bold text-lg ${themeClasses.textPrimary(isHighContrast)}`}>{editingId ? 'Edit Glucose Reading' : 'Log Glucose Reading'}</h2>
              <button
                onClick={closeModal} 
                className={`rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D6E4F0] ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddReading} className={`p-6 flex flex-col gap-6 ${themeClasses.bgBody(isHighContrast)}`}>
              <div className={`p-4 rounded-xl border ${isHighContrast ? 'bg-black border-gray-800' : 'bg-blue-50/50 border-blue-100/50'}`}>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isHighContrast ? 'text-blue-400' : 'text-[#1F3864]'}`} htmlFor="reading-date">Date of Measurement</label>
                <input 
                  id="reading-date"
                  type="date" required
                  value={newRow.date || ''}
                  onChange={e => setNewRow({...newRow, date: e.target.value})}
                  className={`w-full text-[15px] font-medium px-4 py-3 border rounded-lg outline-none focus:ring-4 focus:ring-[#D6E4F0] transition-all shadow-sm ${themeClasses.inputBg(isHighContrast)} focus:border-[#2E75B6]`}
                />
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                {COLS.map(col => (
                  <div key={col.id} className="relative group">
                    <label 
                      htmlFor={`input-${col.id}`}
                      className={`block text-[11px] font-bold mb-1.5 leading-tight tracking-wider ${isHighContrast ? 'text-gray-400' : 'text-slate-500'}`} 
                      title={`Target limit: < ${convertTarget(col.limit, unit)}`}
                    >
                      {col.label.replace('\n', ' ')}
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        id={`input-${col.id}`}
                        type="number" step="0.1" min="0" max={unit === 'mmol/L' ? "40" : "800"}
                        placeholder="—"
                        value={newRow[col.id as ColId] || ''}
                        onChange={e => setNewRow({...newRow, [col.id as ColId]: e.target.value})}
                        className={`w-full font-mono text-[16px] px-3.5 py-3 border rounded-lg outline-none focus:ring-4 focus:ring-[#D6E4F0] transition-all shadow-sm pr-16 placeholder:text-slate-300 ${themeClasses.inputBg(isHighContrast)} focus:border-[#2E75B6]`}
                        aria-describedby={`unit-${col.id}`}
                      />
                      <span id={`unit-${col.id}`} className={`absolute right-3.5 text-[10px] font-bold select-none pointer-events-none ${isHighContrast ? 'text-gray-500' : 'text-slate-400'}`}>
                        {unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`pt-4 mt-2 border-t flex justify-end gap-3 ${isHighContrast ? 'border-gray-800' : 'border-slate-100'}`}>
                <button type="button" onClick={closeModal} className={`px-5 py-2.5 text-sm font-bold tracking-wide rounded-lg transition-colors focus:ring-2 focus:ring-slate-200 ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-600 hover:bg-slate-100'}`}>
                  Cancel
                </button>
                <button type="submit" className={`px-6 py-2.5 text-sm tracking-wide font-bold rounded-lg shadow-sm transition-all focus:ring-4 focus:ring-[#D6E4F0] active:scale-[0.98] ${isHighContrast ? 'bg-white text-black hover:bg-gray-200' : 'text-white bg-[#2E75B6] hover:bg-[#1F3864]'}`}>
                  {editingId ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </div>
  );
}

function AppWrapper() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Handle OAuth callback: extract token from URL hash and store it
    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');
      if (accessToken) {
        // Store token in sessionStorage for auth context to use
        sessionStorage.setItem('google_access_token', accessToken);
        if (idToken) sessionStorage.setItem('google_id_token', idToken);
        // Clear hash and redirect to root
        window.location.replace(window.location.pathname);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return <AppContent />;
}

export default function App() {
  return (
    <AdminProvider>
      <AppWrapper />
    </AdminProvider>
  );
}
