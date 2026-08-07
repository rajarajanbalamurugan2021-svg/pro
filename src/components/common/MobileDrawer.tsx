import React from 'react';
import { User, UserRole } from '../../types';
import { normalizeRole, ROLE_SIDEBAR_MENUS, MenuItem } from '../../lib/rbac';
import { Logo } from './Logo';
import { OfflineSyncIndicator } from './OfflineSyncIndicator';
import {
  X,
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
  ChevronRight,
  Shield,
  Smartphone,
  Search,
  RotateCcw
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeModule: string;
  onSelectModule: (mod: string) => void;
  onLogout: () => void;
  onOpenAiChat: () => void;
  onResetDatabase?: () => void;
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

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  userRole,
  onRoleChange,
  activeModule,
  onSelectModule,
  onLogout,
  onOpenAiChat,
  onResetDatabase
}) => {
  if (!isOpen) return null;

  const normRole = normalizeRole(userRole);
  const menuItems: MenuItem[] = ROLE_SIDEBAR_MENUS[normRole] || ROLE_SIDEBAR_MENUS.student;

  const handleItemClick = (item: MenuItem) => {
    if (item.module === 'ai_chatbot') {
      onOpenAiChat();
    } else {
      onSelectModule(item.module);
    }
    onClose();
  };

  const roleOptions: { role: UserRole; label: string }[] = [
    { role: 'student', label: 'Student' },
    { role: 'faculty', label: 'Faculty' },
    { role: 'admin', label: 'Administrator' },
    { role: 'super_admin', label: 'Super Admin' }
  ];

  return (
    <div className="md:hidden fixed inset-0 z-[9990] flex select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm animate-fade-in transition-opacity"
      />

      {/* Drawer Panel */}
      <div
        className="relative w-4/5 max-w-xs bg-slate-900 text-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-r border-slate-800 animate-slide-right"
        style={{
          paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50 shadow-md"
            />
            <div className="overflow-hidden">
              <div className="font-bold text-sm text-white truncate">{currentUser.name}</div>
              <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {userRole.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400">{currentUser.department || 'CSE'}</span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher Chip Selector */}
          <div className="space-y-1 pt-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Role View
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {roleOptions.map((opt) => (
                <button
                  key={opt.role}
                  onClick={() => onRoleChange(opt.role)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center border transition ${
                    userRole === opt.role
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Network Sync Status */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <OfflineSyncIndicator />
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-extrabold shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
              <span>AI Chat</span>
            </button>
          </div>
        </div>

        {/* Module Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
            Campus Modules
          </div>

          {menuItems.map((item) => {
            const IconComp = ICON_MAP[item.iconName] || LayoutDashboard;
            const isActive = activeModule === item.module;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition active:scale-98 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
          {onResetDatabase && (
            <button
              onClick={() => {
                onResetDatabase();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Database Seed</span>
            </button>
          )}

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-extrabold shadow-md transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
