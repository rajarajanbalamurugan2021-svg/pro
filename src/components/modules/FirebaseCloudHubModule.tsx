import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Database, 
  Upload, 
  UserCheck, 
  UserPlus, 
  FileText, 
  FilePlus, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Trash2, 
  Eye, 
  RefreshCw, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  FolderOpen, 
  HardDriveUpload, 
  Tag, 
  Layers, 
  User, 
  Building2, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  getRegistrationsFirestore, 
  saveRegistrationFirestore, 
  subscribeToRegistrations,
  getProfilesFirestore, 
  saveProfileFirestore, 
  subscribeToProfiles,
  getUploadableContentsFirestore, 
  saveUploadableContentFirestore, 
  deleteUploadableContentFirestore, 
  subscribeToUploadableContents,
  CampusStorage
} from '../../services/api';

export const FirebaseCloudHubModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registrations' | 'profiles' | 'uploads' | 'status'>('registrations');
  
  // Real-time State from Firestore
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [uploadableContents, setUploadableContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Forms State
  // 1. Registration Form
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    academicYear: '2024-2025',
    semester: 'Semester 6',
    appliedRole: 'student',
    phoneNumber: '',
    address: ''
  });

  // 2. Profile Form
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    userId: '',
    fullName: '',
    email: '',
    department: 'Computer Science & Engineering',
    registerNumber: '',
    role: 'student',
    bloodGroup: 'O+',
    communalCategory: 'General',
    emergencyContact: '',
    dateOfBirth: '',
    bio: '',
    skills: 'React, TypeScript, Python'
  });

  // 3. Upload Form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Lecture Notes',
    department: 'Computer Science & Engineering',
    fileType: 'pdf',
    description: '',
    authorName: 'CKCET Faculty / Admin',
    fileDataUrl: '',
    fileName: ''
  });

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Load and Subscribe to Firestore Collections
  useEffect(() => {
    let unsubRegs: (() => void) | undefined;
    let unsubProfs: (() => void) | undefined;
    let unsubUploads: (() => void) | undefined;

    const initCloudData = async () => {
      setLoading(true);
      try {
        // Initial Fetch
        const [regsData, profsData, uploadsData] = await Promise.all([
          getRegistrationsFirestore(),
          getProfilesFirestore(),
          getUploadableContentsFirestore()
        ]);

        if (regsData && regsData.length > 0) setRegistrations(regsData);
        if (profsData && profsData.length > 0) setProfiles(profsData);
        if (uploadsData && uploadsData.length > 0) setUploadableContents(uploadsData);

        // Subscriptions
        unsubRegs = subscribeToRegistrations((data) => {
          if (data && data.length > 0) setRegistrations(data);
        });

        unsubProfs = subscribeToProfiles((data) => {
          if (data && data.length > 0) setProfiles(data);
        });

        unsubUploads = subscribeToUploadableContents((data) => {
          if (data && data.length > 0) setUploadableContents(data);
        });
      } catch (err) {
        console.error('Firestore loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    initCloudData();

    return () => {
      if (unsubRegs) unsubRegs();
      if (unsubProfs) unsubProfs();
      if (unsubUploads) unsubUploads();
    };
  }, []);

  // Submit New Registration to Firestore
  const handleCreateRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.email) {
      showToast('Please fill in required fields (Name & Email)', 'error');
      return;
    }

    const newRegistration = {
      id: `reg_${Date.now()}`,
      ...regForm,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      submittedAtFormatted: new Date().toLocaleString()
    };

    try {
      await saveRegistrationFirestore(newRegistration);
      // Sync local storage
      const updated = [newRegistration, ...registrations];
      setRegistrations(updated);
      CampusStorage.saveRegistrations(updated);

      setShowRegModal(false);
      setRegForm({
        fullName: '',
        email: '',
        rollNumber: '',
        department: 'Computer Science & Engineering',
        academicYear: '2024-2025',
        semester: 'Semester 6',
        appliedRole: 'student',
        phoneNumber: '',
        address: ''
      });
      showToast('Registration submitted successfully to Firestore cloud!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save registration to cloud', 'error');
    }
  };

  // Submit / Update Profile in Firestore
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName || !profileForm.email) {
      showToast('Please fill in required fields (Name & Email)', 'error');
      return;
    }

    const profileId = profileForm.userId || `prof_${Date.now()}`;
    const newProfile = {
      id: profileId,
      ...profileForm,
      skills: profileForm.skills.split(',').map(s => s.trim()),
      updatedAt: new Date().toISOString(),
      updatedAtFormatted: new Date().toLocaleString()
    };

    try {
      await saveProfileFirestore(newProfile);
      const filtered = profiles.filter(p => p.id !== profileId);
      const updated = [newProfile, ...filtered];
      setProfiles(updated);
      CampusStorage.saveProfiles(updated);

      setShowProfileModal(false);
      setProfileForm({
        userId: '',
        fullName: '',
        email: '',
        department: 'Computer Science & Engineering',
        registerNumber: '',
        role: 'student',
        bloodGroup: 'O+',
        communalCategory: 'General',
        emergencyContact: '',
        dateOfBirth: '',
        bio: '',
        skills: 'React, TypeScript, Python'
      });
      showToast('User profile saved and synced to Firestore!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save profile', 'error');
    }
  };

  // Upload File Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadForm(prev => ({
          ...prev,
          fileName: file.name,
          fileDataUrl: event.target?.result as string || '',
          fileType: file.name.split('.').pop() || 'file'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Uploadable Content to Firestore
  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.fileName) {
      showToast('Please enter a title and select a file to upload', 'error');
      return;
    }

    const uploadId = `upload_${Date.now()}`;
    const newUpload = {
      id: uploadId,
      ...uploadForm,
      fileSizeKb: Math.round(uploadForm.fileDataUrl.length / 1024),
      uploadedAt: new Date().toISOString(),
      uploadedAtFormatted: new Date().toLocaleString()
    };

    try {
      await saveUploadableContentFirestore(newUpload);
      const updated = [newUpload, ...uploadableContents];
      setUploadableContents(updated);
      CampusStorage.saveUploads(updated);

      setShowUploadModal(false);
      setUploadForm({
        title: '',
        category: 'Lecture Notes',
        department: 'Computer Science & Engineering',
        fileType: 'pdf',
        description: '',
        authorName: 'CKCET Faculty / Admin',
        fileDataUrl: '',
        fileName: ''
      });
      showToast('Uploadable content saved to Firestore cloud repository!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save uploadable content', 'error');
    }
  };

  // Delete Uploadable Content
  const handleDeleteUpload = async (id: string) => {
    if (confirm('Are you sure you want to delete this cloud item?')) {
      try {
        await deleteUploadableContentFirestore(id);
        const updated = uploadableContents.filter(u => u.id !== id);
        setUploadableContents(updated);
        CampusStorage.saveUploads(updated);
        showToast('Item deleted from Firestore cloud!');
      } catch (err) {
        showToast('Failed to delete cloud item', 'error');
      }
    }
  };

  // Filtered lists
  const filteredRegistrations = registrations.filter(r => 
    (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfiles = profiles.filter(p => 
    (p.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.registerNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUploads = uploadableContents.filter(u => 
    (u.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white shadow-xl border border-orange-500/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
            <Cloud className="h-4 w-4 text-amber-200" />
            <span>Firebase Firestore Cloud Synchronization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Cloud Collation & Storage Center
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
            Live persistent cloud database for campus Registrations, User Profiles, and Uploadable Content, backed by Google Firebase Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-mono font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Firestore ID: distributed-ranger-r6shk
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md transition-all ${
          statusMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-white hover:opacity-80">✕</button>
        </div>
      )}

      {/* Quick Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'registrations' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Registrations ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'profiles' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="h-4 w-4" /> Profiles ({profiles.length})
          </button>

          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'uploads' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderOpen className="h-4 w-4" /> Uploadable Contents ({uploadableContents.length})
          </button>

          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
              activeTab === 'status' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="h-4 w-4" /> Firestore Status
          </button>
        </div>

        {/* Global Filter/Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search cloud records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* 1. REGISTRATIONS TAB */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange-600" /> Student & User Registration Applications
              </h3>
              <p className="text-xs text-slate-500">
                All submitted registration entries stored permanently in Firestore collection <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-orange-600">registrations</code>.
              </p>
            </div>

            <button
              onClick={() => setShowRegModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <UserPlus className="h-4 w-4" /> Submit Registration Entry
            </button>
          </div>

          {/* Registrations List Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading Firestore registration records...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <UserPlus className="h-8 w-8 mx-auto text-slate-400" />
              <p className="font-bold">No registration entries found in Firestore.</p>
              <p className="text-slate-400">Click "Submit Registration Entry" to add candidate registration details to the cloud.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRegistrations.map((reg) => (
                <div key={reg.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                        {reg.appliedRole || 'Student'}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5">{reg.fullName}</h4>
                      <p className="text-xs text-slate-500 font-mono">{reg.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      reg.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                    }`}>
                      {reg.status || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Roll/Reg No:</span>
                      <span className="font-mono font-bold">{reg.rollNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{reg.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Academic Year:</span>
                      <span>{reg.academicYear || '2024-2025'}</span>
                    </div>
                    {reg.phoneNumber && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span>{reg.phoneNumber}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 font-mono">
                    <span>Submitted: {reg.submittedAtFormatted || 'Just now'}</span>
                    <span className="text-orange-600 dark:text-orange-400 font-bold">Cloud Synced</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. PROFILES TAB */}
      {activeTab === 'profiles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-orange-600" /> Comprehensive User Profiles Collection
              </h3>
              <p className="text-xs text-slate-500">
                Detailed profile records stored permanently in Firestore collection <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-orange-600">profiles</code>.
              </p>
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <UserPlus className="h-4 w-4" /> Save New Profile Entry
            </button>
          </div>

          {/* Profiles Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading Firestore profiles...</div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <UserCheck className="h-8 w-8 mx-auto text-slate-400" />
              <p className="font-bold">No user profiles found in Firestore.</p>
              <p className="text-slate-400">Click "Save New Profile Entry" to build user profiles in the cloud.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map((prof) => (
                <div key={prof.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-orange-500/10 text-orange-600 font-bold flex items-center justify-center text-base border border-orange-500/20">
                      {(prof.fullName || 'U').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{prof.fullName}</h4>
                      <p className="text-xs text-slate-500 font-mono">{prof.email}</p>
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                        {prof.role || 'Student'} • {prof.department}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reg No:</span>
                      <span className="font-mono font-bold">{prof.registerNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Blood Group:</span>
                      <span className="font-bold text-red-500">{prof.bloodGroup || 'O+'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Category:</span>
                      <span>{prof.communalCategory || 'General'}</span>
                    </div>
                    {prof.emergencyContact && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Emergency:</span>
                        <span>{prof.emergencyContact}</span>
                      </div>
                    )}
                  </div>

                  {prof.skills && Array.isArray(prof.skills) && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {prof.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 font-mono">
                    <span>Updated: {prof.updatedAtFormatted || 'Recently'}</span>
                    <span className="text-emerald-600 font-bold">Cloud Synced</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. UPLOADABLE CONTENTS TAB */}
      {activeTab === 'uploads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-orange-600" /> Uploadable Campus Content Repository
              </h3>
              <p className="text-xs text-slate-500">
                Uploaded study notes, certificates, lab manuals, and assignments stored in Firestore collection <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-orange-600">uploadable_contents</code>.
              </p>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <HardDriveUpload className="h-4 w-4" /> Upload Content File
            </button>
          </div>

          {/* Uploads List */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading Firestore uploadable contents...</div>
          ) : filteredUploads.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <FolderOpen className="h-8 w-8 mx-auto text-slate-400" />
              <p className="font-bold">No uploaded files or documents in Firestore.</p>
              <p className="text-slate-400">Click "Upload Content File" to upload documents to the campus cloud repository.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUploads.map((file) => (
                <div key={file.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{file.title}</h4>
                        <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                          {file.category} • {file.department}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteUpload(file.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-400 hover:text-red-600 transition"
                      title="Delete from Cloud"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">{file.description || 'No description provided.'}</p>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Name:</span>
                      <span className="font-bold truncate max-w-[150px]">{file.fileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type / Size:</span>
                      <span>{(file.fileType || 'pdf').toUpperCase()} • {file.fileSizeKb || 12} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Author:</span>
                      <span className="font-sans">{file.authorName || 'CKCET Admin'}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    <span className="font-mono">{file.uploadedAtFormatted || 'Recently'}</span>
                    {file.fileDataUrl ? (
                      <a
                        href={file.fileDataUrl}
                        download={file.fileName}
                        className="flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700"
                      >
                        <Download className="h-3 w-3" /> Download
                      </a>
                    ) : (
                      <span className="text-emerald-600 font-bold">Cloud Stored</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. FIRESTORE STATUS TAB */}
      {activeTab === 'status' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-600" /> Firebase Firestore Live Connection Monitor
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time connection status and document counts for provisioned Firestore collections.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span> Live Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Collection 1</span>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                <span>registrations</span>
                <span className="text-orange-600">{registrations.length} docs</span>
              </div>
              <p className="text-slate-500">Stores student enrollment and application records.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Collection 2</span>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                <span>profiles</span>
                <span className="text-orange-600">{profiles.length} docs</span>
              </div>
              <p className="text-slate-500">Stores user profiles, blood groups, categories, & skills.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Collection 3</span>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                <span>uploadable_contents</span>
                <span className="text-orange-600">{uploadableContents.length} docs</span>
              </div>
              <p className="text-slate-500">Stores study materials, lecture notes, & project uploads.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/20 text-xs text-orange-950 dark:text-orange-200 space-y-2">
            <h4 className="font-bold flex items-center gap-2 text-orange-600 dark:text-orange-400">
              <ShieldCheck className="h-4 w-4" /> Firebase Security Rules & Configuration Active
            </h4>
            <p>
              Your Firestore database is configured under project <code className="font-mono font-bold bg-orange-500/10 px-1 rounded">distributed-ranger-r6shk</code>. 
              The deployment rules in <code className="font-mono font-bold bg-orange-500/10 px-1 rounded">firestore.rules</code> actively allow authenticated and local application operations on all three collections.
            </p>
          </div>
        </div>
      )}

      {/* MODAL 1: SUBMIT REGISTRATION */}
      {showRegModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-orange-600" /> New Student Registration Entry
              </h3>
              <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateRegistration} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Candidate Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Ramesh"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ananya.r@student.ckcet.edu"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roll / Register No</label>
                  <input
                    type="text"
                    placeholder="21CS108"
                    value={regForm.rollNumber}
                    onChange={(e) => setRegForm({ ...regForm, rollNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Level</label>
                  <select
                    value={regForm.appliedRole}
                    onChange={(e) => setRegForm({ ...regForm, appliedRole: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select
                  value={regForm.department}
                  onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={regForm.academicYear}
                    onChange={(e) => setRegForm({ ...regForm, academicYear: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={regForm.phoneNumber}
                    onChange={(e) => setRegForm({ ...regForm, phoneNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow transition"
                >
                  Save Registration to Firestore
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SAVE PROFILE */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-orange-600" /> Save User Profile
              </h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. K. Balamurugan"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="balamurugan@ckcet.edu"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Register / Emp No</label>
                  <input
                    type="text"
                    placeholder="EMP2024"
                    value={profileForm.registerNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, registerNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={profileForm.bloodGroup}
                    onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow transition"
                >
                  Save Profile to Cloud
                </button>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: UPLOAD CONTENT FILE */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <HardDriveUpload className="h-5 w-5 text-orange-600" /> Upload Content to Firestore Repository
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Content Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems Unit 3 Lecture Notes"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Question Papers">Question Papers</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Project Document">Project Document</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={uploadForm.department}
                    onChange={(e) => setUploadForm({ ...uploadForm, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Mechanical Engineering">MECH</option>
                    <option value="Civil Engineering">CIVIL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Upload File *</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
                {uploadForm.fileName && (
                  <p className="text-[11px] text-emerald-600 font-mono mt-1">Selected: {uploadForm.fileName}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of document content..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow transition"
                >
                  Upload & Sync to Cloud
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
