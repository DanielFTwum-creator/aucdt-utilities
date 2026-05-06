import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BroadsheetBody, MAX_SCORES } from '../types';

export const generateBroadsheetPDF = (data: BroadsheetBody) => {
  // Initialize PDF (Portrait, mm, A4)
  const doc = new jsPDF();

  // Branding Colors
  const maroon: [number, number, number] = [88, 0, 0]; // #580000
  const gold: [number, number, number] = [251, 191, 36]; // #fbbf24

  // --- Header ---
  doc.setTextColor(maroon[0], maroon[1], maroon[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TECHBRIDGE UNIVERSITY COLLEGE", 105, 15, { align: "center" });
  
  doc.setFontSize(11);
  doc.text("APPOINTMENTS AND PROMOTIONS COMMITTEE (APC)", 105, 22, { align: "center" });

  doc.setDrawColor(maroon[0], maroon[1], maroon[2]);
  doc.setLineWidth(0.5);
  doc.line(15, 26, 195, 26);

  // --- Title & Candidate Info ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("CANDIDATE BROADSHEET", 105, 35, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  let y = 45;
  doc.text(`Candidate Name:`, 15, y);
  doc.setFont("helvetica", "bold");
  doc.text(data.candidate.name.toUpperCase(), 50, y);
  doc.setFont("helvetica", "normal");
  
  doc.text(`Date: ${data.candidate.date}`, 150, y);

  y += 7;
  doc.text(`Position Applied For:`, 15, y);
  doc.setFont("helvetica", "bold");
  doc.text(data.candidate.position.toUpperCase(), 50, y);
  doc.setFont("helvetica", "normal");

  // --- Score Table ---
  const tableHead = [['Evaluation Criteria', 'Max Mark', 'Score']];
  const tableBody = [
    ['APPEARANCE', MAX_SCORES.appearance, data.scores.appearance.score],
    ['CONFIDENCE / MASTERY OF LANGUAGE', MAX_SCORES.confidence_language, data.scores.confidence_language.score],
    ['COMPETENCE IN AREA OF SPECIALIZATION', MAX_SCORES.competence_specialization, data.scores.competence_specialization.score],
    ['PERSONAL PLAN FOR TUC', MAX_SCORES.personal_plan, data.scores.personal_plan.score],
    ['TEACHING COMPETENCE', MAX_SCORES.teaching_competence, data.scores.teaching_competence.score],
    ['GENERAL KNOWLEDGE', MAX_SCORES.general_knowledge, data.scores.general_knowledge.score],
    ['TOTAL', '100', data.total]
  ];

  autoTable(doc, {
    startY: y + 10,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { 
        fillColor: maroon, 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        halign: 'center'
    },
    styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
    },
    columnStyles: {
        0: { cellWidth: 'auto' }, // Criteria
        1: { cellWidth: 25, halign: 'center' }, // Max
        2: { cellWidth: 25, halign: 'center', fontStyle: 'bold' } // Score
    },
    didParseCell: (data) => {
        // Highlight Total Row
        if (data.row.index === 6) {
            data.cell.styles.fillColor = gold;
            data.cell.styles.textColor = maroon;
            data.cell.styles.fontStyle = 'bold';
        }
    }
  });

  // --- Signatures ---
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  doc.text(`Panel Member: ${data.panel.member}`, 15, finalY);
  doc.text(`Role: ${data.panel.role}`, 15, finalY + 5);
  
  doc.setLineWidth(0.2);
  doc.line(130, finalY, 190, finalY);
  doc.text("Signature", 130, finalY + 5);

  // --- Footer ---
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  const footerText = `Generated via TUC Digital Broadsheet System | ${new Date().toLocaleString()}`;
  doc.text(footerText, 105, 285, { align: "center" });

  // Save File
  const filename = `Broadsheet_${data.candidate.name.replace(/[^a-zA-Z0-9]/g, '_')}_${data.candidate.date}.pdf`;
  doc.save(filename);
};