// components/home/dual-entry-section.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, ShoppingBag } from "lucide-react";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accent: "#e2ae3d",
};

const paths = [
  {
    href: "/designs",
    title: "Browse Designs First",
    subtitle: "Find your favorite artwork, illustration, or meme, then choose which product to print it on.",
    cta: "Explore Designs",
    icon: Compass,
    bgGradient: "from-purple-900/10 via-purple-900/5 to-transparent",
    hoverBorder: "hover:border-primary/50",
  },
  {
    href: "/collections/all",
    title: "Shop Products First",
    subtitle: "Select a premium t-shirt, cozy hoodie, or stylish mug first, then customize it with any design.",
    cta: "Browse Products",
    icon: ShoppingBag,
    bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    hoverBorder: "hover:border-accent/50",
  },
];

export const DualEntrySection = () => {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4 bg-secondary/20 text-accent">
            YOUR STYLE, YOUR WAY
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
            How Do You Want to Start?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the path that fits you best. Pick a design first, or start with the product canvas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {paths.map((path, i) => {
            const Icon = path.icon;
            return (
              <motion.div
                key={path.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative rounded-3xl p-8 lg:p-12 border border-border/40 bg-card overflow-hidden shadow-sm transition-all duration-300 ${path.hoverBorder}`}
              >
                {/* Decorative background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${path.bgGradient} opacity-50 pointer-events-none`} />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-black text-foreground mb-4">
                      {path.title}
                    </h3>
                    
                    <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                      {path.subtitle}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={path.href}
                      className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: COLORS.primary }}
                    >
                      {path.cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
