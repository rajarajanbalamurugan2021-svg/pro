import React, { useState } from 'react';
import { Complaint, UserRole, ComplaintTimelineEntry } from '../../../types';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  UserCheck,
  Phone,
  Sparkles,
  Star,
  MessageSquare,
  Upload,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Tag,
  Wrench,
  ChevronRight,
  FileText
} from 'lucide-react';
import { callAIChatbot } from '../../../services/api';

interface ComplaintDetailModalProps {
  complaint: Complaint;
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    newStatus: Complaint['status'],
    notes?: string,
    completionImages?: string[]
  ) => void;
  onAssignStaff?: (id: string, staffId: string, staffName: string, staffPhone?: string) => void;
  onStudentFeedback?: (id: string, rating: number, feedback: string) => void;
  onReopen?: (id: string, reason: string) => void;
  availableStaff?: { id: string; name: string; phone: string; department: string }[];
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  userRole,
  currentUserId,
  currentUserName,
  onClose,
  onUpdateStatus,
  onAssignStaff,
  onStudentFeedback,
  onReopen,
  availableStaff = []
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState(complaint.assignedTo || '');
  const [maintNote, setMaintNote] = useState('');
  const [completionPhotoUrl, setCompletionPhotoUrl] = useState('');
  const [completionPhotos, setCompletionPhotos] = useState<string[]>(complaint.completionImages || []);
  
  // Feedback state
  const [rating, setRating] = useState<number>(complaint.rating || 5);
  const [feedbackText, setFeedbackText] = useState(complaint.feedback || '');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(Boolean(complaint.rating));

  // Reopen state
  const [showReopenInput, setShowReopenInput] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  // AI Guidance
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const workflowSteps: Complaint['status'][] = [
    'New Complaint',
    'Assigned',
    'In Progress',
    'Waiting for Parts',
    'Completed',
    'Approved',
    'Resolved'
  ];

  const getStepIndex = (status: Complaint['status']) => {
    if (status === 'Pending') return 0;
    if (status === 'Reopened') return 2; // Treat reopened as in progress level
    if (status === 'Rejected') return -1;
    const idx = workflowSteps.indexOf(status);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIndex = getStepIndex(complaint.status);

  const handleAddCompletionPhoto = () => {
    if (completionPhotoUrl.trim()) {
      setCompletionPhotos((prev) => [...prev, completionPhotoUrl.trim()]);
      setCompletionPhotoUrl('');
    }
  };

  const handleStatusChange = (newStatus: Complaint['status']) => {
    onUpdateStatus(complaint.id, newStatus, maintNote, completionPhotos);
    setMaintNote('');
  };

  const handleAssign = () => {
    if (!selectedStaffId || !onAssignStaff) return;
    const staffObj = availableStaff.find((s) => s.id === selectedStaffId);
    if (staffObj) {
      onAssignStaff(complaint.id, staffObj.id, staffObj.name, staffObj.phone);
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (onStudentFeedback) {
      onStudentFeedback(complaint.id, rating, feedbackText);
      setFeedbackSubmitted(true);
    }
  };

  const handleConfirmReopen = () => {
    if (onReopen && reopenReason.trim()) {
      onReopen(complaint.id, reopenReason.trim());
      setShowReopenInput(false);
      setReopenReason('');
    }
  };

  const handleFetchAiGuidance = async () => {
    setLoadingAi(true);
    try {
      const prompt = `As Campus AI Engineer, provide a 3-bullet action plan and safety protocol for resolving this campus grievance:
Title: ${complaint.title}
Category: ${complaint.category}
Description: ${complaint.description}
Location: ${complaint.blockName}, ${complaint.floor}, ${complaint.roomNumber}`;

      const res = await callAIChatbot([{ role: 'user', content: prompt }], {
        name: currentUserName,
        role: userRole,
        department: complaint.department
      });
      setAiAdvice(res.reply);
    } catch (e) {
      setAiAdvice('AI Assistant temporarily unavailable. Follow standard campus safety and dispatch procedures.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {complaint.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {complaint.category}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold ${
                  complaint.priority === 'Critical' || complaint.priority === 'High'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {complaint.priority} Priority
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
              {complaint.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>Reported by <strong>{complaint.studentName}</strong></span>
              <span>•</span>
              <span>{complaint.department}</span>
              <span>•</span>
              <span>{complaint.createdAt}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Progress Timeline Tracker */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" /> Workflow & Progress Timeline
            </h3>

            <div className="hidden sm:flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0"></div>
              {workflowSteps.map((stepName, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={stepName} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 scale-110 shadow-lg'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-2 text-center max-w-[70px] leading-tight ${
                        isCurrent
                          ? 'text-blue-600 dark:text-blue-400'
                          : isPassed
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {stepName}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Timeline List */}
            <div className="sm:hidden space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Current Status:</span>
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold">
                  {complaint.status}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Issue Details & Assignment Column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column (2 cols) */}
            <div className="md:col-span-2 space-y-5">
              
              {/* Description */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Detailed Complaint Description
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Block Name</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3.5 w-3.5 text-blue-500" />
                    {complaint.blockName || 'Main Academic Block'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Floor</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    {complaint.floor || '2nd Floor'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Room / Lab</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
                    <Tag className="h-3.5 w-3.5 text-purple-500" />
                    {complaint.roomNumber || 'Room 204'}
                  </span>
                </div>
              </div>

              {/* Evidence Images */}
              {((complaint.imageUrls && complaint.imageUrls.length > 0) || complaint.imageUrl) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Student Evidence Images
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {(complaint.imageUrls || [complaint.imageUrl!]).map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative h-28 w-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100"
                      >
                        <img
                          src={url}
                          alt={`Evidence ${i + 1}`}
                          className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                          View Full Size
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance Completion Images */}
              {complaint.completionImages && complaint.completionImages.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Completion Proof Photos (By Maintenance)
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {complaint.completionImages.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative h-24 w-24 rounded-2xl overflow-hidden border border-emerald-300 dark:border-emerald-700"
                      >
                        <img src={url} alt={`Completion ${i + 1}`} className="h-full w-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance Notes */}
              {complaint.maintenanceNotes && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                    <Wrench className="h-4 w-4" /> Maintenance Work Notes
                  </h4>
                  <p className="text-xs text-indigo-950 dark:text-indigo-200 font-medium">
                    {complaint.maintenanceNotes}
                  </p>
                </div>
              )}

              {/* AI Guidance Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-blue-900/10 border border-purple-200 dark:border-purple-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                    Campus AI Resolution Copilot
                  </span>
                  {!aiAdvice && (
                    <button
                      onClick={handleFetchAiGuidance}
                      disabled={loadingAi}
                      className="px-3 py-1 rounded-xl bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 transition"
                    >
                      {loadingAi ? 'Analyzing...' : 'Generate AI Fix Plan'}
                    </button>
                  )}
                </div>

                {aiAdvice ? (
                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {aiAdvice}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Click to request AI diagnosis, step-by-step resolution advice, and equipment safety checks.
                  </p>
                )}
              </div>

            </div>

            {/* Right Column: Assignment & Actions */}
            <div className="space-y-5">
              
              {/* Staff Assignment Box */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Technician
                </h4>

                {complaint.assignedStaffName ? (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-emerald-500" />
                      {complaint.assignedStaffName}
                    </div>
                    {complaint.assignedStaffPhone && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {complaint.assignedStaffPhone}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 font-semibold italic">Unassigned</p>
                )}

                {/* HOD / Admin Assignment Control */}
                {(userRole === 'department_head' || userRole === 'admin' || userRole === 'super_admin') && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 block">
                      Assign / Reassign Staff
                    </label>
                    <select
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <option value="">Select Staff Member...</option>
                      {availableStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} ({staff.department})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleAssign}
                      disabled={!selectedStaffId}
                      className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 transition"
                    >
                      Confirm Assignment
                    </button>
                  </div>
                )}
              </div>

              {/* Maintenance Staff Progress Actions */}
              {(userRole === 'maintenance_staff' || userRole === 'admin' || userRole === 'super_admin' || userRole === 'department_head') && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Update Progress Status
                  </h4>

                  <textarea
                    value={maintNote}
                    onChange={(e) => setMaintNote(e.target.value)}
                    placeholder="Enter work updates or resolution notes..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />

                  {/* Upload Completion Image */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={completionPhotoUrl}
                      onChange={(e) => setCompletionPhotoUrl(e.target.value)}
                      placeholder="Completion photo image URL..."
                      className="flex-1 text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      onClick={handleAddCompletionPhoto}
                      className="px-3 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleStatusChange('In Progress')}
                      className="py-2 px-2 rounded-xl bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange('Waiting for Parts')}
                      className="py-2 px-2 rounded-xl bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition"
                    >
                      Waiting Parts
                    </button>
                    <button
                      onClick={() => handleStatusChange('Completed')}
                      className="py-2 px-2 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => handleStatusChange('Resolved')}
                      className="py-2 px-2 rounded-xl bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-700 transition"
                    >
                      Approve & Resolve
                    </button>
                  </div>
                </div>
              )}

              {/* Student Feedback or Reopen Action */}
              {(userRole === 'student' || currentUserId === complaint.reportedBy) && (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Student Actions & Feedback
                  </h4>

                  {(complaint.status === 'Completed' || complaint.status === 'Resolved' || complaint.status === 'Approved') ? (
                    <div>
                      {feedbackSubmitted ? (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Feedback Submitted
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= (complaint.rating || rating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          {complaint.feedback && <p className="italic text-[11px]">"{complaint.feedback}"</p>}
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitFeedback} className="space-y-3">
                          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                            Rate Resolution Quality
                          </label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                type="button"
                                key={s}
                                onClick={() => setRating(s)}
                                className="p-1 hover:scale-125 transition"
                              >
                                <Star
                                  className={`h-5 w-5 ${
                                    s <= rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Share feedback on resolution quality..."
                            rows={2}
                            className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          />

                          <button
                            type="submit"
                            className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      )}

                      {/* Reopen Button */}
                      {!showReopenInput ? (
                        <button
                          onClick={() => setShowReopenInput(true)}
                          className="w-full mt-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-200 transition flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reopen Complaint
                        </button>
                      ) : (
                        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-2">
                          <span className="text-xs font-bold text-rose-800 dark:text-rose-200 block">
                            Reason for Reopening:
                          </span>
                          <textarea
                            value={reopenReason}
                            onChange={(e) => setReopenReason(e.target.value)}
                            placeholder="Explain why issue is still unresolved..."
                            rows={2}
                            className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-900 border border-rose-300"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleConfirmReopen}
                              disabled={!reopenReason.trim()}
                              className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold disabled:opacity-40"
                            >
                              Confirm Reopen
                            </button>
                            <button
                              onClick={() => setShowReopenInput(false)}
                              className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Tracking active. Feedback and rating unlocked once maintenance completes work.
                    </p>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* Timeline Logs Audit trail */}
          {complaint.timeline && complaint.timeline.length > 0 && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-500" /> History & Audit Logs
              </h4>

              <div className="space-y-2">
                {complaint.timeline.map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {entry.status}
                      </span>
                      <span className="text-slate-400 ml-2">by {entry.updatedBy}</span>
                      {entry.note && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          "{entry.note}"
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{entry.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
