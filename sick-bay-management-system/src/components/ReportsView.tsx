import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Visit, Patient, Medication, FacilityLog, DailyHealthCheck, AuditLog } from '../types';
import TestRunner from './TestRunner';
import { 
  BarChart, 
  TrendingUp, 
  Download, 
  Upload, 
  RotateCcw, 
  Calendar, 
  HeartHandshake, 
  ShieldAlert, 
  Activity,
  Users,
  Award,
  Mail,
  Copy,
  Check,
  Shield,
  Search,
  Filter
} from 'lucide-react';

interface ReportsViewProps {
  visits: Visit[];
  medications: Medication[];
  facilityLogs: FacilityLog[];
  patients: Patient[];
  dailyHealthChecks: DailyHealthCheck[];
  auditLogs: AuditLog[];
  onResetDatabase: () => void;
  onImportDatabase: (data: string) => void;
  onSeedDemoData: () => void;
}

export default function ReportsView({
  visits,
  medications,
  facilityLogs,
  patients,
  dailyHealthChecks = [],
  auditLogs = [],
  onResetDatabase,
  onImportDatabase,
  onSeedDemoData
}: ReportsViewProps) {
  // Date Filters
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-31');

  // Audit Log Filters
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCat, setAuditCat] = useState('ALL');

  const filteredAuditLogs = auditLogs.filter(log => {
    const query = auditSearch.toLowerCase();
    const matchesSearch = log.action.toLowerCase().includes(query) || 
                          log.actor.toLowerCase().includes(query) ||
                          log.details.toLowerCase().includes(query);
    const matchesCat = auditCat === 'ALL' || log.category === auditCat;
    return matchesSearch && matchesCat;
  });

  // Daily Email Reporting template state
  const [reportDate, setReportDate] = useState('2026-07-20');
  const [copiedState, setCopiedState] = useState(false);

  // Filtered dataset
  const filteredVisits = visits.filter(v => {
    const vDate = v.dateTime.split('T')[0];
    return vDate >= startDate && vDate <= endDate;
  });

  // Daily Report calculations
  const dayChecks = dailyHealthChecks.filter(check => check.dateTime.startsWith(reportDate));
  const dayVisits = visits.filter(visit => visit.dateTime.startsWith(reportDate));

  const checkSymptomsSet = new Set<string>();
  dayChecks.forEach(c => c.symptoms.forEach(sym => checkSymptomsSet.add(sym)));

  const visitConditionsMap: { [key: string]: number } = {};
  dayVisits.forEach(v => {
    v.presentingConditions.forEach(c => {
      let cleanC = c.split('(')[0].trim();
      visitConditionsMap[cleanC] = (visitConditionsMap[cleanC] || 0) + 1;
    });
  });
  const sortedVisitConditions = Object.entries(visitConditionsMap)
    .map(([name, count]) => `${name} (${count})`)
    .join(', ') || 'None';

  const severeVisits = dayVisits.filter(v => v.severity === 'Severe');
  const hospitalReferrals = dayVisits.filter(v => v.disposition === 'Referral to Hospital');

  const formattedReportDate = new Date(reportDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const reportRef = `TUC-INC-${reportDate.replace(/-/g, '')}-001`;
  const emailSubject = `[${reportRef}] TUC Sick Bay Daily Health & Wellness Summary - ${formattedReportDate}`;

  const emailBody = `DAILY CLINICAL SUMMARY REPORT
Institution: Techbridge University College (TUC), Oyibi, Ghana
Date: ${formattedReportDate}
Report Reference: ${reportRef}
Reporting Officer: Daniel Twum, Head of ICT (TUC Care Console Platform)

Dear TUC Management Team,

Please find the consolidated daily health screening and clinic visit metrics for ${formattedReportDate} below:

=========================================================
1. DAILY STUDENT/STAFF WELLNESS SCREENING
=========================================================
* Total Wellness Screenings: ${dayChecks.length}
* Screening Statuses:
  - Healthy (Cleared): ${dayChecks.filter(c => c.status === 'Healthy').length}
  - Under Monitoring: ${dayChecks.filter(c => c.status === 'Needs Monitor').length}
  - Referred to Sick Bay: ${dayChecks.filter(c => c.status === 'Refer to Sickbay').length}
* High Temperature Alerts (>37.8°C): ${dayChecks.filter(c => c.temperature > 37.8).length}
* Symptoms Observed: ${Array.from(checkSymptomsSet).join(', ') || 'None'}

=========================================================
2. SICK BAY CLINICAL VISITS
=========================================================
* Total Registered Visits: ${dayVisits.length}
* Patient Classification:
  - Students: ${dayVisits.filter(v => v.patientType === 'Student').length}
  - Staff: ${dayVisits.filter(v => v.patientType === 'Staff').length}
* Case Severity Levels:
  - Mild Cases: ${dayVisits.filter(v => v.severity === 'Mild').length}
  - Moderate Cases: ${dayVisits.filter(v => v.severity === 'Moderate').length}
  - Severe Cases: ${dayVisits.filter(v => v.severity === 'Severe').length}
* Primary Conditions Logged: ${sortedVisitConditions}
* Dispositions Executed:
  - Back to Class/Duty: ${dayVisits.filter(v => v.disposition === 'Back to Class').length}
  - Observed in Sick Bay Beds: ${dayVisits.filter(v => v.disposition === 'Observe in Sick Bay').length}
  - Sent Home (Parental Pickup): ${dayVisits.filter(v => v.disposition === 'Sent Home').length}
  - Referral to Outer Hospital: ${dayVisits.filter(v => v.disposition === 'Referral to Hospital').length}

=========================================================
3. INCIDENTS, CRITICAL ALERTS & ACTION ITEMS
=========================================================
${severeVisits.length > 0 || hospitalReferrals.length > 0 ? `⚠️ ATTENTION REQUIRED - THE FOLLOWING CRITICAL EVENTS OCCURRED:
${severeVisits.map(v => `- [SEVERE] Patient: ${v.patientName} (${v.classOrDept}) | Symptoms: ${v.symptoms} | Temp: ${v.temperature}°C | Treatment: ${v.treatment}`).join('\n')}
${hospitalReferrals.map(v => `- [REFERRAL] Patient: ${v.patientName} (${v.classOrDept}) | Reason: ${v.symptoms || 'Hospital transfer required.'}`).join('\n')}` : `✅ All cases were successfully managed on-site. No high-level emergency escalations or hospital transfers were required today.`}

---------------------------------------------------------
Report generated securely via TUC-CARE-PRO Nginx Ingress Node.
Authorized Signature: Head of ICT, Techbridge University College.
`;

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`)
      .then(() => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 3000);
      })
      .catch(err => {
        console.error("Clipboard write error:", err);
      });
  };

  const handleExportDailyPDF = () => {
    const doc = new jsPDF();
    
    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header Banner
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TECHBRIDGE UNIVERSITY COLLEGE', 15, 18);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Oyibi, Ghana | Sick Bay Management System', 15, 25);
    doc.text(`Ref: ${reportRef}`, pageWidth - 60, 25);
    
    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('DAILY CLINICAL SUMMARY REPORT', 15, 52);
    
    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 56, pageWidth - 15, 56);
    
    // Metadata row
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Report Date: ${formattedReportDate}`, 15, 63);
    doc.text(`Generated On: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 68);
    doc.text(`Reporting Officer: Daniel Twum, Head of ICT`, pageWidth - 95, 63);
    doc.text(`Status: Daily Executive Record`, pageWidth - 95, 68);

    doc.line(15, 72, pageWidth - 15, 72);

    // Section 1: Daily Student/Staff Wellness Screening
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('I. DAILY STUDENT & STAFF WELLNESS SCREENING', 15, 81);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Total Screenings Logged: ${dayChecks.length} sessions`, 20, 89);
    doc.text(`• Status Metrics:`, 20, 95);
    doc.text(`  - Healthy (Cleared): ${dayChecks.filter(c => c.status === 'Healthy').length}`, 25, 101);
    doc.text(`  - Under Monitoring: ${dayChecks.filter(c => c.status === 'Needs Monitor').length}`, 25, 107);
    doc.text(`  - Referred to Sick Bay: ${dayChecks.filter(c => c.status === 'Refer to Sickbay').length}`, 25, 113);

    doc.text(`• Temperature & Symptom Alerts:`, 110, 89);
    doc.text(`  - High Temp (>37.8°C): ${dayChecks.filter(c => c.temperature > 37.8).length} alert(s)`, 110, 95);
    doc.text(`  - Observed Symptoms:`, 110, 101);
    
    const symList = Array.from(checkSymptomsSet).join(', ') || 'None';
    const symLines = doc.splitTextToSize(symList, 80);
    doc.text(symLines, 114, 107);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 122, pageWidth - 15, 122);

    // Section 2: Sick Bay Clinical Visits
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('II. SICK BAY CLINICAL VISITS', 15, 131);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Total Registered Consultations: ${dayVisits.length} visits`, 20, 139);
    doc.text(`• Patient Classification:`, 20, 145);
    doc.text(`  - Students: ${dayVisits.filter(v => v.patientType === 'Student').length}`, 25, 151);
    doc.text(`  - Staff / Teachers: ${dayVisits.filter(v => v.patientType === 'Staff').length}`, 25, 157);

    doc.text(`• Case Severity Breakdown:`, 110, 139);
    doc.text(`  - Mild: ${dayVisits.filter(v => v.severity === 'Mild').length} case(s)`, 110, 145);
    doc.text(`  - Moderate: ${dayVisits.filter(v => v.severity === 'Moderate').length} case(s)`, 110, 151);
    doc.text(`  - Severe: ${dayVisits.filter(v => v.severity === 'Severe').length} case(s)`, 110, 157);

    // Primary conditions logged
    doc.text(`• Primary Conditions Logged:`, 20, 166);
    const condLines = doc.splitTextToSize(sortedVisitConditions, pageWidth - 40);
    doc.text(condLines, 20, 172);

    // Dispositions executed
    const yDisp = 172 + (condLines.length * 5) + 3;
    doc.text(`• Dispositions Executed:`, 20, yDisp);
    doc.text(`  - Back to Class/Duty: ${dayVisits.filter(v => v.disposition === 'Back to Class').length}`, 25, yDisp + 6);
    doc.text(`  - Observed in Sick Bay Bed: ${dayVisits.filter(v => v.disposition === 'Observe in Sick Bay').length}`, 25, yDisp + 12);
    doc.text(`  - Sent Home (Pickup): ${dayVisits.filter(v => v.disposition === 'Sent Home').length}`, 110, yDisp + 6);
    doc.text(`  - Referral to Outer Hospital: ${dayVisits.filter(v => v.disposition === 'Referral to Hospital').length}`, 110, yDisp + 12);

    doc.setDrawColor(226, 232, 240);
    const lineY = yDisp + 19;
    doc.line(15, lineY, pageWidth - 15, lineY);

    // Section 3: Critical Incidents / Action items
    const titleSec3Y = lineY + 9;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('III. CRITICAL EVENTS & INCIDENT LOG', 15, titleSec3Y);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    
    let contentSec3Y = titleSec3Y + 8;
    if (severeVisits.length > 0 || hospitalReferrals.length > 0) {
      doc.setTextColor(220, 38, 38);
      
      const severeLog = severeVisits.map(v => `[SEVERE] Patient: ${v.patientName} (${v.classOrDept}) | Symptoms: ${v.symptoms} | Temp: ${v.temperature}°C | Treatment: ${v.treatment}`);
      const referralLog = hospitalReferrals.map(v => `[REFERRAL] Patient: ${v.patientName} (${v.classOrDept}) | Reason: ${v.symptoms || 'Hospital transfer required.'}`);
      const logs = [...severeLog, ...referralLog];
      
      logs.forEach(log => {
        const lines = doc.splitTextToSize(log, pageWidth - 35);
        doc.text('•', 20, contentSec3Y);
        doc.text(lines, 24, contentSec3Y);
        contentSec3Y += (lines.length * 4.5) + 2;
      });
    } else {
      doc.setTextColor(22, 163, 74);
      doc.text('• All medical presentation cases were successfully managed on-site today.', 20, contentSec3Y);
      doc.text('• No critical escalations or emergency hospital transfers were required during this shift.', 20, contentSec3Y + 5);
    }

    // Footer signature block
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    
    const footerY = pageHeight - 20;
    doc.line(15, footerY, pageWidth - 15, footerY);
    
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('This clinical daily summary is digitally compiled and authorised via Techbridge University College.', 15, footerY + 4);
    doc.text('Page 1 of 1', pageWidth - 30, footerY + 4);

    // Save
    doc.save(`TUC-DAILY-HEALTH-SUMMARY_${reportDate}.pdf`);
  };

  // Calculate summaries
  const totalVisits = filteredVisits.length;
  const studentVisits = filteredVisits.filter(v => v.patientType === 'Student');
  const staffVisits = filteredVisits.filter(v => v.patientType === 'Staff');

  const maleStudentsCount = studentVisits.filter(s => s.gender === 'Male').length;
  const femaleStudentsCount = studentVisits.filter(s => s.gender === 'Female').length;

  const emergencyCount = filteredVisits.filter(v => v.severity === 'Severe').length;

  // Most common conditions in the filtered set
  const conditionsMap: { [key: string]: number } = {};
  filteredVisits.forEach(v => {
    v.presentingConditions.forEach(c => {
      let cleanC = c.split('(')[0].trim();
      conditionsMap[cleanC] = (conditionsMap[cleanC] || 0) + 1;
    });
  });

  const sortedConditions = Object.entries(conditionsMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  // Export full JSON Backup
  const handleExportBackup = () => {
    const fullState = {
      visits,
      medications,
      facilityLogs,
      patients,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `School_SickBay_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export PDF Report using jsPDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header Banner
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('TECHBRIDGE UNIVERSITY COLLEGE', 15, 18);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Oyibi, Ghana | Sick Bay Management System', 15, 25);
    doc.text('Ref: TUC-ICT-SRS-2026-001', pageWidth - 60, 25);
    
    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('PERIODICAL HEALTH AUDIT REPORT', 15, 52);
    
    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 56, pageWidth - 15, 56);
    
    // Metadata row
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Audit Period: ${startDate} to ${endDate}`, 15, 63);
    doc.text(`Generated On: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 15, 68);
    doc.text(`Requesting Authority: Daniel Twum, Head of ICT`, pageWidth - 95, 63);
    doc.text(`Status: Official Audit Record`, pageWidth - 95, 68);

    doc.line(15, 72, pageWidth - 15, 72);

    // Section 1: Executive Metrics
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('I. EXECUTIVE HEALTH METRICS', 15, 81);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`• Total Visits Recorded: ${totalVisits} patient sessions`, 20, 89);
    doc.text(`• Student Gender Distribution:`, 20, 95);
    doc.text(`  - Male Students: ${maleStudentsCount} visit(s)`, 20, 101);
    doc.text(`  - Female Students: ${femaleStudentsCount} visit(s)`, 20, 107);

    doc.text(`• Staff Visits Recorded: ${staffVisits.length} personal logs`, 110, 89);
    doc.text(`• Severe / Emergency Cases: ${emergencyCount}`, 110, 95);
    
    if (emergencyCount > 0) {
      doc.setTextColor(220, 38, 38);
      doc.setFont('Helvetica', 'bold');
      doc.text(' [ATTENTION REQUIRED]', 155, 95);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
    } else {
      doc.setTextColor(22, 163, 74);
      doc.text(' [Normal Range]', 155, 95);
      doc.setTextColor(51, 65, 85);
    }
    
    doc.text(`• Total Active Medications: ${medications.length} items`, 110, 101);
    doc.text(`• Recent Sanitisation Audits: ${facilityLogs.length} logs`, 110, 107);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 114, pageWidth - 15, 114);

    // Section 2: Presenting Issues Ranked
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('II. RANKED CLINICAL PRESENTING CONDITIONS', 15, 123);

    if (sortedConditions.length > 0) {
      let yOffset = 131;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      sortedConditions.forEach((cond, index) => {
        doc.setTextColor(15, 23, 42);
        doc.setFont('Helvetica', 'bold');
        doc.text(`${index + 1}. ${cond.name}`, 20, yOffset);
        
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`${cond.count} visit(s) (${Math.round((cond.count / (totalVisits || 1)) * 100)}% of total)`, 110, yOffset);
        yOffset += 6.5;
      });
    } else {
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('No clinical issues recorded in this range.', 20, 131);
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 164, pageWidth - 15, 164);

    // Section 3: Patient Audit Log
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('III. PATIENT AUDIT LOG (MAX 10 SESSIONS)', 15, 173);

    const rangeVisits = filteredVisits.slice(0, 10);
    if (rangeVisits.length > 0) {
      // Draw Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 178, pageWidth - 30, 7, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text('Date', 18, 183);
      doc.text('Patient Name', 40, 183);
      doc.text('Type', 85, 183);
      doc.text('Presenting Issue(s)', 110, 183);
      doc.text('Severity', 170, 183);

      let rowY = 190;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      
      rangeVisits.forEach(v => {
        const formattedDate = v.dateTime.split('T')[0];
        doc.text(formattedDate, 18, rowY);
        
        let pName = v.patientName || 'N/A';
        if (pName.length > 18) pName = pName.substring(0, 16) + '...';
        doc.text(pName, 40, rowY);
        
        doc.text(v.patientType, 85, rowY);
        
        let condStr = v.presentingConditions.join(', ');
        if (condStr.length > 30) condStr = condStr.substring(0, 28) + '...';
        doc.text(condStr, 110, rowY);
        
        if (v.severity === 'Severe') {
          doc.setTextColor(220, 38, 38);
          doc.setFont('Helvetica', 'bold');
          doc.text('Severe', 170, rowY);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
        } else {
          doc.text(v.severity, 170, rowY);
        }
        
        doc.setDrawColor(241, 245, 249);
        doc.line(15, rowY + 2, pageWidth - 15, rowY + 2);
        rowY += 5.5;
      });
    } else {
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('No patient sessions recorded in this range.', 20, 182);
    }

    // Footer signature block
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    
    const footerY = pageHeight - 20;
    doc.line(15, footerY, pageWidth - 15, footerY);
    
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('This audit is digitally compiled and authorised via Techbridge University College ICT division.', 15, footerY + 4);
    doc.text('Page 1 of 1', pageWidth - 30, footerY + 4);

    // Save
    doc.save(`TUC-ICT-HEALTH-REPORT_${startDate}_to_${endDate}.pdf`);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        onImportDatabase(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8" id="reports-tab">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase italic font-display text-slate-900">School Health Reporting & Analytics</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase">Generate period health audits, compile demographic summaries, and manage durable database backups.</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="bento-btn bento-btn-emerald shadow-[3px_3px_0px_rgba(15,23,42,1)] text-xs font-black flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Download className="w-4 h-4" /> Export PDF Report
        </button>
      </div>

      {/* Date Range Selection */}
      <div className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-[3px_3px_0px_rgba(15,23,42,1)]" id="reports-date-filter">
        <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider shrink-0">
          <Calendar className="absolute md:relative left-3.5 top-3.5 md:left-0 md:top-0 w-4 h-4 text-slate-400" /> Choose Auditing Date Range:
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="space-y-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-2 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            />
          </div>
          <div className="space-y-1">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-2 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            />
          </div>
        </div>
      </div>

      {/* Daily Email Summary Generator Console */}
      <div className="bg-slate-50 border-2 border-slate-900 rounded-[2rem] p-6 shadow-[5px_5px_0px_rgba(15,23,42,1)] space-y-6" id="daily-email-generator">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-200 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-black uppercase italic font-display text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" /> Daily Email Reporting Console
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              Aggregate screenings & visits into formal email reports for Head of ICT & management.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Report Date:</span>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="py-2 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)] cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Stats Summary Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_rgba(15,23,42,1)] space-y-3">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Wellness Screenings Activity</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-xl font-black text-slate-900 font-display block">{dayChecks.length}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Screenings</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-xl font-black text-emerald-600 font-display block">
                    {dayChecks.filter(c => c.status === 'Healthy').length}
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Healthy</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-rose-50 p-2 rounded-xl border border-rose-200">
                  <span className="text-xl font-black text-rose-600 font-display block">
                    {dayChecks.filter(c => c.status === 'Refer to Sickbay').length}
                  </span>
                  <span className="text-[8px] text-rose-500 font-bold uppercase block">Sickbay Ref</span>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <span className="text-xl font-black text-amber-600 font-display block">
                    {dayChecks.filter(c => c.temperature > 37.8).length}
                  </span>
                  <span className="text-[8px] text-amber-600 font-bold uppercase block">Fever Alerts</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_rgba(15,23,42,1)] space-y-3">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Sick Bay Consultation Visits</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-xl font-black text-slate-900 font-display block">{dayVisits.length}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Consultations</span>
                </div>
                <div className="bg-rose-50 p-2 rounded-xl border border-rose-200">
                  <span className="text-xl font-black text-rose-600 font-display block">
                    {dayVisits.filter(v => v.severity === 'Severe').length}
                  </span>
                  <span className="text-[8px] text-rose-500 font-bold uppercase block">Severe Cases</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-base font-black text-slate-700 block">
                    {dayVisits.filter(v => v.patientType === 'Student').length}S / {dayVisits.filter(v => v.patientType === 'Staff').length}T
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Student / Staff</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-base font-black text-indigo-600 block">
                    {dayVisits.filter(v => v.disposition === 'Referral to Hospital').length}
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase block">Hospital Ref</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyable Template Box */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            {/* Subject preview */}
            <div className="bg-slate-900 text-slate-200 border-2 border-slate-900 rounded-2xl p-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
              <div className="space-y-0.5 truncate w-full">
                <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest block">EMAIL SUBJECT HEADER</span>
                <p className="text-xs font-mono font-bold text-white truncate">{emailSubject}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full xl:w-auto">
                <button
                  onClick={handleCopyToClipboard}
                  className={`bento-btn shrink-0 w-full sm:w-auto py-2 text-xs font-black uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] border-2 transition-all duration-150 ${
                    copiedState 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-600' 
                      : 'bg-[#34d399] text-[#0f172a] hover:bg-[#2fc28d] border-slate-900'
                  }`}
                >
                  {copiedState ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  {copiedState ? 'Copied!' : 'Copy Email'}
                </button>
                <button
                  onClick={handleExportDailyPDF}
                  className="bento-btn bento-btn-emerald shrink-0 w-full sm:w-auto py-2 text-xs font-black uppercase cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] border-2 border-slate-900 text-slate-950 transition-all duration-150"
                  type="button"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>

            {/* Email Body Area */}
            <div className="relative">
              <textarea
                readOnly
                value={emailBody}
                className="w-full h-80 font-mono text-[11px] bg-slate-950 text-slate-200 border-2 border-slate-900 rounded-2xl p-4 focus:outline-none focus:border-slate-900 shadow-[3px_3px_0px_rgba(15,23,42,1)] leading-relaxed resize-none overflow-y-auto"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <div className="absolute bottom-3 right-3 bg-slate-900/80 text-[8px] text-slate-400 font-black px-2 py-1 rounded-md border border-slate-800 uppercase tracking-wider pointer-events-none">
                Auto-Formatted Report
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistical Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-summary-grid">
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 border-b-2 border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Visits Recorded</span>
            <Activity className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 font-display">{totalVisits}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">In selected range</p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 border-b-2 border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Student Gender Ratio</span>
            <Users className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <div className="flex gap-3 text-slate-900">
              <div>
                <span className="text-2xl font-black font-display">{maleStudentsCount}</span>
                <span className="text-[10px] text-slate-400 block font-black uppercase">MALE</span>
              </div>
              <div className="border-l-2 border-slate-900 pl-3">
                <span className="text-2xl font-black font-display">{femaleStudentsCount}</span>
                <span className="text-[10px] text-slate-400 block font-black uppercase">FEMALE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 border-b-2 border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Staff Visits logged</span>
            <Award className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 font-display">{staffVisits.length}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Teachers and admin personnel</p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-400 border-b-2 border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider">Severe Emergency Cases</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <span className={`text-3xl font-black font-display ${emergencyCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{emergencyCount}</span>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Requiring high-flow interventions</p>
          </div>
        </div>
      </div>

      {/* Detail Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="reports-analysis">
        {/* Conditions Frequency */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)] space-y-4">
          <h3 className="font-black text-slate-900 text-sm md:text-base uppercase italic font-display">Presenting Issues Ranked</h3>
          <div className="divide-y-2 divide-slate-100" id="ranked-conditions-list">
            {sortedConditions.map((cond, i) => (
              <div key={cond.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center font-black text-[10px] border border-slate-900">{i+1}</span>
                  {cond.name}
                </div>
                <span className="text-xs font-black text-slate-900 font-mono">{cond.count} {cond.count === 1 ? 'VISIT' : 'VISITS'}</span>
              </div>
            ))}
            {sortedConditions.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs font-black uppercase">No issue patterns identified in this date range.</div>
            )}
          </div>
        </div>

        {/* Year-on-Year School Findings Comparison */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(15,23,42,1)] space-y-4" id="historical-trends-panel">
          <h3 className="font-black text-slate-900 text-sm md:text-base uppercase italic font-display">School Clinical Trends comparison</h3>
          <p className="text-xs text-slate-400 font-semibold uppercase">Comparing seasonal outbreaks as described in historical reporting (e.g., malaria spikes, sanitation, respiratory issues).</p>
          
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-slate-600 uppercase">
                <span>Upper Respiratory Infection (URTI)</span>
                <span>Spike observed</span>
              </div>
              <div className="h-5 bg-slate-100 border-2 border-slate-900 rounded-lg overflow-hidden flex text-[10px] text-white font-black shadow-[1px_1px_0px_rgba(15,23,42,1)]">
                <div className="bg-indigo-500 h-full flex items-center justify-center uppercase border-r-2 border-slate-900" style={{ width: '60%' }}>Term 1</div>
                <div className="bg-indigo-600 h-full flex items-center justify-center uppercase" style={{ width: '40%' }}>Term 2</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-black text-slate-600 uppercase">
                <span>Suspected Malaria (Fever outbreak)</span>
                <span>Spike during rains</span>
              </div>
              <div className="h-5 bg-slate-100 border-2 border-slate-900 rounded-lg overflow-hidden flex text-[10px] text-white font-black shadow-[1px_1px_0px_rgba(15,23,42,1)]">
                <div className="bg-amber-500 h-full flex items-center justify-center uppercase border-r-2 border-slate-900" style={{ width: '75%' }}>Wet Season</div>
                <div className="bg-amber-600 h-full flex items-center justify-center uppercase" style={{ width: '25%' }}>Dry Season</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & System Audit Logs Trail */}
      <div className="bg-white border-2 border-slate-900 rounded-[2rem] p-6 shadow-[5px_5px_0px_rgba(15,23,42,1)] space-y-6" id="audit-logs-section">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black uppercase italic font-display text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" /> Security & System Audit Logs Trail
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              Official IEEE 830 clinical records. Tracks all visits, medication alterations, and database resets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs, actor, action..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border-2 border-slate-900 rounded-xl text-xs font-bold bg-white text-slate-900 shadow-[2px_2px_0px_#000] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_#000]"
              />
            </div>

            {/* Category Filter dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={auditCat}
                onChange={(e) => setAuditCat(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 shadow-[2px_2px_0px_#000] cursor-pointer appearance-none focus:outline-none"
              >
                <option value="ALL">ALL CATEGORIES</option>
                <option value="AUTH">AUTH</option>
                <option value="CLINICAL">CLINICAL</option>
                <option value="INVENTORY">INVENTORY</option>
                <option value="FACILITY">FACILITY</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-slate-50/50 shadow-[3px_3px_0px_rgba(15,23,42,1)]">
          <div className="overflow-x-auto overflow-y-auto max-h-80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-900 text-[10px] font-black uppercase text-slate-700 tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event Category</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Operational Details</th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-200">
                {filteredAuditLogs.map((log) => {
                  const dateStr = new Date(log.dateTime).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 text-xs font-bold text-slate-800 transition-colors">
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">{dateStr}</td>
                      <td className="py-3 px-4">
                        <span className={`bento-badge text-[8px] tracking-widest ${
                          log.category === 'AUTH' ? 'bento-badge-rose' :
                          log.category === 'CLINICAL' ? 'bento-badge-blue' :
                          log.category === 'INVENTORY' ? 'bento-badge-amber' :
                          log.category === 'FACILITY' ? 'bento-badge-slate' :
                          'bento-badge-emerald'
                        }`}>
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-black">{log.action}</td>
                      <td className="py-3 px-4 text-slate-700">{log.actor}</td>
                      <td className="py-3 px-4 text-slate-500 font-semibold max-w-[300px] truncate" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
                {filteredAuditLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-black uppercase text-xs">
                      No security audit logs found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive System Testing Hub */}
      <TestRunner />

      {/* Durable Backup, Seed & Restore controls */}
      <div className="bg-[#0f172a] text-white border-2 border-slate-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-[6px_6px_0px_rgba(15,23,42,1)]" id="database-maintenance-controls">
        <div>
          <h3 className="text-lg font-black uppercase italic font-display text-white">Durable Database Maintenance</h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold uppercase">Durable local backups ensure zero data loss from browser cache resets. Recommended once per semester.</p>
        </div>

        <div className="flex flex-wrap gap-3" id="maintenance-actions">
          <button
            onClick={handleExportBackup}
            className="bento-btn bento-btn-emerald shadow-[3px_3px_0px_rgba(255,255,255,1)] text-white text-xs font-black flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export JSON State
          </button>

          <label className="bento-btn bg-slate-800 text-slate-200 border-2 border-slate-700 hover:bg-slate-700 text-xs font-black cursor-pointer shadow-[3px_3px_0px_rgba(255,255,255,0.2)] flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Restore JSON State
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={onSeedDemoData}
            className="bento-btn bg-slate-800 text-slate-200 border-2 border-slate-700 hover:bg-slate-700 text-xs font-black cursor-pointer shadow-[3px_3px_0px_rgba(255,255,255,0.2)] flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" /> Reload Demo Dataset
          </button>

          <button
            onClick={onResetDatabase}
            className="bento-btn bg-red-950/40 text-red-300 border-2 border-red-800/60 hover:bg-red-900/40 text-xs font-black cursor-pointer shadow-[3px_3px_0px_rgba(255,100,100,0.2)] flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-red-400" /> Wipe local cache
          </button>
        </div>
      </div>
    </div>
  );
}
