"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Tag, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("announcement-dismissed");
    if (isDismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("announcement-dismissed", "true");
  };

  const announcements = [
    {
      icon: <Truck className="w-3.5 h-3.5 text-amber-400" />,
      text: "FREE SHIPPING ON ALL ORDERS OVER $50",
      highlight: "AUTOMATIC AT CHECKOUT",
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
      text: "CREATE YOUR OWN CUSTOM DESIGNS WITH AI EDITOR",
      link: "/editor",
      linkText: "TRY NOW →",
    },
    {
      icon: <Tag className="w-3.5 h-3.5 text-emerald-400" />,
      text: "GET 10% OFF YOUR FIRST ORDER WITH CODE:",
      highlight: "GEEK10",
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />,
      text: "NEW CUSTOMIZABLE HOODIES & MUGS JUST DROPPED",
      link: "/collections",
      linkText: "EXPLORE →",
    },
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-50 bg-slate-900 dark:bg-slate-950 text-slate-100 border-b border-slate-800 text-xs py-2 overflow-hidden shadow-sm select-none"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          {/* Marquee Wrapper */}
          <div className="relative flex overflow-x-hidden w-full group py-0.5">
            <div className="animate-marquee flex items-center whitespace-nowrap gap-12 group-hover:[animation-play-state:paused]">
              {announcements.concat(announcements).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-200 font-medium tracking-wide text-[11px] sm:text-xs"
                >
                  {item.icon}
                  <span>{item.text}</span>
                  {item.highlight && (
                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded text-[10px] font-bold">
                      {item.highlight}
                    </span>
                  )}
                  {item.link && (
                    <Link
                      href={item.link}
                      className="underline underline-offset-2 hover:text-primary transition-colors font-bold ml-1"
                    >
                      {item.linkText}
                    </Link>
                  )}
                  <span className="text-slate-600 ml-6">•</span>
                </div>
              ))}
            </div>

            <div className="absolute top-0 animate-marquee2 flex items-center whitespace-nowrap gap-12 group-hover:[animation-play-state:paused]">
              {announcements.concat(announcements).map((item, index) => (
                <div
                  key={`dup-${index}`}
                  className="flex items-center gap-2 text-slate-200 font-medium tracking-wide text-[11px] sm:text-xs"
                >
                  {item.icon}
                  <span>{item.text}</span>
                  {item.highlight && (
                    <span className="px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded text-[10px] font-bold">
                      {item.highlight}
                    </span>
                  )}
                  {item.link && (
                    <Link
                      href={item.link}
                      className="underline underline-offset-2 hover:text-primary transition-colors font-bold ml-1"
                    >
                      {item.linkText}
                    </Link>
                  )}
                  <span className="text-slate-600 ml-6">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="ml-3 shrink-0 p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
