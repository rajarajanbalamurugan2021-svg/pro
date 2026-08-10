import React, { useState, useEffect } from 'react';
import {
  DailyAttendanceRecord,
  AttendanceSession,
  User,
  AttendanceStatusType
} from '../../../types';
import {
  AttendanceService,
  INITIAL_FACULTY_SUBJECTS,
  INITIAL_STUDENTS_LIST
} from '../../../services/attendanceService';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  AlertTriangle,
  UserCheck,
  CalendarDays,
  Sparkles,
  BookOpen,
  Building2,
  Users,
  Info,
  ShieldCheck,
  Send,
  RotateCcw
} from 'lucide-react';

interface TakeAttendanceTabProps {
  currentUser?: User;
  onSuccessSubmit?: () => void;
}

export const TakeAttendanceTab: React.FC<TakeAttendanceTabProps> = ({ currentUser, onSuccessSubmit }) => {
  // Filter / Selection State
  const [department, setDepartment] = useState('ELECTRONICS AND COMMUNICATION ENGINEERING');
  const [year, setYear] = useState<number>(2);
  const [section, setSection] = useState('A');
  const [semester, setSemester] = useState<number>(3);
  const [subjectId, setSubjectId] = useState('sub-ece-301');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState<number>(1);

  // Student Attendance Records for selected class
  const [studentRecords, setStudentRecords] = useState<
    {
      studentId: string;
      registerNumber: string;
      rollNumber: string;
      studentName: string;
      department: string;
      year: number | string;
      section: string;
      semester: number;
      status: AttendanceStatusType;
      autoDetected?: boolean;
      detectedReason?: string;
    }[]
  >([]);

  // Validation & Modal State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Available subjects matching selection
  const filteredSubjects = INITIAL_FACULTY_SUBJECTS.filter(
    (s) => s.department === department && Number(s.year) === Number(year) && Number(s.semester) === Number(semester)
  );

  // Selected subject object
  const selectedSubjectObj = INITIAL_FACULTY_SUBJECTS.find((s) => s.id === subjectId) || INITIAL_FACULTY_SUBJECTS[0];

  // Load matching students and check for approved Leave & OD
  useEffect(() => {
    // Check if session already recorded
    const existingSessions = AttendanceService.getSessions();
    const existing = existingSessions.find(
      (s) =>
        s.department === department &&
        String(s.year) === String(year) &&
        s.section === section &&
        s.subjectId === subjectId &&
        s.date === date &&
        s.period === period
    );

    if (existing) {
      setDuplicateWarning(
        `Attendance has already been recorded for ${existing.subjectName} (Period ${existing.period}) on ${existing.date}. You can edit it from Attendance History.`
      );
    } else {
      setDuplicateWarning(null);
    }

    // Filter students
    const matchedStudents = INITIAL_STUDENTS_LIST.filter(
      (st) =>
        st.department === department &&
        Number(st.year) === Number(year) &&
        st.section === section &&
        Number(st.semester) === Number(semester)
    );

    // Populate with auto-detected Leave/OD checks
    const populated = matchedStudents.map((st) => {
      const detected = AttendanceService.checkLeaveAndOD(st.studentId, st.registerNumber, date);
      let initialStatus: AttendanceStatusType = 'PRESENT';
      let autoDetected = false;
      let detectedReason = '';

      if (detected === 'LEAVE') {
        initialStatus = 'LEAVE';
        autoDetected = true;
        detectedReason = 'Approved Medical / Personal Leave Application';
      } else if (detected === 'OD') {
        initialStatus = 'OD';
        autoDetected = true;
        detectedReason = 'Approved On-Duty (OD) Permission';
      }

      return {
        studentId: st.studentId,
        registerNumber: st.registerNumber,
        rollNumber: st.rollNumber,
        studentName: st.studentName,
        department: st.department,
        year: st.year,
        section: st.section,
        semester: st.semester,
        status: initialStatus,
        autoDetected,
        detectedReason
      };
    });

    setStudentRecords(populated);
    setErrorMsg(null);
  }, [department, year, section, semester, subjectId, date, period]);

  // Bulk Actions
  const markAll = (status: AttendanceStatusType) => {
    setStudentRecords((prev) =>
      prev.map((rec) => ({
        ...rec,
        status
      }))
    );
  };

  const setSingleStatus = (studentId: string, status: AttendanceStatusType) => {
    setStudentRecords((prev) =>
      prev.map((rec) => (rec.studentId === studentId ? { ...rec, status } : rec))
    );
  };

  // Stats calculation
  const totalCount = studentRecords.length;
  const presentCount = studentRecords.filter((r) => r.status === 'PRESENT').length;
  const absentCount = studentRecords.filter((r) => r.status === 'ABSENT').length;
  const odCount = studentRecords.filter((r) => r.status === 'OD').length;
  const leaveCount = studentRecords.filter((r) => r.status === 'LEAVE').length;
  const attendancePct = totalCount > 0 ? +((presentCount / totalCount) * 100).toFixed(1) : 0;

  // Validate before showing confirmation modal
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setErrorMsg('Please select a subject.');
      return;
    }
    if (!date) {
      setErrorMsg('Please select a date.');
      return;
    }
    if (!period) {
      setErrorMsg('Please select a period.');
      return;
    }
    if (studentRecords.length === 0) {
      setErrorMsg('No students found for the selected Department, Year, and Section.');
      return;
    }

    setErrorMsg(null);
    setIsConfirmOpen(true);
  };

  // Final submit to AttendanceService
  const handleFinalSubmit = () => {
    setIsConfirmOpen(false);

    const facultyName = currentUser?.name || 'Prof. Faculty';
    const facultyId = currentUser?.id || 'u-faculty-1';

    const dailyRecords: DailyAttendanceRecord[] = studentRecords.map((st, idx) => ({
      id: `rec-${Date.now()}-${idx}`,
      studentId: st.studentId,
      registerNumber: st.registerNumber,
      studentName: st.studentName,
      department: st.department,
      year: st.year,
      section: st.section,
      semester: st.semester,
      subjectId: selectedSubjectObj.id,
      subjectName: selectedSubjectObj.name,
      subjectCode: selectedSubjectObj.code,
      facultyId,
      facultyName,
      date,
      period,
      status: st.status,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: facultyId
    }));

    const newSession: AttendanceSession = {
      sessionId: `sess-${Date.now()}`,
      department,
      year,
      section,
      semester,
      subjectId: selectedSubjectObj.id,
      subjectCode: selectedSubjectObj.code,
      subjectName: selectedSubjectObj.name,
      facultyId,
      facultyName,
      date,
      period,
      totalStudents: totalCount,
      presentCount,
      absentCount,
      odCount,
      leaveCount,
      attendancePercentage: attendancePct,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      records: dailyRecords
    };

    const res = AttendanceService.saveSession(newSession);

    if (res.success) {
      setSuccessMsg(`Attendance for ${selectedSubjectObj.name} (Period ${period}) recorded successfully!`);
      if (onSuccessSubmit) onSuccessSubmit();
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <CheckCircle2 className="w-4 h-4" /> Daily Class Attendance Marking
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Record Faculty Subject Attendance</h2>
          <p className="text-xs text-slate-400 mt-1">
            Log period-wise attendance, auto-fill approved Leave / On-Duty permissions, and maintain real-time audit records.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
          <CalendarDays className="w-5 h-5 text-blue-400" />
          <div className="text-xs">
            <div className="text-slate-400 font-medium">Session Date</div>
            <div className="font-extrabold text-white">{date}</div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {duplicateWarning && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{duplicateWarning}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Class Selection Form */}
      <form onSubmit={handlePreSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-blue-600" /> Select Class & Subject Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Department */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ELECTRONICS AND COMMUNICATION ENGINEERING">ECE (Electronics & Comm)</option>
              <option value="Computer Science & Engineering">CSE (Computer Science)</option>
              <option value="Information Technology">IT (Information Tech)</option>
              <option value="Mechanical Engineering">MECH (Mechanical)</option>
              <option value="Electrical & Electronics Engineering">EEE (Electrical)</option>
            </select>
          </div>

          {/* Year & Semester */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setYear(y);
                  setSemester(y * 2 - 1);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>
          </div>

          {/* Semester & Subject */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semester & Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {filteredSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} - {sub.name}
                </option>
              ))}
              {filteredSubjects.length === 0 && (
                <option value={selectedSubjectObj.id}>
                  {selectedSubjectObj.code} - {selectedSubjectObj.name}
                </option>
              )}
            </select>
          </div>

          {/* Date & Period */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Period / Hour</label>
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                  <option key={p} value={p}>
                    Period {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Summary & Quick Action Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">Quick Mark All:</span>
            <button
              type="button"
              onClick={() => markAll('PRESENT')}
              className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-200 transition"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => markAll('ABSENT')}
              className="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold hover:bg-red-200 transition"
            >
              All Absent
            </button>
            <button
              type="button"
              onClick={() => markAll('OD')}
              className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-200 transition"
            >
              All On-Duty
            </button>
          </div>

          {/* Realtime Attendance Live Metrics Pill */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200">
            <span>Total: {totalCount}</span>
            <span className="text-emerald-600 dark:text-emerald-400">Present: {presentCount}</span>
            <span className="text-red-600 dark:text-red-400">Absent: {absentCount}</span>
            <span className="text-purple-600 dark:text-purple-400">OD: {odCount}</span>
            <span className="text-amber-600 dark:text-amber-400">Leave: {leaveCount}</span>
            <span className="ml-1 pl-2 border-l border-slate-300 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-black">
              {attendancePct}%
            </span>
          </div>
        </div>

        {/* Student Attendance Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase font-extrabold border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Register Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class & Sec</th>
                <th className="py-3 px-4 text-center">Auto-Detected Status</th>
                <th className="py-3 px-4 text-center">Attendance Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentRecords.map((st, idx) => (
                <tr key={st.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {st.registerNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {st.studentName}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-500">
                    Year {st.year} - Sec {st.section}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {st.autoDetected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" title={st.detectedReason}>
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        {st.status} (Approved Request)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Standard Daily Check</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-1">
                      {/* PRESENT Button */}
                      <button
                        type="button"
                        onClick={() => setSingleStatus(st.studentId, 'PRESENT')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 ${
                          st.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" /> Present
                      </button>

                      {/* ABSENT Button */}
                      <button
                        type="button"
                        onClick={() => setSingleStatus(st.studentId, 'ABSENT')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 ${
                          st.status === 'ABSENT'
                            ? 'bg-red-600 text-white shadow'
                            : 'text-slate-600 dark:text-slate-400 hover:text-red-600'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" /> Absent
                      </button>

                      {/* ON DUTY Button */}
                      <button
                        type="button"
                        onClick={() => setSingleStatus(st.studentId, 'OD')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 ${
                          st.status === 'OD'
                            ? 'bg-purple-600 text-white shadow'
                            : 'text-slate-600 dark:text-slate-400 hover:text-purple-600'
                        }`}
                      >
                        On Duty (OD)
                      </button>

                      {/* LEAVE Button */}
                      <button
                        type="button"
                        onClick={() => setSingleStatus(st.studentId, 'LEAVE')}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1 ${
                          st.status === 'LEAVE'
                            ? 'bg-amber-600 text-white shadow'
                            : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Attendance Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={!!duplicateWarning}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition"
          >
            <Send className="w-4 h-4" /> Save & Submit Attendance Session
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Confirm Attendance Submission</h3>
                <p className="text-xs text-slate-500">
                  Please verify attendance counts before finalizing the session ledger.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Subject:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSubjectObj.code} - {selectedSubjectObj.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Class:</span>
                <span className="font-bold text-slate-900 dark:text-white">Year {year} - Sec {section} ({department})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date & Period:</span>
                <span className="font-bold text-slate-900 dark:text-white">{date} • Period {period}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-4 gap-2 text-center font-bold">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <div className="text-[10px] uppercase">Present</div>
                  <div className="text-base font-black">{presentCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                  <div className="text-[10px] uppercase">Absent</div>
                  <div className="text-base font-black">{absentCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  <div className="text-[10px] uppercase">OD</div>
                  <div className="text-base font-black">{odCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  <div className="text-[10px] uppercase">Leave</div>
                  <div className="text-base font-black">{leaveCount}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Go Back & Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
