import React from 'react';

const EntryRequirements: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-aucdt-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Decorative Sidebar */}
          <div className="lg:w-1/4 bg-aucdt-secondary p-8 flex items-center justify-center min-h-[150px] lg:min-h-0">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-aucdt-primary transform lg:-rotate-90 whitespace-nowrap tracking-widest uppercase">
              Creativity
            </h2>
          </div>
          
          {/* Requirements Content */}
          <div className="lg:w-3/4 p-8 md:p-12">
            <h2 className="text-4xl font-extrabold text-aucdt-primary mb-8">Entry Requirements</h2>
            <div className="space-y-6 text-aucdt-dark-text">
              <div>
                <h3 className="font-bold text-lg text-aucdt-primary">SSSCE Candidates</h3>
                <p>Credit Passes (A-D) in six (6) subjects comprising three core subjects, including English Language and Mathematics, plus three (3) relevant elective subjects.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-aucdt-primary">WASSCE Candidates</h3>
                <p>Credit Passes (A1-C6) in six (6) subjects comprising three core subjects, including English Language and Mathematics, plus three (3) relevant elective subjects.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-aucdt-primary">GCE Advanced Level Candidates</h3>
                <p>Passes in three (3) subjects (at least, one of the passes should be Grade D or better). Also, the applicant must have had credit passes (Grade 6) in five GCE Ordinary Level subjects including English Language, Mathematics and a Science subject (for non-science students) and an Arts subject (for Science students).</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-aucdt-primary">Mature Students' Entry</h3>
                <p>An applicant must be at least 25 years old, and show proof of age with legitimate documentary. Mature students entry avenues to tertiary education provide opportunities for people who could not do so earlier in their lives to further their education at the tertiary level after some years in the workplace. Check our website for more details.</p>
              </div>
               <div>
                <h3 className="font-bold text-lg text-aucdt-primary">International Students</h3>
                <p>All international qualifications will be referred to the Ghana Tertiary Education Commission (GTEC) for determination of equivalences and eligibility for admission.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntryRequirements;
