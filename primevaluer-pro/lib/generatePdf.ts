// @ts-nocheck
// Ensure you have included the jsPDF and html2canvas libraries in your project,
// for example, via script tags in your HTML file.
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

export const generatePdf = async (elementId: string, fileName: string) => {
  // Ensure the libraries are loaded on the window object
  if (!window.jspdf || !window.html2canvas) {
    console.error("jsPDF or html2canvas library not found on window object.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const html2canvas = window.html2canvas;
  
  const reportElement = document.getElementById(elementId);

  if (!reportElement) {
    console.error(`Element with id "${elementId}" not found!`);
    return;
  }

  const originalElements = [];
  let originalScrollTop = 0;

  try {
    // --- STRATEGY: Replace inputs/textareas with divs for accurate capture ---
    const formElements = reportElement.querySelectorAll('input, textarea');
    
    formElements.forEach(el => {
      const input = el as HTMLInputElement | HTMLTextAreaElement;
      const div = document.createElement('div');
      div.innerHTML = input.value.replace(/\n/g, '<br>') || '&nbsp;';
      const style = window.getComputedStyle(input);
      div.style.cssText = style.cssText;
      div.style.height = `${input.scrollHeight}px`;
      div.style.overflow = 'visible';
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordBreak = 'break-word';

      const parent = input.parentNode;
      if (parent) {
        originalElements.push({ original: input, parent: parent, replacement: div });
        parent.replaceChild(div, input);
      }
    });

    // --- FIX: Ensure capture starts from the very top of the scrollable element ---
    originalScrollTop = reportElement.scrollTop;
    reportElement.scrollTop = 0;

    // Capture the entire report element as a single, large canvas.
    const sourceCanvas = await html2canvas(reportElement, {
      scale: window.devicePixelRatio || 2,
      backgroundColor: '#0d1f1a',
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    });
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const footerHeight = 30;
    const pageContentHeight = pdfHeight - footerHeight;

    const sourceCanvasWidth = sourceCanvas.width;
    const sourceCanvasHeight = sourceCanvas.height;
    const ratio = sourceCanvasWidth / pdfWidth;
    const totalPdfHeight = sourceCanvasHeight / ratio;

    // --- RE-ENGINEERED GURU LOGIC: The Definitive Page Break Calculation ---
    const reportRect = reportElement.getBoundingClientRect();
    const scale = window.devicePixelRatio || 2;

    const cards = Array.from(reportElement.querySelectorAll('.keep-together')).map(el => {
        const element = el as HTMLElement;
        const elementRect = element.getBoundingClientRect();
        const topInDomPixels = (elementRect.top - reportRect.top);
        const heightInDomPixels = elementRect.height;
        
        const top = (topInDomPixels * scale) / ratio;
        const height = (heightInDomPixels * scale) / ratio;

        return { top, bottom: top + height, height };
    });

    const pageBreaks = [0];
    let currentTop = 0;

    while (currentTop < totalPdfHeight) {
        const potentialBreak = currentTop + pageContentHeight;

        if (potentialBreak >= totalPdfHeight) {
            pageBreaks.push(totalPdfHeight);
            break;
        }

        // Find all cards that start on the current page.
        const cardsStartingOnPage = cards.filter(card => card.top >= currentTop && card.top < potentialBreak);

        let bestBreak = potentialBreak;

        // Check if any of these cards get split by the potential break.
        for (const card of cardsStartingOnPage) {
            // A card is split if it starts before the break but ends after it.
            if (card.bottom > potentialBreak) {
                // If this card is not taller than a whole page, it's a candidate for moving.
                // We want to break before this card starts.
                if (card.height <= pageContentHeight) {
                    // We want the earliest break possible on this page, so we take the minimum.
                    bestBreak = Math.min(bestBreak, card.top);
                }
            }
        }
        
        // Safety check: if the best break is at the top of the page,
        // it means we're trying to push a card that starts right at the top.
        // In this case, we must make progress, so we take the standard break.
        if (bestBreak <= currentTop) {
            bestBreak = potentialBreak;
        }

        pageBreaks.push(bestBreak);
        currentTop = bestBreak;
    }
    
    const totalPages = pageBreaks.length - 1;
    const now = new Date();
    const printDate = now.toLocaleString('en-GB', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
    const timestampText = `Printed on: ${printDate}`;

    // Generate pages based on our calculated, content-aware breaks.
    for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        const pageTopPt = pageBreaks[i];
        const pageBottomPt = pageBreaks[i + 1];
        const pageHeightPt = pageBottomPt - pageTopPt;
        const sliceY = pageTopPt * ratio;
        const sliceHeight = pageHeightPt * ratio;
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = sourceCanvasWidth;
        pageCanvas.height = sliceHeight;
        pageCtx.drawImage(sourceCanvas, 0, sliceY, sourceCanvasWidth, sliceHeight, 0, 0, sourceCanvasWidth, sliceHeight);
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pageHeightPt);
        pdf.setFillColor('#0d1f1a');
        pdf.rect(0, pageContentHeight, pdfWidth, footerHeight, 'F');
        const pageNumberText = `Page ${i + 1} of ${totalPages}`;
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        const textY = pdfHeight - 15;
        pdf.text(timestampText, 15, textY);
        const pageNumWidth = pdf.getStringUnitWidth(pageNumberText) * pdf.getFontSize() / pdf.internal.scaleFactor;
        const pageNumX = pdfWidth - 15 - pageNumWidth;
        pdf.text(pageNumberText, pageNumX, textY);
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("An error occurred while generating the PDF:", error);
  } finally {
    // --- CRITICAL RESTORATION STEP ---
    reportElement.scrollTop = originalScrollTop;
    
    originalElements.forEach(({ original, parent, replacement }) => {
      if (parent && parent.contains(replacement)) {
        parent.replaceChild(original, replacement);
      }
    });
  }
};

export default generatePdf;