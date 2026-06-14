import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, Clock, ShieldAlert, Terminal, Settings as SettingsIcon,
  FileText, SlidersHorizontal, Search, Database, Cpu, Layers, Wifi, Globe, RefreshCw,
  Copy, Check, Plus, Trash2, Eye, Sparkles, X, ChevronRight, Play, AlertCircle, Shield, Bookmark, Menu
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';

import { DeviceStatus, Device, BandwidthInterface, BandwidthSample, Alert, AuditLog, WebhookLog } from './server/api.ts';

type ActiveTab = 'overview' | 'devices' | 'bandwidth' | 'ports' | 'alerts' | 'control' | 'reports' | 'cli' | 'settings';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showConfirmBlock, setShowConfirmBlock] = useState<string | null>(null); // MAC Address
  const [blockReason, setBlockReason] = useState('');
  const [ackAlertId, setAckAlertId] = useState<number | null>(null);
  const [ackNote, setAckNote] = useState('');
  
  // Data State populated from Back-end REST Mock Server
  const [devicesState, setDevicesState] = useState<Device[]>([]);
  const [interfacesState, setInterfacesState] = useState<BandwidthInterface[]>([]);
  const [historyState, setHistoryState] = useState<BandwidthSample[]>([]);
  const [alertsState, setAlertsState] = useState<Alert[]>([]);
  const [auditsState, setAuditsState] = useState<AuditLog[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [healthState, setHealthState] = useState<any>(null);
  const [topology, setTopology] = useState<any>(null);
  
  // Interactive UI helpers
  const [searchValue, setSearchValue] = useState('');
  const [selectStatusFilter, setSelectStatusFilter] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultDesc, setScanResultDesc] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  
  // CLI Shell terminal emulator state
  const [cliCommand, setCliCommand] = useState('');
  const [cliLogs, setCliLogs] = useState<Array<{ cmd: string; time: string; output: string; err?: boolean }>>([
    { cmd: 'help', time: new Date().toLocaleTimeString(), output: 'TUC NetScan CLI Module loaded. Type "help" to list administrative tasks.' }
  ]);
  const cliScrollRef = useRef<HTMLDivElement>(null);
  
  // Settings Inputs Local state
  const [subnetConfig, setSubnetConfig] = useState('10.10.10.0/24, 10.10.20.0/24, 10.10.30.0/24, 10.10.40.0/24');
  const [webhookUrl, setWebhookUrl] = useState('https://techbridge.edu.gh/webhooks/netscan-alerts');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [scanInterval, setScanInterval] = useState(60);

  // Poll server data at regular intervals
  useEffect(() => {
    fetchBackendData();
    loadSettings();
    const interval = setInterval(fetchBackendData, 6000); // 6 sec refresh for live metrics feel
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cliScrollRef.current) {
      cliScrollRef.current.scrollTop = cliScrollRef.current.scrollHeight;
    }
  }, [cliLogs]);

  const fetchBackendData = async () => {
    try {
      const [devsRes, intsRes, alertsRes, auditsRes, healthRes] = await Promise.all([
        fetch('api/v1/devices'),
        fetch('api/v1/bandwidth/interfaces'),
        fetch('api/v1/alerts'),
        fetch('api/v1/audit'),
        fetch('api/v1/health')
      ]);

      if (devsRes.ok) {
        const devs = await devsRes.json();
        setDevicesState(devs);
        // Refresh selected device state if sidebar open
        if (selectedDevice) {
          const fresh = devs.find((d: Device) => d.id === selectedDevice.id);
          if (fresh) setSelectedDevice(fresh);
        }
      }
      if (intsRes.ok) setInterfacesState(await intsRes.json());
      if (alertsRes.ok) setAlertsState(await alertsRes.json());
      if (auditsRes.ok) setAuditsState(await auditsRes.json());
      if (healthRes.ok) setHealthState(await healthRes.json());

      // Fetch history for bandwidth charts
      const histRes = await fetch('api/v1/bandwidth/history?hours=6');
      if (histRes.ok) setHistoryState(await histRes.json());

      // Fetch inferred network topology
      const topoRes = await fetch('api/v1/topology');
      if (topoRes.ok) setTopology(await topoRes.json());
    } catch (e) {
      console.error('Error fetching REST APIs:', e);
    }
  };

  // Load settings from backend on mount
  const loadSettings = async () => {
    try {
      const res = await fetch('api/v1/settings');
      if (res.ok) {
        const s = await res.json();
        if (s.configured_cidrs !== undefined) setSubnetConfig(s.configured_cidrs);
        if (s.webhook_url !== undefined) setWebhookUrl(s.webhook_url);
        if (s.alert_threshold_capacity_pct !== undefined) setAlertThreshold(s.alert_threshold_capacity_pct);
        if (s.scan_interval_seconds !== undefined) setScanInterval(s.scan_interval_seconds);
      }
    } catch (e) {
      console.error('Could not load settings:', e);
    }
  };

  // Persist settings to backend
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configured_cidrs: subnetConfig,
          webhook_url: webhookUrl,
          alert_threshold_capacity_pct: alertThreshold,
          scan_interval_seconds: scanInterval,
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('Global configurations saved. Scan engine will use the new CIDR ranges on next sweep.');
      } else {
        showNotification(`Error: ${data.message || 'Could not save settings.'}`);
      }
    } catch (e) {
      showNotification('Error connecting to settings endpoint.');
    }
  };

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // REST API: Trigger Active Subnet Scan
  const handleTriggerScan = async (subnet?: string) => {
    setIsScanning(true);
    setScanResultDesc('Executing network active sweeping sequence securely via SNMP and ARP queries...');
    try {
      const response = await fetch('api/v1/scan/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subnet: subnet || 'ALL SUBNETS' })
      });
      const data = await response.json();
      setIsScanning(false);
      setScanResultDesc(null);
      if (data.success) {
        showNotification(data.message);
        fetchBackendData();
      }
    } catch (e) {
      setIsScanning(false);
      setScanResultDesc('Error triggering scan probe sequence.');
    }
  };

  // REST API: MANUALLY ANNOTATE DEVICE
  const handleSaveAnnotation = async (deviceId: number, label: string) => {
    try {
      const res = await fetch(`api/v1/devices/${deviceId}/annotate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_label: label })
      });
      if (res.ok) {
        showNotification('Device annotation labels updated.');
        fetchBackendData();
      }
    } catch (e) {
      showNotification('Error updating text labels.');
    }
  };

  // REST API: EXECUTE ACTION BLOCK
  const handleConfirmBlock = async () => {
    if (!showConfirmBlock) return;
    if (!blockReason.trim()) {
      alert('A mandatory free-text reason field is required before a block action is implemented.');
      return;
    }

    try {
      const res = await fetch('api/v1/control/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mac_address: showConfirmBlock, reason: blockReason })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Device marked BLOCKED successfully. Firewall rules distributed.`);
        setShowConfirmBlock(null);
        setBlockReason('');
        fetchBackendData();
        // If selected device is this, update local sidebar view
        if (selectedDevice && selectedDevice.mac_address === showConfirmBlock) {
          setSelectedDevice(data.blocked_device);
        }
      }
    } catch (e) {
      showNotification('Could not apply block rule.');
    }
  };

  // REST API: DELETE REMOVE BLOCK
  const handleRemoveBlock = async (mac: string) => {
    try {
      const res = await fetch(`api/v1/control/block/${mac}?reason=Administrative%20Manual%20Unblock`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification(`Drop rules matching ${mac} retracted from edge gateways.`);
        fetchBackendData();
      }
    } catch (e) {
      showNotification('Error releasing block list.');
    }
  };

  // REST API: ADD TO AUTHORISED DEVICE REGISTRY (WHITELIST)
  const handleWhitelistDevice = async (mac: string, label: string) => {
    try {
      const res = await fetch('api/v1/control/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mac_address: mac, label })
      });
      if (res.ok) {
        showNotification('MAC successfully registered in the Authorised Device Registry (ADR).');
        fetchBackendData();
      }
    } catch (e) {
      showNotification('Error saving whitelist record.');
    }
  };

  // REST API: ACKNOWLEDGE ALERT
  const handleAckAlert = async () => {
    if (!ackAlertId) return;
    if (!ackNote.trim()) {
      alert('A note explaining audit resolution is mandatory to acknowledge alerts.');
      return;
    }

    try {
      const res = await fetch(`api/v1/alerts/${ackAlertId}/ack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: ackNote })
      });
      if (res.ok) {
        showNotification(`Alert ID ${ackAlertId} acknowledged successfully.`);
        setAckAlertId(null);
        setAckNote('');
        fetchBackendData();
      }
    } catch (e) {
      showNotification('Could not save alert acknowledgment.');
    }
  };

  // REST API: RUN SERVICE LEVEL GEMINI DIAGNOSES
  const handleGetAICopilotReport = async (topic: string, contextObj: any) => {
    setAiLoading(true);
    setAiAnalysisResult(null);
    try {
      const res = await fetch('api/v1/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, context: contextObj })
      });
      const data = await res.json();
      setAiLoading(false);
      if (res.ok) {
        setAiAnalysisResult(data.explanation);
      } else {
        setAiAnalysisResult('Failed to contact Gemini AI Service.');
      }
    } catch (err) {
      setAiLoading(false);
      setAiAnalysisResult('Connection timeout while summoning AI Labs Advisor.');
    }
  };

  // REST API: TRIGGER CLI COMMAND EXEC_LOCAL
  const handleExecuteCLI = async (e: React.FormEvent) => {
    e.preventDefault();
    const commandText = cliCommand.trim();
    if (!commandText) return;

    setCliLogs(prev => [...prev, { cmd: commandText, time: new Date().toLocaleTimeString(), output: 'Connecting to TUC system core...' }]);
    setCliCommand('');

    try {
      const res = await fetch('api/v1/cli/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandText, apiKey: 'NETSCAN_ADMIN_TOKEN_2026' })
      });
      const data = await res.json();
      
      setCliLogs(prev => {
        const last = [...prev];
        if (last.length > 0) {
          last[last.length - 1] = {
            cmd: commandText,
            time: new Date().toLocaleTimeString(),
            output: data.output || JSON.stringify(data.raw_payload, null, 2),
            err: !data.success
          };
        }
        return last;
      });
    } catch (err) {
      setCliLogs(prev => {
        const last = [...prev];
        if (last.length > 0) {
          last[last.length - 1] = { cmd: commandText, time: new Date().toLocaleTimeString(), output: 'Error: Connection lost with netscan CLI demon.', err: true };
        }
        return last;
      });
    }
  };

  // UTILITY: GENERATE PDF REPORT COMPILATION CLIENT-SIDE
  const triggerDownloadReport = async (format: 'pdf' | 'csv') => {
    try {
      const res = await fetch(`api/v1/reports/generate?format=${format}`);
      const data = await res.json();
      if (res.ok) {
        // Create an export file link safely
        const fileContent = format === 'csv' 
          ? `TUC Campus NetScan Device Inventory\nExport Date: ${data.data.timestamp}\nGenerated by: ${data.data.author}\n\nIP Address,MAC Address,Hostname,Manufacturer,Label,Status,ADR Whitelisted\n` + 
            devicesState.map(d => `"${d.ip_address}","${d.mac_address}","${d.hostname || ''}","${d.manufacturer || ''}","${d.custom_label || ''}","${d.status}","${d.in_adr}"`).join('\n')
          : JSON.stringify(data.data, null, 2);

        const blob = new Blob([fileContent], { type: format === 'csv' ? 'text/csv' : 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('id', `dl-link-${format}`);
        a.href = url;
        a.download = data.report_filename;
        a.click();
        showNotification(`Report sheet compiled: ${data.report_filename} downloaded.`);
      }
    } catch (e) {
      showNotification('Error compiling export sheet.');
    }
  };

  // Helper code copying
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 3000);
  };

  // Status Color Mapping
  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <span id="badge-active" className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">ACTIVE</span>;
      case 'ROGUE':
        return <span id="badge-rogue" className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300 animate-pulse">ROGUE</span>;
      case 'BLOCKED':
        return <span id="badge-blocked" className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300">BLOCKED</span>;
      case 'INACTIVE':
        return <span id="badge-inactive" className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-300">INACTIVE</span>;
    }
  };

  // Topology helpers
  const topoIcon = (t: string) => {
    if (/Router|Gateway/.test(t)) return '🌐';
    if (/Extender/.test(t)) return '📶';
    if (/Camera/.test(t)) return '📷';
    if (/Speaker|TV/.test(t)) return '🔊';
    if (/Console/.test(t)) return '🎮';
    if (/Printer/.test(t)) return '🖨️';
    if (/Phone/.test(t)) return '📱';
    if (/Windows/.test(t)) return '🖥️';
    if (/Apple/.test(t)) return '💻';
    if (/Linux/.test(t)) return '🐧';
    if (/Raspberry/.test(t)) return '🍓';
    return '🔌';
  };

  const selectByIp = (ip: string) => {
    const dev = devicesState.find(d => d.ip_address === ip);
    if (dev) setSelectedDevice(dev);
  };

  const renderTopoRow = (node: any) => (
    <button
      type="button"
      key={node.ip}
      title={`${node.ip} — ${node.type}`}
      onClick={() => selectByIp(node.ip)}
      className="flex items-center gap-2 text-left w-full hover:bg-slate-100 rounded px-1.5 py-1 transition-colors"
    >
      <span className="text-base leading-none">{topoIcon(node.type)}</span>
      <span className="font-mono font-bold text-[#1B3A6B]">{node.ip}</span>
      <span className="text-[10px] text-slate-500 truncate">
        {node.type}{node.vendor && !String(node.vendor).startsWith('Unknown') ? ` · ${node.vendor}` : ''}
      </span>
      {node.risky && <span className="text-[9px] bg-red-600 text-white px-1 rounded font-bold">RISK</span>}
      <span className={`ml-auto w-2 h-2 rounded-full flex-shrink-0 ${node.status === 'ACTIVE' ? 'bg-emerald-500' : node.status === 'BLOCKED' ? 'bg-amber-500' : 'bg-slate-300'}`}></span>
    </button>
  );

  // Filter logic
  const filteredDevices = devicesState.filter(d => {
    const sMatch = selectStatusFilter === 'ALL' || d.status === selectStatusFilter;
    const qMatch = searchValue === '' || 
      d.ip_address.toLowerCase().includes(searchValue.toLowerCase()) ||
      d.mac_address.toLowerCase().includes(searchValue.toLowerCase()) ||
      (d.hostname && d.hostname.toLowerCase().includes(searchValue.toLowerCase())) ||
      (d.manufacturer && d.manufacturer.toLowerCase().includes(searchValue.toLowerCase())) ||
      (d.custom_label && d.custom_label.toLowerCase().includes(searchValue.toLowerCase()));
    return sMatch && qMatch;
  });

  // Calculate high priority numbers
  const totalRogue = devicesState.filter(d => d.status === 'ROGUE').length;
  const activeAlerts = alertsState.filter(a => a.status === 'ACTIVE').length;
  const networkLoadAvg = interfacesState.reduce((acc, curr) => acc + curr.utilisation_pct, 0) / (interfacesState.length || 1);
  const activeHosts = devicesState.filter(d => d.status === 'ACTIVE').length;
  const exposedHosts = devicesState.filter(d => d.status === 'ACTIVE' && d.ports.some(p => p.risk)).length;

  return (
    <div id="netscan-root" className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800 font-sans antialiased">
      
      {/* ACTION MESSAGES BANNER */}
      {actionMessage && (
        <div id="top-banner-notification" className="bg-[#1B3A6B] text-[#C8920A] text-center px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 border-b border-[#C8920A]/30 transition-all duration-300 shadow">
          <BookMarkedIcon className="w-4 h-4 animate-bounce" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* PERSISTENT WEB HEADER */}
      <header id="main-header" className="bg-[#1B3A6B] text-white border-b-2 border-[#C8920A] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-md z-30">
        <div id="header-brand-box" className="flex items-center gap-3">
          <button
            id="mobile-nav-toggle"
            className="md:hidden p-2 min-h-[44px] flex items-center justify-center rounded hover:bg-white/10 text-white -ml-1"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div id="brand-logo" className="w-10 h-10 rounded bg-[#C8920A] flex items-center justify-center shadow-inner">
            <Activity className="w-6 h-6 text-[#1B3A6B]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              TECHBRIDGE UNIVERSITY COLLEGE <span className="text-[#C8920A] text-xs px-2 py-0.5 rounded bg-white/10 font-mono">NetScan</span>
            </h1>
            <p className="text-[11px] text-[#F8FAFC]/75 font-medium">TUC NetScan — Campus Network Scanner &amp; Monitor | Office of ICT &amp; Innovation</p>
          </div>
        </div>

        {/* Live gateway vitals indicator banner */}
        <div id="header-stats-panel" className="flex items-center gap-4 flex-wrap">
          <div id="vital-card-1" className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2 text-xs">
            <Database className="w-3.5 h-3.5 text-[#C8920A]" />
            <div>
              <div className="font-semibold text-slate-300">Discovered</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">{devicesState.length} hosts</div>
            </div>
          </div>

          <div id="vital-card-2" className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2 text-xs">
            <Wifi className="w-3.5 h-3.5 text-[#C8920A]" />
            <div>
              <div className="font-semibold text-slate-300">Active Now</div>
              <div className="text-emerald-400 font-bold">{activeHosts} online</div>
            </div>
          </div>

          <div id="vital-card-3" className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <div>
              <div className="font-semibold text-slate-300">Exposed Services</div>
              <div className={exposedHosts > 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{exposedHosts} flagged</div>
            </div>
          </div>
        </div>
      </header>

      {/* CORE ALERTS OVERLAY STRIP (FLAGGING URGENT WARNINGS) */}
      {alertsState.filter(a => a.status === 'ACTIVE').length > 0 && (
        <div id="active-alert-ticker" className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center justify-between text-xs text-red-900 gap-4">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse flex-shrink-0" />
            <span><strong>CRITICAL NOTIFICATION:</strong> {alertsState.find(a => a.status === 'ACTIVE')?.message}</span>
          </div>
          <button 
            id="ticker-btn-quick-ack"
            onClick={() => {
              const firstAlert = alertsState.find(a => a.status === 'ACTIVE');
              if (firstAlert) {
                setAckAlertId(firstAlert.id);
                setAckNote('Swift resolution compiled via core administrator ticker interface.');
              }
            }}
            className="flex-shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 min-h-[44px] rounded transition-colors"
          >
            Acknowledge Now
          </button>
        </div>
      )}

      {/* SYSTEM OPERATIONS WORKSPACE */}
      <div id="workspace-container" className="flex-1 flex flex-col md:flex-row relative">

        {/* Mobile backdrop — dismiss sidebar on tap-outside */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* SIDEBAR NAVIGATION LAYER */}
        <aside id="left-sidebar" className={`bg-[#1B3A6B] text-slate-100 flex-shrink-0 transition-all duration-300 border-r border-[#C8920A]/20 ${sidebarOpen ? 'w-64 fixed md:relative inset-y-0 left-0 h-full md:h-auto z-40 md:z-auto shadow-xl md:shadow-none' : 'w-0 overflow-hidden md:w-16'}`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            {sidebarOpen && <span id="nav-header" className="text-xs uppercase tracking-widest font-bold text-[#C8920A]">OPERATIONS DIRECTORY</span>}
            <button
              id="sidebar-toggle-btn"
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 min-h-[44px] flex items-center justify-center rounded hover:bg-white/10 text-[#C8920A] mx-auto"
              title="Toggle sidebar size"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          <nav id="sidebar-nav" className="mt-2 space-y-1 px-2">
            {[
              { id: 'overview', label: 'Network Vitals', icon: Activity },
              { id: 'devices', label: 'Device Inventory', icon: Layers },
              { id: 'bandwidth', label: 'Bandwidth & Traffic', icon: Wifi },
              { id: 'ports', label: 'Port Discovery', icon: Cpu },
              { id: 'alerts', label: 'Alerts Manager', icon: AlertTriangle, badge: activeAlerts },
              { id: 'control', label: 'Firewall & Blocks', icon: Shield },
              { id: 'reports', label: 'Operational Reports', icon: FileText },
              { id: 'cli', label: 'Admin CLI Command', icon: Terminal },
              { id: 'settings', label: 'Global Configurations', icon: SettingsIcon }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  id={`nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setAiAnalysisResult(null); // Reset AI panel
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-all duration-150 ${
                    isSelected 
                      ? 'bg-[#C8920A] text-[#1B3A6B] font-bold shadow' 
                      : 'text-slate-200 hover:bg-white/5 hover:text-[#C8920A]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {sidebarOpen && item.badge && item.badge > 0 ? (
                    <span id={`nav-badge-${item.id}`} className="ml-auto bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {sidebarOpen && (
            <div id="nav-footer-box" className="absolute bottom-4 left-4 right-4 bg-white/5 p-3 rounded border border-white/5 text-[11px] text-slate-300">
              <div className="font-semibold text-white">TUC AI NetScan Hub</div>
              <div className="mt-1">Version 1.0.0 (DRAFT)</div>
              <div>Author: D. Frempong Twum</div>
            </div>
          )}
        </aside>

        {/* PRIMARY MAIN LAYOUT DOCK */}
        <main id="main-content-area" className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">

          {/* ACTIVE TAB ACTION CONTAINER */}
          {activeTab === 'overview' && (
            <div id="tab-overview" className="space-y-6 animate-fadeIn">
              
              {/* TOP HEADER SUMMARY BAR WITH TRIGGER SCAN */}
              <div id="overview-welcome" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A6B]">Network Diagnostic Vitals</h2>
                  <p className="text-xs text-slate-500 mt-1">Real-time status view of Techbridge University College Oyibi LAN. Real-time background SNMP switch metrics synchronized.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    id="trigger-btn-scan-all"
                    onClick={() => handleTriggerScan()}
                    disabled={isScanning}
                    className="bg-[#1B3A6B] hover:bg-[#1B3A6B]/90 text-white font-bold text-xs px-4 py-2.5 min-h-[44px] rounded-lg inline-flex items-center gap-2 shadow transition-all duration-150 disabled:opacity-55"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Scanning Subnets...' : 'Trigger Active Scan'}
                  </button>
                  <button 
                    id="trigger-btn-ai-overall"
                    onClick={() => handleGetAICopilotReport('overall_network', {})}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 min-h-[44px] rounded-lg inline-flex items-center gap-1.5 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Simulate AI Assessment
                  </button>
                </div>
              </div>

              {scanResultDesc && (
                <div id="scanner-progress-strip" className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center gap-3 text-xs text-amber-900 animate-pulse">
                  <Cpu className="w-5 h-5 text-[#C8920A] animate-spin" />
                  <div>
                    <span className="font-bold">Scanner active:</span> {scanResultDesc}
                  </div>
                </div>
              )}

              {/* BENTO STATS CARDS */}
              <div id="bento-stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div id="ov-card-1" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-10"><Layers className="w-12 h-12 text-[#1B3A6B]" /></div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Device Inventory</div>
                  <div className="text-3xl font-bold text-[#1B3A6B] mt-2">{devicesState.length} Discovered</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {devicesState.filter(d => d.status === 'ACTIVE').length} Active, {devicesState.filter(d => d.status === 'ROGUE').length} Rogue Node
                  </div>
                </div>

                <div id="ov-card-2" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-10"><Wifi className="w-12 h-12 text-[#C8920A]" /></div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Average Link Load</div>
                  <div className="text-3xl font-bold text-[#1B3A6B] mt-2">{networkLoadAvg.toFixed(1)}%</div>
                  <div className="text-[11px] text-slate-400 mt-1">Across 4 monitored managed switch interfaces</div>
                </div>

                <div id="ov-card-3" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-15"><AlertTriangle className="w-12 h-12 text-red-600" /></div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Unacknowledged Alerts</div>
                  <div className="text-3xl font-bold text-red-600 mt-2">{activeAlerts} Active</div>
                  <div className="text-[11px] text-slate-400 mt-1">Acknowals mandatory under ICT standards</div>
                </div>

                <div id="ov-card-4" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-10"><Clock className="w-12 h-12 text-teal-600" /></div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Network Health Index</div>
                  <div className="text-3xl font-bold text-teal-600 mt-2">88 / 100</div>
                  <div className="text-[11px] text-teal-700 font-semibold mt-1">GOOD (No DNS or severe packet drops)</div>
                </div>
              </div>

              {/* INTERACTION ROW: GRAPH + ROGUE ALERTS */}
              <div id="ov-graph-panels" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* BANDWIDTH GRAPH PREVIEW */}
                <div id="ov-graph-box" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#1B3A6B]">Uplink Interface Usage Vitals</h3>
                    <span className="text-xs text-slate-500">Live 6-hour rolling average (sampled every 12 sec)</span>
                  </div>
                  
                  <div className="h-64 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyState.filter(h => h.interface_id === 3)}>
                        <defs>
                          <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1B3A6B" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#1B3A6B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="sampled_at" 
                          tickFormatter={(t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          tick={{ fontSize: 10 }}
                          stroke="#94a3b8"
                        />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" unit="%" />
                        <Tooltip 
                          labelFormatter={(l) => `Sampled time: ${new Date(l).toLocaleTimeString('en-GB')}`}
                          formatter={(v) => [`${v}% Utilization`, 'Student Router Uplink']}
                        />
                        <Area type="monotone" dataKey="utilisation_pct" stroke="#1B3A6B" strokeWidth={2} fillOpacity={1} fill="url(#colorUtil)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div id="ov-quick-remedies" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#1B3A6B] flex items-center gap-1.5 border-b border-slate-100 pb-3">
                      <ShieldAlert className="w-5 h-5 text-[#C8920A]" />
                      Urgent Action Required
                    </h3>
                    <div className="mt-3 space-y-4 max-h-[220px] overflow-y-auto pr-1">
                      {devicesState.filter(d => d.status === 'ROGUE').map(rog => (
                        <div key={rog.id} className="bg-red-50 p-2.5 rounded border border-red-100 flex flex-col gap-2 text-xs text-red-900">
                          <div>
                            <span className="font-bold text-red-800">Rogue Node Detected</span>
                            <div className="mt-0.5 text-[11px] font-mono">{rog.ip_address} | {rog.mac_address}</div>
                            <div className="text-[10px] text-slate-500 italic mt-0.5">Identified manufacturer: {rog.manufacturer || 'Unknown'}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              id={`quick-block-${rog.id}`}
                              onClick={() => {
                                setShowConfirmBlock(rog.mac_address);
                                setBlockReason('Rogue student access point causing local gateway routing loops.');
                              }}
                              className="bg-red-700 hover:bg-red-800 text-white font-bold px-2.5 py-1 min-h-[44px] rounded text-[10px]"
                            >
                              Block Node
                            </button>
                            <button
                              id={`quick-auth-${rog.id}`}
                              onClick={() => handleWhitelistDevice(rog.mac_address, 'Authorized Classroom Client')}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-2.5 py-1 min-h-[44px] rounded text-[10px]"
                            >
                              Authorise Device
                            </button>
                          </div>
                        </div>
                      ))}
                      {devicesState.filter(d => d.status === 'ROGUE').length === 0 && (
                        <div className="text-center py-6 text-slate-400">
                          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
                          <p className="mt-2 text-xs font-semibold text-emerald-800">Prune list is empty - All devices accounted for.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <div className="text-[10px] text-slate-500 font-mono">Last continuous polling check: {healthState ? new Date(healthState.last_scan).toLocaleTimeString() : 'N/A'}</div>
                  </div>
                </div>

              </div>

              {/* COLLATERAL LIVE AI LAB SECTION OUTCOME DISPLAY */}
              {aiLoading && (
                <div id="ai-loading-panel" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-[#C8920A] animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-[#1B3A6B]">Summoning AI Labs Co-pilot. Consulting Techbridge Network Guidelines...</p>
                </div>
              )}

              {aiAnalysisResult && (
                <div id="ai-report-display" className="bg-white p-6 rounded-xl border-2 border-emerald-500 shadow-md space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-[#1B3A6B]">Gemini AI Assistant — Network Advisory Summary</h3>
                    </div>
                    <button id="ai-close-btn" onClick={() => setAiAnalysisResult(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm overflow-x-auto text-slate-700 leading-relaxed max-h-[350px] overflow-y-auto whitespace-pre-wrap pr-2 font-serif">
                    {aiAnalysisResult}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-100">
                    Compiled dynamically in UK British English. Designed in compliance with TUC Software Requirements criteria.
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ACTIVE TAB: DEVICES TABULAR DIRECTORY */}
          {activeTab === 'devices' && (
            <div id="tab-devices" className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#1B3A6B]">TUC Campus Active Device Map</h2>
                    <p className="text-xs text-slate-500 mt-1">Double click or click Detail action on any terminal to review active open ports, OS profiling, and triggers.</p>
                  </div>
                  
                  {/* SEARCH FILTERS SECTION */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        id="search-device-input"
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search IP, MAC or Vendor..."
                        className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1B3A6B] bg-slate-50 text-slate-800"
                      />
                    </div>
                    <select
                      id="select-status-filter"
                      value={selectStatusFilter}
                      onChange={(e) => setSelectStatusFilter(e.target.value)}
                      className="border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-[#1B3A6B] bg-white focus:outline-none focus:ring-1"
                    >
                      <option value="ALL">All Status</option>
                      <option value="ACTIVE">ACTIVE ONLY</option>
                      <option value="ROGUE">ROGUE ONLY</option>
                      <option value="BLOCKED">BLOCKED ONLY</option>
                      <option value="INACTIVE">INACTIVE ONLY</option>
                    </select>
                  </div>
                </div>

                {/* DEVICE DIRECTORY GRID TABLE */}
                <div className="overflow-x-auto">
                  <table id="device-directory-table" className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                        <th className="p-3">Client details ({filteredDevices.length})</th>
                        <th className="p-3">IP Address</th>
                        <th className="p-3">MAC Address / vendor</th>
                        <th className="p-3">Custom Annotation Label</th>
                        <th className="p-3">State</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDevices.map(device => {
                        const isRogue = device.status === 'ROGUE';
                        return (
                          <tr 
                            id={`device-row-${device.id}`}
                            key={device.id} 
                            onClick={() => {
                              setSelectedDevice(device);
                              setAiAnalysisResult(null); // Clear active AI report context
                            }}
                            className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedDevice?.id === device.id ? 'bg-[#1B3A6B]/5 font-medium border-l-4 border-[#C8920A]' : ''}`}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${device.status === 'ACTIVE' ? 'bg-emerald-500' : isRogue ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                                <div>
                                  <div className="font-bold text-slate-900">{device.hostname || 'unnamed-client-node'}</div>
                                  <div className="text-[10px] text-slate-400 uppercase font-mono">{device.os_fingerprint || 'Generic Stack'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-mono font-bold text-[#1B3A6B]">{device.ip_address}</td>
                            <td className="p-3">
                              <div className="font-mono">{device.mac_address}</div>
                              <div className="text-[10px] text-slate-400 uppercase">{device.manufacturer || 'Unidentified OUI'}</div>
                            </td>
                            <td className="p-3">
                              {device.custom_label ? (
                                <span className="text-[#1B3A6B] font-semibold flex items-center gap-1">
                                  <Bookmark className="w-3 h-3 text-[#C8920A] fill-current" />
                                  {device.custom_label}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">No annotation added</span>
                              )}
                            </td>
                            <td className="p-3">{getStatusBadge(device.status)}</td>
                            <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-1">
                                <button
                                  id={`action-detail-btn-${device.id}`}
                                  onClick={() => setSelectedDevice(device)}
                                  className="p-2 min-h-[44px] flex items-center justify-center text-[#1B3A6B] hover:bg-[#1B3A6B]/10 rounded"
                                  title="View detailed statistics"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {device.status === 'BLOCKED' ? (
                                  <button
                                    id={`action-unblock-btn-${device.id}`}
                                    onClick={() => handleRemoveBlock(device.mac_address)}
                                    className="p-2 min-h-[44px] flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded"
                                    title="Unblock device"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    id={`action-block-btn-${device.id}`}
                                    onClick={() => {
                                      setShowConfirmBlock(device.mac_address);
                                      setBlockReason('Administrative control lockdown.');
                                    }}
                                    className="p-2 min-h-[44px] flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                                    title="Initiate drop rules"
                                  >
                                    <ShieldAlert className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredDevices.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                            No devices matched search constraints. Try executing "Trigger Active Scan" to seed new terminals.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* LIVE NETWORK TOPOLOGY (inferred from gateway route + shared-MAC extender signatures) */}
                <div id="topology-graph-preview" className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-[#1B3A6B] text-xs">Live Network Topology <span className="text-slate-400 font-normal">(inferred)</span></h3>
                    {topology?.gateway_ip && (
                      <span className="text-[10px] font-mono text-slate-500">gateway {topology.gateway_ip} · {topology.counts?.extenders || 0} extender(s) · {topology.counts?.direct || 0} direct</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{topology?.basis || 'Relationships inferred from the default gateway and shared-MAC extender signatures. Run a scan to map the network.'}</p>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mt-3 overflow-x-auto">
                    {topology && topology.tree && (topology.tree.gateway || (topology.tree.direct && topology.tree.direct.length)) ? (
                      <div className="min-w-[440px] text-xs">
                        {/* Internet / WAN */}
                        <div className="flex items-center gap-2">
                          <span className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center"><Globe className="w-4 h-4 text-slate-600" /></span>
                          <span className="font-bold text-slate-600">Internet (WAN)</span>
                        </div>
                        <div className="ml-[18px] h-4 border-l-2 border-slate-300"></div>

                        {/* Gateway / Router */}
                        <div className="flex items-center gap-2">
                          <span className="w-9 h-9 rounded-full bg-[#1B3A6B] flex items-center justify-center text-base">🌐</span>
                          <div>
                            <div className="font-bold text-[#1B3A6B]">{topology.tree.gateway?.type || 'Router / Gateway'}
                              <span className="font-mono font-normal text-slate-500 ml-2">{topology.gateway_ip}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{topology.tree.gateway ? `${topology.tree.gateway.vendor} · ${topology.tree.gateway.mac}` : 'not yet seen in a scan'}</div>
                          </div>
                        </div>

                        {/* Branches: extenders (with clients) then direct hosts */}
                        <div className="ml-[18px] mt-1 border-l-2 border-slate-300 pl-4 pt-2 space-y-3">
                          {topology.tree.branches?.map((b: any) => (
                            <div key={b.node.ip}>
                              <button
                                type="button"
                                title={`Extender ${b.node.ip}`}
                                onClick={() => selectByIp(b.node.ip)}
                                className="flex items-center gap-2 text-left hover:bg-amber-50 rounded px-1.5 py-1 transition-colors"
                              >
                                <span className="text-base leading-none">📶</span>
                                <div>
                                  <div className="font-bold text-amber-800">{b.node.type}
                                    <span className="font-mono font-normal text-slate-500 ml-2">{b.node.ip}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">{b.node.vendor} · {b.children?.length || 0} client(s) behind</div>
                                </div>
                              </button>
                              <div className="ml-[10px] mt-1.5 border-l-2 border-amber-200 pl-4 space-y-1">
                                {b.children && b.children.length
                                  ? b.children.map((c: any) => renderTopoRow(c))
                                  : <div className="text-[10px] text-slate-400 italic py-1">no clients currently behind this extender</div>}
                              </div>
                            </div>
                          ))}
                          {topology.tree.direct?.map((h: any) => renderTopoRow(h))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-center py-6 text-xs">No topology yet — click “Trigger Active Scan” to map the network.</div>
                    )}
                  </div>
                </div>
              </div>

               {/* DETAILED BOTTOM SHEET IF A ROW SELECTED */}
               {selectedDevice && (
                 <div id="device-bottom-sheet" className="bg-white rounded-xl border-2 border-[#1B3A6B] p-6 space-y-4 shadow-lg animate-fadeIn">
                   <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                     <div className="flex items-center gap-2.5">
                       <Database className="w-5 h-5 text-[#C8920A]" />
                       <div>
                         <h3 className="font-bold text-[#1B3A6B] text-sm">Terminal Profile: {selectedDevice.hostname || 'Unknown Host'}</h3>
                         <span className="text-[10px] text-slate-400 font-mono">Device identifier: {selectedDevice.mac_address}</span>
                       </div>
                     </div>
                     <button id="close-sheet-btn" onClick={() => setSelectedDevice(null)} className="p-1 rounded hover:bg-slate-100">
                       <X className="w-4 h-4 text-slate-400" />
                     </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     
                     {/* METADATA SHEET PROPERTIES */}
                     <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                       <div className="text-xs font-bold text-[#1B3A6B] uppercase tracking-wider border-b pb-1">DEVICE PROPERTIES</div>
                       <div className="grid grid-cols-2 gap-2 text-xs">
                         <span className="text-slate-500 font-medium">IP address:</span>
                         <span className="font-mono font-bold text-slate-900">{selectedDevice.ip_address}</span>
                         <span className="text-slate-500 font-medium">IEEE Vendor:</span>
                         <span className="font-semibold text-slate-900">{selectedDevice.manufacturer || 'Unspecified'}</span>
                         <span className="text-slate-500 font-medium">Vitals Ping:</span>
                         <span className="font-mono text-emerald-600 font-bold">{selectedDevice.rtt} ms RTT</span>
                         <span className="text-slate-500 font-medium">Loss index:</span>
                         <span className={`font-mono font-bold ${selectedDevice.packet_loss > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{selectedDevice.packet_loss}%</span>
                         <span className="text-slate-500 font-medium">First discovered:</span>
                         <span className="text-slate-700">{new Date(selectedDevice.first_seen_at).toLocaleTimeString()} ({new Date(selectedDevice.first_seen_at).toLocaleDateString()})</span>
                         <span className="text-slate-500 font-medium">ADR Status:</span>
                         <span className="font-bold">{selectedDevice.in_adr ? '✅ Authorised (ADR)' : '⚠ Not in ADR'}</span>
                       </div>
                     </div>

                     {/* OPEN SERVICE PORT LIST */}
                     <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                       <div className="text-xs font-bold text-[#1B3A6B] uppercase tracking-wider border-b pb-1">DISCOVERED PORTS AUDIT</div>
                       <div className="space-y-1 max-h-[140px] overflow-y-auto">
                         {selectedDevice.ports.map((p, idx) => (
                           <div key={idx} className={`p-1.5 rounded flex items-center justify-between text-xs ${p.risk ? 'bg-red-50 text-red-900 border border-red-100' : 'bg-white border text-slate-700'}`}>
                             <span className="font-mono">Port {p.port} ({p.service})</span>
                             <span className="font-bold font-mono uppercase">{p.status}</span>
                             {p.risk && <span className="text-[10px] bg-red-600 text-white px-1.5 rounded font-semibold">HIGH RISK</span>}
                           </div>
                         ))}
                         {selectedDevice.ports.length === 0 && (
                           <div className="text-slate-400 italic text-center py-4">No services open dynamically discovered.</div>
                         )}
                       </div>
                     </div>

                     {/* ASSIGNED CONTROL HOOK PANEL */}
                     <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-between">
                       <div>
                         <div className="text-xs font-bold text-[#1B3A6B] uppercase tracking-wider border-b pb-1">ANALYTIC CONTROLS</div>
                         
                         {/* SET ANNOTATIONS INPUT */}
                         <div className="mt-2 space-y-2">
                           <label className="text-[10px] font-bold text-slate-500">MANUAL ANNOTATION</label>
                           <input
                             id={`input-annotate-${selectedDevice.id}`}
                             type="text"
                             defaultValue={selectedDevice.custom_label || ''}
                             placeholder="Admin Block PC etc..."
                             onBlur={(e) => handleSaveAnnotation(selectedDevice.id, e.target.value)}
                             className="w-full text-xs p-1.5 border border-slate-200 rounded focus:outline-none focus:border-[#1B3A6B] text-slate-800 font-semibold bg-white"
                           />
                         </div>
                       </div>

                       <div className="flex gap-2 mt-4">
                         <button
                           id={`btn-ai-device-${selectedDevice.id}`}
                           onClick={() => handleGetAICopilotReport('device_diagnostic', selectedDevice)}
                           className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 rounded-lg inline-flex items-center justify-center gap-1.5 shadow"
                         >
                           <Sparkles className="w-3.5 h-3.5" />
                           Explain with AI
                         </button>
                         {!selectedDevice.in_adr && (
                           <button
                             type="button"
                             id={`btn-whitelist-device-${selectedDevice.id}`}
                             onClick={() => handleWhitelistDevice(selectedDevice.mac_address, 'Enrolled Administrative Terminal')}
                             className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center"
                             title="Add to Whitelisted ADR"
                           >
                             Authorise
                           </button>
                         )}
                       </div>
                     </div>

                   </div>

                   {/* AI ADVISORY RESULT — scoped to the selected device */}
                   {aiLoading && (
                     <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 text-xs text-emerald-900">
                       <Sparkles className="w-5 h-5 text-emerald-600 animate-spin flex-shrink-0" />
                       <span className="font-semibold">Consulting AI advisor for {selectedDevice.ip_address}…</span>
                     </div>
                   )}
                   {aiAnalysisResult && !aiLoading && (
                     <div className="bg-white border-2 border-emerald-500 rounded-lg p-4 space-y-3 animate-fadeIn">
                       <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                         <div className="flex items-center gap-2">
                           <Sparkles className="w-4 h-4 text-emerald-600" />
                           <span className="font-bold text-[#1B3A6B] text-sm">AI Advisory — {selectedDevice.hostname || selectedDevice.ip_address}</span>
                         </div>
                         <button type="button" onClick={() => setAiAnalysisResult(null)} title="Dismiss advisory" className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                       </div>
                       <div className="text-xs text-slate-700 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap pr-2 font-serif">{aiAnalysisResult}</div>
                     </div>
                   )}
                 </div>
               )}

            </div>
          )}

          {/* ACTIVE TAB: BANDWIDTH STATISTICS */}
          {activeTab === 'bandwidth' && (
            <div id="tab-bandwidth" className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A6B]">Per-Interface Traffic Statistics</h2>
                  <p className="text-xs text-slate-500 mt-1">Acquired from managed core switches via automated SNMP v2c/v3 polling sequences.</p>
                </div>

                {/* INTERFACES CARDS ROW WITH UTILIZATION GAUGES */}
                <div id="bandwidth-interfaces-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {interfacesState.map(inter => {
                    const pct = inter.utilisation_pct;
                    const isHigh = pct > alertThreshold;
                    return (
                      <div id={`interface-gauge-card-${inter.id}`} key={inter.id} className={`p-4 rounded-xl border ${isHigh ? 'bg-red-50/70 border-red-200' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1B3A6B] text-xs leading-tight block truncate max-w-[150px]">{inter.name}</span>
                          <span className={`${isHigh ? 'text-red-700 bg-red-100' : 'text-[#1B3A6B] bg-slate-200'} font-bold px-1.5 py-0.5 rounded text-[10px]`}>
                            {inter.link_capacity} Mbps
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">Current Load:</span>
                            <span className={`font-bold ${isHigh ? 'text-red-600 animate-pulse' : 'text-[#1B3A6B]'}`}>{pct}%</span>
                          </div>
                          {/* Progress bar container */}
                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isHigh ? 'bg-red-600' : 'bg-[#1B3A6B]'}`} 
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1 pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                          <div>IN: {(inter.bytes_in / (1024 * 1024)).toFixed(1)} Mb</div>
                          <div className="text-right">OUT: {(inter.bytes_out / (1024 * 1024)).toFixed(1)} Mb</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* GRAPH CHRONOLOGICAL PERFORMANCE REPORT BLOCK */}
                <div id="chart-chronological-history" className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-[#1B3A6B] text-xs">Uplink Interface Historical Trailing Timeline</h3>
                    <div className="flex gap-2">
                      <button 
                        id="btn-ai-bandwidth-anal"
                        onClick={() => handleGetAICopilotReport('bandwidth_congestion', interfacesState[2])}
                        className="bg-[#1B3A6B] hover:bg-[#1B3A6B]/90 text-[#C8920A] text-[11px] font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#C8920A]" />
                        Evaluate Student WiFi Throttling QoS
                      </button>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyState}>
                        <defs>
                          <linearGradient id="colorUtilAll" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C8920A" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#C8920A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="sampled_at" 
                          tickFormatter={(t) => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          tick={{ fontSize: 9 }}
                        />
                        <YAxis tick={{ fontSize: 9 }} unit="%" />
                        <Tooltip labelFormatter={(l) => `Sample interval: ${new Date(l).toLocaleTimeString()}`} />
                        <Area type="monotone" name="All Segments Avg Load" dataKey="utilisation_pct" stroke="#C8920A" strokeWidth={2} fillOpacity={1} fill="url(#colorUtilAll)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* LEADERBOARD TOP CLIENT CONSUMPTION GRID */}
                <div id="leaderboard" className="mt-4">
                  <h3 className="font-bold text-[#1B3A6B] text-xs border-b pb-2">Top Host Bandwidth Consumers</h3>
                  <div className="mt-3 space-y-2">
                    {devicesState.filter(d => d.status === 'ACTIVE').slice(0, 4).map((d, index) => {
                      const calculatedVolume = (14.2 - index * 3.4 + Math.random() * 0.5).toFixed(1);
                      return (
                        <div key={d.id} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-400">#0{index + 1}</span>
                            <div>
                              <span className="font-bold text-slate-800 font-mono">{d.ip_address}</span>
                              <span className="text-slate-400 text-[10px] ml-2">({d.hostname || 'Unlabelled client'})</span>
                            </div>
                          </div>
                          <span className="font-mono text-[#1B3A6B] font-bold">{calculatedVolume} GB Transferred (Past 24 hr)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ACTIVE TAB: PORT AUDITING */}
          {activeTab === 'ports' && (
            <div id="tab-ports" className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A6B]">Discovered Ports &amp; running Services Auditor</h2>
                  <p className="text-xs text-slate-500 mt-1">Nmap subprocess sweep reports profiling active tcp sockets on campus targets.</p>
                </div>

                {/* PORTS AUDIT TREE ELEMENT */}
                <div id="ports-audit-tree" className="space-y-4 text-xs">
                  {devicesState.map(dev => (
                    <div id={`port-dev-block-${dev.id}`} key={dev.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative overflow-hidden">
                      <div className="flex items-center justify-between border-b pb-2 mb-2 flex-wrap gap-2">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{dev.hostname || 'Host Unresolved'}</span>
                            <span className="font-mono font-normal text-slate-500">[{dev.ip_address}]</span>
                          </div>
                          <div className="text-[10px] text-slate-400">System Profiling OUI: {dev.manufacturer || 'Unknown vendor'} | OS: {dev.os_fingerprint || 'Generic kernel'}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {dev.ports.some(p => p.risk) && (
                            <span className="bg-red-100 border border-red-300 text-red-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase animate-pulse">Vulnerability Risk Detected</span>
                          )}
                          <span id={`status-badge-mini-${dev.id}`} className="text-slate-500 text-[10px] font-mono leading-none">RTT: {dev.rtt}ms</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {dev.ports.map((p, idx) => (
                          <div key={idx} className={`p-2 rounded border text-center relative ${p.risk ? 'bg-red-50 border-red-300 text-red-900 font-semibold' : 'bg-white border-slate-200 text-slate-700'}`}>
                            <div className="font-mono font-bold">{p.port}</div>
                            <div className="text-[10px] uppercase text-slate-400 mt-0.5">{p.service}</div>
                            <div className="text-[9px] uppercase font-bold text-slate-500">{p.status}</div>
                          </div>
                        ))}
                        {dev.ports.length === 0 && (
                          <div className="col-span-full py-4 text-center italic text-slate-400">
                            No open socket services discovered during scan sweep. Protected behind local software node firewalls.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ACTIVE TAB: ALERTS MANAGER */}
          {activeTab === 'alerts' && (
            <div id="tab-alerts" className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-[#1B3A6B]">Alerts Hub console</h2>
                    <p className="text-xs text-slate-500 mt-1">Unresolved security alerts and historical regulatory audits ledger of critical threshold breaches.</p>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-1.5 flex gap-1">
                    <span className="text-red-700 bg-red-100 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Acknowledge Rules Strict</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {alertsState.map(alert => {
                    const isAcked = alert.status === 'ACKNOWLEDGED';
                    return (
                      <div id={`alert-tile-${alert.id}`} key={alert.id} className={`p-4 rounded-xl border ${isAcked ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-red-50/60 border-red-300 text-slate-900'} space-y-2`}>
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-red-600 animate-ping' : 'bg-amber-500'}`}></span>
                            <span className="font-bold uppercase text-[10px] tracking-wider font-mono text-[#1B3A6B]">[{alert.severity}] - {alert.type}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()} ({new Date(alert.timestamp).toLocaleDateString()})</span>
                        </div>
                        
                        <p className="text-xs font-semibold leading-relaxed">{alert.message}</p>

                        <div className="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center text-[11px]">
                          {isAcked ? (
                            <div className="text-slate-500 italic flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Resolved: {alert.ack_note} <span className="text-[9px] font-mono">(@ {new Date(alert.timestamp).toLocaleTimeString()})</span></span>
                            </div>
                          ) : (
                            <button
                              id={`btn-trigger-ack-${alert.id}`}
                              onClick={() => {
                                setAckAlertId(alert.id);
                                setAckNote('');
                              }}
                              className="text-[#1B3A6B] font-bold hover:underline flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Acknowledge alert parameters
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

               {/* ACKNOWLEDGE CONTEXT INPUT DIALOG IF ID NOT NULL */}
               {ackAlertId && (
                 <div id="ack-dialog-box" className="bg-white p-5 rounded-xl border-2 border-[#1B3A6B] space-y-4 shadow-md animate-fadeIn">
                   <div className="flex justify-between items-center pb-2 border-b">
                     <span className="font-bold text-xs uppercase tracking-widest text-[#1B3A6B]">ACKNOWLEDGE ALERT PARAMETERS (ID: {ackAlertId})</span>
                     <button onClick={() => setAckAlertId(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                   </div>
                   <div className="space-y-3 text-xs">
                     <label className="block text-slate-500 font-semibold uppercase">Mandatory audit action note</label>
                     <textarea
                       id="textarea-ack-note"
                       rows={2}
                       value={ackNote}
                       onChange={(e) => setAckNote(e.target.value)}
                       placeholder="Detail resolving steps executed on the hardware devices segment..."
                       className="w-full text-xs p-2 border border-slate-200 rounded focus:outline-none focus:border-[#1B3A6B] bg-[#F8FAFC] text-slate-900 font-semibold"
                     />
                   </div>
                   <div className="flex justify-end gap-2 text-xs">
                     <button onClick={() => setAckAlertId(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-colors">Discard</button>
                     <button id="btn-submit-ack" onClick={() => handleAckAlert()} className="px-4 py-1.5 bg-[#1B3A6B] hover:bg-[#1B3A6B]/90 text-[#C8920A] font-bold rounded shadow transition-all">Submit Acknowledgment</button>
                   </div>
                 </div>
               )}

            </div>
          )}

          {/* ACTIVE TAB: FIREWALL AND BLOCKS */}
          {activeTab === 'control' && (
            <div id="tab-control" className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A6B]">Network control actions Center</h2>
                  <p className="text-xs text-slate-500 mt-1">Block lists, quarantine scripts exporter, and QoS shaping policy files.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* CURRENTLY BLOCKED DEVICES TABLE */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs text-red-700 uppercase tracking-widest border-b pb-2">Active blocked drop-listed devices</h3>
                    <div className="space-y-3">
                      {devicesState.filter(d => d.status === 'BLOCKED').map(dev => (
                        <div id={`blocked-card-${dev.id}`} key={dev.id} className="p-3 bg-red-50/50 rounded-lg border border-red-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold font-mono text-pink-900 block">{dev.ip_address} | {dev.mac_address}</span>
                            <span className="text-[10px] text-slate-500 block italic">Annotation Lookup: {dev.custom_label || 'Unassigned profile'}</span>
                            <span className="text-[10px] text-slate-400 block font-light">Last status sync: {new Date(dev.updated_at).toLocaleTimeString()}</span>
                          </div>
                          
                          <button
                            id={`btn-pnl-unblock-${dev.id}`}
                            onClick={() => handleRemoveBlock(dev.mac_address)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded"
                          >
                            Unblock Node
                          </button>
                        </div>
                      ))}
                      {devicesState.filter(d => d.status === 'BLOCKED').length === 0 && (
                        <div className="text-slate-400 italic text-xs text-center py-8">
                          No active block policies compiled. Campus pathways operating seamlessly.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CUSTOM SCRIPT TEMPLATES CONTAINER */}
                  <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-xs text-[#1B3A6B] uppercase tracking-widest">Gateway iptables Dropping Template</h3>
                    <p className="text-[11px] text-slate-500">Copy or save as shell file scripts to apply on the primary Codero firewall router terminal.</p>
                    
                    <div className="relative">
                      <pre className="text-[10px] font-mono bg-slate-900 text-emerald-400 p-4 rounded-lg overflow-x-auto max-h-[160px] whitespace-pre">
{`# Techbridge NetScan Firewall Export Sheet
# Dropping rule matched targets on TUC student segments
iptables -F FORWARD-NETSCAN 2>/dev/null || iptables -N FORWARD-NETSCAN
${devicesState.filter(d => d.status === 'BLOCKED').map(d => `iptables -I FORWARD-NETSCAN -m mac --mac-source ${d.mac_address} -j DROP`).join('\n') || '# No blocked elements found to compile.'}
iptables -A FORWARD -j FORWARD-NETSCAN`}
                      </pre>
                      <button
                        id="btn-copy-script-iptables"
                        onClick={() => copyToClipboard(`iptables -F FORWARD-NETSCAN 2>/dev/null || iptables -N FORWARD-NETSCAN\n` + devicesState.filter(d => d.status === 'BLOCKED').map(d => `iptables -I FORWARD-NETSCAN -m mac --mac-source ${d.mac_address} -j DROP\n`).join(''), 'iptables')}
                        className="absolute right-2 top-2 bg-white/10 hover:bg-white/20 p-1.5 rounded text-white"
                        title="Copy to Clipboard"
                      >
                        {copiedScriptId === 'iptables' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="pt-2">
                      <h4 className="font-bold text-[11px] text-[#1B3A6B]">Linux tc shaping rules (Student WiFi throttle limit)</h4>
                      <pre className="text-[10px] font-mono bg-slate-900 text-[#C8920A] p-4 rounded-lg overflow-x-auto max-h-[120px] mt-2 whitespace-pre">
{`# Throttling script for high consumer nodes
tc class change dev eth1 parent 1:1 classid 1:30 htb rate 10mbit ceil 20mbit`}
                      </pre>
                    </div>

                  </div>

                </div>
              </div>

               {/* CONFIRM CONTROLS MODAL IF STATUS WAITING FOR TRIGGER */}
               {showConfirmBlock && (
                 <div id="confirm-modal-overlay" className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                   <div id="confirm-modal-box" className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border-t-4 border-red-600 block">
                     <div className="flex items-center gap-3 text-red-600">
                       <AlertCircle className="w-6 h-6 flex-shrink-0" />
                       <h3 className="text-lg font-bold">Confirm administrative block!</h3>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed">
                       You are pushing dropping policies matching <strong>{showConfirmBlock}</strong> across the campus subnets. This action isolates the terminal node immediately.
                     </p>

                     <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-500">Reason for blocking (Mandatory audit field)</label>
                       <input 
                         id="confirm-modal-reason-input"
                         type="text"
                         value={blockReason}
                         onChange={(e) => setBlockReason(e.target.value)}
                         placeholder="e.g. Rogue AP causing DHCP failures."
                         className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500 bg-[#F8FAFC] text-slate-900 font-semibold"
                       />
                     </div>

                     <div className="flex justify-end gap-2 text-xs">
                       <button 
                         id="confirm-modal-cancel"
                         onClick={() => {
                           setShowConfirmBlock(null);
                           setBlockReason('');
                         }}
                         className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
                       >
                         Discard
                       </button>
                       <button
                         id="confirm-modal-execute"
                         onClick={() => handleConfirmBlock()}
                         className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow"
                       >
                         Execute Action Block
                       </button>
                     </div>
                   </div>
                 </div>
               )}

            </div>
          )}

          {/* ACTIVE TAB: STANDING REPORTS */}
          {activeTab === 'reports' && (
            <div id="tab-reports" className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A6B]">TUC Institutional reporting center</h2>
                  <p className="text-xs text-slate-500 mt-1">Compile comprehensive stats and incident records for Techbridge College management summaries.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* GENERATOR ACTIONS BOX */}
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="font-bold text-[#1B3A6B] block">Download Daily Health Sheet</span>
                      <p className="text-slate-500">Outputs discovery indices, average packet drop, and bandwidth peak thresholds evaluated dynamically at state level.</p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button 
                        id="dl-btn-pdf"
                        onClick={() => triggerDownloadReport('pdf')}
                        className="bg-[#1B3A6B] hover:bg-[#1B3A6B]/90 text-[#C8920A] font-bold py-2 px-4 rounded-lg inline-flex items-center gap-1 shadow"
                      >
                        <FileText className="w-4 h-4" />
                        Compile PDF Report
                      </button>
                      <button 
                        id="dl-btn-csv"
                        onClick={() => triggerDownloadReport('csv')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded-lg inline-flex items-center gap-1"
                      >
                        <Layers className="w-4 h-4" />
                        Export CSV list
                      </button>
                    </div>
                  </div>

                  {/* IMMUTABLE ACTION AUDIT LOG BOX */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs text-[#1B3A6B] uppercase tracking-widest border-b pb-2">Immutable ICT Action log</h3>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                      {auditsState.map(aud => (
                        <div id={`audit-log-line-${aud.id}`} key={aud.id} className="p-2 border border-slate-100 rounded bg-slate-50 relative text-[11px] leading-relaxed">
                          <span className="font-bold block text-slate-800 tracking-wide font-mono uppercase">{aud.action_type} - Match target: {aud.target_id}</span>
                          <span className="block text-slate-600 mt-0.5">Executed by: {aud.actor_username} | Reason: {aud.reason}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{new Date(aud.created_at).toLocaleTimeString()} ({new Date(aud.created_at).toLocaleDateString()})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ACTIVE TAB: CLI TERMINAL HUB */}
          {activeTab === 'cli' && (
            <div id="tab-cli" className="space-y-4 animate-fadeIn">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A6B]">TUC Embedded Admin CLI Shell</h2>
                  <p className="text-xs text-slate-500 mt-1">Interact directly with scanning services using Netscan raw commands under TUC Network authentication constraints.</p>
                </div>

                {/* SHELL TERMINAL SIMULATION CONTAINER */}
                <div id="shell-container" className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 shadow-inner flex flex-col h-[350px]">
                  
                  {/* SCROLLABLE LOG CHANNELS */}
                  <div ref={cliScrollRef} className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                    <div>[TUC NetScan Node Diagnostic Shell Terminal v1.0.0]</div>
                    <div>Authentication successful: Admin environment mapped.</div>
                    <div>-------------------------------------------------------------</div>
                    {cliLogs.map((log, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-slate-400 font-medium">{`netscan@admin:~# ${log.cmd}`} <span className="text-[10px] text-slate-600 float-right font-mono">{log.time}</span></div>
                        <pre className={`whitespace-pre-wrap font-mono p-1 rounded ${log.err ? 'text-rose-400 bg-rose-950/20' : 'text-emerald-400'}`}>{log.output}</pre>
                      </div>
                    ))}
                  </div>

                  {/* COMMAND FORM PROMPT */}
                  <form id="cli-shell-form" onSubmit={handleExecuteCLI} className="border-t border-slate-800 pt-3 flex items-center gap-2">
                    <span className="text-[#C8920A] font-bold">netscan-cli#</span>
                    <input 
                      id="cli-input-command"
                      type="text"
                      value={cliCommand}
                      onChange={(e) => setCliCommand(e.target.value)}
                      placeholder="e.g. devices list --json (or type 'help')"
                      className="flex-grow bg-transparent border-none outline-none focus:ring-0 text-white font-mono placeholder-slate-600"
                    />
                    <button type="submit" className="p-1 px-3 py-1 text-xs font-bold bg-[#C8920A] rounded text-[#1B3A6B] hover:bg-amber-400">
                      Run
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* ACTIVE TAB: GLOBAL CONFIGURATIONS */}
          {activeTab === 'settings' && (
            <div id="tab-settings" className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A6B]">TUC NetScan Global Configurations</h2>
                  <p className="text-xs text-slate-500 mt-1">Configure subnet CIDR parameters, webhook endpoint dispatch alerts, and SNMP public community strings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  {/* CONFIG PANEL COLUMN A */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-slate-600 font-bold">Configured Segment CIDRs (Comma separated)</label>
                      <input 
                        id="setting-cidrs"
                        type="text"
                        value={subnetConfig}
                        onChange={(e) => setSubnetConfig(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded focus:outline-none focus:border-[#1B3A6B] bg-slate-50 text-slate-800 font-mono font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-600 font-bold">Outgoing webhook delivery Endpoint url</label>
                      <input 
                        id="setting-webhook"
                        type="text"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded focus:outline-none focus:border-[#1B3A6B] bg-slate-50 text-slate-800 font-sans font-semibold"
                      />
                    </div>
                  </div>

                  {/* CONFIG PANEL COLUMN B */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-slate-600 font-bold">Critical bandwidth alert threshold ({alertThreshold}%)</label>
                      <input 
                        id="setting-threshold"
                        type="range"
                        min="50"
                        max="95"
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                        className="w-full py-2 accent-[#1B3A6B]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-600 font-bold">Scheduled ARP active interval (Seconds)</label>
                      <select 
                        id="setting-interval"
                        value={scanInterval}
                        onChange={(e) => setScanInterval(parseInt(e.target.value))}
                        className="w-full p-2.5 border border-slate-200 rounded focus:outline-none bg-slate-50 text-[#1B3A6B] font-bold"
                      >
                        <option value="30">30 Seconds (Highly aggressive)</option>
                        <option value="60">60 Seconds (Default standard)</option>
                        <option value="300">300 Seconds (Conserves network load)</option>
                      </select>
                    </div>

                    <button
                      id="save-settings-btn"
                        onClick={handleSaveSettings}
                      className="w-full bg-[#1B3A6B] hover:bg-[#1B3A6B]/90 text-[#C8920A] font-bold py-2.5 px-4 rounded-lg shadow mt-4 transition-all"
                    >
                      Save Configuration parameters
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}

// Simple Bookmarked Icon helper to prevent import issue
function BookMarkedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
