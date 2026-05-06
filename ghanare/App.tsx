// --- START OF FILE App.tsx ---
import React, { useState, useEffect, useRef } from 'react';
import { Vehicle, SearchParams, Suggestion, Theme, AuditLogEntry, User, TestResult } from './types';
import { getRentalSuggestions } from './services/geminiService';
import { MapPinIcon, CalendarDaysIcon, StarIcon, SparklesIcon, Cog6ToothIcon, SunIcon, MoonIcon, EyeIcon, ShieldCheckIcon, UserCircleIcon, XCircleIcon, DocumentMagnifyingGlassIcon } from './components/icons';
import { PuppeteerTestsTab } from './components/PuppeteerTestsTab';


// --- Mock Data based on SRS ---
const initialMockVehicles: Vehicle[] = [
  { id: 1, name: 'Toyota Corolla S', model: 'Corolla', year: 2021, type: 'Saloon', pricePerDay: 250, location: 'East Legon, Accra', imageUrl: 'https://via.placeholder.com/400x300.png/006B3F/FFFFFF?text=Toyota+Corolla', features: ['A/C', 'Bluetooth', 'Automatic'], rating: 4.8, reviewCount: 45, isListed: true },
  { id: 2, name: 'Hyundai Tucson', model: 'Tucson', year: 2022, type: 'SUV', pricePerDay: 400, location: 'Osu, Accra', imageUrl: 'https://via.placeholder.com/400x300.png/CE1126/FFFFFF?text=Hyundai+Tucson', features: ['A/C', 'Sunroof', 'Automatic'], rating: 4.9, reviewCount: 32, isListed: true },
  { id: 3, name: 'Kia Picanto', model: 'Picanto', year: 2020, type: 'Hatchback', pricePerDay: 180, location: 'Airport Hills, Accra', imageUrl: 'https://via.placeholder.com/400x300.png/FCD116/000000?text=Kia+Picanto', features: ['A/C', 'Manual', 'Fuel Efficient'], rating: 4.6, reviewCount: 68, isListed: true },
  { id: 4, name: 'Toyota Land Cruiser', model: 'Land Cruiser', year: 2023, type: '4x4', pricePerDay: 900, location: 'Cantonments, Accra', imageUrl: 'https://via.placeholder.com/400x300.png/212121/FFFFFF?text=Land+Cruiser', features: ['A/C', 'Leather Seats', '7-Seater'], rating: 5.0, reviewCount: 15, isListed: true },
];

const initialMockUsers: User[] = [
    { id: 101, name: 'Ama Serwaa', email: 'ama.s@example.com', isVerified: false },
    { id: 102, name: 'Kofi Mensah', email: 'k.mensah@example.com', isVerified: true },
];

const ADMIN_PASSWORD = "admin"; // Configurable admin password

