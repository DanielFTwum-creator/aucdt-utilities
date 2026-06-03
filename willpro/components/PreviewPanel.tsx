import React, { useState } from 'react';
import { FormData } from '../App';

interface PreviewPanelProps {
  formData: FormData;
}

const placeholder = (text: string) => text || '[_____________]';

export default function PreviewPanel({ formData }: PreviewPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const willText = `
LAST WILL AND TESTAMENT

THIS WILL made this _____ day of _____________, 20_____, by me,
${placeholder(formData.testatorName)}, of ${placeholder(formData.testatorAddress)},
domiciled in the jurisdiction of ${formData.jurisdiction}.

WHEREAS I am of sound mind and memory and I hereby revoke all former wills,
codicils and testamentary dispositions:

NOW I HEREBY DECLARE as follows:

1. APPOINTMENT OF EXECUTOR

I hereby appoint ${placeholder(formData.executorName)} to be my Executor and Trustee
of this my Will, and if such person shall die, refuse, or be unable to act before
my death or shall die, refuse, or be unable or unwilling to act after my death,
then I appoint ${placeholder(formData.alternateExecutorName)} to be my Executor and Trustee.

2. APPOINTMENT OF GUARDIAN
${formData.hasMinorChildren ? `
I declare that I have minor children and I hereby appoint
${placeholder(formData.guardianName)} as guardian of my minor children,
with ${placeholder(formData.alternateGuardianName)} as alternate guardian.
` : `
I declare that I have no minor children requiring guardianship.
`}

3. REAL ESTATE

I direct my Executor to sell all my real estate and to distribute the proceeds
as part of my residuary estate, except for the following properties which I
specifically devise:

${formData.realEstate.length > 0
  ? formData.realEstate.map((prop, i) =>
      `${i + 1}. ${placeholder(prop.description)} located at ${placeholder(prop.location)}`
    ).join('\n')
  : 'None specified'}

4. SPECIFIC GIFTS

I hereby make the following specific bequests:

${formData.gifts.length > 0
  ? formData.gifts.map((gift, i) =>
      `${i + 1}. To ${placeholder(gift.beneficiary)}, I bequeath ${placeholder(gift.item)}`
    ).join('\n')
  : 'None specified'}

5. RESIDUARY ESTATE

All the rest, residue and remainder of my estate, both real and personal,
of every kind and description and wheresoever situate, I bequeath and devise
absolutely to ${placeholder(formData.residuaryBeneficiaryName)}.

6. GOVERNING LAW

This Will shall be governed by and construed in accordance with the laws
of ${formData.jurisdiction}.

IN WITNESS WHEREOF I have hereunto set my hand to this my Will this
_____ day of _____________, 20_____.

_________________________
${placeholder(formData.testatorName)}

SIGNED, PUBLISHED AND DECLARED by the above-named as their Last Will.

_________________________            _________________________
Witness 1                            Witness 2

Name: ___________________            Name: ___________________
Address: _________________           Address: _________________
`.trim();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="preview-toggle-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #B58A3D, #9F762E)',
          color: '#fff',
          border: 'none',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          zIndex: 500,
          boxShadow: '0 8px 24px rgba(181, 138, 61, 0.3)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(181, 138, 61, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(181, 138, 61, 0.3)';
        }}
      >
        {isOpen ? '✕ Close Preview' : '👁 View Will Preview'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '520px',
            height: '100vh',
            background: '#FAF9F6',
            borderLeft: '1px solid rgba(181, 138, 61, 0.2)',
            boxShadow: '-10px 0 40px rgba(181, 138, 61, 0.12)',
            zIndex: 501,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          } as React.CSSProperties}
        >
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(181, 138, 61, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#FFF',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1F2937', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Last Will & Testament Draft
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#94A3B8',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#B58A3D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '460px',
                background: '#FFFFFF',
                border: '1px solid rgba(181, 138, 61, 0.18)',
                boxShadow: '0 8px 30px rgba(27, 26, 25, 0.05)',
                padding: '40px 32px',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: '13px',
                lineHeight: '1.8',
                color: '#1F2937',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                borderRadius: '4px',
                position: 'relative',
              }}
            >
              {/* Subtle watermark / background lining */}
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '20px',
                width: '1px',
                background: 'rgba(181, 138, 61, 0.08)',
                pointerEvents: 'none'
              }}></div>
              <div style={{ paddingLeft: '12px' }}>
                {willText}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes slideInRight {
              from {
                transform: translateX(100%);
                opacity: 0.9;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
