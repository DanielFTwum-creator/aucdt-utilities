import React from 'react';

const Accreditation: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-tuc-gold font-black uppercase tracking-[0.3em] text-[10px]">Institutional Quality</span>
          <h3 className="text-2xl md:text-3xl font-black text-tuc-forest dark:text-white mt-2 uppercase tracking-tighter">Accreditation & Affiliation</h3>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          <div className="w-48 md:w-64 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
            <img 
                src="https://aucdt.edu.gh/wp-content/uploads/2021/05/Ghana-Tertiary-Education-Commission.png" 
                alt="Ghana Tertiary Education Commission (GTEC)" 
                title="Accredited by GTEC"
                className="w-full h-auto drop-shadow-md"
            />
          </div>
          <div className="w-48 md:w-64 grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
            <img 
                src="https://aucdt.edu.gh/wp-content/uploads/2021/05/UEW_logo.jpg" 
                alt="University of Education, Winneba (UEW)" 
                title="Affiliated with UEW"
                className="w-full h-auto drop-shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accreditation;
