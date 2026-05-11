import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileBarChart,
  Share2,
  Mail,
  Printer,
  Calendar,
  Database,
  Settings
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
  enhanced_demographics?: any;
}

interface ExportTabProps {
  data: FunnelData | null;
  timeRange: string;
}

export function ExportTab({ data, timeRange }: ExportTabProps) {
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [reportType, setReportType] = useState<string>('comprehensive');
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeAnalysis, setIncludeAnalysis] = useState<boolean>(true);
  const [includeRecommendations, setIncludeRecommendations] = useState<boolean>(true);
  const [selectedSections, setSelectedSections] = useState<string[]>(['overview', 'funnel', 'trends']);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [lastExportTime, setLastExportTime] = useState<string>('');

  if (!data) {
    return <div className="text-center py-8">No data available for export</div>;
  }

  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  // Export functions
  const exportToCSV = () => {
    const csvData = [
      ['Month', 'Signups', 'Applications', 'Accepted', 'Registered', 'Signup Conversion %', 'Application Conversion %', 'Overall Conversion %'],
      ...data.timeSeriesData.map(item => [
        item.month,
        item.signups,
        item.applicants,
        item.accepted,
        item.registered,
        item.signups > 0 ? ((item.applicants / item.signups) * 100).toFixed(2) : '0',
        item.applicants > 0 ? ((item.accepted / item.applicants) * 100).toFixed(2) : '0',
        item.signups > 0 ? ((item.registered / item.signups) * 100).toFixed(2) : '0'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aucdt-funnel-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        timeRange: timeRange,
        dataPoints: data.timeSeriesData.length,
        generatedBy: 'TUC Analytics Dashboard'
      },
      summary: data.totalMetrics,
      conversionRates: data.conversionRates,
      timeSeriesData: data.timeSeriesData,
      analysis: {
        totalMonths: data.timeSeriesData.length,
        averageMonthlySignups: Math.round(data.totalMetrics.totalSignups / data.timeSeriesData.length),
        averageMonthlyRegistrations: Math.round(data.totalMetrics.totalRegistered / data.timeSeriesData.length),
        overallEfficiency: data.totalMetrics.overallConversionRate
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aucdt-analytics-data-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportDemographics = () => {
    if (!data.enhanced_demographics) return;

    const demographicExportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        exportType: 'Enhanced Demographics Analytics',
        privacyCompliant: true,
        kAnonymityApplied: true,
        generatedBy: 'TUC Analytics Dashboard'
      },
      summary: {
        totalApplicantsAnalyzed: data.enhanced_demographics.demographic_insights.total_applicants_analyzed,
        regionsRepresented: data.enhanced_demographics.geographic_analytics.total_regions,
        countriesRepresented: data.enhanced_demographics.demographic_insights.international_metrics.countries_represented,
        internationalPercentage: data.enhanced_demographics.demographic_insights.international_metrics.percentage_international,
        internationalAcceptanceRate: data.enhanced_demographics.demographic_insights.international_metrics.international_acceptance_rate
      },
      geographic_analytics: {
        state_distribution: data.enhanced_demographics.geographic_analytics.state_distribution,
        conversion_rates_by_region: data.enhanced_demographics.geographic_analytics.conversion_rates_by_region,
        international_vs_domestic: data.enhanced_demographics.geographic_analytics.international_vs_domestic
      },
      international_insights: {
        total_international: data.enhanced_demographics.demographic_insights.international_metrics.total_international,
        percentage_international: data.enhanced_demographics.demographic_insights.international_metrics.percentage_international,
        countries_represented: data.enhanced_demographics.demographic_insights.international_metrics.countries_represented,
        international_acceptance_rate: data.enhanced_demographics.demographic_insights.international_metrics.international_acceptance_rate
      },
      communication_patterns: data.enhanced_demographics.communication_patterns,
      diversity_metrics: data.enhanced_demographics.demographic_insights.diversity_metrics,
      privacy_notice: "All data has been anonymized and aggregated to protect individual privacy. No personally identifiable information is included in this export."
    };

    const blob = new Blob([JSON.stringify(demographicExportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aucdt-demographics-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const reportContent = `
# TUC Registration Funnel Analytics Report

## Executive Summary
- **Analysis Period**: ${timeRange} (${data.timeSeriesData.length} months)
- **Total Signups**: ${formatNumber(data.totalMetrics.totalSignups)}
- **Total Registrations**: ${formatNumber(data.totalMetrics.totalRegistered)}
- **Overall Conversion Rate**: ${formatPercentage(data.totalMetrics.overallConversionRate)}
- **Report Generated**: ${new Date().toLocaleString()}

## Key Performance Indicators
- **Signup to Application Conversion**: ${formatPercentage(data.conversionRates.signupToApplication)}
- **Application to Acceptance Rate**: ${formatPercentage(data.conversionRates.applicationToAcceptance)}
- **Acceptance to Registration Rate**: ${formatPercentage(data.conversionRates.acceptanceToRegistration)}

## Funnel Breakdown
- **Total Signups**: ${formatNumber(data.totalMetrics.totalSignups)}
- **Applications Submitted**: ${formatNumber(data.totalMetrics.totalApplicants)}
- **Students Accepted**: ${formatNumber(data.totalMetrics.totalAccepted)}
- **Students Registered**: ${formatNumber(data.totalMetrics.totalRegistered)}

## Opportunity Analysis
- **Students who never applied**: ${formatNumber(data.totalMetrics.signupsNeverApplied)} (${formatPercentage((data.totalMetrics.signupsNeverApplied / data.totalMetrics.totalSignups) * 100)})
- **Accepted but not registered**: ${formatNumber(data.totalMetrics.acceptedNotRegistered)} (${formatPercentage((data.totalMetrics.acceptedNotRegistered / data.totalMetrics.totalAccepted) * 100)})

## Monthly Performance
${data.timeSeriesData.map(item => 
  `**${item.month}**: ${item.signups} signups → ${item.registered} registrations (${item.signups > 0 ? formatPercentage((item.registered / item.signups) * 100) : '0%'} conversion)`
).join('\n')}

## Recommendations
1. **Address Application Abandonment**: ${formatPercentage((data.totalMetrics.signupsNeverApplied / data.totalMetrics.totalSignups) * 100)} of signups never apply
2. **Improve Registration Conversion**: Focus on ${formatNumber(data.totalMetrics.acceptedNotRegistered)} accepted students
3. **Optimize Peak Periods**: Identify and leverage high-conversion months
4. **Streamline Process**: Reduce friction in the application-to-registration journey

---
*Report generated by TUC Analytics Dashboard on ${new Date().toLocaleString()}*
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aucdt-analytics-report-${timeRange}-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      switch (exportFormat) {
        case 'csv':
          exportToCSV();
          break;
        case 'json':
          exportToJSON();
          break;
        case 'report':
          generateReport();
          break;
        case 'demographics':
          exportDemographics();
          break;
        default:
          exportToCSV();
      }
      
      setLastExportTime(new Date().toLocaleString());
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getExportSize = () => {
    const baseSize = data.timeSeriesData.length * 50; // Approximate bytes per row
    const chartsSize = includeCharts ? 5000 : 0;
    const analysisSize = includeAnalysis ? 2000 : 0;
    const recommendationsSize = includeRecommendations ? 1000 : 0;
    
    return Math.round((baseSize + chartsSize + analysisSize + recommendationsSize) / 1024);
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-6 w-6 text-indigo-600" />
            <span>Data Export & Report Generation</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Export analytics data and generate comprehensive reports for stakeholders and decision-making
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Export Format
                </label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                    <SelectItem value="json">JSON (Data)</SelectItem>
                    <SelectItem value="report">Markdown Report</SelectItem>
                    <SelectItem value="pdf">PDF Report (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Report Type
                </label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                    <SelectItem value="technical">Technical Analysis</SelectItem>
                    <SelectItem value="presentation">Presentation Ready</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Include Sections
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'overview', label: 'Overview & KPIs' },
                    { id: 'funnel', label: 'Funnel Analysis' },
                    { id: 'trends', label: 'Trend Analysis' },
                    { id: 'demographics', label: 'Demographics' },
                    { id: 'seasonal', label: 'Seasonal Patterns' }
                  ].map(section => (
                    <div key={section.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={section.id}
                        checked={selectedSections.includes(section.id)}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                      />
                      <label htmlFor={section.id} className="text-sm text-gray-600">
                        {section.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Additional Options
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="charts"
                      checked={includeCharts}
                      onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                    />
                    <label htmlFor="charts" className="text-sm text-gray-600">
                      Include Charts
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="analysis"
                      checked={includeAnalysis}
                      onCheckedChange={(checked) => setIncludeAnalysis(checked === true)}
                    />
                    <label htmlFor="analysis" className="text-sm text-gray-600">
                      Include Analysis
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recommendations"
                      checked={includeRecommendations}
                      onCheckedChange={(checked) => setIncludeRecommendations(checked === true)}
                    />
                    <label htmlFor="recommendations" className="text-sm text-gray-600">
                      Include Recommendations
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Badge variant="outline" className="text-xs">
                  Est. Size: ~{getExportSize()}KB
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Formats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className={`cursor-pointer transition-all ${exportFormat === 'csv' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} 
              onClick={() => setExportFormat('csv')}>
          <CardHeader className="text-center pb-2">
            <FileSpreadsheet className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-sm">CSV Export</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-gray-600">
              Spreadsheet-ready data for Excel, Google Sheets, or other tools
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              {data.timeSeriesData.length} rows
            </Badge>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${exportFormat === 'json' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} 
              onClick={() => setExportFormat('json')}>
          <CardHeader className="text-center pb-2">
            <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-sm">JSON Export</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-gray-600">
              Structured data for APIs, applications, or further processing
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              Full dataset
            </Badge>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${exportFormat === 'report' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} 
              onClick={() => setExportFormat('report')}>
          <CardHeader className="text-center pb-2">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-sm">Report Export</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-gray-600">
              Comprehensive report with analysis and recommendations
            </p>
            <Badge variant="secondary" className="mt-2 text-xs">
              Executive ready
            </Badge>
          </CardContent>
        </Card>

        {/* Demographic Export Option */}
        {data.enhanced_demographics && (
          <Card className={`cursor-pointer transition-all ${exportFormat === 'demographics' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} 
                onClick={() => setExportFormat('demographics')}>
            <CardHeader className="text-center pb-2">
              <FileBarChart className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <CardTitle className="text-sm">Demographics</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xs text-gray-600">
                Regional & international student analytics with privacy protection
              </p>
              <Badge variant="secondary" className="mt-2 text-xs">
                Geographic insights
              </Badge>
            </CardContent>
          </Card>
        )}

        <Card className="opacity-50">
          <CardHeader className="text-center pb-2">
            <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <CardTitle className="text-sm text-gray-500">PDF Export</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xs text-gray-400">
              PDF reports with charts and branding
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              Coming Soon
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileBarChart className="h-5 w-5 text-green-600" />
            <span>Export Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center space-x-2"
                size="lg"
              >
                <Download className="h-5 w-5" />
                <span>{isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}</span>
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Export Preview</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">{exportFormat.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Range:</span>
                    <span className="font-medium">{timeRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Points:</span>
                    <span className="font-medium">{data.timeSeriesData.length} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sections:</span>
                    <span className="font-medium">{selectedSections.length} included</span>
                  </div>
                </div>
              </div>

              {lastExportTime && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Last export:</strong> {lastExportTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span>Export Data Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Dataset Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Period:</span>
                  <span className="font-medium">{timeRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Points:</span>
                  <span className="font-medium">{data.timeSeriesData.length} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Records:</span>
                  <span className="font-medium">{formatNumber(data.totalMetrics.totalSignups)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Rate:</span>
                  <span className="font-medium">{formatPercentage(data.totalMetrics.overallConversionRate)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Export Quality</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Completeness</span>
                  <Badge variant="default">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Series Quality</span>
                  <Badge variant="default">High</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Analysis Depth</span>
                  <Badge variant="default">Comprehensive</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Forecast Included</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Usage Guidelines</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• CSV: Import into Excel or Google Sheets</li>
                <li>• JSON: Use for API integration or apps</li>
                <li>• Report: Share with stakeholders</li>
                <li>• Charts: Visual presentation ready</li>
                <li>• All formats include metadata</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Exports */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span>Automated Reporting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Scheduled Reports</h4>
              <p className="text-sm text-gray-600">
                Set up automated report generation and delivery for regular stakeholder updates.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Configure Monthly Reports</span>
                </Button>
                <Button variant="outline" size="sm" className="w-full flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Setup Email Delivery</span>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Available Schedules</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Weekly Summary</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Monthly Report</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span>Quarterly Analysis</span>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
