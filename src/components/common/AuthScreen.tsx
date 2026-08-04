import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/initialData';
import { Logo } from './Logo';
import { normalizeRole, getRoleDisplayName, NormalizedRole } from '../../lib/rbac';
import {
  GraduationCap,
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Crown
} from 'lucide-react';

interface AuthScreenProps {
  users: User[];
  onLogin: (user: User, role: UserRole) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ users, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<NormalizedRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeUsers = users && users.length > 0 ? users : INITIAL_USERS;

  const prepareAuthUser = (baseUser: User, roleOverride?: NormalizedRole): User => {
    const roleToSet = roleOverride || normalizeRole(baseUser.role);
    const nowISO = new Date().toISOString();
    return {
      ...baseUser,
      uid: baseUser.uid || baseUser.id || `uid-${Date.now()}`,
      role: roleToSet as UserRole,
      accountStatus: baseUser.accountStatus || 'Active',
      createdAt: baseUser.createdAt || nowISO,
      lastLogin: nowISO
    };
  };

  const handleDemoLogin = (role: NormalizedRole) => {
    const matched = activeUsers.find((u) => normalizeRole(u.role) === role) || activeUsers[0];
    const authenticatedUser = prepareAuthUser(matched, role);
    onLogin(authenticatedUser, authenticatedUser.role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your registered college email.');
        return;
      }
      setSuccessMsg(`Password reset link sent to ${email}. Check your inbox.`);
      return;
    }

    if (mode === 'login') {
      if (!email && !password) {
        // Fallback demo match if empty submit
        handleDemoLogin(selectedRole);
        return;
      }
      const foundUser = activeUsers.find(
        (u) => (email && u.email.toLowerCase() === email.toLowerCase()) || normalizeRole(u.role) === selectedRole
      );
      if (foundUser) {
        const authenticatedUser = prepareAuthUser(foundUser);
        onLogin(authenticatedUser, authenticatedUser.role);
      } else {
        const fallback = activeUsers.find((u) => normalizeRole(u.role) === selectedRole) || activeUsers[0];
        const authenticatedUser = prepareAuthUser(fallback, selectedRole);
        onLogin(authenticatedUser, authenticatedUser.role);
      }
    } else if (mode === 'register') {
      if (!fullName || !email || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      const nowISO = new Date().toISOString();
      const newUid = `usr-${Date.now()}`;
      const newUser: User = {
        id: newUid,
        uid: newUid,
        name: fullName,
        email,
        role: selectedRole as UserRole,
        department,
        accountStatus: 'Active',
        createdAt: nowISO,
        lastLogin: nowISO,
        phone: '+1 555-0199',
        status: 'active',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
      };
      onLogin(newUser, selectedRole as UserRole);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background blur circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 my-8">
        
        {/* Header Branding */}
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo size="xl" showText={false} className="mb-3" />
          <h1 className="text-2xl font-black text-white tracking-tight">
            CKCET <span className="text-blue-400">CAMPRO</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise RBAC Campus Management & Analytics Platform
          </p>
        </div>

        {/* Quick Demo Access Bar for All Allowed Roles */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 text-center flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Select Demo Role to Sign In Immediately</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('super_admin')}
              className="py-2 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1"
            >
              <Crown className="h-4 w-4 text-purple-400" />
              <span>SuperAdmin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-2 px-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1"
            >
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('faculty')}
              className="py-2 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1"
            >
              <UserIcon className="h-4 w-4 text-blue-400" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1"
            >
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span>Student</span>
            </button>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-5 border border-slate-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              mode === 'login' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
              mode === 'register' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'forgot' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Registered College Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@campus.edu"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <KeyRound className="h-4 w-4" />
              <span>Send Password Reset Link</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-slate-400 hover:text-white transition"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                College Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@campus.edu"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select User Role Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('super_admin')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                    selectedRole === 'super_admin'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  SuperAdmin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                    selectedRole === 'admin'
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('faculty')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                    selectedRole === 'faculty'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Faculty
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition ${
                    selectedRole === 'student'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Student
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Academic Registrar">Academic Registrar</option>
                  <option value="Executive Board">Executive Board</option>
                </select>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember active session</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              <span>{mode === 'login' ? `Sign In as ${getRoleDisplayName(selectedRole)}` : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Role-Based Access Control Active • Automatic Dashboard Redirection</span>
        </div>
      </div>
    </div>
  );
};
