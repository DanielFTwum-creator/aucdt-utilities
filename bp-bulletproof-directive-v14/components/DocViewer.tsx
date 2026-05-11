import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Icons } from './Icons';
import { Framework } from '../types';
import { PatentApplication } from './PatentApplication';

interface DocViewerProps {
    isOpen: boolean;
    onClose: () => void;
    currentFramework: Framework;
    completedPhases: number[];
}

const GUIDES = [
    { id: 'admin',   label: 'Admin Guide',           path: '/docs/AdminGuide.md' },
    { id: 'deploy',  label: 'Deployment Guide',       path: '/docs/DeploymentGuide.md' },
    { id: 'testing', label: 'Testing Guide',          path: '/docs/TestingGuide.md' },
    { id: 'gap1',    label: 'Gap Analysis — Phase 1', path: '/docs/GapAnalysis_Phase1.md' },
    { id: 'gap2',    label: 'Gap Analysis — Phase 2', path: '/docs/GapAnalysis_Phase2.md' },
    { id: 'gap3',    label: 'Gap Analysis — Phase 3', path: '/docs/GapAnalysis_Phase3.md' },
    { id: 'gap4',    label: 'Gap Analysis — Phase 4', path: '/docs/GapAnalysis_Phase4.md' },
    { id: 'gap5',    label: 'Gap Analysis — Phase 5', path: '/docs/GapAnalysis_Phase5.md' },
];

// Renders markdown lines as styled React nodes. Internal docs only — not user input.
function renderMarkdown(content: string): React.ReactNode[] {
    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let codeLines: string[] = [];
    let inCode = false;
    let listBuffer: string[] = [];

    const flushList = (key: string) => {
        if (listBuffer.length === 0) return;
        nodes.push(
            <ul key={`ul-${key}`} className="list-disc ml-6 my-2 space-y-1">
                {listBuffer.map((item, i) => (
                    <li key={i} className="text-sm text-text-secondary leading-relaxed">{item}</li>
                ))}
            </ul>
        );
        listBuffer = [];
    };

    lines.forEach((line, i) => {
        if (line.startsWith('```')) {
            if (inCode) {
                nodes.push(
                    <pre key={`code-${i}`} className="bg-bg-tertiary border border-border p-3 rounded-lg overflow-x-auto text-xs font-mono text-text-secondary my-3 whitespace-pre-wrap">
                        {codeLines.join('\n')}
                    </pre>
                );
                codeLines = [];
                inCode = false;
            } else {
                flushList(String(i));
                inCode = true;
            }
            return;
        }

        if (inCode) {
            codeLines.push(line);
            return;
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
            listBuffer.push(line.slice(2));
            return;
        }

        flushList(String(i));

        if (line.startsWith('# ')) {
            nodes.push(<h1 key={i} className="text-2xl font-bold text-text-primary mt-8 mb-3 font-mono">{line.slice(2)}</h1>);
        } else if (line.startsWith('## ')) {
            nodes.push(<h2 key={i} className="text-lg font-bold text-text-primary mt-6 mb-2 font-mono uppercase tracking-wider border-b border-border pb-1">{line.slice(3)}</h2>);
        } else if (line.startsWith('### ')) {
            nodes.push(<h3 key={i} className="text-base font-semibold text-text-primary mt-4 mb-1">{line.slice(4)}</h3>);
        } else if (line.startsWith('---')) {
            nodes.push(<hr key={i} className="border-border my-4" />);
        } else if (line.trim() === '') {
            nodes.push(<div key={i} className="h-2" />);
        } else {
            // Safe: these are static internal .md files, not user input.
            const html = line
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code class="bg-bg-tertiary px-1 rounded text-xs font-mono text-accent-secondary">$1</code>');
            nodes.push(
                <p key={i} className="text-sm text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: html }} />
            );
        }
    });

    flushList('end');
    return nodes;
}

// Strip markdown for plain-text PDF export
function stripMarkdown(content: string): string {
    return content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/#{1,6}\s/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^[-*]\s/gm, '• ')
        .replace(/---/g, '────────────────────')
        .trim();
}

