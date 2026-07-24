
import { CheckCircle, Download, Loader2, RotateCcw, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { Answers, Question } from '../../types';
import { DiagramRenderer } from '../common/DiagramRenderer';
import { LatexRenderer } from '../common/LatexRenderer';
import { Message } from '../common/Message';
import { BonusSection } from './BonusSection';

interface ExamResultsProps {
  questions: Question[];
  answers: Answers;
  onRetake: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({ questions, answers, onRetake }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  const calculateScore = () => {
    return questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0);
  };

  const score = calculateScore();
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const handleExportToPdf = async () => {
    if (!(window as any).jspdf || !(window as any).html2canvas) {
      setExportMessage("PDF libraries not loaded. Please wait and try again.");
      return;
    }
    setIsExporting(true);
    setExportMessage('');

    const { jsPDF } = (window as any).jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    
    const contentToExport = document.getElementById('results-content-to-export');
    if (!contentToExport) {
        setExportMessage("Could not find content to export.");
        setIsExporting(false);
        return;
    }

    try {
        const canvas = await (window as any).html2canvas(contentToExport, {
            scale: 2,
            useCORS: true,
            backgroundColor: COLORS.aucdtWhite,
            windowWidth: contentToExport.scrollWidth,
            windowHeight: contentToExport.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('TUC_MSEE_Results.pdf');
    } catch (err) {
        console.error("Error generating PDF:", err);
        setExportMessage("An error occurred while generating the PDF.");
    } finally {
        setIsExporting(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-2xl p-8 md:p-12 border-t-4" style={{ borderColor: COLORS.aucdtGold }}>
        {exportMessage && <Message text={exportMessage} type="error" onDismiss={() => setExportMessage('')} />}
        <div id="results-content-to-export">
            <div className="text-center mb-8 p-4">
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.aucdtDeepBrown }}>Examination Results</h1>
                <div className={`text-6xl md:text-7xl font-bold my-4 ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</div>
                <p className="text-xl md:text-2xl" style={{ color: COLORS.aucdtDarkGray }}>{score} out of {questions.length} questions correct</p>
            </div>

            <div className="space-y-4">
                {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 shadow-sm" style={{ borderColor: COLORS.aucdtLightGreen }}>
                    <div className="flex items-start space-x-3">
                    {answers[question.id] === question.correct ? <CheckCircle className="mt-1 flex-shrink-0" size={24} style={{ color: COLORS.aucdtGreen }} /> : <XCircle className="mt-1 flex-shrink-0" size={24} style={{ color: COLORS.aucdtRed }} />}
                    <div className="flex-1">
                        <p className="font-medium text-lg mb-2" style={{ color: COLORS.aucdtDeepBrown }}>Question {index + 1}: <LatexRenderer>{question.question}</LatexRenderer></p>
                        {question.diagram && <DiagramRenderer type={question.diagram} />}
                        <div className="text-base mt-2" style={{ color: COLORS.aucdtDarkGray }}>
                          <p>Your answer: <span className="font-semibold">{answers[question.id] !== undefined ? <LatexRenderer>{question.options[answers[question.id]]}</LatexRenderer> : "Not answered"}</span></p>
                          <p>Correct answer: <span className="font-semibold" style={{ color: COLORS.aucdtGreen }}><LatexRenderer>{question.options[question.correct]}</LatexRenderer></span></p>
                        </div>
                        {question.bonus && <BonusSection title={question.bonus.title} content={question.bonus.content} />}
                    </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t flex flex-col md:flex-row justify-center items-center gap-4">
            <button onClick={handleExportToPdf} disabled={isExporting} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md disabled:opacity-50" style={{ backgroundColor: COLORS.aucdtDeepBrown, color: COLORS.aucdtWhite }}>
                {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                <span>{isExporting ? 'Exporting...' : 'Export to PDF'}</span>
            </button>
            <button onClick={onRetake} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: COLORS.aucdtGreen, color: COLORS.aucdtWhite }}>
                <RotateCcw size={20} />
                <span>Take Exam Again</span>
            </button>
        </div>
      </div>
    </div>
  );
};
