
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
