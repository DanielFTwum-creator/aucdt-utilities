import React from 'react';
import { ScreenshotState } from './testRunner';

interface MockScreenshotProps {
    state: ScreenshotState;
}

const ScreenContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-300 w-full h-80 overflow-hidden relative shadow-inner">
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
                <div className="text-center p-4">
                    <div className="border-2 border-[#1F3864] text-[#1F3864] px-3 py-1 text-lg font-bold rounded mb-4">ROPHE</div>
                    <h1 className="font-semibold text-slate-900 mb-1">Blood Glucose Monitoring</h1>
                    <p className="text-slate-500 text-xs mb-6">Sign in to track your glucose levels</p>
                    <button className="w-full bg-[#2E75B6] text-white px-4 py-2 rounded font-semibold text-sm">Continue with Google</button>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'oauth-popup') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <div className="w-8 h-8 border-4 border-[#2E75B6] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-600 text-xs">Google authentication popup opening...</p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'authenticated') {
        return (
            <ScreenContainer>
                <div className="p-3 space-y-2">
                    <div className="border-b pb-2">
                        <div className="border-[2.5px] px-2 py-0.5 text-sm font-bold border-[#1F3864] text-[#1F3864] rounded w-fit">ROPHE</div>
                        <h1 className="text-sm font-bold text-slate-900">Blood Glucose Monitoring</h1>
                    </div>
                    <div className="flex gap-2 p-2 border rounded-lg bg-blue-50">
                        <div className="w-8 h-8 rounded-full bg-[#D6E4F0] text-[#1F3864] font-bold flex items-center justify-center text-xs shrink-0">PT</div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-400 font-bold">Patient Name</p>
                            <p className="text-xs font-semibold text-slate-900">John Doe</p>
                            <p className="text-xs text-green-600 mt-1">✓ Auto-populated from Google profile</p>
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="p-3 space-y-3">
                <div className="border-b pb-2">
                    <div className="border-[2.5px] px-2 py-0.5 text-sm font-bold border-[#1F3864] text-[#1F3864] rounded w-fit">ROPHE</div>
                    <h1 className="text-sm font-bold text-slate-900">Blood Glucose Monitoring</h1>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded-lg p-2 bg-slate-50">
                        <p className="text-xs text-slate-400 font-bold">Patient Name</p>
                        <p className="text-xs font-semibold text-slate-900">John Doe</p>
                        <p className="text-xs text-green-600 mt-1">✓ Auto-filled</p>
                    </div>
                    <div className="border rounded-lg p-2 bg-white">
                        <p className="text-xs text-slate-400 font-bold">Attending Physician</p>
                        <input type="text" placeholder="Dr. Smith" className="w-full text-xs p-1 border rounded bg-white" />
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
                <div className="text-center p-4">
                    <h2 className="font-bold text-slate-900 mb-3 text-sm">Admin Access</h2>
                    <input type="password" placeholder="Enter password" className="w-full text-xs p-2 border rounded mb-3" />
                    <button className="w-full bg-[#2E75B6] text-white px-3 py-2 rounded font-semibold text-xs">Unlock</button>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'admin-error') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <h2 className="font-bold text-slate-900 mb-3 text-sm">Admin Access</h2>
                    <input type="password" placeholder="Enter password" className="w-full text-xs p-2 border rounded mb-2" />
                    <p className="text-red-500 text-xs mb-3">Incorrect password. Please try again.</p>
                    <button className="w-full bg-[#2E75B6] text-white px-3 py-2 rounded font-semibold text-xs">Unlock</button>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'admin-success') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">✓</div>
                    <p className="text-green-600 font-semibold text-xs">Access Granted</p>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="p-3 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs mb-2">Audit Log</h3>
                <div className="bg-slate-50 p-2 rounded text-xs space-y-1">
                    <p className="text-slate-600">Admin Login - 2026-05-16 14:32</p>
                    <p className="text-slate-600">Image Scanned - 5 readings extracted</p>
                    <p className="text-slate-600">Data Exported - backup.json</p>
                </div>
            </div>
        </ScreenContainer>
    );
};

