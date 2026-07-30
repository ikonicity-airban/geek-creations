"use client";

import {
  ShoppingBag,
  Type,
  Upload,
  Shapes,
  Palette,
  Layers,
  Grid3x3,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IconSidebarProps {
  activeTool: string | null;
  onToolSelect: (tool: string | null) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const TOOLS = [
  {
    id: "products",
    label: "Products",
    icon: ShoppingBag,
  },
  {
    id: "text",
    label: "Text",
    icon: Type,
  },
  {
    id: "upload",
    label: "Uploads",
    icon: Upload,
  },
  {
    id: "shapes",
    label: "Graphics",
    icon: Shapes,
  },
  {
    id: "colors",
    label: "Colors",
    icon: Palette,
  },
  {
    id: "layers",
    label: "Layers",
    icon: Layers,
  },
  {
    id: "settings",
    label: "Canvas",
    icon: Grid3x3,
  },
];

export function IconSidebar({
  activeTool,
  onToolSelect,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}: IconSidebarProps) {
  return (
    <div className="w-16 bg-card border-r border-border flex flex-col items-center justify-between py-3 z-30 shrink-0 select-none shadow-md">
      {/* Photoshop / Canva Main Tool Dock */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onToolSelect(isActive ? null : tool.id)}
              className={cn(
                "w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
              title={tool.label}
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="text-[10px] font-bold leading-none text-center">
                {tool.label}
              </span>

              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-l-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Undo / Redo Buttons at Bottom of Sidebar */}
      <div className="flex flex-col items-center gap-1.5 w-full pt-2 border-t border-border/50">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
