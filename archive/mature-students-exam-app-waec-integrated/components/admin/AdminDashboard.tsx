import React, { useState, useEffect, useCallback } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useAuth } from '../../hooks/useAuth';
import { Question, Exam } from '../../types';
import { generateQuestionsFromText } from '../../services/geminiService';
import { Loader } from '../common/Loader';
import { Message } from '../common/Message';
import { COLORS } from '../../constants';
import { UploadCloud, Save, Eye, LogOut, Loader2 } from 'lucide-react';
import { defaultQuestions } from '../../data/defaultQuestions';

interface AdminDashboardProps {
  onViewAsStudent: () => void;
  onLoadExam: (questions: Question[]) => void;
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewAsStudent, onLoadExam, onSignOut }) => {
  const { user, isAuthReady } = useAuth();
  const [db] = useState(firebase.firestore());
  
  const [pdfContentInput, setPdfContentInput] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [examName, setExamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthReady && user && !user.isAnonymous) {
      const appId = 'msee-math-aptitude-test-v1';
      const examsCollectionRef = db.collection(`artifacts/${appId}/public/data/exams`);
      const unsubscribe = examsCollectionRef.onSnapshot((snapshot) => {
        const examsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
        setAvailableExams(examsData);
      }, (error) => {
        console.error("Error fetching exams:", error);
        setMessage("Could not load available exams.");
        setMessageType('error');
      });
      return () => unsubscribe();
    }
  }, [isAuthReady, user, db]);

  const handleProcessText = async () => {
    if (!pdfContentInput.trim()) {
      setMessage("Please enter some text to generate questions from.");
      setMessageType('error');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setGeneratedQuestions([]);
    try {
      const questions = await generateQuestionsFromText(pdfContentInput);
      setGeneratedQuestions(questions);
      setMessage("Exam questions generated successfully!");
      setMessageType('success');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExam = async () => {
    if (!examName.trim() || generatedQuestions.length === 0) {
      setMessage("Please provide an exam name and generate questions before saving.");
      setMessageType('error');
      return;
    }
    if (!user || user.isAnonymous) {
        setMessage("Authentication error: Only admins can save exams.");
        setMessageType('error');
        return;
    }

    setIsLoading(true);
    try {
      const appId = 'msee-math-aptitude-test-v1';
      const examsCollectionRef = db.collection(`artifacts/${appId}/public/data/exams`);
      await examsCollectionRef.add({
        name: examName,
        questions: JSON.stringify(generatedQuestions),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: user.uid,
      });
      setMessage("Exam saved successfully!");
      setMessageType('success');
      setPdfContentInput('');
      setGeneratedQuestions([]);
      setExamName('');
    } catch (error: any) {
      setMessage(`Error saving exam: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadExam = useCallback(async (examId: string) => {
    setIsLoading(true);
    setSelectedExamId(examId);
    try {
      const appId = 'msee-math-aptitude-test-v1';
      const examDocRef = db.doc(`artifacts/${appId}/public/data/exams/${examId}`);
      const docSnap = await examDocRef.get();
      if (docSnap.exists) {
        const examData = docSnap.data();
        if (examData) {
            const parsedQuestions = JSON.parse(examData.questions as string);
            onLoadExam(parsedQuestions);
            setMessage(`Exam "${examData.name}" is now the default for student view.`);
            setMessageType('success');
        } else {
             throw new Error("Exam data is empty.");
        }
      } else {
        throw new Error("Exam not found.");
      }
    } catch (error: any) {
      onLoadExam(defaultQuestions);
      setMessage(`Error loading exam: ${error.message}. Default questions loaded.`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }, [db, onLoadExam]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-b-4" style={{ borderColor: COLORS.aucdtGold }}>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: COLORS.aucdtDeepBrown }}>Admin Dashboard</h1>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={onViewAsStudent} className="py-2 px-4 rounded-lg font-bold inline-flex items-center text-sm" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}><Eye className="mr-2" size={16} /> Student View</button>
            <button onClick={onSignOut} className="py-2 px-4 rounded-lg font-bold inline-flex items-center text-sm" style={{ backgroundColor: COLORS.aucdtRed, color: COLORS.aucdtWhite }}><LogOut className="mr-2" size={16} /> Sign Out</button>
          </div>
        </div>
        
        {message && <Message text={message} type={messageType} onDismiss={() => setMessage('')} />}

        <div className="space-y-8">
            {/* Question Generation Section */}
            <div className="p-6 rounded-lg shadow-sm" style={{ backgroundColor: COLORS.aucdtLightGreen }}>
                <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>1. Generate Exam from Text</h3>
                <textarea className="w-full p-3 border rounded-lg" rows={8} placeholder="Paste your exam text here..." value={pdfContentInput} onChange={(e) => setPdfContentInput(e.target.value)} style={{ borderColor: COLORS.aucdtGreen }}></textarea>
                <button onClick={handleProcessText} disabled={isLoading} className="mt-4 w-full py-3 px-6 rounded-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtGold, color: COLORS.aucdtWhite }}>
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                    <span>{isLoading ? 'Processing...' : 'Generate Questions'}</span>
                </button>
            </div>
            
            {/* Preview and Save Section */}
            {generatedQuestions.length > 0 && (
                <div className="p-6 rounded-lg shadow-sm bg-white">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>2. Preview and Save Generated Exam</h3>
                    <input type="text" placeholder="Enter new exam name" className="w-full p-3 border rounded-lg" value={examName} onChange={(e) => setExamName(e.target.value)} style={{ borderColor: COLORS.aucdtGreen }} />
                    <button onClick={handleSaveExam} disabled={isLoading || !examName.trim()} className="mt-4 w-full py-3 px-6 rounded-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        <span>{isLoading ? 'Saving...' : 'Save New Exam'}</span>
                    </button>
                </div>
            )}
            
            {/* Load Existing Exams Section */}
            <div className="p-6 rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>3. Load Existing Exam for Students</h3>
                {isLoading && !availableExams.length ? <Loader message="Fetching exams..."/> :
                  availableExams.length === 0 ? <p style={{ color: COLORS.aucdtDarkGray }}>No exams found in the database.</p> : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {availableExams.map(exam => (
                            <li key={exam.id} className="flex justify-between items-center p-3 border rounded-lg" style={{ borderColor: COLORS.aucdtLightGreen }}>
                                <span className="font-medium" style={{ color: COLORS.aucdtDarkGray }}>{exam.name}</span>
                                <button onClick={() => handleLoadExam(exam.id)} disabled={isLoading || selectedExamId === exam.id} className="py-2 px-4 rounded-lg text-sm font-bold shadow-sm transition-colors" style={{ backgroundColor: selectedExamId === exam.id ? COLORS.aucdtDeepBrown : COLORS.aucdtGold, color: COLORS.aucdtWhite }}>
                                    {selectedExamId === exam.id ? 'Loaded' : 'Load'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};