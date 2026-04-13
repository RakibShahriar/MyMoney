import { useAppStore } from '@/src/store/appStore';

export const useCurrencySettings = () => {
  const currencyCode = useAppStore((state) => state.currencyCode);
  const currencySymbol = useAppStore((state) => state.currencySymbol);
  const decimalPlaces = useAppStore((state) => state.decimalPlaces);

  return {
    currencyCode,
    currencySymbol,
    decimalPlaces,
  };
};
