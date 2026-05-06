import { Content } from "./types";

export const content: Content = {
  hero: {
    title: "The AI transformation framework",
    subtitle: "A data-backed guide to scaling enterprise AI adoption",
    description: "AI transformation at scale isn’t magic—it’s math. Four essential components multiply to create a measurable impact. Each component builds upon the last, and the result is high-impact AI ROI. Remove one, and the entire equation collapses."
  },
  chapters: [
    {
      id: "leadership",
      number: "01",
      title: "Leadership",
      headline: "Set vision, urgency, and alignment",
      whyMatters: "Without dedicated leadership spearheading the charge, AI efforts are often scattered across disconnected experiments and never reach production. Teams launch pilots that show promise, then watch them die in procurement limbo or integration purgatory.",
      stages: [
        { name: "Mobilise", description: "Establish a CEO-level call to action" },
        { name: "Activate", description: "Name an accountable leader and prioritise strategic bets" },
        { name: "Amplify", description: "Hold leaders accountable for learnings and outcomes" },
        { name: "Sustain", description: "Embed AI into core operations" }
      ],
      stat: { value: "26%", description: "of leaders said more than half of their AI pilots scaled to production" }
    },
    {
      id: "culture",
      number: "02",
      title: "Talent & Culture",
      headline: "Foster AI fluency and experimentation",
      whyMatters: "Without talent that knows how to use AI effectively—and a culture that makes space for hands-on experimentation—AI adoption stays superficial. Lots of licences, little transformation.",
      stages: [
        { name: "Mobilise", description: "Build a culture of psychological safety and experimentation" },
        { name: "Activate", description: "Boost AI fluency with hands-on learning" },
        { name: "Amplify", description: "Select internal AI experts, then redesign roles and teams" },
        { name: "Sustain", description: "Update staffing ratios, incentives, and compensation" }
      ],
      stat: { value: "95%", description: "report firefighting execution issues rather than making forward progress" }
    },
    {
      id: "tools",
      number: "03",
      title: "Tools",
      headline: "Equip teams with the right tech stack",
      whyMatters: "Without the right tools and orchestration layer, even the most skilled teams stall at integration. They build brilliant workflows in isolation, then discover those workflows can’t talk to each other.",
      stages: [
        { name: "Mobilise", description: "Ease barriers to purchase AI tools, then evaluate data readiness" },
        { name: "Activate", description: "Monitor tools and models in use" },
        { name: "Amplify", description: "Establish an AI tooling scorecard" },
        { name: "Sustain", description: "Create shared infrastructure, then consolidate tools" }
      ],
      stat: { value: "46%", description: "of leaders say integration complexity is the most difficult barrier" }
    },
    {
      id: "governance",
      number: "04",
      title: "Governance",
      headline: "Provide guardrails for safe adoption",
      whyMatters: "Without governance built into workflows, AI adoption creates risk faster than ROI. But governance that’s too restrictive kills innovation before it starts.",
      stages: [
        { name: "Mobilise", description: "Establish guidelines for AI use" },
        { name: "Activate", description: "Create an AI task force and formalize foundational policies" },
        { name: "Amplify", description: "Establish a governance centre of excellence" },
        { name: "Sustain", description: "Integrate AI governance into exec and board-level reporting" }
      ],
      stat: { value: "63%", description: "of practitioners admit to using AI tools without formal approval" }
    },
    {
      id: "impact",
      number: "05",
      title: "Impact",
      headline: "The Outcome",
      whyMatters: "When all four components align, transformation becomes measurable. Remove any of these four variables, and AI ROI becomes negligible. Get all four right and the positive outcomes multiply.",
      stages: [],
      stat: { value: "30%", description: "of leaders prioritise measurable ROI as their top success metric" },
      chart: {
        title: "Enterprise leaders' preferred AI success metrics",
        data: [
          { label: "Deliver measurable business outcomes (ROI, efficiency)", value: 30 },
          { label: "Automate a higher percentage of workflows", value: 27 },
          { label: "Expand employee AI adoption", value: 19 },
          { label: "Increase pilots that reach scaled production", value: 19 },
          { label: "Achieve governance milestones", value: 5 }
        ]
      }
    }
  ]
};
