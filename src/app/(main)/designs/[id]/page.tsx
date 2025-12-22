import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  MockupCarousel,
  type MockupImage,
} from "@/components/ui/mockup-carousel";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Types
type Design = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  category: string | null;
  tags: string[] | null;
};

type ProductOption = {
  label: string;
  handle: string;
  price: string;
  mockupImages?: string[]; // Multiple mockup views (front, back, side, etc.)
  mockupImage?: string; // Fallback for single image
};

type ShopifyProduct = {
  handle: string;
  product_type: string;
  variants?: Array<{ price: number }>;
};

// Constants
const DEFAULT_PRODUCT_TYPES: ProductOption[] = [
  {
    label: "T-Shirt",
    handle: "t-shirt",
    price: "₦8,000",
    mockupImages: [
      "/img/blank_isolated_white_and_black_t_shirt_front_view.png",
      "/img/blank_isolated_white_and_black_t_shirt_front_view.png", // Can add back view later
    ],
  },
  {
    label: "Hoodie",
    handle: "hoodie",
    price: "₦18,000",
    mockupImages: [
      "/img/hoodie-2.jpg",
      "/img/hoodie-2.jpg", // Can add different views later
    ],
  },
  {
    label: "Mug",
    handle: "mug",
    price: "₦5,000",
    mockupImages: [
      "/img/mug.jpg",
      "/img/mug.jpg", // Can add different angles later
    ],
  },
];

const MAX_PRODUCT_OPTIONS = 6;
const PRODUCT_FETCH_LIMIT = 20;
const RELATED_DESIGNS_LIMIT = 6;

// API Functions
async function getDesign(id: string): Promise<Design | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/designs/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data as Design;
  } catch (error) {
    console.error("Failed to fetch design:", error);
    return null;
  }
}

