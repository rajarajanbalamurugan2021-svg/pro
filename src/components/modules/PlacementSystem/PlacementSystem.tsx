import React, { useState, useEffect } from 'react';
import { User, PlacementOpportunity, PlacementApplication, InterviewQuestion } from '../../../types';
import { CampusStorage } from '../../../services/api';

import { StudentProfileAnalysis } from './StudentProfileAnalysis';
import { OpportunityRecommendations } from './OpportunityRecommendations';
import { ResumeAnalyzer } from './ResumeAnalyzer';
import { InterviewPrep } from './InterviewPrep';
import { CareerDashboard } from './CareerDashboard';
import { ApplicationTracker } from './ApplicationTracker';
import { PlacementOfficerDashboard } from './PlacementOfficerDashboard';
import { RecruiterPortal } from './RecruiterPortal';
import { PlacementAnalytics } from './PlacementAnalytics';

import {
  Sparkles,
  UserCheck,
  Briefcase,
  FileCheck2,
  Brain,
  Compass,
  Clock,
  Building2,
  Users,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface Props {
  user: User;
  onUpdateUser?: (user: User) => void;
}

export const PlacementSystem: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'recommendations' | 'resume' | 'interview' | 'career' | 'applications' | 'officer' | 'recruiter' | 'analytics'
  >('recommendations');

  const [opportunities, setOpportunities] = useState<PlacementOpportunity[]>([]);
  const [applications, setApplications] = useState<PlacementApplication[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load placement data from CampusStorage
  useEffect(() => {
    const opps = CampusStorage.getPlacementOpportunities();
    const apps = CampusStorage.getPlacementApplications();
    const qns = CampusStorage.getInterviewQuestions();

    setOpportunities(opps);
    setApplications(apps);
    setInterviewQuestions(qns);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Student apply to opportunity handler
  const handleApplyToOpportunity = (opportunity: PlacementOpportunity) => {
    const newApp: PlacementApplication = {
      id: `app-${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email || 'alex.rivera@student.edu',
      studentRoll: user.rollNumber || 'CS2023001',
      department: user.department || 'Computer Science & Engineering',
      cgpa: 8.8,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.roleTitle,
      companyName: opportunity.companyName,
      type: opportunity.type,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'Applied',
      matchingScore: 88,
      resumeUrl: user.githubProfile || 'https://ckcet.ac.in/resumes/CS2023001_AlexRivera.pdf'
    };

    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    CampusStorage.savePlacementApplications(updatedApps);

    // Update opportunity applicant count
    const updatedOpps = opportunities.map((opp) =>
      opp.id === opportunity.id ? { ...opp, applicantsCount: opp.applicantsCount + 1 } : opp
    );
    setOpportunities(updatedOpps);
    CampusStorage.savePlacementOpportunities(updatedOpps);

    showToast(`Successfully submitted application for ${opportunity.roleTitle} at ${opportunity.companyName}!`);
  };

  // Placement officer save opportunity handler
  const handleSaveOpportunity = (opp: PlacementOpportunity) => {
    const exists = opportunities.some((o) => o.id === opp.id);
    let updatedOpps: PlacementOpportunity[];
    if (exists) {
      updatedOpps = opportunities.map((o) => (o.id === opp.id ? opp : o));
    } else {
      updatedOpps = [opp, ...opportunities];
    }
    setOpportunities(updatedOpps);
    CampusStorage.savePlacementOpportunities(updatedOpps);
    showToast(`Saved posting for ${opp.roleTitle} at ${opp.companyName}!`);
  };

  // Placement officer delete opportunity handler
  const handleDeleteOpportunity = (oppId: string) => {
    const updatedOpps = opportunities.filter((o) => o.id !== oppId);
    setOpportunities(updatedOpps);
    CampusStorage.savePlacementOpportunities(updatedOpps);
    showToast('Opportunity removed successfully.');
  };

  // Recruiter update status handler
  const handleUpdateApplicationStatus = (
    appId: string,
    status: any,
    interviewDate?: string,
    interviewLocation?: string,
    notes?: string
  ) => {
    const updated = applications.map((app) =>
      app.id === appId
        ? {
            ...app,
            status,
            interviewDate: interviewDate || app.interviewDate,
            interviewLocation: interviewLocation || app.interviewLocation,
            notes: notes || app.notes
          }
        : app
    );
    setApplications(updated);
    CampusStorage.savePlacementApplications(updated);
    showToast(`Application status updated to "${status}".`);
  };

  return (
    <div className="space-y-6">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce border border-indigo-500/30">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Placement System Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="h-4 w-4" /> Opportunities & AI Match
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="h-4 w-4" /> AI Profile & Skill Gap
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'resume'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="h-4 w-4" /> ATS Resume Analyzer
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'interview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Brain className="h-4 w-4" /> AI Interview Prep
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'career'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="h-4 w-4" /> Career Roadmap
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'applications'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="h-4 w-4" /> Applications ({applications.length})
        </button>

        {/* Role-Specific Portal Tabs */}
        {(user.role === 'placement_officer' || user.role === 'admin' || user.role === 'faculty') && (
          <button
            onClick={() => setActiveTab('officer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'officer'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
            }`}
          >
            <Building2 className="h-4 w-4" /> Placement Officer Drive
          </button>
        )}

        {(user.role === 'recruiter' || user.role === 'admin') && (
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'recruiter'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100'
            }`}
          >
            <Users className="h-4 w-4" /> Recruiter Portal
          </button>
        )}

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100'
          }`}
        >
          <BarChart3 className="h-4 w-4" /> Analytics & Reports
        </button>
      </div>

      {/* Dynamic Content Views */}
      {activeTab === 'recommendations' && (
        <OpportunityRecommendations
          user={user}
          opportunities={opportunities}
          applications={applications}
          onApply={handleApplyToOpportunity}
        />
      )}

      {activeTab === 'profile' && (
        <StudentProfileAnalysis user={user} onUpdateUser={onUpdateUser} />
      )}

      {activeTab === 'resume' && <ResumeAnalyzer user={user} />}

      {activeTab === 'interview' && (
        <InterviewPrep user={user} questions={interviewQuestions} />
      )}

      {activeTab === 'career' && <CareerDashboard user={user} />}

      {activeTab === 'applications' && (
        <ApplicationTracker user={user} applications={applications} />
      )}

      {activeTab === 'officer' && (
        <PlacementOfficerDashboard
          user={user}
          opportunities={opportunities}
          applications={applications}
          onSaveOpportunity={handleSaveOpportunity}
          onDeleteOpportunity={handleDeleteOpportunity}
        />
      )}

      {activeTab === 'recruiter' && (
        <RecruiterPortal
          user={user}
          opportunities={opportunities}
          applications={applications}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
        />
      )}

      {activeTab === 'analytics' && (
        <PlacementAnalytics
          user={user}
          opportunities={opportunities}
          applications={applications}
        />
      )}
    </div>
  );
};
