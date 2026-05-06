import React, { useState, useCallback } from 'react';
import { Quiz, QuizQuestion, QuizQuestionOption } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { COLORS } from '../constants';
import { useProgress } from '../context/ProgressContext';
import Modal from './ui/Modal';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

interface QuizComponentProps {
  moduleId: string;
  quiz: Quiz;
  onQuizComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ moduleId, quiz, onQuizComplete }) => {
  const navigate = useNavigate();
  const { updateQuizCompletion } = useProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string[] }>({}); // questionId -> selectedOptionValues
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const currentQuestion: QuizQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionChange = (questionId: string, optionValue: string, type: QuizQuestion['type']) => {
    setSelectedAnswers(prev => {
      const newAnswers = { ...prev };
      if (type === 'single-choice' || type === 'true-false') {
        newAnswers[questionId] = [optionValue];
      } else if (type === 'multi-choice') {
        if (newAnswers[questionId]?.includes(optionValue)) {
          newAnswers[questionId] = newAnswers[questionId].filter(val => val !== optionValue);
        } else {
          newAnswers[questionId] = [...(newAnswers[questionId] || []), optionValue];
        }
      }
      return newAnswers;
    });
  };

  const calculateScore = useCallback(() => {
    let correctCount = 0;
    quiz.questions.forEach(question => {
      const userSelected = selectedAnswers[question.id] || [];
      let isQuestionCorrect = false;

      if (question.type === 'single-choice' || question.type === 'true-false') {
        const correctAnswer = question.options.find(opt => opt.isCorrect)?.text;
        if (userSelected.length === 1 && userSelected[0] === correctAnswer) {
          isQuestionCorrect = true;
        }
      } else if (question.type === 'multi-choice') {
        const correctAnswers = question.options.filter(opt => opt.isCorrect).map(opt => opt.text);
        if (userSelected.length === correctAnswers.length &&
            userSelected.every(ans => correctAnswers.includes(ans))) {
          isQuestionCorrect = true;
        }
      }
      if (isQuestionCorrect) {
        correctCount++;
      }
    });
    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    return calculatedScore;
  }, [quiz.questions, selectedAnswers]);

  const handleSubmitQuiz = async () => {
    const finalScore = calculateScore();
    setSubmitted(true);
    setShowResultModal(true);
    onQuizComplete(finalScore); // Notify parent component
    await updateQuizCompletion(moduleId, quiz.id, finalScore);
  };

  const getOptionColor = (option: QuizQuestionOption, questionId: string) => {
    if (!submitted) return '';
    const userSelected = selectedAnswers[questionId] || [];

    if (option.isCorrect) {
      return 'bg-success text-white';
    } else if (userSelected.includes(option.text) && !option.isCorrect) {
      return 'bg-error text-white';
    }
    return 'bg-gray-100 dark:bg-gray-700 text-text-light dark:text-text-dark';
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowResultModal(false);
  };

  const handleFinishQuiz = () => {
    setShowResultModal(false);
    navigate(`${ROUTES.MODULES}/${moduleId}`); // Go back to module overview
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">{quiz.title}</h2>
      <p className="text-subtle-text-light dark:text-subtle-text-dark mb-6">
        Question {currentQuestionIndex + 1} of {quiz.questions.length}
      </p>

      <fieldset className="space-y-4" disabled={submitted}>
        <legend className="text-xl font-semibold mb-4 text-text-light dark:text-text-dark">
          {currentQuestion.question}
        </legend>
        {currentQuestion.options.map((option, index) => (
          <div key={index} className={`flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700
                                       ${submitted ? getOptionColor(option, currentQuestion.id) : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                                       ${selectedAnswers[currentQuestion.id]?.includes(option.text) && !submitted ? 'bg-blue-100 dark:bg-blue-900 border-primary' : ''}
                                       transition-all duration-200 cursor-pointer`}
               onClick={() => !submitted && handleOptionChange(currentQuestion.id, option.text, currentQuestion.type)}
               tabIndex={submitted ? -1 : 0}
               role={currentQuestion.type === 'multi-choice' ? 'checkbox' : 'radio'}
               aria-checked={selectedAnswers[currentQuestion.id]?.includes(option.text)}
               aria-label={option.text}>
            <input
              type={currentQuestion.type === 'multi-choice' ? 'checkbox' : 'radio'}
              id={`${currentQuestion.id}-${index}`}
              name={currentQuestion.id}
              value={option.text}
              checked={selectedAnswers[currentQuestion.id]?.includes(option.text) || false}
              onChange={() => handleOptionChange(currentQuestion.id, option.text, currentQuestion.type)}
              className={`${submitted ? 'opacity-0 absolute' : 'form-radio h-4 w-4 text-primary focus:ring-primary dark:text-blue-400 dark:focus:ring-blue-400'}`}
              disabled={submitted}
              aria-hidden={submitted}
            />
            <span className={`ml-3 text-base ${submitted && (option.isCorrect || selectedAnswers[currentQuestion.id]?.includes(option.text)) ? 'text-white' : 'text-text-light dark:text-text-dark'}`}>
              {option.text}
            </span>
            {submitted && option.isCorrect && <CheckCircle size={20} className="ml-auto text-white" aria-label="Correct Answer" />}
            {submitted && !option.isCorrect && selectedAnswers[currentQuestion.id]?.includes(option.text) && <XCircle size={20} className="ml-auto text-white" aria-label="Incorrect Answer" />}
          </div>
        ))}
      </fieldset>

      {submitted && currentQuestion.explanation && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Explanation:</h3>
          <p className="text-subtle-text-light dark:text-subtle-text-dark">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button onClick={goToPrevQuestion} disabled={currentQuestionIndex === 0 || submitted} variant="secondary">
          <ChevronLeft size={18} /> Previous
        </Button>
        {currentQuestionIndex < quiz.questions.length - 1 && (
          <Button onClick={goToNextQuestion} disabled={submitted}>
            Next <ChevronRight size={18} />
          </Button>
        )}
        {currentQuestionIndex === quiz.questions.length - 1 && !submitted && (
          <Button onClick={handleSubmitQuiz} variant="primary">
            Submit Quiz
          </Button>
        )}
        {currentQuestionIndex === quiz.questions.length - 1 && submitted && (
          <Button onClick={handleRetakeQuiz} variant="outline">
            Retake Quiz
          </Button>
        )}
      </div>

      <Modal isOpen={showResultModal} onClose={() => setShowResultModal(false)} title="Quiz Results">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
            You scored {score}%
          </h3>
          {score >= quiz.passScore ? (
            <div className="text-success flex items-center justify-center space-x-2">
              <CheckCircle size={36} />
              <span className="text-xl font-semibold">Congratulations! You passed!</span>
            </div>
          ) : (
            <div className="text-error flex items-center justify-center space-x-2">
              <XCircle size={36} />
              <span className="text-xl font-semibold">Keep trying! You can do it!</span>
            </div>
          )}
          <p className="text-subtle-text-light dark:text-subtle-text-dark">
            You needed {quiz.passScore}% to pass.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button onClick={handleRetakeQuiz} variant="secondary">
              Retake Quiz
            </Button>
            <Button onClick={handleFinishQuiz} variant="primary">
              Continue to Module
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default QuizComponent;