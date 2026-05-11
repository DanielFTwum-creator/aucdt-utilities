import { useEffect, useMemo, useState } from 'react';
import { useFilter } from '../../contexts/FilterContext';
import useKeyboardShortcuts, { KeyboardShortcutsAnnouncer } from '../../hooks/useKeyboardShortcuts';
import { auditLogger } from '../../services/AuditLogger';
import { authService } from '../../services/AuthService';
import AccessibilityToolbar from '../accessibility/AccessibilityToolbar';
import SkipLinks from '../accessibility/SkipLinks';
import AdminPanel from '../admin/AdminPanel';
import ExportModal from '../export/ExportModal';
import FilterPanel from '../filters/FilterPanel';
import { FunnelEfficiencyChart } from './charts/FunnelEfficiencyChart';
import { PerformanceScorecardChart } from './charts/PerformanceScorecardChart';
import { QualityQuantityChart } from './charts/QualityQuantityChart';
import { SeasonalPatternChart } from './charts/SeasonalPatternChart';
import { YearOverYearChart } from './charts/YearOverYearChart';
import { AllTimeStatsBanner } from './components/AllTimeStatsBanner';
import { DashboardHeader } from './components/DashboardHeader';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { calculateAllTimeStats, calculateTrends } from './utils/analyticsCalculations';

