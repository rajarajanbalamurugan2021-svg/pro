export type UserRole = 'super_admin' | 'admin' | 'faculty' | 'student' | 'mentor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  rollNumber?: string;
  employeeId?: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  semester?: number;
  section?: string;
  batch?: string;
  parentEmail?: string;
  parentPhone?: string;
  skills?: string[];
  interests?: string[];
  projectsCompleted?: number;
  githubProfile?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  credits: number;
  semester: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  courseId: string;
  facultyId: string;
  credits: number;
  maxInternalMarks: number;
  maxExternalMarks: number;
}

export interface SubjectResult {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  gradePoint: number;
  status: 'PASS' | 'FAIL' | 'RE-APPEAR';
}

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  semester: number;
  batch: string;
  subjects: SubjectResult[];
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  rank: number;
  publishedDate: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: 'Present' | 'Absent' | 'On Leave';
  labSessionId?: string;
  method: 'QR' | 'Manual';
}

export interface StudentAttendanceSummary {
  studentId: string;
  studentName: string;
  rollNumber: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  subjectWise: {
    subjectName: string;
    total: number;
    attended: number;
    percentage: number;
  }[];
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'Infrastructure' | 'Hostel' | 'Academic' | 'IT & Wi-Fi' | 'Library' | 'Transport' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  reportedBy: string;
  studentName: string;
  department: string;
  assignedTo?: string;
  assignedFacultyName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  aiSuggestedDepartment?: string;
}

export interface LostFoundItem {
  id: string;
  type: 'Lost' | 'Found';
  title: string;
  description: string;
  category: 'Electronics' | 'ID Card / Wallet' | 'Books / Stationery' | 'Keys' | 'Clothing' | 'Other';
  location: string;
  date: string;
  imageUrl?: string;
  reportedBy: string;
  contactEmail: string;
  contactPhone: string;
  status: 'Open' | 'Claim Pending' | 'Resolved';
  claimedBy?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'Notes' | 'Book' | 'Previous Paper' | 'Project Material' | 'Lab Equipment';
  category: string;
  department: string;
  subject?: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  authorName: string;
  downloadsCount: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  isEquipmentAvailable?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface MentorAssignment {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  semester: number;
  cgpa: number;
  attendancePercentage: number;
  lastMeetingDate: string;
}

export interface MeetingSchedule {
  id: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  studentName: string;
  title: string;
  date: string;
  time: string;
  location: string;
  agenda: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  feedback?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  reason: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  type: 'Medical' | 'Personal' | 'Duty' | 'Emergency';
  status: 'Pending' | 'Approved' | 'Rejected';
  facultyNotes?: string;
  parentNotified: boolean;
  appliedOn: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: 'General' | 'Announcement' | 'Event' | 'Club' | 'Discussion';
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    userVotedIndex?: number;
  };
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Exam' | 'Placement' | 'Sports' | 'Urgent';
  targetRoles: UserRole[];
  issuedBy: string;
  date: string;
  isImportant: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  linkModule?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  userRole: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export type ProjectStage =
  | 'Idea Submission'
  | 'Proposal Upload'
  | 'Faculty Review'
  | 'Approval'
  | 'Team Formation'
  | 'Development'
  | 'Testing'
  | 'Documentation'
  | 'Final Submission'
  | 'Evaluation'
  | 'Completed'
  | 'Rejected';

export type ProjectStatus =
  | 'Pending Approval'
  | 'Approved'
  | 'Changes Requested'
  | 'Rejected'
  | 'Completed';

export interface ProjectMember {
  userId: string;
  name: string;
  role: 'Project Lead' | 'Frontend Dev' | 'Backend Dev' | 'AI Engineer' | 'Researcher' | 'Team Member';
  skills: string[];
  avatar: string;
  email: string;
  department: string;
  joinedAt: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'Proposal' | 'Report' | 'Presentation' | 'SourceCode' | 'Document';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  assignedTo?: string;
  description: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface ProjectReview {
  id: string;
  facultyId: string;
  facultyName: string;
  comments: string;
  innovationGrade: number; // 0-10
  technicalGrade: number; // 0-10
  presentationGrade: number; // 0-10
  overallScore: number; // 0-100
  decision: 'Approved' | 'Changes Requested' | 'Rejected';
  reviewedAt: string;
}

export interface ProjectChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  attachmentUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  category: 'AI & Machine Learning' | 'Web & Mobile Apps' | 'IoT & Robotics' | 'Cybersecurity' | 'Cloud & DevOps' | 'Blockchain & Fintech' | 'Biomedical & Health Tech' | 'Renewable Energy';
  department: string;
  tags: string[];
  requiredSkills: string[];
  ownerId: string;
  ownerName: string;
  facultyMentorId?: string;
  facultyMentorName?: string;
  stage: ProjectStage;
  status: ProjectStatus;
  innovationScore: number; // 0-100
  members: ProjectMember[];
  maxTeamSize: number;
  documents: ProjectDocument[];
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  reviews: ProjectReview[];
  chatMessages: ProjectChatMessage[];
  githubRepo?: string;
  demoUrl?: string;
  createdAt: string;
  updatedAt: string;
  badges: string[];
  qrCodeData?: string;
  certificateIssued?: boolean;
  finalGrade?: 'A+' | 'A' | 'B+' | 'B' | 'Pass';
  meetingSchedules?: MeetingSchedule[];
}

export interface TeamInvitation {
  id: string;
  projectId: string;
  projectTitle: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  inviteeName: string;
  inviteeEmail: string;
  role: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  sentAt: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  studentsCount: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  totalProjects: number;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: string;
  popularity: number;
}

