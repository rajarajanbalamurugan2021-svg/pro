import React, { useState, useEffect } from 'react';
import { 
  MentorAssignment, 
  MeetingSchedule, 
  UserRole,
  MentoringSessionRequest,
  MentoringGoal,
  MentoringTask,
  MentoringPrivateNote,
  MentoringFeedback,
  MentoringAlert,
  MentorCoreSkillTracking,
  MentorGATETracking,
  MentorHigherStudiesTracking,
  MentoringSystemConfig
} from '../../../types';
import { CampusStorage } from '../../../services/api';
import { normalizeRole } from '../../../lib/rbac';
import {
  UserCheck2,
  Users,
  User,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  MessageSquare,
  Award,
  BookOpen,
  TrendingUp,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Target,
  Cpu,
  GraduationCap,
  Search,
  Filter,
  Check,
  X,
  Lock,
  Unlock,
  ExternalLink,
  Sparkles,
  BarChart3,
  Building2,
  Download,
  Settings,
  Send,
  AlertCircle,
  Wrench,
  CheckSquare,
  Square
} from 'lucide-react';

interface MentorMenteePortalProps {
  assignments: MentorAssignment[];
  meetings: MeetingSchedule[];
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onAddMeeting: (meeting: MeetingSchedule) => void;
  onNavigateToModule?: (moduleName: string) => void;
}

