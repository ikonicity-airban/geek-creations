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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="pt-10" />
      
      {/* Header */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/40">
              Browse Collections
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Our Collections
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover curated collections of our best designs, organized by theme and style
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {collections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No collections found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <Link href={`/collections/${collection.handle}`}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {collection.image_url ? (
                        <Image
                          src={collection.image_url}
                          alt={collection.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-2xl">📦</span>
                            </div>
                            <p className="text-sm">No Image</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>

                  <div className="p-6">
                    <Link href={`/collections/${collection.handle}`}>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {collection.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {collection.description || "Explore this collection"}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {collection.product_count || 0} {collection.product_count === 1 ? "product" : "products"}
                      </Badge>
                      <Link href={`/collections/${collection.handle}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          View Collection
                          <ArrowRight className="w-4 h-4" />
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

