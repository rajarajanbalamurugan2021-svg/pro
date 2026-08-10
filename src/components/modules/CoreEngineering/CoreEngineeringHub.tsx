import React, { useState, useEffect } from 'react';
import { UserRole } from '../../../types';
import { CoreEngineeringCMS } from './CoreEngineeringCMS';
import { fetchCmsItems, CmsTool } from '../../../services/coreEngineeringService';
import {
  CORE_ENGINEERING_TOOLS,
  CORE_CAREER_ROLES,
  GATE_SYLLABUS_DATA,
  GATE_SAMPLE_QUESTIONS,
  HIGHER_STUDIES_PATHWAYS,
  RESEARCH_OPPORTUNITIES,
  CORE_COMPANIES_DIRECTORY,
  TECHNICAL_INTERVIEW_QA,
  CoreTool,
  CareerRoleDetail,
  GateQuestion,
  HigherStudyPathway,
  ResearchOpportunity,
  CoreCompany,
  TechnicalInterviewQA
} from '../../../data/coreEngineeringData';
import {
  Cpu,
  Target,
  GraduationCap,
  Wrench,
  BookOpen,
  Sparkles,
  Zap,
  Cog,
  Building2,
  Radio,
  Layers,
  Microscope,
  CheckCircle2,
  Award,
  FileText,
  Terminal,
  ExternalLink,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  BarChart3,
  BrainCircuit,
  Compass,
  BookMarked,
  Briefcase,
  Code2,
  ShieldAlert,
  RefreshCw,
  Sliders,
  ChevronRight,
  ArrowRight,
  CheckSquare,
  HelpCircle,
  Lightbulb,
  Share2,
  Clock,
  DollarSign,
  AlertTriangle,
  User,
  Users
} from 'lucide-react';

interface CoreEngineeringHubProps {
  userRole?: UserRole;
  userEmail?: string;
  onNavigateToModule?: (module: string) => void;
}

