import React from 'react';

const Accreditation: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-10 text-center">Accreditation and Affiliation</h3>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          <div className="w-48 md:w-64 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
            <img 
                src="https://aucdt.edu.gh/wp-content/uploads/2021/05/Ghana-Tertiary-Education-Commission.png" 
                alt="GTEC" 
                className="w-full h-auto"
            />
          </div>
          <div className="w-48 md:w-64 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
            <img 
                src="https://aucdt.edu.gh/wp-content/uploads/2021/05/UEW_logo.jpg" 
                alt="UEW" 
                className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accreditation;
