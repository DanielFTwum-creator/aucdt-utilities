import React, { useState } from 'react';
import { Medication } from '../types';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Calendar, 
  RotateCcw, 
  FilePlus2, 
  PlusCircle, 
  TrendingUp,
  Inbox,
  Clock,
  Coins,
  Pencil,
  Trash2
} from 'lucide-react';

interface InventoryViewProps {
  medications: Medication[];
  onAddMedication: (medication: Medication) => void;
  onUpdateMedication: (medication: Medication) => void;
  onRemoveMedication: (id: string) => void;
  onRestock: (medId: string, qty: number) => void;
  onDiscardExpired: (medId: string) => void;
}

const CATEGORIES = ['All', 'Analgesics', 'Antihistamines', 'Inhalers', 'Gastrointestinal', 'First Aid', 'Supplies', 'Other'];

export default function InventoryView({
  medications,
  onAddMedication,
  onUpdateMedication,
  onRemoveMedication,
  onRestock,
  onDiscardExpired
}: InventoryViewProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterState, setFilterState] = useState<'All' | 'Low Stock' | 'Expired' | 'Overstock'>('All');

  // Edit and Delete state
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New Medication Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Medication['category']>('Analgesics');
  const [newQty, setNewQty] = useState<number>(100);
  const [newUnit, setNewUnit] = useState('tablets');
  const [newThreshold, setNewThreshold] = useState<number>(20);
  const [newBatch, setNewBatch] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newOverStock, setNewOverStock] = useState<number>(500);

  // Quick Restock State
  const [restockItemId, setRestockItemId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState<string>('50');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleEditStart = (med: Medication) => {
    setEditingMedication(med);
    setNewName(med.name);
    setNewCategory(med.category);
    setNewQty(med.quantityOnHand);
    setNewUnit(med.unit);
    setNewThreshold(med.reorderThreshold);
    setNewBatch(med.batchNumber);
    setNewExpiry(med.expiryDate);
    setNewOverStock(med.overStockThreshold);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setEditingMedication(null);
    setNewName('');
    setNewCategory('Analgesics');
    setNewQty(100);
    setNewUnit('tablets');
    setNewThreshold(20);
    setNewBatch('');
    setNewExpiry('');
    setNewOverStock(500);
    setShowAddForm(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUnit || !newExpiry) return;

    if (editingMedication) {
      onUpdateMedication({
        ...editingMedication,
        name: newName,
        category: newCategory,
        quantityOnHand: Number(newQty),
        unit: newUnit,
        reorderThreshold: Number(newThreshold),
        batchNumber: newBatch || `B-GEN-${Math.floor(100 + Math.random()*900)}`,
        expiryDate: newExpiry,
        overStockThreshold: Number(newOverStock)
      });
    } else {
      onAddMedication({
        id: `MED-${Math.floor(100 + Math.random() * 900)}`,
        name: newName,
        category: newCategory,
        quantityOnHand: Number(newQty),
        unit: newUnit,
        reorderThreshold: Number(newThreshold),
        batchNumber: newBatch || `B-GEN-${Math.floor(100 + Math.random()*900)}`,
        expiryDate: newExpiry,
        overStockThreshold: Number(newOverStock)
      });
    }

    // Reset Form
    handleCancelForm();
  };

  const handleQuickRestockSubmit = (id: string) => {
    const qtyNum = parseInt(restockQty);
    if (!isNaN(qtyNum) && qtyNum > 0) {
      onRestock(id, qtyNum);
      setRestockItemId(null);
      setRestockQty('50');
    }
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;

    const isExpired = new Date(med.expiryDate) <= new Date(todayStr);
    const isLowStock = med.quantityOnHand <= med.reorderThreshold;
    const isOverstock = med.quantityOnHand >= med.overStockThreshold;

    const matchesState = 
      filterState === 'All' ||
      (filterState === 'Low Stock' && isLowStock) ||
      (filterState === 'Expired' && isExpired) ||
      (filterState === 'Overstock' && isOverstock);

    return matchesSearch && matchesCategory && matchesState;
  });

  return (
    <div className="space-y-6" id="inventory-tab">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase italic font-display text-slate-900">Pharmacy & Medical Supplies</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase">Monitor reorder thresholds, audit expire timelines, and manage critical school medical stock.</p>
        </div>
        <button
          onClick={() => {
            if (showAddForm) {
              handleCancelForm();
            } else {
              setShowAddForm(true);
            }
          }}
          className="bento-btn bg-[#0f172a] text-white shadow-[3px_3px_0px_rgba(15,23,42,1)] text-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
          id="toggle-add-med-btn"
        >
          <FilePlus2 className="w-4 h-4" /> {editingMedication ? "Edit Active Medicine" : "Register New Medicine"}
        </button>
      </div>

      {/* Add/Edit Medication Form Panel */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border-2 border-slate-900 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-5 shadow-[4px_4px_0px_rgba(15,23,42,1)] animate-fadeIn" id="add-medication-form">
          <div className="md:col-span-4 pb-3 border-b-2 border-slate-900">
            <h3 className="font-black uppercase text-slate-900 text-sm md:text-base">
              {editingMedication ? `Modify Details: ${editingMedication.id}` : "Register Medicine / Consumable"}
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase">
              {editingMedication ? "Update medication specifications, reorder limits, and batch information." : "Record batch codes and expiry dates to automatically trace quality controls."}
            </p>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-600 uppercase block">Medicine / Supply Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Paracetamol 500mg"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Medication['category'])}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            >
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">
              {editingMedication ? "Quantity on Hand" : "Initial Quantity"}
            </label>
            <input
              type="number"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value))}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Unit Type</label>
            <input
              type="text"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder="e.g. tablets, bottles, rolls"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Low Stock Threshold</label>
            <input
              type="number"
              value={newThreshold}
              onChange={(e) => setNewThreshold(Number(e.target.value))}
              placeholder="Reorder point"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Over-stock Threshold</label>
            <input
              type="number"
              value={newOverStock}
              onChange={(e) => setNewOverStock(Number(e.target.value))}
              placeholder="Max hold target"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 uppercase block">Batch Code</label>
            <input
              type="text"
              value={newBatch}
              onChange={(e) => setNewBatch(e.target.value)}
              placeholder="e.g. B-ST2026"
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-600 uppercase block">Expiration Date</label>
            <input
              type="date"
              value={newExpiry}
              onChange={(e) => setNewExpiry(e.target.value)}
              className="w-full py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)] text-slate-700"
              required
            />
          </div>

          <div className="md:col-span-4 flex justify-end gap-3 pt-3 border-t-2 border-slate-900">
            <button
              type="button"
              onClick={handleCancelForm}
              className="bento-btn bg-white border-2 border-slate-900 text-slate-700 shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bento-btn bento-btn-emerald shadow-[2px_2px_0px_rgba(15,23,42,1)] text-xs font-black"
            >
              {editingMedication ? "✓ Update Supply" : "✓ Save Medicine"}
            </button>
          </div>
        </form>
      )}

      {/* Filter and search layout */}
      <div className="flex flex-col md:flex-row gap-3 items-center" id="inventory-filters">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medications by name or batch code..."
            className="w-full pl-10 pr-4 py-3 border-2 border-slate-900 rounded-xl text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-bold shadow-[2px_2px_0px_rgba(15,23,42,1)]"
          />
        </div>

        {/* Categories Tab selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 py-2.5 px-3 bg-white border-2 border-slate-900 rounded-xl text-xs font-black text-slate-700 focus:outline-none shadow-[2px_2px_0px_rgba(15,23,42,1)]"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
          ))}
        </select>

        {/* State Alerts Toggles */}
        <div className="grid grid-cols-4 gap-1 bg-white border-2 border-slate-900 p-1 rounded-xl w-full md:w-auto text-[10px] md:text-xs font-bold shrink-0 shadow-[2px_2px_0px_rgba(15,23,42,1)]">
          {(['All', 'Low Stock', 'Expired', 'Overstock'] as const).map(state => (
            <button
              key={state}
              onClick={() => setFilterState(state)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterState === state ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table & Cards */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0px_rgba(15,23,42,1)]" id="inventory-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="inventory-table">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-4 px-5">Medication Info</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Quantity on Hand</th>
                <th className="py-4 px-5">Expiry Date</th>
                <th className="py-4 px-5">Control Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 text-sm">
              {filteredMedications.map(med => {
                const isExpired = new Date(med.expiryDate) <= new Date(todayStr);
                const isLow = med.quantityOnHand <= med.reorderThreshold;
                const isOver = med.quantityOnHand >= med.overStockThreshold;

                let statusBadge = null;
                if (isExpired) {
                  statusBadge = <span className="bento-badge border-2 border-slate-900 bg-rose-100 text-rose-800 text-[9px] font-black uppercase">Expired</span>;
                } else if (isLow) {
                  statusBadge = <span className="bento-badge border-2 border-slate-900 bg-amber-100 text-amber-800 text-[9px] font-black uppercase">Low Stock</span>;
                } else if (isOver) {
                  statusBadge = <span className="bento-badge border-2 border-slate-900 bg-blue-100 text-blue-800 text-[9px] font-black uppercase">Overstock</span>;
                } else {
                  statusBadge = <span className="bento-badge border-2 border-slate-900 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">Secure</span>;
                }

                return (
                  <tr key={med.id} className="hover:bg-slate-50/50 transition-colors" id={`med-row-${med.id}`}>
                    <td className="py-4 px-5 space-y-0.5">
                      <div className="font-black text-slate-800 text-sm uppercase">{med.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono font-bold">Batch: {med.batchNumber} • ID: {med.id}</div>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-500 text-xs uppercase">
                      {med.category}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-base ${isLow ? 'text-amber-600 font-display' : 'text-slate-800'}`}>
                          {med.quantityOnHand}
                        </span>
                        <span className="text-xs text-slate-400 font-black uppercase">{med.unit}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">POINT: {med.reorderThreshold} {med.unit}</div>
                    </td>
                    <td className="py-4 px-5 space-y-2">
                      <div className={`text-xs font-black flex items-center gap-1 ${isExpired ? 'text-rose-600' : 'text-slate-600'}`}>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {med.expiryDate}
                      </div>
                      {statusBadge}
                    </td>
                    <td className="py-4 px-5">
                      {restockItemId === med.id ? (
                        <div className="flex items-center gap-1.5 animate-fadeIn" id={`restock-actions-${med.id}`}>
                          <input
                            type="number"
                            value={restockQty}
                            onChange={(e) => setRestockQty(e.target.value)}
                            className="w-16 py-1 px-2 border-2 border-slate-900 rounded-lg text-xs font-black focus:outline-none"
                          />
                          <button
                            onClick={() => handleQuickRestockSubmit(med.id)}
                            className="bento-btn bento-btn-emerald py-1 px-2.5 text-xs font-black"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setRestockItemId(null)}
                            className="bento-btn bg-white border-2 border-slate-900 text-slate-500 py-1 px-2.5 text-xs font-black"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 items-center">
                          <button
                            onClick={() => {
                              setRestockItemId(med.id);
                              setRestockQty('50');
                            }}
                            className="bento-btn bg-white border-2 border-slate-900 hover:bg-slate-50 transition-colors text-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-slate-500" /> Restock
                          </button>

                          <button
                            onClick={() => handleEditStart(med)}
                            className="bento-btn bg-white border-2 border-slate-900 hover:bg-slate-50 transition-colors text-slate-700 text-xs font-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-500" /> Edit
                          </button>

                          {deleteConfirmId === med.id ? (
                            <div className="flex items-center gap-1.5 bg-rose-50 border-2 border-slate-900 px-2 py-1 rounded-xl animate-fadeIn shadow-[2px_2px_0px_rgba(15,23,42,1)]" id={`delete-actions-${med.id}`}>
                              <span className="text-[10px] font-black text-rose-700 uppercase">Sure?</span>
                              <button
                                onClick={() => {
                                  onRemoveMedication(med.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg border border-slate-900 text-[10px] font-black cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-900 text-[10px] font-black cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(med.id)}
                              className="bento-btn bg-rose-50 border-2 border-slate-900 hover:bg-rose-100 transition-colors text-rose-800 text-xs font-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                            </button>
                          )}

                          {isExpired && (
                            <button
                              onClick={() => onDiscardExpired(med.id)}
                              className="bento-btn bg-rose-100 border-2 border-slate-900 hover:bg-rose-200 transition-colors text-rose-800 text-xs font-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_rgba(15,23,42,1)]"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-rose-600" /> Discard
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredMedications.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-black uppercase">
                    No medications found matching selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
