import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Presentation, Table, Chrome, Bot } from 'lucide-react';
import AIAgent from '../components/AIAgent';

const categories = [
  { id: 'docs', name: 'Google Docs', icon: FileText, color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
  { id: 'slides', name: 'Google Slides', icon: Presentation, color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  { id: 'sheets', name: 'Google Sheets', icon: Table, color: 'bg-green-500', hover: 'hover:bg-green-600' },
  { id: 'chrome', name: 'Google Chrome', icon: Chrome, color: 'bg-red-500', hover: 'hover:bg-red-600' },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
          <span className="block">Master Your</span>
          <span className="block text-indigo-600 dark:text-indigo-400">Workspace Shortcuts</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-[var(--text-secondary)] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Learn the fastest ways to create, edit, and navigate in Google Workspace. Choose an app below to get started!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" role="list" aria-label="Shortcut categories">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              role="listitem"
              aria-label={`View ${category.name} shortcuts`}
              className={`group flex flex-col items-center justify-center p-8 rounded-3xl shadow-sm border border-[var(--border-color)] transition-all duration-200 ${category.color} ${category.hover} text-white hover:shadow-lg hover:-translate-y-1`}
            >
              <Icon className="w-16 h-16 mb-4 opacity-90 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              <h2 className="text-xl font-bold">{category.name}</h2>
              <p className="mt-2 text-sm opacity-80 text-center">View all shortcuts</p>
            </Link>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Bot className="w-8 h-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Ask the AI Assistant</h2>
        </div>
        <AIAgent />
      </div>
    </div>
  );
}
