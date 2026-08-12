import React, { useState, useEffect } from 'react';
import {
  User,
  Conversation,
  ChatMessage,
  AcademicRequest,
  FacultyAnnouncement,
  CommunicationReport,
  CommunicationCategory,
  RequestStatus
} from '../../../types';
import { CommunicationService } from '../../../services/communicationService';
import { ApiService } from '../../../services/api';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { NewConversationModal } from './NewConversationModal';
import { AcademicRequestsView } from './AcademicRequestsView';
import { AnnouncementsView } from './AnnouncementsView';
import { ReportsDashboard } from './ReportsDashboard';
import {
  MessageSquare,
  HelpCircle,
  Megaphone,
  ShieldAlert,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

interface CommunicationHubProps {
  currentUser: User;
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'requests' | 'announcements' | 'reports'>('chats');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [requests, setRequests] = useState<AcademicRequest[]>([]);
  const [announcements, setAnnouncements] = useState<FacultyAnnouncement[]>([]);
  const [reports, setReports] = useState<CommunicationReport[]>([]);
  
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [facultyUsers, setFacultyUsers] = useState<User[]>([]);
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load initial datasets
  useEffect(() => {
    const convs = CommunicationService.getConversations();
    setConversations(convs);

    const msgs = CommunicationService.getMessages();
    setMessages(msgs);

    const reqs = CommunicationService.getAcademicRequests();
    setRequests(reqs);

    const anns = CommunicationService.getAnnouncements();
    setAnnouncements(anns);

    const reps = CommunicationService.getReports();
    setReports(reps);

    // Get faculty users list
    const allUsers = ApiService.getUsers();
    const facultyList = allUsers.filter(u => u.role === 'faculty' || u.role === 'admin' || u.role === 'super_admin');
    setFacultyUsers(facultyList);

    // Auto select first conversation if available
    const userConvs = convs.filter(c => c.studentId === currentUser.id || c.facultyId === currentUser.id);
    if (userConvs.length > 0 && !selectedConvId) {
      setSelectedConvId(userConvs[0].id);
    }
  }, [currentUser]);

  // Filter conversations for the current user (if student or faculty)
  const userConversations = conversations.filter(c => {
    if (currentUser.role === 'super_admin' || currentUser.role === 'admin') return true;
    return c.studentId === currentUser.id || c.facultyId === currentUser.id;
  });

  const selectedConversation = userConversations.find(c => c.id === selectedConvId) || userConversations[0] || null;
  const currentChatMessages = selectedConversation
    ? messages.filter(m => m.conversationId === selectedConversation.id).sort((a, b) => a.createdAt - b.createdAt)
    : [];

  // Handlers
  const handleSelectConv = (conv: Conversation) => {
    setSelectedConvId(conv.id);
    CommunicationService.markConversationAsRead(conv.id, currentUser.id);
    setConversations(CommunicationService.getConversations());
  };

  const handleSendMessage = (text: string, attachmentUrl?: string, attachmentName?: string) => {
    if (!selectedConversation) return;

    const receiverId = currentUser.id === selectedConversation.studentId
      ? selectedConversation.facultyId
      : selectedConversation.studentId;

    const newMsg = CommunicationService.sendMessage(
      selectedConversation.id,
      currentUser,
      receiverId,
      text,
      attachmentUrl,
      attachmentName
    );

    setMessages(CommunicationService.getMessages());
    setConversations(CommunicationService.getConversations());
    showToast('Message sent successfully!');
  };

  const handleStartNewConversation = async (data: {
    faculty: User;
    category: CommunicationCategory;
    subjectName?: string;
    message: string;
    attachmentUrl?: string;
    attachmentName?: string;
  }) => {
    const { conversation, message } = await CommunicationService.createConversation(
      currentUser,
      data.faculty,
      data.category,
      data.message,
      data.subjectName,
      data.attachmentUrl,
      data.attachmentName
    );

    setConversations(CommunicationService.getConversations());
    setMessages(CommunicationService.getMessages());
    setSelectedConvId(conversation.id);
    setActiveTab('chats');
    showToast(`Started conversation with ${data.faculty.name}`);
  };

  const handleResolveConv = (convId: string) => {
    CommunicationService.updateConversationStatus(convId, 'RESOLVED');
    setConversations(CommunicationService.getConversations());
    showToast('Conversation marked as resolved');
  };

  const handleReopenConv = (convId: string) => {
    CommunicationService.updateConversationStatus(convId, 'OPEN');
    setConversations(CommunicationService.getConversations());
    showToast('Conversation reopened');
  };

  const handleReportConv = (convId: string, reportedUserId: string, reportedUserName: string) => {
    CommunicationService.submitReport({
      conversationId: convId,
      reportedBy: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      reportedUserId,
      reportedUserName,
      reason: 'Inappropriate Language',
      description: 'Reported directly from chat interface.'
    });

    setReports(CommunicationService.getReports());
    showToast('Safety report submitted to campus administrators', 'success');
  };

  const handleDeleteMsg = (msgId: string) => {
    CommunicationService.deleteMessage(msgId);
    setMessages(CommunicationService.getMessages());
    showToast('Message deleted');
  };

  const handleToggleStarMsg = (msgId: string) => {
    CommunicationService.toggleStarMessage(msgId);
    setMessages(CommunicationService.getMessages());
  };

  const handleCreateRequest = (reqData: any) => {
    const newReq = CommunicationService.createAcademicRequest(reqData);
    setRequests(CommunicationService.getAcademicRequests());
    showToast('Academic request submitted to faculty!');
  };

  const handleUpdateRequestStatus = (reqId: string, status: RequestStatus, note?: string) => {
    CommunicationService.updateRequestStatus(reqId, status, note);
    setRequests(CommunicationService.getAcademicRequests());
    showToast(`Request status updated to ${status}`);
  };

  const handleStartChatFromRequest = (req: AcademicRequest) => {
    const targetFaculty = facultyUsers.find(f => f.id === req.facultyId) || {
      id: req.facultyId,
      name: req.facultyName,
      role: 'faculty',
      department: req.facultyDepartment || 'Engineering'
    } as User;

    handleStartNewConversation({
      faculty: targetFaculty,
      category: req.category,
      subjectName: req.subject,
      message: `Follow-up regarding Academic Request: "${req.subject}" - ${req.message}`
    });
  };

  const handleCreateAnnouncement = (annData: any) => {
    CommunicationService.createAnnouncement(annData);
    setAnnouncements(CommunicationService.getAnnouncements());
    showToast('Faculty announcement published successfully!');
  };

  const handleIncrementViews = (id: string) => {
    CommunicationService.incrementAnnouncementViews(id);
    setAnnouncements(CommunicationService.getAnnouncements());
  };

  const handleUpdateReportStatus = (reportId: string, status: CommunicationReport['status'], actionNote?: string) => {
    CommunicationService.updateReportStatus(reportId, status, actionNote);
    setReports(CommunicationService.getReports());
    showToast(`Safety report status updated to ${status}`);
  };

  const isAdminOrSuper = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2 text-xs font-bold text-white ${
            toastMessage.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-red-600 border-red-500'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Hub Navigation Bar */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none">
              Communication Hub
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Secure, role-based Student–Faculty academic messaging & guidance
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'chats'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Messages</span>
            {userConversations.some(c => (currentUser.role === 'student' ? c.unreadStudent : c.unreadFaculty) > 0) && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Academic Doubts ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Announcements ({announcements.length})</span>
          </button>

          {isAdminOrSuper && (
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Safety & Governance</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab View Area */}
      <div className="flex-1 overflow-hidden">
        
        {/* Tab 1: Direct Messages Split View */}
        {activeTab === 'chats' && (
          <div className="h-full grid grid-cols-1 md:grid-cols-12 divide-x divide-slate-200 dark:divide-slate-800 overflow-hidden">
            
            {/* Conversation Sidebar (4 Cols on md+) */}
            <div className={`h-full md:col-span-4 lg:col-span-4 ${selectedConvId ? 'hidden md:block' : 'block'}`}>
              <ConversationList
                conversations={userConversations}
                selectedConvId={selectedConvId}
                onSelectConv={handleSelectConv}
                currentUser={currentUser}
                onOpenNewModal={() => setIsNewModalOpen(true)}
              />
            </div>

            {/* Active Chat Window (8 Cols on md+) */}
            <div className={`h-full md:col-span-8 lg:col-span-8 ${!selectedConvId ? 'hidden md:block' : 'block'}`}>
              {selectedConversation ? (
                <ChatWindow
                  conversation={selectedConversation}
                  messages={currentChatMessages}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onResolveConversation={handleResolveConv}
                  onReopenConversation={handleReopenConv}
                  onReportConversation={handleReportConv}
                  onDeleteMessage={handleDeleteMsg}
                  onToggleStarMessage={handleToggleStarMsg}
                  onBack={() => setSelectedConvId(null)}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3 bg-slate-50 dark:bg-slate-950/80">
                  <div className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No Direct Conversation Selected
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Select a conversation from the sidebar or start a new direct communication thread with a faculty member.
                  </p>
                  <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-500/20"
                  >
                    + Start New Query
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Academic Requests View */}
        {activeTab === 'requests' && (
          <div className="h-full overflow-y-auto">
            <AcademicRequestsView
              requests={requests}
              currentUser={currentUser}
              facultyUsers={facultyUsers}
              onCreateRequest={handleCreateRequest}
              onUpdateStatus={handleUpdateRequestStatus}
              onStartChatFromRequest={handleStartChatFromRequest}
            />
          </div>
        )}

        {/* Tab 3: Announcements View */}
        {activeTab === 'announcements' && (
          <div className="h-full overflow-y-auto">
            <AnnouncementsView
              announcements={announcements}
              currentUser={currentUser}
              onCreateAnnouncement={handleCreateAnnouncement}
              onIncrementViews={handleIncrementViews}
            />
          </div>
        )}

        {/* Tab 4: Governance & Safety Admin View */}
        {activeTab === 'reports' && isAdminOrSuper && (
          <div className="h-full overflow-y-auto">
            <ReportsDashboard
              reports={reports}
              conversations={conversations}
              messages={messages}
              requests={requests}
              onUpdateReportStatus={handleUpdateReportStatus}
            />
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        currentUser={currentUser}
        facultyUsers={facultyUsers}
        onStart={handleStartNewConversation}
      />
    </div>
  );
};
