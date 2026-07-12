import { useState } from 'react';
import { Mail, MessageSquare, Copy, Check, ExternalLink, Share2, Users, X, Info } from 'lucide-react';
import { PromptTemplate } from '../data';

interface ShareToColleagueProps {
  template: PromptTemplate;
}

export default function ShareToColleague({ template }: ShareToColleagueProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<'email' | 'chat'>('email');
  const [colleagueName, setColleagueName] = useState('');
  const [yourName, setYourName] = useState('');
  const [copied, setCopied] = useState(false);

  // App link for colleague to use
  const appLink = window.location.origin;

  // Pre-formatted contents
  const greetingColleague = colleagueName.trim() ? colleagueName.trim() : 'Colleague';
  const senderSignature = yourName.trim() ? yourName.trim() : 'Your Colleague';

  const emailSubject = `Useful AI Prompt Template for Lectures: ${template.title}`;
  
  const emailBody = `Dear ${greetingColleague},

I’ve been using this digital Companion Workbook for university lecturers, and wanted to share this Prompt Library template with you. It has been highly useful for creating rigorous, moderation-ready materials:

--------------------------------------------------
TEMPLATE: ${template.title}
DESCRIPTION: ${template.description}

PROMPT TEXT:
"${template.templateText}"
--------------------------------------------------

You can configure and run this prompt directly against Gemini using the interactive builder here:
${appLink}

Best regards,
${senderSignature}`;

  const chatMessage = `Hi ${greetingColleague}! Check out this "${template.title}" prompt from the TUC Lecturer AI Companion. It helps design high-quality materials instantly.

Prompt:
"${template.templateText}"

Try it out here: ${appLink}`;

  const handleCopy = () => {
    const textToCopy = activeChannel === 'email' ? `Subject: ${emailSubject}\n\n${emailBody}` : chatMessage;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div id="share-to-colleague-section" className="bg-white border border-editorial-border rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-editorial-gold/10 text-editorial-gold">
            <Share2 size={15} />
          </span>
          <h4 className="text-xs font-bold text-editorial-accent font-serif uppercase tracking-wider">
            Share to Colleague
          </h4>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            isOpen 
              ? 'bg-editorial-accent text-white border-editorial-accent' 
              : 'bg-editorial-secondary border-editorial-border hover:bg-editorial-accent/5 text-editorial-accent'
          }`}
        >
          <span>{isOpen ? 'Close Share Panel' : 'Open Share Options'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-3 border-t border-editorial-border/60 animate-fadeIn font-sans">
          {/* Quick instructions */}
          <div className="p-3 bg-editorial-secondary/40 border border-editorial-border rounded-lg text-xs text-editorial-text-medium leading-normal flex items-start gap-2">
            <Info size={14} className="text-editorial-gold shrink-0 mt-0.5" />
            <p>
              Generate a pre-formatted message below. Simply customize the names, and either copy the text or launch your system's email client directly.
            </p>
          </div>

          {/* Form customization inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-editorial-text-medium uppercase tracking-wider">
                Colleague's Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Kwesi"
                value={colleagueName}
                onChange={(e) => setColleagueName(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 rounded-lg border border-editorial-border bg-white text-editorial-text-dark outline-none focus:border-editorial-accent transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-editorial-text-medium uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Prof. Daniel"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="w-full text-xs font-sans px-3 py-2 rounded-lg border border-editorial-border bg-white text-editorial-text-dark outline-none focus:border-editorial-accent transition-all"
              />
            </div>
          </div>

          {/* Channels Selection Tabs */}
          <div className="flex border-b border-editorial-border">
            <button
              onClick={() => {
                setActiveChannel('email');
                setCopied(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-[1px] cursor-pointer ${
                activeChannel === 'email'
                  ? 'border-editorial-accent text-editorial-accent font-bold'
                  : 'border-transparent text-editorial-text-light hover:text-editorial-text-medium'
              }`}
            >
              <Mail size={13} />
              <span>Email Template</span>
            </button>
            <button
              onClick={() => {
                setActiveChannel('chat');
                setCopied(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 -mb-[1px] cursor-pointer ${
                activeChannel === 'chat'
                  ? 'border-editorial-accent text-editorial-accent font-bold'
                  : 'border-transparent text-editorial-text-light hover:text-editorial-text-medium'
              }`}
            >
              <MessageSquare size={13} />
              <span>Instant Message / Chat</span>
            </button>
          </div>

          {/* Render Preview Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-editorial-text-light">
              <span>Message Preview</span>
              {activeChannel === 'email' && (
                <span className="font-mono lowercase text-[9px] text-editorial-gold font-bold">
                  Subject: {emailSubject}
                </span>
              )}
            </div>
            <div className="p-3 bg-editorial-secondary border border-editorial-border rounded-lg text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-editorial-text-dark select-all select-text selection:bg-editorial-accent/20">
              {activeChannel === 'email' ? emailBody : chatMessage}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-editorial-border bg-white hover:bg-editorial-secondary rounded-lg text-xs font-semibold uppercase tracking-wider text-editorial-text-medium transition-colors cursor-pointer"
              title="Copy template content to clipboard"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-[#137333]" />
                  <span className="text-[#137333]">Copied Message!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            {activeChannel === 'email' && (
              <button
                onClick={handleSendEmail}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-editorial-accent hover:bg-editorial-accent/90 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                title="Launch your system email software"
              >
                <ExternalLink size={13} />
                <span>Send via Email</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
