
import React from 'react';

interface MessageBoxProps {
    title: string;
    content: string;
    isError: boolean;
    onClose: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ title, content, isError, onClose }) => {
    const titleColor = isError ? 'text-red-400' : 'text-blue-300';
    const buttonColor = isError
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-95 hover:scale-100 duration-300">
                <h3 className={`text-2xl font-bold mb-4 ${titleColor}`}>{title}</h3>
                <p className="text-gray-300 mb-6">{content}</p>
                <button
                    onClick={onClose}
                    className={`w-full px-4 py-2.5 font-semibold text-white rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${buttonColor}`}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default MessageBox;
