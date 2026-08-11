export interface CoreTool {
  id: string;
  name: string;
  branch: 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'ALL';
  domain: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry Level';
  license: 'Open Source / Free' | 'Commercial (Institutional License)' | 'Freemium / Academic';
  operatingSystem: string;
  systemRequirements: string;
  purpose: string;
  industryRelevance: string;
  officialWebsite: string;
  officialDocs: string;
  tutorialUrl: string;
  exampleProject: string;
}

export interface SkillLevelTopic {
  levelName: string;
  levelNumber: number;
  topics: string[];
  recommendedTools: string[];
  projectIdea: string;
  expectedOutcome: string;
}

export interface CareerRoadmapNode {
  step: number;
  title: string;
  subtitle: string;
  keySkills: string[];
  recommendedTools: string[];
  milestoneProject: string;
}

export interface CareerRoleDetail {
  id: string;
  branch: 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';
  domain: string;
  title: string;
  description: string;
  averageSalary: string;
  topCompanies: string[];
  requiredSkills: string[];
  recommendedTools: string[];
  skillProgression: SkillLevelTopic[];
  roadmap: CareerRoadmapNode[];
}

export interface GateQuestion {
  id: string;
  branch: 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'ME' | 'CE' | 'DA' | 'BM';
  subject: string;
  topic: string;
  year: number;
  marks: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  formulaUsed?: string;
}

export interface GateSubjectWeightage {
  subject: string;
  weightageRange: string;
  importance: 'High' | 'Medium' | 'Low';
  keyTopics: string[];
}

export interface HigherStudyPathway {
  id: string;
  title: string;
  category: 'India (M.Tech/MS/PhD)' | 'International (MS/PhD)' | 'Scholarship / Fellowship';
  targetBranch: string[];
  institutions: string[];
  entranceExams: string[];
  eligibility: string;
  fundingAndStipend: string;
  applicationDeadline: string;
  keySteps: string[];
  officialPortal: string;
}

export interface ResearchOpportunity {
  id: string;
  branch: 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';
  domain: string;
  title: string;
  labName: string;
  institution: string;
  description: string;
  keyResearchQuestions: string[];
  topConferencesAndJournals: string[];
  recommendedPreparation: string[];
  opportunityType: 'Research Internship' | 'PhD/MS Thesis Topic' | 'Undergraduate Research';
  contactInfo: string;
}

export interface CoreCompany {
  id: string;
  name: string;
  branches: ('AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL')[];
  domains: string[];
  companyType: 'MNC' | 'PSU / Govt' | 'R&D / Core Startup';
  rolesHired: string[];
  skillsRequired: string[];
  recruitmentProcess: string[];
  officialCareerUrl: string;
  internshipOffered: boolean;
}

export interface CoreProjectIdea {
  id: string;
  title: string;
  branch: 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry Level';
  abstract: string;
  componentsOrTools: string[];
  expectedDeliverables: string[];
  schematicOrDiagramUrl?: string;
}

export interface TechnicalInterviewQA {
  id: string;
  branch: 'AI&DS' | 'Bio Medical' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';
  subject: string;
  question: string;
  answer: string;
  codeOrDiagramSnippet?: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
}

