"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { FollowerPointerCard } from "@/components/ui/following-pointer";

interface Design {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export const DesignGallery = () => {
  const [visibleCount, setVisibleCount] = useState(12);
  
  // Mock data - replace with actual data from Supabase
  const designs: Design[] = Array.from({ length: 24 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Design ${i + 1}`,
    image: "/placeholder-design.jpg",
    slug: `design-${i + 1}`
  }));

  const visibleDesigns = designs.slice(0, visibleCount);

  return (
    <section className="py-16" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="max-w-[1024px] mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: '#401268' }}>
            All Designs
          </h2>
          <p className="text-base md:text-lg mb-6" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            Browse our complete collection
          </p>
          
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {['All', 'Category', 'Price', 'Newest'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
                style={{
                  backgroundColor: filter === 'All' ? '#401268' : '#ffffff',
                  color: filter === 'All' ? '#ffffff' : '#401268',
                  border: filter !== 'All' ? '2px solid #401268' : 'none',
                  borderRadius: '12px'
                }}
                onMouseEnter={(e) => {
                  if (filter !== 'All') {
                    e.currentTarget.style.backgroundColor = '#c5a3ff';
                    e.currentTarget.style.color = '#401268';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== 'All') {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#401268';
                  }
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry/Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {visibleDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 8) * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link href={`/designs/${design.slug}`}>
                <FollowerPointerCard title={design.name}>
                  <div
                    className="rounded-2xl overflow-hidden cursor-pointer transition-all bg-white border-2 border-mauve shadow-[0_8px_24px_rgba(64,18,104,0.15)]"
                    style={{ borderRadius: "16px" }}
                  >
                    {/* Design Image Placeholder */}
                    <div
                      className="w-full aspect-square flex items-center justify-center"
                      style={{
                        backgroundColor: "rgba(197, 163, 255, 0.1)",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <span style={{ color: "#c5a3ff" }}>Design Preview</span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold mb-2" style={{ color: "#401268" }}>
                        {design.name}
                      </h3>
                      <div className="flex items-center" style={{ color: "#c5a3ff" }}>
                        <span className="text-sm font-semibold mr-2">View Products</span>
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
              onClick={() => setVisibleCount(prev => Math.min(prev + 12, designs.length))}
              className="px-6 py-3 rounded-xl text-base font-bold transition-all"
              style={{
                backgroundColor: '#401268',
                color: '#ffffff',
                borderRadius: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d0d4a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#401268'}
            >
              Load More Designs
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

