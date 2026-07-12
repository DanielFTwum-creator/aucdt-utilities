const fs = require('fs');
const path = require('path');
const { 
  Document, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  ShadingType, 
  BorderStyle, 
  AlignmentType, 
  HeadingLevel, 
  PageBreak, 
  Header, 
  Footer, 
  PageNumber, 
  LevelFormat,
  Packer
} = require("docx");

const MAROON = "6B0000";
const GOLD   = "B8860B";
const BLUE   = "1F3864";
const LGRAY  = "F2F2F2";
const MGRAY  = "D0D0D0";
const WHITE  = "FFFFFF";
const BLACK  = "000000";
const DKBLUE = "1F497D";

// ── helpers ──────────────────────────────────────────────────────────────────
const sp = (before = 0, after = 0, line = null) => ({
  spacing: { before, after, ...(line ? { line } : {}) }
});

const cellBorder = (color = MGRAY) => {
  const b = { style: BorderStyle.SINGLE, size: 1, color };
  return { top: b, bottom: b, left: b, right: b };
};

function hdr(text, level, color = BLUE, opts = {}) {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, color, bold: true, font: "Arial" })],
    ...opts,
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: "Arial", size: 22 })],
    ...sp(60, 60, 276),
    ...opts,
  });
}

function bold(label, rest = "") {
  return new Paragraph({
    children: [
      new TextRun({ text: label, bold: true, font: "Arial", size: 22 }),
      new TextRun({ text: rest, font: "Arial", size: 22 }),
    ],
    ...sp(60, 40, 276),
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
    ...sp(40, 40),
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
    ...sp(40, 40),
  });
}

function gap(before = 80) {
  return new Paragraph({ children: [new TextRun("")], spacing: { before } });
}

function hr() {
  return new Paragraph({
    children: [new TextRun("")],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 1 } },
    spacing: { before: 120, after: 120 },
  });
}

function reqTable(rows) {
  const colWidths = [1500, 1300, 3560, 1200, 1800];
  const headers   = ["Req ID", "Priority", "Description", "Source", "Verification"];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) =>
          new TableCell({
            borders: cellBorder(MAROON),
            width: { size: colWidths[i], type: WidthType.DXA },
            shading: { fill: MAROON, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({
              children: [new TextRun({ text: h, bold: true, color: WHITE, font: "Arial", size: 20 })],
              alignment: AlignmentType.CENTER,
            })],
          })
        ),
      }),
      ...rows.map((r, ri) =>
        new TableRow({
          children: r.map((cell, ci) =>
            new TableCell({
              borders: cellBorder(),
              width: { size: colWidths[ci], type: WidthType.DXA },
              shading: { fill: ri % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [new Paragraph({
                children: [new TextRun({ text: cell, font: "Arial", size: 20 })],
              })],
            })
          ),
        })
      ),
    ],
  });
}

