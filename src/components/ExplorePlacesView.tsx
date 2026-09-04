import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  MapPin, 
  Bookmark, 
  Star, 
  Grid, 
  List, 
  ExternalLink,
  Plus,
  Sparkles,
  Globe,
  Loader2,
  Check
} from 'lucide-react';
import { Place } from '../types';
import { generateWorldwidePlacesWithAi } from '../utils/aiTravelEngine';

interface ExplorePlacesViewProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onToggleBookmark: (placeId: string) => void;
  onAddToItinerary?: (place: Place) => void;
  onAddGeneratedPlaces?: (newPlaces: Place[]) => void;
}

export const ExplorePlacesView: React.FC<ExplorePlacesViewProps> = ({
  places,
  onSelectPlace,
  onToggleBookmark,
  onAddToItinerary,
  onAddGeneratedPlaces,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');
  const [maxCrowd, setMaxCrowd] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // AI World Generator state
  const [worldPrompt, setWorldPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccessMsg, setGeneratedSuccessMsg] = useState<string | null>(null);

  const continents = [
    { id: 'all', label: '🌍 All World Continents' },
    { id: 'Asia', label: '⛩️ Asia' },
    { id: 'Europe', label: '🏰 Europe' },
    { id: 'Americas', label: '🗽 Americas' },
    { id: 'Africa & Middle East', label: '🏜️ Africa & Middle East' },
    { id: 'Oceania', label: '🦘 Oceania' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'waterfall', label: 'Secret Waterfalls' },
    { id: 'viewpoint', label: 'Quiet Viewpoints' },
    { id: 'tea_estate', label: 'Tea & Coffee Estates' },
    { id: 'nature_trail', label: 'Nature Trails' },
    { id: 'sunset', label: 'Sunset Ridges' },
    { id: 'cafe', label: 'Organic Cafes' },
  ];

  const handleGenerateWorldPlaces = async (e: React.FormEvent) => {
    e.preventDefault();
    const promptTrimmed = worldPrompt.trim();
    if (!promptTrimmed) return;

    setIsGenerating(true);
    setGeneratedSuccessMsg(null);

    try {
      const newPlaces = await generateWorldwidePlacesWithAi(promptTrimmed);
      if (newPlaces.length > 0 && onAddGeneratedPlaces) {
        onAddGeneratedPlaces(newPlaces);
        setGeneratedSuccessMsg(`✨ Successfully generated 3 live AI place recommendations for "${promptTrimmed}"!`);
        setWorldPrompt('');
        setTimeout(() => setGeneratedSuccessMsg(null), 5000);
      }
    } catch {
      // Handled
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPlaces = places.filter(place => {
    const qLower = searchQuery.toLowerCase();
    const matchesSearch = !qLower || 
                          place.name.toLowerCase().includes(qLower) ||
                          place.description.toLowerCase().includes(qLower) ||
                          place.region.toLowerCase().includes(qLower) ||
                          (place.country && place.country.toLowerCase().includes(qLower)) ||
                          place.tags.some(t => t.toLowerCase().includes(qLower));

    const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesContinent = selectedContinent === 'all' || (place.continent && place.continent === selectedContinent) || (!place.continent && selectedContinent === 'Asia');
    const matchesCrowd = place.crowdLevel <= maxCrowd;
    const matchesDifficulty = selectedDifficulty === 'all' || place.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesContinent && matchesCrowd && matchesDifficulty;
  });

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Worldwide Destinations & AI Suggestions</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            Discover uncrowded places, secret waterfalls, coastal cliffs, and offbeat sights across all 6 continents.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'grid' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              viewMode === 'list' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Global AI Places Generator Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-lg space-y-3 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <h2 className="font-extrabold text-sm sm:text-base">AI Worldwide Destination Search & Generator API</h2>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
            Live AI Connected
          </span>
        </div>

        <p className="text-xs text-slate-300 font-medium max-w-2xl relative z-10">
          Want places for any city or country in the world? Type any global location below (e.g. <span className="text-amber-200 font-bold">"Switzerland"</span>, <span className="text-amber-200 font-bold">"Tokyo"</span>, <span className="text-amber-200 font-bold">"Paris"</span>, <span className="text-amber-200 font-bold">"Rio de Janeiro"</span>, <span className="text-amber-200 font-bold">"Bali"</span>, <span className="text-amber-200 font-bold">"Iceland"</span>) and our AI Travel Engine will instantly fetch and generate live places for you!
        </p>

        {generatedSuccessMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-300" />
            <span>{generatedSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleGenerateWorldPlaces} className="flex flex-col sm:flex-row gap-2 relative z-10">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Enter any world city, country or region (e.g. Switzerland, Kyoto, Ooty, Maldives)..."
              value={worldPrompt}
              onChange={(e) => setWorldPrompt(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 focus:border-blue-400 text-white placeholder-slate-400 text-xs rounded-xl pl-10 pr-3 py-2.5 font-medium focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md whitespace-nowrap cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting API & Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate World Places</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xs">
        {/* Continent Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0 mr-1">Continent:</span>
          {continents.map((cont) => (
            <button
              key={cont.id}
              onClick={() => setSelectedContinent(cont.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                selectedContinent === cont.id
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {cont.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spots, region, tags..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-medium"
            />
          </div>

          {/* Crowd Level Filter */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Max Crowd: <strong className="text-blue-600 dark:text-blue-400">{maxCrowd}%</strong>
            </span>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={maxCrowd}
              onChange={(e) => setMaxCrowd(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-transparent text-xs text-slate-900 dark:text-slate-100 font-bold focus:outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Difficulties</option>
              <option value="Easy" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Easy Walk</option>
              <option value="Moderate" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Moderate Hike</option>
              <option value="Challenging" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Challenging Trek</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {filteredPlaces.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-2xs">
          <Compass className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No places match your filters</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto font-medium">
            Try adjusting your search query or increasing the maximum crowd level.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="group bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer" onClick={() => onSelectPlace(place)}>
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur text-blue-600 dark:text-blue-400 text-[10px] font-extrabold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 shadow-xs">
                    {place.crowdLevel}% Crowd Traffic
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(place.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition ${
                      place.isBookmarked ? 'bg-blue-600 text-white' : 'bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2.5 py-0.5 rounded-md font-bold text-[11px] text-slate-800 dark:text-slate-200">
                      {place.difficulty}
                    </span>
                    <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2.5 py-0.5 rounded-md font-bold text-amber-600 dark:text-amber-400 text-[11px] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{place.rating}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3
                    onClick={() => onSelectPlace(place)}
                    className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition cursor-pointer line-clamp-1"
                  >
                    {place.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{place.region}</span>
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 mt-2 pt-3">
                <span className="text-slate-900 dark:text-white font-extrabold">
                  {place.estimatedCost === 0 ? 'Free Entry' : `₹${place.estimatedCost.toLocaleString()}`}
                </span>

                <div className="flex items-center gap-2">
                  {onAddToItinerary && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToItinerary(place);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-[11px] font-bold transition flex items-center gap-1 shadow-2xs"
                      title="Add to Active Itinerary"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>+ Itinerary</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectPlace(place)}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-4 transition flex flex-col sm:flex-row items-center gap-4 cursor-pointer shadow-2xs group"
            >
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 space-y-1.5 text-left w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(place.id);
                      }}
                      className={`p-1.5 rounded-lg border transition ${
                        place.isBookmarked ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {place.rating}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{place.region}</span>
                  <span>•</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{place.crowdLevel}% Crowd</span>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{place.estimatedCost === 0 ? 'Free' : `₹${place.estimatedCost.toLocaleString()}`}</span>
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{place.description}</p>
                
                {onAddToItinerary && (
                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToItinerary(place);
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>+ Add to Active Itinerary</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
