import React from 'react';
import { StudentResult, Department } from '../../../types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Award,
  PieChart as PieIcon,
  BarChart3,
  Users,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface AcademicAnalyticsViewProps {
  results: StudentResult[];
  departments?: Department[];
}

// Sample Semester Progress Trend Data
const SEMESTER_TREND_DATA = [
  { semester: 'Sem 1', SGPA: 8.20, CGPA: 8.20 },
  { semester: 'Sem 2', SGPA: 8.45, CGPA: 8.32 },
  { semester: 'Sem 3', SGPA: 8.60, CGPA: 8.41 },
  { semester: 'Sem 4', SGPA: 8.50, CGPA: 8.43 },
  { semester: 'Sem 5', SGPA: 8.70, CGPA: 8.49 },
  { semester: 'Sem 6', SGPA: 8.85, CGPA: 8.72 }
];

// Grade Distribution Donut Data
const GRADE_DISTRIBUTION_DATA = [
  { name: 'O (Outstanding)', value: 38, color: '#10b981' },
  { name: 'A+ (Excellent)', value: 42, color: '#3b82f6' },
  { name: 'A (Very Good)', value: 25, color: '#6366f1' },
  { name: 'B+ (Good)', value: 12, color: '#f59e0b' },
  { name: 'B (Average)', value: 5, color: '#ec4899' },
  { name: 'F (Re-appear)', value: 3, color: '#ef4444' }
];

// Department Performance Comparison
const DEPARTMENT_PERFORMANCE_DATA = [
  { name: 'CSE', Pass: 94.2, Fail: 5.8, AvgGPA: 8.72 },
  { name: 'ECE', Pass: 89.5, Fail: 10.5, AvgGPA: 8.35 },
  { name: 'IT', Pass: 91.8, Fail: 8.2, AvgGPA: 8.50 },
  { name: 'ME', Pass: 84.0, Fail: 16.0, AvgGPA: 7.95 }
];

export const AcademicAnalyticsView: React.FC<AcademicAnalyticsViewProps> = ({
  results,
  departments
}) => {
  const totalStudents = results.length || 2;
  const avgSgpa = +(results.reduce((acc, r) => acc + (r.sgpa || 0), 0) / (totalStudents || 1)).toFixed(2);
  const avgCgpa = +(results.reduce((acc, r) => acc + (r.cgpa || 0), 0) / (totalStudents || 1)).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Analytics Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-200">
              <BarChart3 className="h-4 w-4" /> Comprehensive Academic Intelligence & Performance Metrics
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Institution & Class Analytics Suite
            </h1>
            <p className="text-sm text-purple-100 mt-1 max-w-xl">
              Visualizing SGPA/CGPA semester growth, grade distribution breakdown, and department pass rate comparisons.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div>
              <div className="text-[10px] text-purple-200 uppercase font-extrabold">Overall Mean CGPA</div>
              <div className="text-2xl font-black text-white">{avgCgpa} / 10.0</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-[10px] text-purple-200 uppercase font-extrabold">Pass Rate</div>
              <div className="text-2xl font-black text-emerald-300">92.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Main Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: SGPA & CGPA Progress over Semesters */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" /> SGPA & CGPA Semester Growth Curve
              </h3>
              <p className="text-xs text-slate-500">
                Track average grade point trajectory across Semesters 1 to 6
              </p>
            </div>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Award className="h-4 w-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SEMESTER_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[6.0, 10.0]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="SGPA" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="CGPA" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-bold pt-1">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span> Semester SGPA
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Cumulative CGPA
            </div>
          </div>
        </div>

        {/* Chart 2: Grade Distribution Donut Chart */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="h-5 w-5 text-purple-600" /> Grade Distribution Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Percentage of students receiving O, A+, A, B+, B, and F grades
              </p>
            </div>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <PieIcon className="h-4 w-4" />
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GRADE_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {GRADE_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold pt-1">
            {GRADE_DISTRIBUTION_DATA.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-700 dark:text-slate-300 text-[11px]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Department Performance Bar Chart & Top Scorers Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Comparison Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" /> Department Pass vs Fail Rate Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating examination success rates across CSE, ECE, IT, and Mechanical Engineering
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="Pass" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Fail" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-emerald-500"></span> Pass Percentage (%)
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-red-500"></span> Fail Percentage (%)
            </div>
          </div>
        </div>

        {/* Top Performers Leaderboard */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" /> Academic Rank Leaders
          </h3>

          <div className="space-y-3">
            {results.map((r, idx) => (
              <div
                key={r.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-xl font-black flex items-center justify-center text-xs ${
                    idx === 0 ? 'bg-amber-400 text-slate-950 shadow' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                  }`}>
                    #{r.rank || idx + 1}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">{r.studentName}</div>
                    <div className="text-[10px] text-slate-400">{r.rollNumber} • {r.department}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">{r.sgpa} SGPA</div>
                  <div className="text-[10px] text-slate-400">{r.cgpa} CGPA</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
