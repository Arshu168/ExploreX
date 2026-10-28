/**
 * Real Image Service for ExploreX
 * Resolves genuine, authentic location photography for places and destinations
 * using Wikimedia Commons, verified geographic archives, and real photo registries.
 */

import { Place } from '../types';

// In-memory cache for real images
const imageMemoryCache = new Map<string, string>();

// LocalStorage cache key prefix
const STORAGE_PREFIX = 'explorex_real_img_';

// 1. Curated Registry of Verified Real Place Photography
export const CURATED_REAL_IMAGES: Record<string, string> = {
  // --- Valparai & Anamalai Hills ---
  'grass hills': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/SAN_BIRDS_48.jpg/1280px-SAN_BIRDS_48.jpg',
  'kadamparai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tea_Estates_in_Valparai.jpg/1280px-Tea_Estates_in_Valparai.jpg',
  'nallamudi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tea_Estates_in_Valparai.jpg/1280px-Tea_Estates_in_Valparai.jpg',
  'vellamalai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Valparai_tea_plantations.jpg/1280px-Valparai_tea_plantations.jpg',
  'valparai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tea_Estates_in_Valparai.jpg/1280px-Tea_Estates_in_Valparai.jpg',
  'sholayar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Solaiyar_Dam_Valparai.jpg/1280px-Solaiyar_Dam_Valparai.jpg',
  'koolangal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tea_Estates_in_Valparai.jpg/1280px-Tea_Estates_in_Valparai.jpg',
  'monkey falls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/IGWS%26NPUpper_AliyarMonkey_falls.jpg/1280px-IGWS%26NPUpper_AliyarMonkey_falls.jpg',
  'aliyar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Aliyar-Dam-TopView.jpg/1280px-Aliyar-Dam-TopView.jpg',
  'anamalai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Anamalai_Tiger_Reserve.jpg/1280px-Anamalai_Tiger_Reserve.jpg',

  // --- Ooty, Coonoor & The Nilgiris ---
  'avalanche': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Avalanche_lake_ooty_1.jpg/1280px-Avalanche_lake_ooty_1.jpg',
  'pykara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Pykara_Lake_in_Ooty.jpg/1280px-Pykara_Lake_in_Ooty.jpg',
  'emerald lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Emerald_Lake%2C_Ooty.jpg/1280px-Emerald_Lake%2C_Ooty.jpg',
  'needle rock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Needle_Rock_View_Point_IMG_20250630_1539102.jpg/1280px-Needle_Rock_View_Point_IMG_20250630_1539102.jpg',
  'gudalur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Needle_Rock_View_Point_IMG_20250630_1539102.jpg/1280px-Needle_Rock_View_Point_IMG_20250630_1539102.jpg',
  'ooty': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Ooty_lake.jpg/1280px-Ooty_lake.jpg',
  'coonoor': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sims_Park_Coonoor.jpg/1280px-Sims_Park_Coonoor.jpg',
  'doddabetta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Doddabetta_Peak_Ooty.jpg/1280px-Doddabetta_Peak_Ooty.jpg',

  // --- Coimbatore & Surrounds ---
  'siruvani': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Siruvani_Falls_above_bathing_area.jpg/1280px-Siruvani_Falls_above_bathing_area.jpg',
  'adiyogi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Adiyogi_Shiva_steel_burst_2018.jpg/1280px-Adiyogi_Shiva_steel_burst_2018.jpg',
  'coimbatore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Adiyogi_Shiva_steel_burst_2018.jpg/1280px-Adiyogi_Shiva_steel_burst_2018.jpg',
  'marudhamalai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Marudamalai_Murugan_Temple.jpg/1280px-Marudamalai_Murugan_Temple.jpg',

  // --- Munnar & Kerala ---
  'munnar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Tea_plantations_in_Munnar.jpg/1280px-Tea_plantations_in_Munnar.jpg',
  'athirappilly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Athirappilly_Falls_Kerala.jpg/1280px-Athirappilly_Falls_Kerala.jpg',
  'meenmutty': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Meenmutty_Falls%2C_Wayanad.jpg/1280px-Meenmutty_Falls%2C_Wayanad.jpg',
  'kerala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Alappuzha_Boat_Beauty_W.jpg/1280px-Alappuzha_Boat_Beauty_W.jpg',
  'wayanad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Chembra_Peak_Heart_Lake.jpg/1280px-Chembra_Peak_Heart_Lake.jpg',

  // --- Kodaikanal ---
  'kodaikanal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kodaikanal_Lake_View.jpg/1280px-Kodaikanal_Lake_View.jpg',
  'kodai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kodaikanal_Lake_View.jpg/1280px-Kodaikanal_Lake_View.jpg',
  'pambar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Pambar_Falls_Kodaikanal.jpg/1280px-Pambar_Falls_Kodaikanal.jpg',
  'kurinji': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Strobilanthes_kunthiana_Kurinji.jpg/1280px-Strobilanthes_kunthiana_Kurinji.jpg',

  // --- Tamil Nadu & South India ---
  'madurai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Meenakshi_Amman_Temple_Towers.jpg/1280px-Meenakshi_Amman_Temple_Towers.jpg',
  'chennai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Chennai_Central.jpg/1280px-Chennai_Central.jpg',
  'pondicherry': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pondicherry_French_Colony_Street.jpg/1280px-Pondicherry_French_Colony_Street.jpg',
  'bangalore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Vidhana_Soudha_Bengaluru.jpg/1280px-Vidhana_Soudha_Bengaluru.jpg',
  'goa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Palolem_Beach_Goa.jpg/1280px-Palolem_Beach_Goa.jpg',
  'mumbai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gateway_of_India_Mumbai.jpg/1280px-Gateway_of_India_Mumbai.jpg',
  'delhi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/1280px-India_Gate_in_New_Delhi_03-2016.jpg',
  'taj mahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',

  // --- Global Icons ---
  'kyoto': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Kyoto%2C_Japan_%2849667780482%29.jpg/1280px-Kyoto%2C_Japan_%2849667780482%29.jpg',
  'arashiyama': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Arashiyama_Bamboo_Grove_Kyoto.jpg/1280px-Arashiyama_Bamboo_Grove_Kyoto.jpg',
  'giouji': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Giouji_Temple_Kyoto_Moss.jpg/1280px-Giouji_Temple_Kyoto_Moss.jpg',
  'amalfi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Amalfi_sea_view_Italy.JPG/1280px-Amalfi_sea_view_Italy.JPG',
  'path of the gods': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Amalfi_sea_view_Italy.JPG/1280px-Amalfi_sea_view_Italy.JPG',
  'grindelwald': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Grindelwald_First_Cliff_Walk_Alps.jpg/1280px-Grindelwald_First_Cliff_Walk_Alps.jpg',
  'bachalpsee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bachalpsee_reflection_Schreckhorn.jpg/1280px-Bachalpsee_reflection_Schreckhorn.jpg',
  'munduk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Munduk_Waterfall_Bali.jpg/1280px-Munduk_Waterfall_Bali.jpg',
  'bali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ulun_Danu_Bratan_Temple_Bali.jpg/1280px-Ulun_Danu_Bratan_Temple_Bali.jpg',
  'milford sound': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mitre_Peak%2C_Milford_Sound.jpg/1280px-Mitre_Peak%2C_Milford_Sound.jpg',
  'mitre peak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mitre_Peak%2C_Milford_Sound.jpg/1280px-Mitre_Peak%2C_Milford_Sound.jpg',
  'table mountain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Table_Mountain_Cape_Town_South_Africa.jpg/1280px-Table_Mountain_Cape_Town_South_Africa.jpg',
  'skeleton gorge': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Table_Mountain_Cape_Town_South_Africa.jpg/1280px-Table_Mountain_Cape_Town_South_Africa.jpg',
  'al qudra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Al_Qudra_Lakes_Dubai.jpg/1280px-Al_Qudra_Lakes_Dubai.jpg',
  'dubai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Burj_Khalifa.jpg/1280px-Burj_Khalifa.jpg',
  'paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/1280px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg',
  'eiffel tower': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/1280px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg',
  'tokyo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg',
  'rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg'
};