// Master Engineering Tools Database
export const CORE_ENGINEERING_TOOLS: CoreTool[] = [
  // ECE Embedded Tools
  {
    id: 'tool-stm32cube',
    name: 'STM32CubeIDE',
    branch: 'ECE',
    domain: 'Embedded Systems & Microcontrollers',
    level: 'Industry Level',
    license: 'Open Source / Free',
    operatingSystem: 'Windows, Linux, macOS',
    systemRequirements: '8GB RAM, Core i5, 10GB Disk Space',
    purpose: 'All-in-one multi-OS development tool for STM32 microcontrollers with built-in C/C++ compiler and code generator.',
    industryRelevance: 'Widely used in automotive ECUs, consumer electronics, and industrial IoT nodes using ARM Cortex-M cores.',
    officialWebsite: 'https://www.st.com/en/development-tools/stm32cubeide.html',
    officialDocs: 'https://www.st.com/resource/en/user_manual/um2609-stm32cubeide-user-guide-stmicroelectronics.pdf',
    tutorialUrl: 'https://wiki.st.com/stm32mcu/wiki/STM32CubeIDE_basics',
    exampleProject: 'STM32 FreeRTOS CAN Bus Sensor Node Data Logger'
  },
  {
    id: 'tool-proteus',
    name: 'Proteus VSM',
    branch: 'ECE',
    domain: 'Circuit Simulation & Microcontroller Emulation',
    level: 'Intermediate',
    license: 'Commercial (Institutional License)',
    operatingSystem: 'Windows 10/11',
    systemRequirements: '4GB RAM, Dedicated GPU for 3D PCB Preview',
    purpose: 'Simulates microcontrollers (8051, PIC, AVR, ARM) alongside analog & digital components before hardware fabrication.',
    industryRelevance: 'Essential in academic hardware labs, rapid embedded prototyping, and schematic debugging.',
    officialWebsite: 'https://www.labcenter.com/',
    officialDocs: 'https://www.labcenter.com/documentation/',
    tutorialUrl: 'https://www.labcenter.com/tutorials/',
    exampleProject: 'Virtual Stepper Motor Control with LCD & Interrupts'
  },
  {
    id: 'tool-ltspice',
    name: 'LTspice XVII',
    branch: 'ECE',
    domain: 'Analog & Power Circuit Simulation',
    level: 'Intermediate',
    license: 'Open Source / Free',
    operatingSystem: 'Windows, macOS',
    systemRequirements: '4GB RAM, Any modern dual-core CPU',
    purpose: 'High-performance SPICE simulator with schematic capture for analog circuits, power electronics, and filter design.',
    industryRelevance: 'Gold standard for power supply designers, RF engineers, and analog IC verification.',
    officialWebsite: 'https://www.analog.com/en/design-center/design-tools-and-calculators/ltspice-simulator.html',
    officialDocs: 'https://www.analog.com/media/en/simulation-models/spice-models/LTspiceHelp.pdf',
    tutorialUrl: 'https://learn.sparkfun.com/tutorials/getting-started-with-ltspice',
    exampleProject: 'Active Low-Pass Butterworth Filter & Switch-Mode Power Supply Analysis'
  },
  {
    id: 'tool-freertos',
    name: 'FreeRTOS Kernel',
    branch: 'ECE',
    domain: 'Real-Time Operating Systems (RTOS)',
    level: 'Advanced',
    license: 'Open Source / Free',
    operatingSystem: 'Cross-platform (Embedded Kernels)',
    systemRequirements: 'Minimal memory footprint (2KB-10KB ROM/RAM)',
    purpose: 'Market-leading real-time operating system kernel for microcontrollers providing preemptive multitasking, semaphores, and queues.',
    industryRelevance: 'De-facto industry standard for safety-critical medical devices, robotics, and connected IoT products.',
    officialWebsite: 'https://www.freertos.org/',
    officialDocs: 'https://www.freertos.org/Documentation/RTOS_book.html',
    tutorialUrl: 'https://www.freertos.org/FreeRTOS-quick-start-guide.html',
    exampleProject: 'Preemptive Task Scheduler with Mutexes for Dual UART Sensor Hub'
  },
  {
    id: 'tool-zephyr',
    name: 'Zephyr RTOS',
    branch: 'ECE',
    domain: 'IoT & Edge Firmware',
    level: 'Advanced',
    license: 'Open Source / Free',
    operatingSystem: 'Linux, macOS, Windows (via WSL2)',
    systemRequirements: '8GB RAM, Python 3, CMake, West Tool',
    purpose: 'Scalable, secure real-time OS hosted by the Linux Foundation supporting multiple hardware architectures with built-in device trees.',
    industryRelevance: 'Fastest-growing RTOS in modern wearable technology, smart grid nodes, and BLE/Thread mesh networks.',
    officialWebsite: 'https://zephyrproject.org/',
    officialDocs: 'https://docs.zephyrproject.org/latest/index.html',
    tutorialUrl: 'https://docs.zephyrproject.org/latest/develop/getting_started/index.html',
    exampleProject: 'Zephyr BLE Mesh Node with Device Tree Hardware Mapping'
  },

  // ECE VLSI Tools
  {
    id: 'tool-vivado',
    name: 'Xilinx Vivado Design Suite',
    branch: 'ECE',
    domain: 'VLSI & FPGA RTL Design',
    level: 'Industry Level',
    license: 'Freemium / Academic',
    operatingSystem: 'Windows, RHEL Linux, Ubuntu',
    systemRequirements: '16GB RAM, Quad-Core CPU, 60GB SSD Space',
    purpose: 'RTL synthesis, place-and-route, simulation, and hardware debugging for Xilinx 7-Series, UltraScale+, and Versal FPGAs.',
    industryRelevance: 'Core tool for telecom base station hardware, high-frequency trading FPGA acceleration, and aerospace radar processing.',
    officialWebsite: 'https://www.xilinx.com/products/design-tools/vivado.html',
    officialDocs: 'https://docs.xilinx.com/v/u/en-US/ug910-vivado-getting-started',
    tutorialUrl: 'https://www.xilinx.com/support/documentation-navigation/design-hubs.html',
    exampleProject: 'Verilog RISC-V 32-bit Core Synthesized on Basys3 Board'
  },
  {
    id: 'tool-openlane',
    name: 'OpenLane ASIC Flow',
    branch: 'ECE',
    domain: 'Open-Source Physical Design & ASIC Fabrication',
    level: 'Advanced',
    license: 'Open Source / Free',
    operatingSystem: 'Linux (Docker Container)',
    systemRequirements: '16GB RAM, Docker Enabled, 30GB Space',
    purpose: 'Automated RTL to GDSII flow based on OpenROAD, Yosys, and Magic for open-source semiconductor fabrication (SkyWater 130nm).',
    industryRelevance: 'Revolutionizing custom chip design democratization and academic microelectronics prototyping.',
    officialWebsite: 'https://github.com/The-OpenROAD-Project/OpenLane',
    officialDocs: 'https://openlane.readthedocs.io/en/latest/',
    tutorialUrl: 'https://openlane.readthedocs.io/en/latest/getting_started/quickstart.html',
    exampleProject: 'RTL to GDSII Tapeout of 8-bit MAC Unit on Sky130 PDK'
  },
  {
    id: 'tool-modelsim',
    name: 'Siemens ModelSim / Questa',
    branch: 'ECE',
    domain: 'Verilog / VHDL / SystemVerilog Simulation',
    level: 'Intermediate',
    license: 'Freemium / Academic',
    operatingSystem: 'Windows, Linux',
    systemRequirements: '8GB RAM, Dual-Core CPU',
    purpose: 'Logic simulation and testbench verification tool supporting VHDL, Verilog, SystemVerilog, and SystemC.',
    industryRelevance: 'Benchmark HDL simulator used across global semiconductor firms (Intel, Qualcomm, Broadcom).',
    officialWebsite: 'https://eda.sw.siemens.com/en-US/ic/modelsim/',
    officialDocs: 'https://eda.sw.siemens.com/en-US/resources/',
    tutorialUrl: 'https://microcontrollerslab.com/modelsim-tutorial-step-by-step-guide/',
    exampleProject: 'SystemVerilog Constrained Random Verification of AXI4-Lite Bus Controller'
  },

  // EEE Tools
  {
    id: 'tool-matlab-simulink',
    name: 'MATLAB & Simulink',
    branch: 'EEE',
    domain: 'Power Systems, Control & Motor Drives',
    level: 'Industry Level',
    license: 'Commercial (Institutional License)',
    operatingSystem: 'Windows, macOS, Linux',
    systemRequirements: '16GB RAM, Core i7 / Ryzen 7',
    purpose: 'Multi-domain block diagram simulation environment for dynamic system modeling, power grids, and motor control algorithms.',
    industryRelevance: 'Essential across electric vehicle OEMs (Tesla, Tata Motors), power utility grids, and aerospace control systems.',
    officialWebsite: 'https://www.mathworks.com/products/simulink.html',
    officialDocs: 'https://www.mathworks.com/help/simulink/',
    tutorialUrl: 'https://www.mathworks.com/learn/tutorials/simulink-onramp.html',
    exampleProject: 'Closed-Loop Field-Oriented Control (FOC) for EV Permanent Magnet Synchronous Motor (PMSM)'
  },
  {
    id: 'tool-etap',
    name: 'ETAP Electrical Power System Analysis',
    branch: 'EEE',
    domain: 'Power System Studies & Smart Grids',
    level: 'Industry Level',
    license: 'Commercial (Institutional License)',
    operatingSystem: 'Windows 10/11',
    systemRequirements: '16GB RAM, Dedicated Graphics',
    purpose: 'Power system modeling, load flow analysis, short circuit calculation, arc flash risk evaluation, and relay coordination.',
    industryRelevance: 'Used by power utility companies, electrical consultants, and heavy industrial plant engineers.',
    officialWebsite: 'https://etap.com/',
    officialDocs: 'https://etap.com/resources/user-guide',
    tutorialUrl: 'https://etap.com/training/tutorials',
    exampleProject: '33kV Substation Load Flow Analysis and Distance Relay Protection Coordination'
  },
  {
    id: 'tool-plc-scada',
    name: 'Siemens TIA Portal (PLC / SCADA)',
    branch: 'EEE',
    domain: 'Industrial Automation & Drives',
    level: 'Advanced',
    license: 'Commercial (Institutional License)',
    operatingSystem: 'Windows 10 Pro',
    systemRequirements: '16GB RAM, SSD Drive',
    purpose: 'Totally Integrated Automation portal for programming S7-1200/1500 PLCs, HMI screens, and SCADA monitoring.',
    industryRelevance: 'Core framework for smart manufacturing factories, chemical plants, automotive assembly lines, and water treatment plants.',
    officialWebsite: 'https://www.siemens.com/tia-portal',
    officialDocs: 'https://support.industry.siemens.com/',
    tutorialUrl: 'https://support.industry.siemens.com/cs/document/109741828/',
    exampleProject: 'Automated Conveyor System Ladder Logic with WinCC SCADA Supervision'
  },

  // MECH Tools
  {
    id: 'tool-solidworks',
    name: 'Dassault SolidWorks',
    branch: 'MECH',
    domain: '3D Mechanical CAD & Parametric Modeling',
    level: 'Intermediate',
    license: 'Commercial (Institutional License)',
    operatingSystem: 'Windows 10/11',
    systemRequirements: '16GB RAM, NVIDIA Quadro/RTX GPU, 20GB SSD',
    purpose: 'Industry-standard parametric 3D CAD software for part modeling, assembly, sheet metal design, and drafting.',
    industryRelevance: 'Primary tool for product design engineers, consumer hardware startups, and automotive component suppliers.',
    officialWebsite: 'https://www.solidworks.com/',
    officialDocs: 'https://help.solidworks.com/',
    tutorialUrl: 'https://my.solidworks.com/training',
    exampleProject: 'Parametric Design and Kinematic Assembly of a 6-Speed Manual Transmission'
  },
  {
    id: 'tool-ansys',
    name: 'ANSYS Mechanical & Fluent',
    branch: 'MECH',
    domain: 'FEA Structural & CFD Thermal Analysis',
    level: 'Industry Level',
    license: 'Freemium / Academic',
    operatingSystem: 'Windows, Linux',
    systemRequirements: '32GB RAM, Multicore Workstation CPU, High-end GPU',
    purpose: 'Comprehensive multiphysics simulation software covering Finite Element Analysis (FEA) and Computational Fluid Dynamics (CFD).',
    industryRelevance: 'Critical for crashworthiness analysis, aerodynamics of race cars, turbine blade thermal stress, and structural integrity.',
    officialWebsite: 'https://www.ansys.com/',
    officialDocs: 'https://ansyshelp.ansys.com/',
    tutorialUrl: 'https://courses.ansys.com/',
    exampleProject: 'CFD Aerodynamic Drag Reduction Analysis of Formula Student Race Car Wing'
  },

  // CIVIL Tools
  {
    id: 'tool-staadpro',
    name: 'Bentley STAAD.Pro V8i',
    branch: 'CIVIL',
    domain: 'Structural Analysis & Reinforced Concrete Design',
    level: 'Industry Level',
    license: 'Commercial (Institutional License)',
    operatingSystem: 'Windows 10/11',
    systemRequirements: '16GB RAM, Dedicated GPU',
    purpose: '3D structural analysis and design software supporting global building codes (IS 456, IS 1893 seismic standards).',
    industryRelevance: 'Primary software used by structural engineering consultancies for high-rise buildings, bridges, and industrial plants.',
    officialWebsite: 'https://www.bentley.com/software/staadpro/',
    officialDocs: 'https://docs.bentley.com/',
    tutorialUrl: 'https://www.bentley.com/events/training/',
    exampleProject: 'G+15 Reinforced Concrete High-Rise Frame Seismic Analysis per IS 1893'
  },
  {
    id: 'tool-revit',
    name: 'Autodesk Revit BIM',
    branch: 'CIVIL',
    domain: 'Building Information Modeling (BIM) & Architecture',
    level: 'Intermediate',
    license: 'Freemium / Academic',
    operatingSystem: 'Windows 10/11',
    systemRequirements: '16GB RAM, 4GB VRAM GPU',
    purpose: 'Multidisciplinary BIM software for coordinated structural, architectural, and MEP 3D modeling and 4D construction scheduling.',
    industryRelevance: 'Mandatory technology for modern smart infrastructure projects, mega airports, and metro rail designs.',
    officialWebsite: 'https://www.autodesk.com/products/revit/overview',
    officialDocs: 'https://help.autodesk.com/view/RVT/2024/ENU/',
    tutorialUrl: 'https://www.autodesk.com/campaigns/autodesk-design-academy',
    exampleProject: '4D BIM Structural Model and Quantity Takeoff for Integrated Hospital Complex'
  },

  // AI&DS Tools
  {
    id: 'tool-pytorch',
    name: 'PyTorch & CUDA Studio',
    branch: 'AI&DS',
    domain: 'Machine Learning & Deep Neural Networks',
    level: 'Industry Level',
    license: 'Open Source / Free',
    operatingSystem: 'Linux / Windows / macOS',
    systemRequirements: '16GB RAM, NVIDIA CUDA GPU',
    purpose: 'Open-source deep learning framework with dynamic computational graphs for tensor computation and deep neural networks.',
    industryRelevance: 'Gold standard framework for generative AI, computer vision, natural language processing, and LLM fine-tuning.',
    officialWebsite: 'https://pytorch.org/',
    officialDocs: 'https://pytorch.org/docs/stable/index.html',
    tutorialUrl: 'https://pytorch.org/tutorials/',
    exampleProject: 'Multimodal Vision Transformer for Real-Time Satellite Deforestation Monitoring'
  },
  {
    id: 'tool-pandas-scikit',
    name: 'Pandas & Scikit-Learn Ecosystem',
    branch: 'AI&DS',
    domain: 'Data Science & Predictive Modeling',
    level: 'Intermediate',
    license: 'Open Source / Free',
    operatingSystem: 'Cross-Platform',
    systemRequirements: '8GB RAM',
    purpose: 'Python data manipulation library and machine learning toolkit for classification, regression, clustering, and feature engineering.',
    industryRelevance: 'Essential toolkit for every data scientist and machine learning engineer in finance, healthcare, and e-commerce.',
    officialWebsite: 'https://scikit-learn.org/',
    officialDocs: 'https://scikit-learn.org/stable/user_guide.html',
    tutorialUrl: 'https://scikit-learn.org/stable/tutorial/index.html',
    exampleProject: 'Automated Financial Fraud Detection Engine with XGBoost'
  },

  // Bio Medical Tools
  {
    id: 'tool-slicer3d',
    name: '3D Slicer & ITK Toolkit',
    branch: 'Bio Medical',
    domain: 'Medical Image Computing & Visualization',
    level: 'Advanced',
    license: 'Open Source / Free',
    operatingSystem: 'Windows / Linux / macOS',
    systemRequirements: '16GB RAM, 3D GPU',
    purpose: 'Free open source software platform for medical image informatics, DICOM processing, and 3D organ surface reconstruction.',
    industryRelevance: 'Extensively used in surgical planning, medical robotics, radiomics research, and diagnostic medical imaging.',
    officialWebsite: 'https://www.slicer.org/',
    officialDocs: 'https://slicer.readthedocs.io/',
    tutorialUrl: 'https://www.slicer.org/wiki/Documentation/4.10/Training',
    exampleProject: 'Automated Brain Tumor Segmentation from Multi-Modal MRI Scan DICOM Files'
  },
  {
    id: 'tool-physionet',
    name: 'PhysioNet & WFDB Signal Studio',
    branch: 'Bio Medical',
    domain: 'Bio-Signal Processing & Monitoring',
    level: 'Intermediate',
    license: 'Open Source / Free',
    operatingSystem: 'Cross-Platform',
    systemRequirements: '8GB RAM',
    purpose: 'Repository and toolkit for complex physiologic signals (ECG, EEG, PPG, EMG) waveform analysis and filtering algorithms.',
    industryRelevance: 'De facto standard in patient monitoring equipment design, wearable health trackers, and ICU telemetry.',
    officialWebsite: 'https://physionet.org/',
    officialDocs: 'https://wfdb.readthedocs.io/',
    tutorialUrl: 'https://physionet.org/tutorials/',
    exampleProject: 'Real-time Arrhythmia Detection with QRS Complex Filtering in Ambulatory ECGs'
  },

  // CSE Tools
  {
    id: 'tool-docker-k8s',
    name: 'Docker & Kubernetes Cloud Engine',
    branch: 'CSE',
    domain: 'DevOps & Distributed Systems',
    level: 'Industry Level',
    license: 'Open Source / Free',
    operatingSystem: 'Linux / Windows / macOS',
    systemRequirements: '16GB RAM',
    purpose: 'Containerization engine and container orchestration platform for automating deployment, scaling, and management of cloud applications.',
    industryRelevance: 'Standard infrastructure component for enterprise SaaS, high-availability microservices, and modern web backends.',
    officialWebsite: 'https://www.docker.com/',
    officialDocs: 'https://docs.docker.com/',
    tutorialUrl: 'https://kubernetes.io/docs/tutorials/',
    exampleProject: 'Auto-Scaling Microservices Architecture Deployed on Kubernetes Cluster'
  },
  {
    id: 'tool-postman-swagger',
    name: 'Postman & OpenAPI Workspace',
    branch: 'CSE',
    domain: 'Backend Engineering & API Development',
    level: 'Intermediate',
    license: 'Freemium / Academic',
    operatingSystem: 'Cross-Platform',
    systemRequirements: '8GB RAM',
    purpose: 'API platform for building, testing, documenting, and managing RESTful, GraphQL, and gRPC endpoints.',
    industryRelevance: 'Universal tool utilized across software engineering teams for backend contract design and integration testing.',
    officialWebsite: 'https://www.postman.com/',
    officialDocs: 'https://learning.postman.com/docs/',
    tutorialUrl: 'https://www.postman.com/student-program/',
    exampleProject: 'Secure OAuth2 Microservices Gateway with Automated Postman Test Suites'
  }
];

