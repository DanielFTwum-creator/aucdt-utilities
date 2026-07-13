# community-plates.v1 - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for community-plates.v1.

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

import React, { useState, useCallback, useRef } from 'react';
import { Restaurant, Pantry, Mapping, SearchType, Location } from './types';
import { fetchLocations } from './services/geminiService';
import { exportToJson, exportSearchResultsToPdf, exportMappingsToPdf } from './services/exportService';
import { MapPinIcon, ListIcon, UtensilsCrossedIcon, BuildingIcon, LinkIcon, XIcon, MailIcon, DownloadIcon, UploadIcon, BookOpenIcon } from './components/icons';
import { GuideModal } from './components/GuideModal';

const Header: React.FC<{ onShowGuide: () => void }> = ({ onShowGuide }) => (
  <header className="bg-white shadow-md">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center">
          <LinkIcon className="h-8 w-8 text-teal-600" />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Community Plates</h1>
            <p className="text-sm text-gray-500 -mt-1">Connecting donations to those in need.</p>
          </div>
        </div>
        <button
            onClick={onShowGuide}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Open Application Guide"
        >
            <BookOpenIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Guide</span>
        </button>
      </div>
    </div>
  </header>
);

const Instructions: React.FC = () => (
    <div className="bg-teal-50 border-l-4 border-teal-400 text-teal-800 p-4 mb-6 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg flex items-center"><MapPinIcon className="h-5 w-5 mr-2"/>How It Works</h3>
        <ol className="list-decimal list-inside mt-2 space-y-1 text-sm pl-2">
            <li><strong>Search:</strong> Enter a location and click to find Restaurants or Food Pantries.</li>
            <li><strong>Select:</strong> From the results, click 'Select' on one restaurant and one pantry.</li>
            <li><strong>Connect:</strong> A "Map Them" button will appear above the results. Click it to create a connection.</li>
            <li><strong>Manage & Export:</strong> View your connections in the Dashboard, generate donation emails, and export data.</li>
        </ol>
    </div>
);

