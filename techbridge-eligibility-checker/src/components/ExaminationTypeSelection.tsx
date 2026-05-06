import { ExaminationType, ProgramType } from '../types/forms'

interface ExaminationTypeSelectionProps {
  selectedType: ExaminationType
  programType: ProgramType
  onChange: (type: ExaminationType) => void
}

const ExaminationTypeSelection = ({ selectedType, programType, onChange }: ExaminationTypeSelectionProps) => {
  const getAvailableOptions = () => {
    const commonOptions: ExaminationType[] = ['WASSCE', 'SSSCE']
    const firstDegreeOnlyOptions: ExaminationType[] = ['GBCE', 'GCE Advanced Level', 'HND', 'Mature Student']
    
    if (programType === 'First Degree') {
      return [...commonOptions, ...firstDegreeOnlyOptions]
    }
    if (programType === 'Diploma' || programType === 'Certificate') {
      return commonOptions
    }
    return commonOptions
  }

  const availableOptions = getAvailableOptions()

  return (
    <div className="border-4 border-blue-500 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          3
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Examination Type
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableOptions.map((option) => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="examinationType"
              value={option}
              checked={selectedType === option}
              onChange={(e) => onChange(e.target.value as ExaminationType)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">
              {option}
              {programType === 'Diploma' && ['GBCE', 'GCE Advanced Level', 'HND', 'Mature Student'].includes(option) 
                ? ' (First Degree only)' 
                : ''
              }
            </span>
          </label>
        ))}
      </div>
      {programType === 'Diploma' && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> GBCE, GCE Advanced Level, HND, and Mature Student options are only available for First Degree programmes.
          </p>
        </div>
      )}
    </div>
  )
}

export default ExaminationTypeSelection
