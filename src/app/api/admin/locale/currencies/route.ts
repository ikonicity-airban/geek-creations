import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currencies } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET all currencies (including inactive ones for admin)
export async function GET(request: NextRequest) {
  try {
    const allCurrencies = await db
      .select({
        id: currencies.id,
        code: currencies.code,
        name: currencies.name,
        symbol: currencies.symbol,
        symbolPosition: currencies.symbolPosition,
        decimalPlaces: currencies.decimalPlaces,
        isActive: currencies.isActive,
        isDefault: currencies.isDefault,
        sortOrder: currencies.sortOrder,
        createdAt: currencies.createdAt,
        updatedAt: currencies.updatedAt,
      })
      .from(currencies)
      .orderBy(asc(currencies.sortOrder), asc(currencies.code));

    return NextResponse.json({
      success: true,
      currencies: allCurrencies,
    });
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch currencies",
      },
      { status: 500 }
    );
  }
}

// POST - Create new currency
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      name,
      symbol,
      symbolPosition,
      decimalPlaces,
      isActive,
      isDefault,
      sortOrder,
    } = body;

    if (!code || !name || !symbol) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: code, name, symbol",
        },
        { status: 400 }
      );
    }

    // Check if currency already exists
    const existing = await db
      .select()
      .from(currencies)
      .where(eq(currencies.code, code.toUpperCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Currency with this code already exists",
        },
        { status: 409 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await db
        .update(currencies)
        .set({ isDefault: false })
        .where(eq(currencies.isDefault, true));
    }

    // Insert new currency
    const [newCurrency] = await db
      .insert(currencies)
      .values({
        code: code.toUpperCase(),
        name,
        symbol,
        symbolPosition: symbolPosition || "before",
        decimalPlaces: decimalPlaces || 2,
        isActive: isActive !== undefined ? isActive : true,
        isDefault: isDefault || false,
        sortOrder: sortOrder || 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      currency: newCurrency,
      message: "Currency created successfully",
    });
  } catch (error) {
    console.error("Failed to create currency:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create currency",
      },
      { status: 500 }
    );
  }
}
