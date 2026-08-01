import React, { useState } from 'react';
import { User, PlacementOpportunity, PlacementApplication } from '../../../types';
import {
  Briefcase,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Plus
} from 'lucide-react';

interface Props {
  user: User;
  opportunities: PlacementOpportunity[];
  applications: PlacementApplication[];
  onUpdateApplicationStatus: (appId: string, status: any, date?: string, location?: string, notes?: string) => void;
}

export const RecruiterPortal: React.FC<Props> = ({
  user,
  opportunities,
  applications,
  onUpdateApplicationStatus
}) => {
  const [selectedApp, setSelectedApp] = useState<PlacementApplication | null>(null);
  const [scheduleDate, setScheduleDate] = useState('2026-08-15 at 10:00 AM');
  const [scheduleLocation, setScheduleLocation] = useState('Zoho Tech Campus / Google Meet Link');
  const [notes, setNotes] = useState('Shortlisted after technical screening round.');

  const recruiterApps = applications;

  const handleUpdateStatus = (appId: string, status: any) => {
    onUpdateApplicationStatus(appId, status, scheduleDate, scheduleLocation, notes);
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      {/* Recruiter Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Recruiter & Industry Talent Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View student applications, evaluate AI compatibility scores, download resumes, schedule interviews, and announce selection results.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          Total Student Candidates: {recruiterApps.length}
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Applied Candidate Profiles</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recruiterApps.map((app) => (
            <div key={app.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{app.studentName}</h4>
                  <span className="text-xs text-slate-400 font-mono">({app.studentRoll})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {app.department}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Applied for: <strong className="text-slate-700 dark:text-slate-200">{app.opportunityTitle}</strong> ({app.companyName})
                </p>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  CGPA: <strong className="text-slate-700 dark:text-slate-300">{app.cgpa}</strong> • Applied on: {app.appliedAt}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block">AI Match</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{app.matchingScore}%</span>
                </div>

                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <FileText className="h-3.5 w-3.5" /> Resume
                </a>

                <button
                  onClick={() => setSelectedApp(app)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Calendar className="h-3.5 w-3.5" /> Action / Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action / Schedule Interview Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Application for {selectedApp.studentName}
            </h3>
            <p className="text-xs text-slate-500">
              Target Role: <strong>{selectedApp.opportunityTitle}</strong> ({selectedApp.companyName})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Interview Date & Time</label>
                <input
                  type="text"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Venue / Online Link</label>
                <input
                  type="text"
                  value={scheduleLocation}
                  onChange={(e) => setScheduleLocation(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Recruiter Notes / Round Instructions</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => handleUpdateStatus(selectedApp.id, 'Interview Scheduled')}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApp.id, 'Selected')}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Mark Selected
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedApp.id, 'Rejected')}
                className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
