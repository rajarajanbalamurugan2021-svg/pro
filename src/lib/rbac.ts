import { User, UserRole } from '../types';

export type NormalizedRole = 'super_admin' | 'admin' | 'faculty' | 'student';

export const ROLE_SUPER_ADMIN = 'super_admin';
export const ROLE_ADMIN = 'admin';
export const ROLE_FACULTY = 'faculty';
export const ROLE_STUDENT = 'student';

/**
 * Normalizes any role string to standard canonical keys: 'super_admin' | 'admin' | 'faculty' | 'student'
 */
export function normalizeRole(role?: string | UserRole): NormalizedRole {
  if (!role) return 'student';
  const r = role.toString().toLowerCase().trim().replace(/\s+/g, '_');
  if (r === 'superadmin' || r === 'super_admin') return 'super_admin';
  if (r === 'admin' || r === 'administrator') return 'admin';
  if (r === 'faculty' || r === 'teacher' || r === 'professor') return 'faculty';
  if (r === 'student') return 'student';
  
  // Fallbacks for existing legacy role strings
  if (r === 'department_head' || r === 'placement_officer' || r === 'recruiter') return 'admin';
  if (r === 'mentor' || r === 'maintenance_staff') return 'faculty';

  return 'student';
}

export function getRoleDisplayName(role?: string | UserRole): string {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'super_admin': return 'SuperAdmin';
    case 'admin': return 'Admin';
    case 'faculty': return 'Faculty';
    case 'student': return 'Student';
    default: return 'Student';
  }
}

/**
 * Sidebar Navigation Items per Role specification in prompt
 */
