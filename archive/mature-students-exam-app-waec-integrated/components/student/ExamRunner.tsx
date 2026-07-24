
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { Question, Answers } from '../../types';
import { COLORS } from '../../constants';
import { LatexRenderer } from '../common/LatexRenderer';
import { DiagramRenderer } from '../common/DiagramRenderer';
import { BonusSection } from '../student/BonusSection';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { AccessibleProgress } from './AccessibleProgress';

interface ExamRunnerProps {
  questions: Question[];
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: () => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ questions, answers, setAnswers, currentQuestionIndex, setCurrentQuestionIndex, timeLeft, setTimeLeft, onSubmit }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      onSubmit();
    }
    return () => clearInterval(interval);
  }, [isPaused, timeLeft, setTimeLeft, onSubmit]);
  
  // Tab visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarning(true);
        setIsPaused(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleAnswerSelect = (qId: number, ansIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: ansIdx }));
  };

  const currentQuestion = questions[currentQuestionIndex];

  const togglePause = () => (isPaused ? setShowResumeModal(true) : setShowPauseModal(true));
  const confirmPause = () => { setIsPaused(true); setShowPauseModal(false); };
  const confirmResume = () => { setIsPaused(false); setShowResumeModal(false); setTabSwitchWarning(false); };
  
  if (!currentQuestion) {
      return <div>Loading question...</div>
  }

  return (
    <>
      <ConfirmationModal isOpen={showPauseModal} title="Pause Exam?" message="Are you sure you want to pause the timer?" onConfirm={confirmPause} onCancel={() => setShowPauseModal(false)} />
      <ConfirmationModal isOpen={showResumeModal} title="Resume Exam?" message="Are you sure you want to resume the timer?" onConfirm={confirmResume} onCancel={() => setShowResumeModal(false)} />
    
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-b-4" style={{ borderColor: COLORS.aucdtGold }}>
        <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0" style={{ color: COLORS.aucdtDeepBrown }}>MSEE 112 Mathematics</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 p-2 rounded-lg" style={{backgroundColor: COLORS.aucdtLightGray}}>
                    <Clock size={24} style={{ color: COLORS.aucdtGreen }} />
                    <span className={`font-mono text-xl ${timeLeft < 600 ? 'text-red-600' : ''}`} style={{ color: timeLeft >= 600 ? COLORS.aucdtDarkGray : undefined }}>{formatTime(timeLeft)}</span>
                </div>
                <button onClick={togglePause} aria-label={isPaused ? "Resume Exam" : "Pause Exam"} className="p-3 rounded-full transition-colors duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C4033]" style={{ backgroundColor: COLORS.aucdtLightGray, color: COLORS.aucdtDeepBrown }}>
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                </button>
            </div>
        </div>
        {tabSwitchWarning && (
            <div className="mt-4 p-3 rounded-lg flex items-center justify-center text-center bg-yellow-100 text-yellow-800">
            <AlertTriangle className="mr-3" />
            Your exam is paused because you switched tabs. Click the resume button to continue.
            </div>
        )}
      </div>

      {isPaused ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Pause size={60} className="mx-auto mb-6" style={{ color: COLORS.aucdtDeepBrown }} />
              <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>Exam Paused</h2>
              <p className="text-xl mb-6" style={{ color: COLORS.aucdtDarkGray }}>Click the resume button to continue your exam.</p>
              <button onClick={confirmResume} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}><Play size={20} /><span>Resume Exam</span></button>
          </div>
      ) : (
        <>
            <AccessibleProgress current={currentQuestionIndex} total={questions.length} answers={answers} questions={questions} navigateToQuestion={setCurrentQuestionIndex} />
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6" role="region" aria-labelledby="question-heading">
              <h2 id="question-heading" className="text-xl md:text-2xl font-semibold mb-6" style={{ color: COLORS.aucdtDeepBrown }}>
                  <span className="sr-only">Question {currentQuestionIndex + 1}: </span>
                  <LatexRenderer>{currentQuestion.question}</LatexRenderer>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-8 mt-4">
                  <div className={`space-y-4 ${currentQuestion.diagram ? 'md:w-1/2' : 'w-full'}`} role="radiogroup" aria-labelledby="question-heading">
                      {currentQuestion.options.map((option, index) => (
                      <label key={index} className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 ease-in-out shadow-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 ${answers[currentQuestion.id] === index ? 'border-2' : 'border-gray-200 hover:border-gray-300'}`} style={{ borderColor: answers[currentQuestion.id] === index ? COLORS.aucdtGreen : undefined, backgroundColor: answers[currentQuestion.id] === index ? COLORS.aucdtLightGreen : undefined }}>
                          <div className="flex items-center space-x-3">
                          <input type="radio" name={`question-${currentQuestionIndex}`} value={index} checked={answers[currentQuestion.id] === index} onChange={() => handleAnswerSelect(currentQuestion.id, index)} className="form-radio h-5 w-5" style={{ accentColor: COLORS.aucdtGreen }} />
                          <span className="font-medium text-lg" style={{ color: COLORS.aucdtDarkGray }}>{String.fromCharCode(65 + index)}. <LatexRenderer>{option}</LatexRenderer></span>
                          </div>
                      </label>
                      ))}
                  </div>
                  {currentQuestion.diagram && (
                      <div className="md:w-1/2 flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                          <DiagramRenderer type={currentQuestion.diagram} />
                      </div>
                  )}
              </div>
              {currentQuestion.bonus && <BonusSection title={currentQuestion.bonus.title} content={currentQuestion.bonus.content} />}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <button onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0} className="py-3 px-6 rounded-lg font-bold shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtDeepBrown, color: COLORS.aucdtWhite }}>Previous</button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)} className="py-3 px-6 rounded-lg font-bold shadow-md" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}>Next</button>
                    ) : (
                        <button onClick={onSubmit} className="py-3 px-8 rounded-lg font-bold shadow-md" style={{ backgroundColor: COLORS.aucdtGold, color: COLORS.aucdtWhite }}>Submit Exam</button>
                    )}
                </div>
            </div>
        </>
      )}
    </>
  );
};
