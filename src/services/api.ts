import {
  User,
  StudentResult,
  Complaint,
  LostFoundItem,
  Resource,
  MeetingSchedule,
  MentorAssignment,
  LeaveRequest,
  LeaveTypeConfig,
  AcademicHoliday,
  LeavePolicyConfig,
  CommunityPost,
  Announcement,
  NotificationItem,
  AuditLog,
  Department,
  Project,
  TeamInvitation,
  PlacementOpportunity,
  PlacementApplication,
  InterviewQuestion
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_RESULTS,
  INITIAL_COMPLAINTS,
  INITIAL_LOST_FOUND,
  INITIAL_RESOURCES,
  INITIAL_MEETINGS,
  INITIAL_LEAVE_REQUESTS,
  DEFAULT_LEAVE_TYPES,
  DEFAULT_HOLIDAYS,
  DEFAULT_LEAVE_POLICY,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ATTENDANCE,
  INITIAL_MENTOR_ASSIGNMENTS,
  INITIAL_PROJECTS,
  INITIAL_TEAM_INVITATIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEW_QUESTIONS
} from '../data/initialData';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc
} from 'firebase/firestore';

const STORAGE_KEYS = {
  USERS: 'smart_campus_users',
  DEPARTMENTS: 'smart_campus_depts',
  RESULTS: 'smart_campus_results',
  COMPLAINTS: 'smart_campus_complaints',
  LOST_FOUND: 'smart_campus_lost_found',
  RESOURCES: 'smart_campus_resources',
  MEETINGS: 'smart_campus_meetings',
  LEAVE: 'smart_campus_leave',
  LEAVE_TYPES: 'smart_campus_leave_types',
  HOLIDAYS: 'smart_campus_holidays',
  LEAVE_POLICY: 'smart_campus_leave_policy',
  POSTS: 'smart_campus_posts',
  ANNOUNCEMENTS: 'smart_campus_announcements',
  NOTIFICATIONS: 'smart_campus_notifications',
  LOGS: 'smart_campus_logs',
  ACTIVE_USER: 'smart_campus_active_user',
  THEME: 'smart_campus_theme',
  PROJECTS: 'smart_campus_projects',
  INVITATIONS: 'smart_campus_invitations',
  OPPORTUNITIES: 'smart_campus_opportunities',
  APPLICATIONS: 'smart_campus_applications',
  INTERVIEW_QUESTIONS: 'smart_campus_interview_questions'
};

// Firestore Collection Names Mapping
export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  COMPLAINTS: 'complaints',
  LEAVE_REQUESTS: 'leaveRequests',
  NOTIFICATIONS: 'notifications',
  DEPARTMENTS: 'departments',
  RESULTS: 'student_results',
  POSTS: 'communityPosts',
  TEAMS: 'teams',
  PLACEMENTS: 'placements',
  INTERNSHIPS: 'internships',
  AUDIT_LOGS: 'audit_logs'
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Asynchronously push to Cloud Firestore for real-time multi-device sync
    if (db) {
      // 1. Single document store sync
      setDoc(doc(db, 'ckcet_campro', key), { data: value, updatedAt: Date.now() }, { merge: true })
        .catch((err) => console.warn(`Firestore sync error for ${key}:`, err));

      // 2. Map key to dedicated Firestore collection for granular CRUD
      const collectionMapping: Record<string, string> = {
        'smart_campus_users': FIRESTORE_COLLECTIONS.USERS,
        'smart_campus_depts': FIRESTORE_COLLECTIONS.DEPARTMENTS,
        'smart_campus_results': FIRESTORE_COLLECTIONS.RESULTS,
        'smart_campus_complaints': FIRESTORE_COLLECTIONS.COMPLAINTS,
        'smart_campus_leave': FIRESTORE_COLLECTIONS.LEAVE_REQUESTS,
        'smart_campus_posts': FIRESTORE_COLLECTIONS.POSTS,
        'smart_campus_notifications': FIRESTORE_COLLECTIONS.NOTIFICATIONS,
        'smart_campus_projects': FIRESTORE_COLLECTIONS.PROJECTS,
        'smart_campus_invitations': FIRESTORE_COLLECTIONS.TEAMS,
        'smart_campus_opportunities': FIRESTORE_COLLECTIONS.PLACEMENTS,
        'smart_campus_applications': FIRESTORE_COLLECTIONS.INTERNSHIPS,
        'smart_campus_logs': FIRESTORE_COLLECTIONS.AUDIT_LOGS
      };

      const targetCol = collectionMapping[key];
      if (targetCol && Array.isArray(value)) {
        value.forEach((item: any, idx: number) => {
          const docId = item.id || item.leaveId || item.complaintId || item.projectId || item.userId || `item_${idx}`;
          setDoc(doc(db, targetCol, String(docId)), { ...item, updatedAt: Date.now() }, { merge: true })
            .catch(() => {});
        });
      }
    }
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