export interface MenuItem {
  id: string;
  label: string;
  module: string;
  iconName: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

export const ROLE_SIDEBAR_MENUS: Record<NormalizedRole, MenuItem[]> = {
  super_admin: [
    { id: 'dashboard', label: 'Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/superadmin/dashboard' },
    { id: 'user_management', label: 'User Management', module: 'user_management', iconName: 'Users', path: '/superadmin/users' },
    { id: 'leave', label: 'Leave Management', module: 'leave', iconName: 'CalendarDays', path: '/leave' },
    { id: 'project_innovation', label: 'Project Collaboration', module: 'project_innovation', iconName: 'Sparkles', path: '/projects', badge: 'Hub' },
    { id: 'departments', label: 'Departments', module: 'departments', iconName: 'Building2', path: '/superadmin/departments' },
    { id: 'courses', label: 'Courses', module: 'courses', iconName: 'BookOpen', path: '/superadmin/courses' },
    { id: 'complaints', label: 'Complaints', module: 'complaints', iconName: 'AlertCircle', path: '/superadmin/complaints' },
    { id: 'results', label: 'Results', module: 'results', iconName: 'Award', path: '/superadmin/results' },
    { id: 'attendance', label: 'Attendance', module: 'attendance', iconName: 'QrCode', path: '/superadmin/attendance' },
    { id: 'reports', label: 'Reports', module: 'reports', iconName: 'FileText', path: '/superadmin/reports' },
    { id: 'analytics', label: 'Analytics', module: 'analytics', iconName: 'BarChart3', path: '/superadmin/analytics' },
    { id: 'ai_chatbot', label: 'AI Chatbot', module: 'ai_chatbot', iconName: 'Bot', path: '/superadmin/ai_chatbot', badge: 'AI' },
    { id: 'system_settings', label: 'System Settings', module: 'system_settings', iconName: 'Settings', path: '/superadmin/settings' },
    { id: 'audit_logs', label: 'Audit Logs', module: 'audit_logs', iconName: 'ShieldAlert', path: '/superadmin/audit_logs', badge: 'Security' }
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/admin/dashboard' },
    { id: 'leave', label: 'Leave Management', module: 'leave', iconName: 'CalendarDays', path: '/leave' },
    { id: 'students', label: 'Students', module: 'students', iconName: 'GraduationCap', path: '/admin/students' },
    { id: 'faculty', label: 'Faculty', module: 'faculty', iconName: 'UserCheck2', path: '/admin/faculty' },
    { id: 'project_innovation', label: 'Project Collaboration', module: 'project_innovation', iconName: 'Sparkles', path: '/projects', badge: 'Hub' },
    { id: 'departments', label: 'Departments', module: 'departments', iconName: 'Building2', path: '/admin/departments' },
    { id: 'courses', label: 'Courses', module: 'courses', iconName: 'BookOpen', path: '/admin/courses' },
    { id: 'complaints', label: 'Complaints', module: 'complaints', iconName: 'AlertCircle', path: '/admin/complaints' },
    { id: 'results', label: 'Results', module: 'results', iconName: 'Award', path: '/admin/results' },
    { id: 'attendance', label: 'Attendance', module: 'attendance', iconName: 'QrCode', path: '/admin/attendance' },
    { id: 'reports', label: 'Reports', module: 'reports', iconName: 'FileText', path: '/admin/reports' },
    { id: 'analytics', label: 'Analytics', module: 'analytics', iconName: 'BarChart3', path: '/admin/analytics' }
  ],
  faculty: [
    { id: 'dashboard', label: 'Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/faculty/dashboard' },
    { id: 'leave', label: 'Leave Management', module: 'leave', iconName: 'CalendarDays', path: '/leave' },
    { id: 'project_innovation', label: 'Project Collaboration', module: 'project_innovation', iconName: 'Sparkles', path: '/projects', badge: 'Hub' },
    { id: 'my_students', label: 'My Students', module: 'my_students', iconName: 'GraduationCap', path: '/faculty/students' },
    { id: 'my_courses', label: 'My Courses', module: 'my_courses', iconName: 'BookOpen', path: '/faculty/courses' },
    { id: 'attendance', label: 'Attendance', module: 'attendance', iconName: 'QrCode', path: '/faculty/attendance' },
    { id: 'marks', label: 'Marks', module: 'marks', iconName: 'FileSpreadsheet', path: '/faculty/marks' },
    { id: 'reports', label: 'Reports', module: 'reports', iconName: 'FileText', path: '/faculty/reports' },
    { id: 'complaints', label: 'Complaints', module: 'complaints', iconName: 'AlertCircle', path: '/faculty/complaints' },
    { id: 'announcements', label: 'Announcements', module: 'announcements', iconName: 'Megaphone', path: '/faculty/announcements' }
  ],
  student: [
    { id: 'dashboard', label: 'Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/student/dashboard' },
    { id: 'leave', label: 'Leave Management', module: 'leave', iconName: 'CalendarDays', path: '/leave' },
    { id: 'project_innovation', label: 'Project Collaboration', module: 'project_innovation', iconName: 'Sparkles', path: '/projects', badge: 'Hub' },
    { id: 'my_profile', label: 'My Profile', module: 'my_profile', iconName: 'User', path: '/student/profile' },
    { id: 'results', label: 'Results', module: 'results', iconName: 'Award', path: '/student/results' },
    { id: 'attendance', label: 'Attendance', module: 'attendance', iconName: 'QrCode', path: '/student/attendance' },
    { id: 'gpa_calculator', label: 'SGPA / CGPA', module: 'gpa_calculator', iconName: 'Calculator', path: '/student/gpa' },
    { id: 'complaints', label: 'Complaints', module: 'complaints', iconName: 'AlertCircle', path: '/student/complaints' },
    { id: 'ai_chatbot', label: 'AI Chatbot', module: 'ai_chatbot', iconName: 'Bot', path: '/student/ai_chatbot', badge: 'AI Assistant' },
    { id: 'downloads', label: 'Downloads', module: 'downloads', iconName: 'Download', path: '/student/downloads' }
  ]
};

/**
 * Default module redirection after login for each role
 */
export const DEFAULT_ROLE_MODULE: Record<NormalizedRole, string> = {
  super_admin: 'dashboard',
  admin: 'dashboard',
  faculty: 'dashboard',
  student: 'dashboard'
};

/**
 * Returns allowed module list for a given role
 */
export function getAllowedModulesForRole(role?: string | UserRole): string[] {
  const norm = normalizeRole(role);
  const menu = ROLE_SIDEBAR_MENUS[norm] || ROLE_SIDEBAR_MENUS.student;
  return menu.map((m) => m.module);
}

/**
 * Checks if a user role is permitted to access a specific module
 */
export function canAccessModule(role?: string | UserRole, moduleName?: string): boolean {
  if (!moduleName) return true;
  const norm = normalizeRole(role);

  // Super Admin has unrestricted access to everything
  if (norm === 'super_admin') return true;

  // General Dashboard is allowed for everyone
  if (moduleName === 'dashboard' || moduleName === 'overview' || moduleName === 'placement') return true;

  const allowed = getAllowedModulesForRole(norm);
  if (allowed.includes(moduleName)) return true;

  // Additional alias mapping for existing modules
  if (moduleName === 'placement_system' || moduleName === 'projects' || moduleName === 'project_innovation') return true;
  if (moduleName === 'reporting' && (allowed.includes('complaints') || allowed.includes('reporting'))) return true;
  if (moduleName === 'marks' && norm === 'faculty') return true;
  if (moduleName === 'my_profile' && norm === 'student') return true;
  if ((moduleName === 'my_students' || moduleName === 'students') && (norm === 'faculty' || norm === 'admin')) return true;
  if (moduleName === 'my_courses' && norm === 'faculty') return true;
  if (moduleName === 'gpa_calculator' && norm === 'student') return true;
  if (moduleName === 'downloads' && (norm === 'student' || norm === 'faculty' || norm === 'admin')) return true;

  return false;
}

/**
 * Permission check functions for fine-grained action authorization
 */
export const RBAC = {
  // Student permissions
  canViewOwnProfileOnly: (role?: string) => normalizeRole(role) === 'student',
  canViewOtherStudents: (role?: string) => ['faculty', 'admin', 'super_admin'].includes(normalizeRole(role)),
  canViewFacultyInfo: (role?: string) => ['faculty', 'admin', 'super_admin'].includes(normalizeRole(role)),
  canEditMarks: (role?: string) => ['faculty', 'admin', 'super_admin'].includes(normalizeRole(role)),
  canUploadAttendance: (role?: string) => ['faculty', 'admin', 'super_admin'].includes(normalizeRole(role)),
  canPublishResults: (role?: string) => ['admin', 'super_admin'].includes(normalizeRole(role)),
  canAssignComplaints: (role?: string) => ['faculty', 'admin', 'super_admin'].includes(normalizeRole(role)),
  canManageDepartments: (role?: string) => ['admin', 'super_admin'].includes(normalizeRole(role)),
  canManageUsers: (role?: string) => ['admin', 'super_admin'].includes(normalizeRole(role)),
  canDeleteUsers: (role?: string) => normalizeRole(role) === 'super_admin',
  canModifySuperAdmin: (role?: string) => normalizeRole(role) === 'super_admin',
  canChangeRBACPermissions: (role?: string) => normalizeRole(role) === 'super_admin',
  canChangeSecuritySettings: (role?: string) => normalizeRole(role) === 'super_admin',
  canAccessAuditLogs: (role?: string) => normalizeRole(role) === 'super_admin',
  canBackupRestoreData: (role?: string) => normalizeRole(role) === 'super_admin'
};
