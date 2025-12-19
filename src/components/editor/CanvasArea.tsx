"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fabricCanvasRef: React.RefObject<any>;
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

  // Apply zoom - simplified to avoid breaking canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const scale = Math.max(0.25, Math.min(2, zoomLevel / 100));
    
    // Only update zoom if it's different to avoid constant re-renders
    // Use requestAnimationFrame to prevent render loops
    requestAnimationFrame(() => {
      if (fabricCanvasRef.current && Math.abs(fabricCanvasRef.current.getZoom() - scale) > 0.01) {
        fabricCanvasRef.current.setZoom(scale);
        // Don't call renderAll here - let fabric handle it
      }
    });
  }, [zoomLevel, fabricCanvasRef]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex-1 flex items-center justify-center bg-gray-50 overflow-auto",
        isMobile && "pb-20"
      )}
      style={{
        backgroundImage: showGridlines
          ? `repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(64, 18, 104, 0.1) 19px, rgba(64, 18, 104, 0.1) 20px),
             repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(64, 18, 104, 0.1) 19px, rgba(64, 18, 104, 0.1) 20px)`
          : "none",
      }}
    >
      <div className="relative bg-white shadow-lg rounded-lg p-4">
        <canvas
          ref={canvasRef}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

