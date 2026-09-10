import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { AiPlannerView } from './components/AiPlannerView';
import { ExplorePlacesView } from './components/ExplorePlacesView';
import { InteractiveMapView } from './components/InteractiveMapView';
import { AiChatView } from './components/AiChatView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { TeamWorkspaceView } from './components/TeamWorkspaceView';
import { SavedTripsView } from './components/SavedTripsView';
import { AiMemoriesView } from './components/AiMemoriesView';
import { RagVisualizerView } from './components/RagVisualizerView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { FloatingAiAssistant } from './components/FloatingAiAssistant';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { LocalBackendGuideModal } from './components/LocalBackendGuideModal';

import { 
  INITIAL_USER_PROFILE, 
  DUMMY_PLACES, 
  INITIAL_TRIPS, 
  INITIAL_EXPENSES, 
  INITIAL_TEAM_WORKSPACE, 
  INITIAL_MEMORIES,
  RAG_DOCUMENTS 
} from './data/dummyData';

import { Place, Trip, Expense, TeamWorkspace, Memory, UserProfile } from './types';
import { generateTripFromDetails } from './utils/tripGenerator';
import { saveUserDataToDatabase, fetchUserDataFromDatabase } from './utils/supabaseSync';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('explorex_logged_in') === 'true';
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem('explorex_current_user_email') || '';
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const email = localStorage.getItem('explorex_current_user_email');
    if (email) {
      const stored = localStorage.getItem(`explorex_user_data_${email.toLowerCase()}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.userProfile) return parsed.userProfile;
        } catch {}
      }
      return {
        ...INITIAL_USER_PROFILE,
        name: email.split('@')[0],
        email: email,
        isNewUser: false
      };
    }
    return {
      ...INITIAL_USER_PROFILE,
      name: 'Explorer',
      email: '',
      isNewUser: true
    };
  });

  const [places, setPlaces] = useState<Place[]>(DUMMY_PLACES);

  // Default trips, expenses, memories MUST be empty arrays [] for zero stats
  const [trips, setTrips] = useState<Trip[]>(() => {
    const email = localStorage.getItem('explorex_current_user_email');
    if (email) {
      const stored = localStorage.getItem(`explorex_user_data_${email.toLowerCase()}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed.trips)) return parsed.trips;
        } catch {}
      }
    }
    return [];
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const email = localStorage.getItem('explorex_current_user_email');
    if (email) {
      const stored = localStorage.getItem(`explorex_user_data_${email.toLowerCase()}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed.expenses)) return parsed.expenses;
        } catch {}
      }
    }
    return [];
  });

  const [team, setTeam] = useState<TeamWorkspace>(INITIAL_TEAM_WORKSPACE);

  const [memories, setMemories] = useState<Memory[]>(() => {
    const email = localStorage.getItem('explorex_current_user_email');
    if (email) {
      const stored = localStorage.getItem(`explorex_user_data_${email.toLowerCase()}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed.memories)) return parsed.memories;
        } catch {}
      }
    }
    return [];
  });

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const [selectedPlaceModal, setSelectedPlaceModal] = useState<Place | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showBackendGuideModal, setShowBackendGuideModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('explorex_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    }
    return false;
  });

  // Sync dark class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('explorex_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('explorex_theme', 'light');
    }
  }, [darkMode]);

  // Check if current user has admin access
  const isAdmin = (userProfile.role === 'admin') || (userProfile.email?.trim().toLowerCase() === 'arshuu8888@gmail.com') || (currentUserEmail?.trim().toLowerCase() === 'arshuu8888@gmail.com');

  // Active trip reference
  const activeTrip = (selectedTripId ? trips.find(t => t.id === selectedTripId) : null) || trips[0] || null;

  // Sync state to localStorage and database per logged-in user email
  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      const cleanEmail = currentUserEmail.toLowerCase();
      const userData = {
        userProfile,
        trips,
        expenses,
        memories
      };
      localStorage.setItem(`explorex_user_data_${cleanEmail}`, JSON.stringify(userData));

      // Debounced background database save
      const timer = setTimeout(() => {
        saveUserDataToDatabase({
          email: cleanEmail,
          profile: userProfile,
          trips,
          expenses,
          memories
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, currentUserEmail, trips, expenses, memories, userProfile]);

  const handleOpenNewTrip = () => {
    setShowOnboardingModal(true);
  };

  const handleOnboardingComplete = (data: {
    destination: string;
    budget: number;
    durationDays: number;
    travelStyle: string;
    interests: string[];
    transportMode: string;
  }) => {
    const newOnboardedTrip = generateTripFromDetails(data);
    setTrips(prev => [newOnboardedTrip, ...prev]);
    setSelectedTripId(newOnboardedTrip.id);
    setCurrentView('ai-planner');
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 4000);
  };

  const handleAuthSuccess = async (userName: string, email: string, isNewUser: boolean = false, role?: 'admin' | 'user') => {
    const cleanEmail = email.trim().toLowerCase();
    const isUserAdmin = role === 'admin' || cleanEmail === 'arshuu8888@gmail.com';
    const effectiveRole: 'admin' | 'user' = isUserAdmin ? 'admin' : 'user';

    setIsLoggedIn(true);
    setCurrentUserEmail(cleanEmail);
    localStorage.setItem('explorex_logged_in', 'true');
    localStorage.setItem('explorex_current_user_email', cleanEmail);

    const storedData = localStorage.getItem(`explorex_user_data_${cleanEmail}`);
    let loadedTrips: Trip[] = [];
    let loadedExpenses: Expense[] = [];
    let loadedMemories: Memory[] = [];
    let loadedProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      name: userName || cleanEmail.split('@')[0],
      email: cleanEmail,
      isNewUser: isNewUser,
      role: effectiveRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName || cleanEmail.split('@')[0])}`
    };

    if (storedData && !isNewUser) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed.trips)) loadedTrips = parsed.trips;
        if (Array.isArray(parsed.expenses)) loadedExpenses = parsed.expenses;
        if (Array.isArray(parsed.memories)) loadedMemories = parsed.memories;
        if (parsed.userProfile) {
          loadedProfile = { 
            ...parsed.userProfile, 
            name: userName || parsed.userProfile.name, 
            email: cleanEmail,
            role: effectiveRole
          };
        }
      } catch {}
    }

    // Attempt remote database sync in background to fetch latest cloud data
    fetchUserDataFromDatabase(cleanEmail).then(res => {
      if (res && res.data) {
        const dbData = res.data;
        if (Array.isArray(dbData.trips) && dbData.trips.length > 0) {
          setTrips(dbData.trips);
        }
        if (Array.isArray(dbData.expenses) && dbData.expenses.length > 0) {
          setExpenses(dbData.expenses);
        }
        if (Array.isArray(dbData.memories) && dbData.memories.length > 0) {
          setMemories(dbData.memories);
        }
        if (dbData.profile) {
          setUserProfile(prev => ({ ...prev, ...dbData.profile, email: cleanEmail }));
        }
      }
    });

    setUserProfile(loadedProfile);
    setTrips(loadedTrips);
    setExpenses(loadedExpenses);
    setMemories(loadedMemories);

    if (effectiveRole === 'admin') {
      showToast(`Welcome Administrator ${userName}! Admin Panel unlocked.`);
      setCurrentView('admin');
    } else if (isNewUser) {
      showToast(`Welcome to ExploreX, ${userName}! Your explorer hub is ready.`);
      setCurrentView('dashboard');
    } else {
      showToast(`Welcome back, ${userName}! Logged in successfully.`);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserEmail('');
    localStorage.removeItem('explorex_logged_in');
    localStorage.removeItem('explorex_current_user_email');
    setUserProfile({
      ...INITIAL_USER_PROFILE,
      name: 'Explorer',
      email: '',
      isNewUser: true
    });
    setTrips([]);
    setExpenses([]);
    setMemories([]);
    showToast('Signed out of ExploreX successfully.');
    setCurrentView('login');
  };

  const handleToggleBookmark = (placeId: string) => {
    const target = places.find(p => p.id === placeId);
    if (!target) return;
    const nextState = !target.isBookmarked;
    setPlaces(places.map(p => 
      p.id === placeId ? { ...p, isBookmarked: nextState } : p
    ));
    showToast(nextState ? `Saved "${target.name}" to Bookmarked Spots!` : `Removed "${target.name}" from Bookmarks.`);
  };

  const handleSaveTrip = (newTrip: Trip) => {
    setTrips(prev => {
      const exists = prev.some(t => t.id === newTrip.id);
      if (exists) {
        return prev.map(t => t.id === newTrip.id ? newTrip : t);
      }
      return [newTrip, ...prev];
    });
  };

  const handleDuplicateTrip = (tripToDup: Trip) => {
    const dupTrip: Trip = {
      ...tripToDup,
      id: `trip-dup-${Date.now()}`,
      title: `${tripToDup.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTrips([dupTrip, ...trips]);
    showToast(`Duplicated "${tripToDup.title}"!`);
  };

  const handleRemoveTrip = (tripId: string) => {
    const deleted = trips.find(t => t.id === tripId);
    setTrips(trips.filter(t => t.id !== tripId));
    if (deleted) showToast(`Deleted "${deleted.title}".`);
  };

  const handleAddExpense = (newExp: Expense) => {
    setExpenses([newExp, ...expenses]);
    showToast(`Logged expense ₹${newExp.amount.toLocaleString()} for ${newExp.category}!`);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  const handleUpdateMemory = (updatedMemory: Memory) => {
    setMemories(prev => prev.map(m => m.id === updatedMemory.id ? updatedMemory : m));
    showToast('Saved changes to travel diary & trip album!');
  };

  const handleDeleteMemory = (memoryId: string) => {
    setMemories(prev => prev.filter(m => m.id !== memoryId));
    showToast('Memory entry removed.');
  };

  const handleGenerateNewMemory = (tripTitle: string, tripId?: string, photos?: string[], initialDiary?: string) => {
    const linkedTrip = trips.find(t => t.id === tripId) || activeTrip;
    const defaultPhotos = photos && photos.length > 0 
      ? photos 
      : ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'];

    const newMem: Memory = {
      id: `mem-${Date.now()}`,
      tripId: linkedTrip?.id || tripId || 't1',
      tripTitle: tripTitle || (linkedTrip ? linkedTrip.title : 'Unforgettable Gateway Journey'),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      highlightPhoto: defaultPhotos[0],
      photos: defaultPhotos,
      diaryEntry: initialDiary || `Leaving early while the morning fog clung to the valleys was the best decision we made for ${tripTitle}. The quiet mountain air, secluded vistas, and authentic local tea stops made this journey completely timeless and serene.`,
      blogPost: `# ${tripTitle}: An AI Curated Journey\n\nExploring offbeat trails and hidden gems provided unmatched serenity. From morning espresso at local cafes to scenic viewpoints, every detail was seamlessly harmonized.\n\n## Highlights & Reflections\n- Scenic secluded trails with zero tourist congestion\n- Authentic local culinary discoveries\n- Sustainable and respectful travel pace`,
      socialCaptions: [
        {
          platform: 'Instagram',
          text: `Lost in paradise with ${tripTitle} ✨ No crowds, just pure serenity.`,
          hashtags: ['#ExploreXAI', '#Wanderlust', '#TravelVibes', '#OffbeatEscape']
        },
        {
          platform: 'X',
          text: `Just finished my ${tripTitle} trip planned with @ExploreXAI. 10/10 hidden gems uncovered.`,
          hashtags: ['#TravelTech', '#AIPlanner', '#HiddenGems']
        },
        {
          platform: 'LinkedIn',
          text: `Reflecting on my recent offbeat travel experience in ${tripTitle}. Disconnecting in nature and supporting local homestays brings fresh creative clarity.`,
          hashtags: ['#Workation', '#MindfulTravel', '#ExploreX']
        }
      ]
    };
    setMemories([newMem, ...memories]);
    showToast('Created AI memory card with travel journal & photo album!');
  };

  const handleAddToItinerary = (place: Place) => {
    if (!activeTrip) {
      showToast('No active trip set. Create a trip first!');
      return;
    }

    const updatedTrips = trips.map(trip => {
      if (trip.id !== activeTrip.id) return trip;

      const updatedDays = [...(trip.days || [])];
      if (updatedDays.length === 0) {
        updatedDays.push({
          dayNumber: 1,
          title: 'Day 1 Highlights',
          dayCost: 0,
          travelTimeMinutes: 45,
          distanceKm: 20,
          dayHighlights: [place.name],
          activities: []
        });
      }

      const day1 = { ...updatedDays[0] };
      const alreadyAdded = day1.activities.some(a => a.placeId === place.id || a.title === place.name);

      if (!alreadyAdded) {
        day1.activities = [
          ...day1.activities,
          {
            id: `act-${Date.now()}`,
            time: "03:00 PM",
            title: place.name,
            description: place.description,
            placeId: place.id,
            category: place.category,
            cost: place.estimatedCost,
            durationMinutes: 90,
            isHiddenGem: true,
            locationName: place.region
          }
        ];
        day1.dayCost = day1.activities.reduce((sum, a) => sum + a.cost, 0);
        updatedDays[0] = day1;

        const newSpent = updatedDays.reduce((acc, d) => acc + d.dayCost, 0);
        return {
          ...trip,
          days: updatedDays,
          budgetSpent: newSpent
        };
      }
      return trip;
    });

    setTrips(updatedTrips);
    showToast(`Added "${place.name}" to active itinerary (${activeTrip.title})!`);
  };

  const handleAddGeneratedPlaces = (newPlaces: Place[]) => {
    setPlaces(prev => [...newPlaces, ...prev]);
    showToast(`Added ${newPlaces.length} new worldwide places to your collection!`);
  };

  const handleUpdateTripBudget = (newBudget: number) => {
    if (!activeTrip) return;
    const updatedTrips = trips.map(t => t.id === activeTrip.id ? { ...t, budgetTotal: newBudget } : t);
    setTrips(updatedTrips);
    showToast(`Updated total trip budget to ₹${newBudget.toLocaleString()}!`);
  };

  const handleQuickPromptFromHeader = (promptText: string) => {
    if (!promptText || !promptText.trim()) {
      setCurrentView('ai-planner');
      return;
    }
    const textLower = promptText.toLowerCase();
    let dest = 'Coimbatore & Valparai';
    if (textLower.includes('amalfi')) dest = 'Amalfi Coast';
    else if (textLower.includes('kyoto')) dest = 'Kyoto, Japan';
    else if (textLower.includes('ooty')) dest = 'Ooty & Kotagiri';
    else if (textLower.includes('valparai')) dest = 'Valparai';
    else if (textLower.includes('munnar')) dest = 'Munnar & Gap Road';
    else if (textLower.includes('goa')) dest = 'Goa Beaches';
    else if (textLower.includes('paris')) dest = 'Paris, France';
    else if (textLower.includes('agumbe')) dest = 'Agumbe Rainforest';
    else if (textLower.includes('kodai')) dest = 'Kodaikanal';
    else {
      const cleaned = promptText.replace(/plan\s+(?:a\s+)?(?:\d+\s*-?\s*day\s+)?(?:luxury\s+|budget\s+|trip\s+to\s+|offbeat\s+)?/i, '').split(/(?:under|with|budget|in|for|₹|\$)/i)[0]?.trim();
      if (cleaned) dest = cleaned;
    }

    let duration = 3;
    const daysMatch = textLower.match(/(\d+)\s*-?\s*day/i);
    if (daysMatch && daysMatch[1]) {
      duration = Math.max(1, Math.min(10, parseInt(daysMatch[1], 10)));
    }

    let budget = 0;
    const kMatch = textLower.match(/(?:budget|under|for|cap|₹|\$)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
    const standardMatch = textLower.match(/(?:budget|under|for|cap|₹|\$)\s*(\d+[\d,]*)/i);
    if (kMatch && kMatch[1]) {
      budget = parseFloat(kMatch[1]) * 1000;
    } else if (standardMatch && standardMatch[1]) {
      budget = parseInt(standardMatch[1].replace(/,/g, ''), 10);
    }

    const generatedTrip = generateTripFromDetails({
      destination: dest,
      budget: budget,
      durationDays: duration,
      travelStyle: textLower.includes('luxury') ? 'Luxury' : textLower.includes('solo') ? 'Solo' : 'Friends',
      interests: ['Scenic Views', 'Hidden Gems', 'Local Cuisine'],
      transportMode: 'Car'
    });

    setTrips(prev => [generatedTrip, ...prev]);
    setSelectedTripId(generatedTrip.id);
    setCurrentView('ai-planner');
    showToast(`Generated ${duration}-day itinerary for ${dest} with budget ₹${budget.toLocaleString()}!`);
  };

  // If user is not logged in, show full-page Login & Registration screen first
  if (!isLoggedIn) {
    return (
      <LoginView
        onLoginSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f4f6fa] text-slate-900'} flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased transition-colors duration-200`}>
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenBackendGuide={() => setShowBackendGuideModal(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        onQuickSearch={handleQuickPromptFromHeader}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          savedTripsCount={trips.length}
          isMobileOpen={isMobileSidebarOpen}
          isAdmin={isAdmin}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenNewTrip={handleOpenNewTrip}
          onOpenBackendGuide={() => setShowBackendGuideModal(true)}
        />

        {/* View Viewport */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {currentView === 'landing' && (
            <LandingView
              onStartPlanning={handleOpenNewTrip}
              onOpenOnboarding={handleOpenNewTrip}
              onOpenLogin={() => { setAuthMode('login'); setShowAuthModal(true); }}
              onOpenRegister={() => { setAuthMode('register'); setShowAuthModal(true); }}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              places={places}
              trips={trips}
              memories={memories}
              onSelectPlace={(p) => setSelectedPlaceModal(p)}
              onSelectTrip={(t) => { setSelectedTripId(t.id); setCurrentView('ai-planner'); }}
              onNavigate={(v) => setCurrentView(v)}
              onPromptGenerate={handleQuickPromptFromHeader}
              onOpenNewTrip={handleOpenNewTrip}
            />
          )}

          {currentView === 'ai-planner' && (
            <AiPlannerView
              activeTrip={activeTrip}
              onSaveTrip={handleSaveTrip}
              onOpenMap={() => setCurrentView('map')}
              onShareToTeam={(t) => setCurrentView('team')}
              onOpenNewTrip={handleOpenNewTrip}
              availablePlaces={places}
              preferredCurrency={userProfile.preferredCurrency}
            />
          )}

          {currentView === 'explore' && (
            <ExplorePlacesView
              places={places}
              onSelectPlace={(p) => setSelectedPlaceModal(p)}
              onToggleBookmark={handleToggleBookmark}
              onAddToItinerary={handleAddToItinerary}
              onAddGeneratedPlaces={handleAddGeneratedPlaces}
              preferredCurrency={userProfile.preferredCurrency}
            />
          )}

          {currentView === 'map' && (
            <InteractiveMapView
              places={places}
              activeTrip={activeTrip}
              onSelectPlace={(p) => setSelectedPlaceModal(p)}
              onToggleBookmark={handleToggleBookmark}
              onAddToItinerary={handleAddToItinerary}
              onAddGeneratedPlaces={handleAddGeneratedPlaces}
            />
          )}

          {currentView === 'ai-chat' && (
            <AiChatView
              availablePlaces={places}
              onSelectPlace={(p) => setSelectedPlaceModal(p)}
            />
          )}

          {currentView === 'budget' && (
            <BudgetPlannerView
              activeTrip={activeTrip}
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              onUpdateTripBudget={handleUpdateTripBudget}
              preferredCurrency={userProfile.preferredCurrency}
            />
          )}

          {currentView === 'team' && (
            <TeamWorkspaceView
              team={team}
              places={places}
              onUpdateTeam={(updated) => setTeam(updated)}
            />
          )}

          {currentView === 'saved-trips' && (
            <SavedTripsView
              trips={trips}
              bookmarkedPlaces={places.filter(p => p.isBookmarked)}
              onSelectTrip={(t) => { setSelectedTripId(t.id); setCurrentView('ai-planner'); }}
              onSelectPlace={(p) => setSelectedPlaceModal(p)}
              onDuplicateTrip={handleDuplicateTrip}
              onRemoveTrip={handleRemoveTrip}
              onOpenNewTrip={handleOpenNewTrip}
              onAddToItinerary={handleAddToItinerary}
              onToggleBookmark={handleToggleBookmark}
              preferredCurrency={userProfile.preferredCurrency}
            />
          )}

          {currentView === 'memories' && (
            <AiMemoriesView
              memories={memories}
              trips={trips}
              activeTrip={activeTrip}
              onUpdateMemory={handleUpdateMemory}
              onDeleteMemory={handleDeleteMemory}
              onGenerateNewMemory={handleGenerateNewMemory}
            />
          )}

          {currentView === 'rag-visualizer' && (
            <RagVisualizerView
              documents={RAG_DOCUMENTS}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              userProfile={userProfile}
              trips={trips}
              memories={memories}
              onUpdateProfile={(up) => setUserProfile(up)}
              onOpenLogin={() => { setAuthMode('login'); setShowAuthModal(true); }}
              onLogout={handleLogout}
            />
          )}

          {currentView === 'admin' && (
            <AdminView
              userEmail={userProfile.email || currentUserEmail}
              places={places}
              trips={trips}
              memories={memories}
              expenses={expenses}
              onOpenLogin={() => { setAuthMode('login'); setShowAuthModal(true); }}
              onReturnDashboard={() => setCurrentView('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Global Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlaceModal}
        onClose={() => setSelectedPlaceModal(null)}
        onToggleBookmark={handleToggleBookmark}
        onAddToItinerary={handleAddToItinerary}
        preferredCurrency={userProfile.preferredCurrency}
      />

      {/* Global Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Global Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating AI Assistant Widget */}
      <FloatingAiAssistant />

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
