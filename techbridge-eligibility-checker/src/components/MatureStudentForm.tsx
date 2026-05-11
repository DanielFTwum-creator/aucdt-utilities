import { MatureStudentData } from '../types/forms'

interface MatureStudentFormProps {
  data: MatureStudentData
  onChange: (field: keyof MatureStudentData, value: any) => void
}

const MatureStudentForm = ({ data, onChange }: MatureStudentFormProps) => {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth || dateOfBirth.trim() === '') return 0
    
    try {
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      
      // Check if the date is valid
      if (isNaN(birthDate.getTime())) return 0
      
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return Math.max(0, age) // Ensure non-negative age
    } catch (error) {
      console.error('Error calculating age:', error)
      return 0
    }
  }

  const currentAge = calculateAge(data.dateOfBirth)

  return (
    <div className="border-4 border-orange-500 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          4
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Mature Student Requirements
        </h3>
      </div>

      <div className="bg-orange-50 p-4 rounded-md">
        <p className="text-sm text-indigo-800 mb-6">
          <strong>Mature Student Entry Requirements</strong><br />
          Mature students must meet specific age and examination requirements for admission.
        </p>

        <div className="space-y-6">
          {/* Date of Birth / Age Requirement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
              className="w-full md:w-48 px-3 py-2 border-2 border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              max={new Date().toISOString().split('T')[0]}
            />
            <div className="text-xs text-gray-600 mt-1">
              {data.dateOfBirth && (
                <p className="mb-1">
                  Your calculated age: <span className="font-semibold">{currentAge} years</span>
                </p>
              )}
              <p>Minimum age requirement: 25 years</p>
            </div>
          </div>



          {/* Entrance Examination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Willing to pass an entrance examination? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="entranceExam"
                  checked={data.entranceExam === true}
                  onChange={() => onChange('entranceExam', true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Yes, I am willing to take an entrance examination</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="entranceExam"
                  checked={data.entranceExam === false}
                  onChange={() => onChange('entranceExam', false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">No, I am not willing to take an entrance examination</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Information:</strong> The entrance examination will assess your readiness for university-level study
            and may cover basic mathematics, English, and general knowledge relevant to your chosen field of study.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MatureStudentForm
