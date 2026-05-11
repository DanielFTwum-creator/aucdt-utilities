import React, { useMemo, useCallback } from 'react';
import { Star, Calendar, BookOpen, Clock, MessageCircle, ThumbsUp, ThumbsDown, FileText, Users, BrainCircuit, MessageSquare, HelpCircle, Cog, Info, Shield } from 'lucide-react';
import { LecturerEvaluation, RatingCategory, assessmentCriteria } from '../types';
import RatingCard from './RatingCard';

const categoryIcons: Record<RatingCategory, React.ReactNode> = {
    '1': <BrainCircuit size={20} />,   // Knowledge
    '2': <MessageCircle size={20} />, // Responsiveness
    '3': <Clock size={20} />,           // Punctuality
    '4': <BookOpen size={20} />,      // Course Structure
    '5': <Info size={20} />,            // Relevance
    '6': <Star size={20} />,            // Learning Enhancement
    '7': <FileText size={20} />,      // Assignment Feedback
    '8': <Shield size={20} />,         // Fair Evaluation
    '9': <BrainCircuit size={20} />,   // Critical Thinking
    '10': <Users size={20} />,         // Inclusive Environment
    '11': <BookOpen size={20} />,     // Stimulating Materials
    '12': <Clock size={20} />,          // Effective Time Use
    '13': <Cog size={20} />,            // Effective Tools
    '14': <Users size={20} />,          // Availability
    '15': <MessageSquare size={20} />,// Clear Communication
    '16': <Users size={20} />,          // Student Participation
    '17': <BrainCircuit size={20} />,   // Creativity & Research
    '18': <MessageSquare size={20} />, // Interaction Facilitation
    '19': <HelpCircle size={20} />,     // Encouraging Questions
    '20': <Star size={20} />,           // Teaching Style
};


const EvaluationCard: React.FC<{ evaluation: LecturerEvaluation }> = ({ evaluation }) => {
  const averageRating = useMemo(() => {
    const ratings = Object.values(evaluation.ratings);
    if (ratings.length === 0) return '0.0';
    // FIX: Explicitly typing the accumulator (`sum`) and current value (`rating`) in the reduce function resolves an arithmetic type error.
    return (ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length).toFixed(1);
  }, [evaluation.ratings]);

  const formatDate = useCallback((timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);
  
  const formatName = (id: string) => {
      // A simple formatter. A real app might look up the name from a map.
      return id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <div className="bg-[#F8F6F0] dark:bg-[#2C1810] [.high-contrast_&]:bg-black [.high-contrast_&]:border-yellow-300 rounded-xl shadow-md border border-l-4 border-[#E6D5C7] dark:border-[#6B1028] border-l-[#D4AF37] [.high-contrast_&]:border-l-yellow-300 hover:shadow-lg hover:border-[#D4AF37] dark:hover:border-l-[#D4AF37] dark:hover:border-y-[#6B1028] dark:hover:border-r-[#6B1028] transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start p-6">
        <div>
          <h2 className="text-xl font-bold text-[#2C1810] dark:text-white [.high-contrast_&]:text-white">
            {formatName(evaluation.lecturerId)}
          </h2>
          <div className="flex items-center gap-4 text-sm text-[#2C1810]/80 dark:text-[#E6D5C7]/80 [.high-contrast_&]:text-slate-300 mt-1">
            <span className="flex items-center gap-1.5">
              <BookOpen size={16} />
              {evaluation.courseId.toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              Semester {evaluation.semester}
            </span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-3xl font-bold text-[#6B1028] dark:text-[#F4E4BC] [.high-contrast_&]:text-yellow-300">{averageRating}</div>
          <div className="text-sm text-[#2C1810]/70 dark:text-[#E6D5C7]/70 [.high-contrast_&]:text-slate-300">Average Rating</div>
        </div>
      </div>

      <div className="px-6 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(evaluation.ratings) as RatingCategory[]).map(category => (
             <RatingCard
                key={category}
                label={assessmentCriteria[category].short}
                rating={evaluation.ratings[category]}
                icon={categoryIcons[category]}
            />
        ))}
      </div>
      
      {evaluation.comment && (
        <div className="my-2 mx-6 p-3 bg-[#F8F6F0] dark:bg-[#2C1810]/50 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg border border-[#E6D5C7] dark:border-[#6B1028]">
          <p className="text-sm text-[#2C1810] dark:text-[#E6D5C7] [.high-contrast_&]:text-white italic">"{evaluation.comment}"</p>
        </div>
      )}

      <div className="mt-auto flex justify-between items-center p-6 pt-4 border-t border-[#E6D5C7] dark:border-[#6B1028]/50 [.high-contrast_&]:border-yellow-300/50">
        <div className="flex items-center gap-2">
          {evaluation.recommend === 'Recommend' ? (
              <ThumbsUp size={20} className="text-emerald-600 [.high-contrast_&]:text-green-400" />
          ) : evaluation.recommend === 'Not Recommend' ? (
              <ThumbsDown size={20} className="text-rose-600 [.high-contrast_&]:text-red-400" />
          ) : null }
          <span className={`font-medium ${
            evaluation.recommend === 'Recommend' ? 'text-emerald-600 [.high-contrast_&]:text-green-400' : 
            evaluation.recommend === 'Not Recommend' ? 'text-rose-600 [.high-contrast_&]:text-red-400' :
            'text-[#2C1810]/70 [.high-contrast_&]:text-slate-300'
          }`}>
            {evaluation.recommend}
          </span>
        </div>
        <span className="text-sm text-[#2C1810]/70 dark:text-[#E6D5C7]/70 [.high-contrast_&]:text-slate-300">
          {formatDate(evaluation.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default EvaluationCard;