// Core Career Roles Database
export const CORE_CAREER_ROLES: CareerRoleDetail[] = [
  // ECE - Embedded Systems
  {
    id: 'role-embedded-firmware',
    branch: 'ECE',
    domain: 'Embedded Systems',
    title: 'Embedded Firmware / RTOS Engineer',
    description: 'Architects low-level microcontroller software, device drivers (SPI, I2C, CAN), hardware abstraction layers, and real-time operating system task scheduling.',
    averageSalary: '₹7.5 LPA - ₹24 LPA',
    topCompanies: ['Bosch', 'Texas Instruments', 'Qualcomm', 'STMicroelectronics', 'NXP', 'Continental', 'Ather Energy'],
    requiredSkills: [
      'Embedded C / C++',
      'ARM Cortex-M Architecture',
      'Bare-metal Register Configuration',
      'Interrupt Handling & DMA',
      'SPI, I2C, UART, CAN Protocols',
      'FreeRTOS / Zephyr Task Synchronization',
      'Oscilloscopes & Logic Analyzers'
    ],
    recommendedTools: ['STM32CubeIDE', 'Keil MDK', 'LTspice', 'FreeRTOS', 'Logic Analyzer Software', 'Git'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: C & Microcontroller Fundamentals',
        topics: ['Bitwise Operators', 'Pointers & Memory Allocation', 'GPIO Configuration', 'Timers & Counter Registers', 'UART Serial Communication'],
        recommendedTools: ['Arduino IDE', 'STM32CubeIDE'],
        projectIdea: 'Interrupt-driven Digital Tachometer with LCD Display',
        expectedOutcome: 'Ability to configure register bits without high-level library abstraction.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: Hardware Communication Protocols',
        topics: ['SPI Bus Interfacing', 'I2C Master/Slave Protocol', 'ADC Sampling & Direct Memory Access (DMA)', 'Watchdog Timers', 'Power Saving Modes'],
        recommendedTools: ['STM32CubeIDE', 'Proteus', 'Logic Analyzer'],
        projectIdea: 'SPI-based Graphical Display with DMA Temperature Logging',
        expectedOutcome: 'Mastery over hardware communication timing diagrams and register polling vs interrupts.'
      },
      {
        levelNumber: 3,
        levelName: 'Level 3: Real-Time Operating Systems (RTOS)',
        topics: ['Task Creation & Priority Scheduling', 'Preemption Mechanisms', 'Mutexes & Semaphores', 'Queue Message Passing', 'Event Groups & Software Timers'],
        recommendedTools: ['FreeRTOS Kernel', 'Keil MDK'],
        projectIdea: 'RTOS Multitasking Weather Station with Sensor Acquisition & Display Threads',
        expectedOutcome: 'Deep understanding of thread safety, priority inversion, and stack overflow prevention.'
      },
      {
        levelNumber: 4,
        levelName: 'Level 4: Automotive & Embedded Linux Industry Ready',
        topics: ['CAN 2.0B / CAN-FD Bus Protocol', 'Custom Bootloader Architecture', 'Device Drivers', 'Embedded Linux Yocto Build System', 'MISRA-C Compliance'],
        recommendedTools: ['Zephyr RTOS', 'QEMU', 'Yocto Project', 'SEGGER J-Link'],
        projectIdea: 'CAN-Bus Automotive Dashboard ECU with Firmware Over-The-Air (FOTA) Updates',
        expectedOutcome: 'Complete readiness for tier-1 automotive and semiconductor R&D entry roles.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Master C & Data Structures for Embedded Systems',
        subtitle: 'Pointers, Memory Maps & Bit Manipulation',
        keySkills: ['Embedded C', 'Memory Mapping', 'Volatile Keyword', 'Structures & Unions'],
        recommendedTools: ['GCC Compiler', 'GDB'],
        milestoneProject: 'Custom Dynamic Memory Manager for Microcontrollers'
      },
      {
        step: 2,
        title: 'ARM Cortex-M Hardware Architecture',
        subtitle: 'Registers, NVIC Interrupts & Timers',
        keySkills: ['ARM Architecture', 'NVIC Interrupt Priorities', 'DMA', 'Clock Trees'],
        recommendedTools: ['STM32CubeIDE', 'Logic Analyzer'],
        milestoneProject: 'Bare-Metal STM32 Audio Signal Sampler via ADC DMA'
      },
      {
        step: 3,
        title: 'RTOS Core Fundamentals',
        subtitle: 'Tasks, Queues, Mutexes & Timers',
        keySkills: ['FreeRTOS', 'Task Scheduling', 'Semaphore Guarding', 'Deadlock Resolution'],
        recommendedTools: ['FreeRTOS', 'Keil MDK'],
        milestoneProject: 'Preemptive Multi-Sensor IoT Telemetry Controller'
      },
      {
        step: 4,
        title: 'Automotive Protocols & Firmware Security',
        subtitle: 'CAN, LIN, FOTA & MISRA Standards',
        keySkills: ['CAN Protocol', 'MISRA C', 'Custom Bootloaders', 'Hardware Security Modules'],
        recommendedTools: ['Zephyr RTOS', 'CANalyzer / Vector Tools'],
        milestoneProject: 'CAN-connected Instrument Cluster with Secure Bootloader'
      }
    ]
  },

  // ECE - VLSI
  {
    id: 'role-vlsi-rtl',
    branch: 'ECE',
    domain: 'VLSI Design & Verification',
    title: 'RTL Design & SystemVerilog Verification Engineer',
    description: 'Designs digital logic circuits using Verilog/VHDL and verifies complex ASIC/FPGA chips using SystemVerilog and Universal Verification Methodology (UVM).',
    averageSalary: '₹8.5 LPA - ₹28 LPA',
    topCompanies: ['Intel', 'Nvidia', 'Qualcomm', 'Broadcom', 'AMD', 'Cadence', 'Synopsys', 'Micron'],
    requiredSkills: [
      'Digital Logic & CMOS Fundamentals',
      'Verilog / SystemVerilog HDL',
      'Universal Verification Methodology (UVM)',
      'Constrained Random Testbenches',
      'Static Timing Analysis (STA)',
      'Synthesis & Place-and-Route',
      'FPGA Prototyping'
    ],
    recommendedTools: ['Xilinx Vivado', 'ModelSim', 'Questa', 'OpenLane', 'Yosys', 'GTKWave'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: Digital Fundamentals & Verilog Design',
        topics: ['Combinational & Sequential Circuits', 'Finite State Machines (FSM)', 'Verilog Behavioral vs RTL Modeling', 'Testbench Basics'],
        recommendedTools: ['ModelSim', 'Icarus Verilog', 'GTKWave'],
        projectIdea: 'Verilog Design and Simulation of 8-bit ALU with Status Flags',
        expectedOutcome: 'Ability to translate boolean equations and state diagrams into synthesis-ready Verilog code.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: Advanced SystemVerilog & Verification',
        topics: ['Object Oriented SystemVerilog', 'Randomization & Constraints', 'Virtual Interfaces', 'Mailboxes & Semaphores', 'Functional Coverage'],
        recommendedTools: ['Questa Simulator', 'Xilinx Vivado'],
        projectIdea: 'SystemVerilog Constrained Random Testbench for Dual-Port FIFO Memory',
        expectedOutcome: 'Proficiency in writing self-checking testbenches with coverage metrics.'
      },
      {
        levelNumber: 3,
        levelName: 'Level 3: UVM & Physical Design Flow',
        topics: ['UVM Components (Driver, Monitor, Agent, Scoreboard)', 'UVM Sequences & Transactions', 'Static Timing Analysis (STA)', 'Setup & Hold Slack Optimization'],
        recommendedTools: ['Xilinx Vivado', 'OpenLane ASIC Flow', 'Yosys'],
        projectIdea: 'UVM-Verified RISC-V 32-bit Processor Core Design & FPGA Tapeout Flow',
        expectedOutcome: 'Industry-level design verification capability aligned with tier-1 semiconductor firms.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Master Digital Logic & Verilog HDL',
        subtitle: 'RTL Synthesis Principles',
        keySkills: ['Combinational Logic', 'FSM Design', 'RTL Verilog', 'Clock Domain Crossing'],
        recommendedTools: ['Icarus Verilog', 'GTKWave'],
        milestoneProject: 'SPI Controller Module with Verilog FSM'
      },
      {
        step: 2,
        title: 'SystemVerilog Object-Oriented Verification',
        subtitle: 'Testbench Architecture',
        keySkills: ['SystemVerilog OOP', 'Constraints', 'Coverage', 'Interfaces'],
        recommendedTools: ['ModelSim / Questa'],
        milestoneProject: 'SystemVerilog Random Verification Engine for AXI Stream Bus'
      },
      {
        step: 3,
        title: 'UVM & Static Timing Analysis',
        subtitle: 'ASIC/FPGA Industry Standard Flow',
        keySkills: ['UVM Framework', 'STA Timing Closure', 'Synthesis Constraints', 'CDC Analysis'],
        recommendedTools: ['Xilinx Vivado', 'OpenLane'],
        milestoneProject: 'UVM Verification Suite for 32-Bit Floating Point Unit (FPU)'
      }
    ]
  },

  // EEE - Power Systems & EV
  {
    id: 'role-eee-power-ev',
    branch: 'EEE',
    domain: 'Power Electronics & Electric Vehicles',
    title: 'EV Powertrain & Power Electronics Design Engineer',
    description: 'Designs switch-mode power converters (DC-DC buck/boost, inverters), Battery Management Systems (BMS), and electric motor drives for electric vehicles and renewable grids.',
    averageSalary: '₹7 LPA - ₹22 LPA',
    topCompanies: ['Tata Motors EV', 'Ather Energy', 'Ola Electric', 'Schneider Electric', 'ABB', 'Siemens', 'L&T Electrical'],
    requiredSkills: [
      'Power Electronics (Buck, Boost, Inverters)',
      'Battery Management Systems (BMS) Balancing',
      'Motor Control (FOC / Space Vector PWM)',
      'MATLAB Simulink Power Modeling',
      'PCB Design for High Voltage High Current',
      'Thermal Management of Power Devices'
    ],
    recommendedTools: ['MATLAB / Simulink', 'PLECS', 'LTspice', 'AutoCAD Electrical', 'KiCad'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: Power Converters & Control Principles',
        topics: ['MOSFET/IGBT Switching Characteristics', 'DC-DC Buck & Boost Converter Calculations', 'PWM Control Schemes', 'Passive Component Sizing'],
        recommendedTools: ['LTspice', 'MATLAB Simulink'],
        projectIdea: 'Closed-Loop PWM Controlled 48V to 12V DC-DC Buck Converter',
        expectedOutcome: 'Understanding of ripple current, efficiency, and magnetic design.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: Inverters & Motor Drive Control',
        topics: ['Single-Phase & 3-Phase Inverters', 'Space Vector Pulse Width Modulation (SVPWM)', 'Field-Oriented Control (FOC)', 'Permanent Magnet Synchronous Motors (PMSM)'],
        recommendedTools: ['PLECS', 'Simulink Power Systems'],
        projectIdea: 'Simulink Simulation of FOC Drive for EV Traction Motor',
        expectedOutcome: 'Mastery over AC drive speed control and torque response optimization.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Power Electronics Basics & Converter Modeling',
        subtitle: 'Buck, Boost, Flyback & Inverters',
        keySkills: ['Switching Devices', 'Converter Topology', 'Duty Cycle Regulation'],
        recommendedTools: ['LTspice', 'PLECS'],
        milestoneProject: 'High-Efficiency Synchronous Buck Converter with Gate Drivers'
      },
      {
        step: 2,
        title: 'EV Battery Management Systems & Electric Drives',
        subtitle: 'Cell Balancing & FOC Motor Control',
        keySkills: ['BMS Cell Passive/Active Balancing', 'SVPWM', 'FOC Vector Control', 'CAN Communication'],
        recommendedTools: ['MATLAB Simulink', 'Microchip MPLAB'],
        milestoneProject: '16-Cell Lithium Battery BMS Controller with Active Balancing & CAN Telemetry'
      }
    ]
  },

  // MECH - CAD/CAE
  {
    id: 'role-mech-cae',
    branch: 'MECH',
    domain: 'CAD / CAE & Design Engineering',
    title: 'Mechanical Design & FEA / CFD CAE Engineer',
    description: 'Designs complex 3D mechanical components, performs Finite Element Analysis (FEA) for structural integrity, and Computational Fluid Dynamics (CFD) for thermal/aerodynamic flow.',
    averageSalary: '₹6.5 LPA - ₹20 LPA',
    topCompanies: ['Mahindra R&D', 'Tata Motors', 'L&T Heavy Engineering', 'Ansys India', 'Boeing India', 'Rolls-Royce', 'Bosch Mechanical'],
    requiredSkills: [
      '3D Parametric CAD Modeling',
      'Geometric Dimensioning & Tolerancing (GD&T)',
      'Finite Element Analysis (FEA Static & Dynamic)',
      'Computational Fluid Dynamics (CFD)',
      'Mesh Generation & Quality Metrics',
      'Material Selection & Strength of Materials'
    ],
    recommendedTools: ['SolidWorks', 'CATIA V5', 'ANSYS Workbench', 'ANSYS Fluent', 'SolidWorks Simulation'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: Parametric 3D CAD & Drafting',
        topics: ['Part Modeling & Extrusions', 'Assembly Mates & Exploded Views', 'Engineering Drawings with GD&T', 'Sheet Metal & Weldments'],
        recommendedTools: ['SolidWorks', 'AutoCAD'],
        projectIdea: 'Parametric 3D Model and Assembly of Two-Stage Reduction Gearbox',
        expectedOutcome: 'Ability to generate manufacture-ready drawings with standard tolerances.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: FEA Structural Stress & Modal Analysis',
        topics: ['Meshing Strategies (Tetrahedral vs Hexahedral)', 'Boundary Conditions & Fixing Points', 'Von Mises Stress Analysis', 'Factor of Safety (FOS) Evaluation'],
        recommendedTools: ['ANSYS Mechanical', 'SolidWorks Simulation'],
        projectIdea: 'Structural Stress and Fatigue Life Analysis of Automotive Chassis Wishbone Arm',
        expectedOutcome: 'Proficiency in validating mechanical components against yield and fatigue failure.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Parametric CAD & GD&T Mastery',
        subtitle: 'Standardized Mechanical Product Design',
        keySkills: ['SolidWorks 3D', 'Assembly Mates', 'GD&T ASME Y14.5', 'Manufacturing Fits'],
        recommendedTools: ['SolidWorks', 'CATIA'],
        milestoneProject: 'Detailed GD&T Blueprint and Assembly of Internal Combustion Engine Piston'
      },
      {
        step: 2,
        title: 'FEA Stress & CFD Fluid Thermal Analysis',
        subtitle: 'Virtual Prototyping & Physics Validation',
        keySkills: ['Finite Element Meshing', 'Structural Stress Analysis', 'CFD Turbulence Models', 'Modal Frequency Analysis'],
        recommendedTools: ['ANSYS Workbench', 'OpenFOAM'],
        milestoneProject: 'CFD Aerodynamic Optimization and FEA Stress Validation of Turbine Blade'
      }
    ]
  },

  // CIVIL - Structural & BIM
  {
    id: 'role-civil-structural-bim',
    branch: 'CIVIL',
    domain: 'Structural Engineering & BIM',
    title: 'Structural Design & BIM Coordinator',
    description: 'Performs 3D structural analysis for reinforced concrete and steel structures, creates Building Information Models (BIM), and validates earthquake/wind design standards.',
    averageSalary: '₹6 LPA - ₹18 LPA',
    topCompanies: ['L&T Construction', 'Shapoorji Pallonji', 'Tata Projects', 'RITES', 'Jacobs Engineering', 'AECOM', 'Atkins Realis'],
    requiredSkills: [
      'Reinforced Concrete Design (IS 456)',
      'Seismic Earthquake Analysis (IS 1893)',
      '3D Frame Analysis in STAAD.Pro',
      'Building Information Modeling (Revit BIM)',
      'Quantity Surveying & Estimation',
      'Construction Project Scheduling (Primavera P6)'
    ],
    recommendedTools: ['STAAD.Pro', 'ETABS', 'Autodesk Revit', 'Civil 3D', 'Primavera P6', 'AutoCAD'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: Structural Analysis & 2D AutoCAD Drafting',
        topics: ['Shear Force & Bending Moment Diagrams', 'IS 456 Concrete Design Rules', 'Column & Beam Detailing', 'Structural Framing Layouts'],
        recommendedTools: ['AutoCAD', 'STAAD.Pro'],
        projectIdea: '2D/3D Structural Blueprint and Reinforcement Schedule for G+3 Residential Villa',
        expectedOutcome: 'Ability to draft structural drawings compliant with Indian Standard codes.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: 3D Seismic Analysis & Revit BIM Coordination',
        topics: ['Response Spectrum Analysis', 'Wind Load Calculation (IS 875)', 'Revit 3D Parametric BIM', 'Clash Detection & Quantity Takeoff'],
        recommendedTools: ['STAAD.Pro', 'ETABS', 'Autodesk Revit BIM'],
        projectIdea: 'G+12 Commercial Building Seismic Frame Analysis & 4D Revit BIM Execution Plan',
        expectedOutcome: 'Job-readiness for high-rise building consultancies and BIM infrastructure projects.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Structural Fundamentals & Code Regulations',
        subtitle: 'Concrete (IS 456) & Steel (IS 800) Standards',
        keySkills: ['Analysis of Structures', 'Bending & Shear Analysis', 'IS Codes', 'AutoCAD Drafting'],
        recommendedTools: ['AutoCAD', 'STAAD.Pro'],
        milestoneProject: 'Structural Calculation and Blueprint Detailing for Reinforced Concrete Portal Frame'
      },
      {
        step: 2,
        title: '3D Seismic Frame Analysis & Revit 4D BIM',
        subtitle: 'Infrastructure Technology & Clash Coordination',
        keySkills: ['ETABS / STAAD.Pro Analysis', 'Seismic Response Spectrum', 'Revit BIM Modeling', '4D Scheduling'],
        recommendedTools: ['ETABS', 'Autodesk Revit', 'Primavera P6'],
        milestoneProject: 'Complete Structural Design, Seismic Safety Certification, and BIM Model for Metro Station'
      }
    ]
  },

  // AI&DS - AI & Machine Learning
  {
    id: 'role-aids-ml-engineer',
    branch: 'AI&DS',
    domain: 'Artificial Intelligence & Machine Learning',
    title: 'AI / Machine Learning & MLOps Engineer',
    description: 'Builds scalable machine learning models, computer vision neural networks, natural language processing pipelines, and deploys them to production cloud infrastructure.',
    averageSalary: '₹8.5 LPA - ₹32 LPA',
    topCompanies: ['Google AI', 'Microsoft Research', 'NVIDIA', 'OpenAI', 'Amazon Web Services', 'Fractal Analytics', 'Tiger Analytics'],
    requiredSkills: [
      'Python / C++',
      'Deep Neural Networks (PyTorch / TensorFlow)',
      'Computer Vision & OpenCV',
      'Transformers & LLM Architecture',
      'MLOps Model Deployment (MLflow / Docker)',
      'Feature Engineering & Data Analytics'
    ],
    recommendedTools: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'MLflow', 'Docker', 'Jupyter Lab', 'CUDA'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: Python Data Science & Statistical Analytics',
        topics: ['Exploratory Data Analysis', 'Pandas & NumPy Matrix Operations', 'Supervised Classification & Regression', 'Model Validation & ROC Curves'],
        recommendedTools: ['Jupyter Lab', 'Scikit-Learn', 'Pandas'],
        projectIdea: 'Predictive Analytics Engine for Customer Churn and Retention',
        expectedOutcome: 'Ability to clean datasets, engineer features, and train baseline ML models.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: Deep Learning & Vision Transformers',
        topics: ['Convolutional Neural Networks (CNNs)', 'Attention Mechanisms & Transformers', 'PyTorch Autograd & Backpropagation', 'MLOps Model Containerization'],
        recommendedTools: ['PyTorch', 'OpenCV', 'Docker'],
        projectIdea: 'Real-time Autonomous Vehicle Lane & Pedestrian Detection with YOLOv8',
        expectedOutcome: 'Mastery over computer vision and deep neural network deployment.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Data Science & Machine Learning Foundations',
        subtitle: 'Data Wrangling & Statistical Algorithms',
        keySkills: ['Python', 'Pandas', 'Scikit-Learn', 'Feature Engineering'],
        recommendedTools: ['Jupyter', 'Scikit-Learn'],
        milestoneProject: 'End-to-End Predictive Maintenance Model for Industrial IoT Sensors'
      },
      {
        step: 2,
        title: 'Deep Learning, Vision & LLM Engineering',
        subtitle: 'Neural Nets & Generative AI Systems',
        keySkills: ['PyTorch Deep Learning', 'Transformer Architecture', 'Fine-tuning LLMs', 'Docker MLOps'],
        recommendedTools: ['PyTorch', 'Hugging Face', 'MLflow'],
        milestoneProject: 'Multimodal Generative AI Medical Assistant with Vision & Text Reasoning'
      }
    ]
  },

  // Bio Medical - Medical Devices & Signal Processing
  {
    id: 'role-biomed-device-engineer',
    branch: 'Bio Medical',
    domain: 'Medical Devices & Bio-Instrumentation',
    title: 'Biomedical Equipment & Instrumentation Engineer',
    description: 'Designs physiological monitoring devices, medical imaging equipment, diagnostic sensors, and prosthetic electronic systems compliant with ISO 13485 medical device regulations.',
    averageSalary: '₹6.5 LPA - ₹22 LPA',
    topCompanies: ['GE Healthcare', 'Philips Medical Systems', 'Siemens Healthineers', 'Medtronic', 'Abbott', 'Stryker', 'TCS Health'],
    requiredSkills: [
      'Physiological Signal Processing (ECG / EEG / EMG)',
      'Bio-Sensor Circuit Design',
      'Medical Image Processing (DICOM)',
      'ISO 13485 Medical Device Standards',
      'FDA & CE Regulatory Compliance',
      '3D Organ Modeling & Biomechanics'
    ],
    recommendedTools: ['3D Slicer', 'PhysioNet', 'Proteus', 'LTspice', 'MATLAB Bio-Toolbox', 'LabVIEW'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: Bio-Signal Acquisition & Analog Filtering',
        topics: ['Instrumentation Amplifiers (InAmp)', 'Right Leg Drive (RLD) Circuits', 'Bandpass Active Filtering', 'ECG Waveform Sampling'],
        recommendedTools: ['LTspice', 'Proteus', 'Arduino'],
        projectIdea: 'Single-Lead Portable ECG Acquisition Shield with Bluetooth Monitoring',
        expectedOutcome: 'Understanding low-noise amplification of microvolt physiological signals.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: Medical Imaging & Bio-Telemetry Systems',
        topics: ['DICOM Image Processing & Segmentation', 'Wearable Biosensors', 'Patient Telemetry Protocols', 'ISO 14971 Risk Management'],
        recommendedTools: ['3D Slicer', 'PhysioNet', 'MATLAB'],
        projectIdea: 'AI-assisted Multi-parameter ICU Vital Signs Telemetry Monitor',
        expectedOutcome: 'Job readiness for R&D roles in healthcare and patient monitoring equipment.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Bio-Instrumentation & Analog Sensor Design',
        subtitle: 'Physiological Amplifiers & Signal Conditioning',
        keySkills: ['Instrumentation Amp', 'ECG/PPG Amplification', 'Noise Filtering', 'Safety Standards'],
        recommendedTools: ['LTspice', 'LabVIEW'],
        milestoneProject: 'Wearable Pulse Oximeter & Heart Rate Variability Monitor'
      },
      {
        step: 2,
        title: 'Medical Image Informatics & Telehealth Tech',
        subtitle: 'DICOM Processing & Smart Health Telemetry',
        keySkills: ['3D Slicer DICOM', 'Machine Learning for Bio-Signals', 'ISO 13485 Quality Standards'],
        recommendedTools: ['3D Slicer', 'PhysioNet', 'Python'],
        milestoneProject: 'Non-invasive Blood Glucose & Arrhythmia Detection Telehealth Platform'
      }
    ]
  },

  // CSE - Software Engineering & Cloud
  {
    id: 'role-cse-fullstack-cloud',
    branch: 'CSE',
    domain: 'Software Engineering & Cloud Computing',
    title: 'Full Stack Cloud & Distributed Systems Engineer',
    description: 'Architects robust microservice backends, high-performance web applications, cloud-native storage infrastructure, and automated CI/CD pipelines.',
    averageSalary: '₹8 LPA - ₹30 LPA',
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Salesforce', 'Goldman Sachs', 'Flipkart'],
    requiredSkills: [
      'Data Structures & Algorithms',
      'TypeScript / Node.js / Java',
      'React / Modern Web Architecture',
      'System Design & Microservices',
      'PostgreSQL / MongoDB / Redis',
      'Docker / Kubernetes / Cloud Services'
    ],
    recommendedTools: ['Docker', 'Kubernetes', 'Postman', 'VS Code', 'Git', 'Redis', 'AWS'],
    skillProgression: [
      {
        levelNumber: 1,
        levelName: 'Level 1: Object-Oriented Software & Modern Web Stack',
        topics: ['Data Structures & Complexity Analysis', 'RESTful API Architecture', 'React State Management & Hooks', 'Relational Database Schema Design'],
        recommendedTools: ['VS Code', 'Postman', 'PostgreSQL'],
        projectIdea: 'Full-Stack Smart Campus Resource Allocation & Management Portal',
        expectedOutcome: 'Proficiency in writing clean, well-typed full-stack web applications.'
      },
      {
        levelNumber: 2,
        levelName: 'Level 2: Distributed Systems & Cloud Microservices',
        topics: ['Microservice Decoupling', 'Redis Caching & Pub/Sub', 'Kafka Event Streaming', 'Docker Containerization & Kubernetes'],
        recommendedTools: ['Docker', 'Kubernetes', 'Redis', 'Postman'],
        projectIdea: 'Distributed Real-time Messaging & Notification Engine for 100k Active Users',
        expectedOutcome: 'Readiness for tier-1 tech product companies and high-scale cloud platforms.'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Algorithms & Full-Stack Core Mastery',
        subtitle: 'Data Structures, React & Backend APIs',
        keySkills: ['Data Structures (Trees/Graphs)', 'TypeScript', 'Node.js Express', 'SQL Databases'],
        recommendedTools: ['VS Code', 'Postman'],
        milestoneProject: 'Real-time Collaborative Engineering Task Engine with Auth'
      },
      {
        step: 2,
        title: 'Distributed System Design & Cloud DevOps',
        subtitle: 'Scalable Microservices & Container Orchestration',
        keySkills: ['Distributed System Design', 'Microservices', 'Docker & Kubernetes', 'CI/CD Pipelines'],
        recommendedTools: ['Docker', 'Kubernetes', 'Redis', 'AWS'],
        milestoneProject: 'High-Throughput Microservice Architecture with Redis Cache & Docker CI/CD'
      }
    ]
  }
];

