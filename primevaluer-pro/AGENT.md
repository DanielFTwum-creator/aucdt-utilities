# primevaluer-pro - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for primevaluer-pro.

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

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

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

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, EvaluatorProfile, ClientDetails, KeyDates, LegalDocument, PropertyComponent, Accommodation, LandComparable, ValuationSummary } from './types';
import generatePdf from './lib/generatePdf';
import { PlusCircle, Trash2, UploadCloud, FileDown, Building, LandPlot, Hammer, MapPin, Calendar, User, Briefcase, DollarSign } from 'lucide-react';

// --- INITIAL DATA ---
const initialProjectData: Project = {
  id: 'PV-001',
  propertyName: 'Wild Turkey Studio',
  propertyId: 'GM-134-1425',
  address: 'Owusu Ansa Street, Oyarifa, Accra',
  mainImageUrl: './assets/PXL_20250502_172624774.jpg',
  evaluator: {
    firmName: 'Arthur Properties Ltd.',
    firmLogoUrl: './assets/IMG_20250626_095844753.jpg',
    firmMembership: 'Gh.I.S./VES/069',
    address: 'P. O. Box 123, Accra, Ghana',
    phone: '+233 24 123 4567',
    email: 'info@arthurproperties.com',
    website: 'www.arthurproperties.com',
    principalValuer: 'Helen Arthur (Mrs)',
    valuerMembership: 'Ghana Institution of Surveyors',
    valuerMembershipNo: '608',
    signatureUrl: 'https://photos.fife.usercontent.google.com/pw/AP1GczM5AdB1l9qi1j1MSV_cOW903Zt7a7mH1Lorho890nxN5BnGbbAJOwx_Bg=w550-h446-s-no-gm?authuser=0',
  },
  client: { name: 'Margaret Danquah', address: 'P. O. Box AF 2949, Adenta, Accra' },
  keyDates: { request: '2024-07-10', inspection: '2024-07-15', valuation: '2024-07-22' },
  locationDescription: 'The property is situated along Owusu Ansa Street, within the Oyarifa community. The area is a developing residential zone characterized by a mix of completed and ongoing residential projects. It benefits from proximity to the Aburi highway, providing good access to Accra\'s central business district.',
  tenureAndTitle: [
    { id: 'doc1', docType: 'Statutory Declaration', date: '2023-05-20', term: 99, area: 0.23, fileUrl: '' }
  ],
  propertyComponents: [
    {
      id: 'comp1',
      type: 'Building',
      name: 'Main 6-Bedroom House',
      construction: {
        Foundation: 'Reinforced concrete strip foundation.',
        Walls: 'Sandcrete blockwork, rendered and painted.',
        Roof: 'Double-pitched timber trusses with tile-profiled aluminium sheets.',
        Ceiling: 'Plastic T&G and plasterboard.',
        Doors: 'Polished hardwood panel doors and metal security doors.',
        Windows: 'Glazed sliding windows in aluminium frames with burglar proofing.',
      },
      accommodationSchedule: [
        { id: 'acc1', room: 'Living Area', dimensions: '8m x 6m', area: 48 },
        { id: 'acc2', room: 'Master Bedroom', dimensions: '5m x 5m', area: 25 },
        { id: 'acc3', room: 'Kitchen', dimensions: '4m x 4.5m', area: 18 },
      ],
      fittings: ['Air-conditioners in all rooms', 'Fitted kitchen cabinets', 'Water heaters'],
      condition: 'The property is in a very good state of repair. Minor hairline cracks were observed on the external render, consistent with normal settling. All fittings and fixtures are in excellent working order.',
      media: [
        { type: 'image', url: 'https://picsum.photos/seed/house1/600/400', caption: 'Front elevation' },
        { type: 'image', url: 'https://picsum.photos/seed/house2/600/400', caption: 'Living area' },
      ],
    },
    {
      id: 'comp2',
      type: 'Ancillary',
      name: 'Boys\' Quarters',
      construction: { Walls: 'Sandcrete blockwork' },
      accommodationSchedule: [{ id: 'acc4', room: 'Bedroom', dimensions: '4m x 3m', area: 12 }],
      fittings: [],
      condition: 'Good condition.',
      media: [],
    },
  ],
  valuationMethod: 'The primary method of valuation adopted is the Replacement Cost Approach. This method is considered most appropriate for this type of property, as it reflects the current cost of replacing the asset. We have also considered the Sales Comparison Approach for the land value by analyzing recent transactions of similar plots in the vicinity.',
  costAnalysis: { unitCostPerSqm: 7200 },
  landComparables: [
    { id: 'land1', location: 'Oyarifa near subject', sizeAcres: 1, tenure: 'Leasehold', saleValue: 450000, transactionDate: '2024-03-15', photoUrl: 'https://picsum.photos/seed/land1/300/200' },
    { id: 'land2', location: 'Adenta, 2km away', sizeAcres: 1, tenure: 'Freehold', saleValue: 550000, transactionDate: '2024-01-20', photoUrl: 'https://picsum.photos/seed/land2/300/200' },
  ],
  valuationSummary: {
    marketValueGHS: 6054400,
    exchangeRate: 14.31,
    askingPriceGHS: 6963000,
    minPriceGHS: 5449000,
  }
};

