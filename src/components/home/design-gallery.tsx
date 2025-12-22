"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import Image from "next/image";

interface Design {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const DesignGallery = () => {
  const [visibleCount, setVisibleCount] = useState(12);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load designs from API
  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const res = await fetch("/api/designs?limit=48");
        if (!res.ok) throw new Error("Failed to load designs");

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        console.log("🚀 ~ loadDesigns ~ data:", data);

        const mapped: Design[] = data.map(
          (d: Record<string, string>, index: number) => ({
            id: d.id,
            name: d.title ?? `Design ${index + 1}`,
            image: d.thumbnailUrl || d.imageUrl || "/placeholder-design.jpg",
            slug: d.slug || d.id,
          }),
        );

        setDesigns(mapped);
      } catch (err) {
        console.error("[DesignGallery] Failed to load designs", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDesigns();
  }, []);

  const visibleDesigns = designs.slice(0, visibleCount);

  return (
    <section className="section-padding bg-background">
      <div className="container-lg container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-foreground">
            All Designs
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto px-4 text-muted-foreground">
            Browse our complete collection
          </p>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8 md:mb-10">
            {["All", "Category", "Price", "Newest"].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-btn text-xs sm:text-sm font-semibold transition-smooth border-hairline shadow-card active:scale-95 ${
                  filter === "All"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry/Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-card border-hairline border-mauve/10 bg-white/80 p-4 animate-pulse h-64 sm:h-72"
                />
              ))
            : visibleDesigns.map((design, index) => (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 8) * 0.05 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="h-full"
                >
                  <Link href={`/designs/${design.id}`}>
                    <FollowerPointerCard title={design.name}>
                      <div className="rounded-card overflow-hidden cursor-pointer transition-smooth bg-card border-hairline border-border hover:border-primary shadow-card hover:shadow-card-hover h-full flex flex-col">
                        {/* Design Image */}
                        <div className="w-full aspect-square overflow-hidden border-b border-hairline border-border">
                          <Image
                            src={design.image}
                            alt={design.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                          <h4 className="font-bold mb-2 text-sm sm:text-base line-clamp-2 text-card-foreground">
                            {design.name}
                          </h4>
                          <div className="flex items-center text-primary">
                            <span className="text-xs sm:text-sm font-semibold mr-2">
                              View Products
                            </span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                        </div>
                      </div>
                    </FollowerPointerCard>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* Load More Button */}
        {visibleCount < designs.length && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-10 md:mt-12"
          >
            <button
              onClick={() =>
                setVisibleCount((prev) => Math.min(prev + 12, designs.length))
              }
              className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-btn text-sm sm:text-base md:text-lg font-bold transition-smooth shadow-card hover:shadow-card-hover active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Load More Designs
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