// GATE Preparation Master Dataset
export const GATE_SYLLABUS_DATA = [
  {
    branch: 'ECE' as const,
    branchTitle: 'Electronics and Communication Engineering (GATE EC)',
    totalMarks: 100,
    sections: [
      { name: 'General Aptitude', weightage: '15 Marks', subjectsCount: 1 },
      { name: 'Engineering Mathematics', weightage: '13 Marks', subjectsCount: 1 },
      { name: 'Core ECE Subjects', weightage: '72 Marks', subjectsCount: 8 }
    ],
    subjectWeightage: [
      { subject: 'Networks, Signals & Systems', weightageRange: '12 - 15 Marks', importance: 'High' as const, keyTopics: ['Network Theorems', 'Transient Response', 'Laplace & Z-Transform', 'Fourier Series', 'DFT & FFT'] },
      { subject: 'Electronic Devices & Circuits (EDC)', weightageRange: '8 - 11 Marks', importance: 'High' as const, keyTopics: ['Carrier Transport in Semiconductors', 'PN Junction Capacitance', 'BJT & MOSFET Physics', 'CMOS Inverter Characteristics'] },
      { subject: 'Analog Circuits', weightageRange: '9 - 12 Marks', importance: 'High' as const, keyTopics: ['Op-Amp Applications', 'Feedback Amplifiers', 'Precision Rectifiers', 'Oscillators & Active Filters'] },
      { subject: 'Digital Circuits', weightageRange: '8 - 10 Marks', importance: 'Medium' as const, keyTopics: ['K-Maps & Logic Minimization', 'Combinational Circuits', 'Flip-Flops & Counters', '8085 / Microcontroller Architecture'] },
      { subject: 'Control Systems', weightageRange: '8 - 10 Marks', importance: 'High' as const, keyTopics: ['Transfer Function', 'Routh-Hurwitz Stability', 'Bode Plot & Nyquist Criterion', 'State Space Variable Analysis'] },
      { subject: 'Communications', weightageRange: '10 - 13 Marks', importance: 'High' as const, keyTopics: ['Amplitude & Frequency Modulation', 'Random Variables & Noise', 'PCM, DPCM & PSK Digital Modulations', 'Information Theory & Channel Capacity'] },
      { subject: 'Electromagnetics (EMFT)', weightageRange: '8 - 11 Marks', importance: 'Medium' as const, keyTopics: ['Maxwells Equations', 'Plane Wave Propagation', 'Transmission Line Impedance Matching', 'Waveguides & Antennas'] }
    ]
  },
  {
    branch: 'EEE' as const,
    branchTitle: 'Electrical Engineering (GATE EE)',
    totalMarks: 100,
    sections: [
      { name: 'General Aptitude', weightage: '15 Marks', subjectsCount: 1 },
      { name: 'Engineering Mathematics', weightage: '13 Marks', subjectsCount: 1 },
      { name: 'Core Electrical Subjects', weightage: '72 Marks', subjectsCount: 7 }
    ],
    subjectWeightage: [
      { subject: 'Electrical Machines', weightageRange: '11 - 14 Marks', importance: 'High' as const, keyTopics: ['Single & 3-Phase Transformers', 'DC Motors & Generators', '3-Phase Induction Motors', 'Synchronous Machines & Alternators'] },
      { subject: 'Power Systems', weightageRange: '10 - 13 Marks', importance: 'High' as const, keyTopics: ['Transmission Line Models', 'Bus Admittance Matrix', 'Gauss-Seidel & Newton-Raphson Load Flow', 'Fault Analysis & Relay Protection'] },
      { subject: 'Power Electronics', weightageRange: '9 - 12 Marks', importance: 'High' as const, keyTopics: ['Thyristors & SCR Phase Control', 'Buck, Boost & Buck-Boost Converters', 'Single & 3-Phase Inverters', 'Harmonic Reduction'] },
      { subject: 'Control Systems', weightageRange: '8 - 10 Marks', importance: 'Medium' as const, keyTopics: ['Root Locus', 'Frequency Response Analysis', 'PID Controller Tuning', 'State Space Modeling'] },
      { subject: 'Electrical & Electronic Measurements', weightageRange: '5 - 7 Marks', importance: 'Medium' as const, keyTopics: ['PMMC & Moving Iron Instruments', 'Bridges for R, L, C', 'Digital Energy Meters', 'Digital Storage Oscilloscope'] }
    ]
  }
];

