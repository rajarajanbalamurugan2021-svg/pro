import React, { useState } from 'react';
import { User, ResumeAnalysisResult } from '../../../types';
import {
  FileCheck2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Zap,
  Award,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface Props {
  user: User;
}

export const ResumeAnalyzer: React.FC<Props> = ({ user }) => {
  const [resumeText, setResumeText] = useState(
    `ALEX RIVERA
Email: alex.rivera@student.edu | Phone: +1 (555) 012-3456 | Roll: CS2023001
Department: Computer Science & Engineering | CGPA: 8.8 / 10.0

OBJECTIVE:
Enthusiastic SDE candidate with solid expertise in React.js, Python, Node.js, and AI algorithms.

TECHNICAL SKILLS:
- Languages: Python, Java, C++, TypeScript, JavaScript, SQL
- Web Stack: React 19, Express.js, Tailwind CSS, REST APIs
- AI/ML: TensorFlow, OpenCV, Gemini API SDK
- Tools: Git, Docker, Postman, VS Code

PROJECTS:
1. Autonomous Campus AI Guard System (React, Python, OpenCV)
- Built real-time computer vision threat detector with 94% accuracy.
- Integrated WebSocket notification alerts for campus security.

2. Smart Library QR Attendance System (Node.js, PostgreSQL)
- Developed automated QR scan module serving 1,200+ daily student check-ins.`
  );

  const [targetJobDesc, setTargetJobDesc] = useState(
    'Software Development Engineer (SDE-1) at Cloud SaaS Company. Required: Java/Python, React.js, Microservices, REST APIs, SQL, Docker, Unit Testing, CI/CD, Problem Solving.'
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>({
    score: 86,
    detectedSections: ['Contact Information', 'Education & CGPA', 'Technical Skills', 'Projects & Achievements'],
    missingSections: ['Quantifiable Impact Metrics', 'Work Experience / Internships', 'Cloud Certification Badges'],
    keyStrengths: [
      'Strong foundational stack matching modern Full-Stack engineering requirements.',
      'Clear project achievements with technical stack tags and metrics.'
    ],
    suggestedImprovements: [
      'Add bullet points quantifying project efficiency improvements (e.g., "Reduced latency by 35%").',
      'Integrate missing ATS keywords: Docker, Microservices, CI/CD Pipelines, Unit Testing.',
      'Include hyperlinked GitHub & LinkedIn profile handles at top.'
    ],
    atsKeywords: {
      present: ['React.js', 'Python', 'Node.js', 'TypeScript', 'SQL', 'REST APIs', 'Git', 'OpenCV'],
      missing: ['Docker', 'Microservices', 'CI/CD Pipelines', 'Unit Testing', 'AWS Cloud']
    },
    summary: 'High-quality technical resume. Adding cloud container keywords and measurable project outcomes will elevate the ATS match score above 92%.'
  });

  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/score-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetJobDescription: targetJobDesc
        })
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing resume:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            AI Resume Analyzer & ATS Optimizer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated resume scoring, missing section detection, ATS keyword matching, and improvement recommendations powered by Gemini.
          </p>
        </div>

        <button
          onClick={handleAnalyzeResume}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
        >
          {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {isAnalyzing ? 'Scoring Resume...' : 'Score Resume'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Resume & Target Job Description */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-indigo-500" />
              Resume Plaintext Content
            </label>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste student resume text here..."
              className="w-full p-3 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2 flex items-center gap-1.5">
              <Search className="h-4 w-4 text-purple-500" />
              Target Job Description (for ATS Keyword Tuning)
            </label>
            <textarea
              rows={4}
              value={targetJobDesc}
              onChange={(e) => setTargetJobDesc(e.target.value)}
              placeholder="Paste target job role requirements..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Right Column: AI Analysis Results */}
        <div className="lg:col-span-6 space-y-6">
          {analysis && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {/* Score Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white">
                <div>
                  <span className="text-xs text-indigo-200 block">Overall Resume ATS Score</span>
                  <p className="text-[11px] text-indigo-300/80">{analysis.summary}</p>
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  {analysis.score}<span className="text-sm font-normal text-slate-400">/100</span>
                </div>
              </div>

              {/* Detected vs Missing Sections */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Detected Sections
                  </h4>
                  <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    {analysis.detectedSections.map((sec, i) => (
                      <li key={i}>• {sec}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Missing Sections
                  </h4>
                  <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    {analysis.missingSections.map((sec, i) => (
                      <li key={i}>• {sec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ATS Keywords Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-indigo-500" /> ATS Keywords Optimization
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                      Matched Keywords ({analysis.atsKeywords.present.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {analysis.atsKeywords.present.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold rounded">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                      Missing High-Impact Keywords ({analysis.atsKeywords.missing.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {analysis.atsKeywords.missing.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-semibold rounded">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Improvement Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-purple-500" /> Suggested ATS Improvements
                </h4>
                <div className="space-y-1.5">
                  {analysis.suggestedImprovements.map((imp, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      💡 {imp}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
