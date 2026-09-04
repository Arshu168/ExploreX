import { WeatherForecast } from '../types';

/**
 * Returns realistic, client-side weather forecast for a given trip destination and day number.
 */
export function getWeatherForDestinationDay(destination: string, dayNumber: number): WeatherForecast {
  const destLower = destination.toLowerCase();

  // Hill stations / Western Ghats (Coimbatore, Valparai, Ooty, Munnar, Kodai, Chikmagalur)
  if (
    destLower.includes('valparai') || 
    destLower.includes('coimbatore') || 
    destLower.includes('ooty') || 
    destLower.includes('munnar') || 
    destLower.includes('kodai') || 
    destLower.includes('chikmagalur') ||
    destLower.includes('wayanad') ||
    destLower.includes('anamalai')
  ) {
    const conditions: WeatherForecast['condition'][] = [
      'Pleasant Mist',
      'Partly Cloudy',
      'Foggy Morning',
      'Light Showers',
      'Clear Sky'
    ];
    const cond = conditions[(dayNumber - 1) % conditions.length];

    const tempMax = 22 + (dayNumber % 3);
    const tempMin = 14 + (dayNumber % 2);
    const rainProb = cond === 'Light Showers' ? 45 : cond === 'Pleasant Mist' ? 25 : 10;
    const humidity = cond === 'Foggy Morning' || cond === 'Pleasant Mist' ? 82 : 68;

    let advice = 'Pleasant cool mountain weather. Ideal for trail trekking and photography.';
    if (cond === 'Foggy Morning') {
      advice = 'Dense morning mist till 8:30 AM. Great soft light for coffee & tea estate photos.';
    } else if (cond === 'Light Showers') {
      advice = 'Passing mountain drizzle expected around 2 PM. Keep a light raincoat in your daypack.';
    } else if (cond === 'Pleasant Mist') {
      advice = 'Crisp, cool mountain breeze. Carry a light jacket or windcheater for early morning rides.';
    } else if (cond === 'Clear Sky') {
      advice = 'Unobstructed valley visibility and golden hour sunshine. Perfect for viewpoint vistas.';
    }

    return {
      condition: cond,
      tempMaxC: tempMax,
      tempMinC: tempMin,
      rainProbabilityPercent: rainProb,
      humidityPercent: humidity,
      windSpeedKmh: 12 + (dayNumber * 2),
      uvIndex: tempMax > 24 ? 'Moderate' : 'Low',
      advice
    };
  }

  // Coastal / Beach / Warm destinations (e.g. Goa, Amalfi, Pondicherry)
  if (destLower.includes('goa') || destLower.includes('amalfi') || destLower.includes('pondicherry') || destLower.includes('kerala')) {
    const conditions: WeatherForecast['condition'][] = ['Sunny', 'Clear Sky', 'Partly Cloudy'];
    const cond = conditions[(dayNumber - 1) % conditions.length];

    return {
      condition: cond,
      tempMaxC: 29 + (dayNumber % 2),
      tempMinC: 22 + (dayNumber % 2),
      rainProbabilityPercent: cond === 'Partly Cloudy' ? 15 : 5,
      humidityPercent: 72,
      windSpeedKmh: 18,
      uvIndex: 'High',
      advice: 'Warm sunny weather. Wear UV sunscreen, sunglasses, and carry hydration.'
    };
  }

  // Default General Forecast
  const defaultConditions: WeatherForecast['condition'][] = ['Clear Sky', 'Partly Cloudy', 'Sunny', 'Pleasant Mist'];
  const cond = defaultConditions[(dayNumber - 1) % defaultConditions.length];

  return {
    condition: cond,
    tempMaxC: 25 + (dayNumber % 3),
    tempMinC: 17 + (dayNumber % 2),
    rainProbabilityPercent: 15,
    humidityPercent: 62,
    windSpeedKmh: 10 + dayNumber,
    uvIndex: 'Moderate',
    advice: 'Favorable travel conditions throughout the day. Light jacket recommended for evening.'
  };
}

/**
 * Returns icon configuration and color scheme for weather condition
 */
export function getWeatherTheme(condition: WeatherForecast['condition']) {
  switch (condition) {
    case 'Sunny':
    case 'Clear Sky':
      return {
        bg: 'bg-amber-50/90 border-amber-200/80 text-amber-900',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        iconColor: 'text-amber-500',
        iconName: 'Sun'
      };
    case 'Pleasant Mist':
    case 'Foggy Morning':
      return {
        bg: 'bg-cyan-50/90 border-cyan-200/80 text-cyan-950',
        badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
        iconColor: 'text-cyan-600',
        iconName: 'CloudFog'
      };
    case 'Light Showers':
    case 'Thunderstorms':
      return {
        bg: 'bg-blue-50/90 border-blue-200/80 text-blue-950',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
        iconColor: 'text-blue-600',
        iconName: 'CloudRain'
      };
    case 'Partly Cloudy':
    default:
      return {
        bg: 'bg-slate-50/90 border-slate-200/80 text-slate-900',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
        iconColor: 'text-slate-500',
        iconName: 'CloudSun'
      };
  }
}
