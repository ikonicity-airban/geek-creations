import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currencies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET specific currency
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    const currency = await db
      .select()
      .from(currencies)
      .where(eq(currencies.code, code.toUpperCase()))
      .limit(1);

    if (currency.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Currency not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      currency: currency[0],
    });
  } catch (error) {
    console.error("Failed to fetch currency:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch currency",
      },
      { status: 500 },
    );
  }
}

// PATCH - Update currency
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;
    const body = await request.json();

    // Check if currency exists
    const existing = await db
      .select()
      .from(currencies)
      .where(eq(currencies.code, code.toUpperCase()))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Currency not found",
        },
        { status: 404 },
      );
    }

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await db
        .update(currencies)
        .set({ isDefault: false })
        .where(eq(currencies.isDefault, true));
    }

    // Update currency
    const updateData: Partial<typeof currencies.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.symbol !== undefined) updateData.symbol = body.symbol;
    if (body.symbolPosition !== undefined)
      updateData.symbolPosition = body.symbolPosition;
    if (body.decimalPlaces !== undefined)
      updateData.decimalPlaces = body.decimalPlaces;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.isDefault !== undefined) updateData.isDefault = body.isDefault;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

    const [updated] = await db
      .update(currencies)
      .set(updateData)
      .where(eq(currencies.code, code.toUpperCase()))
      .returning();

    return NextResponse.json({
      success: true,
      currency: updated,
      message: "Currency updated successfully",
    });
  } catch (error) {
    console.error("Failed to update currency:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update currency",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete currency
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    // Check if currency exists
    const existing = await db
      .select()
      .from(currencies)
      .where(eq(currencies.code, code.toUpperCase()))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Currency not found",
        },
        { status: 404 },
      );
    }

    // Don't allow deleting the default currency
    if (existing[0].isDefault) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete the default currency",
        },
        { status: 400 },
      );
    }

    // Delete currency
    await db.delete(currencies).where(eq(currencies.code, code.toUpperCase()));

    return NextResponse.json({
      success: true,
      message: "Currency deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete currency:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete currency",
      },
      { status: 500 },
    );
  }
}
