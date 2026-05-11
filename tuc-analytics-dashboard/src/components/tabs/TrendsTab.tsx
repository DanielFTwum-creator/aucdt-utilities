import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Activity,
  Target,
  Calendar,
  Zap
} from 'lucide-react';

import { TimeSeriesChart } from '../charts/TimeSeriesChart';
import { TrendlineControls } from '../TrendlineControls';
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
}

interface TrendsTabProps {
  data: FunnelData | null;
  showTrendlines: boolean;
  setShowTrendlines: (show: boolean) => void;
  trendlineOptions: TrendlineOptions;
  setTrendlineOptions: (options: TrendlineOptions) => void;
  activeTrendlines: {
    signups: boolean;
    applicants: boolean;
    accepted: boolean;
    registered: boolean;
  };
  setActiveTrendlines: (trendlines: {
    signups: boolean;
    applicants: boolean;
    accepted: boolean;
    registered: boolean;
  }) => void;
}

export function TrendsTab({
  data,
  showTrendlines,
  setShowTrendlines,
  trendlineOptions,
  setTrendlineOptions,
  activeTrendlines,
  setActiveTrendlines
}: TrendsTabProps) {
  const [selectedMetric, setSelectedMetric] = useState<string>('all');
  const [forecastPeriods, setForecastPeriods] = useState<number>(6);
  const [showForecast, setShowForecast] = useState<boolean>(false);

  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num}%`;

  // Calculate trend analysis
  const calculateTrendAnalysis = () => {
    if (data.timeSeriesData.length < 2) return null;

    const firstHalf = data.timeSeriesData.slice(0, Math.floor(data.timeSeriesData.length / 2));
    const secondHalf = data.timeSeriesData.slice(Math.floor(data.timeSeriesData.length / 2));

    const firstHalfAvg = {
      signups: firstHalf.reduce((sum, item) => sum + item.signups, 0) / firstHalf.length,
      applicants: firstHalf.reduce((sum, item) => sum + item.applicants, 0) / firstHalf.length,
      accepted: firstHalf.reduce((sum, item) => sum + item.accepted, 0) / firstHalf.length,
      registered: firstHalf.reduce((sum, item) => sum + item.registered, 0) / firstHalf.length,
    };

    const secondHalfAvg = {
      signups: secondHalf.reduce((sum, item) => sum + item.signups, 0) / secondHalf.length,
      applicants: secondHalf.reduce((sum, item) => sum + item.applicants, 0) / secondHalf.length,
      accepted: secondHalf.reduce((sum, item) => sum + item.accepted, 0) / secondHalf.length,
      registered: secondHalf.reduce((sum, item) => sum + item.registered, 0) / secondHalf.length,
    };

    return {
      signups: ((secondHalfAvg.signups - firstHalfAvg.signups) / firstHalfAvg.signups) * 100,
      applicants: ((secondHalfAvg.applicants - firstHalfAvg.applicants) / firstHalfAvg.applicants) * 100,
      accepted: ((secondHalfAvg.accepted - firstHalfAvg.accepted) / firstHalfAvg.accepted) * 100,
      registered: ((secondHalfAvg.registered - firstHalfAvg.registered) / firstHalfAvg.registered) * 100,
    };
  };

  const trendAnalysis = calculateTrendAnalysis();

  // Calculate volatility (standard deviation)
  const calculateVolatility = () => {
    const calculateStdDev = (values: number[]) => {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      return Math.sqrt(variance);
    };

    return {
      signups: calculateStdDev(data.timeSeriesData.map(item => item.signups)),
      applicants: calculateStdDev(data.timeSeriesData.map(item => item.applicants)),
      accepted: calculateStdDev(data.timeSeriesData.map(item => item.accepted)),
      registered: calculateStdDev(data.timeSeriesData.map(item => item.registered)),
    };
  };

  const volatility = calculateVolatility();

  // Generate forecast data (simple linear projection)
  const generateForecast = () => {
    if (!showForecast || data.timeSeriesData.length < 3) return [];

    const lastThreeMonths = data.timeSeriesData.slice(-3);
    const avgGrowth = {
      signups: (lastThreeMonths[2].signups - lastThreeMonths[0].signups) / 2,
      applicants: (lastThreeMonths[2].applicants - lastThreeMonths[0].applicants) / 2,
      accepted: (lastThreeMonths[2].accepted - lastThreeMonths[0].accepted) / 2,
      registered: (lastThreeMonths[2].registered - lastThreeMonths[0].registered) / 2,
    };

    const lastMonth = data.timeSeriesData[data.timeSeriesData.length - 1];
    const forecastData = [];

    for (let i = 1; i <= forecastPeriods; i++) {
      const date = new Date(lastMonth.month + '-01');
      date.setMonth(date.getMonth() + i);
      const forecastMonth = date.toISOString().slice(0, 7);

      forecastData.push({
        month: forecastMonth,
        signups: Math.max(0, Math.round(lastMonth.signups + (avgGrowth.signups * i))),
        applicants: Math.max(0, Math.round(lastMonth.applicants + (avgGrowth.applicants * i))),
        accepted: Math.max(0, Math.round(lastMonth.accepted + (avgGrowth.accepted * i))),
        registered: Math.max(0, Math.round(lastMonth.registered + (avgGrowth.registered * i))),
        isForecast: true
      });
    }

    return forecastData;
  };

  const forecastData = generateForecast();

  return (
    <div className="space-y-6">
      {/* Trend Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            <span>Advanced Trend Analysis</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive trendline analysis with forecasting capabilities
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Focus Metric
                </label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metrics</SelectItem>
                    <SelectItem value="signups">Signups Only</SelectItem>
                    <SelectItem value="applicants">Applications Only</SelectItem>
                    <SelectItem value="accepted">Accepted Only</SelectItem>
                    <SelectItem value="registered">Registered Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Forecast Periods
                </label>
                <Select value={forecastPeriods.toString()} onValueChange={(value) => setForecastPeriods(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <TrendlineControls
                showTrendlines={showTrendlines}
                onToggleTrendlines={setShowTrendlines}
                trendlineOptions={trendlineOptions}
                onOptionsChange={setTrendlineOptions}
                activeTrendlines={activeTrendlines}
                onActiveTrendlinesChange={setActiveTrendlines}
              />
            </div>

            <div className="space-y-4">
              <Button
                variant={showForecast ? "default" : "outline"}
                onClick={() => setShowForecast(!showForecast)}
                className="w-full flex items-center space-x-2"
              >
                <Zap className="h-4 w-4" />
                <span>{showForecast ? 'Hide' : 'Show'} Forecast</span>
              </Button>
              
              {showForecast && (
                <Badge variant="secondary" className="w-full justify-center">
                  {forecastPeriods} month projection
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {trendAnalysis && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Signups Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {trendAnalysis.signups >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-lg font-bold ${
                    trendAnalysis.signups >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trendAnalysis.signups >= 0 ? '+' : ''}{trendAnalysis.signups.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Volatility: ±{volatility.signups.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Applications Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {trendAnalysis.applicants >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-lg font-bold ${
                    trendAnalysis.applicants >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trendAnalysis.applicants >= 0 ? '+' : ''}{trendAnalysis.applicants.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Volatility: ±{volatility.applicants.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Accepted Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {trendAnalysis.accepted >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-lg font-bold ${
                    trendAnalysis.accepted >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trendAnalysis.accepted >= 0 ? '+' : ''}{trendAnalysis.accepted.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Volatility: ±{volatility.accepted.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Registrations Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {trendAnalysis.registered >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-lg font-bold ${
                    trendAnalysis.registered >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trendAnalysis.registered >= 0 ? '+' : ''}{trendAnalysis.registered.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Volatility: ±{volatility.registered.toFixed(1)}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              <span>Enhanced Time Series with Trendlines</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{data.timeSeriesData.length} data points</Badge>
              {showForecast && (
                <Badge variant="secondary">+{forecastPeriods} forecast</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart 
            data={showForecast ? [...data.timeSeriesData, ...forecastData] : data.timeSeriesData} 
            showTrendlines={showTrendlines}
            trendlineOptions={trendlineOptions}
            activeTrendlines={activeTrendlines}
          />
        </CardContent>
      </Card>

      {/* Trend Analysis Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Trend Methodology</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Trendline Types</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-blue-500"></div>
                    <span><strong>Linear:</strong> Simple straight-line progression</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-green-500"></div>
                    <span><strong>Polynomial:</strong> Curved trend accounting for acceleration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-purple-500"></div>
                    <span><strong>Moving Average:</strong> Smoothed trend removing noise</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Trend Calculation</h4>
                <p className="text-sm text-gray-600">
                  Trends are calculated by comparing the average of the first half of the dataset 
                  with the second half. Volatility is measured using standard deviation to assess 
                  data consistency.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Forecast Method</h4>
                <p className="text-sm text-gray-600">
                  Linear projection based on the growth rate of the last 3 months. 
                  Forecasts should be considered indicative and reviewed regularly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span>Trend Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Pattern Recognition</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• {data.timeSeriesData.length} months of historical data available</li>
                  <li>• {trendAnalysis?.signups && trendAnalysis.signups > 0 ? 'Positive' : 'Negative'} signup trend detected</li>
                  <li>• Volatility is {volatility.signups > 20 ? 'high' : volatility.signups > 10 ? 'moderate' : 'low'} for signups</li>
                  <li>• Registration efficiency is {data.totalMetrics.overallConversionRate > 10 ? 'good' : 'needs improvement'}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Forecasting Confidence</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Data Quality</span>
                    <Badge variant="outline">
                      {data.timeSeriesData.length > 24 ? 'High' : data.timeSeriesData.length > 12 ? 'Good' : 'Limited'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trend Stability</span>
                    <Badge variant="outline">
                      {volatility.signups < 10 ? 'Stable' : volatility.signups < 20 ? 'Moderate' : 'Variable'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Forecast Reliability</span>
                    <Badge variant="outline">
                      {forecastPeriods <= 6 ? 'Good' : forecastPeriods <= 12 ? 'Fair' : 'Speculative'}
                    </Badge>
                  </div>
                </div>
              </div>

              {showForecast && forecastData.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Next Period Projections</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Projected Signups:</span>
                      <span className="font-medium">{formatNumber(forecastData[0].signups)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Applications:</span>
                      <span className="font-medium">{formatNumber(forecastData[0].applicants)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected Registrations:</span>
                      <span className="font-medium">{formatNumber(forecastData[0].registered)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Recommendations */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Trend-Based Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Short-term Actions (1-3 months)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {trendAnalysis?.signups && trendAnalysis.signups < 0 && (
                  <li>• Address declining signup trend immediately</li>
                )}
                {data.totalMetrics.overallConversionRate < 10 && (
                  <li>• Focus on conversion rate optimization</li>
                )}
                <li>• Monitor volatility for process improvements</li>
                <li>• Validate forecast accuracy monthly</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Medium-term Goals (3-12 months)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Establish more consistent growth patterns</li>
                <li>• Reduce data volatility through process standardization</li>
                <li>• Implement predictive analytics for capacity planning</li>
                <li>• Set trend-based performance targets</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Strategic Planning (12+ months)</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Use trend data for resource allocation</li>
                <li>• Develop seasonal adjustment strategies</li>
                <li>• Build advanced forecasting models</li>
                <li>• Establish benchmark comparisons</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
