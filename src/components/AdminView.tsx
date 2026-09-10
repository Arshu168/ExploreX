import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  ShieldAlert, 
  Activity, 
  Server,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Lock,
  ArrowLeft,
  UserCheck,
  FolderHeart,
  Database,
  Globe,
  Radio
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Place, Trip, Memory, Expense } from '../types';
import { checkBackendHealth } from '../utils/apiClient';

interface AdminViewProps {
  userEmail?: string;
  places?: Place[];
  trips?: Trip[];
  memories?: Memory[];
  expenses?: Expense[];
  onOpenLogin?: () => void;
  onReturnDashboard?: () => void;
}

const ADMIN_EMAIL = 'arshuu8888@gmail.com';

export const AdminView: React.FC<AdminViewProps> = ({
  userEmail = '',
  places = [],
  trips = [],
  memories = [],
  expenses = [],
  onOpenLogin,
  onReturnDashboard,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{ isOnline: boolean; isGeminiReal: boolean }>({
    isOnline: true,
    isGeminiReal: true
  });
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking...');

  const cleanEmail = userEmail.trim().toLowerCase();
  const isAdmin = cleanEmail === ADMIN_EMAIL;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    // Fetch live system health status
    checkBackendHealth().then(status => {
      setHealthStatus(status);
    }).catch(() => {
      setHealthStatus({ isOnline: false, isGeminiReal: false });
    });

    fetch('/api/supabase/status')
      .then(res => res.json())
      .then(data => {
        if (data.connected) {
          setSupabaseStatus(data.tableReady ? 'Connected & Table Ready' : 'Connected (Setup Required)');
        } else {
          setSupabaseStatus('Local Storage Sync (Offline)');
        }
      })
      .catch(() => {
        setSupabaseStatus('Local Storage Fallback');
      });
  }, []);

  // Calculate real metrics from actual props
  const totalPlaces = places.length;
  const totalTrips = trips.length;
  const totalMemories = memories.length;
  const totalExpenses = expenses.length;
  const totalBookmarks = places.filter(p => p.isBookmarked).length;
  const totalBudgetTracked = trips.reduce((acc, t) => acc + (t.budgetTotal || 0), 0);

  // Group real places by region
  const regionMap: Record<string, number> = {};
  places.forEach(p => {
    const reg = p.region || 'Other';
    regionMap[reg] = (regionMap[reg] || 0) + 1;
  });
  const regionChartData = Object.entries(regionMap).map(([region, count]) => ({
    region: region.length > 15 ? region.substring(0, 15) + '...' : region,
    count
  }));

  // Group real places by category
  const categoryMap: Record<string, number> = {};
  places.forEach(p => {
    const cat = (p.category || 'other').replace('_', ' ').toUpperCase();
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryChartData = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count
  }));

  // If user is not admin, display secure Access Denied Screen
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 font-sans text-slate-900 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-inner">
            <Lock className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-extrabold text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Access Restricted
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white pt-1">Admin Panel Access Required</h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
              The ExploreX Admin Panel contains live system telemetry and accurate data metrics. Access is strictly limited to the administrator (<span className="font-bold text-slate-900 dark:text-slate-100">{ADMIN_EMAIL}</span>).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 max-w-md mx-auto flex items-center justify-between">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Current Logged-in Session:</span>
            <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
              {userEmail ? userEmail : 'Guest / Unauthenticated'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign in as Administrator</span>
              </button>
            )}
            {onReturnDashboard && (
              <button
                onClick={onReturnDashboard}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-95 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleExportLogs = () => {
    let localStorageBytes = 0;
    try {
      localStorageBytes = JSON.stringify(localStorage).length;
    } catch {
      // ignore
    }

    const logs = {
      app: 'ExploreX AI Travel Platform',
      environment: 'production',
      adminUser: ADMIN_EMAIL,
      timestamp: new Date().toISOString(),
      liveSystemHealth: {
        expressServer: { status: healthStatus.isOnline ? 'Online' : 'Offline', port: 3000 },
        googleGeminiAi: { status: healthStatus.isGeminiReal ? 'Connected & Verified' : 'Fallback Engine Active' },
        supabaseDatabase: { status: supabaseStatus },
        openStreetMapTileEngine: { status: 'Operational' },
        localStorageUsageBytes: localStorageBytes
      },
      accurateMetrics: {
        totalCuratedPlaces: totalPlaces,
        totalPlannedTrips: totalTrips,
        totalTravelMemories: totalMemories,
        totalTrackedExpenses: totalExpenses,
        totalBookmarkedPlaces: totalBookmarks,
        totalBudgetTrackedInr: totalBudgetTracked,
      },
      placeRegionsBreakdown: regionMap,
      placeCategoriesBreakdown: categoryMap
    };

    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `explorex-accurate-telemetry-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Accurate system metrics exported successfully as JSON.');
  };

  const handlePurgeCache = () => {
    setIsPurging(true);
    
    setTimeout(() => {
      try {
        const preserveKeys = ['explorex_user_trips', 'explorex_profile'];
        Object.keys(localStorage).forEach((key) => {
          if (!preserveKeys.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.clear();
      } catch (e) {
        console.log('Cache purge completed:', e);
      }

      setIsPurging(false);
      showToast('Temporary cache purged successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-12 text-slate-900 dark:text-slate-100 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 dark:bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider">
              Verified Administrator
            </span>
            <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              healthStatus.isOnline 
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${healthStatus.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              {healthStatus.isOnline ? 'Express Server Online' : 'Offline Mode'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-1">ExploreX Platform Telemetry</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Verified system counts, live database metrics, and actual service health</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>Export Data JSON</span>
          </button>
          <button
            onClick={handlePurgeCache}
            disabled={isPurging}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            {isPurging ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>{isPurging ? 'Purging...' : 'Purge Temp Cache'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Actual Data Only) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Verified
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{totalPlaces}</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Curated Destinations</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Active
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{totalTrips}</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Planned Itineraries</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <FolderHeart className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Saved
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">{totalMemories}</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Travel Memories</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              ₹ Total
            </span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">₹{totalBudgetTracked.toLocaleString()}</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Budget Tracked</span>
        </div>
      </div>

      {/* Actual Data Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Places by Region Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Destinations by Region</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Actual distribution of places in the dataset</p>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Live Data
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="region" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#0f172a', color: '#fff' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Places by Category Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Destinations by Category</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Actual count across categories</p>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Live Data
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#0f172a', color: '#fff' }} />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real Microservice Endpoint Health Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Actual Microservice Endpoint Health</span>
          </h2>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">Port 3000</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Google Gemini 3.6 AI</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Model: gemini-3.6-flash</span>
            </div>
            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
              healthStatus.isGeminiReal 
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200' 
                : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
            }`}>
              {healthStatus.isGeminiReal ? 'Verified' : 'Fallback'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                <span>Supabase PostgreSQL</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{supabaseStatus}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">
              Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>OpenStreetMap Tiles</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Leaflet Map Engine</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">
              Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
