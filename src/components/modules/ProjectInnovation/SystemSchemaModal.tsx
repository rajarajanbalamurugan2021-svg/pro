import React, { useState } from 'react';
import {
  X,
  Database,
  Code2,
  FileCode,
  Copy,
  Check,
  Layers,
  Server,
  KeyRound
} from 'lucide-react';

interface SystemSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemSchemaModal: React.FC<SystemSchemaModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'er' | 'api'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlSchemaScript = `-- =========================================================================
-- Student Project Collaboration & Innovation Management Platform
-- SQL Database Migration Schema (MySQL / PostgreSQL Compatible)
-- =========================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    role ENUM('super_admin', 'admin', 'faculty', 'student', 'mentor') NOT NULL DEFAULT 'student',
    department VARCHAR(128) NOT NULL,
    roll_number VARCHAR(64) NULL,
    employee_id VARCHAR(64) NULL,
    phone VARCHAR(32) NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_skills (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    skill_name VARCHAR(64) NOT NULL,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Intermediate',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    department VARCHAR(128) NOT NULL,
    owner_id VARCHAR(64) NOT NULL,
    faculty_mentor_id VARCHAR(64) NULL,
    stage ENUM('Idea Submission', 'Proposal Upload', 'Faculty Review', 'Approval', 'Team Formation', 'Development', 'Testing', 'Documentation', 'Final Submission', 'Evaluation', 'Completed', 'Rejected') DEFAULT 'Idea Submission',
    status ENUM('Pending Approval', 'Approved', 'Changes Requested', 'Rejected', 'Completed') DEFAULT 'Pending Approval',
    innovation_score INT DEFAULT 85,
    max_team_size INT DEFAULT 4,
    github_repo VARCHAR(255) NULL,
    demo_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_mentor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS project_members (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    role_title VARCHAR(64) DEFAULT 'Team Member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_milestones (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    due_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_documents (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('Proposal', 'Report', 'Presentation', 'SourceCode', 'Document') NOT NULL,
    url VARCHAR(512) NOT NULL,
    uploaded_by VARCHAR(64) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_reviews (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    faculty_id VARCHAR(64) NOT NULL,
    comments TEXT NOT NULL,
    innovation_grade INT CHECK (innovation_grade BETWEEN 0 AND 10),
    technical_grade INT CHECK (technical_grade BETWEEN 0 AND 10),
    presentation_grade INT CHECK (presentation_grade BETWEEN 0 AND 10),
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    decision ENUM('Approved', 'Changes Requested', 'Rejected') NOT NULL,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE
);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Database Schema & REST API Documentation</h2>
              <p className="text-xs text-slate-500">SQL Scripts, Entity-Relationship Models & OpenAPI Endpoints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCode className="h-4 w-4" /> MySQL / SQL Schema
          </button>

          <button
            onClick={() => setActiveTab('er')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'er'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" /> ER Diagram Architecture
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Server className="h-4 w-4" /> REST API Endpoints
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Production SQL DDL Script
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied SQL' : 'Copy DDL'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono leading-relaxed overflow-x-auto border border-slate-800">
                {sqlSchemaScript}
              </pre>
            </div>
          )}

          {activeTab === 'er' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Entity Relationship Diagram mapping user roles, project workflow stages, and evaluation matrices.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Users ↔ Projects</h4>
                  <p className="text-slate-500">1:N Relationship — A Student owns 1 to many Projects. A Faculty mentors multiple Projects.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Projects ↔ ProjectMembers</h4>
                  <p className="text-slate-500">1:N Relationship — Projects contain multiple assigned Student Members with distinct skill roles.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Projects ↔ Milestones & Tasks</h4>
                  <p className="text-slate-500">1:N Relationship — Project progress is tracked via milestone checkpoints and kanban tasks.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Projects ↔ Reviews & Scores</h4>
                  <p className="text-slate-500">1:N Relationship — Faculty submit rubrics (0-10) generating overall innovation score (0-100).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono space-y-2 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">POST</span>
                  <span className="text-slate-300">/api/ai/suggest-project</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-2">
                  Generates AI project title, abstract, required skills, tags, and milestones via Gemini 3.6 API.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono space-y-2 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px]">POST</span>
                  <span className="text-slate-300">/api/ai/match-teammates</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-2">
                  Calculates skill matrix match percentages between required project skills and candidate student profiles.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono space-y-2 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">GET</span>
                  <span className="text-slate-300">/api/health</span>
                </div>
                <p className="text-slate-400 text-[11px] pl-2">
                  Checks server health status and Gemini API key connectivity.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
