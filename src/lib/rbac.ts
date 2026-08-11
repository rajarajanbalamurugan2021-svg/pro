import { User, UserRole } from '../types';

export type NormalizedRole = 'super_admin' | 'admin' | 'faculty' | 'student';

export const ROLE_SUPER_ADMIN = 'admin';
export const ROLE_ADMIN = 'admin';
export const ROLE_FACULTY = 'faculty';
export const ROLE_STUDENT = 'student';

/**
 * Normalizes any role string to standard canonical keys: 'admin' | 'faculty' | 'student'
 */
export function normalizeRole(role?: string | UserRole): NormalizedRole {
  if (!role) return 'student';
  const r = role.toString().toLowerCase().trim().replace(/\s+/g, '_');
  if (r === 'superadmin' || r === 'super_admin' || r === 'admin' || r === 'administrator') return 'admin';
  if (r === 'faculty' || r === 'teacher' || r === 'professor') return 'faculty';
  if (r === 'student') return 'student';
  
  // Fallbacks for existing legacy role strings
  if (r === 'department_head' || r === 'placement_officer' || r === 'recruiter' || r === 'hod') return 'admin';
  if (r === 'mentor' || r === 'maintenance_staff' || r === 'class_advisor') return 'faculty';

  return 'student';
}

export function getRoleDisplayName(role?: string | UserRole): string {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'super_admin':
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

const COMBINED_ADMIN_MENUS: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/admin/dashboard' },
  { id: 'core_engineering', label: 'Core Engineering Hub', module: 'core_engineering', iconName: 'Cpu', path: '/core_engineering', badge: 'Core Hub' },
  { id: 'gate_prep', label: 'GATE Preparation', module: 'gate_prep', iconName: 'Target', path: '/gate_prep', badge: 'GATE' },
  { id: 'higher_studies', label: 'Higher Studies & Research', module: 'higher_studies', iconName: 'GraduationCap', path: '/higher_studies', badge: 'Research' },
  { id: 'software_hub', label: 'Software & Tools Hub', module: 'software_hub', iconName: 'Wrench', path: '/software_hub', badge: 'Tools' },
  { id: 'cloud_db', label: 'Cloud Database', module: 'cloud_db', iconName: 'Download', path: '/cloud_db', badge: 'Firestore' },
  { id: 'user_management', label: 'User Management', module: 'user_management', iconName: 'Users', path: '/admin/users' },
  { id: 'students', label: 'Students', module: 'students', iconName: 'GraduationCap', path: '/admin/students' },
  { id: 'faculty', label: 'Faculty', module: 'faculty', iconName: 'UserCheck2', path: '/admin/faculty' },
  { id: 'leave', label: 'Leave Management', module: 'leave', iconName: 'CalendarDays', path: '/leave' },
  { id: 'project_innovation', label: 'Project Collaboration', module: 'project_innovation', iconName: 'Sparkles', path: '/projects', badge: 'Hub' },
  { id: 'departments', label: 'Departments', module: 'departments', iconName: 'Building2', path: '/admin/departments' },
  { id: 'courses', label: 'Courses', module: 'courses', iconName: 'BookOpen', path: '/admin/courses' },
  { id: 'complaints', label: 'Complaints', module: 'complaints', iconName: 'AlertCircle', path: '/admin/complaints' },
  { id: 'results', label: 'Results', module: 'results', iconName: 'Award', path: '/admin/results' },
  { id: 'attendance', label: 'Attendance', module: 'attendance', iconName: 'QrCode', path: '/admin/attendance' },
  { id: 'reports', label: 'Reports', module: 'reports', iconName: 'FileText', path: '/admin/reports' },
  { id: 'analytics', label: 'Analytics', module: 'analytics', iconName: 'BarChart3', path: '/admin/analytics' },
  { id: 'ai_chatbot', label: 'AI Chatbot', module: 'ai_chatbot', iconName: 'Bot', path: '/admin/ai_chatbot', badge: 'AI' },
  { id: 'system_settings', label: 'System Settings', module: 'system_settings', iconName: 'Settings', path: '/admin/settings' },
  { id: 'audit_logs', label: 'Audit Logs', module: 'audit_logs', iconName: 'ShieldAlert', path: '/admin/audit_logs', badge: 'Security' }
];

