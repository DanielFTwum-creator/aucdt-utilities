# omniextract - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for omniextract.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript
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

const App: React.FC = () => {
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
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
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
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_omniextract';
const ACCENT   = '#7c3aed';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Omniextract</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: components/ExtractionModeSelector.tsx
```typescript

import React from 'react';
import { MailIcon, DocumentTextIcon } from './icons';

export type ExtractionMode = 'emails' | 'invoice';

interface ExtractionModeSelectorProps {
    mode: ExtractionMode;
    onModeChange: (mode: ExtractionMode) => void;
}

const ExtractionModeSelector: React.FC<ExtractionModeSelectorProps> = ({ mode, onModeChange }) => {
    const baseClasses = "flex-1 text-center py-3 px-4 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-4";
    const activeClasses = "bg-blue-600 text-white shadow-lg scale-105";
    const inactiveClasses = "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50";
    const ringClasses = "focus:ring-blue-500 focus:ring-opacity-50";

    return (
        <div className="mb-8 p-1.5 bg-gray-900/80 rounded-xl flex w-full max-w-lg mx-auto shadow-inner border border-gray-700">
            <button
                onClick={() => onModeChange('emails')}
                className={`${baseClasses} ${mode === 'emails' ? activeClasses : inactiveClasses} ${ringClasses}`}
                aria-pressed={mode === 'emails'}
            >
                <MailIcon />
                Extract Emails
            </button>
            <button
                onClick={() => onModeChange('invoice')}
                className={`${baseClasses} ${mode === 'invoice' ? activeClasses : inactiveClasses} ${ringClasses}`}
                aria-pressed={mode === 'invoice'}
            >
                <DocumentTextIcon />
                Extract Invoice Data
            </button>
        </div>
    );
};

export default ExtractionModeSelector;
    
```

### FILE: components/FileUpload.tsx
```typescript

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

```

### FILE: components/Header.tsx
```typescript

import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-teal-300 text-transparent bg-clip-text">
                    OmniExtract
                </span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                Unlock data from your PDFs. Extract emails & invoice details with AI precision.
            </p>
        </header>
    );
};

export default Header;

```

### FILE: components/icons.tsx
```typescript

import React from 'react';

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const CopyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
    
```

### FILE: components/LoadingSpinner.tsx
```typescript

import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;

```

### FILE: components/MessageBox.tsx
```typescript

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

```

### FILE: components/ResultsDisplay.tsx
```typescript

import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CopyIcon, DownloadIcon, CheckIcon } from './icons';
import { ExtractionMode } from './ExtractionModeSelector';

interface ResultsDisplayProps {
    mode: ExtractionMode;
    emails: string[];
    csvData: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ mode, emails, csvData }) => {
    const [copyAllToClipboard, hasCopiedAll] = useCopyToClipboard();
    const [downloadClicked, setDownloadClicked] = React.useState(false);

    const isEmailMode = mode === 'emails';
    const data = isEmailMode ? emails.join('\n') : csvData;
    const count = isEmailMode ? emails.length : (csvData.split('\n').filter(Boolean).length);

    const handleDownload = () => {
        if (!data) return;
        
        const blob = new Blob([data], { type: isEmailMode ? 'text/plain;charset=utf-8' : 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = isEmailMode ? 'extracted_emails.txt' : 'extracted_invoice_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setDownloadClicked(true);
        setTimeout(() => setDownloadClicked(false), 2000);
    };
    
    const handleCopyAll = () => {
        if (!data) return;
        copyAllToClipboard(data);
    };

    const title = isEmailMode ? 'Email Extraction Complete' : 'Invoice Data Extracted';
    const countText = isEmailMode
        ? `Found ${count} unique email address${count !== 1 ? 'es' : ''}.`
        : `Successfully extracted ${count} rows of data.`;

    return (
        <div className="mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-teal-300">{title}</h2>
            <div className="text-center mt-2 text-gray-400">
                {countText}
            </div>

            <div className="mt-6 bg-gray-900/70 p-4 rounded-lg max-h-80 overflow-y-auto border border-gray-700 shadow-inner">
                {isEmailMode ? (
                    emails.map((email, index) => <EmailItem key={index} email={email} />)
                ) : (
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{csvData}</pre>
                )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleCopyAll}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
                >
                    {hasCopiedAll ? <CheckIcon /> : <CopyIcon />}
                    {hasCopiedAll ? 'Copied!' : 'Copy All'}
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50"
                >
                    {downloadClicked ? <CheckIcon /> : <DownloadIcon />}
                    {downloadClicked ? 'Downloaded!' : `Download as ${isEmailMode ? 'TXT' : 'CSV'}`}
                </button>
            </div>
        </div>
    );
};

const EmailItem: React.FC<{ email: string }> = ({ email }) => {
    const [copy, copied] = useCopyToClipboard();

    return (
        <div
            onClick={() => copy(email)}
            className="flex justify-between items-center p-3 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 group"
        >
            <span className="font-mono text-blue-300">{email}</span>
            <span className="text-sm font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                {copied ? <CheckIcon className="text-green-400" /> : <CopyIcon className="text-gray-400" />}
            </span>
        </div>
    );
};

export default ResultsDisplay;
    
```

### FILE: CREATION.md
```md
# omniextract

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/omniextract/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/omniextract/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/omniextract/',  // REQUIRED: Assets must load from /omniextract/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/omniextract"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/omniextract">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/omniextract/`, not at the root
- **Asset Loading**: Without `base: '/omniextract/'`, assets try to load from `/assets/` instead of `/omniextract/assets/`
- **Routing**: Without `basename="/omniextract"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/omniextract/assets/index-*.js`
- Link tags should reference: `/omniextract/assets/index-*.css`

If they reference `/assets/` instead of `/omniextract/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/omniextract/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/omniextract/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: omniextract

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — omniextract

**Application:** omniextract
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_omniextract_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — omniextract

**Application:** omniextract
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd omniextract
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build omniextract
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up omniextract
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Omniextract
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Omniextract**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Omniextract** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Omniextract** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — omniextract

**Application:** omniextract
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd omniextract
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: hooks/useCopyToClipboard.ts
```typescript

import { useState, useCallback } from 'react';

/**
 * A custom hook for copying text to the clipboard.
 * @param timeout - The duration in milliseconds to show the copied state.
 * @returns A tuple containing the copy function and a boolean indicating if the text was recently copied.
 */
export const useCopyToClipboard = (timeout = 2000): [(text: string) => void, boolean] => {
    const [hasCopied, setHasCopied] = useState(false);

    const copy = useCallback((text: string) => {
        if (!navigator.clipboard) {
            console.warn('Clipboard API not available');
            // You could implement a fallback here if needed.
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            setHasCopied(true);
            setTimeout(() => {
                setHasCopied(false);
            }, timeout);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setHasCopied(false);
        });
    }, [timeout]);

    return [copy, hasCopied];
};

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Omniextract | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Omniextract | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Omniextract | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">omniextract</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);

