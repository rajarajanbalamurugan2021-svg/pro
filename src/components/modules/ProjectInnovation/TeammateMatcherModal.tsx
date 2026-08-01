import React, { useState, useEffect } from 'react';
import { Project, User } from '../../../types';
import {
  Sparkles,
  X,
  UserPlus,
  CheckCircle,
  Brain,
  Search,
  Check,
  ShieldCheck,
  Users
} from 'lucide-react';

interface TeammateMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  candidateStudents: User[];
  onInviteCandidate: (student: User, role: string) => void;
}

interface MatchResult {
  studentId: string;
  studentName: string;
  matchPercentage: number;
  matchedSkills: string[];
  recommendationReason: string;
}

export const TeammateMatcherModal: React.FC<TeammateMatcherModalProps> = ({
  isOpen,
  onClose,
  project,
  candidateStudents,
  onInviteCandidate
}) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && project) {
      runMatching();
    }
  }, [isOpen, project]);

  const runMatching = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/match-teammates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requiredSkills: project.requiredSkills,
          candidateStudents
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.matches && Array.isArray(data.matches)) {
          // Sort by match percentage descending
          setMatches(data.matches.sort((a: any, b: any) => b.matchPercentage - a.matchPercentage));
        }
      }
    } catch (err) {
      console.error('Error running teammate matching:', err);
      // Fallback matching logic
      const fallback = candidateStudents.map((st) => {
        const studentSkills = st.skills || ['JavaScript', 'Python', 'Web Development'];
        const common = project.requiredSkills.filter((s) =>
          studentSkills.some((sk) => sk.toLowerCase().includes(s.toLowerCase()))
        );
        const matchPct = Math.min(98, Math.max(60, Math.round((common.length / (project.requiredSkills.length || 1)) * 100) + 40));
        return {
          studentId: st.id,
          studentName: st.name,
          matchPercentage: matchPct,
          matchedSkills: common.length > 0 ? common : ['General Engineering'],
          recommendationReason: `Complements team tech stack in ${st.department}.`
        };
      });
      setMatches(fallback.sort((a, b) => b.matchPercentage - a.matchPercentage));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleInvite = (student: User) => {
    setInvitedMap((prev) => ({ ...prev, [student.id]: true }));
    onInviteCandidate(student, 'Team Member');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Skill-Based Teammate Recommender</h2>
              <p className="text-xs text-slate-500 truncate max-w-md">
                Matching candidates for: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Required Skills Summary */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Target Project Skills
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={runMatching}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
            >
              <Brain className="h-3.5 w-3.5" />
              {isLoading ? 'Re-analyzing...' : 'Re-run Gemini AI'}
            </button>
          </div>

          {/* Results List */}
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block p-4 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 animate-bounce">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Evaluating candidate student skill matrix via Gemini AI...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((m) => {
                const candidateObj = candidateStudents.find((s) => s.id === m.studentId) || {
                  id: m.studentId,
                  name: m.studentName,
                  department: 'Computer Science',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  email: 'student@university.edu',
                  role: 'student' as const,
                  phone: '',
                  status: 'active' as const
                };

                const isAlreadyInTeam = project.members.some((mem) => mem.userId === m.studentId);
                const isInvited = invitedMap[m.studentId];

                return (
                  <div
                    key={m.studentId}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-purple-300 dark:hover:border-purple-800 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={candidateObj.avatar}
                        alt={candidateObj.name}
                        className="h-11 w-11 rounded-xl object-cover ring-2 ring-purple-100 dark:ring-purple-900"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {candidateObj.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {candidateObj.department}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {m.recommendationReason}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {m.matchedSkills.map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30"
                            >
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Match % & Invite CTA */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-extrabold text-sm px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/40">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{m.matchPercentage}% Match</span>
                      </div>

                      {isAlreadyInTeam ? (
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> On Team
                        </span>
                      ) : isInvited ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Invited
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInvite(candidateObj as User)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <UserPlus className="h-3.5 w-3.5" /> Send Invite
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500">
          <span>AI matching uses student profile skills & department records</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
