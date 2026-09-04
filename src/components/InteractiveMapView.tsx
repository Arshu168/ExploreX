import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Map as MapIcon, 
  Fuel, 
  Hospital, 
  Navigation, 
  X,
  ExternalLink,
  Sparkles,
  Bookmark,
  Search,
  Globe,
  Loader2,
  Check,
  MapPin,
  Compass,
  Layers,
  Maximize2,
  Eye
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, Trip } from '../types';
import { generateWorldwidePlacesWithAi } from '../utils/aiTravelEngine';

interface InteractiveMapViewProps {
  places: Place[];
  activeTrip?: Trip | null;
  initialDestination?: string;
  onSelectPlace: (place: Place) => void;
  onAddToItinerary?: (place: Place) => void;
  onToggleBookmark?: (placeId: string) => void;
  onAddGeneratedPlaces?: (newPlaces: Place[]) => void;
}

const WORLD_DESTINATIONS_GEO: Record<string, [number, number]> = {
  kyoto: [35.0116, 135.7681],
  japan: [35.6762, 139.6503],
  tokyo: [35.6762, 139.6503],
  osaka: [34.6937, 135.5023],
  amalfi: [40.6281, 14.4850],
  italy: [41.9028, 12.4964],
  rome: [41.9028, 12.4964],
  florence: [43.7696, 11.2558],
  venice: [45.4408, 12.3155],
  switzerland: [46.8182, 8.2275],
  grindelwald: [46.6586, 8.0560],
  interlaken: [46.6863, 7.8632],
  zermatt: [45.9765, 7.7491],
  bali: [-8.3405, 115.0920],
  ubud: [-8.5069, 115.2625],
  indonesia: [-0.7893, 113.9213],
  canada: [51.4428, -116.5361],
  yoho: [51.4428, -116.5361],
  banff: [51.1784, -115.5708],
  vancouver: [49.2827, -123.1207],
  'new zealand': [-44.6414, 167.8974],
  milford: [-44.6414, 167.8974],
  queenstown: [-45.0312, 168.6626],
  'cape town': [-33.9249, 18.4241],
  'south africa': [-30.5595, 22.9375],
  dubai: [25.2048, 55.2708],
  uae: [23.4241, 53.8478],
  paris: [48.8566, 2.3522],
  france: [46.2276, 2.2137],
  nice: [43.7102, 7.2620],
  london: [51.5074, -0.1278],
  uk: [55.3781, -3.4360],
  'new york': [40.7128, -74.0060],
  'san francisco': [37.7749, -122.4194],
  sydney: [-33.8688, 151.2093],
  australia: [-25.2744, 133.7751],
  bangkok: [13.7563, 100.5018],
  thailand: [15.8700, 100.9925],
  phuket: [7.8804, 98.3923],
  iceland: [64.9631, -19.0208],
  reykjavik: [64.1466, -21.9426],
  valparai: [10.3275, 76.9550],
  coimbatore: [11.0168, 76.9558],
  munnar: [10.0889, 77.0595],
  ooty: [11.4102, 76.6950],
  kerala: [10.8505, 76.2711],
  wayanad: [11.6854, 76.1320],
  kodaikanal: [10.2381, 77.4892],
  kodai: [10.2381, 77.4892],
  goa: [15.2993, 74.1240],
  manali: [32.2432, 77.1892],
  ladakh: [34.1526, 77.5771],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  pondicherry: [11.9416, 79.8083],
  india: [20.5937, 78.9629]
};

