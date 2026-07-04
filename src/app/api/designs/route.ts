import { NextResponse } from "next/server";
import { db, designs } from "@/lib/db";
import { and, desc, eq } from "drizzle-orm";
import { mockDesigns } from "@/lib/mock-data/collections";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
    const offset = (page - 1) * limit;
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    let data: any[] = [];
    let databaseActive = true;

    try {
      const conditions = [eq(designs.isActive, true)];
      if (category && category.toLowerCase() !== "all") {
        conditions.push(eq(designs.category, category));
      }

      data = await db
        .select()
        .from(designs)
        .where(and(...conditions))
        .orderBy(desc(designs.sortOrder), desc(designs.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (dbError) {
      console.warn("[designs:get] Database query failed, falling back to mock designs:", dbError);
      databaseActive = false;
      data = [];
    }

    // Fallback to mock data if database is not active or empty
    if (!databaseActive || data.length === 0) {
      let mockFiltered = mockDesigns;
      if (category && category.toLowerCase() !== "all") {
        mockFiltered = mockDesigns.filter(
          (d) => d.category.toLowerCase() === category.toLowerCase()
        );
      }
      data = mockFiltered;
    }

    const filtered = q
      ? data.filter((d) =>
          `${d.title ?? ""} ${d.description ?? ""} ${(d.tags ?? []).join(" ")}`
            .toLowerCase()
            .includes(q.toLowerCase())
        )
      : data;

    return NextResponse.json({
      data: filtered.map((d: any) => ({
        id: d.id,
        title: d.title,
        thumbnailUrl: d.thumbnailUrl || d.imageUrl || "/placeholder-design.jpg",
        imageUrl: d.imageUrl || "/placeholder-design.jpg",
        category: d.category,
        tags: d.tags ?? [],
        slug: d.slug || d.id,
        isActive: d.isActive ?? true,
      })),
      meta: { page, limit, count: filtered.length },
    });
  } catch (error) {
    console.error("[designs:get] General API error:", error);
    return NextResponse.json({
      data: mockDesigns.map((d) => ({
        id: d.id,
        title: d.title,
        thumbnailUrl: d.thumbnailUrl || d.imageUrl || "/placeholder-design.jpg",
        imageUrl: d.imageUrl || "/placeholder-design.jpg",
        category: d.category,
        tags: d.tags ?? [],
        slug: d.slug || d.id,
        isActive: d.isActive ?? true,
      })),
      meta: { page: 1, limit: 20, count: mockDesigns.length },
    });
  }
}

