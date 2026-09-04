import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  Menu,
  X,
  Server,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSettings: () => void;
  onOpenBackendGuide?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  onQuickSearch: (query: string) => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  userProfile,
  setUserProfile,
  darkMode,
  setDarkMode,
  onOpenSettings,
  onOpenBackendGuide,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  isLoggedIn = true,
  onQuickSearch,
  onToggleMobileSidebar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Flight Alert', message: 'Flight prices to Reykjavik dropped by 18%!', time: '10m ago', read: false },
    { id: 'n2', title: 'Team Upvote', message: 'Alex upvoted Amalfi Coast Villa Cimbrone', time: '1h ago', read: false },
    { id: 'n3', title: 'Itinerary Ready', message: '3-Day Coastal Elegance plan generated', time: '3h ago', read: true },
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onQuickSearch(searchQuery);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 shadow-2xs transition-colors duration-200">
      {/* Left: Mobile Menu Toggle & Brand Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition border border-slate-200/60 dark:border-slate-700/60"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold shrink-0">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                ExploreX
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                AI
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block -mt-0.5">Premium AI Travel</p>
          </div>
        </div>
      </div>

      {/* Center Search Bar - Desktop */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AI / Plan a trip..."
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-full pl-10 pr-24 py-2 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1 transition shadow-xs"
          >
            <Sparkles className="w-3 h-3" />
            <span>Plan</span>
          </button>
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
        {/* Mobile Search Icon Toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 md:hidden transition border border-slate-200/60 dark:border-slate-700/60"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Lite / Dark Theme Toggle Switch Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-all duration-200 border border-slate-200/70 dark:border-slate-700/80 flex items-center justify-center group relative shadow-2xs"
          title={darkMode ? 'Switch to Lite Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
          )}
          <span className="sr-only">{darkMode ? 'Switch to Lite' : 'Switch to Dark'}</span>
        </button>

        {/* Currency Switcher */}
        <select
          value={userProfile.preferredCurrency}
          onChange={(e) => setUserProfile({ ...userProfile, preferredCurrency: e.target.value })}
          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl px-2 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer hidden sm:block transition-colors"
        >
          <option value="INR" className="dark:bg-slate-800 dark:text-slate-100">₹ INR</option>
          <option value="USD" className="dark:bg-slate-800 dark:text-slate-100">$ USD</option>
          <option value="EUR" className="dark:bg-slate-800 dark:text-slate-100">€ EUR</option>
          <option value="GBP" className="dark:bg-slate-800 dark:text-slate-100">£ GBP</option>
        </select>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 relative transition border border-slate-200/60 dark:border-slate-700/60"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3.5 sm:p-4 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Mark read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2.5 rounded-xl border text-xs transition ${n.read ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400' : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-blue-700 dark:text-blue-400">{n.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{n.time}</span>
                    </div>
                    <p className="leading-snug text-slate-600 dark:text-slate-300">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition border border-slate-200/60 dark:border-slate-700/60"
          title="Settings & Preferences"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* Login / Register Quick Actions (Only if not logged in) */}
        {!isLoggedIn && onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
          >
            Log In
          </button>
        )}
        {!isLoggedIn && onOpenRegister && (
          <button
            onClick={onOpenRegister}
            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs"
          >
            Register
          </button>
        )}

        {/* User Profile avatar badge */}
        <div 
          onClick={onOpenSettings} 
          className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer group"
        >
          <img
            src={userProfile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userProfile.name || 'User')}`}
            alt={userProfile.name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-600 transition"
          />
          <div className="hidden xl:block text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
                {userProfile.name || 'Explorer'}
              </p>
              {(userProfile.role === 'admin' || userProfile.email?.toLowerCase() === 'arshuu8888@gmail.com') ? (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Admin
                </span>
              ) : (
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  User
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">{userProfile.email || 'Global Explorer'}</p>
          </div>
        </div>

        {/* Log Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition border border-rose-200/80 dark:border-rose-800/60 flex items-center gap-1 text-xs font-bold"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )}
      </div>

      {/* Expandable Mobile Search Bar */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg md:hidden z-40">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI / Plan a trip..."
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-full"
            >
              Plan
            </button>
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="p-1.5 text-slate-500 dark:text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
};
