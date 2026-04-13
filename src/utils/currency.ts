import { defaultCurrency } from '@/src/constants/currency';

export interface CurrencySettings {
  currencyCode?: string;
  currencySymbol?: string;
  decimalPlaces?: number;
}

export const formatCurrency = (
  amount: number,
  settings?: CurrencySettings,
  options?: { showSign?: boolean }
) => {
  const symbol = settings?.currencySymbol ?? defaultCurrency.symbol;
  const decimals = settings?.decimalPlaces ?? defaultCurrency.decimals;
  const absolute = Math.abs(amount).toFixed(decimals);
  const sign = amount < 0 ? '-' : options?.showSign && amount > 0 ? '+' : '';
  return `${sign}${symbol}${absolute}`;
};
