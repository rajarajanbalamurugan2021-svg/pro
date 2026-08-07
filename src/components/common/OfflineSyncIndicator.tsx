import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Check } from 'lucide-react';

export const OfflineSyncIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      setShowToast(true);
      setTimeout(() => {
        setIsSyncing(false);
      }, 1500);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Status Badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs backdrop-blur-md transition-all">
        {isOnline ? (
          isSyncing ? (
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800">
              <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
              <span>Syncing...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3 h-3 text-emerald-500" />
              <span>Online</span>
            </span>
          )
        ) : (
          <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <WifiOff className="w-3 h-3 text-amber-500" />
            <span>Offline (Cached)</span>
          </span>
        )}
      </div>

      {/* Connectivity Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-16 left-1/2 -translate-x-1/2 z-[9990] px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 animate-bounce ${
            isOnline
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-amber-900 text-white border-amber-700'
          }`}
        >
          {isOnline ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Internet Restored • Synchronizing Firestore Data</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Offline Mode Active • Showing Cached Data</span>
            </>
          )}
        </div>
      )}
    </>
  );
};
