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
  Plus
} from 'lucide-react';
import { CampusStorage } from '../../../services/api';

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
  const isAdminOrSuper = !userRole || userRole === 'admin' || userRole === 'super_admin';

  if (!isAdminOrSuper) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-2xl text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/80 flex items-center justify-center text-red-600 dark:text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Restricted
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Campus Admin Control requires Administrator or Super Admin privileges.
        </p>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'database_backup'>('metrics');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('Computer Science & Engineering');

  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? ('inactive' as const) : ('active' as const) };
      }
      return u;
    });
    onUpdateUsers(updated);
    CampusStorage.saveUsers(updated);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department,
      phone: '+1 (555) 019-0000',
      status: 'active'
    };

    const updated = [newUser, ...users];
    onUpdateUsers(updated);
    CampusStorage.saveUsers(updated);
    setShowAddUserModal(false);
    setName('');
    setEmail('');
  };

  const handleDownloadBackupJSON = () => {
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

  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalFaculty = users.filter((u) => u.role === 'faculty' || u.role === 'mentor').length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
  const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 text-white shadow-lg shadow-purple-900/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
            <ShieldAlert className="h-4 w-4" /> System Administration & Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Super Admin Control Panel
          </h1>
          <p className="text-sm text-purple-200 mt-1 max-w-xl">
            Complete management over campus roles, department structures, security logs, database backups, and system health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Campus User
          </button>
          <button
            onClick={handleDownloadBackupJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition backdrop-blur-sm border border-white/20"
          >
            <Database className="h-4 w-4" /> Backup Database JSON
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'metrics'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" /> Campus Metrics Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> User Management & Roles ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('database_backup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'database_backup'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="h-4 w-4" /> Audit Logs & Maintenance
        </button>
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
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">376</div>
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
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="h-7 w-7 rounded-full object-cover" />
                      {u.name}
                    </td>
                    <td className="py-3 px-4 font-extrabold uppercase text-[10px]">{u.role}</td>
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
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 text-[11px]"
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'database_backup' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & Audit Trails</h3>
          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between font-mono">
                <div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">[{log.action}]</span>
                  <span className="text-slate-800 dark:text-slate-200 ml-2">{log.performedBy} ({log.userRole})</span>
                  <span className="text-slate-400 ml-2">— {log.target}</span>
                </div>
                <span className="text-[10px] text-slate-400">{log.timestamp}</span>
              </div>
            ))}
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assigned Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
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
