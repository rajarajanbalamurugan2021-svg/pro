import React from 'react';
import { UserRole } from '../../types';
import { normalizeRole, ROLE_SIDEBAR_MENUS, MenuItem } from '../../lib/rbac';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck2,
  Building2,
  BookOpen,
  AlertCircle,
  Award,
  QrCode,
  FileText,
  BarChart3,
  Bot,
  Settings,
  ShieldAlert,
  FileSpreadsheet,
  Megaphone,
  User as UserIcon,
  Calculator,
  Download,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  activeModule?: string;
  onTabChange?: (tab: string) => void;
  onSelectModule?: (mod: string) => void;
  onModuleChange?: (mod: string) => void;
  onLogout?: () => void;
  onOpenAiChatbot?: () => void;
  userRole?: UserRole;
  pendingComplaintsCount?: number;
  pendingLeavesCount?: number;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck2,
  Building2,
  BookOpen,
  AlertCircle,
  Award,
  QrCode,
  FileText,
  BarChart3,
  Bot,
  Settings,
  ShieldAlert,
  FileSpreadsheet,
  Megaphone,
  User: UserIcon,
  Calculator,
  Download
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  activeModule,
  onTabChange,
  onSelectModule,
  onModuleChange,
  onLogout,
  onOpenAiChatbot,
  userRole = 'student',
  pendingComplaintsCount = 0
}) => {
  const normRole = normalizeRole(userRole);
  const currentTab = activeModule || activeTab || 'dashboard';

  const menuItems: MenuItem[] = ROLE_SIDEBAR_MENUS[normRole] || ROLE_SIDEBAR_MENUS.student;

  const handleSelect = (item: MenuItem) => {
    if (item.module === 'ai_chatbot' && onOpenAiChatbot) {
      onOpenAiChatbot();
    }

    const mod = item.module;
    if (onSelectModule) onSelectModule(mod);
    if (onTabChange) onTabChange(mod);
    if (onModuleChange) onModuleChange(mod);
  };

  const isItemActive = (item: MenuItem) => {
    if (currentTab === item.module) return true;
    if (item.module === 'dashboard' && (currentTab === 'overview' || currentTab === 'placement')) return true;
    if (item.module === 'results' && currentTab === 'result_portal') return true;
    if (item.module === 'complaints' && currentTab === 'reporting') return true;
    if (item.module === 'attendance' && currentTab === 'lab_attendance') return true;
    if (item.module === 'downloads' && currentTab === 'collaboration') return true;
    if (item.module === 'gpa_calculator' && currentTab === 'calculator') return true;
    if (item.module === 'user_management' && currentTab === 'admin') return true;
    return false;
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4 transition-colors">
      
      {/* Role Indicator Header */}
      <div className="mb-4 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${
            normRole === 'super_admin' ? 'bg-purple-500 animate-pulse' :
            normRole === 'admin' ? 'bg-indigo-500' :
            normRole === 'faculty' ? 'bg-blue-500' : 'bg-emerald-500'
          }`} />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {normRole.replace('_', ' ')} Portal
          </span>
        </div>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          RBAC Active
        </span>
      </div>

      {/* Dynamic Role-Based Navigation Items */}
      <div className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-thin">
        <div className="px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Authorized Menu ({menuItems.length})
        </div>

        {menuItems.map((item) => {
          const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
          const isActive = isItemActive(item);
          const showBadge = item.badge || (item.module === 'complaints' && pendingComplaintsCount > 0 ? `${pendingComplaintsCount}` : null);

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <IconComponent className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              
              {showBadge && (
                <span
                  className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor
                      ? item.badgeColor
                      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                  }`}
                >
                  {showBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Actions & Logout */}
      <div className="mt-auto pt-4 space-y-3 border-t border-slate-100 dark:border-slate-800">
        
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-xs font-bold transition shadow-sm active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        )}

        {/* Security Badge */}
        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[11px] font-bold text-white">Smart Campus RBAC</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Strict role isolation enabled. Routes, menus & API access verified server-side.
          </p>
        </div>
      </div>
    </aside>
  );
};
