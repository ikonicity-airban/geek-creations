"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export const ProductionDemo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => console.log("Video play failed:", err));
      setIsPlaying(true);
    }
  };

  return (
    <section
      className="py-20 relative overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-300 bg-[url('/img/brand-bg-light.png')] dark:bg-[url('/img/brand-bg-dark.png')]"
    >
      {/* Readability Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300 bg-[rgba(248,246,240,0.88)] dark:bg-[rgba(1,1,16,0.88)]"
      />

      <div className="max-w-[1024px] mx-auto px-8 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 text-accent">
            See It Come to Life
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-muted-foreground">
            Watch your design transform from concept to shipped product
          </p>
        </motion.div>

        {/* Video Player Mockup Container */}
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden border-2 border-secondary/20 shadow-2xl bg-black aspect-video group cursor-pointer"
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/1111312_Sketch_Cloth_3840x2160.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Glassmorphic Play/Pause Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
              <div
                className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current text-white" />
                ) : (
                  <Play className="w-8 h-8 fill-current translate-x-0.5 text-white" />
                )}
              </div>
            </div>

            {/* Phase Badges Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-xs text-white border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c5a3ff] animate-pulse" /> Design
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-xs text-white border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#401268] animate-pulse" /> Product
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-xs text-white border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e2ae3d] animate-pulse" /> Print
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-primary text-primary-foreground shadow-lg">
                Production Process
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

