import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertTriangle,
    Award,
    BarChart3,
    BookOpen,
    Calculator,
    CheckCircle,
    Database,
    GraduationCap,
    HelpCircle,
    Info,
    Settings,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';

export function AboutTab() {
  return (
    <div className="space-y-6">
      {/* Dashboard Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-6 w-6 text-blue-600" />
            <span>About TUC Analytics Dashboard</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive university admissions analytics platform for data-driven decision making
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Purpose & Mission</h3>
              <p className="text-gray-700">
                The TUC Analytics Dashboard is designed to provide comprehensive insights into the 
                student registration funnel, enabling university administrators to optimize enrollment 
                processes, improve conversion rates, and make data-driven strategic decisions.
              </p>
              
              <h4 className="font-semibold text-gray-900 mt-4">Key Objectives:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Track and analyze the complete student enrollment journey</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Identify trends and patterns in student behavior</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-purple-500 mt-0.5" />
                  <span>Optimize conversion rates at each funnel stage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Award className="h-4 w-4 text-orange-500 mt-0.5" />
                  <span>Support strategic planning and resource allocation</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dashboard Features</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Multi-Tab Architecture</div>
                    <div className="text-sm text-gray-600">7 specialized analysis sections</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">Advanced Trendlines</div>
                    <div className="text-sm text-gray-600">Linear, polynomial, and moving averages</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Database className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">Export Capabilities</div>
                    <div className="text-sm text-gray-600">CSV, JSON, and report generation</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Settings className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-gray-900">Real-time Insights</div>
                    <div className="text-sm text-gray-600">Live data and performance indicators</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Correction Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <span className="text-orange-900">Critical Correction Notice - June 8, 2025</span>
          </CardTitle>
          <p className="text-sm text-orange-800">
            Important demographic analysis correction with institutional transparency
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Previous Analysis Error</span>
              </h3>
              <p className="text-red-800 mb-3">
                <strong>Identified Issue:</strong> The previous demographic analysis incorrectly treated sponsor and guardian 
                address/contact data as student data, leading to false conclusions about international student representation.
              </p>
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>Incorrect Conclusion:</strong> 51.1% international students<br/>
                  <strong>Data Error:</strong> Mixed student, sponsor, and guardian location data without proper separation
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Corrected Analysis</span>
              </h3>
              <p className="text-green-800 mb-3">
                <strong>Proper Data Separation:</strong> Student residence data has been properly separated from 
                sponsor/guardian support network data, revealing the true institutional profile.
              </p>
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>✅ Corrected Student Demographics:</strong><br/>
                  • 96.9% Domestic Students (Ghana-based)<br/>
                  • 3.1% International Students<br/>
                  • Strong international family support network (sponsors/guardians abroad)
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Strategic Implications</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span><strong>Institutional Identity:</strong> Techbridge University College is primarily a domestic Ghanaian institution</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span><strong>Service Focus:</strong> Domestic student services and local community engagement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span><strong>Financial Network:</strong> International diaspora provides strong financial support</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span><strong>Opportunity:</strong> Engage Ghanaian diaspora for fundraising and partnerships</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Data Governance Enhancement</h4>
              <p className="text-sm text-gray-700 mb-3">
                This correction has led to enhanced data governance protocols to prevent similar misinterpretations:
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Multi-party data separation requirements</li>
                <li>• Enhanced privacy protection for students, sponsors, and guardians</li>
                <li>• Relationship anonymization protocols</li>
                <li>• Cross-border data compliance frameworks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-green-600" />
            <span>Analytics Methodology</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Funnel Analysis Framework</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">📝</div>
                  <div className="font-semibold text-gray-900">Signups</div>
                  <div className="text-sm text-gray-600">Initial interest registration</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">📄</div>
                  <div className="font-semibold text-gray-900">Applications</div>
                  <div className="text-sm text-gray-600">Completed application submission</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">✅</div>
                  <div className="font-semibold text-gray-900">Accepted</div>
                  <div className="text-sm text-gray-600">Admission decision positive</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">🎓</div>
                  <div className="font-semibold text-gray-900">Registered</div>
                  <div className="text-sm text-gray-600">Final enrollment completion</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Metrics Calculated</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Signup → Application Rate</span>
                    <Badge variant="outline">Applications ÷ Signups × 100</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Application → Acceptance Rate</span>
                    <Badge variant="outline">Accepted ÷ Applications × 100</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">Acceptance → Registration Rate</span>
                    <Badge variant="outline">Registered ÷ Accepted × 100</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="text-sm font-semibold text-gray-900">Overall Conversion Rate</span>
                    <Badge variant="default">Registered ÷ Signups × 100</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Trendline Methods</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Linear Regression</div>
                    <div className="text-sm text-blue-700">
                      Straight-line trend using least squares method
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Polynomial Fitting</div>
                    <div className="text-sm text-green-700">
                      Curved trends capturing acceleration/deceleration
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900">Moving Average</div>
                    <div className="text-sm text-purple-700">
                      Smoothed trend removing short-term fluctuations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources & Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-purple-600" />
            <span>Data Sources & Quality Assurance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Data Collection</h4>
              <div className="p-3 mb-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Real Institutional Data
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    523 Records Processed
                  </Badge>
                </div>
                <p className="text-sm text-green-800">
                  This dashboard now uses real TUC institutional data from 2018-2025, 
                  fully anonymized and privacy-compliant.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Real application data tracking (2018-2025)</li>
                <li>• 523 anonymized student application records</li>
                <li>• Comprehensive funnel stage monitoring</li>
                <li>• Privacy-safe aggregate statistics only</li>
                <li>• Historical trend preservation</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Quality Standards</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Data Completeness</span>
                  <Badge variant="default">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Records Processed</span>
                  <Badge variant="default">523</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Data Period</span>
                  <Badge variant="outline">2018-2025</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Privacy Compliance</span>
                  <Badge variant="default">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Last Updated</span>
                  <Badge variant="outline">June 2025</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Privacy & Security</h4>
              <div className="p-3 mb-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    Enhanced Privacy Protection
                  </Badge>
                </div>
                <p className="text-sm text-blue-800">
                  Zero individual records exposed. All data aggregated with minimum 
                  group sizes to prevent re-identification.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Fully anonymized aggregate data only</li>
                <li>• No personally identifiable information (PII)</li>
                <li>• FERPA and data protection compliance</li>
                <li>• Minimum group size thresholds enforced</li>
                <li>• Secure processing pipeline audited</li>
                <li>• Privacy-by-design methodology</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-orange-600" />
            <span>Educational Context & Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Understanding Conversion Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Industry Benchmarks</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span>Excellent Overall Conversion</span>
                      <Badge variant="default">15%+</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span>Good Overall Conversion</span>
                      <Badge variant="outline">10-15%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                      <span>Average Overall Conversion</span>
                      <Badge variant="outline">5-10%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span>Below Average</span>
                      <Badge variant="destructive">{'< 5%'}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Optimization Strategies</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Signup Stage:</strong> Simplify initial registration</li>
                    <li>• <strong>Application Stage:</strong> Provide clear guidance</li>
                    <li>• <strong>Acceptance Stage:</strong> Timely decision communication</li>
                    <li>• <strong>Registration Stage:</strong> Streamline enrollment process</li>
                    <li>• <strong>Follow-up:</strong> Targeted re-engagement campaigns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interpreting Seasonal Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-lg">🌸</div>
                  <div className="font-semibold text-green-800">Spring</div>
                  <div className="text-sm text-gray-600">Traditional admission peak</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-lg">☀️</div>
                  <div className="font-semibold text-yellow-800">Summer</div>
                  <div className="text-sm text-gray-600">Transfer students active</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-lg">🍂</div>
                  <div className="font-semibold text-orange-800">Fall</div>
                  <div className="text-sm text-gray-600">Primary intake period</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-lg">❄️</div>
                  <div className="font-semibold text-blue-800">Winter</div>
                  <div className="text-sm text-gray-600">Planning and preparation</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-gray-600" />
            <span>Technical Specifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Technology Stack</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Frontend Framework:</span>
                  <Badge variant="outline">React 18</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Language:</span>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Styling:</span>
                  <Badge variant="outline">TailwindCSS</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Charts:</span>
                  <Badge variant="outline">Recharts</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Build Tool:</span>
                  <Badge variant="outline">Vite</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Performance</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Load Time:</span>
                  <Badge variant="default">{'< 2s'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Responsiveness:</span>
                  <Badge variant="default">Mobile-First</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Browser Support:</span>
                  <Badge variant="outline">Modern</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Accessibility:</span>
                  <Badge variant="default">WCAG 2.1</Badge>
                </div>
                <div className="flex justify-between">
                  <span>SEO Ready:</span>
                  <Badge variant="default">Yes</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Features</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Real-time Updates:</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Data Export:</span>
                  <Badge variant="default">Multiple Formats</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Filtering:</span>
                  <Badge variant="default">Advanced</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Trendlines:</span>
                  <Badge variant="default">3 Types</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Forecasting:</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support & Contact */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-6 w-6 text-indigo-600" />
            <span>Support & Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Getting Help</h4>
              <p className="text-sm text-gray-700">
                For questions about the dashboard, data interpretation, or technical issues, 
                please contact the TUC Analytics Team.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">University:</span>
                  <span className="text-gray-600">Techbridge University College</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Version:</span>
                  <span className="text-gray-600">Enhanced Analytics Dashboard v2.0</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Database className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Last Updated:</span>
                  <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Quick Start Guide</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <Badge variant="outline" className="text-xs">1</Badge>
                  <span>Start with the <strong>Overview</strong> tab for key metrics</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Badge variant="outline" className="text-xs">2</Badge>
                  <span>Use <strong>Funnel Analysis</strong> to identify bottlenecks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Badge variant="outline" className="text-xs">3</Badge>
                  <span>Enable <strong>Trendlines</strong> for pattern analysis</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Badge variant="outline" className="text-xs">4</Badge>
                  <span>Check <strong>Seasonal</strong> patterns for planning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Badge variant="outline" className="text-xs">5</Badge>
                  <span>Use <strong>Export</strong> for reports and sharing</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Data Implementation */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-green-600" />
            <span>Real Data Implementation & Privacy Protection</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              New in v2.0
            </Badge>
          </CardTitle>
          <p className="text-sm text-green-700">
            Enhanced with real TUC institutional data while maintaining complete privacy protection
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Data Transformation Process</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="font-medium text-gray-900 mb-1">Step 1: Secure Data Processing</div>
                  <p className="text-sm text-gray-700">
                    523 real applicant records processed through privacy-safe pipeline
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="font-medium text-gray-900 mb-1">Step 2: Anonymization & Aggregation</div>
                  <p className="text-sm text-gray-700">
                    All individual identifiers removed, data aggregated to prevent re-identification
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-green-200">
                  <div className="font-medium text-gray-900 mb-1">Step 3: Statistical Validation</div>
                  <p className="text-sm text-gray-700">
                    Aggregate statistics verified and validated for accuracy and compliance
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Privacy Compliance Measures</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                  <span className="text-sm font-medium">Individual Records Exposed</span>
                  <Badge variant="destructive">0</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                  <span className="text-sm font-medium">Minimum Group Size</span>
                  <Badge variant="default">5+</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                  <span className="text-sm font-medium">Data Anonymization</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                  <span className="text-sm font-medium">Privacy Audit Status</span>
                  <Badge variant="default">Passed</Badge>
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <div className="font-medium text-blue-900 mb-1">Data Security Guarantee</div>
                <p className="text-sm text-blue-800">
                  This dashboard displays only aggregate statistics. No individual student 
                  information can be derived or reconstructed from the presented data.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Real Data Highlights</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">523</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">38.81%</div>
                <div className="text-sm text-gray-600">Acceptance Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">8.99%</div>
                <div className="text-sm text-gray-600">Registration Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">2018-2025</div>
                <div className="text-sm text-gray-600">Data Period</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
