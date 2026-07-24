import { useState, useMemo, useEffect } from "react";
import { Search, LayoutGrid, List as ListIcon, ExternalLink, Cpu, Sparkles, Code, Briefcase, Settings, Gamepad2, ChevronRight, Check, X, Shield, Zap, Globe, LogOut, PenTool, Beaker, Mic, BookOpen, Palette, MessageSquare, Music, ImageIcon, BarChart3, Home, Users, Clock, Activity, DollarSign, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import AppCatalog from "./components/AppCatalog";

const BASE_URL = "https://ai-tools.techbridge.edu.gh";

// Map app slugs to their actual deployment paths
const SLUG_TO_PATH: Record<string, string> = {
  "techbridge-ai-blueprint": "/blueprint/",
  "ai-email-drafter": "/email-drafter/",
  "biochemai": "/biochemai/",
  "dictation-app": "/dictation/",
  "glucose": "/glucose/",
  "typing-and-mathematics-tutorial": "/math-island/",
  "typing-tutorial": "/typing-tutor/",
  "patois-lyricist": "/patois/",
  "rophe-specialist-care-rpms": "/care/",
  "ai-stand-up-workshop-prep": "/workshop/",
  "techbridge-ai-workshop-flyer": "/workshop-flyer/",
  "techbridge-poster-studio": "/poster-studio/",
  "tuc-2026-enrollment-command-centre": "/enrollment-2026/",
  "impact-ventures-dashboard": "/impact-ventures/",
  "techbridge-assessment-platform": "/assessment/",
  "bionicskins": "/skins/",
  "deep-dub-vibes-player": "/deep-dub-vibes-player/",
  "omniextract": "/omniextract/",
  "playgrow": "/playgrow/",
  "brand-guideline-checker": "/brand-guideline-checker/",
  "orbit-walk-reminder": "/orbit-walk-reminder/",
  "groove-streamer": "/groove-streamer/",
  "youtube-genie": "/youtube-genie/",
  "markai": "/markai/",
  "stockpulse": "/stockpulse/",
  "english-safari": "/english-safari/",
};

const getAppUrl = (slug: string) => {
  const path = SLUG_TO_PATH[slug] || `/${slug}/`;
  return `${BASE_URL}${path}`;
};

// Slugs verified live (link audit 2026-06-10) — others render as "Coming Soon"
const DEPLOYED_SLUGS = new Set<string>([
  "ai-email-drafter", "brand-guideline-checker", "biochemai", "dictation-app",
  "youtube-genie", "ghana-news-aggregator", "luxthumb-agent", "markai",
  "midjourney-prompt-helper", "omniextract", "smartscale-ai-presentation-platform",
  "ai-techbridge", "aucdt-msee-aptitude-test", "ckt-utas-modern-website", "dmcdai",
  "playgrow", "techbridge-lead-generation-infographic", "techbridge-technical-quiz-platform",
  "bridge-radio", "groove-streamer", "techbridge-university-college-banner",
  "techbridge-ai-blueprint", "glucose", "orbit-walk-reminder", "techbridge-strategy-dashboard",
  "willpro", "techbridge-media-club-platform", "techbridge-student-population-register",
  "tsapro", "typing-and-mathematics-tutorial", "typing-tutorial",
  "ai-stand-up-workshop-prep", "techbridge-ai-workshop-flyer", "techbridge-poster-studio",
  "tuc-2026-enrollment-command-centre", "patois-lyricist", "impact-ventures-dashboard",
  "techbridge-assessment-platform", "bionicskins", "stockpulse",
  "english-safari", "umat",
]);

const isDeployed = (slug: string) => DEPLOYED_SLUGS.has(slug);

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
  "glucose": Activity,
  "glucosentinel": Activity,
  "rophe-specialist-care-rpms": Home,
  "rophe-sugar-logger": Activity,
  "brainiac-challenge": Gamepad2,
  "stockpulse": BarChart3,
  "english-safari": Gamepad2,
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
  { slug: "umat", title: "UMaT Tracker", desc: "UMaT curriculum recommendations tracker for Techbridge University College", cat: "Academic" },
  { slug: "fashion-design-brochure", title: "Fashion Design Brochure", desc: "Dynamic academic brochure for the AUCDT Fashion programme", cat: "Academic" },
  { slug: "ghana-university-fees-dashboard", title: "Ghana University Fees Dashboard", desc: "Visualises tuition fees across Ghana's universities", cat: "Academic" },
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
  { slug: "english-safari", title: "English Safari", desc: "Interactive vocabulary adventure game for kids", cat: "Games" },

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
  { slug: "glucose", title: "Glucose", desc: "WHO-aligned diabetes self-management platform", cat: "Business" },
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
  { slug: "typing-and-mathematics-tutorial", title: "Math Island Typing", desc: "Gamified journey combining touch-typing with fraction and maths puzzles", cat: "Games" },
  { slug: "typing-tutorial", title: "Touch Typing Tutor", desc: "Professional touch typing academy with speed tests and progressive lessons", cat: "Academic" },
];

