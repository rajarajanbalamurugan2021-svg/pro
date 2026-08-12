import React, { useState } from 'react';
import { Conversation, User, CommunicationCategory } from '../../../types';
import {
  Search,
  MessageSquare,
  Pin,
  Star,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  UserCheck2,
  BookOpen
} from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConvId: string | null;
  onSelectConv: (conv: Conversation) => void;
  currentUser: User;
  onOpenNewModal: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConvId,
  onSelectConv,
  currentUser,
  onOpenNewModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');

  const filtered = conversations.filter(c => {
    const isStudent = currentUser.role === 'student';
    const partnerName = isStudent ? c.facultyName : c.studentName;
    const partnerDept = isStudent ? c.facultyDepartment : c.studentDepartment;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = partnerName.toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      const matchSubj = (c.subjectName || '').toLowerCase().includes(q);
      const matchLastMsg = (c.lastMessage || '').toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchSubj && !matchLastMsg) return false;
    }

    if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

    return true;
  });

  // Sort pinned/starred to top, then recent lastMessageAt
  const sorted = [...filtered].sort((a, b) => {
    const isStudent = currentUser.role === 'student';
    const aPinned = isStudent ? a.isPinnedStudent : a.isPinnedFaculty;
    const bPinned = isStudent ? b.isPinnedStudent : b.isPinnedFaculty;

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    return b.lastMessageAt - a.lastMessageAt;
  });

  const categories = Array.from(new Set(conversations.map(c => c.category)));

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      
      {/* Header & Search Bar */}
      <div className="p-3 sm:p-4 space-y-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>Messages & Queries</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold">
              {conversations.length}
            </span>
          </h2>

          <button
            onClick={onOpenNewModal}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Query</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty, subject, topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 font-medium max-w-[130px] truncate"
          >
            <option value="ALL">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {sorted.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
            <p className="text-xs font-semibold">No communications found</p>
            <p className="text-[11px] text-slate-400">Click 'New Query' to start a direct thread with a faculty member.</p>
          </div>
        ) : (
          sorted.map((conv) => {
            const isStudent = currentUser.role === 'student';
            const partnerName = isStudent ? conv.facultyName : conv.studentName;
            const partnerAvatar = isStudent ? conv.facultyAvatar : conv.studentAvatar;
            const partnerDept = isStudent ? conv.facultyDepartment : conv.studentDepartment;
            const partnerMeta = isStudent ? (conv.facultyDesignation || 'Faculty') : (conv.studentRoll || 'Student');
            const unreadCount = isStudent ? conv.unreadStudent : conv.unreadFaculty;
            const isSelected = selectedConvId === conv.id;

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConv(conv)}
                className={`w-full text-left p-3 transition flex items-start gap-3 relative hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  isSelected ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600' : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={partnerName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                  {conv.status === 'RESOLVED' && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {partnerName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold truncate max-w-[120px]">
                      {conv.category}
                    </span>
                    {conv.subjectName && (
                      <span className="text-slate-400 truncate">
                        • {conv.subjectName}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate font-normal">
                    {conv.lastMessage || 'No messages yet...'}
                  </p>
                </div>

                {/* Unread & Status indicators */}
                {unreadCount > 0 && (
                  <span className="shrink-0 px-1.5 py-0.5 text-[10px] rounded-full bg-blue-600 text-white font-extrabold shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
