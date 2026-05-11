import React from 'react';

const DocsHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] border-b-2 border-[var(--color-accent-primary)] pb-2 mb-4 mt-8">
        {children}
    </h2>
);

const DocsSubHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-6 mb-3">
        {children}
    </h3>
);

const DocsSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="prose max-w-none prose-p:text-[var(--color-text-secondary)]">
        {children}
    </div>
);


const SvgDefs: React.FC = () => (
    <defs>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="4" result="offsetblur"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: 'var(--color-bg-tertiary)'}} />
            <stop offset="100%" style={{stopColor: 'var(--color-bg-secondary)'}} />
        </linearGradient>
        <linearGradient id="user-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="browser-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="api-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        <marker id="arrow-marker" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-text-accent)" />
        </marker>
        <style>
          {`
            .diagram-font { font-family: var(--font-sans); }
            .diagram-title { font-size: 24px; font-weight: bold; fill: var(--color-text-primary); }
            .diagram-box-title { font-size: 16px; font-weight: bold; fill: #f9fafb; }
            .diagram-text { font-size: 14px; fill: var(--color-text-secondary); }
            .diagram-subtext { font-size: 12px; fill: var(--color-text-tertiary); }
            .diagram-arrow { stroke: var(--color-text-accent); stroke-width: 2; marker-end: url(#arrow-marker); }
            .diagram-line { stroke: var(--color-border-secondary); stroke-width: 1.5; }
            .diagram-dash-line { stroke: var(--color-border-secondary); stroke-width: 1.5; stroke-dasharray: 4 4; }
          `}
        </style>
    </defs>
);

export const SystemArchitectureDiagram: React.FC = () => (
  <svg width="100%" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
    <SvgDefs />
    <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
    <text x="400" y="50" textAnchor="middle" className="diagram-title">System Architecture</text>
    <g transform="translate(50, 100)" filter="url(#dropShadow)">
        <rect width="150" height="100" rx="12" fill="url(#user-gradient)" stroke="var(--color-border-primary)" />
        <text x="75" y="45" textAnchor="middle" className="diagram-box-title">User</text>
        <text x="75" y="70" textAnchor="middle" className="diagram-subtext">(Student/Educator)</text>
    </g>
    <g transform="translate(325, 100)" filter="url(#dropShadow)">
        <rect width="150" height="100" rx="12" fill="url(#browser-gradient)" stroke="var(--color-border-primary)" />
        <text x="75" y="45" textAnchor="middle" className="diagram-box-title">Browser</text>
        <text x="75" y="70" textAnchor="middle" className="diagram-subtext">BioChemAI (SPA)</text>
    </g>
    <g transform="translate(600, 100)" filter="url(#dropShadow)">
        <rect width="150" height="100" rx="12" fill="url(#api-gradient)" stroke="var(--color-border-primary)" />
        <text x="75" y="45" textAnchor="middle" className="diagram-box-title">Gemini API</text>
        <text x="75" y="70" textAnchor="middle" className="diagram-subtext">(Google Cloud)</text>
    </g>
    <line x1="205" y1="150" x2="320" y2="150" className="diagram-arrow" />
    <text x="262" y="140" textAnchor="middle" className="diagram-text">User Interaction</text>
    <line x1="480" y1="150" x2="595" y2="150" className="diagram-arrow" />
    <text x="537" y="140" textAnchor="middle" className="diagram-text">API Call (HTTPS)</text>
  </svg>
);

