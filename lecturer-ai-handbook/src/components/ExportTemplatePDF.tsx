import { useState } from 'react';
import { FileText, Download, Check, Sparkles, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PromptTemplate } from '../data';

interface ExportTemplatePDFProps {
  template: PromptTemplate;
}

export default function ExportTemplatePDF({ template }: ExportTemplatePDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExportPDF = async () => {
    setIsGenerating(true);
    setSuccess(false);

    try {
      // Create jsPDF document instance
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      let currentY = 20;
      const pageHeight = 297;
      const marginX = 18;
      const contentWidth = 174;
      let pageCount = 0;

      // Helper to draw standard header and footer frames on each page
      const drawPageBackgroundAndFooter = () => {
        pageCount++;

        // Visual corporate gold band at the top
        doc.setFillColor(212, 175, 55); // Editorial Gold
        doc.rect(0, 0, 210, 3, 'F');

        // Running Footer
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(110, 110, 110);
        doc.text('TUC LECTURER AI COMPANION  |  ACADEMIC PREPARATION HANDOUT', marginX, pageHeight - 10);
        doc.text(`Page ${pageCount}`, 210 - marginX, pageHeight - 10, { align: 'right' });

        // Outer margin frame (fine, subtle divider)
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.25);
        doc.rect(marginX - 2, 10, contentWidth + 4, pageHeight - 25, 'S');
      };

      // Helper to check space and page break if necessary
      const checkPageSpace = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - 22) {
          doc.addPage();
          drawPageBackgroundAndFooter();
          currentY = 22; // reset Y to top content level on new page
        }
      };

      // --- PAGE 1: COVER HEADER & METADATA ---
      drawPageBackgroundAndFooter();

      // Institution Header
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(0, 33, 71); // Deep Navy
      doc.text('UNIVERSITY COLLEGE AI AMBASSADORS NETWORK', marginX, currentY);
      currentY += 4.5;

      // Accra Location line
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(212, 175, 55); // Gold
      doc.text('OFFICIAL LECTURE PREPARATION HANDOUT  •  ACCRA, GHANA', marginX, currentY);
      currentY += 8;

      // Main Handout Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(0, 33, 71); // Deep Navy
      doc.text(template.title.toUpperCase(), marginX, currentY);
      currentY += 6.5;

      // Category Subtitle
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(140, 136, 125);
      doc.text(`SUBJECT BLUEPRINT: ${template.category.toUpperCase()} TOOL`, marginX, currentY);
      currentY += 5;

      // Divider line
      doc.setDrawColor(0, 33, 71);
      doc.setLineWidth(1.0);
      doc.line(marginX, currentY, 210 - marginX, currentY);
      currentY += 10;

      // --- SECTION 1: ARCHITECTURAL OVERVIEW ---
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 33, 71);
      doc.text('1. ARCHITECTURAL OVERVIEW & OBJECTIVES', marginX, currentY);
      currentY += 5.5;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(45, 55, 72); // Charcoal

      const generalOverview = `This handbook provides the official offline-ready prompt template blueprint for the "${template.title}" tool, pre-configured as part of the Ghanaian University Lecturer AI training series. It establishes a rigorous, structured AI scaffolding framework to compile high-quality course outputs while completely mitigating standard AI hallucinations. Use the parameters detailed in Section 2 to fully customize the prompt.`;
      const splitOverview = doc.splitTextToSize(generalOverview, contentWidth);
      doc.text(splitOverview, marginX, currentY);
      currentY += (splitOverview.length * 4.5) + 6;

      // Specific description
      const specificObjective = `Specific Blueprint Objective: ${template.description}`;
      const splitObjective = doc.splitTextToSize(specificObjective, contentWidth);
      doc.setFont('Helvetica', 'oblique');
      doc.text(splitObjective, marginX, currentY);
      currentY += (splitObjective.length * 4.5) + 10;

      // --- SECTION 2: VARIABLES DIRECTORY ---
      checkPageSpace(35);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 33, 71);
      doc.text('2. CUSTOMIZATION VARIABLES DIRECTORY', marginX, currentY);
      currentY += 5.5;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(45, 55, 72);
      doc.text('Lecturers must configure the following dynamic placeholders in the digital workspace to compile the final prompt:', marginX, currentY);
      currentY += 6.5;

      // Draw table header
      checkPageSpace(15);
      doc.setFillColor(245, 246, 248);
      doc.rect(marginX, currentY, contentWidth, 7, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(marginX, currentY, contentWidth, 7, 'S');

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 33, 71);
      doc.text('VARIABLE PLACEHOLDER', marginX + 4, currentY + 4.5);
      doc.text('DEFAULT ASSIGNMENT & TARGET PURPOSE', marginX + 58, currentY + 4.5);
      currentY += 7;

      template.fields.forEach((field) => {
        checkPageSpace(13);

        // Draw cell background
        doc.setFillColor(255, 255, 255);
        doc.rect(marginX, currentY, contentWidth, 10, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(marginX, currentY, contentWidth, 10, 'S');

        // Variable Column
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(212, 175, 55); // Gold
        doc.text(`[${field.name}]`, marginX + 4, currentY + 6);

        // Default value & details
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(45, 55, 72);
        const textDetail = `Default: "${field.default}"\nPurpose: ${field.placeholder}`;
        const splitTextDetail = doc.splitTextToSize(textDetail, contentWidth - 64);
        doc.text(splitTextDetail, marginX + 58, currentY + 4.2);

        currentY += 10;
      });
      currentY += 8;

      // --- SECTION 3: MASTER PROMPT COMPANION BLUEPRINT ---
      checkPageSpace(35);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 33, 71);
      doc.text('3. STRUCTURED PROMPT COMPANION BLUEPRINT', marginX, currentY);
      currentY += 5.5;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(45, 55, 72);
      doc.text('Run the following structured instructional sequence directly in the Gemini model core to generate outcomes:', marginX, currentY);
      currentY += 6.5;

      // Prompt blueprint sequence
      const lines = doc.splitTextToSize(template.templateText, contentWidth - 12);

      lines.forEach((line: string) => {
        checkPageSpace(7);
        
        // Highlight background strip
        doc.setFillColor(248, 250, 252);
        doc.rect(marginX, currentY - 1.5, contentWidth, 5, 'F');

        // Left accent border bar (Deep blue vertical sidebar)
        doc.setFillColor(0, 33, 71);
        doc.rect(marginX, currentY - 1.5, 2, 5, 'F');

        // Draw line text using Courier for code/prompt block presentation
        doc.setFont('Courier', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(0, 33, 71);
        doc.text(line, marginX + 5, currentY + 1.8);
        
        currentY += 4.8;
      });
      currentY += 8;

      // --- SECTION 4: GHANAIAN ACADEMIC COMPLIANCE GUIDELINES ---
      checkPageSpace(45);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 33, 71);
      doc.text('4. GHANAIAN ACADEMIC COMPLIANCE & IMPLEMENTATION RULES', marginX, currentY);
      currentY += 5.5;

      const complianceRules = [
        "Verify GTEC Guidelines: Ensure generated syllabus, hours, or grading matrices comply fully with GTEC (Ghana Tertiary Education Commission) standards.",
        "Local Case Studies: Integrate local Ghanaian industries (e.g., Cocoa Board, local mineral resources, Ghanaian financial systems) to ensure curriculum context relevancy.",
        "Departmental Moderation Audit: Use this AI template output as a solid initial scaffold. It must pass human academic peer-review before official board submission.",
        "Disclose AI Integration: In line with academic integrity standards, note AI companion usage in lesson plan logs where institutional policies require disclosure."
      ];

      complianceRules.forEach((rule) => {
        checkPageSpace(14);

        // Little gold bullet square
        doc.setFillColor(212, 175, 55);
        doc.rect(marginX + 1, currentY + 1, 1.8, 1.8, 'F');

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(45, 55, 72);
        const splitRule = doc.splitTextToSize(rule, contentWidth - 8);
        doc.text(splitRule, marginX + 6, currentY + 2.5);

        currentY += (splitRule.length * 4) + 1.5;
      });

      // --- FOOTER SIGNATURE BLOCK ---
      checkPageSpace(25);
      currentY += 4;
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.4);
      doc.line(marginX, currentY, 210 - marginX, currentY);
      currentY += 5;

      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(140, 136, 125);
      doc.text('Compiled automatically by the TUC Lecturer AI Companion Workbook Engine. Accra, Ghana. Authorized under local institutional framework policies.', marginX, currentY, { maxWidth: contentWidth });

      // Save document
      const filename = `${template.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_lecturer_handout.pdf`;
      doc.save(filename);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white border border-editorial-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="p-2 rounded-lg bg-editorial-accent/5 text-editorial-accent shrink-0 mt-0.5">
          <FileText size={18} className="text-editorial-accent" />
        </span>
        <div className="space-y-1 font-sans">
          <h4 className="text-xs font-bold text-editorial-accent uppercase tracking-wider font-serif">
            Export Official Handout PDF
          </h4>
          <p className="text-[11px] text-editorial-text-light leading-normal max-w-md">
            Download a professionally formatted A4 PDF containing this structured prompt, parameter descriptions, and Ghanaian GTEC accreditation compliance rules.
          </p>
        </div>
      </div>

      <button
        onClick={handleExportPDF}
        disabled={isGenerating}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer ${
          success
            ? 'bg-[#137333] hover:bg-[#137333]/90 text-white'
            : isGenerating
            ? 'bg-editorial-secondary border border-editorial-border text-editorial-text-light cursor-not-allowed'
            : 'bg-editorial-gold hover:bg-editorial-gold/90 text-editorial-text-dark'
        }`}
      >
        {success ? (
          <>
            <Check size={14} />
            <span>Downloaded Handout!</span>
          </>
        ) : isGenerating ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-editorial-text-light border-t-transparent rounded-full animate-spin" />
            <span>Compiling PDF...</span>
          </>
        ) : (
          <>
            <Download size={14} />
            <span>Export Handout PDF</span>
          </>
        )}
      </button>
    </div>
  );
}
