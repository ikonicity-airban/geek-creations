"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { useWindowSize } from "react-use";
import Image from "next/image";

interface FeaturedDesign {
  id: string;
  name: string;
  image: string;
  priceRange: string;
  handle: string;
}

export const FeaturedCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredDesigns, setFeaturedDesigns] = useState<FeaturedDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowSize();

  // Load featured designs from API (designs with highest sortOrder / newest)
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
            // Price range would normally come from linked products; placeholder for now
            priceRange: "From ₦5,000",
            handle: d.slug || d.id,
          })
        );

        setFeaturedDesigns(mapped);
      } catch (err) {
        console.error(
          "[FeaturedCarousel] Failed to load featured designs",
          err
        );
      }
      setIsLoading(false);
    };

    loadFeatured();
  }, []);

  const visibleCount = useMemo(() => {
    if (width > 1200) return 3;
    if (width > 768) return 2;
    return 1;
  }, [width]);

  const maxIndex = Math.max(0, featuredDesigns.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section id="featured" className="py-16">
      <PageLayout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{ color: "#401268" }}
          >
            Featured Designs
          </h2>
          <p
            className="text-base md:text-lg"
            style={{ color: "rgba(64, 18, 104, 0.8)" }}
          >
            Our best sellers and trending designs
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden p-10">
            <motion.div
              className="flex gap-6 items-center justify-center"
              animate={{
                x: `-${currentIndex * (100 / visibleCount)}%`,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {isLoading && (
                <>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="shrink-0"
                      style={{ width: `${100 / visibleCount}%` }}
                    >
                      <div className="animate-pulse rounded-2xl bg-white/80 border-2 border-mauve/40 shadow-[0_8px_24px_rgba(64,18,104,0.1)] overflow-hidden h-64" />
                    </div>
                  ))}
                </>
              )}

              {!isLoading &&
                featuredDesigns.map((design) => (
                  <motion.div
                    key={design.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="shrink-0"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <Link href={`/designs/${design.id}`}>
                      <FollowerPointerCard
                        title={`${design.name} • ${design.priceRange}`}
                      >
                        <div
                          className="group relative overflow-hidden rounded-3xl cursor-pointer bg-white/90 backdrop-blur border-2 border-mauve shadow-[0_10px_30px_rgba(64,18,104,0.2)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_50px_rgba(64,18,104,0.28)]"
                          style={{ borderRadius: "20px" }}
                        >
                          {/* Subtle gradient glow */}
                          <div
                            className="pointer-events-none absolute -top-24 -right-24 h-72 w-56 rounded-full blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(197,163,255,0.55) 0%, rgba(197,163,255,0) 70%)",
                            }}
                          />
                          <div
                            className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-90"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(226,174,61,0.35) 0%, rgba(226,174,61,0) 70%)",
                            }}
                          />

                          {/* Image */}
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <div
                              className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(197,163,255,0.22) 0%, rgba(64,18,104,0.08) 45%, rgba(248,246,240,0.65) 100%)",
                              }}
                            />
                            <Image
                              width={400}
                              height={400}
                              src={design.image}
                              alt={design.name}
                              className="absolute inset-0 w-full h-full object-cover"
                              style={{
                                borderBottom: "1px solid rgba(64,18,104,0.08)",
                              }}
                            />

                            {/* Shine */}
                            <div
                              className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-20deg] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              style={{
                                background:
                                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                              }}
                            />

                            {/* Top badges */}
                            <div className="absolute left-3 top-3 flex items-center gap-2">
                              <span
                                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                                style={{
                                  backgroundColor: "rgba(64,18,104,0.10)",
                                  border: "1px solid rgba(64,18,104,0.18)",
                                  color: "#401268",
                                }}
                              >
                                Featured
                              </span>
                            </div>
                            <div className="absolute right-3 top-3">
                              <span
                                className="rounded-full px-3 py-1 text-[11px] font-bold"
                                style={{
                                  backgroundColor: "rgba(197,163,255,0.18)",
                                  border: "1px solid rgba(197,163,255,0.35)",
                                  color: "#401268",
                                }}
                              >
                                {design.priceRange}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h3
                              className="text-xl font-black leading-snug"
                              style={{ color: "#401268" }}
                            >
                              {design.name}
                            </h3>

                            <div className="mt-4 flex items-center justify-between">
                              <span
                                className="text-sm font-semibold"
                                style={{ color: "rgba(64, 18, 104, 0.65)" }}
                              >
                                From your best sellers
                              </span>
                              <div
                                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold transition-colors"
                                style={{
                                  backgroundColor: "rgba(197,163,255,0.14)",
                                  color: "#401268",
                                  border: "1px solid rgba(197,163,255,0.35)",
                                }}
                              >
                                <span>View</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </FollowerPointerCard>
                    </Link>
                  </motion.div>
                ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {featuredDesigns.length > visibleCount && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "#401268",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(64,18,104,0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d0d4a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#401268")
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "#401268",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(64,18,104,0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2d0d4a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#401268")
                }
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </PageLayout>
    </section>
  );
};
