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
          })
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
    <section className="py-16" style={{ backgroundColor: "#f8f6f0" }}>
      <div className="max-w-[1024px] mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-3xl md:text-5xl font-black mb-3"
            style={{ color: "#401268" }}
          >
            All Designs
          </h2>
          <p
            className="text-base md:text-lg mb-6"
            style={{ color: "rgba(64, 18, 104, 0.8)" }}
          >
            Browse our complete collection
          </p>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {["All", "Category", "Price", "Newest"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  backgroundColor: filter === "All" ? "#401268" : "#ffffff",
                  color: filter === "All" ? "#ffffff" : "#401268",
                  border: filter !== "All" ? "2px solid #401268" : "none",
                  borderRadius: "12px",
                }}
                onMouseEnter={(e) => {
                  if (filter !== "All") {
                    e.currentTarget.style.backgroundColor = "#c5a3ff";
                    e.currentTarget.style.color = "#401268";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== "All") {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.color = "#401268";
                  }
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry/Grid Layout */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border-2 border-mauve/10 bg-white/80 p-4 animate-pulse h-72"
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
                >
                  <Link href={`/designs/${design.id}`}>
                    <FollowerPointerCard title={design.name}>
                      <div
                        className="rounded-2xl overflow-hidden cursor-pointer transition-all bg-white border-2 border-mauve shadow-[0_8px_24px_rgba(64,18,104,0.15)]"
                        style={{ borderRadius: "16px" }}
                      >
                        {/* Design Image */}
                        <div
                          className="w-full aspect-square overflow-hidden"
                          style={{
                            borderBottom: "1px solid #e0e0e0",
                          }}
                        >
                          <Image
                            src={design.image}
                            alt={design.name}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="p-4">
                          <h4
                            className="font-bold mb-2"
                            style={{ color: "#401268" }}
                          >
                            {design.name}
                          </h4>
                          <div
                            className="flex items-center"
                            style={{ color: "#c5a3ff" }}
                          >
                            <span className="text-xs font-semibold mr-2">
                              View Products
                            </span>
                            <ArrowRight className="w-4 h-4" />
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
            className="text-center mt-10"
          >
            <button
              onClick={() =>
                setVisibleCount((prev) => Math.min(prev + 12, designs.length))
              }
              className="px-6 py-3 rounded-xl text-base font-bold transition-all text-white"
              style={{
                backgroundColor: "#401268",
                color: "#fff",
                borderRadius: "0.75rem",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#2d0d4a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#401268")
              }
            >
              Load More Designs
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
