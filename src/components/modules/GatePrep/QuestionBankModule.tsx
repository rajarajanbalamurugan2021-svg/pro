import React, { useState } from 'react';
import { GateQuestion, GatePaper, QuestionType, GateDifficulty } from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import {
  FileSpreadsheet,
  Plus,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  RotateCcw,
  BookOpen,
  HelpCircle,
  FileText,
  X,
  Check
} from 'lucide-react';

interface QuestionBankModuleProps {
  currentUser: { id: string; name: string; role: string };
  onRefreshData?: () => void;
}

export const QuestionBankModule: React.FC<QuestionBankModuleProps> = ({
  currentUser,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'VIEW' | 'ADD' | 'CSV'>('VIEW');
  const [gatePaper, setGatePaper] = useState<GatePaper>('ECE');
  const [search, setSearch] = useState('');

  // Questions List
  const [questions, setQuestions] = useState<GateQuestion[]>(() =>
    GateService.getQuestions({ gatePaper: 'ECE', includeDeleted: true })
  );

  // Manual Question Form State
  const [qSubject, setQSubject] = useState('Signals and Systems');
  const [qTopic, setQTopic] = useState('Fourier Transform');
  const [qType, setQType] = useState<QuestionType>('MCQ');
  const [qDifficulty, setQDifficulty] = useState<GateDifficulty>('MEDIUM');
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.33);

  // CSV State
  const [csvContent, setCsvContent] = useState('');
  const [csvResult, setCsvResult] = useState<{
    validQuestions: Omit<GateQuestion, 'id' | 'createdAt' | 'updatedAt'>[];
    errors: { line: number; message: string; rowData: any }[];
    totalRows: number;
  } | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const refreshQuestions = (paper = gatePaper) => {
    setQuestions(GateService.getQuestions({ gatePaper: paper, includeDeleted: true }));
  };

  const handlePaperChange = (paper: GatePaper) => {
    setGatePaper(paper);
    refreshQuestions(paper);
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    GateService.addQuestion({
      gatePaper,
      subject: qSubject,
      topic: qTopic,
      difficulty: qDifficulty,
      questionType: qType,
      question: qText,
      options:
        qType === 'NAT'
          ? undefined
          : [
              { key: 'A', text: optA || 'Option A' },
              { key: 'B', text: optB || 'Option B' },
              { key: 'C', text: optC || 'Option C' },
              { key: 'D', text: optD || 'Option D' }
            ],
      correctAnswer,
      explanation,
      marks,
      negativeMarks,
      tags: [gatePaper, qSubject],
      status: 'PUBLISHED',
      createdBy: currentUser.id,
      createdByName: currentUser.name
    });

    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setExplanation('');
    refreshQuestions();
    setActiveTab('VIEW');
    if (onRefreshData) onRefreshData();
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      const res = GateService.parseQuestionsCsv(text, { id: currentUser.id, name: currentUser.name });
      setCsvResult(res);
    };
    reader.readAsText(file);
  };

  const handleConfirmCsvImport = () => {
    if (!csvResult || csvResult.validQuestions.length === 0) return;

    csvResult.validQuestions.forEach(q => {
      GateService.addQuestion(q);
    });

    setImportSuccess(true);
    setTimeout(() => {
      setImportSuccess(false);
      setCsvResult(null);
      setCsvContent('');
      setActiveTab('VIEW');
      refreshQuestions();
      if (onRefreshData) onRefreshData();
    }, 1500);
  };

  const handleSoftDelete = (id: string) => {
    GateService.softDeleteQuestion(id, currentUser);
    refreshQuestions();
  };

  const handleRestore = (id: string) => {
    GateService.restoreQuestion(id, currentUser);
    refreshQuestions();
  };

  const filteredQuestions = questions.filter(
    q =>
      search === '' ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Question Bank & PYQ Repository</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, manage, and bulk import MCQ, MSQ, and NAT questions for GATE practice tests and mock engines.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab('VIEW')}
            className={`px-3 py-1.5 rounded-xl transition ${
              activeTab === 'VIEW' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
            }`}
          >
            All Questions ({filteredQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab('ADD')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition ${
              activeTab === 'ADD' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Single Question</span>
          </button>
          <button
            onClick={() => setActiveTab('CSV')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition ${
              activeTab === 'CSV' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bulk CSV Import</span>
          </button>
        </div>
      </div>

      {/* VIEW TAB */}
      {activeTab === 'VIEW' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 dark:text-slate-400">Branch:</span>
              {(['ECE', 'EEE', 'ME', 'CE', 'CSE', 'AIDS', 'BM', 'RO'] as GatePaper[]).map(p => (
                <button
                  key={p}
                  onClick={() => handlePaperChange(p)}
                  className={`px-3 py-1 rounded-xl font-bold transition ${
                    gatePaper === p
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  GATE {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or subjects..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-900 dark:text-white placeholder-slate-400 w-full"
              />
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                No questions found for GATE {gatePaper}. Click "Add Single Question" or "Bulk CSV Import" to create questions.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 text-xs ${
                    q.isDeleted
                      ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 opacity-60'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-slate-400 font-bold">Q{idx + 1}.</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold">
                        {q.questionType}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-semibold">
                        {q.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                        {q.difficulty}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {q.marks} Mark{q.marks > 1 ? 's' : ''} ({q.negativeMarks > 0 ? `-${q.negativeMarks} neg` : 'No neg'})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {q.isDeleted ? (
                        <button
                          onClick={() => handleRestore(q.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-1 hover:bg-emerald-500"
                          title="Restore question"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSoftDelete(q.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="Soft delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options if MCQ/MSQ */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
                      {q.options.map(opt => (
                        <div
                          key={opt.key}
                          className={`p-2 rounded-xl border ${
                            q.correctAnswer.includes(opt.key)
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 font-bold text-emerald-900 dark:text-emerald-300'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="font-black mr-2">({opt.key})</span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* NAT answer display */}
                  {q.questionType === 'NAT' && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-mono text-xs font-bold">
                      Correct Numerical Value / Range: {q.correctAnswer}
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 text-xs italic">
                    <strong className="text-blue-600 dark:text-blue-400 not-italic">Solution Explanation:</strong> {q.explanation}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADD SINGLE QUESTION TAB */}
      {activeTab === 'ADD' && (
        <form onSubmit={handleAddQuestionSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                GATE Branch
              </label>
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
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={qSubject}
                onChange={e => setQSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Topic
              </label>
              <input
                type="text"
                required
                value={qTopic}
                onChange={e => setQTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Question Type
              </label>
              <select
                value={qType}
                onChange={e => setQType(e.target.value as QuestionType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="MCQ">MCQ (Multiple Choice)</option>
                <option value="MSQ">MSQ (Multiple Select)</option>
                <option value="NAT">NAT (Numerical Answer Type)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Question Statement *
            </label>
            <textarea
              rows={3}
              required
              value={qText}
              onChange={e => setQText(e.target.value)}
              placeholder="Enter question text or equation..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          {/* Options if MCQ or MSQ */}
          {qType !== 'NAT' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={optA}
                  onChange={e => setOptA(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={optB}
                  onChange={e => setOptB(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Option C</label>
                <input
                  type="text"
                  required
                  value={optC}
                  onChange={e => setOptC(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Option D</label>
                <input
                  type="text"
                  required
                  value={optD}
                  onChange={e => setOptD(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Correct Answer *
              </label>
              <input
                type="text"
                required
                value={correctAnswer}
                onChange={e => setCorrectAnswer(e.target.value)}
                placeholder={qType === 'NAT' ? 'e.g. 506 or 33.3' : 'e.g. A or A,C'}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Marks
              </label>
              <select
                value={marks}
                onChange={e => {
                  const m = parseInt(e.target.value) || 1;
                  setMarks(m);
                  setNegativeMarks(m === 2 ? 0.66 : 0.33);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value={1}>1 Mark</option>
                <option value={2}>2 Marks</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Difficulty
              </label>
              <select
                value={qDifficulty}
                onChange={e => setQDifficulty(e.target.value as GateDifficulty)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Detailed Solution Explanation
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              placeholder="Step-by-step derivation or formulas used..."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg"
          >
            Save & Publish Question to Bank
          </button>
        </form>
      )}

      {/* BULK CSV IMPORT TAB */}
      {activeTab === 'CSV' && (
        <div className="space-y-5 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 space-y-2">
            <h4 className="font-bold text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>CSV File Format Specification</span>
            </h4>
            <p>
              Your CSV file should contain headers: <code className="bg-emerald-100 dark:bg-emerald-900 px-1.5 py-0.5 rounded font-mono text-[11px]">Question, OptionA, OptionB, OptionC, OptionD, CorrectAnswer, Subject, Topic, QuestionType, Difficulty, Marks, Explanation</code>
            </p>
          </div>

          {/* Upload Input */}
          <div className="border-2 border-dashed border-emerald-300 dark:border-emerald-800 p-6 rounded-3xl text-center space-y-3 bg-emerald-50/20 dark:bg-slate-800/40">
            <Upload className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" />
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Upload Question Bank CSV File
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvFileUpload}
              className="mx-auto block text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
            />
          </div>

          {/* Validation Report & Preview */}
          {csvResult && (
            <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                  <span className="text-slate-500 font-bold block text-[10px]">TOTAL ROWS</span>
                  <span className="text-lg font-black">{csvResult.totalRows}</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-300">
                  <span className="text-emerald-600 font-bold block text-[10px]">VALID QUESTIONS</span>
                  <span className="text-lg font-black">{csvResult.validQuestions.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-900 dark:text-red-300">
                  <span className="text-red-600 font-bold block text-[10px]">ERRORS / INVALID</span>
                  <span className="text-lg font-black">{csvResult.errors.length}</span>
                </div>
              </div>

              {/* Errors list */}
              {csvResult.errors.length > 0 && (
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-1 text-red-700 dark:text-red-300">
                  <span className="font-bold block text-xs">Parsing Errors Identified:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                    {csvResult.errors.map((err, idx) => (
                      <li key={idx}>Line {err.line}: {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Confirm Import Button */}
              {csvResult.validQuestions.length > 0 && (
                <button
                  onClick={handleConfirmCsvImport}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Import {csvResult.validQuestions.length} Valid Questions into Database</span>
                </button>
              )}

              {importSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold text-center">
                  Successfully imported questions into GATE repository!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
