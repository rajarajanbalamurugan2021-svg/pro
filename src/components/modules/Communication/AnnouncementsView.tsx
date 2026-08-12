import React, { useState } from 'react';
import { FacultyAnnouncement, User } from '../../../types';
import { uploadFileToStorage } from '../../../lib/firebase';
import {
  Megaphone,
  Plus,
  Building2,
  Calendar,
  Eye,
  FileText,
  Download,
  X,
  Send,
  UserCheck2,
  Paperclip,
  CheckCircle2,
  Search
} from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: FacultyAnnouncement[];
  currentUser: User;
  onCreateAnnouncement: (data: any) => void;
  onIncrementViews: (id: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  announcements,
  currentUser,
  onCreateAnnouncement,
  onIncrementViews
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science & Engineering');
  const [year, setYear] = useState('All');
  const [section, setSection] = useState('All');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const canPublish = currentUser.role === 'faculty' || currentUser.role === 'admin' || currentUser.role === 'super_admin';

  const filtered = announcements.filter(ann => {
    if (deptFilter !== 'All' && ann.department !== 'All' && ann.department !== deptFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = ann.title.toLowerCase().includes(q);
      const matchMessage = ann.message.toLowerCase().includes(q);
      const matchFaculty = ann.facultyName.toLowerCase().includes(q);
      if (!matchTitle && !matchMessage && !matchFaculty) return false;
    }
    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsUploading(true);
    let attachmentUrl = '';
    let attachmentName = '';

    try {
      if (file) {
        attachmentUrl = await uploadFileToStorage(file, 'faculty_announcements');
        attachmentName = file.name;
      }

      onCreateAnnouncement({
        title,
        message,
        facultyId: currentUser.id,
        facultyName: currentUser.name,
        facultyAvatar: currentUser.avatar,
        department,
        year,
        section,
        priority,
        attachmentUrl,
        attachmentName,
        publishDate: new Date().toISOString().split('T')[0]
      });

      setIsModalOpen(false);
      setTitle('');
      setMessage('');
      setFile(null);
    } catch (err) {
      console.error('Failed to upload announcement attachment:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const priorityBadge = (p: string) => {
    switch (p) {
      case 'Urgent': return <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-extrabold">URGENT</span>;
      case 'High': return <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-extrabold">HIGH</span>;
      default: return <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-extrabold">NOTICE</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-black flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-300 animate-bounce" />
            <span>Faculty Academic Announcements</span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-100">
            Official department circulars, examination notices, assignment deadlines, and academic alerts.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white text-purple-700 font-extrabold hover:bg-purple-50 transition shadow-lg shrink-0 flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Announcement</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search announcement title or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engg</option>
            <option value="Electronics & Communication Engineering">Electronics & Comm Engg</option>
            <option value="Electrical & Electronics Engineering">Electrical & Electronics Engg</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Megaphone className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
            <p className="text-sm font-bold">No announcements found</p>
            <p className="text-xs text-slate-400">There are no notices published for the selected department filter.</p>
          </div>
        ) : (
          filtered.map(ann => (
            <div
              key={ann.id}
              onClick={() => onIncrementViews(ann.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 hover:border-purple-500/40 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={ann.facultyAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
                    alt={ann.facultyName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {ann.facultyName}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {ann.department} • Target: {ann.year || 'All Years'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {priorityBadge(ann.priority)}
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.publishDate}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  {ann.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {ann.message}
                </p>
              </div>

              {ann.attachmentUrl && (
                <div className="pt-2">
                  <a
                    href={ann.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Attachment ({ann.attachmentName || 'Circular File'})</span>
                  </a>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ann.viewsCount || 0} student views</span>
                </span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  Official Faculty Circular
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create Announcement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-500" />
                Publish Faculty Announcement
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Announcement Title</label>
                <input
                  type="text"
                  placeholder="e.g. CIA-II Examination Schedule & Syllabus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Target Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="All">All Departments</option>
                    <option value="Computer Science & Engineering">Computer Science & Engg</option>
                    <option value="Electronics & Communication Engineering">Electronics & Comm Engg</option>
                    <option value="Electrical & Electronics Engineering">Electrical & Electronics Engg</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low Notice</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Notice Content / Instructions</label>
                <textarea
                  rows={4}
                  placeholder="Write complete notice details, dates, instructions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-slate-100 mb-1 block">Attach Circular PDF / File</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-purple-50 file:text-purple-700 font-semibold"
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
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
                >
                  {isUploading ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
