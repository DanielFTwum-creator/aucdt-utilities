
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';
import { CopyIcon, CheckIcon, ExclamationIcon } from './ui/icons';

interface OutputDisplayProps {
  description: string;
  isLoading: boolean;
  error: string | null;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ description, isLoading, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (description) {
      setIsCopied(false);
    }
  }, [description]);

  const handleCopy = () => {
    if (description) {
      navigator.clipboard.writeText(description);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
        <h2 className="text-2xl font-bold text-white">Generated Description</h2>
        {description && (
          <Button onClick={handleCopy} variant="secondary" size="sm" disabled={isCopied}>
            {isCopied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        )}
      </div>

      <div className="relative w-full h-full min-h-[500px] lg:min-h-0 lg:h-[calc(100%-4rem)]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/50 rounded-lg">
            <Spinner />
            <p className="mt-4 text-gray-300">AI is crafting your description...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-red-400 p-4">
            <ExclamationIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold">Something went wrong</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && !description && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 p-4">
             <p className="text-lg">Your generated description will appear here.</p>
             <p className="mt-2">Fill out the form and click "Generate" to start.</p>
          </div>
        )}
        
        {description && (
          <div className="prose prose-invert prose-sm max-w-none w-full h-full overflow-y-auto rounded-lg bg-gray-900 p-4 whitespace-pre-wrap font-mono">
            {description}
          </div>
        )}
      </div>
    </Card>
  );
};
