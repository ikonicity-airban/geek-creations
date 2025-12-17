"use client";

import * as React from "react";

type ThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  defaultDarkMode = false,
}: {
  children: React.ReactNode;
  defaultDarkMode?: boolean;
}) {
  const [darkMode, setDarkMode] = React.useState(defaultDarkMode);

  React.useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
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


