import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import BookingWidget from './BookingWidget.tsx';
import { ThemeProvider, useTheme } from './ThemeContext.tsx';
import AdminDashboard from './AdminDashboard.tsx';
import { AuthGate } from './AuthGate';

// --- Types ---

interface NavItem {
  label: string;
  href: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  mediaUrl: string;
  type: 'image' | 'video';
  date: string;
  link?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string[] | string;
  details?: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  details: string;
}

// --- Data Constants ---

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Masterclass', href: '#masterclass' },
  { label: 'Contact', href: '#contact' },
];

const PROFILE_IMAGES = [
  "https://www.myjoyonline.com/wp-content/uploads/2024/11/WhatsApp-Image-2024-11-12-at-13.42.57-1-682x1024.jpeg",
  "https://media.licdn.com/dms/image/v2/D4E22AQGX-kFEid1dEw/feedshare-shrink_800/feedshare-shrink_800/0/1730999261126?e=1772668800&v=beta&t=4VY277hNMmIFqQgiaZYNIEiVEH9FRCDELXxtRE3NbQo"
];

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'The Pitch Hub',
    category: 'Entrepreneurship',
    description: 'Founded and scaled a Pan-African entrepreneurship hub empowering 500+ startups and facilitating over $5M in early-stage capital.',
    mediaUrl: 'https://thepitchhub.org/wp-content/uploads/2023/09/IMG_1250-scaled.jpg',
    type: 'image',
    date: '2017 - Present',
    link: 'https://www.thepitchhub.org'
  },
  {
    id: '2',
    title: 'SmartScale AI',
    category: 'Innovation',
    description: 'A hybrid AI training program designed for SMEs in Ghana and Nigeria to leverage artificial intelligence for business growth.',
    mediaUrl: 'https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/01/Smartscale-1-e1768903053706.jpeg',
    type: 'image',
    date: '2024',
    link: 'https://techcabal.com/2026/01/20/smartscale-in-ghana-for-ai-training/'
  },
  {
    id: '3',
    title: 'bp Innovation Factory',
    category: 'Accelerator',
    description: '3-month accelerator program sponsored by British Petroleum, empowering young African SME owners with mentorship and funding.',
    mediaUrl: 'https://i0.wp.com/thebftonline.com/wp-content/uploads/2024/08/The-Pitch-Hub-bp-launch-initiative-to-empower-African-entrepreneurs.jpg?w=624&ssl=1',
    type: 'image',
    date: '2022',
    link: 'https://www.youtube.com/watch?v=__RipcWbxgM'
  },
  {
    id: '4',
    title: 'IRB Credit Risk Framework',
    category: 'Corporate Finance',
    description: 'Global compliance project for IRB Credit Risk across 3 regions, ensuring EBA and PRA regulatory alignment at Morgan Stanley.',
    mediaUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    type: 'image',
    date: '2023',
  },
];

const EXPERIENCE_LIST: Experience[] = [
  {
    id: 'exp1',
    title: 'Firm Risk Management (COO team)',
    company: 'Morgan Stanley, London',
    period: 'Nov 2022 – Present',
    description: [
      'Global Project Lead for IRB Credit Risk regulatory project, managing 50+ stakeholders.',
      'Lead Algorithm and E-trading working groups, resolving critical audit issues via automation.',
      'Awarded 2024 Q3 Quarterly Risk Award for exceptional contributions to firm efficiency.'
    ],
  },
  {
    id: 'exp2',
    title: 'Founder',
    company: 'The Pitch Hub',
    period: 'Dec 2017 – Present',
    description: [
      'Scaled a startup ecosystem resulting in $5M+ pre-seed funding for portfolio companies.',
      'Secured partnerships with Oracle, GIZ, and British Petroleum for African business growth.',
      'Featured in national media for designing innovative business scaling training modules.'
    ],
  },
  {
    id: 'exp3',
    title: 'Business Support Manager',
    company: 'Bank of America, Dublin',
    period: 'Apr 2021 – Oct 2022',
    description: [
      'Project Manager for key governance deliverables including ICAAP and SREP.',
      'Defined annual strategy for Risk business unit and industry risk limits.',
      'Advised board on credit risk exposures during geopolitical crises.'
    ],
  },
];

const EDUCATION_LIST: Education[] = [
  {
    id: 'edu1',
    degree: 'B.Sc. Computer Science',
    institution: 'University of Ghana, Accra',
    period: '2013 - 2017',
    details: 'Most Influential Student Award. Won 1st place in Vodafone Entrepreneurship Challenge.',
  },
];

