import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Snowflake,
  Sun,
  Leaf,
  Flower,
  TrendingUp,
  TrendingDown,
  BarChart,
  Clock,
  Target
} from 'lucide-react';

import { TimeSeriesChart } from '../charts/TimeSeriesChart';
import { DonutChart } from '../charts/DonutChart';

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
}

interface SeasonalTabProps {
  data: FunnelData | null;
}

export function SeasonalTab({ data }: SeasonalTabProps) {
  const [viewType, setViewType] = useState<string>('quarterly');
  const [selectedMetric, setSelectedMetric] = useState<string>('signups');

  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  // Seasonal analysis functions
  const getSeasonFromMonth = (month: string) => {
    const monthNum = parseInt(month.split('-')[1]);
    if (monthNum >= 3 && monthNum <= 5) return 'Spring';
    if (monthNum >= 6 && monthNum <= 8) return 'Summer';
    if (monthNum >= 9 && monthNum <= 11) return 'Fall';
    return 'Winter';
  };

  const getQuarterFromMonth = (month: string) => {
    const monthNum = parseInt(month.split('-')[1]);
    if (monthNum >= 1 && monthNum <= 3) return 'Q1';
    if (monthNum >= 4 && monthNum <= 6) return 'Q2';
    if (monthNum >= 7 && monthNum <= 9) return 'Q3';
    return 'Q4';
  };

  const getAcademicSemesterFromMonth = (month: string) => {
    const monthNum = parseInt(month.split('-')[1]);
    if (monthNum >= 1 && monthNum <= 5) return 'Spring Semester';
    if (monthNum >= 6 && monthNum <= 8) return 'Summer Term';
    return 'Fall Semester';
  };

  // Calculate seasonal aggregations
  const calculateSeasonalData = () => {
    const seasonal = {
      seasons: {} as any,
      quarters: {} as any,
      semesters: {} as any,
      months: {} as any
    };

    // Initialize structures
    ['Spring', 'Summer', 'Fall', 'Winter'].forEach(season => {
      seasonal.seasons[season] = { signups: 0, applicants: 0, accepted: 0, registered: 0, count: 0 };
    });

    ['Q1', 'Q2', 'Q3', 'Q4'].forEach(quarter => {
      seasonal.quarters[quarter] = { signups: 0, applicants: 0, accepted: 0, registered: 0, count: 0 };
    });

    ['Spring Semester', 'Summer Term', 'Fall Semester'].forEach(semester => {
      seasonal.semesters[semester] = { signups: 0, applicants: 0, accepted: 0, registered: 0, count: 0 };
    });

    for (let i = 1; i <= 12; i++) {
      const monthName = new Date(2024, i - 1, 1).toLocaleString('default', { month: 'long' });
      seasonal.months[monthName] = { signups: 0, applicants: 0, accepted: 0, registered: 0, count: 0 };
    }

    // Aggregate data
    data.timeSeriesData.forEach(item => {
      const season = getSeasonFromMonth(item.month);
      const quarter = getQuarterFromMonth(item.month);
      const semester = getAcademicSemesterFromMonth(item.month);
      const monthName = new Date(item.month + '-01').toLocaleString('default', { month: 'long' });

      // Update all aggregations
      [seasonal.seasons[season], seasonal.quarters[quarter], 
       seasonal.semesters[semester], seasonal.months[monthName]].forEach(bucket => {
        bucket.signups += item.signups;
        bucket.applicants += item.applicants;
        bucket.accepted += item.accepted;
        bucket.registered += item.registered;
        bucket.count += 1;
      });
    });

    // Calculate averages
    Object.keys(seasonal.seasons).forEach(key => {
      const bucket = seasonal.seasons[key];
      if (bucket.count > 0) {
        bucket.avgSignups = bucket.signups / bucket.count;
        bucket.avgApplicants = bucket.applicants / bucket.count;
        bucket.avgAccepted = bucket.accepted / bucket.count;
        bucket.avgRegistered = bucket.registered / bucket.count;
        bucket.conversionRate = bucket.signups > 0 ? (bucket.registered / bucket.signups) * 100 : 0;
      }
    });

    Object.keys(seasonal.quarters).forEach(key => {
      const bucket = seasonal.quarters[key];
      if (bucket.count > 0) {
        bucket.avgSignups = bucket.signups / bucket.count;
        bucket.avgApplicants = bucket.applicants / bucket.count;
        bucket.avgAccepted = bucket.accepted / bucket.count;
        bucket.avgRegistered = bucket.registered / bucket.count;
        bucket.conversionRate = bucket.signups > 0 ? (bucket.registered / bucket.signups) * 100 : 0;
      }
    });

    Object.keys(seasonal.semesters).forEach(key => {
      const bucket = seasonal.semesters[key];
      if (bucket.count > 0) {
        bucket.avgSignups = bucket.signups / bucket.count;
        bucket.avgApplicants = bucket.applicants / bucket.count;
        bucket.avgAccepted = bucket.accepted / bucket.count;
        bucket.avgRegistered = bucket.registered / bucket.count;
        bucket.conversionRate = bucket.signups > 0 ? (bucket.registered / bucket.signups) * 100 : 0;
      }
    });

    Object.keys(seasonal.months).forEach(key => {
      const bucket = seasonal.months[key];
      if (bucket.count > 0) {
        bucket.avgSignups = bucket.signups / bucket.count;
        bucket.avgApplicants = bucket.applicants / bucket.count;
        bucket.avgAccepted = bucket.accepted / bucket.count;
        bucket.avgRegistered = bucket.registered / bucket.count;
        bucket.conversionRate = bucket.signups > 0 ? (bucket.registered / bucket.signups) * 100 : 0;
      }
    });

    return seasonal;
  };

  const seasonalData = calculateSeasonalData();

  // Find peak and low periods
  const findPeakPeriods = () => {
    const currentData = viewType === 'quarterly' ? seasonalData.quarters : 
                       viewType === 'seasonal' ? seasonalData.seasons :
                       viewType === 'academic' ? seasonalData.semesters : seasonalData.months;

    const metric = selectedMetric === 'signups' ? 'avgSignups' :
                   selectedMetric === 'applicants' ? 'avgApplicants' :
                   selectedMetric === 'accepted' ? 'avgAccepted' : 'avgRegistered';

    const periods = Object.entries(currentData)
      .filter(([_, values]: [string, any]) => values.count > 0)
      .map(([period, values]: [string, any]) => ({
        period,
        value: values[metric],
        total: values[selectedMetric],
        conversion: values.conversionRate
      }))
      .sort((a, b) => b.value - a.value);

    return {
      peak: periods[0],
      low: periods[periods.length - 1],
      all: periods
    };
  };

  const peakAnalysis = findPeakPeriods();

  // Generate chart data for current view
  const generateChartData = () => {
    const currentData = viewType === 'quarterly' ? seasonalData.quarters : 
                       viewType === 'seasonal' ? seasonalData.seasons :
                       viewType === 'academic' ? seasonalData.semesters : seasonalData.months;

    return Object.entries(currentData)
      .filter(([_, values]: [string, any]) => values.count > 0)
      .map(([period, values]: [string, any]) => ({
        label: period,
        value: values[selectedMetric] || 0,
        color: getColorForPeriod(period)
      }));
  };

  const getColorForPeriod = (period: string) => {
    if (period.includes('Spring') || period === 'Q1') return '#10b981';
    if (period.includes('Summer') || period === 'Q2') return '#f59e0b';
    if (period.includes('Fall') || period === 'Q3') return '#ef4444';
    if (period.includes('Winter') || period === 'Q4') return '#3b82f6';
    return '#6b7280';
  };

  const getSeasonIcon = (season: string) => {
    if (season.includes('Spring')) return <Flower className="h-4 w-4 text-green-500" />;
    if (season.includes('Summer')) return <Sun className="h-4 w-4 text-yellow-500" />;
    if (season.includes('Fall')) return <Leaf className="h-4 w-4 text-orange-500" />;
    if (season.includes('Winter')) return <Snowflake className="h-4 w-4 text-blue-500" />;
    return <Calendar className="h-4 w-4 text-gray-500" />;
  };

  const chartData = generateChartData();

  return (
    <div className="space-y-6">
      {/* Seasonal Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-teal-600" />
            <span>Seasonal Pattern Analysis</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Analyse enrollment patterns across different time periods to identify seasonal trends and optimize recruitment strategies
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Time Period View
              </label>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seasonal">Seasons (Spring, Summer, Fall, Winter)</SelectItem>
                  <SelectItem value="quarterly">Quarters (Q1, Q2, Q3, Q4)</SelectItem>
                  <SelectItem value="academic">Academic Terms</SelectItem>
                  <SelectItem value="monthly">Monthly Average</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Focus Metric
              </label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signups">Signups</SelectItem>
                  <SelectItem value="applicants">Applications</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <Badge variant="outline" className="w-full justify-center">
                  {peakAnalysis.all.length} periods analyzed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Performance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Peak Period</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {getSeasonIcon(peakAnalysis.peak?.period || '')}
                <span className="text-lg font-semibold text-gray-900">
                  {peakAnalysis.peak?.period}
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {peakAnalysis.peak ? formatNumber(Math.round(peakAnalysis.peak.value)) : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">
                Average {selectedMetric} per month
              </p>
              <Badge variant="default" className="bg-green-600">
                {peakAnalysis.peak ? formatPercentage(peakAnalysis.peak.conversion) : '0%'} conversion
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span>Low Period</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {getSeasonIcon(peakAnalysis.low?.period || '')}
                <span className="text-lg font-semibold text-gray-900">
                  {peakAnalysis.low?.period}
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {peakAnalysis.low ? formatNumber(Math.round(peakAnalysis.low.value)) : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">
                Average {selectedMetric} per month
              </p>
              <Badge variant="destructive">
                {peakAnalysis.low ? formatPercentage(peakAnalysis.low.conversion) : '0%'} conversion
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              <span>Seasonal Variance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-blue-600">
                {peakAnalysis.peak && peakAnalysis.low ? 
                  formatPercentage(((peakAnalysis.peak.value - peakAnalysis.low.value) / peakAnalysis.low.value) * 100) : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">
                Peak vs. Low difference
              </p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Range: {peakAnalysis.low ? Math.round(peakAnalysis.low.value) : 0}</span>
                <span>to {peakAnalysis.peak ? Math.round(peakAnalysis.peak.value) : 0}</span>
              </div>
              <Badge variant="outline">
                {peakAnalysis.peak && peakAnalysis.low && 
                 ((peakAnalysis.peak.value - peakAnalysis.low.value) / peakAnalysis.low.value) > 0.5 ? 
                 'High Seasonality' : 'Moderate Seasonality'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>{viewType.charAt(0).toUpperCase() + viewType.slice(1)} Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={chartData}

            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Performance Ranking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakAnalysis.all.map((period, index) => (
                <div key={period.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      {getSeasonIcon(period.period)}
                      <span className="font-medium text-gray-900">{period.period}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(Math.round(period.value))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPercentage(period.conversion)} conv.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Seasonal Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <span>Comprehensive Seasonal Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Period</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Signups</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Applications</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Accepted</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg Registered</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversion Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Data Points</th>
                </tr>
              </thead>
              <tbody>
                {peakAnalysis.all.map((period, index) => {
                  const currentData = viewType === 'quarterly' ? seasonalData.quarters : 
                                     viewType === 'seasonal' ? seasonalData.seasons :
                                     viewType === 'academic' ? seasonalData.semesters : seasonalData.months;
                  const data = currentData[period.period];
                  
                  return (
                    <tr key={period.period} className={`border-b border-gray-100 ${index === 0 ? 'bg-green-50' : index === peakAnalysis.all.length - 1 ? 'bg-red-50' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getSeasonIcon(period.period)}
                          <span className="font-medium">{period.period}</span>
                          {index === 0 && <Badge variant="default" className="text-xs bg-green-600">Peak</Badge>}
                          {index === peakAnalysis.all.length - 1 && <Badge variant="destructive" className="text-xs">Low</Badge>}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">{data ? Math.round(data.avgSignups) : 0}</td>
                      <td className="text-right py-3 px-4">{data ? Math.round(data.avgApplicants) : 0}</td>
                      <td className="text-right py-3 px-4">{data ? Math.round(data.avgAccepted) : 0}</td>
                      <td className="text-right py-3 px-4">{data ? Math.round(data.avgRegistered) : 0}</td>
                      <td className="text-right py-3 px-4">{data ? formatPercentage(data.conversionRate) : '0%'}</td>
                      <td className="text-right py-3 px-4">{data ? data.count : 0} months</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Insights and Recommendations */}
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-teal-600" />
            <span>Seasonal Optimization Strategies</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>Peak Period Optimization</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Maximize marketing spend during {peakAnalysis.peak?.period}</li>
                <li>• Increase admission staff capacity</li>
                <li>• Prepare for higher application volumes</li>
                <li>• Fast-track processing during peak times</li>
                <li>• Launch targeted campaigns 1-2 months prior</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span>Low Period Recovery</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Develop off-season marketing strategies</li>
                <li>• Offer incentives during {peakAnalysis.low?.period}</li>
                <li>• Focus on international student recruitment</li>
                <li>• Promote flexible start dates</li>
                <li>• Use low periods for process improvement</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Year-Round Strategy</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Smooth enrollment cycles with continuous intake</li>
                <li>• Develop season-specific program offerings</li>
                <li>• Plan recruitment events around peak periods</li>
                <li>• Adjust conversion expectations by season</li>
                <li>• Create seasonal marketing content calendars</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
