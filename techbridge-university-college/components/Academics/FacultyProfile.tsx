
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
      <a href="#/academics/faculty" className="text-tuc-maroon underline">Back to Directory</a>
    </div>
  );

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 font-sans">
      <div className="mb-12">
        <a href="#/academics/faculty" className="inline-flex items-center gap-2 text-gray-400 hover:text-tuc-maroon font-black text-[10px] uppercase tracking-widest transition-colors">
          <ArrowLeft size={16} /> Back to Directory
        </a>
      </div>
      <div className="flex flex-col lg:flex-row gap-16 text-left">
        <div className="lg:w-1/3">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
            <img src={member.image} alt={member.name} className="w-full h-auto" />
          </div>
          <div className="mt-10">
            <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-4 bg-tuc-maroon text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-maroon transition-all shadow-xl">
              <Mail size={18} /> Contact Scholar
            </a>
          </div>
        </div>
        <div className="lg:w-2/3">
          <span className="text-tuc-gold text-[10px] font-black uppercase tracking-[0.3em]">{member.department}</span>
          <h1 className="text-5xl md:text-7xl font-black text-tuc-maroon dark:text-white mt-6 mb-4 tracking-tighter uppercase">{member.name}</h1>
          <p className="text-tuc-gold text-lg font-black uppercase tracking-widest mb-12">{member.title || 'Faculty Member'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Biography</h3>
              <p className="text-tuc-slate dark:text-gray-300 leading-relaxed font-medium">{member.bio}</p>
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
