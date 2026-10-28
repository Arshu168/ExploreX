import { describe, it, expect } from 'vitest';
import { getCurrencyConfig, formatCurrency, CURRENCY_MAP } from './currencyUtils';

describe('currencyUtils', () => {
  describe('getCurrencyConfig', () => {
    it('should return INR config by default if undefined or invalid currency provided', () => {
      const defaultConfig = getCurrencyConfig();
      expect(defaultConfig.code).toBe('INR');
      expect(defaultConfig.symbol).toBe('₹');

      const invalidConfig = getCurrencyConfig('XYZ');
      expect(invalidConfig.code).toBe('INR');
    });

    it('should return correct config for valid currency code regardless of casing', () => {
      const usdConfig = getCurrencyConfig('usd');
      expect(usdConfig.code).toBe('USD');
      expect(usdConfig.symbol).toBe('$');

      const eurConfig = getCurrencyConfig('EUR');
      expect(eurConfig.code).toBe('EUR');
      expect(eurConfig.symbol).toBe('€');
    });
  });

  describe('formatCurrency', () => {
    it('should format INR amounts with rupee symbol and whole numbers without decimal places', () => {
      expect(formatCurrency(5000, 'INR')).toBe('₹5,000');
      expect(formatCurrency(0, 'INR')).toBe('₹0');
    });

    it('should format USD accurately using exchange rate', () => {
      // 1000 INR * 0.012 = $12
      expect(formatCurrency(1000, 'USD')).toBe('$12');
    });

    it('should format JPY rounded to whole yen', () => {
      // 1000 INR * 1.80 = 1,800 JPY
      expect(formatCurrency(1000, 'JPY')).toBe('¥1,800');
    });

    it('should handle decimal formatting for USD/EUR when needed', () => {
      // 1550 INR * 0.012 = 18.6 USD
      const formatted = formatCurrency(1550, 'USD');
      expect(formatted).toBe('$18.60');
    });
  });
});
