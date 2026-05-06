import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Activity,
    CheckCircle,
    GraduationCap,
    Target,
    TrendingDown,
    TrendingUp,
    UserCheck,
    Users
} from 'lucide-react';

import { TrendlineOptions } from '@/utils/trendlines';
import { ConversionRateChart } from '../charts/ConversionRateChart';
import { DonutChart } from '../charts/DonutChart';
import { TimeSeriesChart } from '../charts/TimeSeriesChart';
import { TrendlineControls } from '../TrendlineControls';

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
  enhanced_demographics?: any;
  corrected_multi_party_demographics?: {
    student_demographics: {
      total_students: number;
      true_international_students: {
        domestic_students_percentage: number;
        international_students_percentage: number;
      };
    };
    sponsor_guardian_demographics: {
      domestic_vs_international_support: {
        international_percentage: number;
      };
    };
  };
  important_correction?: {
    correction_date: string;
    correction_reason: string;
    corrected_analysis: string;
    key_finding: string;
  };
}

interface OverviewTabProps {
  data: FunnelData | null;
  timeRange: string;
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

export function OverviewTab({
  data,
  timeRange,
  showTrendlines,
  setShowTrendlines,
  trendlineOptions,
  setTrendlineOptions,
  activeTrendlines,
  setActiveTrendlines
}: OverviewTabProps) {
  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num}%`;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalMetrics.totalSignups)}</div>
            <p className="text-xs text-blue-100">
              📝 Initial interest registrations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <UserCheck className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalMetrics.totalApplicants)}</div>
            <p className="text-xs text-green-100">
              📄 {formatPercentage(data.conversionRates.signupToApplication)} conversion from signups
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalMetrics.totalAccepted)}</div>
            <p className="text-xs text-purple-100">
              ✅ {formatPercentage(data.conversionRates.applicationToAcceptance)} acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered</CardTitle>
            <GraduationCap className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.totalMetrics.totalRegistered)}</div>
            <p className="text-xs text-orange-100">
              🎓 {formatPercentage(data.totalMetrics.overallConversionRate)} overall conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Correction Notice */}
      {data.important_correction && (
        <div className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <TrendingDown className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Important Correction ({data.important_correction.correction_date}):</strong> {data.important_correction.correction_reason}. 
              <br /><strong>Corrected Analysis:</strong> {data.important_correction.corrected_analysis}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Corrected Student Demographics KPIs */}
      {data.corrected_multi_party_demographics && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Corrected Student Demographics (Students Only)</span>
            <Badge variant="outline" className="text-green-700 border-green-200">
              Corrected Analysis
            </Badge>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-green-700">Domestic Students</p>
                    <p className="text-xl font-bold text-green-900">
                      {data.corrected_multi_party_demographics.student_demographics.true_international_students.domestic_students_percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-600">
                      Ghana-based students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">International Students</p>
                    <p className="text-xl font-bold text-blue-900">
                      {data.corrected_multi_party_demographics.student_demographics.true_international_students.international_students_percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-blue-600">
                      True international students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-purple-700">Total Students</p>
                    <p className="text-xl font-bold text-purple-900">
                      {data.corrected_multi_party_demographics.student_demographics.total_students}
                    </p>
                    <p className="text-xs text-purple-600">
                      Student applicants
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-amber-700">Support Network</p>
                    <p className="text-xl font-bold text-amber-900">
                      {data.corrected_multi_party_demographics.sponsor_guardian_demographics.domestic_vs_international_support.international_percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-amber-600">
                      International sponsors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Key Institutional Insight</h4>
                <p className="text-sm text-blue-800 mt-1">
                  TUC is primarily a domestic Ghanaian institution serving local students, with a strong international family support network providing financial backing. This reflects a globally-connected Ghanaian diaspora supporting education at home.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Conversion Efficiency Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Conversion Efficiency</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Signup → Application</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{formatPercentage(data.conversionRates.signupToApplication)}</Badge>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Application → Acceptance</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{formatPercentage(data.conversionRates.applicationToAcceptance)}</Badge>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Acceptance → Registration</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{formatPercentage(data.conversionRates.acceptanceToRegistration)}</Badge>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Opportunity Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {formatNumber(data.totalMetrics.signupsNeverApplied)}
                </div>
                <p className="text-sm text-gray-600">Never Applied</p>
                <p className="text-xs text-red-500">
                  {((data.totalMetrics.signupsNeverApplied / data.totalMetrics.totalSignups) * 100).toFixed(1)}% dropout
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {formatNumber(data.totalMetrics.acceptedNotRegistered)}
                </div>
                <p className="text-sm text-gray-600">Accepted but Not Registered</p>
                <p className="text-xs text-yellow-500">Conversion opportunity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <span>Funnel Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">📝 Signups</span>
                <span className="font-medium">{formatNumber(data.totalMetrics.totalSignups)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">📄 Applications</span>
                <span className="font-medium">{formatNumber(data.totalMetrics.totalApplicants)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">✅ Accepted</span>
                <span className="font-medium">{formatNumber(data.totalMetrics.totalAccepted)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-semibold">🎓 Registered</span>
                <span className="font-bold text-green-600">{formatNumber(data.totalMetrics.totalRegistered)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart with Trendline Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Registration Funnel Time Series</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{data.timeSeriesData.length} months</Badge>
              <TrendlineControls
                showTrendlines={showTrendlines}
                onToggleTrendlines={setShowTrendlines}
                trendlineOptions={trendlineOptions}
                onOptionsChange={setTrendlineOptions}
                activeTrendlines={activeTrendlines}
                onActiveTrendlinesChange={setActiveTrendlines}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart 
            data={data.timeSeriesData} 
            showTrendlines={showTrendlines}
            trendlineOptions={trendlineOptions}
            activeTrendlines={activeTrendlines}
          />
        </CardContent>
      </Card>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <span>Conversion Rates Over Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionRateChart 
              data={data.timeSeriesData} 
              showTrendlines={showTrendlines}
              trendlineOptions={trendlineOptions}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span>Final Outcome Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { label: 'Registered', value: data.totalMetrics.totalRegistered, color: '#10b981' },
                { label: 'Accepted Not Registered', value: data.totalMetrics.acceptedNotRegistered, color: '#f59e0b' },
                { label: 'Rejected', value: data.totalMetrics.totalApplicants - data.totalMetrics.totalAccepted, color: '#ef4444' },
                { label: 'Never Applied', value: data.totalMetrics.signupsNeverApplied, color: '#6b7280' }
              ]}

            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span>Key Insights & Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Critical Bottlenecks</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>
                    <strong>{((data.totalMetrics.signupsNeverApplied / data.totalMetrics.totalSignups) * 100).toFixed(1)}%</strong> of signups never submit applications
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500">•</span>
                  <span>
                    <strong>{formatNumber(data.totalMetrics.acceptedNotRegistered)}</strong> accepted students haven't registered
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500">•</span>
                  <span>
                    Application acceptance rate: <strong>{formatPercentage(data.conversionRates.applicationToAcceptance)}</strong>
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Optimization Opportunities</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">•</span>
                  <span>Improve application completion with follow-up campaigns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">•</span>
                  <span>Target accepted students for registration conversion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">•</span>
                  <span>Streamline the application-to-acceptance process</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
