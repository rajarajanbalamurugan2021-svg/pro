import React, { useState, useEffect } from 'react';
import { CampusLogoConfig } from '../../types';
import { CampusStorage } from '../../services/api';
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Sparkles,
  Camera,
  Shield,
  GraduationCap,
  Atom,
  Crown,
  Layers,
  Palette,
  Type
} from 'lucide-react';

interface LogoChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateLogo?: (newLogo: CampusLogoConfig) => void;
}

const PRESET_EMBLEMS = [
  {
    id: 'modern-shield',
    name: 'Modern Tech Shield',
    description: 'Interlocking Double-C Tech Shield with Graduation Diamond',
    icon: Shield,
    gradientBg: 'from-blue-700 via-indigo-600 to-sky-500'
  },
  {
    id: 'academic-crest',
    name: 'Academic Mortarboard Crest',
    description: 'Classic university mortarboard emblem with gold accents',
    icon: GraduationCap,
    gradientBg: 'from-emerald-700 via-teal-600 to-cyan-500'
  },
  {
    id: 'future-core',
    name: 'Futuristic Cyber Core',
    description: 'Neon glowing core pulse for engineering & technology',
    icon: Layers,
    gradientBg: 'from-purple-700 via-indigo-600 to-pink-500'
  },
  {
    id: 'golden-crown',
    name: 'Golden Excellency Crown',
    description: 'Prestigious gold emblem for institutional excellence',
    icon: Crown,
    gradientBg: 'from-amber-600 via-orange-500 to-yellow-400'
  },
  {
    id: 'tech-atom',
    name: 'Quantum Tech Atom',
    description: 'Atomic orbitals representing innovation & research',
    icon: Atom,
    gradientBg: 'from-sky-600 via-blue-600 to-indigo-700'
  },
  {
    id: 'minimal-diamond',
    name: 'Minimalist Diamond',
    description: 'Sleek geometric diamond prism emblem',
    icon: Sparkles,
    gradientBg: 'from-slate-800 via-slate-900 to-slate-950'
  }
];

const GRADIENT_OPTIONS = [
  { name: 'Campus Blue & Indigo', value: 'from-blue-700 via-indigo-600 to-sky-500' },
  { name: 'Emerald Campus', value: 'from-emerald-700 via-teal-600 to-cyan-500' },
  { name: 'Royal Purple', value: 'from-purple-700 via-indigo-600 to-pink-500' },
  { name: 'Golden Excellence', value: 'from-amber-600 via-orange-500 to-yellow-400' },
  { name: 'Crimson Pride', value: 'from-red-700 via-rose-600 to-orange-500' },
  { name: 'Midnight Obsidian', value: 'from-slate-800 via-slate-900 to-slate-950' }
];

