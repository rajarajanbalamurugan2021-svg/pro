import React, { useState, useEffect } from 'react';
import {
  UserRole,
  User,
  StudentResult,
  Complaint,
  LostFoundItem,
  Resource,
  MentorAssignment,
  MeetingSchedule,
  CommunityPost,
  Announcement,
  LeaveRequest,
  StudentAttendanceSummary,
  AuditLog,
  NotificationItem,
  Project,
  SkillItem,
  CategoryItem,
  TechStackItem,
  TeamInvitation
} from './types';
import { CampusStorage } from './services/api';
import {
  INITIAL_USERS,
  INITIAL_SKILLS,
  INITIAL_CATEGORIES,
  INITIAL_TECH_STACKS
} from './data/initialData';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AuthScreen } from './components/common/AuthScreen';
import { ProjectInnovationHub } from './components/modules/ProjectInnovation/ProjectInnovationHub';
import { ResultPortal } from './components/modules/ResultPortal/ResultPortal';
import { ComplaintPortal } from './components/modules/ReportingSystem/ComplaintPortal';
import { LostFoundSystem } from './components/modules/LostFound/LostFoundSystem';
import { CollaborationHub } from './components/modules/Collaboration/CollaborationHub';
import { MentorMenteePortal } from './components/modules/MentorMentee/MentorMenteePortal';
import { CommunityHub } from './components/modules/Community/CommunityHub';
import { LeaveManagement } from './components/modules/LeaveManagement/LeaveManagement';
import { LabAttendance } from './components/modules/LabAttendance/LabAttendance';
import { AdminDashboard } from './components/modules/AdminPanel/AdminDashboard';
import { AICampusAssistant } from './components/AICampusAssistant/AICampusAssistant';
import { Bot, Bell, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<string>('projects');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // State objects initialized from CampusStorage
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const loadedUsers = CampusStorage.getUsers();
    return loadedUsers && loadedUsers.length > 0 ? loadedUsers[0] : INITIAL_USERS[0];
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [skills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [categories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [techStacks] = useState<TechStackItem[]>(INITIAL_TECH_STACKS);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [meetings, setMeetings] = useState<MeetingSchedule[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [labAttendance, setLabAttendance] = useState<StudentAttendanceSummary>(CampusStorage.getLabAttendance());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // AI Drawer state
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Initialize Data on mount
  useEffect(() => {
    const u = CampusStorage.getUsers();
    setUsers(u);
    if (u && u.length > 0 && !currentUser) {
      setCurrentUser(u[0]);
    }
    setProjects(CampusStorage.getProjects());
    setInvitations(CampusStorage.getInvitations());
    setStudentResults(CampusStorage.getResults());
    setComplaints(CampusStorage.getComplaints());
    setLostFoundItems(CampusStorage.getLostFound());
    setResources(CampusStorage.getResources());
    setAssignments(CampusStorage.getMentorAssignments());
    setMeetings(CampusStorage.getMeetings());
    setPosts(CampusStorage.getCommunityPosts());
    setAnnouncements(CampusStorage.getAnnouncements());
    setLeaves(CampusStorage.getLeaveRequests());
    setAuditLogs(CampusStorage.getAuditLogs());
    setNotifications(CampusStorage.getNotifications());
  }, []);

  // Sync dark class on root html
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Role switcher handler
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    const matchedUser = users.find((u) => u.role === role) || users[0] || INITIAL_USERS[0];
    setCurrentUser(matchedUser);
  };

  // Auth Handlers
  const handleLogin = (user: User, role: UserRole) => {
    setCurrentUser(user);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Theme toggle handler
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Handlers for modules
  const handleUpdateProjects = (updated: Project[]) => {
    setProjects(updated);
    CampusStorage.saveProjects(updated);
  };

  const handleUpdateInvitations = (updated: TeamInvitation[]) => {
    setInvitations(updated);
    CampusStorage.saveInvitations(updated);
  };

  const handleAddComplaint = (newComp: Complaint) => {
    const updated = [newComp, ...complaints];
    setComplaints(updated);
    CampusStorage.saveComplaints(updated);
  };

  const handleUpdateComplaintStatus = (id: string, status: Complaint['status']) => {
    const updated = complaints.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toLocaleString() } : c));
    setComplaints(updated);
    CampusStorage.saveComplaints(updated);
  };

  const handleAddLostFound = (item: LostFoundItem) => {
    const updated = [item, ...lostFoundItems];
    setLostFoundItems(updated);
    CampusStorage.saveLostFound(updated);
  };

  const handleUpdateLostFoundStatus = (id: string, status: LostFoundItem['status'], claimedBy?: string) => {
    const updated = lostFoundItems.map((i) => (i.id === id ? { ...i, status, claimedBy } : i));
    setLostFoundItems(updated);
    CampusStorage.saveLostFound(updated);
  };

  const handleAddResource = (res: Resource) => {
    const updated = [res, ...resources];
    setResources(updated);
    CampusStorage.saveResources(updated);
  };

  const handleIncrementDownload = (id: string) => {
    const updated = resources.map((r) => (r.id === id ? { ...r, downloadsCount: r.downloadsCount + 1 } : r));
    setResources(updated);
    CampusStorage.saveResources(updated);
  };

  const handleAddMeeting = (meet: MeetingSchedule) => {
    const updated = [meet, ...meetings];
    setMeetings(updated);
    CampusStorage.saveMeetings(updated);
  };

  const handleAddPost = (post: CommunityPost) => {
    const updated = [post, ...posts];
    setPosts(updated);
    CampusStorage.saveCommunityPosts(updated);
  };

  const handleToggleLike = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    });
    setPosts(updated);
    CampusStorage.saveCommunityPosts(updated);
  };

  const handleAddComment = (postId: string, text: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              authorName: currentUser.name,
              authorAvatar: currentUser.avatar,
              content: text,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return p;
    });
    setPosts(updated);
    CampusStorage.saveCommunityPosts(updated);
  };

  const handleVotePoll = (postId: string, optionIndex: number) => {
    const updated = posts.map((p) => {
      if (p.id === postId && p.poll) {
        const options = [...p.poll.options];
        options[optionIndex] = { ...options[optionIndex], votes: options[optionIndex].votes + 1 };
        return {
          ...p,
          poll: {
            ...p.poll,
            options,
            totalVotes: p.poll.totalVotes + 1
          }
        };
      }
      return p;
    });
    setPosts(updated);
    CampusStorage.saveCommunityPosts(updated);
  };

  const handleApplyLeave = (lv: LeaveRequest) => {
    const updated = [lv, ...leaves];
    setLeaves(updated);
    CampusStorage.saveLeaveRequests(updated);
  };

  const handleApproveRejectLeave = (id: string, status: 'Approved' | 'Rejected') => {
    const updated = leaves.map((l) => (l.id === id ? { ...l, status } : l));
    setLeaves(updated);
    CampusStorage.saveLeaveRequests(updated);
  };

  const currentStudentResult = (studentResults && studentResults.length > 0 ? studentResults[0] : null) || {
    id: 'res-default',
    studentId: currentUser?.id || 'usr-1',
    rollNumber: 'CS2023001',
    studentName: currentUser?.name || 'Student',
    department: currentUser?.department || 'Computer Science & Engineering',
    semester: 6,
    batch: '2022-2026',
    sgpa: 8.92,
    cgpa: 8.74,
    rank: 4,
    totalCredits: 124,
    publishedDate: 'July 15, 2026',
    subjects: []
  };

  if (!isAuthenticated) {
    return <AuthScreen users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        userRole={userRole}
        theme={theme}
        notifications={notifications}
        onRoleChange={handleRoleChange}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        onOpenAiDrawer={() => setIsAiOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar
          activeModule={activeModule}
          activeTab={activeModule}
          userRole={userRole}
          onSelectModule={(mod) => setActiveModule(mod)}
          onTabChange={(mod) => setActiveModule(mod)}
          onLogout={handleLogout}
          pendingComplaintsCount={complaints.filter((c) => c.status === 'Pending').length}
          pendingLeavesCount={leaves.filter((l) => l.status === 'Pending').length}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {(activeModule === 'projects' || activeModule === 'overview' || activeModule === 'project_innovation') && (
            <ProjectInnovationHub
              userRole={userRole}
              currentUser={currentUser}
              projects={projects}
              users={users}
              skills={skills}
              categories={categories}
              techStacks={techStacks}
              invitations={invitations}
              onUpdateProjects={handleUpdateProjects}
              onUpdateInvitations={handleUpdateInvitations}
              onRoleSwitch={handleRoleChange}
            />
          )}

          {activeModule === 'results' && (
            <ResultPortal
              results={studentResults}
              result={currentStudentResult}
              userRole={userRole}
              onUpdateResults={setStudentResults}
            />
          )}

          {activeModule === 'reporting' && (
            <ComplaintPortal
              complaints={complaints}
              userRole={userRole}
              currentUserId={currentUser?.id || 'usr-1'}
              currentUserName={currentUser?.name || 'User'}
              onAddComplaint={handleAddComplaint}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
            />
          )}

          {activeModule === 'lost_found' && (
            <LostFoundSystem
              items={lostFoundItems}
              userRole={userRole}
              currentUserId={currentUser?.id || 'usr-1'}
              onAddItem={handleAddLostFound}
              onUpdateStatus={handleUpdateLostFoundStatus}
            />
          )}

          {activeModule === 'collaboration' && (
            <CollaborationHub
              resources={resources}
              userRole={userRole}
              currentUserId={currentUser?.id || 'usr-1'}
              currentUserName={currentUser?.name || 'User'}
              onAddResource={handleAddResource}
              onIncrementDownload={handleIncrementDownload}
            />
          )}

          {activeModule === 'mentor' && (
            <MentorMenteePortal
              assignments={assignments}
              meetings={meetings}
              userRole={userRole}
              currentUserId={currentUser?.id || 'usr-1'}
              currentUserName={currentUser?.name || 'User'}
              onAddMeeting={handleAddMeeting}
            />
          )}

          {activeModule === 'community' && (
            <CommunityHub
              posts={posts}
              announcements={announcements}
              userRole={userRole}
              currentUserName={currentUser?.name || 'User'}
              currentUserAvatar={currentUser?.avatar || ''}
              onAddPost={handleAddPost}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              onVotePoll={handleVotePoll}
            />
          )}

          {activeModule === 'leave' && (
            <LeaveManagement
              leaves={leaves}
              userRole={userRole}
              currentUserId={currentUser?.id || 'usr-1'}
              currentUserName={currentUser?.name || 'User'}
              onApplyLeave={handleApplyLeave}
              onApproveRejectLeave={handleApproveRejectLeave}
            />
          )}

          {activeModule === 'attendance' && (
            <LabAttendance
              attendanceData={labAttendance}
              userRole={userRole}
            />
          )}

          {activeModule === 'admin' && (
            <AdminDashboard
              users={users}
              complaints={complaints}
              leaves={leaves}
              resources={resources}
              auditLogs={auditLogs}
              onUpdateUsers={setUsers}
              onResetDatabase={() => {}}
            />
          )}
        </main>
      </div>

      {/* Floating AI Assistant Trigger Button */}
      {!isAiOpen && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-purple-500/25 hover:scale-105 active:scale-95 transition flex items-center gap-2 font-bold text-xs"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Campus Assistant</span>
        </button>
      )}

      {/* AI Campus Assistant Drawer */}
      <AICampusAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}
