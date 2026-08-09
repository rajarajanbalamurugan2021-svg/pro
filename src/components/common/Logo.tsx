import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const dimensions = {
    sm: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-base', subtext: 'text-[9px]', gap: 'gap-2' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-lg', subtext: 'text-[10px]', gap: 'gap-2.5' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-xl', subtext: 'text-xs', gap: 'gap-3' },
    xl: { box: 'w-16 h-16', icon: 'w-10 h-10', text: 'text-3xl', subtext: 'text-xs', gap: 'gap-3.5' }
  }[size];

  return (
    <div className={`flex items-center ${dimensions.gap} ${className} group cursor-pointer select-none`}>
      {/* Modern Futuristic Vector Logo Emblem */}
      <div className={`${dimensions.box} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-sky-500 p-0.5 shadow-lg shadow-blue-500/20 ring-1 ring-white/30 shrink-0 transform group-hover:scale-105 transition-all duration-300`}>
        {/* Inner Glass Layer */}
        <div className="w-full h-full rounded-[14px] bg-slate-950/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
          
          {/* Animated Background Shimmer Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-400/30 opacity-70 group-hover:opacity-100 transition-opacity" />
          
          {/* Vector Emblem Concept: Interlocking Double-C Tech Shield with Graduation Diamond */}
          <svg 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${dimensions.icon} relative z-10 transform group-hover:rotate-3 transition-transform duration-300 drop-shadow-md`}
          >
            <defs>
              <linearGradient id="primaryLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="goldCapGrad" x1="10" y1="5" x2="30" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outer Hexagon Shield Ring */}
            <path 
              d="M20 4L33 11.5V26.5L20 34L7 26.5V11.5L20 4Z" 
              stroke="url(#primaryLogoGrad)" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            />

            {/* Interlocking 'C' Tech Swoosh 1 */}
            <path 
              d="M26 13C24.2 11.2 21.8 10 19 10C13.5 10 9 14.5 9 20C9 25.5 13.5 30 19 30C22 30 24.5 28.6 26.2 26.5" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />

            {/* Interlocking 'C' Tech Swoosh 2 (Accent) */}
            <path 
              d="M31 16.5C31.7 18 32 19.5 32 21C32 26 28.5 29 24 29" 
              stroke="url(#primaryLogoGrad)" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
            />

            {/* Academic Mortarboard Top Gem */}
            <path 
              d="M20 12L12 16L20 20L28 16L20 12Z" 
              fill="url(#goldCapGrad)" 
              filter="url(#glowEffect)"
            />

            {/* Center Core Pulse Node */}
            <circle cx="20" cy="20" r="2" fill="#38bdf8" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`${dimensions.text} font-black tracking-tight text-slate-900 dark:text-white leading-none font-sans`}>
              CKCET
            </span>
            <span className={`${dimensions.text} font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent leading-none font-sans`}>
              CAMPRO
            </span>
          </div>
          <span className={`${dimensions.subtext} font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight mt-0.5`}>
            Enterprise Campus ERP
          </span>
        </div>
      )}
    </div>
  );
};

