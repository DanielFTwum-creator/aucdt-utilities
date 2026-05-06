
import React, { useState, useCallback } from 'react';
import { getCodeReview } from './services/geminiService';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { ReviewDisplay } from './components/ReviewDisplay';
import { PROGRAMMING_LANGUAGES } from './constants';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(PROGRAMMING_LANGUAGES[0]);
  const [review, setReview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }
    setError('');
    setReview('');
    setIsLoading(true);
    try {
      const result = await getCodeReview(code, language);
      setReview(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get code review. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:p-6 max-w-screen-2xl mx-auto w-full">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          onReview={handleReview}
          isLoading={isLoading}
        />
        <ReviewDisplay
          review={review}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
