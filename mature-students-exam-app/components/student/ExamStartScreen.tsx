
import { BookOpen, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { COLORS, EXAM_DURATION } from '../../constants';

import { availableSubjects } from "../../utils/waecGenerator";

interface ExamStartScreenProps {
  questionCount: number;
  onStart: (randomize: boolean, subject: string) => void;
  isGeneratingQuestions?: boolean;
}

export const ExamStartScreen: React.FC<ExamStartScreenProps> = ({ questionCount, onStart, isGeneratingQuestions = false }) => {
  const [randomize, setRandomize] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(availableSubjects[0]);

  return (
    <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: COLORS.aucdtGold }}>
        <BookOpen className="mx-auto mb-6" size={80} style={{ color: COLORS.aucdtDeepBrown }} />
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: COLORS.aucdtDeepBrown }}>Techbridge University College (TUC) Mature Students Entrance Examination</h1>
        <h2 className="text-xl md:text-2xl mb-8" style={{ color: COLORS.aucdtGreen }}>MSEE 112 {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Aptitude Test</h2>
        
        <div className="rounded-lg p-6 mb-8 text-left" style={{ backgroundColor: COLORS.aucdtLightGreen }}>
            <h3 className="font-semibold text-xl mb-4" style={{ color: COLORS.aucdtDeepBrown }}>Examination Instructions:</h3>
            <ul className="space-y-3 text-lg" style={{ color: COLORS.aucdtDarkGray }}>
                <li>• Answer all 24 questions.</li>
                <li>• Your progress is saved automatically. If you leave, you can resume later.</li>
                <li>• Switching to other tabs or applications will pause the exam.</li>
                <li>• Time limit: {Math.floor(EXAM_DURATION / 3600)} hours. You can pause the timer if needed.</li>
            </ul>
        </div>
        
        <div className="flex items-center justify-center space-x-3 mb-6">
            <label htmlFor="subject-select" className="font-medium" style={{ color: COLORS.aucdtDarkGray }}>
              Select Subject:
            </label>
            <select
              id="subject-select"
              className="p-2 border rounded-md"
              style={{ borderColor: COLORS.aucdtDarkGray, color: COLORS.aucdtDeepBrown }}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isGeneratingQuestions}
            >
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </option>
              ))}
            </select>
        </div>

        <div className="flex items-center justify-center space-x-3 mb-6">
            <input 
              type="checkbox" 
              id="randomize" 
              className="h-5 w-5 rounded cursor-pointer" 
              style={{ accentColor: COLORS.aucdtGreen }} 
              checked={randomize} 
              onChange={(e) => setRandomize(e.target.checked)}
              disabled={isGeneratingQuestions}
            />
            <label htmlFor="randomize" className="font-medium cursor-pointer" style={{ color: COLORS.aucdtDarkGray }}>
              Generate New Questions (AI-powered)
            </label>
        </div>

        {randomize && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <p className="text-sm">
              ⚡ When enabled, AI will generate 24 brand new questions based on the current question set, 
              maintaining the same difficulty level and topics but with different numbers and scenarios.
            </p>
          </div>
        )}

        {isGeneratingQuestions && (
          <div className="mb-6 p-4 rounded-lg flex items-center justify-center space-x-3" style={{ backgroundColor: COLORS.aucdtLightGreen }}>
            <Loader2 className="animate-spin" size={20} style={{ color: COLORS.aucdtGreen }} />
            <span style={{ color: COLORS.aucdtDeepBrown }}>Generating new questions... This may take a moment.</span>
          </div>
        )}

        <button 
          onClick={() => onStart(randomize, selectedSubject)} 
          disabled={isGeneratingQuestions}
          className="w-full md:w-auto py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
          style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}
        >
            {isGeneratingQuestions ? 'Generating Questions...' : 'Start Examination'}
        </button>
    </div>
  );
};
