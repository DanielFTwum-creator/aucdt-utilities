
import { SlideContent, SlideType } from './types';

export const PRESENTATION_SLIDES: SlideContent[] = [
  {
    id: 1,
    type: SlideType.TITLE,
    title: "Bridging the AI Gap for Africa’s Entrepreneurs",
    subtitle: "Introducing SmartScale: A Practical AI Program for SME Growth in Ghana and Nigeria.",
    theme: 'brand',
    backgroundImage: "https://media.techbridge.edu.gh/media/slide-1.png",
    speakerNotes: "Welcome everyone. Today, we're here to discuss a critical opportunity for African businesses: bridging the AI gap. This isn't just about technology; it's about growth, efficiency, and competitiveness for SMEs in Ghana and Nigeria. My name is [Your Name], and I'm excited to introduce you to SmartScale."
  },
  {
    id: 2,
    type: SlideType.SPLIT,
    title: "Programme Overview",
    leftTitle: "Format & Target",
    leftBody: [
      "Format: 2 Days Virtual + 1 Day In-Person",
      "Class Size: 20-30 participants",
      "Target: Small business owners and entrepreneurs"
    ],
    rightTitle: "Why This Matters",
    rightBody: [
      "While global markets accelerate with AI, many African entrepreneurs have not yet leveraged its potential.",
      "This programme bridges that gap with practical, accessible tools."
    ],
    mainImage: {
      url: "https://media.techbridge.edu.gh/media/slide-2.png",
      alt: "African business team meeting",
      position: "right"
    },
    speakerNotes: "SmartScale is a hybrid model designed for busy entrepreneurs: two virtual days to learn the basics, followed by an intense, hands-on in-person day. We keep class sizes small to ensure personal attention."
  },
  {
    id: 3,
    type: SlideType.SANKEY,
    title: "How SmartScale Works",
    subtitle: "Understanding the Data Flow & Interaction Ecosystem",
    speakerNotes: "Before we dive into the modules, let's look at how this platform works. It's a closed-loop ecosystem. Your interactions flow from the UI into a centralized state manager. When you use the Workshop Tool, we pipe that data directly to Google's Gemini API, which returns text and images that are then rendered instantly in your current slide. This architecture ensures that your workshop results are always contextual and high-performance."
  },
  {
    id: 4,
    type: SlideType.SPLIT,
    title: "The Reality: Intense Pressure, Limited Resources",
    mainImage: {
        url: "https://media.techbridge.edu.gh/media/slide-3.png",
        alt: "Entrepreneur working in their shop",
        position: "left"
    },
    rightTitle: "The Challenge & Impact",
    rightBody: [
      "Small businesses operate with competing priorities and tight budgets.",
      "Founders are stretched thin across marketing, service, and operations.",
      "80% of African startups fail within the first five years.",
      "The issue isn’t relevance—it’s access. Entrepreneurs lack exposure to simple AI tools."
    ],
    speakerNotes: "We know the reality you face. You are the CEO, marketing manager, and customer service agent all at once. 80% of startups fail not because of bad ideas, but because operational inefficiencies drain resources. AI is the lever to fix that."
  },
  {
    id: 5,
    type: SlideType.SPLIT,
    title: "A Widening Digital Divide",
    leftBody: [
      "While global markets accelerate with AI, many African entrepreneurs have not yet leveraged its potential.",
      "47% of business leaders in the Middle East & Africa are already using or eager to adopt AI."
    ],
    rightBody: [
      "The gap is growing: AI adoption among African SMEs remains low due to limited skills.",
      "This creates a growing risk of being outpaced and losing competitiveness."
    ],
    mainImage: {
      url: "https://media.techbridge.edu.gh/media/slide-4.png",
      alt: "Man utilizing mobile technology",
      position: "left"
    }
  },
  {
    id: 6,
    type: SlideType.CONTENT,
    title: "The Opportunity: Africa’s AI Market",
    subtitle: "Exponential Growth Projected",
    body: [
      "USD $4.51 Billion (2025) → USD $16.53 Billion (2030)",
      "(Source: Mastercard, 2025)",
      "There is a clear and urgent opportunity to equip SMEs to capture a share of this growth."
    ],
    mainImage: {
        url: "https://media.techbridge.edu.gh/media/slide-5.png",
        alt: "Growth chart rising significantly",
        position: "bottom",
        caption: "Projected Market Growth 2025-2030"
    }
  },
  {
    id: 7,
    type: SlideType.SECTION,
    title: "Day 1: Virtual",
    subtitle: "AI Fundamentals & Quick Wins",
    theme: 'brand',
    backgroundImage: "https://media.techbridge.edu.gh/media/slide-8.png"
  },
  {
    id: 8,
    type: SlideType.CONTENT,
    title: "Hands-on Exercise: \"The Perfect Prompt\"",
    subtitle: "Module 4: Prompt Writing",
    body: [
      "Go to ChatGPT or Gemini and use the 4-part formula (Action + Context + Tone + Format) to write a prompt.",
      "Try the 'Perfect Prompt' helper to see how AI refines your idea."
    ],
    interactions: [
      { 
        id: 'pp1', 
        type: 'textarea', 
        label: 'Draft Your Prompt', 
        placeholder: 'e.g., I want a post for my jewelry store...',
        aiPromptTemplate: 'Review this prompt for an SME owner. Refine it using the formula: Action + Context + Tone + Format. Provide the refined prompt first, then explain why it works better.'
      }
    ],
    mainImage: {
        url: "https://media.techbridge.edu.gh/media/slide-15.png",
        alt: "Data analysis",
        position: "bottom"
    }
  },
  {
    id: 9,
    type: SlideType.SECTION,
    title: "Day 2: Virtual",
    subtitle: "Customer & Operations",
    theme: 'brand',
    backgroundImage: "https://media.techbridge.edu.gh/media/slide-18.png"
  },
  {
    id: 10,
    type: SlideType.CONTENT,
    title: "Hands-on Exercise: \"Anticipate the Objection\"",
    subtitle: "Module 3: Sales Scripts",
    body: [
      "Identify the single most common objection you hear from customers.",
      "Use AI to generate professional responses that save time and close deals."
    ],
    interactions: [
      {
        id: 'obj1',
        type: 'text',
        label: 'Common Objection',
        placeholder: 'e.g., "The delivery fee is too high"',
        aiPromptTemplate: 'As a senior sales coach for a Nigerian SME, provide 3 short, persuasive, and empathetic responses to this customer objection: '
      }
    ],
    mainImage: {
        url: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800",
        alt: "Business negotiation",
        position: "right"
    }
  },
  {
    id: 11,
    type: SlideType.SECTION,
    title: "Day 3: In-Person",
    subtitle: "The AI Implementation Lab",
    theme: 'brand',
    backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600",
    speakerNotes: "Welcome to our final, most intense day. Today is where theory becomes reality. We are going to build your assets live."
  },
  {
    id: 12,
    type: SlideType.USE_CASE_GRID,
    title: "Industry-Specific AI Use Cases",
    subtitle: "Ready-to-use examples for your sector",
    useCases: [
      {
        industry: "Retail & E-commerce",
        title: "Product Description Generator",
        description: "Generate 50 product descriptions from basic stock data in minutes.",
        promptExample: "Write an SEO-friendly product description for a hand-stitched leather bag. Focus on durability and local craftsmanship.",
        benefit: "Saves 20+ hours per month on website updates."
      },
      {
        industry: "Services",
        title: "Meeting Minutes to Proposals",
        description: "Transform a voice-recorded meeting into a professional client proposal.",
        promptExample: "Summarize this transcript and draft a formal proposal highlighting the project scope, timeline, and budget.",
        benefit: "Increase quote turnaround speed by 300%."
      },
      {
        industry: "Agriculture",
        title: "Market Price Analyst",
        description: "Use AI to analyze crop price trends and suggest the best time to sell.",
        promptExample: "Analyse current yam market trends in Accra and suggest whether to sell now or wait 2 weeks based on seasonal patterns.",
        benefit: "Maximize profit margins by timing sales correctly."
      },
      {
        industry: "Manufacturing",
        title: "QC Reporting Assistant",
        description: "Generate Quality Control reports just by dictating findings on your phone.",
        promptExample: "Convert my voice notes about the morning production run into a structured QC report with pass/fail metrics.",
        benefit: "Consistent documentation without the desk time."
      },
      {
        industry: "Hospitality",
        title: "Review Response Bot",
        description: "Draft personalized, polite responses to every Google or TripAdvisor review.",
        promptExample: "Write a warm response to a customer who loved our jollof rice but thought the wait time was slightly long.",
        benefit: "Maintain 5-star reputation with minimal effort."
      },
      {
        industry: "Logistics",
        title: "Route Optimization Scripts",
        description: "Draft instructions for drivers based on traffic patterns and delivery priorities.",
        promptExample: "Plan the most efficient route for 10 deliveries in Lagos, prioritizing Mainland stops before 2 PM.",
        benefit: "Reduces fuel costs and delivery delays."
      }
    ],
    speakerNotes: "Look at these cards. These aren't just ideas; they are recipes. You can take any of these prompts right now and put them into the Workshop Tool to see the magic."
  },
  {
    id: 13,
    type: SlideType.CONTENT,
    title: "Hands-on Exercise: \"Branded Visuals\"",
    subtitle: "Module 5: Visual Content",
    body: [
      "No more generic stock photos.",
      "Use the Image Creator in our Workshop Tool to generate a custom marketing image for your brand.",
      "1. Describe your product in a premium setting.",
      "2. Add your brand colors and 'vibes'."
    ],
    interactions: [
      {
        id: 'img1',
        type: 'image-gen',
        label: 'Describe Your Ideal Marketing Photo',
        placeholder: 'e.g., [STYLE] [ASPECT] Gourmet cafe in Accra, sunlight hitting a fresh pastry...',
        aiPromptTemplate: '[STYLE] [ASPECT] Professional commercial photography of '
      }
    ],
    mainImage: {
        url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
        alt: "Creative design process",
        position: "bottom"
    },
    speakerNotes: "Open the Workshop Tool, switch to Image mode. Describe your shop or your hero product. Be specific about the light and the mood. Download the result and imagine it on your Instagram feed."
  },
  {
    id: 14,
    type: SlideType.CTA,
    title: "Ready to Transform Your Business?",
    subtitle: "Join the SmartScale Alumni",
    body: [
      "Contact: The Pitch Hub",
      "Email: info@thepitchhub.org",
      "Website: www.thepitchhub.org"
    ],
    backgroundImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1600",
    speakerNotes: "Thank you for being part of SmartScale. This is just the beginning. Transform your business, grow your impact, and lead the way for African entrepreneurship. Let's get to work!"
  }
];
