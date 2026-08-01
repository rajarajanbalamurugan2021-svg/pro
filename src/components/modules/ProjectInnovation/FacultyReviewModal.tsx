import React, { useState } from 'react';
import { Project, User } from '../../../types';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Star,
  FileCheck2,
  Brain
} from 'lucide-react';

interface FacultyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  facultyUsers: User[];
  onSaveReview: (
    projectId: string,
    reviewData: {
      decision: 'Approved' | 'Changes Requested' | 'Rejected';
      comments: string;
      innovationGrade: number;
      technicalGrade: number;
      presentationGrade: number;
      overallScore: number;
      assignedMentorId?: string;
      assignedMentorName?: string;
      meetingTitle?: string;
      meetingDate?: string;
      meetingTime?: string;
    }
  ) => void;
}

export const FacultyReviewModal: React.FC<FacultyReviewModalProps> = ({
  isOpen,
  onClose,
  project,
  facultyUsers,
  onSaveReview
}) => {
  const [decision, setDecision] = useState<'Approved' | 'Changes Requested' | 'Rejected'>('Approved');
  const [comments, setComments] = useState('');
  const [innovationGrade, setInnovationGrade] = useState<number>(9);
  const [technicalGrade, setTechnicalGrade] = useState<number>(9);
  const [presentationGrade, setPresentationGrade] = useState<number>(8);
  const [selectedMentorId, setSelectedMentorId] = useState<string>(
    project.facultyMentorId || facultyUsers[0]?.id || ''
  );
  
  // Meeting Schedule
  const [scheduleMeeting, setScheduleMeeting] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState(`Review Session: ${project.title}`);
  const [meetingDate, setMeetingDate] = useState('2026-08-10');
  const [meetingTime, setMeetingTime] = useState('14:30');

  if (!isOpen || !project) return null;

  const calculatedOverallScore = Math.round(
    ((innovationGrade + technicalGrade + presentationGrade) / 30) * 100
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mentorObj = facultyUsers.find((f) => f.id === selectedMentorId);

    onSaveReview(project.id, {
      decision,
      comments: comments || 'Proposal meets department standard requirements and guidelines.',
      innovationGrade,
      technicalGrade,
      presentationGrade,
      overallScore: calculatedOverallScore,
      assignedMentorId: mentorObj?.id,
      assignedMentorName: mentorObj?.name,
      meetingTitle: scheduleMeeting ? meetingTitle : undefined,
      meetingDate: scheduleMeeting ? meetingDate : undefined,
      meetingTime: scheduleMeeting ? meetingTime : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Faculty Mentorship & Evaluation Panel</h2>
              <p className="text-xs text-slate-500">Evaluating proposal & assigning mentorship guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Project Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                {project.category}
              </span>
              <span className="text-xs text-slate-500">Lead: {project.ownerName} ({project.department})</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{project.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{project.abstract}</p>
          </div>

          {/* Decision Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Faculty Committee Decision *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDecision('Approved')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  decision === 'Approved'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Proposal
              </button>

              <button
                type="button"
                onClick={() => setDecision('Changes Requested')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  decision === 'Changes Requested'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                Request Changes
              </button>

              <button
                type="button"
                onClick={() => setDecision('Rejected')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  decision === 'Rejected'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <XCircle className="h-4 w-4" />
                Reject Idea
              </button>
            </div>
          </div>

          {/* Assign Mentor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assign Faculty Mentor
            </label>
            <select
              value={selectedMentorId}
              onChange={(e) => setSelectedMentorId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              {facultyUsers.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} — {fac.department}
                </option>
              ))}
            </select>
          </div>

          {/* Evaluation Rubric (0-10) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" /> Evaluation Rubric (0-10 Scale)
              </span>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                Calculated Score: {calculatedOverallScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Innovation & Novelty (0-10)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={innovationGrade}
                  onChange={(e) => setInnovationGrade(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Technical Depth (0-10)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={technicalGrade}
                  onChange={(e) => setTechnicalGrade(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Presentation & Docs (0-10)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={presentationGrade}
                  onChange={(e) => setPresentationGrade(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Schedule Review Meeting Checkbox */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={scheduleMeeting}
                onChange={(e) => setScheduleMeeting(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              Schedule Review Defense Meeting with Team
            </label>

            {scheduleMeeting && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="Meeting Title"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Time</label>
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Comments / Feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Feedback & Suggestions for Students
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback regarding methodology, architecture, or required revisions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="h-4 w-4" />
              Save Evaluation & Notify Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
