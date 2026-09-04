import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Compass, Check, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  initialRole?: 'user' | 'admin';
  onClose: () => void;
  onSuccess: (userName: string, email: string, isNewUser?: boolean, role?: 'admin' | 'user') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  initialRole = 'user',
  onClose,
  onSuccess,
}) => {
  const [activeRole, setActiveRole] = useState<'user' | 'admin'>(initialRole);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Nature', 'Adventure']);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setActiveRole(initialRole);
    setErrorMessage('');
    setName('');
    setEmail(initialRole === 'admin' ? 'arshuu8888@gmail.com' : '');
    setPassword('');
    setConfirmPassword('');
  }, [initialMode, initialRole, isOpen]);

  if (!isOpen) return null;

  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('explorex_registered_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [
      { name: 'Arshuu', email: 'arshuu8888@gmail.com', password: 'password123', role: 'admin' },
      { name: 'Raam Harish', email: 'harish@explorex.ai', password: 'password123', role: 'user' }
    ];
  };

  const interestsList = ['Nature', 'Food', 'Adventure', 'Photography', 'Camping', 'Culture'];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage('');
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
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const registeredUsers = getRegisteredUsers();

    if (activeRole === 'admin') {
      const existingUser = registeredUsers.find((u: any) => u.email.toLowerCase() === targetEmail);
      const isAuthorizedAdminEmail = targetEmail === 'arshuu8888@gmail.com' || (existingUser && existingUser.role === 'admin');

      if (!isAuthorizedAdminEmail) {
        setErrorMessage(`⛔ Access Denied: "${targetEmail}" is not authorized as an administrator.`);
        return;
      }

      if (existingUser && existingUser.password && password && existingUser.password !== password) {
        setErrorMessage('❌ Incorrect password for Admin Portal.');
        return;
      }

      const adminName = existingUser?.name || 'Administrator';
      onSuccess(adminName, targetEmail, false, 'admin');
      onClose();
      return;
    }

    // EXPLORER (USER) FLOW
    if (mode === 'login') {
      const existingUser = registeredUsers.find((u: any) => u.email.toLowerCase() === targetEmail);
      if (!existingUser) {
        setErrorMessage(`❌ Account "${targetEmail}" is not registered! Please register first to create your account.`);
        return;
      }

      if (existingUser.password && password && existingUser.password !== password) {
        setErrorMessage(`❌ Incorrect password for "${targetEmail}". Please check your password.`);
        return;
      }

      const role = (existingUser.role === 'admin' || targetEmail === 'arshuu8888@gmail.com') ? 'admin' : 'user';
      onSuccess(existingUser.name, existingUser.email, false, role);
      onClose();
    } else {
      // REGISTER MODE
      if (!name.trim()) {
        setErrorMessage('Please enter your full name to register.');
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

      const existingUser = registeredUsers.find((u: any) => u.email.toLowerCase() === targetEmail);
      if (existingUser) {
        setErrorMessage(`⚠️ Email "${targetEmail}" is already registered! Switch to Login tab to sign in.`);
        return;
      }

      const role = targetEmail === 'arshuu8888@gmail.com' ? 'admin' : 'user';
      const newUser = {
        name: name.trim(),
        email: targetEmail,
        password: password,
        role: role
      };

      const updated = [...registeredUsers, newUser];
      localStorage.setItem('explorex_registered_accounts', JSON.stringify(updated));

      onSuccess(newUser.name, newUser.email, true, role);
      onClose();
    }
  };

  const handleGoogleAccountSelected = (selectedName: string, selectedEmail: string, isChosenAdmin?: boolean) => {
    const cleanEmail = selectedEmail.trim().toLowerCase();
    const isActualAdmin = isChosenAdmin || cleanEmail === 'arshuu8888@gmail.com';
    const role: 'admin' | 'user' = isActualAdmin ? 'admin' : 'user';

    const registeredUsers = getRegisteredUsers();
    const existing = registeredUsers.find((u: any) => u.email.toLowerCase() === cleanEmail);
    if (!existing) {
      const updated = [...registeredUsers, { name: selectedName, email: cleanEmail, role }];
      localStorage.setItem('explorex_registered_accounts', JSON.stringify(updated));
    }

    onSuccess(selectedName, cleanEmail, !existing, role);
    setShowGoogleChooser(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl text-slate-900 dark:text-slate-100 relative">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  {activeRole === 'admin' ? 'Admin Portal Sign In' : (mode === 'login' ? 'Welcome Back' : 'Create Account')}
                </h3>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {activeRole === 'admin' ? 'Authorized administrator access' : 'Sign in to access your saved trips & itineraries'}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Portal Switcher (User vs Admin) */}
          <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'user' ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Login</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'admin' ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Mode Switcher Tabs for User mode */}
          {activeRole === 'user' && (
            <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-bold border border-slate-200/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleSwitchMode('login')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${mode === 'login' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('register')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${mode === 'register' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Register
              </button>
            </div>
          )}

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
            {activeRole === 'user' && mode === 'register' && (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Lin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {activeRole === 'admin' ? 'Administrator Email' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder={activeRole === 'admin' ? 'arshuu8888@gmail.com' : 'explorer@explorex.ai'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            {activeRole === 'user' && mode === 'register' && (
              <>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">What do you love? (Interests)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {interestsList.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-300'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
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

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-white font-extrabold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>
                {activeRole === 'admin'
                  ? 'Sign In to Admin Portal'
                  : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-200 dark:border-slate-700 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider relative">
              Or Continue With
            </span>
          </div>

          {/* Google Single Sign-On Button */}
          <button
            type="button"
            onClick={() => setShowGoogleChooser(true)}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 transition shadow-2xs cursor-pointer"
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

      {/* Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
        onSelectAccount={handleGoogleAccountSelected}
        preferredRole={activeRole}
      />
    </>
  );
};
