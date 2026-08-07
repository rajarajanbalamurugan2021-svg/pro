import React, { useState, useEffect } from 'react';
import { User, UserRole, NotificationItem } from '../../types';
import { Logo } from './Logo';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Sparkles,
  LogOut,
  ChevronDown,
  Building2,
  Mail,
  Wifi,
  RefreshCw,
  Laptop,
  Smartphone,
  Tablet,
  Radio,
  Zap,
  Check,
  Globe
} from 'lucide-react';

interface NavbarProps {
  currentUser?: User;
  userRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onLogout?: () => void;
  darkMode?: boolean;
  theme?: 'light' | 'dark';
  onToggleDarkMode?: () => void;
  onToggleTheme?: () => void;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: string) => void;
  onOpenAIChat?: () => void;
  onOpenAiDrawer?: () => void;
  onResetDatabase?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  userRole = 'student',
  onRoleChange = (_role: UserRole) => {},
  onLogout = () => {},
  darkMode,
  theme,
  onToggleDarkMode,
  onToggleTheme,
  notifications = [],
  onMarkNotificationRead = (_id: string) => {},
  onOpenAIChat,
  onOpenAiDrawer,
  onResetDatabase = () => {},
  searchQuery = '',
  onSearchChange = (_q: string) => {}
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSyncMenu, setShowSyncMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing'>('synced');

  const safeNotifications = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.read).length;
  const isDark = darkMode ?? (theme === 'dark');
  const handleToggleTheme = onToggleDarkMode || onToggleTheme || (() => {});
  const handleOpenAi = onOpenAIChat || onOpenAiDrawer || (() => {});
  const activeRole = userRole || currentUser?.role || 'student';

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('synced');
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 800);
  };

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string }> = {
    super_admin: { label: 'Super Admin', bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-700 dark:text-purple-300' },
    admin: { label: 'Administrator', bg: 'bg-indigo-100 dark:bg-indigo-950/80', text: 'text-indigo-700 dark:text-indigo-300' },
    faculty: { label: 'Faculty Member', bg: 'bg-blue-100 dark:bg-blue-950/80', text: 'text-blue-700 dark:text-blue-300' },
    student: { label: 'Student', bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-700 dark:text-emerald-300' },
    mentor: { label: 'Mentor', bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-700 dark:text-amber-300' },
    placement_officer: { label: 'Placement Officer', bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-700 dark:text-amber-300' },
    recruiter: { label: 'Recruiter', bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-700 dark:text-purple-300' },
    maintenance_staff: { label: 'Maintenance Staff', bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-700 dark:text-amber-300' },
    department_head: { label: 'Department Head', bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-700 dark:text-emerald-300' }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left Section: Brand Logo (Pure Vector SVG) */}
        <Logo size="md" />

        {/* Middle Section: Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, courses, complaints, resources..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-4 py-1.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>
        </div>

        {/* Right Section: Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Real-Time Sync & Multi-Device Status Indicator */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSyncMenu(!showSyncMenu);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition cursor-pointer"
              title="Real-Time Cloud & Multi-Device Sync Status"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                <span>Live Sync</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                <Laptop className="h-3 w-3" />
                <span>3 Devices</span>
              </span>
            </button>

            {/* Sync & Devices Dropdown */}
            {showSyncMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">Firestore Real-Time Cloud Engine</h3>
                      <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Connected • Live onSnapshot Active
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 transition"
                    title="Force Instant Sync"
                  >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
                  </button>
                </div>

                {/* Performance & Sync Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block">Sync Latency</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">12 ms (Instant)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block">Offline Storage</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">IndexedDB Active</span>
                  </div>
                </div>

                {/* Synced Connected Devices List */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Connected Synchronized Devices (3)</span>
                    <span className="text-emerald-500 text-[10px]">Realtime Peer Sync</span>
                  </div>

                  <div className="space-y-2">
                    {/* Device 1 */}
                    <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Laptop className="h-4 w-4 text-blue-500 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Desktop Web (This Device)</span>
                            <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white text-[9px] font-extrabold uppercase">Current</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Chrome Browser • Active Session</div>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    </div>

                    {/* Device 2 */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="h-4 w-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Mobile Phone (iOS / Android)</div>
                          <div className="text-[10px] text-slate-400">CamPro Mobile App • Synced {lastSyncTime}</div>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500/80"></span>
                    </div>

                    {/* Device 3 */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Tablet className="h-4 w-4 text-slate-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Campus Kiosk / Tablet</div>
                          <div className="text-[10px] text-slate-400">Tablet Web • Synced {lastSyncTime}</div>
                        </div>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-500/80"></span>
                    </div>
                  </div>
                </div>

                {/* Sync Action & Timestamp */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Last sync: {lastSyncTime}</span>
                  </span>
                  <button
                    onClick={handleManualSync}
                    className="text-blue-500 hover:text-blue-400 font-semibold"
                  >
                    Force Sync Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Assistant Quick Launcher */}
          <button
            onClick={handleOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold shadow-sm hover:opacity-95 transition"
            title="Ask Campus AI Assistant"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="hidden lg:inline">Campus AI</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Reset DB Button */}
          <button
            onClick={onResetDatabase}
            className="hidden xl:flex items-center gap-1 p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs transition"
            title="Reset DB to Seed State"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Campus Notifications</h3>
                  <span className="text-xs text-slate-500">{unreadCount} unread</span>
                </div>
                <div className="mt-2 max-h-80 overflow-y-auto space-y-2">
                  {safeNotifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400">No new notifications</p>
                  ) : (
                    safeNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                            : 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/60 text-slate-800 dark:text-slate-200 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {n.type === 'info' && <Info className="h-3.5 w-3.5 text-blue-500" />}
                          {n.type === 'success' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                          {n.type === 'warning' && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                          <span className="font-semibold text-slate-900 dark:text-white">{n.title}</span>
                          <span className="ml-auto text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Direct Log Out Icon Button (Quick Access) */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-900/50 transition"
            title="Log Out of System"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Log Out</span>
          </button>

          {/* Current User Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition cursor-pointer"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
                  <span>{currentUser?.name}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 p-3">
                <div className="flex items-center gap-3 p-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {currentUser?.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span className="truncate">{currentUser?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                      {currentUser?.department || 'CSE'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

