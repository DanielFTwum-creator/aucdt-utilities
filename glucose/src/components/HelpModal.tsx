import React from 'react';
import { X, Calendar, Edit3, Camera, TrendingUp } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1F3864] to-[#2E75B6] px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Fraunces, serif' }}>
              ROPHE Guide
            </h1>
            <p className="text-blue-100 text-sm mt-1">Blood Glucose Monitoring</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/20 transition-colors"
            aria-label="Close help"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-xl font-bold text-[#1F3864] mb-3">What is a Reading?</h2>
            <div className="bg-blue-50 border-l-4 border-[#2E75B6] p-4 rounded">
              <p className="text-slate-700 mb-3">
                <strong>One reading = one complete day of glucose tests</strong>
              </p>
              <p className="text-slate-600 text-sm">
                Each reading captures up to 6 measurements throughout your day:
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E75B6]"></div>
                  <span>Fasting (morning)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E75B6]"></div>
                  <span>Post-Breakfast</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E75B6]"></div>
                  <span>Pre-Lunch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E75B6]"></div>
                  <span>Post-Lunch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E75B6]"></div>
                  <span>Pre-Dinner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E75B6]"></div>
                  <span>Post-Dinner</span>
                </div>
              </div>
            </div>
          </section>

          {/* How to Add Readings */}
          <section>
            <h2 className="text-xl font-bold text-[#1F3864] mb-4">How to Add Readings</h2>

            {/* Manual Entry */}
            <div className="mb-6 border-l-4 border-orange-400 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Edit3 className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-slate-900">Manual Entry</h3>
              </div>
              <p className="text-slate-600 text-sm mb-3">
                Enter readings manually as you test throughout the day
              </p>
              <div className="bg-orange-50 p-4 rounded space-y-2 text-sm">
                <p><strong>Step 1:</strong> Click "Manual Entry" button</p>
                <p><strong>Step 2:</strong> Select the date (defaults to today)</p>
                <p><strong>Step 3:</strong> Enter test values as you measure them</p>
                <p><strong>Step 4:</strong> Click "Save Record"</p>
                <p className="text-orange-700 mt-2">
                  💡 <strong>Tip:</strong> You can add to the same date multiple times. Each save will merge with existing values for that day.
                </p>
              </div>
            </div>

            {/* Scan Photo */}
            <div className="border-l-4 border-amber-400 pl-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900">Scan Photo</h3>
              </div>
              <p className="text-slate-600 text-sm mb-3">
                Upload a photo of your handwritten glucose log, and AI extracts all readings automatically
              </p>
              <div className="bg-amber-50 p-4 rounded space-y-2 text-sm">
                <p><strong>Step 1:</strong> Click "Scan Photo" button</p>
                <p><strong>Step 2:</strong> Choose an image with your glucose readings</p>
                <p><strong>Step 3:</strong> Wait for AI to extract the data</p>
                <p><strong>Step 4:</strong> Review and confirm imported readings</p>
                <p className="text-amber-700 mt-2">
                  💡 <strong>Tip:</strong> Works best with clear, legible handwriting in a table format.
                </p>
              </div>
            </div>
          </section>

          {/* Understanding the Dashboard */}
          <section>
            <h2 className="text-xl font-bold text-[#1F3864] mb-4">Dashboard Overview</h2>

            <div className="space-y-4">
              {/* Stats Cards */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Stats Cards (Top Row)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-red-50 p-3 rounded border border-red-200">
                    <p className="font-semibold text-red-900">Average Fasting</p>
                    <p className="text-slate-600 text-xs mt-1">Average of all fasting readings for this month</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="font-semibold text-blue-900">Avg Post-Meal</p>
                    <p className="text-slate-600 text-xs mt-1">Average of all post-meal readings</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <p className="font-semibold text-slate-900">Total Readings</p>
                    <p className="text-slate-600 text-xs mt-1">Count of all readings in database</p>
                  </div>
                </div>
              </div>

              {/* Month Selector */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Month Selector</h4>
                <p className="text-slate-600 text-sm">
                  The dropdown labeled "PERIOD" lets you view data from different months. The grid below shows only readings from the selected month.
                </p>
              </div>

              {/* Color Legend */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Color Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                    </div>
                    <span><strong>Green:</strong> Normal range (meeting targets)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 border-2 border-sky-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-sky-600"></div>
                    </div>
                    <span><strong>Blue:</strong> Low range (below 4.0 mmol/L)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    </div>
                    <span><strong>Red:</strong> High alert (exceeds target)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Units */}
          <section className="bg-slate-50 p-4 rounded-xl">
            <h3 className="font-semibold text-slate-900 mb-2">Unit Conversion</h3>
            <p className="text-slate-600 text-sm mb-3">
              Use the unit toggle (mmol/L / mg/dL) in the header to switch between measurement systems. All readings are converted automatically.
            </p>
            <div className="text-xs text-slate-500">
              <p>• <strong>mmol/L</strong> (millimoles per liter) — standard in many countries</p>
              <p>• <strong>mg/dL</strong> (milligrams per decilitre) — standard in USA</p>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-xl font-bold text-[#1F3864] mb-4">Quick Tips</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-[#2E75B6] font-bold">→</span>
                <span>Test before meals (fasting, pre-lunch, pre-dinner) and 2 hours after meals</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E75B6] font-bold">→</span>
                <span>You can leave fields empty if you didn't test at that time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E75B6] font-bold">→</span>
                <span>Use "Print Report" to generate a PDF for your doctor</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E75B6] font-bold">→</span>
                <span>Export your data regularly as backup (Download button)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E75B6] font-bold">→</span>
                <span>High contrast mode (Eye icon) helps with visibility</span>
              </li>
            </ul>
          </section>

          {/* Close Button */}
          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full bg-[#2E75B6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1F3864] transition-colors"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
