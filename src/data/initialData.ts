import {
  User,
  Department,
  Course,
  Subject,
  StudentResult,
  StudentAttendanceSummary,
  Complaint,
  LostFoundItem,
  Resource,
  MentorAssignment,
  MeetingSchedule,
  LeaveRequest,
  CommunityPost,
  Announcement,
  NotificationItem,
  AuditLog
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-super-1',
    name: 'Dr. Eleanor Vance',
    email: 'chancellor@university.edu',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'University Executive Board',
    employeeId: 'EMP001',
    phone: '+1 (555) 019-2831',
    status: 'active'
  },
  {
    id: 'u-admin-1',
    name: 'Marcus Sterling',
    email: 'admin@university.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    department: 'Academic Registrar',
    employeeId: 'EMP012',
    phone: '+1 (555) 018-9922',
    status: 'active'
  },
  {
    id: 'u-faculty-1',
    name: 'Prof. Robert Thorne',
    email: 'r.thorne@university.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    employeeId: 'EMP104',
    phone: '+1 (555) 017-3820',
    status: 'active'
  },
  {
    id: 'u-faculty-2',
    name: 'Dr. Sarah Lin',
    email: 's.lin@university.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Information Technology',
    employeeId: 'EMP108',
    phone: '+1 (555) 016-4433',
    status: 'active'
  },
  {
    id: 'u-student-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@student.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    rollNumber: 'CS2023001',
    phone: '+1 (555) 012-3456',
    status: 'active',
    semester: 6,
    section: 'A',
    batch: '2023-2027',
    parentEmail: 'parent.rivera@gmail.com',
    parentPhone: '+1 (555) 012-9876'
  },
  {
    id: 'u-student-2',
    name: 'Sophia Patel',
    email: 'sophia.p@student.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    rollNumber: 'CS2023002',
    phone: '+1 (555) 013-8821',
    status: 'active',
    semester: 6,
    section: 'A',
    batch: '2023-2027',
    parentEmail: 'patel.family@gmail.com',
    parentPhone: '+1 (555) 013-7722'
  },
  {
    id: 'u-mentor-1',
    name: 'Dr. James Oakley',
    email: 'j.oakley@university.edu',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science & Engineering',
    employeeId: 'EMP201',
    phone: '+1 (555) 011-5544',
    status: 'active'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', code: 'CSE', name: 'Computer Science & Engineering', headOfDepartment: 'Dr. Robert Thorne', totalStudents: 480, totalFaculty: 28 },
  { id: 'dept-2', code: 'ECE', name: 'Electronics & Communication', headOfDepartment: 'Dr. Anita Desai', totalStudents: 360, totalFaculty: 22 },
  { id: 'dept-3', code: 'ME', name: 'Mechanical Engineering', headOfDepartment: 'Prof. David Vance', totalStudents: 290, totalFaculty: 18 },
  { id: 'dept-4', code: 'IT', name: 'Information Technology', headOfDepartment: 'Dr. Sarah Lin', totalStudents: 320, totalFaculty: 20 }
];