// Universal Real-time Listener for Keyed Global Documents
export function subscribeToRealtimeCollection<T>(key: string, callback: (data: T) => void) {
  if (!db) return () => {};
  return onSnapshot(
    doc(db, 'ckcet_campro', key),
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.data();
        if (val && (Array.isArray(val.data) || typeof val.data === 'object')) {
          try {
            localStorage.setItem(key, JSON.stringify(val.data));
          } catch (_) {}
          callback(val.data as T);
        }
      }
    },
    (error) => {
      console.warn(`Firestore subscription notice for ${key}:`, error);
    }
  );
}

// Dedicated Real-time Listeners for Firestore Collections
export function subscribeToFirestoreCollection<T>(collectionName: string, callback: (data: T[]) => void) {
  if (!db) return () => {};
  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as T);
      });
      if (items.length > 0) {
        callback(items);
      }
    },
    (error) => {
      console.warn(`Firestore subscription notice for collection ${collectionName}:`, error);
    }
  );
}

export function subscribeToUsers(callback: (users: User[]) => void) {
  const unsubCol = subscribeToFirestoreCollection<User>(FIRESTORE_COLLECTIONS.USERS, (users) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    callback(users);
  });
  const unsubDoc = subscribeToRealtimeCollection<User[]>(STORAGE_KEYS.USERS, callback);
  return () => {
    unsubCol();
    unsubDoc();
  };
}

export function subscribeToProjects(callback: (projects: Project[]) => void) {
  const unsubCol = subscribeToFirestoreCollection<Project>(FIRESTORE_COLLECTIONS.PROJECTS, (projects) => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    callback(projects);
  });
  const unsubDoc = subscribeToRealtimeCollection<Project[]>(STORAGE_KEYS.PROJECTS, callback);
  return () => {
    unsubCol();
    unsubDoc();
  };
}

export function subscribeToComplaints(callback: (complaints: Complaint[]) => void) {
  const unsubCol = subscribeToFirestoreCollection<Complaint>(FIRESTORE_COLLECTIONS.COMPLAINTS, (complaints) => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    callback(complaints);
  });
  const unsubDoc = subscribeToRealtimeCollection<Complaint[]>(STORAGE_KEYS.COMPLAINTS, callback);
  return () => {
    unsubCol();
    unsubDoc();
  };
}

export function subscribeToLeaveRequests(callback: (leaves: LeaveRequest[]) => void) {
  const unsubCol = subscribeToFirestoreCollection<LeaveRequest>(FIRESTORE_COLLECTIONS.LEAVE_REQUESTS, (leaves) => {
    localStorage.setItem(STORAGE_KEYS.LEAVE, JSON.stringify(leaves));
    callback(leaves);
  });
  const unsubDoc = subscribeToRealtimeCollection<LeaveRequest[]>(STORAGE_KEYS.LEAVE, callback);
  return () => {
    unsubCol();
    unsubDoc();
  };
}

export function subscribeToNotifications(callback: (notifications: NotificationItem[]) => void) {
  const unsubCol = subscribeToFirestoreCollection<NotificationItem>(FIRESTORE_COLLECTIONS.NOTIFICATIONS, (notifs) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    callback(notifs);
  });
  const unsubDoc = subscribeToRealtimeCollection<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, callback);
  return () => {
    unsubCol();
    unsubDoc();
  };
}

// Generic Firestore CRUD operations
export async function getFirestoreDocs<T>(collectionName: string): Promise<T[]> {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const results: T[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    return results;
  } catch (err) {
    console.error(`Error fetching docs from ${collectionName}:`, err);
    return [];
  }
}

export async function saveFirestoreDoc(collectionName: string, docId: string, data: any): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, collectionName, String(docId)), { ...data, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.error(`Error saving doc ${docId} in ${collectionName}:`, err);
  }
}

export async function addFirestoreDoc(collectionName: string, data: any): Promise<string> {
  if (!db) return `temp_${Date.now()}`;
  try {
    const docRef = await addDoc(collection(db, collectionName), { ...data, createdAt: Date.now(), updatedAt: Date.now() });
    return docRef.id;
  } catch (err) {
    console.error(`Error adding doc to ${collectionName}:`, err);
    return `temp_${Date.now()}`;
  }
}

