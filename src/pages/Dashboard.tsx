import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Upload,
  FileText,
  LogOut,
  User,
  BarChart3,
  Clock,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { thesisService } from '../services'
import type { ThesisDocument } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<ThesisDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await thesisService.getDocuments(1, 5)
      setDocuments(response.data)
    } catch (err) {
      setError('Failed to load documents')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getStatusColor = (status: ThesisDocument['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-academic-blue" />
            <h1 className="text-2xl font-serif font-bold text-academic-navy">ThesisAI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-academic-slate">
              <User className="w-4 h-4" />
              <span>{user?.name}</span>
              <span className="px-2 py-1 bg-academic-blue/10 text-academic-blue rounded text-xs font-medium">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-academic-slate hover:text-academic-navy transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-serif font-bold text-academic-navy mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-academic-slate">Manage your thesis assessments and track progress</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Link
            to="/assessment"
            className="bg-gradient-to-br from-academic-blue to-academic-navy p-6 rounded-xl text-white hover:shadow-lg transition-shadow"
          >
            <Upload className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Upload New Thesis</h3>
            <p className="text-white/80">Start a new assessment</p>
          </Link>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <FileText className="w-10 h-10 text-academic-amber mb-4" />
            <h3 className="text-xl font-semibold text-academic-navy mb-2">
              {documents.length} Documents
            </h3>
            <p className="text-academic-slate">Total uploaded</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <BarChart3 className="w-10 h-10 text-academic-gold mb-4" />
            <h3 className="text-xl font-semibold text-academic-navy mb-2">View Reports</h3>
            <p className="text-academic-slate">Analysis insights</p>
          </div>
        </motion.div>

        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-academic-navy">Recent Documents</h3>
          </div>

          {isLoading ? (
            <div className="p-12">
              <LoadingSpinner fullScreen={false} size="md" message="Loading documents..." />
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-academic-slate mb-4">No documents uploaded yet</p>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 bg-academic-blue text-white px-4 py-2 rounded-lg hover:bg-academic-navy transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Your First Thesis
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/assessment/${doc.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-academic-navy mb-1">{doc.title}</h4>
                      <p className="text-sm text-academic-slate mb-2">{doc.fileName}</p>
                      <div className="flex items-center gap-4 text-xs text-academic-slate">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(doc.uploadedAt)}
                        </span>
                        <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
