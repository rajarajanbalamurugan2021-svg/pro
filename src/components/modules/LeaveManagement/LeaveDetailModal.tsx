import React, { useState } from 'react';
import { LeaveRequest, User } from '../../../types';
import { printLeaveLetter } from '../../../utils/leaveUtils';
import { 
  X, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Printer, 
  Download, 
  Paperclip, 
  MessageSquare, 
  UserCheck, 
  AlertTriangle,
  User as UserIcon,
  ShieldCheck,
  Send
} from 'lucide-react';

interface LeaveDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveRequest | null;
  currentUser: User;
  onUpdateLeaveStatus: (
    leaveId: string, 
    newStatus: LeaveRequest['status'], 
    remarks?: string, 
    actionRole?: string
  ) => void;
  onDeleteOrCancelLeave?: (leaveId: string) => void;
}

export const LeaveDetailModal: React.FC<LeaveDetailModalProps> = ({
  isOpen,
  onClose,
  leave,
  currentUser,
  onUpdateLeaveStatus,
  onDeleteOrCancelLeave
}) => {
  const [remarks, setRemarks] = useState<string>('');
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'info' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen || !leave) return null;

  const isAdvisor = currentUser.role === 'faculty' || currentUser.role === 'mentor' || (currentUser as any).isAdvisor;
  const isHOD = currentUser.role === 'department_head' || (currentUser as any).isHOD;
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';
  const isStudentOwner = currentUser.id === leave.studentId || currentUser.name === leave.studentName;

  const canAdvisorApprove = (isAdvisor || isHOD || isAdmin) && (leave.status === 'Submitted' || leave.status === 'Pending' || leave.status === 'Advisor Review');
  const canHODApprove = (isHOD || isAdmin) && (leave.status === 'HOD Approval' || leave.status === 'Approved by Advisor');

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Rejected
          </span>
        );
      case 'HOD Approval':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-600" />
            Pending HOD Approval
          </span>
        );
      case 'Approved by Advisor':
      case 'Advisor Review':
      case 'Submitted':
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            In Review ({status})
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Draft
          </span>
        );
      case 'Info Requested':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Info Requested
          </span>
        );
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const handleDecision = (type: 'approve' | 'reject' | 'info') => {
    setErrorMsg('');
    if (type === 'reject' && !remarks.trim()) {
      setErrorMsg('Mandatory remarks are required when rejecting a leave application.');
      return;
    }
    if (type === 'info' && !remarks.trim()) {
      setErrorMsg('Please enter what additional information or documents are required.');
      return;
    }

    if (type === 'approve') {
      if (canHODApprove || leave.daysCount <= 3) {
        onUpdateLeaveStatus(leave.id, 'Approved', remarks.trim() || 'Approved by academic authority.', isHOD ? 'HOD' : 'Class Advisor');
      } else {
        // Long leave forwarded to HOD
        onUpdateLeaveStatus(leave.id, 'HOD Approval', remarks.trim() || 'Approved by Advisor. Escalate to HOD for long leave (>3 days).', 'Class Advisor');
      }
    } else if (type === 'reject') {
      onUpdateLeaveStatus(leave.id, 'Rejected', remarks.trim(), isHOD ? 'HOD' : 'Class Advisor');
    } else if (type === 'info') {
      onUpdateLeaveStatus(leave.id, 'Info Requested', remarks.trim(), isHOD ? 'HOD' : 'Class Advisor');
    }

    setActiveAction(null);
    setRemarks('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-sky-400">{leave.applicationId || leave.id}</span>
                {getStatusBadge(leave.status)}
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{leave.type} Application</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {leave.status === 'Approved' && (
              <button
                onClick={() => printLeaveLetter(leave)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
                title="Download / Print Official Sanction Order"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Sanction Letter</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Student Info Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Student Name</span>
              <span className="font-bold text-slate-800 text-sm">{leave.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Roll / Reg Number</span>
              <span className="font-bold text-slate-800 font-mono text-sm">{leave.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Department</span>
              <span className="font-bold text-slate-800">{leave.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Class / Year</span>
              <span className="font-bold text-slate-800">{leave.year || '3rd Year'} {leave.section ? `(Sec ${leave.section})` : ''}</span>
            </div>
          </div>

          {/* Leave Application Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl">
              <span className="text-xs font-medium text-sky-800 block">From Date</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">{leave.startDate}</span>
            </div>

            <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl">
              <span className="text-xs font-medium text-sky-800 block">To Date</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">{leave.endDate}</span>
            </div>

            <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-xl">
              <span className="text-xs font-medium text-indigo-800 block">Total Leave Days</span>
              <span className="text-base font-black text-indigo-950 mt-0.5 block">{leave.daysCount} Day(s)</span>
            </div>
          </div>

          {/* Reason Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Reason for Request</h3>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed">
              {leave.reason}
            </div>
          </div>

          {/* Contacts & Parent Notification Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-medium block">Emergency Contact</span>
              <span className="font-semibold text-slate-800">{leave.emergencyContact || 'Provided on profile'}</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 font-medium block">Parent Guardian Contact</span>
              <span className="font-semibold text-slate-800">{leave.parentContact || 'On record (+SMS Alert enabled)'}</span>
            </div>
          </div>

          {/* Attached Supporting Documents */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Attached Supporting Documents</span>
              <span className="text-slate-400 font-normal">({leave.supportingDocuments?.length || 0} attached)</span>
            </h3>

            {leave.supportingDocuments && leave.supportingDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leave.supportingDocuments.map((doc, idx) => (
                  <div key={doc.id || idx} className="p-3 bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-xl flex items-center justify-between text-xs transition-colors">
                    <div className="flex items-center space-x-2.5 truncate">
                      <Paperclip className="w-4 h-4 text-sky-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate">{doc.name}</span>
                        <span className="text-[10px] text-slate-400">{doc.size || 'Attachment'}</span>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>View</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-400 text-center">
                No external supporting documents attached to this application.
              </div>
            )}
          </div>

          {/* Workflow Remarks & Feedback */}
          {(leave.advisorRemarks || leave.hodRemarks || leave.facultyNotes) && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Authority Review Remarks</h3>
              
              {leave.advisorRemarks && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold text-amber-950 block mb-0.5">Class Advisor ({leave.advisorName || 'Advisor'}):</span>
                  <p>{leave.advisorRemarks}</p>
                </div>
              )}

              {leave.hodRemarks && (
                <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-xl text-xs text-purple-900">
                  <span className="font-bold text-purple-950 block mb-0.5">Head of Department (HOD - {leave.hodName || 'HOD'}):</span>
                  <p>{leave.hodRemarks}</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline Audit History */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Approval Workflow Timeline</h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {leave.timeline && leave.timeline.length > 0 ? (
                leave.timeline.map((entry, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3 text-xs">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px] ring-4 ring-white">
                      {idx + 1}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{entry.status}</span>
                        <span className="text-[10px] text-slate-400">{entry.timestamp}</span>
                      </div>
                      <div className="text-slate-600 mt-1">
                        By <span className="font-semibold text-slate-800">{entry.actorName}</span> ({entry.actorRole})
                      </div>
                      {entry.note && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">"{entry.note}"</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">Timeline details recorded at submission.</div>
              )}
            </div>
          </div>

          {/* Authority Decision Panel (Class Advisor / HOD / Admin) */}
          {(canAdvisorApprove || canHODApprove) && (
            <div className="mt-6 p-4 bg-slate-900 text-white rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-sky-400" />
                  <span className="font-bold text-sm">Academic Approval Action Panel ({isHOD ? 'HOD' : 'Class Advisor'})</span>
                </div>
                {leave.daysCount > 3 && (
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-md">
                    Long Leave (&gt;3 Days)
                  </span>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Action Remarks / Notes <span className="text-slate-400 font-normal">(Required for rejection/info request)</span>
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter approval comments, attendance verification notes, or rejection reason..."
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <button
                  onClick={() => handleDecision('info')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Request Additional Info</span>
                </button>

                <button
                  onClick={() => handleDecision('reject')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5 text-white" />
                  <span>Reject Leave</span>
                </button>

                <button
                  onClick={() => handleDecision('approve')}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>{leave.daysCount > 3 && !canHODApprove ? 'Forward to HOD' : 'Approve Leave'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Student Owner Controls */}
          {isStudentOwner && (leave.status === 'Draft' || leave.status === 'Submitted' || leave.status === 'Pending') && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                {leave.status === 'Draft' ? 'This application is currently saved as draft.' : 'Application is pending advisor review.'}
              </span>
              <div className="flex items-center space-x-2">
                {onDeleteOrCancelLeave && (
                  <button
                    onClick={() => {
                      onDeleteOrCancelLeave(leave.id);
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    {leave.status === 'Draft' ? 'Delete Draft' : 'Cancel Request'}
                  </button>
                )}
                {leave.status === 'Draft' && (
                  <button
                    onClick={() => {
                      onUpdateLeaveStatus(leave.id, 'Submitted', 'Draft submitted by student.', 'Student');
                      onClose();
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Draft Now</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Last Updated: {leave.lastUpdated || leave.appliedOn}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
