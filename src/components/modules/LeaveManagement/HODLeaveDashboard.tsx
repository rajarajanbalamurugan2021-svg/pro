import React, { useState } from 'react';
import { LeaveRequest, User } from '../../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Building,
  Users,
  FileText,
  Eye,
  Calendar
} from 'lucide-react';

interface HODLeaveDashboardProps {
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

export const HODLeaveDashboard: React.FC<HODLeaveDashboardProps> = ({
  currentUser,
  leaves,
  onSelectLeave,
  onUpdateLeaveStatus
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'ESCALATED' | 'ALL' | 'APPROVED' | 'REJECTED'>('ESCALATED');

  const deptName = currentUser.department || 'Computer Science & Engineering';

  // Filter leaves for this department
  const deptLeaves = leaves.filter(l => !l.department || l.department.toLowerCase() === deptName.toLowerCase() || deptName.includes('Science'));

  const escalatedCount = deptLeaves.filter(
    l => l.status === 'HOD Approval' || (l.daysCount > 3 && (l.status === 'Submitted' || l.status === 'Pending' || l.status === 'Advisor Review'))
  ).length;

  const totalApproved = deptLeaves.filter(l => l.status === 'Approved').length;
  const totalRejected = deptLeaves.filter(l => l.status === 'Rejected').length;

  // Monthly trends data for Recharts
  const monthlyData = [
    { month: 'Apr', count: 12 },
    { month: 'May', count: 18 },
    { month: 'Jun', count: 9 },
    { month: 'Jul', count: 24 },
    { month: 'Aug', count: deptLeaves.length }
  ];

  // Leave Type Breakdown for Recharts
  const typeCounts: Record<string, number> = {};
  deptLeaves.forEach(l => {
    typeCounts[l.type] = (typeCounts[l.type] || 0) + 1;
  });

  const pieData = Object.keys(typeCounts).map(type => ({
    name: type,
    value: typeCounts[type]
  }));

  const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

  const filteredLeaves = deptLeaves.filter(l => {
    const matchesSearch = 
      l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.applicationId || l.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'ESCALATED') {
      return l.status === 'HOD Approval' || (l.daysCount > 3 && l.status !== 'Approved' && l.status !== 'Rejected');
    }
    if (filterMode === 'APPROVED') return l.status === 'Approved';
    if (filterMode === 'REJECTED') return l.status === 'Rejected';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Department Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">HOD Action Queue</span>
            <ShieldCheck className="w-5 h-5 text-purple-300" />
          </div>
          <div className="text-3xl font-black mt-2">{escalatedCount}</div>
          <span className="text-[11px] text-purple-200 mt-1 block">Long-term / escalated leaves (&gt;3d)</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sanctions</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalApproved}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Department approved applications</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Rejections</span>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalRejected}</div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Declined applications</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Dept Attendance</span>
            <TrendingUp className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-sky-900 mt-2">87.4%</div>
          <span className="text-[11px] text-sky-600 font-semibold mt-1 block">Stable academic status</span>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Leave Applications Trend</h3>
              <p className="text-xs text-slate-500">Department of {deptName}</p>
            </div>
            <span className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-lg">2026 Academic Year</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Type Breakdown Pie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Leave Type Distribution</h3>
            <p className="text-xs text-slate-500">Category breakdown</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No data available</div>
            )}
          </div>
        </div>

      </div>

      {/* Main Department Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Controls */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student name, roll number, or application ID..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterMode('ESCALATED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterMode === 'ESCALATED' ? 'bg-purple-700 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              HOD Escalations ({escalatedCount})
            </button>
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterMode === 'ALL' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              All Requests ({deptLeaves.length})
            </button>
            <button
              onClick={() => setFilterMode('APPROVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterMode === 'APPROVED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              Approved ({totalApproved})
            </button>
          </div>

        </div>

        {/* Table */}
        {filteredLeaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 pl-5">Application & Student</th>
                  <th className="p-3.5">Leave Type & Details</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Advisor Status</th>
                  <th className="p-3.5">HOD Status</th>
                  <th className="p-3.5 text-right pr-5">HOD Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="p-3.5 pl-5">
                      <span className="font-mono font-bold text-sky-700 text-[11px]">{leave.applicationId || leave.id}</span>
                      <div className="font-bold text-slate-900 mt-0.5">{leave.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{leave.rollNumber}</div>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <span className="font-bold text-slate-900 block">{leave.type}</span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5" title={leave.reason}>{leave.reason}</p>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold">{leave.startDate} to {leave.endDate}</div>
                      <div className="text-purple-700 font-bold mt-0.5">{leave.daysCount} Day(s)</div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold text-[11px]">
                        Advisor Verified
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {leave.status === 'Approved' ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px]">HOD Approved</span>
                      ) : leave.status === 'Rejected' ? (
                        <span className="px-2 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-[11px]">HOD Rejected</span>
                      ) : (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-[11px]">Pending HOD Sign-off</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right pr-5 whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        {leave.status !== 'Approved' && leave.status !== 'Rejected' && (
                          <button
                            onClick={() => onUpdateLeaveStatus(leave.id, 'Approved', 'Approved by Head of Department.', 'HOD')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Approve HOD
                          </button>
                        )}

                        <button
                          onClick={() => onSelectLeave(leave)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-[11px] transition-colors flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No applications match selected view filter</p>
            <p className="text-xs text-slate-400">All escalated long-term leave requests have been reviewed.</p>
          </div>
        )}

      </div>

    </div>
  );
};
