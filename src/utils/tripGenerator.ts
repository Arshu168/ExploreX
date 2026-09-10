import { Trip, ItineraryDay, Activity, PlaceCategory } from '../types';
import { getWeatherForDestinationDay } from './weatherUtils';
import { getDestinationHotels, getDestinationFlight, getRealDestinationItinerary } from './travelDataService';

interface GenerateTripOptions {
  destination: string;
  budget: number;
  durationDays: number;
  travelStyle: string;
  interests: string[];
  transportMode: string;
  originLocation?: string;
  startDate?: string;
}

const DESTINATION_IMAGES: Record<string, string> = {
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  germany: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80',
  munich: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=1200&q=80',
  berlin: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  amalfi: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  ooty: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  valparai: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  coimbatore: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  munnar: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  kodai: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
  pondicherry: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
};

function getCoverImageForDestination(dest: string): string {
  const dLower = dest.toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (dLower.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';
}

export function generateTripFromDetails(opts: GenerateTripOptions): Trip {
  const { destination, budget, durationDays, travelStyle, interests, transportMode, originLocation, startDate } = opts;
  const destName = destination.trim() || 'Coimbatore & Valparai';
  const duration = Math.max(1, Math.min(durationDays || 3, 10));
  const totalBudget = typeof budget === 'number' && !isNaN(budget) && budget >= 0 ? budget : 0;
  const origin = originLocation || 'India';
  const startD = startDate || new Date().toISOString().split('T')[0];

  const days = getRealDestinationItinerary(destName, duration, totalBudget);
  const totalSpent = days.reduce((acc, d) => acc + d.dayCost, 0);

  const parsedTransport = transportMode.toLowerCase().includes('car') 
    ? 'Car' 
    : transportMode.toLowerCase().includes('bus') || transportMode.toLowerCase().includes('train') 
    ? 'Bus/Train' 
    : 'Bike/Scooter';

  const parsedStyle = travelStyle.toLowerCase().includes('photo') 
    ? 'Photography Focus' 
    : travelStyle.toLowerCase().includes('nomad') || travelStyle.toLowerCase().includes('remote')
    ? 'Digital Nomad'
    : travelStyle.toLowerCase().includes('solo') || travelStyle.toLowerCase().includes('backpacker')
    ? 'Backpacker'
    : 'Balanced';

  const hotels = getDestinationHotels(destName, totalBudget);
  const flight = getDestinationFlight(origin, destName, totalBudget);

  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: `${destName} ${travelStyle || 'Offbeat'} Expedition`,
    description: `Custom ${duration}-day authentic trip to ${destName}. Budget: ₹${totalBudget.toLocaleString()}. Transport: ${transportMode}.`,
    region: destName,
    originLocation: origin,
    startDate: startD,
    endDate: new Date(new Date(startD).getTime() + duration * 86400000).toISOString().split('T')[0],
    durationDays: duration,
    budgetTotal: totalBudget,
    budgetSpent: totalSpent,
    currency: 'INR',
    transportMode: parsedTransport as Trip['transportMode'],
    groupSize: travelStyle === 'Solo' ? 1 : travelStyle === 'Family' ? 4 : 2,
    travelStyle: parsedStyle as Trip['travelStyle'],
    days,
    flightExpense: flight,
    recommendedHotels: hotels,
    isSaved: true,
    isFavorite: true,
    coverImage: getCoverImageForDestination(destName),
    createdAt: new Date().toISOString().split('T')[0]
  };
}
