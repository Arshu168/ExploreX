import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Wallet, 
  Users, 
  Share2, 
  Edit3, 
  Plus, 
  Bookmark, 
  CheckCircle, 
  Lightbulb,
  Clock,
  Send,
  ArrowRight,
  Map as MapIcon,
  Check,
  X,
  Download,
  RotateCcw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Compass,
  DollarSign,
  Sun,
  CloudSun,
  CloudRain,
  CloudFog,
  Droplets,
  Wind,
  Thermometer,
  CloudDrizzle
} from 'lucide-react';
import { Trip, Place, ItineraryDay, Activity } from '../types';
import { getWeatherForDestinationDay, getWeatherTheme } from '../utils/weatherUtils';
import { formatCurrency } from '../utils/currencyUtils';

interface AiPlannerViewProps {
  activeTrip?: Trip;
  onSaveTrip: (newTrip: Trip) => void;
  onOpenMap: () => void;
  onShareToTeam: (trip: Trip) => void;
  onOpenNewTrip?: () => void;
  availablePlaces: Place[];
  preferredCurrency?: string;
}

export const AiPlannerView: React.FC<AiPlannerViewProps> = ({
  activeTrip,
  onSaveTrip,
  onOpenMap,
  onShareToTeam,
  onOpenNewTrip,
  availablePlaces,
  preferredCurrency = 'INR',
}) => {
  const [tripSummary, setTripSummary] = useState({
    title: activeTrip ? activeTrip.title : 'Custom Offbeat Itinerary',
    destination: activeTrip ? activeTrip.region : 'Coimbatore & Valparai',
    region: activeTrip ? activeTrip.region : 'Tamil Nadu, India',
    durationDays: activeTrip ? activeTrip.durationDays : 3,
    dates: 'Upcoming Weekend',
    groupSize: activeTrip ? activeTrip.groupSize : 2,
    travelerType: activeTrip ? `${activeTrip.groupSize} Travelers • ${activeTrip.travelStyle}` : '2 Travelers • Offbeat Explorer',
    budgetTotal: activeTrip ? (activeTrip.budgetTotal || 0) : 0,
  });

  const [showEditSummaryModal, setShowEditSummaryModal] = useState(false);
  const [showAddSpotModal, setShowAddSpotModal] = useState(false);
  const [savedStatusMsg, setSavedStatusMsg] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [chatPrompt, setChatPrompt] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Synchronize state when activeTrip prop changes
  useEffect(() => {
    if (activeTrip) {
      setTripSummary({
        title: activeTrip.title,
        destination: activeTrip.region || activeTrip.title,
        region: activeTrip.region || 'India',
        durationDays: activeTrip.durationDays,
        dates: `${activeTrip.startDate || 'Upcoming'} to ${activeTrip.endDate || 'Weekend'}`,
        groupSize: activeTrip.groupSize || 2,
        travelerType: `${activeTrip.groupSize || 2} Travelers • ${activeTrip.travelStyle || 'Explorer'}`,
        budgetTotal: activeTrip.budgetTotal || 0,
      });
      if (activeTrip.days && activeTrip.days.length > 0) {
        setGeneratedDays(activeTrip.days);
      }
    }
  }, [activeTrip]);

  // Pre-populated or generated Itinerary Days state
  const [generatedDays, setGeneratedDays] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      title: 'Monkey Falls Trail & Aliyar Dam Sunset',
      dayCost: 1200,
      travelTimeMinutes: 65,
      distanceKm: 42,
      dayHighlights: ['Secluded Waterfalls', 'Dam Overlook', 'Hidden Cafe'],
      weather: {
        condition: 'Pleasant Mist',
        tempMaxC: 23,
        tempMinC: 15,
        rainProbabilityPercent: 20,
        humidityPercent: 80,
        windSpeedKmh: 12,
        uvIndex: 'Low',
        advice: 'Early morning mountain mist till 9 AM. Crisp weather ideal for waterfall hikes.'
      },
      activities: [
        {
          id: 'act-1-1',
          time: '06:30 AM',
          title: 'Sunrise Ride to Monkey Falls Hidden Trail',
          description: 'Early morning bike trail through thick forest canopy avoiding main crowds.',
          category: 'waterfall',
          cost: 50,
          durationMinutes: 120,
          isHiddenGem: true,
          locationName: 'Monkey Falls Secret Pass'
        },
        {
          id: 'act-1-2',
          time: '09:30 AM',
          title: 'Breakfast at The Heritage Tea Stall',
          description: 'Fresh hot filter coffee, steamed idlis, and homemade tea cake.',
          category: 'meal',
          cost: 150,
          durationMinutes: 45,
          isHiddenGem: true,
          locationName: 'Aliyar Foothills'
        },
        {
          id: 'act-1-3',
          time: '12:30 PM',
          title: 'Aliyar Dam Viewpoint & Lake Walk',
          description: 'Serene lakeside promenade with stunning Anamalai mountain reflection.',
          category: 'viewpoint',
          cost: 100,
          durationMinutes: 90,
          isHiddenGem: false,
          locationName: 'Aliyar Reservoir'
        },
        {
          id: 'act-1-4',
          time: '04:30 PM',
          title: 'Hidden Orchard Cafe & Local Refreshments',
          description: 'Artisanal organic jackfruit smoothies and outdoor hammock rest.',
          category: 'cafe',
          cost: 300,
          durationMinutes: 60,
          isHiddenGem: true,
          locationName: 'Pollachi Outskirts'
        },
        {
          id: 'act-1-5',
          time: '07:30 PM',
          title: 'Night Campfire & Stargazing Session',
          description: 'Cozy campfire dinner at eco-homestay near forestry boundary.',
          category: 'stay',
          cost: 600,
          durationMinutes: 180,
          isHiddenGem: true,
          locationName: 'Eco Wilderness Camp'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Valparai Hairpin Curves & Tea Estate Trek',
      dayCost: 1850,
      travelTimeMinutes: 90,
      distanceKm: 65,
      dayHighlights: ['40 Hairpin Bends', 'Sholayar Dam', 'Tea Plantation Walk'],
      weather: {
        condition: 'Partly Cloudy',
        tempMaxC: 24,
        tempMinC: 16,
        rainProbabilityPercent: 15,
        humidityPercent: 72,
        windSpeedKmh: 14,
        uvIndex: 'Moderate',
        advice: 'Great road trip weather with passing clouds. Ideal for hairpin curve viewpoints.'
      },
      activities: [
        {
          id: 'act-2-1',
          time: '07:00 AM',
          title: 'Ascend 40 Scenic Hairpin Bends to Valparai',
          description: 'Breathtaking high-elevation road trip with frequent mountain mist views.',
          category: 'forest_route',
          cost: 200,
          durationMinutes: 90,
          isHiddenGem: true,
          locationName: 'Valparai Highway'
        },
        {
          id: 'act-2-2',
          time: '10:30 AM',
          title: 'Private Estate Tea Factory & Tasting',
          description: 'Guided walk through 100-year-old tea garden with fresh leaf brewing.',
          category: 'tea_estate',
          cost: 350,
          durationMinutes: 90,
          isHiddenGem: true,
          locationName: 'Valparai Tea Sanctuary'
        },
        {
          id: 'act-2-3',
          time: '01:30 PM',
          title: 'Traditional Village Banana Leaf Feast',
          description: 'Homestyle organic Tamil Nadu meals prepared by local villagers.',
          category: 'meal',
          cost: 300,
          durationMinutes: 60,
          isHiddenGem: true,
          locationName: 'Valparai Village'
        },
        {
          id: 'act-2-4',
          time: '04:30 PM',
          title: 'Sholayar Dam Backwaters & Sunset Point',
          description: 'Second deepest dam in Asia with quiet scenic sunset photography spots.',
          category: 'sunset',
          cost: 0,
          durationMinutes: 120,
          isHiddenGem: true,
          locationName: 'Sholayar Reservoir'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Top Slip Forest Safari & Kodiveri River Cascade',
      dayCost: 1400,
      travelTimeMinutes: 80,
      distanceKm: 55,
      dayHighlights: ['Forest Safari', 'Coracle Ride', 'Local Market'],
      weather: {
        condition: 'Clear Sky',
        tempMaxC: 26,
        tempMinC: 17,
        rainProbabilityPercent: 5,
        humidityPercent: 62,
        windSpeedKmh: 10,
        uvIndex: 'Moderate',
        advice: 'Bright clear skies for early forest safari and river bathing.'
      },
      activities: [
        {
          id: 'act-3-1',
          time: '06:00 AM',
          title: 'Top Slip Wildlife Sanctuary Safari',
          description: 'Guided forest jeep safari spotting wild elephants, deer, and exotic birds.',
          category: 'nature_trail',
          cost: 500,
          durationMinutes: 150,
          isHiddenGem: false,
          locationName: 'Anamalai Tiger Reserve'
        },
        {
          id: 'act-3-2',
          time: '11:00 AM',
          title: 'Kodiveri Cascade & River Bathing',
          description: 'Refresh in ancient stone weir cascading water with natural shower pools.',
          category: 'waterfall',
          cost: 100,
          durationMinutes: 120,
          isHiddenGem: true,
          locationName: 'Bhavani River Weir'
        },
        {
          id: 'act-3-3',
          time: '02:00 PM',
          title: 'Souvenir & Spices Shopping in Pollachi',
          description: 'Pick up fresh cardamom, eucalyptus oil, and local handloom crafts.',
          category: 'village',
          cost: 800,
          durationMinutes: 90,
          isHiddenGem: false,
          locationName: 'Pollachi Town Market'
        }
      ]
    }
  ]);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 'msg-1',
      sender: 'user',
      text: "Plan a 3-day trip around Coimbatore & Valparai with budget ₹12,000. Include hidden waterfalls, tea estates, and scenic bike routes."
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: "Wonderful request! I've synthesized a custom 3-day 'Coimbatore & Valparai Hidden Escape' itinerary with 11 curated activities, 7 hidden gems, and full budget allocation.",
      daysPreview: [
        { day: 'Day 1', title: 'Monkey Falls Secret Pass & Aliyar Sunset', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
        { day: 'Day 2', title: '40 Hairpin Curves & Valparai Tea Estates', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80' },
      ],
      followUp: "Your complete day-by-day timeline is rendered below! You can edit activities, add custom spots, export PDF/summary, or save directly to your workspace."
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [editingActivity, setEditingActivity] = useState<{ dayNum: number; act: Activity } | null>(null);
  const [addingActivityDay, setAddingActivityDay] = useState<number | null>(null);

  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('10:00 AM');
  const [newActivityCost, setNewActivityCost] = useState(200);
  const [newActivityDesc, setNewActivityDesc] = useState('');

  const [savedSpots, setSavedSpots] = useState([
    { id: 'spot-1', name: 'Monkey Falls Trail', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80' },
    { id: 'spot-2', name: 'Valparai Tea Sanctuary', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=300&q=80' },
    { id: 'spot-3', name: 'Sholayar Backwaters', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=300&q=80' }
  ]);

  // Pure Client-Side AI Itinerary Generator Engine
  const generateClientItinerary = (promptText: string) => {
    const promptLower = promptText.toLowerCase();

    let destName = 'Coimbatore & Valparai';
    let duration = tripSummary.durationDays;
    let budget = tripSummary.budgetTotal;

    if (promptLower.includes('ooty')) destName = 'Ooty & Kotagiri';
    if (promptLower.includes('munnar')) destName = 'Munnar & Gap Road';
    if (promptLower.includes('kodai')) destName = 'Kodaikanal Hidden Trails';
    if (promptLower.includes('amalfi')) destName = 'Amalfi Coast';
    if (promptLower.includes('agumbe')) destName = 'Agumbe Rainforest';

    // Parse budget from text if user typed e.g. "under 45,000", "budget 8000", "15k", "₹25000"
    const kMatch = promptLower.match(/(?:budget|under|for|cap|₹|\$)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
    const standardMatch = promptLower.match(/(?:budget|under|for|cap|₹|\$)\s*(\d+[\d,]*)/i);
    const rawNumberMatch = promptLower.match(/(?:₹|\$)\s*(\d+[\d,]*)/i);

    if (kMatch && kMatch[1]) {
      const parsedK = parseFloat(kMatch[1]) * 1000;
      if (parsedK > 0) budget = parsedK;
    } else if (standardMatch && standardMatch[1]) {
      const parsedB = parseInt(standardMatch[1].replace(/,/g, ''), 10);
      if (parsedB > 0) budget = parsedB;
    } else if (rawNumberMatch && rawNumberMatch[1]) {
      const parsedRaw = parseInt(rawNumberMatch[1].replace(/,/g, ''), 10);
      if (parsedRaw > 0) budget = parsedRaw;
    }

    // Parse duration if typed e.g. "2 day" or "5 days"
    const daysMatch = promptLower.match(/(\d+)\s*day/i);
    if (daysMatch && daysMatch[1]) {
      const parsedD = parseInt(daysMatch[1], 10);
      if (parsedD >= 1 && parsedD <= 10) duration = parsedD;
    }

    // Update trip summary parameters
    setTripSummary(prev => ({
      ...prev,
      title: `${destName} Offbeat Expedition`,
      destination: destName,
      durationDays: duration,
      budgetTotal: budget,
    }));

    // Generate Days array dynamically
    const newDays: ItineraryDay[] = [];

    for (let d = 1; d <= duration; d++) {
      const isWaterfalls = promptLower.includes('waterfall') || d === 1;
      const isTea = promptLower.includes('tea') || promptLower.includes('coffee') || d === 2;

      const dayTitle = d === 1 
        ? `${destName} Arrival & Waterfall Sanctuary` 
        : d === 2 
        ? `${destName} Mountain Ridge & Tea Estate Trek` 
        : `${destName} Forest Safari & Local Heritage Trails`;

      const dayActivities: Activity[] = [
        {
          id: `gen-act-${d}-1`,
          time: '07:00 AM',
          title: isWaterfalls ? `${destName} Hidden Cascade Walk` : `${destName} Sunrise Overlook Point`,
          description: 'Early morning quiet trail with minimal crowds and optimal soft sunrise lighting.',
          category: isWaterfalls ? 'waterfall' : 'viewpoint',
          cost: Math.round(budget * 0.02),
          durationMinutes: 120,
          isHiddenGem: true,
          locationName: `${destName} North Ridge`
        },
        {
          id: `gen-act-${d}-2`,
          time: '10:00 AM',
          title: isTea ? 'Organic Tea Plantation & Estate Tasting' : 'Local Artisan Village Workshop',
          description: 'Experience authentic regional craftsmanship, brewing, and local traditions.',
          category: isTea ? 'tea_estate' : 'village',
          cost: Math.round(budget * 0.04),
          durationMinutes: 90,
          isHiddenGem: true,
          locationName: `${destName} Estate Pass`
        },
        {
          id: `gen-act-${d}-3`,
          time: '01:00 PM',
          title: 'Traditional Homestyle Regional Feast',
          description: 'Locally cooked organic multi-course meal served in serene natural surroundings.',
          category: 'meal',
          cost: Math.round(budget * 0.03),
          durationMinutes: 60,
          isHiddenGem: false,
          locationName: `${destName} Valley Dining`
        },
        {
          id: `gen-act-${d}-4`,
          time: '04:30 PM',
          title: 'Secret Reservoir & Sunset Hammock Rest',
          description: 'Unwind at a secluded waterbody with panoramic evening sunset vistas.',
          category: 'sunset',
          cost: 0,
          durationMinutes: 120,
          isHiddenGem: true,
          locationName: `${destName} Sunset Point`
        }
      ];

      const dayCostSum = dayActivities.reduce((acc, a) => acc + a.cost, 0);

      newDays.push({
        dayNumber: d,
        title: dayTitle,
        dayCost: dayCostSum,
        travelTimeMinutes: 45 + d * 15,
        distanceKm: 30 + d * 12,
        dayHighlights: ['Offbeat Trail', 'Local Cuisine', 'Panoramic Sunset'],
        weather: getWeatherForDestinationDay(destName, d),
        activities: dayActivities
      });
    }

    return newDays;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;

    const userText = chatPrompt;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText
    };

    setChatHistory(prev => [...prev, newMsg]);
    setChatPrompt('');
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateClientItinerary(userText);
      setGeneratedDays(generated);
      setIsGenerating(false);

      setChatHistory(prev => [
        ...prev,
        {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: `I've synthesized a brand new ${generated.length}-day itinerary for ${tripSummary.destination} tailored directly to your preferences!`,
          daysPreview: generated.slice(0, 2).map((d, idx) => ({
            day: `Day ${d.dayNumber}`,
            title: d.title,
            img: idx === 0 
              ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
              : 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80'
          })),
          followUp: "Your interactive Day-by-Day timeline below has been updated in real-time. You can edit any activity or download the itinerary."
        }
      ]);

      showToast(`Itinerary generated for ${tripSummary.destination}!`);
    }, 900);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateClientItinerary(chatPrompt || "Coimbatore & Valparai offbeat");
      setGeneratedDays(generated);
      setIsGenerating(false);
      showToast('Itinerary regenerated with new offbeat variations!');
    }, 700);
  };

  const handleSaveCurrentTrip = () => {
    const totalSpent = generatedDays.reduce((acc, d) => acc + d.dayCost, 0);

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title: tripSummary.title,
      description: `Custom ${tripSummary.durationDays}-day offbeat itinerary planned for ${tripSummary.region}`,
      region: tripSummary.region,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + tripSummary.durationDays * 86400000).toISOString().split('T')[0],
      durationDays: tripSummary.durationDays,
      budgetTotal: tripSummary.budgetTotal,
      budgetSpent: totalSpent,
      currency: 'INR',
      transportMode: 'Bike/Scooter',
      groupSize: tripSummary.groupSize,
      travelStyle: 'Balanced',
      days: generatedDays,
      isSaved: true,
      isFavorite: true,
      coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSaveTrip(newTrip);
    setSavedStatusMsg(true);
    showToast('Saved to your Saved Trips workspace!');
    setTimeout(() => setSavedStatusMsg(false), 3000);
  };

  const handleDownloadSummary = () => {
    let content = `EXPLOREX AI GENERATED TRAVEL ITINERARY\n`;
    content += `=========================================\n`;
    content += `Trip: ${tripSummary.title}\n`;
    content += `Destination: ${tripSummary.destination} (${tripSummary.region})\n`;
    content += `Duration: ${tripSummary.durationDays} Days\n`;
    content += `Total Estimated Budget: ₹${tripSummary.budgetTotal.toLocaleString()}\n\n`;

    generatedDays.forEach(day => {
      content += `-----------------------------------------\n`;
      content += `DAY ${day.dayNumber}: ${day.title}\n`;
      content += `Est. Day Cost: ₹${day.dayCost} | Travel: ${day.distanceKm} km (${day.travelTimeMinutes} mins)\n`;
      content += `-----------------------------------------\n`;
      day.activities.forEach(act => {
        content += `[${act.time}] ${act.title} ${act.isHiddenGem ? '(★ Hidden Gem)' : ''}\n`;
        content += `  - Location: ${act.locationName || 'Local'}\n`;
        content += `  - Details: ${act.description}\n`;
        content += `  - Cost: ₹${act.cost}\n\n`;
      });
    });

    content += `Generated by ExploreX AI Engine on ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tripSummary.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-itinerary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Itinerary downloaded successfully as TXT file!');
  };

  const handleDeleteActivity = (dayNum: number, actId: string) => {
    setGeneratedDays(prev => prev.map(d => {
      if (d.dayNumber === dayNum) {
        const updatedActs = d.activities.filter(a => a.id !== actId);
        const newCost = updatedActs.reduce((acc, a) => acc + a.cost, 0);
        return { ...d, activities: updatedActs, dayCost: newCost };
      }
      return d;
    }));
    showToast('Activity removed from itinerary.');
  };

  const handleSaveActivityEdit = () => {
    if (!editingActivity) return;

    setGeneratedDays(prev => prev.map(d => {
      if (d.dayNumber === editingActivity.dayNum) {
        const updatedActs = d.activities.map(a => a.id === editingActivity.act.id ? editingActivity.act : a);
        const newCost = updatedActs.reduce((acc, a) => acc + a.cost, 0);
        return { ...d, activities: updatedActs, dayCost: newCost };
      }
      return d;
    }));

    setEditingActivity(null);
    showToast('Activity updated successfully!');
  };

  const handleAddNewActivity = () => {
    if (addingActivityDay === null || !newActivityTitle.trim()) return;

    const newAct: Activity = {
      id: `custom-act-${Date.now()}`,
      time: newActivityTime || '11:00 AM',
      title: newActivityTitle,
      description: newActivityDesc || 'Custom travel activity added by user.',
      category: 'nature_trail',
      cost: newActivityCost || 0,
      durationMinutes: 60,
      isHiddenGem: true,
      locationName: tripSummary.destination
    };

    setGeneratedDays(prev => prev.map(d => {
      if (d.dayNumber === addingActivityDay) {
        const updatedActs = [...d.activities, newAct];
        const newCost = updatedActs.reduce((acc, a) => acc + a.cost, 0);
        return { ...d, activities: updatedActs, dayCost: newCost };
      }
      return d;
    }));

    setAddingActivityDay(null);
    setNewActivityTitle('');
    setNewActivityDesc('');
    showToast('New activity added to day itinerary!');
  };

  const handleAddSpotFromModal = (place: Place) => {
    if (!savedSpots.some(s => s.name === place.name)) {
      setSavedSpots(prev => [...prev, { id: place.id, name: place.name, img: place.imageUrl }]);
    }
    setShowAddSpotModal(false);
    showToast(`Added ${place.name} to saved spots!`);
  };

  const currentTripForSharing: Trip = {
    id: `trip-${Date.now()}`,
    title: tripSummary.title,
    description: `Custom itinerary planned for ${tripSummary.region}`,
    region: tripSummary.region,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + tripSummary.durationDays * 86400000).toISOString().split('T')[0],
    durationDays: tripSummary.durationDays,
    budgetTotal: tripSummary.budgetTotal,
    budgetSpent: generatedDays.reduce((acc, d) => acc + d.dayCost, 0),
    currency: 'INR',
    transportMode: 'Car',
    groupSize: tripSummary.groupSize,
    travelStyle: 'Balanced',
    days: generatedDays,
    isSaved: true,
    isFavorite: false,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString().split('T')[0]
  };

  return (
    <div className="space-y-6 pb-12 font-sans relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Status & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">AI Planner Active</span>
          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-bold hidden sm:inline">
            100% Client-Side Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNewTrip && (
            <button
              onClick={onOpenNewTrip}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ New Trip</span>
            </button>
          )}

          <button
            onClick={onOpenMap}
            className="p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <MapIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">View on Map</span>
          </button>

          <button
            onClick={() => {
              onShareToTeam(currentTripForSharing);
              showToast('Shared itinerary with Team Workspace!');
            }}
            className="p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Share with Team</span>
          </button>

          <button
            onClick={handleDownloadSummary}
            className="p-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleSaveCurrentTrip}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
              savedStatusMsg
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {savedStatusMsg ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{savedStatusMsg ? "Itinerary Saved!" : "Save Itinerary"}</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left Chat Stream | Right Trip Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Center Chat Stream */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between min-h-[420px] sm:min-h-[480px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xs">
          {/* Messages */}
          <div className="space-y-4 overflow-y-auto max-h-[380px] sm:max-h-[420px] pr-1 sm:pr-2">
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium">AI Travel Chat Assistant</p>

            {chatHistory.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.sender === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl p-3.5 sm:p-4 max-w-[90%] sm:max-w-lg shadow-2xs text-xs font-medium leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-3.5 sm:p-4 max-w-[95%] sm:max-w-xl text-slate-800 dark:text-slate-100 space-y-3 shadow-2xs">
                      <p className="text-xs leading-relaxed font-medium">{msg.text}</p>

                      {/* Day Preview Cards */}
                      {msg.daysPreview && msg.daysPreview.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {msg.daysPreview.map((dp, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 space-y-2">
                              <div>
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">{dp.day}</span>
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{dp.title}</h4>
                              </div>
                              <img src={dp.img} alt={dp.title} className="w-full h-20 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.followUp && (
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700 pt-2">
                          {msg.followUp}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing offbeat routes & generating day-by-day timeline...</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat Prompt Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Type e.g. 'Plan a 3-day trip to Ooty with budget 8000'..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-2xl pl-3.5 pr-28 sm:pr-32 py-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="absolute right-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-xl flex items-center gap-1 sm:gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Panel: Trip Summary */}
        <div className="space-y-4">
          {/* Trip Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Trip Summary</h3>
              <button 
                onClick={() => setShowEditSummaryModal(true)}
                className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Edit Trip Details"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Cover photo */}
            <div className="relative h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt={tripSummary.destination}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-200 block">{tripSummary.region}</span>
                <h4 className="font-extrabold text-white text-sm">{tripSummary.destination}</h4>
              </div>
            </div>

            {/* Metadata list */}
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{tripSummary.durationDays} Days • {tripSummary.dates}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{tripSummary.travelerType}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Est. Budget: {formatCurrency(tripSummary.budgetTotal, preferredCurrency)}</span>
              </div>
            </div>
          </div>

          {/* Saved Spots Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Saved Spots ({savedSpots.length})</h3>
              <button 
                onClick={() => setShowAddSpotModal(true)}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                + Add More
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {savedSpots.map((spot, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden h-24 group cursor-pointer bg-slate-100 dark:bg-slate-800">
                  <img src={spot.img} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white line-clamp-1">{spot.name}</span>
                </div>
              ))}

              <button 
                onClick={() => setShowAddSpotModal(true)}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl h-24 flex flex-col items-center justify-center gap-1 cursor-pointer transition text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50/50 dark:bg-slate-800/50 w-full"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-bold">Add Spot</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GENERATED ITINERARY TIMELINE VIEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="font-black text-xl text-slate-900 dark:text-white">Generated Itinerary Timeline</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5">
              Day-by-day breakdown with time slots, costs in ₹, and offbeat recommendations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Regenerate</span>
            </button>
            <button
              onClick={handleDownloadSummary}
              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TXT</span>
            </button>
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-8">
          {generatedDays.map((day) => {
            const dayWeather = day.weather || getWeatherForDestinationDay(tripSummary.destination, day.dayNumber);
            const theme = getWeatherTheme(dayWeather.condition);

            return (
              <div key={day.dayNumber} className="border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 space-y-4 bg-slate-50/40 dark:bg-slate-800/30">
                {/* Day Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{day.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-0.5">
                        <span>Travel: {day.distanceKm} km ({day.travelTimeMinutes} mins)</span>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">Est. Day Cost: {formatCurrency(day.dayCost, preferredCurrency)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setAddingActivityDay(day.dayNumber)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Activity</span>
                  </button>
                </div>

                {/* Day Highlights & Weather Forecast Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Highlights Pill Box */}
                  <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 tracking-wider block">
                      Day Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {day.dayHighlights.map((hl, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          • {hl}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weather Forecast Banner */}
                  <div className={`md:col-span-2 rounded-2xl p-3.5 border ${theme.bg} dark:bg-slate-900 dark:border-slate-800 shadow-2xs space-y-2.5 flex flex-col justify-between`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`p-2 rounded-xl bg-white/90 dark:bg-slate-800 border ${theme.badgeBg} dark:border-slate-700 ${theme.iconColor} shadow-2xs`}>
                          {dayWeather.condition === 'Sunny' || dayWeather.condition === 'Clear Sky' ? (
                            <Sun className="w-5 h-5" />
                          ) : dayWeather.condition === 'Light Showers' || dayWeather.condition === 'Thunderstorms' ? (
                            <CloudRain className="w-5 h-5" />
                          ) : dayWeather.condition === 'Pleasant Mist' || dayWeather.condition === 'Foggy Morning' ? (
                            <CloudFog className="w-5 h-5" />
                          ) : (
                            <CloudSun className="w-5 h-5" />
                          )}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                              Day {day.dayNumber} Weather: {dayWeather.condition}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${theme.badgeBg} dark:border-slate-700 text-slate-800 dark:text-slate-200`}>
                              {dayWeather.tempMinC}°C – {dayWeather.tempMaxC}°C
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                            {dayWeather.advice}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                        <span className="flex items-center gap-1" title="Rain chance">
                          <Droplets className="w-3.5 h-3.5 text-blue-500" />
                          <span>{dayWeather.rainProbabilityPercent}% Rain</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1" title="Humidity">
                          <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                          <span>{dayWeather.humidityPercent}% Humid</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1" title="Wind">
                          <Wind className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{dayWeather.windSpeedKmh} km/h</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              {/* Activities Timeline */}
              <div className="space-y-3 relative pl-4 border-l-2 border-blue-200 dark:border-blue-900">
                {day.activities.map((act) => (
                  <div key={act.id} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 space-y-2 shadow-2xs hover:shadow-xs transition relative">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-xs flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                          <Clock className="w-3 h-3" />
                          <span>{act.time}</span>
                        </span>

                        {act.isHiddenGem && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-black text-[10px] uppercase border border-amber-200 dark:border-amber-800">
                            ★ Hidden Gem
                          </span>
                        )}

                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          ({act.durationMinutes} mins)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          {act.cost === 0 ? 'Free' : formatCurrency(act.cost, preferredCurrency)}
                        </span>

                        <button
                          onClick={() => setEditingActivity({ dayNum: day.dayNumber, act: { ...act } })}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                          title="Edit Activity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteActivity(day.dayNumber, act.id)}
                          className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{act.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{act.description}</p>
                    
                    {act.locationName && (
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>{act.locationName}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Edit Activity Modal */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Edit Activity Details</h3>
              <button onClick={() => setEditingActivity(null)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Activity Title</label>
                <input
                  type="text"
                  value={editingActivity.act.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, act: { ...editingActivity.act, title: e.target.value } })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={editingActivity.act.time}
                    onChange={(e) => setEditingActivity({ ...editingActivity, act: { ...editingActivity.act, time: e.target.value } })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={editingActivity.act.cost}
                    onChange={(e) => setEditingActivity({ ...editingActivity, act: { ...editingActivity.act, cost: Number(e.target.value) } })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingActivity.act.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, act: { ...editingActivity.act, description: e.target.value } })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-medium focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setEditingActivity(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveActivityEdit}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Activity Modal */}
      {addingActivityDay !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Add Activity to Day {addingActivityDay}</h3>
              <button onClick={() => setAddingActivityDay(null)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Activity Title</label>
                <input
                  type="text"
                  placeholder="e.g. Hidden Cave Trek & Photography"
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={newActivityCost}
                    onChange={(e) => setNewActivityCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe activity details or directions..."
                  value={newActivityDesc}
                  onChange={(e) => setNewActivityDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-medium focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setAddingActivityDay(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewActivity}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Trip Parameters Modal */}
      {showEditSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Edit Trip Parameters</h3>
              <button onClick={() => setShowEditSummaryModal(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowEditSummaryModal(false);
                const generated = generateClientItinerary(tripSummary.destination);
                setGeneratedDays(generated);
                showToast('Itinerary regenerated based on new parameters!');
              }}
              className="space-y-3 text-xs font-medium"
            >
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Trip Name</label>
                <input
                  type="text"
                  value={tripSummary.title}
                  onChange={(e) => setTripSummary({ ...tripSummary, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Destination</label>
                  <input
                    type="text"
                    value={tripSummary.destination}
                    onChange={(e) => setTripSummary({ ...tripSummary, destination: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={tripSummary.durationDays}
                    onChange={(e) => setTripSummary({ ...tripSummary, durationDays: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Budget Total (₹)</label>
                <input
                  type="number"
                  value={tripSummary.budgetTotal}
                  onChange={(e) => setTripSummary({ ...tripSummary, budgetTotal: Number(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditSummaryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  Update & Regenerate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Spot Modal */}
      {showAddSpotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Select Spot to Add</h3>
              <button onClick={() => setShowAddSpotModal(false)} className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {availablePlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => handleAddSpotFromModal(place)}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 flex items-center justify-between gap-3 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={place.imageUrl} alt={place.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{place.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{place.region} • {place.crowdLevel}% crowd</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold cursor-pointer">
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
