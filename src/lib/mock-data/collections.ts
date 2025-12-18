// Mock collection data for development and styling
// lib/mock-data/collections.ts - FIXED WITH GLOBAL UNIQUE VARIANT IDs
import { Collection, Product, Variant, ProductImage } from "@/types";

const now = new Date().toISOString();

// === GLOBAL VARIANT ID COUNTER (BigInt for safety) ===
let globalVariantId = BigInt(9000000000); // Starts high, increments forever

// Helper to create product images (unchanged)
const createImages = (src: string, alt?: string): ProductImage[] => [
  {
    id: `img-${Math.random().toString(36).slice(2, 9)}`,
    src,
    alt: alt || "Product image",
    position: 0,
  },
];

// Helper to create variants – now uses GLOBAL counter
const createVariants = (
  productId: string,
  basePrice: number,
  sizes: string[] = ["S", "M", "L", "XL"],
  colors: string[] = ["Black", "White"]
): Variant[] => {
  const variants: Variant[] = [];

  sizes.forEach((size) => {
    colors.forEach((color) => {
      const priceAdjustment =
        sizes.indexOf(size) * 500 + colors.indexOf(color) * 300;
      const price = basePrice + priceAdjustment;
      const compareAtPrice =
        Math.random() > 0.7 ? Math.round(price * 1.3) : undefined;

      variants.push({
        id: `var-${productId}-${globalVariantId}`,
        product_id: productId,
        // ← GLOBAL UNIQUE ID
        shopify_variant_id: Number(globalVariantId++),
        title: `${size} / ${color}`,
        price: Math.round(price),
        compare_at_price: compareAtPrice,
        sku: `SKU-${productId}-${size}-${color}`,
        inventory_quantity: Math.floor(Math.random() * 50) + 10,
        weight: 0.3,
        weight_unit: "kg",
        option1: size,
        option2: color,
        available: true,
        created_at: now,
        updated_at: now,
      });
    });
  });

  return variants;
};

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    shopify_product_id: 1001,
    title: "Anime Hero Classic Tee",
    handle: "anime-hero-classic-tee",
    description:
      "Show off your anime passion with this premium cotton tee featuring iconic hero designs.",
    vendor: "Geek Creations",
    product_type: "T-Shirt",
    tags: ["anime", "hero", "classic", "cotton"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages(
      "/img/blank_isolated_white_and_black_t_shirt_front_view.jpg",
      "Anime Hero Classic Tee"
    ),
    variants: createVariants("prod-1", 5500),
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-2",
    shopify_product_id: 1002,
    title: "Tech Geek Premium Hoodie",
    handle: "tech-geek-premium-hoodie",
    description:
      "Stay warm and stylish with this tech-inspired hoodie featuring cutting-edge designs.",
    vendor: "Geek Creations",
    product_type: "Hoodie",
    tags: ["tech", "hoodie", "premium", "warm"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages("/img/hoodie-2.jpg", "Tech Geek Premium Hoodie"),
    variants: createVariants("prod-2", 12000, ["S", "M", "L", "XL", "XXL"]),
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-3",
    shopify_product_id: 1003,
    title: "Gaming Legend Tee",
    handle: "gaming-legend-tee",
    description:
      "Represent your gaming passion with this legendary design on premium fabric.",
    vendor: "Geek Creations",
    product_type: "T-Shirt",
    tags: ["gaming", "legend", "esports", "cotton"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages("/img/tshirt.jpg", "Gaming Legend Tee"),
    variants: createVariants("prod-3", 6000),
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-4",
    shopify_product_id: 1004,
    title: "Nigerian Pride Phone Case",
    handle: "nigerian-pride-phone-case",
    description: "Protect your phone with style and show your Nigerian pride.",
    vendor: "Geek Creations",
    product_type: "Phone Case",
    tags: ["phone-case", "nigerian", "pride", "protection"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages("/img/phone-case.jpg", "Nigerian Pride Phone Case"),
    variants: createVariants(
      "prod-4",
      4500,
      ["iPhone 13", "iPhone 14", "Samsung S21", "Samsung S22"],
      ["Black", "Clear", "Red"]
    ),
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-5",
    shopify_product_id: 1005,
    title: "Afro-Futurism Mug",
    handle: "afro-futurism-mug",
    description:
      "Start your day with inspiration from this beautifully designed Afro-futurism mug.",
    vendor: "Geek Creations",
    product_type: "Mug",
    tags: ["mug", "afro-futurism", "inspiration", "ceramic"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages("/img/mug.jpg", "Afro-Futurism Mug"),
    variants: createVariants(
      "prod-5",
      3500,
      ["11oz", "15oz"],
      ["White", "Black"]
    ),
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-6",
    shopify_product_id: 1006,
    title: "Designer Tote Bag",
    handle: "designer-tote-bag",
    description:
      "Carry your essentials in style with this spacious and durable tote bag.",
    vendor: "Geek Creations",
    product_type: "Tote Bag",
    tags: ["tote", "bag", "designer", "durable"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages("/img/tote-bag.jpg", "Designer Tote Bag"),
    variants: createVariants(
      "prod-6",
      8000,
      ["Standard"],
      ["Black", "White", "Navy", "Red"]
    ),
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-7",
    shopify_product_id: 1007,
    title: "Cyberpunk Street Hoodie",
    handle: "cyberpunk-street-hoodie",
    description:
      "Embrace the future with this cyberpunk-inspired hoodie featuring neon aesthetics.",
    vendor: "Geek Creations",
    product_type: "Hoodie",
    tags: ["cyberpunk", "hoodie", "neon", "futuristic"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages("/img/hoodie.jpg", "Cyberpunk Street Hoodie"),
    variants: createVariants("prod-7", 13000, ["S", "M", "L", "XL"]),
    created_at: now,
    updated_at: now,
  },
  {
    id: "prod-8",
    shopify_product_id: 1008,
    title: "Minimalist Classic Tee",
    handle: "minimalist-classic-tee",
    description:
      "Simple, elegant, and timeless. The perfect everyday tee with a minimalist design.",
    vendor: "Geek Creations",
    product_type: "T-Shirt",
    tags: ["minimalist", "classic", "simple", "cotton"],
    status: "active",
    fulfillment_provider: "printful",
    images: createImages("/img/tote.jpg", "Minimalist Classic Tee"),
    variants: createVariants("prod-8", 5000),
    created_at: now,
    updated_at: now,
  },
];

// Mock Collections
export const mockCollections: Collection[] = [
  {
    id: "coll-1",
    shopify_collection_id: 2001,
    title: "Anime Collection",
    handle: "anime",
    description:
      "Celebrate your favorite anime characters and moments with our exclusive anime-themed collection. From classic heroes to modern legends, find the perfect design to express your passion.",
    image_url: "/img/blank_isolated_white_and_black_t_shirt_front_view.jpg",
    product_count: 2,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "coll-2",
    shopify_collection_id: 2002,
    title: "Tech & Gaming",
    handle: "tech-gaming",
    description:
      "For the tech enthusiasts and gaming legends. Premium quality products featuring cutting-edge designs and gaming culture.",
    image_url: "/img/hoodie-2.jpg",
    product_count: 3,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "coll-3",
    shopify_collection_id: 2003,
    title: "Nigerian Pride",
    handle: "nigerian-pride",
    description:
      "Show your love for Nigeria with our exclusive Nigerian Pride collection. Beautiful designs celebrating our culture and heritage.",
    image_url: "/img/phone-case.jpg",
    product_count: 2,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "coll-4",
    shopify_collection_id: 2004,
    title: "Accessories",
    handle: "accessories",
    description:
      "Complete your look with our range of premium accessories. From phone cases to mugs and bags.",
    image_url: "/img/mug.jpg",
    product_count: 3,
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "coll-5",
    shopify_collection_id: 2005,
    title: "All Products",
    handle: "all",
    description:
      "Browse our complete catalog of geek culture products. Something for everyone!",
    image_url: "/img/tote-bag.jpg",
    product_count: 8,
    published: true,
    created_at: now,
    updated_at: now,
  },
];

// Collection to Products mapping
export const collectionProductMap: Record<string, string[]> = {
  anime: ["anime-hero-classic-tee", "gaming-legend-tee"],
  "tech-gaming": [
    "tech-geek-premium-hoodie",
    "gaming-legend-tee",
    "cyberpunk-street-hoodie",
  ],
  "nigerian-pride": ["nigerian-pride-phone-case", "afro-futurism-mug"],
  accessories: [
    "nigerian-pride-phone-case",
    "afro-futurism-mug",
    "designer-tote-bag",
  ],
  all: [
    "anime-hero-classic-tee",
    "tech-geek-premium-hoodie",
    "gaming-legend-tee",
    "nigerian-pride-phone-case",
    "afro-futurism-mug",
    "designer-tote-bag",
    "cyberpunk-street-hoodie",
    "minimalist-classic-tee",
  ],
};

// Helper function to get products for a collection
export function getProductsForCollection(handle: string): Product[] {
  const productIds = collectionProductMap[handle] || [];
  return mockProducts.filter((p) => productIds.includes(p.id));
}

// Helper function to get collection by handle
export function getCollectionByHandle(handle: string): Collection | undefined {
  return mockCollections.find((c) => c.handle === handle);
}

// Helper function to get all collections
export function getAllCollections(): Collection[] {
  return mockCollections;
}
