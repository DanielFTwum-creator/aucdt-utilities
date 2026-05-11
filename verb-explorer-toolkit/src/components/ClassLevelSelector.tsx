import { BookOpen } from 'lucide-react';

interface ClassLevelSelectorProps {
  onSelect: (level: string) => void;
}

export function ClassLevelSelector({ onSelect }: ClassLevelSelectorProps) {
  const classLevels = [
    {
      id: 'class-1-3',
      label: 'Class 1-3',
      description: 'Ages 6-9 • Simple words • Fun activities',
      color: 'from-blue-400 to-blue-600',
      emoji: '🌟',
    },
    {
      id: 'class-4-6',
      label: 'Class 4-6',
      description: 'Ages 9-12 • Standard level • Full features',
      color: 'from-purple-400 to-purple-600',
      emoji: '⚡',
    },
    {
      id: 'class-7-9',
      label: 'JHS (Class 7-9)',
      description: 'Ages 12-15 • Advanced • Detailed explanations',
      color: 'from-pink-400 to-pink-600',
      emoji: '🎓',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-[400] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-3xl font-bold mb-2">What's Your Class Level?</h2>
          <p className="text-indigo-100">We'll customize the app to match your age group</p>
        </div>

        {/* Class Selector */}
        <div className="p-8 space-y-4">
          {classLevels.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => onSelect(level.id)}
              className={`w-full p-6 rounded-xl border-2 border-gray-200 hover:border-2 transition-all text-left hover:shadow-lg bg-gradient-to-r ${level.color} hover:opacity-95`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{level.emoji}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{level.label}</h3>
                  <p className="text-white/90 text-sm">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-xs text-gray-600">
          <p>💡 You can change this anytime in the Help menu</p>
        </div>
      </div>
    </div>
  );
}
