import React, { useState } from 'react';
import {
  GateResource,
  GatePaper,
  GateMockTest,
  GateStudentAttempt
} from '../../../types/gate';
import { GateService } from '../../../services/gateService';
import { MockTestRunnerModal } from './MockTestRunnerModal';
import { StudyScheduleGenerator } from './StudyScheduleGenerator';
import { SubjectWeightageManager } from './SubjectWeightageManager';
import {
  Search,
  Filter,
  FileText,
  Eye,
  Download,
  Bookmark,
  BookmarkCheck,
  Play,
  Award,
  Sparkles,
  TrendingDown,
  BarChart2,
  BookOpen,
  Calendar,
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface GateStudentDashboardProps {
  currentUser: { id: string; name: string; role: string };
  onOpenPdfViewer: (res: GateResource) => void;
  onRefreshData?: () => void;
}

export const GateStudentDashboard: React.FC<GateStudentDashboardProps> = ({
  currentUser,
  onOpenPdfViewer,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'MOCK_TESTS' | 'SCHEDULE' | 'WEIGHTAGE' | 'ANALYTICS'>('LIBRARY');

  // Filters
  const [selectedBranch, setSelectedBranch] = useState<GatePaper>('ECE');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Runner State
  const [activeMockTest, setActiveMockTest] = useState<GateMockTest | null>(null);

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => GateService.getBookmarks(currentUser.id));

  // Load Data
  const resources = GateService.getResources({
    gatePaper: selectedBranch,
    resourceType: selectedType,
    search: searchQuery,
    includeDeleted: false
  });

  const mockTests = GateService.getMockTests(selectedBranch);
  const studentAttempts = GateService.getStudentAttempts(currentUser.id);
  const weakTopics = GateService.calculateWeakTopics(currentUser.id);

  const handleToggleBookmark = (resId: string) => {
    const updated = GateService.toggleBookmark(currentUser.id, resId);
    setBookmarks(updated);
  };

  const handleDownload = (resId: string, url: string) => {
    GateService.incrementDownload(resId);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">STUDENT GATE HUB</span>
          <h2 className="text-lg font-black text-white">Master GATE Exam Preparation with Official Archives</h2>
          <p className="text-xs text-slate-300">Access verified PYQs, PDF Notes, Formula Cheat Sheets, Live Mock Tests, and AI Weak Topic Analytics across all departments.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['ECE', 'EEE', 'ME', 'CE', 'CSE', 'AIDS', 'BM', 'RO'] as GatePaper[]).map(p => (
            <button
              key={p}
              onClick={() => setSelectedBranch(p)}
              className={`px-3 py-1.5 rounded-xl font-extrabold transition ${
                selectedBranch === p ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              GATE {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Module Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold">
        <button
          onClick={() => setActiveTab('LIBRARY')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'LIBRARY' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Resource Library ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MOCK_TESTS')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'MOCK_TESTS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4 text-emerald-400" />
          <span>Mock Tests & Live Exams</span>
        </button>

        <button
          onClick={() => setActiveTab('SCHEDULE')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'SCHEDULE' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Study Schedule Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('WEIGHTAGE')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'WEIGHTAGE' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <span>Subject Weightages</span>
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition ${
            activeTab === 'ANALYTICS' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Weak Topic Analytics</span>
        </button>
      </div>

      {/* RESOURCE LIBRARY TAB */}
      {activeTab === 'LIBRARY' && (
        <div className="space-y-4">
          
          {/* Controls & Search */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Category Filter:</span>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="ALL">All Categories</option>
                <option value="PREVIOUS_YEAR_QUESTIONS">PYQs</option>
                <option value="PYQ_PAPER">PYQ Paper</option>
                <option value="FORMULA_SHEET">Formula Sheets</option>
                <option value="STUDY_NOTES">Study Notes</option>
                <option value="MOCK_TEST">Mock Test Papers</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search PYQs, topics, or formula sheets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-slate-900 dark:text-white placeholder-slate-400 w-full"
              />
            </div>
          </div>

          {/* Grid of Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.length === 0 ? (
              <div className="col-span-full py-12 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                No educational resources matching filters.
              </div>
            ) : (
              resources.map(res => {
                const isBookmarked = bookmarks.includes(res.id);
                return (
                  <div
                    key={res.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 hover:border-blue-500 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-extrabold text-[10px]">
                          GATE {res.gatePaper} • {res.resourceType.replace(/_/g, ' ')}
                        </span>

                        <button
                          onClick={() => handleToggleBookmark(res.id)}
                          className={`p-1.5 rounded-xl transition ${
                            isBookmarked ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">
                        {res.title}
                      </h4>

                      <p className="text-slate-500 text-xs line-clamp-2">{res.description}</p>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                        <div>Subject: <strong className="text-slate-900 dark:text-slate-200">{res.subject}</strong></div>
                        <div>Topic: <strong className="text-slate-900 dark:text-slate-200">{res.topic}</strong></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          GateService.incrementView(res.id);
                          onOpenPdfViewer(res);
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md transition"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Read in App</span>
                      </button>

                      <button
                        onClick={() => handleDownload(res.id, res.fileUrl)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold flex items-center gap-1"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MOCK TESTS TAB */}
      {activeTab === 'MOCK_TESTS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-black text-slate-900 dark:text-white text-base">GATE Official Live Mock Test Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTests.map(test => (
              <div key={test.id} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                    GATE {test.gatePaper} OFFICIAL MOCK
                  </span>
                  <span className="text-slate-400 font-mono">{test.durationMinutes} Minutes</span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{test.title}</h4>
                <p className="text-slate-500">{test.description}</p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{test.totalQuestions} Questions • {test.totalMarks} Marks</span>
                  <button
                    onClick={() => setActiveMockTest(test)}
                    className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg transition"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Exam</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDY SCHEDULE TAB */}
      {activeTab === 'SCHEDULE' && (
        <StudyScheduleGenerator currentUser={currentUser} />
      )}

      {/* SUBJECT WEIGHTAGE TAB */}
      {activeTab === 'WEIGHTAGE' && (
        <SubjectWeightageManager currentUser={currentUser} isAdmin={false} />
      )}

      {/* WEAK TOPIC ANALYTICS TAB */}
      {activeTab === 'ANALYTICS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="font-black text-slate-900 dark:text-white text-base">Personalized Performance & Weak Topic Identification</h3>
          
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
            <h4 className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Topics Requiring Extra Revision (Accuracy &lt; 60%)</span>
            </h4>

            {weakTopics.length === 0 ? (
              <p className="text-amber-800 dark:text-amber-400 italic">No weak topics detected! Complete more mock tests to get personalized diagnostic recommendations.</p>
            ) : (
              <div className="space-y-3">
                {weakTopics.map((wt, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{wt.subject}: {wt.topic}</span>
                      <p className="text-slate-500 text-[11px]">Calculated Accuracy: {wt.accuracy}%</p>
                    </div>

                    {wt.recommendedResources.length > 0 && (
                      <button
                        onClick={() => onOpenPdfViewer(wt.recommendedResources[0])}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                      >
                        Open Recommended Notes
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Exam Runner Modal */}
      <MockTestRunnerModal
        mockTest={activeMockTest}
        isOpen={!!activeMockTest}
        onClose={() => setActiveMockTest(null)}
        currentUser={currentUser}
        onAttemptCompleted={() => {
          if (onRefreshData) onRefreshData();
        }}
      />
    </div>
  );
};