```

### FILE: metadata.json
```json

{
  "name": "OmniExtract",
  "description": "Unlock data from your PDFs. This AI-powered tool extracts emails and structured invoice data with precision, turning cluttered documents into clean, usable information.",
  "requestFramePermissions": []
}

```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "omniextract",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@google/genai": "latest",
    "jspdf": "2.5.1",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^22.17.1",
    "serve": "14.2.5",
    "typescript": "~5.8.3",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15UP-zaHznwaXWxkuSQy_-qFIV7InwJNp?showAssistant=true&showCode=true&showTreeView=true&showPreview=true&resourceKey=

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/invoiceExtractor.ts
```typescript
import { GoogleGenAI, Type } from "@google/genai";
import { getTextFromPdf, renderPdfPagesAsImages } from './pdfUtils';

// This function assumes `process.env.API_KEY` is set in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const invoiceSchema = {
    type: Type.OBJECT,
    properties: {
        isInvoice: { 
            type: Type.BOOLEAN, 
            description: "Is the document an invoice or receipt? Responds false if it's not." 
        },
        vendorName: { 
            type: Type.STRING, 
            description: "The name of the business issuing the invoice (e.g., the chemist shop name)." 
        },
        customerName: { 
            type: Type.STRING, 
            description: "The name of the customer. Should be 'N/A' if not present." 
        },
        invoiceId: { 
            type: Type.STRING, 
            description: "The invoice number or ID." 
        },
        issueDate: { 
            type: Type.STRING, 
            description: "The date the invoice was issued." 
        },
        lineItems: {
            type: Type.ARRAY,
            description: "A list of all purchased items or services.",
            items: {
                type: Type.OBJECT,
                properties: {
                    quantity: { type: Type.NUMBER, description: "The quantity of the item." },
                    description: { type: Type.STRING, description: "The description of the item." },
                    unitPrice: { type: Type.NUMBER, description: "The price per unit (Rate)." },
                    total: { type: Type.NUMBER, description: "The total price for the line item (Quantity * Rate)." }
                },
                required: ["quantity", "description", "unitPrice", "total"]
            }
        },
        subtotal: { 
            type: Type.NUMBER, 
            description: "The total amount before discounts or taxes." 
        },
        discount: { 
            type: Type.NUMBER, 
            description: "The total discount amount applied. Should be 0 if not present." 
        },
        grandTotal: { 
            type: Type.NUMBER, 
            description: "The final amount to be paid (e.g., Total To Pay)." 
        },
    },
    required: ["isInvoice", "vendorName", "invoiceId", "issueDate", "lineItems", "subtotal", "grandTotal"]
};

