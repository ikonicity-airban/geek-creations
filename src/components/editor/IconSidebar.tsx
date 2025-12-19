"use client";

import React from "react";
import {
  Type,
  Upload,
  Circle,
  Square,
  Palette,
  Image as ImageIcon,
  Sparkles,
  FolderOpen,
  Shapes,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IconSidebarProps {
  activeTool: string | null;
  onToolSelect: (tool: string) => void;
  onTextClick: () => void;
  onUploadClick: () => void;
  onShapeClick: (shape: "circle" | "rectangle") => void;
  onColorClick: () => void;
}

const tools = [
  {
    id: "upload",
    label: "Upload",
    icon: Upload,
    action: "upload",
  },
  {
    id: "text",
    label: "Add text",
    icon: Type,
    action: "text",
  },
  {
    id: "shapes",
    label: "Graphics",
    icon: Shapes,
    action: "shapes",
  },
  {
    id: "colors",
    label: "Colors",
    icon: Palette,
    action: "colors",
  },
];

export function IconSidebar({
  activeTool,
  onToolSelect,
  onTextClick,
  onUploadClick,
  onShapeClick,
  onColorClick,
}: IconSidebarProps) {
  const handleToolClick = (tool: typeof tools[0]) => {
    onToolSelect(tool.id);
    switch (tool.action) {
      case "text":
        onTextClick();
        break;
      case "upload":
        onUploadClick();
        break;
      case "colors":
        onColorClick();
        break;
      case "shapes":
        // Shapes will be handled by bottom sheet on mobile or inline on desktop
        break;
    }
  };

  return (
    <div className="w-16 bg-gray-50 border-r border-primary/10 flex flex-col items-center py-4 gap-2">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool)}
            className={cn(
              "w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-lg transition-all",
              isActive
                ? "bg-primary text-white"
                : "text-primary hover:bg-primary/10"
            )}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-tight text-center">
              {tool.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