export const GATE_SAMPLE_QUESTIONS: GateQuestion[] = [
  {
    id: 'gate-ec-q1',
    branch: 'ECE',
    subject: 'Electronic Devices & Circuits',
    topic: 'Semiconductor Physics',
    year: 2023,
    marks: 2,
    question: 'A silicon sample is doped with 10^16 phosphorus atoms/cm^3. Assuming intrinsic carrier concentration ni = 1.5 x 10^10 cm^-3 at 300 K, what is the minority carrier hole concentration (p)?',
    options: ['2.25 x 10^4 cm^-3', '1.5 x 10^6 cm^-3', '2.25 x 10^6 cm^-3', '1.0 x 10^10 cm^-3'],
    correctAnswer: 0,
    explanation: 'By Mass Action Law: n * p = ni^2. Here n ≈ Nd = 10^16 cm^-3. Therefore p = (1.5 x 10^10)^2 / 10^16 = (2.25 x 10^20) / 10^16 = 2.25 x 10^4 cm^-3.',
    formulaUsed: 'Mass Action Law: n * p = ni^2'
  },
  {
    id: 'gate-ec-q2',
    branch: 'ECE',
    subject: 'Control Systems',
    topic: 'State Space Analysis',
    year: 2022,
    marks: 2,
    question: 'Consider a unity feedback system with open-loop transfer function G(s) = K / (s(s + 2)(s + 4)). What is the value of K for which the closed-loop system is marginally stable?',
    options: ['K = 12', 'K = 24', 'K = 48', 'K = 96'],
    correctAnswer: 2,
    explanation: 'Characteristic equation: 1 + G(s) = 0 => s(s^2 + 6s + 8) + K = 0 => s^3 + 6s^2 + 8s + K = 0. Constructing Routh Array: s^3: [1, 8], s^2: [6, K], s^1: [(48 - K)/6]. For marginal stability, (48 - K)/6 = 0 => K = 48.',
    formulaUsed: 'Routh-Hurwitz Stability Criterion'
  },
  {
    id: 'gate-ee-q1',
    branch: 'EEE',
    subject: 'Power Electronics',
    topic: 'DC-DC Buck Converter',
    year: 2023,
    marks: 2,
    question: 'A ideal DC-DC Buck converter operates in continuous conduction mode with input voltage Vin = 50V, duty ratio D = 0.4, and switching frequency f = 20 kHz. What is the output voltage Vout?',
    options: ['12V', '20V', '25V', '30V'],
    correctAnswer: 1,
    explanation: 'For an ideal Buck converter in continuous conduction mode, Vout = D * Vin = 0.4 * 50V = 20V.',
    formulaUsed: 'Vout = Duty Ratio (D) * Vin'
  }
];

