import { Award, Clock, Eye, FileText, LogOut, Plus, Trash2, TrendingUp, Upload } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Document {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  wordCount: number;
  overallScore?: number;
}

export default function Dashboard() {
  const [documents] = useState<Document[]>([
    {
      id: 1,
      title: 'PhD Proposal: AI in Education',
      status: 'COMPLETED',
      createdAt: '2025-11-20',
      wordCount: 12450,
      overallScore: 87
    },
    {
      id: 2,
      title: 'Literature Review Chapter',
      status: 'ANALYZING',
      createdAt: '2025-11-22',
      wordCount: 8230
    },
    {
      id: 3,
      title: 'Methodology Draft',
      status: 'UPLOADED',
      createdAt: '2025-11-23',
      wordCount: 5670
    }
  ]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="glass border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-serif font-bold gradient-text">ThesisAI</h1>
              <nav className="hidden md:flex gap-6">
                <Link to="/" className="text-academic-navy font-medium border-b-2 border-academic-amber pb-1">Dashboard</Link>
                <Link to="/upload" className="text-slate-600 hover:text-academic-navy transition-colors">Upload</Link>
              </nav>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-academic-navy transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome section */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-4xl font-serif font-bold text-academic-navy mb-3">Welcome back, Scholar</h2>
          <p className="text-lg text-slate-600">Track your thesis progress and improve your research quality</p>
        </div>

        {/* Stats cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: FileText, label: 'Documents', value: documents.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: TrendingUp, label: 'Avg. Score', value: '87%', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: Award, label: 'Completed', value: '1', color: 'text-amber-600', bg: 'bg-amber-50' }
          ].map((stat, i) => (
            <div 
              key={i}
              className="glass card-shadow-lg rounded-xl p-6 transform hover:-translate-y-1 transition-all animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-academic-navy mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Documents section */}
        <div className="glass card-shadow-lg rounded-xl p-8 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-academic-navy mb-1">Your Documents</h3>
              <p className="text-slate-600">Manage and analyze your thesis submissions</p>
            </div>
            <Link 
              to="/upload"
              className="btn btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Upload New
            </Link>
          </div>

          <div className="space-y-4">
            {documents.map((doc, i) => (
              <div 
                key={doc.id}
                className="bg-white rounded-lg p-6 border-2 border-slate-100 hover:border-academic-amber transition-all transform hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-academic-navy" />
                      <h4 className="font-semibold text-lg text-academic-navy">{doc.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        doc.status === 'ANALYZING' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                      <span>{doc.wordCount.toLocaleString()} words</span>
                      {doc.overallScore && (
                        <span className="flex items-center gap-1 font-medium text-academic-amber">
                          <Award className="w-4 h-4" />
                          Score: {doc.overallScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'COMPLETED' && (
                      <Link
                        to={`/analysis/${doc.id}`}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Analysis"
                      >
                        <Eye className="w-5 h-5 text-academic-navy" />
                      </Link>
                    )}
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                {doc.status === 'ANALYZING' && (
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-academic-amber h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">AI analysis in progress...</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-slate-600 mb-2">No documents yet</h4>
              <p className="text-slate-500 mb-6">Upload your first thesis document to get started</p>
              <Link to="/upload" className="btn btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Upload Document
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
