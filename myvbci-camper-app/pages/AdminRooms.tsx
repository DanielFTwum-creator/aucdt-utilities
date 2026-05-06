import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { RoomStatus, GenderRestriction, Room, RoomType } from '../types';
import { Users, Home, Plus, Trash2, Edit2, X, Save, SlidersHorizontal } from 'lucide-react';

const AdminRooms: React.FC = () => {
  const { camps, rooms, addRoom, updateRoom, deleteRoom } = useStore();
  const [selectedCampId, setSelectedCampId] = useState<string>(camps[0]?.camp_id || '');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'occupancy'>('name');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});

  useEffect(() => {
    if (camps.length > 0 && !selectedCampId) {
      setSelectedCampId(camps[0].camp_id);
    }
  }, [camps, selectedCampId]);

  // Handlers
  const handleAddClick = () => {
    setEditingRoom(null);
    setFormData({
      camp_id: selectedCampId,
      room_name: '',
      type: RoomType.DORM,
      capacity: 10,
      gender_restriction: GenderRestriction.MIXED,
      amenities: '',
      current_occupancy: 0,
      status: RoomStatus.AVAILABLE
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (roomId: string, roomName: string) => {
    if (window.confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      deleteRoom(roomId);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.room_name || !formData.capacity) return;

    if (editingRoom) {
      // Update
      updateRoom({
        ...editingRoom,
        ...formData as Room,
        // Ensure derived fields are correct
        camp_id: editingRoom.camp_id, // Prevent moving camps for now
        current_occupancy: editingRoom.current_occupancy // Preserve occupancy
      });
    } else {
      // Create
      addRoom({
        ...formData as Room,
        room_id: `r${Date.now()}`,
        camp_id: selectedCampId, // Ensure it goes to currently selected camp
        current_occupancy: 0,
        status: RoomStatus.AVAILABLE
      });
    }
    setIsModalOpen(false);
  };

  const currentCamp = camps.find(c => c.camp_id === selectedCampId);
  
  // Filtering
  let filteredRooms = rooms.filter(r => {
      const matchCamp = r.camp_id === selectedCampId;
      if (!matchCamp) return false;
      if (filterStatus !== 'All' && r.status !== filterStatus) return false;
      if (filterType !== 'All' && r.type !== filterType) return false;
      return true;
  });

  // Sorting
  filteredRooms = filteredRooms.sort((a, b) => {
    if (sortBy === 'name') return a.room_name.localeCompare(b.room_name);
    if (sortBy === 'capacity') return b.capacity - a.capacity;
    if (sortBy === 'occupancy') return b.current_occupancy - a.current_occupancy;
    return 0;
  });

  // Stats calculation (ignoring filters for context)
  const campRooms = rooms.filter(r => r.camp_id === selectedCampId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Allocation</h1>
          <p className="text-slate-500">Manage rooms, capacity, and occupancy.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
             {/* Sort Filter */}
             <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <SlidersHorizontal size={16} className="text-slate-500 mr-2" />
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none pr-8"
                >
                    <option value="name">Sort by Name</option>
                    <option value="capacity">Sort by Capacity</option>
                    <option value="occupancy">Sort by Occupancy</option>
                </select>
            </div>

             {/* Type Filter */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <span className="text-sm text-slate-500 mr-2">Type:</span>
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none"
                >
                    <option value="All">All Types</option>
                    {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <span className="text-sm text-slate-500 mr-2">Status:</span>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none"
                >
                    <option value="All">All Status</option>
                    <option value={RoomStatus.AVAILABLE}>Available</option>
                    <option value={RoomStatus.FULL}>Full</option>
                </select>
            </div>

            {/* Camp Filter */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <span className="text-sm text-slate-500 mr-2">Camp:</span>
                <select 
                    value={selectedCampId}
                    onChange={(e) => setSelectedCampId(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none"
                >
                    {camps.map(camp => (
                    <option key={camp.camp_id} value={camp.camp_id}>{camp.name}</option>
                    ))}
                </select>
            </div>

            <button 
              onClick={handleAddClick}
              disabled={!selectedCampId}
              className="bg-vbci-navy text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-vbci-navyLight transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Add Room
            </button>
        </div>
      </div>

      {!currentCamp ? (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            Please select or create a camp to view rooms.
        </div>
      ) : (
        <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Capacity</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                        {campRooms.reduce((sum, r) => sum + r.capacity, 0)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Occupied</p>
                    <p className="text-2xl font-bold text-vbci-navy mt-1">
                        {campRooms.reduce((sum, r) => sum + r.current_occupancy, 0)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Rooms Full</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                        {campRooms.filter(r => r.status === RoomStatus.FULL).length} / {campRooms.length}
                    </p>
                </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map(room => {
                    const occupancyPct = (room.current_occupancy / room.capacity) * 100;
                    let progressColor = 'bg-green-500';
                    if (occupancyPct > 50) progressColor = 'bg-yellow-500';
                    if (occupancyPct >= 100) progressColor = 'bg-red-500';

                    return (
                        <div key={room.room_id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group relative">
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm">
                                <button 
                                  onClick={() => handleEditClick(room)}
                                  className="p-1.5 text-slate-500 hover:text-vbci-navy hover:bg-blue-50 rounded-md transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(room.room_id, room.room_name)}
                                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 ${room.type === 'Cabin' ? 'bg-orange-100 text-orange-700' : room.type === 'Tent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            <Home size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{room.room_name}</h3>
                                            <p className="text-xs text-slate-500">{room.type}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${room.gender_restriction === GenderRestriction.MALE ? 'bg-blue-50 text-blue-600' : room.gender_restriction === GenderRestriction.FEMALE ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {room.gender_restriction}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center"><Users size={14} className="mr-1"/> Occupancy</span>
                                        <span className="font-medium text-slate-700">{room.current_occupancy} / {room.capacity}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div className={`h-2.5 rounded-full ${progressColor} transition-all duration-500`} style={{ width: `${occupancyPct}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                <span className="truncate max-w-[70%]">{room.amenities || 'No amenities listed'}</span>
                                <span className={`${room.status === 'Full' ? 'text-red-500' : 'text-green-600'} font-medium`}>
                                    {room.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
                
                {filteredRooms.length === 0 && (
                    <div className="col-span-full text-center p-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center">
                        <Home className="w-12 h-12 mb-3 text-slate-300" />
                        <p className="font-medium text-slate-600">No rooms found</p>
                        <p className="text-sm">
                          {filterStatus === 'All' && filterType === 'All'
                            ? "Start by adding a new room to this camp." 
                            : `No rooms match the current filters.`}
                        </p>
                    </div>
                )}
            </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-vbci-navy p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  placeholder="e.g. Cabin 12 or Dorm A"
                  value={formData.room_name || ''}
                  onChange={(e) => setFormData({...formData, room_name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                    value={formData.type || RoomType.DORM}
                    onChange={(e) => setFormData({...formData, type: e.target.value as RoomType})}
                  >
                    {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender Restriction</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  value={formData.gender_restriction || GenderRestriction.MIXED}
                  onChange={(e) => setFormData({...formData, gender_restriction: e.target.value as GenderRestriction})}
                >
                  {Object.values(GenderRestriction).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amenities</label>
                <textarea 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  rows={3}
                  placeholder="List amenities separated by commas..."
                  value={formData.amenities || ''}
                  onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 border border-slate-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-vbci-gold text-vbci-navy rounded-lg font-bold hover:bg-vbci-goldHover shadow-sm flex items-center transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;