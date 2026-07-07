"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/types";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      {/* Header */}
      <section className="relative py-12 px-6 bg-transparent border-b border-hairline border-border/30 overflow-hidden">
        <div className="relative z-10 container-lg container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-secondary/25 border-hairline border-border text-primary font-semibold text-xs px-3 py-1 rounded-full inline-flex tracking-wider uppercase">
              Browse Collections
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-foreground">
              Our Collections
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Discover curated collections of our best designs, organized by
              theme and style
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="section-padding bg-transparent">
        <div className="container-lg container-padding">
          {collections.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-card border-hairline border-border p-8 max-w-md mx-auto shadow-card">
              <p className="text-muted-foreground text-lg">
                No collections found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card rounded-card border-hairline border-border hover:border-primary shadow-card hover:shadow-card-hover transition-smooth overflow-hidden flex flex-col h-full"
                >
                  <Link href={`/collections/${collection.handle}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted/30 border-b border-hairline border-border/50">
                      {collection.image_url ? (
                        <Image
                          src={collection.image_url}
                          alt={collection.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted/50 flex items-center justify-center">
                              <span className="text-2xl">📦</span>
                            </div>
                            <p className="text-sm font-semibold">No Image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/collections/${collection.handle}`}>
                        <h3 className="font-bold text-lg sm:text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                          {collection.title}
                        </h3>
                      </Link>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {collection.description || "Explore this collection"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-hairline border-border/30">
                      <Badge variant="outline" className="text-xs bg-secondary/10 border-border text-foreground font-semibold px-2 py-0.5">
                        {collection.product_count || 0}{" "}
                        {collection.product_count === 1
                          ? "product"
                          : "products"}
                      </Badge>
                      <Link href={`/collections/${collection.handle}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 rounded-btn font-semibold border-hairline border-border hover:border-primary transition-smooth text-primary hover:bg-primary/5"
                        >
                          View
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

