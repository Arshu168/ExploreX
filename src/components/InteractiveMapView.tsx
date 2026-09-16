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
  Check, 
  MapPin, 
  Plane, 
  LocateFixed, 
  ArrowRight, 
  Route, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Plus,
  Compass,
  AlertCircle
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, Trip, PlaceCategory } from '../types';
import { 
  getLocationCoordinates, 
  getNearestAirport, 
  calculateDistanceKm, 
  getNearestDistrictFromCoords, 
  DISTRICT_COORDINATES 
} from '../utils/travelDataService';

interface InteractiveMapViewProps {
  places: Place[];
  activeTrip?: Trip | null;
  trips?: Trip[];
  onSelectTrip?: (trip: Trip) => void;
  initialDestination?: string;
  onSelectPlace: (place: Place) => void;
  onAddToItinerary?: (place: Place) => void;
  onToggleBookmark?: (placeId: string) => void;
  onAddGeneratedPlaces?: (newPlaces: Place[]) => void;
  onOpenNewTrip?: () => void;
}

interface TripPlaceItem extends Place {
  dayNumber?: number;
  time?: string;
  isTripActivity?: boolean;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  places,
  activeTrip,
  trips = [],
  onSelectTrip,
  onSelectPlace,
  onAddToItinerary,
  onToggleBookmark,
  onOpenNewTrip,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Check if there is an active trip with valid days
  const hasActiveTrip = Boolean(activeTrip && activeTrip.days && activeTrip.days.length > 0);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');

  // Origin / Starting Location State (Point X)
  const [originLocation, setOriginLocation] = useState<string>(
    activeTrip?.originLocation || 'Coimbatore'
  );
  const [originCoords, setOriginCoords] = useState<[number, number]>(() => {
    return getLocationCoordinates(activeTrip?.originLocation || 'Coimbatore');
  });
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string | null>(null);

  // Map Toggles
  const [showFuel, setShowFuel] = useState<boolean>(false);
  const [showHospitals, setShowHospitals] = useState<boolean>(false);
  const [showRouteLine, setShowRouteLine] = useState<boolean>(true);
  const [showWaypointsList, setShowWaypointsList] = useState<boolean>(true);
  const [selectedPlace, setSelectedPlace] = useState<TripPlaceItem | null>(null);

  // Synchronize when activeTrip prop updates
  useEffect(() => {
    if (activeTrip) {
      if (activeTrip.originLocation) {
        setOriginLocation(activeTrip.originLocation);
        setOriginCoords(getLocationCoordinates(activeTrip.originLocation));
      }
      setSelectedDayFilter('all');
      setSelectedPlace(null);
    }
  }, [activeTrip?.id]);

