export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateFromINR: number; // 1 INR = X foreign currency
}

export const CURRENCY_MAP: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateFromINR: 1 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rateFromINR: 0.012 }, // 1 USD = ~83.3 INR
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rateFromINR: 0.011 }, // 1 EUR = ~91 INR
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rateFromINR: 0.0094 }, // 1 GBP = ~106 INR
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateFromINR: 1.80 }, // 1 INR = 1.80 JPY
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateFromINR: 0.016 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateFromINR: 0.018 }
};

export function getCurrencyConfig(currencyCode?: string): CurrencyConfig {
  const code = (currencyCode || 'INR').toUpperCase() as CurrencyCode;
  return CURRENCY_MAP[code] || CURRENCY_MAP.INR;
}

export function formatCurrency(
  amountInINR: number,
  currencyCode?: string
): string {
  const config = getCurrencyConfig(currencyCode);
  const converted = (amountInINR || 0) * config.rateFromINR;

  if (config.code === 'JPY') {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }
  if (config.code === 'INR') {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  // USD, EUR, GBP, CAD, AUD
  const isWhole = converted % 1 === 0;
  return `${config.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2
  })}`;
}
