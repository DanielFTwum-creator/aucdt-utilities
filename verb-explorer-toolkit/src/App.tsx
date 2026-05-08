import { useState, useEffect } from 'react';
import { 
  Dices, BookOpen, Globe, PenTool, Lightbulb, 
  Printer, ListChecks, ArrowLeft, ArrowRight 
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [verb, setVerb] = useState('');
  const [studentName, setStudentName] = useState('');
  const [research, setResearch] = useState({
    definition: '',
    origin: '',
    sentences: '',
    interesting: ''
  });
  const [cardColor, setCardColor] = useState('bg-yellow-100');
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const verbCategories = {
    action: ['Run', 'Dance', 'Explore', 'Discover', 'Create', 'Jump', 'Swim'],
    everyday: ['Help', 'Learn', 'Grow', 'Change', 'Play', 'Eat', 'Sleep'],
    interesting: ['Soar', 'Sparkle', 'Whisper', 'Triumph', 'Buzzle', 'Glimmer']
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const pickRandomVerb = () => {
    const allVerbs = [...verbCategories.action, ...verbCategories.everyday, ...verbCategories.interesting];
    const random = allVerbs[Math.floor(Math.random() * allVerbs.length)];
    setVerb(random);
  };

  const toggleTimer = () => setIsTimerActive(!isTimerActive);
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(180);
  };

  useEffect(() => {
    let interval: number | null = null;
    if (isTimerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderDigitalCard = () => (
    <div className={`manila-card ${cardColor} p-8 rounded-xl max-w-3xl mx-auto shadow-2xl relative overflow-hidden border-2 border-gray-300`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start border-b-2 border-gray-400 pb-4 mb-6">
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verb Profile By:</h4>
            <p className="text-xl font-bold font-serif">{studentName || '_____________________'}</p>
          </div>
          <div className="text-right">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md transform rotate-3 inline-block">TOP SECRET DISCOVERY</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-7xl font-extrabold uppercase comic-font tracking-widest text-gray-800 drop-shadow-md">
            {verb || '????'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-blue-200 transform -rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-blue-600 border-b-2 border-blue-100 pb-1 mb-2">📖 Meaning</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.definition || 'No definition written yet.'}</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-green-200 transform rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-green-600 border-b-2 border-green-100 pb-1 mb-2">🌍 Origin</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.origin || 'No origin written yet.'}</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-purple-200 md:col-span-2 transform -rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-purple-600 border-b-2 border-purple-100 pb-1 mb-2">💡 Interesting Facts</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.interesting || 'No interesting facts written yet.'}</p>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl shadow border-2 border-orange-200 md:col-span-2 transform rotate-1 hover:rotate-0 transition-transform">
            <h3 className="font-bold text-orange-600 border-b-2 border-orange-100 pb-1 mb-2">📝 Example Sentences</h3>
            <p className="font-medium text-gray-700 whitespace-pre-line">{research.sentences || 'No sentences written yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10 print:hidden">
        <div className="inline-block bg-white px-8 py-4 rounded-3xl card-shadow border-b-4 border-primary mb-4 transform -rotate-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 comic-font">
            <span className="text-primary">Verb</span> Discovery <span className="text-secondary">Project</span>
          </h1>
        </div>
        <p className="text-xl text-gray-700 font-semibold mt-2">Class 4 Digital Toolkit 🛠️</p>
      </div>

      {/* Progress Tracker */}
      <div className="max-w-3xl mx-auto mb-10 print:hidden">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full z-0"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-2 bg-primary rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[1, 2, 3, 4].map(num => (
            <button 
              key={num} 
              onClick={() => setStep(num)}
              className={`relative z-10 w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center transition-all duration-300 border-4 ${
                step === num ? 'bg-primary text-white border-white scale-125 shadow-lg' : 
                step > num ? 'bg-primary text-white border-primary' : 
                'bg-white text-gray-400 border-gray-200 hover:border-primary'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs md:text-sm font-bold text-gray-500 px-2">
          <span className={step >= 1 ? 'text-primary' : ''}>Choose</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Research</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Create Profile</span>
          <span className={step >= 4 ? 'text-primary' : ''}>Present</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-10 card-shadow border border-white print:hidden">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-primary mb-4">Step 1️⃣: Choose Your Verb!</h2>
            <p className="text-center text-lg">Pick a verb that interests you. The more you like it, the funner it will be!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-700 mb-2">🏃🏽‍♂️ Action Verbs</h3>
                <div className="flex flex-wrap gap-2">
                  {verbCategories.action.map(v => (
                    <button key={v} onClick={() => setVerb(v)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${verb === v ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 hover:bg-blue-100 border border-blue-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-700 mb-2">🌱 Everyday Verbs</h3>
                <div className="flex flex-wrap gap-2">
                  {verbCategories.everyday.map(v => (
                    <button key={v} onClick={() => setVerb(v)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${verb === v ? 'bg-green-500 text-white' : 'bg-white text-green-600 hover:bg-green-100 border border-green-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <h3 className="font-bold text-purple-700 mb-2">✨ Interesting Verbs</h3>
                <div className="flex flex-wrap gap-2">
                  {verbCategories.interesting.map(v => (
                    <button key={v} onClick={() => setVerb(v)} className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${verb === v ? 'bg-purple-500 text-white' : 'bg-white text-purple-600 hover:bg-purple-100 border border-purple-300'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-6 p-6 bg-white rounded-2xl shadow-inner border-2 border-dashed border-gray-300">
              <p className="mb-3 font-semibold text-gray-600">Or type your own / Pick a random one!</p>
              <div className="flex gap-2 w-full max-w-md">
                <input 
                  type="text" 
                  value={verb} 
                  onChange={(e) => setVerb(e.target.value)} 
                  placeholder="Type a verb here..." 
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-xl text-center font-bold"
                />
                <button onClick={pickRandomVerb} className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-xl font-bold bouncy flex-shrink-0">
                  <Dices className="text-xl w-6 h-6" />
                </button>
              </div>
            </div>

            {verb && (
              <div className="text-center mt-6 animate-bounce">
                <p className="text-lg">You selected:</p>
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary comic-font uppercase tracking-wider my-2">
                  {verb}
                </h1>
                <p className="text-green-600 font-bold">Great choice! Let's go research it.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-secondary mb-2">Step 2️⃣: Research Station 🔍</h2>
            <p className="text-center text-gray-600 mb-6">Use a dictionary or ask a teacher to find out more about <b>"{verb || 'your verb'}"</b>.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-blue-400">
                <label className="flex items-center font-bold text-blue-700 mb-2">
                  <BookOpen className="w-5 h-5 mr-2" /> What does it mean?
                </label>
                <p className="text-xs text-gray-500 mb-2">Write the definition in your own words.</p>
                <textarea 
                  value={research.definition}
                  onChange={(e) => setResearch({...research, definition: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
                  placeholder="It means to..."
                />
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-green-400">
                <label className="flex items-center font-bold text-green-700 mb-2">
                  <Globe className="w-5 h-5 mr-2" /> Where did it come from?
                </label>
                <p className="text-xs text-gray-500 mb-2">History or origin (e.g., from Latin or Old English).</p>
                <textarea 
                  value={research.origin}
                  onChange={(e) => setResearch({...research, origin: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-green-400 focus:outline-none resize-none"
                  placeholder="It originally came from..."
                />
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-orange-400 md:col-span-2">
                <label className="flex items-center font-bold text-orange-700 mb-2">
                  <PenTool className="w-5 h-5 mr-2" /> How is it used?
                </label>
                <p className="text-xs text-gray-500 mb-2">Write 2 excellent sentences using your verb.</p>
                <textarea 
                  value={research.sentences}
                  onChange={(e) => setResearch({...research, sentences: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none resize-none"
                  placeholder="1. &#10;2. "
                />
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow border-t-4 border-purple-400 md:col-span-2">
                <label className="flex items-center font-bold text-purple-700 mb-2">
                  <Lightbulb className="w-5 h-5 mr-2" /> What's interesting about it?
                </label>
                <p className="text-xs text-gray-500 mb-2">Multiple meanings? Synonyms? Fun facts?</p>
                <textarea 
                  value={research.interesting}
                  onChange={(e) => setResearch({...research, interesting: e.target.value})}
                  className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
                  placeholder="An interesting fact is..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="print:hidden">
              <h2 className="text-2xl font-bold text-center text-orange-600 mb-2">Step 3️⃣: Create Your Verb Profile 🎨</h2>
              <p className="text-center text-gray-600 mb-4">Design your Manila card! Fill in your name and pick a card colour.</p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your Name & Class (e.g. Ama - Class 4)" 
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg w-full max-w-xs focus:outline-none focus:border-orange-400"
                />
                <div className="flex gap-2">
                  <button onClick={() => setCardColor('bg-yellow-100')} className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                  <button onClick={() => setCardColor('bg-blue-100')} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                  <button onClick={() => setCardColor('bg-pink-100')} className="w-8 h-8 rounded-full bg-pink-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                  <button onClick={() => setCardColor('bg-green-100')} className="w-8 h-8 rounded-full bg-green-100 border-2 border-gray-400 hover:scale-110 transition-transform cursor-pointer"></button>
                </div>
                <button onClick={() => window.print()} className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-black bouncy cursor-pointer">
                  <Printer className="w-5 h-5 mr-2" /> Print Card
                </button>
              </div>
            </div>

            {renderDigitalCard()}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in print:hidden">
            <h2 className="text-2xl font-bold text-center text-primary mb-2">Step 4️⃣: Practice Your Presentation 🎤</h2>
            <p className="text-center text-gray-600 mb-6">You need to talk for 2-3 minutes. Use the timer below to practice!</p>
            
            <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
              <div className="flex-1 bg-white p-6 rounded-2xl card-shadow">
                <h3 className="flex items-center text-xl font-bold mb-4 text-gray-800">
                  <ListChecks className="text-green-500 w-6 h-6 mr-2" /> Checklist for Monday 11th May 2026
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">My Manila card profile is complete and colourful.</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">I can explain the meaning in my own words.</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">I have picked the <b>most interesting fact</b> to share with the class.</span>
                  </li>
                  <li className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 w-5 h-5 accent-green-500 rounded cursor-pointer" />
                    <span className="text-lg">I have practiced speaking loudly and clearly.</span>
                  </li>
                </ul>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <p className="font-bold text-yellow-800 text-center">🎯 Remember! Earning your 20 marks will be FUN! 💃🏾🕺🏾</p>
                </div>
              </div>

              <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl card-shadow text-white flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-gray-300 mb-2">Practice Timer</h3>
                <p className="text-sm text-gray-400 mb-6">Aim for 2 to 3 minutes!</p>
                
                <div className={`text-7xl font-mono font-bold mb-8 ${timeLeft <= 60 ? 'text-red-400' : 'text-green-400'} comic-font`}>
                  {formatTime(timeLeft)}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={toggleTimer} 
                    className={`px-6 py-3 rounded-xl font-bold text-lg w-32 ${isTimerActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} transition-colors cursor-pointer`}
                  >
                    {isTimerActive ? 'Pause' : 'Start'}
                  </button>
                  <button 
                    onClick={resetTimer} 
                    className="px-6 py-3 rounded-xl font-bold text-lg bg-red-500 hover:bg-red-600 transition-colors w-32 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10 pt-6 border-t-2 border-gray-200/60 print:hidden">
          <button 
            onClick={handleBack} 
            disabled={step === 1}
            className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center ${step === 1 ? 'opacity-0 cursor-default' : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 bouncy cursor-pointer'}`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={handleNext} 
              disabled={step === 1 && !verb}
              className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center transition-all ${step === 1 && !verb ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-indigo-700 bouncy shadow-lg cursor-pointer'}`}
            >
              Next Step <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <div className="text-right">
              <p className="font-bold text-gray-600 mb-1">📅 Due: Monday 11th May 2026</p>
              <p className="text-sm text-gray-500">Good luck!</p>
            </div>
          )}
        </div>
      </div>

      {/* Print Version Only Appears on Print */}
      <div className="hidden print:block">
        {step !== 3 && (
          <div className="text-center p-10">
            <h2>Please go to Step 3 to print your Verb Profile!</h2>
          </div>
        )}
        {step === 3 && renderDigitalCard()}
      </div>
    </div>
  );
}
