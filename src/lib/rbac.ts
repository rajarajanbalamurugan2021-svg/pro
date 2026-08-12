import { User, UserRole } from '../types';

export type NormalizedRole = 'super_admin' | 'admin' | 'faculty' | 'student';

export const ROLE_SUPER_ADMIN = 'super_admin';
export const ROLE_ADMIN = 'admin';
export const ROLE_FACULTY = 'faculty';
export const ROLE_STUDENT = 'student';

/**
 * Normalizes any role string to standard canonical keys:
 * 'super_admin' | 'admin' | 'faculty' | 'student'
 */
export function normalizeRole(role?: string | UserRole): NormalizedRole {
  if (!role) return 'student';
  const r = role.toString().toLowerCase().trim().replace(/\s+/g, '_');
  
  if (r === 'superadmin' || r === 'super_admin') return 'super_admin';
  if (r === 'admin' || r === 'administrator') return 'admin';
  if (r === 'faculty' || r === 'teacher' || r === 'professor') return 'faculty';
  if (r === 'student') return 'student';
  
  // Mapping for legacy roles
  if (r === 'department_head' || r === 'hod' || r === 'placement_officer') return 'admin';
  if (r === 'recruiter' || r === 'mentor' || r === 'maintenance_staff' || r === 'class_advisor') return 'faculty';

  return 'student';
}

/**
 * Returns human-readable display string for role/portal
 */
export function getRoleDisplayName(role?: string | UserRole): string {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'super_admin': return 'Super Admin';
    case 'admin': return 'Admin';
    case 'faculty': return 'Faculty';
    case 'student': return 'Student';
    default: return 'Student';
  }
}

/**
 * Returns human-readable portal label
 */
export function getPortalDisplayName(portal?: NormalizedRole): string {
  switch (portal) {
    case 'super_admin': return 'Super Admin Portal';
    case 'admin': return 'Admin Portal';
    case 'faculty': return 'Faculty Portal';
    case 'student': return 'Student Portal';
    default: return 'Student Portal';
  }
}

/**
 * Derives the list of authorized portals for a given user.
 * Explicitly respects user.roles array or user.role fallback.
 */
export function getUserAuthorizedPortals(user?: User | null): NormalizedRole[] {
  if (!user) return ['student'];

  const rawRoles: string[] = [];
  
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    user.roles.forEach(r => rawRoles.push(r));
  }
  if (user.role) {
    rawRoles.push(user.role);
  }
  
  if (rawRoles.length === 0) {
    rawRoles.push('student');
  }

  const portalSet = new Set<NormalizedRole>();
  rawRoles.forEach((r) => {
    portalSet.add(normalizeRole(r));
  });

  // If user is super_admin, they are authorized for all 4 portals
  if (portalSet.has('super_admin')) {
    portalSet.add('admin');
    portalSet.add('faculty');
    portalSet.add('student');
  }

  // Priority order: super_admin > admin > faculty > student
  const priorityOrder: NormalizedRole[] = ['super_admin', 'admin', 'faculty', 'student'];
  return priorityOrder.filter((p) => portalSet.has(p));
}

/**
 * Checks if user is authorized to enter a specific portal
 */
export function canAccessPortal(user: User | null, portal: NormalizedRole): boolean {
  if (!user) return false;
  const authorized = getUserAuthorizedPortals(user);
  return authorized.includes(portal);
}

