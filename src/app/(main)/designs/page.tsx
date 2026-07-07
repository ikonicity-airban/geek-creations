"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <main className="min-h-screen bg-transparent pt-32 pb-16">
      <section className="container-lg container-padding">
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-secondary/25 border-hairline border-border text-primary font-semibold text-xs px-3 py-1 rounded-full inline-flex tracking-wider uppercase">
            Design Gallery
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-foreground">
            Launch-Ready Designs
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Pick a design, choose a product, and start customized printing instantly.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8 pb-6 border-b border-hairline border-border/30">
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant={category === null ? "default" : "outline"}
              onClick={() => setCategory(null)}
              className={`rounded-btn font-semibold px-4 py-2 text-sm transition-smooth ${
                category === null
                  ? "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
                  : "bg-card text-foreground border-hairline border-border hover:bg-muted hover:border-primary"
              }`}
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                variant={category === c ? "default" : "outline"}
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-btn font-semibold px-4 py-2 text-sm transition-smooth ${
                  category === c
                    ? "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
                    : "bg-card text-foreground border-hairline border-border hover:bg-muted hover:border-primary"
                }`}
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full md:w-80">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search designs..."
              className="rounded-btn h-11 border-hairline border-border bg-card/60 backdrop-blur-xs focus:ring-1 focus:ring-primary/20 transition-smooth placeholder:text-muted-foreground outline-none text-sm font-semibold"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <Link
                key={design.id}
                href={`/designs/${design.id}`}
                className="group rounded-card overflow-hidden bg-card border-hairline border-border hover:border-primary shadow-card hover:shadow-card-hover transition-smooth flex flex-col h-full"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted/20 border-b border-hairline border-border/50">
                  <Image
                    width={400}
                    height={500}
                    src={design.thumbnailUrl || design.imageUrl}
                    alt={design.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/25 text-primary border-hairline border-border/50">
                        {design.category || "General"}
                      </span>
                      {design.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-accent/15 text-accent border-hairline border-accent/25"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {design.title}
                    </h4>
                    <p className="text-sm line-clamp-2 text-muted-foreground leading-relaxed">
                      {design.description || "Ready for tees, hoodies, and mugs."}
                    </p>
                  </div>
                  <div className="flex items-center text-primary text-xs font-bold pt-3 border-t border-hairline border-border/30 gap-1 uppercase tracking-wider">
                    View Products
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
