import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { languages } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const activeLanguages = await db
      .select({
        code: languages.code,
        name: languages.name,
        nativeName: languages.nativeName,
        flag: languages.flag,
        isRTL: languages.isRTL,
        isDefault: languages.isDefault,
        sortOrder: languages.sortOrder,
      })
      .from(languages)
      .where(eq(languages.isActive, true))
      .orderBy(asc(languages.sortOrder), asc(languages.code));

    return NextResponse.json({
      success: true,
      languages: activeLanguages,
    });
  } catch (error) {
    console.error("Failed to fetch languages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch languages",
        languages: [
          {
            code: "en",
            name: "English",
            nativeName: "English",
            flag: "🇬🇧",
            isRTL: false,
            isDefault: true,
            sortOrder: 0,
          },
        ],
      },
      { status: 500 }
    );
  }
}
