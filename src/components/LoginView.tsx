import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Eye, 
  EyeOff,
  AlertCircle,
  Shield,
  UserCheck
} from 'lucide-react';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';

interface LoginViewProps {
  onLoginSuccess: (userName: string, email: string, isNewUser?: boolean, role?: 'admin' | 'user') => void;
  initialMode?: 'login' | 'register';
  initialRole?: 'user' | 'admin';
}

interface RegisteredAccount {
  name: string;
  email: string;
  password?: string;
  role?: 'admin' | 'user';
}

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  { name: 'Arshuu', email: 'arshuu8888@gmail.com', password: 'password123', role: 'admin' },
  { name: 'Raam Harish', email: 'harish@explorex.ai', password: 'password123', role: 'user' }
];

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  initialMode = 'login',
  initialRole = 'user'
}) => {
  const [activeRole, setActiveRole] = useState<'user' | 'admin'>(initialRole);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Nature', 'Adventure', 'Food']);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredAccount[]>([]);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // Load or seed registered accounts
  useEffect(() => {
    try {
      const saved = localStorage.getItem('explorex_registered_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRegisteredUsers(parsed);
          return;
        }
      }
    } catch {
      // Ignore parse errors
    }
    setRegisteredUsers(DEFAULT_ACCOUNTS);
    localStorage.setItem('explorex_registered_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
  }, []);

  const interestsList = ['Nature', 'Food', 'Adventure', 'Photography', 'Camping', 'Culture'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRoleChange = (newRole: 'user' | 'admin') => {
    setActiveRole(newRole);
    setErrorMessage('');
    if (newRole === 'admin') {
      setMode('login');
      setEmail('arshuu8888@gmail.com');
    } else {
      setEmail('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (activeRole === 'admin') {
      // Admin Login verification
      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === targetEmail);
      const isAuthorizedAdminEmail = targetEmail === 'arshuu8888@gmail.com' || (existingUser && existingUser.role === 'admin');

      if (!isAuthorizedAdminEmail) {
        setErrorMessage(`⛔ Access Denied: "${targetEmail}" is not authorized as an administrator. Please sign in through the Explorer (User) tab or use the designated admin account.`);
        return;
      }

      if (existingUser && existingUser.password && password && existingUser.password !== password) {
        setErrorMessage('❌ Incorrect password for Admin Portal. Please check your credentials.');
        return;
      }

      const adminName = existingUser?.name || 'Administrator';
      onLoginSuccess(adminName, targetEmail, false, 'admin');
      return;
    }

    // USER (EXPLORER) FLOW
    if (mode === 'login') {
      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === targetEmail);

      if (!existingUser) {
        setErrorMessage(`❌ Account "${targetEmail}" is not registered! Please switch to the Register tab to create your account.`);
        return;
      }

      if (existingUser.password && password && existingUser.password !== password) {
        setErrorMessage(`❌ Incorrect password for "${targetEmail}". Please check your password and try again.`);
        return;
      }

      const determinedRole = (existingUser.role === 'admin' || targetEmail === 'arshuu8888@gmail.com') ? 'admin' : 'user';
      onLoginSuccess(existingUser.name, existingUser.email, false, determinedRole);
    } else {
      // REGISTER MODE
      if (!name.trim()) {
        setErrorMessage('Please enter your full name to complete registration.');
        return;
      }

      if (!password || password.length < 4) {
        setErrorMessage('Password must be at least 4 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter carefully.');
        return;
      }

      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === targetEmail);
      if (existingUser) {
        setErrorMessage(`⚠️ Email "${targetEmail}" is already registered! Please switch to Log In tab.`);
        return;
      }

      const newUser: RegisteredAccount = {
        name: name.trim(),
        email: targetEmail,
        password: password,
        role: targetEmail === 'arshuu8888@gmail.com' ? 'admin' : 'user'
      };

      const updatedList = [...registeredUsers, newUser];
      setRegisteredUsers(updatedList);
      localStorage.setItem('explorex_registered_accounts', JSON.stringify(updatedList));

      onLoginSuccess(newUser.name, newUser.email, true, newUser.role);
    }
  };

  const handleGoogleAccountSelected = (selectedName: string, selectedEmail: string, isChosenAdmin?: boolean) => {
    const cleanEmail = selectedEmail.trim().toLowerCase();
    const isActualAdmin = isChosenAdmin || cleanEmail === 'arshuu8888@gmail.com';
    const role: 'admin' | 'user' = isActualAdmin ? 'admin' : 'user';

    // Update registered accounts list if not present
    const existing = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      const updatedList = [...registeredUsers, { name: selectedName, email: cleanEmail, role }];
      setRegisteredUsers(updatedList);
      localStorage.setItem('explorex_registered_accounts', JSON.stringify(updatedList));
    }

    onLoginSuccess(selectedName, cleanEmail, !existing, role);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Brand & Feature Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-900/80 via-slate-900 to-indigo-950/80 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-white block">ExploreX AI</span>
                <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">Travel Intelligence</span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <h1 className="text-2xl font-extrabold text-white leading-snug">
                {activeRole === 'admin' 
                  ? 'ExploreX Administrative Control Center'
                  : 'Plan your dream journeys with AI Precision.'}
              </h1>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                {activeRole === 'admin'
                  ? 'Access live system telemetry, RAG vector index configurations, API health monitors, and platform security tools.'
                  : 'Unlock automated itineraries, crowd forecasts, local hidden spots, and group expense tracking.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-slate-200">AI Itinerary Planner</h4>
                  <p className="text-[11px] text-slate-400">Custom multi-day plans matched to your travel style & budget.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-slate-200">Hidden Local Gems</h4>
                  <p className="text-[11px] text-slate-400">Discover offbeat waterfalls, cafes, and scenic trails.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-slate-200">Role-Based Security</h4>
                  <p className="text-[11px] text-slate-400">Distinct, segregated workspaces for Explorers and Administrators.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-[11px] font-semibold">
            <span>ExploreX AI Platform</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Engine Online
            </span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 sm:p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Role Selector: User vs Admin */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Select Login Portal
                </span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {activeRole === 'admin' ? '🛡️ Administrator Access' : '🧭 Traveler Access'}
                </span>
              </div>

              <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-extrabold border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleRoleChange('user')}
                  className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeRole === 'user'
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>User Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeRole === 'admin'
                      ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Admin Login</span>
                </button>
              </div>
            </div>

            {/* Header / Mode Switcher */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {activeRole === 'admin'
                      ? 'Admin Portal Sign In'
                      : (mode === 'login' ? 'Sign In to ExploreX' : 'Create Your Explorer Account')}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold mt-0.5">
                    {activeRole === 'admin'
                      ? 'Enter authorized admin credentials to manage platform telemetry'
                      : (mode === 'login' ? 'Enter your credentials to access your trips & itineraries' : 'Sign up to start planning with AI')}
                  </p>
                </div>
              </div>

              {/* Tabs for User Mode (Log In vs Register) */}
              {activeRole === 'user' && (
                <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold mt-4 border border-slate-200/80 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); }}
                    className={`py-2 rounded-lg transition cursor-pointer ${mode === 'login' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMessage(''); }}
                    className={`py-2 rounded-lg transition cursor-pointer ${mode === 'register' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>

                {errorMessage.includes('not registered') && (
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMessage(''); }}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition shadow-2xs block"
                  >
                    Click here to Register this email →
                  </button>
                )}

                {errorMessage.includes('already registered') && (
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setErrorMessage(''); }}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-[11px] transition shadow-2xs block"
                  >
                    Click here to Log In now →
                  </button>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
              {activeRole === 'user' && mode === 'register' && (
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Lin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {activeRole === 'admin' ? 'Administrator Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder={activeRole === 'admin' ? 'arshuu8888@gmail.com' : 'explorer@explorex.ai'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {activeRole === 'user' && mode === 'register' && (
                <>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Travel Interests</label>
                    <div className="grid grid-cols-3 gap-2">
                      {interestsList.map((interest) => {
                        const isSelected = selectedInterests.includes(interest);
                        return (
                          <button
                            type="button"
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-300'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span>{interest}</span>
                            {isSelected && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-semibold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember session</span>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-98 ${
                  activeRole === 'admin'
                    ? 'bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-slate-900/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                <span>
                  {activeRole === 'admin'
                    ? 'Sign In to Admin Portal'
                    : (mode === 'login' ? 'Sign In as Explorer' : 'Complete Registration')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Social Logins */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider relative">
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleChooser(true)}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2.5 transition shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

          </div>
        </div>

      </div>

      {/* Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
        onSelectAccount={handleGoogleAccountSelected}
        preferredRole={activeRole}
      />
    </div>
  );
};
