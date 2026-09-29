import React, { useState } from 'react';
import { LeaveRequest } from '../../../types';
import { exportToCSV } from '../../../utils/leaveUtils';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

interface LeaveReportsExporterProps {
  isOpen: boolean;
  onClose: () => void;
  leaves: LeaveRequest[];
}

export const LeaveReportsExporter: React.FC<LeaveReportsExporterProps> = ({
  isOpen,
  onClose,
  leaves
}) => {
  const [reportType, setReportType] = useState<'STUDENT' | 'DEPT' | 'ATTENDANCE' | 'TYPES'>('STUDENT');
  const [format, setFormat] = useState<'CSV' | 'EXCEL'>('CSV');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setDownloadSuccess(false);

    let filename = 'CKCET_Leave_Report';
    let dataToExport: Record<string, any>[] = [];

    if (reportType === 'STUDENT') {
      filename = `Student_Leave_Summary_${new Date().toISOString().split('T')[0]}`;
      dataToExport = leaves.map(l => ({
        'Application ID': l.applicationId || l.id,
        'Student Name': l.studentName,
        'Register No': l.rollNumber,
        'Department': l.department,
        'Year/Sec': `${l.year || ''} Sec ${l.section || ''}`,
        'Leave Type': l.type,
        'From Date': l.startDate,
        'To Date': l.endDate,
        'Total Days': l.daysCount,
        'Reason': l.reason,
        'Status': l.status,
        'Advisor Name': l.advisorName || 'N/A',
        'HOD Name': l.hodName || 'N/A',
        'Submitted Date': l.submittedDate || l.appliedOn
      }));
    } else if (reportType === 'DEPT') {
      filename = `Department_Leave_Summary_${new Date().toISOString().split('T')[0]}`;
      // Group by department
      const deptMap: Record<string, { total: number; approved: number; rejected: number; days: number }> = {};
      leaves.forEach(l => {
        const d = l.department || 'General';
        if (!deptMap[d]) deptMap[d] = { total: 0, approved: 0, rejected: 0, days: 0 };
        deptMap[d].total += 1;
        if (l.status === 'Approved') {
          deptMap[d].approved += 1;
          deptMap[d].days += l.daysCount || 1;
        }
        if (l.status === 'Rejected') deptMap[d].rejected += 1;
      });

      dataToExport = Object.keys(deptMap).map(dept => ({
        'Department Name': dept,
        'Total Applications': deptMap[dept].total,
        'Approved Applications': deptMap[dept].approved,
        'Rejected Applications': deptMap[dept].rejected,
        'Total Sanctioned Days': deptMap[dept].days
      }));
    } else if (reportType === 'ATTENDANCE') {
      filename = `Attendance_Impact_Analysis_${new Date().toISOString().split('T')[0]}`;
      dataToExport = leaves.map(l => ({
        'Student Name': l.studentName,
        'Register No': l.rollNumber,
        'Department': l.department,
        'Sanctioned Leave Days': l.daysCount,
        'Estimated Attendance Impact': `-${((l.daysCount * 6 / 120) * 100).toFixed(2)}%`,
        'Approval Status': l.status
      }));
    } else if (reportType === 'TYPES') {
      filename = `Leave_Type_Usage_Report_${new Date().toISOString().split('T')[0]}`;
      const typeMap: Record<string, number> = {};
      leaves.forEach(l => {
        typeMap[l.type] = (typeMap[l.type] || 0) + 1;
      });

      dataToExport = Object.keys(typeMap).map(type => ({
        'Leave Type Category': type,
        'Total Requests': typeMap[type],
        'Approved Count': leaves.filter(l => l.type === type && l.status === 'Approved').length,
        'Rejected Count': leaves.filter(l => l.type === type && l.status === 'Rejected').length
      }));
    }

    exportToCSV(filename, dataToExport);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Export Leave Management Reports</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {downloadSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Report downloaded successfully!</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2">Select Report Dataset</label>
            <div className="space-y-2">
              {[
                { id: 'STUDENT', title: 'Student Leave Applications Summary', desc: 'Detailed log of all individual student applications, dates, and approval notes.' },
                { id: 'DEPT', title: 'Department-wise Aggregated Report', desc: 'Summary of total requests, approved vs rejected counts by department.' },
                { id: 'ATTENDANCE', title: 'Attendance Impact Analysis', desc: 'Calculated impact on student attendance percentages.' },
                { id: 'TYPES', title: 'Leave Type Distribution Report', desc: 'Category breakdown of leave types utilized.' }
              ].map(item => (
                <label
                  key={item.id}
                  onClick={() => setReportType(item.id as any)}
                  className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-all ${
                    reportType === item.id
                      ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === item.id}
                    onChange={() => {}}
                    className="mt-0.5 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-slate-500 text-[11px]">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2">Output Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('CSV')}
                className={`p-3 rounded-xl border font-bold flex items-center justify-center space-x-2 transition-all ${
                  format === 'CSV' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>CSV Spreadsheet</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('EXCEL')}
                className={`p-3 rounded-xl border font-bold flex items-center justify-center space-x-2 transition-all ${
                  format === 'EXCEL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Excel Compatible</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-500 font-mono text-xs">{leaves.length} records in database</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