export async function updateFirestoreDoc(collectionName: string, docId: string, data: any): Promise<void> {
  if (!db) return;
  try {
    await updateDoc(doc(db, collectionName, String(docId)), { ...data, updatedAt: Date.now() });
  } catch (err) {
    console.error(`Error updating doc ${docId} in ${collectionName}:`, err);
  }
}

export async function deleteFirestoreDoc(collectionName: string, docId: string): Promise<void> {
  if (!db) return;
  try {
    await deleteDoc(doc(db, collectionName, String(docId)));
  } catch (err) {
    console.error(`Error deleting doc ${docId} in ${collectionName}:`, err);
  }
}

// Collection Specific Firestore CRUD Functions
export async function getUsersFirestore(): Promise<User[]> {
  return getFirestoreDocs<User>(FIRESTORE_COLLECTIONS.USERS);
}

export async function saveUserFirestore(user: User): Promise<void> {
  const userId = user.id || (user as any).userId || `user_${Date.now()}`;
  await saveFirestoreDoc(FIRESTORE_COLLECTIONS.USERS, userId, user);
}

export async function deleteUserFirestore(userId: string): Promise<void> {
  await deleteFirestoreDoc(FIRESTORE_COLLECTIONS.USERS, userId);
}

export async function getProjectsFirestore(): Promise<Project[]> {
  return getFirestoreDocs<Project>(FIRESTORE_COLLECTIONS.PROJECTS);
}

export async function saveProjectFirestore(project: Project): Promise<void> {
  const projectId = project.id || (project as any).projectId || `proj_${Date.now()}`;
  await saveFirestoreDoc(FIRESTORE_COLLECTIONS.PROJECTS, projectId, project);
}

export async function deleteProjectFirestore(projectId: string): Promise<void> {
  await deleteFirestoreDoc(FIRESTORE_COLLECTIONS.PROJECTS, projectId);
}

export async function getComplaintsFirestore(): Promise<Complaint[]> {
  return getFirestoreDocs<Complaint>(FIRESTORE_COLLECTIONS.COMPLAINTS);
}

export async function saveComplaintFirestore(complaint: Complaint): Promise<void> {
  const complaintId = complaint.id || (complaint as any).complaintId || `comp_${Date.now()}`;
  await saveFirestoreDoc(FIRESTORE_COLLECTIONS.COMPLAINTS, complaintId, complaint);
}

export async function deleteComplaintFirestore(complaintId: string): Promise<void> {
  await deleteFirestoreDoc(FIRESTORE_COLLECTIONS.COMPLAINTS, complaintId);
}

export async function getLeaveRequestsFirestore(): Promise<LeaveRequest[]> {
  return getFirestoreDocs<LeaveRequest>(FIRESTORE_COLLECTIONS.LEAVE_REQUESTS);
}

export async function saveLeaveRequestFirestore(leave: LeaveRequest): Promise<void> {
  const leaveId = leave.id || (leave as any).leaveId || `leave_${Date.now()}`;
  await saveFirestoreDoc(FIRESTORE_COLLECTIONS.LEAVE_REQUESTS, leaveId, leave);
}

export async function deleteLeaveRequestFirestore(leaveId: string): Promise<void> {
  await deleteFirestoreDoc(FIRESTORE_COLLECTIONS.LEAVE_REQUESTS, leaveId);
}

export async function getNotificationsFirestore(): Promise<NotificationItem[]> {
  return getFirestoreDocs<NotificationItem>(FIRESTORE_COLLECTIONS.NOTIFICATIONS);
}

export async function saveNotificationFirestore(notif: NotificationItem): Promise<void> {
  const notifId = notif.id || `notif_${Date.now()}`;
  await saveFirestoreDoc(FIRESTORE_COLLECTIONS.NOTIFICATIONS, notifId, notif);
}

export async function deleteNotificationFirestore(notifId: string): Promise<void> {
  await deleteFirestoreDoc(FIRESTORE_COLLECTIONS.NOTIFICATIONS, notifId);
}

