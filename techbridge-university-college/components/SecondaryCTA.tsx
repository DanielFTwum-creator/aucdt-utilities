import React from 'react';

const SecondaryCTA: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-2/3">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
            Get to know what it takes to be a TUC Student
          </h3>
        </div>
        <div className="md:w-1/3 flex justify-end">
           <a 
                href="#coming-soon" 
                className="inline-block bg-tuc-gold text-tuc-maroon font-semibold px-8 py-3 rounded shadow-md hover:shadow-lg hover:bg-tuc-maroon hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                Download Brochure
            </a>
        </div>
      </div>
    </section>
  );
};

export default SecondaryCTA;