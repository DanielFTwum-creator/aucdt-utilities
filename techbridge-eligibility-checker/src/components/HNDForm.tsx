import { HNDData } from '../types/forms'

interface HNDFormProps {
  data: HNDData
  onChange: (field: keyof HNDData, value: string) => void
}

const HNDForm = ({ data, onChange }: HNDFormProps) => {
  const hndClasses = [
    'First Class',
    'Second Class Upper',
    'Second Class Lower',
    'Pass'
  ]

  return (
    <div className="border-4 border-yellow-500 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          4
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          HND Requirements
        </h3>
      </div>

      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-sm text-yellow-800 mb-4">
          <strong>Higher National Diploma Qualification</strong><br />
          Please select your HND classification below.
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            HND Class *
          </label>
          <div className="space-y-3">
            {hndClasses.map((classType) => (
              <label key={classType} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="hndClass"
                  value={classType}
                  checked={data.class === classType}
                  onChange={(e) => onChange('class', e.target.value)}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-gray-700 font-medium">{classType}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All HND classifications are eligible for admission to our First Degree programmes.
            Your HND will be evaluated for advanced standing and credit transfer opportunities.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HNDForm
