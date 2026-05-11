import { X, ChevronRight, Lightbulb } from 'lucide-react';
import { getHintsByLevel, type ClassLevel } from '../utils/hintsByLevel';

interface DemoModeProps {
  step: number;
  showHints: boolean;
  onToggleHints: () => void;
  onClose: () => void;
  classLevel: ClassLevel;
}

export function DemoMode({ step, showHints, onToggleHints, onClose, classLevel }: DemoModeProps) {
  const hint = getHintsByLevel(step, classLevel);

  if (!showHints || !hint) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-lg shadow-lg p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <h3 className="font-bold text-amber-900">{hint.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-amber-200 rounded-full p-1 transition-colors flex-shrink-0"
            title="Close hints"
          >
            <X className="w-4 h-4 text-amber-700" />
          </button>
        </div>

        {/* Tips */}
        <div className="space-y-2 mb-3">
          {hint.tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-amber-900">
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <span>{tip}</span>
            </div>
          ))}
        </div>

        {/* Main tip */}
        <div className="bg-white rounded p-3 mb-3 border border-amber-200">
          <p className="text-sm font-semibold text-amber-900">{hint.tip_title}</p>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggleHints}
          className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
        >
          ✕ Hide hints for this step
        </button>
      </div>
    </div>
  );
}
