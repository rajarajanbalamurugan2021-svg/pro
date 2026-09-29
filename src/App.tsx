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
import { CampusStorage, subscribeToRealtimeCollection } from './services/api';
import {
  INITIAL_USERS,
  INITIAL_SKILLS,
  INITIAL_CATEGORIES,
  INITIAL_TECH_STACKS
} from './data/initialData';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AuthScreen } from './components/common/AuthScreen';
import { normalizeRole, NormalizedRole, getUserAuthorizedPortals, canAccessPortal, canAccessModule, getPortalDisplayName } from './lib/rbac';
import { AIChatbot } from './components/common/AIChatbot';
import { ToastContainer, ToastNotification } from './components/common/ToastContainer';
import { SplashScreen } from './components/common/SplashScreen';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { MobileDrawer } from './components/common/MobileDrawer';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { useAndroidBackButton } from './hooks/useAndroidBackButton';
import { Bot, Bell, Shield, Sparkles, Globe, ExternalLink, Loader2 } from 'lucide-react';

// Route-level Code Splitting for Performance
const ProjectInnovationHub = React.lazy(() => import('./components/modules/ProjectInnovation/ProjectInnovationHub').then(m => ({ default: m.ProjectInnovationHub })));
const ResultPortal = React.lazy(() => import('./components/modules/ResultPortal/ResultPortal').then(m => ({ default: m.ResultPortal })));
const ComplaintPortal = React.lazy(() => import('./components/modules/ReportingSystem/ComplaintPortal').then(m => ({ default: m.ComplaintPortal })));
const LostFoundSystem = React.lazy(() => import('./components/modules/LostFound/LostFoundSystem').then(m => ({ default: m.LostFoundSystem })));
const CollaborationHub = React.lazy(() => import('./components/modules/Collaboration/CollaborationHub').then(m => ({ default: m.CollaborationHub })));
const MentorMenteePortal = React.lazy(() => import('./components/modules/MentorMentee/MentorMenteePortal').then(m => ({ default: m.MentorMenteePortal })));
const CommunityHub = React.lazy(() => import('./components/modules/Community/CommunityHub').then(m => ({ default: m.CommunityHub })));
const LeaveManagement = React.lazy(() => import('./components/modules/LeaveManagement/LeaveManagement').then(m => ({ default: m.LeaveManagement })));
const LabAttendance = React.lazy(() => import('./components/modules/LabAttendance/LabAttendance').then(m => ({ default: m.LabAttendance })));
const PlacementSystem = React.lazy(() => import('./components/modules/PlacementSystem/PlacementSystem').then(m => ({ default: m.PlacementSystem })));
const AdminDashboard = React.lazy(() => import('./components/modules/AdminPanel/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AIChatbotModule = React.lazy(() => import('./components/modules/AIChatbotModule').then(m => ({ default: m.AIChatbotModule })));
const FirebaseCloudHubModule = React.lazy(() => import('./components/modules/FirebaseCloudHubModule').then(m => ({ default: m.FirebaseCloudHubModule })));
const FacultyAttendancePortal = React.lazy(() => import('./components/modules/FacultyAttendance/FacultyAttendancePortal').then(m => ({ default: m.FacultyAttendancePortal })));
const StudentAttendancePortal = React.lazy(() => import('./components/modules/FacultyAttendance/StudentAttendancePortal').then(m => ({ default: m.StudentAttendancePortal })));
const CoreEngineeringHub = React.lazy(() => import('./components/modules/CoreEngineering/CoreEngineeringHub').then(m => ({ default: m.CoreEngineeringHub })));
const CommunicationHub = React.lazy(() => import('./components/modules/Communication/CommunicationHub').then(m => ({ default: m.CommunicationHub })));
const GatePrepHub = React.lazy(() => import('./components/modules/GatePrep/GatePrepHub').then(m => ({ default: m.GatePrepHub })));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<string>('placement');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('campro_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // State objects initialized from CampusStorage
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const loadedUsers = CampusStorage.getUsers();
    return loadedUsers && loadedUsers.length > 0 ? loadedUsers[0] : INITIAL_USERS[0];
  });

  const [activePortal, setActivePortal] = useState<NormalizedRole>(() => {
    const saved = localStorage.getItem('campro_active_portal') as NormalizedRole;
    if (saved && ['super_admin', 'admin', 'faculty', 'student'].includes(saved)) {
      return saved;
    }
    return normalizeRole(currentUser?.role || userRole);
  });

  const authorizedPortals = getUserAuthorizedPortals(currentUser);
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
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // AI Chatbot & Mobile Drawer state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Hook for Android System Back Button & Gesture Navigation handling
  useAndroidBackButton({
    isAiOpen,
    setIsAiOpen,
    isDrawerOpen,
    setIsDrawerOpen,
    activeModule,
    setActiveModule,
    addToast: (t) => addToast({ title: t.title, message: t.message, type: 'info' })
  });

  // Helper function to trigger a Toast notification
  const addToast = (toastData: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const newToast: ToastNotification = {
      ...toastData,
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 6000);
  };

  // Initialize Data & Setup Real-time Multi-device Firestore Listeners
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

    // Subscribe to live Firestore changes across devices
    const unsubProjects = subscribeToRealtimeCollection<Project[]>('smart_campus_projects', (data) => setProjects(data));
    const unsubInvitations = subscribeToRealtimeCollection<TeamInvitation[]>('smart_campus_invitations', (data) => setInvitations(data));
    const unsubResults = subscribeToRealtimeCollection<StudentResult[]>('smart_campus_results', (data) => setStudentResults(data));
    const unsubComplaints = subscribeToRealtimeCollection<Complaint[]>('smart_campus_complaints', (data) => setComplaints(data));
    const unsubLostFound = subscribeToRealtimeCollection<LostFoundItem[]>('smart_campus_lost_found', (data) => setLostFoundItems(data));
    const unsubResources = subscribeToRealtimeCollection<Resource[]>('smart_campus_resources', (data) => setResources(data));
    const unsubMeetings = subscribeToRealtimeCollection<MeetingSchedule[]>('smart_campus_meetings', (data) => setMeetings(data));
    const unsubPosts = subscribeToRealtimeCollection<CommunityPost[]>('smart_campus_posts', (data) => setPosts(data));
    const unsubAnnouncements = subscribeToRealtimeCollection<Announcement[]>('smart_campus_announcements', (data) => setAnnouncements(data));
    const unsubLeaves = subscribeToRealtimeCollection<LeaveRequest[]>('smart_campus_leave', (data) => setLeaves(data));
    const unsubNotifications = subscribeToRealtimeCollection<NotificationItem[]>('smart_campus_notifications', (data) => setNotifications(data));
    const unsubAuditLogs = subscribeToRealtimeCollection<AuditLog[]>('smart_campus_logs', (data) => setAuditLogs(data));
    const unsubUsers = subscribeToRealtimeCollection<User[]>('smart_campus_users', (data) => setUsers(data));

    return () => {
      unsubProjects();
      unsubInvitations();
      unsubResults();
      unsubComplaints();
      unsubLostFound();
      unsubResources();
      unsubMeetings();
      unsubPosts();
      unsubAnnouncements();
      unsubLeaves();
      unsubNotifications();
      unsubAuditLogs();
      unsubUsers();
    };
  }, []);

  // Sync dark class on root html
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('campro_theme', theme);
  }, [theme]);

  // Sync activePortal when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const authPortals = getUserAuthorizedPortals(currentUser);
      const saved = localStorage.getItem('campro_active_portal') as NormalizedRole;
      if (saved && authPortals.includes(saved)) {
        setActivePortal(saved);
      } else {
        const topPortal = authPortals[0] || 'student';
        setActivePortal(topPortal);
        localStorage.setItem('campro_active_portal', topPortal);
      }
    }
  }, [currentUser]);

  // Portal Switcher Handler (NEVER logs out or changes user session)
  const handlePortalChange = (newPortal: NormalizedRole) => {
    if (!canAccessPortal(currentUser, newPortal)) {
      addToast({
        title: 'Access Restricted',
        message: `Your account is not authorized to access the ${getPortalDisplayName(newPortal)}.`,
        type: 'warning'
      });
      return;
    }

    setActivePortal(newPortal);
    localStorage.setItem('campro_active_portal', newPortal);
    setActiveModule('dashboard');

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'PORTAL_SWITCH',
      performedBy: currentUser?.name || 'User',
      userRole: currentUser?.role || 'student',
      target: `Switched active portal view to ${getPortalDisplayName(newPortal)}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    addToast({
      title: 'Portal Switched',
      message: `Active Portal set to ${getPortalDisplayName(newPortal)}. Session retained.`,
      type: 'info'
    });
  };

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
    const authPortals = getUserAuthorizedPortals(user);
    const initialPortal = authPortals[0] || normalizeRole(role);
    setActivePortal(initialPortal);
    localStorage.setItem('campro_active_portal', initialPortal);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, avatar: newAvatarUrl };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedUsers);
    CampusStorage.saveUsers(updatedUsers);
    localStorage.setItem('campro_current_user', JSON.stringify(updatedUser));
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

    // Trigger visual Toast alert for relevant roles (admin, super_admin, faculty)
    addToast({
      title: '🚨 New Complaint Filed',
      message: `${newComp.title} (${newComp.category}) — Submitted by ${newComp.studentName}`,
      type: 'complaint',
      targetRoles: ['admin', 'super_admin', 'faculty'],
      actionModule: 'complaints',
      actionLabel: 'View Complaints'
    });

    // Add persistent system notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Grievance Registered',
      message: `${newComp.studentName} filed: "${newComp.title}" (${newComp.category})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'warning',
      read: false,
      linkModule: 'complaints'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    CampusStorage.saveNotifications(updatedNotifs);
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

    // Trigger visual Toast alert for relevant roles (admin, super_admin, faculty, mentor)
    addToast({
      title: '📝 New Leave Application Submitted',
      message: `${lv.studentName} applied for ${lv.type} (${lv.startDate} to ${lv.endDate})`,
      type: 'leave',
      targetRoles: ['admin', 'super_admin', 'faculty', 'mentor'],
      actionModule: 'leave',
      actionLabel: 'Review Leave'
    });

    // Add persistent system notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Leave Request',
      message: `${lv.studentName} requested ${lv.type} (${lv.startDate} - ${lv.endDate})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'info',
      read: false,
      linkModule: 'leave'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    CampusStorage.saveNotifications(updatedNotifs);
  };

  const handleApproveRejectLeave = (id: string, status: 'Approved' | 'Rejected') => {
    const updated = leaves.map((l) => (l.id === id ? { ...l, status } : l));
    setLeaves(updated);
    CampusStorage.saveLeaveRequests(updated);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    CampusStorage.saveNotifications(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    CampusStorage.saveNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    CampusStorage.saveNotifications([]);
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
    return (
      <>
        <AuthScreen users={users} onLogin={handleLogin} />
        <PWAInstallPrompt />
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} durationMs={1200} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        userRole={userRole}
        activePortal={activePortal}
        authorizedPortals={authorizedPortals}
        onPortalChange={handlePortalChange}
        theme={theme}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onNavigateModule={(mod) => setActiveModule(mod)}
        onRoleChange={handleRoleChange}
        onToggleTheme={handleToggleTheme}
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        onLogout={handleLogout}
        onUpdateAvatar={handleUpdateAvatar}
        onOpenAiDrawer={() => setIsAiOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full max-w-full overflow-x-hidden min-w-0">
        
        {/* Sidebar */}
        <Sidebar
          activeModule={activeModule}
          activeTab={activeModule}
          activePortal={activePortal}
          userRole={userRole}
          onSelectModule={(mod) => setActiveModule(mod)}
          onTabChange={(mod) => setActiveModule(mod)}
          onLogout={handleLogout}
          pendingComplaintsCount={complaints.filter((c) => c.status === 'Pending').length}
          pendingLeavesCount={leaves.filter((l) => l.status === 'Pending').length}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full min-w-0 p-3 sm:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
          <React.Suspense
            fallback={
              <div className="flex flex-col items-center justify-center p-12 my-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl text-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Loading module components...
                </span>
              </div>
            }
          >
          {(activeModule === 'core_engineering' || activeModule === 'gate_prep' || activeModule === 'higher_studies' || activeModule === 'software_hub' || activeModule === 'core_careers') && (
            <CoreEngineeringHub
              userRole={userRole}
              userEmail={currentUser?.email || ''}
              initialTab={activeModule}
              onNavigateToModule={(mod) => setActiveModule(mod)}
            />
          )}

          {(activeModule === 'projects' || activeModule === 'project_innovation') && (
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
              defaultTab="student_view"
            />
          )}

          {activeModule === 'attendance' && (
            userRole === 'student' ? (
              <StudentAttendancePortal currentUser={currentUser} />
            ) : (
              <FacultyAttendancePortal currentUser={currentUser} userRole={userRole} />
            )
          )}

          {activeModule === 'marks' && (
            <ResultPortal
              results={studentResults}
              result={currentStudentResult}
              userRole={userRole}
              onUpdateResults={setStudentResults}
              defaultTab="faculty_marks"
            />
          )}

          {activeModule === 'gpa_calculator' && (
            <ResultPortal
              results={studentResults}
              result={currentStudentResult}
              userRole={userRole}
              onUpdateResults={setStudentResults}
              defaultTab="calculator"
            />
          )}

          {(activeModule === 'reports' || activeModule === 'analytics') && (
            <ResultPortal
              results={studentResults}
              result={currentStudentResult}
              userRole={userRole}
              onUpdateResults={setStudentResults}
              defaultTab="analytics"
            />
          )}

          {(activeModule === 'reporting' || activeModule === 'complaints') && (
            <ComplaintPortal
              complaints={complaints}
              userRole={userRole}
              currentUserId={currentUser?.id || 'usr-1'}
              currentUserName={currentUser?.name || 'User'}
              currentUser={currentUser}
              users={users}
              onAddComplaint={handleAddComplaint}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
              onAddToast={addToast}
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

          {(activeModule === 'collaboration' || activeModule === 'downloads') && (
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
              onNavigateToModule={(mod) => setActiveModule(mod)}
            />
          )}

          {(activeModule === 'community' || activeModule === 'announcements') && (
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

          {(activeModule === 'leave' || activeModule === 'leave_management') && (
            <LeaveManagement
              leaves={leaves}
              userRole={userRole}
              currentUserId={currentUser?.id || 'usr-1'}
              currentUserName={currentUser?.name || 'User'}
              currentUser={currentUser}
              onApplyLeave={handleApplyLeave}
              onApproveRejectLeave={handleApproveRejectLeave}
            />
          )}

          {(activeModule === 'placement' || activeModule === 'placement_system' || activeModule === 'my_profile') && (
            <PlacementSystem
              user={currentUser}
              initialTab={activeModule === 'my_profile' ? 'profile' : undefined}
              onUpdateUser={(updatedUser) => {
                setCurrentUser(updatedUser);
                const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
                setUsers(updatedUsers);
                CampusStorage.saveUsers(updatedUsers);
              }}
            />
          )}

          {(activeModule === 'communication' || activeModule === 'communication_hub' || activeModule === 'messages') && (
            <CommunicationHub currentUser={currentUser} />
          )}

          {(activeModule === 'ai_chatbot' || activeModule === 'ai_assistant') && (
            <AIChatbotModule currentUser={currentUser} />
          )}

          {(activeModule === 'cloud_db' || activeModule === 'cloud_collation' || activeModule === 'firestore_hub') && (
            (normalizeRole(userRole) === 'admin' || normalizeRole(userRole) === 'super_admin') ? (
              <FirebaseCloudHubModule />
            ) : (
              <div className="p-8 max-w-lg mx-auto my-12 bg-slate-900 border border-red-500/30 rounded-3xl text-center text-white shadow-2xl">
                <Shield className="w-12 h-12 mx-auto text-red-400 mb-3" />
                <h3 className="text-xl font-black">Access Restricted</h3>
                <p className="text-xs text-slate-300 mt-2">
                  Cloud Database administration and Firestore synchronization are strictly restricted to Administrators.
                </p>
                <button
                  onClick={() => setActiveModule('dashboard')}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg"
                >
                  Return to Dashboard
                </button>
              </div>
            )
          )}

          {(activeModule === 'admin' ||
            activeModule === 'user_management' ||
            activeModule === 'students' ||
            activeModule === 'my_students' ||
            activeModule === 'faculty' ||
            activeModule === 'departments' ||
            activeModule === 'courses' ||
            activeModule === 'my_courses' ||
            activeModule === 'system_settings' ||
            activeModule === 'audit_logs') && (
            (activePortal === 'admin' || activePortal === 'super_admin' || activePortal === 'faculty' || userRole === 'admin' || userRole === 'super_admin' || userRole === 'faculty') ? (
              <AdminDashboard
                userRole={userRole}
                activePortal={activePortal}
                users={users}
                complaints={complaints}
                leaves={leaves}
                resources={resources}
                auditLogs={auditLogs}
                onUpdateUsers={setUsers}
                onResetDatabase={() => {}}
                initialTab={
                  activeModule === 'user_management' || activeModule === 'students' || activeModule === 'my_students'
                    ? 'students'
                    : activeModule === 'faculty'
                    ? 'faculty'
                    : activeModule === 'departments' || activeModule === 'courses' || activeModule === 'my_courses'
                    ? 'departments'
                    : activeModule === 'system_settings'
                    ? 'system_settings'
                    : activeModule === 'audit_logs'
                    ? 'audit_logs'
                    : 'metrics'
                }
              />
            ) : (
              <div className="p-8 max-w-2xl mx-auto my-12 rounded-3xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-2xl text-center space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/80 flex items-center justify-center text-red-600 dark:text-red-400 ring-8 ring-red-50 dark:ring-red-950/30">
                  <Shield className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Access Restricted: Campus Admin Control
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  Campus Admin Control is strictly restricted to <span className="font-bold text-purple-600 dark:text-purple-400">Admins</span>. Your current account role (<span className="font-semibold text-slate-900 dark:text-white capitalize">{userRole.replace('_', ' ')}</span>) does not have authorization to access system administrative settings.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setActiveModule('placement')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition"
                  >
                    Return to Campus Dashboard
                  </button>
                </div>
              </div>
            )
          )}

          {(activeModule === 'dashboard' || activeModule === 'overview') && (
            (userRole === 'admin' || userRole === 'super_admin') ? (
              <AdminDashboard
                userRole={userRole}
                users={users}
                complaints={complaints}
                leaves={leaves}
                resources={resources}
                auditLogs={auditLogs}
                onUpdateUsers={setUsers}
                onResetDatabase={() => {}}
                initialTab="metrics"
              />
            ) : (
              <PlacementSystem
                user={currentUser}
                onUpdateUser={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
                  setUsers(updatedUsers);
                  CampusStorage.saveUsers(updatedUsers);
                }}
              />
            )
          )}
          </React.Suspense>

          {/* Global Campus Portal Footer */}
          <footer className="mt-12 pt-6 pb-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
            <div className="flex flex-wrap items-center justify-center gap-2 font-medium">
              <span className="font-bold text-slate-700 dark:text-slate-200">CAMPRO</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold uppercase border border-blue-200 dark:border-blue-800">Campus ERP</span>
              <span>•</span>
              <span>Unified Academic & Campus Intelligence Portal</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span>Enterprise Edition</span>
              </span>
            </div>
          </footer>
        </main>
      </div>

      {/* Toast Notifications System */}
      <ToastContainer
        toasts={toasts}
        userRole={userRole}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        onNavigateModule={(mod) => setActiveModule(mod)}
      />

      {/* Reusable Floating AI Chatbot Component */}
      <AIChatbot
        currentUser={currentUser}
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onOpen={() => setIsAiOpen(true)}
      />

      {/* Native Mobile Bottom Navigation Bar (Android Touch Optimized) */}
      <MobileBottomNav
        activeModule={activeModule}
        userRole={activePortal}
        onSelectModule={(mod) => setActiveModule(mod)}
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        onOpenAiChat={() => setIsAiOpen(true)}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
      />

      {/* Native Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentUser={currentUser}
        userRole={userRole}
        activePortal={activePortal}
        authorizedPortals={authorizedPortals}
        onRoleChange={handleRoleChange}
        onPortalChange={handlePortalChange}
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
        onLogout={handleLogout}
        onOpenAiChat={() => setIsAiOpen(true)}
      />

      {/* PWA App Install Banner */}
      <PWAInstallPrompt />

      {/* Full-Screen Native Android App Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} durationMs={1200} />
      )}

    </div>
  );
}
