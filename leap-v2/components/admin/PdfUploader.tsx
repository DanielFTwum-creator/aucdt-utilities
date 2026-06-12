
import React, { useState, useContext, ChangeEvent } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { extractCurriculumFromPdfText } from '../../services/geminiService';
import { Modal } from '../shared/Modal';
import type { AppContextType, Curriculum } from '../../types';

declare const pdfjsLib: any;

export const PdfUploader: React.FC = () => {
    const { updateCurriculum, addAuditLog } = useContext(AppContext) as AppContextType;
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadConfirmation = () => {
        if (file) {
            setIsModalOpen(true);
        }
    };

    const processPdf = async (fileToProcess: File) => {
        setStatus('processing');
        setError('');
        
        try {
            const arrayBuffer = await fileToProcess.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const numPages = pdf.numPages;
            let fullText = '';
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }

            if (!fullText.trim()) {
                throw new Error("Could not extract any text from the PDF. It might be an image-based PDF.");
            }

            const curriculumData: Curriculum = await extractCurriculumFromPdfText(fullText);
            
            updateCurriculum(curriculumData);
            setStatus('success');
            setFile(null);

        } catch (err: any) {
            console.error("PDF processing failed:", err);
            setError(err.message || "An unknown error occurred during processing.");
            setStatus('error');
            addAuditLog('Curriculum Update Failed', err.message);
        }
    };

    const handleProceedUpload = () => {
        setIsModalOpen(false);
        if (file) {
            processPdf(file);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">AI-Powered Curriculum Management</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Upload a university timetable PDF. The system will use AI to extract and structure the curriculum data, replacing the current in-memory data.</p>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input type="file" id="pdf-upload" className="hidden" accept=".pdf" onChange={handleFileChange} />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {file ? `Selected: ${file.name}` : 'Click to select a PDF file'}
                    </p>
                </label>
            </div>
            
            {file && (
                <div className="mt-6 text-center">
                    <button onClick={handleUploadConfirmation} disabled={status === 'processing'} className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        {status === 'processing' ? 'Processing...' : 'Upload & Process'}
                    </button>
                </div>
            )}

            {status === 'processing' && (
                <div className="mt-4 text-center">
                    <p>Extracting text and calling Gemini API... This may take a moment.</p>
                </div>
            )}
            {status === 'success' && (
                <div className="mt-4 text-center p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                    Curriculum data successfully updated!
                </div>
            )}
            {status === 'error' && (
                <div className="mt-4 text-center p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Curriculum Update"
                primaryAction={handleProceedUpload}
                primaryActionLabel="Proceed"
                secondaryAction={() => setIsModalOpen(false)}
                secondaryActionLabel="Cancel"
            >
                <p className="text-gray-600 dark:text-gray-300">
                    This action will replace the existing curriculum and clear all current evaluation data for this session. Are you sure you want to continue?
                </p>
            </Modal>
        </div>
    );
};
