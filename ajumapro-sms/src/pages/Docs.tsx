import { motion } from 'motion/react';

export default function Docs() {
  return (
    <div className="relative z-10 flex flex-col min-h-screen max-w-[820px] mx-auto w-full px-6 py-12">
      <header className="mb-12 border-b border-rule pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="font-playfair font-black text-4xl uppercase text-cream">Documentation</h1>
          <p className="font-cormorant italic text-gold-pale text-xl mt-2">Software Requirements Specification (v3.0.0)</p>
        </div>
        <a href="#/" aria-label="Return to Cover Page" title="Back to Home" className="font-dm text-gold text-xs uppercase tracking-widest hover:text-gold-light transition-colors">← Back to Cover</a>
      </header>

      <article className="prose prose-invert prose-gold max-w-none font-cormorant text-lg text-cream leading-relaxed">
        <h2 className="font-playfair font-bold text-2xl uppercase tracking-wide text-gold mt-8 mb-4">1. Introduction</h2>
        <h3 className="font-bebas text-gold-pale tracking-widest text-lg mt-6 mb-2">1.1 Purpose</h3>
        <p>
          This document specifies the software requirements for the Ajumapro Student Management System (SMS) v3.0.0. It provides a comprehensive overview of the system's architecture, data flow, features, and technical constraints.
        </p>
        
        <h3 className="font-bebas text-gold-pale tracking-widest text-lg mt-6 mb-2">1.2 Scope</h3>
        <p>
          The Ajumapro SMS is a web-based platform designed to manage student data, facilitate administrative tasks, and provide a secure environment for institutional operations. Key features include a public-facing cover page, a secure admin portal, real-time system diagnostics, and an integrated testing suite.
        </p>

        <h2 className="font-playfair font-bold text-2xl uppercase tracking-wide text-gold mt-12 mb-4">2. Overall Description</h2>
        <h3 className="font-bebas text-gold-pale tracking-widest text-lg mt-6 mb-2">2.1 Product Perspective</h3>
        <p>
          The system operates as a Single Page Application (SPA) built with React 19.2.4, Vite, and Tailwind CSS. It communicates with a backend Application Tier (Django/Node.js) and a Data Tier (PostgreSQL/Redis).
        </p>

        <h3 className="font-bebas text-gold-pale tracking-widest text-lg mt-6 mb-2">2.2 System Architecture</h3>
        <p>
          The architecture follows a three-tier model: Presentation, Application, and Data.
        </p>
        <div className="my-8 border border-rule p-4 bg-ink/50">
          <img src="/docs/architecture.svg" alt="System Architecture Diagram" className="w-full h-auto" />
        </div>

        <h3 className="font-bebas text-gold-pale tracking-widest text-lg mt-6 mb-2">2.3 Data Flow</h3>
        <p>
          User requests are routed through an API Gateway, which handles authentication and validation before interacting with the Main DB and Audit DB.
        </p>
        <div className="my-8 border border-rule p-4 bg-ink/50">
          <img src="/docs/data-flow.svg" alt="Data Flow Diagram" className="w-full h-auto" />
        </div>

        <h2 className="font-playfair font-bold text-2xl uppercase tracking-wide text-gold mt-12 mb-4">3. Specific Requirements</h2>
        <h3 className="font-bebas text-gold-pale tracking-widest text-lg mt-6 mb-2">3.1 Functional Requirements</h3>
        <ul className="list-disc pl-6 space-y-2 text-gold-pale my-6">
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR1:</strong> The system shall display a public cover page with Ajumapro branding.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR2:</strong> The system shall provide a secure Admin Portal accessible via `#/admin`.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR3:</strong> The Admin Portal shall require authentication (password: `admin123`).</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR4:</strong> The system shall maintain an immutable Audit Log of all administrative actions.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR5:</strong> The Admin Portal shall include diagnostic tools (Network Latency, etc.).</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR6:</strong> The Admin Portal shall include a DB Monitor for tracking PostgreSQL status.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR7:</strong> The Admin Portal shall feature an interactive Testing Suite to run E2E tests.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">FR8:</strong> The system shall support Light, Dark, and High-Contrast themes.</li>
        </ul>

        <h3 className="font-bebas text-gold-pale tracking-widest text-lg mt-6 mb-2">3.2 Non-Functional Requirements</h3>
        <ul className="list-disc pl-6 space-y-2 text-gold-pale my-6">
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">NFR1 (Technology):</strong> The frontend MUST be built using React 19.2.4.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">NFR2 (Accessibility):</strong> The system MUST achieve 100% ARIA/Tooltip coverage.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">NFR3 (Performance):</strong> The system MUST load the initial cover page in under 2 seconds.</li>
          <li><strong className="text-cream font-dm text-sm uppercase tracking-wider">NFR4 (Security):</strong> All diagnostic and testing features MUST be isolated to `/admin/*` routes.</li>
        </ul>

        <h2 className="font-playfair font-bold text-2xl uppercase tracking-wide text-gold mt-12 mb-4">4. Appendices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 font-dm text-sm">
          <div className="border border-rule p-4 text-center text-gold-pale hover:bg-gold/5 transition-colors">
            <span className="block font-bebas text-lg tracking-widest text-gold mb-1">Admin Guide</span>
            Reference: /docs/admin-guide.md
          </div>
          <div className="border border-rule p-4 text-center text-gold-pale hover:bg-gold/5 transition-colors">
            <span className="block font-bebas text-lg tracking-widest text-gold mb-1">Deployment & Testing</span>
            Reference: /docs/deployment-and-testing.md
          </div>
        </div>

        <div className="mt-12 p-6 border border-green-500/30 bg-green-500/5 text-center">
          <h3 className="font-bebas text-green-500 tracking-widest text-xl mb-2">100% ALIGNMENT VERIFIED</h3>
          <p className="font-dm text-sm text-gold-pale">Gap Analysis Report: /docs/gap-analysis-report.md</p>
        </div>
      </article>
    </div>
  );
}
