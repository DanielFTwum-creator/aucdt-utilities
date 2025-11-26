import { AlertCircle, ArrowLeft, Award, CheckCircle, Download, FileText, HelpCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FeedbackItem {
  id: number;
  section: string;
  type: 'STRENGTH' | 'WEAKNESS' | 'SUGGESTION' | 'QUESTION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  content: string;
  pageReference: string;
}

export default function AnalysisView() {
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);
    
    // Generate HTML report content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thesis Analysis Report - ${analysis.document.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Georgia', serif; 
            line-height: 1.6; 
            color: #1e3a5f; 
            max-width: 900px; 
            margin: 40px auto; 
            padding: 20px;
            background: #f8fafc;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #f59e0b; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        h1 { font-size: 32px; color: #1e3a5f; margin-bottom: 10px; }
        h2 { font-size: 24px; color: #1e3a5f; margin: 30px 0 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        h3 { font-size: 18px; color: #2563eb; margin: 20px 0 10px; }
        .meta { color: #64748b; font-size: 14px; }
        .score-box { 
            background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); 
            color: white; 
            padding: 30px; 
            border-radius: 10px; 
            text-align: center; 
            margin: 20px 0; 
        }
        .score-box .big-score { font-size: 72px; font-weight: bold; margin: 10px 0; }
        .score-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); 
            gap: 15px; 
            margin: 20px 0; 
        }
        .score-item { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }
        .score-item .score { font-size: 36px; font-weight: bold; color: #f59e0b; }
        .score-item .label { font-size: 14px; color: #64748b; margin-top: 5px; }
        .feedback-item { 
            background: white; 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 8px; 
            border-left: 4px solid #e2e8f0; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
        }
        .feedback-item.strength { border-left-color: #10b981; }
        .feedback-item.weakness { border-left-color: #ef4444; }
        .feedback-item.suggestion { border-left-color: #3b82f6; }
        .feedback-item.question { border-left-color: #f59e0b; }
        .feedback-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: start; 
            margin-bottom: 10px; 
        }
        .feedback-type { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
            text-transform: uppercase; 
        }
        .feedback-type.strength { background: #d1fae5; color: #065f46; }
        .feedback-type.weakness { background: #fee2e2; color: #991b1b; }
        .feedback-type.suggestion { background: #dbeafe; color: #1e40af; }
        .feedback-type.question { background: #fef3c7; color: #92400e; }
        .viva-question { 
            background: white; 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
        }
        .viva-number { 
            display: inline-block; 
            width: 40px; 
            height: 40px; 
            background: #f59e0b; 
            color: white; 
            border-radius: 50%; 
            text-align: center; 
            line-height: 40px; 
            font-weight: bold; 
            margin-right: 15px; 
            float: left; 
        }
        .footer { 
            margin-top: 50px; 
            padding-top: 20px; 
            border-top: 2px solid #e2e8f0; 
            text-align: center; 
            color: #64748b; 
            font-size: 14px; 
        }
        @media print {
            body { margin: 0; padding: 20px; background: white; }
            .score-box { background: #1e3a5f; -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thesis Analysis Report</h1>
        <p class="meta">
            <strong>${analysis.document.title}</strong><br>
            ${new Date(analysis.document.createdAt).toLocaleDateString()} | 
            ${analysis.document.wordCount.toLocaleString()} words
        </p>
    </div>

    <div class="score-box">
        <div style="font-size: 16px; opacity: 0.9;">OVERALL EXAMINABILITY SCORE</div>
        <div class="big-score">${analysis.scores.overall}</div>
        <div style="font-size: 18px; opacity: 0.9;">out of 100</div>
    </div>

    <h2>Assessment Breakdown</h2>
    <div class="score-grid">
        <div class="score-item">
            <div class="score">${analysis.scores.structure}</div>
            <div class="label">Structure</div>
        </div>
        <div class="score-item">
            <div class="score">${analysis.scores.argumentation}</div>
            <div class="label">Argumentation</div>
        </div>
        <div class="score-item">
            <div class="score">${analysis.scores.methodology}</div>
            <div class="label">Methodology</div>
        </div>
        <div class="score-item">
            <div class="score">${analysis.scores.writingQuality}</div>
            <div class="label">Writing Quality</div>
        </div>
        <div class="score-item">
            <div class="score">${analysis.scores.examinability}</div>
            <div class="label">Examinability</div>
        </div>
    </div>

    <h2>Detailed Feedback</h2>
    ${analysis.feedback.map(item => `
        <div class="feedback-item ${item.type.toLowerCase()}">
            <div class="feedback-header">
                <div>
                    <span class="feedback-type ${item.type.toLowerCase()}">${item.type}</span>
                    <h3>${item.title}</h3>
                    <p class="meta">${item.section} | ${item.pageReference}</p>
                </div>
            </div>
            <p>${item.content}</p>
        </div>
    `).join('')}

    <h2>Predicted Viva Questions</h2>
    ${analysis.vivaQuestions.map((q, i) => `
        <div class="viva-question">
            <span class="viva-number">${i + 1}</span>
            <p style="overflow: hidden;">${q}</p>
        </div>
    `).join('')}

    <div class="footer">
        <p><strong>Generated by ThesisAI</strong></p>
        <p>AI-Powered Thesis Assessment Platform</p>
        <p>AsanSka University College of Design and Technology</p>
        <p>${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `.trim();

    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thesis-analysis-report-${analysis.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 1000);
  };

  // Mock data - in production, fetch from API
  const analysis = {
    document: {
      title: 'PhD Proposal: AI in Education',
      createdAt: '2025-11-20',
      wordCount: 12450
    },
    scores: {
      structure: 85,
      argumentation: 89,
      methodology: 84,
      writingQuality: 90,
      examinability: 87,
      overall: 87
    },
    feedback: [
      {
        id: 1,
        section: 'Introduction',
        type: 'STRENGTH' as const,
        severity: 'MEDIUM' as const,
        title: 'Clear Research Questions',
        content: 'The research questions are well-defined and align perfectly with the stated objectives. The progression from general to specific demonstrates strong logical thinking.',
        pageReference: 'p. 3-4'
      },
      {
        id: 2,
        section: 'Literature Review',
        type: 'WEAKNESS' as const,
        severity: 'HIGH' as const,
        title: 'Limited Recent Sources',
        content: 'While the theoretical framework is solid, there\'s a notable gap in citations from the last 2 years. Consider incorporating more recent developments in AI and education technology.',
        pageReference: 'p. 8-15'
      },
      {
        id: 3,
        section: 'Methodology',
        type: 'SUGGESTION' as const,
        severity: 'MEDIUM' as const,
        title: 'Sample Size Justification',
        content: 'Consider providing more detailed justification for your sample size. Statistical power analysis would strengthen the methodological rigor.',
        pageReference: 'p. 22'
      },
      {
        id: 4,
        section: 'Overall',
        type: 'QUESTION' as const,
        severity: 'MEDIUM' as const,
        title: 'Ethical Considerations',
        content: 'How will you address potential biases in AI algorithms when studying educational outcomes? This is likely to be a viva question.',
        pageReference: 'p. 25'
      }
    ],
    vivaQuestions: [
      'How do you plan to address the limitations of your proposed methodology?',
      'Can you explain the theoretical framework that underpins your research?',
      'What are the potential ethical implications of implementing AI in educational settings?',
      'How does your research contribute to the existing body of knowledge?',
      'What alternative methodologies did you consider and why did you reject them?'
    ]
  };

  const ScoreGauge = ({ score, label }: { score: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div 
        className="score-circle relative flex items-center justify-center mb-3"
        style={{ '--score': score } as any}
      >
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold text-academic-navy">{score}</div>
          <div className="text-xs text-slate-600">/ 100</div>
        </div>
      </div>
      <div className="text-sm font-medium text-slate-700">{label}</div>
    </div>
  );

  const FeedbackCard = ({ item }: { item: FeedbackItem }) => {
    const icons = {
      STRENGTH: CheckCircle,
      WEAKNESS: AlertCircle,
      SUGGESTION: Lightbulb,
      QUESTION: HelpCircle
    };

    const colors = {
      STRENGTH: 'border-green-200 bg-green-50',
      WEAKNESS: 'border-red-200 bg-red-50',
      SUGGESTION: 'border-blue-200 bg-blue-50',
      QUESTION: 'border-amber-200 bg-amber-50'
    };

    const iconColors = {
      STRENGTH: 'text-green-600',
      WEAKNESS: 'text-red-600',
      SUGGESTION: 'text-blue-600',
      QUESTION: 'text-amber-600'
    };

    const Icon = icons[item.type];

    return (
      <div className={`border-2 rounded-lg p-6 ${colors[item.type]} animate-fade-in`}>
        <div className="flex items-start gap-4">
          <Icon className={`w-6 h-6 ${iconColors[item.type]} flex-shrink-0 mt-1`} />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium text-slate-600 mb-1">{item.section}</div>
                <h4 className="font-semibold text-academic-navy text-lg">{item.title}</h4>
              </div>
              <span className="text-xs text-slate-500">{item.pageReference}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">{item.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="glass border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-academic-navy hover:text-academic-blue transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <button 
              onClick={handleExportReport}
              disabled={isExporting}
              className="flex items-center gap-2 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {/* Document header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-serif font-bold text-academic-navy mb-2">{analysis.document.title}</h1>
              <div className="flex items-center gap-6 text-slate-600">
                <span>{new Date(analysis.document.createdAt).toLocaleDateString()}</span>
                <span>{analysis.document.wordCount.toLocaleString()} words</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Analysis Complete</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-t-xl border-b border-slate-200 mb-6">
          <div className="flex gap-1 p-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'feedback', label: 'Detailed Feedback', icon: FileText },
              { id: 'viva', label: 'Viva Questions', icon: HelpCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-academic-navy text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="glass card-shadow-lg rounded-xl p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Overall score */}
              <div className="text-center pb-8 border-b border-slate-200">
                <div className="text-sm font-medium text-slate-600 mb-2">OVERALL EXAMINABILITY SCORE</div>
                <div className="text-7xl font-bold gradient-text mb-4">{analysis.scores.overall}</div>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Your thesis demonstrates strong academic quality and is well-prepared for examination. Address the highlighted areas for further improvement.
                </p>
              </div>

              {/* Dimension scores */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-6">Assessment Breakdown</h3>
                <div className="grid md:grid-cols-5 gap-8">
                  <ScoreGauge score={analysis.scores.structure} label="Structure" />
                  <ScoreGauge score={analysis.scores.argumentation} label="Argumentation" />
                  <ScoreGauge score={analysis.scores.methodology} label="Methodology" />
                  <ScoreGauge score={analysis.scores.writingQuality} label="Writing Quality" />
                  <ScoreGauge score={analysis.scores.examinability} label="Examinability" />
                </div>
              </div>

              {/* Quick insights */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-6">Key Insights</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: CheckCircle, label: 'Strengths Found', value: analysis.feedback.filter(f => f.type === 'STRENGTH').length, color: 'text-green-600' },
                    { icon: AlertCircle, label: 'Areas to Improve', value: analysis.feedback.filter(f => f.type === 'WEAKNESS').length, color: 'text-red-600' },
                    { icon: Lightbulb, label: 'Suggestions', value: analysis.feedback.filter(f => f.type === 'SUGGESTION').length, color: 'text-blue-600' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border-2 border-slate-100">
                      <div className="flex items-center justify-between">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        <div className="text-right">
                          <div className="text-3xl font-bold text-academic-navy">{stat.value}</div>
                          <div className="text-sm text-slate-600">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-2">Comprehensive Feedback</h3>
                <p className="text-slate-600">Detailed analysis of your thesis across all sections</p>
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2 mb-6">
                {['All', 'Strengths', 'Weaknesses', 'Suggestions', 'Questions'].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 rounded-lg border-2 border-slate-200 hover:border-academic-amber hover:bg-amber-50 transition-colors text-sm font-medium"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Feedback items */}
              <div className="space-y-4">
                {analysis.feedback.map((item, i) => (
                  <div key={item.id} style={{ animationDelay: `${i * 100}ms` }}>
                    <FeedbackCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-academic-navy mb-2">Predicted Viva Questions</h3>
                <p className="text-slate-600">Prepare for your oral examination with these AI-predicted questions</p>
              </div>

              <div className="space-y-4">
                {analysis.vivaQuestions.map((question, i) => (
                  <div 
                    key={i}
                    className="bg-white border-2 border-slate-100 rounded-lg p-6 hover:border-academic-amber transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-academic-amber text-white rounded-full flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-academic-navy font-medium">{question}</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-sm text-slate-600 mb-2 font-medium">Preparation tips:</p>
                          <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                            <li>Review relevant literature in this area</li>
                            <li>Prepare concrete examples from your research</li>
                            <li>Practice articulating your response clearly</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
