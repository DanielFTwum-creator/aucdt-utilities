import React from 'react';
import { ScreenshotState } from './testRunner';

/**
 * Visual reference mockups of test scenarios.
 *
 * For REAL screenshots of the actual running application, run:
 *   pnpm run test:e2e:screenshots
 *
 * This uses Playwright to capture actual browser screenshots
 * and saves them to public/screenshots/e2e/
 */

interface MockScreenshotProps {
    state: ScreenshotState;
}

const ScreenContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white p-0 rounded-lg border border-slate-300 w-full h-80 overflow-hidden relative shadow-inner">
        <div className="absolute top-0 left-0 right-0 h-6 bg-slate-100 flex items-center px-2">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1.5"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1.5"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        <div className="pt-6 h-full overflow-y-auto text-xs">{children}</div>
    </div>
);

const OAuthScreen: React.FC<{ step: 'login-view' | 'oauth-popup' | 'authenticated' | 'profile' }> = ({ step }) => {
    if (step === 'login-view') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
                    <div className="border-[2.5px] border-[#1F3864] text-[#1F3864] px-4 py-2 text-2xl font-bold rounded-lg mb-6" style={{ fontFamily: 'Fraunces, serif' }}>ROPHE</div>
                    <h1 className="font-bold text-slate-900 mb-2 text-lg">Blood Glucose Monitoring</h1>
                    <p className="text-[#2E75B6] text-xs mb-8 font-semibold">Sign in to track your glucose levels</p>
                    <button className="w-full bg-[#2E75B6] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#1F3864] transition-colors">
                        Continue with Google
                    </button>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'oauth-popup') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-4">
                    <div className="w-10 h-10 border-4 border-[#2E75B6] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 text-xs font-semibold">Google authentication popup opening...</p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'authenticated') {
        return (
            <ScreenContainer>
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="border-[2.5px] border-[#1F3864] text-[#1F3864] px-2 py-1 text-sm font-bold rounded" style={{ fontFamily: 'Fraunces, serif' }}>ROPHE</div>
                        <div>
                            <h1 className="text-xs font-bold text-slate-900">Blood Glucose Monitoring</h1>
                            <p className="text-[10px] text-[#2E75B6] font-semibold">Dashboard loaded</p>
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                    <div className="w-11 h-11 rounded-full bg-[#D6E4F0] text-[#1F3864] font-bold flex items-center justify-center text-sm">PT</div>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</p>
                        <p className="text-xs font-semibold text-slate-900">Daniel Twum</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm">DR</div>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Attending Physician</p>
                        <p className="text-xs font-semibold text-slate-900">Dr Yacoba Atiase</p>
                    </div>
                </div>
            </div>
        </ScreenContainer>
    );
};

const AdminScreen: React.FC<{ step: 'admin-modal' | 'admin-error' | 'admin-success' | 'admin-panel' }> = ({ step }) => {
    if (step === 'admin-modal') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
                    <div className="w-full max-w-xs">
                        <h2 className="font-bold text-slate-900 mb-4 text-base text-center">🔐 Admin Access</h2>
                        <div className="space-y-3">
                            <input type="password" placeholder="Enter admin password" className="w-full text-xs p-3 border-2 border-slate-300 rounded-lg focus:border-[#2E75B6]" />
                            <button className="w-full bg-[#2E75B6] text-white px-4 py-2.5 rounded-lg font-bold text-xs hover:bg-[#1F3864] transition-colors">Unlock Admin Panel</button>
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'admin-error') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
                    <div className="w-full max-w-xs">
                        <h2 className="font-bold text-slate-900 mb-4 text-base text-center">🔐 Admin Access</h2>
                        <div className="space-y-2">
                            <input type="password" placeholder="Enter admin password" className="w-full text-xs p-3 border-2 border-red-300 rounded-lg" />
                            <p className="text-red-600 text-xs font-semibold text-center">Incorrect password. Try again.</p>
                            <button className="w-full bg-[#2E75B6] text-white px-4 py-2.5 rounded-lg font-bold text-xs">Unlock Admin Panel</button>
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'admin-success') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-green-50">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 text-2xl">✓</div>
                    <p className="text-green-700 font-bold text-sm">Access Granted</p>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="p-4 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-2">📋 Audit Log</h3>
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5 border border-slate-200">
                    <p className="text-slate-700 font-medium">Admin Login • 2026-05-16 14:32</p>
                    <p className="text-slate-700 font-medium">Image Scanned • 5 readings extracted</p>
                    <p className="text-slate-700 font-medium">Data Exported • backup.json</p>
                </div>
            </div>
        </ScreenContainer>
    );
};

