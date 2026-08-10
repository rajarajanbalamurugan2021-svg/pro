import React, { useState } from 'react';
import { AttendanceService } from '../../../services/attendanceService';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Building2,
  Users,
  BookOpen,
  CheckCircle,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

export const AttendanceReportsTab: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'subject' | 'class' | 'student' | 'monthly' | 'shortage'>('daily');
  const [department, setDepartment] = useState('ELECTRONICS AND COMMUNICATION ENGINEERING');
  const [year, setYear] = useState<number>(2);
  const [section, setSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const handleGenerateAndExportCSV = () => {
    const sessions = AttendanceService.getSessions();
    const summaries = AttendanceService.getStudentOverallSummary();

    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'daily') {
      csvContent += 'Date,Period,Department,Year,Section,Subject Code,Subject Name,Total,Present,Absent,OD,Leave,Attendance %\n';
      sessions.filter((s) => s.date === selectedDate).forEach((s) => {
        csvContent += `${s.date},${s.period},"${s.department}",${s.year},${s.section},${s.subjectCode},"${s.subjectName}",${s.totalStudents},${s.presentCount},${s.absentCount},${s.odCount},${s.leaveCount},${s.attendancePercentage}%\n`;
      });
    } else if (reportType === 'shortage') {
      csvContent += 'Register Number,Student Name,Department,Year,Section,Total Classes,Attended Classes,Attendance %\n';
      summaries.filter((s) => s.percentage < 75).forEach((s) => {
        csvContent += `${s.registerNumber},"${s.studentName}","${s.department}",${s.year},${s.section},${s.totalClasses},${s.attendedClasses},${s.percentage}%\n`;
      });
    } else {
      csvContent += 'Register Number,Student Name,Department,Year,Section,Total Classes,Attended Classes,Overall Attendance %\n';
      summaries.forEach((s) => {
        csvContent += `${s.registerNumber},"${s.studentName}","${s.department}",${s.year},${s.section},${s.totalClasses},${s.attendedClasses},${s.percentage}%\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CKCET_Attendance_${reportType.toUpperCase()}_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setGeneratedSuccess(true);
    setTimeout(() => setGeneratedSuccess(false), 4000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Attendance Reports & Document Generator</h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate official daily, subject-wise, class-wise, student-wise, monthly, or low-attendance shortage reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
          <button
            onClick={handleGenerateAndExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition"
          >
            <Download className="w-4 h-4" /> Export CSV Report
          </button>
        </div>
      </div>

      {generatedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" /> Attendance report generated and downloaded successfully.
        </div>
      )}

      {/* Report Type Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {[
          { id: 'daily', label: 'Daily Report', icon: Calendar },
          { id: 'subject', label: 'Subject Report', icon: BookOpen },
          { id: 'class', label: 'Class Report', icon: Building2 },
          { id: 'student', label: 'Student Report', icon: Users },
          { id: 'monthly', label: 'Monthly Report', icon: Layers },
          { id: 'shortage', label: 'Shortage Report', icon: FileSpreadsheet }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = reportType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setReportType(t.id as any)}
              className={`p-4 rounded-2xl border font-extrabold text-center space-y-2 transition ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto" />
              <div>{t.label}</div>
            </button>
          );
        })}
      </div>

      {/* Report Parameter Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <h3 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Report Parameters</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
            >
              <option value="ELECTRONICS AND COMMUNICATION ENGINEERING">ECE</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Year & Section</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
              >
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
              </select>

              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
              >
                <option value="A">Sec A</option>
                <option value="B">Sec B</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date Target</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateAndExportCSV}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow transition"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
