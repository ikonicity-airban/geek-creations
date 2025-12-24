"use client";

import React from "react";
import { Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  variant?: "default" | "minimal" | "icon-only";
  className?: string;
  showShortcut?: boolean;
}

export function SearchTrigger({
  variant = "minimal",
  className,
  showShortcut = true,
}: SearchTriggerProps) {
  const { openSearch } = useSearch();

  // Icon-only variant (just a button)
  if (variant === "icon-only") {
    return (
      <button
        onClick={openSearch}
        className={cn(
          "p-2 rounded-full transition-all",
          "bg-muted hover:bg-secondary/20",
          "border border-border/50 hover:border-border",
          "text-foreground",
          className
        )}
        aria-label="Search"
      >
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    );
  }

  // Minimal variant (compact button)
  if (variant === "minimal") {
    return (
      <button
        onClick={openSearch}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-btn text-sm",
          "transition-all hover:bg-secondary/20",
          "border border-border/50 hover:border-border",
          "bg-background/80 backdrop-blur-sm",
          "text-muted-foreground hover:text-foreground",
          className
        )}
        aria-label="Search"
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline text-xs">Search...</span>
        {showShortcut && (
          <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-muted rounded border border-border">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </button>
    );
  }

  // Default variant (full search bar preview)
  return (
    <button
      onClick={openSearch}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-btn",
        "transition-all hover:bg-secondary/20",
        "border border-border hover:border-primary/50",
        "bg-card/80 backdrop-blur-sm",
        "w-full max-w-md",
        className
      )}
      aria-label="Search"
    >
      <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="flex-1 text-left text-sm text-muted-foreground">
        Search products, designs...
      </span>
      {showShortcut && (
        <kbd className="flex items-center gap-1 px-2 py-1 text-xs font-mono bg-muted rounded border border-border text-muted-foreground">
          <span>⌘</span>K
        </kbd>
      )}
    </button>
  );
}
