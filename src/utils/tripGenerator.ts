import { Trip, ItineraryDay, Activity, PlaceCategory } from '../types';
import { getWeatherForDestinationDay } from './weatherUtils';

interface GenerateTripOptions {
  destination: string;
  budget: number;
  durationDays: number;
  travelStyle: string;
  interests: string[];
  transportMode: string;
}

const DESTINATION_IMAGES: Record<string, string> = {
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  amalfi: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
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
  const { destination, budget, durationDays, travelStyle, interests, transportMode } = opts;
  const destName = destination.trim() || 'Coimbatore & Valparai';
  const duration = Math.max(1, Math.min(durationDays || 3, 10));
  const totalBudget = typeof budget === 'number' && !isNaN(budget) && budget >= 0 ? budget : 0;

  const days: ItineraryDay[] = [];
  const primaryInterest = interests[0] || 'Scenic Views';
  const secondaryInterest = interests[1] || 'Local Food';

  for (let d = 1; d <= duration; d++) {
    const isDay1 = d === 1;
    const isLastDay = d === duration;

    const dayTitle = isDay1 
      ? `${destName} Arrival & ${primaryInterest} Exploration`
      : isLastDay 
      ? `${destName} Local Markets & Farewell Sunset`
      : `${destName} Offbeat ${secondaryInterest} Trail`;

    const dayBudgetPart = Math.round(totalBudget / duration);

    const activities: Activity[] = [
      {
        id: `act-${d}-1`,
        time: '07:30 AM',
        title: isDay1 ? `${destName} Early Morning Scenic Outlook` : `${destName} Hidden Nature & Sunrise Trail`,
        description: `Quiet morning visit with minimal tourist traffic and prime morning light.`,
        category: 'viewpoint' as PlaceCategory,
        cost: Math.round(dayBudgetPart * 0.1),
        durationMinutes: 90,
        isHiddenGem: true,
        locationName: `${destName} Outskirts`
      },
      {
        id: `act-${d}-2`,
        time: '10:30 AM',
        title: isDay1 ? `Artisanal Coffee & Local Heritage Kitchen` : `${destName} ${primaryInterest} Experience`,
        description: `Immersive local activity experiencing regional traditions and authentic flavor.`,
        category: 'cafe' as PlaceCategory,
        cost: Math.round(dayBudgetPart * 0.15),
        durationMinutes: 75,
        isHiddenGem: true,
        locationName: `${destName} Heritage Hub`
      },
      {
        id: `act-${d}-3`,
        time: '01:00 PM',
        title: 'Authentic Homestyle Regional Feast',
        description: 'Freshly prepared organic multi-course local lunch served in scenic surroundings.',
        category: 'meal',
        cost: Math.round(dayBudgetPart * 0.2),
        durationMinutes: 60,
        isHiddenGem: false,
        locationName: `${destName} Central`
      },
      {
        id: `act-${d}-4`,
        time: '04:30 PM',
        title: `${destName} Sunset Overlook & Hammock Rest`,
        description: 'Unwind at a picturesque vantage point with panoramic golden-hour views.',
        category: 'sunset' as PlaceCategory,
        cost: Math.round(dayBudgetPart * 0.05),
        durationMinutes: 105,
        isHiddenGem: true,
        locationName: `${destName} Ridge`
      }
    ];

    const dayCost = activities.reduce((acc, a) => acc + a.cost, 0);

    days.push({
      dayNumber: d,
      title: dayTitle,
      dayCost,
      travelTimeMinutes: 40 + d * 10,
      distanceKm: 25 + d * 8,
      dayHighlights: [primaryInterest, secondaryInterest, 'Sunset Vista'],
      weather: getWeatherForDestinationDay(destName, d),
      activities
    });
  }

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

  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: `${destName} ${travelStyle || 'Offbeat'} Expedition`,
    description: `Custom ${duration}-day offbeat trip to ${destName}. Budget: ₹${totalBudget.toLocaleString()}. Transport: ${transportMode}.`,
    region: destName,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0],
    durationDays: duration,
    budgetTotal: totalBudget,
    budgetSpent: totalSpent,
    currency: 'INR',
    transportMode: parsedTransport as Trip['transportMode'],
    groupSize: travelStyle === 'Solo' ? 1 : travelStyle === 'Family' ? 4 : 2,
    travelStyle: parsedStyle as Trip['travelStyle'],
    days,
    isSaved: true,
    isFavorite: true,
    coverImage: getCoverImageForDestination(destName),
    createdAt: new Date().toISOString().split('T')[0]
  };
}
