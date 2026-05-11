import React from 'react';

interface ErrorMessageProps {
    error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center mb-6" role="alert">
            <p className="font-bold">Oops! Something went wrong.</p>
            <p className="text-sm">{error}</p>
        </div>
    );
};

export default ErrorMessage;

