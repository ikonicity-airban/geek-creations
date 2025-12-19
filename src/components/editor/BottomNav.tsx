"use client";

import React from "react";
import { Type, Upload, Shapes, Palette, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTool: string | null;
  onToolSelect: (tool: string) => void;
  onProductSelect?: () => void;
}

const mobileTools = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "text", label: "Text", icon: Type },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "product", label: "Product", icon: Package },
];

export function BottomNav({
  activeTool,
  onToolSelect,
  onProductSelect,
}: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary/20 px-2 py-2 z-50 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {mobileTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                if (tool.id === "product" && onProductSelect) {
                  onProductSelect();
                } else {
                  onToolSelect(tool.id);
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

