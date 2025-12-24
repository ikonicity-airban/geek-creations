"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  variant?: "default" | "minimal";
  className?: string;
}

export function CurrencySwitcher({
  variant = "default",
  className,
}: CurrencySwitcherProps) {
  const { currency, setCurrency, availableCurrencies, isLoading } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || availableCurrencies.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-btn animate-pulse",
          "bg-muted",
          className
        )}
      >
        <div className="w-6 h-4 bg-muted-foreground/20 rounded" />
        <div className="w-8 h-4 bg-muted-foreground/20 rounded" />
      </div>
    );
  }

  const handleCurrencyChange = (newCurrency: typeof currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

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
          aria-label="Select currency"
        >
          <span className="text-base">{currency.symbol}</span>
          <span className="hidden sm:inline text-xs uppercase">
            {currency.code}
          </span>
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
                {availableCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2.5",
                      "rounded-btn text-sm transition-all",
                      "hover:bg-secondary/20",
                      curr.code === currency.code &&
                        "bg-secondary/30 text-primary font-semibold"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{curr.symbol}</span>
                      <div className="text-left">
                        <div className="font-medium text-xs uppercase">
                          {curr.code}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {curr.name}
                        </div>
                      </div>
                    </div>
                    {curr.code === currency.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check className="w-4 h-4 text-primary" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default variant
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
        aria-label="Select currency"
      >
        <span className="text-xl">{currency.symbol}</span>
        <div className="text-left">
          <div className="text-xs uppercase tracking-wider">{currency.code}</div>
          <div className="hidden lg:block text-xs text-muted-foreground">
            {currency.name}
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
                Select Currency
              </div>
              <div className="space-y-1">
                {availableCurrencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-3",
                      "rounded-btn text-sm transition-all",
                      "hover:bg-secondary/20",
                      curr.code === currency.code &&
                        "bg-secondary/30 text-primary font-semibold"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{curr.symbol}</span>
                      <div className="text-left">
                        <div className="font-semibold text-sm">
                          {curr.code}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {curr.name}
                        </div>
                      </div>
                    </div>
                    {curr.code === currency.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check className="w-5 h-5 text-primary" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