export const INITIAL_RESULTS: StudentResult[] = [
  {
    id: 'res-1',
    studentId: 'u-student-1',
    studentName: 'Alex Rivera',
    rollNumber: 'CS2023001',
    department: 'Computer Science & Engineering',
    semester: 6,
    batch: '2023-2027',
    sgpa: 8.85,
    cgpa: 8.72,
    totalCredits: 24,
    rank: 3,
    publishedDate: '2026-06-15',
    subjects: [
      { subjectId: 's1', subjectCode: 'CS601', subjectName: 'Distributed Systems & Cloud', credits: 4, internalMarks: 46, externalMarks: 44, totalMarks: 90, grade: 'O', gradePoint: 10, status: 'PASS' },
      { subjectId: 's2', subjectCode: 'CS602', subjectName: 'Artificial Intelligence & ML', credits: 4, internalMarks: 43, externalMarks: 42, totalMarks: 85, grade: 'A+', gradePoint: 9, status: 'PASS' },
      { subjectId: 's3', subjectCode: 'CS603', subjectName: 'Advanced Web Architecture', credits: 4, internalMarks: 45, externalMarks: 43, totalMarks: 88, grade: 'A+', gradePoint: 9, status: 'PASS' },
      { subjectId: 's4', subjectCode: 'CS604', subjectName: 'Compiler Design', credits: 4, internalMarks: 40, externalMarks: 38, totalMarks: 78, grade: 'A', gradePoint: 8, status: 'PASS' },
      { subjectId: 's5', subjectCode: 'CS605', subjectName: 'Cyber Security & Crypto', credits: 4, internalMarks: 44, externalMarks: 41, totalMarks: 85, grade: 'A+', gradePoint: 9, status: 'PASS' },
      { subjectId: 's6', subjectCode: 'CS606', subjectName: 'Cloud Computing Lab', credits: 4, internalMarks: 48, externalMarks: 47, totalMarks: 95, grade: 'O', gradePoint: 10, status: 'PASS' }
    ]
  },
  {
    id: 'res-2',
    studentId: 'u-student-2',
    studentName: 'Sophia Patel',
    rollNumber: 'CS2023002',
    department: 'Computer Science & Engineering',
    semester: 6,
    batch: '2023-2027',
    sgpa: 9.35,
    cgpa: 9.21,
    totalCredits: 24,
    rank: 1,
    publishedDate: '2026-06-15',
    subjects: [
      { subjectId: 's1', subjectCode: 'CS601', subjectName: 'Distributed Systems & Cloud', credits: 4, internalMarks: 48, externalMarks: 47, totalMarks: 95, grade: 'O', gradePoint: 10, status: 'PASS' },
      { subjectId: 's2', subjectCode: 'CS602', subjectName: 'Artificial Intelligence & ML', credits: 4, internalMarks: 47, externalMarks: 45, totalMarks: 92, grade: 'O', gradePoint: 10, status: 'PASS' },
      { subjectId: 's3', subjectCode: 'CS603', subjectName: 'Advanced Web Architecture', credits: 4, internalMarks: 46, externalMarks: 46, totalMarks: 92, grade: 'O', gradePoint: 10, status: 'PASS' },
      { subjectId: 's4', subjectCode: 'CS604', subjectName: 'Compiler Design', credits: 4, internalMarks: 42, externalMarks: 41, totalMarks: 83, grade: 'A+', gradePoint: 9, status: 'PASS' },
      { subjectId: 's5', subjectCode: 'CS605', subjectName: 'Cyber Security & Crypto', credits: 4, internalMarks: 45, externalMarks: 44, totalMarks: 89, grade: 'A+', gradePoint: 9, status: 'PASS' },
      { subjectId: 's6', subjectCode: 'CS606', subjectName: 'Cloud Computing Lab', credits: 4, internalMarks: 49, externalMarks: 48, totalMarks: 97, grade: 'O', gradePoint: 10, status: 'PASS' }
    ]
  }
];

export const INITIAL_ATTENDANCE: StudentAttendanceSummary = {
  studentId: 'u-student-1',
  studentName: 'Alex Rivera',
  rollNumber: 'CS2023001',
  totalClasses: 120,
  attendedClasses: 106,
  percentage: 88.33,
  subjectWise: [
    { subjectName: 'Distributed Systems & Cloud', total: 24, attended: 22, percentage: 91.67 },
    { subjectName: 'Artificial Intelligence & ML', total: 22, attended: 20, percentage: 90.9 },
    { subjectName: 'Advanced Web Architecture', total: 20, attended: 18, percentage: 90.0 },
    { subjectName: 'Compiler Design', total: 20, attended: 16, percentage: 80.0 },
    { subjectName: 'Cyber Security & Crypto', total: 18, attended: 15, percentage: 83.33 },
    { subjectName: 'Cloud Computing Lab', total: 16, attended: 15, percentage: 93.75 }
  ]
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-101',
    title: 'High-speed Wi-Fi dropping intermittently in CSE Lab 3',
    description: 'The wireless access point in CSE Lab 3 disconnects every 15 minutes during practical sessions, causing loss of unsaved code.',
    category: 'IT & Wi-Fi',
    priority: 'High',
    status: 'In Progress',
    reportedBy: 'u-student-1',
    studentName: 'Alex Rivera',
    department: 'Computer Science & Engineering',
    assignedTo: 'u-faculty-1',
    assignedFacultyName: 'Prof. Robert Thorne',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-07-28 10:15 AM',
    updatedAt: '2026-07-29 02:30 PM',
    aiSuggestedDepartment: 'IT Infrastructure & Network Cell'
  },
  {
    id: 'comp-102',
    title: 'Water dispenser cooling unit malfunctioning in Block B',
    description: 'The drinking water cooler on the second floor of Block B is dispensing warm water and making loud motor sounds.',
    category: 'Infrastructure',
    priority: 'Medium',
    status: 'Pending',
    reportedBy: 'u-student-2',
    studentName: 'Sophia Patel',
    department: 'Computer Science & Engineering',
    createdAt: '2026-07-30 09:00 AM',
    updatedAt: '2026-07-30 09:00 AM',
    aiSuggestedDepartment: 'Estate Maintenance Team'
  }
];

