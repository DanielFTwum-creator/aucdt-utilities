import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Printer, Plus, X, Trash2, LogOut, ShieldCheck, Activity, Eye, FileText, Settings, Camera, Loader2, Download, Upload, HelpCircle, Edit2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import { useAuth } from './contexts/AuthContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { TestContainer } from './components/test/TestContainer';
import { HelpModal } from './components/HelpModal';
import { ClinicalAnalysis } from './components/ClinicalAnalysis';
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
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
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
  const importInputRef = useRef<HTMLInputElement>(null);

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
    const file = e.target.files?.[0];
    console.log('[SCAN] File selected:', file?.name, file?.size);
    if (!file || !isAdmin) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      setUploadStatus('Processing image...');
      setUploadError('');

      const fileToBase64 = (f: File): Promise<string> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            console.log('[SCAN] Image converted to base64:', base64.length, 'chars');
            resolve(base64);
          };
          reader.readAsDataURL(f);
        });
      };

      const base64Image = await fileToBase64(file);
      console.log('[SCAN] Calling backend API...');

      setUploadProgress(40);
      setUploadStatus('Extracting data with AI...');

      console.log('[SCAN] Request URL:', '/glucose/api/scan-glucose');
      const response = await fetch('/glucose/api/scan-glucose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64Image,
          mimeType: file.type,
        }),
      });

      console.log('[SCAN] Response status:', response.status);
      console.log('[SCAN] Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        const text = await response.text();
        console.log('[SCAN] Error response body:', text.substring(0, 500));
        try {
          const error = JSON.parse(text);
          throw new Error(error.error || `API error: ${response.status}`);
        } catch (e) {
          throw new Error(`API error ${response.status}: ${text.substring(0, 200)}`);
        }
      }

      const result = await response.json();
      console.log('[SCAN] API response received:', result);
      const rowsToAdd = result.readings;
      console.log('[SCAN] API returned', rowsToAdd?.length || 0, 'readings');

      if (!rowsToAdd || rowsToAdd.length === 0) {
        console.error('[SCAN] No rows returned');
        setUploadError('No readings found in the image.');
        setIsUploading(false);
        return;
      }

      const rowsToSave: ReadingRow[] = [];
      const now = Date.now();
      let successCount = 0;
      let updateCount = 0;
      let newCount = 0;

      for (const row of rowsToAdd) {
        let formattedDate = row.date;
        try {
          const d = new Date(row.date);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toISOString().split('T')[0];
          }
        } catch (err) {}

        if (formattedDate.includes('NaN')) continue;

        const existingRow = rows.find(r => r.date === formattedDate);
        const newRowId = existingRow ? existingRow.id : `row_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        if (existingRow) {
          console.log('[SCAN] Updating existing reading for', formattedDate, '(id:', existingRow.id + ')');
          updateCount++;
        } else {
          console.log('[SCAN] Creating new reading for', formattedDate, '(id:', newRowId + ')');
          newCount++;
        }

        rowsToSave.push({
          id: newRowId,
          date: formattedDate,
          fasting: row.fasting ? toBaseUnit(row.fasting, unit) : (existingRow?.fasting || ''),
          post_breakfast: row.post_breakfast ? toBaseUnit(row.post_breakfast, unit) : (existingRow?.post_breakfast || ''),
          pre_lunch: row.pre_lunch ? toBaseUnit(row.pre_lunch, unit) : (existingRow?.pre_lunch || ''),
          post_lunch: row.post_lunch ? toBaseUnit(row.post_lunch, unit) : (existingRow?.post_lunch || ''),
          pre_dinner: row.pre_dinner ? toBaseUnit(row.pre_dinner, unit) : (existingRow?.pre_dinner || ''),
          post_dinner: row.post_dinner ? toBaseUnit(row.post_dinner, unit) : (existingRow?.post_dinner || ''),
          createdAt: (existingRow as any)?.createdAt ?? now,
          updatedAt: now,
        });
        successCount++;
      }

      console.log('[SCAN] Summary: extracted', successCount, 'readings (' + newCount + ' new, ' + updateCount + ' updated)');
      console.log('[SCAN] Saving', rowsToSave.length, 'rows...');
      await batchUpsertReadings(rowsToSave);
      const refreshed = await getAllReadings();
      console.log('[SCAN] DB now has', refreshed.length, 'readings');

      const refreshedTyped = refreshed as Row[];
      setRows(refreshedTyped);

      const scannedMonths = new Set<string>();
      rowsToSave.forEach(r => {
        const m = getMonthKey(r.date);
        if (m) scannedMonths.add(m);
      });
      const latestScannedMonth = Array.from(scannedMonths).sort().pop();
      console.log('[SCAN] Scanned months:', Array.from(scannedMonths), 'selecting:', latestScannedMonth);
      if (latestScannedMonth) {
        setSelectedMonth(latestScannedMonth);
      }

      setUploadProgress(100);
      setUploadStatus(`Successfully extracted and saved ${successCount} readings!`);
      setTimeout(() => setIsUploading(false), 2000);
    } catch (err) {
      console.error('[SCAN] Error:', err);
      setUploadError('Failed to process image: ' + String(err));
      setIsUploading(false);
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
    } else {
      if (!selectedYear) return [];
      return rows.filter(r => r.date.startsWith(selectedYear)).sort((a, b) => a.date.localeCompare(b.date));
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
          
          <div className={`border rounded-lg px-2 flex items-center shadow-sm h-10 ${isHighContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
            <button 
              onClick={() => setUnit('mmol/L')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors ${unit === 'mmol/L' ? (isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-900') : 'text-slate-400 hover:text-slate-600'}`}
              aria-pressed={unit === 'mmol/L'}
            >
              mmol/L
            </button>
            <button 
              onClick={() => setUnit('mg/dL')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors ${unit === 'mg/dL' ? (isHighContrast ? 'bg-white text-black' : 'bg-slate-100 text-slate-900') : 'text-slate-400 hover:text-slate-600'}`}
              aria-pressed={unit === 'mg/dL'}
            >
              mg/dL
            </button>
          </div>

          <button 
            onClick={() => setIsHighContrast(!isHighContrast)} 
            className={`p-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-300 h-10 ${isHighContrast ? 'bg-gray-800 hover:bg-gray-700 text-yellow-300' : 'text-slate-400 hover:text-[#1F3864] hover:bg-slate-200'}`} 
            title="Toggle High Contrast"
            aria-pressed={isHighContrast}
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={handleExportData}
            className={`p-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-300 h-10 ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-400 hover:text-[#1F3864] hover:bg-slate-200'}`}
            title="Export data to JSON"
          >
            <Download className="w-5 h-5" />
          </button>

          <label
            className={`p-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-300 h-10 flex items-center cursor-pointer ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-400 hover:text-[#1F3864] hover:bg-slate-200'}`}
            title="Import backup"
          >
            <input
              type="file"
              accept=".json"
              className="sr-only"
              ref={importInputRef}
              onChange={handleImportData}
            />
            <Upload className="w-5 h-5" />
          </label>

          <button
            onClick={() => setIsHelpOpen(true)}
            className={`p-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-300 h-10 ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-400 hover:text-[#1F3864] hover:bg-slate-200'}`}
            title="View user guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button onClick={() => { adminLogout(); logout(); }} className={`p-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-300 h-10 ${isHighContrast ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-slate-400 hover:text-[#1F3864] hover:bg-slate-200'}`} title="Sign out">
            <LogOut className="w-5 h-5" />
          </button>

          <div className={`border rounded-lg flex items-center shadow-sm h-10 ${isHighContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
            <span className="text-[11px] font-bold text-slate-400 pl-3 pr-2 hidden sm:inline tracking-wider">PERIOD</span>

            {/* View Mode Toggle */}
            <div className={`flex border-r ${isHighContrast ? 'border-gray-700' : 'border-slate-200'}`}>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-xs font-bold uppercase transition-colors ${
                  viewMode === 'month'
                    ? isHighContrast ? 'bg-blue-900 text-white' : 'bg-blue-100 text-[#1F3864]'
                    : isHighContrast ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="View by month"
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`px-3 py-1 text-xs font-bold uppercase transition-colors ${
                  viewMode === 'year'
                    ? isHighContrast ? 'bg-blue-900 text-white' : 'bg-blue-100 text-[#1F3864]'
                    : isHighContrast ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
                }`}
                title="View by year"
              >
                Year
              </button>
            </div>

            {/* Selector based on view mode */}
            {viewMode === 'month' ? (
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className={`flex-1 text-sm px-3 py-1 bg-transparent border-none outline-none focus:ring-0 font-bold cursor-pointer ${isHighContrast ? 'text-white' : 'text-[#1F3864]'}`}
              >
                {monthOptions.map(k => {
                  const [yr, mo] = k.split('-');
                  return <option key={k} value={k} className={isHighContrast ? 'bg-gray-900 text-white' : ''}>{MONTH_NAMES[parseInt(mo) - 1]} {yr}</option>;
                })}
              </select>
            ) : (
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className={`flex-1 text-sm px-3 py-1 bg-transparent border-none outline-none focus:ring-0 font-bold cursor-pointer ${isHighContrast ? 'text-white' : 'text-[#1F3864]'}`}
              >
                {yearOptions.map(yr => (
                  <option key={yr} value={yr} className={isHighContrast ? 'bg-gray-900 text-white' : ''}>Year {yr}</option>
                ))}
              </select>
            )}
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
        <div className={`border rounded-xl p-4 flex items-center gap-4 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-[#D6E4F0] ${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'}`}>
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

        {showContactFields && (
          <div className="grid grid-cols-2 gap-3">
            <div className={`border rounded-xl p-4 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-[#D6E4F0] ${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isHighContrast ? 'text-gray-400' : 'text-slate-400'}`}>Country</p>
              <input
                value={doctorCountry}
                onChange={e => setDoctorCountry(e.target.value)}
                className={`font-semibold text-[15px] outline-none w-full bg-transparent ${isHighContrast ? 'text-white placeholder-gray-600' : 'text-slate-900 placeholder-slate-300'}`}
                placeholder="e.g. GH +233"
              />
            </div>
            <div className={`border rounded-xl p-4 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-[#D6E4F0] ${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isHighContrast ? 'text-gray-400' : 'text-slate-400'}`}>Phone</p>
              <input
                value={doctorPhone}
                onChange={e => setDoctorPhone(e.target.value)}
                className={`font-semibold text-[15px] outline-none w-full bg-transparent ${isHighContrast ? 'text-white placeholder-gray-600' : 'text-slate-900 placeholder-slate-300'}`}
                placeholder="e.g. 20 152 9933"
              />
            </div>
          </div>
        )}
        <button
          onClick={() => setShowContactFields(!showContactFields)}
          className={`text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg transition-colors ${isHighContrast ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-slate-100 text-[#2E75B6] hover:bg-slate-200'}`}
        >
          {showContactFields ? '▼ Hide' : '▶ Show'} Country & Phone
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-6 flex-grow print:block">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 print:flex print:flex-wrap">
          {/* Average Fasting */}
          <div className={`${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-sm flex flex-col justify-center print:border-slate-300 print:shadow-none`}>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Average Fasting ({unit})</p>
            <div className="flex items-end gap-3 mb-1">
              <div className={`text-4xl font-mono font-bold tabular-nums tracking-tighter ${afCls}`}>{af ? af : '—'}</div>
              {af && parseFloat(af) >= parseFloat(convertTarget(7.0, unit)) && (
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded font-bold uppercase tracking-wider mb-1.5">High</span>
              )}
            </div>
            <p className="text-[12px] font-medium text-slate-500 mt-1">Target (&lt; {convertTarget(7.0, unit)})</p>
          </div>

          {/* Average Post-Meal */}
          <div className={`${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-sm flex flex-col justify-center print:border-slate-300 print:shadow-none relative overflow-hidden`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 z-10 ${isHighContrast ? 'text-slate-400' : 'text-slate-500'}`}>Avg Post-Meal ({unit})</p>
            <div className="flex items-end gap-3 mb-1 z-10">
              <div className={`text-4xl font-mono font-bold tabular-nums tracking-tighter ${isHighContrast ? apCls : (ap && parseFloat(ap) >= parseFloat(convertTarget(8.9, unit)) ? 'text-rose-600' : 'text-slate-900')}`}>{ap ? ap : ''}</div>
              {ap && parseFloat(ap) >= parseFloat(convertTarget(8.9, unit)) && (
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded font-bold uppercase tracking-wider mb-1.5">Action</span>
              )}
            </div>
            <p className={`text-[12px] font-medium mt-1 z-10 ${isHighContrast ? 'text-slate-500' : 'text-slate-500'}`}>Target (&lt; {convertTarget(8.9, unit)})</p>
          </div>

          {/* Total Readings */}
          <div className={`${isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-sm flex items-center print:flex-1`}>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Total Readings</p>
              <div className={`text-3xl font-mono font-bold tracking-tight ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>{rows.length}</div>
            </div>
          </div>
          
          {/* Add Reading Button */}
          <div className="flex flex-col gap-3 min-h-[140px] print:hidden">
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`flex-1 rounded-2xl flex items-center justify-center p-3 transition-all duration-200 cursor-pointer shadow-sm focus:outline-none focus:ring-4 focus:ring-[#D6E4F0] border-2 border-transparent
                ${isHighContrast ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-[#1F3864] text-white hover:bg-[#2E75B6]'}`}
            >
               <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
               <span className="text-[12px] font-bold uppercase tracking-widest text-center">Manual Entry</span>
            </button>
            <label
              data-testid="scan-button"
              className={`flex-1 rounded-2xl flex items-center justify-center p-3 transition-all duration-200 cursor-pointer shadow-sm focus-within:outline-none focus-within:ring-4 focus-within:ring-[#D6E4F0] border-2
                ${isHighContrast ? 'bg-black border-gray-700 text-white hover:bg-gray-800' : 'bg-white border-[#D4A373] text-[#1F3864] hover:bg-orange-50'} ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
               <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
               {isUploading ? <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#D4A373]" /> : <Camera className="w-5 h-5 mr-2 text-[#D4A373]" strokeWidth={2.5} />}
               <span className="text-[12px] font-bold uppercase tracking-widest text-center">
                 {isUploading ? uploadStatus : 'Scan Photo'}
               </span>
            </label>
          </div>
        </div>

        {/* Clinical Analysis summary — band-coloured metric cards + range legend */}
        <ClinicalAnalysis
          avgFasting={avgFastingBase}
          avgPostMeal={avgPostBase}
          highest={highestBase}
          overall={overallBase}
          readingCount={allReadingsVals.length}
          unit={unit}
          isHighContrast={isHighContrast}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-slate-200 print:hidden mt-4">
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
                      <th className="px-4 py-3 w-28 tracking-wider">Date</th>
                      {COLS.map(col => (
                        <th key={col.id} className={`px-4 py-3 text-center whitespace-pre-line leading-tight tracking-wider ${col.id === 'pre_lunch' || col.id === 'pre_dinner' ? (isHighContrast ? 'border-l border-gray-700' : 'border-l border-slate-200') : ''}`}>
                          {col.label.replace('\n', ' ')}
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
                              <td key={col.id} className={`px-4 py-3 text-center ${col.id === 'pre_lunch' || col.id === 'pre_dinner' ? (isHighContrast ? 'border-l border-gray-800' : 'border-l border-slate-100') : ''}`}>
                                {isEmpty ? (
                                  ''
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

      <footer className={`mt-8 flex flex-wrap items-center gap-6 text-[10.5px] font-bold uppercase tracking-widest print:hidden ${isHighContrast ? 'text-gray-500' : 'text-slate-400'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-green-500' : 'bg-emerald-500 shadow-sm shadow-emerald-200'}`} aria-hidden="true"></div> Normal Range
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-sky-400' : 'bg-sky-500 shadow-sm shadow-sky-200'}`} aria-hidden="true"></div> Low Range (&lt; {convertTarget(4.0, unit)})
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isHighContrast ? 'bg-red-500' : 'bg-rose-500 shadow-sm shadow-rose-200'}`} aria-hidden="true"></div> High Target / Alert
        </div>
        <div className={`md:ml-auto italic font-medium tracking-normal ${isHighContrast ? 'text-gray-600' : 'text-slate-300'}`}>
          ROPHE SPECIALIST CARE SYSTEM &copy; {new Date().getFullYear()}
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
