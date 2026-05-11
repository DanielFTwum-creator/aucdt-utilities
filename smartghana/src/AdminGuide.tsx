import React, { useState } from 'react';
import { X, Lock, Shield, Settings, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PASSWORD = 'admin@smartghana2026'; // Change to env var in production

export default function AdminGuide({ isOpen, onClose }: AdminGuideProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isOpen) return null;

  const adminSections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Content Management',
      content: [
        'All proposal content is stored in App.tsx as mock data.',
        'To update figures, timelines, or metrics, edit the data constants in src/App.tsx.',
        'Changes take effect immediately upon rebuild and redeployment.',
        'Keep the structure consistent to avoid breaking charts and tables.'
      ]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Configuration & Deployment',
      content: [
        'Deploy changes via pnpm deploy command, which builds and SCP\'s dist/ to techbridge.edu.gh.',
        'Ensure SSH access to root@techbridge.edu.gh is configured.',
        'The app auto-updates via service worker when new code is deployed.',
        'Monitor PWA caching by checking DevTools → Application → Service Workers.'
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: 'Known Limitations & Phase 3 Blockers',
      content: [
        'API Key Security: Gemini API key is embedded in the JS bundle. Before Play Store/App Store submission, move to backend proxy.',
        'External Assets: TUC logo and SmartBridge logo load from techbridge.edu.gh. Download locally for offline reliability.',
        'Print Mechanism: window.print() fails in Capacitor WebView. Replace with @capacitor/share for native apps.',
        'Bundle Size: Main JS chunk is 247 KB (gzip). Consider further code splitting if adding new major features.'
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security & Maintenance',
      content: [
        'Change ADMIN_PASSWORD in AdminGuide.tsx to a strong, unique password. Move to environment variables in production.',
        'Regular backups: Ensure techbridge.edu.gh server backups include /smartghana/ directory.',
        'Dependency updates: Run pnpm update quarterly to patch security vulnerabilities.',
        'Monitor error logs: Set up server-side logging to catch runtime issues.'
      ]
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Testing & QA',
      content: [
        'Local testing: pnpm dev runs the dev server on localhost:3000.',
        'Build testing: pnpm build followed by pnpm preview tests production bundle.',
        'PWA testing: DevTools → Application → Service Workers, toggle offline mode.',
        'PDF export: pnpm run export-pdf generates Alliance Brief PDF.',
        'E2E tests: pnpm test:e2e runs Playwright test suite (currently stale, needs updating).'
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Git Workflow & Versioning',
      content: [
        'All work is on branch claude/pdf-showcase-prototype-yuiXV.',
        'Push to main only after comprehensive testing and sign-off.',
        'Version bumps: Update package.json version field following semver (major.minor.patch).',
        'Tag releases: git tag -a v1.0.0 -m "Release message" for production deployments.'
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
          <div className="bg-gradient-to-r from-red-900 to-red-700 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Admin Guide</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close admin guide"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Lock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-900 text-sm">
                    This section is password-protected for administrators only.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Password
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2545] focus:border-transparent"
                      autoComplete="current-password"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#0f2545] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors font-medium"
                  >
                    Access Admin Guide
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto"
              >
                {/* Admin introduction */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700 font-medium">
                      Authentication successful. You now have access to admin documentation.
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    This guide is for TUC staff responsible for maintaining and updating SmartGhana.
                    Review each section carefully before making changes to the production app.
                  </p>
                </section>

                {/* Admin sections */}
                {adminSections.map((section, idx) => (
                  <motion.section
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-700">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#0f2545] mb-2">
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.content.map((item, i) => (
                            <li key={i} className="text-gray-600 leading-relaxed flex gap-2 text-sm">
                              <span className="text-red-600 mt-0.5">•</span>
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
                  <p className="text-xs text-gray-500">
                    <strong>Last updated:</strong> May 2026 | <strong>Version:</strong> 1.0.0
                  </p>
                </section>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          {isAuthenticated && (
            <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Log Out
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#0f2545] text-white rounded-lg hover:bg-[#1a3a5c] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
