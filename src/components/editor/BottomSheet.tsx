"use client";

import React, { useEffect } from "react";
import { X, Circle, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Product } from "@/types";
import Image from "next/image";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  content: "colors" | "fonts" | "shapes" | "text" | "products" | null;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  selectedFont: string;
  onFontSelect: (font: string) => void;
  onShapeSelect: (shape: "circle" | "rectangle") => void;
  presetColors: string[];
  fonts: string[];
  textInput?: string;
  onTextInputChange?: (text: string) => void;
  onTextAdd?: () => void;
  products?: Product[];
  selectedProduct?: Product | null;
  onProductSelect?: (product: Product) => void;
}

export function BottomSheet({
  isOpen,
  onClose,
  content,
  selectedColor,
  onColorSelect,
  selectedFont,
  onFontSelect,
  onShapeSelect,
  presetColors,
  fonts,
  textInput = "",
  onTextInputChange,
  onTextAdd,
  products = [],
  selectedProduct,
  onProductSelect,
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto md:hidden"
          >
            <div className="sticky top-0 bg-white border-b border-primary/20 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary">
                {content === "colors" && "Select Color"}
                {content === "fonts" && "Select Font"}
                {content === "shapes" && "Add Shape"}
                {content === "text" && "Add Text"}
                {content === "products" && "Select Product"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            <div className="p-4">
              {content === "text" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Enter Text
                    </label>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => onTextInputChange?.(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && onTextAdd?.()}
                      placeholder="Enter your text..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Font
                    </label>
                    <select
                      value={selectedFont}
                      onChange={(e) => onFontSelect(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:outline-none"
                      style={{ fontFamily: selectedFont }}
                    >
                      {fonts.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Color
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => onColorSelect(color)}
                          className={cn(
                            "aspect-square rounded-lg border-2 transition-all",
                            selectedColor === color
                              ? "border-primary border-4"
                              : "border-gray-300"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onTextAdd?.();
                      onClose();
                    }}
                    disabled={!textInput.trim()}
                    className="w-full py-3 rounded-lg font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Text
                  </button>
                </div>
              )}
              {content === "colors" && (
                <div className="grid grid-cols-6 gap-3">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        onColorSelect(color);
                        onClose();
                      }}
                      className={cn(
                        "aspect-square rounded-lg border-2 transition-all hover:scale-110",
                        selectedColor === color
                          ? "border-primary border-4"
                          : "border-gray-300"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {content === "fonts" && (
                <div className="space-y-2">
                  {fonts.map((font) => (
                    <button
                      key={font}
                      onClick={() => {
                        onFontSelect(font);
                        onClose();
                      }}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg text-left border-2 transition-all",
                        selectedFont === font
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-primary/50"
                      )}
                      style={{ fontFamily: font }}
                    >
                      <span className="font-medium">{font}</span>
                    </button>
                  ))}
                </div>
              )}

              {content === "shapes" && (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onShapeSelect("circle");
                      onClose();
                    }}
                    className="h-24 flex-col gap-2"
                  >
                    <Circle className="w-8 h-8" />
                    <span>Circle</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onShapeSelect("rectangle");
                      onClose();
                    }}
                    className="h-24 flex-col gap-2"
                  >
                    <Square className="w-8 h-8" />
                    <span>Rectangle</span>
                  </Button>
                </div>
              )}

              {content === "products" && (
                <div className="space-y-2">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        onProductSelect?.(product);
                        onClose();
                      }}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-all text-left",
                        selectedProduct?.id === product.id
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-primary/50"
                      )}
                    >
                      {product.images[0] && (
                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={product.images[0].src}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-primary truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {product.product_type}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-4" /> {/* Bottom padding for safe area */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

