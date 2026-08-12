import React, { useState } from 'react';
import {
  User,
  CommunicationCategory
} from '../../../types';
import { uploadFileToStorage } from '../../../lib/firebase';
import {
  X,
  MessageSquare,
  UserCheck2,
  BookOpen,
  Paperclip,
  Send,
  AlertCircle,
  HelpCircle,
  Building2,
  GraduationCap,
  FileText
} from 'lucide-react';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  facultyUsers: User[];
  defaultCategory?: CommunicationCategory;
  defaultFacultyId?: string;
  defaultSubject?: string;
  onStart: (data: {
    faculty: User;
    category: CommunicationCategory;
    subjectName?: string;
    message: string;
    attachmentUrl?: string;
    attachmentName?: string;
  }) => void;
}

const CATEGORIES: CommunicationCategory[] = [
  'Academic Doubt',
  'Attendance Query',
  'Assignment Query',
  'Project Guidance',
  'Leave Clarification',
  'GATE Guidance',
  'Career Guidance',
  'Internship Guidance',
  'Mentoring',
  'Department Matters',
  'General Academic'
];

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  facultyUsers,
  defaultCategory = 'Academic Doubt',
  defaultFacultyId = '',
  defaultSubject = '',
  onStart
}) => {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(defaultFacultyId || (facultyUsers[0]?.id || ''));
  const [category, setCategory] = useState<CommunicationCategory>(defaultCategory);
  const [subjectName, setSubjectName] = useState<string>(defaultSubject);
  const [message, setMessage] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const departments = ['All', ...Array.from(new Set(facultyUsers.map(f => f.department).filter(Boolean)))];

  const filteredFaculty = facultyUsers.filter(f => {
    if (departmentFilter !== 'All' && f.department !== departmentFilter) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacultyId) {
      setError('Please select a faculty member.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter your query or message.');
      return;
    }

    const selectedFaculty = facultyUsers.find(f => f.id === selectedFacultyId);
    if (!selectedFaculty) {
      setError('Selected faculty member not found.');
      return;
    }

    setIsUploading(true);
    let attachmentUrl = '';
    let attachmentName = '';

    try {
      if (file) {
        // Enforce 10MB file limit
        if (file.size > 10 * 1024 * 1024) {
          setError('File size must be less than 10MB.');
          setIsUploading(false);
          return;
        }
        attachmentUrl = await uploadFileToStorage(file, 'communication_attachments');
        attachmentName = file.name;
      }

      onStart({
        faculty: selectedFaculty,
        category,
        subjectName,
        message: message.trim(),
        attachmentUrl,
        attachmentName
      });

      onClose();
    } catch (err) {
      console.error('File upload failed:', err);
      setError('Failed to upload file. Starting conversation without attachment.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Start Faculty Communication</h3>
              <p className="text-xs text-blue-100">Send an academic query or start a direct message thread</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Department Filter & Faculty Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck2 className="w-4 h-4 text-blue-500" />
                Select Faculty Member <span className="text-red-500">*</span>
              </label>
              
              {/* Filter pill */}
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <select
              value={selectedFacultyId}
              onChange={(e) => {
                setSelectedFacultyId(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>-- Choose Faculty Member --</option>
              {filteredFaculty.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.department} • {f.title || 'Faculty'})
                </option>
              ))}
            </select>
          </div>

          {/* Category & Course Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                Query Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunicationCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Course / Subject Title
              </label>
              <input
                type="text"
                placeholder="e.g. Digital Electronics, Algorithms, GATE"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 block">
              Message / Academic Query Detail <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="State your question clearly with topic details, chapter reference, or specific clarification required..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError('');
              }}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-normal focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* File Attachment */}
          <div>
            <label className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-emerald-500" />
                Attachment (Optional)
              </span>
              <span className="text-[11px] text-slate-500 font-normal">PDF, DOC, PPT, PNG, JPG (Max 10MB)</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  if (f.size > 10 * 1024 * 1024) {
                    setError('File exceeds 10MB maximum limit.');
                    return;
                  }
                  setFile(f);
                  setError('');
                }
              }}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950/50 dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer"
            />
            {file && (
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Communication</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
