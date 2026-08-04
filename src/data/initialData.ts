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
  AuditLog,
  Project,
  SkillItem,
  CategoryItem,
  TechStackItem,
  TeamInvitation,
  PlacementOpportunity,
  PlacementApplication,
  InterviewQuestion
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
    id: 'u-po-1',
    name: 'Prof. S. Rajesh Kumar',
    email: 'placement@ckcet.ac.in',
    role: 'placement_officer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'Training & Placement Cell',
    employeeId: 'TPO001',
    phone: '+91 98401 23456',
    status: 'active'
  },
  {
    id: 'u-recruiter-1',
    name: 'Priya Sharma (Zoho Corp)',
    email: 'priya.recruiter@zoho.com',
    role: 'recruiter',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    department: 'Talent Acquisition',
    phone: '+91 99620 11223',
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
    parentPhone: '+1 (555) 012-9876',
    skills: ['React.js', 'Node.js', 'Python', 'TensorFlow', 'TypeScript', 'Tailwind CSS'],
    interests: ['Artificial Intelligence', 'Computer Vision', 'Full Stack Development'],
    projectsCompleted: 3,
    githubProfile: 'https://github.com/alexrivera-dev'
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
    parentPhone: '+1 (555) 013-7722',
    skills: ['IoT', 'Embedded C++', 'Raspberry Pi', 'Node.js', 'MQTT', 'Circuit Design'],
    interests: ['Hardware Prototyping', 'Smart Microgrids', 'Robotics'],
    projectsCompleted: 2,
    githubProfile: 'https://github.com/sophiapatel-iot'
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
    id: 'CMP-2026-101',
    title: 'High-speed Wi-Fi dropping intermittently in CSE Lab 3',
    description: 'The wireless access point in CSE Lab 3 disconnects every 15 minutes during practical sessions, causing loss of unsaved code.',
    category: 'Internet/WiFi Issues',
    priority: 'High',
    status: 'In Progress',
    reportedBy: 'u-student-1',
    studentName: 'Alex Rivera',
    studentId: 'CS2023001',
    department: 'Computer Science & Engineering',
    blockName: 'Science & Tech Block',
    floor: '2nd Floor',
    roomNumber: 'CSE Lab 3',
    assignedTo: 'u-staff-2',
    assignedStaffName: 'David Miller (IT Networks)',
    assignedStaffPhone: '+1 (555) 018-4455',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
    imageUrls: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80'],
    createdAt: '2026-07-28 10:15 AM',
    updatedAt: '2026-07-29 02:30 PM',
    aiSuggestedDepartment: 'IT Infrastructure & Network Cell',
    timeline: [
      { status: 'New Complaint Registered', updatedBy: 'Alex Rivera', timestamp: '2026-07-28 10:15 AM' },
      { status: 'Assigned to David Miller', updatedBy: 'Dr. Robert Thorne', timestamp: '2026-07-28 11:30 AM' },
      { status: 'In Progress', updatedBy: 'David Miller', timestamp: '2026-07-29 02:30 PM', note: 'Replacing wireless AP module.' }
    ]
  },
  {
    id: 'CMP-2026-102',
    title: 'Water dispenser cooling unit malfunctioning in Block B',
    description: 'The drinking water cooler on the second floor of Block B is dispensing warm water and making loud motor sounds.',
    category: 'Water Leakage',
    priority: 'Medium',
    status: 'New Complaint',
    reportedBy: 'u-student-2',
    studentName: 'Sophia Patel',
    studentId: 'CS2023002',
    department: 'Computer Science & Engineering',
    blockName: 'Main Academic Block',
    floor: '2nd Floor',
    roomNumber: 'Corridor 2B',
    createdAt: '2026-07-30 09:00 AM',
    updatedAt: '2026-07-30 09:00 AM',
    aiSuggestedDepartment: 'Estate Maintenance Team',
    timeline: [
      { status: 'New Complaint Registered', updatedBy: 'Sophia Patel', timestamp: '2026-07-30 09:00 AM' }
    ]
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

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-101',
    title: 'Autonomous Campus AI Guard & Vision System',
    abstract: 'Edge-computed computer vision pipeline using YOLOv8 and TensorFlow for real-time unauthorized entry detection, lab safety compliance monitoring, and automated emergency alert dispatches across university premises.',
    category: 'AI & Machine Learning',
    department: 'Computer Science & Engineering',
    tags: ['AI Vision', 'TensorFlow', 'YOLOv8', 'Edge Computing', 'React', 'OpenCV'],
    requiredSkills: ['Python', 'OpenCV', 'React.js', 'TensorFlow', 'Tailwind CSS', 'FastAPI'],
    ownerId: 'u-student-1',
    ownerName: 'Alex Rivera',
    facultyMentorId: 'u-faculty-1',
    facultyMentorName: 'Prof. Robert Thorne',
    stage: 'Development',
    status: 'Approved',
    innovationScore: 92,
    maxTeamSize: 4,
    githubRepo: 'https://github.com/alexrivera-dev/campus-ai-vision-guard',
    demoUrl: 'https://campus-vision-demo.university.edu',
    createdAt: '2026-06-15',
    updatedAt: '2026-07-28',
    badges: ['Faculty Pick', 'Top Innovator', 'High Impact'],
    qrCodeData: 'https://university.edu/projects/proj-101',
    members: [
      {
        userId: 'u-student-1',
        name: 'Alex Rivera',
        role: 'Project Lead',
        skills: ['React.js', 'Node.js', 'Python', 'TensorFlow'],
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        email: 'alex.rivera@student.edu',
        department: 'Computer Science & Engineering',
        joinedAt: '2026-06-15'
      },
      {
        userId: 'u-student-2',
        name: 'Sophia Patel',
        role: 'AI Engineer',
        skills: ['IoT', 'Embedded C++', 'Python'],
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        email: 'sophia.p@student.edu',
        department: 'Computer Science & Engineering',
        joinedAt: '2026-06-18'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Project_Proposal_Campus_AI_Guard.pdf',
        type: 'Proposal',
        url: '#',
        uploadedBy: 'Alex Rivera',
        uploadedAt: '2026-06-20',
        size: '2.4 MB'
      },
      {
        id: 'doc-2',
        name: 'System_Architecture_Diagram.png',
        type: 'Document',
        url: '#',
        uploadedBy: 'Sophia Patel',
        uploadedAt: '2026-07-02',
        size: '1.1 MB'
      },
      {
        id: 'doc-3',
        name: 'MidTerm_Progress_Presentation.pptx',
        type: 'Presentation',
        url: '#',
        uploadedBy: 'Alex Rivera',
        uploadedAt: '2026-07-22',
        size: '5.8 MB'
      }
    ],
    milestones: [
      { id: 'm-1', title: 'Requirement Analysis & Dataset Collection', dueDate: '2026-06-25', completed: true, completedAt: '2026-06-24', assignedTo: 'Alex Rivera', description: 'Gathered 5,000 anonymized campus security frames.' },
      { id: 'm-2', title: 'YOLOv8 Model Training & Optimization', dueDate: '2026-07-10', completed: true, completedAt: '2026-07-09', assignedTo: 'Sophia Patel', description: 'Achieved 94.2% mAP@0.5 on lab safety violations.' },
      { id: 'm-3', title: 'Full Stack Dashboard & WebSocket Stream', dueDate: '2026-07-25', completed: true, completedAt: '2026-07-25', assignedTo: 'Alex Rivera', description: 'Integrated live feed rendering & emergency dispatches.' },
      { id: 'm-4', title: 'Final Field Testing & Faculty Review', dueDate: '2026-08-10', completed: false, assignedTo: 'Alex Rivera', description: 'Deploying edge cameras in Robotics Lab for pilot run.' }
    ],
    tasks: [
      { id: 't-1', title: 'Optimize Frame Processing Rate on Jetson Nano', description: 'Reduce inference latency below 40ms per frame.', assignedTo: 'u-student-2', assignedToName: 'Sophia Patel', status: 'In Progress', priority: 'High', dueDate: '2026-08-02' },
      { id: 't-2', title: 'Export REST API documentation endpoints', description: 'Swagger / OpenAPI JSON specification.', assignedTo: 'u-student-1', assignedToName: 'Alex Rivera', status: 'Completed', priority: 'Medium', dueDate: '2026-07-27' }
    ],
    reviews: [
      {
        id: 'rev-1',
        facultyId: 'u-faculty-1',
        facultyName: 'Prof. Robert Thorne',
        comments: 'Outstanding proposal with solid methodology. Edge processing approach is well suited for real-time safety compliance.',
        innovationGrade: 9,
        technicalGrade: 9,
        presentationGrade: 9,
        overallScore: 90,
        decision: 'Approved',
        reviewedAt: '2026-06-22'
      }
    ],
    chatMessages: [
      { id: 'chat-1', senderId: 'u-student-1', senderName: 'Alex Rivera', senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', message: 'Hey team, I uploaded the latest model metrics into the documents folder.', timestamp: '10:30 AM' },
      { id: 'chat-2', senderId: 'u-student-2', senderName: 'Sophia Patel', senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', message: 'Awesome! The edge inference tests on Jetson Nano are looking very promising.', timestamp: '10:42 AM' }
    ]
  },
  {
    id: 'proj-102',
    title: 'Smart IoT Microgrid Energy Optimizer',
    abstract: 'An automated energy forecasting and dynamic load balancing system using MQTT protocol and reinforcement learning to reduce peak power costs across university hostel blocks and laboratories.',
    category: 'Renewable Energy',
    department: 'Electrical & Electronics Engineering',
    tags: ['IoT', 'Microgrid', 'Solar Energy', 'MQTT', 'Python', 'Machine Learning'],
    requiredSkills: ['Embedded C++', 'IoT', 'MQTT', 'Python', 'React', 'Circuit Design'],
    ownerId: 'u-student-2',
    ownerName: 'Sophia Patel',
    facultyMentorId: 'u-faculty-2',
    facultyMentorName: 'Dr. Sarah Lin',
    stage: 'Faculty Review',
    status: 'Pending Approval',
    innovationScore: 89,
    maxTeamSize: 3,
    githubRepo: 'https://github.com/sophiapatel-iot/smart-microgrid',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-30',
    badges: ['Green Tech', 'Emerging Idea'],
    qrCodeData: 'https://university.edu/projects/proj-102',
    members: [
      {
        userId: 'u-student-2',
        name: 'Sophia Patel',
        role: 'Project Lead',
        skills: ['IoT', 'Embedded C++', 'Raspberry Pi'],
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        email: 'sophia.p@student.edu',
        department: 'Computer Science & Engineering',
        joinedAt: '2026-07-10'
      }
    ],
    documents: [
      {
        id: 'doc-201',
        name: 'Microgrid_Optimizer_Proposal.pdf',
        type: 'Proposal',
        url: '#',
        uploadedBy: 'Sophia Patel',
        uploadedAt: '2026-07-12',
        size: '3.1 MB'
      }
    ],
    milestones: [
      { id: 'm-201', title: 'Faculty Proposal Submission', dueDate: '2026-07-15', completed: true, completedAt: '2026-07-12', assignedTo: 'Sophia Patel', description: 'Submitted detailed proposal to Dr. Sarah Lin.' },
      { id: 'm-202', title: 'Sensor Hardware Node Fabrication', dueDate: '2026-08-05', completed: false, description: 'Assembling ESP32 current and voltage sensing modules.' }
    ],
    tasks: [],
    reviews: [],
    chatMessages: []
  },
  {
    id: 'proj-103',
    title: 'Decentralized Academic Credential Verification Protocol',
    abstract: 'Zero-knowledge cryptography based blockchain registry ensuring tamper-proof degree certificates, mark sheets, and transcript verification with instant zero-cost verification for global employers.',
    category: 'Blockchain & Fintech',
    department: 'Information Technology',
    tags: ['Blockchain', 'Ethereum', 'Solidity', 'Zero Knowledge', 'Web3', 'React'],
    requiredSkills: ['Solidity', 'Web3.js', 'React.js', 'Cryptography', 'Node.js'],
    ownerId: 'u-student-1',
    ownerName: 'Alex Rivera',
    facultyMentorId: 'u-faculty-1',
    facultyMentorName: 'Prof. Robert Thorne',
    stage: 'Completed',
    status: 'Completed',
    innovationScore: 96,
    maxTeamSize: 4,
    githubRepo: 'https://github.com/alexrivera-dev/zk-degree-verify',
    demoUrl: 'https://degree-verify.university.edu',
    createdAt: '2026-03-01',
    updatedAt: '2026-07-15',
    badges: ['Top Innovator', 'Best Project 2026', 'Faculty Pick'],
    qrCodeData: 'https://university.edu/projects/proj-103',
    certificateIssued: true,
    finalGrade: 'A+',
    members: [
      {
        userId: 'u-student-1',
        name: 'Alex Rivera',
        role: 'Project Lead',
        skills: ['React.js', 'Node.js', 'Solidity'],
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        email: 'alex.rivera@student.edu',
        department: 'Computer Science & Engineering',
        joinedAt: '2026-03-01'
      }
    ],
    documents: [
      { id: 'doc-301', name: 'Final_Thesis_Report.pdf', type: 'Report', url: '#', uploadedBy: 'Alex Rivera', uploadedAt: '2026-07-10', size: '8.4 MB' },
      { id: 'doc-302', name: 'Presentation_Deck.pptx', type: 'Presentation', url: '#', uploadedBy: 'Alex Rivera', uploadedAt: '2026-07-12', size: '6.2 MB' }
    ],
    milestones: [
      { id: 'm-301', title: 'Smart Contract Deployment on Testnet', dueDate: '2026-04-10', completed: true, completedAt: '2026-04-08', description: 'Deployed and verified Solidity contracts.' },
      { id: 'm-302', title: 'Faculty Defense & Final Demonstration', dueDate: '2026-07-15', completed: true, completedAt: '2026-07-15', description: 'Awarded Grade A+ by Department Committee.' }
    ],
    tasks: [],
    reviews: [
      {
        id: 'rev-301',
        facultyId: 'u-faculty-1',
        facultyName: 'Prof. Robert Thorne',
        comments: 'Exceptional execution and publication-quality research on zero-knowledge verification.',
        innovationGrade: 10,
        technicalGrade: 10,
        presentationGrade: 9,
        overallScore: 97,
        decision: 'Approved',
        reviewedAt: '2026-07-15'
      }
    ],
    chatMessages: []
  }
];

export const INITIAL_SKILLS: SkillItem[] = [
  { id: 'sk-1', name: 'React.js', category: 'Frontend', studentsCount: 42 },
  { id: 'sk-2', name: 'TypeScript', category: 'Frontend', studentsCount: 38 },
  { id: 'sk-3', name: 'Node.js', category: 'Backend', studentsCount: 35 },
  { id: 'sk-4', name: 'Python', category: 'Data Science', studentsCount: 50 },
  { id: 'sk-5', name: 'TensorFlow', category: 'AI & ML', studentsCount: 22 },
  { id: 'sk-6', name: 'IoT', category: 'Hardware', studentsCount: 18 },
  { id: 'sk-7', name: 'Solidity', category: 'Blockchain', studentsCount: 12 },
  { id: 'sk-8', name: 'Cybersecurity', category: 'Security', studentsCount: 25 },
  { id: 'sk-9', name: 'Embedded C++', category: 'Hardware', studentsCount: 16 },
  { id: 'sk-10', name: 'Tailwind CSS', category: 'UI/UX', studentsCount: 45 }
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'AI & Machine Learning', description: 'Computer Vision, Natural Language Processing, Neural Networks, Generative AI.', totalProjects: 14 },
  { id: 'cat-2', name: 'Web & Mobile Apps', description: 'Full stack platforms, PWA, Android, iOS, Cloud microservices.', totalProjects: 22 },
  { id: 'cat-3', name: 'IoT & Robotics', description: 'Embedded systems, autonomous rovers, smart sensors, home automation.', totalProjects: 9 },
  { id: 'cat-4', name: 'Blockchain & Fintech', description: 'Smart contracts, Web3, decentralized finance, cryptographic security.', totalProjects: 7 },
  { id: 'cat-5', name: 'Renewable Energy', description: 'Smart solar grids, energy forecasting, green technology innovation.', totalProjects: 6 },
  { id: 'cat-6', name: 'Cybersecurity', description: 'Network security, penetration testing, threat detection, zero trust.', totalProjects: 8 }
];