/**
 * Converts an array of invoice JSON objects into a single, well-structured CSV string.
 * @param invoices An array of invoice data objects.
 * @returns A string in CSV format.
 */
const invoicesJsonToCsv = (invoices: any[]): string => {
    if (!invoices || invoices.length === 0) {
        return '';
    }

    let csv = '';

    // Section 1: Invoice Summaries
    csv += 'Invoice Summaries\n';
    const summaryHeaders = ['invoiceId', 'issueDate', 'vendorName', 'customerName', 'subtotal', 'discount', 'grandTotal'];
    // Format headers to Title Case for readability
    const formatHeader = (h: string) => `"${h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}"`;
    csv += summaryHeaders.map(formatHeader).join(',') + '\n';

    invoices.forEach(invoice => {
        csv += summaryHeaders.map(header => {
            const value = invoice[header];
            return `"${value !== null && value !== undefined ? value : ''}"`;
        }).join(',') + '\n';
    });

    csv += '\n\n'; // Add space between sections

    // Section 2: All Line Items, with invoiceId to link back to the summary
    csv += 'All Line Items\n';
    const lineItemHeaders = ['invoiceId', 'quantity', 'description', 'unitPrice', 'total'];
    csv += lineItemHeaders.map(formatHeader).join(',') + '\n';
    
    invoices.forEach(invoice => {
        if (invoice.lineItems && invoice.lineItems.length > 0) {
            invoice.lineItems.forEach((item: any) => {
                const row = [
                    invoice.invoiceId,
                    item.quantity,
                    item.description,
                    item.unitPrice,
                    item.total
                ];
                csv += row.map(value => `"${value !== null && value !== undefined ? String(value).replace(/"/g, '""') : ''}"`).join(',') + '\n';
            });
        }
    });

    return csv;
};


/**
 * Extracts invoice data from a PDF file, automatically handling both text-based and image-based (scanned) documents.
 * @param file The PDF file to process.
 * @param onProgress A callback function to report progress updates.
 * @returns A promise that resolves to a CSV string of the extracted invoice data.
 */