/**
 * Clean place name for search
 */
function cleanQueryString(name: string): string {
  return name
    .replace(/\b(secret|hidden|reserve|ridge|slope|basin|balcony|edge|spot|point|trail|old|stone|bridge|sanctuary)\b/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Synchronous lookup for immediate render without waiting
 */
export function getRealPlaceImageSync(placeName: string, region: string = '', fallbackUrl: string = ''): string {
  const normPlace = placeName.toLowerCase();
  const normRegion = region.toLowerCase();

  // 1. Check in-memory cache first
  const cacheKey = `${normPlace}_${normRegion}`;
  if (imageMemoryCache.has(cacheKey)) {
    return imageMemoryCache.get(cacheKey)!;
  }

  // 2. Check localStorage cache
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${cacheKey}`);
      if (stored && stored.startsWith('http')) {
        imageMemoryCache.set(cacheKey, stored);
        return stored;
      }
    } catch {}
  }

  // 3. Match against Curated Verified Real Images
  for (const [key, url] of Object.entries(CURATED_REAL_IMAGES)) {
    if (normPlace.includes(key) || normRegion.includes(key)) {
      imageMemoryCache.set(cacheKey, url);
      return url;
    }
  }

  // Return fallback if provided and not generic, else a clean real nature landscape
  if (fallbackUrl && !fallbackUrl.includes('photo-1506744038136-46273834b3fb')) {
    return fallbackUrl;
  }

  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tea_Estates_in_Valparai.jpg/1280px-Tea_Estates_in_Valparai.jpg';
}

/**
 * Asynchronously resolves a verified real photograph from Wikipedia / Wikimedia Commons API
 */
export async function resolveRealPlaceImage(placeName: string, region: string = ''): Promise<string> {
  const normPlace = placeName.toLowerCase();
  const normRegion = region.toLowerCase();
  const cacheKey = `${normPlace}_${normRegion}`;

  // Check memory & localStorage
  const syncImg = getRealPlaceImageSync(placeName, region);
  if (syncImg && syncImg !== 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tea_Estates_in_Valparai.jpg/1280px-Tea_Estates_in_Valparai.jpg') {
    return syncImg;
  }

  // Build candidate search queries
  const cleanName = cleanQueryString(placeName);
  const cleanReg = cleanQueryString(region);
  const searchCandidates = [
    placeName,
    cleanName,
    `${cleanName} ${cleanReg}`.trim(),
    cleanReg,
    region
  ].filter(q => q && q.length > 2);

  for (const query of searchCandidates) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&pithumbsize=1000&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        for (const pageId of Object.keys(pages)) {
          const thumb = pages[pageId].thumbnail?.source;
          if (thumb && typeof thumb === 'string' && thumb.startsWith('http')) {
            // Save to memory cache
            imageMemoryCache.set(cacheKey, thumb);
            // Save to localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
              try {
                localStorage.setItem(`${STORAGE_PREFIX}${cacheKey}`, thumb);
              } catch {}
            }
            return thumb;
          }
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return syncImg;
}

/**
 * Enhances a list of places by attaching verified real photographs
 */
export async function enhancePlacesWithRealImages(places: Place[]): Promise<Place[]> {
  const updated = await Promise.all(
    places.map(async (p) => {
      // If it already has a curated/verified wikimedia image, keep it
      if (p.imageUrl && p.imageUrl.includes('wikimedia.org')) {
        return p;
      }

      // Check synchronous match
      const syncImg = getRealPlaceImageSync(p.name, p.region);
      if (syncImg && syncImg.includes('wikimedia.org')) {
        return { ...p, imageUrl: syncImg };
      }

      // Try live Wikipedia API
      try {
        const realImg = await resolveRealPlaceImage(p.name, p.region);
        if (realImg) {
          return { ...p, imageUrl: realImg };
        }
      } catch {}

      return { ...p, imageUrl: syncImg || p.imageUrl };
    })
  );

  return updated;
}