export const INITIAL_TECH_STACKS: TechStackItem[] = [
  { id: 'ts-1', name: 'React + Node + TypeScript', category: 'Full Stack', popularity: 95 },
  { id: 'ts-2', name: 'Python + PyTorch + FastAPI', category: 'AI Stack', popularity: 88 },
  { id: 'ts-3', name: 'ESP32 + MQTT + C++', category: 'IoT Stack', popularity: 74 },
  { id: 'ts-4', name: 'Solidity + Hardhat + Web3.js', category: 'Blockchain', popularity: 65 },
  { id: 'ts-5', name: 'Docker + Kubernetes + Go', category: 'DevOps', popularity: 78 }
];

export const INITIAL_TEAM_INVITATIONS: TeamInvitation[] = [
  {
    id: 'inv-1',
    projectId: 'proj-101',
    projectTitle: 'Autonomous Campus AI Guard & Vision System',
    inviterId: 'u-student-1',
    inviterName: 'Alex Rivera',
    inviteeId: 'u-student-2',
    inviteeName: 'Sophia Patel',
    inviteeEmail: 'sophia.p@student.edu',
    role: 'AI Engineer',
    status: 'Accepted',
    sentAt: '2026-06-18'
  }
];

export const INITIAL_OPPORTUNITIES: PlacementOpportunity[] = [
  {
    id: 'opp-1',
    type: 'Full-Time Placement',
    companyName: 'Zoho Corporation',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Software Development Engineer (SDE-1)',
    departmentEligibility: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering'],
    category: 'Dream',
    location: 'Chennai / Tenkasi (Hybrid)',
    stipendOrPackage: '₹8.5 LPA',
    packageNumber: 8.5,
    duration: 'Full-Time Permanent',
    minCGPA: 7.5,
    requiredSkills: ['Java', 'Python', 'Data Structures & Algorithms', 'DBMS', 'React.js'],
    jobDescription: 'Build high-scale enterprise cloud services, collaborative applications, and robust microservices.',
    responsibilities: [
      'Design, implement, and maintain distributed cloud microservices.',
      'Optimize SQL and NoSQL database query execution speed.',
      'Collaborate with UI/UX designers to implement modern web applications.'
    ],
    perks: ['Free Food & Snacks', 'Health Insurance', 'Cab Facility', 'Learning Allowance'],
    applicationDeadline: '2026-08-25',
    driveDate: '2026-09-02',
    status: 'Open',
    recruiterId: 'u-recruiter-1',
    recruiterEmail: 'priya.recruiter@zoho.com',
    applicantsCount: 42
  },
  {
    id: 'opp-2',
    type: 'Internship',
    companyName: 'Google India',
    companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Software Engineering Intern (Summer 2027)',
    departmentEligibility: ['Computer Science & Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'],
    category: 'Dream',
    location: 'Bengaluru / Hyderabad',
    stipendOrPackage: '₹1,20,000 / month',
    packageNumber: 14.4,
    duration: '3 Months Internship',
    minCGPA: 8.5,
    requiredSkills: ['C++', 'Python', 'Algorithms', 'System Design Basics', 'Git'],
    jobDescription: 'Solve challenging computer science problems, work on core infrastructure, and contribute to production codebases.',
    responsibilities: [
      'Develop algorithms and features for global Google Cloud infrastructure.',
      'Perform unit testing and automated integration checks.',
      'Present internship project outcomes to Google Tech Leads.'
    ],
    perks: ['PPO Opportunity', 'Relocation Stipend', 'Mentorship by Senior Googlers', 'Free Gourmet Dining'],
    applicationDeadline: '2026-08-30',
    driveDate: '2026-09-10',
    status: 'Open',
    recruiterId: 'u-recruiter-2',
    recruiterEmail: 'university-hiring@google.com',
    applicantsCount: 88
  },
  {
    id: 'opp-3',
    type: 'Full-Time Placement',
    companyName: 'TATA Consultancy Services (TCS Digital)',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Digital Innovator Engineer',
    departmentEligibility: ['Computer Science & Engineering', 'Information Technology', 'Electrical & Electronics Engineering', 'Mechanical Engineering'],
    category: 'IT & Software',
    location: 'Pan India (Chennai / Bengaluru / Pune)',
    stipendOrPackage: '₹7.0 LPA',
    packageNumber: 7.0,
    duration: 'Full-Time Permanent',
    minCGPA: 6.5,
    requiredSkills: ['Python', 'SQL', 'Web Development', 'Cloud Concepts', 'Aptitude & Verbal'],
    jobDescription: 'Work on cutting-edge digital transformation projects for Fortune 500 clients worldwide.',
    responsibilities: [
      'Implement API gateways and cloud backend routines.',
      'Participate in agile sprint retrospective meetings and user story delivery.',
      'Assist in cloud deployment pipelines.'
    ],
    perks: ['Fast-track Promotion', 'Onsite Mobility Opportunities', 'TCS Elevate Incentives'],
    applicationDeadline: '2026-09-05',
    driveDate: '2026-09-15',
    status: 'Open',
    recruiterId: 'u-po-1',
    recruiterEmail: 'campus.hiring@tcs.com',
    applicantsCount: 130
  },
  {
    id: 'opp-4',
    type: 'Internship',
    companyName: 'Robert Bosch Engineering',
    companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Embedded Systems & IoT Trainee',
    departmentEligibility: ['Electrical & Electronics Engineering', 'Electronics & Communication Engineering', 'Mechanical Engineering'],
    category: 'Core',
    location: 'Coimbatore / Bengaluru',
    stipendOrPackage: '₹35,000 / month',
    packageNumber: 4.2,
    duration: '6 Months',
    minCGPA: 7.0,
    requiredSkills: ['Embedded C', 'Microcontrollers (ESP32 / STM32)', 'RTOS', 'MATLAB', 'CAN Protocol'],
    jobDescription: 'Design automotive electronics software controllers and Smart Mobility IoT telemetry systems.',
    responsibilities: [
      'Program ARM Cortex microcontrollers and sensor interfaces.',
      'Conduct hardware-in-the-loop (HIL) testing.',
      'Document schematic circuit diagrams and firmware specs.'
    ],
    perks: ['Pre-Placement Offer (PPO)', 'Bosch Academy Certification', 'Transport Allowance'],
    applicationDeadline: '2026-08-20',
    driveDate: '2026-08-28',
    status: 'Open',
    recruiterId: 'u-po-1',
    recruiterEmail: 'careers@bosch.in',
    applicantsCount: 35
  },
  {
    id: 'opp-5',
    type: 'Full-Time Placement',
    companyName: 'Larsen & Toubro (L&T Construction)',
    companyLogo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Graduate Engineer Trainee (GET - Core)',
    departmentEligibility: ['Civil Engineering', 'Mechanical Engineering', 'Electrical & Electronics Engineering'],
    category: 'Core',
    location: 'Chennai / Mumbai / Site Projects',
    stipendOrPackage: '₹6.5 LPA',
    packageNumber: 6.5,
    duration: 'Full-Time Permanent',
    minCGPA: 7.0,
    requiredSkills: ['AutoCAD', 'Revit', 'Structural Analysis', 'Project Planning', 'Construction Management'],
    jobDescription: 'Execution of mega infrastructure projects including bridges, smart cities, and power grids.',
    responsibilities: [
      'Inspect site quality, concrete structural integrity, and safety compliance.',
      'Prepare bill of quantities (BOQ) and project scheduling estimation.',
      'Coordinate with structural consultants and sub-contractors.'
    ],
    perks: ['Site Accommodation', 'Health & Accident Cover', 'L&T Leadership Academy Training'],
    applicationDeadline: '2026-09-12',
    driveDate: '2026-09-22',
    status: 'Open',
    recruiterId: 'u-po-1',
    recruiterEmail: 'campus@lntecc.com',
    applicantsCount: 28
  },
  {
    id: 'opp-6',
    type: 'Off-Campus Drive',
    companyName: 'Freshworks Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80',
    roleTitle: 'Product Operations & Customer Success Engineer',
    departmentEligibility: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering', 'Mechanical Engineering', 'Civil Engineering'],
    category: 'Startup',
    location: 'Chennai',
    stipendOrPackage: '₹9.0 LPA',
    packageNumber: 9.0,
    duration: 'Full-Time Permanent',
    minCGPA: 6.0,
    requiredSkills: ['JavaScript', 'API Testing', 'Communication Skills', 'Troubleshooting', 'SQL'],
    jobDescription: 'Assist global SaaS enterprise clients with technical API integration and platform customization.',
    responsibilities: [
      'Solve client API webhooks and integration issues.',
      'Write developer documentation and product feature guides.',
      'Collaborate with Product Managers on bug escalation.'
    ],
    perks: ['Stock Options (RSUs)', 'Wellness Budget', 'Flexible Work Hours'],
    applicationDeadline: '2026-09-18',
    driveDate: '2026-09-28',
    status: 'Upcoming',
    recruiterId: 'u-recruiter-1',
    recruiterEmail: 'freshers@freshworks.com',
    applicantsCount: 15
  }
];

