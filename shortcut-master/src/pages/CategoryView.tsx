import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Presentation, Table, Chrome } from 'lucide-react';
import { shortcuts, ShortcutCategory } from '../data/shortcuts';

const categoryInfo = {
  docs: { name: 'Google Docs', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  slides: { name: 'Google Slides', icon: Presentation, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  sheets: { name: 'Google Sheets', icon: Table, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
  chrome: { name: 'Google Chrome', icon: Chrome, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
};

export default function CategoryView() {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !categoryInfo[id as ShortcutCategory]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Category not found</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const category = id as ShortcutCategory;
  const info = categoryInfo[category];
  const Icon = info.icon;
  const categoryShortcuts = shortcuts.filter((s) => s.category === category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors" aria-label="Back to Home">
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className={`flex items-center gap-4 p-6 rounded-3xl mb-10 ${info.bg} border border-[var(--border-color)]`}>
        <div className={`p-4 rounded-2xl bg-[var(--bg-secondary)] shadow-sm ${info.color}`}>
          <Icon className="w-10 h-10" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{info.name} Shortcuts</h1>
          <p className="text-[var(--text-secondary)] mt-1">Learn these to work faster!</p>
        </div>
      </div>

      <div className="grid gap-4" role="list" aria-label={`${info.name} shortcut list`}>
        {categoryShortcuts.map((shortcut) => (
          <div key={shortcut.id} role="listitem" className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--border-color)] hover:shadow-md transition-shadow">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">{shortcut.action}</h3>
              <p className="text-[var(--text-secondary)] text-sm mt-1">{shortcut.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap" aria-label={`Keyboard shortcut: ${shortcut.keys.join(' plus ')}`}>
              {shortcut.keys.map((key, index) => (
                <React.Fragment key={index}>
                  <kbd className="px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm font-mono font-medium text-[var(--text-primary)] shadow-sm">
                    {key}
                  </kbd>
                  {index < shortcut.keys.length - 1 && (
                    <span className="text-slate-400 font-medium" aria-hidden="true">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
