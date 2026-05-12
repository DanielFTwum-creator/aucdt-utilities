import { useState, useMemo, useEffect } from "react";
import { Search, LayoutGrid, List as ListIcon, ExternalLink, Cpu, Sparkles, Code, Briefcase, Settings, Gamepad2, ChevronRight, Check, X, Shield, Zap, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const BASE_URL = "https://ai-tools.techbridge.edu.gh";

const CATEGORIES = {
  "AI & ML": { badge: "badge-ai-ml", icon: Cpu, color: "#2563eb" },
  "Academic": { badge: "badge-academic", icon: Sparkles, color: "#7c3aed" },
  "Creative": { badge: "badge-creative", icon: Sparkles, color: "#db2777" },
  "Dev Tools": { badge: "badge-dev-tools", icon: Code, color: "#16a34a" },
  "Business": { badge: "badge-business", icon: Briefcase, color: "#d97706" },
  "Admin": { badge: "badge-admin", icon: Settings, color: "#475569" },
  "Games": { badge: "badge-games", icon: Gamepad2, color: "#0891b2" },
};

interface Tool {
  slug: string;
  title: string;
  desc: string;
  cat: string;
  tags?: string[];
  features?: string[];
  extendedDesc?: string;
}

const TOOLS: Tool[] = [
  // AI & ML
  { 
    slug: "ai-dentist", 
    title: "AI in Dental Diagnostics", 
    desc: "AI-powered oral health diagnostics for clinicians", 
    cat: "AI & ML",
    extendedDesc: "A clinical-grade diagnostic engine that processes panoramic and bitewing X-rays to identify early-stage caries, periodontal bone loss, and periapical lesions with over 94% precision.",
    features: ["Real-time Radiograph Analysis", "Automated Clinical Documentation", "Historical Progression Tracking", "HIPAA-Compliant Processing"],
    tags: ["Healthcare", "Computer Vision", "Diagnostics"]
  },
  {
    slug: "biochemai",
    title: "BioChemAI Teaching Aid",
    desc: "Domain-specific research support for biochemistry students", 
    cat: "AI & ML",
    extendedDesc: "A specialized LLM agent trained on biochemical journals and textbook data. It assists students in molecular structure visualization, metabolic pathway analysis, and predictive reaction modeling.",
    features: ["Metabolic Pathway Mapping", "Molecular Docking Simulations", "Automated Literature Summarization", "Interactive Reaction Prediction"],
    tags: ["Education", "Research", "Chemistry"]
  },
  { slug: "patois", title: "Patois Lyricist", desc: "Reggae & dancehall lyric generator in Jamaican Patois", cat: "AI & ML", features: ["Phonetic Rhyme Matching", "Rhythm-Based Phrasing", "Thematic Genre Presets"], extendedDesc: "An innovative NLP model specifically tuned for the nuances of Jamaican Patois, providing industry-standard lyrics for Reggae and Dancehall producers." },
  { slug: "nobleai", title: "Ghana Home Design AI", desc: "AI assistant for home design and interior concepts", cat: "AI & ML" },
  { slug: "markai", title: "MarkAI", desc: "Marketing strategy and content for non-marketers", cat: "AI & ML" },
  { slug: "lifeplan", title: "Life Planner AI", desc: "Intelligent AI-powered life and goal planning", cat: "AI & ML" },
  { slug: "clipai", title: "ClipAI", desc: "AI-powered video clip management and analysis", cat: "AI & ML" },
  { slug: "creoai", title: "CreoAI", desc: "Creative AI generation assistant", cat: "AI & ML" },
  { slug: "entrainer", title: "enTrainer", desc: "Engage your metabolic health through music", cat: "AI & ML" },
  { slug: "sino", title: "Sino-Twi Translator", desc: "Real-time translation between Sina and Twi languages", cat: "AI & ML" },
  { slug: "quick-guide", title: "Object Identifier", desc: "Accessibility-focused AI object identification app", cat: "AI & ML" },
  { slug: "masterclass", title: "AI Agent Masterclass", desc: "The 15-minute AI agent productivity masterclass", cat: "AI & ML" },
  { slug: "agent", title: "Agent-Led Dev", desc: "Agent-led software development methodology", cat: "AI & ML" },
  { slug: "animator", title: "Animator Agent", desc: "AI-powered animation and motion assistant", cat: "AI & ML" },
  { slug: "dmcd", title: "dmcdAI", desc: "TUC intelligent assistant platform", cat: "AI & ML" },
  { slug: "cards", title: "Birthday Card Generator", desc: "AI-generated personalised birthday cards", cat: "AI & ML" },
  { slug: "flyer", title: "AI Flyer Generator", desc: "Instant AI-generated marketing flyers", cat: "AI & ML" },
  { slug: "draft-email", title: "AI Email Drafter", desc: "Smart context-aware email drafting", cat: "AI & ML" },
  { slug: "code-reviewer", title: "AI Code Reviewer", desc: "Automated code review, analysis and feedback", cat: "AI & ML" },
  { slug: "standup", title: "AI Stand-up Prep", desc: "Workshop and stand-up meeting preparation tool", cat: "AI & ML" },
  { slug: "dictation", title: "Dictation App", desc: "AI-powered dictation and transcription", cat: "AI & ML" },
  { slug: "blueprint", title: "Techbridge AI Blueprint", desc: "TUC ICT platform for AI project planning, mission tracking and deployment workflows", cat: "Dev Tools", features: ["Mission Phase Tracking", "Cloud Snapshot Sync", "Audit Logging", "Admin Console"], extendedDesc: "The official TUC ICT platform for planning and tracking AI project deployments using a structured multi-phase workflow." },
  { slug: "script-generator", title: "Dialogue Generator", desc: "Script and natural dialogue generation", cat: "AI & ML" },
  // Academic
  { slug: "vet", title: "Verb Explorer Toolkit", desc: "Class 4 digital verb discovery — Choose, Research, Present", cat: "Academic" },
  { slug: "lap", title: "Lecturer Assessment Portal", desc: "Staff performance evaluation and review system", cat: "Academic" },
  { slug: "smartscale", title: "SmartScale Presenter", desc: "Intelligent presentation scaling platform", cat: "Academic" },
  { slug: "visquiz", title: "Visual Quiz Master", desc: "Interactive visual quiz and assessment engine", cat: "Academic" },
  { slug: "msee", title: "MSEE Aptitude Test", desc: "Mathematics aptitude test for engineering entry", cat: "Academic" },
  { slug: "waec", title: "Mature Students Exam App", desc: "Tailored examination platform for mature learners", cat: "Academic" },
  { slug: "assessment", title: "Lecturer Assessment Form", desc: "Structured digital lecturer evaluation forms", cat: "Academic" },
  { slug: "math", title: "Examination Portal", desc: "AUCDT secure digital examination system", cat: "Academic" },
  { slug: "timetable", title: "Timetable Insights", desc: "University timetable analysis and scheduling intelligence", cat: "Academic" },
  { slug: "enactus", title: "Enactus CKT-UTAS", desc: "Student social entrepreneurship program platform", cat: "Academic" },
  { slug: "prions", title: "Prion Disease Infographic", desc: "The genetic revolution in prion disease research", cat: "Academic" },
  { slug: "umat", title: "UMaT Tracker", desc: "University of Mines and Technology progress tracker", cat: "Academic" },
  { slug: "playgrow", title: "PlayGrow", desc: "Smart learning fun for bright young minds", cat: "Academic" },
  { slug: "present", title: "14-Day Sprint Standup", desc: "Daily standup tracker for AUCDT agile sprints", cat: "Academic" },
  // Creative
  { slug: "bridge-radio", title: "Bridge Radio", desc: "AI music generation streamer — Afrobeats, Neo Soul and more", cat: "Creative", features: ["Gemini AI Music Generation", "Genre Selectors", "IndexedDB Track Library", "Admin Panel"], extendedDesc: "An AI-powered music streaming platform that generates original tracks across genres using Google Gemini, with an admin panel and persistent track library." },
  { slug: "warrior", title: "DJ CyStorm: Electric Storm", desc: "Reggae/dancehall artist showcase and release hub", cat: "Creative" },
  { slug: "triptych", title: "Cinematic Triptych Generator", desc: "AI-powered cinematic triptych image creation", cat: "Creative" },
  { slug: "reaper", title: "AI Audio in REAPER", desc: "Mastering AI audio production in REAPER DAW", cat: "Creative" },
  { slug: "dfs", title: "Drumming for SEL Success", desc: "Root Drumming Systems — SEL through rhythm", cat: "Creative" },
  { slug: "oba", title: "Ancestral Logic — Oja-Oj-Oba", desc: "Pan-African ancestral knowledge and philosophy system", cat: "Creative" },
  { slug: "oja", title: "Oja-Oj-Oba YouTube Pitch", desc: "YouTube channel pitch for the Ancestral Logic series", cat: "Creative" },
  { slug: "bionicskins", title: "Bionic Skins™", desc: "Africa-first medtech innovation and product platform", cat: "Creative" },
  { slug: "sashmade", title: "Sashmade Kente Academy", desc: "Kente fashion design education and proposal", cat: "Creative" },
  { slug: "fdt", title: "Fashion Design Brochure", desc: "AUCDT fashion design programme showcase", cat: "Creative" },
  { slug: "branding", title: "AUCDT Brand Guide", desc: "Official institutional brand identity and style guide", cat: "Creative" },
  { slug: "poster", title: "TechBridge Poster Studio", desc: "AI-powered institutional poster generation", cat: "Creative" },
  { slug: "banner", title: "TUC Banner Studio", desc: "Institutional banner design and generation tool", cat: "Creative" },
  { slug: "promo", title: "Landing Page Generator", desc: "AI-powered college landing page builder", cat: "Creative" },
  // Dev Tools
  { slug: "jsonpp", title: "JSON Preprocessor", desc: "Fixed JSON preprocessing, validation and formatting", cat: "Dev Tools" },
  { slug: "css-validator", title: "CSS Validator", desc: "Live CSS validation, linting and error reporting", cat: "Dev Tools" },
  { slug: "qmd", title: "QMD → Slides Converter", desc: "Convert QMD documents to Google Slides format", cat: "Dev Tools" },
  { slug: "pdf-json", title: "PDF to JSON Converter", desc: "Extract assessment data from PDFs as structured JSON", cat: "Dev Tools" },
  { slug: "pdf-extractor", title: "PDF Email Extractor", desc: "Bulk email address extraction from PDF documents", cat: "Dev Tools" },
  { slug: "pipeline", title: "Bitbucket CI/CD Migration", desc: "Comprehensive guide for Bitbucket pipeline migration", cat: "Dev Tools" },
  { slug: "md2latex", title: "Markdown → LaTeX", desc: "Convert Markdown to LuaLaTeX for academic publishing", cat: "Dev Tools" },
  { slug: "doculatex", title: "DocuLaTeX", desc: "PDF, Markdown, HTML to LaTeX universal converter", cat: "Dev Tools" },
  { slug: "omniextract", title: "OmniExtract", desc: "Universal PDF data extraction and parsing tool", cat: "Dev Tools" },
  { slug: "mailer", title: "Python Email Sender Guide", desc: "Deployment guide for Python email sender application", cat: "Dev Tools" },
  { slug: "sendtest", title: "SendMail API Tester", desc: "AUCDT email delivery API testing and validation", cat: "Dev Tools" },
  { slug: "refresh", title: "Bulletproof Directive", desc: "QA framework and project compliance workflow", cat: "Dev Tools" },
  { slug: "bp", title: "Bulletproof Directive V14", desc: "Five-phase compliance workflow dashboard", cat: "Dev Tools" },
  { slug: "pde", title: "Product Dev Lifecycle", desc: "Modern product development lifecycle framework", cat: "Dev Tools" },
  // Business
  { slug: "expensepro", title: "ExpensePro", desc: "Professional expense tracking and reporting system", cat: "Business" },
  { slug: "primevaluer", title: "PrimeValuer Pro", desc: "Property and asset AI valuation tool", cat: "Business" },
  { slug: "rpms", title: "Rophe Patient Management", desc: "Healthcare patient management system", cat: "Business" },
  { slug: "chow", title: "ChowConnect Dashboard", desc: "Food business administration and order management", cat: "Business" },
  { slug: "thepitchhub", title: "The Pitch Hub Ghana", desc: "Empowering Ghana's entrepreneurs with pitch tools", cat: "Business" },
  { slug: "sdf", title: "Strategic Dev Framework", desc: "Business strategic development and planning tool", cat: "Business" },
  { slug: "volt", title: "Volt Virtual Card", desc: "Digital virtual card creation and management", cat: "Business" },
  { slug: "thrive", title: "Interactive Marketing Strategy", desc: "AUCDT interactive marketing strategy platform", cat: "Business" },
  { slug: "impact-ventures", title: "Impact Ventures Dashboard", desc: "Venture impact tracking and investor reporting", cat: "Business" },
  { slug: "myvbci", title: "myVBCI Camper App", desc: "VBCI camper program management application", cat: "Business" },
  { slug: "willpro", title: "Will Drafting Utility", desc: "AI-powered will and estate document drafting", cat: "Business" },
  { slug: "willgenius", title: "WillGenius", desc: "Smart will creation and legal document assistant", cat: "Business" },
  { slug: "luxthumb", title: "LuxThumb Designer", desc: "AI-powered YouTube thumbnail generation and design", cat: "Business" },
  { slug: "youtube", title: "YouTube Description Genie", desc: "AI-generated YouTube descriptions, tags and metadata", cat: "Business" },
  // Admin
  { slug: "iad", title: "Admissions Dashboard", desc: "Interactive student admissions management portal", cat: "Admin" },
  { slug: "iam", title: "AUCDT IAM System", desc: "Identity and access management for TUC systems", cat: "Admin" },
  { slug: "leads", title: "Leads Portal", desc: "AUCDT prospective student leads management", cat: "Admin" },
  { slug: "hostelmanagement", title: "Mount Horeb Hostel Mgmt", desc: "Prayer center hostel administration and booking", cat: "Admin" },
  { slug: "recruitment", title: "Agency Assessment Portal", desc: "AUCDT student recruitment and agency assessment", cat: "Admin" },
  { slug: "veca", title: "VECA Contact Aggregator", desc: "Vermont education contact database and outreach", cat: "Admin" },
  { slug: "training-evaluator", title: "Office Training Evaluator", desc: "Staff training assessment and evaluation tool", cat: "Admin" },
  { slug: "notification", title: "Application Confirmation", desc: "AUCDT applicant status notification system", cat: "Admin" },
  { slug: "cardai", title: "AI Application Portal", desc: "AUCDT AI-powered student application system", cat: "Admin" },
  { slug: "genai", title: "GENAI App Directory", desc: "AUCDT generative AI application directory and index", cat: "Admin" },
  { slug: "programmes", title: "Design Programmes", desc: "AUCDT academic programme catalogue and showcase", cat: "Admin" },
  { slug: "medium", title: "TUC on Medium", desc: "Why TUC should be on every parent's radar", cat: "Admin" },
  // Games
  { slug: "games", title: "Brick Breaker", desc: "Classic arcade brick breaker game", cat: "Games" },
  { slug: "games/1", title: "Enhanced Brick Breaker I", desc: "Enhanced brick breaker — stage 1 of 3", cat: "Games" },
  { slug: "games/2", title: "Enhanced Brick Breaker II", desc: "Enhanced brick breaker — stage 2 of 3", cat: "Games" },
  { slug: "games/3", title: "Enhanced Brick Breaker III", desc: "Enhanced brick breaker — stage 3 of 3", cat: "Games" },
  { slug: "games/4", title: "Classic Tetris", desc: "The classic block-stacking game. Yes, with an IEEE SRS.", cat: "Games" },
  { slug: "flydee", title: "FLYDEE", desc: "Gamified plane spotting — more fun than it sounds", cat: "Games" },
  { slug: "drone-1", title: "Drone Light Show Simulator", desc: "Design and simulate spectacular drone formations", cat: "Games" },
];

const CAT_LIST = ["All", ...Object.keys(CATEGORIES)];

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (selectedTool) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [selectedTool]);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) || 
                            tool.desc.toLowerCase().includes(search.toLowerCase()) ||
                            tool.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || tool.cat === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const countsByCat = useMemo(() => {
    const counts: Record<string, number> = { All: TOOLS.length };
    TOOLS.forEach(t => {
      counts[t.cat] = (counts[t.cat] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden text-slate-900 bg-slate-50 font-sans">
      {/* Header Navigation */}
      <nav className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 z-10 transition-shadow duration-200">
        <div className="flex items-center gap-4">
          <img 
            src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
            alt="TUC Logo" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <span className="text-xl font-bold tracking-tight text-slate-800">TUC <span className="text-blue-600">AI Lab</span></span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-5 translate-y-2.5">Product Catalog</a>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button className="px-4 py-1.5 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors">Contact Lab</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex grow overflow-hidden">
        {/* Sidebar Filters */}
        <aside className="w-64 border-r border-slate-200 bg-white p-6 shrink-0 flex flex-col overflow-y-auto hidden md:flex">
          <div className="mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Framework Categories</h3>
            <div className="space-y-1">
              {CAT_LIST.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`sidebar-item w-full ${activeCategory === cat ? 'active' : ''}`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeCategory === cat ? 'bg-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                    {countsByCat[cat]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Deployment Tier</h3>
            <div className="space-y-3 px-2">
              {["Edge Computing", "Cloud Clusters", "Hybrid Hub"].map((tier, idx) => (
                <label key={tier} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer group">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${idx % 2 === 0 ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                    {idx % 2 === 0 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="group-hover:text-slate-900">{tier}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Section */}
        <main className="grow flex flex-col overflow-hidden bg-slate-50">
          <header className="px-8 pt-8 pb-6 bg-slate-50/80 backdrop-blur-sm z-1 shrink-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalog</h1>
                <p className="text-slate-500 mt-1 max-w-xl">Strategic AI solutions implemented through the TUC TechBridge methodology.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search tools..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex p-0.5 bg-slate-200 rounded-md">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded transition-all ${viewMode === "grid" ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded transition-all ${viewMode === "list" ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="grow overflow-y-auto px-8 pb-12 custom-scrollbar">
            {filteredTools.length > 0 ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "flex flex-col gap-3"
              }>
                <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool) => {
                      const globalIndex = TOOLS.findIndex(t => t.slug === tool.slug);
                      return (
                        <motion.div
                          key={tool.slug}
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ToolCard 
                            tool={tool} 
                            index={globalIndex} 
                            viewMode={viewMode} 
                            onOpen={() => setSelectedTool(tool)} 
                          />
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No matches found</p>
                <button 
                  onClick={() => { setSearch(""); setActiveCategory("All"); }}
                  className="mt-2 text-blue-600 font-semibold hover:underline bg-blue-50 px-3 py-1 rounded-full text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Footer Status Bar */}
          <footer className="px-8 py-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200 bg-white shrink-0">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 
                All Nodes Operational
              </span>
              <span className="border-l border-slate-200 pl-4 uppercase tracking-tighter">Last Sync: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex gap-4">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-400">Ver 2.4.9 Stable</span>
              <span className="font-semibold text-slate-600 underline cursor-pointer hover:text-blue-600 transition-colors">Lab Manifesto (PDF)</span>
            </div>
          </footer>
        </main>
      </div>

      <AnimatePresence>
        {selectedTool && <DetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ToolCard({ tool, index, viewMode, onOpen }: { tool: Tool, index: number, viewMode: "grid" | "list", onOpen: () => void }) {
  const CatIcon = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.icon || Cpu;
  const badgeClass = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.badge || "badge-slate";

  const cardNumber = String(index + 1).padStart(3, '0');

  if (viewMode === "list") {
    return (
      <button 
        onClick={onOpen}
        className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all group text-left"
      >
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono text-slate-400 font-bold w-12 shrink-0">#{cardNumber}</div>
          <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            <img 
              src={`/api/screenshot?url=${encodeURIComponent(BASE_URL + "/" + tool.slug)}&slug=${tool.slug}`}
              alt={tool.title}
              className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
            <CatIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{tool.title}</h3>
            <p className="text-xs text-slate-500 truncate max-w-md">{tool.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <span className={`badge ${badgeClass}`}>{tool.cat}</span>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
        </div>
      </button>
    );
  }

  return (
    <div 
      className="venture-card group h-[380px] flex flex-col cursor-pointer overflow-hidden border-none shadow-sm relative bg-slate-900" 
      onClick={onOpen}
    >
      {/* Full Bleed Background Screenshot via Local Playwright API */}
      <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden">
        <img 
          src={`/api/screenshot?url=${encodeURIComponent(BASE_URL + "/" + tool.slug)}&slug=${tool.slug}`}
          alt={`${tool.title} background`}
          className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-[0.6] saturate-[0.9] transition-all duration-[1500ms] ease-out group-hover:scale-105 group-hover:brightness-[0.8] group-hover:contrast-[1.1]"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to a cleaner thum.io without extra parameters if local fails
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('thum.io')) {
               target.src = `https://image.thum.io/get/width/800/crop/800/noanimate/${BASE_URL}/${tool.slug}`;
            }
          }}
        />
        {/* Scanline Effect (Recipe 3) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent transition-opacity duration-700 group-hover:opacity-40" />
      </div>

      {/* Index Number Badge - Engineering Style */}
      <div className="absolute top-0 left-0 z-20">
        <div className="flex items-center">
          <div className="px-3 py-1.5 bg-blue-600 text-[10px] font-mono text-white font-black tracking-widest clip-path-polygon-badge">
            ID::{cardNumber}
          </div>
          <div className="ml-[-10px] pl-4 pr-3 py-1.5 bg-black/40 backdrop-blur-md text-[9px] font-mono text-blue-400/80 font-bold border-y border-r border-white/10 rounded-r-md">
            CAPTURE_MODE::REMOTE_DISPLAY
          </div>
        </div>
      </div>

      {/* Floating Category Badge */}
      <div className="absolute top-4 right-4 z-20">
        <span className={`badge ${badgeClass} shadow-2xl backdrop-blur-md bg-slate-900/80 border-slate-700 text-[10px] font-bold uppercase tracking-widest`}>
          {tool.cat}
        </span>
      </div>

      {/* Hardware Accents (Recipe 3) */}
      <div className="absolute inset-0 border-[0.5px] border-white/5 pointer-events-none z-10 group-hover:border-blue-500/30 transition-colors duration-500" />
      <div className="absolute top-0 left-0 w-8 h-[0.5px] bg-white/20 z-10" />
      <div className="absolute top-0 left-0 w-[0.5px] h-8 bg-white/20 z-10" />
      
      {/* Overlay Content (Bottom) */}
      <div className="mt-auto relative z-10 p-6 backdrop-blur-[2px] bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-32 transition-all duration-500 group-hover:via-slate-950/70">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-500">
            <CatIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-white text-xl group-hover:text-blue-100 transition-colors leading-none tracking-tight">
              {tool.title}
            </h4>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mt-1 group-hover:text-blue-300 transition-colors">
              NODE_AUTH::{tool.slug}
            </span>
          </div>
        </div>
        
        <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2 mb-6 font-medium opacity-90 group-hover:opacity-100 transition-opacity">
          {tool.desc}
        </p>

        <div className="pt-5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute opacity-20" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-[0.25em] uppercase">
              Secure_Feed
            </span>
          </div>
          <button 
            className="text-[11px] font-bold text-white flex items-center gap-2 hover:gap-3 transition-all bg-white/5 px-5 py-2.5 rounded-lg backdrop-blur-md hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/70 shadow-lg"
          >
            Launch Interface <ChevronRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ tool, onClose }: { tool: Tool, onClose: () => void }) {
  const CatIcon = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.icon || Cpu;
  const badgeClass = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.badge || "badge-slate";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
         >
           {/* Left Panel: Visual/Icon */}
          <div className="md:w-1/3 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
              <CatIcon className="w-12 h-12 text-blue-600" />
            </div>
            <span className={`badge ${badgeClass} mb-4`}>{tool.cat}</span>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Neural ID</p>
              <p className="font-mono text-xs text-slate-600">tuc-arch::{tool.slug}</p>
            </div>
            
            <div className="mt-auto pt-12 space-y-4 w-full">
              <a 
                href={`${BASE_URL}/${tool.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
              >
                Launch Demo <ExternalLink className="w-4 h-4" />
              </a>
              <button 
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>

          {/* Right Panel: Content */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{tool.title}</h2>
            <p className="text-slate-500 mb-8 leading-relaxed italic">{tool.desc}</p>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Project Overview
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {tool.extendedDesc || "This application is part of the TUC AI Lab strategic portfolio. It leverages cutting-edge machine learning architectures to solve specific regional and industrial challenges in West Africa."}
                </p>
              </section>

              {tool.features && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Key Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tool.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{feat}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Stability & Performance
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[96%]"></div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">96% Reliable</span>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
  );
}
