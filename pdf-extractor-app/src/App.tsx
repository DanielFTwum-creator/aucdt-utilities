import React, { useState, useEffect } from 'react';
import './App.css'; // Importing the CSS file

// pdfjsLib will be dynamically loaded, so no 'declare const' is needed here.

function App() {
    // State variables to manage the application's UI and data
    const [fileInfo, setFileInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [extractedEmails, setExtractedEmails] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [messageBox, setMessageBox] = useState({
        visible: false,
        title: '',
        content: '',
    });
    // State to track if pdfjsLib is loaded and ready
    const [isPdfjsLoaded, setIsPdfjsLoaded] = useState(false);

    // useEffect hook to dynamically load PDF.js script and configure its worker.
    useEffect(() => {
        // Function to load a script dynamically
        const loadScript = (url, id, callback) => {
            if (document.getElementById(id)) {
                // If script already exists and typeof window.pdfjsLib is defined, it's already loaded
                if (typeof window.pdfjsLib !== 'undefined') {
                    callback();
                }
                return;
            }

            const script = document.createElement('script');
            script.src = url;
            script.id = id;
            script.async = true;
            script.onload = () => {
                // Once pdf.min.js is loaded, set the worker source
                if (typeof window.pdfjsLib !== 'undefined') {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    callback(); // Notify that PDF.js is fully ready
                }
            };
            script.onerror = () => {
                setError('Failed to load PDF.js library. Please check your internet connection.');
            };
            document.head.appendChild(script);
        };

        // Dynamically load pdf.min.js
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'pdfjs-script', () => {
            setIsPdfjsLoaded(true); // Set state to true when PDF.js is fully ready
        });

    }, []); // Empty dependency array ensures this runs once on mount

    // Function to display a custom modal message box.
    const showCustomMessageBox = (title, content) => {
        setMessageBox({ visible: true, title, content });
    };

    // Function to hide the custom modal message box.
    const hideCustomMessageBox = () => {
        setMessageBox({ visible: false, title: '', content: '' });
    };

    // Handler for file input change.
    // Updates selected file info and triggers email extraction.
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileInfo(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        extractEmails(file);
    };

    // Asynchronous function to extract emails from the provided PDF file.
    // Uses PDF.js to read text content and regex to find emails.
    const extractEmails = async (file) => {
        setLoading(true); // Show loading spinner
        setError(''); // Clear previous errors
        setShowResults(false); // Hide previous results
        setExtractedEmails([]); // Clear extracted emails

        try {
            // Ensure pdfjsLib is available before attempting to use it
            if (!isPdfjsLoaded || typeof window.pdfjsLib === 'undefined') {
                throw new Error("PDF.js library is not ready. Please wait a moment or refresh the page.");
            }

            const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
            // Access pdfjsLib via window object
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise; // Load PDF document

            let allText = '';
            // Loop through all pages to extract text content
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item) => item.str).join(' ');
                allText += pageText + ' ';
            }

            // Regular expression to match email addresses.
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
            const emails = allText.match(emailRegex) || [];

            // Remove duplicate emails and sort them alphabetically.
            const uniqueEmails = [...new Set(emails.map((email) => email.toLowerCase()))].sort();
            setExtractedEmails(uniqueEmails);

            setLoading(false); // Hide loading spinner

            // Display results or a message if no emails are found.
            if (uniqueEmails.length > 0) {
                setShowResults(true);
            } else {
                showCustomMessageBox('No Emails Found', 'No email addresses were found in the PDF file.');
            }
        } catch (err) {
            setLoading(false); // Hide loading spinner on error
            setError('Error processing PDF: ' + err.message + '. Please ensure it is a valid PDF file and try again.');
        }
    };

    // Function to copy text to the clipboard.
    // Includes a fallback for environments where navigator.clipboard might not be available.
    const copyToClipboard = async (text, event, successMessage = 'Copied!') => {
        const targetElement = event.currentTarget; // Get the element that triggered the event

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                applyCopyFeedback(targetElement, successMessage); // Apply visual feedback
            } catch (err) {
                console.error('Failed to copy using navigator.clipboard: ', err);
                fallbackCopyToClipboard(text, targetElement, successMessage); // Use fallback
            }
        } else {
            fallbackCopyToClipboard(text, targetElement, successMessage); // Use fallback
        }
    };

    // Fallback function for copying text to clipboard using document.execCommand.
    const fallbackCopyToClipboard = (text, targetElement, successMessage) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Prevents scrolling
        textArea.style.left = '-9999px'; // Hides the textarea off-screen
        document.body.appendChild(textArea);
        textArea.select(); // Select the text
        try {
            const successful = document.execCommand('copy'); // Execute copy command
            if (successful) {
                applyCopyFeedback(targetElement, successMessage);
            } else {
                showCustomMessageBox('Copy Failed', 'Unable to copy text. Please try manually selecting and copying.');
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            showCustomMessageBox('Copy Failed', 'Unable to copy text. Your browser may not support this function.');
        }
        document.body.removeChild(textArea); // Clean up the textarea
    };

    // Applies visual feedback to an element (e.g., button) after a successful copy operation.
    const applyCopyFeedback = (element, message) => {
        const originalText = element.textContent;
        const originalBackground = element.style.background;

        element.textContent = '✓ ' + message.split(' ')[0]; // Change text to "✓ Copied!"
        element.style.background = 'linear-gradient(135deg, #228B22 0%, #3CB371 100%)'; // Change background to green

        setTimeout(() => {
            element.textContent = originalText; // Restore original text
            element.style.background = originalBackground; // Restore original background
        }, 1500); // Revert after 1.5 seconds
    };

    // Function to download the extracted emails as a TXT file.
    const downloadEmails = () => {
        if (extractedEmails.length === 0) {
            showCustomMessageBox('No Emails to Download', 'There are no email addresses extracted to download. Please upload a PDF first.');
            return;
        }

        try {
            const content = extractedEmails.join('\n'); // Join emails with newlines
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob); // Create a URL for the Blob

            const a = document.createElement('a');
            a.href = url;
            a.download = 'extracted_unique_emails.txt'; // Set download filename
            a.style.display = 'none'; // Hide the anchor element

            document.body.appendChild(a); // Append to body to make it clickable
            a.click(); // Programmatically click the anchor to trigger download

            // Clean up the URL and element after a short delay
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 200);

            // Apply visual feedback to the download button
            const btn = document.getElementById('downloadBtn');
            if (btn) {
                const originalText = btn.textContent;
                const originalBackground = btn.style.background;
                btn.textContent = '✓ Downloaded!';
                btn.style.background = 'linear-gradient(135deg, #228B22 0%, #3CB371 100%)';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = originalBackground;
                }, 2000);
            }

        } catch (error) {
            console.error('Download failed:', error);
            showCustomMessageBox('Download Failed', 'The download could not be initiated. This might be due to browser security restrictions. Please try copying the emails instead.');
        }
    };

    // Function to copy all extracted emails to the clipboard.
    const copyAllEmails = (event) => {
        if (extractedEmails.length === 0) {
            showCustomMessageBox('No Emails to Copy', 'There are no email addresses extracted to copy. Please upload a PDF first.');
            return;
        }
        const content = extractedEmails.join('\n');
        copyToClipboard(content, event, 'All emails copied to clipboard!');
    };

    return (
        <div className="container">
            <div className="header">
                <h1 className="header-title">📧 PDF Email Extractor</h1>
                <p className="header-subtitle">Extract unique email addresses from PDF documents with ease</p>
            </div>

            <div className="content">
                <div className="upload-section">
                    <div className="file-input-wrapper">
                        {/* Disable input until pdfjsLib is loaded */}
                        <input type="file" id="pdfFile" className="file-input" accept=".pdf" onChange={handleFileSelect} disabled={!isPdfjsLoaded} />
                        <label htmlFor="pdfFile" className="file-input-label" style={!isPdfjsLoaded ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                            {isPdfjsLoaded ? '📄 Choose PDF File' : '⏳ Loading PDF.js...'}
                        </label>
                    </div>
                    {fileInfo && <div className="file-info">{fileInfo}</div>}
                    {!isPdfjsLoaded && (
                        <div className="text-sm text-gray-500 mt-2">
                            Please wait while the PDF processing library loads.
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Processing PDF file...</p>
                    </div>
                )}

                {error && <div className="error">{error}</div>}

                {showResults && (
                    <div className="results">
                        <h2>📋 Extracted Email Addresses</h2>
                        <div className="email-count">Found {extractedEmails.length} unique email address{extractedEmails.length !== 1 ? 'es' : ''}</div>
                        <div className="email-list">
                            {extractedEmails.map((email, index) => (
                                <div key={index} className="email-item" onClick={(event) => copyToClipboard(email, event, 'Email copied!')}>
                                    {email}
                                </div>
                            ))}
                        </div>
                        <div className="download-section">
                            <button className="download-btn" id="downloadBtn" onClick={downloadEmails}>
                                💾 Download as TXT
                            </button>
                            <button className="copy-btn" id="copyBtn" onClick={copyAllEmails}>
                                📋 Copy All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Message Box HTML */}
            {messageBox.visible && (
                <div className="message-box-overlay">
                    <div className="message-box">
                        <h3>{messageBox.title}</h3>
                        <p>{messageBox.content}</p>
                        <button onClick={hideCustomMessageBox}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;