"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Sun, Moon, Monitor } from "lucide-react";
import { useTheme, ThemeMode } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "minimal" | "icon-only";
  className?: string;
  showLabel?: boolean;
}

const themeOptions: Array<{
  mode: ThemeMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    mode: "light",
    label: "Light",
    icon: Sun,
    description: "Light theme",
  },
  {
    mode: "dark",
    label: "Dark",
    icon: Moon,
    description: "Dark theme",
  },
  {
    mode: "system",
    label: "System",
    icon: Monitor,
    description: "Follow system",
  },
];

export function ThemeToggle({
  variant = "minimal",
  className,
  showLabel = true,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = themeOptions.find((opt) => opt.mode === theme);
  const CurrentIcon = currentOption?.icon || Sun;

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  // Icon-only variant (just a button)
  if (variant === "icon-only") {
    return (
      <button
        onClick={() => {
          const modes: ThemeMode[] = ["light", "dark", "system"];
          const currentIndex = modes.indexOf(theme);
          const nextIndex = (currentIndex + 1) % modes.length;
          setTheme(modes[nextIndex]);
        }}
        className={cn(
          "p-2 rounded-full transition-all",
          "bg-muted hover:bg-secondary/20",
          "border border-border/50 hover:border-border",
          className
        )}
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-4 h-4 text-foreground" />
      </button>
    );
  }

  // Minimal variant (compact dropdown)
  if (variant === "minimal") {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn text-sm font-semibold",
            "transition-all hover:bg-secondary/20",
            "border border-border/50 hover:border-border",
            "bg-background/80 backdrop-blur-sm"
          )}
          aria-label="Select theme"
        >
          <CurrentIcon className="w-3.5 h-3.5" />
          {showLabel && (
            <span className="hidden sm:inline text-xs">
              {currentOption?.label}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute right-0 top-full mt-2 z-50",
                  "w-48 p-2 rounded-card shadow-card-elevated",
                  "bg-card/95 backdrop-blur-md border border-border"
                )}
              >
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = option.mode === theme;

                  return (
                    <button
                      key={option.mode}
                      onClick={() => handleThemeChange(option.mode)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-3 py-2.5",
                        "rounded-btn text-sm transition-all",
                        "hover:bg-secondary/20",
                        isActive && "bg-secondary/30 text-primary font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div className="text-left">
                          <div className="font-medium text-xs">
                            {option.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-4 h-4 text-primary" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant (larger dropdown)
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-btn",
          "font-semibold text-sm transition-all",
          "border border-border hover:border-primary/50",
          "bg-card/80 backdrop-blur-sm hover:bg-secondary/20",
          "shadow-sm hover:shadow-md"
        )}
        aria-label="Select theme"
      >
        <CurrentIcon className="w-4 h-4" />
        <div className="text-left">
          <div className="text-xs font-semibold">{currentOption?.label}</div>
          <div className="hidden lg:block text-xs text-muted-foreground">
            {currentOption?.description}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 ml-1 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute right-0 top-full mt-2 z-50",
                "w-64 p-3 rounded-card shadow-card-elevated",
                "bg-card/95 backdrop-blur-md border border-border"
              )}
            >
              <div className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Theme
              </div>
              <div className="space-y-1">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = option.mode === theme;

                  return (
                    <button
                      key={option.mode}
                      onClick={() => handleThemeChange(option.mode)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-3 py-3",
                        "rounded-btn text-sm transition-all",
                        "hover:bg-secondary/20",
                        isActive && "bg-secondary/30 text-primary font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">
                            {option.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Check className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {theme === "system" && (
                <div className="mt-3 pt-3 border-t border-border px-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      {resolvedTheme === "dark" ? (
                        <>
                          <Moon className="w-3 h-3" /> Dark
                        </>
                      ) : (
                        <>
                          <Sun className="w-3 h-3" /> Light
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
