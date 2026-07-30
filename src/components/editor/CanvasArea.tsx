"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IFabricCanvasRef {
  getZoom: () => number;
  setZoom: (zoom: number) => void;
}
interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fabricCanvasRef: React.RefObject<IFabricCanvasRef>;
  showGridlines: boolean;
  zoomLevel: number;
  isMobile?: boolean;
}

export function CanvasArea({
  canvasRef,
  fabricCanvasRef,
  showGridlines,
  zoomLevel,
  isMobile = false,
}: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const scale = Math.max(0.25, Math.min(2, zoomLevel / 100));

    requestAnimationFrame(() => {
      if (canvas && Math.abs(canvas.getZoom() - scale) > 0.01) {
        canvas.setZoom(scale);
      }
    });
  }, [zoomLevel, fabricCanvasRef]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex-1 h-full w-full flex items-center justify-center bg-muted/20 overflow-auto p-2 sm:p-4 select-none",
        isMobile && "pb-20"
      )}
      style={{
        backgroundImage: showGridlines
          ? `repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(150, 150, 150, 0.12) 24px, rgba(150, 150, 150, 0.12) 25px),
             repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(150, 150, 150, 0.12) 24px, rgba(150, 150, 150, 0.12) 25px)`
          : "none",
      }}
    >
      {/* Maximum Y-Spacious Canvas Stage Container */}
      <div className="relative bg-card shadow-2xl rounded-3xl p-3 border border-border/80 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={560}
          className="rounded-2xl border border-border/40 bg-white"
          style={{ width: "500px", height: "560px" }}
        />
      </div>
    </div>
  );
}
