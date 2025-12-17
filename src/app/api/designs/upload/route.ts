import { NextResponse } from "next/server";
import { db, designs } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, thumbnailUrl, category, tags, sortOrder } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "title and imageUrl are required" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(designs)
      .values({
        title,
        description,
        imageUrl,
        thumbnailUrl,
        category,
        tags,
        sortOrder,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("[designs:upload:post]", error);
    return NextResponse.json(
      { error: "Failed to upload design" },
      { status: 500 }
    );
  }
}

