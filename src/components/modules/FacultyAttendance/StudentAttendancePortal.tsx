import React, { useState, useEffect } from 'react';
import { User } from '../../../types';
import { AttendanceService } from '../../../services/attendanceService';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Sparkles,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

interface StudentAttendancePortalProps {
  currentUser?: User;
}

export const StudentAttendancePortal: React.FC<StudentAttendancePortalProps> = ({ currentUser }) => {
  const [studentSummary, setStudentSummary] = useState<any | null>(null);
  const [mySessions, setMySessions] = useState<any[]>([]);

  useEffect(() => {
    const studentId = currentUser?.id || 'u-student-1';
    const regNo = currentUser?.registerNo || currentUser?.rollNumber || '420725106036';

    const allSummaries = AttendanceService.getStudentOverallSummary();
    const mySum = allSummaries.find(
      (s) => s.studentId === studentId || s.registerNumber === regNo || s.studentName.toLowerCase() === currentUser?.name?.toLowerCase()
    ) || {
      studentId,
      studentName: currentUser?.name || 'RAJARAJAN B',
      registerNumber: regNo,
      department: currentUser?.department || 'ELECTRONICS AND COMMUNICATION ENGINEERING',
      year: 2,
      section: 'A',
      totalClasses: 12,
      attendedClasses: 11,
      percentage: 91.67,
      subjectWise: [
        { subjectId: 'sub-ece-301', subjectName: 'Control Systems', total: 6, attended: 5, percentage: 83.33 },
        { subjectId: 'sub-ece-302', subjectName: 'Digital Electronics & Logic Design', total: 6, attended: 6, percentage: 100 }
      ]
    };

    setStudentSummary(mySum);

    // Get individual daily session records for this student
    const sessions = AttendanceService.getSessions();
    const matchedRecords: any[] = [];

    sessions.forEach((sess) => {
      sess.records.forEach((rec) => {
        if (rec.studentId === studentId || rec.registerNumber === regNo || rec.studentName.toLowerCase() === currentUser?.name?.toLowerCase()) {
          matchedRecords.push({
            date: sess.date,
            period: sess.period,
            subjectCode: sess.subjectCode,
            subjectName: sess.subjectName,
            facultyName: sess.facultyName,
            status: rec.status
          });
        }
      });
    });

    setMySessions(matchedRecords);
  }, [currentUser]);

  if (!studentSummary) return null;

  const isShortage = studentSummary.percentage < 75;

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Clock className="w-4 h-4" /> My Academic Attendance Portal
          </div>
          <h1 className="text-2xl font-black">{studentSummary.studentName}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Register No: <span className="font-mono font-bold text-blue-300">{studentSummary.registerNumber}</span> • {studentSummary.department}
          </p>
        </div>

        <div className={`p-4 rounded-2xl border ${isShortage ? 'bg-amber-950/80 border-amber-700 text-amber-200' : 'bg-emerald-950/80 border-emerald-700 text-emerald-200'} text-center`}>
          <div className="text-[10px] font-bold uppercase tracking-widest">Overall Attendance</div>
          <div className="text-3xl font-black">{studentSummary.percentage}%</div>
          <div className="text-[10px] font-bold uppercase mt-1">
            {isShortage ? '⚠️ Shortage Warning (<75%)' : '✅ Eligible for Semester Exams'}
          </div>
        </div>
      </div>

      {isShortage && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 shadow-sm text-xs font-bold text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-black">Low Attendance Alert (&lt; 75%)</h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium">
              Your current overall attendance is {studentSummary.percentage}%, which is below Anna University / CKCET mandatory 75% threshold. Please meet your Class Advisor immediately to review your attendance standing.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Classes Held</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{studentSummary.totalClasses}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total Period Sessions</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Classes Attended</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{studentSummary.attendedClasses}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Includes Present & On-Duty (OD)</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Missed / Absent</span>
          <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">
            {studentSummary.totalClasses - studentSummary.attendedClasses}
          </div>
          <p className="text-[11px] text-red-600 font-semibold mt-1">Absences or Leaves</p>
        </div>
      </div>

      {/* Subject-Wise Breakdown Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" /> Subject-Wise Attendance Breakdown
        </h3>

        <div className="space-y-3">
          {studentSummary.subjectWise?.map((sub: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 space-y-2 text-xs">
              <div className="flex items-center justify-between font-extrabold">
                <span className="text-slate-900 dark:text-white">{sub.subjectName}</span>
                <span className={sub.percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                  {sub.attended} / {sub.total} classes ({sub.percentage}%)
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, sub.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Period Session History Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 overflow-x-auto">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" /> Recent Period Logs
        </h3>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Period</th>
              <th className="py-2.5 px-3">Subject</th>
              <th className="py-2.5 px-3">Faculty</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {mySessions.map((rec, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{rec.date}</td>
                <td className="py-3 px-3 font-semibold text-blue-600 dark:text-blue-400">Period {rec.period}</td>
                <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{rec.subjectCode} - {rec.subjectName}</td>
                <td className="py-3 px-3 text-slate-500">{rec.facultyName}</td>
                <td className="py-3 px-3 text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      rec.status === 'PRESENT'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : rec.status === 'ABSENT'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : rec.status === 'OD'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {rec.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
