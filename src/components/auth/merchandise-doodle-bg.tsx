"use client";

import React from "react";

export function MerchandiseDoodleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05] dark:opacity-[0.07] text-current z-0">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        fill="none"
      >
        <pattern
          id="rich-merch-doodles"
          x="0"
          y="0"
          width="360"
          height="360"
          patternUnits="userSpaceOnUse"
        >
          {/* T-Shirt (Small, 15deg tilt, 1.2px stroke) */}
          <g transform="translate(15, 20) scale(0.7) rotate(15)">
            <path
              d="M20 25 L35 15 L45 20 C45 28 55 28 55 20 L65 15 L80 25 L70 38 L62 34 L62 70 L38 70 L38 34 L30 38 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Coffee Mug / Cup (Normal scale, 1.8px stroke) */}
          <g transform="translate(110, 15) rotate(-10)">
            <path
              d="M10 10 L36 10 L33 36 C33 40 28 44 23 44 C18 44 13 40 13 36 Z M36 15 C42 15 45 19 45 24 C45 29 42 33 36 33"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Shop Currency / Wallet & Coins (Large, -12deg tilt, 2.2px stroke) */}
          <g transform="translate(200, 20) scale(1.15) rotate(-12)">
            <rect
              x="5"
              y="10"
              width="45"
              height="30"
              rx="4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path d="M5 20 L50 20 M38 25 A3 3 0 1 0 38 25.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="56" cy="18" r="7" stroke="currentColor" strokeWidth="2.2" />
            <path d="M56 15 L56 21 M54 18 L58 18" stroke="currentColor" strokeWidth="1.8" />
          </g>

          {/* Sweater / Hoodie (Extra large scale, 2.5px stroke, 8deg tilt) */}
          <g transform="translate(290, 25) scale(1.25) rotate(8)">
            <path
              d="M10 15 L25 5 L40 10 L40 5 L60 5 L60 10 L75 5 L90 15 L78 28 L70 24 L70 55 L30 55 L30 24 L22 28 Z M40 10 C40 18 60 18 60 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Pizza Slice (Medium scale, 2.0px stroke) */}
          <g transform="translate(20, 110) scale(0.9) rotate(-20)">
            <path
              d="M10 10 L50 25 L25 60 Z M10 10 C25 2 38 8 50 25"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="28" cy="28" r="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="35" cy="40" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          </g>

          {/* Smoothie / Cold Cup with Straw (Scale 1.1, 1.6px stroke) */}
          <g transform="translate(105, 100) scale(1.1) rotate(12)">
            <path
              d="M10 20 L35 20 L30 60 L15 60 Z M5 20 L40 20 M28 5 L22 20"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M15 35 C20 30 25 40 30 35" stroke="currentColor" strokeWidth="1.4" />
          </g>

          {/* Wrench / Tool (Scale 0.8, -35deg tilt, 2.4px stroke) */}
          <g transform="translate(195, 115) scale(0.85) rotate(-35)">
            <path
              d="M10 15 C5 5 20 2 25 12 L45 42 C50 48 40 55 35 48 Z M10 15 L2 20 M25 12 L30 5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Car / Delivery Vehicle (Large scale 1.2, 2.2px stroke) */}
          <g transform="translate(270, 120) scale(1.2) rotate(-5)">
            <path
              d="M5 25 L12 12 L35 12 L45 25 L65 25 L65 35 L5 35 Z M15 35 A5 5 0 1 0 15 35.1 M50 35 A5 5 0 1 0 50 35.1"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Jotter / Notebook (Medium, 18deg tilt, 1.4px stroke) */}
          <g transform="translate(15, 205) scale(0.95) rotate(18)">
            <path
              d="M10 10 L50 10 L50 60 L10 60 Z M10 10 L10 60 M17 10 L17 60 M24 20 L42 20 M24 30 L42 30 M24 40 L36 40"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Trousers / Pants (Large, -15deg tilt, 2.0px stroke) */}
          <g transform="translate(100, 200) scale(1.15) rotate(-15)">
            <path
              d="M10 10 L45 10 L48 60 L32 60 L27 28 L23 28 L18 60 L2 60 Z M10 20 L45 20 M27 10 L27 25"
              stroke="currentColor"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Diary / Hardcover Book (Scale 1.0, 1.8px stroke) */}
          <g transform="translate(190, 210) scale(1.05) rotate(10)">
            <path
              d="M10 10 L48 15 L48 60 L10 55 Z M10 10 L10 55 M18 22 L40 25 M18 32 L40 35 M22 42 C26 38 34 46 38 42"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Art Palette (Scale 0.75, -25deg tilt, 2.2px stroke) */}
          <g transform="translate(285, 205) scale(0.8) rotate(-25)">
            <path
              d="M30 10 C10 10 10 40 30 40 C38 40 40 33 48 33 C55 33 60 40 60 25 C60 10 45 10 30 10 Z M20 20 A3 3 0 1 1 20 19.9 M32 17 A3 3 0 1 1 32 16.9 M45 20 A3 3 0 1 1 45 19.9"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Tote Bag (Scale 0.85, 2.0px stroke) */}
          <g transform="translate(30, 290) scale(0.85) rotate(-8)">
            <path
              d="M20 18 C20 5 30 5 30 18 M40 18 C40 5 50 5 50 18 M10 18 L60 18 L55 60 L15 60 Z"
              stroke="currentColor"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Cap / Baseball Hat (Scale 1.0, 1.6px stroke) */}
          <g transform="translate(125, 295) scale(1.0) rotate(15)">
            <path
              d="M15 25 C15 10 40 10 40 25 M3 30 C15 25 45 25 55 30 L15 30"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Currency Dollar Sign / Crypto Symbol (Scale 1.1, 2.4px stroke) */}
          <g transform="translate(210, 290) scale(1.1) rotate(-15)">
            <path
              d="M20 10 C10 10 10 22 20 25 C30 28 30 40 20 40 M20 5 L20 45"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="25" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>

          {/* Sparkles / Stars (Small floating accent doodles) */}
          <g transform="translate(315, 305) rotate(45)">
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor" opacity="0.6" />
          </g>
        </pattern>

        <rect width="100%" height="100%" fill="url(#rich-merch-doodles)" />
      </svg>
    </div>
  );
}