/**
 * Sidebar Navigation Items per Portal
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
    { id: 'dashboard', label: 'Super Admin Dashboard', module: 'dashboard', iconName: 'Crown', path: '/superadmin/dashboard' },
    { id: 'communication_hub', label: 'Communication Hub', module: 'communication', iconName: 'MessageSquare', path: '/communication', badge: 'Hub' },
    { id: 'user_management', label: 'User & Role Management', module: 'user_management', iconName: 'Users', path: '/admin/users', badge: 'Master' },
    { id: 'role_permissions', label: 'Role Permissions Matrix', module: 'system_settings', iconName: 'ShieldAlert', path: '/admin/permissions', badge: 'RBAC' },
    { id: 'mentoring_config', label: 'Mentoring Configuration', module: 'mentor', iconName: 'UserCheck2', path: '/superadmin/mentor', badge: 'Config' },
    { id: 'core_engineering_cms', label: 'Core Engineering CMS', module: 'core_engineering', iconName: 'Cpu', path: '/core_engineering', badge: 'CMS' },
    { id: 'gate_mgmt', label: 'GATE Management', module: 'gate_prep', iconName: 'Target', path: '/gate_prep' },
    { id: 'cloud_db', label: 'Cloud DB & Firestore', module: 'cloud_db', iconName: 'Download', path: '/cloud_db', badge: 'Firestore' },
    { id: 'departments', label: 'Department Management', module: 'departments', iconName: 'Building2', path: '/admin/departments' },
    { id: 'courses', label: 'Course Management', module: 'courses', iconName: 'BookOpen', path: '/admin/courses' },
    { id: 'students', label: 'Student Directory', module: 'students', iconName: 'GraduationCap', path: '/admin/students' },
    { id: 'faculty', label: 'Faculty Directory', module: 'faculty', iconName: 'UserCheck2', path: '/admin/faculty' },
    { id: 'higher_studies', label: 'Higher Studies & Research', module: 'higher_studies', iconName: 'GraduationCap', path: '/higher_studies' },
    { id: 'software_hub', label: 'Software & Tools Hub', module: 'software_hub', iconName: 'Wrench', path: '/software_hub' },
    { id: 'reports', label: 'System Reports', module: 'reports', iconName: 'FileText', path: '/admin/reports' },
    { id: 'analytics', label: 'Institutional Analytics', module: 'analytics', iconName: 'BarChart3', path: '/admin/analytics' },
    { id: 'system_settings', label: 'System Configuration', module: 'system_settings', iconName: 'Settings', path: '/admin/settings' },
    { id: 'audit_logs', label: 'Audit Logs', module: 'audit_logs', iconName: 'ShieldAlert', path: '/admin/audit_logs', badge: 'Security' }
  ],
  admin: [
    { id: 'dashboard', label: 'Admin Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/admin/dashboard' },
    { id: 'communication_hub', label: 'Communication Hub', module: 'communication', iconName: 'MessageSquare', path: '/communication', badge: 'Hub' },
    { id: 'mentoring_mgmt', label: 'Mentoring Management', module: 'mentor', iconName: 'UserCheck2', path: '/admin/mentor', badge: 'Mgmt' },
    { id: 'students', label: 'Students', module: 'students', iconName: 'GraduationCap', path: '/admin/students' },
    { id: 'faculty', label: 'Faculty', module: 'faculty', iconName: 'UserCheck2', path: '/admin/faculty' },
    { id: 'departments', label: 'Departments', module: 'departments', iconName: 'Building2', path: '/admin/departments' },
    { id: 'courses', label: 'Courses', module: 'courses', iconName: 'BookOpen', path: '/admin/courses' },
    { id: 'results', label: 'Results & Marks', module: 'results', iconName: 'Award', path: '/admin/results' },
    { id: 'attendance', label: 'Attendance Management', module: 'attendance', iconName: 'QrCode', path: '/admin/attendance' },
    { id: 'complaints', label: 'Complaints System', module: 'complaints', iconName: 'AlertCircle', path: '/admin/complaints' },
    { id: 'leave', label: 'Leave Management', module: 'leave', iconName: 'CalendarDays', path: '/leave' },
    { id: 'gate_prep', label: 'GATE Preparation', module: 'gate_prep', iconName: 'Target', path: '/gate_prep', badge: 'GATE' },
    { id: 'core_engineering', label: 'Core Engineering', module: 'core_engineering', iconName: 'Cpu', path: '/core_engineering' },
    { id: 'reports', label: 'Reports', module: 'reports', iconName: 'FileText', path: '/admin/reports' },
    { id: 'analytics', label: 'Analytics', module: 'analytics', iconName: 'BarChart3', path: '/admin/analytics' },
    { id: 'system_settings', label: 'Settings', module: 'system_settings', iconName: 'Settings', path: '/admin/settings' }
  ],
  faculty: [
    { id: 'dashboard', label: 'Faculty Dashboard', module: 'dashboard', iconName: 'LayoutDashboard', path: '/faculty/dashboard' },
    { id: 'communication_hub', label: 'Communication Hub', module: 'communication', iconName: 'MessageSquare', path: '/communication', badge: 'Messages' },
    { id: 'mentor', label: 'Mentor–Mentee Hub', module: 'mentor', iconName: 'UserCheck2', path: '/faculty/mentor', badge: 'Advisory' },
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
    { id: 'communication_hub', label: 'Communication Hub', module: 'communication', iconName: 'MessageSquare', path: '/communication', badge: 'Chat' },
    { id: 'my_mentor', label: 'My Mentor', module: 'mentor', iconName: 'UserCheck2', path: '/student/mentor', badge: 'Mentoring' },
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
 * Returns allowed module list for a given portal
 */
export function getAllowedModulesForRole(portal?: string | UserRole): string[] {
  const norm = normalizeRole(portal);
  const menu = ROLE_SIDEBAR_MENUS[norm] || ROLE_SIDEBAR_MENUS.student;
  return menu.map((m) => m.module);
}

/**
 * Checks if a module is allowed under activePortal and user permissions
 */
export function canAccessModule(role?: string | UserRole, moduleName?: string): boolean {
  if (!moduleName) return true;
  const norm = normalizeRole(role);

  if (moduleName === 'cloud_db' || moduleName === 'cloud_collation' || moduleName === 'firestore_hub') {
    return norm === 'super_admin' || norm === 'admin';
  }

  if (norm === 'super_admin') return true;
  if (norm === 'admin') return true;

  if (moduleName === 'dashboard' || moduleName === 'overview' || moduleName === 'placement') return true;

  const allowed = getAllowedModulesForRole(norm);
  if (allowed.includes(moduleName)) return true;

  if (moduleName === 'core_engineering' || moduleName === 'gate_prep' || moduleName === 'higher_studies' || moduleName === 'software_hub' || moduleName === 'core_careers') return true;
  if (moduleName === 'placement_system' || moduleName === 'projects' || moduleName === 'project_innovation') return true;
  if (moduleName === 'reporting' && (allowed.includes('complaints') || allowed.includes('reporting'))) return true;
  if (moduleName === 'marks' && norm === 'faculty') return true;
  if (moduleName === 'my_profile' && norm === 'student') return true;
  if ((moduleName === 'my_students' || moduleName === 'students') && norm === 'faculty') return true;
  if (moduleName === 'my_courses' && norm === 'faculty') return true;
  if (moduleName === 'gpa_calculator' && norm === 'student') return true;
  if (moduleName === 'downloads' && (norm === 'student' || norm === 'faculty')) return true;

  return false;
}

/**
 * Permission check functions for fine-grained action authorization
 */
export const RBAC = {
  canAccessCloudDatabase: (role?: string) => ['super_admin', 'admin'].includes(normalizeRole(role)),
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
  canChangeSecuritySettings: (role?: string) => ['admin', 'super_admin'].includes(normalizeRole(role)),
  canAccessAuditLogs: (role?: string) => ['admin', 'super_admin'].includes(normalizeRole(role)),
  canBackupRestoreData: (role?: string) => ['admin', 'super_admin'].includes(normalizeRole(role))
};
