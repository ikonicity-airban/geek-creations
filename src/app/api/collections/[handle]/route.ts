// app/api/collections/[handle]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, collections, products, collectionProducts, variants } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    // Fetch collection
    const [collection] = await db
      .select()
      .from(collections)
      .where(and(
        eq(collections.handle, handle),
        eq(collections.published, true)
      ))
      .limit(1);

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Fetch products in collection with their variants
    const collectionProductsList = await db
      .select({
        product: products,
        position: collectionProducts.position,
      })
      .from(collectionProducts)
      .innerJoin(products, eq(collectionProducts.productId, products.id))
      .where(and(
        eq(collectionProducts.collectionId, collection.id),
        eq(products.status, 'active')
      ))
      .orderBy(collectionProducts.position);

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      collectionProductsList.map(async ({ product }) => {
        const productVariants = await db
          .select()
          .from(variants)
          .where(eq(variants.productId, product.id));

        return {
          ...product,
          images: product.images as any,
          tags: product.tags || [],
          variants: productVariants.map(v => ({
            ...v,
            price: Number(v.price),
            compare_at_price: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
            available: (v.inventoryQuantity || 0) > 0,
          })),
        };
      })
    );

    return NextResponse.json({
      collection: {
        ...collection,
        product_count: productsWithVariants.length,
      },
      products: productsWithVariants,
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}