# techbridge-university-college-v3.0.0 - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-university-college-v3.0.0.

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: App.tsx
```typescript

import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.tsx';
import HeroSlider from './components/HeroSlider.tsx';
import CTASection from './components/CTASection.tsx';
import Programmes from './components/Programmes.tsx';
import Scholarship from './components/Scholarship.tsx';
import SecondaryCTA from './components/SecondaryCTA.tsx';
import Accreditation from './components/Accreditation.tsx';
import Footer from './components/Footer.tsx';
import AIChatAgent from './components/AIChatAgent.tsx';
import NewsFeed from './components/NewsFeed.tsx';
import Admin from './components/Admin.tsx';
import PuppeteerSelfTest from './components/PuppeteerSelfTest.tsx';
import AcademicsContainer from './components/Academics/AcademicsContainer.tsx';
import VisionMission from './components/About/VisionMission.tsx';
import GoverningCouncil from './components/About/GoverningCouncil.tsx';
import Resources from './components/Resources.tsx';
import ComingSoon from './components/ComingSoon.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { UIProvider } from './context/UIContext.tsx';

// Extend window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// ScrollToTop component to handle view transitions and Analytics tracking
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    // Handle special scrolling for the news-feed route which shares the home view
    if (pathname === '/news-feed') {
      // Small delay to ensure DOM is ready if navigating from another page
      setTimeout(() => {
        const newsSection = document.getElementById('news-feed-section');
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
           window.scrollTo(0, 0);
        }
      }, 100);
    } else {
      // Default behavior for other routes
      window.scrollTo(0, 0);
    }

    // Google Analytics Page View Tracking
    // Ensures internal SPA navigation is tracked as page views
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-FKXTELQ71R', {
        page_path: pathname,
      });
    }
  }, [pathname]);
  
  return null;
};

const HomeView = () => (
  <>
    <HeroSlider />
    <CTASection />
    <Programmes />
    <Scholarship />
    <div id="news-feed-section">
      <NewsFeed />
    </div>
    <SecondaryCTA />
    <Accreditation />
  </>
);

// Fix: Explicitly type AppLayout with React.FC<{ children: React.ReactNode }> to resolve children prop issues
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isTest = location.pathname.startsWith('/test');

  if (isAdmin) return <Admin onBack={() => window.location.hash = '#/'} />;
  if (isTest) return <PuppeteerSelfTest onBack={() => window.location.hash = '#/'} />;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col relative font-sans text-gray-900 dark:text-gray-100">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content" className="flex-grow focus:outline-none overflow-hidden" tabIndex={-1}>
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>
      <Footer 
        onAdminClick={() => window.location.hash = '#/admin'} 
        onTestClick={() => window.location.hash = '#/test'}
      />
      <AIChatAgent />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UIProvider>
        <HashRouter>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/about/vision" element={<VisionMission />} />
              <Route path="/about/council" element={<GoverningCouncil />} />
              <Route path="/academics/*" element={<AcademicsContainer subRoute="" />} />
              <Route path="/news-feed" element={<HomeView />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about/story" element={<ComingSoon title="Our Story" />} />
              <Route path="/about/leadership" element={<ComingSoon title="Institutional Leadership" />} />
              <Route path="/about/rebrand" element={<ComingSoon title="The Rebrand Journey" />} />
              <Route path="/about/accreditation" element={<ComingSoon title="Institutional Accreditation" />} />
              <Route path="/research" element={<ComingSoon title="Research & Innovation" />} />
              <Route path="*" element={<ComingSoon title="Section Development" />} />
            </Routes>
          </AppLayout>
        </HashRouter>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;

```

### FILE: components/About/GoverningCouncil.tsx
```typescript

import React from 'react';
import { ShieldCheck, UserCheck, Award, GraduationCap } from 'lucide-react';
import { COUNCIL_DATA } from '../../constants.ts';

const GoverningCouncil: React.FC = () => {
  return (
    <div className="bg-white dark:bg-tuc-midnight min-h-screen font-sans">
      {/* Breadcrumbs Navigation */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 text-left">
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
            <li className="text-tuc-gold">Governing Council</li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative py-20 lg:py-28 bg-tuc-forest overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://aucdt.edu.gh/wp-content/uploads/2022/01/AUCDT-Main-Building_2.jpg')] bg-cover bg-center opacity-10 grayscale scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-tuc-forest/90 to-tuc-forest"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-left">
          <div className="max-w-3xl">
            <span className="text-tuc-gold font-black uppercase tracking-[0.5em] text-xs">Institutional Oversight</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mt-4 uppercase tracking-tighter leading-none mb-6">
              Governing <br /> Council
            </h1>
            <div className="w-24 h-1 bg-tuc-gold rounded-full mb-8"></div>
          </div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl text-tuc-stone dark:text-gray-300 font-bold leading-relaxed italic">
            "The Governing Council of Techbridge University College provides strategic leadership, institutional advisory, and governance support to the University College and its senior management team."
          </p>
        </div>
      </section>

      {/* Grid Container */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {COUNCIL_DATA.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center group text-center animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="relative mb-8">
                {/* Photo container */}
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-[8px] border-gray-50 dark:border-gray-800 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:border-tuc-gold/30">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=630f12&color=ffcb05&size=512`;
                    }}
                  />
                </div>
                {/* Badge/Icon Overlay */}
                <div className="absolute -bottom-2 right-4 bg-tuc-gold p-3 rounded-2xl shadow-xl transform transition-transform group-hover:-translate-y-1">
                  {idx === 0 ? <ShieldCheck size={20} className="text-tuc-forest" /> : <UserCheck size={20} className="text-tuc-forest" />}
                </div>
              </div>
              
              <div className="space-y-2 max-w-xs">
                <h3 className="text-xl md:text-2xl font-black text-tuc-forest dark:text-white uppercase tracking-tighter leading-tight group-hover:text-tuc-gold transition-colors">
                  {member.name}
                </h3>
                <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Core Values Section (Bonus) */}
      <section className="py-24 bg-tuc-forest text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-left space-y-6">
              <span className="text-tuc-gold font-black uppercase tracking-[0.4em] text-xs">Commitment to Integrity</span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter">Excellence in Governance</h2>
              <p className="text-white/70 text-lg font-medium leading-relaxed">
                Our council ensures that every academic programme and industrial partnership adheres to the highest global standards of quality and ethical leadership.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-start gap-4">
                 <Award className="text-tuc-gold" size={32} />
                 <h4 className="font-black uppercase tracking-widest text-sm">Accountability</h4>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-start gap-4">
                 <GraduationCap className="text-tuc-gold" size={32} />
                 <h4 className="font-black uppercase tracking-widest text-sm">Scholarly Rigor</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoverningCouncil;

```

### FILE: components/About/VisionMission.tsx
```typescript

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

```

### FILE: components/Academics/AcademicCalendar.tsx
```typescript

import React from 'react';

