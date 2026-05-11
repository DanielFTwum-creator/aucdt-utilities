const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumberElement, PageBreak, LevelFormat,
  TableOfContents, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const BLUE = "1F3864";
const LIGHT_BLUE = "D6E4F0";
const MID_BLUE = "2E75B6";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: BLUE })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: MID_BLUE })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 60 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color: "444444" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    alignment: opts.justify ? AlignmentType.BOTH : AlignmentType.LEFT,
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function sp(before = 120) {
  return new Paragraph({ spacing: { before, after: 0 }, children: [new TextRun("")] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function reqTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [936, 5616, 1404, 1404],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell("ID", 936, LIGHT_BLUE, true),
          cell("Requirement", 5616, LIGHT_BLUE, true),
          cell("Priority", 1404, LIGHT_BLUE, true),
          cell("Source", 1404, LIGHT_BLUE, true),
        ]
      }),
      ...rows.map(r => new TableRow({
        children: [
          cell(r[0], 936),
          cell(r[1], 5616),
          cell(r[2], 1404),
          cell(r[3], 1404),
        ]
      }))
    ]
  });
}

function cell(text, w, fill = null, bold = false) {
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      children: [new TextRun({ text, size: 20, font: "Arial", bold, color: fill ? BLUE : "000000" })]
    })]
  });
}