function getGeoForDestination(dest: string): [number, number] | null {
  const dLower = dest.toLowerCase().trim();
  if (!dLower) return null;
  for (const [key, coords] of Object.entries(WORLD_DESTINATIONS_GEO)) {
    if (dLower === key || dLower.includes(key) || key.includes(dLower)) {
      return coords;
    }
  }
  return null;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  places,
  activeTrip,
  initialDestination,
  onSelectPlace,
  onAddToItinerary,
  onToggleBookmark,
  onAddGeneratedPlaces,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [destinationSearch, setDestinationSearch] = useState<string>(
    initialDestination || (activeTrip ? activeTrip.region : '')
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFuel, setShowFuel] = useState<boolean>(true);
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showRouteLine, setShowRouteLine] = useState<boolean>(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [isGeneratingMapPlaces, setIsGeneratingMapPlaces] = useState(false);
  const [mapAiSuccess, setMapAiSuccess] = useState<string | null>(null);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCoords: [number, number] = [10.3275, 76.9550]; // Default center
    const map = L.map(mapContainerRef.current, {
      center: defaultCoords,
      zoom: 11,
      zoomControl: false,
    });

    // Clean, crisp OpenStreetMap tile layer (No API key required, 100% free and no watermarks)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control at top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Dedicated layer group for place markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Ensure map tiles calculate correct pixel sizes after container layout finishes
    const resizeTimer1 = setTimeout(() => map.invalidateSize(), 150);
    const resizeTimer2 = setTimeout(() => map.invalidateSize(), 400);

    // Container ResizeObserver for dynamic layout shifts (sidebar, modals, viewport)
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(resizeTimer1);
      clearTimeout(resizeTimer2);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter matching places based on search destination & category
  const qLower = destinationSearch.toLowerCase().trim();
  const searchKeywords = useMemo(() => {
    if (!qLower) return [];
    return qLower
      .split(/[\s,/-]+/)
      .map(w => w.trim())
      .filter(w => w.length > 2 && !['hidden', 'trails', 'trail', 'tour', 'trip', 'the', 'and', 'days', 'day', 'offbeat'].includes(w));
  }, [qLower]);

  const matchingPlaces = useMemo(() => {
    return places.filter(place => {
      const isFuel = place.category === 'fuel';
      const isHospital = place.category === 'hospital';

      if (isFuel && !showFuel) return false;
      if (isHospital && !showHospitals) return false;

      if (selectedCategory !== 'all' && !isFuel && !isHospital) {
        if (selectedCategory === 'waterfall' && place.category !== 'waterfall') return false;
        if (selectedCategory === 'nature' && !['nature_trail', 'scenic', 'nature'].includes(place.category)) return false;
        if (selectedCategory === 'viewpoint' && !['viewpoint', 'sunset', 'sunrise'].includes(place.category)) return false;
        if (selectedCategory === 'cafe' && !['cafe', 'dining', 'food'].includes(place.category)) return false;
        if (selectedCategory === 'temple' && !['temple', 'heritage', 'culture'].includes(place.category)) return false;
        if (selectedCategory === 'hidden' && !place.isOffbeat) return false;
      }

      if (!qLower) return true;

      const placeString = `${place.name} ${place.region} ${place.country || ''} ${place.continent || ''} ${place.description} ${place.tags.join(' ')}`.toLowerCase();

      // Check direct match or any search keyword (e.g. "Ooty" from "Ooty Hidden Trails")
      if (placeString.includes(qLower)) return true;
      if (searchKeywords.length > 0 && searchKeywords.some(kw => placeString.includes(kw))) return true;

      return false;
    });
  }, [places, qLower, searchKeywords, selectedCategory, showFuel, showHospitals]);

  // Update markers, polyline and view on places or filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    const routeCoords: [number, number][] = [];

    matchingPlaces.forEach((place) => {
      const isFuel = place.category === 'fuel';
      const isHospital = place.category === 'hospital';

      let markerBg = '#2563eb'; // blue
      let markerIcon = '📍';

      if (isFuel) {
        markerBg = '#f59e0b';
        markerIcon = '⛽';
      } else if (isHospital) {
        markerBg = '#ef4444';
        markerIcon = '🏥';
      } else if (place.category === 'waterfall') {
        markerBg = '#06b6d4';
        markerIcon = '🌊';
      } else if (place.category === 'cafe' || place.category === 'dining') {
        markerBg = '#8b5cf6';
        markerIcon = '☕';
      } else if (place.category === 'temple' || place.category === 'heritage') {
        markerBg = '#d97706';
        markerIcon = '⛩️';
      } else if (place.category === 'sunset' || place.category === 'viewpoint') {
        markerBg = '#ec4899';
        markerIcon = '🌄';
      }

      const isSelected = selectedPlace?.id === place.id;

      const customIcon = L.divIcon({
        className: 'custom-explorex-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            <div style="
              background-color: ${markerBg};
              width: ${isSelected ? '38px' : '32px'};
              height: ${isSelected ? '38px' : '32px'};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(0,0,0,0.3);
              border: ${isSelected ? '3px solid #fbbf24' : '2.5px solid white'};
              font-size: ${isSelected ? '16px' : '13px'};
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            ">
              ${markerIcon}
            </div>
            ${place.crowdLevel && place.crowdLevel <= 15 ? `
              <span style="
                position: absolute;
                top: -4px;
                right: -4px;
                background-color: #10b981;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 1.5px solid white;
              " title="Quiet / Low Crowds"></span>
            ` : ''}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker(place.coordinates, { icon: customIcon }).addTo(markersGroup);

      // Bind rich popup
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; min-width: 190px; padding: 2px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${place.name}</div>
          <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">${place.region}</div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: #2563eb; font-size: 11px;">
            <span>⭐ ${place.rating || 4.8}</span>
            <span style="color: ${place.crowdLevel <= 20 ? '#10b981' : '#f59e0b'};">👥 ${place.crowdLevel}% crowd</span>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedPlace(place);
      });

      if (!isFuel && !isHospital) {
        routeCoords.push(place.coordinates);
      }
    });

    // Check if route coordinates belong to a coherent cluster (within ~3 degrees lat/lng)
    const isLocalCluster = routeCoords.length > 1 && routeCoords.every(([lat, lng]) => {
      const [firstLat, firstLng] = routeCoords[0];
      return Math.abs(lat - firstLat) < 3.5 && Math.abs(lng - firstLng) < 3.5;
    });

    // Draw route line only for coherent local region/itinerary (avoid cross-ocean lines)
    if (showRouteLine && isLocalCluster && routeCoords.length > 1) {
      const poly = L.polyline(routeCoords, {
        color: '#2563eb',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.85,
      }).addTo(map);
      routePolylineRef.current = poly;
    }

    // Auto-fit map bounds or center intelligently
    if (routeCoords.length > 0) {
      if (routeCoords.length === 1) {
        map.setView(routeCoords[0], 12);
      } else if (isLocalCluster) {
        const bounds = L.latLngBounds(routeCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      } else {
        // Multi-region places: fit with wide padding or focus on first
        const bounds = L.latLngBounds(routeCoords);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
      }
    } else if (qLower) {
      // If no places matched current query, geocode destination
      const knownGeo = getGeoForDestination(qLower);
      if (knownGeo) {
        map.flyTo(knownGeo, 11, { duration: 1 });
      }
    }
  }, [matchingPlaces, showRouteLine, selectedPlace, qLower]);

  // Geocode search & pan map
  const handleSearchDestination = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const knownGeo = getGeoForDestination(q);
    const map = mapInstanceRef.current;
    if (knownGeo && map) {
      map.flyTo(knownGeo, 12, { duration: 1.2 });
      return;
    }

    // If not in known list, perform live Nominatim geocode
    setIsSearchingGeocode(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0 && map) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          map.flyTo([lat, lon], 12, { duration: 1.2 });
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const handleGenerateForMap = async () => {
    const query = destinationSearch.trim() || (activeTrip ? activeTrip.region : 'Kyoto');
    setIsGeneratingMapPlaces(true);
    setMapAiSuccess(null);

    try {
      const newPlaces = await generateWorldwidePlacesWithAi(query);
      if (newPlaces.length > 0 && onAddGeneratedPlaces) {
        onAddGeneratedPlaces(newPlaces);
        setMapAiSuccess(`✨ Added ${newPlaces.length} AI places for "${query}" onto the map!`);
        setTimeout(() => setMapAiSuccess(null), 5000);

        // Fly map to first new place
        if (mapInstanceRef.current && newPlaces[0]?.coordinates) {
          mapInstanceRef.current.flyTo(newPlaces[0].coordinates, 12, { duration: 1.5 });
        }
      }
    } catch {
      // Handled
    } finally {
      setIsGeneratingMapPlaces(false);
    }
  };

  const presetDestinations = [
    { label: 'All Destinations', query: '' },
    { label: 'Valparai, India', query: 'Valparai' },
    { label: 'Kyoto, Japan', query: 'Kyoto' },
    { label: 'Amalfi, Italy', query: 'Amalfi' },
    { label: 'Switzerland', query: 'Switzerland' },
    { label: 'Bali, Indonesia', query: 'Bali' },
    { label: 'Paris, France', query: 'Paris' },
    { label: 'Goa, India', query: 'Goa' },
    { label: 'Tokyo, Japan', query: 'Tokyo' },
  ];

  const categoryFilters = [
    { id: 'all', label: 'All Places' },
    { id: 'nature', label: '🌲 Nature & Trails' },
    { id: 'waterfall', label: '🌊 Waterfalls' },
    { id: 'viewpoint', label: '🌄 Viewpoints' },
    { id: 'cafe', label: '☕ Cafes & Dining' },
    { id: 'temple', label: '⛩️ Temples & Culture' },
    { id: 'hidden', label: '💎 Hidden Gems' },
  ];

  return (
    <div className="space-y-4 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Interactive Trail & Destination Map</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 font-medium">
            Discover verified place markers, offbeat trails, fuel stations, and emergency facilities with live GPS navigation.
          </p>
        </div>

        {/* Map Toggles */}
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-2xs">
          <button
            onClick={() => setShowFuel(!showFuel)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showFuel ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Fuel Stations</span>
          </button>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showHospitals ? 'bg-red-500 text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>Hospitals</span>
          </button>

          <button
            onClick={() => setShowRouteLine(!showRouteLine)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              showRouteLine ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Route Trail</span>
          </button>
        </div>
      </div>

      {/* Destination Map Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Destination Search Bar */}
          <div className="relative flex-1 w-full">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destination (e.g. Kyoto, Valparai, Amalfi, Paris, Tokyo, Switzerland, Goa)..."
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchDestination(destinationSearch);
                }
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs rounded-xl pl-10 pr-20 py-2.5 font-semibold focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {destinationSearch && (
                <button
                  onClick={() => {
                    setDestinationSearch('');
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([10.3275, 76.9550], 11);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => handleSearchDestination(destinationSearch)}
                disabled={isSearchingGeocode || !destinationSearch.trim()}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[11px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1"
                title="Search on Map"
              >
                {isSearchingGeocode ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                <span>Fly To</span>
              </button>
            </div>
          </div>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateForMap}
            disabled={isGeneratingMapPlaces}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs whitespace-nowrap cursor-pointer"
          >
            {isGeneratingMapPlaces ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating Map Places...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>AI Generate Places for Map</span>
              </>
            )}
          </button>
        </div>

        {mapAiSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{mapAiSuccess}</span>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 text-[11px]">Filter:</span>
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl font-bold shrink-0 transition cursor-pointer text-xs ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Preset Destination Quick Focus Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 text-[11px]">Quick Focus:</span>
          {presetDestinations.map((preset) => {
            const isActive = destinationSearch.toLowerCase() === preset.query.toLowerCase();
            return (
              <button
                key={preset.label}
                onClick={() => {
                  setDestinationSearch(preset.query);
                  handleSearchDestination(preset.query);
                }}
                className={`px-2.5 py-0.5 rounded-full font-bold shrink-0 transition cursor-pointer text-[11px] ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Main Canvas */}
      <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Top-Left Status Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-xs font-bold text-slate-800 dark:text-slate-200">
          <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>{matchingPlaces.length} Places Visible</span>
          {destinationSearch && (
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">in "{destinationSearch}"</span>
          )}
        </div>

        {/* Empty Places Quick Generate Callout */}
        {matchingPlaces.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center max-w-sm w-[90%] space-y-3 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">No Pins for this View</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {destinationSearch ? `No stored spots for "${destinationSearch}". Click below to generate them!` : 'Search for a destination or click generate with AI.'}
              </p>
            </div>
            <button
              onClick={handleGenerateForMap}
              disabled={isGeneratingMapPlaces}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              {isGeneratingMapPlaces ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>AI Generate Places for Destination</span>
            </button>
          </div>
        )}

        {/* Selected Place Overlay Card */}
        {selectedPlace && (
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl z-20 space-y-3 text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {selectedPlace.category.replace('_', ' ')}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1 leading-snug">{selectedPlace.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{selectedPlace.region}</p>
              </div>

              <button
                onClick={() => setSelectedPlace(null)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-pointer transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {selectedPlace.description}
            </p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-extrabold shrink-0 flex items-center gap-1">
                ⭐ {selectedPlace.rating || 4.8} &bull; {selectedPlace.crowdLevel}% Crowd
              </span>

              <div className="flex items-center gap-1.5">
                {/* Google Maps External Directions Link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.coordinates[0]},${selectedPlace.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition"
                  title="Open GPS in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </a>

                {onToggleBookmark && (
                  <button
                    onClick={() => onToggleBookmark(selectedPlace.id)}
                    className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                      selectedPlace.isBookmarked ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Bookmark Spot"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                )}

                {onAddToItinerary && (
                  <button
                    onClick={() => onAddToItinerary(selectedPlace)}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="Add to Active Itinerary"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>+ Plan</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectPlace(selectedPlace)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
