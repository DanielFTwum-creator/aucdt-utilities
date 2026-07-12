import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Sparkles, 
  Database, 
  Briefcase, 
  Bookmark, 
  ArrowRight, 
  Check, 
  Info,
  ChevronRight,
  School,
  Sparkle,
  Search,
  X,
  Shield
} from 'lucide-react';

import Header from './components/Header';
import PromptFrameworkCard from './components/PromptFrameworkCard';
import ExercisePlayground from './components/ExercisePlayground';
import CommitmentTracker from './components/CommitmentTracker';
import SavedArtefactsManager from './components/SavedArtefactsManager';
import OnboardingTour from './components/OnboardingTour';
import ShareToColleague from './components/ShareToColleague';
import ExportTemplatePDF from './components/ExportTemplatePDF';
import AdminPanel from './components/AdminPanel';


import { SavedArtefact } from './types';
import { TEMPLATES_LIBRARY, WORKBOOK_METRICS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('block1');
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>(() => {
    return (localStorage.getItem('tuc_theme_preference') as 'light' | 'dark' | 'high-contrast') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('tuc_theme_preference', theme);
  }, [theme]);

  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => {
    const completed = localStorage.getItem('tuc_onboarding_tour_completed');
    return !completed;
  });
  const [savedArtefacts, setSavedArtefacts] = useState<SavedArtefact[]>(() => {
    const saved = localStorage.getItem('tuc_briefcase');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return [];
  });

  const [activeTemplateId, setActiveTemplateId] = useState<string>(TEMPLATES_LIBRARY[0].id);
  const [templateSearchQuery, setTemplateSearchQuery] = useState<string>('');

  const filteredTemplates = TEMPLATES_LIBRARY.filter((t) => {
    const query = templateSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.templateText.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    );
  });

  // Sync saved artefacts to localStorage
  const handleSaveArtefact = (artefact: SavedArtefact) => {
    setSavedArtefacts((prev) => {
      // Check if already exists to prevent duplication
      if (prev.some((art) => art.id === artefact.id)) return prev;
      const updated = [artefact, ...prev];
      localStorage.setItem('tuc_briefcase', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteArtefact = (id: string) => {
    setSavedArtefacts((prev) => {
      const updated = prev.filter((art) => art.id !== id);
      localStorage.setItem('tuc_briefcase', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateArtefact = (updatedArt: SavedArtefact) => {
    setSavedArtefacts((prev) => {
      const updated = prev.map((art) => art.id === updatedArt.id ? updatedArt : art);
      localStorage.setItem('tuc_briefcase', JSON.stringify(updated));
      return updated;
    });
  };

  const activeTemplate = 
    filteredTemplates.find((t) => t.id === activeTemplateId) || 
    filteredTemplates[0] || 
    TEMPLATES_LIBRARY[0];

  const themeClass = theme === 'dark' ? 'theme-dark' : theme === 'high-contrast' ? 'theme-high-contrast' : '';

  return (
    <div className={`min-h-screen bg-editorial-bg text-editorial-text-dark font-sans selection:bg-editorial-accent/15 selection:text-editorial-accent pb-16 transition-colors duration-200 ${themeClass}`}>
      {/* Upper Navigation Accent */}
      <div className="bg-editorial-accent text-editorial-secondary text-xs py-2 px-4 text-center font-mono border-b border-editorial-border flex items-center justify-center gap-1.5">
        <School size={12} className="text-editorial-gold" />
        <span>University College AI Ambassadors Digital Training Environment</span>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 pt-6 space-y-6">
        {/* Onboarding Tour Overlay */}
        <OnboardingTour
          isOpen={isTourOpen}
          onClose={() => setIsTourOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic header */}
        <Header onStartTour={() => setIsTourOpen(true)} />

        {/* Modular Navigation Tabs */}
        <nav id="onboarding-nav-tabs" className="flex flex-wrap gap-2 p-1.5 bg-editorial-secondary border border-editorial-border rounded-xl">
          <button
            onClick={() => setActiveTab('block1')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'block1'
                ? 'bg-editorial-accent text-white shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <BookOpen size={15} className={activeTab === 'block1' ? 'text-white' : 'text-editorial-text-light'} />
            <span>Block 1: Prompting</span>
          </button>

          <button
            onClick={() => setActiveTab('block2')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'block2'
                ? 'bg-editorial-accent text-white shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <Clock size={15} className={activeTab === 'block2' ? 'text-white' : 'text-editorial-text-light'} />
            <span>Block 2: Productivity</span>
          </button>

          <button
            onClick={() => setActiveTab('block3')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'block3'
                ? 'bg-editorial-accent text-white shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <Sparkles size={15} className={activeTab === 'block3' ? 'text-white' : 'text-editorial-text-light'} />
            <span>Block 3: Content</span>
          </button>

          <button
            onClick={() => setActiveTab('block4')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'block4'
                ? 'bg-editorial-accent text-white shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <Database size={15} className={activeTab === 'block4' ? 'text-white' : 'text-editorial-text-light'} />
            <span>Block 4: Agentic AI</span>
          </button>

          <button
            id="onboarding-tab-templates"
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-editorial-accent text-white shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <Bookmark size={15} className={activeTab === 'templates' ? 'text-white' : 'text-editorial-text-light'} />
            <span>Prompt Library</span>
          </button>

          <button
            onClick={() => setActiveTab('commitments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'commitments'
                ? 'bg-editorial-accent text-white shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <Sparkle size={14} className={activeTab === 'commitments' ? 'text-white animate-spin-slow' : 'text-editorial-text-light'} />
            <span>30-Day Commitment</span>
          </button>

          <button
            id="onboarding-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-editorial-accent text-white shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <Shield size={14} className={activeTab === 'admin' ? 'text-white' : 'text-editorial-text-light'} />
            <span>Admin Gateway</span>
          </button>


          <button
            id="onboarding-tab-briefcase"
            onClick={() => setActiveTab('briefcase')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold font-serif uppercase tracking-wider transition-all cursor-pointer relative ml-auto ${
              activeTab === 'briefcase'
                ? 'bg-editorial-gold text-editorial-accent shadow-sm'
                : 'text-editorial-text-medium hover:text-editorial-accent hover:bg-white/40'
            }`}
          >
            <Briefcase size={15} className={activeTab === 'briefcase' ? 'text-editorial-accent' : 'text-editorial-text-light'} />
            <span>My Briefcase</span>
            {savedArtefacts.length > 0 && activeTab !== 'briefcase' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-editorial-gold border border-white rounded-full animate-bounce"></span>
            )}
          </button>
        </nav>

        {/* Content Area */}
        <main className="space-y-6">
          {/* TAB 1: BLOCK 1 - PROMPTING FUNDAMENTALS */}
          {activeTab === 'block1' && (
            <div className="space-y-6">
              <PromptFrameworkCard />
              
              <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-editorial-accent">
                    Exercise 1.1 — Fix the Prompt
                  </h3>
                  <p className="text-xs text-editorial-text-medium font-sans">
                    A weak prompt like <em>"Make a quiz for my class"</em> leads to subpar results. Apply the 5-Part Framework to craft a master syllabus quiz below.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-editorial-secondary border border-editorial-border text-xs text-editorial-text-dark font-sans leading-relaxed">
                  <strong>The Task:</strong> Rewrite the weak prompt using all five framework elements, run your version in Gemini, then refine it in the follow-up chat box.
                </div>

                <ExercisePlayground
                  id="exercise-1-1"
                  title="Formative Quiz Constructor Workspace"
                  subtitle="Rewrite the weak prompt 'Make a quiz for my class' into a master framework-aligned prompt."
                  description="Pre-populated with the recommended 5-Part structure. Customize the parameters and hit Run."
                  category="quiz"
                  defaultPrompt="Create a [N]-question quiz on [TOPIC] for [LEVEL] students. Mix of multiple choice and short answer. Include an answer key. Difficulty: [DIFFICULTY]. Format in British English."
                  placeholders={[
                    { label: "N (Number of Questions)", fieldName: "N", defaultVal: "10" },
                    { label: "TOPIC", fieldName: "TOPIC", defaultVal: "Sustainable Fashion Design Portfolio Planning" },
                    { label: "LEVEL", fieldName: "LEVEL", defaultVal: "HND Fashion Design Year 2" },
                    { label: "DIFFICULTY", fieldName: "DIFFICULTY", defaultVal: "CHALLENGING" }
                  ]}
                  onSaveArtefact={handleSaveArtefact}
                  teachingPoint="Iterating and chatting beats restarting! You are having a rich conversation, not just filling in a static form."
                  followUpSuggestions={[
                    "Make question 3 harder.",
                    "Add one question that tests application, not recall.",
                    "Convert this to a table with an answer key column."
                  ]}
                />
              </div>
            </div>
          )}

          {/* TAB 2: BLOCK 2 - EVERYDAY PRODUCTIVITY */}
          {activeTab === 'block2' && (
            <div className="space-y-6">
              {/* Theory and Metrics Dashboard */}
              <div className="bg-white border border-editorial-border rounded-xl p-6 sm:p-8 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent flex items-center gap-2">
                    Block 2 <span className="text-editorial-text-muted font-sans font-normal">•</span> AI for Everyday Productivity
                  </h2>
                  <p className="text-sm text-editorial-text-medium font-sans">How AI reclaims precious hours from routine administrative workloads.</p>
                </div>

                <p className="text-sm text-editorial-text-light leading-relaxed max-w-3xl font-sans">
                  As university college lecturers, academic administration can exhaust hours of teaching prep. Using prompting frameworks, tasks that used to take hours are executed with high academic rigor in mere minutes.
                </p>

                {/* Visual Pure Tailwind Chart & Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-editorial-text-medium uppercase tracking-wider font-mono">Time-Saved Metrics Overview</h3>
                    <div className="space-y-3 font-sans">
                      {WORKBOOK_METRICS.map((metric, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-editorial-text-dark">
                            <span>{metric.task}</span>
                            <span className="text-editorial-gold font-mono">{metric.ratio} Saved</span>
                          </div>
                          <div className="relative h-6 bg-editorial-secondary rounded-lg overflow-hidden border border-editorial-border/60 flex items-center px-2 text-[10px] font-semibold">
                            {/* Before AI bar */}
                            <div className="absolute inset-y-0 left-0 bg-editorial-border/45 w-full transition-all"></div>
                            {/* With AI bar overlay */}
                            <div className="absolute inset-y-0 left-0 bg-editorial-accent/10 border-r-2 border-editorial-accent w-12 transition-all"></div>
                            <span className="relative z-10 text-editorial-text-dark font-mono flex justify-between w-full">
                              <span>Before: {metric.before}</span>
                              <span className="text-editorial-accent font-bold">With AI: {metric.withAI}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-editorial-secondary border border-editorial-border space-y-3.5">
                    <h4 className="text-xs font-bold text-editorial-accent uppercase tracking-wider font-mono flex items-center gap-1">
                      <Clock size={13} className="text-editorial-gold" />
                      The 20-Minute Syllabus Method
                    </h4>
                    <p className="text-xs text-editorial-text-medium leading-relaxed font-sans">
                      Syllabus creation is highly regulated but structured. By specifying weekly topics, learning objectives, and localized activities, the AI helps lecturers brainstorm extremely relevant lecture plans. 
                    </p>
                    <div className="text-[11px] text-editorial-text-light bg-white border border-editorial-border rounded-lg p-3 space-y-1 leading-normal font-sans">
                      <span className="font-bold text-editorial-accent block font-serif uppercase tracking-wider text-[10px]"> Ghanaian Context Integration:</span>
                      Ensure to request "British English" spelling convention, and explicitly ask to localise to Ghanaian universities, public institutions, or industry companies.
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise 2.1 Workspace */}
              <div className="bg-white border border-editorial-border rounded-xl p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-editorial-accent">
                    Exercise 2.1 — Course Outline Constructor (15 Mins)
                  </h3>
                  <p className="text-xs text-editorial-text-medium font-sans">
                    Generate a rigorous multi-week course outline/scheme of work. Localize the syllabus to use a Ghanaian context.
                  </p>
                </div>

                <ExercisePlayground
                  id="exercise-2-1"
                  title="Multi-Week Syllabus Generator"
                  subtitle="Create a bespoke scheme of work"
                  description="Configure syllabus options below. Hit run to generate a full markdown syllabus containing week-by-week activities."
                  category="outline"
                  defaultPrompt="Create a [N]-week course outline for [COURSE], a [LEVEL] course at a Ghanaian university college. Students are [PROFILE]. Each week needs: topic, one learning objective, one in-class activity, one assignment idea. Weeks [ASSESSMENT_WEEKS] are assessment weeks. Format as a table. British English."
                  placeholders={[
                    { label: "COURSE NAME", fieldName: "COURSE", defaultVal: "Fashion Design Entrepreneurship" },
                    { label: "WEEKS", fieldName: "N", defaultVal: "12" },
                    { label: "LEVEL & COHORT", fieldName: "LEVEL", defaultVal: "Second Year HND" },
                    { label: "STUDENT PROFILE", fieldName: "PROFILE", defaultVal: "fashion students with raw design talent but limited marketing or business background" },
                    { label: "ASSESSMENT WEEKS", fieldName: "ASSESSMENT_WEEKS", defaultVal: "6 and 12" }
                  ]}
                  onSaveArtefact={handleSaveArtefact}
                  followUpSuggestions={[
                    "Localise one week's activity to use a Ghanaian case study or local industry example.",
                    "Ask the AI to flag which week is likely to be hardest for students and suggest extra support.",
                    "Rewrite week 6 to be an oral elevator pitch presentation."
                  ]}
                />
              </div>

              {/* Exercise 2.2 Workspace */}
              <div className="bg-white border border-editorial-border rounded-xl p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-editorial-accent">
                    Exercise 2.2 — Moderation-Ready Rubric (10 Mins)
                  </h3>
                  <p className="text-xs text-editorial-text-medium font-sans">
                    Take any assignment outline and get a 4-level marking evaluation table totalling 100 marks.
                  </p>
                </div>

                <ExercisePlayground
                  id="exercise-2-2"
                  title="Marking Rubric Workspace"
                  subtitle="Develop assessment criteria"
                  description="Paste assignment parameters below to generate a transparent grading matrix."
                  category="rubric"
                  defaultPrompt="Create a marking rubric for this assignment: [ASSIGNMENT]. Four criteria, four performance levels each (Excellent / Good / Developing / Poor), with a mark range per level totalling 100. Format as a table."
                  placeholders={[
                    { label: "PASTE ASSIGNMENT", fieldName: "ASSIGNMENT", defaultVal: "Create a detailed business plan for a boutique fashion studio launching in Accra, detailing capital constraints, target market segments, and pricing strategies." }
                  ]}
                  onSaveArtefact={handleSaveArtefact}
                  followUpSuggestions={[
                    "Add a criteria for presentation and professionalism.",
                    "Adapt weights to place more focus on financial viability.",
                    "Simplify text to be friendly and clear for students."
                  ]}
                />
              </div>
            </div>
          )}

          {/* TAB 3: BLOCK 3 - CONTENT CREATION */}
          {activeTab === 'block3' && (
            <div className="space-y-6 bg-white border border-editorial-border rounded-xl p-6 sm:p-8">
              <div className="space-y-1 pb-4 border-b border-editorial-border">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent flex items-center gap-2">
                  Block 3 <span className="text-editorial-text-muted font-sans font-normal">•</span> Content Creation
                </h2>
                <p className="text-sm text-editorial-text-medium font-sans">The powerful double workflow: AI writes the content, Canva makes it presentable.</p>
              </div>

              {/* Canva description cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-editorial-text-medium uppercase tracking-wider font-mono font-sans">Two-Step Creation Workflow</h3>
                  <div className="relative pl-5 border-l-2 border-editorial-gold space-y-4 font-sans">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-editorial-accent">Step A: Generate Slide Content in AI</span>
                      <p className="text-xs text-editorial-text-medium leading-normal">
                        Ask Gemini to write highly structured slides: strict bullet limitations, speaker talking points, and interactive discussion endings.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-editorial-accent">Step B: Import into Canva Presentations</span>
                      <p className="text-xs text-editorial-text-medium leading-normal">
                        Open Canva, search "presentation" templates, and paste slide contents. Use Canva's AI Image Generator (Magic Media) to create branded graphics!
                      </p>
                    </div>
                  </div>

                  {/* Canva Graphic Prompt Box */}
                  <div className="p-4 rounded-lg bg-editorial-secondary border border-editorial-border space-y-1.5 text-xs text-editorial-text-dark font-sans">
                    <span className="font-bold text-editorial-accent block font-serif uppercase tracking-wider text-[10px]">🎨 Canva Image Prompting Tip:</span>
                    <p className="text-[11px] leading-relaxed text-editorial-text-medium">
                      To get professional photographic university materials, use this exact syntax template:
                    </p>
                    <code className="block bg-[#111111] text-[#EFEFEF] text-[10px] p-2.5 rounded font-mono mt-1 leading-normal">
                      "students collaborating around a laptop, modern African university campus, warm natural light, photographic style"
                    </code>
                  </div>
                </div>

                {/* Workspace preview box */}
                <div className="space-y-3 font-sans">
                  <h4 className="text-xs font-bold text-editorial-text-medium uppercase tracking-wider font-mono">Exercise 3.1 Workshop Workspace</h4>
                  <ExercisePlayground
                    id="exercise-3-1"
                    title="6-Slide Lecture Constructor"
                    subtitle="Draft slides and speaker notes"
                    description="Enter your slide topic below to get formatted content."
                    category="slides"
                    defaultPrompt="Create content for a 6-slide lecture introducing [TOPIC]. For each slide: a title, three bullet points maximum, and one speaker note. Slide 6 is a discussion question. Keep bullets under 10 words each."
                    placeholders={[
                      { label: "LECTURE TOPIC", fieldName: "TOPIC", defaultVal: "Sustainable Adinkra Symbolism in Ghanaian Fashion" }
                    ]}
                    onSaveArtefact={handleSaveArtefact}
                    followUpSuggestions={[
                      "Make slide 4 focus on local fabrics of Accra.",
                      "Add a 60-second social media script introducing this topic.",
                      "Make bullet points even shorter."
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BLOCK 4 - AGENTIC WORKFLOWS */}
          {activeTab === 'block4' && (
            <div className="space-y-6">
              <div className="bg-white border border-editorial-border rounded-xl p-6 sm:p-8 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent flex items-center gap-2">
                    Block 4 <span className="text-editorial-text-muted font-sans font-normal">•</span> Agentic Workflows
                  </h2>
                  <p className="text-sm text-editorial-text-medium font-sans">Going beyond standard single Q&A chatting into multi-step sequential execution.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-editorial-text-medium uppercase tracking-wider font-mono">What makes Agentic AI unique?</h3>
                    <p className="text-sm text-editorial-text-light leading-relaxed font-sans">
                      Standard AI interaction relies on isolated questions and single answers. <strong>Agentic workflows</strong> are goal-oriented: they allow you to structure multi-step commands where the AI plans, checks results, suggests solutions, and prioritizes strategic outcomes in a single request.
                    </p>

                    <div className="p-4 rounded-lg bg-editorial-secondary border border-editorial-border text-xs text-editorial-text-dark leading-relaxed font-sans space-y-1.5">
                      <strong className="text-editorial-accent block font-serif uppercase tracking-wider text-[10px]">🔑 The Secret of Sequential Instructions:</strong>
                      <span>Always use numbered sequences in your prompts (e.g., <em>"First, analyze... Second, suggest... Third, rank..."</em>) to get a comprehensive, action-ready strategic dashboard.</span>
                    </div>
                  </div>

                  {/* Micro Exercise 4.1 workspace */}
                  <div className="space-y-3.5 font-sans">
                    <h4 className="text-xs font-bold text-editorial-text-medium uppercase tracking-wider font-mono">Micro-Exercise 4.1 Workspace</h4>
                    <ExercisePlayground
                      id="exercise-4-1"
                      title="Sequential Strategic Analysis Workspace"
                      subtitle="Identify common failure vectors and map out interventions"
                      description="Runs 3 steps sequentially: Common failures -> resource-neutral interventions -> impact rankings."
                      category="analysis"
                      defaultPrompt="First, list the five most common reasons students fail [COURSE]. Second, for each reason, suggest one intervention I can run within existing resources. Third, rank the interventions by effort vs impact and recommend where I should start."
                      placeholders={[
                        { label: "COURSE NAME", fieldName: "COURSE", defaultVal: "Fashion Portfolio & Presentation Skills" }
                      ]}
                      onSaveArtefact={handleSaveArtefact}
                      followUpSuggestions={[
                        "Recommend which intervention Dr. Abigail Ankomah (HOD) should oversee.",
                        "Adapt interventions for low internet connectivity contexts.",
                        "Add a timeline schedule for implementing step 1."
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TAKE-AWAY TEMPLATES LIBRARY */}
          {activeTab === 'templates' && (
            <div id="takeaway-templates" className="bg-white border border-editorial-border rounded-xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pb-4 border-b border-editorial-border">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-editorial-accent flex items-center gap-2">
                  Take-Away Prompt Templates Library
                </h2>
                <p className="text-sm text-editorial-text-medium font-sans">
                  Your customized library of masterclass prompts. Select, adjust, copy, or execute them directly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Templates selectors sidebar */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-editorial-text-medium uppercase tracking-wider font-mono">Select a Template</h3>
                    
                    {/* Search Filter Box */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search templates by name or keyword..."
                        value={templateSearchQuery}
                        onChange={(e) => setTemplateSearchQuery(e.target.value)}
                        className="w-full text-xs font-sans pl-8 pr-8 py-2.5 rounded-xl border border-editorial-border bg-editorial-secondary/30 text-editorial-text-dark placeholder:text-editorial-text-light outline-none focus:border-editorial-accent focus:ring-1 focus:ring-editorial-accent/15 transition-all"
                      />
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-text-light" />
                      {templateSearchQuery && (
                        <button
                          onClick={() => setTemplateSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-editorial-text-light hover:text-editorial-accent cursor-pointer flex items-center justify-center p-0.5 rounded-full hover:bg-editorial-secondary"
                          title="Clear search"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {filteredTemplates.length > 0 ? (
                      filteredTemplates.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTemplateId(t.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block ${
                            activeTemplate.id === t.id
                              ? 'bg-editorial-secondary border-editorial-border text-editorial-accent font-bold'
                              : 'bg-white border-editorial-border hover:border-editorial-text-muted hover:bg-editorial-secondary/35 text-editorial-text-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold font-serif uppercase tracking-wider">{t.title}</h4>
                            <span className="text-[9px] font-mono font-bold bg-editorial-accent/5 px-1.5 py-0.5 rounded border border-editorial-border/40 text-editorial-accent uppercase tracking-wider">
                              {t.category}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-editorial-text-light truncate mt-1 font-sans">{t.description}</p>
                        </button>
                      ))
                    ) : (
                      <div className="text-center p-6 border border-dashed border-editorial-border rounded-xl bg-editorial-secondary/10 space-y-1">
                        <p className="text-xs font-bold text-editorial-text-medium">No templates found</p>
                        <p className="text-[10px] text-editorial-text-light">Try searching for keywords like "rubric", "quiz", or "outline".</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected template active workspace */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-5 rounded-xl bg-editorial-secondary border border-editorial-border space-y-2 font-sans">
                    <h3 className="text-sm font-bold text-editorial-accent font-serif uppercase tracking-wider">{activeTemplate.title} Template</h3>
                    <p className="text-xs text-editorial-text-medium leading-normal">{activeTemplate.description}</p>
                  </div>

                  <ShareToColleague template={activeTemplate} />
                  <ExportTemplatePDF template={activeTemplate} />

                  <ExercisePlayground
                    key={activeTemplate.id}
                    id={`library-${activeTemplate.id}`}
                    title={`${activeTemplate.title} Active Workspace`}
                    subtitle={`Configure and test the ${activeTemplate.title} prompt.`}
                    description="Customize the placeholders below. You can run it against Gemini in real-time or simply copy the fully assembled prompt text."
                    category={activeTemplate.category}
                    defaultPrompt={activeTemplate.templateText}
                    placeholders={activeTemplate.fields.map((f) => ({
                      label: f.name.replace(/_/g, ' '),
                      fieldName: f.name,
                      defaultVal: f.default,
                      placeholder: f.placeholder,
                    }))}
                    onSaveArtefact={handleSaveArtefact}
                    followUpSuggestions={[
                      "Make formatting strictly compliant with Ghanaian university moderation boards.",
                      "Adjust tone to be highly supportive and constructive.",
                      "Shorten overall wordcount boundaries."
                    ]}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ONBOARDING COMMITMENTS */}
          {activeTab === 'commitments' && (
            <div className="space-y-6">
              <CommitmentTracker />
            </div>
          )}

          {/* TAB 6.5: ADMIN & DIAGNOSTICS GATEWAY */}
          {activeTab === 'admin' && (
            <div className="space-y-6 animate-fadeIn">
              <AdminPanel theme={theme} setTheme={setTheme} />
            </div>
          )}

          {/* TAB 7: LECTURER BRIEFCASE */}
          {activeTab === 'briefcase' && (
            <div className="space-y-6">
              <SavedArtefactsManager 
                artefacts={savedArtefacts}
                onDeleteArtefact={handleDeleteArtefact}
                onUpdateArtefact={handleUpdateArtefact}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
