import React, { createContext, useContext, useState } from 'react';
import jsPDF from 'jspdf';

/**
 * Export Context
 * 
 * Manages data export functionality:
 * - PDF export with charts and branding
 * - CSV export with custom columns
 * - Excel export with multiple sheets
 * 
 * Features:
 * - Export current view or filtered data
 * - Include/exclude specific charts
 * - Custom date ranges
 * - Branded headers and footers
 */

const ExportContext = createContext();

export function ExportProvider({ children }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  /**
   * Export data to CSV format
   */
  const exportToCSV = (data, filename = 'analytics-data.csv') => {
    try {
      setIsExporting(true);
      setExportProgress(25);

      // Convert data to CSV
      const headers = ['Month', 'Signups', 'Applicants', 'Accepted', 'Rejected', 'Waitlisted', 'Registered'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          row.month,
          row.signups,
          row.applicants,
          row.accepted,
          row.rejected,
          row.waitlisted,
          row.registered
        ].join(','))
      ].join('\n');

      setExportProgress(75);

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress(100);
      console.log('✅ CSV export completed:', filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('❌ CSV export failed:', error);
      return { success: false, error: error.message };
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  /**
   * Export data to Excel format (XLSX)
   */
  const exportToExcel = async (data, stats, filename = 'analytics-report.xlsx') => {
    try {
      setIsExporting(true);
      setExportProgress(10);

      // Dynamic import to reduce initial bundle size
      const XLSX = await import('xlsx');
      
      setExportProgress(25);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Raw Data
      const dataSheet = XLSX.utils.json_to_sheet(data.map(row => ({
        'Month': row.month,
        'Signups': row.signups,
        'Applicants': row.applicants,
        'Accepted': row.accepted,
        'Rejected': row.rejected,
        'Waitlisted': row.waitlisted,
        'Registered': row.registered,
        'Acceptance Rate (%)': row.acceptanceRate || ((row.accepted / row.applicants) * 100).toFixed(1),
        'Conversion Rate (%)': row.conversionRate || ((row.applicants / row.signups) * 100).toFixed(1)
      })));
      
      XLSX.utils.book_append_sheet(workbook, dataSheet, 'Raw Data');
      setExportProgress(50);

      // Sheet 2: Summary Statistics
      const summarySheet = XLSX.utils.json_to_sheet([
        {
          'Metric': 'Total Signups',
          'Value': stats.totalSignups,
          'Description': 'All-time portal account creations'
        },
        {
          'Metric': 'Total Applicants',
          'Value': stats.totalApplicants,
          'Description': 'Users who started applications'
        },
        {
          'Metric': 'Total Accepted',
          'Value': stats.totalAccepted,
          'Description': 'Admission offers sent'
        },
        {
          'Metric': 'Total Registered',
          'Value': stats.totalRegistered,
          'Description': 'Students who completed enrollment'
        },
        {
          'Metric': 'Overall Conversion Rate',
          'Value': `${stats.conversionRate}%`,
          'Description': 'Signups to applicants'
        },
        {
          'Metric': 'Overall Acceptance Rate',
          'Value': `${stats.acceptanceRate}%`,
          'Description': 'Applications accepted'
        },
        {
          'Metric': 'Overall Registration Rate',
          'Value': `${stats.registrationRate}%`,
          'Description': 'Accepted students who registered'
        }
      ]);
      
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      setExportProgress(75);

      // Export file
      XLSX.writeFile(workbook, filename);
      
      setExportProgress(100);
      console.log('✅ Excel export completed:', filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('❌ Excel export failed:', error);
      return { success: false, error: error.message };
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  /**
   * Export dashboard to PDF format.
   *
   * Clones the dashboard DOM, strips modals and action buttons from the
   * clone, renders it off-screen, then captures it with html2canvas.
   * This sidesteps the well-known html2canvas bug where position:fixed
   * children of a captured sub-element render broken or bleed through.
   * The full-colour capture is sliced into landscape A4 pages in jsPDF.
   */
  const exportToPDF = async (data, stats, options = {}) => {
    let clone = null;
    try {
      setIsExporting(true);
      setExportProgress(5);

      const { filename = 'analytics-dashboard.pdf' } = options;

      // ── 1. Locate the live dashboard root ─────────────────────────────
      const dashboardEl = document.querySelector(
        '[aria-label="Advanced Analytics Dashboard"]'
      );
      if (!dashboardEl) {
        return {
          success: false,
          error: 'Dashboard element not found. Make sure the dashboard is fully loaded before exporting.'
        };
      }

      // ── 2. Deep-clone the dashboard ───────────────────────────────────
      // Cloning lets us strip modals entirely rather than trying to hide
      // position:fixed elements in-place (unreliable with html2canvas).
      clone = dashboardEl.cloneNode(true);

      // Remove everything that should not appear in the PDF:
      //   • .controls-section   – header action buttons (Export, Print, …)
      //   • [role="dialog"]     – any open dialog panels
      //   • .modal-backdrop     – semi-transparent overlays
      //   • .filter-panel       – filter sidebar
      //   • .accessibility-toolbar / .floating-a11y-button – a11y chrome
      const stripSelectors = [
        '.controls-section',
        '[role="dialog"]',
        '.modal-backdrop',
        '.filter-panel',
        '.accessibility-toolbar',
        '.floating-a11y-button'
      ].join(',');
      clone.querySelectorAll(stripSelectors).forEach(el => el.remove());

      // Force clone to shrink-wrap its content (no min-h-screen, no overflow clip)
      clone.style.minHeight  = 'unset';
      clone.style.height     = 'auto';
      clone.style.overflow   = 'visible';
      clone.style.position   = 'absolute';
      clone.style.left       = '-9999px';
      clone.style.top        = '0';
      clone.style.width      = dashboardEl.offsetWidth + 'px';

      // Append to body so the browser lays it out and renders styles
      document.body.appendChild(clone);
      // Force a synchronous layout pass so offsetHeight is accurate
      void clone.offsetHeight;

      setExportProgress(12);

      // ── 3. Capture the clone at 2× resolution ─────────────────────────
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null       // preserve the dashboard gradient background
      });

      // ── 4. Tear down the clone immediately ────────────────────────────
      document.body.removeChild(clone);
      clone = null;

      setExportProgress(58);

      // ── 5. Build the PDF — landscape A4 ───────────────────────────────
      const doc     = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pageW   = doc.internal.pageSize.getWidth();   // 297 mm
      const pageH   = doc.internal.pageSize.getHeight();  // 210 mm
      const margin  = 8;                                  // mm around each page
      const footerH = 6;                                  // mm reserved at bottom for footer
      const availW  = pageW  - margin * 2;                // 281 mm usable width
      const availH  = pageH  - margin * 2 - footerH;     // 184 mm usable height

      // ── 6. Slice the full canvas into page-height chunks ──────────────
      const pxPerMm      = canvas.width / availW;         // uniform px↔mm scale
      const pageHeightPx = availH * pxPerMm;              // canvas-px per page
      const totalPages   = Math.ceil(canvas.height / pageHeightPx);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) doc.addPage();

        const srcY   = page * pageHeightPx;
        const sliceH = Math.min(pageHeightPx, canvas.height - srcY);

        // Cut this page's vertical strip
        const slice = document.createElement('canvas');
        slice.width  = canvas.width;
        slice.height = sliceH;
        slice.getContext('2d').drawImage(
          canvas,
          0, srcY, canvas.width, sliceH,   // source rect
          0, 0,    canvas.width, sliceH     // dest — pixel-for-pixel, no stretch
        );

        doc.addImage(
          slice.toDataURL('image/png'),
          'PNG',
          margin, margin,
          availW, sliceH / pxPerMm          // last page naturally shorter
        );

        // Footer
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text(
          `Page ${page + 1} of ${totalPages}  \u2502  TECHBRIDGE University College  \u2502  Confidential`,
          pageW / 2, pageH - 3.5,
          { align: 'center' }
        );

        setExportProgress(58 + ((page + 1) / totalPages) * 34);
      }

      // ── 7. Save ───────────────────────────────────────────────────────
      setExportProgress(95);
      doc.save(filename);
      setExportProgress(100);

      console.log('✅ PDF export completed:', filename);
      return { success: true, filename };

    } catch (error) {
      console.error('❌ PDF export failed:', error);
      return { success: false, error: error.message };
    } finally {
      // Safety net: if an error occurred before the clone was removed
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  const exportToPNG = async (elementId, filename = 'chart.png') => {
    try {
      setIsExporting(true);
      setExportProgress(25);

      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found for export');
      
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null
      });
      
      setExportProgress(75);

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setExportProgress(100);
      console.log('✅ PNG export completed:', filename);
      
      return { success: true, filename };
    } catch (error) {
      console.error('❌ PNG export failed:', error);
      return { success: false, error: error.message };
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  /**
   * Export current view (screenshot-like)
   */
  const exportCurrentView = async () => {
    try {
      setIsExporting(true);
      setExportProgress(25);

      // Trigger browser print dialog
      window.print();
      
      setExportProgress(100);
      console.log('✅ Print dialog opened');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Print failed:', error);
      return { success: false, error: error.message };
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  const value = {
    // State
    isExporting,
    exportProgress,
    
    // Export functions
    exportToPNG,
    exportToCSV,
    exportToExcel,
    exportToPDF,
    exportCurrentView
  };

  return (
    <ExportContext.Provider value={value}>
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error('useExport must be used within an ExportProvider');
  }
  return context;
}

export default ExportContext;