async function getProducts(): Promise<ProductOption[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/products?limit=${PRODUCT_FETCH_LIMIT}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return [];

    const json = await res.json();
    const products: ShopifyProduct[] = json.products || [];

    // Extract unique product types
    const productTypeMap = new Map<string, ProductOption>();

    products.forEach((product) => {
      if (
        product.handle &&
        product.product_type &&
        !productTypeMap.has(product.product_type)
      ) {
        const price = product.variants?.[0]?.price || 0;
        // Map product types to mockup images
        const mockupMap: Record<string, string> = {
          "T-Shirt":
            "/img/blank_isolated_white_and_black_t_shirt_front_view.png",
          Hoodie: "/img/hoodie-2.jpg",
          Mug: "/img/mug.jpg",
        };

        const mockupImage = mockupMap[product.product_type];
        productTypeMap.set(product.product_type, {
          label: product.product_type,
          handle: product.handle,
          price: `₦${price.toLocaleString()}`,
          mockupImages: mockupImage ? [mockupImage, mockupImage] : undefined, // Use array for carousel
        });
      }
    });

    return Array.from(productTypeMap.values()).slice(0, MAX_PRODUCT_OPTIONS);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getRelatedDesigns(
  currentDesignId: string,
  category: string | null
): Promise<Design[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("limit", RELATED_DESIGNS_LIMIT.toString());

    const res = await fetch(`${baseUrl}/api/designs?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json();
    const designs: Design[] = json.data || [];

    // Filter out current design
    return designs
      .filter((d) => d.id !== currentDesignId)
      .slice(0, RELATED_DESIGNS_LIMIT);
  } catch (error) {
    console.error("Failed to fetch related designs:", error);
    return [];
  }
}

// Components
function NotFoundState() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h3 className="text-4xl font-bold">Design Not Found</h3>
          <p className="text-lg text-muted-foreground">
            The design you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Link
          href="/designs"
          className={buttonVariants({
            className:
              "inline-block px-6 py-3 rounded-lg hover:opacity-90 transition-opacity",
          })}
        >
          Browse All Designs
        </Link>
      </div>
    </main>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="outline"
      className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent"
    >
      {category}
    </Badge>
  );
}

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent">
      #{tag}
    </span>
  );
}

function ProductCard({
  product,
  designId,
  designImageUrl,
}: {
  product: ProductOption;
  designId: string;
  designImageUrl: string;
}) {
  // Create mockup images array for carousel
  const mockupImages: MockupImage[] = (
    product.mockupImages || (product.mockupImage ? [product.mockupImage] : [])
  ).map((src, index) => ({
    id: `${product.handle}-${index}`,
    src,
    alt: `${product.label} mockup ${index + 1}`,
  }));

  return (
    <Link href={`/products/${product.handle}?design=${designId}`}>
      <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer h-full flex flex-col">
        {/* Mockup Carousel */}
        {mockupImages.length > 0 && (
          <div className="relative flex-1 min-h-[200px] sm:min-h-[250px] lg:min-h-[280px]">
            <MockupCarousel
              images={mockupImages}
              title={`${product.label} with design`}
              autoScroll={true}
              autoScrollInterval={4000}
              showThumbnails={mockupImages.length > 1}
              showZoom={false}
              aspectRatio="square"
              className="h-full"
            />
            {/* Design Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="relative w-3/4 h-3/4 opacity-90">
                <Image
                  fill
                  src={designImageUrl}
                  alt="Design preview"
                  className="object-contain mix-blend-multiply"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary group-hover:underline">
            {product.label}
          </h3>
          <div className="text-lg font-bold text-primary">{product.price}</div>
          <p className="text-xs text-muted-foreground">
            Printful/Printify fulfillment
          </p>
        </div>
      </Card>
    </Link>
  );
}

function DesignImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border bg-card">
      <div className="relative aspect-4/3 w-full">
        <Image
          fill
          src={imageUrl}
          alt={title}
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

function DesignHeader({ design }: { design: Design }) {
  return (
    <div className="space-y-4">
      {design.category && <CategoryBadge category={design.category} />}

      <h3 className="text-4xl lg:text-5xl font-black leading-tight">
        {design.title}
      </h3>

      <p className="text-lg leading-relaxed text-muted-foreground">
        {design.description ||
          "Premium print-ready artwork for tees, hoodies, and mugs."}
      </p>

      {design.tags && design.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {design.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductOptionsSection({
  products,
  designId,
  designImageUrl,
}: {
  products: ProductOption[];
  designId: string;
  designImageUrl: string;
}) {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-xl font-bold text-primary">Choose a product</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.handle}
            product={product}
            designId={designId}
            designImageUrl={designImageUrl}
          />
        ))}
      </div>
    </div>
  );
}

function RelatedDesignsSection({ designs }: { designs: Design[] }) {
  if (designs.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Related Designs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Link
              key={design.id}
              href={`/designs/${design.id}`}
              className="group rounded-2xl overflow-hidden border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-4/5 overflow-hidden">
                <Image
                  width={400}
                  height={500}
                  src={design.thumbnailUrl || design.imageUrl}
                  alt={design.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-2">
                {design.category && (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-secondary/20 text-primary">
                    {design.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-primary group-hover:underline">
                  {design.title}
                </h3>
                {design.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {design.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Component
export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [design, productOptions] = await Promise.all([
    getDesign(id),
    getProducts(),
  ]);

  if (!design) {
    return <NotFoundState />;
  }

  // Fetch related designs now that we have the design category
  const related = await getRelatedDesigns(design.id, design.category);

  const displayProducts =
    productOptions.length > 0 ? productOptions : DEFAULT_PRODUCT_TYPES;

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <Breadcrumb
          className="my-10"
          items={[
            { label: "Home", href: "/" },
            { label: "Designs", href: "/designs" },
            { label: design.title, href: `/designs/${design.id}` },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <DesignImage imageUrl={design.imageUrl} title={design.title} />

          <div className="space-y-6">
            <DesignHeader design={design} />
            <ProductOptionsSection
              products={displayProducts}
              designId={design.id}
              designImageUrl={design.imageUrl}
            />
          </div>
        </div>

        <RelatedDesignsSection designs={related} />
      </section>
    </main>
  );
}
