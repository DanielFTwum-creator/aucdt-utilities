
import React from 'react';

// 1. High-Level System Architecture
export const SysArchDiagram = () => (
  <svg viewBox="0 0 800 500" className="w-full h-auto bg-white rounded-lg border border-gray-200">
    <rect x="0" y="0" width="800" height="500" fill="#f8f9fa" rx="10" />
    <text x="400" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#3B3B3B">High-Level System Architecture</text>
    
    {/* Zones */}
    <rect x="50" y="60" width="200" height="400" rx="10" fill="#fff" stroke="#D4AF37" strokeDasharray="4" />
    <text x="150" y="85" textAnchor="middle" fill="#D4AF37" fontWeight="bold">Client Layer</text>
    
    <rect x="300" y="60" width="200" height="400" rx="10" fill="#fff" stroke="#006B3F" strokeDasharray="4" />
    <text x="400" y="85" textAnchor="middle" fill="#006B3F" fontWeight="bold">Application Layer</text>
    
    <rect x="550" y="60" width="200" height="400" rx="10" fill="#fff" stroke="#3B3B3B" strokeDasharray="4" />
    <text x="650" y="85" textAnchor="middle" fill="#3B3B3B" fontWeight="bold">Data & External</text>

    {/* Components */}
    <g transform="translate(75, 120)">
      <rect width="150" height="60" rx="5" fill="#E3F2FD" stroke="#2196F3" />
      <text x="75" y="35" textAnchor="middle">React SPA</text>
    </g>
    <g transform="translate(75, 220)">
      <rect width="150" height="60" rx="5" fill="#E3F2FD" stroke="#2196F3" />
      <text x="75" y="35" textAnchor="middle">Puppeteer Engine</text>
    </g>

    <g transform="translate(325, 120)">
      <rect width="150" height="60" rx="5" fill="#E8F5E9" stroke="#4CAF50" />
      <text x="75" y="25" textAnchor="middle">Business Logic</text>
      <text x="75" y="45" textAnchor="middle" fontSize="10">(Auth, Search, Role Map)</text>
    </g>
    <g transform="translate(325, 220)">
      <rect width="150" height="60" rx="5" fill="#E8F5E9" stroke="#4CAF50" />
      <text x="75" y="35" textAnchor="middle">State Management</text>
    </g>

    <g transform="translate(575, 120)">
      <rect width="150" height="60" rx="5" fill="#FFF3E0" stroke="#FF9800" />
      <text x="75" y="35" textAnchor="middle">Google Gemini API</text>
    </g>
    <g transform="translate(575, 220)">
      <rect width="150" height="60" rx="5" fill="#ECEFF1" stroke="#607D8B" />
      <text x="75" y="25" textAnchor="middle">Mock Database</text>
      <text x="75" y="45" textAnchor="middle" fontSize="10">(Contacts, Logs, Users)</text>
    </g>
    
    {/* Arrows */}
    <path d="M225,150 L325,150" stroke="#333" strokeWidth="2" markerEnd="url(#arrow)" />
    <path d="M475,150 L575,150" stroke="#333" strokeWidth="2" markerEnd="url(#arrow)" />
    <path d="M475,250 L575,250" stroke="#333" strokeWidth="2" markerEnd="url(#arrow)" />
    
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#333" />
      </marker>
    </defs>
  </svg>
);

// 2. Technology Stack
export const TechStackDiagram = () => (
  <svg viewBox="0 0 800 400" className="w-full h-auto bg-white rounded-lg border border-gray-200">
    <rect x="0" y="0" width="800" height="400" fill="#fff" rx="10" />
    <text x="400" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#3B3B3B">Technology Stack</text>

    {/* Frontend */}
    <g transform="translate(50, 60)">
      <rect width="200" height="300" rx="5" fill="#E1F5FE" stroke="#0288D1" />
      <text x="100" y="30" textAnchor="middle" fontWeight="bold" fill="#0277BD">Frontend</text>
      <text x="100" y="60" textAnchor="middle">React 18.2</text>
      <text x="100" y="90" textAnchor="middle">TypeScript</text>
      <text x="100" y="120" textAnchor="middle">Tailwind CSS</text>
      <text x="100" y="150" textAnchor="middle">Lucide React</text>
    </g>

    {/* Backend/Logic */}
    <g transform="translate(300, 60)">
      <rect width="200" height="300" rx="5" fill="#E8F5E9" stroke="#2E7D32" />
      <text x="100" y="30" textAnchor="middle" fontWeight="bold" fill="#1B5E20">Core Logic</text>
      <text x="100" y="60" textAnchor="middle">Node.js (Env)</text>
      <text x="100" y="90" textAnchor="middle">Google GenAI SDK</text>
      <text x="100" y="120" textAnchor="middle">Puppeteer (Test)</text>
    </g>

    {/* Data/DevOps */}
    <g transform="translate(550, 60)">
      <rect width="200" height="300" rx="5" fill="#FFF3E0" stroke="#EF6C00" />
      <text x="100" y="30" textAnchor="middle" fontWeight="bold" fill="#E65100">Data & DevOps</text>
      <text x="100" y="60" textAnchor="middle">JSON Storage</text>
      <text x="100" y="90" textAnchor="middle">Git / GitHub</text>
      <text x="100" y="120" textAnchor="middle">Docker (Ready)</text>
    </g>
  </svg>
);

