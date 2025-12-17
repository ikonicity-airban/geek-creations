// app/api/collections/[handle]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, collections, products, collectionProducts, variants } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCollectionByHandle, getProductsForCollection } from '@/lib/mock-data/collections';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    // Try to fetch from database first
    let collection;
    let productsWithVariants: any[] = [];

    try {
      const [dbCollection] = await db
        .select()
        .from(collections)
        .where(and(
          eq(collections.handle, handle),
          eq(collections.published, true)
        ))
        .limit(1);

      if (dbCollection) {
        collection = dbCollection;

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
        productsWithVariants = await Promise.all(
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
      }
    } catch (dbError) {
      // Database error, fall through to mock data
      console.log('Database query failed, using mock data:', dbError);
    }

    // Fallback to mock data if database doesn't have the collection
    if (!collection) {
      const mockCollection = getCollectionByHandle(handle);
      if (!mockCollection) {
        return NextResponse.json(
          { error: 'Collection not found' },
          { status: 404 }
        );
      }

      collection = {
        id: mockCollection.id,
        shopify_collection_id: mockCollection.shopify_collection_id,
        title: mockCollection.title,
        handle: mockCollection.handle,
        description: mockCollection.description || '',
        image_url: mockCollection.image_url,
        published: mockCollection.published,
        created_at: mockCollection.created_at,
        updated_at: mockCollection.updated_at,
      };

      productsWithVariants = getProductsForCollection(handle);
    }

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