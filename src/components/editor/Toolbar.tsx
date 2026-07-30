"use client";

import {
  Edit,
  Eye,
  Grid3x3,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="bg-card border-b border-border px-4 py-2.5 flex items-center justify-between gap-4 select-none z-10 shrink-0">
      {/* Left side - Mode toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={editMode === "edit" ? "default" : "outline"}
          size="sm"
          onClick={() => onEditModeChange("edit")}
          className="gap-1.5 h-8 text-xs font-semibold"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button
          variant={editMode === "preview" ? "default" : "outline"}
          size="sm"
          onClick={() => onEditModeChange("preview")}
          className="gap-1.5 h-8 text-xs font-semibold"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </Button>
      </div>

      {/* Center - Undo/Redo (desktop only) */}
      {!isMobile && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Right side - Gridlines toggle and zoom (desktop) */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant={showGridlines ? "secondary" : "outline"}
          size="sm"
          onClick={onToggleGridlines}
          className="gap-1.5 h-8 text-xs font-semibold"
        >
          <Grid3x3 className="w-3.5 h-3.5" />
          {!isMobile && <span>Grid</span>}
        </Button>
        {!isMobile && (
          <div className="flex items-center gap-1 border-l border-border pl-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              disabled={zoomLevel <= 25}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs font-bold min-w-10 text-center text-muted-foreground">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              disabled={zoomLevel >= 200}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
