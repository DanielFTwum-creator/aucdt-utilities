import { useState, useEffect, useCallback, useMemo } from 'react';
import { Question, Answers, Exam } from '../types';
import { DEFAULT_QUESTIONS, EXAM_DURATION_SECONDS } from '../constants';

export const useExam = (userId?: string | null, token?: string | null) => {
  // Exam Content State
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [isExamLoading, setIsExamLoading] = useState<boolean>(true);
  const [examLoadingError, setExamLoadingError] = useState<string | null>(null);

  // Exam Progress State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [randomize, setRandomize] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Loading and Saving States
  const [isProgressLoading, setIsProgressLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load available exams from the backend API
  useEffect(() => {
    const fetchExams = async () => {
        setIsExamLoading(true);
        try {
            const response = await fetch('/api/exams');
            if (!response.ok) throw new Error('Failed to fetch exams');
            const examsData: Exam[] = await response.json();
            
            // The questions in the DB are stored as strings, but the API now parses them.
            // Let's ensure the frontend receives them as objects.
            const parsedExams = examsData.map(e => ({
                ...e,
                questions: typeof e.questions === 'string' ? JSON.parse(e.questions) : e.questions
            }));

            setAvailableExams(parsedExams);
            if (parsedExams.length > 0 && !selectedExamId) {
                setSelectedExamId(parsedExams[0].id.toString());
            } else if (parsedExams.length === 0) {
                setCurrentExamQuestions(DEFAULT_QUESTIONS);
                setSelectedExamId('default_offline_exam');
            }
        } catch (error) {
            console.error("Error fetching exams from API:", error);
            setExamLoadingError("Could not load exams from server. Using default questions.");
            setCurrentExamQuestions(DEFAULT_QUESTIONS);
            setSelectedExamId('default_offline_exam');
        } finally {
            setIsExamLoading(false);
        }
    };
    fetchExams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load a specific exam's questions and user progress
  useEffect(() => {
    const loadExamAndProgress = async () => {
        if (!selectedExamId || !userId || !token) return;
        setIsProgressLoading(true);

        const exam = availableExams.find(e => e.id.toString() === selectedExamId);
        if (exam) {
            setCurrentExamQuestions(exam.questions as any); // API now sends parsed questions
        } else if (selectedExamId === 'default_offline_exam') {
            setCurrentExamQuestions(DEFAULT_QUESTIONS);
        }

        try {
            const response = await fetch(`/api/progress/${selectedExamId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const progress = await response.json();
                if (progress) {
                    setAnswers(progress.answers || {});
                    setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
                    setTimeLeft(progress.timeLeft !== undefined ? progress.timeLeft : EXAM_DURATION_SECONDS);
                } else {
                    // Reset if no progress found on server
                    setAnswers({});
                    setCurrentQuestionIndex(0);
                    setTimeLeft(EXAM_DURATION_SECONDS);
                }
            }
        } catch (e) {
            console.error("Error loading progress from server:", e);
        } finally {
            setIsProgressLoading(false);
        }
    };
    loadExamAndProgress();
  }, [selectedExamId, userId, token, availableExams]);


  const handleSubmit = useCallback(async () => {
    setIsSubmitted(true);
    setShowResults(true);
    if (selectedExamId && userId && token) {
      try {
        await fetch(`/api/progress/${selectedExamId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to clear progress on server:", error);
      }
    }
  }, [selectedExamId, userId, token]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isStarted && !isSubmitted && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0 && isStarted && !isSubmitted) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isStarted, isSubmitted, timeLeft, isPaused, handleSubmit]);

  // Autosave progress to backend
  useEffect(() => {
    const saveProgress = async () => {
      if (isStarted && !isSubmitted && selectedExamId && userId && token) {
        setIsSaving(true);
        try {
            await fetch(`/api/progress/${selectedExamId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers, currentQuestionIndex, timeLeft })
            });
        } catch (e) {
            console.error("Failed to save progress to server:", e);
        } finally {
            setIsSaving(false);
        }
      }
    };
    const saveInterval = setInterval(saveProgress, 10000); // Save every 10 seconds
    return () => clearInterval(saveInterval);
  }, [answers, currentQuestionIndex, timeLeft, isStarted, isSubmitted, selectedExamId, userId, token]);


  const startExam = useCallback(() => {
    let questionsToUse = [...currentExamQuestions];
    if (randomize) {
        questionsToUse.sort(() => Math.random() - 0.5);
    }
    setCurrentExamQuestions(questionsToUse);
    setIsStarted(true);
  }, [currentExamQuestions, randomize]);

  const handleAnswerSelect = (qId: string | number, ansIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: ansIdx }));
  };

  const resetExam = async () => {
    if (selectedExamId && userId && token) {
        await fetch(`/api/progress/${selectedExamId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    }
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(EXAM_DURATION_SECONDS);
    setIsStarted(false);
    setIsSubmitted(false);
    setShowResults(false);
    setIsPaused(false);
    setIsReviewing(false);
    
    if (selectedExamId) {
        const exam = availableExams.find(e => e.id.toString() === selectedExamId);
        setCurrentExamQuestions(exam ? (exam.questions as any) : DEFAULT_QUESTIONS);
    } else {
        setCurrentExamQuestions(DEFAULT_QUESTIONS);
    }
  };

  const selectedExam = useMemo(() => {
    return availableExams.find(e => e.id.toString() === selectedExamId) || null;
  }, [availableExams, selectedExamId]);

  return {
    currentExamQuestions, isExamLoading, examLoadingError, currentQuestionIndex, answers, timeLeft,
    isStarted, isSubmitted, showResults, isPaused, randomize, isReviewing, selectedExamId,
    selectedExam, availableExams, setCurrentQuestionIndex, handleAnswerSelect, setTimeLeft,
    setIsPaused, startExam, handleSubmit, resetExam, setRandomize,
    setSelectedExamId: (id: string | null) => setSelectedExamId(id), setIsReviewing,
    isProgressLoading, isSaving,
  };
};