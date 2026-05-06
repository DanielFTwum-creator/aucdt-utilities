import pptxgen from 'pptxgenjs';
import html2canvas from 'html2canvas';

/**
 * Scans the main dashboard container for specific "panel" elements (cards),
 * screenshots them, and creates a PowerPoint presentation where each panel
 * gets its own slide.
 */
export const generatePPTX = async (containerId: string, title: string) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id ${containerId} not found`);
    return false;
  }

  try {
    const pres = new pptxgen();

    // 1. Metadata & Layout Configuration
    pres.author = 'TechBridge University College';
    pres.company = 'Strategic Office';
    pres.subject = title;
    pres.title = title;
    pres.layout = 'LAYOUT_16x9'; // Enforce 16:9 aspect ratio (10 x 5.625 inches)

    // 2. Define Slide Master (Templates)
    // This handles the "Enhance page footers" requirement globally
    pres.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: 'F8FAFC' }, // Slate-50 background
      objects: [
        // Top-right Logo/Brand Text
        { 
          text: { 
            text: 'TECHBRIDGE UC', 
            options: { x: 8.0, y: 0.2, w: 1.5, h: 0.3, fontSize: 10, color: 'CBD5E1', bold: true, align: 'right', fontFace: 'Arial' } 
          } 
        },
        // Footer Divider Line
        { 
          line: { x: 0.5, y: 5.15, w: 9.0, h: 0, line: { color: 'E2E8F0', width: 1 } } 
        },
        // Footer Left: Document Context
        { 
          text: { 
            text: `Strategic Dashboard | ${title}`, 
            options: { x: 0.5, y: 5.25, w: 6.0, h: 0.3, fontSize: 9, color: '64748B', fontFace: 'Arial' } 
          } 
        },
        // Footer Right: Date
        { 
          text: { 
            text: new Date().toLocaleDateString(), 
            options: { x: 7.0, y: 5.25, w: 2.0, h: 0.3, fontSize: 9, color: '64748B', align: 'right', fontFace: 'Arial' } 
          } 
        }
      ],
      // Automated Slide Numbering
      slideNumber: { x: 9.2, y: 5.25, w: 0.5, h: 0.3, fontSize: 9, color: '64748B', fontFace: 'Arial' }
    });

    // 3. Create Title Slide
    const titleSlide = pres.addSlide();
    titleSlide.background = { color: 'FFFFFF' };
    
    // Branding Sidebar Strip
    titleSlide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.35, h: 5.625, fill: { color: '3B82F6' } });

    // Main Title Text
    titleSlide.addText('TECHBRIDGE', {
      x: 0.8, y: 2.0, w: 8.5, h: 0.6,
      fontSize: 28, color: '1E293B', bold: true, fontFace: 'Arial', align: 'left'
    });
    
    titleSlide.addText('UNIVERSITY COLLEGE', {
        x: 0.8, y: 2.5, w: 8.5, h: 0.3,
        fontSize: 12, color: '64748B', bold: true, charSpacing: 4, fontFace: 'Arial', align: 'left'
    });

    titleSlide.addText(title.toUpperCase(), {
      x: 0.8, y: 3.2, w: 8.5, h: 1.2,
      fontSize: 40, color: '0F172A', bold: true, fontFace: 'Arial', align: 'left'
    });

    titleSlide.addText(`Generated: ${new Date().toLocaleString()}`, {
      x: 0.8, y: 4.8, w: 5.0, h: 0.4,
      fontSize: 11, color: '94A3B8', fontFace: 'Arial', align: 'left'
    });

    // 4. Content Slides Processing
    // Select specific panels to ensure high-quality output
    const panels = Array.from(container.querySelectorAll('.rounded-xl, .rounded-2xl')) as HTMLElement[];
    
    const validPanels = panels.filter(el => {
        const rect = el.getBoundingClientRect();
        // Filter out small UI elements, keeping only substantive cards
        return rect.width > 200 && rect.height > 100 && el.offsetParent !== null;
    });

    for (const panel of validPanels) {
       let slideTitle = 'Dashboard Insight';
       // Try to extract a title from the component
       const header = panel.querySelector('h2, h3, h4');
       if (header) {
           slideTitle = (header as HTMLElement).innerText;
       }

       // Capture Element
       const canvas = await html2canvas(panel, {
           scale: 2, // High resolution for PPTX
           useCORS: true,
           backgroundColor: '#ffffff' // Ensure white background for cards
       });
       const imgData = canvas.toDataURL('image/png');

       // Add Slide using Master Template
       const slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

       // Add Slide Title
       // "Review PPTX bullet alignments": Ensuring title text is strictly aligned to the left margin (x: 0.5)
       slide.addText(slideTitle, {
           x: 0.5, y: 0.3, w: 9.0, h: 0.5,
           fontSize: 18, color: '0F172A', bold: true, fontFace: 'Arial', align: 'left'
       });

       // Calculate Image Positioning
       // Available area: X (0.5 - 9.5), Y (0.8 - 5.1) -> Width: 9.0, Height: 4.3
       const maxWidth = 9.0; 
       const maxHeight = 4.3;
       
       const imgRatio = canvas.width / canvas.height;
       
       let finalW = maxWidth;
       let finalH = maxWidth / imgRatio;

       if (finalH > maxHeight) {
           finalH = maxHeight;
           finalW = maxHeight * imgRatio;
       }

       // Centre image in the content area
       const startX = (10 - finalW) / 2;
       const startY = 0.8 + ((maxHeight - finalH) / 2);

       slide.addImage({
           data: imgData,
           x: startX,
           y: startY,
           w: finalW,
           h: finalH
       });
    }

    // 5. Save File
    await pres.writeFile({ fileName: `TechBridge-Strategy-${new Date().toISOString().split('T')[0]}.pptx` });
    return true;

  } catch (error) {
    console.error('PPTX Generation failed:', error);
    return false;
  }
};