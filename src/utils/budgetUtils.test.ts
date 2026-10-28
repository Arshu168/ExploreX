import { describe, it, expect } from 'vitest';
import { getBudgetBoundsForDestination } from './budgetUtils';

describe('budgetUtils - getBudgetBoundsForDestination', () => {
  it('should return luxury tier budget for international destinations like Amalfi or Paris', () => {
    const result = getBudgetBoundsForDestination('Amalfi Coast', 4, 2);

    expect(result.tier).toBe('Luxury');
    expect(result.costPerDayEstimate).toBe(12000);
    // 12000 * 4 days * 2 people = 96,000 suggested
    expect(result.suggestedBudget).toBe(96000);
    expect(result.minBudget).toBe(Math.round(12000 * 0.6 * 4 * 2));
    expect(result.maxSuggestedBudget).toBe(Math.round(12000 * 3.5 * 4 * 2));
    expect(result.advice).toContain('international flights');
  });

  it('should return moderate tier budget for popular coastal hubs like Goa', () => {
    const result = getBudgetBoundsForDestination('Goa, India', 3, 2);

    expect(result.tier).toBe('Moderate');
    expect(result.costPerDayEstimate).toBe(3500);
    // 3500 * 3 days * 2 people = 21,000
    expect(result.suggestedBudget).toBe(21000);
    expect(result.minBudget).toBe(Math.round(3500 * 0.5 * 3 * 2));
    expect(result.advice).toContain('beach resort');
  });

  it('should return budget tier for hill stations like Valparai or Ooty', () => {
    const result = getBudgetBoundsForDestination('Valparai', 2, 2);

    expect(result.tier).toBe('Budget');
    expect(result.costPerDayEstimate).toBe(2200);
    expect(result.suggestedBudget).toBe(8800);
    expect(result.advice).toContain('tea estate bungalow');
  });

  it('should fallback to default regional forecast for unknown destinations', () => {
    const result = getBudgetBoundsForDestination('Somewhere Remote', 5, 1);

    expect(result.tier).toBe('Budget');
    expect(result.costPerDayEstimate).toBe(2000);
    expect(result.suggestedBudget).toBe(10000);
  });

  it('should gracefully handle zero or negative days and group sizes by enforcing minimums', () => {
    const result = getBudgetBoundsForDestination('Goa', 0, -2);

    // durationDays clamped to Math.max(1, 0) = 1, groupSize to Math.max(1, -2) = 1
    expect(result.suggestedBudget).toBe(3500 * 1 * 1);
  });
});
