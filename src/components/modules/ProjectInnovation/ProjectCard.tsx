import React from 'react';
import { Project, UserRole } from '../../../types';
import {
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Award,
  FileText,
  MessageSquare,
  ShieldAlert,
  QrCode,
  Layers
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  currentUserRole: UserRole;
  currentUserId: string;
  onViewDetails: (project: Project) => void;
  onJoinTeam?: (project: Project) => void;
  onFacultyReview?: (project: Project) => void;
  onGenerateCertificate?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  currentUserRole,
  currentUserId,
  onViewDetails,
  onJoinTeam,
  onFacultyReview,
  onGenerateCertificate
}) => {
  const isOwner = project.ownerId === currentUserId;
  const isMember = project.members.some((m) => m.userId === currentUserId);
  const isTeamFull = project.members.length >= project.maxTeamSize;

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'Completed':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300';
      case 'Development':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300';
      case 'Faculty Review':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300';
      case 'Proposal Upload':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500 text-white';
      case 'Pending Approval':
        return 'bg-amber-500 text-white';
      case 'Changes Requested':
        return 'bg-orange-500 text-white';
      case 'Completed':
        return 'bg-indigo-600 text-white';
      case 'Rejected':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStageBadge(project.stage)}`}>
              {project.stage}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(project.status)}`}>
              {project.status}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900/40">
            <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            <span>{project.innovationScore}/100</span>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
          {project.title}
        </h3>

        {/* Abstract */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.abstract}
        </p>

        {/* Required Skills & Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.requiredSkills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30"
            >
              {skill}
            </span>
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
              +{project.requiredSkills.length - 4}
            </span>
          )}
        </div>

        {/* Badges / Highlights */}
        {project.badges && project.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.badges.map((b, i) => (
              <span
                key={i}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 flex items-center gap-1"
              >
                <Award className="h-3 w-3 text-indigo-500" />
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
              {project.ownerName}
            </span>
            <span className="text-[11px] text-slate-400">({project.department.split(' ')[0]})</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>
              {project.members.length}/{project.maxTeamSize} Members
            </span>
          </div>
        </div>

        {/* Faculty Mentor */}
        {project.facultyMentorName && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg">
            <ShieldAlert className="h-3.5 w-3.5 text-blue-500" />
            <span>Mentor: <strong className="text-slate-700 dark:text-slate-300">{project.facultyMentorName}</strong></span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onViewDetails(project)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Layers className="h-3.5 w-3.5 text-slate-500" />
            View Hub
          </button>

          {!isMember && !isTeamFull && currentUserRole === 'student' && onJoinTeam && (
            <button
              onClick={() => onJoinTeam(project)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
            >
              Join Team
            </button>
          )}

          {(currentUserRole === 'faculty' || currentUserRole === 'admin' || currentUserRole === 'super_admin') &&
            onFacultyReview && (
              <button
                onClick={() => onFacultyReview(project)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center gap-1"
              >
                Review
              </button>
            )}

          {project.stage === 'Completed' && onGenerateCertificate && (
            <button
              onClick={() => onGenerateCertificate(project)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
              title="Certificate & QR Code"
            >
              <QrCode className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
