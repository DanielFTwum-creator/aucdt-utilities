import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { departments, students, Student } from './data';
import { Search, ChevronDown, ChevronRight, Plus, X, ArrowUpDown, ArrowUp, ArrowDown, Shield, Globe, Sun, Moon, Eye, MessageCircle } from 'lucide-react';
import { useAudit } from './AuditContext';
import { useTheme } from './ThemeContext';
import Admin from './Admin';

function Dashboard() {
  const [studentsList, setStudentsList] = useState<Student[]>(students);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student, direction: 'asc' | 'desc' } | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '', id: '', nationality: '', programme: '', level: '', sem: '', type: 'Degree', department: 'FDT'
  });
  const { logAction } = useAudit();
  const { theme, setTheme } = useTheme();

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.name && newStudent.id) {
      setStudentsList([...studentsList, newStudent as Student]);
      logAction('Student Registered', `Registered ${newStudent.name} (${newStudent.id}) in ${newStudent.department}`, 'System');
      setIsModalOpen(false);
      setNewStudent({ name: '', id: '', nationality: '', programme: '', level: '', sem: '', type: 'Degree', department: 'FDT' });
    }
  };

  const filteredStudents = studentsList.filter(s => {
    const matchesDept = selectedDept ? s.department === selectedDept : true;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm);
    const matchesType = selectedTypes.length > 0 ? selectedTypes.includes(s.type) : true;
    return matchesDept && matchesSearch && matchesType;
  });

  const sortedStudents = React.useMemo(() => {
    let sortableStudents = [...filteredStudents];
    if (sortConfig !== null) {
      sortableStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [filteredStudents, sortConfig]);

  const requestSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Student) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 ml-1 inline-block text-slate-300" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="w-3 h-3 ml-1 inline-block text-black" />;
    }
    return <ArrowDown className="w-3 h-3 ml-1 inline-block text-black" />;
  };

  const levelCounts = studentsList.reduce((acc, student) => {
    const level = student.level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedLevels = Object.keys(levelCounts).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    if (!isNaN(numA)) return -1;
    if (!isNaN(numB)) return 1;
    return a.localeCompare(b);
  });

  const totalStudents = 129;
  const totalDegree = 80;
  const totalDiploma = 5;
  const totalCert = 33;
  const graduatingCert = 11;

  const computedDepartments = departments.map(dept => {
    const deptStudents = studentsList.filter(s => s.department === dept.short);
    return {
      ...dept,
      students: deptStudents.length,
      degree: deptStudents.filter(s => s.type === 'Degree').length,
      diploma: deptStudents.filter(s => s.type === 'Diploma').length,
      cert: deptStudents.filter(s => s.type === 'Certificate').length,
    };
  });

  return (
    <div className="min-h-screen bg-theme-bg text-theme-fg font-sans transition-colors duration-200">
      {/* Header / Masthead */}
      <header className="bg-theme-bg border-b border-theme-border py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          {/* Left: Logo & Titles */}
          <div className="flex items-center gap-6">
            <img 
              src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
              alt="Techbridge University College Logo" 
              className="h-16 md:h-20 object-contain bg-white p-1 rounded-full"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-[#7A1B1E] font-sans">
                  Techbridge
                </h1>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-[#B48600] font-sans">
                  University College
                </h1>
              </div>
              <p className="text-[#7A1B1E] italic font-serif text-sm md:text-base mt-1">
                Formerly AsanSka University College of Design and Technology
              </p>
            </div>
          </div>

          {/* Right: Utilities & CTA */}
          <div className="flex items-center gap-6 flex-wrap xl:flex-nowrap">
            {/* Icons */}
            <div className="flex items-center gap-4 text-theme-fg">
              <button aria-label="Search" title="Search Registry" className="hover:text-theme-muted-fg transition-colors">
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>
              
              <button aria-label="Language" title="Change Language" className="flex items-center gap-1 hover:text-theme-muted-fg transition-colors font-bold text-sm">
                <Globe className="w-5 h-5" strokeWidth={2} />
                EN
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* Theme Toggle */}
              <div className="flex items-center bg-theme-muted rounded-full p-1 border border-theme-border">
                <button 
                  aria-label="Light Theme" 
                  title="Light Mode"
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-theme-bg shadow-sm text-theme-fg' : 'text-theme-muted-fg hover:text-theme-fg'}`}
                >
                  <Sun className="w-4 h-4" strokeWidth={2} />
                </button>
                <button 
                  aria-label="Dark Theme" 
                  title="Dark Mode"
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-theme-bg shadow-sm text-theme-fg' : 'text-theme-muted-fg hover:text-theme-fg'}`}
                >
                  <Moon className="w-4 h-4" strokeWidth={2} />
                </button>
                <button 
                  aria-label="High Contrast Theme" 
                  title="High Contrast Mode"
                  onClick={() => setTheme('hc')}
                  className={`p-1.5 rounded-full transition-colors ${theme === 'hc' ? 'bg-theme-bg shadow-sm text-theme-fg' : 'text-theme-muted-fg hover:text-theme-fg'}`}
                >
                  <Eye className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              <button aria-label="Chat" title="Support Chat" className="hover:text-theme-muted-fg transition-colors">
                <MessageCircle className="w-5 h-5" strokeWidth={2} />
              </button>

              <Link to="/admin" aria-label="Admin Portal" title="Administrator Portal" className="hover:text-theme-muted-fg transition-colors">
                <Shield className="w-5 h-5" strokeWidth={2} />
              </Link>
            </div>

            {/* CTA Button */}
            <button className="bg-[#7A1B1E] hover:bg-[#5a1416] text-white text-xs md:text-sm font-bold uppercase tracking-widest py-3 px-6 rounded-full transition-colors shadow-sm whitespace-nowrap">
              July 2026 Admissions Open
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 space-y-16">
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-theme-border pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-theme-muted-fg mb-2">Academic Year 2026</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight uppercase">Student Population Register</h2>
          </div>
        </div>

        {/* Summary Cards - Editorial Style */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border-y-2 border-theme-border">
          <div className="bg-theme-bg p-8 border-r border-b md:border-b-0 border-theme-border flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-serif font-black mb-2 leading-none">{totalStudents}</span>
            <span className="text-xs uppercase tracking-widest text-theme-muted-fg font-bold">Total Students</span>
          </div>
          <div className="bg-theme-bg p-8 border-r-0 md:border-r border-b md:border-b-0 border-theme-border flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-serif font-black mb-2 leading-none">{totalDegree}</span>
            <span className="text-xs uppercase tracking-widest text-theme-muted-fg font-bold">Degree</span>
          </div>
          <div className="bg-theme-bg p-8 border-r border-b md:border-b-0 border-theme-border flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-serif font-black mb-2 leading-none">{totalDiploma}</span>
            <span className="text-xs uppercase tracking-widest text-theme-muted-fg font-bold">Diploma</span>
          </div>
          <div className="bg-theme-bg p-8 border-r border-theme-border flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-serif font-black mb-2 leading-none">{totalCert}</span>
            <span className="text-xs uppercase tracking-widest text-theme-muted-fg font-bold">Certificate</span>
          </div>
          <div className="bg-theme-muted p-8 flex flex-col items-center justify-center text-center">
            <span className="text-6xl font-serif font-black mb-2 leading-none text-[#7A1B1E]">{graduatingCert}</span>
            <span className="text-xs uppercase tracking-widest text-[#7A1B1E] font-bold">Graduating Cert.</span>
          </div>
        </div>

        {/* Department Breakdown */}
        <div>
          <h3 className="text-2xl font-serif font-bold border-b-2 border-theme-border pb-2 mb-6 uppercase tracking-wide">Departmental Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Departmental Breakdown">
              <thead>
                <tr className="border-b-2 border-theme-border">
                  <th className="py-3 pr-4 font-serif font-bold text-sm uppercase tracking-wider">Department</th>
                  <th className="py-3 px-4 font-serif font-bold text-sm uppercase tracking-wider text-theme-muted-fg">Short</th>
                  <th className="py-3 px-4 font-serif font-bold text-sm uppercase tracking-wider text-right">Students</th>
                  <th className="py-3 px-4 font-serif font-bold text-sm uppercase tracking-wider text-right">Degree</th>
                  <th className="py-3 px-4 font-serif font-bold text-sm uppercase tracking-wider text-right">Diploma</th>
                  <th className="py-3 pl-4 font-serif font-bold text-sm uppercase tracking-wider text-right">Cert.</th>
                </tr>
              </thead>
              <tbody>
                {computedDepartments.map((dept, idx) => (
                  <tr 
                    key={dept.short} 
                    className={`border-b border-theme-border hover:bg-theme-muted cursor-pointer transition-colors ${selectedDept === dept.short ? 'bg-theme-muted' : ''}`}
                    onClick={() => setSelectedDept(selectedDept === dept.short ? null : dept.short)}
                    aria-pressed={selectedDept === dept.short}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedDept(selectedDept === dept.short ? null : dept.short); }}
                  >
                    <td className="py-4 pr-4 text-base font-serif">{dept.name}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold tracking-widest text-theme-muted-fg uppercase">{dept.short}</span>
                    </td>
                    <td className="py-4 px-4 text-base text-right font-semibold">{dept.students}</td>
                    <td className="py-4 px-4 text-base text-right text-theme-muted-fg">{dept.degree}</td>
                    <td className="py-4 px-4 text-base text-right text-theme-muted-fg">{dept.diploma}</td>
                    <td className="py-4 pl-4 text-base text-right text-theme-muted-fg">{dept.cert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Level Breakdown */}
        <div>
          <h3 className="text-2xl font-serif font-bold border-b-2 border-theme-border pb-2 mb-6 uppercase tracking-wide">Population by Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-theme-border border-2 border-theme-border">
            {sortedLevels.map(level => (
              <div key={level} className="bg-theme-bg p-6 text-center flex flex-col justify-center">
                <div className="text-[10px] uppercase tracking-widest text-theme-muted-fg font-bold mb-2">Level {level}</div>
                <div className="text-4xl font-serif font-black">{levelCounts[level]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Student List */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b-2 border-theme-border pb-4 mb-8 gap-6">
            <div>
              <h3 className="text-3xl font-serif font-black uppercase tracking-tight mb-1">
                {selectedDept ? `${computedDepartments.find(d => d.short === selectedDept)?.name} Directory` : 'Complete Directory'}
              </h3>
              <p className="text-sm font-serif italic text-theme-muted-fg">
                Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'record' : 'records'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 items-center w-full lg:w-auto">
              <div className="relative flex items-center border-b border-theme-border pb-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-theme-muted-fg mr-2" />
                <input 
                  type="text" 
                  placeholder="Search name or ID..." 
                  className="bg-transparent text-sm focus:outline-none w-full sm:w-48 font-sans text-theme-fg placeholder-theme-muted-fg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search students"
                />
              </div>
              
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                {['Degree', 'Diploma', 'Certificate'].map(type => {
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedTypes(prev => 
                          isSelected ? prev.filter(t => t !== type) : [...prev, type]
                        );
                      }}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-full transition-all duration-200 ${
                        isSelected 
                          ? 'bg-theme-fg text-theme-bg border-theme-fg shadow-sm' 
                          : 'bg-transparent text-theme-muted-fg border-theme-border hover:border-theme-fg hover:text-theme-fg'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
                {selectedTypes.length > 0 && (
                  <button 
                    onClick={() => setSelectedTypes([])}
                    className="text-[10px] font-bold uppercase tracking-widest text-theme-muted-fg hover:text-theme-fg ml-1 underline underline-offset-2"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-theme-fg text-theme-bg px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity w-full sm:w-auto whitespace-nowrap"
                aria-label="Register Student"
              >
                <Plus className="w-4 h-4" />
                Register
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Student Directory">
              <thead>
                <tr className="border-b-2 border-theme-border">
                  <th className="py-3 pr-4 font-sans font-bold text-[10px] uppercase tracking-widest text-theme-fg opacity-80 w-8"></th>
                  <th 
                    className="py-3 px-4 font-sans font-bold text-[10px] uppercase tracking-widest text-theme-fg opacity-80 cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={() => requestSort('id')}
                    aria-sort={sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className="flex items-center gap-1">ID {getSortIcon('id')}</div>
                  </th>
                  <th 
                    className="py-3 pr-4 font-sans font-bold text-[10px] uppercase tracking-widest text-theme-fg opacity-80 cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={() => requestSort('name')}
                    aria-sort={sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className="flex items-center gap-1">Student Name {getSortIcon('name')}</div>
                  </th>
                  <th 
                    className="py-3 px-4 font-sans font-bold text-[10px] uppercase tracking-widest text-theme-fg opacity-80 cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={() => requestSort('department')}
                    aria-sort={sortConfig?.key === 'department' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <div className="flex items-center gap-1">Department {getSortIcon('department')}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.length > 0 ? (
                  sortedStudents.map((student, idx) => (
                    <React.Fragment key={`${student.id}-${idx}`}>
                      <tr 
                        className={`border-b border-theme-border hover:bg-theme-muted transition-colors cursor-pointer ${expandedStudentId === student.id ? 'bg-theme-muted' : ''}`}
                        onClick={() => setExpandedStudentId(expandedStudentId === student.id ? null : student.id)}
                        aria-expanded={expandedStudentId === student.id}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedStudentId(expandedStudentId === student.id ? null : student.id); }}
                      >
                        <td className="py-3 pr-4 text-theme-muted-fg">
                          {expandedStudentId === student.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="py-3 px-4 text-sm text-theme-muted-fg font-mono">{student.id}</td>
                        <td className="py-3 pr-4 text-sm font-medium">{student.name}</td>
                        <td className="py-3 px-4 text-sm font-bold tracking-widest uppercase text-theme-muted-fg">{student.department}</td>
                      </tr>
                      {expandedStudentId === student.id && (
                        <tr className="bg-theme-muted border-b border-theme-border">
                          <td colSpan={4} className="p-0">
                            <div className="px-12 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 border-l-4 border-theme-border ml-4 my-4 bg-theme-bg shadow-sm">
                              <div>
                                <div className="text-[10px] uppercase tracking-widest text-theme-muted-fg font-bold mb-1">Nationality</div>
                                <div className="text-sm font-medium">{student.nationality}</div>
                              </div>
                              <div className="lg:col-span-2">
                                <div className="text-[10px] uppercase tracking-widest text-theme-muted-fg font-bold mb-1">Programme</div>
                                <div className="text-sm font-serif italic">{student.programme}</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-widest text-theme-muted-fg font-bold mb-1">Level & Sem</div>
                                <div className="text-sm font-medium">Lvl {student.level} · Sem {student.sem}</div>
                              </div>
                              <div>
                                <div className="text-[10px] uppercase tracking-widest text-theme-muted-fg font-bold mb-1">Type</div>
                                <div className="text-sm font-bold tracking-widest uppercase text-theme-muted-fg">{student.type}</div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-theme-muted-fg font-serif italic">
                      No records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="bg-theme-bg w-full max-w-2xl border-4 border-theme-border shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-theme-border p-6 bg-theme-muted">
              <h2 id="modal-title" className="text-2xl font-serif font-bold uppercase tracking-wide">Register New Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-theme-muted-fg hover:text-theme-fg transition-colors" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveStudent} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Full Name</label>
                  <input id="name" required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-serif text-lg bg-transparent" placeholder="e.g. Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="id" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Student ID</label>
                  <input id="id" required type="text" value={newStudent.id} onChange={e => setNewStudent({...newStudent, id: e.target.value})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-mono text-lg bg-transparent" placeholder="e.g. TUC12345" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="nationality" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Nationality</label>
                  <input id="nationality" required type="text" value={newStudent.nationality} onChange={e => setNewStudent({...newStudent, nationality: e.target.value})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-sans bg-transparent" placeholder="e.g. Ghanaian" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="programme" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Programme</label>
                  <input id="programme" required type="text" value={newStudent.programme} onChange={e => setNewStudent({...newStudent, programme: e.target.value})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-serif italic bg-transparent" placeholder="e.g. BSc Fashion Design" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="level" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Level</label>
                  <input id="level" required type="text" value={newStudent.level} onChange={e => setNewStudent({...newStudent, level: e.target.value})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-sans bg-transparent" placeholder="e.g. 100" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="sem" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Semester</label>
                  <input id="sem" required type="text" value={newStudent.sem} onChange={e => setNewStudent({...newStudent, sem: e.target.value})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-sans bg-transparent" placeholder="e.g. 1" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Type</label>
                  <select id="type" required value={newStudent.type} onChange={e => setNewStudent({...newStudent, type: e.target.value as any})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-sans bg-transparent cursor-pointer">
                    <option value="Degree" className="text-black">Degree</option>
                    <option value="Diploma" className="text-black">Diploma</option>
                    <option value="Certificate" className="text-black">Certificate</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="block text-xs font-bold uppercase tracking-widest text-theme-muted-fg">Department</label>
                  <select id="department" required value={newStudent.department} onChange={e => setNewStudent({...newStudent, department: e.target.value})} className="w-full border-b-2 border-theme-border focus:border-theme-fg focus:outline-none py-2 font-sans bg-transparent cursor-pointer">
                    {departments.map(d => (
                      <option key={d.short} value={d.short} className="text-black">{d.name} ({d.short})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-4 border-t-2 border-theme-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-bold uppercase tracking-widest text-theme-muted-fg hover:text-theme-fg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-theme-accent text-theme-accent-fg px-8 py-2 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}
