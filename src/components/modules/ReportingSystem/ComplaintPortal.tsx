import React, { useState } from 'react';
import { Complaint, UserRole } from '../../../types';
import {
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Upload,
  UserCheck,
  Tag,
  BarChart2,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import { callAIClassifyComplaint } from '../../../services/api';

interface ComplaintPortalProps {
  complaints: Complaint[];
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onAddComplaint: (complaint: Complaint) => void;
  onUpdateComplaintStatus: (id: string, status: Complaint['status'], assignedTo?: string) => void;
}

export const ComplaintPortal: React.FC<ComplaintPortalProps> = ({
  complaints,
  userRole,
  currentUserId,
  currentUserName,
  onAddComplaint,
  onUpdateComplaintStatus
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // New Complaint Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Complaint['category']>('Infrastructure');
  const [imageUrl, setImageUrl] = useState('');
  const [classifying, setClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  const handleClassifyAI = async () => {
    if (!title || !description) return;
    setClassifying(true);
    const data = await callAIClassifyComplaint(title, description);
    setAiResult(data);
    if (data.category) setCategory(data.category);
    setClassifying(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newComp: Complaint = {
      id: `comp-${Date.now()}`,
      title,
      description,
      category: aiResult?.category || category,
      priority: aiResult?.priority || 'Medium',
      status: 'Pending',
      reportedBy: currentUserId,
      studentName: currentUserName,
      department: 'Computer Science & Engineering',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      aiSuggestedDepartment: aiResult?.suggestedDept
    };

    onAddComplaint(newComp);
    setShowNewModal(false);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setAiResult(null);
  };

  const filtered = complaints.filter((c) => {
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    return true;
  });

  const statusBadges: Record<Complaint['status'], { bg: string; text: string; icon: any }> = {
    'Pending': { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300', text: 'Pending Review', icon: Clock },
    'In Progress': { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300', text: 'In Progress', icon: Sparkles },
    'Resolved': { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300', text: 'Resolved', icon: CheckCircle2 },
    'Rejected': { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300', text: 'Rejected', icon: XCircle }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-lg shadow-amber-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-200">
            <AlertCircle className="h-4 w-4" /> Smart Grievance & Facility Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Campus Complaint & Resolution System
          </h1>
          <p className="text-sm text-amber-100 mt-1 max-w-xl">
            Report maintenance issues, track real-time resolution status, and auto-classify complaints via Gemini AI.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-amber-800 text-xs font-extrabold hover:bg-amber-50 transition shadow-md"
        >
          <Plus className="h-4 w-4" /> File New Grievance
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-500 font-semibold">Total Complaints Filed</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {complaints.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-amber-600 font-semibold">Pending Review</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {complaints.filter(c => c.status === 'Pending').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-blue-600 font-semibold">In Progress</span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {complaints.filter(c => c.status === 'In Progress').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-emerald-600 font-semibold">Successfully Resolved</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {complaints.filter(c => c.status === 'Resolved').length}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          {['All', 'Infrastructure', 'Hostel', 'Academic', 'IT & Wi-Fi', 'Library', 'Transport'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full transition ${
                filterCategory === cat
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaint Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comp) => {
          const Badge = statusBadges[comp.status];
          const Icon = Badge.icon;
          return (
            <div
              key={comp.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${Badge.bg}`}>
                    <Icon className="h-3.5 w-3.5" /> {Badge.text}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{comp.createdAt}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {comp.description}
                </p>

                {comp.imageUrl && (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={comp.imageUrl} alt={comp.title} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-500">Reported by <span className="font-semibold text-slate-800 dark:text-slate-200">{comp.studentName}</span></div>
                  {comp.aiSuggestedDepartment && (
                    <div className="text-[10px] text-purple-600 dark:text-purple-400 flex items-center gap-1 font-semibold">
                      <Sparkles className="h-3 w-3" /> AI Route: {comp.aiSuggestedDepartment}
                    </div>
                  )}
                </div>

                {/* Status Updater for Admin / Faculty */}
                {(userRole === 'admin' || userRole === 'super_admin' || userRole === 'faculty') && (
                  <div className="flex items-center gap-1">
                    <select
                      value={comp.status}
                      onChange={(e) => onUpdateComplaintStatus(comp.id, e.target.value as Complaint['status'])}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold py-1 px-2 text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="Pending">Set Pending</option>
                      <option value="In Progress">Set In Progress</option>
                      <option value="Resolved">Set Resolved</option>
                      <option value="Rejected">Set Rejected</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FILE NEW COMPLAINT MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" /> Lodge Campus Complaint
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken AC unit in Central Library Room 204"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise location, time noticed, and severity..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* AI Auto-classifier trigger */}
              <button
                type="button"
                onClick={handleClassifyAI}
                disabled={classifying || !title || !description}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-200 transition"
              >
                <Sparkles className="h-4 w-4" />
                {classifying ? 'AI Analyzing Priority & Department...' : 'Auto-Classify with AI'}
              </button>

              {aiResult && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                  <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between">
                    <span>Suggested Priority: {aiResult.priority}</span>
                    <span className="text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded font-mono">
                      {aiResult.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">{aiResult.aiAnalysis}</p>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category Selection
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Academic">Academic</option>
                  <option value="IT & Wi-Fi">IT & Wi-Fi</option>
                  <option value="Library">Library</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Image Attachment URL (Optional)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
