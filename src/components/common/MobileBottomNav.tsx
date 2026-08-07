import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Database,
  Menu,
  Bot
} from 'lucide-react';

interface MobileBottomNavProps {
  activeModule: string;
  onSelectModule: (mod: string) => void;
  onToggleDrawer: () => void;
  onOpenAiChat: () => void;
  unreadNotificationsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeModule,
  onSelectModule,
  onToggleDrawer,
  onOpenAiChat,
  unreadNotificationsCount = 0
}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Auto-hide bottom nav when virtual keyboard is active to avoid covering inputs
  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const isKeyboard = window.visualViewport.height < window.innerHeight - 120;
        setIsKeyboardVisible(isKeyboard);
      }
    };

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    return () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  if (isKeyboardVisible) return null;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'leave', label: 'Leaves', icon: CalendarDays },
    { id: 'project_innovation', label: 'Hub', icon: Sparkles, badge: 'Hub' },
    { id: 'cloud_db', label: 'Cloud DB', icon: Database, badge: 'Live' },
    { id: 'more', label: 'Menu', icon: Menu, isDrawerTrigger: true }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 text-slate-400 backdrop-blur-lg px-2 shadow-2xl select-none"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isDrawerTrigger && (activeModule === item.id || (item.id === 'dashboard' && activeModule === 'overview'));

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isDrawerTrigger) {
                  onToggleDrawer();
                } else {
                  onSelectModule(item.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full min-w-[54px] min-h-[44px] transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-b-full shadow-sm shadow-blue-500/50 animate-pulse" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-blue-400' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 text-[8px] font-black uppercase rounded bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
