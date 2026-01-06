import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-tuc-beige dark:bg-tuc-dark/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Content */}
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-tuc-maroon dark:text-tuc-gold uppercase tracking-tighter">
              Bridge the Gap Today
            </h2>
            <div className="text-tuc-slate dark:text-gray-300 leading-relaxed space-y-4 text-lg font-medium">
              <p>
                At Techbridge University College (TUC), we believe education should be a direct conduit to professional success. Our programs in Design Computing, Digital Media, and Fashion Technology are built to empower the next generation of industrial leaders.
              </p>
              <p>
                With world-class faculty and cutting-edge laboratory facilities at our Oyibi campus, your creative journey is supported by technical excellence. Join a community that values innovation, sustainability, and industrial impact.
              </p>
            </div>
            <div className="pt-4">
              <a 
                href="#coming-soon" 
                className="inline-flex items-center bg-white dark:bg-gray-800 text-tuc-maroon dark:text-tuc-gold font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-tuc-maroon/20 hover:scale-105 transition-all border border-gray-100 dark:border-gray-700 uppercase tracking-widest text-sm"
              >
                Download Brochure
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/3 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border-t-8 border-tuc-maroon text-center space-y-8">
            <h3 className="text-2xl font-black text-tuc-maroon dark:text-tuc-gold leading-tight uppercase">
              January 2026 Admissions
            </h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Apply before the deadline</p>
            <a 
              href="https://portal.aucdt.edu.gh/admissions/#/home"
              className="block w-full bg-tuc-maroon text-white font-black text-lg px-8 py-5 rounded-2xl shadow-lg hover:bg-tuc-gold hover:text-tuc-maroon transition-all transform hover:-translate-y-1 uppercase tracking-tighter"
            >
              Start Application
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;