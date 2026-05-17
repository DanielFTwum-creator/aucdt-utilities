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
          padding: '12px 20px',
          background: '#0891b2',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#0a7ea4')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#0891b2')}
      >
        {isOpen ? '✕ Preview' : '👁 Preview'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '480px',
            height: '100vh',
            background: '#fff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s ease',
          } as React.CSSProperties}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
              Will Preview
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '20px',
              fontFamily: '"Courier New", monospace',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#1f2937',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {willText}
          </div>

          <style>{`
            @keyframes slideInRight {
              from {
                transform: translateX(100%);
                opacity: 0;
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
