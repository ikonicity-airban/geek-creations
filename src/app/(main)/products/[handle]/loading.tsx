import { motion } from "framer-motion";

const COLORS = {
  primary: "#401268",
  secondary: "#c5a3ff",
  background: "#f8f6f0",
  accentWarm: "#e2ae3d",
  accentBold: "#e21b35",
};

// Shimmer effect component
const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

// Skeleton components
const ImageSkeleton = () => (
  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
    <Shimmer />
  </div>
);

const TextSkeleton = ({ width = "100%", height = "1rem" }: { width?: string; height?: string }) => (
  <div
    className="relative rounded-lg bg-gray-200 overflow-hidden"
    style={{ width, height }}
  >
    <Shimmer />
  </div>
);

const ButtonSkeleton = () => (
  <div className="relative w-full h-14 rounded-xl bg-gray-200 overflow-hidden">
    <Shimmer />
  </div>
);

export default function ProductLoadingSkeleton() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${COLORS.background} 0%, #ffffff 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Left: Image Gallery */}
          <div>
            <ImageSkeleton />
            {/* Thumbnail strip skeleton */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-lg bg-gray-200 overflow-hidden"
                >
                  <Shimmer />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <TextSkeleton width="60%" height="2rem" />
              <div className="mt-2">
                <TextSkeleton width="40%" height="1.5rem" />
              </div>
            </div>

            {/* Price */}
            <div>
              <TextSkeleton width="30%" height="2.5rem" />
              <div className="mt-2">
                <TextSkeleton width="25%" height="1.25rem" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <TextSkeleton width="100%" />
              <TextSkeleton width="100%" />
              <TextSkeleton width="80%" />
            </div>

            {/* Variant Selectors */}
            <div className="space-y-4">
              <div>
                <TextSkeleton width="20%" height="1rem" />
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative w-16 h-10 rounded-lg bg-gray-200 overflow-hidden"
                    >
                      <Shimmer />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <TextSkeleton width="20%" height="1rem" />
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative w-20 h-10 rounded-lg bg-gray-200 overflow-hidden"
                    >
                      <Shimmer />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <TextSkeleton width="25%" height="1rem" />
              <div className="flex items-center gap-3 mt-2">
                <div className="relative w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                  <Shimmer />
                </div>
                <TextSkeleton width="2rem" height="1.5rem" />
                <div className="relative w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <ButtonSkeleton />

            {/* Additional Info */}
            <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${COLORS.primary}20` }}>
              <TextSkeleton width="50%" height="1rem" />
              <TextSkeleton width="70%" height="1rem" />
            </div>
          </div>
        </motion.div>

        {/* Related Products Skeleton */}
        <div className="mt-16">
          <TextSkeleton width="40%" height="2rem" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden bg-white border"
                style={{ borderColor: `${COLORS.primary}20` }}
              >
                <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden">
                  <Shimmer />
                </div>
                <div className="p-4 space-y-2">
                  <TextSkeleton width="80%" />
                  <TextSkeleton width="50%" />
                </div>
              </div>
            ))}
          </div>
        </div>
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

