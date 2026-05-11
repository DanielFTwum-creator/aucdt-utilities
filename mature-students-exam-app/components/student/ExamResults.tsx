
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
    setExportMessage("");

    const { jsPDF } = (window as any).jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15; // Increased margin for better appearance
    let yOffset = margin; // Current Y position on the PDF page

    // Add title page
    pdf.setFontSize(24);
    pdf.text("TUC Mature Students Entrance Examination Results", pdfWidth / 2, yOffset + 10, { align: "center" });
    pdf.setFontSize(16);
    pdf.text(`Score: ${score} out of ${questions.length} (${percentage}%)`, pdfWidth / 2, yOffset + 25, { align: "center" });
    yOffset += 40; // Move down for content

    // Add a new page for questions
    pdf.addPage();
    yOffset = margin; // Reset yOffset for new page

    for (const [index, question] of questions.entries()) {
      const questionElement = document.getElementById(`question-${question.id}-export`);
      if (!questionElement) continue;

      // Temporarily make element visible if it's hidden (e.g., if it's not the current question in the ExamRunner)
      const originalDisplay = questionElement.style.display;
      questionElement.style.display = "block";

      const canvas = await (window as any).html2canvas(questionElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: COLORS.aucdtWhite,
      });

      questionElement.style.display = originalDisplay; // Restore original display

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth - 2 * margin;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if content fits on current page
      if (yOffset + imgHeight + margin > pdfHeight) {
        pdf.addPage();
        yOffset = margin; // Reset yOffset for new page
      }

      pdf.addImage(imgData, "PNG", margin, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight + 10; // Add some padding between questions
    }

    pdf.save("TUC_MSEE_Results.pdf");
    setIsExporting(false);
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
                <div key={question.id} id={`question-${question.id}-export`} className="border rounded-lg p-4 shadow-sm" style={{ borderColor: COLORS.aucdtLightGreen }}>
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
