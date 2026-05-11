
import React, { useState, useCallback, useMemo } from 'react';
import { DownloadIcon, CopyIcon, CheckCircleIcon } from './icons';
import { slidesData } from '../constants';
import type { Slide, ContentItem } from '../types';

// Helper function to escape text for Google Apps Script strings
const escapeGasString = (text: string): string => {
  return text.replace(/'/g, "\\'").replace(/\n/g, '\\n');
};

const generateSlideContentScript = (slide: Slide, slideNum: number): string => {
  let content = '';
  let yPos = 90;

  slide.content.forEach((item, itemIdx) => {
    if (item.type === 'box') {
      const bgColor = item.style === 'blue' ? '#E8F4F8' : 
                     item.style === 'burgundy' ? '#FFF5F5' : '#FFFACD';
      const borderColor = item.style === 'blue' ? '#4169E1' : 
                          item.style === 'burgundy' ? '#8B0000' : '#FFD700';
      const height = item.data.length * 25 + 20;
      const escapedText = escapeGasString(item.data.join('\n'));
      
      content += `  var box${slideNum}_${itemIdx} = slide${slideNum}.insertShape(SlidesApp.ShapeType.RECTANGLE, 60, ${yPos}, 600, ${height});
  box${slideNum}_${itemIdx}.getFill().setSolidFill('${bgColor}');
  box${slideNum}_${itemIdx}.getBorder().setWeight(2).getLineFill().setSolidFill('${borderColor}');
  var boxText${slideNum}_${itemIdx} = box${slideNum}_${itemIdx}.getText();
  boxText${slideNum}_${itemIdx}.setText('${escapedText}');
  boxText${slideNum}_${itemIdx}.getTextStyle().setFontSize(16);
`;
      yPos += height + 20;
    } else if (item.type === 'columns') {
      item.data.forEach((col, colIdx) => {
        const xPos = 60 + (colIdx * 330);
        let colText = '';
        if (col.heading) colText += col.heading + '\n\n';
        colText += col.items.join('\n');
        const escapedColText = escapeGasString(colText);
        
        content += `  var col${slideNum}_${itemIdx}_${colIdx} = slide${slideNum}.insertShape(SlidesApp.ShapeType.TEXT_BOX, ${xPos}, ${yPos}, 280, 150);
  var colText${slideNum}_${itemIdx}_${colIdx} = col${slideNum}_${itemIdx}_${colIdx}.getText();
  colText${slideNum}_${itemIdx}_${colIdx}.setText('${escapedColText}');
  colText${slideNum}_${itemIdx}_${colIdx}.getTextStyle().setFontSize(16);
`;
      });
      yPos += 180;
    }
  });
  
  return content;
};

const generateGoogleSlidesScript = (): string => {
  const slideContents = slidesData.slides.map((slide, idx) => {
    return `
  // Slide ${idx + 2}: ${slide.title}
  var slide${idx + 2} = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  var title${idx + 2}Box = slide${idx + 2}.insertShape(SlidesApp.ShapeType.TEXT_BOX, 40, 20, 640, 50);
  var title${idx + 2} = title${idx + 2}Box.getText();
  title${idx + 2}.setText('${slide.title}');
  title${idx + 2}.getTextStyle()
    .setFontSize(36)
    .setBold(true)
    .setForegroundColor('#8B0000');
  
${generateSlideContentScript(slide, idx + 2)}`;
  }).join('\n');

  return `function createPresentation() {
  var presentation = SlidesApp.create('${slidesData.title}');
  var slides = presentation.getSlides();
  
  // Delete default slide
  if (slides.length > 0) {
    slides[0].remove();
  }
  
  // Title Slide
  var titleSlide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  var titleShape = titleSlide.insertShape(SlidesApp.ShapeType.RECTANGLE, 0, 0, 720, 405);
  titleShape.getFill().setSolidFill('#8B0000');
  
  var titleTextBox = titleSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 50, 120, 620, 100);
  var titleText = titleTextBox.getText();
  titleText.setText('${slidesData.title}');
  titleText.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  titleText.getTextStyle()
    .setFontSize(48)
    .setBold(true)
    .setForegroundColor('#FFFFFF');
  
  var subtitleTextBox = titleSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 50, 200, 620, 50);
  var subtitleText = subtitleTextBox.getText();
  subtitleText.setText('${slidesData.subtitle}');
  subtitleText.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  subtitleText.getTextStyle()
    .setFontSize(28)
    .setForegroundColor('#FFFFFF');
  
  var authorTextBox = titleSlide.insertShape(SlidesApp.ShapeType.TEXT_BOX, 50, 340, 620, 40);
  var authorText = authorTextBox.getText();
  authorText.setText('${slidesData.author}');
  authorText.getParagraphStyle().setParagraphAlignment(SlidesApp.ParagraphAlignment.CENTER);
  authorText.getTextStyle()
    .setFontSize(16)
    .setForegroundColor('#FFFFFF');

${slideContents}
  
  Logger.log('Presentation created: ' + presentation.getUrl());
  return presentation.getUrl();
}`;
};

const SlidePreview: React.FC<{ slide: Slide }> = ({ slide }) => {
  const renderContentItem = (item: ContentItem, itemIdx: number) => {
    switch (item.type) {
      case 'box':
        const boxStyles = {
          blue: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
          burgundy: 'bg-red-50 border-2 border-red-900 text-red-900',
          yellow: 'bg-yellow-50 border-2 border-yellow-500 text-yellow-800',
        };
        return (
          <div key={itemIdx} className={`p-4 rounded ${boxStyles[item.style]}`}>
            {item.data.map((line, lineIdx) => (
              <p key={lineIdx} className="mb-1">{line}</p>
            ))}
          </div>
        );
      case 'columns':
        return (
          <div key={itemIdx} className="grid md:grid-cols-2 gap-6">
            {item.data.map((col, colIdx) => (
              <div key={colIdx}>
                {col.heading && <h5 className="font-bold text-lg mb-2">{col.heading}</h5>}
                <ul className="space-y-1 list-disc list-inside">
                  {col.items.map((text, i) => (
                    <li key={i} className="text-gray-700">{text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300">
      <h4 className="text-2xl font-bold text-red-900 mb-4 border-b-2 border-red-200 pb-2">
        {slide.title}
      </h4>
      <div className="space-y-4">
        {slide.content.map(renderContentItem)}
      </div>
    </div>
  );
};


export const SlidesConverter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const script = useMemo(() => generateGoogleSlidesScript(), []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [script]);

  const downloadScript = useCallback(() => {
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'create_slides.gs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [script]);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 mb-8">
          <h1 className="text-4xl font-bold text-red-900 mb-2">QMD to Google Slides Converter</h1>
          <p className="text-gray-600 mb-6">Automate your sprint standup presentation with a single script.</p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
            <h2 className="font-bold text-lg text-blue-800 mb-2">📋 Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>Click "Copy Script" or "Download Script".</li>
              <li>Go to <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline hover:text-blue-800">script.google.com</a> and create a new project.</li>
              <li>Paste the script into the editor.</li>
              <li>Click the "Run" button (▶️ icon) and select the "createPresentation" function.</li>
              <li>Authorize the script when prompted by Google.</li>
              <li>Check the execution log for your new presentation URL!</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={copyToClipboard}
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-red-900 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {copied ? <CheckCircleIcon /> : <CopyIcon />}
              {copied ? 'Copied!' : 'Copy Script'}
            </button>
            
            <button
              onClick={downloadScript}
              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <DownloadIcon />
              Download Script
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Generated Google Apps Script:</h3>
              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">{script.split('\n').length} lines</span>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto text-xs max-h-96">
              <code>{script}</code>
            </pre>
          </div>
        </div>

        <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg shadow-2xl p-6 md:p-8">
          <h2 className="text-3xl font-bold text-red-900 mb-6 text-center">Presentation Preview</h2>
          
          <div className="space-y-6">
            <div className="bg-red-900 text-white p-8 rounded-lg text-center shadow-lg">
              <h3 className="text-4xl font-bold mb-2">{slidesData.title}</h3>
              <p className="text-xl mb-4">{slidesData.subtitle}</p>
              <p className="text-sm opacity-80">{slidesData.author}</p>
            </div>

            {slidesData.slides.map((slide, idx) => (
              <SlidePreview key={idx} slide={slide} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
