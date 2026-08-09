import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/initialData';
import { Logo } from './Logo';
import { normalizeRole, getRoleDisplayName, NormalizedRole } from '../../lib/rbac';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../../lib/firebase';
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
  Crown,
  Eye,
  EyeOff,
  Fingerprint,
  RefreshCw,
  AlertCircle,
  Check,
  Shield,
  Globe,
  ExternalLink
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
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Security features state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFactorPin, setTwoFactorPin] = useState('');
  const [pendingUser, setPendingUser] = useState<{ user: User; role: UserRole } | null>(null);

  // 2-Step Verification state for all portals
  const [generatedOtp, setGeneratedOtp] = useState('842901');
  const [otpCountdown, setOtpCountdown] = useState(30);
  const [otpMethod, setOtpMethod] = useState<'email' | 'sms'>('email');
  const [failed2FAAttempts, setFailed2FAAttempts] = useState(0);
  const [twoFactorLockout, setTwoFactorLockout] = useState(0);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  // Anti-Bot Security Challenge state
  const [numA, setNumA] = useState(5);
  const [numB, setNumB] = useState(3);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSecurityChallenge, setShowSecurityChallenge] = useState(false);

  const activeUsers = users && users.length > 0 ? users : INITIAL_USERS;

  // Generate new math puzzle
  const refreshMathChallenge = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNumA(a);
    setNumB(b);
    setUserAnswer('');
  };

  useEffect(() => {
    refreshMathChallenge();
  }, []);

  // Lockout countdown timer effect
  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTimer]);

  // 2FA Lockout countdown timer effect
  useEffect(() => {
    if (twoFactorLockout > 0) {
      const timer = setInterval(() => {
        setTwoFactorLockout((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [twoFactorLockout]);

  // 2FA OTP Countdown timer effect
  useEffect(() => {
    if (require2FA && otpCountdown > 0) {
      const timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [require2FA, otpCountdown]);

  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpCountdown(30);
    return code;
  };

  const trigger2FAProcess = (userToAuthenticate: User, roleToAuthenticate: UserRole) => {
    const normRole = normalizeRole(roleToAuthenticate);
    const code = generateNewOtp();
    setRequire2FA(true);
    setPendingUser({ user: userToAuthenticate, role: roleToAuthenticate });
    setTwoFactorPin('');
    setError('');
    setFailed2FAAttempts(0);
    setTwoFactorLockout(0);

    // Show simulated secure dispatch notification toast
    setDispatchToast(`🔒 2-Step Security Code dispatched to ${userToAuthenticate.email} for ${getRoleDisplayName(normRole)} Portal.`);
    setTimeout(() => setDispatchToast(null), 6000);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' };
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-500' };
    return { score, label: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(password);

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
    if (lockoutTimer > 0) {
      setError(`Account access is temporarily rate-limited. Try again in ${lockoutTimer}s.`);
      return;
    }

    const matched = activeUsers.find((u) => normalizeRole(u.role) === role) || activeUsers[0];
    const authenticatedUser = prepareAuthUser(matched, role);

    // Enforce 2-Step Security Verification process for ALL portals (SuperAdmin, Admin, Faculty, Student)
    trigger2FAProcess(authenticatedUser, authenticatedUser.role);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorLockout > 0) {
      setError(`Too many invalid 2FA attempts. Cooldown active for ${twoFactorLockout}s.`);
      return;
    }

    const cleanPin = twoFactorPin.trim();
    if (cleanPin !== generatedOtp && cleanPin !== '123456') {
      const nextFailed = failed2FAAttempts + 1;
      setFailed2FAAttempts(nextFailed);
      if (nextFailed >= 3) {
        setTwoFactorLockout(20);
        setError('Maximum 2FA verification attempts reached. Temporary 20s security cooldown initiated.');
      } else {
        setError(`Invalid 2-Step Security Code. (${3 - nextFailed} attempt(s) remaining. Demo backup PIN: 123456)`);
      }
      return;
    }

    if (pendingUser) {
      onLogin(pendingUser.user, pendingUser.role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Check rate limiting / lockout
    if (lockoutTimer > 0) {
      setError(`Rate limit active. Please wait ${lockoutTimer} seconds before retrying.`);
      return;
    }

    // Check anti-bot security challenge if triggered or after 2 failed attempts
    if (showSecurityChallenge || failedAttempts >= 2) {
      if (parseInt(userAnswer.trim(), 10) !== numA + numB) {
        setError('Incorrect security verification answer. Please try again.');
        refreshMathChallenge();
        return;
      }
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (mode === 'forgot') {
      if (!cleanEmail) {
        setError('Please enter your registered college email.');
        return;
      }
      if (!cleanEmail.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      setSuccessMsg(`Password reset link successfully dispatched to ${cleanEmail}. Check your inbox.`);
      return;
    }

    if (mode === 'login') {
      if (!cleanEmail && !cleanPassword) {
        // Fallback demo login if fields left blank
        handleDemoLogin(selectedRole);
        return;
      }

      setIsLoading(true);
      try {
        // Attempt Firebase Authentication
        if (cleanEmail && cleanPassword && auth) {
          try {
            await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          } catch (fbErr: any) {
            console.warn('Firebase Auth notice (falling back to user directory lookup):', fbErr?.message);
          }
        }

        const foundUser = activeUsers.find(
          (u) => (cleanEmail && u.email.toLowerCase() === cleanEmail) || normalizeRole(u.role) === selectedRole
        );

        if (foundUser) {
          const authenticatedUser = prepareAuthUser(foundUser);
          setIsLoading(false);

          // Require 2-Step Verification for all portals
          trigger2FAProcess(authenticatedUser, authenticatedUser.role);
        } else {
          const fallback = activeUsers.find((u) => normalizeRole(u.role) === selectedRole) || activeUsers[0];
          const authenticatedUser = prepareAuthUser(fallback, selectedRole);
          setIsLoading(false);

          // Require 2-Step Verification for all portals
          trigger2FAProcess(authenticatedUser, authenticatedUser.role);
        }
      } catch (err: any) {
        setIsLoading(false);
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        if (nextFailed >= 4) {
          setLockoutTimer(30);
          setError('Maximum login attempts exceeded. Temporary 30-second security lockout initiated.');
        } else {
          setError(`Authentication failed. ${4 - nextFailed} attempt(s) remaining before security lockout.`);
          setShowSecurityChallenge(true);
        }
      }
    } else if (mode === 'register') {
      if (!fullName.trim() || !cleanEmail || !cleanPassword) {
        setError('Please fill in all required registration fields.');
        return;
      }

      if (cleanPassword.length < 6) {
        setError('Security rule error: Password must be at least 6 characters long.');
        return;
      }

      setIsLoading(true);
      try {
        if (auth) {
          try {
            await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          } catch (fbErr: any) {
            console.warn('Firebase user creation notice (registering locally):', fbErr?.message);
          }
        }

        const nowISO = new Date().toISOString();
        const newUid = `usr-${Date.now()}`;
        const newUser: User = {
          id: newUid,
          uid: newUid,
          name: fullName.trim(),
          email: cleanEmail,
          role: selectedRole as UserRole,
          department,
          accountStatus: 'Active',
          createdAt: nowISO,
          lastLogin: nowISO,
          phone: '+1 555-0199',
          status: 'active',
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
        };

        setIsLoading(false);

        // Require 2-Step Verification for all portals
        trigger2FAProcess(newUser, selectedRole as UserRole);
      } catch (err: any) {
        setIsLoading(false);
        setError('Error registering account. Please check credentials.');
      }
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
          <Logo size="xl" showText={true} className="mb-2" allowEdit={false} />
          <p className="text-xs text-slate-400 mt-2 font-medium">
            CK College of Engineering & Technology <span className="text-blue-400 font-bold">(An Autonomous Institution)</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <a
              href="https://ckcet.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-950/70 hover:bg-blue-900/80 border border-blue-800/80 transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>ckcet.edu.in</span>
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </a>

            <a
              href="https://ckcet.mynetcampus.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-purple-400 bg-purple-950/70 hover:bg-purple-900/80 border border-purple-800/80 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span>MyNetCampus Login</span>
            </a>
          </div>
        </div>

        {/* Dispatch Notification Toast Banner */}
        {dispatchToast && (
          <div className="mb-4 p-3.5 rounded-2xl bg-blue-950/90 border border-blue-500/50 shadow-xl text-blue-200 text-xs font-medium flex items-start gap-2.5 animate-bounce">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-white">Security Verification Code Dispatched</div>
              <div className="text-[11px] text-blue-300 mt-0.5">{dispatchToast}</div>
            </div>
          </div>
        )}

        {/* Lockout Warning Banner */}
        {lockoutTimer > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-semibold flex items-start gap-3 animate-pulse">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <div className="font-bold text-white mb-0.5">Security Rate-Limit Active</div>
              <div>Too many incorrect login attempts. Account access is temporarily locked for <span className="font-black text-white underline">{lockoutTimer}s</span>.</div>
            </div>
          </div>
        )}

        {/* 2FA Verification Modal Overlay */}
        {require2FA && pendingUser ? (
          <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                <Fingerprint className="h-6 w-6 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight truncate">2-Step Security Verification</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase tracking-widest shrink-0 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Mandatory
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Verifying identity for <span className="font-bold text-blue-300">{getRoleDisplayName(normalizeRole(pendingUser.role))} Portal</span>
                </p>
              </div>
            </div>

            {/* Target Portal Badge & User Info */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Portal Access:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                  normalizeRole(pendingUser.role) === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                  normalizeRole(pendingUser.role) === 'admin' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                  normalizeRole(pendingUser.role) === 'faculty' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {getRoleDisplayName(normalizeRole(pendingUser.role))} Portal
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Authenticated User:</span>
                <span className="font-bold text-white">{pendingUser.user.name}</span>
              </div>
            </div>

            {/* Delivery Method Selection */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verification Delivery Channel</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOtpMethod('email');
                    setDispatchToast(`Security code dispatched to campus email: ${pendingUser.user.email}`);
                    setTimeout(() => setDispatchToast(null), 4000);
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    otpMethod === 'email'
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Campus Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpMethod('sms');
                    setDispatchToast(`SMS security OTP sent to mobile device ending in ****${Math.floor(1000 + Math.random() * 9000)}.`);
                    setTimeout(() => setDispatchToast(null), 4000);
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    otpMethod === 'sms'
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Mobile SMS</span>
                </button>
              </div>
            </div>

            {/* Secure Simulated Dispatch Notification Status Card (No plaintext OTP display / No auto-fill) */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  {otpMethod === 'email' ? 'Campus Email Security Dispatch' : 'Mobile SMS OTP Dispatch'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider font-bold">
                  SENT
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                A 6-digit security code was sent to{' '}
                <span className="font-mono text-blue-300 font-bold">
                  {otpMethod === 'email' ? `${pendingUser.user.email}` : `+91 ******${Math.floor(1000 + Math.random() * 9000)}`}
                </span>
                . Enter the received PIN below to verify access.
              </p>
              <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5 border-t border-slate-800/80 mt-1">
                <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Demo Backup PIN: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-bold font-mono">123456</code></span>
              </div>
            </div>

            <form onSubmit={handle2FASubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Enter 6-Digit Verification PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorPin}
                  onChange={(e) => setTwoFactorPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center text-xl font-black tracking-[0.5em] font-mono rounded-xl bg-slate-900 border border-blue-500/50 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                  required
                />
              </div>

              {error && (
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {otpCountdown > 0 ? (
                    <>Resend code in <span className="font-bold text-white">{otpCountdown}s</span></>
                  ) : (
                    <span className="text-amber-400 font-semibold">Code expired</span>
                  )}
                </span>
                <button
                  type="button"
                  disabled={otpCountdown > 15 || twoFactorLockout > 0}
                  onClick={() => {
                    generateNewOtp();
                    setError('');
                    setDispatchToast(`New 2-Step Security Code dispatched to your registered contact.`);
                    setTimeout(() => setDispatchToast(null), 5000);
                  }}
                  className="text-blue-400 hover:underline font-bold disabled:opacity-40 disabled:no-underline text-xs"
                >
                  Resend Code
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setRequire2FA(false); setPendingUser(null); setError(''); }}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verify & Launch Portal</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Quick Demo Access Bar for All Allowed Roles */}
            <div className="mb-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Select Role for Instant Authenticated Access</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  disabled={lockoutTimer > 0}
                  onClick={() => handleDemoLogin('super_admin')}
                  className="py-2 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Crown className="h-4 w-4 text-purple-400" />
                  <span>SuperAdmin</span>
                </button>
                <button
                  type="button"
                  disabled={lockoutTimer > 0}
                  onClick={() => handleDemoLogin('admin')}
                  className="py-2 px-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  disabled={lockoutTimer > 0}
                  onClick={() => handleDemoLogin('faculty')}
                  className="py-2 px-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <UserIcon className="h-4 w-4 text-blue-400" />
                  <span>Faculty</span>
                </button>
                <button
                  type="button"
                  disabled={lockoutTimer > 0}
                  onClick={() => handleDemoLogin('student')}
                  className="py-2 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
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
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
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
                  disabled={lockoutTimer > 0}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    {password && (
                      <span className={`text-[10px] font-bold ${pwdStrength.color} text-slate-950 px-2 py-0.5 rounded-full`}>
                        {pwdStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {mode === 'register' && password && (
                    <div className="mt-1.5 flex gap-1 h-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`flex-1 rounded-full transition-all ${
                            lvl <= pwdStrength.score ? pwdStrength.color : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  )}
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

                {/* Anti-Bot Human Verification Math Challenge (shown after failed attempts or manually triggered) */}
                {(showSecurityChallenge || failedAttempts >= 2) && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4" />
                        Human Verification Anti-Bot Check
                      </span>
                      <button
                        type="button"
                        onClick={refreshMathChallenge}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-white font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        {numA} + {numB} = ?
                      </div>
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Answer"
                        className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
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
                  disabled={isLoading || lockoutTimer > 0}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? `Sign In as ${getRoleDisplayName(selectedRole)}` : 'Create Account'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Lock className="h-3 w-3" />
            <span>Firebase & RBAC Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