// --- Components ---
const Header: React.FC<{ onAdminClick: () => void; theme: Theme; setTheme: (theme: Theme) => void; }> = ({ onAdminClick, theme, setTheme }) => (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 high-contrast:bg-black high-contrast:border-b high-contrast:border-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#006B3F] flex items-center justify-center rounded-full high-contrast:bg-black high-contrast:border high-contrast:border-yellow-400">
                    <StarIcon className="w-6 h-6 text-[#FCD116]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white high-contrast:text-white">GhanaRide</h1>
            </div>
            <nav className="flex items-center gap-4">
                <div className="relative group">
                    <button aria-label="Change theme" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        {theme === 'light' && <SunIcon />}
                        {theme === 'dark' && <MoonIcon />}
                        {theme === 'high-contrast' && <EyeIcon />}
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-20">
                        <button onClick={() => setTheme('light')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><SunIcon/> Light</button>
                        <button onClick={() => setTheme('dark')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><MoonIcon/> Dark</button>
                        <button onClick={() => setTheme('high-contrast')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"><EyeIcon/> High Contrast</button>
                    </div>
                </div>
                <button onClick={onAdminClick} className="text-gray-600 dark:text-gray-300 hover:text-green-600 high-contrast:text-yellow-400 flex items-center gap-2 p-2 rounded-md">
                    <Cog6ToothIcon />
                    <span className="hidden sm:inline">Admin</span>
                </button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-green-600 high-contrast:text-yellow-400">Login</button>
            </nav>
        </div>
    </header>
);

const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 duration-300 high-contrast:bg-black high-contrast:border high-contrast:border-white">
        <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white high-contrast:text-white">{vehicle.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 high-contrast:text-gray-300">{vehicle.type} &middot; {vehicle.year}</p>
            <div className="flex items-center mt-2">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="ml-1 text-gray-700 dark:text-gray-300 high-contrast:text-gray-300">{vehicle.rating}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400 high-contrast:text-gray-400">({vehicle.reviewCount} reviews)</span>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-bold text-green-600 high-contrast:text-yellow-400">₵{vehicle.pricePerDay}<span className="text-sm font-normal text-gray-500 high-contrast:text-gray-400">/day</span></p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:hover:bg-yellow-500">Book Now</button>
            </div>
        </div>
    </div>
);

const AISuggestions: React.FC = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [rawResponse, setRawResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetSuggestions = async () => {
        if (!query) return;
        setLoading(true);
        setError('');
        setSuggestions([]);
        setRawResponse('');

        try {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const result = await getRentalSuggestions(query, { latitude, longitude });
                setSuggestions(result.suggestions);
                setRawResponse(result.rawResponse);
                setLoading(false);
            }, async (geoError) => {
                console.warn("Could not get geolocation, continuing without it.", geoError);
                const result = await getRentalSuggestions(query, null);
                setSuggestions(result.suggestions);
                setRawResponse(result.rawResponse);
                setLoading(false);
            });
        } catch (e) {
            setError((e as Error).message);
            setLoading(false);
        }
    };
    
    return (
        <section className="my-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg high-contrast:bg-black high-contrast:border high-contrast:border-white">
             <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-4 high-contrast:text-white">
                <SparklesIcon className="w-6 h-6 text-blue-500 high-contrast:text-yellow-400"/>
                AI-Powered Trip Suggestions
            </h2>
            <div className="flex gap-2">
                <label htmlFor="ai-query" className="sr-only">Trip idea query</label>
                <input 
                    id="ai-query"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., 'restaurants with local food near me'"
                    className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 high-contrast:bg-black high-contrast:border-white high-contrast:text-white"
                />
                <button onClick={handleGetSuggestions} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:hover:bg-yellow-500">
                    {loading ? 'Thinking...' : 'Get Ideas'}
                </button>
            </div>
            <div aria-live="polite" className="mt-4">
              {error && <p className="text-red-500">{error}</p>}
              {rawResponse && <p className="text-gray-700 dark:text-gray-300">{rawResponse}</p>}
            </div>
            {suggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {suggestions.map((s, i) => (
                        <a href={s.mapUrl} target="_blank" rel="noopener noreferrer" key={i} className="block p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-shadow high-contrast:bg-black high-contrast:border high-contrast:border-gray-500 high-contrast:hover:border-yellow-400">
                            <p className="font-bold text-blue-700 dark:text-blue-400 high-contrast:text-yellow-400">{s.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 high-contrast:text-gray-300">{s.description}</p>
                        </a>
                    ))}
                </div>
            )}
        </section>
    )
}

