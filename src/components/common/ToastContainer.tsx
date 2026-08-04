import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../../types';
import {
  AlertTriangle,
  FileText,
  CheckCircle2,
  Info,
  X,
  ArrowRight,
  ShieldAlert,
  Bell
} from 'lucide-react';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'complaint' | 'leave' | 'info' | 'success' | 'warning';
  timestamp: string;
  targetRoles?: UserRole[];
  actionModule?: string;
  actionLabel?: string;
}

interface ToastContainerProps {
  toasts: ToastNotification[];
  userRole: UserRole;
  onDismiss: (id: string) => void;
  onNavigateModule?: (moduleName: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  userRole,
  onDismiss,
  onNavigateModule
}) => {
  // Filter toasts visible to current role
  const visibleToasts = toasts.filter((t) => {
    if (!t.targetRoles || t.targetRoles.length === 0) return true;
    return t.targetRoles.includes(userRole);
  });

  if (visibleToasts.length === 0) return null;

  const getIcon = (type: ToastNotification['type']) => {
    switch (type) {
      case 'complaint':
        return <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />;
      case 'leave':
        return <FileText className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500 shrink-0" />;
    }
  };

  const getTypeStyles = (type: ToastNotification['type']) => {
    switch (type) {
      case 'complaint':
        return 'border-l-4 border-l-red-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-red-500/10';
      case 'leave':
        return 'border-l-4 border-l-amber-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-amber-500/10';
      case 'success':
        return 'border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-emerald-500/10';
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-amber-500/10';
      default:
        return 'border-l-4 border-l-blue-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-blue-500/10';
    }
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {visibleToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl backdrop-blur-md flex flex-col gap-2 relative ${getTypeStyles(
              toast.type
            )}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {getIcon(toast.type)}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {toast.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {toast.timestamp}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Message Body */}
            <p className="text-xs text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
              {toast.message}
            </p>

            {/* Action button if present */}
            {toast.actionModule && onNavigateModule && (
              <div className="pl-7 pt-1">
                <button
                  onClick={() => {
                    onNavigateModule(toast.actionModule!);
                    onDismiss(toast.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
                >
                  <span>{toast.actionLabel || 'View Details'}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
