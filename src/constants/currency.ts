export interface CurrencyOption {
  code: string;
  symbol: string;
  decimals: number;
  label: string;
}

export const currencyOptions: CurrencyOption[] = [
  { code: 'USD', symbol: '$', decimals: 2, label: 'US Dollar' },
  { code: 'BDT', symbol: 'Tk', decimals: 2, label: 'Bangladeshi Taka' },
  { code: 'EUR', symbol: 'EUR', decimals: 2, label: 'Euro' },
  { code: 'GBP', symbol: 'GBP', decimals: 2, label: 'British Pound' },
  { code: 'JPY', symbol: 'JPY', decimals: 0, label: 'Japanese Yen' },
];

export const defaultCurrency = currencyOptions[0];
