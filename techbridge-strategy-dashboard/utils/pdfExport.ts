import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (elementId: string, fileName: string, title?: string, onProgress?: (progress: number) => void) => {
  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    if (onProgress) onProgress(5); // Initial setup progress

    // 1. Setup PDF Document (Landscape A4)
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();   // 297mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm
    const margin = 10;
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);
    const headerHeight = 20; // Space reserved for header

    // 2. Prepare Header/Footer Function
    const addHeaderFooter = (doc: jsPDF, pageNum: number, docTitle?: string) => {
        if (!docTitle) return;
        
        // Header
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42); // Slate 900
        doc.setFont('helvetica', 'bold');
        doc.text(docTitle, margin, margin + 5);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, margin + 5, { align: 'right' });
        
        doc.setDrawColor(226, 232, 240); // Slate 200
        doc.setLineWidth(0.5);
        doc.line(margin, margin + 8, pageWidth - margin, margin + 8);
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.text(`Page ${pageNum} | TechBridge University College Strategic Dashboard`, pageWidth / 2, pageHeight - 5, { align: 'center' });
    };

    // 3. Clone and Prepare DOM for Capture
    // We clone the element to enforce a fixed width layout (desktop view) 
    // ensuring consistent rendering regardless of the user's current screen size.
    const clone = originalElement.cloneNode(true) as HTMLElement;
    
    // Style the clone to be visible but off-screen to ensure html2canvas can capture it
    clone.style.width = '1600px'; // Force wide desktop layout
    clone.style.position = 'fixed';
    clone.style.top = '0'; // Keep in viewport vertically to avoid rendering issues
    clone.style.left = '-10000px'; // Move out of view horizontally
    clone.style.zIndex = '-9999';
    clone.style.height = 'auto'; // Allow full height
    clone.style.overflow = 'visible';
    clone.style.backgroundColor = '#ffffff'; // Ensure white background
    
    // Remove constraints that might limit width in the clone
    clone.classList.remove('max-w-7xl', 'mx-auto');
    
    document.body.appendChild(clone);

    // 4. Identify Sections
    // The Dashboard content is usually wrapped in a generic container (e.g. space-y-6)
    // We want the direct children of that wrapper to be our "slides/sections"
    let sections: HTMLElement[] = [];
    if (clone.children.length > 0) {
        if (clone.children.length === 1 && clone.children[0].children.length > 0) {
           // Wrapper div case (common in this app, e.g. <div className="space-y-6">)
           sections = Array.from(clone.children[0].children) as HTMLElement[];
        } else {
           // Direct children case
           sections = Array.from(clone.children) as HTMLElement[];
        }
    } else {
        sections = [clone];
    }

    // 5. Process Sections
    let currentY = margin + headerHeight;
    let pageNumber = 1;

    // Add initial header
    addHeaderFooter(pdf, pageNumber, title);

    const totalSections = sections.length;
    for (let i = 0; i < totalSections; i++) {
        const section = sections[i];
        
        // Report progress
        if (onProgress) {
            const progress = Math.round(((i + 1) / totalSections) * 90); // Scale to 90% (leave 10% for saving)
            onProgress(10 + progress); // Start from 10%
        }

        // Skip invisible or very small elements
        if (section.offsetHeight < 10) continue;

        // Capture Section
        const canvas = await html2canvas(section, {
            scale: 2, // High Res
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 1600
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Calculate Scale
        const ratio = availableWidth / imgWidth;
        const finalW = availableWidth;
        const finalH = imgHeight * ratio;

        // Pagination Logic
        // If content fits on current page?
        if (currentY + finalH > pageHeight - margin) {
            
            // Check if it fits on a fresh page
            if (finalH > availableHeight - headerHeight) {
                // If it's too big for a single page even after new page, 
                // we scale it down to fit the height of a new page.
                pdf.addPage();
                pageNumber++;
                addHeaderFooter(pdf, pageNumber, title);
                currentY = margin + headerHeight;

                const heightRatio = (availableHeight - headerHeight) / finalH;
                const constrainedW = finalW * heightRatio;
                const constrainedH = finalH * heightRatio;
                const xOffset = margin + (availableWidth - constrainedW) / 2; // Centre

                pdf.addImage(imgData, 'PNG', xOffset, currentY, constrainedW, constrainedH);
                currentY += constrainedH + 5;

            } else {
                // It fits on a new page
                pdf.addPage();
                pageNumber++;
                addHeaderFooter(pdf, pageNumber, title);
                currentY = margin + headerHeight;
                
                pdf.addImage(imgData, 'PNG', margin, currentY, finalW, finalH);
                currentY += finalH + 5;
            }
        } else {
            // Fits on current page
            pdf.addImage(imgData, 'PNG', margin, currentY, finalW, finalH);
            currentY += finalH + 5;
        }
    }

    // Cleanup
    document.body.removeChild(clone);
    
    if (onProgress) onProgress(100);

    // 6. Save
    pdf.save(fileName);
    return true;

  } catch (error) {
    console.error('PDF Export failed:', error);
    // Cleanup attempt
    const clones = document.querySelectorAll('[style*="z-index: -9999"]');
    clones.forEach(el => el.remove());
    return false;
  }
};