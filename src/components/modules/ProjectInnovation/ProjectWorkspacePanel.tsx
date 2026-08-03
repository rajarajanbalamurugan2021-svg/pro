import React, { useState } from 'react';
import { Project, ProjectTask, ProjectDocument } from '../../../types';
import {
  Folder,
  CheckSquare,
  FileText,
  MessageSquare,
  Upload,
  Plus,
  Send,
  ExternalLink,
  Github,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Video,
  Code2,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';

interface Props {
  projects: Project[];
  currentUser: { id: string; name: string; avatar?: string };
  onUpdateProject: (updatedProject: Project) => void;
}

export const ProjectWorkspacePanel: React.FC<Props> = ({
  projects,
  currentUser,
  onUpdateProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'kanban' | 'milestones' | 'documents' | 'chat' | 'final_submission'>('kanban');

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Kanban task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  // Document upload form
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<ProjectDocument['type']>('Proposal');
  const [docUrl, setDocUrl] = useState('');

  // Team chat form
  const [chatMessage, setChatMessage] = useState('');

  // Final submission form
  const [githubUrl, setGithubUrl] = useState(selectedProject?.githubRepo || '');
  const [demoLink, setDemoLink] = useState(selectedProject?.demoUrl || '');
  const [videoLink, setVideoLink] = useState('');
  const [submissionSummary, setSubmissionSummary] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(selectedProject?.stage === 'Completed');

  if (!selectedProject) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
        <Folder className="h-12 w-12 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No active projects available for workspace collaboration.</p>
      </div>
    );
  }

  // Pipeline stages
  const PIPELINE = [
    'Idea Submission',
    'Proposal Upload',
    'Faculty Review',
    'Approval',
    'Team Formation',
    'Development',
    'Testing',
    'Final Submission',
    'Evaluation',
    'Completed'
  ];

  const currentStageIndex = PIPELINE.indexOf(selectedProject.stage) !== -1 ? PIPELINE.indexOf(selectedProject.stage) : 5;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const assignee = selectedProject.members.find((m) => m.userId === newTaskAssignee) || selectedProject.members[0];

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: 'Workspace sprint deliverable task',
      assignedTo: assignee ? assignee.userId : currentUser.id,
      assignedToName: assignee ? assignee.name : currentUser.name,
      status: 'To Do',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    };

    onUpdateProject({
      ...selectedProject,
      tasks: [...selectedProject.tasks, newTask],
      updatedAt: new Date().toISOString().split('T')[0]
    });

    setNewTaskTitle('');
  };

  const handleMoveTask = (taskId: string, newStatus: ProjectTask['status']) => {
    const updatedTasks = selectedProject.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    onUpdateProject({ ...selectedProject, tasks: updatedTasks });
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = selectedProject.milestones.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m));
    onUpdateProject({ ...selectedProject, milestones: updatedMilestones });
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: ProjectDocument = {
      id: `doc-${Date.now()}`,
      name: docName,
      type: docType,
      url: docUrl || '#',
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: '2.8 MB'
    };

    onUpdateProject({
      ...selectedProject,
      documents: [...selectedProject.documents, newDoc]
    });

    setDocName('');
    setDocUrl('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onUpdateProject({
      ...selectedProject,
      chatMessages: [...selectedProject.chatMessages, newMsg]
    });

    setChatMessage('');
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProject({
      ...selectedProject,
      githubRepo: githubUrl,
      demoUrl: demoLink,
      stage: 'Evaluation',
      status: 'Approved',
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header & Project Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
            Active Project Collaboration Workspace
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">{selectedProject.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 shrink-0">Switch Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stage Tracker Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-white space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Capstone Milestone Pipeline Progress</span>
          <span className="text-amber-400 font-extrabold">Stage: {selectedProject.stage}</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {PIPELINE.map((stg, idx) => {
            const isDone = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stg} className="flex items-center gap-1 shrink-0">
                <div
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-lg'
                      : isDone
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {idx + 1}. {stg}
                </div>
                {idx < PIPELINE.length - 1 && <div className={`h-0.5 w-2 ${isDone ? 'bg-blue-500' : 'bg-slate-800'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workspace Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'kanban'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckSquare className="h-4 w-4" /> Kanban Tasks ({selectedProject.tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'milestones'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" /> Milestones & Weekly Reports
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'documents'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" /> File Sharing & Deliverables ({selectedProject.documents.length})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="h-4 w-4" /> Team Chat ({selectedProject.chatMessages.length})
        </button>

        <button
          onClick={() => setActiveTab('final_submission')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'final_submission'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="h-4 w-4" /> Final Project Submission
        </button>
      </div>

      {/* Tab 1: Kanban Board */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <form onSubmit={handleAddTask} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task name e.g. Implement WebSocket API endpoint"
              className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
            />
            <select
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
            >
              <option value="">Select Assignee</option>
              {selectedProject.members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Task
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['To Do', 'In Progress', 'Completed'] as const).map((statusCol) => {
              const colTasks = selectedProject.tasks.filter((t) => t.status === statusCol);
              return (
                <div key={statusCol} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 min-h-[250px]">
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500">
                    <span>{statusCol}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px]">
                      {colTasks.length}
                    </span>
                  </div>

                  {colTasks.map((tk) => (
                    <div key={tk.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{tk.title}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Assignee: {tk.assignedToName}</span>
                        <span className="font-extrabold text-amber-500">{tk.priority}</span>
                      </div>

                      <div className="flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                        {statusCol !== 'To Do' && (
                          <button
                            onClick={() => handleMoveTask(tk.id, 'To Do')}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                          >
                            To Do
                          </button>
                        )}
                        {statusCol !== 'In Progress' && (
                          <button
                            onClick={() => handleMoveTask(tk.id, 'In Progress')}
                            className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950 hover:bg-blue-200 text-blue-700 dark:text-blue-300"
                          >
                            In Progress
                          </button>
                        )}
                        {statusCol !== 'Completed' && (
                          <button
                            onClick={() => handleMoveTask(tk.id, 'Completed')}
                            className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 text-emerald-700 dark:text-emerald-300 font-bold"
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

      {/* Tab 2: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" /> Milestone Checkpoints & Deliverables
          </h3>

          <div className="space-y-3">
            {selectedProject.milestones.map((ms) => (
              <div
                key={ms.id}
                onClick={() => handleToggleMilestone(ms.id)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                  ms.completed
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-6 w-6 rounded-lg border flex items-center justify-center font-bold text-xs ${
                      ms.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {ms.completed && '✓'}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${ms.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {ms.title}
                    </div>
                    <div className="text-[11px] text-slate-400">{ms.description}</div>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-slate-400">Due: {ms.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Documents Upload */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <form onSubmit={handleAddDocument} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-blue-500" /> Upload Project Document / File Asset
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Document Title (e.g. System_Architecture.pdf)"
                className="sm:col-span-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              >
                <option value="Proposal">Proposal</option>
                <option value="Report">Report</option>
                <option value="Presentation">Presentation</option>
                <option value="SourceCode">Source Code Link</option>
                <option value="Document">Document</option>
              </select>
            </div>

            <div className="flex gap-3">
              <input
                type="url"
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="Cloud Storage URL (Optional)"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl">
                Upload File
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {selectedProject.documents.map((d) => (
              <div key={d.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{d.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {d.type} • Uploaded by {d.uploadedBy} on {d.uploadedAt}
                    </div>
                  </div>
                </div>

                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Team Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="h-[300px] overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {selectedProject.chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2.5">
                <img src={msg.senderAvatar} alt={msg.senderName} className="h-7 w-7 rounded-full object-cover" />
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs max-w-[80%]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-[11px]">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Send message to project team..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1">
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Final Project Submission Engine */}
      {activeTab === 'final_submission' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-500" /> Final Project Deliverables Submission Portal
            </h3>
            {isSubmitted && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Submitted for Evaluation
              </span>
            )}
          </div>

          <form onSubmit={handleFinalSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Source Code GitHub Repository URL *</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  required
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/organization/project-repo"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Live Application / Demo URL</label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={demoLink}
                    onChange={(e) => setDemoLink(e.target.value)}
                    placeholder="https://my-capstone-demo.app"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Demonstration Video Link (YouTube / Drive)</label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="url"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Executive Summary & Key Features</label>
              <textarea
                rows={3}
                value={submissionSummary}
                onChange={(e) => setSubmissionSummary(e.target.value)}
                placeholder="Highlight key engineering accomplishments, novel algorithms, and performance metrics..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-lg flex items-center justify-center gap-2"
            >
              <Award className="h-4 w-4" /> Submit Final Project Deliverables for Evaluation
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
