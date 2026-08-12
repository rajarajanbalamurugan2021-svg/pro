export interface CampusLogoConfig {
  logoUrl?: string;
  title?: string;
  subtitle?: string;
  tagline?: string;
  presetIcon?: 'modern-shield' | 'academic-crest' | 'future-core' | 'golden-crown' | 'tech-atom' | 'minimal-diamond';
  gradientBg?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'placement_officer' | 'recruiter' | 'faculty' | 'student' | 'mentor' | 'maintenance_staff' | 'department_head' | 'hod' | 'class_advisor';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  keywords: string[];
  answer: string;
  relatedQuestions?: string[];
  language?: string;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: 'active' | 'inactive';
}

export interface ComplaintCategoryItem {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  isCustom?: boolean;
}

export interface ComplaintTimelineEntry {
  status: string;
  updatedBy: string;
  timestamp: string;
  note?: string;
}

export interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  allowedPortals?: UserRole[];
  avatar: string;
  department: string;
  rollNumber?: string;
  employeeId?: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  accountStatus?: 'Active' | 'Inactive';
  createdAt?: string;
  lastLogin?: string;
  semester?: number;
  section?: string;
  batch?: string;
  parentEmail?: string;
  parentPhone?: string;
  skills?: string[];
  interests?: string[];
  projectsCompleted?: number;
  githubProfile?: string;
  academicSession?: string;
  programme?: string;
  className?: string;
  registerNo?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  officialEmail?: string;
  whatsappNumber?: string;
  religion?: string;
  communalCategory?: string;
  title?: string;
  bloodGroup?: string;
  country?: string;
  state?: string;
  district?: string;
  cityVillage?: string;
  address?: string;
  streetArea?: string;
  pinCode?: string;
  motherTongue?: string;
  nationality?: string;
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

export type AttendanceStatusType = 'PRESENT' | 'ABSENT' | 'OD' | 'LEAVE';

export interface DailyAttendanceRecord {
  id: string;
  attendanceId?: string;
  sessionId?: string;
  studentId: string;
  registerNumber: string;
  studentName: string;
  department: string;
  year: number | string;
  section: string;
  semester: number;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  facultyId: string;
  facultyName?: string;
  date: string; // YYYY-MM-DD
  period: number; // 1 to 8
  status: AttendanceStatusType;
  remarks?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy?: string;
}

export interface AttendanceSession {
  sessionId: string;
  id?: string;
  department: string;
  year: number | string;
  section: string;
  semester: number;
  subjectId: string;
  subjectCode?: string;
  subjectName: string;
  facultyId: string;
  facultyName: string;
  date: string;
  period: number;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  odCount: number;
  leaveCount: number;
  attendancePercentage: number;
  createdAt: number;
  updatedAt: number;
  records: DailyAttendanceRecord[];
}

export interface AttendanceSummaryRecord {
  summaryId: string;
  id?: string;
  studentId: string;
  registerNumber: string;
  studentName: string;
  department: string;
  year: number | string;
  section: string;
  semester: number;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  odCount: number;
  leaveCount: number;
  attendancePercentage: number;
  updatedAt: number;
}

export interface AttendanceAuditLog {
  auditId: string;
  attendanceId: string;
  sessionId?: string;
  studentId?: string;
  studentName?: string;
  subjectName?: string;
  date?: string;
  period?: number;
  action: 'CREATED' | 'EDITED' | 'DELETED';
  oldStatus?: string;
  newStatus?: string;
  editedBy: string;
  editorRole?: string;
  reason: string;
  timestamp: number;
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
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'New Complaint' | 'Assigned' | 'In Progress' | 'Waiting for Parts' | 'Completed' | 'Approved' | 'Resolved' | 'Rejected' | 'Reopened';
  reportedBy: string;
  studentName: string;
  studentId?: string;
  department: string;
  year?: string;
  blockName?: string;
  floor?: string;
  roomNumber?: string;
  assignedTo?: string;
  assignedStaffName?: string;
  assignedStaffPhone?: string;
  imageUrl?: string;
  imageUrls?: string[];
  completionImages?: string[];
  maintenanceNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  aiSuggestedDepartment?: string;
  rating?: number;
  feedback?: string;
  timeline?: ComplaintTimelineEntry[];
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
  mentorDepartment?: string;
  mentorDesignation?: string;
  mentorEmail?: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  year?: string;
  semester: number;
  cgpa: number;
  attendancePercentage: number;
  lastMeetingDate: string;
  assignedAt?: string;
  academicStatus?: 'GOOD STANDING' | 'NEEDS ATTENTION' | 'AT RISK' | 'IMPROVING';
  mentoringStatus?: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
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
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'CONFIRMED' | 'RESCHEDULED';
  meetingType?: 'ONE_TO_ONE' | 'GROUP' | 'ACADEMIC_REVIEW' | 'CAREER_GUIDANCE' | 'GATE_GUIDANCE' | 'PROJECT_REVIEW' | 'HIGHER_STUDIES' | 'RESEARCH';
  isOnline?: boolean;
  meetingLink?: string;
  attendance?: 'PRESENT' | 'ABSENT' | 'PENDING';
  summary?: string;
  actionItems?: string[];
  nextMeetingDate?: string;
  notes?: string;
  feedback?: string;
  createdAt?: string;
}

