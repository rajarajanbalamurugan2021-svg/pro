import React, { useState, useEffect } from 'react';
import { Complaint, UserRole, User, ComplaintCategoryItem } from '../../../types';
import { StudentComplaintDashboard } from './StudentComplaintDashboard';
import { MaintenanceStaffDashboard } from './MaintenanceStaffDashboard';
import { DepartmentHeadDashboard } from './DepartmentHeadDashboard';
import { AdminComplaintDashboard } from './AdminComplaintDashboard';
import { ComplaintDetailModal } from './ComplaintDetailModal';
import {
  ShieldAlert,
  UserCheck,
  Building2,
  Wrench,
  GraduationCap,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ComplaintManagementModuleProps {
  complaints: Complaint[];
  userRole: UserRole;
  currentUser: User | null;
  users?: User[];
  onAddComplaint: (complaint: Complaint) => void;
  onUpdateComplaintStatus: (id: string, newStatus: Complaint['status'], assignedTo?: string) => void;
  onAddToast?: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

const DEFAULT_CATEGORIES: ComplaintCategoryItem[] = [
  { id: 'cat-1', name: 'Electrical Issues', description: 'Power failures, flickering lights, damaged switches, circuit breakers.' },
  { id: 'cat-2', name: 'Water Leakage', description: 'Cooler leaks, roof seepage, pipe bursts, bathroom water issues.' },
  { id: 'cat-3', name: 'Plumbing Problems', description: 'Blocked drains, tap damage, flush failures, pipe blockages.' },
  { id: 'cat-4', name: 'Internet/WiFi Issues', description: 'Router offline, slow bandwidth, signal drops in labs or hostel.' },
  { id: 'cat-5', name: 'Smart Classroom Issues', description: 'Projector display issues, audio mic failure, podium connections.' },
  { id: 'cat-6', name: 'Laboratory Equipment Issues', description: 'Hardware fault, CRO, oscilloscope, microprocessor kit malfunction.' },
  { id: 'cat-7', name: 'Hostel Complaints', description: 'Furniture damage, cleanliness, mess food issues, fan noise.' },
  { id: 'cat-8', name: 'Transportation Issues', description: 'College bus delay, AC breakdown, seat repair, route issue.' },
  { id: 'cat-9', name: 'Cleanliness Issues', description: 'Dustbin overflow, classroom floor sweeping, restroom sanitation.' },
  { id: 'cat-10', name: 'Security Issues', description: 'CCTV offline, gate security, unauthorized entry, lost key locks.' }
];

const INITIAL_STAFF = [
  { id: 'u-staff-1', name: 'Marcus Vance (Estate Lead)', phone: '+1 (555) 019-2233', department: 'Estate & Infrastructure' },
  { id: 'u-staff-2', name: 'David Miller (IT Networks)', phone: '+1 (555) 018-4455', department: 'IT Network Infrastructure' },
  { id: 'u-staff-3', name: 'Elena Rostova (Electrical)', phone: '+1 (555) 017-6677', department: 'Electrical Maintenance Cell' },
  { id: 'u-staff-4', name: 'Samuel Jackson (Plumbing)', phone: '+1 (555) 016-8899', department: 'Sanitation & Plumbing' }
];

export const ComplaintManagementModule: React.FC<ComplaintManagementModuleProps> = ({
  complaints: initialComplaints,
  userRole,
  currentUser,
  users: initialUsers = [],
  onAddComplaint,
  onUpdateComplaintStatus,
  onAddToast
}) => {
  const [complaintsList, setComplaintsList] = useState<Complaint[]>(initialComplaints);
  const [usersList, setUsersList] = useState<User[]>(initialUsers);
  const [categoriesList, setCategoriesList] = useState<ComplaintCategoryItem[]>(DEFAULT_CATEGORIES);
  
  // Active Role Simulation Switcher
  const [simulatedRole, setSimulatedRole] = useState<UserRole>(userRole);
  
  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    setComplaintsList(initialComplaints);
  }, [initialComplaints]);

  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) {
      setUsersList(initialUsers);
    }
  }, [initialUsers]);

  const currentUserId = currentUser?.id || 'usr-student-1';
  const currentUserName = currentUser?.name || 'Alex Rivera';
  const currentDepartment = currentUser?.department || 'Computer Science & Engineering';

  // Handle Add New Complaint
  const handleAddComplaint = (newComp: Complaint) => {
    setComplaintsList((prev) => [newComp, ...prev]);
    onAddComplaint(newComp);
    if (onAddToast) {
      onAddToast(
        'Grievance Filed Successfully',
        `Complaint #${newComp.id} has been logged and queued for department dispatch.`,
        'success'
      );
    }
  };

  // Handle Update Status with Notes & Timeline
  const handleUpdateStatus = (
    id: string,
    newStatus: Complaint['status'],
    notes?: string,
    completionImages?: string[]
  ) => {
    setComplaintsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newTimeline = [
            ...(c.timeline || []),
            {
              status: `Status updated to ${newStatus}`,
              updatedBy: currentUserName,
              timestamp: new Date().toLocaleString(),
              note: notes || undefined
            }
          ];

          const updatedComp: Complaint = {
            ...c,
            status: newStatus,
            maintenanceNotes: notes ? `${c.maintenanceNotes || ''}\n[${new Date().toLocaleTimeString()}] ${notes}` : c.maintenanceNotes,
            completionImages: completionImages && completionImages.length > 0 ? completionImages : c.completionImages,
            updatedAt: new Date().toLocaleString(),
            resolvedAt: newStatus === 'Resolved' || newStatus === 'Approved' ? new Date().toLocaleString() : c.resolvedAt,
            timeline: newTimeline
          };

          if (selectedComplaint?.id === id) {
            setSelectedComplaint(updatedComp);
          }

          return updatedComp;
        }
        return c;
      })
    );

    onUpdateComplaintStatus(id, newStatus);

    if (onAddToast) {
      onAddToast(
        'Complaint Progress Updated',
        `Complaint #${id} is now updated to '${newStatus}'.`,
        'info'
      );
    }
  };

  // Handle Assign Staff
  const handleAssignStaff = (id: string, staffId: string, staffName: string, staffPhone?: string) => {
    setComplaintsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newTimeline = [
            ...(c.timeline || []),
            {
              status: `Assigned to ${staffName}`,
              updatedBy: currentUserName,
              timestamp: new Date().toLocaleString()
            }
          ];

          const updatedComp: Complaint = {
            ...c,
            status: 'Assigned',
            assignedTo: staffId,
            assignedStaffName: staffName,
            assignedStaffPhone: staffPhone,
            updatedAt: new Date().toLocaleString(),
            timeline: newTimeline
          };

          if (selectedComplaint?.id === id) {
            setSelectedComplaint(updatedComp);
          }

          return updatedComp;
        }
        return c;
      })
    );

    if (onAddToast) {
      onAddToast(
        'Staff Assigned',
        `Technician ${staffName} assigned to Complaint #${id}.`,
        'success'
      );
    }
  };

  // Handle Student Feedback
  const handleStudentFeedback = (id: string, rating: number, feedback: string) => {
    setComplaintsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedComp: Complaint = {
            ...c,
            rating,
            feedback,
            updatedAt: new Date().toLocaleString()
          };
          if (selectedComplaint?.id === id) {
            setSelectedComplaint(updatedComp);
          }
          return updatedComp;
        }
        return c;
      })
    );

    if (onAddToast) {
      onAddToast('Feedback Recorded', 'Thank you for rating our campus maintenance service!', 'success');
    }
  };

  // Handle Reopen
  const handleReopen = (id: string, reason: string) => {
    handleUpdateStatus(id, 'Reopened', `Reopened by student: ${reason}`);
    if (onAddToast) {
      onAddToast('Complaint Reopened', `Complaint #${id} reopened for re-inspection.`, 'warning');
    }
  };

  // Category Manager
  const handleAddCategory = (cat: ComplaintCategoryItem) => {
    setCategoriesList((prev) => [...prev, cat]);
    if (onAddToast) {
      onAddToast('Category Created', `New category '${cat.name}' added to system.`, 'success');
    }
  };

  const handleDeleteCategory = (catId: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
  };

  // Role Manager
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (onAddToast) {
      onAddToast('User Role Updated', `Role updated for user.`, 'info');
    }
  };

  const handleAddUser = (newUser: User) => {
    setUsersList((prev) => [...prev, newUser]);
    if (onAddToast) {
      onAddToast('User Added', `User '${newUser.name}' created as ${newUser.role}.`, 'success');
    }
  };

  const categoryNames = categoriesList.map((c) => c.name);

  return (
    <div className="space-y-6">
      
      {/* Role View Simulator Bar */}
      <div className="p-3 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-blue-600 font-extrabold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> AI Module Control
          </span>
          <span className="text-slate-300 font-medium hidden md:inline">
            Logged in as: <strong>{currentUserName}</strong> ({userRole})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-400 font-bold mr-1 shrink-0">Simulate View:</span>
          
          <button
            onClick={() => setSimulatedRole('student')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              simulatedRole === 'student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 inline mr-1" /> Student
          </button>

          <button
            onClick={() => setSimulatedRole('maintenance_staff')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              simulatedRole === 'maintenance_staff'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wrench className="h-3.5 w-3.5 inline mr-1" /> Maintenance
          </button>

          <button
            onClick={() => setSimulatedRole('department_head')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              simulatedRole === 'department_head'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 inline mr-1" /> Dept Head
          </button>

          <button
            onClick={() => setSimulatedRole('super_admin')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              simulatedRole === 'super_admin' || simulatedRole === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 inline mr-1" /> Admin
          </button>
        </div>
      </div>

      {/* Render Active Dashboard Based on Simulated Role */}
      {simulatedRole === 'student' && (
        <StudentComplaintDashboard
          complaints={complaintsList}
          categories={categoryNames}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onAddComplaint={handleAddComplaint}
          onSelectComplaint={(c) => setSelectedComplaint(c)}
        />
      )}

      {simulatedRole === 'maintenance_staff' && (
        <MaintenanceStaffDashboard
          complaints={complaintsList}
          categories={categoryNames}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onSelectComplaint={(c) => setSelectedComplaint(c)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {simulatedRole === 'department_head' && (
        <DepartmentHeadDashboard
          complaints={complaintsList}
          categories={categoryNames}
          currentDepartment={currentDepartment}
          currentUserName={currentUserName}
          availableStaff={INITIAL_STAFF}
          onSelectComplaint={(c) => setSelectedComplaint(c)}
          onAssignStaff={handleAssignStaff}
          onApproveComplaint={(id) => handleUpdateStatus(id, 'Approved', 'Approved by Department Head')}
        />
      )}

      {(simulatedRole === 'admin' || simulatedRole === 'super_admin' || simulatedRole === 'faculty' || simulatedRole === 'mentor') && (
        <AdminComplaintDashboard
          complaints={complaintsList}
          users={usersList}
          categories={categoriesList}
          currentUserName={currentUserName}
          onSelectComplaint={(c) => setSelectedComplaint(c)}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onUpdateUserRole={handleUpdateUserRole}
          onAddUser={handleAddUser}
          onBroadcastAnnouncement={(title, content) => {
            if (onAddToast) {
              onAddToast('System Announcement Broadcasted', title, 'alert');
            }
          }}
        />
      )}

      {/* Complaint Detail & Workflow Tracker Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          userRole={simulatedRole}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          onClose={() => setSelectedComplaint(null)}
          onUpdateStatus={handleUpdateStatus}
          onAssignStaff={handleAssignStaff}
          onStudentFeedback={handleStudentFeedback}
          onReopen={handleReopen}
          availableStaff={INITIAL_STAFF}
        />
      )}

    </div>
  );
};
