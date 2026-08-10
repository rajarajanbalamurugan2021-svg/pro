import React, { useState, useEffect } from 'react';
import {
  CmsCategoryKey,
  BaseCmsItem,
  EngineeringBranch,
  ContentStatus,
  CmsAuditLog
} from '../../../types/coreEngineeringCms';
import {
  fetchCmsItems,
  saveCmsItem,
  softDeleteCmsItem,
  restoreCmsItem,
  togglePublishCmsItem,
  performBulkCmsAction,
  seedAllCoreCmsDataToFirestore
} from '../../../services/coreEngineeringService';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  Upload,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Target,
  Wrench,
  GraduationCap,
  Briefcase,
  FileSpreadsheet,
  Globe,
  Shield,
  Activity,
  FileText,
  Clock,
  UserCheck,
  CheckSquare,
  Square,
  ArrowUpDown,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface CoreEngineeringCMSProps {
  currentUser: { id: string; name: string; role: string; email?: string };
  onClose?: () => void;
}

const CATEGORIES_LIST: { key: CmsCategoryKey; label: string; icon: any; color: string }[] = [
  { key: 'branches', label: 'Engineering Branches', icon: Cpu, color: 'text-blue-500 bg-blue-500/10' },
  { key: 'domains', label: 'Engineering Domains', icon: Layers, color: 'text-purple-500 bg-purple-500/10' },
  { key: 'skills', label: 'Skills & Progression', icon: Sparkles, color: 'text-amber-500 bg-amber-500/10' },
  { key: 'embedded', label: 'Embedded Systems', icon: Cpu, color: 'text-emerald-500 bg-emerald-500/10' },
  { key: 'tools', label: 'Software & Simulators', icon: Wrench, color: 'text-indigo-500 bg-indigo-500/10' },
  { key: 'vlsi', label: 'VLSI & Silicon Design', icon: Cpu, color: 'text-cyan-500 bg-cyan-500/10' },
  { key: 'careers', label: 'Core Career Roles', icon: Briefcase, color: 'text-teal-500 bg-teal-500/10' },
  { key: 'roadmaps', label: 'Career Roadmaps', icon: Activity, color: 'text-rose-500 bg-rose-500/10' },
  { key: 'projects', label: 'Core Projects', icon: Target, color: 'text-orange-500 bg-orange-500/10' },
  { key: 'gate_subjects', label: 'GATE Subjects', icon: BookOpen, color: 'text-blue-600 bg-blue-600/10' },
  { key: 'gate_questions', label: 'GATE Question Bank', icon: Target, color: 'text-purple-600 bg-purple-600/10' },
  { key: 'gate_mock_tests', label: 'GATE Mock Tests', icon: Activity, color: 'text-indigo-600 bg-indigo-600/10' },
  { key: 'gate_study_plans', label: 'GATE Study Plans', icon: Clock, color: 'text-green-600 bg-green-600/10' },
  { key: 'higher_studies', label: 'Higher Studies & MS', icon: GraduationCap, color: 'text-sky-500 bg-sky-500/10' },
  { key: 'research', label: 'Research Opportunities', icon: GraduationCap, color: 'text-pink-500 bg-pink-500/10' },
  { key: 'internships', label: 'Core Internships', icon: Briefcase, color: 'text-emerald-600 bg-emerald-600/10' },
  { key: 'companies', label: 'Core Companies', icon: Globe, color: 'text-slate-500 bg-slate-500/10' },
  { key: 'certifications', label: 'Certifications', icon: CheckCircle2, color: 'text-violet-500 bg-violet-500/10' },
  { key: 'blogs', label: 'Technical Blogs', icon: FileText, color: 'text-amber-600 bg-amber-600/10' },
  { key: 'learning_resources', label: 'Learning Resources', icon: BookOpen, color: 'text-teal-600 bg-teal-600/10' },
  { key: 'installation_guides', label: 'Software Setup Guides', icon: Wrench, color: 'text-blue-700 bg-blue-700/10' }
];

