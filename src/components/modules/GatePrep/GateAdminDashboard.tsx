import React, { useState } from 'react';
import { GateResource, ResourceStatus, GateAuditLog, GateSettings } from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import {
  ShieldAlert,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Clock,
  FileText,
  AlertTriangle,
  History,
  Settings,
  Eye,
  Check,
  X,
  Layers,
  BarChart2
} from 'lucide-react';

interface GateAdminDashboardProps {
  currentUser: { id: string; name: string; role: string };
  onOpenPdfViewer: (res: GateResource) => void;
  onRefreshData?: () => void;
}

export const GateAdminDashboard: React.FC<GateAdminDashboardProps> = ({
  currentUser,
  onOpenPdfViewer,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'PENDING' | 'TRASH' | 'AUDIT' | 'SETTINGS'>('METRICS');

  // Load Data
  const allResources = GateService.getResources({ includeDeleted: true });
  const publishedCount = allResources.filter(r => !r.isDeleted && r.status === 'PUBLISHED').length;
  const pendingResources = allResources.filter(r => !r.isDeleted && r.status === 'PENDING_REVIEW');
  const trashResources = allResources.filter(r => r.isDeleted || r.status === 'DELETED');
  const questionsCount = GateService.getQuestions().length;
  const mockTestsCount = GateService.getMockTests().length;
  const auditLogs = GateService.getAuditLogs();
  const [settings, setSettings] = useState<GateSettings>(() => GateService.getSettings());

  const handleApproveResource = (id: string) => {
    GateService.updateResourceStatus(id, 'PUBLISHED', currentUser);
    if (onRefreshData) onRefreshData();
  };

  const handleRejectResource = (id: string) => {
    GateService.updateResourceStatus(id, 'DRAFT', currentUser, 'Needs revision on subject metadata');
    if (onRefreshData) onRefreshData();
  };

  const handleRestoreResource = (id: string) => {
    GateService.restoreResource(id, currentUser);
    if (onRefreshData) onRefreshData();
  };

  const handlePermanentDelete = (id: string) => {
    GateService.permanentDeleteResource(id, currentUser);
    if (onRefreshData) onRefreshData();
  };

  const handleToggleFacultyApproval = () => {
    const updated = GateService.updateSettings(
      { requireApprovalForFacultyUploads: !settings.requireApprovalForFacultyUploads },
      currentUser
    );
    setSettings(updated);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-slate-500 font-bold uppercase text-[10px] block">Published PDF & PYQs</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{publishedCount}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-slate-500 font-bold uppercase text-[10px] block">Pending Admin Review</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{pendingResources.length}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-slate-500 font-bold uppercase text-[10px] block">Total Questions in Bank</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">{questionsCount}</p>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <span className="text-slate-500 font-bold uppercase text-[10px] block">Soft Deleted Trash Bin</span>
          <p className="text-2xl font-black text-red-500 mt-1">{trashResources.length}</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'METRICS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          Resource Overview
        </button>

        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'PENDING' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Approvals ({pendingResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TRASH')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'TRASH' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Trash Bin ({trashResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'AUDIT' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'SETTINGS' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Permissions & Config</span>
        </button>
      </div>

      {/* PENDING APPROVALS TAB */}
      {activeTab === 'PENDING' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">Faculty Upload Approvals Queue</h3>
          {pendingResources.length === 0 ? (
            <p className="text-slate-400 italic py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              No pending uploads awaiting review.
            </p>
          ) : (
            pendingResources.map(res => (
              <div key={res.id} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">[GATE {res.gatePaper}]</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{res.title}</h4>
                  <p className="text-slate-500 font-medium">Uploaded by {res.uploadedByName} ({res.uploadedByRole}) • {res.subject}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenPdfViewer(res)}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview PDF</span>
                  </button>

                  <button
                    onClick={() => handleApproveResource(res.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>

                  <button
                    onClick={() => handleRejectResource(res.id)}
                    className="px-3 py-2 rounded-xl bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white font-bold flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TRASH RECYCLE BIN TAB */}
      {activeTab === 'TRASH' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">Soft Deleted Resources (Trash Recycle Bin)</h3>
          {trashResources.length === 0 ? (
            <p className="text-slate-400 italic py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              Trash bin is empty.
            </p>
          ) : (
            trashResources.map(res => (
              <div key={res.id} className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{res.title}</h4>
                  <p className="text-slate-500">Deleted By: {res.deletedBy || 'Admin'} • GATE {res.gatePaper}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRestoreResource(res.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restore</span>
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(res.id)}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Permanently</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">System Audit Trail</h3>
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">[{log.action}]</span>
                  <span className="text-slate-900 dark:text-white font-semibold ml-2">{log.details}</span>
                  <p className="text-[10px] text-slate-400">By {log.name} ({log.role})</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'SETTINGS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">Administrative Permissions</h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Require Admin Review for Faculty Uploads</h4>
              <p className="text-slate-500 text-xs">When enabled, faculty PDF uploads remain in 'Pending Review' state until an Admin approves them.</p>
            </div>
            <button
              onClick={handleToggleFacultyApproval}
              className={`px-4 py-2 rounded-xl font-bold text-white transition ${
                settings.requireApprovalForFacultyUploads ? 'bg-emerald-600' : 'bg-slate-600'
              }`}
            >
              {settings.requireApprovalForFacultyUploads ? 'Enabled' : 'Disabled (Auto-Publish)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