export class CampusStorage {
  static getUsers(): User[] {
    return getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static saveUsers(users: User[]) {
    setStored(STORAGE_KEYS.USERS, users);
  }

  static getDepartments(): Department[] {
    return getStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }

  static saveDepartments(depts: Department[]) {
    setStored(STORAGE_KEYS.DEPARTMENTS, depts);
  }

  static getResults(): StudentResult[] {
    return getStored(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
  }

  static saveResults(results: StudentResult[]) {
    setStored(STORAGE_KEYS.RESULTS, results);
  }

  static getComplaints(): Complaint[] {
    return getStored(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  }

  static saveComplaints(complaints: Complaint[]) {
    setStored(STORAGE_KEYS.COMPLAINTS, complaints);
  }

  static getLostFound(): LostFoundItem[] {
    return getStored(STORAGE_KEYS.LOST_FOUND, INITIAL_LOST_FOUND);
  }

  static saveLostFound(items: LostFoundItem[]) {
    setStored(STORAGE_KEYS.LOST_FOUND, items);
  }

  static getResources(): Resource[] {
    return getStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  }

  static saveResources(resources: Resource[]) {
    setStored(STORAGE_KEYS.RESOURCES, resources);
  }

  static getMeetings(): MeetingSchedule[] {
    return getStored(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
  }

  static saveMeetings(meetings: MeetingSchedule[]) {
    setStored(STORAGE_KEYS.MEETINGS, meetings);
  }

  static getProjects(): Project[] {
    return getStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  static saveProjects(projects: Project[]) {
    setStored(STORAGE_KEYS.PROJECTS, projects);
  }

  static getInvitations(): TeamInvitation[] {
    return getStored(STORAGE_KEYS.INVITATIONS, INITIAL_TEAM_INVITATIONS);
  }

  static saveInvitations(invitations: TeamInvitation[]) {
    setStored(STORAGE_KEYS.INVITATIONS, invitations);
  }

  static getLeaveRequests(): LeaveRequest[] {
    return getStored(STORAGE_KEYS.LEAVE, INITIAL_LEAVE_REQUESTS);
  }

  static saveLeaveRequests(leaves: LeaveRequest[]) {
    setStored(STORAGE_KEYS.LEAVE, leaves);
  }

  static getLeaveTypes(): LeaveTypeConfig[] {
    return getStored(STORAGE_KEYS.LEAVE_TYPES, DEFAULT_LEAVE_TYPES);
  }

  static saveLeaveTypes(types: LeaveTypeConfig[]) {
    setStored(STORAGE_KEYS.LEAVE_TYPES, types);
  }

  static getHolidays(): AcademicHoliday[] {
    return getStored(STORAGE_KEYS.HOLIDAYS, DEFAULT_HOLIDAYS);
  }

  static saveHolidays(holidays: AcademicHoliday[]) {
    setStored(STORAGE_KEYS.HOLIDAYS, holidays);
  }

  static getLeavePolicy(): LeavePolicyConfig {
    return getStored(STORAGE_KEYS.LEAVE_POLICY, DEFAULT_LEAVE_POLICY);
  }

  static saveLeavePolicy(policy: LeavePolicyConfig) {
    setStored(STORAGE_KEYS.LEAVE_POLICY, policy);
  }

  static getPosts(): CommunityPost[] {
    return getStored(STORAGE_KEYS.POSTS, INITIAL_COMMUNITY_POSTS);
  }

  static savePosts(posts: CommunityPost[]) {
    setStored(STORAGE_KEYS.POSTS, posts);
  }

  static getCommunityPosts(): CommunityPost[] {
    return this.getPosts();
  }

  static saveCommunityPosts(posts: CommunityPost[]) {
    this.savePosts(posts);
  }

  static getMentorAssignments(): MentorAssignment[] {
    return getStored('smart_campus_mentor_assignments', INITIAL_MENTOR_ASSIGNMENTS);
  }

  static getLabAttendance() {
    return getStored('smart_campus_lab_attendance', INITIAL_ATTENDANCE);
  }

  static getAnnouncements(): Announcement[] {
    return getStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  static saveAnnouncements(announcements: Announcement[]) {
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }

  static getNotifications(): NotificationItem[] {
    return getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static saveNotifications(notifications: NotificationItem[]) {
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }

  static getAuditLogs(): AuditLog[] {
    return getStored(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
  }

  static addAuditLog(action: string, performedBy: string, userRole: string, target: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      performedBy,
      userRole,
      target,
      timestamp: new Date().toLocaleString(),
      ipAddress: '127.0.0.1'
    };
    const updated = [newLog, ...logs];
    setStored(STORAGE_KEYS.LOGS, updated);
  }

  static getOpportunities(): PlacementOpportunity[] {
    return getStored(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  }

  static getPlacementOpportunities(): PlacementOpportunity[] {
    return this.getOpportunities();
  }

  static saveOpportunities(opportunities: PlacementOpportunity[]) {
    setStored(STORAGE_KEYS.OPPORTUNITIES, opportunities);
  }

  static savePlacementOpportunities(opportunities: PlacementOpportunity[]) {
    this.saveOpportunities(opportunities);
  }

  static getApplications(): PlacementApplication[] {
    return getStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }

  static getPlacementApplications(): PlacementApplication[] {
    return this.getApplications();
  }

  static saveApplications(applications: PlacementApplication[]) {
    setStored(STORAGE_KEYS.APPLICATIONS, applications);
  }

  static savePlacementApplications(applications: PlacementApplication[]) {
    this.saveApplications(applications);
  }

  static getInterviewQuestions(): InterviewQuestion[] {
    return getStored(STORAGE_KEYS.INTERVIEW_QUESTIONS, INITIAL_INTERVIEW_QUESTIONS);
  }

  static saveInterviewQuestions(questions: InterviewQuestion[]) {
    setStored(STORAGE_KEYS.INTERVIEW_QUESTIONS, questions);
  }

  static resetToDefaults() {
    localStorage.clear();
    setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStored(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    setStored(STORAGE_KEYS.RESULTS, INITIAL_RESULTS);
    setStored(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    setStored(STORAGE_KEYS.LOST_FOUND, INITIAL_LOST_FOUND);
    setStored(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
    setStored(STORAGE_KEYS.MEETINGS, INITIAL_MEETINGS);
    setStored(STORAGE_KEYS.LEAVE, INITIAL_LEAVE_REQUESTS);
    setStored(STORAGE_KEYS.POSTS, INITIAL_COMMUNITY_POSTS);
    setStored(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStored(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
    setStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    setStored(STORAGE_KEYS.INVITATIONS, INITIAL_TEAM_INVITATIONS);
    setStored(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    setStored(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    setStored(STORAGE_KEYS.INTERVIEW_QUESTIONS, INITIAL_INTERVIEW_QUESTIONS);
  }
}

// AI API Client
export async function callAIChatbot(messages: { role: string; content: string }[], userContext?: any) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userContext })
    });
    if (!response.ok) throw new Error('AI Chat service failed');
    return await response.json();
  } catch (err) {
    console.error('Chatbot API error:', err);
    return {
      reply: "I am the Smart Campus Assistant. I'm currently running in offline fallback mode. How can I help you with your results, complaints, or campus schedule today?"
    };
  }
}

export async function callAIClassifyComplaint(title: string, description: string) {
  try {
    const response = await fetch('/api/ai/classify-complaint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    if (!response.ok) throw new Error('AI Classifier failed');
    return await response.json();
  } catch (err) {
    console.error('Classify API error:', err);
    return {
      category: 'Infrastructure',
      priority: 'Medium',
      suggestedDept: 'Estate & Facility Operations',
      estimatedResolutionHours: 24,
      aiAnalysis: 'Issue requires standard campus maintenance inspection.'
    };
  }
}

export async function callAIPredictResult(studentResult: StudentResult, targetSemester: number) {
  try {
    const response = await fetch('/api/ai/predict-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentResult, targetSemester })
    });
    if (!response.ok) throw new Error('AI Predictor failed');
    return await response.json();
  } catch (err) {
    console.error('Result Predictor error:', err);
    return {
      predictedSGPA: Math.min(10, +(studentResult.cgpa * 1.02).toFixed(2)),
      predictedCGPA: studentResult.cgpa,
      keyFocusSubjects: ['Compiler Design', 'Distributed Systems'],
      recommendations: [
        'Increase practical lab practice hours by 2 hours/week.',
        'Solve previous 3-year question papers available in the Collaboration Hub.'
      ]
    };
  }
}

export async function callAIAnalyzeAttendance(attendanceData: any) {
  try {
    const response = await fetch('/api/ai/analyze-attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendanceData })
    });
    if (!response.ok) throw new Error('Attendance AI failed');
    return await response.json();
  } catch (err) {
    console.error('Attendance AI error:', err);
    return {
      riskLevel: attendanceData.percentage < 75 ? 'HIGH_RISK' : 'SAFE',
      classesNeededToReach75: attendanceData.percentage < 75 ? 6 : 0,
      summary: `Current attendance is ${attendanceData.percentage}%. Maintain regular attendance to avoid examination hall ticket restrictions.`
    };
  }
}
