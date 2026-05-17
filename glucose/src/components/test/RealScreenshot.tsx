import React from 'react';
import { ScreenshotState } from './testRunner';

/**
 * Real Screenshots Component
 * Displays actual Playwright-captured screenshots
 * Following BioChemAI pattern with mock visual representations
 */

interface RealScreenshotProps {
    state: ScreenshotState;
}

const getScreenshotPath = (name: string): string => {
    return `./screenshots/e2e/${name}.png`;
};

export const RealScreenshot: React.FC<RealScreenshotProps> = ({ state }) => {
    let screenshotName = '';
    let description = '';

    // Map test states to screenshot files
    switch (state.type) {
        case 'auth':
            if (state.step === 'login-password-empty') {
                screenshotName = 'login-password-empty';
                description = 'Password gate (empty state)';
            } else if (state.step === 'login-password-filled') {
                screenshotName = 'login-password-filled';
                description = 'Password gate (filled)';
            }
            break;
        case 'dashboard':
            if (state.step === 'dashboard-default') {
                screenshotName = 'dashboard-default';
                description = 'Full dashboard with stats, chart, and readings table';
            }
            break;
        case 'table':
            if (state.step === 'table-empty-state') {
                screenshotName = 'table-empty-state';
                description = 'Empty table state (no readings)';
            }
            break;
        case 'scan':
            if (state.step === 'scan-interface') {
                screenshotName = 'scan-interface';
                description = 'Scan photo button in dashboard header';
            } else if (state.step === 'scan-overlay-progress') {
                screenshotName = 'scan-overlay-progress';
                description = 'Scanning progress overlay (40% complete)';
            } else if (state.step === 'scan-overlay-success') {
                screenshotName = 'scan-overlay-success';
                description = 'Scan success overlay (readings extracted)';
            } else if (state.step === 'scan-overlay-error') {
                screenshotName = 'scan-overlay-error';
                description = 'Scan error overlay (extraction failed)';
            }
            break;
    }

    const screenshotPath = screenshotName ? getScreenshotPath(screenshotName) : '';

    return (
        <div className="w-full rounded-lg border-2 border-slate-300 overflow-hidden bg-white shadow-sm">
            {/* Browser Chrome */}
            <div className="bg-slate-100 h-6 flex items-center px-2 gap-1.5 border-b border-slate-300">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>

            {/* Screenshot Container */}
            <div className="w-full h-80 bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative">
                {screenshotPath ? (
                    <>
                        <img
                            src={screenshotPath}
                            alt={description}
                            className="max-w-full max-h-full object-contain"
                            onError={() => {
                                // Image not found - render placeholder
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/10 to-transparent px-4 py-2">
                            <p className="text-xs text-slate-700 font-semibold">{description}</p>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <p className="text-sm text-slate-500 mb-2">Screenshot</p>
                        <p className="text-xs text-slate-400">{screenshotName || 'loading...'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
