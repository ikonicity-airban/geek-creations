"use client";

import * as React from "react";

type ThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "geek-creations-theme";

function getStoredTheme(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === null) return null;
    return stored === "dark";
  } catch {
    return null;
  }
}

function saveThemeToStorage(isDark: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    // Ignore localStorage errors (e.g., quota exceeded, private browsing)
  }
}

export function ThemeProvider({
  children,
  defaultDarkMode = false,
}: {
  children: React.ReactNode;
  defaultDarkMode?: boolean;
}) {
  // Initialize from localStorage or use default
  const [darkMode, setDarkMode] = React.useState(() => {
    const stored = getStoredTheme();
    return stored !== null ? stored : defaultDarkMode;
  });

  // Apply theme to document on mount and when darkMode changes
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Save to localStorage whenever theme changes
  React.useEffect(() => {
    saveThemeToStorage(darkMode);
  }, [darkMode]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      darkMode,
      setDarkMode,
      toggleDarkMode: () => setDarkMode((v) => !v),
    }),
    [darkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider />");
  }
  return ctx;
}


