import React, { useState } from 'react';
import { StudentResult, SubjectResult, UserRole } from '../../../types';
import {
  FileSpreadsheet,
  Save,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  Filter,
  TrendingUp,
  Award,
  Sparkles,
  Download
} from 'lucide-react';

interface FacultyMarksEntryProps {
  userRole: UserRole;
  results: StudentResult[];
  onUpdateResults?: (results: StudentResult[]) => void;
  isResultLocked?: boolean;
}

export const FacultyMarksEntry: React.FC<FacultyMarksEntryProps> = ({
  userRole,
  results,
  onUpdateResults,
  isResultLocked = false
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState('CS601');
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | 'weak' | 'pass' | 'fail'>('all');

  const [localResults, setLocalResults] = useState<StudentResult[]>(results || []);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // New Student Entry State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newRollNumber, setNewRollNumber] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science & Engineering');
  const [newInternal, setNewInternal] = useState(42);
  const [newExternal, setNewExternal] = useState(40);

  React.useEffect(() => {
    if (results && results.length > 0) {
      setLocalResults(results);
    }
  }, [results]);

  // Helper to compute grade from total marks
  const computeGradeAndPoint = (total: number) => {
    if (total >= 90) return { grade: 'O' as const, point: 10, status: 'PASS' as const };
    if (total >= 80) return { grade: 'A+' as const, point: 9, status: 'PASS' as const };
    if (total >= 70) return { grade: 'A' as const, point: 8, status: 'PASS' as const };
    if (total >= 60) return { grade: 'B+' as const, point: 7, status: 'PASS' as const };
    if (total >= 50) return { grade: 'B' as const, point: 6, status: 'PASS' as const };
    return { grade: 'F' as const, point: 0, status: 'FAIL' as const };
  };

  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newRollNumber) return;

    const total = newInternal + newExternal;
    const { grade, point, status } = computeGradeAndPoint(total);

    const newSubject: SubjectResult = {
      subjectId: `sub_${Date.now()}`,
      subjectCode: selectedCourse,
      subjectName: selectedCourse,
      credits: 4,
      internalMarks: newInternal,
      externalMarks: newExternal,
      totalMarks: total,
      grade,
      gradePoint: point,
      status
    };

    const newResultDoc: StudentResult = {
      id: `res_${Date.now()}`,
      studentId: `u_std_${Date.now()}`,
      studentName: newStudentName,
      rollNumber: newRollNumber,
      department: newStudentDept,
      semester: selectedSemester,
      batch: '2023-2027',
      sgpa: point,
      cgpa: point,
      totalCredits: 24,
      rank: localResults.length + 1,
      publishedDate: new Date().toISOString().split('T')[0],
      subjects: [newSubject]
    };

    const updated = [newResultDoc, ...localResults];
    setLocalResults(updated);
    if (onUpdateResults) {
      onUpdateResults(updated);
    }

    setNewStudentName('');
    setNewRollNumber('');
    setIsAddStudentOpen(false);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 4000);
  };

  const handleMarksChange = (studentId: string, subjectCode: string, field: 'internal' | 'external', val: number) => {
    if (isResultLocked) return;

    setLocalResults((prev) =>
      prev.map((res) => {
        if (res.studentId === studentId || res.id === studentId) {
          const updatedSubjects = res.subjects.map((sub) => {
            if (sub.subjectCode === subjectCode) {
              const internal = field === 'internal' ? Math.max(0, Math.min(50, val)) : sub.internalMarks;
              const external = field === 'external' ? Math.max(0, Math.min(50, val)) : sub.externalMarks;
              const total = internal + external;
              const { grade, point, status } = computeGradeAndPoint(total);

              return {
                ...sub,
                internalMarks: internal,
                externalMarks: external,
                totalMarks: total,
                grade,
                gradePoint: point,
                status
              };
            }
            return sub;
          });

          // Recompute SGPA
          let totalCreds = 0;
          let totalPoints = 0;
          updatedSubjects.forEach((s) => {
            totalCreds += s.credits;
            totalPoints += s.credits * s.gradePoint;
          });
          const newSgpa = +(totalPoints / (totalCreds || 1)).toFixed(2);

          return {
            ...res,
            subjects: updatedSubjects,
            sgpa: newSgpa
          };
        }
        return res;
      })
    );
  };

  const handleSaveMarks = () => {
    if (onUpdateResults) {
      onUpdateResults(localResults);
    }
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 4000);
  };

  // Filtered students
  const filteredStudents = localResults.filter((res) => {
    const matchesSearch =
      res.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || res.department === selectedDept || 
      (selectedDept.includes('AI') && res.department.includes('AI')) ||
      (selectedDept.includes('Bio') && res.department.includes('Bio'));
    
    // Check if student has a failing grade in any subject
    const hasFail = res.subjects.some((s) => s.status === 'FAIL' || s.totalMarks < 50);
    const isWeak = hasFail || res.sgpa < 6.5;

    if (!matchesDept) return false;

    if (viewFilter === 'weak') return matchesSearch && isWeak;
    if (viewFilter === 'pass') return matchesSearch && !hasFail;
    if (viewFilter === 'fail') return matchesSearch && hasFail;

    return matchesSearch;
  });

  // Analytics Stats
  const totalStudents = localResults.length;
  const passedStudents = localResults.filter((r) => !r.subjects.some((s) => s.status === 'FAIL')).length;
  const failedStudents = totalStudents - passedStudents;
  const classPassPct = totalStudents > 0 ? +((passedStudents / totalStudents) * 100).toFixed(1) : 0;
  const classAvgSgpa = totalStudents > 0 ? +(localResults.reduce((acc, r) => acc + (r.sgpa || 0), 0) / totalStudents).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      
      {/* Lock Banner Warning */}
      {isResultLocked && (
        <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-3 shadow-sm">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <span className="font-extrabold text-amber-800 dark:text-amber-300">RESULT PUBLICATION LOCKED: </span>
            The Controller of Examinations has published and locked examination results for Semester {selectedSemester}. Marks entry and modifications are currently disabled.
          </div>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Student examination marks successfully updated and saved!
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white shadow-lg shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
            <FileSpreadsheet className="h-4 w-4" /> Faculty Marks Upload & Evaluation Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Course Internal & External Marks Entry
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Input subject internal (50) and external (50) exam scores, evaluate class pass percentage, and identify weak-performing students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveMarks}
            disabled={isResultLocked}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow transition ${
              isResultLocked
                ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
            }`}
          >
            <Save className="h-4 w-4" /> Save Examination Marks
          </button>
        </div>
      </div>

      {/* Class Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Assigned Course Enrollees</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">{totalStudents} Students</div>
          <p className="text-[11px] text-slate-400 mt-1">Section {selectedSection} — Semester {selectedSemester}</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Class Average SGPA</span>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{classAvgSgpa} / 10.0</div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">Course Mean Score</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Class Pass Percentage</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{classPassPct}%</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">{passedStudents} Students Passed</p>
        </div>

        <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 shadow-sm">
          <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase">Students Needing Support</span>
          <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">{failedStudents}</div>
          <p className="text-[11px] text-red-700 dark:text-red-300 font-semibold mt-1">Failing or SGPA &lt; 6.5</p>
        </div>

      </div>

      {/* Filter and Course Selection */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or register number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Artificial Intelligence & Data Science">AI & DS</option>
            <option value="Biomedical Engineering">Bio Medical</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Electronics & Communication">ECE</option>
            <option value="Electrical & Electronics">EEE</option>
            <option value="Mechanical Engineering">MECH</option>
            <option value="Civil Engineering">CIVIL</option>
            <option value="Information Technology">IT</option>
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <optgroup label="AI & DS">
              <option value="AD601">AD601 - Vision Transformers & Deep Learning</option>
              <option value="AD602">AD602 - LLM Fine-Tuning & MLOps</option>
            </optgroup>
            <optgroup label="Bio Medical">
              <option value="BM601">BM601 - Medical Image Processing & DICOM</option>
              <option value="BM602">BM602 - Physiological Signal Processing</option>
            </optgroup>
            <optgroup label="CSE">
              <option value="CS601">CS601 - Distributed Systems & Cloud</option>
              <option value="CS602">CS602 - Artificial Intelligence & ML</option>
              <option value="CS603">CS603 - Advanced Web Architecture</option>
            </optgroup>
            <optgroup label="ECE">
              <option value="EC601">EC601 - VLSI System Design</option>
              <option value="EC602">EC602 - Digital Signal Processing</option>
            </optgroup>
            <optgroup label="EEE">
              <option value="EE601">EE601 - Power Systems & Smart Grid</option>
              <option value="EE602">EE602 - Electric Vehicle Drives</option>
            </optgroup>
            <optgroup label="MECH">
              <option value="ME601">ME601 - Finite Element Analysis</option>
              <option value="ME602">ME602 - CAD & Manufacturing</option>
            </optgroup>
            <optgroup label="CIVIL">
              <option value="CE601">CE601 - Structural Dynamics & BIM</option>
              <option value="CE602">CE602 - Environmental Engineering</option>
            </optgroup>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value={5}>Semester 5</option>
            <option value={6}>Semester 6</option>
            <option value={7}>Semester 7</option>
          </select>

          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs transition shadow"
          >
            + Add Student Entry
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                viewFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Students
            </button>
            <button
              onClick={() => setViewFilter('weak')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                viewFilter === 'weak' ? 'bg-red-600 text-white' : 'text-red-600 dark:text-red-400'
              }`}
            >
              Weak Performers ({localResults.filter((r) => r.sgpa < 6.5 || r.subjects.some((s) => s.status === 'FAIL')).length})
            </button>
          </div>
        </div>

      </div>

      {/* Main Table: Interactive Marks Entry Grid */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" /> Evaluation Marks Entry Sheet
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            Course: <strong className="text-blue-600 dark:text-blue-400">{selectedCourse}</strong>
          </span>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
              <th className="py-3 px-3">Roll Number</th>
              <th className="py-3 px-3">Student Name</th>
              <th className="py-3 px-3 text-center">Internal (50)</th>
              <th className="py-3 px-3 text-center">External (50)</th>
              <th className="py-3 px-3 text-center">Total (100)</th>
              <th className="py-3 px-3 text-center">Grade</th>
              <th className="py-3 px-3 text-center">Grade Point</th>
              <th className="py-3 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredStudents.map((student) => {
              const targetSub = student.subjects.find((s) => s.subjectCode === selectedCourse) || student.subjects[0];

              return (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {student.rollNumber}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                    {student.studentName}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      disabled={isResultLocked}
                      value={targetSub?.internalMarks ?? 0}
                      onChange={(e) =>
                        handleMarksChange(student.id, targetSub?.subjectCode || selectedCourse, 'internal', Number(e.target.value))
                      }
                      className="w-16 text-center py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      disabled={isResultLocked}
                      value={targetSub?.externalMarks ?? 0}
                      onChange={(e) =>
                        handleMarksChange(student.id, targetSub?.subjectCode || selectedCourse, 'external', Number(e.target.value))
                      }
                      className="w-16 text-center py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center font-black text-slate-900 dark:text-white text-sm">
                    {targetSub?.totalMarks ?? 0}
                  </td>
                  <td className="py-3.5 px-3 text-center font-black">
                    <span className="px-2.5 py-0.5 rounded-md font-extrabold text-xs bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {targetSub?.grade ?? 'F'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                    {targetSub?.gradePoint ?? 0}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {targetSub?.status === 'PASS' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        PASS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                        FAIL / RE-APPEAR
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Add Student Marks Entry */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" /> Add New Student Result Record
              </h3>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Roll / Register Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI2023010 or BM2023005"
                  value={newRollNumber}
                  onChange={(e) => setNewRollNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department Branch
                </label>
                <select
                  value={newStudentDept}
                  onChange={(e) => setNewStudentDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science (AI&DS)</option>
                  <option value="Biomedical Engineering">Biomedical Engineering (Bio Medical)</option>
                  <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                  <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
                  <option value="Electrical & Electronics">Electrical & Electronics (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (MECH)</option>
                  <option value="Civil Engineering">Civil Engineering (CIVIL)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Internal Marks (Max 50)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={newInternal}
                    onChange={(e) => setNewInternal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    External Marks (Max 50)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={newExternal}
                    onChange={(e) => setNewExternal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-[11px] font-bold text-blue-800 dark:text-blue-300">
                Course: {selectedCourse} • Semester: {selectedSemester} • Total Score: {newInternal + newExternal} / 100
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow"
                >
                  Create & Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
