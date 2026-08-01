import React, { useState } from 'react';
import { StudentResult, UserRole, SubjectResult } from '../../../types';
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
  Printer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { callAIPredictResult } from '../../../services/api';

interface ResultPortalProps {
  results?: StudentResult[];
  result?: StudentResult;
  userRole: UserRole;
  onUpdateResults?: (results: StudentResult[]) => void;
}

export const ResultPortal: React.FC<ResultPortalProps> = ({
  results,
  result,
  userRole,
  onUpdateResults
}) => {
  const allResults = results && results.length > 0 ? results : (result ? [result] : []);
  const [selectedResult, setSelectedResult] = useState<StudentResult>(allResults[0] || {} as StudentResult);

  React.useEffect(() => {
    if (allResults.length > 0 && (!selectedResult || !selectedResult.id)) {
      setSelectedResult(allResults[0]);
    }
  }, [results, result]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'rank_list' | 'ai_prediction'>('dashboard');
  
  // Calculator state
  const [calcSubjects, setCalcSubjects] = useState<{ name: string; credits: number; gradePoint: number }[]>([
    { name: 'Subject 1', credits: 4, gradePoint: 10 },
    { name: 'Subject 2', credits: 4, gradePoint: 9 },
    { name: 'Subject 3', credits: 3, gradePoint: 8 },
    { name: 'Subject 4', credits: 3, gradePoint: 9 }
  ]);
  const [calcCgpa, setCalcCgpa] = useState<number | null>(null);

  // AI Predictor state
  const [aiPrediction, setAiPrediction] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Calculate GPA for calculator
  const calculateGPA = () => {
    let totalCreds = 0;
    let totalPoints = 0;
    calcSubjects.forEach((s) => {
      totalCreds += s.credits;
      totalPoints += s.credits * s.gradePoint;
    });
    setCalcCgpa(+(totalPoints / (totalCreds || 1)).toFixed(2));
  };

  const handlePredictResult = async () => {
    if (!selectedResult || !selectedResult.semester) return;
    setLoadingAi(true);
    const data = await callAIPredictResult(selectedResult, selectedResult.semester + 1);
    setAiPrediction(data);
    setLoadingAi(false);
  };

  // Marksheet Download Simulation
  const handleDownloadMarksheet = () => {
    if (!selectedResult) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Marksheet - ${selectedResult.studentName || 'Student'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #1e3a8a; font-size: 24px; }
            .header p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f8fafc; padding: 15px; border-radius: 8px; }
            .info-item { font-size: 14px; }
            .info-item font { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #2563eb; color: white; }
            .summary { text-align: right; font-size: 16px; font-weight: bold; }
            .seal { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SMART CAMPUS UNIVERSITY</h1>
            <p>OFFICIAL SEMESTER GRADE REPORT & MARKSHEET</p>
          </div>
          <div class="info-grid">
            <div class="info-item">Student Name: <b>${selectedResult.studentName || ''}</b></div>
            <div class="info-item">Roll Number: <b>${selectedResult.rollNumber || ''}</b></div>
            <div class="info-item">Department: <b>${selectedResult.department || ''}</b></div>
            <div class="info-item">Semester: <b>${selectedResult.semester || 1} (Batch ${selectedResult.batch || ''})</b></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Credits</th>
                <th>Internal (50)</th>
                <th>External (50)</th>
                <th>Total (100)</th>
                <th>Grade</th>
                <th>Grade Point</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${(selectedResult.subjects || [])
                .map(
                  (s) => `
                <tr>
                  <td>${s.subjectCode}</td>
                  <td>${s.subjectName}</td>
                  <td>${s.credits}</td>
                  <td>${s.internalMarks}</td>
                  <td>${s.externalMarks}</td>
                  <td>${s.totalMarks}</td>
                  <td><b>${s.grade}</b></td>
                  <td>${s.gradePoint}</td>
                  <td>${s.status}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div class="summary">
            SGPA: <span style="color:#2563eb;">${selectedResult.sgpa || 0}</span> | CGPA: <span style="color:#16a34a;">${selectedResult.cgpa || 0}</span>
          </div>
          <div class="seal">
            <div>Date of Issue: ${new Date().toLocaleDateString()}</div>
            <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">Controller of Examinations</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const chartData = (selectedResult?.subjects || []).map((s) => ({
    name: s.subjectCode,
    Internal: s.internalMarks,
    External: s.externalMarks,
    Total: s.totalMarks
  }));

  const gradeColors: Record<string, string> = {
    'O': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    'A+': 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300',
    'A': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
    'B+': 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    'B': 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300'
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <Award className="h-4 w-4" /> Academic Examination Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Result Portal & Performance Analytics
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Semester-wise grade reports, internal marks breakdown, GPA/CGPA calculations, and AI academic forecasting.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadMarksheet}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition shadow-sm"
          >
            <Printer className="h-4 w-4" /> Official Marksheet PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" /> Grade Dashboard
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'calculator'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calculator className="h-4 w-4" /> GPA & CGPA Calculator
        </button>
        <button
          onClick={() => setActiveTab('rank_list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'rank_list'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" /> Department Rank List
        </button>
        <button
          onClick={() => setActiveTab('ai_prediction')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'ai_prediction'
              ? 'bg-purple-600 text-white'
              : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          }`}
        >
          <Sparkles className="h-4 w-4" /> AI Academic Predictor
        </button>
      </div>

      {/* TAB 1: RESULT DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Semester SGPA</span>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {selectedResult.sgpa} <span className="text-xs font-normal text-slate-400">/ 10.0</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Top 5% in CSE Department</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Cumulative CGPA</span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {selectedResult.cgpa} <span className="text-xs font-normal text-slate-400">/ 10.0</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Overall Credits Earned: {selectedResult.totalCredits}</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Class Standing / Rank</span>
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                #{selectedResult.rank} <span className="text-xs font-normal text-slate-400">/ 120 Students</span>
              </div>
              <p className="text-[11px] text-purple-600 font-medium mt-1">Dean's Honor List Distinction</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Result Status</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  PASSED WITH DISTINCTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Published: {selectedResult.publishedDate}</p>
            </div>
          </div>

          {/* Performance Graph & Subject Table Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Column */}
            <div className="lg:col-span-1 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" /> Subject Marks Breakdown
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="Internal" fill="#3b82f6" stackId="a" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="External" fill="#8b5cf6" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-blue-500"></span> Internal (50)
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-purple-500"></span> External (50)
                </div>
              </div>
            </div>

            {/* Subject Table Column */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" /> Subject-wise Grade Breakdown
                </h3>
                <span className="text-xs text-slate-400">Semester {selectedResult.semester}</span>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3">Credits</th>
                    <th className="py-2.5 px-3">Internal</th>
                    <th className="py-2.5 px-3">External</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {(selectedResult?.subjects || []).map((sub) => (
                    <tr key={sub.subjectId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{sub.subjectCode}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{sub.subjectName}</td>
                      <td className="py-3 px-3">{sub.credits}</td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{sub.internalMarks} / 50</td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">{sub.externalMarks} / 50</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{sub.totalMarks}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[11px] ${gradeColors[sub.grade] || 'bg-slate-100'}`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle className="h-3.5 w-3.5" /> PASS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: GPA & CGPA CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" /> Interactive GPA / CGPA Estimator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add your expected subject course credits and target grade points to project your upcoming semester SGPA.
            </p>
          </div>

          <div className="space-y-3">
            {calcSubjects.map((s, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => {
                    const updated = [...calcSubjects];
                    updated[idx].name = e.target.value;
                    setCalcSubjects(updated);
                  }}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                  placeholder="Subject name"
                />
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 font-semibold">Credits:</span>
                  <select
                    value={s.credits}
                    onChange={(e) => {
                      const updated = [...calcSubjects];
                      updated[idx].credits = Number(e.target.value);
                      setCalcSubjects(updated);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 font-semibold">Grade Point:</span>
                  <select
                    value={s.gradePoint}
                    onChange={(e) => {
                      const updated = [...calcSubjects];
                      updated[idx].gradePoint = Number(e.target.value);
                      setCalcSubjects(updated);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value={10}>O (10)</option>
                    <option value={9}>A+ (9)</option>
                    <option value={8}>A (8)</option>
                    <option value={7}>B+ (7)</option>
                    <option value={6}>B (6)</option>
                    <option value={0}>F (0)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() =>
                setCalcSubjects([...calcSubjects, { name: `Subject ${calcSubjects.length + 1}`, credits: 3, gradePoint: 9 }])
              }
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Subject Row
            </button>
            <button
              onClick={calculateGPA}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              Calculate Projected SGPA
            </button>
          </div>

          {calcCgpa !== null && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 text-center">
              <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Projected Semester GPA</span>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                {calcCgpa} / 10.0
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RANK LIST */}
      {activeTab === 'rank_list' && (
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" /> Department Merit & Rank Standings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Computer Science & Engineering — Semester 6 Leaderboard
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">SGPA</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Distinction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...allResults]
                  .sort((a, b) => (b.cgpa || 0) - (a.cgpa || 0))
                  .map((res, index) => (
                    <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-extrabold text-purple-600 dark:text-purple-400">
                        #{index + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{res.rollNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{res.studentName}</td>
                      <td className="py-3 px-4 text-slate-500">{res.batch}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{res.sgpa}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-600">{res.cgpa}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          GOLD MEDALIST ELIGIBLE
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AI PREDICTION */}
      {activeTab === 'ai_prediction' && (
        <div className="p-6 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600 animate-spin" /> AI Grade Forecast & Study Advisor
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Generative AI analysis of current semester trends, historical course weightages, and personalized target recommendations.
              </p>
            </div>
            <button
              onClick={handlePredictResult}
              disabled={loadingAi}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 hover:bg-purple-700 transition flex items-center gap-2"
            >
              {loadingAi ? 'Analyzing Data...' : 'Generate Semester 7 Forecast'}
            </button>
          </div>

          {aiPrediction && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Predicted Semester 7 SGPA</span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {aiPrediction.predictedSGPA} / 10.0
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900/40 shadow-sm">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Predicted Graduation CGPA</span>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {aiPrediction.predictedCGPA} / 10.0
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500">Recommended Key Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {aiPrediction.keyFocusSubjects?.map((sub: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500">AI Personal Improvement Plan</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {aiPrediction.recommendations?.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