export const CoreEngineeringHub: React.FC<CoreEngineeringHubProps> = ({
  userRole = 'student',
  userEmail = '',
  onNavigateToModule
}) => {
  // Main Hub Active Tab
  const [activeTab, setActiveTab] = useState<
    'branches' | 'gate' | 'higher_studies' | 'software' | 'careers' | 'interview' | 'dashboard' | 'admin'
  >('branches');

  // Branch Selection State
  const [selectedBranch, setSelectedBranch] = useState<'ECE' | 'EEE' | 'MECH' | 'CIVIL'>('ECE');
  const [selectedRole, setSelectedRole] = useState<CareerRoleDetail>(CORE_CAREER_ROLES[0]);

  // Software Hub Search & Filters
  const [searchSoftware, setSearchSoftware] = useState('');
  const [filterSoftwareBranch, setFilterSoftwareBranch] = useState<string>('ALL');
  const [filterSoftwareLicense, setFilterSoftwareLicense] = useState<string>('ALL');

  // GATE State
  const [gateSelectedBranch, setGateSelectedBranch] = useState<'ECE' | 'EEE'>('ECE');
  const [gateActiveSubTab, setGateActiveSubTab] = useState<'syllabus' | 'pyq' | 'planner'>('syllabus');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showQuestionExplanation, setShowQuestionExplanation] = useState<Record<string, boolean>>({});

  // Study Planner Form
  const [targetGateYear, setTargetGateYear] = useState('2026');
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(15);
  const [currentPrepLevel, setCurrentPrepLevel] = useState('Intermediate');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);

  // Admin Management State
  const [adminToolsList, setAdminToolsList] = useState<CoreTool[]>(CORE_ENGINEERING_TOOLS);
  const [adminQuestionsList, setAdminQuestionsList] = useState<GateQuestion[]>(GATE_SAMPLE_QUESTIONS);
  const [newToolName, setNewToolName] = useState('');
  const [newToolBranch, setNewToolBranch] = useState<'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'ALL'>('ECE');
  const [newToolPurpose, setNewToolPurpose] = useState('');
  const [newToolDocs, setNewToolDocs] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Student Skills Tracking Simulation State
  const [userSkills, setUserSkills] = useState<string[]>([
    'C', 'C++', 'STM32', 'UART', 'SPI', 'Digital Logic', 'LTspice'
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const isAdminOrFaculty = userRole === 'admin' || userRole === 'super_admin' || userRole === 'faculty';

  // Load live content from Firestore on mount
  useEffect(() => {
    async function loadFirestoreTools() {
      try {
        const liveTools = await fetchCmsItems<CmsTool>('tools');
        if (liveTools && liveTools.length > 0) {
          const mappedTools: CoreTool[] = liveTools.map(t => ({
            id: t.id,
            name: t.name,
            branch: t.branch,
            domain: t.domain || 'Core',
            level: t.skillLevel || 'Intermediate',
            license: t.license || 'Open Source / Free',
            operatingSystem: t.operatingSystem || 'Windows / Linux',
            systemRequirements: t.systemRequirements || '8GB RAM',
            purpose: t.description || t.useCases || 'Engineering simulation and design tool.',
            industryRelevance: t.industryRelevance || 'Standard industry tool.',
            officialWebsite: t.officialWebsite || 'https://',
            officialDocs: t.officialDocs || 'https://',
            tutorialUrl: t.tutorialUrl || 'https://',
            exampleProject: t.relatedProjects?.[0] || 'Core Engineering Project'
          }));
          setAdminToolsList(mappedTools);
        }
      } catch (err) {
        console.warn('Using default static tools fallback:', err);
      }
    }
    loadFirestoreTools();
  }, [activeTab]);

  // Handler to compute missing skills
  const getMissingSkillsForRole = (role: CareerRoleDetail) => {
    return role.requiredSkills.filter(s => !userSkills.some(us => us.toLowerCase() === s.toLowerCase()));
  };

  // Handler for GATE study plan generation
  const handleGenerateStudyPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = `
🎯 PERSONALIZED GATE ${gateSelectedBranch} ${targetGateYear} STUDY ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Weekly Dedicated Hours: ${studyHoursPerWeek} Hours/Week
• Current Status: ${currentPrepLevel} Level
• Phase 1 (Weeks 1-6): Foundation & High-Weightage Core Subjects
  - Networks & Signals (ECE) / Machines & Power Systems (EEE) [8 Hrs/wk]
  - Engineering Mathematics & Aptitude [4 Hrs/wk]
  - Revision & Topic Quizzes [3 Hrs/wk]
• Phase 2 (Weeks 7-12): Core Depth & Previous Year Questions (PYQs)
  - Solve last 15 Years GATE PYQs (Target: 80% Accuracy)
  - Weak Area Focus: Control Systems & Digital Logic
• Phase 3 (Final 6 Weeks): Full-Length Mock Tests & Revision Cycles
  - 10 National Level Mock Tests with Error Analysis
  - Formula Sheet Daily Memory Retention
`;
    setGeneratedPlan(plan);
  };

  // Handler to add custom skill
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !userSkills.includes(newSkillInput.trim())) {
      setUserSkills([...userSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  // Handler for Admin adding a new software tool
  const handleAddToolByAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;
    const newTool: CoreTool = {
      id: `tool-custom-${Date.now()}`,
      name: newToolName,
      branch: newToolBranch,
      domain: 'Custom Engineering Domain',
      level: 'Industry Level',
      license: 'Open Source / Free',
      operatingSystem: 'Windows, Linux',
      systemRequirements: '8GB RAM',
      purpose: newToolPurpose || 'Standard Engineering Software Tool',
      industryRelevance: 'Widely applicable across R&D and core production units.',
      officialWebsite: newToolDocs || 'https://www.ieee.org',
      officialDocs: newToolDocs || 'https://www.ieee.org',
      tutorialUrl: 'https://www.youtube.com',
      exampleProject: 'Core Engineering Analysis & Simulation'
    };
    setAdminToolsList([newTool, ...adminToolsList]);
    setNewToolName('');
    setNewToolPurpose('');
    setNewToolDocs('');
    setShowAdminModal(false);
  };

  const filteredTools = adminToolsList.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchSoftware.toLowerCase()) ||
                          t.domain.toLowerCase().includes(searchSoftware.toLowerCase()) ||
                          t.purpose.toLowerCase().includes(searchSoftware.toLowerCase());
    const matchesBranch = filterSoftwareBranch === 'ALL' || t.branch === filterSoftwareBranch || t.branch === 'ALL';
    const matchesLicense = filterSoftwareLicense === 'ALL' ||
                           (filterSoftwareLicense === 'Free' && t.license.includes('Free')) ||
                           (filterSoftwareLicense === 'Commercial' && t.license.includes('Commercial'));
    return matchesSearch && matchesBranch && matchesLicense;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Platform Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5" /> Core Engineering Intelligence Platform
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Master core engineering skills, industry simulation tools, GATE preparation, higher study pathways, and research opportunities tailored specifically for hardware and physical engineering disciplines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
            >
              <Compass className="h-4 w-4" /> My Skill Dashboard
            </button>
            {isAdminOrFaculty && (
              <button
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
              >
                <Sliders className="h-4 w-4" /> Admin Content CMS
              </button>
            )}
          </div>
        </div>

        {/* Primary Tab Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-thin">
          {[
            { id: 'branches', label: 'Core Engineering Hub', icon: Cpu },
            { id: 'gate', label: 'GATE Preparation', icon: Target, badge: 'High Yield' },
            { id: 'higher_studies', label: 'Higher Studies & Research', icon: GraduationCap },
            { id: 'software', label: 'Software & Tools Hub', icon: Wrench, badge: `${adminToolsList.length}` },
            { id: 'careers', label: 'Core Companies & Internships', icon: Briefcase },
            { id: 'interview', label: 'Technical Interview Prep', icon: Code2 },
            { id: 'dashboard', label: 'Personal Career Radar', icon: BarChart3 },
            ...(isAdminOrFaculty ? [{ id: 'admin', label: 'Core Content CMS', icon: Sliders, badge: 'Manage' }] : [])
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <IconComp className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: CORE BRANCHES & DOMAINS */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          
          {/* Branch Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'ECE', title: 'ECE', name: 'Electronics & Comm.', color: 'from-blue-600 to-indigo-600', desc: 'Embedded, VLSI, RF & DSP' },
              { id: 'EEE', title: 'EEE', name: 'Electrical & Electronics', color: 'from-amber-600 to-orange-600', desc: 'Power Systems, EV & Drives' },
              { id: 'MECH', title: 'MECH', name: 'Mechanical Engg.', color: 'from-emerald-600 to-teal-600', desc: 'CAD, CAE, Thermal & Robotics' },
              { id: 'CIVIL', title: 'CIVIL', name: 'Civil Engineering', color: 'from-sky-600 to-blue-700', desc: 'Structural, BIM & Transport' }
            ].map(b => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBranch(b.id as any);
                  const matchingRole = CORE_CAREER_ROLES.find(r => r.branch === b.id);
                  if (matchingRole) setSelectedRole(matchingRole);
                }}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  selectedBranch === b.id
                    ? 'border-blue-500 bg-white dark:bg-slate-900 shadow-lg ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-lg font-black bg-gradient-to-r ${b.color} bg-clip-text text-transparent`}>
                    {b.title}
                  </span>
                  {selectedBranch === b.id && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{b.desc}</p>
              </button>
            ))}
          </div>

          {/* Branch-Specific Core Domains & Career Roles */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  {selectedBranch} Core Domains & Industry Specializations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Explore skill progression matrices, industry tools, and career roadmaps for {selectedBranch}.
                </p>
              </div>

              {/* Role Selection Selector */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {CORE_CAREER_ROLES.filter(r => r.branch === selectedBranch).map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedRole.id === role.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Role Detail Display */}
            {selectedRole && (
              <div className="space-y-8">
                
                {/* Role Overview Box */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {selectedRole.branch} Domain: {selectedRole.domain}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                        {selectedRole.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        Avg Salary: {selectedRole.averageSalary}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {selectedRole.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-blue-100 dark:border-slate-700">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                        Key Industry Recruiters:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.topCompanies.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                        Recommended Industry Software:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.recommendedTools.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-[11px] font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Progression Matrix */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    Skill Progression Matrix (Beginner → Industry Ready)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRole.skillProgression.map((lvl) => (
                      <div key={lvl.levelNumber} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                            {lvl.levelName}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Topics to Master:</span>
                          <ul className="space-y-1">
                            {lvl.topics.map((tp, idx) => (
                              <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{tp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">Recommended Project: </span>
                          <span className="text-slate-600 dark:text-slate-400">{lvl.projectIdea}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Roadmap Timeline */}
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="h-4 w-4 text-blue-600" />
                    Career & Learning Roadmap
                  </h3>

                  <div className="space-y-3">
                    {selectedRole.roadmap.map((step) => (
                      <div key={step.step} className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-sm">
                            {step.step}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">{step.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{step.subtitle}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {step.keySkills.map((k, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                                  {k}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="md:text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Milestone Project</span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{step.milestoneProject}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GATE PREPARATION HUB */}
      {activeTab === 'gate' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[11px] font-black uppercase">
                  Exam Intelligence
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  GATE Preparation Hub (ECE / EEE / ME / CE)
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Access subject weightage, PYQ practice tests, formula cheat sheets, and generate personalized study schedules.
              </p>
            </div>

            {/* Branch Selector for GATE */}
            <div className="flex items-center gap-2">
              {['ECE', 'EEE'].map(b => (
                <button
                  key={b}
                  onClick={() => setGateSelectedBranch(b as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    gateSelectedBranch === b
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  GATE {b}
                </button>
              ))}
            </div>
          </div>

          {/* GATE Sub Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {[
              { id: 'syllabus', label: 'Syllabus & Weightage', icon: BookOpen },
              { id: 'pyq', label: 'Previous Year Questions (PYQs)', icon: HelpCircle },
              { id: 'planner', label: 'Personalized Study Plan Generator', icon: BrainCircuit }
            ].map(sub => {
              const IconComp = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setGateActiveSubTab(sub.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    gateActiveSubTab === sub.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="h-4 w-4" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

          {/* SubTab 1: Syllabus & Weightage */}
          {gateActiveSubTab === 'syllabus' && (
            <div className="space-y-6">
              {GATE_SYLLABUS_DATA.filter(g => g.branch === gateSelectedBranch).map(gData => (
                <div key={gData.branch} className="space-y-4">
                  
                  {/* Subject Weightage Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gData.subjectWeightage.map((sub, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {sub.subject}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            sub.importance === 'High'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            Weightage: {sub.weightageRange}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Key Topics for GATE:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {sub.keyTopics.map((kt, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                                {kt}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SubTab 2: PYQ Practice */}
          {gateActiveSubTab === 'pyq' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  GATE Previous Year Questions Practice ({gateSelectedBranch})
                </h3>

                <div className="space-y-6">
                  {GATE_SAMPLE_QUESTIONS.filter(q => q.branch === gateSelectedBranch).map((q) => {
                    const selectedOpt = userAnswers[q.id];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctAnswer;
                    const showExp = showQuestionExplanation[q.id];

                    return (
                      <div key={q.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-extrabold">
                            GATE {q.year} • {q.subject} ({q.marks} Marks)
                          </span>
                          {isAnswered && (
                            <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                              {isCorrect ? '✓ Correct Answer' : '✗ Incorrect'}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                          {q.question}
                        </p>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle = 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400';
                            if (isAnswered) {
                              if (optIdx === q.correctAnswer) {
                                btnStyle = 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-500 font-bold';
                              } else if (optIdx === selectedOpt) {
                                btnStyle = 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-200 border-red-500';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                                className={`p-3 rounded-xl border text-left text-xs transition ${btnStyle}`}
                              >
                                <span className="font-black mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Toggle */}
                        <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                          <button
                            onClick={() => setShowQuestionExplanation({ ...showQuestionExplanation, [q.id]: !showExp })}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Lightbulb className="h-3.5 w-3.5" />
                            {showExp ? 'Hide Solution & Formula' : 'View Detailed Solution & Formula'}
                          </button>
                        </div>

                        {showExp && (
                          <div className="p-4 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 space-y-2 text-xs">
                            {q.formulaUsed && (
                              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 font-mono font-bold">
                                Key Formula: {q.formulaUsed}
                              </div>
                            )}
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SubTab 3: Study Plan Generator */}
          {gateActiveSubTab === 'planner' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-purple-600" />
                Personalized GATE Study Plan Calculator
              </h3>

              <form onSubmit={handleGenerateStudyPlan} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target GATE Year</label>
                  <select
                    value={targetGateYear}
                    onChange={e => setTargetGateYear(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="2026">GATE 2026</option>
                    <option value="2027">GATE 2027</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Available Hours / Week</label>
                  <input
                    type="number"
                    value={studyHoursPerWeek}
                    onChange={e => setStudyHoursPerWeek(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Preparation Level</label>
                  <select
                    value={currentPrepLevel}
                    onChange={e => setCurrentPrepLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="Beginner">Beginner (Starting Basics)</option>
                    <option value="Intermediate">Intermediate (Covered 40% Syllabus)</option>
                    <option value="Advanced">Advanced (Revision & Mocks)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
                  >
                    Generate Custom GATE Study Plan
                  </button>
                </div>
              </form>

              {generatedPlan && (
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
                  {generatedPlan}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB 3: HIGHER STUDIES & RESEARCH */}
      {activeTab === 'higher_studies' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                Higher Studies & Research Pathways (India & Global)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Discover M.Tech, MS, PhD, scholarships (DAAD/Fulbright), and research internships across top institutions.
              </p>
            </div>

            {/* Pathways Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HIGHER_STUDIES_PATHWAYS.map(p => (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
                      {p.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{p.title}</h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Key Institutions: </span>
                      <span className="text-slate-600 dark:text-slate-400">{p.institutions.join(', ')}</span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Stipend & Funding: </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{p.fundingAndStipend}</span>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">Entrance Exams: </span>
                      <span className="text-slate-600 dark:text-slate-400">{p.entranceExams.join(', ')}</span>
                    </div>
                  </div>

                  <a
                    href={p.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Official Portal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Research Opportunities Section */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Microscope className="h-4 w-4 text-purple-600" />
                Active Research Projects & Laboratory Positions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESEARCH_OPPORTUNITIES.map(r => (
                  <div key={r.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase">
                      {r.branch} • {r.domain}
                    </span>

                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{r.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.labName} ({r.institution})</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{r.description}</p>

                    <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                      Contact: {r.contactInfo}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: ENGINEERING SOFTWARE HUB */}
      {activeTab === 'software' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  Engineering Software & Simulation Tools Center
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Official documentation, system requirements, and installation resources for ECE, EEE, MECH, and CIVIL software.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchSoftware}
                    onChange={e => setSearchSoftware(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <select
                  value={filterSoftwareBranch}
                  onChange={e => setFilterSoftwareBranch(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="ALL">All Branches</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>
            </div>

            {/* Software Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map(tool => (
                <div key={tool.id} className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                        {tool.branch} • {tool.domain}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                        {tool.name}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      tool.license.includes('Free')
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {tool.license}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {tool.purpose}
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div><span className="font-bold">OS:</span> {tool.operatingSystem}</div>
                    <div><span className="font-bold">System Specs:</span> {tool.systemRequirements}</div>
                    <div><span className="font-bold">Sample Project:</span> {tool.exampleProject}</div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                    <a
                      href={tool.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Official Page <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={tool.officialDocs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      Official Docs <FileText className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CORE COMPANIES & INTERNSHIPS */}
      {activeTab === 'careers' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-600" />
              Core Industry Companies & Internship Explorer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CORE_COMPANIES_DIRECTORY.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{c.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {c.companyType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Branches: <span className="font-bold text-slate-800 dark:text-slate-200">{c.branches.join(', ')}</span>
                  </p>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Key Roles Hired:</span>
                    <div className="flex flex-wrap gap-1">
                      {c.rolesHired.map((r, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border text-[11px] text-slate-700 dark:text-slate-300">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={c.officialCareerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-2"
                  >
                    View Official Careers Portal <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TECHNICAL INTERVIEW PREP */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-indigo-600" />
              Core Engineering Technical Interview Preparation
            </h2>

            <div className="space-y-4">
              {TECHNICAL_INTERVIEW_QA.map(qa => (
                <div key={qa.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-indigo-600 uppercase">{qa.branch} • {qa.subject}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold">{qa.difficulty}</span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 dark:text-white">Q: {qa.question}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-emerald-600 block mb-1">Answer:</span>
                    {qa.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PERSONAL CAREER RADAR */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Student Personalized Skill & Career Radar ({selectedBranch})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Skills Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase">My Verified Technical Skills</h3>
                
                <div className="flex flex-wrap gap-1.5">
                  {userSkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add new core skill (e.g. FreeRTOS)"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl border text-xs font-bold bg-white dark:bg-slate-900"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Missing Skills Gap Analysis */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <h3 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Skill Gap for {selectedRole.title}
                </h3>

                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Target Role: <span className="font-bold">{selectedRole.title}</span>
                </p>

                <div className="space-y-1">
                  {getMissingSkillsForRole(selectedRole).map((ms, i) => (
                    <div key={i} className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      • Recommended Next Skill: {ms}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ADMIN CONTENT CMS */}
      {activeTab === 'admin' && isAdminOrFaculty && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-purple-600" />
                  Admin Core Content Management System
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add, update, or remove software tools, GATE questions, and core research topics.
                </p>
              </div>

              <button
                onClick={() => setShowAdminModal(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <Plus className="h-4 w-4" /> Add Software Tool
              </button>
            </div>

            {/* Managed Software Tools List */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-500 uppercase">Published Tools ({adminToolsList.length})</h3>
              <div className="space-y-2">
                {adminToolsList.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>
                      <span className="ml-2 text-slate-500">({t.branch} • {t.domain})</span>
                    </div>

                    <button
                      onClick={() => setAdminToolsList(adminToolsList.filter(item => item.id !== t.id))}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal for adding new tool */}
          {showAdminModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border max-w-md w-full space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Publish New Software Tool</h3>

                <form onSubmit={handleAddToolByAdmin} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Software Name</label>
                    <input
                      type="text"
                      required
                      value={newToolName}
                      onChange={e => setNewToolName(e.target.value)}
                      className="w-full p-2 rounded-xl border text-xs"
                      placeholder="e.g. Renode Emulator"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Branch</label>
                    <select
                      value={newToolBranch}
                      onChange={e => setNewToolBranch(e.target.value as any)}
                      className="w-full p-2 rounded-xl border text-xs"
                    >
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Purpose</label>
                    <textarea
                      value={newToolPurpose}
                      onChange={e => setNewToolPurpose(e.target.value)}
                      className="w-full p-2 rounded-xl border text-xs"
                      placeholder="What is this software used for?"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminModal(false)}
                      className="px-3 py-2 rounded-xl border text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
                    >
                      Save & Publish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: FULL ADMIN CONTENT CMS */}
      {activeTab === 'admin' && (
        <CoreEngineeringCMS
          currentUser={{
            id: userEmail || 'usr-admin-1',
            name: userEmail ? userEmail.split('@')[0] : 'Admin User',
            role: userRole,
            email: userEmail
          }}
          onClose={() => setActiveTab('branches')}
        />
      )}

    </div>
  );
};
