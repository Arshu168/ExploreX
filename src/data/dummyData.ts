import { Place, Trip, Expense, TeamWorkspace, Memory, RagDocument, UserProfile } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Arjun Verma",
  email: "arjun.v@hiddentrail.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  homeCity: "Coimbatore, India",
  preferredCurrency: "INR",
  defaultPace: "Balanced",
  defaultTransport: "Bike/Scooter",
  interests: ["Trekking", "Landscape Photography", "Offbeat Waterfalls", "Local Food", "Quiet Viewpoints"]
};

export const DUMMY_PLACES: Place[] = [
  {
    id: "place-1",
    name: "Grass Hills Silent Reserve",
    category: "nature_trail",
    description: "A pristine high-altitude shola grassland plateau tucked inside the Anamalai Tiger Reserve. Protected habitat with rolling emerald hills and rare Nilgiri Tahr sightings.",
    region: "Valparai / Coimbatore, TN",
    coordinates: [10.3235, 76.9582],
    crowdLevel: 12,
    difficulty: "Moderate",
    bestTime: "06:00 AM - 10:00 AM (Early mist)",
    estimatedCost: 350,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Shola Forest", "Mist Trail", "Wildlife", "Photography"],
    localTips: [
      "Requires Forest Department permit obtained at Pollaachi checkpoint before 8 AM.",
      "No plastic bottles allowed; carry a copper/metal water flask.",
      "Peak visibility happens around 7:15 AM before cloud cover settles in."
    ],
    ragSources: [
      {
        title: "Anamalai Eco-Tourism Forest Register 2025",
        url: "https://forests.tn.gov.in/anamalai-grasshills",
        snippet: "Grass Hills National Park limits daily visitors to 50 passes to protect the fragile Shola grassland ecosystem.",
        sourceType: "Government Archive"
      },
      {
        title: "Western Ghats Offbeat Explorer Blog",
        url: "https://offbeatwesternghats.com/valparai-grass-hills",
        snippet: "Unlike Ooty's commercialized spots, Grass Hills offers complete silence and untouched wilderness.",
        sourceType: "Traveler Journal"
      }
    ]
  },
  {
    id: "place-2",
    name: "Kadamparai Secret Hydro Basin",
    category: "waterfall",
    description: "A secluded natural rock pool and tiered waterfall hidden behind thick bamboo groves along the Kadamparai reservoir backwaters.",
    region: "Valparai, TN",
    coordinates: [10.3982, 76.9741],
    crowdLevel: 8,
    difficulty: "Easy",
    bestTime: "02:00 PM - 05:00 PM",
    estimatedCost: 0,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    tags: ["Secret Waterfall", "Rock Bathing", "Bamboo Canopy"],
    localTips: [
      "Ask the local tea stall near Kadamparai power station for the unpaved forest foot-trail path.",
      "Rock surfaces get slippery after monsoon downpours."
    ],
    ragSources: [
      {
        title: "Hidden Streams of Anamalai - Native Guide",
        url: "https://valparaiguide.org/kadamparai-secret-falls",
        snippet: "Uncharted stream fed by upper reservoir overflows; practically unknown to mainstream tourist buses.",
        sourceType: "Local Forum"
      }
    ]
  },
  {
    id: "place-3",
    name: "Nallamudi Poonjolai Sunset Ridge",
    category: "sunset",
    description: "Panoramic cliff view overlooking vast deep tea valleys, tribal hamlets, and the vertical precipices of Mudis peak.",
    region: "Valparai, TN",
    coordinates: [10.2811, 76.9385],
    crowdLevel: 22,
    difficulty: "Easy",
    bestTime: "04:30 PM - 06:15 PM",
    estimatedCost: 50,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=800&q=80",
    tags: ["Tea Garden Cliff", "Golden Hour", "Valley View"],
    localTips: [
      "Walk 800m through the estate path instead of taking the auto shortcut for better photography angles.",
      "Local cardamom tea vendor near the gate makes fresh ginger spice chai."
    ],
    ragSources: [
      {
        title: "Tea Country Trails & Photographers Companion",
        url: "https://teatrails.in/nallamudi",
        snippet: "Offers 270-degree view of deep forest gorges where elephant herds occasionally cross in the evenings.",
        sourceType: "Travel Magazine"
      }
    ]
  },
  {
    id: "place-4",
    name: "Vellamalai Organic Estate Cafe",
    category: "cafe",
    description: "Rustic wooden deck cafe embedded inside an organic tea & vanilla plantation serving artisan single-origin coffees and homemade banana cakes.",
    region: "Valparai / Pollachi",
    coordinates: [10.3541, 76.9214],
    crowdLevel: 15,
    difficulty: "Easy",
    bestTime: "11:00 AM - 04:00 PM",
    estimatedCost: 250,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    tags: ["Artisan Coffee", "Wifi & Coworking", "Organic Farm"],
    localTips: [
      "Try their cold brew steeped with estate-grown cardamom and local eucalyptus honey.",
      "Decent high-speed satellite Wi-Fi available for digital nomads."
    ],
    ragSources: [
      {
        title: "Digital Nomad India - Hill Station Workspaces",
        url: "https://nomadindia.io/valparai-work-spots",
        snippet: "Quiet sanctuary with power backup and views over organic tea rows.",
        sourceType: "Nomad Review"
      }
    ]
  },
  {
    id: "place-5",
    name: "Pambar River Secret Pool",
    category: "nature_trail",
    description: "Hidden crystal-clear river pool formed by the Pambar river flowing through sandalwood forests near Chinnar sanctuary border.",
    region: "Marayoor / Valparai Border",
    coordinates: [10.2852, 77.1624],
    crowdLevel: 18,
    difficulty: "Moderate",
    bestTime: "08:30 AM - 12:00 PM",
    estimatedCost: 100,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    tags: ["Sandalwood Trail", "Crystal Water", "Birdwatching"],
    localTips: [
      "Wear sturdy trail shoes; the forest leaf mold path can be slippery.",
      "Look for Giant Malabar Squirrel nests in the high forest canopy."
    ],
    ragSources: [
      {
        title: "Chinnar Sanctuary Field Notes",
        url: "https://keralatourism.org/chinnar-pambar-trail",
        snippet: "Pambar river holds endemic hill stream fish species in untouched natural pools.",
        sourceType: "Wildlife Bulletin"
      }
    ]
  },
  {
    id: "place-6",
    name: "Siruvani Deep Forest Viewpoint",
    category: "viewpoint",
    description: "An isolated cliff edge above Siruvani Dam reservoir known for producing some of the sweetest natural drinking water in the world.",
    region: "Siruvani / Coimbatore",
    coordinates: [10.9634, 76.6892],
    crowdLevel: 10,
    difficulty: "Moderate",
    bestTime: "07:00 AM - 11:00 AM",
    estimatedCost: 120,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    tags: ["Reservoir View", "Western Ghats", "Untouched Nature"],
    localTips: [
      "Access limited; check Forest Department entry times at Sadivayal gate.",
      "Bring packed snacks as no commercial food outlets exist inside the reserve."
    ],
    ragSources: [
      {
        title: "Coimbatore Eco Trails",
        url: "https://coimbatore.gov.in/eco-siruvani",
        snippet: "Siruvani waterfalls and reservoir gate close strictly at 3 PM for wildlife corridor safety.",
        sourceType: "Official Portal"
      }
    ]
  },
  {
    id: "place-7",
    name: "Kurinji Flower Slope & Old Stone Bridge",
    category: "village",
    description: "An ancient British-era stone arch bridge spanning a fast hill stream, surrounded by wild lavender blooms and coffee gardens.",
    region: "Chikmagalur, KA",
    coordinates: [13.3161, 75.7720],
    crowdLevel: 14,
    difficulty: "Easy",
    bestTime: "07:30 AM - 11:30 AM",
    estimatedCost: 0,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    tags: ["Heritage Arch", "Coffee Country", "River Trail"],
    localTips: [
      "Park near the old estate gate and walk down the mossy cobblestone track.",
      "Great morning light for long-exposure water photography."
    ],
    ragSources: [
      {
        title: "Coffee Land Archives & Hidden Trails",
        url: "https://chikmagalur.nic.in/heritage-bridge",
        snippet: "Built in 1912 for transporting raw parchment coffee across the Bhadra tributary.",
        sourceType: "Historical Registry"
      }
    ]
  },
  {
    id: "place-8",
    name: "Meenmutty Secret Cave Pool",
    category: "waterfall",
    description: "A three-tiered hidden cascade deep inside Wayanad's teak forests with natural rocky caverns and pristine swimming basins.",
    region: "Wayanad, KL",
    coordinates: [11.6854, 76.1320],
    crowdLevel: 20,
    difficulty: "Challenging",
    bestTime: "08:00 AM - 01:00 PM",
    estimatedCost: 150,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    tags: ["Trek", "Rock Cavern", "Tiered Falls"],
    localTips: [
      "Rope climb required for Tier 2; wear shoes with strong rubber grip.",
      "Guide hire is recommended at the forest entry hut."
    ],
    ragSources: [
      {
        title: "Wayanad Backcountry Treks",
        url: "https://wayanadtourism.org/meenmutty-hidden-tier",
        snippet: "Tier 3 remains secluded due to the 2km jungle trek from the main road.",
        sourceType: "Trekking Club"
      }
    ]
  },
  {
    id: "place-9",
    name: "Valparai Highway Fuel & Service Station",
    category: "fuel",
    description: "Essential fuel station with air check, basic EV charger, and emergency tool kit supplies before starting the 40 hairpin bend climb.",
    region: "Pollachi / Valparai Foot",
    coordinates: [10.5120, 76.9920],
    crowdLevel: 30,
    difficulty: "Easy",
    bestTime: "24/7",
    estimatedCost: 1000,
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1527018601619-a508a2be00d6?auto=format&fit=crop&w=800&q=80",
    tags: ["Fuel Station", "EV Charger", "Tire Pressure"],
    localTips: [
      "Top up full tank here! Next reliable petrol pump is 45km uphill.",
      "Clean rest stops and emergency radiator water available."
    ],
    ragSources: []
  },
  {
    id: "place-10",
    name: "Valparai Government General Hospital",
    category: "hospital",
    description: "Primary municipal healthcare facility with 24/7 casualty, emergency first aid, ambulance service, and snake-bite anti-venom unit.",
    region: "Valparai Town Center",
    continent: "Asia",
    country: "India",
    coordinates: [10.3275, 76.9550],
    crowdLevel: 15,
    difficulty: "Easy",
    bestTime: "24/7 Emergency",
    estimatedCost: 0,
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    tags: ["Medical Emergency", "24/7 First Aid", "Pharmacy"],
    localTips: [
      "Emergency contact helpline: +91 4253 222222",
      "In-house pharmacy open round the clock."
    ],
    ragSources: []
  },
  // WORLDWIDE PLACES ACROSS CONTINENTS
  {
    id: "place-11",
    name: "Kyoto Arashiyama & Giouji Moss Temple",
    category: "nature_trail",
    description: "A serene emerald bamboo sanctuary and secluded 1200-year-old moss temple tucked at the base of Kyoto's western mountains.",
    region: "Kyoto, Kansai",
    continent: "Asia",
    country: "Japan",
    coordinates: [35.0170, 135.6713],
    crowdLevel: 18,
    difficulty: "Easy",
    bestTime: "06:30 AM - 08:30 AM (Before crowds)",
    estimatedCost: 500,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    tags: ["Bamboo Forest", "Moss Sanctuary", "Zen Temple", "Japan Travel"],
    localTips: [
      "Visit Giouji moss garden at 8:00 AM right as gates open for pristine dew photography.",
      "Rent a wooden rowboat near Togetsukyo bridge for river views."
    ],
    ragSources: [
      {
        title: "Kansai Heritage Preservation Journal 2026",
        url: "https://japan.travel/kyoto-hidden-moss",
        snippet: "Giouji temple maintains over 40 species of rare velvet moss cultivated over centuries.",
        sourceType: "Official Tourism Archive"
      }
    ]
  },
  {
    id: "place-12",
    name: "Path of the Gods (Sentiero degli Dei)",
    category: "viewpoint",
    description: "Spectacular high cliffside trail suspended 500 meters above the Tyrrhenian Sea, linking quiet mountain hamlets along the Amalfi coastline.",
    region: "Amalfi Coast, Campania",
    continent: "Europe",
    country: "Italy",
    coordinates: [40.6281, 14.4850],
    crowdLevel: 25,
    difficulty: "Moderate",
    bestTime: "08:00 AM - 11:30 AM",
    estimatedCost: 0,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    tags: ["Amalfi Coast", "Cliff Hike", "Mediterranean", "Italy Travel"],
    localTips: [
      "Hike from Bomerano downhill to Nocelle to avoid steep uphill stairs.",
      "Stop at Shepherd Il Chiofalo's hut midway for fresh homemade lemonade."
    ],
    ragSources: [
      {
        title: "Amalfi Coastal Hikes Register",
        url: "https://amalficoast.it/path-gods",
        snippet: "Offers uninterrupted views stretching all the way to the Isle of Capri.",
        sourceType: "Alpine Club Italy"
      }
    ]
  },
  {
    id: "place-13",
    name: "Grindelwald First Cliff Walk & Bachalpsee",
    category: "viewpoint",
    description: "Suspended metal catwalk jutting out over alpine abysses, leading to a mirror-like glacial reflection lake beneath the Eiger peak.",
    region: "Bernese Oberland",
    continent: "Europe",
    country: "Switzerland",
    coordinates: [46.6586, 8.0560],
    crowdLevel: 22,
    difficulty: "Moderate",
    bestTime: "08:30 AM - 11:00 AM",
    estimatedCost: 3200,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    tags: ["Swiss Alps", "Glacial Lake", "Cliff Catwalk", "Switzerland"],
    localTips: [
      "Swiss Travel Pass gives 50% discount on the Grindelwald First gondola ride.",
      "Pack warm windproof layers even in mid-summer."
    ],
    ragSources: [
      {
        title: "Swiss Alpine Club Trail Gazette",
        url: "https://myswitzerland.com/bachalpsee-walk",
        snippet: "Bachalpsee offers iconic views of the Schreckhorn peaks reflected in still water.",
        sourceType: "Swiss Tourism Portal"
      }
    ]
  },
  {
    id: "place-14",
    name: "Munduk Secret Waterfalls & Clove Valley",
    category: "waterfall",
    description: "A misty jungle gorge enveloped by wild vanilla vines, clove trees, and twin cascading waterfalls deep in North Bali's highlands.",
    region: "Munduk, Buleleng",
    continent: "Asia",
    country: "Indonesia",
    coordinates: [-8.2711, 115.0805],
    crowdLevel: 14,
    difficulty: "Moderate",
    bestTime: "07:00 AM - 10:30 AM",
    estimatedCost: 150,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    tags: ["Bali Highlands", "Jungle Waterfalls", "Cloves & Spice"],
    localTips: [
      "Combine Munduk Waterfall, Melanting, and Golden Valley into a single 3-hour loop trek.",
      "Eco cafe near Golden Valley serves coffee brewed directly from estate beans."
    ],
    ragSources: [
      {
        title: "North Bali Eco-Explorer Journal",
        url: "https://indonesia.travel/munduk-waterfalls",
        snippet: "Munduk region sits at 900m altitude keeping air crisp and temperature pleasant year round.",
        sourceType: "Regional Guide"
      }
    ]
  },
  {
    id: "place-15",
    name: "Emerald Lake & Yoho Alpine Valley",
    category: "nature_trail",
    description: "A mesmerizing turquoise glacial lake framed by snow-dusted Canadian Rockies peaks and old-growth pine forests.",
    region: "Field, Yoho National Park",
    continent: "Americas",
    country: "Canada",
    coordinates: [51.4428, -116.5361],
    crowdLevel: 20,
    difficulty: "Easy",
    bestTime: "07:00 AM - 10:00 AM",
    estimatedCost: 0,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80",
    tags: ["Canadian Rockies", "Glacial Turquoise Lake", "Canoeing", "Canada"],
    localTips: [
      "Rent a hand-crafted cedar canoe at 8 AM before winds ripple the water mirror.",
      "The 5.2km lakeside circuit loop trail is flat and accessible."
    ],
    ragSources: [
      {
        title: "Parks Canada Conservation Register",
        url: "https://pc.gc.ca/yoho-emerald-lake",
        snippet: "Glacial silt grinding produces fine rock flour reflecting light in vivid emerald hues.",
        sourceType: "National Park Service"
      }
    ]
  },
  {
    id: "place-16",
    name: "Milford Sound Mitre Peak Fjord",
    category: "nature_trail",
    description: "Dramatic sea fjord carved by ancient glaciers with vertical granite cliffs rising 1,200m directly out of dark ocean waters.",
    region: "Fiordland National Park",
    continent: "Oceania",
    country: "New Zealand",
    coordinates: [-44.6414, 167.8974],
    crowdLevel: 28,
    difficulty: "Moderate",
    bestTime: "09:00 AM - 01:00 PM",
    estimatedCost: 4500,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80",
    tags: ["Fiordland", "Waterfall Cruise", "Mitre Peak", "New Zealand"],
    localTips: [
      "Rainy days create hundreds of temporary waterfalls cascading off vertical cliffs!",
      "Look out for fur seals and Fiordland crested penguins near Seal Rock."
    ],
    ragSources: [
      {
        title: "New Zealand Department of Conservation",
        url: "https://doc.govt.nz/milford-sound",
        snippet: "Described by Rudyard Kipling as the eighth wonder of the world.",
        sourceType: "Conservation Archive"
      }
    ]
  },
  {
    id: "place-17",
    name: "Table Mountain Skeleton Gorge Trail",
    category: "nature_trail",
    description: "A lush, shaded ravine hike through Kirstenbosch Botanical Gardens up to the flat tableland summit overlooking two oceans.",
    region: "Cape Town, Western Cape",
    continent: "Africa",
    country: "South Africa",
    coordinates: [-33.9880, 18.4310],
    crowdLevel: 16,
    difficulty: "Challenging",
    bestTime: "07:00 AM - 11:30 AM",
    estimatedCost: 350,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Table Mountain", "Fynbos Flora", "Cape Town", "South Africa"],
    localTips: [
      "Start early inside Kirstenbosch gardens; ladder sections require good footwear.",
      "Take the Table Mountain aerial cableway back down to save knees."
    ],
    ragSources: [
      {
        title: "SANParks Table Mountain Heritage Journal",
        url: "https://sanparks.org/skeleton-gorge",
        snippet: "Home to over 2,200 endemic Fynbos floral species unique to the Cape Floral Kingdom.",
        sourceType: "National Park Guide"
      }
    ]
  },
  {
    id: "place-18",
    name: "Desert Oasis Dunes & Al Qudra Lakes",
    category: "sunset",
    description: "Golden rolling desert dunes encircling artificial wildlife sanctuaries populated by Arabian Oryx and desert flamingoes.",
    region: "Dubai Desert Conservation",
    continent: "Middle East",
    country: "United Arab Emirates",
    coordinates: [24.8383, 55.3323],
    crowdLevel: 15,
    difficulty: "Easy",
    bestTime: "04:30 PM - 07:00 PM (Sunset)",
    estimatedCost: 0,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    tags: ["Desert Dunes", "Arabian Oryx", "Golden Sunset", "Dubai"],
    localTips: [
      "Best accessed with a 4WD vehicle or SUV; deflate tire pressure for soft sand.",
      "Bring tea thermos for stargazing after dusk."
    ],
    ragSources: [
      {
        title: "UAE Ecotourism & Oasis Directory",
        url: "https://visitdubai.com/al-qudra-lakes",
        snippet: "Protected habitat harboring over 170 migratory species of desert birds.",
        sourceType: "Conservation Board"
      }
    ]
  },
  {
    id: "place-ooty-1",
    name: "Avalanche Lake & Silent Sanctuary",
    category: "nature_trail",
    description: "An undisturbed emerald-blue reservoir framed by rolling trout-filled streams, rhododendrons, and pristine Nilgiri shola forests.",
    region: "Ooty / Nilgiris, TN",
    continent: "Asia",
    country: "India",
    coordinates: [11.2982, 76.5925],
    crowdLevel: 14,
    difficulty: "Easy",
    bestTime: "07:30 AM - 11:00 AM",
    estimatedCost: 150,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    tags: ["Ooty", "Avalanche Lake", "Shola Forest", "Nilgiris", "Nature"],
    localTips: [
      "Take the eco-safari vehicle from the forest checkpost for best wildlife sightings.",
      "Trout fishing passes are available with prior forest department permission."
    ],
    ragSources: [
      {
        title: "Nilgiris Biosphere Reserve Archive",
        url: "https://nilgiris.nic.in/avalanche-sanctuary",
        snippet: "Formed after a massive natural landslide in 1823; secluded from commercial tourism.",
        sourceType: "Government Archive"
      }
    ]
  },
  {
    id: "place-ooty-2",
    name: "Emerald Lake & High-Altitude Tea Slopes",
    category: "nature_trail",
    description: "A tranquil, quiet mountain lake nestled between high elevation tea estates, famous for mirror-like reflections and serene morning breezes.",
    region: "Ooty / Nilgiris, TN",
    continent: "Asia",
    country: "India",
    coordinates: [11.3325, 76.6214],
    crowdLevel: 12,
    difficulty: "Easy",
    bestTime: "06:30 AM - 09:30 AM (Sunrise)",
    estimatedCost: 0,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    tags: ["Ooty", "Emerald Lake", "Sunrise View", "Nilgiris"],
    localTips: [
      "Best visited at sunrise when golden rays illuminate the misty tea slopes.",
      "The lakeside walk is completely peaceful with almost zero tourist crowds."
    ],
    ragSources: [
      {
        title: "Nilgiri Highland Waters Journal",
        url: "https://explorex.ai/rag/ooty-emerald",
        snippet: "Upper lake basin located 25km south-west of central Ooty town.",
        sourceType: "Travel Journal"
      }
    ]
  },
  {
    id: "place-ooty-3",
    name: "Needle Rock Peak & Gudalur Valley Edge",
    category: "viewpoint",
    description: "A breathtaking conical cliff giving a 360-degree panoramic view over the Mudumalai tiger reserve valley, Kerala borders, and dormant volcano ridges.",
    region: "Ooty / Gudalur, TN",
    continent: "Asia",
    country: "India",
    coordinates: [11.5034, 76.5342],
    crowdLevel: 16,
    difficulty: "Moderate",
    bestTime: "04:30 PM - 06:15 PM (Sunset)",
    estimatedCost: 30,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=800&q=80",
    tags: ["Ooty", "Needle Rock", "Sunset Edge", "Gudalur Valley"],
    localTips: [
      "Carry binoculars to spot elephant corridors in the valley below during twilight.",
      "A 1km uphill cobblestone trail leads to the eagle viewpoint."
    ],
    ragSources: [
      {
        title: "Tamil Nadu Western Ghats Viewpoint Directory",
        url: "https://tamilnadutourism.tn.gov.in/needle-rock",
        snippet: "Known locally as Soochimalai due to its needle-like rock protrusion.",
        sourceType: "Tourism Registry"
      }
    ]
  },
  {
    id: "place-ooty-4",
    name: "Pykara Secret River & Whispering Pine Forest",
    category: "waterfall",
    description: "Secluded natural rapids and tranquil pine forest trails located away from the mainstream boating house.",
    region: "Ooty / Nilgiris, TN",
    continent: "Asia",
    country: "India",
    coordinates: [11.4589, 76.6021],
    crowdLevel: 18,
    difficulty: "Easy",
    bestTime: "08:00 AM - 12:00 PM",
    estimatedCost: 50,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    tags: ["Ooty", "Pykara Falls", "Pine Forest", "Rapids"],
    localTips: [
      "Walk past the main boat jetty for 600m along the pine trail to reach the quiet stream bank."
    ],
    ragSources: [
      {
        title: "Pykara Forest Heritage Register",
        url: "https://explorex.ai/rag/ooty-pykara",
        snippet: "Pykara River is considered sacred by the indigenous Toda community of the Nilgiris.",
        sourceType: "Indigenous Cultural Registry"
      }
    ]
  }
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: "trip-101",
    title: "3-Day Anamalai & Valparai Offbeat Expedition",
    description: "An immersive journey through secret grasslands, hidden rock pools, artisan tea cafes, and cliffside sunset ridges near Coimbatore.",
    region: "Coimbatore / Valparai, TN",
    startDate: "2026-08-14",
    endDate: "2026-08-16",
    durationDays: 3,
    budgetTotal: 10000,
    budgetSpent: 4250,
    currency: "INR",
    transportMode: "Bike/Scooter",
    groupSize: 2,
    travelStyle: "Photography Focus",
    isSaved: true,
    isFavorite: true,
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    createdAt: "2026-07-28",
    days: [
      {
        dayNumber: 1,
        title: "Ascent into Tea Mist & Secret Grasslands",
        dateStr: "Day 1 - Friday",
        dayCost: 3200,
        travelTimeMinutes: 110,
        distanceKm: 65,
        dayHighlights: [
          "40 Hairpin Bends Climb from Pollachi",
          "Early Morning Permit Entry to Grass Hills Reserve",
          "Specialty Cold Brew at Vellamalai Organic Estate"
        ],
        weather: {
          condition: 'Pleasant Mist',
          tempMaxC: 22,
          tempMinC: 15,
          rainProbabilityPercent: 20,
          humidityPercent: 82,
          windSpeedKmh: 14,
          uvIndex: 'Low',
          advice: 'Misty morning with cool mountain breeze. Carry light jacket for early rides.'
        },
        activities: [
          {
            id: "act-1",
            time: "06:30 AM",
            title: "Early Ride & Fuel Check at Pollachi Base",
            description: "Fuel up bike tank, check tire pressures, and obtain forest entry slip.",
            category: "fuel",
            cost: 800,
            durationMinutes: 30,
            isHiddenGem: false,
            locationName: "Pollachi Foot Station"
          },
          {
            id: "act-2",
            time: "07:30 AM",
            title: "Grass Hills Silent Reserve Hike",
            description: "Hike through protected Shola forest paths before mist engulfs the peaks.",
            placeId: "place-1",
            category: "nature_trail",
            cost: 350,
            durationMinutes: 150,
            isHiddenGem: true,
            locationName: "Grass Hills Reserve"
          },
          {
            id: "act-3",
            time: "12:30 PM",
            title: "Artisan Coffee & Light Lunch at Vellamalai Estate",
            description: "Savor local organic cardamom brew & freshly baked banana walnut cake.",
            placeId: "place-4",
            category: "cafe",
            cost: 450,
            durationMinutes: 60,
            isHiddenGem: true,
            locationName: "Vellamalai Organic Estate Cafe"
          },
          {
            id: "act-4",
            time: "04:30 PM",
            title: "Sunset Golden Hour at Nallamudi Ridge",
            description: "Photograph the deep Mudis valley gorges as the sun dips behind the Western Ghats.",
            placeId: "place-3",
            category: "sunset",
            cost: 50,
            durationMinutes: 90,
            isHiddenGem: true,
            locationName: "Nallamudi Poonjolai Ridge"
          },
          {
            id: "act-5",
            time: "07:30 PM",
            title: "Check-in at Heritage Estate Bungalow",
            description: "Cozy stay surrounded by cardamom plantation and bonfire.",
            category: "stay",
            cost: 1550,
            durationMinutes: 60,
            isHiddenGem: false,
            locationName: "Briar Tea Bungalow"
          }
        ]
      },
      {
        dayNumber: 2,
        title: "Bamboo Stream Bath & Deep Hydro Trails",
        dateStr: "Day 2 - Saturday",
        dayCost: 2450,
        travelTimeMinutes: 75,
        distanceKm: 38,
        dayHighlights: [
          "Dip in Kadamparai Secret Hydro Basin",
          "Tribal Village Walk & Homemade South Indian Meals",
          "Macro photography of endemic moss & ferns"
        ],
        weather: {
          condition: 'Partly Cloudy',
          tempMaxC: 24,
          tempMinC: 16,
          rainProbabilityPercent: 15,
          humidityPercent: 74,
          windSpeedKmh: 12,
          uvIndex: 'Moderate',
          advice: 'Comfortable day for bamboo trail trekking and natural rock basin swimming.'
        },
        activities: [
          {
            id: "act-6",
            time: "08:00 AM",
            title: "Local Idli & Vada Breakfast at Valparai Town",
            description: "Steaming hot local breakfast served on banana leaves with freshly ground coconut chutney.",
            category: "meal",
            cost: 150,
            durationMinutes: 45,
            isHiddenGem: false,
            locationName: "Lakshmi Mess"
          },
          {
            id: "act-7",
            time: "09:30 AM",
            title: "Kadamparai Hydro Stream & Rock Bathing",
            description: "Trek through bamboo groves into natural rock basins for a refreshing swim.",
            placeId: "place-2",
            category: "waterfall",
            cost: 0,
            durationMinutes: 180,
            isHiddenGem: true,
            locationName: "Kadamparai Hydro Basin"
          },
          {
            id: "act-8",
            time: "02:00 PM",
            title: "Home-style Village Thali Lunch",
            description: "Authentic local red rice meal prepared by Kadar tribe cooperative.",
            category: "meal",
            cost: 300,
            durationMinutes: 60,
            isHiddenGem: true,
            locationName: "Kadar Eco Kitchen"
          },
          {
            id: "act-9",
            time: "04:00 PM",
            title: "Pambar Sandalwood Forest Border Walk",
            description: "Observe wild elephant crossing tracks and endemic bird calls.",
            placeId: "place-5",
            category: "nature_trail",
            cost: 100,
            durationMinutes: 120,
            isHiddenGem: true,
            locationName: "Pambar River Stream"
          }
        ]
      },
      {
        dayNumber: 3,
        title: "Siruvani Sweet Waters & Descent",
        dateStr: "Day 3 - Sunday",
        dayCost: 1800,
        travelTimeMinutes: 90,
        distanceKm: 52,
        dayHighlights: [
          "Siruvani Reservoir Scenic Overlook",
          "Local Spice Purchase (Fresh Cardamom & Nutmeg)",
          "Smooth return ride back to Coimbatore Junction"
        ],
        weather: {
          condition: 'Clear Sky',
          tempMaxC: 26,
          tempMinC: 17,
          rainProbabilityPercent: 5,
          humidityPercent: 65,
          windSpeedKmh: 10,
          uvIndex: 'Moderate',
          advice: 'Sunny clear skies for reservoir overlook photos. Smooth dry road conditions.'
        },
        activities: [
          {
            id: "act-10",
            time: "08:30 AM",
            title: "Siruvani Ridge Viewpoint Walk",
            description: "Capture morning reflections over the calm Siruvani reservoir.",
            placeId: "place-6",
            category: "viewpoint",
            cost: 120,
            durationMinutes: 90,
            isHiddenGem: true,
            locationName: "Siruvani Overlook"
          },
          {
            id: "act-11",
            time: "01:00 PM",
            title: "Farewell Lunch & Spices Shopping",
            description: "Pick up freshly harvested pepper, cardamom, and tea dust directly from estate outlets.",
            category: "meal",
            cost: 680,
            durationMinutes: 90,
            isHiddenGem: false,
            locationName: "Estate Direct Outlet"
          }
        ]
      }
    ]
  },
  {
    id: "trip-102",
    title: "Chikmagalur Coffee Country & Heritage Arch Trail",
    description: "4-day serene solitude trek among old colonial coffee estates, hidden streams, and misty peaks.",
    region: "Chikmagalur, KA",
    startDate: "2026-09-02",
    endDate: "2026-09-05",
    durationDays: 4,
    budgetTotal: 14000,
    budgetSpent: 0,
    currency: "INR",
    transportMode: "Car",
    groupSize: 4,
    travelStyle: "Balanced",
    isSaved: true,
    isFavorite: false,
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    createdAt: "2026-07-29",
    days: []
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-1",
    tripId: "trip-101",
    category: "fuel",
    title: "Full petrol tank & air check (Pollachi)",
    amount: 800,
    paidBy: "Arjun Verma",
    date: "2026-08-14",
    notes: "Top up before hill climb"
  },
  {
    id: "exp-2",
    tripId: "trip-101",
    category: "activity",
    title: "Grass Hills Permit Fee & Eco Development Fund",
    amount: 350,
    paidBy: "Arjun Verma",
    date: "2026-08-14",
    notes: "Forest department official receipt"
  },
  {
    id: "exp-3",
    tripId: "trip-101",
    category: "food",
    title: "Vellamalai Estate Artisan Coffee & Snacks",
    amount: 450,
    paidBy: "Sneha Patel",
    date: "2026-08-14",
    notes: "Cold brews and banana cake"
  },
  {
    id: "exp-4",
    tripId: "trip-101",
    category: "stay",
    title: "Heritage Tea Bungalow Advance Night 1",
    amount: 1550,
    paidBy: "Arjun Verma",
    date: "2026-08-14",
    notes: "Includes breakfast and morning tea"
  },
  {
    id: "exp-5",
    tripId: "trip-101",
    category: "food",
    title: "Authentic Kadar Tribal Eco Lunch",
    amount: 300,
    paidBy: "Sneha Patel",
    date: "2026-08-15"
  },
  {
    id: "exp-6",
    tripId: "trip-101",
    category: "emergency",
    title: "Puncture repair kit & spare clutch cable",
    amount: 800,
    paidBy: "Arjun Verma",
    date: "2026-08-15",
    notes: "Precautionary backup gear"
  }
];

