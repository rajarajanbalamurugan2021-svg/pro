import React, { useState } from 'react';
import { Project, UserRole, ProjectStage, ProjectTask, ProjectMilestone, ProjectDocument } from '../../../types';
import {
  X,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Github,
  ExternalLink,
  FileText,
  Upload,
  MessageSquare,
  Plus,
  Send,
  Award,
  QrCode,
  ShieldAlert,
  Calendar,
  Check,
  Trash2,
  UserPlus,
  BarChart2
} from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currentUserRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onUpdateProject: (updatedProject: Project) => void;
  onOpenTeammateMatcher?: (project: Project) => void;
  onOpenFacultyReview?: (project: Project) => void;
  onOpenCertificate?: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUserRole,
  currentUserId,
  currentUserName,
  onUpdateProject,
  onOpenTeammateMatcher,
  onOpenFacultyReview,
  onOpenCertificate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'documents' | 'chat' | 'reviews'>('overview');
  
  // New task input state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(project.members[0]?.userId || currentUserId);
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Document upload state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<ProjectDocument['type']>('Proposal');
  const [docUrl, setDocUrl] = useState('');

  // Chat message input state
  const [chatInput, setChatInput] = useState('');

  if (!isOpen || !project) return null;

  const STAGES: ProjectStage[] = [
    'Idea Submission',
    'Proposal Upload',
    'Faculty Review',
    'Approval',
    'Team Formation',
    'Development',
    'Testing',
    'Documentation',
    'Final Submission',
    'Evaluation',
    'Completed'
  ];

  const currentStageIndex = STAGES.indexOf(project.stage);

  // Toggle milestone completion
  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            completed: !m.completed,
            completedAt: !m.completed ? new Date().toISOString().split('T')[0] : undefined
          }
        : m
    );

    onUpdateProject({
      ...project,
      milestones: updatedMilestones,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assigneeMember = project.members.find((m) => m.userId === newTaskAssignee);
    const newTask: ProjectTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle,
      description: 'Task assigned for active sprint.',
      assignedTo: newTaskAssignee,
      assignedToName: assigneeMember?.name || currentUserName,
      status: 'To Do',
      priority: newTaskPriority,
      dueDate: '2026-08-15'
    };

    onUpdateProject({
      ...project,
      tasks: [...project.tasks, newTask],
      updatedAt: new Date().toISOString().split('T')[0]
    });

    setNewTaskTitle('');
  };

  // Move Task Status
  const handleMoveTaskStatus = (taskId: string, newStatus: ProjectTask['status']) => {
    const updatedTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );

    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  // Add Document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: ProjectDocument = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: docType,
      url: docUrl || '#',
      uploadedBy: currentUserName,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: '3.2 MB'
    };

    onUpdateProject({
      ...project,
      documents: [...project.documents, newDoc],
      updatedAt: new Date().toISOString().split('T')[0]
    });

    setDocName('');
    setDocUrl('');
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `chat-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateProject({
      ...project,
      chatMessages: [...project.chatMessages, newMsg]
    });

    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {project.category}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white">
                {project.status}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Stage: {project.stage}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTeammateMatcher && (
              <button
                onClick={() => onOpenTeammateMatcher(project)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" /> AI Match Teammate
              </button>
            )}

            {onOpenFacultyReview && (currentUserRole === 'faculty' || currentUserRole === 'admin') && (
              <button
                onClick={() => onOpenFacultyReview(project)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="h-3.5 w-3.5" /> Faculty Review
              </button>
            )}

            {project.stage === 'Completed' && onOpenCertificate && (
              <button
                onClick={() => onOpenCertificate(project)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Award className="h-3.5 w-3.5" /> Certificate
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Workflow Stage Tracker Progress Bar */}
        <div className="px-6 py-3 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
            <span>Project Innovation Workflow Pipeline</span>
            <span className="text-amber-400">Step {currentStageIndex + 1} of {STAGES.length}: {project.stage}</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {STAGES.map((stg, index) => {
              const isPassed = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;

              return (
                <div key={stg} className="flex items-center gap-1 shrink-0">
                  <div
                    className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                        : isPassed
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {index + 1}. {stg}
                  </div>
                  {index < STAGES.length - 1 && (
                    <div className={`h-0.5 w-2 ${isPassed ? 'bg-blue-500' : 'bg-slate-800'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview & Milestones
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Kanban Board ({project.tasks.length})
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Documents ({project.documents.length})
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Team Chat ({project.chatMessages.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Faculty Feedback ({project.reviews.length})
          </button>
        </div>

        {/* Modal Main Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Abstract */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Abstract & Problem Statement
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {project.abstract}
                </p>
              </div>

              {/* Repos & Demos */}
              <div className="flex flex-wrap gap-3">
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                  >
                    <Github className="h-4 w-4" /> GitHub Repository
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo URL
                  </a>
                )}
              </div>

              {/* Team Roster */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Project Team Roster ({project.members.length}/{project.maxTeamSize})
                  </h3>
                  {onOpenTeammateMatcher && project.members.length < project.maxTeamSize && (
                    <button
                      onClick={() => onOpenTeammateMatcher(project)}
                      className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <UserPlus className="h-3.5 w-3.5" /> Recruit Teammates
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.members.map((m) => (
                    <div
                      key={m.userId}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center gap-3"
                    >
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{m.name}</div>
                        <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">{m.role}</div>
                        <div className="text-[10px] text-slate-400">{m.department}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Milestones & Deliverables Tracker
                </h3>

                <div className="space-y-2">
                  {project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        m.completed
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                            m.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {m.completed && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${m.completed ? 'line-through text-slate-500' : ''}`}>
                            {m.title}
                          </div>
                          <div className="text-[10px] text-slate-400">{m.description}</div>
                        </div>
                      </div>

                      <div className="text-[10px] font-semibold text-slate-400 shrink-0">
                        Due: {m.dueDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Kanban Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Create Task Form */}
              <form onSubmit={handleAddTask} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title (e.g. Implement REST API authorization)"
                  className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
                />
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
                >
                  {project.members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Task
                </button>
              </form>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['To Do', 'In Progress', 'Completed'] as const).map((colStatus) => {
                  const filtered = project.tasks.filter((t) => t.status === colStatus);
                  return (
                    <div
                      key={colStatus}
                      className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 min-h-[220px]"
                    >
                      <div className="text-xs font-bold uppercase text-slate-500 flex items-center justify-between">
                        <span>{colStatus}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px]">
                          {filtered.length}
                        </span>
                      </div>

                      {filtered.map((t) => (
                        <div
                          key={t.id}
                          className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Assignee: {t.assignedToName}</span>
                            <span className="font-bold text-amber-500">{t.priority}</span>
                          </div>

                          {/* Quick move status */}
                          <div className="flex items-center gap-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                            {colStatus !== 'To Do' && (
                              <button
                                onClick={() => handleMoveTaskStatus(t.id, 'To Do')}
                                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                              >
                                ← To Do
                              </button>
                            )}
                            {colStatus !== 'In Progress' && (
                              <button
                                onClick={() => handleMoveTaskStatus(t.id, 'In Progress')}
                                className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200"
                              >
                                In Progress
                              </button>
                            )}
                            {colStatus !== 'Completed' && (
                              <button
                                onClick={() => handleMoveTaskStatus(t.id, 'Completed')}
                                className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                              >
                                Done ✓
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <form onSubmit={handleAddDocument} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-blue-500" /> Upload Project Document / Presentation
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Document Title (e.g. System_Design.pdf)"
                    className="sm:col-span-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
                  />
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
                  >
                    <option value="Proposal">Proposal</option>
                    <option value="Report">Report</option>
                    <option value="Presentation">Presentation</option>
                    <option value="SourceCode">SourceCode Link</option>
                    <option value="Document">Document</option>
                  </select>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="url"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="Document URL / Cloud Link (Optional)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    Upload File
                  </button>
                </div>
              </form>

              {/* Documents List */}
              <div className="space-y-2">
                {project.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {doc.type} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt} ({doc.size})
                        </div>
                      </div>
                    </div>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open File
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-4 flex flex-col h-[320px]">
              <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                {project.chatMessages.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">
                    No team messages yet. Send a note to coordinate tasks!
                  </p>
                ) : (
                  project.chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <img src={msg.senderAvatar} alt={msg.senderName} className="h-8 w-8 rounded-full object-cover" />
                      <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 max-w-[80%]">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-bold text-slate-900 dark:text-white">{msg.senderName}</span>
                          <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type message to team..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </form>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {project.reviews.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <ShieldAlert className="h-8 w-8 text-amber-500 mx-auto" />
                  <p className="text-xs text-slate-500">No faculty evaluations recorded yet.</p>
                </div>
              ) : (
                project.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{rev.facultyName}</div>
                        <div className="text-[10px] text-slate-400">Reviewed on {rev.reviewedAt}</div>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-amber-100 text-amber-800">
                        {rev.decision} ({rev.overallScore}/100)
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg">
                      "{rev.comments}"
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">Innovation: {rev.innovationGrade}/10</div>
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">Technical: {rev.technicalGrade}/10</div>
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800">Presentation: {rev.presentationGrade}/10</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
