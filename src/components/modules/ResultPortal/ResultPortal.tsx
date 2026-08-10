import React, { useState } from 'react';
import { StudentResult, UserRole, StudentAttendanceSummary } from '../../../types';
import {
  Award,
  Calculator,
  Download,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  Search,
  BookOpen,
  Printer,
  ShieldCheck,
  Lock,
  Clock,
  UserCheck,
  FileText
} from 'lucide-react';

import { StudentResultView } from './StudentResultView';
import { AttendanceModule } from './AttendanceModule';
import { FacultyMarksEntry } from './FacultyMarksEntry';
import { AdminResultControl } from './AdminResultControl';
import { AcademicAnalyticsView } from './AcademicAnalyticsView';
import { GpaCalculatorView } from './GpaCalculatorView';
import { ReportsExportModal } from './ReportsExportModal';
import { normalizeRole } from '../../../lib/rbac';
import { AccessDeniedPage } from '../../common/AccessDeniedPage';

interface ResultPortalProps {
  results?: StudentResult[];
  result?: StudentResult;
  userRole: UserRole;
  onUpdateResults?: (results: StudentResult[]) => void;
  attendanceData?: StudentAttendanceSummary;
  defaultTab?: string;
}

export const ResultPortal: React.FC<ResultPortalProps> = ({
  results,
  result,
  userRole: initialRole,
  onUpdateResults,
  attendanceData,
  defaultTab
}) => {
  const normRole = normalizeRole(initialRole);
  const isStudent = normRole === 'student';
  const isFaculty = normRole === 'faculty';
  const isAdminOrSuper = normRole === 'admin' || normRole === 'super_admin';

  const allResults = results && results.length > 0 ? results : (result ? [result] : []);
  const [currentResultList, setCurrentResultList] = useState<StudentResult[]>(allResults);
  const [selectedResult, setSelectedResult] = useState<StudentResult>(allResults[0] || {} as StudentResult);

  const getInitialTab = () => {
    if (defaultTab && ['student_view', 'attendance', 'faculty_marks', 'admin_control', 'analytics', 'calculator'].includes(defaultTab)) {
      return defaultTab as any;
    }
    if (defaultTab === 'marks') return 'faculty_marks';
    if (defaultTab === 'gpa_calculator') return 'calculator';
    if (defaultTab === 'reports' || defaultTab === 'analytics') return 'analytics';
    if (isFaculty) return 'faculty_marks';
    if (isAdminOrSuper) return 'admin_control';
    return 'student_view';
  };

  const [activeTab, setActiveTab] = useState<
    'student_view' | 'attendance' | 'faculty_marks' | 'admin_control' | 'analytics' | 'calculator'
  >(getInitialTab);

  React.useEffect(() => {
    if (defaultTab) {
      if (['student_view', 'attendance', 'faculty_marks', 'admin_control', 'analytics', 'calculator'].includes(defaultTab)) {
        setActiveTab(defaultTab as any);
      } else if (defaultTab === 'marks') {
        setActiveTab('faculty_marks');
      } else if (defaultTab === 'gpa_calculator') {
        setActiveTab('calculator');
      } else if (defaultTab === 'reports' || defaultTab === 'analytics') {
        setActiveTab('analytics');
      }
    }
  }, [defaultTab]);

  const [isResultLocked, setIsResultLocked] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  React.useEffect(() => {
    if (allResults.length > 0 && (!selectedResult || !selectedResult.id)) {
      setSelectedResult(allResults[0]);
    }
    if (results && results.length > 0) {
      setCurrentResultList(results);
    }
  }, [results, result]);

  const handleUpdateResults = (updatedList: StudentResult[]) => {
    setCurrentResultList(updatedList);
    if (onUpdateResults) {
      onUpdateResults(updatedList);
    }
    if (updatedList.length > 0) {
      const updatedMatch = updatedList.find((r) => r.id === selectedResult.id || r.studentId === selectedResult.studentId);
      if (updatedMatch) {
        setSelectedResult(updatedMatch);
      }
    }
  };

  const handleToggleResultLock = (semester: number, department: string) => {
    setIsResultLocked((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Module Identity & Export Modal Trigger */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Student Result Management & Academic Analytics
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {normRole.toUpperCase()} PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Integrated grade publishing, faculty evaluation, attendance shortage warnings, and interactive SGPA/CGPA analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/20 transition"
          >
            <Printer className="h-4 w-4" /> Download Official Reports
          </button>
        </div>
      </div>

      {/* Main Module Tabs Sub-Header (Filtered by Role) */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold scrollbar-none">
        
        <button
          onClick={() => setActiveTab('student_view')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'student_view'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="h-4 w-4" /> Student Marksheet & SGPA
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="h-4 w-4" /> Attendance & Shortage Tracker
        </button>

        {/* FACULTY & ADMIN ONLY: Marks Upload */}
        {(isFaculty || isAdminOrSuper) && (
          <button
            onClick={() => setActiveTab('faculty_marks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'faculty_marks'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" /> Faculty Marks Upload
          </button>
        )}

        {/* ADMIN & SUPER ADMIN ONLY: Admin Result Controls */}
        {isAdminOrSuper && (
          <button
            onClick={() => setActiveTab('admin_control')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
              activeTab === 'admin_control'
                ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="h-4 w-4" /> Admin Controls & Lock
          </button>
        )}

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="h-4 w-4" /> Academic Analytics & Trends
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="h-4 w-4" /> SGPA / CGPA Calculator
        </button>

      </div>

      {/* Tab Render Switcher with Guard Checks */}
      <div>
        {activeTab === 'student_view' && (
          <StudentResultView
            selectedResult={selectedResult}
            allStudentResults={currentResultList}
            onSelectSemesterResult={(res) => setSelectedResult(res)}
            attendanceData={attendanceData}
            onDownloadMarksheet={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceModule
            userRole={initialRole}
            attendanceSummary={attendanceData}
          />
        )}

        {activeTab === 'faculty_marks' && (
          isFaculty || isAdminOrSuper ? (
            <FacultyMarksEntry
              userRole={initialRole}
              results={currentResultList}
              onUpdateResults={handleUpdateResults}
              isResultLocked={isResultLocked}
            />
          ) : (
            <AccessDeniedPage userRole={initialRole} moduleName="Faculty Marks Upload" requiredRole="Faculty / Admin" />
          )
        )}

        {activeTab === 'admin_control' && (
          isAdminOrSuper ? (
            <AdminResultControl
              userRole={initialRole}
              isResultLocked={isResultLocked}
              onToggleResultLock={handleToggleResultLock}
            />
          ) : (
            <AccessDeniedPage userRole={initialRole} moduleName="Admin Controls & Publication Lock" requiredRole="Admin / SuperAdmin" />
          )
        )}

        {activeTab === 'analytics' && (
          <AcademicAnalyticsView
            results={currentResultList}
          />
        )}

        {activeTab === 'calculator' && (
          <GpaCalculatorView />
        )}
      </div>

      {/* Official Export Modal */}
      <ReportsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        studentResult={selectedResult}
        allResults={currentResultList}
        attendanceSummary={attendanceData}
      />

    </div>
  );
};
