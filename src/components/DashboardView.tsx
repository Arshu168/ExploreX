import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  MapPin, 
  Wallet, 
  Plus, 
  Users, 
  ArrowRight, 
  Calendar, 
  Camera, 
  Plane, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  MessageSquare,
  Map,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Place, Trip, UserProfile, Memory } from '../types';

interface DashboardViewProps {
  userProfile: UserProfile;
  places: Place[];
  trips: Trip[];
  memories: Memory[];
  onSelectPlace: (place: Place) => void;
  onSelectTrip: (trip: Trip) => void;
  onNavigate: (view: string) => void;
  onPromptGenerate: (promptText: string) => void;
  onOpenNewTrip?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  places,
  trips,
  memories,
  onSelectPlace,
  onSelectTrip,
  onNavigate,
  onPromptGenerate,
  onOpenNewTrip,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const samplePrompts = [
    "3-day trip to Amalfi Coast with luxury dining & hidden beaches",
    "2-day photo tour in Kyoto narrow alleyways & quiet shrines",
    "4-day offbeat trek in Valparai mist ridges under ₹12,000"
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onPromptGenerate(quickInput);
    }
  };

  const quickActions = [
    { label: 'New Trip', icon: Plus, view: 'ai-planner', color: 'bg-blue-50 text-blue-600' },
    { label: 'Explore', icon: Compass, view: 'explore', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Budget', icon: Wallet, view: 'budget', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Chat', icon: MessageSquare, view: 'ai-planner', color: 'bg-purple-50 text-purple-600' },
    { label: 'Maps', icon: Map, view: 'map', color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Team', icon: Users, view: 'team', color: 'bg-amber-50 text-amber-600' },
  ];

  const isNewUser = userProfile.isNewUser || (trips.length === 0 && memories.length === 0);
  const firstName = userProfile.name ? userProfile.name.split(' ')[0] : 'Explorer';

  // Dynamic calculations based on real user state
  const activeTripsCount = trips.length;
  const placesVisitedCount = trips.reduce((acc, t) => {
    const actCount = t.days ? t.days.flatMap(d => d.activities).length : 0;
    return acc + actCount;
  }, 0);
  const totalBudgetAllocated = trips.reduce((acc, t) => acc + (t.budgetTotal || 0), 0);
  const aiSavingsVal = trips.reduce((acc, t) => acc + Math.max(0, (t.budgetTotal || 0) - (t.budgetSpent || 0)), 0);

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto font-sans text-slate-900 dark:text-slate-100">
      {/* Top Welcome Header + AI Insight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 space-y-1.5 justify-center flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isNewUser ? `Welcome to ExploreX, ${firstName}!` : `Welcome back, ${firstName}!`}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            {isNewUser
              ? 'Your personalized AI travel hub is ready. Start by planning your first itinerary or exploring secret destinations!'
              : `You have ${activeTripsCount} active trip${activeTripsCount === 1 ? '' : 's'} saved. Ready for your next hidden adventure?`}
          </p>
        </div>

        {/* AI INSIGHT Banner Card */}
        <div className="bg-blue-600 dark:bg-blue-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 block">
              AI INSIGHT
            </span>
            <p className="text-xs sm:text-sm font-bold leading-snug">
              Flight prices to Reykjavik dropped by 18%!
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="shrink-0 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            View Deal
          </button>
        </div>
      </div>

      {/* Natural Language Search Prompt */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
        <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Ask AI: 'Plan a 3-day luxury trip to Amalfi Coast under ₹45,000'..."
              className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Itinerary</span>
          </button>
        </form>
      </div>

      {/* Metrics Row (4 Cards with Dynamic Values) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active Trips</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{activeTripsCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Places Visited</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{placesVisitedCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Budget</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">₹{totalBudgetAllocated.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">AI Savings</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">₹{aiSavingsVal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">Quick Actions</h2>
          <button onClick={() => onNavigate('ai-planner')} className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Customize Shortcuts
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (action.label === 'New Trip' && onOpenNewTrip) {
                    onOpenNewTrip();
                  } else {
                    onNavigate(action.view);
                  }
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition shadow-2xs hover:shadow-md text-center group"
              >
                <div className={`p-3 rounded-xl ${action.color} dark:bg-slate-800 group-hover:scale-110 transition duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {action.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Trips Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Your Active Trips ({trips.length})</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {trips.length > 0 ? 'Your planned itineraries and routes' : 'No trips planned for this account yet'}
            </p>
          </div>
          {trips.length > 0 && (
            <button
              onClick={() => onNavigate('saved-trips')}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>View All Saved Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {trips.length === 0 ? (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-extrabold text-base">New Account — No Planned Trips Yet</h3>
            </div>
            <p className="text-xs text-slate-300 font-medium max-w-xl">
              Welcome to ExploreX! Your new account starts with 0 active trips and ₹0 budget. Click below to generate your first custom AI itinerary with budget breakdowns, day-by-day maps, and hidden gems.
            </p>
            <button
              onClick={() => onOpenNewTrip ? onOpenNewTrip() : onNavigate('ai-planner')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Plan First Trip with AI</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.slice(0, 3).map((trip) => (
              <div
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-4 cursor-pointer transition shadow-2xs hover:shadow-md space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {trip.durationDays} Days
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{trip.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    <span>{trip.region}</span>
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{trip.budgetTotal.toLocaleString()}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1">
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended for You Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Recommended for You</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Curated destinations matched to your travel preferences</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {places.slice(0, 3).map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-3.5 cursor-pointer transition duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                {/* Photo container */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Rating pill on top right */}
                  <div className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-900 dark:text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{place.rating || 4.9}</span>
                  </div>

                  {/* Category badge */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 shadow-2xs">
                      {place.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>{place.region}</span>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-snug mt-1.5 font-normal">
                    {place.description}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white">₹{place.estimatedCost > 0 ? place.estimatedCost.toLocaleString() : '12,000'}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1 font-medium">avg. est</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlace(place);
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center gap-1"
                >
                  <span>Explore</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">ExploreX AI</span>
          <span className="ml-2">© 2024 ExploreX AI. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200">Privacy Policy</a>
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200">Terms of Service</a>
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200">Cookie Policy</a>
          <a href="#" className="hover:text-slate-800 dark:hover:text-slate-200">Support</a>
        </div>
      </footer>
    </div>
  );
};
