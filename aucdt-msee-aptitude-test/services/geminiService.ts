import { Question } from '../types';
import { apiUrl } from './apiBase';

export const generateQuestionsFromText = async (text: string, count: number, subject: string, token: string): Promise<Question[]> => {
  
  try {
    const response = await fetch(apiUrl('/api/generate'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text, count, subject }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unexpected server error occurred.' }));
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const generatedQuestions: Omit<Question, 'id'>[] = await response.json();
    
    return generatedQuestions.map((q, index) => ({
      ...q,
      id: `gen-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error fetching questions from local server:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate questions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
};