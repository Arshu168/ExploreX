import { describe, it, expect } from 'vitest';
import { checkPasswordStrength } from './passwordUtils';

describe('passwordUtils - checkPasswordStrength', () => {
  it('should flag empty password as Too Weak with score 0', () => {
    const result = checkPasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.strengthLabel).toBe('Too Weak');
    expect(result.isStrong).toBe(false);
    expect(result.missingRequirements).toHaveLength(5);
  });

  it('should identify weak password missing upper, number, and special chars', () => {
    const result = checkPasswordStrength('explore');
    expect(result.isStrong).toBe(false);
    expect(result.requirements.find(r => r.id === 'length')?.met).toBe(false);
    expect(result.requirements.find(r => r.id === 'lower')?.met).toBe(true);
  });

  it('should validate strong password meeting all 5 requirements', () => {
    const result = checkPasswordStrength('ExploreX@2026!');
    expect(result.score).toBe(4);
    expect(result.strengthLabel).toBe('Very Strong');
    expect(result.isStrong).toBe(true);
    expect(result.missingRequirements).toHaveLength(0);
  });

  it('should accurately calculate medium score when 3 criteria are met', () => {
    // Length >= 8, lower, upper, but no number or special
    const result = checkPasswordStrength('ExploreWorld');
    expect(result.score).toBe(2);
    expect(result.strengthLabel).toBe('Medium');
    expect(result.isStrong).toBe(false);
  });
});
