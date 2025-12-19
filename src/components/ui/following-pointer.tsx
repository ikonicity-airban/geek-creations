"use client";

import React, { useState } from "react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const FollowerPointerCard = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isInside, setIsInside] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div className="relative" style={{ cursor: "none" }}>
      <div
        onMouseLeave={() => setIsInside(false)}
        onMouseEnter={() => setIsInside(true)}
        onMouseMove={handleMouseMove}
        style={{ cursor: "none" }}
        className={cn("relative", className)}
      >
        <AnimatePresence>
          {isInside && <FollowPointer x={x} y={y} title={title} />}
        </AnimatePresence>
        {children}
      </div>
    </div>
  );
};

export const FollowPointer = ({
  x,
  y,
  title,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  title?: string | React.ReactNode;
}) => {
  const colors = [
    "#0ea5e9",
    "#737373",
    "#14b8a6",
    "#22c55e",
    "#3b82f6",
    "#ef4444",
    "#eab308",
  ];

  const resolvedTitle =
    typeof title === "string" ? title : "William Shakespeare";
  const colorIndex =
    Array.from(resolvedTitle).reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    ) % colors.length;

  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      style={{
        left: x,
        top: y,
        translateX: "-15%",
        translateY: "-25%",
        pointerEvents: "none",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 500 }}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="1"
        viewBox="0 0 16 16"
        className="h-6 w-6 -rotate-70 text-sky-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
      </svg>

      <motion.div
        className="min-w-max whitespace-nowrap rounded-full px-2 py-1 text-xs text-white"
        style={{ backgroundColor: colors[colorIndex] }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        {title || "William Shakespeare"}
      </motion.div>
    </motion.div>
  );
};
