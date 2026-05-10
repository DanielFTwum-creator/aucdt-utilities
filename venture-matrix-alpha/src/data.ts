export interface AppRanking {
  rank: number;
  name: string;
  description: string;
  category: 'FinTech' | 'HealthTech' | 'EdTech' | 'AgriTech' | 'LegalTech' | 'Compliance' | 'Logistics' | 'Infrastructure' | 'Media';
  m: number;
  g: number;
  why: string;
  tier: number;
}

export const APP_DATA: AppRanking[] = [
  { rank: 1, name: "fraud-detection-engine", description: "Real-time B2B fintech security layer", category: "FinTech", m: 5, g: 5, tier: 1, why: "Largest fintech B2B market globally; directly protects vulnerable users from financial harm" },
  { rank: 2, name: "predictive-disease-risk-model", description: "Health analytics for low-resource systems", category: "HealthTech", m: 5, g: 5, tier: 1, why: "Healthcare AI is the highest-value sector; life-saving in low-resource health systems" },
  { rank: 3, name: "academic-integrity-detector", description: "LLM-aware plagiarism detection suite", category: "EdTech", m: 5, g: 4, tier: 1, why: "$200M+ plagiarism-detection market; levels the playing field in education" },
  { rank: 4, name: "microcredit-risk-scorer", description: "Credit-scoring for the unbanked", category: "FinTech", m: 4, g: 5, tier: 1, why: "Financial inclusion for the unbanked; huge emerging-market demand from MFIs/fintechs" },
  { rank: 5, name: "ai-exam-generator", description: "Automated institutional assessment tool", category: "EdTech", m: 4, g: 5, tier: 1, why: "Democratises quality assessment at scale; clear SaaS per-institution pricing" },
  { rank: 6, name: "adaptive-curriculum-engine", description: "Personalised ed-tech learning pathways", category: "EdTech", m: 4, g: 5, tier: 1, why: "Personalised learning is the top ed-tech investment theme; strong in underserved markets" },
  { rank: 7, name: "bias-detection-engine", description: "Regulatory AI compliance monitor", category: "Compliance", m: 4, g: 5, tier: 1, why: "Regulatory pressure (EU AI Act etc.) is creating urgent enterprise demand" },
  { rank: 8, name: "ai-legal-clause-analyzer", description: "High-speed legal tech for underserved regions", category: "LegalTech", m: 5, g: 4, tier: 1, why: "Legal-tech is under-served in Africa; access-to-justice mission + high B2B billing rates" },
  { rank: 9, name: "crop-yield-predictor", description: "Agritech forecasting for smallholders", category: "AgriTech", m: 4, g: 5, tier: 1, why: "Agritech for smallholders; food security + strong NGO/govt grant pipeline" },
  { rank: 10, name: "digital-identity-verifier", description: "Foundation layer for financial inclusion", category: "FinTech", m: 5, g: 4, tier: 1, why: "Identity is the foundation of financial inclusion; large fintech/govt contract market" },
  
  { rank: 11, name: "autonomous-audit-engine", description: "Enterprise SaaS compliance automator", category: "Compliance", m: 5, g: 3, tier: 2, why: "Enterprise compliance SaaS commands premium pricing; governance is universal" },
  { rank: 12, name: "ai-code-reviewer", description: "Deep developer tooling subscription", category: "Infrastructure", m: 5, g: 3, tier: 2, why: "Developer tooling market is deep and subscription-friendly" },
  { rank: 13, name: "supply-chain-route-optimizer", description: "Logistics efficiency with emission reduction", category: "Logistics", m: 5, g: 3, tier: 2, why: "Logistics optimisation pays for itself immediately; reduces emissions as a side-effect" },
  { rank: 14, name: "treasury-forecasting-ai", description: "Financial services liquidity predictor", category: "FinTech", m: 5, g: 3, tier: 2, why: "Financial services highest willingness-to-pay vertical" },
  { rank: 15, name: "insurance-risk-intelligence-engine", description: "Insurtech for climate & agriculture", category: "FinTech", m: 5, g: 3, tier: 2, why: "Insurtech + parametric insurance for climate/agriculture is a hot funding area" },
  { rank: 16, name: "knowledge-compression-engine", description: "Enterprise-wide knowledge management", category: "Infrastructure", m: 4, g: 3, tier: 2, why: "Enterprise knowledge mgmt is a clear pain; licensing model straightforward" },
  { rank: 17, name: "student-performance-predictor", description: "Early-intervention data for education", category: "EdTech", m: 4, g: 4, tier: 2, why: "Early-intervention data that can save students; ed-analytics SaaS growing fast" },

  { rank: 18, name: "misinformation-detector", description: "Democracy-critical media licensing", category: "Media", m: 3, g: 5, tier: 3, why: "Democracy-critical; media platform licensing + NGO/govt grants" },
  { rank: 19, name: "public-health-surveillance-ai", description: "Population-scale healthcare monitor", category: "HealthTech", m: 3, g: 5, tier: 3, why: "Life-saving at population scale; funded through govt/WHO/USAID contracts" },
  { rank: 20, name: "disaster-response-allocator", description: "Humanitarian resource AI", category: "Logistics", m: 2, g: 5, tier: 3, why: "Humanitarian AI; funded through grants/UN but not self-sustaining commercially" },
  { rank: 21, name: "community-plates.v1", description: "Food rescue marketplace model", category: "Infrastructure", m: 3, g: 5, tier: 3, why: "Food rescue platform; impact-measurable, fundable, potential marketplace model" },
  { rank: 22, name: "climate-impact-modeler", description: "Carbon market monetization path", category: "Infrastructure", m: 3, g: 5, tier: 3, why: "Carbon markets + climate finance creating monetisation path" },
  { rank: 23, name: "soil-health-analyzer", description: "Smallholder agriculture impact tool", category: "AgriTech", m: 3, g: 5, tier: 3, why: "Direct smallholder agriculture impact; extension-service distribution model" },

  { rank: 24, name: "autonomous-compliance-enforcer", description: "Regulatory automation tool", category: "Compliance", m: 4, g: 3, tier: 4, why: "Regulatory compliance automation" },
  { rank: 25, name: "api-monetization-portal", description: "TUC commercial infrastructure", category: "Infrastructure", m: 4, g: 2, tier: 4, why: "Infrastructure for TUC to commercialise all other apps" },
  { rank: 26, name: "ai-marketplace-engine", description: "Tool aggregation platform", category: "Infrastructure", m: 4, g: 2, tier: 4, why: "Platform play — aggregates the other AI tools" },
  { rank: 27, name: "sentiment-aware-ux-adapter", description: "Accessibility for neurodiverse users", category: "Infrastructure", m: 3, g: 3, tier: 4, why: "Accessible UX for neurodiverse users is an underserved angle" },
  { rank: 28, name: "federated-learning-coordinator", description: "Privacy-preserving data share layer", category: "Infrastructure", m: 3, g: 4, tier: 4, why: "Privacy-preserving AI; critical for health/finance data sharing across institutions" },
  { rank: 29, name: "techbridge-eligibility-checker", description: "Scholarship & welfare access booster", category: "EdTech", m: 3, g: 4, tier: 4, why: "Direct scholarship/welfare access improvement — high impact per student" },
  { rank: 30, name: "hospital-resource-allocator", description: "Health system intake optimizer", category: "HealthTech", m: 3, g: 5, tier: 4, why: "Highly impactful but constrained to health system procurement cycles" },
];

export const STRATEGIC_OBSERVATIONS = [
  {
    title: "Best Immediate Revenue Target",
    items: ["fraud-detection-engine", "ai-legal-clause-analyzer", "autonomous-audit-engine"],
    observation: "Enterprises pay now, procurement cycles are short in fintech."
  },
  {
    title: "Best Grant/Impact Funding Target",
    items: ["predictive-disease-risk-model", "public-health-surveillance-ai", "disaster-response-allocator", "misinformation-detector"],
    observation: "Align with USAID, Gates Foundation, AfDB, and AU digital strategy priorities."
  },
  {
    title: "Best TUC Flagship to Spin Out",
    items: ["academic-integrity-detector", "ai-exam-generator"],
    observation: "Bundled assessment suite — directly addresses a pain TUC already lives."
  },
  {
    title: "Hidden Gem",
    items: ["microcredit-risk-scorer"],
    observation: "Ghana's mobile money ecosystem is actively looking for credit-scoring infrastructure."
  }
];
