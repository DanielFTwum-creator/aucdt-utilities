import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useThesisUpload } from '../hooks'

interface FileUploadProps {
  onUploadComplete?: (documentId: string) => void
  acceptedTypes?: string[]
  maxSizeMB?: number
}

export default function FileUpload({
  onUploadComplete,
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxSizeMB = 50,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadDocument, isUploading, progress, error, reset } = useThesisUpload()

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExt)) {
      return `Please upload a file with one of these extensions: ${acceptedTypes.join(', ')}`
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      alert(validationError)
      return
    }

    setSelectedFile(file)
    setUploadSuccess(false)
    reset()
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const document = await uploadDocument(selectedFile)
    if (document) {
      setUploadSuccess(true)
      if (onUploadComplete) {
        onUploadComplete(document.id)
      }
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setUploadSuccess(false)
    reset()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-academic-blue bg-academic-blue/5'
              : 'border-gray-300 hover:border-academic-blue hover:bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-16 h-16 text-academic-blue mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-academic-navy mb-2">
            Drop your thesis here
          </h3>
          <p className="text-academic-slate mb-4">
            or click to browse your files
          </p>
          <p className="text-sm text-academic-slate">
            Accepted formats: {acceptedTypes.join(', ')} (max {maxSizeMB}MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-300 rounded-xl p-6"
        >
          {/* File Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-academic-blue/10 p-3 rounded-lg">
                <File className="w-8 h-8 text-academic-blue" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-academic-navy mb-1">{selectedFile.name}</h4>
                <p className="text-sm text-academic-slate">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && !uploadSuccess && (
              <button
                onClick={handleReset}
                className="text-academic-slate hover:text-academic-navy transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Upload Progress */}
          <AnimatePresence mode="wait">
            {isUploading && progress && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-academic-slate">Uploading...</span>
                  <span className="font-semibold text-academic-blue">{progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    className="bg-academic-blue h-full rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">Upload successful!</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            {!uploadSuccess && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-academic-blue hover:bg-academic-navy text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload & Analyze'}
              </button>
            )}
            {uploadSuccess && (
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-academic-navy font-semibold py-3 rounded-lg transition-colors"
              >
                Upload Another
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
