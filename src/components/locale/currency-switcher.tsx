"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  variant?: "default" | "minimal" | "icon";
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
          "flex items-center gap-2 px-3 py-2 rounded-btn animate-pulse bg-muted",
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

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 rounded-btn font-semibold transition-all backdrop-blur-sm",
          variant === "default"
            ? "px-4 py-2 text-sm border border-border hover:border-primary/50 bg-card/80 hover:bg-secondary/20 shadow-sm hover:shadow-md"
            : "px-2.5 py-1.5 text-sm hover:bg-secondary/20 border border-border/50 hover:border-border",
        )}
        aria-label="Select currency"
      >
        <span className={cn(variant === "default" ? "text-xl" : "text-base")}>
          {currency.symbol}
        </span>

        {variant === "minimal" && (
          <span className="hidden sm:inline text-xs uppercase font-bold">
            {currency.code}
          </span>
        )}

        {variant === "default" && (
          <div className="text-left">
            <div className="text-xs uppercase tracking-wider font-bold">
              {currency.code}
            </div>
            <div className="hidden lg:block text-xs text-muted-foreground">
              {currency.name}
            </div>
          </div>
        )}

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform text-muted-foreground ml-0.5",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Shared Dropdown Menu Popover */}
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
                "p-2 rounded-card shadow-card-elevated",
                "bg-card/95 backdrop-blur-md border border-border",
                variant === "default" ? "w-64" : "w-52"
              )}
            >
              <div className="px-2 py-1 mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between border-b border-border/40">
                <span>Select Currency</span>
                <span className="text-xs font-semibold">{currency.symbol}</span>
              </div>
              <div className="space-y-0.5">
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
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg font-bold w-5 text-center">
                        {curr.symbol}
                      </span>
                      <div className="text-left">
                        <div className="font-semibold text-xs uppercase flex items-center gap-1.5">
                          {curr.code}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