export const INITIAL_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    type: 'Lost',
    title: 'Sony WH-1000XM4 Headphones (Black)',
    description: 'Lost black over-ear noise cancelling headphones in a protective zip case near Central Library reading hall.',
    category: 'Electronics',
    location: 'Central Library 2nd Floor',
    date: '2026-07-30',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    reportedBy: 'u-student-1',
    contactEmail: 'alex.rivera@student.edu',
    contactPhone: '+1 (555) 012-3456',
    status: 'Open'
  },
  {
    id: 'lf-2',
    type: 'Found',
    title: 'University Student ID Card - CSE Dept',
    description: 'Found ID card belonging to a 3rd year student near Campus Cafeteria outdoor seating.',
    category: 'ID Card / Wallet',
    location: 'Campus Cafeteria Main Entrance',
    date: '2026-07-31',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    reportedBy: 'u-faculty-2',
    contactEmail: 's.lin@university.edu',
    contactPhone: '+1 (555) 016-4433',
    status: 'Open'
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-101',
    title: 'Distributed Systems & Microservices Core Lecture Notes',
    type: 'Notes',
    category: 'Lecture Notes',
    department: 'Computer Science & Engineering',
    subject: 'CS601',
    description: 'Comprehensive handwritten & typed notes covering Raft consensus, Paxos, gRPC, and Docker orchestration.',
    fileUrl: '#',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    uploadedBy: 'u-faculty-1',
    authorName: 'Prof. Robert Thorne',
    downloadsCount: 142,
    rating: 4.9,
    reviewsCount: 28,
    createdAt: '2026-07-10'
  },
  {
    id: 'res-102',
    title: 'AI & Deep Learning 5-Year Solved Question Papers',
    type: 'Previous Paper',
    category: 'Question Bank',
    department: 'Computer Science & Engineering',
    subject: 'CS602',
    description: 'Compilation of university end-semester exam question papers with detailed step-by-step solutions.',
    fileUrl: '#',
    fileSize: '8.1 MB',
    fileType: 'PDF',
    uploadedBy: 'u-student-2',
    authorName: 'Sophia Patel',
    downloadsCount: 215,
    rating: 4.8,
    reviewsCount: 35,
    createdAt: '2026-07-15'
  },
  {
    id: 'res-103',
    title: 'Arduino & IoT Sensor Development Kit (Lab Unit #04)',
    type: 'Lab Equipment',
    category: 'Hardware Kit',
    department: 'Electronics & Communication',
    description: 'Fully tested hardware kit containing ESP32, OLED displays, Ultrasonic sensors, and jumper wires for project work.',
    fileUrl: '#',
    fileSize: 'N/A',
    fileType: 'Hardware',
    uploadedBy: 'u-faculty-2',
    authorName: 'Dr. Sarah Lin',
    downloadsCount: 19,
    rating: 5.0,
    reviewsCount: 8,
    createdAt: '2026-07-20',
    isEquipmentAvailable: true
  }
];

export const INITIAL_MENTOR_ASSIGNMENTS: MentorAssignment[] = [
  {
    id: 'ma-1',
    mentorId: 'u-mentor-1',
    mentorName: 'Dr. James Oakley',
    studentId: 'u-student-1',
    studentName: 'Alex Rivera',
    rollNumber: 'CS2023001',
    department: 'Computer Science & Engineering',
    semester: 6,
    cgpa: 8.72,
    attendancePercentage: 88.33,
    lastMeetingDate: '2026-07-22'
  },
  {
    id: 'ma-2',
    mentorId: 'u-mentor-1',
    mentorName: 'Dr. James Oakley',
    studentId: 'u-student-2',
    studentName: 'Sophia Patel',
    rollNumber: 'CS2023002',
    department: 'Computer Science & Engineering',
    semester: 6,
    cgpa: 9.21,
    attendancePercentage: 94.5,
    lastMeetingDate: '2026-07-25'
  }
];

