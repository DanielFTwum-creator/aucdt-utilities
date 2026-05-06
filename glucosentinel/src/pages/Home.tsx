import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Settings, Plus, Save, ArrowUpRight, HeartPulse, BrainCircuit, ShieldCheck, Moon, Sun, Eye, Download, Upload, Camera, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

type Reading = {
  id: number;
  date: string;
  time_slot: string;
  value: number;
  meal_description?: string;
  medication_taken?: boolean;
  activity_logged?: boolean;
  emotional_state?: string;
  notes?: string;
};

type Pattern = {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
};

type PatientSettings = {
  name: string;
  target_fasting_min: number;
  target_fasting_max: number;
};

export default function Home() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [settings, setSettings] = useState<PatientSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for settings
  const [fastingMin, setFastingMin] = useState(4.0);
  const [fastingMax, setFastingMax] = useState(6.0);
  const { theme, toggleTheme } = useTheme();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [readingsRes, patternsRes, settingsRes] = await Promise.all([
        fetch('/api/readings'),
        fetch('/api/patterns'),
        fetch('/api/settings')
      ]);

      const readingsData = await readingsRes.json();
      const patternsData = await patternsRes.json();
      const settingsData = await settingsRes.json();

      setReadings(readingsData);
      setPatterns(patternsData);
      setSettings(settingsData);
      
      if (settingsData) {
        setFastingMin(settingsData.target_fasting_min);
        setFastingMax(settingsData.target_fasting_max);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_fasting_min: fastingMin,
          target_fasting_max: fastingMax
        })
      });

      // Log audit event
      fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'UPDATE_SETTINGS', 
          details: `Updated fasting range to ${fastingMin}-${fastingMax}`, 
          user: 'admin' 
        })
      }).catch(console.error);

      setShowSettings(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  const handleExport = () => {
    window.location.href = '/api/export';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For this demo, we'll assume JSON import for simplicity, 
    // but in a real app we'd parse CSV on client or server.
    // Here we'll just read text and send to server.
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const json = JSON.parse(evt.target?.result as string);
        await fetch('/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ readings: json })
        });
        fetchData();
        alert('Import successful');
      } catch (err) {
        alert('Failed to import: Invalid JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.type === 'meter' && data.value) {
        // Auto-populate a new reading (simplified)
        const confirm = window.confirm(`Detected Glucose Reading: ${data.value} ${data.unit}. Save this?`);
        if (confirm) {
          await fetch('/api/readings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date: format(new Date(), 'yyyy-MM-dd'),
              time_slot: 'Random',
              value: data.value,
              notes: `Scanned from image: ${data.description}`
            })
          });
          fetchData();
          setShowScanModal(false);
        }
      } else {
        alert(`Analysis Result: ${data.description}`);
      }
    } catch (error) {
      console.error(error);
      alert('Image analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#0F0C07] text-[#C8A84B] font-serif italic text-2xl">Loading System...</div>;

  // Calculate stats
  const avgGlucose = readings.length > 0 
    ? (readings.reduce((acc, curr) => acc + curr.value, 0) / readings.length).toFixed(1) 
    : '0.0';
  
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;
  const inRangeCount = readings.filter(r => r.value >= (settings?.target_fasting_min || 3.9) && r.value <= (settings?.target_fasting_max || 5.6)).length;
  const rangePercentage = readings.length > 0 ? Math.round((inRangeCount / readings.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F0C07] text-[#F2EBD9] font-serif relative overflow-hidden">
      
      {/* ... Ghost Watermark ... */}
      {/* ... Top Accent Bar ... */}

      {/* Main Container */}
      <div className="max-w-[820px] mx-auto px-6 py-12 relative z-10">
        
        {/* ... Masthead ... */}
        
        {/* ... Hero Section ... */}

        {/* Feature Band */}
        <section className="border-y border-[rgba(200,168,75,0.27)] py-6 mb-16 animate-[fadeUp_0.8s_ease-out_0.35s_forwards] opacity-0">
          <div className="grid grid-cols-4 divide-x divide-[rgba(200,168,75,0.27)]">
            
            {/* ... Existing stats ... */}
             <div className="px-4 text-center group cursor-pointer hover:bg-[#C8A84B]/5 transition-colors duration-500">
              <Activity className="w-5 h-5 text-[#C8A84B] mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase mb-1">Avg Glucose</div>
              <div className="font-display italic text-lg text-[#F2EBD9]">{avgGlucose} <span className="text-xs not-italic opacity-50">mmol/L</span></div>
            </div>

            <div className="px-4 text-center group cursor-pointer hover:bg-[#C8A84B]/5 transition-colors duration-500">
              <HeartPulse className="w-5 h-5 text-[#C8A84B] mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase mb-1">Time in Range</div>
              <div className="font-display italic text-lg text-[#F2EBD9]">{rangePercentage}% <span className="text-xs not-italic opacity-50">Target</span></div>
            </div>

            <div className="px-4 text-center group cursor-pointer hover:bg-[#C8A84B]/5 transition-colors duration-500">
              <BrainCircuit className="w-5 h-5 text-[#C8A84B] mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase mb-1">Patterns</div>
              <div className="font-display italic text-lg text-[#F2EBD9]">{patterns.length} <span className="text-xs not-italic opacity-50">Detected</span></div>
            </div>

            <div 
              className="px-4 text-center group cursor-pointer hover:bg-[#C8A84B]/5 transition-colors duration-500" 
              onClick={() => setShowSettings(true)}
              role="button"
              tabIndex={0}
              aria-label="Open configuration settings"
              onKeyDown={(e) => e.key === 'Enter' && setShowSettings(true)}
            >
              <Settings className="w-5 h-5 text-[#C8A84B] mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase mb-1">Configuration</div>
              <div className="font-display italic text-lg text-[#F2EBD9]">Edit <span className="text-xs not-italic opacity-50">Params</span></div>
            </div>

          </div>
        </section>

        {/* Data Tools Bar (New) */}
        <div className="flex justify-end gap-4 mb-8 animate-[fadeUp_0.8s_ease-out_0.4s_forwards] opacity-0">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-[rgba(200,168,75,0.3)] text-[#C8A84B] font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#C8A84B]/10 transition-colors"
          >
            <Download className="w-3 h-3" /> Export CSV
          </button>
          
          <label className="flex items-center gap-2 px-4 py-2 border border-[rgba(200,168,75,0.3)] text-[#C8A84B] font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#C8A84B]/10 transition-colors cursor-pointer">
            <Upload className="w-3 h-3" /> Import JSON
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button 
            onClick={() => setShowScanModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8A84B] text-[#0F0C07] font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#E8C96A] font-bold transition-colors"
          >
            <Camera className="w-3 h-3" /> Scan Reading
          </button>
        </div>

        {/* ... Main Content Grid ... */}
        <div className="grid grid-cols-[1fr_240px] gap-12 animate-[fadeUp_0.8s_ease-out_0.4s_forwards] opacity-0">
          {/* ... Left Column ... */}
          <div className="space-y-12">
             {/* ... Chart ... */}
             <article>
              <div className="flex items-baseline gap-3 mb-6 border-l-2 border-[#C8A84B] pl-4">
                <span className="font-sans text-4xl font-bold text-[#C8A84B] opacity-40">01</span>
                <div>
                  <h3 className="font-display font-bold text-2xl uppercase tracking-wide text-[#F2EBD9]">Glycemic Trends</h3>
                  <p className="font-body italic text-lg text-[#C8A84B] opacity-80">Visualizing metabolic stability over time.</p>
                </div>
              </div>

              <div className="h-[300px] w-full bg-[#0F0C07] border border-[rgba(200,168,75,0.1)] p-4 relative">
                {/* Chart Background Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(200,168,75,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,168,75,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,168,75,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(str) => format(new Date(str), 'MMM d')}
                      stroke="rgba(242, 235, 217, 0.3)"
                      tick={{fontSize: 10, fontFamily: 'DM Sans'}}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="rgba(242, 235, 217, 0.3)" 
                      tick={{fontSize: 10, fontFamily: 'DM Sans'}} 
                      domain={[0, 15]} 
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#0F0C07', 
                        border: '1px solid #C8A84B', 
                        borderRadius: '0px',
                        fontFamily: 'DM Sans',
                        color: '#F2EBD9'
                      }}
                      itemStyle={{color: '#C8A84B'}}
                      labelStyle={{color: '#F2EBD9', fontFamily: 'Bebas Neue', letterSpacing: '1px'}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#C8A84B" 
                      strokeWidth={1.5} 
                      dot={{r: 3, fill: '#0F0C07', stroke: '#C8A84B', strokeWidth: 1.5}} 
                      activeDot={{r: 5, fill: '#C8A84B'}} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Readings List */}
            <article>
              <div className="flex items-baseline gap-3 mb-6 border-l-2 border-[#C8A84B] pl-4">
                <span className="font-sans text-4xl font-bold text-[#C8A84B] opacity-40">02</span>
                <div>
                  <h3 className="font-display font-bold text-2xl uppercase tracking-wide text-[#F2EBD9]">Data Log</h3>
                  <p className="font-body italic text-lg text-[#C8A84B] opacity-80">Chronological record of measurements.</p>
                </div>
              </div>

              <div className="space-y-0 border-t border-[rgba(200,168,75,0.27)]">
                {readings.slice(-5).reverse().map((reading) => (
                  <div key={reading.id} className="group py-4 border-b border-[rgba(200,168,75,0.1)] flex items-center justify-between hover:bg-[#C8A84B]/5 transition-colors duration-300 px-2 cursor-pointer">
                    <div>
                      <div className="font-sans text-[10px] tracking-[0.2em] text-[#C8A84B] uppercase mb-1 opacity-70">
                        {format(new Date(reading.date), 'MMMM d, yyyy')}
                      </div>
                      <div className="font-display text-xl text-[#F2EBD9] group-hover:text-[#C8A84B] transition-colors">
                        {reading.time_slot}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={clsx(
                        "font-sans text-3xl font-bold tracking-tighter",
                        reading.value > (settings?.target_fasting_max || 5.6) ? "text-red-400" : 
                        reading.value < (settings?.target_fasting_min || 3.9) ? "text-amber-400" : "text-[#C8A84B]"
                      )}>
                        {reading.value.toFixed(1)}
                      </div>
                      <div className="font-sans text-[9px] tracking-[0.1em] text-[#F2EBD9] opacity-40 uppercase">mmol/L</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="w-full mt-6 py-4 border border-[#C8A84B] text-[#C8A84B] font-sans text-xs tracking-[0.3em] uppercase hover:bg-[#C8A84B] hover:text-[#0F0C07] transition-all duration-300 flex items-center justify-center gap-2 group"
                aria-label="Record new glucose entry"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Record New Entry
              </button>
            </article>
          </div>

          {/* ... Right Column ... */}
          <aside className="space-y-12 pt-2">
            
            {/* Pull Quote */}
            <div className="relative">
              <span className="absolute -top-6 -left-4 font-display text-8xl text-[#C8A84B] opacity-20">“</span>
              <p className="font-body italic text-xl leading-relaxed text-[#F2EBD9] opacity-90 relative z-10">
                Design is not just what it looks like and feels like. Design is how it works.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-[1px] w-8 bg-[#C8A84B] opacity-50"></div>
                <span className="font-sans text-[10px] tracking-[0.2em] text-[#C8A84B] uppercase">Steve Jobs</span>
              </div>
            </div>

            {/* Pattern Analysis Box */}
            <div className="bg-[#15120D] border border-[rgba(200,168,75,0.2)] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#C8A84B] opacity-5 rounded-bl-full"></div>
              
              <h4 className="font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase mb-4 border-b border-[rgba(200,168,75,0.2)] pb-2">
                Clinical Insights
              </h4>

              {patterns.length > 0 ? (
                <ul className="space-y-4">
                  {patterns.map((p, i) => (
                    <li key={i}>
                      <div className="font-display font-bold text-[#F2EBD9] text-lg leading-tight mb-1">{p.type}</div>
                      <p className="font-body italic text-sm text-[#C8A84B] opacity-80 leading-snug">{p.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-body italic text-sm text-[#F2EBD9] opacity-50">No significant patterns detected in the current dataset.</p>
              )}

              <div className="mt-6 pt-4 border-t border-[rgba(200,168,75,0.1)]">
                <Link to="/admin" className="flex items-center gap-2 font-sans text-[10px] tracking-[0.2em] text-[#C8A84B] uppercase hover:text-white transition-colors">
                  System Diagnostics <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Stat Box */}
            <div className="text-center border border-[rgba(200,168,75,0.2)] p-6">
              <div className="font-sans text-[10px] tracking-[0.2em] text-[#F2EBD9] opacity-50 uppercase mb-2">Active Streak</div>
              <div className="font-label text-6xl text-[#C8A84B]">12</div>
              <div className="font-body italic text-sm text-[#C8A84B] opacity-80 mt-1">Consecutive Days</div>
            </div>

          </aside>
        </div>

        {/* ... Footer ... */}
        <footer className="mt-24 border-t border-[rgba(200,168,75,0.27)] pt-6 flex justify-between items-center animate-[fadeUp_0.8s_ease-out_0.6s_forwards] opacity-0">
          <div className="font-body italic text-[#F2EBD9] opacity-60">
            "Design and Build a Nation"
          </div>
          <div className="flex items-center gap-6">
            <span className="font-sans text-[10px] tracking-[0.2em] text-[#C8A84B] uppercase opacity-50">© 2026 TechBridge</span>
            <span className="font-sans text-[10px] tracking-[0.2em] text-[#C8A84B] uppercase opacity-50">Credit: Dr. Yacoba Atiase</span>
            <span className="font-sans text-[10px] tracking-[0.2em] text-[#C8A84B] uppercase opacity-50">Privacy Protocol</span>
          </div>
        </footer>

      </div>

      {/* ... Bottom Bar ... */}
      <div className="h-1 w-full bg-[#C8A84B] fixed bottom-0 left-0 z-50"></div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-[#0F0C07]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-[#15120D] border border-[#C8A84B] max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowSettings(false)} 
              className="absolute top-4 right-4 text-[#C8A84B] hover:text-white"
              aria-label="Close settings modal"
            >
              ✕
            </button>
            
            <h2 id="modal-title" className="font-display font-black text-3xl text-[#F2EBD9] uppercase mb-2">Configuration</h2>
            <p className="font-body italic text-[#C8A84B] mb-8">Adjust clinical parameters.</p>
            
            <form onSubmit={saveSettings} className="space-y-6">
              <div>
                <label className="block font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase mb-2">Target Fasting Range (mmol/L)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    step="0.1" 
                    value={fastingMin} 
                    onChange={e => setFastingMin(parseFloat(e.target.value))}
                    className="w-full bg-[#0F0C07] border border-[rgba(200,168,75,0.3)] text-[#F2EBD9] p-3 font-mono focus:border-[#C8A84B] outline-none"
                  />
                  <span className="text-[#C8A84B] opacity-50">–</span>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={fastingMax} 
                    onChange={e => setFastingMax(parseFloat(e.target.value))}
                    className="w-full bg-[#0F0C07] border border-[rgba(200,168,75,0.3)] text-[#F2EBD9] p-3 font-mono focus:border-[#C8A84B] outline-none"
                  />
                </div>
                <p className="font-sans text-[10px] tracking-[0.1em] text-[#C8A84B] opacity-60 mt-2 uppercase">Target Range: 4.0 – 6.0 mmol/L</p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 border border-[rgba(200,168,75,0.3)] text-[#C8A84B] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#C8A84B]/10"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#C8A84B] text-[#0F0C07] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#E8C96A] font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-[#0F0C07]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4" role="dialog" aria-modal="true" aria-labelledby="scan-title">
          <div className="bg-[#15120D] border border-[#C8A84B] max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowScanModal(false)} 
              className="absolute top-4 right-4 text-[#C8A84B] hover:text-white"
              aria-label="Close scan modal"
            >
              ✕
            </button>
            
            <h2 id="scan-title" className="font-display font-black text-3xl text-[#F2EBD9] uppercase mb-2">Scan Reading</h2>
            <p className="font-body italic text-[#C8A84B] mb-8">Upload an image of your glucose meter.</p>
            
            <div className="space-y-6">
              <label className="block w-full border-2 border-dashed border-[#C8A84B]/30 rounded-lg p-12 text-center cursor-pointer hover:border-[#C8A84B] hover:bg-[#C8A84B]/5 transition-all">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-[#C8A84B] animate-spin" />
                    <span className="font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase">Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Camera className="w-8 h-8 text-[#C8A84B]" />
                    <span className="font-sans text-xs tracking-[0.2em] text-[#C8A84B] uppercase">Click to Upload</span>
                  </div>
                )}
              </label>
              
              <p className="text-center font-body italic text-xs text-[#F2EBD9] opacity-50">
                AI analysis powered by Google Gemini.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