  // Extract ALL places and activities of the active trip
  const tripActivitiesAsPlaces: TripPlaceItem[] = useMemo(() => {
    if (!hasActiveTrip || !activeTrip?.days) return [];

    const extracted: TripPlaceItem[] = [];
    const baseCoords = getLocationCoordinates(activeTrip.region || activeTrip.title || 'Coimbatore');

    activeTrip.days.forEach((day) => {
      day.activities.forEach((act, actIdx) => {
        const existingMatch = places.find(p => 
          (act.placeId && p.id === act.placeId) || 
          p.name.toLowerCase() === act.title.toLowerCase() ||
          (act.locationName && p.name.toLowerCase().includes(act.locationName.toLowerCase()))
        );

        let coords: [number, number];
        if (existingMatch) {
          coords = existingMatch.coordinates;
        } else if (act.locationName && DISTRICT_COORDINATES[act.locationName.toLowerCase()]) {
          coords = DISTRICT_COORDINATES[act.locationName.toLowerCase()];
        } else {
          // Compute realistic geographic distribution around destination
          const offsetAngle = (day.dayNumber * 1.6 + actIdx * 1.3);
          const radius = 0.015 + (actIdx * 0.008) + (day.dayNumber * 0.010);
          const lat = baseCoords[0] + Math.sin(offsetAngle) * radius;
          const lng = baseCoords[1] + Math.cos(offsetAngle) * radius;
          coords = [lat, lng];
        }

        const validCategories: PlaceCategory[] = [
          'waterfall', 'viewpoint', 'village', 'tea_estate', 'nature_trail',
          'forest_route', 'sunset', 'cafe', 'coworking', 'fuel', 'hospital'
        ];

        let mappedCat: PlaceCategory = 'nature_trail';
        if (validCategories.includes(act.category as PlaceCategory)) {
          mappedCat = act.category as PlaceCategory;
        } else if (act.category === 'meal') {
          mappedCat = 'cafe';
        } else if (act.category === 'travel') {
          mappedCat = 'forest_route';
        }

        extracted.push({
          id: act.id,
          name: act.title,
          category: mappedCat,
          description: act.description,
          region: act.locationName || activeTrip.region || 'Trip Spot',
          coordinates: coords,
          crowdLevel: act.isHiddenGem ? 12 : 35,
          difficulty: 'Easy',
          bestTime: act.time || 'Morning',
          estimatedCost: act.cost,
          rating: 4.9,
          imageUrl: existingMatch?.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
          tags: [activeTrip.region, `Day ${day.dayNumber}`, act.time, act.isHiddenGem ? 'Hidden Gem' : 'Top Spot'],
          localTips: [`Day ${day.dayNumber} activity at ${act.time}`],
          ragSources: [],
          dayNumber: day.dayNumber,
          time: act.time,
          isTripActivity: true
        });
      });
    });

    return extracted;
  }, [hasActiveTrip, activeTrip, places]);

  // Airport matched to the starting point X
  const originAirport = useMemo(() => {
    return getNearestAirport(originLocation);
  }, [originLocation]);