export const DocViewer: React.FC<DocViewerProps> = ({ isOpen, onClose, currentFramework, completedPhases }) => {
    const [activeTab, setActiveTab] = useState<'srs' | 'arch' | 'guides' | 'patent'>('srs');
    const [selectedGuide, setSelectedGuide] = useState<string>('admin');
    const [guideContent, setGuideContent] = useState<string>('');
    const [guideLoading, setGuideLoading] = useState<boolean>(false);
    const [guideError, setGuideError] = useState<string | null>(null);
    const [archExporting, setArchExporting] = useState(false);

    const archRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab !== 'guides') return;
        const guide = GUIDES.find(g => g.id === selectedGuide);
        if (!guide) return;

        setGuideLoading(true);
        setGuideError(null);
        setGuideContent('');

        fetch(guide.path)
            .then(r => {
                if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
                return r.text();
            })
            .then(text => { setGuideContent(text); setGuideLoading(false); })
            .catch(err => { setGuideError(err.message); setGuideLoading(false); });
    }, [activeTab, selectedGuide]);

    // ── PDF exports ──────────────────────────────────────────────────────────

    const exportSrsToPDF = () => {
        const doc = new jsPDF();
        let y = 20;

        const addText = (text: string, size: number, bold = false) => {
            if (y > 275) { doc.addPage(); y = 20; }
            doc.setFontSize(size);
            doc.setFont('helvetica', bold ? 'bold' : 'normal');
            const lines = doc.splitTextToSize(text, 170);
            doc.text(lines, 20, y);
            y += lines.length * (size * 0.4) + 4;
        };

        addText(`${currentFramework.title}`, 20, true);
        addText('Software Requirements Specification  ·  IEEE Std 830-1998  ·  v1.0.0', 10);
        y += 6;

        addText('1. Introduction', 14, true);
        addText(`The ${currentFramework.title} system defines a rigorous quality assurance lifecycle for AI-generated applications.`, 10);
        y += 4;

        addText('2. Implementation Status', 14, true);
        currentFramework.phases.forEach(p => {
            const status = completedPhases.includes(p.id) ? '✓ Complete' : '○ Pending';
            addText(`REQ-${p.id}.0  ${p.title}  —  ${status}`, 10);
        });
        y += 4;

        addText('3. Functional Requirements', 14, true);
        currentFramework.phases.forEach(p => {
            addText(`REQ-${p.id}.0  ${p.title}`, 11, true);
            addText(p.description, 10);
            if (p.deliverables?.length) {
                addText('Deliverables: ' + p.deliverables.join(', '), 9);
            }
            y += 2;
        });

        doc.save(`${currentFramework.id}_SRS.pdf`);
    };

    const exportArchToPDF = async () => {
        if (!archRef.current) return;
        setArchExporting(true);
        try {
            const canvas = await html2canvas(archRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF('l', 'mm', 'a4');
            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();
            const imgH = (canvas.height * pageW) / canvas.width;
            if (imgH <= pageH) {
                doc.addImage(imgData, 'PNG', 0, 0, pageW, imgH);
            } else {
                // Tall content: split across pages
                const ratio = canvas.width / pageW;
                let srcY = 0;
                while (srcY < canvas.height) {
                    const sliceH = Math.min(pageH * ratio, canvas.height - srcY);
                    const sliceCanvas = document.createElement('canvas');
                    sliceCanvas.width = canvas.width;
                    sliceCanvas.height = sliceH;
                    sliceCanvas.getContext('2d')!.drawImage(canvas, 0, -srcY);
                    doc.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 0, 0, pageW, sliceH / ratio);
                    srcY += sliceH;
                    if (srcY < canvas.height) doc.addPage();
                }
            }
            doc.save(`${currentFramework.id}_Architecture.pdf`);
        } finally {
            setArchExporting(false);
        }
    };

    const exportGuideToPDF = () => {
        if (!guideContent) return;
        const guide = GUIDES.find(g => g.id === selectedGuide);
        const doc = new jsPDF();
        let y = 20;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(guide?.label ?? 'Guide', 20, y);
        y += 12;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const plain = stripMarkdown(guideContent);
        const lines = doc.splitTextToSize(plain, 170);
        lines.forEach((line: string) => {
            if (y > 280) { doc.addPage(); y = 20; }
            doc.text(line, 20, y);
            y += 5;
        });

        doc.save(`${guide?.id ?? 'guide'}.pdf`);
    };

    // ─────────────────────────────────────────────────────────────────────────

    if (!isOpen) return null;

    const ExportButton: React.FC<{ onClick: () => void; loading?: boolean; label?: string }> = ({
        onClick, loading = false, label = 'Export PDF'
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg text-xs font-bold hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={label}
        >
            <Icons.Download className="w-3.5 h-3.5" />
            {loading ? 'Exporting…' : label}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-5xl h-[85vh] bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-bg-tertiary/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent-secondary/10 text-accent-secondary">
                            <Icons.FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-mono text-xl font-bold text-text-primary">Project Documentation</h2>
                            <p className="text-xs text-text-muted uppercase tracking-wider">{currentFramework.title}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {(['srs', 'arch', 'guides', 'patent'] as const).map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                aria-pressed={activeTab === tab ? 'true' : 'false'}
                                className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-accent-secondary text-white' : 'bg-bg-tertiary text-text-muted hover:text-text-primary'}`}
                            >
                                {tab === 'srs' ? 'SRS' : tab === 'arch' ? 'Diagrams' : tab === 'guides' ? 'Guides' : 'Patent'}
                            </button>
                        ))}
                    </div>
                    <button onClick={onClose} aria-label="Close documentation" className="p-2 text-text-muted hover:text-text-primary rounded-lg ml-4">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-bg-primary/50">

                    {/* ── SRS ── */}
                    {activeTab === 'srs' && (
                        <div className="max-w-3xl mx-auto animate-fade-in">
                            <div className="flex justify-end mb-4">
                                <ExportButton onClick={exportSrsToPDF} label="Export SRS PDF" />
                            </div>
                            <div className="font-serif text-text-secondary leading-relaxed space-y-8">
                                <div className="border-b border-border/50 pb-8 text-center">
                                    <h1 className="text-3xl font-bold text-text-primary mb-2">Software Requirements Specification</h1>
                                    <p className="font-mono text-sm text-accent-primary">IEEE Std 830-1998 • v1.0.0</p>
                                </div>
                                <section>
                                    <h3 className="font-mono text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">1. Introduction</h3>
                                    <p className="mb-4">The {currentFramework.title} system defines a rigorous quality assurance lifecycle for AI-generated applications.</p>
                                    <div className="bg-bg-secondary p-4 rounded-lg border border-border">
                                        <h4 className="font-bold text-text-primary text-sm mb-2">Current Implementation Status</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {currentFramework.phases.map(p => (
                                                <div key={p.id} className="flex justify-between text-xs">
                                                    <span>{p.title}:</span>
                                                    <span className={completedPhases.includes(p.id) ? 'text-green-500' : 'text-text-muted'}>
                                                        {completedPhases.includes(p.id) ? 'Complete' : 'Pending'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h3 className="font-mono text-lg font-bold text-text-primary mb-4 uppercase tracking-wider">2. Functional Requirements</h3>
                                    <ul className="space-y-4">
                                        {currentFramework.phases.map(p => (
                                            <li key={p.id} className="border-l-2 border-border pl-4">
                                                <h4 className="font-bold text-text-primary text-sm">REQ-{p.id}.0 {p.title}</h4>
                                                <p className="text-sm mt-1">{p.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </div>
                    )}

                    {/* ── Diagrams ── */}
                    {activeTab === 'arch' && (
                        <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
                            <div className="flex justify-end">
                                <ExportButton onClick={exportArchToPDF} loading={archExporting} label="Export Diagrams PDF" />
                            </div>
                            <div ref={archRef} className="space-y-8">
                                <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                                    <h3 className="text-lg font-bold text-text-primary mb-4 font-mono">System Architecture</h3>
                                    <div className="bg-white p-4 rounded-lg overflow-x-auto">
                                        <img src="/docs/Architecture.svg" alt="System Architecture diagram" className="w-full" />
                                    </div>
                                </div>
                                <div className="bg-bg-secondary p-6 rounded-xl border border-border">
                                    <h3 className="text-lg font-bold text-text-primary mb-4 font-mono">Database Structure</h3>
                                    <div className="bg-white p-4 rounded-lg overflow-x-auto">
                                        <img src="/docs/Database.svg" alt="Database structure diagram" className="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Guides ── */}
                    {activeTab === 'guides' && (
                        <div className="animate-fade-in flex gap-6 h-full">
                            {/* Sidebar */}
                            <nav className="w-52 shrink-0" aria-label="Guide navigation">
                                <p className="text-xs font-bold font-mono uppercase tracking-wider text-text-muted mb-3">Documents</p>
                                <ul className="space-y-1">
                                    {GUIDES.map(g => (
                                        <li key={g.id}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedGuide(g.id)}
                                                aria-pressed={selectedGuide === g.id ? 'true' : 'false'}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${selectedGuide === g.id ? 'bg-accent-secondary/10 text-accent-secondary font-bold' : 'text-text-muted hover:text-text-primary hover:bg-bg-tertiary'}`}
                                            >
                                                {g.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="font-mono text-base font-bold text-text-primary uppercase tracking-wider">
                                        {GUIDES.find(g => g.id === selectedGuide)?.label}
                                    </h2>
                                    <ExportButton
                                        onClick={exportGuideToPDF}
                                        label="Export PDF"
                                    />
                                </div>

                                {guideLoading && (
                                    <div className="flex items-center gap-2 text-text-muted text-sm py-12 justify-center">
                                        <div className="w-4 h-4 border-2 border-accent-secondary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                                        Loading…
                                    </div>
                                )}

                                {guideError && !guideLoading && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400" role="alert">
                                        <p className="font-bold mb-1">Failed to load document</p>
                                        <p className="font-mono text-xs">{guideError}</p>
                                    </div>
                                )}

                                {!guideLoading && !guideError && guideContent && (
                                    <article className="prose-sm max-w-none">
                                        {renderMarkdown(guideContent)}
                                    </article>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Patent ── */}
                    {activeTab === 'patent' && <PatentApplication />}
                </div>
            </div>
        </div>
    );
};
