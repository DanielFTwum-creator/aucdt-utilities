import React, { useRef, useState, useEffect } from 'react';
import { FormData } from '../../types';
import { Section } from '../ui/Section';
import { Tooltip } from '../ui/Tooltip';
import { FileText, PenTool, Type, MousePointer2, Eraser, Info, Check, AlertCircle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

export const Step4Review: React.FC<Props> = ({ data, updateData }) => {
  // Safety check to prevent crashes if data is malformed
  if (!data || !data.signatures || !data.scholar || !data.program || !data.guarantor) {
    return (
      <div className="p-8 text-center animate-fade-in">
         <Loader2 className="animate-spin mx-auto text-tuc-gold mb-4" size={32} />
         <p className="font-body text-tuc-cream/60">Loading agreement details...</p>
      </div>
    );
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textSignatureRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    if (!data.signatures.signatureType) {
      updateData({
        signatures: { ...data.signatures, signatureType: 'text' }
      });
    }
  }, []);

  // Auto-generate image from text signature
  useEffect(() => {
    if (data.signatures.signatureType === 'text' && data.signatures.scholarSign?.trim()) {
      const timer = setTimeout(async () => {
        if (textSignatureRef.current) {
          try {
            // Capture the signature visual with transparency
            const canvas = await html2canvas(textSignatureRef.current, {
              backgroundColor: null,
              scale: 2, // Retain high quality
              logging: false,
              ignoreAnimations: true,
              onclone: (clonedDoc) => {
                const styleTags = Array.from(clonedDoc.getElementsByTagName('style'));
                const linkTags = Array.from(clonedDoc.getElementsByTagName('link'));
                styleTags.forEach(tag => tag.remove());
                linkTags.forEach(tag => tag.remove());
                
                const el = clonedDoc.getElementById('text-signature-preview');
                if (el) {
                  el.style.color = '#0F0C07';
                  el.style.backgroundColor = '#FDFBF7';
                  el.style.border = '2px dashed #0F0C07';
                  const children = el.getElementsByTagName('*');
                  for(let i=0; i<children.length; i++) {
                    (children[i] as HTMLElement).style.color = '#0F0C07';
                  }
                }
              }
            });
            const imgData = canvas.toDataURL('image/png');
            handleSignatureChange('signatureImage', imgData);
          } catch (err) {
            console.error("Signature rasterization failed:", err);
          }
        }
      }, 800); // Debounce to avoid lag while typing
      return () => clearTimeout(timer);
    } else if (data.signatures.signatureType === 'text' && !data.signatures.scholarSign?.trim()) {
       handleSignatureChange('signatureImage', '');
    }
  }, [data.signatures.scholarSign, data.signatures.signatureType]);

  const handleSignatureChange = (field: keyof typeof data.signatures, value: any) => {
    updateData({
      signatures: { ...data.signatures, [field]: value },
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleSignatureChange('signatureImage', '');
      }
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#0F0C07'; // Ink Black
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            handleSignatureChange('signatureImage', canvas.toDataURL());
        }
    }
  };

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* Review Section */}
      <Section title="Final Review" description="Please verify that all information is accurate. Errors may delay the scholarship disbursement.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
          
          {/* Scholar Profile */}
          <div className="space-y-8">
            <h3 className="font-display font-bold text-xl text-tuc-ink dark:text-white uppercase border-b border-tuc-gold/30 pb-4 mb-6">
              Scholar Profile
            </h3>
            <dl className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-dashed border-tuc-ink/10 dark:border-tuc-cream/10 pb-2">
                <dt className="font-label text-[#444444] dark:text-tuc-cream/60 text-xs tracking-widest uppercase font-bold">Name</dt>
                <dd className="font-display font-bold text-xl text-tuc-ink dark:text-white text-right">{data.scholar.title} {data.scholar.fullName}</dd>
              </div>
              <div className="flex justify-between items-baseline border-b border-dashed border-tuc-ink/10 dark:border-tuc-cream/10 pb-2">
                <dt className="font-label text-[#444444] dark:text-tuc-cream/60 text-xs tracking-widest uppercase font-bold">ID / Passport</dt>
                <dd className="font-body text-lg text-tuc-ink dark:text-white text-right">{data.scholar.idNumber}</dd>
              </div>
              <div className="flex justify-between items-baseline border-b border-dashed border-tuc-ink/10 dark:border-tuc-cream/10 pb-2">
                <dt className="font-label text-[#444444] dark:text-tuc-cream/60 text-xs tracking-widest uppercase font-bold">Guarantor</dt>
                <dd className="font-body text-lg text-tuc-ink dark:text-white text-right">{data.guarantor.name}</dd>
              </div>
            </dl>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-tuc-gold/20 -ml-px"></div>

          {/* Bond Obligations */}
          <div className="space-y-8">
            <h3 className="font-display font-bold text-xl text-tuc-ink dark:text-white uppercase border-b border-tuc-gold/30 pb-4 mb-6">
              Bond Obligations
            </h3>
            <dl className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-dashed border-tuc-ink/10 dark:border-tuc-cream/10 pb-2">
                <dt className="font-label text-[#444444] dark:text-tuc-cream/60 text-xs tracking-widest uppercase font-bold">Department</dt>
                <dd className="font-body text-lg text-tuc-ink dark:text-white text-right">{data.program.department}</dd>
              </div>
              <div className="flex justify-between items-baseline border-b border-dashed border-tuc-ink/10 dark:border-tuc-cream/10 pb-2">
                <dt className="font-label text-[#444444] dark:text-tuc-cream/60 text-xs tracking-widest uppercase font-bold">PhD Research</dt>
                <dd className="font-body italic text-lg text-tuc-ink dark:text-white text-right">{data.program.phdSubject || 'Pending Selection'}</dd>
              </div>
              <div className="flex justify-between items-baseline pt-4 mt-2 bg-tuc-gold/10 p-4 rounded-sm border border-tuc-gold/20">
                <dt className="font-label text-tuc-gold text-xs tracking-widest uppercase font-bold flex items-center">
                  <AlertCircle size={14} className="mr-2" /> Mandatory Bond
                </dt>
                <dd className="font-display font-black text-2xl text-tuc-gold text-right">10 Years Post-Qual</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* Signature Section */}
      <Section title="E-Signature Verification" description="Legally binding digital signature required for execution.">
        <div className="space-y-12">
           
           {/* Agreement Checkbox */}
           <div className="flex items-start gap-6 p-8 border border-tuc-gold/30 bg-tuc-gold/5 backdrop-blur-sm rounded-sm transition-all hover:bg-tuc-gold/10">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  id="terms"
                  className="peer h-6 w-6 cursor-pointer appearance-none border-2 border-tuc-gold bg-transparent checked:bg-tuc-gold transition-all rounded-sm"
                  checked={data.signatures.agreedToTerms}
                  onChange={(e) => handleSignatureChange('agreedToTerms', e.target.checked)}
                />
                <Check size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-tuc-ink opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <label htmlFor="terms" className="font-body text-xl text-tuc-ink/90 dark:text-tuc-cream/90 leading-relaxed cursor-pointer select-none">
                 I confirm that the details provided are true and correct. I understand that this digital signature constitutes a legally binding agreement under the <strong>Electronic Communications and Transactions Act</strong>.
              </label>
           </div>

           <div className="space-y-8">
             {/* Toggle Buttons */}
             <div className="flex gap-12 border-b border-tuc-ink/10 dark:border-tuc-rule pb-4 justify-center md:justify-start">
                <button
                    onClick={() => handleSignatureChange('signatureType', 'text')}
                    className={`flex items-center gap-3 pb-2 transition-all font-label tracking-widest uppercase text-sm ${
                        data.signatures.signatureType === 'text' 
                        ? 'text-tuc-gold border-b-2 border-tuc-gold -mb-[17px]' 
                        : 'text-tuc-ink/40 dark:text-tuc-cream/40 hover:text-tuc-ink dark:hover:text-white'
                    }`}
                >
                    <Type size={18} /> Textual
                </button>
                <button
                    onClick={() => handleSignatureChange('signatureType', 'draw')}
                    className={`flex items-center gap-3 pb-2 transition-all font-label tracking-widest uppercase text-sm ${
                        data.signatures.signatureType === 'draw' 
                        ? 'text-tuc-gold border-b-2 border-tuc-gold -mb-[17px]' 
                        : 'text-tuc-ink/40 dark:text-tuc-cream/40 hover:text-tuc-ink dark:hover:text-white'
                    }`}
                >
                    <MousePointer2 size={18} /> Handwritten
                </button>
             </div>

             {data.signatures.signatureType === 'text' ? (
                 <div className="animate-fade-in space-y-8">
                    <div>
                      <label className="block font-label tracking-widest uppercase text-xs text-tuc-gold mb-2">Full Legal Name</label>
                      <input
                          type="text"
                          placeholder="Type your full name exactly as it appears on your ID"
                          className="w-full px-0 py-6 bg-transparent border-b-2 border-tuc-gold/30 transition-all outline-none font-display text-4xl text-tuc-ink dark:text-white placeholder-tuc-ink/20 dark:placeholder-tuc-cream/20 focus:border-tuc-gold"
                          value={data.signatures.scholarSign}
                          onChange={(e) => handleSignatureChange('scholarSign', e.target.value)}
                      />
                    </div>
                    
                    {/* Visual Preview Container - Paper Look */}
                    <div className="p-16 bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center shadow-2xl border border-tuc-ink/5 transform rotate-1 transition-transform hover:rotate-0 duration-500">
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise"></div>
                        
                        <div className="absolute top-6 left-8 flex items-center text-tuc-ink/30 text-[10px] uppercase tracking-[0.2em] font-black">
                          <PenTool size={12} className="mr-2" /> Digital Certificate Preview
                        </div>
                        
                        <div id="text-signature-preview" ref={textSignatureRef} className="flex flex-col items-center justify-center p-8 w-full border-2 border-dashed border-tuc-ink/10 rounded-sm">
                            {data.signatures.scholarSign ? (
                                <div className="text-7xl md:text-9xl font-display italic text-tuc-ink transform -rotate-2 leading-none px-8 py-6 text-center min-h-[160px] flex items-center font-signature">
                                    {data.signatures.scholarSign}
                                </div>
                            ) : (
                                <div className="text-tuc-ink/10 text-5xl font-display italic select-none min-h-[160px] flex items-center">
                                    Sign Here
                                </div>
                            )}
                            <div className="w-96 h-0.5 bg-tuc-ink/80 mt-4"></div>
                            <p className="font-mono text-[10px] text-tuc-ink/40 mt-2 uppercase tracking-widest">Verified by Techbridge SecureSign™</p>
                        </div>
                    </div>
                 </div>
             ) : (
                 <div className="animate-fade-in space-y-6">
                    <div className="flex justify-between items-center">
                        <label className="block font-label tracking-widest uppercase text-xs text-tuc-gold">Electronic Pad</label>
                        <Tooltip content="Wipe signature and restart">
                          <button 
                              onClick={clearCanvas}
                              className="text-xs font-label tracking-widest flex items-center text-tuc-cream/40 hover:text-red-500 transition-colors uppercase"
                          >
                              <Eraser size={14} className="mr-2" /> Reset
                          </button>
                        </Tooltip>
                    </div>
                    <div className="bg-[#FDFBF7] touch-none cursor-crosshair overflow-hidden shadow-2xl border border-tuc-ink/5 relative">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise"></div>
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={400}
                            className="w-full h-80 md:h-96 relative z-10"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                             <div className="w-96 h-0.5 bg-tuc-ink/10 mx-auto"></div>
                             <p className="font-mono text-[10px] text-tuc-ink/20 mt-2 uppercase tracking-widest">Sign Above The Line</p>
                        </div>
                    </div>
                 </div>
             )}
           </div>
        </div>
      </Section>
    </div>
  );
};
