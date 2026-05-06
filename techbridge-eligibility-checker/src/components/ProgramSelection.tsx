import { ProgramType, ProgrammeType, ProgrammeInfo } from '../types/forms'

interface ProgramSelectionProps {
  selectedProgram: ProgramType
  selectedProgramme: ProgrammeType | ''
  onChange: (program: ProgramType) => void
}

const ProgramSelection = ({ selectedProgram, selectedProgramme, onChange }: ProgramSelectionProps) => {
  const programmes: ProgrammeInfo[] = [
    {
      code: 'JDT',
      name: 'Jewellery Design Technology',
      fullName: 'Jewellery Design Technology',
      availableLevels: ['First Degree', 'Diploma', 'Certificate']
    },
    {
      code: 'FDT',
      name: 'Fashion Design Technology',
      fullName: 'Fashion Design Technology',
      availableLevels: ['First Degree', 'Certificate']
    },
    {
      code: 'DMCD',
      name: 'Digital Media & Communication Design',
      fullName: 'Digital Media & Communication Design',
      availableLevels: ['First Degree', 'Certificate']
    },
    {
      code: 'PDE',
      name: 'Product Design & Entrepreneurship',
      fullName: 'Product Design & Entrepreneurship',
      availableLevels: ['First Degree', 'Diploma', 'Certificate']
    }
  ]

  const getAvailableLevels = (): ProgramType[] => {
    if (!selectedProgramme) return ['First Degree', 'Diploma', 'Certificate']
    const programme = programmes.find(p => p.name === selectedProgramme)
    return programme?.availableLevels || ['First Degree']
  }

  const availableLevels = getAvailableLevels()

  if (!selectedProgramme) {
    return (
      <div className="border-4 border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="flex items-center mb-4">
          <div className="bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
            2
          </div>
          <h3 className="text-lg font-semibold text-gray-600">
            Admission Type
          </h3>
        </div>
        <p className="text-gray-500 text-sm">Please select a programme first to see available admission types.</p>
      </div>
    )
  }

  return (
    <div className="border-4 border-green-500 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          2
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Admission Type
        </h3>
      </div>
      <div className="space-y-3">
        {availableLevels.map((level) => (
          <label key={level} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="programType"
              value={level}
              checked={selectedProgram === level}
              onChange={(e) => onChange(e.target.value as ProgramType)}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <span className="text-gray-700 font-medium">{level}</span>
          </label>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
        <p className="text-sm text-green-800">
          <strong>Selected Programme:</strong> {programmes.find(p => p.name === selectedProgramme)?.code} - {selectedProgramme}
        </p>
      </div>
    </div>
  )
}

export default ProgramSelection
