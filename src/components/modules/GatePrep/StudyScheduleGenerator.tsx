import React, { useState } from 'react';
import { GateStudySchedule, GatePaper } from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import { Calendar, CheckCircle2, Clock, Sparkles, Target, BookOpen } from 'lucide-react';

interface StudyScheduleGeneratorProps {
  currentUser: { id: string; name: string };
}

export const StudyScheduleGenerator: React.FC<StudyScheduleGeneratorProps> = ({ currentUser }) => {
  const [schedule, setSchedule] = useState<GateStudySchedule | null>(() =>
    GateService.getStudySchedule(currentUser.id)
  );

  const [gatePaper, setGatePaper] = useState<GatePaper>('ECE');
  const [targetYear, setTargetYear] = useState(2025);
  const [targetScore, setTargetScore] = useState(750);
  const [dailyHours, setDailyHours] = useState(4);
  const [weakSubjectsStr, setWeakSubjectsStr] = useState('Signals and Systems, Communications');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule = GateService.generateStudySchedule({
      studentId: currentUser.id,
      studentName: currentUser.name,
      gatePaper,
      targetYear,
      targetScore,
      dailyHours,
      startDate: new Date().toISOString().split('T')[0],
      examDate: '2025-02-08',
      strongSubjects: ['General Aptitude', 'Engineering Mathematics'],
      weakSubjects: weakSubjectsStr.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSchedule(newSchedule);
  };

  const handleToggleTaskStatus = (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    GateService.updateTaskStatus(currentUser.id, taskId, nextStatus);
    setSchedule(GateService.getStudySchedule(currentUser.id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Personalized GATE Study Schedule Generator</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Smart algorithm builds daily, weekly, and revision roadmaps based on your target rank and weak topics.
          </p>
        </div>
      </div>

      {!schedule ? (
        <form onSubmit={handleGenerate} className="space-y-4 max-w-xl mx-auto bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target GATE Paper</label>
              <select
                value={gatePaper}
                onChange={e => setGatePaper(e.target.value as GatePaper)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="ECE">GATE ECE</option>
                <option value="EEE">GATE EEE</option>
                <option value="ME">GATE ME</option>
                <option value="CE">GATE CE</option>
                <option value="CSE">GATE CSE</option>
                <option value="AIDS">GATE AI & DS</option>
                <option value="BM">GATE Bio Medical</option>
                <option value="RO">GATE Robotics</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Daily Available Hours</label>
              <input
                type="number"
                value={dailyHours}
                onChange={e => setDailyHours(parseInt(e.target.value) || 4)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Weak Subjects (Needs Extra Time)</label>
            <input
              type="text"
              value={weakSubjectsStr}
              onChange={e => setWeakSubjectsStr(e.target.value)}
              placeholder="e.g. Signals and Systems, Power Systems"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm shadow-xl hover:from-amber-600 hover:to-orange-700 transition"
          >
            Generate Personalized Study Schedule
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          {/* Schedule Info Header */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Active Roadmap</span>
              <h4 className="text-base font-black">GATE {schedule.gatePaper} Preparation Plan</h4>
              <p className="text-xs text-slate-300">{schedule.dailyHours} Hours/Day • Target Score: {schedule.targetScore}</p>
            </div>

            <button
              onClick={() => setSchedule(null)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
            >
              Re-generate Schedule
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">14-Day Study Action Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {schedule.tasks.map(task => {
                const isCompleted = task.status === 'COMPLETED';
                return (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-80'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <button className="mt-0.5 shrink-0">
                      <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-100' : 'text-slate-300'}`} />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{task.dayOrWeek}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {task.taskType}
                        </span>
                        <span className="text-slate-400 font-mono">{task.durationHours} hrs</span>
                      </div>
                      <p className={`font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {task.subject}: {task.topic}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
