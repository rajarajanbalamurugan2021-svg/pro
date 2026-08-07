import React, { useState } from 'react';
import { Resource, UserRole } from '../../../types';
import { saveUploadableContentFirestore } from '../../../services/api';
import {
  BookOpenCheck,
  Plus,
  Search,
  Download,
  Star,
  FileText,
  Book,
  HelpCircle,
  FolderGit2,
  Cpu,
  Filter,
  MessageSquare
} from 'lucide-react';

interface CollaborationHubProps {
  resources: Resource[];
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onAddResource: (resource: Resource) => void;
  onIncrementDownload: (id: string) => void;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  resources,
  userRole,
  currentUserId,
  currentUserName,
  onAddResource,
  onIncrementDownload
}) => {
  const [showModal, setShowModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Resource['type']>('Notes');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newRes: Resource = {
      id: `res-${Date.now()}`,
      title,
      type,
      category: type,
      department,
      subject: subject || 'General',
      description,
      fileUrl: '#',
      fileSize: '5.4 MB',
      fileType: type === 'Lab Equipment' ? 'Hardware' : 'PDF',
      uploadedBy: currentUserId,
      authorName: currentUserName,
      downloadsCount: 0,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      isEquipmentAvailable: type === 'Lab Equipment' ? true : undefined
    };

    onAddResource(newRes);

    // Sync to Cloud Collation & Storage Center (Firestore)
    saveUploadableContentFirestore({
      id: newRes.id,
      title: newRes.title,
      category: newRes.type,
      department: newRes.department,
      fileType: newRes.fileType || 'PDF',
      description: newRes.description,
      authorName: newRes.authorName,
      fileSizeKb: 5400,
      uploadedAt: new Date().toISOString(),
      uploadedAtFormatted: new Date().toLocaleString()
    }).catch(console.error);

    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  const filtered = resources.filter((res) => {
    if (typeFilter !== 'All' && res.type !== typeFilter) return false;
    if (search && !res.title.toLowerCase().includes(search.toLowerCase()) && !res.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const typeIcons: Record<Resource['type'], any> = {
    'Notes': FileText,
    'Book': Book,
    'Previous Paper': HelpCircle,
    'Project Material': FolderGit2,
    'Lab Equipment': Cpu
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <BookOpenCheck className="h-4 w-4" /> Academic Resource & Collaboration Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Notes, Exam Papers & Equipment Sharing
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-xl">
            Access peer-reviewed lecture notes, previous 5-year exam papers, textbooks, and reserve lab equipment.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-800 text-xs font-extrabold hover:bg-blue-50 transition shadow-md"
        >
          <Plus className="h-4 w-4" /> Upload Resource / Equipment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {['All', 'Notes', 'Book', 'Previous Paper', 'Project Material', 'Lab Equipment'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-full transition ${
                typeFilter === t
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, algorithms, papers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((res) => {
          const Icon = typeIcons[res.type] || FileText;
          return (
            <div
              key={res.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-400 dark:hover:border-blue-600 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                    <Icon className="h-3.5 w-3.5" /> {res.type}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{res.rating}</span>
                    <span className="text-slate-400 font-normal">({res.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {res.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Subject: <strong className="text-slate-800 dark:text-slate-200">{res.subject}</strong></span>
                  <span>Size: <strong className="text-slate-800 dark:text-slate-200">{res.fileSize}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400">
                  Uploaded by <span className="font-semibold text-slate-700 dark:text-slate-300">{res.authorName}</span>
                </div>

                <button
                  onClick={() => onIncrementDownload(res.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{res.type === 'Lab Equipment' ? 'Reserve' : 'Download'} ({res.downloadsCount})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* UPLOAD RESOURCE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-blue-600" /> Share Academic Material
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Final Review Notes"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Resource Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="Notes">Notes</option>
                    <option value="Book">Book</option>
                    <option value="Previous Paper">Previous Question Paper</option>
                    <option value="Project Material">Project Material</option>
                    <option value="Lab Equipment">Lab Equipment Sharing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. CS601"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize key topics covered or equipment kit contents..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <FileText className="h-6 w-6 mx-auto text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Drag and drop PDF / Doc file here or browse
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">Maximum file upload size 25MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                >
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
