import React, { useState } from 'react';
import { User, InterviewQuestion } from '../../../types';
import {
  Brain,
  MessageSquare,
  Code2,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Play,
  Award,
  BookOpen,
  Volume2,
  RefreshCw
} from 'lucide-react';

interface Props {
  user: User;
  questions: InterviewQuestion[];
}

export const InterviewPrep: React.FC<Props> = ({ user, questions }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'Technical' | 'HR' | 'Aptitude' | 'Coding Challenge'>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(questions[0] || null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{
    score: number;
    communicationRating: string;
    strengths: string[];
    improvements: string[];
    modelAnswer: string;
  } | null>(null);

  const filteredQuestions = activeTab === 'all' ? questions : questions.filter((q) => q.category === activeTab);

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim() || !selectedQuestion) return;
    setIsSimulating(true);

    setTimeout(() => {
      setAiFeedback({
        score: 88,
        communicationRating: 'Clear, Professional & Structured',
        strengths: [
          'Excellent technical accuracy when describing algorithmic complexity.',
          'Good logical flow using standard problem-solving frameworks.'
        ],
        improvements: [
          'Mention edge case handling (e.g., null nodes or single element inputs).',
          'Quantify space complexity constraints explicitly.'
        ],
        modelAnswer: selectedQuestion.answerHint
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              AI Interview Preparation & Mock Simulator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Practice Technical, HR, Aptitude, and Coding questions with instant AI communication feedback and model hints.
            </p>
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['all', 'Technical', 'HR', 'Aptitude', 'Coding Challenge'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Practice Question Bank ({filteredQuestions.length})
          </h3>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  setSelectedQuestion(q);
                  setAiFeedback(null);
                  setUserAnswer('');
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedQuestion?.id === q.id
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {q.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold ${
                      q.difficulty === 'Easy'
                        ? 'text-emerald-600'
                        : q.difficulty === 'Medium'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                  {q.question}
                </p>

                {q.company && (
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    Asked in: {q.company}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive AI Mock Interview Workspace */}
        <div className="lg:col-span-7 space-y-5">
          {selectedQuestion ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedQuestion.category} • {selectedQuestion.difficulty}
                </span>
                {selectedQuestion.company && (
                  <span className="text-xs text-slate-500">{selectedQuestion.company}</span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {selectedQuestion.question}
                </h3>
              </div>

              {/* User Answer Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Your Response / Explanation / Code Solution
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer or explanation here for instant AI assessment..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  onClick={handleEvaluateAnswer}
                  disabled={isSimulating || !userAnswer.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow"
                >
                  {isSimulating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isSimulating ? 'Evaluating Response...' : 'Submit to AI Interviewer'}
                </button>
              </div>

              {/* AI Evaluation Output */}
              {aiFeedback && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40">
                    <div>
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">AI Assessment Score</span>
                      <span className="text-[11px] text-indigo-700 dark:text-indigo-300">{aiFeedback.communicationRating}</span>
                    </div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {aiFeedback.score}%
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/40">
                      <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">Strengths</h4>
                      <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                        {aiFeedback.strengths.map((s, idx) => (
                          <li key={idx}>✓ {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/40">
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">Key Improvements</h4>
                      <ul className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                        {aiFeedback.improvements.map((imp, idx) => (
                          <li key={idx}>💡 {imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Model Expert Solution Hint</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{aiFeedback.modelAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
              Select a question from the left bank to start practicing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
