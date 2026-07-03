"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: "before" | "after";
  decimalPlaces: number;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

interface LocaleContextType {
  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  availableCurrencies: Currency[];
  setAvailableCurrencies: (currencies: Currency[]) => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;
  availableLanguages: Language[];
  setAvailableLanguages: (languages: Language[]) => void;

  // Utility functions
  formatPrice: (price: number, currencyCode?: string) => string;
  convertPrice: (price: number, fromCurrency: string, toCurrency: string) => Promise<number>;

  // Loading state
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const DEFAULT_CURRENCY: Currency = {
  code: "NGN",
  name: "Nigerian Naira",
  symbol: "₦",
  symbolPosition: "before",
  decimalPlaces: 2,
};

const DEFAULT_LANGUAGE: Language = {
  code: "en",
  name: "English",
  nativeName: "English",
  flag: "🇬🇧",
  isRTL: false,
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>([DEFAULT_CURRENCY]);
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([DEFAULT_LANGUAGE]);
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<Record<string, Record<string, number>>>({});

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load from localStorage
        const savedCurrency = localStorage.getItem("geek-creations-currency");
        const savedLanguage = localStorage.getItem("geek-creations-language");

        // Fetch available currencies and languages from API
        const [currenciesRes, languagesRes] = await Promise.all([
          fetch("/api/locale/currencies").catch(() => null),
          fetch("/api/locale/languages").catch(() => null),
        ]);

        if (currenciesRes?.ok) {
          const data = await currenciesRes.json();
          if (data.currencies && data.currencies.length > 0) {
            setAvailableCurrencies(data.currencies);

            // Set saved currency or default
            if (savedCurrency) {
              const saved = data.currencies.find((c: Currency) => c.code === savedCurrency);
              if (saved) setCurrencyState(saved);
            } else {
              const defaultCurr = data.currencies.find((c: Currency) => c.code === DEFAULT_CURRENCY.code) || data.currencies[0];
              setCurrencyState(defaultCurr);
            }
          }
        }

        if (languagesRes?.ok) {
          const data = await languagesRes.json();
          if (data.languages && data.languages.length > 0) {
            setAvailableLanguages(data.languages);

            // Set saved language or default
            if (savedLanguage) {
              const saved = data.languages.find((l: Language) => l.code === savedLanguage);
              if (saved) setLanguageState(saved);
            } else {
              const defaultLang = data.languages.find((l: Language) => l.code === DEFAULT_LANGUAGE.code) || data.languages[0];
              setLanguageState(defaultLang);
            }
          }
        }

        // Fetch exchange rates
        const ratesRes = await fetch("/api/locale/exchange-rates").catch(() => null);
        if (ratesRes?.ok) {
          const data = await ratesRes.json();
          if (data.rates) {
            setExchangeRates(data.rates);
          }
        }
      } catch (error) {
        console.error("Failed to load locale preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save currency preference
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("geek-creations-currency", newCurrency.code);

    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent("currencyChanged", { detail: newCurrency }));
  };

  // Save language preference
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("geek-creations-language", newLanguage.code);

    // Update document direction for RTL languages
    document.documentElement.dir = newLanguage.isRTL ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage.code;

    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: newLanguage }));
  };

  // Format price with currency
  const formatPrice = (price: number, currencyCode?: string): string => {
    const curr = currencyCode
      ? availableCurrencies.find(c => c.code === currencyCode) || currency
      : currency;

    const formattedNumber = price.toLocaleString(language.code, {
      minimumFractionDigits: curr.decimalPlaces,
      maximumFractionDigits: curr.decimalPlaces,
    });

    if (curr.symbolPosition === "before") {
      return `${curr.symbol}${formattedNumber}`;
    } else {
      return `${formattedNumber}${curr.symbol}`;
    }
  };

  // Convert price between currencies
  const convertPrice = async (
    price: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> => {
    if (fromCurrency === toCurrency) return price;

    // Try to get rate from cached exchange rates
    if (exchangeRates[fromCurrency]?.[toCurrency]) {
      return price * exchangeRates[fromCurrency][toCurrency];
    }

    // If not cached, fetch from API
    try {
      const res = await fetch(
        `/api/locale/convert?from=${fromCurrency}&to=${toCurrency}&amount=${price}`
      );
      if (res.ok) {
        const data = await res.json();
        return data.converted || price;
      }
    } catch (error) {
      console.error("Currency conversion failed:", error);
    }

    return price; // Return original price if conversion fails
  };

  const value: LocaleContextType = {
    currency,
    setCurrency,
    availableCurrencies,
    setAvailableCurrencies,
    language,
    setLanguage,
    availableLanguages,
    setAvailableLanguages,
    formatPrice,
    convertPrice,
    isLoading,
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
