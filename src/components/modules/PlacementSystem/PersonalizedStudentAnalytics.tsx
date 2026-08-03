import React, { useState } from 'react';
import { User } from '../../../types';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Sparkles,
  Target,
  BrainCircuit,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Zap,
  BarChart3,
  Layers,
  GraduationCap
} from 'lucide-react';

interface Props {
  user: User;
}

// Preset target roles and their required skill benchmarks
const TARGET_ROLES = [
  'Software Development Engineer (SDE)',
  'Full Stack AI Developer',
  'Cloud & DevOps Engineer',
  'AI / ML Solutions Engineer',
  'Data Engineer'
];

export const PersonalizedStudentAnalytics: React.FC<Props> = ({ user }) => {
  const [selectedRole, setSelectedRole] = useState<string>('Software Development Engineer (SDE)');
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic Skill Radar Competency Data based on selected role
  const getRadarData = (role: string) => {
    switch (role) {
      case 'Full Stack AI Developer':
        return [
          { subject: 'React & TS', student: 92, benchmark: 90, fullMark: 100 },
          { subject: 'Node & APIs', student: 88, benchmark: 85, fullMark: 100 },
          { subject: 'Python & LLMs', student: 82, benchmark: 88, fullMark: 100 },
          { subject: 'Vector DBs', student: 65, benchmark: 80, fullMark: 100 },
          { subject: 'Cloud / Docker', student: 72, benchmark: 85, fullMark: 100 },
          { subject: 'System Design', student: 75, benchmark: 85, fullMark: 100 },
          { subject: 'DSA & Algorithms', student: 86, benchmark: 85, fullMark: 100 }
        ];
      case 'Cloud & DevOps Engineer':
        return [
          { subject: 'Docker / K8s', student: 60, benchmark: 90, fullMark: 100 },
          { subject: 'AWS / Cloud', student: 78, benchmark: 88, fullMark: 100 },
          { subject: 'Linux / Bash', student: 85, benchmark: 85, fullMark: 100 },
          { subject: 'CI/CD Pipelines', student: 70, benchmark: 85, fullMark: 100 },
          { subject: 'Infrastructure (Terraform)', student: 52, benchmark: 80, fullMark: 100 },
          { subject: 'System Monitoring', student: 68, benchmark: 82, fullMark: 100 },
          { subject: 'Networking Security', student: 74, benchmark: 80, fullMark: 100 }
        ];
      case 'AI / ML Solutions Engineer':
        return [
          { subject: 'Python Data Stack', student: 88, benchmark: 92, fullMark: 100 },
          { subject: 'Deep Learning (PyTorch)', student: 70, benchmark: 88, fullMark: 100 },
          { subject: 'NLP & LLM Tuning', student: 78, benchmark: 85, fullMark: 100 },
          { subject: 'MLOps & Deployment', student: 58, benchmark: 82, fullMark: 100 },
          { subject: 'Math & Linear Algebra', student: 82, benchmark: 85, fullMark: 100 },
          { subject: 'System Design', student: 72, benchmark: 80, fullMark: 100 },
          { subject: 'DSA & Algorithms', student: 84, benchmark: 85, fullMark: 100 }
        ];
      case 'Data Engineer':
        return [
          { subject: 'SQL & Query Optimization', student: 90, benchmark: 92, fullMark: 100 },
          { subject: 'Spark & PySpark', student: 62, benchmark: 88, fullMark: 100 },
          { subject: 'Data Pipelines (Airflow)', student: 55, benchmark: 85, fullMark: 100 },
          { subject: 'Data Warehousing', student: 72, benchmark: 85, fullMark: 100 },
          { subject: 'Python / Scala', student: 85, benchmark: 85, fullMark: 100 },
          { subject: 'Cloud Storage (S3/GCS)', student: 78, benchmark: 85, fullMark: 100 },
          { subject: 'DSA & Analytics', student: 82, benchmark: 80, fullMark: 100 }
        ];
      default: // SDE
        return [
          { subject: 'DSA & Problem Solving', student: 88, benchmark: 92, fullMark: 100 },
          { subject: 'System Design', student: 72, benchmark: 85, fullMark: 100 },
          { subject: 'Web Architecture', student: 90, benchmark: 88, fullMark: 100 },
          { subject: 'Database Systems', student: 85, benchmark: 85, fullMark: 100 },
          { subject: 'Object Oriented Design', student: 84, benchmark: 85, fullMark: 100 },
          { subject: 'OS & Computer Networks', student: 82, benchmark: 82, fullMark: 100 },
          { subject: 'Soft Skills & Interviewing', student: 91, benchmark: 88, fullMark: 100 }
        ];
    }
  };

  const radarData = getRadarData(selectedRole);

  // Calculate overall readiness score dynamically
  const totalStudentScore = radarData.reduce((acc, curr) => acc + curr.student, 0);
  const totalBenchmarkScore = radarData.reduce((acc, curr) => acc + curr.benchmark, 0);
  const readinessScore = Math.min(98, Math.round((totalStudentScore / totalBenchmarkScore) * 88));

  // Bar chart data for Skill Gaps (Sorted by gap descending)
  const skillGapBarData = radarData
    .map((item) => ({
      skill: item.subject,
      Current: item.student,
      Benchmark: item.benchmark,
      Gap: Math.max(0, item.benchmark - item.student)
    }))
    .sort((a, b) => b.Gap - a.Gap);

  // Recommended Career Paths and match percentage
  const careerPathsData = [
    { role: 'Full Stack AI Engineer', match: 94, pkg: '₹10 - ₹18 LPA', growth: '+35% YoY', readiness: 'Ready' },
    { role: 'Software Development Engineer (SDE-1)', match: 88, pkg: '₹9 - ₹16 LPA', growth: '+28% YoY', readiness: 'High Match' },
    { role: 'Cloud & DevOps Engineer', match: 78, pkg: '₹8 - ₹15 LPA', growth: '+32% YoY', readiness: 'Moderate Gap' },
    { role: 'Data & MLOps Engineer', match: 74, pkg: '₹9 - ₹17 LPA', growth: '+40% YoY', readiness: 'Skill Up Required' },
    { role: 'Frontend Systems Architect', match: 92, pkg: '₹8 - ₹14 LPA', growth: '+22% YoY', readiness: 'Ready' }
  ];

  // Salary trajectory line/area chart data over 5 years
  const salaryTrajectoryData = [
    { year: 'Entry (Yr 1)', SDE: 9.5, FullStackAI: 12.0, CloudDevOps: 8.5, DataEng: 9.0 },
    { year: 'Yr 2', SDE: 13.0, FullStackAI: 16.5, CloudDevOps: 12.0, DataEng: 12.5 },
    { year: 'Yr 3', SDE: 18.0, FullStackAI: 23.0, CloudDevOps: 17.0, DataEng: 18.0 },
    { year: 'Yr 4', SDE: 24.0, FullStackAI: 31.0, CloudDevOps: 23.5, DataEng: 25.0 },
    { year: 'Yr 5 (Senior)', SDE: 32.0, FullStackAI: 42.0, CloudDevOps: 32.0, DataEng: 34.0 }
  ];

  // Readiness breakdown metrics for pie chart
  const readinessPieData = [
    { name: 'Core Academic & CGPA', value: 25, color: '#6366f1' },
    { name: 'DSA & Coding Proficiency', value: 30, color: '#10b981' },
    { name: 'System Design & Projects', value: 25, color: '#f59e0b' },
    { name: 'Soft Skills & Mock Performance', value: 20, color: '#8b5cf6' }
  ];

  // Actionable high priority recommendations
  const actionItems = skillGapBarData
    .filter((s) => s.Gap > 5)
    .slice(0, 3)
    .map((s) => ({
      skill: s.skill,
      gap: s.Gap,
      action: s.skill.includes('System Design')
        ? 'Complete High Level Design (HLD) patterns on Educative & practice designing rate limiters.'
        : s.skill.includes('Docker')
        ? 'Containerize your campus projects using Docker compose and deploy on AWS Free Tier.'
        : s.skill.includes('Vector') || s.skill.includes('LLM')
        ? 'Implement a RAG pipeline using Pinecone & Google Gemini 2.5 Flash API.'
        : s.skill.includes('Spark') || s.skill.includes('Data')
        ? 'Solve top 20 SQL window function queries & build PySpark ETL pipeline on GitHub.'
        : 'Solve 15 LeetCode Medium problem patterns focusing on Graphs & Dynamic Programming.'
    }));

  const handleRecalculate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Personalized Placement Intelligence
              </span>
              <span className="text-xs text-indigo-200">Recharts Data Visualization</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Student Placement Readiness & Skill Gap Analytics</h2>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-2xl">
              AI-driven profile benchmarking, multi-axis radar skill analysis, target role matching, and projected 5-year career salary trajectories.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-64">
              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                Select Target Career Goal
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-indigo-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              >
                {TARGET_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRecalculate}
              disabled={isSimulating}
              className="mt-4 md:mt-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Analyzing...' : 'Refresh Readiness'}
            </button>
          </div>
        </div>
      </div>

      {/* Top Readiness Score Key Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Overall Score */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Placement Readiness Index</span>
            <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{readinessScore}%</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Tier-1 Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Higher than 84% of participating batch students
          </p>
          <div className="mt-3 w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-teal-400 transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Top Skill Strength */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Primary Skill Advantage</span>
            <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {radarData.reduce((prev, current) => (prev.student > current.student ? prev : current)).subject}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Exceeds Industry Benchmark
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Verified via lab performance & projects</p>
        </div>

        {/* Highest Gap Area */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Target Skill Improvement Gap</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{skillGapBarData[0]?.skill}</div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">
            -{skillGapBarData[0]?.Gap}% Gap to Target Benchmark
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Focus study recommended in next 14 days</p>
        </div>

        {/* Matching Role Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">High-Match Campus Roles</span>
            <BrainCircuit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">4 Opportunities</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Zoho, Kovai.co, TCS Digital & Cognizant
          </p>
          <p className="text-[10px] font-bold text-indigo-500 mt-1">Matching salary average: ₹9.8 LPA</p>
        </div>
      </div>

      {/* Main Charts Grid: Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart: Skill Profile Comparison */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                Multi-Axis Skill Profile vs Industry Benchmark
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Comparing {user.name}&apos;s current proficiency against {selectedRole} standards
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
              Interactive Radar
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Student Current" dataKey="student" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                <Radar name="Required Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Weight Distribution Pie Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                Readiness Evaluation Weights
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Evaluation pillars calculated in total readiness score
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={readinessPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {readinessPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            {readinessPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.name}</span>
                <span className="font-bold text-slate-900 dark:text-white ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis Bar Chart & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Gap Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Granular Skill Gap Analysis (Current vs Benchmark)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Identify exact gaps in technical competencies for {selectedRole}
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillGapBarData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} angle={-20} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                <Bar dataKey="Current" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Benchmark" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Learning Roadmap Cards */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Targeted AI Skill Uplift Recommendations
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Actionable micro-steps to close your largest competency gaps
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {actionItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 hover:border-indigo-500 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    {item.skill}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                    -{item.gap}% Gap
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.action}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">Estimated Effort: 8-10 Hours</span>
                  <button className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    Start Learning <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Career Paths & Projected Salary Trajectory Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Career Path Matches */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                Recommended Career Path Matches
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Roles tailored to {user.name}&apos;s profile & CGPA
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {careerPathsData.map((cp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{cp.role}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{cp.match}% Match</span>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${cp.match}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Package: <strong className="text-emerald-600 dark:text-emerald-400">{cp.pkg}</strong></span>
                  <span>Demand Growth: <strong className="text-purple-600 dark:text-purple-400">{cp.growth}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Year Projected Salary Trajectory Area Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                5-Year Projected Salary Growth Trajectory (LPA)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Compare financial progression across top recommended career tracks
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-800">
              Area Growth Chart
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salaryTrajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSDE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" LPA" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                <Area type="monotone" dataKey="FullStackAI" stroke="#6366f1" fillOpacity={1} fill="url(#colorAI)" name="Full Stack AI Engineer" />
                <Area type="monotone" dataKey="SDE" stroke="#10b981" fillOpacity={1} fill="url(#colorSDE)" name="Standard SDE Track" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