export const INITIAL_APPLICATIONS: PlacementApplication[] = [
  {
    id: 'app-101',
    opportunityId: 'opp-1',
    opportunityTitle: 'Software Development Engineer (SDE-1)',
    companyName: 'Zoho Corporation',
    type: 'Full-Time Placement',
    studentId: 'u-student-1',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@student.edu',
    studentRoll: 'CS2023001',
    department: 'Computer Science & Engineering',
    cgpa: 8.8,
    resumeUrl: 'https://ckcet.ac.in/resumes/CS2023001_AlexRivera.pdf',
    matchingScore: 92,
    status: 'Interview Scheduled',
    appliedAt: '2026-08-01',
    interviewDate: '2026-08-10 at 10:00 AM',
    interviewLocation: 'Zoho Campus, Estancia IT Park / Online Video Round',
    notes: 'Shortlisted after Online Coding Round (3/3 problems passed).'
  },
  {
    id: 'app-102',
    opportunityId: 'opp-2',
    opportunityTitle: 'Software Engineering Intern (Summer 2027)',
    companyName: 'Google India',
    type: 'Internship',
    studentId: 'u-student-1',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@student.edu',
    studentRoll: 'CS2023001',
    department: 'Computer Science & Engineering',
    cgpa: 8.8,
    resumeUrl: 'https://ckcet.ac.in/resumes/CS2023001_AlexRivera.pdf',
    matchingScore: 89,
    status: 'Under Review',
    appliedAt: '2026-08-02'
  },
  {
    id: 'app-103',
    opportunityId: 'opp-1',
    opportunityTitle: 'Software Development Engineer (SDE-1)',
    companyName: 'Zoho Corporation',
    type: 'Full-Time Placement',
    studentId: 'u-student-2',
    studentName: 'Sophia Patel',
    studentEmail: 'sophia.p@student.edu',
    studentRoll: 'CS2023002',
    department: 'Computer Science & Engineering',
    cgpa: 9.2,
    resumeUrl: 'https://ckcet.ac.in/resumes/CS2023002_SophiaPatel.pdf',
    matchingScore: 96,
    status: 'Shortlisted',
    appliedAt: '2026-08-01'
  }
];

