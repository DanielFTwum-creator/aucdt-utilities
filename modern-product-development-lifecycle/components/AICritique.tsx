import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { LightBulbIcon } from './icons';
import { Stage, StageProgress } from '../types';

interface AICritiqueProps {
    stage: Stage;
    progress: StageProgress;
    projectName: string;
}

const AICritique: React.FC<AICritiqueProps> = ({ stage, progress, projectName }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [critique, setCritique] = useState<string | null>(null);

    const handleGetCritique = async () => {
        setLoading(true);
        setError(null);
        setCritique(null);

        // Collate all notes for the current stage
        const userNotes = stage.content.points.map((point, index) => {
            const pointProgress = progress[index];
            if (pointProgress && pointProgress.notes.trim()) {
                return `- Regarding "${point.title}": ${pointProgress.notes}`;
            }
            return null;
        }).filter(Boolean).join('\n');

        if (!userNotes) {
            setError("You haven't written any notes for this stage yet. Add some notes to get a critique.");
            setLoading(false);
            return;
        }

        const prompt = `
            As a product design professor, provide a constructive critique for a student working on a project called "${projectName || 'this new product'}".
            The student is currently in the "${stage.title}" stage of the product development lifecycle.

            This stage is about: ${stage.content.description}.

            Here are the student's notes for this stage:
            ${userNotes}

            Based on these notes, provide supportive, inspiring, and coherent feedback. Your critique should:
            1.  Acknowledge their work and thought process positively.
            2.  Identify potential blind spots or areas that need more detail.
            3.  Ask probing questions to encourage deeper thinking.
            4.  Offer actionable suggestions or next steps relevant to this specific stage.
            Keep the tone encouraging and academic. Format the response using markdown.
        `;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            const text = response.text;
            if (text) {
                setCritique(text);
            } else {
                throw new Error("Received an empty response from the AI. It might be a content safety block.");
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50 pt-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white hc:text-yellow-300 mb-2 flex items-center gap-2">
                <LightBulbIcon className="w-6 h-6 text-amber-500 dark:text-amber-400 hc:text-yellow-300" />
                Feedback & Critique
            </h3>
            <p className="text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mb-6">Once you've added notes to the points above, use our AI assistant to get constructive feedback and identify areas for improvement.</p>
            
            <button
                onClick={handleGetCritique}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hc:bg-yellow-300 hc:text-black hc:hover:bg-yellow-400"
                disabled={loading}
            >
                {loading ? 'Analyzing...' : 'Get AI Critique'}
            </button>

            {error && <p role="alert" className="mt-4 text-red-500 dark:text-red-400 hc:text-red-400">{error}</p>}

            <div className="mt-6">
                {loading && (
                     <div className="w-full p-6 bg-slate-100 dark:bg-slate-800/50 hc:bg-black hc:border hc:border-yellow-300/50 rounded-lg animate-pulse">
                        <div className="h-4 bg-slate-300 dark:bg-slate-700 hc:bg-yellow-300/20 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-slate-300 dark:bg-slate-700 hc:bg-yellow-300/20 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-slate-300 dark:bg-slate-700 hc:bg-yellow-300/20 rounded w-5/6"></div>
                    </div>
                )}
                {critique && (
                    <div className="p-4 md:p-6 bg-slate-100 dark:bg-slate-800/70 hc:bg-black rounded-xl border border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50">
                        <div className="prose prose-lg max-w-none text-slate-800 dark:text-slate-300 hc:text-yellow-300/90" dangerouslySetInnerHTML={{ __html: critique.replace(/\n/g, '<br />') }}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AICritique;