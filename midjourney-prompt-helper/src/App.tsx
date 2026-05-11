/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { ModifierGroup } from './components/ModifierGroup';
import { GeneratedList } from './components/GeneratedList';
import { generateCombinations } from './utils/combinations';

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Background Image Prompt
const BACKGROUND_PROMPT = "Urban city street, raining, dusk, cinematic, sci-fi, moody. Wet pavement reflecting lights. Centre-left: Large polyhedral structure with video screens showing nature scenes (forest, snow, desert). Right foreground: Humanoid robot with weathered armor and glowing cyan lights, facing the structure. Pedestrians with umbrellas, blurred neon city background.";

// Define modifier categories and options
const MODIFIERS = {
  Style: [
    "cinematic",
    "dramatic lighting",
    "photorealistic",
    "sci-fi concept art",
    "moody",
    "8k"
  ],
  Action: [
    "camera zooms in",
    "fighter jets fly overhead",
    "rain is falling",
    "dramatic flyover"
  ],
  Composition: [
    "full shot",
    "wide angle",
    "low angle shot",
    "dynamic composition"
  ]
};

interface Preset {
  name: string;
  modifiers: string[];
}

export default function App() {
  const [basePrompt, setBasePrompt] = useState("A robot standing on a wet city street");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [selectedModifiers, setSelectedModifiers] = useState<Set<string>>(new Set());
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Preset State
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [showLoadPreset, setShowLoadPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem('promptHelperPresets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error("Failed to parse presets", e);
      }
    }
  }, []);

  // Load or Generate Background Image
  useEffect(() => {
    const loadBackground = async () => {
      const savedBg = localStorage.getItem('appBackground');
      if (savedBg) {
        setBackgroundImage(savedBg);
        return;
      }

      try {
        console.log("Generating background image...");
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: BACKGROUND_PROMPT }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
            }
          }
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Image = `data:image/png;base64,${part.inlineData.data}`;
            localStorage.setItem('appBackground', base64Image);
            setBackgroundImage(base64Image);
            break;
          }
        }
      } catch (error) {
        console.error("Failed to generate background:", error);
      }
    };

    loadBackground();
  }, []);

  // Apply background to body
  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    }
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, [backgroundImage]);

  // Save presets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('promptHelperPresets', JSON.stringify(presets));
  }, [presets]);

  const handleToggleModifier = (option: string) => {
    const newSelected = new Set(selectedModifiers);
    if (newSelected.has(option)) {
      newSelected.delete(option);
    } else {
      newSelected.add(option);
    }
    setSelectedModifiers(newSelected);
  };

  const handleGenerate = async () => {
    if (!basePrompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate a small delay for better UX feel
    await new Promise(resolve => setTimeout(resolve, 300));

    const modifiers = Array.from(selectedModifiers);
    const combinations = generateCombinations(modifiers);
    
    const newPrompts = [basePrompt];
    combinations.forEach(combo => {
      let prompt = `${basePrompt}, ${combo.join(', ')}`;
      if (negativePrompt.trim()) {
        prompt += ` --no ${negativePrompt.trim()}`;
      }
      newPrompts.push(prompt);
    });

    // Also handle base prompt with negative prompt if no modifiers selected
    if (combinations.length === 0 && negativePrompt.trim()) {
        newPrompts[0] = `${basePrompt} --no ${negativePrompt.trim()}`;
    } else if (combinations.length > 0 && negativePrompt.trim()) {
        // Ensure the base prompt (first item) also gets the negative prompt
        newPrompts[0] = `${basePrompt} --no ${negativePrompt.trim()}`;
    }

    setGeneratedPrompts(newPrompts);
    setIsGenerating(false);
  };

  const handleClear = () => {
    setGeneratedPrompts([]);
    setSelectedModifiers(new Set());
    setBasePrompt("");
    setNegativePrompt("");
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    const newPreset: Preset = {
      name: newPresetName.trim(),
      modifiers: Array.from(selectedModifiers)
    };
    setPresets([...presets, newPreset]);
    setNewPresetName("");
    setShowSavePreset(false);
  };

  const handleLoadPreset = (preset: Preset) => {
    setSelectedModifiers(new Set(preset.modifiers));
    setShowLoadPreset(false);
  };

  const handleDeletePreset = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPresets = [...presets];
    newPresets.splice(index, 1);
    setPresets(newPresets);
  };

  const totalPossible = useMemo(() => {
    return Math.pow(2, selectedModifiers.size);
  }, [selectedModifiers.size]);

  return (
    <div className="min-h-screen bg-black/80 text-text-primary font-mono selection:bg-accent-red selection:text-white backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
        
        {/* Masthead */}
        <header className="mb-12 border-b-[3px] border-double border-border-subtle pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-6xl font-display font-black tracking-tighter uppercase leading-none">
                <span className="text-text-primary">Midjourney</span>
                <span className="text-accent-red ml-4">Helper</span>
              </h1>
              <div className="mt-2 flex items-center gap-4 text-[10px] font-label tracking-[3px] text-text-muted uppercase">
                <span>Vol. 2024</span>
                <span>✦</span>
                <span>Prompt Engineering Edition</span>
                <span>▸▸▸▸</span>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-[10px] font-label tracking-[3px] text-accent-red uppercase mb-1">System Status</div>
              <div className="font-mono text-xs text-text-primary">ONLINE ●</div>
            </div>
          </div>
        </header>

        {/* Main Content - Split Layout */}
        <main className="flex-1 flex flex-col lg:flex-row gap-12 min-h-0">
          
          {/* Left Panel: Content Area */}
          <div className="lg:w-2/3 flex flex-col gap-12 pb-20">
            
            {/* Input Section */}
            <section>
              <div className="bg-bg-elevated text-white px-4 py-2 mb-4 flex justify-between items-center font-mono text-xs uppercase tracking-widest">
                <span>INT. BASE PROMPT — DAY</span>
                <span className="text-accent-red">SC. 01</span>
              </div>
              
              <div className="bg-bg-card p-8 relative">
                <label htmlFor="base-prompt" className="block text-[9px] font-label font-bold text-text-label uppercase tracking-[3px] mb-4">
                  Enter Core Concept
                </label>
                <textarea
                  id="base-prompt"
                  value={basePrompt}
                  onChange={(e) => setBasePrompt(e.target.value)}
                  placeholder="TYPEWRITER MODE: Describe your scene here..."
                  className="w-full h-32 bg-transparent border-b border-border-card text-bg-primary placeholder:text-text-label/50 focus:border-accent-red transition-colors resize-none font-input text-lg leading-relaxed p-0"
                />
                <div className="absolute bottom-4 right-4 text-[9px] font-label text-text-label tracking-widest">
                  {basePrompt.length} CHARS
                </div>
              </div>
            </section>

            {/* Modifiers Section */}
            <section className="relative">
              <div className="bg-bg-elevated text-white px-4 py-2 mb-4 flex justify-between items-center font-mono text-xs uppercase tracking-widest">
                <span>INT. MODIFIERS — NIGHT</span>
                <span className="text-accent-red">SC. 02</span>
              </div>

              <div className="bg-bg-card p-8">
                <div className="flex justify-between items-center mb-8 border-b border-border-card pb-4">
                  <div className="text-[9px] font-label font-bold text-text-label uppercase tracking-[3px]">
                    Configuration
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowSavePreset(!showSavePreset)}
                      className="text-[10px] font-label font-bold text-text-muted hover:text-accent-red uppercase tracking-[2px] transition-colors"
                    >
                      [ SAVE PRESET ]
                    </button>
                    <button
                      onClick={() => setShowLoadPreset(!showLoadPreset)}
                      className="text-[10px] font-label font-bold text-text-muted hover:text-accent-red uppercase tracking-[2px] transition-colors"
                    >
                      [ LOAD PRESET ]
                    </button>
                    <button 
                      onClick={() => setSelectedModifiers(new Set())}
                      className="text-[10px] font-label font-bold text-text-muted hover:text-accent-red uppercase tracking-[2px] transition-colors"
                    >
                      [ CLEAR ALL ]
                    </button>
                  </div>
                </div>

                {/* Save Preset Dialog */}
                <AnimatePresence>
                  {showSavePreset && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-8 bg-bg-primary border border-border-subtle p-4"
                    >
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-[9px] font-label text-text-label uppercase tracking-[3px] mb-2">Preset Name</label>
                          <input
                            type="text"
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                            className="w-full bg-transparent border-b border-border-subtle text-text-primary focus:border-accent-red font-input text-sm py-1"
                            autoFocus
                          />
                        </div>
                        <button
                          onClick={handleSavePreset}
                          disabled={!newPresetName.trim()}
                          className="bg-accent-red text-white px-6 py-2 text-[10px] font-label font-bold uppercase tracking-[2px] hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          CONFIRM
                        </button>
                        <button
                          onClick={() => setShowSavePreset(false)}
                          className="text-text-muted hover:text-white px-2 py-2"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Load Preset Dialog */}
                <AnimatePresence>
                  {showLoadPreset && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-8 bg-bg-primary border border-border-subtle p-4 max-h-60 overflow-y-auto custom-scrollbar"
                    >
                       <div className="flex justify-between items-center mb-4 border-b border-border-subtle pb-2">
                        <h3 className="text-[10px] font-label text-text-label uppercase tracking-[3px]">Select File</h3>
                        <button onClick={() => setShowLoadPreset(false)} className="text-text-muted hover:text-white">✕</button>
                      </div>
                      {presets.length === 0 ? (
                        <p className="text-xs font-mono text-text-muted">NO RECORDS FOUND</p>
                      ) : (
                        <div className="space-y-1">
                          {presets.map((preset, idx) => (
                            <div key={idx} className="flex items-center justify-between group p-2 hover:bg-bg-elevated cursor-pointer transition-colors" onClick={() => handleLoadPreset(preset)}>
                              <div className="flex items-baseline gap-4">
                                <span className="text-accent-red font-mono text-xs">FILE_{String(idx + 1).padStart(3, '0')}</span>
                                <span className="text-sm font-input text-text-primary">{preset.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-[9px] font-label text-text-muted uppercase tracking-widest">{preset.modifiers.length} MODS</span>
                                <button
                                  onClick={(e) => handleDeletePreset(idx, e)}
                                  className="text-text-muted hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  DEL
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="space-y-2">
                  {Object.entries(MODIFIERS).map(([category, options]) => (
                    <ModifierGroup
                      key={category}
                      title={category}
                      options={options}
                      selected={selectedModifiers}
                      onToggle={handleToggleModifier}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Negative Prompt Section */}
            <section>
              <div className="bg-bg-elevated text-white px-4 py-2 mb-4 flex justify-between items-center font-mono text-xs uppercase tracking-widest">
                <span>INT. NEGATIVE PROMPT — DUSK</span>
                <span className="text-accent-red">SC. 03</span>
              </div>
              <div className="bg-bg-card p-8">
                <label htmlFor="negative-prompt" className="block text-[9px] font-label font-bold text-text-label uppercase tracking-[3px] mb-4">
                  Exclusion Criteria
                </label>
                <input
                  id="negative-prompt"
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g., blurry, low quality, watermark, text"
                  className="w-full bg-transparent border-b border-border-card text-bg-primary placeholder:text-text-label/50 focus:border-accent-red transition-colors font-input text-lg py-2"
                />
                <p className="text-[9px] font-label text-text-muted mt-4 uppercase tracking-widest">
                  Appended as --no parameters
                </p>
              </div>
            </section>
          </div>

          {/* Right Panel: Verdict / Summary */}
          <div className="lg:w-1/3 lg:sticky lg:top-8 h-fit">
            <div className="bg-bg-elevated border border-border-subtle">
              {/* Verdict Header */}
              <div className="bg-accent-red text-white px-4 py-3 flex justify-between items-center">
                <span className="font-label font-bold text-sm uppercase tracking-[3px]">THE VERDICT</span>
                <span className="font-mono text-xs">FINAL CUT</span>
              </div>

              {/* Score Display */}
              <div className="p-8 border-b border-border-subtle">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-label text-[10px] text-text-label uppercase tracking-[3px]">Total Variations</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="font-display font-black text-6xl text-white leading-none">
                    {totalPossible.toLocaleString()}
                  </span>
                  <span className="font-display font-black text-4xl text-accent-red">
                    {totalPossible > 100 ? 'A+' : totalPossible > 50 ? 'B' : 'C'}
                  </span>
                </div>
                
                {/* Progress Bar Style Visual */}
                <div className="mt-6 h-2 bg-border-subtle w-full relative">
                  <div 
                    className="absolute top-0 left-0 h-full bg-accent-red transition-all duration-500"
                    style={{ width: `${Math.min((totalPossible / 100) * 100, 100)}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-accent-red rounded-full"
                    style={{ left: `${Math.min((totalPossible / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="p-8 border-b border-border-subtle space-y-4">
                <button
                  onClick={handleGenerate}
                  disabled={!basePrompt.trim() || isGenerating}
                  className={`
                    w-full py-4 px-6 font-label font-bold text-sm uppercase tracking-[3px] transition-all
                    ${!basePrompt.trim() || isGenerating 
                      ? 'bg-border-subtle text-text-muted cursor-not-allowed' 
                      : 'bg-accent-red text-white hover:bg-white hover:text-accent-red'
                    }
                  `}
                >
                  {isGenerating ? 'PROCESSING...' : 'GENERATE VARIATIONS'}
                </button>

                <button
                  onClick={handleClear}
                  className="w-full py-3 px-6 border border-border-subtle text-text-muted font-label font-bold text-xs uppercase tracking-[3px] hover:border-accent-red hover:text-accent-red transition-colors"
                >
                  RESET SCENE
                </button>
              </div>

              {/* Output List Container */}
              <div className="h-[400px] flex flex-col">
                <div className="px-4 py-2 bg-black/20 border-b border-border-subtle flex justify-between items-center">
                  <span className="font-mono text-[10px] text-text-muted uppercase">Output Log</span>
                  {generatedPrompts.length > 0 && (
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedPrompts.join('\n'))}
                      className="text-[9px] font-label text-accent-red hover:text-white uppercase tracking-widest"
                    >
                      COPY ALL
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-hidden bg-bg-elevated p-2">
                  <GeneratedList prompts={generatedPrompts} />
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

