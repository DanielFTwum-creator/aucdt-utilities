
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Answers } from '../../types';
import { EXAM_DURATION } from '../../constants';
import { useFisherYatesShuffle } from '../../hooks/useFisherYatesShuffle';
import { generateVariationsFromQuestions } from '../../services/geminiService';
import { ExamStartScreen } from './ExamStartScreen';
import { ExamRunner } from './ExamRunner';
import { ExamResults } from './ExamResults';

interface StudentExperienceProps {
  initialQuestions: Question[];
  isAdmin: boolean;
  onReturnToAdmin: () => void;
}

export const StudentExperience: React.FC<StudentExperienceProps> = ({ initialQuestions, isAdmin, onReturnToAdmin }) => {
  const [examState, setExamState] = useState<'start' | 'running' | 'results'>('start');
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const shuffleQuestions = useFisherYatesShuffle<Question>();

  const examId = 'student_exam_progress'; // A consistent key for local storage

  // Load progress from local storage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(examId);
      if (savedProgress) {
        const { questions: savedQuestions, answers: savedAnswers, currentQuestionIndex: savedIndex, timeLeft: savedTime } = JSON.parse(savedProgress);
        if (savedQuestions && savedAnswers && savedIndex !== undefined && savedTime !== undefined) {
          setQuestions(savedQuestions);
          setAnswers(savedAnswers);
          setCurrentQuestionIndex(savedIndex);
          setTimeLeft(savedTime);
          setExamState('running'); // Resume the exam
        }
      } else {
        setQuestions(initialQuestions);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
      localStorage.removeItem(examId);
      setQuestions(initialQuestions);
    }
  }, [examId, initialQuestions]);

  // Save progress to local storage
  const saveProgress = useCallback(() => {
    if (examState === 'running') {
      const progress = { questions, answers, currentQuestionIndex, timeLeft };
      localStorage.setItem(examId, JSON.stringify(progress));
    }
  }, [examState, questions, answers, currentQuestionIndex, timeLeft, examId]);

  useEffect(() => {
    const saveInterval = setInterval(saveProgress, 10000); // Save every 10 seconds
    return () => clearInterval(saveInterval);
  }, [saveProgress]);


  const handleStartExam = async (randomize: boolean, subject: string) => {
    try {
      let questionsToStart: Question[];
      
      if (randomize) {
        setIsGeneratingQuestions(true);
        try {
          // Generate new questions based on the current ones
          questionsToStart = await generateVariationsFromQuestions(initialQuestions, "mathematics");
          console.log('Generated new questions:', questionsToStart.length);
        } catch (error) {
          console.error('Failed to generate new questions:', error);
          // Fallback to shuffled original questions if generation fails
          questionsToStart = shuffleQuestions(initialQuestions);
          alert('Failed to generate new questions. Using shuffled original questions instead.');
        } finally {
          setIsGeneratingQuestions(false);
        }
      } else {
        questionsToStart = initialQuestions;
      }
      
      setQuestions(questionsToStart);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setTimeLeft(EXAM_DURATION);
      setExamState('running');
    } catch (error) {
      console.error('Error starting exam:', error);
      setIsGeneratingQuestions(false);
    }
  };

  const handleSubmitExam = () => {
    saveProgress(); // Final save
    localStorage.removeItem(examId);
    setExamState('results');
  };

  const handleRetakeExam = () => {
    setQuestions(initialQuestions);
    setExamState('start');
  };

  const renderContent = () => {
    switch (examState) {
      case 'running':
        return (
          <ExamRunner
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            onSubmit={handleSubmitExam}
          />
        );
      case 'results':
        return (
          <ExamResults
            questions={questions}
            answers={answers}
            onRetake={handleRetakeExam}
          />
        );
      case 'start':
      default:
        return (
          <ExamStartScreen
            questionCount={initialQuestions.length}
            onStart={handleStartExam}
            isGeneratingQuestions={isGeneratingQuestions}
          />
        );
    }
  };

  return (
    <div>
        {isAdmin && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg shadow-md" role="alert">
                <div className="flex justify-between items-center">
                    <p className="font-bold">Admin Preview: You are viewing as a student.</p>
                    <button onClick={onReturnToAdmin} className="py-1 px-3 rounded-lg font-bold" style={{ backgroundColor: '#D4AF37', color: 'white' }}>
                        Return to Admin View
                    </button>
                </div>
            </div>
        )}
        {renderContent()}
    </div>
  );
};