// Higher Studies & Pathways Dataset
export const HIGHER_STUDIES_PATHWAYS: HigherStudyPathway[] = [
  {
    id: 'pathway-iit-mtech',
    title: 'M.Tech / MS Research at Premier Indian Institutions (IITs, IISc, NITs)',
    category: 'India (M.Tech/MS/PhD)',
    targetBranch: ['ECE', 'EEE', 'MECH', 'CIVIL'],
    institutions: ['IISc Bangalore', 'IIT Bombay', 'IIT Madras', 'IIT Delhi', 'IIT Kharagpur', 'NIT Trichy'],
    entranceExams: ['GATE (Graduate Aptitude Test in Engineering)'],
    eligibility: 'B.E./B.Tech with minimum 60% or 6.5 CGPA + valid GATE scorecard.',
    fundingAndStipend: 'MHRD/MoE monthly stipend of ₹12,400/month for M.Tech/MS students.',
    applicationDeadline: 'March - April (Post GATE results announcement)',
    keySteps: [
      'Appear for GATE in February',
      'Register on COAP (Common Offer Acceptance Portal) for IITs & CCMT for NITs',
      'Submit individual applications to IISc, IIT Bombay, IIT Madras',
      'Attend technical interviews / written tests for MS (Research) seats',
      'Accept offer rounds on COAP portal'
    ],
    officialPortal: 'https://coap.iitk.ac.in/'
  },
  {
    id: 'pathway-global-ms-phd',
    title: 'MS / PhD in Core Engineering at Top Global Universities (USA, Germany, UK)',
    category: 'International (MS/PhD)',
    targetBranch: ['ECE', 'EEE', 'MECH', 'CIVIL'],
    institutions: ['TU Munich (Germany)', 'RWTH Aachen (Germany)', 'Stanford University (USA)', 'Purdue University (USA)', 'Imperial College London (UK)'],
    entranceExams: ['GRE (Graduate Record Exam)', 'TOEFL / IELTS', 'GATE (Accepted at TU Munich & NTU Singapore)'],
    eligibility: 'B.Tech with minimum 7.5 CGPA, Statement of Purpose (SOP), 3 Letters of Recommendation (LOR).',
    fundingAndStipend: 'Full tuition waiver + $2,200-$3,200/month Research/Teaching Assistantships (RA/TA) for PhD and MS Thesis.',
    applicationDeadline: 'December - January (Fall Intake)',
    keySteps: [
      'Shortlist target universities based on research publications and faculty labs',
      'Take GRE and TOEFL/IELTS language proficiency tests',
      'Prepare Statement of Purpose (SOP) tailored to specific research domains',
      'Secure 3 LORs from academic professors or industry project leads',
      'Submit online university applications and DAAD / Fulbright funding applications'
    ],
    officialPortal: 'https://www.daad.de/en/'
  }
];

