import React, { useState } from 'react';
import jsPDF from 'jspdf';
import type { FormData } from '../App.tsx';

interface StepProps {
    formData: FormData;
    handleBack: () => void;
    handleReset: () => void;
    addAuditLog: (event: string) => void;
}

const ReviewStep = ({ formData, handleBack, handleReset, addAuditLog }: StepProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGeneratePdf = () => {
        setIsLoading(true);

        const doc = new jsPDF();
        const { 
            testatorName, testatorAddress, executorName, alternateExecutorName,
            jurisdiction, realEstate, gifts, hasMinorChildren, guardianName,
            alternateGuardianName, residuaryBeneficiaryName
        } = formData;
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let y = 20;

        const addSection = (title: string, content: string, counter: number) => {
            if (y > 250) { // Add new page if y is low on the page
                doc.addPage();
                y = margin;
            }
            doc.setFont('times', 'bold');
            doc.text(`${counter}. ${title}`, margin, y);
            y += 10;
            doc.setFont('times', 'normal');
            const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
            doc.text(lines, margin, y);
            y += lines.length * 7 + 10;
        }

        // Title
        doc.setFontSize(18);
        doc.setFont('times', 'bold');
        doc.text('Last Will and Testament', pageWidth / 2, y, { align: 'center' });
        y += 10;
        doc.setFontSize(14);
        doc.text(`of ${testatorName || '[Testator Name]'}`, pageWidth / 2, y, { align: 'center' });
        y += 20;

        // Declaration
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        const declarationText = `I, ${testatorName}, residing at ${testatorAddress}, being of sound mind and memory, do hereby declare this to be my last Will and Testament, revoking all former wills and codicils made by me.`;
        const declarationLines = doc.splitTextToSize(declarationText, pageWidth - margin * 2);
        doc.text(declarationLines, margin, y);
        y += declarationLines.length * 7 + 10;
        
        let sectionCounter = 1;

        // Appointment of Executor
        let executorText = `I appoint ${executorName || '[Executor Name]'} as the Executor of this, my Will.`;
        if (alternateExecutorName) {
            executorText += ` If this Executor is unable or unwilling to serve, I appoint ${alternateExecutorName} as my alternate Executor.`;
        }
        addSection('Appointment of Executor', executorText, sectionCounter++);

        // Appointment of Guardian
        if (hasMinorChildren && guardianName) {
            let guardianText = `I appoint ${guardianName} as the Guardian of my minor children.`;
            if (alternateGuardianName) {
                guardianText += ` If this Guardian is unable or unwilling to serve, I appoint ${alternateGuardianName} as the alternate Guardian.`;
            }
            addSection('Appointment of Guardian', guardianText, sectionCounter++);
        }

        // Real Estate
        if (realEstate.length > 0) {
            doc.setFont('times', 'bold');
            doc.text(`${sectionCounter++}. Real Estate`, margin, y);
            y += 10;
            doc.setFont('times', 'normal');
            realEstate.forEach((property) => {
                const propertyText = `I give my property described as "${property.description}" located at ${property.location}.`;
                const propertyLines = doc.splitTextToSize(propertyText, pageWidth - margin * 2 - 5);
                doc.text(`- ${propertyLines[0]}`, margin + 5, y);
                if (propertyLines.length > 1) {
                    doc.text(propertyLines.slice(1), margin + 5, y + 5);
                    y += (propertyLines.length) * 5 + 5;
                } else {
                     y += 10;
                }
            });
        }
        
        // Specific Gifts
        if (gifts.length > 0) {
             doc.setFont('times', 'bold');
             doc.text(`${sectionCounter++}. Specific Gifts`, margin, y);
             y += 10;
             doc.setFont('times', 'normal');
             gifts.forEach((gift) => {
                 const giftText = `I give to ${gift.beneficiary} the following item(s): ${gift.item}.`;
                 const giftLines = doc.splitTextToSize(giftText, pageWidth - margin * 2 - 5);
                 doc.text(`- ${giftLines[0]}`, margin + 5, y);
                 if (giftLines.length > 1) {
                    doc.text(giftLines.slice(1), margin + 5, y + 5);
                    y += (giftLines.length) * 5 + 5;
                } else {
                     y += 10;
                }
             });
        }

        // Residuary Estate
        if (residuaryBeneficiaryName) {
            const residuaryText = `I give all the rest, residue, and remainder of my estate, both real and personal, to ${residuaryBeneficiaryName}.`;
            addSection('Residuary Estate', residuaryText, sectionCounter++);
        }

        // Governing Law
        addSection('Governing Law', `The validity and interpretation of this Will shall be governed by the laws of ${jurisdiction}.`, sectionCounter++);

        // Signature Block
        const signatureText = `IN WITNESS WHEREOF, I have hereunto set my hand this ______ day of ____________________, 20____.`;
        doc.text(signatureText, margin, y);
        y += 20;
        doc.text('________________________________', margin, y);
        y += 7;
        doc.text(testatorName || '[Testator Name]', margin, y);
        y += 15;
        
        // Witnesses
        const witnessText = `SIGNED, PUBLISHED, AND DECLARED by the above-named Testator as and for their last Will and Testament, in the presence of us, who at their request, in their presence, and in the presence of each other, have hereunto subscribed our names as witnesses.`;
        const witnessLines = doc.splitTextToSize(witnessText, pageWidth - margin * 2);
        
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerHeight = 30; 
        const witnessBlockHeight = witnessLines.length * 7 + 15 + 20;

        if (y + witnessBlockHeight > pageHeight - footerHeight) {
            doc.addPage();
            y = margin;
        }

        doc.text(witnessLines, margin, y);
        y += witnessLines.length * 7 + 15;

        doc.text('Witness 1: __________________________', margin, y);
        y += 10;
        doc.text('Witness 2: __________________________', margin, y);

        // Disclaimer Footer (on every page)
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            const footerY = pageHeight - 20;
            doc.setLineWidth(0.5);
            doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
            doc.setFontSize(8);
            doc.setFont('times', 'italic');
            const disclaimer = "This document was generated by the WillPro utility. It is a template and MUST be reviewed by a qualified solicitor before execution to ensure it is legally binding and meets your specific needs.";
            const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
            doc.text(disclaimerLines, pageWidth / 2, footerY, { align: 'center' });
        }


        // Save the PDF
        doc.save(`Last_Will_and_Testament_${testatorName.replace(/\s/g, '_') || 'draft'}.pdf`);
        addAuditLog('PDF document generated and downloaded');
        setIsLoading(false);
    };

    return (
        <div className="review-step">
            <h2 className="step-title">Review & Generate</h2>
            <p className="step-subtitle">Please carefully review all the details below. Once confirmed, you can generate your secure document.</p>

            <div className="review-section">
                <h3>Jurisdiction</h3>
                <div className="review-item">
                    <strong>Governing Law:</strong>
                    <span>{formData.jurisdiction}</span>
                </div>
            </div>

            <div className="review-section">
                <h3>Testator Information</h3>
                <div className="review-item"><strong>Full Name:</strong><span>{formData.testatorName || 'N/A'}</span></div>
                <div className="review-item"><strong>Address:</strong><span>{formData.testatorAddress || 'N/A'}</span></div>
                 <div className="review-item"><strong>Date of Birth:</strong><span>{formData.testatorDob || 'N/A'}</span></div>
            </div>

            <div className="review-section">
                <h3>Appointments</h3>
                 <div className="review-item"><strong>Primary Executor:</strong><span>{formData.executorName || 'N/A'}</span></div>
                 <div className="review-item"><strong>Alternate Executor:</strong><span>{formData.alternateExecutorName || 'N/A'}</span></div>
                 {formData.hasMinorChildren && (
                    <>
                        <div className="review-item" style={{marginTop: '8px'}}><strong>Primary Guardian:</strong><span>{formData.guardianName || 'N/A'}</span></div>
                        <div className="review-item"><strong>Alternate Guardian:</strong><span>{formData.alternateGuardianName || 'N/A'}</span></div>
                    </>
                 )}
            </div>
            
             <div className="review-section">
                <h3>Real Estate Assets</h3>
                {formData.realEstate.length === 0 ? <p>No real estate assets listed.</p> : (
                    formData.realEstate.map((p, i) => <div className="review-item" key={i}><strong>{p.description}</strong><span>{p.location}</span></div>)
                )}
            </div>
            
             <div className="review-section">
                <h3>Specific Gifts</h3>
                {formData.gifts.length === 0 ? <p>No specific gifts listed.</p> : (
                    formData.gifts.map((g, i) => <div className="review-item" key={i}><strong>{g.beneficiary}:</strong><span>{g.item}</span></div>)
                )}
            </div>

            <div className="review-section">
                <h3>Residuary Estate</h3>
                <div className="review-item">
                    <strong>Beneficiary:</strong>
                    <span>{formData.residuaryBeneficiaryName || 'N/A'}</span>
                </div>
            </div>

            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleGeneratePdf} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Secure Document'}
                </button>
            </div>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button 
                    onClick={handleReset} 
                    className="start-over-btn"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
};

export default ReviewStep;