const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/aureliaattipoe/',
  github: 'https://github.com/aureliaattipoe',
  twitter: 'https://twitter.com/aureliaattipoe',
  email: 'aurelia.attipoe@gmail.com'
};

// --- Icons ---

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
);
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);
const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
);
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
      window.history.pushState(null, '', href);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-alabaster/95 backdrop-blur-xl border-b border-gray-100/50 py-4' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="font-serif text-2xl font-bold tracking-tight text-charcoal hover:text-gold transition-colors">Aurelia.</a>
        <div className="hidden md:flex space-x-12">
          {NAV_ITEMS.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted hover:text-gold transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button className="md:hidden text-charcoal" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-alabaster z-40 p-8 flex flex-col space-y-6 animate-fade-in">
          {NAV_ITEMS.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-3xl font-serif border-b border-gray-100 pb-4 text-charcoal hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-alabaster">
      <div className="fade-in-up space-y-8 max-w-4xl">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">Management Professional & Social Entrepreneur</h2>
        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight text-charcoal">Aurelia Abena<br/><span className="italic text-gold-light">Attipoe</span></h1>
        <p className="text-muted text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">Bridging the gap between global corporate governance and the rising African startup ecosystem.</p>
        <div className="pt-10 flex flex-col sm:flex-row gap-8 justify-center items-center">
          <a 
            href="#projects" 
            onClick={(e) => handleSmoothScroll(e, '#projects')}
            className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-charcoal pb-2 hover:text-gold hover:border-gold transition-all group text-charcoal"
          >
            Explore Projects <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#masterclass" 
            onClick={(e) => handleSmoothScroll(e, '#masterclass')}
            className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold border-b-2 border-gold text-gold pb-2 hover:text-charcoal hover:border-charcoal transition-all group"
          >
            Book Masterclass <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ item: PortfolioItem }> = ({ item }) => (
  <div className="group relative flex flex-col">
    <div className="overflow-hidden bg-gray-100 rounded-sm aspect-[4/3] mb-6 shadow-sm">
      <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
      {item.link && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg">
          <ExternalLinkIcon className="w-5 h-5 text-charcoal" />
        </div>
      )}
    </div>
    <div className="flex justify-between items-start mb-3">
      <span className="text-[10px] uppercase tracking-widest text-gold font-bold">{item.category}</span>
      <span className="text-[10px] text-muted font-mono">{item.date}</span>
    </div>
    <h3 className="font-serif text-3xl mb-3 text-charcoal group-hover:text-gold transition-colors">{item.title}</h3>
    <p className="text-muted text-sm font-light leading-relaxed mb-4">{item.description}</p>
    {item.link && (
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold border-b border-gray-200 pb-1 self-start hover:border-gold hover:text-gold transition-all">View Details</a>
    )}
  </div>
);