const ScanningScreen: React.FC<{ step: 'file-picker' | 'scanning-progress' | 'scan-complete' | 'readings-displayed' }> = ({ step }) => {
    if (step === 'file-picker') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-amber-50">
                    <p className="text-slate-600 text-xs mb-6 text-center">Select an image with handwritten glucose readings</p>
                    <label className="w-full max-w-xs bg-[#D4A373] text-[#1F3864] px-6 py-3 rounded-lg font-bold text-sm text-center cursor-pointer hover:bg-[#C29560] transition-colors">
                        📷 Choose File
                    </label>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'scanning-progress') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-amber-50">
                    <div className="w-12 h-12 border-4 border-[#D4A373] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-700 text-xs font-bold mb-4">Extracting readings...</p>
                    <div className="w-full max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D4A373] rounded-full transition-all" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-2">45%</p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'scan-complete') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-green-50">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
                    <p className="text-green-700 font-bold text-sm">23 readings extracted</p>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="p-3 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Extracted Readings</p>
                <table className="w-full text-[10px]">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="px-2 py-1 text-left font-bold">Date</th>
                            <th className="px-2 py-1 text-center font-bold">Fasting</th>
                            <th className="px-2 py-1 text-center font-bold">Post-Meal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b hover:bg-blue-50">
                            <td className="px-2 py-1">May 15, 2026</td>
                            <td className="px-2 py-1 text-center font-semibold">5.2</td>
                            <td className="px-2 py-1 text-center font-semibold">7.1</td>
                        </tr>
                        <tr className="hover:bg-blue-50">
                            <td className="px-2 py-1">May 14, 2026</td>
                            <td className="px-2 py-1 text-center font-semibold">5.8</td>
                            <td className="px-2 py-1 text-center font-semibold">8.3</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ScreenContainer>
    );
};

