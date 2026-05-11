import React, { useState } from 'react';
import { LogOut, UploadCloud, Save, Loader2 } from 'lucide-react';
import { generateQuestionsFromText } from '../services/geminiService';
import { AUCDT_COLORS, EXAM_SUBJECTS } from '../constants';
import { Question, Message, User } from '../types';
import { logEvent } from '../services/auditLogService';
import { MessageDisplay, LatexRenderer, ConfirmationModal } from './common';

interface AdminViewProps {
  user: User;
  token: string;
  handleSignOut: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ user, token, handleSignOut }) => {
  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const [subject, setSubject] = useState<string>(EXAM_SUBJECTS[0]);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleGenerateQuestions = () => {
    if (!pdfContent) {
      setMessage({ text: "Please paste text content to generate questions from.", type: 'error' });
      return;
    }
    setIsGenerateModalOpen(true);
  };
  
  const confirmGenerateQuestions = async () => {
    setIsGenerateModalOpen(false);
    setIsLoading(true);
    setMessage({ text: "Generating questions with AI... Please wait.", type: 'info' });
    try {
      const questions = await generateQuestionsFromText(pdfContent, 24, subject, token);
      setGeneratedQuestions(questions);
      setMessage({ text: `Successfully generated ${questions.length} questions for the subject "${subject}". Review them below before saving.`, type: 'success' });
      logEvent('EXAM_QUESTIONS_GENERATED', { subject, questionCount: questions.length, sourceTextLength: pdfContent.length });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setMessage({ text: `Error: ${errorMessage}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExam = () => {
    if (!examName || !examDescription || generatedQuestions.length === 0) {
        setMessage({ text: "Exam name, description, and generated questions are required before saving.", type: 'error' });
        return;
    }
    setIsSaveModalOpen(true);
  };

  const confirmSaveExam = async () => {
    setIsSaveModalOpen(false);
    setIsLoading(true);
    setMessage({ text: "Saving exam to the database...", type: 'info' });
    try {
        const response = await fetch('/api/exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: examName,
                description: examDescription,
                subject: subject,
                questions: generatedQuestions,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save exam.');
        }

        setMessage({ text: "Exam saved successfully!", type: 'success' });
        logEvent('EXAM_SAVED', { examName, subject });
        setExamName('');
        setExamDescription('');
        setPdfContent('');
        setGeneratedQuestions([]);
    } catch (error) {
        console.error("Error saving exam:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setMessage({ text: `Failed to save exam: ${errorMessage}`, type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <ConfirmationModal
            isOpen={isGenerateModalOpen}
            title="Confirm Generation"
            message="Are you sure you want to generate new questions? This will replace any questions currently displayed."
            onConfirm={confirmGenerateQuestions}
            onCancel={() => setIsGenerateModalOpen(false)}
        />
        <ConfirmationModal
            isOpen={isSaveModalOpen}
            title="Confirm Save Exam"
            message="Are you sure you want to save this exam? It will become available to all students."
            onConfirm={confirmSaveExam}
            onCancel={() => setIsSaveModalOpen(false)}
        />
      <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-6 mb-6 border-b-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--primary-text-color)' }}>Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <p className="font-semibold" style={{ color: 'var(--primary-text-color)' }}>{user.email}</p>
            <button onClick={handleSignOut} className="py-2 px-4 rounded-lg font-bold inline-flex items-center" style={{ backgroundColor: AUCDT_COLORS.red, color: AUCDT_COLORS.white }}>
              <LogOut className="mr-2" size={16} /> Sign Out
            </button>
          </div>
        </div>

        <MessageDisplay message={message} />

        <div className="space-y-6">
            <div>
                <label htmlFor="subject-select" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Select Subject</label>
                <select
                    id="subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                >
                    {EXAM_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="content" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Paste Content to Generate Exam</label>
                <textarea
                    id="content"
                    value={pdfContent}
                    onChange={(e) => setPdfContent(e.target.value)}
                    placeholder="Paste text from a PDF or any source document here..."
                    rows={10}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-aucGold bg-[var(--input-background)] border-[var(--input-border)]"
                />
            </div>

            <button onClick={handleGenerateQuestions} disabled={isLoading} className="w-full py-3 px-6 rounded-lg text-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-[var(--button-disabled-opacity)]" style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
                <span>{isLoading ? 'Generating...' : 'Generate Questions with AI'}</span>
            </button>

            {generatedQuestions.length > 0 && (
                <div className="space-y-4 p-4 border-t-2 mt-6" style={{borderColor: AUCDT_COLORS.gold}}>
                    <h2 className="text-2xl font-bold" style={{color: 'var(--primary-text-color)'}}>Generated Questions for "{subject}"</h2>
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor="examName" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Exam Name</label>
                            <input
                                type="text"
                                id="examName"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                placeholder={`e.g., ${subject} Practice Test 1`}
                                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                            />
                        </div>
                        <div>
                            <label htmlFor="examDescription" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Exam Description</label>
                            <textarea
                                id="examDescription"
                                value={examDescription}
                                onChange={(e) => setExamDescription(e.target.value)}
                                placeholder="e.g., A comprehensive test covering topics from the first semester."
                                rows={3}
                                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-[var(--background-color)] rounded-lg">
                        {generatedQuestions.map((q, i) => (
                            <div key={q.id} className="p-2 border-b border-[var(--card-border-color)]">
                                <p><strong>Q{i+1}:</strong> <LatexRenderer>{q.question}</LatexRenderer></p>
                                <ul className="list-disc list-inside pl-4">
                                    {q.options.map((opt, j) => (
                                        <li key={j} className={j === q.correct ? 'font-bold text-green-500' : ''}>
                                            <LatexRenderer>{opt}</LatexRenderer>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                     <button onClick={handleSaveExam} disabled={isLoading || !examName || !examDescription} className="w-full py-3 px-6 rounded-lg text-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-[var(--button-disabled-opacity)]" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                        <span>Save Exam</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};