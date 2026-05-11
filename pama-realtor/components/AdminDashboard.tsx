import React, { useState, useMemo } from 'react';
import { Property, PropertyType, AuditLogEntry } from '../types';
import { Shield, Plus, Trash2, Edit2, LogOut, FileText, LayoutGrid, Search, TrendingUp, DollarSign, Home, Activity } from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
  auditLogs: AuditLogEntry[];
  onAddProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  properties, 
  auditLogs, 
  onAddProperty, 
  onDeleteProperty,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'logs'>('properties');
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Property State
  const [newProp, setNewProp] = useState<Partial<Property>>({
    title: '',
    price: 0,
    location: '',
    description: '',
    type: PropertyType.RENT,
    image: 'https://picsum.photos/600/400',
    driveToViewPrice: 50
  });

  // Derived Stats
  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);
  const rentalCount = properties.filter(p => p.type === PropertyType.RENT).length;
  const saleCount = properties.filter(p => p.type === PropertyType.SALE).length;

  // Filtered Properties
  const filteredProperties = useMemo(() => {
    return properties.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.title || !newProp.price) return;
    
    onAddProperty({
      ...newProp,
      id: `p${Date.now()}`,
      bedrooms: 0,
    } as Property);
    
    setIsAdding(false);
    setNewProp({
      title: '',
      price: 0,
      location: '',
      description: '',
      type: PropertyType.RENT,
      image: 'https://picsum.photos/600/400',
      driveToViewPrice: 50
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      {/* Sidebar / Topbar Hybrid for better responsiveness */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Admin Console</h1>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Secure Access</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex gap-1">
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'properties' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Properties
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'logs' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Audit Logs
                </button>
              </nav>
              <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-2"></div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Home size={20} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Properties</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                <DollarSign size={20} />
              </div>
              <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gh₵ {(totalValue / 1000000).toFixed(1)}M</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Portfolio Value</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="flex gap-4">
               <div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">{saleCount}</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-xs">For Sale</p>
               </div>
               <div className="w-px bg-gray-200 dark:bg-slate-700"></div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">{rentalCount}</h3>
                 <p className="text-gray-500 dark:text-gray-400 text-xs">For Rent</p>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
             <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                <Activity size={20} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{auditLogs.length}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">System Events</p>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md text-sm font-medium"
              >
                <Plus size={18} />
                Add Property
              </button>
            </div>

            {isAdding && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-slate-600 animate-in fade-in slide-in-from-top-4 z-10 relative">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Property</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    placeholder="Property Title" 
                    value={newProp.title}
                    onChange={e => setNewProp({...newProp, title: e.target.value})}
                    className="p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required 
                  />
                  <input 
                    type="number" 
                    placeholder="Price (Gh₵)" 
                    value={newProp.price || ''}
                    onChange={e => setNewProp({...newProp, price: Number(e.target.value)})}
                    className="p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" required 
                  />
                  <input 
                    placeholder="Location" 
                    value={newProp.location}
                    onChange={e => setNewProp({...newProp, location: e.target.value})}
                    className="p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                  <select 
                    value={newProp.type}
                    onChange={e => setNewProp({...newProp, type: e.target.value as PropertyType})}
                    className="p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value={PropertyType.RENT}>For Rent</option>
                    <option value={PropertyType.SALE}>For Sale</option>
                  </select>
                  <textarea 
                    placeholder="Property Description" 
                    value={newProp.description}
                    onChange={e => setNewProp({...newProp, description: e.target.value})}
                    className="md:col-span-2 p-3 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white h-24 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                  />
                  <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAdding(false)} 
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-colors"
                    >
                      Create Listing
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map(property => (
                <div key={property.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                       <button className="text-white hover:text-indigo-300 transition-colors"><Edit2 size={18} /></button>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                         <button 
                           onClick={() => onDeleteProperty(property.id)} 
                           className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-red-500 hover:text-red-600 shadow-sm transition-transform hover:scale-110"
                           title="Delete Property"
                         >
                           <Trash2 size={16} />
                         </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight truncate pr-2">{property.title}</h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                        property.type === PropertyType.RENT 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}>
                        {property.type}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 flex items-center gap-1">
                      <Home size={12} />
                      {property.location}
                    </p>
                    <div className="flex items-end justify-between border-t border-gray-100 dark:border-slate-700 pt-3">
                       <p className="font-bold text-gray-900 dark:text-white text-lg">Gh₵ {property.price.toLocaleString()}</p>
                       <span className="text-xs text-gray-400">ID: {property.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProperties.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <p>No properties found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-slate-750 border-b border-gray-200 dark:border-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {auditLogs.slice().reverse().map((log, idx) => (
                    <tr key={log.id} className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50/30 dark:bg-slate-800/50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {log.timestamp.toLocaleTimeString()} <span className="opacity-50 ml-1 text-xs">{log.timestamp.toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs text-indigo-700 dark:text-indigo-300">
                             {log.user.charAt(0)}
                           </div>
                           {log.user}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          log.action.includes('Login') ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' : 
                          log.action.includes('Delete') ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' :
                          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center gap-2">
                        <FileText size={32} className="opacity-20" />
                        <span>No activity logs recorded yet.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;