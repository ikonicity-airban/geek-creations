"use client";

import * as React from "react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "geek-creations-theme";

function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored as ThemeMode;
    }
    return null;
  } catch {
    return null;
  }
}

function saveThemeToStorage(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore localStorage errors
  }
}

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = React.useState<ThemeMode>(() => {
    const stored = getStoredTheme();
    return stored !== null ? stored : defaultTheme;
  });

  const [systemPreference, setSystemPreference] = React.useState<
    "light" | "dark"
  >(() => getSystemPreference());

  // Listen for system preference changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Calculate resolved theme
  const resolvedTheme: "light" | "dark" =
    theme === "system" ? systemPreference : theme;

  // Backward compatibility: darkMode boolean
  const darkMode = resolvedTheme === "dark";

  // Apply theme to document
  React.useEffect(() => {
    if (resolvedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [resolvedTheme]);

  // Save theme preference
  const setTheme = React.useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    saveThemeToStorage(newTheme);
  }, []);

  // Backward compatibility: setDarkMode
  const setDarkMode = React.useCallback(
    (value: boolean) => {
      setTheme(value ? "dark" : "light");
    },
    [setTheme],
  );

  // Backward compatibility: toggleDarkMode
  const toggleDarkMode = React.useCallback(() => {
    if (theme === "system") {
      // If system, toggle to opposite of current resolved theme
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      // If explicit light/dark, toggle
      setTheme(theme === "dark" ? "light" : "dark");
    }
  }, [theme, resolvedTheme, setTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      darkMode,
      setDarkMode,
      toggleDarkMode,
      resolvedTheme,
    }),
    [theme, setTheme, darkMode, setDarkMode, toggleDarkMode, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider />");
  }
  return ctx;
}
