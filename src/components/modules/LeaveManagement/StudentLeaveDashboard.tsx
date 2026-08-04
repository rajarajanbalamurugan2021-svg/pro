import React, { useState } from 'react';
import { LeaveRequest, LeaveTypeConfig, User } from '../../../types';
import { printLeaveLetter } from '../../../utils/leaveUtils';
import { 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Printer, 
  ChevronRight, 
  Filter, 
  Paperclip,
  TrendingDown,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface StudentLeaveDashboardProps {
  currentUser: User;
  leaves: LeaveRequest[];
  leaveTypes: LeaveTypeConfig[];
  onOpenApplyModal: () => void;
  onSelectLeave: (leave: LeaveRequest) => void;
  onDeleteOrCancelLeave: (leaveId: string) => void;
}

export const StudentLeaveDashboard: React.FC<StudentLeaveDashboardProps> = ({
  currentUser,
  leaves,
  leaveTypes,
  onOpenApplyModal,
  onSelectLeave,
  onDeleteOrCancelLeave
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter leaves for this student
  const studentLeaves = leaves.filter(
    l => l.studentId === currentUser.id || l.studentName === currentUser.name
  );

  const totalApps = studentLeaves.length;
  const approvedCount = studentLeaves.filter(l => l.status === 'Approved').length;
  const pendingCount = studentLeaves.filter(
    l => l.status === 'Submitted' || l.status === 'Pending' || l.status === 'Advisor Review' || l.status === 'HOD Approval'
  ).length;
  const rejectedCount = studentLeaves.filter(l => l.status === 'Rejected').length;
  const draftsCount = studentLeaves.filter(l => l.status === 'Draft').length;

  // Calculate used days per type
  const getUsedDaysForType = (typeName: string) => {
    return studentLeaves
      .filter(l => l.type === typeName && l.status === 'Approved')
      .reduce((sum, l) => sum + (l.daysCount || 1), 0);
  };

  const filteredLeaves = studentLeaves.filter(l => {
    const matchesSearch = 
      (l.applicationId || l.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'APPROVED') return matchesSearch && l.status === 'Approved';
    if (statusFilter === 'PENDING') return matchesSearch && (l.status === 'Submitted' || l.status === 'Pending' || l.status === 'Advisor Review' || l.status === 'HOD Approval');
    if (statusFilter === 'DRAFT') return matchesSearch && l.status === 'Draft';
    if (statusFilter === 'REJECTED') return matchesSearch && l.status === 'Rejected';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Primary Action */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Student Leave Exemption Portal</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Apply for academic, medical, or event leaves, track real-time advisor and HOD approvals, and download official sanction letters.
            </p>
          </div>

          <button
            onClick={onOpenApplyModal}
            className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Apply for Leave</span>
          </button>
        </div>

        {/* Quick Stat Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <span className="text-slate-400 text-[11px] font-medium block">Total Applications</span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">{totalApps}</span>
          </div>

          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <span className="text-amber-300 text-[11px] font-medium block">In Review / Pending</span>
            <span className="text-xl font-extrabold text-amber-300 mt-0.5 block">{pendingCount}</span>
          </div>

          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <span className="text-emerald-400 text-[11px] font-medium block">Approved Sanctions</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block">{approvedCount}</span>
          </div>

          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <span className="text-rose-400 text-[11px] font-medium block">Rejected Requests</span>
            <span className="text-xl font-extrabold text-rose-400 mt-0.5 block">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Leave Balances Grid */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Semester Leave Balances & Limits</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaveTypes.slice(0, 4).map(type => {
            const used = getUsedDaysForType(type.name || type.leaveTypeName);
            const max = type.maxDays || 10;
            const remaining = Math.max(0, max - used);
            const pct = Math.min(100, Math.round((used / max) * 100));

            return (
              <div key={type.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 hover:border-sky-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{type.name || type.leaveTypeName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    Max {max}d
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{remaining}</span>
                    <span className="text-xs text-slate-500 font-medium ml-1">Days Left</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{used} used</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-500' : 'bg-sky-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application List & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Leave Type, or reason..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: `All (${studentLeaves.length})` },
              { id: 'PENDING', label: `In Review (${pendingCount})` },
              { id: 'APPROVED', label: `Approved (${approvedCount})` },
              { id: 'DRAFT', label: `Drafts (${draftsCount})` },
              { id: 'REJECTED', label: `Rejected (${rejectedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Applications List */}
        {filteredLeaves.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredLeaves.map(leave => (
              <div 
                key={leave.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => onSelectLeave(leave)}>
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-sky-700">{leave.applicationId || leave.id}</span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-md">
                      {leave.type}
                    </span>

                    {/* Status Badge */}
                    {leave.status === 'Approved' && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Approved</span>
                      </span>
                    )}
                    {leave.status === 'Rejected' && (
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full flex items-center space-x-1">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Rejected</span>
                      </span>
                    )}
                    {(leave.status === 'Submitted' || leave.status === 'Pending' || leave.status === 'Advisor Review' || leave.status === 'HOD Approval') && (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>In Review</span>
                      </span>
                    )}
                    {leave.status === 'Draft' && (
                      <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
                        Draft
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-1">
                    {leave.reason}
                  </p>

                  <div className="flex items-center space-x-4 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{leave.startDate} to {leave.endDate}</span>
                    </span>
                    <span className="font-bold text-slate-700">{leave.daysCount} Day(s)</span>
                    {leave.supportingDocuments && leave.supportingDocuments.length > 0 && (
                      <span className="flex items-center space-x-1 text-sky-600 font-semibold">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{leave.supportingDocuments.length} doc(s)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0">
                  {leave.status === 'Approved' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        printLeaveLetter(leave);
                      }}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                      title="Print Official Sanction Order"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Letter</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectLeave(leave)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No leave applications found</p>
            <p className="text-xs text-slate-400">Click "Apply for Leave" above to submit a new leave request.</p>
          </div>
        )}

      </div>

    </div>
  );
};