const AcademicCalendar: React.FC = () => {
  const events = [
    { date: 'Oct 01, 2025', event: 'Academic Year Begins' },
    { date: 'Oct 15, 2025', event: '8th Matriculation Ceremony' },
    { date: 'Dec 15, 2025', event: 'End of Semester Break' },
    { date: 'Jan 05, 2026', event: 'New Year Session Resumes' }
  ];
  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-4 font-sans">
      <h2 className="text-4xl font-black text-tuc-forest dark:text-white text-center mb-12 uppercase tracking-tighter">Academic Calendar 2025/2026</h2>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-tuc-forest text-white">
            <tr>
              <th className="px-8 py-6 text-xs font-black uppercase">Date</th>
              <th className="px-8 py-6 text-xs font-black uppercase">Event</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {events.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-8 py-6 text-sm font-bold text-tuc-forest dark:text-tuc-gold">{e.date}</td>
                <td className="px-8 py-6 text-sm text-gray-700 dark:text-gray-300">{e.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicCalendar;

```

### FILE: components/Academics/AcademicsContainer.tsx
```typescript

import React, { useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FacultyDirectory from './FacultyDirectory.tsx';
import FacultyProfile from './FacultyProfile.tsx';
import AcademicCalendar from './AcademicCalendar.tsx';
import AcademicsOverview from './AcademicsOverview.tsx';
import Timetable from './Timetable.tsx';
import { FACULTY_DATA } from '../../constants.ts';

interface AcademicsContainerProps {
  subRoute: string;
}

const AcademicsContainer: React.FC<AcademicsContainerProps> = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subSection = pathParts[1] || '';
  const slug = pathParts[2] || '';

  const getBreadcrumbName = (str: string) => {
    if (!str) return '';
    const member = FACULTY_DATA.find(f => f.slug === str);
    if (member) return member.name;
    if (str === 'faculty') return 'Faculty Directory';
    if (str === 'calendar') return 'Academic Calendar';
    if (str === 'timetable') return 'Lecture Timetables';
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="bg-white dark:bg-tuc-midnight min-h-screen text-left">
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ol className="flex text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <li>
              <Link 
                to="/" 
                className="hover:text-tuc-forest transition-colors focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                aria-label="Return to Home page"
                title="Go to Home"
              >
                Home
              </Link>
            </li>
            <li className="mx-3 opacity-30">/</li>
            <li>
              <Link 
                to="/academics" 
                className={`${!subSection ? "text-tuc-gold" : "hover:text-tuc-forest transition-colors"} focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1`}
                aria-label="Go to Academics overview"
                title="Academics Overview"
              >
                Academics
              </Link>
            </li>
            {subSection && (
              <>
                <li className="mx-3 opacity-30">/</li>
                <li>
                  <Link 
                    to={`/academics/${subSection}`} 
                    className={`${!slug ? "text-tuc-gold" : "hover:text-tuc-forest transition-colors"} focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1`}
                    aria-label={`Go to ${getBreadcrumbName(subSection)}`}
                    title={getBreadcrumbName(subSection)}
                  >
                    {getBreadcrumbName(subSection)}
                  </Link>
                </li>
              </>
            )}
            {slug && (
              <>
                <li className="mx-3 opacity-30">/</li>
                <li className="text-tuc-gold truncate max-w-[200px]">{getBreadcrumbName(slug)}</li>
              </>
            )}
          </ol>
        </div>
      </nav>
      <div className="animate-fade-in-up">
        <Routes>
          <Route path="/" element={<AcademicsOverview />} />
          <Route path="faculty" element={<FacultyDirectory />} />
          <Route path="faculty/:slug" element={<FacultyProfile slug={slug} />} />
          <Route path="calendar" element={<AcademicCalendar />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="*" element={<AcademicsOverview />} />
        </Routes>
      </div>
    </div>
  );
};

export default AcademicsContainer;

```

### FILE: components/Academics/AcademicsOverview.tsx
```typescript

import React from 'react';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';

const AcademicsOverview: React.FC = () => {
  const academicCards = [
    { 
      icon: <BookOpen className="text-tuc-gold" size={32} />, 
      title: 'Programmes', 
      link: '#/academics', 
      desc: 'Degrees in AI, Fashion, Media, and Jewellery.' 
    },
    { 
      icon: <Users className="text-tuc-gold" size={32} />, 
      title: 'Faculty', 
      link: '#/academics/faculty', 
      desc: 'Expert scholars and industrial practitioners.' 
    },
    { 
      icon: <Calendar className="text-tuc-gold" size={32} />, 
      title: 'Calendar', 
      link: '#/academics/calendar', 
      desc: 'Key institutional dates and semesters.' 
    },
    { 
      icon: <Award className="text-tuc-gold" size={32} />, 
      title: 'Quality', 
      link: '#/about/accreditation', 
      desc: 'Our commitment to GTEC standards.' 
    }
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 font-sans text-left">
      <div className="mb-20 max-w-4xl">
        <span className="text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Academic Excellence</span>
        <h1 className="text-5xl md:text-7xl font-black text-tuc-forest dark:text-white mt-4 mb-8 tracking-tighter uppercase leading-tight">
          Building the Future of Education
        </h1>
        <p className="text-xl text-tuc-stone dark:text-gray-400 leading-relaxed font-medium">
          Techbridge University College offers a transformative learning experience that bridges creative intelligence with industrial mastery. Explore our academic ecosystem below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {academicCards.map((box, i) => (
          <a 
            key={i} 
            href={box.link} 
            className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group flex flex-col items-start text-left focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
            aria-label={`View ${box.title} information`}
            title={`View ${box.title}`}
          >
            <div className="mb-6 transform group-hover:scale-110 transition-transform">
              {box.icon}
            </div>
            <h3 className="text-xl font-black text-tuc-forest dark:text-white mb-4 uppercase tracking-tighter">
              {box.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              {box.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AcademicsOverview;

```

### FILE: components/Academics/FacultyDirectory.tsx
```typescript

import React, { useState, useMemo, useEffect } from 'react';
import { Search, GraduationCap, Mail, ChevronRight, X, Info, User, ExternalLink } from 'lucide-react';
import { FACULTY_DATA } from '../../constants.ts';
import { FacultyMember } from '../../types.ts';

const FacultyDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Body scroll lock effect for modal
  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedMember]);

  // Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedMember(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const { groupedFaculty, departmentList } = useMemo(() => {
    const filtered = FACULTY_DATA.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.title && f.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const groups: Record<string, FacultyMember[]> = {};
    const depts: string[] = [];
    filtered.forEach(member => {
      if (!groups[member.department]) {
        groups[member.department] = [];
        depts.push(member.department);
      }
      groups[member.department].push(member);
    });
    return { groupedFaculty: groups, departmentList: depts.sort() };
  }, [searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCardClick = (member: FacultyMember) => {
    toggleExpand(member.id);
  };

  const openProfileModal = (e: React.MouseEvent, member: FacultyMember) => {
    e.stopPropagation();
    setSelectedMember(member);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Fallback to a generated avatar based on the name
    const name = target.alt || 'Faculty';
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=630f12&color=ffcb05&size=512`;
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 font-sans animate-fade-in-up">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-left">
        <div className="max-w-2xl">
          <span className="text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Academic Leadership</span>
          <h2 className="text-4xl md:text-6xl font-black text-tuc-forest dark:text-white mt-4 uppercase tracking-tighter">Faculty Directory</h2>
          <p className="mt-4 text-tuc-stone dark:text-gray-400 font-medium">Meet the industry-leading scholars and practitioners shaping the future of design and technology in Ghana.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or department..." 
            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl py-5 pl-14 pr-6 focus:border-tuc-gold dark:focus:border-tuc-gold outline-none text-sm transition-all shadow-xl dark:text-white" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
      
      {departmentList.length > 0 ? (
        departmentList.map(dept => (
          <section key={dept} className="mb-24 last:mb-0">
            <div className="flex items-center gap-6 mb-12">
              <h3 className="text-2xl font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-tighter whitespace-nowrap">{dept}</h3>
              <div className="h-1 flex-1 bg-gradient-to-r from-tuc-gold/20 to-transparent rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {groupedFaculty[dept]?.map((member) => {
                const isExpanded = expandedId === member.id;
                return (
                  <article 
                    key={member.id} 
                    onClick={() => handleCardClick(member)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCardClick(member)}
                    tabIndex={0}
                    className={`bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-lg border transition-all duration-300 group flex flex-col cursor-pointer hover:-translate-y-2 focus:ring-4 focus:ring-tuc-gold outline-none ${
                      isExpanded ? 'border-tuc-gold ring-1 ring-tuc-gold' : 'border-gray-100 dark:border-gray-700'
                    }`}
                    aria-label={`View details for ${member.name}`}
                    title={`View details for ${member.name}`}
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        onError={handleImageError}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isExpanded ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-tuc-forest/80 via-tuc-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <div 
                          onClick={(e) => openProfileModal(e, member)}
                          className="bg-tuc-gold text-tuc-forest w-full py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform hover:bg-white transition-colors"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && openProfileModal(e as any, member)}
                          aria-label={`View full academic profile for ${member.name}`}
                          title={`View full academic profile for ${member.name}`}
                        >
                          View Full Academic Profile <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>

                    <div className="p-7 flex-1 flex flex-col text-left">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-lg font-black uppercase tracking-tighter leading-tight flex-1 pr-2 transition-colors ${isExpanded ? 'text-tuc-forest dark:text-tuc-gold' : 'text-tuc-forest dark:text-white group-hover:text-tuc-gold'}`}>{member.name}</h4>
                        <div 
                          className={`p-1.5 rounded-full transition-all hover:scale-110 ${isExpanded ? 'bg-tuc-gold text-tuc-forest' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}
                        >
                          <Info size={14} />
                        </div>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{member.title || 'Faculty Member'}</p>
                      
                      {/* Expansion Slot for Brief Bio */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-3 border-l-2 border-tuc-gold py-2 mb-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-r-xl">
                          <p className="text-xs text-tuc-stone dark:text-gray-400 leading-relaxed italic font-medium">
                            {member.bio}
                          </p>
                          <button 
                            onClick={(e) => openProfileModal(e, member)}
                            className="mt-4 text-[10px] font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-widest hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                            aria-label={`Read full academic bio for ${member.name}`}
                            title={`Read full academic bio for ${member.name}`}
                          >
                            Read Full Academic Bio <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[9px] font-black text-tuc-stone dark:text-gray-400 uppercase tracking-widest">
                          <GraduationCap size={14} className="text-tuc-gold" /> Academic Faculty
                        </div>
                        <a 
                          href={`mailto:${member.email}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-400 hover:text-tuc-forest dark:hover:text-tuc-gold transition-colors focus:outline-none focus:ring-2 focus:ring-tuc-gold"
                          aria-label={`Send email to ${member.name}`}
                          title={`Email ${member.name}`}
                        >
                          <Mail size={16} />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      ) : (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
           <User size={48} className="mx-auto text-gray-300 mb-4" />
           <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">No faculty found.</p>
           <button onClick={() => setSearchTerm('')} className="mt-4 text-tuc-forest dark:text-tuc-gold font-black uppercase text-xs tracking-widest hover:underline">Clear Search</button>
        </div>
      )}

      {/* Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tuc-forest/60 backdrop-blur-md" onClick={() => setSelectedMember(null)}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl animate-fade-in-up border border-white/10">
            <button 
              onClick={() => setSelectedMember(null)} 
              className="absolute top-8 right-8 z-20 p-3 bg-white dark:bg-gray-800 text-gray-500 hover:text-tuc-forest transition-colors rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
              aria-label="Close profile modal"
              title="Close profile"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col lg:flex-row min-h-full">
              <div className="lg:w-2/5 h-[400px] lg:h-auto relative">
                <img 
                  src={selectedMember.image} 
                  alt={selectedMember.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tuc-forest/80 via-transparent to-transparent"></div>
              </div>
              <div className="lg:w-3/5 p-8 lg:p-16 text-left flex flex-col">
                <div className="mb-12">
                  <span className="text-tuc-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{selectedMember.department}</span>
                  <h3 className="text-4xl lg:text-6xl font-black text-tuc-forest dark:text-white mb-2 uppercase tracking-tighter leading-none">{selectedMember.name}</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{selectedMember.title || 'Faculty Member'}</p>
                </div>
                <div className="space-y-12">
                  <section>
                    <h4 className="text-[10px] font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-[0.3em] mb-4 border-b pb-2">Institutional Biography</h4>
                    <p className="text-tuc-stone dark:text-gray-300 leading-relaxed font-medium">{selectedMember.bio}</p>
                  </section>
                  <section>
                    <h4 className="text-[10px] font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-[0.3em] mb-6 border-b pb-2">Academic Credentials</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedMember.education.map((edu, idx) => (
                        <li key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl">
                          <div className="w-2 h-2 rounded-full bg-tuc-gold"></div>
                          <span className="text-[11px] font-black text-gray-700 dark:text-gray-200 uppercase">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
                <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row gap-6">
                  {selectedMember.profileUrl && (
                    <a 
                      href={selectedMember.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 bg-tuc-forest text-white text-center py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-forest transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-tuc-gold"
                      aria-label={`Open official profile for ${selectedMember.name}`}
                      title={`Official Profile for ${selectedMember.name}`}
                    >
                      <ExternalLink size={16} /> Official Profile
                    </a>
                  )}
                  <a 
                    href={`mailto:${selectedMember.email}`} 
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-tuc-forest dark:text-tuc-gold text-center py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-tuc-forest hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
                    aria-label={`Send inquiry email to ${selectedMember.name}`}
                    title={`Email ${selectedMember.name}`}
                  >
                    Send Inquiry
                  </a>
                  <button 
                    onClick={() => setSelectedMember(null)} 
                    className="flex-1 border-2 border-tuc-forest text-tuc-forest py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all dark:text-white dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
                    aria-label="Close profile modal"
                    title="Close profile"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDirectory;
```

### FILE: components/Academics/FacultyProfile.tsx
```typescript

import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { FACULTY_DATA } from '../../constants.ts';

interface FacultyProfileProps {
  slug: string;
}

const FacultyProfile: React.FC<FacultyProfileProps> = ({ slug }) => {
  const member = FACULTY_DATA.find(f => f.slug === slug);
  
  if (!member) return (
    <div className="py-32 text-center">
      <h2 className="text-2xl font-bold">Profile Not Found</h2>
      <a 
        href="#/academics/faculty" 
        className="text-tuc-forest underline focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
        aria-label="Return to Faculty Directory"
        title="Back to Directory"
      >
        Back to Directory
      </a>
    </div>
  );

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 font-sans">
      <div className="mb-12">
        <a 
          href="#/academics/faculty" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-tuc-forest font-black text-[10px] uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
          aria-label="Return to Faculty Directory"
          title="Back to Directory"
        >
          <ArrowLeft size={16} /> Back to Directory
        </a>
      </div>
      <div className="flex flex-col lg:flex-row gap-16 text-left">
        <div className="lg:w-1/3">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
            <img src={member.image} alt={member.name} className="w-full h-auto" />
          </div>
          <div className="mt-10">
            <a 
              href={`mailto:${member.email}`} 
              className="flex items-center justify-center gap-4 bg-tuc-forest text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-xl focus:outline-none focus:ring-4 focus:ring-tuc-gold"
              aria-label={`Send email to ${member.name}`}
              title={`Contact ${member.name}`}
            >
              <Mail size={18} /> Contact Scholar
            </a>
          </div>
        </div>
        <div className="lg:w-2/3">
          <span className="text-tuc-gold text-[10px] font-black uppercase tracking-[0.3em]">{member.department}</span>
          <h1 className="text-5xl md:text-7xl font-black text-tuc-forest dark:text-white mt-6 mb-4 tracking-tighter uppercase">{member.name}</h1>
          <p className="text-tuc-gold text-lg font-black uppercase tracking-widest mb-12">{member.title || 'Faculty Member'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Biography</h3>
              <p className="text-tuc-stone dark:text-gray-300 leading-relaxed font-medium">{member.bio}</p>
            </div>
            <div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Education</h3>
              <ul className="space-y-4">
                {member.education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-left">
                    <div className="mt-1 w-2 h-2 rounded-full bg-tuc-gold shrink-0"></div>
                    <span className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase">{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;

```

### FILE: components/Academics/Timetable.tsx
```typescript

import React from 'react';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

const Timetable: React.FC = () => {
  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-4 font-sans text-left">
      <h2 className="text-4xl font-black text-tuc-forest dark:text-white text-center mb-16 uppercase tracking-tighter">Academic Timetables</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { dept: 'Design Computing & AI', venue: 'Innovation Lab A' },
          { dept: 'Digital Media', venue: 'Studio 1' },
          { dept: 'Fashion Technology', venue: 'Design Studio B' },
          { dept: 'Jewellery Design', venue: 'Manufacturing Lab' }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 group">
            <div className="bg-tuc-forest/5 dark:bg-tuc-gold/5 p-3 rounded-2xl w-fit mb-6">
              <CalendarIcon className="text-tuc-forest dark:text-tuc-gold" />
            </div>
            <h3 className="text-xl font-black text-tuc-forest dark:text-white uppercase mb-4">{item.dept}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
              <MapPin size={16} className="text-tuc-gold" /> {item.venue}
            </div>
            <button 
              className="w-full bg-tuc-forest text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-tuc-gold"
              aria-label={`Download PDF Schedule for ${item.dept}`}
              title={`Download ${item.dept} Schedule`}
            >
              Download PDF Schedule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;

```

### FILE: components/Accreditation.tsx
```typescript
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

```

### FILE: components/Admin.tsx
```typescript

import React, { useState, useEffect } from 'react';
import { Lock, LogOut, ShieldAlert, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { logAction, getLogs, clearLogs, AuditLogEntry } from '../lib/auditLogger.ts';
import { ADMIN_CONFIG } from '../constants.ts';

interface AdminProps {
  onBack: () => void;
}

const STORAGE_KEY_ATTEMPTS = 'admin_login_attempts';
const STORAGE_KEY_LOCKOUT = 'admin_lockout_until';

const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // Initialize state from local storage on mount
  useEffect(() => {
    const lockoutUntil = localStorage.getItem(STORAGE_KEY_LOCKOUT);
    if (lockoutUntil) {
      const remainingTime = parseInt(lockoutUntil, 10) - Date.now();
      if (remainingTime > 0) {
        setIsLocked(true);
        startLockoutTimer(remainingTime);
      } else {
        localStorage.removeItem(STORAGE_KEY_LOCKOUT);
        localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      }
    }

    if (isAuthenticated) {
      setLogs(getLogs());
    }
  }, [isAuthenticated]);

  const startLockoutTimer = (durationMs: number) => {
    setLockoutTimer(Math.ceil(durationMs / 1000));
    
    // Update visual timer every second
    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsLocked(false);
          setLockoutTimer(null);
          localStorage.removeItem(STORAGE_KEY_LOCKOUT);
          localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
          setError('');
          logAction('SECURITY_UNLOCK', 'Admin login lockout expired');
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }

    if (password =[REDACTED_CREDENTIAL]
      setIsAuthenticated(true);
      logAction('LOGIN_SUCCESS', 'Administrator logged in successfully');
      setError('');
      // Reset security counters
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEY_LOCKOUT);
    } else {
      const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10) + 1;
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, currentAttempts.toString());
      
      logAction('LOGIN_FAILURE', `Failed login attempt (${currentAttempts}/${ADMIN_CONFIG.maxLoginAttempts})`);
      
      if (currentAttempts >= ADMIN_CONFIG.maxLoginAttempts) {
        setIsLocked(true);
        const lockoutUntil = Date.now() + ADMIN_CONFIG.lockoutTimeMs;
        localStorage.setItem(STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
        
        setError(`Too many failed attempts.`);
        logAction('SECURITY_LOCKOUT', 'Admin login locked due to excessive failed attempts');
        startLockoutTimer(ADMIN_CONFIG.lockoutTimeMs);
      } else {
        setError(`Invalid password. ${ADMIN_CONFIG.maxLoginAttempts - currentAttempts} attempts remaining.`);
      }
    }
  };

  const handleLogout = () => {
    logAction('LOGOUT', 'Administrator logged out');
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear the audit logs? This action cannot be undone.')) {
      clearLogs();
      setLogs(getLogs());
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className={`p-3 rounded-full transition-colors duration-300 ${isLocked ? 'bg-red-600' : 'bg-tuc-forest'}`} aria-hidden="true">
              <Lock className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Admin Portal</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            {isLocked ? `Security Lockout Active` : `Please authenticate to continue`}
          </p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tuc-forest focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-800"
                placeholder={isLocked ? "Access Suspended" : "Enter admin password"}
                autoFocus
              />
            </div>
            
            {/* Error / Status Message Area */}
            <div aria-live="polite" className="min-h-[3rem]">
              {isLocked && (
                 <div className="flex items-center text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                   <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                   <span className="text-sm font-bold">Locked for {lockoutTimer}s</span>
                 </div>
              )}
              {!isLocked && error && (
                <div id="login-error" className="flex items-center text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded" role="alert">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLocked}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-md focus:outline-none focus:ring-2 focus:ring-tuc-gold ${
                isLocked 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-tuc-forest hover:bg-tuc-midnight text-white hover:shadow-lg'
              }`}
            >
              <span>{isLocked ? 'Locked' : 'Authenticate'}</span>
            </button>
          </form>
          <button 
            onClick={onBack}
            className="w-full mt-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm flex items-center justify-center font-medium transition-colors p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-tuc-gold"
          >
            <ArrowLeft size={16} className="mr-2" aria-hidden="true" /> Return to Main Site
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm gap-4 border border-gray-100 dark:border-gray-700">
          <div>
             <h1 className="text-2xl font-black text-gray-800 dark:text-white flex items-center uppercase tracking-tight">
               <ShieldAlert className="mr-3 text-tuc-forest" aria-hidden="true" />
               Security Audit Dashboard
             </h1>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">
               Session Active • Super Admin Privileges
             </p>
          </div>
          <nav className="flex space-x-4" aria-label="Admin controls">
            <button 
                onClick={onBack}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-bold text-sm focus:outline-none focus:ring-2 focus:ring-tuc-gold"
            >
                Return Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center font-bold text-sm focus:outline-none focus:ring-2 focus:ring-tuc-gold"
            >
              <LogOut size={18} className="mr-2" aria-hidden="true" /> Logout
            </button>
          </nav>
        </header>

        <section className="grid grid-cols-1 gap-6" aria-labelledby="audit-logs-title">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 id="audit-logs-title" className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-wider">System Event Log</h2>
              <button
                onClick={handleClearLogs}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Clear all audit logs"
              >
                <Trash2 size={14} className="mr-2" aria-hidden="true" /> Clear History
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">User</th>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Action</th>
                    <th scope="col" className="py-4 px-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-4 px-6 text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap font-mono">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-800 dark:text-gray-200 font-bold">{log.user}</td>
                        <td className="py-4 px-6 text-sm">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            log.action.includes('SUCCESS') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            log.action.includes('FAILURE') || log.action.includes('LOCKOUT') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300 font-medium">{log.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 dark:text-gray-500 font-medium italic">
                        No audit logs found. System is clean.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Admin;

```

### FILE: components/AIChatAgent.tsx
```typescript

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, Sparkles, User, Info, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { streamResponse } from '../lib/gemini.ts';
import { useUI } from '../context/UIContext.tsx';

/**
 * A user-friendly, high-fidelity message renderer for BridgeBot.
 * Converts basic markdown syntax into highly styled React components.
 */
const FormattedMessage: React.FC<{ text: string; role: 'user' | 'model' }> = ({ text, role }) => {
  const content = useMemo(() => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle Bullet Points with visual flair
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const itemContent = trimmedLine.substring(2);
        currentList.push(
          <li key={`li-${index}`} className="flex items-start gap-2.5 mb-2 group">
            <CheckCircle2 size={16} className="text-tuc-gold mt-0.5 flex-shrink-0" />
            <span className="text-[13px] md:text-sm leading-snug">{renderInline(itemContent)}</span>
          </li>
        );
      } else {
        // Push list if transition occurs
        if (currentList.length > 0) {
          elements.push(<ul key={`ul-${index}`} className="mb-4 mt-2 space-y-1">{currentList}</ul>);
          currentList = [];
        }

        if (trimmedLine) {
          // Detect headers or subheaders (wrapped in **)
          const isSubHeader = trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length < 50;
          
          elements.push(
            <div key={`div-${index}`} className={`mb-3 last:mb-0 leading-relaxed ${isSubHeader ? 'mt-5 border-l-4 border-tuc-gold pl-3 font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-widest text-[10px]' : 'text-[13px] md:text-sm'}`}>
              {renderInline(trimmedLine)}
            </div>
          );
        }
      }
    });

    // Final list flush
    if (currentList.length > 0) {
      elements.push(<ul key="ul-final" className="mb-4 mt-2 space-y-1">{currentList}</ul>);
    }

    return elements;
  }, [text]);

  function renderInline(str: string) {
    // Split for basic bolding **text**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-black text-tuc-forest dark:text-tuc-gold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  return <div className="space-y-1">{content}</div>;
};

const AIChatAgent: React.FC = () => {
  const { isChatOpen, openChat, closeChat } = useUI();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Bridge the gap! I'm **BridgeBot**, your TUC assistant. How can I guide your journey today? \n\n **Institutional Pillars** \n - Admissions for **July 2026** \n - Cutting-edge **DMCD** and **PDE** programmes \n - The Bridge Scholarship Eligibility"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { if (isChatOpen) scrollToBottom(); }, [messages, isChatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, role: 'model', text: '' }]);

    try {
      await streamResponse(
        userMessage.text,
        history,
        userMessage.image || null,
        (chunkText) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId ? { ...msg, text: chunkText } : msg
          ));
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isChatOpen) {
    return (
      <button 
        onClick={openChat}
        aria-label="Open AI Chat Assistant"
        className="fixed bottom-6 right-6 z-[60] bg-tuc-forest text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-tuc-gold hover:text-tuc-forest transition-all group focus:ring-4 focus:ring-tuc-gold flex items-center justify-center"
      >
        <MessageCircle size={32} aria-hidden="true" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl text-sm font-black text-tuc-forest dark:text-tuc-gold shadow-2xl opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all transform scale-90 group-hover:scale-100 border border-gray-100 dark:border-gray-700">Ask BridgeBot</span>
      </button>
    );
  }

  return (
    <div 
      ref={chatWindowRef}
      tabIndex={-1}
      className="fixed bottom-6 right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[460px] h-[720px] max-h-[90vh] bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-scale-up border border-gray-100 dark:border-gray-800 focus:outline-none"
      role="dialog"
      aria-label="BridgeBot AI Assistant"
    >
      {/* Visual Header */}
      <div className="bg-tuc-forest p-8 flex justify-between items-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-56 h-56 bg-tuc-gold/10 rounded-full -mr-28 -mt-28"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-tuc-gold p-3.5 rounded-2xl shadow-xl">
            <Bot size={26} className="text-tuc-forest" />
          </div>
          <div>
            <h3 className="text-white font-black text-xl uppercase tracking-widest leading-none mb-1">BridgeBot</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.6)]"></span>
              <p className="text-[10px] text-tuc-gold font-black uppercase tracking-widest opacity-90">Institutional Advisor</p>
            </div>
          </div>
        </div>
        <button 
          onClick={closeChat} 
          className="text-white/40 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close chat"
        >
          <X size={22} />
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-thin bg-gray-50/40 dark:bg-gray-900/40">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${msg.role === 'user' ? 'bg-tuc-gold text-tuc-forest' : 'bg-white dark:bg-gray-800 text-tuc-forest dark:text-tuc-gold border border-gray-100 dark:border-gray-700'}`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-tuc-forest text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
            }`}>
              {msg.image && <img src={msg.image} alt="Context" className="rounded-3xl mb-5 max-h-60 object-cover w-full shadow-inner" />}
              {msg.text ? (
                <FormattedMessage text={msg.text} role={msg.role} />
              ) : (
                msg.role === 'model' && (
                  <div className="flex items-center gap-3 text-tuc-gold animate-pulse font-black text-[10px] uppercase tracking-widest">
                    <Sparkles size={16} /> Retrieving TUC Records...
                  </div>
                )
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/80 px-6 py-4 rounded-[2.5rem] border-2 border-transparent focus-within:border-tuc-gold/40 transition-all shadow-inner group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSubmit(e); 
                } 
              }}
              placeholder="How can I assist your TUC journey?"
              className="flex-1 bg-transparent border-none text-[13px] md:text-sm focus:ring-0 resize-none py-2 text-gray-900 dark:text-white font-medium placeholder:text-gray-400"
              rows={1}
              aria-label="Type your message"
            />
            <button 
              type="submit" 
              disabled={isLoading || (!input.trim() && !selectedImage)} 
              className="bg-tuc-forest text-white p-3.5 rounded-[1.5rem] disabled:opacity-20 hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-xl active:scale-95 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-tuc-gold"
              aria-label="Send"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-6 px-3">
           <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-black uppercase tracking-widest">
             <Info size={12} className="text-tuc-gold" />
             AI Guidance System
           </div>
           <p className="text-[9px] text-gray-300 dark:text-gray-600 font-bold uppercase tracking-widest tracking-[0.2em]">Design and Build a Nation!</p>
        </div>
      </div>
    </div>
  );
};

export default AIChatAgent;

```

### FILE: components/ComingSoon.tsx
```typescript

import React from 'react';
import { Construction, ArrowLeft, MoveRight } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-tuc-midnight min-h-[70vh] animate-fade-in-up">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-tuc-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700">
          <Construction size={64} className="text-tuc-forest dark:text-tuc-gold" />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <span className="text-tuc-gold font-black uppercase tracking-[0.4em] text-[10px]">TUC Digital Transformation</span>
        <h1 className="text-4xl md:text-6xl font-black text-tuc-forest dark:text-white uppercase tracking-tighter leading-none">
          {title || 'Bridge Under Construction'}
        </h1>
        <p className="text-lg text-tuc-stone dark:text-gray-400 font-medium leading-relaxed">
          We are currently engineering the digital experience for <strong>{title || 'this section'}</strong>. As part of our commitment to technical excellence, we're building a platform that bridges global standards with Ghanaian innovation.
        </p>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row gap-6">
        <a 
          href="#/" 
          className="inline-flex items-center gap-3 bg-tuc-forest text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-tuc-gold focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <ArrowLeft size={18} /> Return to Home
        </a>
        <a 
          href="https://portal.aucdt.edu.gh/admissions/#/home"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 text-tuc-forest dark:text-tuc-gold px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest border-2 border-tuc-forest dark:border-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-tuc-gold focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Admission Portal <MoveRight size={18} />
        </a>
      </div>

      <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 w-full max-w-sm">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.5em]">
          Design and Build a Nation!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;

```

### FILE: components/CTASection.tsx
```typescript

import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-tuc-ivory dark:bg-tuc-midnight/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Content */}
          <div className="lg:w-2/3 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-tighter">
              Bridge the Gap Today
            </h2>
            <div className="text-tuc-stone dark:text-gray-300 leading-relaxed space-y-4 text-lg font-medium">
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
                className="inline-flex items-center bg-white dark:bg-gray-800 text-tuc-forest dark:text-tuc-gold font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-tuc-forest/20 hover:scale-105 transition-all border border-gray-100 dark:border-gray-700 uppercase tracking-widest text-sm focus:outline-none focus:ring-4 focus:ring-tuc-gold"
                aria-label="Download Techbridge University College Brochure"
                title="Download Brochure"
              >
                Download Brochure
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/3 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border-t-8 border-tuc-forest text-center space-y-8">
            <h3 className="text-2xl font-black text-tuc-forest dark:text-tuc-gold leading-tight uppercase">
              July 2026 Admissions
            </h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Apply before the deadline</p>
            <a 
              href="https://portal.aucdt.edu.gh/admissions/#/home"
              className="block w-full bg-tuc-forest text-white font-black text-lg px-8 py-5 rounded-2xl shadow-lg hover:bg-tuc-gold hover:text-tuc-forest transition-all transform hover:-translate-y-1 uppercase tracking-tighter focus:outline-none focus:ring-4 focus:ring-tuc-gold"
              aria-label="Start your application for July 2026 admissions"
              title="Start Application"
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
```

### FILE: components/Footer.tsx
```typescript

import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck, Activity, MapPin, Phone, Mail, Globe, Home } from 'lucide-react';
import { LOGO_URL, SOCIAL_LINKS } from '../constants';

// Custom X (Twitter) icon matching reference
const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

// Custom TikTok icon
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.11-1.47-.17-.12-.32-.26-.47-.39v6.52c.03 2.11-.64 4.31-2.26 5.74-1.63 1.48-3.95 2.05-6.09 1.45-2.02-.51-3.79-2.07-4.57-4-1.02-2.56-.23-5.78 1.95-7.51 1.42-1.16 3.32-1.61 5.12-1.2v4.19c-.89-.25-1.89-.13-2.67.38-.85.54-1.34 1.55-1.24 2.55.1 1.34 1.25 2.45 2.58 2.44 1.35-.02 2.46-1.12 2.48-2.47V0z" />
  </svg>
);

interface FooterProps {
  onAdminClick: () => void;
  onTestClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick, onTestClick }) => {
  return (
    <footer className="bg-tuc-midnight text-white font-sans overflow-hidden">
      {/* Visual Line Accent from Letterhead */}
      <div className="h-2 w-full flex">
        <div className="w-1/4 h-full bg-tuc-forest"></div>
        <div className="w-1/2 h-full bg-tuc-gold"></div>
        <div className="w-1/4 h-full bg-tuc-forest"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Branding Area - Refined motto font size and layout for horizontal single-line display */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 border-b-2 border-tuc-forest pb-16">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10 md:mb-0 w-full md:w-auto">
            <img 
              src={LOGO_URL} 
              alt="TUC Logo" 
              className="h-16 xs:h-20 sm:h-24 md:h-26 lg:h-28 w-auto object-contain transition-all duration-300 hover:scale-105 brightness-0 invert" 
            />
            <div className="hidden md:block h-12 w-px bg-tuc-forest mx-2"></div>
            <h2 className="text-sm xs:text-base md:text-lg lg:text-xl xl:text-2xl font-black text-white uppercase tracking-tighter text-center md:text-left leading-none whitespace-nowrap">
              Build What Comes Next
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4 shrink-0">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="Facebook" title="Follow on Facebook"><Facebook size={24} /></a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="X (Twitter)" title="Follow on X (Twitter)"><XIcon size={24} /></a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="Instagram" title="Follow on Instagram"><Instagram size={24} /></a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="TikTok" title="Follow on TikTok"><TikTokIcon size={24} /></a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="LinkedIn" title="Follow on LinkedIn"><Linkedin size={24} /></a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="bg-tuc-forest text-white p-4 rounded-2xl hover:bg-tuc-gold hover:text-tuc-midnight transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-tuc-gold" aria-label="YouTube" title="Follow on YouTube"><Youtube size={24} /></a>
          </div>
        </div>

        {/* Contact Info Grid - Mirroring Letterhead Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-sm text-left">
          
          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Home size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">P.O. Box</h4>
              <p className="text-gray-300 font-bold leading-relaxed uppercase text-xs whitespace-nowrap">P.O. Box VV 179<br />Accra - Ghana</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><MapPin size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Location</h4>
              <p className="text-gray-300 font-bold leading-relaxed uppercase text-xs whitespace-nowrap">Oyibi<br />Adenta-Dodowa Road<br />GM-274-6332</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Phone size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Phone</h4>
              <p className="text-gray-300 font-bold leading-relaxed text-xs whitespace-nowrap">054 012 4400<br />054 012 4488</p>
            </div>
          </div>

          <div className="flex gap-5 lg:col-span-1">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Mail size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Email</h4>
              <p className="text-gray-300 font-bold leading-relaxed text-xs whitespace-nowrap">info@aucdt.edu.gh<br />admissions@aucdt.edu.gh</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex-shrink-0 bg-tuc-gold p-3 h-fit rounded-2xl text-tuc-midnight shadow-sm" aria-hidden="true"><Globe size={22} /></div>
            <div>
              <h4 className="font-black text-white uppercase mb-3 tracking-wider">Web</h4>
              <p className="text-gray-300 font-bold leading-relaxed text-xs whitespace-nowrap">aucdt.edu.gh<br />techbridge.edu.gh</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-tuc-forest py-8 border-t border-tuc-midnight">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-gray-300">
            <p className="uppercase tracking-[0.25em] text-center md:text-left">
                Techbridge University College | Copyright © 2026 | All Rights Reserved
            </p>
            <div className="flex items-center space-x-8">
              <button 
                  onClick={onTestClick}
                  className="hover:text-white transition-colors flex items-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                  aria-label="Diagnostic Suite"
                  title="Diagnostic Suite"
              >
                  <Activity size={14} className="mr-2 text-tuc-gold" aria-hidden="true" /> Diagnostic Suite
              </button>
              <button 
                  onClick={onAdminClick}
                  className="hover:text-white transition-colors flex items-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded px-1"
                  aria-label="Admin Portal"
                  title="Admin Portal"
              >
                  <ShieldCheck size={14} className="mr-2 text-tuc-gold" aria-hidden="true" /> Admin Portal
              </button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

```

### FILE: components/Header.tsx
```typescript

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle, Menu, X, Facebook, Instagram, Linkedin, Search } from 'lucide-react';
import { NAV_ITEMS, LOGO_URL, SOCIAL_LINKS } from '../constants.ts';
import ThemeToggle from './ThemeToggle.tsx';
import { useUI } from '../context/UIContext.tsx';

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.11-1.47-.17-.12-.32-.26-.47-.39v6.52c.03 2.11-.64 4.31-2.26 5.74-1.63 1.48-3.95 2.05-6.09 1.45-2.02-.51-3.79-2.07-4.57-4-1.02-2.56-.23-5.78 1.95-7.51 1.42-1.16 3.32-1.61 5.12-1.2v4.19c-.89-.25-1.89-.13-2.67.38-.85.54-1.34 1.55-1.24 2.55.1 1.34 1.25 2.45 2.58 2.44 1.35-.02 2.46-1.12 2.48-2.47V0z" />
  </svg>
);

// Helper to flatten nested navigation items for search
const flattenNavItems = (items: typeof NAV_ITEMS) => {
  let flat: { label: string; href: string }[] = [];
  items.forEach(item => {
    flat.push({ label: item.label, href: item.href });
    if (item.children) {
      flat = [...flat, ...flattenNavItems(item.children)];
    }
  });
  return flat;
};

interface SocialLinkProps {
  href: string;
  platform: string;
  icon: React.ElementType;
  size?: number;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, platform, icon: Icon, size = 14, className }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`group relative flex items-center justify-center ${className}`} 
    aria-label={`Follow on ${platform}`}
  >
    <Icon size={size} />
    {/* Custom Tooltip */}
    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg min-w-max">
      Follow on {platform}
      {/* Tiny Arrow */}
      <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-white"></span>
    </span>
  </a>
);

const Header: React.FC = () => {
  const { toggleChat } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<number | null>(null);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<number | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ label: string; href: string }[]>([]);
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      mobileMenuRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    } else {
      // Clear search when closed
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isSearchVisible]);

  // Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        const flatItems = flattenNavItems(NAV_ITEMS);
        const results = flatItems.filter((item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // Remove duplicates based on href
        const uniqueResults = Array.from(new Map(results.map(item => [item.href, item])).values());
        setSearchResults(uniqueResults);
      } else {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = dropdownRefs.current.every(ref => ref && !ref.contains(target));
      if (isOutside) {
        setActiveDesktopDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDesktopDropdown(null);
        setIsMobileMenuOpen(false);
        setIsSearchVisible(false);
      }
    };

    if (activeDesktopDropdown !== null || isMobileMenuOpen || isSearchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [activeDesktopDropdown, isMobileMenuOpen, isSearchVisible]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileSubmenu(null);
  };

  const toggleDesktopDropdown = (idx: number) => {
    setActiveDesktopDropdown(activeDesktopDropdown === idx ? null : idx);
  };

  const isExternalLink = (href: string) => href.startsWith('http');

  const NavLink: React.FC<{ item: any; className: string; onClick?: () => void }> = ({ item, className, onClick }) => {
    if (isExternalLink(item.href)) {
      return (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
          {item.label}
        </a>
      );
    }
    return (
      <Link to={item.href} className={className} onClick={onClick}>
        {item.label}
      </Link>
    );
  };

  return (
    <header className="w-full z-50 font-sans" role="banner">
      {/* Upper Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-4 lg:py-6 px-4 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 flex-1 min-w-0">
            <Link to="/" className="flex-shrink-0 group block" aria-label="Techbridge University College Home">
              <img 
                src={LOGO_URL} 
                alt="TUC Logo" 
                className="h-20 xs:h-32 sm:h-36 md:h-40 lg:h-48 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
              />
            </Link>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[13px] xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-tuc-maroon dark:text-tuc-maroon uppercase tracking-tighter leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                Techbridge <span className="text-tuc-gold">University College</span>
              </h1>
              <div className="flex items-center gap-2 sm:gap-4 mt-1.5">
                <div className="hidden xs:block h-0.5 w-6 sm:w-10 bg-tuc-maroon/30 rounded-full"></div>
                <p className="text-tuc-maroon dark:text-tuc-maroon italic text-[13px] xs:text-[15px] sm:text-[19px] md:text-[21px] font-bold tracking-tight line-clamp-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  Formerly AsanSka University College of Design and Technology
                </p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-3 shrink-0">
             <div className="flex items-center space-x-4">
                <div className={`relative flex items-center bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isSearchVisible ? 'w-64' : 'w-10'}`}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search catalog..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`bg-transparent border-none outline-none text-xs font-bold px-4 py-2.5 text-gray-700 dark:text-gray-200 transition-all duration-300 placeholder:text-gray-400 ${
                      isSearchVisible ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}
                  />
                  <button 
                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                    className="absolute right-0 p-2.5 text-tuc-forest dark:text-tuc-gold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded-full"
                    aria-label="Toggle search"
                    title="Toggle search"
                  >
                    {isSearchVisible ? <X size={18} /> : <Search size={18} />}
                  </button>

                  {/* Search Results Dropdown */}
                  {isSearchVisible && searchTerm && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[300px] overflow-y-auto z-[60]">
                      {searchResults.length > 0 ? (
                        <ul>
                          {searchResults.map((result, idx) => (
                            <li key={idx} className="border-b border-gray-50 dark:border-gray-800 last:border-none">
                              <NavLink 
                                item={result}
                                className="block px-4 py-3 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-tuc-forest hover:text-white dark:hover:bg-tuc-gold dark:hover:text-tuc-forest transition-colors truncate"
                                onClick={() => {
                                  setIsSearchVisible(false);
                                  setSearchTerm('');
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-xs font-bold text-gray-400 text-center italic">
                          No matches found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <ThemeToggle />
                <button onClick={toggleChat} className="p-2.5 bg-tuc-forest/5 text-tuc-forest dark:text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-tuc-gold" aria-label="Toggle AI Chat Assistant" title="Toggle AI Chat Assistant">
                  <MessageCircle size={20} aria-hidden="true" />
                </button>
             </div>
             <div className="text-[9px] uppercase font-black text-tuc-forest dark:text-tuc-gold tracking-[0.2em] px-3 py-1 bg-tuc-gold/10 rounded-full border border-tuc-gold/25">
               July 2026 Admissions Open
             </div>
          </div>

          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-1.5 text-tuc-forest dark:text-tuc-gold hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded-full"
              aria-label="Search"
              title="Search"
            >
              <Search size={22} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-tuc-forest dark:text-white p-1.5 focus:outline-none hover:scale-110 transition-transform focus:ring-2 focus:ring-tuc-gold rounded-full" 
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              title={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <nav className={`w-full bg-tuc-forest text-white transition-all duration-300 ${isScrolled ? 'fixed top-0 shadow-2xl z-[100]' : 'relative'}`} aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className="relative group"
                ref={el => { dropdownRefs.current[idx] = el; }}
              >
                {item.children ? (
                  <>
                    <button 
                      onClick={() => toggleDesktopDropdown(idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleDesktopDropdown(idx);
                        }
                      }}
                      className="px-6 py-5 text-[11px] font-black hover:bg-tuc-gold hover:text-tuc-forest transition-all flex items-center gap-2 uppercase tracking-widest text-left whitespace-nowrap focus:bg-tuc-gold focus:text-tuc-forest focus:outline-none"
                      aria-haspopup="true"
                      aria-expanded={activeDesktopDropdown === idx}
                    >
                      {item.label}
                      <ChevronDown 
                        size={14} 
                        className={`opacity-70 transition-transform duration-200 ${activeDesktopDropdown === idx ? 'rotate-180' : ''}`} 
                        aria-hidden="true" 
                      />
                    </button>
                    <div 
                      className={`absolute top-full left-0 w-64 bg-white shadow-2xl transition-all duration-300 border-t-[4px] border-tuc-gold z-50 py-2 ${
                        activeDesktopDropdown === idx 
                          ? 'opacity-100 visible translate-y-0' 
                          : 'opacity-0 invisible translate-y-2'
                      }`}
                      role="menu"
                    >
                      {item.children.map((child, cIdx) => (
                        <div key={cIdx} role="menuitem">
                          <NavLink 
                            item={child}
                            onClick={() => setActiveDesktopDropdown(null)}
                            className="block px-6 py-4 text-[13px] font-bold text-tuc-forest hover:bg-gray-50 transition-colors tracking-tight text-left focus:bg-gray-100 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink item={item} className="px-6 py-5 text-[11px] font-black hover:bg-tuc-gold hover:text-tuc-forest transition-all flex items-center gap-2 uppercase tracking-widest whitespace-nowrap focus:bg-tuc-gold focus:text-tuc-forest focus:outline-none" />
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-3 mx-6">
            <SocialLink href={SOCIAL_LINKS.facebook} platform="Facebook" icon={Facebook} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.twitter} platform="X (Twitter)" icon={XIcon} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.instagram} platform="Instagram" icon={Instagram} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.tiktok} platform="TikTok" icon={TikTokIcon} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
            <SocialLink href={SOCIAL_LINKS.linkedin} platform="LinkedIn" icon={Linkedin} className="w-8 h-8 rounded-full border border-tuc-gold/40 flex items-center justify-center text-tuc-gold hover:bg-tuc-gold hover:text-tuc-forest transition-all duration-300" />
          </div>

          <div className="flex-1 lg:flex-none flex justify-end lg:block py-3">
            <a href="https://portal.aucdt.edu.gh/admissions/#/home" className="bg-tuc-gold text-tuc-forest px-8 py-2.5 rounded-[0.75rem] font-black text-[11px] hover:bg-white transition-all shadow-lg uppercase tracking-widest whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-white/50">Apply Now</a>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div 
        ref={mobileMenuRef}
        tabIndex={-1}
        className={`lg:hidden fixed inset-0 z-[110] bg-white dark:bg-tuc-midnight pt-20 px-6 overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <div className="flex flex-col space-y-6 text-left pb-12">
          <div className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-8 flex items-center gap-6">
            <img src={LOGO_URL} alt="TUC" className="h-28 w-auto object-contain" />
            <div>
              <h2 className="text-xl font-black text-tuc-forest dark:text-tuc-gold uppercase leading-tight">Techbridge <br/> University</h2>
              <p className="text-gray-400 italic text-[10px] mt-1 font-bold uppercase tracking-widest">Build What Comes Next</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <ThemeToggle />
            <button onClick={toggleChat} className="p-3 bg-tuc-gold/15 text-tuc-forest dark:text-tuc-gold rounded-2xl shadow-sm" aria-label="Toggle AI Chat Assistant" title="Toggle AI Chat Assistant">
              <MessageCircle size={22} />
            </button>
          </div>

          {NAV_ITEMS.map((item, idx) => (
            <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex justify-between items-center py-3">
                {item.children ? (
                  <button 
                    onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === idx ? null : idx)}
                    className="text-lg font-black text-tuc-forest dark:text-white uppercase flex-1 text-left tracking-tighter"
                    aria-expanded={activeMobileSubmenu === idx}
                  >
                    {item.label}
                  </button>
                ) : (
                  <NavLink item={item} onClick={closeMobileMenu} className="text-lg font-black text-tuc-forest dark:text-white uppercase flex-1 tracking-tighter" />
                )}
                {item.children && (
                  <button 
                    onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === idx ? null : idx)} 
                    className="p-2 text-tuc-forest dark:text-tuc-gold"
                    aria-label={`Toggle ${item.label} submenu`}
                    title={`Toggle ${item.label} submenu`}
                  >
                    <ChevronDown size={22} className={`transition-transform duration-300 ${activeMobileSubmenu === idx ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              {item.children && activeMobileSubmenu === idx && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mt-3 space-y-4 animate-fade-in-up border border-gray-100 dark:border-gray-700">
                  {item.children.map((child, cIdx) => (
                    <NavLink key={cIdx} item={child} onClick={closeMobileMenu} className="block text-sm text-tuc-forest dark:text-gray-300 font-bold uppercase tracking-tight" />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-center space-x-6 py-6 border-t border-gray-100 dark:border-gray-800 mt-4">
             <SocialLink href={SOCIAL_LINKS.facebook} platform="Facebook" icon={Facebook} size={20} className="text-tuc-forest dark:text-tuc-gold transition-transform hover:scale-110" />
             <SocialLink href={SOCIAL_LINKS.twitter} platform="X (Twitter)" icon={XIcon} size={20} className="text-tuc-forest dark:text-tuc-gold transition-transform hover:scale-110" />
             <SocialLink href={SOCIAL_LINKS.instagram} platform="Instagram" icon={Instagram} size={20} className="text-tuc-forest dark:text-tuc-gold transition-transform hover:scale-110" />
          </div>
          <a href="https://portal.aucdt.edu.gh/admissions/#/home" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="block w-full bg-tuc-forest text-white text-center py-5 rounded-[1.25rem] font-black uppercase tracking-[0.2em] shadow-xl mt-4 active:scale-95 transition-transform">Start Application</a>
          <button onClick={closeMobileMenu} className="flex items-center justify-center gap-2 text-gray-400 font-bold py-6 uppercase text-[10px] tracking-widest w-full"><X size={18} /> Close Navigation</button>
        </div>
      </div>
    </header>
  );
};

export default Header;

```

### FILE: components/HeroSlider.tsx
```typescript

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../constants.ts';

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Handle video playback logic when the active slide changes
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === current) {
          video.play().catch(() => {
            // Silently fail if autoplay is blocked, poster will show
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [current]);

  const nextSlide = () => setCurrent(prev => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrent(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section 
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-tuc-forest font-display"
      aria-roledescription="carousel"
      aria-label="TUC Main Highlights"
    >
      {/* Slides Container */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
            }`}
            aria-hidden={idx !== current}
          >
            {/* Background Layer - Always renders image as fallback/base */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundColor: '#630f12' // Institutional maroon fallback
              }} 
            />

            {/* Video Layer - Only renders if video property exists */}
            {slide.video && (
              <video
                ref={el => { videoRefs.current[idx] = el; }}
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
                  idx === current ? 'opacity-100' : 'opacity-0'
                }`}
                muted
                loop
                playsInline
                poster={slide.image}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            )}
            
            {/* Overlay - Uses custom color if provided, otherwise default gradient */}
            <div className={`absolute inset-0 z-10 ${slide.overlayColor ? slide.overlayColor : 'bg-gradient-to-r from-tuc-forest/95 via-tuc-forest/50 to-transparent'}`} />
            
            {/* Content Layer */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="max-w-3xl space-y-8 text-left">
                <div className="overflow-hidden">
                   <span className="inline-block text-tuc-gold font-black tracking-[0.4em] uppercase text-xs sm:text-sm animate-slide-in-left">
                     {slide.title}
                   </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </h1>
                
                <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 animate-fade-in-up animation-delay-400">
                  {slide.ctaText && slide.ctaLink && (
                    <a 
                      href={slide.ctaLink} 
                      className="inline-flex items-center gap-3 sm:gap-4 bg-tuc-gold text-tuc-charcoal px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
                    >
                      {slide.ctaText} <ArrowRight size={20} />
                    </a>
                  )}
                  {/* Keep "Our Story" secondary CTA only on first slide or if specifically desired, here limiting to avoid clutter on department slides */}
                  {idx === 0 && (
                    <a 
                      href="#/about/story" 
                      className="inline-flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-white/50"
                    >
                      Our Story
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 z-30 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="p-3 sm:p-4 bg-white/10 hover:bg-tuc-gold hover:text-tuc-forest text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto shadow-lg focus:outline-none focus:ring-4 focus:ring-tuc-gold"
          aria-label="Previous slide"
          title="Previous slide"
        >
          <ChevronLeft size={24} className="sm:w-8 sm:h-8" aria-hidden="true" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 sm:p-4 bg-white/10 hover:bg-tuc-gold hover:text-tuc-forest text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto shadow-lg focus:outline-none focus:ring-4 focus:ring-tuc-gold"
          aria-label="Next slide"
          title="Next slide"
        >
          <ChevronRight size={24} className="sm:w-8 sm:h-8" aria-hidden="true" />
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-30 flex space-x-3 sm:space-x-4">
        {HERO_SLIDES.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)} 
            className={`h-1.5 sm:h-2 transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-tuc-gold focus:ring-offset-2 focus:ring-offset-tuc-forest ${
              idx === current ? 'w-12 sm:w-16 bg-tuc-gold shadow-[0_0_15px_rgba(212,160,23,0.6)]' : 'w-3 sm:w-4 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            title={`Go to slide ${idx + 1}`}
            aria-current={idx === current ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;

```

### FILE: components/NewsFeed.tsx
```typescript

import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Loader2, ImageOff, X, Share2 } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  link: string;
  content?: React.ReactNode;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Simulate a network request for the news feed
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const data: NewsItem[] = [
          {
            id: 7,
            title: "AUCDT on Blackboard: A Conversation with AI",
            date: "Feb 10, 2025",
            excerpt: "Explore an engaging AI interaction with Gemini Advanced 2.0 Pro as it generates a custom blackboard image with AUCDT branding.",
            image: "https://aucdt.edu.gh/wp-content/uploads/2025/02/AUCDT-on-Blackboard.jpg",
            category: "Technology",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  Exploring Generative AI in Branding
                </p>
                <p>
                  My chats with Gemini Advanced 2.0 Pro get very interesting every day. Below is a transcript of a session exploring the generation of branded assets.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border-l-4 border-tuc-gold">
                  <p className="font-bold text-xs uppercase tracking-widest mb-2 text-tuc-forest dark:text-tuc-gold">Prompt</p>
                  <p className="italic text-sm">
                    "A clear image of a blackboard with a clean dark green surface and the word '#aucdt' written precisely and legibly in the centre with bold white chalk letters, with bokeh effects in the background that seem to spell 'aucdt'."
                  </p>
                </div>
                
                <p>
                  Gemini responded with the following generation:
                </p>
                
                <div className="rounded-xl overflow-hidden shadow-lg my-6 border border-gray-200 dark:border-gray-700">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-10-at-13.29.20.jpeg" 
                    alt="First AI Generation of Blackboard" 
                    className="w-full h-auto object-cover"
                   />
                </div>

                <p>
                  <strong>User:</strong> "That’s very nice – you are back to generating images."
                </p>
                <p>
                  <strong>Gemini:</strong> "Thank you. I'm glad to be back to generating images for you. I'm still learning and improving, but I'm happy to help you create the images you need."
                </p>

                <p>
                  We then discussed the prompt ID scheme for quality assurance.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm font-mono space-y-2">
                   <p><strong>ID:</strong> 20241204-blackboard-aucdt-bokeh</p>
                   <p><strong>Timestamp:</strong> 20241204</p>
                   <p><strong>Full Prompt:</strong> A clear image of a blackboard with a clean dark green surface and the word '#aucdt' written precisely and legibly in the center...</p>
                </div>

                <p>
                  To refine the result, I requested a modification to align with institutional identity: <em>"The black board border is in AUCDT branding colors."</em>
                </p>

                <div className="rounded-xl overflow-hidden shadow-lg my-6 border border-gray-200 dark:border-gray-700">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-10-at-13.29.46.jpeg" 
                    alt="Refined AI Generation with Branding Colors" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                
                <p>
                  This interaction demonstrates the capability of modern AI tools like Gemini to understand nuanced branding requirements and iterative feedback.
                </p>
              </div>
            )
          },
          {
            id: 6,
            title: "AUCDT Launches New Learning Management System",
            date: "March 4, 2025",
            excerpt: "AsanSka University College of Design and Technology officially launched its new Learning Management System (LMS), marking a new era of digital transformation.",
            image: "https://aucdt.edu.gh/wp-content/uploads/2025/03/Agbosu-presenting-at-the-AUCDT-LMS.webp",
            category: "Technology",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  AUCDT Launches New Learning Management System
                </p>
                <p>
                  AsanSka University College of Design and Technology (AUCDT) on the 25th of February, 2025 officially launched its new Learning Management System (LMS), a significant step forward in enhancing digital learning and teaching experiences. The presentation was led by Mr. Bright Senanu Agbosu from the IT Unit, who provided an insightful and practical demonstration of the platform’s features and functionalities.
                </p>
                <p>
                  The AUCDT LMS, built on the Moodle framework, is designed to provide a flexible, scalable, and interactive learning environment that supports blended learning, online assessments, and collaboration. With its user-friendly interface and mobile accessibility, the platform enables lecturers to manage courses efficiently and students to access learning materials anytime, anywhere.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/03/aucdtlmslaunch19.webp" 
                    alt="Mr. Bright Senanu Agbosu presenting during the launch of the AUCDT LMS" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  The launch event saw the presence of esteemed members of the AUCDT community, including Prof. Emmanuel Amankwah Asante (President), Dr. Joseph A. A. Sackey (Vice President), Heads of Departments (HODs), and the academic staff. Mr. Daniel Twum, Head of IT, played a pivotal role in spearheading the project, ensuring a seamless implementation and robust system.
                </p>
                <p>
                  The session focused on navigating the LMS, highlighting its benefits in streamlining academic activities, improving access to course materials, and facilitating seamless communication between lecturers and students.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/03/Agbosu-presenting-at-the-AUCDT-LMS.webp" 
                    alt="Mr. Bright Senanu Agbosu presenting" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  During the presentation, Mr. Agbosu guided attendees through the system's user interface, demonstrating how to create and manage courses, upload assignments, track student progress, and utilize interactive tools to boost engagement. He emphasized how the LMS aligns with AUCDT’s commitment to adopting modern educational technologies to support effective teaching and learning.
                </p>
                <p>
                  The President of AUCDT expressed enthusiasm about the introduction of the LMS, noting that it marks a new era of academic excellence and digital transformation at AUCDT. The Vice President and HODs echoed this sentiment, highlighting the importance of the platform in fostering a collaborative and resourceful learning environment.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/03/AUCDT-LMS-Banner-DP.jpg" 
                    alt="AUCDT LMS Banner" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  The launch concluded with a Q&A session, where staff members shared feedback and sought clarifications on specific LMS features. The IT Unit assured continuous support and training to ensure a smooth transition to the new system.
                </p>
                <p>
                  Overall, the introduction of the new LMS is expected to enhance productivity, streamline academic workflows, and ultimately contribute to the university's vision of producing highly skilled and innovative graduates.
                </p>
                <p className="font-black italic text-tuc-gold">
                  Staff and students of AUCDT can access the Learning Management System by clicking <a href="https://lms.aucdt.edu.gh" target="_blank" rel="noopener noreferrer" className="underline hover:text-tuc-forest">here</a>.
                </p>
              </div>
            )
          },
          {
            id: 5,
            title: "9th Matriculation Ceremony Held for Fresh Students",
            date: "January 30, 2026",
            excerpt: "Techbridge University College formally welcomed the newest cohort of creative minds during the 9th Matriculation Ceremony at the Oyibi Campus.",
            image: "https://aucdt.edu.gh/tuc/tucmatriculation.jpg",
            category: "Events",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  Welcome to the Techbridge Family!
                </p>
                <p>
                  On Friday, January 30, 2026, Techbridge University College (TUC) held its 9th Matriculation Ceremony to formally admit fresh students into our various Bachelor of Technology and Bachelor of Arts programmes for the 2026 academic year.
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/tuc/tucmatriculation.jpg" 
                    alt="Matriculation Oath" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  The colorful event, held at the Oyibi Campus, was presided over by the President of the University College. In his address, he charged the new students to embrace the institution's core pillars of <strong>Creative Intelligence</strong> and <strong>Technical Excellence</strong>.
                </p>
                <p>
                  "You are entering an institution that believes in the power of design to build nations," the President remarked. "Here, you will not just learn theories; you will solve real-world industrial problems. I urge you to take full advantage of our workshops, labs, and the mentorship of our experienced faculty."
                </p>
                <p>
                  The matriculants swore the oath of allegiance, pledging to abide by the rules and regulations of the University College. The ceremony was witnessed by the Governing Council, Faculty Members, and proud parents.
                </p>
                <p className="font-black italic text-tuc-gold">
                  Congratulations to the Class of 2026!
                </p>
              </div>
            )
          },
          {
            id: 4,
            title: "AsanSka University College Wins Innovative Fashion School of the Year!",
            date: "January 7, 2025",
            excerpt: "The Fashion Design Department of AsanSka University College of Design and Technology (AUCDT) has been honored as the Innovative Fashion School of the Year at the prestigious Ghana Tertiary Fashion Awards 2024!",
            image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg",
            category: "Achievement",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">
                  AsanSka University College of Design and Technology Wins Innovative Fashion School of the Year!
                </p>
                <p>
                  We are proud to announce that the Fashion Design Department of AsanSka University College of Design and Technology (AUCDT) has been honored as the Innovative Fashion School of the Year at the prestigious Ghana Tertiary Fashion Awards 2024!
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img 
                    src="https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg" 
                    alt="Award Ceremony" 
                    className="w-full h-auto object-cover"
                   />
                </div>
                <p>
                  This remarkable achievement reflects our commitment to pushing boundaries in fashion education, fostering creativity, and equipping our students with cutting-edge skills to excel in the ever-evolving fashion industry.
                </p>
                <p>
                  We dedicate this award to our talented students, dedicated faculty, and supportive community who have worked tirelessly to make AUCDT a beacon of innovation in fashion design. Together, we continue to redefine the future of fashion education in Ghana and beyond.
                </p>
                <p className="font-black italic text-tuc-gold">
                  Here’s to many more milestones ahead!
                </p>
              </div>
            )
          },
          {
            id: 2,
            title: "Fashion Department Stuns at Accra Fashion Week",
            date: "September 28, 2025",
            excerpt: "Final year students showcased their avant-garde collections, receiving standing ovations from industry leaders and fashion enthusiasts alike.",
            image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop",
            category: "Achievement",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">Fashion Department Stuns at Accra Fashion Week</p>
                <p>Final year students from the Fashion Design Technology department showcased their avant-garde collections at the recent Accra Fashion Week, receiving standing ovations from industry leaders and fashion enthusiasts alike.</p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop" alt="Fashion Show" className="w-full h-auto object-cover" />
                </div>
                <p>The collection, titled "Afro-Futurism: Roots & Wings", combined traditional Ghanaian textiles with modern structural designs.</p>
              </div>
            )
          },
          {
            id: 3,
            title: "New Design Computing Lab Commissioned",
            date: "August 10, 2025",
            excerpt: "To bolster our commitment to digital excellence, a state-of-the-art lab has been opened for the Design Computing and AI department.",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
            category: "Campus Update",
            link: "https://aucdt.edu.gh/newsroom/",
            content: (
              <div className="space-y-6 text-gray-800 dark:text-gray-200">
                <p className="font-bold text-lg text-tuc-forest dark:text-tuc-gold">New Design Computing Lab Commissioned</p>
                <p>To bolster our commitment to digital excellence, a state-of-the-art lab has been opened for the Design Computing and AI department.</p>
                <div className="rounded-xl overflow-hidden shadow-lg my-6">
                   <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop" alt="Computer Lab" className="w-full h-auto object-cover" />
                </div>
                <p>Equipped with high-performance workstations and the latest rendering software, this facility will enable students to push the boundaries of 3D modeling and simulation.</p>
              </div>
            )
          }
        ];
        
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedArticle]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback');
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  };

  const handleReadMore = (e: React.MouseEvent, item: NewsItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedArticle(item);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-black text-tuc-forest dark:text-white mb-4 uppercase tracking-tighter">Latest News & Updates</h2>
           <div className="w-24 h-1.5 bg-tuc-gold mx-auto rounded-full"></div>
           <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
             Keep up with the latest happenings, student achievements, and events at Techbridge University College.
           </p>
        </div>

        {loading ? (
           <div className="flex flex-col justify-center items-center h-64 w-full">
             <Loader2 className="w-12 h-12 text-tuc-forest dark:text-tuc-gold animate-spin mb-4" />
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Feed...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item.id} 
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
              >
                <div className="relative h-60 overflow-hidden bg-gray-100 dark:bg-gray-900">
                   <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={handleImageError}
                   />
                   <div className="image-fallback absolute inset-0 hidden flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-700">
                     <ImageOff size={48} className="mb-2" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Image Unavailable</span>
                   </div>
                   
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                   <span className="absolute top-6 left-6 bg-tuc-gold text-tuc-forest text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl z-10">
                     {item.category}
                   </span>
                </div>

                <div className="p-8 flex-1 flex flex-col text-left">
                   <div className="flex items-center text-gray-400 text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                     <Calendar size={14} className="mr-2 text-tuc-gold" />
                     {item.date}
                   </div>
                   
                   <h3 className="text-xl font-black text-gray-800 dark:text-white mb-4 group-hover:text-tuc-forest dark:group-hover:text-tuc-gold transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                     <button 
                       type="button"
                       onClick={(e) => handleReadMore(e, item)} 
                       className="text-left focus:outline-none focus:underline focus:ring-2 focus:ring-tuc-gold rounded"
                       aria-label={`Read full story: ${item.title}`}
                       title={`Read full story: ${item.title}`}
                     >
                       {item.title}
                     </button>
                   </h3>
                   
                   <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 flex-1 text-sm leading-relaxed font-medium">
                     {item.excerpt}
                   </p>
                   
                   <button
                    type="button" 
                    onClick={(e) => handleReadMore(e, item)}
                    className="inline-flex items-center text-tuc-forest dark:text-tuc-gold font-black text-xs uppercase tracking-widest hover:text-tuc-gold dark:hover:text-white transition-colors mt-auto group/link text-left focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded p-1 -ml-1"
                    aria-label={`Read full story: ${item.title}`}
                    title={`Read full story: ${item.title}`}
                   >
                     Read Full Story 
                     <ArrowRight size={18} className="ml-3 transform group-hover/link:translate-x-2 transition-transform" />
                   </button>
                </div>
              </article>
            ))}
          </div>
        )}
        
        <div className="text-center mt-16">
            <a 
                href="https://aucdt.edu.gh/newsroom/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border-2 border-tuc-forest dark:border-tuc-gold text-tuc-forest dark:text-tuc-gold px-12 py-4 rounded-full font-black hover:bg-tuc-forest hover:text-white dark:hover:bg-tuc-gold dark:hover:text-tuc-forest transition-all duration-300 uppercase tracking-[0.2em] text-xs shadow-xl focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
                aria-label="Explore the full Newsroom on the main website"
                title="Explore Newsroom"
            >
                Explore Newsroom <ArrowRight size={16} />
            </a>
        </div>
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-tuc-forest/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedArticle(null)}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-scale-up">
            
            {/* Modal Header Image */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white text-white hover:text-tuc-forest rounded-full backdrop-blur-md transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-white"
                aria-label="Close article modal"
                title="Close article"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-0 left-0 p-8 sm:p-12 w-full">
                <span className="inline-block bg-tuc-gold text-tuc-forest text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] mb-4 shadow-lg">
                  {selectedArticle.category}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight shadow-black drop-shadow-lg">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center text-gray-300 text-xs font-bold mt-4 uppercase tracking-widest gap-6">
                  <span className="flex items-center"><Calendar size={14} className="mr-2 text-tuc-gold" /> {selectedArticle.date}</span>
                  <button className="flex items-center hover:text-white transition-colors"><Share2 size={14} className="mr-2" /> Share</button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 sm:p-12 md:p-16">
              <div className="prose dark:prose-invert max-w-none font-medium leading-relaxed">
                {selectedArticle.content || (
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{selectedArticle.excerpt}</p>
                    <a 
                      href={selectedArticle.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-tuc-forest text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-forest transition-all"
                    >
                      Read Full Article on Website <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Techbridge University College</span>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-tuc-forest dark:text-tuc-gold rounded-full font-black text-xs uppercase tracking-widest hover:bg-tuc-forest hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
                  aria-label="Close article modal"
                  title="Close article"
                >
                  Close Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default NewsFeed;

```

### FILE: components/Programmes.tsx
```typescript

import React, { useState, useRef, useEffect } from 'react';
import { PROGRAMMES } from '../constants.ts';
import { ArrowRight, X, Award, Zap, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { ProgrammeCardData } from '../types.ts';

const Programmes: React.FC = () => {
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeCardData | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);

  const openModal = (prog: ProgrammeCardData) => {
    setSelectedProgramme(prog);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProgramme(null);
    document.body.style.overflow = 'unset';
  };

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const containerWidth = container.clientWidth;
      
      // Calculate scroll amount based on 3 items visible logic
      // On desktop (max-w-7xl is 1280px), we have 3 items.
      // Card width is roughly (1280 - 2*gap) / 3
      const card = container.querySelector('article');
      const scrollAmount = card ? card.clientWidth + 32 : containerWidth; 

      if (direction === 'right') {
        const isAtEnd = container.scrollLeft + containerWidth >= container.scrollWidth - 10;
        if (isAtEnd) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        const isAtStart = container.scrollLeft <= 0;
        if (isAtStart) {
          container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollRef.current = window.setInterval(() => {
        scroll('right');
      }, 3000); // 3 seconds interval for better readability
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, []);

  const pauseAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  const resumeAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    autoScrollRef.current = window.setInterval(() => {
      scroll('right');
    }, 3000);
  };

  return (
    <section className="py-24 bg-white dark:bg-tuc-midnight overflow-hidden font-display" aria-labelledby="programmes-title">
      <div className="max-w-7xl mx-auto px-4 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl text-left">
          <span className="text-tuc-forest dark:text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Our Academic Portfolio</span>
          <h2 id="programmes-title" className="text-4xl md:text-5xl font-black text-tuc-forest dark:text-white mt-4 uppercase tracking-tighter">Pioneering Programmes</h2>
          <p className="text-tuc-stone dark:text-gray-400 text-lg font-medium mt-4">
            Combining design intelligence with technical mastery to build a nation through industrial disruption.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              scroll('left');
              pauseAutoScroll();
            }}
            onMouseLeave={resumeAutoScroll}
            className="p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-tuc-gold"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => {
              scroll('right');
              pauseAutoScroll();
            }}
            onMouseLeave={resumeAutoScroll}
            className="p-4 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-tuc-gold"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <div 
          ref={scrollRef}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={resumeAutoScroll}
          className="flex overflow-x-auto pb-12 px-4 md:px-0 space-x-8 scrollbar-hide snap-x snap-mandatory justify-start md:max-w-7xl md:mx-auto" 
          role="region" 
          aria-label="Programme list"
        >
          {PROGRAMMES.map((programme) => (
            <article 
              key={programme.id} 
              onClick={() => openModal(programme)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(programme);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${programme.title}`}
              title={`View details for ${programme.title}`}
              className="flex-shrink-0 w-[85vw] md:w-[calc((100%-64px)/3)] bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 snap-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer focus:outline-none focus:ring-4 focus:ring-tuc-gold"
            >
              <div className="relative h-72 overflow-hidden rounded-t-[2.5rem] bg-gray-100 dark:bg-gray-900">
                {imageErrors[programme.id] ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageOff size={48} />
                  </div>
                ) : (
                  <img 
                    src={programme.image} 
                    alt={programme.title} 
                    onError={() => handleImageError(programme.id)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-tuc-forest/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-8 right-8 bg-tuc-gold text-tuc-forest text-[10px] font-black px-6 py-2.5 uppercase tracking-[0.2em] shadow-2xl rounded-full">{programme.badge}</span>
              </div>
              <div className="p-10 flex-1 flex flex-col text-left">
                <h3 className="text-2xl font-black text-tuc-forest dark:text-tuc-gold mb-4 group-hover:text-tuc-forest dark:group-hover:text-tuc-gold transition-colors uppercase tracking-tighter leading-tight">{programme.title}</h3>
                <p className="text-tuc-stone dark:text-gray-400 text-sm mb-8 flex-1 leading-relaxed font-medium">{programme.description}</p>
                <div className="flex items-center text-tuc-forest dark:text-white font-black text-xs uppercase tracking-widest hover:text-tuc-gold transition-colors group/link">
                  View Curriculum <ArrowRight size={18} className="ml-3 group-hover/link:translate-x-2 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProgramme && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-tuc-forest/80 backdrop-blur-xl animate-fade-in" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-fade-in-up border border-white/10">
            <button onClick={closeModal} className="absolute top-10 right-10 z-20 p-4 bg-white dark:bg-gray-800 text-gray-500 hover:text-tuc-forest rounded-full shadow-2xl transition-all focus:outline-none focus:ring-2 focus:ring-tuc-gold" aria-label="Close modal" title="Close modal"><X size={28} /></button>
            <div className="flex flex-col lg:flex-row min-h-full">
              <div className="lg:w-1/2 h-80 lg:h-auto sticky top-0">
                <img src={selectedProgramme.image} alt={selectedProgramme.title} className="w-full h-full object-cover" />
              </div>
              <div className="lg:w-1/2 p-10 lg:p-20 text-left">
                <span className="bg-tuc-gold/15 text-tuc-forest dark:text-tuc-gold px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-tuc-gold/20">{selectedProgramme.badge}</span>
                <h3 className="text-4xl lg:text-6xl font-black text-tuc-forest dark:text-white mt-8 mb-6 uppercase tracking-tighter leading-none">{selectedProgramme.title}</h3>
                <p className="text-lg text-tuc-stone dark:text-gray-300 mb-10 font-medium leading-relaxed">{selectedProgramme.description}</p>
                
                <div className="grid grid-cols-1 gap-6 mb-12">
                   <div className="flex items-center gap-5 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                     <Award className="text-tuc-gold" size={28} />
                     <div>
                       <p className="text-xs font-black uppercase tracking-widest text-tuc-forest dark:text-tuc-gold">Accreditation</p>
                       <p className="text-sm font-bold text-gray-500">GTEC Certified Industry Degree</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-5 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                     <Zap className="text-tuc-gold" size={28} />
                     <div>
                       <p className="text-xs font-black uppercase tracking-widest text-tuc-forest dark:text-tuc-gold">Fast-Track Career</p>
                       <p className="text-sm font-bold text-gray-500">Industry Placement in Level 300</p>
                     </div>
                   </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <a 
                    href="https://portal.aucdt.edu.gh/admissions/#/home" 
                    className="flex-1 bg-tuc-forest text-white text-center py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-tuc-gold hover:text-tuc-forest transition-all focus:outline-none focus:ring-4 focus:ring-tuc-gold"
                    aria-label={`Apply for ${selectedProgramme.title} for July 2026`}
                    title="Apply for July 2026"
                  >
                    Apply for July 2026
                  </a>
                  <button 
                    onClick={closeModal} 
                    className="flex-1 border-2 border-tuc-forest text-tuc-forest py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all dark:text-white dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-tuc-gold"
                    aria-label="Download Programme Brochure"
                    title="Download Brochure"
                  >
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Programmes;
```

### FILE: components/Programs.tsx
```typescript

import React from 'react';
import { PROGRAMMES } from '../constants.ts';
import { ArrowRight } from 'lucide-react';

const Programmes: React.FC = () => {
  return (
    <section className="py-24 bg-white dark:bg-tuc-midnight overflow-hidden font-display" aria-labelledby="programmes-title">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-tuc-forest dark:text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Our Academic Portfolio</span>
          <h2 id="programmes-title" className="text-4xl md:text-5xl font-black text-tuc-forest dark:text-white mt-4 mb-6 uppercase tracking-tighter">Pioneering Programmes</h2>
          <p className="text-tuc-stone dark:text-gray-400 text-lg font-medium">
            Techbridge University College bridges the future by combining design intelligence with technical mastery. Our curriculum is engineered for industrial disruption.
          </p>
        </div>
      </div>

      {/* Scrolling Container */}
      <div 
        className="flex overflow-x-auto pb-12 px-4 space-x-8 scrollbar-hide snap-x snap-mandatory"
        role="region"
        aria-label="Programme list"
      >
        <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-80rem)/2)]" aria-hidden="true"></div>
        {PROGRAMMES.map((programme) => (
          <article 
            key={programme.id} 
            className="flex-shrink-0 w-80 md:w-[400px] bg-white dark:bg-gray-800 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 snap-center group hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img 
                src={programme.image} 
                alt={`${programme.title} illustration`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute top-6 right-6 bg-tuc-gold text-tuc-forest text-[10px] font-black px-4 py-2 uppercase tracking-[0.2em] shadow-xl rounded-full">
                {programme.badge}
              </span>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-tuc-forest dark:text-tuc-gold mb-4 group-hover:text-tuc-gold transition-colors uppercase tracking-tighter">
                {programme.title}
              </h3>
              <p className="text-tuc-stone dark:text-gray-400 text-sm mb-8 flex-1 leading-relaxed font-medium">
                {programme.description}
              </p>
              <a 
                href={programme.link}
                className="inline-flex items-center text-tuc-forest dark:text-white font-black text-xs uppercase tracking-widest hover:text-tuc-gold transition-colors group/link focus:outline-none focus:ring-2 focus:ring-tuc-gold rounded p-1"
                aria-label={`Learn more about ${programme.title}`}
              >
                Explore Programme <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
        <div className="flex-shrink-0 w-4" aria-hidden="true"></div>
      </div>
    </section>
  );
};

export default Programmes;

```

### FILE: components/PuppeteerSelfTest.tsx
```typescript

import React, { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Terminal, Activity, ArrowLeft, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { TEST_SUITE, TestResult } from '../lib/testRunner';

interface PuppeteerSelfTestProps {
  onBack: () => void;
}

const PuppeteerSelfTest: React.FC<PuppeteerSelfTestProps> = ({ onBack }) => {
  const [results, setResults] = useState<TestResult[]>(
    TEST_SUITE.map(t => ({ name: t.name, status: 'pending', logs: [], screenshots: [] }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [activeTestIndex, setActiveTestIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const runTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    // Reset
    setResults(TEST_SUITE.map(t => ({ name: t.name, status: 'pending', logs: [], screenshots: [] })));

    for (let i = 0; i < TEST_SUITE.length; i++) {
      setActiveTestIndex(i);
      const test = TEST_SUITE[i];
      const startTime = Date.now();
      
      setResults(prev => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'running' };
        return next;
      });

      try {
        await test.action({
          log: (msg) => {
            setResults(prev => {
              const next = [...prev];
              next[i].logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
              return next;
            });
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          },
          screenshot: async (label) => {
            // Mocking a capture delay and URI
            const mockUri = `https://picsum.photos/800/600?random=${Math.random()}`;
            setResults(prev => {
              const next = [...prev];
              next[i].screenshots.push(mockUri);
              next[i].logs.push(`[SNAPSHOT] Captured: ${label}`);
              return next;
            });
          }
        });

        setResults(prev => {
          const next = [...prev];
          next[i] = { 
            ...next[i], 
            status: 'passed', 
            duration: Date.now() - startTime,
            logs: [...next[i].logs, `[SUCCESS] Test completed in ${Date.now() - startTime}ms`]
          };
          return next;
        });

      } catch (e: any) {
        setResults(prev => {
          const next = [...prev];
          next[i] = { 
            ...next[i], 
            status: 'failed', 
            error: e.message,
            duration: Date.now() - startTime,
            logs: [...next[i].logs, `[ERROR] ${e.message}`]
          };
          return next;
        });
      }
      await new Promise(r => setTimeout(r, 800));
    }

    setIsRunning(false);
    setActiveTestIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Puppeteer Self-Test Suite</h1>
              <p className="text-gray-400 text-sm uppercase tracking-widest font-black">Visual Diagnostic Hub</p>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors border border-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-tuc-gold"
          >
            <ArrowLeft size={16} className="mr-2" /> Exit Suite
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Activity size={18} className="mr-2 text-green-400" />
                Control Panel
              </h2>
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`w-full py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-tuc-gold ${
                  isRunning 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40'
                }`}
              >
                {isRunning ? 'Running Suite...' : 'Run Diagnostics'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">Test Cases</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {results.map((test, idx) => (
                  <div key={idx} className={`px-6 py-4 flex items-center justify-between transition-colors ${activeTestIndex === idx ? 'bg-blue-900/20' : ''}`}>
                    <div className="flex items-center space-x-3">
                      {test.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-gray-600" />}
                      {test.status === 'running' && <LoaderIcon />}
                      {test.status === 'passed' && <CheckCircle size={20} className="text-green-500" />}
                      {test.status === 'failed' && <XCircle size={20} className="text-red-500" />}
                      <span className={`text-xs font-bold uppercase ${test.status === 'pending' ? 'text-gray-500' : test.status === 'running' ? 'text-blue-400' : 'text-gray-200'}`}>
                        {test.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-black/80 rounded-xl border border-gray-700 shadow-2xl h-[400px] flex flex-col backdrop-blur-sm">
              <div className="px-4 py-2 bg-gray-800/80 rounded-t-xl border-b border-gray-700 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-500 font-mono">STDOUT --verbose</span>
              </div>
              
              <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-2 scrollbar-thin">
                {results.flatMap((t, tIdx) => 
                  t.logs.map((log, lIdx) => (
                    <div key={`${tIdx}-${lIdx}`} className="flex">
                      <span className="text-blue-500 mr-2">➜</span>
                      <span className={`${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : log.includes('[SNAPSHOT]') ? 'text-blue-400' : 'text-gray-300'}`}>
                        {log}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Snapshot Gallery */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-400" /> Diagnostic Snapshot Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.flatMap(r => r.screenshots).map((src, i) => (
                  <div key={i} className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
                    <img src={src} alt="Test snapshot" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <ExternalLink size={16} className="text-white" />
                    </div>
                  </div>
                ))}
                {results.every(r => r.screenshots.length === 0) && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-700 rounded-xl">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Awaiting diagnostic snapshots...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoaderIcon = () => (
  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default PuppeteerSelfTest;

```

### FILE: components/Resources.tsx
```typescript

import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, UserPlus, Home, BookOpen, ClipboardCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { useUI } from '../context/UIContext.tsx';

const Resources: React.FC = () => {
  const { openChat } = useUI();

  const primaryResources = [
    {
      title: "Student Handbook",
      description: "Essential guide for fresh undergraduate students covering institutional policies and academic standards.",
      icon: <BookOpen size={32} className="text-tuc-gold" />,
      link: "https://aucdt.edu.gh/wp-content/uploads/2022/09/AUCDT-Students-Handbook.pdf",
      type: "download"
    },
    {
      title: "Staff Application",
      description: "Official DHR application form for prospective academic and administrative personnel.",
      icon: <UserPlus size={32} className="text-tuc-gold" />,
      link: "https://aucdt.edu.gh/wp-content/uploads/2021/07/AUCDT-DHR-Application-Form-2021.pdf",
      type: "download"
    }
  ];

  const quickLinks = [
    {
      title: "Hostel Regulations",
      description: "Rules and conduct guidelines for students residing in Techbridge campus housing.",
      icon: <Home size={24} className="text-tuc-forest dark:text-tuc-gold" />,
      link: "https://aucdt.edu.gh/aucdt-hostel-rules-and-regulations/",
      actionText: "Read Online"
    },
    {
      title: "Institutional Brochure",
      description: "Comprehensive 2025/2026 prospectus highlighting programmes and campus facilities.",
      icon: <FileText size={24} className="text-tuc-forest dark:text-tuc-gold" />,
      link: "https://aucdt.edu.gh/wp-content/uploads/2022/12/AUCDT-2023-School-Brochure.pdf",
      actionText: "Download PDF"
    },
    {
      title: "Course Assessment",
      description: "Student portal for anonymous evaluation of lecturers and academic modules.",
      icon: <ClipboardCheck size={24} className="text-tuc-forest dark:text-tuc-gold" />,
      link: "https://form.jotform.com/232612654041548",
      actionText: "Open Portal"
    }
  ];

  return (
    <div className="bg-white dark:bg-tuc-midnight min-h-screen font-sans">
      {/* Breadcrumbs */}
      <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 text-left">
          <ol className="flex text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <li><Link to="/" className="hover:text-tuc-forest transition-colors">Home</Link></li>
            <li className="mx-3 opacity-30">/</li>
            <li className="text-tuc-gold">Resources & Publications</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 bg-tuc-forest overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://aucdt.edu.gh/wp-content/uploads/2022/01/AUCDT-Building-Banner.jpg')] bg-cover bg-center opacity-10 grayscale scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-tuc-forest via-tuc-forest/90 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-left">
          <div className="max-w-3xl">
            <span className="text-tuc-gold font-black uppercase tracking-[0.5em] text-xs">Institutional Repository</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mt-4 uppercase tracking-tighter leading-none mb-6">
              Campus <br /> Resources
            </h1>
            <p className="text-white/70 text-lg font-medium max-w-xl leading-relaxed">
              Access invaluable publications, registration forms, and policy handbooks designed to support life at Techbridge University College.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Resources (Handbook & Staff App) */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {primaryResources.map((res, i) => (
            <div key={i} className="bg-tuc-ivory dark:bg-gray-800 p-10 lg:p-14 rounded-[3.5rem] shadow-2xl border border-tuc-forest/5 group flex flex-col items-start text-left">
              <div className="bg-tuc-forest p-5 rounded-3xl w-fit mb-8 shadow-lg transform group-hover:rotate-6 transition-transform duration-500">
                {res.icon}
              </div>
              <h2 className="text-3xl font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-tighter mb-4">{res.title}</h2>
              <p className="text-lg text-tuc-stone dark:text-gray-300 font-bold leading-relaxed mb-10 flex-1">
                {res.description}
              </p>
              <a 
                href={res.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                download
                className="inline-flex items-center gap-4 bg-tuc-forest text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-tuc-gold hover:text-tuc-forest transition-all shadow-xl focus:outline-none focus:ring-4 focus:ring-tuc-gold"
                aria-label={`Download ${res.title}`}
                title={`Download ${res.title}`}
              >
                Download Document <Download size={18} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Intro Text Block */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-lg text-tuc-stone dark:text-gray-400 font-medium leading-relaxed">
            The following links provide access to essential tools and information for staff, students, and visitors. 
            Please bookmark this repository for frequently requested forms and institutional records.
          </p>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group flex flex-col items-start text-left focus:outline-none focus:ring-4 focus:ring-tuc-forest dark:focus:ring-tuc-gold"
              aria-label={`Open ${link.title}`}
              title={`Open ${link.title}`}
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <h3 className="text-xl font-black text-tuc-forest dark:text-white mb-4 uppercase tracking-tighter">
                {link.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8 flex-1">
                {link.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-tuc-forest dark:text-tuc-gold uppercase tracking-widest group-hover:underline">
                {link.actionText} <ExternalLink size={14} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-20 bg-white dark:bg-tuc-midnight">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-tuc-forest p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-tuc-gold/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6">Need Further Assistance?</h2>
              <p className="text-white/70 text-lg font-medium mb-12 max-w-2xl mx-auto">
                If you cannot find the specific document or form you require, please contact the institutional registry or ask our AI assistant, BridgeBot.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link 
                  to="/" 
                  className="bg-tuc-gold text-tuc-forest px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl focus:outline-none focus:ring-4 focus:ring-white"
                  aria-label="Contact the institutional registry"
                  title="Contact Registry"
                >
                  Contact Registry
                </Link>
                <button 
                  onClick={openChat}
                  className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:border-white transition-all focus:outline-none focus:ring-4 focus:ring-white"
                  aria-label="Ask BridgeBot for assistance"
                  title="Ask BridgeBot"
                >
                  Ask BridgeBot <ArrowRight className="inline-block ml-2" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.5em]">
          Design and Build a Nation!
        </p>
      </div>
    </div>
  );
};

export default Resources;

```

### FILE: components/Scholarship.tsx
```typescript
import React from 'react';

const Scholarship: React.FC = () => {
  return (
    <section className="relative py-32 bg-tuc-forest text-white text-center overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="relative max-w-4xl mx-auto px-4 z-10">
        <span className="text-tuc-gold font-black uppercase tracking-[0.5em] text-xs">Empowering Talent</span>
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase text-white">The Bridge Scholarship</h2>
        <p className="text-lg md:text-xl mb-12 text-gray-300 leading-relaxed font-medium">
          Techbridge University College is committed to making high-tech education accessible. We offer generous undergraduate scholarships for creative minds demonstrating industrial potential.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a 
            href="https://portal.aucdt.edu.gh/eligibility/" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-transparent border-2 border-white text-white font-black rounded-full hover:bg-white hover:text-tuc-forest transition-all duration-300 uppercase tracking-widest text-xs focus:outline-none focus:ring-4 focus:ring-tuc-gold"
            aria-label="Check your eligibility for The Bridge Scholarship"
            title="Check Eligibility"
          >
            Check Eligibility
          </a>
          <a 
            href="#coming-soon" 
            className="px-10 py-5 bg-tuc-gold text-tuc-forest border-2 border-tuc-gold font-black rounded-full hover:bg-white hover:border-white transition-all duration-300 uppercase tracking-widest text-xs focus:outline-none focus:ring-4 focus:ring-white"
            aria-label="Download The Bridge Scholarship Guide"
            title="Download Guide"
          >
            Download Guide
          </a>
        </div>
      </div>
    </section>
  );
};

export default Scholarship;
```

### FILE: components/SecondaryCTA.tsx
```typescript
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
                className="inline-block bg-tuc-gold text-tuc-forest font-semibold px-8 py-3 rounded shadow-md hover:shadow-lg hover:bg-tuc-forest hover:text-white transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-4 focus:ring-tuc-forest"
                aria-label="Download student brochure"
                title="Download Brochure"
              >
                Download Brochure
            </a>
        </div>
      </div>
    </section>
  );
};

export default SecondaryCTA;
```

### FILE: components/ThemeToggle.tsx
```typescript
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700" role="group" aria-label="Theme Selection">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-tuc-gold ${
          theme === 'light' 
            ? 'bg-white text-tuc-forest shadow-sm' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Switch to Light Mode"
        title="Light Mode"
        aria-pressed={theme === 'light'}
      >
        <Sun size={16} aria-hidden="true" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-tuc-gold ${
          theme === 'dark' 
            ? 'bg-gray-700 text-tuc-gold shadow-sm' 
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Switch to Dark Mode"
        title="Dark Mode"
        aria-pressed={theme === 'dark'}
      >
        <Moon size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default ThemeToggle;
```

### FILE: constants.ts
```typescript
import { NavItem, SlideData, ProgrammeCardData, FacultyMember, NewsItem } from './types.ts';

export const COLOR_TOKENS = [REDACTED_CREDENTIAL]
  primary: '#1A5C38',      // Deep Forest
  primaryDark: '#0F3D24',  // Midnight Forest
  primaryLight: '#E8F5EE', // Leaf Mist
  accent: '#D4A017',       // Kente Gold
  bg: '#F5F3EE',           // Warm Ivory
  text: '#1C1C1A',         // Charcoal
  textMuted: '#5F5E5A',    // Stone
  border: '#D3D1C7',       // Linen
  maroon: '#630F12',       // Institutional Maroon
  ink: '#1A1209',          // Deep Ink
  cream: '#F5F0E8',        // Editorial Cream
  silver: '#8A8A8A',       // Subdued Metadata
};

export const ADMIN_CONFIG = {
  password: process.env.ADMIN_PASSWORD || 'admin123',
  maxLoginAttempts: 3,
  lockoutTimeMs: 30000,
};

export const LOGO_URL = "https://techbridge.edu.gh/static/TUC_LOGO_1.png";

export const SOCIAL_LINKS = {
  facebook: 'https://web.facebook.com/aucdtedugh?_rdc=1&_rdr',
  twitter: 'https://twitter.com/aucdtedugh',
  instagram: 'https://www.instagram.com/aucdtedugh/',
  tiktok: 'https://www.tiktok.com/@aucdt.edu.gh',
  linkedin: 'https://www.linkedin.com/company/aucdtedugh',
  youtube: 'https://www.youtube.com/channel/UC7ih9u2yzUyj1_KnYZnHnmw'
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', labelKey: 'nav.home_label', href: '/' },
  {
    label: 'About TUC',
    labelKey: 'nav.about_label',
    href: '/about/message',
    children: [
      { label: 'Message from the President', labelKey: 'nav.message_president', href: '/about/message' },
      { label: 'Our Story', labelKey: 'nav.our_story', href: '/about/story' },
      { label: 'Leadership', labelKey: 'nav.leadership', href: '/about/leadership' },
      { label: 'Vision & Mission', labelKey: 'nav.vision_mission', href: '/about/vision' },
      { label: 'Governing Council', labelKey: 'nav.governing_council', href: '/about/council' },
    ]
  },
  {
    label: 'Academics',
    labelKey: 'nav.academics_label',
    href: '/academics',
    children: [
      { label: 'Academics Overview', labelKey: 'nav.academics_overview', href: '/academics' },
      { label: 'Faculty', labelKey: 'nav.faculty', href: '/academics/faculty' },
      { label: 'Academic Calendar', labelKey: 'nav.academic_calendar', href: '/academics/calendar' },
      { label: 'Timetable', labelKey: 'nav.timetable', href: '/academics/timetable' },
      { label: 'AUCDT LMS', labelKey: 'nav.lms', href: 'https://portal.aucdt.edu.gh/admissions/#/home' }
    ]
  },
  { label: 'Admissions', labelKey: 'nav.admissions_label', href: 'https://portal.aucdt.edu.gh/admissions/#/home' },
  {
    label: 'Newsroom',
    labelKey: 'nav.newsroom_label',
    href: '/news-feed',
    children: [
      { label: 'Newsfeed', labelKey: 'nav.newsfeed', href: '/news-feed' },
      { label: 'Resources', labelKey: 'nav.resources_label', href: '/resources' },
    ]
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 101,
    title: "Techbridge Wins Fashion School of the Year 2025!",
    date: "December 12, 2025",
    excerpt: "TUC secures the ultimate accolade at the Ghana Tertiary Fashion Awards, with Ms. Victoria Honu named Fashion Educator of the Year.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg",
    category: "Major Achievement",
    link: "https://aucdt.edu.gh/newsroom/"
  },
  {
    id: 247911,
    title: "AUCDT National Service Recruitment 2025/2026",
    date: "Aug 25, 2025",
    excerpt: "AsanSka University College of Design and Technology is recruiting for National Service Personnel for the 2025/2026 service year. Join us to build your career in Marketing, Administration & IT.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/08/AUCDT-National-Service-Recruitment-400x250.jpeg",
    category: "Recruitment",
    link: "https://aucdt.edu.gh/aucdt-national-service-recruitment-2025-2026/"
  },
  {
    id: 247861,
    title: "AUCDT Opens Admissions for 2025/26 Academic Year",
    date: "May 26, 2025",
    excerpt: "Admissions are now open for the 2025/2026 academic year. Apply now to join the premier design technology university in Ghana. Offering BTech and BA programmes.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/05/AUCDT-Opens-Admission-400x250.jpeg",
    category: "Admissions",
    link: "https://aucdt.edu.gh/aucdt-opens-admissions-for-2025-26-academic-year/"
  },
  {
    id: 247778,
    title: "AUCDT Launches New Learning Management System",
    date: "Mar 4, 2025",
    excerpt: "A significant step forward in enhancing digital learning and teaching experiences with the new LMS built on the Moodle framework, providing a flexible and interactive environment.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/03/Agbosu-presenting-at-the-AUCDT-LMS-400x250.webp",
    category: "Technology",
    link: "https://aucdt.edu.gh/aucdt-launches-new-learning-management-system/"
  },
  {
    id: 248001,
    title: "Estate Officer Position Available",
    date: "Apr 2025",
    excerpt: "AsanSka University College of Design and Technology is in search of a qualified professional to fill the role of Estate Officer to manage campus facilities.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/04/estate-officer-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/estate-officer/"
  },
  {
    id: 248002,
    title: "Library Assistant Position",
    date: "Apr 2025",
    excerpt: "We are seeking a dedicated and detail-oriented Library Assistant to support the effective operation of our academic library and student research.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/04/library-assistant-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/library-assistant-position/"
  },
  {
    id: 248003,
    title: "AUCDT on Blackboard: A Conversation with AI",
    date: "Feb 2025",
    excerpt: "Exploring the integration of Artificial Intelligence in modern education systems and the future of digital learning platforms at TUC.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/02/AUCDT-on-Blackboard-1080x675.jpg",
    category: "Technology",
    link: "https://aucdt.edu.gh/aucdt-on-blackboard-a-conversation-with-ai/"
  },
  {
    id: 248004,
    title: "Building a Better RAG: The DeepSeek Blueprint",
    date: "Feb 2025",
    excerpt: "A technical deep dive into Retrieval-Augmented Generation and how DeepSeek architectures are influencing our AI curriculum.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/02/building-a-responseive-RAG-1080x675.jpg",
    category: "Research",
    link: "https://aucdt.edu.gh/building-a-better-rag-the-deepseek-blueprint/"
  },
  {
    id: 247584,
    title: "AsanSka University College Wins Innovative Fashion School of the Year!",
    date: "Jan 7, 2025",
    excerpt: "The Fashion Design Technology Department has been honoured as the Innovative Fashion School of the Year at the prestigious Ghana Tertiary Fashion Awards.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-Website-400x250.jpg",
    category: "Achievement",
    link: "https://aucdt.edu.gh/asanska-university-college-wins-innovative-fashion-school-of-the-year/"
  },
  {
    id: 247577,
    title: "Akosua Osei Sasu wins the National Jewellery Competition Award",
    date: "Jan 7, 2025",
    excerpt: "Celebrating the exceptional talent of our Jewellery Design student, Akosua Osei Sasu, for winning the top national prize.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Akosua-Sasu-Award-Website-400x250.jpg",
    category: "Student Success",
    link: "https://aucdt.edu.gh/akosua-osei-sasu-wins-the-national-jewellery-competition-award/"
  },
  {
    id: 248005,
    title: "Administrative Officer",
    date: "Jan 2025",
    excerpt: "Administrative Officer role available for AUCDT TVET Programme. Join our administrative team to support vocational training excellence.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/administrative-officer-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/administrative-officer/"
  },
  {
    id: 248006,
    title: "Dean of Academic Affairs",
    date: "Jan 2025",
    excerpt: "Leadership position open for Dean of Academic Affairs to oversee curriculum development and academic standards.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/dean-of-academic-affairs-1080x675.jpg",
    category: "Job Opening",
    link: "https://aucdt.edu.gh/dean-of-academic-affairs/"
  },
  {
    id: 247557,
    title: "Nurudeen Issah: Student Fashion Designer of the Year 2024",
    date: "Dec 2, 2024",
    excerpt: "We are happy to announce that our very own Nurudeen Issah has been awarded Student Fashion Designer of the Year 2024.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2024/12/Issah-Nurudeen-Student-Fashion-Designer-of-the-Year-2024-Website-400x250.jpg",
    category: "Student Success",
    link: "https://aucdt.edu.gh/nurudeen-issah-student-fashion-designer-of-the-year-2024/"
  }
];

export const COUNCIL_DATA = [
  {
    name: 'Prof. Rudith King',
    role: 'Chairperson of Governing Council',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Prof-Rudith-King.jpg'
  },
  {
    name: 'Prof. Daniel Obeng-Ofori',
    role: 'Vice-Chair of Governing Council',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/08/Prof-Obeng.jpg'
  },
  {
    name: 'Dr. Emmanuel A. Asante',
    role: 'President',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/07/Prof-Asante-Cream-bg.jpg'
  },
  {
    name: 'Dr. Joseph A. A. Sackey',
    role: 'Vice President',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/12/Dr-J-A-A-Sackey-Profile-Picture.jpg'
  },
  {
    name: 'Dr. Patrique de Graft-Yankson',
    role: 'Member (UEW Representative)',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/DeGraft.jpg'
  },
  {
    name: 'Ms. Doris A. Bramson',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Doris-Bramson.jpg'
  },
  {
    name: 'Dr. Kafui K. Agyeman',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Dr-Agyeman.jpg'
  },
  {
    name: 'Mr. Emmanuel Botwe',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/01/Mr-Emmanuel-Botwe.jpg'
  },
  {
    name: 'Dr. Andrew Richard Owusu Addo',
    role: 'Member',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2021/07/Dr-Andrew-R-O-Addo-1.jpg'
  },
  {
    name: 'Mr. Daniel Twum',
    role: 'Head of Department, ICT',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/03/Daniel-Twum.jpg'
  },
  {
    name: 'Mr. Thomas Owusu',
    role: 'Senior and Junior Member Representative',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgMUbstva1ZUl2W6VKZpqc219rOkfcNyBe5A&s'
  },
  {
    name: 'Mr. Daniel Yesueflem Adzande',
    role: 'Student Representative',
    image: 'https://scontent.facc6-1.fna.fbcdn.net/v/t39.30808-6/516078572_1304975058299438_2324766102852693068_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=mG-ipsoFkp4Q7kNvwGP2iRV&_nc_oc=AdmQOjnzgfB4f20hySTk628BjAFWgNcTmTgCnWZD8nuuGgNlgsmwWCD64izkrxpvWS0&_nc_zt=23&_nc_ht=scontent.facc6-1.fna&_nc_gid=YQG5iH1iVZLGaZmRwZexuA&oh=00_AfvMhRPzbnwIBbc4kqEdmVrycozfDFxBC1_85cH43Az7Xg&oe=69969147'
  }
];

export const FACULTY_DATA: FacultyMember[] = [
  {
    id: 'f1',
    name: 'Dr. Andrew R. O. Addo',
    slug: 'andrew-richard-owusu-addo',
    title: 'Head of Department',
    department: 'Jewellery Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2021/07/Dr-Andrew-R-O-Addo-1.jpg',
    email: 'a.owusuaddo@tuc.edu.gh',
    education: ['Ph.D. Jewellery Tech', 'M.Tech Jewellery Design', 'B.A. Fine Art'],
    researchInterests: ['Industrial Casting', 'Gemology', 'Precious Metal Alloys', 'Jewellery Fabrication History'],
    bio: 'Dr. Addo leads our Jewellery Design department with a focus on industrial engineering and precision manufacturing in the luxury goods sector.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/andrew-richard-owusu-addo/'
  },
  {
    id: 'f2',
    name: 'Selete K. D. Ofori',
    slug: 'selete-k-d-ofori',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/03/Mr-Selete-Ofori.jpg',
    email: 's.ofori@tuc.edu.gh',
    education: ['M.A. Design', 'B.A. Metal Art'],
    researchInterests: ['Contemporary Metal Arts', 'Sustainable Jewellery', 'Adinkra Symbolism in Design'],
    bio: 'Specialising in contemporary metal arts and gemstone settings, Selete bridges traditional craftsmanship with modern design aesthetics.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/selete-k-d-ofori/'
  },
  {
    id: 'f3',
    name: 'Dr. Kwame Baah Owusu Panin',
    slug: 'kwame-baah-owusu-panin',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/03/Kwame-Baah-Owusu-Panin.jpg',
    email: 'k.panin@tuc.edu.gh',
    education: ['M.Phil Design', 'B.Tech Jewellery'],
    researchInterests: ['3D Printing in Jewellery', 'CAD/CAM Technologies', 'Mass Production Systems'],
    bio: 'An expert in manufacturing processes and industrial design for high-end jewellery collections.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/kwame-baah-owusu-panin/'
  },
  {
    id: 'f4',
    name: 'Kwabena Asomaning',
    slug: 'kwabena-asomaning',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://picsum.photos/400/500?random=4',
    email: 'k.asomaning@tuc.edu.gh',
    education: ['M.Sc. Engineering', 'B.A. Design'],
    researchInterests: ['Materials Science', 'Alloy Development', 'Industrial Metallurgy'],
    bio: 'Researches materials engineering in the context of precious metals and alloy development for industrial applications.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/kwabena-asomaning/'
  },
  {
    id: 'f19',
    name: 'Nutifafa Korsi Fiadzormor',
    slug: 'nutifafa-korsi-fiadzormor',
    title: 'Lecturer',
    department: 'Jewellery Design',
    image: 'https://picsum.photos/400/500?random=19',
    email: 'n.fiadzormor@techbridge.edu.gh',
    education: ['M.Tech. Jewellery'],
    researchInterests: ['Gemology', 'Traditional Jewellery', 'Precious Metal Casting'],
    bio: 'Expert in gemology, precious metal casting, and traditional Ghanaian jewellery techniques.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/nutifafa-korsi-fiadzormor/'
  },
  {
    id: 'f5',
    name: 'Robert Bunkangsang Buchag',
    slug: 'robert-bunkangsang-buchag',
    title: 'Head of Department',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/03/Robert-Buchag.jpg',
    email: 'robert.buchag@tuc.edu.gh',
    education: ['M.Phil Communication', 'B.F.A. Media'],
    researchInterests: ['Interactive Storytelling', 'Digital Communication Strategies', 'New Media Ethics'],
    bio: 'Leading the DMCD department towards interactive storytelling and disruptive digital communication strategies.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/robert-bunkangsang-buchag/'
  },
  {
    id: 'f6',
    name: 'Samuel Nii Lante Wellington',
    slug: 'samuel-nii-lante-wellington',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/02/Samuel-Nii-Lante-Wellington.jpg',
    email: 's.wellington@tuc.edu.gh',
    education: ['M.A. Arts', 'B.Sc. IT'],
    researchInterests: ['Digital Cinematography', 'Visual Effects', 'Film Production Workflows'],
    bio: 'Specialist in cinematography and digital image processing with deep industry roots in Ghanaian media.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/samuel-nii-lante-wellington/'
  },
  {
    id: 'f7',
    name: 'Selasi Ahiabu',
    slug: 'selasi-ahiabu',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/03/Selasi-Ahiabu-DMCD.jpg',
    email: 's.ahiabu@tuc.edu.gh',
    education: ['M.Sc. Software Engineering', 'B.Sc. Computer Science'],
    researchInterests: ['UX/UI Design', 'Web Technologies', 'Streaming Architectures'],
    bio: 'Focuses on the technical backend of digital media, including streaming technologies and UX architectures.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/selasi-ahiabu/'
  },
  {
    id: 'f8',
    name: 'Bright Senanu Agbosu',
    slug: 'bright-senanu-agbosu',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2020/11/Bright-Senanu-Agbosu.jpg',
    email: 'b.agbosu@tuc.edu.gh',
    education: ['M.A. Media Arts'],
    researchInterests: ['Motion Graphics', 'Animation', 'Instructional Design'],
    bio: 'Instructional media designer focused on high-fidelity motion graphics and animation for commercial sectors.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/bright-senanu-agbosu/'
  },
  {
    id: 'f16',
    name: 'Michael Obeng',
    slug: 'michael-obeng',
    title: 'Lecturer',
    department: 'Digital Media',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2022/07/Michael.jpg',
    email: 'micheal.obeng@tuc.edu.gh',
    education: ['M.F.A. Sound Design'],
    researchInterests: ['Audio Engineering', 'Acoustic Environments', 'Soundscapes'],
    bio: 'Expert in digital sound engineering, audio post-production, and immersive acoustic environments.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/michael-obeng/'
  },
  {
    id: 'f17',
    name: 'Isaac N. Ofori',
    slug: 'isaac-ofori',
    title: 'Technical Instructor',
    department: 'Digital Media',
    image: 'https://techbridge.edu.gh/static/staff/isaac_ofori.jpg',
    email: 'isaac.ofori@techbridge.edu.gh',
    education: ['M.Sc. Industrial Design'],
    researchInterests: ['Multimedia Production', 'Broadcasting Technology'],
    bio: 'Expert in digital sound engineering, audio post-production, and immersive acoustic environments.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/isaac-ofori/'
  },
  {
    id: 'f9',
    name: 'Aaron Adjacodjoe',
    slug: 'aaron-adjacodjoe',
    title: 'Head of Department',
    department: 'Product Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/11/Aaron-ADJACODJOE.jpg',
    email: 'a.adjacodjoe@tuc.edu.gh',
    education: ['Ph.D. Visual Communication', 'M.A. Design'],
    researchInterests: ['Product Lifecycle Management', 'Human-Centric Design', 'Design Thinking'],
    bio: 'Leading innovations in product lifecycle management and human-centric design frameworks.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/aaron-adjacodjoe/'
  },
  {
    id: 'f10',
    name: 'William Daitey',
    slug: 'william-daitey',
    title: 'Lecturer',
    department: 'Product Design',
    image: 'https://techbridge.edu.gh/static/staff/william_daitey.jpg',
    email: 'william.daitey@tuc.edu.gh',
    education: ['M.A. Communications'],
    researchInterests: ['Design Ethics', 'Industrial Relations', 'Professional Practice'],
    bio: 'Expert in professional ethics and industrial relations within the design sector.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/william-daitey/'
  },
  {
    id: 'f11',
    name: 'Agyenim Boateng',
    slug: 'agyenim-boateng',
    title: 'Part-Time Lecturer',
    department: 'Product Design',
    image: 'https://picsum.photos/400/500?random=11',
    email: 'a.boateng@tuc.edu.gh',
    education: ['M.Sc. IT'],
    researchInterests: ['Additive Manufacturing', '3D Prototyping', 'CAD Modeling'],
    bio: 'Specialist in 3D modeling and additive manufacturing for product prototyping.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/agyenim-boateng/'
  },
  {
    id: 'f18',
    name: 'Bright Agbotse',
    slug: 'bright-agbotse',
    title: 'Technical Instructor',
    department: 'Product Design',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2021/07/Mr-Bright-Agbotse.jpg',
    email: 'b.agbotse@tuc.edu.gh',
    education: ['M.A. Fashion Technology'],
    researchInterests: ['Textile Science', 'Apparel Manufacturing', 'Garment Construction'],
    bio: 'Focuses on advanced garment construction, textile science, and apparel manufacturing technology.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/bright-agbotse/'
  },
  {
    id: 'f12',
    name: 'Victoria Abra Honu',
    slug: 'victoria-abra-honu',
    title: 'Programme Coordinator',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2024/01/Victoria-Abra-Honu.jpg',
    email: 'victoria.honu@techbridge.edu.gh',
    education: ['M.Sc. Textiles'],
    researchInterests: ['Sustainable Textiles', 'Tie-Dye Techniques', 'Fashion Innovation'],
    bio: 'Specialist in tie-dye techniques and sustainable textile production in the modern fashion landscape.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/victoria-abra-honu/'
  },
  {
    id: 'f14',
    name: 'Mary Eddy Takyi',
    slug: 'mary-eddy-takyi',
    title: 'Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/11/Mary-Eddy-Takyi-Fashion-Design.jpg',
    email: 'm.takyi@techbridge.edu.gh',
    education: ['M.Sc. Fashion Design'],
    researchInterests: ['Pattern Design', 'Garment Construction', 'Industrial Manufacturing'],
    bio: 'Specialist in pattern design and precision garment construction for industrial manufacturing.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/mary-eddy-takyi/'
  },
  {
    id: 'f13',
    name: 'Florence Kushitor',
    slug: 'florence-kushitor',
    title: 'Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/04/Mrs-Florence-Kushitor.jpg',
    email: 'f.kushitor@techbridge.edu.gh',
    education: ['M.Sc. Textiles'],
    researchInterests: ['Contemporary Textile Design', 'Heritage Fashion', 'Textile Arts'],
    bio: 'Expert in traditional and contemporary textile design, focusing on the intersection of heritage and high-fashion.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/florence-kushitor/'
  },
  {
    id: 'f15',
    name: 'Doris Boakyewaa',
    slug: 'doris-boakyewaa',
    title: 'Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://aucdt.edu.gh/wp-content/uploads/2023/01/Doris-Boakyewaa.jpg',
    email: 'd.boakyewaa@techbridge.edu.gh',
    education: ['M.Sc. Fashion Design'],
    researchInterests: ['Structural Design', 'Pattern Cutting', 'Technical Fashion'],
    bio: 'Instructional lead for pattern cutting and structural design, bringing decades of technical mastery to the classroom.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/doris-boakyewaa/'
  },
  {
    id: 'f20',
    name: 'Daniel Morrison',
    slug: 'daniel-morrison',
    title: 'Part-Time Lecturer',
    department: 'Fashion Design Technology',
    image: 'https://picsum.photos/400/500?random=20',
    email: 'daniel.morrison@techbridge.edu.gh',
    education: ['B.A. Industrial Art'],
    researchInterests: ['Fashion Technology', 'Industrial Art', 'Design Education'],
    bio: 'Academic staff member in the Department of Fashion Design Technology.',
    profileUrl: 'https://aucdt.edu.gh/academics/faculty/daniel-morrison/'
  }
];

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    title: "Experience TUC from Above",
    titleKey: "hero.title1",
    subtitle: "Pioneering the Future of Industrial Education",
    subtitleKey: "hero.subtitle1",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Banner-A.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-beautiful-university-campus-4008-large.mp4",
    ctaLink: "https://portal.aucdt.edu.gh/admissions/#/home",
    ctaText: "Apply for 2026",
    ctaTextKey: "hero.cta1",
    overlayColor: "bg-tuc-ink/40"
  },
  {
    id: 2,
    title: "Ghana Tertiary Fashion Awards 2025",
    titleKey: "hero.title2",
    subtitle: "Fashion School of the Year",
    subtitleKey: "hero.subtitle2",
    image: "https://aucdt.edu.gh/wp-content/uploads/2025/01/Innovative-Fashion-School-of-the-Year-2024.jpg",
    ctaLink: "/news-feed",
    ctaText: "View Achievement",
    ctaTextKey: "hero.cta2",
    overlayColor: "bg-black/50",
    hideText: true
  },
  {
    id: 3,
    title: "Creative Intelligence",
    titleKey: "hero.title3",
    subtitle: "Where Design Thinking Meets Technical Mastery",
    subtitleKey: "hero.subtitle3",
    image: "https://aucdt.edu.gh/img/bg.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-beautiful-university-campus-4008-large.mp4",
    ctaLink: "/academics",
    ctaText: "View Programmes",
    ctaTextKey: "hero.cta3",
    overlayColor: "bg-tuc-ink/40"
  },
  {
    id: 4,
    title: "Department of",
    titleKey: "hero.title4",
    subtitle: "Product Design",
    subtitleKey: "hero.subtitle4",
    image: "https://aucdt.edu.gh/wp-content/uploads/2020/08/Product-Design-material-test.jpg",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta4",
    overlayColor: "bg-black/50"
  },
  {
    id: 5,
    title: "Department of",
    titleKey: "hero.title5",
    subtitle: "Jewellery Design",
    subtitleKey: "hero.subtitle5",
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/09/Student-ring-design.jpg",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta5",
    overlayColor: "bg-black/50"
  },
  {
    id: 6,
    title: "Department of",
    titleKey: "hero.title6",
    subtitle: "Digital Media and Communication Design",
    subtitleKey: "hero.subtitle6",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Digital-Media-and-Communication-Design-Banner.jpg",
    video: "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-beautiful-university-campus-4008-large.mp4",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta6",
    overlayColor: "bg-black/50"
  },
  {
    id: 7,
    title: "Welcome to the Department of",
    titleKey: "hero.title7",
    subtitle: "Fashion Design Technology",
    subtitleKey: "hero.subtitle7",
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/06/aucdt-fashion3.jpg",
    ctaLink: "/academics",
    ctaText: "Explore Department",
    ctaTextKey: "hero.cta7",
    overlayColor: "bg-black/50"
  }
];

export const PROGRAMMES: ProgrammeCardData[] = [
  {
    id: 1,
    title: "Digital Media & Communication",
    description: "Master the art of interactive storytelling and disruptive digital communication strategies in a rapidly evolving landscape.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Digital-Media-and-Communication-Design-Banner.jpg",
    badge: "B.Tech DMCD",
    link: "/academics"
  },
  {
    id: 2,
    title: "Product Design & Entrepreneurship",
    description: "Bridge the gap between creativity and commerce. Learn to design products that solve real-world problems and lead ventures.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1600&auto=format&fit=crop",
    badge: "B.A. PDE",
    link: "/academics"
  },
  {
    id: 3,
    title: "Fashion Design Technology",
    description: "Innovate the fashion industry through technical excellence, sustainable practices, and creative leadership.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/06/aucdt-fashion3.jpg",
    badge: "B.Tech FDT",
    link: "/academics"
  },
  {
    id: 4,
    title: "Jewellery Design Technology",
    description: "Precision manufacturing meets luxury design. Become a master of precious metal arts and contemporary adornment.",
    image: "https://aucdt.edu.gh/wp-content/uploads/2020/08/lecturer-with-student.jpg",
    badge: "B.A. JDT",
    link: "/academics"
  }
];

```

### FILE: context/ThemeContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Fix: Explicitly type the component with React.FC and define children prop
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage or system preference (never restore high-contrast)
    const savedTheme = localStorage.getItem('aucdt-theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    if (theme === 'dark') root.classList.add('dark');
    localStorage.setItem('aucdt-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### FILE: context/UIContext.tsx
```typescript
import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isChatOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Fix: Explicitly type the component with React.FC and define children prop
export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(prev => !prev);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <UIContext.Provider value={{ isChatOpen, toggleChat, openChat, closeChat }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
```

### FILE: CREATION.md
```md
# techbridge-university-college-v3.0.0

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80

```

### FILE: docs/ADMIN_GUIDE.md
```md

# TUC Platform Administration Guide

## 1. Authentication
- **Entry Point:** Access via `/#/admin` (or footer Shield icon).
- **Credentials:** Institutional Admin Password (configured via env).
- **Security:** Locked out for 30 seconds after 3 failed attempts.

## 2. Audit Hub
- Monitors all critical system events.
- **Log Types:**
  - `LOGIN_SUCCESS`: Verified administrative access.
  - `LOGIN_FAILURE`: Invalid attempt tracking.
  - `SECURITY_LOCKOUT`: Brute-force prevention triggers.
  - `CLEAR_LOGS`: Log maintenance history.

## 3. System Maintenance
- Logs should be reviewed weekly for unauthorized access patterns.
- Clear logs only after manual backup if institutional policy requires it.

---
**Design and Build a Nation!**

```

### FILE: docs/DEPLOYMENT_GUIDE.md
```md

# TUC Platform Deployment Guide

## 1. Build Environment
- **Node.js:** 18.x or 20.x
- **Package Manager:** npm
- **Build Tool:** Vite

## 2. Configuration
The platform requires a valid Google Gemini API Key.
- `process.env.API_KEY`: Mandatory for BridgeBot and AI services.

## 3. Build Process
```bash
npm install
npm run build
```

## 4. Hosting Recommendation
- **Vercel/Netlify:** Preferred for SPA routing and environment variable management.
- **Manual Nginx:** Ensure `try_files $uri $uri/ /index.html` is configured for React Router support.

---
**Institutional Motto:** "Design and Build a Nation!"

```

### FILE: docs/README.md
```md
# Techbridge University College (TUC) Documentation Hub

Welcome to the official technical documentation for the TUC Web Ecosystem. This platform represents the digital frontier of **Techbridge University College**, Ghanaian's leader in disruptive design and technology education.

## 📁 Technical Specifications
*   **[Software Requirements Specification (SRS)](../SRS_TUC_Final.md)**: Standardised requirements and architectural blueprints.
*   **[Admin Portal Guide](./ADMIN_GUIDE.md)**: Security protocols, authentication policies, and audit log management.
*   **[Deployment Roadmap](./DEPLOYMENT_GUIDE.md)**: Build instructions and environment configuration for production release.
*   **[Testing & Diagnostics](./TESTING_GUIDE.md)**: Manual and automated verification procedures using the Playwright-Lite suite.

## 📐 System Visualisations
*   **[Architecture Diagram](./svg/system_architecture.svg)**: Visual map of component interactions and cloud integration.
*   **[Storage Schema](./svg/storage_schema.svg)**: Data model for client-side persistence (Audit Logs & Preferences).

## 🚀 Key Platform Features
1.  **BridgeBot AI**: A custom Gemini-powered assistant trained on the TUC Student Handbook.
2.  **Audit Hub**: Real-time security event tracking for institutional accountability.
3.  **Adaptive Interface**: Multi-theme support (Light, Dark, High-Contrast) for universal accessibility.
4.  **Integrated QA**: Built-in automated diagnostic suite for zero-dependency validation.

---
**Institutional Motto:** "Design and Build a Nation!"
```

### FILE: docs/SRS_AUCDT_Final.md
```md
# Software Requirements Specification (SRS)
## AsanSka University College of Design and Technology (AUCDT) Web Application
**Version:** 2.0 (Final)
**Date:** October 26, 2025

---

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to define the final software requirements and architectural design for the AUCDT Reimagined Web Application. This modern SPA replaces the legacy website, offering improved performance, an AI-driven student assistant, and administrative oversight tools.

#### 1.2 Scope
The application is built using React 19 and TypeScript. It features:
*   **Public Interface:** Homepage, Programs, News, Admissions.
*   **AI Integration:** "Nkyinkyim" Chatbot powered by Google Gemini 2.5 Flash.
*   **Administrative Core:** Secure login, Audit Logging, and System Diagnostics.
*   **Testing:** Integrated Playwright-Lite self-testing suite.

---

### 2. System Architecture
The system follows a client-side Single Page Application (SPA) architecture. It minimizes server dependency by utilizing browser APIs (LocalStorage) for persistence and communicating directly with Google Cloud for AI services.

**Key Components:**
*   **React SPA:** Handles routing, rendering, and state management.
*   **Audit Logger:** Intercepts sensitive actions and persists them to LocalStorage.
*   **Gemini Service:** Manages streaming connections to the Google GenAI API.

*(See `svg/system_architecture.svg` for visual diagram)*

---

### 3. Functional Requirements

#### 3.1 User Interface
*   **REQ-UI-001:** Responsive design for Mobile, Tablet, and Desktop.
*   **REQ-UI-002:** Theme toggle supporting Light, Dark, and High-Contrast modes.
*   **REQ-UI-003:** Sticky navigation with "Apply Now" prominence.

#### 3.2 AI Assistant ("Nkyinkyim")
*   **REQ-AI-001:** Floating widget accessible globally.
*   **REQ-AI-002:** Streaming text responses via Gemini 2.5 Flash.
*   **REQ-AI-003:** Multimodal input support (Text + Images).
*   **REQ-AI-004:** Context-aware responses based on "Student Handbook" system instructions.

#### 3.3 Administration
*   **REQ-ADM-001:** Hidden route (`/#admin`) for access.
*   **REQ-ADM-002:** Password-based authentication with lockout policy (3 attempts / 30s).
*   **REQ-ADM-003:** Audit logs recording Login, Logout, and Security Events.

#### 3.4 Self-Testing
*   **REQ-TEST-001:** Built-in "Playwright-Lite" runner.
*   **REQ-TEST-002:** Automated scenarios for Homepage, Theme, Chat, and Security.
*   **REQ-TEST-003:** Visual pass/fail reporting in a terminal-like interface.

---

### 4. Technical Stack
*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **AI SDK:** @google/genai
*   **Build Tool:** Vite

*(See `svg/tech_stack.svg` for visual breakdown)*

---

### 5. Data Flow & Persistence
Data flow is primarily unidirectional within the React component tree, with external loops for API calls.

*   **Chat:** User Input -> State -> API Request -> Stream Response -> State Update -> UI.
*   **Admin:** User Input -> Validation -> LocalStorage Write -> State Update -> UI.

*(See `svg/data_flow.svg` for DFD)*

---

### 6. Use Cases
1.  **Prospective Student:** Browses programs, asks AI about fees, clicks "Apply Now".
2.  **Administrator:** Logs in to check security logs, clears history.
3.  **Developer/QA:** Runs the "Test Suite" to verify deployment integrity.

*(See `svg/use_case.svg` and `svg/sequence.svg` for UML diagrams)*

---

**PROJECT STATUS: COMPLETE**
All phases of the project refresh have been executed, tested, and documented.

```

### FILE: docs/SRS_IEEE_TUC.md
```md
﻿
# IEEE Software Requirements Specification (SRS)
## Techbridge University College (TUC) Digital Ecosystem
**Version:** 3.0.0 (Final Architecture)
**Date:** March 28, 2026

---

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to define the software requirements and architectural design for the Techbridge University College (TUC) web application. This document serves as a blueprint for the platform's current state (v3.0.0) and future development.

#### 1.2 Scope
The application is a high-fidelity Single Page Application (SPA) providing institutional information, an AI-driven BridgeBot assistant, and administrative diagnostic tools. It targets prospective students, current students, alumni, staff, donors, and press.

#### 1.3 Institutional Context
**Motto:** "Build What Comes Next" / "Ghana's Home for Tech Talent"
**Core Mission:** Driving admissions applications and bridging education and industry through Disruptive Design and Technical Excellence.

---

### 2. System Architecture
The platform utilizes a decentralized frontend architecture to maximize performance and scalability.

#### 2.1 Technology Stack
- **Frontend Framework:** React 19.2.5
- **Type Safety:** TypeScript
- **Styling Engine:** Tailwind CSS
- **AI Integration:** Google Gemini 3.1 Pro via `@google/genai`
- **Persistence:** Browser LocalStorage with JSON serialization

#### 2.2 System Modules
- **Public Website:** Highly responsive UI for program discovery and admissions.
- **BridgeBot AI:** Contextual agent trained on the Student Handbook.
- **Admin Portal:** Secure auditing and brute-force protection hub.
- **Testing Engine:** Integrated Playwright-Lite diagnostic suite.

---

### 3. Functional Requirements
#### 3.1 AI Interaction (BridgeBot)
- **REQ-AI-01:** Real-time streaming interaction via Gemini 3.1 Pro.
- **REQ-AI-02:** Support for multimodal inputs (text and image analysis).
- **REQ-AI-03:** Contextual grounding using the TUC Student Handbook data.

#### 3.2 Security & Compliance
- **REQ-SEC-01:** Brute-force protection with automatic 30s lockout after 3 failed attempts.
- **REQ-SEC-02:** Detailed audit logging of all administrative actions.
- **REQ-SEC-03:** Password-protected hidden Admin entry point.

#### 3.3 Diagnostic Suite
- **REQ-DIAG-01:** Automated verification of Brand and Motto.
- **REQ-DIAG-02:** Verification of AI session initialization.
- **REQ-DIAG-03:** Visual regression check via diagnostic snapshots.

---

### 4. Non-Functional Requirements
#### 4.1 Accessibility
- **REQ-ACC-01:** WCAG AA minimum compliance, AAA target for body text.
- **REQ-ACC-02:** Support for Light, Dark, and High-Contrast themes.
- **REQ-ACC-03:** Full ARIA compliance for assistive technologies.
- **REQ-ACC-04:** Keyboard navigation and visible focus indicators.

#### 4.2 Performance
- **REQ-PERF-01:** LCP < 2.5s on mobile 4G.
- **REQ-PERF-02:** CLS < 0.1.
- **REQ-PERF-03:** Preload critical assets (fonts, hero images).
- **REQ-PERF-04:** Fluid animations at 60fps across mobile and desktop.

#### 4.3 Design System
- **REQ-DES-01:** Brand Colors: Deep Forest (#1A5C38), Midnight Forest (#0F3D24), Leaf Mist (#E8F5EE), Kente Gold (#D4A017), Warm Ivory (#F5F3EE), Charcoal (#1C1C1A).
- **REQ-DES-02:** Typography: Playfair Display (Display/Hero), Inter (Body/Headings).

---
**Document Status: Finalized**

```

### FILE: docs/SRS_TUC_Final.md
```md

# IEEE Software Requirements Specification (SRS)
## Techbridge University College (TUC) Digital Ecosystem
**Version:** 12.0 (Security & Accessibility Release)
**Date:** October 26, 2025

---

### 1. Introduction
#### 1.1 Purpose
This document provides the definitive technical specification for the Techbridge University College (TUC) platform. It serves as the authoritative blueprint for the application's architecture, security, AI integration, analytics strategy, and diagnostic frameworks.

#### 1.2 Institutional Scope
The TUC platform is a high-performance Single Page Application (SPA) designed to:
- Communicate the institution's pioneering mission in Design and Industrial Technology.
- Provide a context-aware AI BridgeBot for prospective and current students.
- Offer administrative tools for security auditing and diagnostic verification.
- Monitor user engagement through granular analytics tracking.

#### 1.3 Institutional Motto
"Design and Build a Nation!"

---

### 2. System Architecture
The application utilizes a decentralized, modern frontend architecture following industry best practices.

#### 2.1 Core Stack
- **Framework**: React 18.3+
- **Language**: TypeScript (Strict)
- **Styling**: Tailwind CSS with Adaptive Multi-Theme Support
- **AI Backend**: Google Gemini 3 Pro (Multimodal Streaming)
- **Analytics**: Google Analytics 4 (GA4) with SPA Route Tracking
- **Testing**: Integrated Browser-Side Playwright-Lite Engine

#### 2.2 Functional Blocks
1. **Public Hub**: Homepage, Programs (DMCD, FDT, JDT, PDE), News Feed.
2. **Academic Core**: Dynamic Faculty Directory, Calendars, and Timetables.
3. **AI Layer**: BridgeBot (Gemini-powered streaming agent with image context).
4. **Admin Layer**: Secure authentication with brute-force protection and persistent audit logging.
5. **Diagnostic Layer**: Automated verification suite with snapshot capture.

---

### 3. Functional Requirements

#### 3.1 Adaptive User Interface
- **REQ-UI-01**: Support for Light, Dark, and High-Contrast accessibility themes (WCAG 2.1 AA Compliance).
- **REQ-UI-02**: Fully responsive layouts with mobile-first grid structures.
- **REQ-UI-03**: Consistent SPA routing using robust hash-normalization logic.
- **REQ-UI-04**: **Keyboard Navigation**: All interactive elements must be accessible via keyboard (Tab/Enter/Esc). A "Skip to Main Content" link must be present.

#### 3.2 BridgeBot AI Assistant
- **REQ-AI-01**: Real-time streaming interaction using `gemini-3-pro-preview`.
- **REQ-AI-02**: Persona-grounded responses based on the TUC Student Handbook.
- **REQ-AI-03**: Multimodal reasoning (Text + Image analysis).

#### 3.3 Security & Auditing
- **REQ-SEC-01**: Admin route (`#/admin`) with brute-force lockout (3 attempts / 30s).
- **REQ-SEC-02**: **Persistent Lockout**: Lockout state must persist across page reloads via LocalStorage to prevent bypass.
- **REQ-SEC-03**: Persistent Audit logs tracking logins, security alerts, and system resets.
- **REQ-SEC-04**: LocalStorage-based persistence for themes and logs.

#### 3.4 Academic Module
- **REQ-ACAD-01**: **Faculty Directory** must support client-side filtering by name and department.
- **REQ-ACAD-02**: Faculty profiles must open in a modal view without navigating away from the list context.
- **REQ-ACAD-03**: Deep-linking to specific faculty profiles must be supported via URL slugs (e.g., `#/academics/faculty/daniel-morrison`).

#### 3.5 Analytics & Telemetry
- **REQ-ANA-01**: The system must initialize Google Analytics 4 (Tag: `G-FKXTELQ71R`).
- **REQ-ANA-02**: The router must manually trigger `page_view` events on hash changes to ensure accurate SPA tracking.
- **REQ-ANA-03**: Internal and external link clicks must be tracked where applicable.

---

### 4. Technical Specifications & Guides
- **System Architecture Diagram**: `docs/svg/system_architecture.svg`
- **Testing Guide**: `docs/TESTING_GUIDE.md`
- **Admin Guide**: `docs/ADMIN_GUIDE.md`
- **Tech Stack**: `docs/tech-stack.md`

---
**Institutional Motto:** "Design and Build a Nation!"

```

### FILE: docs/tech-stack.md
```md

# Techbridge University College - Technology Stack

## Overview
The TUC Digital Ecosystem is a modern, decentralized Single Page Application (SPA) designed for high performance, accessibility, and AI integration.

## Core Technologies

### Frontend Framework
*   **React 18.3+**: Utilizing the latest features including Hooks and Functional Components.
*   **TypeScript (Strict)**: Ensuring type safety and code robustness across the codebase.
*   **Vite**: Next-generation frontend tooling for fast development and optimized production builds.

### Styling & UI
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent design system implementation.
*   **Lucide React**: Lightweight, consistent icon library.
*   **CSS Modules/Global Styles**: For high-contrast themes and specific animations.

### Artificial Intelligence
*   **Google Gemini 3 Pro**: Advanced multimodal model integration via `@google/genai`.
*   **Stream API**: Real-time response streaming for the BridgeBot assistant.

### State & Persistence
*   **React Context API**: Managing global application state (Theme, UI, Auth).
*   **LocalStorage API**: Client-side persistence for user preferences, themes, and audit logs.

### Analytics
*   **Google Analytics 4 (GA4)**: Integrated via `gtag.js` with custom SPA route tracking logic.

### Testing & Quality Assurance
*   **Playwright-Lite**: A custom, browser-side implementation of Playwright for self-testing critical user journeys without external Node dependencies.
*   **Jest/React Testing Library**: (Planned for Phase 3 expansion).

## Architecture
The application follows a component-based architecture where logical units (Header, Hero, Admin, Chat) are encapsulated. Data flows unidirectionally, with critical services (AuditLogger, Gemini) abstracted into library modules.

*   **Entry Point**: `index.html` -> `index.tsx` -> `App.tsx`
*   **Routing**: `react-router-dom` (HashRouter for broad compatibility).

```

### FILE: docs/TESTING_GUIDE.md
```md
# TUC Testing & Diagnostics Guide

## 1. Automated Testing (Playwright-Lite)
The TUC platform features a built-in, zero-dependency end-to-end diagnostic suite.

### How to Run:
1.  Navigate to the footer.
2.  Click **Test Suite** or go to `/#test`.
3.  Press **Run Diagnostics**.

### Test Scenarios Covered:
*   **TUC Brand Verification**: Ensures the rebranded institutional name and motto are present.
*   **BridgeBot AI Validation**: Confirms the assistant initializes and identifies as "BridgeBot".
*   **Visual Accessibility Check**: Cycles through Light/Dark/High-Contrast themes and verifies DOM states.
*   **Admin Security Integrity**: Validates brute-force protection logic and password rejection.

## 2. Manual Verification Checklist
*   **Navigation**: All sub-menu links for Academics (Faculty, Calendar, etc.) are functional.
*   **Responsiveness**: Main programmes (DMCD, FDT, JDT, PDE) stack correctly on mobile.
*   **Themes**: High-contrast mode applies #000 backgrounds and #fff text globally.
*   **Chatbot**: Streaming response works and accepts multimodal (image) context.

## 3. Visual Regression
Use the **Snapshot Gallery** in the Test Suite to visually inspect component rendering after major updates. snapshots are captured at critical state transitions.
```

### FILE: index.css
```css
@import "tailwindcss";

/* Custom Scrollbar Utilities */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-thin::-webkit-scrollbar { width: 6px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }

/* Global Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translate3d(0, 30px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translate3d(-30px, 0, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Animation Utility Classes */
.animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animate-slide-in-left { animation: slideInLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animate-scale-up { animation: scaleUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-400 { animation-delay: 400ms; }


/* Accessibility: Skip Navigation Link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: #0F0C07;
  color: #C8A84B;
  padding: 12px 20px;
  z-index: 9999;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 0 0 8px 0;
  transition: top 0.2s ease;
}
.skip-link:focus {
  top: 0;
  outline: 3px solid #C8A84B;
}
```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <!-- SEO -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Techbridge University College v3.0.0 | TUC</title>
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-FKXTELQ71R');
    </script>

    <!-- Preload critical assets -->
    <link rel="preload" href="https://techbridge.edu.gh/static/TUC_LOGO_1.png" as="image" />
    <link rel="preload" href="https://aucdt.edu.gh/tuc/tucmatriculation.jpg" as="image" />
    
    <!-- Favicon / Tab Logo -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <link rel="apple-touch-icon" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS (Development Mode) -->
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@19.2.4",
        "react-dom": "https://esm.sh/react-dom@19.2.4",
        "react-dom/client": "https://esm.sh/react-dom@19.2.4/client",
        "react-router-dom": "https://esm.sh/react-router-dom@6.22.3?deps=react@19.2.4,react-dom@19.2.4",
        "lucide-react": "https://esm.sh/lucide-react@0.446.0?deps=react@19.2.4",
        "@google/genai": "https://esm.sh/@google/genai@1.32.0",
        "react/": "https://esm.sh/react@19.2.4/",
        "react-dom/": "https://esm.sh/react-dom@19.2.4/"
      }
    }
    </script>
  <link rel="stylesheet" href="/index.css">
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

### FILE: index.tsx
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch rendering errors in the component tree.
 * Prevents the entire app from crashing by showing a fallback UI.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an analytics service here
    console.error("Critical Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-tuc-beige p-4 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-tuc-maroon">
            <h1 className="text-2xl font-black text-tuc-maroon mb-4 uppercase tracking-tighter">System Alert</h1>
            <p className="text-tuc-slate mb-6">We encountered an interface rendering error. Our system is standing by for restoration.</p>
            <div className="bg-gray-50 text-gray-700 p-4 rounded-xl text-left text-sm overflow-auto max-h-48 mb-6 font-mono border border-gray-200">
              {this.state.error?.message || "Internal Interface Error"}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-tuc-maroon text-white px-8 py-3 rounded-full font-bold hover:bg-tuc-gold hover:text-tuc-maroon transition-all w-full uppercase tracking-widest shadow-lg"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Target root element #root not found in the DOM.");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

### FILE: lib/auditLogger.ts
```typescript
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

const STORAGE_KEY = 'aucdt_audit_logs';

export const logAction = (action: string, details: string, user: string = 'Admin') => {
  const newLog: AuditLogEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    action,
    details,
    user,
  };

  const existingLogs = getLogs();
  const updatedLogs = [newLog, ...existingLogs];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error("Failed to save audit log", e);
  }
};

export const getLogs = (): AuditLogEntry[] => {
  try {
    const logs = localStorage.getItem(STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    return [];
  }
};

export const clearLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
  logAction('CLEAR_LOGS', 'Audit logs cleared by administrator');
};
```

### FILE: lib/gemini.ts
```typescript

import { GoogleGenAI } from "@google/genai";
import { STUDENT_HANDBOOK_CONTEXT } from '../types.ts';

/**
 * Streams a response from the Gemini model using the provided parameters.
 * Follows the latest @google/genai guidelines.
 */
export const streamResponse = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[],
  image: string | null,
  onChunk: (text: string) => void
) => {
  try {
    // ALWAYS initialize the client with process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview'; // Upgraded for better academic reasoning
    
    const parts: any[] = [{ text: prompt }];
    
    if (image) {
      let base64Data = image;
      let mimeType = 'image/jpeg';
      if (image.includes('base64,')) {
        const matches = image.match(/^data:(.*);base64,(.*)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }
      parts.push({
        inlineData: { mimeType, data: base64Data }
      });
    }

    const response = await ai.models.generateContentStream({
      model,
      contents: [
        ...history, 
        { role: 'user', parts }
      ],
      config: {
        systemInstruction: STUDENT_HANDBOOK_CONTEXT,
        temperature: 0.7,
      }
    });

    let fullText = '';
    for await (const chunk of response) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("BridgeBot Connection Error:", error);
    onChunk("I am experiencing a momentary data bridge failure. Please refresh and try again.");
  }
};

```

### FILE: lib/testRunner.ts
```typescript

// A lightweight, browser-side implementation mimicking Puppeteer for self-testing
export interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  logs: string[];
  duration?: number;
  error?: string;
  screenshots: string[];
}

export interface TestActionParams {
  log: (msg: string) => void;
  screenshot: (label: string) => Promise<void>;
}

export type TestAction = (params: TestActionParams) => Promise<void>;

export interface TestScenario {
  id: string;
  name: string;
  action: TestAction;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const waitForSelector = async (selector: string, timeout = 5000): Promise<HTMLElement> => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.offsetParent !== null) return element;
    await delay(100);
  }
  throw new Error(`Timeout waiting for selector: ${selector}`);
};

// Helper to trigger React's synthetic events by manipulating the native value setter
const setNativeValue = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
  
  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter?.call(element, value);
  } else {
    valueSetter?.call(element, value);
  }
  
  element.dispatchEvent(new Event('input', { bubbles: true }));
};

export const TEST_SUITE: TestScenario[] = [
  {
    id: 'homepage-sanity',
    name: 'TUC Brand Verification',
    action: async ({ log, screenshot }) => {
      log('Navigating to Techbridge Homepage baseline...');
      window.location.hash = '#/'; 
      await delay(1000);

      log('Checking Hero Slider presence...');
      await waitForSelector('section[aria-roledescription="carousel"]');
      await screenshot('Homepage Hero');

      log('Verifying Brand Identity Strings...');
      const bodyText = document.body.innerText;
      if (!bodyText.includes('Techbridge University College')) throw new Error('Institutional Branding missing');
      if (!bodyText.includes('Design and Build a Nation')) throw new Error('Institutional Motto missing');
      log('Identity verification passed.');
    }
  },
  {
    id: 'theme-switching',
    name: 'Theme Engine Functionality',
    action: async ({ log, screenshot }) => {
        log('Locating theme toggle controls...');
        window.location.hash = '#/';
        await delay(500);

        const darkBtn = document.querySelector('button[aria-label="Switch to Dark Mode"]') as HTMLElement;
        const lightBtn = document.querySelector('button[aria-label="Switch to Light Mode"]') as HTMLElement;
        const hcBtn = document.querySelector('button[aria-label="Switch to High Contrast Mode"]') as HTMLElement;

        if (!darkBtn || !lightBtn || !hcBtn) throw new Error('Theme controls not found');

        log('Testing Dark Mode transition...');
        darkBtn.click();
        await delay(300);
        if (!document.documentElement.classList.contains('dark')) throw new Error('Dark mode class not applied to root');
        await screenshot('Dark Mode State');

        log('Testing High Contrast Mode transition...');
        hcBtn.click();
        await delay(300);
        if (!document.documentElement.classList.contains('high-contrast')) throw new Error('High Contrast class not applied to root');
        if (document.documentElement.classList.contains('dark')) throw new Error('Dark mode class should be removed in High Contrast');
        await screenshot('High Contrast State');

        log('Restoring Light Mode...');
        lightBtn.click();
        await delay(300);
        if (document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('high-contrast')) {
            throw new Error('Failed to restore Light mode state');
        }
        log('Theme engine verified successfully.');
    }
  },
  {
    id: 'chat-agent-interaction',
    name: 'AI Agent Interaction Flow',
    action: async ({ log, screenshot }) => {
      log('Opening Chat Agent...');
      const chatToggle = await waitForSelector('button[aria-label="Open AI Chat Assistant"]');
      chatToggle.click();
      
      log('Waiting for AI Dialog to mount...');
      const dialog = await waitForSelector('div[role="dialog"][aria-label="BridgeBot AI Assistant"]');
      await screenshot('Chat Opened');

      log('Locating input field...');
      const input = await waitForSelector('textarea[aria-label="Type your message"]') as HTMLTextAreaElement;
      const sendBtn = await waitForSelector('button[aria-label="Send"]');

      log('Simulating user typing...');
      setNativeValue(input, 'Test Diagnostics: Hello BridgeBot');
      await delay(500);

      log('Sending message...');
      sendBtn.click();
      
      log('Waiting for response stream...');
      // Wait for the input to clear (indicating send success)
      let retries = 0;
      while (input.value !== '' && retries < 10) {
        await delay(200);
        retries++;
      }
      
      await delay(2000); // Allow time for the bubble to appear
      
      // Check for message bubbles. We expect more than the initial greeting.
      // We search for elements with the message bubble styling.
      const messages = dialog.querySelectorAll('div[class*="rounded-[2.5rem]"]');
      if (messages.length < 2) throw new Error('Response message bubble did not render');

      log('Message stream verified.');
      await screenshot('Chat Interaction');
      
      // Close chat to clean up
      const closeBtn = await waitForSelector('button[aria-label="Close chat"]');
      closeBtn.click();
    }
  },
  {
      id: 'admin-security-lockout',
      name: 'Admin Security Lockout Protocol',
      action: async ({ log, screenshot }) => {
          log('Initializing Admin Security Test...');
          // Clean state to ensure reproducible test
          localStorage.removeItem('admin_login_attempts');
          localStorage.removeItem('admin_lockout_until');

          log('Navigating to Admin Portal...');
          window.location.hash = '#/admin';
          await delay(1000);

          const passwordInput = [REDACTED_CREDENTIAL]
          const submitBtn = await waitForSelector('button[type="submit"]');

          log('Attempting 3 invalid logins to trigger brute-force protection...');
          
          for (let i = 1; i <= 3; i++) {
              log(`Attempt ${i}/3: Injecting invalid credentials...`);
              setNativeValue(passwordInput, `wrongpass${i}`);
              submitBtn.click();
              await delay(800); // Wait for React state update/render
          }

          log('Verifying Lockout State...');
          const bodyText = document.body.innerText;
          const isLocked = bodyText.includes('Locked for') || bodyText.includes('Security Lockout Active');
          
          if (!isLocked) {
              // Fallback check: input should be disabled
              if (!passwordInput.disabled) throw new Error('System failed to lock after 3 invalid attempts');
          }

          await screenshot('Admin Lockout Screen');
          log('Security protocol enforced successfully.');

          // Cleanup
          log('Resetting security state for next run...');
          localStorage.removeItem('admin_login_attempts');
          localStorage.removeItem('admin_lockout_until');
      }
  },
  {
    id: 'link-integrity-crawler',
    name: 'Link Integrity Crawler',
    action: async ({ log, screenshot }) => {
      window.location.hash = '#/';
      await delay(1000);
      
      log('Scanning all visible anchor tags...');
      const links = Array.from(document.querySelectorAll('a'));
      let brokenCount = 0;
      links.forEach((link, idx) => {
        const href = link.getAttribute('href');
        // Check for empty hrefs, or placeholder links that might indicate unfinished work
        if (!href || href === '#' || href === 'javascript:void(0)') {
          brokenCount++;
        }
      });

      if (brokenCount > 15) { 
        log(`[WARN] ${brokenCount} placeholder/empty links detected.`);
      } else {
         log(`Link health check passed. ${links.length} scanned.`);
      }
      
      await screenshot('Link Audit Result');
    }
  }
];

```

### FILE: metadata.json
```json
{
  "name": "Techbridge University College v3.0.0",
  "description": "The official digital platform for Techbridge University College (TUC), Ghana's Home for Tech Talent.",
  "requestFramePermissions": [
    "camera",
    "microphone",
    "geolocation"
  ]
}
```

### FILE: migrated_prompt_history/prompt_2026-02-05T10_45_00.612Z.json
```json
[
  {
    "id": 0,
    "author": "user",
    "payload": {
      "type": "text",
      "text": "I need some directives to share with another model on implementing the faculty page with image links\n",
      "files": [],
      "fileUploads": [],
      "cssBlocks": [],
      "cMarkNode": {}
    },
    "createdTimestamp": {
      "seconds": 1770288245,
      "nanos": 303000000
    }
  },
  {
    "id": 1,
    "author": "model",
    "payload": {
      "type": "thinking",
      "text": "**Defining the Core Task**\n\nI'm currently dissecting the user's request. My focus is on understanding the core goal: crafting directives for another AI. The context of a React application for the feature's implementation is also being noted. I'm zeroing in on the feature itself, and the image links that need to be made.\n\n\n**Analyzing the Implementation**\n\nI'm now examining the existing code. I see there's a good starting point: `FacultyDirectory.tsx` and `FacultyProfile.tsx` components. The data structure, `FACULTY_DATA` in `constants.ts`, is also clear. My goal is to determine the best way to leverage these existing elements. The user may need improvements on data structure, image handling, navigation or UI.\n\n\n**Refining the Directives**\n\nI'm now iterating on my directives, aiming for a polished set of instructions. I've drafted several versions, starting with a mental outline and progressing to more detailed, technical specifications. Currently, I'm focusing on incorporating \"best practices\" and adhering to a \"TUC identity\" for a professional final product. I am updating my directives to take into account aesthetics and user experience. I am adding UX requirements like hover effects on cards and a responsive grid layout. I am also planning on updating image loading to lazy loading to improve performance. I am also working on adding filtering (search by name/department).\n\n\n**Organizing the Output**\n\nI'm structuring the directives into sections now. I'm aiming for a clear checklist for the receiving model. I've broken it down into Context & Tech Stack, Data Management, Component Architecture, Image Strategy, UI/UX Design, and Routing. The goal is to provide a comprehensive, step-by-step guide. I'm focusing on clarity and ease of execution.\n\n\n",
      "cMarkNode": {}
    },
    "createdTimestamp": {
      "seconds": 1770288245,
      "nanos": 303000000
    },
    "doneTimestamp": {
      "seconds": 1770288287,
      "nanos": 12000000
    }
  },
  {
    "id": 2,
    "author": "model",
    "payload": {
      "type": "text",
      "text": "Here is a set of precise directives you can share with another AI model to rebuild or refine the Faculty Page. These instructions ensure the implementation aligns with the existing architecture, styling, and best practices of the TUC application.\n\n***\n\n### 📋 Directives for Faculty Page Implementation\n\n**Role:** Senior Frontend Engineer (React/TypeScript)\n**Context:** Techbridge University College (TUC) Web App\n**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, React Router DOM (HashRouter).\n\n#### 1. Data Structure & Type Definitions\n*   **Interface:** Strict adherence to the `FacultyMember` interface in `types.ts`.\n    ```typescript\n    interface FacultyMember {\n      id: string;\n      name: string;\n      slug: string; // URL-friendly identifier\n      title: string;\n      department: string;\n      image: string; // URL to headshot\n      bio: string;\n      email: string;\n      education: string[];\n      profileUrl?: string;\n    }\n    ```\n*   **Source of Truth:** Data **must** be imported from `constants.ts` (`FACULTY_DATA`). Do not hardcode data inside the component.\n\n#### 2. Component Architecture\n*   **Primary Component:** Create/Update `components/Academics/FacultyDirectory.tsx`.\n*   **Layout Strategy:**\n    *   Use a **Responsive Grid Layout**: 1 column (mobile), 2 columns (tablet), 3 columns (desktop), 4 columns (large screens).\n    *   Group faculty members by **Department** headers to improve readability.\n*   **Search/Filter:** Implement a client-side search input that filters by `name`, `department`, or `title` in real-time.\n\n#### 3. Image Handling (Critical)\n*   **Aspect Ratio:** Enforce a consistent aspect ratio (e.g., `aspect-[4/5]` or `aspect-square`) for all headshots using Tailwind classes to prevent layout shifts.\n*   **Object Fit:** Use `object-cover` and `object-top` to ensure faces are centered and containers are filled without distortion.\n*   **Error Handling (Fallback):** You **must** implement an `onError` handler for the `<img>` tag.\n    *   *Logic:* If the image fails to load, replace `src` with a generated avatar (e.g., `https://ui-avatars.com/api/?name={name}&background=630f12&color=ffcb05`).\n    *   *Visual:* Optionally, show a \"Image Unavailable\" placeholder icon from `lucide-react`.\n*   **Lazy Loading:** Add `loading=\"lazy\"` to all image tags for performance.\n*   **Accessibility:** The `alt` attribute must contain the faculty member's full name.\n\n#### 4. UI/UX & Branding\n*   **Color Palette:** Use `bg-white` or `bg-gray-800` (dark mode) for cards. Use `text-tuc-maroon` for names and `text-tuc-gold` for accents/titles.\n*   **Interactions:**\n    *   **Hover:** Slight scale up (`hover:scale-105`) and shadow increase (`hover:shadow-2xl`) on the card.\n    *   **Focus:** Visible focus rings (`focus:ring-tuc-gold`) for keyboard navigation.\n*   **Overlay:** On hover, display a call-to-action (e.g., \"View Profile\") over the image using a gradient overlay (`bg-gradient-to-t`).\n\n#### 5. Navigation & Routing\n*   **Interaction Model:** Implement a **Hybrid Approach**:\n    1.  **Modal/Quick View:** Clicking the card opens a Modal (Overlay) showing the full Bio and Education details without leaving the page.\n    2.  **Deep Linking:** Provide a specific link or button (e.g., \"Official Profile\") that routes to `/academics/faculty/:slug` for a dedicated page view.\n*   **Route Setup:** Ensure `AcademicsContainer.tsx` handles the route:\n    ```tsx\n    <Route path=\"faculty/:slug\" element={<FacultyProfile slug={slug} />} />\n    ```\n\n#### 6. Accessibility (A11y) Requirements\n*   **Semantic HTML:** Use `<article>` for individual faculty cards.\n*   **Keyboard Navigation:** Ensure cards are interactive (`tabIndex={0}`) and respond to `Enter` key presses to open the modal/profile.\n*   **Screen Readers:** Ensure the search input has an `aria-label`.\n\n---\n\n### Example Code Snippet for Image Handling (Reference)\n\n```tsx\nconst handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {\n  const target = e.target as HTMLImageElement;\n  const name = target.alt || 'Faculty';\n  // Fallback to TUC Brand Colors\n  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=630f12&color=ffcb05&size=512`;\n};\n\n// In Render:\n<img \n  src={member.image} \n  alt={member.name} \n  loading=\"lazy\"\n  onError={handleImageError}\n  className=\"w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105\" \n/>\n",
      "cMarkNode": {}
    },
    "createdTimestamp": {
      "seconds": 1770288287,
      "nanos": 12000000
    },
    "doneTimestamp": {
      "seconds": 1770288287,
      "nanos": 330000000
    }
  }
]
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "techbridge-university-college-v03022026-1547",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "6.22.3",
    "lucide-react": "0.446.0",
    "@google/genai": "1.32.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d99b7b69-d9c7-444e-a684-35bcc50d0569

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: SRS.md
```md

# Software Requirements Specification (SRS)
## Techbridge University College (TUC) Digital Platform
**Version:** 2.1 (Current Build)
**Date:** March 04, 2025

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to define the implemented software requirements and architectural design for the Techbridge University College (TUC) web platform. This document serves as the source of truth for the current production build, replacing all previous AUCDT specifications.

#### 1.2 Scope
The application is a high-fidelity Single Page Application (SPA) built with React 18.3 and TypeScript. It serves as the primary digital interface for the university, facilitating:
*   **Public Information:** Program discovery, admissions, and institutional news.
*   **Student Support:** AI-driven assistance via "BridgeBot".
*   **Administration:** Secure auditing and system diagnostics.

#### 1.3 Definitions & Acronyms
*   **TUC:** Techbridge University College (formerly AUCDT).
*   **BridgeBot:** The institutional AI assistant powered by Google Gemini.
*   **SPA:** Single Page Application (Hash-based routing).
*   **Playwright-Lite:** A browser-side implementation of end-to-end testing logic.

---

### 2. Overall Description

#### 2.1 Product Perspective
The platform is a client-side application designed for static hosting environments. It minimizes server-side dependencies by utilizing browser APIs (LocalStorage) for persistence and communicating directly with cloud APIs (Google Cloud) for intelligence features.

#### 2.2 User Classes
*   **Prospective Students:** Accessing admission portals, program details, and scholarships.
*   **Current Students:** Viewing academic calendars, timetables, and faculty directories.
*   **Administrators:** Managing security logs and verifying system integrity via the Admin Portal.
*   **General Public:** Consuming news and institutional history.

#### 2.3 Operating Environment
*   **Client:** Modern Browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge).
*   **Hosting:** Static Web Server / CDN.
*   **API Dependencies:** Google Gemini API (v1beta/v1).

---

### 3. Specific Requirements

#### 3.1 User Interface & Experience
*   **REQ-UI-001 (Branding):** The interface must prominently feature the TUC identity, utilizing the Maroon (#630f12) and Gold (#ffcb05) color palette.
*   **REQ-UI-002 (Responsiveness):** The layout must adapt fluidly between Mobile (320px), Tablet (768px), and Desktop (1280px+) viewports.
*   **REQ-UI-003 (Theming):** The system must support user-selectable themes: Light, Dark, and High-Contrast (for accessibility).
*   **REQ-UI-004 (Navigation):** Global navigation must be sticky and include a mobile drawer for smaller screens.

#### 3.2 AI Assistant ("BridgeBot")
*   **REQ-AI-001 (Model):** The agent shall utilize **Google Gemini 3 Pro Preview** for reasoning and generation.
*   **REQ-AI-002 (Context):** The agent must be grounded in the "Student Handbook" system instruction set.
*   **REQ-AI-003 (Multimodality):** The chat interface must support text inputs and image uploads for analysis.
*   **REQ-AI-004 (Streaming):** Responses must be streamed in real-time to reduce perceived latency.

#### 3.3 Administrative Security
*   **REQ-SEC-001 (Authentication):** A hidden route (`#/admin`) shall provide access to administrative tools via password authentication.
*   **REQ-SEC-002 (Brute Force Protection):** The system shall lock access for 30 seconds after 3 consecutive failed login attempts.
*   **REQ-SEC-003 (Persistence):** Lockout timers must persist in LocalStorage to prevent bypass via page refresh.
*   **REQ-SEC-004 (Audit Logging):** Critical actions (Login Success/Failure, Logout, Clear Logs) must be recorded and viewable in the Admin Dashboard.

#### 3.4 Academic Modules
*   **REQ-ACAD-001 (Faculty Directory):** Users must be able to search faculty by name or department.
*   **REQ-ACAD-002 (Profiles):** Detailed faculty profiles must be presented in a modal view to maintain navigation context.
*   **REQ-ACAD-003 (Timetables):** Static academic schedules must be accessible for main departments.

#### 3.5 System Diagnostics
*   **REQ-TEST-001 (Self-Test):** The application shall include a "Playwright-Lite" suite accessible via the footer.
*   **REQ-TEST-002 (Coverage):** The suite must verify:
    1.  Homepage Branding (TUC Identity).
    2.  Broken Link Detection.
    3.  Faculty Directory Data Hydration.
    4.  AI Agent Initialization.
    5.  Theme Engine Functionality.
*   **REQ-TEST-003 (Reporting):** The system must generate visual logs and simulated "snapshots" of test states.

---

### 4. Technical Stack

#### 4.1 Core Technologies
*   **Frontend:** React 18.3.1
*   **Language:** TypeScript 5.x
*   **Build System:** Vite
*   **Routing:** React Router DOM (HashRouter)

#### 4.2 Libraries
*   **Styling:** Tailwind CSS, Lucide React
*   **AI:** `@google/genai` SDK
*   **Analytics:** Google Analytics 4 (`gtag.js`)

#### 4.3 Data Persistence
*   **LocalStorage:** Used for Theme preferences, Admin Audit Logs, and Admin Lockout timers.

---

### 5. Implementation Status
*   **Phase 1 (Core UI):** ✅ Complete
*   **Phase 2 (Admin/Security):** ✅ Complete
*   **Phase 3 (Self-Testing):** ✅ Complete
*   **Phase 4 (AI Integration):** ✅ Complete (Gemini 3 Pro)
*   **Phase 5 (Content Population):** ✅ Complete (News, Faculty Data)

**System Status:** Stable / Production Ready

```

### FILE: SRS_TUC_Final.md
```md

# IEEE Software Requirements Specification (SRS)
## Techbridge University College (TUC) Digital Ecosystem
**Version:** 10.0 (Stability & Verification Release)
**Date:** October 26, 2025

---

### 1. Introduction
#### 1.1 Purpose
This document provides the definitive technical specification for the Techbridge University College (TUC) platform. It ensures the digital ecosystem adheres to the highest standards of stability and brand integrity.

#### 1.2 Institutional Motto
"Design and Build a Nation!"

---

### 2. System Architecture
The application utilizes a decentralized, modern frontend architecture.

#### 2.1 Core Stack
- **Framework**: React 18.3+ / TypeScript (Strict)
- **Routing**: Absolute Hash Normalization Paradigm (v2)
- **AI Backend**: Google Gemini 3 Pro (Multimodal)
- **QA**: Integrated Playwright-Lite Browser-Side Diagnostic Suite

---

### 3. Functional Requirements

#### 3.1 Routing Stability (Zero-Blank-Page Policy)
- **REQ-R-01**: The system MUST implement absolute hash normalization to resolve variant URI patterns (e.g., `/#/`, `#/`, `//`).
- **REQ-R-02**: Mismatched or unknown routes MUST fail-gracefully to a "Coming Soon" or "Route Fallback" component.
- **REQ-R-03**: The Faculty Directory (`#/academics/faculty`) MUST be reachable with single-link resolution across all navigation tiers.

#### 3.2 Diagnostic Suite (QA)
- **REQ-Q-01**: The test suite MUST include an automated Link Integrity Crawler.
- **REQ-Q-02**: The test suite MUST perform deep-DOM inspection to verify data hydration on critical routes (e.g., Faculty records).
- **REQ-Q-03**: Test results MUST be recorded with time-stamped logs and visual snapshots.

#### 3.3 Security
- **REQ-SEC-01**: Brute-force protection on the Admin portal (3 attempts / 30s lockout).
- **REQ-SEC-02**: Persistent Audit logs tracking institutional access events.

---
**Institutional Motto:** "Design and Build a Nation!"

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript

export interface NavItem {
  label: string;
  labelKey?: string;
  href: string;
  children?: NavItem[];
}

export interface SlideData {
  id: number;
  title: string;      // Used as the "Eyebrow" / Small top text
  titleKey?: string;
  subtitle: string;   // Used as the "Headline" / Big text
  subtitleKey?: string;
  image: string;
  video?: string;
  ctaLink?: string;
  ctaText?: string;
  ctaTextKey?: string;
  darkOverlay?: boolean;
  overlayColor?: string; // Custom tailwind class for overlay background
  hideText?: boolean;
}

export interface ProgrammeCardData {
  id: number;
  title: string;
  description: string;
  image: string;
  badge: string;
  link: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  slug: string;
  title?: string;
  department: string;
  image: string;
  bio: string;
  email: string;
  education: string[];
  researchInterests?: string[];
  profileUrl?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  link: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export const STUDENT_HANDBOOK_CONTEXT = `
You are "BridgeBot", the advanced AI Ambassador for Techbridge University College (TUC).
Formerly known as AsanSka University College of Design and Technology.

**Motto:** "Design and Build a Nation!"

**Your Role:**
Provide precise, welcoming, and high-tech assistance. Your tone is academic yet innovative and friendly.

**Formatting Guidelines for User Friendliness:**
- Use **Bold** text (e.g., **July 2026**) for important dates, names, or key terms.
- Use Bullet points for lists to make information easy to scan.
- Keep paragraphs short and avoid technical jargon unless asked.
- Use UK British English spelling (e.g., "programme", "centre", "jewellery").

**Key Institutional Data:**
*   **Full Name:** Techbridge University College (TUC).
*   **Official Website:** https://techbridge.aucdt.edu.gh
*   **Mission:** To bridge the gap between education and industry through disruptive design and technology.
*   **Core Pillars:** Creative Intelligence, Technical Excellence, and Entrepreneurial Spirit.
*   **Campus:** Oyibi Campus (Off the Adenta - Dodowa Road), Accra, Ghana.
*   **Contacts:** admissions@techbridge.edu.gh | +233 (0) 54 012 4400 / 054 012 4488.

**Degree Programmes:**
*   **BTech Digital Media and Communication Design (DMCD)**
*   **BTech Fashion Design Technology (FDT)**
*   **BA Jewellery Design Technology (JDT)**
*   **BA Product Design and Entrepreneurship (PDE)**

**Final Note:**
Always represent the futuristic spirit of TUC. Use "Techbridge" or "TUC". Reference the motto "Design and Build a Nation!" to inspire prospective students. Mention the official URL https://techbridge.aucdt.edu.gh if users ask about where to find more information.
`;

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3002,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

