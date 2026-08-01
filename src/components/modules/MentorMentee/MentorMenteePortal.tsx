import React, { useState } from 'react';
import { MentorAssignment, MeetingSchedule, UserRole } from '../../../types';
import {
  UserCheck2,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  MessageSquare,
  Award,
  BookOpen,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface MentorMenteePortalProps {
  assignments: MentorAssignment[];
  meetings: MeetingSchedule[];
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onAddMeeting: (meeting: MeetingSchedule) => void;
}

export const MentorMenteePortal: React.FC<MentorMenteePortalProps> = ({
  assignments,
  meetings,
  userRole,
  currentUserId,
  currentUserName,
  onAddMeeting
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New Meeting Form
  const [studentId, setStudentId] = useState(assignments[0]?.studentId || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-08-05');
  const [time, setTime] = useState('03:00 PM');
  const [location, setLocation] = useState('Faculty Cabin 204');
  const [agenda, setAgenda] = useState('');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !agenda) return;

    const assignedStud = assignments.find((a) => a.studentId === studentId);

    const newMeeting: MeetingSchedule = {
      id: `meet-${Date.now()}`,
      mentorId: currentUserId,
      mentorName: currentUserName,
      studentId: studentId || 'u-student-1',
      studentName: assignedStud?.studentName || 'Alex Rivera',
      title,
      date,
      time,
      location,
      agenda,
      status: 'Scheduled'
    };

    onAddMeeting(newMeeting);
    setShowScheduleModal(false);
    setTitle('');
    setAgenda('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            <UserCheck2 className="h-4 w-4" /> Faculty Academic Advisory & Mentorship
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Mentor - Mentee Advisory Portal
          </h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-xl">
            Track student academic progress, schedule 1-on-1 counseling sessions, and record continuous career guidance notes.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-800 text-xs font-extrabold hover:bg-indigo-50 transition shadow-md"
        >
          <Plus className="h-4 w-4" /> Schedule Mentorship Meeting
        </button>
      </div>

      {/* Assigned Mentees Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="h-4 w-4 text-indigo-500" /> Assigned Student Mentees ({assignments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.studentName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{m.rollNumber} — {m.department}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  Semester {m.semester}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Current CGPA</span>
                  <span className="text-base font-extrabold text-emerald-600">{m.cgpa} / 10.0</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Attendance %</span>
                  <span className="text-base font-extrabold text-blue-600">{m.attendancePercentage}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Last Advisory Meeting: {m.lastMeetingDate}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">Good Standing</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Advisory Meetings */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500" /> Scheduled Mentorship Advisory Sessions
        </h2>

        <div className="space-y-3">
          {meetings.map((meet) => (
            <div
              key={meet.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{meet.title}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {meet.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">{meet.agenda}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {meet.date} at {meet.time}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {meet.location}</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">Mentee: {meet.studentName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck2 className="h-5 w-5 text-indigo-600" /> Schedule Advisory Session
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Student Mentee</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 6th Semester Progress Review & Internship Discussion"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location / Link</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Agenda / Discussion Points *</label>
                <textarea
                  required
                  rows={3}
                  value={agenda}
                  onChange={(e) => setAgenda(e.target.value)}
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
                  Confirm Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
