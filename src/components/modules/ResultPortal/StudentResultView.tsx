import React, { useState } from 'react';
import { StudentResult, SubjectResult, UserRole, StudentAttendanceSummary } from '../../../types';
import {
  Award,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Download,
  Printer,
  Calendar,
  User as UserIcon,
  TrendingUp,
  Percent,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface StudentResultViewProps {
  selectedResult: StudentResult;
  allStudentResults: StudentResult[];
  onSelectSemesterResult?: (result: StudentResult) => void;
  attendanceData?: StudentAttendanceSummary;
  onDownloadMarksheet: () => void;
}

export const StudentResultView: React.FC<StudentResultViewProps> = ({
  selectedResult,
  allStudentResults,
  onSelectSemesterResult,
  attendanceData,
  onDownloadMarksheet
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(selectedResult?.semester || 6);

  const gradeColors: Record<string, string> = {
    'O': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300',
    'A+': 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300',
    'A': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-300',
    'B+': 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300',
    'B': 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300',
    'C': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
    'F': 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300'
  };

  const chartData = (selectedResult?.subjects || []).map((s) => ({
    name: s.subjectCode,
    Internal: s.internalMarks,
    External: s.externalMarks,
    Total: s.totalMarks
  }));

  // Calculate overall percentage based on SGPA (Standard CGPA * 9.5 formula)
  const overallPercentage = selectedResult?.sgpa ? +(selectedResult.sgpa * 9.5).toFixed(1) : 0;

  // Attendance shortage check
  const isShortage = attendanceData ? attendanceData.percentage < 75 : false;

  return (
    <div className="space-y-6">
      
      {/* Attendance Shortage Warning Banner if applicable */}
      {isShortage && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm animate-pulse">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed">
            <span className="font-extrabold text-amber-800 dark:text-amber-300">ATTENDANCE SHORTAGE WARNING: </span>
            Your total attendance is currently <span className="font-bold">{attendanceData?.percentage}%</span> (Minimum required: 75%). Please meet your class advisor immediately to avoid examination hall ticket detention.
          </div>
        </div>
      )}

      {/* Student Details Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-extrabold shadow-lg shadow-blue-500/20 shrink-0">
              {selectedResult.studentName ? selectedResult.studentName.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedResult.studentName || 'Alex Rivera'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Reg: {selectedResult.rollNumber || 'CS2023001'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Department: <strong className="text-slate-700 dark:text-slate-300">{selectedResult.department}</strong></span>
                <span>Batch: <strong className="text-slate-700 dark:text-slate-300">{selectedResult.batch}</strong></span>
                <span>Current Semester: <strong className="text-blue-600 dark:text-blue-400 font-bold">Semester {selectedResult.semester}</strong></span>
              </p>
            </div>
          </div>

          {/* Semester Selector Buttons & Download */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    const match = allStudentResults.find((r) => r.semester === sem);
                    if (match && onSelectSemesterResult) {
                      onSelectSemesterResult(match);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedSemester === sem
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>

            <button
              onClick={onDownloadMarksheet}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition"
            >
              <Printer className="h-4 w-4" /> Download Official Marksheet PDF
            </button>
          </div>

        </div>
      </div>

      {/* Top Academic Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester SGPA</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
            {selectedResult.sgpa || 8.85} <span className="text-xs font-normal text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +0.25 improvement from Sem {Math.max(1, selectedSemester - 1)}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative CGPA</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {selectedResult.cgpa || 8.72} <span className="text-xs font-normal text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Total Credits Earned: <strong className="text-slate-800 dark:text-slate-200">{selectedResult.totalCredits || 124} Credits</strong>
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Percentage</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Percent className="h-4 w-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">
            {overallPercentage}%
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-2">
            Class Standing Rank: #{selectedResult.rank || 3}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Result Status</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-block">
              FIRST CLASS WITH DISTINCTION
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Published: {selectedResult.publishedDate || 'June 15, 2026'}
          </p>
        </div>

      </div>

      {/* Main Content Grid: Subject Marks Table & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Detailed Marks Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" /> Subject-wise Examination Score Card
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed internal (50), external (50), and practical marks for Semester {selectedResult.semester}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {selectedResult.subjects?.length || 0} Subjects
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Course Title</th>
                  <th className="py-3 px-3 text-center">Credits</th>
                  <th className="py-3 px-3 text-center">Internal (50)</th>
                  <th className="py-3 px-3 text-center">External (50)</th>
                  <th className="py-3 px-3 text-center">Total (100)</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {(selectedResult?.subjects || []).map((sub) => (
                  <tr key={sub.subjectId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {sub.subjectCode}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                      {sub.subjectName}
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-600 dark:text-slate-400">
                      {sub.credits}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {sub.internalMarks}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {sub.externalMarks}
                    </td>
                    <td className="py-3.5 px-3 text-center font-black text-slate-900 dark:text-white text-sm">
                      {sub.totalMarks}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg font-black text-xs border ${gradeColors[sub.grade] || 'bg-slate-100 text-slate-800'}`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {sub.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-3.5 w-3.5" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-3.5 w-3.5" /> RE-APPEAR
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>Grade Points: <strong>O (10)</strong>, <strong>A+ (9)</strong>, <strong>A (8)</strong>, <strong>B+ (7)</strong>, <strong>B (6)</strong></span>
            </div>
            <div>
              <span>Formula: <strong>SGPA = Σ(Credits × Grade Point) / Σ(Credits)</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Charts & Attendance Overview */}
        <div className="space-y-6">
          
          {/* Subject Marks Bar Chart */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" /> Internal vs External Score Distribution
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="Internal" fill="#3b82f6" stackId="a" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="External" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs font-semibold pt-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-500"></span> Internal Marks (50)
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-purple-500"></span> External Marks (50)
              </div>
            </div>
          </div>

          {/* Attendance Overview Card */}
          {attendanceData && (
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-500" /> Semester Attendance Record
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  attendanceData.percentage >= 75
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {attendanceData.percentage >= 75 ? 'ELIGIBLE FOR EXAMS' : 'SHORTAGE ALERT'}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Total Classes Attended</span>
                  <span className="text-slate-900 dark:text-white">{attendanceData.attendedClasses} / {attendanceData.totalClasses} ({attendanceData.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      attendanceData.percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, attendanceData.percentage)}%` }}
                  />
                </div>
              </div>

              {/* Subject-wise Attendance Mini List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject-wise Attendance</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {attendanceData.subjectWise?.map((sw, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{sw.subjectName}</span>
                      <span className={`font-mono font-bold ${sw.percentage < 75 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {sw.attended}/{sw.total} ({sw.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
