import React, { useState } from 'react';
import { StudentAttendanceSummary, UserRole } from '../../../types';
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  UserCheck,
  BarChart3,
  Search,
  ScanLine
} from 'lucide-react';
import { callAIAnalyzeAttendance } from '../../../services/api';

interface LabAttendanceProps {
  attendanceData: StudentAttendanceSummary;
  userRole: UserRole;
}

export const LabAttendance: React.FC<LabAttendanceProps> = ({
  attendanceData,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'qr_scanner' | 'manual_sheet'>('summary');
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  
  // AI Attendance Risk State
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Manual sheet state
  const [students, setStudents] = useState([
    { id: 'u-student-1', name: 'Alex Rivera', roll: 'CS2023001', present: true },
    { id: 'u-student-2', name: 'Sophia Patel', roll: 'CS2023002', present: true },
    { id: 'u-student-3', name: 'Ethan Vance', roll: 'CS2023003', present: false },
    { id: 'u-student-4', name: 'Maya Lin', roll: 'CS2023004', present: true }
  ]);

  const handleGenerateQR = () => {
    setQrCodeGenerated(true);
    setScannedSuccess(false);
  };

  const handleSimulateScan = () => {
    setScannedSuccess(true);
  };

  const handleAnalyzeAI = async () => {
    setLoadingAi(true);
    const data = await callAIAnalyzeAttendance(attendanceData);
    setAiAnalysis(data);
    setLoadingAi(false);
  };

  const handleExportCSV = () => {
    const csvContent =
      'Subject Name,Total Classes,Attended Classes,Percentage,Eligible\n' +
      attendanceData.subjectWise
        .map((s) => `"${s.subjectName}",${s.total},${s.attended},${s.percentage}%,${s.percentage >= 75 ? 'YES' : 'NO'}`)
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Report_${attendanceData.rollNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLowAttendance = attendanceData.percentage < 75;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 text-white shadow-lg shadow-teal-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-200">
            <QrCode className="h-4 w-4" /> Automated QR & Practical Lab Attendance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Lab Attendance & Smart Tracking
          </h1>
          <p className="text-sm text-teal-100 mt-1 max-w-xl">
            Scan dynamic session QR codes, review subject attendance percentages, and generate official hall ticket eligibility reports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-teal-800 text-xs font-extrabold hover:bg-teal-50 transition shadow-md"
        >
          <FileSpreadsheet className="h-4 w-4" /> Export Attendance Excel
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'summary'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" /> Attendance Summary
        </button>
        <button
          onClick={() => setActiveTab('qr_scanner')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'qr_scanner'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <QrCode className="h-4 w-4" /> Dynamic QR Session Scanner
        </button>
        <button
          onClick={() => setActiveTab('manual_sheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'manual_sheet'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="h-4 w-4" /> Faculty Register
        </button>
      </div>

      {/* SUMMARY TAB */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          
          {/* Overview Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Overall Attendance Percentage</span>
              <div className={`text-3xl font-extrabold mt-1 ${isLowAttendance ? 'text-rose-600' : 'text-emerald-600'}`}>
                {attendanceData.percentage}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {attendanceData.attendedClasses} / {attendanceData.totalClasses} total class hours
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Exam Hall Ticket Status</span>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  isLowAttendance
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {isLowAttendance ? 'SHORTAGE WARNING (<75%)' : 'ELIGIBLE FOR EXAMINATIONS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Minimum threshold requirement: 75.0%</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">AI Risk Assessment</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Run Gemini AI calculation to predict minimum required classes to reach 75%.
                </p>
              </div>
              <button
                onClick={handleAnalyzeAI}
                disabled={loadingAi}
                className="mt-2 w-full py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {loadingAi ? 'Analyzing...' : 'Run AI Risk Analysis'}
              </button>
            </div>
          </div>

          {aiAnalysis && (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
              <div className="font-bold text-purple-900 dark:text-purple-200 text-xs flex items-center justify-between">
                <span>Risk Status: {aiAnalysis.riskLevel}</span>
                {aiAnalysis.classesNeededToReach75 > 0 && (
                  <span className="text-rose-600 font-extrabold bg-rose-100 px-2 py-0.5 rounded">
                    Needs {aiAnalysis.classesNeededToReach75} consecutive classes
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">{aiAnalysis.summary}</p>
            </div>
          )}

          {/* Subject-wise Attendance Table */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Subject-wise Lab & Theory Attendance Breakdown
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Total Classes</th>
                  <th className="py-2.5 px-3">Attended</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Progress Bar</th>
                  <th className="py-2.5 px-3">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceData.subjectWise.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{sub.subjectName}</td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{sub.total}</td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{sub.attended}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900 dark:text-white">{sub.percentage}%</td>
                    <td className="py-3 px-3 w-44">
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold">
                      {sub.percentage >= 75 ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> ELIGIBLE
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> SHORTAGE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* QR SCANNER TAB */}
      {activeTab === 'qr_scanner' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-md mx-auto text-center space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-teal-600" /> Lab Session QR Attendance
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Faculty projects dynamic QR code; students scan via smartphone camera for instant geo-verified presence.
            </p>
          </div>

          {!qrCodeGenerated ? (
            <button
              onClick={handleGenerateQR}
              className="px-6 py-3 rounded-2xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-500/20 hover:bg-teal-700 transition"
            >
              Generate Live Session QR Code
            </button>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-6 rounded-2xl border-2 border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 inline-block">
                <div className="h-48 w-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-4 mx-auto">
                  <QrCode className="h-28 w-28 text-teal-400" />
                  <span className="text-[10px] font-mono text-teal-300 mt-2">SESSION: CS606-LAB-04</span>
                </div>
              </div>

              <div>
                {!scannedSuccess ? (
                  <button
                    onClick={handleSimulateScan}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2 mx-auto"
                  >
                    <ScanLine className="h-4 w-4" /> Simulate Student QR Scan
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Attendance Verified & Recorded on Ledger!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MANUAL SHEET TAB */}
      {activeTab === 'manual_sheet' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-teal-600" /> Faculty Manual Attendance Register
            </h2>
            <span className="text-xs text-slate-400 font-mono">Date: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Roll Number</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Status Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{st.roll}</td>
                    <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{st.name}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          const updated = [...students];
                          updated[idx].present = !updated[idx].present;
                          setStudents(updated);
                        }}
                        className={`px-4 py-1.5 rounded-xl font-extrabold text-xs transition ${
                          st.present
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {st.present ? 'PRESENT' : 'ABSENT'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
