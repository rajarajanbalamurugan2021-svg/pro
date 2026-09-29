import {
  GateResource,
  GateQuestion,
  GateMockTest,
  GateSubjectWeightage,
  GateStudySchedule,
  GateStudentAttempt,
  GateAuditLog,
  GateSettings,
  GatePaper,
  GateResourceType,
  ResourceStatus,
  GateDifficulty,
  QuestionType,
  ScheduleTask
} from '../types/gate';

const STORAGE_KEYS = {
  RESOURCES: 'campro_gate_resources',
  QUESTIONS: 'campro_gate_questions',
  MOCK_TESTS: 'campro_gate_mock_tests',
  WEIGHTAGE: 'campro_gate_weightage',
  SCHEDULES: 'campro_gate_schedules',
  ATTEMPTS: 'campro_gate_attempts',
  LOGS: 'campro_gate_audit_logs',
  SETTINGS: 'campro_gate_settings',
  BOOKMARKS: 'campro_gate_bookmarks'
};

// Default Initial Weightage Data for ECE, EEE, ME, CE
const INITIAL_WEIGHTAGE_DATA: GateSubjectWeightage[] = [
  // ECE
  { id: 'w-ece-1', gatePaper: 'ECE', subject: 'Engineering Mathematics', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-ece-2', gatePaper: 'ECE', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-ece-3', gatePaper: 'ECE', subject: 'Signals and Systems', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ece-4', gatePaper: 'ECE', subject: 'Networks & Circuit Theory', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ece-5', gatePaper: 'ECE', subject: 'Control Systems', year: 2025, questionCount: 7, marks: 9, weightagePercentage: 9, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ece-6', gatePaper: 'ECE', subject: 'Electronic Devices (EDC)', year: 2025, questionCount: 6, marks: 9, weightagePercentage: 9, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ece-7', gatePaper: 'ECE', subject: 'Analog Circuits', year: 2025, questionCount: 7, marks: 9, weightagePercentage: 9, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ece-8', gatePaper: 'ECE', subject: 'Digital Circuits', year: 2025, questionCount: 6, marks: 8, weightagePercentage: 8, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ece-9', gatePaper: 'ECE', subject: 'Communications Systems', year: 2025, questionCount: 7, marks: 8, weightagePercentage: 8, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ece-10', gatePaper: 'ECE', subject: 'Electromagnetics (EMFT)', year: 2025, questionCount: 5, marks: 6, weightagePercentage: 6, priority: 'LOW', source: 'GATE Analysis' },

  // EEE
  { id: 'w-eee-1', gatePaper: 'EEE', subject: 'Engineering Mathematics', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-eee-2', gatePaper: 'EEE', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-eee-3', gatePaper: 'EEE', subject: 'Power Systems', year: 2025, questionCount: 9, marks: 12, weightagePercentage: 12, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-eee-4', gatePaper: 'EEE', subject: 'Power Electronics', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-eee-5', gatePaper: 'EEE', subject: 'Electrical Machines', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-eee-6', gatePaper: 'EEE', subject: 'Electric Circuits', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-eee-7', gatePaper: 'EEE', subject: 'Control Systems', year: 2025, questionCount: 6, marks: 8, weightagePercentage: 8, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-eee-8', gatePaper: 'EEE', subject: 'Analog & Digital Electronics', year: 2025, questionCount: 6, marks: 7, weightagePercentage: 7, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-eee-9', gatePaper: 'EEE', subject: 'Signals and Systems', year: 2025, questionCount: 5, marks: 6, weightagePercentage: 6, priority: 'LOW', source: 'GATE Analysis' },
  { id: 'w-eee-10', gatePaper: 'EEE', subject: 'Electrical Measurements', year: 2025, questionCount: 4, marks: 5, weightagePercentage: 5, priority: 'LOW', source: 'GATE Analysis' },

  // ME
  { id: 'w-me-1', gatePaper: 'ME', subject: 'Engineering Mathematics', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-me-2', gatePaper: 'ME', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-me-3', gatePaper: 'ME', subject: 'Thermodynamics & Heat Transfer', year: 2025, questionCount: 9, marks: 13, weightagePercentage: 13, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-me-4', gatePaper: 'ME', subject: 'Manufacturing Engineering', year: 2025, questionCount: 9, marks: 12, weightagePercentage: 12, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-me-5', gatePaper: 'ME', subject: 'Fluid Mechanics & Turbo', year: 2025, questionCount: 8, marks: 10, weightagePercentage: 10, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-me-6', gatePaper: 'ME', subject: 'Strength of Materials (SOM)', year: 2025, questionCount: 7, marks: 9, weightagePercentage: 9, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-me-7', gatePaper: 'ME', subject: 'Theory of Machines (TOM)', year: 2025, questionCount: 6, marks: 8, weightagePercentage: 8, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-me-8', gatePaper: 'ME', subject: 'Industrial Engineering', year: 2025, questionCount: 5, marks: 7, weightagePercentage: 7, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-me-9', gatePaper: 'ME', subject: 'Machine Design', year: 2025, questionCount: 5, marks: 6, weightagePercentage: 6, priority: 'LOW', source: 'GATE Analysis' },

  // CE
  { id: 'w-ce-1', gatePaper: 'CE', subject: 'Engineering Mathematics', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-ce-2', gatePaper: 'CE', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-ce-3', gatePaper: 'CE', subject: 'Geotechnical Engineering', year: 2025, questionCount: 10, marks: 14, weightagePercentage: 14, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ce-4', gatePaper: 'CE', subject: 'Environmental Engineering', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ce-5', gatePaper: 'CE', subject: 'Transportation Engineering', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ce-6', gatePaper: 'CE', subject: 'Structural Engineering', year: 2025, questionCount: 7, marks: 9, weightagePercentage: 9, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ce-7', gatePaper: 'CE', subject: 'Fluid Mechanics & Hydraulics', year: 2025, questionCount: 6, marks: 8, weightagePercentage: 8, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ce-8', gatePaper: 'CE', subject: 'Surveying', year: 2025, questionCount: 5, marks: 6, weightagePercentage: 6, priority: 'LOW', source: 'GATE Analysis' },
  { id: 'w-ce-9', gatePaper: 'CE', subject: 'Hydrology & Irrigation', year: 2025, questionCount: 4, marks: 5, weightagePercentage: 5, priority: 'LOW', source: 'GATE Analysis' },

  // CSE
  { id: 'w-cse-1', gatePaper: 'CSE', subject: 'Engineering Mathematics & Discrete Math', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-cse-2', gatePaper: 'CSE', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-cse-3', gatePaper: 'CSE', subject: 'Data Structures & Algorithms', year: 2025, questionCount: 9, marks: 13, weightagePercentage: 13, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-cse-4', gatePaper: 'CSE', subject: 'Computer Networks', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-cse-5', gatePaper: 'CSE', subject: 'Operating Systems', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-cse-6', gatePaper: 'CSE', subject: 'Database Management Systems (DBMS)', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-cse-7', gatePaper: 'CSE', subject: 'Theory of Computation & Compilers', year: 2025, questionCount: 7, marks: 9, weightagePercentage: 9, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-cse-8', gatePaper: 'CSE', subject: 'Computer Organization & Architecture', year: 2025, questionCount: 6, marks: 9, weightagePercentage: 9, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-cse-9', gatePaper: 'CSE', subject: 'Digital Logic', year: 2025, questionCount: 5, marks: 8, weightagePercentage: 8, priority: 'LOW', source: 'GATE Analysis' },

  // AIDS (Data Science & AI)
  { id: 'w-aids-1', gatePaper: 'AIDS', subject: 'Linear Algebra & Calculus', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-aids-2', gatePaper: 'AIDS', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-aids-3', gatePaper: 'AIDS', subject: 'Probability & Statistics', year: 2025, questionCount: 9, marks: 13, weightagePercentage: 13, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-aids-4', gatePaper: 'AIDS', subject: 'Machine Learning', year: 2025, questionCount: 9, marks: 14, weightagePercentage: 14, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-aids-5', gatePaper: 'AIDS', subject: 'Artificial Intelligence & Neural Networks', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-aids-6', gatePaper: 'AIDS', subject: 'Data Structures & Python Programming', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-aids-7', gatePaper: 'AIDS', subject: 'Database Systems & Data Warehousing', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-aids-8', gatePaper: 'AIDS', subject: 'Optimization Techniques', year: 2025, questionCount: 6, marks: 8, weightagePercentage: 8, priority: 'LOW', source: 'GATE Analysis' },

  // BM (Biomedical Engineering)
  { id: 'w-bm-1', gatePaper: 'BM', subject: 'Engineering Mathematics', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-bm-2', gatePaper: 'BM', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-bm-3', gatePaper: 'BM', subject: 'Biomedical Instrumentation & Sensors', year: 2025, questionCount: 9, marks: 14, weightagePercentage: 14, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-bm-4', gatePaper: 'BM', subject: 'Medical Imaging Systems (MRI, CT, Ultrasound)', year: 2025, questionCount: 8, marks: 12, weightagePercentage: 12, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-bm-5', gatePaper: 'BM', subject: 'Biomedical Signal Processing', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-bm-6', gatePaper: 'BM', subject: 'Anatomy & Physiology for Engineers', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-bm-7', gatePaper: 'BM', subject: 'Biomechanics & Biomaterials', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-bm-8', gatePaper: 'BM', subject: 'Analog & Digital Electronics in Healthcare', year: 2025, questionCount: 6, marks: 8, weightagePercentage: 8, priority: 'LOW', source: 'GATE Analysis' },

  // RO (Robotics & Automation)
  { id: 'w-ro-1', gatePaper: 'RO', subject: 'Engineering Mathematics', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-ro-2', gatePaper: 'RO', subject: 'General Aptitude', year: 2025, questionCount: 10, marks: 15, weightagePercentage: 15, priority: 'HIGH', source: 'GATE Official Syllabus' },
  { id: 'w-ro-3', gatePaper: 'RO', subject: 'Robot Kinematics & Dynamics', year: 2025, questionCount: 9, marks: 14, weightagePercentage: 14, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ro-4', gatePaper: 'RO', subject: 'Control Systems & Actuators', year: 2025, questionCount: 8, marks: 12, weightagePercentage: 12, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ro-5', gatePaper: 'RO', subject: 'Robotic Vision & Sensors', year: 2025, questionCount: 8, marks: 11, weightagePercentage: 11, priority: 'HIGH', source: 'GATE Analysis' },
  { id: 'w-ro-6', gatePaper: 'RO', subject: 'Microcontrollers & Embedded Robotics', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ro-7', gatePaper: 'RO', subject: 'Industrial Automation (PLC / SCADA)', year: 2025, questionCount: 7, marks: 10, weightagePercentage: 10, priority: 'MEDIUM', source: 'GATE Analysis' },
  { id: 'w-ro-8', gatePaper: 'RO', subject: 'ROS & AI in Mobile Robotics', year: 2025, questionCount: 6, marks: 8, weightagePercentage: 8, priority: 'LOW', source: 'GATE Analysis' }
];

// Initial Sample GATE Resources
const INITIAL_RESOURCES: GateResource[] = [
  {
    id: 'res-ece-2024-pyq',
    title: 'GATE 2024 ECE Official Question Paper & Detailed Solutions',
    description: 'Complete official question paper with section-wise detailed step-by-step solutions for GATE Electronics & Communication.',
    branch: 'ECE',
    gatePaper: 'ECE',
    subject: 'All Subjects',
    topic: 'Full Length PYQ 2024',
    resourceType: 'PYQ_PAPER',
    year: 2024,
    difficulty: 'HARD',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'GATE_2024_ECE_Official_PYQ.pdf',
    fileSize: 2458900,
    fileType: 'application/pdf',
    uploadedBy: 'fac-ece-1',
    uploadedByName: 'Dr. K. Ramanathan',
    uploadedByRole: 'Faculty',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30,
    status: 'PUBLISHED',
    publishedAt: Date.now() - 86400000 * 30,
    tags: ['GATE2024', 'PYQ', 'ECE', 'OfficialPaper'],
    version: 1,
    downloadCount: 142,
    viewCount: 380,
    authorName: 'IIT IISc GATE Authority',
    copyrightNotes: 'Academic Archive'
  },
  {
    id: 'res-ece-signals-formula',
    title: 'Signals & Systems Master Formula & Properties Cheat Sheet',
    description: 'Comprehensive formula sheet covering Fourier Series, Fourier Transform, Laplace, Z-Transform, and LTI System properties.',
    branch: 'ECE',
    gatePaper: 'ECE',
    subject: 'Signals and Systems',
    topic: 'Transforms & LTI Systems',
    resourceType: 'FORMULA_SHEET',
    year: 2025,
    difficulty: 'MEDIUM',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'ECE_Signals_Systems_Formula_Sheet.pdf',
    fileSize: 1120400,
    fileType: 'application/pdf',
    uploadedBy: 'fac-ece-1',
    uploadedByName: 'Dr. K. Ramanathan',
    uploadedByRole: 'Faculty',
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 15,
    status: 'PUBLISHED',
    publishedAt: Date.now() - 86400000 * 15,
    tags: ['FormulaSheet', 'Signals', 'Laplace', 'Fourier'],
    version: 1,
    downloadCount: 215,
    viewCount: 520,
    authorName: 'ECE Department',
    copyrightNotes: 'Internal Academic Material'
  },
  {
    id: 'res-eee-power-systems-notes',
    title: 'Power Systems Load Flow Analysis & Stability Notes',
    description: 'Complete subject notes on Gauss-Seidel, Newton-Raphson, Transient Stability, and Equal Area Criterion.',
    branch: 'EEE',
    gatePaper: 'EEE',
    subject: 'Power Systems',
    topic: 'Load Flow & Stability',
    resourceType: 'STUDY_NOTES',
    year: 2025,
    difficulty: 'HARD',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'EEE_Power_Systems_Load_Flow_Notes.pdf',
    fileSize: 3450000,
    fileType: 'application/pdf',
    uploadedBy: 'fac-eee-1',
    uploadedByName: 'Prof. S. Venkatesh',
    uploadedByRole: 'Faculty',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 10,
    status: 'PUBLISHED',
    publishedAt: Date.now() - 86400000 * 10,
    tags: ['PowerSystems', 'EEE', 'LoadFlow', 'GATE2025'],
    version: 1,
    downloadCount: 188,
    viewCount: 410,
    authorName: 'EEE Department'
  },
  {
    id: 'res-me-thermo-formula',
    title: 'Thermodynamics & Power Cycles Formula Cheat Sheet',
    description: 'Essential equations for Otto, Diesel, Dual, Brayton, Rankine cycles, and laws of thermodynamics.',
    branch: 'ME',
    gatePaper: 'ME',
    subject: 'Thermodynamics & Heat Transfer',
    topic: 'Power Cycles & First/Second Law',
    resourceType: 'FORMULA_SHEET',
    year: 2025,
    difficulty: 'MEDIUM',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'ME_Thermodynamics_Formula_Sheet.pdf',
    fileSize: 980000,
    fileType: 'application/pdf',
    uploadedBy: 'fac-me-1',
    uploadedByName: 'Dr. M. Sundaram',
    uploadedByRole: 'Faculty',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 8,
    status: 'PUBLISHED',
    publishedAt: Date.now() - 86400000 * 8,
    tags: ['Mechanical', 'Thermodynamics', 'FormulaSheet'],
    version: 1,
    downloadCount: 165,
    viewCount: 390
  },
  {
    id: 'res-ce-geotech-pyq',
    title: 'Geotechnical Engineering 10-Year Topic-Wise PYQs with Solutions',
    description: 'Compilation of soil mechanics, foundation engineering, earth pressure, and slope stability GATE questions (2015-2024).',
    branch: 'CE',
    gatePaper: 'CE',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Mechanics & Foundations',
    resourceType: 'PREVIOUS_YEAR_QUESTIONS',
    year: 2024,
    difficulty: 'HARD',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'CE_Geotechnical_10Yr_PYQ_Solutions.pdf',
    fileSize: 4200000,
    fileType: 'application/pdf',
    uploadedBy: 'fac-ce-1',
    uploadedByName: 'Dr. R. Kavitha',
    uploadedByRole: 'Faculty',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
    status: 'PUBLISHED',
    publishedAt: Date.now() - 86400000 * 5,
    tags: ['Civil', 'Geotechnical', 'SoilMechanics', 'PYQ'],
    version: 1,
    downloadCount: 204,
    viewCount: 460
  }
];

// Initial Question Bank Data
const INITIAL_QUESTIONS: GateQuestion[] = [
  {
    id: 'q-ece-1',
    gatePaper: 'ECE',
    subject: 'Signals and Systems',
    topic: 'Fourier Transform',
    subtopic: 'Properties of Fourier Transform',
    year: 2023,
    difficulty: 'MEDIUM',
    questionType: 'MCQ',
    question: 'The Fourier transform of x(t) = e^(-a t) u(t) for a > 0 is given by:',
    options: [
      { key: 'A', text: '1 / (a + jω)' },
      { key: 'B', text: '1 / (a - jω)' },
      { key: 'C', text: 'a / (a^2 + ω^2)' },
      { key: 'D', text: 'ω / (a^2 + ω^2)' }
    ],
    correctAnswer: 'A',
    explanation: 'Integrating ∫[0 to ∞] e^(-at) e^(-jωt) dt gives 1 / (a + jω).',
    marks: 1,
    negativeMarks: 0.33,
    source: 'GATE 2023 ECE',
    tags: ['FourierTransform', 'ECE', 'Signals'],
    status: 'PUBLISHED',
    createdBy: 'fac-ece-1',
    createdByName: 'Dr. K. Ramanathan',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 20
  },
  {
    id: 'q-ece-2',
    gatePaper: 'ECE',
    subject: 'Networks & Circuit Theory',
    topic: 'Network Theorems',
    subtopic: 'Maximum Power Transfer',
    year: 2022,
    difficulty: 'EASY',
    questionType: 'MCQ',
    question: 'For maximum power transfer from an AC source with source impedance Zs = R + jX to a load ZL = RL + jXL, the load impedance should be:',
    options: [
      { key: 'A', text: 'RL = R, XL = X' },
      { key: 'B', text: 'RL = R, XL = -X' },
      { key: 'C', text: 'RL = √(R^2 + X^2), XL = 0' },
      { key: 'D', text: 'RL = R / 2, XL = -X / 2' }
    ],
    correctAnswer: 'B',
    explanation: 'Maximum power transfer occurs when ZL is the complex conjugate of Zs, i.e., ZL = Zs* = R - jX.',
    marks: 1,
    negativeMarks: 0.33,
    source: 'GATE 2022 ECE',
    tags: ['Networks', 'PowerTransfer', 'Circuits'],
    status: 'PUBLISHED',
    createdBy: 'fac-ece-1',
    createdByName: 'Dr. K. Ramanathan',
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 20
  },
  {
    id: 'q-eee-1',
    gatePaper: 'EEE',
    subject: 'Power Systems',
    topic: 'Transmission Lines',
    subtopic: 'Surge Impedance',
    year: 2024,
    difficulty: 'MEDIUM',
    questionType: 'NAT',
    question: 'A 400 kV, 3-phase lossless transmission line has an inductance L = 1.0 mH/km and capacitance C = 0.01 µF/km. Calculate the surge impedance loading (SIL) of the line in MW. (Round off to nearest integer)',
    correctAnswer: '506',
    explanation: 'Surge Impedance Zc = √(L/C) = √(10^-3 / 10^-8) = √100000 = 316.22 Ω. SIL = V^2 / Zc = 400^2 / 316.22 = 160000 / 316.22 ≈ 506 MW.',
    marks: 2,
    negativeMarks: 0,
    source: 'GATE 2024 EEE',
    tags: ['PowerSystems', 'EEE', 'SIL'],
    status: 'PUBLISHED',
    createdBy: 'fac-eee-1',
    createdByName: 'Prof. S. Venkatesh',
    createdAt: Date.now() - 86400000 * 18,
    updatedAt: Date.now() - 86400000 * 18
  },
  {
    id: 'q-me-1',
    gatePaper: 'ME',
    subject: 'Thermodynamics & Heat Transfer',
    topic: 'Carnot Engine',
    year: 2023,
    difficulty: 'EASY',
    questionType: 'MCQ',
    question: 'A Carnot heat engine operates between source temperature T1 = 800 K and sink temperature T2 = 400 K. The efficiency of the engine is:',
    options: [
      { key: 'A', text: '25%' },
      { key: 'B', text: '50%' },
      { key: 'C', text: '75%' },
      { key: 'D', text: '100%' }
    ],
    correctAnswer: 'B',
    explanation: 'Efficiency η = 1 - (T2/T1) = 1 - (400/800) = 0.5 = 50%.',
    marks: 1,
    negativeMarks: 0.33,
    source: 'GATE 2023 ME',
    tags: ['Thermodynamics', 'Carnot', 'Mechanical'],
    status: 'PUBLISHED',
    createdBy: 'fac-me-1',
    createdByName: 'Dr. M. Sundaram',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 12
  },
  {
    id: 'q-ce-1',
    gatePaper: 'CE',
    subject: 'Geotechnical Engineering',
    topic: 'Soil Mechanics',
    subtopic: 'Void Ratio & Porosity',
    year: 2024,
    difficulty: 'EASY',
    questionType: 'NAT',
    question: 'A soil sample has a void ratio e = 0.50. Calculate the porosity (n) in percentage. (Round off to 1 decimal place)',
    correctAnswer: '33.3',
    explanation: 'Porosity n = e / (1 + e) = 0.50 / 1.50 = 0.3333 = 33.3%.',
    marks: 1,
    negativeMarks: 0,
    source: 'GATE 2024 CE',
    tags: ['Civil', 'SoilMechanics', 'Porosity'],
    status: 'PUBLISHED',
    createdBy: 'fac-ce-1',
    createdByName: 'Dr. R. Kavitha',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 10
  }
];

// Initial Mock Test Data
const INITIAL_MOCK_TESTS: GateMockTest[] = [
  {
    id: 'mock-ece-full-1',
    title: 'GATE ECE 2025 All-India Grand Mock Test 1',
    description: 'Full syllabus mock test designed strictly according to latest IISc GATE ECE exam pattern.',
    gatePaper: 'ECE',
    subjects: ['Signals and Systems', 'Networks & Circuit Theory', 'Control Systems', 'Digital Circuits'],
    topics: ['Full Syllabus'],
    totalQuestions: 5,
    durationMinutes: 45,
    totalMarks: 7,
    negativeMarkingEnabled: true,
    difficulty: 'MEDIUM',
    instructions: '1. Test duration is 45 minutes.\n2. Standard GATE negative marking applies (1/3 for 1-mark MCQ, 2/3 for 2-mark MCQ).\n3. NAT questions have zero negative marking.',
    questions: INITIAL_QUESTIONS.filter(q => q.gatePaper === 'ECE'),
    status: 'PUBLISHED',
    createdBy: 'fac-ece-1',
    createdByName: 'Dr. K. Ramanathan',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7,
    attemptCount: 88
  }
];

export class GateService {
  // Helper to load state safely
  private static load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  // Helper to save state
  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  // ==================== RESOURCES & PDF UPLOAD ====================
  public static getResources(filter?: {
    branch?: string;
    gatePaper?: string;
    resourceType?: string;
    status?: ResourceStatus;
    search?: string;
    includeDeleted?: boolean;
  }): GateResource[] {
    let list = this.load<GateResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);

    if (filter) {
      if (!filter.includeDeleted) {
        list = list.filter(r => !r.isDeleted && r.status !== 'DELETED');
      }
      if (filter.branch) {
        list = list.filter(r => r.branch === filter.branch || r.gatePaper === filter.branch);
      }
      if (filter.gatePaper) {
        list = list.filter(r => r.gatePaper === filter.gatePaper);
      }
      if (filter.resourceType && filter.resourceType !== 'ALL') {
        list = list.filter(r => r.resourceType === filter.resourceType);
      }
      if (filter.status) {
        list = list.filter(r => r.status === filter.status);
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(
          r =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.subject.toLowerCase().includes(q) ||
            r.topic.toLowerCase().includes(q) ||
            r.tags.some(t => t.toLowerCase().includes(q))
        );
      }
    }
    return list;
  }

  public static addResource(data: Omit<GateResource, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'downloadCount' | 'viewCount'>): GateResource {
    const list = this.getResources({ includeDeleted: true });
    const settings = this.getSettings();

    // Determine initial status based on user role & settings
    let initialStatus: ResourceStatus = data.status || 'PUBLISHED';
    if (data.uploadedByRole === 'faculty' && settings.requireApprovalForFacultyUploads) {
      initialStatus = 'PENDING_REVIEW';
    }

    const newRes: GateResource = {
      ...data,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: initialStatus,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      downloadCount: 0,
      viewCount: 0,
      isDeleted: false
    };

    list.unshift(newRes);
    this.save(STORAGE_KEYS.RESOURCES, list);

    this.logAudit({
      userId: data.uploadedBy,
      name: data.uploadedByName,
      role: data.uploadedByRole,
      action: 'UPLOAD_RESOURCE',
      resourceId: newRes.id,
      details: `Uploaded resource: "${newRes.title}" (${newRes.resourceType}) for ${newRes.gatePaper}`
    });

    return newRes;
  }

  public static updateResource(id: string, updates: Partial<GateResource>, updatedBy: { id: string; name: string; role: string }): GateResource | null {
    const list = this.getResources({ includeDeleted: true });
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;

    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: Date.now()
    };

    this.save(STORAGE_KEYS.RESOURCES, list);

    this.logAudit({
      userId: updatedBy.id,
      name: updatedBy.name,
      role: updatedBy.role,
      action: 'UPDATE_RESOURCE',
      resourceId: id,
      details: `Updated resource metadata for "${list[idx].title}"`
    });

    return list[idx];
  }

  public static replaceResourceFile(
    id: string,
    fileData: { fileUrl: string; fileName: string; fileSize: number; fileType: string },
    updatedBy: { id: string; name: string; role: string }
  ): GateResource | null {
    const list = this.getResources({ includeDeleted: true });
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return null;

    const currentVersion = list[idx].version || 1;
    list[idx] = {
      ...list[idx],
      fileUrl: fileData.fileUrl,
      fileName: fileData.fileName,
      fileSize: fileData.fileSize,
      fileType: fileData.fileType,
      version: currentVersion + 1,
      updatedAt: Date.now()
    };

    this.save(STORAGE_KEYS.RESOURCES, list);

    this.logAudit({
      userId: updatedBy.id,
      name: updatedBy.name,
      role: updatedBy.role,
      action: 'REPLACE_FILE',
      resourceId: id,
      details: `Replaced file for "${list[idx].title}" -> New Version v${list[idx].version}`
    });

    return list[idx];
  }

  public static updateResourceStatus(
    id: string,
    status: ResourceStatus,
    updatedBy: { id: string; name: string; role: string },
    reviewNote?: string
  ): void {
    const list = this.getResources({ includeDeleted: true });
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return;

    list[idx].status = status;
    list[idx].updatedAt = Date.now();
    if (reviewNote) list[idx].reviewNote = reviewNote;
    if (status === 'PUBLISHED') list[idx].publishedAt = Date.now();

    this.save(STORAGE_KEYS.RESOURCES, list);

    this.logAudit({
      userId: updatedBy.id,
      name: updatedBy.name,
      role: updatedBy.role,
      action: `STATUS_CHANGE_${status}`,
      resourceId: id,
      details: `Changed status of "${list[idx].title}" to ${status}`
    });
  }

  public static softDeleteResource(id: string, deletedBy: { id: string; name: string; role: string }): void {
    const list = this.getResources({ includeDeleted: true });
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return;

    list[idx].isDeleted = true;
    list[idx].status = 'DELETED';
    list[idx].deletedAt = Date.now();
    list[idx].deletedBy = deletedBy.name;

    this.save(STORAGE_KEYS.RESOURCES, list);

    this.logAudit({
      userId: deletedBy.id,
      name: deletedBy.name,
      role: deletedBy.role,
      action: 'SOFT_DELETE_RESOURCE',
      resourceId: id,
      details: `Soft deleted resource "${list[idx].title}"`
    });
  }

  public static restoreResource(id: string, restoredBy: { id: string; name: string; role: string }): void {
    const list = this.getResources({ includeDeleted: true });
    const idx = list.findIndex(r => r.id === id);
    if (idx === -1) return;

    list[idx].isDeleted = false;
    list[idx].status = 'PUBLISHED';
    delete list[idx].deletedAt;
    delete list[idx].deletedBy;

    this.save(STORAGE_KEYS.RESOURCES, list);

    this.logAudit({
      userId: restoredBy.id,
      name: restoredBy.name,
      role: restoredBy.role,
      action: 'RESTORE_RESOURCE',
      resourceId: id,
      details: `Restored resource "${list[idx].title}"`
    });
  }

  public static permanentDeleteResource(id: string, deletedBy: { id: string; name: string; role: string }): void {
    let list = this.getResources({ includeDeleted: true });
    const res = list.find(r => r.id === id);
    list = list.filter(r => r.id !== id);
    this.save(STORAGE_KEYS.RESOURCES, list);

    if (res) {
      this.logAudit({
        userId: deletedBy.id,
        name: deletedBy.name,
        role: deletedBy.role,
        action: 'PERMANENT_DELETE_RESOURCE',
        resourceId: id,
        details: `Permanently deleted resource "${res.title}"`
      });
    }
  }

  public static incrementView(id: string): void {
    const list = this.getResources({ includeDeleted: true });
    const res = list.find(r => r.id === id);
    if (res) {
      res.viewCount = (res.viewCount || 0) + 1;
      this.save(STORAGE_KEYS.RESOURCES, list);
    }
  }

  public static incrementDownload(id: string): void {
    const list = this.getResources({ includeDeleted: true });
    const res = list.find(r => r.id === id);
    if (res) {
      res.downloadCount = (res.downloadCount || 0) + 1;
      this.save(STORAGE_KEYS.RESOURCES, list);
    }
  }

  // ==================== BOOKMARKS ====================
  public static getBookmarks(userId: string): string[] {
    const all = this.load<Record<string, string[]>>(STORAGE_KEYS.BOOKMARKS, {});
    return all[userId] || [];
  }

  public static toggleBookmark(userId: string, resourceId: string): string[] {
    const all = this.load<Record<string, string[]>>(STORAGE_KEYS.BOOKMARKS, {});
    let userBookmarks = all[userId] || [];
    if (userBookmarks.includes(resourceId)) {
      userBookmarks = userBookmarks.filter(b => b !== resourceId);
    } else {
      userBookmarks.push(resourceId);
    }
    all[userId] = userBookmarks;
    this.save(STORAGE_KEYS.BOOKMARKS, all);
    return userBookmarks;
  }

  // ==================== QUESTION BANK ====================
  public static getQuestions(filter?: {
    gatePaper?: string;
    subject?: string;
    difficulty?: string;
    status?: ResourceStatus;
    search?: string;
    includeDeleted?: boolean;
  }): GateQuestion[] {
    let list = this.load<GateQuestion[]>(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);

    if (filter) {
      if (!filter.includeDeleted) {
        list = list.filter(q => !q.isDeleted && q.status !== 'DELETED');
      }
      if (filter.gatePaper) {
        list = list.filter(q => q.gatePaper === filter.gatePaper);
      }
      if (filter.subject) {
        list = list.filter(q => q.subject === filter.subject);
      }
      if (filter.difficulty) {
        list = list.filter(q => q.difficulty === filter.difficulty);
      }
      if (filter.status) {
        list = list.filter(q => q.status === filter.status);
      }
      if (filter.search) {
        const query = filter.search.toLowerCase();
        list = list.filter(
          q =>
            q.question.toLowerCase().includes(query) ||
            q.subject.toLowerCase().includes(query) ||
            q.topic.toLowerCase().includes(query)
        );
      }
    }

    return list;
  }

  public static addQuestion(questionData: Omit<GateQuestion, 'id' | 'createdAt' | 'updatedAt'>): GateQuestion {
    const list = this.getQuestions({ includeDeleted: true });
    const newQ: GateQuestion = {
      ...questionData,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    list.unshift(newQ);
    this.save(STORAGE_KEYS.QUESTIONS, list);

    this.logAudit({
      userId: questionData.createdBy,
      name: questionData.createdByName,
      role: 'faculty',
      action: 'ADD_QUESTION',
      resourceId: newQ.id,
      details: `Added new ${newQ.questionType} question for ${newQ.gatePaper} - ${newQ.subject}`
    });

    return newQ;
  }

  public static softDeleteQuestion(id: string, deletedBy: { id: string; name: string; role: string }): void {
    const list = this.getQuestions({ includeDeleted: true });
    const idx = list.findIndex(q => q.id === id);
    if (idx !== -1) {
      list[idx].isDeleted = true;
      list[idx].status = 'DELETED';
      list[idx].deletedAt = Date.now();
      list[idx].deletedBy = deletedBy.name;
      this.save(STORAGE_KEYS.QUESTIONS, list);
    }
  }

  public static restoreQuestion(id: string, restoredBy: { id: string; name: string; role: string }): void {
    const list = this.getQuestions({ includeDeleted: true });
    const idx = list.findIndex(q => q.id === id);
    if (idx !== -1) {
      list[idx].isDeleted = false;
      list[idx].status = 'PUBLISHED';
      delete list[idx].deletedAt;
      delete list[idx].deletedBy;
      this.save(STORAGE_KEYS.QUESTIONS, list);
    }
  }

  // Parse and validate CSV string for Question Bank import
  public static parseQuestionsCsv(
    csvText: string,
    creator: { id: string; name: string }
  ): {
    validQuestions: Omit<GateQuestion, 'id' | 'createdAt' | 'updatedAt'>[];
    errors: { line: number; message: string; rowData: any }[];
    totalRows: number;
  } {
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) {
      return { validQuestions: [], errors: [{ line: 1, message: 'CSV file is empty or missing headers.', rowData: null }], totalRows: 0 };
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[\"_]/g, ''));
    const validQuestions: Omit<GateQuestion, 'id' | 'createdAt' | 'updatedAt'>[] = [];
    const errors: { line: number; message: string; rowData: any }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const lineNum = i + 1;
      // Simple split preserving quotes
      const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));

      const getVal = (keyNames: string[]): string => {
        for (const kn of keyNames) {
          const idx = headers.findIndex(h => h.includes(kn));
          if (idx !== -1 && values[idx]) return values[idx];
        }
        return '';
      };

      const questionText = getVal(['question']);
      const optionA = getVal(['optiona', 'a']);
      const optionB = getVal(['optionb', 'b']);
      const optionC = getVal(['optionc', 'c']);
      const optionD = getVal(['optiond', 'd']);
      const correctAnswer = getVal(['correctanswer', 'answer', 'correct']);
      const explanation = getVal(['explanation', 'sol', 'solution']) || 'Standard explanation.';
      const branch = (getVal(['branch', 'gatepaper', 'paper']) || 'ECE').toUpperCase() as GatePaper;
      const subject = getVal(['subject']) || 'General Core';
      const topic = getVal(['topic']) || 'Core Concepts';
      const questionType = (getVal(['questiontype', 'type']) || 'MCQ').toUpperCase() as QuestionType;
      const difficulty = (getVal(['difficulty']) || 'MEDIUM').toUpperCase() as GateDifficulty;
      const marks = parseFloat(getVal(['marks'])) || 1;
      const negativeMarks = parseFloat(getVal(['negativemarks'])) || (marks === 2 ? 0.66 : 0.33);

      if (!questionText) {
        errors.push({ line: lineNum, message: 'Missing Question text', rowData: lines[i] });
        continue;
      }

      if (!correctAnswer) {
        errors.push({ line: lineNum, message: 'Missing Correct Answer', rowData: lines[i] });
        continue;
      }

      const options = [
        { key: 'A' as const, text: optionA || 'Option A' },
        { key: 'B' as const, text: optionB || 'Option B' },
        { key: 'C' as const, text: optionC || 'Option C' },
        { key: 'D' as const, text: optionD || 'Option D' }
      ];

      validQuestions.push({
        gatePaper: branch,
        subject,
        topic,
        questionType,
        question: questionText,
        options: questionType === 'NAT' ? undefined : options,
        correctAnswer,
        explanation,
        marks,
        negativeMarks,
        difficulty,
        tags: [branch, subject],
        status: 'PUBLISHED',
        createdBy: creator.id,
        createdByName: creator.name
      });
    }

    return {
      validQuestions,
      errors,
      totalRows: lines.length - 1
    };
  }

  // ==================== MOCK TESTS ====================
  public static getMockTests(gatePaper?: string): GateMockTest[] {
    let list = this.load<GateMockTest[]>(STORAGE_KEYS.MOCK_TESTS, INITIAL_MOCK_TESTS);
    list = list.filter(m => !m.isDeleted && m.status !== 'DELETED');
    if (gatePaper) {
      list = list.filter(m => m.gatePaper === gatePaper);
    }
    return list;
  }

  public static createMockTest(testData: Omit<GateMockTest, 'id' | 'createdAt' | 'updatedAt' | 'attemptCount'>): GateMockTest {
    const list = this.getMockTests();
    const newTest: GateMockTest = {
      ...testData,
      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      attemptCount: 0
    };

    list.unshift(newTest);
    this.save(STORAGE_KEYS.MOCK_TESTS, list);

    this.logAudit({
      userId: testData.createdBy,
      name: testData.createdByName,
      role: 'faculty',
      action: 'CREATE_MOCK_TEST',
      resourceId: newTest.id,
      details: `Created mock test "${newTest.title}" with ${newTest.totalQuestions} questions`
    });

    return newTest;
  }

  // ==================== SUBJECT WEIGHTAGE ====================
  public static getSubjectWeightage(gatePaper?: GatePaper): GateSubjectWeightage[] {
    let list = this.load<GateSubjectWeightage[]>(STORAGE_KEYS.WEIGHTAGE, INITIAL_WEIGHTAGE_DATA);
    if (gatePaper) {
      list = list.filter(w => w.gatePaper === gatePaper);
    }
    return list;
  }

  public static updateSubjectWeightage(items: GateSubjectWeightage[], updatedBy: { id: string; name: string; role: string }): void {
    this.save(STORAGE_KEYS.WEIGHTAGE, items);
    this.logAudit({
      userId: updatedBy.id,
      name: updatedBy.name,
      role: updatedBy.role,
      action: 'UPDATE_WEIGHTAGE',
      resourceId: 'weightage-matrix',
      details: `Updated GATE subject weightage rules`
    });
  }

  // ==================== PERSONALIZED STUDY SCHEDULE ====================
  public static getStudySchedule(studentId: string): GateStudySchedule | null {
    const all = this.load<Record<string, GateStudySchedule>>(STORAGE_KEYS.SCHEDULES, {});
    return all[studentId] || null;
  }

  public static generateStudySchedule(input: {
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
  }): GateStudySchedule {
    const weightages = this.getSubjectWeightage(input.gatePaper);
    const tasks: ScheduleTask[] = [];

    // Auto generate 14-day study plan
    const today = new Date(input.startDate || Date.now());
    const days = 14;

    weightages.forEach((w, idx) => {
      if (idx >= days) return;
      const taskDate = new Date(today);
      taskDate.setDate(today.getDate() + idx);
      const dateStr = taskDate.toISOString().split('T')[0];

      const isWeak = input.weakSubjects.includes(w.subject);
      const hours = isWeak ? Math.min(input.dailyHours, 3) : Math.max(1, Math.round(input.dailyHours * 0.6));

      tasks.push({
        id: `tsk-${idx + 1}`,
        dayOrWeek: `Day ${idx + 1}`,
        dateStr,
        subject: w.subject,
        topic: isWeak ? 'Fundamental Concepts & Weak Topic Mastery' : 'High-Weightage PYQs & Formula Revision',
        taskType: isWeak ? 'STUDY' : 'PYQ',
        durationHours: hours,
        status: 'NOT_STARTED'
      });
    });

    const schedule: GateStudySchedule = {
      ...input,
      id: `sched-${input.studentId}`,
      tasks,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const all = this.load<Record<string, GateStudySchedule>>(STORAGE_KEYS.SCHEDULES, {});
    all[input.studentId] = schedule;
    this.save(STORAGE_KEYS.SCHEDULES, all);

    return schedule;
  }

  public static updateTaskStatus(studentId: string, taskId: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'): void {
    const schedule = this.getStudySchedule(studentId);
    if (!schedule) return;

    const task = schedule.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      schedule.updatedAt = Date.now();
      const all = this.load<Record<string, GateStudySchedule>>(STORAGE_KEYS.SCHEDULES, {});
      all[studentId] = schedule;
      this.save(STORAGE_KEYS.SCHEDULES, all);
    }
  }

  // ==================== STUDENT ATTEMPTS & ANALYTICS ====================
  public static getStudentAttempts(studentId: string): GateStudentAttempt[] {
    const list = this.load<GateStudentAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    return list.filter(a => a.studentId === studentId);
  }

  public static recordStudentAttempt(attemptData: Omit<GateStudentAttempt, 'id' | 'completedAt'>): GateStudentAttempt {
    const list = this.load<GateStudentAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    const newAttempt: GateStudentAttempt = {
      ...attemptData,
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      completedAt: Date.now()
    };
    list.unshift(newAttempt);
    this.save(STORAGE_KEYS.ATTEMPTS, list);
    return newAttempt;
  }

  public static calculateWeakTopics(studentId: string): { topic: string; subject: string; accuracy: number; recommendedResources: GateResource[] }[] {
    const attempts = this.getStudentAttempts(studentId);
    const resources = this.getResources();

    if (attempts.length === 0) {
      return [
        {
          topic: 'Transforms & LTI Systems',
          subject: 'Signals and Systems',
          accuracy: 45,
          recommendedResources: resources.filter(r => r.subject === 'Signals and Systems')
        },
        {
          topic: 'Load Flow Analysis',
          subject: 'Power Systems',
          accuracy: 52,
          recommendedResources: resources.filter(r => r.subject === 'Power Systems')
        }
      ];
    }

    const weakList: { topic: string; subject: string; accuracy: number; recommendedResources: GateResource[] }[] = [];
    attempts.forEach(att => {
      Object.entries(att.subjectBreakdown).forEach(([subj, data]) => {
        if (data.accuracy < 60) {
          weakList.push({
            topic: `${subj} Core Analysis`,
            subject: subj,
            accuracy: Math.round(data.accuracy),
            recommendedResources: resources.filter(r => r.subject.toLowerCase().includes(subj.toLowerCase()))
          });
        }
      });
    });

    return weakList;
  }

  // ==================== SETTINGS & AUDIT LOGS ====================
  public static getSettings(): GateSettings {
    return this.load<GateSettings>(STORAGE_KEYS.SETTINGS, {
      requireApprovalForFacultyUploads: false,
      allowStudentResourceSubmissions: false,
      customResourceTypes: ['Lab Manuals', 'Video Lectures', 'Project Code Repositories']
    });
  }

  public static updateSettings(settings: Partial<GateSettings>, updatedBy: { id: string; name: string; role: string }): GateSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.save(STORAGE_KEYS.SETTINGS, updated);

    this.logAudit({
      userId: updatedBy.id,
      name: updatedBy.name,
      role: updatedBy.role,
      action: 'UPDATE_GATE_SETTINGS',
      resourceId: 'gate-settings',
      details: 'Updated GATE Hub administrative configuration settings'
    });

    return updated;
  }

  public static getAuditLogs(): GateAuditLog[] {
    return this.load<GateAuditLog[]>(STORAGE_KEYS.LOGS, [
      {
        id: 'log-1',
        userId: 'usr-admin-1',
        name: 'Super Admin',
        role: 'super_admin',
        action: 'SYSTEM_INIT',
        module: 'GATE_PREP',
        resourceId: 'gate-hub',
        details: 'GATE Preparation Hub database initialized with ECE, EEE, ME, CE archives.',
        timestamp: Date.now() - 86400000 * 30
      }
    ]);
  }

  private static logAudit(entry: Omit<GateAuditLog, 'id' | 'module' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      module: 'GATE_PREP',
      timestamp: Date.now()
    });
    this.save(STORAGE_KEYS.LOGS, logs);
  }
}
