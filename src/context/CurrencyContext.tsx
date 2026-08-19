'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'NOK';

interface CurrencyOption {
  code: Currency;
  symbol: string;
  label: string;
  rate: number; // rate FROM NOK
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 1 / 11.8 },
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1 / 10.9 },
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 1 / 13.8 },
  { code: 'NOK', symbol: 'kr', label: 'NOK kr', rate: 1 },
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (nokAmount: number) => string;
  convertPrice: (nokAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('EUR');

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), []);

  const convertPrice = useCallback((nokAmount: number): number => {
    const opt = CURRENCIES.find((c) => c.code === currency)!;
    return Math.round(nokAmount * opt.rate);
  }, [currency]);

  const formatPrice = useCallback((nokAmount: number): string => {
    const opt = CURRENCIES.find((c) => c.code === currency)!;
    const converted = Math.round(nokAmount * opt.rate);
    const formatted = converted.toLocaleString('en-US');
    if (currency === 'EUR') return `€${formatted}`;
    if (currency === 'USD') return `$${formatted}`;
    if (currency === 'GBP') return `£${formatted}`;
    if (currency === 'NOK') return `NOK ${formatted}`;
    return `${currency} ${formatted}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

export { CurrencyContext };