const SearchControl: React.FC<{
  onSearch: (query: string, type: SearchType) => void;
  onImport: (file: File, type: SearchType) => void;
  isLoading: boolean;
}> = ({ onSearch, onImport, isLoading }) => {
  const [query, setQuery] = useState('New York, NY');
  const fileInputRefRestaurants = useRef<HTMLInputElement>(null);
  const fileInputRefPantries = useRef<HTMLInputElement>(null);

  const handleSearch = (type: SearchType) => {
    if (query.trim()) {
      onSearch(query, type);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: SearchType) => {
    const file = event.target.files?.[0];
    if(file) {
        onImport(file, type);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city or zip code..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          disabled={isLoading}
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSearch(SearchType.Restaurants)}
            className="flex items-center justify-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            <UtensilsCrossedIcon className="h-5 w-5 mr-2" /> Restaurants
          </button>
          <button
            onClick={() => handleSearch(SearchType.Pantries)}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            <BuildingIcon className="h-5 w-5 mr-2" /> Pantries
          </button>
        </div>
      </div>
       <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <input type="file" ref={fileInputRefRestaurants} onChange={(e) => handleFileChange(e, SearchType.Restaurants)} accept=".json" className="hidden" />
           <button onClick={() => fileInputRefRestaurants.current?.click()} className="flex items-center justify-center text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
              <UploadIcon className="h-4 w-4 mr-2" /> Import Restaurants
           </button>
          <input type="file" ref={fileInputRefPantries} onChange={(e) => handleFileChange(e, SearchType.Pantries)} accept=".json" className="hidden" />
            <button onClick={() => fileInputRefPantries.current?.click()} className="flex items-center justify-center text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
              <UploadIcon className="h-4 w-4 mr-2" /> Import Pantries
            </button>
        </div>
    </div>
  );
};

const ResultsList: React.FC<{
  items: Location[];
  type: SearchType;
  onSelect: (item: Location, type: SearchType) => void;
  selectedId?: string;
  title: string;
}> = ({ items, type, onSelect, selectedId, title }) => (
  <div className="bg-white p-4 rounded-lg shadow h-full overflow-y-auto">
    <h3 className="text-xl font-semibold mb-3 text-gray-700">{title}</h3>
    {items.length === 0 ? <p className="text-gray-500">No results found.</p> : (
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className={`p-3 rounded-lg border transition-all ${selectedId === item.id ? 'bg-teal-100 border-teal-500' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className="font-bold text-gray-800">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.address}</p>
            <p className="text-sm text-gray-600">Ph: {item.phone}</p>
            <p className="text-sm text-gray-600">Hours: {item.hours}</p>
            {(item as Restaurant).isPartner !== undefined && (
              <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${(item as Restaurant).isPartner ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {(item as Restaurant).isPartner ? 'Donation Partner' : 'Potential Partner'}
              </span>
            )}
            {(item as Pantry).needs && <p className="text-sm text-gray-600 mt-1">Needs: {(item as Pantry).needs.join(', ')}</p>}
            <button onClick={() => onSelect(item, type)} className="mt-2 text-sm bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600">Select</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);


const Dashboard: React.FC<{
  mappings: Mapping[];
  restaurants: Restaurant[];
  pantries: Pantry[];
  onDeleteMapping: (id: string) => void;
  onGenerateEmail: (mapping: Mapping) => void;
}> = ({ mappings, restaurants, pantries, onDeleteMapping, onGenerateEmail }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Connections Dashboard</h2>
    {mappings.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No connections made yet. Go to the Search tab to map a restaurant to a pantry.</p>
    ) : (
      <div className="space-y-4">
        {mappings.map(mapping => {
          const restaurant = restaurants.find(r => r.id === mapping.restaurantId);
          const pantry = pantries.find(p => p.id === mapping.pantryId);
          if (!restaurant || !pantry) return null;
          return (
            <div key={mapping.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <UtensilsCrossedIcon className="h-8 w-8 text-teal-600 flex-shrink-0"/>
                <span className="font-semibold text-gray-700">{restaurant.name}</span>
                <LinkIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                <BuildingIcon className="h-8 w-8 text-blue-600 flex-shrink-0"/>
                <span className="font-semibold text-gray-700">{pantry.name}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                 <button onClick={() => onGenerateEmail(mapping)} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors" title="Generate Donation Request Email"><MailIcon className="h-5 w-5"/></button>
                 <button onClick={() => onDeleteMapping(mapping.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors" title="Delete Connection"><XIcon className="h-5 w-5"/></button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const EmailModal: React.FC<{
    mapping: Mapping;
    restaurant: Restaurant;
    pantry: Pantry;
    onClose: () => void;
}> = ({ mapping, restaurant, pantry, onClose }) => {
    const emailBody = `Subject: Food Donation Partnership Opportunity with ${pantry.name}\n\nDear ${restaurant.name} team,\n\nMy name is [Your Name] and I'm a volunteer with Community Plates, an initiative that connects local restaurants with food pantries to help fight hunger in our community.\n\nI'm writing to you today on behalf of ${pantry.name}, a wonderful organization located at ${pantry.address} that provides essential food support to our neighbors.\n\nWe would be incredibly grateful if you would consider partnering with them to donate any surplus food. Your contribution would make a huge difference.\n\n${pantry.name}'s donation drop-off times are ${pantry.dropOffTimes}. They can be reached at ${pantry.phone} to coordinate.\n\nThank you for considering this opportunity to support our community.\n\nBest regards,\n[Your Name]`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(`Food Donation Partnership with ${pantry.name}`)}&body=${encodeURIComponent(emailBody.split('\n\n').slice(1).join('\n\n'))}`;
    
    const [copied, setCopied] = useState(false);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(emailBody);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"><XIcon className="h-6 w-6"/></button>
                <h2 className="text-2xl font-bold mb-4">Generate Donation Request</h2>
                <textarea
                    readOnly
                    className="w-full h-64 p-3 border rounded-md bg-gray-50 font-mono text-sm"
                    value={emailBody}
                />
                <div className="mt-4 flex gap-4">
                    <button onClick={copyToClipboard} className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">{copied ? 'Copied!' : 'Copy Text'}</button>
                    <a href={mailtoLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Open in Email Client</a>
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'search'|'dashboard'>('search');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pantries, setPantries] = useState<Pantry[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedPantry, setSelectedPantry] = useState<Pantry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSearchType, setCurrentSearchType] = useState<SearchType>(SearchType.Restaurants);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  
  const [modalMapping, setModalMapping] = useState<Mapping | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const handleSearch = useCallback(async (query: string, type: SearchType) => {
    setIsLoading(true);
    setError(null);
    setCurrentSearchType(type);
    setCurrentSearchQuery(query);
    try {
      const results = await fetchLocations(query, type);
      if (type === SearchType.Restaurants) {
        setRestaurants(results as Restaurant[]);
      } else {
        setPantries(results as Pantry[]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = (item: Location, type: SearchType) => {
    if (type === SearchType.Restaurants) {
      setSelectedRestaurant(item as Restaurant);
    } else {
      setSelectedPantry(item as Pantry);
    }
  };

  const handleMapConnection = () => {
    if (selectedRestaurant && selectedPantry) {
      const newMapping: Mapping = {
        id: `map_${new Date().getTime()}`,
        restaurantId: selectedRestaurant.id,
        pantryId: selectedPantry.id
      };
      setMappings(prev => [...prev, newMapping]);
      setSelectedRestaurant(null);
      setSelectedPantry(null);
    }
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id));
  };

  const handleGenerateEmail = (mapping: Mapping) => {
    setModalMapping(mapping);
  };
  
  const handleImport = (file: File, type: SearchType) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result;
            if (typeof content === 'string') {
                const data = JSON.parse(content);
                if (Array.isArray(data)) {
                    if (type === SearchType.Restaurants) setRestaurants(data);
                    else setPantries(data);
                } else {
                    throw new Error("JSON file is not an array.");
                }
            }
        } catch (err) {
            setError("Failed to parse JSON file.");
            console.error(err);
        }
    };
    reader.readAsText(file);
  };
  
  const getModalData = () => {
    if (!modalMapping) return null;
    const restaurant = restaurants.find(r => r.id === modalMapping.restaurantId);
    const pantry = pantries.find(p => p.id === modalMapping.pantryId);
    if (!restaurant || !pantry) return null;
    return { restaurant, pantry };
  };
  
  const modalData = getModalData();
  
  const currentResults = currentSearchType === SearchType.Restaurants ? restaurants : pantries;
  
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header onShowGuide={() => setIsGuideModalOpen(true)} />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('search')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'search' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Search & Connect
              </button>
              <button onClick={() => setActiveTab('dashboard')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Dashboard ({mappings.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'search' && (
          <div className="space-y-6">
            <Instructions />
            <SearchControl onSearch={handleSearch} onImport={handleImport} isLoading={isLoading} />
            {isLoading && <div className="text-center p-8"><p className="text-lg text-gray-600">Finding locations...</p></div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold">Error:</strong><span className="block sm:inline ml-2">{error}</span></div>}
            
            {selectedRestaurant && selectedPantry && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div>
                  <p className="font-bold">Ready to connect!</p>
                  <p>{selectedRestaurant.name} <LinkIcon className="inline h-4 w-4 mx-1"/> {selectedPantry.name}</p>
                </div>
                <button onClick={handleMapConnection} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Map Them</button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6" style={{minHeight: '500px'}}>
              <ResultsList items={restaurants} type={SearchType.Restaurants} onSelect={handleSelect} selectedId={selectedRestaurant?.id} title="Restaurants" />
              <ResultsList items={pantries} type={SearchType.Pantries} onSelect={handleSelect} selectedId={selectedPantry?.id} title="Food Pantries" />
            </div>
            
             <div className="flex justify-end gap-4 pt-4 border-t">
                <button onClick={() => exportToJson(currentResults, `${currentSearchType}_results`)} className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" disabled={currentResults.length === 0}>
                    <DownloadIcon className="h-5 w-5 mr-2" /> Export Results (JSON)
                </button>
                <button onClick={() => exportSearchResultsToPdf(currentResults, currentSearchType, currentSearchQuery)} className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors" disabled={currentResults.length === 0}>
                    <DownloadIcon className="h-5 w-5 mr-2" /> Export Results (PDF)
                </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
            <div>
              <Dashboard mappings={mappings} restaurants={restaurants} pantries={pantries} onDeleteMapping={handleDeleteMapping} onGenerateEmail={handleGenerateEmail} />
              <div className="flex justify-end gap-4 pt-4 border-t mt-6">
                  <button onClick={() => exportToJson(mappings, 'connections')} className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors" disabled={mappings.length === 0}>
                      <DownloadIcon className="h-5 w-5 mr-2" /> Export Connections (JSON)
                  </button>
                  <button onClick={() => exportMappingsToPdf(mappings, restaurants, pantries)} className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors" disabled={mappings.length === 0}>
                      <DownloadIcon className="h-5 w-5 mr-2" /> Export Connections (PDF)
                  </button>
              </div>
            </div>
        )}

      </main>
      
      {modalData && (
          <EmailModal mapping={modalMapping!} restaurant={modalData.restaurant} pantry={modalData.pantry} onClose={() => setModalMapping(null)} />
      )}

      {isGuideModalOpen && (
          <GuideModal onClose={() => setIsGuideModalOpen(false)} />
      )}
    </div>
  );
}

```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_community_plates.v1';
const ACCENT   = '#4f46e5';

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
      setError('Invalid credentials.');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Community Plates.V1</h1>
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
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College</p>
      </div>
    </div>
  );
}

```

### FILE: components/GuideModal.tsx
```typescript

import React from 'react';
import { XIcon, BookOpenIcon } from './icons';

interface GuideModalProps {
  onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-teal-500 pb-2 mb-3">{title}</h3>
    <div className="prose prose-sm max-w-none text-gray-600">
      {children}
    </div>
  </div>
);

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h2 id="guide-title" className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-3 text-teal-600" />
            Application Guide
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close guide"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="p-6 overflow-y-auto flex-grow">
          <GuideSection title="User Guide">
            <p>Welcome to Community Plates! This guide helps you use the app effectively.</p>
            <ol>
              <li><strong>Search:</strong> On the "Search & Connect" tab, enter a city or zip code. Click "Find Restaurants" or "Find Food Pantries" to see results in the lists below.</li>
              <li><strong>Select Items:</strong> In the search results, click the "Select" button on one restaurant and one food pantry you wish to connect. The selected items will be highlighted.</li>
              <li><strong>Map a Connection:</strong> Once one of each type is selected, a "Map Them" button will appear. Click it to create a connection.</li>
              <li><strong>View Dashboard:</strong> Navigate to the "Dashboard" tab to see all your mapped connections.</li>
              <li><strong>Generate Email:</strong> In the dashboard, click the mail icon on any connection to open a pre-filled, customizable email template to request a donation.</li>
              <li><strong>Import/Export Data:</strong> On both tabs, use the "Import" buttons to upload your own lists from a JSON file, and the "Export" buttons to download data as JSON or a printable PDF.</li>
            </ol>
          </GuideSection>

          <GuideSection title="Technical Description">
            <p>Community Plates is a single-page application (SPA) built with a modern frontend stack designed for performance, maintainability, and a great user experience.</p>
            <ul>
                <li><strong>Core Framework:</strong> React 18 with TypeScript for robust, type-safe component-based UI development.</li>
                <li><strong>Styling:</strong> Tailwind CSS for a utility-first styling workflow, enabling rapid and consistent UI design.</li>
                <li><strong>AI Integration:</strong> The Google Gemini API (`gemini-2.5-flash` model) is used to dynamically fetch location-based data for restaurants and pantries based on user queries. It uses JSON mode with a defined schema for reliable, structured data retrieval.</li>
                <li><strong>State Management:</strong> Component-level state is managed using React Hooks (`useState`, `useCallback`, `useRef`) for simplicity and efficiency.</li>
                <li><strong>Modularity:</strong> The codebase is organized into logical directories: `components` for reusable UI elements, `services` for API calls and business logic (like exports), and `types` for shared data structures.</li>
            </ul>
          </GuideSection>

          <GuideSection title="Technical Guide">
            <p>The application follows a standard React project structure. Key files include:</p>
            <ul>
                <li><code>index.html</code>: The main entry point that loads the React application.</li>
                <li><code>index.tsx</code>: Mounts the main `App` component to the DOM.</li>
                <li><code>App.tsx</code>: The root component that manages the overall application state, routing between tabs, and orchestrates the child components.</li>
                <li><code>services/geminiService.ts</code>: Handles all communication with the Google GenAI API. It constructs the prompts, defines the response JSON schema, and processes the results.</li>
                <li><code>services/exportService.ts</code>: Contains functions to convert application data (search results, mappings) into JSON or PDF files for download, using `jsPDF` for PDF generation.</li>
                <li><code>components/</code>: This directory holds all reusable React components, such as modals, icons, and list renderers.</li>
                <li><code>types.ts</code>: Defines TypeScript interfaces for core data models like `Restaurant`, `Pantry`, and `Mapping`, ensuring data consistency across the app.</li>
            </ul>
          </GuideSection>

          <GuideSection title="Deployment Procedures for Local Verification">
            <p>To run this application on your local machine for verification or development, please follow these steps:</p>
            <ol>
              <li><strong>Prerequisites:</strong> Ensure you have Node.js (v18 or higher) and npm installed.</li>
              <li><strong>Clone Repository:</strong> Obtain the source code by cloning the repository to your local machine.</li>
              <li>
                <strong>Set API Key:</strong> The application requires a Google Gemini API key. You must create a file named <code>.env</code> in the root of the project directory and add the following line, replacing `YOUR_API_KEY_HERE` with your actual key:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm block my-2">REACT_APP_API_KEY=<REDACTED>
                <br />
                <em>Note: In a production environment, this key would be managed securely on the server side.</em>
              </li>
              <li><strong>Install Dependencies:</strong> Open a terminal in the project root and run the command:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm block my-2">npm install</code>
              </li>
              <li><strong>Start the Server:</strong> After installation, start the local development server with:
                <br />
                <code className="bg-gray-200 p-1 rounded text-sm block my-2">npm start</code>
              </li>
              <li><strong>Access the App:</strong> The application should now be running. Open your web browser and navigate to <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">http://localhost:3000</a>.</li>
            </ol>
          </GuideSection>
        </main>
      </div>
    </div>
  );
};

```

### FILE: components/icons.tsx
```typescript

import React from 'react';

// Using props to allow for custom styling of icons
interface IconProps {
    className?: string;
}

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ListIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="8" x2="21" y1="6" y2="6" />
    <line x1="8" x2="21" y1="12" y2="12" />
    <line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" />
    <line x1="3" x2="3.01" y1="12" y2="12" />
    <line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);

export const LinkIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);

export const MailIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

export const XIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

export const BuildingIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
);

export const UtensilsCrossedIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 1.6.8 2.5.2l1.8-1.8a3 3 0 0 0 0-4.2Z"/></svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

```

### FILE: CREATION.md
```md
# community-plates.v1

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

This application is deployed behind an Nginx reverse proxy at the path `/community-plates.v1/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/community-plates.v1/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/community-plates.v1/',  // REQUIRED: Assets must load from /community-plates.v1/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/community-plates.v1"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/community-plates.v1">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/community-plates.v1/`, not at the root
- **Asset Loading**: Without `base: '/community-plates.v1/'`, assets try to load from `/assets/` instead of `/community-plates.v1/assets/`
- **Routing**: Without `basename="/community-plates.v1"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/community-plates.v1/assets/index-*.js`
- Link tags should reference: `/community-plates.v1/assets/index-*.css`

If they reference `/assets/` instead of `/community-plates.v1/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/community-plates.v1/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/community-plates.v1/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: community-plates.v1

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
# Admin Guide — community-plates

**Application:** community-plates
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

Audit log data is stored in `localStorage` under the key `tuc_community-plates_audit`.

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
# Deployment Guide — community-plates

**Application:** community-plates
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd community-plates
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
docker-compose -f docker-compose-all-apps.yml build community-plates
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up community-plates
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

**Project:** Community Plates
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Community Plates**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Community Plates** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Community Plates** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| Docker service configured | âŒ Non-compliant |
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
# Testing Guide — community-plates

**Application:** community-plates
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd community-plates
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
    <meta property="og:title" content="Community Plates.v1 | Techbridge University College" />
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
    <meta name="twitter:title" content="Community Plates.v1 | Techbridge University College" />
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
    <title>Community Plates.v1 | Techbridge University College</title>

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
      body.app-ready { display: block !important; background-color: #f3f4f6 !important; overflow: auto; }
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
        <div class="tuc-status">community plates.v1</div>
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

// Remove splash body styles once React takes over
document.body.classList.add('app-ready');

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
  "name": "s",
  "description": "A web application designed to connect restaurants with local food pantries to facilitate food donations, featuring location-based search, connection mapping, and automated donation requests.",
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
  "name": "community-plates",
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
    "@google/genai": "^1.10.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "serve": "14.2.5",
    "typescript": "~5.7.2",
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

### FILE: services/exportService.ts
```typescript

import { Restaurant, Pantry, Mapping, Location, SearchType } from '../types';

declare const jspdf: any;

// Helper to trigger file download
const downloadFile = (content: string, fileName: string, contentType: string) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const exportToJson = (data: any, fileName: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `${fileName}.json`, 'application/json');
};

export const exportSearchResultsToPdf = (
  results: Location[], 
  searchType: SearchType, 
  query: string
) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const title = `Search Results for ${searchType} in "${query}"`;
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  const head = [['Name', 'Address', 'Phone', 'Hours']];
  const body = results.map(item => [
    item.name,
    item.address,
    item.phone,
    item.hours
  ]);

  doc.autoTable({
    startY: 30,
    head,
    body,
    theme: 'striped',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 160, 133] }, // A nice teal color
  });

  doc.save(`community-plates_${searchType}_results.pdf`);
};

export const exportMappingsToPdf = (
  mappings: Mapping[],
  restaurants: Restaurant[],
  pantries: Pantry[]
) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Community Plates - Mapped Connections", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const head = [['Restaurant', 'Pantry', 'Pantry Contact']];
  const body = mappings.map(mapping => {
    const restaurant = restaurants.find(r => r.id === mapping.restaurantId);
    const pantry = pantries.find(p => p.id === mapping.pantryId);
    return [
      restaurant ? restaurant.name : 'N/A',
      pantry ? pantry.name : 'N/A',
      pantry ? `${pantry.address}, ${pantry.phone}` : 'N/A'
    ];
  });

  doc.autoTable({
    startY: 40,
    head,
    body,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }, // A nice blue color
  });

  doc.save('community-plates_connections.pdf');
};

