import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
  message?: string
}

export default function LoadingSpinner({ size = 'lg', fullScreen = true, message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizeClasses[size]} text-academic-blue animate-spin`} />
      {message && <p className="text-academic-slate text-sm">{message}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-navy to-academic-blue flex items-center justify-center">
        {content}
      </div>
    )
  }

  return content
}