// 3. Data Flow Diagram
export const DataFlowDiagram = () => (
  <svg viewBox="0 0 800 400" className="w-full h-auto bg-white rounded-lg border border-gray-200">
    <rect x="0" y="0" width="800" height="400" fill="#fff" rx="10" />
    <text x="400" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#3B3B3B">DFD: Critical Process - Contact Refresh</text>

    {/* Entities */}
    <rect x="50" y="150" width="100" height="60" fill="#ddd" stroke="#333" />
    <text x="100" y="185" textAnchor="middle" fontWeight="bold">Admin</text>

    <circle cx="300" cy="180" r="50" fill="#fff" stroke="#333" />
    <text x="300" y="175" textAnchor="middle" fontSize="12">1.0 Trigger</text>
    <text x="300" y="195" textAnchor="middle" fontSize="12">Scrape</text>

    <circle cx="500" cy="180" r="50" fill="#fff" stroke="#333" />
    <text x="500" y="175" textAnchor="middle" fontSize="12">2.0 Process</text>
    <text x="500" y="195" textAnchor="middle" fontSize="12">Normalize</text>

    <rect x="650" y="150" width="100" height="60" fill="#eee" stroke="#333" />
    <path d="M660,150 L660,210" stroke="#333" />
    <text x="700" y="185" textAnchor="middle" fontWeight="bold">DB</text>

    {/* Flows */}
    <path d="M150,180 L250,180" stroke="#333" markerEnd="url(#arrow)" />
    <text x="200" y="170" textAnchor="middle" fontSize="10">Login/Command</text>

    <path d="M350,180 L450,180" stroke="#333" markerEnd="url(#arrow)" />
    <text x="400" y="170" textAnchor="middle" fontSize="10">Raw Data</text>

    <path d="M550,180 L650,180" stroke="#333" markerEnd="url(#arrow)" />
    <text x="600" y="170" textAnchor="middle" fontSize="10">Clean Data</text>
  </svg>
);

// 4. UML Use Case
export const UseCaseDiagram = () => (
  <svg viewBox="0 0 800 500" className="w-full h-auto bg-white rounded-lg border border-gray-200">
    <rect x="0" y="0" width="800" height="500" fill="#fff" rx="10" />
    <text x="400" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#3B3B3B">UML Use Case Diagram</text>

    {/* System Boundary */}
    <rect x="250" y="50" width="300" height="400" fill="none" stroke="#333" />
    <text x="400" y="70" textAnchor="middle" fontWeight="bold">VECA System</text>

    {/* Actors */}
    <circle cx="100" cy="150" r="15" fill="#fff" stroke="#333" />
    <line x1="100" y1="165" x2="100" y2="200" stroke="#333" />
    <line x1="80" y1="180" x2="120" y2="180" stroke="#333" />
    <line x1="100" y1="200" x2="80" y2="230" stroke="#333" />
    <line x1="100" y1="200" x2="120" y2="230" stroke="#333" />
    <text x="100" y="250" textAnchor="middle">User (Guest)</text>

    <circle cx="700" cy="250" r="15" fill="#fff" stroke="#333" />
    <line x1="700" y1="265" x2="700" y2="300" stroke="#333" />
    <line x1="680" y1="280" x2="720" y2="280" stroke="#333" />
    <line x1="700" y1="300" x2="680" y2="330" stroke="#333" />
    <line x1="700" y1="300" x2="720" y2="330" stroke="#333" />
    <text x="700" y="350" textAnchor="middle">Administrator</text>

    {/* Use Cases */}
    <ellipse cx="400" cy="120" rx="100" ry="30" fill="#fff" stroke="#333" />
    <text x="400" y="125" textAnchor="middle">Search Contacts</text>

    <ellipse cx="400" cy="200" rx="100" ry="30" fill="#fff" stroke="#333" />
    <text x="400" y="205" textAnchor="middle">View Details</text>

    <ellipse cx="400" cy="280" rx="100" ry="30" fill="#fff" stroke="#333" />
    <text x="400" y="285" textAnchor="middle">Secure Login</text>

    <ellipse cx="400" cy="360" rx="100" ry="30" fill="#fff" stroke="#333" />
    <text x="400" y="365" textAnchor="middle">Run Audit/Tests</text>

    {/* Lines */}
    <line x1="130" y1="180" x2="300" y2="120" stroke="#333" />
    <line x1="130" y1="180" x2="300" y2="200" stroke="#333" />

    <line x1="670" y1="280" x2="500" y2="120" stroke="#333" />
    <line x1="670" y1="280" x2="500" y2="200" stroke="#333" />
    <line x1="670" y1="280" x2="500" y2="280" stroke="#333" />
    <line x1="670" y1="280" x2="500" y2="360" stroke="#333" />
  </svg>
);

