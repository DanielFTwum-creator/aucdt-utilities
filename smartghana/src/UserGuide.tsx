import React from 'react';
import { X, BookOpen, Eye, Share2, Download, MapPin, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserGuide({ isOpen, onClose }: UserGuideProps) {
  if (!isOpen) return null;

  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Understanding the Proposal',
      content: [
        'SmartGhana presents a strategic alliance between Techbridge (Ghana-based) and SmartBridge (India-based) to deliver Ghana\'s One Million Coders Programme.',
        'The interactive proposal showcases how both organizations\' strengths complement each other to create a locally-responsive, globally-scalable solution.'
      ]
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Navigating the Interface',
      content: [
        'Use the navigation menu to explore different sections: Why Techbridge, Programme Details, Platform Features, Track Record, Impact Metrics, and Implementation Timeline.',
        'Scroll through each section to see detailed information, charts, and comparisons. All sections are accessible via keyboard navigation.'
      ]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Key Metrics & Visualizations',
      content: [
        'Charts and graphs throughout the proposal show growth projections, regional coverage, and programme impact.',
        'Hover over (or focus on) chart elements to see detailed values. Charts are keyboard-accessible and include alt text for screen readers.'
      ]
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Downloading the Alliance Brief',
      content: [
        'Click the "Download Alliance Brief" button to export a formal A4 PDF document suitable for government submission.',
        'The PDF is print-optimized and includes all key sections: strategic vision, programme structure, economic impact, and call to action.'
      ]
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Sharing & Installation',
      content: [
        'SmartGhana is a Progressive Web App (PWA). On mobile devices, tap "Share" or "Add to Home Screen" to install it locally.',
        'The app works offline after the first visit, making it accessible even with intermittent internet connectivity.'
      ]
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: 'Accessibility Features',
      content: [
        'All text is UK British English for clarity and consistency.',
        'The interface supports keyboard navigation (Tab, Enter, Escape).',
        'Images include descriptive alt text. Charts are accessible to screen readers.',
        'Colour contrast meets WCAG AA standards for readability.'
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0f2545] to-[#1a3a5c] text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              <h2 className="text-2xl font-bold">User Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close user guide"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Introduction */}
            <section>
              <p className="text-gray-700 leading-relaxed">
                Welcome to SmartGhana. This guide will help you navigate the interactive proposal
                and understand the strategic alliance between Techbridge and SmartBridge for Ghana's
                One Million Coders Programme.
              </p>
            </section>

            {/* Sections */}
            {sections.map((section, idx) => (
              <motion.section
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FCD116] rounded-lg flex items-center justify-center text-[#0f2545]">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0f2545] mb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-gray-600 leading-relaxed flex gap-2">
                          <span className="text-[#FCD116] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>
            ))}

            {/* Footer */}
            <section className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <strong>Need help?</strong> Contact daniel.twum@techbridge.edu.gh for technical
                support or questions about the proposal.
              </p>
            </section>
          </div>

          {/* Action Button */}
          <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#0f2545] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