export const LogoChangeModal: React.FC<LogoChangeModalProps> = ({
  isOpen,
  onClose,
  onUpdateLogo
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'url' | 'branding'>('preset');
  const [logoConfig, setLogoConfig] = useState<CampusLogoConfig>({
    title: 'CAMPRO',
    subtitle: 'ERP',
    tagline: 'Enterprise Campus ERP',
    logoUrl: '',
    presetIcon: 'modern-shield',
    gradientBg: 'from-blue-700 via-indigo-600 to-sky-500'
  });

  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const stored = CampusStorage.getCustomLogo();
      setLogoConfig(stored);
      if (stored.logoUrl) {
        setCustomUrlInput(stored.logoUrl);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, SVG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const url = e.target.result as string;
        setLogoConfig(prev => ({ ...prev, logoUrl: url }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    CampusStorage.saveCustomLogo(logoConfig);
    if (onUpdateLogo) {
      onUpdateLogo(logoConfig);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleResetToDefault = () => {
    const defaultConfig: CampusLogoConfig = {
      title: 'CAMPRO',
      subtitle: 'ERP',
      tagline: 'Enterprise Campus ERP',
      logoUrl: '',
      presetIcon: 'modern-shield',
      gradientBg: 'from-blue-700 via-indigo-600 to-sky-500'
    };
    setLogoConfig(defaultConfig);
    setCustomUrlInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Customize Campus Logo & Branding</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                  Admin & SuperAdmin
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Change institution emblem, custom image, or portal logo text</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Real-time Live Preview */}
        <div className="p-5 bg-gradient-to-br from-blue-950/20 via-slate-900/10 to-indigo-950/20 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Live Brand Preview
            </div>
            {/* Logo Component Preview Container */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
              {/* Emblem Box */}
              <div className={`w-11 h-11 relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${logoConfig.gradientBg || 'from-blue-700 via-indigo-600 to-sky-500'} p-0.5 shadow-md shrink-0`}>
                <div className="w-full h-full rounded-[14px] bg-slate-950/40 backdrop-blur-md flex items-center justify-center overflow-hidden">
                  {logoConfig.logoUrl ? (
                    <img src={logoConfig.logoUrl} alt="Custom Logo" className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <div className="text-white">
                      {logoConfig.presetIcon === 'academic-crest' && <GraduationCap className="h-6 w-6 text-amber-300" />}
                      {logoConfig.presetIcon === 'future-core' && <Layers className="h-6 w-6 text-cyan-300" />}
                      {logoConfig.presetIcon === 'golden-crown' && <Crown className="h-6 w-6 text-amber-400" />}
                      {logoConfig.presetIcon === 'tech-atom' && <Atom className="h-6 w-6 text-sky-300" />}
                      {logoConfig.presetIcon === 'minimal-diamond' && <Sparkles className="h-6 w-6 text-white" />}
                      {(!logoConfig.presetIcon || logoConfig.presetIcon === 'modern-shield') && <Shield className="h-6 w-6 text-sky-300" />}
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                    {logoConfig.title || 'CAMPRO'}
                  </span>
                  <span className="text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent leading-none">
                    {logoConfig.subtitle || 'ERP'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight mt-1">
                  {logoConfig.tagline || 'Enterprise Campus ERP'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 self-start sm:self-center shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Default</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-1.5 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preset')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'preset'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5 text-blue-500" />
            <span>Preset Emblems</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="h-3.5 w-3.5 text-purple-500" />
            <span>Upload Image</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5 text-emerald-500" />
            <span>Image URL</span>
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'branding'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Type className="h-3.5 w-3.5 text-amber-500" />
            <span>Portal Text</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: Preset Emblem Gallery */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose a Vector Emblem Design
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_EMBLEMS.map((emb) => {
                  const IconComp = emb.icon;
                  const isSelected = !logoConfig.logoUrl && logoConfig.presetIcon === emb.id;
                  return (
                    <button
                      key={emb.id}
                      type="button"
                      onClick={() => {
                        setLogoConfig(prev => ({
                          ...prev,
                          logoUrl: '',
                          presetIcon: emb.id as any,
                          gradientBg: emb.gradientBg
                        }));
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${emb.gradientBg} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{emb.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{emb.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Upload Device File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
                onClick={() => document.getElementById('logo-file-input')?.click()}
              >
                <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Click to browse or drag image here
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports SVG, PNG, JPG, WEBP logo graphics
                  </p>
                </div>
                <input
                  id="logo-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {logoConfig.logoUrl && (
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={logoConfig.logoUrl} alt="Uploaded logo" className="w-10 h-10 rounded-xl object-cover bg-slate-900" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Custom Image Loaded</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogoConfig(prev => ({ ...prev, logoUrl: '' }))}
                    className="p-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Image Web URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Paste Custom Logo Image Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/campus-logo.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput) {
                        setLogoConfig(prev => ({ ...prev, logoUrl: customUrlInput }));
                      }
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition shrink-0"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Portal Text & Colors */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institution / Code (First Word)
                  </label>
                  <input
                    type="text"
                    value={logoConfig.title || 'CAMPRO'}
                    onChange={(e) => setLogoConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. CAMPRO"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Product / Brand (Second Word)
                  </label>
                  <input
                    type="text"
                    value={logoConfig.subtitle || 'ERP'}
                    onChange={(e) => setLogoConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="e.g. ERP"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / System Description
                </label>
                <input
                  type="text"
                  value={logoConfig.tagline || 'Enterprise Campus ERP'}
                  onChange={(e) => setLogoConfig(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Enterprise Campus ERP"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-blue-500" />
                  <span>Emblem Background Gradient</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_OPTIONS.map((g) => (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => setLogoConfig(prev => ({ ...prev, gradientBg: g.value }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                        logoConfig.gradientBg === g.value
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${g.value} shrink-0 shadow-sm`} />
                      <span className="truncate text-[11px] text-slate-800 dark:text-slate-200">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Saved & Applied Everywhere!</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Apply Campus Logo</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
