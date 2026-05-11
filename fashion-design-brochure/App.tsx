
import React, { useState } from 'react';

// Fix: Define interfaces for the curriculum data structure to provide strong types.
// This resolves the error "Property 'map' does not exist on type 'unknown'"
// by ensuring TypeScript knows that 'courses' is an array.
interface Course {
  code: string;
  title: string;
  hours: number;
}

interface SemesterData {
  [semester: string]: Course[];
}

interface CurriculumData {
  [year: string]: SemesterData;
}


// --- DATA ---
const curriculumData: CurriculumData = {
  'Year One': {
    'Semester One': [
      { code: 'FDT 151', title: 'Introduction to Fashion', hours: 2 },
      { code: 'FDT 153', title: 'Introduction to Textile Design', hours: 2 },
      { code: 'FDT 155', title: 'Pattern Making', hours: 2 },
      { code: 'FDT 157', title: 'Sewing Techniques', hours: 3 },
      { code: 'FDT 159', title: 'Introduction to Textiles', hours: 2 },
      { code: 'ACDT 114', title: 'Basic Drawing', hours: 3 },
      { code: 'ACDT 117', title: 'Information Communication Technology I', hours: 2 },
      { code: 'ACDT 115', title: 'Introduction to African Art & Culture', hours: 2 },
      { code: 'ACDT 116', title: 'Communication and Study Skills I', hours: 3 },
    ],
    'Semester Two': [
      { code: 'FDT 150', title: 'Introduction to Creative Design in Fashion', hours: 2 },
      { code: 'FDT 152', title: 'Textile Design', hours: 2 },
      { code: 'FDT 154', title: 'Pattern Adaptation', hours: 3 },
      { code: 'FDT 156', title: 'Garment Construction', hours: 3 },
      { code: 'FDT 158', title: 'Freehand Cutting', hours: 3 },
      { code: 'FDT 160', title: 'Basic Design', hours: 2 },
      { code: 'ACDT 127', title: 'Information Communication Technology II', hours: 2 },
      { code: 'ACDT 126', title: 'Communication and Study Skills II', hours: 2 },
      { code: '*WEL 150', title: 'Industrial Attachment I', hours: 0 },
    ],
  },
  'Year Two': {
    'Semester One': [
        { code: 'FDT 251', title: 'Creative Design in Fashion', hours: 3 },
        { code: 'FDT 253', title: 'Printed Textile Design Application', hours: 4 },
        { code: 'FDT 255', title: 'Pattern Technology I', hours: 3 },
        { code: 'FDT 257', title: 'Garment Technology I', hours: 3 },
        { code: 'FDT 259', title: 'Introduction to Fabric Studies', hours: 3 },
        { code: 'FDT 261', title: 'Fashion Illustration', hours: 3 },
        { code: 'FDT 263', title: 'Basic Computer Aided Design', hours: 2 },
        { code: 'FDT 265', title: 'Introduction to Fashion Accessories', hours: 3 },
        { code: 'FTD 267', title: 'Introduction to Production Management', hours: 2 },
    ],
    'Semester Two': [
        { code: 'FDT 250', title: 'Basic Fashion Design and Illustration', hours: 2 },
        { code: 'FDT 252', title: 'Pattern Technology II', hours: 3 },
        { code: 'FDT 254', title: 'Garment Technology II', hours: 3 },
        { code: 'FDT 256', title: 'Fabric Studies', hours: 2 },
        { code: 'FDT 258', title: 'Millinery Design and Production', hours: 3 },
        { code: 'FDT 260', title: 'Computer Aided Design', hours: 2 },
        { code: 'FDT 262', title: 'Fashion Marketing', hours: 2 },
        { code: 'FDT 264', title: 'Production Management', hours: 2 },
        { code: '*WEL 250', title: 'Industrial Attachment', hours: 0 },
    ],
  },
  'Year Three': {
    'Semester One': [
      { code: 'FDT 351', title: 'Design and Illustration', hours: 3 },
      { code: 'FDT 353', title: 'Garment Decoration Techniques', hours: 2 },
      { code: 'FDT 355', title: 'Pattern Alteration', hours: 2 },
      { code: 'FDT 357', title: 'Fashion Draping', hours: 3 },
      { code: 'FDT 359', title: 'Design and Production of Bags and Slippers', hours: 2 },
      { code: 'FDT 361', title: 'Entrepreneurship I', hours: 2 },
      { code: 'FDT 363', title: 'Seminar in Fashion', hours: 2 },
      { code: 'ACDT 367', title: 'Research Methods', hours: 2 },
    ],
    'Semester Two': [
      { code: 'WEL 350', title: 'Industrial Attachment III', hours: 18 },
      { code: 'FDT 352', title: 'Research Methods/Seminar', hours: 3 },
    ],
  },
  'Year Four': {
    'Semester One': [
      { code: 'FDT 451', title: 'Collection Development', hours: 5 },
      { code: 'FDT 453', title: 'Quality Control in Garment Production', hours: 2 },
      { code: 'FDT 455', title: 'Beauty Culture', hours: 3 },
      { code: 'FDT 457', title: 'Entrepreneurship II', hours: 2 },
      { code: 'FDT 459', title: 'Thesis/ Project I', hours: 3 },
    ],
    'Semester Two': [
      { code: 'FDT 450', title: 'Final Collection Development', hours: 3 },
      { code: 'FDT 452', title: 'Portfolio Development and Exhibition', hours: 5 },
      { code: 'FDT 454', title: 'Salesmanship and Sales Management', hours: 2 },
      { code: 'FDT 457', title: 'Fashion Merchandising', hours: 2 },
      { code: 'FDT 464', title: 'Thesis/ Project II', hours: 3 },
    ],
  },
};

// Fix: Add explicit prop types for the Objective component for better type safety.
interface ObjectiveProps {
  num: number;
  text: string;
}

const Objective: React.FC<ObjectiveProps> = ({ num, text }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-10 h-10 bg-[#6C242D] text-white flex items-center justify-center font-bold text-xl">
      {num}
    </div>
    <p className="mt-1">{text}</p>
  </div>
);

const App: React.FC = () => {
  const [activeYear, setActiveYear] = useState('Year One');

  return (
    <div className="bg-[#F9F6EE] text-[#6C242D] min-h-screen overflow-x-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-10 p-4 sm:p-8">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold uppercase">
             AUCDT
          </div>
          <a href="#contact" className="bg-[#FDBB30] text-[#6C242D] font-bold py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors">
            Apply Now
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-[#F9F6EE] overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute top-[-20%] right-[-30%] w-[80%] h-[120%] bg-white/70 rounded-[50%] "></div>
          </div>
          <div className="container mx-auto px-4 sm:px-8 relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                  <p className="text-lg font-semibold">BTech</p>
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight">Fashion</h1>
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight">Design</h1>
                  <h1 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight text-white" style={{WebkitTextStroke: '2px #6C242D'}}>Technology</h1>
                  <div className="mt-8">
                      <h2 className="text-4xl font-bold">Academic Brochure</h2>
                      <ul className="mt-4 space-y-1 text-left inline-block">
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> Overview of the Fashion Design programme</li>
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> Entry Requirements</li>
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> How to Apply etc</li>
                          <li className="flex items-center"><span className="text-[#6C242D] mr-2">■</span> What you will learn</li>
                      </ul>
                  </div>
              </div>
              <div className="relative h-[500px] md:h-auto">
                <div className="absolute -bottom-16 -left-16 w-full h-full bg-[#FDBB30] rounded-[50%] z-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="A smiling fashion design student" 
                  className="relative z-10 w-full h-full object-cover rounded-lg shadow-2xl"
                />
              </div>
          </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-2 inline-block mb-8">
              <h2 className="text-5xl font-bold p-4 bg-[#FDBB30] inline-block">WELCOME</h2><br/>
              <h2 className="text-5xl font-bold p-4 bg-[#FDBB30] inline-block">TO OUR</h2><br/>
              <h2 className="text-5xl font-bold p-4 bg-[#FDBB30] inline-block">DEPARTMENT</h2>
            </div>
            <p className="text-lg leading-relaxed">The Department of Fashion Design is offering a Four (4) year Bachelor of Technology (BTech) Fashion Design Technology programme. This programme offers students access to state of the art fashion design equipment, tools, studios, machines, professional staff, internship opportunities and entrepreneurial skills.</p>
            <p className="text-lg leading-relaxed mt-4">The new academic year provides a platform for outstanding education in nurturing a generation of highly skilled fashion design professionals, and we hope that you will join us in our world-class facilities for our dynamic new season. You will experience high caliber works by our faculty and students as well as professional exhibitions.</p>
          </div>
        </div>
      </section>

      {/* Programme Objectives */}
      <section className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-[#F9F6EE] absolute -top-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-5xl font-bold mb-4">Aim of the Programme</h3>
            <p>The aim of this programme is embodied in the Vision and Mission of AsanSka University College of Design and Technology (AUCDT); that is, to become a centre of excellence for the training of Fashion and textile designers and to collaborate with industry and research institutions in the areas of design and technology education fuelled by research and entrepreneurship.</p>
            <h3 className="text-5xl font-bold mt-12 mb-6">Objectives of the Programme</h3>
            <div className="space-y-6">
              <Objective num={1} text="Encourage the students to apply modern technology to indigenous themes to create new designs that will contribute to a sustainable evolution from traditional/cottage industries to modern artisanal manufacturing industries." />
              <Objective num={2} text="Provide our students an opportunity to give vent to their creative ideas through Fashion design as a profession." />
              <Objective num={3} text="Develop a group of competent professional Fashion designers able to contribute to the changing aesthetics in the Ghanaian Fashion industry." />
              <Objective num={4} text="Serve as a conduit for those who have established careers in other disciplines but who seek to change their professional direction by acquiring new skills in Fashion design." />
            </div>
          </div>
          <div className="relative h-[600px]">
             <div className="absolute bottom-0 -right-20 w-full h-full bg-[#FDBB30] rounded-lg rotate-[-6deg] z-0"></div>
             <img src="https://images.unsplash.com/photo-1549062327-514555567303?q=80&w=800&auto=format&fit=crop" alt="Fashion student working on a mannequin" className="relative z-10 w-full h-full object-cover rounded-lg shadow-xl" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-[#F9F6EE] absolute -bottom-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
      </section>
      
      {/* Course Curriculum */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-8">
            <h2 className="text-6xl sm:text-8xl font-black text-center mb-12" style={{ fontFamily: "'Dancing Script', cursive", fontStyle: 'italic' }}>Course Curriculum</h2>
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg">
                <div className="flex flex-wrap justify-center border-b-2 border-[#FDB813] mb-6">
                    {Object.keys(curriculumData).map(year => (
                        <button key={year} onClick={() => setActiveYear(year)} className={`py-3 px-6 text-lg font-bold transition-colors ${activeYear === year ? 'bg-[#FDB813] text-[#6C242D]' : 'text-gray-500 hover:text-[#6C242D]'}`}>
                            {year}
                        </button>
                    ))}
                </div>
                <div>
                    {activeYear && curriculumData[activeYear] && Object.entries(curriculumData[activeYear]).map(([semester, courses]) => (
                        <div key={semester} className="mb-8">
                            <h3 className="text-2xl font-bold mb-4">{semester}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#FDB813]">
                                        <tr>
                                            <th className="p-3">No.</th>
                                            <th className="p-3">Course Code</th>
                                            <th className="p-3 w-1/2">Course Title</th>
                                            <th className="p-3 text-right">Credit Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => (
                                            <tr key={course.code} className="border-b border-gray-200">
                                                <td className="p-3">{index + 1}.</td>
                                                <td className="p-3">{course.code}</td>
                                                <td className="p-3">{course.title}</td>
                                                <td className="p-3 text-right">{course.hours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Entry Requirements */}
      <section className="py-20 sm:py-32 bg-[#6C242D] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-[#F9F6EE] absolute -top-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
         <div className="container mx-auto px-4 sm:px-8">
            <h2 className="text-6xl font-black mb-8">Entry Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">SSSCE Candidates</h4>
                        <p>Credit Passes (A-D) in six (6) subjects comprising three core subjects, including English Language and Mathematics, plus three (3) relevant elective subjects.</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">WASSCE Candidates</h4>
                        <p>Credit Passes (A1-C6) in six (6) subjects comprising three core subjects, including English Language and Mathematics, plus three (3) relevant elective subjects.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">GCE Advanced Level Candidates</h4>
                        <p>Passes in three (3) subjects (at least, one of the passes should be Grade D or better). Also, the applicant must have had credit passes (Grade 6) in five GCE Ordinary Level subjects.</p>
                    </div>
                </div>
                 <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">Mature Students' Entry</h4>
                        <p>An applicant must be at least 25 years old, and show proof of age with legitimate documentary. Check our website for more details.</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">International Students</h4>
                        <p>All international qualifications will be referred to the Ghana Tertiary Education Commission (GTEC) for determination of equivalences and eligibility for admission.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-[#FDBB30] mb-2">Other Professional Qualifications</h4>
                        <p>ICA, ACCA, CIM may contact us for admission placement.</p>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* How to Apply */}
      <section id="contact" className="py-20 sm:py-32 bg-white relative">
        <div className="container mx-auto px-4 sm:px-8 text-center">
            <div className="bg-[#FDBB30] p-8 sm:p-12 inline-block">
              <h2 className="text-6xl font-black">HOW TO APPLY!</h2>
              <p className="text-xl font-semibold mt-2">FOLLOW THESE STEPS TO JOIN OUR COMMUNITY OF CREATIVE THINKERS</p>
            </div>
            <div className="mt-12 max-w-4xl mx-auto grid sm:grid-cols-2 gap-8 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">1</div>
                  <p>Admissions will be open for each Academic Year and applying to this programme is free. Check that your qualifications are accepted and your grades meet the entry requirements.</p>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">2</div>
                  <p>Fill and Submit the application form by using our online portal. You will be notified by email within 48 hours when an application is successfully submitted.</p>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">3</div>
                  <p>Each application will be reviewed by the admissions team to select qualified applicants. Successful applicants shall be notified about their admission status when all requirements have been met.</p>
                </div>
                 <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#6C242D] text-white flex items-center justify-center font-bold text-2xl">4</div>
                  <div>
                    <p>You will receive an offer package in your mail with detailed information:</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Offer of Admission Letter</li>
                      <li>Fee Schedule</li>
                    </ul>
                  </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#6C242D] text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40">
            <div className="w-[150%] h-40 bg-white absolute -top-20 left-1/2 -translate-x-1/2 rounded-[50%]"></div>
        </div>
        <div className="absolute w-48 h-48 border-4 border-dashed border-[#FDBB30] rounded-full top-20 left-10"></div>
        <div className="absolute w-96 h-96 bg-[#FDBB30] rounded-full -bottom-40 -right-40 opacity-50"></div>
        <div className="container mx-auto px-4 sm:px-8 relative z-10 text-center">
            <h2 className="text-5xl font-black border-4 border-white inline-block p-6">AUCDT CONNECT</h2>
            <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="text-left">
                    <h3 className="text-2xl font-bold">AsanSka University College of Design and Technology</h3>
                    <p className="mt-2 text-lg">Location: Oyibi</p>
                    <p>Opposite Valleyview University</p>
                    <p>Off the Adenta-Dodowa Road</p>
                    <p>Accra Ghana</p>
                </div>
                 <div className="text-left md:text-right">
                    <p className="text-lg font-bold">CONTACT</p>
                    <p>+233 (0) 30 252 7959</p>
                    <p>+233 54 012 4400</p>
                    <p>+233 54 012 4488</p>
                    <p className="mt-4 text-lg font-bold">EMAIL</p>
                    <p>info@aucdt.edu.gh</p>
                    <p>admissions@aucdt.edu.gh</p>
                </div>
            </div>
            <p className="mt-12 text-sm opacity-70">The information contained in this brochure was updated in July 2022.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
