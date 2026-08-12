import {
  Conversation,
  ChatMessage,
  AcademicRequest,
  FacultyAnnouncement,
  CommunicationReport,
  CommunicationCategory,
  User
} from '../types';
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.warn('Firestore Communication Service Notice:', errInfo);
}

const KEYS = {
  CONVERSATIONS: 'smart_campus_conversations',
  MESSAGES: 'smart_campus_messages',
  REQUESTS: 'smart_campus_academic_requests',
  ANNOUNCEMENTS: 'smart_campus_announcements',
  REPORTS: 'smart_campus_comm_reports'
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
}

// Initial Production-Ready Mock Data for Seamless Out-of-the-Box Experience
export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    studentId: 'usr-1',
    studentName: 'Aravind Kumar',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    studentDepartment: 'Computer Science & Engineering',
    studentRoll: 'CS2023001',
    facultyId: 'usr-2',
    facultyName: 'Dr. K. Ramanathan',
    facultyAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    facultyDepartment: 'Computer Science & Engineering',
    facultyDesignation: 'Professor & Head of Department',
    subjectId: 'CS301',
    subjectName: 'Design & Analysis of Algorithms',
    category: 'Academic Doubt',
    lastMessage: 'Sir, I have revised the Dynamic Programming solution for the Knapsack problem as suggested.',
    lastMessageAt: Date.now() - 3600000 * 2,
    unreadStudent: 0,
    unreadFaculty: 1,
    isStarred: true,
    status: 'OPEN',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000 * 2
  },
  {
    id: 'conv-2',
    studentId: 'usr-1',
    studentName: 'Aravind Kumar',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    studentDepartment: 'Computer Science & Engineering',
    studentRoll: 'CS2023001',
    facultyId: 'usr-5',
    facultyName: 'Prof. S. Meenakshi',
    facultyAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    facultyDepartment: 'Electronics & Communication Engineering',
    facultyDesignation: 'Associate Professor',
    subjectId: 'EC204',
    subjectName: 'Digital Electronics & Logic Design',
    category: 'GATE Guidance',
    lastMessage: 'Here is the GATE 2026 practice problem set for Sequential Logic Circuits.',
    lastMessageAt: Date.now() - 86400000,
    unreadStudent: 1,
    unreadFaculty: 0,
    isStarred: false,
    status: 'OPEN',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000
  },
  {
    id: 'conv-3',
    studentId: 'usr-1',
    studentName: 'Aravind Kumar',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    studentDepartment: 'Computer Science & Engineering',
    studentRoll: 'CS2023001',
    facultyId: 'usr-3',
    facultyName: 'Dr. M. Sundaram',
    facultyAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    facultyDepartment: 'Computer Science & Engineering',
    facultyDesignation: 'Associate Professor & Placement Officer',
    category: 'Internship Guidance',
    lastMessage: 'Your resume format for the L&T Technology Services campus drive has been approved.',
    lastMessageAt: Date.now() - 86400000 * 2,
    unreadStudent: 0,
    unreadFaculty: 0,
    isStarred: true,
    status: 'RESOLVED',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 2
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-101',
    conversationId: 'conv-1',
    senderId: 'usr-1',
    senderName: 'Aravind Kumar',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    receiverId: 'usr-2',
    message: 'Good morning Sir! Could you please clarify the time complexity bound for Dijkstra algorithm with Fibonacci Heaps?',
    isRead: true,
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'msg-102',
    conversationId: 'conv-1',
    senderId: 'usr-2',
    senderName: 'Dr. K. Ramanathan',
    senderRole: 'faculty',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    receiverId: 'usr-1',
    message: 'Good morning Aravind. With a Fibonacci heap, vertex decrease-key takes amortized O(1) time, bringing total complexity to O(E + V log V). Refer to CLRS Chapter 19.',
    isRead: true,
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'msg-103',
    conversationId: 'conv-1',
    senderId: 'usr-1',
    senderName: 'Aravind Kumar',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    receiverId: 'usr-2',
    message: 'Sir, I have revised the Dynamic Programming solution for the Knapsack problem as suggested.',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: 'Algorithms_Knapsack_Notes.pdf',
    attachmentType: 'application/pdf',
    isRead: false,
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'msg-201',
    conversationId: 'conv-2',
    senderId: 'usr-5',
    senderName: 'Prof. S. Meenakshi',
    senderRole: 'faculty',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    receiverId: 'usr-1',
    message: 'Here is the GATE 2026 practice problem set for Sequential Logic Circuits.',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: 'GATE_Sequential_Circuits_Practice.pdf',
    attachmentType: 'application/pdf',
    isRead: false,
    createdAt: Date.now() - 86400000
  }
];

