import type { DefaultCategorySeed } from '@/src/types/category';

export const defaultCategories: DefaultCategorySeed[] = [
  { name: 'Salary', type: 'income', icon: 'briefcase-outline', color: '#23967F' },
  { name: 'Freelance', type: 'income', icon: 'laptop-outline', color: '#147D80' },
  { name: 'Bonus', type: 'income', icon: 'sparkles-outline', color: '#3E8EDE' },
  { name: 'Food', type: 'expense', icon: 'restaurant-outline', color: '#F28482' },
  { name: 'Transport', type: 'expense', icon: 'car-outline', color: '#F4B860' },
  { name: 'Shopping', type: 'expense', icon: 'bag-handle-outline', color: '#C86B98' },
  { name: 'Bills', type: 'expense', icon: 'receipt-outline', color: '#8D6FDB' },
  { name: 'Health', type: 'expense', icon: 'medkit-outline', color: '#D9485F' },
  { name: 'Entertainment', type: 'expense', icon: 'film-outline', color: '#5A7CE2' },
];