export const INITIAL_TEAM_WORKSPACE: TeamWorkspace = {
  id: "team-1",
  name: "Western Ghats Nomads",
  code: "HT-NOMAD-8842",
  budgetCap: 25000,
  sharedTripId: "trip-101",
  members: [
    {
      id: "mem-1",
      name: "Arjun Verma",
      email: "arjun@hiddentrail.ai",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "Organizer",
      status: "Active"
    },
    {
      id: "mem-2",
      name: "Sneha Patel",
      email: "sneha.photo@gmail.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      role: "Traveler",
      status: "Active"
    },
    {
      id: "mem-3",
      name: "Kavya Nair",
      email: "kavya.nair@design.co",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
      role: "Editor",
      status: "Active"
    },
    {
      id: "mem-4",
      name: "Rohan Das",
      email: "rohan.d@techlab.io",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      role: "Traveler",
      status: "Pending"
    }
  ],
  tasks: [
    {
      id: "task-1",
      teamId: "team-1",
      title: "Obtain Forest Department Grass Hills Permits at Pollachi",
      assigneeName: "Arjun Verma",
      dueDate: "2026-08-13",
      isCompleted: true,
      category: "Booking"
    },
    {
      id: "task-2",
      teamId: "team-1",
      title: "Pack Camera Lenses (70-200mm for wildlife + 16-35mm for landscapes)",
      assigneeName: "Sneha Patel",
      dueDate: "2026-08-13",
      isCompleted: true,
      category: "Gear"
    },
    {
      id: "task-3",
      teamId: "team-1",
      title: "Download offline Leaflet maps & GPX tracks for Valparai trails",
      assigneeName: "Kavya Nair",
      dueDate: "2026-08-14",
      isCompleted: false,
      category: "Route"
    },
    {
      id: "task-4",
      teamId: "team-1",
      title: "Reserve Eco Lodge Homestay in Valparai Town",
      assigneeName: "Arjun Verma",
      dueDate: "2026-08-12",
      isCompleted: true,
      category: "Booking"
    }
  ],
  votes: [
    {
      placeId: "place-1",
      upvotes: ["Arjun Verma", "Sneha Patel", "Kavya Nair"],
      downvotes: []
    },
    {
      placeId: "place-2",
      upvotes: ["Arjun Verma", "Kavya Nair"],
      downvotes: []
    },
    {
      placeId: "place-3",
      upvotes: ["Sneha Patel", "Arjun Verma"],
      downvotes: []
    }
  ]
};

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: "mem-1",
    tripId: "trip-101",
    tripTitle: "3-Day Anamalai & Valparai Offbeat Expedition",
    date: "August 16, 2026",
    diaryEntry: "Leaving Pollachi at 6:00 AM while the fog still clung to the coconut groves was the best decision we made. By the time we crossed Hairpin Bend 23, the clouds parted to reveal the emerald folds of the Grass Hills. We sat on the ancient stone boundary wall listening to the distant whistle of Malabar Whistling Thrushes, drinking cardamom tea poured from a flask. No loud tourist speakers, no crowded souvenir stalls — just pure, breathing wilderness.",
    blogPost: `# Lost in the Shola: A 3-Day Offbeat Guide to Valparai

When most travelers think of South Indian hill stations, they head straight to the crowded streets of Ooty or Kodaikanal. But nestled deep within the Anamalai Tiger Reserve lies **Valparai** — a quiet haven of rolling tea estates, shola forest corridors, and hidden streams.

## Day 1: The Mist & The Mountains
We started our ascent from Pollachi at dawn. The 40 hairpin bends offer constant panoramic views of the Aliyar dam reservoir below. Our first stop was the protected **Grass Hills Silent Reserve**. With daily visitor passes capped at just 50, walking through these high-altitude grasslands feels like entering a forgotten sanctuary.

## Day 2: Bamboo Glades & Secret Rock Basins
Guided by local Kadar villagers, we trekked along an unpaved foot trail behind Kadamparai power station. Here, a pristine stream cascades into natural granite bowls, completely hidden from the main highway.

> *Tip:* Always carry a reusable flask and respect local plastic-free forest regulations!

## Summary
If you crave quiet photography, untouched nature trails, and authentic tea country warmth, Valparai is calling.`,
    socialCaptions: [
      {
        platform: "Instagram",
        text: "Swapped tourist crowds for emerald grasslands and silent mist trails 🌿 40 hairpin bends, zero noise pollution, and endless cardamom chai. Valparai hits different when you take the hidden trail. ✨",
        hashtags: ["#HiddenTrailAI", "#OffbeatIndia", "#ValparaiDiaries", "#WesternGhats", "#TravelInSilence", "#GrassHills"]
      },
      {
        platform: "X",
        text: "Just wrapped up a 3-day offbeat expedition in Valparai under ₹10,000 using @HiddenTrailAI. 50 visitor cap at Grass Hills means absolute peace. Full GPX route & itinerary down below! 🗺️🚴‍♂️",
        hashtags: ["#OffbeatTravel", "#TravelTech", "#Valparai", "#GenAI"]
      },
      {
        platform: "LinkedIn",
        text: "Reflecting on 3 days of remote work and photography in the Western Ghats. Finding quiet spaces like Valparai reminds me how crucial unplugging and thoughtful, sustainable tourism really is. Highly recommend exploring offbeat destinations with curated AI itineraries.",
        hashtags: ["#SustainableTravel", "#DigitalNomad", "#HiddenTrail", "#Workation"]
      }
    ],
    highlightPhoto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

