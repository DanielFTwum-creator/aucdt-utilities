
import React, { useState } from 'react';
import { FileText, Folder, FileCode, Presentation, Shield, Cloud, Terminal } from 'lucide-react';
import { SysArchDiagram, TechStackDiagram, DataFlowDiagram, UseCaseDiagram, SequenceDiagram, PresArchDiagram, PresStackDiagram } from './ProjectDiagrams';

export const DocumentationCenter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<'/docs' | '/docs/svg' | '/docs/presentation'>('/docs');

  const renderBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    return (
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 bg-gray-100 dark:bg-gray-800 p-2 rounded">
        <span className="font-mono text-aucdt-gold mr-2">$</span>
        <button onClick={() => setCurrentPath('/docs')} className="hover:underline">root</button>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
             <span className="mx-1">/</span>
             <button 
               onClick={() => setCurrentPath(`/${parts.slice(0, index + 1).join('/')}` as any)}
               className={index === parts.length - 1 ? 'font-bold text-gray-800 dark:text-white' : 'hover:underline'}
             >
               {part}
             </button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
          <Folder className="text-aucdt-gold" />
          Project Repository: /docs
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Centralized repository for all project assets, guides, and architectural diagrams.
        </p>

        {renderBreadcrumbs()}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Root Directory */}
          {currentPath === '/docs' && (
            <>
              <button 
                onClick={() => setCurrentPath('/docs/svg')}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 text-left"
              >
                <Folder className="text-blue-500 shrink-0" size={32} />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">svg/</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Source files for all 5 core diagrams.</p>
                </div>
              </button>

              <button 
                onClick={() => setCurrentPath('/docs/presentation')}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 text-left"
              >
                <Folder className="text-green-500 shrink-0" size={32} />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">presentation/</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Board-level simplified assets.</p>
                </div>
              </button>

              <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 opacity-75">
                <FileText className="text-gray-400 shrink-0" size={32} />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">SRS_VECA_Final.md</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Final Specifications (See SRS Tab)</p>
                </div>
              </div>

               <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Shield className="text-aucdt-brown shrink-0" size={32} />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Admin_Guide.md</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Security & Access Manual</p>
                </div>
              </div>

               <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Cloud className="text-blue-400 shrink-0" size={32} />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Deployment.md</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Production Setup Instructions</p>
                </div>
              </div>

               <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Terminal className="text-green-600 shrink-0" size={32} />
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Testing_Guide.md</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Puppeteer Framework Docs</p>
                </div>
              </div>
            </>
          )}

          {/* SVG Directory */}
          {currentPath === '/docs/svg' && (
             <>
              {[
                { name: 'System_Architecture.svg', Comp: SysArchDiagram },
                { name: 'Tech_Stack.svg', Comp: TechStackDiagram },
                { name: 'Data_Flow_DFD.svg', Comp: DataFlowDiagram },
                { name: 'Use_Case.svg', Comp: UseCaseDiagram },
                { name: 'Sequence_Diagram.svg', Comp: SequenceDiagram }
              ].map((file) => (
                <div key={file.name} className="col-span-1 md:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
                  <div className="aspect-video bg-white rounded border border-gray-200 mb-2 overflow-hidden flex items-center justify-center p-2">
                    <div className="w-full"><file.Comp /></div>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <FileCode size={14} className="text-pink-500" />
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate">{file.name}</span>
                  </div>
                </div>
              ))}
             </>
          )}

           {/* Presentation Directory */}
           {currentPath === '/docs/presentation' && (
             <>
              {[
                { name: 'Simple_Arch.svg', Comp: PresArchDiagram },
                { name: 'Simple_Stack.svg', Comp: PresStackDiagram }
              ].map((file) => (
                <div key={file.name} className="col-span-1 md:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900">
                  <div className="aspect-video bg-white rounded border border-gray-200 mb-2 overflow-hidden flex items-center justify-center p-2">
                    <div className="w-full"><file.Comp /></div>
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <Presentation size={14} className="text-orange-500" />
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-300 truncate">{file.name}</span>
                  </div>
                </div>
              ))}
             </>
          )}

        </div>
      </div>
    </div>
  );
};
