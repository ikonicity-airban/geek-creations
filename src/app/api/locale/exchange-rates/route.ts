import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exchangeRates, currencies } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Fetch all active exchange rates
    const rates = await db
      .select({
        baseCurrency: exchangeRates.baseCurrency,
        targetCurrency: exchangeRates.targetCurrency,
        rate: exchangeRates.rate,
        lastFetchedAt: exchangeRates.lastFetchedAt,
        updatedAt: exchangeRates.updatedAt,
      })
      .from(exchangeRates);

    // Organize rates in a nested object structure for easy lookup
    // { "NGN": { "USD": 0.0012, "EUR": 0.0011 }, "USD": { "NGN": 833.33, "EUR": 0.92 } }
    const ratesMap: Record<string, Record<string, number>> = {};

    for (const rate of rates) {
      if (!ratesMap[rate.baseCurrency]) {
        ratesMap[rate.baseCurrency] = {};
      }
      ratesMap[rate.baseCurrency][rate.targetCurrency] = parseFloat(
        rate.rate as string
      );
    }

    return NextResponse.json({
      success: true,
      rates: ratesMap,
      lastUpdated: rates[0]?.updatedAt || new Date(),
    });
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch exchange rates",
        rates: {},
      },
      { status: 500 }
    );
  }
}

// POST endpoint to manually update exchange rates (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { baseCurrency, targetCurrency, rate } = body;

    if (!baseCurrency || !targetCurrency || !rate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: baseCurrency, targetCurrency, rate",
        },
        { status: 400 }
      );
    }

    // Check if rate already exists
    const existingRate = await db
      .select()
      .from(exchangeRates)
      .where(
        and(
          eq(exchangeRates.baseCurrency, baseCurrency),
          eq(exchangeRates.targetCurrency, targetCurrency)
        )
      )
      .limit(1);

    if (existingRate.length > 0) {
      // Update existing rate
      await db
        .update(exchangeRates)
        .set({
          rate: rate.toString(),
          source: "manual",
          lastFetchedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(exchangeRates.baseCurrency, baseCurrency),
            eq(exchangeRates.targetCurrency, targetCurrency)
          )
        );
    } else {
      // Insert new rate
      await db.insert(exchangeRates).values({
        baseCurrency,
        targetCurrency,
        rate: rate.toString(),
        source: "manual",
        lastFetchedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Exchange rate updated successfully",
    });
  } catch (error) {
    console.error("Failed to update exchange rate:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update exchange rate",
      },
      { status: 500 }
    );
  }
}
