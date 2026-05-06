
import { AppEntry, Category, Faculty, ResearchTopic } from './types';

export const TECHBRIDGE_PRIMARY = '#8B1538';
export const TECHBRIDGE_DARK = '#6B1028';
export const TECHBRIDGE_GOLD = '#D4AF37';
export const TECHBRIDGE_CREAM = '#F8F6F0';

export const FACULTY_DATA: Faculty[] = [
  {
    name: "Bryce L. Ferguson",
    title: "Assistant Professor of Engineering",
    labName: "MADCAT Lab",
    labLink: "https://sites.dartmouth.edu/madcat/",
    video: "https://youtube.com/shorts/xNBF-aKQrxE",
    description: "TechBridge Engineering's Spot is housed in the MADCAT Lab directed by Professor Bryce L. Ferguson and is one of many robotic platforms at TechBridge.",
    department: "Thayer School of Engineering"
  },
  {
    name: "Brian Plancher",
    title: "Assistant Professor of Computer Science",
    labName: "Accessible and Accelerated Robotics (A²R) Lab",
    labLink: "https://a2r-lab.org/",
    video: "https://youtube.com/shorts/YwVm6h_bgiQ",
    description: "Optimizing robotic systems at all scales to power next-generation robotic intelligence, autonomy, and capabilities",
    department: "Computer Science"
  },
  {
    name: "Sergey Bratus",
    title: "Distinguished Professor in Cyber Security",
    labName: "Trust Lab",
    labLink: "https://sites.dartmouth.edu/trustlab/",
    video: "https://youtube.com/shorts/OZUrXrV3Iuo",
    description: "Investigating the root causes of software insecurity to build systems we can actually trust",
    department: "Computer Science"
  },
  {
    name: "Sarah Preum",
    title: "Assistant Professor of Computer Science",
    labName: "PERSIST Lab",
    labLink: "https://persist-lab.github.io/",
    video: "https://youtube.com/shorts/JWTppaPBQWo",
    description: "Collaborative AI that augments medical clarity, capability, and connection in healthcare.",
    department: "Computer Science"
  },
  {
    name: "Lorie Loeb",
    title: "Research Professor of Computer Science",
    labName: "DALI Lab",
    labLink: "https://dali.dartmouth.edu/",
    video: "https://youtube.com/shorts/FrmVO6pyecM",
    description: "Students design and build new AI-powered remote cancer detection technology now used in over 40 countries.",
    department: "Computer Science"
  }
];

export const RESEARCH_TOPICS: ResearchTopic[] = [
  { id: 2, x: 0, y: 100, radius: 12, text: "AI Theory", align: "end", link: "#" },
  { id: 3, x: 0, y: 160, radius: 12, text: "Trustworthy AI", align: "end", link: "#" },
  { id: 4, x: 0, y: 220, radius: 12, text: "Vision & Language", align: "end", link: "#" },
  { id: 1, x: 0, y: 280, radius: 12, text: "AI Foundations", align: "end", link: "#", anchor: true },
  { id: 6, x: 0, y: 340, radius: 12, text: "Human-AI Interaction", align: "end", link: "#" },
  { id: 7, x: 0, y: 400, radius: 12, text: "Robotics", align: "end", link: "#" },
  { id: 11, x: 200, y: 100, radius: 12, text: "Digital Humanities", align: "start", link: "#" },
  { id: 12, x: 200, y: 160, radius: 12, text: "Arts & Creativity", align: "start", link: "#" },
  { id: 13, x: 200, y: 220, radius: 12, text: "AI for Social Good", align: "start", link: "#" },
  { id: 9, x: 200, y: 280, radius: 12, text: "AI Frontiers", align: "start", link: "#", anchor: true },
  { id: 16, x: 200, y: 340, radius: 12, text: "AI for Science", align: "start", link: "#" },
  { id: 17, x: 200, y: 400, radius: 12, text: "AI for Health", align: "start", link: "#" }
];

const BASE_URL = 'https://ai-tools.aucdt.edu.gh';

