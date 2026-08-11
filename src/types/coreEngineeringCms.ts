export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type EngineeringBranch = 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'Robotics' | 'ALL';

export interface BaseCmsItem {
  id: string;
  status: ContentStatus;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CmsBranch extends BaseCmsItem {
  code: 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'Robotics';
  name: string;
  description: string;
  iconName: string;
  activeDomainsCount: number;
  featuredSkillCount: number;
}

export interface CmsDomain extends BaseCmsItem {
  branch: EngineeringBranch;
  domainName: string;
  description: string;
  popularTools: string[];
  careerOpportunities: string[];
}

export interface CmsSkill extends BaseCmsItem {
  skillName: string;
  branch: EngineeringBranch;
  domain: string;
  level: 'Foundation' | 'Intermediate' | 'Advanced' | 'Industry Ready' | 'Specialization';
  description: string;
  prerequisites: string[];
  industryRelevance: string;
  relatedTools: string[];
  relatedCareers: string[];
  learningResources: string[];
  projectRecommendations: string[];
}

export interface CmsEmbeddedItem extends BaseCmsItem {
  title: string;
  category: 'Career Role' | 'Microcontroller' | 'Protocol' | 'RTOS' | 'Embedded Linux' | 'Firmware' | 'Automotive' | 'Device Driver' | 'Debugging';
  branch: 'ECE' | 'EEE';
  description: string;
  keyTopics: string[];
  recommendedTools: string[];
  industryUseCases: string;
}

export interface CmsTool extends BaseCmsItem {
  name: string;
  branch: EngineeringBranch;
  domain: string;
  category: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry Level';
  license: 'Open Source / Free' | 'Commercial (Institutional License)' | 'Freemium / Academic';
  licenseNote?: string;
  operatingSystem: string;
  systemRequirements: string;
  description: string;
  useCases: string;
  industryRelevance: string;
  officialWebsite: string;
  officialDocs: string;
  tutorialUrl: string;
  certificationInfo?: string;
  relatedProjects?: string[];
  relatedSkills?: string[];
}

export interface CmsVlsiItem extends BaseCmsItem {
  topic: string;
  category: 'Digital VLSI' | 'Analog VLSI' | 'Mixed Signal' | 'RTL Design' | 'Verification' | 'Physical Design' | 'FPGA' | 'ASIC' | 'Semiconductor';
  description: string;
  recommendedLanguages: string[]; // Verilog, SystemVerilog, VHDL
  recommendedTools: string[]; // Vivado, ModelSim, Cadence
  isCommercialTool?: boolean;
  keyConcepts: string[];
  industryPrerequisites: string[];
}

export interface CmsCareerRole extends BaseCmsItem {
  title: string;
  branch: EngineeringBranch;
  domain: string;
  description: string;
  averageSalary: string;
  jobResponsibilities: string[];
  careerProgression: string[];
  requiredSkills: string[];
  recommendedTools: string[];
  topCompanies: string[];
  qualifications: string;
  industrySectors: string[];
  certificationsNeeded: string[];
  internshipRequirements: string;
}

export interface CmsCareerRoadmap extends BaseCmsItem {
  title: string;
  branch: EngineeringBranch;
  domain: string;
  description: string;
  stages: {
    stageNumber: number;
    stageName: string;
    description: string;
    keySkills: string[];
    recommendedTools: string[];
    milestoneProject: string;
  }[];
}

export interface CmsProject extends BaseCmsItem {
  title: string;
  branch: EngineeringBranch;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry Ready' | 'Research';
  description: string;
  hardwareRequirements: string[];
  softwareRequirements: string[];
  expectedOutcome: string;
  industryRelevance: string;
  researchRelevance?: string;
  learningResources: string[];
  documentationUrl?: string;
}

export interface CmsGateSubject extends BaseCmsItem {
  branch: 'ECE' | 'EEE' | 'ME' | 'CE';
  subjectName: string;
  weightageRange: string;
  importance: 'High' | 'Medium' | 'Low';
  syllabusTopics: string[];
  keyFormulas: string[];
}

export interface CmsGateQuestion extends BaseCmsItem {
  branch: 'ECE' | 'EEE' | 'ME' | 'CE';
  subject: string;
  topic: string;
  year: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed index
  explanation: string;
  marks: number;
  negativeMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface CmsGateMockTest extends BaseCmsItem {
  testTitle: string;
  branch: 'ECE' | 'EEE' | 'ME' | 'CE';
  timeLimitMinutes: number;
  totalMarks: number;
  instructions: string;
  questionIds: string[];
  difficulty: 'Easy' | 'Moderate' | 'Full Standard';
}

export interface CmsGateStudyPlan extends BaseCmsItem {
  planTitle: string;
  branch: 'ECE' | 'EEE' | 'ME' | 'CE';
  planType: 'Daily' | 'Weekly' | 'Monthly' | 'Subject Specific' | 'Revision';
  targetDuration: string;
  milestones: string[];
  studyTips: string[];
}

export interface CmsHigherStudy extends BaseCmsItem {
  title: string;
  category: 'India (M.Tech/MS/PhD)' | 'International (MS/PhD)' | 'Scholarship / Fellowship';
  targetBranch: EngineeringBranch;
  institutions: string[];
  entranceExams: string[];
  eligibility: string;
  fundingAndStipend: string;
  applicationDeadline: string;
  officialPortal: string;
  keySteps: string[];
}

export interface CmsResearchOpportunity extends BaseCmsItem {
  title: string;
  branch: EngineeringBranch;
  domain: string;
  labName: string;
  institution: string;
  professorName?: string;
  opportunityType: 'Research Internship' | 'PhD/MS Thesis Topic' | 'Undergraduate Research';
  description: string;
  keyResearchQuestions: string[];
  conferencesAndJournals: string[];
  applicationDeadline?: string;
  contactInfo: string;
}

export interface CmsInternship extends BaseCmsItem {
  organization: string;
  roleTitle: string;
  branch: EngineeringBranch;
  domain: string;
  eligibility: string;
  requiredSkills: string[];
  requiredTools: string[];
  location: string;
  stipendAndDuration: string;
  deadline: string;
  applicationLink: string;
  description: string;
  internshipType: 'Full-time' | 'Part-time' | 'Virtual / Remote' | 'Industrial Training';
}

export interface CmsCompany extends BaseCmsItem {
  companyName: string;
  industrySector: string;
  targetBranches: EngineeringBranch[];
  domains: string[];
  keyJobRoles: string[];
  requiredSkills: string[];
  recruitmentProcess: string;
  careersPageUrl: string;
  locations: string[];
}

export interface CmsCertification extends BaseCmsItem {
  certName: string;
  provider: string;
  branch: EngineeringBranch;
  domain: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  costInfo: string;
  eligibility: string;
  duration: string;
  officialUrl: string;
  relatedCareers: string[];
}

export interface CmsBlog extends BaseCmsItem {
  title: string;
  author: string;
  branch: EngineeringBranch;
  domain: string;
  category: 'Technical Tutorial' | 'Industry Trends' | 'Research Spotlight' | 'Tool Guide' | 'Interview Prep';
  contentSnippet: string;
  externalUrl?: string;
  officialSource?: string;
  publishedDate: string;
}

export interface CmsLearningResource extends BaseCmsItem {
  title: string;
  branch: EngineeringBranch;
  domain: string;
  resourceType: 'Video Course' | 'Documentation' | 'Book' | 'Interactive Simulator' | 'Practice Platform';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  url: string;
  provider: string;
  skillsCovered: string[];
}

export interface CmsInstallationGuide extends BaseCmsItem {
  softwareName: string;
  version: string;
  operatingSystem: string;
  systemRequirements: string;
  installationSteps: string[];
  officialDownloadUrl: string;
  officialDocsUrl: string;
  troubleshootingNotes: string[];
}

export interface CmsCrossDepartmentMapping extends BaseCmsItem {
  primaryBranch: EngineeringBranch;
  secondaryBranch: EngineeringBranch;
  synergyTitle: string;
  description: string;
  overlappingSkills: string[];
  overlappingTools: string[];
  jointCareerRoles: string[];
  jointProjectIdeas: string[];
  interdisciplinaryResearch: string[];
}

export interface CmsDepartmentComparison extends BaseCmsItem {
  roleA: string;
  branchA: EngineeringBranch;
  roleB: string;
  branchB: EngineeringBranch;
  keyDifference: string;
  salaryComparison: string;
  skillOverlap: string[];
  toolComparison: string[];
  industryDemand: string;
  recommendedPath: string;
}

export interface CmsAuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  module: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'PUBLISH' | 'UNPUBLISH' | 'IMPORT' | 'EXPORT';
  timestamp: string;
  oldValue?: any;
  newValue?: any;
  details?: string;
}

export type CmsCategoryKey =
  | 'branches'
  | 'domains'
  | 'skills'
  | 'embedded'
  | 'tools'
  | 'vlsi'
  | 'careers'
  | 'roadmaps'
  | 'projects'
  | 'gate_subjects'
  | 'gate_questions'
  | 'gate_mock_tests'
  | 'gate_study_plans'
  | 'higher_studies'
  | 'research'
  | 'internships'
  | 'companies'
  | 'certifications'
  | 'blogs'
  | 'learning_resources'
  | 'installation_guides'
  | 'cross_department_mapping'
  | 'department_comparison';
