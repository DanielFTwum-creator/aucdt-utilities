import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, Filter, Search, Play, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

// TypeScript Types
interface TestResult {
  id: string;
  name: string;
  suite: string;
  status: 'pass' | 'fail' | 'skip' | 'pending';
  duration: number;
  error?: string;
  timestamp: string;
}

interface SuiteMetadata {
  id: string;
  version: string;
  updated: string;
  target: string;
  framework: string;
}

interface TestStats {
  total: number;
  passing: number;
  failing: number;
  skipped: number;
  pending: number;
  passRate: number;
  avgDuration: number;
}

// Mock Data - Replace with real data from your test runner
const mockSuiteMetadata: SuiteMetadata = {
  id: 'TUC-ICT-CYPRESS-SUITE-2026-002',
  version: '2.0-FIXED',
  updated: '2026-05-22',
  target: 'https://admissions.techbridge.edu.gh',
  framework: 'Angular (Hash-based routing)'
};

const mockTestResults: TestResult[] = [
  // Suite 0: Test Suite Information
  { id: '0-1', name: 'displays test suite version and metadata', suite: '0. Test Suite Information', status: 'pass', duration: 85, timestamp: '2026-05-22T10:30:00Z' },

  // Suite 1: Page Load & Core UI
  { id: '1-1', name: 'should load the home page without JavaScript errors', suite: '1. Page Load & Core UI', status: 'pass', duration: 5998, timestamp: '2026-05-22T10:30:01Z' },
  { id: '1-2', name: 'should have the correct page title containing "Techbridge"', suite: '1. Page Load & Core UI', status: 'pass', duration: 3192, timestamp: '2026-05-22T10:30:07Z' },
  { id: '1-3', name: 'should display the university logo or branding', suite: '1. Page Load & Core UI', status: 'fail', duration: 4521, error: 'Element not found: h1 with TechBridge text', timestamp: '2026-05-22T10:30:11Z' },
  { id: '1-4', name: 'should have a visible navigation menu', suite: '1. Page Load & Core UI', status: 'pass', duration: 3591, timestamp: '2026-05-22T10:30:16Z' },
  { id: '1-5', name: 'should display the page layout correctly', suite: '1. Page Load & Core UI', status: 'pass', duration: 4061, timestamp: '2026-05-22T10:30:20Z' },

  // Suite 2: Navigation & Routing
  { id: '2-1', name: 'should navigate to /login when clicking login link', suite: '2. Navigation & Routing', status: 'pass', duration: 4806, timestamp: '2026-05-22T10:30:25Z' },
  { id: '2-2', name: 'should navigate to /signup when clicking signup/register link', suite: '2. Navigation & Routing', status: 'pass', duration: 4534, timestamp: '2026-05-22T10:30:30Z' },
  { id: '2-3', name: 'should navigate to /faqs when clicking FAQ link', suite: '2. Navigation & Routing', status: 'skip', duration: 0, timestamp: '2026-05-22T10:30:35Z' },
  { id: '2-4', name: 'should navigate to /instructions when clicking instructions link', suite: '2. Navigation & Routing', status: 'skip', duration: 0, timestamp: '2026-05-22T10:30:35Z' },
  { id: '2-5', name: 'should navigate to /contact-us when clicking contact link', suite: '2. Navigation & Routing', status: 'pass', duration: 4092, timestamp: '2026-05-22T10:30:40Z' },
  { id: '2-6', name: 'should have working footer navigation links', suite: '2. Navigation & Routing', status: 'skip', duration: 0, timestamp: '2026-05-22T10:30:41Z' },

  // Suite 3: Login / Account Access
  { id: '3-1', name: 'should display the email input field with correct attributes', suite: '3. Login / Account Access', status: 'pass', duration: 2023, timestamp: '2026-05-22T10:30:42Z' },
  { id: '3-2', name: 'should display the password input field with correct attributes', suite: '3. Login / Account Access', status: 'pass', duration: 1845, timestamp: '2026-05-22T10:30:45Z' },
  { id: '3-3', name: 'should require both email and password', suite: '3. Login / Account Access', status: 'pass', duration: 3414, timestamp: '2026-05-22T10:30:49Z' },
  { id: '3-4', name: 'should require hCaptcha verification before login', suite: '3. Login / Account Access', status: 'pass', duration: 4100, timestamp: '2026-05-22T10:30:53Z' },
];

// Calculate statistics
const calculateStats = (results: TestResult[]): TestStats => {
  const total = results.length;
  const passing = results.filter(r => r.status === 'pass').length;
  const failing = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  const pending = results.filter(r => r.status === 'pending').length;
  const passRate = total > 0 ? Math.round((passing / total) * 100) : 0;
  const avgDuration = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.duration, 0) / results.length) : 0;

  return { total, passing, failing, skipped, pending, passRate, avgDuration };
};

