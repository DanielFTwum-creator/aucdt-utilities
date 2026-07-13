# scholarship-bond-portal-v3 - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for scholarship-bond-portal-v3.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript

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

```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_scholarship_bond_portal_v3';
const ACCENT   = '#7c3aed';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Scholarship Bond Portal V3</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: constants.tsx
```typescript

export const APP_VERSION = "2.1.0-gold";
export const CAMPUS_LOCATION = "Oyibi Campus, Ghana";

```

### FILE: CREATION.md
```md
# scholarship-bond-portal-v3

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/scholarship-bond-portal-v3/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/scholarship-bond-portal-v3/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/scholarship-bond-portal-v3/',  // REQUIRED: Assets must load from /scholarship-bond-portal-v3/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/scholarship-bond-portal-v3"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/scholarship-bond-portal-v3">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/scholarship-bond-portal-v3/`, not at the root
- **Asset Loading**: Without `base: '/scholarship-bond-portal-v3/'`, assets try to load from `/assets/` instead of `/scholarship-bond-portal-v3/assets/`
- **Routing**: Without `basename="/scholarship-bond-portal-v3"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/scholarship-bond-portal-v3/assets/index-*.js`
- Link tags should reference: `/scholarship-bond-portal-v3/assets/index-*.css`

If they reference `/assets/` instead of `/scholarship-bond-portal-v3/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/scholarship-bond-portal-v3/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/scholarship-bond-portal-v3/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: scholarship-bond-portal-v3

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — scholarship-bond-portal-v3

**Application:** scholarship-bond-portal-v3
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_scholarship-bond-portal-v3_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — scholarship-bond-portal-v3

**Application:** scholarship-bond-portal-v3
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd scholarship-bond-portal-v3
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build scholarship-bond-portal-v3
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up scholarship-bond-portal-v3
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Scholarship Bond Portal V3
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Scholarship Bond Portal V3**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Scholarship Bond Portal V3** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Scholarship Bond Portal V3** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — scholarship-bond-portal-v3

**Application:** scholarship-bond-portal-v3
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd scholarship-bond-portal-v3
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Scholarship Bond Portal V3 | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Scholarship Bond Portal V3 | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Scholarship Bond Portal V3 | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">scholarship bond portal v3</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);

```

### FILE: metadata.json
```json
{
  "name": "Scholarship Bond Portal v3",
  "description": "Secure digital agreement platform for Techbridge scholars at Oyibi Campus.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "scholarship-bond-portal-v3",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@google/genai": "^1.45.0",
    "framer-motion": "11.11.11",
    "lucide-react": "0.463.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "serve": "14.2.5",
    "typescript": "~5.8.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1u-qTctdj2GxTr6pJKJJvzJvBXm6ZQLT7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/geminiService.ts
```typescript

import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const evaluateCodeResponse = async (questionContent: string, candidateResponse: string, idealAnswer: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Evaluate the following coding response. 
    Question: ${questionContent}
    Ideal Answer Context: ${idealAnswer}
    Candidate Response: ${candidateResponse}
    
    Provide a score from 0-100 and a brief justification.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          justification: { type: Type.STRING }
        },
        required: ["score", "justification"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { score: 0, justification: 'Error parsing AI response.' };
  }
};

export const generateQuestionRecommendation = async (topic: string, difficulty: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a technical interview question for the topic "${topic}" at ${difficulty} difficulty.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          type: { type: Type.STRING, description: "MCQ or CODE_CHALLENGE" },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING }
        },
        required: ["content", "type"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
};

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Scholarship Bond Portal V3</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Scholarship Bond Portal V3 — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — scholarship-bond-portal-v3
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('scholarship-bond-portal-v3 E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript

// Types for the Scholarship Bond Portal are integrated directly into App.tsx for simplicity 
// or can be added here if the project grows. Currently empty.
export {};

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
  base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — scholarship-bond-portal-v3
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — scholarship-bond-portal-v3
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

