import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  Award,
  AlertCircle,
  PackageSearch,
  BookOpenCheck,
  UserCheck2,
  Users,
  CalendarDays,
  QrCode,
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'result_portal'
  | 'reporting_system'
  | 'lost_found'
  | 'collaboration'
  | 'mentor_mentee'
  | 'community'
  | 'leave_management'
  | 'lab_attendance'
  | 'admin_panel';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole: UserRole;
  pendingComplaintsCount: number;
  pendingLeavesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  pendingComplaintsCount,
  pendingLeavesCount
}) => {
  const isAdminOrSuper = userRole === 'admin' || userRole === 'super_admin';

  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Campus Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'result_portal' as ActiveTab,
      label: '1. Result Portal & GPA',
      icon: Award,
      badge: 'GPA/CGPA'
    },
    {
      id: 'reporting_system' as ActiveTab,
      label: '2. Complaint Portal',
      icon: AlertCircle,
      badge: pendingComplaintsCount > 0 ? `${pendingComplaintsCount}` : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'lost_found' as ActiveTab,
      label: '3. Lost & Found Hub',
      icon: PackageSearch,
      badge: null
    },
    {
      id: 'collaboration' as ActiveTab,
      label: '4. Academic Resources',
      icon: BookOpenCheck,
      badge: 'Share Notes'
    },
    {
      id: 'mentor_mentee' as ActiveTab,
      label: '5. Mentor-Mentee',
      icon: UserCheck2,
      badge: null
    },
    {
      id: 'community' as ActiveTab,
      label: '6. Community Hub',
      icon: Users,
      badge: 'Forum'
    },
    {
      id: 'leave_management' as ActiveTab,
      label: '7. Student Leave Portal',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 ? `${pendingLeavesCount}` : null,
      badgeColor: 'bg-indigo-500 text-white'
    },
    {
      id: 'lab_attendance' as ActiveTab,
      label: '8. Lab Attendance (QR)',
      icon: QrCode,
      badge: 'QR Scan'
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Campus Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor
                      ? item.badgeColor
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Panel Section */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Administration
        </div>
        <button
          onClick={() => onTabChange('admin_panel')}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'admin_panel'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Campus Admin Control</span>
          </div>
          {isAdminOrSuper && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              FULL
            </span>
          )}
        </button>
      </div>

      {/* AI Smart Badge Widget */}
      <div className="mt-auto pt-6">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900/50 shadow-lg">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold">Smart Campus AI</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Powered by server-side Gemini 3.6 API for grade prediction & complaint classification.
          </p>
        </div>
      </div>
    </aside>
  );
};
