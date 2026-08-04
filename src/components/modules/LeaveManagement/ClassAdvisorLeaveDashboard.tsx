import React, { useState } from 'react';
import { LeaveRequest, User } from '../../../types';
import { calculateAttendanceImpact } from '../../../utils/leaveUtils';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  UserCheck, 
  Paperclip, 
  TrendingDown, 
  FileText,
  AlertCircle,
  Eye,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface ClassAdvisorLeaveDashboardProps {
  currentUser: User;
  leaves: LeaveRequest[];
  onSelectLeave: (leave: LeaveRequest) => void;
  onUpdateLeaveStatus: (
    leaveId: string, 
    newStatus: LeaveRequest['status'], 
    remarks?: string, 
    actionRole?: string
  ) => void;
}

export const ClassAdvisorLeaveDashboard: React.FC<ClassAdvisorLeaveDashboardProps> = ({
  currentUser,
  leaves,
  onSelectLeave,
  onUpdateLeaveStatus
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>('ALL');

  const advisorDept = currentUser.department || 'Computer Science & Engineering';

  // Filter leaves for this advisor's department / assigned students
  const deptLeaves = leaves.filter(l => !l.department || l.department.toLowerCase() === advisorDept.toLowerCase() || advisorDept.includes('Science'));

  const pendingCount = deptLeaves.filter(
    l => l.status === 'Submitted' || l.status === 'Pending' || l.status === 'Advisor Review'
  ).length;

  const hodPendingCount = deptLeaves.filter(l => l.status === 'HOD Approval').length;
  const approvedCount = deptLeaves.filter(l => l.status === 'Approved').length;
  const rejectedCount = deptLeaves.filter(l => l.status === 'Rejected').length;

  // Students on leave today calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const onLeaveTodayCount = deptLeaves.filter(
    l => l.status === 'Approved' && l.startDate <= todayStr && l.endDate >= todayStr
  ).length;

  const filteredLeaves = deptLeaves.filter(l => {
    const matchesSearch = 
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.applicationId || l.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = leaveTypeFilter === 'ALL' || l.type === leaveTypeFilter;

    if (!matchesSearch || !matchesType) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return l.status === 'Submitted' || l.status === 'Pending' || l.status === 'Advisor Review';
    if (statusFilter === 'HOD_PENDING') return l.status === 'HOD Approval';
    if (statusFilter === 'APPROVED') return l.status === 'Approved';
    if (statusFilter === 'REJECTED') return l.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Advisor Approvals Pending</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{pendingCount}</span>
            <span className="text-[11px] text-amber-600 font-medium mt-0.5 block">Requires action</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-purple-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">Escalated to HOD</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{hodPendingCount}</span>
            <span className="text-[11px] text-purple-600 font-medium mt-0.5 block">Long leaves (&gt;3 days)</span>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Approved Requests</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{approvedCount}</span>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">Sanctioned this semester</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-sky-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider block">Students on Leave Today</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{onLeaveTodayCount}</span>
            <span className="text-[11px] text-sky-600 font-medium mt-0.5 block">Absence verified</span>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Class Student Leave Applications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Verify supporting documents and review student attendance impact before approval.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-lg text-xs font-bold">
                Dept: {advisorDept}
              </span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Student Name, Roll No..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="PENDING">Pending Advisor Review ({pendingCount})</option>
              <option value="HOD_PENDING">Pending HOD Review ({hodPendingCount})</option>
              <option value="APPROVED">Approved Requests ({approvedCount})</option>
              <option value="REJECTED">Rejected Requests ({rejectedCount})</option>
              <option value="ALL">All Applications ({deptLeaves.length})</option>
            </select>

            <select
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">All Leave Types</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="On Duty Leave">On Duty Leave</option>
              <option value="Sports Leave">Sports Leave</option>
              <option value="Internship Leave">Internship Leave</option>
              <option value="Emergency Leave">Emergency Leave</option>
            </select>

          </div>
        </div>

        {/* Applications List Table */}
        {filteredLeaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 pl-5">App ID & Student</th>
                  <th className="p-3.5">Leave Type & Reason</th>
                  <th className="p-3.5">Dates & Duration</th>
                  <th className="p-3.5">Attendance Impact</th>
                  <th className="p-3.5">Docs</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredLeaves.map(leave => {
                  const impact = calculateAttendanceImpact(88.33, 120, leave.daysCount);
                  
                  return (
                    <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                      
                      <td className="p-3.5 pl-5">
                        <div className="font-mono text-[11px] font-bold text-sky-700">{leave.applicationId || leave.id}</div>
                        <div className="font-bold text-slate-900 mt-0.5">{leave.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{leave.rollNumber}</div>
                      </td>

                      <td className="p-3.5 max-w-xs">
                        <span className="font-bold text-slate-800 block">{leave.type}</span>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5" title={leave.reason}>
                          {leave.reason}
                        </p>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="font-semibold">{leave.startDate} to {leave.endDate}</div>
                        <div className="text-sky-700 font-bold mt-0.5">{leave.daysCount} Day(s)</div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-slate-700">
                          <span className="font-semibold">{impact.currentPercentage}%</span>
                          <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                          <span className="font-bold text-rose-600">{impact.projectedPercentage}%</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">({impact.impactDrop}% drop)</div>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {leave.supportingDocuments && leave.supportingDocuments.length > 0 ? (
                          <span className="px-2 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-md font-bold text-[10px] flex items-center space-x-1 w-max">
                            <Paperclip className="w-3 h-3" />
                            <span>{leave.supportingDocuments.length} doc</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">None</span>
                        )}
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        {leave.status === 'Approved' && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">Approved</span>
                        )}
                        {leave.status === 'Rejected' && (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-[11px]">Rejected</span>
                        )}
                        {leave.status === 'HOD Approval' && (
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-[11px]">Pending HOD</span>
                        )}
                        {(leave.status === 'Submitted' || leave.status === 'Pending' || leave.status === 'Advisor Review') && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[11px]">Pending Review</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right pr-5 whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-2">
                          {(leave.status === 'Submitted' || leave.status === 'Pending' || leave.status === 'Advisor Review') && (
                            <>
                              <button
                                onClick={() => onUpdateLeaveStatus(leave.id, 'Approved', 'Approved by Class Advisor after attendance verification.', 'Class Advisor')}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                              >
                                {leave.daysCount > 3 ? 'Forward HOD' : 'Approve'}
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => onSelectLeave(leave)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-[11px] transition-colors flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No applications match your filter criteria</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or status filter.</p>
          </div>
        )}

      </div>

    </div>
  );
};
