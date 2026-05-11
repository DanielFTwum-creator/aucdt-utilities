import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, HelpCircle, CheckCircle } from 'lucide-react';
import { FormData, RatingCategory, Recommendation, Programme, Lecturer, Course, assessmentCriteria, assessmentSections, AssessmentSectionTitle } from '../types';
import RadioRatingInput from './RadioRatingInput';

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  name?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, children, disabled = false, name }) => (
    <div>
        <label className="block text-sm font-medium text-[#2C1810] dark:text-[#E6D5C7] [.high-contrast_&]:text-white mb-2">{label}</label>
        <div className="relative">
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black border border-[#E6D5C7] dark:border-[#6B1028] [.high-contrast_&]:border-yellow-300 text-[#2C1810] dark:text-white [.high-contrast_&]:text-white text-sm rounded-md focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] [.high-contrast_&]:focus:ring-cyan-400 focus:border-[#8B1538] dark:focus:border-[#D4AF37] [.high-contrast_&]:focus:border-cyan-400 block p-3 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown size={18} className="text-[#2C1810]/70 dark:text-[#E6D5C7]/70 [.high-contrast_&]:text-yellow-300" />
            </div>
        </div>
    </div>
);

interface LecturerAssessmentFormProps {
    programmes: Programme[];
    lecturers: Lecturer[];
    courses: Course[];
    onSubmissionSuccess: () => void;
}

const initialFormData: FormData = {
    programme: '',
    lecturer: '',
    course: '',
    semester: 1,
    ratings: Object.keys(assessmentCriteria).reduce((acc, key) => {
        acc[key as RatingCategory] = 0;
        return acc;
    }, {} as Record<RatingCategory, number>),
    recommend: 'Neutral',
    comment: ''
};

const generateEmailBody = (data: FormData, programmeName: string, courseName: string, lecturerName: string): string => {
    let ratingsHtml = '<table style="width: 100%; border-collapse: collapse;" border="1">';
    ratingsHtml += '<thead><tr><th style="padding: 8px; text-align: left;">Category</th><th style="padding: 8px; text-align: left;">Question</th><th style="padding: 8px; text-align: center;">Rating</th></tr></thead>';
    ratingsHtml += '<tbody>';

    for (const sectionTitle of Object.keys(assessmentSections) as AssessmentSectionTitle[]) {
        ratingsHtml += `<tr><td colspan="3" style="background-color: #f2f2f2; padding: 8px;"><strong>${sectionTitle}</strong></td></tr>`;
        const questionKeys = assessmentSections[sectionTitle];
        for (const key of questionKeys) {
            ratingsHtml += `<tr>
                <td style="padding: 8px;">${assessmentCriteria[key].short}</td>
                <td style="padding: 8px;">${assessmentCriteria[key].long}</td>
                <td style="padding: 8px; text-align: center;"><strong>${data.ratings[key]}/5</strong></td>
            </tr>`;
        }
    }
    ratingsHtml += '</tbody></table>';

    return `
        <html>
        <head>
            <style>
                body { font-family: sans-serif; color: #333; }
                table { border-color: #cccccc; }
                th, td { border: 1px solid #dddddd; }
                h1, h2 { color: #8B1538; }
            </style>
        </head>
        <body>
            <h1>New Lecturer Evaluation Submitted</h1>
            <p>A new assessment has been submitted with the following details:</p>
            <ul>
                <li><strong>Programme:</strong> ${programmeName}</li>
                <li><strong>Course:</strong> ${courseName}</li>
                <li><strong>Lecturer:</strong> ${lecturerName}</li>
                <li><strong>Semester:</strong> ${data.semester}</li>
            </ul>
            <hr>
            <h2>Ratings Breakdown</h2>
            ${ratingsHtml}
            <hr>
            <h2>Recommendation</h2>
            <p style="font-size: 1.2em; font-weight: bold;">${data.recommend}</p>
            <hr>
            <h2>Additional Comment</h2>
            <blockquote>${data.comment || 'No comment provided.'}</blockquote>
        </body>
        </html>
    `;
};


// FIX: Completed the component to return JSX and switched to a named export.
export const LecturerAssessmentForm: React.FC<LecturerAssessmentFormProps> = ({ programmes, lecturers, courses, onSubmissionSuccess }) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success'>('idle');
    
    // State for accordion UI
    const allSectionTitles = useMemo(() => Object.keys(assessmentSections) as AssessmentSectionTitle[], []);
    const [activeSection, setActiveSection] = useState<AssessmentSectionTitle | null>(allSectionTitles[0]);
    const [completedSections, setCompletedSections] = useState<Set<AssessmentSectionTitle>>(new Set());

    useEffect(() => {
        const newCompletedSections = new Set<AssessmentSectionTitle>();
        allSectionTitles.forEach(title => {
            const questionKeys = assessmentSections[title];
            if (questionKeys.every(key => formData.ratings[key] > 0)) {
                newCompletedSections.add(title);
            }
        });
        setCompletedSections(newCompletedSections);
    }, [formData.ratings, allSectionTitles]);

    const handleProgrammeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProgramme = e.target.value;
        setFormData(prev => ({
            ...prev,
            programme: newProgramme,
            course: '',   // Reset course
            lecturer: '', // Reset lecturer
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (category: RatingCategory, rating: number) => {
        setFormData(prev => ({
            ...prev,
            ratings: { ...prev.ratings, [category]: rating }
        }));
    };

    const availableCourses = useMemo(() => {
        return formData.programme ? courses.filter(c => c.programmeId === formData.programme) : [];
    }, [formData.programme, courses]);

    // Automatically set lecturer when course changes
    useEffect(() => {
        if (formData.course) {
            const selectedCourse = courses.find(c => c.id === formData.course);
            if (selectedCourse && selectedCourse.lecturerIds.length > 0) {
                // If a course has multiple lecturers, select the first one by default.
                const firstLecturerId = selectedCourse.lecturerIds[0];
                setFormData(prev => ({ ...prev, lecturer: firstLecturerId }));
            } else {
                setFormData(prev => ({ ...prev, lecturer: '' }));
            }
        }
    }, [formData.course, courses]);

    const isSectionUnlocked = (sectionTitle: AssessmentSectionTitle): boolean => {
        const index = allSectionTitles.indexOf(sectionTitle);
        if (index === 0) return true;
        const prevSectionTitle = allSectionTitles[index - 1];
        return completedSections.has(prevSectionTitle);
    };

    const handleToggleSection = (sectionTitle: AssessmentSectionTitle) => {
        if (!isSectionUnlocked(sectionTitle)) return;
        setActiveSection(prev => prev === sectionTitle ? null : sectionTitle);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!formData.programme) {
            alert('Please select a programme.');
            return;
        }
        if (!formData.course) {
            alert('Please select a course.');
            return;
        }
        if (completedSections.size !== allSectionTitles.length) {
            alert('Please complete all feedback sections before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/v1/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Submission failed: ${errorText}`);
            }

            setSubmissionStatus('success');
            onSubmissionSuccess();
            
            // Send email notification after successful submission
            try {
                const programmeName = programmes.find(p => p.id === formData.programme)?.name || 'Unknown Programme';
                const courseName = courses.find(c => c.id === formData.course)?.name || 'Unknown Course';
                const lecturerName = lecturers.find(l => l.id === formData.lecturer)?.name || 'Unknown Lecturer';
                
                const htmlBody = generateEmailBody(formData, programmeName, courseName, lecturerName);

                const emailPayload = {
                    to: 'qa@aucdt.edu.gh',
                    subject: `New Lecturer Evaluation for ${lecturerName}`,
                    html_body: htmlBody, // Assuming the API expects this field name for the email body
                };

                const emailResponse = await fetch('https://portal.aucdt.edu.gh/aucdt-dev/emailEnquiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emailPayload),
                });

                if (emailResponse.ok) {
                    console.log('Email notification sent successfully.');
                } else {
                    console.error('Failed to send email notification:', await emailResponse.text());
                }
            } catch (emailError) {
                // Log the error but don't block the user's success feedback
                console.error('An error occurred while sending the email notification:', emailError);
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your assessment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleResetForm = () => {
        setFormData(initialFormData);
        setSubmissionStatus('idle');
        setActiveSection(allSectionTitles[0]);
    };

    if (submissionStatus === 'success') {
        return (
            <div className="bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black border-2 border-emerald-500 dark:border-emerald-600 [.high-contrast_&]:border-green-400 p-8 rounded-lg shadow-2xl text-center">
                 <CheckCircle className="mx-auto h-16 w-16 text-emerald-500 [.high-contrast_&]:text-green-400" />
                <h2 className="mt-6 text-2xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">Assessment Submitted Successfully!</h2>
                <p className="mt-2 text-[#2C1810]/80 dark:text-[#E6D5C7]/80 [.high-contrast_&]:text-slate-300">
                    Thank you for your valuable feedback. Your submission has been recorded.
                </p>
                <button
                    onClick={handleResetForm}
                    className="mt-8 bg-[#8B1538] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#6B1028] transition-colors [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:hover:bg-yellow-300 [.high-contrast_&]:hover:text-black"
                >
                    Submit Another Assessment
                </button>
            </div>
        );
    }
    
    return (
        <form onSubmit={handleSubmit} className="bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black p-6 sm:p-8 rounded-lg shadow-2xl border border-[#E6D5C7] dark:border-[#6B1028] [.high-contrast_&]:border-yellow-300 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <CustomSelect label="Programme" name="programme" value={formData.programme} onChange={handleProgrammeChange}>
                    <option value="" disabled>Select a Programme</option>
                    {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </CustomSelect>

                <CustomSelect label="Subject/Course" name="course" value={formData.course} onChange={handleInputChange} disabled={!formData.programme}>
                    <option value="" disabled>Select a Course</option>
                    {availableCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </CustomSelect>
                
                <CustomSelect label="Semester" name="semester" value={String(formData.semester)} onChange={handleInputChange}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                </CustomSelect>
            </div>
            
            {formData.lecturer && (
                <div className="bg-[#F8F6F0] dark:bg-[#2C1810]/50 [.high-contrast_&]:bg-black p-4 rounded-lg border border-[#E6D5C7] dark:border-[#6B1028] [.high-contrast_&]:border-yellow-300">
                     <p className="text-sm font-medium text-[#2C1810] dark:text-[#E6D5C7] [.high-contrast_&]:text-white">Lecturer for this course:</p>
                     <p className="text-lg font-bold text-[#6B1028] dark:text-[#D4AF37] [.high-contrast_&]:text-yellow-300">{lecturers.find(l => l.id === formData.lecturer)?.name || 'N/A'}</p>
                </div>
            )}

            <div>
                <h2 className="text-xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white mb-4">Feedback Questions</h2>
                 <div className="space-y-2">
                    {allSectionTitles.map((title, index) => {
                        const questions = assessmentSections[title];
                        const isCompleted = completedSections.has(title);
                        const isUnlocked = isSectionUnlocked(title);
                        const isOpen = activeSection === title;

                        return (
                             <div key={title} className="border border-[#E6D5C7] dark:border-[#6B1028] [.high-contrast_&]:border-yellow-300 rounded-lg overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => handleToggleSection(title)}
                                    disabled={!isUnlocked}
                                    aria-expanded={isOpen}
                                    className="w-full flex justify-between items-center p-4 text-left bg-[#F8F6F0] dark:bg-[#2C1810]/50 [.high-contrast_&]:bg-black hover:bg-[#E6D5C7]/50 dark:hover:bg-[#6B1028]/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${isCompleted ? 'bg-emerald-500 [.high-contrast_&]:bg-green-500' : 'bg-[#6B1028] dark:bg-[#D4AF37] [.high-contrast_&]:bg-yellow-300 [.high-contrast_&]:text-black'}`}>
                                            {isCompleted ? <CheckCircle size={14} /> : index + 1}
                                        </div>
                                        <h3 className="font-semibold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">{title.replace(/Section \d: /g, '')}</h3>
                                    </div>
                                    <ChevronDown size={20} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isOpen && (
                                     <div className="bg-[#F8F6F0] dark:bg-[#2C1810]/70 [.high-contrast_&]:bg-black p-4 divide-y divide-[#E6D5C7] dark:divide-[#6B1028]/50 [.high-contrast_&]:divide-yellow-300/50">
                                        {questions.map(qId => (
                                            <RadioRatingInput
                                                key={qId}
                                                questionNumber={parseInt(qId)}
                                                question={assessmentCriteria[qId].long}
                                                rating={formData.ratings[qId]}
                                                onRatingChange={(rating) => handleRatingChange(qId, rating)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[#2C1810] dark:text-white [.high-contrast_&]:text-white mb-2">Would you recommend this lecturer to other students?</label>
                <div className="flex flex-wrap gap-4">
                    {(['Recommend', 'Neutral', 'Not Recommend'] as Recommendation[]).map(rec => (
                        <label key={rec} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="recommend"
                                value={rec}
                                checked={formData.recommend === rec}
                                onChange={handleInputChange}
                                className="w-4 h-4 accent-[#800020] dark:accent-[#D4AF37] [.high-contrast_&]:accent-cyan-400"
                            />
                            <span className="text-sm text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">{rec}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                 <label htmlFor="comment" className="block text-sm font-medium text-[#2C1810] dark:text-white [.high-contrast_&]:text-white mb-2">Additional Comments (Optional)</label>
                 <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Provide any other constructive feedback..."
                    className="w-full bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black border border-[#E6D5C7] dark:border-[#6B1028] [.high-contrast_&]:border-yellow-300 text-[#2C1810] dark:text-white [.high-contrast_&]:text-white text-sm rounded-md focus:ring-1 focus:ring-[#8B1538] dark:focus:ring-[#D4AF37] [.high-contrast_&]:focus:ring-cyan-400 focus:border-[#8B1538] dark:focus:border-[#D4AF37] [.high-contrast_&]:focus:border-cyan-400 block p-3"
                ></textarea>
            </div>
            
            <div className="border-t border-[#E6D5C7] dark:border-[#6B1028]/50 [.high-contrast_&]:border-yellow-300/50 pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || completedSections.size !== allSectionTitles.length}
                    className="bg-[#8B1538] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#6B1028] transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 [.high-contrast_&]:disabled:border-slate-700 [.high-contrast_&]:disabled:text-slate-500 disabled:cursor-not-allowed [.high-contrast_&]:bg-black [.high-contrast_&]:border-2 [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-yellow-300 [.high-contrast_&]:hover:bg-yellow-300 [.high-contrast_&]:hover:text-black"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
            </div>
        </form>
    );
};