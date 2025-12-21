// seed.ts - Production-Ready Seed Script for Geek Creations POD Store
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
  collectionProductMap, // { [collectionHandle: string]: string[] } where string[] = product handles
} from "@/lib/mock-data/collections";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // === CLEAR EXISTING DATA (SAFE FOR DEV) ===
    console.log("🗑️  Clearing existing seed data...");
    await db.delete(designs);
    await db.delete(collectionProducts);
    await db.delete(variants);
    await db.delete(products);
    await db.delete(collections);
    console.log("  ✓ Cleared old data\n");
    // 1. Seed Collections
    console.log("📦 Seeding collections...");
    const collectionMap = new Map<string, string>(); // handle → db id

    for (const mockCollection of mockCollections) {
      const [inserted] = await db
        .insert(collections)
        .values({
          title: mockCollection.title,
          handle: mockCollection.handle,
          description: mockCollection.description || "",
          imageUrl: mockCollection.image_url || null,
          published: mockCollection.published ?? true,
          shopifyCollectionId: mockCollection.shopify_collection_id || null,
        })
        .returning();

      collectionMap.set(mockCollection.handle, inserted.id);
      console.log(`  ✓ ${mockCollection.title} (${mockCollection.handle})`);
    }

    // 2. Seed Products + Variants
    console.log("📦 Seeding products & variants...");
    const productMap = new Map<string, string>(); // product handle → db id

    for (const mockProduct of mockProducts) {
      const [insertedProduct] = await db
        .insert(products)
        .values({
          shopifyProductId: mockProduct.shopify_product_id,
          title: mockProduct.title,
          handle: mockProduct.handle,
          description: mockProduct.description || "",
          featuredImage: mockProduct.featuredImage || null,
          vendor: mockProduct.vendor || "Geek Creations",
          productType: mockProduct.product_type || "Apparel",
          tags: mockProduct.tags || [],
          status: mockProduct.status || "active",
          fulfillmentProvider: mockProduct.fulfillment_provider || "printful",
          images: mockProduct.images || [],
        })
        .returning();

      productMap.set(mockProduct.handle, insertedProduct.id);
      console.log(`  ✓ ${mockProduct.title} (${mockProduct.handle})`);

      // Seed Variants
      for (const mockVariant of mockProduct.variants || []) {
        await db.insert(variants).values({
          productId: insertedProduct.id,
          shopifyVariantId: mockVariant.shopify_variant_id,
          title: mockVariant.title,
          price: mockVariant.price.toString(),
          compareAtPrice: mockVariant.compare_at_price?.toString() || null,
          sku: mockVariant.sku || null,
          inventoryQuantity: mockVariant.inventory_quantity || 0,
          weight: mockVariant.weight?.toString() || null,
          weightUnit: mockVariant.weight_unit || "kg",
          option1: mockVariant.option1 || null,
          option2: mockVariant.option2 || null,
          option3: mockVariant.option3 || null,
          imageId: mockVariant.image_id || null,
        });
        console.log(`    ├─ Variant: ${mockVariant.title}`);
      }
    }

    // 3. Link Collections ↔ Products
    console.log("🔗 Linking collections to products...");
    for (const [collectionHandle, productHandles] of Object.entries(
      collectionProductMap
    )) {
      const collectionId = collectionMap.get(collectionHandle);
      if (!collectionId) {
        console.warn(
          `  ⚠ Collection handle "${collectionHandle}" not found – skipping`
        );
        continue;
      }

      let position = 0;
      for (const productHandle of productHandles) {
        const productId = productMap.get(productHandle);
        if (!productId) {
          console.warn(
            `  ⚠ Product handle "${productHandle}" not found – skipping`
          );
          continue;
        }

        await db.insert(collectionProducts).values({
          collectionId,
          productId,
          position,
        });
        position++;
      }
      console.log(
        `  ✓ ${collectionHandle} ← ${productHandles.length} products`
      );
    }

    // 4. Seed Sample Designs (with placeholder URLs – replace later with Supabase URLs)
    console.log("🎨 Seeding sample designs...");
    const sampleDesigns = [
      {
        title: "Epic Anime Warrior",
        description: "High-energy anime hero design perfect for tees",
        imageUrl:
          "https://via.placeholder.com/3000x3000/401268/ffffff?text=Anime+Hero", // temp placeholder
        thumbnailUrl:
          "https://via.placeholder.com/600x600/401268/ffffff?text=Anime+Hero",
        category: "Anime",
        tags: ["anime", "hero", "japan", "manga"],
        isActive: true,
        sortOrder: 1,
      },
      {
        title: "Minimal Tech Circuit",
        description: "Clean circuit board pattern for tech lovers",
        imageUrl:
          "https://via.placeholder.com/3000x3000/c5a3ff/401268?text=Tech+Circuit",
        thumbnailUrl:
          "https://via.placeholder.com/600x600/c5a3ff/401268?text=Tech+Circuit",
        category: "Tech",
        tags: ["tech", "circuit", "minimal", "geek"],
        isActive: true,
        sortOrder: 2,
      },
      {
        title: "Gaming Legend Badge",
        description: "Bold gaming emblem for true players",
        imageUrl:
          "https://via.placeholder.com/3000x3000/e2ae3d/401268?text=Gaming+Legend",
        thumbnailUrl:
          "https://via.placeholder.com/600x600/e2ae3d/401268?text=Gaming+Legend",
        category: "Gaming",
        tags: ["gaming", "esports", "controller", "legend"],
        isActive: true,
        sortOrder: 3,
      },
    ];

    for (const design of sampleDesigns) {
      await db.insert(designs).values(design).returning();
      console.log(`  ✓ ${design.title}`);
    }

    console.log("✅ Database seeded successfully! Ready for frontend dev.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
