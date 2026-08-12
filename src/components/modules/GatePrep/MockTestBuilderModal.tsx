import React, { useState } from 'react';
import { GateMockTest, GatePaper, GateQuestion, GateDifficulty } from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import { X, Check, Clock, HelpCircle, Layers, Settings, FileText } from 'lucide-react';

interface MockTestBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string; role: string };
  onCreated: (test: GateMockTest) => void;
}

export const MockTestBuilderModal: React.FC<MockTestBuilderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreated
}) => {
  const [gatePaper, setGatePaper] = useState<GatePaper>('ECE');
  const [title, setTitle] = useState('GATE ECE 2025 Full Syllabus Grand Mock Test');
  const [description, setDescription] = useState('Comprehensive mock test following latest IISc exam pattern.');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [negativeMarkingEnabled, setNegativeMarkingEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<GateDifficulty>('MEDIUM');
  const [instructions, setInstructions] = useState('1. Total duration: 45 Minutes.\n2. Standard GATE negative marking applies.');

  // Questions Available from Bank
  const availableQuestions = GateService.getQuestions({ gatePaper, includeDeleted: false });
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(() =>
    availableQuestions.map(q => q.id)
  );

  if (!isOpen) return null;

  const handleToggleQuestion = (id: string) => {
    setSelectedQuestionIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedQObjects = availableQuestions.filter(q => selectedQuestionIds.includes(q.id));
    const totalMarks = selectedQObjects.reduce((acc, q) => acc + q.marks, 0);

    const created = GateService.createMockTest({
      title,
      description,
      gatePaper,
      subjects: Array.from(new Set(selectedQObjects.map(q => q.subject))),
      topics: ['All Syllabus'],
      totalQuestions: selectedQObjects.length,
      durationMinutes,
      totalMarks: totalMarks || 10,
      negativeMarkingEnabled,
      difficulty,
      instructions,
      questions: selectedQObjects,
      status: 'PUBLISHED',
      createdBy: currentUser.id,
      createdByName: currentUser.name
    });

    onCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] text-xs">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-sm">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Create & Configure GATE Mock Test</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">GATE Paper / Branch</label>
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
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(parseInt(e.target.value) || 45)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Test Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Questions from Question Bank ({selectedQuestionIds.length} Selected)</label>
            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-2xl p-3 space-y-2 bg-slate-50 dark:bg-slate-800/50">
              {availableQuestions.length === 0 ? (
                <p className="text-slate-400 italic">No questions found in question bank for GATE {gatePaper}. Please add questions first.</p>
              ) : (
                availableQuestions.map(q => (
                  <label key={q.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/60">
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.includes(q.id)}
                      onChange={() => handleToggleQuestion(q.id)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">[{q.questionType}]</span>
                    <span className="truncate text-slate-700 dark:text-slate-300">{q.question}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Instructions</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg"
          >
            Publish Mock Test for Students
          </button>
        </form>
      </div>
    </div>
  );
};
