import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { invalidateSiteSettingsCache } from "@/lib/site-settings-server";

export const dynamic = "force-dynamic";

// GET all settings (including non-public ones for admin)
export async function GET() {
  try {
    const allSettings = await db
      .select({
        id: siteSettings.id,
        key: siteSettings.key,
        value: siteSettings.value,
        type: siteSettings.type,
        category: siteSettings.category,
        description: siteSettings.description,
        isPublic: siteSettings.isPublic,
      })
      .from(siteSettings);

    // Transform array into object
    const settingsObject: Record<string, string | number | boolean | object> =
      {};
    const settingsMeta: Record<
      string,
      {
        type: string | null;
        category: string | null;
        description: string | null;
        isPublic: boolean | null;
      }
    > = {};

    for (const setting of allSettings) {
      let value: string | number | boolean | object = setting.value || "";

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
      settingsMeta[setting.key] = {
        type: setting.type,
        category: setting.category,
        description: setting.description,
        isPublic: setting.isPublic,
      };
    }

    return NextResponse.json({
      success: true,
      settings: settingsObject,
      meta: settingsMeta,
    });
  } catch (error) {
    console.error("Failed to fetch admin settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch settings",
      },
      { status: 500 },
    );
  }
}

// PATCH - Update multiple settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const updates = body.settings || body;

    const updatedSettings: Record<string, string | number | boolean | object> =
      {};

    for (const [key, value] of Object.entries(updates)) {
      // Check if setting exists
      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);

      let stringValue: string;
      let type = "string";

      if (typeof value === "boolean") {
        stringValue = value.toString();
        type = "boolean";
      } else if (typeof value === "number") {
        stringValue = value.toString();
        type = "number";
      } else if (typeof value === "object") {
        stringValue = JSON.stringify(value);
        type = "json";
      } else {
        stringValue = String(value);
        type = "string";
      }

      if (existing.length > 0) {
        // Update existing
        await db
          .update(siteSettings)
          .set({
            value: stringValue,
            type: type,
            updatedAt: new Date(),
          })
          .where(eq(siteSettings.key, key));
      } else {
        // Insert new
        await db.insert(siteSettings).values({
          key,
          value: stringValue,
          type: type,
          category: "general",
          isPublic: true,
        });
      }

      updatedSettings[key] = value as string | number | boolean | object;
    }

    // Invalidate cache so changes are reflected immediately
    invalidateSiteSettingsCache();

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update settings",
      },
      { status: 500 },
    );
  }
}

// POST - Create or update a single setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, category, description, isPublic } = body;

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          error: "Setting key is required",
        },
        { status: 400 },
      );
    }

    let stringValue: string;
    let type = "string";

    if (typeof value === "boolean") {
      stringValue = value.toString();
      type = "boolean";
    } else if (typeof value === "number") {
      stringValue = value.toString();
      type = "number";
    } else if (typeof value === "object") {
      stringValue = JSON.stringify(value);
      type = "json";
    } else {
      stringValue = String(value);
      type = "string";
    }

    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({
          value: stringValue,
          type: type,
          category: category || existing[0].category,
          description: description || existing[0].description,
          isPublic: isPublic !== undefined ? isPublic : existing[0].isPublic,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({
        key,
        value: stringValue,
        type: type,
        category: category || "general",
        description: description || null,
        isPublic: isPublic !== undefined ? isPublic : true,
      });
    }

    // Invalidate cache so changes are reflected immediately
    invalidateSiteSettingsCache();

    return NextResponse.json({
      success: true,
      message: "Setting saved successfully",
    });
  } catch (error) {
    console.error("Failed to save setting:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save setting",
      },
      { status: 500 },
    );
  }
}
