import {
  User,
  StudentResult,
  Complaint,
  LostFoundItem,
  Resource,
  MeetingSchedule,
  MentorAssignment,
  LeaveRequest,
  CommunityPost,
  Announcement,
  NotificationItem,
  AuditLog,
  Department
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
  INITIAL_COMMUNITY_POSTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ATTENDANCE,
  INITIAL_MENTOR_ASSIGNMENTS
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'smart_campus_users',
  DEPARTMENTS: 'smart_campus_depts',
  RESULTS: 'smart_campus_results',
  COMPLAINTS: 'smart_campus_complaints',
  LOST_FOUND: 'smart_campus_lost_found',
  RESOURCES: 'smart_campus_resources',
  MEETINGS: 'smart_campus_meetings',
  LEAVE: 'smart_campus_leave',
  POSTS: 'smart_campus_posts',
  ANNOUNCEMENTS: 'smart_campus_announcements',
  NOTIFICATIONS: 'smart_campus_notifications',
  LOGS: 'smart_campus_logs',
  ACTIVE_USER: 'smart_campus_active_user',
  THEME: 'smart_campus_theme'
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
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
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

  static getLeaveRequests(): LeaveRequest[] {
    return getStored(STORAGE_KEYS.LEAVE, INITIAL_LEAVE_REQUESTS);
  }

  static saveLeaveRequests(leaves: LeaveRequest[]) {
    setStored(STORAGE_KEYS.LEAVE, leaves);
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