// ── main SRS sections ─────────────────────────────────────────────────────────
const children = [

  // ── COVER PAGE ──
  new Paragraph({
    children: [new TextRun("")],
    spacing: { before: 2880 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: "SOFTWARE REQUIREMENTS SPECIFICATION",
      font: "Arial", size: 52, bold: true, color: MAROON,
    })],
    spacing: { before: 0, after: 240 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: "TypeMaster Pro",
      font: "Arial", size: 40, bold: true, color: BLUE,
    })],
    spacing: { before: 0, after: 120 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: "An Adaptive Typing Tutor System",
      font: "Arial", size: 28, italics: true, color: GOLD,
    })],
    spacing: { before: 0, after: 480 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD } },
    children: [new TextRun("")],
    spacing: { before: 0, after: 480 },
  }),
  ...[
    ["Document Version:", "1.0"],
    ["Prepared By:", "TUC AI Lab — Software Engineering Division"],
    ["Prepared For:", "TypeMaster Pro Development Team"],
    ["Document Status:", "Draft — For Review"],
    ["Date:", "June 15, 2026"],
    ["Standard:", "IEEE Std 830-1998 / IEEE Std 29148-2018"],
  ].map(([label, value]) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: label + "  ", bold: true, font: "Arial", size: 24, color: BLUE }),
        new TextRun({ text: value, font: "Arial", size: 24 }),
      ],
      spacing: { before: 100, after: 60 },
    })
  ),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. INTRODUCTION
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("1. Introduction", HeadingLevel.HEADING_1),
  hr(),

  hdr("1.1 Purpose", HeadingLevel.HEADING_2),
  body("This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for TypeMaster Pro, a feature-complete adaptive typing tutor application targeting parity with commercial benchmarks set by Mavis Beacon Teaches Typing. The document is intended for use by software engineers, UI/UX designers, QA engineers, project managers, and institutional stakeholders involved in the design, development, testing, and maintenance of TypeMaster Pro."),
  body("This SRS follows the IEEE Std 830-1998 template structure and incorporates supplementary guidance from IEEE Std 29148-2018. All numbered sections conform to the 14-section IEEE SRS skeleton."),
  gap(),

  hdr("1.2 Scope", HeadingLevel.HEADING_2),
  body("TypeMaster Pro is a cross-platform desktop and web-based typing instruction system. It provides structured typing lessons, real-time performance feedback, adaptive difficulty calibration, gamified progression mechanics, and detailed analytics. The product is intended for individual learners, institutional deployment (schools, universities, corporate training programs), and self-directed adult learners."),
  body("TypeMaster Pro shall:"),
  bullet("Teach touch-typing from the home row through full keyboard mastery, including number row and symbol keys."),
  bullet("Provide real-time WPM (words per minute) and accuracy metrics with keystroke-level feedback."),
  bullet("Adapt lesson difficulty dynamically based on learner performance history."),
  bullet("Deliver a gamified experience with achievements, leaderboards, and progress narratives."),
  bullet("Support multiple human languages and keyboard layouts (QWERTY, AZERTY, Dvorak, Colemak)."),
  bullet("Generate exportable progress reports for institutional administrators."),
  body("TypeMaster Pro does not include hardware driver configuration, physical keyboard firmware, or content delivery network (CDN) infrastructure — these are outside scope."),
  gap(),

  hdr("1.3 Definitions, Acronyms, and Abbreviations", HeadingLevel.HEADING_2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 6960],
    rows: [
      new TableRow({
        tableHeader: true,
        children: ["Term / Acronym", "Definition"].map((h, i) =>
          new TableCell({
            borders: cellBorder(MAROON),
            width: { size: i === 0 ? 2400 : 6960, type: WidthType.DXA },
            shading: { fill: MAROON, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, font: "Arial", size: 20 })] })],
          })
        ),
      }),
      ...[
        ["WPM", "Words Per Minute — a standard typing speed measurement where one word equals five keystrokes."],
        ["CPM", "Characters Per Minute — raw keystroke throughput per minute."],
        ["Accuracy (%)", "The ratio of correctly typed characters to total typed characters, expressed as a percentage."],
        ["Adaptive Engine", "The algorithmic subsystem that adjusts lesson difficulty based on real-time learner performance metrics."],
        ["Home Row", "The keyboard row containing the keys A, S, D, F, J, K, L, ; on QWERTY layout — the foundation position for touch typing."],
        ["Touch Typing", "Typing technique relying on muscle memory without visual reference to the keyboard."],
        ["Lesson Module", "A discrete instructional unit composed of a warm-up, exercise corpus, and performance evaluation segment."],
        ["Ghost Hand", "An on-screen animated hand overlay that demonstrates correct finger placement in real time."],
        ["SRS", "Software Requirements Specification."],
        ["UI", "User Interface."],
        ["UX", "User Experience."],
        ["API", "Application Programming Interface."],
        ["WCAG", "Web Content Accessibility Guidelines — accessibility standards published by W3C."],
        ["FR", "Functional Requirement."],
        ["NFR", "Non-Functional Requirement."],
        ["LMS", "Learning Management System — e.g., Moodle, Canvas, Blackboard."],
        ["SCORM", "Shareable Content Object Reference Model — an e-learning interoperability standard."],
        ["TTS", "Text-to-Speech synthesis."],
        ["MVP", "Minimum Viable Product."],
        ["PWA", "Progressive Web Application."],
      ].map((r, ri) =>
        new TableRow({
          children: r.map((cell, ci) =>
            new TableCell({
              borders: cellBorder(),
              width: { size: ci === 0 ? 2400 : 6960, type: WidthType.DXA },
              shading: { fill: ri % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20, bold: ci === 0 })] })],
            })
          ),
        })
      ),
    ],
  }),
  gap(),

  hdr("1.4 References", HeadingLevel.HEADING_2),
  bullet("IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications."),
  bullet("IEEE Std 29148-2018 — Systems and Software Engineering — Life Cycle Processes — Requirements Engineering."),
  bullet("Web Content Accessibility Guidelines (WCAG) 2.1, Level AA — W3C Recommendation."),
  bullet("SCORM 2004 4th Edition — Advanced Distributed Learning Initiative."),
  bullet("ISO/IEC 25010:2011 — System and Software Quality Requirements and Evaluation (SQuaRE)."),
  bullet("IEC 62366-1:2015 — Usability Engineering for software products."),
  bullet("Mavis Beacon Teaches Typing (v21, Encore Software) — commercial benchmark reference."),
  bullet("TypingClub Platform Architecture — open-source reference for web-based typing tutor systems."),
  gap(),

  hdr("1.5 Overview", HeadingLevel.HEADING_2),
  body("The remainder of this SRS is organized as follows: Section 2 establishes the overall product context. Section 3 specifies specific functional requirements. Section 4 specifies performance requirements. Section 5 covers design constraints. Section 6 defines software system attributes. Section 7 documents other requirements. Sections 8–14 cover supplementary concerns including external interface requirements, safety, security, maintainability, portability, and requirements traceability."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. OVERALL DESCRIPTION
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("2. Overall Description", HeadingLevel.HEADING_1),
  hr(),

  hdr("2.1 Product Perspective", HeadingLevel.HEADING_2),
  body("TypeMaster Pro is a new, self-contained product. It is not a replacement for any existing internal system, though it is designed for institutional embedding as a standalone module within an LMS via SCORM 2004 or LTI 1.3 integration. The system operates at the intersection of three subsystems:"),
  bullet("Learner-facing Application Layer: browser or native desktop shell delivering lessons, exercises, and gamified feedback."),
  bullet("Analytics and Adaptive Engine: server-side (or client-embedded WASM) module computing performance statistics and adjusting difficulty curves."),
  bullet("Administrative Console: a web dashboard for institutional managers to create cohorts, assign curricula, and export reports."),
  body("TypeMaster Pro may operate in offline mode for core lesson delivery when network access is unavailable, synchronizing telemetry data when connectivity is restored."),
  gap(),

  hdr("2.2 Product Functions", HeadingLevel.HEADING_2),
  body("At the highest level, TypeMaster Pro provides the following primary functions:"),
  numbered("Structured Curriculum Delivery — a sequenced set of 200+ lessons covering home row, all letter keys, punctuation, numbers, and symbol rows, with narrative coaching characters."),
  numbered("Real-Time Keystroke Analysis — per-keystroke accuracy detection, WPM computation, error heatmaps, and problematic bigram identification."),
  numbered("Adaptive Difficulty Engine — dynamically selects next lesson segment, adjusts exercise text complexity, and modulates timer pressure based on learner performance."),
  numbered("Ghost Hand Visualization — animated SVG or 3D hand model demonstrating correct finger assignments in real time during exercises."),
  numbered("Gamification and Motivational System — XP points, leveling, achievements, timed challenge races, and virtual trophies."),
  numbered("Multi-Layout Keyboard Support — QWERTY, Dvorak, Colemak, AZERTY, and regional variants."),
  numbered("Accessibility Features — screen reader support, high-contrast mode, configurable font sizes, TTS narration, and reduced-motion mode."),
  numbered("Progress Analytics Dashboard — learner-facing charts of speed, accuracy, and improvement rate over time."),
  numbered("Administrative Console — cohort management, curriculum assignment, bulk progress reports, and CSV/PDF export."),
  numbered("LMS Integration — SCORM 2004 and LTI 1.3 compliant package for embedding in Moodle, Canvas, or Blackboard."),
  gap(),

  hdr("2.3 User Classes and Characteristics", HeadingLevel.HEADING_2),
  bold("2.3.1 Novice Learner: ", "An individual with little or no prior touch-typing experience. Expected to begin at beginner lesson modules, require high levels of visual scaffolding (ghost hands, key highlighting), and progress over weeks to months."),
  bold("2.3.2 Intermediate Learner: ", "A learner who can type but relies partially on visual keyboard reference. Uses TypeMaster Pro to increase WPM beyond 40 and build consistent accuracy above 95%."),
  bold("2.3.3 Advanced Learner: ", "A proficient typist targeting speeds above 80 WPM with accuracy above 98%. Primarily uses speed-drill modules, competitive racing features, and custom text import."),
  bold("2.3.4 Institutional Administrator: ", "An educational or corporate administrator managing multiple learner accounts. Primarily interacts with the administrative console, requiring no typing proficiency but requiring moderate computer literacy."),
  bold("2.3.5 Accessibility User: ", "A learner with motor or visual impairments requiring accommodation. Requires full keyboard navigability, screen reader compatibility, and TTS support."),
  gap(),

  hdr("2.4 Operating Environment", HeadingLevel.HEADING_2),
  body("TypeMaster Pro shall operate in the following environments:"),
  bullet("Web Application: Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ on Windows 10/11, macOS 12+, Ubuntu 20.04+."),
  bullet("Progressive Web App (PWA): installable on the above desktop platforms with offline lesson caching via Service Workers."),
  bullet("Electron Desktop Build: native builds for Windows 10/11 (x64, ARM64), macOS 12+ (Intel and Apple Silicon), and Ubuntu 22.04+ (x64)."),
  bullet("Mobile Web (tablet, read-only): lesson review and progress dashboards on iOS 15+ Safari and Android 11+ Chrome. Full typing exercises require a physical keyboard."),
  bullet("LMS Embed: SCORM 2004 and LTI 1.3 in Moodle 4.x, Canvas LMS, Blackboard Learn Ultra."),
  gap(),

  hdr("2.5 Design and Implementation Constraints", HeadingLevel.HEADING_2),
  bullet("The application must render all keyboard animations at a sustained 60 fps on hardware with Intel UHD 620 or equivalent integrated graphics."),
  bullet("Core lesson delivery must function without a network connection after initial asset caching (PWA offline requirement)."),
  bullet("All user data storage must comply with GDPR Article 5 and FERPA (20 U.S.C. § 1232g) for institutional deployments."),
  bullet("The adaptive engine algorithm must be deterministically reproducible given a fixed random seed for QA regression testing."),
  bullet("All new code must pass ESLint (TypeScript strict mode) and achieve >80% unit test coverage as enforced in CI/CD pipeline."),
  gap(),

  hdr("2.6 Assumptions and Dependencies", HeadingLevel.HEADING_2),
  bullet("It is assumed that all target deployment machines have a physical keyboard; the system is not designed for on-screen virtual keyboard input."),
  bullet("It is assumed that at least 2 GB of RAM and 500 MB of free disk space are available on learner machines."),
  bullet("The product depends on Web Audio API being available for audio feedback features in the browser environment."),
  bullet("Institutional administrative features depend on OAuth 2.0 / OpenID Connect availability for SSO integration."),
  bullet("Localized lesson corpora (non-English) are assumed to be provided by third-party content partners under license agreements and are not generated by the system."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. SPECIFIC REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("3. Specific Requirements", HeadingLevel.HEADING_1),
  hr(),

  hdr("3.1 Functional Requirements — Curriculum and Lesson Delivery", HeadingLevel.HEADING_2),
  gap(40),
  reqTable([
    ["FR-CL-001", "Critical", "The system shall provide a minimum of 200 structured lesson modules organized into at least 10 skill tiers (Home Row through Full Keyboard Mastery).", "Product Scope", "Lesson count audit, tier navigation test"],
    ["FR-CL-002", "Critical", "Each lesson shall include a warm-up phase (30–60 seconds), an exercise phase (2–5 minutes), and a results review phase displaying WPM, accuracy, and error locations.", "UX Design", "Lesson flow integration test"],
    ["FR-CL-003", "High", "The system shall provide a structured Home Row foundation module that must be completed before unlocking upper- and lower-row lessons.", "Pedagogy", "Lock/unlock prerequisite test"],
    ["FR-CL-004", "High", "The system shall support custom text import, allowing learners to practice typing against user-supplied text (minimum 50 characters, maximum 10,000 characters).", "User Research", "Custom text import test"],
    ["FR-CL-005", "Medium", "The system shall provide a dedicated number-row and symbol-row training module with at least 20 exercises each.", "Scope", "Module content audit"],
    ["FR-CL-006", "Medium", "The system shall support at least 6 languages for lesson corpora: English, French, Spanish, German, Portuguese, and Arabic.", "Localization", "Language selection and rendering test"],
    ["FR-CL-007", "Low", "The system shall provide a daily practice mode that assigns a 5–10 minute exercise based on the learner's weakest key pairs.", "Engagement", "Daily mode scheduling test"],
  ]),
  gap(),

  hdr("3.2 Functional Requirements — Real-Time Keystroke Feedback", HeadingLevel.HEADING_2),
  gap(40),
  reqTable([
    ["FR-KF-001", "Critical", "The system shall detect and display keystroke correctness within 16 ms of key press (one animation frame at 60 fps), highlighting errors in red and correct keystrokes in the neutral color.", "Performance", "Latency instrumentation test"],
    ["FR-KF-002", "Critical", "The system shall compute and display a running WPM counter updated every 2 seconds during an active exercise.", "UX", "WPM computation unit test"],
    ["FR-KF-003", "Critical", "The system shall display a per-key error heatmap on the virtual keyboard overlay, with heat intensity proportional to error frequency, updated at exercise completion.", "Analytics", "Heatmap rendering test"],
    ["FR-KF-004", "High", "The system shall play a configurable audio cue (error beep vs. silence) on incorrect keystrokes, respecting system volume and user preference.", "Accessibility", "Audio cue unit test"],
    ["FR-KF-005", "High", "The system shall identify the top 5 problematic bigrams (two-character sequences) from a completed exercise and surface them in the results screen.", "Analytics", "Bigram analysis unit test"],
    ["FR-KF-006", "Medium", "The system shall display a ghost hand overlay that highlights the correct finger to use for the next expected character, updating in real time as text advances.", "Pedagogy", "Ghost hand animation sync test"],
  ]),
  gap(),

  hdr("3.3 Functional Requirements — Adaptive Engine", HeadingLevel.HEADING_2),
  gap(40),
  reqTable([
    ["FR-AE-001", "Critical", "The adaptive engine shall select the next lesson segment from a pool of candidates based on a weighted scoring function that incorporates: current WPM (40%), accuracy rate (40%), and error pattern recurrence (20%).", "AI/ML Design", "Weighted scoring unit test"],
    ["FR-AE-002", "Critical", "If a learner's accuracy falls below 90% in two consecutive exercises on the same lesson tier, the system shall automatically assign a remedial review exercise before progression.", "Pedagogy", "Remedial trigger test"],
    ["FR-AE-003", "High", "The system shall maintain a rolling learner performance profile (last 30 sessions) used as input to the adaptive scoring function.", "Analytics", "Profile persistence test"],
    ["FR-AE-004", "High", "The adaptive engine shall expose a difficulty override control allowing learners to manually shift difficulty ±2 tiers from the computed recommendation.", "UX", "Manual override integration test"],
    ["FR-AE-005", "Medium", "The system shall produce a weekly adaptive summary explaining in plain language why the current lesson tier was selected.", "Transparency", "Summary generation test"],
  ]),
  gap(),

  hdr("3.4 Functional Requirements — Gamification", HeadingLevel.HEADING_2),
  gap(40),
  reqTable([
    ["FR-GM-001", "High", "The system shall award XP points on exercise completion using the formula: XP = (WPM × accuracy%) × difficulty_multiplier, rounded to the nearest integer.", "Engagement", "XP formula unit test"],
    ["FR-GM-002", "High", "The system shall maintain a level system with at least 50 levels, where level thresholds follow an exponential XP curve (each level requiring 20% more XP than the previous).", "Engagement", "Level progression unit test"],
    ["FR-GM-003", "High", "The system shall award achievement badges for milestones including: first lesson completed, 10 WPM, 30 WPM, 60 WPM, 90 WPM, 100% accuracy on any exercise, 7-day streak, and 30-day streak.", "Engagement", "Badge award trigger test"],
    ["FR-GM-004", "Medium", "The system shall support multiplayer typing races (2–8 participants) over WebSocket, displaying real-time progress bars for all participants.", "Social", "Race multiplayer integration test"],
    ["FR-GM-005", "Medium", "The system shall maintain an anonymized global leaderboard (top 100 by WPM) and an institutional leaderboard (top 50 per cohort).", "Social", "Leaderboard query performance test"],
    ["FR-GM-006", "Low", "The system shall include a virtual trophy room displaying all earned achievements with unlock date and performance stats at the time of earning.", "Engagement", "Trophy room rendering test"],
  ]),
  gap(),

  hdr("3.5 Functional Requirements — Progress Analytics", HeadingLevel.HEADING_2),
  gap(40),
  reqTable([
    ["FR-PA-001", "Critical", "The system shall display a learner progress dashboard showing WPM trend, accuracy trend, and total practice time over selectable periods (7 days, 30 days, all time).", "Analytics", "Dashboard rendering test"],
    ["FR-PA-002", "High", "The system shall generate a printable/exportable PDF progress report per learner, including a performance chart, key error heatmap, and milestone timeline.", "Institutional", "PDF export integration test"],
    ["FR-PA-003", "High", "The administrative console shall support bulk export of cohort progress data in CSV format.", "Institutional", "CSV export integration test"],
    ["FR-PA-004", "Medium", "The system shall display a finger efficiency score per finger (1–10 scale) based on error rate and speed contribution, updated after each exercise.", "Analytics", "Finger score computation test"],
  ]),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. PERFORMANCE REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("4. Performance Requirements", HeadingLevel.HEADING_1),
  hr(),
  body("The following performance thresholds are mandatory. All values represent 95th-percentile targets under normal operating load unless otherwise specified."),
  gap(40),
  reqTable([
    ["NFR-PR-001", "Critical", "Keystroke-to-visual feedback latency shall not exceed 16 ms (one 60 fps frame) measured from key-down event to DOM paint on a mid-range device (Intel UHD 620 / 8 GB RAM).", "System Perf", "Latency profiling under load"],
    ["NFR-PR-002", "Critical", "Application initial load time (Time to Interactive) shall not exceed 3 seconds on a 25 Mbps broadband connection.", "UX", "Lighthouse CI benchmark"],
    ["NFR-PR-003", "High", "The analytics dashboard shall render with full data for a 30-day dataset within 1.5 seconds.", "UX", "Chart render benchmark test"],
    ["NFR-PR-004", "High", "The server-side adaptive engine API shall respond within 200 ms at the 95th percentile under a simulated load of 500 concurrent learner sessions.", "Scalability", "Load test with k6"],
    ["NFR-PR-005", "High", "The multiplayer race WebSocket shall support 8 simultaneous participants with position updates delivered within 100 ms round-trip at the 95th percentile.", "Multiplayer", "WebSocket latency test"],
    ["NFR-PR-006", "Medium", "The system shall support 10,000 registered learner accounts with no degradation in query response times below the thresholds stated in NFR-PR-002 through NFR-PR-004.", "Scale", "Database load test"],
  ]),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. DESIGN CONSTRAINTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("5. Design Constraints", HeadingLevel.HEADING_1),
  hr(),

  hdr("5.1 Standards Compliance", HeadingLevel.HEADING_2),
  bullet("All UI components must comply with WCAG 2.1 Level AA contrast ratios (4.5:1 for normal text, 3:1 for large text)."),
  bullet("LMS packaging must conform to SCORM 2004 4th Edition and LTI 1.3 specifications."),
  bullet("Data storage and transmission must comply with GDPR (EU) 2016/679 and FERPA (US) 20 U.S.C. § 1232g."),
  bullet("All cryptographic operations must use TLS 1.3 or higher for data in transit; AES-256 for data at rest."),
  gap(),

  hdr("5.2 Hardware Limitations", HeadingLevel.HEADING_2),
  bullet("The application must function on machines with minimum 2 GB RAM and a dual-core processor at 1.6 GHz."),
  bullet("The offline PWA asset cache must not exceed 150 MB to ensure compatibility with Chromebook device storage constraints common in K-12 deployments."),
  gap(),

  hdr("5.3 Technology Stack Constraints", HeadingLevel.HEADING_2),
  bullet("Frontend: React 18+ with TypeScript (strict mode). Styling via Tailwind CSS 3.x. Animation via Framer Motion."),
  bullet("Desktop Shell: Electron 28+ with contextIsolation: true and nodeIntegration: false for security."),
  bullet("Backend API: Node.js 20 LTS with Express or Fastify. Database: PostgreSQL 15+ with Prisma ORM."),
  bullet("Real-time features: WebSocket via Socket.IO 4.x or native WS module."),
  bullet("Build / CI: Vite 5+, ESLint (TS strict), Vitest for unit tests, Playwright for E2E, GitHub Actions CI/CD pipeline."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. SOFTWARE SYSTEM ATTRIBUTES
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("6. Software System Attributes", HeadingLevel.HEADING_1),
  hr(),

  hdr("6.1 Reliability", HeadingLevel.HEADING_2),
  bullet("The system shall achieve 99.5% uptime for the web application, excluding scheduled maintenance windows not exceeding 4 hours per month."),
  bullet("In-session data (exercise progress, WPM stats) must be persisted to local IndexedDB every 30 seconds to protect against unexpected session termination."),
  bullet("If a network disruption occurs during an exercise, the system shall continue operating in offline mode and queue data synchronization for reconnection."),
  gap(),

  hdr("6.2 Availability", HeadingLevel.HEADING_2),
  bullet("Scheduled maintenance shall be communicated to institutional administrators at least 48 hours in advance."),
  bullet("Lesson delivery must be available in offline (cached) mode for at least the 10 most recently accessed lesson modules."),
  gap(),

  hdr("6.3 Security", HeadingLevel.HEADING_2),
  bullet("All learner authentication must support OAuth 2.0 / OpenID Connect with institutional SSO providers (Google Workspace, Microsoft Entra ID)."),
  bullet("Session tokens must expire after 24 hours of inactivity and be invalidated on explicit logout."),
  bullet("All API endpoints must enforce role-based access control (RBAC) with roles: Learner, Instructor, Administrator."),
  bullet("The system must implement rate limiting on all API endpoints (max 100 requests/minute per authenticated user)."),
  bullet("Keystroke telemetry data must be anonymized before storage in analytics aggregates; raw keylog data must not be stored beyond the active session."),
  gap(),

  hdr("6.4 Maintainability", HeadingLevel.HEADING_2),
  bullet("All modules must be documented with JSDoc-style inline comments covering public API surface, parameters, return types, and side effects."),
  bullet("The adaptive engine algorithm must be configurable via a JSON configuration file without requiring code changes."),
  bullet("New lesson modules must be addable by depositing JSON-structured lesson content files — no code deployment required."),
  gap(),

  hdr("6.5 Portability", HeadingLevel.HEADING_2),
  bullet("The frontend codebase must produce identical functionality across all supported browsers and OS platforms with no platform-specific code branches in the application layer."),
  bullet("The Electron build pipeline must produce valid installable builds for Windows, macOS (Intel and Apple Silicon), and Ubuntu Linux from a single CI/CD pipeline."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. OTHER REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("7. Other Requirements", HeadingLevel.HEADING_1),
  hr(),

  hdr("7.1 Localization Requirements", HeadingLevel.HEADING_2),
  bullet("All UI strings must be externalized into i18n resource files (JSON format, one per locale)."),
  bullet("The system must support right-to-left (RTL) layout for Arabic and Hebrew locales."),
  bullet("Date, time, and number formatting must respect the learner's locale setting."),
  gap(),

  hdr("7.2 Documentation Requirements", HeadingLevel.HEADING_2),
  bullet("A Learner Quick Start Guide (PDF, max 4 pages) must be bundled with the application."),
  bullet("An Administrator Setup Guide (PDF, max 20 pages) must cover account provisioning, cohort management, SCORM packaging, and LTI integration."),
  bullet("An API Reference (generated via OpenAPI 3.1 / Swagger) must document all backend endpoints for third-party integration developers."),
  gap(),

  hdr("7.3 Legal and Licensing Requirements", HeadingLevel.HEADING_2),
  bullet("All third-party libraries must use OSI-approved open-source licenses (MIT, Apache 2.0, BSD) or commercially licensed libraries with explicitly acquired licenses."),
  bullet("All lesson corpus text must be either original, public domain, Creative Commons licensed, or obtained under license agreements."),
  bullet("The product must not reproduce any copyrighted content from Mavis Beacon Teaches Typing or any other commercial competitor product."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. EXTERNAL INTERFACE REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("8. External Interface Requirements", HeadingLevel.HEADING_1),
  hr(),

  hdr("8.1 User Interfaces", HeadingLevel.HEADING_2),
  body("The primary UI shall consist of five top-level views: Dashboard, Lesson Player, Practice Arena, Analytics, and Administrative Console. All views shall adhere to the TypeMaster Pro design system (see separate Design System Specification document). Key UI requirements:"),
  bullet("The Lesson Player must occupy full-screen mode (no distracting browser chrome) during active typing exercises."),
  bullet("All interactive elements must have a minimum touch target size of 44×44 CSS pixels (per WCAG 2.5.5)."),
  bullet("All keyboard-navigable interactive elements must have a visible focus indicator with at least 3px offset and a 3:1 contrast ratio against the background."),
  gap(),

  hdr("8.2 Hardware Interfaces", HeadingLevel.HEADING_2),
  body("TypeMaster Pro interfaces with physical keyboards through the browser's native KeyboardEvent API (keydown, keyup, keypress). The system must:"),
  bullet("Handle all standard USB and Bluetooth HID keyboards reporting key events through the OS HID stack."),
  bullet("Correctly map KeyboardEvent.code values for QWERTY, Dvorak, Colemak, and AZERTY physical layouts."),
  bullet("Not require any kernel-level driver installation or special hardware permissions beyond standard browser security model."),
  gap(),

  hdr("8.3 Software Interfaces", HeadingLevel.HEADING_2),
  bullet("LMS Integration: SCORM 2004 RTE (Run-Time Environment) via window.API_1484_11 interface; LTI 1.3 via OAuth 2.0 Authorization Code Flow with PKCE."),
  bullet("Identity Providers: OAuth 2.0 + OIDC integration with Google Workspace (accounts.google.com) and Microsoft Entra ID (login.microsoftonline.com)."),
  bullet("Analytics Backend: REST API over HTTPS, JSON payloads, versioned at /api/v1/. See OpenAPI specification for endpoint definitions."),
  bullet("Database: PostgreSQL 15+ accessed via Prisma ORM; schema migrations managed via prisma migrate."),
  gap(),

  hdr("8.4 Communications Interfaces", HeadingLevel.HEADING_2),
  bullet("All client-server communication shall use HTTPS (TLS 1.3) with HSTS preloading."),
  bullet("Real-time multiplayer communication shall use WSS (WebSocket Secure) over port 443."),
  bullet("Email notifications (streak reminders, badge awards, admin reports) shall be delivered via an SMTP relay (configurable; defaults to SendGrid API)."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. SAFETY REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("9. Safety Requirements", HeadingLevel.HEADING_1),
  hr(),
  body("TypeMaster Pro is not a safety-critical system under IEC 61508 classification. However, the following ergonomic and health-related safety considerations apply:"),
  bullet("The system must display a rest reminder notification after 45 minutes of continuous active exercise use, recommending a 10-minute break, per RSI (Repetitive Strain Injury) prevention guidelines."),
  bullet("The system must not use rapidly flashing visual elements (>3 flashes per second) in any animated component, complying with WCAG 2.3.1 (Three Flashes or Below Threshold) to protect users with photosensitive epilepsy."),
  bullet("Audio cues must not exceed 70 dB SPL equivalent in the default configuration; the user must be able to mute all audio."),
  bullet("The system must include a reduced-motion mode (respecting prefers-reduced-motion: reduce CSS media query) that eliminates all non-essential animations."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. SECURITY REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("10. Security Requirements", HeadingLevel.HEADING_1),
  hr(),
  reqTable([
    ["NFR-SEC-001", "Critical", "All learner passwords must be stored as bcrypt hashes (cost factor ≥ 12). Plaintext passwords must never be logged or stored.", "Security", "Password storage audit"],
    ["NFR-SEC-002", "Critical", "The application must implement Content Security Policy (CSP) Level 3 headers preventing inline script execution and unauthorized resource loading.", "Security", "CSP header validation test"],
    ["NFR-SEC-003", "Critical", "All API endpoints accepting user input must validate and sanitize inputs to prevent SQL injection and XSS attacks, enforced via parameterized queries and DOMPurify.", "Security", "OWASP ZAP scan"],
    ["NFR-SEC-004", "High", "Multi-factor authentication (TOTP or WebAuthn) must be available as an optional setting for all learner accounts and mandatory for all Administrator accounts.", "Security", "MFA enrollment integration test"],
    ["NFR-SEC-005", "High", "The Electron build must disable nodeIntegration, enable contextIsolation, and load all content from a local bundle — no remote content shall execute in the renderer process.", "Security", "Electron security audit"],
    ["NFR-SEC-006", "Medium", "GDPR data subject requests (access, deletion, portability) must be fulfillable via the administrative console within 72 hours of a verified request.", "Compliance", "GDPR workflow manual test"],
  ]),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. MAINTAINABILITY REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("11. Maintainability Requirements", HeadingLevel.HEADING_1),
  hr(),
  bullet("Unit test coverage must be maintained at ≥ 80% line coverage for all modules, enforced via Vitest coverage thresholds in CI."),
  bullet("The codebase must pass ESLint (TypeScript strict) with zero errors on every commit; warnings must be documented with suppression rationale."),
  bullet("Feature flags must be used for all in-development features, implemented via a centralized feature-flag service, to allow safe deployment to production without enabling unfinished features."),
  bullet("The application must emit structured JSON logs (ISO 8601 timestamps, severity levels, correlation IDs) to stdout, compatible with cloud log aggregators (Datadog, CloudWatch, GCP Cloud Logging)."),
  bullet("Database schema changes must be applied via versioned Prisma migration files, with each migration reviewed and approved before merging to main."),
  bullet("Mean Time to Repair (MTTR) for Severity-1 production incidents must not exceed 4 hours, supported by on-call runbooks maintained in the project wiki."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. PORTABILITY REQUIREMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("12. Portability Requirements", HeadingLevel.HEADING_1),
  hr(),
  bullet("The frontend application must produce bit-identical rendered output across Chrome, Firefox, Safari, and Edge on identical input data, validated by Playwright visual regression tests."),
  bullet("Lesson content must be stored in a portable JSON schema, independent of any database vendor, to allow migration between PostgreSQL, MySQL, or SQLite."),
  bullet("The SCORM 2004 package must be validated against the ADL SCORM Conformance Test Suite prior to each release."),
  bullet("The Electron build must be producible from a CI/CD runner without requiring a physical macOS machine for the macOS build — achieved via electron-builder with code signing credentials injected as CI secrets."),
  bullet("All environment-specific configuration (API URLs, feature flags, OAuth client IDs) must be injected via environment variables at runtime, not baked into the build artifact, enabling a single build artifact to be deployed across development, staging, and production environments."),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. REQUIREMENTS TRACEABILITY MATRIX
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("13. Requirements Traceability Matrix", HeadingLevel.HEADING_1),
  hr(),
  body("The following matrix traces high-level product goals to SRS requirement identifiers, design artifacts, and test case identifiers. This matrix shall be maintained in the project's requirements management system (Jira/Confluence or equivalent) and updated on every sprint cycle."),
  gap(40),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2200, 2200, 2600, 2360],
    rows: [
      new TableRow({
        tableHeader: true,
        children: ["Product Goal", "SRS Requirement(s)", "Design Artifact", "Test Case(s)"].map((h, i) =>
          new TableCell({
            borders: cellBorder(MAROON),
            width: { size: [2200, 2200, 2600, 2360][i], type: WidthType.DXA },
            shading: { fill: MAROON, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, font: "Arial", size: 20 })] })],
          })
        ),
      }),
      ...[
        ["Teach touch-typing systematically", "FR-CL-001, FR-CL-002, FR-CL-003", "Curriculum Sequence Diagram v1.2", "TC-001 through TC-018"],
        ["Deliver real-time feedback", "FR-KF-001, FR-KF-002, FR-KF-003", "Keystroke Engine Design Doc", "TC-019 through TC-031"],
        ["Personalize learning path", "FR-AE-001 through FR-AE-005", "Adaptive Engine Spec v2.0", "TC-032 through TC-045"],
        ["Motivate continued practice", "FR-GM-001 through FR-GM-006", "Gamification System Design", "TC-046 through TC-060"],
        ["Support institutional use", "FR-PA-003, FR-PA-004, NFR-SEC-006", "Admin Console Wireframes", "TC-061 through TC-072"],
        ["Meet performance targets", "NFR-PR-001 through NFR-PR-006", "Performance Budget Sheet", "TC-073 through TC-082"],
        ["Ensure security compliance", "NFR-SEC-001 through NFR-SEC-006", "Security Architecture Diagram", "TC-083 through TC-094"],
        ["Ensure accessibility", "FR-CL-006 (RTL), Section 9 safety reqs", "Accessibility Audit Report", "TC-095 through TC-100"],
      ].map((r, ri) =>
        new TableRow({
          children: r.map((cell, ci) =>
            new TableCell({
              borders: cellBorder(),
              width: { size: [2200, 2200, 2600, 2360][ci], type: WidthType.DXA },
              shading: { fill: ri % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 19 })] })],
            })
          ),
        })
      ),
    ],
  }),
  new Paragraph({ children: [new PageBreak()] }),

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. APPENDICES
  // ─────────────────────────────────────────────────────────────────────────────
  hdr("14. Appendices", HeadingLevel.HEADING_1),
  hr(),

  hdr("Appendix A — Adaptive Difficulty Scoring Formula", HeadingLevel.HEADING_2),
  body("The adaptive engine computes a Learner Readiness Score (LRS) after each exercise using the following formula:"),
  new Paragraph({
    children: [new TextRun({
      text: "  LRS = (0.40 × WPM_normalized) + (0.40 × Accuracy_pct / 100) + (0.20 × (1 − Error_recurrence_rate))",
      font: "Courier New", size: 20, bold: true, color: MAROON,
    })],
    ...sp(120, 80),
  }),
  body("Where WPM_normalized = min(WPM / WPM_target_for_tier, 1.0). If LRS ≥ 0.85 for two consecutive sessions, the system advances the learner to the next tier. If LRS < 0.60 for two consecutive sessions, a remedial module is triggered."),
  gap(),

  hdr("Appendix B — Keyboard Layout Support Matrix", HeadingLevel.HEADING_2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 1560, 1560, 1560, 2340],
    rows: [
      new TableRow({
        tableHeader: true,
        children: ["Layout", "Latin Lessons", "Number Row", "Symbol Row", "Ghost Hand Support"].map((h, i) =>
          new TableCell({
            borders: cellBorder(MAROON),
            width: { size: [2340, 1560, 1560, 1560, 2340][i], type: WidthType.DXA },
            shading: { fill: MAROON, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, font: "Arial", size: 20 })] })],
          })
        ),
      }),
      ...[
        ["QWERTY (US/UK)", "Yes", "Yes", "Yes", "Yes (full)"],
        ["AZERTY (FR/BE)", "Yes", "Yes", "Partial", "Yes (letter keys)"],
        ["Dvorak", "Yes", "Yes", "Yes", "Yes (full)"],
        ["Colemak", "Yes", "Yes", "Yes", "Yes (full)"],
        ["QWERTZ (DE/AT)", "Yes", "Yes", "Partial", "Yes (letter keys)"],
        ["Arabic (Win/Mac)", "Yes", "Planned v2", "Planned v2", "Planned v2"],
      ].map((r, ri) =>
        new TableRow({
          children: r.map((cell, ci) =>
            new TableCell({
              borders: cellBorder(),
              width: { size: [2340, 1560, 1560, 1560, 2340][ci], type: WidthType.DXA },
              shading: { fill: ri % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })],
            })
          ),
        })
      ),
    ],
  }),
  gap(),

  hdr("Appendix C — Glossary of Keyboard Pedagogy Terms", HeadingLevel.HEADING_2),
  bold("Muscle Memory: ", "The phenomenon by which repeated physical actions (e.g., keystroke sequences) become automatic through practice, reducing cognitive load."),
  bold("Bigram: ", "A pair of consecutive characters. Problematic bigrams are character pairs that a specific learner consistently types with higher error rates or lower speed than average."),
  bold("Home Position: ", "The resting position of the fingers on the home row (A-S-D-F / J-K-L-; on QWERTY), used as the origin for all touch-typing finger movements."),
  bold("WPM Target by Level: ", "Benchmark WPM goals per tier — Tier 1 (Beginner): 15 WPM; Tier 5 (Intermediate): 45 WPM; Tier 10 (Advanced): 80 WPM."),
  gap(),

  hdr("Appendix D — Document Revision History", HeadingLevel.HEADING_2),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1200, 1800, 2760, 3600],
    rows: [
      new TableRow({
        tableHeader: true,
        children: ["Version", "Date", "Author", "Description"].map((h, i) =>
          new TableCell({
            borders: cellBorder(MAROON),
            width: { size: [1200, 1800, 2760, 3600][i], type: WidthType.DXA },
            shading: { fill: MAROON, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: WHITE, font: "Arial", size: 20 })] })],
          })
        ),
      }),
      ...[
        ["0.1", "2026-05-01", "TUC AI Lab — SE Division", "Initial draft — scope and functional requirements"],
        ["0.5", "2026-05-20", "TUC AI Lab — SE Division", "Added NFRs, security, maintainability sections"],
        ["0.9", "2026-06-08", "TUC AI Lab — SE Division", "RTM added; appendices completed; peer review"],
        ["1.0", "2026-06-15", "TUC AI Lab — SE Division", "Final release for stakeholder sign-off"],
      ].map((r, ri) =>
        new TableRow({
          children: r.map((cell, ci) =>
            new TableCell({
              borders: cellBorder(),
              width: { size: [1200, 1800, 2760, 3600][ci], type: WidthType.DXA },
              shading: { fill: ri % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 60, bottom: 60, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 20 })] })],
            })
          ),
        })
      ),
    ],
  }),
  gap(120),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: "— End of Document —",
      font: "Arial", size: 22, italics: true, color: GOLD,
    })],
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 1 },
    },
    spacing: { before: 200, after: 200 },
  }),
];