export const INITIAL_ACADEMIC_REQUESTS: AcademicRequest[] = [
  {
    id: 'req-1',
    studentId: 'usr-1',
    studentName: 'Aravind Kumar',
    studentDepartment: 'Computer Science & Engineering',
    studentRoll: 'CS2023001',
    facultyId: 'usr-2',
    facultyName: 'Dr. K. Ramanathan',
    facultyDepartment: 'Computer Science & Engineering',
    category: 'Academic Doubt',
    subject: 'Design & Analysis of Algorithms',
    topic: 'Master Theorem Proof & Recurrence Relations',
    message: 'Respected Sir, could you please schedule a short 15-minute doubt clearing session regarding case 3 of Master Theorem where f(n) = Omega(n^(log_b a + epsilon))?',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'req-2',
    studentId: 'usr-1',
    studentName: 'Aravind Kumar',
    studentDepartment: 'Computer Science & Engineering',
    studentRoll: 'CS2023001',
    facultyId: 'usr-5',
    facultyName: 'Prof. S. Meenakshi',
    facultyDepartment: 'Electronics & Communication Engineering',
    category: 'GATE Guidance',
    subject: 'Digital Electronics',
    topic: 'JK Flip Flop Race Around Condition',
    message: 'Madam, I am preparing for GATE CS 2027. Kindly review my notes on Master-Slave Flip Flop timing diagrams.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    responseNote: 'Notes under review. Will send feedback by tomorrow evening.',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000
  }
];

export const INITIAL_FACULTY_ANNOUNCEMENTS: FacultyAnnouncement[] = [
  {
    id: 'ann-1',
    title: '📢 Continuous Internal Assessment - II Schedule & Syllabus',
    message: 'Dear Students, CIA-II for 3rd Year CSE will commence from August 25, 2026. The syllabus covers Units 3 & 4 (Trees, Graphs, and Greedy Algorithms). Attendance is mandatory.',
    facultyId: 'usr-2',
    facultyName: 'Dr. K. Ramanathan',
    facultyAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    section: 'All',
    subject: 'Design & Analysis of Algorithms',
    priority: 'High',
    attachmentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachmentName: 'CIA_II_TimeTable_CSE.pdf',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-08-30',
    createdAt: Date.now() - 3600000 * 12,
    viewsCount: 142
  },
  {
    id: 'ann-2',
    title: '🎯 GATE 2027 Masterclass: Core Engineering & Algorithmic Strategy',
    message: 'Special guest lecture by IIT Madras alumni on cracking GATE CS/ECE in 1st attempt. Venue: Seminar Hall II on Saturday at 10:00 AM. Free mock test booklet will be distributed.',
    facultyId: 'usr-5',
    facultyName: 'Prof. S. Meenakshi',
    facultyAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    department: 'All',
    year: 'All',
    section: 'All',
    priority: 'Urgent',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '2026-09-05',
    createdAt: Date.now() - 86400000 * 2,
    viewsCount: 289
  }
];

export const INITIAL_COMM_REPORTS: CommunicationReport[] = [
  {
    id: 'rep-1',
    conversationId: 'conv-demo-report',
    reportedBy: 'usr-1',
    reporterName: 'Aravind Kumar',
    reporterRole: 'student',
    reportedUserId: 'usr-99',
    reportedUserName: 'External Contact',
    reason: 'Spam / Flooding',
    description: 'Received repeated unsolicited promotional links for non-campus coaching classes.',
    status: 'OPEN',
    createdAt: Date.now() - 86400000 * 3
  }
];

export class CommunicationService {
  // --- Conversations ---
  static getConversations(): Conversation[] {
    return getLocal<Conversation[]>(KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  }

  static saveConversations(convs: Conversation[]): void {
    setLocal(KEYS.CONVERSATIONS, convs);
  }

  static async syncConversationToFirestore(conv: Conversation): Promise<void> {
    try {
      await setDoc(doc(db, 'conversations', conv.id), conv, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `conversations/${conv.id}`);
    }
  }

  static async createConversation(
    student: User,
    faculty: User,
    category: CommunicationCategory,
    initialMessage: string,
    subjectName?: string,
    attachmentUrl?: string,
    attachmentName?: string
  ): Promise<{ conversation: Conversation; message: ChatMessage }> {
    const convs = this.getConversations();

    // Check if open conversation already exists between this student & faculty for same category
    let conv = convs.find(
      c => c.studentId === student.id && c.facultyId === faculty.id && c.category === category && c.status === 'OPEN'
    );

    const now = Date.now();
    let isNewConv = false;

    if (!conv) {
      isNewConv = true;
      conv = {
        id: `conv-${now}-${Math.random().toString(36).substring(2, 6)}`,
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatar,
        studentDepartment: student.department || 'General Engineering',
        studentRoll: student.rollNumber || student.registerNo || 'CS2023',
        facultyId: faculty.id,
        facultyName: faculty.name,
        facultyAvatar: faculty.avatar,
        facultyDepartment: faculty.department || 'Engineering Department',
        facultyDesignation: faculty.title || 'Faculty Member',
        subjectName: subjectName || 'Academic Query',
        category,
        lastMessage: initialMessage,
        lastMessageAt: now,
        unreadStudent: 0,
        unreadFaculty: 1,
        status: 'OPEN',
        createdAt: now,
        updatedAt: now
      };
      convs.unshift(conv);
    } else {
      conv.lastMessage = initialMessage;
      conv.lastMessageAt = now;
      conv.unreadFaculty += 1;
      conv.updatedAt = now;
    }

    this.saveConversations(convs);
    this.syncConversationToFirestore(conv).catch(() => {});

    // Create initial message
    const msg: ChatMessage = {
      id: `msg-${now}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: conv.id,
      senderId: student.id,
      senderName: student.name,
      senderRole: 'student',
      senderAvatar: student.avatar,
      receiverId: faculty.id,
      message: initialMessage,
      attachmentUrl,
      attachmentName,
      attachmentType: attachmentUrl ? 'attachment' : undefined,
      isRead: false,
      createdAt: now
    };

    const msgs = this.getMessages();
    msgs.push(msg);
    this.saveMessages(msgs);
    this.syncMessageToFirestore(msg).catch(() => {});

    return { conversation: conv, message: msg };
  }

  // --- Messages ---
  static getMessages(): ChatMessage[] {
    return getLocal<ChatMessage[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  static saveMessages(msgs: ChatMessage[]): void {
    setLocal(KEYS.MESSAGES, msgs);
  }

  static async syncMessageToFirestore(msg: ChatMessage): Promise<void> {
    try {
      await setDoc(doc(db, 'messages', msg.id), msg, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `messages/${msg.id}`);
    }
  }

  static getMessagesForConversation(convId: string): ChatMessage[] {
    const all = this.getMessages();
    return all.filter(m => m.conversationId === convId).sort((a, b) => a.createdAt - b.createdAt);
  }

  static sendMessage(
    convId: string,
    sender: User,
    receiverId: string,
    text: string,
    attachmentUrl?: string,
    attachmentName?: string
  ): ChatMessage {
    const now = Date.now();
    const msg: ChatMessage = {
      id: `msg-${now}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: convId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role as any,
      senderAvatar: sender.avatar,
      receiverId,
      message: text,
      attachmentUrl,
      attachmentName,
      isRead: false,
      createdAt: now
    };

    const msgs = this.getMessages();
    msgs.push(msg);
    this.saveMessages(msgs);
    this.syncMessageToFirestore(msg).catch(() => {});

    // Update conversation metadata
    const convs = this.getConversations();
    const convIndex = convs.findIndex(c => c.id === convId);
    if (convIndex !== -1) {
      convs[convIndex].lastMessage = text || (attachmentUrl ? '📷 Attached File' : '');
      convs[convIndex].lastMessageAt = now;
      convs[convIndex].updatedAt = now;
      if (sender.id === convs[convIndex].studentId) {
        convs[convIndex].unreadFaculty += 1;
      } else {
        convs[convIndex].unreadStudent += 1;
      }
      this.saveConversations(convs);
      this.syncConversationToFirestore(convs[convIndex]).catch(() => {});
    }

    return msg;
  }

  static markConversationAsRead(convId: string, userId: string): void {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === convId);
    if (conv) {
      if (userId === conv.studentId) conv.unreadStudent = 0;
      if (userId === conv.facultyId) conv.unreadFaculty = 0;
      this.saveConversations(convs);
      this.syncConversationToFirestore(conv).catch(() => {});
    }

    const msgs = this.getMessages();
    let updated = false;
    msgs.forEach(m => {
      if (m.conversationId === convId && m.receiverId === userId && !m.isRead) {
        m.isRead = true;
        updated = true;
      }
    });
    if (updated) {
      this.saveMessages(msgs);
    }
  }

  static toggleStarMessage(msgId: string): void {
    const msgs = this.getMessages();
    const msg = msgs.find(m => m.id === msgId);
    if (msg) {
      msg.isStarred = !msg.isStarred;
      this.saveMessages(msgs);
      this.syncMessageToFirestore(msg).catch(() => {});
    }
  }

  static deleteMessage(msgId: string): void {
    let msgs = this.getMessages();
    msgs = msgs.filter(m => m.id !== msgId);
    this.saveMessages(msgs);
    deleteDoc(doc(db, 'messages', msgId)).catch(() => {});
  }

  static updateConversationStatus(convId: string, status: Conversation['status']): void {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === convId);
    if (conv) {
      conv.status = status;
      conv.updatedAt = Date.now();
      this.saveConversations(convs);
      this.syncConversationToFirestore(conv).catch(() => {});
    }
  }

  // --- Academic Requests ---
  static getAcademicRequests(): AcademicRequest[] {
    return getLocal<AcademicRequest[]>(KEYS.REQUESTS, INITIAL_ACADEMIC_REQUESTS);
  }

  static saveAcademicRequests(reqs: AcademicRequest[]): void {
    setLocal(KEYS.REQUESTS, reqs);
  }

  static createAcademicRequest(req: Omit<AcademicRequest, 'id' | 'createdAt' | 'updatedAt'>): AcademicRequest {
    const now = Date.now();
    const newReq: AcademicRequest = {
      ...req,
      id: `req-${now}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now
    };

    const reqs = this.getAcademicRequests();
    reqs.unshift(newReq);
    this.saveAcademicRequests(reqs);

    setDoc(doc(db, 'academic_requests', newReq.id), newReq, { merge: true }).catch(err =>
      handleFirestoreError(err, OperationType.WRITE, `academic_requests/${newReq.id}`)
    );

    return newReq;
  }

  static updateRequestStatus(reqId: string, status: AcademicRequest['status'], responseNote?: string): void {
    const reqs = this.getAcademicRequests();
    const req = reqs.find(r => r.id === reqId);
    if (req) {
      req.status = status;
      if (responseNote) req.responseNote = responseNote;
      if (status === 'RESOLVED') req.resolvedAt = new Date().toLocaleString();
      req.updatedAt = Date.now();
      this.saveAcademicRequests(reqs);

      updateDoc(doc(db, 'academic_requests', reqId), {
        status,
        responseNote: responseNote || req.responseNote || '',
        updatedAt: req.updatedAt
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `academic_requests/${reqId}`));
    }
  }

  // --- Announcements ---
  static getAnnouncements(): FacultyAnnouncement[] {
    return getLocal<FacultyAnnouncement[]>(KEYS.ANNOUNCEMENTS, INITIAL_FACULTY_ANNOUNCEMENTS);
  }

  static saveAnnouncements(anns: FacultyAnnouncement[]): void {
    setLocal(KEYS.ANNOUNCEMENTS, anns);
  }

  static createAnnouncement(ann: Omit<FacultyAnnouncement, 'id' | 'createdAt' | 'viewsCount'>): FacultyAnnouncement {
    const now = Date.now();
    const newAnn: FacultyAnnouncement = {
      ...ann,
      id: `ann-${now}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      viewsCount: 0
    };

    const anns = this.getAnnouncements();
    anns.unshift(newAnn);
    this.saveAnnouncements(anns);

    setDoc(doc(db, 'announcements', newAnn.id), newAnn, { merge: true }).catch(err =>
      handleFirestoreError(err, OperationType.WRITE, `announcements/${newAnn.id}`)
    );

    return newAnn;
  }

  static incrementAnnouncementViews(id: string): void {
    const anns = this.getAnnouncements();
    const ann = anns.find(a => a.id === id);
    if (ann) {
      ann.viewsCount = (ann.viewsCount || 0) + 1;
      this.saveAnnouncements(anns);
    }
  }

  // --- Reports ---
  static getReports(): CommunicationReport[] {
    return getLocal<CommunicationReport[]>(KEYS.REPORTS, INITIAL_COMM_REPORTS);
  }

  static saveReports(reps: CommunicationReport[]): void {
    setLocal(KEYS.REPORTS, reps);
  }

  static submitReport(report: Omit<CommunicationReport, 'id' | 'createdAt' | 'status'>): CommunicationReport {
    const now = Date.now();
    const newRep: CommunicationReport = {
      ...report,
      id: `rep-${now}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'OPEN',
      createdAt: now
    };

    const reps = this.getReports();
    reps.unshift(newRep);
    this.saveReports(reps);

    setDoc(doc(db, 'communication_reports', newRep.id), newRep, { merge: true }).catch(err =>
      handleFirestoreError(err, OperationType.WRITE, `communication_reports/${newRep.id}`)
    );

    return newRep;
  }

  static updateReportStatus(reportId: string, status: CommunicationReport['status'], actionTaken?: string): void {
    const reps = this.getReports();
    const rep = reps.find(r => r.id === reportId);
    if (rep) {
      rep.status = status;
      if (actionTaken) rep.actionTaken = actionTaken;
      this.saveReports(reps);

      updateDoc(doc(db, 'communication_reports', reportId), {
        status,
        actionTaken: actionTaken || ''
      }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `communication_reports/${reportId}`));
    }
  }
}
