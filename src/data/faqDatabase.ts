import { FAQItem } from '../types';

export const INITIAL_FAQS: FAQItem[] = [
  // --- GENERAL ---
  {
    id: 'faq-gen-1',
    category: 'General',
    question: 'What is CKCET CAMPRO?',
    keywords: ['ckcet', 'campro', 'about', 'system', 'portal', 'overview', 'what is'],
    answer: 'CKCET CAMPRO is the comprehensive smart campus management software for Sri Jayaram Educational Trust\'s Christ The King Engineering College. It unifies attendance, internal marks, leave workflows, grievance redressal, project collaboration, lab monitoring, and placement management in a single real-time platform.',
    relatedQuestions: [
      'What are the key features of CKCET CAMPRO?',
      'Who can use CKCET CAMPRO?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-gen-2',
    category: 'General',
    question: 'What user roles exist in CKCET CAMPRO?',
    keywords: ['roles', 'permissions', 'user roles', 'student', 'faculty', 'admin', 'superadmin', 'placement officer'],
    answer: 'CKCET CAMPRO supports multiple roles: Students, Faculty, Department Heads (HOD), Mentors, Placement Officers, Recruiters, Maintenance Staff, Administrators, and SuperAdmins. Each role has customized Role-Based Access Control (RBAC) permissions.',
    relatedQuestions: [
      'How do I switch roles or views?',
      'How do I contact admin for role updates?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-gen-3',
    category: 'General',
    question: 'How do I log in to CKCET CAMPRO?',
    keywords: ['login', 'signin', 'account', 'auth', 'credentials', 'access', 'how to login'],
    answer: 'Select your Role (Student, Faculty, Admin, etc.) on the login screen, enter your registered institutional Email or Register/Roll Number, and password. Demo quick-fill accounts are available for instant testing.',
    relatedQuestions: [
      'How do I reset my password?',
      'How do I register a new account?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-gen-4',
    category: 'General',
    question: 'How do I reset my password?',
    keywords: ['reset', 'password', 'forgot', 'change password', 'recover', 'credentials'],
    answer: 'Click "Forgot Password?" on the login screen, enter your registered institutional email, and follow the password recovery link. Alternatively, submit a ticket or contact your Campus Administrator.',
    relatedQuestions: [
      'How do I log in to CKCET CAMPRO?',
      'How do I contact admin?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-gen-5',
    category: 'General',
    question: 'How do I register as a new user?',
    keywords: ['register', 'signup', 'new user', 'create account', 'enrollment'],
    answer: 'New students and faculty are enrolled automatically by the Academic Admin department during admission. If your account is not activated, click "Register" on the login screen or contact the administrative office.',
    relatedQuestions: [
      'How do I log in to CKCET CAMPRO?',
      'How do I contact admin?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- STUDENT MODULE ---
  {
    id: 'faq-stu-1',
    category: 'Student Module',
    question: 'How do I check my attendance percentage?',
    keywords: ['attendance', 'percentage', 'absent', 'present', 'check attendance', 'shortage'],
    answer: 'Navigate to the "Lab Attendance" or "My Dashboard" module. The system displays subject-wise attendance percentages, total classes attended, and highlights if you fall below Anna University\'s mandatory 75% threshold.',
    relatedQuestions: [
      'What happens if my attendance is below 75%?',
      'How do I apply for leave?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-stu-2',
    category: 'Student Module',
    question: 'How do I view my semester results and marks?',
    keywords: ['results', 'marks', 'semester', 'sgpa', 'cgpa', 'grades', 'view results'],
    answer: 'Click on the "Result Portal" tab in the left navigation sidebar. You can select the semester to view subject-wise internal, external, total marks, grade points, SGPA, and cumulative CGPA.',
    relatedQuestions: [
      'How is CGPA calculated?',
      'How can I predict my target SGPA?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-stu-3',
    category: 'Student Module',
    question: 'How is CGPA calculated in CKCET CAMPRO?',
    keywords: ['cgpa', 'sgpa', 'formula', 'calculation', 'grade point', 'credit', 'calculate'],
    answer: 'CGPA is calculated using the standard credit-weighted grade point average formula: CGPA = Σ(Subject Credits × Grade Points) / Σ(Total Course Credits). Grade O = 10, A+ = 9, A = 8, B+ = 7, B = 6, C = 5, F = 0.',
    relatedQuestions: [
      'How do I view my semester results and marks?',
      'Where can I use the GPA Calculator?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-stu-4',
    category: 'Student Module',
    question: 'How do I update my profile, resume, and skills?',
    keywords: ['profile', 'resume', 'skills', 'update profile', 'certificates', 'github'],
    answer: 'Go to "My Profile" or "AI Career Module". You can upload your PDF resume, enter GitHub and LinkedIn links, select technical skills, and upload achievement certificates.',
    relatedQuestions: [
      'How do I apply for internships?',
      'How do I upload documents?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- FACULTY MODULE ---
  {
    id: 'faq-fac-1',
    category: 'Faculty Module',
    question: 'How do faculty members upload student internal marks?',
    keywords: ['upload marks', 'faculty', 'internal marks', 'grade entry', 'marks upload'],
    answer: 'Faculty members navigate to "Academic & Results Portal" or "Upload Marks", select the department, batch, subject, and assessment (IAT 1, IAT 2, Model Exam). Marks can be edited directly in the grid or bulk-imported.',
    relatedQuestions: [
      'How do I publish exam results?',
      'How do I lock marks for a semester?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-fac-2',
    category: 'Faculty Module',
    question: 'How do faculty track student progress and mentor-mentee reviews?',
    keywords: ['mentor', 'mentee', 'student progress', 'feedback', 'project review'],
    answer: 'Open the "Mentor-Mentee" portal. Mentors can view assigned students, track attendance, log meeting agendas, review project innovation milestones, and provide academic advice.',
    relatedQuestions: [
      'How do I approve student leave requests?',
      'How do I review student innovation projects?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- ADMIN MODULE ---
  {
    id: 'faq-adm-1',
    category: 'Admin Module',
    question: 'What features are available in the Admin Module?',
    keywords: ['admin panel', 'user management', 'department management', 'subject management', 'analytics', 'reports', 'permissions'],
    answer: 'The Admin Module provides institutional control over User Management (Students/Faculty), Department and Subject Allocations, Real-time System Metrics, Audit Logs, System Settings, and FAQ Knowledge Base Management.',
    relatedQuestions: [
      'How do I add or edit users?',
      'How do I manage campus FAQs?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-adm-2',
    category: 'Admin Module',
    question: 'How do I contact admin for system support?',
    keywords: ['contact admin', 'support', 'helpdesk', 'system admin', 'admin email'],
    answer: 'You can contact the Administrative Helpdesk directly via email at admin@ckcet.edu.in or by submitting a ticket under the "Complaint Management" module with Category set to "System/IT".',
    relatedQuestions: [
      'How do I register a complaint?',
      'How do I reset my password?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- LEAVE MANAGEMENT ---
  {
    id: 'faq-lev-1',
    category: 'Leave Management',
    question: 'How do I apply for leave or on-duty permission?',
    keywords: ['apply leave', 'leave request', 'on duty', 'od', 'medical leave', 'casual leave', 'permission'],
    answer: 'Go to "Leave Management" -> "Apply for Leave". Select Leave Type (Medical, Casual, On Duty, Sports, Internship), enter Start Date, End Date, Reason, emergency contacts, and attach supporting medical or OD certificates.',
    relatedQuestions: [
      'How do I check my leave approval status?',
      'What documents are required for medical leave?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-lev-2',
    category: 'Leave Management',
    question: 'How does the leave approval process work?',
    keywords: ['leave approval', 'approval process', 'advisor', 'hod', 'status'],
    answer: 'When a student applies, the request first moves to the Class Advisor for review. If leave exceeds the configured policy threshold (e.g., 3 days), it is automatically routed to the Head of Department (HOD) for final approval.',
    relatedQuestions: [
      'How do I apply for leave or on-duty permission?',
      'What documents are required for medical leave?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-lev-3',
    category: 'Leave Management',
    question: 'What supporting documents are required for leave?',
    keywords: ['leave documents', 'medical certificate', 'od letter', 'event proof', 'upload documents'],
    answer: 'Medical leaves require an official Doctor\'s Medical Certificate and Fitness Certificate. On Duty (OD) permissions require an invitation letter or official competition certificate.',
    relatedQuestions: [
      'How do I apply for leave or on-duty permission?',
      'How do I upload documents?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- COMPLAINT MANAGEMENT ---
  {
    id: 'faq-cmp-1',
    category: 'Complaint Management',
    question: 'How do I register a campus complaint or grievance?',
    keywords: ['complaint', 'register complaint', 'file grievance', 'wifi', 'hostel', 'lab issue', 'maintenance'],
    answer: 'Open "Complaint Management" -> "Register Complaint". Enter a descriptive title, choose a category (Wi-Fi/IT, Electrical, Plumbing, Hostel, Laboratory), select priority, upload photo evidence, and click Submit.',
    relatedQuestions: [
      'How do I check complaint status?',
      'Who gets assigned to my complaint?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-cmp-2',
    category: 'Complaint Management',
    question: 'How can I track complaint resolution status?',
    keywords: ['complaint status', 'track ticket', 'resolution', 'assigned staff', 'timeline'],
    answer: 'In the Complaint Management dashboard, click on your ticket. You can view real-time timeline updates (New -> Assigned -> In Progress -> Completed), contact details of assigned maintenance staff, and rate completed work.',
    relatedQuestions: [
      'How do I register a campus complaint or grievance?',
      'Can I upload photos with my complaint?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- PROJECT COLLABORATION ---
  {
    id: 'faq-prj-1',
    category: 'Project Collaboration',
    question: 'How do I create a project or join a team?',
    keywords: ['create project', 'join team', 'project innovation', 'collaboration', 'team members', 'skills'],
    answer: 'Go to "Project Innovation". Click "Create Project" to submit your innovation title, abstract, tech stack, and open team roles. To join an existing team, browse open projects and click "Request to Join".',
    relatedQuestions: [
      'How do faculty review student projects?',
      'How do I upload project documentation?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },
  {
    id: 'faq-prj-2',
    category: 'Project Collaboration',
    question: 'How do team members share files and progress updates?',
    keywords: ['file sharing', 'progress updates', 'milestones', 'kanban', 'project chat'],
    answer: 'Inside each project space, members have access to a Kanban task board, Milestone tracker, File/Proposal uploader, GitHub repository link, and a real-time team chat channel.',
    relatedQuestions: [
      'How do I create a project or join a team?',
      'How do faculty review student projects?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- COMMUNITY HUB ---
  {
    id: 'faq-com-1',
    category: 'Community Hub',
    question: 'What can I do in the Community Hub?',
    keywords: ['community', 'posts', 'comments', 'announcements', 'events', 'discussion', 'polls'],
    answer: 'The Community Hub is the social learning space of CKCET. You can share technical articles, ask questions, create interactive polls, register for campus events, and participate in club discussions.',
    relatedQuestions: [
      'How do I view official announcements?',
      'How do I post in the community?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- INTERNSHIP MODULE ---
  {
    id: 'faq-int-1',
    category: 'Internship Module',
    question: 'How do I apply for internships in CKCET CAMPRO?',
    keywords: ['internship', 'apply internship', 'stipend', 'summer training', 'ppo', 'interview schedule'],
    answer: 'Navigate to "Placement & Internships" -> "Internships". Filter opportunities by role, stipend, and department eligibility, upload your resume, and click "Apply Now".',
    relatedQuestions: [
      'How can I view my placement and internship status?',
      'How do I upload my resume?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- PLACEMENT MODULE ---
  {
    id: 'faq-plc-1',
    category: 'Placement Module',
    question: 'How can I view placement drives and company eligibility?',
    keywords: ['placement', 'company', 'eligibility', 'salary package', 'lpa', 'drive date', 'interview results'],
    answer: 'Open the "Placement Portal". You can review upcoming campus placement drives, salary packages (LPA), minimum CGPA cutoff, required tech stack, drive dates, and track your interview rounds.',
    relatedQuestions: [
      'How do I apply for internships in CKCET CAMPRO?',
      'How do I use the AI Career Module for interview prep?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- AI CAREER MODULE ---
  {
    id: 'faq-ai-1',
    category: 'AI Career Module',
    question: 'How does the AI Career & Skill Gap Analyzer work?',
    keywords: ['ai career', 'skill gap', 'resume tips', 'learning recommendations', 'readiness score', 'roadmap'],
    answer: 'The AI Career Module analyzes your current CGPA, tech stack, and projects against target company profiles. It highlights missing skills, provides course recommendations, ATS resume scores, and career roadmaps.',
    relatedQuestions: [
      'How do I view placement drives and company eligibility?',
      'How do I practice interview questions?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- LAB MODULE ---
  {
    id: 'faq-lab-1',
    category: 'Lab Module',
    question: 'How is lab attendance and experiment records recorded?',
    keywords: ['lab', 'lab entry', 'experiment records', 'in time', 'out time', 'lab attendance', 'remarks'],
    answer: 'In the "Lab Attendance" module, students scan QR codes or faculty log lab entry times, experiment numbers completed, in/out timestamps, and faculty approval remarks.',
    relatedQuestions: [
      'How do I check my attendance percentage?',
      'What is the minimum attendance requirement?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  },

  // --- NOTIFICATIONS ---
  {
    id: 'faq-not-1',
    category: 'Notifications',
    question: 'How do campus notifications work?',
    keywords: ['notifications', 'alerts', 'read status', 'updates', 'unread', 'bell icon'],
    answer: 'Real-time notifications trigger whenever exam results are published, leave applications are updated, new placement drives are posted, or complaints are assigned. Click the bell icon in the top navbar to view all alerts.',
    relatedQuestions: [
      'How do I view my semester results and marks?',
      'How do I check my leave approval status?'
    ],
    language: 'en',
    version: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    status: 'active'
  }
];
