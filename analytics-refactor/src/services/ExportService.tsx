/**
 * Export Service
 * 
 * Provides functionality to export analytics data in multiple formats:
 * - PDF: Professional report with charts
 * - CSV: Raw data for spreadsheet analysis
 * - Excel: Formatted workbook with multiple sheets and charts
 * 
 * Uses:
 * - jsPDF for PDF generation
 * - SheetJS (xlsx) for Excel export
 * - Native Blob API for CSV
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

class ExportService {
  /**
   * Export data to CSV format
   */
  exportToCSV(data, filename = 'analytics-data.csv') {
    console.log('📊 Exporting to CSV...');
    
    if (!data || data.length === 0) {
      console.error('No data to export');
      return;
    }

    try {
      // Define headers
      const headers = [
        'Month',
        'Signups',
        'Applicants',
        'Accepted',
        'Rejected',
        'Waitlisted',
        'Registered',
        'Conversion Rate (%)',
        'Acceptance Rate (%)',
        'Registration Rate (%)'
      ];

      // Create CSV content
      let csvContent = headers.join(',') + '\n';

      // Add data rows
      data.forEach(record => {
        const conversionRate = record.signups > 0 
          ? ((record.applicants / record.signups) * 100).toFixed(1)
          : '0.0';
        
        const acceptanceRate = record.applicants > 0
          ? ((record.accepted / record.applicants) * 100).toFixed(1)
          : '0.0';
        
        const registrationRate = record.accepted > 0
          ? ((record.registered / record.accepted) * 100).toFixed(1)
          : '0.0';

        const row = [
          record.month,
          record.signups,
          record.applicants,
          record.accepted,
          record.rejected,
          record.waitlisted,
          record.registered,
          conversionRate,
          acceptanceRate,
          registrationRate
        ];

        csvContent += row.join(',') + '\n';
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadBlob(blob, filename);

      console.log('✅ CSV export successful');
      return true;
    } catch (error) {
      console.error('❌ CSV export failed:', error);
      return false;
    }
  }

  /**
   * Export data to Excel format with multiple sheets
   */
  exportToExcel(data, allTimeStats, filename = 'analytics-report.xlsx') {
    console.log('📊 Exporting to Excel...');

    if (!data || data.length === 0) {
      console.error('No data to export');
      return;
    }

    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Sheet 1: Raw Data
      const rawData = data.map(record => ({
        'Month': record.month,
        'Signups': record.signups,
        'Applicants': record.applicants,
        'Accepted': record.accepted,
        'Rejected': record.rejected,
        'Waitlisted': record.waitlisted,
        'Registered': record.registered,
        'Conversion Rate (%)': record.signups > 0 
          ? ((record.applicants / record.signups) * 100).toFixed(1)
          : '0.0',
        'Acceptance Rate (%)': record.applicants > 0
          ? ((record.accepted / record.applicants) * 100).toFixed(1)
          : '0.0',
        'Registration Rate (%)': record.accepted > 0
          ? ((record.registered / record.accepted) * 100).toFixed(1)
          : '0.0'
      }));

      const ws1 = XLSX.utils.json_to_sheet(rawData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Monthly Data');

      // Sheet 2: Summary Statistics
      const summaryData = [
        { 'Metric': 'Total Signups', 'Value': allTimeStats.totalSignups },
        { 'Metric': 'Total Applicants', 'Value': allTimeStats.totalApplicants },
        { 'Metric': 'Total Accepted', 'Value': allTimeStats.totalAccepted },
        { 'Metric': 'Total Rejected', 'Value': allTimeStats.totalRejected },
        { 'Metric': 'Total Waitlisted', 'Value': allTimeStats.totalWaitlisted },
        { 'Metric': 'Total Registered', 'Value': allTimeStats.totalRegistered },
        { 'Metric': '', 'Value': '' }, // Empty row
        { 'Metric': 'Conversion Rate', 'Value': `${allTimeStats.conversionRate}%` },
        { 'Metric': 'Acceptance Rate', 'Value': `${allTimeStats.acceptanceRate}%` },
        { 'Metric': 'Registration Rate', 'Value': `${allTimeStats.registrationRate}%` }
      ];

      const ws2 = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Summary');

      // Sheet 3: Yearly Aggregates
      const yearlyData = this.aggregateByYear(data);
      const ws3 = XLSX.utils.json_to_sheet(yearlyData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Yearly Summary');

      // Write file
      XLSX.writeFile(wb, filename);

      console.log('✅ Excel export successful');
      return true;
    } catch (error) {
      console.error('❌ Excel export failed:', error);
      return false;
    }
  }

  /**
   * Export data to PDF format with professional formatting
   */
  exportToPDF(data, allTimeStats, insights, filename = 'analytics-report.pdf') {
    console.log('📊 Exporting to PDF...');

    if (!data || data.length === 0) {
      console.error('No data to export');
      return;
    }

    try {
      // Create PDF document
      const doc = new jsPDF();
      let yPosition = 20;

      // Try to add logo (if available)
      try {
        // Note: Logo will be added if accessible, otherwise will use text header
        // For production, consider embedding the logo as base64 or serving locally
        // const logoUrl = 'https://techbridge.edu.gh/static/TUC_LOGO_1.png';
        // TODO: Implement actual logo loading when needed
        
        // Add logo placeholder (in production, use actual logo)
        doc.setFillColor(99, 102, 241);
        doc.rect(20, 10, 15, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('TUC', 23, 19);
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }

      // Add header text next to logo
      doc.setFontSize(22);
      doc.setTextColor(99, 102, 241); // Indigo
      doc.text('Advanced Analytics Report', 40, yPosition);
      
      yPosition += 7;
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // Gray
      doc.text('TECHBRIDGE University College', 40, yPosition);
      
      yPosition += 7;
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128); // Gray
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, yPosition);
      doc.text('Kumasi, Ghana', 150, yPosition);

      yPosition += 15;

      // Add summary statistics
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('All-Time Performance Summary', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);

      const summaryData = [
        ['Total Signups', allTimeStats.totalSignups.toLocaleString()],
        ['Total Applicants', allTimeStats.totalApplicants.toLocaleString()],
        ['Total Accepted', allTimeStats.totalAccepted.toLocaleString()],
        ['Total Registered', allTimeStats.totalRegistered.toLocaleString()],
        ['', ''], // Spacer
        ['Conversion Rate', `${allTimeStats.conversionRate}%`],
        ['Acceptance Rate', `${allTimeStats.acceptanceRate}%`],
        ['Registration Rate', `${allTimeStats.registrationRate}%`]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] },
        margin: { left: 20, right: 20 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Add monthly data table (last 12 months)
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.text('Recent Monthly Performance (Last 12 Months)', 20, yPosition);
      
      yPosition += 5;

      const recentData = data.slice(-12).map(record => [
        record.month,
        record.signups,
        record.applicants,
        record.accepted,
        record.registered,
        record.applicants > 0 
          ? `${((record.accepted / record.applicants) * 100).toFixed(1)}%`
          : 'N/A'
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Month', 'Signups', 'Applicants', 'Accepted', 'Registered', 'Accept Rate']],
        body: recentData,
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] },
        margin: { left: 20, right: 20 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Add insights section
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.text('Key Insights', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);

      const insightsList = [
        `📈 Latest Month: ${insights?.latestMonth?.month || 'N/A'}`,
        `✅ Current Signups: ${insights?.latestMonth?.signups || 0}`,
        `📊 Current Acceptance Rate: ${
          insights?.latestMonth?.applicants > 0 
            ? ((insights.latestMonth.accepted / insights.latestMonth.applicants) * 100).toFixed(1)
            : '0'
        }%`,
        '',
        `🎯 Overall Conversion: ${allTimeStats.conversionRate}% of signups become applicants`,
        `🎓 Registration Success: ${allTimeStats.registrationRate}% of accepted students register`,
        '',
        `💡 Data covers ${data.length} months from ${data[0]?.month} to ${data[data.length - 1]?.month}`
      ];

      insightsList.forEach((insight, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(insight, 25, yPosition);
        yPosition += 7;
      });

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          'TECHBRIDGE University College - Confidential',
          20,
          doc.internal.pageSize.height - 10
        );
      }

      // Save PDF
      doc.save(filename);

      console.log('✅ PDF export successful');
      return true;
    } catch (error) {
      console.error('❌ PDF export failed:', error);
      return false;
    }
  }

  /**
   * Helper: Aggregate data by year
   */
  aggregateByYear(data) {
    const yearlyMap = {};

    data.forEach(record => {
      const year = record.month.substring(0, 4);
      
      if (!yearlyMap[year]) {
        yearlyMap[year] = {
          Year: year,
          Signups: 0,
          Applicants: 0,
          Accepted: 0,
          Rejected: 0,
          Waitlisted: 0,
          Registered: 0
        };
      }

      yearlyMap[year].Signups += record.signups;
      yearlyMap[year].Applicants += record.applicants;
      yearlyMap[year].Accepted += record.accepted;
      yearlyMap[year].Rejected += record.rejected;
      yearlyMap[year].Waitlisted += record.waitlisted;
      yearlyMap[year].Registered += record.registered;
    });

    return Object.values(yearlyMap).map(year => ({
      ...year,
      'Acceptance Rate (%)': year.Applicants > 0
        ? ((year.Accepted / year.Applicants) * 100).toFixed(1)
        : '0.0'
    }));
  }

  /**
   * Helper: Download blob as file
   */
  downloadBlob(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  /**
   * Export charts as images (future enhancement)
   */
  async exportChartsAsImages() {
    console.log('📸 Chart image export not yet implemented');
    // Future: Use html2canvas or similar library
    return false;
  }
}

// Export singleton instance
export const exportService = new ExportService();
export default exportService;
