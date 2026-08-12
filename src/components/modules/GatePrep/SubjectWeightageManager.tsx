import React, { useState } from 'react';
import { GateSubjectWeightage, GatePaper } from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import { BarChart3, Plus, Save, RotateCcw, Award } from 'lucide-react';

interface SubjectWeightageManagerProps {
  currentUser: { id: string; name: string; role: string };
  isAdmin: boolean;
}

export const SubjectWeightageManager: React.FC<SubjectWeightageManagerProps> = ({
  currentUser,
  isAdmin
}) => {
  const [selectedPaper, setSelectedPaper] = useState<GatePaper>('ECE');
  const [weightages, setWeightages] = useState<GateSubjectWeightage[]>(() =>
    GateService.getSubjectWeightage('ECE')
  );
  const [isSaved, setIsSaved] = useState(false);

  const handlePaperChange = (paper: GatePaper) => {
    setSelectedPaper(paper);
    setWeightages(GateService.getSubjectWeightage(paper));
  };

  const handleFieldChange = (id: string, field: keyof GateSubjectWeightage, val: any) => {
    setWeightages(prev =>
      prev.map(w => (w.id === id ? { ...w, [field]: val } : w))
    );
  };

  const handleSaveAll = () => {
    GateService.updateSubjectWeightage(weightages, currentUser);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>GATE Subject Weightage & Priority Matrix</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Official marks distribution analysis and high-yield topic priorities across all engineering branches.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaved ? 'Saved to Database!' : 'Save Matrix Updates'}</span>
          </button>
        )}
      </div>

      {/* Branch Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ECE', 'EEE', 'ME', 'CE', 'CSE', 'AIDS', 'BM', 'RO'] as GatePaper[]).map(p => (
          <button
            key={p}
            onClick={() => handlePaperChange(p)}
            className={`px-4 py-2 rounded-2xl font-black transition ${
              selectedPaper === p
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            GATE {p} Weightage
          </button>
        ))}
      </div>

      {/* Weightage Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-3">Subject Name</th>
              <th className="p-3">Exam Year</th>
              <th className="p-3">Questions Count</th>
              <th className="p-3">Total Marks</th>
              <th className="p-3">Weightage %</th>
              <th className="p-3">Priority Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {weightages.map(w => (
              <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="p-3 font-bold text-slate-900 dark:text-white">
                  {isAdmin ? (
                    <input
                      type="text"
                      value={w.subject}
                      onChange={e => handleFieldChange(w.id, 'subject', e.target.value)}
                      className="bg-transparent border-b border-slate-300 dark:border-slate-700 font-bold outline-none text-xs w-full"
                    />
                  ) : (
                    w.subject
                  )}
                </td>
                <td className="p-3 text-slate-500">{w.year}</td>
                <td className="p-3 font-mono">{w.questionCount} Qs</td>
                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{w.marks} Marks</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, w.weightagePercentage * 5)}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{w.weightagePercentage}%</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                    w.priority === 'HIGH'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      : w.priority === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {w.priority} PRIORITY
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
