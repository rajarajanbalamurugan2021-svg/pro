import React, { useState } from 'react';
import { LostFoundItem, UserRole } from '../../../types';
import {
  PackageSearch,
  Plus,
  Search,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  HelpCircle,
  Tag,
  AlertCircle
} from 'lucide-react';

interface LostFoundSystemProps {
  items: LostFoundItem[];
  userRole: UserRole;
  currentUserId: string;
  onAddItem: (item: LostFoundItem) => void;
  onUpdateStatus: (id: string, status: LostFoundItem['status'], claimedBy?: string) => void;
}

export const LostFoundSystem: React.FC<LostFoundSystemProps> = ({
  items,
  userRole,
  currentUserId,
  onAddItem,
  onUpdateStatus
}) => {
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'All' | 'Lost' | 'Found'>('All');
  const [search, setSearch] = useState('');

  // Form State
  const [itemType, setItemType] = useState<'Lost' | 'Found'>('Lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<LostFoundItem['category']>('Electronics');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactEmail, setContactEmail] = useState('student@university.edu');
  const [contactPhone, setContactPhone] = useState('+1 (555) 012-3456');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    const newItem: LostFoundItem = {
      id: `lf-${Date.now()}`,
      type: itemType,
      title,
      description,
      category,
      location,
      date,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      reportedBy: currentUserId,
      contactEmail,
      contactPhone,
      status: 'Open'
    };

    onAddItem(newItem);
    setShowModal(false);
    setTitle('');
    setDescription('');
    setLocation('');
  };

  const filtered = items.filter((item) => {
    if (typeFilter !== 'All' && item.type !== typeFilter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-200">
            <PackageSearch className="h-4 w-4" /> Campus Lost & Found Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Lost & Found Portal
          </h1>
          <p className="text-sm text-emerald-100 mt-1 max-w-xl">
            Report missing belongings, claim discovered items, and facilitate campus community recovery.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-800 text-xs font-extrabold hover:bg-emerald-50 transition shadow-md"
        >
          <Plus className="h-4 w-4" /> Report Lost / Found Item
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2 text-xs font-semibold">
          {['All', 'Lost', 'Found'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t as any)}
              className={`px-4 py-1.5 rounded-full transition ${
                typeFilter === t
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t} Items
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items, library, headphones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            {item.imageUrl && (
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${
                    item.type === 'Lost'
                      ? 'bg-rose-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {item.type} Item
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                  {item.status}
                </span>
              </div>
            )}

            <div className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                {item.description}
              </p>

              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Reported on {item.date}</span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
              <div className="text-[11px] text-slate-400">
                Contact: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.contactEmail}</span>
              </div>

              {item.status === 'Open' && (
                <button
                  onClick={() => onUpdateStatus(item.id, 'Claim Pending', currentUserId)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Claim Item
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* REPORT ITEM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PackageSearch className="h-5 w-5 text-emerald-600" /> Report Lost / Found Item
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="Lost"
                    checked={itemType === 'Lost'}
                    onChange={() => setItemType('Lost')}
                  />
                  I Lost an Item
                </label>
                <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="Found"
                    checked={itemType === 'Found'}
                    onChange={() => setItemType('Found')}
                  />
                  I Found an Item
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Leather Wallet / AirPods Pro in White Case"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include distinct features, brand, color, contents..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="ID Card / Wallet">ID Card / Wallet</option>
                    <option value="Books / Stationery">Books / Stationery</option>
                    <option value="Keys">Keys</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Cafeteria Table 12"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
