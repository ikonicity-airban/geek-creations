"use client";

import React from "react";
import { Edit, Eye, Grid3x3, Undo2, Redo2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  editMode: "edit" | "preview";
  onEditModeChange: (mode: "edit" | "preview") => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isMobile?: boolean;
}

export function Toolbar({
  editMode,
  onEditModeChange,
  showGridlines,
  onToggleGridlines,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isMobile = false,
}: ToolbarProps) {
  return (
    <div className="bg-white border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-4">
      {/* Left side - Mode toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={editMode === "edit" ? "default" : "outline"}
          size="sm"
          onClick={() => onEditModeChange("edit")}
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant={editMode === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => onEditModeChange("preview")}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>

      {/* Center - Undo/Redo (desktop only) */}
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="gap-2"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="gap-2"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Right side - Gridlines toggle and zoom (desktop) */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant={showGridlines ? "default" : "outline"}
          size="sm"
          onClick={onToggleGridlines}
          className="gap-2"
        >
          <Grid3x3 className="w-4 h-4" />
          {!isMobile && <span>Grid</span>}
        </Button>
        {!isMobile && (
          <div className="flex items-center gap-1 border-l border-primary/20 pl-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onZoomOut}
              disabled={zoomLevel <= 25}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
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
        )}
      </div>
    </div>
  );
}

