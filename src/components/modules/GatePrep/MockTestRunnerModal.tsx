import React, { useState, useEffect } from 'react';
import { GateMockTest, GateStudentAttempt } from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  X,
  Zap,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface MockTestRunnerModalProps {
  mockTest: GateMockTest | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; name: string };
  onAttemptCompleted?: (attempt: GateStudentAttempt) => void;
}

export const MockTestRunnerModal: React.FC<MockTestRunnerModalProps> = ({
  mockTest,
  isOpen,
  onClose,
  currentUser,
  onAttemptCompleted
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<GateStudentAttempt | null>(null);

  useEffect(() => {
    if (mockTest && isOpen) {
      setCurrentQIndex(0);
      setAnswers({});
      setMarkedForReview({});
      setIsSubmitted(false);
      setResult(null);
      setSecondsRemaining((mockTest.durationMinutes || 45) * 60);
    }
  }, [mockTest, isOpen]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || isSubmitted || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, secondsRemaining]);

  if (!isOpen || !mockTest) return null;

  const currentQ = mockTest.questions[currentQIndex];

  const handleSelectOption = (qId: string, optionKey: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleNatInputChange = (qId: string, val: string) => {
    if (isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  const handleToggleMarkReview = (qId: string) => {
    setMarkedForReview(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleSubmitTest = () => {
    if (isSubmitted) return;

    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const subjectBreakdown: Record<string, { attempted: number; correct: number; wrong: number; accuracy: number }> = {};
    const weakTopicsSet = new Set<string>();

    mockTest.questions.forEach(q => {
      const studentAns = (answers[q.id] || '').trim().toUpperCase();
      const correctAns = (q.correctAnswer || '').trim().toUpperCase();

      if (!subjectBreakdown[q.subject]) {
        subjectBreakdown[q.subject] = { attempted: 0, correct: 0, wrong: 0, accuracy: 0 };
      }

      if (!studentAns) {
        unansweredCount++;
      } else {
        subjectBreakdown[q.subject].attempted++;
        if (studentAns === correctAns) {
          totalScore += q.marks;
          correctCount++;
          subjectBreakdown[q.subject].correct++;
        } else {
          totalScore -= mockTest.negativeMarkingEnabled ? q.negativeMarks : 0;
          wrongCount++;
          subjectBreakdown[q.subject].wrong++;
          weakTopicsSet.add(`${q.subject}: ${q.topic}`);
        }
      }
    });

    // Calculate accuracies
    Object.keys(subjectBreakdown).forEach(subj => {
      const data = subjectBreakdown[subj];
      data.accuracy = data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0;
    });

    const timeTaken = (mockTest.durationMinutes * 60) - secondsRemaining;
    const accuracyPercentage = (correctCount + wrongCount) > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;

    const attempt = GateService.recordStudentAttempt({
      studentId: currentUser.id,
      studentName: currentUser.name,
      mockTestId: mockTest.id,
      mockTestTitle: mockTest.title,
      gatePaper: mockTest.gatePaper,
      score: Math.max(0, parseFloat(totalScore.toFixed(2))),
      maxScore: mockTest.totalMarks || 10,
      accuracyPercentage,
      timeTakenSeconds: timeTaken,
      totalQuestions: mockTest.totalQuestions,
      correctCount,
      wrongCount,
      unansweredCount,
      subjectBreakdown,
      weakTopics: Array.from(weakTopicsSet)
    });

    setResult(attempt);
    setIsSubmitted(true);
    if (onAttemptCompleted) onAttemptCompleted(attempt);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[92vh]">
        
        {/* Top Exam Header */}
        <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
              OFFICIAL LIVE EXAMINATION PORTAL • GATE {mockTest.gatePaper}
            </span>
            <h2 className="text-sm sm:text-base font-black truncate max-w-md text-white">
              {mockTest.title}
            </h2>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700 font-mono text-xs font-bold text-amber-400">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Time Left: {formatTime(secondsRemaining)}</span>
              </div>

              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs shadow-lg text-white transition"
              >
                Submit Test
              </button>
            </div>
          )}

          {isSubmitted && (
            <button onClick={onClose} className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Body */}
        {!isSubmitted ? (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Left Question Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold">
                    Question {currentQIndex + 1} of {mockTest.questions.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-bold">
                    {currentQ.questionType}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {currentQ.subject} • {currentQ.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">+{currentQ.marks} Marks</span>
                  {currentQ.negativeMarks > 0 && (
                    <span className="text-red-400 font-bold">-{currentQ.negativeMarks} Neg</span>
                  )}
                  <button
                    onClick={() => handleToggleMarkReview(currentQ.id)}
                    className={`px-3 py-1 rounded-xl border text-xs font-bold transition ${
                      markedForReview[currentQ.id]
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5 inline mr-1" />
                    {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark Review'}
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-base font-bold text-white leading-relaxed p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                {currentQ.question}
              </div>

              {/* Options (MCQ / MSQ) */}
              {currentQ.options && currentQ.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-slate-400 font-bold block text-[11px] uppercase tracking-wider">
                    Select Your Answer:
                  </span>
                  {currentQ.options.map(opt => {
                    const isSelected = answers[currentQ.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(currentQ.id, opt.key)}
                        className={`w-full text-left p-4 rounded-2xl border transition flex items-center gap-3 font-semibold text-xs ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white font-bold ring-2 ring-blue-500/50'
                            : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold font-mono text-xs ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* NAT Option */}
              {currentQ.questionType === 'NAT' && (
                <div className="space-y-2 pt-2">
                  <label className="text-slate-300 font-bold block text-xs">
                    Enter Numerical Value Answer:
                  </label>
                  <input
                    type="text"
                    value={answers[currentQ.id] || ''}
                    onChange={e => handleNatInputChange(currentQ.id, e.target.value)}
                    placeholder="e.g. 506"
                    className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm w-64 outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Navigation Bar */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold flex items-center gap-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setCurrentQIndex(prev => Math.min(mockTest.questions.length - 1, prev + 1))}
                  disabled={currentQIndex === mockTest.questions.length - 1}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-bold flex items-center gap-1.5 transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Question Palette */}
            <div className="w-72 bg-slate-950 border-l border-slate-800 p-5 space-y-5 flex flex-col shrink-0 text-xs">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">
                Question Palette
              </h4>

              <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-64">
                {mockTest.questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isReview = !!markedForReview[q.id];
                  const isCurrent = currentQIndex === idx;

                  let bg = 'bg-slate-800 text-slate-300 border-slate-700';
                  if (isReview) bg = 'bg-purple-600 text-white border-purple-400 font-bold';
                  else if (isAnswered) bg = 'bg-emerald-600 text-white border-emerald-400 font-bold';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`h-10 rounded-xl border flex items-center justify-center font-mono font-bold transition relative ${bg} ${
                        isCurrent ? 'ring-2 ring-white scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="space-y-2 border-t border-slate-800 pt-4 text-[11px] font-medium text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                  <span>Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* RESULT SUMMARY SCREEN */
          <div className="p-8 overflow-y-auto space-y-6 text-xs">
            <div className="text-center space-y-2">
              <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-white">Mock Test Evaluation Report</h2>
              <p className="text-slate-400">{mockTest.title} • Completed</p>
            </div>

            {/* Score Cards */}
            {result && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">SCORE</span>
                  <p className="text-2xl font-black text-blue-400">{result.score} / {result.maxScore}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">ACCURACY</span>
                  <p className="text-2xl font-black text-emerald-400">{result.accuracyPercentage}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">CORRECT / WRONG</span>
                  <p className="text-2xl font-black text-white">{result.correctCount} / {result.wrongCount}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">TIME TAKEN</span>
                  <p className="text-2xl font-black text-amber-400">{formatTime(result.timeTakenSeconds)}</p>
                </div>
              </div>
            )}

            {/* Weak Topics Identification */}
            {result && result.weakTopics.length > 0 && (
              <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/50 space-y-2">
                <h4 className="font-bold text-red-300 text-sm flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span>Recommended Focus Areas (Weak Topics Detected)</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-red-200">
                  {result.weakTopics.map((wt, idx) => (
                    <li key={idx} className="font-medium">{wt}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-sm shadow-xl transition"
            >
              Close & Return to GATE Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