export const INITIAL_MEETINGS: MeetingSchedule[] = [
  {
    id: 'meet-1',
    mentorId: 'u-mentor-1',
    mentorName: 'Dr. James Oakley',
    studentId: 'u-student-1',
    studentName: 'Alex Rivera',
    title: '6th Semester Career Guidance & Research Internship Review',
    date: '2026-08-05',
    time: '03:00 PM',
    location: 'Faculty Cabin 204 / Google Meet',
    agenda: 'Discussion on major capstone project topic selection, higher studies preparation, and academic review.',
    status: 'Scheduled',
    notes: 'Alex is showing strong interest in distributed cloud storage algorithms.'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv-101',
    studentId: 'u-student-1',
    studentName: 'Alex Rivera',
    rollNumber: 'CS2023001',
    department: 'Computer Science & Engineering',
    reason: 'Attending Inter-University Hackathon Final Stage at National Tech Expo.',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    daysCount: 3,
    type: 'Duty',
    status: 'Pending',
    parentNotified: true,
    appliedOn: '2026-07-31'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Alex Rivera',
    authorRole: 'Student Council VP',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    title: '🚀 Annual Hackathon "HackCampus 2026" Registrations Open!',
    content: 'Excited to announce that registrations for HackCampus 2026 are officially live! Over $10,000 in prizes, mentorship from top tech leaders, and direct interview opportunities. Form your team of 3-4 students.',
    category: 'Event',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    likes: 42,
    isLiked: false,
    comments: [
      { id: 'c1', authorName: 'Sophia Patel', authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', content: 'Looking for a UI/UX designer to join our team! DM if interested.', createdAt: '10 mins ago' }
    ],
    poll: {
      question: 'Which domain track should we prioritize for the keynote workshop?',
      options: [
        { text: 'Generative AI & LLMs', votes: 128 },
        { text: 'Web3 & Decentralized Systems', votes: 45 },
        { text: 'Cybersecurity & Cloud Native', votes: 89 },
        { text: 'Robotics & Embedded Systems', votes: 34 }
      ],
      totalVotes: 296
    },
    createdAt: '2 hours ago'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'End-Semester Examination Time Table Published (Summer 2026)',
    content: 'The official end-semester examination datesheet for all B.Tech and M.Tech departments is now live on the result portal.',
    category: 'Exam',
    targetRoles: ['student', 'faculty', 'mentor', 'admin', 'super_admin'],
    issuedBy: 'Office of the Controller of Examinations',
    date: '2026-07-31',
    isImportant: true
  },
  {
    id: 'ann-2',
    title: 'Campus Central Library Extended Operating Hours during Exam Week',
    content: 'Central Library reading rooms will remain open 24/7 starting August 5th to support student exam preparation.',
    category: 'Academic',
    targetRoles: ['student', 'faculty'],
    issuedBy: 'Chief Librarian',
    date: '2026-07-30',
    isImportant: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Result Published', message: '6th Semester CGPA results have been officially updated in your dashboard.', type: 'info', timestamp: '1 hour ago', read: false, linkModule: 'results' },
  { id: 'n2', title: 'Complaint Status Updated', message: 'Complaint #COMP-101 assigned to Prof. Robert Thorne.', type: 'warning', timestamp: '3 hours ago', read: false, linkModule: 'complaints' },
  { id: 'n3', title: 'Mentorship Session', message: 'New meeting scheduled with Dr. James Oakley on Aug 5, 3:00 PM.', type: 'success', timestamp: '1 day ago', read: true, linkModule: 'mentor' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', action: 'RESULT_UPLOADED', performedBy: 'Prof. Robert Thorne', userRole: 'Faculty', target: 'CS601 Semester 6 Marks', timestamp: '2026-07-31 14:20:10', ipAddress: '192.168.1.104' },
  { id: 'log-2', action: 'USER_ROLE_UPDATED', performedBy: 'Marcus Sterling', userRole: 'Admin', target: 'Dr. James Oakley (Assigned Mentor)', timestamp: '2026-07-30 09:15:22', ipAddress: '192.168.1.10' },
  { id: 'log-3', action: 'LEAVE_APPROVED', performedBy: 'Dr. Sarah Lin', userRole: 'Faculty', target: 'Leave #LV-098 (Medical)', timestamp: '2026-07-29 11:45:00', ipAddress: '192.168.1.108' }
];
