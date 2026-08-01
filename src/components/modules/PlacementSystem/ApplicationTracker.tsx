import React, { useState } from 'react';
import { User, PlacementApplication, ApplicationStatus } from '../../../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  FileText,
  MapPin,
  Sparkles,
  Search,
  ChevronRight,
  Filter
} from 'lucide-react';

interface Props {
  user: User;
  applications: PlacementApplication[];
}

export const ApplicationTracker: React.FC<Props> = ({ user, applications }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter for student's own applications if student, or all if admin/placement officer
  const userApps = user.role === 'student'
    ? applications.filter((app) => app.studentId === user.id)
    : applications;

  const filteredApps = userApps.filter((app) => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesQuery =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700">Applied</span>;
      case 'Under Review':
        return <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg border border-blue-200 dark:border-blue-800">Under Review</span>;
      case 'Shortlisted':
        return <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-lg border border-purple-200 dark:border-purple-800">Shortlisted</span>;
      case 'Interview Scheduled':
        return <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-lg border border-amber-200 dark:border-amber-800">Interview Scheduled</span>;
      case 'Selected':
        return <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800">Selected</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Application Tracker & Interview Schedule
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time stage tracking for all active internship and placement applications ({filteredApps.length}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
            No applications match the selected criteria.
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{app.opportunityTitle}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {app.companyName} • <span className="text-slate-400">{app.type}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-right">
                    <span className="text-[10px] text-slate-400 block">AI Profile Match</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{app.matchingScore}%</span>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {/* Student info if viewed by admin/recruiter */}
              {user.role !== 'student' && (
                <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span>Applicant: <strong className="text-slate-900 dark:text-white">{app.studentName}</strong> ({app.studentRoll})</span>
                  <span>Dept: <strong>{app.department}</strong> | CGPA: <strong>{app.cgpa}</strong></span>
                </div>
              )}

              {/* Scheduled Interview Details Banner */}
              {app.status === 'Interview Scheduled' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
                  <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    Interview Scheduled: {app.interviewDate || 'Date TBD'}
                  </div>
                  <div className="text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-600" />
                    Location/Venue: {app.interviewLocation || 'Online Video Meeting'}
                  </div>
                  {app.notes && <div className="text-[11px] text-amber-700 dark:text-amber-400 italic">Notes: {app.notes}</div>}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Applied on: {app.appliedAt}</span>
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" /> View Submitted Resume
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
