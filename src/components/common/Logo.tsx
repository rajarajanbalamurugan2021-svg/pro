import React, { useState, useEffect } from 'react';
import { CampusLogoConfig, UserRole } from '../../types';
import { CampusStorage } from '../../services/api';
import { normalizeRole } from '../../lib/rbac';
import { LogoChangeModal } from './LogoChangeModal';
import {
  Shield,
  GraduationCap,
  Layers,
  Crown,
  Atom,
  Sparkles,
  Camera
} from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  allowEdit?: boolean;
  userRole?: UserRole;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  allowEdit,
  userRole,
  onClick
}) => {
  const [logoConfig, setLogoConfig] = useState<CampusLogoConfig>(() => CampusStorage.getCustomLogo());
  const [showModal, setShowModal] = useState<boolean>(false);

  const normRole = normalizeRole(userRole);
  const isAdminOrSuperAdmin = normRole === 'admin' || normRole === 'super_admin';
  const canEdit = allowEdit !== undefined ? allowEdit : isAdminOrSuperAdmin;

  useEffect(() => {
    const handleLogoUpdate = (e: any) => {
      if (e.detail) {
        setLogoConfig(e.detail);
      } else {
        setLogoConfig(CampusStorage.getCustomLogo());
      }
    };

    window.addEventListener('campus_logo_updated', handleLogoUpdate);
    return () => {
      window.removeEventListener('campus_logo_updated', handleLogoUpdate);
    };
  }, []);

  const dimensions = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base', subtext: 'text-[9px]', gap: 'gap-2' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-lg', subtext: 'text-[10px]', gap: 'gap-2.5' },
    lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xl', subtext: 'text-xs', gap: 'gap-3' },
    xl: { box: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-3xl', subtext: 'text-xs', gap: 'gap-3.5' }
  }[size];

  const handleContainerClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (canEdit) {
      setShowModal(true);
    }
  };

  const gradientBg = logoConfig.gradientBg || 'from-blue-700 via-indigo-600 to-sky-500';

  return (
    <>
      <div
        onClick={handleContainerClick}
        title={canEdit ? "Click to customize Campus Logo (Admin Access)" : undefined}
        className={`flex items-center ${dimensions.gap} ${className} group ${canEdit ? 'cursor-pointer' : 'cursor-default'} select-none`}
      >
        {/* Emblem Box Container */}
        <div className={`${dimensions.box} relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradientBg} p-0.5 shadow-lg shadow-blue-500/20 ring-1 ring-white/30 shrink-0 transform ${canEdit ? 'group-hover:scale-105' : ''} transition-all duration-300`}>
          
          {/* Inner Glass Layer */}
          <div className="w-full h-full rounded-[14px] bg-slate-950/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
            
            {/* Shimmer Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-blue-400/30 opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Render Custom Image, Custom Preset Icon, or Default SVG */}
            {logoConfig.logoUrl ? (
              <img
                src={logoConfig.logoUrl}
                alt="Campus Logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
            ) : logoConfig.presetIcon === 'academic-crest' ? (
              <GraduationCap className={`${dimensions.icon} text-amber-300 relative z-10 drop-shadow`} />
            ) : logoConfig.presetIcon === 'future-core' ? (
              <Layers className={`${dimensions.icon} text-cyan-300 relative z-10 drop-shadow`} />
            ) : logoConfig.presetIcon === 'golden-crown' ? (
              <Crown className={`${dimensions.icon} text-amber-400 relative z-10 drop-shadow`} />
            ) : logoConfig.presetIcon === 'tech-atom' ? (
              <Atom className={`${dimensions.icon} text-sky-300 relative z-10 drop-shadow`} />
            ) : logoConfig.presetIcon === 'minimal-diamond' ? (
              <Sparkles className={`${dimensions.icon} text-white relative z-10 drop-shadow`} />
            ) : (
              /* Default Interlocking Tech Shield Vector SVG */
              <svg 
                viewBox="0 0 40 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className={`${dimensions.icon} relative z-10 transform ${canEdit ? 'group-hover:rotate-3' : ''} transition-transform duration-300 drop-shadow-md`}
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
                </defs>

                <path 
                  d="M20 4L33 11.5V26.5L20 34L7 26.5V11.5L20 4Z" 
                  stroke="url(#primaryLogoGrad)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />
                <path 
                  d="M26 13C24.2 11.2 21.8 10 19 10C13.5 10 9 14.5 9 20C9 25.5 13.5 30 19 30C22 30 24.5 28.6 26.2 26.5" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M31 16.5C31.7 18 32 19.5 32 21C32 26 28.5 29 24 29" 
                  stroke="url(#primaryLogoGrad)" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M20 12L12 16L20 20L28 16L20 12Z" 
                  fill="url(#goldCapGrad)" 
                />
                <circle cx="20" cy="20" r="2" fill="#38bdf8" className="animate-pulse" />
              </svg>
            )}

            {/* Hover Edit Overlay Indicator */}
            {canEdit && (
              <div className="absolute inset-0 bg-slate-950/60 rounded-[14px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Camera className="h-3.5 w-3.5 text-white" />
              </div>
            )}

          </div>
        </div>

        {/* Text Portion */}
        {showText && (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`${dimensions.text} font-black tracking-tight text-slate-900 dark:text-white leading-none`}>
                {logoConfig.title || 'CKCET'}
              </span>
              <span className={`${dimensions.text} font-bold tracking-normal bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent leading-none font-courgette px-0.5`}>
                {logoConfig.subtitle || 'CAMPRO'}
              </span>
            </div>
            <span className={`${dimensions.subtext} font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight mt-0.5`}>
              {logoConfig.tagline || 'Enterprise Campus ERP'}
            </span>
          </div>
        )}
      </div>

      {/* Logo Customizer Modal */}
      {canEdit && (
        <LogoChangeModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUpdateLogo={(updatedConfig) => {
            setLogoConfig(updatedConfig);
          }}
        />
      )}
    </>
  );
};
