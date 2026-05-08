import { useState } from 'react';
import { X, BookOpen, Users } from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
}

export function UserGuide({ onClose }: UserGuideProps) {
  const [tab, setTab] = useState<'student' | 'instructor'>('student');

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">📖 User Guide</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setTab('student')}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              tab === 'student'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-5 h-5" /> For Students
          </button>
          <button
            onClick={() => setTab('instructor')}
            className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              tab === 'instructor'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-5 h-5" /> For Instructors
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {tab === 'student' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">🎯 Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to the Verb Discovery Toolkit! This app helps you discover, research, and create a profile for English verbs. Follow these 4 steps to complete your project.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">📝 Step 1: Choose Your Verb</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Browse categories:</strong> Pick from Action, Everyday, or Interesting verbs</li>
                  <li>• <strong>Type your own:</strong> Enter any verb you like in the text box</li>
                  <li>• <strong>Random verb:</strong> Click the dice icon 🎲 to pick a random verb</li>
                  <li>• <strong>Tip:</strong> Choose a verb that interests you—it makes research more fun!</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">🔍 Step 2: Research Station</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>What does it mean?</strong> Write the definition in your own words</li>
                  <li>• <strong>Where did it come from?</strong> Find the history or origin (e.g., from Latin)</li>
                  <li>• <strong>How is it used?</strong> Write 2 excellent sentences using your verb</li>
                  <li>• <strong>What's interesting?</strong> Share synonyms, multiple meanings, or fun facts</li>
                  <li>• <strong>Tip:</strong> Use a dictionary, ask your teacher, or search online</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">🎨 Step 3: Create Your Profile Card</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Enter your name:</strong> Type your name and class (e.g., "Ama - Class 4")</li>
                  <li>• <strong>Pick a colour:</strong> Choose from yellow, blue, pink, or green</li>
                  <li>• <strong>Print your card:</strong> Click the Print button to print your Manila card</li>
                  <li>• <strong>Tip:</strong> Your handwritten research will appear on the printed card</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">🎤 Step 4: Practice Your Presentation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Use the timer:</strong> Practice speaking for 2-3 minutes</li>
                  <li>• <strong>What to say:</strong> Explain the meaning, origin, and interesting facts</li>
                  <li>• <strong>Checklist:</strong> Follow the items on the checklist to prepare</li>
                  <li>• <strong>Tip:</strong> Speak loudly and clearly so everyone can hear</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-900 font-semibold">💡 Pro Tip</p>
                <p className="text-blue-800 mt-1">Your progress is saved automatically. You can close the app and come back later—all your research will still be there!</p>
              </div>
            </div>
          )}

          {tab === 'instructor' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">📚 Classroom Setup</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Install the app on each student's device from the App Store or Play Store</li>
                  <li>• No internet required—the app works fully offline</li>
                  <li>• Each student gets their own independent workspace</li>
                  <li>• No accounts or logins needed—just install and open</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">📅 Suggested Timeline</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Day 1:</strong> Students choose verbs and begin research (Step 1-2)</li>
                  <li>• <strong>Day 2:</strong> Complete research and create profile cards (Step 3)</li>
                  <li>• <strong>Day 3:</strong> Practice presentations (Step 4)</li>
                  <li>• <strong>Day 4-5:</strong> Live presentations to the class</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">🖨️ Printing Instructions</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Students complete their profile in Step 3</li>
                  <li>• Click "Print Card" button to open the print dialog</li>
                  <li>• Use a colour printer for best results (Manila card colours are preserved)</li>
                  <li>• Print on A5 or half-page size for a nice card format</li>
                  <li>• Display printed cards on a classroom bulletin board</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">🎯 Assessment Criteria (20 Marks)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Research Quality (8 marks):</strong> Accurate definition, origin, and usage</li>
                  <li>• <strong>Presentation Skills (7 marks):</strong> Clear speech, volume, confidence</li>
                  <li>• <strong>Profile Card (3 marks):</strong> Neatness, colours, completeness</li>
                  <li>• <strong>Participation (2 marks):</strong> Effort and engagement throughout</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">💡 Tips for Success</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Model the process:</strong> Do the first verb as an example</li>
                  <li>• <strong>Guide research:</strong> Help students find authoritative sources</li>
                  <li>• <strong>Practice presentations:</strong> Use the timer with the whole class</li>
                  <li>• <strong>Celebrate learning:</strong> Display all cards and recognize effort</li>
                  <li>• <strong>Extend learning:</strong> Ask students to create verb posters or word maps</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">❓ Troubleshooting</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Data lost:</strong> Data is stored locally—uninstalling deletes everything</li>
                  <li>• <strong>Print not working:</strong> Check device is connected to a printer</li>
                  <li>• <strong>App not responding:</strong> Force close app and reopen</li>
                  <li>• <strong>Need help?</strong> Contact: daniel.twum@techbridge.edu.gh</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <p className="text-purple-900 font-semibold">📝 Teacher Checklist</p>
                <ul className="text-purple-800 mt-2 space-y-1 text-sm">
                  <li>☐ Install app on all student devices</li>
                  <li>☐ Explain all 4 steps with examples</li>
                  <li>☐ Provide research resources (dictionaries, internet access)</li>
                  <li>☐ Set clear deadlines for each step</li>
                  <li>☐ Arrange printer for card printing</li>
                  <li>☐ Plan presentation schedule</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
