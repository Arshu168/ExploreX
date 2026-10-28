import { describe, it, expect } from 'vitest';
import { generateTripFromDetails } from './tripGenerator';

describe('tripGenerator - generateTripFromDetails', () => {
  it('should generate a structured Trip object with valid days and budget allocation', () => {
    const trip = generateTripFromDetails({
      destination: 'Valparai',
      budget: 15000,
      durationDays: 3,
      travelStyle: 'Balanced',
      interests: ['Nature', 'Waterfalls'],
      transportMode: 'Car',
      originLocation: 'Coimbatore',
      startDate: '2026-11-01'
    });

    expect(trip.id).toBeDefined();
    expect(trip.title).toContain('Valparai');
    expect(trip.region).toBe('Valparai');
    expect(trip.originLocation).toBe('Coimbatore');
    expect(trip.durationDays).toBe(3);
    expect(trip.budgetTotal).toBe(15000);
    expect(trip.transportMode).toBe('Car');
    expect(trip.days).toHaveLength(3);
    expect(trip.recommendedHotels).toBeDefined();
    expect(trip.flightExpense).toBeDefined();
  });

  it('should clamp duration between 1 and 10 days', () => {
    const tripTooShort = generateTripFromDetails({
      destination: 'Goa',
      budget: 8000,
      durationDays: 0,
      travelStyle: 'Backpacker',
      interests: [],
      transportMode: 'Bike'
    });
    expect(tripTooShort.durationDays).toBe(1);

    const tripTooLong = generateTripFromDetails({
      destination: 'Goa',
      budget: 50000,
      durationDays: 25,
      travelStyle: 'Comfort',
      interests: [],
      transportMode: 'Car'
    });
    expect(tripTooLong.durationDays).toBe(10);
  });

  it('should parse transport modes and travel styles correctly', () => {
    const trip = generateTripFromDetails({
      destination: 'Chennai',
      budget: 12000,
      durationDays: 2,
      travelStyle: 'Photography Focus',
      interests: ['Architecture'],
      transportMode: 'Bus/Train'
    });

    expect(trip.transportMode).toBe('Bus/Train');
    expect(trip.travelStyle).toBe('Photography Focus');
  });
});
