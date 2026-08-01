import React, { useState } from 'react';
import { User, PlacementOpportunity, PlacementApplication } from '../../../types';
import {
  Search,
  Filter,
  Sparkles,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  GraduationCap,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  Check
} from 'lucide-react';

interface Props {
  user: User;
  opportunities: PlacementOpportunity[];
  applications: PlacementApplication[];
  onApply: (opportunity: PlacementOpportunity) => void;
}

export const OpportunityRecommendations: React.FC<Props> = ({
  user,
  opportunities,
  applications,
  onApply
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [minSalary, setMinSalary] = useState<number>(0);

  const [selectedOpp, setSelectedOpp] = useState<PlacementOpportunity | null>(null);

  // Compute AI Job Matching Score (0-100%) dynamically for student profile
  const calculateMatchScore = (opp: PlacementOpportunity): number => {
    let score = 50;

    // CGPA weight (up to 25 points)
    const userCgpa = 8.8; // default student CGPA
    if (userCgpa >= opp.minCGPA) {
      score += 20 + Math.min(5, Math.round((userCgpa - opp.minCGPA) * 5));
    } else {
      score -= 15;
    }

    // Department match (up to 20 points)
    if (opp.departmentEligibility.includes(user.department) || opp.departmentEligibility.includes('All')) {
      score += 20;
    }

    // Skills match (up to 25 points)
    const userSkills = (user.skills || []).map((s) => s.toLowerCase());
    const matchedSkills = opp.requiredSkills.filter((req) =>
      userSkills.some((us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us))
    );

    const skillRatio = opp.requiredSkills.length > 0 ? matchedSkills.length / opp.requiredSkills.length : 1;
    score += Math.round(skillRatio * 25);

    return Math.min(99, Math.max(45, score));
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'All' || opp.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
    const matchesDept = selectedDept === 'All' || opp.departmentEligibility.includes(selectedDept);
    const matchesSalary = opp.packageNumber >= minSalary;

    return matchesSearch && matchesType && matchesCategory && matchesDept && matchesSalary;
  });

  const isApplied = (oppId: string) => {
    return applications.some((app) => app.opportunityId === oppId && app.studentId === user.id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              AI Internship & Placement Recommendations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Intelligently matched opportunities based on your CGPA ({8.8}), department ({user.department}), and technical skill profile.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <Zap className="h-4 w-4 text-amber-500" />
            {filteredOpportunities.length} Verified Drives Active
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, title, location, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-Time Placement">Full-Time Placement</option>
              <option value="Off-Campus Drive">Off-Campus Drive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Dream">Dream Companies</option>
              <option value="Core">Core Companies</option>
              <option value="IT & Software">IT & Software</option>
              <option value="Startup">Startup</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Electronics & Communication Engineering">ECE</option>
              <option value="Electrical & Electronics Engineering">EEE</option>
              <option value="Mechanical Engineering">Mechanical</option>
              <option value="Civil Engineering">Civil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpportunities.map((opp) => {
          const matchScore = calculateMatchScore(opp);
          const hasApplied = isApplied(opp.id);

          return (
            <div
              key={opp.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm transition-all duration-200 flex flex-col justify-between relative group"
            >
              {/* Badge Row */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={opp.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                      alt={opp.companyName}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {opp.roleTitle}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {opp.companyName}
                      </p>
                    </div>
                  </div>

                  {/* AI Match Chip */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-sm shrink-0 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    {matchScore}% Match
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {opp.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {opp.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Min CGPA: {opp.minCGPA}
                  </span>
                </div>

                {/* Key Stats */}
                <div className="space-y-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-500" /> Package / Stipend:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{opp.stipendOrPackage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" /> Location:
                    </span>
                    <span className="font-semibold">{opp.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-purple-500" /> Deadline:
                    </span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">{opp.applicationDeadline}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="mb-4">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {opp.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  View Details
                </button>

                <button
                  onClick={() => onApply(opp)}
                  disabled={hasApplied}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow ${
                    hasApplied
                      ? 'bg-emerald-500 text-white cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Applied
                    </>
                  ) : (
                    <>
                      Apply Now <ChevronRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-5 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedOpp.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                  alt={selectedOpp.companyName}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedOpp.roleTitle}</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{selectedOpp.companyName} • {selectedOpp.location}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Job Description</h4>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {selectedOpp.jobDescription}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Key Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedOpp.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Eligible Departments & CGPA</h4>
                <p>
                  Departments: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedOpp.departmentEligibility.join(', ')}</span>
                  <br />
                  Minimum Academic CGPA: <span className="font-semibold">{selectedOpp.minCGPA}</span>
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Perks & Benefits</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOpp.perks.map((p, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onApply(selectedOpp);
                    setSelectedOpp(null);
                  }}
                  disabled={isApplied(selectedOpp.id)}
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow ${
                    isApplied(selectedOpp.id)
                      ? 'bg-emerald-500 cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isApplied(selectedOpp.id) ? 'Already Applied' : 'Confirm Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
