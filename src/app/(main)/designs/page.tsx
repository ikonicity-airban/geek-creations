"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Design = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: string | null;
  tags: string[] | null;
};

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (query) params.set("q", query);
        const res = await fetch(`/api/designs?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();
        setDesigns(json.data || []);
      } catch (error) {
        console.error("Failed to load designs", error);
      } finally {
        setLoading(false);
      }
    };
    loadDesigns();
  }, [category, query]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    designs.forEach((d) => d.category && set.add(d.category));
    return Array.from(set);
  }, [designs]);

  const palette = {
    primary: "#401268",
    secondary: "#c5a3ff",
    background: "#f8f6f0",
    accentWarm: "#e2ae3d",
  };

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: palette.background }}
    >
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <span
            className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4"
            style={{ backgroundColor: palette.secondary, color: palette.primary }}
          >
            DESIGN GALLERY
          </span>
          <h1
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ color: palette.primary }}
          >
            20 launch-ready designs
          </h1>
          <p
            className="text-lg"
            style={{ color: "rgba(64, 18, 104, 0.75)" }}
          >
            Pick a design, choose a product, and start selling instantly.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCategory(null)}
              className="px-4 py-2 rounded-full border text-sm font-semibold"
              style={{
                borderColor: category ? "#e0e0e0" : palette.primary,
                color: category ? palette.primary : "#ffffff",
                backgroundColor: category ? "#ffffff" : palette.primary,
              }}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-4 py-2 rounded-full border text-sm font-semibold"
                style={{
                  borderColor: category === c ? palette.primary : "#e0e0e0",
                  color: category === c ? "#ffffff" : palette.primary,
                  backgroundColor: category === c ? palette.primary : "#ffffff",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search designs..."
            className="px-4 py-3 rounded-lg border w-full md:w-80"
            style={{ borderColor: "#e0e0e0", color: palette.primary }}
          />
        </div>

        {loading ? (
          <p style={{ color: palette.primary }}>Loading designs...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Link
                key={design.id}
                href={`/designs/${design.id}`}
                className="group rounded-2xl overflow-hidden border transition"
                style={{
                  borderColor: "#e0e0e0",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={design.thumbnailUrl || design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span
                      className="px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(197,163,255,0.2)",
                        color: palette.primary,
                      }}
                    >
                      {design.category || "General"}
                    </span>
                    {design.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: "rgba(226,174,61,0.15)",
                          color: palette.primary,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: palette.primary }}
                  >
                    {design.title}
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: "rgba(64, 18, 104, 0.7)" }}
                  >
                    {design.description || "Ready for tees, hoodies, and mugs."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

