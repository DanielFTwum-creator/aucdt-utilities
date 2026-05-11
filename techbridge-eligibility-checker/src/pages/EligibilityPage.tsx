import EligibilityChecker from '../components/EligibilityChecker'

const EligibilityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Eligibility Checker</h1>
          <p className="text-lg text-gray-600">
            Check if you meet the admission requirements for TUC programmes
          </p>
        </div>

        {/* Eligibility Checker Component */}
        <EligibilityChecker />
      </div>
    </div>
  )
}

export default EligibilityPage
