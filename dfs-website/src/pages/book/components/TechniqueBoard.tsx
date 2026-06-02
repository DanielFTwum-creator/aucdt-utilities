import { useState, useEffect } from 'react';
import { VirtualDrums } from './VirtualDrums';
import { playOpen } from '../lib/audio';
import { 
  Compass, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  BookOpen, 
  Play, 
  RotateCcw,
  UserCheck,
  User,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface TechniqueBoardProps {
  onBackToHome: () => void;
  onProceedToStory: () => void;
}

export function TechniqueBoard({ onBackToHome, onProceedToStory }: TechniqueBoardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [gameState, setGameState] = useState<'idle' | 'calling' | 'waiting' | 'success' | 'fail'>('idle');
  const [callBeat, setCallBeat] = useState<number>(0);
  const [userBeatCount, setUserBeatCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("Ready when you are! Press 'Play Call' to listen.");
  const [highlightZone, setHighlightZone] = useState<'bass' | 'open' | 'shaker' | 'frog' | null>(null);

  // Auto-play game sequence
  const startChallenge = () => {
    if (gameState === 'calling') return;
    setGameState('calling');
    setUserBeatCount(0);
    setCallBeat(0);
    setFeedback("Listen closely... Computer is calling!");

    // Schedule 3 Open Tones spaced 500ms apart
    setTimeout(() => {
      playOpen();
      setCallBeat(1);
      setHighlightZone('open');
      setTimeout(() => setHighlightZone(null), 150);
    }, 200);

    setTimeout(() => {
      playOpen();
      setCallBeat(2);
      setHighlightZone('open');
      setTimeout(() => setHighlightZone(null), 150);
    }, 700);

    setTimeout(() => {
      playOpen();
      setCallBeat(3);
      setHighlightZone('open');
      setTimeout(() => setHighlightZone(null), 150);
    }, 1200);

    // Enter wait phase for client user response
    setTimeout(() => {
      setGameState('waiting');
      setCallBeat(0);
      setFeedback("YOUR TURN! Echo back exactly 3 Open Tones! (Tap Rim or press 'O')");
    }, 1700);
  };

  // Capture user triggers
  const handleUserPlayed = (type: 'bass' | 'open' | 'shaker' | 'frog') => {
    if (gameState !== 'waiting') return;

    if (type !== 'open') {
      setFeedback("Remember! We are practicing the OPEN TONE (strike the edge rim). Try hitting the rim instead!");
      setUserBeatCount(0);
      setGameState('idle');
      return;
    }

    const nextCount = userBeatCount + 1;
    setUserBeatCount(nextCount);

    if (nextCount === 1) {
      setFeedback("One! Good job, keep going!");
    } else if (nextCount === 2) {
      setFeedback("Two! One more!");
    } else if (nextCount === 3) {
      setGameState('success');
      setFeedback("★ THREE! Echo Achieved! 'We sound like One Big Drummer!' ★");
      // Double trigger a little success sound
      setTimeout(() => {
        playOpen();
      }, 300);
    }
  };

  const resetChallenge = () => {
    setGameState('idle');
    setUserBeatCount(0);
    setCallBeat(0);
    setFeedback("Ready when you are! Press 'Play Call' to listen.");
  };

  return (
    <div id="prep-guide-deck" className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in pb-12">
      
      {/* Sidebar navigation for steps */}
      <div className="md:col-span-4 space-y-3">
        <div className="bg-amber-950/5 border border-amber-900/10 rounded-2xl p-4">
          <h2 className="font-heading text-lg font-bold text-brand-earth flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-brand-gold" />
            Facilitator Sandbox
          </h2>
          <p className="text-xs text-amber-900/70 leading-relaxed mb-4">
            Practice these three core steps with your students before you begin telling the narrative.
          </p>

          <div className="space-y-2">
            {[
              { id: 1, title: "Step 1: Djembe & Bass Note" },
              { id: 2, title: "Step 2: Sit & Squeeze" },
              { id: 3, title: "Step 3: Teach Open Tone" }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStep(st.id);
                  resetChallenge();
                }}
                type="button"
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border text-sm flex items-center justify-between text-brand-charcoal ${
                  currentStep === st.id
                    ? 'bg-brand-earth text-white border-brand-earth shadow-sm font-bold'
                    : 'bg-white hover:bg-amber-50 border-amber-900/10 hover:border-amber-900/20'
                }`}
              >
                <span>{st.title}</span>
                {currentStep === st.id && <span className="h-2 w-2 rounded-full bg-yellow-300 animate-ping"></span>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-amber-900/10 rounded-xl p-4 space-y-2">
          <h4 className="text-xs font-bold text-brand-earth font-mono tracking-wide uppercase">
            Steve's Quick Guidance
          </h4>
          <p className="text-xs text-[#475569] leading-relaxed italic">
            &ldquo;We don't count in or demand rigid unison on step one. Let them hit on their own terms. The room will erupt in a mix of bass notes, and EVERY SINGLE one of them is correct! Instant success on day one.&rdquo;
          </p>
        </div>

        <button
          onClick={onBackToHome}
          type="button"
          id="btn-prep-home"
          className="w-full py-2.5 hover:bg-amber-100/50 hover:text-brand-earth py-2 px-4 rounded-xl border border-dashed border-amber-900/30 text-amber-900 font-medium text-xs tracking-wider uppercase transition-all text-center cursor-pointer"
        >
          &larr; Back to Main menu
        </button>
      </div>

      {/* Main explanation content panel */}
      <div className="md:col-span-8 space-y-5">
        
        {/* Step 1 Profile */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-amber-900/10 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#B45309] uppercase font-semibold bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-900/5">
              STEP ONE • THE BASICS
            </span>
            <h1 className="font-heading text-2xl font-bold text-brand-earth">
              Tell the Story of the Djembe & Teach the Bass Note
            </h1>

            <div className="bg-amber-50/40 p-4 border-l-4 border-amber-500 rounded-r-lg space-y-1">
              <span className="font-mono text-[9px] font-bold text-[#D97706] tracking-widest uppercase">
                Facilitator Dialogue Script
              </span>
              <p className="text-sm italic font-heading text-brand-earth leading-relaxed">
                &ldquo;This type of drum is called a Djembe. The djembe has been made and played in Africa for about 1000 years! The djembe is carved from a single piece of wood, meaning it comes from one single tree.&rdquo;
              </p>
            </div>

            <p className="text-sm text-[#334155] leading-relaxed">
              Once children have heard the story of the djembe, introduce the <strong className="text-brand-earth">Bass Note</strong>—the first foundational sound they will use:
            </p>

            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-950/5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">🎯</span>
                <span className="text-xs font-bold font-mono text-amber-950">TECHNIQUE PROMPT:</span>
              </div>
              <p className="text-xs text-amber-950/70 leading-relaxed italic">
                &ldquo;Watch my hand and try to do what I am doing. Place your hand flat in the center of the drum head. Keep your hand flat as you raise it up by spreading your fingers like this, and then aim to hit the drum with a flat hand and bounce your hand off the drum head.&rdquo;
              </p>
              <p className="text-xs font-semibold text-[#B45309]">
                Trigger: &ldquo;Try it!&rdquo;
              </p>
            </div>

            <div className="pt-2">
              <VirtualDrums highlightZone="bass" compact={true} />
            </div>

            <div className="flex items-start gap-3 bg-[#FAF8F3] p-4 rounded-xl text-xs text-[#475569] leading-relaxed border border-amber-950/5 mt-4">
              <div className="p-1 px-1.5 font-bold bg-[#DCFCE7] text-[#15803D] rounded hover:scale-105 font-mono">
                No Unison Mandate
              </div>
              <div>
                Notice what the facilitator does <strong className="text-brand-earth">NOT</strong> do here: There is no request for unison, no counting in, no &lsquo;everyone together.&rsquo; Each child simply tries the sound on their own terms. Instant success is the target.
              </div>
            </div>
          </div>
        )}

        {/* Step 2 Profile */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-amber-900/10 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#B45309] uppercase font-semibold bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-900/5">
              STEP TWO • ERGONOMICS
            </span>
            <h1 className="font-heading text-2xl font-bold text-brand-earth">
              How to Sit and Hold the Drum
            </h1>

            <p className="text-sm text-[#334155] leading-relaxed">
              Correct physical posture makes playing comfortable and ensures acoustic projection (since letting the bottom of the drum sit flat on the floor seals off the sound cavity, dulling the resonance!).
            </p>

            <div className="bg-amber-50/40 p-4 border-l-4 border-amber-500 rounded-r-lg space-y-1">
              <span className="font-mono text-[9px] font-bold text-[#D97706] tracking-widest uppercase">
                Facilitator Dialogue Script
              </span>
              <p className="text-sm italic font-heading text-brand-earth leading-relaxed">
                &ldquo;Sit to the front edge of your chair and see if your feet can touch the floor. Good, now bring the djembe close between your knees. Now gently squeeze the drum with your knees so that your hands are free to play on top of the drum.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              {[
                { 
                  icon: "🪑", 
                  title: "1. Edge seating", 
                  desc: "Sit slides forward. Keep back tall to avoid slouching tension." 
                },
                { 
                  icon: "👣", 
                  title: "2. Feet Anchored", 
                  desc: "Keep heels and toes flat on floor to ground the pelvic balance." 
                },
                { 
                  icon: "🦵", 
                  title: "3. Knee Squeeze", 
                  desc: "Tilt drum forward slightly. Gently squeeze with knees so bottom is open!" 
                }
              ].map((pos, idx) => (
                <div key={idx} className="bg-[#FCFAF6] border border-amber-900/5 p-3 rounded-xl text-center space-y-1">
                  <span className="text-2xl block">{pos.icon}</span>
                  <h4 className="font-bold text-xs text-brand-charcoal font-sans">{pos.title}</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{pos.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-900/5 text-xs inline-flex gap-3 items-center">
              <span className="text-lg">📢</span>
              <span>
                <strong>Acoustic Trick:</strong> Squeezing with knees and tilting the drum forward lifts the Djembe's base tunnel off the ground, letting the air vibrate out. This doubles the volume and gives deep, juicy Bass notes!
              </span>
            </div>
          </div>
        )}

        {/* Step 3 Profile */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-amber-900/10 space-y-5">
            <span className="text-[10px] font-mono tracking-widest text-[#B45309] uppercase font-semibold bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-900/5">
              STEP THREE • UNISON TRAINING
            </span>
            <h1 className="font-heading text-2xl font-bold text-brand-earth">
              Teaching the Open Tone
            </h1>

            <p className="text-sm text-[#334155] leading-relaxed">
              Once the Bass Note has been explored individually, introduce the <strong className="text-brand-earth">Open Tone</strong>—the second foundational sound. Demonstrate the technique first, then invite children to try it through Call & Response:
            </p>

            <div className="bg-amber-50/40 p-4 border-l-4 border-amber-500 rounded-r-lg space-y-2">
              <span className="font-mono text-[9px] font-bold text-[#D97706] tracking-widest uppercase">
                Facilitator Dialogue Script
              </span>
              <p className="text-xs italic font-heading text-brand-earth leading-relaxed space-y-2">
                <span className="block">&ldquo;Put your hand on the edge of the drum with just your fingers touching the drum head. Again we will try to hit the drum with flat fingers and let our hands bounce off the drum head — to produce the Open sound.&rdquo;</span>
                <span className="block mt-1 font-semibold">&ldquo;But this time we will do Call & Response, or "echo" — I’ll play 1, 2, 3 — and I want you to respond together: 1, 2, 3.&rdquo;</span>
              </p>
            </div>

            {/* CALL AND RESPONSE MINIGAME INTERACTIVE PANEL */}
            <div className="bg-brand-earth/5 border border-brand-earth/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-brand-earth/10 pb-2">
                <h3 className="font-sans font-bold text-xs text-brand-earth tracking-wide uppercase flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-brand-gold" />
                  Rhythm Echo Challenge Engine
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  gameState === 'calling' ? 'bg-amber-500 text-white animate-pulse' :
                  gameState === 'waiting' ? 'bg-rose-500 text-white animate-pulse' :
                  gameState === 'success' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {gameState === 'idle' && "STANDBY"}
                  {gameState === 'calling' && "LEADER DRUMS..."}
                  {gameState === 'waiting' && "ECHO TIME!"}
                  {gameState === 'success' && "UNISON HIT!"}
                </span>
              </div>

              {/* Display Box */}
              <div className="bg-white border border-amber-900/5 p-4 rounded-xl flex flex-col items-center text-center space-y-3">
                <p className="text-xs text-charcoal font-medium">
                  {feedback}
                </p>

                {/* Beat lights */}
                {gameState === 'calling' && (
                  <div className="flex gap-4">
                    {[1, 2, 3].map((b) => (
                      <div 
                        key={b}
                        className={`h-8 w-8 rounded-full flex items-center justify-center border font-mono text-xs font-bold transition-all ${
                          callBeat === b 
                            ? 'bg-amber-600 border-amber-600 text-white scale-110 shadow-md animate-ping' 
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}

                {/* User Response counters */}
                {gameState === 'waiting' && (
                  <div className="flex gap-4">
                    {[1, 2, 3].map((b) => (
                      <div 
                        key={b}
                        className={`h-8 w-8 rounded-full flex items-center justify-center border font-mono text-xs font-bold transition-all ${
                          userBeatCount >= b 
                            ? 'bg-rose-600 border-rose-600 text-white scale-105' 
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        {userBeatCount >= b ? "✓" : b}
                      </div>
                    ))}
                  </div>
                )}

                {/* Success Trophy */}
                {gameState === 'success' && (
                  <div className="flex flex-col items-center gap-2 py-2 animate-bounce">
                    <CheckCircle2 className="h-10 w-10 text-brand-green" />
                    <span className="text-xs font-bold font-mono text-brand-green">SUCCESSFUL COOPERATIVE ECHO!</span>
                  </div>
                )}

                <div className="flex gap-2 w-full pt-1">
                  {gameState === 'idle' ? (
                    <button
                      onClick={startChallenge}
                      type="button"
                      className="flex-1 py-2 bg-brand-gold text-white font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-brand-gold/90 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" /> Start Call Echo
                    </button>
                  ) : (
                    <button
                      onClick={resetChallenge}
                      type="button"
                      className="flex-1 py-2 bg-[#64748B] text-white font-semibold text-xs tracking-wider uppercase rounded-lg hover:bg-[#475569] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Trainer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Virtual Drums */}
            <div className="pt-2">
              <VirtualDrums 
                highlightZone={highlightZone} 
                compact={true} 
                onPlayedSound={handleUserPlayed} 
              />
            </div>

            {/* The Rest / Stop Sign Tip */}
            <div className="bg-[#FAF8F3] border border-amber-950/5 p-4 rounded-xl text-xs text-[#475569] leading-relaxed space-y-2 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="p-0.5 px-1.5 font-bold bg-amber-200 text-amber-900 rounded font-mono">
                  Beginning on Cue Note
                </span>
                <span className="font-semibold text-brand-earth">The Stop Sign Technique:</span>
              </div>
              <p>
                If some children respond immediately without waiting for your call to end, hold one hand out in front like a <strong className="text-brand-red">Stop Sign</strong>:
              </p>
              <p className="italic text-brand-earth bg-white p-2.5 rounded border border-amber-900/5 text-[11px]">
                &ldquo;There is a pause after I stop before you begin. Watch my hand. If my hand is like this (Stop Sign) — don’t play. When my hand goes down like this (Palm Down) — you begin.&rdquo;
              </p>
              <p>
                This teaches them to watch for a physical conductor's cue and hold their sensorimotor impulse until the exact downbeat is given—a foundational skill for collaborative playing.
              </p>
            </div>
          </div>
        )}

        {/* Proceed CTA */}
        <div className="flex justify-between items-center bg-amber-50 p-4 rounded-2xl border border-amber-900/10">
          <p className="text-xs text-amber-950 font-medium">Ready to see these techniques applied in a story?</p>
          <button
            onClick={onProceedToStory}
            type="button"
            id="btn-nav-to-story"
            className="py-2 px-4 bg-brand-earth text-white font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-black transition-colors cursor-pointer"
          >
            Launch Interactive Story &rarr;
          </button>
        </div>

      </div>

    </div>
  );
}
