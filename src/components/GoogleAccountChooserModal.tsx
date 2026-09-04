import React, { useState } from 'react';
import { X, UserPlus, Shield, Check, ArrowRight } from 'lucide-react';

export interface GoogleAccount {
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (name: string, email: string, isAdmin?: boolean) => void;
  preferredRole?: 'user' | 'admin';
}

const DEFAULT_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Arshuu',
    email: 'arshuu8888@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isAdmin: true,
  },
  {
    name: 'Raam Harish',
    email: 'raam.harish@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    isAdmin: false,
  }
];

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  preferredRole = 'user'
}) => {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Retrieve saved accounts from localStorage or fallback to defaults
  const getAccounts = (): GoogleAccount[] => {
    try {
      const stored = localStorage.getItem('explorex_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_GOOGLE_ACCOUNTS;
  };

  const accounts = getAccounts();

  const handleAccountClick = (account: GoogleAccount) => {
    const isActuallyAdmin = account.email.trim().toLowerCase() === 'arshuu8888@gmail.com';
    onSelectAccount(account.name, account.email.toLowerCase(), isActuallyAdmin);
    onClose();
  };

  const handleAddCustomAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = customEmail.trim().toLowerCase();
    const cleanName = customName.trim();

    if (!cleanName) {
      setErrorMessage('Please enter your full name as shown on your Google Account.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid Google email address.');
      return;
    }

    const isActuallyAdmin = cleanEmail === 'arshuu8888@gmail.com';

    const newAccount: GoogleAccount = {
      name: cleanName,
      email: cleanEmail,
      isAdmin: isActuallyAdmin,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`
    };

    // Save to list
    const updated = [...accounts.filter(a => a.email.toLowerCase() !== cleanEmail), newAccount];
    localStorage.setItem('explorex_google_accounts', JSON.stringify(updated));

    onSelectAccount(newAccount.name, newAccount.email, isActuallyAdmin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl text-slate-900 dark:text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {/* Google G Logo */}
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Choose an account to continue to ExploreX AI
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice badge if admin portal was requested */}
        {preferredRole === 'admin' && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Admin Portal: Select an authorized administrator account to log in.</span>
          </div>
        )}

        {/* Account List */}
        {!showAddAccount ? (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 px-1">
              Select an account
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
              {accounts.map((acc) => {
                const isAdminAccount = acc.email.toLowerCase() === 'arshuu8888@gmail.com';
                return (
                  <button
                    key={acc.email}
                    onClick={() => handleAccountClick(acc)}
                    className="w-full p-3.5 flex items-center justify-between hover:bg-blue-50/60 dark:hover:bg-slate-800/80 transition text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(acc.name)}`}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-blue-400 transition"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                            {acc.name}
                          </span>
                          {isAdminAccount && (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{acc.email}</p>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-500 dark:text-slate-400 transition">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}

              {/* Use another account row */}
              <button
                type="button"
                onClick={() => { setShowAddAccount(true); setErrorMessage(''); }}
                className="w-full p-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-left bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block">
                    Use another Google account
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Sign in with a different name or Gmail
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Custom Account Entry Form */
          <form onSubmit={handleAddCustomAccount} className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Enter Google Account Details</span>
              <button
                type="button"
                onClick={() => setShowAddAccount(false)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Back to accounts list
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Your Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Google Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. maya.traveler@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue with this account</span>
              <Check className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security / Privacy disclaimer */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed font-medium">
          To continue, Google will securely share your name, email address, and profile photo with ExploreX AI.
        </p>

      </div>
    </div>
  );
};
