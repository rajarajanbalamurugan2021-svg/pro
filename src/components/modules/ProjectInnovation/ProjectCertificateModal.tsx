import React from 'react';
import { Project } from '../../../types';
import {
  X,
  Download,
  Award,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Printer
} from 'lucide-react';

interface ProjectCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectCertificateModal: React.FC<ProjectCertificateModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  if (!isOpen || !project) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Verified Innovation Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-amber-50/40 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative">
          {/* Certificate Watermark / Frame */}
          <div className="border-4 border-double border-amber-500/40 p-8 sm:p-10 rounded-2xl relative shadow-inner bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            {/* Top Seal */}
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg ring-4 ring-amber-200 dark:ring-amber-900/50">
                <Award className="h-8 w-8" />
              </div>
            </div>

            <p className="text-[11px] font-extrabold tracking-widest text-amber-700 dark:text-amber-400 uppercase mb-1">
              University Academic Innovation Board
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 font-serif">
              Certificate of Completion & Excellence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 italic">
              This official document certifies the successful completion and defense of the student project:
            </p>

            {/* Project Title */}
            <div className="my-4 py-3 px-6 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 inline-block max-w-xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                "{project.title}"
              </h2>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 block">
                Category: {project.category} | Department: {project.department}
              </span>
            </div>

            {/* Team Members List */}
            <div className="mt-6 space-y-1">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Awarded To Team Members</p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {project.members.map((m) => (
                  <span
                    key={m.userId}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                  >
                    {m.name} ({m.role})
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics & Grade */}
            <div className="grid grid-cols-3 gap-3 my-8 max-w-md mx-auto">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Innovation Score</div>
                <div className="text-base font-black text-amber-600 dark:text-amber-400">
                  {project.innovationScore}/100
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Final Grade</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {project.finalGrade || 'A+'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Status</div>
                <div className="text-base font-black text-blue-600 dark:text-blue-400">
                  Verified
                </div>
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div className="flex items-end justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="text-left space-y-1">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                  {project.facultyMentorName || 'Prof. Robert Thorne'}
                </p>
                <p className="text-[10px] text-slate-500">Faculty Supervisor & Project Director</p>
                <div className="h-0.5 w-24 bg-slate-300 dark:bg-slate-700 mt-2"></div>
              </div>

              {/* QR Code Graphic */}
              <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                <QrCode className="h-12 w-12 text-slate-900 dark:text-white" />
                <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">VERIFIED ID #{project.id.toUpperCase()}</span>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white">Dr. Eleanor Vance</p>
                <p className="text-[10px] text-slate-500">Dean of Academic Research</p>
                <div className="h-0.5 w-24 bg-slate-300 dark:bg-slate-700 mt-2 ml-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
