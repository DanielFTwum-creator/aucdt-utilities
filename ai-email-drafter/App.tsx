import React, { useState, useRef, useEffect, useCallback, ChangeEvent } from 'react';
import { EmailData, Attachment } from './types';
import { draftEmailWithGemini } from './services/geminiService';
import { RecipientInput } from './components/RecipientInput';
import { AttachmentPreview } from './components/AttachmentPreview';
import { PaperclipIcon, SparklesIcon, ComposerIcon, BugAntIcon } from './components/icons';
import { PuppeteerTestsTab } from './components/PuppeteerTestsTab';

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'ai-email-drafter-admin';
const AUDIT_LOG_KEY = 'ai-email-drafter-audit';

interface AuditEntry { id: string; timestamp: string; action: string; details?: string; }
function getAuditLogs(): AuditEntry[] { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action: string, details?: string) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}

const AdminLoginModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_SESSION_KEY, 'true'); appendAuditLog('ADMIN_LOGIN_SUCCESS'); onSuccess(); }
    else { appendAuditLog('ADMIN_LOGIN_FAIL'); setError('Invalid password.'); setPwd(''); }
  };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 w-full max-w-sm shadow-2xl">
        <h2 id="admin-login-title" className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-pwd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required
              aria-describedby={error ? 'admin-err' : undefined}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
            {error && <p id="admin-err" role="alert" className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 min-h-[44px] rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">Authenticate</button>
            <button type="button" onClick={onClose} className="px-4 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 py-2 min-h-[44px] rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [tab, setTab] = useState<'logs' | 'diagnostics'>('logs');
  const [storageTest, setStorageTest] = useState<'idle' | 'pass' | 'fail'>('idle');
  const [apiHealth, setApiHealth] = useState<'checking' | 'configured' | 'missing'>('checking');
  useEffect(() => {
    setLogs(getAuditLogs());
    fetch('/api/health')
      .then(r => setApiHealth(r.ok ? 'configured' : 'missing'))
      .catch(() => setApiHealth('missing'));
  }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(ADMIN_SESSION_KEY); onClose(); };
  const runStorageTest = () => {
    try { localStorage.setItem('__diag__', '1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: PASS'); }
    catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN', 'localStorage: FAIL'); }
  };
  return (
    <div role="main" aria-label="Admin Dashboard" className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard — AI Email Drafter</h1>
          <button onClick={handleLogout} aria-label="Logout from admin" className="px-4 py-2 min-h-[44px] bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors">Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" className="flex gap-2">
          {(['logs', 'diagnostics'] as const).map(t => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={`px-4 py-2 min-h-[44px] rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
              {t === 'logs' ? 'Audit Log' : 'Diagnostics'}
            </button>
          ))}
        </div>
        {tab === 'logs' && (
          <section aria-label="Audit log">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" aria-label="Admin activity log">
              <thead className="bg-gray-100 dark:bg-gray-800"><tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Timestamp</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Action</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Details</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {logs.length === 0 ? <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No entries yet.</td></tr>
                  : logs.map(l => <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2 text-gray-500 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2 text-blue-600 font-mono text-xs">{l.action}</td>
                    <td className="px-4 py-2 text-gray-400 text-xs">{l.details || '—'}</td>
                  </tr>)}
              </tbody>
            </table>
          </section>
        )}
        {tab === 'diagnostics' && (
          <section aria-label="System diagnostics" className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div><p className="text-sm font-medium text-gray-900 dark:text-white">LocalStorage Access</p><p className="text-xs text-gray-500">Verifies browser storage read/write</p></div>
              <div className="flex items-center gap-3">
                {storageTest !== 'idle' && <span role="status" className={`text-xs font-bold px-2 py-1 rounded ${storageTest === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{storageTest.toUpperCase()}</span>}
                <button onClick={runStorageTest} className="px-3 py-1.5 min-h-[44px] bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-100 transition-colors">Run Test</button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div><p className="text-sm font-medium text-gray-900 dark:text-white">Backend API</p><p className="text-xs text-gray-500">Server-side Gemini proxy</p></div>
              <span role="status" className={`text-xs font-bold px-2 py-1 rounded ${apiHealth === 'configured' ? 'bg-green-100 text-green-700' : apiHealth === 'missing' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{apiHealth === 'configured' ? 'OK' : apiHealth === 'missing' ? 'UNREACHABLE' : 'CHECKING...'}</span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#/admin') {
        sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true' ? setShowAdmin(true) : setShowAdminLogin(true);
      }
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  const [emailData, setEmailData] = useState<EmailData>({
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    attachments: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [activeTab, setActiveTab] = useState<'composer' | 'tests'>('composer');


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecipientsChange = (field: 'to' | 'cc' | 'bcc') => (recipients: string[]) => {
    setEmailData(prev => ({ ...prev, [field]: recipients }));
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('Failed to read file as base64'));
            }
        };
        reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newAttachments: Attachment[] = [];

      for (const file of files) {
        if (file instanceof File && file.type.startsWith('image/')) {
            const base64 = await fileToBase64(file);
            const newAttachment: Attachment = {
              id: `${file.name}-${Date.now()}`,
              name: file.name,
              type: file.type,
              size: file.size,
              base64,
              previewUrl: URL.createObjectURL(file),
            };
            newAttachments.push(newAttachment);
        }
      }

      setEmailData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
    }
  };

  const removeAttachment = (idToRemove: string) => {
    const attachmentToRemove = emailData.attachments.find(att => att.id === idToRemove);
    if (attachmentToRemove) {
        URL.revokeObjectURL(attachmentToRemove.previewUrl);
    }
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== idToRemove),
    }));
  };

  const handleGenerateDraft = async () => {
    if (!emailData.to.length && !emailData.cc.length && !emailData.bcc.length) {
        alert("Please add at least one recipient.");
        return;
    }
    if (!emailData.subject && !emailData.body) {
        alert("Please provide a subject or some notes in the body.");
        return;
    }
    setIsLoading(true);
    setGeneratedDraft('');
    const result = await draftEmailWithGemini(emailData);
    setGeneratedDraft(result);
    setIsLoading(false);
  };
  
  const handleCopyDraft = () => {
    navigator.clipboard.writeText(generatedDraft.replace(/^Error: .*/, ''));
    alert('Draft copied to clipboard!');
  };

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && (
      <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />
    )}
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md">Skip to main content</a>
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6" role="banner">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-blue-500" />
            <span>AI Email Drafter</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Compose your email and let Gemini help you write the perfect draft.
          </p>
        </header>

        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('composer')}
              className={`whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === 'composer'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <ComposerIcon className="-ml-0.5 mr-2 h-5 w-5" />
              <span>Composer</span>
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === 'tests'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <BugAntIcon className="-ml-0.5 mr-2 h-5 w-5" />
              <span>Puppeteer Self-Test</span>
            </button>
          </nav>
        </div>

        {activeTab === 'composer' && (
            <>
                <main className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex-grow">
                            <RecipientInput recipients={emailData.to} setRecipients={handleRecipientsChange('to')} placeholder="To" />
                            {showCc && <RecipientInput recipients={emailData.cc} setRecipients={handleRecipientsChange('cc')} placeholder="Cc" />}
                            {showBcc && <RecipientInput recipients={emailData.bcc} setRecipients={handleRecipientsChange('bcc')} placeholder="Bcc" />}
                        </div>
                        <div className="flex-shrink-0 ml-4 space-x-2">
                            <button onClick={() => setShowCc(!showCc)} className={`px-2 py-1 min-h-[44px] rounded ${showCc ? 'font-semibold' : ''}`}>Cc</button>
                            <button onClick={() => setShowBcc(!showBcc)} className={`px-2 py-1 min-h-[44px] rounded ${showBcc ? 'font-semibold' : ''}`}>Bcc</button>
                        </div>
                    </div>

                    <input
                    type="text"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="w-full p-2 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                    name="body"
                    value={emailData.body}
                    onChange={handleInputChange}
                    placeholder="Write your notes or the main points of the email here..."
                    className="w-full p-2 h-48 sm:h-64 mt-2 bg-transparent focus:outline-none resize-y"
                    />
                </div>

                {emailData.attachments.length > 0 && (
                    <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Attachments</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {emailData.attachments.map(att => (
                        <AttachmentPreview key={att.id} attachment={att} onRemove={removeAttachment} />
                        ))}
                    </div>
                    </div>
                )}

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 min-h-[44px] text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                    <PaperclipIcon className="w-5 h-5" />
                    Attach Image
                    </button>
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="image/*"
                    />
                    <button
                    onClick={handleGenerateDraft}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed"
                    >
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                        </>
                    ) : (
                        <>
                        <SparklesIcon className="w-5 h-5" />
                        Generate Draft
                        </>
                    )}
                    </button>
                </div>
                </main>
                
                {(isLoading || generatedDraft) && (
                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-3">AI Generated Draft</h2>
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex justify-center items-center rounded-lg">
                                <p className="text-gray-500 dark:text-gray-400">Generating draft...</p>
                            </div>
                        )}
                    {generatedDraft && (
                        <>
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                                {generatedDraft.split('\\n').map((line, i) => (
                                <p key={i} className="my-1">{line || ' '}</p>
                                ))}
                            </div>
                            {!generatedDraft.startsWith("Error:") && (
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={handleCopyDraft}
                                        className="px-4 py-2 min-h-[44px] text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Copy Draft
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    </div>
                </section>
                )}
            </>
        )}
        {activeTab === 'tests' && <PuppeteerTestsTab />}
      </div>
      <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400">
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Admin</button>
      </footer>
    </div>
    </>
  );
};

export default App;
