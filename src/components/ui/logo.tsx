"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const { settings } = useSiteSettings();

  return (
    <motion.div
      initial={{ scale: 0.1, y: 1, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "text-center flex items-center justify-center rounded-full size-12 md:w-14 md:h-14",
        className
      )}
    >
      <Image
        src={settings.logoUrl || "/logo-christmas.png"}
        alt={settings.siteName || "Geek Creations"}
        width={300}
        height={300}
        className="object-contain"
      />
    </motion.div>
  );
}
