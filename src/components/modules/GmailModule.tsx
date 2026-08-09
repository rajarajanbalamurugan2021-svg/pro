import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import {
  googleGmailSignIn,
  getGmailAccessToken,
  setGmailAccessToken,
  getGmailProfile,
  listGmailMessages,
  sendGmailMessage,
  trashGmailMessage,
  modifyGmailMessageLabels,
  GmailMessage,
  GmailProfile
} from '../../services/gmailService';
import {
  Mail,
  Send,
  Inbox,
  Star,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Lock,
  Sparkles,
  ArrowLeft,
  Reply,
  ShieldCheck,
  Check,
  X,
  FileText
} from 'lucide-react';

interface GmailModuleProps {
  currentUser: User;
}

export const GmailModule: React.FC<GmailModuleProps> = ({ currentUser }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(getGmailAccessToken());
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState<string>('label:INBOX');
  const [activeTab, setActiveTab] = useState<'INBOX' | 'SENT' | 'UNREAD' | 'STARRED' | 'TRASH'>('INBOX');

  // Compose Modal States
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeBody, setComposeBody] = useState<string>('');
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);

  // Confirmation Modals
  const [confirmSendOpen, setConfirmSendOpen] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isActionPending, setIsActionPending] = useState<boolean>(false);

  // Fetch messages if token is available
  const loadGmailData = async (tokenToUse: string, queryToUse = searchQuery) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [userProfile, msgList] = await Promise.all([
        getGmailProfile(tokenToUse).catch(() => null),
        listGmailMessages(tokenToUse, queryToUse, 20)
      ]);
      
      if (userProfile) setProfile(userProfile);
      setMessages(msgList);
    } catch (err: any) {
      console.error('Error fetching Gmail data:', err);
      setErrorMsg(err.message || 'Failed to load Gmail messages. You may need to sign in again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = getGmailAccessToken();
    if (token) {
      setAccessTokenState(token);
      loadGmailData(token, searchQuery);
    }
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const res = await googleGmailSignIn();
      if (res?.accessToken) {
        setAccessTokenState(res.accessToken);
        setSuccessMsg(`Successfully connected as ${res.user.email}`);
        await loadGmailData(res.accessToken, searchQuery);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setErrorMsg(err.message || 'Google OAuth Sign-In failed or was cancelled.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = () => {
    setGmailAccessToken(null);
    setAccessTokenState(null);
    setProfile(null);
    setMessages([]);
    setSelectedMessage(null);
    setSuccessMsg('Disconnected from Gmail.');
  };

  const handleTabChange = (tab: 'INBOX' | 'SENT' | 'UNREAD' | 'STARRED' | 'TRASH') => {
    setActiveTab(tab);
    let q = 'label:INBOX';
    if (tab === 'SENT') q = 'label:SENT';
    if (tab === 'UNREAD') q = 'label:UNREAD';
    if (tab === 'STARRED') q = 'label:STARRED';
    if (tab === 'TRASH') q = 'label:TRASH';
    setSearchQuery(q);
    if (accessToken) {
      loadGmailData(accessToken, q);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken) {
      loadGmailData(accessToken, searchQuery);
    }
  };

  // Quick Campus Templates
  const handleApplyTemplate = (templateType: string) => {
    if (templateType === 'leave') {
      setComposeSubject('[Leave Application] Academic Leave Request - CKCET CAMPRO');
      setComposeBody(
        `Respected HOD / Class Advisor,\n\nI am writing to formally request leave from my academic classes from [Start Date] to [End Date] due to [Reason].\n\nI will ensure all missed coursework and lab submissions are completed promptly.\n\nStudent Details:\nName: ${currentUser.name}\nRoll No / Email: ${currentUser.email}\nDepartment: ${currentUser.department || 'CKCET Engineering'}\n\nThank you,\n${currentUser.name}`
      );
    } else if (templateType === 'grievance') {
      setComposeSubject('[Campus Grievance] Inquiry Regarding Campus Facilities - CKCET');
      setComposeBody(
        `Dear Grievance Redressal Committee / Campus Admin,\n\nI am contacting you regarding a campus issue registered under CKCET CAMPRO Portal:\n\nCategory: [Facility / Academic / Lab Equipment / Hostel]\nDetails: [Describe issue here]\n\nKindly review this matter at your earliest convenience.\n\nRegards,\n${currentUser.name}\n${currentUser.email}`
      );
    } else if (templateType === 'project') {
      setComposeSubject('[Project Collaboration] Proposal for Student Innovation Project');
      setComposeBody(
        `Respected Mentor / Professor,\n\nOur student team has submitted an innovation project proposal on CKCET CAMPRO Hub titled "[Project Name]".\n\nWe would appreciate your mentorship and guidance for our lab work and paper publication.\n\nTeam Leader: ${currentUser.name}\nContact: ${currentUser.email}\n\nSincerely,\n${currentUser.name}`
      );
    } else if (templateType === 'placement') {
      setComposeSubject('[Placement Application] Application for Campus Recruitment Drive');
      setComposeBody(
        `Dear Placement Officer,\n\nI am submitting my resume and profile details for the upcoming placement drive registered in CKCET CAMPRO.\n\nDepartment: ${currentUser.department || 'CSE / ECE / EEE / MECH / CIVIL'}\nCGPA: [Your CGPA]\nContact: ${currentUser.email}\n\nThank you,\n${currentUser.name}`
      );
    }
  };

  // Trigger Send Confirmation Modal
  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim()) {
      setErrorMsg('Please specify a recipient email address and subject.');
      return;
    }
    setConfirmSendOpen(true);
  };

  // Execute Send Email after explicit user confirmation
  const handleConfirmSendEmail = async () => {
    if (!accessToken) return;
    setIsActionPending(true);
    setErrorMsg(null);
    try {
      await sendGmailMessage(accessToken, {
        to: composeTo,
        subject: composeSubject,
        body: composeBody.replace(/\n/g, '<br/>'),
        inReplyTo: replyMessageId || undefined
      });

      setSuccessMsg(`Email successfully sent to ${composeTo}!`);
      setConfirmSendOpen(false);
      setIsComposeOpen(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setReplyMessageId(null);

      // Refresh list
      loadGmailData(accessToken, searchQuery);
    } catch (err: any) {
      console.error('Send error:', err);
      setErrorMsg(err.message || 'Failed to send email via Gmail API.');
    } finally {
      setIsActionPending(false);
    }
  };

  // Trigger Delete/Trash Confirmation Modal
  const handleInitiateTrash = (msgId: string) => {
    setConfirmDeleteId(msgId);
  };

  // Execute Trash after explicit user confirmation
  const handleConfirmTrash = async () => {
    if (!accessToken || !confirmDeleteId) return;
    setIsActionPending(true);
    setErrorMsg(null);
    try {
      await trashGmailMessage(accessToken, confirmDeleteId);
      setSuccessMsg('Message moved to Gmail Trash.');
      setConfirmDeleteId(null);
      if (selectedMessage?.id === confirmDeleteId) {
        setSelectedMessage(null);
      }
      loadGmailData(accessToken, searchQuery);
    } catch (err: any) {
      console.error('Trash error:', err);
      setErrorMsg(err.message || 'Failed to trash email.');
    } finally {
      setIsActionPending(false);
    }
  };

  // Toggle Star / Mark Read
  const handleToggleStar = async (msg: GmailMessage) => {
    if (!accessToken) return;
    const isStarred = msg.labelIds?.includes('STARRED');
    try {
      await modifyGmailMessageLabels(
        accessToken,
        msg.id,
        isStarred ? [] : ['STARRED'],
        isStarred ? ['STARRED'] : []
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? {
                ...m,
                labelIds: isStarred
                  ? m.labelIds.filter((l) => l !== 'STARRED')
                  : [...(m.labelIds || []), 'STARRED']
              }
            : m
        )
      );
    } catch (err: any) {
      console.error('Star toggle error:', err);
    }
  };

  // Reply to Email
  const handleOpenReply = (msg: GmailMessage) => {
    setComposeTo(msg.from || '');
    setComposeSubject(msg.subject?.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`);
    setComposeBody(`\n\n--- On ${msg.date || 'date'}, ${msg.from} wrote ---\n> ${msg.snippet}`);
    setReplyMessageId(msg.id);
    setIsComposeOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-500/40 text-blue-300">
                <Mail className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tight">Gmail Official Integration</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Google OAuth Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Access your Google Workspace campus mailbox directly from CKCET CAMPRO. Send official leave requests, grievance inquiries, and placement applications securely.
            </p>
          </div>

          {/* Connection Controls */}
          {accessToken ? (
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 backdrop-blur-md">
              <div className="text-right">
                <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {profile?.emailAddress || currentUser.email}
                </div>
                <div className="text-[10px] text-slate-400">
                  {profile ? `${profile.messagesTotal} Messages in Gmail` : 'Connected via OAuth 2.0'}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-700/50 text-xs font-bold transition shrink-0"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition duration-150 transform active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isSigningIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-red-500/20 rounded-md">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="p-1 hover:bg-emerald-500/20 rounded-md">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Mail Interface */}
      {!accessToken ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-2xl mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Google Workspace Authentication Required
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Connect your official student or faculty Gmail account to view your inbox, compose campus leave orders, track grievance emails, and communicate with department faculties.
          </p>

          <div className="pt-2">
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition transform active:scale-95 disabled:opacity-50"
            >
              {isSigningIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              <span>Sign in with Google Account</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[580px] grid grid-cols-1 md:grid-cols-12">
          {/* Left Navigation Sidebar */}
          <div className="md:col-span-3 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
            <button
              onClick={() => {
                setReplyMessageId(null);
                setComposeTo('');
                setComposeSubject('');
                setComposeBody('');
                setIsComposeOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Compose Email</span>
            </button>

            {/* Folder Tabs */}
            <div className="space-y-1 pt-2">
              <button
                onClick={() => handleTabChange('INBOX')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'INBOX'
                    ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4" />
                  <span>Inbox</span>
                </div>
              </button>

              <button
                onClick={() => handleTabChange('STARRED')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'STARRED'
                    ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4" />
                  <span>Starred</span>
                </div>
              </button>

              <button
                onClick={() => handleTabChange('SENT')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'SENT'
                    ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4" />
                  <span>Sent</span>
                </div>
              </button>

              <button
                onClick={() => handleTabChange('TRASH')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'TRASH'
                    ? 'bg-red-50 dark:bg-red-950/70 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4" />
                  <span>Trash</span>
                </div>
              </button>
            </div>

            {/* Quick Templates Panel */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Campus Templates
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleApplyTemplate('leave');
                    setIsComposeOpen(true);
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition truncate"
                >
                  📝 Leave Order
                </button>
                <button
                  onClick={() => {
                    handleApplyTemplate('grievance');
                    setIsComposeOpen(true);
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition truncate"
                >
                  ⚠️ Grievance Inquiry
                </button>
                <button
                  onClick={() => {
                    handleApplyTemplate('project');
                    setIsComposeOpen(true);
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition truncate"
                >
                  🚀 Project Mentorship
                </button>
                <button
                  onClick={() => {
                    handleApplyTemplate('placement');
                    setIsComposeOpen(true);
                  }}
                  className="w-full text-left p-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition truncate"
                >
                  🎓 Placement Application
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area: Message List / Reader Pane */}
          <div className="md:col-span-9 flex flex-col h-full">
            {/* Search and Action Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Gmail (e.g., label:INBOX leave)..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadGmailData(accessToken, searchQuery)}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Refresh Gmail"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>
              </div>
            </div>

            {/* Email List or Detail View */}
            <div className="flex-1 overflow-y-auto max-h-[500px]">
              {selectedMessage ? (
                /* Detail Reader View */
                <div className="p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Messages</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStar(selectedMessage)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-500"
                        title="Star message"
                      >
                        <Star className={`w-4 h-4 ${selectedMessage.labelIds?.includes('STARRED') ? 'fill-amber-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleOpenReply(selectedMessage)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400"
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleInitiateTrash(selectedMessage.id)}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                        title="Move to Trash"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Message Metadata */}
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {selectedMessage.subject}
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {selectedMessage.from}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          To: {selectedMessage.to || 'me'}
                        </div>
                      </div>
                      <div className="text-slate-400 text-[11px] font-medium">
                        {selectedMessage.date}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200 space-y-4 min-h-[160px] leading-relaxed">
                    {selectedMessage.bodyText ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedMessage.bodyText }}
                        className="prose prose-sm dark:prose-invert max-w-none break-words"
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{selectedMessage.snippet}</p>
                    )}
                  </div>
                </div>
              ) : (
                /* List View */
                <div>
                  {isLoading ? (
                    <div className="p-12 text-center space-y-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                      <p className="text-xs text-slate-400 font-medium">Fetching messages from Gmail...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <Mail className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No emails found</p>
                      <p className="text-[11px] text-slate-400">Try changing your search or folder tab.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          className={`p-4 hover:bg-blue-50/40 dark:hover:bg-slate-800/50 cursor-pointer transition flex items-start justify-between gap-4 ${
                            !msg.isRead ? 'bg-blue-50/20 dark:bg-blue-950/20 font-semibold' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStar(msg);
                              }}
                              className="mt-0.5 text-slate-300 hover:text-amber-500 transition"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  msg.labelIds?.includes('STARRED') ? 'fill-amber-500 text-amber-500' : ''
                                }`}
                              />
                            </button>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                                  {msg.from?.replace(/<.*>/, '')}
                                </span>
                                {!msg.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {msg.subject}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-lg">
                                {msg.snippet}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-[10px] text-slate-400 font-medium">
                              {msg.date ? new Date(msg.date).toLocaleDateString() : ''}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInitiateTrash(msg.id);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition opacity-0 group-hover:opacity-100"
                              title="Delete Email"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full shadow-2xl overflow-hidden animate-scale-in space-y-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {replyMessageId ? 'Reply via Gmail' : 'Compose Official Campus Email'}
                </h3>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInitiateSend} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Email (To)
                </label>
                <input
                  type="email"
                  required
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="e.g. hod.cse@ckcet.edu.in or placement@ckcet.edu.in"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Official Email Subject"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Body Content
                </label>
                <textarea
                  required
                  rows={6}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Type your official email message here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  Sent via Google Gmail API
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Confirmation Modal before Sending (Workspace Integration Safety Rule) */}
      {confirmSendOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Confirm Email Delivery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You are about to send an email on behalf of your connected Google Account (<span className="font-bold text-slate-700 dark:text-slate-200">{profile?.emailAddress || currentUser.email}</span>):
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left space-y-1 text-xs">
              <div><span className="font-bold text-slate-500">To:</span> {composeTo}</div>
              <div className="truncate"><span className="font-bold text-slate-500">Subject:</span> {composeSubject}</div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isActionPending}
                onClick={() => setConfirmSendOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                disabled={isActionPending}
                onClick={handleConfirmSendEmail}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
              >
                {isActionPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Confirm & Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Confirmation Modal before Trashing (Workspace Integration Safety Rule) */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Move Email to Trash?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This action will move this message to your Gmail trash folder.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isActionPending}
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                disabled={isActionPending}
                onClick={handleConfirmTrash}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
              >
                {isActionPending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