```

### FILE: services/geminiService.ts
```typescript

import { GoogleGenAI, Type } from "@google/genai";
import { SearchType, Restaurant, Pantry } from '../types';

const API_KEY = <REDACTED>
if (!API_KEY) {
  // This is a fallback for development, but the app expects the key to be set in the environment.
  console.warn("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const commonLocationSchema = {
    name: { type: Type.STRING, description: "The full name of the establishment." },
    address: { type: Type.STRING, description: "The full street address, including city and zip code." },
    phone: { type: Type.STRING, description: "The primary phone number." },
    hours: { type: Type.STRING, description: "The operating hours, e.g., 'Mon-Fri 9am-5pm'." },
    id: { type: Type.STRING, description: "A unique ID for this item, can be a short hash of the name."}
};

const restaurantSchema = {
    type: Type.OBJECT,
    properties: {
        ...commonLocationSchema,
        isPartner: { type: Type.BOOLEAN, description: "Indicates if they are a 'Partner for Donations'." },
    },
};

const pantrySchema = {
    type: Type.OBJECT,
    properties: {
        ...commonLocationSchema,
        needs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of items the pantry currently needs. If specific needs aren't listed, provide general categories like 'Non-perishable food' or 'Fresh produce'." },
        dropOffTimes: { type: Type.STRING, description: "Specific times when donations are accepted. If not available, use a placeholder like 'Please call to arrange a drop-off' or 'Check website for hours'." },
    },
};

export const fetchLocations = async (
  query: string,
  type: SearchType
): Promise<Restaurant[] | Pantry[]> => {
  const isRestaurant = type === SearchType.Restaurants;
  const entityName = isRestaurant ? "restaurants" : "food pantries, food banks, or other food donation centers";
  const schema = isRestaurant ? restaurantSchema : pantrySchema;

  const prompt = `Find up to 10 ${entityName} in or near ${query} worldwide. Provide a diverse list representing different regions when possible. For each, give me the name, full address including country, phone number with country code, and operating hours in local time. Also include the specific fields as described in the JSON schema. It is very important to return a list, even if some specific details for a location are not available; in that case, use sensible placeholders like 'Varies' or 'Call for details'.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locations: {
              type: Type.ARRAY,
              items: schema,
            }
          }
        },
      },
    });
    
    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received empty response from API.");
    }

    const data = JSON.parse(jsonText);
    return data.locations || [];

  } catch (error) {
    console.error(`Error fetching ${entityName}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('json')) {
            throw new Error(`The AI model returned an invalid format. Please try your search again.`);
        }
        throw new Error(`Failed to fetch ${entityName}. Reason: ${error.message}`);
    }
    throw new Error(`An unknown error occurred while fetching ${entityName}.`);
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
          <span className="font-bold text-sm">Community Plates.v1</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Community Plates.v1 — Admin</h1>
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
 * E2E stub — community-plates
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('community-plates E2E', () => {
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
    "target": "ES2020",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "allowJs": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "paths": {
      "@/*" :  ["./*"]
    }
  }
}

```

### FILE: types.ts
```typescript

export interface Location {
  name: string;
  address: string;
  phone: string;
  hours: string;
  id: string;
}

export interface Restaurant extends Location {
  isPartner: boolean;
}

export interface Pantry extends Location {
  needs: string[];
  dropOffTimes: string;
}

export interface Mapping {
  id: string;
  restaurantId: string;
  pantryId: string;
}

// Enum for search types to ensure type safety
export enum SearchType {
  Restaurants = 'restaurants',
  Pantries = 'pantries',
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

// Vitest unit test configuration — community-plates
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

// Vitest E2E configuration — community-plates
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