export const extractInvoiceDataAsCsv = async (
    file: File,
    onProgress: (message: string) => void
): Promise<string> => {
    onProgress('Extracting text from PDF...');
    const text = await getTextFromPdf(file, onProgress);
    const invoices: any[] = [];

    const systemPrompt = `You are an expert invoice and receipt data extractor. Your task is to accurately pull out the key information according to the provided JSON schema. Pay close attention to line items, totals, and invoice details. If the document does not seem to be an invoice or a receipt, set 'isInvoice' to false and leave other fields blank.`;

    if (text) {
        onProgress('Analyzing text with AI...');
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `${systemPrompt} Text from PDF: ${text}`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: invoiceSchema,
                },
            });
            const parsedJson = JSON.parse(response.text.trim());
            if (parsedJson.isInvoice) {
                invoices.push(parsedJson);
            }
        } catch (error) {
            console.error("Gemini API error (text-based):", error);
            throw new Error("Failed to analyze invoice data with AI from the PDF text. The content may be unsupported.");
        }
    } else {
        onProgress('No text found, switching to image analysis...');
        const imageParts = await renderPdfPagesAsImages(file, onProgress);
        if (imageParts.length === 0) {
            throw new Error("Could not extract text or render any images from the PDF. The file may be empty or corrupted.");
        }

        // Process each page sequentially to avoid rate limiting.
        for (let i = 0; i < imageParts.length; i++) {
            const part = imageParts[i];
            const pageNum = i + 1;
            onProgress(`Processing page ${pageNum} of ${imageParts.length} with AI...`);
            
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [ { text: `${systemPrompt} Extract data for the single invoice in the provided image.` }, part ],
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: invoiceSchema,
                    },
                });

                if (response) {
                    const parsedJson = JSON.parse(response.text.trim());
                    if (parsedJson.isInvoice) {
                        invoices.push(parsedJson);
                    }
                }
            } catch (error) {
                // Log the error for the specific page but continue processing others.
                console.error(`Failed to process page ${pageNum}:`, error);
                onProgress(`Error on page ${pageNum}. Continuing...`);
            }
            
            // Add a small delay between requests to be safe with rate limits, especially for free tiers.
            if (i < imageParts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
            }
        }
    }

    if (invoices.length === 0) {
        throw new Error("The provided document does not appear to contain any valid invoices or receipts that could be processed.");
    }

    onProgress('Finalizing CSV data...');
    return invoicesJsonToCsv(invoices);
};
```

### FILE: services/pdfExtractor.ts
```typescript
import { getTextFromPdf } from './pdfUtils';

/**
 * Extracts unique email addresses from a given PDF file.
 * @param file The PDF file to process.
 * @param onProgress A callback function to report progress updates.
 * @returns A promise that resolves to an array of unique, sorted email addresses.
 */
export const extractEmailsFromPdf = async (
    file: File,
    onProgress: (message: string) => void
): Promise<string[]> => {
    onProgress("Extracting text from PDF...");
    const allText = await getTextFromPdf(file, onProgress);
    
    onProgress("Finding unique emails...");
    // Improved regex to better handle various email formats
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = allText.match(emailRegex) || [];
    
    // Create a Set of lowercased emails to ensure uniqueness, then convert back to an array and sort.
    const uniqueEmails = [...new Set(emails.map(email => email.toLowerCase()))].sort();
    
    return uniqueEmails;
};
```

### FILE: services/pdfUtils.ts
```typescript
/**
 * Extracts raw text content from a given PDF file.
 * @param file The PDF file to process.
 * @param onProgress An optional callback function to report progress updates.
 * @returns A promise that resolves to the full text content of the PDF.
 */
export const getTextFromPdf = async (
    file: File,
    onProgress?: (message: string) => void
): Promise<string> => {
    if (typeof window.pdfjsLib === 'undefined') {
        // This check is important because the library is loaded from a CDN.
        throw new Error("PDF.js library is not loaded or ready. Please try again in a moment.");
    }
    
    const arrayBuffer = await file.arrayBuffer();
    // Use the pdfjsLib from the window scope
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let allText = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
        onProgress?.(`Reading text from page ${i} of ${numPages}...`);
        try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // The `item.str` can have spaces, so we join with a space to be safe
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            allText += pageText + ' ';
        } catch (error) {
            console.error(`Failed to get text from page ${i}.`, error);
        }
    }
    
    return allText.trim();
};

/**
 * Renders each page of a PDF file into a base64-encoded image.
 * This is used for OCR when text extraction fails.
 * @param file The PDF file to process.
 * @param onProgress An optional callback function to report progress updates.
 * @returns A promise that resolves to an array of image parts for the Gemini API.
 */
