import React, { useEffect, useState } from 'react';
import { AttendanceService } from '../../../services/attendanceService';
import { AttendanceSession } from '../../../types';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';

export const AttendanceAnalyticsTab: React.FC = () => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [summaries, setSummaries] = useState<any[]>([]);

  useEffect(() => {
    setSessions(AttendanceService.getSessions());
    setSummaries(AttendanceService.getStudentOverallSummary());
  }, []);

  // Aggregated Metrics
  const totalSessions = sessions.length;
  const avgAttendancePct =
    sessions.length > 0
      ? +(sessions.reduce((acc, s) => acc + s.attendancePercentage, 0) / sessions.length).toFixed(1)
      : 85.0;

  const totalPresent = sessions.reduce((acc, s) => acc + s.presentCount, 0);
  const totalAbsent = sessions.reduce((acc, s) => acc + s.absentCount, 0);
  const totalOD = sessions.reduce((acc, s) => acc + s.odCount, 0);
  const totalLeave = sessions.reduce((acc, s) => acc + s.leaveCount, 0);
  const grandTotal = totalPresent + totalAbsent + totalOD + totalLeave || 1;

  const presentPct = +((totalPresent / grandTotal) * 100).toFixed(1);
  const absentPct = +((totalAbsent / grandTotal) * 100).toFixed(1);
  const odPct = +((totalOD / grandTotal) * 100).toFixed(1);
  const leavePct = +((totalLeave / grandTotal) * 100).toFixed(1);

  // Subject-wise Grouping
  const subjectMap: Record<string, { name: string; totalPct: number; count: number }> = {};
  sessions.forEach((s) => {
    if (!subjectMap[s.subjectId]) {
      subjectMap[s.subjectId] = { name: s.subjectName, totalPct: 0, count: 0 };
    }
    subjectMap[s.subjectId].totalPct += s.attendancePercentage;
    subjectMap[s.subjectId].count += 1;
  });

  const subjectStats = Object.values(subjectMap).map((sub) => ({
    name: sub.name,
    avgPct: +(sub.totalPct / (sub.count || 1)).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">Faculty Attendance Analytics & Intelligence</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual distribution of class attendance, subject compliance, and shortage trends.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Overall Average</div>
            <div className="text-lg font-black text-emerald-400">{avgAttendancePct}%</div>
          </div>
        </div>
      </div>

      {/* Stats Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Recorded Sessions</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalSessions}</div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Across ECE, CSE & IT Departments</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Present Marks</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalPresent}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">{presentPct}% of Total Student Logs</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Duty (OD) Approved</span>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">{totalOD}</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">{odPct}% Academic Exemption</p>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-sm">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Shortage Students (&lt;75%)</span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {summaries.filter((s) => s.percentage < 75).length}
          </div>
          <p className="text-[11px] text-amber-700 font-semibold mt-1">Class Advisor Follow-up Required</p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution Bar Chart Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" /> Attendance Status Distribution
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Overall Breakdown</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700 dark:text-emerald-300">PRESENT ({totalPresent})</span>
                <span className="text-emerald-600">{presentPct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${presentPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-red-700 dark:text-red-300">ABSENT ({totalAbsent})</span>
                <span className="text-red-600">{absentPct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${absentPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-purple-700 dark:text-purple-300">ON DUTY ({totalOD})</span>
                <span className="text-purple-600">{odPct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${odPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-700 dark:text-amber-300">APPROVED LEAVE ({totalLeave})</span>
                <span className="text-amber-600">{leavePct}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${leavePct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Compliance Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" /> Subject-Wise Average Compliance
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{subjectStats.length} Subjects</span>
          </div>

          <div className="space-y-3 pt-2">
            {subjectStats.map((sub, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-800 dark:text-slate-200 truncate max-w-[220px]">{sub.name}</span>
                  <span className={sub.avgPct >= 75 ? 'text-emerald-600' : 'text-amber-600'}>{sub.avgPct}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${sub.avgPct >= 75 ? 'bg-blue-600' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, sub.avgPct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
