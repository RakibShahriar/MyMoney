import { z } from 'zod';

export const accountInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Account name is too short'),
  type: z.enum(['cash', 'bank', 'wallet', 'savings', 'credit']),
  initial_balance: z.coerce.number().finite(),
  icon: z.string().trim().min(1, 'Icon is required'),
});

export const categoryInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Category name is too short'),
  type: z.enum(['income', 'expense']),
  icon: z.string().trim().min(1, 'Icon is required'),
  color: z.string().trim().min(4, 'Color is required'),
});

export const transactionInputSchema = z.object({
  id: z.string().optional(),
  account_id: z.string().trim().min(1, 'Account is required'),
  category_id: z.string().trim().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  note: z.string().trim().optional(),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD date format'),
});

export const budgetInputSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().trim().min(1, 'Category is required'),
  amount: z.coerce.number().positive('Budget must be greater than zero'),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export const settingsInputSchema = z.object({
  currency_code: z.string().trim().min(1),
  currency_symbol: z.string().trim().min(1),
  decimal_places: z.coerce.number().int().min(0).max(4),
  theme_mode: z.enum(['light', 'dark', 'system']),
  lock_enabled: z.union([z.boolean(), z.number()]).transform(Boolean),
});
