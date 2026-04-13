import type { AccountType } from '@/src/types/common';

export const accountTypeOptions: { label: string; value: AccountType }[] = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank', value: 'bank' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Savings', value: 'savings' },
  { label: 'Credit', value: 'credit' },
];

export const accountTypeIcons: Record<AccountType, string> = {
  cash: 'cash-outline',
  bank: 'card-outline',
  wallet: 'wallet-outline',
  savings: 'shield-checkmark-outline',
  credit: 'wallet-outline',
};
