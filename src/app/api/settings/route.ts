import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allSettings = await db
      .select({
        key: siteSettings.key,
        value: siteSettings.value,
        type: siteSettings.type,
      })
      .from(siteSettings)
      .where(eq(siteSettings.isPublic, true));

    // Transform array of settings into object
    const settingsObject: Record<string, string | number | boolean | object> =
      {};

    for (const setting of allSettings) {
      let value: string | number | boolean | object = setting.value || "";

      // Parse value based on type
      if (setting.type === "number") {
        value = parseFloat(setting.value || "0");
      } else if (setting.type === "boolean") {
        value = setting.value === "true";
      } else if (setting.type === "json") {
        try {
          value = JSON.parse(setting.value || "{}");
        } catch {
          value = {};
        }
      }

      settingsObject[setting.key] = value;
    }

    return NextResponse.json({
      success: true,
      settings: settingsObject,
    });
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch site settings",
        settings: {},
      },
      { status: 500 }
    );
  }
}
