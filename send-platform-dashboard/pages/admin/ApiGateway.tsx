import React, { useState } from 'react';
import { 
  Network, 
  Shield, 
  Zap, 
  Globe, 
  Plus, 
  MoreHorizontal, 
  Search, 
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mockGatewayRoutes } from '../../services/mockData';
import { HttpMethod, AuthType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { auditService } from '../../services/auditService';

const ApiGateway: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routes' | 'metrics' | 'settings'>('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const { user } = useAuth();

  const filteredRoutes = mockGatewayRoutes.filter(route => 
    route.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
    route.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMaintenance = () => {
    const newState = !isMaintenanceMode;
    setIsMaintenanceMode(newState);
    auditService.log(
      user?.username || 'unknown',
      'UPDATE_CONFIG',
      'API Gateway',
      'SUCCESS',
      `Maintenance mode set to ${newState}`
    );
  };

  const getMethodBadge = (method: HttpMethod) => {
    switch(method) {
      case HttpMethod.GET: return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800';
      case HttpMethod.POST: return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800';
      case HttpMethod.PUT: return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-800';
      case HttpMethod.DELETE: return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getAuthIcon = (type: AuthType) => {
    switch(type) {
      case AuthType.OAUTH2: return '🔐 OAuth2';
      case AuthType.JWT: return '🎫 JWT';
      case AuthType.API_KEY: return '🔑 Key';
      case AuthType.NONE: return '🔓 Public';
      default: return '?';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Network className="mr-3 text-blue-600 dark:text-blue-400" size={28} />
            API Gateway Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage request routing, authentication policies, and rate limits.</p>
        </div>
        <div className="flex space-x-3">
          <span className="flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full border border-green-100 dark:border-green-900 text-sm font-medium">
             <Globe size={14} className="mr-2" /> Gateway Online
          </span>
          <button 
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Add new route"
          >
            <Plus size={18} className="mr-2" />
            Add Route
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Throughput</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,245 <span className="text-sm font-normal text-gray-400">req/s</span></h3>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Zap size={20} />
              </div>
           </div>
           <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-4">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Auth Rejections</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">0.4%</h3>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <Shield size={20} />
              </div>
           </div>
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Low anomaly detection rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Routes</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{mockGatewayRoutes.length}</h3>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <Network size={20} />
              </div>
           </div>
           <p className="text-xs text-green-600 dark:text-green-400 mt-3 flex items-center">
             <CheckCircle size={12} className="mr-1" /> All upstreams healthy
           </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 flex px-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('routes')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'routes' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Route Definitions
          </button>
          <button 
            onClick={() => setActiveTab('metrics')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'metrics' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            Global Policy
          </button>
        </div>

        {activeTab === 'routes' && (
          <div>
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50 dark:bg-gray-800">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search routes by path..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-gray-700 dark:text-white"
                  aria-label="Search routes"
                />
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Routes Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left" aria-label="API Routes List">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Method</th>
                    <th className="px-6 py-4 font-semibold">Path Pattern</th>
                    <th className="px-6 py-4 font-semibold">Upstream Target</th>
                    <th className="px-6 py-4 font-semibold">Auth Policy</th>
                    <th className="px-6 py-4 font-semibold">Rate Limit</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredRoutes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getMethodBadge(route.method)}`}>
                          {route.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-gray-900 dark:text-white font-medium">{route.path}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{route.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                        {route.upstream_service}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                          {getAuthIcon(route.auth_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {route.rate_limit_per_min} <span className="text-xs text-gray-400">req/min</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-600 rounded-lg"
                          aria-label={`Actions for route ${route.path}`}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center rounded-b-xl">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing all {mockGatewayRoutes.length} active routes
              </span>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="p-8 max-w-4xl">
              <div className="space-y-8">
                <div className="flex items-start justify-between p-4 border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900 rounded-lg">
                  <div className="flex items-start">
                     <div className="bg-blue-200 dark:bg-blue-800 p-2 rounded-lg text-blue-700 dark:text-blue-200 mr-4">
                        <Zap size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Global Rate Limiting</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Enforce a hard ceiling on total requests processed by the gateway to protect downstream infrastructure.
                        </p>
                     </div>
                  </div>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-300 dark:bg-blue-700 cursor-pointer"></label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Security Defaults</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Default Auth Strategy</span>
                            <select className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white border rounded-md p-1">
                               <option>OAUTH2 (Recommended)</option>
                               <option>API Key</option>
                            </select>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Block Anonymous Requests</span>
                            <input type="checkbox" defaultChecked className="dark:bg-gray-700" />
                         </div>
                      </div>
                   </div>

                   <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Maintenance</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Maintenance Mode</span>
                            <button 
                              onClick={toggleMaintenance}
                              className={`px-3 py-1 text-xs rounded border font-medium transition-colors ${
                                isMaintenanceMode 
                                  ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                              }`}
                            >
                               {isMaintenanceMode ? 'Disable' : 'Enable'}
                            </button>
                         </div>
                         <p className="text-xs text-gray-400">
                           When enabled, all non-admin requests will receive a 503 Service Unavailable response.
                         </p>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ApiGateway;