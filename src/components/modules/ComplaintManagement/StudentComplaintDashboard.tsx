import React, { useState } from 'react';
import { Complaint, UserRole } from '../../../types';
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Tag,
  Star,
  Image as ImageIcon,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { callAIClassifyComplaint } from '../../../services/api';

interface StudentComplaintDashboardProps {
  complaints: Complaint[];
  categories: string[];
  currentUserId: string;
  currentUserName: string;
  onAddComplaint: (complaint: Complaint) => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const StudentComplaintDashboard: React.FC<StudentComplaintDashboardProps> = ({
  complaints,
  categories,
  currentUserId,
  currentUserName,
  onAddComplaint,
  onSelectComplaint
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // New Complaint State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Electrical Issues');
  const [blockName, setBlockName] = useState('Main Academic Block');
  const [floor, setFloor] = useState('2nd Floor');
  const [roomNumber, setRoomNumber] = useState('CSE Lab 2');
  const [priority, setPriority] = useState<Complaint['priority']>('Medium');
  const [evidenceUrlInput, setEvidenceUrlInput] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  
  // AI Assist State
  const [classifying, setClassifying] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);

  const myComplaints = complaints.filter(
    (c) => c.reportedBy === currentUserId || c.studentName === currentUserName
  );

  const filtered = myComplaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddEvidenceUrl = () => {
    if (evidenceUrlInput.trim()) {
      setEvidenceUrls((prev) => [...prev, evidenceUrlInput.trim()]);
      setEvidenceUrlInput('');
    }
  };

  const handleAiAutoAnalyze = async () => {
    if (!title || !description) return;
    setClassifying(true);
    try {
      const res = await callAIClassifyComplaint(title, description);
      setAiAnalysis(res);
      if (res.category && categories.includes(res.category)) {
        setCategory(res.category);
      }
      if (res.priority) {
        setPriority(res.priority as Complaint['priority']);
      }
    } catch (err) {
      console.warn('AI analysis error', err);
    } finally {
      setClassifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newComp: Complaint = {
      id: `CMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title,
      description,
      category: aiAnalysis?.category || category,
      priority: aiAnalysis?.priority || priority,
      status: 'New Complaint',
      reportedBy: currentUserId,
      studentName: currentUserName,
      studentId: currentUserId,
      department: 'Computer Science & Engineering',
      blockName,
      floor,
      roomNumber,
      imageUrl: evidenceUrls[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      imageUrls: evidenceUrls.length > 0 ? evidenceUrls : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'],
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      timeline: [
        {
          status: 'New Complaint Registered',
          updatedBy: currentUserName,
          timestamp: new Date().toLocaleString(),
          note: 'Submitted through Student Grievance Portal.'
        }
      ]
    };

    onAddComplaint(newComp);
    setShowNewModal(false);
    // Reset form
    setTitle('');
    setDescription('');
    setEvidenceUrls([]);
    setAiAnalysis(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> AI Student Grievance & Maintenance Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            My Campus Complaints & Trackers
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Report maintenance issues, track real-time resolution progress, and rate resolution quality upon completion.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-3 rounded-2xl bg-white text-blue-900 text-xs font-extrabold hover:bg-blue-50 transition shadow-lg shrink-0 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4 text-blue-600" /> File New Complaint
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Filed</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {myComplaints.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-amber-500 font-bold uppercase">Pending / New</span>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {myComplaints.filter((c) => c.status === 'Pending' || c.status === 'New Complaint').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-blue-500 font-bold uppercase">In Progress</span>
          <div className="text-2xl font-black text-blue-500 mt-1">
            {myComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs text-emerald-500 font-bold uppercase">Resolved</span>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {myComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Approved' || c.status === 'Completed').length}
          </div>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, keyword..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          >
            <option value="All">All Statuses</option>
            <option value="New Complaint">New Complaint</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Resolved">Resolved</option>
            <option value="Reopened">Reopened</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
            <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Complaints Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              You haven't filed any complaints matching this filter yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((comp) => (
              <div
                key={comp.id}
                onClick={() => onSelectComplaint(comp)}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {comp.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        comp.status === 'Resolved' || comp.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : comp.status === 'In Progress' || comp.status === 'Assigned'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {comp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{comp.blockName || 'Academic Block'}</span>
                  </div>

                  <div className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                    Track Progress <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Complaint Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 p-6 space-y-5">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  File New Campus Complaint
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in detail about the maintenance or facility issue.
                </p>
              </div>

              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Title & AI Button */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Complaint Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wi-Fi router flashing red in CSE Lab 3"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Detailed Description
                  </label>
                  <button
                    type="button"
                    onClick={handleAiAutoAnalyze}
                    disabled={classifying || !title || !description}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-40"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {classifying ? 'Analyzing...' : 'AI Auto-Classify'}
                  </button>
                </div>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide precise details of what is broken, symptoms, or hazard level..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* AI Auto-Suggestion Banner */}
              {aiAnalysis && (
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                  <div className="font-extrabold text-purple-900 dark:text-purple-200 flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-purple-500" /> AI Classification Recommendation
                  </div>
                  <p className="text-purple-800 dark:text-purple-300">
                    Category: <strong>{aiAnalysis.category}</strong> | Recommended Priority: <strong>{aiAnalysis.priority}</strong>
                  </p>
                </div>
              )}

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Complaint['priority'])}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical Emergency</option>
                  </select>
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Block Name
                  </label>
                  <select
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Main Academic Block">Main Academic Block</option>
                    <option value="Science & Tech Block">Science & Tech Block</option>
                    <option value="Hostel Block A">Hostel Block A</option>
                    <option value="Hostel Block B">Hostel Block B</option>
                    <option value="Central Library Block">Central Library Block</option>
                    <option value="Sports Complex">Sports Complex</option>
                    <option value="Admin Block">Admin Block</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Floor
                  </label>
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="1st Floor">1st Floor</option>
                    <option value="2nd Floor">2nd Floor</option>
                    <option value="3rd Floor">3rd Floor</option>
                    <option value="4th Floor">4th Floor</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. Lab 3 / Room 302"
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Upload Evidence Image URLs
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={evidenceUrlInput}
                    onChange={(e) => setEvidenceUrlInput(e.target.value)}
                    placeholder="Paste image link URL..."
                    className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddEvidenceUrl}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-white font-bold"
                  >
                    Add Link
                  </button>
                </div>

                {evidenceUrls.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {evidenceUrls.map((url, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 truncate max-w-[120px]"
                      >
                        Photo {idx + 1}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                >
                  Submit Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
