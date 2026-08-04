import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, KeyRound, AlertTriangle } from 'lucide-react';
import { UserRole } from '../../types';
import { getRoleDisplayName } from '../../lib/rbac';

interface AccessDeniedPageProps {
  userRole?: UserRole;
  requiredRole?: string;
  moduleName?: string;
  onReturnHome?: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  userRole = 'student',
  requiredRole,
  moduleName = 'Restricted Page',
  onReturnHome
}) => {
  const formattedRole = getRoleDisplayName(userRole);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 shadow-2xl relative overflow-hidden">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-rose-600 to-amber-500" />

        {/* Shield Lock Icon Badge */}
        <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-red-100 dark:bg-red-950/80 border border-red-200 dark:border-red-900 flex items-center justify-center text-red-600 dark:text-red-400 shadow-xl shadow-red-500/10 ring-8 ring-red-50 dark:ring-red-950/30">
          <ShieldAlert className="h-10 w-10 animate-bounce" />
        </div>

        {/* 403 Status Code Header */}
        <div className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-black uppercase tracking-widest bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          HTTP 403 Forbidden Error
        </div>

        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          Access Denied
        </h1>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed max-w-sm mx-auto">
          Your account role (<span className="font-bold text-red-600 dark:text-red-400">{formattedRole}</span>) does not have authorization to view <span className="font-extrabold text-slate-900 dark:text-white">"{moduleName}"</span> or access its restricted database records.
        </p>

        {/* RBAC Security Details Box */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-bold">
              <KeyRound className="h-3.5 w-3.5 text-slate-400" /> Current Active Role:
            </span>
            <span className="font-extrabold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {formattedRole}
            </span>
          </div>

          {requiredRole && (
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Lock className="h-3.5 w-3.5 text-amber-500" /> Required Role Level:
              </span>
              <span className="font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {requiredRole}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Unauthorized route navigation attempt logged in RBAC Security Audit.</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onReturnHome}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Authorized Dashboard</span>
        </button>

      </div>
    </div>
  );
};