export const LocalStorageSchemaDiagram: React.FC = () => (
    <svg width="100%" viewBox="0 0 800 550" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
        <SvgDefs />
        <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
        <text x="400" y="50" textAnchor="middle" className="diagram-title">Local Storage Data Schema</text>
        <g transform="translate(50, 80)">
            <rect x="0" y="0" width="700" height="420" rx="12" fill="rgba(0,0,0,0.2)" stroke="var(--color-border-primary)" />
            <text x="350" y="30" textAnchor="middle" className="diagram-box-title" fill="var(--color-text-primary)">Browser Local Storage</text>
        </g>
        <g transform="translate(75, 130)">
            <text x="0" y="0" fill="var(--color-text-accent)" className="font-mono font-bold">bioChemAiMessages</text>
            <rect x="0" y="15" width="310" height="150" rx="8" fill="rgba(0,0,0,0.3)" />
            <text className="font-mono text-xs fill-[var(--color-text-tertiary)]" x="15" y="40">[{"{"} id, role, content, sources... {"}"}]</text>
        </g>
        <g transform="translate(415, 130)">
            <text x="0" y="0" fill="var(--color-text-accent)" className="font-mono font-bold">bioChemAiAuditLog</text>
            <rect x="0" y="15" width="310" height="150" rx="8" fill="rgba(0,0,0,0.3)" />
            <text className="font-mono text-xs fill-[var(--color-text-tertiary)]" x="15" y="40">[{"{"} id, timestamp, action, details... {"}"}]</text>
        </g>
        <g transform="translate(75, 310)">
            <text x="0" y="0" fill="var(--color-text-accent)" className="font-mono font-bold">bioChemAiLearningLevel</text>
            <rect x="0" y="15" width="310" height="40" rx="8" fill="rgba(0,0,0,0.3)" />
            <text className="font-mono text-xs fill-[var(--color-text-tertiary)]" x="15" y="40">"Undergraduate"</text>
        </g>
        <g transform="translate(415, 310)">
            <text x="0" y="0" fill="var(--color-text-accent)" className="font-mono font-bold">bioChemAiTheme</text>
            <rect x="0" y="15" width="310" height="40" rx="8" fill="rgba(0,0,0,0.3)" />
            <text className="font-mono text-xs fill-[var(--color-text-tertiary)]" x="15" y="40">"Ocean"</text>
        </g>
        <g transform="translate(75, 380)">
            <text x="0" y="0" fill="var(--color-text-accent)" className="font-mono font-bold">bioChemAiAdminPassword</text>
            <rect x="0" y="15" width="310" height="40" rx="8" fill="rgba(0,0,0,0.3)" />
            <text className="font-mono text-xs fill-[var(--color-text-tertiary)]" x="15" y="40">"********"</text>
        </g>
    </svg>
);

export const TechnologyStackDiagram: React.FC = () => (
    <svg width="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
      <SvgDefs />
      <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
      <text x="400" y="50" textAnchor="middle" className="diagram-title">Technology Stack</text>
      <g transform="translate(50, 100)">
        <rect width="200" height="250" rx="8" fill="rgba(0,0,0,0.2)" stroke="var(--color-border-primary)" />
        <text x="100" y="30" textAnchor="middle" className="diagram-box-title" fill="var(--color-text-primary)">Frontend</text>
        <text x="100" y="80" textAnchor="middle" className="diagram-text">React</text>
        <text x="100" y="100" textAnchor="middle" className="diagram-subtext">UI Library</text>
        <text x="100" y="150" textAnchor="middle" className="diagram-text">TypeScript</text>
        <text x="100" y="170" textAnchor="middle" className="diagram-subtext">Language</text>
        <text x="100" y="220" textAnchor="middle" className="diagram-text">TailwindCSS</text>
        <text x="100" y="240" textAnchor="middle" className="diagram-subtext">Styling</text>
      </g>
      <g transform="translate(300, 100)">
        <rect width="200" height="250" rx="8" fill="rgba(0,0,0,0.2)" stroke="var(--color-border-primary)" />
        <text x="100" y="30" textAnchor="middle" className="diagram-box-title" fill="var(--color-text-primary)">Tooling</text>
        <text x="100" y="80" textAnchor="middle" className="diagram-text">Vite</text>
        <text x="100" y="100" textAnchor="middle" className="diagram-subtext">Build Tool / Dev Server</text>
      </g>
      <g transform="translate(550, 100)">
        <rect width="200" height="250" rx="8" fill="rgba(0,0,0,0.2)" stroke="var(--color-border-primary)" />
        <text x="100" y="30" textAnchor="middle" className="diagram-box-title" fill="var(--color-text-primary)">Services</text>
        <text x="100" y="80" textAnchor="middle" className="diagram-text">Google Gemini API</text>
        <text x="100" y="100" textAnchor="middle" className="diagram-subtext">AI Model Provider</text>
      </g>
    </svg>
);

