import { X, ChevronRight, Lightbulb } from 'lucide-react';

interface DemoModeProps {
  step: number;
  showHints: boolean;
  onToggleHints: () => void;
  onClose: () => void;
}

export function DemoMode({ step, showHints, onToggleHints, onClose }: DemoModeProps) {
  const hints = {
    1: {
      title: '💡 Demo Hint: Choose a Verb',
      tips: [
        'Click on any verb in the categories, or',
        'Type "discover" in the text box to try a verb, or',
        'Click the dice 🎲 to pick a random verb',
      ],
      tip_title: 'Try choosing "Discover" to see how the app works!',
    },
    2: {
      title: '💡 Demo Hint: Research Your Verb',
      tips: [
        'Fill in the definition in your own words',
        'Find where the word comes from (origin)',
        'Write 2 sentences using the verb',
        'Share interesting facts or synonyms',
      ],
      tip_title: 'Example: "Discover" means to find something new!',
    },
    3: {
      title: '💡 Demo Hint: Create Your Card',
      tips: [
        'Enter your name and class (e.g., "Demo - Class 4")',
        'Pick a card colour (yellow, blue, pink, or green)',
        'Click the Print button to see your card',
      ],
      tip_title: 'Your profile card displays all your research beautifully!',
    },
    4: {
      title: '💡 Demo Hint: Practice Presentation',
      tips: [
        'Click Start to begin the 2-3 minute timer',
        'Practice explaining your verb to the class',
        'Use the checklist to make sure you\'re ready',
        'When done, present to your actual class!',
      ],
      tip_title: 'Speak clearly and with confidence!',
    },
  };

  const hint = hints[step as keyof typeof hints];

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
