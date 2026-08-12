import React, { useState } from 'react';
import { GateResource, GateMockTest } from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import { QuestionBankModule } from './QuestionBankModule';
import { MockTestBuilderModal } from './MockTestBuilderModal';
import {
  Upload,
  Plus,
  FileText,
  HelpCircle,
  Settings,
  Eye,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle2,
  BarChart2
} from 'lucide-react';

interface GateFacultyDashboardProps {
  currentUser: { id: string; name: string; role: string };
  onOpenUploadModal: () => void;
  onReplaceFile: (res: GateResource) => void;
  onOpenPdfViewer: (res: GateResource) => void;
  onRefreshData?: () => void;
}

export const GateFacultyDashboard: React.FC<GateFacultyDashboardProps> = ({
  currentUser,
  onOpenUploadModal,
  onReplaceFile,
  onOpenPdfViewer,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'MY_UPLOADS' | 'QUESTIONS' | 'MOCK_TESTS'>('MY_UPLOADS');
  const [isTestBuilderOpen, setIsTestBuilderOpen] = useState(false);

  // Load Faculty Resources
  const allResources = GateService.getResources({ includeDeleted: false });
  const myResources = allResources.filter(r => r.uploadedBy === currentUser.id || currentUser.role === 'super_admin' || currentUser.role === 'admin');
  const mockTests = GateService.getMockTests();

  const handleDeleteResource = (id: string) => {
    GateService.softDeleteResource(id, currentUser);
    if (onRefreshData) onRefreshData();
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Top Banner Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">FACULTY GATE PORTAL</span>
          <h2 className="text-lg font-black text-white">Content Management & Assessment Studio</h2>
          <p className="text-xs text-slate-300">Upload PDFs, PYQs, Formula Sheets, create question banks, and build student mock tests.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUploadModal}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF / Material</span>
          </button>

          <button
            onClick={() => setIsTestBuilderOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Mock Test</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold">
        <button
          onClick={() => setActiveTab('MY_UPLOADS')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'MY_UPLOADS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          My Uploaded Resources ({myResources.length})
        </button>

        <button
          onClick={() => setActiveTab('QUESTIONS')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'QUESTIONS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          Question Bank Management
        </button>

        <button
          onClick={() => setActiveTab('MOCK_TESTS')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'MOCK_TESTS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          Mock Test Catalog ({mockTests.length})
        </button>
      </div>

      {/* MY UPLOADS TAB */}
      {activeTab === 'MY_UPLOADS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">My Managed Educational Resources</h3>
          {myResources.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
              No uploaded resources yet. Click "Upload PDF / Material" to upload PYQs, notes, or formula sheets.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myResources.map(res => (
                <div key={res.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold text-[10px]">
                        GATE {res.gatePaper} • {res.resourceType.replace(/_/g, ' ')}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{res.title}</h4>
                      <p className="text-slate-500">{res.subject} • v{res.version}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      res.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {res.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">{res.viewCount} Views • {res.downloadCount} Downloads</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenPdfViewer(res)}
                        className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
                        title="Preview PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onReplaceFile(res)}
                        className="p-1.5 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200"
                        title="Replace File Version"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Soft delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* QUESTION BANK TAB */}
      {activeTab === 'QUESTIONS' && (
        <QuestionBankModule currentUser={currentUser} onRefreshData={onRefreshData} />
      )}

      {/* MOCK TESTS TAB */}
      {activeTab === 'MOCK_TESTS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 dark:text-white text-base">Active GATE Mock Test Catalog</h3>
            <button
              onClick={() => setIsTestBuilderOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              + Build New Mock Test
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTests.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-[10px]">GATE {t.gatePaper}</span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.title}</h4>
                <p className="text-slate-500">{t.totalQuestions} Questions • {t.durationMinutes} Mins • {t.totalMarks} Marks</p>
                <div className="text-[11px] font-mono text-emerald-500 font-bold">{t.attemptCount} Student Attempts Recorded</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock Test Builder Modal */}
      <MockTestBuilderModal
        isOpen={isTestBuilderOpen}
        onClose={() => setIsTestBuilderOpen(false)}
        currentUser={currentUser}
        onCreated={() => {
          if (onRefreshData) onRefreshData();
        }}
      />
    </div>
  );
};
