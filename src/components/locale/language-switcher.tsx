"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Globe } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "default" | "minimal";
  className?: string;
}

export function LanguageSwitcher({
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage, availableLanguages, isLoading } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || availableLanguages.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-btn animate-pulse",
          "bg-muted",
          className
        )}
      >
        <div className="w-6 h-4 bg-muted-foreground/20 rounded" />
        <div className="w-12 h-4 bg-muted-foreground/20 rounded" />
      </div>
    );
  }

  const handleLanguageChange = (newLanguage: typeof language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  if (variant === "minimal") {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-2.5 py-1.5 rounded-btn text-sm font-semibold",
            "transition-all hover:bg-secondary/20",
            "border border-border/50 hover:border-border",
            "backdrop-blur-sm"
          )}
          aria-label="Select language"
        >
          <div className="relative flex items-center justify-center">
            <Globe className="w-4 h-4 text-foreground shrink-0" />
          </div>
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
            <span>{language.flag}</span>
            <span>{language.code}</span>
          </span>
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform text-muted-foreground",
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
                  "w-56 p-2 rounded-card shadow-card-elevated",
                  "bg-card/95 backdrop-blur-md border border-border"
                )}
              >
                <div className="px-2 py-1 mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between border-b border-border/40">
                  <span>Select Language</span>
                  <Globe className="w-3 h-3" />
                </div>
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-2",
                      "rounded-btn text-sm transition-all",
                      "hover:bg-secondary/20",
                      lang.code === language.code &&
                      "bg-secondary/30 text-primary font-semibold"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-medium text-xs flex items-center gap-1.5">
                          {lang.name}
                          <span className="px-1 py-0.2 text-[9px] font-bold uppercase rounded bg-muted text-muted-foreground border border-border/60">
                            {lang.code}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>
                    {lang.code === language.code && (
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
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-xl">{language.flag}</span>
        <div className="text-left">
          <div className="text-xs font-semibold">{language.name}</div>
          <div className="hidden lg:block text-xs text-muted-foreground">
            {language.nativeName}
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
                "w-72 p-3 rounded-card shadow-card-elevated",
                "bg-card/95 backdrop-blur-md border border-border"
              )}
            >
              <div className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Language
              </div>
              <div className="space-y-1">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3 py-3",
                      "rounded-btn text-sm transition-all",
                      "hover:bg-secondary/20",
                      lang.code === language.code &&
                      "bg-secondary/30 text-primary font-semibold"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-semibold text-sm">
                          {lang.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>
                    {lang.code === language.code && (
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
