export type GatePaper = 'ECE' | 'EEE' | 'ME' | 'CE' | 'CSE' | 'AIDS' | 'BM' | 'RO';

export type GateResourceType =
  | 'PYQ_PAPER'
  | 'PYQS'
  | 'PRACTICE_QUESTIONS'
  | 'MOCK_TEST'
  | 'FORMULA_SHEET'
  | 'STUDY_NOTES'
  | 'SYLLABUS'
  | 'ANSWER_KEY'
  | 'DETAILED_SOLUTION'
  | 'REFERENCE_BOOK'
  | 'PREPARATION_GUIDE'
  | 'REVISION_NOTES'
  | 'IMPORTANT_QUESTIONS'
  | 'SUBJECT_NOTES'
  | 'TOPIC_NOTES'
  | 'INTERVIEW_PREP'
  | 'OTHER';

export type ResourceStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'UNPUBLISHED'
  | 'ARCHIVED'
  | 'DELETED';

export type GateDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'ADVANCED';

export type QuestionType = 'MCQ' | 'MSQ' | 'NAT';

export interface GateResource {
  id: string;
  title: string;
  description: string;
  branch: string; // ECE, EEE, ME, CE
  gatePaper: GatePaper;
  subject: string;
  topic: string;
  subtopic?: string;
  resourceType: GateResourceType | string;
  year?: number;
  difficulty: GateDifficulty;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  externalSourceUrl?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByRole: string;
  createdAt: number;
  updatedAt: number;
  status: ResourceStatus;
  publishedAt?: number;
  tags: string[];
  version: number;
  downloadCount: number;
  viewCount: number;
  isDeleted?: boolean;
  deletedAt?: number;
  deletedBy?: string;
  reviewNote?: string;
  authorName?: string;
  copyrightNotes?: string;
}

export interface GateQuestion {
  id: string;
  gatePaper: GatePaper;
  subject: string;
  topic: string;
  subtopic?: string;
  year?: number;
  difficulty: GateDifficulty;
  questionType: QuestionType;
  question: string;
  options?: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: string; // 'A' or 'A,B' or '12.5'
  explanation: string;
  marks: number;
  negativeMarks: number;
  source?: string;
  tags: string[];
  status: ResourceStatus;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  updatedAt: number;
  isDeleted?: boolean;
  deletedAt?: number;
  deletedBy?: string;
}

export interface GateMockTest {
  id: string;
  title: string;
  description: string;
  gatePaper: GatePaper;
  subjects: string[];
  topics: string[];
  totalQuestions: number;
  durationMinutes: number;
  totalMarks: number;
  negativeMarkingEnabled: boolean;
  difficulty: GateDifficulty;
  instructions: string;
  questions: GateQuestion[];
  startDate?: string;
  endDate?: string;
  status: ResourceStatus;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  updatedAt: number;
  attemptCount: number;
  isDeleted?: boolean;
  deletedAt?: number;
  deletedBy?: string;
}

export interface GateSubjectWeightage {
  id: string;
  gatePaper: GatePaper;
  subject: string;
  year: number;
  questionCount: number;
  marks: number;
  weightagePercentage: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  source?: string;
}

export interface ScheduleTask {
  id: string;
  dayOrWeek: string;
  dateStr: string;
  subject: string;
  topic: string;
  taskType: 'STUDY' | 'PYQ' | 'FORMULA' | 'MOCK_TEST' | 'REVISION';
  durationHours: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface GateStudySchedule {
  id: string;
  studentId: string;
  studentName: string;
  gatePaper: GatePaper;
  targetYear: number;
  targetScore: number;
  dailyHours: number;
  startDate: string;
  examDate: string;
  strongSubjects: string[];
  weakSubjects: string[];
  tasks: ScheduleTask[];
  createdAt: number;
  updatedAt: number;
}

export interface GateStudentAttempt {
  id: string;
  studentId: string;
  studentName: string;
  mockTestId?: string;
  mockTestTitle?: string;
  gatePaper: GatePaper;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  subjectBreakdown: Record<string, { attempted: number; correct: number; wrong: number; accuracy: number }>;
  weakTopics: string[];
  completedAt: number;
}

export interface GateAuditLog {
  id: string;
  userId: string;
  name: string;
  role: string;
  action: string;
  module: 'GATE_PREP';
  resourceId: string;
  details: string;
  timestamp: number;
}

export interface GateSettings {
  requireApprovalForFacultyUploads: boolean;
  allowStudentResourceSubmissions: boolean;
  customResourceTypes: string[];
}
