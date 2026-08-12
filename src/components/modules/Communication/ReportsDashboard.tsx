import React from 'react';
import { CommunicationReport, Conversation, ChatMessage, AcademicRequest } from '../../../types';
import {
  ShieldAlert,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Users,
  FileCheck2,
  Clock,
  Check,
  XCircle
} from 'lucide-react';

interface ReportsDashboardProps {
  reports: CommunicationReport[];
  conversations: Conversation[];
  messages: ChatMessage[];
  requests: AcademicRequest[];
  onUpdateReportStatus: (reportId: string, status: CommunicationReport['status'], actionNote?: string) => void;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({
  reports,
  conversations,
  messages,
  requests,
  onUpdateReportStatus
}) => {
  const totalConvs = conversations.length;
  const activeConvs = conversations.filter(c => c.status === 'OPEN').length;
  const resolvedConvs = conversations.filter(c => c.status === 'RESOLVED').length;
  const totalMsgs = messages.length;
  const totalRequests = requests.length;
  const openReports = reports.filter(r => r.status === 'OPEN' || r.status === 'UNDER_REVIEW').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <h2 className="text-xl font-black flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            <span>Communication Governance & Safety Center</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Administrative monitoring of student-faculty direct communications, safety reports, and resolution statistics.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold shrink-0">
          Super Admin Audit Enabled
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Threads</span>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalConvs}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{activeConvs} active • {resolvedConvs} resolved</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Messages Sent</span>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalMsgs}</p>
          <p className="text-[11px] text-slate-400 font-semibold">Across all departments</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Academic Doubts</span>
            <FileCheck2 className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{totalRequests}</p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Structured student queries</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Open Safety Reports</span>
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">{openReports}</p>
          <p className="text-[11px] text-red-500 font-semibold">{reports.length} total flags reported</p>
        </div>
      </div>

      {/* Safety Reports Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>Reported Content & Misconduct Flags</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">
            {reports.length} Incident Records
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 opacity-60" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Clean Safety Record</p>
            <p className="text-xs text-slate-400">No inappropriate content or safety incidents have been reported.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Reporter</th>
                  <th className="p-3">Reported User</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {rep.reporterName}
                      <p className="text-[10px] text-slate-400 font-normal">{rep.reporterRole}</p>
                    </td>
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                      {rep.reportedUserName}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold text-[10px]">
                        {rep.reason}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {rep.description}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full font-bold text-[10px] ${
                        rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950' :
                        rep.status === 'DISMISSED' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-950'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {rep.status !== 'RESOLVED' && (
                        <button
                          onClick={() => onUpdateReportStatus(rep.id, 'RESOLVED', 'Reviewed by admin. Issue resolved.')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                        >
                          Resolve
                        </button>
                      )}
                      {rep.status !== 'DISMISSED' && (
                        <button
                          onClick={() => onUpdateReportStatus(rep.id, 'DISMISSED', 'Reviewed by admin. Dismissed.')}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] hover:bg-slate-300"
                        >
                          Dismiss
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