export const DataFlowDiagram: React.FC = () => (
    <svg width="100%" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
        <SvgDefs />
        <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
        <text x="400" y="50" textAnchor="middle" className="diagram-title">Data Flow: Ask a Question</text>
        {/* Entities */}
        <g transform="translate(50, 180)"><rect x="0" y="0" width="100" height="50" rx="8" fill="url(#user-gradient)" /><text x="50" y="30" textAnchor="middle" className="diagram-box-title">User</text></g>
        <g transform="translate(650, 180)"><rect x="0" y="0" width="100" height="50" rx="8" fill="url(#api-gradient)" /><text x="50" y="30" textAnchor="middle" className="diagram-box-title">Gemini API</text></g>
        {/* Processes */}
        <g transform="translate(250, 100)"><circle cx="50" cy="50" r="50" fill="url(#browser-gradient)" /><text x="50" y="55" textAnchor="middle" className="diagram-box-title">React UI</text></g>
        <g transform="translate(450, 250)"><circle cx="50" cy="50" r="50" fill="url(#browser-gradient)" /><text x="50" y="55" textAnchor="middle" className="diagram-box-title">Gemini Svc</text></g>
        {/* Arrows */}
        <path d="M 155 205 Q 240 170 265 150" fill="none" className="diagram-arrow" />
        <text x="180" y="165" className="diagram-subtext">Question Input</text>
        <path d="M 300 150 Q 375 175 475 265" fill="none" className="diagram-arrow" />
        <text x="330" y="220" className="diagram-subtext">Submit(prompt, level)</text>
        <path d="M 535 285 Q 590 240 645 215" fill="none" className="diagram-arrow" />
        <text x="545" y="235" className="diagram-subtext">generateContent()</text>
        <path d="M 645 195 Q 590 260 535 295" fill="none" className="diagram-arrow" />
        <text x="565" y="280" className="diagram-subtext">Response Text & Sources</text>
        <path d="M 475 275 Q 375 225 300 150" fill="none" className="diagram-arrow" />
        <text x="380" y="200" className="diagram-subtext">Display AI Message</text>
    </svg>
);

export const UmlUseCaseDiagram: React.FC = () => (
    <svg width="100%" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
      <SvgDefs />
      <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
      <text x="400" y="40" textAnchor="middle" className="diagram-title">UML Use Case Diagram</text>
      <rect x="250" y="70" width="300" height="350" rx="15" stroke="var(--color-border-primary)" stroke-width="2" fill="none" stroke-dasharray="8"/>
      <text x="400" y="95" textAnchor="middle" className="diagram-text" fill="var(--color-text-primary)">BioChemAI System</text>
      {/* Actors */}
      <g transform="translate(100, 200)">
        <circle cx="25" cy="15" r="15" fill="none" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="25" y1="30" x2="25" y2="60" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="0" y1="40" x2="50" y2="40" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="25" y1="60" x2="0" y2="90" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="25" y1="60" x2="50" y2="90" stroke="var(--color-text-primary)" stroke-width="2"/>
        <text x="25" y="110" textAnchor="middle" className="diagram-text" fill="var(--color-text-primary)">User</text>
      </g>
      <g transform="translate(650, 200)">
        <circle cx="25" cy="15" r="15" fill="none" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="25" y1="30" x2="25" y2="60" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="0" y1="40" x2="50" y2="40" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="25" y1="60" x2="0" y2="90" stroke="var(--color-text-primary)" stroke-width="2"/>
        <line x1="25" y1="60" x2="50" y2="90" stroke="var(--color-text-primary)" stroke-width="2"/>
        <text x="25" y="110" textAnchor="middle" className="diagram-text" fill="var(--color-text-primary)">Administrator</text>
      </g>
      {/* Use Cases */}
      <ellipse cx="400" cy="140" rx="80" ry="20" fill="url(#browser-gradient)" /><text x="400" y="145" textAnchor="middle" className="diagram-box-title">Ask Question</text>
      <ellipse cx="400" cy="200" rx="80" ry="20" fill="url(#browser-gradient)" /><text x="400" y="205" textAnchor="middle" className="diagram-box-title">Take Quiz</text>
      <ellipse cx="400" cy="260" rx="80" ry="20" fill="url(#browser-gradient)" /><text x="400" y="265" textAnchor="middle" className="diagram-box-title">View Docs</text>
      <ellipse cx="400" cy="320" rx="80" ry="20" fill="url(#browser-gradient)" /><text x="400" y="325" textAnchor="middle" className="diagram-box-title">Export Chat</text>
      <ellipse cx="400" cy="380" rx="80" ry="20" fill="url(#user-gradient)" /><text x="400" y="385" textAnchor="middle" className="diagram-box-title">Manage Password</text>
      {/* Lines */}
      <line x1="150" y1="250" x2="320" y2="140" className="diagram-line"/>
      <line x1="150" y1="250" x2="320" y2="200" className="diagram-line"/>
      <line x1="150" y1="250" x2="320" y2="260" className="diagram-line"/>
      <line x1="150" y1="250" x2="320" y2="320" className="diagram-line"/>
      <line x1="480" y1="380" x2="650" y2="250" className="diagram-line"/>
    </svg>
);

