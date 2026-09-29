import React, { useState } from 'react';
import { User, PlacementOpportunity, PlacementApplication } from '../../../types';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import { PersonalizedStudentAnalytics } from './PersonalizedStudentAnalytics';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  Building2,
  FileSpreadsheet,
  FileText,
  PieChart as PieChartIcon,
  DollarSign,
  UserCheck,
  Globe
} from 'lucide-react';

interface Props {
  user: User;
  opportunities: PlacementOpportunity[];
  applications: PlacementApplication[];
}

export const PlacementAnalytics: React.FC<Props> = ({ user, opportunities, applications }) => {
  const [viewMode, setViewMode] = useState<'personal' | 'campus'>('personal');

  // Placement stats calculation
  const totalStudents = 320;
  const placedStudents = 278;
  const placementRate = Math.round((placedStudents / totalStudents) * 100);

  const highestPackage = '₹24.5 LPA (Google Cloud)';
  const avgPackage = '₹7.8 LPA';
  const totalOffers = 345;

  const departmentStats = [
    { name: 'CSE', total: 120, placed: 112, rate: 93, avgNum: 8.6, avg: '₹8.6 LPA' },
    { name: 'IT', total: 80, placed: 74, rate: 92, avgNum: 8.2, avg: '₹8.2 LPA' },
    { name: 'ECE', total: 60, placed: 51, rate: 85, avgNum: 7.1, avg: '₹7.1 LPA' },
    { name: 'EEE', total: 30, placed: 23, rate: 76, avgNum: 6.4, avg: '₹6.4 LPA' },
    { name: 'Mech & Civil', total: 30, placed: 18, rate: 60, avgNum: 5.8, avg: '₹5.8 LPA' }
  ];

  const packageDistributionData = [
    { name: '> ₹15 LPA (Tier 1)', value: 42, color: '#6366f1' },
    { name: '₹8 - ₹15 LPA (Product)', value: 135, color: '#10b981' },
    { name: '₹5 - ₹8 LPA (Service)', value: 85, color: '#3b82f6' },
    { name: '< ₹5 LPA (Core)', value: 16, color: '#f59e0b' }
  ];

  const topRecruiters = [
    { company: 'Zoho Corporation', offers: 42, package: '₹8.5 - ₹12 LPA' },
    { company: 'TCS Digital / Ninja', offers: 38, package: '₹7.0 - ₹9.0 LPA' },
    { company: 'Kovai.co SaaS', offers: 18, package: '₹9.5 LPA' },
    { company: 'Cognizant GenC Next', offers: 32, package: '₹6.7 LPA' },
    { company: 'Accenture Innovation', offers: 28, package: '₹6.5 LPA' }
  ];

  const topSkillsInDemand = [
    { skill: 'React.js & TypeScript', demand: '92%' },
    { skill: 'Python & Data Engineering', demand: '88%' },
    { skill: 'Node.js & Microservices', demand: '84%' },
    { skill: 'AWS / Azure Cloud', demand: '78%' },
    { skill: 'SQL & Database Optimization', demand: '76%' }
  ];

  const handleExportPDF = () => {
    const headers = ['Department', 'Total Eligible', 'Placed Count', 'Placement %', 'Avg Package'];
    const rows = departmentStats.map((d) => [d.name, String(d.total), String(d.placed), `${d.rate}%`, d.avg]);
    exportToPDF('CKCET Campus Placement Analytics 2026', headers, rows);
  };

  const handleExportCSV = () => {
    exportToCSV('CKCET_Placement_Analytics', departmentStats);
  };

  const handleExportExcel = () => {
    exportToExcel('CKCET_Placement_Analytics_Excel', departmentStats);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Toggle View Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setViewMode('personal')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              viewMode === 'personal'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="h-4 w-4" /> My Personal Analytics Dashboard
          </button>
          <button
            onClick={() => setViewMode('campus')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              viewMode === 'campus'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" /> Campus-Wide Placement Reports
          </button>
        </div>

        {viewMode === 'campus' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1"
            >
              <FileText className="h-4 w-4" /> Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
            </button>
          </div>
        )}
      </div>

      {/* Render Selected Analytics View */}
      {viewMode === 'personal' ? (
        <PersonalizedStudentAnalytics user={user} />
      ) : (
        <div className="space-y-6">
          {/* Campus KPI Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Overall Placement Rate</span>
                <PieChartIcon className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{placementRate}%</div>
              <p className="text-[11px] text-slate-400 mt-1">{placedStudents} out of {totalStudents} students placed</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Highest Salary Package</span>
                <Award className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{highestPackage}</div>
              <p className="text-[11px] text-slate-400 mt-1">Tier-1 Product Company Offer</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Average Salary Package</span>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{avgPackage}</div>
              <p className="text-[11px] text-slate-400 mt-1">Across all participating departments</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Total Placement Offers</span>
                <Building2 className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{totalOffers}</div>
              <p className="text-[11px] text-slate-400 mt-1">Including multiple offer holds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Department Placement Performance Recharts Bar Chart */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" /> Department Placement Performance & Placed Counts
              </h3>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
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
                    <Bar dataKey="total" fill="#94a3b8" name="Eligible Students" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="placed" fill="#6366f1" name="Placed Students" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Salary Breakdown Recharts Pie Chart */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-emerald-600" /> Salary Package Tier Distribution
              </h3>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {packageDistributionData.map((entry, index) => (
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

              <div className="space-y-1.5 text-[11px]">
                {packageDistributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value} Offers</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Recruiters & In-Demand Technical Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-600" /> Top Recruiting Partners
              </h3>
              <div className="space-y-2">
                {topRecruiters.map((rec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rec.company}</span>
                    <div className="text-right">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 block">{rec.offers} Offers</span>
                      <span className="text-[10px] text-slate-400">{rec.package}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" /> In-Demand Technical Competencies
              </h3>
              <div className="space-y-2">
                {topSkillsInDemand.map((sk, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{sk.skill}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{sk.demand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
