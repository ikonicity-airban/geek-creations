"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function SearchDialog() {
  const {
    query,
    setQuery,
    results,
    isSearching,
    isOpen,
    closeSearch,
    recentSearches,
    clearHistory,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch]);

  const handleResultClick = () => {
    closeSearch();
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeSearch}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "w-full max-w-2xl bg-card/95 backdrop-blur-md",
                "rounded-2xl shadow-2xl border border-border",
                "overflow-hidden"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, designs, collections..."
                  className={cn(
                    "flex-1 bg-transparent text-base outline-none",
                    "placeholder:text-muted-foreground text-foreground"
                  )}
                  autoComplete="off"
                  spellCheck={false}
                />
                {isSearching && (
                  <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                )}
                <button
                  onClick={closeSearch}
                  className={cn(
                    "p-1.5 rounded-lg hover:bg-secondary/20 transition-colors",
                    "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* No query - show recent searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Recent Searches
                      </div>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRecentSearchClick(search)}
                          className={cn(
                            "w-full flex items-center justify-between gap-2 px-3 py-2.5",
                            "rounded-lg hover:bg-secondary/20 transition-colors",
                            "text-left text-sm text-foreground"
                          )}
                        >
                          <span>{search}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No query and no recent searches */}
                {!query && recentSearches.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Start typing to search products, designs, and collections
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <kbd className="px-2 py-1 bg-muted rounded border border-border font-mono">
                        ⌘K
                      </kbd>
                      <span>or</span>
                      <kbd className="px-2 py-1 bg-muted rounded border border-border font-mono">
                        Ctrl+K
                      </kbd>
                      <span>to open search</span>
                    </div>
                  </div>
                )}

                {/* Results */}
                {query && results.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4" />
                      Results ({results.length})
                    </div>
                    <div className="space-y-1">
                      {results.map((result) => (
                        <Link
                          key={result.id}
                          href={result.href}
                          onClick={handleResultClick}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg",
                            "hover:bg-secondary/20 transition-colors",
                            "group"
                          )}
                        >
                          {/* Image */}
                          {result.image && (
                            <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                              <Image
                                src={result.image}
                                alt={result.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-foreground truncate">
                                {result.title}
                              </h4>
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-secondary/20 text-muted-foreground capitalize flex-shrink-0">
                                {result.type}
                              </span>
                            </div>
                            {result.description && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {result.description}
                              </p>
                            )}
                            {result.price && (
                              <p className="text-xs font-semibold text-primary mt-1">
                                ₦{result.price.toLocaleString()}
                              </p>
                            )}
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {query && !isSearching && results.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm font-semibold text-foreground mb-1">
                      No results found
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-muted/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background rounded border border-border font-mono">
                        ↑
                      </kbd>
                      <kbd className="px-1.5 py-0.5 bg-background rounded border border-border font-mono">
                        ↓
                      </kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background rounded border border-border font-mono">
                        Enter
                      </kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-background rounded border border-border font-mono">
                        Esc
                      </kbd>
                      <span>Close</span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    Powered by CodeOven
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
