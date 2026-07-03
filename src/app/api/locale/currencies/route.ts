import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currencies } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const activeCurrencies = await db
      .select({
        code: currencies.code,
        name: currencies.name,
        symbol: currencies.symbol,
        symbolPosition: currencies.symbolPosition,
        decimalPlaces: currencies.decimalPlaces,
        isDefault: currencies.isDefault,
        sortOrder: currencies.sortOrder,
      })
      .from(currencies)
      .where(eq(currencies.isActive, true))
      .orderBy(asc(currencies.sortOrder), asc(currencies.code));

    return NextResponse.json({
      success: true,
      currencies: activeCurrencies,
    });
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch currencies",
        currencies: [
          {
            code: "NGN",
            name: "Nigerian Naira",
            symbol: "₦",
            symbolPosition: "before",
            decimalPlaces: 2,
            isDefault: true,
            sortOrder: 0,
          },
        ],
      },
      { status: 500 }
    );
  }
}
