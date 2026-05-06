interface ErrorModalProps {
  isOpen: boolean
  message: string
  onClose: () => void
}

const ErrorModal = ({ isOpen, message, onClose }: ErrorModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-600">
            Validation Error
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700">{message}</p>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
