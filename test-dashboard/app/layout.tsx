import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cypress Test Dashboard | TUC ICT',
  description: 'Real-time Cypress E2E test suite monitoring and analytics dashboard for Techbridge University College',
  keywords: ['testing', 'cypress', 'e2e', 'dashboard', 'techbridge', 'tuc', 'qa'],
  authors: [{ name: 'Daniel Frempong Twum', url: 'https://techbridge.edu.gh' }],
  creator: 'Techbridge University College - ICT Department',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%233b82f6'>🧪</text></svg>" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect fill='%231e293b' width='180' height='180'/><text x='50%' y='50%' text-anchor='middle' dy='0.3em' font-size='120' fill='%233b82f6'>🧪</text></svg>" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-700 mt-16 py-8 px-4 bg-slate-800/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-white font-bold mb-2">🧪 Cypress Test Dashboard</h3>
                  <p className="text-slate-400 text-sm">
                    Real-time E2E test monitoring for Techbridge University College
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    v1.0 • Built with React, Next.js & Cypress
                  </p>
                </div>
                <div className="text-sm text-slate-400">
                  <p>© 2026 Techbridge University College</p>
                  <p className="text-xs text-slate-500 mt-1">ICT Department • Quality Assurance</p>
                </div>
              </div>
              <div className="border-t border-slate-700 mt-6 pt-6">
                <p className="text-xs text-slate-500 text-center">
                  For development and testing purposes only. Contact: daniel.twum@techbridge.edu.gh
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
