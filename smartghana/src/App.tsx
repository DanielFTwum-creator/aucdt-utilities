/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import AllianceBrief from './AllianceBrief';
import UserGuide from './UserGuide';
import AdminGuide from './AdminGuide';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import {
  ShieldCheck,
  Zap,
  Users,
  Globe,
  TrendingUp,
  Handshake,
  ArrowRight,
  Scale,
  Database,
  Building,
  Download,
  CheckCircle2,
  Lock,
  Cpu,
  Search,
  MinusCircle,
  Sparkles,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Data Types ---

interface SynergyPoint {
  dimension: string;
  smartbridge: string;
  techbridge: string;
  outcome: string;
  icon: React.ReactNode;
}

// --- Mock Data (Pivot: Strategic Alliance) ---

const SYNERGY_DATA: SynergyPoint[] = [
  {
    dimension: "Operational Delivery",
    smartbridge: "Skill Wallet Platform (100K+ concurrent learners)",
    techbridge: "Local 15k+ Daily Ops",
    outcome: "Immediate 8-Week Launch",
    icon: <Zap className="w-5 h-5" />
  },
  {
    dimension: "User Experience",
    smartbridge: "Experiential Learning Ecosystem (2M+ learners globally)",
    techbridge: "Ghanaian Context & Support",
    outcome: "High Retention & Relevance",
    icon: <Users className="w-5 h-5" />
  },
  {
    dimension: "Data & Hosting",
    smartbridge: "Multi-institution Cloud Platform (3,000+ institutions)",
    techbridge: "Local Sovereignty & GDPR",
    outcome: "Compliant & Low Latency",
    icon: <Database className="w-5 h-5" />
  }
];

const ALLIANCE_VALUES = [
  { name: 'Global Tech Reach', value: 85, fill: '#8C1A2E' },
  { name: 'Local Operational Depth', value: 95, fill: '#C49A22' },
  { name: 'Government Compliance', value: 100, fill: '#1A0A06' },
];

const COLLABORATIVE_FLOW = [
  { month: 'Start', efficiency: 40 },
  { month: 'Month 2', efficiency: 65 },
  { month: 'Month 4', efficiency: 85 },
  { month: 'Launch', efficiency: 100 },
];

const COST_BREAKDOWN_DATA = [
  { component: "Platform Licenses", international: 450, alliance: 320, note: "Alliance volume discount" },
  { component: "Content Localization", international: 180, alliance: 65, note: "Techbridge local assets" },
  { component: "Technical Support", international: 120, alliance: 45, note: "On-ground local team" },
  { component: "Contingency/Risk", international: 90, alliance: 25, note: "Local operational knowledge" },
];

const CURRICULUM_GAP_DATA = [
  { factor: "Curriculum Focus", standard: "Generic Tech Generalist", alliance: "AI-Native Creative Specialist", note: "Matches Ghana Gov industrial policy" },
  { factor: "Market Alignment", standard: "Global SaaS Patterns", alliance: "West African Sectors (Fintech, Media, Arts)", note: "Immediate local employability" },
  { factor: "Instructional Language", standard: "Standard Academic English", alliance: "Multi-modal & Local Context Support", note: "Higher accessibility & retention" },
  { factor: "Project Focus", standard: "US/EU Case Studies", alliance: "Ghanaian Enterprise & SME Prototyping", note: "Direct domestic impact" },
];

const PROGRAMMES = [
  { 
    title: "Product Design & Entrepreneurship", 
    desc: "Merging UI/UX with business logic and AI-native product development workflows.",
    icon: <Database className="w-5 h-5 text-gold" />,
    color: "#8C1A2E"
  },
  { 
    title: "Fashion Design Technology", 
    desc: "Digital textile engineering, 3D garment visualization, and supply chain tech.",
    icon: <Users className="w-5 h-5 text-gold" />,
    color: "#C49A22"
  },
  { 
    title: "Jewellery Design Technology", 
    desc: "High-precision CAD modelling for the gold and artisan sector in West Africa.",
    icon: <Cpu className="w-5 h-5 text-gold" />,
    color: "#1A0A06"
  },
  { 
    title: "Digital Media & Communications Design", 
    desc: "Generative video, storytelling at scale, and AI-driven brand architecture.",
    icon: <Globe className="w-5 h-5 text-gold" />,
    color: "#2A1A1A"
  }
];

const COLLABORATION_STRATEGY = [
  {
    title: "Joint Curriculum Engineering",
    detail: "Co-developing AI-native modules that merge SmartBridge’s global algorithmic engine with Techbridge’s industrial design frameworks for Fashion, Jewellery, and Product Engineering."
  },
  {
    title: "Hybrid Delivery Logistics",
    detail: "Utilizing Techbridge's physical campuses as 'Sovereign Access Nodes,' providing high-speed GPU processing and hands-on industrial labs that complement digital learning."
  },
  {
    title: "Sovereign Data Custody",
    detail: "Implementing a 100% Ghanaian-hosted data tier for the 1M+ students, ensuring strict adherence to the Ghana Data Protection Act and PII sovereignty."
  },
  {
    title: "National Policy Synchronization",
    detail: "Directly linking programme KPIs to Ministry of Education digital literacy targets and the Ministry of Trade’s strategy for sectoral export and SME growth."
  }
];

const ECONOMIC_IMPACT_METRICS = [
  {
    label: "Direct GVA Contribution",
    value: "$2.4B",
    growth: "+14%",
    desc: "Projected Gross Value Added to the digital services sector by 2030 through specialized exports."
  },
  {
    label: "Import Substitution",
    value: "42%",
    growth: "-28%",
    desc: "Reduction in foreign software dependency by building local alternatives for Ghanaian SMEs."
  },
  {
    label: "Sovereign IP Ownership",
    value: "150+",
    growth: "New",
    desc: "Local intellectual property registrations in CAD/CAM and AI-native vocational tools."
  }
];

const SECTORAL_DYNAMICS = [
  { industry: "Jewellery", impact: "High", tech: "3D Rendering / Generative Design", forecast: "$450M Export Potential" },
  { industry: "Fashion", impact: "Massive", tech: "Smart Textiles / Digital Supply Chain", forecast: "120k New Artisanal Jobs" },
  { industry: "Agri-Tech", impact: "Foundation", tech: "IoT / Predictive Analytics", forecast: "30% Yield Optimization" }
];

const GVA_TREND_DATA = [
  { year: '2024', gva: 0.8, projection: 0.8 },
  { year: '2025', gva: 1.2, projection: 1.4 },
  { year: '2026', gva: 1.8, projection: 2.1 },
  { year: '2027', gva: 2.5, projection: 2.9 },
  { year: '2028', gva: 3.4, projection: 3.8 },
  { year: '2029', gva: 4.6, projection: 5.1 },
  { year: '2030', gva: 6.2, projection: 7.0 },
];

const SECTOR_CONTRIBUTION_CHART = [
  { sector: 'Digital Services', value: 35, growth: 12 },
  { sector: 'Vocational Export', value: 25, growth: 18 },
  { sector: 'Local SME', value: 20, growth: 15 },
  { sector: 'Import Sub.', value: 20, growth: 8 },
];

const JOB_CREATION_TRENDS = [
  { year: '2024', creative: 5000, technical: 8000 },
  { year: '2025', creative: 12000, technical: 18000 },
  { year: '2026', creative: 28000, technical: 45000 },
  { year: '2027', creative: 65000, technical: 95000 },
  { year: '2028', creative: 140000, technical: 210000 },
  { year: '2029', creative: 250000, technical: 380000 },
  { year: '2030', creative: 400000, technical: 600000 },
];

const SIX_R_MODEL = [
  { 
    r: "Review", 
    action: "Demand Mapping & Audit", 
    detail: "Auditing 1,000+ local SMEs and government industrial sectors to map required AI-native competencies for the first 100,000 coders.",
    outcome: "Harmonized content with West African market signals.",
    icon: <Search className="w-5 h-5" />
  },
  { 
    r: "Reduce", 
    action: "Module Pruning & Compression", 
    detail: "Aggressive removal of legacy theoretical modules and expensive western proprietary software dependencies in favor of AI-augmented open-source frameworks.",
    outcome: "Lowered entry barrier to tech mastery by 45%.",
    icon: <MinusCircle className="w-5 h-5" />
  },
  { 
    r: "Refine", 
    action: "Vertical Specialization", 
    detail: "Integrating CAD/CAM Digital Twin technology and high-precision tech stacks into the coding curriculum for Jewellery, Fashion, and Multimedia sectors.",
    outcome: "Students capable of export-grade industrial execution.",
    icon: <Sparkles className="w-5 h-5" />
  },
  { 
    r: "Reuse", 
    action: "Node Level Activation", 
    detail: "Converting Techbridge's 8 regional physical clusters into 'Sovereign Access Nodes' and decentralized GPU rendering farms for the programme.",
    outcome: "Decentralized high-bandwidth lab access for developers.",
    icon: <RefreshCw className="w-5 h-5" />
  },
  { 
    r: "Regenerate", 
    action: "Sovereign IP Genesis", 
    detail: "Establishing 'Sovereign Tooling' labs where students build the local enterprise tools and ERPs they use, moving from 'users' to 'architects'.",
    outcome: "New tier of Domestic IP ownership within Ghana.",
    icon: <Zap className="w-5 h-5" />
  },
  { 
    r: "Reinforce", 
    action: "Policy Synchronization", 
    detail: "Embedding Ministry monitoring dashboards into the platform for automated certification alignment with national vocational standards.",
    outcome: "Every 'Coder' becomes a certified industrial asset.",
    icon: <ShieldCheck className="w-5 h-5" />
  }
];

// --- Components ---

const SMARTBRIDGE_LOGO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpICViUsnSXDavjLeZOoBdv2OUsXlAInOy9w&s";
const TECHBRIDGE_LOGO = "https://techbridge.edu.gh/static/TUC_LOGO_1.png";

const Watermark = () => (
  <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[-1] overflow-hidden select-none">
    <div className="relative w-full h-full flex items-center justify-center">
      <img 
        src={TECHBRIDGE_LOGO} 
        alt=""
        className="w-[100%] max-w-none opacity-[0.02] grayscale brightness-110"
        aria-hidden="true"
        referrerPolicy="no-referrer"
      />
    </div>
  </div>
);

const AllianceEfficiencyTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-[#E5E1D5]">
          <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-gold text-left">Cost Component</th>
          <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-[#AAA] text-right">International Direct</th>
          <th className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-crimson text-right">Alliance Model</th>
          <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-espresso text-left pl-6">Efficiency Driver</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#F0EEE5]">
        {COST_BREAKDOWN_DATA.map((row, i) => (
          <tr key={i} className="group hover:bg-white/50 transition-colors">
            <td className="py-4 text-xs font-bold text-espresso">{row.component}</td>
            <td className="py-4 px-4 text-xs font-medium text-[#AAA] text-right">GHS {row.international}M</td>
            <td className="py-4 px-4 text-xs font-bold text-crimson text-right">GHS {row.alliance}M</td>
            <td className="py-4 text-[10px] text-[#777] italic pl-6">{row.note}</td>
          </tr>
        ))}
        <tr className="bg-espresso text-white">
          <td className="py-4 pl-4 text-xs font-bold uppercase tracking-widest">Total Estimated Value</td>
          <td className="py-4 px-4 text-xs font-bold text-right text-white/50">GHS 840M</td>
          <td className="py-4 px-4 text-xs font-black text-right text-gold">GHS 455M</td>
          <td className="py-4 pl-6 text-[10px] font-bold text-gold uppercase tracking-widest">~45% Cost Efficiency</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className} group flex items-center justify-center`}>
    <img 
      src={TECHBRIDGE_LOGO} 
      alt="Techbridge University College Logo"
      className="max-w-full max-h-full object-contain"
      referrerPolicy="no-referrer"
    />
    {/* Hover glow effect */}
    <div className="absolute inset-0 bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
  </div>
);

const Navbar = () => (
  <nav className="border-b border-[#E5E1D5] bg-parchment/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <Logo className="w-14 h-14" />
        <div className="flex flex-col">
          <h1 className="text-sm font-black tracking-[0.05em] text-espresso uppercase leading-none mb-1">Techbridge</h1>
          <p className="text-[9px] font-bold text-gold tracking-widest uppercase">University College</p>
        </div>
      </div>
      
      <div className="w-px h-10 bg-[#E5E1D5] mx-2 hidden sm:block" />
      
      <div className="hidden sm:flex items-center gap-3">
        <div className="w-7 h-7 flex items-center justify-center opacity-40">
          <img src={SMARTBRIDGE_LOGO} alt="SmartBridge Logo" className="w-full h-full object-contain grayscale" referrerPolicy="no-referrer" />
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black tracking-widest text-[#AAA] uppercase">Strategic Alliance</span>
          <span className="text-[7px] font-bold text-[#CCC] uppercase">SmartBridge</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="hidden lg:flex gap-8 text-[9px] font-black uppercase tracking-widest text-[#555]">
        <a href="#synergy" className="hover:text-crimson transition-colors">Synergy</a>
        <a href="#model" className="hover:text-crimson transition-colors">Model</a>
        <a href="#sovereignty" className="hover:text-crimson transition-colors">Compliance</a>
        <a href="#delivery" className="hover:text-crimson transition-colors">Delivery</a>
        <a href="#economic" className="hover:text-crimson transition-colors">Economic Impact</a>
      </div>
      <button
        onClick={() => window.open('?brief=1&print=1', '_blank')}
        className="text-[9px] font-bold uppercase tracking-widest px-4 py-2 border border-crimson text-crimson rounded-sm hover:bg-crimson hover:text-white transition-all flex items-center gap-2"
      >
        <Download className="w-3 h-3" />
        Alliance Brief
      </button>
    </div>
  </nav>
);

const SectionEyebrow = ({ text }: { text: string }) => (
  <div className="gold-eyebrow">
    <span className="multiplier-dot" />
    {text}
  </div>
);

const SynergyGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {SYNERGY_DATA.map((point, idx) => (
      <motion.div 
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        className="content-card group hover:border-crimson transition-all duration-500"
      >
        <div className="bg-espresso w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-gold">
          {point.icon}
        </div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-espresso mb-6">{point.dimension}</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-[#AAA] rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-bold text-[#AAA] uppercase tracking-tighter">SmartBridge</span>
              <p className="text-xs font-medium text-[#555] mt-0.5">{point.smartbridge}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-crimson rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <span className="text-[9px] font-bold text-crimson uppercase tracking-tighter">Techbridge Local</span>
              <p className="text-xs font-medium text-espresso mt-0.5">{point.techbridge}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-[#E5E1D5]">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest">
            <CheckCircle2 className="w-3 h-3" />
            Outcome: {point.outcome}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('brief') === '1') {
    return <AllianceBrief />;
  }

  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isAdminGuideOpen, setIsAdminGuideOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-parchment selection:bg-crimson selection:text-white relative">
      <Watermark />
      <Navbar />

      {/* Partnership Strip */}
      <div className="bg-espresso text-white py-2 overflow-hidden whitespace-nowrap border-y border-gold/20">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex gap-16 text-[9px] font-bold tracking-[0.2em] uppercase items-center"
        >
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-gold">✦</span>
              <span>Unified Delivery Model</span>
              <span className="text-crimson">✦</span>
              <span>SmartBridge India × SmartBridge Ghana × Techbridge</span>
              <span className="text-gold">✦</span>
              <span>Skill Wallet Platform · 2M+ Learners</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* SmartBridge Global Tech Partners */}
      <div className="bg-white/50 border-b border-[#E5E1D5] py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#777] mb-4">SmartBridge Global Technology Ecosystem Partners</div>
          <div className="flex flex-wrap gap-3">
            {['IBM', 'Google', 'Salesforce', 'ServiceNow', 'AWS', 'MongoDB', 'Zscaler', 'Katalon', 'Tableau', 'Zoho'].map((partner, i) => (
              <span key={i} className="px-3 py-2 bg-white border border-[#E5E1D5] rounded-sm text-[8px] font-bold text-espresso uppercase tracking-wider">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Alliance Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-center">
          <div className="lg:col-span-7">
            <SectionEyebrow text="One Million Coders Programme: Strategic Synthesis" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-espresso leading-[1.05] mb-10">
              The Synergy of <span className="heading-italic">Global Tech</span> and <span className="heading-italic">Local Execution.</span>
            </h2>
            <p className="text-lg text-[#555] leading-relaxed max-w-xl mb-12">
              Techbridge partners with SmartBridge — implemented in Ghana through SmartBridge Ghana,
              powered by SmartBridge India's Skill Wallet platform — to deliver a comprehensive, Ghana-first solution.
              We combine world-class learning platforms with locally-verified operations, physical campuses,
              and strict data sovereignty compliance.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => document.getElementById('review-model')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-crimson text-white px-10 py-4 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3"
              >
                Review Partnership Model <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4 py-4 px-6 border border-[#E5E1D5] rounded-sm bg-white/40">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-espresso">Sovereignty Guaranteed</div>
                  <div className="text-[9px] text-[#777]">100% PII retention in Ghana</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="stats-card bg-[#1A0A06] border-gold p-0 overflow-hidden relative group h-[480px]">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                autoPlay 
                muted 
                loop 
                playsInline
              >
                <source src="https://techbridge.edu.gh/static/campus_tour.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Opacity Light Overlay */}
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              
              <div className="absolute top-8 left-8 z-10">
                <div className="gold-eyebrow mb-2">
                  <span className="multiplier-dot" />
                  Campus Tour
                </div>
                <h4 className="text-2xl font-bold font-serif italic text-white">Efficiency in <span className="text-gold">Motion.</span></h4>
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-10">
                <div className="flex justify-between items-end">
                  <div className="max-w-[200px]">
                    <div className="text-[9px] font-black uppercase tracking-widest text-gold mb-1">Oyibi Tech Hub</div>
                    <p className="text-[10px] text-white/50 leading-tight uppercase font-bold tracking-tighter">
                      15,000+ Students actively engaged in industrial technical mastery.
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <Zap className="w-5 h-5 text-gold" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-espresso to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Synergy Matrix */}
        <section id="synergy" className="mb-32">
          <SectionEyebrow text="Partner Synergy Matrix" />
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h3 className="text-3xl font-bold text-espresso max-w-xl">
              Unifying Global Innovation with Local Operational Trust.
            </h3>
            <p className="text-[11px] font-bold text-crimson italic">
              "Best-in-class tech meets deep local expertise."
            </p>
          </div>
          <SynergyGrid />
        </section>

        {/* The Creative Curriculum Edge (4 Programmes) */}
        <section id="programmes" className="mb-40 pt-20 border-t border-espresso/5">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-20 gap-12">
            <div className="max-w-2xl">
              <SectionEyebrow text="Pillars of Excellence" />
              <h3 className="text-5xl font-black text-espresso leading-tight tracking-tight mt-6">
                4 Specialized <span className="text-crimson italic font-serif serif-italic">Degrees</span> for the Digital Economy.
              </h3>
            </div>
            <p className="text-sm text-[#777] max-w-xs leading-relaxed lg:text-right pt-2 font-medium">
              Curricula engineered for West African industrial policy, merging high-tech toolsets with localized creative entrepreneurship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {PROGRAMMES.map((prog, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative flex flex-col md:flex-row gap-8 p-1 w-full"
              >
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl flex items-center justify-center shadow-2xl shadow-espresso/5 border border-white/50 transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundColor: `${prog.color}08`, borderLeft: `4px solid ${prog.color}` }}
                >
                  <div className="p-4 bg-white rounded-full shadow-lg">
                    {prog.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-espresso mb-3 flex items-center gap-3">
                    {prog.title}
                    <div className="h-px flex-grow bg-espresso/5 group-hover:bg-crimson/20 transition-colors" />
                  </h4>
                  <p className="text-sm leading-relaxed text-[#555] mb-6">
                    {prog.desc}
                  </p>
                  <div className="flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#AAA]">Duration: 4 Years</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-crimson">Degree Awarded</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gap Analysis */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <SectionEyebrow text="Strategic Gap Analysis" />
              <h3 className="text-3xl font-bold text-espresso mb-8">The Localization Dividend.</h3>
              <p className="text-sm text-[#555] leading-relaxed mb-8">
                Direct international procurement creates a "Curriculum Gap"—where technical skills fail to translate into local economic context. Our alliance bridge this gap through localized creative tracks.
              </p>
              <div className="p-6 bg-gold/5 rounded-md border border-gold/10">
                <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Key Metric</div>
                <div className="text-2xl font-serif italic text-espresso">~67% Higher Relevancy</div>
                <p className="text-[10px] text-[#777] mt-2">Measured against graduate career alignment in Ghana's emerging digital sectors.</p>
              </div>
            </div>
            <div className="lg:col-span-8 overflow-hidden rounded-tech-lg border border-[#E5E1D5] bg-white group shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-espresso text-white">
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-gold">Gap Factor</th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-white/50">Standard Intl. Model</th>
                    <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-white">The Alliance Model</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] divide-y divide-[#E5E1D5]">
                  {CURRICULUM_GAP_DATA.map((row, i) => (
                    <tr key={i} className="hover:bg-parchment/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-espresso border-r border-[#E5E1D5]">{row.factor}</td>
                      <td className="px-6 py-4 text-[#AAA] border-r border-[#E5E1D5]">{row.standard}</td>
                      <td className="px-6 py-4 font-bold text-crimson italic">{row.alliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Partnership Model: The 6R Framework */}
        <section id="model" className="mb-40 pt-20 border-t border-[#E5E1D5]">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
            <div className="max-w-3xl">
              <SectionEyebrow text="Partnership Model: The 6R Framework" />
              <h3 id="review-model" className="text-4xl md:text-5xl font-black text-espresso leading-tight mt-6">
                Redefining the <span className="text-gold italic font-serif">Process</span> of Technical Delivery.
              </h3>
            </div>
            <p className="text-sm text-[#777] max-w-xs leading-relaxed lg:text-right font-medium">
              A systematic methodology to ensure global innovation respects local institutional trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
            {SIX_R_MODEL.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group pr-4"
              >
                <div className="absolute -top-6 -left-6 text-[80px] font-black text-espresso/[0.03] select-none pointer-events-none group-hover:text-gold/5 transition-colors duration-700">
                  0{i + 1}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-parchment rounded-xl border border-[#E5E1D5] flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-crimson group-hover:translate-x-2 transition-transform duration-500">{step.r}</h4>
                    <h5 className="text-lg font-bold text-espresso">{step.action}</h5>
                  </div>
                </div>

                <p className="text-sm text-[#666] leading-relaxed mb-6 pl-1 pr-6">
                  {step.detail}
                </p>

                <div className="p-4 bg-white/50 rounded-lg border border-dashed border-[#E5E1D5] group-hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#AAA] mb-1">
                    <CheckCircle2 className="w-3 h-3 text-gold" />
                    Projected Outcome
                  </div>
                  <p className="text-[11px] font-bold text-espresso italic">
                    "{step.outcome}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Review Partnership Model */}
        <section id="review-partnership-model" className="mb-40 pt-20 border-t border-[#E5E1D5]">
          <div className="max-w-4xl mx-auto">
            <SectionEyebrow text="Alliance Strategic Strategy" />
            <h2 className="text-4xl md:text-5xl font-black text-espresso mt-6 mb-12 leading-tight">
              Review Partnership Model
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-crimson mb-8">One Million Coders Deployment Framework</h3>
                <p className="text-sm text-[#555] mb-8 leading-relaxed">
                  The Techbridge–SmartBridge Alliance brings together three complementary entities: SmartBridge India (providing the Skill Wallet platform and global learning engine), SmartBridge Ghana (managing in-country implementation and government liaison), and Techbridge (supplying campus infrastructure and sovereign data stewardship). This tripartite approach to the <span className="font-bold text-espresso underline decoration-gold/50">One Million Coders Programme</span> ensures every 'R' in our strategic framework translates into actionable deployment steps—from precise demand mapping to the mass regeneration of local intellectual property.
                </p>
                <ul className="space-y-6">
                  {COLLABORATION_STRATEGY.map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4 group"
                    >
                      <div className="mt-1.5 w-2 h-2 bg-gold rounded-full flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <div>
                        <span className="text-sm font-bold text-espresso block mb-1">{item.title}</span>
                        <p className="text-xs text-[#777] leading-relaxed italic">{item.detail}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-10 rounded-2xl border border-[#E5E1D5] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-10 relative z-10">4 Specialized Alliance Programmes</h3>
                <ul className="space-y-6 relative z-10">
                  {PROGRAMMES.map((prog, i) => (
                    <li key={i} className="flex items-center gap-5 group">
                      <div 
                        className="w-10 h-10 rounded uppercase flex items-center justify-center text-white shadow-md transition-transform group-hover:rotate-12"
                        style={{ backgroundColor: prog.color }}
                      >
                        {prog.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-espresso">{prog.title}</span>
                        <span className="text-[8px] font-bold text-gold uppercase tracking-[0.2em] mt-0.5">Enrolment Open</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-12 pt-8 border-t border-[#E5E1D5]">
                  <p className="text-[10px] text-[#888] leading-relaxed">
                    Each track merges SmartBridge's Skill Wallet platform capabilities with Techbridge's industrial design focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="sovereignty" className="mb-32 py-20 border-y border-[#E5E1D5] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-12 bg-crimson" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-gold">Compliance & Security</h4>
                <h3 className="text-4xl font-bold text-espresso mt-1">Sovereignty is Foundation.</h3>
              </div>
            </div>
            <p className="text-lg text-[#555] leading-relaxed mb-10">
              Techbridge serves as the <span className="font-bold text-espresso">Local Data Steward</span> in the alliance. While SmartBridge (India & Ghana) provides the Skill Wallet platform and delivery infrastructure, all student PII, learning pathways, and assessment data are anchored in Ghanaian jurisdiction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Lock />, title: "GDPR & DPA", desc: "Full alignment with Ghana Data Protection Act." },
                { icon: <Scale />, title: "Legal Orbit", desc: "All contracts under Ghana High Court." },
                { icon: <Database />, title: "Local Nodes", desc: "Data residency in West African AWS zones." },
                { icon: <Cpu />, title: "Gov Metrics", desc: "Direct real-time dashboard for Ministry." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-md border border-[#F0EEE5] bg-white/50">
                  <div className="text-gold mt-1">{item.icon}</div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-espresso">{item.title}</h5>
                    <p className="text-[9px] text-[#777] mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card relative overflow-hidden h-[500px]">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Building className="w-64 h-64" />
             </div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-espresso mb-8">Deployment Readiness Curve</h4>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={COLLABORATIVE_FLOW} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#8C1A2E" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#8C1A2E" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E1D5" />
                   <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                   />
                   <YAxis hide />
                   <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                   />
                   <Area 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8C1A2E" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEff)" 
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-8 flex justify-between items-center bg-[#FAF9F6] p-6 rounded-md border border-[#E5E1D5]">
               <div>
                 <div className="text-[9px] font-bold uppercase tracking-widest text-[#AAA]">Combined Velocity</div>
                 <div className="text-2xl font-serif italic text-crimson">8 Weeks to Launch</div>
               </div>
               <p className="text-[10px] text-[#777] max-w-[180px] leading-relaxed">
                 Leveraging Techbridge's existing 15k student infrastructure for instant SmartBridge platform rollout.
               </p>
             </div>
          </div>
        </section>

        {/* Economic Multiplier */}
        <section id="economic-multiplier" className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-espresso text-white p-12 rounded-tech-lg relative">
                <div className="multiplier-dot absolute top-8 right-8 w-4 h-4" />
                <h3 className="text-3xl font-serif italic mb-8">The Local Reinvestment Mandate.</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-10">
                  By partnering with a Ghanaian institution, the project ensures that 60% of technical service fees are retained locally for infrastructure growth, creating an economic ripple effect.
                </p>
                <div className="space-y-4">
                  {[
                    "Hiring 45+ Local Technical Staff",
                    "Expansion of Oyibi GPU Cluster",
                    "Regional Hub Infrastructure Fees",
                    "Tax Revenue Retention in Ghana"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gold/80">
                      <CheckCircle2 className="w-4 h-4 text-crimson" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 order-1 lg:order-2">
              <SectionEyebrow text="Alliance Economic Impact" />
              <h3 className="text-4xl font-bold text-espresso mb-8 leading-tight">GHS 1.2B Economic Value Retained via Local Integration.</h3>
              <p className="text-[#555] leading-relaxed mb-10 text-lg">
                The SmartBridge × Techbridge alliance eliminates the 'Profit Leakage' often associated with direct international vendor procurement. We ensure that a significant portion of the programme budget circulates within the Ghanaian technical ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-[#E5E1D5] pt-10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Foreign Service Value</div>
                  <div className="text-xl font-bold text-[#555]">GHS 280M</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-crimson mb-2">Local Retention (60%)</div>
                  <div className="text-xl font-bold text-espresso">GHS 420M</div>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('economic')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-12 group flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-espresso hover:text-crimson transition-colors"
              >
                View Full Economic Impact Model <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Alliance Resource Optimization */}
        <section id="delivery" className="mb-32">
          <SectionEyebrow text="Resource Allocation & Efficiency" />
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h3 className="text-3xl font-bold text-espresso max-w-xl">
              Efficiency Through Local Integration.
            </h3>
            <p className="text-[11px] font-bold text-[#777] max-w-xs text-right">
              The alliance model significantly reduces overhead by utilizing existing local infrastructure and expertise, compared to high-cost international direct procurement.
            </p>
          </div>
          <div className="content-card">
            <AllianceEfficiencyTable />
          </div>
        </section>

        {/* Conclusion / Final Recommendation */}
        <section className="bg-espresso-deep text-white p-12 md:p-24 rounded-tech-lg text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-crimson via-gold to-crimson" />
          <SectionEyebrow text="Executive Summary: The Partner Model" />
          <h2 className="text-3xl md:text-5xl font-serif italic mb-10 max-w-5xl mx-auto leading-tight">
            Selecting the <span className="text-gold">Techbridge × SmartBridge Alliance</span> ensures Ghana secures world-class technology with absolute sovereign control and local economic impact.
          </h2>
          <div className="flex flex-col items-center gap-12 mt-12 mb-16">
            <button
              onClick={() => window.open('mailto:partnership@techbridge.edu.gh?subject=One Million Coders: Alliance Protocol Activation', '_blank')}
              className="bg-crimson px-12 py-5 rounded-sm text-[12px] font-bold uppercase tracking-widest hover:bg-white hover:text-espresso transition-all flex items-center gap-3 shadow-xl"
            >
              Activate Alliance Protocol <CheckCircle2 className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold font-sans">Secure Academic Portal</span>
              <code className="text-gold font-mono text-sm bg-white/5 px-6 py-3 rounded-lg border border-white/10 shadow-inner">
                admissions.techbridge.edu.gh
              </code>
            </div>
          </div>
          <div className="flex justify-center gap-12 opacity-30 items-center">
            <div className="text-[9px] font-bold uppercase tracking-widest">Techbridge verified ops</div>
            <div className="text-gold text-lg">✦</div>
            <div className="text-[9px] font-bold uppercase tracking-widest">SmartBridge platform tech</div>
            <div className="text-crimson text-lg">✦</div>
            <div className="text-[9px] font-bold uppercase tracking-widest">Ministry Dashboard Ready</div>
          </div>
        </section>
        
        {/* Economic Impact Model */}
        <section id="economic" className="mb-40 pt-20">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-12">
            <div className="max-w-3xl">
              <SectionEyebrow text="Alliance Economic Model" />
              <h3 className="text-4xl md:text-6xl font-black text-espresso leading-tight mt-6">
                Quantifying the <span className="text-gold italic font-serif">Dividends</span> of Sovereignty.
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {ECONOMIC_IMPACT_METRICS.map((metric, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl border border-[#E5E1D5] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#AAA]">{metric.label}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metric.growth.startsWith('+') ? 'bg-green-100 text-green-700' : metric.growth === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-gold/10 text-gold'}`}>
                    {metric.growth}
                  </span>
                </div>
                <div className="text-4xl font-black text-espresso mb-4 group-hover:text-gold transition-colors">{metric.value}</div>
                <p className="text-xs text-[#777] leading-relaxed">{metric.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="content-card p-10 h-[500px] flex flex-col">
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso mb-1">Growth Forecast Trend</h4>
                <p className="text-[11px] text-[#777]">Projected GVA Contribution ($ Billions)</p>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GVA_TREND_DATA}>
                    <defs>
                      <linearGradient id="colorGva" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C49A22" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#C49A22" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEE5" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                      tickFormatter={(value) => `$${value}B`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E1D5', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1A0A06', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gva" 
                      stroke="#C49A22" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorGva)" 
                      name="Direct Contribution"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="projection" 
                      stroke="#8C1A2E" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="transparent"
                      name="Maximum Optimized"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="content-card p-10 h-[500px] flex flex-col">
              <div className="mb-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso mb-1">Sectoral Contribution Breakdown</h4>
                <p className="text-[11px] text-[#777]">Value Distribution by Industry %</p>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SECTOR_CONTRIBUTION_CHART} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0EEE5" />
                    <XAxis 
                      type="number" 
                      hide 
                    />
                    <YAxis 
                      dataKey="sector" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#1A0A06', fontWeight: 'bold' }} 
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: '#FAF7F0' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E1D5' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#1A0A06" 
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                      name="Contribution %"
                    >
                      {SECTOR_CONTRIBUTION_CHART.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1A0A06' : '#C49A22'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 pt-6 border-t border-[#F0EEE5] grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-espresso rounded-sm" />
                  <span className="text-[9px] font-bold text-espresso uppercase tracking-widest">Primary Sectors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gold rounded-sm" />
                  <span className="text-[9px] font-bold text-espresso uppercase tracking-widest">Growth Vectors</span>
                </div>
              </div>
            </div>

            <div className="content-card p-10 h-[500px] flex flex-col lg:col-span-2">
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-espresso mb-1">Impact Scaling: Workforce Absorption</h4>
                  <p className="text-[11px] text-[#777]">1M Coders Programme: Employment Trajectory</p>
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-crimson" />
                    <span className="text-[10px] font-bold text-[#AAA] uppercase">Technical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-[10px] font-bold text-[#AAA] uppercase">Creative</span>
                  </div>
                </div>
              </div>
              <div className="flex-grow w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={JOB_CREATION_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EEE5" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#AAA', fontWeight: 'bold' }} 
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E5E1D5', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1A0A06', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="technical" 
                      stroke="#8C1A2E" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8C1A2E', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Technical Roles"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="creative" 
                      stroke="#C49A22" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#C49A22', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Creative Tech Roles"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-espresso text-white rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 pointer-events-none" />
            <div className="p-10 md:p-16">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-12">Sectoral Absorption Dynamics</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
                      <th className="pb-6 pr-6">Priority Industry</th>
                      <th className="pb-6 pr-6">Impact Tier</th>
                      <th className="pb-6 pr-6">Core Technology Integration</th>
                      <th className="pb-6 text-right">Economic Forecast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECTORAL_DYNAMICS.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                        <td className="py-8 pr-6">
                          <div className="text-lg font-bold text-white group-hover:text-gold transition-colors">{row.industry}</div>
                        </td>
                        <td className="py-8 pr-6">
                          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest">{row.impact}</div>
                        </td>
                        <td className="py-8 pr-6">
                          <div className="text-xs text-white/60 font-mono italic">{row.tech}</div>
                        </td>
                        <td className="py-8 text-right">
                          <div className="text-sm font-black text-gold">{row.forecast}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between p-8 bg-parchment border border-dashed border-[#E5E1D5] rounded-xl gap-8">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-espresso rounded-lg flex items-center justify-center text-gold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-espresso">Verified Industrial Alignment</p>
                <p className="text-[10px] text-[#777]">Certified by Ministry of Trade and Industrial Relations</p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border border-espresso text-espresso text-[10px] font-black uppercase tracking-widest hover:bg-espresso hover:text-white transition-all"
            >
              Download Full Impact Report
            </button>
          </div>
        </section>

        {/* Deliverable Metadata (Methodology Compliance) */}
        <section className="mt-40 pt-20 border-t border-[#E5E1D5] grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#AAA] mb-8">Next-Phase Recommendations</h4>
            <div className="space-y-6">
              {[
                { title: "SME Pipeline Activation", detail: "Linking final-year projects directly to localized SME technical needs in Accra and Kumasi." },
                { title: "GPU Cluster Expansion", detail: "Escalating the Oyibi node to support generative video rendering for the Digital Media track." },
                { title: "Sovereign API Gateway", detail: "Finalizing the real-time Ministry dashboard for 1:1 student progress verification." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-gold font-serif italic text-lg hover:scale-110 transition-transform cursor-default">0{i+1}</div>
                  <div>
                    <h5 className="text-xs font-bold text-espresso">{item.title}</h5>
                    <p className="text-[11px] text-[#777] mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 bg-espresso text-white rounded-lg shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 group-hover:bg-gold/10 transition-colors" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-6 relative z-10">Design System Spec (6R V1.0)</h4>
            <div className="grid grid-cols-2 gap-6 text-[10px] font-mono relative z-10">
              <div>
                <span className="text-white/40 block mb-2 uppercase tracking-tighter">Primaries</span>
                <div className="flex gap-2 items-center"><div className="w-3 h-3 bg-crimson rounded-full" /> #8C1A2E</div>
                <div className="flex gap-2 items-center mt-2"><div className="w-3 h-3 bg-gold rounded-full" /> #C49A22</div>
              </div>
              <div>
                <span className="text-white/40 block mb-2 uppercase tracking-tighter">Surfaces</span>
                <div className="flex gap-2 items-center"><div className="w-3 h-3 bg-parchment rounded-full border border-white/20" /> #FAF7F0</div>
                <div className="flex gap-2 items-center mt-2"><div className="w-3 h-3 bg-espresso rounded-full border border-white/10" /> #1A0A06</div>
              </div>
              <div className="col-span-2 pt-4 border-t border-white/10">
                <span className="text-white/40 block mb-2 uppercase tracking-tighter">Typography & Motion</span>
                <p className="text-white/80">Inter Sans / Space Grotesk / Playfair Serif</p>
                <p className="text-white/40 mt-1">Transitions: 220ms ease-out · Hover: scale(1.02)</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-parchment border-t border-[#E5E1D5] py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <Logo className="w-10 h-10" />
              <div className="text-espresso font-black font-serif text-lg">×</div>
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={SMARTBRIDGE_LOGO} alt="SmartBridge Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            </div>
            <p className="text-[11px] text-[#555] leading-relaxed max-w-sm">
              The unified solution for Ghana's digital transformation. Combining international innovation with local institutional trust and sovereign compliance.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#2A1A1A] mb-8">Partnership</h5>
            <div className="text-[11px] text-[#555] space-y-4">
              <p>Common Liaison: Accra, Ghana</p>
              <p>Governance: partnership@techbridge.edu.gh</p>
              <p>Reporting: Real-time API Enabled</p>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-mono text-[#AAA]">
              Alliance Version 1.0.4<br />
              6R Protocol Implementation<br />
              Ref: Retina Strategic Core
             </div>
          </div>
        </div>
      </footer>

      {/* Guides */}
      <UserGuide isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />
      <AdminGuide isOpen={isAdminGuideOpen} onClose={() => setIsAdminGuideOpen(false)} />

      {/* Help button floating in bottom right */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdminGuideOpen(true)}
          className="p-3 bg-red-700 text-white rounded-full shadow-lg hover:bg-red-800 transition-colors"
          title="Admin Guide (Password Required)"
          aria-label="Open admin guide"
        >
          <Lock className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUserGuideOpen(true)}
          className="p-3 bg-[#0f2545] text-white rounded-full shadow-lg hover:bg-[#1a3a5c] transition-colors"
          title="User Guide"
          aria-label="Open user guide"
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
