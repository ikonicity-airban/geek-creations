// app/api/products/[handle]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { products, variants } from "@/lib/db/schema";
import type { Product, Variant } from "@/types";
import { mockProducts } from "@/lib/mock-data/collections";

/**
 * GET /api/products/[handle]
 *
 * Returns a single product in the same shape as our `Product` type
 * (and mock data) so it can be used directly by the PDP.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;

    // Try to fetch from database first
    let productRow;
    try {
      [productRow] = await db
        .select()
        .from(products)
        .where(and(eq(products.handle, handle), eq(products.status, "active")))
        .limit(1);
    } catch (dbError) {
      // Database error, will fallback to mock data
      console.log("Database query failed, using mock data:", dbError);
    }

    // Fallback to mock data if not found in database
    if (!productRow) {
      const mockProduct = mockProducts.find((p) => p.handle === handle);
      if (mockProduct) {
        return NextResponse.json({ product: mockProduct });
      }
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch variants for this product
    const variantRows = await db
      .select()
      .from(variants)
      .where(eq(variants.productId, productRow.id));

    // Map DB rows to our public `Variant` type
    const mappedVariants: Variant[] = variantRows.map((v) => ({
      id: v.id,
      product_id: v.productId,
      shopify_variant_id: v.shopifyVariantId,
      title: v.title || "",
      price: Number(v.price),
      compare_at_price: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
      sku: v.sku || "",
      inventory_quantity: v.inventoryQuantity || 0,
      weight: v.weight ? Number(v.weight) : undefined,
      weight_unit: v.weightUnit || undefined,
      option1: v.option1 || undefined,
      option2: v.option2 || undefined,
      option3: v.option3 || undefined,
      image_id: v.imageId || undefined,
      available: (v.inventoryQuantity || 0) > 0,
      created_at: v.createdAt?.toISOString() || "",
      updated_at: v.updatedAt?.toISOString() || "",
    }));

    // Map DB product row to our public `Product` type
    const mappedProduct: Product = {
      id: productRow.id,
      shopify_product_id: productRow.shopifyProductId,
      title: productRow.title,
      handle: productRow.handle,
      description: productRow.description ?? "",
      vendor: productRow.vendor ?? "",
      product_type: productRow.productType ?? "",
      tags: productRow.tags ?? [],
      status: (productRow.status as Product["status"]) || "active",
      fulfillment_provider:
        (productRow.fulfillmentProvider as Product["fulfillment_provider"]) ||
        "printful",
      // Images are already stored as JSON in the correct structure
      images: (productRow.images as Product["images"]) || [],
      featuredImage: productRow.featuredImage ?? undefined,
      variants: mappedVariants,
      created_at: productRow.createdAt?.toISOString() || "",
      updated_at: productRow.updatedAt?.toISOString() || "",
    };

    return NextResponse.json({ product: mappedProduct });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
