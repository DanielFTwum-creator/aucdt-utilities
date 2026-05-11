
import React, { useState, useCallback } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { UploadIcon, SpinnerIcon, CheckCircleIcon } from './icons';
import { extractDataFromPdfText } from '../services/geminiService';
import type { Course, Lecturer } from '../types';
import { ADD_LOG, UPDATE_CURRICULUM } from '../hooks/actions';

const PdfExtractor: React.FC = () => {
    const { state, dispatch } = useAppStore();
    const [programmeId, setProgrammeId] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<{ lecturers: {name: string}[], courses: {name: string, year: number, semester: number}[] } | null>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setFile(files[0]);
            setError(null);
            setExtractedData(null);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleFileChange(event.dataTransfer.files);
    }, []);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };


    const processPdf = async () => {
        if (!file || !programmeId) {
            setError("Please select a programme and a PDF file.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setExtractedData(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (window as any).pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map((item: any) => item.str).join(' ');
            }
            
            const programmeName = state.programmes.find(p => p.id === programmeId)?.name || '';
            const data = await extractDataFromPdfText(fullText, programmeName);
            setExtractedData(data);
             dispatch({ type: ADD_LOG, payload: { action: 'PDF Processed', message: `Extracted data for ${programmeName} from ${file.name}.` }});

        } catch (e: any) {
            setError(e.message || "An unknown error occurred during PDF processing.");
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const saveData = () => {
        if (!extractedData || !programmeId) return;
        dispatch({
            type: UPDATE_CURRICULUM,
            payload: {
                programmeId,
                ...extractedData
            }
        });
        dispatch({ type: ADD_LOG, payload: { action: 'Curriculum Updated', message: `Saved new data for programme ID ${programmeId}.` }});
        setExtractedData(null);
        setFile(null);
        setProgrammeId('');
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="programme-pdf" className="block text-sm font-medium text-brand-text-primary/90">Select Programme to Update</label>
                <select id="programme-pdf" value={programmeId} onChange={e => setProgrammeId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                    <option value="">-- Select Programme --</option>
                    {state.programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            
            <div onDrop={handleDrop} onDragOver={handleDragOver} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => handleFileChange(e.target.files)} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    {file && <p className="text-sm font-semibold text-green-600 pt-2">{file.name}</p>}
                </div>
            </div>

            <button onClick={processPdf} disabled={!file || !programmeId || isProcessing}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-text-light bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400">
                {isProcessing ? <SpinnerIcon className="h-5 w-5 mr-2" /> : <CheckCircleIcon className="h-5 w-5 mr-2" />}
                {isProcessing ? 'Processing with AI...' : 'Extract Data from PDF'}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {extractedData && (
                <div className="mt-6 p-4 bg-brand-background rounded-lg animate-fade-in">
                    <h3 className="text-lg font-semibold mb-2">Review Extracted Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                        <div>
                            <h4 className="font-bold">Lecturers ({extractedData.lecturers.length})</h4>
                            <ul className="list-disc pl-5 text-sm">
                                {extractedData.lecturers.map((l, i) => <li key={i}>{l.name}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold">Courses ({extractedData.courses.length})</h4>
                             <ul className="list-disc pl-5 text-sm">
                                {extractedData.courses.map((c, i) => <li key={i}>{c.name} (Year {c.year}, Sem {c.semester})</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button onClick={saveData} className="flex-1 bg-brand-accent text-brand-text-light px-4 py-2 rounded-md hover:opacity-90">Save to System</button>
                        <button onClick={() => setExtractedData(null)} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Discard</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdfExtractor;