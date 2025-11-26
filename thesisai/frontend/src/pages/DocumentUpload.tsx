import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('PROPOSAL');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      if (!title) {
        setTitle(e.dataTransfer.files[0].name);
      }
    }
  }, [title]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="glass border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-academic-navy hover:text-academic-blue transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-serif font-bold gradient-text">ThesisAI</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-serif font-bold text-academic-navy mb-3">Upload Your Document</h2>
            <p className="text-lg text-slate-600">Get comprehensive AI-powered feedback on your thesis</p>
          </div>

          <div className="glass card-shadow-lg rounded-2xl p-8 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File upload area */}
              <div
                className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${
                  dragActive 
                    ? 'border-academic-amber bg-amber-50' 
                    : 'border-slate-300 hover:border-academic-amber'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="animate-scale-in">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-academic-navy mb-2">{file.name}</h3>
                    <p className="text-slate-600 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-sm text-academic-blue hover:text-academic-navy transition-colors"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-academic-navy mb-2">
                      Drag and drop your document here
                    </h3>
                    <p className="text-slate-600 mb-4">or</p>
                    <label className="btn btn-secondary cursor-pointer inline-block">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt,.md"
                        onChange={handleFileChange}
                      />
                      Browse Files
                    </label>
                    <p className="text-sm text-slate-500 mt-4">
                      Supported formats: PDF, DOCX, TXT, MD (max 10MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Document details */}
              {file && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-academic-navy mb-2">
                      Document Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-academic-amber focus:outline-none transition-colors"
                      placeholder="e.g., PhD Thesis Proposal"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-academic-navy mb-2">
                      Document Type
                    </label>
                    <select
                      id="type"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-academic-amber focus:outline-none transition-colors"
                    >
                      <option value="PROPOSAL">Research Proposal</option>
                      <option value="THESIS">Full Thesis</option>
                      <option value="CHAPTER">Individual Chapter</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* Info box */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">What happens next?</p>
                      <p>Our AI will analyze your document for structure, argumentation, methodology, and writing quality. This typically takes 2-5 minutes.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full btn btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading & Analyzing...
                      </span>
                    ) : (
                      'Upload and Analyze'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {[
              {
                title: 'Comprehensive Analysis',
                description: 'Get detailed feedback on every aspect of your thesis from structure to citations'
              },
              {
                title: 'Viva Preparation',
                description: 'Receive predicted examination questions to help you prepare for your defense'
              },
              {
                title: 'Iterative Improvement',
                description: 'Track your progress across multiple versions and see how you improve'
              },
              {
                title: 'Academic Standards',
                description: 'Feedback aligned with international academic writing and research standards'
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="glass rounded-lg p-6 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <FileText className="w-8 h-8 text-academic-amber mb-3" />
                <h3 className="font-semibold text-academic-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
