import React, { useState, useMemo } from 'react';

const WorkshopTab: React.FC = () => {
    const [mallType, setMallType] = useState('Luxury Mall');
    const [time, setTime] = useState('Nighttime');
    const [angle, setAngle] = useState('Wide Angle');
    const [useGreenScreen, setUseGreenScreen] = useState(true);

    const generatedPrompt = useMemo(() => {
        let prompt = `A ${angle.toLowerCase()} image of a ${mallType.toLowerCase()} during ${time.toLowerCase()}.`;
        if (useGreenScreen) {
            prompt += " The main subject should be in the foreground, with a flat green screen background for easy replacement.";
        }
        return prompt;
    }, [mallType, time, angle, useGreenScreen]);

    return (
        <div className="space-y-8 animate-fade-in">
            <section>
                <h2 className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">AI Workshop Deep Dive</h2>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">The primary focus of the meeting was Daniel's strategy for the Monday AI workshop. The goal is to shift the faculty's perspective from viewing AI as a cheating tool to seeing it as a powerful creative assistant.</p>
            </section>

            <section>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">The Demo: From Inspiration to Creation</h3>
                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">Daniel's presentation will demonstrate a practical workflow using AI Studio's UI to generate an image from a simple idea and then use that asset in a video editor like CapCut.</p>

                <div className="space-y-6">
                    <div className="text-center text-2xl font-bold text-[var(--color-text-primary)]/40">▼</div>

                    <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h4 className="text-[1.5rem] font-medium text-[var(--color-primary-dark)] mb-4">Step 1 & 2: Idea & AI Studio (Interactive Demo)</h4>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-4">Instead of complex prompting, use simple UI controls to generate a base image. Try the controls below to see how the prompt is built.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label htmlFor="demo-mall-type" className="block text-sm font-medium text-[var(--color-text-primary)]">Mall Type</label>
                                <select id="demo-mall-type" value={mallType} onChange={(e) => setMallType(e.target.value)} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                    <option>Traditional Mall</option>
                                    <option>Lifestyle Outlet</option>
                                    <option>Luxury Mall</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="demo-time" className="block text-sm font-medium text-[var(--color-text-primary)]">Time / Weather</label>
                                <select id="demo-time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                    <option>Daytime</option>
                                    <option>Nighttime</option>
                                    <option>Rain</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="demo-angle" className="block text-sm font-medium text-[var(--color-text-primary)]">Angle</label>
                                <select id="demo-angle" value={angle} onChange={(e) => setAngle(e.target.value)} className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] sm:text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]">
                                    <option>Eye-level</option>
                                    <option>Wide Angle</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input id="demo-green-screen" type="checkbox" checked={useGreenScreen} onChange={(e) => setUseGreenScreen(e.target.checked)} className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--color-surface)]" />
                                    </div>
                                    <div className="ml-2 text-sm">
                                        <label htmlFor="demo-green-screen" className="font-medium text-[var(--color-text-primary)]">Use Green Screen</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--color-background)] p-4 rounded">
                            <p className="text-sm font-semibold text-[var(--color-text-muted)] uppercase">Generated Prompt:</p>
                            <pre className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap font-mono">{generatedPrompt}</pre>
                        </div>
                    </div>

                    <div className="text-center text-2xl font-bold text-[var(--color-text-primary)]/40">▼</div>

                    <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                        <h4 className="text-[1.5rem] font-medium text-[var(--color-primary-dark)] mb-3">Step 3: Edit in CapCut</h4>
                        <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-4">The downloaded image with the green screen is imported into a video editor. The green screen acts as a placeholder for another video layer.</p>
                        <div className="bg-[var(--color-background)] p-4 rounded flex items-center space-x-4">
                            <div className="text-sm p-2 bg-green-200 text-green-800 rounded">Video Layer (Dancers)</div>
                            <div className="text-lg font-bold text-[var(--color-text-muted)]">+</div>
                            <div className="text-sm p-2 bg-[var(--color-primary)]/20 text-[var(--color-primary-dark)] rounded">Image Layer (Mall)</div>
                            <div className="text-lg font-bold text-[var(--color-text-muted)]">=</div>
                            <div className="text-sm p-2 bg-[#2E4034]/20 text-[#2E4034] rounded">Final Composite Video</div>
                        </div>
                    </div>

                    <div className="text-center text-2xl font-bold text-[var(--color-text-primary)]/40">▼</div>

                    <div className="bg-[var(--color-accent)]/30 p-6 rounded-lg border border-[var(--color-accent)]">
                        <h4 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-3">The Point: AI as a Tool</h4>
                        <p className="text-[var(--color-text-primary)] text-base leading-[1.6]">"It's not about the use of AI and previous work. It's about how they are able to use it. <span className="font-bold">How do you utilize artificial intelligence to help you get things done.</span>"</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WorkshopTab;