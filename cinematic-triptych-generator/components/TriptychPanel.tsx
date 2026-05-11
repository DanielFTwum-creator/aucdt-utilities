
import React from 'react';
import { GenerateIcon } from './Icons';
import Spinner from './Spinner';

interface TriptychPanelProps {
    title: string;
    description: string;
    imageUrl: string | null;
    isLoading: boolean;
    onGenerate: () => void;
}

const TriptychPanel: React.FC<TriptychPanelProps> = ({ title, description, imageUrl, isLoading, onGenerate }) => {
    return (
        <div className="flex h-full flex-col rounded-lg border border-stone-800 bg-stone-900 shadow-2xl shadow-black/20">
            <div className="relative aspect-[1/1] w-full overflow-hidden rounded-t-lg bg-stone-800">
                {isLoading && <Spinner />}
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-stone-500">{title}</span>
                    </div>
                )}
            </div>
            <div className="flex flex-grow flex-col p-6">
                <h3 className="mb-2 text-xl font-bold text-amber-500">{title}</h3>
                <p className="mb-4 flex-grow text-sm text-stone-300">{description}</p>
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="mt-auto inline-flex w-full items-center justify-center rounded-md bg-amber-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
                >
                    <GenerateIcon />
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
        </div>
    );
};

export default TriptychPanel;