  // Handle GPS location detection
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatusMsg('❌ Geolocation is not supported by your browser.');
      setTimeout(() => setGpsStatusMsg(null), 4000);
      return;
    }

    setIsDetectingGps(true);
    setGpsStatusMsg('📡 Detecting your precise GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const detectedDistrict = getNearestDistrictFromCoords(lat, lng);

        setOriginCoords([lat, lng]);
        setOriginLocation(detectedDistrict);
        setIsDetectingGps(false);
        setGpsStatusMsg(`🎯 GPS Location detected: ${detectedDistrict} (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        setTimeout(() => setGpsStatusMsg(null), 5000);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 12, { duration: 1.2 });
        }
      },
      (error) => {
        setIsDetectingGps(false);
        setGpsStatusMsg(`⚠️ GPS access unavailable: ${error.message}. Using ${originLocation}.`);
        setTimeout(() => setGpsStatusMsg(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectOriginPreset = (districtName: string) => {
    setOriginLocation(districtName);
    const coords = getLocationCoordinates(districtName);
    setOriginCoords(coords);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 12, { duration: 1.2 });
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCoords: [number, number] = originCoords || [10.3275, 76.9550];
    const map = L.map(mapContainerRef.current, {
      center: defaultCoords,
      zoom: 10,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    const resizeTimer1 = setTimeout(() => map.invalidateSize(), 150);
    const resizeTimer2 = setTimeout(() => map.invalidateSize(), 400);

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

  // Compute matching places strictly for the active trip (or empty if no trips)
  const matchingPlaces = useMemo(() => {
    // When no active trip exists, show nothing
    if (!hasActiveTrip || tripActivitiesAsPlaces.length === 0) {
      return [];
    }

    // Display strictly the places belonging to this particular trip
    return tripActivitiesAsPlaces.filter(p => {
      if (selectedDayFilter !== 'all' && p.dayNumber !== selectedDayFilter) return false;
      return true;
    });
  }, [hasActiveTrip, tripActivitiesAsPlaces, selectedDayFilter]);

  // Sequential waypoint list from Origin (X) to Y1, Y2, Y3... for this particular trip
  const routeWaypoints = useMemo(() => {
    if (!hasActiveTrip || matchingPlaces.length === 0) {
      return [];
    }

    const waypoints: Array<{
      code: string;
      label: string;
      name: string;
      coordinates: [number, number];
      legDistanceKm: number;
      category?: string;
      place?: TripPlaceItem;
      dayNumber?: number;
      time?: string;
    }> = [];

    // Origin (Point X)
    waypoints.push({
      code: 'X',
      label: 'START (X)',
      name: originLocation,
      coordinates: originCoords,
      legDistanceKm: 0,
      category: 'start_origin'
    });

    let prevCoord = originCoords;
    const validPlaces = matchingPlaces.filter(p => p.category !== 'fuel' && p.category !== 'hospital');

    validPlaces.forEach((place, idx) => {
      const legDist = calculateDistanceKm(prevCoord, place.coordinates);
      prevCoord = place.coordinates;

      const stopLabel = place.dayNumber 
        ? `Day ${place.dayNumber} • Stop Y${idx + 1}`
        : `Stop Y${idx + 1}`;

      waypoints.push({
        code: `Y${idx + 1}`,
        label: stopLabel,
        name: place.name,
        coordinates: place.coordinates,
        legDistanceKm: legDist,
        category: place.category,
        place,
        dayNumber: place.dayNumber,
        time: place.time
      });
    });

    return waypoints;
  }, [hasActiveTrip, originLocation, originCoords, matchingPlaces]);

  const totalTripDistanceKm = useMemo(() => {
    return routeWaypoints.reduce((acc, wp) => acc + wp.legDistanceKm, 0);
  }, [routeWaypoints]);

  // Update Leaflet markers, polyline and view on places, origin, or filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    // When no active trip or 0 places, do not plot any markers or routes
    if (!hasActiveTrip || matchingPlaces.length === 0) {
      return;
    }

    const routeCoords: [number, number][] = [originCoords];

    // 1. RENDER STARTING POINT (ORIGIN - X) MARKER
    const startIcon = L.divIcon({
      className: 'custom-start-origin-marker',
      html: `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        ">
          <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            font-size: 10px;
            font-weight: 900;
            padding: 2px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            border: 2px solid white;
            white-space: nowrap;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
          ">
            START (X)
          </div>
          <div style="
            background: #10b981;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 18px rgba(16, 185, 129, 0.5);
            border: 3px solid white;
            font-size: 18px;
          ">
            🚀
          </div>
        </div>
      `,
      iconSize: [80, 60],
      iconAnchor: [40, 50],
      popupAnchor: [0, -50]
    });

    const startMarker = L.marker(originCoords, { icon: startIcon }).addTo(markersGroup);
    const startPopupContent = `
      <div style="font-family: inherit; font-size: 12px; min-width: 220px; padding: 4px;">
        <div style="display: inline-block; background: #d1fae5; color: #065f46; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
          STARTING POINT (X)
        </div>
        <div style="font-weight: 900; font-size: 14px; color: #0f172a; margin-bottom: 3px;">
          📍 ${originLocation}
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px; margin-top: 4px;">
          <div style="font-weight: 700; color: #2563eb; font-size: 11px;">✈️ Nearest Airport: ${originAirport.name} (${originAirport.code})</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 2px;">${originAirport.distanceKm} km to terminal &bull; ${originAirport.terminalAdvice}</div>
        </div>
      </div>
    `;
    startMarker.bindPopup(startPopupContent);

    // 2. RENDER ALL DESTINATION PLACES (Y1, Y2, Y3...)
    let placeIndex = 1;
    matchingPlaces.forEach((place) => {
      const isFuel = place.category === 'fuel';
      const isHospital = place.category === 'hospital';

      if (isFuel && !showFuel) return;
      if (isHospital && !showHospitals) return;

      let markerBg = '#2563eb';
      let markerIcon = '📍';
      let sequentialBadge = '';

      if (isFuel) {
        markerBg = '#f59e0b';
        markerIcon = '⛽';
      } else if (isHospital) {
        markerBg = '#ef4444';
        markerIcon = '🏥';
      } else {
        sequentialBadge = place.dayNumber ? `D${place.dayNumber} • Y${placeIndex}` : `Y${placeIndex}`;
        placeIndex++;

        if (place.category === 'waterfall') {
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
      }

      const isSelected = selectedPlace?.id === place.id;

      const customIcon = L.divIcon({
        className: 'custom-explorex-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          ">
            ${sequentialBadge ? `
              <div style="
                background-color: ${isSelected ? '#fbbf24' : '#0f172a'};
                color: ${isSelected ? '#0f172a' : '#ffffff'};
                font-size: 10px;
                font-weight: 900;
                padding: 2px 7px;
                border-radius: 9999px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                border: 1.5px solid white;
                margin-bottom: 2px;
                white-space: nowrap;
              ">
                ${sequentialBadge}
              </div>
            ` : ''}
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
                bottom: 0px;
                right: 0px;
                background-color: #10b981;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                border: 1.5px solid white;
              " title="Quiet / Low Crowds"></span>
            ` : ''}
          </div>
        `,
        iconSize: [60, 52],
        iconAnchor: [30, 44],
        popupAnchor: [0, -44]
      });

      const marker = L.marker(place.coordinates, { icon: customIcon }).addTo(markersGroup);

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; min-width: 210px; padding: 2px;">
          ${sequentialBadge ? `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: #e0e7ff; color: #3730a3; font-weight: 800; font-size: 10px; padding: 1px 6px; border-radius: 4px;">
                ${sequentialBadge}
              </span>
              ${place.time ? `<span style="color: #64748b; font-size: 10px; font-weight: 700;">🕒 ${place.time}</span>` : ''}
            </div>
          ` : ''}
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

    // Check if route coordinates belong to a coherent cluster
    const isLocalCluster = routeCoords.length > 1 && routeCoords.every(([lat, lng]) => {
      const [firstLat, firstLng] = routeCoords[0];
      return Math.abs(lat - firstLat) < 5.0 && Math.abs(lng - firstLng) < 5.0;
    });

    // Draw route line connecting START (X) ➔ Y1 ➔ Y2 ➔ Y3 ➔ Y4...
    if (showRouteLine && isLocalCluster && routeCoords.length > 1) {
      const poly = L.polyline(routeCoords, {
        color: '#2563eb',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.85,
      }).addTo(map);
      routePolylineRef.current = poly;
    }

    // Auto-fit map bounds
    if (routeCoords.length > 0) {
      if (routeCoords.length === 1) {
        map.setView(routeCoords[0], 12);
      } else if (isLocalCluster) {
        const bounds = L.latLngBounds(routeCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      } else {
        const bounds = L.latLngBounds(routeCoords);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
      }
    }
  }, [matchingPlaces, originCoords, originLocation, originAirport, showRouteLine, showFuel, showHospitals, selectedPlace, hasActiveTrip]);

  const originDistrictPresets = [
    'Coimbatore',
    'Madurai',
    'Chennai',
    'Trichy',
    'Salem',
    'Tirunelveli',
    'Ooty',
    'Bangalore',
    'Kochi',
    'Mumbai',
    'Delhi'
  ];

  const uniqueTripDays = useMemo(() => {
    if (!tripActivitiesAsPlaces.length) return [];
    const setDays = new Set(tripActivitiesAsPlaces.map(p => p.dayNumber).filter(Boolean));
    return Array.from(setDays).sort((a, b) => (a as number) - (b as number)) as number[];
  }, [tripActivitiesAsPlaces]);

  return (
    <div className="space-y-5 pb-12 font-sans max-w-6xl mx-auto">
      {/* 1. Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MapIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Interactive Trip & Waypoint Map</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">
                {hasActiveTrip
                  ? `Showing places and route for "${activeTrip?.title || activeTrip?.region}" (Origin X ➔ Waypoints Y1, Y2...)`
                  : 'Map reflects destinations for active trips only. When trips are 0, no pins are displayed.'}
              </p>
            </div>
          </div>
        </div>

        {/* Map Toggles (Active Trip Only) */}
        {hasActiveTrip && (
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
              <span>Route (X ➔ Y)</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. IF 0 TRIPS -> SHOW CLEAN EMPTY STATE BANNER */}
      {!hasActiveTrip ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-xs space-y-4 max-w-2xl mx-auto my-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">No Trips Planned Yet</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              When your trip count is zero, the map remains clean with no pins. As soon as you add or generate a trip, all its specific spots, itinerary stops, and route will show here.
            </p>
          </div>
          {onOpenNewTrip && (
            <div className="pt-2">
              <button
                onClick={onOpenNewTrip}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create a Trip with AI Planner</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 3. MULTI-TRIP SELECTOR (IF MULTIPLE TRIPS EXIST) */}
          {trips.length > 1 && onSelectTrip && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-700 dark:text-slate-300">Select Trip to View on Map:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto">
                {trips.map(t => {
                  const isSelected = t.id === activeTrip?.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onSelectTrip(t)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      🗺️ {t.title || t.region}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. PRIMARY ORIGIN / STARTING LOCATION BAR (POINT X) */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/80 rounded-3xl p-4.5 text-white shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <LocateFixed className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                      Start Pointer (X)
                    </span>
                    <h3 className="font-black text-sm text-white">Where are you starting your trip from?</h3>
                  </div>
                  <p className="text-xs text-emerald-200 font-medium mt-0.5">
                    Sets departure point (X) for driving directions & nearest airport calculation to {activeTrip?.title || activeTrip?.region}
                  </p>
                </div>
              </div>

              {/* GPS Auto-Detect Button */}
              <button
                onClick={handleDetectCurrentLocation}
                disabled={isDetectingGps}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                <span>{isDetectingGps ? 'Detecting...' : 'Use My GPS Location'}</span>
              </button>
            </div>

            {/* Origin Input & Nearest Airport Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 relative">
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={originLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOriginLocation(val);
                    if (val.trim()) {
                      setOriginCoords(getLocationCoordinates(val));
                    }
                  }}
                  placeholder="Enter departure city (e.g. Coimbatore, Madurai, Chennai, Bangalore)..."
                  className="w-full bg-slate-900/90 border border-emerald-800/60 focus:border-emerald-400 text-white placeholder-slate-400 text-xs font-bold rounded-xl pl-9 pr-3 py-2.5 focus:outline-none"
                />
              </div>

              <div className="md:col-span-7 bg-slate-900/80 border border-emerald-900/60 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Plane className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-emerald-300 font-extrabold uppercase">Nearest Departure Airport: </span>
                    <span className="font-extrabold text-white">{originAirport.name} ({originAirport.code})</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({originAirport.distanceKm} km away)</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">
                  {originAirport.code}
                </span>
              </div>
            </div>

            {/* Quick Origin District Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-emerald-900/40">
              <span className="font-bold text-emerald-400 text-[11px] shrink-0">Quick Start Points:</span>
              {originDistrictPresets.map((dist) => {
                const isSelected = originLocation.toLowerCase() === dist.toLowerCase();
                return (
                  <button
                    key={dist}
                    onClick={() => handleSelectOriginPreset(dist)}
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] shrink-0 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950 shadow-xs'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    📍 {dist}
                  </button>
                );
              })}
            </div>

            {gpsStatusMsg && (
              <div className="p-2 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span>{gpsStatusMsg}</span>
              </div>
            )}
          </div>

          {/* 5. ACTIVE TRIP SUMMARY & DAY FILTER */}
          <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-3xl p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Route className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    {activeTrip?.title || activeTrip?.region}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {tripActivitiesAsPlaces.length} planned places strictly plotted for this trip
                  </p>
                </div>
              </div>

              {/* Day Filter Pills */}
              {uniqueTripDays.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 text-[11px]">Filter Day:</span>
                  <button
                    onClick={() => setSelectedDayFilter('all')}
                    className={`px-3 py-1 rounded-xl font-bold shrink-0 transition cursor-pointer text-xs ${
                      selectedDayFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    All Days ({tripActivitiesAsPlaces.length})
                  </button>
                  {uniqueTripDays.map((dNum) => {
                    const count = tripActivitiesAsPlaces.filter(p => p.dayNumber === dNum).length;
                    return (
                      <button
                        key={dNum}
                        onClick={() => setSelectedDayFilter(dNum)}
                        className={`px-3 py-1 rounded-xl font-bold shrink-0 transition cursor-pointer text-xs ${
                          selectedDayFilter === dNum
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Day {dNum} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 6. MAP CANVAS */}
      <div className="relative w-full h-[460px] sm:h-[560px] lg:h-[620px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Top-Left Status Badge */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Origin (X): {originLocation}</span>
          </span>
          <span className="text-slate-400">&bull;</span>
          <span>
            {hasActiveTrip ? `Trip Stops (${matchingPlaces.length} Places)` : '0 Trips / 0 Pins'}
          </span>
        </div>

        {/* Selected Place Overlay Card */}
        {selectedPlace && (
          <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl z-20 space-y-3 text-slate-900 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedPlace.dayNumber && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-600 text-white">
                      Day {selectedPlace.dayNumber} {selectedPlace.time ? `• ${selectedPlace.time}` : ''}
                    </span>
                  )}
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {selectedPlace.category.replace('_', ' ')}
                  </span>
                </div>
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
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${originCoords[0]},${originCoords[1]}&destination=${selectedPlace.coordinates[0]},${selectedPlace.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition"
                  title="Navigate from Starting Point (X) to this Spot"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                    title="Add to Itinerary"
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

      {/* 7. SEQUENTIAL WAYPOINT ROUTE CARD (X ➔ Y1 ➔ Y2 ➔ Y3...) (ACTIVE TRIP ONLY) */}
      {hasActiveTrip && routeWaypoints.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Route className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Trip Route Sequence: {activeTrip?.title || activeTrip?.region} (X ➔ Waypoints)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Sequential itinerary places starting from <strong className="text-emerald-600 dark:text-emerald-400">{originLocation} (X)</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs">
                Total Route: ~{totalTripDistanceKm} km
              </span>
              <button
                onClick={() => setShowWaypointsList(!showWaypointsList)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                {showWaypointsList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showWaypointsList && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {routeWaypoints.map((wp, i) => {
                  const isStart = wp.code === 'X';
                  return (
                    <div
                      key={wp.code + '-' + i}
                      onClick={() => {
                        if (wp.place) {
                          setSelectedPlace(wp.place);
                        }
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo(wp.coordinates, 13, { duration: 1.2 });
                        }
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                        isStart
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                          : selectedPlace?.id === wp.place?.id
                          ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs'
                          : 'bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isStart
                            ? 'bg-emerald-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {wp.label}
                        </span>
                        {wp.time && (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            🕒 {wp.time}
                          </span>
                        )}
                        {!isStart && wp.legDistanceKm > 0 && !wp.time && (
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            +{wp.legDistanceKm} km leg
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {isStart ? `📍 Origin: ${wp.name}` : wp.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>{wp.category ? wp.category.replace('_', ' ') : 'Hub'}</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                          View Pin <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Google Maps Multi-Stop Navigation Action */}
              {routeWaypoints.length > 1 && (
                <div className="pt-2 flex items-center justify-end">
                  <a
                    href={`https://www.google.com/maps/dir/${originCoords[0]},${originCoords[1]}/${routeWaypoints.slice(1, 4).map(w => `${w.coordinates[0]},${w.coordinates[1]}`).join('/')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold rounded-xl transition flex items-center gap-2 shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    <span>Open Multi-Stop Route in Google Maps</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
