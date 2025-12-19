"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";

interface ProductPreviewProps {
  product: Product | null;
  variant: any;
  canvasDataUrl?: string;
}

export function ProductPreview({
  product,
  variant,
  canvasDataUrl,
}: ProductPreviewProps) {
  if (!product) return null;

  const productImage =
    variant?.image_id && product.images.find((img) => img.id === variant.image_id)
      ? product.images.find((img) => img.id === variant.image_id)?.src
      : product.images[0]?.src;

  return (
    <div className="bg-white rounded-xl p-4 border border-primary/20">
      <h3 className="text-sm font-semibold text-primary mb-3">Preview</h3>
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {productImage && (
          <Image
            src={productImage}
            alt={product.title}
            fill
            className="object-contain"
          />
        )}
        {canvasDataUrl && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${canvasDataUrl})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              mixBlendMode: "multiply",
            }}
          />
        )}
      </div>
      <div className="mt-3 text-sm">
        <div className="font-semibold text-primary">{product.title}</div>
        {variant && (
          <div className="text-gray-600 text-xs">{variant.title}</div>
        )}
      </div>
    </div>
  );
}

