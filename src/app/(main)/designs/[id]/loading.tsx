"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

// Shimmer effect component
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

// Skeleton components
const ImageSkeleton = () => (
  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
    <Shimmer />
  </div>
);

const TextSkeleton = ({
  width = "100%",
  height = "1rem",
}: {
  width?: string;
  height?: string;
}) => (
  <div
    className="relative rounded-lg bg-muted overflow-hidden"
    style={{ width, height }}
  >
    <Shimmer />
  </div>
);

const BadgeSkeleton = () => (
  <div className="relative w-24 h-6 rounded-full bg-muted overflow-hidden">
    <Shimmer />
  </div>
);

const TagSkeleton = () => (
  <div className="relative w-20 h-6 rounded-full bg-muted overflow-hidden">
    <Shimmer />
  </div>
);

const ProductCardSkeleton = () => (
  <Card className="relative p-4 overflow-hidden">
    <Shimmer />
    <div className="relative space-y-2">
      <TextSkeleton width="70%" height="1rem" />
      <TextSkeleton width="50%" height="1.5rem" />
      <TextSkeleton width="80%" height="0.75rem" />
    </div>
  </Card>
);

export default function DesignDetailLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start"
        >
          {/* Left: Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg border bg-card">
            <ImageSkeleton />
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            {/* Category Badge */}
            <BadgeSkeleton />

            {/* Title */}
            <div className="space-y-2">
              <TextSkeleton width="80%" height="2.5rem" />
              <TextSkeleton width="100%" height="1.5rem" />
              <TextSkeleton width="90%" height="1.5rem" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <TextSkeleton width="100%" />
              <TextSkeleton width="100%" />
              <TextSkeleton width="75%" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <TagSkeleton key={i} />
              ))}
            </div>

            {/* Product Options Section */}
            <div className="space-y-4 pt-4">
              <TextSkeleton width="40%" height="1.5rem" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