export const UmlSequenceDiagram: React.FC = () => (
    <svg width="100%" viewBox="0 0 800 550" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
      <SvgDefs />
      <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
      <text x="400" y="40" textAnchor="middle" className="diagram-title">Sequence: User Asks Question</text>
      {/* Lifelines */}
      <g><rect x="50" y="80" width="100" height="40" rx="5" fill="url(#user-gradient)"/><text x="100" y="105" textAnchor="middle" className="diagram-box-title">:User</text><line x1="100" y1="120" x2="100" y2="500" className="diagram-dash-line"/></g>
      <g><rect x="200" y="80" width="100" height="40" rx="5" fill="url(#browser-gradient)"/><text x="250" y="105" textAnchor="middle" className="diagram-box-title">:ChatArea</text><line x1="250" y1="120" x2="250" y2="500" className="diagram-dash-line"/></g>
      <g><rect x="350" y="80" width="100" height="40" rx="5" fill="url(#browser-gradient)"/><text x="400" y="105" textAnchor="middle" className="diagram-box-title">:App</text><line x1="400" y1="120" x2="400" y2="500" className="diagram-dash-line"/></g>
      <g><rect x="500" y="80" width="100" height="40" rx="5" fill="url(#browser-gradient)"/><text x="550" y="105" textAnchor="middle" className="diagram-box-title">:geminiSvc</text><line x1="550" y1="120" x2="550" y2="500" className="diagram-dash-line"/></g>
      <g><rect x="650" y="80" width="100" height="40" rx="5" fill="url(#api-gradient)"/><text x="700" y="105" textAnchor="middle" className="diagram-box-title">:GeminiAPI</text><line x1="700" y1="120" x2="700" y2="500" className="diagram-dash-line"/></g>
      {/* Messages */}
      <path d="M 100 150 L 245 160" className="diagram-arrow"/><text x="130" y="145" className="diagram-subtext">1. Types question</text>
      <path d="M 100 180 L 395 190" className="diagram-arrow"/><text x="180" y="185" className="diagram-subtext">2. Clicks Send</text>
      <path d="M 400 200 L 250 210" className="diagram-arrow"/><text x="280" y="205" className="diagram-subtext">3. Add User Msg & Show Loading</text>
      <path d="M 400 240 L 545 250" className="diagram-arrow"/><text x="420" y="245" className="diagram-subtext">4. generateBioChemResponse()</text>
      <rect x="545" y="255" width="10" height="150" fill="url(#browser-gradient)" />
      <path d="M 550 280 L 695 290" className="diagram-arrow"/><text x="570" y="285" className="diagram-subtext">5. generateContent()</text>
      <rect x="695" y="295" width="10" height="80" fill="url(#api-gradient)" />
      {/* FIX: Changed invalid JSX `{text, sources}` to a string literal `"{text, sources}"` to fix compilation errors. */}
      <path d="M 695 380 L 550 390" className="diagram-arrow"/><text x="580" y="385" className="diagram-subtext">6. {'{text, sources}'}</text>
      <path d="M 550 400 L 400 410" className="diagram-arrow"/><text x="430" y="405" className="diagram-subtext">7. return response</text>
      <path d="M 400 420 L 250 430" className="diagram-arrow"/><text x="280" y="425" className="diagram-subtext">8. Add AI Msg, Hide Loading</text>
    </svg>
);

