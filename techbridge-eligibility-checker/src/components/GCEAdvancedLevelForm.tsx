import { GCEAdvancedData } from '../types/forms'

interface GCEAdvancedLevelFormProps {
  data: GCEAdvancedData
  onChange: (field: keyof GCEAdvancedData, value: any) => void
}

const GCEAdvancedLevelForm = ({ data, onChange }: GCEAdvancedLevelFormProps) => {
  return (
    <div className="border-4 border-purple-500 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          4
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          GCE Advanced Level Requirements
        </h3>
      </div>

      <div className="space-y-6">
        {/* A-Level Requirements */}
        <div className="bg-purple-50 p-4 rounded-md">
          <h3 className="text-md font-semibold text-gray-700 mb-4">Advanced Level Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of A-Level Passes (A-E) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={data.aLevelPasses || ''}
                onChange={(e) => onChange('aLevelPasses', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter number of passes"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                At least one pass Grade D or better? *
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gradeDOrBetter"
                    checked={data.gradeDOrBetter === true}
                    onChange={() => onChange('gradeDOrBetter', true)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gradeDOrBetter"
                    checked={data.gradeDOrBetter === false}
                    onChange={() => onChange('gradeDOrBetter', false)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* O-Level Requirements */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-md font-semibold text-gray-700 mb-4">Ordinary Level Requirements</h3>
          <p className="text-sm text-blue-800 mb-4">
            Credit passes (Grade 6 or better) in 5 O-Level subjects.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of O-Level Credit Passes (Grade 6 or better) *
              </label>
              <input
                type="number"
                min="0"
                max="15"
                value={data.oLevelPasses || ''}
                onChange={(e) => onChange('oLevelPasses', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter number of credit passes"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O-Level English Credit? *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="oLevelEnglish"
                    checked={data.oLevelEnglish === true}
                    onChange={() => onChange('oLevelEnglish', true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="oLevelEnglish"
                    checked={data.oLevelEnglish === false}
                    onChange={() => onChange('oLevelEnglish', false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O-Level Mathematics Credit? *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="oLevelMath"
                    checked={data.oLevelMath === true}
                    onChange={() => onChange('oLevelMath', true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="oLevelMath"
                    checked={data.oLevelMath === false}
                    onChange={() => onChange('oLevelMath', false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O-Level Science/Arts Subject Credit? *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="oLevelScience"
                    checked={data.oLevelScience === true}
                    onChange={() => onChange('oLevelScience', true)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="oLevelScience"
                    checked={data.oLevelScience === false}
                    onChange={() => onChange('oLevelScience', false)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GCEAdvancedLevelForm
