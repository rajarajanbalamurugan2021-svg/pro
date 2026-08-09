import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Camera, Check, RefreshCw, Sparkles, UserCheck, Palette, Wand2, Sliders, Layers } from 'lucide-react';

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateAvatar: (newAvatarUrl: string) => void;
}

const PRESET_AVATARS = [
  {
    category: 'Academic & Students',
    items: [
      { id: 'st1', name: 'Student Male 1', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80' },
      { id: 'st2', name: 'Student Female 1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80' },
      { id: 'st3', name: 'Student Male 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80' },
      { id: 'st4', name: 'Student Female 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80' },
    ]
  },
  {
    category: 'Faculty & Scholars',
    items: [
      { id: 'fac1', name: 'Professor Male', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&auto=format&fit=crop&q=80' },
      { id: 'fac2', name: 'Professor Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80' },
      { id: 'fac3', name: 'Researcher', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80' },
      { id: 'fac4', name: 'Dean / Administrator', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80' },
    ]
  },
  {
    category: 'Tech & 3D Stylized',
    items: [
      { id: '3d1', name: 'Cyber Scholar', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=250&auto=format&fit=crop&q=80' },
      { id: '3d2', name: 'Code Master', url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=250&auto=format&fit=crop&q=80' },
      { id: '3d3', name: 'AI Specialist', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80' },
      { id: '3d4', name: 'Tech Lead', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=250&auto=format&fit=crop&q=80' },
    ]
  }
];

const GRADIENT_PALETTES = [
  { name: 'Sapphire Blue', bg: '1d4ed8', color: 'ffffff', hex: 'from-blue-600 to-indigo-700' },
  { name: 'Emerald Green', bg: '047857', color: 'ffffff', hex: 'from-emerald-600 to-teal-700' },
  { name: 'Deep Purple', bg: '6d28d9', color: 'ffffff', hex: 'from-purple-600 to-indigo-800' },
  { name: 'Sunset Amber', bg: 'c2410c', color: 'ffffff', hex: 'from-orange-600 to-amber-700' },
  { name: 'Crimson Ruby', bg: 'b91c1c', color: 'ffffff', hex: 'from-red-600 to-rose-800' },
  { name: 'Midnight Dark', bg: '0f172a', color: 'ffffff', hex: 'from-slate-800 to-slate-950' },
  { name: 'Gold Luxe', bg: 'b45309', color: 'ffffff', hex: 'from-amber-600 to-yellow-700' },
];

const STYLIZED_TYPES = [
  { id: 'avataaars', name: 'Avataaars (People)', urlStyle: 'avataaars' },
  { id: 'bottts', name: 'Bottts (Robot)', urlStyle: 'bottts' },
  { id: 'lorelei', name: 'Lorelei (Illustrated)', urlStyle: 'lorelei' },
  { id: 'micah', name: 'Micah (Minimalist)', urlStyle: 'micah' },
  { id: 'personas', name: 'Personas (Vector)', urlStyle: 'personas' },
];

export const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateAvatar
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'studio' | 'generator' | 'upload' | 'url'>('studio');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentUser.avatar || '');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Custom Studio State
  const [initialsText, setInitialsText] = useState<string>(
    currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'CK'
  );
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PALETTES[0]);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Generator State
  const [genSeed, setGenSeed] = useState<string>(currentUser.name || 'Student');
  const [genStyle, setGenStyle] = useState<string>('avataaars');

  useEffect(() => {
    if (currentUser.avatar) {
      setSelectedAvatar(currentUser.avatar);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, or GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const resultStr = e.target.result as string;
        setSelectedAvatar(resultStr);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const applyCustomStudioAvatar = () => {
    const sizeMultiplier = fontSize === 'sm' ? '0.4' : fontSize === 'lg' ? '0.6' : '0.5';
    const generatedUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initialsText)}&background=${selectedGradient.bg}&color=${selectedGradient.color}&bold=true&size=256&font-size=${sizeMultiplier}`;
    setSelectedAvatar(generatedUrl);
  };

  const applyDicebearAvatar = () => {
    const generatedUrl = `https://api.dicebear.com/7.x/${genStyle}/svg?seed=${encodeURIComponent(genSeed)}`;
    setSelectedAvatar(generatedUrl);
  };

  const handleSave = () => {
    if (!selectedAvatar) return;
    onUpdateAvatar(selectedAvatar);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleResetDefault = () => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2563eb&color=fff&bold=true&size=256`;
    setSelectedAvatar(defaultAvatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Customize Profile Picture (DP)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Design, upload, or choose a custom avatar for your account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="p-5 bg-gradient-to-br from-blue-950/20 via-slate-900/10 to-indigo-950/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <img
                src={selectedAvatar || currentUser.avatar}
                alt="Selected DP Preview"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/50 shadow-xl bg-slate-800"
              />
              <div className="absolute inset-0 rounded-full bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 uppercase">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentUser.email}</div>
              <button
                type="button"
                onClick={handleResetDefault}
                className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Reset to Initials Avatar
              </button>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5" /> Synchronized DP
            </span>
          </div>
        </div>

        {/* Source Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-1.5 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('studio')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
              activeTab === 'studio'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="h-3.5 w-3.5 text-blue-500" />
            <span>Initials Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
              activeTab === 'generator'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5 text-purple-500" />
            <span>Stylized AI</span>
          </button>
          <button
            onClick={() => setActiveTab('preset')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
              activeTab === 'preset'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload File</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Link URL</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: Initials Studio */}
          {activeTab === 'studio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Initials Text
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={initialsText}
                    onChange={(e) => setInitialsText(e.target.value.toUpperCase())}
                    placeholder="e.g. CK or RA"
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-black tracking-widest text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Background Color Palette
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {GRADIENT_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => setSelectedGradient(pal)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                          selectedGradient.name === pal.name
                            ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${pal.hex} shrink-0 shadow-sm`} />
                        <span className="truncate text-[11px] text-slate-800 dark:text-slate-200">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Font Scale
                  </label>
                  <div className="flex gap-2">
                    {(['sm', 'md', 'lg'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setFontSize(sz)}
                        className={`flex-1 py-1.5 rounded-xl border text-xs font-bold capitalize transition ${
                          fontSize === sz
                            ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {sz === 'sm' ? 'Compact' : sz === 'md' ? 'Standard' : 'Large'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyCustomStudioAvatar}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Initials Avatar</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DiceBear Stylized AI Generator */}
          {activeTab === 'generator' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Seed Word / Name
                  </label>
                  <input
                    type="text"
                    value={genSeed}
                    onChange={(e) => setGenSeed(e.target.value)}
                    placeholder="Enter seed phrase..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Illustration Art Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLIZED_TYPES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setGenStyle(st.urlStyle)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 ${
                          genStyle === st.urlStyle
                            ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 ring-2 ring-purple-500/30'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Wand2 className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                        <span className="truncate">{st.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={applyDicebearAvatar}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Stylized Avatar</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Preset Gallery */}
          {activeTab === 'preset' && (
            <div className="space-y-4">
              {PRESET_AVATARS.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    <span>{cat.category}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {cat.items.map((item) => {
                      const isSelected = selectedAvatar === item.url;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedAvatar(item.url)}
                          className={`relative rounded-2xl p-1.5 border transition-all flex flex-col items-center gap-1 group ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/40 scale-105'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-400'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-14 h-14 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                          />
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-full">
                            {item.name}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 p-0.5 bg-blue-600 text-white rounded-full shadow">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:border-blue-400'
                }`}
                onClick={() => {
                  const input = document.getElementById('avatar-file-input') as HTMLInputElement;
                  if (input) input.click();
                }}
              >
                <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 ring-8 ring-blue-500/5">
                  <Upload className="h-8 w-8 animate-bounce" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Click to browse or drag & drop image
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Supports PNG, JPG, WEBP, or GIF (Max 5MB)
                  </div>
                </div>
                <input
                  id="avatar-file-input"
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

              {uploadError && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
                  {uploadError}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Direct Link */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Direct Web Image Link (URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-profile-picture.jpg"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setSelectedAvatar(customUrlInput.trim());
                      }
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Load Image
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="font-bold text-slate-700 dark:text-slate-300">💡 Quick Tip</div>
                <p>You can use images from LinkedIn, GitHub avatar links, Google Drive public links, or any standard HTTP image URL.</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 text-emerald-300 animate-bounce" />
                <span>Profile DP Updated!</span>
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                <span>Save New Profile Picture</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

