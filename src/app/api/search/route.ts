import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, designs, collections } from "@/lib/db/schema";
import { ilike, or, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type"); // products, designs, collections, or all
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        message: "Query too short",
      });
    }

    const searchTerm = `%${query.trim()}%`;
    const results: Array<{
      id: string;
      type: "product" | "design" | "collection";
      title: string;
      description?: string | null;
      image?: string | null;
      href: string;
    }> = [];

    // Search products
    if (!type || type === "all" || type === "products") {
      const productResults = await db
        .select({
          id: products.id,
          title: products.title,
          description: products.description,
          image: products.featuredImage,
          handle: products.handle,
          type: sql<string>`'product'`,
        })
        .from(products)
        .where(
          or(
            ilike(products.title, searchTerm),
            ilike(products.description, searchTerm),
            ilike(products.tags, searchTerm),
          ),
        )
        .limit(limit);

      results.push(
        ...productResults.map((p: (typeof productResults)[number]) => ({
          id: p.id,
          type: "product" as const,
          title: p.title,
          description: p.description?.substring(0, 100),
          image: p.image,
          href: `/products/${p.handle || p.id}`,
        })),
      );
    }

    // Search designs
    if (!type || type === "all" || type === "designs") {
      const designResults = await db
        .select({
          id: designs.id,
          title: designs.title,
          description: designs.description,
          image: designs.thumbnailUrl,
          category: designs.category,
          type: sql<string>`'design'`,
        })
        .from(designs)
        .where(
          or(
            ilike(designs.title, searchTerm),
            ilike(designs.description, searchTerm),
            ilike(designs.category, searchTerm),
            ilike(designs.tags, searchTerm),
          ),
        )
        .limit(limit);

      results.push(
        ...designResults.map((d: (typeof designResults)[number]) => ({
          id: d.id,
          type: "design" as const,
          title: d.title,
          description: d.description?.substring(0, 100),
          image: d.image,
          href: `/designs/${d.id}`,
        })),
      );
    }

    // Search collections
    if (!type || type === "all" || type === "collections") {
      const collectionResults = await db
        .select({
          id: collections.id,
          title: collections.title,
          description: collections.description,
          image: collections.imageUrl,
          handle: collections.handle,
          type: sql<string>`'collection'`,
        })
        .from(collections)
        .where(
          or(
            ilike(collections.title, searchTerm),
            ilike(collections.description, searchTerm),
          ),
        )
        .limit(limit);

      results.push(
        ...collectionResults.map((c: (typeof collectionResults)[number]) => ({
          id: c.id,
          type: "collection" as const,
          title: c.title,
          description: c.description?.substring(0, 100),
          image: c.image,
          href: `/collections/${c.handle || c.id}`,
        })),
      );
    }

    // Sort by relevance (simple: prioritize title matches)
    results.sort((a, b) => {
      const aInTitle = a.title.toLowerCase().includes(query.toLowerCase());
      const bInTitle = b.title.toLowerCase().includes(query.toLowerCase());
      if (aInTitle && !bInTitle) return -1;
      if (!aInTitle && bInTitle) return 1;
      return 0;
    });

    return NextResponse.json({
      success: true,
      query,
      results: results.slice(0, limit),
      total: results.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
        results: [],
      },
      { status: 500 },
    );
  }
}
