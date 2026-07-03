import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exchangeRates } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const amountStr = searchParams.get("amount");

    if (!from || !to || !amountStr) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: from, to, amount",
        },
        { status: 400 }
      );
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount parameter",
        },
        { status: 400 }
      );
    }

    // If currencies are the same, no conversion needed
    if (from === to) {
      return NextResponse.json({
        success: true,
        from,
        to,
        amount,
        converted: amount,
        rate: 1,
      });
    }

    // Fetch exchange rate from database
    const rate = await db
      .select({
        rate: exchangeRates.rate,
        lastFetchedAt: exchangeRates.lastFetchedAt,
      })
      .from(exchangeRates)
      .where(
        and(
          eq(exchangeRates.baseCurrency, from),
          eq(exchangeRates.targetCurrency, to)
        )
      )
      .limit(1);

    if (rate.length === 0) {
      // Try reverse rate (e.g., if USD->NGN doesn't exist, try NGN->USD and invert)
      const reverseRate = await db
        .select({
          rate: exchangeRates.rate,
          lastFetchedAt: exchangeRates.lastFetchedAt,
        })
        .from(exchangeRates)
        .where(
          and(
            eq(exchangeRates.baseCurrency, to),
            eq(exchangeRates.targetCurrency, from)
          )
        )
        .limit(1);

      if (reverseRate.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Exchange rate not found for ${from} to ${to}`,
            from,
            to,
            amount,
          },
          { status: 404 }
        );
      }

      // Use inverted rate
      const invertedRate = 1 / parseFloat(reverseRate[0].rate as string);
      const converted = amount * invertedRate;

      return NextResponse.json({
        success: true,
        from,
        to,
        amount,
        converted: parseFloat(converted.toFixed(10)),
        rate: parseFloat(invertedRate.toFixed(10)),
        lastFetchedAt: reverseRate[0].lastFetchedAt,
        inverted: true,
      });
    }

    const exchangeRate = parseFloat(rate[0].rate as string);
    const converted = amount * exchangeRate;

    return NextResponse.json({
      success: true,
      from,
      to,
      amount,
      converted: parseFloat(converted.toFixed(10)),
      rate: exchangeRate,
      lastFetchedAt: rate[0].lastFetchedAt,
    });
  } catch (error) {
    console.error("Currency conversion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Currency conversion failed",
      },
      { status: 500 }
    );
  }
}
