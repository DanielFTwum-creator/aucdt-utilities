import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users,
  Globe,
  AlertTriangle,
  MapPin,
  UserCheck,
  Phone,
  Shield,
  TrendingUp,
  BarChart3,
  Info,
  CheckCircle,
  Heart,
  Building2
} from 'lucide-react';

import { DonutChart } from '../charts/DonutChart';

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
  corrected_multi_party_demographics?: CorrectedDemographicData;
  important_correction?: {
    correction_date: string;
    correction_reason: string;
    corrected_analysis: string;
    key_finding: string;
  };
}

interface CorrectedMultiPartyDemographicsTabProps {
  data: FunnelData | null;
}

export function CorrectedMultiPartyDemographicsTab({ data }: CorrectedMultiPartyDemographicsTabProps) {
  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  const correctedData = data.corrected_multi_party_demographics;
  const correctionInfo = data.important_correction;

  if (!correctedData) {
    return (
      <div className="text-center py-8">
        <Alert>
          <AlertDescription>
            Corrected multi-party demographic data is being processed. Please check back shortly.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Prepare chart data with correct structure
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#14B8A6', '#84CC16'];
  
  const studentResidenceData = Object.entries(correctedData.student_demographics.residence_distribution).map(([region, count], index) => ({
    label: region.replace('_', ' ').replace('REGION', '').trim() || region,
    value: count,
    color: colors[index % colors.length]
  }));

  const sponsorCountryData = Object.entries(correctedData.sponsor_guardian_demographics.country_distribution).map(([country, count], index) => ({
    label: country,
    value: count as number,
    color: colors[index % colors.length]
  }));

  return (
    <div className="space-y-6">
      {/* Critical Correction Alert */}
      {correctionInfo && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div className="ml-3">
            <h4 className="font-semibold text-orange-800 mb-2">Critical Data Analysis Correction</h4>
            <AlertDescription className="text-orange-700">
              <p className="mb-2"><strong>Correction Date:</strong> {correctionInfo.correction_date}</p>
              <p className="mb-2"><strong>Issue:</strong> {correctionInfo.correction_reason}</p>
              <p className="mb-2"><strong>Resolution:</strong> {correctionInfo.corrected_analysis}</p>
              <p><strong>Key Finding:</strong> {correctionInfo.key_finding}</p>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Corrected Multi-Party Demographics</h2>
          <p className="text-gray-600 mt-1">Proper distinction between students, sponsors, and guardians</p>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <Badge variant="outline" className="text-green-700 border-green-200">
            Analysis Corrected
          </Badge>
        </div>
      </div>

      {/* Corrected Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Students (Actual)</p>
                <p className="text-2xl font-bold text-blue-900">
                  {correctedData.student_demographics.total_students}
                </p>
                <p className="text-xs text-blue-700">94.6% Domestic</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Sponsors/Guardians</p>
                <p className="text-2xl font-bold text-green-900">
                  {correctedData.sponsor_guardian_demographics.total_sponsor_guardians}
                </p>
                <p className="text-xs text-green-700">Support Network</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">True International Students</p>
                <p className="text-2xl font-bold text-purple-900">
                  {correctedData.student_demographics.true_international_students.international_students_percentage}%
                </p>
                <p className="text-xs text-purple-700">Only 2.6% International</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">International Sponsors</p>
                <p className="text-2xl font-bold text-orange-900">
                  {correctedData.sponsor_guardian_demographics.domestic_vs_international_support.international_percentage.toFixed(1)}%
                </p>
                <p className="text-xs text-orange-700">Financial Support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* True vs False Analysis Comparison */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <Info className="h-5 w-5" />
            <span>Critical Correction: International Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-red-800">❌ Previous (Incorrect) Analysis:</h4>
              <div className="bg-white p-4 rounded border">
                <p className="text-sm text-gray-700 mb-2">• "51.1% international students"</p>
                <p className="text-sm text-gray-700 mb-2">• "International diversity high"</p>
                <p className="text-sm text-gray-700">• "Multiple countries represented"</p>
                <p className="text-xs text-red-600 mt-2 font-medium">
                  ERROR: Mixed student and sponsor/guardian data
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">✅ Corrected Analysis:</h4>
              <div className="bg-white p-4 rounded border">
                <p className="text-sm text-gray-700 mb-2">• "2.6% international students"</p>
                <p className="text-sm text-gray-700 mb-2">• "94.6% domestic students"</p>
                <p className="text-sm text-gray-700">• "International diversity in support network"</p>
                <p className="text-xs text-green-600 mt-2 font-medium">
                  CORRECT: Proper data separation applied
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student vs Sponsor/Guardian Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Student Residence Distribution</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Where students actually live</p>
          </CardHeader>
          <CardContent>
            <DonutChart data={studentResidenceData} />
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-blue-700">
                Actual Student Locations
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-green-600" />
              <span>Financial Support Network</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Where sponsors/guardians are located</p>
          </CardHeader>
          <CardContent>
            <DonutChart data={sponsorCountryData} />
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-green-700">
                Sponsor/Guardian Origins
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Party Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Multi-Party Relationship Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {correctedData.multi_party_insights.financial_support_patterns.students_with_international_support}
              </p>
              <p className="text-sm text-gray-700 mt-1">Students with International Support</p>
              <p className="text-xs text-gray-500 mt-2">
                Domestic students receiving international financial support
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {correctedData.multi_party_insights.financial_support_patterns.students_with_domestic_only_support}
              </p>
              <p className="text-sm text-gray-700 mt-1">Students with Domestic Support</p>
              <p className="text-xs text-gray-500 mt-2">
                Students supported by domestic sponsors/guardians
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {correctedData.multi_party_insights.student_sponsor_relationships.international_students}
              </p>
              <p className="text-sm text-gray-700 mt-1">True International Students</p>
              <p className="text-xs text-gray-500 mt-2">
                Students who are actually international
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Implications */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-indigo-800">Strategic Implications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-indigo-800 mb-3">Student Services Planning:</h4>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li>• Focus on domestic student services (94.6%)</li>
                <li>• Limited international student support needed</li>
                <li>• Accra region has highest student concentration</li>
                <li>• Campus services should cater to local needs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-indigo-800 mb-3">Fundraising & Engagement:</h4>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li>• International donor engagement opportunities</li>
                <li>• Sponsor/guardian network spans multiple countries</li>
                <li>• Family engagement programmes needed</li>
                <li>• Financial support network is geographically diverse</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Privacy Compliance */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800">Enhanced Multi-Party Privacy Protection</h4>
              <p className="text-sm text-green-700">
                Student, sponsor, and guardian data properly separated and anonymized. 
                Multi-party relationships protected with enhanced K-anonymity.
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-green-700 border-green-300">
                Corrected: {correctedData.metadata.processing_date}
              </Badge>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2 bg-white rounded">
              <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-800">Student Privacy</p>
            </div>
            <div className="p-2 bg-white rounded">
              <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-800">Sponsor Privacy</p>
            </div>
            <div className="p-2 bg-white rounded">
              <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-800">Guardian Privacy</p>
            </div>
            <div className="p-2 bg-white rounded">
              <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-800">Multi-Party K-Anonymity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
