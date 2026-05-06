import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    Award,
    BarChart3,
    Calendar,
    Clock,
    Database,
    Download,
    Info,
    Lock,
    RefreshCw,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Import existing chart components

// Import new enhanced components
import { AdminPanel } from './AdminPanel';
import { AboutTab } from './tabs/AboutTab';
import { CorrectedMultiPartyDemographicsTab } from './tabs/CorrectedMultiPartyDemographicsTab';
import { ExportTab } from './tabs/ExportTab';
import { FunnelAnalysisTab } from './tabs/FunnelAnalysisTab';
import { OverviewTab } from './tabs/OverviewTab';
import { SeasonalTab } from './tabs/SeasonalTab';
import { TrendsTab } from './tabs/TrendsTab';
import { ThemeToggle } from './ThemeToggle';

import { TrendlineOptions } from '@/utils/trendlines';

interface EnhancedDemographicData {
  metadata: {
    processing_date: string;
    total_records_processed: number;
    privacy_protection_applied: boolean;
    k_anonymity_level: number;
    data_sources: Record<string, number>;
  };
  demographic_insights: {
    total_applicants_analyzed: number;
    regional_representation: Record<string, {
      count: number;
      percentage: number;
      status_distribution: Record<string, number>;
      year_distribution: Record<string, number>;
    }>;
    international_metrics: {
      total_international: number;
      percentage_international: number;
      countries_represented: number;
      international_acceptance_rate: number;
    };
    diversity_metrics: {
      regions_represented: number;
      countries_represented: number;
      geographic_concentration: number;
      international_diversity_index: number;
    };
    access_patterns: Record<string, {
      mobile_access_rate: number;
      landline_access_rate: number;
      communication_completeness: number;
    }>;
  };
  geographic_analytics: {
    state_distribution: Record<string, number>;
    city_cluster_distribution: Record<string, number>;
    international_vs_domestic: Record<string, number>;
    conversion_by_region: Record<string, Record<string, number>>;
    conversion_rates_by_region: Record<string, number>;
    total_regions: number;
    most_represented_region: string;
  };
  communication_patterns: {
    country_code_distribution: Record<string, number>;
    country_names_distribution: Record<string, number>;
    mobile_usage: Record<string, number>;
    landline_usage: Record<string, number>;
  };
}

interface CorrectedDemographicData {
  metadata: {
    processing_date: string;
    analysis_type: string;
    critical_correction: string;
    data_sources_properly_separated: boolean;
  };
  student_demographics: {
    total_students: number;
    residence_distribution: Record<string, number>;
    student_international_analysis: Record<string, number>;
    true_international_students: {
      domestic_students_percentage: number;
      international_students_percentage: number;
      primary_international_origin: string;
    };
    student_communication_access: {
      mobile_access_rate: number;
      landline_access_rate: number;
    };
  };
  sponsor_guardian_demographics: {
    total_sponsor_guardians: number;
    geographic_distribution: Record<string, number>;
    country_distribution: Record<string, number>;
    international_analysis: Record<string, number>;
    domestic_vs_international_support: {
      domestic_percentage: number;
      international_percentage: number;
    };
  };
  multi_party_insights: any;
}

interface FunnelData {
  timeSeriesData: Array<{
    month: string;
    signups: number;
    applicants: number;
    accepted: number;
    registered: number;
  }>;
  totalMetrics: {
    totalSignups: number;
    totalApplicants: number;
    totalAccepted: number;
    totalRegistered: number;
    acceptedNotRegistered: number;
    signupsNeverApplied: number;
    overallConversionRate: number;
  };
  conversionRates: {
    signupToApplication: number;
    applicationToAcceptance: number;
    acceptanceToRegistration: number;
  };
  funnelBreakdown: {
    registered: number;
    acceptedNotRegistered: number;
    rejected: number;
    waitlisted: number;
  };
  enhanced_demographics?: EnhancedDemographicData | null; // Allow null
  corrected_multi_party_demographics?: CorrectedDemographicData;
  important_correction?: {
    correction_date: string;
    correction_reason: string;
    corrected_analysis: string;
    key_finding: string;
  };
}

