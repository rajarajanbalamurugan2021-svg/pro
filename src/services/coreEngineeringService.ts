import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from '../lib/firebase';
import type {
  BaseCmsItem,
  CmsBranch,
  CmsDomain,
  CmsSkill,
  CmsEmbeddedItem,
  CmsTool,
  CmsVlsiItem,
  CmsCareerRole,
  CmsCareerRoadmap,
  CmsProject,
  CmsGateSubject,
  CmsGateQuestion,
  CmsGateMockTest,
  CmsGateStudyPlan,
  CmsHigherStudy,
  CmsResearchOpportunity,
  CmsInternship,
  CmsCompany,
  CmsCertification,
  CmsBlog,
  CmsLearningResource,
  CmsInstallationGuide,
  CmsAuditLog,
  CmsCategoryKey
} from '../types/coreEngineeringCms';

export type {
  BaseCmsItem,
  CmsBranch,
  CmsDomain,
  CmsSkill,
  CmsEmbeddedItem,
  CmsTool,
  CmsVlsiItem,
  CmsCareerRole,
  CmsCareerRoadmap,
  CmsProject,
  CmsGateSubject,
  CmsGateQuestion,
  CmsGateMockTest,
  CmsGateStudyPlan,
  CmsHigherStudy,
  CmsResearchOpportunity,
  CmsInternship,
  CmsCompany,
  CmsCertification,
  CmsBlog,
  CmsLearningResource,
  CmsInstallationGuide,
  CmsAuditLog,
  CmsCategoryKey
};
import {
  CORE_ENGINEERING_TOOLS,
  CORE_CAREER_ROLES,
  GATE_SAMPLE_QUESTIONS,
  GATE_SYLLABUS_DATA,
  HIGHER_STUDIES_PATHWAYS,
  RESEARCH_OPPORTUNITIES,
  CORE_COMPANIES_DIRECTORY,
  CROSS_DEPARTMENT_MAPPINGS,
  DEPARTMENT_COMPARISONS
} from '../data/coreEngineeringData';

const COLLECTION_PREFIX = 'core_cms_';

// Audit logging helper
export async function logCmsAction(
  userId: string,
  userName: string,
  role: string,
  module: CmsCategoryKey,
  recordId: string,
  action: CmsAuditLog['action'],
  oldValue?: any,
  newValue?: any,
  details?: string
): Promise<void> {
  try {
    const logData: Omit<CmsAuditLog, 'id'> = {
      userId,
      userName,
      role,
      module,
      recordId,
      action,
      timestamp: new Date().toISOString(),
      oldValue: oldValue || null,
      newValue: newValue || null,
      details: details || `Performed ${action} on ${module} (${recordId})`
    };
    await addDoc(collection(db, 'core_audit_logs'), logData);
  } catch (err) {
    console.warn('Could not store audit log in Firestore:', err);
  }
}

// Fetch all items from a collection with fallback
export async function fetchCmsItems<T extends BaseCmsItem>(
  category: CmsCategoryKey,
  includeDeleted = false
): Promise<T[]> {
  const collectionName = `${COLLECTION_PREFIX}${category}`;
  try {
    const q = query(collection(db, collectionName));
    const snap = await getDocs(q);
    
    if (snap.empty) {
      // Seed fallback for first run if empty
      const initialSeed = getInitialSeedForCategory(category);
      return initialSeed as unknown as T[];
    }

    const items: T[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as T;
      const itemWithId = { ...data, id: docSnap.id };
      if (includeDeleted || !itemWithId.isDeleted) {
        items.push(itemWithId);
      }
    });

    return items;
  } catch (err) {
    console.warn(`Firestore read failed for ${category}, falling back to initial data:`, err);
    return getInitialSeedForCategory(category) as unknown as T[];
  }
}

