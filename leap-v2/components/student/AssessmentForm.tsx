import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import type { AppContextType, Ratings, Recommendation } from '../../types';
import { EVALUATION_CRITERIA_CONFIG } from '../../constants';

// Icons
const ChevronDownIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const MailIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const MapPinIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

export const AssessmentForm: React.FC = () => {
    const { theme, curriculum, handleAssessmentSubmit } = useContext(AppContext) as AppContextType;
    
    const [programmeId, setProgrammeId] = useState<string>('');
    const [courseId, setCourseId] = useState<string>('');
    const [lecturerId, setLecturerId] = useState<string>('');
    const [semester, setSemester] = useState<number>(1);
    const [ratings, setRatings] = useState<Ratings>({});
    const [comment, setComment] = useState('');
    const [recommend, setRecommend] = useState<Recommendation>('Neutral');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        "Lecturer's Delivery & Knowledge": true,
        'Course Content & Structure': false,
        'Assessment & Feedback': false,
    });

    const availableCourses = useMemo(() => {
        if (!programmeId) return [];
        return curriculum.courses.filter(c => c.programmeId === programmeId);
    }, [programmeId, curriculum.courses]);

    const availableLecturers = useMemo(() => {
        if (!courseId) return [];
        const course = curriculum.courses.find(c => c.id === courseId && c.programmeId === programmeId);
        if (!course) return [];
        return curriculum.lecturers.filter(l => course.lecturerIds.includes(l.id));
    }, [courseId, programmeId, curriculum.courses, curriculum.lecturers]);
    
    useEffect(() => {
        if (availableLecturers.length === 1) {
            setLecturerId(availableLecturers[0].id);
        }
    }, [availableLecturers]);

    const handleRatingChange = (criterionId: string, value: number) => {
        setRatings(prev => ({ ...prev, [criterionId]: value }));
    };

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!programmeId) newErrors.programmeId = 'Please select a programme.';
        if (!courseId) newErrors.courseId = 'Please select a course.';
        if (!lecturerId) newErrors.lecturerId = 'Please select a lecturer.';
        const totalCriteria = Object.values(EVALUATION_CRITERIA_CONFIG).flat().length;
        if (Object.keys(ratings).length < totalCriteria) {
            newErrors.ratings = 'Please rate all criteria before submitting.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setSubmissionStatus('submitting');
        setTimeout(() => {
            try {
                handleAssessmentSubmit({
                    programmeId,
                    lecturerId, 
                    courseId, 
                    semester,
                    ratings, 
                    comment,
                    recommend
                });
                setSubmissionStatus('success');
                setProgrammeId(''); setCourseId(''); setLecturerId(''); setRatings({}); setComment('');
            } catch (err) {
                setSubmissionStatus('error');
            }
        }, 1000);
    };
    
    const RatingButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400 mb-1 text-center">{label}</span>
          <button type="button" onClick={onClick} className={`w-10 h-10 rounded-full transition-all duration-300 ${active ? 'bg-amber-500 shadow-lg shadow-amber-500/50 scale-110' : 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600'}`} />
        </div>
    );

    const RATING_SCALE = [
        { label: "Strongly Disagree", value: 1 },
        { label: "Disagree", value: 2 },
        { label: "Not Sure", value: 3 },
        { label: "Agree", value: 4 },
        { label: "Strongly Agree", value: 5 },
    ];

    const QuestionRow: React.FC<{ question: { id: string; label: string } }> = ({ question }) => (
        <div className="group py-4 border-b border-gray-700/30 last:border-0 hover:bg-gray-800/20 transition-colors px-4 -mx-4 rounded-lg">
          <p className="text-gray-300 mb-4 text-sm leading-relaxed">{question.label}</p>
          <div className="flex justify-center sm:justify-end gap-2 sm:gap-4">
            {RATING_SCALE.map(({ label, value }) => (
                <RatingButton key={value} label={label} active={ratings[question.id] === value} onClick={() => handleRatingChange(question.id, value)} />
            ))}
          </div>
        </div>
    );

    const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => {
      const sectionId = `section-content-${title.replace(/\s+/g, '-')}`;
      const isExpanded = expandedSections[title];
      return (
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-amber-500/30">
          <button 
            type="button" 
            onClick={() => toggleSection(title)} 
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent hover:from-amber-500/20 transition-all"
            aria-expanded={isExpanded}
            aria-controls={sectionId}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-amber-400 font-bold">{icon}</span>
              </div>
              <h3 className="text-white font-semibold">{title}</h3>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded && <div id={sectionId} className="px-6 py-5 space-y-2 animate-fade-in">{children}</div>}
        </div>
      )
    };
    
    if (submissionStatus === 'success') {
        return (
             <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-red-950/30 to-gray-900 text-white p-6">
                <div className="text-center p-8 bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-lg animate-fade-in border border-gray-700/50">
                    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p className="text-gray-300 mb-6">Your feedback has been submitted successfully.</p>
                    <button onClick={() => setSubmissionStatus('idle')} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105">Submit Another</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-[calc(100vh-80px)] ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-red-950/30 to-gray-900 text-white' : 'bg-gray-100'}`}>
            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-3xl blur-3xl" />
                            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/50">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Shape Your Education.</h2>
                                <h3 className="text-2xl font-semibold text-amber-400 mb-6">Lecturer & Course Evaluation</h3>
                                <p className="text-gray-300 leading-relaxed mb-8">Your anonymous feedback is essential for fostering academic excellence. By sharing your thoughtful and constructive insights, you directly contribute to the quality of teaching, course development, and the overall learning experience at Asanska University College of Design and Technology.</p>
                                <div className="space-y-3 pt-6 border-t border-gray-700/50">
                                    <div className="flex items-center gap-3 text-gray-300"><MailIcon className="w-5 h-5 text-amber-400" /><span className="text-sm">qa@aucdt.edu.gh</span></div>
                                    <div className="flex items-center gap-3 text-gray-300"><MapPinIcon className="w-5 h-5 text-amber-400" /><span className="text-sm">P. O. Box VV 179, Oyibi - Accra</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Programme</label>
                                    <div className="relative">
                                        <select value={programmeId} onChange={e => { setProgrammeId(e.target.value); setCourseId(''); setLecturerId(''); }} className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer hover:border-amber-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                                            <option value="">Select a Programme</option>
                                            {curriculum.programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                     {errors.programmeId && <p className="text-red-400 text-sm mt-1">{errors.programmeId}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
                                    <div className="relative">
                                        <select value={courseId} onChange={e => { setCourseId(e.target.value); setLecturerId(''); }} disabled={!programmeId} className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer hover:border-amber-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <option value="">Select a Course</option>
                                            {availableCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.courseId && <p className="text-red-400 text-sm mt-1">{errors.courseId}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Lecturer</label>
                                    <div className="relative">
                                        <select value={lecturerId} onChange={e => setLecturerId(e.target.value)} disabled={!courseId} className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer hover:border-amber-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                            <option value="">Select a Lecturer</option>
                                            {availableLecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                     {errors.lecturerId && <p className="text-red-400 text-sm mt-1">{errors.lecturerId}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                                    <div className="relative">
                                        <select value={semester} onChange={e => setSemester(Number(e.target.value))} className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer hover:border-amber-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">Feedback Questions</h2>
                            {Object.entries(EVALUATION_CRITERIA_CONFIG).map(([sectionTitle, criteria], index) => (
                                <Section key={sectionTitle} title={sectionTitle} icon={`${index + 1}`}>
                                    {criteria.map(criterion => <QuestionRow key={criterion.id} question={criterion} />)}
                                </Section>
                            ))}
                        </div>
                        {errors.ratings && <p className="text-red-400 text-sm mt-2 text-center">{errors.ratings}</p>}
                        <div className="flex justify-end pt-4">
                            <button type="submit" disabled={submissionStatus === 'submitting'} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl font-semibold text-white transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-wait">
                                {submissionStatus === 'submitting' ? 'Submitting...' : 'Submit Evaluation'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};