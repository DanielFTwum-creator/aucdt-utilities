
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
