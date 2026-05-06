import { GradeData, ExaminationType } from '../types/forms'

interface SubjectGradesFormProps {
  grades: GradeData
  examinationType: ExaminationType
  onChange: (field: keyof GradeData, value: string) => void
}

const SubjectGradesForm = ({ grades, examinationType, onChange }: SubjectGradesFormProps) => {
  const getGradeOptions = () => {
    if (examinationType === 'SSSCE') {
      return ['Select Grade', 'A', 'B', 'C', 'D', 'E', 'F']
    }
    // WASSCE and GBCE use the same grading system
    return ['Select Grade', 'A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9']
  }

  const getCreditPassInfo = () => {
    if (examinationType === 'SSSCE') {
      return 'For SSSCE, A-D are credit passes.'
    }
    return 'For WASSCE/GBCE, A1-C6 are credit passes.'
  }

  const gradeOptions = getGradeOptions()

  return (
    <div className="border-4 border-yellow-500 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          4
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Subject Grades
        </h3>
      </div>
      
      {/* Information Box */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          <strong>Select your grades.</strong> {getCreditPassInfo()}
        </p>
      </div>

      {/* Core Subjects */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-4">Core Subjects (Required)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Language (Core) *
            </label>
            <select
              value={grades.english}
              onChange={(e) => onChange('english', e.target.value)}
              className="w-full px-3 py-2 border-2 border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {gradeOptions.map(option => (
                <option key={option} value={option === 'Select Grade' ? '' : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Core Mathematics *
            </label>
            <select
              value={grades.mathematics}
              onChange={(e) => onChange('mathematics', e.target.value)}
              className="w-full px-3 py-2 border-2 border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {gradeOptions.map(option => (
                <option key={option} value={option === 'Select Grade' ? '' : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Integrated Science / Social Studies *
            </label>
            <select
              value={grades.science}
              onChange={(e) => onChange('science', e.target.value)}
              className="w-full px-3 py-2 border-2 border-teal-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {gradeOptions.map(option => (
                <option key={option} value={option === 'Select Grade' ? '' : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Elective Subjects */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4">Elective Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elective Subject 1
            </label>
            <select
              value={grades.elective1}
              onChange={(e) => onChange('elective1', e.target.value)}
              className="w-full px-3 py-2 border-2 border-pink-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              {gradeOptions.map(option => (
                <option key={option} value={option === 'Select Grade' ? '' : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elective Subject 2
            </label>
            <select
              value={grades.elective2}
              onChange={(e) => onChange('elective2', e.target.value)}
              className="w-full px-3 py-2 border-2 border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {gradeOptions.map(option => (
                <option key={option} value={option === 'Select Grade' ? '' : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Elective Subject 3
            </label>
            <select
              value={grades.elective3}
              onChange={(e) => onChange('elective3', e.target.value)}
              className="w-full px-3 py-2 border-2 border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {gradeOptions.map(option => (
                <option key={option} value={option === 'Select Grade' ? '' : option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectGradesForm
