
import React from 'react';
import { Target, Compass, Lightbulb, Zap, Gem, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';

const VisionMission: React.FC = () => {
  return (
    <div className="bg-white dark:bg-tuc-midnight min-h-screen font-sans">
      {/* Breadcrumbs Navigation */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ol className="flex text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <li>
              <a 
                href="#/" 
                className="hover:text-tuc-forest transition-colors focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                aria-label="Return to Home page"
                title="Go to Home"
              >
                Home
              </a>
            </li>
            <li className="mx-3 opacity-30">/</li>
            <li>About TUC</li>
            <li className="mx-3 opacity-30">/</li>
            <li className="text-tuc-gold">Vision & Mission</li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative py-24 lg:py-32 bg-tuc-forest overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://aucdt.edu.gh/wp-content/uploads/2020/11/Students-Interacting-with-lecturer.jpg')] bg-cover bg-center opacity-20 grayscale scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-tuc-forest via-tuc-forest/80 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <span className="text-tuc-gold font-black uppercase tracking-[0.5em] text-xs">Our North Star</span>
            <h1 className="text-5xl md:text-8xl font-black text-white mt-4 uppercase tracking-tighter leading-[0.9] mb-8">
              Vision, Mission & <br /> Philosophy
            </h1>
            <p className="text-white/70 text-lg font-medium max-w-xl leading-relaxed">
              At Techbridge University College, we are guided by a singular purpose: to bridge the gap between creative intelligence and industrial mastery.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Vision Card */}
          <div className="bg-tuc-ivory dark:bg-gray-800 p-12 lg:p-16 rounded-[4rem] shadow-2xl border border-tuc-forest/5 group flex flex-col items-start text-left">
            <div className="bg-tuc-forest p-5 rounded-3xl w-fit mb-10 shadow-lg transform group-hover:rotate-12 transition-transform duration-500">
              <Compass size={40} className="text-tuc-gold" />
            </div>
            <h2 className="text-3xl font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-tighter mb-8">Our Vision</h2>
            <p className="text-2xl md:text-3xl text-tuc-stone dark:text-gray-100 font-black leading-tight">
              To become an internationally reputable centre for <span className="text-tuc-forest dark:text-white underline decoration-tuc-gold decoration-4 underline-offset-8">Design Education and Research.</span>
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white dark:bg-gray-800 p-12 lg:p-16 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-gray-700 group flex flex-col items-start text-left">
            <div className="bg-tuc-gold p-5 rounded-3xl w-fit mb-10 shadow-lg transform group-hover:-rotate-12 transition-transform duration-500">
              <Target size={40} className="text-tuc-forest" />
            </div>
            <h2 className="text-3xl font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-tighter mb-8">Our Mission</h2>
            <p className="text-xl md:text-2xl text-tuc-stone dark:text-gray-300 font-bold leading-relaxed">
              To train both professional and non-professional artisans as well as conduct research and disseminate knowledge and contribute to <span className="text-tuc-forest dark:text-tuc-gold">technical/vocational education</span> policy formulation and development.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Objectives */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-tuc-forest dark:text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Strategic Path</span>
            <h2 className="text-4xl lg:text-5xl font-black text-tuc-forest dark:text-white mt-4 uppercase tracking-tighter">Institutional Objectives</h2>
            <div className="w-24 h-1.5 bg-tuc-gold mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { id: '01', text: 'To provide university and professional education through teaching, learning and research.' },
              { id: '02', text: 'To provide skills that will enhance creative and analytical thinking abilities.' },
              { id: '03', text: 'To acquire and disseminate knowledge and information.' },
              { id: '04', text: 'To institute relationship with relevant institutions and bodies that share the vision and mission.' }
            ].map((obj) => (
              <div key={obj.id} className="flex gap-8 items-center bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl group text-left">
                <span className="text-5xl font-black text-tuc-gold/20 italic group-hover:text-tuc-gold/40 transition-colors">{obj.id}</span>
                <p className="text-lg text-tuc-stone dark:text-gray-300 font-bold leading-snug">{obj.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="py-24 lg:py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-24">
          <span className="text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">The Bridge Foundation</span>
          <h2 className="text-4xl md:text-6xl font-black text-tuc-forest dark:text-white mt-4 uppercase tracking-tighter">Our Philosophy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Pillar 1 */}
          <div className="text-center group flex flex-col items-center">
            <div className="w-32 h-32 flex items-center justify-center bg-tuc-ivory dark:bg-gray-800 rounded-[3rem] mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Gem size={48} className="text-tuc-forest dark:text-tuc-gold" />
            </div>
            <h3 className="text-2xl font-black text-tuc-forest dark:text-white uppercase tracking-tighter mb-6">Natural Resources</h3>
            <p className="text-tuc-stone dark:text-gray-400 font-medium leading-relaxed max-w-xs">
              Graduates will be equipped with the technical know-how to add value to our natural resources, bridging the gap between raw potential and refined global product.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="text-center group flex flex-col items-center">
            <div className="w-32 h-32 flex items-center justify-center bg-tuc-forest rounded-[3rem] mb-10 shadow-2xl group-hover:scale-110 group-hover:-rotate-6 transition-all">
              <Lightbulb size={48} className="text-tuc-gold" />
            </div>
            <h3 className="text-2xl font-black text-tuc-forest dark:text-white uppercase tracking-tighter mb-6">Innovation Spirit</h3>
            <p className="text-tuc-stone dark:text-gray-400 font-medium leading-relaxed max-w-xs">
              Graduates shall be grounded not only to be leaders in design innovation and creativity but also to develop an entrepreneurial spirit able to change the industrial status quo.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="text-center group flex flex-col items-center">
            <div className="w-32 h-32 flex items-center justify-center bg-tuc-gold rounded-[3rem] mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
              <GraduationCap size={48} className="text-tuc-forest" />
            </div>
            <h3 className="text-2xl font-black text-tuc-forest dark:text-white uppercase tracking-tighter mb-6">Imparted Wisdom</h3>
            <p className="text-tuc-stone dark:text-gray-400 font-medium leading-relaxed max-w-xs">
              Success is assured through the impartation of wisdom built on sustainable design thinking processes, empowering graduates to build a nation for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-tuc-forest text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-10">Commit to Excellence</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href="https://portal.aucdt.edu.gh/admissions/#/home"
              className="inline-flex items-center gap-4 bg-tuc-gold text-tuc-forest px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl focus:outline-none focus:ring-4 focus:ring-white"
              aria-label="Start your journey by applying for admission"
              title="Start Your Journey"
            >
              Start Your Journey <Zap size={20} />
            </a>
            <a 
              href="#/academics"
              className="inline-flex items-center gap-4 border-2 border-white/30 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:border-white transition-all focus:outline-none focus:ring-4 focus:ring-white"
              aria-label="View academic programmes"
              title="View Programmes"
            >
              View Programmes <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisionMission;
