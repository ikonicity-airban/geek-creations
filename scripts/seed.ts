// seed.ts - Production-Ready Seed Script for Geek Creations POD Store
import {
  db,
  products,
  variants,
  collections,
  collectionProducts,
  designs,
  currencies,
  languages,
  siteSettings,
  translations,
  exchangeRates,
} from "@/lib/db";
import {
  mockProducts,
  mockCollections,
  collectionProductMap,
} from "@/lib/mock-data/collections";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // === CLEAR EXISTING DATA (SAFE FOR DEV) ===
    console.log("🗑️  Clearing existing seed data...");
    await db.delete(translations);
    await db.delete(exchangeRates);
    await db.delete(designs);
    await db.delete(collectionProducts);
    await db.delete(variants);
    await db.delete(products);
    await db.delete(collections);
    await db.delete(languages);
    await db.delete(currencies);
    await db.delete(siteSettings);
    console.log("  ✓ Cleared old data\n");

    // === 1. SEED CURRENCIES ===
    console.log("💰 Seeding currencies...");
    const currencyData = [
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        symbolPosition: "before",
        decimalPlaces: 2,
        isActive: true,
        isDefault: true,
        sortOrder: 1,
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        symbolPosition: "before",
        decimalPlaces: 2,
        isActive: true,
        isDefault: false,
        sortOrder: 2,
      },
      {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        symbolPosition: "before",
        decimalPlaces: 2,
        isActive: true,
        isDefault: false,
        sortOrder: 3,
      },
      {
        code: "NGN",
        name: "Nigerian Naira",
        symbol: "₦",
        symbolPosition: "before",
        decimalPlaces: 2,
        isActive: true,
        isDefault: false,
        sortOrder: 4,
      },
      {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$",
        symbolPosition: "before",
        decimalPlaces: 2,
        isActive: true,
        isDefault: false,
        sortOrder: 5,
      },
      {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
        symbolPosition: "before",
        decimalPlaces: 2,
        isActive: true,
        isDefault: false,
        sortOrder: 6,
      },
      {
        code: "JPY",
        name: "Japanese Yen",
        symbol: "¥",
        symbolPosition: "before",
        decimalPlaces: 0,
        isActive: true,
        isDefault: false,
        sortOrder: 7,
      },
    ];

    for (const currency of currencyData) {
      await db.insert(currencies).values(currency);
      console.log(`  ✓ ${currency.name} (${currency.code})`);
    }

    // === 2. SEED EXCHANGE RATES (based on USD) ===
    console.log("\n💱 Seeding exchange rates...");
    const exchangeRateData = [
      { baseCurrency: "USD", targetCurrency: "EUR", rate: "0.92" },
      { baseCurrency: "USD", targetCurrency: "GBP", rate: "0.79" },
      { baseCurrency: "USD", targetCurrency: "NGN", rate: "1550.00" },
      { baseCurrency: "USD", targetCurrency: "CAD", rate: "1.36" },
      { baseCurrency: "USD", targetCurrency: "AUD", rate: "1.53" },
      { baseCurrency: "USD", targetCurrency: "JPY", rate: "154.50" },
      { baseCurrency: "EUR", targetCurrency: "USD", rate: "1.09" },
      { baseCurrency: "GBP", targetCurrency: "USD", rate: "1.27" },
    ];

    for (const rate of exchangeRateData) {
      await db.insert(exchangeRates).values({
        ...rate,
        source: "manual",
        lastFetchedAt: new Date(),
      });
      console.log(
        `  ✓ ${rate.baseCurrency} → ${rate.targetCurrency}: ${rate.rate}`,
      );
    }

    // === 3. SEED LANGUAGES ===
    console.log("\n🌍 Seeding languages...");
    const languageData = [
      {
        code: "en",
        name: "English",
        nativeName: "English",
        flag: "🇺🇸",
        isActive: true,
        isDefault: true,
        isRTL: false,
        sortOrder: 1,
      },
      {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        flag: "🇪🇸",
        isActive: true,
        isDefault: false,
        isRTL: false,
        sortOrder: 2,
      },
      {
        code: "fr",
        name: "French",
        nativeName: "Français",
        flag: "🇫🇷",
        isActive: true,
        isDefault: false,
        isRTL: false,
        sortOrder: 3,
      },
      {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
        flag: "🇩🇪",
        isActive: true,
        isDefault: false,
        isRTL: false,
        sortOrder: 4,
      },
      {
        code: "ja",
        name: "Japanese",
        nativeName: "日本語",
        flag: "🇯🇵",
        isActive: true,
        isDefault: false,
        isRTL: false,
        sortOrder: 5,
      },
      {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
        flag: "🇸🇦",
        isActive: false,
        isDefault: false,
        isRTL: true,
        sortOrder: 6,
      },
    ];

    for (const language of languageData) {
      await db.insert(languages).values(language);
      console.log(`  ✓ ${language.name} (${language.code}) ${language.flag}`);
    }

    // === 4. SEED SITE SETTINGS ===
    console.log("\n⚙️  Seeding site settings...");
    const settingsData = [
      // General Settings
      {
        key: "site_name",
        value: "Geek Creations",
        type: "string",
        category: "general",
        description: "The name of the store",
        isPublic: true,
      },
      {
        key: "site_tagline",
        value: "Premium POD for Geeks & Creatives",
        type: "string",
        category: "general",
        description: "Store tagline/slogan",
        isPublic: true,
      },
      {
        key: "contact_email",
        value: "support@geekcreations.store",
        type: "string",
        category: "general",
        description: "Main contact email",
        isPublic: true,
      },
      {
        key: "support_phone",
        value: "+1 (555) 123-4567",
        type: "string",
        category: "general",
        description: "Support phone number",
        isPublic: true,
      },
      // SEO Settings
      {
        key: "meta_title",
        value: "Geek Creations | Premium Print-on-Demand Store",
        type: "string",
        category: "seo",
        description: "Default meta title for pages",
        isPublic: true,
      },
      {
        key: "meta_description",
        value:
          "Shop unique anime, gaming, and tech-inspired apparel. Premium quality print-on-demand merchandise for geeks and creatives worldwide.",
        type: "string",
        category: "seo",
        description: "Default meta description",
        isPublic: true,
      },
      // Social Media
      {
        key: "social_twitter",
        value: "https://twitter.com/geekcreations",
        type: "string",
        category: "social",
        description: "Twitter/X profile URL",
        isPublic: true,
      },
      {
        key: "social_instagram",
        value: "https://instagram.com/geekcreations",
        type: "string",
        category: "social",
        description: "Instagram profile URL",
        isPublic: true,
      },
      {
        key: "social_discord",
        value: "https://discord.gg/geekcreations",
        type: "string",
        category: "social",
        description: "Discord server invite URL",
        isPublic: true,
      },
      // Store Settings
      {
        key: "default_currency",
        value: "USD",
        type: "string",
        category: "store",
        description: "Default store currency code",
        isPublic: true,
      },
      {
        key: "default_language",
        value: "en",
        type: "string",
        category: "store",
        description: "Default store language code",
        isPublic: true,
      },
      {
        key: "free_shipping_threshold",
        value: "75",
        type: "number",
        category: "store",
        description: "Order amount for free shipping (in default currency)",
        isPublic: true,
      },
      {
        key: "enable_reviews",
        value: "true",
        type: "boolean",
        category: "store",
        description: "Enable product reviews",
        isPublic: false,
      },
      // Fulfillment Settings
      {
        key: "default_fulfillment_provider",
        value: "printful",
        type: "string",
        category: "fulfillment",
        description: "Default POD provider",
        isPublic: false,
      },
      {
        key: "auto_fulfill_orders",
        value: "true",
        type: "boolean",
        category: "fulfillment",
        description: "Automatically send orders to POD provider",
        isPublic: false,
      },
    ];

    for (const setting of settingsData) {
      await db.insert(siteSettings).values(setting);
      console.log(`  ✓ ${setting.key}: ${setting.value}`);
    }

    // === 5. SEED UI TRANSLATIONS ===
    console.log("\n📝 Seeding UI translations...");
    const translationData = [
      // Navigation - English
      { languageCode: "en", namespace: "nav", key: "home", value: "Home" },
      { languageCode: "en", namespace: "nav", key: "shop", value: "Shop" },
      {
        languageCode: "en",
        namespace: "nav",
        key: "collections",
        value: "Collections",
      },
      { languageCode: "en", namespace: "nav", key: "about", value: "About" },
      {
        languageCode: "en",
        namespace: "nav",
        key: "contact",
        value: "Contact",
      },
      { languageCode: "en", namespace: "nav", key: "cart", value: "Cart" },
      {
        languageCode: "en",
        namespace: "nav",
        key: "account",
        value: "Account",
      },
      // Navigation - Spanish
      { languageCode: "es", namespace: "nav", key: "home", value: "Inicio" },
      { languageCode: "es", namespace: "nav", key: "shop", value: "Tienda" },
      {
        languageCode: "es",
        namespace: "nav",
        key: "collections",
        value: "Colecciones",
      },
      { languageCode: "es", namespace: "nav", key: "about", value: "Nosotros" },
      {
        languageCode: "es",
        namespace: "nav",
        key: "contact",
        value: "Contacto",
      },
      { languageCode: "es", namespace: "nav", key: "cart", value: "Carrito" },
      { languageCode: "es", namespace: "nav", key: "account", value: "Cuenta" },
      // Navigation - French
      { languageCode: "fr", namespace: "nav", key: "home", value: "Accueil" },
      { languageCode: "fr", namespace: "nav", key: "shop", value: "Boutique" },
      {
        languageCode: "fr",
        namespace: "nav",
        key: "collections",
        value: "Collections",
      },
      { languageCode: "fr", namespace: "nav", key: "about", value: "À propos" },
      {
        languageCode: "fr",
        namespace: "nav",
        key: "contact",
        value: "Contact",
      },
      { languageCode: "fr", namespace: "nav", key: "cart", value: "Panier" },
      { languageCode: "fr", namespace: "nav", key: "account", value: "Compte" },
      // Common - English
      {
        languageCode: "en",
        namespace: "common",
        key: "add_to_cart",
        value: "Add to Cart",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "buy_now",
        value: "Buy Now",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "sold_out",
        value: "Sold Out",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "loading",
        value: "Loading...",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "search",
        value: "Search",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "filter",
        value: "Filter",
      },
      { languageCode: "en", namespace: "common", key: "sort", value: "Sort" },
      { languageCode: "en", namespace: "common", key: "price", value: "Price" },
      { languageCode: "en", namespace: "common", key: "size", value: "Size" },
      { languageCode: "en", namespace: "common", key: "color", value: "Color" },
      {
        languageCode: "en",
        namespace: "common",
        key: "quantity",
        value: "Quantity",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "subtotal",
        value: "Subtotal",
      },
      { languageCode: "en", namespace: "common", key: "total", value: "Total" },
      {
        languageCode: "en",
        namespace: "common",
        key: "checkout",
        value: "Checkout",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "continue_shopping",
        value: "Continue Shopping",
      },
      {
        languageCode: "en",
        namespace: "common",
        key: "free_shipping",
        value: "Free Shipping",
      },
      // Common - Spanish
      {
        languageCode: "es",
        namespace: "common",
        key: "add_to_cart",
        value: "Añadir al Carrito",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "buy_now",
        value: "Comprar Ahora",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "sold_out",
        value: "Agotado",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "loading",
        value: "Cargando...",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "search",
        value: "Buscar",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "filter",
        value: "Filtrar",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "sort",
        value: "Ordenar",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "price",
        value: "Precio",
      },
      { languageCode: "es", namespace: "common", key: "size", value: "Talla" },
      { languageCode: "es", namespace: "common", key: "color", value: "Color" },
      {
        languageCode: "es",
        namespace: "common",
        key: "quantity",
        value: "Cantidad",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "subtotal",
        value: "Subtotal",
      },
      { languageCode: "es", namespace: "common", key: "total", value: "Total" },
      {
        languageCode: "es",
        namespace: "common",
        key: "checkout",
        value: "Pagar",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "continue_shopping",
        value: "Seguir Comprando",
      },
      {
        languageCode: "es",
        namespace: "common",
        key: "free_shipping",
        value: "Envío Gratis",
      },
      // Footer - English
      {
        languageCode: "en",
        namespace: "footer",
        key: "copyright",
        value: "© 2025 Geek Creations. All rights reserved.",
      },
      {
        languageCode: "en",
        namespace: "footer",
        key: "privacy_policy",
        value: "Privacy Policy",
      },
      {
        languageCode: "en",
        namespace: "footer",
        key: "terms_of_service",
        value: "Terms of Service",
      },
      {
        languageCode: "en",
        namespace: "footer",
        key: "shipping_info",
        value: "Shipping Info",
      },
      {
        languageCode: "en",
        namespace: "footer",
        key: "returns",
        value: "Returns & Refunds",
      },
      { languageCode: "en", namespace: "footer", key: "faq", value: "FAQ" },
      // Footer - Spanish
      {
        languageCode: "es",
        namespace: "footer",
        key: "copyright",
        value: "© 2025 Geek Creations. Todos los derechos reservados.",
      },
      {
        languageCode: "es",
        namespace: "footer",
        key: "privacy_policy",
        value: "Política de Privacidad",
      },
      {
        languageCode: "es",
        namespace: "footer",
        key: "terms_of_service",
        value: "Términos de Servicio",
      },
      {
        languageCode: "es",
        namespace: "footer",
        key: "shipping_info",
        value: "Información de Envío",
      },
      {
        languageCode: "es",
        namespace: "footer",
        key: "returns",
        value: "Devoluciones y Reembolsos",
      },
      {
        languageCode: "es",
        namespace: "footer",
        key: "faq",
        value: "Preguntas Frecuentes",
      },
    ];

    for (const t of translationData) {
      await db.insert(translations).values(t);
    }
    console.log(`  ✓ Added ${translationData.length} translations`);

    // === 6. SEED COLLECTIONS ===
    console.log("\n📦 Seeding collections...");
    const collectionMap = new Map<string, string>();

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

    // === 7. SEED PRODUCTS & VARIANTS ===
    console.log("\n📦 Seeding products & variants...");
    const productMap = new Map<string, string>();

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

    // === 8. LINK COLLECTIONS ↔ PRODUCTS ===
    console.log("\n🔗 Linking collections to products...");
    for (const [collectionHandle, productHandles] of Object.entries(
      collectionProductMap,
    )) {
      const collectionId = collectionMap.get(collectionHandle);
      if (!collectionId) {
        console.warn(
          `  ⚠ Collection handle "${collectionHandle}" not found – skipping`,
        );
        continue;
      }

      let position = 0;
      for (const productHandle of productHandles) {
        const productId = productMap.get(productHandle);
        if (!productId) {
          console.warn(
            `  ⚠ Product handle "${productHandle}" not found – skipping`,
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
        `  ✓ ${collectionHandle} ← ${productHandles.length} products`,
      );
    }

    // === 9. SEED SAMPLE DESIGNS ===
    console.log("\n🎨 Seeding sample designs...");
    const sampleDesigns = [
      {
        title: "Epic Anime Warrior",
        description: "High-energy anime hero design perfect for tees",
        imageUrl:
          "https://via.placeholder.com/3000x3000/401268/ffffff?text=Anime+Hero",
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

    console.log("\n✅ Database seeded successfully! Ready for frontend dev.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
