import React, { useState } from 'react';
import { User, Complaint, LeaveRequest, Resource, AuditLog, UserRole, Department, Announcement, NotificationItem, StudentResult } from '../../../types';
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
  Crown,
  Building2,
  BookOpen,
  Award,
  QrCode,
  Megaphone,
  Bell,
  Bot
} from 'lucide-react';
import { CampusStorage } from '../../../services/api';
import { normalizeRole, RBAC } from '../../../lib/rbac';
import { AccessDeniedPage } from '../../common/AccessDeniedPage';
import { CrudManager, CrudColumn, CrudFieldSchema } from '../../common/CrudManager';

interface AdminDashboardProps {
  userRole?: UserRole;
  users: User[];
  complaints: Complaint[];
  leaves: LeaveRequest[];
  resources: Resource[];
  auditLogs: AuditLog[];
  onUpdateUsers: (users: User[]) => void;
  onResetDatabase: () => void;
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userRole,
  users,
  complaints,
  leaves,
  resources,
  auditLogs,
  onUpdateUsers,
  onResetDatabase,
  initialTab
}) => {
  const normRole = normalizeRole(userRole);
  const isSuperAdmin = normRole === 'super_admin';
  const isAdmin = normRole === 'admin' || isSuperAdmin;
  const isFaculty = normRole === 'faculty';

  if (!isAdmin && !isFaculty) {
    return <AccessDeniedPage userRole={userRole} moduleName="Campus Management" requiredRole="Faculty / Admin / SuperAdmin" />;
  }

  const [activeTab, setActiveTab] = useState<
    | 'metrics'
    | 'students'
    | 'faculty'
    | 'admins'
    | 'departments'
    | 'courses'
    | 'results'
    | 'attendance'
    | 'complaints'
    | 'announcements'
    | 'notifications'
    | 'ai_settings'
    | 'audit_logs'
    | 'system_settings'
  >(() => (initialTab as any) || (isFaculty ? 'students' : 'metrics'));

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Local State collections synced with CampusStorage
  const [departmentList, setDepartmentList] = useState<Department[]>(() => CampusStorage.getDepartments());
  const [announcementList, setAnnouncementList] = useState<Announcement[]>(() => CampusStorage.getAnnouncements());
  const [notificationList, setNotificationList] = useState<NotificationItem[]>(() => CampusStorage.getNotifications());
  const [resultList, setResultList] = useState<StudentResult[]>(() => CampusStorage.getResults());
  
  // AI Chatbot Settings State
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [aiSystemPrompt, setAiSystemPrompt] = useState('You are CKCET CAMPRO Academic AI Assistant.');

  // Student list
  const studentList = users.filter((u) => normalizeRole(u.role) === 'student');
  const facultyList = users.filter((u) => normalizeRole(u.role) === 'faculty');
  const adminList = users.filter((u) => normalizeRole(u.role) === 'admin' || normalizeRole(u.role) === 'super_admin');

  // Save Users Handler for CrudManager
  const handleSaveUser = (updatedUser: User, isEdit: boolean) => {
    let updatedUsers: User[];
    if (isEdit) {
      updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    } else {
      updatedUsers = [updatedUser, ...users];
    }
    onUpdateUsers(updatedUsers);
    CampusStorage.saveUsers(updatedUsers);
  };

  const handleDeleteUser = (ids: string[], isPermanent = false) => {
    let updatedUsers: User[];
    if (isPermanent) {
      updatedUsers = users.filter((u) => !ids.includes(u.id));
    } else {
      updatedUsers = users.map((u) => (ids.includes(u.id) ? { ...u, isDeleted: true } : u));
    }
    onUpdateUsers(updatedUsers);
    CampusStorage.saveUsers(updatedUsers);
  };

  const handleRestoreUser = (id: string) => {
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, isDeleted: false } : u));
    onUpdateUsers(updatedUsers);
    CampusStorage.saveUsers(updatedUsers);
  };

  const handleStatusToggleUser = (id: string, newStatus: string) => {
    const updatedUsers = users.map((u) => (u.id === id ? { ...u, status: newStatus as any, accountStatus: newStatus === 'active' ? 'Active' : 'Inactive' } : u));
    onUpdateUsers(updatedUsers);
    CampusStorage.saveUsers(updatedUsers);
  };

  // Department Handlers
  const handleSaveDept = (dept: Department, isEdit: boolean) => {
    const updated = isEdit ? departmentList.map((d) => (d.id === dept.id ? dept : d)) : [dept, ...departmentList];
    setDepartmentList(updated);
    CampusStorage.saveDepartments(updated);
  };

  const handleDeleteDept = (ids: string[], isPermanent = false) => {
    const updated = isPermanent
      ? departmentList.filter((d) => !ids.includes(d.id))
      : departmentList.map((d) => (ids.includes(d.id) ? { ...d, isDeleted: true } : d));
    setDepartmentList(updated);
    CampusStorage.saveDepartments(updated);
  };

  // Results Handlers
  const handleSaveResult = (res: StudentResult, isEdit: boolean) => {
    const updated = isEdit ? resultList.map((r) => (r.id === res.id ? res : r)) : [res, ...resultList];
    setResultList(updated);
    CampusStorage.saveResults(updated);
  };

  const handleDeleteResult = (ids: string[], isPermanent = false) => {
    const updated = isPermanent ? resultList.filter((r) => !ids.includes(r.id)) : resultList.map((r) => (ids.includes(r.id) ? { ...r, isDeleted: true } : r));
    setResultList(updated);
    CampusStorage.saveResults(updated);
  };

  // Announcements Handlers
  const handleSaveAnnouncement = (anc: Announcement, isEdit: boolean) => {
    const updated = isEdit ? announcementList.map((a) => (a.id === anc.id ? anc : a)) : [anc, ...announcementList];
    setAnnouncementList(updated);
    CampusStorage.saveAnnouncements(updated);
  };

  const handleDeleteAnnouncement = (ids: string[], isPermanent = false) => {
    const updated = isPermanent
      ? announcementList.filter((a) => !ids.includes(a.id))
      : announcementList.map((a) => (ids.includes(a.id) ? { ...a, isDeleted: true } : a));
    setAnnouncementList(updated);
    CampusStorage.saveAnnouncements(updated);
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
      announcements: CampusStorage.getAnnouncements(),
      notifications: CampusStorage.getNotifications(),
      resources: CampusStorage.getResources(),
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
            {isSuperAdmin ? <Crown className="h-4 w-4 text-amber-400" /> : isFaculty ? <GraduationCap className="h-4 w-4 text-emerald-400" /> : <ShieldAlert className="h-4 w-4 text-indigo-400" />}
            <span>{isSuperAdmin ? 'SuperAdmin Full System Control' : isFaculty ? 'Faculty Academic Portal' : 'Admin Campus Management'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            {isSuperAdmin ? 'Super Admin Master Governance' : isFaculty ? 'My Students & Academic Roster' : 'Campus Administrator Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            {isSuperAdmin
              ? 'Complete access over all users, role assignments, security policies, audit logs, database backups, and system parameters.'
              : isFaculty
              ? 'View and manage student records, register numbers, department allocations, academic results, and student performance.'
              : 'Institutional control over students, faculty, departments, courses, published results, and grievance management.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'metrics' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" /> Overview
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'students' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" /> Students ({studentList.length})
        </button>

        <button
          onClick={() => setActiveTab('faculty')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'faculty' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="h-4 w-4" /> Faculty ({facultyList.length})
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('admins')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              activeTab === 'admins' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="h-4 w-4 text-amber-400" /> Admins ({adminList.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'departments' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" /> Departments ({departmentList.length})
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'results' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" /> Results ({resultList.length})
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'announcements' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="h-4 w-4" /> Announcements ({announcementList.length})
        </button>

        {isSuperAdmin && (
          <>
            <button
              onClick={() => setActiveTab('ai_settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'ai_settings' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bot className="h-4 w-4 text-emerald-400" /> AI Settings
            </button>
            <button
              onClick={() => setActiveTab('audit_logs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'audit_logs' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-amber-400" /> Audit Logs ({auditLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('system_settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                activeTab === 'system_settings' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="h-4 w-4" /> System Rules
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

      {/* STUDENT MANAGEMENT CRUD */}
      {activeTab === 'students' && (
        <CrudManager<User>
          title="Student Management Portal"
          subtitle="Complete CRUD control over registered students, register numbers, department allocations, and academic statuses."
          entityName="Student"
          items={studentList}
          userRole={userRole}
          onSaveItem={handleSaveUser}
          onDeleteItem={handleDeleteUser}
          onRestoreItem={handleRestoreUser}
          onStatusToggle={handleStatusToggleUser}
          columns={[
            { key: 'rollNumber', label: 'Register No', sortable: true },
            { key: 'name', label: 'Student Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'department', label: 'Department', sortable: true },
            { key: 'semester', label: 'Semester' },
            { key: 'status', label: 'Status' }
          ]}
          fields={[
            { key: 'rollNumber', label: 'Register Number', type: 'text', required: true, placeholder: 'e.g. CS2023001' },
            { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Alex Rivera' },
            { key: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'alex.rivera@student.edu' },
            { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 019-2831' },
            {
              key: 'department',
              label: 'Department',
              type: 'select',
              options: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering'],
              required: true
            },
            { key: 'semester', label: 'Current Semester', type: 'number', defaultValue: 6 },
            { key: 'section', label: 'Section', type: 'text', defaultValue: 'A' },
            { key: 'batch', label: 'Academic Batch', type: 'text', defaultValue: '2022-2026' },
            { key: 'role', label: 'User Role', type: 'text', defaultValue: 'student', readOnly: true },
            { key: 'status', label: 'Account Status', type: 'select', options: ['active', 'inactive'], defaultValue: 'active' }
          ]}
        />
      )}

      {/* FACULTY MANAGEMENT CRUD */}
      {activeTab === 'faculty' && (
        <CrudManager<User>
          title="Faculty Management Portal"
          subtitle="Manage professor profiles, employee IDs, department assignments, and course responsibilities."
          entityName="Faculty"
          items={facultyList}
          userRole={userRole}
          onSaveItem={handleSaveUser}
          onDeleteItem={handleDeleteUser}
          onRestoreItem={handleRestoreUser}
          onStatusToggle={handleStatusToggleUser}
          columns={[
            { key: 'employeeId', label: 'Emp ID', sortable: true },
            { key: 'name', label: 'Faculty Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'department', label: 'Department', sortable: true },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' }
          ]}
          fields={[
            { key: 'employeeId', label: 'Employee ID', type: 'text', required: true, placeholder: 'e.g. EMP104' },
            { key: 'name', label: 'Faculty Name', type: 'text', required: true, placeholder: 'e.g. Prof. Robert Thorne' },
            { key: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'r.thorne@university.edu' },
            { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 017-3820' },
            {
              key: 'department',
              label: 'Assigned Department',
              type: 'select',
              options: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Mechanical Engineering', 'Civil Engineering'],
              required: true
            },
            { key: 'role', label: 'Role Level', type: 'text', defaultValue: 'faculty', readOnly: true },
            { key: 'status', label: 'Account Status', type: 'select', options: ['active', 'inactive'], defaultValue: 'active' }
          ]}
        />
      )}

      {/* ADMIN MANAGEMENT CRUD (SuperAdmin Only) */}
      {activeTab === 'admins' && isSuperAdmin && (
        <CrudManager<User>
          title="SuperAdmin System Governance"
          subtitle="Manage system administrators and super admins with full system authorization."
          entityName="Admin"
          items={adminList}
          userRole={userRole}
          onSaveItem={handleSaveUser}
          onDeleteItem={handleDeleteUser}
          onRestoreItem={handleRestoreUser}
          onStatusToggle={handleStatusToggleUser}
          columns={[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role Level', sortable: true },
            { key: 'department', label: 'Department' },
            { key: 'status', label: 'Status' }
          ]}
          fields={[
            { key: 'name', label: 'Administrator Name', type: 'text', required: true },
            { key: 'email', label: 'Email Address', type: 'email', required: true },
            { key: 'role', label: 'Role Authorization', type: 'select', options: ['admin', 'super_admin'], required: true },
            { key: 'department', label: 'Department', type: 'text', defaultValue: 'Academic Registrar' },
            { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], defaultValue: 'active' }
          ]}
        />
      )}

      {/* DEPARTMENT MANAGEMENT CRUD */}
      {activeTab === 'departments' && (
        <CrudManager<Department>
          title="Department Management Portal"
          subtitle="Add, edit, delete, and allocate Head of Departments (HOD) across academic branches."
          entityName="Department"
          items={departmentList}
          userRole={userRole}
          onSaveItem={handleSaveDept}
          onDeleteItem={handleDeleteDept}
          columns={[
            { key: 'code', label: 'Dept Code', sortable: true },
            { key: 'name', label: 'Department Name', sortable: true },
            { key: 'headOfDepartment', label: 'Head of Dept (HOD)' },
            { key: 'totalStudents', label: 'Students' },
            { key: 'totalFaculty', label: 'Faculty' }
          ]}
          fields={[
            { key: 'code', label: 'Department Code', type: 'text', required: true, placeholder: 'CSE' },
            { key: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'Computer Science & Engineering' },
            { key: 'headOfDepartment', label: 'Head of Department (HOD)', type: 'text', placeholder: 'Dr. Alan Turing' },
            { key: 'totalStudents', label: 'Student Capacity', type: 'number', defaultValue: 240 },
            { key: 'totalFaculty', label: 'Faculty Count', type: 'number', defaultValue: 18 }
          ]}
        />
      )}

      {/* RESULT MANAGEMENT CRUD */}
      {activeTab === 'results' && (
        <CrudManager<StudentResult>
          title="Academic Results & Marksheet Control"
          subtitle="Manage student SGPA/CGPA records, grades, and publication parameters."
          entityName="Result"
          items={resultList}
          userRole={userRole}
          onSaveItem={handleSaveResult}
          onDeleteItem={handleDeleteResult}
          columns={[
            { key: 'rollNumber', label: 'Roll No', sortable: true },
            { key: 'studentName', label: 'Student Name', sortable: true },
            { key: 'department', label: 'Department' },
            { key: 'semester', label: 'Semester' },
            { key: 'sgpa', label: 'SGPA', sortable: true },
            { key: 'cgpa', label: 'CGPA', sortable: true },
            { key: 'publishedDate', label: 'Publish Date' }
          ]}
          fields={[
            { key: 'rollNumber', label: 'Roll Number', type: 'text', required: true, placeholder: 'CS2023001' },
            { key: 'studentName', label: 'Student Name', type: 'text', required: true, placeholder: 'Alex Rivera' },
            { key: 'department', label: 'Department', type: 'text', required: true, defaultValue: 'Computer Science & Engineering' },
            { key: 'semester', label: 'Semester', type: 'number', defaultValue: 6 },
            { key: 'sgpa', label: 'SGPA Score', type: 'number', defaultValue: 8.92 },
            { key: 'cgpa', label: 'CGPA Score', type: 'number', defaultValue: 8.74 },
            { key: 'publishedDate', label: 'Published Date', type: 'text', defaultValue: new Date().toLocaleDateString() }
          ]}
        />
      )}

      {/* ANNOUNCEMENT MANAGEMENT CRUD */}
      {activeTab === 'announcements' && (
        <CrudManager<Announcement>
          title="Campus Announcements Broadcast"
          subtitle="Publish, edit, schedule, and broadcast institutional updates to campus roles."
          entityName="Announcement"
          items={announcementList}
          userRole={userRole}
          onSaveItem={handleSaveAnnouncement}
          onDeleteItem={handleDeleteAnnouncement}
          columns={[
            { key: 'title', label: 'Title', sortable: true },
            { key: 'category', label: 'Category', sortable: true },
            { key: 'issuedBy', label: 'Issued By' },
            { key: 'date', label: 'Date' }
          ]}
          fields={[
            { key: 'title', label: 'Announcement Title', type: 'text', required: true, placeholder: 'Semester Examination Schedule Released' },
            { key: 'content', label: 'Full Announcement Details', type: 'textarea', required: true },
            { key: 'category', label: 'Category', type: 'select', options: ['Academic', 'Exam', 'Placement', 'Sports', 'Urgent'], required: true },
            { key: 'issuedBy', label: 'Issued By Officer', type: 'text', defaultValue: 'Office of the Registrar' },
            { key: 'date', label: 'Date Published', type: 'text', defaultValue: new Date().toLocaleDateString() }
          ]}
        />
      )}

      {/* AI CHATBOT SETTINGS TAB (SuperAdmin Only) */}
      {activeTab === 'ai_settings' && isSuperAdmin && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-500" /> AI Assistant & Chatbot Governance Settings
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enable or disable campus AI chatbot, configure underlying AI models, system instructions, and clear logs.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-w-xl text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Enable AI Assistant Floating Widget</span>
                <span className="text-slate-500 text-[11px]">Allow students and faculty to query campus AI assistant.</span>
              </div>
              <button
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`px-4 py-1.5 rounded-full font-bold text-xs transition ${
                  aiEnabled ? 'bg-emerald-600 text-white shadow' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {aiEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Selected Gemini AI Model</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast & Recommended)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Reasoning)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">System Instructions</label>
              <textarea
                rows={3}
                value={aiSystemPrompt}
                onChange={(e) => setAiSystemPrompt(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => alert('AI Assistant settings saved successfully!')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Save Settings
              </button>
              <button
                onClick={() => alert('AI Chat history and logs cleared.')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Clear Chat Logs
              </button>
            </div>
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

    </div>
  );
};