const ExperienceSection = () => (
  <section id="experience" className="py-32 bg-white">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4">
          <h2 className="font-serif text-5xl sticky top-32 text-charcoal">Career & Education</h2>
        </div>
        <div className="lg:col-span-8 space-y-16">
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted mb-10 font-bold">Professional History</h3>
            {EXPERIENCE_LIST.map((exp) => (
              <div key={exp.id} className="mb-12 border-l border-gray-100 pl-8 relative group">
                <div className="absolute w-3 h-3 bg-white border border-gold rounded-full -left-[6.5px] top-2 group-hover:bg-gold transition-colors"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h4 className="font-serif text-2xl text-charcoal">{exp.title}</h4>
                  <span className="text-[10px] text-muted font-mono tracking-widest uppercase">{exp.period}</span>
                </div>
                <p className="text-gold text-xs font-bold uppercase tracking-widest mb-4">{exp.company}</p>
                <ul className="space-y-3">
                  {(exp.description as string[]).map((point, i) => (
                    <li key={i} className="text-gray-600 font-light text-sm leading-relaxed flex gap-3">
                      <span className="text-gold opacity-50">•</span> {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted mb-10 font-bold">Education</h3>
            {EDUCATION_LIST.map((edu) => (
              <div key={edu.id} className="p-8 border border-gray-100 rounded-sm hover:border-gold/30 transition-colors">
                <h4 className="font-serif text-2xl mb-2 text-charcoal">{edu.degree}</h4>
                <p className="text-gold text-xs font-bold uppercase tracking-widest mb-4">{edu.institution}</p>
                <p className="text-gray-600 text-sm font-light leading-relaxed">{edu.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText(SOCIAL_LINKS.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <section id="contact" className="py-32 bg-alabaster border-t border-gray-100">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h2 className="font-serif text-5xl md:text-7xl mb-8 text-charcoal">Get in touch.</h2>
        <p className="text-muted font-light text-lg mb-12">Available for strategic consulting, speaking engagements, and mentorship inquiries.</p>
        
        <div className="relative inline-block group mb-16">
          <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-2xl md:text-4xl font-serif border-b border-gray-200 hover:text-gold hover:border-gold transition-all pb-2 text-charcoal">
            {SOCIAL_LINKS.email}
          </a>
          <button onClick={copyEmail} className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-charcoal transition-colors" title="Copy email">
            <CopyIcon />
          </button>
          {copied && <span className="absolute left-1/2 -bottom-10 -translate-x-1/2 text-[10px] uppercase font-bold text-gold animate-bounce">Copied!</span>}
        </div>

        <div className="flex justify-center gap-12">
          {Object.entries(SOCIAL_LINKS).filter(([k]) => k !== 'email').map(([key, url]) => (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted hover:text-charcoal transition-colors">
              {key}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProfileCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROFILE_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl bg-gray-100 group">
      {PROFILE_IMAGES.map((src, index) => (
        <img 
          key={src} 
          src={src} 
          alt={`Aurelia - Profile ${index + 1}`} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
        />
      ))}
      
      {/* Navigation Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {PROFILE_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentIndex ? 'bg-white w-6 opacity-100' : 'bg-white/50 w-2 hover:bg-white/80'}`}
            aria-label={`View image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const PortfolioView = () => (
  <div className="selection:bg-gold selection:text-white bg-alabaster">
    <Navbar />
    <Hero />
    <section id="about" className="py-32 bg-white border-y border-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <ProfileCarousel />
          <div className="space-y-8">
            <h2 className="font-serif text-5xl leading-tight text-charcoal">Corporate Expert.<br/>Entrepreneurial <span className="italic text-gold">Catalyst</span>.</h2>
            <p className="text-muted font-light text-lg leading-loose">Based in London and Accra, I bring a decade of experience in financial risk management at institutions like Morgan Stanley and Bank of America, coupled with a deep-rooted commitment to scaling African startups through The Pitch Hub.</p>
            <p className="text-muted font-light text-lg leading-loose">My unique position allows me to apply rigorous institutional frameworks to early-stage ventures, ensuring sustainable growth and investment readiness for the continent's most promising entrepreneurs.</p>
            <div className="flex flex-wrap gap-4 pt-4">
              {['FinTech', 'Risk Strategy', 'Business Scaling', 'AI Governance'].map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-widest border border-gray-200 px-4 py-2 rounded-full text-muted font-bold hover:border-gold hover:text-gold transition-colors cursor-default">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
    <ExperienceSection />
    <section id="projects" className="py-32 bg-alabaster">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-20">
          <h2 className="font-serif text-5xl text-charcoal">Selected Initiatives</h2>
          <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Total: {PORTFOLIO_ITEMS.length}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {PORTFOLIO_ITEMS.map(item => <ProjectCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>

    {/* --- NEW SECTION: WORK WITH AURELIA --- */}
    <section id="masterclass" className="py-32 bg-charcoal text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-5xl md:text-6xl text-white">Work With Aurelia</h2>
          <p className="text-white/60 font-light text-lg max-w-2xl mx-auto">
            Executive communication, career acceleration, and AI strategy, delivered through private coaching and curated masterclasses.
          </p>
        </div>
        
        {/* Widget Container */}
        <div className="mx-auto max-w-5xl">
          <BookingWidget />
        </div>
      </div>
    </section>

    <Contact />
    <footer className="py-12 border-t border-gray-200 bg-alabaster text-center">
      <p className="text-[10px] uppercase tracking-widest text-muted font-bold">© {new Date().getFullYear()} Aurelia Abena Attipoe. Design for Excellence.</p>
    </footer>
  </div>
);

const App = () => {
  const { theme } = useTheme();
  const [route, setRoute] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className={theme === 'high-contrast' ? 'high-contrast' : ''}>
      {route.startsWith('#admin') ? <AdminDashboard /> : <PortfolioView />}
    </div>
  );
};

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Changed to relative path './sw.js' to prevent origin mismatch errors in preview environments
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        // Suppress generic registration errors in preview console to avoid confusion
        console.warn('SW registration skipped (common in preview environments):', registrationError);
      });
  });
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);