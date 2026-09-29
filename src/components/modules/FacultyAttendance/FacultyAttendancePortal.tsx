import React, { useState } from 'react';
import { User, UserRole } from '../../../types';
import { TakeAttendanceTab } from './TakeAttendanceTab';
import { AttendanceHistoryTab } from './AttendanceHistoryTab';
import { LowAttendanceAlertsTab } from './LowAttendanceAlertsTab';
import { AttendanceAnalyticsTab } from './AttendanceAnalyticsTab';
import { AttendanceReportsTab } from './AttendanceReportsTab';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart3,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface FacultyAttendancePortalProps {
  currentUser?: User;
  userRole: UserRole;
}

export const FacultyAttendancePortal: React.FC<FacultyAttendancePortalProps> = ({ currentUser, userRole }) => {
  const [activeTab, setActiveTab] = useState<'take' | 'history' | 'alerts' | 'analytics' | 'reports'>('take');

  return (
    <div className="space-y-6">
      
      {/* Top Main Module Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> CAMPRO Enterprise ERP • Faculty Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Faculty Attendance Management Module
          </h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Comprehensive period-wise student attendance taking, auto-fill leave/OD permissions, audit history tracking, and shortage warning system.
          </p>
        </div>

        {/* Quick Role / User Info Badge */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
          <BookOpen className="w-6 h-6 text-amber-300" />
          <div className="text-xs">
            <div className="font-extrabold text-white">{currentUser?.name || 'Faculty User'}</div>
            <div className="text-blue-200 text-[10px] uppercase font-bold">{userRole.replace('_', ' ')} • {currentUser?.department || 'ECE'}</div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-extrabold">
        {[
          { id: 'take', label: 'Take Attendance', icon: CheckCircle2 },
          { id: 'history', label: 'Attendance History', icon: Clock },
          { id: 'alerts', label: 'Low Attendance Alerts (<75%)', icon: ShieldAlert },
          { id: 'analytics', label: 'Analytics & Intelligence', icon: BarChart3 },
          { id: 'reports', label: 'Reports & Exports', icon: FileSpreadsheet }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'take' && <TakeAttendanceTab currentUser={currentUser} onSuccessSubmit={() => setActiveTab('history')} />}
        {activeTab === 'history' && <AttendanceHistoryTab currentUser={currentUser} />}
        {activeTab === 'alerts' && <LowAttendanceAlertsTab />}
        {activeTab === 'analytics' && <AttendanceAnalyticsTab />}
        {activeTab === 'reports' && <AttendanceReportsTab />}
      </div>

    </div>
  );
};
