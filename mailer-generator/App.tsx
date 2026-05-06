import React, { useState } from 'react';
import { Upload, Mail, Eye, Download, Copy, Trash2, Edit3 } from 'lucide-react';

const EmailMailerGenerator = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [generatedMailer, setGeneratedMailer] = useState(null);
  const [template, setTemplate] = useState({
    title: '',
    subtitle: '',
    description: '',
    date: '',
    time: '',
    location: 'Online',
    buttonText: 'Join the webinar',
    greeting: 'Hi {name},'
  });

  const parseEmailContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Extract basic information from email headers and body
    const subjectMatch = content.match(/Subject:\s*(.+?)(?:\n|$)/i);
    const fromMatch = content.match(/From:\s*(.+?)(?:\n|<)/i);
    const toMatch = content.match(/To:\s*(.+?)(?:\n|<)/i);
    const dateHeaderMatch = content.match(/Date:\s*(.+?)(?:\n|$)/i);
    
    // Extract content after the headers (look for actual message content)
    const contentParts = content.split(/--\w+/); // Split on MIME boundaries
    let bodyContent = '';
    
    // Look for text/plain content
    for (const part of contentParts) {
      if (part.includes('Content-Type: text/plain')) {
        const bodyStart = part.indexOf('\n\n');
        if (bodyStart > -1) {
          bodyContent = part.substring(bodyStart).trim();
          break;
        }
      }
    }
    
    // If no plain text found, look for any readable content
    if (!bodyContent) {
      const bodyMatch = content.match(/Content-Transfer-Encoding: quoted-printable\s*\n\n([\s\S]*?)(?=--|\n\n--)/);
      if (bodyMatch) {
        bodyContent = bodyMatch[1].trim();
      }
    }
    
    // Extract name from various sources
    let recipientName = 'Daniel';
    const hiMatch = bodyContent.match(/Hi\s+(\w+)/i);
    const dearMatch = bodyContent.match(/Dear\s+(\w+)/i);
    const helloMatch = bodyContent.match(/Hello\s+(\w+)/i);
    const toEmailMatch = toMatch ? toMatch[1].match(/(\w+)/) : null;
    
    if (hiMatch) recipientName = hiMatch[1];
    else if (dearMatch) recipientName = dearMatch[1];
    else if (helloMatch) recipientName = helloMatch[1];
    else if (toEmailMatch) recipientName = toEmailMatch[1];
    
    // Extract dates and times from content
    const contentDateMatch = bodyContent.match(/(\w+\s+\d{1,2},\s+\d{4})/);
    const contentTimeMatch = bodyContent.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
    const urlMatch = bodyContent.match(/https?:\/\/[^\s<>"]+/);
    
    // Extract subject, clean it up
    let subject = 'Email Notification';
    if (subjectMatch) {
      subject = subjectMatch[1].trim().replace(/^Re:\s*/i, '').replace(/^Fwd:\s*/i, '');
    }
    
    // Parse date header
    let parsedDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (contentDateMatch) {
      parsedDate = contentDateMatch[1];
    } else if (dateHeaderMatch) {
      try {
        const date = new Date(dateHeaderMatch[1]);
        if (!isNaN(date)) {
          parsedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      } catch (e) {
        // Keep default date
      }
    }
    
    return {
      subject: subject,
      date: parsedDate,
      time: contentTimeMatch ? contentTimeMatch[1] : '12:00 PM',
      name: recipientName,
      content: content,
      bodyContent: bodyContent,
      fromEmail: fromMatch ? fromMatch[1].trim() : '',
      toEmail: toMatch ? toMatch[1].trim() : '',
      extractedUrl: urlMatch ? urlMatch[0] : ''
    };
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsed = parseEmailContent(content);
        
        const newEmail = {
          id: Date.now() + Math.random(),
          filename: file.name,
          content: content,
          parsed: parsed,
          uploadTime: new Date().toLocaleString()
        };
        
        setEmails(prev => [...prev, newEmail]);
      };
      reader.readAsText(file);
    });
    
    event.target.value = '';
  };

  const generateMailer = (email) => {
    const mailerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title || email.parsed.subject}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 40px 20px 30px;
            background-color: #ffffff;
        }
        .logo {
            margin-bottom: 30px;
        }
        .content {
            display: flex;
            align-items: center;
            padding: 0 40px 40px;
            gap: 40px;
        }
        .text-content {
            flex: 1;
        }
        .title {
            font-size: 48px;
            font-weight: 400;
            line-height: 1.2;
            margin: 0 0 20px 0;
            color: #202124;
        }
        .subtitle {
            font-size: 18px;
            color: #5f6368;
            margin-bottom: 30px;
            line-height: 1.5;
        }
        .event-details {
            margin-bottom: 30px;
        }
        .date-time {
            font-size: 16px;
            font-weight: 500;
            color: #202124;
            margin-bottom: 8px;
        }
        .location {
            font-size: 14px;
            color: #5f6368;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .cta-button {
            background-color: #1a73e8;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .cta-button:hover {
            background-color: #1557b0;
        }
        .visual {
            width: 200px;
            height: 150px;
            background: linear-gradient(135deg, #f8bbd9 0%, #e6a8d0 50%, #d498c7 100%);
            border-radius: 8px;
            position: relative;
            overflow: hidden;
        }
        .visual::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 160px;
            height: 80px;
            background: rgba(255,255,255,0.3);
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        .visual::after {
            content: '';
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 40px;
            background: rgba(255,255,255,0.5);
            border-radius: 4px;
        }
        .greeting {
            margin-bottom: 20px;
            font-weight: 500;
        }
        .google-colors {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 400;
        }
        @media (max-width: 600px) {
            .content {
                flex-direction: column;
                padding: 0 20px 30px;
                gap: 20px;
            }
            .title {
                font-size: 36px;
            }
            .visual {
                width: 100%;
                max-width: 200px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <svg width="140" height="40" viewBox="0 0 140 40">
                    <text x="0" y="28" class="google-colors" style="font-size: 24px; font-family: 'Google Sans', sans-serif;">AsanSka Cloud</text>
                </svg>
            </div>
        </div>
        
        <div class="content">
            <div class="text-content">
                <h1 class="title">${template.title || email.parsed.subject}</h1>
                <p class="subtitle">${template.subtitle || template.description}</p>
                
                <div class="event-details">
                    <div class="date-time">${template.date || email.parsed.date}    ${template.time || email.parsed.time} BST</div>
                    <div class="location">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                        </svg>
                        ${template.location}
                    </div>
                </div>
                
                <a href="#" class="cta-button">${template.buttonText}</a>
            </div>
            
            <div class="visual"></div>
        </div>
        
        <div style="padding: 0 40px 40px;">
            <p class="greeting">${template.greeting.replace('{name}', email.parsed.name)}</p>
            <p style="color: #5f6368; line-height: 1.6;">
                Learn how to leverage AI agents to transform ideas into profitable business solutions in this interactive session.
                <br><br>
                Are you ready to unlock the revenue potential of AI agents? This session is your guide to turning innovative ideas into scalable business solutions. We'll show you how intelligent agents can automate processes, enhance customer experiences, and create new revenue streams for your organization.
            </p>
        </div>
    </div>
</body>
</html>`;

    setGeneratedMailer({
      html: mailerHtml,
      email: email
    });
  };

  const downloadHtml = () => {
    if (!generatedMailer) return;
    
    const blob = new Blob([generatedMailer.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mailer-${generatedMailer.email.parsed.subject.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHtml = () => {
    if (!generatedMailer) return;
    navigator.clipboard.writeText(generatedMailer.html);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Email Mailer Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your emails into beautiful, professional mailers with Google Cloud styling
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upload and Email List */}
          <div className="xl:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                <Upload size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Upload Emails</h2>
            </div>
            
            <div className="mb-8">
              <input
                type="file"
                accept=".txt,.eml,.msg"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="group flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-indigo-300 rounded-2xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4 group-hover:shadow-lg transition-shadow">
                  <Upload size={32} className="text-white" />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drop your files here
                </p>
                <p className="text-sm text-gray-500 text-center">
                  or click to browse<br />
                  <span className="text-xs">Supports .txt, .eml, .msg files</span>
                </p>
              </label>
            </div>
            
            {/* Email List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Mail size={18} />
                Uploaded Emails ({emails.length})
              </h3>
              {emails.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No emails uploaded yet</p>
                  <p className="text-sm">Upload some files to get started</p>
                </div>
              ) : (
                emails.map(email => (
                  <div
                    key={email.id}
                    className={`group p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                      selectedEmail?.id === email.id
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm bg-white'
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-1 rounded-lg ${selectedEmail?.id === email.id ? 'bg-indigo-500' : 'bg-gray-400 group-hover:bg-indigo-400'} transition-colors`}>
                            <Mail size={12} className="text-white" />
                          </div>
                          <h3 className="font-semibold text-sm text-gray-800 truncate">{email.filename}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                          <span className="font-medium">Subject:</span> {email.parsed.subject}
                        </p>
                        {email.parsed.fromEmail && (
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            <span className="font-medium">From:</span> {email.parsed.fromEmail}
                          </p>
                        )}
                        {email.parsed.extractedUrl && (
                          <p className="text-xs text-blue-600 mb-1 truncate">
                            <span className="font-medium">URL:</span> {email.parsed.extractedUrl}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {email.uploadTime}
                          </p>
                          {selectedEmail?.id === email.id && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                              Selected
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEmails(prev => prev.filter(e => e.id !== email.id));
                          if (selectedEmail?.id === email.id) {
                            setSelectedEmail(null);
                            setGeneratedMailer(null);
                          }
                        }}
                        className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Template Editor */}
          <div className="xl:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Edit3 size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Template Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={template.title}
                  onChange={(e) => setTemplate({...template, title: e.target.value})}
                  placeholder="Drive Revenue and Monetize Your Ideas with Agents"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-gray-300 bg-white/50"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate({...template, description: e.target.value})}
                  placeholder="Learn how to leverage AI agents to transform ideas into profitable business solutions in this interactive session..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-gray-300 bg-white/50 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={template.date}
                    onChange={(e) => setTemplate({...template, date: e.target.value})}
                    placeholder="August 27, 2025"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-gray-300 bg-white/50"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    value={template.time}
                    onChange={(e) => setTemplate({...template, time: e.target.value})}
                    placeholder="7:00 PM–7:45 PM"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-gray-300 bg-white/50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={template.location}
                    onChange={(e) => setTemplate({...template, location: e.target.value})}
                    placeholder="Online"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-gray-300 bg-white/50"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={template.buttonText}
                    onChange={(e) => setTemplate({...template, buttonText: e.target.value})}
                    placeholder="Join the webinar"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-gray-300 bg-white/50"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Greeting Template
                </label>
                <input
                  type="text"
                  value={template.greeting}
                  onChange={(e) => setTemplate({...template, greeting: e.target.value})}
                  placeholder="Hi {name},"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-gray-300 bg-white/50"
                />
                <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">
                  💡 Use <code className="bg-gray-200 px-1 rounded">{'{name}'}</code> to automatically insert the recipient's name
                </p>
              </div>
            </div>
            
            <button
              onClick={() => selectedEmail && generateMailer(selectedEmail)}
              disabled={!selectedEmail}
              className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <Mail size={20} />
              {selectedEmail ? 'Generate Mailer' : 'Select an Email First'}
            </button>
          </div>

          {/* Preview Column */}
          {generatedMailer && (
            <div className="xl:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <Eye size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={copyHtml}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 flex items-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <button
                    onClick={downloadHtml}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-600 flex items-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-inner bg-white">
                <iframe
                  srcDoc={generatedMailer.html}
                  className="w-full h-[600px]"
                  title="Email Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailMailerGenerator;