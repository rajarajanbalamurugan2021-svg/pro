import {
  DailyAttendanceRecord,
  AttendanceSession,
  AttendanceSummaryRecord,
  AttendanceAuditLog,
  AttendanceStatusType,
  User,
  LeaveRequest
} from '../types';
import { db } from '../lib/firebase';
import {
  doc,
  setDoc,
  getDocs,
  collection
} from 'firebase/firestore';

const STORAGE_KEYS = {
  ATTENDANCE_SESSIONS: 'smart_campus_attendance_sessions',
  DAILY_RECORDS: 'smart_campus_daily_attendance',
  ATTENDANCE_SUMMARY: 'smart_campus_attendance_summary',
  ATTENDANCE_AUDIT: 'smart_campus_attendance_audit',
  NOTIFICATIONS: 'smart_campus_notifications'
};

// Initial Subjects & Classes Data for CKCET CAMPRO
export const INITIAL_FACULTY_SUBJECTS = [
  {
    id: 'sub-ece-301',
    code: 'EC3351',
    name: 'Control Systems',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    facultyId: 'u-faculty-1',
    facultyName: 'Prof. Robert Thorne'
  },
  {
    id: 'sub-ece-302',
    code: 'EC3352',
    name: 'Digital Electronics & Logic Design',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    facultyId: 'u-faculty-1',
    facultyName: 'Prof. Robert Thorne'
  },
  {
    id: 'sub-ece-303',
    code: 'EC3353',
    name: 'Signals and Systems',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    facultyId: 'u-faculty-1',
    facultyName: 'Prof. Robert Thorne'
  },
  {
    id: 'sub-cse-601',
    code: 'CS601',
    name: 'Distributed Systems & Cloud Computing',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 6,
    section: 'A',
    facultyId: 'u-faculty-2',
    facultyName: 'Dr. Sarah Lin'
  },
  {
    id: 'sub-cse-602',
    code: 'CS602',
    name: 'Artificial Intelligence & Machine Learning',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 6,
    section: 'A',
    facultyId: 'u-faculty-2',
    facultyName: 'Dr. Sarah Lin'
  }
];

// Sample Initial Students for ECE Year 2 Sec A and CSE Year 3 Sec A
export const INITIAL_STUDENTS_LIST = [
  {
    id: 'u-student-1',
    studentId: 'u-student-1',
    registerNumber: '420725106036',
    rollNumber: '36',
    studentName: 'RAJARAJAN B',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    batch: '2025-2029'
  },
  {
    id: 'u-student-02',
    studentId: 'u-student-02',
    registerNumber: '420725106001',
    rollNumber: '01',
    studentName: 'AADHITHYA S',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    batch: '2025-2029'
  },
  {
    id: 'u-student-03',
    studentId: 'u-student-03',
    registerNumber: '420725106012',
    rollNumber: '12',
    studentName: 'BALAJI K',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    batch: '2025-2029'
  },
  {
    id: 'u-student-04',
    studentId: 'u-student-04',
    registerNumber: '420725106025',
    rollNumber: '25',
    studentName: 'DHIVYA P',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    batch: '2025-2029'
  },
  {
    id: 'u-student-05',
    studentId: 'u-student-05',
    registerNumber: '420725106040',
    rollNumber: '40',
    studentName: 'HARINI V',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    batch: '2025-2029'
  },
  {
    id: 'u-student-06',
    studentId: 'u-student-06',
    registerNumber: '420725106052',
    rollNumber: '52',
    studentName: 'KARTHIK R',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    semester: 3,
    section: 'A',
    batch: '2025-2029'
  },
  {
    id: 'u-student-2',
    studentId: 'u-student-2',
    registerNumber: 'CS2023002',
    rollNumber: 'CS2023002',
    studentName: 'Sophia Patel',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 6,
    section: 'A',
    batch: '2023-2027'
  },
  {
    id: 'u-student-3',
    studentId: 'u-student-3',
    registerNumber: 'CS2023003',
    rollNumber: 'CS2023003',
    studentName: 'Rohan Sharma',
    department: 'Computer Science & Engineering',
    year: 3,
    semester: 6,
    section: 'A',
    batch: '2023-2027'
  }
];

// Seeded Initial Sessions
const INITIAL_SESSIONS: AttendanceSession[] = [
  {
    sessionId: 'sess-101',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    section: 'A',
    semester: 3,
    subjectId: 'sub-ece-301',
    subjectCode: 'EC3351',
    subjectName: 'Control Systems',
    facultyId: 'u-faculty-1',
    facultyName: 'Prof. Robert Thorne',
    date: '2026-08-08',
    period: 1,
    totalStudents: 6,
    presentCount: 5,
    absentCount: 1,
    odCount: 0,
    leaveCount: 0,
    attendancePercentage: 83.33,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    records: [
      { id: 'rec-1', studentId: 'u-student-1', registerNumber: '420725106036', studentName: 'RAJARAJAN B', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-301', subjectName: 'Control Systems', facultyId: 'u-faculty-1', date: '2026-08-08', period: 1, status: 'PRESENT', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000, createdBy: 'u-faculty-1' },
      { id: 'rec-2', studentId: 'u-student-02', registerNumber: '420725106001', studentName: 'AADHITHYA S', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-301', subjectName: 'Control Systems', facultyId: 'u-faculty-1', date: '2026-08-08', period: 1, status: 'PRESENT', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000, createdBy: 'u-faculty-1' },
      { id: 'rec-3', studentId: 'u-student-03', registerNumber: '420725106012', studentName: 'BALAJI K', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-301', subjectName: 'Control Systems', facultyId: 'u-faculty-1', date: '2026-08-08', period: 1, status: 'ABSENT', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000, createdBy: 'u-faculty-1' },
      { id: 'rec-4', studentId: 'u-student-04', registerNumber: '420725106025', studentName: 'DHIVYA P', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-301', subjectName: 'Control Systems', facultyId: 'u-faculty-1', date: '2026-08-08', period: 1, status: 'PRESENT', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000, createdBy: 'u-faculty-1' },
      { id: 'rec-5', studentId: 'u-student-05', registerNumber: '420725106040', studentName: 'HARINI V', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-301', subjectName: 'Control Systems', facultyId: 'u-faculty-1', date: '2026-08-08', period: 1, status: 'PRESENT', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000, createdBy: 'u-faculty-1' },
      { id: 'rec-6', studentId: 'u-student-06', registerNumber: '420725106052', studentName: 'KARTHIK R', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-301', subjectName: 'Control Systems', facultyId: 'u-faculty-1', date: '2026-08-08', period: 1, status: 'PRESENT', createdAt: Date.now() - 172800000, updatedAt: Date.now() - 172800000, createdBy: 'u-faculty-1' }
    ]
  },
  {
    sessionId: 'sess-102',
    department: 'ELECTRONICS AND COMMUNICATION ENGINEERING',
    year: 2,
    section: 'A',
    semester: 3,
    subjectId: 'sub-ece-302',
    subjectCode: 'EC3352',
    subjectName: 'Digital Electronics & Logic Design',
    facultyId: 'u-faculty-1',
    facultyName: 'Prof. Robert Thorne',
    date: '2026-08-09',
    period: 2,
    totalStudents: 6,
    presentCount: 6,
    absentCount: 0,
    odCount: 0,
    leaveCount: 0,
    attendancePercentage: 100,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    records: [
      { id: 'rec-7', studentId: 'u-student-1', registerNumber: '420725106036', studentName: 'RAJARAJAN B', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-302', subjectName: 'Digital Electronics & Logic Design', facultyId: 'u-faculty-1', date: '2026-08-09', period: 2, status: 'PRESENT', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, createdBy: 'u-faculty-1' },
      { id: 'rec-8', studentId: 'u-student-02', registerNumber: '420725106001', studentName: 'AADHITHYA S', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-302', subjectName: 'Digital Electronics & Logic Design', facultyId: 'u-faculty-1', date: '2026-08-09', period: 2, status: 'PRESENT', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, createdBy: 'u-faculty-1' },
      { id: 'rec-9', studentId: 'u-student-03', registerNumber: '420725106012', studentName: 'BALAJI K', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-302', subjectName: 'Digital Electronics & Logic Design', facultyId: 'u-faculty-1', date: '2026-08-09', period: 2, status: 'PRESENT', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, createdBy: 'u-faculty-1' },
      { id: 'rec-10', studentId: 'u-student-04', registerNumber: '420725106025', studentName: 'DHIVYA P', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-302', subjectName: 'Digital Electronics & Logic Design', facultyId: 'u-faculty-1', date: '2026-08-09', period: 2, status: 'PRESENT', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, createdBy: 'u-faculty-1' },
      { id: 'rec-11', studentId: 'u-student-05', registerNumber: '420725106040', studentName: 'HARINI V', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-302', subjectName: 'Digital Electronics & Logic Design', facultyId: 'u-faculty-1', date: '2026-08-09', period: 2, status: 'PRESENT', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, createdBy: 'u-faculty-1' },
      { id: 'rec-12', studentId: 'u-student-06', registerNumber: '420725106052', studentName: 'KARTHIK R', department: 'ELECTRONICS AND COMMUNICATION ENGINEERING', year: 2, section: 'A', semester: 3, subjectId: 'sub-ece-302', subjectName: 'Digital Electronics & Logic Design', facultyId: 'u-faculty-1', date: '2026-08-09', period: 2, status: 'PRESENT', createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000, createdBy: 'u-faculty-1' }
    ]
  }
];

function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading ${key}:`, err);
    return defaultValue;
  }
}

function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (db) {
      setDoc(doc(db, 'ckcet_campro', key), { data: value, updatedAt: Date.now() }, { merge: true })
        .catch((e) => console.warn(`Firestore sync error for ${key}:`, e));
    }
  } catch (err) {
    console.error(`Error writing ${key}:`, err);
  }
}

export class AttendanceService {
  /**
   * Get all recorded attendance sessions
   */
  static getSessions(): AttendanceSession[] {
    return getStoredData<AttendanceSession[]>(STORAGE_KEYS.ATTENDANCE_SESSIONS, INITIAL_SESSIONS);
  }

  /**
   * Get all audit logs
   */
  static getAuditLogs(): AttendanceAuditLog[] {
    return getStoredData<AttendanceAuditLog[]>(STORAGE_KEYS.ATTENDANCE_AUDIT, []);
  }

  /**
   * Check if a student has an approved Leave or On-Duty request on a specific date
   */
  static checkLeaveAndOD(studentId: string, registerNo: string, dateStr: string): 'LEAVE' | 'OD' | null {
    try {
      const leaves = getStoredData<LeaveRequest[]>('smart_campus_leave', []);
      const matched = leaves.find((l) => {
        const matchesStudent = l.studentId === studentId || l.rollNumber === registerNo;
        const isApproved = l.status === 'Approved' || l.status === 'Completed';
        const inDateRange = dateStr >= l.startDate && dateStr <= l.endDate;
        return matchesStudent && isApproved && inDateRange;
      });

      if (!matched) return null;
      if (matched.type?.toLowerCase().includes('on duty') || matched.type === 'OD') {
        return 'OD';
      }
      return 'LEAVE';
    } catch {
      return null;
    }
  }

  /**
   * Save a new attendance session with validation and duplicate detection
   */
  static saveSession(session: AttendanceSession): { success: boolean; message: string } {
    const sessions = this.getSessions();

    // Prevent duplicate attendance for same subject + date + period + section
    const duplicate = sessions.find(
      (s) =>
        s.department === session.department &&
        String(s.year) === String(session.year) &&
        s.section === session.section &&
        s.subjectId === session.subjectId &&
        s.date === session.date &&
        s.period === session.period &&
        s.sessionId !== session.sessionId
    );

    if (duplicate) {
      return {
        success: false,
        message: `Attendance already recorded for ${session.subjectName} (Period ${session.period}) on ${session.date} for Section ${session.section}.`
      };
    }

    // Save session
    const updatedSessions = [session, ...sessions.filter((s) => s.sessionId !== session.sessionId)];
    setStoredData(STORAGE_KEYS.ATTENDANCE_SESSIONS, updatedSessions);

    // Save audit log for creation
    const audit: AttendanceAuditLog = {
      auditId: `audit-${Date.now()}`,
      attendanceId: session.sessionId,
      sessionId: session.sessionId,
      action: 'CREATED',
      editedBy: session.facultyName,
      reason: `Recorded daily attendance for ${session.subjectName} (${session.records.length} students)`,
      timestamp: Date.now()
    };
    const audits = this.getAuditLogs();
    setStoredData(STORAGE_KEYS.ATTENDANCE_AUDIT, [audit, ...audits]);

    // Send low attendance alert to students whose attendance falls below 75%
    this.processLowAttendanceAlerts(session);

    return { success: true, message: 'Attendance submitted successfully.' };
  }

  /**
   * Edit existing attendance session with mandatory audit reason
   */
  static editSession(
    sessionId: string,
    updatedRecords: DailyAttendanceRecord[],
    editedBy: string,
    reason: string
  ): { success: boolean; message: string } {
    const sessions = this.getSessions();
    const targetIdx = sessions.findIndex((s) => s.sessionId === sessionId);

    if (targetIdx === -1) {
      return { success: false, message: 'Session not found.' };
    }

    const targetSession = sessions[targetIdx];
    const presentCount = updatedRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = updatedRecords.filter((r) => r.status === 'ABSENT').length;
    const odCount = updatedRecords.filter((r) => r.status === 'OD').length;
    const leaveCount = updatedRecords.filter((r) => r.status === 'LEAVE').length;
    const totalStudents = updatedRecords.length;
    const pct = totalStudents > 0 ? +((presentCount / totalStudents) * 100).toFixed(2) : 0;

    const newSession: AttendanceSession = {
      ...targetSession,
      records: updatedRecords,
      presentCount,
      absentCount,
      odCount,
      leaveCount,
      totalStudents,
      attendancePercentage: pct,
      updatedAt: Date.now()
    };

    sessions[targetIdx] = newSession;
    setStoredData(STORAGE_KEYS.ATTENDANCE_SESSIONS, sessions);

    // Record audit log
    const audit: AttendanceAuditLog = {
      auditId: `audit-${Date.now()}`,
      attendanceId: sessionId,
      sessionId,
      subjectName: targetSession.subjectName,
      date: targetSession.date,
      period: targetSession.period,
      action: 'EDITED',
      editedBy,
      reason,
      timestamp: Date.now()
    };
    const audits = this.getAuditLogs();
    setStoredData(STORAGE_KEYS.ATTENDANCE_AUDIT, [audit, ...audits]);

    this.processLowAttendanceAlerts(newSession);

    return { success: true, message: 'Attendance updated and audit log saved.' };
  }

  /**
   * Process Low Attendance Warnings (< 75%) and push in-app notification to affected students
   */
  static processLowAttendanceAlerts(session: AttendanceSession) {
    try {
      const summary = this.getStudentOverallSummary();
      const lowStudents = summary.filter((s) => s.percentage < 75);

      const notifications = getStoredData<any[]>(STORAGE_KEYS.NOTIFICATIONS, []);
      let addedAny = false;

      lowStudents.forEach((student) => {
        const notifId = `notif-att-alert-${student.studentId}`;
        const exists = notifications.some((n) => n.id === notifId);
        if (!exists) {
          notifications.unshift({
            id: notifId,
            userId: student.studentId,
            title: '⚠️ Low Attendance Warning (< 75%)',
            message: `Your overall attendance is currently ${student.percentage}%, which is below Anna University / CKCET mandatory 75% threshold. Please meet your Class Advisor immediately.`,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'warning',
            category: 'attendance'
          });
          addedAny = true;
        }
      });

      if (addedAny) {
        setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
      }
    } catch (err) {
      console.warn('Error processing low attendance alerts:', err);
    }
  }

  /**
   * Get student overall attendance summary across all recorded sessions
   */
  static getStudentOverallSummary(): {
    studentId: string;
    studentName: string;
    registerNumber: string;
    department: string;
    year: number | string;
    section: string;
    totalClasses: number;
    attendedClasses: number;
    percentage: number;
    subjectWise: {
      subjectId: string;
      subjectName: string;
      total: number;
      attended: number;
      percentage: number;
    }[];
  }[] {
    const sessions = this.getSessions();
    const studentMap: Record<string, any> = {};

    sessions.forEach((sess) => {
      sess.records.forEach((rec) => {
        const key = rec.studentId || rec.registerNumber;
        if (!studentMap[key]) {
          studentMap[key] = {
            studentId: rec.studentId,
            studentName: rec.studentName,
            registerNumber: rec.registerNumber,
            department: rec.department,
            year: rec.year,
            section: rec.section,
            totalClasses: 0,
            attendedClasses: 0,
            subjectMap: {}
          };
        }

        const st = studentMap[key];
        st.totalClasses += 1;
        if (rec.status === 'PRESENT' || rec.status === 'OD') {
          st.attendedClasses += 1;
        }

        if (!st.subjectMap[rec.subjectId]) {
          st.subjectMap[rec.subjectId] = {
            subjectId: rec.subjectId,
            subjectName: rec.subjectName,
            total: 0,
            attended: 0
          };
        }
        st.subjectMap[rec.subjectId].total += 1;
        if (rec.status === 'PRESENT' || rec.status === 'OD') {
          st.subjectMap[rec.subjectId].attended += 1;
        }
      });
    });

    return Object.values(studentMap).map((st: any) => {
      const pct = st.totalClasses > 0 ? +((st.attendedClasses / st.totalClasses) * 100).toFixed(2) : 100;
      const subjectWise = Object.values(st.subjectMap).map((sub: any) => ({
        ...sub,
        percentage: sub.total > 0 ? +((sub.attended / sub.total) * 100).toFixed(2) : 100
      }));

      return {
        studentId: st.studentId,
        studentName: st.studentName,
        registerNumber: st.registerNumber,
        department: st.department,
        year: st.year,
        section: st.section,
        totalClasses: st.totalClasses,
        attendedClasses: st.attendedClasses,
        percentage: pct,
        subjectWise
      };
    });
  }
}
