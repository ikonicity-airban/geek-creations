// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, products, variants, collections, collectionProducts } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import type { Product } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const collectionHandle = searchParams.get("collection");

    let productRows;

    if (collectionHandle) {
      // Fetch products from a specific collection
      const [collection] = await db
        .select()
        .from(collections)
        .where(and(eq(collections.handle, collectionHandle), eq(collections.published, true)))
        .limit(1);

      if (!collection) {
        return NextResponse.json({ products: [] });
      }

      const collectionProductsList = await db
        .select({
          product: products,
          position: collectionProducts.position,
        })
        .from(collectionProducts)
        .innerJoin(products, eq(collectionProducts.productId, products.id))
        .where(and(
          eq(collectionProducts.collectionId, collection.id),
          eq(products.status, "active")
        ))
        .orderBy(collectionProducts.position)
        .limit(limit);

      productRows = collectionProductsList.map(({ product }) => product);
    } else {
      // Fetch all active products
      productRows = await db
        .select()
        .from(products)
        .where(eq(products.status, "active"))
        .limit(limit);
    }

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      productRows.map(async (product) => {
        const variantRows = await db
          .select()
          .from(variants)
          .where(eq(variants.productId, product.id));

        const mappedVariants = variantRows.map((v) => ({
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

        const mappedProduct: Product = {
          id: product.id,
          shopify_product_id: product.shopifyProductId,
          title: product.title,
          handle: product.handle,
          description: product.description ?? "",
          vendor: product.vendor ?? "",
          product_type: product.productType ?? "",
          tags: product.tags ?? [],
          status: (product.status as Product["status"]) || "active",
          fulfillment_provider:
            (product.fulfillmentProvider as Product["fulfillment_provider"]) ||
            "printful",
          images: (product.images as Product["images"]) || [],
          featuredImage: product.featuredImage ?? undefined,
          variants: mappedVariants,
          created_at: product.createdAt?.toISOString() || "",
          updated_at: product.updatedAt?.toISOString() || "",
        };

        return mappedProduct;
      })
    );

    return NextResponse.json({ products: productsWithVariants });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

