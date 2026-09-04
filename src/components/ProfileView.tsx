import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Check, 
  MapPin, 
  Globe, 
  Heart, 
  Camera, 
  Utensils, 
  Tent, 
  Mountain, 
  CheckSquare,
  Sparkles,
  Edit2,
  Save,
  LogOut
} from 'lucide-react';
import { UserProfile, Trip, Memory } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  trips?: Trip[];
  memories?: Memory[];
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  trips = [],
  memories = [],
  onUpdateProfile,
  onOpenLogin,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name || 'Explorer');
  const [bio, setBio] = useState('Weekend explorer & remote developer.');
  const [homeCity, setHomeCity] = useState(userProfile.homeCity || 'Coimbatore, India');

  const activeTripsCount = trips.length;
  const placesVisitedCount = trips.reduce((acc, t) => {
    const actCount = t.days ? t.days.flatMap(d => d.activities).length : 0;
    return acc + actCount;
  }, 0);
  const photosCapturedCount = memories.reduce((acc, m) => acc + (m.highlightPhoto ? 1 : 0), 0);
  const aiSavingsVal = trips.reduce((acc, t) => acc + Math.max(0, t.budgetTotal - t.budgetSpent), 0);

  const [preferences, setPreferences] = useState({
    avoidCrowds: true,
    preferRoadTrips: true,
    vegetarian: true,
    budgetTraveler: false,
  });

  const badges = [
    { label: 'Explorer Level 12', icon: Mountain, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'Photographer', icon: Camera, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Foodie', icon: Utensils, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { label: 'Camper', icon: Tent, color: 'bg-violet-50 text-violet-600 border-violet-200' },
    { label: 'Mountain Lover', icon: Mountain, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...userProfile,
      name,
      homeCity,
    });
    setIsEditing(false);
  };

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-12 text-slate-900 dark:text-slate-100">
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={userProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-blue-500/20"
              />
              <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
                Lvl 12
              </span>
            </div>

            <div className="space-y-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-base font-black text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1 text-xs font-semibold block text-slate-800 dark:text-slate-200"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{name}</h1>
                    {(userProfile.role === 'admin' || userProfile.email?.toLowerCase() === 'arshuu8888@gmail.com') ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold flex items-center gap-1">
                        <span>🛡️ Administrator</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-extrabold flex items-center gap-1">
                        <span>🧭 Verified Explorer</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <p className="font-semibold text-slate-600 dark:text-slate-400">{userProfile.email}</p>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{homeCity}</span>
                    </p>
                  </div>
                </>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-1 max-w-md">{bio}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition flex items-center gap-1 border border-rose-200 dark:border-rose-800 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <button
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-xl font-black text-slate-900 dark:text-white block">{activeTripsCount}</span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Completed Trips</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-xl font-black text-slate-900 dark:text-white block">{placesVisitedCount}</span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Places Visited</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block">₹{aiSavingsVal.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Saved with AI</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-xl font-black text-slate-900 dark:text-white block">{photosCapturedCount}</span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Photos Captured</span>
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Explorer Badges & Titles</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className={`px-3.5 py-2 rounded-2xl border ${b.color} dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-2 shadow-2xs`}
              >
                <Icon className="w-4 h-4" />
                <span>{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences & Rules */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">AI Personalization Rules</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
          <div
            onClick={() => togglePref('avoidCrowds')}
            className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
              preferences.avoidCrowds
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div>
              <span className="font-bold block text-slate-900 dark:text-white">Always avoid crowds</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Prioritizes spots with &lt;30% crowd index</span>
            </div>
            {preferences.avoidCrowds && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />}
          </div>

          <div
            onClick={() => togglePref('preferRoadTrips')}
            className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
              preferences.preferRoadTrips
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div>
              <span className="font-bold block text-slate-900 dark:text-white">Prefer road trips</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Includes scenic viewpoints and highway stops</span>
            </div>
            {preferences.preferRoadTrips && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />}
          </div>

          <div
            onClick={() => togglePref('vegetarian')}
            className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
              preferences.vegetarian
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div>
              <span className="font-bold block text-slate-900 dark:text-white">Vegetarian dining filter</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Filters local cafes with veg options</span>
            </div>
            {preferences.vegetarian && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />}
          </div>

          <div
            onClick={() => togglePref('budgetTraveler')}
            className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
              preferences.budgetTraveler
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div>
              <span className="font-bold block text-slate-900 dark:text-white">Budget Traveler mode</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Suggests homestays and public transit</span>
            </div>
            {preferences.budgetTraveler && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />}
          </div>
        </div>
      </div>
    </div>
  );
};