// Research Opportunities Dataset
export const RESEARCH_OPPORTUNITIES: ResearchOpportunity[] = [
  {
    id: 'research-ece-vlsi',
    branch: 'ECE',
    domain: 'VLSI & Edge AI Acceleration',
    title: 'Energy-Efficient Neuromorphic Computing & RISC-V Accelerator Hardware Design',
    labName: 'Integrated Systems Laboratory & Open-Source Microelectronics',
    institution: 'IIT Bombay & Semiconductor Research Corporation',
    description: 'Investigating low-power Spiking Neural Network (SNN) hardware accelerators in 28nm CMOS and RISC-V custom vector extension hardware implementation.',
    keyResearchQuestions: [
      'How to optimize SRAM in-memory computing for AI matrix multiplication without accuracy drop?',
      'Designing asynchronous handshaking protocols for ultra-low energy spike communication.'
    ],
    topConferencesAndJournals: [
      'IEEE International Solid-State Circuits Conference (ISSCC)',
      'Design Automation Conference (DAC)',
      'IEEE Transactions on Very Large Scale Integration (TVLSI)'
    ],
    recommendedPreparation: [
      'Verilog / SystemVerilog RTL design fluency',
      'Static Timing Analysis in Synopsys/Xilinx tools',
      'CMOS Analog & Digital IC Design fundamentals'
    ],
    opportunityType: 'PhD/MS Thesis Topic',
    contactInfo: 'vlsi-research@iitb.ac.in'
  },
  {
    id: 'research-eee-smartgrid',
    branch: 'EEE',
    domain: 'Smart Grid & Renewable Integration',
    title: 'Grid-Forming Inverter Control for High-Penetration Solar Microgrids',
    labName: 'Power Electronics & Renewable Energy Research Center',
    institution: 'IISc Bangalore & SERI',
    description: 'Developing virtual synchronous generator (VSG) control algorithms for 3-phase grid-forming inverters to maintain frequency stability in zero-inertia renewable grids.',
    keyResearchQuestions: [
      'Mitigating transient overcurrents in grid-forming inverters under asymmetrical grid faults.',
      'Distributed droop control for multi-inverter parallel operation without communication lines.'
    ],
    topConferencesAndJournals: [
      'IEEE Transactions on Power Electronics (TPEL)',
      'IEEE Transactions on Smart Grid (TSG)',
      'IEEE Energy Conversion Congress and Exposition (ECCE)'
    ],
    recommendedPreparation: [
      'MATLAB Simulink Power Systems Toolbox',
      'Space Vector PWM & Digital Control Theory',
      'Hardware-in-the-Loop (HIL) Real-Time Simulation'
    ],
    opportunityType: 'Research Internship',
    contactInfo: 'power-grid-lab@iisc.ac.in'
  }
];