export function EnhancedDashboard() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<FunnelData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showTrendlines, setShowTrendlines] = useState<boolean>(false);
  const [trendlineOptions, setTrendlineOptions] = useState<TrendlineOptions>({
    type: 'linear'
  });
  const [activeTrendlines, setActiveTrendlines] = useState<{
    signups: boolean;
    applicants: boolean;
    accepted: boolean;
    registered: boolean;
  }>({
    signups: true,
    applicants: true,
    accepted: true,
    registered: true
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataStatus, setDataStatus] = useState<'live' | 'cached' | 'offline'>('live');
  const [geographicFilter, setGeographicFilter] = useState<string>('all');
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  useEffect(() => {
    loadData();
    setLastUpdated(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    if (data) {
      filterDataByTimeRange();
    }
  }, [data, timeRange]);

  // THIS IS THE FINAL CORRECTED FUNCTION
  const loadData = async () => {
    try {
      setIsLoading(true);

      // FINAL CORRECTED PATH 1: Adds the 'data/' folder back.
      const funnelResponse = await fetch(`${import.meta.env.BASE_URL}data/funnel-data.json`);
      const funnelData = await funnelResponse.json();

      // Load CORRECTED multi-party demographic data
      try {
        // FINAL CORRECTED PATH 2: Adds the 'data/' folder back.
        const correctedDemographicResponse = await fetch(`${import.meta.env.BASE_URL}data/corrected_multi_party_demographics.json`);
        const correctedDemographicData = await correctedDemographicResponse.json();

        // Add critical correction information
        funnelData.important_correction = {
          correction_date: "2025-06-08",
          correction_reason: "Previous analysis incorrectly mixed student and sponsor/guardian data",
          corrected_analysis: "Students: 96.9% domestic, 3.1% international. Sponsors/guardians provide international support network.",
          key_finding: "TUC is primarily a domestic Ghanaian institution with a global family support network"
        };

        // Merge corrected demographic data with funnel data
        funnelData.corrected_multi_party_demographics = correctedDemographicData;

        // Keep legacy field for backward compatibility but mark as deprecated
        funnelData.enhanced_demographics = null;

      } catch (demographicError) {
        console.warn('Corrected demographic data not available:', demographicError);
        // Continue without demographic data
      }

      setData(funnelData);
      setDataStatus('live');
    } catch (error) {
      console.error('Error loading main data:', error);
      setDataStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDataByTimeRange = () => {
    if (!data) return;

    let startDate: string;
    let endDate: string;

    switch (timeRange) {
      case 'recent':
        startDate = '2022-01';
        endDate = '2025-06';
        break;
      case '2020-2025':
        startDate = '2020-01';
        endDate = '2025-06';
        break;
      case 'all':
        startDate = '2017-09';
        endDate = '2025-06';
        break;
      // Individual year selections
      case '2017':
        startDate = '2017-09';
        endDate = '2017-12';
        break;
      case '2018':
        startDate = '2018-01';
        endDate = '2018-12';
        break;
      case '2019':
        startDate = '2019-01';
        endDate = '2019-12';
        break;
      case '2020':
        startDate = '2020-01';
        endDate = '2020-12';
        break;
      case '2021':
        startDate = '2021-01';
        endDate = '2021-12';
        break;
      case '2022':
        startDate = '2022-01';
        endDate = '2022-12';
        break;
      case '2023':
        startDate = '2023-01';
        endDate = '2023-12';
        break;
      case '2024':
        startDate = '2024-01';
        endDate = '2024-12';
        break;
      case '2025':
        startDate = '2025-01';
        endDate = '2025-06';
        break;
      default:
        startDate = '2017-09';
        endDate = '2025-06';
        break;
    }

    const filtered = {
      ...data,
      timeSeriesData: data.timeSeriesData.filter(
        item => item.month >= startDate && item.month <= endDate
      )
    };

    // Recalculate totals for filtered data
    const totals = filtered.timeSeriesData.reduce(
      (acc, item) => ({
        totalSignups: acc.totalSignups + item.signups,
        totalApplicants: acc.totalApplicants + item.applicants,
        totalAccepted: acc.totalAccepted + item.accepted,
        totalRegistered: acc.totalRegistered + item.registered
      }),
      { totalSignups: 0, totalApplicants: 0, totalAccepted: 0, totalRegistered: 0 }
    );

    filtered.totalMetrics = {
      ...totals,
      acceptedNotRegistered: totals.totalAccepted - totals.totalRegistered,
      signupsNeverApplied: totals.totalSignups - totals.totalApplicants,
      overallConversionRate: totals.totalSignups > 0
        ? Number(((totals.totalRegistered / totals.totalSignups) * 100).toFixed(1))
        : 0
    };

    filtered.conversionRates = {
      signupToApplication: totals.totalSignups > 0
        ? Number(((totals.totalApplicants / totals.totalSignups) * 100).toFixed(1))
        : 0,
      applicationToAcceptance: totals.totalApplicants > 0
        ? Number(((totals.totalAccepted / totals.totalApplicants) * 100).toFixed(1))
        : 0,
      acceptanceToRegistration: totals.totalAccepted > 0
        ? Number(((totals.totalRegistered / totals.totalAccepted) * 100).toFixed(1))
        : 0
    };

    setFilteredData(filtered);
  };

  const getTimeRangeLabel = () => {
    if (!filteredData?.timeSeriesData.length) return '';
    const start = filteredData.timeSeriesData[0].month;
    const end = filteredData.timeSeriesData[filteredData.timeSeriesData.length - 1].month;
    const months = filteredData.timeSeriesData.length;
    return `${start} to ${end} (${months} months)`;
  };

  const refreshData = async () => {
    await loadData();
    setLastUpdated(new Date().toLocaleString());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md">Skip to main content</a>
      {/* Enhanced Header */}
      <header role="banner" aria-label="TUC Analytics Dashboard header" className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  TUC Registration Funnel Analytics
                </h1>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-gray-600">
                    Comprehensive Student Enrollment Analytics Dashboard
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Real Institutional Data
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    Privacy Compliant
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Data Status Indicators */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  dataStatus === 'live' ? 'bg-green-500' :
                  dataStatus === 'cached' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600 capitalize">{dataStatus}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdminPanel(true)}
                className="flex items-center gap-2"
                aria-label="Open admin panel"
                title="Open admin panel"
              >
                <Lock className="w-4 h-4" aria-hidden="true" />
                Admin
              </Button>
              
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Updated: {lastUpdated}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                aria-label="Refresh dashboard data"
                className="flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time Range:</span>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48" aria-label="Select time range">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data (2017-2025)</SelectItem>
                <SelectItem value="recent">Recent (2022-2025)</SelectItem>
                <SelectItem value="2020-2025">Post-2020</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
              </SelectContent>
            </Select>
            
            {timeRange !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                {getTimeRangeLabel()}
              </Badge>
            )}
          </div>

          {/* Geographic Filter - Corrected for Student vs Sponsor/Guardian */}
          {data?.corrected_multi_party_demographics && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Data View:</span>
              </div>
              
              <Select value={geographicFilter} onValueChange={setGeographicFilter}>
                <SelectTrigger className="w-56" aria-label="Select data view">
                  <SelectValue placeholder="Select data view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="students_only">Students Only (Corrected)</SelectItem>
                  <SelectItem value="support_network">Support Network</SelectItem>
                  <SelectItem value="ACCRA_REGION">Accra Region Students</SelectItem>
                  <SelectItem value="OTHER_REGION">Other Region Students</SelectItem>
                  <SelectItem value="domestic_students">Domestic Students (96.9%)</SelectItem>
                  <SelectItem value="international_students">International Students (3.1%)</SelectItem>
                </SelectContent>
              </Select>
              
              {geographicFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  View: {geographicFilter.replace('_', ' ').replace('REGION', 'Region')}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                {filteredData?.totalMetrics.totalSignups.toLocaleString()} Total Signups
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {filteredData?.totalMetrics.overallConversionRate}% Conversion Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6 bg-white p-1 rounded-lg shadow-sm border">
            <TabsTrigger
              value="overview"
              className="relative flex items-center justify-center space-x-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Activity className="h-4 w-4" />
              <span>Overview</span>
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-100 text-blue-800"
              >
                1
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger
              value="funnel"
              className="relative flex items-center justify-center space-x-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Funnel</span>
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-green-100 text-green-800"
              >
                2
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger
              value="trends"
              className="relative flex items-center justify-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Trends</span>
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-purple-100 text-purple-800"
              >
                3
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger
              value="demographics"
              className="relative flex items-center justify-center space-x-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4" />
              <span>Demographics</span>
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-orange-100 text-orange-800"
              >
                4
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger
              value="seasonal"
              className="relative flex items-center justify-center space-x-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4" />
              <span>Seasonal</span>
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-teal-100 text-teal-800"
              >
                5
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger
              value="export"
              className="relative flex items-center justify-center space-x-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-indigo-100 text-indigo-800"
              >
                6
              </Badge>
            </TabsTrigger>
            
            <TabsTrigger
              value="about"
              className="relative flex items-center justify-center space-x-2 data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gray-100 text-gray-800"
              >
                7
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview">
            <OverviewTab
              data={filteredData}
              timeRange={timeRange}
              showTrendlines={showTrendlines}
              setShowTrendlines={setShowTrendlines}
              trendlineOptions={trendlineOptions}
              setTrendlineOptions={setTrendlineOptions}
              activeTrendlines={activeTrendlines}
              setActiveTrendlines={setActiveTrendlines}
            />
          </TabsContent>

          <TabsContent value="funnel">
            <FunnelAnalysisTab data={filteredData} />
          </TabsContent>

          <TabsContent value="trends">
            <TrendsTab
              data={filteredData}
              showTrendlines={showTrendlines}
              setShowTrendlines={setShowTrendlines}
              trendlineOptions={trendlineOptions}
              setTrendlineOptions={setTrendlineOptions}
              activeTrendlines={activeTrendlines}
              setActiveTrendlines={setActiveTrendlines}
            />
          </TabsContent>

          <TabsContent value="demographics">
            <CorrectedMultiPartyDemographicsTab data={filteredData} />
          </TabsContent>

          <TabsContent value="seasonal">
            <SeasonalTab data={filteredData} />
          </TabsContent>

          <TabsContent value="export">
            <ExportTab data={filteredData} timeRange={timeRange} />
          </TabsContent>

          <TabsContent value="about">
            <AboutTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                TUC Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Advanced university admissions analytics providing comprehensive insights
                into student enrollment patterns and conversion optimization.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Coverage
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Registration Funnel Analysis</li>
                <li>• Conversion Rate Optimization</li>
                <li>• Seasonal Pattern Analysis</li>
                <li>• Demographic Insights</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Status
              </h3>
              <div className="text-gray-600 text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Analytics Engine: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Data Pipeline: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Export Services: Available</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Techbridge University College. Advanced University Analytics Dashboard.
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </footer>
      
      {/* Admin Panel Modal */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  );
}