import React, { useState } from 'react';
import { User, Project } from '../../../types';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import {
  Users,
  UserCheck,
  Building2,
  FolderPlus,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  Trash2,
  Edit,
  Plus,
  Search,
  Lock,
  RotateCcw,
  Archive,
  Activity,
  HardDrive,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Key,
  UserPlus,
  Download,
  Brain,
  Filter,
  Check,
  X
} from 'lucide-react';

interface AdminManagementPanelProps {
  users: User[];
  projects: Project[];
  departments: string[];
  onUpdateUsers: (updatedUsers: User[]) => void;
  onUpdateProjects: (updatedProjects: Project[]) => void;
}

export const AdminManagementPanel: React.FC<AdminManagementPanelProps> = ({
  users,
  projects,
  departments,
  onUpdateUsers,
  onUpdateProjects
}) => {
  const [subTab, setSubTab] = useState<'students' | 'faculty' | 'projects' | 'reports' | 'system'>('students');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // Local state for User CRUD
  const [userList, setUserList] = useState<User[]>(users);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State for User Add/Edit
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'faculty'>('student');
  const [userDept, setUserDept] = useState(departments[0] || 'Computer Science & Engineering');
  const [userRollNum, setUserRollNum] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Student list
  const students = userList.filter((u) => u.role === 'student');
  // Faculty list
  const faculty = userList.filter((u) => u.role === 'faculty' || u.role === 'admin' || u.role === 'super_admin');

  // Handle User Modal Open (Create or Edit)
  const handleOpenUserModal = (userToEdit?: User, roleType: 'student' | 'faculty' = 'student') => {
    if (userToEdit) {
      setEditingUser(userToEdit);
      setUserName(userToEdit.name);
      setUserEmail(userToEdit.email);
      setUserRole(userToEdit.role === 'student' ? 'student' : 'faculty');
      setUserDept(userToEdit.department || departments[0]);
      setUserRollNum(userToEdit.rollNumber || userToEdit.employeeId || '');
      setUserPhone(userToEdit.phone || '');
    } else {
      setEditingUser(null);
      setUserName('');
      setUserEmail('');
      setUserRole(roleType);
      setUserDept(departments[0] || 'Computer Science & Engineering');
      setUserRollNum('');
      setUserPhone('');
    }
    setIsUserModalOpen(true);
  };

  // Save User
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    if (editingUser) {
      const updatedList = userList.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: userName,
              email: userEmail,
              role: userRole,
              department: userDept,
              rollNumber: userRole === 'student' ? userRollNum : undefined,
              employeeId: userRole === 'faculty' ? userRollNum : undefined,
              phone: userPhone
            }
          : u
      );
      setUserList(updatedList);
      onUpdateUsers(updatedList);
      showToast(`Updated user details for ${userName}`);
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: userName,
        email: userEmail,
        role: userRole,
        department: userDept,
        rollNumber: userRole === 'student' ? userRollNum || `2026-${Math.floor(Math.random() * 900) + 100}` : undefined,
        employeeId: userRole === 'faculty' ? userRollNum || `FAC-${Math.floor(Math.random() * 90) + 10}` : undefined,
        phone: userPhone || '+91 98765 43210',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        skills: userRole === 'student' ? ['Python', 'React.js', 'SQL'] : ['Research', 'Machine Learning'],
        interests: ['Artificial Intelligence', 'Software System Design']
      };
      const updatedList = [newUser, ...userList];
      setUserList(updatedList);
      onUpdateUsers(updatedList);
      showToast(`Added new ${userRole}: ${userName}`);
    }

    setIsUserModalOpen(false);
  };

  // Toggle User Active/Inactive
  const handleToggleUserStatus = (userId: string) => {
    const updatedList = userList.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? ('inactive' as const) : ('active' as const);
        showToast(`User ${u.name} is now ${nextStatus.toUpperCase()}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUserList(updatedList);
    onUpdateUsers(updatedList);
  };

  // Delete User
  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      const updatedList = userList.filter((u) => u.id !== userId);
      setUserList(updatedList);
      onUpdateUsers(updatedList);
      showToast(`Deleted user ${name}`);
    }
  };

  // Reset Password Mock Action
  const handleResetPassword = (name: string, email: string) => {
    showToast(`Password reset link sent to ${email}`);
  };

  // Archive / Restore / Delete Project
  const handleArchiveProject = (projectId: string) => {
    const nextList = projects.map((p) => {
      if (p.id === projectId) {
        const isArchived = p.status === 'Rejected' || p.stage === 'Rejected';
        const nextStatus = isArchived ? ('Approved' as const) : ('Rejected' as const);
        const nextStage = isArchived ? ('Development' as const) : ('Rejected' as const);
        showToast(`Project ${isArchived ? 'Restored' : 'Archived'}: ${p.title}`);
        return { ...p, status: nextStatus, stage: nextStage };
      }
      return p;
    });
    onUpdateProjects(nextList);
  };

  const handleDeleteProject = (projectId: string, title: string) => {
    if (confirm(`Are you sure you want to delete project: "${title}"?`)) {
      const nextList = projects.filter((p) => p.id !== projectId);
      onUpdateProjects(nextList);
      showToast(`Deleted project "${title}"`);
    }
  };

  // Export Helpers
  const exportStudentsReport = (format: 'pdf' | 'excel' | 'csv') => {
    const rows = students.map((s) => ({
      ID: s.id,
      Name: s.name,
      Email: s.email,
      Department: s.department,
      RollNumber: s.rollNumber || 'N/A',
      Status: s.status,
      Skills: (s.skills || []).join(', ')
    }));

    if (format === 'csv') exportToCSV('Admin_Student_Report', rows);
    else if (format === 'excel') exportToExcel('Admin_Student_Report', rows);
    else {
      const headers = ['Name', 'Email', 'Department', 'Roll No', 'Status', 'Skills'];
      const pdfRows = students.map((s) => [s.name, s.email, s.department, s.rollNumber || 'N/A', s.status, (s.skills || []).join(', ')]);
      exportToPDF('CKCET Student Master Database Report', headers, pdfRows);
    }
  };

  const exportFacultyReport = (format: 'pdf' | 'excel' | 'csv') => {
    const rows = faculty.map((f) => ({
      ID: f.id,
      Name: f.name,
      Email: f.email,
      Department: f.department,
      EmployeeID: f.employeeId || 'N/A',
      Role: f.role,
      Status: f.status
    }));

    if (format === 'csv') exportToCSV('Admin_Faculty_Report', rows);
    else if (format === 'excel') exportToExcel('Admin_Faculty_Report', rows);
    else {
      const headers = ['Name', 'Email', 'Department', 'Employee ID', 'Role', 'Status'];
      const pdfRows = faculty.map((f) => [f.name, f.email, f.department, f.employeeId || 'N/A', f.role, f.status]);
      exportToPDF('CKCET Faculty Roster & Mentor Directory', headers, pdfRows);
    }
  };

  const exportProjectsReport = (format: 'pdf' | 'excel' | 'csv') => {
    const rows = projects.map((p) => ({
      ID: p.id,
      Title: p.title,
      Category: p.category,
      Department: p.department,
      Lead: p.ownerName,
      Stage: p.stage,
      Status: p.status,
      Score: `${p.innovationScore}/100`,
      MembersCount: p.members.length
    }));

    if (format === 'csv') exportToCSV('Admin_Projects_Report', rows);
    else if (format === 'excel') exportToExcel('Admin_Projects_Report', rows);
    else {
      const headers = ['Title', 'Category', 'Department', 'Project Lead', 'Stage', 'Status', 'Score'];
      const pdfRows = projects.map((p) => [p.title, p.category, p.department, p.ownerName, p.stage, p.status, `${p.innovationScore}/100`]);
      exportToPDF('CKCET Capstone Innovation Projects Master Audit', headers, pdfRows);
    }
  };

  const auditLogs = [
    { id: '1', action: 'User Created', performedBy: 'Admin (System)', target: 'Student: Ananya Verma', timestamp: '2026-08-03 09:12', ip: '192.168.1.102' },
    { id: '2', action: 'Project Proposal Approved', performedBy: 'Dr. R. Sundaram', target: 'Project: AI Vision Security', timestamp: '2026-08-03 10:45', ip: '192.168.1.45' },
    { id: '3', action: 'Faculty Mentor Assigned', performedBy: 'Admin (System)', target: 'Mentor: Prof. Meenakshi', timestamp: '2026-08-03 11:20', ip: '192.168.1.102' },
    { id: '4', action: 'System Backup Generated', performedBy: 'Automated Service', target: 'Firestore Storage Archive', timestamp: '2026-08-03 12:00', ip: '10.0.4.12' }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Students</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{students.length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active Enrollments</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Faculty</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{faculty.length}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Project Mentors</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">All Projects</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{projects.length}</div>
          <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Innovation Ideas</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Pending Review</div>
          <div className="text-xl font-black text-amber-500 mt-1">
            {projects.filter((p) => p.status === 'Pending Approval').length}
          </div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Approval Queue</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Active Teams</div>
          <div className="text-xl font-black text-emerald-500 mt-1">
            {projects.filter((p) => p.status === 'Approved').length}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">In Execution</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase">System Status</div>
          <div className="text-xl font-black text-indigo-500 mt-1">100%</div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">Cloud Operational</div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setSubTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'students'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="h-4 w-4" /> Student Management ({students.length})
          </button>

          <button
            onClick={() => setSubTab('faculty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'faculty'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="h-4 w-4" /> Faculty Directory ({faculty.length})
          </button>

          <button
            onClick={() => setSubTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'projects'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderPlus className="h-4 w-4" /> Project Master ({projects.length})
          </button>

          <button
            onClick={() => setSubTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'reports'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" /> Export Reports
          </button>

          <button
            onClick={() => setSubTab('system')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'system'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="h-4 w-4" /> System & Audit Logs
          </button>
        </div>
      </div>

      {/* Sub Tab 1: Student Management */}
      {subTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students by name, email, roll number..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
            </div>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleOpenUserModal(undefined, 'student')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="h-4 w-4" /> Add Student
            </button>
          </div>

          {/* Student Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Roll No</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Skills</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {students
                    .filter(
                      (s) =>
                        (selectedDeptFilter === 'All' || s.department === selectedDeptFilter) &&
                        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())))
                    )
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img src={st.avatar} alt={st.name} className="h-8 w-8 rounded-full object-cover" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{st.name}</div>
                              <div className="text-[10px] text-slate-400">{st.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-300">
                          {st.rollNumber || 'N/A'}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{st.department}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {st.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {(st.skills || []).slice(0, 3).map((sk) => (
                              <span
                                key={sk}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenUserModal(st, 'student')}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                              title="Edit Student"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(st.id)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                              title="Toggle Active Status"
                            >
                              <Lock className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleResetPassword(st.name, st.email)}
                              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                              title="Reset Password"
                            >
                              <Key className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(st.id, st.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                              title="Delete Student"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 2: Faculty Directory */}
      {subTab === 'faculty' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search faculty mentors by name, department, employee ID..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleOpenUserModal(undefined, 'faculty')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="h-4 w-4" /> Add Faculty
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Faculty Member</th>
                    <th className="p-3.5">Employee ID</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {faculty
                    .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img src={f.avatar} alt={f.name} className="h-8 w-8 rounded-full object-cover" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{f.name}</div>
                              <div className="text-[10px] text-slate-400">{f.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold">{f.employeeId || 'FAC-102'}</td>
                        <td className="p-3.5">{f.department}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                            {f.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenUserModal(f, 'faculty')}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(f.id, f.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 3: Project Master CRUD & Archive */}
      {subTab === 'projects' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Master Management & Archiving</h3>
              <span className="text-xs text-slate-500">{projects.length} Total Registered Projects</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Lead</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {projects.map((p) => {
                    const isArchived = p.status === 'Rejected' || p.stage === 'Rejected';
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.title}</div>
                          <div className="text-[10px] text-slate-400">Score: {p.innovationScore}/100</div>
                        </td>
                        <td className="p-3.5 font-semibold text-blue-600">{p.category}</td>
                        <td className="p-3.5">{p.department}</td>
                        <td className="p-3.5">{p.ownerName}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isArchived
                                ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {isArchived ? 'ARCHIVED' : p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleArchiveProject(p.id)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                              title={isArchived ? 'Restore Project' : 'Archive Project'}
                            >
                              {isArchived ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                              title="Delete Project"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 4: Export Reports */}
      {subTab === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 w-fit">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Master Database Report</h3>
              <p className="text-xs text-slate-500 mt-1">Export complete list of enrolled students, skills, and projects.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => exportStudentsReport('pdf')}
                className="flex-1 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100"
              >
                PDF
              </button>
              <button
                onClick={() => exportStudentsReport('excel')}
                className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100"
              >
                Excel
              </button>
              <button
                onClick={() => exportStudentsReport('csv')}
                className="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100"
              >
                CSV
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 w-fit">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Faculty Roster & Mentor Directory</h3>
              <p className="text-xs text-slate-500 mt-1">Export faculty mentors, assigned departments, and review stats.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => exportFacultyReport('pdf')}
                className="flex-1 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100"
              >
                PDF
              </button>
              <button
                onClick={() => exportFacultyReport('excel')}
                className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100"
              >
                Excel
              </button>
              <button
                onClick={() => exportFacultyReport('csv')}
                className="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100"
              >
                CSV
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 w-fit">
              <FolderPlus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Capstone Projects Master Audit</h3>
              <p className="text-xs text-slate-500 mt-1">Export full innovation projects registry with scores & stages.</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => exportProjectsReport('pdf')}
                className="flex-1 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100"
              >
                PDF
              </button>
              <button
                onClick={() => exportProjectsReport('excel')}
                className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100"
              >
                Excel
              </button>
              <button
                onClick={() => exportProjectsReport('csv')}
                className="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100"
              >
                CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab 5: System & Audit Logs */}
      {subTab === 'system' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Cpu className="h-8 w-8 text-indigo-500" />
              <div>
                <div className="text-xs text-slate-400">Server CPU Utilization</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">12.4% Optimal</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-emerald-500" />
              <div>
                <div className="text-xs text-slate-400">Cloud Storage Usage</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">4.8 GB / 100 GB</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-xs text-slate-400">Active User Sessions</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">148 Concurrent</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" /> System Security & Audit Log History
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                    <span className="text-slate-400 ml-2">by {log.performedBy}</span>
                    <div className="text-[10px] text-slate-500">{log.target}</div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <div>{log.timestamp}</div>
                    <div>IP: {log.ip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Add / Edit Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingUser ? 'Edit User Profile' : `Add New ${userRole.toUpperCase()}`}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. rahul@university.edu"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Role</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">
                    {userRole === 'student' ? 'Roll Number' : 'Employee ID'}
                  </label>
                  <input
                    type="text"
                    value={userRollNum}
                    onChange={(e) => setUserRollNum(e.target.value)}
                    placeholder={userRole === 'student' ? '2026-CS-102' : 'FAC-901'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Department</label>
                <select
                  value={userDept}
                  onChange={(e) => setUserDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
