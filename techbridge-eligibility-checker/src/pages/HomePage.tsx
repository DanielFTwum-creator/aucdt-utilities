import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-[#6B1028] text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to TUC
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Techbridge University College
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Check your eligibility for our innovative design and technology programmes. 
              We offer cutting-edge education in Jewellery Design, Fashion Design, 
              Digital Media & Communication Design, and Product Design & Entrepreneurship.
            </p>
            <Link
              to="/eligibility"
              className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check Your Eligibility
            </Link>
          </div>
        </div>
      </div>

      {/* Programmes Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Programmes</h2>
          <p className="text-lg text-gray-600">
            Discover our innovative design and technology programmes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Program Cards */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              JDT - Jewellery Design Technology
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Master the art and technology of modern jewellery design and manufacturing.
            </p>
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block">
              Degree • Diploma • Certificate
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4">👗</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              FDT - Fashion Design Technology
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Combine creativity with technology in the world of fashion design and production.
            </p>
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block">
              Degree • Certificate
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              DMCD - Digital Media & Communication Design
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Create compelling digital experiences and visual communication solutions.
            </p>
            <div className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full inline-block">
              Degree • Certificate
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              PDE - Product Design & Entrepreneurship
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Design innovative products and develop entrepreneurial skills for business success.
            </p>
            <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full inline-block">
              Degree • Diploma • Certificate
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Check if you meet the admission requirements for your chosen programme.
            Our eligibility checker will guide you through the process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/eligibility"
              className="px-8 py-4 bg-primary hover:bg-[#6B1028] text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Check Eligibility Now
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-primary font-semibold rounded-lg border-2 border-primary transition-colors duration-200"
            >
              Learn More About TUC
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
