"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { IconPhoto } from "@tabler/icons-react";
import { buttonVariants } from "../ui/button";
import { useRef } from "react";
import { FlipWords } from "@/components/ui/flip-words";

export const Hero = ({ darkMode }: { darkMode?: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook scroll progress specifically for this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background Media Configuration (Paths for background video or image)
  const bgVideo = "/1111312_Sketch_Cloth_3840x2160.mp4";
  const bgImage = "";

  // Parallax transforms for floating background elements
  const yLeftDecor = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yRightDecor = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const rotateDecor = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Parallax transforms for the 3 bottom cards
  const yCard1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yCard2 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yCard3 = useTransform(scrollYProgress, [0, 1], [0, -70]);

  // Parallax transforms for background media (sticky parallax effect)
  const yBgMedia = useTransform(scrollYProgress, [0, 1], [-100, 650]);
  const scaleBgMedia = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariantsLeft = {
    hidden: { opacity: 0, y: 80, rotate: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: -4,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 15,
        delay: 0.4,
      },
    },
  };

  const cardVariantsCenter = {
    hidden: { opacity: 0, y: 100, rotate: 6, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 2,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 15,
        delay: 0.55,
      },
    },
  };

  const cardVariantsRight = {
    hidden: { opacity: 0, y: 80, rotate: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: -2,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 15,
        delay: 0.45,
      },
    },
  };

  // Stacked client avatars data (using design-conscious Unsplash placeholders)
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden pt-40 -mt-20 bg-[#f8f6f0] dark:bg-[#401268] transition-colors duration-300"
    >
      {/* Background Media Container */}
      {(bgVideo || bgImage) && (
        <motion.div
          style={{ y: yBgMedia, scale: scaleBgMedia }}
          className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden origin-center"
        >
          {bgVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-screen md:h-full max-sm:object-cover"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>
          ) : (
            bgImage && (
              <img
                src={bgImage}
                alt="Brand Essence Background"
                className="w-full h-full object-cover"
              />
            )
          )}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-porcelain/60 via-porcelain/30 to-porcelain dark:from-indigo-ink/90 dark:via-indigo-ink/70 dark:to-indigo-ink backdrop-blur-[2px] transition-colors duration-300" />
        </motion.div>
      )}

      {/* Readability Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300 bg-[rgba(248,246,240,0.72)] dark:bg-[rgba(64,18,104,0.82)] backdrop-blur-md" />

      {/* Floating Decorative Elements */}
      <motion.div
        style={{ y: yLeftDecor, rotate: rotateDecor }}
        className="absolute left-6 sm:left-12 md:left-20 top-[20%] z-10 pointer-events-none select-none hidden sm:block animate-pulse"
      >
        <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 dark:opacity-60">
          <path d="M10 0L30 20L10 40L30 60L10 80" className="stroke-[#401268] dark:stroke-[#c5a3ff]" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <motion.div
        style={{ y: yRightDecor }}
        className="absolute left-10 sm:left-16 md:left-32 bottom-[35%] z-10 pointer-events-none select-none hidden sm:block"
      >
        <div className="grid grid-cols-3 gap-2 opacity-30 dark:opacity-50">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#e2ae3d]"
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        style={{ y: yRightDecor, rotate: rotateDecor }}
        className="absolute right-6 sm:right-12 md:right-20 top-[25%] z-10 pointer-events-none select-none hidden sm:block animate-pulse"
      >
        <div className="grid grid-cols-3 gap-2 opacity-30 dark:opacity-50">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#401268] dark:bg-[#c5a3ff]"
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        style={{ y: yLeftDecor }}
        className="absolute right-10 sm:right-16 md:right-32 bottom-[30%] z-10 pointer-events-none select-none hidden sm:block"
      >
        <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40 dark:opacity-60">
          <path d="M30 0L10 20L30 40L10 60L30 80" className="stroke-[#e21b35] dark:stroke-[#e2ae3d]" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Main Core Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center flex-1 text-center select-none pt-4 sm:pt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8 max-w-4xl mx-auto"
        >
          {/* Top Pill Badge */}
          <motion.div variants={itemVariants} className="inline-block">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black tracking-wide uppercase transition-all shadow-sm bg-[rgba(64,18,104,0.06)] dark:bg-[rgba(197,163,255,0.15)] border border-[rgba(64,18,104,0.1)] dark:border-[rgba(197,163,255,0.25)] text-[#401268] dark:text-[#f8f6f0]">
              <Sparkles className="w-3.5 h-3.5 text-honey-bronze fill-honey-bronze" />
              20+ Premium Designs Ready
            </span>
          </motion.div>

          {/* Centered Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl lg:text-[6.5rem] font-extrabold tracking-tight md:leading-20 leading-15"
            style={{
              fontFamily: "var(--font-archivo-black), 'Archivo Black', 'Inter', 'Arial Black', sans-serif",
            }}
          >
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-ink via-honey-bronze to-scarlet-rush dark:from-mauve dark:via-honey-bronze dark:to-scarlet-rush select-text drop-shadow-sm"
              style={{
                fontFamily: "var(--font-archivo-black), 'Archivo Black', 'Inter', 'Arial Black', sans-serif",
              }}
            >
              Geek Creations
            </span>
            <br />
            <span className="text-lg font-black sm:text-xl md:text-2xl lg:text-3xl over-the-rainbow leading-0 text-shadow-gray-400 text-shadow-sm text-[#401268] dark:text-[#f8f6f0]">
              {" "}
              Print{" "}
              <FlipWords
                words={["T-Shirts", "Hoodies", "Mugs", "Phone Cases", "Tote Bags", "Designs"]}
                duration={3000}
                className="p-0 inline-block font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-shadow-sm"
              />{" "}
              on Demand
            </span>
          </motion.h1>

          {/* Subheading Description */}
          <motion.p
            variants={itemVariants}
            className="text-base font-(--font-over-the-rainbow) md:text-lg leading-relaxed max-w-2xl mx-auto px-4 text-[rgba(64,18,104,0.75)] dark:text-[rgba(248,246,240,0.85)]"
          >
            Choose from curated designs or upload your own. We handle printing,
            shipping, and crypto payments.
          </motion.p>

          {/* CTAs and Client Avatar Cluster */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row items-center justify-center gap-6 pt-4 px-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {/* Primary Action Button */}
              <Link href="/designs" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "group w-full sm:w-auto px-8 py-4 font-bold text-base flex items-center justify-center gap-2 rounded-full shadow-lg bg-[#401268] dark:bg-[#c5a3ff] text-white dark:text-[#010110]",
                  })}
                >
                  <IconPhoto className="w-5 h-5 text-white dark:text-[#010110]" />
                  Browse Designs
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white dark:text-[#010110]" />
                </motion.button>
              </Link>

              {/* Secondary Action Button */}
              <Link href="/collections/all" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full sm:w-auto px-8 py-4 font-bold text-base flex items-center justify-center gap-2 rounded-full shadow-md",
                  })}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop all products
                </motion.button>
              </Link>
            </div>

            {/* Avatars Stack & Plus Counter */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {avatars.map((url, idx) => (
                  <motion.img
                    key={idx}
                    src={url}
                    alt={`Customer Avatar ${idx + 1}`}
                    whileHover={{ y: -6, zIndex: 10 }}
                    className="w-10 h-10 rounded-full border-2 object-cover cursor-pointer shadow-md transition-all size-10 border-[#f8f6f0] dark:border-[#401268]"
                  />
                ))}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-black shadow-md cursor-pointer select-none size-10 bg-[#401268] dark:bg-[#c5a3ff] border-[#f8f6f0] dark:border-[#401268] text-white dark:text-[#401268]"
                >
                  +
                </motion.div>
              </div>

              <div className="text-left">
                <p className="text-xs font-bold leading-tight text-[#401268] dark:text-[#f8f6f0]">
                  1,200+ Happy Customers
                </p>
                <p className="text-[10px] text-[rgba(64,18,104,0.65)] dark:text-[rgba(248,246,240,0.65)]">
                  4.8★ Rating | Fast Nationwide Delivery
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Showcase Cards - Sliding entry + individual scroll-based parallax */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-30 md:mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 items-center max-w-5xl mx-auto">

          {/* Card 1: Left card - beautiful-floral-still-life.jpg */}
          <motion.div
            style={{ y: yCard1 }}
            variants={cardVariantsLeft}
            initial="hidden"
            animate="visible"
            className="w-full aspect-[4/3] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_24px_50px_rgba(64,18,104,0.25)] transition-shadow duration-300 relative border-4 border-white/80 dark:border-[rgba(197,163,255,0.15)] cursor-pointer"
          >
            <img
              src="/img/beautiful-floral-still-life.jpg"
              alt="Beautiful floral still life print"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Card 2: Center card - pretty-woman-wearing-tshirt.jpg */}
          <motion.div
            style={{ y: yCard2 }}
            variants={cardVariantsCenter}
            initial="hidden"
            animate="visible"
            className="w-full aspect-[4/3] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_24px_50px_rgba(64,18,104,0.3)] transition-shadow duration-300 relative border-4 border-white/95 dark:border-[rgba(197,163,255,0.25)] z-20 cursor-pointer"
          >
            <img
              src="/img/pretty-woman-wearing-tshirt.jpg"
              alt="Pretty woman wearing custom printed t-shirt"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Card 3: Right card - hero_girl.png */}
          <motion.div
            style={{ y: yCard3 }}
            variants={cardVariantsRight}
            initial="hidden"
            animate="visible"
            className="w-full aspect-[4/3] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_24px_50px_rgba(64,18,104,0.25)] transition-shadow duration-300 relative border-4 border-white/80 dark:border-[rgba(197,163,255,0.15)] cursor-pointer"
          >
            <img
              src="/img/hero_girl.png"
              alt="Woman wearing custom prints"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
