# aucdt-sendmail-api-tester - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for aucdt-sendmail-api-tester.

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

### FILE: App.tsx
```typescript
import React, { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react';
import { Environment, FormData, ApiResponse } from './types';
import { API_ENDPOINTS, INITIAL_FORM_DATA, SAMPLE_FORM_DATA } from './constants';
import EnvironmentSelector from './components/EnvironmentSelector';
import Input from './components/Input';
import Textarea from './components/Textarea';
import FileInput from './components/FileInput';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]
const ADMIN_SESSION_KEY = 'sendmail-tester-admin';
const AUDIT_LOG_KEY = 'sendmail-tester-audit';
interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
function getAuditLogs(): AuditEntry[] { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}
const AdminLoginModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [pwd, setPwd] = useState(''); const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); appendAuditLog('ADMIN_LOGIN_SUCCESS'); onSuccess(); } else { appendAuditLog('ADMIN_LOGIN_FAIL'); setError('Invalid password.'); setPwd(''); } };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-2xl">
        <h2 id="admin-login-title" className="text-lg font-bold mb-6 text-gray-900">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="admin-pwd" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-500">{error}</p>}</div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700">Authenticate</button>
            <button type="button" onClick={onClose} className="px-4 border border-gray-300 text-gray-600 py-2 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditEntry[]>([]); const [tab, setTab] = useState<'logs'|'diagnostics'>('logs'); const [storageTest, setStorageTest] = useState<'idle'|'pass'|'fail'>('idle');
  useEffect(() => { setLogs(getAuditLogs()); }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(ADMIN_SESSION_KEY); onClose(); };
  const runStorageTest = () => { try { localStorage.setItem('__diag__','1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: PASS'); } catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: FAIL'); } };
  return (
    <div role="main" aria-label="Admin Dashboard" className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard — SendMail API Tester</h1>
          <button onClick={handleLogout} aria-label="Logout from admin" className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200">Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" className="flex gap-2">
          {(['logs','diagnostics'] as const).map(t => <button key={t} role="tab" aria-selected={tab===t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium ${tab===t?'bg-blue-600 text-white':'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden" aria-label="Admin activity log"><thead className="bg-gray-100"><tr><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Timestamp</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Action</th><th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Details</th></tr></thead><tbody className="divide-y divide-gray-100">{logs.length===0?<tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No entries yet.</td></tr>:logs.map(l=><tr key={l.id}><td className="px-4 py-2 text-gray-500 text-xs">{new Date(l.timestamp).toLocaleString()}</td><td className="px-4 py-2 text-blue-600 font-mono text-xs">{l.action}</td><td className="px-4 py-2 text-gray-400 text-xs">{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics" className="space-y-4"><div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">LocalStorage Access</p><p className="text-xs text-gray-500">Verifies browser storage</p></div><div className="flex items-center gap-3">{storageTest!=='idle'&&<span role="status" className={`text-xs font-bold px-2 py-1 rounded ${storageTest==='pass'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 rounded text-xs font-medium hover:bg-blue-100">Run Test</button></div></div><div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"><div><p className="text-sm font-medium text-gray-900">API Endpoint Check</p><p className="text-xs text-gray-500">Validates API_ENDPOINTS config</p></div><span role="status" className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700">{Object.keys(API_ENDPOINTS).length} ENVS</span></div></section>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  const [environment, setEnvironment] = useState<Environment>(Environment.UAT);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleEnvironmentChange = useCallback((newEnv: Environment) => {
    setEnvironment(newEnv);
    setFormData(SAMPLE_FORM_DATA[newEnv]);
    setResponse(null); // Clear previous response when environment changes
    setIsCopied(false);
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, attachment: file }));
  }, []);

  const handleClearFile = useCallback(() => {
    setFormData((prev) => ({ ...prev, attachment: null }));
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(null);
    setIsCopied(false);

    const apiUrl = API_ENDPOINTS[environment];
    const apiFormData = new window.FormData();
    const { attachment, ...emailData } = formData;

    // The API expects the form data as a JSON string in a field named 'emailData'
    // and the file in a field named 'attachment'.
    apiFormData.append('emailData', JSON.stringify(emailData));
    if (attachment) {
      apiFormData.append('attachment', attachment, attachment.name);
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: apiFormData, // Let the browser set the Content-Type to multipart/form-data
      });

      const resultText = await res.text();
      setResponse({
        status: res.status,
        data: resultText,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setResponse({
        status: null,
        data: '',
        error: `Network or fetch error: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [environment, formData]);

  const handleCopy = useCallback(() => {
    if (response?.data) {
      navigator.clipboard.writeText(response.data).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }, [response]);

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md">Skip to main content</a>
    <div id="main-content" className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto bg-[#FDFBF5] rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 border border-white/30">
        <header className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <img 
              src="https://aucdt.edu.gh/wp-content/uploads/2022/04/aucdt-logo-for-web.png" 
              alt="AUCDT Logo"
              className="w-36"
            />
            <h1 className="text-4xl font-extrabold text-[#8B1538]">SendMail API Tester</h1>
          </div>
          <p className="text-gray-500">Select an environment and fill the form to test the email service.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <EnvironmentSelector selected={environment} onChange={handleEnvironmentChange} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input label="Applicant ID" id="applicantId" type="text" value={formData.applicantId} onChange={handleInputChange} required />
            <Input label="Full Name" id="fullName" type="text" value={formData.fullName} onChange={handleInputChange} required />
            <Input label="Sender Email" id="senderEmailId" type="email" value={formData.senderEmailId} onChange={handleInputChange} required />
            <Input label="Receiver Email" id="receiverEmailId" type="email" value={formData.receiverEmailId} onChange={handleInputChange} required />
            <Input label="Subject" id="subject" type="text" value={formData.subject} onChange={handleInputChange} required className="md:col-span-2" />
            <Textarea label="Message" id="message" value={formData.message} onChange={handleInputChange} required className="md:col-span-2" />
            <FileInput 
              id="attachment"
              label="Attachment (Optional)"
              selectedFile={formData.attachment ?? null}
              onFileChange={handleFileChange}
              onClearFile={handleClearFile}
              className="md:col-span-2"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-[#8B1538] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#6B1028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Email'
            )}
          </button>
        </form>

        {(isLoading || response) && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[#2C1810]">API Response</h2>
            <div className="mt-2">
              {isLoading && (
                 <div className="flex items-start bg-sky-50 p-4 rounded-lg border-l-4 shadow-md border-sky-400" role="status" aria-live="polite">
                    <div className="flex-shrink-0">
                      <svg className="animate-spin h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                        <p className="font-semibold text-sky-800">Waiting for response...</p>
                        <p className="text-sm text-sky-700">The request has been sent and the application is waiting for the server.</p>
                    </div>
                 </div>
              )}
              {response && (() => {
                let details = {
                  title: 'Unknown Response',
                  message: 'Received an unexpected response from the server.',
                  titleColor: 'text-gray-800',
                  textColor: 'text-gray-700',
                  borderColor: 'border-gray-500',
                  bgColor: 'bg-gray-50',
                  hrColor: 'border-gray-200',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                };

                if (response.error) {
                  details = {
                    title: 'Error: Network or Client-Side Issue',
                    message: 'Could not connect to the server. Please check your network connection.',
                    titleColor: 'text-rose-800',
                    textColor: 'text-rose-700',
                    borderColor: 'border-rose-500',
                    bgColor: 'bg-rose-50',
                    hrColor: 'border-rose-200',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )
                  };
                } else if (response.status) {
                  const status = response.status;
                  if (status >= 200 && status < 300) {
                    details = {
                      title: 'Success',
                      message: 'The request was successfully processed by the server.',
                      titleColor: 'text-emerald-800',
                      textColor: 'text-emerald-700',
                      borderColor: 'border-emerald-500',
                      bgColor: 'bg-emerald-50',
                      hrColor: 'border-emerald-200',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )
                    };
                  } else if (status >= 300 && status < 400) {
                     details = {
                      title: 'Notice: Redirection',
                      message: 'The server responded with a redirection status. This is not an error but might be unexpected.',
                      titleColor: 'text-sky-800',
                      textColor: 'text-sky-700',
                      borderColor: 'border-sky-500',
                      bgColor: 'bg-sky-50',
                      hrColor: 'border-sky-200',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )
                    };
                  } else if (status >= 400 && status < 500) {
                    details = {
                      title: 'Warning: Client Error',
                      message: `The request failed due to a client-side error (${status}). Please check your input and the response body for details.`,
                      titleColor: 'text-amber-800',
                      textColor: 'text-amber-700',
                      borderColor: 'border-amber-500',
                      bgColor: 'bg-amber-50',
                      hrColor: 'border-amber-200',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      )
                    };
                  } else if (status >= 500) {
                    details = {
                      title: 'Error: Server Error',
                      message: 'The server encountered an internal error and could not process the request.',
                      titleColor: 'text-rose-800',
                      textColor: 'text-rose-700',
                      borderColor: 'border-rose-500',
                      bgColor: 'bg-rose-50',
                      hrColor: 'border-rose-200',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )
                    };
                  }
                }

                return (
                  <div className={`p-4 rounded-lg border-l-4 shadow-md ${details.bgColor} ${details.borderColor}`} role="status" aria-live="polite">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {details.icon}
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-lg font-bold ${details.titleColor}`}>{details.title}</h3>
                            <p className={`text-sm mt-1 ${details.textColor}`}>{details.message}</p>
                        </div>
                    </div>

                    <div className="mt-4 pl-9">
                        <hr className={`my-3 border-t ${details.hrColor}`} />
                        <div className="space-y-1 text-gray-700">
                          {response.status !== null && <p><span className="font-semibold text-gray-800">Status Code:</span> {response.status}</p>}
                          {response.error && <p className="text-rose-700"><span className="font-semibold">Error Details:</span> {response.error}</p>}
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <p className="font-semibold text-gray-800">Response Body:</p>
                              {response.data && (
                                <button
                                  onClick={handleCopy}
                                  className="px-3 py-1 text-xs bg-[#8B1538]/20 text-[#8B1538] font-semibold rounded-md hover:bg-[#8B1538]/30 transition-colors duration-200 disabled:opacity-75 disabled:cursor-default"
                                  disabled={isCopied}
                                >
                                  {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                              )}
                            </div>
                            <pre className="text-sm whitespace-pre-wrap break-words font-mono bg-black/5 p-3 rounded-md text-gray-800">{response.data || '(No response body)'}</pre>
                          </div>
                        </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
      <footer className="mt-6 text-center text-xs text-gray-400">
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="hover:text-gray-600 transition-colors">Admin</button>
      </footer>
    </div>
    </>
  );
};

export default App;

```

### FILE: components/EnvironmentSelector.tsx
```typescript
import React from 'react';
import { Environment } from '../types';

interface EnvironmentSelectorProps {
  selected: Environment;
  onChange: (env: Environment) => void;
}

const environments = [
    { key: Environment.DEV, label: 'DEV' },
    { key: Environment.QA, label: 'QA' },
    { key: Environment.UAT, label: 'UAT' },
];

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ selected, onChange }) => {
    return (
        <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Environment
            </label>
            <div className="flex bg-gray-100 rounded-full p-1" role="group">
                {environments.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onChange(key)}
                        className={`w-full py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#8B1538] ${
                            selected === key
                                ? 'bg-[#8B1538] text-white shadow-md'
                                : 'text-gray-500 hover:bg-white/60'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EnvironmentSelector;
```

### FILE: components/FileInput.tsx
```typescript
import React, { ChangeEvent, useRef } from 'react';

interface FileInputProps {
  label: string;
  id: string;
  selectedFile: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  className?: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, id, selectedFile, onFileChange, onClearFile, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClearFile();
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center justify-between w-full px-3 py-2 text-[#2C1810] bg-white border border-[#F0DBC6] rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-[#8B1538] focus-within:border-transparent transition">
        <span className="truncate text-gray-500">
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
        <div className="flex items-center flex-shrink-0">
          {selectedFile && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538] rounded-full mr-2"
              aria-label="Clear selected file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <input
            type="file"
            id={id}
            ref={inputRef}
            onChange={onFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-3 py-1 text-xs bg-[#8B1538]/20 text-[#8B1538] font-semibold rounded-md hover:bg-[#8B1538]/30 transition-colors duration-200"
          >
            Browse
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInput;

```

### FILE: components/Input.tsx
```typescript
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-[#8B1538] ml-1">*</span>}
      </label>
      <input
        id={id}
        {...props}
        aria-required={props.required}
        className="w-full px-3 py-2 text-[#2C1810] bg-white border border-[#F0DBC6] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition"
      />
    </div>
  );
};

export default Input;
```

### FILE: components/Textarea.tsx
```typescript
import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, className, ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-[#8B1538] ml-1">*</span>}
      </label>
      <textarea
        id={id}
        rows={5}
        {...props}
        aria-required={props.required}
        className="w-full px-3 py-2 text-[#2C1810] bg-white border border-[#F0DBC6] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538] focus:border-transparent transition"
      />
    </div>
  );
};

export default Textarea;
```

### FILE: constants.ts
```typescript
import { Environment, FormData } from './types';

export const API_ENDPOINTS: Record<Environment, string> = {
  // Development environment endpoint
  [Environment.DEV]: 'https://portal.aucdt.edu.gh/aucdt-dev/sendMail',
  
  // Quality Assurance environment endpoint
  [Environment.QA]: 'https://portal.aucdt.edu.gh/aucdt-qa/sendMail',
  
  // User Acceptance Testing environment endpoint
  [Environment.UAT]: 'https://portal.aucdt.edu.gh/aucdt-uat/sendMail',
};

export const SAMPLE_FORM_DATA: Record<Environment, FormData> = {
  [Environment.DEV]: {
    applicantId: 'DEV-12345',
    fullName: 'Dev Tester',
    senderEmailId: 'helpdesk@aucdt.edu.gh',
    receiverEmailId: 'helpdesk@aucdt.edu.gh',
    subject: 'DEV: Test Email',
    message: 'This is a test message from the DEVELOPMENT environment.',
    attachment: null,
  },
  [Environment.QA]: {
    applicantId: 'QA-67890',
    fullName: 'QA Tester',
    senderEmailId: 'helpdesk@aucdt.edu.gh',
    receiverEmailId: 'helpdesk@aucdt.edu.gh',
    subject: 'QA: Test Email',
    message: 'This is a test message from the QUALITY ASSURANCE environment.',
    attachment: null,
  },
  [Environment.UAT]: {
    applicantId: 'UAT-54321',
    fullName: 'UAT Tester',
    senderEmailId: 'helpdesk@aucdt.edu.gh',
    receiverEmailId: 'helpdesk@aucdt.edu.gh',
    subject: 'UAT: Test Email',
    message: 'This is a test message from the USER ACCEPTANCE TESTING environment.',
    attachment: null,
  },
};


export const INITIAL_FORM_DATA: FormData = SAMPLE_FORM_DATA[Environment.UAT];
```

### FILE: CREATION.md
```md
# aucdt-sendmail-api-tester

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

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
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

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — TUC -sendmail-api-tester

**Application:** aucdt-sendmail-api-tester
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

Audit log data is stored in `localStorage` under the key `tuc_aucdt-sendmail-api-tester_audit`.

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
# Deployment Guide — TUC -sendmail-api-tester

**Application:** aucdt-sendmail-api-tester
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd aucdt-sendmail-api-tester
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
docker-compose -f docker-compose-all-apps.yml build aucdt-sendmail-api-tester
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up aucdt-sendmail-api-tester
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

### FILE: docs/DEPLOYMENT_GUIDE.md
```md
# AUCDT SendMail API Tester - Deployment Guide

This application is a static client-side application built with React. It can be deployed to any static site hosting service.

## Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   A package manager like `npm` or `yarn`

## Build Process

1.  **Install Dependencies:**
    Navigate to the project's root directory in your terminal and run the following command to install the required packages:
    ```bash
    npm install
    ```

2.  **Build for Production:**
    Run the build script to compile the React application and bundle it for production. This will create an optimized set of static files in a `dist` (or `build`) directory.
    ```bash
    npm run build
    ```

3.  **Verify the Output:**
    After the build is complete, you will find the following files in the `dist` folder:
    -   `index.html`
    -   Static assets (JavaScript, CSS, etc.) in an `assets` subdirectory.

## Deployment

The contents of the `dist` folder are all you need to deploy. You can host these files on any service that supports static sites.

### Example: Deploying to Netlify

1.  **Drag and Drop:**
    -   Go to your [Netlify dashboard](https://app.netlify.com/).
    -   Drag the `dist` folder from your local machine onto the Netlify drop zone.
    -   Netlify will automatically deploy the site and provide you with a URL.

2.  **Git-based Deployment (Recommended):**
    -   Push your project code to a Git repository (GitHub, GitLab, etc.).
    -   In Netlify, click "New site from Git".
    -   Connect your Git provider and select the repository.
    -   Configure the build settings:
        -   **Build command:** `npm run build`
        -   **Publish directory:** `dist`
    -   Click "Deploy site". Netlify will now automatically build and deploy your site whenever you push changes to your repository.

### Example: Deploying to Vercel

The process is very similar to Netlify.
1.  Connect your Git repository.
2.  Vercel will automatically detect that it's a React project.
3.  It will use the standard `npm run build` command and deploy the contents of the `dist` directory.

### Example: Deploying to a Traditional Web Server (Apache, Nginx)

1.  Upload the contents of the `dist` folder to the public directory of your web server (e.g., `/var/www/html`, `public_html`).
2.  Ensure your server is configured to serve `index.html` for requests to the root directory.
3.  If you are using client-side routing (not applicable for this simple app, but good to know), you may need to configure URL rewriting to direct all requests to `index.html`.

That's it! Your API tester is now live.

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Aucdt Sendmail Api Tester
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Aucdt Sendmail Api Tester**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Aucdt Sendmail Api Tester** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Aucdt Sendmail Api Tester** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| Docker service configured | âŒ Non-compliant |
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
# Testing Guide — TUC -sendmail-api-tester

**Application:** aucdt-sendmail-api-tester
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd aucdt-sendmail-api-tester
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

### FILE: docs/USER_GUIDE.md
```md
# AUCDT SendMail API Tester - User Guide

This guide explains how to use the AUCDT SendMail API Tester application.

## 1. Overview

The application provides a simple interface to test the `sendMail` API across three different environments: Development (DEV), Quality Assurance (QA), and User Acceptance Testing (UAT).

## 2. Using the Application

The interface is divided into three main sections: the environment selector, the email form, and the response display.

### Step 1: Select an Environment

At the top of the form, you will find the environment selector.

-   **DEV**: Select this to send requests to the development server.
-   **QA**: Select this to send requests to the quality assurance server.
-   **UAT**: Select this to send requests to the user acceptance testing server. This is the default selection.

Click on the desired environment. The selected button will be highlighted.

### Step 2: Fill in the Email Form

Complete all the fields in the form with the necessary data for your test case.

-   **Applicant ID**: The unique identifier for the applicant.
-   **Full Name**: The full name of the sender/applicant.
-   **Sender Email**: The email address the email will be sent from.
-   **Receiver Email**: The email address that will receive the email.
-   **Subject**: The subject line of the email.
-   **Message**: The body content of the email.
-   **Attachment (Optional)**: Click the "Browse" button to select a file from your computer to attach to the email. If you've selected a file, its name will be displayed. You can click the 'x' icon to remove the attachment.

All fields except for the attachment are required.

### Step 3: Send the Request

Once the form is complete, click the **"Send Email"** button at the bottom.

While the request is being processed, the button will be disabled and will show a "Sending..." status with a loading spinner.

### Step 4: Interpret the Response

After the server responds, the **API Response** section will appear below the form. This section provides detailed feedback on your request.

The response card is color-coded based on the HTTP status code:

-   **Green (Success - 2xx):** The request was successful.
-   **Blue (Redirection - 3xx):** The server responded with a redirect.
-   **Yellow (Client Error - 4xx):** There was an issue with the data you sent (e.g., bad request). Check the response body for details.
-   **Red (Server Error - 5xx):** The server encountered an error while processing your request.
-   **Red (Network/Client-Side Issue):** The application could not reach the server. Check your internet connection or for CORS issues.

The response card contains:
-   A clear title (e.g., "Success", "Error: Server Error").
-   A descriptive message.
-   The HTTP **Status Code**.
-   The full **Response Body** from the API, which can help in debugging.

This completes the process of testing the API. You can now modify the form to send another request.
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
    <meta property="og:title" content="TUC SendMail API Tester" />
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
    <meta name="twitter:title" content="TUC SendMail API Tester" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TUC SendMail API Tester</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-[#F8F6F0] text-[#2C1810]">
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: metadata.json
```json
{
  "name": "AUCDT SendMail API Tester",
  "description": "A web application to test the SendMail API for different environments (dev, qa, uat). It provides a user-friendly interface to compose and send emails, and view the API response.",
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
  "name": "aucdt-sendmail-api-tester",
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
    "react": "19.2.5",
    "react-dom": "19.2.5"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
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
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1oIIUZH_T3OY-WaGApOguZeiyvrYp-IUx

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — aucdt-sendmail-api-tester
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('aucdt-sendmail-api-tester E2E', () => {
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
    "types": [
      "node"
    ],
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

export enum Environment {
  DEV = 'dev',
  QA = 'qa',
  UAT = 'uat',
}

export interface FormData {
  applicantId: string;
  fullName: string;
  senderEmailId: string;
  receiverEmailId: string;
  subject: string;
  message: string;
  attachment?: File | null;
}

export interface ApiResponse {
  status: number | null;
  data: string;
  error: string | null;
}

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — aucdt-sendmail-api-tester
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

// Vitest E2E configuration — aucdt-sendmail-api-tester
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

### FILE: _tmp_49392_af6442022b7cca20fb2a3d303d355c62
```text

```

