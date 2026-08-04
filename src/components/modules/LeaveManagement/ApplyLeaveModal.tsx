import React, { useState } from 'react';
import { LeaveRequest, LeaveTypeConfig, User, SupportingDocument } from '../../../types';
import { calculateLeaveDays, generateLeaveApplicationId } from '../../../utils/leaveUtils';
import { 
  X, 
  Calendar, 
  Upload, 
  FileText, 
  Trash2, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  Phone,
  Paperclip
} from 'lucide-react';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  leaveTypes: LeaveTypeConfig[];
  existingLeaves: LeaveRequest[];
  onSaveLeave: (leave: LeaveRequest, isDraft: boolean) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  leaveTypes,
  existingLeaves,
  onSaveLeave
}) => {
  const [leaveType, setLeaveType] = useState<string>(leaveTypes[0]?.name || 'Casual Leave');
  const [reason, setReason] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [emergencyContact, setEmergencyContact] = useState<string>(currentUser.phone || '');
  const [parentContact, setParentContact] = useState<string>('');
  const [documents, setDocuments] = useState<SupportingDocument[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const activeLeaveTypes = leaveTypes.filter(lt => lt.active !== false);
  const totalDays = calculateLeaveDays(startDate, endDate);

  const selectedTypeObj = activeLeaveTypes.find(t => (t.name || t.leaveTypeName) === leaveType);
  const maxAllowed = selectedTypeObj?.maxDays || 10;
  const isExceedingMax = totalDays > maxAllowed;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDocs: SupportingDocument[] = Array.from(files).map((file: File, idx: number) => ({
        id: `doc-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        url: URL.createObjectURL(file) || 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&auto=format&fit=crop&q=80'
      }));
      setDocuments(prev => [...prev, ...newDocs]);
      setIsUploading(false);
    }, 400);
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleSubmit = (isDraft: boolean) => {
    setErrorMsg('');
    if (!isDraft) {
      if (!reason.trim()) {
        setErrorMsg('Please enter a clear reason for your leave request.');
        return;
      }
      if (!startDate || !endDate) {
        setErrorMsg('Please select valid From Date and To Date.');
        return;
      }
      if (new Date(endDate) < new Date(startDate)) {
        setErrorMsg('To Date cannot be earlier than From Date.');
        return;
      }
    }

    const appId = generateLeaveApplicationId(existingLeaves);
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newLeave: LeaveRequest = {
      id: `lv-${Date.now()}`,
      applicationId: appId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      rollNumber: (currentUser as any).rollNumber || (currentUser as any).registerNo || 'CS2023001',
      department: currentUser.department || 'Computer Science & Engineering',
      year: (currentUser as any).year || '3rd Year',
      section: (currentUser as any).section || 'A',
      reason: reason.trim() || 'No reason specified (Draft)',
      startDate,
      endDate,
      fromDate: startDate,
      toDate: endDate,
      daysCount: totalDays,
      totalDays: totalDays,
      type: leaveType,
      status: isDraft ? 'Draft' : 'Submitted',
      parentNotified: true,
      appliedOn: startDate,
      submittedDate: isDraft ? undefined : formattedTimestamp,
      lastUpdated: formattedTimestamp,
      supportingDocuments: documents,
      emergencyContact,
      parentContact,
      timeline: [
        {
          status: isDraft ? 'Draft Saved' : 'Submitted Request',
          actorName: currentUser.name,
          actorRole: 'Student',
          timestamp: formattedTimestamp,
          note: isDraft ? 'Application saved as draft.' : `${documents.length} document(s) attached.`
        }
      ]
    };

    onSaveLeave(newLeave, isDraft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-indigo-700 to-slate-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <Calendar className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Apply for Academic Leave</h2>
              <p className="text-xs text-sky-200 mt-0.5">Submit request to Class Advisor & Head of Department</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-sky-100 hover:text-white"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student Quick Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block font-medium">Applicant</span>
              <span className="font-semibold text-slate-800">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Roll / Reg No</span>
              <span className="font-semibold text-slate-800">{(currentUser as any).rollNumber || 'CS2023001'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Department</span>
              <span className="font-semibold text-slate-800 truncate block">{currentUser.department || 'CSE'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Class Advisor</span>
              <span className="font-semibold text-sky-700">Dr. Robert Thorne</span>
            </div>
          </div>

          {/* Leave Type & Days Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Leave Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
              >
                {activeLeaveTypes.map(lt => (
                  <option key={lt.id} value={lt.name || lt.leaveTypeName}>
                    {lt.name || lt.leaveTypeName} (Max {lt.maxDays} days)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center flex flex-col justify-center">
              <span className="text-xs text-sky-700 font-medium">Calculated Duration</span>
              <span className="text-2xl font-black text-sky-900 mt-0.5">
                {totalDays} <span className="text-xs font-normal text-sky-700">Day(s)</span>
              </span>
              {isExceedingMax && (
                <span className="text-[10px] text-rose-600 font-semibold mt-1">
                  Exceeds standard max limit ({maxAllowed} days)
                </span>
              )}
            </div>
          </div>

          {/* Dates Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                From Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                To Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Leave <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide specific details (e.g. Medical treatment, Hackathon competition event name, Family occasion...)"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white resize-none"
            />
          </div>

          {/* Emergency & Parent Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Emergency Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Parent / Guardian Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Supporting Document Upload Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Supporting Documents (Medical Certificate, Event Permission, etc.)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-4 text-center bg-slate-50 hover:bg-sky-50/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">Click or Drag & Drop supporting files here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">PDF, PNG, JPG up to 10MB</p>
            </div>

            {/* Document List Preview */}
            {documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-2.5 bg-sky-50/70 border border-sky-200 rounded-xl text-xs">
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({doc.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 hover:bg-rose-100 rounded text-rose-600 transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workflow Info Note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Approval Routing:</span> Submitted requests first go to your <strong>Class Advisor</strong>. Leaves longer than 3 days automatically escalate to the <strong>Head of Department (HOD)</strong>.
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-sm font-semibold transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-600/20 transition-all flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