const DataScreen: React.FC<{ step: 'entry-modal' | 'date-picker' | 'data-saved' | 'table-updated' | 'delete-success' }> = ({ step }) => {
    if (step === 'entry-modal') {
        return (
            <ScreenContainer>
                <div className="p-4 space-y-3">
                    <h2 className="font-bold text-slate-900 mb-2 text-sm">📝 Log Glucose Reading</h2>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Date</p>
                        <input type="date" className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg focus:border-[#2E75B6]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Fasting</p>
                            <input type="number" placeholder="—" className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">2h Post-Meal</p>
                            <input type="number" placeholder="—" className="w-full text-xs p-2.5 border-2 border-slate-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'date-picker') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-4 bg-blue-50">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Date of Measurement</p>
                    <input type="date" value="2026-05-16" className="w-full text-xs p-3 border-2 border-blue-300 rounded-lg bg-white" />
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'data-saved') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-green-50">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
                    <p className="text-green-700 font-bold text-sm">Reading saved successfully</p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'table-updated') {
        return (
            <ScreenContainer>
                <div className="p-3 space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">May 2026 Data</p>
                    <table className="w-full text-[10px]">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="px-2 py-1 text-left font-bold">Date</th>
                                <th className="px-2 py-1 text-center font-bold">Fasting</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-blue-100 border-b">
                                <td className="px-2 py-1">May 16, 2026</td>
                                <td className="px-2 py-1 text-center font-bold text-blue-600">5.4</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="h-full flex flex-col items-center justify-center p-6 bg-red-50">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">🗑</div>
                <p className="text-red-700 font-bold text-sm">Reading deleted</p>
            </div>
        </ScreenContainer>
    );
};

const DashboardScreen: React.FC<{ step: 'stats-overview' | 'month-selector' | 'agp-graph' | 'help-guide' | 'export-import' }> = ({ step }) => {
    if (step === 'stats-overview') {
        return (
            <ScreenContainer>
                <div className="p-3 space-y-2.5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Stats Cards</p>
                    <div className="grid grid-cols-3 gap-1.5">
                        <div className="border-2 border-red-200 rounded-lg p-2 bg-red-50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Fasting</p>
                            <p className="text-base font-bold text-red-600 mt-1">7.2</p>
                            <span className="inline-block text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded mt-1 font-bold">HIGH</span>
                        </div>
                        <div className="border-2 border-blue-200 rounded-lg p-2 bg-blue-50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Post-Meal</p>
                            <p className="text-base font-bold text-slate-400 mt-1">—</p>
                        </div>
                        <div className="border-2 border-slate-200 rounded-lg p-2 bg-slate-50">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                            <p className="text-base font-bold text-slate-900 mt-1">24</p>
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'month-selector') {
        return (
            <ScreenContainer>
                <div className="p-4 space-y-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Period Selector</p>
                    <div className="border-2 border-slate-200 rounded-lg p-2.5 bg-white">
                        <select className="w-full text-xs p-1.5 bg-transparent border-0 font-bold text-[#1F3864] focus:outline-none cursor-pointer">
                            <option>May 2026</option>
                            <option>April 2026</option>
                            <option>March 2026</option>
                        </select>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Filters all dashboard data by selected month</p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'agp-graph') {
        return (
            <ScreenContainer>
                <div className="p-4 space-y-2">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Glucose Trend</p>
                    <div className="bg-white rounded-lg border-2 border-slate-200 p-3">
                        <div className="h-20 flex items-end justify-around gap-1 px-2">
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-1.5 h-12 bg-emerald-500 rounded-t mb-1"></div>
                                <p className="text-[8px] text-slate-500">6am</p>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-1.5 h-16 bg-orange-400 rounded-t mb-1"></div>
                                <p className="text-[8px] text-slate-500">12pm</p>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-1.5 h-14 bg-blue-500 rounded-t mb-1"></div>
                                <p className="text-[8px] text-slate-500">6pm</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600">Daily glucose variation trend</p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'help-guide') {
        return (
            <ScreenContainer>
                <div className="p-4 space-y-2">
                    <div className="bg-blue-100 border-l-4 border-[#2E75B6] rounded-r-lg p-3 mb-2">
                        <p className="text-xs font-bold text-[#1F3864] uppercase tracking-widest">❓ ROPHE Guide</p>
                        <p className="text-[10px] text-blue-900 mt-2 font-semibold">What is a Reading?</p>
                        <p className="text-[10px] text-blue-800 mt-1">One reading = one day with up to 6 glucose measurements</p>
                    </div>
                    <div className="bg-orange-50 border-l-4 border-amber-500 rounded-r-lg p-2.5 text-[10px]">
                        <p className="font-bold text-slate-900 mb-1">How to Add Readings:</p>
                        <p className="text-slate-700">• Manual Entry</p>
                        <p className="text-slate-700">• Scan Photo (AI extraction)</p>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="p-4 space-y-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Data Management</p>
                <div className="flex gap-2">
                    <button className="flex-1 text-xs font-bold px-3 py-2.5 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors">⬇ Export</button>
                    <button className="flex-1 text-xs font-bold px-3 py-2.5 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors">⬆ Import</button>
                </div>
                <p className="text-xs text-slate-600">Backup and restore glucose data as JSON</p>
            </div>
        </ScreenContainer>
    );
};

const ThemeScreen: React.FC<{ step: 'theme-toggle' | 'unit-switch' | 'logout-complete' | 'login-fresh' }> = ({ step }) => {
    if (step === 'theme-toggle') {
        return (
            <ScreenContainer>
                <div className="h-full bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
                    <p className="text-xs font-bold mb-4 uppercase tracking-widest">🌙 High Contrast Theme</p>
                    <div className="bg-black border-2 border-white p-4 rounded-lg text-center">
                        <p className="text-sm font-bold">HIGH CONTRAST MODE</p>
                        <p className="text-xs text-gray-300 mt-2">Enhanced visibility for all users</p>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'unit-switch') {
        return (
            <ScreenContainer>
                <div className="p-4 space-y-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unit Conversion</p>
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                        <button className="flex-1 text-xs font-bold px-3 py-2 bg-white text-[#1F3864] rounded-md border-2 border-slate-200">mmol/L</button>
                        <button className="flex-1 text-xs font-bold px-3 py-2 text-slate-600">mg/dL</button>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs text-slate-700">Fasting reading: <span className="font-bold text-[#1F3864]">5.2 mmol/L</span></p>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'logout-complete') {
        return (
            <ScreenContainer>
                <div className="h-full flex flex-col items-center justify-center p-6 bg-amber-50">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">🚪</div>
                    <p className="text-amber-700 font-bold text-sm">Signing out...</p>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
                <div className="border-[2.5px] border-[#1F3864] text-[#1F3864] px-4 py-2 text-2xl font-bold rounded-lg mb-3" style={{ fontFamily: 'Fraunces, serif' }}>ROPHE</div>
                <h1 className="font-bold text-slate-900 text-sm mb-1">Blood Glucose Monitoring</h1>
                <p className="text-[#2E75B6] text-xs font-semibold">Ready for fresh login</p>
            </div>
        </ScreenContainer>
    );
};

export const MockScreenshot: React.FC<MockScreenshotProps> = ({ state }) => {
    switch (state.type) {
        case 'oauth':
            return <OAuthScreen step={state.step} />;
        case 'admin':
            return <AdminScreen step={state.step} />;
        case 'scanning':
            return <ScanningScreen step={state.step} />;
        case 'data':
            return <DataScreen step={state.step} />;
        case 'theme':
            return <ThemeScreen step={state.step} />;
        case 'dashboard':
            return <DashboardScreen step={state.step} />;
    }
};