// Core Companies Directory Dataset
export const CORE_COMPANIES_DIRECTORY: CoreCompany[] = [
  {
    id: 'company-ti',
    name: 'Texas Instruments (TI)',
    branches: ['ECE', 'EEE'],
    domains: ['Embedded Systems', 'Analog IC Design', 'Power Management', 'Digital Signal Processing'],
    companyType: 'MNC',
    rolesHired: ['Analog Design Engineer', 'Embedded Software Engineer', 'Applications Engineer', 'Systems Engineer'],
    skillsRequired: ['Op-Amp & Feedback Design', 'Embedded C', 'ARM Architecture', 'LTspice / SPICE Simulation'],
    recruitmentProcess: ['Online Technical Assessment (Circuit Theory & C Coding)', 'Round 1 Technical Interview (Analog & Microcontrollers)', 'Round 2 Managerial & System Design Round'],
    officialCareerUrl: 'https://careers.ti.com/',
    internshipOffered: true
  },
  {
    id: 'company-bosch',
    name: 'Robert Bosch Engineering (RBEI)',
    branches: ['ECE', 'EEE', 'MECH'],
    domains: ['Automotive ECU', 'Embedded Systems', 'Electric Vehicle Powertrain', 'Sensor Fusion'],
    companyType: 'MNC',
    rolesHired: ['Automotive Embedded Firmware Engineer', 'CAN Bus Integration Specialist', 'EV Powertrain Engineer'],
    skillsRequired: ['Embedded C', 'CAN / LIN Protocol', 'AUTOSAR Architecture', 'FreeRTOS / RTOS'],
    recruitmentProcess: ['Online Aptitude & C/C++ Test', 'Domain Technical Interview', 'HR & Cultural Fit Round'],
    officialCareerUrl: 'https://www.bosch.in/careers/',
    internshipOffered: true
  },
  {
    id: 'company-isro',
    name: 'ISRO (Indian Space Research Organisation)',
    branches: ['ECE', 'EEE', 'MECH', 'CIVIL'],
    domains: ['Satellite Payload', 'RF Communications', 'Rocket Propulsion', 'Launchpad Civil Infrastructure'],
    companyType: 'PSU / Govt',
    rolesHired: ['Scientist / Engineer - SD', 'Technical Officer'],
    skillsRequired: ['Electromagnetics & Antennas', 'Rocket Thermal Dynamics', 'Structural Mechanics', 'Control Systems'],
    recruitmentProcess: ['ISRO Centralised Recruitment Board (ICRB) Written Exam', 'In-Person Expert Panel Technical Interview'],
    officialCareerUrl: 'https://www.isro.gov.in/Careers.html',
    internshipOffered: true
  }
];

// Technical Interview QA Dataset
export const TECHNICAL_INTERVIEW_QA: TechnicalInterviewQA[] = [
  {
    id: 'qa-ece-1',
    branch: 'ECE',
    subject: 'Embedded Systems & Microcontrollers',
    question: 'What is the difference between a Mutex and a Counting Semaphore in an RTOS?',
    answer: 'A Mutex (Mutual Exclusion object) includes ownership and priority inheritance to prevent priority inversion. Only the thread that locks the Mutex can unlock it. A Semaphore does NOT have ownership; any task or interrupt service routine (ISR) can signal or release a semaphore, making semaphores ideal for event synchronization, whereas Mutexes are for resource locking.',
    difficulty: 'Intermediate'
  },
  {
    id: 'qa-ece-2',
    branch: 'ECE',
    subject: 'VLSI & Digital Logic',
    question: 'Define Setup Time and Hold Time in Flip-Flops. What happens if Setup Time is violated?',
    answer: 'Setup Time is the minimum time data must be stable BEFORE the clock edge. Hold Time is the minimum time data must remain stable AFTER the clock edge. If setup or hold time is violated, the flip-flop enters a metastable state where its output oscillates unpredictably before settling to 0 or 1, potentially causing system failure.',
    difficulty: 'Basic'
  },
  {
    id: 'qa-eee-1',
    branch: 'EEE',
    subject: 'Power Electronics',
    question: 'Why is a freewheeling diode connected across an inductive load in a converter?',
    answer: 'An inductive load resists sudden changes in current (V = L * di/dt). When the main semiconductor switch (MOSFET/IGBT) turns off, the stored magnetic energy in the inductor creates a high reverse voltage spike that can destroy the switch. The freewheeling diode provides a continuous closed path for the inductive current to decay safely.',
    difficulty: 'Basic'
  }
];
