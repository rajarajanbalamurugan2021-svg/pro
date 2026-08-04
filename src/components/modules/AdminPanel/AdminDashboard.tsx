import React, { useState } from 'react';
import { User, Complaint, LeaveRequest, Resource, AuditLog, UserRole } from '../../../types';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  AlertCircle,
  CalendarDays,
  Download,
  BookOpenCheck,
  RotateCcw,
  UserCheck,
  UserX,
  Trash2,
  FileSpreadsheet,
  Database,
  Plus,
  Shield,
  KeyRound,
  Settings,
  Lock,
  Crown
} from 'lucide-react';
import { CampusStorage } from '../../../services/api';
import { normalizeRole, RBAC } from '../../../lib/rbac';
import { AccessDeniedPage } from '../../common/AccessDeniedPage';

interface AdminDashboardProps {
  userRole?: UserRole;
  users: User[];
  complaints: Complaint[];
  leaves: LeaveRequest[];
  resources: Resource[];
  auditLogs: AuditLog[];
  onUpdateUsers: (users: User[]) => void;
  onResetDatabase: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userRole,
  users,
  complaints,
  leaves,
  resources,
  auditLogs,
  onUpdateUsers,
  onResetDatabase
}) => {
  const normRole = normalizeRole(userRole);
  const isSuperAdmin = normRole === 'super_admin';
  const isAdmin = normRole === 'admin' || isSuperAdmin;

  if (!isAdmin) {
    return <AccessDeniedPage userRole={userRole} moduleName="Campus Admin Control" requiredRole="Admin / SuperAdmin" />;
  }

  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'audit_logs' | 'system_settings'>('metrics');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');

  const handleToggleUserStatus = (targetUser: User) => {
    // Admin CANNOT modify Super Admin accounts
    if (normalizeRole(targetUser.role) === 'super_admin' && !isSuperAdmin) {
      alert('Access Restricted: Only SuperAdmins can modify or deactivate SuperAdmin accounts.');
      return;
    }

    const updated = users.map((u) => {
      if (u.id === targetUser.id) {
        const nextStatus = u.status === 'active' ? ('inactive' as const) : ('active' as const);
        return {
          ...u,
          status: nextStatus,
          accountStatus: nextStatus === 'active' ? ('Active' as const) : ('Inactive' as const)
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    CampusStorage.saveUsers(updated);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Admin cannot create SuperAdmin unless they are SuperAdmin
    if (normalizeRole(role) === 'super_admin' && !isSuperAdmin) {
      alert('Access Restricted: Only SuperAdmins can assign SuperAdmin roles.');
      return;
    }

    const nowISO = new Date().toISOString();
    const newUid = `u-${Date.now()}`;
    const newUser: User = {
      id: newUid,
      uid: newUid,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department,
      phone: '+1 (555) 019-0000',
      status: 'active',
      accountStatus: 'Active',
      createdAt: nowISO,
      lastLogin: nowISO
    };

    const updated = [newUser, ...users];
    onUpdateUsers(updated);
    CampusStorage.saveUsers(updated);
    setShowAddUserModal(false);
    setName('');
    setEmail('');
  };

  const handleDownloadBackupJSON = () => {
    if (!RBAC.canBackupRestoreData(normRole)) {
      alert('Access Restricted: Database Backup & Restore is strictly reserved for SuperAdmins.');
      return;
    }

    const backupData = {
      users: CampusStorage.getUsers(),
      departments: CampusStorage.getDepartments(),
      results: CampusStorage.getResults(),
      complaints: CampusStorage.getComplaints(),
      lostFound: CampusStorage.getLostFound(),
      resources: CampusStorage.getResources(),
      leave: CampusStorage.getLeaveRequests(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Smart_Campus_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const totalStudents = users.filter((u) => normalizeRole(u.role) === 'student').length;
  const totalFaculty = users.filter((u) => normalizeRole(u.role) === 'faculty').length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-purple-800/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            {isSuperAdmin ? <Crown className="h-4 w-4 text-amber-400" /> : <ShieldAlert className="h-4 w-4 text-indigo-400" />}
            <span>{isSuperAdmin ? 'SuperAdmin Full System Control' : 'Admin Campus Management'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {isSuperAdmin ? 'Super Admin Master Governance' : 'Campus Administrator Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            {isSuperAdmin
              ? 'Complete access over all users, role assignments, security policies, audit logs, database backups, and system parameters.'
              : 'Institutional control over students, faculty, departments, courses, published results, and grievance management.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Campus User
          </button>

          {isSuperAdmin && (
            <button
              onClick={handleDownloadBackupJSON}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition backdrop-blur-sm border border-white/20"
            >
              <Database className="h-4 w-4 text-amber-300" /> Backup Database JSON
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'metrics'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" /> Campus Metrics Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> User Management & Roles ({users.length})
        </button>

        {/* AUDIT LOGS & SYSTEM SETTINGS: Strictly for SuperAdmin */}
        {isSuperAdmin && (
          <>
            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'audit_logs'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-amber-400" /> Security Audit Logs ({auditLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('system_settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'system_settings'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="h-4 w-4" /> System Settings & RBAC
            </button>
          </>
        )}
      </div>

      {/* METRICS OVERVIEW TAB */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-semibold">Total Registered Students</span>
              <div className="text-2xl font-extrabold text-blue-600 mt-1">{totalStudents}</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-semibold">Total Faculty & Mentors</span>
              <div className="text-2xl font-extrabold text-purple-600 mt-1">{totalFaculty}</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-amber-600 font-semibold">Pending Grievances</span>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingComplaints}</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-indigo-600 font-semibold">Pending Leave Apps</span>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">{pendingLeaves}</div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-emerald-600 font-semibold">Academic Downloads</span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{resources.reduce((acc, r) => acc + (r.downloadsCount || 0), 0) + 120}</div>
            </div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role Level</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const uNormRole = normalizeRole(u.role);
                  const isTargetSuper = uNormRole === 'super_admin';
                  const canModifyThisUser = isSuperAdmin || !isTargetSuper;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover" />
                        <div>
                          <span>{u.name}</span>
                          {isTargetSuper && (
                            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              <Crown className="h-3 w-3" /> SuperAdmin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-extrabold uppercase text-[10px]">
                        <span className={`px-2 py-0.5 rounded ${
                          uNormRole === 'super_admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                          uNormRole === 'admin' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                          uNormRole === 'faculty' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {uNormRole.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{u.department}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {u.status ? u.status.toUpperCase() : 'ACTIVE'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {canModifyThisUser ? (
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] transition"
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 italic flex items-center gap-1">
                            <Lock className="h-3 w-3" /> SuperAdmin Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB (SuperAdmin Only) */}
      {activeTab === 'audit_logs' && isSuperAdmin && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-purple-600" /> Security & System Modification Audit Trails
            </h3>
            <span className="text-xs font-mono text-slate-400">Total Entries: {auditLogs.length}</span>
          </div>

          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-wrap items-center justify-between font-mono border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">[{log.action}]</span>
                  <span className="text-slate-800 dark:text-slate-200 ml-2 font-bold">{log.performedBy} ({log.userRole})</span>
                  <span className="text-slate-500 ml-2">— {log.target}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-sans">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SYSTEM SETTINGS & RBAC TAB (SuperAdmin Only) */}
      {activeTab === 'system_settings' && isSuperAdmin && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" /> RBAC Permission Matrix & System Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure global access control levels and security policies for CKCET CAMPRO.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-black uppercase tracking-wider border border-purple-500/20">
              SuperAdmin Control Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-extrabold text-slate-900 dark:text-white block">Student Role Guard</span>
              <p className="text-slate-500">Restricted to own grades, attendance, complaints registration, and AI Chatbot.</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Enforced</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-extrabold text-slate-900 dark:text-white block">Faculty Role Guard</span>
              <p className="text-slate-500">Can evaluate assigned courses, upload marks, enter attendance, and manage assigned complaints.</p>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">Enforced</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-extrabold text-slate-900 dark:text-white block">Admin Role Guard</span>
              <p className="text-slate-500">Manages students, faculty, departments, courses, and publishes results.</p>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">Enforced</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-extrabold text-slate-900 dark:text-white block">SuperAdmin Role Guard</span>
              <p className="text-slate-500">Unrestricted system access, user role assignments, audit logs, backup & restore.</p>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">Unrestricted</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" /> Register Campus User
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Amanda Vance"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. amanda.vance@university.edu"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Role Level</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                    {isSuperAdmin && <option value="super_admin">SuperAdmin</option>}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