export const RAG_DOCUMENTS: RagDocument[] = [
  {
    id: "rag-1",
    title: "Anamalai Eco-Tourism & Grass Hills Conservation Protocol",
    source: "Tamil Nadu Forest Department (Eco-Archive 2025)",
    category: "Government Conservation",
    credibilityRating: 9.8,
    url: "https://forests.tn.gov.in/anamalai-protocol",
    excerpt: "Grass Hills National Park limits daily visitors to 50 passes to protect the endemic Nilgiri Tahr and montane Shola grassland soil balance.",
    content: "Grass Hills forms part of the Anamalai Tiger Reserve located at an altitude of 2400 meters. The unique ecosystem comprises high-altitude grasslands interspersed with stunted evergreen Shola forests. To prevent soil erosion and preserve wildlife corridors for Asian Elephants and Nilgiri Tahr, strict entry permits are issued at Pollachi and Valparai range offices between 06:00 and 08:30 AM."
  },
  {
    id: "rag-2",
    title: "Offbeat Waterfalls & Hidden Streams of Valparai Plateau",
    source: "Western Ghats Eco Explorer Field Guide (Vol 14)",
    category: "Curated Travel Guide",
    credibilityRating: 9.4,
    url: "https://westernghatsguide.org/valparai-hidden-streams",
    excerpt: "Beyond Monkey Falls lies Kadamparai and Chinnakallar secret pools, offering uncrowded natural bathing spots surrounded by bamboo forests.",
    content: "While tourist buses halt at Monkey Falls, seasoned travelers continue toward Kadamparai hydro backwaters. A 15-minute trail through bamboo groves opens to crystalline rock basins fed by upper mountain springs. The water is pristine, calm, and free from commercial stalls."
  },
  {
    id: "rag-3",
    title: "Digital Nomad & Freelancer Remote Work Index in Hill Stations",
    source: "Nomad India Field Survey 2026",
    category: "Nomad Community",
    credibilityRating: 9.2,
    url: "https://nomadindia.io/hill-stations-report-2026",
    excerpt: "Valparai and Chikmagalur estates are introducing high-speed satellite Wi-Fi in organic tea/coffee cafes, catering to quiet workations.",
    content: "Freelancers and content creators seeking escape from noisy metros are shifting toward plantation workations. Places like Vellamalai Organic Estate in Valparai provide stable 100Mbps satellite connections, power backups, and silent open-air seating overlooking tea valleys."
  },
  {
    id: "rag-4",
    title: "Budget Offbeat Travel Strategy: Coimbatore to Valparai Circuit",
    source: "Backpacker India Forum Archives",
    category: "Community Wisdom",
    credibilityRating: 9.0,
    url: "https://backpackerindia.com/coimbatore-valparai-budget",
    excerpt: "Renting a scooter in Pollachi and staying at local estate homestays cuts trip costs by 60% compared to luxury Ooty resorts.",
    content: "A 3-day trip near Coimbatore can easily be completed under ₹10,000 for two people. Renting a 125cc scooter costs ₹600/day, fuel for 150km costs around ₹800, and authentic Kadar tribal mess meals cost under ₹150 per thali. Experience quality matches premium luxury tours at a fraction of the cost."
  }
];
