import React, { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import { srsContent } from './srsContent';
import { MessageBoxState } from './types';
import { extractEmailsFromPdf } from './services/pdfExtractor';
import { extractInvoiceDataAsCsv } from './services/invoiceExtractor';
import Header from './components/Header';
import ExtractionModeSelector, { ExtractionMode } from './components/ExtractionModeSelector';
import FileUpload from './components/FileUpload';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';
import MessageBox from './components/MessageBox';
import { useLogout } from './src/AuthGate';

const App: React.FC = () => {
    const handleLogout = useLogout();
    const [fileInfo, setFileInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [error, setError] = useState('');
    const [extractedEmails, setExtractedEmails] = useState<string[]>([]);
    const [csvData, setCsvData] = useState<string>('');
    const [showResults, setShowResults] = useState(false);
    const [extractionMode, setExtractionMode] = useState<ExtractionMode>('emails');
    const [messageBox, setMessageBox] = useState<MessageBoxState>({
        visible: false,
        title: '',
        content: '',
        isError: false,
    });

    const showCustomMessageBox = (title: string, content: string, isError: boolean = false) => {
        setMessageBox({ visible: true, title, content, isError });
    };

    const hideCustomMessageBox = () => {
        setMessageBox({ visible: false, title: '', content: '', isError: false });
    };
    
    const onProgress = useCallback((message: string) => {
        setProgressMessage(message);
    }, []);

    const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileInfo(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        setLoading(true);
        setError('');
        setProgressMessage('Preparing to process...');
        setShowResults(false);
        setExtractedEmails([]);
        setCsvData('');

        try {
            if (extractionMode === 'emails') {
                const emails = await extractEmailsFromPdf(file, onProgress);
                setExtractedEmails(emails);
                if (emails.length > 0) {
                    setShowResults(true);
                } else {
                    showCustomMessageBox('No Emails Found', 'We couldn\'t find any email addresses in this PDF.');
                }
            } else { // 'invoice' mode
                const csv = await extractInvoiceDataAsCsv(file, onProgress);
                setCsvData(csv);
                if (csv) {
                    setShowResults(true);
                } else {
                    // This case is for when the extractor returns empty string but no error, which is unlikely with the new logic.
                    showCustomMessageBox('No Invoice Data Found', 'We couldn\'t extract structured invoice data from this PDF.');
                }
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError('Error processing PDF: ' + errorMessage);
            showCustomMessageBox('Processing Error', `Failed to process the PDF. ${errorMessage}`, true);
        } finally {
            setLoading(false);
            setProgressMessage('');
        }
    }, [extractionMode, onProgress]);
    
    const handleDownloadSrs = (event: React.MouseEvent) => {
        event.preventDefault();
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Software Requirements Specification", 105, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text("for OmniExtract", 105, 30, { align: 'center' });
        
        const splitText = doc.splitTextToSize(srsContent, 180);
        
        doc.setFontSize(10);
        doc.text(splitText, 15, 50);
        
        doc.save('OmniExtract_SRS_v1.0.pdf');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans relative">
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 text-sm bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded shadow-md transition-colors"
            >
                Sign Out
            </button>
            <div className="w-full max-w-3xl mx-auto">
                <Header />
                <main className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700">
                    <ExtractionModeSelector mode={extractionMode} onModeChange={setExtractionMode} />
                    <FileUpload onFileSelect={handleFileSelect} fileInfo={fileInfo} />

                    {loading && (
                        <div className="mt-8 text-center">
                            <LoadingSpinner />
                            <p className="mt-4 text-lg text-blue-300 animate-pulse">
                                {progressMessage || (extractionMode === 'invoice' ? 'Analyzing document with AI...' : 'Extracting emails...')}
                            </p>
                        </div>
                    )}

                    {error && !loading && !messageBox.visible && (
                        <div className="mt-6 text-center text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700">
                            {error}
                        </div>
                    )}

                    {showResults && !loading && (
                        <ResultsDisplay
                            mode={extractionMode}
                            emails={extractedEmails}
                            csvData={csvData}
                        />
                    )}
                </main>
                <footer className="text-center mt-8 text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} OmniExtract. All rights reserved.</p>
                    <p className="mt-2">
                        <button
                            type="button"
                            onClick={handleDownloadSrs}
                            className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                        >
                            Download SRS Document
                        </button>
                    </p>
                </footer>
            </div>

            {messageBox.visible && (
                <MessageBox
                    title={messageBox.title}
                    content={messageBox.content}
                    isError={messageBox.isError}
                    onClose={hideCustomMessageBox}
                />
            )}
        </div>
    );
};

export default App;