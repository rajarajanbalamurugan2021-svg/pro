import React, { useState } from 'react';
import { AcademicRequest, User, CommunicationCategory, RequestPriority, RequestStatus } from '../../../types';
import {
  HelpCircle,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  Search,
  MessageSquare,
  UserCheck2,
  Send,
  Building2,
  Download,
  X
} from 'lucide-react';

interface AcademicRequestsViewProps {
  requests: AcademicRequest[];
  currentUser: User;
  facultyUsers: User[];
  onCreateRequest: (data: any) => void;
  onUpdateStatus: (reqId: string, status: RequestStatus, note?: string) => void;
  onStartChatFromRequest: (req: AcademicRequest) => void;
}

export const AcademicRequestsView: React.FC<AcademicRequestsViewProps> = ({
  requests,
  currentUser,
  facultyUsers,
  onCreateRequest,
  onUpdateStatus,
  onStartChatFromRequest
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | RequestStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | RequestPriority>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<AcademicRequest | null>(null);
  const [responseNote, setResponseNote] = useState('');

  // Form State
  const [facultyId, setFacultyId] = useState(facultyUsers[0]?.id || '');
  const [category, setCategory] = useState<CommunicationCategory>('Academic Doubt');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('MEDIUM');

  const filtered = requests.filter(r => {
    if (currentUser.role === 'student' && r.studentId !== currentUser.id) return false;
    if (currentUser.role === 'faculty' && r.facultyId !== currentUser.id) return false;

    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchSubject = r.subject.toLowerCase().includes(q);
      const matchTopic = (r.topic || '').toLowerCase().includes(q);
      const matchStudent = r.studentName.toLowerCase().includes(q);
      const matchFaculty = r.facultyName.toLowerCase().includes(q);
      if (!matchSubject && !matchTopic && !matchStudent && !matchFaculty) return false;
    }

    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId || !subject || !message) return;

    const faculty = facultyUsers.find(f => f.id === facultyId);

    onCreateRequest({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentDepartment: currentUser.department,
      studentRoll: currentUser.rollNumber || currentUser.registerNo,
      facultyId,
      facultyName: faculty?.name || 'Faculty Member',
      facultyDepartment: faculty?.department,
      category,
      subject,
      topic,
      message,
      priority,
      status: 'OPEN'
    });

    setIsModalOpen(false);
    setSubject('');
    setTopic('');
    setMessage('');
  };

  const priorityColor = (p: RequestPriority) => {
    switch (p) {
      case 'URGENT': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'HIGH': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const statusBadge = (s: RequestStatus) => {
    switch (s) {
      case 'OPEN': return <span className="px-2.5 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">Open</span>;
      case 'IN_PROGRESS': return <span className="px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">In Progress</span>;
      case 'RESOLVED': return <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">Resolved</span>;
      case 'CLOSED': return <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold">Closed</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-black flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-yellow-300" />
            <span>Academic Requests & Doubts Portal</span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-100">
            Submit formal queries regarding doubts, attendance adjustments, GATE preparation, and project guidance.
          </p>
        </div>

        {currentUser.role === 'student' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white text-blue-600 font-extrabold hover:bg-blue-50 transition shadow-lg shrink-0 flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Academic Request</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search request by topic, subject, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Grid of Academic Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 space-y-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <FileText className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
            <p className="text-sm font-bold">No academic requests found</p>
            <p className="text-xs text-slate-400">There are no pending requests matching the selected filter criteria.</p>
          </div>
        ) : (
          filtered.map(req => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-blue-500/50 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-1 text-[10px] rounded-full font-black uppercase tracking-wider ${priorityColor(req.priority)}`}>
                    {req.priority} Priority
                  </span>
                  {statusBadge(req.status)}
                </div>

                <div>
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    {req.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {req.subject}
                  </h3>
                  {req.topic && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Topic: {req.topic}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  "{req.message}"
                </p>

                {req.responseNote && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-200 text-xs space-y-1">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">Faculty Response:</p>
                    <p>{req.responseNote}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-slate-200">
                    {currentUser.role === 'student' ? `Faculty: ${req.facultyName}` : `Student: ${req.studentName}`}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Submitted: {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveRequest(req)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition"
                    title="View Request Details"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onStartChatFromRequest(req)}
                    className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                    title="Start Direct Chat Thread"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: New Academic Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-500" />
                Submit New Academic Request
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Target Faculty Member</label>
                <select
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {facultyUsers.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Academic Doubt">Academic Doubt</option>
                    <option value="Attendance Query">Attendance Query</option>
                    <option value="Assignment Query">Assignment Query</option>
                    <option value="GATE Guidance">GATE Guidance</option>
                    <option value="Project Guidance">Project Guidance</option>
                    <option value="Career Guidance">Career Guidance</option>
                    <option value="Internship Guidance">Internship Guidance</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Course / Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Design & Analysis of Algorithms"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Specific Topic / Question Title</label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic Programming Knapsack Problem"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Detailed Message</label>
                <textarea
                  rows={3}
                  placeholder="Describe your doubt, request or clarification in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View & Update Request */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Details</h3>
              <button onClick={() => setActiveRequest(null)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>{activeRequest.subject}</span>
                  {statusBadge(activeRequest.status)}
                </div>
                <p className="text-slate-600 dark:text-slate-300">{activeRequest.message}</p>
              </div>

              {currentUser.role === 'faculty' && (
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <label className="font-bold block text-slate-900 dark:text-white">Faculty Status Update & Feedback</label>
                  <textarea
                    rows={2}
                    placeholder="Provide response, instructions, or resolution notes..."
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onUpdateStatus(activeRequest.id, 'IN_PROGRESS', responseNote);
                        setActiveRequest(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 text-xs"
                    >
                      Set In Progress
                    </button>
                    <button
                      onClick={() => {
                        onUpdateStatus(activeRequest.id, 'RESOLVED', responseNote);
                        setActiveRequest(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
