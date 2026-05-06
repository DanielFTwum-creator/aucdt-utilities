import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users,
  Globe,
  GraduationCap,
  MapPin,
  UserCheck,
  Calendar,
  Award,
  BookOpen,
  Phone,
  Shield,
  TrendingUp,
  BarChart3
} from 'lucide-react';

import { DonutChart } from '../charts/DonutChart';

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
  enhanced_demographics?: EnhancedDemographicData;
}

interface EnhancedDemographicsTabProps {
  data: FunnelData | null;
}

export function EnhancedDemographicsTab({ data }: EnhancedDemographicsTabProps) {
  if (!data) {
    return <div className="text-center py-8">No data available</div>;
  }

  const demographicData = data.enhanced_demographics;

  if (!demographicData) {
    return (
      <div className="text-center py-8">
        <Alert>
          <AlertDescription>
            Enhanced demographic data is being processed. Please check back shortly.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Prepare chart data
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#14B8A6', '#84CC16'];
  
  const geographicChartData = Object.entries(demographicData.geographic_analytics.state_distribution).map(([region, count], index) => ({
    label: region.replace('_', ' ').replace('REGION', '').trim() || region,
    value: count,
    color: colors[index % colors.length]
  }));

  const countryChartData = Object.entries(demographicData.communication_patterns.country_names_distribution).map(([country, count], index) => ({
    label: country,
    value: count,
    color: colors[index % colors.length]
  }));

  const regionalPerformanceData = Object.entries(demographicData.demographic_insights.regional_representation)
    .filter(([region]) => region !== 'UNKNOWN')
    .map(([region, data]) => {
      const totalApplications = Object.values(data.status_distribution).reduce((a, b) => a + b, 0);
      const successful = (data.status_distribution.ACCEPTED || 0) + (data.status_distribution.REGISTERED || 0);
      const successRate = totalApplications > 0 ? (successful / totalApplications * 100) : 0;
      
      return {
        region: region.replace('_', ' ').replace('REGION', '').trim(),
        count: data.count,
        percentage: data.percentage,
        successRate: successRate.toFixed(1),
        accepted: data.status_distribution.ACCEPTED || 0,
        registered: data.status_distribution.REGISTERED || 0,
        rejected: data.status_distribution.REJECTED || 0,
        waitlisted: data.status_distribution.WAITLISTED || 0
      };
    });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Demographics Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive demographic insights with privacy protection</p>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <Badge variant="outline" className="text-green-700 border-green-200">
            Privacy Protected
          </Badge>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {demographicData.demographic_insights.total_applicants_analyzed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">International Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {demographicData.demographic_insights.international_metrics.percentage_international.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Regions Represented</p>
                <p className="text-2xl font-bold text-gray-900">
                  {demographicData.demographic_insights.diversity_metrics.regions_represented}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">International Acceptance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {demographicData.demographic_insights.international_metrics.international_acceptance_rate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Geographic Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={geographicChartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Country Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={countryChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Regional Performance Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regionalPerformanceData.map((region, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">{region.region}</h4>
                  <Badge variant="outline">
                    {region.count} applicants ({region.percentage.toFixed(1)}%)
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Accepted</p>
                    <p className="text-lg font-semibold text-green-600">{region.accepted}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Registered</p>
                    <p className="text-lg font-semibold text-blue-600">{region.registered}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-lg font-semibold text-red-600">{region.rejected}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-lg font-semibold text-purple-600">{region.successRate}%</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate Progress</span>
                    <span>{region.successRate}%</span>
                  </div>
                  <Progress value={parseFloat(region.successRate)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Communication Access Patterns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Mobile Access Rate</span>
                  <span className="text-sm text-gray-600">
                    {((Object.values(demographicData.communication_patterns.mobile_usage)[0] / (Object.values(demographicData.communication_patterns.mobile_usage)[0] + Object.values(demographicData.communication_patterns.mobile_usage)[1])) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(Object.values(demographicData.communication_patterns.mobile_usage)[0] / (Object.values(demographicData.communication_patterns.mobile_usage)[0] + Object.values(demographicData.communication_patterns.mobile_usage)[1])) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Landline Access Rate</span>
                  <span className="text-sm text-gray-600">
                    {((Object.values(demographicData.communication_patterns.landline_usage)[0] / (Object.values(demographicData.communication_patterns.landline_usage)[0] + Object.values(demographicData.communication_patterns.landline_usage)[1])) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(Object.values(demographicData.communication_patterns.landline_usage)[0] / (Object.values(demographicData.communication_patterns.landline_usage)[0] + Object.values(demographicData.communication_patterns.landline_usage)[1])) * 100} className="h-2" />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Regional Access Patterns</h4>
              <div className="space-y-3">
                {Object.entries(demographicData.demographic_insights.access_patterns)
                  .filter(([region]) => region !== 'UNKNOWN')
                  .map(([region, data], index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">
                        {region.replace('_', ' ').replace('REGION', '').trim()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {data.communication_completeness.toFixed(1)}% Coverage
                      </Badge>
                    </div>
                    <div className="flex space-x-4 text-xs text-gray-600">
                      <span>Mobile: {data.mobile_access_rate.toFixed(1)}%</span>
                      <span>Landline: {data.landline_access_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Diversity Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {demographicData.demographic_insights.diversity_metrics.regions_represented}
                  </p>
                  <p className="text-sm text-gray-600">Regions</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {demographicData.demographic_insights.diversity_metrics.countries_represented}
                  </p>
                  <p className="text-sm text-gray-600">Countries</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Geographic Concentration</span>
                  <span className="text-sm text-gray-600">
                    {demographicData.demographic_insights.diversity_metrics.geographic_concentration.toFixed(1)}%
                  </span>
                </div>
                <Progress value={demographicData.demographic_insights.diversity_metrics.geographic_concentration} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Lower concentration indicates higher diversity
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">International Diversity Index</span>
                  <span className="text-sm text-gray-600">
                    {(demographicData.demographic_insights.diversity_metrics.international_diversity_index * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={demographicData.demographic_insights.diversity_metrics.international_diversity_index * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  Measures international student distribution diversity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* International Student Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>International Student Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <p className="text-3xl font-bold text-indigo-600">
                {demographicData.demographic_insights.international_metrics.total_international}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total International Students</p>
              <p className="text-xs text-gray-500 mt-2">
                {demographicData.demographic_insights.international_metrics.percentage_international.toFixed(1)}% of all applicants
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <p className="text-3xl font-bold text-emerald-600">
                {demographicData.demographic_insights.international_metrics.countries_represented}
              </p>
              <p className="text-sm text-gray-600 mt-1">Countries Represented</p>
              <p className="text-xs text-gray-500 mt-2">
                Global reach across multiple regions
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
              <p className="text-3xl font-bold text-violet-600">
                {demographicData.demographic_insights.international_metrics.international_acceptance_rate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">International Acceptance Rate</p>
              <p className="text-xs text-gray-500 mt-2">
                Competitive international admission standards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Compliance Footer */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-green-600" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800">Privacy Protection Applied</h4>
              <p className="text-sm text-green-700">
                All demographic data has been anonymized and processed with K-anonymity protection. 
                No individual student information can be identified from this analysis.
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-green-700 border-green-300">
                Processed: {demographicData.metadata.processing_date}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
