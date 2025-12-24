"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface SearchResult {
  id: string;
  type: "product" | "design" | "collection";
  title: string;
  description?: string;
  image?: string;
  price?: number;
  href: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  recentSearches: string[];
  clearHistory: () => void;
  performSearch: (query: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = "geek-creations-recent-searches";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }, []);

  // Save recent searches to localStorage
  const saveToRecentSearches = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setRecentSearches((prev) => {
      const updated = [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save recent search:", error);
      }

      return updated;
    });
  }, []);

  // Clear search history
  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error("Failed to clear search history:", error);
    }
  }, []);

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`
        );

        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          saveToRecentSearches(searchQuery);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [saveToRecentSearches]
  );

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Open/close search dialog
  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), []);

  // Global keyboard shortcut (CMD+K or CTRL+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }

      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleSearch, closeSearch]);

  const value: SearchContextType = {
    query,
    setQuery,
    results,
    isSearching,
    isOpen,
    openSearch,
    closeSearch,
    toggleSearch,
    recentSearches,
    clearHistory,
    performSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