export const INITIAL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'iq-1',
    category: 'Technical',
    question: 'How do you detect a cycle in a linked list and find its starting node?',
    answerHint: 'Use Floyd’s Cycle Detection Algorithm (Two Pointers: Slow and Fast). When they meet, reset one pointer to head and move both 1 step at a time.',
    difficulty: 'Medium',
    company: 'Google / Zoho'
  },
  {
    id: 'iq-2',
    category: 'Technical',
    question: 'Explain the difference between Process and Thread, and describe how deadlocks occur.',
    answerHint: 'Processes have independent memory space, while threads share memory space of parent process. Deadlocks require 4 Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
    difficulty: 'Medium',
    company: 'TCS / Bosch'
  },
  {
    id: 'iq-3',
    category: 'HR',
    question: 'Tell me about a time you faced a conflict in a team project and how you resolved it.',
    answerHint: 'Use the STAR method (Situation, Task, Action, Result). Focus on active listening, objective data-driven decision making, and maintaining team harmony.',
    difficulty: 'Easy',
    company: 'General HR'
  },
  {
    id: 'iq-4',
    category: 'Coding Challenge',
    question: 'Write a function to find the Longest Substring Without Repeating Characters.',
    answerHint: 'Use Sliding Window technique with a Hash Set or Map tracking character last seen indices. Time Complexity: O(N), Space Complexity: O(min(N, M)).',
    difficulty: 'Hard',
    company: 'Zoho / Amazon'
  },
  {
    id: 'iq-5',
    category: 'Aptitude',
    question: 'A train 150 meters long passes a telegraph post in 12 seconds. What is the speed of the train in km/hr?',
    answerHint: 'Speed = Distance / Time = 150 / 12 = 12.5 m/s. In km/hr = 12.5 * (18 / 5) = 45 km/hr.',
    difficulty: 'Easy',
    company: 'Campus Drive Aptitude'
  }
];


