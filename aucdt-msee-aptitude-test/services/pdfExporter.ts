// This module relies on global scripts for jspdf and html2canvas loaded in index.html
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

export const exportResultsToPdf = async (): Promise<void> => {
    if (!window.jspdf || !window.html2canvas) {
        throw new Error("PDF generation libraries not loaded.");
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let y = margin;

    const summaryElement = document.getElementById('results-summary');
    const questionCards = document.querySelectorAll('.result-card-for-pdf');

    if (summaryElement) {
        const canvas = await window.html2canvas(summaryElement, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (y + imgHeight < pageHeight - margin) {
            pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
            y += imgHeight + 10;
        }
    }

    for (const card of Array.from(questionCards)) {
        const canvas = await window.html2canvas(card as HTMLElement, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (y + imgHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }
        
        pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
        y += imgHeight + 5;
    }

    pdf.save('AUCDT_MSEE_Results.pdf');
};