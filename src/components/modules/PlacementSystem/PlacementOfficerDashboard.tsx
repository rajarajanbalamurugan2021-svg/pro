import React, { useState } from 'react';
import { User, PlacementOpportunity, PlacementApplication } from '../../../types';
import { exportToCSV, exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import {
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  FileText,
  Building2,
  Users,
  Award,
  Filter,
  CheckCircle,
  Download,
  DollarSign
} from 'lucide-react';

interface Props {
  user: User;
  opportunities: PlacementOpportunity[];
  applications: PlacementApplication[];
  onSaveOpportunity: (opp: PlacementOpportunity) => void;
  onDeleteOpportunity: (oppId: string) => void;
}

export const PlacementOfficerDashboard: React.FC<Props> = ({
  user,
  opportunities,
  applications,
  onSaveOpportunity,
  onDeleteOpportunity
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Partial<PlacementOpportunity>>({
    type: 'Full-Time Placement',
    category: 'Dream',
    departmentEligibility: ['Computer Science & Engineering', 'Information Technology'],
    requiredSkills: ['React.js', 'Node.js', 'SQL'],
    responsibilities: ['Develop scalable microservices', 'Write production unit tests'],
    perks: ['Health Insurance', 'Free Lunch'],
    status: 'Open',
    minCGPA: 7.5,
    packageNumber: 8.0,
    stipendOrPackage: '₹8.0 LPA'
  });

  const handleCreateNew = () => {
    setEditingOpp({
      id: `opp-${Date.now()}`,
      type: 'Full-Time Placement',
      companyName: '',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
      roleTitle: '',
      departmentEligibility: ['Computer Science & Engineering', 'Information Technology'],
      category: 'Dream',
      location: 'Chennai',
      stipendOrPackage: '₹8.0 LPA',
      packageNumber: 8.0,
      duration: 'Full-Time Permanent',
      minCGPA: 7.0,
      requiredSkills: ['React.js', 'Python', 'SQL'],
      jobDescription: 'Software engineering role focused on high performance web apps.',
      responsibilities: ['Develop APIs', 'Collaborate with agile team'],
      perks: ['Health Cover', 'Flexible Hours'],
      applicationDeadline: '2026-09-01',
      driveDate: '2026-09-15',
      status: 'Open',
      recruiterId: user.id,
      recruiterEmail: user.email,
      applicantsCount: 0
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp.companyName || !editingOpp.roleTitle) return;
    onSaveOpportunity(editingOpp as PlacementOpportunity);
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const data = opportunities.map((o) => ({
      ID: o.id,
      Company: o.companyName,
      Role: o.roleTitle,
      Type: o.type,
      Category: o.category,
      Package: o.stipendOrPackage,
      MinCGPA: o.minCGPA,
      Deadline: o.applicationDeadline,
      Applicants: o.applicantsCount
    }));
    exportToCSV('CKCET_Placement_Opportunities', data);
  };

  const handleExportExcel = () => {
    const data = opportunities.map((o) => ({
      ID: o.id,
      Company: o.companyName,
      Role: o.roleTitle,
      Type: o.type,
      Category: o.category,
      Package: o.stipendOrPackage,
      MinCGPA: o.minCGPA,
      Deadline: o.applicationDeadline,
      Applicants: o.applicantsCount
    }));
    exportToExcel('CKCET_Placement_Report', data);
  };

  const handleExportPDF = () => {
    const headers = ['Company', 'Role', 'Type', 'Package', 'Min CGPA', 'Deadline', 'Applicants'];
    const rows = opportunities.map((o) => [
      o.companyName,
      o.roleTitle,
      o.type,
      o.stipendOrPackage,
      String(o.minCGPA),
      o.applicationDeadline,
      String(o.applicantsCount)
    ]);
    exportToPDF('Campus Placement Opportunities Report', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Placement Officer Command Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Post and manage campus recruitment drives, filter eligible students, and generate official reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add New Drive / Job Posting
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3 py-2 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold hover:bg-rose-100 transition flex items-center gap-1"
          >
            <FileText className="h-4 w-4" /> Export PDF
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
          >
            <FileSpreadsheet className="h-4 w-4" /> Export Excel
          </button>
        </div>
      </div>

      {/* Opportunities Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Placement & Internship Drives</h3>
          <span className="text-xs text-slate-500">Total Drives: {opportunities.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th className="p-3.5">Company & Role</th>
                <th className="p-3.5">Type & Category</th>
                <th className="p-3.5">Package</th>
                <th className="p-3.5">Eligibility</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5">Applicants</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3.5 font-semibold">
                    <div className="text-slate-900 dark:text-white font-bold">{opp.roleTitle}</div>
                    <div className="text-[11px] text-slate-500">{opp.companyName} • {opp.location}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mr-1">
                      {opp.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {opp.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                    {opp.stipendOrPackage}
                  </td>
                  <td className="p-3.5">
                    Min CGPA: <strong>{opp.minCGPA}</strong>
                  </td>
                  <td className="p-3.5 text-amber-600 dark:text-amber-400 font-medium">
                    {opp.applicationDeadline}
                  </td>
                  <td className="p-3.5 font-bold">
                    {opp.applicantsCount}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingOpp(opp);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteOpportunity(opp.id)}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
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

      {/* Edit / Create Opportunity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingOpp.id ? 'Edit Opportunity Drive' : 'Create New Recruitment Drive'}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={editingOpp.companyName || ''}
                  onChange={(e) => setEditingOpp({ ...editingOpp, companyName: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Job Role Title</label>
                <input
                  type="text"
                  required
                  value={editingOpp.roleTitle || ''}
                  onChange={(e) => setEditingOpp({ ...editingOpp, roleTitle: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Opportunity Type</label>
                <select
                  value={editingOpp.type || 'Full-Time Placement'}
                  onChange={(e) => setEditingOpp({ ...editingOpp, type: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Full-Time Placement">Full-Time Placement</option>
                  <option value="Internship">Internship</option>
                  <option value="PPO (Pre-Placement Offer)">PPO</option>
                  <option value="Off-Campus Drive">Off-Campus Drive</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Company Category</label>
                <select
                  value={editingOpp.category || 'Dream'}
                  onChange={(e) => setEditingOpp({ ...editingOpp, category: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Dream">Dream Company</option>
                  <option value="Core">Core Engineering</option>
                  <option value="IT & Software">IT & Software</option>
                  <option value="Startup">Startup</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Package / Stipend Text</label>
                <input
                  type="text"
                  value={editingOpp.stipendOrPackage || '₹8.0 LPA'}
                  onChange={(e) => setEditingOpp({ ...editingOpp, stipendOrPackage: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Minimum CGPA Required</label>
                <input
                  type="number"
                  step="0.1"
                  value={editingOpp.minCGPA || 7.0}
                  onChange={(e) => setEditingOpp({ ...editingOpp, minCGPA: parseFloat(e.target.value) })}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Save Posting
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
