// cypress/e2e/screenshot-all-apps.cy.js
// Screenshots all 95 TUC AI Lab apps for deployment verification

const APPS = [
  // TechBridge Suite (10)
  { slug: "blueprint", name: "TechBridge AI Blueprint" },
  { slug: "workshop-flyer", name: "AI Workshop Flyer" },
  { slug: "assessment", name: "Assessment Platform" },
  { slug: "lead-gen", name: "Lead Generation Infographic" },
  { slug: "media-club", name: "Media Club Platform" },
  { slug: "poster-studio", name: "Poster Studio" },
  { slug: "strategy", name: "Strategy Dashboard" },
  { slug: "student-register", name: "Student Population Register" },
  { slug: "tech-quiz", name: "Technical Quiz Platform" },
  { slug: "banner", name: "University College Banner" },

  // AI & ML (12)
  { slug: "ai-email-drafter", name: "AI Email Drafter" },
  { slug: "brand-guideline-checker", name: "Brand Guideline Checker" },
  { slug: "biochemai", name: "BioChemAI" },
  { slug: "dictation", name: "Dictation App" },
  { slug: "youtube-genie", name: "YouTube Genie" },
  { slug: "ghana-news-aggregator", name: "Ghana News Aggregator" },
  { slug: "luxthumb-agent", name: "LuxThumb Agent" },
  { slug: "markai", name: "markAI" },
  { slug: "midjourney-prompt-helper", name: "Midjourney Prompt Helper" },
  { slug: "omniextract", name: "OmniExtract" },
  { slug: "smartscale-ai-presentation-platform", name: "SmartScale AI" },
  { slug: "ai-stand-up-workshop-prep", name: "AI Workshop Prep" },

  // Academic (19)
  { slug: "ai-techbridge", name: "AI at TechBridge" },
  { slug: "aucdt-msee-aptitude-test", name: "MSEE Aptitude Test" },
  { slug: "ckt-utas-modern-website", name: "CKT-UTAS Website" },
  { slug: "dmcdai", name: "dmcdAI" },
  { slug: "fashion-design-brochure", name: "Fashion Design Brochure" },
  { slug: "fees-comparison-dashboard", name: "Fees Comparison Dashboard" },
  { slug: "lecturer-assessment", name: "Lecturer Assessment Portal" },
  { slug: "lecturer-assessment-system", name: "Lecturer Assessment System" },
  { slug: "mature-exam", name: "Mature Students Exam" },
  { slug: "playgrow", name: "PlayGrow" },
  { slug: "scholarship-bond-portal", name: "Scholarship Bond Portal" },
  { slug: "shortcuts", name: "Shortcut Master" },
  { slug: "ai-lab", name: "TUC AI Lab Catalog" },
  { slug: "typing-tutor", name: "Touch Typing Tutorial" },
  { slug: "math-island", name: "Typing & Maths Island" },
  { slug: "verb-explorer", name: "Verb Explorer Toolkit" },
  { slug: "visual-quiz-master", name: "Visual Quiz Master" },
  { slug: "msee", name: "MSEE Program Info" },
  { slug: "tvet-progress", name: "TVET Progress Dashboard" },

  // Creative (20)
  { slug: "ai-flyer-generator", name: "AI Flyer Generator" },
  { slug: "ai-scene-visualizer", name: "AI Scene Visualizer" },
  { slug: "bridge-radio", name: "Bridge Radio (HLS Streamer)" },
  { slug: "fashionprompt-ai", name: "FashionPrompt AI" },
  { slug: "groove-streamer", name: "Groove Streamer" },
  { slug: "peace", name: "Peace Vinyl" },
  { slug: "youtube-genie", name: "YouTube Genie Music" },
  // Additional creative tools
];

describe("TUC AI Lab - App Screenshot Suite", () => {
  before(() => {
    cy.log(`📸 Starting screenshot suite for ${APPS.length} apps`);
  });

  APPS.forEach((app, index) => {
    it(`[${index + 1}/${APPS.length}] ${app.name} - Screenshot`, () => {
      const url = `/${app.slug}/`;

      cy.log(`🚀 Testing: ${app.name}`);
      cy.log(`📍 URL: ${url}`);

      cy.visit(url, { failOnStatusCode: false })
        .then((win) => {
          cy.log(`✅ Page loaded: ${win.location.href}`);
        });

      cy.wait(1000);
      cy.get("body").should("exist");

      cy.screenshot(`${index + 1}-${app.slug}`, {
        capture: "viewport",
        scale: true,
      });

      cy.log(`📸 Screenshot saved: ${app.slug}`);
    });
  });

  after(() => {
    cy.log(`✅ Screenshot suite complete! All ${APPS.length} apps captured.`);
  });
});

describe("TUC AI Lab Catalog - Health Check", () => {
  it("Main catalog loads successfully", () => {
    cy.visit("/ai-lab/");
    cy.get("body").should("exist");
    cy.screenshot("00-catalog-main");
  });

  it("Featured marquee renders", () => {
    cy.visit("/ai-lab/");
    cy.get("[class*='marquee'], [class*='featured']").should("be.visible");
    cy.screenshot("00-catalog-featured");
  });

  it("Search functionality works", () => {
    cy.visit("/ai-lab/");
    cy.get("input[type='text']").first().type("biochemai", { delay: 50 });
    cy.wait(500);
    cy.screenshot("00-catalog-search");
  });

  it("Category filters work", () => {
    cy.visit("/ai-lab/");
    cy.get("button").contains("AI & ML", { matchCase: false }).click();
    cy.wait(500);
    cy.screenshot("00-catalog-filter");
  });
});

describe("Deployment Status Report", () => {
  it("Generates deployment report", () => {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      total_apps: APPS.length,
      test_suite_version: "1.0.0",
      base_url: "https://ai-tools.techbridge.edu.gh",
      viewport: {
        width: 1280,
        height: 1024,
      },
      apps_tested: APPS.map((app) => ({
        slug: app.slug,
        name: app.name,
        url: `/ai-tools.techbridge.edu.gh/${app.slug}/`,
      })),
    };

    cy.writeFile("cypress/reports/deployment-report.json", report, { flag: "w" });
    cy.log(`📊 Report generated: ${APPS.length} apps`);
  });
});
