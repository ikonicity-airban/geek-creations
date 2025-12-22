"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Product, Variant } from "@/types";
import { Button } from "../ui/button";

interface VariantSelectorProps {
  product: Product;
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
}

interface VariantOption {
  name: string;
  values: string[];
}

export default function VariantSelector({
  product,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  // Extract unique options from variants
  const options = useMemo<VariantOption[]>(() => {
    const optionMap = new Map<string, Set<string>>();

    product.variants.forEach((variant) => {
      if (variant.option1) {
        if (!optionMap.has("Size")) {
          optionMap.set("Size", new Set());
        }
        optionMap.get("Size")!.add(variant.option1);
      }
      if (variant.option2) {
        if (!optionMap.has("Color")) {
          optionMap.set("Color", new Set());
        }
        optionMap.get("Color")!.add(variant.option2);
      }
      if (variant.option3) {
        if (!optionMap.has("Style")) {
          optionMap.set("Style", new Set());
        }
        optionMap.get("Style")!.add(variant.option3);
      }
    });

    return Array.from(optionMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values).sort(),
    }));
  }, [product.variants]);

  // Get available variants based on selected options
  const getAvailableVariants = (selectedOptions: Record<string, string>) => {
    return product.variants.filter((variant) => {
      if (selectedOptions.Size && variant.option1 !== selectedOptions.Size) {
        return false;
      }
      if (selectedOptions.Color && variant.option2 !== selectedOptions.Color) {
        return false;
      }
      if (selectedOptions.Style && variant.option3 !== selectedOptions.Style) {
        return false;
      }
      return true;
    });
  };

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    if (selectedVariant) {
      if (selectedVariant.option1) initial.Size = selectedVariant.option1;
      if (selectedVariant.option2) initial.Color = selectedVariant.option2;
      if (selectedVariant.option3) initial.Style = selectedVariant.option3;
    } else if (product.variants.length > 0) {
      // Default to first available variant
      const firstVariant =
        product.variants.find((v) => v.available) || product.variants[0];
      if (firstVariant.option1) initial.Size = firstVariant.option1;
      if (firstVariant.option2) initial.Color = firstVariant.option2;
      if (firstVariant.option3) initial.Style = firstVariant.option3;
      onVariantChange(firstVariant);
    }
    return initial;
  });

  const handleOptionChange = (optionName: string, value: string) => {
    const newSelectedOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newSelectedOptions);

    // Find matching variant
    const matchingVariant = product.variants.find((variant) => {
      const sizeMatch =
        !newSelectedOptions.Size || variant.option1 === newSelectedOptions.Size;
      const colorMatch =
        !newSelectedOptions.Color ||
        variant.option2 === newSelectedOptions.Color;
      const styleMatch =
        !newSelectedOptions.Style ||
        variant.option3 === newSelectedOptions.Style;
      return sizeMatch && colorMatch && styleMatch;
    });

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  const isOptionAvailable = (optionName: string, value: string) => {
    const testOptions = { ...selectedOptions, [optionName]: value };
    const available = getAvailableVariants(testOptions);
    return available.length > 0 && available.some((v) => v.available);
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.name}>
          <label className="block text-sm font-bold mb-3">{option.name}</label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionAvailable(option.name, value);
              const isDisabled = !isAvailable;

              return (
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  key={value}
                  onClick={() =>
                    !isDisabled && handleOptionChange(option.name, value)
                  }
                  disabled={isDisabled}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                Selected: {selectedVariant.title}
              </p>
              {!selectedVariant.available && (
                <p className="text-xs mt-1 text-accent">Out of Stock</p>
              )}
              {selectedVariant.available &&
                selectedVariant.inventory_quantity > 0 && (
                  <p className="text-xs mt-1 opacity-70">
                    {selectedVariant.inventory_quantity} in stock
                  </p>
                )}
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-primary">
                ₦{selectedVariant.price.toLocaleString()}
              </p>
              {selectedVariant.compare_at_price && (
                <p className="text-sm line-through opacity-60">
                  ₦{selectedVariant.compare_at_price.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
