import React, { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react';
import { Environment, FormData, ApiResponse } from './types';
import { API_ENDPOINTS, INITIAL_FORM_DATA, SAMPLE_FORM_DATA } from './constants';
import EnvironmentSelector from './components/EnvironmentSelector';
import Input from './components/Input';
import Textarea from './components/Textarea';
import FileInput from './components/FileInput';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';
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
