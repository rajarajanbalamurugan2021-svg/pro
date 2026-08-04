import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base', subtext: 'text-[10px]' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-lg', subtext: 'text-xs' },
    lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xl', subtext: 'text-xs' }
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Pure Vector SVG Logo Emblem - Built entirely without PNG/JPG images */}
      <div className={`${dimensions.box} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md shadow-blue-500/25 ring-1 ring-white/20 shrink-0 overflow-hidden group hover:scale-105 transition-transform duration-300`}>
        {/* Radial highlight overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_70%)] pointer-events-none" />
        
        {/* Custom Vector Academic Emblem */}
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${dimensions.icon} relative z-10 text-white transform group-hover:rotate-6 transition-transform duration-300`}
        >
          {/* Graduation Cap Top Diamond */}
          <path 
            d="M16 4L3 11L16 18L29 11L16 4Z" 
            fill="currentColor" 
            fillOpacity="0.95"
          />
          {/* Cap Base Arch */}
          <path 
            d="M8 15.5V20.5C8 23 11.5 25 16 25C20.5 25 24 23 24 20.5V15.5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          {/* Right Tassel Hanging Down with Pearl Accent */}
          <path 
            d="M26 12.5V22.5M26 22.5L24.5 24.5M26 22.5L27.5 24.5" 
            stroke="url(#tasselGradient)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Central Star Gem Accent */}
          <circle cx="16" cy="11" r="1.75" fill="#38bdf8" />
          <defs>
            <linearGradient id="tasselGradient" x1="26" y1="12.5" x2="26" y2="24.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60a5fa" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient Corner Glow */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-sky-300/40 rounded-full blur-sm pointer-events-none" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${dimensions.text} font-black tracking-tight text-slate-900 dark:text-white leading-none flex items-center gap-1`}>
            CKCET <span className="text-blue-600 dark:text-blue-400">CAMPRO</span>
          </span>
          <span className={`${dimensions.subtext} font-semibold text-slate-500 dark:text-slate-400 leading-tight mt-0.5`}>
            Enterprise Campus ERP
          </span>
        </div>
      )}
    </div>
  );
};