function twoColTable(left, right, lw = 4680, rw = 4680) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [lw, rw],
    rows: [new TableRow({
      children: [
        new TableCell({ borders: noBorders, width: { size: lw, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 0, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: left, size: 22, font: "Arial" })] })] }),
        new TableCell({ borders: noBorders, width: { size: rw, type: WidthType.DXA }, margins: { top: 40, bottom: 40, left: 120, right: 0 }, children: [new Paragraph({ children: [new TextRun({ text: right, size: 22, font: "Arial" })] })] }),
      ]
    })]
  });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: MID_BLUE },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "444444" },
        paragraph: { spacing: { before: 180, after: 60 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 } },
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "Software Requirements Specification", size: 18, font: "Arial", color: "888888" }),
              new TextRun({ text: "    |    Blood Glucose Self-Monitoring Application", size: 18, font: "Arial", color: MID_BLUE }),
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 } },
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { before: 80 },
            children: [
              new TextRun({ text: "Rophe Specialist Care — Confidential", size: 18, font: "Arial", color: "888888" }),
              new TextRun({ text: "\tPage ", size: 18, font: "Arial", color: "888888" }),
              new PageNumberElement(),
            ]
          })
        ]
      })
    },
    children: [

      // ─── COVER PAGE ───────────────────────────────────────────────────────
      sp(2880),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "SOFTWARE REQUIREMENTS SPECIFICATION", size: 44, bold: true, font: "Arial", color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: MID_BLUE, space: 8 } },
        children: [new TextRun({ text: "Blood Glucose Self-Monitoring Application", size: 32, font: "Arial", color: MID_BLUE })]
      }),
      sp(360),
      new Table({
        width: { size: 7200, type: WidthType.DXA },
        columnWidths: [2400, 4800],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Document ID:", bold: true, size: 22, font: "Arial", color: "555555" })] })] }),
            new TableCell({ borders: noBorders, width: { size: 4800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "BGMA-SRS-001", size: 22, font: "Arial" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Version:", bold: true, size: 22, font: "Arial", color: "555555" })] })] }),
            new TableCell({ borders: noBorders, width: { size: 4800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "1.0", size: 22, font: "Arial" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true, size: 22, font: "Arial", color: "555555" })] })] }),
            new TableCell({ borders: noBorders, width: { size: 4800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "May 11, 2026", size: 22, font: "Arial" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Client:", bold: true, size: 22, font: "Arial", color: "555555" })] })] }),
            new TableCell({ borders: noBorders, width: { size: 4800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Rophe Specialist Care", size: 22, font: "Arial" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Standard:", bold: true, size: 22, font: "Arial", color: "555555" })] })] }),
            new TableCell({ borders: noBorders, width: { size: 4800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018", size: 22, font: "Arial" })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2400, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Status:", bold: true, size: 22, font: "Arial", color: "555555" })] })] }),
            new TableCell({ borders: noBorders, width: { size: 4800, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Draft", size: 22, font: "Arial", color: "CC4400" })] })] }),
          ]}),
        ]
      }),

      pageBreak(),

      // ─── REVISION HISTORY ─────────────────────────────────────────────────
      h1("Revision History"),
      sp(80),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 1400, 3760, 2800],
        rows: [
          new TableRow({ tableHeader: true, children: [
            cell("Version", 1400, LIGHT_BLUE, true),
            cell("Date", 1400, LIGHT_BLUE, true),
            cell("Description", 3760, LIGHT_BLUE, true),
            cell("Author", 2800, LIGHT_BLUE, true),
          ]}),
          new TableRow({ children: [
            cell("1.0", 1400),
            cell("2026-05-11", 1400),
            cell("Initial release", 3760),
            cell("Development Team", 2800),
          ]}),
        ]
      }),

      pageBreak(),

      // ─── TABLE OF CONTENTS ────────────────────────────────────────────────
      h1("Table of Contents"),
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-3",
        stylesWithLevels: [
          { styleId: "Heading1", level: 1 },
          { styleId: "Heading2", level: 2 },
          { styleId: "Heading3", level: 3 },
        ]
      }),

      pageBreak(),

      // ─── 1. INTRODUCTION ──────────────────────────────────────────────────
      h1("1. Introduction"),

      h2("1.1 Purpose"),
      p("This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the Blood Glucose Self-Monitoring Application (BGMA). The application is intended for use by patients of Rophe Specialist Care who are required to track their blood glucose levels across defined daily measurement windows. This document is prepared in accordance with IEEE Std 830-1998 and ISO/IEC/IEEE 29148:2018.", { justify: true }),
      p("The intended audience for this SRS includes: the development team, QA engineers, project managers, the clinical team at Rophe Specialist Care, and regulatory reviewers."),

      h2("1.2 Scope"),
      p("The Blood Glucose Self-Monitoring Application (BGMA) is a web-based patient-facing tool that enables users to:"),
      bullet("Record blood glucose readings across six daily measurement windows (fasting, 2 hrs post-breakfast, pre-lunch, 2 hrs post-lunch, pre-dinner, and 2 hrs post-dinner)"),
      bullet("Store readings persistently across browser sessions using a key-value storage API"),
      bullet("View readings organised by calendar month in a format consistent with Rophe Specialist Care's paper-based monitoring form"),
      bullet("Generate and export printable monthly reports in PDF format, suitable for clinical review"),
      bullet("Export data as a CSV file for downstream analysis or record-keeping"),
      bullet("View at-a-glance summary statistics including average fasting glucose, average post-meal glucose, and highest recorded reading per month"),
      sp(60),
      p("The application does not include: clinical decision support, prescription functionality, communication with healthcare providers, or integration with external electronic health record (EHR) systems."),

      h2("1.3 Definitions, Acronyms, and Abbreviations"),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 7020],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("Term / Acronym", 2340, LIGHT_BLUE, true), cell("Definition", 7020, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("BGMA", 2340), cell("Blood Glucose Monitoring Application — the system described in this document", 7020)] }),
          new TableRow({ children: [cell("SRS", 2340), cell("Software Requirements Specification", 7020)] }),
          new TableRow({ children: [cell("mmol/L", 2340), cell("Millimoles per litre — the SI unit used for blood glucose concentration in Ghana and most non-US territories", 7020)] }),
          new TableRow({ children: [cell("Fasting glucose", 2340), cell("Blood glucose measurement taken after at least 8 hours without food or drink (other than water)", 7020)] }),
          new TableRow({ children: [cell("Post-meal glucose", 2340), cell("Blood glucose measurement taken 2 hours after the start of a meal", 7020)] }),
          new TableRow({ children: [cell("IEEE", 2340), cell("Institute of Electrical and Electronics Engineers", 7020)] }),
          new TableRow({ children: [cell("CSV", 2340), cell("Comma-Separated Values — a plain-text tabular data format", 7020)] }),
          new TableRow({ children: [cell("PDF", 2340), cell("Portable Document Format", 7020)] }),
          new TableRow({ children: [cell("SPA", 2340), cell("Single-Page Application", 7020)] }),
          new TableRow({ children: [cell("UI", 2340), cell("User Interface", 7020)] }),
          new TableRow({ children: [cell("UX", 2340), cell("User Experience", 7020)] }),
          new TableRow({ children: [cell("EHR", 2340), cell("Electronic Health Record", 7020)] }),
          new TableRow({ children: [cell("IDF", 2340), cell("International Diabetes Federation", 7020)] }),
          new TableRow({ children: [cell("WHO", 2340), cell("World Health Organisation", 7020)] }),
          new TableRow({ children: [cell("WCAG", 2340), cell("Web Content Accessibility Guidelines", 7020)] }),
          new TableRow({ children: [cell("FDA", 2340), cell("Food and Drugs Authority (Ghana)", 7020)] }),
        ]
      }),

      h2("1.4 References"),
      bullet("IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications"),
      bullet("ISO/IEC/IEEE 29148:2018: Systems and software engineering — Life cycle processes — Requirements engineering"),
      bullet("Ghana Health Service Clinical Guidelines for Diabetes Management (latest edition)"),
      bullet("Rophe Specialist Care Blood Glucose Monitoring Paper Form (reference document)"),
      bullet("WCAG 2.1: Web Content Accessibility Guidelines, Level AA"),
      bullet("International Diabetes Federation (IDF) Diabetes Atlas, 10th Edition, 2021"),
      bullet("WHO Global Report on Diabetes, 2016"),

      h2("1.5 Overview"),
      p("The remainder of this SRS is organised as follows:"),
      bullet("Section 2 — Overall Description: product perspective, user characteristics, constraints, and assumptions"),
      bullet("Section 3 — Specific Requirements: detailed functional, non-functional, interface, and data requirements"),
      bullet("Section 4 — Appendices: use cases, data dictionary, and traceability matrix"),

      pageBreak(),

      // ─── 2. OVERALL DESCRIPTION ───────────────────────────────────────────
      h1("2. Overall Description"),

      h2("2.1 Product Perspective"),
      p("The BGMA is a standalone web-based single-page application (SPA). It operates within a modern web browser without requiring server-side processing or user account creation. Persistent storage is achieved through a browser-native key-value storage API. The application is designed as a digital replacement for the Rophe Specialist Care paper glucose monitoring form, preserving the same column structure and monthly grouping expected by the clinical team.", { justify: true }),
      p("The system interfaces are limited to the user's browser environment. No external APIs, backend databases, or third-party clinical systems are involved in this version."),
      sp(60),
      p("The diagram below illustrates the system context:"),
      sp(80),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders,
          shading: { fill: "F5F8FC", type: ShadingType.CLEAR },
          margins: { top: 200, bottom: 200, left: 300, right: 300 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "[ Patient / Browser Environment ]", bold: true, size: 22, font: "Arial", color: MID_BLUE })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "┌──────────────────────────────────────┐", size: 20, font: "Courier New", color: "444444" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "│   Blood Glucose Self-Monitoring App  │", size: 20, font: "Courier New", color: "444444" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "│   (Single HTML file, no server)      │", size: 20, font: "Courier New", color: "444444" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "│                                      │", size: 20, font: "Courier New", color: "444444" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "│   ┌──────────────────────────────┐   │", size: 20, font: "Courier New", color: "444444" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "│   │  Browser Key-Value Storage  │   │", size: 20, font: "Courier New", color: "444444" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "│   └──────────────────────────────┘   │", size: 20, font: "Courier New", color: "444444" })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: "└──────────────────────────────────────┘", size: 20, font: "Courier New", color: "444444" })] }),
          ]
        })]})],
      }),
      sp(80),
      p("Figure 1: System Context Diagram — all data remains within the browser environment.", { color: "888888" }),

      h2("2.2 Product Functions"),
      p("At a high level, the BGMA shall perform the following functions:"),
      numbered("Data entry: allow the user to add dated rows and input glucose readings per measurement window"),
      numbered("Data persistence: save all entered readings in browser storage, automatically retrievable on subsequent sessions"),
      numbered("Monthly view: present readings filtered by month in the Rophe standard table format"),
      numbered("Threshold alerting: visually distinguish readings that exceed clinical thresholds from those within range"),
      numbered("Summary statistics: compute and display average fasting glucose, average post-meal glucose, and highest reading per month"),
      numbered("Print/PDF export: render a clean, printer-friendly monthly report"),
      numbered("CSV export: download all recorded data as a CSV file"),

      h2("2.3 User Classes and Characteristics"),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 3680, 3680],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("User Class", 2000, LIGHT_BLUE, true), cell("Description", 3680, LIGHT_BLUE, true), cell("Technical Proficiency", 3680, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("Patient / Primary User", 2000), cell("Rophe Specialist Care patients who self-monitor blood glucose daily", 3680), cell("Basic — comfortable with smartphones and simple web interfaces", 3680)] }),
          new TableRow({ children: [cell("Clinician", 2000), cell("Doctor or nurse who reviews printed or PDF monthly reports", 3680), cell("Not required to interact with the application directly", 3680)] }),
          new TableRow({ children: [cell("Administrator / Developer", 2000), cell("Technical staff who deploy, maintain, or update the application", 3680), cell("Advanced — familiar with HTML, CSS, JavaScript, and browser developer tools", 3680)] }),
        ]
      }),

      h2("2.4 Operating Environment"),
      bullet("Web browser: any modern evergreen browser (Chrome 110+, Firefox 110+, Safari 16+, Edge 110+)"),
      bullet("Device: desktop computer, laptop, tablet, or smartphone"),
      bullet("Connectivity: the application shall be fully functional without an internet connection after initial load, except for the CSV export feature which relies on browser Blob API"),
      bullet("Storage: browser key-value storage API with a minimum capacity assumption of 5 MB"),
      bullet("Screen resolution: minimum 360px viewport width (mobile-first design)"),

      h2("2.5 Design and Implementation Constraints"),
      bullet("The application must not transmit any patient data to external servers"),
      bullet("All data must remain in the user's browser storage"),
      bullet("No user authentication or account system is to be implemented in version 1.0"),
      bullet("The visual layout of the monthly report must match the column structure of the Rophe paper form"),
      bullet("The application must be implemented as a single HTML file with embedded CSS and JavaScript, requiring no build tools or server deployment"),
      bullet("Blood glucose values shall be expressed exclusively in millimoles per litre (mmol/L)"),
      bullet("No third-party JavaScript frameworks or libraries shall be loaded from external CDNs in order to ensure offline operation"),
      bullet("The application codebase shall remain maintainable by a single developer familiar with vanilla HTML, CSS, and JavaScript"),

      h2("2.6 Assumptions and Dependencies"),
      bullet("Users have access to a blood glucose meter that reports values in mmol/L"),
      bullet("The user's browser supports the key-value storage API used for persistence"),
      bullet("Clinical glucose thresholds defined in this SRS (fasting >= 7.0 mmol/L; post-meal >= 8.9 mmol/L) reflect the thresholds used by Rophe Specialist Care and are subject to clinical review"),
      bullet("The application is not a regulated medical device under the Food and Drugs Authority (FDA) of Ghana in version 1.0, as it does not interpret, diagnose, or recommend treatment; it is a record-keeping aid only"),
      bullet("Users are responsible for the accuracy of the readings they enter; the application performs no verification against meter data"),
      bullet("The browser storage is not cleared by the user or by browser privacy settings between sessions"),

      pageBreak(),

      // ─── 3. SPECIFIC REQUIREMENTS ─────────────────────────────────────────
      h1("3. Specific Requirements"),

      h2("3.1 Functional Requirements"),

      h3("3.1.1 Data Entry"),
      sp(60),
      reqTable([
        ["FR-001", "The system shall allow the user to add a new entry row pre-populated with the current calendar date in MM/DD/YY format.", "High", "Patient"],
        ["FR-002", "Each entry row shall contain six numeric input fields corresponding to the six measurement windows: fasting, 2 hrs post-breakfast, pre-lunch, 2 hrs post-lunch, pre-dinner, 2 hrs post-dinner.", "High", "Patient"],
        ["FR-003", "Each numeric input field shall accept decimal values to one decimal place (e.g., 6.8, 10.5).", "High", "Patient"],
        ["FR-004", "Input fields shall accept values in the range 1.0 to 30.0 mmol/L; values outside this range shall trigger an inline validation warning.", "High", "Patient"],
        ["FR-005", "Empty input fields shall be treated as 'no reading taken' and shall not affect statistical calculations.", "High", "Patient"],
        ["FR-006", "The user shall be able to edit any previously entered value by tapping or clicking the corresponding cell.", "High", "Patient"],
        ["FR-028", "The user shall be able to delete an individual entry row via a clearly labelled delete control; a confirmation prompt shall be displayed before deletion.", "Medium", "Patient"],
        ["FR-029", "The date field of an existing entry shall be editable to allow correction of an incorrect date.", "Medium", "Patient"],
      ]),

      sp(120),
      h3("3.1.2 Data Persistence"),
      sp(60),
      reqTable([
        ["FR-007", "The system shall automatically save all entry data to browser key-value storage when the user taps the Save button.", "High", "Patient"],
        ["FR-008", "On application load, the system shall retrieve and display all previously saved data.", "High", "Patient"],
        ["FR-009", "If no saved data exists, the system shall initialise with an empty log.", "Medium", "Patient"],
        ["FR-010", "The system shall handle storage read/write failures gracefully, displaying a user-readable error message without data loss.", "High", "Patient"],
        ["FR-030", "The system shall provide a Clear All Data option that removes all stored entries after a two-step confirmation dialog.", "Medium", "Patient"],
      ]),

      sp(120),
      h3("3.1.3 Monthly Report View"),
      sp(60),
      reqTable([
        ["FR-011", "The system shall provide a month-selector control that lists all calendar months for which at least one entry exists.", "High", "Patient"],
        ["FR-012", "The monthly view shall display only the entries belonging to the selected calendar month.", "High", "Patient"],
        ["FR-013", "The monthly view table shall use the same column order as the Rophe Specialist Care paper form: No., Date, Fasting, 2 hrs after breakfast, Before lunch, 2 hrs after lunch, Before dinner, 2 hrs after dinner.", "High", "Clinician"],
        ["FR-014", "Each row shall be numbered sequentially from 1 within the displayed month.", "Medium", "Clinician"],
        ["FR-015", "A summary row at the bottom of the monthly view shall display: total number of individual readings, average fasting glucose, average post-meal glucose (post-breakfast, post-lunch, post-dinner combined), and the highest single reading for the month.", "High", "Clinician"],
        ["FR-031", "The month-selector shall default to the most recently active month (the month containing the latest entry) on application load.", "Medium", "Patient"],
      ]),

      sp(120),
      h3("3.1.4 Threshold Highlighting"),
      sp(60),
      reqTable([
        ["FR-016", "Any fasting glucose reading >= 7.0 mmol/L shall be rendered in a visually distinct danger colour (red).", "High", "Patient / Clinician"],
        ["FR-017", "Any post-meal glucose reading (post-breakfast, post-lunch, post-dinner) >= 8.9 mmol/L shall be rendered in a danger colour.", "High", "Patient / Clinician"],
        ["FR-018", "Readings below the respective thresholds shall be rendered in a success colour (green).", "Medium", "Patient / Clinician"],
        ["FR-019", "Empty cells shall be rendered in a neutral muted style, distinct from both danger and success colours.", "Low", "Patient"],
        ["FR-032", "Pre-meal readings (pre-lunch, pre-dinner) >= 7.0 mmol/L shall be rendered in the same danger colour as fasting readings.", "High", "Patient / Clinician"],
      ]),

      sp(120),
      h3("3.1.5 Export Features"),
      sp(60),
      reqTable([
        ["FR-020", "The system shall provide a Print / Save PDF button that triggers the browser print dialog, rendering only the monthly report table (excluding navigation controls).", "High", "Patient"],
        ["FR-021", "The printed/PDF output shall include: the Rophe Specialist Care header, the selected month and year, the patient name field, the doctor name field, the full data table, and the summary statistics row.", "High", "Clinician"],
        ["FR-022", "The system shall provide an Export CSV button that downloads a CSV file containing all entries across all months.", "Medium", "Patient"],
        ["FR-023", "The CSV file shall include a header row with column names matching the Rophe form columns.", "Medium", "Patient"],
        ["FR-024", "The CSV filename shall be blood_glucose_log.csv by default.", "Low", "Patient"],
        ["FR-033", "The print stylesheet shall suppress all interactive UI elements (buttons, dropdowns, navigation) from appearing in the printed output.", "High", "Clinician"],
      ]),

      sp(120),
      h3("3.1.6 Summary Statistics"),
      sp(60),
      reqTable([
        ["FR-025", "The main log view shall display a summary panel containing: total entries with at least one reading, average fasting glucose across all dates, average post-meal glucose across all dates, and the highest single reading across all dates.", "High", "Patient"],
        ["FR-026", "Summary values shall update dynamically as the user enters or modifies readings.", "Medium", "Patient"],
        ["FR-027", "Summary statistics shall be calculated to one decimal place.", "High", "Patient / Clinician"],
        ["FR-034", "The summary panel shall display the count of above-threshold readings alongside the total reading count for the current month (e.g., '5 of 18 readings above threshold').", "Medium", "Clinician"],
      ]),

      h2("3.2 Non-Functional Requirements"),

      h3("3.2.1 Performance"),
      sp(60),
      reqTable([
        ["NFR-001", "The application shall load and render fully within 3 seconds on a standard 4G mobile connection.", "High", "Patient"],
        ["NFR-002", "Data entry input response (character echo) shall occur within 100 ms of user input.", "High", "Patient"],
        ["NFR-003", "Save and load operations shall complete within 500 ms for datasets containing up to 500 entries.", "Medium", "Patient"],
        ["NFR-017", "The application file size (single HTML) shall not exceed 500 KB uncompressed to ensure fast load on constrained mobile connections.", "Medium", "Development Team"],
      ]),

      sp(120),
      h3("3.2.2 Reliability"),
      sp(60),
      reqTable([
        ["NFR-004", "The application shall not lose user data due to an unhandled JavaScript exception; all data-mutating operations shall be wrapped in error-handling logic.", "High", "Patient"],
        ["NFR-005", "The application shall display a visible confirmation message after each successful save operation.", "Medium", "Patient"],
        ["NFR-018", "The application shall validate the integrity of data loaded from storage on startup; if the stored data is malformed, it shall log the error and initialise with an empty log rather than crashing.", "High", "Patient"],
      ]),

      sp(120),
      h3("3.2.3 Usability"),
      sp(60),
      reqTable([
        ["NFR-006", "All interactive controls shall have a minimum tap target size of 44 x 44 CSS pixels, in compliance with WCAG 2.1 Success Criterion 2.5.5.", "High", "Patient"],
        ["NFR-007", "The application shall use colour contrast ratios of at least 4.5:1 for normal text and 3:1 for large text, in compliance with WCAG 2.1 AA.", "High", "Patient"],
        ["NFR-008", "The application shall be operable on mobile devices with viewport widths from 360px upward without horizontal scrolling of the main interface.", "High", "Patient"],
        ["NFR-009", "All threshold-based colour coding shall be supplemented by at least one non-colour indicator (e.g., font weight) to support colour-blind users.", "Medium", "Patient"],
        ["NFR-019", "The application shall display all user-facing text in English. All labels, error messages, and instructions shall be written in plain language at a reading level accessible to non-specialist patients.", "High", "Patient"],
        ["NFR-020", "Numeric input fields shall display the mmol/L unit label as a visible suffix or placeholder to prevent entry of values in incorrect units.", "Medium", "Patient"],
      ]),

      sp(120),
      h3("3.2.4 Security and Privacy"),
      sp(60),
      reqTable([
        ["NFR-010", "No patient data shall be transmitted over any network connection.", "Critical", "Patient / Clinician"],
        ["NFR-011", "The application shall not load any third-party analytics, tracking, or advertising scripts.", "Critical", "Patient / Clinician"],
        ["NFR-012", "All data shall remain exclusively in the user's browser environment.", "Critical", "Patient / Clinician"],
        ["NFR-021", "The application shall not request or access any device permissions (camera, microphone, geolocation, contacts) beyond those required for standard web page rendering.", "High", "Patient"],
        ["NFR-022", "The exported CSV file shall contain no metadata or identifiers beyond what the user has explicitly entered.", "High", "Patient / Clinician"],
      ]),

      sp(120),
      h3("3.2.5 Maintainability"),
      sp(60),
      reqTable([
        ["NFR-013", "Clinical threshold values (fasting and post-meal) shall be defined in a single configuration object at the top of the application code, enabling update without modification of rendering logic.", "Medium", "Development Team"],
        ["NFR-014", "Column definitions shall be stored in an array constant, enabling addition or removal of measurement windows with minimal code change.", "Medium", "Development Team"],
        ["NFR-023", "The application source code shall include inline comments for all non-obvious logic, including threshold calculation, storage serialisation, and print stylesheet overrides.", "Low", "Development Team"],
      ]),

      sp(120),
      h3("3.2.6 Portability"),
      sp(60),
      reqTable([
        ["NFR-015", "The application shall be deployable by opening a single HTML file in a browser; no web server, build tools, or runtime dependencies shall be required.", "High", "Development Team"],
        ["NFR-016", "The application shall function correctly on Windows, macOS, Android, and iOS operating systems.", "High", "Patient"],
      ]),

      h2("3.3 Interface Requirements"),

      h3("3.3.1 User Interface"),
      bullet("The main log screen shall present a data entry table with one row per date, scrollable vertically"),
      bullet("A persistent top-of-screen summary panel shall show key statistics at a glance"),
      bullet("A monthly report screen shall be accessible via a month-selector dropdown, with a Print / Save PDF action button"),
      bullet("A toast notification shall confirm successful save operations"),
      bullet("The interface shall support both light and dark colour schemes via CSS variables, responding to the user's system preference"),
      bullet("The patient name and doctor name fields shall appear at the top of the monthly report view and shall be included in the printed output (FR-021)"),
      bullet("A header logo or wordmark for Rophe Specialist Care shall appear on the printed/PDF report"),

      h3("3.3.2 Hardware Interface"),
      bullet("No direct hardware interfaces are required; the application relies on the browser to abstract keyboard, touchscreen, and pointer input"),

      h3("3.3.3 Software Interface"),
      bullet("Browser key-value storage API (window.storage): used for all data persistence"),
      bullet("Browser Blob API and URL.createObjectURL: used for CSV file generation"),
      bullet("Browser window.print() API: used for PDF/print export"),
      bullet("Browser CSS @media print: used to apply print-specific styles that suppress navigation and highlight the report table"),

      h3("3.3.4 Communication Interface"),
      p("The application has no communication interfaces in version 1.0. No data is sent to or received from any external system."),

      h2("3.4 Data Requirements"),

      h3("3.4.1 Data Model"),
      p("Each glucose log entry is represented as a JSON object with the following fields:"),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 1560, 1560, 3900],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("Field", 2340, LIGHT_BLUE, true), cell("Type", 1560, LIGHT_BLUE, true), cell("Required", 1560, LIGHT_BLUE, true), cell("Description", 3900, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("date", 2340), cell("String", 1560), cell("Yes", 1560), cell("Calendar date in MM/DD/YY format (e.g., 2/5/26)", 3900)] }),
          new TableRow({ children: [cell("fasting", 2340), cell("String", 1560), cell("No", 1560), cell("Fasting glucose in mmol/L, or empty string if not measured", 3900)] }),
          new TableRow({ children: [cell("post_breakfast", 2340), cell("String", 1560), cell("No", 1560), cell("2-hr post-breakfast glucose in mmol/L, or empty string", 3900)] }),
          new TableRow({ children: [cell("pre_lunch", 2340), cell("String", 1560), cell("No", 1560), cell("Pre-lunch glucose in mmol/L, or empty string", 3900)] }),
          new TableRow({ children: [cell("post_lunch", 2340), cell("String", 1560), cell("No", 1560), cell("2-hr post-lunch glucose in mmol/L, or empty string", 3900)] }),
          new TableRow({ children: [cell("pre_dinner", 2340), cell("String", 1560), cell("No", 1560), cell("Pre-dinner glucose in mmol/L, or empty string", 3900)] }),
          new TableRow({ children: [cell("post_dinner", 2340), cell("String", 1560), cell("No", 1560), cell("2-hr post-dinner glucose in mmol/L, or empty string", 3900)] }),
        ]
      }),
      sp(120),
      p("The full dataset is stored as a JSON array of entry objects under the storage key glucose_rows."),
      sp(60),
      p("Example storage payload:"),
      sp(40),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders,
          shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 200, right: 200 },
          children: [
            new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: 'Key:   glucose_rows', size: 19, font: "Courier New", color: "333333" })] }),
            new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: 'Value: [', size: 19, font: "Courier New", color: "333333" })] }),
            new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '  { "date": "5/11/26", "fasting": "6.2", "post_breakfast": "8.4",', size: 19, font: "Courier New", color: "333333" })] }),
            new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '    "pre_lunch": "5.9", "post_lunch": "9.1", "pre_dinner": "6.1", "post_dinner": "7.8" },', size: 19, font: "Courier New", color: "333333" })] }),
            new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '  { "date": "5/12/26", "fasting": "7.3", "post_breakfast": "",', size: 19, font: "Courier New", color: "333333" })] }),
            new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '    "pre_lunch": "6.8", "post_lunch": "8.1", "pre_dinner": "", "post_dinner": "8.6" }', size: 19, font: "Courier New", color: "333333" })] }),
            new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: ']', size: 19, font: "Courier New", color: "333333" })] }),
          ]
        })]})],
      }),

      h3("3.4.2 Data Retention"),
      p("Data persists indefinitely in browser storage until explicitly cleared by the user or the browser. No automatic expiry is applied. Users are advised to use the CSV export feature regularly to maintain an offline backup."),

      h3("3.4.3 Data Validation Rules"),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 4680],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("Field", 2340, LIGHT_BLUE, true), cell("Rule", 2340, LIGHT_BLUE, true), cell("Action on Violation", 4680, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("date", 2340), cell("Must be a valid calendar date", 2340), cell("Inline error message; row not saved until corrected", 4680)] }),
          new TableRow({ children: [cell("fasting, post_breakfast, pre_lunch, post_lunch, pre_dinner, post_dinner", 2340), cell("Numeric, 1 decimal place, range 1.0–30.0 or empty", 2340), cell("Inline warning for out-of-range; non-numeric characters blocked at input", 4680)] }),
          new TableRow({ children: [cell("All glucose fields", 2340), cell("Cannot contain letters or special characters", 2340), cell("Input field rejects non-numeric characters in real time", 4680)] }),
        ]
      }),

      pageBreak(),

      // ─── 4. APPENDICES ────────────────────────────────────────────────────
      h1("4. Appendices"),

      h2("Appendix A — Use Case Summary"),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [936, 2808, 2808, 2808],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("UC", 936, LIGHT_BLUE, true), cell("Use Case", 2808, LIGHT_BLUE, true), cell("Primary Actor", 2808, LIGHT_BLUE, true), cell("Related FRs", 2808, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("UC-01", 936), cell("Record daily glucose reading", 2808), cell("Patient", 2808), cell("FR-001 to FR-006, FR-028, FR-029", 2808)] }),
          new TableRow({ children: [cell("UC-02", 936), cell("Save readings to storage", 2808), cell("Patient", 2808), cell("FR-007 to FR-010, FR-030", 2808)] }),
          new TableRow({ children: [cell("UC-03", 936), cell("View monthly report", 2808), cell("Patient / Clinician", 2808), cell("FR-011 to FR-015, FR-031", 2808)] }),
          new TableRow({ children: [cell("UC-04", 936), cell("Print/export PDF report", 2808), cell("Patient", 2808), cell("FR-020, FR-021, FR-033", 2808)] }),
          new TableRow({ children: [cell("UC-05", 936), cell("Export data as CSV", 2808), cell("Patient", 2808), cell("FR-022 to FR-024", 2808)] }),
          new TableRow({ children: [cell("UC-06", 936), cell("Review summary statistics", 2808), cell("Patient / Clinician", 2808), cell("FR-025 to FR-027, FR-034", 2808)] }),
          new TableRow({ children: [cell("UC-07", 936), cell("Delete an entry row", 2808), cell("Patient", 2808), cell("FR-028", 2808)] }),
          new TableRow({ children: [cell("UC-08", 936), cell("Clear all stored data", 2808), cell("Patient", 2808), cell("FR-030", 2808)] }),
        ]
      }),

      sp(120),
      h2("Appendix B — Clinical Threshold Reference"),
      p("The following thresholds are applied for visual flagging within the application. These values should be confirmed with the supervising clinician before deployment."),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("Measurement Window", 3120, LIGHT_BLUE, true), cell("High Threshold (mmol/L)", 3120, LIGHT_BLUE, true), cell("Clinical Basis", 3120, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("Fasting", 3120), cell(">= 7.0", 3120), cell("IDF / WHO fasting hyperglycaemia threshold", 3120)] }),
          new TableRow({ children: [cell("2 hrs post-breakfast", 3120), cell(">= 8.9", 3120), cell("IDF 2-hr post-prandial target (non-diabetic < 7.8; diabetic target < 8.9)", 3120)] }),
          new TableRow({ children: [cell("Pre-lunch", 3120), cell(">= 7.0", 3120), cell("Pre-prandial target", 3120)] }),
          new TableRow({ children: [cell("2 hrs post-lunch", 3120), cell(">= 8.9", 3120), cell("Post-prandial target", 3120)] }),
          new TableRow({ children: [cell("Pre-dinner", 3120), cell(">= 7.0", 3120), cell("Pre-prandial target", 3120)] }),
          new TableRow({ children: [cell("2 hrs post-dinner", 3120), cell(">= 8.9", 3120), cell("Post-prandial target", 3120)] }),
        ]
      }),
      sp(80),
      p("Note: Normal fasting glucose is generally accepted as < 6.1 mmol/L. The range 6.1–6.9 mmol/L represents impaired fasting glucose (pre-diabetes). The threshold of >= 7.0 mmol/L is the WHO/IDF diagnostic threshold for diabetes mellitus. All thresholds must be clinically approved before use in patient-facing deployment.", { justify: true }),

      sp(120),
      h2("Appendix C — Requirements Traceability Matrix"),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1404, 4212, 1404, 2340],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("Req. ID", 1404, LIGHT_BLUE, true), cell("Requirement Summary", 4212, LIGHT_BLUE, true), cell("Priority", 1404, LIGHT_BLUE, true), cell("Test Case Ref.", 2340, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("FR-001", 1404), cell("Add row with today's date", 4212), cell("High", 1404), cell("TC-001", 2340)] }),
          new TableRow({ children: [cell("FR-002", 1404), cell("Six measurement window inputs per row", 4212), cell("High", 1404), cell("TC-002", 2340)] }),
          new TableRow({ children: [cell("FR-003", 1404), cell("Decimal input to 1 d.p.", 4212), cell("High", 1404), cell("TC-003", 2340)] }),
          new TableRow({ children: [cell("FR-004", 1404), cell("Range validation 1.0–30.0 mmol/L", 4212), cell("High", 1404), cell("TC-004", 2340)] }),
          new TableRow({ children: [cell("FR-005", 1404), cell("Empty fields excluded from statistics", 4212), cell("High", 1404), cell("TC-005", 2340)] }),
          new TableRow({ children: [cell("FR-006", 1404), cell("In-place editing of existing values", 4212), cell("High", 1404), cell("TC-006", 2340)] }),
          new TableRow({ children: [cell("FR-007", 1404), cell("Save data to browser storage", 4212), cell("High", 1404), cell("TC-007", 2340)] }),
          new TableRow({ children: [cell("FR-008", 1404), cell("Load data on application start", 4212), cell("High", 1404), cell("TC-008", 2340)] }),
          new TableRow({ children: [cell("FR-010", 1404), cell("Graceful handling of storage errors", 4212), cell("High", 1404), cell("TC-010", 2340)] }),
          new TableRow({ children: [cell("FR-011", 1404), cell("Month-selector control", 4212), cell("High", 1404), cell("TC-011", 2340)] }),
          new TableRow({ children: [cell("FR-013", 1404), cell("Rophe column order in monthly view", 4212), cell("High", 1404), cell("TC-013", 2340)] }),
          new TableRow({ children: [cell("FR-015", 1404), cell("Summary row in monthly view", 4212), cell("High", 1404), cell("TC-015", 2340)] }),
          new TableRow({ children: [cell("FR-016", 1404), cell("Danger colour for high fasting readings", 4212), cell("High", 1404), cell("TC-016", 2340)] }),
          new TableRow({ children: [cell("FR-017", 1404), cell("Danger colour for high post-meal readings", 4212), cell("High", 1404), cell("TC-017", 2340)] }),
          new TableRow({ children: [cell("FR-020", 1404), cell("Print / Save PDF trigger", 4212), cell("High", 1404), cell("TC-020", 2340)] }),
          new TableRow({ children: [cell("FR-021", 1404), cell("PDF includes Rophe header and patient/doctor fields", 4212), cell("High", 1404), cell("TC-021", 2340)] }),
          new TableRow({ children: [cell("FR-022", 1404), cell("Export CSV download", 4212), cell("Medium", 1404), cell("TC-022", 2340)] }),
          new TableRow({ children: [cell("FR-025", 1404), cell("Global summary statistics panel", 4212), cell("High", 1404), cell("TC-025", 2340)] }),
          new TableRow({ children: [cell("FR-028", 1404), cell("Delete individual entry row", 4212), cell("Medium", 1404), cell("TC-028", 2340)] }),
          new TableRow({ children: [cell("FR-030", 1404), cell("Clear all data with confirmation", 4212), cell("Medium", 1404), cell("TC-030", 2340)] }),
          new TableRow({ children: [cell("NFR-006", 1404), cell("44x44px minimum tap target", 4212), cell("High", 1404), cell("TC-106", 2340)] }),
          new TableRow({ children: [cell("NFR-007", 1404), cell("WCAG 2.1 AA colour contrast", 4212), cell("High", 1404), cell("TC-107", 2340)] }),
          new TableRow({ children: [cell("NFR-008", 1404), cell("No horizontal scroll at 360px viewport", 4212), cell("High", 1404), cell("TC-108", 2340)] }),
          new TableRow({ children: [cell("NFR-010", 1404), cell("No data transmitted over network", 4212), cell("Critical", 1404), cell("TC-101", 2340)] }),
          new TableRow({ children: [cell("NFR-015", 1404), cell("Single-file no-server deployment", 4212), cell("High", 1404), cell("TC-102", 2340)] }),
          new TableRow({ children: [cell("NFR-018", 1404), cell("Malformed storage handled without crash", 4212), cell("High", 1404), cell("TC-103", 2340)] }),
        ]
      }),

      sp(120),
      h2("Appendix D — Glossary of Measurement Windows"),
      sp(60),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2808, 3276, 3276],
        rows: [
          new TableRow({ tableHeader: true, children: [cell("Window Label", 2808, LIGHT_BLUE, true), cell("Timing", 3276, LIGHT_BLUE, true), cell("Clinical Purpose", 3276, LIGHT_BLUE, true)] }),
          new TableRow({ children: [cell("Fasting", 2808), cell("Before breakfast, after ≥ 8 hrs fast", 3276), cell("Baseline glucose; diagnostic threshold assessment", 3276)] }),
          new TableRow({ children: [cell("2 hrs after breakfast", 2808), cell("2 hours after start of breakfast", 3276), cell("Post-prandial glucose response to morning meal", 3276)] }),
          new TableRow({ children: [cell("Before lunch", 2808), cell("Immediately before lunch", 3276), cell("Pre-prandial glucose; assesses inter-meal control", 3276)] }),
          new TableRow({ children: [cell("2 hrs after lunch", 2808), cell("2 hours after start of lunch", 3276), cell("Post-prandial glucose response to midday meal", 3276)] }),
          new TableRow({ children: [cell("Before dinner", 2808), cell("Immediately before dinner", 3276), cell("Pre-prandial glucose; afternoon control", 3276)] }),
          new TableRow({ children: [cell("2 hrs after dinner", 2808), cell("2 hours after start of dinner", 3276), cell("Post-prandial glucose response to evening meal", 3276)] }),
        ]
      }),

      sp(120),
      h2("Appendix E — Future Scope (Out of Scope for v1.0)"),
      p("The following features are explicitly out of scope for version 1.0 but are noted here for future planning:"),
      bullet("User authentication and multi-patient account management"),
      bullet("Server-side data storage and synchronisation across devices"),
      bullet("Integration with continuous glucose monitor (CGM) devices or meter Bluetooth APIs"),
      bullet("Integration with electronic health record (EHR) systems"),
      bullet("Clinical decision support: interpretation of trends, alerts, or dosing recommendations"),
      bullet("Multi-language (localisation) support"),
      bullet("HbA1c estimation from average glucose values"),
      bullet("Graphical trend charts of glucose readings over time"),
      bullet("Role-based access for clinicians to view multiple patient records"),

      sp(240),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 8 } },
        spacing: { before: 240, after: 0 },
        children: [new TextRun({ text: "End of Document — BGMA-SRS-001 v1.0", size: 18, font: "Arial", color: "888888", italics: true })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/mnt/user-data/outputs/BGMA_SRS_v1.0.docx', buf);
  console.log('Done — written to /mnt/user-data/outputs/BGMA_SRS_v1.0.docx');
});
