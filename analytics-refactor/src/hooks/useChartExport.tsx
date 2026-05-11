import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const useChartExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportToPNG = async (elementId, filename) => {
    try {
      setExporting(true);
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // High DPI
      });
      const link = document.createElement('a');
      link.download = `${filename}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async (elementId, filename) => {
    try {
      setExporting(true);
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = (data, filename) => {
    try {
      setExporting(true);
      if (!data || data.length === 0) throw new Error('No data to export');

      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}-${Date.now()}.csv`;
      link.click();
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = (data, filename) => {
    try {
      setExporting(true);
      if (!data || data.length === 0) throw new Error('No data to export');

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      XLSX.writeFile(workbook, `${filename}-${Date.now()}.xlsx`);
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return { exportToPNG, exportToPDF, exportToCSV, exportToExcel, exporting };
};
