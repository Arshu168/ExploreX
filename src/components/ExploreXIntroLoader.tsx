import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface ExploreXIntroLoaderProps {
  userName?: string;
  onComplete: () => void;
  darkMode?: boolean;
}

export const ExploreXIntroLoader: React.FC<ExploreXIntroLoaderProps> = ({
  userName = 'Explorer',
  onComplete,
  darkMode = true,
}) => {
  // Animation Phase State Machine
  // 1: 'letters-drop' (Letters dropping one by one, X spinning)
  // 2: 'x-slam' (X drops and slams in place)
  // 3: 'vehicle-drop' (Vehicle drops from top)
  // 4: 'vehicle-drive' (Vehicle drives forward on the road)
  // 5: 'finish' (Fade out and complete)
  const [phase, setPhase] = useState<'letters-drop' | 'x-slam' | 'vehicle-drop' | 'vehicle-drive' | 'finish'>('letters-drop');
  const [progress, setProgress] = useState<number>(0);
  const [loadingText, setLoadingText] = useState<string>('Initializing ExploreX AI engine...');

  useEffect(() => {
    // Timeline Sequence:
    // T = 0ms: Letters drop
    // T = 1600ms: X finishes spin and drops/slams
    // T = 2200ms: Vehicle drops onto the road
    // T = 2700ms: Vehicle starts driving with progress bar
    // T = 4500ms: Finish and transition to dashboard

    const t1 = setTimeout(() => {
      setPhase('x-slam');
    }, 1500);

    const t2 = setTimeout(() => {
      setPhase('vehicle-drop');
      setLoadingText('Calibrating multi-modal routes...');
    }, 2100);

    const t3 = setTimeout(() => {
      setPhase('vehicle-drive');
      setLoadingText('Connecting flights, trains & hotels...');
    }, 2700);

    const t4 = setTimeout(() => {
      setPhase('finish');
    }, 4500);

    const t5 = setTimeout(() => {
      onComplete();
    }, 4900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  // Progress Bar Incrementer
  useEffect(() => {
    if (phase === 'vehicle-drive' || phase === 'vehicle-drop') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + 5;
          if (next > 30 && next < 60) setLoadingText('Discovering authentic hidden gems...');
          else if (next >= 60 && next < 85) setLoadingText(`Welcome back, ${userName}! Opening workspace...`);
          else if (next >= 85) setLoadingText('Ready to Explore!');
          return next;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [phase, userName]);

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden selection:bg-none select-none transition-opacity duration-500">
      {/* Background Animated Gradient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.15),transparent_70%)] pointer-events-none" />

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer z-50 backdrop-blur-sm"
      >
        Skip ➔
      </button>

      {/* Main Animation Stage */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-xl px-4 text-center">
        
        {/* ============================================================== */}
        {/* VEHICLE DROP & DRIVE STAGE */}
        {/* ============================================================== */}
        <div className="relative w-full h-44 flex items-center justify-center overflow-hidden mb-2">
          {/* Animated Road Line */}
          <div className="absolute bottom-6 left-0 right-0 h-3 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
            {/* Moving Dashes */}
            <div 
              className={`absolute inset-0 flex gap-4 ${phase === 'vehicle-drive' ? 'animate-road-move' : ''}`}
              style={{ width: '200%' }}
            >
              {Array.from({ length: 24 }).map((_, idx) => (
                <div key={idx} className="w-8 h-1 bg-yellow-400/90 rounded-full my-auto shrink-0 shadow-sm" />
              ))}
            </div>
          </div>

          {/* ExploreX Vehicle Container */}
          {(phase === 'vehicle-drop' || phase === 'vehicle-drive' || phase === 'finish') && (
            <div
              className={`absolute bottom-6 z-20 flex flex-col items-center transition-all ${
                phase === 'vehicle-drop' 
                  ? 'animate-vehicle-slam' 
                  : phase === 'vehicle-drive' 
                  ? 'animate-vehicle-cruising' 
                  : 'translate-x-[280px] opacity-0'
              }`}
            >
              {/* Vehicle Body Graphic */}
              <div className="relative w-52 sm:w-60 group">
                {/* Vehicle SVG Logo Recreation */}
                <svg viewBox="0 0 340 190" className="w-full h-auto drop-shadow-2xl">
                  {/* Outer Sleek Chassis Pod */}
                  <path
                    d="M 40 120 C 30 70, 70 30, 240 30 C 290 30, 310 70, 300 120 C 260 145, 110 145, 40 120 Z"
                    fill="#0a2540"
                    stroke="#ffffff"
                    strokeWidth="5"
                  />

                  {/* Red Location Pin at Rear */}
                  <g transform="translate(265, 20) scale(0.95)">
                    <path
                      d="M 20 0 C 9 0, 0 9, 0 20 C 0 35, 20 55, 20 55 C 20 55, 40 35, 40 20 C 40 9, 31 0, 20 0 Z"
                      fill="#ef4444"
                    />
                    <circle cx="20" cy="20" r="7" fill="#ffffff" />
                  </g>

                  {/* Multi-Colored Multi-Modal Windows Panel */}
                  <g transform="translate(52, 42)">
                    {/* 1. Airplane (Blue) */}
                    <rect x="0" y="0" width="40" height="58" rx="8" fill="#0284c7" />
                    {/* Plane Icon SVG */}
                    <path d="M 20 12 L 23 26 L 35 32 L 35 36 L 23 33 L 23 44 L 27 48 L 27 51 L 20 49 L 13 51 L 13 48 L 17 44 L 17 33 L 5 36 L 5 32 L 17 26 Z" fill="#ffffff" />

                    {/* 2. Train (Emerald) */}
                    <rect x="44" y="0" width="40" height="58" rx="8" fill="#10b981" />
                    {/* Train Icon SVG */}
                    <g transform="translate(48, 14) scale(0.8)">
                      <rect x="2" y="2" width="34" height="34" rx="6" fill="none" stroke="#ffffff" strokeWidth="3" />
                      <line x1="2" y1="18" x2="36" y2="18" stroke="#ffffff" strokeWidth="3" />
                      <circle cx="10" cy="26" r="3" fill="#ffffff" />
                      <circle cx="28" cy="26" r="3" fill="#ffffff" />
                      <line x1="8" y1="36" x2="2" y2="44" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                      <line x1="30" y1="36" x2="36" y2="44" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                    </g>

                    {/* 3. Bus (Amber) */}
                    <rect x="88" y="0" width="40" height="58" rx="8" fill="#f59e0b" />
                    {/* Bus Icon SVG */}
                    <g transform="translate(93, 14) scale(0.8)">
                      <rect x="2" y="2" width="34" height="36" rx="6" fill="none" stroke="#ffffff" strokeWidth="3" />
                      <rect x="6" y="7" width="26" height="12" rx="2" fill="#ffffff" />
                      <circle cx="10" cy="28" r="3" fill="#ffffff" />
                      <circle cx="28" cy="28" r="3" fill="#ffffff" />
                    </g>

                    {/* 4. Car (Purple) */}
                    <rect x="132" y="0" width="40" height="58" rx="8" fill="#8b5cf6" />
                    {/* Car Icon SVG */}
                    <g transform="translate(136, 17) scale(0.8)">
                      <path d="M 6 16 L 10 4 L 28 4 L 32 16 Z" fill="#ffffff" />
                      <rect x="2" y="14" width="34" height="14" rx="4" fill="#ffffff" />
                      <circle cx="8" cy="28" r="4" fill="#8b5cf6" />
                      <circle cx="30" cy="28" r="4" fill="#8b5cf6" />
                    </g>

                    {/* 5. Ferry Boat (Cyan) */}
                    <rect x="176" y="0" width="42" height="58" rx="8" fill="#06b6d4" />
                    {/* Boat Icon SVG */}
                    <g transform="translate(181, 16) scale(0.8)">
                      <path d="M 4 24 L 34 24 L 30 34 L 8 34 Z" fill="#ffffff" />
                      <rect x="12" y="10" width="14" height="12" fill="#ffffff" />
                      <path d="M 0 38 Q 9 34 19 38 Q 29 42 38 38" stroke="#ffffff" strokeWidth="3" fill="none" />
                    </g>
                  </g>

                  {/* Road Asphalt Stripe Along Underbody */}
                  <path
                    d="M 50 115 Q 170 135 280 95 L 280 120 Q 170 145 50 130 Z"
                    fill="#0284c7"
                  />
                  {/* Road Dashes on Vehicle */}
                  <line x1="90" y1="124" x2="115" y2="122" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="130" y1="120" x2="155" y2="118" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="170" y1="115" x2="195" y2="111" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="210" y1="108" x2="235" y2="103" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

                  {/* Rotating Wheels */}
                  <g transform="translate(95, 136)">
                    <circle cx="0" cy="0" r="18" fill="#0a2540" stroke="#ffffff" strokeWidth="3" />
                    <circle cx="0" cy="0" r="8" fill="#38bdf8" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#ffffff" strokeWidth="2" className={phase === 'vehicle-drive' ? 'animate-spin' : ''} />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#ffffff" strokeWidth="2" className={phase === 'vehicle-drive' ? 'animate-spin' : ''} />
                  </g>

                  <g transform="translate(225, 132)">
                    <circle cx="0" cy="0" r="18" fill="#0a2540" stroke="#ffffff" strokeWidth="3" />
                    <circle cx="0" cy="0" r="8" fill="#38bdf8" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#ffffff" strokeWidth="2" className={phase === 'vehicle-drive' ? 'animate-spin' : ''} />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#ffffff" strokeWidth="2" className={phase === 'vehicle-drive' ? 'animate-spin' : ''} />
                  </g>

                  {/* Headlight Beam */}
                  {phase === 'vehicle-drive' && (
                    <polygon
                      points="290,110 370,80 370,140 290,120"
                      fill="url(#headlight-grad)"
                      opacity="0.35"
                    />
                  )}
                  <defs>
                    <linearGradient id="headlight-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* EXPLOREX WORDING - LETTER DROP & X 3D SPIN STAGE */}
        {/* ============================================================== */}
        <div className="flex items-center justify-center gap-0.5 sm:gap-1 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight my-2">
          {/* E */}
          <span className="inline-block animate-letter-drop [animation-delay:100ms] text-slate-100 font-sans">
            E
          </span>
          {/* x */}
          <span className="inline-block animate-letter-drop [animation-delay:250ms] text-slate-100 font-sans">
            x
          </span>
          {/* p */}
          <span className="inline-block animate-letter-drop [animation-delay:400ms] text-slate-100 font-sans">
            p
          </span>
          {/* l */}
          <span className="inline-block animate-letter-drop [animation-delay:550ms] text-slate-100 font-sans">
            l
          </span>
          {/* o with Compass */}
          <span className="inline-block animate-letter-drop [animation-delay:700ms] relative text-slate-100 font-sans">
            o
            <Compass className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-sky-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-spin [animation-duration:8s]" />
          </span>
          {/* r */}
          <span className="inline-block animate-letter-drop [animation-delay:850ms] text-slate-100 font-sans">
            r
          </span>
          {/* e */}
          <span className="inline-block animate-letter-drop [animation-delay:1000ms] text-slate-100 font-sans">
            e
          </span>

          {/* THE 'X' - 3D RAPID SPIN & SLAM DROP */}
          <div className="inline-block ml-0.5 relative perspective-1000">
            <span
              className={`inline-block font-black bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent transform-gpu ${
                phase === 'letters-drop'
                  ? 'animate-x-spin-3d text-5xl sm:text-7xl md:text-8xl drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]'
                  : 'animate-x-slam text-4xl sm:text-6xl md:text-7xl drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]'
              }`}
            >
              X
            </span>
          </div>
        </div>

        {/* Subtitle: Flights • Trains • Buses • Cabs • Ferries */}
        <div 
          className={`flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-widest uppercase font-extrabold text-slate-400 mt-1 transition-all duration-700 ${
            phase !== 'letters-drop' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span>Flights</span>
          <span className="text-orange-500">•</span>
          <span>Trains</span>
          <span className="text-emerald-500">•</span>
          <span>Buses</span>
          <span className="text-amber-500">•</span>
          <span>Cabs</span>
          <span className="text-cyan-500">•</span>
          <span>Ferries</span>
        </div>

        {/* ============================================================== */}
        {/* LOADING PROGRESS BAR & TEXT */}
        {/* ============================================================== */}
        <div className="w-full max-w-xs sm:max-w-sm mt-8 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:3s]" />
              {loadingText}
            </span>
            <span className="font-mono text-slate-300">{progress}%</span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-orange-500 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
