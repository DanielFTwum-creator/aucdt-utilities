import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Step1Scholar } from './components/steps/Step1Scholar';
import { Step2Program } from './components/steps/Step2Program';
import { Step3GuarantorWitness } from './components/steps/Step3GuarantorWitness';
import { Step4Review } from './components/steps/Step4Review';
import { AgreementTab } from './components/AgreementTab';
import { AdminPanel } from './components/admin/AdminPanel';
import { Theme } from './components/ui/ThemeSwitcher';
import { Tooltip } from './components/ui/Tooltip';
import { Toast, ToastMessage, ToastType } from './components/ui/Toast';
import { FormData, INITIAL_DATA } from './types';
import { ArrowRight, ArrowLeft, Loader2, Send, Sparkles, BrainCircuit, QrCode, Download, RefreshCw, Copy, GraduationCap, Scale, Clock, FileSignature, ShieldCheck } from 'lucide-react';
import { submitApplication } from './services/api';
import { logAction } from './services/auditLog';
import { GoogleGenAI } from "@google/genai";
import QRCode from 'qrcode';
import html2canvas from 'html2canvas'; // For capturing text signature in simulation
import jsPDF from 'jspdf';
import { MOCK_TEST_DATA, saveTestResult } from './services/testRunner';

const STEPS = [
  "Scholar Identity",
  "Academic Programme",
  "Legal Attestation",
  "Review & Execute"
];

