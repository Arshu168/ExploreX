export interface DestinationBudgetBounds {
  destination: string;
  minBudget: number;
  suggestedBudget: number;
  maxSuggestedBudget: number;
  costPerDayEstimate: number;
  tier: 'Budget' | 'Moderate' | 'Luxury';
  advice: string;
}

/**
 * Calculates realistic minimum, suggested, and maximum budgets based on destination,
 * trip duration, and group size (all calculated client-side).
 */
export function getBudgetBoundsForDestination(
  destination: string,
  durationDays: number = 3,
  groupSize: number = 2
): DestinationBudgetBounds {
  const destLower = (destination || '').toLowerCase().trim();
  const days = Math.max(1, durationDays);
  const people = Math.max(1, groupSize);

  // International / High-cost destinations
  if (
    destLower.includes('amalfi') ||
    destLower.includes('kyoto') ||
    destLower.includes('paris') ||
    destLower.includes('tokyo') ||
    destLower.includes('switzerland') ||
    destLower.includes('london')
  ) {
    const dailyPerPerson = 12000;
    const minBudget = Math.round(dailyPerPerson * 0.6 * days * people);
    const suggestedBudget = Math.round(dailyPerPerson * days * people);
    const maxSuggestedBudget = Math.round(dailyPerPerson * 3.5 * days * people);

    return {
      destination: destination || 'International Destination',
      minBudget,
      suggestedBudget,
      maxSuggestedBudget,
      costPerDayEstimate: dailyPerPerson,
      tier: 'Luxury',
      advice: 'Includes international flights, premium cliffside stays, and fine dining allowances.'
    };
  }

  // Popular Indian Coastal / Tourist hubs (Goa, Kerala, Pondicherry, Ladakh)
  if (
    destLower.includes('goa') ||
    destLower.includes('kerala') ||
    destLower.includes('pondicherry') ||
    destLower.includes('ladakh') ||
    destLower.includes('andaman') ||
    destLower.includes('manali')
  ) {
    const dailyPerPerson = 3500;
    const minBudget = Math.round(dailyPerPerson * 0.5 * days * people);
    const suggestedBudget = Math.round(dailyPerPerson * days * people);
    const maxSuggestedBudget = Math.round(dailyPerPerson * 2.5 * days * people);

    return {
      destination: destination || 'Coastal / Tourist Destination',
      minBudget,
      suggestedBudget,
      maxSuggestedBudget,
      costPerDayEstimate: dailyPerPerson,
      tier: 'Moderate',
      advice: 'Covers beach resort stays, local seafood/cafes, bike rentals, and water sports.'
    };
  }

  // Hill Stations & Western Ghats (Coimbatore, Valparai, Ooty, Munnar, Kodai, Wayanad, Chikmagalur)
  if (
    destLower.includes('valparai') ||
    destLower.includes('coimbatore') ||
    destLower.includes('ooty') ||
    destLower.includes('munnar') ||
    destLower.includes('kodai') ||
    destLower.includes('chikmagalur') ||
    destLower.includes('wayanad') ||
    destLower.includes('coorg') ||
    destLower.includes('anamalai')
  ) {
    const dailyPerPerson = 2200;
    const minBudget = Math.round(dailyPerPerson * 0.5 * days * people);
    const suggestedBudget = Math.round(dailyPerPerson * days * people);
    const maxSuggestedBudget = Math.round(dailyPerPerson * 2.2 * days * people);

    return {
      destination: destination || 'Coimbatore & Valparai Hill Circuit',
      minBudget,
      suggestedBudget,
      maxSuggestedBudget,
      costPerDayEstimate: dailyPerPerson,
      tier: 'Budget',
      advice: 'Covers scenic hill drive fuel, tea estate bungalow stays, permits, and organic South Indian meals.'
    };
  }

  // Default regional circuit forecast
  const dailyPerPerson = 2000;
  const minBudget = Math.round(dailyPerPerson * 0.5 * days * people);
  const suggestedBudget = Math.round(dailyPerPerson * days * people);
  const maxSuggestedBudget = Math.round(dailyPerPerson * 2.5 * days * people);

  return {
    destination: destination || 'Offbeat Regional Destination',
    minBudget,
    suggestedBudget,
    maxSuggestedBudget,
    costPerDayEstimate: dailyPerPerson,
    tier: 'Budget',
    advice: 'Tailored for offbeat local exploration, homestays, vehicle fuel, and hidden trail entries.'
  };
}
