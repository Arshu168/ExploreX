import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Compass, 
  Map as MapIcon, 
  Wallet, 
  Users, 
  BookmarkCheck, 
  BookOpen, 
  Database,
  Plus,
  User,
  Settings,
  ShieldCheck,
  Home,
  X,
  Server,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  savedTripsCount: number;
  isMobileOpen?: boolean;
  isAdmin?: boolean;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
  onCloseMobile?: () => void;
  onOpenNewTrip?: () => void;
  onOpenBackendGuide?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setCurrentView, 
  savedTripsCount,
  isMobileOpen = false,
  isAdmin = false,
  darkMode = false,
  setDarkMode,
  onCloseMobile,
  onOpenNewTrip,
  onOpenBackendGuide,
}) => {
  const navItems = [
    { id: 'landing', label: 'Landing Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-planner', label: 'AI Planner', icon: Sparkles },
    { id: 'ai-chat', label: 'AI Assistant', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'map', label: 'Maps', icon: MapIcon },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'saved-trips', label: 'Saved', icon: BookmarkCheck, count: savedTripsCount },
    { id: 'memories', label: 'Memories', icon: BookOpen },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, badge: isAdmin ? 'Admin' : 'Restricted' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentView(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between md:hidden pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">Navigation</span>
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent + New Trip Button */}
        <button
          onClick={() => {
            if (onOpenNewTrip) {
              onOpenNewTrip();
            } else {
              handleNavClick('ai-planner');
            }
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Trip</span>
        </button>

        {/* Nav items */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md tracking-wider ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : (item.badge === 'Admin' ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer profile, theme switcher & settings section */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1 text-slate-600 dark:text-slate-300">
        {setDarkMode && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition"
          >
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-500" />
              )}
              <span>Theme: {darkMode ? 'Dark Mode' : 'Lite Mode'}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {darkMode ? 'Dark' : 'Lite'}
            </span>
          </button>
        )}

        <button
          onClick={() => handleNavClick('profile')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition"
        >
          <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => handleNavClick('admin')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition"
        >
          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Admin Settings</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="w-60 bg-slate-50/90 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hidden md:flex flex-col shrink-0 min-h-[calc(100vh-57px)] select-none transition-colors duration-200">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Overlay Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <aside className="relative w-64 max-w-[80vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
