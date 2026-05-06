const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About TUC</h1>
          <p className="text-xl text-gray-600">
            Techbridge University College
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To provide world-class education in design and technology, fostering creativity, 
              innovation, and entrepreneurship. We are committed to developing skilled professionals 
              who can contribute meaningfully to Ghana's creative economy and the global marketplace.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To be the leading university college in West Africa for design and technology education, 
              recognised for excellence in teaching, research, and industry partnerships that drive 
              sustainable development and innovation.
            </p>
          </div>
        </div>

        {/* About Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose TUC?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-900 mb-3">🎓 Academic Excellence</h3>
              <p className="text-gray-700 mb-6">
                Our programmes are designed to meet international standards, combining theoretical 
                knowledge with practical skills. We maintain small class sizes to ensure 
                personalized attention and quality education.
              </p>

              <h3 className="text-xl font-semibold text-red-900 mb-3">🏭 Industry Partnerships</h3>
              <p className="text-gray-700 mb-6">
                We have strong partnerships with leading companies and organisations in the 
                design and technology sectors, providing students with internship opportunities 
                and real-world project experience.
              </p>

              <h3 className="text-xl font-semibold text-red-900 mb-3">🔬 Modern Facilities</h3>
              <p className="text-gray-700">
                Our campus features state-of-the-art laboratories, design studios, and 
                technology workshops equipped with the latest tools and software used 
                in the industry.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-red-900 mb-3">👨‍🏫 Expert Faculty</h3>
              <p className="text-gray-700 mb-6">
                Our faculty members are experienced professionals and academics who bring 
                both theoretical expertise and practical industry experience to the classroom.
              </p>

              <h3 className="text-xl font-semibold text-red-900 mb-3">🌍 Global Perspective</h3>
              <p className="text-gray-700 mb-6">
                We prepare students for the global marketplace with international exposure, 
                exchange programmes, and curriculum that reflects global best practices in 
                design and technology.
              </p>

              <h3 className="text-xl font-semibold text-red-900 mb-3">💼 Career Support</h3>
              <p className="text-gray-700">
                Our career services team provides comprehensive support including job 
                placement assistance, entrepreneurship guidance, and alumni networking 
                opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Programmes Overview */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Academic Programmes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-red-900 mb-3">First Degree Programmes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>JDT</strong> - Bachelor of Technology in Jewellery Design Technology</li>
                <li>• <strong>FDT</strong> - Bachelor of Technology in Fashion Design Technology</li>
                <li>• <strong>DMCD</strong> - Bachelor of Technology in Digital Media & Communication Design</li>
                <li>• <strong>PDE</strong> - Bachelor of Technology in Product Design & Entrepreneurship</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-red-900 mb-3">Diploma Programmes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>JDT</strong> - Diploma in Jewellery Design Technology</li>
                <li className="text-gray-400">• FDT - Not Available</li>
                <li className="text-gray-400">• DMCD - Not Available</li>
                <li>• <strong>PDE</strong> - Diploma in Product Design & Entrepreneurship</li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                * JDT and PDE offer Diploma level
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-red-900 mb-3">Certificate Programmes</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>JDT</strong> - Certificate in Jewellery Design Technology</li>
                <li>• <strong>FDT</strong> - Certificate in Fashion Design Technology</li>
                <li>• <strong>DMCD</strong> - Certificate in Digital Media & Communication Design</li>
                <li>• <strong>PDE</strong> - Certificate in Product Design & Entrepreneurship</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="text-lg font-semibold text-yellow-800 mb-2">Programme Code Legend</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-700">
              <p><strong>JDT:</strong> Jewellery Design Technology</p>
              <p><strong>FDT:</strong> Fashion Design Technology</p>
              <p><strong>DMCD:</strong> Digital Media & Communication Design</p>
              <p><strong>PDE:</strong> Product Design & Entrepreneurship</p>
            </div>
          </div>
        </div>

        {/* Admission Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Admission Requirements</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-red-900 mb-3">Entry Requirements</h3>
              <p className="text-gray-700 mb-4">
                We accept various qualifications for admission to our programmes:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• WASSCE (West African Senior School Certificate Examination)</li>
                <li>• SSSCE (Senior Secondary School Certificate Examination)</li>
                <li>• GBCE (General Business Certificate Examination)</li>
                <li>• GCE Advanced Level</li>
                <li>• Higher National Diploma (HND) - for degree programmes</li>
                <li>• Mature Student Entry - for candidates 25 years and above</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-red-900 mb-3">How to Apply</h3>
              <p className="text-gray-700 mb-4">
                Ready to join TUC? Follow these simple steps:
              </p>
              <ol className="space-y-2 text-gray-700">
                <li>1. Check your eligibility using our online eligibility checker</li>
                <li>2. Complete the online application form</li>
                <li>3. Submit required documents and certificates</li>
                <li>4. Pay the application fee</li>
                <li>5. Attend interview/entrance examination (if required)</li>
                <li>6. Receive admission decision</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