export type MentoringRequestType = 
  | 'Academic Guidance'
  | 'Attendance Issue'
  | 'GATE Guidance'
  | 'Core Engineering Guidance'
  | 'Project Guidance'
  | 'Internship Guidance'
  | 'Career Guidance'
  | 'Higher Studies'
  | 'Research Guidance'
  | 'Personal Academic Concern'
  | 'Other';

export interface MentoringSessionRequest {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  requestType: MentoringRequestType;
  subject: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'ACCEPTED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  responseNote?: string;
}

export type MentoringCategory = 
  | 'ACADEMIC' 
  | 'CORE SKILL' 
  | 'GATE' 
  | 'PROJECT' 
  | 'CAREER' 
  | 'INTERNSHIP' 
  | 'HIGHER STUDIES' 
  | 'RESEARCH';

export interface MentoringGoal {
  id: string;
  mentorId: string;
  studentId: string;
  studentName?: string;
  title: string;
  description: string;
  category: MentoringCategory;
  targetDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  progressPercentage: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  mentorRemarks?: string;
  createdAt: string;
}

export interface MentoringTask {
  id: string;
  goalId?: string;
  mentorId: string;
  studentId: string;
  task: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  mentorComment?: string;
  studentCompletion: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface MentoringPrivateNote {
  id: string;
  mentorId: string;
  studentId: string;
  date: string;
  category: 'Academic' | 'Attendance' | 'Career' | 'GATE' | 'Project' | 'Internship' | 'Higher Studies' | 'Research' | 'General';
  note: string;
  followUpRequired: boolean;
  followUpDate?: string;
  isShareable?: boolean; // Default false - NEVER show to student unless explicitly marked true
  createdAt: string;
}

export interface MentoringFeedback {
  id: string;
  mentorId: string;
  studentId: string;
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendedAction: string;
  reviewDate: string;
  acknowledgedByStudent: boolean;
  acknowledgedAt?: string;
  createdAt: string;
}

export interface MentoringAlert {
  id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastReview: string;
  recommendedAction: string;
  status: 'OPEN' | 'REVIEWED' | 'RESOLVED';
  createdAt: string;
}

export interface MentorCoreSkillTracking {
  id: string;
  studentId: string;
  department: string;
  skillName: string;
  category: 'Core Skill' | 'Software Tool' | 'Simulation Tool';
  level: 'NOT_STARTED' | 'LEARNING' | 'PRACTICING' | 'COMPETENT';
  recommendedByMentor?: string;
  targetDate?: string;
  resourceLink?: string;
  updatedAt: string;
}

export interface MentorGATETracking {
  id: string;
  studentId: string;
  gatePaper: string;
  subjectProgress: { subject: string; progressPercentage: number; status: string }[];
  pyqsAttempted: number;
  mockTestScore?: number;
  weakAreas: string[];
  targetScore: number;
  studyPlan: string;
  updatedAt: string;
}

export interface MentorHigherStudiesTracking {
  id: string;
  studentId: string;
  degreeInterest: 'M.Tech / M.E' | 'MS' | 'PhD' | 'MBA' | 'Other';
  researchArea: string;
  targetInstitutions: string[];
  gateRequired: boolean;
  entranceExamStatus: string;
  recommendedSkills: string[];
  updatedAt: string;
}

export interface MentoringSystemConfig {
  lowCgpaThreshold: number; // default 7.0
  lowAttendanceThreshold: number; // default 75
  enableAutoAlerts: boolean; // default true
  requireMeetingSummary: boolean; // default true
  maxMenteesPerFaculty: number; // default 20
}

export interface SupportingDocument {
  id: string;
  name: string;
  size?: string;
  type?: string;
  url: string;
}

export interface LeaveTimelineEntry {
  status: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  note?: string;
}

export interface LeaveRequest {
  id: string;
  applicationId?: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  year?: string;
  section?: string;
  reason: string;
  startDate: string; // From Date
  endDate: string;   // To Date
  fromDate?: string;
  toDate?: string;
  daysCount: number; // Number of Leave Days
  totalDays?: number;
  type: string;      // Medical, Casual, Emergency, On Duty, Sports, Cultural Event, Internship, Industrial Visit, Personal, Semester Examination, or custom
  status: 'Draft' | 'Submitted' | 'Pending' | 'Advisor Review' | 'Approved by Advisor' | 'HOD Approval' | 'Approved' | 'Rejected' | 'Completed' | 'Info Requested';
  parentNotified: boolean;
  appliedOn: string;
  submittedDate?: string;
  approvedDate?: string;
  lastUpdated?: string;
  supportingDocuments?: SupportingDocument[];
  documentUrls?: string[];
  emergencyContact?: string;
  parentContact?: string;
  advisorId?: string;
  advisorName?: string;
  advisorRemarks?: string;
  facultyNotes?: string;
  hodId?: string;
  hodName?: string;
  hodRemarks?: string;
  requestedInfoNote?: string;
  attendanceImpact?: number;
  timeline?: LeaveTimelineEntry[];
}

export interface LeaveTypeConfig {
  id: string;
  leaveTypeId?: string;
  leaveTypeName: string;
  name?: string;
  maxDays: number;
  requiresHODApproval: boolean;
  hodThresholdDays?: number;
  category?: 'Academic' | 'Medical' | 'Personal' | 'Co-curricular';
  description?: string;
  active?: boolean;
}

export interface AcademicHoliday {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  type: 'Public Holiday' | 'University Festival' | 'Vacation' | 'Exam Period';
  description?: string;
}

export interface LeavePolicyConfig {
  hodApprovalThresholdDays: number;
  maxLeaveDaysPerSemester: number;
  enableParentSMS: boolean;
  autoApproveOnDutyEvent: boolean;
  academicYear: string;
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

export type OpportunityType = 'Internship' | 'Full-Time Placement' | 'PPO (Pre-Placement Offer)' | 'Off-Campus Drive' | 'Government' | 'Startup';
export type CompanyCategory = 'Core' | 'IT & Software' | 'Dream' | 'Mass Recruiter' | 'Government' | 'Startup';

export interface PlacementOpportunity {
  id: string;
  type: OpportunityType;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  departmentEligibility: string[];
  category: CompanyCategory;
  location: string;
  stipendOrPackage: string;
  packageNumber: number; // For package stats (LPA or Monthly stipend in k)
  duration: string;
  minCGPA: number;
  requiredSkills: string[];
  jobDescription: string;
  responsibilities: string[];
  perks: string[];
  applicationDeadline: string;
  driveDate: string;
  status: 'Open' | 'Closed' | 'Upcoming' | 'Completed';
  recruiterId: string;
  recruiterEmail: string;
  applicantsCount: number;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';

export interface PlacementApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  type: OpportunityType;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  department: string;
  cgpa: number;
  resumeUrl: string;
  matchingScore: number; // 0-100%
  status: ApplicationStatus;
  appliedAt: string;
  interviewDate?: string;
  interviewLocation?: string;
  notes?: string;
}

export interface StudentProfileExtra {
  studentId: string;
  internalMarks: number;
  softSkills: string[];
  certifications: string[];
  projectsList: string[];
  internshipExperience: string;
  resumeUrl: string;
  portfolio: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  achievements: {
    hackathons: string[];
    workshops: string[];
    awards: string[];
  };
  preferredRoles: string[];
  preferredLocations: string[];
  careerInterests: string[];
}

export interface SkillGapAnalysis {
  missingSkills: string[];
  requiredCertifications: string[];
  recommendedCourses: { name: string; provider: string; link: string }[];
  practicePlatforms: string[];
  suggestedMiniProjects: string[];
  overallReadinessScore: number;
}

export interface ResumeAnalysisResult {
  score: number;
  detectedSections: string[];
  missingSections: string[];
  keyStrengths: string[];
  suggestedImprovements: string[];
  atsKeywords: { present: string[]; missing: string[] };
  summary: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'Aptitude' | 'Coding Challenge';
  question: string;
  answerHint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  company?: string;
}

export interface CareerRoadmap {
  recommendedRole: string;
  predictedSalaryRange: string;
  futureDemand: 'High Growth' | 'Stable' | 'Emerging Tech';
  industryTrends: string[];
  roadmapMilestones: { phase: string; title: string; duration: string; skillsToMaster: string[] }[];
}

export interface AcademicYear {
  id: string;
  year: string; // e.g. "2025-2026"
  isCurrent: boolean;
  semesters: number[];
  status: 'Active' | 'Archived' | 'Upcoming';
}

export interface ResultLockStatus {
  semester: number;
  department: string;
  academicYear: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
}

export interface GradeRule {
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  minMark: number;
  maxMark: number;
  gradePoint: number;
  description: string;
}

export interface AttendanceSubjectRecord {
  id: string;
  studentId: string;
  registerNumber: string;
  studentName: string;
  department: string;
  semester: number;
  section: string;
  courseCode: string;
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'Eligible' | 'Shortage';
  lastUpdated: string;
}

export type CommunicationCategory =
  | 'Academic Doubt'
  | 'Attendance Query'
  | 'Assignment Query'
  | 'Project Guidance'
  | 'Leave Clarification'
  | 'GATE Guidance'
  | 'Career Guidance'
  | 'Internship Guidance'
  | 'Mentoring'
  | 'Department Matters'
  | 'General Academic';

export interface Conversation {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentDepartment: string;
  studentRoll?: string;
  facultyId: string;
  facultyName: string;
  facultyAvatar?: string;
  facultyDepartment: string;
  facultyDesignation?: string;
  subjectId?: string;
  subjectName?: string;
  category: CommunicationCategory;
  lastMessage: string;
  lastMessageAt: number;
  unreadStudent: number;
  unreadFaculty: number;
  isPinnedStudent?: boolean;
  isPinnedFaculty?: boolean;
  isStarred?: boolean;
  status: 'OPEN' | 'RESOLVED' | 'CLOSED' | 'ARCHIVED';
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'faculty' | 'admin' | 'super_admin';
  senderAvatar?: string;
  receiverId: string;
  message: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  isRead: boolean;
  isStarred?: boolean;
  isEdited?: boolean;
  createdAt: number;
  updatedAt?: number;
}

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface AcademicRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentDepartment?: string;
  studentRoll?: string;
  facultyId: string;
  facultyName: string;
  facultyDepartment?: string;
  category: CommunicationCategory;
  subject: string;
  topic?: string;
  message: string;
  attachmentUrl?: string;
  attachmentName?: string;
  priority: RequestPriority;
  status: RequestStatus;
  responseNote?: string;
  resolvedAt?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FacultyAnnouncement {
  id: string;
  title: string;
  message: string;
  facultyId: string;
  facultyName: string;
  facultyAvatar?: string;
  department: string; // e.g. 'All' or 'ECE', 'CSE', etc.
  year?: string;       // e.g. 'All' or '1st Year', '2nd Year', '3rd Year', '4th Year'
  section?: string;    // e.g. 'All' or 'A', 'B', 'C'
  subject?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  attachmentUrl?: string;
  attachmentName?: string;
  publishDate: string;
  expiryDate?: string;
  createdAt: number;
  viewsCount?: number;
}

export interface CommunicationReport {
  id: string;
  conversationId: string;
  reportedBy: string;
  reporterName: string;
  reporterRole: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: 'Inappropriate Language' | 'Spam / Flooding' | 'Harassment' | 'Unprofessional Behavior' | 'Security Concern' | 'Other';
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  actionTaken?: string;
  createdAt: number;
}




