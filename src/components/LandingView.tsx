import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Wallet, 
  Users, 
  Map as MapIcon, 
  Star, 
  ArrowRight, 
  ShieldCheck, 
} from 'lucide-react';

interface LandingViewProps {
  onStartPlanning: () => void;
  onOpenOnboarding: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartPlanning,
  onOpenOnboarding,
  onOpenLogin,
  onOpenRegister,
}) => {
  const stats = [
    { label: 'Active Travelers', value: '18,500+' },
    { label: 'Trips Generated', value: '7,200+' },
    { label: 'Hidden Spots', value: '15,000+' },
    { label: 'Countries Explored', value: '62' },
  ];

  const features = [
    {
      title: 'AI Itinerary Engine',
      desc: 'Creates personalized minute-by-minute travel schedules optimized for your pace and budget.',
      icon: Sparkles,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Hidden Places Discovery',
      desc: 'Uncovers secluded waterfalls, secret forest trails, and off-grid cafes hidden from Google search.',
      icon: Compass,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'AI Travel Assistant',
      desc: 'Instant context-aware responses for local emergency contacts, translations, and weather updates.',
      icon: MapPin,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Smart Budget Planner',
      desc: 'Category allocation, currency conversion, expense logging, and group bill splitting.',
      icon: Wallet,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Team Collaboration',
      desc: 'Real-time group voting, shared itineraries, task assignment, and workspace sync.',
      icon: Users,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Interactive Maps',
      desc: 'Geospatial visualization of hidden spots, custom route paths, and live crowd density.',
      icon: MapIcon,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Tell AI Your Preferences',
      desc: 'Select destination, budget in ₹, trip duration, and travel style.',
    },
    {
      step: '02',
      title: 'AI Finds Hidden Gems',
      desc: 'ExploreX scans vector-indexed travel knowledge for offbeat spots.',
    },
    {
      step: '03',
      title: 'Generate Custom Trip',
      desc: 'Receive a structured itinerary complete with routes, budgets, and weather tips.',
    },
    {
      step: '04',
      title: 'Travel & Create Memories',
      desc: 'Sync with teammates, track expenses, and auto-generate AI blogs and reels.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Solo Wilderness Explorer',
      text: 'ExploreX AI found an incredible hidden waterfall in Valparai that wasn\'t on any travel blog. The offline map directions were spot-on!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Arjun Harish',
      role: 'Weekend Roadtripper',
      text: 'The group voting feature made planning our Ooty bike trip effortless. We split costs in ₹ and saved over 30% on stays.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Digital Nomad',
      text: 'The RAG Knowledge base gave me exact coworking cafes in Amalfi Coast with fiber internet and quiet atmosphere. Outstanding tool.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div className="space-y-16 pb-16 font-sans text-slate-900 dark:text-slate-100">
      {/* Navigation Bar Header for Landing */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            ExploreX <span className="text-blue-600 dark:text-blue-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={onOpenRegister}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            Register
          </button>
          <button
            onClick={onOpenOnboarding}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Planning</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Travel Intelligence Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Discover Hidden Places <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Powered by AI Knowledge
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
          Skip generic tourist traps. ExploreX AI curates offbeat trails, secret waterfalls, and local sanctuaries tailored to your budget and travel pace.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenOnboarding}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold shadow-lg shadow-blue-600/25 transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start AI Trip Planning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-2xs max-w-5xl mx-auto">
        {stats.map((s, idx) => (
          <div key={idx} className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">{s.value}</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Features Grid Section */}
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Comprehensive Travel Intelligence</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Everything you need from discovery to memory generation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-2xs hover:shadow-md transition">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${f.color} dark:bg-slate-800`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Flow */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 max-w-6xl mx-auto shadow-xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Simple Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-black">How ExploreX AI Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2 relative">
              <span className="text-xs font-black text-blue-400 block">{s.step}</span>
              <h3 className="font-bold text-sm text-white">{s.title}</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Loved by Explorers Worldwide</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Real reviews from travelers finding offbeat spots</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">"{t.text}"</p>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 pt-8 pb-4 text-xs text-slate-600 dark:text-slate-400 space-y-6 max-w-6xl mx-auto font-medium">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-black text-slate-900 dark:text-white text-sm">ExploreX AI</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" onClick={(e) => { e.preventDefault(); }} className="hover:text-slate-900 dark:hover:text-white">About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); }} className="hover:text-slate-900 dark:hover:text-white">Contact</a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); }} className="hover:text-slate-900 dark:hover:text-white">Terms</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); }} className="hover:text-slate-900 dark:hover:text-white">Privacy</a>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <p>© 2026 ExploreX AI. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Production Ready Frontend</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
