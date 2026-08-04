import React, { useState } from 'react';
import { Complaint } from '../../../types';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Search,
  UserCheck,
  BarChart2,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ReportExporter } from './ReportExporter';

interface DepartmentHeadDashboardProps {
  complaints: Complaint[];
  categories: string[];
  currentDepartment: string;
  currentUserName: string;
  availableStaff: { id: string; name: string; phone: string; department: string }[];
  onSelectComplaint: (complaint: Complaint) => void;
  onAssignStaff: (id: string, staffId: string, staffName: string, staffPhone?: string) => void;
  onApproveComplaint: (id: string) => void;
}

export const DepartmentHeadDashboard: React.FC<DepartmentHeadDashboardProps> = ({
  complaints,
  categories,
  currentDepartment,
  currentUserName,
  availableStaff,
  onSelectComplaint,
  onAssignStaff,
  onApproveComplaint
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');

  // Department complaints
  const deptComplaints = complaints.filter(
    (c) => c.department === currentDepartment || !c.department
  );

  const filtered = deptComplaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleConfirmAssign = (complaintId: string) => {
    if (!selectedStaffId) return;
    const staffObj = availableStaff.find((s) => s.id === selectedStaffId);
    if (staffObj) {
      onAssignStaff(complaintId, staffObj.id, staffObj.name, staffObj.phone);
      setAssigningId(null);
      setSelectedStaffId('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> Department Administration & Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Department Head Complaint Control
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Department: <strong>{currentDepartment}</strong> | Monitor grievance resolution, assign technicians, approve work completion, and download compliance reports.
          </p>
        </div>

        {/* Download Reports Button Group */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => ReportExporter.exportToPDF(deptComplaints, `${currentDepartment} Complaint Report`)}
            className="px-3.5 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold hover:bg-white/30 transition flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Export PDF
          </button>
          <button
            onClick={() => ReportExporter.exportToExcel(deptComplaints, `${currentDepartment}_Complaints.xls`)}
            className="px-3.5 py-2 rounded-xl bg-white text-emerald-950 text-xs font-bold hover:bg-emerald-50 transition flex items-center gap-1.5 shadow-md"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel
          </button>
          <button
            onClick={() => ReportExporter.exportToCSV(deptComplaints, `${currentDepartment}_Complaints.csv`)}
            className="px-3.5 py-2 rounded-xl bg-emerald-900 text-white text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Dept Grievances</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {deptComplaints.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-amber-500 font-bold uppercase">Unassigned / Pending</span>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {deptComplaints.filter((c) => !c.assignedTo || c.status === 'New Complaint').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-blue-500 font-bold uppercase">Awaiting HOD Approval</span>
          <div className="text-2xl font-black text-blue-500 mt-1">
            {deptComplaints.filter((c) => c.status === 'Completed').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-emerald-500 font-bold uppercase">Approved & Resolved</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {deptComplaints.filter((c) => c.status === 'Approved' || c.status === 'Resolved').length}
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
            placeholder="Search by student, ID, or title..."
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
            <option value="New Complaint">New Complaint</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed (Pending Approval)</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints Table / List */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider">
              <th className="p-4">Complaint ID</th>
              <th className="p-4">Student & Details</th>
              <th className="p-4">Category & Priority</th>
              <th className="p-4">Assigned Staff</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((comp) => (
              <tr key={comp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {comp.id}
                </td>
                <td className="p-4 max-w-xs">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {comp.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    By {comp.studentName} ({comp.blockName || 'Academic Block'})
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {comp.category}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      comp.priority === 'Critical' || comp.priority === 'High'
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {comp.priority} Priority
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  {comp.assignedStaffName ? (
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" /> {comp.assignedStaffName}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold italic">Unassigned</span>
                  )}
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      comp.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                        : comp.status === 'Resolved' || comp.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {comp.status}
                  </span>
                </td>
                <td className="p-4 text-right whitespace-nowrap space-x-2">
                  
                  {/* Approve button if Completed */}
                  {comp.status === 'Completed' && (
                    <button
                      onClick={() => onApproveComplaint(comp.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      Approve Work
                    </button>
                  )}

                  {/* Assign Staff Inline Toggle */}
                  {assigningId === comp.id ? (
                    <div className="inline-flex items-center gap-1">
                      <select
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                        className="text-xs p-1 rounded-lg border border-slate-300 dark:border-slate-700"
                      >
                        <option value="">Staff...</option>
                        {availableStaff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleConfirmAssign(comp.id)}
                        className="px-2 py-1 rounded-lg bg-blue-600 text-white font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setAssigningId(null)}
                        className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAssigningId(comp.id);
                        setSelectedStaffId(comp.assignedTo || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                    >
                      {comp.assignedTo ? 'Reassign' : 'Assign'}
                    </button>
                  )}

                  <button
                    onClick={() => onSelectComplaint(comp)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
