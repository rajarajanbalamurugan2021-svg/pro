import React, { useState } from 'react';
import { CommunityPost, Announcement, UserRole } from '../../../types';
import {
  Users,
  Megaphone,
  Heart,
  MessageSquare,
  Share2,
  Plus,
  Vote,
  Sparkles,
  Calendar,
  Tag,
  Send
} from 'lucide-react';

interface CommunityHubProps {
  posts: CommunityPost[];
  announcements: Announcement[];
  userRole: UserRole;
  currentUserName: string;
  currentUserAvatar: string;
  onAddPost: (post: CommunityPost) => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onVotePoll: (postId: string, optionIndex: number) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  posts,
  announcements,
  userRole,
  currentUserName,
  currentUserAvatar,
  onAddPost,
  onToggleLike,
  onAddComment,
  onVotePoll
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'announcements'>('feed');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // New Post state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CommunityPost['category']>('General');
  const [imageUrl, setImageUrl] = useState('');
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentUserName,
      authorRole: userRole.toUpperCase(),
      authorAvatar: currentUserAvatar,
      title,
      content,
      category,
      imageUrl: imageUrl || undefined,
      likes: 0,
      isLiked: false,
      comments: [],
      createdAt: 'Just now'
    };

    onAddPost(newPost);
    setShowNewPostModal(false);
    setTitle('');
    setContent('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text);
    setCommentInput({ ...commentInput, [postId]: '' });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-lg shadow-purple-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
            <Users className="h-4 w-4" /> Campus Social & Student Forum
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Community Hub & Official Bulletins
          </h1>
          <p className="text-sm text-purple-100 mt-1 max-w-xl">
            Official university announcements, student club activities, interactive polls, and student discussion forums.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-purple-800 text-xs font-extrabold hover:bg-purple-50 transition shadow-md"
        >
          <Plus className="h-4 w-4" /> Create Discussion Post
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'feed'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" /> Community Feed & Polls
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'announcements'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="h-4 w-4" /> Official Announcements ({announcements.length})
        </button>
      </div>

      {/* FEED TAB */}
      {activeTab === 'feed' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.authorAvatar} alt={post.authorName} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{post.authorName}</h3>
                    <span className="text-[10px] text-slate-400">{post.authorRole} • {post.createdAt}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {post.category}
                </span>
              </div>

              {/* Title & Content */}
              <div className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{post.title}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line">{post.content}</p>
              </div>

              {post.imageUrl && (
                <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                </div>
              )}

              {/* Poll Widget if present */}
              {post.poll && (
                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 space-y-3 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Vote className="h-4 w-4 text-purple-600" /> {post.poll.question}
                  </div>
                  <div className="space-y-2">
                    {post.poll.options.map((opt, i) => {
                      const pct = Math.round((opt.votes / (post.poll?.totalVotes || 1)) * 100);
                      return (
                        <button
                          key={i}
                          onClick={() => onVotePoll(post.id, i)}
                          className="w-full text-left p-2.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 relative overflow-hidden transition hover:border-purple-500"
                        >
                          <div
                            className="absolute top-0 left-0 bottom-0 bg-purple-100 dark:bg-purple-950/80 -z-0"
                            style={{ width: `${pct}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between font-medium text-slate-800 dark:text-slate-200">
                            <span>{opt.text}</span>
                            <span className="font-bold text-purple-700 dark:text-purple-300">{pct}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right">{post.poll.totalVotes} votes cast</span>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
                <button
                  onClick={() => onToggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition ${
                    post.isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current text-rose-600' : ''}`} />
                  <span>{post.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments.length} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="pt-3 space-y-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                    <img src={c.authorAvatar} alt={c.authorName} className="h-6 w-6 rounded-full object-cover mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{c.authorName}: </span>
                      <span className="text-slate-600 dark:text-slate-300">{c.content}</span>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInput[post.id] || ''}
                    onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="p-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm space-y-2 ${
                ann.isImportant
                  ? 'border-amber-300 dark:border-amber-900/60 ring-2 ring-amber-500/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {ann.category}
                </span>
                <span className="text-xs text-slate-400">{ann.date}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">{ann.content}</p>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Issued by <span className="font-semibold text-slate-700 dark:text-slate-300">{ann.issuedBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW POST MODAL */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" /> Start Discussion Post
              </h3>
              <button onClick={() => setShowNewPostModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Seeking teammates for HackCampus 2026!"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Content *</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share ideas, questions, or club updates with fellow students and faculty..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="General">General</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                    <option value="Club">Club</option>
                    <option value="Discussion">Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
