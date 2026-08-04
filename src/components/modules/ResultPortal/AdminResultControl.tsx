import React, { useState } from 'react';
import { UserRole, GradeRule, AcademicYear, ResultLockStatus, Department } from '../../../types';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldCheck,
  BookOpen,
  Calendar,
  Layers,
  Settings,
  Users,
  Building,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface AdminResultControlProps {
  userRole: UserRole;
  isResultLocked: boolean;
  onToggleResultLock: (semester: number, department: string) => void;
  departments?: Department[];
}

const DEFAULT_GRADE_RULES: GradeRule[] = [
  { grade: 'O', minMark: 90, maxMark: 100, gradePoint: 10, description: 'Outstanding' },
  { grade: 'A+', minMark: 80, maxMark: 89, gradePoint: 9, description: 'Excellent' },
  { grade: 'A', minMark: 70, maxMark: 79, gradePoint: 8, description: 'Very Good' },
  { grade: 'B+', minMark: 60, maxMark: 69, gradePoint: 7, description: 'Good' },
  { grade: 'B', minMark: 50, maxMark: 59, gradePoint: 6, description: 'Above Average' },
  { grade: 'C', minMark: 40, maxMark: 49, gradePoint: 5, description: 'Average / Pass' },
  { grade: 'F', minMark: 0, maxMark: 39, gradePoint: 0, description: 'Fail / Re-appear' }
];

const DEFAULT_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-1', year: '2025-2026', isCurrent: true, semesters: [5, 6], status: 'Active' },
  { id: 'ay-2', year: '2024-2025', isCurrent: false, semesters: [3, 4], status: 'Archived' },
  { id: 'ay-3', year: '2026-2027', isCurrent: false, semesters: [7, 8], status: 'Upcoming' }
];

