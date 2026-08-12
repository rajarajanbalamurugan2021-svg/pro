import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ChatMessage, User } from '../../../types';
import { uploadFileToStorage } from '../../../lib/firebase';
import {
  Send,
  Paperclip,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Search,
  Flag,
  FileText,
  Download,
  Trash2,
  Star,
  Copy,
  Clock,
  UserCheck2,
  ShieldAlert,
  ArrowLeft,
  X,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUser: User;
  onSendMessage: (text: string, attachmentUrl?: string, attachmentName?: string) => void;
  onResolveConversation: (convId: string) => void;
  onReopenConversation: (convId: string) => void;
  onReportConversation: (convId: string, reportedUserId: string, reportedUserName: string) => void;
  onDeleteMessage: (msgId: string) => void;
  onToggleStarMessage: (msgId: string) => void;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUser,
  onSendMessage,
  onResolveConversation,
  onReopenConversation,
  onReportConversation,
  onDeleteMessage,
  onToggleStarMessage,
  onBack
}) => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isStudent = currentUser.role === 'student';
  const partnerName = isStudent ? conversation.facultyName : conversation.studentName;
  const partnerAvatar = isStudent ? conversation.facultyAvatar : conversation.studentAvatar;
  const partnerDept = isStudent ? conversation.facultyDepartment : conversation.studentDepartment;
  const partnerRoleMeta = isStudent ? (conversation.facultyDesignation || 'Faculty Member') : `Roll: ${conversation.studentRoll || 'Student'}`;
  const partnerUserId = isStudent ? conversation.facultyId : conversation.studentId;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !file) return;

    let attachmentUrl = '';
    let attachmentName = '';

    if (file) {
      try {
        setIsUploading(true);
        attachmentUrl = await uploadFileToStorage(file, 'communication_chat_attachments');
        attachmentName = file.name;
      } catch (err) {
        console.error('File upload failed:', err);
      } finally {
        setIsUploading(false);
      }
    }

    onSendMessage(inputText.trim(), attachmentUrl, attachmentName);
    setInputText('');
    setFile(null);
  };

  const filteredMessages = messages.filter(m => {
    if (!searchQuery) return true;
    return m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.attachmentName && m.attachmentName.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950/80">
      
      {/* Top Bar Header */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <img
            src={partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={partnerName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
          />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{partnerName}</h3>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                {conversation.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {partnerDept} • {partnerRoleMeta}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {conversation.status === 'RESOLVED' ? (
            <button
              onClick={() => onReopenConversation(conversation.id)}
              className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-200 transition flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Reopen Thread</span>
            </button>
          ) : (
            <button
              onClick={() => onResolveConversation(conversation.id)}
              className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          )}

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Search Messages"
          >
            <Search className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 py-1 text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onReportConversation(conversation.id, partnerUserId, partnerName);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2 font-medium"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report Conversation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Search Subbar */}
      {showSearch && (
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search within this chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
          />
          <button onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Banner if Resolved */}
        {conversation.status === 'RESOLVED' && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>This communication thread has been marked as <strong>Resolved</strong>. You can still post follow-up queries or reopen.</span>
            </div>
          </div>
        )}

        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-xs font-semibold">No messages yet in this conversation</p>
            <p className="text-[11px] text-slate-400">Type your query below to begin communicating directly.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar || partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 mb-1"
                  />
                )}

                <div className={`max-w-[85%] sm:max-w-[70%] group relative ${
                  isMe
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-xs p-3.5 shadow-md shadow-blue-500/10'
                    : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl rounded-bl-xs p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs'
                }`}>
                  
                  {/* Sender Name for non-me */}
                  {!isMe && (
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {msg.senderName} ({msg.senderRole})
                    </p>
                  )}

                  {/* Message Text */}
                  <p className="text-xs font-normal whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>

                  {/* Attachment Card if exists */}
                  {msg.attachmentUrl && (
                    <div className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                      isMe
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}>
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold truncate max-w-[160px]">
                          {msg.attachmentName || 'Attachment File'}
                        </span>
                      </div>
                      <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-1.5 rounded-lg transition ${
                          isMe ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400'
                        }`}
                        title="Download Attachment"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Message Footer Info */}
                  <div className={`mt-1.5 flex items-center justify-end gap-1.5 text-[9px] ${
                    isMe ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Action Bar on hover */}
                  <div className={`absolute top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 text-white text-[10px] shadow-lg backdrop-blur-sm z-10 ${
                    isMe ? '-left-20' : '-right-20'
                  }`}>
                    <button
                      onClick={() => handleCopy(msg.id, msg.message)}
                      className="p-1 hover:text-blue-300"
                      title="Copy Message"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onToggleStarMessage(msg.id)}
                      className={`p-1 ${msg.isStarred ? 'text-amber-400' : 'hover:text-amber-300'}`}
                      title="Star Message"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                    {isMe && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="p-1 hover:text-red-400"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2">
        {file && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300">
            <span className="truncate font-medium flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" />
              Attached: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
            <button onClick={() => setFile(null)} className="p-1 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          <label className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer transition">
            <Paperclip className="w-4 h-4" />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>

          <input
            type="text"
            placeholder="Type your message, response, or question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={(!inputText.trim() && !file) || isUploading}
            className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