export const MentorMenteePortal: React.FC<MentorMenteePortalProps> = ({
  assignments: initialAssignments,
  meetings: initialMeetings,
  userRole,
  currentUserId,
  currentUserName,
  onAddMeeting,
  onNavigateToModule
}) => {
  const normRole = normalizeRole(userRole);

  // Persistence State
  const [assignments, setAssignments] = useState<MentorAssignment[]>(() => {
    const saved = CampusStorage.getMentorAssignments();
    return saved.length > 0 ? saved : initialAssignments;
  });

  const [meetings, setMeetings] = useState<MeetingSchedule[]>(() => {
    const saved = CampusStorage.getMeetings();
    return saved.length > 0 ? saved : initialMeetings;
  });

  const [requests, setRequests] = useState<MentoringSessionRequest[]>(() => 
    CampusStorage.getMentoringRequests()
  );

  const [goals, setGoals] = useState<MentoringGoal[]>(() => 
    CampusStorage.getMentoringGoals()
  );

  const [tasks, setTasks] = useState<MentoringTask[]>(() => 
    CampusStorage.getMentoringTasks()
  );

  const [privateNotes, setPrivateNotes] = useState<MentoringPrivateNote[]>(() => 
    CampusStorage.getMentoringNotes()
  );

  const [feedbacks, setFeedbacks] = useState<MentoringFeedback[]>(() => 
    CampusStorage.getMentoringFeedback()
  );

  const [alerts, setAlerts] = useState<MentoringAlert[]>(() => 
    CampusStorage.getMentoringAlerts()
  );

  const [systemConfig, setSystemConfig] = useState<MentoringSystemConfig>({
    lowCgpaThreshold: 7.5,
    lowAttendanceThreshold: 75,
    enableAutoAlerts: true,
    requireMeetingSummary: true,
    maxMenteesPerFaculty: 20
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'mentees' | 'requests' | 'goals' | 'notes' | 'meetings' | 'alerts' | 'management' | 'config'>('mentees');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Modals
  const [selectedMentee, setSelectedMentee] = useState<MentorAssignment | null>(null);
  const [menteeProfileTab, setMenteeProfileTab] = useState<'academic' | 'core' | 'career' | 'gate' | 'higher'>('academic');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showMeetingSummaryModal, setShowMeetingSummaryModal] = useState<MeetingSchedule | null>(null);
  const [showAssignMentorModal, setShowAssignMentorModal] = useState(false);

  // Sync state to CampusStorage
  useEffect(() => { CampusStorage.saveMentorAssignments(assignments); }, [assignments]);
  useEffect(() => { CampusStorage.saveMeetings(meetings); }, [meetings]);
  useEffect(() => { CampusStorage.saveMentoringRequests(requests); }, [requests]);
  useEffect(() => { CampusStorage.saveMentoringGoals(goals); }, [goals]);
  useEffect(() => { CampusStorage.saveMentoringTasks(tasks); }, [tasks]);
  useEffect(() => { CampusStorage.saveMentoringNotes(privateNotes); }, [privateNotes]);
  useEffect(() => { CampusStorage.saveMentoringFeedback(feedbacks); }, [feedbacks]);
  useEffect(() => { CampusStorage.saveMentoringAlerts(alerts); }, [alerts]);

  // Form States
  // 1. Schedule Meeting Form
  const [meetStudentId, setMeetStudentId] = useState(assignments[0]?.studentId || 'u-student-1');
  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetTime, setMeetTime] = useState('03:00 PM');
  const [meetLocation, setMeetLocation] = useState('Faculty Cabin 204');
  const [meetType, setMeetType] = useState<MeetingSchedule['meetingType']>('ONE_TO_ONE');
  const [meetIsOnline, setMeetIsOnline] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const [meetAgenda, setMeetAgenda] = useState('');

  // 2. Student Request Form
  const [reqType, setReqType] = useState<MentoringSessionRequest['requestType']>('Academic Guidance');
  const [reqSubject, setReqSubject] = useState('');
  const [reqPrefDate, setReqPrefDate] = useState(new Date().toISOString().split('T')[0]);
  const [reqPrefTime, setReqPrefTime] = useState('10:30 AM');
  const [reqReason, setReqReason] = useState('');
  const [reqPriority, setReqPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');

  // 3. Goal & Task Form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalCategory, setGoalCategory] = useState<MentoringGoal['category']>('ACADEMIC');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalPriority, setGoalPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [goalStudentId, setGoalStudentId] = useState('');

  // 4. Note Form
  const [noteCategory, setNoteCategory] = useState<MentoringPrivateNote['category']>('Academic');
  const [noteText, setNoteText] = useState('');
  const [noteFollowUp, setNoteFollowUp] = useState(false);
  const [noteFollowUpDate, setNoteFollowUpDate] = useState('');
  const [noteIsShareable, setNoteIsShareable] = useState(false);
  const [noteStudentId, setNoteStudentId] = useState('');

  // 5. Feedback Form
  const [fbText, setFbText] = useState('');
  const [fbStrengths, setFbStrengths] = useState('');
  const [fbImprovements, setFbImprovements] = useState('');
  const [fbAction, setFbAction] = useState('');
  const [fbStudentId, setFbStudentId] = useState('');

  // 6. Summary Form
  const [sumNotes, setSumNotes] = useState('');
  const [sumActions, setSumActions] = useState('');

  // Calculate Status Tag
  const getCalculatedStatus = (cgpa: number, attendance: number) => {
    if (cgpa < systemConfig.lowCgpaThreshold || attendance < systemConfig.lowAttendanceThreshold) {
      return 'NEEDS ATTENTION';
    }
    if (cgpa >= 8.5 && attendance >= 90) return 'GOOD STANDING';
    if (cgpa >= 7.5 && attendance >= 80) return 'IMPROVING';
    return 'GOOD STANDING';
  };

  // Student specific data filter
  const myAssignedMentor = assignments.find(a => a.studentId === currentUserId) || assignments[0];
  const myGoals = goals.filter(g => normRole === 'student' ? g.studentId === currentUserId : true);
  const myTasks = tasks.filter(t => normRole === 'student' ? t.studentId === currentUserId : true);
  const myRequests = requests.filter(r => normRole === 'student' ? r.studentId === currentUserId : true);
  const myMeetings = meetings.filter(m => normRole === 'student' ? m.studentId === currentUserId : m.mentorId === currentUserId);
  const myFeedbacks = feedbacks.filter(f => normRole === 'student' ? f.studentId === currentUserId : true);

  // Visible Private Notes (STRICT PRIVACY ENFORCEMENT)
  const visiblePrivateNotes = privateNotes.filter(n => {
    if (normRole === 'student') {
      // Students ONLY see notes if isShareable is explicitly true AND belongs to them
      return n.studentId === currentUserId && n.isShareable === true;
    }
    return true; // Faculty/Admin/SuperAdmin see all notes
  });

  // Handlers
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetTitle || !meetAgenda) return;

    const assignedStud = assignments.find((a) => a.studentId === meetStudentId);

    const newMeeting: MeetingSchedule = {
      id: `meet-${Date.now()}`,
      mentorId: currentUserId,
      mentorName: currentUserName,
      studentId: meetStudentId,
      studentName: assignedStud?.studentName || 'Student Mentee',
      title: meetTitle,
      date: meetDate,
      time: meetTime,
      location: meetIsOnline ? 'Online Video Call' : meetLocation,
      meetingType: meetType,
      isOnline: meetIsOnline,
      meetingLink: meetLink,
      agenda: meetAgenda,
      status: 'Scheduled',
      createdAt: new Date().toISOString()
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    onAddMeeting(newMeeting);
    setShowScheduleModal(false);
    setMeetTitle('');
    setMeetAgenda('');
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqSubject || !reqReason) return;

    const newReq: MentoringSessionRequest = {
      id: `req-${Date.now()}`,
      studentId: currentUserId,
      studentName: currentUserName,
      mentorId: myAssignedMentor?.mentorId || 'u-faculty-1',
      mentorName: myAssignedMentor?.mentorName || 'Prof. Robert Thorne',
      requestType: reqType,
      subject: reqSubject,
      preferredDate: reqPrefDate,
      preferredTime: reqPrefTime,
      reason: reqReason,
      description: reqReason,
      priority: reqPriority,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRequests([newReq, ...requests]);
    setShowRequestModal(false);
    setReqSubject('');
    setReqReason('');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudentId = goalStudentId || selectedMentee?.studentId || assignments[0]?.studentId;
    const targetStudent = assignments.find(a => a.studentId === targetStudentId);

    const newGoal: MentoringGoal = {
      id: `goal-${Date.now()}`,
      mentorId: currentUserId,
      studentId: targetStudentId,
      studentName: targetStudent?.studentName,
      title: goalTitle,
      description: goalDesc,
      category: goalCategory,
      targetDate: goalTargetDate || '2026-10-30',
      priority: goalPriority,
      progressPercentage: 0,
      status: 'NOT_STARTED',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setGoals([newGoal, ...goals]);
    setShowAddGoalModal(false);
    setGoalTitle('');
    setGoalDesc('');
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudentId = noteStudentId || selectedMentee?.studentId || assignments[0]?.studentId;

    const newNote: MentoringPrivateNote = {
      id: `note-${Date.now()}`,
      mentorId: currentUserId,
      studentId: targetStudentId,
      date: new Date().toISOString().split('T')[0],
      category: noteCategory,
      note: noteText,
      followUpRequired: noteFollowUp,
      followUpDate: noteFollowUpDate,
      isShareable: noteIsShareable, // Default false - NEVER shared unless checked
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPrivateNotes([newNote, ...privateNotes]);
    setShowAddNoteModal(false);
    setNoteText('');
  };

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStudentId = fbStudentId || selectedMentee?.studentId || assignments[0]?.studentId;

    const newFb: MentoringFeedback = {
      id: `fb-${Date.now()}`,
      mentorId: currentUserId,
      studentId: targetStudentId,
      feedback: fbText,
      strengths: fbStrengths.split(',').map(s => s.trim()).filter(Boolean),
      areasForImprovement: fbImprovements.split(',').map(s => s.trim()).filter(Boolean),
      recommendedAction: fbAction,
      reviewDate: new Date().toISOString().split('T')[0],
      acknowledgedByStudent: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setFeedbacks([newFb, ...feedbacks]);
    setShowFeedbackModal(false);
    setFbText('');
    setFbStrengths('');
    setFbImprovements('');
    setFbAction('');
  };

  const handleAcknowledgeFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(f => f.id === feedbackId ? {
      ...f,
      acknowledgedByStudent: true,
      acknowledgedAt: new Date().toISOString().split('T')[0]
    } : f));
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const next = !t.studentCompletion;
        return {
          ...t,
          studentCompletion: next,
          status: next ? 'COMPLETED' : 'IN_PROGRESS',
          completedAt: next ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return t;
    }));
  };

  const handleUpdateRequestStatus = (reqId: string, status: MentoringSessionRequest['status']) => {
    setRequests(requests.map(r => r.id === reqId ? { ...r, status } : r));
  };

  const handleSaveMeetingSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMeetingSummaryModal) return;

    setMeetings(meetings.map(m => m.id === showMeetingSummaryModal.id ? {
      ...m,
      status: 'Completed',
      summary: sumNotes,
      actionItems: sumActions.split('\n').filter(Boolean),
      notes: sumNotes
    } : m));

    setShowMeetingSummaryModal(null);
    setSumNotes('');
    setSumActions('');
  };

  // Filtered Mentees List
  const filteredAssignments = assignments.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.department.toLowerCase().includes(searchTerm.toLowerCase());
    const status = a.academicStatus || getCalculatedStatus(a.cgpa, a.attendancePercentage);
    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            <UserCheck2 className="h-4 w-4 text-emerald-300" /> Institutional Advisory & Mentoring Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 flex items-center gap-3">
            Mentor–Mentee Hub
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-white/10 border border-white/20 text-indigo-100">
              {normRole === 'student' ? 'Student View' : normRole === 'faculty' ? 'Faculty Mentor View' : normRole === 'admin' ? 'Admin Management View' : 'Super Admin Config View'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl">
            {normRole === 'student' 
              ? 'Connect with your assigned faculty mentor, request guidance sessions, track your core engineering goals, and view personalized academic advice.'
              : 'Track mentee performance, schedule 1-on-1 advisory sessions, manage private advisory notes, set core goals, and send early warning alerts.'
            }
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {normRole === 'student' ? (
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs font-extrabold hover:bg-indigo-50 transition shadow-md"
            >
              <Plus className="h-4 w-4" /> Request Advisory Session
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs font-extrabold hover:bg-indigo-50 transition shadow-md"
              >
                <Plus className="h-4 w-4" /> Schedule Advisory Session
              </button>
              <button
                onClick={() => setShowAddGoalModal(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white text-xs font-bold border border-white/20 transition"
              >
                <Target className="h-4 w-4" /> Assign Goal
              </button>
            </>
          )}
        </div>
      </div>

      {/* FACULTY / ADMIN DASHBOARD STATS KPI ROW */}
      {normRole !== 'student' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-indigo-500" /> Total Mentees
            </span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{assignments.length}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Active Cohort</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Needs Attention
            </span>
            <div className="text-xl font-extrabold text-amber-600">
              {assignments.filter(a => a.cgpa < systemConfig.lowCgpaThreshold || a.attendancePercentage < systemConfig.lowAttendanceThreshold).length}
            </div>
            <span className="text-[10px] text-amber-600 font-medium">&lt;7.5 CGPA or &lt;75% Attd</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-500" /> Avg CGPA
            </span>
            <div className="text-xl font-extrabold text-emerald-600">
              {(assignments.reduce((acc, a) => acc + a.cgpa, 0) / (assignments.length || 1)).toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-400">Target ≥ 8.00</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-blue-500" /> Avg Attendance
            </span>
            <div className="text-xl font-extrabold text-blue-600">
              {(assignments.reduce((acc, a) => acc + a.attendancePercentage, 0) / (assignments.length || 1)).toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-400">Min Req: 75.0%</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-purple-500" /> Scheduled Sessions
            </span>
            <div className="text-xl font-extrabold text-purple-600">{meetings.length}</div>
            <span className="text-[10px] text-purple-600 font-medium">1-on-1 & Reviews</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-rose-500" /> Pending Requests
            </span>
            <div className="text-xl font-extrabold text-rose-600">
              {requests.filter(r => r.status === 'PENDING').length}
            </div>
            <span className="text-[10px] text-rose-600 font-medium">Require Response</span>
          </div>
        </div>
      )}

      {/* STUDENT MY MENTOR CARD (FOR STUDENT ROLE) */}
      {normRole === 'student' && myAssignedMentor && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                {myAssignedMentor.mentorName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Assigned Faculty Mentor
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {myAssignedMentor.mentorName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {myAssignedMentor.mentorDesignation || 'Professor & Academic Advisory Lead'} • {myAssignedMentor.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="h-3.5 w-3.5" /> Book 1-on-1 Session
              </button>
              {onNavigateToModule && (
                <button
                  onClick={() => onNavigateToModule('community')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-500" /> Message Mentor
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Cabin / Office Location</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Faculty Cabin #204</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Contact Email</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{myAssignedMentor.mentorEmail || 'r.thorne@university.edu'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">My Current CGPA</span>
              <span className="font-extrabold text-emerald-600">{myAssignedMentor.cgpa} / 10.0</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">My Attendance</span>
              <span className="font-extrabold text-blue-600">{myAssignedMentor.attendancePercentage}%</span>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('mentees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'mentees' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" /> {normRole === 'student' ? 'My Overview' : 'Student Mentees'}
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'meetings' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" /> Advisory Meetings ({myMeetings.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'requests' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" /> Session Requests
          {myRequests.filter(r => r.status === 'PENDING').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
              {myRequests.filter(r => r.status === 'PENDING').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'goals' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="h-4 w-4" /> Goals & Action Tasks ({myGoals.length})
        </button>

        {normRole !== 'student' && (
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'notes' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="h-4 w-4 text-amber-400" /> Private Mentor Notes ({visiblePrivateNotes.length})
          </button>
        )}

        {normRole !== 'student' && (
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'alerts' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-rose-500" /> At-Risk Early Warnings ({alerts.filter(a => a.status === 'OPEN').length})
          </button>
        )}

        {(normRole === 'admin' || normRole === 'super_admin') && (
          <button
            onClick={() => setActiveTab('management')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'management' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="h-4 w-4" /> Mentoring Management
          </button>
        )}

        {normRole === 'super_admin' && (
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'config' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="h-4 w-4" /> Config
          </button>
        )}
      </div>

      {/* TAB CONTENT 1: MENTEES LIST / STUDENT OVERVIEW */}
      {activeTab === 'mentees' && (
        <div className="space-y-4">
          
          {normRole !== 'student' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mentees by name or roll..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" /> Status:
                </span>
                {['ALL', 'GOOD STANDING', 'NEEDS ATTENTION', 'IMPROVING'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MENTEE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.map((m) => {
              const statusTag = m.academicStatus || getCalculatedStatus(m.cgpa, m.attendancePercentage);
              const isNeedsAttention = statusTag === 'NEEDS ATTENTION' || statusTag === 'AT RISK';

              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4 transition hover:shadow-md ${
                    isNeedsAttention 
                      ? 'border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-400/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {m.studentName}
                        {isNeedsAttention && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-0.5">
                            <AlertTriangle className="h-3 w-3" /> Needs Attention
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{m.rollNumber} • {m.department}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                      Sem {m.semester}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Current CGPA</span>
                      <span className={`text-base font-extrabold ${m.cgpa >= 8.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {m.cgpa} / 10.0
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Attendance %</span>
                      <span className={`text-base font-extrabold ${m.attendancePercentage >= 75 ? 'text-blue-600' : 'text-rose-600'}`}>
                        {m.attendancePercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Last Meeting: {m.lastMeetingDate}</span>
                    <button
                      onClick={() => { setSelectedMentee(m); setMenteeProfileTab('academic'); }}
                      className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline flex items-center gap-1"
                    >
                      View Mentee Profile &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ADVISORY MEETINGS */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-500" /> Scheduled Mentorship Advisory Sessions
            </h2>
            {normRole !== 'student' && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> New Meeting
              </button>
            )}
          </div>

          <div className="space-y-3">
            {myMeetings.map((meet) => (
              <div
                key={meet.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {meet.meetingType || 'ONE_TO_ONE'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{meet.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      meet.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {meet.status}
                    </span>

                    {normRole !== 'student' && meet.status !== 'Completed' && (
                      <button
                        onClick={() => setShowMeetingSummaryModal(meet)}
                        className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100"
                      >
                        Record Summary
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <strong className="text-slate-700 dark:text-slate-300">Agenda:</strong> {meet.agenda}
                </p>

                {meet.summary && (
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 text-xs space-y-1">
                    <span className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Discussion Summary & Action Items:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">{meet.summary}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-indigo-500" /> {meet.date} at {meet.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-rose-500" /> {meet.location}</span>
                    {meet.isOnline && meet.meetingLink && (
                      <a href={meet.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" /> Join Link
                      </a>
                    )}
                  </div>

                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Mentee: {meet.studentName} • Mentor: {meet.mentorName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SESSION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" /> Mentoring Advisory Session Requests
            </h2>
            {normRole === 'student' && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Submit New Request
              </button>
            )}
          </div>

          <div className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      {req.requestType}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{req.subject}</h3>
                    <p className="text-xs text-slate-400">Requested by: {req.studentName} • Preferred Date: {req.preferredDate} at {req.preferredTime}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {req.status}
                    </span>

                    {normRole !== 'student' && req.status === 'PENDING' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'ACCEPTED')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateRequestStatus(req.id, 'CANCELLED')}
                          className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold hover:bg-rose-200"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {req.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: GOALS & ACTION TASKS */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          
          {/* GOALS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" /> Assigned Mentoring Goals
              </h2>
              {normRole !== 'student' && (
                <button
                  onClick={() => setShowAddGoalModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Assign New Goal
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myGoals.map((g) => (
                <div
                  key={g.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      {g.category}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Target: {g.targetDate}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{g.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{g.description}</p>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">Progress</span>
                      <span className="font-extrabold text-indigo-600">{g.progressPercentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" 
                        style={{ width: `${g.progressPercentage}%` }} 
                      />
                    </div>
                  </div>

                  {g.mentorRemarks && (
                    <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 italic">
                      &ldquo;{g.mentorRemarks}&rdquo; — Mentor Remark
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ACTION PLAN TASKS SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-500" /> Action Plan Task Checklists
            </h2>

            <div className="space-y-2">
              {myTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    t.studentCompletion 
                      ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800' 
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {t.studentCompletion ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs font-bold ${t.studentCompletion ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {t.task}
                      </p>
                      <span className="text-[10px] text-slate-400">Due: {t.dueDate} • Priority: {t.priority}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.studentCompletion ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.studentCompletion ? 'COMPLETED' : 'IN PROGRESS'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: PRIVATE MENTOR NOTES */}
      {activeTab === 'notes' && normRole !== 'student' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-500" /> Confidential Faculty Advisory Notes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Strict Privacy Enforced: Notes are hidden from students unless explicitly marked as Shareable.
              </p>
            </div>

            <button
              onClick={() => setShowAddNoteModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Private Note
            </button>
          </div>

          <div className="space-y-3">
            {visiblePrivateNotes.map((n) => (
              <div
                key={n.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {n.category}
                    </span>
                    {n.isShareable ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Unlock className="h-3 w-3" /> Shared with Student
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-amber-500" /> Strictly Private
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 font-mono">{n.date}</span>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {n.note}
                </p>

                {n.followUpRequired && (
                  <div className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Follow-up scheduled for: {n.followUpDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: AT-RISK EARLY WARNING ALERTS */}
      {activeTab === 'alerts' && normRole !== 'student' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" /> Early Warning & At-Risk Mentee Alerts
            </h2>
          </div>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white">
                      {alt.severity} SEVERITY
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{alt.studentName}</h3>
                  </div>

                  <span className="text-xs font-bold text-amber-600">{alt.status}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {alt.reason}
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 text-xs">
                  <strong className="text-indigo-600 dark:text-indigo-400">Recommended Action:</strong> {alt.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: ADMIN MANAGEMENT VIEW */}
      {activeTab === 'management' && (normRole === 'admin' || normRole === 'super_admin') && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" /> Department Mentorship Workload & Allocation
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Assign faculty mentors to students and monitor workload balances across departments.</p>
            </div>

            <button
              onClick={() => setShowAssignMentorModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
            >
              Assign Mentor &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Computer Science</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">12 Faculty • 180 Mentees</div>
              <span className="text-[10px] text-emerald-600 font-bold">15 Mentees/Faculty Avg</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Mechanical Eng</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">8 Faculty • 110 Mentees</div>
              <span className="text-[10px] text-emerald-600 font-bold">13.7 Mentees/Faculty Avg</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">Electrical Eng</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">10 Faculty • 140 Mentees</div>
              <span className="text-[10px] text-emerald-600 font-bold">14 Mentees/Faculty Avg</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: SUPER ADMIN SYSTEM CONFIG */}
      {activeTab === 'config' && normRole === 'super_admin' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-2xl">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600" /> Mentoring System Global Parameters
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Low CGPA Alert Threshold</label>
              <input
                type="number"
                step="0.1"
                value={systemConfig.lowCgpaThreshold}
                onChange={(e) => setSystemConfig({ ...systemConfig, lowCgpaThreshold: parseFloat(e.target.value) || 7.0 })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Low Attendance Alert Threshold (%)</label>
              <input
                type="number"
                value={systemConfig.lowAttendanceThreshold}
                onChange={(e) => setSystemConfig({ ...systemConfig, lowAttendanceThreshold: parseInt(e.target.value) || 75 })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Max Mentees Per Faculty Member</label>
              <input
                type="number"
                value={systemConfig.maxMenteesPerFaculty}
                onChange={(e) => setSystemConfig({ ...systemConfig, maxMenteesPerFaculty: parseInt(e.target.value) || 20 })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => alert('Mentoring thresholds successfully updated across the system.')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: DETAILED MENTEE PROFILE (5 TABS) */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Detailed Mentee Advisory Profile
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                  {selectedMentee.studentName}
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    {selectedMentee.rollNumber}
                  </span>
                </h2>
              </div>

              <button
                onClick={() => setSelectedMentee(null)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile 5-Tab Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              {[
                { id: 'academic', label: '1. Academic Progress', icon: BookOpen },
                { id: 'core', label: '2. Core Engineering', icon: Cpu },
                { id: 'career', label: '3. Career & Placement', icon: Award },
                { id: 'gate', label: '4. GATE Prep', icon: Target },
                { id: 'higher', label: '5. Higher Studies', icon: GraduationCap }
              ].map((tb) => {
                const Icon = tb.icon;
                return (
                  <button
                    key={tb.id}
                    onClick={() => setMenteeProfileTab(tb.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      menteeProfileTab === tb.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {tb.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ACADEMIC PROGRESS */}
            {menteeProfileTab === 'academic' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Semester CGPA</span>
                    <span className="text-lg font-extrabold text-emerald-600">{selectedMentee.cgpa} / 10.0</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Attendance %</span>
                    <span className="text-lg font-extrabold text-blue-600">{selectedMentee.attendancePercentage}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Current Semester</span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-slate-200">Sem {selectedMentee.semester}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Academic Standing</span>
                    <span className="text-lg font-extrabold text-purple-600">{selectedMentee.academicStatus || 'Good Standing'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px]">Semester GPA Trajectory</h4>
                  <div className="grid grid-cols-6 gap-2 text-center">
                    {['Sem 1: 8.4', 'Sem 2: 8.6', 'Sem 3: 8.8', 'Sem 4: 8.7', 'Sem 5: 8.9', 'Sem 6: 8.72'].map((s, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-indigo-600 dark:text-indigo-400">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CORE ENGINEERING */}
            {menteeProfileTab === 'core' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-indigo-500" /> Core Engineering & Software Tools Matrix
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: 'Embedded C++ & Microcontrollers', category: 'Core Skill', status: 'COMPETENT' },
                      { name: 'MATLAB / Simulink', category: 'Software Tool', status: 'LEARNING' },
                      { name: 'Data Structures & Algorithms', category: 'Core Skill', status: 'COMPETENT' },
                      { name: 'Proteus Circuit Simulator', category: 'Simulation Tool', status: 'PRACTICING' }
                    ].map((sk, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">{sk.category}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{sk.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {sk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CAREER & PLACEMENT */}
            {menteeProfileTab === 'career' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" /> Target Job Role & Placement Preparation
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Target Role: <strong className="text-slate-900 dark:text-white">Software Development Engineer / Cloud Architect</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Preferred Industry: <strong className="text-slate-900 dark:text-white">Enterprise Software & Product Companies (Zoho, Google, AWS)</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Internship Status: <strong className="text-emerald-600">Shortlisted for Summer 2027 R&D Internship</strong>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: GATE PREP */}
            {menteeProfileTab === 'gate' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" /> GATE Examination Prep Roadmap
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Target GATE Paper</span>
                      <span className="font-bold text-slate-900 dark:text-white">CS (Computer Science)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">PYQs Solved</span>
                      <span className="font-bold text-emerald-600">420+ Questions</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Latest Mock Score</span>
                      <span className="font-bold text-indigo-600">68.5 / 100</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Score</span>
                      <span className="font-bold text-purple-600">82.0+ AIR &lt; 500</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HIGHER STUDIES */}
            {menteeProfileTab === 'higher' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-500" /> Higher Studies & Research Aspirations
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Degree Target: <strong className="text-slate-900 dark:text-white">M.Tech / MS in Distributed Systems & AI</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Target Institutions: <strong className="text-slate-900 dark:text-white">IIT Madras, IISc Bangalore, NUS Singapore</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { setSelectedMentee(null); setShowAddNoteModal(true); }}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                + Add Confidential Note
              </button>
              <button
                onClick={() => { setSelectedMentee(null); setShowScheduleModal(true); }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
              >
                Schedule Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE MEETING */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" /> Schedule Advisory Session
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Student Mentee</label>
                <select
                  value={meetStudentId}
                  onChange={(e) => setMeetStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  {assignments.map((a) => (
                    <option key={a.studentId} value={a.studentId}>
                      {a.studentName} ({a.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={meetTitle}
                  onChange={(e) => setMeetTitle(e.target.value)}
                  placeholder="e.g. 6th Semester Progress Review & Internship Guidance"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={meetDate}
                    onChange={(e) => setMeetDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={meetTime}
                    onChange={(e) => setMeetTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="onlineCheck"
                  checked={meetIsOnline}
                  onChange={(e) => setMeetIsOnline(e.target.checked)}
                />
                <label htmlFor="onlineCheck" className="font-bold text-slate-700 dark:text-slate-300">Online Google Meet Session</label>
              </div>

              {meetIsOnline ? (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Google Meet Link</label>
                  <input
                    type="url"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/xyz-abc-123"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={meetLocation}
                    onChange={(e) => setMeetLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Agenda / Discussion Points *</label>
                <textarea
                  required
                  rows={3}
                  value={meetAgenda}
                  onChange={(e) => setMeetAgenda(e.target.value)}
                  placeholder="Outline topics for academic review, career advice, capstone project..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                  Confirm Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STUDENT SESSION REQUEST */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" /> Request Advisory Session
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guidance Category</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  {['Academic Guidance', 'Attendance Issue', 'GATE Guidance', 'Core Engineering Guidance', 'Project Guidance', 'Internship Guidance', 'Career Guidance', 'Higher Studies', 'Personal Academic Concern'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject / Topic *</label>
                <input
                  type="text"
                  required
                  value={reqSubject}
                  onChange={(e) => setReqSubject(e.target.value)}
                  placeholder="e.g. 6th Semester Elective Selection & Research Project Advice"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={reqPrefDate}
                    onChange={(e) => setReqPrefDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={reqPrefTime}
                    onChange={(e) => setReqPrefTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason & Background Details *</label>
                <textarea
                  required
                  rows={3}
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="Explain what specific advice or help you need from your mentor..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ASSIGN GOAL */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-600" /> Assign Mentoring Goal
              </h3>
              <button onClick={() => setShowAddGoalModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Student Mentee</label>
                <select
                  value={goalStudentId}
                  onChange={(e) => setGoalStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  {assignments.map((a) => (
                    <option key={a.studentId} value={a.studentId}>
                      {a.studentName} ({a.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Master Embedded Systems & Solve GATE PYQs"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    {['ACADEMIC', 'CORE SKILL', 'GATE', 'PROJECT', 'CAREER', 'INTERNSHIP', 'HIGHER STUDIES', 'RESEARCH'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description & Milestones</label>
                <textarea
                  rows={3}
                  value={goalDesc}
                  onChange={(e) => setGoalDesc(e.target.value)}
                  placeholder="Specify key milestones and expectation details..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                  Assign Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD PRIVATE MENTOR NOTE */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" /> Confidential Faculty Advisory Note
              </h3>
              <button onClick={() => setShowAddNoteModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Student Mentee</label>
                <select
                  value={noteStudentId}
                  onChange={(e) => setNoteStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  {assignments.map((a) => (
                    <option key={a.studentId} value={a.studentId}>
                      {a.studentName} ({a.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Note Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  {['Academic', 'Attendance', 'Career', 'GATE', 'Project', 'Internship', 'Higher Studies', 'General'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Advisory Note Content *</label>
                <textarea
                  required
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record confidential observation, guidance given, or follow-up recommendation..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="shareCheck"
                    checked={noteIsShareable}
                    onChange={(e) => setNoteIsShareable(e.target.checked)}
                  />
                  <label htmlFor="shareCheck" className="font-extrabold text-amber-900 dark:text-amber-200">
                    Make this note visible to Student
                  </label>
                </div>
                <p className="text-[10px] text-amber-700 dark:text-amber-400">
                  By default, notes are strictly private. Check this box ONLY if you want the student to see this note on their dashboard.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: MEETING SUMMARY */}
      {showMeetingSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Post-Meeting Summary Entry
              </h3>
              <button onClick={() => setShowMeetingSummaryModal(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveMeetingSummary} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Key Discussion Points *</label>
                <textarea
                  required
                  rows={3}
                  value={sumNotes}
                  onChange={(e) => setSumNotes(e.target.value)}
                  placeholder="Summarize key student concerns, progress discussed..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Action Items (One per line)</label>
                <textarea
                  rows={3}
                  value={sumActions}
                  onChange={(e) => setSumActions(e.target.value)}
                  placeholder="1. Complete GATE PYQs for Operating Systems&#10;2. Submit research draft by next Friday"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMeetingSummaryModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                >
                  Save & Complete Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: ASSIGN MENTOR (ADMIN VIEW) */}
      {showAssignMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck2 className="h-5 w-5 text-indigo-600" /> Institutional Mentor Allocation
              </h3>
              <button onClick={() => setShowAssignMentorModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Faculty Mentor</label>
                <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white">
                  <option value="u-faculty-1">Prof. Robert Thorne (15 Mentees)</option>
                  <option value="u-faculty-2">Dr. Sarah Lin (12 Mentees)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Student or Batch</label>
                <select className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white">
                  <option value="batch-3a">CSE 3rd Year Section A (All Unassigned)</option>
                  <option value="u-student-3">Rohan Sharma (CS2023003)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAssignMentorModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAssignMentorModal(false);
                    alert('Mentorship allocation saved successfully!');
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                  Save Allocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
