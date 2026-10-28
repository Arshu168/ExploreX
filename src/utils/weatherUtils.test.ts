import { describe, it, expect } from 'vitest';
import { getWeatherForDestinationDay, getWeatherTheme } from './weatherUtils';

describe('weatherUtils', () => {
  describe('getWeatherForDestinationDay', () => {
    it('should generate cool mountain weather for hill stations like Valparai', () => {
      const weather = getWeatherForDestinationDay('Valparai', 1);

      expect(weather.tempMaxC).toBeLessThanOrEqual(25);
      expect(weather.tempMinC).toBeGreaterThanOrEqual(14);
      expect(weather.advice).toBeDefined();
      expect(['Pleasant Mist', 'Partly Cloudy', 'Foggy Morning', 'Light Showers', 'Clear Sky']).toContain(weather.condition);
    });

    it('should generate warm coastal forecast for beach destinations like Goa', () => {
      const weather = getWeatherForDestinationDay('Goa', 1);

      expect(weather.tempMaxC).toBeGreaterThanOrEqual(28);
      expect(weather.uvIndex).toBe('High');
      expect(weather.advice).toContain('sunscreen');
    });

    it('should generate standard fallback forecast for unknown destinations', () => {
      const weather = getWeatherForDestinationDay('Unknown Place', 2);

      expect(weather.tempMaxC).toBeDefined();
      expect(weather.tempMinC).toBeDefined();
      expect(weather.humidityPercent).toBe(62);
    });
  });

  describe('getWeatherTheme', () => {
    it('should return sunny theme with Sun icon for Sunny or Clear Sky conditions', () => {
      const theme = getWeatherTheme('Sunny');
      expect(theme.iconName).toBe('Sun');
      expect(theme.iconColor).toContain('amber');

      const clearTheme = getWeatherTheme('Clear Sky');
      expect(clearTheme.iconName).toBe('Sun');
    });

    it('should return cloud rain theme for Light Showers', () => {
      const theme = getWeatherTheme('Light Showers');
      expect(theme.iconName).toBe('CloudRain');
      expect(theme.iconColor).toContain('blue');
    });

    it('should return cloud fog theme for Pleasant Mist or Foggy Morning', () => {
      const theme = getWeatherTheme('Pleasant Mist');
      expect(theme.iconName).toBe('CloudFog');
      expect(theme.iconColor).toContain('cyan');
    });
  });
});