// Main Dashboard Component
export default function CypressTestDashboard() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSuite, setExpandedSuite] = useState<string | null>(null);

  const stats = calculateStats(mockTestResults);
  const COLORS = { pass: '#10b981', fail: '#ef4444', skip: '#f59e0b', pending: '#6366f1' };

  // Filter results
  const filteredResults = useMemo(() => {
    return mockTestResults.filter(test => {
      const statusMatch = filterStatus === 'all' || test.status === filterStatus;
      const searchMatch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.suite.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [filterStatus, searchQuery]);

  // Group by suite
  const suiteGroups = useMemo(() => {
    const groups: { [key: string]: TestResult[] } = {};
    filteredResults.forEach(test => {
      if (!groups[test.suite]) groups[test.suite] = [];
      groups[test.suite].push(test);
    });
    return groups;
  }, [filteredResults]);

  // Chart data
  const chartData = [
    { name: 'Passing', value: stats.passing, fill: COLORS.pass },
    { name: 'Failing', value: stats.failing, fill: COLORS.fail },
    { name: 'Skipped', value: stats.skipped, fill: COLORS.skip },
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-500/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🧪</div>
              <div>
                <h1 className="text-4xl font-bold">Test Dashboard</h1>
                <p className="text-blue-100 text-sm mt-1">Cypress E2E Test Suite Runner</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-lg">
              <Play size={18} />
              Run Tests
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-blue-500/50">
            <div className="text-sm">
              <p className="text-blue-200 font-semibold">Suite ID</p>
              <p className="font-mono font-bold mt-1 text-sm">{mockSuiteMetadata.id}</p>
            </div>
            <div className="text-sm">
              <p className="text-blue-200 font-semibold">Version</p>
              <p className="font-bold mt-1">{mockSuiteMetadata.version}</p>
            </div>
            <div className="text-sm">
              <p className="text-blue-200 font-semibold">Last Updated</p>
              <p className="font-bold mt-1">{mockSuiteMetadata.updated}</p>
            </div>
            <div className="text-sm">
              <p className="text-blue-200 font-semibold">Framework</p>
              <p className="font-bold mt-1 text-xs">Angular SPA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Tests"
            value={stats.total}
            icon="📊"
            color="blue"
          />
          <StatCard
            title="Passing"
            value={stats.passing}
            icon="✅"
            color="green"
            highlight={true}
          />
          <StatCard
            title="Failing"
            value={stats.failing}
            icon="❌"
            color="red"
            highlight={stats.failing > 0}
          />
          <StatCard
            title="Skipped"
            value={stats.skipped}
            icon="⏸️"
            color="yellow"
          />
          <StatCard
            title="Pass Rate"
            value={`${stats.passRate}%`}
            icon="📈"
            color="blue"
            highlight={stats.passRate >= 90}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Results Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Chart */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test Performance (Last 10)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockTestResults.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                <Bar dataKey="duration" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['all', 'pass', 'fail', 'skip'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-200 capitalize ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Results by Suite */}
        <div className="space-y-4 mb-12">
          {Object.entries(suiteGroups).length > 0 ? (
            Object.entries(suiteGroups).map(([suite, tests]) => (
              <SuiteAccordion
                key={suite}
                suite={suite}
                tests={tests}
                expanded={expandedSuite === suite}
                onToggle={() => setExpandedSuite(expandedSuite === suite ? null : suite)}
              />
            ))
          ) : (
            <div className="card p-8 text-center">
              <p className="text-slate-400 text-lg">No tests match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color, highlight }: any) {
  const bgColors: { [key: string]: string } = {
    blue: 'bg-blue-500/20 border-blue-500/30',
    green: 'bg-green-500/20 border-green-500/30',
    red: 'bg-red-500/20 border-red-500/30',
    yellow: 'bg-yellow-500/20 border-yellow-500/30',
  };

  return (
    <div className={`${bgColors[color]} card p-6 ${highlight ? 'ring-2 ring-blue-500/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-300 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

// Suite Accordion Component
function SuiteAccordion({ suite, tests, expanded, onToggle }: any) {
  const suiteStats = {
    total: tests.length,
    passing: tests.filter((t: TestResult) => t.status === 'pass').length,
    failing: tests.filter((t: TestResult) => t.status === 'fail').length,
    skipped: tests.filter((t: TestResult) => t.status === 'skip').length,
  };

  return (
    <div className="card overflow-hidden">
      {/* Suite Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-all duration-200"
      >
        <div className="flex items-center gap-4 flex-1">
          <ChevronDown
            size={20}
            className={`text-blue-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
          <div className="text-left">
            <h3 className="text-white font-semibold text-lg">{suite}</h3>
            <p className="text-sm text-slate-400 mt-1">
              {suiteStats.passing}/{suiteStats.total} passing
              {suiteStats.failing > 0 && ` • ${suiteStats.failing} failing`}
              {suiteStats.skipped > 0 && ` • ${suiteStats.skipped} skipped`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {suiteStats.failing > 0 && <span className="text-red-500 font-bold text-xl">❌</span>}
          {suiteStats.passing > 0 && <span className="text-green-500 font-bold text-xl">✅</span>}
        </div>
      </button>

      {/* Suite Tests */}
      {expanded && (
        <div className="border-t border-slate-700 divide-y divide-slate-700">
          {tests.map((test: TestResult) => (
            <TestRow key={test.id} test={test} />
          ))}
        </div>
      )}
    </div>
  );
}

// Test Row Component
function TestRow({ test }: { test: TestResult }) {
  const statusIcons = {
    pass: <CheckCircle size={18} className="text-green-500" />,
    fail: <XCircle size={18} className="text-red-500" />,
    skip: <Clock size={18} className="text-yellow-500" />,
    pending: <Clock size={18} className="text-blue-500" />,
  };

  return (
    <div className="px-6 py-4 hover:bg-slate-700/30 transition-colors duration-200">
      <div className="flex items-start gap-3">
        {statusIcons[test.status]}
        <div className="flex-1">
          <p className="text-white font-medium">{test.name}</p>
          {test.error && (
            <p className="text-red-400 text-sm mt-2">⚠️ Error: {test.error}</p>
          )}
        </div>
        <div className="text-right ml-4">
          {test.duration > 0 && (
            <p className="text-slate-400 text-sm font-mono">{test.duration}ms</p>
          )}
        </div>
      </div>
    </div>
  );
}
