import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Award, Sparkles, RefreshCw } from 'lucide-react';

interface CourseEntry {
  id: string;
  code: string;
  title: string;
  credits: number;
  gradePoint: number;
}

export const GpaCalculatorView: React.FC = () => {
  const [courses, setCourses] = useState<CourseEntry[]>([
    { id: '1', code: 'CS601', title: 'Distributed Systems & Cloud', credits: 4, gradePoint: 10 },
    { id: '2', code: 'CS602', title: 'Artificial Intelligence & ML', credits: 4, gradePoint: 9 },
    { id: '3', code: 'CS603', title: 'Advanced Web Architecture', credits: 4, gradePoint: 9 },
    { id: '4', code: 'CS604', title: 'Compiler Design', credits: 4, gradePoint: 8 },
    { id: '5', code: 'CS605', title: 'Cyber Security & Crypto', credits: 4, gradePoint: 9 },
    { id: '6', code: 'CS606', title: 'Cloud Computing Lab', credits: 4, gradePoint: 10 }
  ]);

  const [priorCgpa, setPriorCgpa] = useState<number>(8.65);
  const [priorCredits, setPriorCredits] = useState<number>(100);

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      {
        id: `course-${Date.now()}`,
        code: `SUB${courses.length + 1}`,
        title: `Elective / Practical Subject ${courses.length + 1}`,
        credits: 3,
        gradePoint: 8
      }
    ]);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleUpdate = (id: string, field: 'credits' | 'gradePoint', value: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // SGPA Computation
  const currentTotalCredits = courses.reduce((acc, c) => acc + (c.credits || 0), 0);
  const currentTotalPoints = courses.reduce((acc, c) => acc + (c.credits || 0) * (c.gradePoint || 0), 0);
  const calculatedSgpa = currentTotalCredits > 0 ? +(currentTotalPoints / currentTotalCredits).toFixed(2) : 0;

  // Cumulative CGPA Projection Computation
  const totalAccumulatedCredits = priorCredits + currentTotalCredits;
  const totalAccumulatedPoints = priorCgpa * priorCredits + currentTotalPoints;
  const projectedCgpa = totalAccumulatedCredits > 0 ? +(totalAccumulatedPoints / totalAccumulatedCredits).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
              <Calculator className="h-4 w-4" /> Academic SGPA & Cumulative CGPA Estimator
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Interactive GPA & Target CGPA Calculator
            </h1>
            <p className="text-sm text-emerald-100 mt-1 max-w-xl">
              Simulate subject target grades, credit weightages, and project future cumulative grade point averages.
            </p>
          </div>

          <button
            onClick={handleAddCourse}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow hover:bg-emerald-50 transition"
          >
            <Plus className="h-4 w-4" /> Add Subject Entry
          </button>
        </div>
      </div>

      {/* Main Grid: Calculator Inputs & Instant Computed Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Subject Entry List */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-600" /> Subject Credits & Target Grade Points
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {courses.length} Subjects Selected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
                  <th className="py-3 px-3">Subject Code & Name</th>
                  <th className="py-3 px-3 text-center">Course Credits</th>
                  <th className="py-3 px-3 text-center">Grade Point (0-10)</th>
                  <th className="py-3 px-3 text-center">Point Weight</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-3">
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{c.code}</div>
                      <div className="text-[11px] text-slate-800 dark:text-slate-200 font-bold">{c.title}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <select
                        value={c.credits}
                        onChange={(e) => handleUpdate(c.id, 'credits', Number(e.target.value))}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6].map((cr) => (
                          <option key={cr} value={cr}>
                            {cr} Credits
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <select
                        value={c.gradePoint}
                        onChange={(e) => handleUpdate(c.id, 'gradePoint', Number(e.target.value))}
                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value={10}>O (10 Points)</option>
                        <option value={9}>A+ (9 Points)</option>
                        <option value={8}>A (8 Points)</option>
                        <option value={7}>B+ (7 Points)</option>
                        <option value={6}>B (6 Points)</option>
                        <option value={5}>C (5 Points)</option>
                        <option value={0}>F (0 Points)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-center font-black text-slate-900 dark:text-white">
                      {c.credits * c.gradePoint} Points
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition"
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

        {/* Right Column: Computed Results & CGPA Projection */}
        <div className="space-y-6">
          
          {/* Calculated SGPA Box */}
          <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-emerald-800 dark:text-emerald-300">Target Semester SGPA</span>
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {calculatedSgpa} <span className="text-xs font-normal text-slate-400">/ 10.0</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Based on {currentTotalCredits} total credits and {currentTotalPoints} grade points earned this semester.
            </p>
          </div>

          {/* Prior CGPA Inputs & Projected CGPA Box */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Cumulative CGPA Projection
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Previous Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={10}
                  value={priorCgpa}
                  onChange={(e) => setPriorCgpa(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Prior Total Credits Completed</label>
                <input
                  type="number"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold mt-1 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">Projected Overall CGPA</span>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {projectedCgpa} / 10.0
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total Credits: {totalAccumulatedCredits} Credits
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
