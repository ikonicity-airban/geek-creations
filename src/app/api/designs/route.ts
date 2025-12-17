import { NextResponse } from "next/server";
import { db, designs } from "@/lib/db";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
    const offset = (page - 1) * limit;
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const baseQuery = db
      .select()
      .from(designs)
      .where(eq(designs.isActive, true));

    const data = await (category
      ? baseQuery.where(eq(designs.category, category))
      : baseQuery
    )
      .orderBy(desc(designs.sortOrder), desc(designs.createdAt))
      .limit(limit)
      .offset(offset);

    const filtered = q
      ? data.filter((d) =>
          `${d.title} ${d.description ?? ""} ${(d.tags ?? []).join(" ")}`
            .toLowerCase()
            .includes(q.toLowerCase())
        )
      : data;

    return NextResponse.json({
      data: filtered,
      meta: { page, limit, count: filtered.length },
    });
  } catch (error) {
    console.error("[designs:get]", error);
    return NextResponse.json(
      { error: "Failed to load designs" },
      { status: 500 }
    );
  }
}

