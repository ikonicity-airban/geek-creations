import {
  db,
  products,
  variants,
  collections,
  collectionProducts,
  designs,
} from "@/lib/db";
import {
  mockProducts,
  mockCollections,
  collectionProductMap,
} from "@/lib/mock-data/collections";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed Collections
    console.log("📦 Seeding collections...");
    const collectionMap = new Map<string, string>();

    for (const mockCollection of mockCollections) {
      const [inserted] = await db
        .insert(collections)
        .values({
          title: mockCollection.title,
          handle: mockCollection.handle,
          description: mockCollection.description || "",
          imageUrl: mockCollection.image_url,
          published: mockCollection.published,
          shopifyCollectionId: mockCollection.shopify_collection_id,
        })
        .returning();

      collectionMap.set(mockCollection.handle, inserted.id);
      console.log(`  ✓ ${mockCollection.title}`);
    }

    // Seed Products
    console.log("📦 Seeding products...");
    const productMap = new Map<string, string>();

    for (const mockProduct of mockProducts) {
      const [inserted] = await db
        .insert(products)
        .values({
          shopifyProductId: mockProduct.shopify_product_id,
          title: mockProduct.title,
          handle: mockProduct.handle,
          description: mockProduct.description || "",
          vendor: mockProduct.vendor || "Geek Creations",
          productType: mockProduct.product_type || "Apparel",
          tags: mockProduct.tags || [],
          status: mockProduct.status || "active",
          fulfillmentProvider: mockProduct.fulfillment_provider || "printful",
          images: mockProduct.images || [],
        })
        .returning();

      productMap.set(mockProduct.id, inserted.id);
      console.log(`  ✓ ${mockProduct.title}`);

      // Seed Variants for this product
      for (const mockVariant of mockProduct.variants) {
        await db.insert(variants).values({
          productId: inserted.id,
          shopifyVariantId: mockVariant.shopify_variant_id,
          title: mockVariant.title,
          price: mockVariant.price.toString(),
          compareAtPrice: mockVariant.compare_at_price?.toString() || null,
          sku: mockVariant.sku || "",
          inventoryQuantity: mockVariant.inventory_quantity || 0,
          weight: mockVariant.weight?.toString() || null,
          weightUnit: mockVariant.weight_unit || "kg",
          option1: mockVariant.option1 || null,
          option2: mockVariant.option2 || null,
          option3: mockVariant.option3 || null,
        });
      }
    }

    // Seed Collection-Product relationships
    console.log("🔗 Linking collections to products...");
    for (const [collectionHandle, productIds] of Object.entries(
      collectionProductMap
    )) {
      const collectionId = collectionMap.get(collectionHandle);
      if (!collectionId) continue;

      let position = 0;
      for (const mockProductId of productIds) {
        const productId = productMap.get(mockProductId);
        if (!productId) continue;

        await db.insert(collectionProducts).values({
          collectionId,
          productId,
          position,
        });
        position++;
      }
      console.log(`  ✓ ${collectionHandle} (${productIds.length} products)`);
    }

    // Seed some sample designs
    console.log("🎨 Seeding designs...");
    const sampleDesigns = [
      {
        title: "Anime Hero Design",
        description: "Epic anime hero artwork",
        imageUrl: "/img/blank_isolated_white_and_black_t_shirt_front_view.jpg",
        category: "anime",
        tags: ["anime", "hero", "action"],
      },
      {
        title: "Tech Geek Logo",
        description: "Modern tech-inspired design",
        imageUrl: "/img/hoodie-2.jpg",
        category: "tech",
        tags: ["tech", "modern", "minimalist"],
      },
      {
        title: "Gaming Legend Badge",
        description: "Legendary gaming emblem",
        imageUrl: "/img/tshirt.jpg",
        category: "gaming",
        tags: ["gaming", "esports", "competitive"],
      },
    ];

    for (const design of sampleDesigns) {
      await db.insert(designs).values(design);
      console.log(`  ✓ ${design.title}`);
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
