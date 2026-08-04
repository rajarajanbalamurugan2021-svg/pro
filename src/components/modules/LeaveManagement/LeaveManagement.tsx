import React, { useState, useEffect } from 'react';
import { LeaveRequest, UserRole, User, LeaveTypeConfig, AcademicHoliday, LeavePolicyConfig } from '../../../types';
import { CampusStorage } from '../../../services/api';
import { StudentLeaveDashboard } from './StudentLeaveDashboard';
import { ClassAdvisorLeaveDashboard } from './ClassAdvisorLeaveDashboard';
import { HODLeaveDashboard } from './HODLeaveDashboard';
import { AdminLeavePolicyPanel } from './AdminLeavePolicyPanel';
import { ApplyLeaveModal } from './ApplyLeaveModal';
import { LeaveDetailModal } from './LeaveDetailModal';
import { LeaveReportsExporter } from './LeaveReportsExporter';
import { 
  CalendarDays, 
  UserCheck, 
  ShieldCheck, 
  Settings, 
  User as UserIcon, 
  Sparkles, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface LeaveManagementProps {
  leaves: LeaveRequest[];
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  currentUser?: User;
  onApplyLeave: (leave: LeaveRequest) => void;
  onApproveRejectLeave: (id: string, status: 'Approved' | 'Rejected', notes?: string) => void;
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({
  leaves,
  userRole,
  currentUserId,
  currentUserName,
  currentUser: propUser,
  onApplyLeave,
  onApproveRejectLeave
}) => {
  // Synthesize current user if not passed
  const currentUser: User = propUser || {
    id: currentUserId,
    name: currentUserName,
    email: `${currentUserName.toLowerCase().replace(/\s+/g, '.')}@ckcet.edu`,
    role: userRole,
    department: 'Computer Science & Engineering',
    phone: '+1 (555) 012-3456',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  };

  // State for Leave Types, Holidays, and Policy Config
  const [leaveTypes, setLeaveTypes] = useState<LeaveTypeConfig[]>([]);
  const [holidays, setHolidays] = useState<AcademicHoliday[]>([]);
  const [policy, setPolicy] = useState<LeavePolicyConfig>({
    hodApprovalThresholdDays: 3,
    maxLeaveDaysPerSemester: 15,
    enableParentSMS: true,
    autoApproveOnDutyEvent: false,
    academicYear: '2026-2027'
  });

  // Role override tab state (allows easy view-switching for testing and role previews)
  const [activeRoleView, setActiveRoleView] = useState<'STUDENT' | 'ADVISOR' | 'HOD' | 'ADMIN'>(() => {
    if (userRole === 'admin' || userRole === 'super_admin') return 'ADMIN';
    if (userRole === 'department_head') return 'HOD';
    if (userRole === 'faculty' || userRole === 'mentor') return 'ADVISOR';
    return 'STUDENT';
  });

  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isExporterOpen, setIsExporterOpen] = useState<boolean>(false);

  // Load leave configuration from CampusStorage on mount
  useEffect(() => {
    setLeaveTypes(CampusStorage.getLeaveTypes());
    setHolidays(CampusStorage.getHolidays());
    setPolicy(CampusStorage.getLeavePolicy());
  }, []);

  // Sync state helpers
  const handleSaveLeaveTypes = (types: LeaveTypeConfig[]) => {
    setLeaveTypes(types);
    CampusStorage.saveLeaveTypes(types);
  };

  const handleSaveHolidays = (hols: AcademicHoliday[]) => {
    setHolidays(hols);
    CampusStorage.saveHolidays(hols);
  };

  const handleSavePolicy = (pol: LeavePolicyConfig) => {
    setPolicy(pol);
    CampusStorage.saveLeavePolicy(pol);
  };

  // Save new leave application (Draft or Submitted)
  const handleSaveLeave = (newLeave: LeaveRequest, isDraft: boolean) => {
    onApplyLeave(newLeave);
    CampusStorage.addAuditLog(
      isDraft ? 'Saved Leave Draft' : 'Submitted Leave Request',
      currentUserName,
      userRole,
      newLeave.applicationId || newLeave.id
    );
  };

  // Update leave status (Approve, Reject, Request Info)
  const handleUpdateLeaveStatus = (
    leaveId: string, 
    newStatus: LeaveRequest['status'], 
    remarks?: string, 
    actionRole?: string
  ) => {
    // Call parent handler
    if (newStatus === 'Approved' || newStatus === 'Rejected') {
      onApproveRejectLeave(leaveId, newStatus, remarks);
    }

    // Update local state & storage for rich workflow features
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updatedLeaves = leaves.map(l => {
      if (l.id === leaveId) {
        const timeline = l.timeline || [];
        const newTimelineEntry = {
          status: newStatus === 'Approved' ? `Approved by ${actionRole || 'Authority'}` : newStatus === 'Rejected' ? `Rejected by ${actionRole || 'Authority'}` : newStatus,
          actorName: currentUserName,
          actorRole: actionRole || userRole,
          timestamp: formattedTimestamp,
          note: remarks
        };

        return {
          ...l,
          status: newStatus,
          lastUpdated: formattedTimestamp,
          approvedDate: newStatus === 'Approved' ? formattedTimestamp : l.approvedDate,
          advisorRemarks: actionRole === 'Class Advisor' ? remarks : l.advisorRemarks,
          hodRemarks: actionRole === 'HOD' ? remarks : l.hodRemarks,
          timeline: [...timeline, newTimelineEntry]
        };
      }
      return l;
    });

    CampusStorage.saveLeaveRequests(updatedLeaves);
    CampusStorage.addAuditLog(
      `Updated Leave Status to ${newStatus}`,
      currentUserName,
      userRole,
      leaveId
    );
  };

  // Handle Delete / Cancel Request
  const handleDeleteOrCancelLeave = (leaveId: string) => {
    const updated = leaves.filter(l => l.id !== leaveId);
    CampusStorage.saveLeaveRequests(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Main Module Header with Role View Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl ring-1 ring-sky-500/30">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">CKCET CAMPRO Enterprise ERP</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full">
                  Real-time Firestore Sync
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                Leave Management & Attendance Exemption System
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsExporterOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center space-x-2 self-start md:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Reports & Analytics</span>
          </button>
        </div>

        {/* Role Portal View Selector */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-medium">
            Active Portal Perspective:
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveRoleView('STUDENT')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeRoleView === 'STUDENT'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => setActiveRoleView('ADVISOR')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeRoleView === 'ADVISOR'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Class Advisor Portal</span>
            </button>

            <button
              onClick={() => setActiveRoleView('HOD')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeRoleView === 'HOD'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HOD Portal</span>
            </button>

            <button
              onClick={() => setActiveRoleView('ADMIN')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeRoleView === 'ADMIN'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Policies</span>
            </button>
          </div>
        </div>

      </div>

      {/* RENDER ACTIVE ROLE VIEW */}
      {activeRoleView === 'STUDENT' && (
        <StudentLeaveDashboard
          currentUser={currentUser}
          leaves={leaves}
          leaveTypes={leaveTypes}
          onOpenApplyModal={() => setIsApplyModalOpen(true)}
          onSelectLeave={(l) => {
            setSelectedLeave(l);
            setIsDetailModalOpen(true);
          }}
          onDeleteOrCancelLeave={handleDeleteOrCancelLeave}
        />
      )}

      {activeRoleView === 'ADVISOR' && (
        <ClassAdvisorLeaveDashboard
          currentUser={currentUser}
          leaves={leaves}
          onSelectLeave={(l) => {
            setSelectedLeave(l);
            setIsDetailModalOpen(true);
          }}
          onUpdateLeaveStatus={handleUpdateLeaveStatus}
        />
      )}

      {activeRoleView === 'HOD' && (
        <HODLeaveDashboard
          currentUser={currentUser}
          leaves={leaves}
          onSelectLeave={(l) => {
            setSelectedLeave(l);
            setIsDetailModalOpen(true);
          }}
          onUpdateLeaveStatus={handleUpdateLeaveStatus}
        />
      )}

      {activeRoleView === 'ADMIN' && (
        <AdminLeavePolicyPanel
          leaveTypes={leaveTypes}
          holidays={holidays}
          policy={policy}
          allLeaves={leaves}
          onSaveLeaveTypes={handleSaveLeaveTypes}
          onSaveHolidays={handleSaveHolidays}
          onSavePolicy={handleSavePolicy}
          onOpenReportExporter={() => setIsExporterOpen(true)}
        />
      )}

      {/* MODALS */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        currentUser={currentUser}
        leaveTypes={leaveTypes}
        existingLeaves={leaves}
        onSaveLeave={handleSaveLeave}
      />

      <LeaveDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
        currentUser={currentUser}
        onUpdateLeaveStatus={handleUpdateLeaveStatus}
        onDeleteOrCancelLeave={handleDeleteOrCancelLeave}
      />

      <LeaveReportsExporter
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
        leaves={leaves}
      />

    </div>
  );
};
