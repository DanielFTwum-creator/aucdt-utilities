import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Notification } from '../types';
import { Bell, Trash2, Send, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

const AdminNotifications: React.FC = () => {
  const { notifications, addNotification, deleteNotification } = useStore();
  const [newNotif, setNewNotif] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'Info',
    audience: 'All'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) return;

    const notification: Notification = {
      id: `n${Date.now()}`,
      title: newNotif.title,
      message: newNotif.message,
      type: newNotif.type as any,
      audience: newNotif.audience as any,
      date: new Date().toISOString()
    };

    addNotification(notification);
    setNewNotif({
      title: '',
      message: '',
      type: 'Info',
      audience: 'All'
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Warning': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'Success': return <CheckCircle className="text-green-500" size={20} />;
      case 'Urgent': return <AlertOctagon className="text-red-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Warning': return 'bg-orange-50 border-orange-100 text-orange-800';
      case 'Success': return 'bg-green-50 border-green-100 text-green-800';
      case 'Urgent': return 'bg-red-50 border-red-100 text-red-800';
      default: return 'bg-blue-50 border-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications & Alerts</h1>
          <p className="text-slate-500">Create announcements for campers and staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Notification Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-vbci-navy" />
              Create Alert
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  placeholder="Alert Title"
                  value={newNotif.title}
                  onChange={e => setNewNotif({...newNotif, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  value={newNotif.type}
                  onChange={e => setNewNotif({...newNotif, type: e.target.value as any})}
                >
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Success">Success</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  value={newNotif.audience}
                  onChange={e => setNewNotif({...newNotif, audience: e.target.value as any})}
                >
                  <option value="All">All Users</option>
                  <option value="Campers">Campers Only</option>
                  <option value="Admins">Admins Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none resize-none"
                  placeholder="Enter your message here..."
                  value={newNotif.message}
                  onChange={e => setNewNotif({...newNotif, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-vbci-navy text-white rounded-lg font-bold hover:bg-vbci-navyLight shadow-md transition-all transform hover:scale-[1.02] flex justify-center items-center"
              >
                <Send size={16} className="mr-2" />
                Post Notification
              </button>
            </form>
          </div>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-vbci-navy" />
            Active Notifications ({notifications.length})
          </h2>
          
          {notifications.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
              <Bell className="w-12 h-12 mx-auto text-slate-200 mb-3" />
              <p className="text-slate-500">No active notifications.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg mt-1 ${getTypeColor(notif.type).split(' ')[0]} ${getTypeColor(notif.type).split(' ')[2].replace('text', 'text')}`}>
                       {getTypeIcon(notif.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-lg">{notif.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(notif.type)}`}>
                          {notif.type}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Posted: {new Date(notif.date).toLocaleDateString()} at {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>To: {notif.audience}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this notification?')) deleteNotification(notif.id);
                    }}
                    className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;