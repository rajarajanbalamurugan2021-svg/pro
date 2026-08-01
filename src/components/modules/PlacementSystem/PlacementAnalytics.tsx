import React from 'react';
import { User, PlacementOpportunity, PlacementApplication } from '../../../types';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Building2,
  FileSpreadsheet,
  FileText,
  PieChart as PieChartIcon,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface Props {
  user: User;
  opportunities: PlacementOpportunity[];
  applications: PlacementApplication[];
}

export const PlacementAnalytics: React.FC<Props> = ({ user, opportunities, applications }) => {
  // Placement stats calculation
  const totalStudents = 320;
  const placedStudents = 278;
  const placementRate = Math.round((placedStudents / totalStudents) * 100);

  const highestPackage = '₹24.5 LPA (Google Cloud)';
  const avgPackage = '₹7.8 LPA';
  const totalOffers = 345;

  const departmentStats = [
    { name: 'Computer Science (CSE)', total: 120, placed: 112, rate: 93, avg: '₹8.6 LPA' },
    { name: 'Information Tech (IT)', total: 80, placed: 74, rate: 92, avg: '₹8.2 LPA' },
    { name: 'Electronics (ECE)', total: 60, placed: 51, rate: 85, avg: '₹7.1 LPA' },
    { name: 'Electrical (EEE)', total: 30, placed: 23, rate: 76, avg: '₹6.4 LPA' },
    { name: 'Mechanical & Civil', total: 30, placed: 18, rate: 60, avg: '₹5.8 LPA' }
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
      {/* Analytics Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Campus Placement & Salary Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time statistical breakdowns, department-wise placement percentages, salary distributions, and recruiter reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1"
          >
            <FileText className="h-4 w-4" /> Export Analytics PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
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
        {/* Department-wise Placement Rate Bar Charts */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" /> Department Placement Performance
          </h3>

          <div className="space-y-4 pt-2">
            {departmentStats.map((dept, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{dept.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{dept.placed}/{dept.total} ({dept.rate}%) • Avg: {dept.avg}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recruiters & Skills Demand */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" /> Top Recruiting Companies
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
              <Award className="h-4 w-4 text-emerald-600" /> In-Demand Technical Skills
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
    </div>
  );
};
