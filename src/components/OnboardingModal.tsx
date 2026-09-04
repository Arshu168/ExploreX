import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Compass, 
  MapPin, 
  DollarSign, 
  Calendar, 
  User, 
  Heart, 
  Bike,
  ShieldCheck,
  Info
} from 'lucide-react';
import { getBudgetBoundsForDestination } from '../utils/budgetUtils';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    destination: string;
    budget: number;
    durationDays: number;
    travelStyle: string;
    interests: string[];
    transportMode: string;
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('Coimbatore & Valparai');
  const [budget, setBudget] = useState(0);
  const [durationDays, setDurationDays] = useState(3);
  const [travelStyle, setTravelStyle] = useState('Friends');
  const [interests, setInterests] = useState<string[]>(['Waterfalls', 'Mountains', 'Cafes', 'Road Trips']);
  const [transportMode, setTransportMode] = useState('Bike');

  if (!isOpen) return null;

  const styleOptions = [
    { id: 'Solo', label: 'Solo', desc: 'Peaceful self-discovery' },
    { id: 'Friends', label: 'Friends', desc: 'Group fun & shared costs' },
    { id: 'Remote Work', label: 'Remote Work', desc: 'Cafes with Wi-Fi & quiet' },
    { id: 'Photography', label: 'Photography', desc: 'Scenic sunrise & sunset spots' },
    { id: 'Camping', label: 'Camping', desc: 'Stargazing & outdoor tents' },
    { id: 'Family', label: 'Family', desc: 'Comfortable & easy accessibility' },
  ];

  const interestOptions = [
    'Waterfalls', 'Mountains', 'Cafes', 'Villages', 
    'Sunrise', 'Sunset', 'Temples', 'Road Trips'
  ];

  const transportOptions = [
    { id: 'Bike', label: 'Bike / Scooter', desc: 'Agile offbeat trail riding' },
    { id: 'Car', label: 'Car / SUV', desc: 'Comfortable family & group cruising' },
    { id: 'Train', label: 'Train', desc: 'Scenic rail journeys' },
    { id: 'Bus', label: 'Bus / Public Transit', desc: 'Budget friendly local experience' },
  ];

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      onComplete({
        destination,
        budget,
        durationDays,
        travelStyle,
        interests,
        transportMode,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900 dark:text-slate-100 relative">
        {/* Top Progress & Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white">AI Onboarding Setup</h3>
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Step {step} of 6</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="space-y-4 min-h-[260px] flex flex-col justify-center">
          {/* Step 1: Destination */}
          {step === 1 && (
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-900 dark:text-white block flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>1. Where do you want to travel?</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Coimbatore, Valparai, Ooty, Amalfi Coast..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl p-3.5 text-sm font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
              />
              <div className="flex flex-wrap gap-2 pt-2">
                {['Coimbatore', 'Ooty Hidden Trails', 'Valparai', 'Agumbe', 'Munnar'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setDestination(loc)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/60 text-slate-800 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-bold transition border border-slate-200/80 dark:border-slate-700"
                  >
                    + {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (() => {
            const groupCount = travelStyle === 'Solo' ? 1 : travelStyle === 'Family' ? 4 : 2;
            const bounds = getBudgetBoundsForDestination(destination, durationDays, groupCount);
            // Allow slider to go up to 500,000 INR or higher dynamically based on user input
            const sliderMax = Math.max(budget * 1.5, bounds.maxSuggestedBudget * 2.5, 500000);

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-slate-900 dark:text-white block flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>2. What is your total budget in ₹?</span>
                  </label>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Custom User Preference (No Upper Limit)
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 text-center space-y-3">
                  {/* Direct Editable Amount Input */}
                  <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={budget === 0 ? '' : budget}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setBudget(isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      className="w-full text-2xl font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-center focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                      placeholder="Enter budget (e.g. 15000)..."
                    />
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={sliderMax}
                    step={500}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  {/* Destination Benchmark Reference Bar */}
                  <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/80 dark:border-slate-700/80">
                    <span>Min: ₹{bounds.minBudget.toLocaleString()}</span>
                    <span className="text-blue-700 dark:text-blue-400 font-extrabold">Destination Rec: ₹{bounds.suggestedBudget.toLocaleString()}</span>
                    <span>High End: ₹{bounds.maxSuggestedBudget.toLocaleString()}</span>
                  </div>

                  {/* Flexible Preset Tier Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setBudget(bounds.suggestedBudget)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        budget === bounds.suggestedBudget 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      Rec (₹{bounds.suggestedBudget.toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudget(75000)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        budget === 75000 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      ₹75,000
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudget(150000)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        budget === 150000 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      ₹1.5 Lakhs
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudget(300000)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        budget === 300000 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      ₹3.0 Lakhs
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium text-left bg-blue-50/70 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200/60 dark:border-blue-900/60 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>Set any budget according to your personal preference — type an exact amount above or drag the slider without restrictions.</span>
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Step 3: Trip Duration */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-900 dark:text-white block flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>3. How long is your trip?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[2, 3, 5, 7].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className={`p-4 rounded-2xl border text-center transition ${
                      durationDays === days
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-xl font-black block">{days} Days</span>
                    <span className="text-[10px] font-bold opacity-80">{days === 2 ? 'Weekend Getaway' : days === 3 ? 'Long Weekend' : 'Extended Explorer'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Travel Style */}
          {step === 4 && (
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-900 dark:text-white block flex items-center gap-2">
                <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>4. What is your Travel Style?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {styleOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTravelStyle(s.id)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      travelStyle === s.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{s.label}</span>
                    <span className="text-[10px] font-medium opacity-80 block mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Interests */}
          {step === 5 && (
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-900 dark:text-white block flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>5. What activities interest you?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {interestOptions.map((item) => {
                  const isSel = interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                        isSel
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-300'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{item}</span>
                      {isSel && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Transportation */}
          {step === 6 && (
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-900 dark:text-white block flex items-center gap-2">
                <Bike className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>6. How do you plan to move around?</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {transportOptions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTransportMode(t.id)}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      transportMode === t.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{t.label}</span>
                    <span className="text-[10px] font-medium opacity-80 block mt-0.5">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <span>{step === 6 ? 'Generate AI Itinerary' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