const CAT_LIST = ["All", ...Object.keys(CATEGORIES)];

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [activeView, setActiveView] = useState<"lab" | "catalog">("lab");
  const [visibleCount, setVisibleCount] = useState(24);

  // Body scroll lock
  useEffect(() => {
    if (selectedTool) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [selectedTool]);

  // Reset visible count on search/category change
  useEffect(() => {
    setVisibleCount(24);
  }, [search, activeCategory]);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (!isDeployed(tool.slug)) return false;   // hide "Coming Soon" apps entirely
      const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) ||
                            tool.desc.toLowerCase().includes(search.toLowerCase()) ||
                            tool.slug.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || tool.cat === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const countsByCat = useMemo(() => {
    const deployed = TOOLS.filter(t => isDeployed(t.slug));
    const counts: Record<string, number> = { All: deployed.length };
    deployed.forEach(t => {
      counts[t.cat] = (counts[t.cat] || 0) + 1;
    });
    return counts;
  }, []);

  const NAVY = '#1a1f3c';
  const CRIMSON = '#8b1a1a';
  const GOLD = '#f5c518';

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', fontFamily:"'DM Sans','Inter',sans-serif", backgroundColor:'#f7f5f0' }}>

      {/* Topbar */}
      <nav style={{ background:NAVY, padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'54px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', background:GOLD, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Shield style={{ width:'16px', height:'16px', color:NAVY }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            <div style={{ fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", fontSize:'21px', fontWeight:700, letterSpacing:'0.03em', lineHeight:1, color:'#fff', textTransform:'uppercase' }}>
              TECHBRIDGE <span style={{ color:GOLD }}>UNIVERSITY COLLEGE</span>
            </div>
            <div style={{ fontSize:'9px', color:'#7880b0', fontStyle:'italic', marginTop:'2px' }}>Formerly AsanSka University College of Design and Technology</div>
          </div>
        </div>
        <div style={{ display:'flex', flex:1, maxWidth:'340px', margin:'0 14px', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.32)', borderRadius:'8px', padding:'0 11px', height:'36px' }}>
          <Search style={{ width:'14px', height:'14px', color:'#cfd3ea', flexShrink:0 }} />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search AI tools or describe a task…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background:'none', border:'none', outline:'none', color:'#fff', fontSize:'12.5px', flex:1, fontFamily:'inherit' }}
          />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button title="View AI Lab Tools" onClick={() => setActiveView("lab")} style={{ fontSize:'11px', color: activeView==='lab' ? '#fff' : '#8b90b8', background: activeView==='lab' ? 'rgba(255,255,255,0.1)' : 'none', border:'none', cursor:'pointer', padding:'5px 9px', borderRadius:'6px' }}>AI Lab Tools</button>
          <button title="View App Catalog" onClick={() => setActiveView("catalog")} style={{ fontSize:'11px', color: activeView==='catalog' ? '#fff' : '#8b90b8', background: activeView==='catalog' ? 'rgba(255,255,255,0.1)' : 'none', border:'none', cursor:'pointer', padding:'5px 9px', borderRadius:'6px' }}>App Catalog</button>
          <button title="Contact the AI Lab" style={{ fontSize:'11px', background:GOLD, color:NAVY, border:'none', borderRadius:'6px', padding:'6px 12px', cursor:'pointer', fontWeight:700, fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", letterSpacing:'0.04em', textTransform:'uppercase', marginLeft:'4px' }}>Contact Lab</button>
        </div>
      </nav>

      {/* Subnav */}
      <div style={{ background:CRIMSON, display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'0 16px', height:'34px', borderBottom:`2px solid ${GOLD}`, flexShrink:0 }}>
        <div style={{ fontSize:'10px', background:GOLD, color:NAVY, padding:'3px 9px', borderRadius:'20px', fontWeight:700, letterSpacing:'0.04em', fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", textTransform:'uppercase' }}>July 2026 Admissions Open</div>
      </div>

      {/* Featured Apps Marquee */}
      <div className="featured-marquee" style={{ background:'#fff', borderBottom:'0.5px solid #e2e0d8', padding:'0', flexShrink:0, overflow:'hidden', height:'56px', display:'flex', alignItems:'center' }}>
        <motion.div
          style={{ display:'flex', gap:'12px', paddingX:'16px' }}
          animate={{ x: [0, -2000] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {["biochemai", "dictation-app", "markai", "omniextract", "playgrow", "techbridge-ai-blueprint", "glucose"].map((slug) => {
            const tool = TOOLS.find(t => t.slug === slug);
            if (!tool) return null;
            const Icon = TOOL_ICONS[slug] || Sparkles;
            return (
              <motion.div key={slug} whileHover={{ scale: 1.05 }} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', background:'#f7f5f0', borderRadius:'8px', cursor:'pointer', border:'1px solid #e2e0d8', flexShrink:0, minWidth:'fit-content' }} onClick={() => setSelectedTool(tool)}>
                <Icon style={{ width:'18px', height:'18px', color:CRIMSON, flexShrink:0 }} />
                <span style={{ fontSize:'12px', fontWeight:500, color:'#1a1f3c', whiteSpace:'nowrap' }}>{tool.title}</span>
              </motion.div>
            );
          })}
          {["biochemai", "dictation-app", "markai", "omniextract", "playgrow", "techbridge-ai-blueprint", "glucose"].map((slug) => {
            const tool = TOOLS.find(t => t.slug === slug);
            if (!tool) return null;
            const Icon = TOOL_ICONS[slug] || Sparkles;
            return (
              <motion.div key={`${slug}-2`} whileHover={{ scale: 1.05 }} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', background:'#f7f5f0', borderRadius:'8px', cursor:'pointer', border:'1px solid #e2e0d8', flexShrink:0, minWidth:'fit-content' }} onClick={() => setSelectedTool(tool)}>
                <Icon style={{ width:'18px', height:'18px', color:CRIMSON, flexShrink:0 }} />
                <span style={{ fontSize:'12px', fontWeight:500, color:'#1a1f3c', whiteSpace:'nowrap' }}>{tool.title}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Main Content */}
      {activeView === "catalog" ? (
        <div style={{ flex:1, overflowY:'auto' }}>
          <AppCatalog />
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>

          {/* Hero Search */}
          <div style={{ background:'#fff', padding:'20px 16px', borderBottom:'0.5px solid #e2e0d8', flexShrink:0 }}>
            <div style={{ maxWidth:'600px', margin:'0 auto' }}>
              <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
                <Search style={{ position:'absolute', left:'12px', width:'16px', height:'16px', color:'#64748b', flexShrink:0, pointerEvents:'none' }} />
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search for a tool or describe what you need…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width:'100%', paddingLeft:'36px', paddingRight:'16px', paddingTop:'12px', paddingBottom:'12px', fontSize:'13px', color:'#0f172a', border:'1px solid #c3c9d9', borderRadius:'8px', outline:'none', fontFamily:'inherit', background:'#fff' }}
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ background:'#fff', padding:'10px 16px', borderBottom:'0.5px solid #e2e0d8', flexShrink:0, overflowX:'auto' }}>
            <div style={{ display:'flex', gap:'8px', minWidth:'min-content', justifyContent:'center', flexWrap:'wrap' }}>
              {CAT_LIST.map((cat) => (
                <button
                  className="category-filter-btn"
                  title={`Filter tools by ${cat} category`}
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding:'6px 12px',
                    fontSize:'12px',
                    fontWeight:500,
                    border:'1px solid',
                    borderRadius:'6px',
                    cursor:'pointer',
                    background: activeCategory===cat ? CRIMSON : '#fff',
                    color: activeCategory===cat ? '#fff' : '#5a5d78',
                    borderColor: activeCategory===cat ? CRIMSON : '#d1d5e0',
                    textTransform:'capitalize',
                    whiteSpace:'nowrap',
                    transition:'all 0.2s',
                  }}
                >
                  {cat === 'All' ? `All (${countsByCat['All']})` : `${cat} (${countsByCat[cat] || 0})`}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div style={{ flex:1, overflowY:'auto', padding:'24px 16px', background:'#f7f5f0' }}>
            <div style={{ maxWidth:'1200px', margin:'0 auto' }}>

              {/* Featured Section */}
              {search === "" && activeCategory === "All" && (
                <section style={{ marginBottom:'40px' }}>
                  <h2 style={{ fontSize:'18px', fontWeight:700, color:'#1a1f3c', marginBottom:'16px', letterSpacing:'-0.5px' }}>Featured Tools</h2>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'12px' }}>
                    {["biochemai", "dictation-app", "markai", "omniextract", "playgrow", "techbridge-ai-blueprint", "glucose", "typing-and-mathematics-tutorial", "typing-tutorial"].map((slug) => {
                      const tool = TOOLS.find(t => t.slug === slug);
                      if (!tool) return null;
                      return <FeaturedCard key={slug} tool={tool} onOpen={() => setSelectedTool(tool)} />;
                    })}
                  </div>
                </section>
              )}

              {/* All Tools / Filtered Results */}
              <section>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                  <h2 style={{ fontSize:'18px', fontWeight:700, color:'#1a1f3c', letterSpacing:'-0.5px' }}>
                    {activeCategory === "All" ? "All Tools" : activeCategory}
                  </h2>
                  <span style={{ fontSize:'13px', color:'#9396a8' }}>{filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}</span>
                </div>

                {filteredTools.length === 0 ? (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 0', color:'#9396a8' }}>
                    <Search style={{ width:'40px', height:'40px', opacity:0.2, marginBottom:'12px' }} />
                    <p style={{ fontSize:'14px' }}>No matches found</p>
                    <button title="Clear search and category filters" onClick={() => { setSearch(""); setActiveCategory("All"); }} style={{ marginTop:'8px', fontSize:'12px', color:CRIMSON, background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>Clear filters</button>
                  </div>
                ) : (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1px', background:'#e2e0d8', borderRadius:'4px', padding:'1px', overflow:'hidden' }}>
                      {filteredTools.slice(0, visibleCount).map((tool) => (
                        <ToolCard key={tool.slug} tool={tool} index={TOOLS.findIndex(t => t.slug === tool.slug)} viewMode="grid" onOpen={() => setSelectedTool(tool)} />
                      ))}
                    </div>

                    {visibleCount < filteredTools.length && (
                      <div style={{ display:'flex', justifyContent:'center', marginTop:'24px' }}>
                        <button
                          title="Load more tools"
                          onClick={() => setVisibleCount(v => v + 24)}
                          style={{
                            padding:'10px 20px',
                            fontSize:'13px',
                            fontWeight:600,
                            background: CRIMSON,
                            color:'#fff',
                            border:'none',
                            borderRadius:'6px',
                            cursor:'pointer',
                            fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif",
                            letterSpacing:'0.04em',
                            textTransform:'uppercase',
                          }}
                        >
                          Load more ({filteredTools.length - visibleCount} remaining)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>

          {/* Status Bar */}
          <footer style={{ background:NAVY, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 16px', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'10px', color:'#4ade80' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4ade80' }} />
              All nodes operational · Last sync {new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}
            </div>
            <div style={{ display:'flex', gap:'14px', alignItems:'center', fontSize:'10px', color:'#6b70a0' }}>
              <span>Ver 2.4.9 Stable</span>
              <a href="https://ai-tools.techbridge.edu.gh/blueprint/" target="_blank" rel="noopener noreferrer" style={{ color:GOLD, cursor:'pointer', textDecoration:'none', fontWeight:500 }}>
                <ExternalLink style={{ width:'11px', height:'11px', verticalAlign:'-1px', marginRight:'3px' }} />AI Blueprint
              </a>
              <button title="Sign out of your account" onClick={logout} style={{ background:'none', border:'none', color:'#6b70a0', cursor:'pointer', fontSize:'10px' }}>Sign out</button>
            </div>
          </footer>

          <AnimatePresence>
            {selectedTool && <DetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function FeaturedCard({ tool, onOpen }: { tool: Tool, onOpen: () => void }) {
  const ToolSpecificIcon = TOOL_ICONS[tool.slug] || CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.icon || Cpu;
  const CRIMSON = '#8b1a1a';
  const GOLD = '#f5c518';

  const iconBgs: Record<string, string> = {
    "AI & ML": '#eff2ff', Academic: '#f0fdf4', Creative: '#fff1f2',
    "Dev Tools": '#fff8e1', Business: '#fef2f2', Admin: '#f1f5f9', Games: '#ecfeff',
  };
  const iconColors: Record<string, string> = {
    "AI & ML": '#3730a3', Academic: '#166534', Creative: '#be185d',
    "Dev Tools": '#b45309', Business: '#b91c1c', Admin: '#334155', Games: '#155e75',
  };

  return (
    <div onClick={onOpen} style={{
      background: '#fff',
      padding: '20px',
      cursor: 'pointer',
      position: 'relative',
      borderLeft: `4px solid ${CRIMSON}`,
      transition: 'all 0.2s',
      display:'flex',
      gap:'16px',
      alignItems:'flex-start',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#fef4f4';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,26,26,0.13)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Featured Badge */}
      <div style={{ position:'absolute', top:'12px', right:'12px', background:GOLD, color:'#1a1f3c', fontSize:'11px', fontWeight:700, padding:'3px 8px', borderRadius:'4px', letterSpacing:'0.03em', textTransform:'uppercase' }}>
        Featured
      </div>

      {/* Icon */}
      <div style={{ width:'60px', height:'60px', borderRadius:'12px', background: iconBgs[tool.cat] || '#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <ToolSpecificIcon style={{ width:'28px', height:'28px', color: iconColors[tool.cat] || '#334155' }} />
      </div>

      {/* Content */}
      <div style={{ flex:1, minWidth:0, paddingRight:'60px' }}>
        <div style={{ fontSize:'15px', fontWeight:600, color:'#1a1f3c', marginBottom:'6px', lineHeight:1.3 }}>{tool.title}</div>
        <div style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.5, marginBottom:'12px' }}>{tool.desc}</div>
        {isDeployed(tool.slug) ? (
          <button title={`Launch ${tool.title}`} onClick={(e) => { e.stopPropagation(); window.open(getAppUrl(tool.slug), '_blank'); }}
            style={{ fontSize:'11px', fontWeight:600, background:CRIMSON, color:'#fff', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", letterSpacing:'0.04em', textTransform:'uppercase' }}>
            Launch
          </button>
        ) : (
          <button title={`${tool.title} — coming soon`} disabled onClick={(e) => e.stopPropagation()}
            style={{ fontSize:'11px', fontWeight:600, background:'#e2e8f0', color:'#64748b', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'default', fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", letterSpacing:'0.04em', textTransform:'uppercase' }}>
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
}

function ToolCard({ tool, index, viewMode, onOpen }: { tool: Tool, index: number, viewMode: "grid" | "list", onOpen: () => void }) {
  const CatIcon = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.icon || Cpu;
  const ToolSpecificIcon = TOOL_ICONS[tool.slug] || CatIcon;
  const accentColor = CATEGORIES[tool.cat as keyof typeof CATEGORIES]?.accentColor || "#2563eb";
  const CRIMSON = '#8b1a1a';

  const iconBgs: Record<string, string> = {
    "AI & ML": '#eff2ff', Academic: '#f0fdf4', Creative: '#fff1f2',
    "Dev Tools": '#fff8e1', Business: '#fef2f2', Admin: '#f1f5f9', Games: '#ecfeff',
  };
  const iconColors: Record<string, string> = {
    "AI & ML": '#3730a3', Academic: '#166534', Creative: '#be185d',
    "Dev Tools": '#b45309', Business: '#b91c1c', Admin: '#334155', Games: '#155e75',
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    padding: '18px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.15s, box-shadow 0.15s',
    borderLeft: `4px solid ${accentColor}`,
  };

  return (
    <div onClick={onOpen} style={cardStyle}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#fef4f4';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,26,26,0.13)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#fff';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Icon */}
      <div style={{ width:'40px', height:'40px', borderRadius:'10px', background: iconBgs[tool.cat] || '#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px' }}>
        <ToolSpecificIcon style={{ width:'20px', height:'20px', color: iconColors[tool.cat] || '#334155' }} />
      </div>

      {/* Title + desc */}
      <div style={{ fontSize:'15px', fontWeight:600, color:'#1a1f3c', marginBottom:'6px', lineHeight:1.3 }}>{tool.title}</div>
      <div style={{ fontSize:'12px', color:'#6b7280', lineHeight:1.5, marginBottom:'12px' }}>{tool.desc}</div>

      {/* Launch Button */}
      {isDeployed(tool.slug) ? (
        <button title={`Launch ${tool.title}`} onClick={(e) => { e.stopPropagation(); window.open(getAppUrl(tool.slug), '_blank'); }}
          style={{ fontSize:'11px', fontWeight:600, background:CRIMSON, color:'#fff', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'pointer', fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", letterSpacing:'0.04em', textTransform:'uppercase', width:'100%' }}>
          Launch
        </button>
      ) : (
        <button title={`${tool.title} — coming soon`} disabled onClick={(e) => e.stopPropagation()}
          style={{ fontSize:'11px', fontWeight:600, background:'#e2e8f0', color:'#64748b', border:'none', borderRadius:'6px', padding:'6px 14px', cursor:'default', fontFamily:"'Barlow Condensed','Arial Narrow',sans-serif", letterSpacing:'0.04em', textTransform:'uppercase', width:'100%' }}>
          Coming Soon
        </button>
      )}
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
              {isDeployed(tool.slug) ? (
              <a
                href={getAppUrl(tool.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-launch flex items-center justify-center gap-2 w-full py-3 text-sm"
              >
                Launch App <ExternalLink className="w-4 h-4" />
              </a>
              ) : (
              <span className="flex items-center justify-center gap-2 w-full py-3 text-sm bg-slate-200 text-slate-500 rounded-xl font-bold cursor-default select-none">
                Coming Soon
              </span>
              )}
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