// --- UI COMPONENTS ---

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
  <div className="mb-8 bg-[#1a2e26]/50 border border-amber-600/20 rounded-lg shadow-lg overflow-hidden">
    <h2 className="text-xl font-bold text-amber-600 bg-amber-600/10 p-4 border-b border-amber-600/20 flex items-center">
      {icon && <span className="mr-3">{icon}</span>}
      {title}
    </h2>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

const FormField: React.FC<{ label: string; name: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; type?: string; placeholder?: string; fullWidth?: boolean; isTextarea?: boolean; }> = ({ label, name, value, onChange, type = 'text', placeholder, fullWidth = true, isTextarea = false }) => (
  <div className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
    <label htmlFor={name} className="mb-1.5 text-sm font-medium text-gray-300">{label}</label>
    {isTextarea ? (
      <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder || label} rows={4} className="bg-[#0d1f1a] border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" />
    ) : (
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder || label} className="bg-[#0d1f1a] border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition" />
    )}
  </div>
);

const ImageUploader: React.FC<{ label: string; imageUrl: string; onImageChange: (url: string) => void; }> = ({ label, imageUrl, onImageChange }) => {
    const [preview, setPreview] = useState(imageUrl);

    useEffect(() => {
        setPreview(imageUrl);
    }, [imageUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                onImageChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-300">{label}</label>
            <div className="mt-2 flex items-center gap-x-3">
                {preview && <img src={preview} alt="preview" className="h-24 w-24 object-cover rounded-md" />}
                <label htmlFor={`file-upload-${label}`} className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md inline-flex items-center transition">
                    <UploadCloud className="mr-2 h-4 w-4"/>
                    Change
                </label>
                <input id={`file-upload-${label}`} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
            </div>
        </div>
    );
};

const HeroNavigator: React.FC<{ sections: { id: string; title: string; icon: React.ReactNode }[]; activeSection: string; }> = ({ sections, activeSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
    
  return (
    <nav className="fixed top-0 left-0 h-full w-60 bg-[#0d1f1a] border-r border-amber-600/20 p-6 flex flex-col z-40">
      <div onClick={scrollToTop} className="cursor-pointer mb-8">
        <h2 className="text-2xl font-bold text-amber-500">PrimeValuer</h2>
        <p className="text-sm text-gray-400">Pro</p>
      </div>
      <ul className="space-y-1 overflow-y-auto">
        {sections.map(section => (
          <li key={section.id}>
            <a 
              href={`#${section.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSection === section.id 
                ? 'bg-amber-600/10 text-amber-400' 
                : 'text-gray-400 hover:text-amber-500 hover:bg-white/5'
              }`}
            >
              {section.icon}
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [project, setProject] = useState<Project>(initialProjectData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const sections = useMemo(() => [
    { id: 'evaluator-profile', title: 'Evaluator Profile', icon: <Briefcase size={18} /> },
    { id: 'project-details', title: 'Project & Client', icon: <User size={18} /> },
    { id: 'key-dates', title: 'Key Dates', icon: <Calendar size={18} /> },
    { id: 'property-description', title: 'Property Description', icon: <MapPin size={18} /> },
    { id: 'property-components', title: 'Property Components', icon: <Building size={18} /> },
    { id: 'valuation-analysis', title: 'Valuation Analysis', icon: <Hammer size={18} /> },
    { id: 'land-comparables', title: 'Land Comparables', icon: <LandPlot size={18} /> },
    { id: 'valuation-summary', title: 'Valuation Summary', icon: <DollarSign size={18} /> }
  ], []);

  useEffect(() => {
    const handleScroll = () => {
        const threshold = window.innerHeight * 0.3; // Active when top of section is within top 30% of viewport
        let activeId = '';
        const reversedSections = [...sections].reverse();

        for (const section of reversedSections) {
            const element = document.getElementById(section.id);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top < threshold) {
                    activeId = section.id;
                    break;
                }
            }
        }
        
        // If scrolled to bottom, force last section to be active
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 5) {
            activeId = sections[sections.length - 1].id;
        }

        setActiveSection(activeId);
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call to set active section on load
    return () => document.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleStateChange = useCallback(<T,>(section: keyof Project, name: keyof T, value: any) => {
    setProject(prev => ({
        ...prev,
        [section]: {
            ...(prev[section] as object),
            [name]: value
        }
    }));
  }, []);

  const handleRootChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setProject(p => ({...p, [name]: value}));
  }, []);
  
  const handleComponentChange = (id: string, field: keyof PropertyComponent, value: any) => {
      setProject(p => ({
          ...p,
          propertyComponents: p.propertyComponents.map(c => c.id === id ? { ...c, [field]: value } : c)
      }));
  };
  
  const handleAccommodationChange = (compId: string, accId: string, field: keyof Accommodation, value: any) => {
      const newArea = (field === 'dimensions') ? calculateArea(value) : null;
      setProject(p => ({
          ...p,
          propertyComponents: p.propertyComponents.map(c => c.id === compId ? {
              ...c,
              accommodationSchedule: c.accommodationSchedule.map(a => a.id === accId ? { ...a, [field]: value, ...(newArea !== null && { area: newArea }) } : a)
          } : c)
      }));
  };

  const calculateArea = (dimensions: string): number => {
      try {
          const parts = dimensions.toLowerCase().replace(/m/g, '').split('x').map(s => parseFloat(s.trim()));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              return parseFloat((parts[0] * parts[1]).toFixed(2));
          }
      } catch (e) { /* ignore */ }
      return 0;
  };
  
  const addPropertyComponent = () => {
      const newComponent: PropertyComponent = {
          id: `comp${Date.now()}`,
          type: 'Building',
          name: 'New Building',
          construction: {},
          accommodationSchedule: [],
          fittings: [],
          condition: '',
          media: []
      };
      setProject(p => ({...p, propertyComponents: [...p.propertyComponents, newComponent]}));
  }

  const removePropertyComponent = (id: string) => {
      setProject(p => ({...p, propertyComponents: p.propertyComponents.filter(c => c.id !== id)}));
  }
  
  const totalInternalFloorArea = useMemo(() => {
    return project.propertyComponents.reduce((total, component) => {
        return total + component.accommodationSchedule.reduce((subTotal, room) => subTotal + room.area, 0);
    }, 0);
  }, [project.propertyComponents]);

  const landValuePerAcre = useMemo(() => {
    if (project.landComparables.length === 0) return 0;
    const totalValue = project.landComparables.reduce((sum, comp) => sum + (comp.saleValue / comp.sizeAcres), 0);
    return totalValue / project.landComparables.length;
  }, [project.landComparables]);

  const marketValueUSD = useMemo(() => {
      return (project.valuationSummary.marketValueGHS / project.valuationSummary.exchangeRate).toFixed(2);
  }, [project.valuationSummary.marketValueGHS, project.valuationSummary.exchangeRate]);
  
  const handleExportPdf = async () => {
      setIsLoading(true);
      await generatePdf('report-content', `Valuation_Report_${project.propertyName.replace(/\s/g, '_')}`);
      setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1f1a] text-[#eaf0ed] font-sans">
      <HeroNavigator sections={sections} activeSection={activeSection} />

      <div className="pl-60"> {/* Pusher for the fixed navigator */}
        <div className="fixed top-4 right-4 z-50">
            <button onClick={handleExportPdf} disabled={isLoading} className="bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-[#0d1f1a] font-bold py-3 px-5 rounded-full shadow-lg flex items-center transition-all duration-300 transform hover:scale-105">
                <FileDown className="mr-2 h-5 w-5"/>
                {isLoading ? 'Generating...' : 'Export to PDF'}
            </button>
        </div>
        
        <main id="report-content" className="max-w-4xl mx-auto p-4 md:p-8">
          <header className="text-center mb-12 pt-8">
            <img src={project.evaluator.firmLogoUrl} alt="Firm Logo" className="h-24 w-24 mx-auto rounded-full object-cover mb-4 border-2 border-amber-600/50"/>
            <h1 className="text-4xl font-bold text-amber-600">{project.evaluator.firmName}</h1>
            <p className="text-gray-400">Valuation Report for</p>
            <h2 className="text-3xl font-semibold text-white mt-1">{project.propertyName}</h2>
          </header>

          <div id="evaluator-profile" className="scroll-mt-20">
            <Section title="Evaluator Profile" icon={<Briefcase />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Firm Name" name="firmName" value={project.evaluator.firmName} onChange={(e) => handleStateChange<EvaluatorProfile>('evaluator', 'firmName', e.target.value)} />
                <FormField label="Principal Valuer" name="principalValuer" value={project.evaluator.principalValuer} onChange={(e) => handleStateChange<EvaluatorProfile>('evaluator', 'principalValuer', e.target.value)} />
                <FormField label="Firm Membership" name="firmMembership" value={project.evaluator.firmMembership} onChange={(e) => handleStateChange<EvaluatorProfile>('evaluator', 'firmMembership', e.target.value)} />
                <FormField label="Valuer Membership No." name="valuerMembershipNo" value={project.evaluator.valuerMembershipNo} onChange={(e) => handleStateChange<EvaluatorProfile>('evaluator', 'valuerMembershipNo', e.target.value)} />
              </div>
            </Section>
          </div>
          
          <div id="project-details" className="scroll-mt-20">
            <Section title="Project & Client" icon={<User />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Property Name" name="propertyName" value={project.propertyName} onChange={handleRootChange} />
                <FormField label="Property ID" name="propertyId" value={project.propertyId} onChange={handleRootChange} />
                <FormField label="Client Name" name="name" value={project.client.name} onChange={(e) => handleStateChange<ClientDetails>('client', 'name', e.target.value)} />
                <FormField label="Client Address" name="address" value={project.client.address} onChange={(e) => handleStateChange<ClientDetails>('client', 'address', e.target.value)} isTextarea/>
              </div>
              <ImageUploader label="Main Property Image" imageUrl={project.mainImageUrl} onImageChange={url => setProject(p => ({...p, mainImageUrl: url}))} />
            </Section>
          </div>
          
          <div id="key-dates" className="scroll-mt-20">
            <Section title="Key Dates" icon={<Calendar />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField label="Date of Request" name="request" type="date" value={project.keyDates.request} onChange={e => handleStateChange<KeyDates>('keyDates', 'request', e.target.value)} />
                    <FormField label="Date of Inspection" name="inspection" type="date" value={project.keyDates.inspection} onChange={e => handleStateChange<KeyDates>('keyDates', 'inspection', e.target.value)} />
                    <FormField label="Date of Valuation" name="valuation" type="date" value={project.keyDates.valuation} onChange={e => handleStateChange<KeyDates>('keyDates', 'valuation', e.target.value)} />
                </div>
            </Section>
          </div>

          <div id="property-description" className="scroll-mt-20">
            <Section title="Property Description" icon={<MapPin />}>
                <FormField label="Location Description" name="locationDescription" value={project.locationDescription} onChange={handleRootChange} isTextarea />
                <h3 className="text-lg font-semibold text-gray-200 mt-4 border-t border-gray-700 pt-4">Tenure & Title Documents</h3>
                {project.tenureAndTitle.map(doc => (
                     <div key={doc.id} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg mt-2 items-end">
                        <FormField label="Doc Type" name="docType" value={doc.docType} onChange={e => {/* ... */}} />
                        <FormField label="Date" name="date" type="date" value={doc.date} onChange={e => {/* ... */}} />
                        <FormField label="Term (yrs)" name="term" type="number" value={doc.term} onChange={e => {/* ... */}} />
                        <FormField label="Area (acres)" name="area" type="number" value={doc.area} onChange={e => {/* ... */}} />
                     </div>
                ))}
            </Section>
          </div>

          <div id="property-components" className="scroll-mt-20">
            <Section title="Property Components" icon={<Building />}>
                {project.propertyComponents.map(comp => (
                    <div key={comp.id} className="p-4 rounded-lg border border-gray-700 mb-6 bg-gray-800/30">
                         <div className="flex justify-between items-center mb-4">
                            <input value={comp.name} onChange={e => handleComponentChange(comp.id, 'name', e.target.value)} className="text-lg font-bold bg-transparent text-amber-500 border-b border-amber-500/20 focus:outline-none focus:border-amber-500"/>
                            <button onClick={() => removePropertyComponent(comp.id)} className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                         </div>
                         <div className="space-y-4">
                            <FormField label="Condition" name="condition" value={comp.condition} onChange={e => handleComponentChange(comp.id, 'condition', e.target.value)} isTextarea />
                            <h4 className="font-semibold text-gray-300 mt-4">Accommodation Schedule</h4>
                            {comp.accommodationSchedule.map(acc => (
                               <div key={acc.id} className="grid grid-cols-3 gap-2 items-center">
                                  <input value={acc.room} onChange={e => handleAccommodationChange(comp.id, acc.id, 'room', e.target.value)} className="bg-gray-700/50 p-2 rounded" placeholder="Room Name"/>
                                  <input value={acc.dimensions} onChange={e => handleAccommodationChange(comp.id, acc.id, 'dimensions', e.target.value)} className="bg-gray-700/50 p-2 rounded" placeholder="e.g. 5m x 4m"/>
                                  <div className="p-2 text-gray-400">Area: {acc.area} m²</div>
                               </div>
                            ))}
                             <div className="text-right font-bold text-amber-500">Total Area: {comp.accommodationSchedule.reduce((t, a) => t + a.area, 0).toFixed(2)} m²</div>
                         </div>
                    </div>
                ))}
                 <button onClick={addPropertyComponent} className="mt-4 flex items-center gap-2 text-amber-500 hover:text-amber-400 font-semibold"><PlusCircle size={18}/> Add Component</button>
                 <div className="mt-6 pt-4 border-t border-gray-700 text-xl font-bold text-right text-white">
                    Total Internal Floor Area (GIA): <span className="text-amber-400">{totalInternalFloorArea.toFixed(2)} m²</span>
                 </div>
            </Section>
          </div>

          <div id="valuation-analysis" className="scroll-mt-20">
            <Section title="Valuation Analysis" icon={<Hammer />}>
                <FormField label="Valuation Method" name="valuationMethod" value={project.valuationMethod} onChange={handleRootChange} isTextarea />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Cost Analysis</h3>
                        <FormField label="Unit Construction Cost (GHS/m²)" name="unitCostPerSqm" type="number" value={project.costAnalysis.unitCostPerSqm} onChange={e => handleStateChange('costAnalysis', 'unitCostPerSqm', parseFloat(e.target.value))} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">Estimated Replacement Cost</h3>
                        <div className="p-4 bg-gray-800/50 rounded-lg text-2xl font-bold text-amber-500">
                          GHS {(project.costAnalysis.unitCostPerSqm * totalInternalFloorArea).toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </div>
                    </div>
                </div>
            </Section>
          </div>
          
          <div id="land-comparables" className="scroll-mt-20">
            <Section title="Land Comparables" icon={<LandPlot />}>
               {project.landComparables.map(comp => (
                    <div key={comp.id} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg mt-2 items-end">
                        <FormField label="Location" name="location" value={comp.location} onChange={e => {/* ... */}} />
                        <FormField label="Size (Acres)" name="sizeAcres" type="number" value={comp.sizeAcres} onChange={e => {/* ... */}} />
                        <FormField label="Sale Value (GHS)" name="saleValue" type="number" value={comp.saleValue} onChange={e => {/* ... */}} />
                        <div className="text-gray-400">GHS {(comp.saleValue/comp.sizeAcres).toLocaleString()}/acre</div>
                    </div>
               ))}
               <div className="mt-6 pt-4 border-t border-gray-700 text-xl font-bold text-right text-white">
                    Average Land Value: <span className="text-amber-400">GHS {landValuePerAcre.toLocaleString('en-US', {minimumFractionDigits: 2})} / acre</span>
               </div>
            </Section>
          </div>

          <div id="valuation-summary" className="scroll-mt-20">
            <Section title="Valuation Summary" icon={<DollarSign />}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className="font-semibold text-gray-300">Market Capital Value (GHS)</span>
                        <input type="number" value={project.valuationSummary.marketValueGHS} onChange={e => handleStateChange<ValuationSummary>('valuationSummary', 'marketValueGHS', parseFloat(e.target.value))} className="w-48 bg-[#0d1f1a] text-right font-bold text-lg text-amber-400 p-2 rounded border border-gray-600 focus:ring-amber-500 focus:border-amber-500"/>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className="font-semibold text-gray-300">Exchange Rate (GHS to USD)</span>
                        <input type="number" value={project.valuationSummary.exchangeRate} onChange={e => handleStateChange<ValuationSummary>('valuationSummary', 'exchangeRate', parseFloat(e.target.value))} className="w-48 bg-[#0d1f1a] text-right font-bold text-lg text-white p-2 rounded border border-gray-600 focus:ring-amber-500 focus:border-amber-500"/>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-amber-600/10 rounded-lg">
                        <span className="font-semibold text-amber-400">Market Capital Value (USD)</span>
                        <span className="text-right font-bold text-xl text-amber-400">$ {marketValueUSD}</span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className="font-semibold text-gray-300">Recommended Asking Price (GHS)</span>
                        <input type="number" value={project.valuationSummary.askingPriceGHS} onChange={e => handleStateChange<ValuationSummary>('valuationSummary', 'askingPriceGHS', parseFloat(e.target.value))} className="w-48 bg-[#0d1f1a] text-right font-bold text-lg text-white p-2 rounded border border-gray-600 focus:ring-amber-500 focus:border-amber-500"/>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className="font-semibold text-gray-300">Recommended Minimum Price (GHS)</span>
                        <input type="number" value={project.valuationSummary.minPriceGHS} onChange={e => handleStateChange<ValuationSummary>('valuationSummary', 'minPriceGHS', parseFloat(e.target.value))} className="w-48 bg-[#0d1f1a] text-right font-bold text-lg text-white p-2 rounded border border-gray-600 focus:ring-amber-500 focus:border-amber-500"/>
                    </div>
                </div>
            </Section>
          </div>
          
          <footer className="mt-12 text-center text-gray-500 text-sm">
              <p>Report generated by PrimeValuer Pro</p>
              <p>{project.evaluator.firmName} | {project.evaluator.address}</p>
          </footer>

        </main>
      </div>
    </div>
  );
}

```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_primevaluer_pro';
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Primevaluer Pro</h1>
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

### FILE: CREATION.md
```md
# primevaluer-pro

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

This application is deployed behind an Nginx reverse proxy at the path `/primevaluer-pro/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/primevaluer-pro/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/primevaluer-pro/',  // REQUIRED: Assets must load from /primevaluer-pro/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/primevaluer-pro"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/primevaluer-pro">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/primevaluer-pro/`, not at the root
- **Asset Loading**: Without `base: '/primevaluer-pro/'`, assets try to load from `/assets/` instead of `/primevaluer-pro/assets/`
- **Routing**: Without `basename="/primevaluer-pro"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/primevaluer-pro/assets/index-*.js`
- Link tags should reference: `/primevaluer-pro/assets/index-*.css`

If they reference `/assets/` instead of `/primevaluer-pro/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/primevaluer-pro/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/primevaluer-pro/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: primevaluer-pro

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
# Admin Guide — primevaluer-pro

**Application:** primevaluer-pro
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

Audit log data is stored in `localStorage` under the key `tuc_primevaluer-pro_audit`.

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
# Deployment Guide — primevaluer-pro

**Application:** primevaluer-pro
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd primevaluer-pro
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
docker-compose -f docker-compose-all-apps.yml build primevaluer-pro
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up primevaluer-pro
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

**Project:** Primevaluer Pro
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Primevaluer Pro**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Primevaluer Pro** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Primevaluer Pro** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
# Testing Guide — primevaluer-pro

**Application:** primevaluer-pro
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd primevaluer-pro
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

@media print {
  body * {
    visibility: hidden;
  }
  #valuation-report, #valuation-report * {
    visibility: visible;
  }
  #valuation-report {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white;
    padding: 0;
    margin: 0;
    box-shadow: none;
  }
}
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
    <meta property="og:title" content="Primevaluer Pro | Techbridge University College" />
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
    <meta name="twitter:title" content="Primevaluer Pro | Techbridge University College" />
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
    <title>Primevaluer Pro | Techbridge University College</title>

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
        <div class="tuc-status">primevaluer pro</div>
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
import App from './App';
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

### FILE: lib/generatePdf.ts
```typescript
// @ts-nocheck
// Ensure you have included the jsPDF and html2canvas libraries in your project,
// for example, via script tags in your HTML file.
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

export const generatePdf = async (elementId: string, fileName: string) => {
  // Ensure the libraries are loaded on the window object
  if (!window.jspdf || !window.html2canvas) {
    console.error("jsPDF or html2canvas library not found on window object.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const html2canvas = window.html2canvas;
  
  const reportElement = document.getElementById(elementId);

  if (!reportElement) {
    console.error(`Element with id "${elementId}" not found!`);
    return;
  }

  const originalElements = [];
  let originalScrollTop = 0;

  try {
    // --- STRATEGY: Replace inputs/textareas with divs for accurate capture ---
    const formElements = reportElement.querySelectorAll('input, textarea');
    
    formElements.forEach(el => {
      const input = el as HTMLInputElement | HTMLTextAreaElement;
      const div = document.createElement('div');
      div.innerHTML = input.value.replace(/\n/g, '<br>') || '&nbsp;';
      const style = window.getComputedStyle(input);
      div.style.cssText = style.cssText;
      div.style.height = `${input.scrollHeight}px`;
      div.style.overflow = 'visible';
      div.style.whiteSpace = 'pre-wrap';
      div.style.wordBreak = 'break-word';

      const parent = input.parentNode;
      if (parent) {
        originalElements.push({ original: input, parent: parent, replacement: div });
        parent.replaceChild(div, input);
      }
    });

    // --- FIX: Ensure capture starts from the very top of the scrollable element ---
    originalScrollTop = reportElement.scrollTop;
    reportElement.scrollTop = 0;

    // Capture the entire report element as a single, large canvas.
    const sourceCanvas = await html2canvas(reportElement, {
      scale: window.devicePixelRatio || 2,
      backgroundColor: '#0d1f1a',
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    });
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const footerHeight = 30;
    const pageContentHeight = pdfHeight - footerHeight;

    const sourceCanvasWidth = sourceCanvas.width;
    const sourceCanvasHeight = sourceCanvas.height;
    const ratio = sourceCanvasWidth / pdfWidth;
    const totalPdfHeight = sourceCanvasHeight / ratio;

    // --- RE-ENGINEERED GURU LOGIC: The Definitive Page Break Calculation ---
    const reportRect = reportElement.getBoundingClientRect();
    const scale = window.devicePixelRatio || 2;

    const cards = Array.from(reportElement.querySelectorAll('.keep-together')).map(el => {
        const element = el as HTMLElement;
        const elementRect = element.getBoundingClientRect();
        const topInDomPixels = (elementRect.top - reportRect.top);
        const heightInDomPixels = elementRect.height;
        
        const top = (topInDomPixels * scale) / ratio;
        const height = (heightInDomPixels * scale) / ratio;

        return { top, bottom: top + height, height };
    });

    const pageBreaks = [0];
    let currentTop = 0;

    while (currentTop < totalPdfHeight) {
        const potentialBreak = currentTop + pageContentHeight;

        if (potentialBreak >= totalPdfHeight) {
            pageBreaks.push(totalPdfHeight);
            break;
        }

        // Find all cards that start on the current page.
        const cardsStartingOnPage = cards.filter(card => card.top >= currentTop && card.top < potentialBreak);

        let bestBreak = potentialBreak;

        // Check if any of these cards get split by the potential break.
        for (const card of cardsStartingOnPage) {
            // A card is split if it starts before the break but ends after it.
            if (card.bottom > potentialBreak) {
                // If this card is not taller than a whole page, it's a candidate for moving.
                // We want to break before this card starts.
                if (card.height <= pageContentHeight) {
                    // We want the earliest break possible on this page, so we take the minimum.
                    bestBreak = Math.min(bestBreak, card.top);
                }
            }
        }
        
        // Safety check: if the best break is at the top of the page,
        // it means we're trying to push a card that starts right at the top.
        // In this case, we must make progress, so we take the standard break.
        if (bestBreak <= currentTop) {
            bestBreak = potentialBreak;
        }

        pageBreaks.push(bestBreak);
        currentTop = bestBreak;
    }
    
    const totalPages = pageBreaks.length - 1;
    const now = new Date();
    const printDate = now.toLocaleString('en-GB', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });
    const timestampText = `Printed on: ${printDate}`;

    // Generate pages based on our calculated, content-aware breaks.
    for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        const pageTopPt = pageBreaks[i];
        const pageBottomPt = pageBreaks[i + 1];
        const pageHeightPt = pageBottomPt - pageTopPt;
        const sliceY = pageTopPt * ratio;
        const sliceHeight = pageHeightPt * ratio;
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        pageCanvas.width = sourceCanvasWidth;
        pageCanvas.height = sliceHeight;
        pageCtx.drawImage(sourceCanvas, 0, sliceY, sourceCanvasWidth, sliceHeight, 0, 0, sourceCanvasWidth, sliceHeight);
        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pageHeightPt);
        pdf.setFillColor('#0d1f1a');
        pdf.rect(0, pageContentHeight, pdfWidth, footerHeight, 'F');
        const pageNumberText = `Page ${i + 1} of ${totalPages}`;
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        const textY = pdfHeight - 15;
        pdf.text(timestampText, 15, textY);
        const pageNumWidth = pdf.getStringUnitWidth(pageNumberText) * pdf.getFontSize() / pdf.internal.scaleFactor;
        const pageNumX = pdfWidth - 15 - pageNumWidth;
        pdf.text(pageNumberText, pageNumX, textY);
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("An error occurred while generating the PDF:", error);
  } finally {
    // --- CRITICAL RESTORATION STEP ---
    reportElement.scrollTop = originalScrollTop;
    
    originalElements.forEach(({ original, parent, replacement }) => {
      if (parent && parent.contains(replacement)) {
        parent.replaceChild(original, replacement);
      }
    });
  }
};

export default generatePdf;
```

### FILE: metadata.json
```json
{
  "name": "PrimeValuer Pro",
  "description": "A web-based application for professional property surveyors and valuers to streamline the valuation process, from data entry to generating a professional, client-ready PDF report.",
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
  "name": "primevaluer-pro",
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
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.1",
    "lucide-react": "^0.536.0",
    "pnpm": "^10.14.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/html2canvas": "^1.0.0",
    "@types/jspdf": "^2.0.0",
    "@types/node": "^22.17.0",
    "serve": "14.2.5",
    "typescript": "~5.8.3",
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
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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
          <span className="font-bold text-sm">Primevaluer Pro</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Primevaluer Pro — Admin</h1>
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
 * E2E stub — primevaluer-pro
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('primevaluer-pro E2E', () => {
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

### FILE: TESTING.md
```md
# PrimeValuer Pro - Testing Guide

This document outlines how to run the end-to-end (E2E) test suite for the PrimeValuer Pro application. The tests are written using **Playwright**, which automates browser interactions to simulate a real user.

## What Do The Tests Cover?

The E2E test suite (`e2e.test.mjs`) validates the core user-facing functionality of the application, including:

-   **Initial State**: Verifying that the application loads with the correct default data.
-   **Form Interaction**: Changing values in input fields and confirming that the application state updates accordingly.
-   **Dynamic Calculations**: Modifying data (e.g., room dimensions) and ensuring that dependent calculations (e.g., Total Internal Floor Area) are updated in real-time.
-   **Component Management**: Adding and removing dynamic elements like "Property Components" and verifying the UI reflects these changes.

> **Note**: The tests do not cover the PDF export functionality, as testing file downloads can be complex and environment-dependent.

---

## Setup and Execution

Follow these steps to run the tests on your local machine.

### 1. Prerequisites

-   **Node.js**: Ensure you have Node.js installed (version 16 or newer is recommended). You can download it from [nodejs.org](https://nodejs.org/).

### 2. Install Dependencies

Open your terminal in the project's root directory and install Playwright:

```bash
npm install playwright
```

This command downloads Playwright and a recent version of Chromium that is guaranteed to work with the library.

### 3. Run the Application Locally

The test suite needs a running instance of the application to connect to. Since this is a static HTML/React project, you can use any simple local web server. The `serve` package is a great, no-configuration option.

First, install `serve` globally (or use `npx`):

```bash
# Recommended: Install globally for easy access
npm install -g serve

# Then, run the server from the project's root directory
serve .
```

Alternatively, you can run it directly with `npx`:
```bash
npx serve .
```

The server will start and provide you with a local URL. By default, it's usually `http://localhost:3000`. The test script is pre-configured for this URL.

### 4. Run the Test Suite

With the local server running, open a **new terminal window** and navigate to the project root. Run the test script using Node:

```bash
node e2e.test.mjs
```

### 5. Expected Output

You will see a series of logs in your terminal as the test script executes each step. If all tests pass, the output will look like this:

```
ℹ️ Launching Playwright...
ℹ️ Navigating to http://localhost:3000...
✅ App loaded successfully.
ℹ️ Test 1: Verifying the main property name...
✅ Property name is correct.
ℹ️ Test 2: Modifying the "Property Name" field...
✅ "Property Name" field updated correctly.
ℹ️ Test 3: Testing dynamic area calculation...
✅ Total Internal Floor Area calculated correctly.
ℹ️ Test 4: Adding a new property component...
✅ Successfully added a new component.
ℹ️ Test 5: Removing a property component...
✅ Successfully removed the component.

-----------------------------
✅ All E2E tests passed!
-----------------------------
ℹ️ Browser closed.
```

If a test fails, the script will stop and print a detailed error message indicating which assertion failed.

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
    "noEmit": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true
  }
}
```

### FILE: types.ts
```typescript

export interface EvaluatorProfile {
  firmName: string;
  firmLogoUrl: string;
  firmMembership: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalValuer: string;
  valuerMembership: string;
  valuerMembershipNo: string;
  signatureUrl: string;
}

export interface ClientDetails {
  name: string;
  address: string;
}

export interface KeyDates {
  request: string;
  inspection: string;
  valuation: string;
}

export interface LegalDocument {
  id: string;
  docType: string;
  date: string;
  term: number;
  area: number;
  fileUrl: string;
}

export interface Accommodation {
  id: string;
  room: string;
  dimensions: string;
  area: number;
}

export interface PropertyComponent {
  id: string;
  type: 'Building' | 'Ancillary' | 'Grounds';
  name: string;
  construction: { [key: string]: string };
  accommodationSchedule: Accommodation[];
  fittings: string[];
  condition: string;
  media: { type: 'image' | 'video'; url: string; caption: string }[];
}

export interface LandComparable {
  id: string;
  location: string;
  sizeAcres: number;
  tenure: string;
  saleValue: number;
  transactionDate: string;
  photoUrl: string;
}

export interface ValuationSummary {
  marketValueGHS: number;
  exchangeRate: number;
  askingPriceGHS: number;
  minPriceGHS: number;
}

export interface Project {
  id: string;
  propertyName: string;
  propertyId: string;
  address: string;
  mainImageUrl: string;
  evaluator: EvaluatorProfile;
  client: ClientDetails;
  keyDates: KeyDates;
  locationDescription: string;
  tenureAndTitle: LegalDocument[];
  propertyComponents: PropertyComponent[];
  valuationMethod: string;
  costAnalysis: { unitCostPerSqm: number };
  landComparables: LandComparable[];
  valuationSummary: ValuationSummary;
}

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

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

// Vitest unit test configuration — primevaluer-pro
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

// Vitest E2E configuration — primevaluer-pro
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

