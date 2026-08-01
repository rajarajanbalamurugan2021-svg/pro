import React, { useState } from 'react';
import { User, StudentProfileExtra, SkillGapAnalysis } from '../../../types';
import {
  User as UserIcon,
  Award,
  BookOpen,
  Code,
  Briefcase,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  BrainCircuit,
  GraduationCap,
  FolderGit2,
  Globe,
  Plus,
  Trash2,
  Edit3,
  Save,
  Compass
} from 'lucide-react';

interface Props {
  user: User;
  onUpdateUser?: (updated: User) => void;
}

export const StudentProfileAnalysis: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetRole, setTargetRole] = useState('Software Development Engineer');

  // Extended profile state
  const [profileExtra, setProfileExtra] = useState<StudentProfileExtra>({
    studentId: user.id,
    internalMarks: 88,
    softSkills: ['Problem Solving', 'Team Leadership', 'Technical Communication', 'Agile Principles'],
    certifications: [
      'AWS Certified Cloud Practitioner',
      'Meta Front-End Developer Professional Certificate',
      'NPTEL Data Structures & Algorithms (Gold Medal)'
    ],
    projectsList: [
      'Autonomous Campus AI Guard (React, Python, OpenCV)',
      'Smart Library QR Attendance System (Node.js, PostgreSQL)'
    ],
    internshipExperience: 'Summer SDE Intern at Kovai.co (3 Months) - Worked on C# & Azure Microservices',
    resumeUrl: 'https://ckcet.ac.in/resumes/CS2023001_AlexRivera.pdf',
    portfolio: {
      github: user.githubProfile || 'https://github.com/alexrivera-dev',
      linkedin: 'https://linkedin.com/in/alex-rivera-dev',
      website: 'https://alexrivera.dev'
    },
    achievements: {
      hackathons: ['Winner - Smart India Hackathon 2025', 'Top 5 Finalist - HackChennai 2024'],
      workshops: ['Hands-on Cloud Microservices Workshop', 'Deep Learning & Vision AI Bootcamp'],
      awards: ['Best Academic Project Award 2025', 'Department Merit Rank 2']
    },
    preferredRoles: ['Software Development Engineer', 'Full Stack Developer', 'AI Solutions Architect'],
    preferredLocations: ['Chennai', 'Bengaluru', 'Hyderabad', 'Remote'],
    careerInterests: ['Artificial Intelligence', 'Cloud Native Systems', 'Enterprise SaaS']
  });

  // State for AI Skill Gap Analysis
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>({
    overallReadinessScore: 88,
    missingSkills: ['Distributed System Design', 'Docker & Kubernetes', 'Redis Cache Tuning', 'GraphQL APIs'],
    requiredCertifications: [
      'AWS Certified Developer Associate',
      'Certified Kubernetes Application Developer (CKAD)'
    ],
    recommendedCourses: [
      { name: 'Distributed Systems & Microservices', provider: 'Coursera (DeepLearning.AI)', link: '#' },
      { name: 'System Design Interview Bootcamp', provider: 'Educative.io', link: '#' },
      { name: 'Mastering LeetCode Hard Patterns', provider: 'GeeksforGeeks', link: '#' }
    ],
    practicePlatforms: ['LeetCode (Target 150 Medium/Hard)', 'HackerRank 5-Star Problem Solver', 'CodeChef'],
    suggestedMiniProjects: [
      'High-Throughput Order Management Engine with Redis & BullMQ',
      'Real-Time WebSockets Whiteboard with WebRTC Audio Sync'
    ]
  });

  // Editable basic state
  const [skillsList, setSkillsList] = useState<string[]>(user.skills || ['React.js', 'Node.js', 'Python', 'TypeScript', 'SQL', 'Git']);
  const [newSkill, setNewSkill] = useState('');
  const [cgpa, setCgpa] = useState<number>(8.8);

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-placement-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: {
            name: user.name,
            department: user.department,
            rollNumber: user.rollNumber,
            cgpa,
            skills: skillsList,
            extra: profileExtra
          },
          targetRole
        })
      });
      const data = await response.json();
      setSkillGap(data);
    } catch (err) {
      console.error('Error running skill gap analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      const updated = [...skillsList, newSkill.trim()];
      setSkillsList(updated);
      setNewSkill('');
      if (onUpdateUser) {
        onUpdateUser({ ...user, skills: updated });
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skillsList.filter((s) => s !== skillToRemove);
    setSkillsList(updated);
    if (onUpdateUser) {
      onUpdateUser({ ...user, skills: updated });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Academic Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user.rollNumber || 'CS2023001'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-1 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-400" />
                {user.department} • Semester {user.semester || 6} ({user.batch || '2023-2027'})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-indigo-200">CGPA</div>
              <div className="text-lg font-extrabold text-emerald-400">{cgpa}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-indigo-200">Internal Score</div>
              <div className="text-lg font-extrabold text-blue-400">{profileExtra.internalMarks}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-indigo-200">Readiness</div>
              <div className="text-lg font-extrabold text-purple-300">{skillGap?.overallReadinessScore || 85}%</div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-2"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid Section: Profile Details & AI Skill Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Comprehensive Profile Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Technical & Soft Skills */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Technical & Programming Skills
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {skillsList.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500 transition"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g., Docker, Flutter)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Soft Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profileExtra.softSkills.map((ss, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md">
                    {ss}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications & Internships */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-amber-500" />
              Certifications & Prior Experience
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">Verified Certifications</span>
                <div className="space-y-1.5">
                  {profileExtra.certifications.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Internship History</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  {profileExtra.internshipExperience}
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio & Resume Links */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
              <FolderGit2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Resume & Online Portfolio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={profileExtra.portfolio.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-slate-800 dark:text-slate-100" />
                  GitHub Profile
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              <a
                href={profileExtra.portfolio.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-medium text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  LinkedIn Handle
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>

            <div className="mt-3">
              <a
                href={profileExtra.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/70 transition"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Download Active College Resume PDF
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: AI Skill Gap Analysis & Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-900/50 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                AI Skill Gap Analysis
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Gemini Powered
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Evaluate your profile against current industry requirements for target job roles.
            </p>

            <div className="space-y-3 mb-5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Target Role for Evaluation
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. SDE-1, Data Engineer, Embedded Dev..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Gap'}
                </button>
              </div>
            </div>

            {skillGap && (
              <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Readiness Score */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">Job Compatibility Readiness</span>
                    <span className="text-[10px] text-slate-400">Based on CGPA, skills & certifications</span>
                  </div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {skillGap.overallReadinessScore}%
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    Recommended Missing Tech Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGap.missingSkills.map((ms, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-medium rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                        {ms}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Certifications & Online Courses */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    Recommended Online Courses & Certs
                  </h4>
                  <div className="space-y-2">
                    {skillGap.recommendedCourses.map((rc, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{rc.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between mt-1">
                          <span>Provided by {rc.provider}</span>
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">Start Course →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Mini Projects */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-emerald-500" />
                    Suggested Portfolio Mini Projects
                  </h4>
                  <ul className="space-y-1.5">
                    {skillGap.suggestedMiniProjects.map((p, idx) => (
                      <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-900/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
