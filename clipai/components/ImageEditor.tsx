import React, { useState } from 'react';
import { SparkleIcon, ResetIcon } from '../constants';

interface ImageEditorProps {
    onEdit: (prompt: string) => Promise<void>;
    onRevert: () => void;
    isEditing: boolean;
    isRevertable: boolean;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ onEdit, onRevert, isEditing, isRevertable }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onEdit(prompt.trim());
        }
    };

    return (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700" role="region" aria-labelledby="step1-5-heading">
            <h2 id="step1-5-heading" className="text-lg font-semibold text-gray-900 dark:text-white hc-text">
                Step 1.5: Edit with AI <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">
                Use a text prompt to modify your image or the current video frame. The result will be a static image.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your edit..."
                    className="hc-bg hc-border hc-text hc-placeholder block w-full h-20 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm resize-y"
                    disabled={isEditing}
                    title="Describe how you want to edit the media"
                    aria-label="Media editing prompt"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        type="submit"
                        disabled={isEditing || !prompt.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Generate edit from your description"
                    >
                        {isEditing ? (
                            <div className="spinner h-5 w-5 border-2 rounded-full" />
                        ) : (
                            <SparkleIcon className="h-5 w-5" />
                        )}
                        <span>{isEditing ? 'Generating...' : 'Generate Edit'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onRevert}
                        disabled={isEditing || !isRevertable}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Revert all AI edits and restore the original media"
                    >
                        <ResetIcon className="h-5 w-5" />
                        <span>Revert to Original</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ImageEditor;