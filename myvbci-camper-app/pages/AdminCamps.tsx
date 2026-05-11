import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Camp } from '../types';
import { Plus, Trash2, Calendar, Users, DollarSign, Image as ImageIcon } from 'lucide-react';

const AdminCamps: React.FC = () => {
  const { camps, addCamp, deleteCamp } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCamp, setNewCamp] = useState<Partial<Camp>>({
    name: '',
    description: '',
    price: 0,
    capacity: 100,
    available_slots: 100,
    start_date: '',
    end_date: '',
    image_url: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
      setNewCamp({ ...newCamp, image_url: imageUrl });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.name || !newCamp.start_date) return;

    const camp: Camp = {
      camp_id: `c${Date.now()}`,
      name: newCamp.name!,
      description: newCamp.description || '',
      price: Number(newCamp.price),
      capacity: Number(newCamp.capacity),
      available_slots: Number(newCamp.capacity), // Default to capacity
      start_date: newCamp.start_date!,
      end_date: newCamp.end_date!,
      image_url: newCamp.image_url || 'https://picsum.photos/800/400?random=' + Date.now()
    };

    addCamp(camp);
    setIsAdding(false);
    setNewCamp({
        name: '',
        description: '',
        price: 0,
        capacity: 100,
        available_slots: 100,
        start_date: '',
        end_date: '',
        image_url: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Camps</h1>
          <p className="text-slate-500">Create and manage camp events.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-vbci-navy text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-vbci-navyLight transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Camp
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg mb-8 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">New Camp Details</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Camp Name</label>
              <input 
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.name}
                onChange={e => setNewCamp({...newCamp, name: e.target.value})}
                placeholder="e.g. Summer Youth Retreat"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.description}
                onChange={e => setNewCamp({...newCamp, description: e.target.value})}
                placeholder="Camp details..."
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Camp Image</label>
              {newCamp.image_url ? (
                <div>
                  <img src={newCamp.image_url} alt="Camp preview" className="h-40 w-full object-cover rounded-lg shadow-sm mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Image placeholder generated.</span>
                    <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-vbci-navy hover:text-vbci-navyLight">
                        Change Image
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-vbci-navy hover:text-vbci-navyLight focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-vbci-navy">
                        <span>Upload an image</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">A random placeholder will be generated.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input 
                type="date"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.start_date}
                onChange={e => setNewCamp({...newCamp, start_date: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input 
                type="date"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.end_date}
                onChange={e => setNewCamp({...newCamp, end_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₵)</label>
              <input 
                type="number"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.price}
                onChange={e => setNewCamp({...newCamp, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
              <input 
                type="number"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.capacity}
                onChange={e => setNewCamp({...newCamp, capacity: Number(e.target.value)})}
              />
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-vbci-gold text-vbci-navy font-bold rounded-md hover:bg-vbci-goldHover shadow-sm transition-colors"
              >
                Create Camp
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {camps.map(camp => (
          <div key={camp.camp_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-shadow">
            <div className="h-32 w-full md:w-48 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
               <img src={camp.image_url} alt={camp.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-vbci-navy mb-2">{camp.name}</h3>
                <button 
                    onClick={() => {
                        if(window.confirm('Are you sure you want to delete this camp?')) {
                            deleteCamp(camp.camp_id);
                        }
                    }}
                    className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Camp"
                >
                    <Trash2 size={18} />
                </button>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{camp.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-vbci-gold" />
                  {new Date(camp.start_date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-vbci-gold" />
                  ₵{camp.price}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-vbci-gold" />
                  {camp.capacity - camp.available_slots} / {camp.capacity} registered
                </div>
              </div>
            </div>
          </div>
        ))}

        {camps.length === 0 && (
            <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No camps found</h3>
                <p className="text-slate-500">Get started by creating a new camp.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminCamps;