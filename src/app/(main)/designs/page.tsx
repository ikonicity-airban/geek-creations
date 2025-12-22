"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
    <main className="min-h-screen bg-background pt-20">
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4 bg-secondary/20 text-accent">
            DESIGN GALLERY
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3 ">
            20 launch-ready designs
          </h1>
          <p className="text-lg text-muted-foreground">
            Pick a design, choose a product, and start selling instantly.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm font-semibold transition-colors",
                category ? "border-primary" : "border-transparent"
              )}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                variant={category === c ? "default" : "outline"}
                key={c}
                onClick={() => setCategory(c)}
                className="rounded-full border transition-colors hover:border-primary"
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-1/3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designs..."
              className="min-w-fitrounded-full h-12"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-primary">Loading designs...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Link
                key={design.id}
                href={`/designs/${design.id}`}
                className="group rounded-2xl overflow-hidden border transition border-border bg-card shadow-sm hover:shadow-md"
              >
                <div className="aspect-4/5 overflow-hidden">
                  <Image
                    width={400}
                    height={300}
                    src={design.thumbnailUrl || design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="px-2 py-1 rounded-full bg-secondary/20 text-primary">
                      {design.category || "General"}
                    </span>
                    {design.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs bg-accent/15 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="text-xl font-bold text-primary">
                    {design.title}
                  </h4>
                  <p className="text-sm line-clamp-2 text-muted-foreground">
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
