import { ProgrammeType, ProgrammeInfo } from '../types/forms'

interface ProgrammeSelectionProps {
  programme: ProgrammeType | ''
  onProgrammeChange: (programme: ProgrammeType | '') => void
}

const ProgrammeSelection = ({ programme, onProgrammeChange }: ProgrammeSelectionProps) => {
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

  return (
    <div className="mb-6">
      <div className="border-4 border-red-500 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
            1
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Select Programme
          </h3>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="programme" className="block text-sm font-medium text-gray-700">
            Programme: <span className="text-red-500">*</span>
          </label>
          <select
            id="programme"
            value={programme}
            onChange={(e) => onProgrammeChange(e.target.value as ProgrammeType | '')}
            className="w-full p-3 border-2 border-red-300 rounded-md focus:border-red-500 focus:outline-none bg-white"
            required
          >
            <option value="">-- Select Programme --</option>
            {programmes.map((prog) => (
              <option key={prog.code} value={prog.name}>
                {prog.code} - {prog.name}
              </option>
            ))}
          </select>
          
          {programme && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Available Levels:</strong> {
                  programmes.find(p => p.name === programme)?.availableLevels.join(', ') || ''
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgrammeSelection
