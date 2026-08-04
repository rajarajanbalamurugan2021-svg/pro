import React from 'react';
import { StudentResult, StudentAttendanceSummary } from '../../../types';
import { Download, Printer, X, FileText, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface ReportsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentResult?: StudentResult;
  allResults?: StudentResult[];
  attendanceSummary?: StudentAttendanceSummary;
}

export const ReportsExportModal: React.FC<ReportsExportModalProps> = ({
  isOpen,
  onClose,
  studentResult,
  allResults,
  attendanceSummary
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (!studentResult) return;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Subject Code,Subject Name,Credits,Internal Marks,External Marks,Total Marks,Grade,Status\n';

    studentResult.subjects.forEach((s) => {
      csvContent += `"${s.subjectCode}","${s.subjectName}",${s.credits},${s.internalMarks},${s.externalMarks},${s.totalMarks},"${s.grade}","${s.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${studentResult.studentName}_Semester_${studentResult.semester}_Marksheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <span className="font-extrabold text-sm">Official University Marksheet Document Viewer</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              <Download className="h-4 w-4" /> Export CSV / Excel
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Container */}
        <div className="p-8 space-y-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 printable-area">
          
          {/* Institutional Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 dark:border-slate-100 space-y-1">
            <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
              CHRIST KINGS COLLEGE OF ENGINEERING & TECHNOLOGY
            </h1>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Approved by AICTE • Affiliated to Anna University • Accredited by NAAC 'A+' Grade
            </p>
            <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest pt-1">
              OFFICIAL SEMESTER GRADE REPORT & MARKSHEET
            </p>
          </div>

          {/* Student Info Grid */}
          {studentResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Student Name</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{studentResult.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Register Number</span>
                <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">{studentResult.rollNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Department</span>
                <span className="font-bold">{studentResult.department}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Semester & Batch</span>
                <span className="font-bold">Semester {studentResult.semester} ({studentResult.batch})</span>
              </div>
            </div>
          )}

          {/* Subjects Score Table */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white uppercase font-black">
                <th className="py-2.5 px-2">Course Code</th>
                <th className="py-2.5 px-2">Course Title</th>
                <th className="py-2.5 px-2 text-center">Credits</th>
                <th className="py-2.5 px-2 text-center">Internal (50)</th>
                <th className="py-2.5 px-2 text-center">External (50)</th>
                <th className="py-2.5 px-2 text-center">Total (100)</th>
                <th className="py-2.5 px-2 text-center">Grade</th>
                <th className="py-2.5 px-2 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {studentResult?.subjects.map((s, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-2 font-mono font-bold text-blue-600 dark:text-blue-400">{s.subjectCode}</td>
                  <td className="py-2.5 px-2 font-bold">{s.subjectName}</td>
                  <td className="py-2.5 px-2 text-center">{s.credits}</td>
                  <td className="py-2.5 px-2 text-center">{s.internalMarks}</td>
                  <td className="py-2.5 px-2 text-center">{s.externalMarks}</td>
                  <td className="py-2.5 px-2 text-center font-black">{s.totalMarks}</td>
                  <td className="py-2.5 px-2 text-center font-extrabold">{s.grade}</td>
                  <td className="py-2.5 px-2 text-center font-black text-emerald-600">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Overall Performance Footer Summary */}
          {studentResult && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Semester SGPA</span>
                <span className="text-xl font-black text-emerald-400">{studentResult.sgpa} / 10.0</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Cumulative CGPA</span>
                <span className="text-xl font-black text-blue-400">{studentResult.cgpa} / 10.0</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Total Credits Earned</span>
                <span className="text-xl font-black text-white">{studentResult.totalCredits} Credits</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block">Final Classification</span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase">
                  FIRST CLASS WITH DISTINCTION
                </span>
              </div>
            </div>
          )}

          {/* Signatures Footer */}
          <div className="pt-12 flex items-center justify-between text-xs text-slate-500 font-bold border-t border-slate-200 dark:border-slate-800">
            <div className="text-center">
              <div className="h-10 w-32 border-b border-slate-400 mb-1" />
              <span>Prepared By</span>
            </div>
            <div className="text-center">
              <div className="h-10 w-32 border-b border-slate-400 mb-1" />
              <span>Head of Department</span>
            </div>
            <div className="text-center">
              <div className="h-10 w-32 border-b border-slate-400 mb-1" />
              <span>Controller of Examinations</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
