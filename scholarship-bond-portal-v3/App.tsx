
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  ChevronRight, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  BrainCircuit,
  Lock,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type Step = 'identity' | 'contact' | 'witness' | 'review' | 'success';

interface BondFormData {
  fullName: string;
  idNumber: string;
  parentName: string;
  address: string;
  phone: string;
  email: string;
  witnessName: string;
  witnessPhone: string;
}

const LOGO_URL = "https://techbridge.edu.gh/static/TUC_LOGO_1.png";

// --- Components ---

const FloatingInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
}> = ({ label, value, onChange, type = 'text', placeholder, error, icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-6">
      <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-300 ${
        isFocused ? 'border-[#D4AF37] bg-white ring-4 ring-[#D4AF37]/10' : 'border-[#F7F7F7] bg-[#FFFFFF]'
      } ${error ? 'border-red-500 bg-red-50' : ''}`}>
        {icon && <div className={`transition-colors duration-300 ${isFocused ? 'text-[#D4AF37]' : 'text-slate-400'}`}>{icon}</div>}
        <div className="flex-1 relative">
          <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${
            isFocused || value ? '-top-2.5 text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider' : 'top-0 text-base text-slate-400'
          }`}>
            {label}
          </label>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholder : ''}
            className="w-full bg-transparent border-none outline-none pt-2 font-medium text-slate-900"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-2 font-medium">{error}</p>}
    </div>
  );
};

const PremiumButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}> = ({ children, onClick, disabled, loading, variant = 'primary' }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`w-full py-4 px-8 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
      variant === 'primary' 
      ? 'gold-gradient text-slate-900 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 active:translate-y-0' 
      : 'bg-white border-2 border-[#F7F7F7] text-slate-600 hover:border-[#D4AF37]/30 hover:bg-[#FFF8F0]'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {loading ? <Sparkles className="animate-spin w-5 h-5" /> : children}
  </button>
);

const StepIndicator: React.FC<{ current: number; total: number; title: string }> = ({ current, total, title }) => (
  <div className="mb-10 text-center sm:text-left">
    <div className="flex items-center gap-4 mb-2">
       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
         Step 0{current} of 0{total}
       </span>
       <div className="h-px flex-1 bg-slate-100 hidden sm:block"></div>
    </div>
    <h2 className="text-3xl font-display font-bold text-slate-900">{title}</h2>
  </div>
);

// --- Layout Components ---

const AuthLayout: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onAuth();
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md glass-card p-10 sm:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 gold-gradient opacity-80"></div>
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-[#6B2C3E] p-3 rounded-2xl shadow-xl shadow-[#6B2C3E]/20 mb-6 w-60 h-60 flex items-center justify-center">
             <img src={LOGO_URL} alt="Techbridge Logo" className="w-[10.5rem] h-[10.5rem] object-contain" />
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 tracking-tight leading-none mb-2">Techbridge</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Oyibi Campus • Scholarship Portal</p>
        </div>

        <div className="space-y-2">
          <FloatingInput 
            label="Full Legal Name" 
            value={formData.name} 
            onChange={v => setFormData(prev => ({ ...prev, name: v }))}
            icon={<User className="w-5 h-5" />}
          />
          <FloatingInput 
            label="Access Code" 
            value={formData.code} 
            onChange={v => setFormData(prev => ({ ...prev, code: v }))}
            type="password"
            icon={<Lock className="w-5 h-5" />}
          />
        </div>

        <div className="mt-8">
          <PremiumButton onClick={handleLogin} loading={loading}>
            Continue to Agreement <ChevronRight className="w-5 h-5" />
          </PremiumButton>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Digital Handshake Protocol Active
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<Step>('identity');
  const [formData, setFormData] = useState<BondFormData>({
    fullName: '', idNumber: '', parentName: '', address: '',
    phone: '', email: '', witnessName: '', witnessPhone: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BondFormData, string>>>({});

  const validateStep = () => {
    const newErrors: typeof errors = {};
    if (step === 'identity') {
      if (!formData.fullName) newErrors.fullName = 'Please enter your legal name';
      if (!formData.idNumber) newErrors.idNumber = 'Valid ID number is required';
    } else if (step === 'contact') {
      if (!formData.parentName) newErrors.parentName = 'Guardian name is required';
      if (!formData.email.includes('@')) newErrors.email = 'A valid professional email is required';
      if (!formData.phone) newErrors.phone = 'Contact number is required';
    } else if (step === 'witness') {
      if (!formData.witnessName) newErrors.witnessName = 'Witness identification is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 'identity') setStep('contact');
      else if (step === 'contact') setStep('witness');
      else if (step === 'witness') setStep('review');
      else if (step === 'review') setStep('success');
    }
  };

  if (!isAuthenticated) return <AuthLayout onAuth={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 sm:px-12 flex flex-col items-center">
      <header className="w-full max-w-4xl flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex items-center gap-4">
          <div className="bg-[#6B2C3E] p-1.5 rounded-xl w-36 h-36 flex items-center justify-center">
             <img src={LOGO_URL} alt="Techbridge Logo" className="w-[6.75rem] h-[6.75rem] object-contain" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 leading-none">Techbridge</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Scholarship Bond Portal</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
           <div className="text-right">
             <p className="text-[11px] font-bold text-slate-900 leading-none">John Doe</p>
             <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider">Class of 2026</p>
           </div>
           <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">JD</div>
        </div>
      </header>

      <main className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'identity' && (
            <motion.div 
              key="id"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StepIndicator current={1} total={4} title="Scholar Identity" />
              <FloatingInput 
                label="Full Legal Name" 
                value={formData.fullName} 
                onChange={v => setFormData({...formData, fullName: v})}
                error={errors.fullName}
                icon={<User className="w-5 h-5" />}
              />
              <FloatingInput 
                label="National ID / Student ID" 
                value={formData.idNumber} 
                onChange={v => setFormData({...formData, idNumber: v})}
                error={errors.idNumber}
                icon={<Lock className="w-5 h-5" />}
              />
              <div className="mt-12">
                <PremiumButton onClick={nextStep}>Next: Contact Details <ArrowRight className="w-5 h-5" /></PremiumButton>
              </div>
            </motion.div>
          )}

          {step === 'contact' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StepIndicator current={2} total={4} title="Personal Details" />
              <FloatingInput 
                label="Parent/Guardian Name" 
                value={formData.parentName} 
                onChange={v => setFormData({...formData, parentName: v})}
                error={errors.parentName}
                icon={<User className="w-5 h-5" />}
              />
              <FloatingInput 
                label="Residential Address" 
                value={formData.address} 
                onChange={v => setFormData({...formData, address: v})}
                icon={<MapPin className="w-5 h-5" />}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput 
                  label="Contact Number" 
                  value={formData.phone} 
                  onChange={v => setFormData({...formData, phone: v})}
                  error={errors.phone}
                  icon={<Phone className="w-5 h-5" />}
                />
                <FloatingInput 
                  label="Professional Email" 
                  value={formData.email} 
                  onChange={v => setFormData({...formData, email: v})}
                  error={errors.email}
                  icon={<Mail className="w-5 h-5" />}
                />
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <PremiumButton variant="secondary" onClick={() => setStep('identity')}>Back</PremiumButton>
                <PremiumButton onClick={nextStep}>Next: Witnesses <ArrowRight className="w-5 h-5" /></PremiumButton>
              </div>
            </motion.div>
          )}

          {step === 'witness' && (
            <motion.div 
              key="witness"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <StepIndicator current={3} total={4} title="Witness Details" />
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">Please provide the details of an individual who can verify your legal signature and commitment to this scholarship bond.</p>
              <FloatingInput 
                label="Witness Full Name" 
                value={formData.witnessName} 
                onChange={v => setFormData({...formData, witnessName: v})}
                error={errors.witnessName}
                icon={<User className="w-5 h-5" />}
              />
              <FloatingInput 
                label="Witness Phone" 
                value={formData.witnessPhone} 
                onChange={v => setFormData({...formData, witnessPhone: v})}
                icon={<Phone className="w-5 h-5" />}
              />
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <PremiumButton variant="secondary" onClick={() => setStep('contact')}>Back</PremiumButton>
                <PremiumButton onClick={nextStep}>Next: Final Review <ArrowRight className="w-5 h-5" /></PremiumButton>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <StepIndicator current={4} total={4} title="Final Review" />
              <div className="bg-white rounded-[2rem] border-2 border-slate-50 p-8 shadow-xl shadow-slate-200/50 space-y-6">
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Scholar</p>
                    <p className="font-semibold text-slate-900">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">ID Number</p>
                    <p className="font-mono text-sm text-slate-900">{formData.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact</p>
                    <p className="font-semibold text-slate-900">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Witness</p>
                    <p className="font-semibold text-slate-900">{formData.witnessName}</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50">
                   <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                     <ShieldCheck className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                     <p className="text-xs text-slate-500 leading-relaxed italic">By proceeding, I confirm that all information provided is accurate and I agree to the terms of the Techbridge Scholarship Bond agreement.</p>
                   </div>
                </div>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <PremiumButton variant="secondary" onClick={() => setStep('witness')}>Back</PremiumButton>
                <PremiumButton onClick={nextStep}>Sign & Complete Agreement <CheckCircle2 className="w-5 h-5" /></PremiumButton>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Agreement Complete!</h2>
              <p className="text-slate-500 max-w-sm mx-auto mb-10">Your scholarship bond has been successfully signed and recorded. A copy of the agreement has been sent to your email.</p>
              
              <div className="max-w-xs mx-auto space-y-4">
                <PremiumButton onClick={() => window.location.reload()}>Download PDF Certificate</PremiumButton>
                <button className="text-sm font-bold text-[#D4AF37] hover:underline uppercase tracking-widest">Return to Dashboard</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {step !== 'success' && (
        <footer className="fixed bottom-12 w-full max-w-md mx-auto px-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
          Techbridge Oyibi Campus • Authorized Personnel Portal
        </footer>
      )}
    </div>
  );
}