export const DIRECTORY_DATA: AppEntry[] = [
  { id: 'agent', title: 'Agent-Led Software Development', category: Category.DEVELOPMENT, description: 'Streamline coding workflows with intelligent AI agents.', path: `${BASE_URL}/agent` },
  { id: 'visquiz', title: 'Visual Quiz Master', category: Category.EDUCATION, description: 'Interactive visual assessments for enhanced learning.', path: `${BASE_URL}/visquiz` },
  { id: 'flyer', title: 'AI Flyer Generator', category: Category.DESIGN, description: 'Design professional flyers in seconds with generative AI.', path: `${BASE_URL}/flyer` },
  { id: 'draft-email', title: 'AI Email Drafter', category: Category.PRODUCTIVITY, description: 'Polished professional emails from simple prompts.', path: `${BASE_URL}/draft-email` },
  { id: 'code-reviewer', title: 'AI Code Reviewer', category: Category.DEVELOPMENT, description: 'Automated high-quality code quality audits.', path: `${BASE_URL}/code-reviewer` },
  { id: 'refresh', title: 'Compliance Workflow Dashboard', category: Category.BUSINESS, description: 'Real-time regulatory compliance monitoring.', path: `${BASE_URL}/refresh` },
  { id: 'jsonpp', title: 'JSON Preprocessor', category: Category.UTILITY, description: 'Smart data cleaning and JSON formatting.', path: '#' },
  { id: 'programmes', title: 'TUC Design Programmes', category: Category.DESIGN, description: 'Academic design curriculum and program details.', path: '#' },
  { id: 'fdt', title: 'TUC: Fashion Design Brochure', category: Category.DESIGN, description: 'Visual showcase of fashion design offerings.', path: '#' },
  { id: 'myvbci', title: 'myVBCI Camper App', category: Category.UTILITY, description: 'Management suite for camper activities.', path: '#' },
  { id: 'css-validator', title: 'CSS Validator', category: Category.DEVELOPMENT, description: 'Validate and optimize your stylesheets.', path: '#' },
  { id: 'recruitment', title: 'Interactive Agency Assessment', category: Category.MARKETING, description: 'TUC student recruitment and talent portal.', path: '#' },
  { id: 'thepitchhub', title: 'The Pitch Hub Ghana', category: Category.BUSINESS, description: 'Empowering local entrepreneurs with AI resources.', path: '#' },
  { id: 'playgrow', title: 'PlayGrow – Smart Fun', category: Category.EDUCATION, description: 'Educational games for cognitive development.', path: '#' },
  { id: 'clipai', title: 'ClipAI', category: Category.PRODUCTIVITY, description: 'Intelligent clipboard and snippet management.', path: '#' },
  { id: 'msee', title: 'TUC MSEE Aptitude Test', category: Category.EDUCATION, description: 'Standardized mathematics aptitude testing.', path: '#' },
  { id: 'qmd', title: 'QMD to Google Slides', category: Category.UTILITY, description: 'Convert Quarto Markdown to presentations.', path: '#' },
  { id: 'drone-1', title: 'Drone Light Show Simulator', category: Category.ENTERTAINMENT, description: 'Simulate complex drone formations in 3D.', path: '#' },
  { id: 'chow', title: 'ChowConnect Admin', category: Category.BUSINESS, description: 'Logistics and delivery management dashboard.', path: '#' },
  { id: 'triptych', title: 'Cinematic Triptych Generator', category: Category.DESIGN, description: 'AI-generated 3-panel cinematic layouts.', path: '#' },
  { id: 'waec', title: 'Mature Students Exam App', category: Category.EDUCATION, description: 'Exam preparation for non-traditional students.', path: '#' },
  { id: 'entrainer', title: 'enTrainer', category: Category.HEALTHCARE, description: 'Metabolic health optimization via music.', path: '#' },
  { id: 'sino', title: 'Sino-Twi Translator', category: Category.UTILITY, description: 'Language bridge between Chinese and Twi.', path: '#' },
  { id: 'thrive', title: 'Interactive Marketing Strategy', category: Category.MARKETING, description: 'Strategic framework for business growth.', path: '#' },
  { id: 'markai', title: 'MarkAI', category: Category.MARKETING, description: 'Marketing tools simplified for everyone.', path: '#' },
  { id: 'primevaluer', title: 'PrimeValuer Pro', category: Category.BUSINESS, description: 'Real estate and asset valuation engine.', path: '#' },
  { id: 'ai-dentist', title: 'AI in Dental Diagnostics', category: Category.HEALTHCARE, description: 'AI-assisted oral health screening.', path: '#' },
  { id: 'dictation', title: 'Dictation App', category: Category.PRODUCTIVITY, description: 'Voice-to-text with advanced formatting.', path: '#' },
  { id: 'pdf-json', title: 'PDF to Assessment JSON', category: Category.UTILITY, description: 'Convert documents into structured data.', path: '#' },
  { id: 'cards', title: 'AI Birthday Card Generator', category: Category.DESIGN, description: 'Personalized cards from AI art.', path: '#' },
  { id: 'cardai', title: 'TUC AI Application Portal', category: Category.UTILITY, description: 'Submission gateway for AI projects.', path: '#' },
  { id: 'warrior', title: 'DJ CyStorm - Warrior', category: Category.ENTERTAINMENT, description: 'Interactive music performance tool.', path: '#' },
  { id: 'lifeplan', title: 'Life Planner AI', category: Category.PRODUCTIVITY, description: 'Holistic goal setting and tracking.', path: '#' },
  { id: 'games', title: 'Brick Breaker Game', category: Category.ENTERTAINMENT, description: 'Classic arcade fun reimagined.', path: '#' },
  { id: 'veca', title: 'VECA Contact Aggregator', category: Category.BUSINESS, description: 'Vermont educational contact management.', path: '#' },
  { id: 'youtube', title: 'YouTube Description Genie', category: Category.MARKETING, description: 'SEO optimized video metadata generator.', path: '#' },
  { id: 'dmcd', title: 'dmcdAI', category: Category.UTILITY, description: 'Specialized data processing agent.', path: '#' },
  { id: 'present', title: 'Daily Standup - TUC', category: Category.PRODUCTIVITY, description: 'Sprint tracking and daily summaries.', path: '#' },
  { id: 'mailer', title: 'Python Email Sender', category: Category.UTILITY, description: 'Scalable automation for mail campaigns.', path: '#' },
  { id: 'prions', title: 'Prion Research Infographic', category: Category.HEALTHCARE, description: 'Visual guide to genetic revolution.', path: '#' },
  { id: 'math', title: 'TUC Examination Portal', category: Category.EDUCATION, description: 'Digital assessments for TUC students.', path: '#' },
  { id: 'standup', title: 'AI Workshop Prep', category: Category.PRODUCTIVITY, description: 'Streamlined workshop facilitation tools.', path: '#' },
  { id: 'iam', title: 'TUC IAM System', category: Category.UTILITY, description: 'Identity and Access Management portal.', path: '#' },
  { id: 'md2latex', title: 'Markdown to LuaLaTeX', category: Category.UTILITY, description: 'Academic publishing conversion engine.', path: '#' },
  { id: 'enactus', title: 'Enactus CKT-UTAS', category: Category.BUSINESS, description: 'Social entrepreneurship platform.', path: '#' },
  { id: 'pde', title: 'Product Development Lifecycle', category: Category.BUSINESS, description: 'End-to-end framework for product creation.', path: '#' },
  { id: 'doculatex', title: 'DocuLaTeX Converter', category: Category.UTILITY, description: 'Omni-format LaTeX generator.', path: '#' },
  { id: 'nobleai', title: 'Ghana Home Design AI', category: Category.DESIGN, description: 'AI assistant for residential architecture.', path: '#' },
  { id: 'volt', title: 'Volt Virtual Card', category: Category.BUSINESS, description: 'Secure virtual payment system.', path: '#' },
  { id: 'biochem', title: 'BioChemAI Teaching Aid', category: Category.EDUCATION, description: 'Complex biochemistry simplified by AI.', path: '#' },
  { id: 'lyrics', title: 'Patois Lyricist', category: Category.ENTERTAINMENT, description: 'Reggae and dancehall lyric generator.', path: '#' },
  { id: 'omniextract', title: 'OmniExtract PDF', category: Category.UTILITY, description: 'Deep data extraction from PDFs.', path: '#' }
];
