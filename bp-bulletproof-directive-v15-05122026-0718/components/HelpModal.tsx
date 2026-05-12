import React from 'react';
import { Icons } from './Icons';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-primary font-mono">Help & Support</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                        <Icons.X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-8">
                    <section>
                        <h3 className="text-lg font-bold text-text-primary mb-3">Frequently Asked Questions</h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-bg-tertiary border border-border">
                                <h4 className="font-bold text-text-primary">How do I start a new framework?</h4>
                                <p className="text-sm text-text-secondary">Select a framework from the dashboard grid to load its specific phases.</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-lg font-bold text-text-primary mb-3">User Guides</h3>
                        <p className="text-sm text-text-secondary">Access comprehensive documentation by clicking the "Docs" button in the header.</p>
                    </section>
                    <section>
                        <h3 className="text-lg font-bold text-text-primary mb-3">Troubleshooting</h3>
                        <p className="text-sm text-text-secondary">If you encounter issues, try resetting your progress or checking the Admin Diagnostics panel.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};
