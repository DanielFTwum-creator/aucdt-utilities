
import React from 'react';
import { User, Mail, Globe, Shield, Bell, Download, Trash2, Camera } from 'lucide-react';
import { UserProfile } from '../types';
import { SUPPORTED_CURRENCIES } from '../constants';

interface ProfilePageProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setUser }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="h-32 bg-indigo-600 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white shadow-lg overflow-hidden relative group">
              {user.name.charAt(0)}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="text-white w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-16 px-8 pb-8">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  value={user.name} 
                  onChange={(e) => setUser(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  value={user.email} 
                  onChange={(e) => setUser(prev => ({...prev, email: e.target.value}))}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              Preferences
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Base Currency</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={user.currency}
                  onChange={(e) => setUser(prev => ({...prev, currency: e.target.value}))}
                >
                  {SUPPORTED_CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">All reports and charts will use this currency based on current exchange rates.</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                </div>
                <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <button className="text-sm font-semibold text-indigo-600 hover:underline">Change Password</button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" defaultChecked />
                <span className="text-sm text-gray-700">Budget alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" defaultChecked />
                <span className="text-sm text-gray-700">Weekly summaries</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" />
                <span className="text-sm text-gray-700">New feature updates</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Data Management</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                Export My Data
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 rounded-xl text-sm font-semibold text-rose-600 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