// 5. UML Sequence Diagram
export const SequenceDiagram = () => (
  <svg viewBox="0 0 800 500" className="w-full h-auto bg-white rounded-lg border border-gray-200">
    <rect x="0" y="0" width="800" height="500" fill="#fff" rx="10" />
    <text x="400" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#3B3B3B">Sequence: Admin Login</text>

    {/* Lifelines */}
    <rect x="100" y="60" width="100" height="30" fill="#ddd" stroke="#333" />
    <text x="150" y="80" textAnchor="middle">Admin</text>
    <line x1="150" y1="90" x2="150" y2="450" stroke="#333" strokeDasharray="4" />

    <rect x="300" y="60" width="100" height="30" fill="#ddd" stroke="#333" />
    <text x="350" y="80" textAnchor="middle">UI (React)</text>
    <line x1="350" y1="90" x2="350" y2="450" stroke="#333" strokeDasharray="4" />

    <rect x="500" y="60" width="100" height="30" fill="#ddd" stroke="#333" />
    <text x="550" y="80" textAnchor="middle">Auth Service</text>
    <line x1="550" y1="90" x2="550" y2="450" stroke="#333" strokeDasharray="4" />

    <rect x="700" y="60" width="80" height="30" fill="#ddd" stroke="#333" />
    <text x="740" y="80" textAnchor="middle">DB</text>
    <line x1="740" y1="90" x2="740" y2="450" stroke="#333" strokeDasharray="4" />

    {/* Messages */}
    <line x1="150" y1="130" x2="350" y2="130" stroke="#333" markerEnd="url(#arrow)" />
    <text x="250" y="125" textAnchor="middle" fontSize="12">1. enterCredentials()</text>

    <line x1="350" y1="170" x2="550" y2="170" stroke="#333" markerEnd="url(#arrow)" />
    <text x="450" y="165" textAnchor="middle" fontSize="12">2. validate(user, pass)</text>

    <line x1="550" y1="210" x2="740" y2="210" stroke="#333" markerEnd="url(#arrow)" />
    <text x="645" y="205" textAnchor="middle" fontSize="12">3. queryUser()</text>

    <line x1="740" y1="250" x2="550" y2="250" stroke="#333" strokeDasharray="4" markerEnd="url(#arrow)" />
    <text x="645" y="245" textAnchor="middle" fontSize="12">4. return userFound</text>

    <line x1="550" y1="290" x2="350" y2="290" stroke="#333" strokeDasharray="4" markerEnd="url(#arrow)" />
    <text x="450" y="285" textAnchor="middle" fontSize="12">5. authSuccess(token)</text>

    <line x1="350" y1="330" x2="150" y2="330" stroke="#333" strokeDasharray="4" markerEnd="url(#arrow)" />
    <text x="250" y="325" textAnchor="middle" fontSize="12">6. showDashboard()</text>
  </svg>
);

// 6. Presentation: Simple Arch
export const PresArchDiagram = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto bg-white rounded-lg border border-gray-200">
    <rect x="0" y="0" width="400" height="300" fill="#fff" rx="10" />
    <text x="200" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3B3B3B">VECA Architecture</text>
    
    <rect x="50" y="100" width="80" height="80" rx="10" fill="#D4AF37" />
    <text x="90" y="145" textAnchor="middle" fill="#fff" fontWeight="bold">Web</text>
    
    <rect x="160" y="100" width="80" height="80" rx="10" fill="#006B3F" />
    <text x="200" y="145" textAnchor="middle" fill="#fff" fontWeight="bold">App</text>
    
    <rect x="270" y="100" width="80" height="80" rx="10" fill="#3B3B3B" />
    <text x="310" y="145" textAnchor="middle" fill="#fff" fontWeight="bold">DB</text>
    
    <line x1="130" y1="140" x2="160" y2="140" stroke="#333" strokeWidth="2" />
    <line x1="240" y1="140" x2="270" y2="140" stroke="#333" strokeWidth="2" />
  </svg>
);

// 7. Presentation: Simple Stack
export const PresStackDiagram = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto bg-white rounded-lg border border-gray-200">
    <rect x="0" y="0" width="400" height="300" fill="#fff" rx="10" />
    <text x="200" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3B3B3B">Core Tech Stack</text>
    
    <g transform="translate(150, 60)">
        <circle cx="50" cy="50" r="40" fill="#61DAFB" />
        <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold">React</text>
    </g>
    <g transform="translate(60, 150)">
        <circle cx="50" cy="50" r="40" fill="#3C873A" />
        <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold">Node</text>
    </g>
    <g transform="translate(240, 150)">
        <circle cx="50" cy="50" r="40" fill="#336791" />
        <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold">SQL</text>
    </g>
  </svg>
);