const AdminLoginModal: React.FC<{ onClose: () => void; onLoginSuccess: () => void; }> = ({ onClose, onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        passwordInputRef.current?.focus();
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            onLoginSuccess();
        } else {
            setError('Invalid password.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm high-contrast:bg-black high-contrast:border-2 high-contrast:border-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 id="admin-login-title" className="text-2xl font-bold flex items-center gap-2"><ShieldCheckIcon/> Admin Access</h2>
                    <button onClick={onClose} aria-label="Close login dialog" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XCircleIcon /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input
                        ref={passwordInputRef}
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button type="submit" className="mt-6 w-full bg-green-600 text-white font-bold p-3 rounded-md hover:bg-green-700 high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:hover:bg-yellow-500">Login</button>
                </form>
            </div>
        </div>
    );
};

const AdminPanel: React.FC<{ log: AuditLogEntry[]; onLog: (entry: Omit<AuditLogEntry, 'timestamp'>) => void; users: User[]; vehicles: Vehicle[]; setUsers: React.Dispatch<React.SetStateAction<User[]>>; setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>; }> = ({ log, onLog, users, vehicles, setUsers, setVehicles }) => {
    const [activeTab, setActiveTab] = useState<'management' | 'testing'>('management');

    const handleVerifyUser = (userId: number, shouldVerify: boolean) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;
        setUsers(users.map(u => u.id === userId ? { ...u, isVerified: shouldVerify } : u));
        onLog({ action: 'USER_VERIFY', details: `${shouldVerify ? 'Verified' : 'Un-verified'} user ${user.name} (ID: ${userId})` });
    };
    
    const handleListVehicle = (vehicleId: number, shouldList: boolean) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;
        setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, isListed: shouldList } : v));
        onLog({ action: 'VEHICLE_LISTING', details: `${shouldList ? 'Listed' : 'De-listed'} vehicle ${vehicle.name} (ID: ${vehicleId})` });
    };

    return (
        <section className="my-8 p-6 bg-gray-200 dark:bg-gray-800 rounded-lg high-contrast:bg-black high-contrast:border high-contrast:border-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheckIcon/> Admin Panel</h2>
                <div className="flex border-b border-gray-400 dark:border-gray-600">
                    <button onClick={() => setActiveTab('management')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'management' ? 'border-b-2 border-green-600 text-green-600 high-contrast:border-yellow-400 high-contrast:text-yellow-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>Management</button>
                    <button onClick={() => setActiveTab('testing')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'testing' ? 'border-b-2 border-green-600 text-green-600 high-contrast:border-yellow-400 high-contrast:text-yellow-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>Self-Testing</button>
                </div>
            </div>

            {activeTab === 'management' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* User Management */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">User Management</h3>
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow">
                                {users.map(user => (
                                    <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                        <div>
                                            <p className="font-bold">{user.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                        <button onClick={() => handleVerifyUser(user.id, !user.isVerified)} className={`px-3 py-1 text-sm rounded-full text-white ${user.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                            {user.isVerified ? 'Un-verify' : 'Verify'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Vehicle Management */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Vehicle Management</h3>
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow">
                                {vehicles.map(v => (
                                    <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                                        <div>
                                            <p className="font-bold">{v.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{v.location}</p>
                                        </div>
                                        <button onClick={() => handleListVehicle(v.id, !v.isListed)} className={`px-3 py-1 text-sm rounded-full text-white ${v.isListed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                            {v.isListed ? 'De-list' : 'Re-list'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Audit Log */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Audit Log</h3>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-md shadow h-96 overflow-y-auto">
                            {log.length === 0 && <p className="text-gray-500 dark:text-gray-400">No admin actions recorded.</p>}
                            <ul className="space-y-3">
                                {log.map((entry, index) => (
                                    <li key={index}>
                                        <p className="font-mono text-xs text-gray-500 dark:text-gray-400">{entry.timestamp}</p>
                                        <p className="font-semibold">{entry.action}</p>
                                        <p className="text-sm">{entry.details}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'testing' && <PuppeteerTestsTab onLog={onLog} />}
        </section>
    );
};

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('light');
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
    const [users, setUsers] = useState<User[]>(initialMockUsers);
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialMockVehicles);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'high-contrast');
        root.classList.add(theme);
    }, [theme]);

    const handleAddLog = (entry: Omit<AuditLogEntry, 'timestamp'>) => {
        const newLogEntry: AuditLogEntry = {
            ...entry,
            timestamp: new Date().toISOString()
        };
        setAuditLog(prevLog => [newLogEntry, ...prevLog]);
    };

    const handleLoginSuccess = () => {
        setIsAdminLoggedIn(true);
        setShowAdminModal(false);
        handleAddLog({ action: 'ADMIN_LOGIN', details: 'Admin successfully logged in.' });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 high-contrast:bg-black high-contrast:text-white">
            <Header onAdminClick={() => setShowAdminModal(true)} theme={theme} setTheme={setTheme}/>
            {showAdminModal && <AdminLoginModal onClose={() => setShowAdminModal(false)} onLoginSuccess={handleLoginSuccess}/>}
            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Search Section */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg -mt-16 relative z-10 high-contrast:bg-black high-contrast:border high-contrast:border-white">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pick-up Location</label>
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="text" id="location" placeholder="e.g., Kotoka International Airport" className="w-full pl-10 p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 high-contrast:bg-black high-contrast:border-white high-contrast:text-white" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pick-up Date</label>
                             <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input type="date" id="pickup-date" className="w-full pl-10 p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 high-contrast:bg-black high-contrast:border-white high-contrast:text-white" />
                            </div>
                        </div>
                        <button className="bg-green-600 text-white font-bold p-3 rounded-md hover:bg-green-700 w-full high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:hover:bg-yellow-500">Search Cars</button>
                    </div>
                </section>

                {isAdminLoggedIn && <AdminPanel log={auditLog} onLog={handleAddLog} users={users} vehicles={vehicles} setUsers={setUsers} setVehicles={setVehicles}/>}

                <AISuggestions />
                
                {/* Vehicle Listings */}
                <section className="mt-8">
                    <h2 className="text-2xl font-bold mb-6">Popular Vehicles in Accra</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehicles.filter(v => v.isListed).map(vehicle => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;
// --- END OF FILE App.tsx ---