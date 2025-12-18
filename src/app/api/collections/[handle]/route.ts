// app/api/collections/[handle]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  db,
  collections,
  products,
  collectionProducts,
  variants,
} from "@/lib/db";
import { eq, and } from "drizzle-orm";
import {
  getCollectionByHandle,
  getProductsForCollection,
  mockProducts,
} from "@/lib/mock-data/collections";

// Map category handles to product types
const categoryToProductType: Record<string, string> = {
  "t-shirts": "T-Shirt",
  hoodies: "Hoodie",
  mugs: "Mug",
  "phone-cases": "Phone Case",
  "tote-bags": "Tote Bag",
  posters: "Poster",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    // Check if this is a product type category (t-shirts, hoodies, etc.)
    const productType = categoryToProductType[handle];

    let collection;
    let productsWithVariants: unknown[] = [];

    // Handle product type categories (virtual collections)
    if (productType) {
      // Create a virtual collection for this product type
      collection = {
        id: `category-${handle}`,
        shopify_collection_id: null,
        title: `${productType}s`,
        handle: handle,
        description: `Browse our collection of ${productType.toLowerCase()}s`,
        image_url: null,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Fetch products by product type from database
      try {
        const typeProducts = await db
          .select()
          .from(products)
          .where(
            and(
              eq(products.productType, productType),
              eq(products.status, "active")
            )
          );

        productsWithVariants = await Promise.all(
          typeProducts.map(async (product) => {
            const productVariants = await db
              .select()
              .from(variants)
              .where(eq(variants.productId, product.id));

            return {
              ...product,
              images: product.images as unknown[],
              tags: product.tags || [],
              variants: productVariants.map((v) => ({
                ...v,
                price: Number(v.price),
                compare_at_price: v.compareAtPrice
                  ? Number(v.compareAtPrice)
                  : undefined,
                available: (v.inventoryQuantity || 0) > 0,
              })),
            };
          })
        );
      } catch (dbError) {
        // If DB fails, fall back to mock data filtered by product type
        console.log(
          "Database query failed for product type, using mock data:",
          dbError
        );
        productsWithVariants = mockProducts
          .filter((p) => p.product_type === productType)
          .map((p) => ({
            ...p,
            images: p.images || [],
            tags: p.tags || [],
            variants: p.variants || [],
          }));
      }
    } else {
      // Regular collection - try database first
      try {
        const [dbCollection] = await db
          .select()
          .from(collections)
          .where(
            and(eq(collections.handle, handle), eq(collections.published, true))
          )
          .limit(1);

        if (dbCollection) {
          collection = dbCollection;

          // Special handling for "all" collection - fetch ALL products
          if (handle === "all") {
            const allProducts = await db
              .select()
              .from(products)
              .where(eq(products.status, "active"));

            productsWithVariants = await Promise.all(
              allProducts.map(async (product) => {
                const productVariants = await db
                  .select()
                  .from(variants)
                  .where(eq(variants.productId, product.id));

                return {
                  ...product,
                  images: product.images as unknown[],
                  tags: product.tags || [],
                  variants: productVariants.map((v) => ({
                    ...v,
                    price: Number(v.price),
                    compare_at_price: v.compareAtPrice
                      ? Number(v.compareAtPrice)
                      : undefined,
                    available: (v.inventoryQuantity || 0) > 0,
                  })),
                };
              })
            );
          } else {
            // Fetch products in collection with their variants
            const collectionProductsList = await db
              .select({
                product: products,
                position: collectionProducts.position,
              })
              .from(collectionProducts)
              .innerJoin(
                products,
                eq(collectionProducts.productId, products.id)
              )
              .where(
                and(
                  eq(collectionProducts.collectionId, collection.id),
                  eq(products.status, "active")
                )
              )
              .orderBy(collectionProducts.position);

            // Fetch variants for each product
            productsWithVariants = await Promise.all(
              collectionProductsList.map(async ({ product }) => {
                const productVariants = await db
                  .select()
                  .from(variants)
                  .where(eq(variants.productId, product.id));

                return {
                  ...product,
                  images: product.images as unknown[],
                  tags: product.tags || [],
                  variants: productVariants.map((v) => ({
                    ...v,
                    price: Number(v.price),
                    compare_at_price: v.compareAtPrice
                      ? Number(v.compareAtPrice)
                      : undefined,
                    available: (v.inventoryQuantity || 0) > 0,
                  })),
                };
              })
            );
          }
        }
      } catch (dbError) {
        // Database error, fall through to mock data
        console.log("Database query failed, using mock data:", dbError);
      }

      // Fallback to mock data if database doesn't have the collection
      if (!collection) {
        const mockCollection = getCollectionByHandle(handle);
        if (!mockCollection) {
          return NextResponse.json(
            { error: "Collection not found" },
            { status: 404 }
          );
        }

        collection = {
          id: mockCollection.id,
          shopify_collection_id: mockCollection.shopify_collection_id,
          title: mockCollection.title,
          handle: mockCollection.handle,
          description: mockCollection.description || "",
          image_url: mockCollection.image_url,
          published: mockCollection.published,
          created_at: mockCollection.created_at,
          updated_at: mockCollection.updated_at,
        };

        // Special handling for "all" collection - fetch ALL products from database
        if (handle === "all") {
          try {
            const allProducts = await db
              .select()
              .from(products)
              .where(eq(products.status, "active"));

            productsWithVariants = await Promise.all(
              allProducts.map(async (product) => {
                const productVariants = await db
                  .select()
                  .from(variants)
                  .where(eq(variants.productId, product.id));

                return {
                  ...product,
                  images: product.images as unknown[],
                  tags: product.tags || [],
                  variants: productVariants.map((v) => ({
                    ...v,
                    price: Number(v.price),
                    compare_at_price: v.compareAtPrice
                      ? Number(v.compareAtPrice)
                      : undefined,
                    available: (v.inventoryQuantity || 0) > 0,
                  })),
                };
              })
            );
          } catch (dbError) {
            // If DB fails, fall back to mock data
            console.log(
              'Database query failed for "all", using mock data:',
              dbError
            );
            productsWithVariants = getProductsForCollection(handle);
          }
        } else {
          productsWithVariants = getProductsForCollection(handle);
        }
      }
    }

    return NextResponse.json({
      collection: {
        ...collection,
        product_count: productsWithVariants.length,
      },
      products: productsWithVariants,
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
