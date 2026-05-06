import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingDown,
  TrendingUp,
  Target,
  Users,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

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

interface FunnelAnalysisTabProps {
  data: FunnelData | null;
}

export function FunnelAnalysisTab({ data }: FunnelAnalysisTabProps) {
  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num}%`;

  // Calculate dropout numbers for each stage
  const dropouts = {
    signupToApplication: data.totalMetrics.signupsNeverApplied,
    applicationToAcceptance: data.totalMetrics.totalApplicants - data.totalMetrics.totalAccepted,
    acceptanceToRegistration: data.totalMetrics.acceptedNotRegistered
  };

  // Calculate monthly averages
  const monthlyAverages = {
    signups: Math.round(data.totalMetrics.totalSignups / data.timeSeriesData.length),
    applicants: Math.round(data.totalMetrics.totalApplicants / data.timeSeriesData.length),
    accepted: Math.round(data.totalMetrics.totalAccepted / data.timeSeriesData.length),
    registered: Math.round(data.totalMetrics.totalRegistered / data.timeSeriesData.length)
  };

  // Calculate velocity (time-based conversion efficiency)
  const calculateVelocity = () => {
    const totalMonths = data.timeSeriesData.length;
    const registrationsPerMonth = data.totalMetrics.totalRegistered / totalMonths;
    return registrationsPerMonth;
  };

  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-blue-600" />
            <span>Registration Funnel Analysis</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Complete student journey from signup to registration with detailed conversion metrics
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Stage 1: Signups */}
            <div className="relative">
              <div className="flex items-center justify-between bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white p-3 rounded-full">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">📝 Initial Signups</h3>
                    <p className="text-sm text-gray-600">Students who showed initial interest</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(data.totalMetrics.totalSignups)}
                  </div>
                  <Badge variant="secondary">100% baseline</Badge>
                </div>
              </div>
              
              {/* Conversion to next stage */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-white border border-gray-300 rounded-full p-2 shadow-sm">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Dropout Analysis 1 */}
            <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <span className="font-semibold text-red-800">
                    {formatNumber(dropouts.signupToApplication)} Never Applied
                  </span>
                  <p className="text-sm text-red-600">
                    {((dropouts.signupToApplication / data.totalMetrics.totalSignups) * 100).toFixed(1)}% dropout rate
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="destructive">Critical Loss</Badge>
              </div>
            </div>

            {/* Stage 2: Applications */}
            <div className="relative">
              <div className="flex items-center justify-between bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 text-white p-3 rounded-full">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">📄 Applications Submitted</h3>
                    <p className="text-sm text-gray-600">Students who completed applications</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(data.totalMetrics.totalApplicants)}
                  </div>
                  <Badge variant="secondary">
                    {formatPercentage(data.conversionRates.signupToApplication)} of signups
                  </Badge>
                </div>
              </div>
              
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-white border border-gray-300 rounded-full p-2 shadow-sm">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Dropout Analysis 2 */}
            <div className="flex items-center justify-between bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <span className="font-semibold text-red-800">
                    {formatNumber(dropouts.applicationToAcceptance)} Rejected
                  </span>
                  <p className="text-sm text-red-600">
                    {((dropouts.applicationToAcceptance / data.totalMetrics.totalApplicants) * 100).toFixed(1)}% rejection rate
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="destructive">Selection Filter</Badge>
              </div>
            </div>

            {/* Stage 3: Accepted */}
            <div className="relative">
              <div className="flex items-center justify-between bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white p-3 rounded-full">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">✅ Accepted Students</h3>
                    <p className="text-sm text-gray-600">Students offered admission</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(data.totalMetrics.totalAccepted)}
                  </div>
                  <Badge variant="secondary">
                    {formatPercentage(data.conversionRates.applicationToAcceptance)} acceptance rate
                  </Badge>
                </div>
              </div>
              
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-white border border-gray-300 rounded-full p-2 shadow-sm">
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Dropout Analysis 3 */}
            <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <span className="font-semibold text-yellow-800">
                    {formatNumber(dropouts.acceptanceToRegistration)} Accepted but Not Registered
                  </span>
                  <p className="text-sm text-yellow-600">
                    {((dropouts.acceptanceToRegistration / data.totalMetrics.totalAccepted) * 100).toFixed(1)}% haven't registered yet
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  Conversion Opportunity
                </Badge>
              </div>
            </div>

            {/* Stage 4: Registered */}
            <div className="flex items-center justify-between bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-600 text-white p-3 rounded-full">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">🎓 Registered Students</h3>
                  <p className="text-sm text-gray-600">Final successful enrollments</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(data.totalMetrics.totalRegistered)}
                </div>
                <Badge variant="secondary">
                  {formatPercentage(data.totalMetrics.overallConversionRate)} overall conversion
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span>Dropout Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Signup → Application</span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatNumber(dropouts.signupToApplication)}
                  </span>
                </div>
                <Progress 
                  value={((dropouts.signupToApplication / data.totalMetrics.totalSignups) * 100)} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {((dropouts.signupToApplication / data.totalMetrics.totalSignups) * 100).toFixed(1)}% never applied
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Application → Acceptance</span>
                  <span className="text-sm font-medium text-red-600">
                    -{formatNumber(dropouts.applicationToAcceptance)}
                  </span>
                </div>
                <Progress 
                  value={((dropouts.applicationToAcceptance / data.totalMetrics.totalApplicants) * 100)} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {((dropouts.applicationToAcceptance / data.totalMetrics.totalApplicants) * 100).toFixed(1)}% rejected
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Acceptance → Registration</span>
                  <span className="text-sm font-medium text-yellow-600">
                    -{formatNumber(dropouts.acceptanceToRegistration)}
                  </span>
                </div>
                <Progress 
                  value={((dropouts.acceptanceToRegistration / data.totalMetrics.totalAccepted) * 100)} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {((dropouts.acceptanceToRegistration / data.totalMetrics.totalAccepted) * 100).toFixed(1)}% haven't registered
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {calculateVelocity().toFixed(1)}
                </div>
                <p className="text-sm text-gray-600">Registrations/Month</p>
                <p className="text-xs text-gray-500">Conversion Velocity</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Efficiency Score</span>
                  <Badge variant="outline">
                    {data.totalMetrics.overallConversionRate >= 10 ? 'Good' : 
                     data.totalMetrics.overallConversionRate >= 5 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing Quality</span>
                  <Badge variant="outline">
                    {data.conversionRates.applicationToAcceptance >= 40 ? 'Selective' : 
                     data.conversionRates.applicationToAcceptance >= 20 ? 'Balanced' : 'Restrictive'}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Yield Rate</span>
                  <Badge variant="outline">
                    {data.conversionRates.acceptanceToRegistration >= 50 ? 'High' : 
                     data.conversionRates.acceptanceToRegistration >= 25 ? 'Moderate' : 'Low'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Monthly Averages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">📝 Signups</span>
                <span className="font-medium">{formatNumber(monthlyAverages.signups)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">📄 Applications</span>
                <span className="font-medium">{formatNumber(monthlyAverages.applicants)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">✅ Accepted</span>
                <span className="font-medium">{formatNumber(monthlyAverages.accepted)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-sm font-semibold">🎓 Registered</span>
                <span className="font-bold text-green-600">{formatNumber(monthlyAverages.registered)}</span>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  Based on {data.timeSeriesData.length} months of data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Recommendations */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-indigo-600" />
            <span>Funnel Optimization Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-800 flex items-center space-x-2">
                <XCircle className="h-4 w-4" />
                <span>Critical Issues</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• {((dropouts.signupToApplication / data.totalMetrics.totalSignups) * 100).toFixed(1)}% signup abandonment</li>
                <li>• High rejection rate limiting growth</li>
                <li>• {formatNumber(dropouts.acceptanceToRegistration)} accepted students not converting</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-yellow-800 flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Quick Wins</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Follow up with accepted non-registered students</li>
                <li>• Simplify application process</li>
                <li>• Add application progress indicators</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Long-term Strategies</span>
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Improve pre-application qualification</li>
                <li>• Enhance acceptance-to-registration journey</li>
                <li>• Implement predictive analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
