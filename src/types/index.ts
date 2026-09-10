export type PlaceCategory = 
  | 'waterfall' 
  | 'viewpoint' 
  | 'village' 
  | 'tea_estate' 
  | 'nature_trail' 
  | 'forest_route' 
  | 'sunset' 
  | 'cafe' 
  | 'coworking' 
  | 'fuel' 
  | 'hospital';

export interface RagSource {
  title: string;
  url: string;
  snippet: string;
  sourceType: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  description: string;
  region: string;
  continent?: string;
  country?: string;
  coordinates: [number, number]; // [lat, lng]
  crowdLevel: number; // 0 to 100%
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  bestTime: string;
  estimatedCost: number;
  rating: number;
  imageUrl: string;
  tags: string[];
  localTips: string[];
  ragSources: RagSource[];
  isBookmarked?: boolean;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  placeId?: string;
  category: PlaceCategory | 'travel' | 'meal' | 'stay' | 'rest';
  cost: number;
  durationMinutes: number;
  isHiddenGem: boolean;
  locationName?: string;
}

export interface WeatherForecast {
  condition: 'Sunny' | 'Partly Cloudy' | 'Pleasant Mist' | 'Light Showers' | 'Clear Sky' | 'Thunderstorms' | 'Foggy Morning';
  tempMaxC: number;
  tempMinC: number;
  rainProbabilityPercent: number;
  humidityPercent: number;
  windSpeedKmh: number;
  uvIndex: 'Low' | 'Moderate' | 'High' | 'Very High';
  advice: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  dateStr?: string;
  activities: Activity[];
  dayCost: number;
  travelTimeMinutes: number;
  distanceKm: number;
  dayHighlights: string[];
  weather?: WeatherForecast;
}

export interface HotelOption {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  address: string;
  contactNumber: string;
  imageUrl: string;
  amenities: string[];
  distanceFromCenter?: string;
}

export interface FlightExpenseDetails {
  origin: string;
  destination: string;
  estimatedFlightCost: number;
  airlineSuggestions: string[];
  flightDurationHours: number;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  region: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  budgetTotal: number;
  budgetSpent: number;
  currency: string;
  transportMode: 'Bike/Scooter' | 'Car' | 'Bus/Train' | 'Walking' | 'Flight' | 'Flight & Car';
  groupSize: number;
  travelStyle: 'Backpacker' | 'Balanced' | 'Comfort' | 'Photography Focus' | 'Digital Nomad';
  days: ItineraryDay[];
  isSaved: boolean;
  isFavorite: boolean;
  teamId?: string;
  coverImage: string;
  createdAt: string;
  originLocation?: string;
  flightExpense?: FlightExpenseDetails;
  recommendedHotels?: HotelOption[];
}

export interface Expense {
  id: string;
  tripId: string;
  category: 'fuel' | 'food' | 'stay' | 'activity' | 'emergency' | 'other';
  title: string;
  amount: number;
  paidBy: string;
  date: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Organizer' | 'Traveler' | 'Editor';
  status: 'Active' | 'Pending';
}

export interface Task {
  id: string;
  teamId: string;
  title: string;
  assigneeName?: string;
  dueDate: string;
  isCompleted: boolean;
  category: 'Gear' | 'Booking' | 'Route' | 'Food' | 'General';
}

export interface DestinationVote {
  placeId: string;
  upvotes: string[]; // member names/ids
  downvotes: string[];
}

export interface TeamWorkspace {
  id: string;
  name: string;
  code: string;
  members: TeamMember[];
  tasks: Task[];
  votes: DestinationVote[];
  sharedTripId?: string;
  budgetCap: number;
}

export interface Memory {
  id: string;
  tripId: string;
  tripTitle: string;
  date: string;
  blogPost: string;
  socialCaptions: {
    platform: 'Instagram' | 'X' | 'LinkedIn' | 'Facebook';
    text: string;
    hashtags: string[];
  }[];
  diaryEntry: string;
  highlightPhoto: string;
  photos?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  ragSources?: RagSource[];
  suggestedPlaces?: Place[];
  isStreaming?: boolean;
}

export interface RagDocument {
  id: string;
  title: string;
  source: string;
  category: string;
  excerpt: string;
  url: string;
  credibilityRating: number;
  content: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  homeCity: string;
  preferredCurrency: string;
  defaultPace: 'Relaxed' | 'Balanced' | 'Fast';
  defaultTransport: 'Bike/Scooter' | 'Car' | 'Bus/Train' | 'Walking';
  interests: string[];
  isNewUser?: boolean;
  role?: 'admin' | 'user';
}
