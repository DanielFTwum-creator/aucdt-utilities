
import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { RATING_CATEGORIES } from '../constants';
import type { RatingCategory, Ratings, Recommendation } from '../types';
import { Recommendation as RecommendationEnum } from '../types';
import { StarIcon } from './icons';
import { ADD_ASSESSMENT, ADD_LOG } from '../hooks/actions';
import ConfirmationModal from './ConfirmationModal';


const StarRating: React.FC<{ category: RatingCategory, rating: number, onRate: (rating: number) => void }> = ({ category, rating, onRate }) => (
    <div>
        <label className="block text-sm font-medium text-brand-text-primary/90">{category}</label>
        <div className="flex space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map(star => (
                <StarIcon key={star} onClick={() => onRate(star)}
                    className={`h-8 w-8 cursor-pointer transition-colors ${star <= rating ? 'text-brand-secondary' : 'text-gray-300'}`} />
            ))}
        </div>
    </div>
);

const AssessmentForm: React.FC<{onFormSubmit: () => void}> = ({onFormSubmit}) => {
    const { state, dispatch } = useAppStore();
    
    const [programmeId, setProgrammeId] = useState('');
    const [lecturerId, setLecturerId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [semester, setSemester] = useState<number>(1);
    const [ratings, setRatings] = useState<Ratings>({} as Ratings);
    const [comment, setComment] = useState('');
    const [recommend, setRecommend] = useState<Recommendation>(RecommendationEnum.Neutral);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredLecturers = useMemo(() => state.lecturers.filter(l => l.programmeId === programmeId), [programmeId, state.lecturers]);
    const filteredCourses = useMemo(() => state.courses.filter(c => c.programmeId === programmeId), [programmeId, state.courses]);

    useEffect(() => {
        // Reset lecturer and course selection when programme changes
        setLecturerId('');
        setCourseId('');
    }, [programmeId]);

    const handleRatingChange = (category: RatingCategory, rating: number) => {
        setRatings(prev => ({ ...prev, [category]: rating }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!programmeId || !lecturerId || !courseId || Object.keys(ratings).length < RATING_CATEGORIES.length) {
            alert('Please fill in all required fields and ratings.');
            return;
        }

        const newAssessment = {
            id: new Date().toISOString(),
            programmeId,
            lecturerId,
            courseId,
            semester,
            ratings,
            comment,
            recommend,
            timestamp: new Date().toISOString(),
        };

        dispatch({ type: ADD_ASSESSMENT, payload: newAssessment });
        dispatch({ type: ADD_LOG, payload: { action: 'Assessment Submitted', message: `New assessment for lecturer ID ${lecturerId}.` }});
        
        setIsModalOpen(true);
        // Reset form
        setProgrammeId('');
        setLecturerId('');
        setCourseId('');
        setSemester(1);
        setRatings({} as Ratings);
        setComment('');
        setRecommend(RecommendationEnum.Neutral);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto bg-brand-surface p-8 rounded-lg shadow-lg">
                <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Lecturer Assessment Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="programme" className="block text-sm font-medium text-brand-text-primary/90">Programme</label>
                            <select id="programme" value={programmeId} onChange={e => setProgrammeId(e.target.value)} required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                                <option value="">Select Programme</option>
                                {state.programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="lecturer" className="block text-sm font-medium text-brand-text-primary/90">Lecturer</label>
                            <select id="lecturer" value={lecturerId} onChange={e => setLecturerId(e.target.value)} required disabled={!programmeId}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md disabled:bg-gray-100">
                                <option value="">Select Lecturer</option>
                                {filteredLecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="course" className="block text-sm font-medium text-brand-text-primary/90">Subject/Course</label>
                            <select id="course" value={courseId} onChange={e => setCourseId(e.target.value)} required disabled={!programmeId}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md disabled:bg-gray-100">
                                <option value="">Select Course</option>
                                {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-brand-text-primary/90">Semester</label>
                            <select id="semester" value={semester} onChange={e => setSemester(Number(e.target.value))} required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {RATING_CATEGORIES.map(category => (
                            <StarRating key={category} category={category} rating={ratings[category] || 0} onRate={(rating) => handleRatingChange(category, rating)} />
                        ))}
                    </div>

                    <div>
                        <label htmlFor="recommend" className="block text-sm font-medium text-brand-text-primary/90">Would you recommend this lecturer?</label>
                        <select id="recommend" value={recommend} onChange={e => setRecommend(e.target.value as Recommendation)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                            {Object.values(RecommendationEnum).map(rec => <option key={rec} value={rec}>{rec}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-brand-text-primary/90">Comments (Optional)</label>
                        <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={4}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"></textarea>
                    </div>

                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-text-light bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                            Submit Assessment
                        </button>
                    </div>
                </form>
            </div>
            {isModalOpen && (
                <ConfirmationModal 
                    title="Submission Successful"
                    message="Your assessment has been submitted successfully."
                    onConfirm={() => {
                        setIsModalOpen(false);
                        onFormSubmit();
                    }}
                    confirmText="View Results"
                />
            )}
        </>
    );
};

export default AssessmentForm;