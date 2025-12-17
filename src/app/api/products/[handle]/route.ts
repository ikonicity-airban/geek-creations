// app/api/products/[handle]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, products, variants } from '@/lib/db';
import { eq, and } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    // Fetch product
    const [product] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.handle, handle),
        eq(products.status, 'active')
      ))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch variants
    const productVariants = await db
      .select()
      .from(variants)
      .where(eq(variants.productId, product.id));

    const productWithVariants = {
      ...product,
      images: product.images as unknown[],
      tags: product.tags || [],
      variants: productVariants.map(v => ({
        ...v,
        price: Number(v.price),
        compare_at_price: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
        available: (v.inventoryQuantity || 0) > 0,
      })),
    };

    return NextResponse.json({
      product: productWithVariants,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}