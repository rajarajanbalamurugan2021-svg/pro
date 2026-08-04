import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  Printer,
  RefreshCw,
  Filter,
  ArrowUpDown,
  Check,
  X,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shield,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../types';
import { normalizeRole } from '../../lib/rbac';
import { CampusStorage } from '../../services/api';

export interface CrudColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: string[];
  render?: (item: T) => React.ReactNode;
}

export interface CrudFieldSchema<T> {
  key: keyof T | string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'boolean' | 'email';
  options?: string[];
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  readOnly?: boolean;
}

export interface CrudManagerProps<T extends { id: string; status?: string; isDeleted?: boolean }> {
  title: string;
  subtitle?: string;
  entityName: string;
  items: T[];
  columns: CrudColumn<T>[];
  fields: CrudFieldSchema<T>[];
  userRole: UserRole;
  currentUserName?: string;
  onSaveItem: (item: T, isEdit: boolean) => void;
  onDeleteItem: (ids: string[], isPermanent?: boolean) => void;
  onRestoreItem?: (id: string) => void;
  onStatusToggle?: (id: string, newStatus: string) => void;
  filterCategories?: { key: keyof T; label: string; options: string[] }[];
  exportFileName?: string;
  customActions?: (item: T) => React.ReactNode;
}

export function CrudManager<T extends { id: string; status?: string; isDeleted?: boolean; [key: string]: any }>({
  title,
  subtitle,
  entityName,
  items,
  columns,
  fields,
  userRole,
  currentUserName = 'System User',
  onSaveItem,
  onDeleteItem,
  onRestoreItem,
  onStatusToggle,
  filterCategories = [],
  exportFileName,
  customActions
}: CrudManagerProps<T>) {
  const normRole = normalizeRole(userRole);
  const isSuperAdmin = normRole === 'super_admin';
  const isAdmin = normRole === 'admin' || isSuperAdmin;

  // Search, Filter, Sort, Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showTrash, setShowTrash] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [importRawText, setImportRawText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered and Sorted list
  const processedItems = useMemo(() => {
    return items
      .filter((item) => {
        // Soft delete filtering
        if (showTrash) {
          if (!item.isDeleted) return false;
        } else {
          if (item.isDeleted) return false;
        }

        // Status Filter
        if (statusFilter !== 'all') {
          if (item.status?.toLowerCase() !== statusFilter.toLowerCase()) return false;
        }

        // Custom Category Filters
        for (const [key, value] of Object.entries(activeFilters)) {
          if (value && value !== 'all') {
            const itemVal = item[key];
            if (itemVal === undefined || itemVal === null || String(itemVal).toLowerCase() !== String(value).toLowerCase()) {
              return false;
            }
          }
        }

        // Search Term
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchFields = columns.some((col) => {
            const val = item[col.key as string];
            return val ? String(val).toLowerCase().includes(query) : false;
          });
          const idMatch = item.id ? String(item.id).toLowerCase().includes(query) : false;
          const nameMatch = item.name ? String(item.name).toLowerCase().includes(query) : false;
          const titleMatch = item.title ? String(item.title).toLowerCase().includes(query) : false;
          if (!matchFields && !idMatch && !nameMatch && !titleMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [items, showTrash, statusFilter, activeFilters, searchTerm, sortKey, sortOrder, columns]);

  // Paginated items
  const totalPages = Math.ceil(processedItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedItems.slice(start, start + pageSize);
  }, [processedItems, currentPage, pageSize]);

  // Handlers
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedItems.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleOpenAdd = () => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.key as string] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setFormData(initial);
    setSelectedItem(null);
    setFormErrors({});
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (item: T) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setFormErrors({});
    setIsAddEditOpen(true);
  };

  const handleOpenView = (item: T) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.required && !formData[f.key as string]) {
        errors[f.key as string] = `${f.label} is required.`;
      }
      if (f.type === 'email' && formData[f.key as string]) {
        if (!/\S+@\S+\.\S+/.test(formData[f.key as string])) {
          errors[f.key as string] = 'Invalid email address.';
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const isEdit = !!selectedItem;
    const now = new Date().toLocaleString();

    const updatedItem: T = {
      ...(selectedItem || {}),
      ...formData,
      id: selectedItem?.id || `${entityName.toLowerCase()}-${Date.now()}`,
      updatedAt: now,
      updatedBy: currentUserName,
      ...(isEdit ? {} : { createdAt: now, createdBy: currentUserName, isDeleted: false })
    } as T;

    onSaveItem(updatedItem, isEdit);

    CampusStorage.addAuditLog(
      isEdit ? `UPDATE_${entityName.toUpperCase()}` : `CREATE_${entityName.toUpperCase()}`,
      currentUserName,
      userRole,
      `ID: ${updatedItem.id}`
    );

    setIsAddEditOpen(false);
    showToast(`${entityName} ${isEdit ? 'updated' : 'created'} successfully!`);
  };

  const handleConfirmDelete = (ids: string[], permanent = false) => {
    setDeleteTargetIds(ids);
    setIsPermanentDelete(permanent);
    setIsDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    onDeleteItem(deleteTargetIds, isPermanentDelete);
    CampusStorage.addAuditLog(
      isPermanentDelete ? `PERMANENT_DELETE_${entityName.toUpperCase()}` : `SOFT_DELETE_${entityName.toUpperCase()}`,
      currentUserName,
      userRole,
      `IDs: ${deleteTargetIds.join(', ')}`
    );
    setSelectedIds((prev) => prev.filter((id) => !deleteTargetIds.includes(id)));
    setIsDeleteConfirmOpen(false);
    showToast(`${deleteTargetIds.length} ${entityName}(s) ${isPermanentDelete ? 'permanently deleted' : 'moved to trash'}.`);
  };

  const handleRestore = (id: string) => {
    if (onRestoreItem) {
      onRestoreItem(id);
      CampusStorage.addAuditLog(`RESTORE_${entityName.toUpperCase()}`, currentUserName, userRole, `ID: ${id}`);
      showToast(`${entityName} restored successfully!`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const fileName = exportFileName || `${entityName}_Export_${Date.now()}.csv`;
    const headers = columns.map((c) => `"${c.label}"`).join(',');
    const rows = processedItems.map((item) =>
      columns
        .map((c) => {
          const val = item[c.key as string];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${processedItems.length} records to CSV.`);
  };

  // Export JSON/Excel Simulation
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(processedItems, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `${entityName}_Data_${Date.now()}.json`);
    dlAnchorElem.click();
    showToast(`Exported ${processedItems.length} records to JSON.`);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // CSV Import execution
  const handleImportSubmit = () => {
    try {
      const lines = importRawText.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus('CSV must contain a header line and at least one data row.');
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const newItems: T[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        const itemObj: any = {
          id: `${entityName.toLowerCase()}-imp-${Date.now()}-${i}`,
          createdAt: new Date().toLocaleString(),
          createdBy: currentUserName,
          isDeleted: false
        };
        headers.forEach((h, idx) => {
          if (values[idx] !== undefined) {
            itemObj[h] = values[idx];
          }
        });
        newItems.push(itemObj as T);
      }

      newItems.forEach((item) => onSaveItem(item, false));
      CampusStorage.addAuditLog(`BULK_IMPORT_${entityName.toUpperCase()}`, currentUserName, userRole, `Count: ${newItems.length}`);
      setIsImportOpen(false);
      setImportRawText('');
      setImportStatus(null);
      showToast(`Successfully imported ${newItems.length} new ${entityName} records.`);
    } catch (err) {
      setImportStatus('Error parsing CSV. Please check formatting.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-white text-xs font-semibold animate-bounce transition-all ${
            toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
            {showTrash && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/50">
                Trash View ({processedItems.length})
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {/* Action Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add New Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New {entityName}</span>
          </button>

          {/* Import CSV */}
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
            title="Import from CSV"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={handleExportCSV}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-xs font-semibold transition"
              title="Export CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleExportJSON}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-xs font-semibold transition"
              title="Export JSON"
            >
              <FileText className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-xs font-semibold transition"
              title="Print Page"
            >
              <Printer className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Trash Toggle for SuperAdmin/Admin */}
          {isAdmin && (
            <button
              onClick={() => {
                setShowTrash(!showTrash);
                setSelectedIds([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition ${
                showTrash
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{showTrash ? 'Exit Trash' : 'Trash'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${entityName.toLowerCase()}s...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          {/* Dynamic Filter Categories */}
          {filterCategories.map((fc) => (
            <select
              key={fc.key as string}
              value={activeFilters[fc.key as string] || 'all'}
              onChange={(e) => {
                setActiveFilters({ ...activeFilters, [fc.key as string]: e.target.value });
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All {fc.label}</option>
              {fc.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}

          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          {/* Bulk Selection Bar if active */}
          {selectedIds.length > 0 && (
            <button
              onClick={() => handleConfirmDelete(selectedIds, showTrash && isSuperAdmin)}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition animate-fade-in"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedItems.length > 0 && selectedIds.length === paginatedItems.length}
                    onChange={handleSelectAll}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {columns.map((col) => (
                  <th key={col.key as string} className="p-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition" onClick={() => handleSort(col.key as string)}>
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </div>
                  </th>
                ))}
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Filter className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                      <p className="font-semibold text-xs">No records found matching your filters.</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setActiveFilters({});
                        }}
                        className="mt-2 text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition ${
                      selectedIds.includes(item.id) ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key as string} className="p-4 font-medium text-slate-700 dark:text-slate-200">
                        {col.render ? col.render(item) : String(item[col.key as string] ?? '—')}
                      </td>
                    ))}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Status Toggle */}
                        {onStatusToggle && !showTrash && (
                          <button
                            onClick={() => onStatusToggle(item.id, item.status === 'active' ? 'inactive' : 'active')}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                              item.status === 'active' || item.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                            title="Toggle Status"
                          >
                            {item.status || 'Active'}
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => handleOpenView(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Edit */}
                        {!showTrash && (
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}

                        {/* Restore (In Trash View) */}
                        {showTrash && (
                          <button
                            onClick={() => handleRestore(item.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Restore"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}

                        {/* Custom Actions */}
                        {customActions && customActions(item)}

                        {/* Delete */}
                        <button
                          onClick={() => handleConfirmDelete([item.id], showTrash && isSuperAdmin)}
                          className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-lg transition"
                          title={showTrash ? 'Permanent Delete' : 'Move to Trash'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{processedItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, processedItems.length)}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{processedItems.length}</span> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 font-bold text-slate-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedItem ? `Edit ${entityName}` : `Add New ${entityName}`}
              </h3>
              <button onClick={() => setIsAddEditOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {fields.map((f) => (
                <div key={f.key as string} className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>

                  {f.type === 'select' ? (
                    <select
                      value={formData[f.key as string] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key as string]: e.target.value })}
                      disabled={f.readOnly}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select {f.label}</option>
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[f.key as string] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key as string]: e.target.value })}
                      placeholder={f.placeholder}
                      readOnly={f.readOnly}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                      value={formData[f.key as string] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key as string]: e.target.value })}
                      placeholder={f.placeholder}
                      readOnly={f.readOnly}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  )}

                  {formErrors[f.key as string] && <p className="text-[10px] font-bold text-red-500">{formErrors[f.key as string]}</p>}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20">
                Save {entityName}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{entityName} Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {Object.entries(selectedItem).map(([k, v]) => {
                if (typeof v === 'object' || k === 'isDeleted') return null;
                return (
                  <div key={k} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase text-slate-400">{k}</p>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-words">{String(v ?? 'N/A')}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog before Delete */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4 text-center">
            <div className="h-12 w-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/80 flex items-center justify-center text-red-600 dark:text-red-400 ring-8 ring-red-50 dark:ring-red-950/30">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isPermanentDelete ? 'Permanently Delete Records?' : 'Move Records to Trash?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to {isPermanentDelete ? 'permanently delete' : 'move to trash'} {deleteTargetIds.length} {entityName}(s)?
              {!isPermanentDelete && ' Items in trash can be restored by a Super Admin.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button onClick={executeDelete} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-500/20">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Import {entityName}s via CSV</h3>
              <button onClick={() => setIsImportOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste raw CSV text below with comma-separated headers matching your entity fields.
            </p>

            <textarea
              rows={6}
              value={importRawText}
              onChange={(e) => setImportRawText(e.target.value)}
              placeholder={`code,name,department,status\nCSE101,Computer Science,CSE,active\nECE102,Electronics,ECE,active`}
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {importStatus && <p className="text-xs font-bold text-red-500">{importStatus}</p>}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button onClick={handleImportSubmit} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow">
                Import CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