export const ROLE_SIDEBAR_MENUS: Record<NormalizedRole, MenuItem[]> = {
  super_admin: COMBINED_ADMIN_MENUS,
  admin: COMBINED_ADMIN_MENUS,
  faculty: [
    { id: 'dashboard', label: 'Faculty Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/faculty/dashboard' },
    { id: 'core_engineering', label: 'Core Engineering Hub', module: 'core_engineering', iconName: 'Cpu', path: '/core_engineering', badge: 'Core Hub' },
    { id: 'gate_prep', label: 'GATE & Academics', module: 'gate_prep', iconName: 'Target', path: '/gate_prep', badge: 'GATE' },
    { id: 'higher_studies', label: 'Research & Higher Studies', module: 'higher_studies', iconName: 'GraduationCap', path: '/higher_studies', badge: 'Research' },
    { id: 'software_hub', label: 'Software & Tools Hub', module: 'software_hub', iconName: 'Wrench', path: '/software_hub', badge: 'Tools' },
    { id: 'my_classes', label: 'My Classes', module: 'my_classes', iconName: 'Building2', path: '/faculty/classes' },
    { id: 'my_subjects', label: 'My Subjects', module: 'my_subjects', iconName: 'BookOpen', path: '/faculty/subjects' },
    { id: 'attendance', label: 'Attendance', module: 'attendance', iconName: 'CheckCircle2', path: '/faculty/attendance' },
    { id: 'marks', label: 'Marks', module: 'marks', iconName: 'FileSpreadsheet', path: '/faculty/marks' },
    { id: 'my_students', label: 'Students', module: 'my_students', iconName: 'GraduationCap', path: '/faculty/students' },
    { id: 'leave', label: 'Leave Requests', module: 'leave', iconName: 'CalendarDays', path: '/leave' },
    { id: 'reports', label: 'Reports', module: 'reports', iconName: 'FileText', path: '/faculty/reports' },
    { id: 'announcements', label: 'Announcements', module: 'announcements', iconName: 'Megaphone', path: '/faculty/announcements' }
  ],
  student: [
    { id: 'dashboard', label: 'Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/student/dashboard' },
    { id: 'core_engineering', label: 'Core Engineering Hub', module: 'core_engineering', iconName: 'Cpu', path: '/core_engineering', badge: 'Core Hub' },
    { id: 'gate_prep', label: 'GATE Preparation', module: 'gate_prep', iconName: 'Target', path: '/gate_prep', badge: 'GATE' },
    { id: 'higher_studies', label: 'Higher Studies & Research', module: 'higher_studies', iconName: 'GraduationCap', path: '/higher_studies', badge: 'Academic' },
    { id: 'software_hub', label: 'Engineering Software Hub', module: 'software_hub', iconName: 'Wrench', path: '/software_hub', badge: 'Tools' },
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

  // Cloud database modules strictly require admin
  if (moduleName === 'cloud_db' || moduleName === 'cloud_collation' || moduleName === 'firestore_hub') {
    return norm === 'admin';
  }

  // Admin has unrestricted access to everything
  if (norm === 'admin') return true;

  // General Dashboard is allowed for everyone
  if (moduleName === 'dashboard' || moduleName === 'overview' || moduleName === 'placement') return true;

  const allowed = getAllowedModulesForRole(norm);
  if (allowed.includes(moduleName)) return true;

  // Additional alias mapping for existing modules
  if (moduleName === 'core_engineering' || moduleName === 'gate_prep' || moduleName === 'higher_studies' || moduleName === 'software_hub' || moduleName === 'core_careers') return true;
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
  // Cloud Database access control
  canAccessCloudDatabase: (role?: string) => normalizeRole(role) === 'admin',
  // Student permissions
  canViewOwnProfileOnly: (role?: string) => normalizeRole(role) === 'student',
  canViewOtherStudents: (role?: string) => ['faculty', 'admin'].includes(normalizeRole(role)),
  canViewFacultyInfo: (role?: string) => ['faculty', 'admin'].includes(normalizeRole(role)),
  canEditMarks: (role?: string) => ['faculty', 'admin'].includes(normalizeRole(role)),
  canUploadAttendance: (role?: string) => ['faculty', 'admin'].includes(normalizeRole(role)),
  canPublishResults: (role?: string) => normalizeRole(role) === 'admin',
  canAssignComplaints: (role?: string) => ['faculty', 'admin'].includes(normalizeRole(role)),
  canManageDepartments: (role?: string) => normalizeRole(role) === 'admin',
  canManageUsers: (role?: string) => normalizeRole(role) === 'admin',
  canDeleteUsers: (role?: string) => normalizeRole(role) === 'admin',
  canModifySuperAdmin: (role?: string) => normalizeRole(role) === 'admin',
  canChangeRBACPermissions: (role?: string) => normalizeRole(role) === 'admin',
  canChangeSecuritySettings: (role?: string) => normalizeRole(role) === 'admin',
  canAccessAuditLogs: (role?: string) => normalizeRole(role) === 'admin',
  canBackupRestoreData: (role?: string) => normalizeRole(role) === 'admin'
};

