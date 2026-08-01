import React, { useState } from 'react';
import { LeaveRequest, UserRole } from '../../../types';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  BellRing,
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface LeaveManagementProps {
  leaves: LeaveRequest[];
  userRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onApplyLeave: (leave: LeaveRequest) => void;
  onApproveRejectLeave: (id: string, status: 'Approved' | 'Rejected', notes?: string) => void;
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({
  leaves,
  userRole,
  currentUserId,
  currentUserName,
  onApplyLeave,
  onApproveRejectLeave
}) => {
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form State
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('2026-08-10');
  const [endDate, setEndDate] = useState('2026-08-12');
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('Duty');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const newLeave: LeaveRequest = {
      id: `lv-${Date.now()}`,
      studentId: currentUserId,
      studentName: currentUserName,
      rollNumber: 'CS2023001',
      department: 'Computer Science & Engineering',
      reason,
      startDate,
      endDate,
      daysCount: days,
      type: leaveType,
      status: 'Pending',
      parentNotified: true,
      appliedOn: new Date().toISOString().split('T')[0]
    };

    onApplyLeave(newLeave);
    setShowApplyModal(false);
    setReason('');
  };

  const statusBadges: Record<LeaveRequest['status'], { bg: string; icon: any }> = {
    'Pending': { bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', icon: Clock },
    'Approved': { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', icon: CheckCircle2 },
    'Rejected': { bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300', icon: XCircle }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-indigo-500/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            <CalendarDays className="h-4 w-4" /> Student Absence & Duty Leave Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Student Leave Management System
          </h1>
          <p className="text-sm text-indigo-100 mt-1 max-w-xl">
            Submit medical, duty, or personal leave requests, verify faculty approvals, and trigger parent SMS/email alerts.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-800 text-xs font-extrabold hover:bg-indigo-50 transition shadow-md"
        >
          <Plus className="h-4 w-4" /> Apply for Leave
        </button>
      </div>

      {/* Leave Requests Table / Cards */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500" /> Leave Application Records & History
        </h2>

        <div className="space-y-3">
          {leaves.map((lv) => {
            const Badge = statusBadges[lv.status];
            const Icon = Badge.icon;
            return (
              <div
                key={lv.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{lv.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({lv.rollNumber})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {lv.type}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${Badge.bg}`}>
                    <Icon className="h-3 w-3" /> {lv.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{lv.reason}</p>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <span>Dates: <strong className="text-slate-800 dark:text-slate-200">{lv.startDate} to {lv.endDate} ({lv.daysCount} days)</strong></span>
                    {lv.parentNotified && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <BellRing className="h-3 w-3" /> Parent Notified via SMS
                      </span>
                    )}
                  </div>

                  {/* Faculty Actions */}
                  {lv.status === 'Pending' && (userRole === 'faculty' || userRole === 'admin' || userRole === 'super_admin') && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproveRejectLeave(lv.id, 'Approved')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition"
                      >
                        Approve Leave
                      </button>
                      <button
                        onClick={() => onApproveRejectLeave(lv.id, 'Rejected')}
                        className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* APPLY LEAVE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-indigo-600" /> Apply for Student Leave
              </h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="Duty">On-Duty / Academic Event</option>
                  <option value="Medical">Medical Leave</option>
                  <option value="Personal">Personal Reason</option>
                  <option value="Emergency">Family Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Reason for Absence *</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide complete explanation for leave request..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <BellRing className="h-4 w-4 shrink-0" />
                <span>An automatic notification SMS & email will be sent to your registered parent contact.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
