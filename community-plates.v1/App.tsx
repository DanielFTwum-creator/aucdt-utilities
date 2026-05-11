
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
