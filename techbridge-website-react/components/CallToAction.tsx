import { Download } from 'lucide-react';
import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Content */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-tuc-green via-tuc-gold to-tuc-green animate-pulse mb-4">
                What are you waiting for?
              </h2>
              <div className="w-20 h-1 bg-tuc-gold"></div>
            </div>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Are you looking to pursue your passion for design? Look no further than TUC! Our accredited degree programmes in Fashion Design, Jewellery Design Technology, Digital Media and Communication Design, and Product Design are designed to help you achieve your dreams.
              </p>
              <p>
                Our experienced faculty and cutting-edge facilities provide a top-notch education, while our affordable tuition ensures that you won't break the bank. Don't wait - apply today and start your journey towards a fulfilling career in design!
              </p>
            </div>

            <div className="mt-8">
              <a 
                href="#top" 
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-2 border-gray-200 dark:border-gray-700 px-6 py-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                <Download size={18} />
                Download Brochure
              </a>
            </div>
          </div>

          {/* Right CTA */}
          <div className="lg:w-1/3 flex flex-col justify-center items-start lg:items-end">
             <h2 className="text-2xl md:text-3xl font-bold text-tuc-green mb-6 lg:text-right leading-tight">
                YOUR CAREER TRAINING STARTS HERE!
             </h2>
             <a 
               href="https://portal.tuc.edu.gh/admissions/#/home" 
               className="bg-tuc-gold text-tuc-maroon font-bold text-lg px-8 py-4 rounded shadow-lg hover:bg-tuc-maroon hover:text-tuc-gold transition-all duration-300 transform hover:-translate-y-1"
             >
               APPLY NOW!
             </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;