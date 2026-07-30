"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";

interface ProductPreviewProps {
  product: Product | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
        Real Product & Design Preview
      </h3>
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-border/50 shadow-inner">
        {/* Real Product Image */}
        {productImage && (
          <Image
            src={productImage}
            alt={product.title}
            fill
            className="object-contain"
          />
        )}

        {/* Design Overlay placed in exact print surface position */}
        {canvasDataUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none"
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${canvasDataUrl})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-3 text-xs">
        <div className="font-bold text-foreground truncate">{product.title}</div>
        {variant && (
          <div className="text-muted-foreground font-medium text-[11px]">
            {variant.title}
          </div>
        )}
      </div>
    </div>
  );
}