// Create or update item in Firestore
export async function saveCmsItem<T extends BaseCmsItem>(
  category: CmsCategoryKey,
  item: Partial<T> & { id?: string },
  currentUser: { id: string; name: string; role: string }
): Promise<T> {
  const collectionName = `${COLLECTION_PREFIX}${category}`;
  const now = new Date().toISOString();
  const isEdit = !!item.id;
  const docId = item.id || `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const finalItem: BaseCmsItem = {
    ...item,
    id: docId,
    status: item.status || 'PUBLISHED',
    isDeleted: item.isDeleted || false,
    createdAt: item.createdAt || now,
    createdBy: item.createdBy || currentUser.name,
    updatedAt: now,
    updatedBy: currentUser.name
  } as BaseCmsItem;

  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, finalItem, { merge: true });

    await logCmsAction(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      category,
      docId,
      isEdit ? 'UPDATE' : 'CREATE',
      undefined,
      finalItem,
      `${isEdit ? 'Updated' : 'Created'} record in ${category}`
    );
  } catch (err) {
    console.warn(`Firestore write failed for ${category}:`, err);
  }

  return finalItem as unknown as T;
}

// Soft delete item
export async function softDeleteCmsItem(
  category: CmsCategoryKey,
  itemId: string,
  currentUser: { id: string; name: string; role: string }
): Promise<void> {
  const collectionName = `${COLLECTION_PREFIX}${category}`;
  const now = new Date().toISOString();

  try {
    const docRef = doc(db, collectionName, itemId);
    await updateDoc(docRef, {
      isDeleted: true,
      status: 'DELETED',
      deletedAt: now,
      deletedBy: currentUser.name,
      updatedAt: now,
      updatedBy: currentUser.name
    });

    await logCmsAction(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      category,
      itemId,
      'DELETE',
      undefined,
      undefined,
      `Soft-deleted item ${itemId}`
    );
  } catch (err) {
    console.warn(`Soft delete failed for ${category}/${itemId}:`, err);
  }
}

// Restore soft deleted item
export async function restoreCmsItem(
  category: CmsCategoryKey,
  itemId: string,
  currentUser: { id: string; name: string; role: string }
): Promise<void> {
  const collectionName = `${COLLECTION_PREFIX}${category}`;
  const now = new Date().toISOString();

  try {
    const docRef = doc(db, collectionName, itemId);
    await updateDoc(docRef, {
      isDeleted: false,
      status: 'PUBLISHED',
      deletedAt: null,
      deletedBy: null,
      updatedAt: now,
      updatedBy: currentUser.name
    });

    await logCmsAction(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      category,
      itemId,
      'RESTORE',
      undefined,
      undefined,
      `Restored item ${itemId}`
    );
  } catch (err) {
    console.warn(`Restore failed for ${category}/${itemId}:`, err);
  }
}

// Toggle Publish / Unpublish
export async function togglePublishCmsItem(
  category: CmsCategoryKey,
  itemId: string,
  publish: boolean,
  currentUser: { id: string; name: string; role: string }
): Promise<void> {
  const collectionName = `${COLLECTION_PREFIX}${category}`;
  const now = new Date().toISOString();
  const newStatus = publish ? 'PUBLISHED' : 'DRAFT';

  try {
    const docRef = doc(db, collectionName, itemId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: now,
      updatedBy: currentUser.name
    });

    await logCmsAction(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      category,
      itemId,
      publish ? 'PUBLISH' : 'UNPUBLISH',
      undefined,
      { status: newStatus },
      `${publish ? 'Published' : 'Unpublished'} item ${itemId}`
    );
  } catch (err) {
    console.warn(`Publish toggle failed for ${category}/${itemId}:`, err);
  }
}

// Bulk Action Handler
export async function performBulkCmsAction(
  category: CmsCategoryKey,
  itemIds: string[],
  action: 'publish' | 'unpublish' | 'delete' | 'restore',
  currentUser: { id: string; name: string; role: string }
): Promise<void> {
  for (const id of itemIds) {
    if (action === 'publish') {
      await togglePublishCmsItem(category, id, true, currentUser);
    } else if (action === 'unpublish') {
      await togglePublishCmsItem(category, id, false, currentUser);
    } else if (action === 'delete') {
      await softDeleteCmsItem(category, id, currentUser);
    } else if (action === 'restore') {
      await restoreCmsItem(category, id, currentUser);
    }
  }
}

// Seed entire Firestore with initial data
export async function seedAllCoreCmsDataToFirestore(currentUser: { id: string; name: string; role: string }): Promise<number> {
  let totalSeeded = 0;
  const categories: CmsCategoryKey[] = [
    'branches',
    'domains',
    'skills',
    'embedded',
    'tools',
    'vlsi',
    'careers',
    'roadmaps',
    'projects',
    'gate_subjects',
    'gate_questions',
    'gate_mock_tests',
    'gate_study_plans',
    'higher_studies',
    'research',
    'internships',
    'companies',
    'certifications',
    'blogs',
    'learning_resources',
    'installation_guides',
    'cross_department_mapping',
    'department_comparison'
  ];

  for (const cat of categories) {
    const seeds = getInitialSeedForCategory(cat);
    for (const item of seeds) {
      await saveCmsItem(cat, item, currentUser);
      totalSeeded++;
    }
  }

  await logCmsAction(
    currentUser.id,
    currentUser.name,
    currentUser.role,
    'branches',
    'seed_all',
    'IMPORT',
    undefined,
    { seededCount: totalSeeded },
    `Seeded ${totalSeeded} default Core Engineering records into Firestore`
  );

  return totalSeeded;
}

// Helper: Generate fallback seed data for each entity category
export function getInitialSeedForCategory(category: CmsCategoryKey): any[] {
  const now = '2026-08-10T00:00:00.000Z';
  const baseAudit = {
    status: 'PUBLISHED' as const,
    isDeleted: false,
    createdAt: now,
    createdBy: 'System Seed',
    updatedAt: now,
    updatedBy: 'System Seed'
  };

  switch (category) {
    case 'branches':
      return [
        { ...baseAudit, id: 'br-aids', code: 'AI&DS', name: 'Artificial Intelligence & Data Science', description: 'Machine Learning, Deep Learning, Vision Transformers, NLP, MLOps, Big Data, and Predictive Analytics.', iconName: 'Brain', activeDomainsCount: 10, featuredSkillCount: 28 },
        { ...baseAudit, id: 'br-biomed', code: 'Bio Medical', name: 'Biomedical Engineering', description: 'Bio-Instrumentation, Medical Image Processing, DICOM Informatics, Bio-Sensors, and Healthcare Robotics.', iconName: 'Activity', activeDomainsCount: 10, featuredSkillCount: 20 },
        { ...baseAudit, id: 'br-cse', code: 'CSE', name: 'Computer Science & Engineering', description: 'Data Structures, Full Stack Architecture, Distributed Systems, Cloud Native, DevOps, and Cybersecurity.', iconName: 'Code', activeDomainsCount: 12, featuredSkillCount: 30 },
        { ...baseAudit, id: 'br-ece', code: 'ECE', name: 'Electronics & Communication Engineering', description: 'Hardware, VLSI, Embedded Systems, Communication, Signal Processing, Microcontrollers, and Robotics.', iconName: 'Cpu', activeDomainsCount: 10, featuredSkillCount: 25 },
        { ...baseAudit, id: 'br-eee', code: 'EEE', name: 'Electrical & Electronics Engineering', description: 'Power Systems, Power Electronics, Electric Vehicles, High Voltage, Drives, and Smart Grid Tech.', iconName: 'Zap', activeDomainsCount: 10, featuredSkillCount: 22 },
        { ...baseAudit, id: 'br-mech', code: 'MECH', name: 'Mechanical Engineering', description: 'CAD, CAE, Manufacturing, Thermal Systems, Automotive, Aerospace, Robotics, and Fluid Mechanics.', iconName: 'Wrench', activeDomainsCount: 10, featuredSkillCount: 20 },
        { ...baseAudit, id: 'br-civil', code: 'CIVIL', name: 'Civil Engineering', description: 'Structural Analysis, BIM, Transportation, Geotechnical, GIS, Environmental, and Construction Management.', iconName: 'Building2', activeDomainsCount: 10, featuredSkillCount: 18 },
        { ...baseAudit, id: 'br-robotics', code: 'Robotics', name: 'Robotics & Automation Engineering', description: 'Autonomous Mobile Robots (AMRs), ROS 2, SLAM Navigation, Manipulators, Mechatronics, Gazebo Physics, and PLC Industrial Control.', iconName: 'Bot', activeDomainsCount: 10, featuredSkillCount: 24 }
      ];

    case 'domains':
      return [
        { ...baseAudit, id: 'dom-embedded', branch: 'ECE', domainName: 'Embedded Systems', description: 'Microcontrollers, C/C++, RTOS, Firmware, Protocols (SPI, I2C, CAN), Device Drivers.', popularTools: ['Keil uVision', 'STM32CubeIDE', 'FreeRTOS', 'MPLAB X'], careerOpportunities: ['Embedded Software Engineer', 'Firmware Developer', 'Automotive Systems Engineer'] },
        { ...baseAudit, id: 'dom-vlsi', branch: 'ECE', domainName: 'VLSI & Silicon Design', description: 'Digital & Analog IC Design, SystemVerilog, UVM Verification, RTL, Physical Design, FPGA synthesis.', popularTools: ['Xilinx Vivado', 'Cadence Virtuoso', 'ModelSim', 'OpenLane'], careerOpportunities: ['RTL Design Engineer', 'Verification Engineer', 'Physical Design Engineer'] },
        { ...baseAudit, id: 'dom-power-elec', branch: 'EEE', domainName: 'Power Electronics & EV', description: 'Inverters, Converters, Electric Vehicle Drives, Motor Controllers, Battery Management Systems.', popularTools: ['MATLAB/Simulink', 'LTspice', 'PSpice', 'PLECS'], careerOpportunities: ['Power Electronics Engineer', 'EV Powertrain Engineer', 'Drives Specialist'] },
        { ...baseAudit, id: 'dom-power-sys', branch: 'EEE', domainName: 'Power Systems & Smart Grid', description: 'Grid Stability, SCADA, Protection Relays, High Voltage, Renewable Generation.', popularTools: ['ETAP', 'PowerWorld', 'PSCAD'], careerOpportunities: ['Grid Operations Engineer', 'Protection Engineer', 'Renewables Specialist'] },
        { ...baseAudit, id: 'dom-cad-cae', branch: 'MECH', domainName: 'CAD & CAE Engineering', description: 'Product Design, Finite Element Analysis (FEA), Structural & Thermal Simulation.', popularTools: ['SolidWorks', 'ANSYS Workbench', 'CATIA V5', 'Fusion 360'], careerOpportunities: ['CAD Design Engineer', 'FEA Simulation Analyst', 'Product Development Engineer'] },
        { ...baseAudit, id: 'dom-structural', branch: 'CIVIL', domainName: 'Structural Engineering & BIM', description: 'High-rise structural design, Building Information Modeling (BIM), Earthquake resistance.', popularTools: ['AutoCAD Civil 3D', 'Revit', 'ETABS', 'STAAD.Pro'], careerOpportunities: ['Structural Design Engineer', 'BIM Coordinator', 'Bridge Engineer'] }
      ];

    case 'skills':
      return [
        { ...baseAudit, id: 'sk-c-prog', skillName: 'Embedded C / C++', branch: 'ECE', domain: 'Embedded Systems', level: 'Industry Ready', description: 'Memory-safe C programming for hardware registers, interrupt vectors, and low-level firmware.', prerequisites: ['Basic C Syntax', 'Computer Architecture'], industryRelevance: 'Essential for 95%+ of hardware and MCU engineering positions globally.', relatedTools: ['STM32CubeIDE', 'Keil uVision', 'GDB'], relatedCareers: ['Embedded Engineer', 'Firmware Engineer'], learningResources: ['Embedded C Mastery Guide', 'ARM Cortex-M Architecture Docs'], projectRecommendations: ['CAN Bus Battery Telemetry Node', 'Custom Bootloader for STM32'] },
        { ...baseAudit, id: 'sk-systemverilog', skillName: 'SystemVerilog & UVM', branch: 'ECE', domain: 'VLSI & Silicon Design', level: 'Specialization', description: 'Object-oriented hardware verification and assertion-based testing for ASIC/FPGA chips.', prerequisites: ['Verilog HDL', 'Digital Logic Design'], industryRelevance: 'Required by top semiconductor companies like Intel, NVIDIA, Qualcomm, and AMD.', relatedTools: ['ModelSim', 'QuestaSim', 'Vivado'], relatedCareers: ['Verification Engineer', 'RTL Design Engineer'], learningResources: ['Accellera UVM Reference Manual', 'Verification Academy Tutorials'], projectRecommendations: ['UVM Verification Environment for AXI Bus Protocol'] },
        { ...baseAudit, id: 'sk-ansys-fea', skillName: 'Finite Element Analysis (FEA)', branch: 'MECH', domain: 'CAD & CAE Engineering', level: 'Advanced', description: 'Stress, strain, fatigue, and vibration analysis on mechanical assemblies using finite elements.', prerequisites: ['Mechanics of Materials', 'Numerical Methods'], industryRelevance: 'Crucial for aerospace, automotive, and heavy equipment structural validation.', relatedTools: ['ANSYS Mechanical', 'Abaqus', 'HyperMesh'], relatedCareers: ['CAE Analyst', 'Structural Simulation Specialist'], learningResources: ['ANSYS Official Innovation Courses', 'NPTEL FEA Course'], projectRecommendations: ['Crash Box Energy Absorption Simulation'] }
      ];

    case 'embedded':
      return [
        { ...baseAudit, id: 'emb-stm32', title: 'STM32 ARM Cortex-M Architecture', category: 'Microcontroller', branch: 'ECE', description: 'Comprehensive guide to STM32F4/F7 NVIC, DMA, RCC, Timers, GPIO, and HAL programming.', keyTopics: ['Cortex-M NVIC', 'Direct Memory Access (DMA)', 'Timer PWM Registers', 'Low Power Modes'], recommendedTools: ['STM32CubeIDE', 'STM32CubeMX', 'ST-Link Utility'], industryUseCases: 'Medical devices, industrial robotics, consumer drones, smart meters.' },
        { ...baseAudit, id: 'emb-freertos', title: 'FreeRTOS Core Concepts', category: 'RTOS', branch: 'ECE', description: 'Real-time operating system kernel mechanisms: task scheduling, queues, semaphores, mutexes, and timers.', keyTopics: ['Preemptive Task Scheduler', 'Mutex vs Counting Semaphore', 'Message Queues', 'Priority Inversion'], recommendedTools: ['FreeRTOS', 'SystemView', 'OpenOCD'], industryUseCases: 'Robotic arm controller, IoT gateway, electric vehicle telemetry unit.' },
        { ...baseAudit, id: 'emb-canbus', title: 'CAN & CAN-FD Bus Protocol', category: 'Protocol', branch: 'ECE', description: 'Differential physical layer signaling, frame ID arbitration, error detection, and CAN transceivers.', keyTopics: ['Bit Dominance', 'Identifier Arbitration', 'CRC & ACK Field', 'ISO 11898 Standard'], recommendedTools: ['Vector CANoe', 'Saleae Logic Analyzer', 'PCAN-View'], industryUseCases: 'Automotive ECU communication, EV battery management system (BMS).' }
      ];

    case 'tools':
      return CORE_ENGINEERING_TOOLS.map((t, idx) => ({
        ...baseAudit,
        id: `tool-${t.id || idx}`,
        name: t.name,
        branch: t.branch,
        domain: t.domain,
        category: t.domain,
        skillLevel: t.level,
        license: t.license,
        licenseNote: t.license.includes('Commercial') ? 'Commercial license or institutional activation required.' : undefined,
        operatingSystem: t.operatingSystem,
        systemRequirements: t.systemRequirements,
        description: t.purpose,
        useCases: t.purpose,
        industryRelevance: t.industryRelevance,
        officialWebsite: t.officialWebsite,
        officialDocs: t.officialDocs,
        tutorialUrl: t.tutorialUrl,
        certificationInfo: 'Official vendor certification available.',
        relatedProjects: [t.exampleProject]
      }));

    case 'vlsi':
      return [
        { ...baseAudit, id: 'vlsi-rtl', topic: 'RTL Design & Synthesis', category: 'RTL Design', description: 'Writing synthesizable Verilog/SystemVerilog HDL code for combinational and sequential logic gates.', recommendedLanguages: ['Verilog', 'SystemVerilog', 'VHDL'], recommendedTools: ['Xilinx Vivado', 'Synopsys Design Compiler'], isCommercialTool: true, keyConcepts: ['Clock Domain Crossing (CDC)', 'Finite State Machines (FSM)', 'Setup & Hold Time'], industryPrerequisites: ['Digital Logic Design', 'Boolean Algebra'] },
        { ...baseAudit, id: 'vlsi-sta', topic: 'Static Timing Analysis (STA)', category: 'Physical Design', description: 'Verifying setup and hold slack constraints across process, voltage, and temperature (PVT) corners.', recommendedLanguages: ['TCL'], recommendedTools: ['Synopsys PrimeTime', 'OpenSTA'], isCommercialTool: true, keyConcepts: ['Clock Jitter & Skew', 'Propagated Delay', 'False Paths & Multi-cycle Paths'], industryPrerequisites: ['CMOS Inverter Characteristics', 'RTL Basics'] }
      ];

    case 'careers':
      return CORE_CAREER_ROLES.map((c, idx) => ({
        ...baseAudit,
        id: `career-${c.id || idx}`,
        title: c.title,
        branch: c.branch,
        domain: c.domain,
        description: c.description,
        averageSalary: c.averageSalary,
        jobResponsibilities: ['Design hardware/software solutions according to specifications', 'Collaborate with cross-functional core engineering teams', 'Perform functional verification and hardware testing'],
        careerProgression: ['Junior Engineer', 'Senior Engineer', 'Lead Engineer', 'Principal Architect'],
        requiredSkills: c.requiredSkills,
        recommendedTools: c.recommendedTools,
        topCompanies: c.topCompanies,
        qualifications: 'B.E. / B.Tech in relevant engineering discipline with 7.0+ CGPA.',
        industrySectors: ['Automotive', 'Semiconductor', 'Energy', 'Aerospace', 'Manufacturing'],
        certificationsNeeded: ['Vendor Technical Certification', 'IEEE Member Specialist'],
        internshipRequirements: 'Hands-on experience with domain tools and hardware prototypes.'
      }));

    case 'roadmaps':
      return [
        {
          ...baseAudit,
          id: 'road-embedded',
          title: 'Embedded Systems & Firmware Engineer Roadmap',
          branch: 'ECE',
          domain: 'Embedded Systems',
          description: 'Step-by-step 8-stage career roadmap from basic electronics to advanced RTOS and Linux device drivers.',
          stages: [
            { stageNumber: 1, stageName: 'C & Microcontroller Fundamentals', description: 'Master C pointers, memory allocation, and 8/32-bit MCU architecture.', keySkills: ['C Programming', 'Digital Electronics'], recommendedTools: ['Proteus', 'Arduino IDE'], milestoneProject: 'Temperature Alert System with LCD' },
            { stageNumber: 2, stageName: 'ARM Cortex-M & Protocols', description: 'Direct register programming for STM32, SPI, I2C, UART, and interrupt handling.', keySkills: ['Embedded C', 'UART', 'SPI', 'I2C'], recommendedTools: ['STM32CubeIDE', 'Logic Analyzer'], milestoneProject: 'Datalogger with SD Card and RTC' },
            { stageNumber: 3, stageName: 'Real-Time Operating Systems (RTOS)', description: 'Task scheduling, queues, semaphores, and memory management on FreeRTOS.', keySkills: ['FreeRTOS', 'Multi-threading', 'Mutexes'], recommendedTools: ['FreeRTOS', 'SystemView'], milestoneProject: 'Multi-sensor Industrial Monitor with RTOS' }
          ]
        }
      ];

    case 'projects':
      return [
        { ...baseAudit, id: 'proj-bms', title: 'Smart Battery Management System (BMS) with CAN Telemetry', branch: 'ECE', domain: 'Embedded Systems', difficulty: 'Industry Ready', description: 'Design an 8-cell Lithium-ion BMS monitoring voltage, current, and temperature with CAN bus communication.', hardwareRequirements: ['STM32F4 Microcontroller', 'LTC6811 BMS IC', 'CAN Transceiver'], softwareRequirements: ['STM32CubeIDE', 'FreeRTOS', 'CANoe'], expectedOutcome: 'Functional hardware prototype transmitting live telemetry over CAN bus.', industryRelevance: 'Essential skill for Electric Vehicle (EV) and Renewable Energy battery safety.', learningResources: ['TI BMS Reference Designs', 'ST CAN Bus Application Notes'], documentationUrl: 'https://example.edu/projects/bms-can' },
        { ...baseAudit, id: 'proj-solar-inverter', title: 'Pure Sine Wave Grid-Tied Solar Inverter', branch: 'EEE', domain: 'Power Electronics', difficulty: 'Advanced', description: 'Design a 1kW SPWM controlled inverter with Maximum Power Point Tracking (MPPT).', hardwareRequirements: ['MOSFET H-Bridge', 'DSPIC33 Microcontroller', 'Current Sensors'], softwareRequirements: ['MATLAB/Simulink', 'LTspice'], expectedOutcome: 'Low THD (<3%) AC output synchronized with grid voltage.', industryRelevance: 'Widely used in rooftop solar power systems and UPS installations.', learningResources: ['IEEE Power Electronics Transactions', 'NPTEL Power Electronics'] }
      ];

    case 'gate_subjects':
      return GATE_SYLLABUS_DATA.flatMap((b, bIdx) =>
        b.subjectWeightage.map((g, idx) => ({
          ...baseAudit,
          id: `gate-sub-${bIdx}-${idx}`,
          branch: b.branch,
          subjectName: g.subject,
          weightageRange: g.weightageRange,
          importance: g.importance,
          syllabusTopics: g.keyTopics,
          keyFormulas: ['V = IR', 'f_c = 1 / (2*pi*R*C)', 'H(s) = N(s)/D(s)']
        }))
      );

    case 'gate_questions':
      return GATE_SAMPLE_QUESTIONS.map((q, idx) => ({
        ...baseAudit,
        id: `gate-q-${q.id || idx}`,
        branch: q.branch,
        subject: q.subject,
        topic: q.topic,
        year: q.year,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        marks: q.marks,
        negativeMarks: q.marks === 2 ? 0.66 : 0.33,
        difficulty: q.marks === 2 ? 'Hard' : 'Medium',
        tags: [q.subject, q.topic, `GATE ${q.year}`]
      }));

    case 'gate_mock_tests':
      return [
        {
          ...baseAudit,
          id: 'gate-mock-1',
          testTitle: 'GATE ECE Full Syllabus Practice Mock Test 1',
          branch: 'ECE',
          timeLimitMinutes: 180,
          totalMarks: 100,
          instructions: '65 questions total. General Aptitude (15 marks), Engineering Mathematics & Core Subject (85 marks). Negative marking applies.',
          questionIds: ['gate-q-1', 'gate-q-2', 'gate-q-3'],
          difficulty: 'Full Standard'
        }
      ];

    case 'gate_study_plans':
      return [
        {
          ...baseAudit,
          id: 'gate-plan-6m',
          planTitle: '6-Month GATE Preparation Strategy for Core Branches',
          branch: 'ECE',
          planType: 'Monthly',
          targetDuration: '6 Months',
          milestones: ['Months 1-3: Complete Core Syllabus & PYQs', 'Month 4: Subject-wise Mock Tests & Formula Sheets', 'Months 5-6: Full Mock Tests & Weak Area Revision'],
          studyTips: ['Maintain a dedicated mistake notebook for mock tests', 'Revise Engineering Mathematics and General Aptitude weekly']
        }
      ];

    case 'higher_studies':
      return HIGHER_STUDIES_PATHWAYS.map((h, idx) => ({
        ...baseAudit,
        id: `hs-${h.id || idx}`,
        title: h.title,
        category: h.category,
        targetBranch: 'ECE',
        institutions: h.institutions,
        entranceExams: h.entranceExams,
        eligibility: h.eligibility,
        fundingAndStipend: h.fundingAndStipend,
        applicationDeadline: h.applicationDeadline,
        officialPortal: h.officialPortal,
        keySteps: h.keySteps
      }));

    case 'research':
      return RESEARCH_OPPORTUNITIES.map((r, idx) => ({
        ...baseAudit,
        id: `res-${r.id || idx}`,
        title: r.title,
        branch: r.branch,
        domain: r.domain,
        labName: r.labName,
        institution: r.institution,
        opportunityType: r.opportunityType,
        description: r.description,
        keyResearchQuestions: r.keyResearchQuestions,
        conferencesAndJournals: r.topConferencesAndJournals,
        contactInfo: r.contactInfo
      }));

    case 'internships':
      return [
        {
          ...baseAudit,
          id: 'int-1',
          organization: 'Texas Instruments',
          roleTitle: 'Analog & Embedded Systems Intern',
          branch: 'ECE',
          domain: 'Embedded Systems',
          eligibility: '3rd/4th Year B.E/B.Tech in ECE/EEE with 7.5+ CGPA',
          requiredSkills: ['Embedded C', 'Microcontrollers', 'Analog Circuit Design'],
          requiredTools: ['CCS', 'TINA-TI', 'Oscilloscope'],
          location: 'Bengaluru / Remote',
          stipendAndDuration: '₹45,000 / month (2 Months Summer)',
          deadline: '2026-09-30',
          applicationLink: 'https://careers.ti.com/university/',
          description: 'Hands-on experience designing microcontroller evaluation modules and mixed-signal peripheral drivers.',
          internshipType: 'Full-time'
        }
      ];

    case 'companies':
      return CORE_COMPANIES_DIRECTORY.map((c, idx) => ({
        ...baseAudit,
        id: `comp-${idx}`,
        companyName: c.name,
        industrySector: c.domains[0] || 'Core Engineering',
        targetBranches: c.branches,
        domains: c.domains,
        keyJobRoles: c.rolesHired || ['Core Design Engineer', 'R&D Engineer'],
        requiredSkills: c.skillsRequired || [],
        recruitmentProcess: c.recruitmentProcess?.join(' -> ') || 'Written Technical Screening -> Technical Interview.',
        careersPageUrl: c.officialCareerUrl,
        locations: ['Bengaluru', 'Hyderabad', 'Chennai', 'Pune']
      }));

    case 'certifications':
      return [
        {
          ...baseAudit,
          id: 'cert-arm',
          certName: 'ARM Accredited Engineer (AAE)',
          provider: 'ARM Holdings',
          branch: 'ECE',
          domain: 'Embedded Systems',
          skillLevel: 'Intermediate',
          costInfo: '$200 USD (Student Discount Available)',
          eligibility: 'Basic knowledge of ARM Cortex-M assembly and C architecture.',
          duration: 'Self-paced (Exam 90 mins)',
          officialUrl: 'https://www.arm.com/resources/education',
          relatedCareers: ['Embedded Engineer', 'Firmware Engineer']
        }
      ];

    case 'blogs':
      return [
        {
          ...baseAudit,
          id: 'blog-1',
          title: 'Understanding Memory Protection Units (MPU) in Real-time Systems',
          author: 'Dr. S. K. Raman, Senior Professor (ECE)',
          branch: 'ECE',
          domain: 'Embedded Systems',
          category: 'Technical Tutorial',
          contentSnippet: 'Learn how Memory Protection Units isolate tasks and prevent stack overflows in safety-critical FreeRTOS applications.',
          officialSource: 'Core Engineering Technical Series',
          publishedDate: '2026-08-01'
        }
      ];

    case 'learning_resources':
      return [
        {
          ...baseAudit,
          id: 'res-1',
          title: 'MIT OpenCourseWare: Microelectronic Devices and Circuits',
          branch: 'ECE',
          domain: 'VLSI & Silicon Design',
          resourceType: 'Video Course',
          difficulty: 'Intermediate',
          description: 'Comprehensive lecture series covering MOSFET physics, small-signal models, and amplifier design.',
          url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
          provider: 'MIT OCW',
          skillsCovered: ['MOSFET Physics', 'Small Signal Analysis', 'CMOS Circuits']
        }
      ];

    case 'installation_guides':
      return [
        {
          ...baseAudit,
          id: 'inst-vivado',
          softwareName: 'Xilinx Vivado ML Standard Edition',
          version: '2023.2',
          operatingSystem: 'Windows 11 / Ubuntu 22.04 LTS',
          systemRequirements: 'Minimum 16GB RAM, 80GB free SSD space, Multi-core CPU.',
          installationSteps: [
            'Download Xilinx Unified Installer from official AMD website.',
            'Select "Vivado ML Standard (Free)" during product selection.',
            'Choose target FPGA device families (Artix-7, Kintex-7).',
            'Complete installation and configure environment variables (VIVADO_HOME).'
          ],
          officialDownloadUrl: 'https://www.xilinx.com/support/download.html',
          officialDocsUrl: 'https://docs.xilinx.com/v/u/2023.2-English/ug910-vivado-getting-started',
          troubleshootingNotes: [
            'Ensure WebPACK free license is auto-activated during install.',
            'On Windows, run installer as Administrator to avoid driver install failures.'
          ]
        }
      ];

    case 'cross_department_mapping':
      return CROSS_DEPARTMENT_MAPPINGS.map(m => ({ ...baseAudit, ...m }));

    case 'department_comparison':
      return DEPARTMENT_COMPARISONS.map(c => ({ ...baseAudit, ...c }));

    default:
      return [];
  }
}
