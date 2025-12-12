// app/api/cron/sync-inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, products, variants, collections } from '@/lib/db';
import { syncProducts, syncCollections } from '@/lib/shopify';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting inventory sync...');

    // Sync products
    const shopifyProducts = await syncProducts();
    
    for (const product of shopifyProducts) {
      // Extract Shopify ID from GraphQL ID
      const shopifyProductId = parseInt(product.id.split('/').pop() || '0');

      // Prepare product data
      const productData = {
        shopifyProductId,
        title: product.title,
        handle: product.handle,
        description: product.description || '',
        vendor: product.vendor || '',
        productType: product.productType || '',
        tags: product.tags || [],
        status: product.status.toLowerCase(),
        fulfillmentProvider: product.metafields?.edges?.find(
          (m: any) => m.node.namespace === 'custom' && m.node.key === 'fulfillment_provider'
        )?.node.value || 'printful',
        images: product.images.edges.map((img: any, idx: number) => ({
          id: img.node.id,
          src: img.node.src,
          alt: img.node.altText || product.title,
          position: idx,
        })),
        updatedAt: new Date(),
      };

      // Upsert product
      const [existingProduct] = await db
        .select()
        .from(products)
        .where(eq(products.shopifyProductId, shopifyProductId))
        .limit(1);

      let productId: string;

      if (existingProduct) {
        await db
          .update(products)
          .set(productData)
          .where(eq(products.id, existingProduct.id));
        productId = existingProduct.id;
      } else {
        const [newProduct] = await db
          .insert(products)
          .values(productData)
          .returning();
        productId = newProduct.id;
      }

      // Sync variants
      for (const variantEdge of product.variants.edges) {
        const variant = variantEdge.node;
        const shopifyVariantId = parseInt(variant.id.split('/').pop() || '0');

        const variantData = {
          productId,
          shopifyVariantId,
          title: variant.title,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice || null,
          sku: variant.sku || '',
          inventoryQuantity: variant.inventoryQuantity || 0,
          weight: variant.weight ? String(variant.weight) : null,
          weightUnit: variant.weightUnit || 'kg',
          option1: variant.selectedOptions[0]?.value || null,
          option2: variant.selectedOptions[1]?.value || null,
          option3: variant.selectedOptions[2]?.value || null,
          updatedAt: new Date(),
        };

        const [existingVariant] = await db
          .select()
          .from(variants)
          .where(eq(variants.shopifyVariantId, shopifyVariantId))
          .limit(1);

        if (existingVariant) {
          await db
            .update(variants)
            .set(variantData)
            .where(eq(variants.id, existingVariant.id));
        } else {
          await db.insert(variants).values(variantData);
        }
      }
    }

    // Sync collections
    const shopifyCollections = await syncCollections();

    for (const collection of shopifyCollections) {
      const shopifyCollectionId = parseInt(collection.id.split('/').pop() || '0');

      const collectionData = {
        shopifyCollectionId,
        title: collection.title,
        handle: collection.handle,
        description: collection.description || '',
        imageUrl: collection.image?.src || null,
        published: true,
        updatedAt: new Date(),
      };

      const [existingCollection] = await db
        .select()
        .from(collections)
        .where(eq(collections.shopifyCollectionId, shopifyCollectionId))
        .limit(1);

      if (existingCollection) {
        await db
          .update(collections)
          .set(collectionData)
          .where(eq(collections.id, existingCollection.id));
      } else {
        await db.insert(collections).values(collectionData);
      }
    }

    console.log('Inventory sync completed successfully');

    return NextResponse.json({
      success: true,
      synced: {
        products: shopifyProducts.length,
        collections: shopifyCollections.length,
      },
    });
  } catch (error) {
    console.error('Inventory sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}