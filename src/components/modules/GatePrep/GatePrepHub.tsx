import React, { useState } from 'react';
import { GateResource } from '../../../types/gate';
import { GateStudentDashboard } from './GateStudentDashboard';
import { GateFacultyDashboard } from './GateFacultyDashboard';
import { GateAdminDashboard } from './GateAdminDashboard';
import { ResourceUploadModal } from './ResourceUploadModal';
import { InAppPdfViewerModal } from './InAppPdfViewerModal';
import { GateService } from '../../../services/gateService';
import { BookOpen, User, ShieldCheck, GraduationCap } from 'lucide-react';

interface GatePrepHubProps {
  currentUser?: {
    id: string;
    name: string;
    role: string;
  };
}

export const GatePrepHub: React.FC<GatePrepHubProps> = ({ currentUser }) => {
  const user = currentUser || {
    id: 'user-student-1',
    name: 'Student User',
    role: 'student'
  };

  const isSuperAdmin = user.role === 'super_admin' || user.role === 'SuperAdmin';
  const isAdmin = isSuperAdmin || user.role === 'admin' || user.role === 'Admin';
  const isFaculty = isAdmin || user.role === 'faculty' || user.role === 'Faculty';

  // Active Role View Switcher
  const [activeRoleView, setActiveRoleView] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>(
    isAdmin ? 'ADMIN' : isFaculty ? 'FACULTY' : 'STUDENT'
  );

  // PDF Viewer Modal State
  const [viewPdfTarget, setViewPdfTarget] = useState<GateResource | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [replaceTarget, setReplaceTarget] = useState<GateResource | null>(null);

  // Refresh Trigger
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  const handleUploadResource = (data: Omit<GateResource, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'downloadCount' | 'viewCount'>) => {
    GateService.addResource(data);
    handleRefresh();
  };

  const handleReplaceFile = (id: string, fileData: { fileUrl: string; fileName: string; fileSize: number; fileType: string }) => {
    GateService.replaceResourceFile(id, fileData, user);
    handleRefresh();
  };

  return (
    <div key={refreshKey} className="space-y-6">
      
      {/* Top Bar Role Switcher for Admin & Faculty */}
      {(isAdmin || isFaculty) && (
        <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-3xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-2 font-bold px-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role Switcher Mode:</span>
            <span className="text-slate-400 font-normal">Logged in as {user.name} ({user.role})</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-2xl border border-slate-700 font-bold">
            <button
              onClick={() => setActiveRoleView('STUDENT')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                activeRoleView === 'STUDENT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>

            {isFaculty && (
              <button
                onClick={() => setActiveRoleView('FACULTY')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                  activeRoleView === 'FACULTY' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Faculty View</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveRoleView('ADMIN')}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition ${
                  activeRoleView === 'ADMIN' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin View</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Render Active View */}
      {activeRoleView === 'STUDENT' && (
        <GateStudentDashboard
          currentUser={user}
          onOpenPdfViewer={res => setViewPdfTarget(res)}
          onRefreshData={handleRefresh}
        />
      )}

      {activeRoleView === 'FACULTY' && (
        <GateFacultyDashboard
          currentUser={user}
          onOpenUploadModal={() => {
            setReplaceTarget(null);
            setIsUploadModalOpen(true);
          }}
          onReplaceFile={res => {
            setReplaceTarget(res);
            setIsUploadModalOpen(true);
          }}
          onOpenPdfViewer={res => setViewPdfTarget(res)}
          onRefreshData={handleRefresh}
        />
      )}

      {activeRoleView === 'ADMIN' && (
        <GateAdminDashboard
          currentUser={user}
          onOpenPdfViewer={res => setViewPdfTarget(res)}
          onRefreshData={handleRefresh}
        />
      )}

      {/* Upload & Replacement Modal */}
      <ResourceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setReplaceTarget(null);
        }}
        currentUser={user}
        onUploadResource={handleUploadResource}
        replaceResourceTarget={replaceTarget}
        onReplaceFile={handleReplaceFile}
      />

      {/* In-App PDF Viewer Modal */}
      <InAppPdfViewerModal
        resource={viewPdfTarget}
        isOpen={!!viewPdfTarget}
        onClose={() => setViewPdfTarget(null)}
        isBookmarked={viewPdfTarget ? GateService.getBookmarks(user.id).includes(viewPdfTarget.id) : false}
        onToggleBookmark={id => {
          GateService.toggleBookmark(user.id, id);
          handleRefresh();
        }}
        onDownload={(id) => {
          if (viewPdfTarget) {
            GateService.incrementDownload(id);
            window.open(viewPdfTarget.fileUrl, '_blank');
          }
        }}
      />
    </div>
  );
};