// ── document ──────────────────────────────────────────────────────────────────
const doc = new Document({
  creator: "TUC AI Lab",
  title: "TypeMaster Pro SRS v1.0",
  subject: "Software Requirements Specification — IEEE Std 830-1998",
  description: "Complete 14-section SRS for an adaptive typing tutor system.",

  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },

  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: BLACK } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: MAROON },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: GOLD },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 2 },
      },
    ],
  },

  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "TypeMaster Pro — SRS v1.0", font: "Arial", size: 18, color: BLUE, bold: true }),
              new TextRun({ text: "   |   IEEE Std 830-1998 / 29148-2018   |   TUC AI Lab", font: "Arial", size: 18, color: "888888" }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 2 } },
            spacing: { before: 0, after: 200 },
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: "Confidential — For Internal Use Only   |   Page ", font: "Arial", size: 18, color: "888888" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: MAROON, bold: true }),
              new TextRun({ text: " of ", font: "Arial", size: 18, color: "888888" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: MAROON, bold: true }),
            ],
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 2 } },
            spacing: { before: 200, after: 0 },
          }),
        ],
      }),
    },
    children,
  }],
});

// Create directories and write file
function run() {
  const claudeSrsDir = "/home/claude/srs";
  const docsDir = path.join(__dirname, "../docs");

  [claudeSrsDir, docsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  Packer.toBuffer(doc).then(buf => {
    // Write to required location
    fs.writeFileSync(path.join(claudeSrsDir, "TypeMaster_Pro_SRS_v1.0.docx"), buf);
    console.log("Written successfully to /home/claude/srs");
    
    // Write copy to local docs folder
    fs.writeFileSync(path.join(docsDir, "TypeMaster_Pro_SRS_v1.0.docx"), buf);
    console.log("Written copy successfully to /docs");
    
    process.exit(0);
  }).catch(err => { 
    console.error(err); 
    process.exit(1); 
  });
}

run();
