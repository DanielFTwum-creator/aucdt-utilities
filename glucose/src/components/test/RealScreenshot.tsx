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
        case 'oauth':
            if (state.step === 'login-view') {
                screenshotName = 'oauth-login-view';
                description = 'LoginView renders with Google sign-in button';
            }
            break;
        case 'scanning':
            if (state.step === 'file-picker') {
                screenshotName = 'data-scan-interface';
                description = 'Scan photo button for AI extraction';
            }
            break;
        case 'data':
            if (state.step === 'entry-modal') {
                screenshotName = 'data-manual-entry-modal';
                description = 'Manual entry modal for adding readings';
            }
            break;
        case 'dashboard':
            if (state.step === 'stats-overview') {
                screenshotName = 'dashboard-stats-overview';
                description = 'Stats cards showing Average Fasting, Post-Meal, Total Readings';
            } else if (state.step === 'month-selector') {
                screenshotName = 'dashboard-month-selector';
                description = 'Month selector dropdown (PERIOD)';
            } else if (state.step === 'export-import') {
                screenshotName = 'dashboard-export-import';
                description = 'Export and Import buttons for data management';
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