export const renderPdfPagesAsImages = async (
    file: File,
    onProgress?: (message: string) => void
): Promise<{ inlineData: { mimeType: string; data: string; } }[]> => {
    if (typeof window.pdfjsLib === 'undefined') {
        throw new Error("PDF.js library is not loaded or ready.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const imageParts: { inlineData: { mimeType: string; data: string; } }[] = [];
    
    // Use a reasonable scale for better OCR quality. 1.5 is a good balance.
    const scale = 1.5; 

    // Process pages sequentially to avoid overwhelming the browser with canvas renderings
    for (let i = 1; i <= numPages; i++) {
        onProgress?.(`Rendering page ${i} of ${numPages}...`);
        try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (!context) {
                console.error(`Could not get 2d context for page ${i}`);
                continue; 
            }
            
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            
            // Convert canvas to a base64 string. Use JPEG for efficiency.
            // The Gemini API expects the raw base64 data, without the data URL prefix.
            const base64Data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];

            if (base64Data) {
                imageParts.push({
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Data
                    }
                });
            }
        } catch (error) {
            console.error(`Failed to render page ${i} of the PDF.`, error);
            // Continue to the next page even if one fails
        }
    }

    return imageParts;
};
```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Omniextract</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Omniextract — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — omniextract
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('omniextract E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: srsContent.ts
```typescript
export const srsContent = `
### **Software Requirements Specification for OmniExtract**

**Version 1.0**

---

### **Table of Contents**

1.  **Introduction**
    1.1. Purpose
    1.2. Scope
    1.3. Definitions, Acronyms, and Abbreviations
    1.4. References
    1.5. Overview
2.  **Overall Description**
    2.1. Product Perspective
    2.2. Product Functions
    2.3. User Characteristics
    2.4. Constraints
    2.5. Assumptions and Dependencies
3.  **Specific Requirements**
    3.1. External Interface Requirements
        3.1.1. User Interfaces
        3.1.2. Software Interfaces
    3.2. Functional Requirements
        3.2.1. FR-1: Mode Selection
        3.2.2. FR-2: File Upload
        3.2.3. FR-3: Email Extraction
        3.2.4. FR-4: Invoice Data Extraction
        3.2.5. FR-5: Results Display
        3.2.6. FR-6: Data Export
    3.3. Non-Functional Requirements
        3.3.1. NFR-1: Performance
        3.3.2. NFR-2: Usability
        3.3.3. NFR-3: Reliability
        3.3.4. NFR-4: Security

---

### **1. Introduction**

#### **1.1 Purpose**

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the web application **OmniExtract**. It is intended for the project's developers, testers, and project managers to ensure a common understanding of the system's features, capabilities, and constraints.

#### **1.2 Scope**

OmniExtract is a web-based utility designed to extract structured data from Portable Document Format (PDF) files. The system provides two primary modes of operation:
1.  **Email Extraction:** Scans PDF documents to identify, collect, and list all unique email addresses.
2.  **Invoice Data Extraction:** Leverages the Google Gemini Artificial Intelligence (AI) model to parse PDF documents (both text-based and image-based/scanned) to extract structured data from invoices and receipts.

The application is designed to be a client-side tool that operates within a user's web browser, providing an intuitive interface for uploading files, processing them, and exporting the extracted data as .txt or .csv files.

#### **1.3 Definitions, Acronyms, and Abbreviations**

*   **AI:** Artificial Intelligence
*   **API:** Application Programming Interface
*   **CSV:** Comma-Separated Values
*   **FR:** Functional Requirement
*   **GUI:** Graphical User Interface
*   **IEEE:** Institute of Electrical and Electronics Engineers
*   **NFR:** Non-Functional Requirement
*   **OCR:** Optical Character Recognition
*   **PDF:** Portable Document Format
*   **SRS:** Software Requirements Specification

#### **1.4 References**

*   **IEEE Std 830-1998:** Recommended Practice for Software Requirements Specifications.
*   **Google Gemini API Documentation:** Official documentation for the 'gemini-2.5-flash' model and its capabilities.
*   **PDF.js Library Documentation:** Documentation for the Mozilla PDF rendering and parsing library.

#### **1.5 Overview**

This document is organized into three main sections. Section 1 provides an introduction to the project and this document. Section 2 gives an overall description of the product, its users, and operational constraints. Section 3 details the specific functional and non-functional requirements the software must satisfy.

### **2. Overall Description**

#### **2.1 Product Perspective**

OmniExtract is a self-contained, client-side web application that depends on external services for its core functionality. It integrates with:
1.  **PDF.js Library:** A third-party JavaScript library for rendering and parsing PDF documents within the browser.
2.  **Google Gemini API:** An external AI service used for the intelligent analysis and data extraction of invoice documents.

The application does not require any local software installation beyond a modern web browser.

#### **2.2 Product Functions**

The primary functions of OmniExtract are:
*   Allow users to select an extraction mode (Emails or Invoice Data).
*   Provide an interface for uploading a single PDF file.
*   Process the uploaded PDF based on the selected mode.
*   Display real-time progress updates during processing.
*   Present extracted data in a clear, readable format.
*   Enable users to copy or download the extracted data.
*   Display user-friendly error messages and notifications.

#### **2.3 User Characteristics**

The intended users of OmniExtract include office administrators, accountants, data entry personnel, researchers, and any individual who needs to quickly extract information from PDF documents without manual effort. Users are expected to have basic computer and web browser literacy but do not require any specialized technical knowledge.

#### **2.4 Constraints**

*   The application must run in a modern web browser that supports HTML5, CSS3, and modern JavaScript (ES6+).
*   An active internet connection is required to load the necessary libraries (PDF.js, Tailwind CSS) from a CDN and to communicate with the Google Gemini API.
*   **A valid Google GenAI API key must be provided in the application's runtime environment ('process.env.API_KEY'). The application will not function without it.**
*   The application's performance for invoice extraction is subject to the latency and rate limits of the Google Gemini API.
*   The application is designed to process one PDF file at a time.

#### **2.5 Assumptions and Dependencies**

*   Users will provide valid, unencrypted, and uncorrupted PDF files.
*   The third-party CDNs for libraries and the Google Gemini API service are available and operational.
*   The provided Google GenAI API key is valid and possesses a sufficient quota to handle user requests.

### **3. Specific Requirements**

#### **3.1 External Interface Requirements**

##### **3.1.1 User Interfaces**

The application shall provide a clean, single-page graphical user interface (GUI) consisting of:
*   **Header:** Displays the application name "OmniExtract" and a brief description.
*   **Mode Selector:** A toggle or button group allowing the user to select between "Extract Emails" and "Extract Invoice Data".
*   **File Upload Area:** A styled drag-and-drop area and a "Choose File" button for uploading PDF files. It will display the selected file's name and size.
*   **Loading/Progress Indicator:** When processing, a loading spinner and a text message shall display the current status (e.g., "Rendering page 5 of 33...").
*   **Results Display:** A dedicated section to show the extracted data. This section will include the total count of items found, a scrollable view of the data, and action buttons.
*   **Message Box:** A modal dialog for displaying success notifications, warnings, or error messages to the user.

##### **3.1.2 Software Interfaces**

*   **PDF.js API:** The system will use the 'pdf.js' library to parse PDF documents. It will utilize functions for loading documents ('getDocument') and processing individual pages ('getPage', 'getTextContent', 'render').
*   **Google Gemini API:** The system will interface with the 'gemini-2.5-flash' model via the '@google/genai' SDK for invoice data extraction. It will make API calls in two distinct ways:
    1.  **Text-based:** By sending the full extracted text from a PDF along with a predefined JSON schema for the AI to populate.
    2.  **Image-based (OCR):** By sending individual, base64-encoded page images along with a prompt and the same JSON schema.

#### **3.2 Functional Requirements**

##### **FR-1: Mode Selection**
*   **FR-1.1:** The user shall be able to select one of two extraction modes: "Extract Emails" or "Extract Invoice Data".
*   **FR-1.2:** The selected mode shall determine the processing logic applied to the uploaded PDF.

##### **FR-2: File Upload**
*   **FR-2.1:** The system shall allow the user to upload a file with a '.pdf' extension.
*   **FR-2.2:** Upon file selection, the system shall display the file's name and size.

##### **FR-3: Email Extraction**
*   **FR-3.1:** When in "Extract Emails" mode, the system shall extract all text content from every page of the PDF.
*   **FR-3.2:** The system shall apply a regular expression to the extracted text to find all email addresses.
*   **FR-3.3:** The system shall filter the list of found emails to ensure uniqueness (case-insensitive) and sort them alphabetically.

##### **FR-4: Invoice Data Extraction**
*   **FR-4.1: Dual-Path Processing:** The system shall first attempt to extract text from the PDF. If the extracted text is empty or minimal, the system shall automatically fall back to an image-based OCR approach.
*   **FR-4.2: OCR Fallback:** In OCR mode, the system shall render each page of the PDF into a JPEG image.
*   **FR-4.3: AI Data Parsing:** The system shall send the prepared data (either text or page images) to the Gemini API with a system prompt and a strict JSON schema requesting the following fields: 'isInvoice', 'vendorName', 'customerName', 'invoiceId', 'issueDate', 'lineItems' (with 'quantity', 'description', 'unitPrice', 'total'), 'subtotal', 'discount', and 'grandTotal'.
*   **FR-4.4: Multi-Page Invoice Handling:** The system shall process each page of a PDF as a potential separate invoice, collecting valid invoice data from all pages.

##### **FR-5: Results Display**
*   **FR-5.1:** If in "Email" mode, the system shall display the total count of unique emails and list them in a scrollable view.
*   **FR-5.2:** If in "Invoice" mode, the system shall display the total number of data rows extracted and show the final CSV-formatted data in a scrollable '<pre>' block.

##### **FR-6: Data Export**
*   **FR-6.1: Copy to Clipboard:** The system shall provide a "Copy All" button that copies the entire extracted dataset (all emails or the full CSV content) to the user's clipboard.
*   **FR-6.2: Download as File:** The system shall provide a download button.
    *   **FR-6.2.1:** In "Email" mode, this button shall be labeled "Download as TXT" and shall download a '_emails.txt' file.
    *   **FR-6.2.2:** In "Invoice" mode, this button shall be labeled "Download as CSV" and shall download a '_invoice_data.csv' file.
*   **FR-6.3: CSV Formatting:** The generated CSV from invoice data shall be structured with two sections: (1) A summary of each invoice found, and (2) A comprehensive list of all line items from all invoices, linked by 'invoiceId'.

#### **3.3 Non-Functional Requirements**

##### **NFR-1: Performance**
*   **NFR-1.1:** Email extraction should be processed quickly, as it is a client-side text operation.
*   **NFR-1.2:** To avoid API rate-limiting errors (HTTP 429), API requests for multi-page image-based PDFs shall be sent sequentially, not in parallel. A small delay (e.g., 1 second) shall be introduced between page requests.
*   **NFR-1.3:** The user shall be kept informed of long-running operations via a progress indicator.

##### **NFR-2: Usability**
*   **NFR-2.1:** The user interface shall be intuitive, responsive, and easy to navigate on both desktop and mobile devices.
*   **NFR-2.2:** The system shall provide clear visual feedback for all user actions, including file selection, loading states, and success/error outcomes.
*   **NFR-2.3:** Error messages shall be clear, and user-friendly, and suggest a course of action where possible.

##### **NFR-3: Reliability**
*   **NFR-3.1:** The application shall gracefully handle errors during PDF parsing (e.g., from a corrupted file) and display an appropriate error message.
*   **NFR-3.2:** The application shall handle errors from the Gemini API (e.g., invalid API key, quota exceeded) and inform the user.
*   **NFR-3.3:** The failure to process a single page in a multi-page document should not prevent the processing of other pages.

##### **NFR-4: Security**
*   **NFR-4.1:** The Google GenAI API key shall be managed as an environment variable and must not be hard-coded or exposed in the client-side source code accessible to the end-user.
`;

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript

// Make pdfjsLib available on the window object for TypeScript
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export interface MessageBoxState {
  visible: boolean;
  title: string;
  content: string;
  isError: boolean;
}

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — omniextract
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — omniextract
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

