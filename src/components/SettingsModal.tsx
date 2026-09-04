import React, { useState } from 'react';
import { X, Settings, Check, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  darkMode = false,
  setDarkMode,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(userProfile.name);
  const [homeCity, setHomeCity] = useState(userProfile.homeCity);
  const [preferredCurrency, setPreferredCurrency] = useState(userProfile.preferredCurrency);
  const [defaultPace, setDefaultPace] = useState(userProfile.defaultPace);
  const [defaultTransport, setDefaultTransport] = useState(userProfile.defaultTransport);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      name,
      homeCity,
      preferredCurrency,
      defaultPace,
      defaultTransport,
    });
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto my-auto space-y-4 shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Travel Preferences & Profile</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Appearance / Theme Selector */}
        {setDarkMode && (
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Appearance Theme</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  !darkMode
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                }`}
              >
                <Sun className={`w-4 h-4 ${!darkMode ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Lite Theme</span>
              </button>

              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  darkMode
                    ? 'bg-blue-950/80 border-blue-500 text-blue-300 shadow-2xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                }`}
              >
                <Moon className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Home City / Base Location</label>
            <input
              type="text"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Currency</label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
              >
                <option value="INR" className="dark:bg-slate-800">₹ INR (Indian Rupee)</option>
                <option value="USD" className="dark:bg-slate-800">$ USD (US Dollar)</option>
                <option value="EUR" className="dark:bg-slate-800">€ EUR (Euro)</option>
                <option value="GBP" className="dark:bg-slate-800">£ GBP (Pound)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Travel Pace</label>
              <select
                value={defaultPace}
                onChange={(e) => setDefaultPace(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
              >
                <option value="Relaxed" className="dark:bg-slate-800">Relaxed (Slow)</option>
                <option value="Balanced" className="dark:bg-slate-800">Balanced</option>
                <option value="Fast" className="dark:bg-slate-800">Fast Paced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Default Transport</label>
            <select
              value={defaultTransport}
              onChange={(e) => setDefaultTransport(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
            >
              <option value="Car" className="dark:bg-slate-800">Rental Car / Private</option>
              <option value="Bike/Scooter" className="dark:bg-slate-800">Bike / Scooter</option>
              <option value="Bus/Train" className="dark:bg-slate-800">Public Bus / Train</option>
              <option value="Walking" className="dark:bg-slate-800">Walking / Trek</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedMsg ? (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences Updated!
              </span>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
