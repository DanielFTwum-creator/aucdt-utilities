import { useState } from 'react';
import { X, BookOpen, Users } from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
}

export function UserGuide({ onClose }: UserGuideProps) {
  const [tab, setTab] = useState<'student' | 'instructor'>('student');

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-4xl h-[95vh] md:h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 md:p-4 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg md:text-2xl font-bold">📖 User Guide</h2>
          <button type="button" onClick={onClose} className="hover:bg-white/20 rounded-full p-1 md:p-2 transition-colors" title="Close guide">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b flex-shrink-0">
          <button
            type="button"
            onClick={() => setTab('student')}
            className={`flex-1 px-3 md:px-6 py-2 md:py-3 font-semibold flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base transition-colors ${
              tab === 'student'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">For Students</span><span className="md:hidden">Students</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('instructor')}
            className={`flex-1 px-3 md:px-6 py-2 md:py-3 font-semibold flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base transition-colors ${
              tab === 'instructor'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">For Instructors</span><span className="md:hidden">Teachers</span>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-3 md:p-6 space-y-3 md:space-y-6 text-sm md:text-base">
          {tab === 'student' && (
            <div className="space-y-2 md:space-y-4">
              <div>
                <h3 className="font-bold text-blue-600 mb-1">🎯 Overview</h3>
                <p className="text-gray-700 text-xs md:text-sm leading-tight">
                  Discover, research, and create a profile for English verbs. Follow 4 steps to complete your project.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">📝 Step 1: Choose Verb</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Pick from Action, Everyday, or Interesting categories</li>
                  <li>• Type your own verb, or click dice 🎲 for a random one</li>
                  <li>• Choose a verb you find interesting!</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">🔍 Step 2: Research</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Write the definition in your own words</li>
                  <li>• Find the history or origin (e.g., from Latin)</li>
                  <li>• Write 2 sentences using your verb</li>
                  <li>• Share synonyms or interesting facts</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">🎨 Step 3: Create Card</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Enter your name and class</li>
                  <li>• Pick a card colour (yellow, blue, pink, green)</li>
                  <li>• Click Print to print your Manila card</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-blue-600 mb-1">🎤 Step 4: Present</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Practice for 2-3 minutes using the timer</li>
                  <li>• Explain meaning, origin, and interesting facts</li>
                  <li>• Speak loudly and clearly</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-2 md:p-3 rounded border-l-4 border-blue-500 text-xs md:text-sm">
                <p className="text-blue-900 font-semibold">💡 Tip: Your progress saves automatically!</p>
              </div>
            </div>
          )}

          {tab === 'instructor' && (
            <div className="space-y-2 md:space-y-4">
              <div>
                <h3 className="font-bold text-purple-600 mb-1">📚 Setup</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Install app from App Store or Play Store</li>
                  <li>• No internet required—fully offline</li>
                  <li>• Each student gets independent workspace</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">📅 Timeline</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Day 1: Choose verb & research (Steps 1-2)</li>
                  <li>• Day 2: Create cards (Step 3)</li>
                  <li>• Day 3: Practice (Step 4)</li>
                  <li>• Days 4-5: Live presentations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">🖨️ Printing</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Step 3: Click "Print Card" button</li>
                  <li>• Use colour printer (best results)</li>
                  <li>• Print on A5 or half-page size</li>
                  <li>• Display on bulletin board</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">🎯 Assessment (20 Marks)</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Research (8) • Presentation (7) • Card (3) • Participation (2)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">💡 Success Tips</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Model the process with example</li>
                  <li>• Guide students to authoritative sources</li>
                  <li>• Practice presentations as a class</li>
                  <li>• Display all cards and celebrate effort</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-purple-600 mb-1">❓ Troubleshooting</h3>
                <ul className="space-y-1 text-gray-700 text-xs md:text-sm">
                  <li>• Data lost: Stored locally—uninstall deletes it</li>
                  <li>• Print issue: Check printer connection</li>
                  <li>• App stuck: Force close and reopen</li>
                  <li>• Help: daniel.twum@techbridge.edu.gh</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-2 md:p-3 rounded border-l-4 border-purple-500 text-xs md:text-sm">
                <p className="text-purple-900 font-semibold">✓ Checklist: Install • Explain • Resource • Deadline • Printer • Schedule</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
