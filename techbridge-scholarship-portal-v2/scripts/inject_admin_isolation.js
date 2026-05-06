import fs from 'fs';
import path from 'path';

const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Please provide a target directory.");
  process.exit(1);
}

const resolvedDir = path.resolve(process.cwd(), targetDir);
const appPath = path.join(resolvedDir, 'src', 'App.tsx');
if (!fs.existsSync(appPath)) {
    console.error(`❌ Could not find App.tsx at: ${appPath}`);
    process.exit(1);
}

console.log(`🛡️ Injecting Admin Isolation into: ${targetDir}`);

let content = fs.readFileSync(appPath, 'utf8');

// 1. Check if already injected
if (content.includes('#/admin')) {
    console.log(`✅ ${targetDir} already has Admin Isolation.`);
    process.exit(0);
}

// 2. Add Imports
if (!content.includes('useState')) {
    content = content.replace(/import {?/, "import { useState, useEffect, ");
} else if (!content.includes('useEffect')) {
    content = content.replace('useState', 'useState, useEffect');
}

// 3. Prepare AdminPanel Placeholder
const adminDir = path.join(resolvedDir, 'src', 'components', 'admin');
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

const adminPanelContent = `import React from 'react';

export const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-[#0F0C07] text-[#F2EBD9] p-12 font-serif">
      <div className="max-w-4xl mx-auto border border-[#C8A84B]/30 p-12 bg-[#141210]">
        <h1 className="text-4xl font-black text-[#C8A84B] uppercase mb-4 tracking-widest">Administrative Control</h1>
        <p className="italic text-[#C8A84B]/60 mb-12 border-b border-[#C8A84B]/20 pb-4">TUC Secure Diagnostic Node</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-white/5 border border-[#C8A84B]/10">
                <h3 className="font-bold text-[#C8A84B] mb-2 uppercase text-xs tracking-widest">System Status</h3>
                <p className="text-2xl font-bold">OPERATIONAL</p>
            </div>
            <div className="p-6 bg-white/5 border border-[#C8A84B]/10">
                <h3 className="font-bold text-[#C8A84B] mb-2 uppercase text-xs tracking-widest">Environment</h3>
                <p className="text-2xl font-bold">REACT 19.2.4</p>
            </div>
        </div>

        <button 
            onClick={onLogout}
            className="px-8 py-3 border border-[#C8A84B] text-[#C8A84B] hover:bg-[#C8A84B] hover:text-[#0F0C07] transition-all uppercase font-bold tracking-widest text-xs"
        >
            Exit Terminal
        </button>
      </div>
    </div>
  );
};
`;
fs.writeFileSync(path.join(adminDir, 'AdminPanel.tsx'), adminPanelContent);
content = `import { AdminPanel } from './components/admin/AdminPanel';\n` + content;

// 4. Inject Logic into App Component
// This is a simplified regex approach for "Standard" components
const stateLogic = `
  const [view, setView] = useState<'main' | 'admin'>(() => {
    return window.location.hash.startsWith('#/admin') ? 'admin' : 'main';
  });

  useEffect(() => {
    const handleHash = () => setView(window.location.hash.startsWith('#/admin') ? 'admin' : 'main');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToAdmin = () => { window.location.hash = '#/admin'; };
  const navigateToMain = () => { window.location.hash = '#/'; };
`;

// Find first function or const App
content = content.replace(/(const App|function App|export default function App)[^{]*{/, `$1(props: any) {${stateLogic}`);

// 5. Wrap Return (Very simplified - assumes one return statement)
if (content.includes('return (')) {
    content = content.replace(/return \(\s*([\s\S]*?)\s*\);/m, (match, p1) => {
        return `if (view === 'admin') return <AdminPanel onLogout={navigateToMain} />;\n  return (\n    <>\n      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999, opacity: 0.1 }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.1'}>\n        <button onClick={navigateToAdmin} style={{ fontSize: '10px', background: '#C8A84B', color: '#000', padding: '2px 5px', border: 'none', cursor: 'pointer' }}>ADM</button>\n      </div>\n      ${p1}\n    </>\n  );`;
    });
}

fs.writeFileSync(appPath, content);
console.log(`✅ Successfully injected Admin Isolation logic into ${targetDir}`);
