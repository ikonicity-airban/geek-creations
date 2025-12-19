"use client";

import React from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomChange?: (zoom: number) => void;
  isMobile?: boolean;
}

export function ZoomControls({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomChange,
  isMobile = false,
}: ZoomControlsProps) {
  if (isMobile) {
    return (
      <div className="flex items-center gap-2 px-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onZoomOut}
          disabled={zoomLevel <= 25}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <input
          type="range"
          min="25"
          max="200"
          value={zoomLevel}
          onChange={(e) => onZoomChange?.(Number(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-sm font-medium min-w-[3rem] text-center">
          {zoomLevel}%
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onZoomIn}
          disabled={zoomLevel >= 200}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return null; // Desktop zoom is handled in Toolbar
}

