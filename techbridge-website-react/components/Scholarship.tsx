import React from 'react';

const Scholarship: React.FC = () => {
  return (
    <section className="relative bg-tuc-maroon text-white py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-tuc-gold tracking-wide">
          SCHOLARSHIP
        </h1>
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-lg md:text-xl font-light leading-relaxed">
            Techbridge Minerals Scholarship for the 2025 Academic Year. The Scholarship is for Undergraduate Degree study at Techbridge University College offered to Ghanaian citizens.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="#top" 
            className="border-2 border-tuc-gold text-tuc-gold px-8 py-3 rounded font-bold hover:bg-tuc-gold hover:text-tuc-maroon transition-all duration-300 uppercase"
          >
            Read More
          </a>
          <a 
            href="#top" 
            className="border-2 border-white text-white px-8 py-3 rounded font-bold hover:bg-white hover:text-tuc-maroon transition-all duration-300 uppercase"
          >
            Download Form
          </a>
        </div>
      </div>
    </section>
  );
};

export default Scholarship;