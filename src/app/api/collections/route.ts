// app/api/collections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getAllCollections } from '@/lib/mock-data/collections';

export async function GET(req: NextRequest) {
  try {
    // Try to fetch from database first
    let dbCollections: any[] = [];

    try {
      dbCollections = await db
        .select()
        .from(collections)
        .where(eq(collections.published, true))
        .orderBy(collections.createdAt);
    } catch (dbError) {
      // Database error, fall through to mock data
      console.log('Database query failed, using mock data:', dbError);
    }

    // Fallback to mock data if database is empty or has errors
    if (dbCollections.length === 0) {
      const mockCollections = getAllCollections();
      return NextResponse.json({
        collections: mockCollections.map(c => ({
          id: c.id,
          shopify_collection_id: c.shopify_collection_id,
          title: c.title,
          handle: c.handle,
          description: c.description,
          image_url: c.image_url,
          product_count: c.product_count,
          published: c.published,
          created_at: c.created_at,
          updated_at: c.updated_at,
        })),
      });
    }

    return NextResponse.json({
      collections: dbCollections.map(c => ({
        id: c.id,
        shopify_collection_id: c.shopifyCollectionId,
        title: c.title,
        handle: c.handle,
        description: c.description || '',
        image_url: c.imageUrl,
        product_count: 0, // Would need to count separately
        published: c.published,
        created_at: c.createdAt.toISOString(),
        updated_at: c.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

