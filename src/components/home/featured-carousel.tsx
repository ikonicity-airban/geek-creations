"use client";

import { motion, useAnimationControls } from "framer-motion";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import Image from "next/image";
import { buttonVariants } from "../ui/button";

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

    const totalWidth = featuredDesigns.length * 320; // Responsive card width
    const duration = featuredDesigns.length * 10; // 3s per item

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
    <section
      id="featured"
      className="section-padding overflow-hidden bg-background"
    >
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-btn text-xs sm:text-sm font-bold mb-3 sm:mb-4 border-hairline bg-secondary/20 text-foreground border-secondary/40"
          >
            ✨ Trending Now
          </motion.span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 px-4 text-foreground">
            Featured Designs
          </h2>

          <p className="text-sm sm:text-base md:text-lg max-w-xs sm:max-w-xl md:max-w-2xl mx-auto px-4 text-muted-foreground">
            Our best sellers and trending designs, ready to print on your
            favorite products
          </p>
        </motion.div>
      </PageLayout>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        {/* Carousel */}
        <div className="overflow-hidden py-6 sm:py-8">
          {isLoading ? (
            <div className="flex gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-64 sm:w-72 md:w-80 lg:w-96 h-64 sm:h-72 md:h-80 rounded-card animate-pulse shadow-card bg-muted"
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="flex gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6"
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
                  className="shrink-0 w-64  sm:w-72 md:w-80 lg:w-96"
                >
                  <Link href={`/designs/${design.id}`}>
                    {/* <FollowerPointerCard
                      title={`${design.name} • ${design.priceRange}`}
                    > */}
                    <div className="group relative overflow-hidden rounded-card cursor-pointer bg-card/90 backdrop-blur border-hairline border-border shadow-card transition-smooth hover:shadow-card-elevated">
                      {/* Gradient Glow */}
                      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-56 rounded-full blur-3xl opacity-50 transition-opacity duration-300 group-hover:opacity-80 bg-linear-to-r from-secondary/50 to-transparent" />

                      {/* Image */}
                      <div className="relative aspect-square sm:aspect-4/3 w-full overflow-hidden">
                        <div className="absolute inset-0 z-10" />

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
                        <div className="absolute left-2 sm:left-3 top-2 sm:top-3 z-20">
                          <span className="rounded-btn px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm bg-primary/90 text-primary-foreground">
                            Featured
                          </span>
                        </div>

                        <div className="absolute right-2 sm:right-3 top-2 sm:top-3 z-20">
                          <span className="rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-sm bg-accent/90 text-accent-foreground">
                            {design.priceRange}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h4 className="text-xl md:text-2xl font-black leading-tight mb-4 text-card-foreground">
                          {design.name}
                        </h4>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                          <span className="text-sm font-semibold text-muted-foreground">
                            Available on 5+ products
                          </span>

                          <div className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold transition-all group-hover:gap-3 bg-secondary/20 text-foreground border border-secondary/40">
                            <span>View</span>
                            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
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
            className={buttonVariants({
              variant: "outline",
              className:
                "p-3 rounded-full border-accent shadow-xl [shadow:0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]",
            })}
          >
            {isPaused ? (
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
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
              className={buttonVariants({
                variant: "default",
                className:
                  "px-8 py-2 font-bold text-lg shadow-xl transition-all flex items-center gap-2 mx-auto",
              })}
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