const STORAGE_KEY = 'techbridge_portal_v3_data';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Deep merge with INITIAL_DATA to ensure new fields exist
        return {
          ...INITIAL_DATA,
          ...parsed,
          signatures: { ...INITIAL_DATA.signatures, ...(parsed.signatures || {}) },
          witnesses: { 
             ...INITIAL_DATA.witnesses, 
             techbridgeWitness: { ...INITIAL_DATA.witnesses.techbridgeWitness, ...(parsed.witnesses?.techbridgeWitness || {}) },
             scholarWitness: { ...INITIAL_DATA.witnesses.scholarWitness, ...(parsed.witnesses?.scholarWitness || {}) }
          },
          program: { ...INITIAL_DATA.program, ...(parsed.program || {}) },
          scholar: { ...INITIAL_DATA.scholar, ...(parsed.scholar || {}) },
          meta: { ...INITIAL_DATA.meta, ...(parsed.meta || {}) },
          guarantor: { ...INITIAL_DATA.guarantor, ...(parsed.guarantor || {}) },
        };
      }
      return INITIAL_DATA;
    } catch (e) {
      return INITIAL_DATA;
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [view, setView] = useState<'form' | 'admin'>(() => {
    // Check URL for admin view (for PWA shortcuts and direct links)
    const hash = window.location.hash;
    return hash.startsWith('#/admin') ? 'admin' : 'form';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setView(hash.startsWith('#/admin') ? 'admin' : 'form');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#/admin';
  };

  const navigateToForm = () => {
    window.location.hash = '#/';
  };
  
  // Theme: Default to 'dark' for Report Cover look
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('techbridge_theme');
    return (saved as Theme) || 'dark';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // AI Review State
  const [aiReview, setAiReview] = useState<{ feedback: string; score: number } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  // QR Code State
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Certificate Theme Mode
  const [certMode, setCertMode] = useState<'dark' | 'light'>('dark');

  // Tab State
  const [activeTab, setActiveTab] = useState<'bond' | 'agreement'>('agreement');

  // Ref for simulation to access latest state
  const formDataRef = React.useRef(formData);
  
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('techbridge_theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light', 'high-contrast');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'high-contrast') {
      root.classList.add('high-contrast');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  useEffect(() => {
    if (isSuccess) {
      // Use the Shared App URL for the QR code so it can be scanned by external devices
      const targetUrl = 'https://ais-pre-g7jeqeezfrtm5d6auwt4c7-15098263044.europe-west2.run.app';
      QRCode.toDataURL(targetUrl, {
        width: 512, // High resolution
        margin: 2,
        color: {
          dark: theme === 'high-contrast' ? '#000000' : '#C8A84B', // TUC Gold
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H'
      })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error("QR Code Gen Error", err));
    }
  }, [isSuccess, theme]); // Depend on theme to regenerate QR

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const isStepValid = (step: number) => {
    switch(step) {
      case 1:
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmailValid = emailRegex.test(formData.scholar.email || '');
        return !!(formData.scholar.fullName?.trim() && isEmailValid && formData.scholar.idNumber?.trim() && formData.scholar.address?.trim());
      case 2:
        return !!(formData.program.department?.trim() && formData.program.phdSubject?.trim() && formData.program.serviceYears >= 1);
      case 3:
        const g = formData.guarantor;
        const w = formData.witnesses;
        const guarantorComplete = !!(g.name?.trim() && g.idNumber?.trim() && g.phone?.trim());
        const witnessesComplete = !!(w.scholarWitness.name?.trim() && w.scholarWitness.idNumber?.trim() && w.techbridgeWitness.name?.trim() && w.techbridgeWitness.idNumber?.trim());
        return guarantorComplete && witnessesComplete;
      case 4:
        return formData.signatures.agreedToTerms && (!!formData.signatures.scholarSign?.trim() || !!formData.signatures.signatureImage);
      default:
        return true;
    }
  };

  const nextStep = () => {
    // Granular Validation with Toasts
    if (currentStep === 1) {
      const s = formData.scholar;
      if (!s.fullName?.trim()) return addToast('warning', 'Missing Information', "Full Legal Name is required.");
      if (!s.idNumber?.trim()) return addToast('warning', 'Missing Information', "ID / Passport Number is required.");
      if (!s.email?.trim()) return addToast('warning', 'Missing Information', "Email Address is required.");
      if (!s.phone?.trim()) return addToast('warning', 'Missing Information', "Phone Number is required.");
      if (!s.address?.trim()) return addToast('warning', 'Missing Information', "Residential Address is required.");
    }

    if (currentStep === 2) {
      const p = formData.program;
      if (!p.department?.trim()) return addToast('warning', 'Missing Information', "Department is required.");
      if (!p.phdSubject?.trim()) return addToast('warning', 'Missing Information', "PhD Subject is required.");
      if (!p.fundingSource?.trim()) return addToast('warning', 'Missing Information', "Funding Source is required.");
    }

    if (currentStep === 3) {
      const g = formData.guarantor;
      const w = formData.witnesses;
      if (!g.name?.trim()) return addToast('warning', 'Legal Requirement', "Guarantor Name is required.");
      if (!g.idNumber?.trim()) return addToast('warning', 'Legal Requirement', "Guarantor ID is required.");
      if (!g.phone?.trim()) return addToast('warning', 'Legal Requirement', "Guarantor Phone is required.");
      
      if (!w.scholarWitness.name?.trim()) return addToast('warning', 'Legal Requirement', "Scholar Witness Name is required.");
      if (!w.scholarWitness.idNumber?.trim()) return addToast('warning', 'Legal Requirement', "Scholar Witness ID is required.");
      
      if (!w.techbridgeWitness.name?.trim()) return addToast('warning', 'Legal Requirement', "Techbridge Witness Name is required.");
      if (!w.techbridgeWitness.idNumber?.trim()) return addToast('warning', 'Legal Requirement', "Techbridge Witness ID is required.");
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAiReview = async () => {
    if (isReviewing) return;
    setIsReviewing(true);
    setAiReview(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Review the following scholarship bond application for professional tone, completeness, and legal clarity. 
        
        APPLICANT CONTEXT:
        - Full Name: ${formData.scholar.fullName}
        - PhD Research Topic: ${formData.program.phdSubject}
        - Department: ${formData.program.department}
        
        BOND SPECIFICATIONS:
        - Service Commitment: ${formData.program.serviceYears} years post-completion
        - Funding Source: ${formData.program.fundingSource}
        
        LEGAL ATTESTATION STATUS:
        - Guarantor Provided: ${formData.guarantor.name ? 'Yes (' + formData.guarantor.name + ')' : 'No'}
        - University Witness: ${formData.witnesses.techbridgeWitness.name ? 'Yes' : 'No'}
        - Scholar's Witness: ${formData.witnesses.scholarWitness.name ? 'Yes' : 'No'}
        - Agreement Location: ${formData.meta.madeAt}
        
        ANALYSIS CRITERIA:
        1. Evaluate if the service bond duration (${formData.program.serviceYears} yrs) is reasonable or high.
        2. Identify if critical legal pillars (Guarantor, Witnesses) are populated.
        3. Check for professional consistency between the research topic and the academic department.
        
        Provide constructive feedback and a score out of 100.
        Return ONLY valid JSON: {"feedback": "string", "score": number}`,
        config: { responseMimeType: 'application/json' }
      });
      
      const result = JSON.parse(response.text || '{"feedback": "Unable to analyse", "score": 0}');
      setAiReview(result);
      addToast('info', 'Audit Complete', `Readiness Score: ${result.score}%`);
    } catch (error) {
      console.error("AI Error:", error);
      setAiReview({ feedback: "AI Review unavailable. Proceed with manual check.", score: 100 });
      addToast('error', 'Service Unavailable', "AI Audit unavailable.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleSubmit = async () => {
    const currentData = formDataRef.current;
    if (!currentData.signatures.agreedToTerms) {
      addToast('warning', 'Legal Requirement', "You must agree to the terms and conditions.");
      return;
    }
    if (!currentData.signatures.scholarSign?.trim() && !currentData.signatures.signatureImage) {
      addToast('warning', 'Legal Requirement', "Your digital signature is required to execute the bond.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Generate PNG Record for attachment (PDF was failing to attach correctly)
      let recordPngBase64 = '';
      const element = document.getElementById('hidden-pdf-certificate');
      
      if (element) {
        addToast('info', 'Document Assembly', 'Preparing official digital record...');
        const canvas = await html2canvas(element, {
          scale: 1.0, 
          useCORS: true,
          backgroundColor: '#0F0C07',
          logging: false,
          ignoreAnimations: true,
          onclone: (clonedDoc) => {
            const styleTags = Array.from(clonedDoc.getElementsByTagName('style'));
            const linkTags = Array.from(clonedDoc.getElementsByTagName('link'));
            styleTags.forEach(tag => tag.remove());
            linkTags.forEach(tag => tag.remove());
            if (clonedDoc.body) clonedDoc.body.style.backgroundColor = '#0F0C07';
          }
        });
        
        recordPngBase64 = canvas.toDataURL('image/png');
      }

      // 2. Submit with PNG Attachment
      const result = await submitApplication(currentData, recordPngBase64);
      if (result.success) {
        setIsSuccess(true);
        localStorage.removeItem(STORAGE_KEY);
        addToast('success', 'Agreement Secured', "Bond executed and record dispatched.");
        return true;
      } else {
        addToast('error', 'Submission Failed', result.message || "Retry submission.");
        return false;
      }
    } catch (error) {
      console.error("Submission Error:", error);
      addToast('error', 'Transmission Failed', "Retry submission.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('success', 'Copied', 'Portal URL copied to clipboard.');
  };

  const generatePDF = async (elementId: string = 'hidden-pdf-certificate', filename: string = `TUC-BOND-${formData.scholar.idNumber}.pdf`) => {
    // Capture the target element
    const element = document.getElementById(elementId);
    if (!element) return;
    
    addToast('info', 'Preparing Document', `Generating official PDF...`);
    
    try {
      const canvas = await html2canvas(element, {
        scale: 1.5, // High quality for print
        useCORS: true,
        backgroundColor: certMode === 'dark' ? '#0F0C07' : '#ffffff',
        ignoreAnimations: true,
        onclone: (clonedDoc) => {
          // Absolute isolation from Tailwind oklab/oklch colors
          const styleTags = Array.from(clonedDoc.getElementsByTagName('style'));
          const linkTags = Array.from(clonedDoc.getElementsByTagName('link'));
          styleTags.forEach(tag => {
            if (tag.id !== 'agreement-styles') tag.remove();
          });
          linkTags.forEach(tag => tag.remove());
          
          const el = clonedDoc.getElementById(elementId);
          if (el) {
            el.style.position = 'relative';
            el.style.left = '0';
            el.style.display = 'flex';
            // If capturing the master agreement, ensure it's readable
            if (elementId === 'master-agreement-content') {
                el.style.color = theme === 'dark' ? '#ffffff' : '#0F0C07';
                el.style.backgroundColor = theme === 'dark' ? '#0F0C07' : '#ffffff';
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.setProperties({ title: `TUC Document - ${formData.scholar.fullName}` });
      pdf.save(filename);
      addToast('success', 'PDF Ready', 'Official document downloaded.');
    } catch (error) {
      console.error("PDF Error:", error);
      addToast('error', 'Print Failed', 'Unable to generate PDF record.');
    }
  };

  const runSimulation = useCallback(async () => {
    logAction('SIMULATION_STARTED', 'Automated test sequence initiated', 'Admin');
    addToast('info', 'Simulation Active', 'Form will auto-fill and submit.');
    
    // SECURITY: Block if not in admin view
    if (view !== 'admin') return;
    setIsSuccess(false);
    
    const startTime = performance.now();
    let simulationPassed = true;
    let screenshotData: string | undefined;

    try {
      // Reset form and go to step 1
      setCurrentStep(1);
      setFormData(MOCK_TEST_DATA as FormData);
      addToast('info', 'Step 1', 'Scholar details injected.');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Visit Agreement Tab
      setActiveTab('agreement');
      addToast('info', 'Agreement', 'Reviewing legal terms...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setActiveTab('bond');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate step-by-step navigation
      for (let i = 1; i < STEPS.length; i++) {
        setCurrentStep(i + 1);
        addToast('info', `Step ${i + 1}`, `${STEPS[i]} completed.`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Simulate signature image generation from text for step 4
      const signatureTextDiv = document.getElementById('text-signature-preview'); // Ensure this ID exists in Step4Review
      if (signatureTextDiv && MOCK_TEST_DATA.signatures?.scholarSign) {
          const canvas = await html2canvas(signatureTextDiv, {
              backgroundColor: null,
              scale: 2,
              logging: false,
          });
          const imgData = canvas.toDataURL('image/png');
          setFormData(prev => ({
              ...prev,
              signatures: {
                  ...prev.signatures,
                  signatureImage: imgData,
                  agreedToTerms: true, // Ensure terms are agreed for submission
              }
          }));
          addToast('info', 'Signature', 'Text signature rasterized.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Attempt submission
      const submissionResult = await handleSubmit(); // This will show success toast
      if (!submissionResult) {
        throw new Error("Submission failed during simulation.");
      }

      // Capture screenshot of success page
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const screenshotCanvas = await html2canvas(rootElement, { scale: 1 });
        screenshotData = screenshotCanvas.toDataURL('image/png');
      }

      logAction('SIMULATION_PASSED', 'Automated test sequence completed successfully', 'Admin');
      addToast('success', 'Simulation Complete', 'Test bot finished successfully!');
      simulationPassed = true;

    } catch (error: any) {
      console.error("Simulation error:", error);
      logAction('SIMULATION_FAILED', `Automated test sequence failed: ${error.message}`, 'Admin');
      addToast('error', 'Simulation Failed', `Test bot encountered an error: ${error.message}`);
      simulationPassed = false;
    } finally {
      const endTime = performance.now();
      saveTestResult({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        status: simulationPassed ? 'passed' : 'failed',
        screenshot: screenshotData,
        duration: endTime - startTime,
        log: [] // Detailed logs can be added here if needed
      });
      // Reset to initial state after simulation
      setCurrentStep(1);
      setFormData(INITIAL_DATA);
      setIsSuccess(false);
      setView('admin'); // Stay in admin view to see results
    }
  }, [view, handleSubmit, addToast]);

  if (view === 'admin') {
    return (
      <Layout theme={theme} setTheme={setTheme} onAdminClick={navigateToAdmin}>
        <AdminPanel 
          onLogout={navigateToForm} 
          onRunSimulation={runSimulation}
        />
      </Layout>
    );
  }

  if (isSuccess) {
    return (
      <Layout theme={theme} setTheme={setTheme} onAdminClick={navigateToAdmin}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 animate-fade-up">
            {/* Left: Certificate Visual */}
            <div className="space-y-6">
                <CertificateVisual data={formData} id="bond-record-certificate" mode={certMode} />
                
                {/* Hidden Certificate for PDF Generation - Always uses selected certMode */}
                <CertificateVisual data={formData} id="hidden-pdf-certificate" hidden mode={certMode} />

                <div className="flex items-center justify-center gap-4 bg-tuc-ink/5 dark:bg-white/5 p-4 rounded-full border border-tuc-gold/20">
                    <span className="font-label text-xs tracking-widest text-tuc-gold uppercase">Output Format:</span>
                    <Tooltip content="Premium Digital Record Theme">
                      <button 
                          onClick={() => setCertMode('dark')}
                          className={`px-6 py-2 rounded-full text-[10px] font-label tracking-widest uppercase transition-all ${certMode === 'dark' ? 'bg-tuc-gold text-tuc-ink shadow-lg' : 'text-tuc-gold/60 hover:text-tuc-gold'}`}
                      >
                          Classic (Dark)
                      </button>
                    </Tooltip>
                    <Tooltip content="Economical Print-Ready Theme">
                      <button 
                          onClick={() => setCertMode('light')}
                          className={`px-6 py-2 rounded-full text-[10px] font-label tracking-widest uppercase transition-all ${certMode === 'light' ? 'bg-tuc-gold text-tuc-ink shadow-lg' : 'text-tuc-gold/60 hover:text-tuc-gold'}`}
                      >
                          Print Friendly (Light)
                      </button>
                    </Tooltip>
                </div>
            </div>

            {/* Right: Actions & QR - Mirroring High-Quality Email Style */}
            <div className="flex flex-col justify-center space-y-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white dark:bg-tuc-ink/95 border border-tuc-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden flex flex-col group transition-colors duration-500">
                    {/* Professional Header - Matches email template */}
                    <div className="bg-tuc-ink dark:bg-black p-8 text-center border-b-4 border-tuc-gold relative">
                        <div className="absolute top-4 right-4 flex gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-tuc-gold/40"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-tuc-gold/20"></div>
                        </div>
                        <h3 className="font-label text-tuc-gold tracking-widest-xl text-xl uppercase mb-1">Scholarship Bond Executed</h3>
                        <p className="font-body italic text-tuc-gold/60 text-xs">Official Digital Record • Techbridge University College</p>
                    </div>

                    <div className="p-10 flex flex-col items-center">
                        <div className="flex justify-between w-full mb-10 items-center">
                            <div className="flex flex-col">
                                <span className="font-label text-tuc-gold/80 text-[10px] tracking-widest uppercase">Verification Node</span>
                                <span className="font-mono text-xs text-[#444444] dark:text-tuc-cream/60 font-bold">NODE-2026-TUC</span>
                            </div>
                            <span className="px-4 py-1.5 bg-green-900/20 dark:bg-[#004d00] text-green-800 dark:text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm border border-green-500/20">Legal Attestation Verified</span>
                        </div>

                        {/* QR Code Container with Gold Dashed Border */}
                        <div className="relative p-6 border-2 border-dashed border-tuc-gold/30 bg-tuc-gold/[0.02] mb-10 group-hover:border-tuc-gold/60 transition-all duration-700">
                             <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-tuc-gold"></div>
                             <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-tuc-gold"></div>
                             
                             {qrCodeUrl ? (
                                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 mix-blend-multiply dark:mix-blend-screen filter contrast-125" />
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-tuc-gold" size={48} />
                                </div>
                            )}
                        </div>

                        <div className="w-full space-y-6 text-left border-t border-tuc-gold/10 pt-8">
                             <div>
                                <span className="block font-label text-tuc-gold/80 text-[11px] tracking-widest uppercase mb-2 text-center font-bold">Digital Signature Hash (SHA-256)</span>
                                <div className="font-mono text-[11px] text-[#444444] dark:text-tuc-cream/60 break-all bg-tuc-gold/5 p-4 border border-tuc-gold/10 rounded-sm leading-relaxed text-center font-bold">
                                    {btoa(formData.scholar.idNumber + new Date().toLocaleDateString()).substring(0, 32)}
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Tooltip content="Export official record as PDF">
                      <button 
                          onClick={generatePDF}
                          className="w-full flex items-center justify-center px-8 py-5 bg-tuc-ink dark:bg-tuc-gold text-tuc-gold dark:text-tuc-ink border border-tuc-gold/30 text-xs font-label tracking-widest uppercase hover:opacity-90 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
                      >
                          <Download size={16} className="mr-3" /> Print Official Bond
                      </button>
                    </Tooltip>
                    <Tooltip content="Copy portal link to clipboard">
                      <button
                          onClick={copyLink}
                          className="w-full flex items-center justify-center px-8 py-5 bg-white dark:bg-tuc-ink/50 text-tuc-ink dark:text-tuc-gold border border-tuc-gold/20 text-xs font-label tracking-widest uppercase hover:bg-tuc-gold/5 transition-all shadow-md hover:-translate-y-1 active:translate-y-0"
                      >
                        <Copy size={16} className="mr-3" /> Copy Link
                      </button>
                    </Tooltip>
                </div>
                
                <div className="text-center">
                    <Tooltip content="Reset form and start a new bond application">
                      <button 
                          onClick={() => window.location.reload()}
                          className="text-tuc-gold/60 hover:text-tuc-gold font-label tracking-widest transition-colors text-sm flex items-center justify-center gap-2 mx-auto py-2 px-4 hover:bg-tuc-gold/5 rounded-full"
                      >
                          <RefreshCw size={14} /> Process Another Application
                      </button>
                    </Tooltip>
                </div>
            </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout theme={theme} setTheme={setTheme} onAdminClick={navigateToAdmin}>
      {/* ─── ATMOSPHERIC OVERLAYS ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`, backgroundSize: '180px 180px' }}></div>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
           style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 28px, #C9A84C 28px, #C9A84C 29px)` }}></div>

      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col items-end pointer-events-none w-full max-w-md px-4 gap-4">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* ─── DECORATIVE RULE SYSTEM ─── */}
      <div className="relative z-10 flex items-center justify-center gap-0 py-4 opacity-60">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-tuc-gold/40 to-tuc-gold"></div>
          <span className="font-display text-[10px] text-tuc-gold px-6 tracking-[0.5em] uppercase whitespace-nowrap">✦ OFFICIAL DIGITAL INSTRUMENT ✦</span>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent via-tuc-gold/40 to-tuc-gold"></div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[75vh] flex items-center px-6 lg:px-12 py-12 overflow-hidden border-x border-tuc-gold/10 mx-4">
        
        {/* Watermark Crest - Midground Fill */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none z-1">
            <svg viewBox="0 0 200 200" width="500" height="500" xmlns="http://www.w3.org/2000/svg" className="fill-tuc-gold">
                <polygon points="100,10 120,80 190,80 135,120 155,190 100,150 45,190 65,120 10,80 80,80" opacity="0.8"/>
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2"/>
                <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1"/>
                <text x="100" y="104" textAnchor="middle" fontSize="10" letterSpacing="3" fontFamily="serif">TUC</text>
            </svg>
        </div>

        {/* Diagonal Year Stamp */}
        <div className="absolute top-24 -left-8 -rotate-90 origin-left opacity-20 hidden xl:block z-10">
            <span className="font-display text-tuc-gold text-[9px] tracking-[0.45em] uppercase whitespace-nowrap">
                REF: TUC-2026-LEGAL &nbsp;·&nbsp; SCHOLARSHIP EXECUTION BOND &nbsp;·&nbsp; OFFICIAL INSTRUMENT
            </span>
        </div>

        {/* Serial Float */}
        <div className="absolute top-12 right-12 opacity-20 hidden xl:block z-10" style={{ writingMode: 'vertical-rl' }}>
            <span className="font-display text-tuc-gold text-[8px] tracking-[0.4em] uppercase">
                SEB/2026/0001-ALPHA
            </span>
        </div>

        <div className="max-w-[1800px] mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
              
              {/* Left Column: Title & Metadata */}
              <div className="relative pr-0 lg:pr-16 lg:border-r border-tuc-gold/15 py-12">
                  {/* Corner Ornaments */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-tuc-gold/40"></div>
                  <div className="absolute bottom-0 right-16 w-8 h-8 border-b border-r border-tuc-gold/40 hidden lg:block"></div>

                  <div className="flex items-center gap-6 mb-8">
                      <div className="h-px w-10 bg-tuc-gold/40"></div>
                      <span className="font-display text-tuc-gold text-[9px] tracking-[0.35em] uppercase opacity-60">
                          Official Digital Instrument // Ref: TUC-2026-Legal
                      </span>
                  </div>
                  
                  <h2 className="font-display font-black text-6xl md:text-[5.5rem] leading-[0.92] uppercase tracking-tighter mb-10">
                    <span className="text-[#1A1A1A] dark:text-white block animate-fade-up">Scholarship</span>
                    <span className="text-transparent dark:text-tuc-gold block animate-fade-up" 
                          style={{ 
                            animationDelay: '0.1s',
                            WebkitTextStroke: theme === 'light' ? '2px #2C2C2C' : '0'
                          }}>Execution</span>
                    <span className="text-transparent dark:text-tuc-gold block animate-fade-up" 
                          style={{ 
                            animationDelay: '0.2s',
                            WebkitTextStroke: theme === 'light' ? '2px #2C2C2C' : '0'
                          }}>Bond</span>
                  </h2>

                  <div className="flex flex-col gap-1 mb-10 opacity-60">
                      <div className="h-[3px] w-4/5 bg-gradient-to-r from-tuc-gold via-tuc-gold-dark to-transparent"></div>
                      <div className="h-px w-3/5 bg-gradient-to-r from-tuc-gold-dark to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                      <div className="flex flex-col gap-1">
                          <span className="font-display text-[#444444] dark:text-tuc-gold-dark text-[7px] tracking-[0.4em] uppercase font-bold">Academic Year</span>
                          <span className="font-serif text-[#1A1A1A] dark:text-tuc-cream/80 text-xs font-medium">2025 — 2026</span>
                      </div>
                      <div className="flex flex-col gap-1">
                          <span className="font-display text-[#444444] dark:text-tuc-gold-dark text-[7px] tracking-[0.4em] uppercase font-bold">Status</span>
                          <span className="font-serif text-[#1A1A1A] dark:text-tuc-cream/80 text-xs italic font-medium">Active · Binding</span>
                      </div>
                      <div className="flex flex-col gap-1">
                          <span className="font-display text-[#444444] dark:text-tuc-gold-dark text-[7px] tracking-[0.4em] uppercase font-bold">Instrument Type</span>
                          <span className="font-serif text-[#1A1A1A] dark:text-tuc-cream/80 text-xs font-medium">Legal Framework</span>
                      </div>
                  </div>
              </div>
              
              {/* Right Column: Terms Block */}
              <div className="pl-0 lg:pl-16 py-12">
                  <h3 className="font-display text-3xl text-tuc-gold tracking-[0.3em] uppercase mb-6 font-bold">
                      Agreement & <br/> Terms
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-8">
                      <div className="h-px w-16 bg-tuc-gold/40"></div>
                      <div className="w-2 h-2 rotate-45 bg-tuc-gold"></div>
                      <div className="h-px w-16 bg-tuc-gold/40"></div>
                  </div>
                  
                  <p className="font-serif text-xl text-[#1A1A1A] dark:text-tuc-cream/90 leading-[1.75] text-justify font-medium">
                    This instrument constitutes the <strong className="text-tuc-gold font-bold">binding legal framework</strong> governing the Techbridge University College scholarship scheme. 
                    Scholars are mandated to verify all clauses through this secure digital interface prior to commencement of any disbursement cycle.
                    <br/><br/>
                    All parties acknowledge that execution of this bond is irrevocable upon digital attestation and carries the full weight of institutional authority under the statutes of <strong className="text-tuc-gold">TUC 2026</strong>.
                  </p>
              </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
            <div className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-0.5 bg-tuc-gold rounded-full"></div>
                <div className="w-0.5 h-0.5 bg-tuc-gold/40 rounded-full"></div>
            </div>
            <div className="w-2.5 h-2.5 rotate-45 border border-tuc-gold/50"></div>
        </div>
      </section>

      {/* Feature Band */}
      <div className="border-y border-tuc-gold/20 py-8 mb-16 bg-tuc-gold/5 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '0.35s' }}>
         <div className="max-w-[1800px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-tuc-gold/20">
             <div className="flex items-center gap-6 px-4 py-2 justify-center md:justify-start">
                <div className="p-4 border border-tuc-gold/30 rounded-full text-tuc-gold bg-tuc-ink/5">
                  <Scale size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block font-label text-tuc-gold tracking-widest text-sm mb-1 font-bold">Legal Binding</span>
                  <span className="block font-body italic text-[#1A1A1A] dark:text-tuc-cream/60 text-lg font-medium">Enforceable by Law</span>
                </div>
             </div>
             
             <div className="flex items-center gap-6 px-4 py-2 justify-center md:justify-start">
                <div className="p-4 border border-tuc-gold/30 rounded-full text-tuc-gold bg-tuc-ink/5">
                  <Clock size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block font-label text-tuc-gold tracking-widest text-sm mb-1 font-bold">Academic Tenure</span>
                  <span className="block font-body italic text-[#1A1A1A] dark:text-tuc-cream/60 text-lg font-medium">{formData.program.serviceYears} Year Commitment</span>
                </div>
             </div>
             
             <div className="flex items-center gap-6 px-4 py-2 justify-center md:justify-start">
                <div className="p-4 border border-tuc-gold/30 rounded-full text-tuc-gold bg-tuc-ink/5">
                  <FileSignature size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <span className="block font-label text-tuc-gold tracking-widest text-sm mb-1 font-bold">Digital Witness</span>
                  <span className="block font-body italic text-[#1A1A1A] dark:text-tuc-cream/60 text-lg font-medium">Blockchain Verified</span>
                </div>
             </div>
         </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-16 animate-fade-up" style={{ animationDelay: '0.38s' }}>
        <div className="inline-flex bg-white dark:bg-tuc-ink border border-tuc-gold/20 p-1.5 rounded-full shadow-2xl">
            <button
                onClick={() => setActiveTab('agreement')}
                className={`px-10 py-4 rounded-full font-label tracking-widest uppercase text-sm transition-all font-bold ${
                    activeTab === 'agreement' 
                    ? 'bg-tuc-gold text-tuc-ink shadow-[0_0_20px_rgba(200,168,75,0.4)]' 
                    : 'text-[#444444] dark:text-tuc-gold/60 hover:bg-tuc-gold/5'
                }`}
            >
                1. Agreement
            </button>
            <button
                onClick={() => setActiveTab('bond')}
                className={`px-10 py-4 rounded-full font-label tracking-widest uppercase text-sm transition-all font-bold ${
                    activeTab === 'bond' 
                    ? 'bg-tuc-gold text-tuc-ink shadow-[0_0_20px_rgba(200,168,75,0.4)]' 
                    : 'text-[#444444] dark:text-tuc-gold/60 hover:bg-tuc-gold/5'
                }`}
            >
                2. Bond / Undertaking
            </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
         
         {/* Main Content (8 cols) */}
         <div className="lg:col-span-8">
            {/* Hidden Certificate for PDF Generation */}
            <CertificateVisual data={formData} id="hidden-pdf-certificate" hidden />
            
            {activeTab === 'bond' ? (
                <>
                    {/* Step Indicator (Minimal) */}
                    <div className="mb-12 flex items-baseline gap-6 border-b border-tuc-gold/20 pb-8">
                       <span className="font-display font-black text-8xl text-tuc-gold/20 leading-none select-none -mb-4">0{currentStep}</span>
                       <div className="flex flex-col">
                           <span className="font-label text-tuc-gold tracking-widest text-sm uppercase mb-1">Step {currentStep} of 04</span>
                           <span className="font-display font-bold text-3xl text-white">{STEPS[currentStep-1]}</span>
                       </div>
                    </div>

                    {/* Step Component */}
                    <div className="min-h-[400px]">
                      {currentStep === 1 && <Step1Scholar data={formData} updateData={updateFormData} />}
                      {currentStep === 2 && <Step2Program data={formData} updateData={updateFormData} />}
                      {currentStep === 3 && <Step3GuarantorWitness data={formData} updateData={updateFormData} />}
                      {currentStep === 4 && (
                        <div className="space-y-12 animate-slide-up">
                          <Step4Review data={formData} updateData={updateFormData} />
                          
                          {/* AI Insight Card - Magazine Style */}
                          <div className="bg-white dark:bg-tuc-ink border border-tuc-gold/30 p-8 relative overflow-hidden group transition-colors duration-500">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-tuc-gold/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
                            
                            {isReviewing && (
                              <div className="absolute inset-0 bg-white/90 dark:bg-tuc-ink/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <BrainCircuit size={48} className="text-tuc-gold animate-pulse mb-3" />
                                <p className="font-display italic text-tuc-gold animate-pulse text-xl">Analyzing Document Tone...</p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                              <div className="flex items-center gap-4">
                                <div className="p-3 border border-tuc-gold/50 rounded-full">
                                   <Sparkles className="text-tuc-gold" size={20} /> 
                                </div>
                                <div>
                                    <h4 className="font-display font-bold text-2xl text-tuc-ink dark:text-white">AI Compliance Audit</h4>
                                    <p className="font-label text-tuc-gold/60 tracking-widest text-xs">Gemini 3.0 Engine</p>
                                </div>
                              </div>
                              {!aiReview && !isReviewing && (
                                <button 
                                  onClick={handleAiReview}
                                  className="px-8 py-3 border border-tuc-gold text-tuc-gold hover:bg-tuc-gold hover:text-tuc-ink transition-all font-label tracking-widest uppercase text-sm"
                                >
                                  Run Audit
                                </button>
                              )}
                            </div>
                            
                            {aiReview ? (
                              <div className="space-y-6 animate-fade-in relative z-10">
                                <div className="flex items-end gap-4 border-b border-tuc-rule pb-4">
                                  <span className="font-display font-bold text-6xl text-white leading-none">{aiReview.score}</span>
                                  <div className="mb-2">
                                     <span className="block font-label text-tuc-gold tracking-widest text-xs">Readiness Score</span>
                                     <span className="block font-body italic text-tuc-cream/60 text-sm">Out of 100</span>
                                  </div>
                                </div>
                                
                                <div className="pl-4 border-l-2 border-tuc-gold/50">
                                  <p className="text-tuc-cream font-body italic text-xl leading-relaxed">"{aiReview.feedback}"</p>
                                </div>
                                <button onClick={() => setAiReview(null)} className="text-xs text-tuc-gold/60 hover:text-tuc-gold font-label tracking-widest uppercase border-b border-transparent hover:border-tuc-gold transition-all pb-0.5">Re-evaluate</button>
                              </div>
                            ) : (
                              <p className="text-tuc-cream/60 font-body text-lg leading-relaxed max-w-lg">
                                Our embedded AI will analyse the agreement for tone consistency, data completeness, and legal phrasing before final execution.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center justify-between pt-12 mt-12 border-t border-tuc-rule">
                      <Tooltip content="Return to previous section">
                        <button
                          onClick={prevStep}
                          disabled={currentStep === 1 || isSubmitting}
                          className={`flex items-center px-8 py-4 border border-transparent hover:border-tuc-gold/30 transition-all font-label tracking-widest uppercase text-sm
                            ${currentStep === 1 
                              ? 'text-tuc-cream/20 cursor-not-allowed' 
                              : 'text-tuc-gold hover:bg-tuc-gold/5'
                            }`}
                        >
                          <ArrowLeft size={16} className="mr-2" /> Previous
                        </button>
                      </Tooltip>

                      {currentStep === STEPS.length ? (
                        <Tooltip content="Execute and submit digital bond">
                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !formData.signatures.agreedToTerms}
                            className="flex items-center px-12 py-4 bg-tuc-gold hover:bg-white text-tuc-ink hover:text-tuc-ink transition-all font-label tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(200,168,75,0.2)] hover:shadow-[0_0_30px_rgba(200,168,75,0.4)] disabled:opacity-50 disabled:shadow-none"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 size={18} className="mr-2 animate-spin" /> Processing...
                              </>
                            ) : (
                              <>
                                Finalize Agreement <Send size={16} className="ml-2" />
                              </>
                            )}
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Validate and proceed to next section">
                          <button
                            onClick={nextStep}
                            className="flex items-center px-12 py-4 border border-tuc-gold text-tuc-gold hover:bg-tuc-gold hover:text-tuc-ink transition-all font-label tracking-widest uppercase text-sm"
                          >
                            Continue <ArrowRight size={16} className="ml-2" />
                          </button>
                        </Tooltip>
                      )}
                    </nav>
                </>
                ) : (
                    <AgreementTab 
                        data={formData} 
                        updateData={updateFormData} 
                        onProceed={() => {
                            setActiveTab('bond');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onDownloadPDF={generatePDF}
                    />
                )}
         </div>

         {/* Sidebar (4 cols) */}
         <aside className="lg:col-span-4 space-y-12 hidden lg:block pt-8">
            {/* Document Metadata (Report Style) */}
            <div className="space-y-6 text-right lg:text-left">
                <div className="pl-6 border-l border-tuc-rule transition-colors">
                    <span className="font-label text-[#444444] dark:text-tuc-gold/60 text-[10px] tracking-widest uppercase block mb-1 font-bold">Submitted to</span>
                    <p className="font-body text-[#1A1A1A] dark:text-tuc-cream text-lg leading-tight font-medium">The President,<br/>Techbridge University College</p>
                </div>
                <div className="pl-6 border-l border-tuc-rule transition-colors">
                    <span className="font-label text-[#444444] dark:text-tuc-gold/60 text-[10px] tracking-widest uppercase block mb-1 font-bold">Prepared by</span>
                    <p className="font-body text-[#1A1A1A] dark:text-tuc-cream text-lg leading-tight font-medium">Scholarship Secretariat &<br/>Legal Department</p>
                </div>
            </div>

            {/* Sell Line 01 */}
            <div className="pl-6 border-l border-tuc-rule group hover:border-tuc-gold transition-colors">
               <span className="font-label text-[#444444] dark:text-tuc-gold/60 text-xs tracking-widest block mb-2 group-hover:text-tuc-gold transition-colors font-bold">01. Duration</span>
               <p className="font-display font-bold text-4xl text-[#1A1A1A] dark:text-white mb-1">{formData.program.serviceYears} Years</p>
               <p className="font-body italic text-[#1A1A1A] dark:text-tuc-cream/60 text-lg font-medium">Mandatory service period post-graduation.</p>
            </div>

            {/* Sell Line 02 */}
            <div className="pl-6 border-l border-tuc-rule group hover:border-tuc-gold transition-colors">
               <span className="font-label text-[#444444] dark:text-tuc-gold/60 text-xs tracking-widest block mb-2 group-hover:text-tuc-gold transition-colors font-bold">02. Identity</span>
               <p className="font-display font-bold text-3xl text-[#1A1A1A] dark:text-white mb-1 truncate">{formData.scholar.fullName || "Pending..."}</p>
               <p className="font-body italic text-[#1A1A1A] dark:text-tuc-cream/60 text-lg font-medium">Primary beneficiary of the bond.</p>
            </div>

            {/* Quote Box */}
            <div className="bg-tuc-gold/5 p-6 border border-tuc-gold/10 relative mt-8">
                <span className="absolute top-4 left-4 font-display text-6xl text-tuc-gold opacity-20">“</span>
                <p className="font-body italic text-xl text-[#1A1A1A] dark:text-tuc-cream leading-relaxed relative z-10 pt-4 font-medium">
                    Education is the most powerful weapon which you can use to change the world.
                </p>
                <span className="block font-label text-tuc-gold tracking-widest text-xs mt-4 text-right font-bold">— Nelson Mandela</span>
            </div>
         </aside>
      </div>
    </Layout>
  );
};

// Extracted Certificate Component for reuse in PDF generation and Success screen
const CertificateVisual: React.FC<{ data: FormData; id?: string; hidden?: boolean; mode?: 'dark' | 'light' }> = ({ data, id, hidden, mode = 'dark' }) => {
    const isDark = mode === 'dark';
    const bgColor = isDark ? '#0F0C07' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0F0C07';
    const subTextColor = isDark ? '#FAF9F6' : '#333333';
    const ruleColor = isDark ? 'rgba(200, 168, 75, 0.2)' : 'rgba(200, 168, 75, 0.4)';
    const boxColor = isDark ? 'rgba(200, 168, 75, 0.05)' : 'rgba(200, 168, 75, 0.03)';

    return (
    <div 
        id={id} 
        style={{
            position: hidden ? 'fixed' : 'relative',
            left: hidden ? '-9999px' : '0',
            top: '0',
            width: hidden ? '1000px' : '100%',
            backgroundColor: bgColor,
            border: `1px solid ${ruleColor}`,
            padding: '40px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '1100px',
            color: textColor,
            boxSizing: 'border-box',
            fontFamily: 'serif'
        }}
    >
        {/* Top Gold Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', backgroundColor: '#C8A84B' }}></div>
        
        {/* Header Section */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(200, 168, 75, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${ruleColor}` }}>
                    <GraduationCap size={32} color="#C8A84B" strokeWidth={1} />
                </div>
                <div>
                    <span style={{ fontFamily: 'sans-serif', color: '#C8A84B', letterSpacing: '0.15em', fontSize: '12px', display: 'block', fontWeight: 'bold' }}>OFFICIAL DIGITAL INSTRUMENT</span>
                    <span style={{ fontFamily: 'serif', fontWeight: 'bold', fontSize: '22px', textTransform: 'uppercase' }}>Techbridge University College</span>
                </div>
            </div>
            
            <h2 style={{ fontFamily: 'serif', fontWeight: '900', fontSize: '28px', marginBottom: '4px', lineHeight: '1', textTransform: 'uppercase' }}>
                Scholarship <br/> <span style={{ color: '#C8A84B', fontStyle: 'italic' }}>Execution Bond</span>
            </h2>
            <p style={{ fontSize: '10px', color: '#C8A84B', opacity: 0.6, letterSpacing: '1px' }}>CERTIFICATE OF LEGAL UNDERTAKING // REF: {data.scholar.idNumber || 'TUC-2026'}</p>
        </div>

        {/* 1. Scholar Identity */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}>
            <h4 style={{ color: '#C8A84B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', borderBottom: `1px solid ${ruleColor}`, paddingBottom: '4px' }}>Section I: Scholar Identity</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                <div>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '2px' }}>{data.scholar.title} {data.scholar.fullName}</p>
                    <p style={{ fontSize: '12px', opacity: 0.8, fontStyle: 'italic', marginBottom: '12px' }}>Son/Daughter of: {data.scholar.parentName || "Not Specified"}</p>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>RESIDENTIAL ADDRESS</span>
                        <p style={{ fontSize: '13px', lineHeight: '1.4' }}>{data.scholar.address}</p>
                    </div>
                </div>
                <div>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>IDENTITY NO.</span>
                        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{data.scholar.idNumber}</p>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>EMAIL</span>
                        <p style={{ fontSize: '13px' }}>{data.scholar.email}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>PHONE</span>
                        <p style={{ fontSize: '13px' }}>{data.scholar.phone}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Academic Programme */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '24px' }}>
            <h4 style={{ color: '#C8A84B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', borderBottom: `1px solid ${ruleColor}`, paddingBottom: '4px' }}>Section II: Academic Engagement</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>DEPARTMENT / FIELD</span>
                        <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{data.program.department}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>RESEARCH TOPIC</span>
                        <p style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: '1.4' }}>{data.program.phdSubject}</p>
                    </div>
                </div>
                <div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>PROGRAMME DURATION</span>
                        <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{data.program.programDuration}</p>
                    </div>
                    <div>
                        <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>FUNDING SOURCE</span>
                        <p style={{ fontSize: '13px' }}>{data.program.fundingSource}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. Bond Terms */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '24px', backgroundColor: boxColor, padding: '20px', border: `1px dashed ${ruleColor}` }}>
            <h4 style={{ color: '#C8A84B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Section III: Bond Obligation</h4>
            <p style={{ fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
                The Scholar hereby agrees to serve Techbridge University College for a mandatory period of 
                <strong style={{ color: '#C8A84B', margin: '0 5px', fontSize: '16px' }}>{data.program.serviceYears} YEARS</strong> 
                immediately following the successful completion of the aforementioned programme.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                <div>
                    <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>LEGAL GUARANTOR</span>
                    <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{data.guarantor.name}</p>
                    <p style={{ fontSize: '11px', opacity: 0.7 }}>ID: {data.guarantor.idNumber} | Tel: {data.guarantor.phone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block' }}>EXECUTION LOCATION</span>
                    <p style={{ fontSize: '13px' }}>{data.meta.madeAt}, Ghana</p>
                </div>
            </div>
        </div>

        {/* 4. Attestation */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '30px' }}>
            <h4 style={{ color: '#C8A84B', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', borderBottom: `1px solid ${ruleColor}`, paddingBottom: '4px' }}>Section IV: Legal Attestation</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                    <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block', marginBottom: '4px' }}>UNIVERSITY REPRESENTATIVE</span>
                    <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{data.witnesses.techbridgeWitness.name}</p>
                    <p style={{ fontSize: '11px', opacity: 0.6 }}>Identity: {data.witnesses.techbridgeWitness.idNumber}</p>
                </div>
                <div>
                    <span style={{ fontSize: '10px', color: '#C8A84B', display: 'block', marginBottom: '4px' }}>SCHOLAR'S WITNESS</span>
                    <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{data.witnesses.scholarWitness.name}</p>
                    <p style={{ fontSize: '11px', opacity: 0.6 }}>Identity: {data.witnesses.scholarWitness.idNumber}</p>
                </div>
            </div>
        </div>

        {/* Footer & Signature Section */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '24px', borderTop: `1px solid ${ruleColor}` }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#C8A84B', opacity: 0.6, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Date Filed</span>
                        <span style={{ fontFamily: 'monospace', color: subTextColor, fontSize: '12px' }}>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div style={{ width: '1px', height: '20px', backgroundColor: ruleColor }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#C8A84B', opacity: 0.6, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>System Hash</span>
                        <span style={{ fontFamily: 'monospace', color: subTextColor, fontSize: '12px' }}>{btoa(data.scholar.idNumber + data.meta.date).substring(0, 12)}</span>
                    </div>
                </div>
                <p style={{ fontSize: '9px', opacity: 0.4 }}>This document is a certified digital record of Techbridge University College Registrar's Office.</p>
            </div>

            {/* Signature Area */}
            <div style={{ textAlign: 'right' }}>
                {data.signatures.signatureImage && data.signatures.signatureImage !== 'text_signature_placeholder' ? (
                    <img 
                        src={data.signatures.signatureImage} 
                        alt="Signature" 
                        style={{ maxHeight: '50px', filter: isDark ? 'brightness(0) invert(1)' : 'none', marginBottom: '4px' }} 
                    />
                ) : (
                    <p style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '20px', color: '#C8A84B', marginBottom: '4px' }}>{data.signatures.scholarSign}</p>
                )}
                <div style={{ width: '180px', height: '1px', backgroundColor: '#C8A84B', marginLeft: 'auto' }}></div>
                <span style={{ color: '#C8A84B', opacity: 0.6, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px', display: 'block' }}>Scholar's Authorized Signature</span>
            </div>
        </div>
    </div>
    );
};

export default App;
