import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TimeSeriesChart } from './charts/TimeSeriesChart';
import { ConversionRateChart } from './charts/ConversionRateChart';
import { DonutChart } from './charts/DonutChart';
import { TrendlineControls } from './TrendlineControls';
import { TrendlineOptions } from '@/utils/trendlines';

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
}

export function Dashboard() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [timeRange, setTimeRange] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<FunnelData | null>(null);
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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (data) {
      filterDataByTimeRange();
    }
  }, [data, timeRange]);
  
const loadData = async () => {
  try {
    // Corrected line:
    // It now uses Vite's BASE_URL to build the correct path automatically,
    // ensuring it works correctly after deployment.
    const response = await fetch(`${import.meta.env.BASE_URL}funnel-data.json`);
    
    // The rest of your function remains the same.
    const funnelData = await response.json();
    setData(funnelData);
  } catch (error) {
    console.error('Error loading data:', error);
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
        startDate = '2017-09'; // Data starts in September 2017
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
        endDate = '2025-06'; // Data ends in June 2025
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

  if (!filteredData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎯 TUC Registration Funnel Analytics
              </h1>
              <p className="text-gray-600">
                Comprehensive analysis of student registration funnel performance
              </p>
              <Badge variant="secondary" className="mt-2">
                {getTimeRangeLabel()} • Last updated: 6/6/2025
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  {/* Multi-year ranges */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Multi-Year Ranges
                  </div>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <span>📊 All Data (2017-2025)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2020-2025">
                    <div className="flex items-center gap-2">
                      <span>📈 2020-2025</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="recent">
                    <div className="flex items-center gap-2">
                      <span>🔥 Recent (2022-2025)</span>
                    </div>
                  </SelectItem>
                  
                  {/* Separator */}
                  <div className="h-px bg-gray-200 my-2 mx-2"></div>
                  
                  {/* Individual years */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Individual Years
                  </div>
                  <SelectItem value="2017">
                    <div className="flex items-center gap-2">
                      <span>2017</span>
                      <span className="text-xs text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                        Sep-Dec
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2018">
                    <div className="flex items-center gap-2">
                      <span>2018</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Full Year
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2019">
                    <div className="flex items-center gap-2">
                      <span>2019</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Full Year
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2020">
                    <div className="flex items-center gap-2">
                      <span>2020</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Full Year
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2021">
                    <div className="flex items-center gap-2">
                      <span>2021</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Full Year
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2022">
                    <div className="flex items-center gap-2">
                      <span>2022</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Full Year
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2023">
                    <div className="flex items-center gap-2">
                      <span>2023</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Full Year
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2024">
                    <div className="flex items-center gap-2">
                      <span>2024</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        Full Year
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2025">
                    <div className="flex items-center gap-2">
                      <span>2025</span>
                      <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                        Jan-Jun
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Student Lifecycle Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎓 Student Lifecycle Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="text-2xl font-bold text-blue-700">1. SIGNUP</div>
                <div className="text-sm text-blue-600">Initial interest - person signs up</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="text-2xl font-bold text-green-700">2. APPLICANT</div>
                <div className="text-sm text-green-600">Submits formal application</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                <div className="text-2xl font-bold text-teal-700">3. ACCEPTED</div>
                <div className="text-sm text-teal-600">Gets accepted to program</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                <div className="text-2xl font-bold text-emerald-700">4. REGISTERED</div>
                <div className="text-sm text-emerald-600">Completes registration & enrollment</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Signups</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {filteredData.totalMetrics.totalSignups.toLocaleString()}
                  </p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-3xl font-bold text-green-700">
                    {filteredData.totalMetrics.totalApplicants.toLocaleString()}
                  </p>
                </div>
                <div className="text-3xl">📄</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-teal-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-3xl font-bold text-teal-700">
                    {filteredData.totalMetrics.totalAccepted.toLocaleString()}
                  </p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">REGISTERED</p>
                  <p className="text-3xl font-bold text-emerald-700">
                    {filteredData.totalMetrics.totalRegistered.toLocaleString()}
                  </p>
                </div>
                <div className="text-3xl">🎓</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Signup → Application</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredData.conversionRates.signupToApplication}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Application → Acceptance</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredData.conversionRates.applicationToAcceptance}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Acceptance → Registration</p>
              <p className="text-2xl font-bold text-teal-600">
                {filteredData.conversionRates.acceptanceToRegistration}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Overall Conversion</p>
              <p className="text-2xl font-bold text-emerald-600">
                {filteredData.totalMetrics.overallConversionRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trendline Controls */}
        <TrendlineControls
          showTrendlines={showTrendlines}
          onToggleTrendlines={setShowTrendlines}
          trendlineOptions={trendlineOptions}
          onOptionsChange={setTrendlineOptions}
          activeTrendlines={activeTrendlines}
          onActiveTrendlinesChange={setActiveTrendlines}
        />

        {/* Charts */}
        <div className="space-y-6">
          {/* Time Series Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📈 TUC Registration Funnel ({getTimeRangeLabel()})</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart
                data={filteredData.timeSeriesData}
                showTrendlines={showTrendlines}
                trendlineOptions={trendlineOptions}
                activeTrendlines={activeTrendlines}
              />
            </CardContent>
          </Card>

          {/* Conversion Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Signup to Application Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ConversionRateChart
                data={filteredData.timeSeriesData}
                showTrendlines={showTrendlines}
                trendlineOptions={trendlineOptions}
              />
            </CardContent>
          </Card>

          {/* Donut Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🔄 Signup to Application Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { 
                      label: 'Applied', 
                      value: filteredData.totalMetrics.totalApplicants, 
                      color: '#10B981' 
                    },
                    { 
                      label: 'Did Not Apply', 
                      value: filteredData.totalMetrics.signupsNeverApplied, 
                      color: '#EF4444' 
                    }
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Final Outcomes Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { 
                      label: 'Registered', 
                      value: filteredData.totalMetrics.totalRegistered, 
                      color: '#10B981' 
                    },
                    { 
                      label: 'Accepted Not Registered', 
                      value: filteredData.totalMetrics.acceptedNotRegistered, 
                      color: '#F59E0B' 
                    },
                    { 
                      label: 'Rejected', 
                      value: filteredData.totalMetrics.signupsNeverApplied, 
                      color: '#EF4444' 
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Insights */}
        <Card>
          <CardHeader>
            <CardTitle>⏳ REGISTERED Student Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700 mb-2">
                  {filteredData.totalMetrics.totalRegistered}
                </div>
                <div className="text-sm font-medium text-green-600">Registration Success</div>
                <div className="text-xs text-green-500 mt-1">
                  Successfully completed the entire funnel
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700 mb-2">
                  {filteredData.totalMetrics.acceptedNotRegistered}
                </div>
                <div className="text-sm font-medium text-orange-600">Accepted Not Registered</div>
                <div className="text-xs text-orange-500 mt-1">
                  Opportunity for follow-up and conversion
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700 mb-2">
                  {filteredData.totalMetrics.overallConversionRate}%
                </div>
                <div className="text-sm font-medium text-blue-600">Overall Funnel Performance</div>
                <div className="text-xs text-blue-500 mt-1">
                  End-to-end conversion rate over {filteredData.timeSeriesData.length} months
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