export const AdminResultControl: React.FC<AdminResultControlProps> = ({
  userRole,
  isResultLocked,
  onToggleResultLock,
  departments
}) => {
  const [activeTab, setActiveTab] = useState<'locks' | 'courses' | 'grading' | 'years'>('locks');
  
  // Locks state per semester
  const [locks, setLocks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: isResultLocked
  });

  const [selectedDeptLock, setSelectedDeptLock] = useState('Computer Science & Engineering');
  const [successNotice, setSuccessNotice] = useState('');

  // Course Management State
  const [courses, setCourses] = useState([
    { id: 'c1', code: 'CS601', name: 'Distributed Systems & Cloud', dept: 'CSE', semester: 6, credits: 4 },
    { id: 'c2', code: 'CS602', name: 'Artificial Intelligence & ML', dept: 'CSE', semester: 6, credits: 4 },
    { id: 'c3', code: 'CS603', name: 'Advanced Web Architecture', dept: 'CSE', semester: 6, credits: 4 },
    { id: 'c4', code: 'CS604', name: 'Compiler Design', dept: 'CSE', semester: 6, credits: 4 },
    { id: 'c5', code: 'EC401', name: 'Digital Signal Processing', dept: 'ECE', semester: 4, credits: 4 }
  ]);

  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(4);
  const [newSem, setNewSem] = useState(6);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  // Grading Rules
  const [gradingRules, setGradingRules] = useState<GradeRule[]>(DEFAULT_GRADE_RULES);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(DEFAULT_ACADEMIC_YEARS);

  const toggleSemesterLock = (sem: number) => {
    const nextState = !locks[sem];
    setLocks((prev) => ({ ...prev, [sem]: nextState }));
    onToggleResultLock(sem, selectedDeptLock);

    const actionText = nextState ? 'LOCKED & PUBLISHED' : 'UNLOCKED FOR EDITING';
    setSuccessNotice(`Semester ${sem} result publication status changed to: ${actionText}`);
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    setCourses([
      ...courses,
      {
        id: `c-${Date.now()}`,
        code: newCode.toUpperCase(),
        name: newName,
        dept: 'CSE',
        semester: newSem,
        credits: newCredits
      }
    ]);
    setNewCode('');
    setNewName('');
    setIsAddCourseOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <ShieldCheck className="h-4 w-4 text-indigo-400" /> Academic Controller & Examination Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Admin Result Publication & Policy Controls
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Lock examination marks publication, configure courses and grading scales, and manage academic session cycles.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
            <button
              onClick={() => setActiveTab('locks')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'locks' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Lock className="h-3.5 w-3.5 inline mr-1" /> Locks & Publication
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'courses' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 inline mr-1" /> Courses & Subjects
            </button>
            <button
              onClick={() => setActiveTab('grading')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'grading' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Settings className="h-3.5 w-3.5 inline mr-1" /> Grading Scale
            </button>
            <button
              onClick={() => setActiveTab('years')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'years' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 inline mr-1" /> Academic Years
            </button>
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {successNotice}
        </div>
      )}

      {/* TAB 1: LOCKS & PUBLICATION CONTROL */}
      {activeTab === 'locks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-indigo-600" /> Semester Result Publication Lock Controls
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Locking a semester prevents faculty from altering internal/external marks and releases official marksheets to students.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Department:</span>
                <select
                  value={selectedDeptLock}
                  onChange={(e) => setSelectedDeptLock(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Mechanical Engineering">ME</option>
                  <option value="Information Technology">IT</option>
                </select>
              </div>
            </div>

            {/* Semester Lock Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                const isLocked = locks[sem] ?? false;

                return (
                  <div
                    key={sem}
                    className={`p-5 rounded-2xl border transition-all ${
                      isLocked
                        ? 'bg-slate-900 border-slate-800 text-white shadow-md'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider opacity-70">
                        Semester {sem}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isLocked
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {isLocked ? 'PUBLISHED & LOCKED' : 'UNLOCKED / DRAFT'}
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="text-lg font-black">
                        {isLocked ? 'Official Results Active' : 'Faculty Editing Allowed'}
                      </div>
                      <p className="text-[11px] opacity-70 mt-0.5">
                        {isLocked ? 'Student marksheets visible in portal' : 'Faculty uploading evaluation scores'}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleSemesterLock(sem)}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                        isLocked
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Unlock className="h-4 w-4" /> Unlock Semester {sem} Marks
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" /> Publish & Lock Semester {sem}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSE & SUBJECT MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" /> Institutional Course Curriculum Directory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage offered courses, course codes, semester credit allocation, and department assignments.
                </p>
              </div>

              <button
                onClick={() => setIsAddCourseOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow"
              >
                <Plus className="h-4 w-4" /> Add New Course
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
                    <th className="py-3 px-3">Course Code</th>
                    <th className="py-3 px-3">Course Title</th>
                    <th className="py-3 px-3 text-center">Department</th>
                    <th className="py-3 px-3 text-center">Semester</th>
                    <th className="py-3 px-3 text-center">Credits</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {c.code}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-600 dark:text-slate-400">
                        {c.dept}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-600 dark:text-slate-400">
                        Semester {c.semester}
                      </td>
                      <td className="py-3.5 px-3 text-center font-black text-slate-900 dark:text-white">
                        {c.credits} Credits
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GRADING SYSTEM RULES */}
      {activeTab === 'grading' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" /> Relative & Absolute Grading System Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard 10-point scale grade rules and percentage ranges used for SGPA & CGPA calculation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
                    <th className="py-3 px-3">Letter Grade</th>
                    <th className="py-3 px-3 text-center">Marks Percentage Range</th>
                    <th className="py-3 px-3 text-center">Grade Point</th>
                    <th className="py-3 px-3">Performance Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {gradingRules.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-3">
                        <span className="px-3 py-1 rounded-xl font-black text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                        {r.minMark}% – {r.maxMark}%
                      </td>
                      <td className="py-3.5 px-3 text-center font-black text-blue-600 dark:text-blue-400 text-sm">
                        {r.gradePoint} / 10
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-semibold">
                        {r.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC YEARS */}
      {activeTab === 'years' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" /> Academic Sessions & Years
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage active academic cycles and semester ranges across the university.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {academicYears.map((ay) => (
                <div key={ay.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900 dark:text-white">{ay.year}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      ay.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {ay.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Active Semesters: <strong className="text-slate-800 dark:text-slate-200">Semester {ay.semesters.join(' & ')}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Add Curriculum Course</h3>
            
            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS605"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Security & Cryptography"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Semester</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={newSem}
                    onChange={(e) => setNewSem(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs mt-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