/**
 * Login Component
 * Provides authentication before accessing the dashboard
 * 
 * Security Features:
 * - Environment-based credentials
 * - Login attempt tracking
 * - Account lockout after max attempts
 * - Session timeout
 */
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);

  const MAX_ATTEMPTS = parseInt(process.env.REACT_APP_MAX_LOGIN_ATTEMPTS || '5');
  const LOCKOUT_DURATION = parseInt(process.env.REACT_APP_LOCKOUT_DURATION || '900000'); // 15 min

  // Check if account is locked
  useEffect(() => {
    const checkLockout = () => {
      const storedLockout = localStorage.getItem('login_lockout_until');
      if (storedLockout) {
        const lockoutUntil = parseInt(storedLockout);
        if (Date.now() < lockoutUntil) {
          setIsLocked(true);
          setLockoutTime(lockoutUntil);
          const timeLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
          setError(`Account locked. Try again in ${timeLeft} minutes.`);
        } else {
          // Lockout expired, clear it
          localStorage.removeItem('login_lockout_until');
          localStorage.removeItem('login_attempts');
          setIsLocked(false);
          setLoginAttempts(0);
        }
      }
      
      // Load stored attempts
      const storedAttempts = localStorage.getItem('login_attempts');
      if (storedAttempts) {
        setLoginAttempts(parseInt(storedAttempts));
      }
    };
    
    checkLockout();
    // Check every minute to update lockout message
    const interval = setInterval(checkLockout, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if locked
    if (isLocked) {
      const timeLeft = Math.ceil((lockoutTime - Date.now()) / 60000);
      setError(`Account locked. Try again in ${timeLeft} minutes.`);
      return;
    }
    
    // Call Auth API
    const result = await authService.login(username, password);
    
    if (result.success) {
      // Success - clear attempts and login
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_lockout_until');
      setError('');
      setLoginAttempts(0);
      onLogin(result.token);
      console.log('✅ User authenticated successfully via API');
      
      // Log successful login
      auditLogger.logAuth('USER_LOGIN', username, true);
    } else {
      // Failed attempt
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('login_attempts', newAttempts.toString());
      
      console.warn(`⚠️ Failed login attempt ${newAttempts}/${MAX_ATTEMPTS}: ${result.message}`);
      
      // Log failed login
      auditLogger.logSecurity('FAILED_LOGIN_ATTEMPT', {
        username,
        attempt: newAttempts,
        maxAttempts: MAX_ATTEMPTS,
        error: result.message
      });
      
      // Check if should lock account
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_DURATION;
        localStorage.setItem('login_lockout_until', lockUntil.toString());
        setIsLocked(true);
        setLockoutTime(lockUntil);
        setError(`Too many failed attempts. Account locked for ${LOCKOUT_DURATION / 60000} minutes.`);
        
        console.error('🔒 Account locked due to too many failed attempts');
        
        // Log lockout
        auditLogger.logSecurity('ACCOUNT_LOCKED', {
          username,
          lockoutUntil: new Date(lockUntil).toISOString(),
          reason: 'Max login attempts exceeded'
        });
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setError(`${result.message || 'Invalid credentials'}. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
      }
      
      setPassword('');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Login Header with Official Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
              alt="TECHBRIDGE University College Logo" 
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Portal</h1>
          <p className="text-gray-600">TECHBRIDGE University College</p>
          <p className="text-sm text-gray-500 mt-1">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * Advanced Analytics Dashboard Component with Authentication
 * NOW WITH PHASE 2: Accessibility & Themes!
 * 
 * New Features:
 * - Three themes: Light, Dark, High-Contrast
 * - Font size controls (4 sizes)
 * - Reduced motion support
 * - Enhanced keyboard navigation
 * - WCAG 2.1 AA compliance
 * - Skip links for screen readers
 * 
 * Displays 5 comprehensive charts analyzing admission data:
 * 1. Year-over-Year Growth Analysis
 * 2. Conversion Funnel Efficiency
 * 3. Quality vs Quantity Analysis
 * 4. Seasonal Pattern Recognition
 * 5. Multi-Metric Performance Scorecard
 * 
 * @component
 * @example
 * return <AdvancedAnalytics />
 */
const AdvancedAnalytics = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('aucdt_auth_token'));

  // Validate token on component mount
  useEffect(() => {
    const validate = async () => {
      if (token) {
        const result = await authService.validateToken(token);
        if (result.success && result.valid) {
          setIsAuthenticated(true);
        } else {
          // Token expired or invalid
          setIsAuthenticated(false);
          setToken(null);
          localStorage.removeItem('aucdt_auth_token');
        }
      }
    };
    validate();
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem('aucdt_auth_token', newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('aucdt_auth_token');
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  // Authenticated - render dashboard with accessibility features
  return (
    <>
      <SkipLinks />
      <KeyboardShortcutsAnnouncer />
      <AccessibilityToolbar />
      <AuthenticatedDashboard onLogout={handleLogout} />
    </>
  );
};

/**
 * Main Dashboard Component (rendered after authentication)
 */
const AuthenticatedDashboard = ({ onLogout }) => {
  // State for filters
  const [dateRange, setDateRange] = useState(() => {
    const savedDateRange = localStorage.getItem('analytics-date-range');
    if (savedDateRange) {
      const { start, end } = JSON.parse(savedDateRange);
      return {
        start: start ? new Date(start) : null,
        end: end ? new Date(end) : null,
      };
    }
    return { start: null, end: null };
  });
  const [selectedMetrics, setSelectedMetrics] = useState(() => {
    const savedMetrics = localStorage.getItem('analytics-selected-metrics');
    return savedMetrics ? JSON.parse(savedMetrics) : ['all'];
  });
  
  // Persist dateRange to localStorage
  useEffect(() => {
    localStorage.setItem('analytics-date-range', JSON.stringify(dateRange));
  }, [dateRange]);
  
  // Persist selectedMetrics to localStorage
  useEffect(() => {
    localStorage.setItem('analytics-selected-metrics', JSON.stringify(selectedMetrics));
  }, [selectedMetrics]);
  
  // Phase 3: Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  
  // Enable keyboard shortcuts with dashboard handlers
  useKeyboardShortcuts({
    onPrint: handlePrintClick,
    onExport: handleExportClick
  });
  
  // Phase 3: Export and Filter contexts
  const { getActiveFilterCount } = useFilter();
  
  // Custom hook handles data fetching, caching, and processing
  const { 
    data, 
    loading, 
    error, 
    refetch,
    processedMetrics 
  } = useAnalyticsData({ dateRange, selectedMetrics });

  // Phase 3: Handler functions
  const handleExportClick = () => {
    setIsExportModalOpen(true);
    auditLogger.logDataAccess('dashboard', 'export_modal_opened');
  };

  const handleFilterClick = () => {
    setIsFilterPanelOpen(true);
    auditLogger.logDataAccess('dashboard', 'filter_panel_opened');
  };

  const handleAdminClick = () => {
    setIsAdminPanelOpen(true);
    auditLogger.logAdminAction('ADMIN_PANEL_OPENED', { timestamp: new Date().toISOString() });
  };

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    setIsFilterPanelOpen(false);

    // Resolve datePreset into a concrete { start, end } range
    const now = new Date();
    let start = null;
    let end = null;

    switch (filters.datePreset) {
      case 'last-30-days':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        end = now;
        break;
      case 'last-3-months':
        start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        end = now;
        break;
      case 'last-6-months':
        start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        end = now;
        break;
      case 'last-12-months':
        start = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        end = now;
        break;
      case 'this-year':
        start = new Date(now.getFullYear(), 0, 1);
        end = now;
        break;
      case 'last-year':
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'custom':
        start = filters.customStart ? new Date(filters.customStart + '-01') : null;
        end = filters.customEnd ? new Date(filters.customEnd + '-28') : null;
        break;
      default: // 'all-time'
        break;
    }

    setDateRange({ start, end });
    setSelectedMetrics(filters.selectedMetrics || ['all']);

    auditLogger.logFilterChange('dashboard_filters', filters);
    console.log('✅ Filters applied:', filters);
  };

  const handlePrintClick = () => {
    window.print();
    auditLogger.logDataAccess('dashboard', 'print_initiated');
  };

  const handleLogoutClick = () => {
    auditLogger.logAuth('LOGOUT', 'admin', true);
    onLogout();
  };

  // Phase 3: Handle data import
  const handleDataImport = (importedData, strategy) => {
    console.log(`📥 Handling data import with strategy: ${strategy}`);
    
    // Get current data
    const currentData = data || [];
    
    // Merge based on strategy
    let mergedData;
    if (strategy === 'replace') {
      mergedData = importedData;
    } else if (strategy === 'merge') {
      const dataMap = new Map(currentData.map(r => [r.month, r]));
      importedData.forEach(record => dataMap.set(record.month, record));
      mergedData = Array.from(dataMap.values()).sort((a, b) => 
        a.month.localeCompare(b.month)
      );
    } else if (strategy === 'append') {
      const existingMonths = new Set(currentData.map(r => r.month));
      const newRecords = importedData.filter(r => !existingMonths.has(r.month));
      mergedData = [...currentData, ...newRecords].sort((a, b) => 
        a.month.localeCompare(b.month)
      );
    }
    
    // Save to localStorage
    localStorage.setItem('imported_analytics_data', JSON.stringify(mergedData));
    localStorage.setItem('data_import_timestamp', new Date().toISOString());
    
    console.log(`✅ Imported ${mergedData.length} records, saved to localStorage`);
    console.log('🔄 Refreshing data...');

    // Re-fetch data from localStorage — no page reload needed
    refetch();
  };

  // Memoized insights calculation - only recalculates when data changes
  const insights = useMemo(() => {
    if (!data?.length) return null;
    
    const latestMonth = data[data.length - 1];
    const prevMonth = data[data.length - 2];
    
    return {
      latestMonth,
      prevMonth,
      allTimeStats: calculateAllTimeStats(data),
      trends: calculateTrends(latestMonth, prevMonth)
    };
  }, [data]);

  // Loading state - show skeleton/spinner while fetching data
  if (loading) {
    return <LoadingState message="Crunching the numbers..." />;
  }
  
  // Error state - show error message with retry option
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }
  
  // Empty state - show when no data available
  if (!data?.length) {
    return <EmptyState />;
  }

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6"
    >
      {/* ARIA live region for screen readers - announces dynamic updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {loading && "Loading analytics data..."}
        {error && `Error loading data: ${error.message}`}
        {data && !loading && !error && `Analytics dashboard loaded successfully with ${data.length} months of data. Last updated: ${insights?.latestMonth?.month}`}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header with Controls and Quick Stats */}
        <div id="dashboard-header" role="banner">
          <DashboardHeader 
            insights={insights}
            dateRange={dateRange}
            selectedMetrics={selectedMetrics}
            onDateRangeChange={setDateRange}
            onMetricsChange={setSelectedMetrics}
            onPrint={handlePrintClick}
            onExport={handleExportClick}
            onFilter={handleFilterClick}
            onAdmin={handleAdminClick}
            onLogout={handleLogoutClick}
            activeFilterCount={getActiveFilterCount()}
          />
        </div>

        {/* Main Content Area */}
        <main id="main-content" tabIndex="-1">
          {/* All-Time Statistics Banner */}
          <div id="all-time-stats">
            <AllTimeStatsBanner stats={insights.allTimeStats} />
          </div>

          {/* Charts Section */}
          <div id="charts-section" aria-label="Analytics charts">
            {/* Chart 1: Year-over-Year Comparison */}
            <div id="year-over-year-chart">
              <YearOverYearChart 
                data={processedMetrics.yearlyData}
                aria-label="Year-over-year growth analysis showing signups, applicants, accepted students, and registered students with acceptance rates"
              />
            </div>

            {/* Chart 2: Funnel Efficiency (Last 12 Months) */}
            <div id="funnel-chart">
              <FunnelEfficiencyChart 
                data={processedMetrics.funnelData}
                allTimeRegistrationRate={insights.allTimeStats.registrationRate}
                aria-label="Conversion funnel showing how signups progress through application stages"
              />
            </div>

            {/* Chart 3: Success vs Volume Correlation */}
            <QualityQuantityChart 
              data={processedMetrics.correlationData}
              aria-label="Scatter plot showing correlation between application volume and acceptance rate"
            />

            {/* Chart 4: Seasonal Patterns */}
            <SeasonalPatternChart 
              data={processedMetrics.seasonalData}
              aria-label="Bar chart showing average monthly performance across all years"
            />

            {/* Chart 5: Multi-Metric Performance Radar */}
            <PerformanceScorecardChart 
              data={processedMetrics.radarData}
              aria-label="Radar chart showing multi-dimensional performance metrics for last 6 months"
            />
          </div>

          {/* Footer - Accessibility Statement */}
          <footer className="mt-12 text-center text-gray-400 text-sm" role="contentinfo">
            <p>
              Dashboard designed with accessibility in mind. 
              Use <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600">Tab</kbd> to navigate, 
              <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600">Enter</kbd> to interact.
            </p>
            <p className="mt-2">
              <strong className="text-purple-400">✨ New:</strong> Press 
              <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600 ml-1">Ctrl</kbd> + 
              <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600">Shift</kbd> + 
              <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-600">A</kbd> for accessibility settings
            </p>
            <p className="mt-2">Need help? Contact IT Support at support@techbridge.edu.gh</p>
          </footer>
        </main>
      </div>

      {/* Phase 3: Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        stats={insights?.allTimeStats}
      />

      {/* Phase 3: Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={currentFilters}
      />

      {/* Phase 3: Admin Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onDataImport={handleDataImport}
        currentData={data}
      />
    </div>
  );
};

export default AdvancedAnalytics;
