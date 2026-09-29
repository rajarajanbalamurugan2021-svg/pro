import React, { useState, useEffect } from 'react';
import { AttendanceService } from '../../../services/attendanceService';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Download,
  Search,
  Users,
  Building2,
  Send,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const LowAttendanceAlertsTab: React.FC = () => {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [notifSentMap, setNotifSentMap] = useState<Record<string, boolean>>({});
  const [globalNotifSuccess, setGlobalNotifSuccess] = useState(false);

  useEffect(() => {
    setSummaries(AttendanceService.getStudentOverallSummary());
  }, []);

  const shortageStudents = summaries.filter((s) => s.percentage < 75);

  const filteredShortage = shortageStudents.filter((s) => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || s.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleSendSingleAlert = (studentId: string, studentName: string, pct: number) => {
    const session = {
      sessionId: 'alert-manual',
      department: '',
      year: '',
      section: '',
      semester: 1,
      subjectId: '',
      subjectName: '',
      facultyId: '',
      facultyName: '',
      date: new Date().toISOString().split('T')[0],
      period: 1,
      totalStudents: 1,
      presentCount: 0,
      absentCount: 1,
      odCount: 0,
      leaveCount: 0,
      attendancePercentage: pct,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      records: []
    };

    AttendanceService.processLowAttendanceAlerts(session);
    setNotifSentMap((prev) => ({ ...prev, [studentId]: true }));
  };

  const handleSendAllAlerts = () => {
    filteredShortage.forEach((s) => {
      handleSendSingleAlert(s.studentId, s.studentName, s.percentage);
    });
    setGlobalNotifSuccess(true);
    setTimeout(() => setGlobalNotifSuccess(false), 4000);
  };

  const handleExportShortageList = () => {
    if (filteredShortage.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Register Number,Student Name,Department,Year,Section,Total Classes,Attended Classes,Attendance %,Classes Needed for 75%\n';

    filteredShortage.forEach((s) => {
      const classesNeeded = Math.ceil((0.75 * s.totalClasses - s.attendedClasses) / 0.25);
      const row = [
        s.registerNumber,
        `"${s.studentName}"`,
        `"${s.department}"`,
        s.year,
        s.section,
        s.totalClasses,
        s.attendedClasses,
        `${s.percentage}%`,
        Math.max(0, classesNeeded)
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Low_Attendance_Shortage_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
            <ShieldAlert className="w-4 h-4" /> Mandatory 75% Institutional Threshold
          </div>
          <h2 className="text-2xl font-black mt-1">Low Attendance Shortage Alerts (&lt; 75%)</h2>
          <p className="text-xs text-amber-100 mt-1 max-w-xl">
            Identify students at risk of hall ticket withholding, issue in-app shortage warnings, and track necessary recovery classes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSendAllAlerts}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-amber-900 font-extrabold text-xs shadow hover:bg-amber-50 transition"
          >
            <Bell className="w-4 h-4 text-amber-600" /> Send Warning Alerts to All ({filteredShortage.length})
          </button>
          <button
            onClick={handleExportShortageList}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-950 text-white font-bold text-xs ring-1 ring-white/20 transition"
          >
            <Download className="w-4 h-4" /> Download Shortage Report
          </button>
        </div>
      </div>

      {globalNotifSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Low attendance warning alerts pushed to all affected student portals!
        </div>
      )}

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or register number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

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
      </div>

      {/* Shortage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShortage.map((student) => {
          const classesNeeded = Math.max(0, Math.ceil((0.75 * student.totalClasses - student.attendedClasses) / 0.25));
          const isSent = notifSentMap[student.studentId];

          return (
            <div
              key={student.studentId}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{student.studentName}</h3>
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {student.registerNumber}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                  {student.percentage}%
                </span>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div>Department: <span className="font-semibold text-slate-800 dark:text-slate-200">{student.department}</span></div>
                <div>Class: <span className="font-semibold text-slate-800 dark:text-slate-200">Year {student.year} • Sec {student.section}</span></div>
                <div>Attended: <span className="font-bold text-slate-900 dark:text-white">{student.attendedClasses} / {student.totalClasses} classes</span></div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-200 font-bold flex items-center justify-between">
                <span>Classes Needed for 75%:</span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">{classesNeeded} classes</span>
              </div>

              <button
                onClick={() => handleSendSingleAlert(student.studentId, student.studentName, student.percentage)}
                disabled={isSent}
                className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                  isSent
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow'
                }`}
              >
                {isSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Alert Issued to Student
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Portal Shortage Alert
                  </>
                )}
              </button>
            </div>
          );
        })}

        {filteredShortage.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No Shortage Warnings Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All students in the selected query maintain attendance percentages above the mandatory 75% threshold!
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
