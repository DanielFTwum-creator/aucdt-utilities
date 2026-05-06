
import React from 'react';

export const StyleGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold text-white mb-8">Style Guide & Recommendations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-yellow-500 mb-4">Style 1: Golden Glow</h2>
          <ul className="space-y-2 text-zinc-400 text-sm">
            <li><strong className="text-white">Technical:</strong> Multi-layer black shadow (8px) + golden glow (3px)</li>
            <li><strong className="text-white">Position:</strong> Top (12% from top)</li>
            <li><strong className="text-white">Font Size:</strong> 95px</li>
            <li><strong className="text-white">Best For:</strong> Warmth, spirituality, professional general use</li>
          </ul>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Style 2: Thick Outline</h2>
          <ul className="space-y-2 text-zinc-400 text-sm">
            <li><strong className="text-white">Technical:</strong> 8px solid black outline + white text</li>
            <li><strong className="text-white">Position:</strong> Centre</li>
            <li><strong className="text-white">Font Size:</strong> 100px</li>
            <li><strong className="text-white">Best For:</strong> Mobile viewing, maximum contrast</li>
          </ul>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-red-500 mb-4">Style 3: Red Glow</h2>
          <ul className="space-y-2 text-zinc-400 text-sm">
            <li><strong className="text-white">Technical:</strong> Red glow RGB(255,80,80) + white text</li>
            <li><strong className="text-white">Position:</strong> Top (12% from top)</li>
            <li><strong className="text-white">Font Size:</strong> 95px</li>
            <li><strong className="text-white">Best For:</strong> Energy, passion, reggae branding</li>
          </ul>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-zinc-300 mb-4">Style 4: Clean Shadow</h2>
          <ul className="space-y-2 text-zinc-400 text-sm">
            <li><strong className="text-white">Technical:</strong> 6px drop shadow + white text (no glow)</li>
            <li><strong className="text-white">Position:</strong> Centre</li>
            <li><strong className="text-white">Font Size:</strong> 105px (largest)</li>
            <li><strong className="text-white">Best For:</strong> Clean professional look, minimalist aesthetic</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Usage Matrix</h2>
      <div className="overflow-x-auto mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="py-3 px-4 text-zinc-400 font-medium text-sm uppercase tracking-wider">Your Goal</th>
              <th className="py-3 px-4 text-zinc-400 font-medium text-sm uppercase tracking-wider">Recommended Style</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300 text-sm">
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <td className="py-3 px-4">Maximum YouTube CTR</td>
              <td className="py-3 px-4 text-yellow-500">Golden Glow or Red Glow</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 px-4">Mobile-first strategy</td>
              <td className="py-3 px-4">Thick Outline</td>
            </tr>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <td className="py-3 px-4">Professional/corporate image</td>
              <td className="py-3 px-4">Clean Shadow</td>
            </tr>
            <tr className="border-b border-zinc-800">
              <td className="py-3 px-4">Reggae/dancehall branding</td>
              <td className="py-3 px-4 text-red-500">Red Glow</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">A/B Testing Strategy</h2>
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shrink-0">1</div>
          <div>
            <h3 className="text-lg font-bold text-white">Initial Testing (Week 1-2)</h3>
            <p className="text-zinc-400 mt-1">Upload video with Golden Glow version. Monitor CTR for 3-4 days. The first 48 hours are most critical for the algorithm.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shrink-0">2</div>
          <div>
            <h3 className="text-lg font-bold text-white">Comparison (Week 2-3)</h3>
            <p className="text-zinc-400 mt-1">Switch to Red Glow version. Compare CTR differences and check retention rates.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold shrink-0">3</div>
          <div>
            <h3 className="text-lg font-bold text-white">Final Selection (Week 3-4)</h3>
            <p className="text-zinc-400 mt-1">Choose winning style. Apply consistently to build brand. Document results for future reference.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
