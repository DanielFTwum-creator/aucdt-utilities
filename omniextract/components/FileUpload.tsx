
import React from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileInfo: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileInfo }) => {
    return (
        <div className="text-center border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-blue-400 transition-colors duration-300">
            <div className="flex flex-col items-center">
                 <input
                    type="file"
                    id="pdfFile"
                    className="hidden"
                    accept=".pdf"
                    onChange={onFileSelect}
                />
                <label
                    htmlFor="pdfFile"
                    className="cursor-pointer inline-flex items-center gap-3 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                >
                    <UploadIcon />
                    Choose PDF File
                </label>
                <p className="mt-4 text-sm text-gray-400">or drag and drop it here</p>
            </div>
            {fileInfo && <div className="mt-4 text-sm font-mono text-teal-300 bg-gray-700/50 px-3 py-1 rounded-md">{fileInfo}</div>}
        </div>
    );
};

export default FileUpload;
