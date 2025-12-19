"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import Image from "next/image";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
};

interface FeaturedDesign {
  id: string;
  name: string;
  image: string;
  priceRange: string;
  handle: string;
}

export const FeaturedCarousel = () => {
  const [featuredDesigns, setFeaturedDesigns] = useState<FeaturedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();

  // Load featured designs
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetch("/api/designs?limit=12");
        if (!res.ok) throw new Error("Failed to load featured designs");

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];

        const mapped: FeaturedDesign[] = data.map(
          (d: Record<string, string>) => ({
            id: d.id,
            name: d.title ?? "Design",
            image: d.thumbnailUrl || d.imageUrl || "/placeholder-design.jpg",
            priceRange: "From ₦5,000",
            handle: d.slug || d.id,
          })
        );

        // Duplicate for seamless loop
        setFeaturedDesigns([...mapped, ...mapped]);
      } catch (err) {
        console.error("[FeaturedCarousel] Failed to load", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeatured();
  }, []);

  // Auto-scroll animation
  useEffect(() => {
    if (featuredDesigns.length === 0 || isPaused) return;

    const totalWidth = featuredDesigns.length * 400; // Approximate card width
    const duration = featuredDesigns.length * 3; // 3s per item

    controls.start({
      x: -totalWidth / 2,
      transition: {
        duration,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });

    return () => {
      controls.stop();
    };
  }, [featuredDesigns, isPaused, controls]);

  const togglePause = () => {
    if (isPaused) {
      controls.start({
        x: [-totalWidth / 2, 0],
        transition: {
          duration: featuredDesigns.length * 3,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    } else {
      controls.stop();
    }
    setIsPaused(!isPaused);
  };

  const totalWidth = featuredDesigns.length * 400;

  return (
    <section id="featured" className="py-16 md:py-24 overflow-hidden">
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4"
            style={{
              backgroundColor: `${COLORS.secondary}20`,
              color: COLORS.primary,
              border: `1px solid ${COLORS.secondary}40`,
            }}
          >
            ✨ Trending Now
          </motion.span>

          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Featured Designs
          </h2>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: `${COLORS.primary}cc` }}
          >
            Our best sellers and trending designs, ready to print on your
            favorite products
          </p>
        </motion.div>
      </PageLayout>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 md:w-48 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${COLORS.background}, transparent)`,
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 md:w-48 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to left, ${COLORS.background}, transparent)`,
          }}
        />

        {/* Carousel */}
        <div className="overflow-hidden py-8">
          {isLoading ? (
            <div className="flex gap-6 px-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-80 md:w-96 h-80 rounded-2xl animate-pulse"
                  style={{ backgroundColor: `${COLORS.primary}10` }}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex gap-6 px-6"
              animate={controls}
              onHoverStart={() => !isPaused && controls.stop()}
              onHoverEnd={() =>
                !isPaused &&
                controls.start({
                  x: -totalWidth / 2,
                  transition: {
                    duration: featuredDesigns.length * 3,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                  },
                })
              }
            >
              {featuredDesigns.map((design, idx) => (
                <motion.div
                  key={`${design.id}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 w-80 md:w-96"
                >
                  <Link href={`/designs/${design.id}`}>
                    {/* <FollowerPointerCard
                      title={`${design.name} • ${design.priceRange}`}
                    > */}
                    <div
                      className="group relative overflow-hidden rounded-3xl cursor-pointer bg-white/90 backdrop-blur border-2 shadow-xl transition-all duration-300 hover:shadow-2xl"
                      style={{
                        borderColor: `${COLORS.primary}20`,
                      }}
                    >
                      {/* Gradient Glow */}
                      <div
                        className="pointer-events-none absolute -top-24 -right-24 h-72 w-56 rounded-full blur-3xl opacity-50 transition-opacity duration-300 group-hover:opacity-80"
                        style={{
                          background: `radial-gradient(circle, ${COLORS.secondary}80, transparent)`,
                        }}
                      />

                      {/* Image */}
                      <div className="relative aspect-4/3 w-full overflow-hidden">
                        <div
                          className="absolute inset-0 z-10"
                          style={{
                            background: `linear-gradient(135deg, ${COLORS.secondary}15 0%, transparent 45%, ${COLORS.background}50 100%)`,
                          }}
                        />

                        <Image
                          width={400}
                          height={300}
                          src={design.image}
                          alt={design.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Shine Effect */}
                        <div
                          className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-20deg] opacity-0 transition-all duration-500 group-hover:left-full group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                          }}
                        />

                        {/* Badges */}
                        <div className="absolute left-3 top-3 z-20">
                          <span
                            className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
                            style={{
                              backgroundColor: `${COLORS.primary}90`,
                              color: "#fff",
                            }}
                          >
                            Featured
                          </span>
                        </div>

                        <div className="absolute right-3 top-3 z-20">
                          <span
                            className="rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm"
                            style={{
                              backgroundColor: `${COLORS.accentWarm}90`,
                              color: "#fff",
                            }}
                          >
                            {design.priceRange}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h4
                          className="text-xl md:text-2xl font-black leading-tight mb-4"
                          style={{ color: COLORS.primary }}
                        >
                          {design.name}
                        </h4>

                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: `${COLORS.primary}99` }}
                          >
                            Available on 5+ products
                          </span>

                          <div
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all group-hover:gap-3"
                            style={{
                              backgroundColor: `${COLORS.secondary}20`,
                              color: COLORS.primary,
                              border: `1px solid ${COLORS.secondary}40`,
                            }}
                          >
                            <span>View</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </FollowerPointerCard> */}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center mt-8 gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePause}
            className="p-3 rounded-full shadow-lg transition-all"
            style={{
              backgroundColor: COLORS.primary,
              color: "#fff",
            }}
          >
            {isPaused ? (
              <Play className="w-5 h-5" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* View All CTA */}
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/designs">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center gap-2 mx-auto"
              style={{
                backgroundColor: COLORS.primary,
                color: "#fff",
              }}
            >
              View All Designs
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </PageLayout>
    </section>
  );
};
