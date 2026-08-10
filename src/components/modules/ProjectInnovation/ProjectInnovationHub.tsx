import React, { useState, useEffect } from 'react';
import {
  Project,
  User,
  UserRole,
  TeamInvitation,
  SkillItem,
  CategoryItem,
  TechStackItem
} from '../../../types';
import {
  Sparkles,
  Search,
  Plus,
  Filter,
  Users,
  Award,
  ShieldCheck,
  FolderPlus,
  Brain,
  Download,
  Database,
  QrCode,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck2,
  BarChart3,
  Flame,
  Check,
  X
} from 'lucide-react';

import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { TeammateMatcherModal } from './TeammateMatcherModal';
import { FacultyReviewModal } from './FacultyReviewModal';
import { ProjectCertificateModal } from './ProjectCertificateModal';
import { SystemSchemaModal } from './SystemSchemaModal';
import { ProjectDetailModal } from './ProjectDetailModal';
import { AdminManagementPanel } from './AdminManagementPanel';
import { AIGuidanceAssistantPanel } from './AIGuidanceAssistantPanel';
import { ProjectWorkspacePanel } from './ProjectWorkspacePanel';

interface ProjectInnovationHubProps {
  userRole: UserRole;
  currentUser: User;
  projects: Project[];
  users: User[];
  skills: SkillItem[];
  categories: CategoryItem[];
  techStacks: TechStackItem[];
  invitations: TeamInvitation[];
  onUpdateProjects: (updatedProjects: Project[]) => void;
  onUpdateInvitations: (updatedInvitations: TeamInvitation[]) => void;
  onRoleSwitch?: (role: UserRole) => void;
}

export const ProjectInnovationHub: React.FC<ProjectInnovationHubProps> = ({
  userRole,
  currentUser,
  projects,
  users,
  skills,
  categories,
  techStacks,
  invitations,
  onUpdateProjects,
  onUpdateInvitations,
  onRoleSwitch
}) => {
  // Navigation View Tab: 'browse' | 'my_projects' | 'faculty_queue' | 'admin_panel' | 'leaderboard'
  const [viewTab, setViewTab] = useState<string>('browse');

  const isAdminOrSuper = userRole === 'admin' || userRole === 'super_admin';

  useEffect(() => {
    if (viewTab === 'admin_panel' && !isAdminOrSuper) {
      setViewTab('browse');
    }
  }, [viewTab, userRole, isAdminOrSuper]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [activeProjectForDetail, setActiveProjectForDetail] = useState<Project | null>(null);
  const [activeProjectForMatcher, setActiveProjectForMatcher] = useState<Project | null>(null);
  const [activeProjectForFacultyReview, setActiveProjectForFacultyReview] = useState<Project | null>(null);
  const [activeProjectForCertificate, setActiveProjectForCertificate] = useState<Project | null>(null);

  // Filtered Projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStage = selectedStage === 'All' || p.stage === selectedStage;

    return matchesSearch && matchesCategory && matchesStage;
  });

  // Role specific subsets
  const myProjects = projects.filter(
    (p) => p.ownerId === currentUser.id || p.members.some((m) => m.userId === currentUser.id)
  );

  const pendingFacultyQueue = projects.filter(
    (p) => p.status === 'Pending Approval' || p.stage === 'Faculty Review' || p.stage === 'Proposal Upload'
  );

  const facultyUsers = users.filter((u) => u.role === 'faculty' || u.role === 'admin' || u.role === 'super_admin');
  const studentUsers = users.filter((u) => u.role === 'student');

  // Create Project Callback
  const handleCreateProject = (newProjectData: Partial<Project>) => {
    const created: Project = {
      id: `proj-${Date.now()}`,
      title: newProjectData.title || 'Untitled Innovation Project',
      abstract: newProjectData.abstract || '',
      category: newProjectData.category || 'AI & Machine Learning',
      department: newProjectData.department || currentUser.department || 'Computer Science',
      tags: newProjectData.tags || ['Innovation'],
      requiredSkills: newProjectData.requiredSkills || ['React.js', 'Node.js'],
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      stage: 'Idea Submission',
      status: 'Pending Approval',
      innovationScore: newProjectData.innovationScore || 85,
      maxTeamSize: newProjectData.maxTeamSize || 4,
      members: newProjectData.members || [],
      documents: newProjectData.documents || [],
      milestones: newProjectData.milestones || [],
      tasks: newProjectData.tasks || [],
      reviews: newProjectData.reviews || [],
      chatMessages: newProjectData.chatMessages || [],
      badges: newProjectData.badges || ['New Idea'],
      githubRepo: newProjectData.githubRepo,
      demoUrl: newProjectData.demoUrl,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      qrCodeData: `https://university.edu/projects/proj-${Date.now()}`
    };

    onUpdateProjects([created, ...projects]);
  };

  // Update Single Project
  const handleUpdateSingleProject = (updated: Project) => {
    const nextList = projects.map((p) => (p.id === updated.id ? updated : p));
    onUpdateProjects(nextList);
    if (activeProjectForDetail?.id === updated.id) {
      setActiveProjectForDetail(updated);
    }
  };

  // Faculty Review Save
  const handleSaveFacultyReview = (
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
  ) => {
    const nextList = projects.map((p) => {
      if (p.id === projectId) {
        const newReview = {
          id: `rev-${Date.now()}`,
          facultyId: currentUser.id,
          facultyName: currentUser.name,
          comments: reviewData.comments,
          innovationGrade: reviewData.innovationGrade,
          technicalGrade: reviewData.technicalGrade,
          presentationGrade: reviewData.presentationGrade,
          overallScore: reviewData.overallScore,
          decision: reviewData.decision,
          reviewedAt: new Date().toISOString().split('T')[0]
        };

        const newMeetings = p.meetingSchedules || [];
        if (reviewData.meetingTitle && reviewData.meetingDate) {
          newMeetings.push({
            id: `mtg-${Date.now()}`,
            mentorId: currentUser.id,
            mentorName: currentUser.name,
            studentId: p.ownerId,
            studentName: p.ownerName,
            title: reviewData.meetingTitle,
            date: reviewData.meetingDate,
            time: reviewData.meetingTime || '14:00',
            location: 'Faculty Research Office / Virtual Meet',
            agenda: reviewData.comments,
            status: 'Scheduled'
          });
        }

        return {
          ...p,
          status: reviewData.decision === 'Approved' ? ('Approved' as const) : reviewData.decision === 'Changes Requested' ? ('Changes Requested' as const) : ('Rejected' as const),
          stage: reviewData.decision === 'Approved' ? ('Approval' as const) : ('Faculty Review' as const),
          facultyMentorId: reviewData.assignedMentorId || p.facultyMentorId,
          facultyMentorName: reviewData.assignedMentorName || p.facultyMentorName,
          innovationScore: reviewData.overallScore,
          reviews: [newReview, ...p.reviews],
          meetingSchedules: newMeetings,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });

    onUpdateProjects(nextList);
  };

  // Invite candidate student
  const handleInviteCandidate = (student: User, role: string) => {
    if (!activeProjectForMatcher) return;

    const newInv: TeamInvitation = {
      id: `inv-${Date.now()}`,
      projectId: activeProjectForMatcher.id,
      projectTitle: activeProjectForMatcher.title,
      inviterId: currentUser.id,
      inviterName: currentUser.name,
      inviteeId: student.id,
      inviteeName: student.name,
      inviteeEmail: student.email,
      role,
      status: 'Pending',
      sentAt: new Date().toISOString().split('T')[0]
    };

    onUpdateInvitations([newInv, ...invitations]);
  };

  // Download Comprehensive System Report
  const handleDownloadReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'Student Project Collaboration and Innovation Management Platform',
      totalProjects: projects.length,
      categoriesCount: categories.length,
      projects
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Innovation_Platform_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const departmentsList = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electrical & Electronics Engineering',
    'Mechanical & Robotics Engineering',
    'Biomedical & Biotechnology'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Student Project Collaboration & Innovation Platform</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Innovate, Collaborate, and Execute Capstone Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Share research ideas, recruit teammates via AI skill matching, receive faculty guidance, track milestones, and earn verified completion credentials.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Post Project Idea
            </button>

            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/10 transition-all flex items-center gap-1.5"
            >
              <Database className="h-4 w-4 text-purple-300" /> System Schema & APIs
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" /> Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Counter Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Innovation Ideas</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{projects.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Approved & Active</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {projects.filter((p) => p.status === 'Approved' || p.status === 'Completed').length}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Avg Innovation Score</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {Math.round(projects.reduce((acc, p) => acc + p.innovationScore, 0) / (projects.length || 1))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <UserCheck2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500">Pending Review Queue</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{pendingFacultyQueue.length}</div>
          </div>
        </div>
      </div>

      {/* Main Module View Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setViewTab('browse')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'browse'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Search className="h-4 w-4" /> Browse Projects ({projects.length})
          </button>

          <button
            onClick={() => setViewTab('workspace')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'workspace'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderPlus className="h-4 w-4" /> Project Workspace
          </button>

          <button
            onClick={() => setViewTab('faculty_queue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'faculty_queue'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Faculty Review ({pendingFacultyQueue.length})
          </button>

          {isAdminOrSuper && (
            <button
              onClick={() => setViewTab('admin_panel')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewTab === 'admin_panel'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="h-4 w-4" /> Admin Management
            </button>
          )}

          <button
            onClick={() => setViewTab('ai_guidance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'ai_guidance'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Brain className="h-4 w-4 text-amber-300" /> AI Guidance
          </button>

          <button
            onClick={() => setViewTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewTab === 'leaderboard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Flame className="h-4 w-4 text-amber-400" /> Leaderboard
          </button>
        </div>

        {/* Role Preview Switcher for Testing */}
        {onRoleSwitch && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <span>Role Preview:</span>
            <button
              onClick={() => onRoleSwitch('student')}
              className={`px-2 py-0.5 rounded ${userRole === 'student' ? 'bg-blue-600 text-white' : 'hover:text-slate-800'}`}
            >
              Student
            </button>
            <button
              onClick={() => onRoleSwitch('faculty')}
              className={`px-2 py-0.5 rounded ${userRole === 'faculty' ? 'bg-amber-500 text-white' : 'hover:text-slate-800'}`}
            >
              Faculty
            </button>
            <button
              onClick={() => onRoleSwitch('admin')}
              className={`px-2 py-0.5 rounded ${userRole === 'admin' ? 'bg-purple-600 text-white' : 'hover:text-slate-800'}`}
            >
              Admin
            </button>
          </div>
        )}
      </div>

      {/* Tab View 1: Browse Projects */}
      {viewTab === 'browse' && (
        <div className="space-y-4">
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project title, skill (e.g. React, Python), abstract, or author..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none font-semibold"
            >
              <option value="All">All Innovation Categories</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Web & Mobile Apps">Web & Mobile Apps</option>
              <option value="IoT & Robotics">IoT & Robotics</option>
              <option value="Blockchain & Fintech">Blockchain & Fintech</option>
              <option value="Renewable Energy">Renewable Energy</option>
            </select>
          </div>

          {/* Project Cards Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
              <Layers className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Projects Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No innovation project matched your search query or category filter. Try clearing filters or submit a new project idea!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Post New Idea
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  currentUserRole={userRole}
                  currentUserId={currentUser.id}
                  onViewDetails={(p) => setActiveProjectForDetail(p)}
                  onFacultyReview={(p) => setActiveProjectForFacultyReview(p)}
                  onGenerateCertificate={(p) => setActiveProjectForCertificate(p)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab View 2: Workspace & Collaboration */}
      {viewTab === 'workspace' && (
        <ProjectWorkspacePanel
          projects={myProjects.length > 0 ? myProjects : projects}
          currentUser={{ id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar }}
          onUpdateProject={handleUpdateSingleProject}
        />
      )}

      {/* Tab View 3: Admin Management Panel */}
      {viewTab === 'admin_panel' && (
        isAdminOrSuper ? (
          <AdminManagementPanel
            users={users}
            projects={projects}
            departments={departmentsList}
            onUpdateUsers={(updatedUsers) => {
              // Handled via state update
            }}
            onUpdateProjects={onUpdateProjects}
          />
        ) : (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/80 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Access Restricted
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Admin Management features are strictly restricted to campus Administrators and Super Admins.
            </p>
          </div>
        )
      )}

      {/* Tab View 4: AI Guidance & Assistant */}
      {viewTab === 'ai_guidance' && (
        <AIGuidanceAssistantPanel
          projects={projects}
          users={users}
          currentUser={currentUser}
        />
      )}

      {/* Tab View 3: Faculty Review Station */}
      {viewTab === 'faculty_queue' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Faculty Review & Mentorship Queue
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Evaluate proposal feasibility, assign supervisors, and schedule review sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingFacultyQueue.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                currentUserRole={userRole}
                currentUserId={currentUser.id}
                onViewDetails={(p) => setActiveProjectForDetail(p)}
                onFacultyReview={(p) => setActiveProjectForFacultyReview(p)}
                onGenerateCertificate={(p) => setActiveProjectForCertificate(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab View 4: Leaderboard */}
      {viewTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold">Top Innovation Projects & High Impact Leaders</h3>
                <p className="text-xs text-purple-200">
                  Ranked by faculty evaluation rubric scores, milestone execution, and technical complexity.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects
                .slice()
                .sort((a, b) => b.innovationScore - a.innovationScore)
                .map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-8 w-8 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-200'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        #{idx + 1}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{p.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>Lead: {p.ownerName}</span>
                          <span>•</span>
                          <span>Dept: {p.department}</span>
                          <span>•</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">{p.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-black text-amber-500">{p.innovationScore}/100</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Innovation Score</div>
                      </div>

                      <button
                        onClick={() => setActiveProjectForDetail(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Render Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        currentUser={{ id: currentUser.id, name: currentUser.name, department: currentUser.department }}
        departments={departmentsList}
      />

      <SystemSchemaModal isOpen={isSchemaModalOpen} onClose={() => setIsSchemaModalOpen(false)} />

      {activeProjectForDetail && (
        <ProjectDetailModal
          isOpen={!!activeProjectForDetail}
          onClose={() => setActiveProjectForDetail(null)}
          project={activeProjectForDetail}
          currentUserRole={userRole}
          currentUserId={currentUser.id}
          currentUserName={currentUser.name}
          onUpdateProject={handleUpdateSingleProject}
          onOpenTeammateMatcher={(p) => setActiveProjectForMatcher(p)}
          onOpenFacultyReview={(p) => setActiveProjectForFacultyReview(p)}
          onOpenCertificate={(p) => setActiveProjectForCertificate(p)}
        />
      )}

      {activeProjectForMatcher && (
        <TeammateMatcherModal
          isOpen={!!activeProjectForMatcher}
          onClose={() => setActiveProjectForMatcher(null)}
          project={activeProjectForMatcher}
          candidateStudents={studentUsers}
          onInviteCandidate={handleInviteCandidate}
        />
      )}

      {activeProjectForFacultyReview && (
        <FacultyReviewModal
          isOpen={!!activeProjectForFacultyReview}
          onClose={() => setActiveProjectForFacultyReview(null)}
          project={activeProjectForFacultyReview}
          facultyUsers={facultyUsers}
          onSaveReview={handleSaveFacultyReview}
        />
      )}

      {activeProjectForCertificate && (
        <ProjectCertificateModal
          isOpen={!!activeProjectForCertificate}
          onClose={() => setActiveProjectForCertificate(null)}
          project={activeProjectForCertificate}
        />
      )}
    </div>
  );
};
