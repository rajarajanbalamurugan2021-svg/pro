import React, { useState, useEffect } from 'react';
import {
  AttendanceSession,
  DailyAttendanceRecord,
  AttendanceAuditLog,
  User,
  AttendanceStatusType
} from '../../../types';
import { AttendanceService } from '../../../services/attendanceService';
import {
  Search,
  Filter,
  Calendar,
  FileSpreadsheet,
  Download,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Users,
  ShieldAlert,
  Save,
  X,
  FileText
} from 'lucide-react';

interface AttendanceHistoryTabProps {
  currentUser?: User;
}

export const AttendanceHistoryTab: React.FC<AttendanceHistoryTabProps> = ({ currentUser }) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [audits, setAudits] = useState<AttendanceAuditLog[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Selected session for viewing/editing
  const [viewingSession, setViewingSession] = useState<AttendanceSession | null>(null);
  const [editingSession, setEditingSession] = useState<AttendanceSession | null>(null);
  const [editedRecords, setEditedRecords] = useState<DailyAttendanceRecord[]>([]);
  const [auditReason, setAuditReason] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  // Load Sessions
  const reloadData = () => {
    setSessions(AttendanceService.getSessions());
    setAudits(AttendanceService.getAuditLogs());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Filtered Sessions
  const filteredSessions = sessions.filter((sess) => {
    const matchesSearch =
      sess.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sess.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || sess.department === selectedDept;
    const matchesSubject = selectedSubject === 'All' || sess.subjectId === selectedSubject;
    const matchesStart = !startDate || sess.date >= startDate;
    const matchesEnd = !endDate || sess.date <= endDate;

    return matchesSearch && matchesDept && matchesSubject && matchesStart && matchesEnd;
  });

  // Handle Edit Trigger
  const handleOpenEdit = (sess: AttendanceSession) => {
    setEditingSession(sess);
    setEditedRecords(JSON.parse(JSON.stringify(sess.records)));
    setAuditReason('');
    setEditError(null);
  };

  // Toggle record status in edit mode
  const handleRecordStatusChange = (studentId: string, newStatus: AttendanceStatusType) => {
    setEditedRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status: newStatus } : r))
    );
  };

  // Save Edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    if (!auditReason.trim()) {
      setEditError('A mandatory audit reason is required for modifying attendance history.');
      return;
    }

    const editorName = currentUser?.name || 'Prof. Faculty';
    const res = AttendanceService.editSession(editingSession.sessionId, editedRecords, editorName, auditReason);

    if (res.success) {
      setEditSuccess('Attendance updated successfully and audit log created.');
      setEditingSession(null);
      reloadData();
      setTimeout(() => setEditSuccess(null), 4000);
    } else {
      setEditError(res.message);
    }
  };

  // Export session history
  const handleExportCSV = () => {
    if (filteredSessions.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Date,Period,Department,Year,Section,Subject Code,Subject Name,Total,Present,Absent,OD,Leave,Attendance %\n';

    filteredSessions.forEach((s) => {
      const row = [
        s.date,
        s.period,
        `"${s.department}"`,
        s.year,
        s.section,
        s.subjectCode || '',
        `"${s.subjectName}"`,
        s.totalStudents,
        s.presentCount,
        s.absentCount,
        s.odCount,
        s.leaveCount,
        `${s.attendancePercentage}%`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Attendance Session History</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse recorded daily attendance logs, view individual period sessions, edit entries with audit reasons, and export reports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
        >
          <Download className="w-4 h-4" /> Export Ledger (CSV)
        </button>
      </div>

      {editSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> {editSuccess}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subject, faculty name, code or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Departments</option>
            <option value="ELECTRONICS AND COMMUNICATION ENGINEERING">ECE</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Information Technology">IT</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
            title="Start Date Filter"
          />
          <span className="text-slate-400 font-bold">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
            title="End Date Filter"
          />
        </div>
      </div>

      {/* History Session Cards & Table */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" /> Recorded Sessions ({filteredSessions.length})
          </h3>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
              <th className="py-3 px-3">Date & Period</th>
              <th className="py-3 px-3">Subject</th>
              <th className="py-3 px-3">Class & Section</th>
              <th className="py-3 px-3 text-center">Total Students</th>
              <th className="py-3 px-3 text-center">Present / Absent / OD / Leave</th>
              <th className="py-3 px-3 text-center">Attendance %</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredSessions.map((sess) => (
              <tr key={sess.sessionId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="py-3.5 px-3">
                  <div className="font-extrabold text-slate-900 dark:text-white">{sess.date}</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Period {sess.period}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900 dark:text-white">{sess.subjectCode} - {sess.subjectName}</div>
                  <div className="text-[10px] text-slate-400">By {sess.facultyName}</div>
                </td>
                <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-400">
                  Year {sess.year} • Sec {sess.section} ({sess.department.split(' ')[0]})
                </td>
                <td className="py-3.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                  {sess.totalStudents}
                </td>
                <td className="py-3.5 px-3 text-center">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">{sess.presentCount} P</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-red-600 dark:text-red-400">{sess.absentCount} A</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-purple-600 dark:text-purple-400">{sess.odCount} OD</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-600 dark:text-amber-400">{sess.leaveCount} L</span>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-center font-black">
                  <span className={sess.attendancePercentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                    {sess.attendancePercentage}%
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setViewingSession(sess)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
                      title="View Student List"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(sess)}
                      className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 text-blue-700 dark:text-blue-300 transition"
                      title="Edit Attendance"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Viewing Modal */}
      {viewingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {viewingSession.subjectCode} - {viewingSession.subjectName}
                </h3>
                <p className="text-xs text-slate-500">
                  {viewingSession.date} • Period {viewingSession.period} • Year {viewingSession.year} Sec {viewingSession.section}
                </p>
              </div>
              <button onClick={() => setViewingSession(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {viewingSession.records.map((rec) => (
                <div key={rec.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-bold">
                  <div>
                    <div className="text-slate-900 dark:text-white">{rec.studentName}</div>
                    <div className="text-[10px] text-blue-600 font-mono">{rec.registerNumber}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      rec.status === 'PRESENT'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'ABSENT'
                        ? 'bg-red-100 text-red-800'
                        : rec.status === 'OD'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setViewingSession(null)} className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Attendance Session</h3>
                <p className="text-xs text-slate-500">
                  {editingSession.subjectName} • {editingSession.date} • Period {editingSession.period}
                </p>
              </div>
              <button onClick={() => setEditingSession(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" /> {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {editedRecords.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{rec.studentName}</div>
                      <div className="text-[10px] text-blue-600 font-mono">{rec.registerNumber}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(['PRESENT', 'ABSENT', 'OD', 'LEAVE'] as AttendanceStatusType[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleRecordStatusChange(rec.studentId, st)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition ${
                            rec.status === st
                              ? st === 'PRESENT'
                                ? 'bg-emerald-600 text-white'
                                : st === 'ABSENT'
                                ? 'bg-red-600 text-white'
                                : st === 'OD'
                                ? 'bg-purple-600 text-white'
                                : 'bg-amber-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Audit Reason for Modification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student provided medical proof / OD slip updated by advisor"
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow"
                >
                  Save & Update Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
