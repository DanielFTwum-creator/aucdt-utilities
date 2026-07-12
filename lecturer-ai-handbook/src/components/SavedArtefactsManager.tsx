import { useState } from 'react';
import { Briefcase, Calendar, Copy, Check, Trash2, Eye, EyeOff, FileText, Download, Tag, Plus, X } from 'lucide-react';
import { SavedArtefact } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

// Helper: Escape raw HTML strings
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Helper: Parse basic inline markdown tags
function parseInlineMarkdown(text: string): string {
  let res = escapeHtml(text);
  // Strong: **text**
  res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Bold alternate: __text__
  res = res.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Emphasis: *text*
  res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Italic alternate: _text_
  res = res.replace(/_([^_]+)_/g, '<em>$1</em>');
  // Inline code: `code`
  res = res.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  return res;
}

// Helper: Main markdown-to-HTML compiler for high-fidelity print rendering
function markdownToHtml(md: string): string {
  if (!md) return '';
  const lines = md.split('\n');
  let inList = false;
  let inNumList = false;
  let inTable = false;
  let inBlockquote = false;
  let tableHeaderParsed = false;
  let htmlLines: string[] = [];
  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCode) {
        htmlLines.push('</code></pre>');
        inCode = false;
      } else {
        htmlLines.push('<pre><code>');
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      htmlLines.push(escapeHtml(line));
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      htmlLines.push('<hr style="border: 0; border-top: 1px solid #D1CEC7; margin: 20px 0;" />');
      continue;
    }

    // Handle Tables
    if (line.trim().startsWith('|')) {
      if (!inTable) {
        if (inList) { htmlLines.push('</ul>'); inList = false; }
        if (inNumList) { htmlLines.push('</ol>'); inNumList = false; }
        if (inBlockquote) { htmlLines.push('</blockquote>'); inBlockquote = false; }
        
        htmlLines.push('<table>');
        inTable = true;
        tableHeaderParsed = false;
      }
      
      // Separator row
      if (line.includes('---') || line.includes(':---') || line.includes('---:')) {
        continue;
      }
      
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      htmlLines.push('<tr>');
      cells.forEach(cell => {
        const parsedCell = parseInlineMarkdown(cell);
        if (!tableHeaderParsed) {
          htmlLines.push(`<th>${parsedCell}</th>`);
        } else {
          htmlLines.push(`<td>${parsedCell}</td>`);
        }
      });
      htmlLines.push('</tr>');
      
      if (!tableHeaderParsed) {
        tableHeaderParsed = true;
      }
      continue;
    } else if (inTable) {
      htmlLines.push('</table>');
      inTable = false;
    }

    // Handle blockquotes
    if (line.trim().startsWith('>')) {
      if (!inBlockquote) {
        if (inList) { htmlLines.push('</ul>'); inList = false; }
        if (inNumList) { htmlLines.push('</ol>'); inNumList = false; }
        htmlLines.push('<blockquote>');
        inBlockquote = true;
      }
      const text = line.trim().substring(1).trim();
      htmlLines.push(`<p>${parseInlineMarkdown(text)}</p>`);
      continue;
    } else if (inBlockquote) {
      htmlLines.push('</blockquote>');
      inBlockquote = false;
    }

    // Headings
    if (line.startsWith('#### ')) {
      htmlLines.push(`<h4>${parseInlineMarkdown(line.substring(5))}</h4>`);
    } else if (line.startsWith('### ')) {
      htmlLines.push(`<h3>${parseInlineMarkdown(line.substring(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      htmlLines.push(`<h2>${parseInlineMarkdown(line.substring(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      htmlLines.push(`<h1>${parseInlineMarkdown(line.substring(2))}</h1>`);
    }
    // Bullet lists
    else if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('+ ')) {
      if (!inList) {
        if (inNumList) { htmlLines.push('</ol>'); inNumList = false; }
        htmlLines.push('<ul>');
        inList = true;
      }
      const text = line.trim().substring(2);
      htmlLines.push(`<li>${parseInlineMarkdown(text)}</li>`);
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(line.trim())) {
      if (!inNumList) {
        if (inList) { htmlLines.push('</ul>'); inList = false; }
        htmlLines.push('<ol>');
        inNumList = true;
      }
      const match = line.trim().match(/^\d+\.\s(.*)/);
      const text = match ? match[1] : '';
      htmlLines.push(`<li>${parseInlineMarkdown(text)}</li>`);
    }
    // Empty line
    else if (line.trim() === '') {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      if (inNumList) { htmlLines.push('</ol>'); inNumList = false; }
    }
    // Normal paragraph
    else {
      if (inList) { htmlLines.push('</ul>'); inList = false; }
      if (inNumList) { htmlLines.push('</ol>'); inNumList = false; }
      htmlLines.push(`<p>${parseInlineMarkdown(line)}</p>`);
    }
  }

  if (inList) htmlLines.push('</ul>');
  if (inNumList) htmlLines.push('</ol>');
  if (inTable) htmlLines.push('</table>');
  if (inBlockquote) htmlLines.push('</blockquote>');

  return htmlLines.join('\n');
}

interface SavedArtefactsManagerProps {
  artefacts: SavedArtefact[];
  onDeleteArtefact: (id: string) => void;
  onUpdateArtefact: (updated: SavedArtefact) => void;
}

export default function SavedArtefactsManager({
  artefacts,
  onDeleteArtefact,
  onUpdateArtefact,
}: SavedArtefactsManagerProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compile list of unique tags for filtering
  const allTagsSet = new Set<string>();
  artefacts.forEach((art) => {
    if (art.tags) {
      art.tags.forEach((tag) => {
        const trimmed = tag.trim();
        if (trimmed) allTagsSet.add(trimmed);
      });
    }
  });
  const allTags = Array.from(allTagsSet).sort();

  const filtered = artefacts.filter((art) => {
    const matchesType = filterType === 'all' || art.type === filterType;
    const matchesTag = filterTag === 'all' || (art.tags && art.tags.includes(filterTag));
    return matchesType && matchesTag;
  });

  const categories = [
    { value: 'all', label: 'All Saved Artefacts' },
    { value: 'outline', label: 'Course Outlines' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'rubric', label: 'Rubrics' },
    { value: 'slides', label: 'Lecture Slides' },
    { value: 'feedback', label: 'Student Feedbacks' },
    { value: 'polish', label: 'Polished Drafts' },
  ];

  const addTag = (art: SavedArtefact) => {
    const tagText = (newTagInputs[art.id] || '').trim();
    if (!tagText) return;

    const currentTags = art.tags || [];
    if (currentTags.includes(tagText)) {
      setNewTagInputs((prev) => ({ ...prev, [art.id]: '' }));
      return;
    }

    const updatedArt: SavedArtefact = {
      ...art,
      tags: [...currentTags, tagText],
    };
    onUpdateArtefact(updatedArt);
    setNewTagInputs((prev) => ({ ...prev, [art.id]: '' }));
  };

  const removeTag = (art: SavedArtefact, tagToRemove: string) => {
    const currentTags = art.tags || [];
    const updatedArt: SavedArtefact = {
      ...art,
      tags: currentTags.filter((t) => t !== tagToRemove),
    };
    onUpdateArtefact(updatedArt);
  };

  // PDF Generation Style Header Definition
  const getPdfStyleHeader = () => `
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
      @page {
        size: A4;
        margin: 20mm 15mm;
      }
      body {
        font-family: "Inter", sans-serif;
        color: #1A1A1A;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background: #ffffff;
        font-size: 10.5pt;
      }
      .header {
        border-bottom: 2px solid #002147;
        padding-bottom: 12px;
        margin-bottom: 24px;
      }
      .institution {
        font-size: 8.5pt;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #002147;
        font-weight: 700;
        margin: 0;
      }
      .subtitle {
        font-size: 8pt;
        color: #D4AF37;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 2px;
      }
      h1 {
        font-family: "Lora", Georgia, serif;
        font-size: 20pt;
        font-weight: 700;
        color: #002147;
        margin: 12px 0 6px 0;
        line-height: 1.2;
      }
      .meta-info {
        font-size: 8.5pt;
        color: #5C5850;
        margin-bottom: 4px;
      }
      .type-badge {
        display: inline-block;
        background: #F2EFE9;
        color: #002147;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 7.5pt;
        font-weight: 700;
        text-transform: uppercase;
        border: 1px solid #D1CEC7;
      }
      .content {
        margin-top: 10px;
      }
      h2 {
        font-family: "Lora", Georgia, serif;
        font-size: 14pt;
        font-weight: 600;
        color: #002147;
        border-bottom: 1px solid #D1CEC7;
        padding-bottom: 4px;
        margin-top: 24px;
        margin-bottom: 12px;
        page-break-after: avoid;
      }
      h3 {
        font-family: "Lora", Georgia, serif;
        font-size: 12pt;
        font-weight: 600;
        color: #002147;
        margin-top: 18px;
        margin-bottom: 8px;
        page-break-after: avoid;
      }
      h4 {
        font-family: "Lora", Georgia, serif;
        font-size: 10.5pt;
        font-weight: 600;
        color: #002147;
        margin-top: 14px;
        margin-bottom: 6px;
        page-break-after: avoid;
      }
      p {
        margin: 0 0 10px 0;
        text-align: justify;
      }
      ul, ol {
        margin: 0 0 14px 0;
        padding-left: 20px;
      }
      li {
        margin-bottom: 5px;
      }
      blockquote {
        margin: 0 0 14px 0;
        padding: 8px 16px;
        background: #F9F7F2;
        border-left: 3px solid #D4AF37;
        color: #5C5850;
        font-style: italic;
      }
      code {
        font-family: "JetBrains Mono", monospace;
        background: #F2EFE9;
        padding: 1px 4px;
        border-radius: 3px;
        font-size: 9pt;
        color: #1A1A1A;
      }
      pre {
        font-family: "JetBrains Mono", monospace;
        background: #F9F7F2;
        border: 1px solid #D1CEC7;
        padding: 10px;
        border-radius: 6px;
        overflow-x: auto;
        font-size: 8.5pt;
        margin: 0 0 14px 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 18px 0;
        font-size: 9pt;
        page-break-inside: avoid;
      }
      th, td {
        border: 1px solid #D1CEC7;
        padding: 8px 10px;
        text-align: left;
      }
      th {
        background-color: #F2EFE9;
        color: #002147;
        font-weight: 700;
      }
      tr:nth-child(even) td {
        background-color: #F9F7F2;
      }
      .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 7.5pt;
        color: #8C887D;
        border-top: 1px solid #E5E3DF;
        padding-top: 8px;
        display: none;
      }
      @media print {
        .footer {
          display: block;
        }
      }
    </style>
  `;

  // Function to print a single saved artefact as a beautifully styled PDF
  const downloadSinglePDF = (art: SavedArtefact) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const htmlContent = markdownToHtml(art.content);

    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${escapeHtml(art.title)}</title>
          ${getPdfStyleHeader()}
        </head>
        <body>
          <div class="header">
            <div class="institution">University College AI Ambassadors</div>
            <div class="subtitle">Digital Training Workspace — Monday Morning Dossier</div>
            <h1>${escapeHtml(art.title)}</h1>
            <div class="meta-info">
              <span class="type-badge">${escapeHtml(art.type)}</span>
              <span style="margin: 0 8px;">&bull;</span>
              Generated on ${escapeHtml(art.createdAt)}
            </div>
          </div>
          
          <div class="content">
            ${htmlContent}
          </div>

          <div class="footer">
            University College AI Ambassadors Onboarding Program &copy; ${new Date().getFullYear()} &bull; Academic Integration Initiative
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 3000);
    }, 1000);
  };

  // Function to print all currently filtered saved artefacts as a single, combined PDF document (Dossier)
  const downloadAllPDFs = (arts: SavedArtefact[]) => {
    if (arts.length === 0) return;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const compiledDocuments = arts.map((art, index) => {
      const htmlContent = markdownToHtml(art.content);
      return `
        <div class="document-section" style="${index > 0 ? 'page-break-before: always; margin-top: 30px;' : ''}">
          <div class="header">
            <div class="institution">University College AI Ambassadors</div>
            <div class="subtitle">Digital Training Workspace — Monday Morning Dossier</div>
            <h1>${escapeHtml(art.title)}</h1>
            <div class="meta-info">
              <span class="type-badge">${escapeHtml(art.type)}</span>
              <span style="margin: 0 8px;">&bull;</span>
              Generated on ${escapeHtml(art.createdAt)}
            </div>
          </div>
          
          <div class="content">
            ${htmlContent}
          </div>
        </div>
      `;
    }).join('\n');

    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>University College AI Ambassadors - Combined Dossier</title>
          ${getPdfStyleHeader()}
        </head>
        <body>
          ${compiledDocuments}

          <div class="footer">
            University College AI Ambassadors Onboarding Program &copy; ${new Date().getFullYear()} &bull; Academic Integration Initiative
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 3000);
    }, 1000);
  };

  return (
    <section id="lecturer-briefcase" className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border font-sans">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent flex items-center gap-2.5">
            <Briefcase size={22} className="text-editorial-gold" />
            Your Onboarding Briefcase
          </h2>
          <p className="text-sm text-editorial-text-medium">
            Access, review, copy, and manage all syllabi, quizzes, and rubrics generated during this training session.
          </p>
        </div>

        {/* Filter bar and Dossier Download */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {filtered.length > 0 && (
            <button
              onClick={() => downloadAllPDFs(filtered)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white bg-editorial-accent hover:bg-editorial-accent/90 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow"
              title="Download all currently filtered items in a single compiled PDF dossier"
            >
              <Download size={14} />
              <span>Download Dossier ({filtered.length})</span>
            </button>
          )}

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-bold uppercase tracking-wider text-editorial-accent bg-white border border-editorial-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent transition-all cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} ({artefacts.filter((art) => c.value === 'all' || art.type === c.value).length})
              </option>
            ))}
          </select>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="text-xs font-bold uppercase tracking-wider text-editorial-accent bg-white border border-editorial-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-editorial-accent/10 focus:border-editorial-accent transition-all cursor-pointer"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag} ({artefacts.filter((art) => art.tags && art.tags.includes(tag)).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-editorial-border bg-editorial-secondary/20 max-w-xl mx-auto space-y-3 font-sans">
          <div className="w-10 h-10 bg-white border border-editorial-border rounded-full flex items-center justify-center text-editorial-text-light mx-auto">
            <Briefcase size={18} />
          </div>
          <h3 className="text-xs font-bold text-editorial-accent uppercase tracking-wider">Briefcase Empty</h3>
          <p className="text-xs text-editorial-text-medium max-w-sm mx-auto leading-relaxed">
            Run prompting workspaces or prompt templates in any of the tabs above and click <strong>"Save"</strong> to save them here for Monday morning.
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 gap-4 font-sans">
          {filtered.map((art) => {
            const isExpanded = expandedId === art.id;
            return (
              <div
                key={art.id}
                className={`border rounded-xl transition-all duration-200 ${
                  isExpanded
                    ? 'border-editorial-accent/20 bg-editorial-secondary/15 shadow-sm'
                    : 'border-editorial-border bg-white hover:border-editorial-accent/60'
                }`}
              >
                {/* Brief Title Bar */}
                <div className="flex items-center justify-between p-4 sm:p-5 gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 bg-editorial-accent/10 text-editorial-accent rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-editorial-accent truncate font-serif">
                        {art.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-editorial-text-light font-mono">
                        <span className="bg-editorial-secondary px-1.5 py-0.5 rounded text-editorial-accent font-bold uppercase border border-editorial-border/40">
                          {art.type}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {art.createdAt}
                        </span>
                      </div>

                      {/* Tagging System UI */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        {/* Display existing tags */}
                        {art.tags && art.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-editorial-accent/5 text-editorial-accent border border-editorial-border hover:border-editorial-accent/30 transition-all"
                          >
                            <Tag size={9} className="text-editorial-gold" />
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTag(art, tag);
                              }}
                              className="text-editorial-text-light hover:text-red-600 ml-0.5 transition-colors cursor-pointer flex items-center justify-center"
                              title={`Remove tag: ${tag}`}
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}

                        {/* Add new tag form */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            addTag(art);
                          }}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="text"
                            placeholder="Add course/subject tag..."
                            value={newTagInputs[art.id] || ''}
                            onChange={(e) => setNewTagInputs((prev) => ({ ...prev, [art.id]: e.target.value }))}
                            className="text-[10px] font-sans px-2 py-0.5 rounded border border-editorial-border outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent/10 w-28 placeholder:text-editorial-text-light"
                          />
                          <button
                            type="submit"
                            className="p-1 rounded bg-editorial-secondary border border-editorial-border hover:bg-editorial-accent hover:text-white transition-all cursor-pointer flex items-center justify-center text-editorial-accent"
                            title="Add tag"
                          >
                            <Plus size={10} />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : art.id)}
                      className="p-2 hover:bg-editorial-secondary rounded-lg text-editorial-text-light hover:text-editorial-accent transition-colors cursor-pointer"
                      title={isExpanded ? 'Hide output' : 'Expand & read output'}
                    >
                      {isExpanded ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>

                    <button
                      onClick={() => copyToClipboard(art.id, art.content)}
                      className="p-2 hover:bg-editorial-secondary rounded-lg text-editorial-text-light hover:text-editorial-accent transition-colors cursor-pointer"
                      title="Copy complete markdown content"
                    >
                      {copiedId === art.id ? (
                        <Check size={15} className="text-[#137333] animate-scale" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>

                    <button
                      onClick={() => downloadSinglePDF(art)}
                      className="p-2 hover:bg-editorial-secondary rounded-lg text-editorial-text-light hover:text-editorial-accent transition-colors cursor-pointer"
                      title="Download as fully-formatted A4 PDF"
                    >
                      <Download size={15} />
                    </button>

                    <button
                      onClick={() => onDeleteArtefact(art.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-editorial-text-light hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete from Briefcase"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Expanded content view */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-editorial-border/60 pt-4 bg-white rounded-b-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-editorial-secondary border border-editorial-border/60">
                      <div className="text-xs text-editorial-text-medium leading-relaxed font-sans">
                        <span className="font-bold text-editorial-accent block text-[10px] uppercase tracking-wider mb-0.5">Quick Export Panel</span>
                        Ready to migrate this generated text directly into your LMS (Moodle, Sakai) or outlook email draft.
                      </div>
                      <button
                        onClick={() => copyToClipboard(art.id, art.content)}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-editorial-accent hover:bg-editorial-accent/90 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
                      >
                        {copiedId === art.id ? (
                          <>
                            <Check size={14} className="text-white" />
                            <span>Copied Content!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>Copy to Clipboard</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="overflow-x-auto max-h-[350px] border border-editorial-border/40 rounded-lg p-4 bg-[#FAFAFA]">
                      <MarkdownRenderer content={art.content} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

