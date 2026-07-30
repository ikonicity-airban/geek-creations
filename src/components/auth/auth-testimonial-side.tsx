"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Quote } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { MerchandiseDoodleBackground } from "./merchandise-doodle-bg";
import Link from "next/link";

export interface AuthTestimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: AuthTestimonial[] = [
  {
    quote:
      "The print quality is unbelievable! The colors are vibrant and the fabric feels ultra premium even after multiple washes.",
    author: "Chidi Okonkwo",
    role: "Verified Buyer, Lagos",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "Ordered custom hoodies for our tech startup team. Super fast delivery within 48 hours and top-notch customer support!",
    author: "Amina Bello",
    role: "Product Designer, Abuja",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "Designing my own shirt on the AI editor took less than 2 minutes. The print arrived sharp, crisp, and beautifully packaged.",
    author: "Tunde Adeyemi",
    role: "Digital Creator, Port Harcourt",
    avatar:
      "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "The anime and tech collection designs are unmatched. Super comfortable fit and crypto checkout was seamless!",
    author: "Kemi Adebayo",
    role: "Gaming Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1636041293178-808a6762ab39?w=100&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

export function AuthTestimonialSide() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * TESTIMONIALS.length);
    setCurrentIndex(randomIndex);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const current = TESTIMONIALS[currentIndex];

  return (
    <div className="relative hidden lg:flex lg:w-[40%] h-screen max-h-screen flex-col justify-between p-6 xl:p-8 overflow-hidden bg-slate-950 text-white select-none order-2 border-l border-white/10">
      {/* Brand Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-40 scale-105"
        style={{ backgroundImage: "url('/img/brand-bg-dark.png')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-l from-slate-950/95 via-slate-950/80 to-slate-950/50 backdrop-blur-[2px]" />

      {/* Merchandise Artwork Doodles Overlay (Cups, Sweaters, Trousers, Jotters, Diaries, T-Shirts) */}
      <MerchandiseDoodleBackground />

      {/* Top Header: Centered Logo & Branding Badge */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 w-full pt-2">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo />
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
          Cups • Sweaters • Jotters • Diaries • Apparel
        </span>
      </div>

      {/* Center/Bottom Section: Testimonial (+20% Text Size, Right Aligned) */}
      <div className="relative z-10 my-auto max-w-sm ml-auto text-right flex flex-col items-end py-4">
        <div className="mb-3 inline-flex p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-primary">
          <Quote className="w-5 h-5 text-primary" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 flex flex-col items-end"
          >
            {/* Rating Stars */}
            <div className="flex items-center justify-end gap-1">
              {[...Array(current.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm"
                />
              ))}
            </div>

            {/* Testimonial Quote (+20% larger font) */}
            <blockquote className="text-sm sm:text-base md:text-lg font-bold leading-snug tracking-tight text-slate-100 text-shadow-sm">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Author Profile (Compact & Right-aligned) */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <div className="text-right">
                <p className="font-bold text-xs sm:text-sm text-white">
                  {current.author}
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  {current.role}
                </p>
              </div>
              <img
                src={current.avatar}
                alt={current.author}
                className="w-9 h-9 rounded-full object-cover border border-primary/40 shadow-md"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators (Right Aligned) */}
        <div className="flex justify-end gap-1.5 pt-4">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer Trust Counter (Right Aligned) */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 w-full">
        <p>© {new Date().getFullYear()} Geek Creations</p>
        <p className="font-semibold text-slate-300 text-[11px]">1,200+ Happy Customers</p>
      </div>
    </div>
  );
}
