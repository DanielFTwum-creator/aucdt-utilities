
import React, { useState, useMemo, useEffect } from 'react';
import { Search, GraduationCap, Mail, ChevronRight, X, Info, User } from 'lucide-react';
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

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 font-sans animate-fade-in-up">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-left">
        <div className="max-w-2xl">
          <span className="text-tuc-gold font-black uppercase tracking-[0.3em] text-xs">Academic Leadership</span>
          <h2 className="text-4xl md:text-6xl font-black text-tuc-maroon dark:text-white mt-4 uppercase tracking-tighter">Faculty Directory</h2>
          <p className="mt-4 text-tuc-slate dark:text-gray-400 font-medium">Meet the industry-leading scholars and practitioners shaping the future of design and technology in Ghana.</p>
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
              <h3 className="text-2xl font-black text-tuc-maroon dark:text-tuc-gold uppercase tracking-tighter whitespace-nowrap">{dept}</h3>
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
                  >
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isExpanded ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-tuc-maroon/80 via-tuc-maroon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <div 
                          onClick={(e) => openProfileModal(e, member)}
                          className="bg-tuc-gold text-tuc-maroon w-full py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform hover:bg-white transition-colors"
                        >
                          View Full Academic Profile <ChevronRight size={14} />
                        </div>
                      </div>
                    </div>

                    <div className="p-7 flex-1 flex flex-col text-left">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-lg font-black uppercase tracking-tighter leading-tight flex-1 pr-2 transition-colors ${isExpanded ? 'text-tuc-maroon dark:text-tuc-gold' : 'text-tuc-maroon dark:text-white group-hover:text-tuc-gold'}`}>{member.name}</h4>
                        <div 
                          className={`p-1.5 rounded-full transition-all hover:scale-110 ${isExpanded ? 'bg-tuc-gold text-tuc-maroon' : 'bg-gray-50 dark:bg-gray-700 text-gray-400'}`}
                        >
                          <Info size={14} />
                        </div>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{member.title || 'Faculty Member'}</p>
                      
                      {/* Expansion Slot for Brief Bio */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-3 border-l-2 border-tuc-gold py-2 mb-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-r-xl">
                          <p className="text-xs text-tuc-slate dark:text-gray-400 leading-relaxed italic font-medium">
                            {member.bio}
                          </p>
                          <button 
                            onClick={(e) => openProfileModal(e, member)}
                            className="mt-4 text-[10px] font-black text-tuc-maroon dark:text-tuc-gold uppercase tracking-widest hover:underline flex items-center gap-1"
                          >
                            Read Full Academic Bio <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[9px] font-black text-tuc-slate dark:text-gray-400 uppercase tracking-widest">
                          <GraduationCap size={14} className="text-tuc-gold" /> Academic Faculty
                        </div>
                        <a 
                          href={`mailto:${member.email}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-400 hover:text-tuc-maroon dark:hover:text-tuc-gold transition-colors"
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
           <button onClick={() => setSearchTerm('')} className="mt-4 text-tuc-maroon dark:text-tuc-gold font-black uppercase text-xs tracking-widest hover:underline">Clear Search</button>
        </div>
      )}

      {/* Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-tuc-maroon/60 backdrop-blur-md" onClick={() => setSelectedMember(null)}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl animate-fade-in-up border border-white/10">
            <button 
              onClick={() => setSelectedMember(null)} 
              className="absolute top-8 right-8 z-20 p-3 bg-white dark:bg-gray-800 text-gray-500 hover:text-tuc-maroon transition-colors rounded-full shadow-lg"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col lg:flex-row min-h-full">
              <div className="lg:w-2/5 h-[400px] lg:h-auto relative">
                <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-tuc-maroon/80 via-transparent to-transparent"></div>
              </div>
              <div className="lg:w-3/5 p-8 lg:p-16 text-left flex flex-col">
                <div className="mb-12">
                  <span className="text-tuc-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">{selectedMember.department}</span>
                  <h3 className="text-4xl lg:text-6xl font-black text-tuc-maroon dark:text-white mb-2 uppercase tracking-tighter leading-none">{selectedMember.name}</h3>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{selectedMember.title || 'Faculty Member'}</p>
                </div>
                <div className="space-y-12">
                  <section>
                    <h4 className="text-[10px] font-black text-tuc-maroon dark:text-tuc-gold uppercase tracking-[0.3em] mb-4 border-b pb-2">Institutional Biography</h4>
                    <p className="text-tuc-slate dark:text-gray-300 leading-relaxed font-medium">{selectedMember.bio}</p>
                  </section>
                  <section>
                    <h4 className="text-[10px] font-black text-tuc-maroon dark:text-tuc-gold uppercase tracking-[0.3em] mb-6 border-b pb-2">Academic Credentials</h4>
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
                  <a href={`mailto:${selectedMember.email}`} className="flex-1 bg-tuc-maroon text-white text-center py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-maroon transition-all">Send Inquiry</a>
                  <button onClick={() => setSelectedMember(null)} className="flex-1 border-2 border-tuc-maroon text-tuc-maroon py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all dark:text-white dark:border-gray-700">Close Profile</button>
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
