import React, { useState } from 'react';
import { UserRole, StudentAttendanceSummary, AttendanceSubjectRecord } from '../../../types';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Upload,
  Plus,
  Save,
  FileSpreadsheet,
  Users,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';

interface AttendanceModuleProps {
  userRole: UserRole;
  currentUserId?: string;
  attendanceSummary?: StudentAttendanceSummary;
  onUpdateAttendanceRecord?: (records: AttendanceSubjectRecord[]) => void;
}

// Initial Mock Attendance Records for Faculty Editing
const INITIAL_FACULTY_ATTENDANCE_RECORDS: AttendanceSubjectRecord[] = [
  { id: 'att-1', studentId: 'u-student-1', registerNumber: 'CS2023001', studentName: 'Alex Rivera', department: 'Computer Science & Engineering', semester: 6, section: 'A', courseCode: 'CS601', courseName: 'Distributed Systems & Cloud', totalClasses: 24, attendedClasses: 22, percentage: 91.67, status: 'Eligible', lastUpdated: '2026-08-01' },
  { id: 'att-2', studentId: 'u-student-2', registerNumber: 'CS2023002', studentName: 'Sophia Patel', department: 'Computer Science & Engineering', semester: 6, section: 'A', courseCode: 'CS601', courseName: 'Distributed Systems & Cloud', totalClasses: 24, attendedClasses: 24, percentage: 100, status: 'Eligible', lastUpdated: '2026-08-01' },
  { id: 'att-3', studentId: 'u-student-3', registerNumber: 'CS2023003', studentName: 'Rohan Sharma', department: 'Computer Science & Engineering', semester: 6, section: 'A', courseCode: 'CS601', courseName: 'Distributed Systems & Cloud', totalClasses: 24, attendedClasses: 16, percentage: 66.67, status: 'Shortage', lastUpdated: '2026-08-01' },
  { id: 'att-4', studentId: 'u-student-4', registerNumber: 'CS2023004', studentName: 'Kavita Menon', department: 'Computer Science & Engineering', semester: 6, section: 'B', courseCode: 'CS601', courseName: 'Distributed Systems & Cloud', totalClasses: 24, attendedClasses: 21, percentage: 87.5, status: 'Eligible', lastUpdated: '2026-08-01' },
  { id: 'att-5', studentId: 'u-student-5', registerNumber: 'CS2023005', studentName: 'David Chen', department: 'Computer Science & Engineering', semester: 6, section: 'B', courseCode: 'CS601', courseName: 'Distributed Systems & Cloud', totalClasses: 24, attendedClasses: 15, percentage: 62.5, status: 'Shortage', lastUpdated: '2026-08-01' }
];

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  userRole,
  currentUserId,
  attendanceSummary
}) => {
  const [records, setRecords] = useState<AttendanceSubjectRecord[]>(INITIAL_FACULTY_ATTENDANCE_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSem, setSelectedSem] = useState<number | 'All'>('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Eligible' | 'Shortage'>('All');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecords, setEditingRecords] = useState<AttendanceSubjectRecord[]>(INITIAL_FACULTY_ATTENDANCE_RECORDS);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // New Record Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('CS601');
  const [newCourseName, setNewCourseName] = useState('Distributed Systems & Cloud');
  const [newTotalClasses, setNewTotalClasses] = useState(24);
  const [newAttendedClasses, setNewAttendedClasses] = useState(20);

  const canManageAttendance = userRole === 'admin' || userRole === 'super_admin' || userRole === 'faculty';

  // Filtered records for Faculty/Admin table
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || r.department === selectedDept;
    const matchesSem = selectedSem === 'All' || r.semester === Number(selectedSem);
    const matchesCourse = selectedCourse === 'All' || r.courseCode === selectedCourse;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesDept && matchesSem && matchesCourse && matchesStatus;
  });

  const shortageCount = records.filter((r) => r.status === 'Shortage').length;

  const handleStartEdit = () => {
    setEditingRecords([...records]);
    setIsEditing(true);
  };

  const handleAttendedChange = (id: string, value: number) => {
    setEditingRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          const attended = Math.max(0, Math.min(rec.totalClasses, value));
          const pct = +((attended / (rec.totalClasses || 1)) * 100).toFixed(1);
          return {
            ...rec,
            attendedClasses: attended,
            percentage: pct,
            status: pct < 75 ? 'Shortage' : 'Eligible',
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return rec;
      })
    );
  };

  const handleSaveAttendance = () => {
    setRecords(editingRecords);
    setIsEditing(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 4000);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newRegNo) return;

    const pct = +((newAttendedClasses / (newTotalClasses || 1)) * 100).toFixed(1);
    const newRec: AttendanceSubjectRecord = {
      id: `att-${Date.now()}`,
      studentId: `u-student-${Date.now()}`,
      registerNumber: newRegNo,
      studentName: newStudentName,
      department: 'Computer Science & Engineering',
      semester: 6,
      section: 'A',
      courseCode: newCourseCode,
      courseName: newCourseName,
      totalClasses: newTotalClasses,
      attendedClasses: newAttendedClasses,
      percentage: pct,
      status: pct < 75 ? 'Shortage' : 'Eligible',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setRecords([newRec, ...records]);
    setIsModalOpen(false);
    setNewStudentName('');
    setNewRegNo('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white shadow-lg shadow-emerald-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
            <Clock className="h-4 w-4" /> Attendance Monitoring & Shortage Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Subject Attendance & Eligibility Portal
          </h1>
          <p className="text-sm text-emerald-100 mt-1 max-w-xl">
            Real-time subject attendance logging, automated 75% shortage warnings, and faculty attendance upload management.
          </p>
        </div>

        {canManageAttendance && (
          <div className="flex flex-wrap items-center gap-2">
            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow hover:bg-emerald-50 transition"
              >
                <Upload className="h-4 w-4" /> Bulk Edit Attendance
              </button>
            ) : (
              <button
                onClick={handleSaveAttendance}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-900 font-black text-xs shadow hover:bg-amber-300 transition"
              >
                <Save className="h-4 w-4" /> Save Uploaded Attendance
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-950 text-white font-bold text-xs ring-1 ring-white/20 transition"
            >
              <Plus className="h-4 w-4" /> Add Attendance Entry
            </button>
          </div>
        )}
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle className="h-4 w-4 text-emerald-600" /> Attendance logs updated successfully and synced across student portals!
        </div>
      )}

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tracked Students</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{records.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across CSE, ECE, ME & IT</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Attendance</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {+(records.reduce((acc, r) => acc + r.percentage, 0) / (records.length || 1)).toFixed(1)}%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Class Average Above Threshold</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eligible Students (&ge; 75%)</span>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {records.filter((r) => r.status === 'Eligible').length}
          </div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Cleared for Hall Ticket Generation</p>
        </div>

        <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 shadow-sm">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Shortage Warnings (&lt; 75%)</span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {shortageCount}
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold mt-1">Requires Class Advisor Meeting</p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student, register no, or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Eligibility</option>
            <option value="Eligible">Eligible (&ge; 75%)</option>
            <option value="Shortage">Shortage (&lt; 75%)</option>
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Electronics & Communication">ECE</option>
            <option value="Mechanical Engineering">ME</option>
            <option value="Information Technology">IT</option>
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Courses</option>
            <option value="CS601">CS601 - Cloud</option>
            <option value="CS602">CS602 - AI & ML</option>
            <option value="CS603">CS603 - Web Arch</option>
          </select>
        </div>

      </div>

      {/* Main Table: Attendance Ledger */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" /> Student Attendance Directory
          </h3>
          <span className="text-xs text-slate-400 font-semibold">
            Showing {filteredRecords.length} of {records.length} Records
          </span>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
              <th className="py-3 px-3">Register No</th>
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3">Course Code & Name</th>
              <th className="py-3 px-3 text-center">Section</th>
              <th className="py-3 px-3 text-center">Total Classes</th>
              <th className="py-3 px-3 text-center">Attended Classes</th>
              <th className="py-3 px-3 text-center">Percentage</th>
              <th className="py-3 px-3 text-center">Eligibility Status</th>
              <th className="py-3 px-3 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredRecords.map((rec) => {
              const displayRec = isEditing ? editingRecords.find((e) => e.id === rec.id) || rec : rec;

              return (
                <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {rec.registerNumber}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                    {rec.studentName}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{rec.courseCode}</div>
                    <div className="text-[10px] text-slate-400">{rec.courseName}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-600 dark:text-slate-400">
                    Sec {rec.section}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                    {rec.totalClasses}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={rec.totalClasses}
                        value={displayRec.attendedClasses}
                        onChange={(e) => handleAttendedChange(rec.id, Number(e.target.value))}
                        className="w-16 text-center py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-lg font-extrabold text-slate-900 dark:text-white focus:outline-none"
                      />
                    ) : (
                      <span className="font-extrabold text-slate-900 dark:text-white">{rec.attendedClasses}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-black">
                    <span className={displayRec.percentage < 75 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {displayRec.percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {displayRec.status === 'Eligible' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ELIGIBLE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                        SHORTAGE (&lt;75%)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right text-slate-400 text-[11px]">
                    {rec.lastUpdated}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Add Student Attendance Record</h3>
            
            <form onSubmit={handleCreateRecord} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Student Register No</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS2023006"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Classes</label>
                  <input
                    type="number"
                    value={newTotalClasses}
                    onChange={(e) => setNewTotalClasses(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Classes Attended</label>
                  <input
                    type="number"
                    value={newAttendedClasses}
                    onChange={(e) => setNewAttendedClasses(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                >
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
