import React from 'react';
import { Section } from './ui/Section';
import { Download, FileText, Calendar, MapPin, User, Hash, Briefcase } from 'lucide-react';
import { FormData } from '../types';
import { Input } from './ui/Input';
import { Tooltip } from './ui/Tooltip';

const toWords = (num: number): string => {
    const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen"];
    return words[num] || num.toString();
};

interface Props {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
  onProceed?: () => void;
  onDownloadPDF?: (elementId: string, filename: string) => void;
}

export const AgreementTab: React.FC<Props> = ({ data, updateData, onProceed, onDownloadPDF }) => {
  const handleChange = (section: keyof FormData, field: string, value: any) => {
    updateData({
      [section]: { ...data[section], [field]: value }
    });
  };

  return (
    <div className="animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Left Column: Administrative Sidebar (Sticky) */}
            <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-32 space-y-8">
                    <div className="bg-white dark:bg-white/5 border border-tuc-ink/10 dark:border-tuc-gold/20 p-8 rounded-sm backdrop-blur-sm shadow-sm transition-colors duration-500">
                        <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-3 text-[#1A1A1A] dark:text-tuc-gold">
                            <span className="w-8 h-8 rounded-full bg-tuc-gold/20 flex items-center justify-center text-tuc-gold">
                                <Hash size={16} />
                            </span>
                            Agreement Metadata
                        </h3>
                        
                        <div className="space-y-6">
                            <Input
                                label="Date of Agreement"
                                type="date"
                                value={data.meta.date}
                                onChange={(e) => handleChange('meta', 'date', e.target.value)}
                                className="bg-[#FAF9F6] dark:bg-tuc-ink border-tuc-ink/20 dark:border-tuc-gold/30 focus:border-tuc-gold text-[#1A1A1A] dark:text-white"
                            />
                            <Input
                                label="Location (City/Town)"
                                placeholder="e.g. Accra"
                                value={data.meta.madeAt}
                                onChange={(e) => handleChange('meta', 'madeAt', e.target.value)}
                                className="bg-[#FAF9F6] dark:bg-tuc-ink border-tuc-ink/20 dark:border-tuc-gold/30 focus:border-tuc-gold text-[#1A1A1A] dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 border border-tuc-ink/10 dark:border-tuc-gold/20 p-8 rounded-sm backdrop-blur-sm shadow-sm transition-colors duration-500">
                        <h3 className="font-display font-bold text-xl uppercase mb-6 flex items-center gap-3 text-[#1A1A1A] dark:text-tuc-gold">
                            <span className="w-8 h-8 rounded-full bg-tuc-gold/20 flex items-center justify-center text-tuc-gold">
                                <User size={16} />
                            </span>
                            Scholar Identity
                        </h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block font-label tracking-widest uppercase text-xs text-[#444444] dark:text-tuc-cream/60 mb-2 font-bold">Title</label>
                                <select
                                    value={data.scholar.title}
                                    onChange={(e) => handleChange('scholar', 'title', e.target.value)}
                                    className="w-full p-3 bg-[#FAF9F6] dark:bg-tuc-ink border border-tuc-ink/20 dark:border-tuc-gold/30 focus:border-tuc-gold outline-none font-body text-[#1A1A1A] dark:text-white rounded-sm font-medium"
                                >
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Dr">Dr</option>
                                    <option value="Prof">Prof</option>
                                </select>
                            </div>
                            <Input
                                label="Full Legal Name"
                                placeholder="Enter full name"
                                value={data.scholar.fullName}
                                onChange={(e) => handleChange('scholar', 'fullName', e.target.value)}
                                className="bg-[#FAF9F6] dark:bg-tuc-ink font-bold text-lg border-tuc-ink/20 dark:border-tuc-gold/30 focus:border-tuc-gold text-[#1A1A1A] dark:text-white"
                            />
                            <Input
                                label="ID / Passport Number"
                                placeholder="Valid ID Number"
                                value={data.scholar.idNumber}
                                onChange={(e) => handleChange('scholar', 'idNumber', e.target.value)}
                                className="bg-[#FAF9F6] dark:bg-tuc-ink border-tuc-ink/20 dark:border-tuc-gold/30 focus:border-tuc-gold text-[#1A1A1A] dark:text-white"
                            />
                            <Input
                                label="Permanent Address"
                                placeholder="Residential Address"
                                value={data.scholar.address}
                                onChange={(e) => handleChange('scholar', 'address', e.target.value)}
                                className="bg-[#FAF9F6] dark:bg-tuc-ink border-tuc-ink/20 dark:border-tuc-gold/30 focus:border-tuc-gold text-[#1A1A1A] dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Legal Text */}
            <div className="lg:col-span-8">
                <style id="agreement-styles">
                    {`
                        #master-agreement-content {
                            padding: 48px 52px !important;
                            font-family: 'Times New Roman', Georgia, serif !important;
                        }
                        #master-agreement-content p, #master-agreement-content li {
                            margin-bottom: 1.2em !important;
                            line-height: 1.6 !important;
                            text-align: left !important;
                            hyphens: auto !important;
                            word-spacing: normal !important;
                            letter-spacing: normal !important;
                        }
                        #master-agreement-content ul li {
                            margin-bottom: 1.6em !important;
                        }
                        #master-agreement-content h3 {
                            margin-top: 2em !important;
                            margin-bottom: 0.6em !important;
                            display: block !important;
                            text-align: center !important;
                        }
                        .drop-cap {
                            float: left !important;
                            padding-right: 8px !important;
                            font-size: 4.5rem !important;
                            line-height: 1 !important;
                            font-weight: 900 !important;
                            margin-top: 0 !important;
                        }
                    `}
                </style>
                <div id="master-agreement-content" className="bg-white dark:bg-tuc-ink text-tuc-ink dark:text-tuc-cream shadow-2xl relative overflow-hidden border-t-4 border-tuc-gold">
                    {/* Watermark */}
                    <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03]">
                        <span className="font-display font-black text-[300px] text-tuc-ink dark:text-white leading-none">§</span>
                    </div>

                    <div className="relative z-10">
                        
                        <div className="text-center border-b-2 border-tuc-gold/30 pb-8 mb-10">
                            <h2 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight mb-4 text-[#1A1A1A] dark:text-white">Scholarship Agreement</h2>
                            <p className="font-display italic text-2xl text-tuc-gold !text-center font-bold">Techbridge University College Staff Development Scheme</p>
                        </div>

                        <div className="text-xl">
                            <p className="text-[#1A1A1A] dark:text-tuc-cream font-medium">
                                <span className="drop-cap font-display text-tuc-gold">T</span>
                                <strong>HIS AGREEMENT</strong> is made on this day between <strong>Techbridge University College (TUC)</strong> (hereinafter referred to as the "Sponsor") and the individual identified in the adjacent schedule (hereinafter referred to as the "Scholar").
                            </p>

                            <div>
                                <h3 className="font-display font-bold text-2xl uppercase text-tuc-gold border-b border-tuc-gold/20 pb-2">1. Preamble</h3>
                                <p>
                                    WHEREAS the Sponsor has established a Staff Development Scholarship Scheme to support the advanced education of its faculty and staff; AND WHEREAS the Scholar has applied for and been granted an award under this scheme to pursue a Doctor of Philosophy (PhD) programme in:
                                </p>
                                
                                <div className="bg-tuc-gold/5 border-l-4 border-tuc-gold p-8 my-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Input
                                            label="Department / Field of Study"
                                            placeholder="e.g. Computer Science"
                                            value={data.program.department}
                                            onChange={(e) => handleChange('program', 'department', e.target.value)}
                                            className="bg-transparent border-b border-tuc-ink/20 dark:border-tuc-cream/20 focus:border-tuc-gold px-0 rounded-none font-display font-bold text-xl"
                                        />
                                        <Input
                                            label="Programme Duration"
                                            placeholder="e.g. 3 Years"
                                            value={data.program.programDuration}
                                            onChange={(e) => handleChange('program', 'programDuration', e.target.value)}
                                            className="bg-transparent border-b border-tuc-ink/20 dark:border-tuc-cream/20 focus:border-tuc-gold px-0 rounded-none font-display font-bold text-xl"
                                        />
                                    </div>
                                    <Input
                                        label="PhD Subject / Research Topic"
                                        placeholder="e.g. Artificial Intelligence"
                                        value={data.program.phdSubject}
                                        onChange={(e) => handleChange('program', 'phdSubject', e.target.value)}
                                        className="bg-transparent border-b border-tuc-ink/20 dark:border-tuc-cream/20 focus:border-tuc-gold px-0 rounded-none font-display font-bold text-xl w-full"
                                    />
                                </div>

                                <p>
                                    (hereinafter referred to as the "Course of Study").
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-2xl uppercase text-tuc-gold border-b border-tuc-gold/20 pb-2">2. Obligations of the Scholar</h3>
                                <p>The Scholar hereby covenants to:</p>
                                <ul className="list-none space-y-4 pl-4 border-l border-tuc-gold/30 mb-8">
                                    <li className="flex gap-4">
                                        <span className="font-display font-bold text-tuc-gold">i.</span>
                                        <span>Diligently pursue and complete the Course of Study within the stipulated duration.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-display font-bold text-tuc-gold">ii.</span>
                                        <span>Maintain high academic standing and conduct throughout the tenure of the scholarship.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-display font-bold text-tuc-gold">iii.</span>
                                        <span>Submit progress reports to the Sponsor at the end of each academic semester.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-display font-bold text-tuc-gold">iv.</span>
                                        <span>Return to the service of Techbridge University College immediately upon completion of the programme.</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-2xl uppercase text-tuc-gold border-b border-tuc-gold/20 pb-2">3. Bond Period</h3>
                                <p>
                                    Upon successful completion of the PhD programme, the Scholar agrees to serve the Sponsor for a mandatory period of <strong className="text-tuc-gold border-b border-tuc-gold">{data.program.serviceYears} ({toWords(data.program.serviceYears).toUpperCase()}) YEARS</strong>. This service shall be in the capacity of a Lecturer or a higher rank officer, subject to the fulfillment of selection criteria and availability of vacancy.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-2xl uppercase text-tuc-gold border-b border-tuc-gold/20 pb-2">4. Default and Repayment</h3>
                                <p>
                                    In the event that the Scholar fails to complete the course, fails to return to service, or resigns before the completion of the Bond Period, the Scholar shall be liable to refund the <strong>entire amount</strong> spent on their studies by the Sponsor, calculated with commercial interest prevailing at the time of breach.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-2xl uppercase text-tuc-gold border-b border-tuc-gold/20 pb-2">5. General Provisions</h3>
                                <p>
                                    This Agreement shall be governed by and construed in accordance with the laws of the Republic of Ghana. Any variation to this Agreement must be in writing and signed by both parties.
                                </p>
                            </div>

                            <div className="mt-12 pt-12 border-t-2 border-tuc-gold/20">
                                <p className="font-display italic text-xl text-[#1A1A1A] dark:text-tuc-cream/60 mb-12 !text-center font-bold">IN WITNESS WHEREOF the parties have set their hands the day and year first above written.</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    <div className="space-y-10">
                                        <div>
                                            <p className="font-label text-xs tracking-widest uppercase mb-6 text-tuc-gold">Signed by the Scholar</p>
                                            <div className="h-20 border-b border-tuc-ink/20 dark:border-tuc-cream/20 flex items-end pb-2">
                                                <span className="font-display font-bold text-2xl font-signature">{data.scholar.fullName || ""}</span>
                                            </div>
                                            <p className="font-meta text-xs mt-2 text-tuc-ink/40 dark:text-tuc-cream/40 uppercase tracking-widest">Signature of Scholar</p>
                                        </div>
                                        <div>
                                            <p className="font-label text-xs tracking-widest uppercase mb-6 text-tuc-gold">In the presence of (Witness)</p>
                                            <div className="h-20 border-b border-tuc-ink/20 dark:border-tuc-cream/20 flex items-end pb-2">
                                                 <span className="font-display font-bold text-xl">{data.witnesses.scholarWitness.name || ""}</span>
                                            </div>
                                            <p className="font-meta text-xs mt-2 text-tuc-ink/40 dark:text-tuc-cream/40 uppercase tracking-widest">Name & Signature</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-10">
                                        <div>
                                            <p className="font-label text-xs tracking-widest uppercase mb-6 text-tuc-gold">Signed for the Sponsor</p>
                                            <div className="h-20 border-b border-tuc-ink/20 dark:border-tuc-cream/20 flex items-end pb-2">
                                                <span className="font-display font-bold text-xl">REGISTRAR / PRINCIPAL</span>
                                            </div>
                                            <p className="font-meta text-xs mt-2 text-tuc-ink/40 dark:text-tuc-cream/40 uppercase tracking-widest">Authorized Signatory</p>
                                        </div>
                                        <div>
                                            <p className="font-label text-xs tracking-widest uppercase mb-6 text-tuc-gold">In the presence of (Witness)</p>
                                            <div className="h-20 border-b border-tuc-ink/20 dark:border-tuc-cream/20 flex items-end pb-2">
                                                <span className="font-display font-bold text-xl">{data.witnesses.techbridgeWitness.name || ""}</span>
                                            </div>
                                            <p className="font-meta text-xs mt-2 text-tuc-ink/40 dark:text-tuc-cream/40 uppercase tracking-widest">Name & Signature</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-tuc-ink/10 dark:border-tuc-cream/10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <p className="font-label text-xs tracking-widest uppercase text-[#444444] dark:text-tuc-cream/50 font-bold">Document Reference</p>
                                <p className="font-mono text-sm text-tuc-gold font-bold">TUC-LEGAL-AGR-2026-V3</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <Tooltip content="Download copy of the master agreement">
                                  <button 
                                    onClick={() => onDownloadPDF?.('master-agreement-content', 'TUC-Master-Agreement.pdf')}
                                    className="flex items-center px-8 py-4 border border-[#1A1A1A] dark:border-tuc-cream text-[#1A1A1A] dark:text-tuc-cream hover:bg-[#1A1A1A] hover:text-white dark:hover:bg-white/5 transition-all font-label tracking-widest uppercase text-xs font-bold"
                                  >
                                      <Download size={16} className="mr-2" /> Download PDF
                                  </button>
                                </Tooltip>
                                {onProceed && (
                                    <Tooltip content="Proceed to enter bond details">
                                      <button 
                                          onClick={onProceed}
                                          className="flex items-center px-8 py-4 bg-[#1A1A1A] dark:bg-tuc-gold text-white dark:text-tuc-ink hover:bg-black dark:hover:bg-white transition-all font-label tracking-widest uppercase text-xs shadow-lg font-bold"
                                      >
                                          <FileText size={16} className="mr-2" /> Proceed to Sign
                                      </button>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
