import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, Wifi } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1400
}) => {
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, durationMs - 400);

    const finishTimer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-slate-950 text-white p-6 transition-opacity duration-400 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'calc(1.5rem + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      {/* Top Android App Header */}
      <div className="w-full flex items-center justify-between text-slate-400 text-xs font-mono">
        <span className="flex items-center gap-1.5 font-bold text-blue-400">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>CKCET CAMPRO</span>
        </span>
        <span className="flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Firestore Engine</span>
        </span>
      </div>

      {/* Main Branding Center */}
      <div className="flex flex-col items-center text-center space-y-5 my-auto max-w-sm">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
          <div className="relative w-28 h-28 rounded-3xl bg-slate-900 border-2 border-slate-700/80 p-3 shadow-2xl flex items-center justify-center">
            <img
              src="/logo.png"
              alt="CKCET CAMPRO Logo"
              className="w-full h-full object-contain drop-shadow-md"
              onError={(e) => {
                // Fallback to pure SVG vector logo
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden border-4 border-blue-500/20 w-full h-full rounded-2xl flex items-center justify-center bg-blue-950/60 text-blue-400 font-extrabold text-2xl">
              CK
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            CKCET CAMPRO
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Smart Campus Portal
          </p>
          <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto font-medium">
            Christ The King Engineering College
          </p>
        </div>

        {/* Animated Loading Progress */}
        <div className="w-48 space-y-2 pt-2">
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
            <div className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-full animate-pulse w-full"></div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider">
            Initializing Firebase Session...
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Android App Experience • PWA Offline Ready</span>
        </div>
        <p className="text-[9px] text-slate-600 font-mono">
          v2.5.0 • Powered by Google Firebase
        </p>
      </div>
    </div>
  );
};