export const CoreEngineeringCMS: React.FC<CoreEngineeringCMSProps> = ({ currentUser, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<CmsCategoryKey>('tools');
  const [items, setItems] = useState<BaseCmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<EngineeringBranch>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ContentStatus | 'DELETED'>('ALL');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  
  // Modals
  const [viewingItem, setViewingItem] = useState<BaseCmsItem | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<BaseCmsItem> | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form input state for JSON/Text representation
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadCategoryItems();
  }, [activeCategory, statusFilter]);

  const loadCategoryItems = async () => {
    setLoading(true);
    try {
      const includeDeleted = statusFilter === 'DELETED' || statusFilter === 'ALL';
      const fetched = await fetchCmsItems(activeCategory, includeDeleted);
      setItems(fetched);
    } catch (err) {
      console.error('Error loading CMS category items:', err);
      showToast('Failed to load items from Firestore', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Seed all default Core Engineering records into Firestore? Existing records will be updated safely.')) return;
    setSeeding(true);
    try {
      const count = await seedAllCoreCmsDataToFirestore(currentUser);
      showToast(`Successfully seeded ${count} Core Engineering records to Firestore!`, 'success');
      await loadCategoryItems();
    } catch (err) {
      showToast('Error seeding database', 'error');
    } finally {
      setSeeding(false);
    }
  };

  // Item Actions
  const handleTogglePublish = async (item: BaseCmsItem) => {
    const nextState = item.status !== 'PUBLISHED';
    await togglePublishCmsItem(activeCategory, item.id, nextState, currentUser);
    showToast(`Item ${nextState ? 'published' : 'unpublished'} successfully.`, 'success');
    await loadCategoryItems();
  };

  const handleSoftDelete = async (item: BaseCmsItem) => {
    if (!window.confirm(`Are you sure you want to delete "${getItemTitle(item)}"? You can restore it later.`)) return;
    await softDeleteCmsItem(activeCategory, item.id, currentUser);
    showToast('Item moved to deleted items.', 'info');
    await loadCategoryItems();
  };

  const handleRestore = async (item: BaseCmsItem) => {
    await restoreCmsItem(activeCategory, item.id, currentUser);
    showToast('Item restored successfully.', 'success');
    await loadCategoryItems();
  };

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItemIds(filteredItems.map(i => i.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete' | 'restore') => {
    if (selectedItemIds.length === 0) return;
    if (!window.confirm(`Apply bulk ${action} to ${selectedItemIds.length} items?`)) return;

    await performBulkCmsAction(activeCategory, selectedItemIds, action, currentUser);
    showToast(`Bulk ${action} completed for ${selectedItemIds.length} records.`, 'success');
    setSelectedItemIds([]);
    await loadCategoryItems();
  };

  // CSV Export
  const handleExportCSV = () => {
    if (filteredItems.length === 0) {
      showToast('No items to export', 'info');
      return;
    }
    const headers = Object.keys(filteredItems[0]).filter(k => typeof filteredItems[0][k] !== 'object');
    const csvRows = [
      headers.join(','),
      ...filteredItems.map(item =>
        headers.map(h => `"${String((item as any)[h] || '').replace(/"/g, '""')}"`).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CKCET_Core_${activeCategory}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('CSV export downloaded successfully', 'success');
  };

  // Save Item from Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveCmsItem(activeCategory, formData, currentUser);
      showToast(`Record saved successfully to ${activeCategory}!`, 'success');
      setIsCreateModalOpen(false);
      setEditingItem(null);
      setFormData({});
      await loadCategoryItems();
    } catch (err) {
      showToast('Failed to save record', 'error');
    }
  };

  const openCreateModal = () => {
    const defaultData: Record<string, any> = {
      branch: 'ECE',
      status: 'PUBLISHED',
      createdAt: new Date().toISOString()
    };
    if (activeCategory === 'tools') {
      defaultData.name = '';
      defaultData.license = 'Open Source / Free';
      defaultData.skillLevel = 'Intermediate';
      defaultData.operatingSystem = 'Windows / Linux';
      defaultData.systemRequirements = '8GB RAM, Dual-core CPU';
      defaultData.officialWebsite = 'https://';
      defaultData.officialDocs = 'https://';
    } else if (activeCategory === 'skills') {
      defaultData.skillName = '';
      defaultData.level = 'Industry Ready';
      defaultData.description = '';
    } else {
      defaultData.title = '';
      defaultData.description = '';
    }
    setFormData(defaultData);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (item: BaseCmsItem) => {
    setFormData({ ...item });
    setEditingItem(item);
    setIsCreateModalOpen(true);
  };

  // Helper for rendering record titles dynamically
  const getItemTitle = (item: any): string => {
    return item.name || item.title || item.skillName || item.domainName || item.testTitle || item.companyName || item.certName || item.softwareName || item.topic || item.subjectName || item.question || `Record ${item.id}`;
  };

  // Filtering
  const filteredItems = items.filter(item => {
    const matchesSearch = getItemTitle(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = branchFilter === 'ALL' || (item as any).branch === branchFilter || (item as any).branch === 'ALL';

    const matchesStatus =
      statusFilter === 'ALL' ? !item.isDeleted :
      statusFilter === 'DELETED' ? item.isDeleted :
      !item.isDeleted && item.status === statusFilter;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Calculate Summary Stats
  const totalCount = items.filter(i => !i.isDeleted).length;
  const publishedCount = items.filter(i => !i.isDeleted && i.status === 'PUBLISHED').length;
  const draftCount = items.filter(i => !i.isDeleted && i.status === 'DRAFT').length;
  const deletedCount = items.filter(i => i.isDeleted).length;

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-500/20 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="h-3.5 w-3.5" /> Core Content Management System (CMS)
            </div>
            <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
              Manage Core Engineering Platform Data
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Full CRUD control for ECE, EEE, Mechanical, Civil domains, GATE, tools, research, careers, internships, and learning resources stored live in Cloud Firestore.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg disabled:opacity-50"
            >
              <Database className="h-4 w-4" /> {seeding ? 'Seeding Database...' : 'Seed Firestore DB'}
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg"
            >
              <Plus className="h-4 w-4" /> Add New Record
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Close CMS
              </button>
            )}
          </div>
        </div>

        {/* Category Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Active Records</p>
            <p className="text-xl font-black text-white mt-1">{totalCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[10px] uppercase font-bold text-emerald-400">Published</p>
            <p className="text-xl font-black text-emerald-300 mt-1">{publishedCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-[10px] uppercase font-bold text-amber-400">Drafts</p>
            <p className="text-xl font-black text-amber-300 mt-1">{draftCount}</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-[10px] uppercase font-bold text-rose-400">Soft Deleted</p>
            <p className="text-xl font-black text-rose-300 mt-1">{deletedCount}</p>
          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg transition ${
          notification.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' :
          notification.type === 'error' ? 'bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300' :
          'bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Category Tab Switcher */}
      <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto flex items-center gap-2 no-scrollbar">
        {CATEGORIES_LIST.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setSelectedItemIds([]);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeCategory.replace('_', ' ')}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Branch & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value as EngineeringBranch)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
          >
            <option value="ALL">All Branches</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">Mechanical</option>
            <option value="CIVIL">Civil</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none"
          >
            <option value="ALL">All Active</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
            <option value="DELETED">Trash (Deleted)</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
            title="Export filtered table to CSV"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>

          <button
            onClick={loadCategoryItems}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Refresh Firestore"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bulk Operations Toolbar (Appears when items are checked) */}
      {selectedItemIds.length > 0 && (
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
            {selectedItemIds.length} records selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
            >
              Bulk Publish
            </button>
            <button
              onClick={() => handleBulkAction('unpublish')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition"
            >
              Bulk Unpublish
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition"
            >
              Bulk Delete
            </button>
            <button
              onClick={() => handleBulkAction('restore')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition"
            >
              Bulk Restore
            </button>
          </div>
        </div>
      )}

      {/* Main Table View */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-blue-500" />
            <p className="text-xs font-bold">Syncing with Cloud Firestore...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Database className="h-10 w-10 mx-auto opacity-40 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No items match your query or category filters in Firestore.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" /> Add New {activeCategory}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedItemIds.length === filteredItems.length && filteredItems.length > 0}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="p-4">Title / Name</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Domain / Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredItems.map(item => {
                  const isSelected = selectedItemIds.includes(item.id);
                  const title = getItemTitle(item);
                  const branch = (item as any).branch || 'ALL';
                  const domain = (item as any).domain || (item as any).category || (item as any).subject || 'Core';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      } ${item.isDeleted ? 'opacity-60 bg-rose-50/20' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded border-slate-300"
                        />
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 max-w-md truncate">
                          <span>{title}</span>
                          {(item as any).licenseNote && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-extrabold whitespace-nowrap">
                              License Notice
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-sm">
                          ID: {item.id}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {branch}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[150px]">
                        {domain}
                      </td>

                      <td className="p-4">
                        {item.isDeleted ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            DELETED
                          </span>
                        ) : item.status === 'PUBLISHED' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            PUBLISHED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            DRAFT
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-slate-400 text-[11px]">
                        <div>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px]">{item.updatedBy || 'System'}</div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingItem(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition"
                            title="View Full Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {!item.isDeleted && (
                            <>
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition"
                                title="Edit Record"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => handleTogglePublish(item)}
                                className={`p-1.5 rounded-lg transition ${
                                  item.status === 'PUBLISHED'
                                    ? 'hover:bg-amber-100 text-emerald-600 hover:text-amber-600'
                                    : 'hover:bg-emerald-100 text-amber-600 hover:text-emerald-600'
                                }`}
                                title={item.status === 'PUBLISHED' ? 'Unpublish Item' : 'Publish Item'}
                              >
                                {item.status === 'PUBLISHED' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              </button>

                              <button
                                onClick={() => handleSoftDelete(item)}
                                className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition"
                                title="Soft Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {item.isDeleted && (
                            <button
                              onClick={() => handleRestore(item)}
                              className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950 text-rose-600 hover:text-emerald-600 transition"
                              title="Restore Record"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Item Detail Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {getItemTitle(viewingItem)}
              </h3>
              <button
                onClick={() => setViewingItem(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {Object.entries(viewingItem).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                      <span className="font-bold text-slate-500 uppercase text-[10px]">{key}:</span>
                      <pre className="text-[11px] text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">{key}:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100 break-all">{String(value)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Record Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveForm}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {editingItem ? 'Edit Content Record' : `Create New ${activeCategory.replace('_', ' ')}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Common Title/Name field */}
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || formData.title || formData.skillName || formData.domainName || formData.testTitle || formData.companyName || formData.certName || formData.softwareName || ''}
                  onChange={e => {
                    const val = e.target.value;
                    if (activeCategory === 'tools') setFormData(p => ({ ...p, name: val }));
                    else if (activeCategory === 'skills') setFormData(p => ({ ...p, skillName: val }));
                    else if (activeCategory === 'domains') setFormData(p => ({ ...p, domainName: val }));
                    else if (activeCategory === 'companies') setFormData(p => ({ ...p, companyName: val }));
                    else if (activeCategory === 'certifications') setFormData(p => ({ ...p, certName: val }));
                    else setFormData(p => ({ ...p, title: val }));
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  placeholder="Enter title or name..."
                />
              </div>

              {/* Branch */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Branch</label>
                <select
                  value={formData.branch || 'ECE'}
                  onChange={e => setFormData(p => ({ ...p, branch: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                  <option value="ALL">All Branches</option>
                </select>
              </div>

              {/* Domain / Category */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Domain / Category</label>
                <input
                  type="text"
                  value={formData.domain || formData.category || ''}
                  onChange={e => setFormData(p => ({ ...p, domain: e.target.value, category: e.target.value }))}
                  placeholder="Embedded, VLSI, CAD, Power Electronics..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description / Overview</label>
                <textarea
                  rows={3}
                  value={formData.description || formData.purpose || formData.useCases || ''}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value, purpose: e.target.value, useCases: e.target.value }))}
                  placeholder="Provide detailed information..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              {/* Tools Specific Fields */}
              {activeCategory === 'tools' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">License Type</label>
                    <select
                      value={formData.license || 'Open Source / Free'}
                      onChange={e => setFormData(p => ({ ...p, license: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    >
                      <option value="Open Source / Free">Open Source / Free</option>
                      <option value="Commercial (Institutional License)">Commercial (Institutional License)</option>
                      <option value="Freemium / Academic">Freemium / Academic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Operating System</label>
                    <input
                      type="text"
                      value={formData.operatingSystem || ''}
                      onChange={e => setFormData(p => ({ ...p, operatingSystem: e.target.value }))}
                      placeholder="Windows 11, Linux, macOS"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Download Link (URL)</label>
                    <input
                      type="url"
                      value={formData.officialWebsite || ''}
                      onChange={e => setFormData(p => ({ ...p, officialWebsite: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                    />
                  </div>
                </>
              )}

              {/* Status */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Publication Status</label>
                <select
                  value={formData.status || 'PUBLISHED'}
                  onChange={e => setFormData(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                >
                  <option value="PUBLISHED">Published (Visible to Students)</option>
                  <option value="DRAFT">Draft (Admin Only)</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