const ScanningScreen: React.FC<{ step: 'file-picker' | 'scanning-progress' | 'scan-complete' | 'readings-displayed' }> = ({ step }) => {
    if (step === 'file-picker') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <p className="text-slate-600 text-xs mb-4">Select an image containing glucose readings...</p>
                    <button className="w-full bg-[#D4A373] text-[#1F3864] px-4 py-2 rounded font-semibold text-sm">Choose File</button>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'scanning-progress') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <div className="w-10 h-10 border-4 border-[#D4A373] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-slate-600 text-xs font-semibold">Processing image...</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3">
                        <div className="h-full bg-[#D4A373] rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'scan-complete') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">✓</div>
                    <p className="text-green-600 font-semibold text-xs">23 readings extracted</p>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="p-2 space-y-2">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="px-1 py-1 text-left">Date</th>
                            <th className="px-1 py-1 text-center">Fasting</th>
                            <th className="px-1 py-1 text-center">Post-Meal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="px-1 py-1">May 15, 2026</td>
                            <td className="px-1 py-1 text-center">5.2</td>
                            <td className="px-1 py-1 text-center">7.1</td>
                        </tr>
                        <tr>
                            <td className="px-1 py-1">May 14, 2026</td>
                            <td className="px-1 py-1 text-center">5.8</td>
                            <td className="px-1 py-1 text-center">8.3</td>
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
                <div className="p-4">
                    <h2 className="font-bold text-slate-900 mb-3 text-sm">Log Glucose Reading</h2>
                    <div className="space-y-2">
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Date</p>
                            <input type="date" className="w-full text-xs p-2 border rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">Fasting</p>
                                <input type="number" placeholder="—" className="w-full text-xs p-2 border rounded" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1">Post-Meal</p>
                                <input type="number" placeholder="—" className="w-full text-xs p-2 border rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'date-picker') {
        return (
            <ScreenContainer>
                <div className="p-4">
                    <p className="text-xs text-slate-500 font-bold mb-2">Date of Measurement</p>
                    <input type="date" value="2026-05-16" className="w-full text-xs p-2 border rounded bg-blue-50" />
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'data-saved') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">✓</div>
                    <p className="text-green-600 font-semibold text-xs">Reading saved successfully</p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'table-updated') {
        return (
            <ScreenContainer>
                <div className="p-2">
                    <p className="text-xs text-slate-600 font-bold mb-2">May 2026 Data (1 new)</p>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="px-1 py-1 text-left">#</th>
                                <th className="px-1 py-1 text-left">Date</th>
                                <th className="px-1 py-1 text-center">Fasting</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-blue-50">
                                <td className="px-1 py-1">01</td>
                                <td className="px-1 py-1">May 16, 2026</td>
                                <td className="px-1 py-1 text-center font-bold">5.4</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="text-center p-4">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">🗑</div>
                <p className="text-red-600 font-semibold text-xs">Reading deleted</p>
            </div>
        </ScreenContainer>
    );
};

const ThemeScreen: React.FC<{ step: 'theme-toggle' | 'unit-switch' | 'logout-complete' | 'login-fresh' }> = ({ step }) => {
    if (step === 'theme-toggle') {
        return (
            <ScreenContainer>
                <div className="p-4">
                    <p className="text-xs text-slate-600 font-bold mb-2">Theme: High Contrast</p>
                    <div className="bg-black text-white p-3 rounded text-xs font-bold">HIGH CONTRAST MODE</div>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'unit-switch') {
        return (
            <ScreenContainer>
                <div className="p-4">
                    <div className="flex gap-2 mb-3">
                        <button className="flex-1 text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-900">mmol/L</button>
                        <button className="flex-1 text-xs font-bold px-2 py-1 border border-slate-300 rounded text-slate-600">mg/dL</button>
                    </div>
                    <p className="text-xs text-slate-600">Fasting: <span className="font-bold">5.2 mmol/L</span></p>
                </div>
            </ScreenContainer>
        );
    }
    if (step === 'logout-complete') {
        return (
            <ScreenContainer>
                <div className="text-center p-4">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">→</div>
                    <p className="text-slate-600 font-semibold text-xs">Logging out...</p>
                </div>
            </ScreenContainer>
        );
    }
    return (
        <ScreenContainer>
            <div className="text-center p-4">
                <div className="border-2 border-[#1F3864] text-[#1F3864] px-3 py-1 text-lg font-bold rounded mb-4">ROPHE</div>
                <h1 className="font-semibold text-slate-900 text-sm mb-1">Blood Glucose Monitoring</h1>
                <p className="text-slate-500 text-xs">Ready for fresh login</p>
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
    }
};
