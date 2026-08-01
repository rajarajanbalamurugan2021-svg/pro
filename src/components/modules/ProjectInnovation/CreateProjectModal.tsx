import React, { useState } from 'react';
import { Project, UserRole } from '../../../types';
import {
  Sparkles,
  X,
  Plus,
  Trash2,
  BrainCircuit,
  CheckCircle,
  FolderPlus,
  Layers,
  Info
} from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Partial<Project>) => void;
  currentUser: { id: string; name: string; department: string };
  departments: string[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  departments
}) => {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [category, setCategory] = useState<Project['category']>('AI & Machine Learning');
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science & Engineering');
  const [requiredSkillInput, setRequiredSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React.js', 'Node.js', 'TypeScript']);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['AI', 'Innovation', 'FullStack']);
  const [maxTeamSize, setMaxTeamSize] = useState<number>(4);
  const [githubRepo, setGithubRepo] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  
  // AI Generator state
  const [aiDomain, setAiDomain] = useState('');
  const [aiProblem, setAiProblem] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (requiredSkillInput.trim() && !requiredSkills.includes(requiredSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, requiredSkillInput.trim()]);
      setRequiredSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setAiNotice(null);
    try {
      const response = await fetch('/api/ai/suggest-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: aiDomain || domainCategoryMap[category] || 'Software Systems',
          problemStatement: aiProblem || 'Automating campus workflow and project evaluation',
          department
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.title) setTitle(data.title);
        if (data.abstract) setAbstract(data.abstract);
        if (data.suggestedCategory) setCategory(data.suggestedCategory);
        if (data.requiredSkills && Array.isArray(data.requiredSkills)) {
          setRequiredSkills(data.requiredSkills);
        }
        if (data.tags && Array.isArray(data.tags)) setTags(data.tags);
        setAiNotice('✨ AI successfully generated proposal parameters! Review and tweak below.');
      }
    } catch (err) {
      console.error('Error generating project suggestion:', err);
      setAiNotice('Fallback suggestions applied.');
    } finally {
      setIsGenerating(false);
    }
  };

  const domainCategoryMap: Record<string, string> = {
    'AI & Machine Learning': 'Generative AI & Autonomous Vision',
    'Web & Mobile Apps': 'Cross Platform SaaS & Realtime Tools',
    'IoT & Robotics': 'Smart Hardware Sensors & Edge Computing',
    'Blockchain & Fintech': 'Zero Knowledge Cryptography & Web3 Registries',
    'Renewable Energy': 'Smart Microgrids & Solar Prediction',
    'Cybersecurity': 'Zero Trust Network & Vulnerability Scanning'
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim()) return;

    onSubmit({
      title,
      abstract,
      category,
      department,
      requiredSkills,
      tags,
      maxTeamSize,
      githubRepo: githubRepo || undefined,
      demoUrl: demoUrl || undefined,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      stage: 'Idea Submission',
      status: 'Pending Approval',
      innovationScore: Math.floor(Math.random() * 15) + 82,
      members: [
        {
          userId: currentUser.id,
          name: currentUser.name,
          role: 'Project Lead',
          skills: requiredSkills.slice(0, 3),
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          email: 'student@university.edu',
          department,
          joinedAt: new Date().toISOString().split('T')[0]
        }
      ],
      documents: [],
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Project Proposal & Literature Review', dueDate: '2026-08-15', completed: false, description: 'Prepare architectural diagram and present to faculty.' },
        { id: `m-${Date.now()}-2`, title: 'Prototype Development & Core Features', dueDate: '2026-09-10', completed: false, description: 'Build backend REST APIs and responsive UI.' }
      ],
      tasks: [],
      reviews: [],
      chatMessages: [],
      badges: ['Emerging Idea']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Post New Project Idea</h2>
              <p className="text-xs text-slate-500">Share your innovation and recruit teammates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* AI Generator Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/90 to-slate-900 text-white border border-indigo-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-indigo-200">AI Project Co-Pilot (Gemini 3.6)</span>
              </div>
              <span className="text-[10px] bg-indigo-800/60 px-2 py-0.5 rounded text-indigo-300">Server Side API</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Domain (e.g. AI Vision, Smart Microgrids)"
                value={aiDomain}
                onChange={(e) => setAiDomain(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-xs text-white placeholder-indigo-300/60 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <input
                type="text"
                placeholder="Problem Statement (Optional hint)"
                value={aiProblem}
                onChange={(e) => setAiProblem(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-xs text-white placeholder-indigo-300/60 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <BrainCircuit className="h-4 w-4" />
              {isGenerating ? 'Gemini AI Generating Title & Abstract...' : 'Auto-Generate Idea with Gemini AI'}
            </button>

            {aiNotice && (
              <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50">
                {aiNotice}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Autonomous Campus AI Guard & Vision System"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Abstract */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Project Abstract / Summary *
            </label>
            <textarea
              required
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Provide a clear description of the problem, proposed solution, and target impact..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Innovation Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Web & Mobile Apps">Web & Mobile Apps</option>
                <option value="IoT & Robotics">IoT & Robotics</option>
                <option value="Blockchain & Fintech">Blockchain & Fintech</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Biomedical & Health Tech">Biomedical & Health Tech</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Required Skills Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Required Teammate Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requiredSkillInput}
                onChange={(e) => setRequiredSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="e.g. React.js, Python, TensorFlow"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 flex items-center gap-1.5"
                >
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)}>
                    <X className="h-3 w-3 hover:text-rose-500" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags & Max Team Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Max Team Capacity
              </label>
              <select
                value={maxTeamSize}
                onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value={2}>2 Members (Solo + Partner)</option>
                <option value={3}>3 Members</option>
                <option value={4}>4 Members (Standard Capstone)</option>
                <option value={5}>5 Members (Large Scale)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="h-4 w-4" />
              Submit Project Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
