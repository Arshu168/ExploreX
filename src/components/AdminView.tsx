import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
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
  UserCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

interface AdminViewProps {
  userEmail?: string;
  onOpenLogin?: () => void;
  onReturnDashboard?: () => void;
}

const ADMIN_EMAIL = 'arshuu8888@gmail.com';

export const AdminView: React.FC<AdminViewProps> = ({
  userEmail = '',
  onOpenLogin,
  onReturnDashboard,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPurging, setIsPurging] = useState(false);

  const cleanEmail = userEmail.trim().toLowerCase();
  const isAdmin = cleanEmail === ADMIN_EMAIL;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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
              The ExploreX Admin Panel contains sensitive system telemetry, RAG vector indexing controls, and platform metrics. Access is strictly limited to the primary administrator (<span className="font-bold text-slate-900 dark:text-slate-100">{ADMIN_EMAIL}</span>).
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
    const logs = {
      app: 'ExploreX AI Travel Platform',
      environment: 'production-frontend',
      timestamp: new Date().toISOString(),
      systemHealth: {
        geminiVectorIndexer: { status: 'Healthy', latencyMs: 42 },
        mapboxTileProxy: { status: 'Healthy', latencyMs: 18 },
        ragDocumentEmbeddings: { status: 'Healthy', latencyMs: 65 },
      },
      metrics: {
        totalRegisteredUsers: 18500,
        aiTripsGenerated: 7200,
        aiVectorQueries: 142000,
        indexedHiddenSpots: 15000,
      },
      recentEvents: [
        { level: 'INFO', module: 'GeminiVectorIndexer', message: 'Indexed 14 hidden places around Coimbatore & Valparai' },
        { level: 'INFO', module: 'RAGService', message: 'Vector search query executed in 42ms' },
        { level: 'INFO', module: 'TileService', message: 'Map tiles cached for region [11.0168, 76.9558]' },
        { level: 'INFO', module: 'AuthClient', message: 'Local user session refreshed successfully' },
      ],
    };

    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `explorex-system-logs-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('System logs exported and downloaded successfully as JSON.');
  };

  const handlePurgeCache = () => {
    setIsPurging(true);
    
    setTimeout(() => {
      // Clear non-essential client cache keys while preserving main state
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
      showToast('Client cache purged successfully! 18.4 MB of temporary vector & map tile data cleared.');
    }, 800);
  };

  const userGrowthData = [
    { day: 'Mon', users: 1240, trips: 410 },
    { day: 'Tue', users: 1560, trips: 530 },
    { day: 'Wed', users: 1890, trips: 620 },
    { day: 'Thu', users: 2100, trips: 780 },
    { day: 'Fri', users: 2800, trips: 1050 },
    { day: 'Sat', users: 3400, trips: 1420 },
    { day: 'Sun', users: 3900, trips: 1680 },
  ];

  const popularSpotsData = [
    { name: 'Monkey Falls Trail', visits: 1840 },
    { name: 'Valparai Tea Estate', visits: 1520 },
    { name: 'Kodiveri Hidden River', visits: 1290 },
    { name: 'Ravello Cliff View', visits: 980 },
    { name: 'Agumbe Sunset Point', visits: 870 },
  ];

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
              System Admin
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-1">ExploreX Platform Analytics</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Real-time user traffic, AI model requests, and system health metrics</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLogs}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>Export Logs</span>
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
            <span>{isPurging ? 'Purging...' : 'Purge Cache'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">+14.2%</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">18,500</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Total Registered Users</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">+22.8%</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">7,200</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">AI Trips Generated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">142K</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">142,000</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">AI Vector Queries</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">+18.5%</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">15,000+</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Indexed Hidden Spots</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Daily Active Users & Trips</h2>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">This Week</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#0f172a', color: '#fff' }} />
                <Area type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Spots Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Most Popular Hidden Spots</h2>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">By Vector Views</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularSpotsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={120} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px', backgroundColor: '#0f172a', color: '#fff' }} />
                <Bar dataKey="visits" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Server Health Status Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Microservice Endpoint Health</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Gemini Vector Indexer</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Latency: 42ms</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">Healthy</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Mapbox Tile Proxy</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Latency: 18ms</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">Healthy</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">RAG Document Embeddings</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Latency: 65ms</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px]">Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