export const PresentationArchitectureDiagram: React.FC = () => (
    <svg width="100%" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
      <SvgDefs />
      <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
      <g transform="translate(80, 100)" filter="url(#dropShadow)">
        <rect width="180" height="120" rx="15" fill="url(#user-gradient)" />
        <text x="90" y="60" textAnchor="middle" className="diagram-title" fill="white">User</text>
        <text x="90" y="90" textAnchor="middle" className="diagram-text" fill="white">(Web Browser)</text>
      </g>
      <g transform="translate(540, 100)" filter="url(#dropShadow)">
        <rect width="180" height="120" rx="15" fill="url(#api-gradient)" />
        <text x="90" y="60" textAnchor="middle" className="diagram-title" fill="white">Google Cloud</text>
        <text x="90" y="90" textAnchor="middle" className="diagram-text" fill="white">(Gemini API)</text>
      </g>
      <path d="M 265 160 L 535 160" className="diagram-arrow" style={{strokeWidth: 4}}/>
      <text x="400" y="145" textAnchor="middle" className="diagram-title">Secure API Call</text>
    </svg>
);

export const PresentationTechStackDiagram: React.FC = () => (
    <svg width="100%" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg" className="rounded-lg my-4 diagram-font">
      <SvgDefs />
      <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
      <text x="400" y="60" textAnchor="middle" className="diagram-title">Core Technologies</text>
      <g transform="translate(50, 120)" filter="url(#dropShadow)">
        <rect width="200" height="100" rx="12" fill="url(#browser-gradient)" /><text x="100" y="65" textAnchor="middle" className="diagram-title" fill="white">React & TS</text>
      </g>
      <g transform="translate(300, 120)" filter="url(#dropShadow)">
        <rect width="200" height="100" rx="12" fill="url(#browser-gradient)" /><text x="100" y="65" textAnchor="middle" className="diagram-title" fill="white">TailwindCSS</text>
      </g>
      <g transform="translate(550, 120)" filter="url(#dropShadow)">
        <rect width="200" height="100" rx="12" fill="url(#api-gradient)" /><text x="100" y="65" textAnchor="middle" className="diagram-title" fill="white">Gemini API</text>
      </g>
    </svg>
);


export const SystemDiagrams: React.FC = () => {
    return (
        <div className="space-y-12">
            <section>
                <DocsHeader>Core Diagrams</DocsHeader>
                <DocsSection>
                    <p>These diagrams provide a detailed look into the architecture, technologies, and logic of the BioChemAI application.</p>
                </DocsSection>
                <DocsSubHeader>System Architecture</DocsSubHeader>
                <SystemArchitectureDiagram />
                <DocsSubHeader>Technology Stack</DocsSubHeader>
                <TechnologyStackDiagram />
                <DocsSubHeader>Data Flow Diagram</DocsSubHeader>
                <DataFlowDiagram />
                <DocsSubHeader>UML Use Case Diagram</DocsSubHeader>
                <UmlUseCaseDiagram />
                <DocsSubHeader>UML Sequence Diagram</DocsSubHeader>
                <UmlSequenceDiagram />
                <DocsSubHeader>Local Storage Schema</DocsSubHeader>
                <LocalStorageSchemaDiagram />
            </section>
            
            <section>
                <DocsHeader>Presentation Diagrams</DocsHeader>
                <DocsSection>
                    <p>These are simplified, high-impact versions of the core diagrams, suitable for presentations to stakeholders.</p>
                </DocsSection>
                <DocsSubHeader>High-Level Architecture</DocsSubHeader>
                <PresentationArchitectureDiagram />
                <DocsSubHeader>Core Technology Stack</DocsSubHeader>
                <PresentationTechStackDiagram />
            </section>
        </div>
    );
};
