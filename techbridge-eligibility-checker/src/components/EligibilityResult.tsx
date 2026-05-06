import { EligibilityResult as ResultType } from '../types/forms'

interface EligibilityResultProps {
  result: ResultType
  onReset: () => void
}

const EligibilityResult = ({ result, onReset }: EligibilityResultProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Results Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg mb-6 p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Eligibility Results</h2>
        <p className="text-center text-gray-600">
          Your admission eligibility assessment for TUC
        </p>
      </div>

      {/* Results */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            result.eligible ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.eligible ? (
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 ${
            result.eligible ? 'text-green-600' : 'text-red-600'
          }`}>
            {result.message}
          </h2>
          
          {result.eligible && (
            <p className="text-lg text-gray-600">
              You meet the requirements for admission to TUC.
            </p>
          )}
        </div>

        {/* Details */}
        <div className={`p-6 rounded-lg mb-8 ${
          result.eligible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            result.eligible ? 'text-green-800' : 'text-red-800'
          }`}>
            Assessment Details
          </h3>
          <ul className="space-y-2">
            {result.details.map((detail, index) => (
              <li key={index} className={`flex items-start space-x-2 ${
                result.eligible ? 'text-green-700' : 'text-red-700'
              }`}>
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-current mt-2"></span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        {result.eligible && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Next Steps
            </h3>
            <div className="space-y-3 text-blue-700">
              <p className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Visit our admissions office or apply online at our official website</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Submit all required documents and completed application forms</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Pay the prescribed application fees</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <span>Wait for admission decision and further instructions</span>
              </p>
            </div>
            
            {/* Apply Now Button */}
            <div className="mt-6 text-center">
              <a
                href="https://portal.aucdt.edu.gh/admissions/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                APPLY NOW
              </a>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-medium">Admissions Office</p>
              <p>Techbridge University College</p>
              <p>Email: admissions@tuc.edu.gh</p>
            </div>
            <div>
              <p className="font-medium">Student Services</p>
              <p>Phone: +233 XXX XXX XXX</p>
              <p>Website: www.tuc.edu.gh</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-red-900 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Check Another Application
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </button>
          {result.eligible && (
            <button
              onClick={() => window.open('https://tuc.edu.gh', '_blank')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EligibilityResult
