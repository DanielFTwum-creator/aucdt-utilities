import { useState, useMemo, useEffect } from "react";
import { Search, LayoutGrid, List as ListIcon, ExternalLink, Cpu, Sparkles, Code, Briefcase, Settings, Gamepad2, ChevronRight, Check, X, Shield, Zap, Globe, LogOut, PenTool, Beaker, Mic, BookOpen, Palette, MessageSquare, Music, ImageIcon, BarChart3, Home, Users, Clock, Activity, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./contexts/AuthContext";

const BASE_URL = "https://ai-tools.techbridge.edu.gh";

const CATEGORIES = {
  "AI & ML": { badge: "badge-ai-ml", icon: Cpu, color: "#2563eb", accentColor: "#3b82f6" },
  "Academic": { badge: "badge-academic", icon: BookOpen, color: "#14b8a6", accentColor: "#06d6a0" },
  "Creative": { badge: "badge-creative", icon: Palette, color: "#f43f5e", accentColor: "#fb7185" },
  "Dev Tools": { badge: "badge-dev-tools", icon: Code, color: "#f59e0b", accentColor: "#fbbf24" },
  "Business": { badge: "badge-business", icon: Briefcase, color: "#f59e0b", accentColor: "#fbbf24" },
  "Admin": { badge: "badge-admin", icon: Settings, color: "#6366f1", accentColor: "#818cf8" },
  "Games": { badge: "badge-games", icon: Gamepad2, color: "#0891b2", accentColor: "#06b6d4" },
};

// Tool-specific icon mapping
const TOOL_ICONS: Record<string, React.ComponentType<{className?: string}>> = {
  "ai-email-drafter": PenTool,
  "dictation-app": Mic,
  "biochemai": Beaker,
  "youtube-genie": Music,
  "luxthumb-agent": ImageIcon,
  "markai": Sparkles,
  "smartscale-ai-presentation-platform": BarChart3,
  "ai-stand-up-workshop-prep": Clock,
  "ai-techbridge": Globe,
  "dmcdai": Palette,
  "techbridge-assessment-platform": BookOpen,
  "ai-flyer-generator": Palette,
  "ai-scene-visualizer": ImageIcon,
  "bridge-radio": Music,
  "fashionprompt-ai": Palette,
  "ai-studio-project-refresh": Settings,
  "ai-transformation-framework": BarChart3,
  "expensepro": DollarSign,
  "glucosentinel": Activity,
  "rophe-specialist-care-rpms": Home,
  "rophe-sugar-logger": Activity,
  "brainiac-challenge": Gamepad2,
};

interface Tool {
  slug: string;
  title: string;
  desc: string;
  cat: string;
  tags?: string[];
  features?: string[];
  extendedDesc?: string;
  status?: "live" | "in-lab" | "coming-soon" | "soon-installed" | "active" | "queued" | "idle";
  nodeStatus?: "operational" | "queued" | "error" | "idle";
  usageWeek?: number;
}

const TOOLS: Tool[] = [
  // AI & ML
  { slug: "ai-email-drafter", title: "AI Email Drafter", desc: "AI drafts and refines professional emails instantly", cat: "AI & ML" },
  { slug: "brand-guideline-checker", title: "Brand Guideline Checker", desc: "AI checks marketing materials against AUCDT brand guidelines", cat: "AI & ML" },
  { slug: "biochemai", title: "BioChemAI", desc: "Adaptive AI teaching assistant for biochemistry education", cat: "AI & ML" },
  { slug: "dictation-app", title: "Dictation App", desc: "Turns audio recordings into clean transcribed notes via Gemini", cat: "AI & ML" },
  { slug: "youtube-genie", title: "YouTube Genie", desc: "AI generates professional YouTube descriptions for musicians", cat: "AI & ML" },
  { slug: "ghana-news-aggregator", title: "Ghana News Aggregator", desc: "AI-powered news aggregation platform for Ghana content", cat: "AI & ML" },
  { slug: "luxthumb-agent", title: "LuxThumb Agent", desc: "AI thumbnail design agent for cinematic luxury brands", cat: "AI & ML" },
  { slug: "markai", title: "markAI", desc: "AI-powered marketing for non-marketers — strategy to content", cat: "AI & ML" },
  { slug: "midjourney-prompt-helper", title: "Midjourney Prompt Helper", desc: "Generates prompt variations for Midjourney image generation", cat: "AI & ML" },
  { slug: "omniextract", title: "OmniExtract", desc: "AI extracts emails and invoice data from PDF documents", cat: "AI & ML" },
  { slug: "smartscale-ai-presentation-platform", title: "SmartScale AI", desc: "AI-powered accessible presentation platform for training", cat: "AI & ML" },
  { slug: "ai-stand-up-workshop-prep", title: "AI Workshop Prep", desc: "Summarises standups and prepares AI workshop strategies", cat: "AI & ML" },

  // Academic
  { slug: "ai-techbridge", title: "AI at TechBridge", desc: "Interactive landing page for TechBridge AI research", cat: "Academic" },
  { slug: "aucdt-msee-aptitude-test", title: "MSEE Aptitude Test", desc: "Timed AI-powered maths aptitude exam for mature students", cat: "Academic" },
  { slug: "ckt-utas-modern-website", title: "CKT-UTAS Website", desc: "Modern React rebuild of the CKT-UTAS university website", cat: "Academic" },
  { slug: "dmcdai", title: "dmcdAI", desc: "Educational sandbox for AI in digital media and design", cat: "Academic" },
  { slug: "fashion-design-brochure", title: "Fashion Design Brochure", desc: "Dynamic academic brochure for the AUCDT Fashion programme", cat: "Academic" },
  { slug: "fees-comparison-dashboard", title: "Fees Comparison Dashboard", desc: "Visualises tuition fees across Ghana's universities", cat: "Academic" },
  { slug: "lecturer-assessment", title: "Lecturer Assessment Portal", desc: "Form for students to submit lecturer assessment feedback", cat: "Academic" },
  { slug: "lecturer-assessment-system", title: "Lecturer Assessment System", desc: "Students assess lecturers; AI extracts curriculum from PDFs", cat: "Academic" },
  { slug: "mature-students-exam-app", title: "Mature Students Exam", desc: "AI-powered maths exam app for TUC mature student entrance", cat: "Academic" },
  { slug: "playgrow", title: "PlayGrow", desc: "Educational mini-games for holistic 5-year-old development", cat: "Academic" },
  { slug: "scholarship-bond-portal", title: "Scholarship Bond Portal", desc: "Secure digital scholarship agreement portal for TUC Oyibi", cat: "Academic" },
  { slug: "shortcut-master", title: "Shortcut Master", desc: "Interactive Google Workspace keyboard shortcut trainer", cat: "Academic" },
  { slug: "techbridge-assessment-platform", title: "TUC Assessment Platform", desc: "AI-powered academic assessment with feedback for TUC", cat: "Academic" },
  { slug: "techbridge-lead-generation-infographic", title: "AUCDT Lead Infographic", desc: "Dynamic infographic attracting prospective AUCDT students", cat: "Academic" },
  { slug: "techbridge-scholarship-portal", title: "TechBridge Scholarship Portal", desc: "Digital scholarship application and agreement portal", cat: "Academic" },
  { slug: "techbridge-technical-quiz-platform", title: "Technical Quiz Platform", desc: "AI-powered full-stack developer technical assessment platform", cat: "Academic" },
  { slug: "tvet-assessment-progress-dashboard", title: "TVET Progress Dashboard", desc: "Tracks TVET assessment completion with gap analysis", cat: "Academic" },
  { slug: "verb-explorer-toolkit", title: "Verb Explorer Toolkit", desc: "Interactive Class 4 verb discovery and profiling toolkit", cat: "Academic" },
  { slug: "visual-quiz-master", title: "Visual Quiz Master", desc: "Quiz app with SVG diagrams and Chart.js visual questions", cat: "Academic" },

  // Creative
  { slug: "ai-flyer-generator", title: "AI Flyer Generator", desc: "Generates professional business flyers from design briefs", cat: "Creative" },
  { slug: "ai-scene-visualizer", title: "AI Scene Visualizer", desc: "Creates stunning visual scenes from text descriptions", cat: "Creative" },
  { slug: "ananse-cartoon-generator", title: "Ananse Cartoon Generator", desc: "AI generates cartoon scenes from Ananse spider stories", cat: "Creative" },
  { slug: "animator-agent-desktop", title: "Animator Agent Desktop", desc: "Desktop AI animation studio with multi-track timeline", cat: "Creative" },
  { slug: "bridge-radio", title: "Bridge Radio", desc: "AI music generation streamer — Afrobeats, Neo Soul and more", cat: "Creative" },
  { slug: "cinematic-triptych-generator", title: "Cinematic Triptych Generator", desc: "AI generates a cinematic three-image visual narrative", cat: "Creative" },
  { slug: "clipai", title: "ClipAI", desc: "Clips images into custom shapes for download", cat: "Creative" },
  { slug: "creoai", title: "CreoAI", desc: "AI flyer generator with custom images and video backgrounds", cat: "Creative" },
  { slug: "dadaist-concert-visualizer", title: "Dadaist Concert Visualizer", desc: "Sound-reactive concert wall inspired by Dadaist collage art", cat: "Creative" },
  { slug: "drone-light-show-simulator", title: "Drone Light Show Simulator", desc: "Simulates drone light shows forming shapes and text", cat: "Creative" },
  { slug: "entrainer-landing-page", title: "enTrainer Landing Page", desc: "Responsive landing page for a music-cadence fitness app", cat: "Creative" },
  { slug: "fashionprompt-ai", title: "FashionPrompt AI", desc: "Generates inclusive, diverse fashion design AI prompts", cat: "Creative" },
  { slug: "gif-animator-ai", title: "GIF Animator AI", desc: "Generates animated GIFs from text prompts via Gemini", cat: "Creative" },
  { slug: "groove-streamer", title: "Groove Streamer", desc: "160 BPM groove streaming application", cat: "Creative" },
  { slug: "kente-fusion-fashion-workshop", title: "Kente Fusion Workshop", desc: "Interactive workshop designing Kente-modern fashion fusions", cat: "Creative" },
  { slug: "lumina-concert-video-wall", title: "Lumina Concert Wall", desc: "Interactive LED concert wall with mouse-reactive visuals", cat: "Creative" },
  { slug: "patois-lyricist", title: "Patois Lyricist", desc: "AI generates authentic Reggae lyrics in Jamaican Patois", cat: "Creative" },
  { slug: "techbridge-ai-workshop-flyer", title: "AI Workshop Flyer", desc: "Sci-fi digital flyer for a Fashion Design AI Workshop", cat: "Creative" },
  { slug: "techbridge-poster-studio", title: "TechBridge Poster Studio", desc: "Premium poster generator with PNG and MP4 video export", cat: "Creative" },
  { slug: "techbridge-university-college-banner", title: "TUC Banner", desc: "Redesigned Techbridge University College banner display", cat: "Creative" },

  // Dev Tools
  { slug: "ai-studio-project-refresh", title: "AI Studio Refresh", desc: "Manages phased project refresh directives for AI Studio", cat: "Dev Tools" },
  { slug: "aucdt-quarto-presentation-editor", title: "Quarto Presentation Editor", desc: "Web editor for branded AUCDT Quarto-style presentations", cat: "Dev Tools" },
  { slug: "aucdt-sendmail-api-tester", title: "SendMail API Tester", desc: "Tests the SendMail API across dev, QA, and UAT environments", cat: "Dev Tools" },
  { slug: "bulletproof-directive", title: "Bulletproof Directive v15", desc: "AI-orchestrated QA framework for production-grade software", cat: "Dev Tools" },
  { slug: "container-health-auditor", title: "Container Health Auditor", desc: "AI monitors containers with anomaly detection and scoring", cat: "Dev Tools" },
  { slug: "countdown-timer", title: "Countdown Timer", desc: "Beautiful countdown timer with 3D abstract background", cat: "Dev Tools" },
  { slug: "linkscan-techbridge", title: "LinkScan TechBridge", desc: "Diagnostic tool for auditing links on the TUC admissions portal", cat: "Dev Tools" },
  { slug: "modern-product-development-lifecycle", title: "Product Lifecycle Guide", desc: "Interactive 10-stage product design and development report", cat: "Dev Tools" },
  { slug: "pdf-to-assessment-json-converter", title: "PDF to Assessment JSON", desc: "AI converts PDF programme data into structured JSON", cat: "Dev Tools" },
  { slug: "qmd-to-google-slides-converter", title: "QMD to Slides Converter", desc: "Converts structured data into a Google Slides Apps Script", cat: "Dev Tools" },
  { slug: "techbridge-ai-blueprint", title: "TechBridge AI Blueprint", desc: "TUC application lifecycle manager and project tracker", cat: "Dev Tools" },

  // Business
  { slug: "ai-transformation-framework", title: "AI Transformation Framework", desc: "Interactive guide for scaling enterprise AI adoption", cat: "Business" },
  { slug: "bionicskins", title: "BionicSkins", desc: "Advanced prosthetics provider combining MIT tech and care", cat: "Business" },
  { slug: "expensepro", title: "ExpensePro", desc: "Expense tracker with budgets, AI receipts, and analytics", cat: "Business" },
  { slug: "glucosentinel", title: "GlucoSentinel", desc: "WHO-aligned diabetes self-management platform", cat: "Business" },
  { slug: "impact-ventures-dashboard", title: "Impact Ventures Dashboard", desc: "Ranks AI apps by monetisation and social impact potential", cat: "Business" },
  { slug: "lfpaperworks", title: "LFPaperWorks", desc: "E-commerce platform for handcrafted paper art products", cat: "Business" },
  { slug: "orbit-walk-reminder", title: "Orbit Walk Reminder", desc: "Movement and wellness reminder app", cat: "Business" },
  { slug: "pama-realtor", title: "Pama Realtor", desc: "Real estate app for renting and buying with property filtering", cat: "Business" },
  { slug: "primevaluer-pro", title: "PrimeValuer Pro", desc: "Property surveyors produce PDF valuation reports", cat: "Business" },
  { slug: "sashmade", title: "SashMade", desc: "AI-enhanced e-commerce for African textile fashion", cat: "Business" },
  { slug: "send-platform-dashboard", title: "SEND Platform Dashboard", desc: "Admin dashboard for the SEND report automation platform", cat: "Business" },
  { slug: "stockpulse", title: "StockPulse", desc: "AI stock analysis and portfolio management application", cat: "Business" },
  { slug: "talentverify", title: "TalentVerify", desc: "AI-resilient talent identification platform for HR teams", cat: "Business" },
  { slug: "techbridge-strategy-dashboard", title: "TechBridge Strategy Dashboard", desc: "Dashboard for TUC strategic rebrand and financial roadmap", cat: "Business" },
  { slug: "veca-vermont-education-contact-aggregator", title: "VECA Contact Aggregator", desc: "Finds and verifies Vermont school professional development contacts", cat: "Business" },
  { slug: "willpro", title: "WillPro", desc: "Guides users through drafting a last will and testament", cat: "Business" },

  // Admin
  { slug: "ajumapro-sms", title: "Ajumapro SMS", desc: "School management system for Ajumapro", cat: "Admin" },
  { slug: "aucdt-iam-system", title: "AUCDT IAM System", desc: "Manages industrial attachments for AUCDT students", cat: "Admin" },
  { slug: "college-landing-page-generator", title: "Landing Page Generator", desc: "Quickly builds and previews college programme landing pages", cat: "Admin" },
  { slug: "compliance-workflow-dashboard", title: "Compliance Workflow", desc: "Tracks HIPAA, PCI-DSS, and SOC 2 compliance workflows", cat: "Admin" },
  { slug: "myvbci-camper-app", title: "myVBCI Camper App", desc: "Church camp registration, room allocation, and payment system", cat: "Admin" },
  { slug: "rophe-specialist-care-rpms", title: "Rophe Care RPMS", desc: "Patient management with EHR, scheduling, and AI documentation", cat: "Admin" },
  { slug: "rophe-sugar-logger", title: "Rophe Sugar Logger", desc: "Blood glucose logger with averages and printable reports", cat: "Admin" },
  { slug: "salary-calculator-automation-system", title: "Salary Calculator", desc: "Automated new-recruit salary calculator with allowances", cat: "Admin" },
  { slug: "techbridge-media-club-platform", title: "Media Club Platform", desc: "Digital media management with editorial workflows and analytics", cat: "Admin" },
  { slug: "techbridge-student-population-register", title: "Student Population Register", desc: "Student population data register for TechBridge University", cat: "Admin" },
  { slug: "timetable-management-system", title: "Timetable Management", desc: "Automates academic timetable creation for AUCDT", cat: "Admin" },
  { slug: "tsapro", title: "TSAPro", desc: "Secure salary administration portal for TechBridge recruits", cat: "Admin" },
  { slug: "tuc-2026-enrollment-command-centre", title: "TUC Enrollment Centre", desc: "Enrollment and marketing strategy dashboard for TUC 2026", cat: "Admin" },

  // Games
  { slug: "brainiac-challenge", title: "Brainiac Challenge", desc: "AI-powered quiz app with real-time Gemini question generation", cat: "Games" },
  { slug: "flydee", title: "Flydee", desc: "Gamified plane-spotting app using camera and GPS", cat: "Games" },
  { slug: "gemini-slingshot-3", title: "Gemini Slingshot", desc: "Gemini-powered webcam bubble shooter game", cat: "Games" },
  { slug: "what-color-is-your-parachute-personality-quiz", title: "Parachute Personality Quiz", desc: "Three-phase quiz generating a personalised personality profile", cat: "Games" },
];

const CAT_LIST = ["All", ...Object.keys(CATEGORIES)];

export default function App() {
  const { isAuthenticated, logout } = useAuth();
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
      <nav className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-5">
          <img
            src="https://techbridge.edu.gh/static/TUC_LOGO_1.png"
            alt="TUC Logo"
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] font-bold text-slate-500 tracking-[0.15em] uppercase">Techbridge</div>
            <div className="text-base font-bold tracking-tight">
              <span className="text-slate-900">TUC AI Lab</span>
            </div>
          </div>
          <div className="ml-4 pl-4 border-l-2 border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-slate-600 tracking-wider">{TOOLS.length}</span>
              <span className="text-[10px] text-slate-500 tracking-widest uppercase">Tools</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-2-5s"></span>
                <span className="text-[10px] font-semibold text-emerald-700 tracking-wider">3 ACTIVE</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-5 translate-y-2.5">AI Lab Catalog</a>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-1.5 text-slate-600 text-sm font-semibold hover:text-slate-900 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
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
            <div className="space-y-2 px-2">
              {["Edge Computing", "Cloud Clusters", "Hybrid Hub"].map((tier, idx) => (
                <button
                  key={tier}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all font-medium text-sm cursor-pointer border ${
                    idx % 2 === 0
                      ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${idx % 2 === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    {idx % 2 === 0 && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="truncate">{tier}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Section */}
        <main className="grow flex flex-col overflow-hidden bg-slate-50">
          <header className="px-8 pt-8 pb-6 bg-slate-50/80 backdrop-blur-sm z-1 shrink-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Lab</h1>
                <p className="text-slate-500 mt-1 max-w-xl">Live AI agents and tools running in real-time. Monitor, control, and deploy solutions.</p>
                {activeCategory !== "All" && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Active Filter:</span>
                    <button
                      onClick={() => setActiveCategory("All")}
                      className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-300/50 shadow-sm"
                    >
                      {activeCategory}
                      <X className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    className="pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-all w-72 shadow-sm"
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
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-max"
                : "flex flex-col gap-3"
              }>
                <AnimatePresence mode="popLayout">
                    {filteredTools.map((tool) => {
                      const globalIndex = TOOLS.findIndex(t => t.slug === tool.slug);
                      return (
                        <motion.div
                          key={tool.slug}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 12 }}
                          transition={{ duration: 0.4, delay: globalIndex * 0.05 }}
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
          <footer className="px-8 py-2.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm shrink-0">
            <div className="flex gap-6">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                All Nodes Operational
              </span>
              <span className="text-slate-400 tracking-widest uppercase font-mono">Last Sync: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex gap-5 items-center">
              <span className="text-slate-400 text-[9px]">Ver 2.4.9 Stable</span>
              <span className="font-semibold text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">Lab Manifesto (PDF)</span>
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
  const [screenshotFailed, setScreenshotFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const CatIcon = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.icon || Cpu;
  const ToolSpecificIcon = TOOL_ICONS[tool.slug] || CatIcon;
  const badgeClass = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.badge || "badge-slate";
  const accentColor = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.accentColor || "#2563eb";

  // Status mapping - random for now, can be dynamic later
  const statusOptions = ["Active model", "Queued", "Idle"];
  const nodeStatus = statusOptions[index % statusOptions.length];
  const isActive = nodeStatus === "Active model";
  const usageWeek = Math.floor(Math.random() * 100) + 10;

  const cardNumber = String(index + 1).padStart(3, '0');

  // Status messages for placeholder
  const statusMessages = ["In the lab", "Soon to be installed", "Coming soon"];
  const statusMessage = statusMessages[index % statusMessages.length];

  if (viewMode === "list") {
    return (
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-lg hover:bg-slate-50 transition-all group text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="text-[10px] font-mono text-slate-400 font-bold w-12 shrink-0">#{cardNumber}</div>
          <div className="w-12 h-12 rounded bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
            <img
              src={`/api/screenshot?url=${encodeURIComponent(BASE_URL + "/" + tool.slug)}&slug=${tool.slug}`}
              alt={tool.title}
              className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0" style={{ color: accentColor }}>
            <ToolSpecificIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{tool.title}</h3>
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            </div>
            <p className="text-xs text-slate-500 truncate max-w-md">{tool.desc}</p>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Used {usageWeek}× this week
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0 ml-4">
          <span className={`badge ${badgeClass} text-[9px]`}>{tool.cat}</span>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors" />
        </div>
      </button>
    );
  }

  return (
    <div
      className="venture-card group h-[380px] flex flex-col cursor-pointer overflow-hidden border-none shadow-sm relative bg-slate-800/8"
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Bleed Background Screenshot via Local Playwright API */}
      <div className="absolute inset-0 z-0 bg-slate-800/8 overflow-hidden">
        {!screenshotFailed && (
          <img
            src={`/api/screenshot?url=${encodeURIComponent(BASE_URL + "/" + tool.slug)}&slug=${tool.slug}`}
            alt={`${tool.title} background`}
            className="w-full h-full object-cover object-top filter contrast-[1.05] brightness-[0.6] saturate-[0.9] transition-all duration-[1500ms] ease-out group-hover:scale-105 group-hover:brightness-[0.8] group-hover:contrast-[1.1]"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setScreenshotFailed(true)}
          />
        )}
        {screenshotFailed && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/80 to-slate-950/80">
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-blue-400/60 mx-auto mb-3" />
              <p className="text-blue-300/80 text-sm font-medium">{statusMessage}</p>
            </div>
          </div>
        )}
        {/* Scanline Effect (Recipe 3) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent transition-opacity duration-700 group-hover:opacity-50" />
      </div>

      {/* Header Section - Top Left w/ Icon & Title */}
      <div className="absolute top-0 left-0 right-0 z-20 p-5 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white flex-shrink-0" style={{ color: accentColor }}>
            <ToolSpecificIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-lg leading-tight tracking-tight line-clamp-2">
              {tool.title}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <div className={`status-dot ${isActive ? 'active' : ''}`} />
              <span className="text-[8px] font-bold text-white/90 uppercase tracking-widest">{nodeStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Category Badge - Only shown for non-primary categories */}
      {tool.cat !== "AI & ML" && (
        <div className="absolute top-4 right-4 z-20">
          <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg border backdrop-blur-md ${
            badgeClass} shadow-md`}>
            {tool.cat}
          </span>
        </div>
      )}

      {/* Hardware Accents (Recipe 3) */}
      <div className="absolute inset-0 border-[0.5px] border-white/5 pointer-events-none z-10 group-hover:border-blue-500/30 transition-colors duration-500" />
      <div className="absolute top-0 left-0 w-8 h-[0.5px] bg-white/20 z-10" />
      <div className="absolute top-0 left-0 w-[0.5px] h-8 bg-white/20 z-10" />
      
      {/* Overlay Content (Bottom) */}
      <motion.div
        className="mt-auto relative z-10 p-6 backdrop-blur-[2px] bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pt-24 transition-all duration-500 group-hover:via-slate-900/60"
        initial={{ y: 0 }}
        animate={isHovered ? { y: -8 } : { y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <p className="text-[13px] text-slate-200 leading-relaxed line-clamp-3 mb-5 font-medium opacity-95 group-hover:opacity-100 transition-opacity">
          {tool.desc}
        </p>

        <p className="text-[9px] text-slate-500 font-medium mb-4 flex items-center gap-1.5 opacity-75">
          <span className="w-1 h-1 rounded-full bg-amber-400/60"></span>
          <span>Used {usageWeek}× this week</span>
        </p>

        <div className="pt-5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute opacity-20" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
              {tool.slug}
            </span>
          </div>
          <button
            className="btn-launch text-[11px] flex items-center gap-2 hover:gap-3 transition-all"
          >
            Launch <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
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
                className="btn-launch flex items-center justify-center gap-2 w-full py-3 text-sm"
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
