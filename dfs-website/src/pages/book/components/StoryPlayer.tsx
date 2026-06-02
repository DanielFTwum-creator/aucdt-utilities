import { useState, useEffect, useRef } from 'react';
import { STORY_SCENES } from '../lib/data';
import { StoryScene, SceneCue } from '../types';
import { VirtualDrums } from './VirtualDrums';
import { playBass, playOpen, playShaker, playFrog, startAmbientSavannah } from '../lib/audio';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  Smile, 
  VolumeX, 
  Volume2, 
  Flame, 
  Moon, 
  Music,
  MapPin,
  ArrowBigLeftDash
} from 'lucide-react';

interface StoryPlayerProps {
  onBackToHome: () => void;
}

export function StoryPlayer({ onBackToHome }: StoryPlayerProps) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [highlightedInstrument, setHighlightedInstrument] = useState<'bass' | 'open' | 'shaker' | 'frog' | null>(null);
  const [autoBeatTimer, setAutoBeatTimer] = useState<NodeJS.Timeout | null>(null);
  const [isRunningRhythm, setIsRunningRhythm] = useState<boolean>(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(true);
  const [activeCueId, setActiveCueId] = useState<string | null>(null);
  const [customVisualFocus, setCustomVisualFocus] = useState<string | null>(null);

  const ambientRef = useRef<{ stop: () => void } | null>(null);

  // Core background ambient synthesis effect
  useEffect(() => {
    if (isAmbientPlaying) {
      if (!ambientRef.current) {
        ambientRef.current = startAmbientSavannah();
      }
    } else {
      if (ambientRef.current) {
        ambientRef.current.stop();
        ambientRef.current = null;
      }
    }

    return () => {
      if (ambientRef.current) {
        ambientRef.current.stop();
        ambientRef.current = null;
      }
    };
  }, [isAmbientPlaying]);

  const scene: StoryScene = STORY_SCENES[currentSceneIdx];
  const currentVisualFocus = customVisualFocus || scene.visualFocus;

  // Helper to dynamically guide which drum zone is relevant
  useEffect(() => {
    setActiveCueId(null);
    setCustomVisualFocus(null);
    switch (scene.id) {
      case 4:
        setHighlightedInstrument('bass');
        break;
      case 5:
        setHighlightedInstrument('open');
        break;
      case 6:
        setHighlightedInstrument('bass');
        break;
      case 7:
        setHighlightedInstrument('frog');
        break;
      case 8:
        setHighlightedInstrument('open'); // monkey chatter returns
        break;
      default:
        setHighlightedInstrument(null);
    }
    
    // Stop any auto rhythm on scene changes
    stopAutoRhythm();
  }, [scene.id]);

  // Audio helper to teach the teacher/parent the layout by auto-practicing the scene's drum cues
  const playPatternDemo = () => {
    if (isRunningRhythm) {
      stopAutoRhythm();
      return;
    }

    setIsRunningRhythm(true);
    let step = 0;

    const run = () => {
      if (scene.id === 4) {
        // Slow walk
        playBass();
        step++;
        const nextTime = step >= 3 ? 1200 : 600; // Slowing down at the end of the step list to mirror decelerando
        const timer = setTimeout(run, nextTime);
        setAutoBeatTimer(timer);
      } else if (scene.id === 5) {
        // Monkey chatter
        playOpen();
        step++;
        const timer = setTimeout(run, 140 + (Math.random() * 80));
        setAutoBeatTimer(timer);
      } else if (scene.id === 6 || scene.id === 8) {
        // Panicked running roll / Questioning
        if (scene.id === 6) {
          playBass();
          const timer = setTimeout(run, 120);
          setAutoBeatTimer(timer);
        } else {
          playOpen();
          const timer = setTimeout(run, 150);
          setAutoBeatTimer(timer);
        }
      } else if (scene.id === 7) {
        // Snake rattling
        playShaker(0.4);
        const timer = setTimeout(run, 180);
        setAutoBeatTimer(timer);
      }
    };

    run();
  };

  const stopAutoRhythm = () => {
    if (autoBeatTimer) {
      clearTimeout(autoBeatTimer);
      setAutoBeatTimer(null);
    }
    setIsRunningRhythm(false);
  };

  useEffect(() => {
    return () => {
      if (autoBeatTimer) clearTimeout(autoBeatTimer);
    };
  }, [autoBeatTimer]);

  const nextScene = () => {
    if (currentSceneIdx < STORY_SCENES.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  const prevScene = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(currentSceneIdx - 1);
    }
  };

  return (
    <div id="story-player-screen" className="space-y-6 animate-fade-in pb-12">
      
      {/* Upper Navigation Tracker bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-amber-900/10 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            type="button"
            id="btn-story-home"
            className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs tracking-wider uppercase font-bold text-brand-earth hover:text-black hover:scale-102 transition-all cursor-pointer bg-amber-50 p-1.5 px-3 rounded-lg border border-amber-950/10"
          >
            <ArrowBigLeftDash className="h-4 w-4" /> Menu
          </button>

          {/* Ambient Soundtrack Toggle - subtle and unobtrusive */}
          <button
            onClick={() => setIsAmbientPlaying(prev => !prev)}
            type="button"
            id="btn-ambient-toggle"
            className={`flex items-center gap-1 font-mono text-[10px] sm:text-xs tracking-wider uppercase font-bold p-1.5 px-2.5 rounded-lg border transition-all cursor-pointer ${
              isAmbientPlaying 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            title={isAmbientPlaying ? "Pause background savannah audio" : "Play background savannah audio"}
          >
            {isAmbientPlaying ? (
              <>
                <span className="relative flex h-2 w-2 mr-0.5 animate-pulse">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Volume2 className="h-3.5 w-3.5" /> Ambient: On
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-slate-400 mr-0.5" /> Ambient: Off
              </>
            )}
          </button>
        </div>

        {/* Bullet Progress track */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[200px] sm:max-w-none">
          {STORY_SCENES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSceneIdx(idx)}
              type="button"
              className={`h-6 w-6 rounded-full flex items-center justify-center font-mono text-[10px] font-semibold transition-all border shrink-0 ${
                idx === currentSceneIdx
                  ? 'bg-brand-earth text-white font-bold border-brand-earth ring-2 ring-brand-earth/20 scale-110'
                  : 'bg-[#FAF8F3] hover:bg-amber-100/50 border-amber-950/10 text-[#78350F]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-900/60 uppercase">
          SCENE {currentSceneIdx + 1} of {STORY_SCENES.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Narrative flow & theatrical prompts */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main prompt backdrop */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-900/10 shadow-xs space-y-5 relative overflow-hidden">
            
            {/* Savannah Background Accents depending on mood */}
            <div className={`absolute top-0 left-0 right-0 h-4 ${
              scene.id === 6 ? 'bg-red-600' :
              scene.id === 7 ? 'bg-emerald-600' :
              scene.id === 9 ? 'bg-indigo-950' : 'bg-amber-500'
            }`}></div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-mono tracking-widest text-[#B45309] uppercase font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-950/5">
                SCENE {scene.id} • {scene.title}
              </span>
              
              {/* Optional Auto Play controller for matching loop rhythms */}
              {[4, 5, 6, 7, 8].includes(scene.id) && (
                <button
                  onClick={playPatternDemo}
                  type="button"
                  className={`text-[10px] p-1.5 px-3 rounded-lg border font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                    isRunningRhythm 
                      ? 'bg-red-50 text-brand-red border-red-200 animate-pulse' 
                      : 'bg-emerald-50 text-brand-green border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {isRunningRhythm ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5" /> Stop Loop
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" /> Loop Rhythm
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Core Story text in high contrast display format */}
            <div className="border-b border-amber-900/5 pb-5">
              <p className="font-heading text-lg sm:text-2xl leading-relaxed text-[#1E293B] italic select-text">
                &ldquo;{scene.narrative}&rdquo;
              </p>
            </div>

            {/* Actor blocks step guidance */}
            <div className="space-y-3.5">
              <h4 className="font-mono text-[10px] text-amber-900/50 uppercase tracking-widest font-bold">
                Theatrical Cues &amp; Performance Guidance
              </h4>

              <div className="space-y-2.5">
                {scene.cues.map((cue) => {
                  const isFacilitator = cue.type === 'facilitator';
                  const isChildren = cue.type === 'children';
                  const isDrum = cue.type === 'drum_cue';
                  const isTrumpetCue = cue.id === 's3-c4' || cue.text.includes('Make a long, slow elephant trumpet sound');

                  return (
                    <div 
                      key={cue.id} 
                      className={`p-3 rounded-xl border text-sm transition-all cursor-pointer relative overflow-hidden select-none hover:scale-[1.01] ${
                        activeCueId === cue.id
                          ? isChildren
                            ? 'bg-emerald-50 border-emerald-500 text-[#15803D] font-bold text-center border-l-4 shadow-md ring-2 ring-emerald-300/40'
                            : isDrum
                              ? 'bg-amber-900/10 border-amber-900 text-brand-earth font-mono text-xs pl-4 ring-2 ring-amber-700/30'
                              : 'bg-[#FCFAF6] border-orange-500 text-brand-earth pl-4 ring-2 ring-orange-500/20 shadow-xs'
                          : isFacilitator 
                            ? 'bg-[#FCFAF6] border-amber-900/5 text-[#78350F] pl-4 hover:border-amber-900/20' 
                            : isChildren 
                              ? 'bg-emerald-50/50 border-emerald-950/5 text-[#15803D] font-bold text-center border-l-4 border-l-emerald-500 shadow-xs' 
                              : 'bg-amber-950/5 border-amber-950/5 text-brand-earth font-mono text-xs pl-4 hover:bg-amber-950/10'
                      }`}
                      onMouseEnter={() => {
                        if (isTrumpetCue) {
                          setCustomVisualFocus('elephant_trumpeting');
                        }
                      }}
                      onMouseLeave={() => {
                        if (isTrumpetCue && activeCueId !== cue.id) {
                          setCustomVisualFocus(null);
                        }
                      }}
                      onClick={() => {
                        setActiveCueId(cue.id);
                        if (isTrumpetCue) {
                          setCustomVisualFocus('elephant_trumpeting');
                        } else {
                          // Clear Trumpet custom focus if another cue is clicked in scene 3
                          if (scene.id === 3) {
                            setCustomVisualFocus('elephant_normal');
                          } else {
                            setCustomVisualFocus(null);
                          }
                        }
                        // Play matching sound on cue tap to let facilitators try
                        if (isDrum) {
                          if (scene.id === 4 || scene.id === 6) playBass();
                          if (scene.id === 5 || scene.id === 8) playOpen();
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {isFacilitator && (
                          <div className="text-[10px] font-bold font-mono tracking-wide bg-amber-100 text-brand-earth p-0.5 px-1.5 rounded uppercase shrink-0 mt-0.5">
                            FACILITATOR
                          </div>
                        )}
                        {isChildren && (
                          <div className="text-[10px] font-bold font-mono tracking-wide bg-brand-green text-white p-0.5 px-1.5 rounded uppercase shrink-0 mt-0.5">
                            CHILDREN RESPOND
                          </div>
                        )}
                        {isDrum && (
                          <div className="text-[10px] font-bold font-mono tracking-wide bg-amber-900 text-white p-0.5 px-1.5 rounded uppercase shrink-0 mt-0.5 animate-pulse">
                            DRUM BEAT
                          </div>
                        )}
                        <span className="flex-1 leading-relaxed">
                          {cue.text}
                          {cue.subText && (
                            <span className="block text-xs font-normal text-[#64748B] italic mt-1 font-sans">
                              {cue.subText}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Interactive Scene Visual Board */}
          <div className="bg-[#1E293B] text-white p-6 rounded-2xl border border-slate-900 flex flex-col items-center justify-center min-h-[140px] text-center space-y-3 relative overflow-hidden shadow-md">
            
            {/* Visual Focus: opened map */}
            {currentVisualFocus === 'opening' && (
              <div className="space-y-1 animate-fade-in-up">
                <span className="text-3xl">📚</span>
                <p className="text-sm font-heading font-semibold text-amber-200">The Story Begins</p>
                <p className="text-xs text-slate-300">Set deep presence. Eyes locked on the guide.</p>
              </div>
            )}

            {currentVisualFocus === 'map' && (
              <div className="space-y-1 animate-fade-in-up flex flex-col items-center">
                <MapPin className="h-8 w-8 text-brand-gold animate-bounce" />
                <p className="text-sm font-heading font-semibold text-amber-200">African Savannah Backdrop</p>
                <p className="text-[11px] text-slate-300">Warm sunshine, wild animals, and trees carved into Djembes.</p>
              </div>
            )}

            {currentVisualFocus === 'elephant_normal' && (
              <div className="space-y-1 animate-fade-in-up">
                <span className="text-4xl block animate-pulse">🐘</span>
                <p className="text-sm font-heading font-semibold text-amber-200">The Elephant Wakes</p>
                <p className="text-xs text-slate-300">Lift your trunk-arm and trumpet loud!</p>
              </div>
            )}

            {currentVisualFocus === 'elephant_trumpeting' && (
              <div className="space-y-2 animate-fade-in-up flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="text-5xl block animate-trumpet origin-bottom-left select-none">🐘</span>
                  <div className="absolute -top-3 -right-6 flex flex-col items-center animate-bounce">
                    <span className="text-xl select-none">📯</span>
                    <span className="text-[10px] font-mono font-black text-amber-400 -rotate-12 bg-amber-950/80 px-1 py-0.2 rounded border border-amber-500/30">TRUUU!</span>
                  </div>
                </div>
                <p className="text-sm font-heading font-bold text-amber-200">The Elephant Trumpets!</p>
                <p className="text-xs text-slate-300">Lifting trunk-arm and blowing a long, slow trumpet sound!</p>
              </div>
            )}

            {currentVisualFocus === 'elephant_slow' && (
              <div className="space-y-1 animate-fade-in-up flex flex-col items-center">
                <div className="flex gap-4">
                  <span className="text-3xl animate-[bounce_1.5s_infinite]">🐘</span>
                  <span className="text-lg text-amber-500 font-bold self-center">BASS... BASS...</span>
                </div>
                <p className="text-sm font-heading font-bold text-[#E2E8F0]">Walking Step-by-Step</p>
                <p className="text-xs text-slate-400">Steady slow pulse. Match the unified footsteps.</p>
              </div>
            )}

            {currentVisualFocus === 'monkeys_chattering' && (
              <div className="space-y-2 animate-fade-in-up">
                <div className="flex justify-center gap-2">
                  <span className="text-2xl animate-bounce">🐒</span>
                  <span className="text-2xl animate-bounce delay-100">🐒</span>
                  <span className="text-2xl animate-bounce delay-200">🐒</span>
                </div>
                <p className="text-sm font-heading font-semibold text-[#F1F5F9]">Monkey Chattering - Free Plays!</p>
                <p className="text-xs text-slate-400">Play fast, exciting Open Tone bursts with no wrong answers!</p>
              </div>
            )}

            {currentVisualFocus === 'elephant_running' && (
              <div className="space-y-2 animate-pulse flex flex-col items-center w-full bg-linear-to-r from-red-950 via-slate-900 to-red-950 p-3 rounded-lg border border-red-900/50">
                <span className="text-3xl">🏃‍♀️🐘⚡</span>
                <p className="text-sm font-heading font-bold text-red-400 uppercase tracking-widest">SHE RAN FAST!</p>
                <p className="text-xs text-slate-300">Accelerando! Drive the fast bass rolls together!</p>
              </div>
            )}

            {currentVisualFocus === 'pond_frogs' && (
              <div className="space-y-2 flex flex-col items-center justify-center bg-linear-to-br from-emerald-950 via-slate-900 to-[#1e293b] w-full p-3 rounded-xl border border-emerald-900/20">
                <div className="flex gap-2">
                  <span className="text-2xl animate-bounce">🐸</span>
                  <span className="text-2xl animate-pulse">💧</span>
                </div>
                <p className="text-sm font-heading font-semibold text-emerald-300">The Soothing Pond</p>
                <p className="text-xs text-slate-300">No drumming here. Savor the quiet. Ribbit sounds echo.</p>
              </div>
            )}

            {currentVisualFocus === 'nap' && (
              <div className="space-y-1 text-center bg-linear-to-b from-[#0F172A] to-slate-900 w-full p-4 rounded-xl border border-indigo-950">
                <div className="flex justify-center gap-1">
                  <Moon className="h-6 w-6 text-yellow-300 animate-spin" style={{ animationDuration: '40s' }} />
                  <span className="text-3xl">🐘💤</span>
                </div>
                <p className="text-sm font-heading font-bold text-indigo-400">A Peaceful Nap</p>
                <p className="text-xs text-slate-400">The story resolves in complete rest.</p>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Instrument Pad */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-900/10 shadow-xs text-center space-y-1">
            <h4 className="font-mono text-[9px] text-[#B45309] font-bold uppercase tracking-widest">
              Active Instrument Guide
            </h4>
            
            {highlightedInstrument ? (
              <p className="text-xs text-charcoal font-medium">
                Scene matches: <strong className="text-brand-earth uppercase">{highlightedInstrument} Note</strong>
              </p>
            ) : (
              <p className="text-xs text-charcoal/60">
                No active drum notes in this scene. Focus on gestures &amp; listening!
              </p>
            )}
          </div>

          <VirtualDrums highlightZone={highlightedInstrument} compact={false} />

          {/* Educational Indexes Specific to the scene */}
          <div className="bg-amber-100/30 border border-amber-900/10 rounded-2xl p-5 space-y-4">
            
            <div className="space-y-2">
              <h4 className="font-mono text-[10px] text-amber-900/60 uppercase tracking-wider font-bold">
                Embedded Musical Concept
              </h4>
              
              {scene.musicalElements.map((el, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-amber-900/5 space-y-1">
                  <h5 className="font-heading font-bold text-xs text-brand-earth flex items-center gap-1">
                    <Music className="h-3.5 w-3.5 text-brand-gold animate-pulse" />
                    {el.term}
                  </h5>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    {el.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-1 border-t border-amber-900/10">
              <h4 className="font-mono text-[10px] text-amber-900/60 uppercase tracking-wider font-bold">
                Social Emotional Focus
              </h4>
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-950/5 space-y-1">
                <h5 className="font-sans font-bold text-xs text-emerald-950 flex items-center gap-1">
                  <Smile className="h-3.5 w-3.5 text-brand-green" />
                  CASEL: {scene.selFocus.competency}
                </h5>
                <p className="text-[11px] text-[#475569] leading-relaxed">
                  {scene.selFocus.description}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Footer controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-amber-900/10 shadow-xs">
        <button
          onClick={prevScene}
          disabled={currentSceneIdx === 0}
          type="button"
          id="btn-story-prev"
          className="flex items-center gap-1 text-xs font-bold text-brand-earth hover:text-black uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" /> Back
        </button>

        <span className="text-xs font-mono text-[#64748B]">
          Progress: {Math.round(((currentSceneIdx + 1) / STORY_SCENES.length) * 100)}%
        </span>

        {currentSceneIdx === STORY_SCENES.length - 1 ? (
          <button
            onClick={onBackToHome}
            type="button"
            id="btn-story-finish"
            className="flex items-center gap-1.5 py-1.5 px-4 bg-brand-green text-white font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-black transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-yellow-300" /> Finish Guide
          </button>
        ) : (
          <button
            onClick={nextScene}
            type="button"
            id="btn-story-next"
            className="flex items-center gap-1 text-xs font-bold text-brand-earth hover:text-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Next <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

    </div>
  );
}
