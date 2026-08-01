import React, { useState } from 'react';
import { User, CareerRoadmap } from '../../../types';
import {
  TrendingUp,
  Sparkles,
  Compass,
  Target,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Milestone,
  ArrowRight,
  BookOpen,
  RefreshCw
} from 'lucide-react';

interface Props {
  user: User;
}

export const CareerDashboard: React.FC<Props> = ({ user }) => {
  const [careerGoal, setCareerGoal] = useState('Full Stack AI Engineer');
  const [isGenerating, setIsGenerating] = useState(false);

  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>({
    recommendedRole: 'Full Stack AI Engineer',
    predictedSalaryRange: '₹8.5 LPA - ₹18.0 LPA',
    futureDemand: 'High Growth',
    industryTrends: [
      'Demand for Web Developers with LLM API & Vector Database integration skills increased by 140% in tier-1 product companies.',
      'Transition from static monolithic web frameworks towards Server-Side Rendered Edge apps with AI microservices.',
      'Recruiters prioritize candidates with public open-source project contributions and active GitHub portfolios.'
    ],
    roadmapMilestones: [
      {
        phase: 'Phase 1 (Month 1-2)',
        title: 'Core Algorithm Design & Web Microservices',
        duration: '8 Weeks',
        skillsToMaster: ['LeetCode Data Structures', 'React 19 Hooks & State', 'Express API Security', 'PostgreSQL & Redis']
      },
      {
        phase: 'Phase 2 (Month 3-4)',
        title: 'Cloud Infrastructure & AI Integration',
        duration: '8 Weeks',
        skillsToMaster: ['Docker Containerization', 'Google Gemini API SDK', 'Vector DB (Pinecone)', 'ATS Resume Optimization']
      },
      {
        phase: 'Phase 3 (Month 5-6)',
        title: 'Mock Placement Drives & High-Scale Project Portfolio',
        duration: '8 Weeks',
        skillsToMaster: ['System Design Architecture', 'Live Peer Mock Interviews', 'On-Campus Placement Drives']
      }
    ]
  });

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            name: user.name,
            department: user.department,
            skills: user.skills
          },
          careerGoal
        })
      });
      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      console.error('Error generating career roadmap:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Career Intelligence
              </span>
              <span className="text-xs text-indigo-200">Personalized Insights</span>
            </div>
            <h2 className="text-xl font-bold">Career Recommendation & Industry Roadmap</h2>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-2xl">
              Target role forecasts, salary distributions, future market demand trends, and step-by-step personalized learning roadmaps.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="e.g. SDE, Data Scientist, DevOps..."
              className="px-3 py-2 text-xs rounded-xl border border-indigo-800 bg-slate-900/80 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 md:w-64"
            />
            <button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg"
            >
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isGenerating ? 'Building...' : 'Generate Roadmap'}
            </button>
          </div>
        </div>
      </div>

      {roadmap && (
        <div className="space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Career Path</span>
                <Target className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{roadmap.recommendedRole}</div>
              <p className="text-[11px] text-slate-400 mt-1">Matched to {user.department} academic curriculum</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Predicted Package Range</span>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{roadmap.predictedSalaryRange}</div>
              <p className="text-[11px] text-slate-400 mt-1">Based on recent CKCET campus placement statistics</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Industry Market Demand</span>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{roadmap.futureDemand}</div>
              <p className="text-[11px] text-slate-400 mt-1">High recruiter demand over next 3-5 years</p>
            </div>
          </div>

          {/* Industry Trends */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Compass className="h-4 w-4 text-indigo-600" />
              Current Tech Industry Hiring Trends
            </h3>
            <div className="space-y-2">
              {roadmap.industryTrends.map((trend, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{trend}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Milestone Roadmap */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Milestone className="h-5 w-5 text-indigo-600" />
              Step-by-Step AI Learning Roadmap
            </h3>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-indigo-100 dark:before:bg-indigo-950">
              {roadmap.roadmapMilestones.map((ms, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950" />
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {ms.phase} • {ms.duration}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ms.title}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1">Key Competencies to Master:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {ms.skillsToMaster.map((sk, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
