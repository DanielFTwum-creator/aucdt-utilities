import React, { useState, useEffect } from 'react';
import { getQuizQuestionCount as getQuizCountFromDB, setQuizQuestionCount as setQuizCountToDB } from '../../lib/db';

export const QuizSettings: React.FC = () => {
    const [questionCount, setQuestionCount] = useState<number>(5);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadQuizCount = async () => {
            try {
                const count = await getQuizCountFromDB();
                setQuestionCount(count);
            } catch (error) {
                console.error('Failed to load quiz question count:', error);
            }
        };
        loadQuizCount();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await setQuizCountToDB(questionCount);
            setMessage(`Default quiz question count saved as ${questionCount}.`);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage("Failed to save quiz settings.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Quiz Settings</h2>
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
                <div>
                    <label htmlFor="quiz-question-count" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Default Number of Questions</label>
                    <input 
                        type="number" 
                        id="quiz-question-count" 
                        value={questionCount} 
                        onChange={e => setQuestionCount(parseInt(e.target.value, 10) || 1)}
                        min="1"
                        max="20"
                        required 
                        className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200" 
                    />
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Set the default number of questions for quizzes (1-20).</p>
                </div>
                
                {message && (
                    <div className="p-3 rounded-md text-sm bg-green-500/20 text-[var(--color-success)]">
                        {message}
                    </div>
                )}
                
                <div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-2.5 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)] transition disabled:bg-[var(--color-text-tertiary)] disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};