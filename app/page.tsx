// app/page.tsx — GEEKS CREATION HOMEPAGE (LIVE ON DEC 14)
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Palette, Zap, Moon, Sun, ArrowRight, Instagram, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <>
      {/* Floating Dark Mode Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-(--mauve)/20 backdrop-blur-lg border border-(--honey-bronze)/30"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <Sun className="w-5 h-5 text-(--honey-bronze)" /> : <Moon className="w-5 h-5 text-(--indigo-ink)" />}
      </motion.button>

      {/* Hero – Full Bleed Gradient Art Explosion */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-(--indigo-ink) via-purple-900 to-(--scarlet-rush)">
        <div className="absolute inset-0 bg-black/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-(--honey-bronze)" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-linear-to-r from-(--porcelain) via-(--mauve) to-(--honey-bronze) bg-clip-text text-transparent">
            GEEKS<br />CREATION
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-(--porcelain)/90 font-light max-w-2xl mx-auto">
            Where Nigerian nerds, artists & dreamers turn wild ideas into wearable legends.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections/all">
              <Button size="lg" className="bg-(--honey-bronze) hover:bg-(--scarlet-rush) text-(--indigo-ink) font-bold text-lg px-10 py-7 rounded-full shadow-2xl">
                <ShoppingBag className="mr-2" /> Shop the Drop
              </Button>
            </Link>
            <Link href="/customize">
              <Button size="lg" variant="outline" className="border-(--mauve) text-(--porcelain) hover:bg-(--mauve)/20 font-bold text-lg px-10 py-7 rounded-full backdrop-blur">
                <Palette className="mr-2" /> Design Your Own
              </Button>
            </Link>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0 ]}}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-20"
          >
            <ArrowRight className="w-10 h-10 mx-auto text-(--porcelain)/60 rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Collections – Animated Grid */}
      <section className="py-24 px-6 bg-(--porcelain) dark:bg-(--indigo-ink)/95">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <Badge className="mb-4 bg-(--scarlet-rush) text-white">Fresh Drops</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-(--indigo-ink) dark:text-(--mauve)">
              Latest Geek Fuel
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Anime Gods', 'Code & Chaos', 'Afro Geek Future'].map((collection, i) => (
              <motion.div
                key={collection}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl"
              >
                <div className="aspect-[4/5 bg-linear-to-br from-(--mauve)/20 to-(--scarlet-rush)/20" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />
                <div className="absolute bottom-8 left-8 text-(--porcelain)">
                  <h3 className="text-3xl font-black">{collection}</h3>
                  <p className="text-sm opacity-80">Limited Edition • Drops Weekly</p>
                </div>
                <Zap className="absolute top-6 right-6 w-10 h-10 text-(--honey-bronze) opacity-0 group-hover:opacity-100 transition" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-(--honey-bronze)/10 dark:bg-(--scarlet-rush)/10">
        <div className="max-w-5xl mx-auto text-center grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {['Pay with Crypto', 'Free Shipping ₦50k+', 'Printed in Nigeria', '7-Day Returns'].map((item) => (
            <div key={item} className="flex items-center justify-center gap-2 text-(--indigo-ink) dark:text-(--porcelain) font-medium">
              <Sparkles className="w-5 h-5 text-(--scarlet-rush)" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-(--indigo-ink) text-(--porcelain)">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-black mb-4">GEEKS CREATION</h3>
          <p className="mb-8">Made by nerds. Worn by legends.</p>
          <div className="flex justify-center gap-6">
            <Instagram className="w-6 h-6 hover:text-(--mauve) cursor-pointer" />
            <X className="w-6 h-6 hover:text-(--mauve) cursor-pointer" />
          </div>
          <p className="mt-10 text-sm opacity-60">© 2025 Geeks Creation. All rights reserved. Powered by CodeOven 🔥</p>
        </div>
      </footer>
    </>
  );
}