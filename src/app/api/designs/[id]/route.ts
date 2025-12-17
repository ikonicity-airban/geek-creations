import { NextRequest, NextResponse } from "next/server";
import { db, designs } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [design] = await db
      .select()
      .from(designs)
      .where(eq(designs.id, id));

    if (!design) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: design });
  } catch (error) {
    console.error("[designs:id:get]", error);
    return NextResponse.json(
      { error: "Failed to load design" },
      { status: 500 }
    );
  }
}

