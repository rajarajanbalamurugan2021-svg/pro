import React, { useState } from 'react';
import { Complaint, User, UserRole, ComplaintCategoryItem } from '../../../types';
import {
  ShieldAlert,
  Users,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Download,
  Printer,
  FileSpreadsheet,
  Search,
  Filter,
  Megaphone,
  CheckCircle2,
  BarChart2,
  Sparkles,
  Settings,
  Lock,
  UserPlus
} from 'lucide-react';
import { ReportExporter } from './ReportExporter';

interface AdminComplaintDashboardProps {
  complaints: Complaint[];
  users: User[];
  categories: ComplaintCategoryItem[];
  currentUserName: string;
  onSelectComplaint: (complaint: Complaint) => void;
  onAddCategory: (category: ComplaintCategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onAddUser: (user: User) => void;
  onBroadcastAnnouncement?: (title: string, content: string) => void;
}

export const AdminComplaintDashboard: React.FC<AdminComplaintDashboardProps> = ({
  complaints,
  users,
  categories,
  currentUserName,
  onSelectComplaint,
  onAddCategory,
  onDeleteCategory,
  onUpdateUserRole,
  onAddUser,
  onBroadcastAnnouncement
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'users' | 'announcements'>('overview');
  
  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // User Form State
  const [showUserModal, setShowUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('maintenance_staff');
  const [userDept, setUserDept] = useState('Estate Maintenance Team');

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annSent, setAnnSent] = useState(false);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    onAddCategory({
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Custom campus complaint category.',
      isCustom: true
    });

    setNewCatName('');
    setNewCatDesc('');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userName,
      email: userEmail,
      role: userRole,
      department: userDept,
      phone: '+1 (555) 019-9988',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active'
    };

    onAddUser(newUser);
    setShowUserModal(false);
    setUserName('');
    setUserEmail('');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBroadcastAnnouncement && annTitle && annContent) {
      onBroadcastAnnouncement(annTitle, annContent);
      setAnnSent(true);
      setTimeout(() => setAnnSent(false), 3000);
      setAnnTitle('');
      setAnnContent('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" /> Super Admin & Campus System Control
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Global Complaint System Admin Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Configure system categories, manage roles and staff permissions, monitor real-time cross-department analytics, and broadcast system notifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => ReportExporter.exportToPDF(complaints, 'CKCET Global Campus Grievance Audit Report')}
            className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold hover:bg-white/20 transition flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Global PDF
          </button>
          <button
            onClick={() => ReportExporter.exportToExcel(complaints, 'Global_Campus_Complaints.xls')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-md"
          >
            <FileSpreadsheet className="h-4 w-4" /> Global Excel
          </button>
          <button
            onClick={() => ReportExporter.exportToCSV(complaints, 'Global_Campus_Complaints.csv')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart2 className="h-3.5 w-3.5 inline mr-1.5" /> Analytics Overview
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Tag className="h-3.5 w-3.5 inline mr-1.5" /> Category Management
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-3.5 w-3.5 inline mr-1.5" /> Users & Role Control
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
            activeTab === 'announcements'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="h-3.5 w-3.5 inline mr-1.5" /> Broadcast Announcements
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">System Total Filed</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {complaints.length}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs text-amber-500 font-bold uppercase">Active Pending</span>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {complaints.filter((c) => c.status === 'Pending' || c.status === 'New Complaint').length}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs text-blue-500 font-bold uppercase">In Progress</span>
              <div className="text-2xl font-black text-blue-500 mt-1">
                {complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length}
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs text-emerald-500 font-bold uppercase">Total Resolved</span>
              <div className="text-2xl font-black text-emerald-500 mt-1">
                {complaints.filter((c) => c.status === 'Resolved' || c.status === 'Approved').length}
              </div>
            </div>
          </div>

          {/* Table of all complaints */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Title & Student</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400">
                      {comp.id}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {comp.title}
                      </div>
                      <span className="text-[11px] text-slate-400">By {comp.studentName}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {comp.department}
                    </td>
                    <td className="p-4 font-semibold text-purple-600 dark:text-purple-400">
                      {comp.category}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-bold ${
                          comp.priority === 'Critical' || comp.priority === 'High'
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {comp.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {comp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectComplaint(comp)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
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
      )}

      {/* TAB 2: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Add Category Form */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-blue-600" /> Create Custom Category
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Smart Classroom Displays"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief description of grievances under this category..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Active Complaint Categories ({categories.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3 shadow-sm"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-blue-500" />
                      {cat.name}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {cat.description}
                    </p>
                  </div>

                  {cat.isCustom && (
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Campus Users & Role Management
            </h3>

            <button
              onClick={() => setShowUserModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" /> Add New Staff / User
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider">
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <img src={usr.avatar} alt={usr.name} className="h-6 w-6 rounded-full object-cover" />
                      {usr.name}
                    </td>
                    <td className="p-4 text-slate-500">{usr.email}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{usr.department}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 uppercase">
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={usr.role}
                        onChange={(e) => onUpdateUserRole(usr.id, e.target.value as UserRole)}
                        className="text-xs p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                      >
                        <option value="student">student</option>
                        <option value="maintenance_staff">maintenance_staff</option>
                        <option value="department_head">department_head</option>
                        <option value="admin">admin</option>
                        <option value="super_admin">super_admin</option>
                        <option value="faculty">faculty</option>
                        <option value="mentor">mentor</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-2xl space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-amber-500" /> Broadcast System Alert / Maintenance Announcement
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Announcement Headline
              </label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Scheduled Wi-Fi Router Maintenance on Block B"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Message Content
              </label>
              <textarea
                required
                rows={3}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Detailed notification text for all campus staff & students..."
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition"
            >
              Broadcast Alert
            </button>

            {annSent && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 justify-center">
                <CheckCircle2 className="h-4 w-4" /> Announcement Broadcasted Successfully!
              </p>
            )}
          </form>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Add New User / Maintenance Staff
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. marcus@university.edu"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="maintenance_staff">maintenance_staff</option>
                  <option value="department_head">department_head</option>
                  <option value="admin">admin</option>
                  <option value="student">student</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={userDept}
                  onChange={(e) => setUserDept(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
