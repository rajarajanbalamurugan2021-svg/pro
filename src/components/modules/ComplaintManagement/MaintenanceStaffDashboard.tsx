import React, { useState } from 'react';
import { Complaint } from '../../../types';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Building2,
  MapPin,
  Tag,
  Phone,
  UserCheck,
  ChevronRight,
  Upload,
  FileText
} from 'lucide-react';

interface MaintenanceStaffDashboardProps {
  complaints: Complaint[];
  categories: string[];
  currentUserId: string;
  currentUserName: string;
  onSelectComplaint: (complaint: Complaint) => void;
  onUpdateStatus: (
    id: string,
    newStatus: Complaint['status'],
    notes?: string,
    completionImages?: string[]
  ) => void;
}

export const MaintenanceStaffDashboard: React.FC<MaintenanceStaffDashboardProps> = ({
  complaints,
  categories,
  currentUserId,
  currentUserName,
  onSelectComplaint,
  onUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter complaints assigned to this staff member or all unassigned if general view
  const myAssigned = complaints.filter(
    (c) => c.assignedTo === currentUserId || c.assignedStaffName === currentUserName || !c.assignedTo
  );

  const filtered = myAssigned.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeWork = myAssigned.filter(
    (c) => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Waiting for Parts'
  );
  const completedWork = myAssigned.filter(
    (c) => c.status === 'Completed' || c.status === 'Approved' || c.status === 'Resolved'
  );

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
            <Wrench className="h-4 w-4" /> Campus Facilities & Maintenance Workspace
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Maintenance Staff Work Orders
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
            Welcome, <strong>{currentUserName}</strong>. Inspect assigned maintenance tasks, update repair progress, and upload photo proof of completed work.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white text-center">
            <span className="text-[10px] uppercase font-bold text-amber-100 block">Active Orders</span>
            <span className="text-xl font-black">{activeWork.length}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white text-center">
            <span className="text-[10px] uppercase font-bold text-amber-100 block">Completed</span>
            <span className="text-xl font-black">{completedWork.length}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Work Orders</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {myAssigned.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-blue-500 font-bold uppercase">In Progress</span>
          <div className="text-2xl font-black text-blue-500 mt-1">
            {myAssigned.filter((c) => c.status === 'In Progress').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-amber-500 font-bold uppercase">Waiting Parts</span>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {myAssigned.filter((c) => c.status === 'Waiting for Parts').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-emerald-500 font-bold uppercase">Completed</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {completedWork.length}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by ID or keyword..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Parts">Waiting for Parts</option>
            <option value="Completed">Completed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comp) => (
          <div
            key={comp.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  {comp.id}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    comp.priority === 'Critical' || comp.priority === 'High'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                  }`}
                >
                  {comp.priority} Priority
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {comp.description}
                </p>
              </div>

              {/* Location Tag */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-amber-500" />
                  {comp.blockName || 'Academic Block'} - {comp.floor || 'G-Floor'} ({comp.roomNumber || 'Room'})
                </span>
                <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400">
                  {comp.category}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">
                Status: <strong className="text-slate-800 dark:text-slate-200">{comp.status}</strong>
              </span>

              <button
                onClick={() => onSelectComplaint(comp)}
                className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition flex items-center gap-1"
              >
                Inspect & Update <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
